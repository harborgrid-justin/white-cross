/**
 * @fileoverview Cache Serialization Service
 * @module infrastructure/cache/serialization
 * @description Handles serialization, deserialization, and compression for cache values
 *
 * Responsibilities:
 * - JSON serialization/deserialization
 * - Gzip compression/decompression for large values
 * - Size estimation for memory tracking
 */

import { Injectable, Logger } from '@nestjs/common';
import * as zlib from 'zlib';
import { promisify } from 'util';
import { CacheConfigService } from './cache.config';
import type { CacheOptions } from './cache.interfaces';

import { BaseService } from '@/common/base';
const gzip = promisify(zlib.gzip);
const gunzip = promisify(zlib.gunzip);

/**
 * Service responsible for cache value serialization and compression
 */
@Injectable()
export class CacheSerializationService extends BaseService {
  constructor(private readonly cacheConfig: CacheConfigService) {}

  /**
   * Serialize value for storage in Redis
   * Automatically compresses large values based on configuration
   *
   * @param value - Value to serialize
   * @param options - Cache options
   * @returns Serialized string (may be compressed)
   */
  async serialize<T>(value: T, options: CacheOptions): Promise<string> {
    try {
      const json = JSON.stringify(value);
      const shouldCompress =
        (options.compress || this.cacheConfig.isCompressionEnabled()) &&
        json.length > this.cacheConfig.getConfig().compressionThreshold;

      if (shouldCompress) {
        const compressed = await gzip(Buffer.from(json));
        return `compressed:${compressed.toString('base64')}`;
      }

      return json;
    } catch (error) {
      this.logError('Serialization error:', error);
      throw new Error(`Failed to serialize value: ${error.message}`);
    }
  }

  /**
   * Deserialize value from storage
   * Automatically decompresses if value was compressed
   *
   * @param value - Serialized string from storage
   * @returns Deserialized value
   */
  async deserialize<T>(value: string): Promise<T> {
    try {
      if (value.startsWith('compressed:')) {
        const compressed = Buffer.from(value.slice(11), 'base64');
        const decompressed = await gunzip(compressed);
        return JSON.parse(decompressed.toString());
      }

      return JSON.parse(value);
    } catch (error) {
      this.logError('Deserialization error:', error);
      throw new Error(`Failed to deserialize value: ${error.message}`);
    }
  }

  /**
   * Estimate size of value in bytes for memory tracking
   * Uses rough approximation: JSON string length * 2 (for UTF-16 encoding)
   *
   * @param value - Value to estimate
   * @returns Estimated size in bytes
   */
  estimateSize<T>(value: T): number {
    try {
      const json = JSON.stringify(value);
      return json.length * 2; // Rough estimate for UTF-16 encoding
    } catch (error) {
      this.logWarning('Size estimation error, returning default:', error);
      return 1024; // Default fallback size
    }
  }

  /**
   * Check if value should be compressed based on configuration and size
   *
   * @param value - Value to check
   * @param options - Cache options
   * @returns True if value should be compressed
   */
  shouldCompress<T>(value: T, options: CacheOptions): boolean {
    if (!options.compress && !this.cacheConfig.isCompressionEnabled()) {
      return false;
    }

    const size = this.estimateSize(value);
    return size > this.cacheConfig.getConfig().compressionThreshold;
  }
}
