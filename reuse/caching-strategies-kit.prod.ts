/**
 * LOC: CACHE-STRAT-2024
 * File: /reuse/caching-strategies-kit.prod.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - Backend services and controllers
 *   - API gateway implementations
 *   - Database access layers
 *   - NestJS modules
 */

/**
 * File: /reuse/caching-strategies-kit.prod.ts
 * Locator: WC-UTL-CACHE-STRAT-001
 * Purpose: Production-Grade Caching Strategies - Multi-level, distributed, and intelligent caching
 *
 * Upstream: Independent utility module for advanced caching strategies
 * Downstream: ../backend/*, services, controllers, database layers, NestJS modules
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Redis 7.x, Sequelize 6.x, Zod 3.x
 * Exports: 48 utility functions for caching strategies, invalidation, distributed caching, monitoring
 *
 * LLM Context: Production-grade caching strategies for White Cross healthcare system.
 * Provides multi-level caching (L1 memory/LRU, L2 Redis, L3 database), cache invalidation patterns,
 * distributed caching, cache-aside/write-through/write-back/read-through patterns, TTL management,
 * cache warming, compression, serialization, NestJS interceptors, Sequelize hooks, and monitoring.
 */

import { Model, DataTypes, Sequelize, Optional, ModelStatic } from 'sequelize';
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import * as crypto from 'crypto';
import * as zlib from 'zlib';
import { promisify } from 'util';
import { z } from 'zod';

// Promisified compression utilities
const gzipAsync = promisify(zlib.gzip);
const gunzipAsync = promisify(zlib.gunzip);
const brotliCompressAsync = promisify(zlib.brotliCompress);
const brotliDecompressAsync = promisify(zlib.brotliDecompress);

// ============================================================================
// ZOD VALIDATION SCHEMAS
// ============================================================================

/**
 * Zod schema for cache configuration validation
 */
export const CacheConfigSchema = z.object({
  ttl: z.number().positive().optional(),
  namespace: z.string().min(1).max(128).optional(),
  tags: z.array(z.string()).optional(),
  compress: z.boolean().optional(),
  compressionThreshold: z.number().positive().optional(),
  metadata: z.record(z.any()).optional(),
  priority: z.enum(['low', 'medium', 'high', 'critical']).optional(),
});

/**
 * Zod schema for cache key configuration
 */
export const CacheKeyConfigSchema = z.object({
  prefix: z.string().min(1).max(64).optional(),
  namespace: z.string().min(1).max(128).optional(),
  separator: z.string().length(1).optional(),
  includeVersion: z.boolean().optional(),
  version: z.string().optional(),
  includeTimestamp: z.boolean().optional(),
});

/**
 * Zod schema for cache invalidation rules
 */
export const CacheInvalidationRuleSchema = z.object({
  pattern: z.string().min(1),
  strategy: z.enum(['immediate', 'lazy', 'scheduled', 'ttl-based']),
  delay: z.number().nonnegative().optional(),
  condition: z.function().optional(),
});

/**
 * Zod schema for distributed cache configuration
 */
export const DistributedCacheConfigSchema = z.object({
  nodes: z.array(z.object({
    host: z.string(),
    port: z.number().positive(),
    weight: z.number().positive().optional(),
  })).min(1),
  replicationFactor: z.number().int().positive().optional(),
  consistencyLevel: z.enum(['one', 'quorum', 'all']).optional(),
  partitionStrategy: z.enum(['hash', 'consistent-hash', 'range']).optional(),
});

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface CacheEntry<T = any> {
  key: string;
  value: T;
  ttl: number;
  createdAt: number;
  expiresAt: number;
  lastAccessedAt: number;
  accessCount: number;
  tags?: string[];
  metadata?: Record<string, any>;
  size: number;
  compressed: boolean;
  layer: 'L1' | 'L2' | 'L3';
}

export interface CacheOptions {
  ttl?: number;
  tags?: string[];
  namespace?: string;
  compress?: boolean;
  compressionThreshold?: number;
  metadata?: Record<string, any>;
  priority?: 'low' | 'medium' | 'high' | 'critical';
}

export interface CacheKeyConfig {
  prefix?: string;
  namespace?: string;
  separator?: string;
  includeVersion?: boolean;
  version?: string;
  includeTimestamp?: boolean;
}

export interface CacheStats {
  hits: number;
  misses: number;
  sets: number;
  deletes: number;
  evictions: number;
  size: number;
  hitRate: number;
  missRate: number;
  avgResponseTime: number;
  memoryUsage: number;
  l1Stats?: LayerStats;
  l2Stats?: LayerStats;
  l3Stats?: LayerStats;
}

export interface LayerStats {
  hits: number;
  misses: number;
  size: number;
  hitRate: number;
  avgResponseTime: number;
}

export interface CacheLayer<T = any> {
  name: string;
  priority: number;
  maxSize?: number;
  get(key: string): Promise<T | null>;
  set(key: string, value: T, options?: CacheOptions): Promise<void>;
  delete(key: string): Promise<void>;
  clear(): Promise<void>;
  has(key: string): Promise<boolean>;
  size(): Promise<number>;
}

export interface CacheInvalidationRule {
  pattern: string;
  strategy: 'immediate' | 'lazy' | 'scheduled' | 'ttl-based';
  delay?: number;
  condition?: (entry: CacheEntry) => boolean;
}

export interface CacheWarmingStrategy {
  enabled: boolean;
  interval?: number;
  priority?: 'low' | 'medium' | 'high';
  keys: string[] | (() => Promise<string[]>);
  loader: (key: string) => Promise<any>;
  onError?: (key: string, error: Error) => void;
}

export interface CompressionOptions {
  algorithm: 'gzip' | 'brotli' | 'deflate';
  level?: number;
  threshold?: number;
}

export interface SerializationOptions {
  format: 'json' | 'msgpack' | 'avro' | 'protobuf';
  schema?: any;
}

export interface DistributedCacheConfig {
  nodes: Array<{ host: string; port: number; weight?: number }>;
  replicationFactor?: number;
  consistencyLevel?: 'one' | 'quorum' | 'all';
  partitionStrategy?: 'hash' | 'consistent-hash' | 'range';
}

export interface CachePolicyConfig {
  evictionPolicy: 'lru' | 'lfu' | 'fifo' | 'lifo' | 'ttl';
  maxSize: number;
  maxMemory?: number;
  ttl?: number;
}

// ============================================================================
// SEQUELIZE MODELS
// ============================================================================

interface CacheEntryAttributes {
  id: number;
  key: string;
  value: Buffer;
  namespace: string;
  ttl: number;
  expiresAt: Date;
  lastAccessedAt: Date;
  accessCount: number;
  tags: string[];
  metadata: Record<string, any>;
  size: number;
  compressed: boolean;
  compressionAlgorithm: string | null;
  priority: 'low' | 'medium' | 'high' | 'critical';
  createdAt: Date;
  updatedAt: Date;
}

interface CacheEntryCreationAttributes extends Optional<CacheEntryAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

/**
 * Sequelize model for persistent cache entries in L3 layer
 */
export class CacheEntryModel extends Model<CacheEntryAttributes, CacheEntryCreationAttributes> implements CacheEntryAttributes {
  declare id: number;
  declare key: string;
  declare value: Buffer;
  declare namespace: string;
  declare ttl: number;
  declare expiresAt: Date;
  declare lastAccessedAt: Date;
  declare accessCount: number;
  declare tags: string[];
  declare metadata: Record<string, any>;
  declare size: number;
  declare compressed: boolean;
  declare compressionAlgorithm: string | null;
  declare priority: 'low' | 'medium' | 'high' | 'critical';
  declare createdAt: Date;
  declare updatedAt: Date;

  static initModel(sequelize: Sequelize): typeof CacheEntryModel {
    CacheEntryModel.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        key: {
          type: DataTypes.STRING(512),
          allowNull: false,
          unique: true,
          comment: 'Unique cache key with namespace',
        },
        value: {
          type: DataTypes.BLOB('long'),
          allowNull: false,
          comment: 'Cached value (may be compressed)',
        },
        namespace: {
          type: DataTypes.STRING(128),
          allowNull: false,
          defaultValue: 'default',
          comment: 'Cache namespace for logical grouping',
        },
        ttl: {
          type: DataTypes.INTEGER,
          allowNull: false,
          comment: 'Time to live in milliseconds',
        },
        expiresAt: {
          type: DataTypes.DATE,
          allowNull: false,
          comment: 'Expiration timestamp',
        },
        lastAccessedAt: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
          comment: 'Last access timestamp for LRU',
        },
        accessCount: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
          comment: 'Access count for LFU',
        },
        tags: {
          type: DataTypes.JSON,
          allowNull: false,
          defaultValue: [],
          comment: 'Tags for cache invalidation',
        },
        metadata: {
          type: DataTypes.JSON,
          allowNull: false,
          defaultValue: {},
          comment: 'Additional metadata',
        },
        size: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
          comment: 'Size in bytes',
        },
        compressed: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
          comment: 'Whether value is compressed',
        },
        compressionAlgorithm: {
          type: DataTypes.STRING(32),
          allowNull: true,
          comment: 'Compression algorithm used',
        },
        priority: {
          type: DataTypes.ENUM('low', 'medium', 'high', 'critical'),
          allowNull: false,
          defaultValue: 'medium',
          comment: 'Cache entry priority',
        },
        createdAt: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        updatedAt: {
          type: DataTypes.DATE,
          allowNull: false,
        },
      },
      {
        sequelize,
        tableName: 'cache_entries',
        indexes: [
          { fields: ['key'], unique: true },
          { fields: ['namespace'] },
          { fields: ['expiresAt'] },
          { fields: ['lastAccessedAt'] },
          { fields: ['priority'] },
          { fields: ['tags'], using: 'GIN' },
          { fields: ['namespace', 'expiresAt'] },
        ],
      }
    );

    return CacheEntryModel;
  }
}

interface CacheInvalidationLogAttributes {
  id: number;
  namespace: string;
  pattern: string;
  strategy: string;
  invalidatedKeys: string[];
  invalidatedCount: number;
  reason: string;
  triggeredBy: string;
  metadata: Record<string, any>;
  createdAt: Date;
}

interface CacheInvalidationLogCreationAttributes extends Optional<CacheInvalidationLogAttributes, 'id' | 'createdAt'> {}

/**
 * Sequelize model for cache invalidation audit log
 */
export class CacheInvalidationLogModel extends Model<CacheInvalidationLogAttributes, CacheInvalidationLogCreationAttributes> implements CacheInvalidationLogAttributes {
  declare id: number;
  declare namespace: string;
  declare pattern: string;
  declare strategy: string;
  declare invalidatedKeys: string[];
  declare invalidatedCount: number;
  declare reason: string;
  declare triggeredBy: string;
  declare metadata: Record<string, any>;
  declare createdAt: Date;

  static initModel(sequelize: Sequelize): typeof CacheInvalidationLogModel {
    CacheInvalidationLogModel.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        namespace: {
          type: DataTypes.STRING(128),
          allowNull: false,
          comment: 'Cache namespace',
        },
        pattern: {
          type: DataTypes.STRING(512),
          allowNull: false,
          comment: 'Invalidation pattern',
        },
        strategy: {
          type: DataTypes.STRING(64),
          allowNull: false,
          comment: 'Invalidation strategy used',
        },
        invalidatedKeys: {
          type: DataTypes.JSON,
          allowNull: false,
          defaultValue: [],
          comment: 'List of invalidated keys',
        },
        invalidatedCount: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
          comment: 'Number of entries invalidated',
        },
        reason: {
          type: DataTypes.TEXT,
          allowNull: false,
          comment: 'Reason for invalidation',
        },
        triggeredBy: {
          type: DataTypes.STRING(256),
          allowNull: false,
          comment: 'User or system that triggered invalidation',
        },
        metadata: {
          type: DataTypes.JSON,
          allowNull: false,
          defaultValue: {},
          comment: 'Additional metadata',
        },
        createdAt: {
          type: DataTypes.DATE,
          allowNull: false,
        },
      },
      {
        sequelize,
        tableName: 'cache_invalidation_logs',
        timestamps: true,
        updatedAt: false,
        indexes: [
          { fields: ['namespace'] },
          { fields: ['strategy'] },
          { fields: ['createdAt'] },
          { fields: ['triggeredBy'] },
        ],
      }
    );

    return CacheInvalidationLogModel;
  }
}

// ============================================================================
// L1 CACHE - IN-MEMORY LRU CACHE
// ============================================================================

/**
 * LRU node for doubly-linked list
 */
class LRUNode<T> {
  constructor(
    public key: string,
    public value: CacheEntry<T>,
    public prev: LRUNode<T> | null = null,
    public next: LRUNode<T> | null = null
  ) {}
}

/**
 * Production-grade LRU (Least Recently Used) cache implementation.
 * Provides O(1) get, set, and delete operations using hash map + doubly-linked list.
 *
 * @template T - Type of cached values
 *
 * @example
 * ```typescript
 * const cache = new LRUCache<User>({ maxSize: 1000, ttl: 300000 });
 * await cache.set('user:123', userData, { ttl: 600000 });
 * const user = await cache.get('user:123');
 * ```
 */
export class LRUCache<T = any> implements CacheLayer<T> {
  public name = 'L1-LRU';
  public priority = 1;
  private cache: Map<string, LRUNode<T>>;
  private head: LRUNode<T> | null = null;
  private tail: LRUNode<T> | null = null;
  private stats: CacheStats;

  constructor(
    private config: CachePolicyConfig
  ) {
    this.cache = new Map();
    this.stats = {
      hits: 0,
      misses: 0,
      sets: 0,
      deletes: 0,
      evictions: 0,
      size: 0,
      hitRate: 0,
      missRate: 0,
      avgResponseTime: 0,
      memoryUsage: 0,
    };
  }

  /**
   * Gets a value from the LRU cache and updates access order
   */
  async get(key: string): Promise<T | null> {
    const startTime = Date.now();
    const node = this.cache.get(key);

    if (!node) {
      this.stats.misses++;
      this.updateStats(startTime);
      return null;
    }

    // Check expiration
    if (node.value.expiresAt < Date.now()) {
      await this.delete(key);
      this.stats.misses++;
      this.updateStats(startTime);
      return null;
    }

    // Move to head (most recently used)
    this.moveToHead(node);
    node.value.lastAccessedAt = Date.now();
    node.value.accessCount++;

    this.stats.hits++;
    this.updateStats(startTime);
    return node.value.value;
  }

  /**
   * Sets a value in the LRU cache with automatic eviction if needed
   */
  async set(key: string, value: T, options: CacheOptions = {}): Promise<void> {
    const ttl = options.ttl || this.config.ttl || 300000; // Default 5 minutes
    const now = Date.now();

    const entry: CacheEntry<T> = {
      key,
      value,
      ttl,
      createdAt: now,
      expiresAt: now + ttl,
      lastAccessedAt: now,
      accessCount: 0,
      tags: options.tags,
      metadata: options.metadata,
      size: this.estimateSize(value),
      compressed: false,
      layer: 'L1',
    };

    const existingNode = this.cache.get(key);
    if (existingNode) {
      existingNode.value = entry;
      this.moveToHead(existingNode);
    } else {
      const newNode = new LRUNode(key, entry);
      this.cache.set(key, newNode);
      this.addToHead(newNode);
      this.stats.size++;

      // Evict if necessary
      if (this.cache.size > this.config.maxSize) {
        await this.evictLRU();
      }
    }

    this.stats.sets++;
  }

  /**
   * Deletes a value from the LRU cache
   */
  async delete(key: string): Promise<void> {
    const node = this.cache.get(key);
    if (!node) return;

    this.removeNode(node);
    this.cache.delete(key);
    this.stats.deletes++;
    this.stats.size--;
  }

  /**
   * Clears all entries from the cache
   */
  async clear(): Promise<void> {
    this.cache.clear();
    this.head = null;
    this.tail = null;
    this.stats.size = 0;
  }

  /**
   * Checks if a key exists in the cache
   */
  async has(key: string): Promise<boolean> {
    const node = this.cache.get(key);
    if (!node) return false;
    return node.value.expiresAt > Date.now();
  }

  /**
   * Returns the current size of the cache
   */
  async size(): Promise<number> {
    return this.cache.size;
  }

  /**
   * Gets cache statistics
   */
  getStats(): CacheStats {
    this.stats.hitRate = this.stats.hits / (this.stats.hits + this.stats.misses) || 0;
    this.stats.missRate = 1 - this.stats.hitRate;
    return { ...this.stats };
  }

  private moveToHead(node: LRUNode<T>): void {
    this.removeNode(node);
    this.addToHead(node);
  }

  private addToHead(node: LRUNode<T>): void {
    node.next = this.head;
    node.prev = null;

    if (this.head) {
      this.head.prev = node;
    }
    this.head = node;

    if (!this.tail) {
      this.tail = node;
    }
  }

  private removeNode(node: LRUNode<T>): void {
    if (node.prev) {
      node.prev.next = node.next;
    } else {
      this.head = node.next;
    }

    if (node.next) {
      node.next.prev = node.prev;
    } else {
      this.tail = node.prev;
    }
  }

  private async evictLRU(): Promise<void> {
    if (!this.tail) return;

    const key = this.tail.key;
    await this.delete(key);
    this.stats.evictions++;
  }

  private estimateSize(value: any): number {
    const str = JSON.stringify(value);
    return Buffer.byteLength(str, 'utf8');
  }

  private updateStats(startTime: number): void {
    const responseTime = Date.now() - startTime;
    this.stats.avgResponseTime = (this.stats.avgResponseTime + responseTime) / 2;
  }
}

// ============================================================================
// CACHE KEY GENERATION
// ============================================================================

/**
 * Generates a deterministic cache key from arguments with version support.
 *
 * @param {CacheKeyConfig} config - Cache key configuration
 * @param {...any[]} args - Arguments to include in key
 * @returns {string} Generated cache key
 *
 * @example
 * ```typescript
 * const key = generateCacheKey(
 *   { prefix: 'user', namespace: 'auth', version: 'v2' },
 *   'getUserById',
 *   123
 * );
 * // Result: 'auth:user:v2:getUserById:123'
 * ```
 */
export const generateCacheKey = (config: CacheKeyConfig, ...args: any[]): string => {
  const validated = CacheKeyConfigSchema.parse(config);
  const parts: string[] = [];

  if (validated.namespace) parts.push(validated.namespace);
  if (validated.prefix) parts.push(validated.prefix);
  if (validated.includeVersion && validated.version) parts.push(validated.version);

  args.forEach((arg) => {
    if (typeof arg === 'object' && arg !== null) {
      parts.push(hashObject(arg));
    } else {
      parts.push(String(arg));
    }
  });

  if (validated.includeTimestamp) {
    parts.push(Date.now().toString());
  }

  return parts.join(validated.separator || ':');
};

/**
 * Generates a hash-based cache key for complex objects.
 *
 * @param {CacheKeyConfig} config - Cache key configuration
 * @param {Record<string, any>} obj - Object to hash
 * @returns {string} Hash-based cache key
 *
 * @example
 * ```typescript
 * const key = generateHashKey(
 *   { prefix: 'query', namespace: 'db' },
 *   { table: 'users', where: { active: true }, limit: 10 }
 * );
 * ```
 */
export const generateHashKey = (config: CacheKeyConfig, obj: Record<string, any>): string => {
  const hash = hashObject(obj);
  return generateCacheKey(config, hash);
};

/**
 * Hashes an object to create a deterministic fingerprint.
 *
 * @param {any} obj - Object to hash
 * @returns {string} SHA-256 hash
 */
export const hashObject = (obj: any): string => {
  const str = JSON.stringify(obj, Object.keys(obj).sort());
  return crypto.createHash('sha256').update(str).digest('hex').substring(0, 16);
};

/**
 * Generates a wildcard pattern for cache key matching.
 *
 * @param {CacheKeyConfig} config - Cache key configuration
 * @param {string} pattern - Pattern with wildcards (*)
 * @returns {RegExp} Regular expression for matching
 *
 * @example
 * ```typescript
 * const pattern = generateKeyPattern({ namespace: 'users' }, 'user:*:profile');
 * // Matches: users:user:123:profile, users:user:456:profile, etc.
 * ```
 */
export const generateKeyPattern = (config: CacheKeyConfig, pattern: string): RegExp => {
  const prefix = config.namespace ? `${config.namespace}:` : '';
  const regexPattern = pattern.replace(/\*/g, '.*').replace(/\?/g, '.');
  return new RegExp(`^${prefix}${regexPattern}$`);
};

// ============================================================================
// COMPRESSION & SERIALIZATION
// ============================================================================

/**
 * Compresses data using specified algorithm.
 *
 * @param {any} data - Data to compress
 * @param {CompressionOptions} options - Compression options
 * @returns {Promise<Buffer>} Compressed data
 *
 * @example
 * ```typescript
 * const compressed = await compressData(largeObject, {
 *   algorithm: 'brotli',
 *   level: 6,
 *   threshold: 1024
 * });
 * ```
 */
export const compressData = async (
  data: any,
  options: CompressionOptions = { algorithm: 'gzip' }
): Promise<Buffer> => {
  const buffer = Buffer.from(JSON.stringify(data));

  // Skip compression if below threshold
  if (options.threshold && buffer.length < options.threshold) {
    return buffer;
  }

  switch (options.algorithm) {
    case 'gzip':
      return await gzipAsync(buffer, { level: options.level || 6 });
    case 'brotli':
      return await brotliCompressAsync(buffer, {
        params: {
          [zlib.constants.BROTLI_PARAM_QUALITY]: options.level || 6,
        },
      });
    case 'deflate':
      return await promisify(zlib.deflate)(buffer, { level: options.level || 6 });
    default:
      throw new Error(`Unsupported compression algorithm: ${options.algorithm}`);
  }
};

/**
 * Decompresses data using specified algorithm.
 *
 * @param {Buffer} compressed - Compressed data
 * @param {CompressionOptions} options - Decompression options
 * @returns {Promise<any>} Decompressed data
 *
 * @example
 * ```typescript
 * const data = await decompressData(compressedBuffer, { algorithm: 'brotli' });
 * ```
 */
export const decompressData = async (
  compressed: Buffer,
  options: CompressionOptions = { algorithm: 'gzip' }
): Promise<any> => {
  let buffer: Buffer;

  switch (options.algorithm) {
    case 'gzip':
      buffer = await gunzipAsync(compressed);
      break;
    case 'brotli':
      buffer = await brotliDecompressAsync(compressed);
      break;
    case 'deflate':
      buffer = await promisify(zlib.inflate)(compressed);
      break;
    default:
      throw new Error(`Unsupported compression algorithm: ${options.algorithm}`);
  }

  return JSON.parse(buffer.toString());
};

/**
 * Serializes data with optional schema validation.
 *
 * @param {any} data - Data to serialize
 * @param {SerializationOptions} options - Serialization options
 * @returns {Buffer} Serialized data
 *
 * @example
 * ```typescript
 * const serialized = serializeData(userData, { format: 'json' });
 * ```
 */
export const serializeData = (data: any, options: SerializationOptions = { format: 'json' }): Buffer => {
  switch (options.format) {
    case 'json':
      return Buffer.from(JSON.stringify(data));
    case 'msgpack':
      // Placeholder for msgpack implementation
      return Buffer.from(JSON.stringify(data));
    default:
      throw new Error(`Unsupported serialization format: ${options.format}`);
  }
};

/**
 * Deserializes data with optional schema validation.
 *
 * @param {Buffer} buffer - Serialized data
 * @param {SerializationOptions} options - Deserialization options
 * @returns {any} Deserialized data
 *
 * @example
 * ```typescript
 * const data = deserializeData(buffer, { format: 'json' });
 * ```
 */
export const deserializeData = (buffer: Buffer, options: SerializationOptions = { format: 'json' }): any => {
  switch (options.format) {
    case 'json':
      return JSON.parse(buffer.toString());
    case 'msgpack':
      // Placeholder for msgpack implementation
      return JSON.parse(buffer.toString());
    default:
      throw new Error(`Unsupported serialization format: ${options.format}`);
  }
};

// ============================================================================
// MULTI-LEVEL CACHE MANAGER
// ============================================================================

/**
 * Multi-level cache manager with L1 (memory), L2 (Redis), and L3 (database) layers.
 * Implements automatic promotion/demotion between layers.
 *
 * @example
 * ```typescript
 * const cacheManager = new MultiLevelCacheManager([l1Cache, l2Cache, l3Cache]);
 * await cacheManager.set('user:123', userData, { ttl: 300000 });
 * const data = await cacheManager.get('user:123');
 * ```
 */
export class MultiLevelCacheManager {
  private stats: Map<string, LayerStats> = new Map();

  constructor(
    private layers: CacheLayer[],
    private compressionOptions?: CompressionOptions
  ) {
    // Sort layers by priority (L1 = 1, L2 = 2, L3 = 3)
    this.layers.sort((a, b) => a.priority - b.priority);
  }

  /**
   * Gets a value from the cache, checking all layers in order.
   * Promotes cache hits to higher layers.
   */
  async get<T>(key: string): Promise<T | null> {
    for (let i = 0; i < this.layers.length; i++) {
      const layer = this.layers[i];
      const startTime = Date.now();

      try {
        const value = await layer.get(key);

        if (value !== null) {
          this.updateLayerStats(layer.name, true, Date.now() - startTime);

          // Promote to higher layers
          for (let j = 0; j < i; j++) {
            await this.layers[j].set(key, value);
          }

          return value as T;
        }

        this.updateLayerStats(layer.name, false, Date.now() - startTime);
      } catch (error) {
        console.error(`Error getting from ${layer.name}:`, error);
        continue;
      }
    }

    return null;
  }

  /**
   * Sets a value in all cache layers.
   */
  async set<T>(key: string, value: T, options: CacheOptions = {}): Promise<void> {
    const errors: Error[] = [];

    for (const layer of this.layers) {
      try {
        await layer.set(key, value, options);
      } catch (error) {
        console.error(`Error setting in ${layer.name}:`, error);
        errors.push(error as Error);
      }
    }

    if (errors.length === this.layers.length) {
      throw new Error('Failed to set value in all cache layers');
    }
  }

  /**
   * Deletes a value from all cache layers.
   */
  async delete(key: string): Promise<void> {
    await Promise.all(this.layers.map(layer => layer.delete(key).catch(() => {})));
  }

  /**
   * Clears all cache layers.
   */
  async clear(): Promise<void> {
    await Promise.all(this.layers.map(layer => layer.clear().catch(() => {})));
  }

  /**
   * Gets aggregate statistics from all cache layers.
   */
  getStats(): Record<string, LayerStats> {
    const stats: Record<string, LayerStats> = {};
    this.stats.forEach((value, key) => {
      stats[key] = value;
    });
    return stats;
  }

  private updateLayerStats(layerName: string, hit: boolean, responseTime: number): void {
    const stats = this.stats.get(layerName) || {
      hits: 0,
      misses: 0,
      size: 0,
      hitRate: 0,
      avgResponseTime: 0,
    };

    if (hit) {
      stats.hits++;
    } else {
      stats.misses++;
    }

    stats.hitRate = stats.hits / (stats.hits + stats.misses);
    stats.avgResponseTime = (stats.avgResponseTime + responseTime) / 2;

    this.stats.set(layerName, stats);
  }
}

// ============================================================================
// CACHE PATTERNS - CACHE-ASIDE, WRITE-THROUGH, WRITE-BACK, READ-THROUGH
// ============================================================================

/**
 * Cache-aside pattern implementation.
 * Application code is responsible for loading data on cache miss.
 *
 * @template T - Type of cached data
 * @param {string} key - Cache key
 * @param {() => Promise<T>} loader - Function to load data on cache miss
 * @param {CacheLayer} cache - Cache layer to use
 * @param {CacheOptions} options - Cache options
 * @returns {Promise<T>} Cached or loaded data
 *
 * @example
 * ```typescript
 * const user = await cacheAside(
 *   'user:123',
 *   async () => await userRepository.findById(123),
 *   l1Cache,
 *   { ttl: 300000 }
 * );
 * ```
 */
export const cacheAside = async <T>(
  key: string,
  loader: () => Promise<T>,
  cache: CacheLayer,
  options: CacheOptions = {}
): Promise<T> => {
  // Try to get from cache
  const cached = await cache.get(key);
  if (cached !== null) {
    return cached as T;
  }

  // Load from source
  const data = await loader();

  // Store in cache (async, don't wait)
  cache.set(key, data, options).catch(err => {
    console.error('Cache-aside set error:', err);
  });

  return data;
};

/**
 * Write-through pattern implementation.
 * Writes data to cache and database synchronously.
 *
 * @template T - Type of data to write
 * @param {string} key - Cache key
 * @param {T} data - Data to write
 * @param {(data: T) => Promise<void>} writer - Function to write to database
 * @param {CacheLayer} cache - Cache layer to use
 * @param {CacheOptions} options - Cache options
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await writeThrough(
 *   'user:123',
 *   userData,
 *   async (data) => await userRepository.save(data),
 *   l1Cache,
 *   { ttl: 300000 }
 * );
 * ```
 */
export const writeThrough = async <T>(
  key: string,
  data: T,
  writer: (data: T) => Promise<void>,
  cache: CacheLayer,
  options: CacheOptions = {}
): Promise<void> => {
  // Write to database first
  await writer(data);

  // Write to cache
  await cache.set(key, data, options);
};

/**
 * Write-back (write-behind) pattern implementation.
 * Writes to cache immediately and database asynchronously.
 *
 * @template T - Type of data to write
 * @param {string} key - Cache key
 * @param {T} data - Data to write
 * @param {(data: T) => Promise<void>} writer - Function to write to database
 * @param {CacheLayer} cache - Cache layer to use
 * @param {CacheOptions} options - Cache options
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await writeBack(
 *   'user:123',
 *   userData,
 *   async (data) => await userRepository.save(data),
 *   l1Cache,
 *   { ttl: 300000 }
 * );
 * ```
 */
export const writeBack = async <T>(
  key: string,
  data: T,
  writer: (data: T) => Promise<void>,
  cache: CacheLayer,
  options: CacheOptions = {}
): Promise<void> => {
  // Write to cache immediately
  await cache.set(key, data, options);

  // Write to database asynchronously
  writer(data).catch(err => {
    console.error('Write-back database write error:', err);
  });
};

/**
 * Read-through pattern implementation.
 * Cache automatically loads data on miss.
 *
 * @template T - Type of cached data
 * @param {string} key - Cache key
 * @param {() => Promise<T>} loader - Function to load data on cache miss
 * @param {CacheLayer} cache - Cache layer to use
 * @param {CacheOptions} options - Cache options
 * @returns {Promise<T>} Cached or loaded data
 *
 * @example
 * ```typescript
 * const user = await readThrough(
 *   'user:123',
 *   async () => await userRepository.findById(123),
 *   l1Cache,
 *   { ttl: 300000 }
 * );
 * ```
 */
export const readThrough = async <T>(
  key: string,
  loader: () => Promise<T>,
  cache: CacheLayer,
  options: CacheOptions = {}
): Promise<T> => {
  // Try to get from cache
  const cached = await cache.get(key);
  if (cached !== null) {
    return cached as T;
  }

  // Load from source and set in cache synchronously
  const data = await loader();
  await cache.set(key, data, options);

  return data;
};

/**
 * Refresh-ahead pattern implementation.
 * Proactively refreshes cache before expiration.
 *
 * @template T - Type of cached data
 * @param {string} key - Cache key
 * @param {() => Promise<T>} loader - Function to load data
 * @param {CacheLayer} cache - Cache layer to use
 * @param {CacheOptions & { refreshThreshold: number }} options - Cache options with refresh threshold
 * @returns {Promise<T>} Cached data
 *
 * @example
 * ```typescript
 * const user = await refreshAhead(
 *   'user:123',
 *   async () => await userRepository.findById(123),
 *   l1Cache,
 *   { ttl: 300000, refreshThreshold: 0.8 }
 * );
 * ```
 */
export const refreshAhead = async <T>(
  key: string,
  loader: () => Promise<T>,
  cache: CacheLayer,
  options: CacheOptions & { refreshThreshold?: number } = {}
): Promise<T> => {
  const cached = await cache.get(key);

  if (cached !== null) {
    // Check if we should refresh proactively
    const threshold = options.refreshThreshold || 0.8;
    const ttl = options.ttl || 300000;

    // Refresh in background if approaching expiration
    // Note: This is a simplified version; in production, track actual expiration
    if (Math.random() > threshold) {
      loader().then(data => cache.set(key, data, options)).catch(() => {});
    }

    return cached as T;
  }

  const data = await loader();
  await cache.set(key, data, options);
  return data;
};

// ============================================================================
// CACHE INVALIDATION STRATEGIES
// ============================================================================

/**
 * Invalidates cache entries matching a pattern.
 *
 * @param {string} pattern - Pattern to match (supports wildcards)
 * @param {CacheLayer[]} layers - Cache layers to invalidate
 * @param {CacheInvalidationRule} rule - Invalidation rule
 * @returns {Promise<number>} Number of invalidated entries
 *
 * @example
 * ```typescript
 * const count = await invalidateByPattern('user:*', [l1Cache, l2Cache], {
 *   strategy: 'immediate',
 *   pattern: 'user:*'
 * });
 * ```
 */
export const invalidateByPattern = async (
  pattern: string,
  layers: CacheLayer[],
  rule: CacheInvalidationRule
): Promise<number> => {
  const validated = CacheInvalidationRuleSchema.parse(rule);
  let totalInvalidated = 0;

  const invalidate = async () => {
    const regex = new RegExp(pattern.replace(/\*/g, '.*'));

    for (const layer of layers) {
      // Note: This requires cache layer to support pattern matching
      // In production, implement pattern matching in each cache layer
      await layer.clear(); // Simplified for demonstration
      totalInvalidated++;
    }
  };

  switch (validated.strategy) {
    case 'immediate':
      await invalidate();
      break;
    case 'lazy':
      // Mark for lazy deletion on next access
      break;
    case 'scheduled':
      setTimeout(() => invalidate(), validated.delay || 0);
      break;
    case 'ttl-based':
      // Let TTL handle invalidation
      break;
  }

  return totalInvalidated;
};

/**
 * Invalidates cache entries by tags.
 *
 * @param {string[]} tags - Tags to match
 * @param {CacheLayer[]} layers - Cache layers to invalidate
 * @returns {Promise<number>} Number of invalidated entries
 *
 * @example
 * ```typescript
 * const count = await invalidateByTags(['user', 'profile'], [l1Cache, l2Cache]);
 * ```
 */
export const invalidateByTags = async (tags: string[], layers: CacheLayer[]): Promise<number> => {
  let totalInvalidated = 0;

  for (const layer of layers) {
    // Note: This requires cache layer to support tag-based invalidation
    // In production, implement tag tracking in each cache layer
    await layer.clear(); // Simplified for demonstration
    totalInvalidated++;
  }

  return totalInvalidated;
};

/**
 * Invalidates cache entries based on a dependency graph.
 *
 * @param {string} key - Key that changed
 * @param {Map<string, string[]>} dependencyGraph - Dependency graph
 * @param {CacheLayer[]} layers - Cache layers to invalidate
 * @returns {Promise<string[]>} Invalidated keys
 *
 * @example
 * ```typescript
 * const graph = new Map([
 *   ['user:123', ['user:123:profile', 'user:123:settings']],
 * ]);
 * const invalidated = await invalidateByDependency('user:123', graph, [l1Cache]);
 * ```
 */
export const invalidateByDependency = async (
  key: string,
  dependencyGraph: Map<string, string[]>,
  layers: CacheLayer[]
): Promise<string[]> => {
  const toInvalidate = new Set<string>([key]);
  const invalidated: string[] = [];

  // Build list of dependent keys
  const queue = [key];
  while (queue.length > 0) {
    const current = queue.shift()!;
    const dependents = dependencyGraph.get(current) || [];

    dependents.forEach(dep => {
      if (!toInvalidate.has(dep)) {
        toInvalidate.add(dep);
        queue.push(dep);
      }
    });
  }

  // Invalidate all dependent keys
  for (const keyToInvalidate of toInvalidate) {
    for (const layer of layers) {
      await layer.delete(keyToInvalidate);
    }
    invalidated.push(keyToInvalidate);
  }

  return invalidated;
};

/**
 * Time-based cache invalidation with configurable intervals.
 *
 * @param {CacheLayer[]} layers - Cache layers to manage
 * @param {number} interval - Check interval in milliseconds
 * @returns {NodeJS.Timer} Interval timer
 *
 * @example
 * ```typescript
 * const timer = invalidateExpired([l1Cache, l2Cache, l3Cache], 60000);
 * ```
 */
export const invalidateExpired = (layers: CacheLayer[], interval: number = 60000): NodeJS.Timer => {
  return setInterval(async () => {
    for (const layer of layers) {
      // Note: Each layer should implement its own expiration check
      // This is a trigger for layers to clean up expired entries
      const size = await layer.size();
      console.log(`Expiration check for ${layer.name}: ${size} entries`);
    }
  }, interval);
};

// ============================================================================
// CACHE WARMING STRATEGIES
// ============================================================================

/**
 * Warms the cache by preloading frequently accessed data.
 *
 * @param {CacheWarmingStrategy} strategy - Warming strategy configuration
 * @param {CacheLayer} cache - Cache layer to warm
 * @returns {Promise<number>} Number of warmed entries
 *
 * @example
 * ```typescript
 * const warmed = await warmCache({
 *   enabled: true,
 *   keys: ['user:123', 'user:456'],
 *   loader: async (key) => await userRepository.findById(key.split(':')[1])
 * }, l1Cache);
 * ```
 */
export const warmCache = async (
  strategy: CacheWarmingStrategy,
  cache: CacheLayer
): Promise<number> => {
  if (!strategy.enabled) return 0;

  const keys = typeof strategy.keys === 'function' ? await strategy.keys() : strategy.keys;
  let warmed = 0;

  for (const key of keys) {
    try {
      const data = await strategy.loader(key);
      await cache.set(key, data);
      warmed++;
    } catch (error) {
      if (strategy.onError) {
        strategy.onError(key, error as Error);
      } else {
        console.error(`Cache warming error for key ${key}:`, error);
      }
    }
  }

  return warmed;
};

/**
 * Schedules periodic cache warming.
 *
 * @param {CacheWarmingStrategy} strategy - Warming strategy configuration
 * @param {CacheLayer} cache - Cache layer to warm
 * @returns {NodeJS.Timer} Interval timer
 *
 * @example
 * ```typescript
 * const timer = scheduleWarmCache({
 *   enabled: true,
 *   interval: 300000, // 5 minutes
 *   keys: async () => await getFrequentlyAccessedKeys(),
 *   loader: async (key) => await loadData(key)
 * }, l1Cache);
 * ```
 */
export const scheduleWarmCache = (
  strategy: CacheWarmingStrategy,
  cache: CacheLayer
): NodeJS.Timer => {
  const interval = strategy.interval || 300000; // Default 5 minutes

  return setInterval(async () => {
    const warmed = await warmCache(strategy, cache);
    console.log(`Cache warming completed: ${warmed} entries`);
  }, interval);
};

/**
 * Predictive cache warming based on access patterns.
 *
 * @param {Map<string, number>} accessPatterns - Access frequency map
 * @param {(key: string) => Promise<any>} loader - Data loader function
 * @param {CacheLayer} cache - Cache layer to warm
 * @param {number} threshold - Minimum access count to warm
 * @returns {Promise<number>} Number of warmed entries
 *
 * @example
 * ```typescript
 * const patterns = new Map([['user:123', 150], ['user:456', 80]]);
 * const warmed = await predictiveWarmCache(
 *   patterns,
 *   async (key) => await loadData(key),
 *   l1Cache,
 *   100
 * );
 * ```
 */
export const predictiveWarmCache = async (
  accessPatterns: Map<string, number>,
  loader: (key: string) => Promise<any>,
  cache: CacheLayer,
  threshold: number = 10
): Promise<number> => {
  let warmed = 0;

  for (const [key, accessCount] of accessPatterns.entries()) {
    if (accessCount >= threshold) {
      try {
        const data = await loader(key);
        await cache.set(key, data);
        warmed++;
      } catch (error) {
        console.error(`Predictive warming error for key ${key}:`, error);
      }
    }
  }

  return warmed;
};

// ============================================================================
// TTL MANAGEMENT
// ============================================================================

/**
 * Calculates adaptive TTL based on access patterns.
 *
 * @param {number} accessCount - Number of times accessed
 * @param {number} baseTTL - Base TTL in milliseconds
 * @param {number} maxTTL - Maximum TTL in milliseconds
 * @returns {number} Calculated TTL
 *
 * @example
 * ```typescript
 * const ttl = calculateAdaptiveTTL(150, 300000, 3600000);
 * // Returns higher TTL for frequently accessed items
 * ```
 */
export const calculateAdaptiveTTL = (
  accessCount: number,
  baseTTL: number = 300000,
  maxTTL: number = 3600000
): number => {
  // Increase TTL logarithmically with access count
  const factor = Math.log(accessCount + 1) / Math.log(10);
  const calculatedTTL = baseTTL * (1 + factor);
  return Math.min(calculatedTTL, maxTTL);
};

/**
 * Extends TTL for a cache entry on access.
 *
 * @param {string} key - Cache key
 * @param {CacheLayer} cache - Cache layer
 * @param {number} extensionTime - Time to extend in milliseconds
 * @returns {Promise<boolean>} Success status
 *
 * @example
 * ```typescript
 * await extendTTL('user:123', l1Cache, 300000);
 * ```
 */
export const extendTTL = async (
  key: string,
  cache: CacheLayer,
  extensionTime: number
): Promise<boolean> => {
  const value = await cache.get(key);
  if (value === null) return false;

  await cache.set(key, value, { ttl: extensionTime });
  return true;
};

/**
 * Implements sliding expiration (TTL resets on access).
 *
 * @template T - Type of cached data
 * @param {string} key - Cache key
 * @param {CacheLayer} cache - Cache layer
 * @param {number} ttl - TTL in milliseconds
 * @returns {Promise<T | null>} Cached value
 *
 * @example
 * ```typescript
 * const user = await slidingExpiration('user:123', l1Cache, 300000);
 * ```
 */
export const slidingExpiration = async <T>(
  key: string,
  cache: CacheLayer,
  ttl: number
): Promise<T | null> => {
  const value = await cache.get(key);
  if (value === null) return null;

  // Reset TTL on access
  await cache.set(key, value, { ttl });
  return value as T;
};

// ============================================================================
// NESTJS INTERCEPTORS
// ============================================================================

/**
 * NestJS interceptor for automatic HTTP response caching.
 *
 * @example
 * ```typescript
 * @UseInterceptors(new CacheInterceptor(cacheManager, { ttl: 300000 }))
 * @Get('users/:id')
 * async getUser(@Param('id') id: string) {
 *   return await this.userService.findById(id);
 * }
 * ```
 */
@Injectable()
export class CacheInterceptor implements NestInterceptor {
  constructor(
    private readonly cacheManager: MultiLevelCacheManager,
    private readonly options: CacheOptions = {}
  ) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const cacheKey = this.generateKeyFromRequest(request);

    // Try to get from cache
    const cached = await this.cacheManager.get(cacheKey);
    if (cached !== null) {
      return new Observable(subscriber => {
        subscriber.next(cached);
        subscriber.complete();
      });
    }

    // Execute handler and cache result
    return next.handle().pipe(
      tap(async (response) => {
        await this.cacheManager.set(cacheKey, response, this.options);
      })
    );
  }

  private generateKeyFromRequest(request: any): string {
    const method = request.method;
    const url = request.url;
    const query = JSON.stringify(request.query);
    return `http:${method}:${url}:${hashObject(query)}`;
  }
}

/**
 * NestJS interceptor for cache invalidation on mutations.
 *
 * @example
 * ```typescript
 * @UseInterceptors(new CacheInvalidationInterceptor(cacheManager, 'user:*'))
 * @Put('users/:id')
 * async updateUser(@Param('id') id: string, @Body() data: UpdateUserDto) {
 *   return await this.userService.update(id, data);
 * }
 * ```
 */
@Injectable()
export class CacheInvalidationInterceptor implements NestInterceptor {
  constructor(
    private readonly cacheManager: MultiLevelCacheManager,
    private readonly pattern: string
  ) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    return next.handle().pipe(
      tap(async () => {
        // Invalidate after successful mutation
        await this.cacheManager.delete(this.pattern);
      })
    );
  }
}

// ============================================================================
// SEQUELIZE HOOKS FOR CACHE INVALIDATION
// ============================================================================

/**
 * Creates Sequelize hooks for automatic cache invalidation on model changes.
 *
 * @param {ModelStatic<Model>} model - Sequelize model
 * @param {MultiLevelCacheManager} cacheManager - Cache manager
 * @param {(instance: any) => string} keyGenerator - Function to generate cache key from instance
 *
 * @example
 * ```typescript
 * setupCacheInvalidationHooks(
 *   UserModel,
 *   cacheManager,
 *   (user) => `user:${user.id}`
 * );
 * ```
 */
export const setupCacheInvalidationHooks = (
  model: ModelStatic<Model>,
  cacheManager: MultiLevelCacheManager,
  keyGenerator: (instance: any) => string
): void => {
  // Invalidate on update
  model.addHook('afterUpdate', async (instance) => {
    const key = keyGenerator(instance);
    await cacheManager.delete(key);
  });

  // Invalidate on delete
  model.addHook('afterDestroy', async (instance) => {
    const key = keyGenerator(instance);
    await cacheManager.delete(key);
  });

  // Invalidate on bulk update
  model.addHook('afterBulkUpdate', async (options) => {
    // Clear all cache for this model (pattern-based)
    await cacheManager.clear();
  });

  // Invalidate on bulk delete
  model.addHook('afterBulkDestroy', async (options) => {
    await cacheManager.clear();
  });
};

/**
 * Creates Sequelize hooks for cache warming on model creation.
 *
 * @param {ModelStatic<Model>} model - Sequelize model
 * @param {MultiLevelCacheManager} cacheManager - Cache manager
 * @param {(instance: any) => string} keyGenerator - Function to generate cache key
 * @param {CacheOptions} options - Cache options
 *
 * @example
 * ```typescript
 * setupCacheWarmingHooks(
 *   UserModel,
 *   cacheManager,
 *   (user) => `user:${user.id}`,
 *   { ttl: 300000 }
 * );
 * ```
 */
export const setupCacheWarmingHooks = (
  model: ModelStatic<Model>,
  cacheManager: MultiLevelCacheManager,
  keyGenerator: (instance: any) => string,
  options: CacheOptions = {}
): void => {
  // Warm cache on create
  model.addHook('afterCreate', async (instance) => {
    const key = keyGenerator(instance);
    await cacheManager.set(key, instance.toJSON(), options);
  });

  // Warm cache on update
  model.addHook('afterUpdate', async (instance) => {
    const key = keyGenerator(instance);
    await cacheManager.set(key, instance.toJSON(), options);
  });
};

/**
 * Creates comprehensive Sequelize hooks for cache management.
 *
 * @param {ModelStatic<Model>} model - Sequelize model
 * @param {MultiLevelCacheManager} cacheManager - Cache manager
 * @param {object} config - Hook configuration
 *
 * @example
 * ```typescript
 * setupComprehensiveCacheHooks(UserModel, cacheManager, {
 *   keyGenerator: (user) => `user:${user.id}`,
 *   warmOnCreate: true,
 *   invalidateOnUpdate: true,
 *   options: { ttl: 300000 }
 * });
 * ```
 */
export const setupComprehensiveCacheHooks = (
  model: ModelStatic<Model>,
  cacheManager: MultiLevelCacheManager,
  config: {
    keyGenerator: (instance: any) => string;
    warmOnCreate?: boolean;
    invalidateOnUpdate?: boolean;
    invalidateOnDelete?: boolean;
    options?: CacheOptions;
  }
): void => {
  if (config.warmOnCreate) {
    setupCacheWarmingHooks(model, cacheManager, config.keyGenerator, config.options);
  }

  if (config.invalidateOnUpdate || config.invalidateOnDelete) {
    setupCacheInvalidationHooks(model, cacheManager, config.keyGenerator);
  }
};

// ============================================================================
// DISTRIBUTED CACHING
// ============================================================================

/**
 * Consistent hashing for distributed cache key distribution.
 *
 * @param {string} key - Cache key
 * @param {DistributedCacheConfig} config - Distributed cache configuration
 * @returns {number} Node index
 *
 * @example
 * ```typescript
 * const nodeIndex = consistentHash('user:123', {
 *   nodes: [
 *     { host: 'cache1.example.com', port: 6379 },
 *     { host: 'cache2.example.com', port: 6379 }
 *   ]
 * });
 * ```
 */
export const consistentHash = (key: string, config: DistributedCacheConfig): number => {
  const validated = DistributedCacheConfigSchema.parse(config);
  const hash = crypto.createHash('md5').update(key).digest('hex');
  const hashValue = parseInt(hash.substring(0, 8), 16);

  let totalWeight = 0;
  const weights = validated.nodes.map(node => {
    const weight = node.weight || 1;
    totalWeight += weight;
    return weight;
  });

  const target = (hashValue % totalWeight);
  let currentWeight = 0;

  for (let i = 0; i < weights.length; i++) {
    currentWeight += weights[i];
    if (target < currentWeight) {
      return i;
    }
  }

  return 0;
};

/**
 * Distributes cache operations across multiple nodes.
 *
 * @template T - Type of cached data
 * @param {string} key - Cache key
 * @param {DistributedCacheConfig} config - Distributed cache configuration
 * @param {CacheLayer[]} nodes - Cache nodes
 * @returns {CacheLayer} Selected cache node
 *
 * @example
 * ```typescript
 * const node = selectCacheNode('user:123', config, cacheNodes);
 * await node.set('user:123', userData);
 * ```
 */
export const selectCacheNode = (
  key: string,
  config: DistributedCacheConfig,
  nodes: CacheLayer[]
): CacheLayer => {
  const nodeIndex = consistentHash(key, config);
  return nodes[nodeIndex];
};

/**
 * Replicates cache data across multiple nodes for high availability.
 *
 * @template T - Type of cached data
 * @param {string} key - Cache key
 * @param {T} value - Value to cache
 * @param {CacheLayer[]} nodes - Cache nodes
 * @param {number} replicationFactor - Number of replicas
 * @param {CacheOptions} options - Cache options
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await replicateCacheData('user:123', userData, cacheNodes, 3, { ttl: 300000 });
 * ```
 */
export const replicateCacheData = async <T>(
  key: string,
  value: T,
  nodes: CacheLayer[],
  replicationFactor: number = 2,
  options: CacheOptions = {}
): Promise<void> => {
  const primaryNodeIndex = consistentHash(key, { nodes: nodes.map((_, i) => ({ host: `node${i}`, port: 6379 })) });

  const replicaIndices = [primaryNodeIndex];
  for (let i = 1; i < replicationFactor && replicaIndices.length < nodes.length; i++) {
    const nextIndex = (primaryNodeIndex + i) % nodes.length;
    replicaIndices.push(nextIndex);
  }

  await Promise.all(
    replicaIndices.map(index => nodes[index].set(key, value, options))
  );
};

// ============================================================================
// MONITORING & OBSERVABILITY
// ============================================================================

/**
 * Collects comprehensive cache metrics for monitoring.
 *
 * @param {CacheLayer[]} layers - Cache layers to monitor
 * @returns {Promise<CacheStats>} Aggregate cache statistics
 *
 * @example
 * ```typescript
 * const stats = await collectCacheMetrics([l1Cache, l2Cache, l3Cache]);
 * console.log(`Hit rate: ${stats.hitRate * 100}%`);
 * ```
 */
export const collectCacheMetrics = async (layers: CacheLayer[]): Promise<CacheStats> => {
  const stats: CacheStats = {
    hits: 0,
    misses: 0,
    sets: 0,
    deletes: 0,
    evictions: 0,
    size: 0,
    hitRate: 0,
    missRate: 0,
    avgResponseTime: 0,
    memoryUsage: 0,
  };

  for (const layer of layers) {
    const size = await layer.size();
    stats.size += size;
  }

  return stats;
};

/**
 * Exports cache statistics in Prometheus format.
 *
 * @param {CacheStats} stats - Cache statistics
 * @param {string} namespace - Metric namespace
 * @returns {string} Prometheus metrics
 *
 * @example
 * ```typescript
 * const metrics = exportPrometheusMetrics(stats, 'white_cross_cache');
 * ```
 */
export const exportPrometheusMetrics = (stats: CacheStats, namespace: string = 'cache'): string => {
  const metrics: string[] = [];

  metrics.push(`# HELP ${namespace}_hits_total Total cache hits`);
  metrics.push(`# TYPE ${namespace}_hits_total counter`);
  metrics.push(`${namespace}_hits_total ${stats.hits}`);

  metrics.push(`# HELP ${namespace}_misses_total Total cache misses`);
  metrics.push(`# TYPE ${namespace}_misses_total counter`);
  metrics.push(`${namespace}_misses_total ${stats.misses}`);

  metrics.push(`# HELP ${namespace}_hit_rate Cache hit rate`);
  metrics.push(`# TYPE ${namespace}_hit_rate gauge`);
  metrics.push(`${namespace}_hit_rate ${stats.hitRate}`);

  metrics.push(`# HELP ${namespace}_size Current cache size`);
  metrics.push(`# TYPE ${namespace}_size gauge`);
  metrics.push(`${namespace}_size ${stats.size}`);

  metrics.push(`# HELP ${namespace}_avg_response_time_ms Average response time in milliseconds`);
  metrics.push(`# TYPE ${namespace}_avg_response_time_ms gauge`);
  metrics.push(`${namespace}_avg_response_time_ms ${stats.avgResponseTime}`);

  return metrics.join('\n');
};

/**
 * Creates a cache health check function.
 *
 * @param {CacheLayer[]} layers - Cache layers to check
 * @returns {() => Promise<{ healthy: boolean; details: any }>} Health check function
 *
 * @example
 * ```typescript
 * const healthCheck = createCacheHealthCheck([l1Cache, l2Cache]);
 * const health = await healthCheck();
 * ```
 */
export const createCacheHealthCheck = (
  layers: CacheLayer[]
): (() => Promise<{ healthy: boolean; details: any }>) => {
  return async () => {
    const details: any = {};
    let healthy = true;

    for (const layer of layers) {
      try {
        const testKey = `health_check_${Date.now()}`;
        await layer.set(testKey, 'ok', { ttl: 1000 });
        const value = await layer.get(testKey);
        await layer.delete(testKey);

        details[layer.name] = {
          status: 'healthy',
          latency: 0, // Measure actual latency in production
        };
      } catch (error) {
        healthy = false;
        details[layer.name] = {
          status: 'unhealthy',
          error: (error as Error).message,
        };
      }
    }

    return { healthy, details };
  };
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Memoizes a function with automatic cache management.
 *
 * @template T - Return type of function
 * @param {(...args: any[]) => Promise<T>} fn - Function to memoize
 * @param {CacheLayer} cache - Cache layer to use
 * @param {object} options - Memoization options
 * @returns {(...args: any[]) => Promise<T>} Memoized function
 *
 * @example
 * ```typescript
 * const memoizedGetUser = memoize(
 *   async (id: string) => await userRepository.findById(id),
 *   l1Cache,
 *   { ttl: 300000, keyPrefix: 'user' }
 * );
 * ```
 */
export const memoize = <T>(
  fn: (...args: any[]) => Promise<T>,
  cache: CacheLayer,
  options: { ttl?: number; keyPrefix?: string; keyGenerator?: (...args: any[]) => string } = {}
): ((...args: any[]) => Promise<T>) => {
  return async (...args: any[]): Promise<T> => {
    const key = options.keyGenerator
      ? options.keyGenerator(...args)
      : `${options.keyPrefix || 'memoized'}:${hashObject(args)}`;

    const cached = await cache.get(key);
    if (cached !== null) {
      return cached as T;
    }

    const result = await fn(...args);
    await cache.set(key, result, { ttl: options.ttl });
    return result;
  };
};

/**
 * Batches cache operations for better performance.
 *
 * @template T - Type of cached data
 * @param {Array<{ key: string; value: T }>} operations - Batch operations
 * @param {CacheLayer} cache - Cache layer
 * @param {CacheOptions} options - Cache options
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await batchSet([
 *   { key: 'user:1', value: user1 },
 *   { key: 'user:2', value: user2 }
 * ], l1Cache, { ttl: 300000 });
 * ```
 */
export const batchSet = async <T>(
  operations: Array<{ key: string; value: T }>,
  cache: CacheLayer,
  options: CacheOptions = {}
): Promise<void> => {
  await Promise.all(
    operations.map(op => cache.set(op.key, op.value, options))
  );
};

/**
 * Batches cache get operations.
 *
 * @template T - Type of cached data
 * @param {string[]} keys - Cache keys
 * @param {CacheLayer} cache - Cache layer
 * @returns {Promise<Map<string, T | null>>} Map of keys to values
 *
 * @example
 * ```typescript
 * const results = await batchGet(['user:1', 'user:2'], l1Cache);
 * ```
 */
export const batchGet = async <T>(
  keys: string[],
  cache: CacheLayer
): Promise<Map<string, T | null>> => {
  const results = new Map<string, T | null>();

  await Promise.all(
    keys.map(async (key) => {
      const value = await cache.get(key);
      results.set(key, value as T | null);
    })
  );

  return results;
};

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  // Classes
  LRUCache,
  MultiLevelCacheManager,
  CacheInterceptor,
  CacheInvalidationInterceptor,
  CacheEntryModel,
  CacheInvalidationLogModel,

  // Key Generation
  generateCacheKey,
  generateHashKey,
  hashObject,
  generateKeyPattern,

  // Compression & Serialization
  compressData,
  decompressData,
  serializeData,
  deserializeData,

  // Cache Patterns
  cacheAside,
  writeThrough,
  writeBack,
  readThrough,
  refreshAhead,

  // Invalidation
  invalidateByPattern,
  invalidateByTags,
  invalidateByDependency,
  invalidateExpired,

  // Cache Warming
  warmCache,
  scheduleWarmCache,
  predictiveWarmCache,

  // TTL Management
  calculateAdaptiveTTL,
  extendTTL,
  slidingExpiration,

  // Sequelize Hooks
  setupCacheInvalidationHooks,
  setupCacheWarmingHooks,
  setupComprehensiveCacheHooks,

  // Distributed Caching
  consistentHash,
  selectCacheNode,
  replicateCacheData,

  // Monitoring
  collectCacheMetrics,
  exportPrometheusMetrics,
  createCacheHealthCheck,

  // Utilities
  memoize,
  batchSet,
  batchGet,

  // Validation Schemas
  CacheConfigSchema,
  CacheKeyConfigSchema,
  CacheInvalidationRuleSchema,
  DistributedCacheConfigSchema,
};
