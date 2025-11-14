/**
 * @fileoverview Cache Invalidation Service
 * @module infrastructure/cache/invalidation
 * @description Handles cache invalidation strategies including tag-based, pattern-based, and cascade invalidation
 *
 * Responsibilities:
 * - Tag-based cache invalidation
 * - Prefix-based cache invalidation
 * - Pattern-based cache invalidation (wildcard support)
 * - Cascade invalidation (delete key and related keys)
 * - Tag index management for efficient tag lookups
 */

import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CacheConfigService } from './cache.config';
import { CacheStorageService } from './cache-storage.service';
import type { InvalidationPattern } from './cache.interfaces';
import { CacheEvent } from './cache.interfaces';

import { BaseService } from '@/common/base';
/**
 * Service responsible for cache invalidation operations
 */
@Injectable()
export class CacheInvalidationService extends BaseService {
  private tagIndex: Map<string, Set<string>> = new Map();

  constructor(
    private readonly cacheConfig: CacheConfigService,
    private readonly storageService: CacheStorageService,
    private readonly eventEmitter: EventEmitter2,
  ) {
    super("CacheInvalidationService");}

  /**
   * Index tags for a cache key for efficient tag-based invalidation
   *
   * @param key - Full cache key
   * @param tags - Array of tags to associate with the key
   */
  indexTags(key: string, tags: string[]): void {
    for (const tag of tags) {
      if (!this.tagIndex.has(tag)) {
        this.tagIndex.set(tag, new Set());
      }
      this.tagIndex.get(tag).add(key);
    }
  }

  /**
   * Remove key from tag index
   *
   * @param key - Full cache key to remove from all tag associations
   */
  removeFromTagIndex(key: string): void {
    for (const [tag, keys] of this.tagIndex.entries()) {
      keys.delete(key);
      if (keys.size === 0) {
        this.tagIndex.delete(tag);
      }
    }
  }

  /**
   * Clear all tag index entries
   */
  clearTagIndex(): void {
    this.tagIndex.clear();
  }

  /**
   * Invalidate cache by pattern
   *
   * @param pattern - Invalidation pattern
   * @param deleteCallback - Callback to delete individual keys
   * @returns Number of keys invalidated
   */
  async invalidate(
    pattern: InvalidationPattern,
    deleteCallback: (key: string) => Promise<boolean>,
  ): Promise<number> {
    let count = 0;

    try {
      switch (pattern.type) {
        case 'key':
          const deleted = await deleteCallback(pattern.value);
          count = deleted ? 1 : 0;
          break;

        case 'prefix':
          count = await this.invalidateByPrefix(pattern.value, deleteCallback);
          break;

        case 'tag':
          count = await this.invalidateByTag(pattern.value, deleteCallback);
          break;

        case 'pattern':
          count = await this.invalidateByPattern(pattern.value, deleteCallback);
          break;

        case 'cascade':
          count = await this.invalidateCascade(pattern.value, deleteCallback);
          break;

        default:
          this.logWarning(`Unknown invalidation pattern type: ${pattern.type}`);
      }

      this.emitEvent(CacheEvent.INVALIDATE, pattern.value, {
        type: pattern.type,
        count,
      });

      return count;
    } catch (error) {
      this.logError('Cache invalidation error:', error);
      return 0;
    }
  }

  /**
   * Invalidate cache by prefix
   *
   * @param prefix - Key prefix
   * @param deleteCallback - Callback to delete individual keys
   * @returns Number of keys invalidated
   * @private
   */
  private async invalidateByPrefix(
    prefix: string,
    deleteCallback: (key: string) => Promise<boolean>,
  ): Promise<number> {
    const fullPrefix = this.cacheConfig.buildKey(prefix);
    let count = 0;

    // Clear from L1 cache
    const l1Keys = this.storageService.getL1Keys();
    for (const key of l1Keys) {
      if (key.startsWith(fullPrefix)) {
        this.storageService.deleteFromL1(key);
        this.removeFromTagIndex(key);
        count++;
      }
    }

    // Clear from L2 cache
    const l2Keys = await this.storageService.getL2KeysByPattern(`${fullPrefix}*`);
    if (l2Keys.length > 0) {
      for (const key of l2Keys) {
        await this.storageService.deleteFromL2(key);
        this.removeFromTagIndex(key);
      }
      count += l2Keys.length;
    }

    return count;
  }

  /**
   * Invalidate cache by tag
   *
   * @param tag - Cache tag
   * @param deleteCallback - Callback to delete individual keys
   * @returns Number of keys invalidated
   * @private
   */
  private async invalidateByTag(
    tag: string,
    deleteCallback: (key: string) => Promise<boolean>,
  ): Promise<number> {
    const keys = this.tagIndex.get(tag);
    if (!keys || keys.size === 0) {
      return 0;
    }

    let count = 0;
    for (const key of Array.from(keys)) {
      const deleted = await deleteCallback(key);
      if (deleted) {
        count++;
      }
    }

    this.tagIndex.delete(tag);
    return count;
  }

  /**
   * Invalidate cache by pattern (supports wildcards)
   *
   * @param pattern - Key pattern (supports * and ? wildcards)
   * @param deleteCallback - Callback to delete individual keys
   * @returns Number of keys invalidated
   * @private
   */
  private async invalidateByPattern(
    pattern: string,
    deleteCallback: (key: string) => Promise<boolean>,
  ): Promise<number> {
    const fullPattern = this.cacheConfig.buildKey(pattern);
    let count = 0;

    // Clear from L1 cache using regex
    const regex = new RegExp(`^${fullPattern.replace(/\*/g, '.*').replace(/\?/g, '.')}$`);
    const l1Keys = this.storageService.getL1Keys();
    for (const key of l1Keys) {
      if (regex.test(key)) {
        this.storageService.deleteFromL1(key);
        this.removeFromTagIndex(key);
        count++;
      }
    }

    // Clear from L2 cache
    const l2Keys = await this.storageService.getL2KeysByPattern(fullPattern);
    if (l2Keys.length > 0) {
      for (const key of l2Keys) {
        await this.storageService.deleteFromL2(key);
        this.removeFromTagIndex(key);
      }
      count += l2Keys.length;
    }

    return count;
  }

  /**
   * Cascade invalidation - invalidate key and all related keys
   *
   * @param key - Cache key
   * @param deleteCallback - Callback to delete individual keys
   * @returns Number of keys invalidated
   * @private
   */
  private async invalidateCascade(
    key: string,
    deleteCallback: (key: string) => Promise<boolean>,
  ): Promise<number> {
    // Delete the main key
    await deleteCallback(key);

    // Find and delete all keys that reference this key
    const pattern = `*:${key}:*`;
    return (await this.invalidateByPattern(pattern, deleteCallback)) + 1;
  }

  /**
   * Emit cache event
   * @private
   */
  private emitEvent(event: CacheEvent, key: string, metadata?: Record<string, any>): void {
    this.eventEmitter.emit(event, {
      event,
      key,
      timestamp: Date.now(),
      metadata,
    });
  }
}
