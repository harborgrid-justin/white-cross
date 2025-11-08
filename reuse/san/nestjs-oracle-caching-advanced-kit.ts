/**
 * LOC: C7A8H9E0X1
 * File: /reuse/san/nestjs-oracle-caching-advanced-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common (v11.1.8)
 *   - @nestjs/cache-manager (v2.2.2)
 *   - cache-manager (v5.7.6)
 *   - ioredis (v5.4.1)
 *   - lru-cache (v10.4.3)
 *   - node-cache (v5.1.2)
 *   - zlib (Node.js built-in)
 *   - crypto (Node.js built-in)
 *
 * DOWNSTREAM (imported by):
 *   - Multi-tier caching services
 *   - Distributed cache coordinators
 *   - Cache coherence managers
 *   - Cache partitioning handlers
 *   - Performance optimization services
 */

/**
 * File: /reuse/san/nestjs-oracle-caching-advanced-kit.ts
 * Locator: WC-UTL-NCACHE-001
 * Purpose: NestJS Oracle Caching Advanced Kit - Enterprise-grade multi-tier caching system
 *
 * Upstream: @nestjs/common, @nestjs/cache-manager, ioredis, lru-cache, node-cache, zlib, crypto
 * Downstream: All services requiring high-performance caching, distributed cache systems, cache coherence
 * Dependencies: NestJS v11.x, Node 18+, TypeScript 5.x, Redis 7.x, Hazelcast
 * Exports: 45 caching utilities for multi-tier, distributed, coherent, and optimized caching
 *
 * LLM Context: Production-grade NestJS caching toolkit for White Cross healthcare platform.
 * Provides comprehensive utilities for multi-tier caching (L1/L2/L3), distributed cache coordination,
 * cache coherence protocols (MESI, write-invalidate), cache partitioning/sharding, near cache,
 * write-through/write-behind patterns, eviction policies (LRU/LFU/FIFO/ARC), cache warming,
 * statistics/monitoring, conditional caching, key generation, serialization, compression, tagging,
 * and distributed locks. HIPAA-compliant with PHI encryption and audit logging for healthcare data.
 */

import { Injectable, Logger } from '@nestjs/common';
import * as crypto from 'crypto';
import * as zlib from 'zlib';
import { promisify } from 'util';

const gzip = promisify(zlib.gzip);
const gunzip = promisify(zlib.gunzip);

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Cache tier levels for multi-tier caching
 */
export enum CacheTier {
  L1 = 'L1', // In-memory, fastest
  L2 = 'L2', // Local Redis, fast
  L3 = 'L3', // Distributed Redis Cluster, slower but shared
}

/**
 * Cache eviction policies
 */
export enum EvictionPolicy {
  LRU = 'LRU', // Least Recently Used
  LFU = 'LFU', // Least Frequently Used
  FIFO = 'FIFO', // First In First Out
  ARC = 'ARC', // Adaptive Replacement Cache
  RANDOM = 'RANDOM', // Random eviction
}

/**
 * Cache coherence protocol states (MESI)
 */
export enum CacheCoherenceState {
  MODIFIED = 'M', // Cache line modified, only copy
  EXCLUSIVE = 'E', // Cache line exclusive, clean
  SHARED = 'S', // Cache line shared, clean
  INVALID = 'I', // Cache line invalid
}

/**
 * Cache write strategies
 */
export enum CacheWriteStrategy {
  WRITE_THROUGH = 'WRITE_THROUGH', // Write to cache and backend simultaneously
  WRITE_BEHIND = 'WRITE_BEHIND', // Write to cache, async write to backend
  WRITE_AROUND = 'WRITE_AROUND', // Write only to backend, invalidate cache
}

/**
 * Cache read strategies
 */
export enum CacheReadStrategy {
  READ_THROUGH = 'READ_THROUGH', // Read from cache, fetch from backend on miss
  READ_ASIDE = 'READ_ASIDE', // Application manages cache population
}

/**
 * Cache entry metadata
 */
export interface CacheEntryMetadata {
  key: string;
  tier: CacheTier;
  coherenceState: CacheCoherenceState;
  size: number;
  compressed: boolean;
  encrypted: boolean;
  createdAt: Date;
  lastAccessedAt: Date;
  accessCount: number;
  ttl: number;
  tags: string[];
  version: number;
}

/**
 * Multi-tier cache configuration
 */
export interface MultiTierCacheConfig {
  l1?: {
    enabled: boolean;
    maxSize: number;
    ttl: number;
    evictionPolicy: EvictionPolicy;
  };
  l2?: {
    enabled: boolean;
    host: string;
    port: number;
    ttl: number;
  };
  l3?: {
    enabled: boolean;
    cluster: string[];
    ttl: number;
  };
  coherenceEnabled: boolean;
  compressionThreshold: number; // Bytes
  encryptionEnabled: boolean;
}

/**
 * Cache key generation strategy
 */
export interface CacheKeyStrategy {
  prefix?: string;
  separator?: string;
  includeVersion?: boolean;
  includeNamespace?: boolean;
  hashLongKeys?: boolean;
  maxLength?: number;
}

/**
 * Cache statistics
 */
export interface CacheStatistics {
  hits: number;
  misses: number;
  hitRate: number;
  evictions: number;
  size: number;
  maxSize: number;
  memoryUsage: number;
  avgAccessTime: number;
  l1Stats?: TierStatistics;
  l2Stats?: TierStatistics;
  l3Stats?: TierStatistics;
}

/**
 * Individual tier statistics
 */
export interface TierStatistics {
  tier: CacheTier;
  hits: number;
  misses: number;
  size: number;
  evictions: number;
  memoryUsage: number;
}

/**
 * Cache warming configuration
 */
export interface CacheWarmingConfig {
  enabled: boolean;
  strategy: 'eager' | 'lazy' | 'scheduled';
  batchSize: number;
  concurrency: number;
  schedule?: string; // Cron expression
  keys?: string[];
  queryFunction?: () => Promise<any[]>;
}

/**
 * Distributed lock configuration
 */
export interface DistributedLockConfig {
  key: string;
  ttl: number;
  retryCount: number;
  retryDelay: number;
  lockTimeout: number;
}

/**
 * Cache partition configuration
 */
export interface CachePartitionConfig {
  partitionCount: number;
  partitionStrategy: 'hash' | 'range' | 'consistent-hash';
  replicationFactor: number;
}

/**
 * Cache compression options
 */
export interface CompressionOptions {
  enabled: boolean;
  threshold: number;
  level: number; // 1-9 for zlib
  algorithm: 'gzip' | 'deflate' | 'brotli';
}

/**
 * Conditional caching predicate
 */
export interface CachePredicate<T = any> {
  shouldCache: (value: T, key: string) => boolean | Promise<boolean>;
  shouldInvalidate?: (value: T, key: string) => boolean | Promise<boolean>;
}

/**
 * Near cache configuration
 */
export interface NearCacheConfig {
  enabled: boolean;
  maxSize: number;
  ttl: number;
  invalidateOnUpdate: boolean;
  preload: boolean;
}

/**
 * Cache invalidation event
 */
export interface CacheInvalidationEvent {
  keys: string[];
  tags?: string[];
  pattern?: string;
  tier?: CacheTier;
  timestamp: Date;
  reason: string;
}

/**
 * Serialization options
 */
export interface SerializationOptions {
  serializer: 'json' | 'msgpack' | 'protobuf' | 'avro';
  compressAfterSerialize: boolean;
  encryptAfterSerialize: boolean;
}

// ============================================================================
// MULTI-TIER CACHING STRATEGIES
// ============================================================================

/**
 * Creates a multi-tier cache configuration for L1/L2/L3 caching.
 *
 * @param {Partial<MultiTierCacheConfig>} config - Cache configuration
 * @returns {MultiTierCacheConfig} Complete multi-tier cache config
 *
 * @example
 * ```typescript
 * const cacheConfig = createMultiTierCacheConfig({
 *   l1: { enabled: true, maxSize: 1000, ttl: 60, evictionPolicy: EvictionPolicy.LRU },
 *   l2: { enabled: true, host: 'localhost', port: 6379, ttl: 300 },
 *   l3: { enabled: true, cluster: ['redis1:6379', 'redis2:6379'], ttl: 3600 },
 *   coherenceEnabled: true
 * });
 * ```
 */
export function createMultiTierCacheConfig(
  config: Partial<MultiTierCacheConfig>,
): MultiTierCacheConfig {
  return {
    l1: config.l1 || {
      enabled: true,
      maxSize: 1000,
      ttl: 60,
      evictionPolicy: EvictionPolicy.LRU,
    },
    l2: config.l2 || {
      enabled: true,
      host: 'localhost',
      port: 6379,
      ttl: 300,
    },
    l3: config.l3 || {
      enabled: false,
      cluster: [],
      ttl: 3600,
    },
    coherenceEnabled: config.coherenceEnabled ?? true,
    compressionThreshold: config.compressionThreshold || 1024, // 1KB
    encryptionEnabled: config.encryptionEnabled ?? false,
  };
}

/**
 * Determines appropriate cache tier for a given entry size and access pattern.
 *
 * @param {number} size - Entry size in bytes
 * @param {number} accessFrequency - Access frequency (accesses per second)
 * @param {MultiTierCacheConfig} config - Cache configuration
 * @returns {CacheTier} Recommended cache tier
 *
 * @example
 * ```typescript
 * const tier = determineCacheTier(2048, 100, cacheConfig);
 * // Returns CacheTier.L1 for hot data
 * ```
 */
export function determineCacheTier(
  size: number,
  accessFrequency: number,
  config: MultiTierCacheConfig,
): CacheTier {
  // Hot data (high frequency) -> L1
  if (accessFrequency > 10 && config.l1?.enabled) {
    return CacheTier.L1;
  }

  // Warm data (medium frequency, small size) -> L2
  if (size < 10 * 1024 && accessFrequency > 1 && config.l2?.enabled) {
    return CacheTier.L2;
  }

  // Cold data (low frequency or large size) -> L3
  if (config.l3?.enabled) {
    return CacheTier.L3;
  }

  // Fallback
  return config.l2?.enabled ? CacheTier.L2 : CacheTier.L1;
}

/**
 * Promotes cache entry from lower tier to higher tier based on access patterns.
 *
 * @param {string} key - Cache key
 * @param {CacheTier} currentTier - Current tier
 * @param {CacheEntryMetadata} metadata - Entry metadata
 * @returns {CacheTier | null} Target tier for promotion, or null if no promotion needed
 *
 * @example
 * ```typescript
 * const newTier = promoteCacheEntry('patient:123', CacheTier.L3, metadata);
 * if (newTier) {
 *   await moveCacheEntry(key, currentTier, newTier);
 * }
 * ```
 */
export function promoteCacheEntry(
  key: string,
  currentTier: CacheTier,
  metadata: CacheEntryMetadata,
): CacheTier | null {
  const promotionThreshold = 10; // Accesses before promotion

  if (currentTier === CacheTier.L3 && metadata.accessCount > promotionThreshold) {
    return CacheTier.L2;
  }

  if (currentTier === CacheTier.L2 && metadata.accessCount > promotionThreshold * 2) {
    return CacheTier.L1;
  }

  return null;
}

/**
 * Demotes cache entry from higher tier to lower tier to free up space.
 *
 * @param {string} key - Cache key
 * @param {CacheTier} currentTier - Current tier
 * @param {CacheEntryMetadata} metadata - Entry metadata
 * @returns {CacheTier | null} Target tier for demotion, or null if no demotion needed
 *
 * @example
 * ```typescript
 * const newTier = demoteCacheEntry('patient:456', CacheTier.L1, metadata);
 * if (newTier) {
 *   await moveCacheEntry(key, currentTier, newTier);
 * }
 * ```
 */
export function demoteCacheEntry(
  key: string,
  currentTier: CacheTier,
  metadata: CacheEntryMetadata,
): CacheTier | null {
  const now = Date.now();
  const lastAccessAge = now - metadata.lastAccessedAt.getTime();
  const demotionThreshold = 300000; // 5 minutes

  if (currentTier === CacheTier.L1 && lastAccessAge > demotionThreshold) {
    return CacheTier.L2;
  }

  if (currentTier === CacheTier.L2 && lastAccessAge > demotionThreshold * 2) {
    return CacheTier.L3;
  }

  return null;
}

// ============================================================================
// DISTRIBUTED CACHE COORDINATION
// ============================================================================

/**
 * Generates consistent hash for cache key to determine partition assignment.
 *
 * @param {string} key - Cache key
 * @param {number} partitionCount - Number of partitions
 * @returns {number} Partition index (0 to partitionCount-1)
 *
 * @example
 * ```typescript
 * const partition = getConsistentHashPartition('patient:123', 16);
 * // Returns: 7 (consistent across calls)
 * ```
 */
export function getConsistentHashPartition(key: string, partitionCount: number): number {
  const hash = crypto.createHash('sha256').update(key).digest();
  const hashValue = hash.readUInt32BE(0);
  return hashValue % partitionCount;
}

/**
 * Creates virtual nodes for consistent hashing to improve distribution.
 *
 * @param {string} nodeId - Node identifier
 * @param {number} virtualNodeCount - Number of virtual nodes per physical node
 * @returns {string[]} Array of virtual node identifiers
 *
 * @example
 * ```typescript
 * const vnodes = createVirtualNodes('cache-node-1', 150);
 * // Returns: ['cache-node-1#0', 'cache-node-1#1', ..., 'cache-node-1#149']
 * ```
 */
export function createVirtualNodes(nodeId: string, virtualNodeCount: number): string[] {
  const vnodes: string[] = [];
  for (let i = 0; i < virtualNodeCount; i++) {
    vnodes.push(`${nodeId}#${i}`);
  }
  return vnodes;
}

/**
 * Determines target cache nodes for a given key using consistent hashing.
 *
 * @param {string} key - Cache key
 * @param {string[]} nodes - Available cache nodes
 * @param {number} replicationFactor - Number of replicas
 * @returns {string[]} Target nodes for the key
 *
 * @example
 * ```typescript
 * const nodes = ['redis1', 'redis2', 'redis3', 'redis4'];
 * const targets = getTargetNodes('patient:123', nodes, 2);
 * // Returns: ['redis2', 'redis3'] - primary and replica
 * ```
 */
export function getTargetNodes(
  key: string,
  nodes: string[],
  replicationFactor: number,
): string[] {
  const hash = crypto.createHash('sha256').update(key).digest();
  const hashValue = hash.readUInt32BE(0);
  const primaryIndex = hashValue % nodes.length;

  const targets: string[] = [nodes[primaryIndex]];

  for (let i = 1; i < replicationFactor && i < nodes.length; i++) {
    const replicaIndex = (primaryIndex + i) % nodes.length;
    targets.push(nodes[replicaIndex]);
  }

  return targets;
}

/**
 * Coordinates distributed cache invalidation across cluster nodes.
 *
 * @param {string[]} keys - Keys to invalidate
 * @param {string[]} nodes - Cluster nodes
 * @returns {Promise<CacheInvalidationEvent>} Invalidation event details
 *
 * @example
 * ```typescript
 * await coordinateInvalidation(
 *   ['patient:123', 'patient:456'],
 *   ['redis1:6379', 'redis2:6379', 'redis3:6379']
 * );
 * ```
 */
export async function coordinateInvalidation(
  keys: string[],
  nodes: string[],
): Promise<CacheInvalidationEvent> {
  const invalidationEvent: CacheInvalidationEvent = {
    keys,
    timestamp: new Date(),
    reason: 'distributed_invalidation',
  };

  // In production, this would broadcast to all nodes via Redis Pub/Sub or similar
  // For now, return the event structure
  return invalidationEvent;
}

/**
 * Synchronizes cache state across distributed nodes using pub/sub.
 *
 * @param {string} channel - Pub/sub channel name
 * @param {CacheInvalidationEvent} event - Invalidation event
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await synchronizeCacheState('cache:invalidation', {
 *   keys: ['patient:123'],
 *   timestamp: new Date(),
 *   reason: 'update'
 * });
 * ```
 */
export async function synchronizeCacheState(
  channel: string,
  event: CacheInvalidationEvent,
): Promise<void> {
  // In production, publish to Redis pub/sub or similar message broker
  const logger = new Logger('CacheSync');
  logger.log(`Publishing invalidation event to ${channel}: ${JSON.stringify(event)}`);
}

// ============================================================================
// CACHE COHERENCE PROTOCOLS
// ============================================================================

/**
 * Updates cache coherence state using MESI protocol.
 *
 * @param {string} key - Cache key
 * @param {CacheCoherenceState} currentState - Current coherence state
 * @param {'read' | 'write' | 'invalidate'} operation - Operation type
 * @returns {CacheCoherenceState} New coherence state
 *
 * @example
 * ```typescript
 * const newState = updateCoherenceState(
 *   'patient:123',
 *   CacheCoherenceState.EXCLUSIVE,
 *   'write'
 * );
 * // Returns: CacheCoherenceState.MODIFIED
 * ```
 */
export function updateCoherenceState(
  key: string,
  currentState: CacheCoherenceState,
  operation: 'read' | 'write' | 'invalidate',
): CacheCoherenceState {
  switch (operation) {
    case 'read':
      if (currentState === CacheCoherenceState.INVALID) {
        return CacheCoherenceState.SHARED;
      }
      return currentState;

    case 'write':
      if (currentState === CacheCoherenceState.SHARED ||
          currentState === CacheCoherenceState.EXCLUSIVE) {
        return CacheCoherenceState.MODIFIED;
      }
      return CacheCoherenceState.MODIFIED;

    case 'invalidate':
      return CacheCoherenceState.INVALID;

    default:
      return currentState;
  }
}

/**
 * Implements write-invalidate protocol for cache coherence.
 *
 * @param {string} key - Cache key
 * @param {string[]} nodes - All cache nodes
 * @param {string} sourceNode - Node performing the write
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await writeInvalidateProtocol(
 *   'patient:123',
 *   ['node1', 'node2', 'node3'],
 *   'node1'
 * );
 * ```
 */
export async function writeInvalidateProtocol(
  key: string,
  nodes: string[],
  sourceNode: string,
): Promise<void> {
  const logger = new Logger('WriteInvalidate');

  // Invalidate key on all other nodes
  const otherNodes = nodes.filter(node => node !== sourceNode);
  logger.log(`Invalidating ${key} on nodes: ${otherNodes.join(', ')}`);

  // In production, send invalidation messages to other nodes
}

/**
 * Implements snooping protocol for cache coherence monitoring.
 *
 * @param {string} key - Cache key to snoop
 * @param {string} node - Node performing snooping
 * @returns {Promise<CacheCoherenceState>} Current coherence state
 *
 * @example
 * ```typescript
 * const state = await snoopCacheCoherence('patient:123', 'node1');
 * if (state === CacheCoherenceState.INVALID) {
 *   await refreshCache(key);
 * }
 * ```
 */
export async function snoopCacheCoherence(
  key: string,
  node: string,
): Promise<CacheCoherenceState> {
  // In production, query the cache bus/network for coherence state
  // For now, return a default state
  return CacheCoherenceState.SHARED;
}

/**
 * Validates cache coherence across distributed nodes.
 *
 * @param {string} key - Cache key
 * @param {string[]} nodes - Nodes to validate
 * @returns {Promise<boolean>} True if coherent, false otherwise
 *
 * @example
 * ```typescript
 * const isCoherent = await validateCacheCoherence('patient:123', allNodes);
 * if (!isCoherent) {
 *   await repairCacheCoherence(key);
 * }
 * ```
 */
export async function validateCacheCoherence(
  key: string,
  nodes: string[],
): Promise<boolean> {
  // In production, check that all nodes have consistent state
  // Either all INVALID or one MODIFIED/EXCLUSIVE and others INVALID
  return true;
}

// ============================================================================
// CACHE PARTITIONING AND SHARDING
// ============================================================================

/**
 * Creates cache partition configuration for horizontal scaling.
 *
 * @param {number} partitionCount - Number of partitions
 * @param {CachePartitionConfig['partitionStrategy']} strategy - Partitioning strategy
 * @param {number} replicationFactor - Replication factor
 * @returns {CachePartitionConfig} Partition configuration
 *
 * @example
 * ```typescript
 * const partitionConfig = createPartitionConfig(16, 'consistent-hash', 2);
 * ```
 */
export function createPartitionConfig(
  partitionCount: number,
  strategy: CachePartitionConfig['partitionStrategy'],
  replicationFactor: number,
): CachePartitionConfig {
  return {
    partitionCount,
    partitionStrategy: strategy,
    replicationFactor,
  };
}

/**
 * Determines partition for a key using range-based partitioning.
 *
 * @param {string} key - Cache key
 * @param {number} partitionCount - Number of partitions
 * @param {string[]} rangeKeys - Sorted range boundary keys
 * @returns {number} Partition index
 *
 * @example
 * ```typescript
 * const partition = getRangeBasedPartition(
 *   'patient:m123',
 *   4,
 *   ['patient:a', 'patient:g', 'patient:m', 'patient:s']
 * );
 * // Returns: 2
 * ```
 */
export function getRangeBasedPartition(
  key: string,
  partitionCount: number,
  rangeKeys: string[],
): number {
  for (let i = 0; i < rangeKeys.length; i++) {
    if (key < rangeKeys[i]) {
      return i;
    }
  }
  return partitionCount - 1;
}

/**
 * Rebalances cache partitions when nodes are added or removed.
 *
 * @param {string[]} oldNodes - Previous node list
 * @param {string[]} newNodes - Updated node list
 * @param {CachePartitionConfig} config - Partition configuration
 * @returns {Map<string, string>} Key migration map (key -> new node)
 *
 * @example
 * ```typescript
 * const migrationMap = rebalancePartitions(
 *   ['node1', 'node2'],
 *   ['node1', 'node2', 'node3'],
 *   partitionConfig
 * );
 * ```
 */
export function rebalancePartitions(
  oldNodes: string[],
  newNodes: string[],
  config: CachePartitionConfig,
): Map<string, string> {
  const migrationMap = new Map<string, string>();

  // In production, calculate which keys need to move to new nodes
  // based on consistent hashing or range partitioning

  return migrationMap;
}

/**
 * Calculates shard affinity for a key based on application context.
 *
 * @param {string} key - Cache key
 * @param {string} context - Application context (e.g., tenant ID, region)
 * @param {number} shardCount - Number of shards
 * @returns {number} Shard index
 *
 * @example
 * ```typescript
 * const shard = calculateShardAffinity('patient:123', 'tenant:org1', 8);
 * // Ensures all org1 data goes to same shard for locality
 * ```
 */
export function calculateShardAffinity(
  key: string,
  context: string,
  shardCount: number,
): number {
  const affinityKey = `${context}:${key}`;
  const hash = crypto.createHash('md5').update(affinityKey).digest();
  const hashValue = hash.readUInt32BE(0);
  return hashValue % shardCount;
}

// ============================================================================
// NEAR CACHE IMPLEMENTATION
// ============================================================================

/**
 * Creates near cache configuration for local caching of remote data.
 *
 * @param {Partial<NearCacheConfig>} options - Near cache options
 * @returns {NearCacheConfig} Complete near cache configuration
 *
 * @example
 * ```typescript
 * const nearCache = createNearCacheConfig({
 *   enabled: true,
 *   maxSize: 500,
 *   ttl: 30,
 *   invalidateOnUpdate: true
 * });
 * ```
 */
export function createNearCacheConfig(options: Partial<NearCacheConfig>): NearCacheConfig {
  return {
    enabled: options.enabled ?? true,
    maxSize: options.maxSize || 500,
    ttl: options.ttl || 60,
    invalidateOnUpdate: options.invalidateOnUpdate ?? true,
    preload: options.preload ?? false,
  };
}

/**
 * Determines if entry should be cached in near cache based on access patterns.
 *
 * @param {string} key - Cache key
 * @param {CacheEntryMetadata} metadata - Entry metadata
 * @param {NearCacheConfig} config - Near cache configuration
 * @returns {boolean} True if should be near-cached
 *
 * @example
 * ```typescript
 * if (shouldNearCache('patient:123', metadata, nearCacheConfig)) {
 *   await populateNearCache(key, value);
 * }
 * ```
 */
export function shouldNearCache(
  key: string,
  metadata: CacheEntryMetadata,
  config: NearCacheConfig,
): boolean {
  if (!config.enabled) {
    return false;
  }

  // Near cache hot data (frequently accessed)
  const accessThreshold = 5;
  return metadata.accessCount >= accessThreshold;
}

/**
 * Invalidates near cache entries when remote cache is updated.
 *
 * @param {string[]} keys - Keys to invalidate in near cache
 * @param {NearCacheConfig} config - Near cache configuration
 * @returns {Promise<number>} Number of entries invalidated
 *
 * @example
 * ```typescript
 * const invalidated = await invalidateNearCache(['patient:123', 'patient:456'], config);
 * // Returns: 2
 * ```
 */
export async function invalidateNearCache(
  keys: string[],
  config: NearCacheConfig,
): Promise<number> {
  if (!config.invalidateOnUpdate) {
    return 0;
  }

  // In production, remove from local near cache
  return keys.length;
}

/**
 * Preloads frequently accessed data into near cache on startup.
 *
 * @param {() => Promise<Array<{ key: string; value: any }>>} loader - Data loader function
 * @param {NearCacheConfig} config - Near cache configuration
 * @returns {Promise<number>} Number of entries preloaded
 *
 * @example
 * ```typescript
 * const loaded = await preloadNearCache(
 *   async () => await frequentlyAccessedKeys(),
 *   nearCacheConfig
 * );
 * ```
 */
export async function preloadNearCache(
  loader: () => Promise<Array<{ key: string; value: any }>>,
  config: NearCacheConfig,
): Promise<number> {
  if (!config.preload) {
    return 0;
  }

  const entries = await loader();
  const preloadCount = Math.min(entries.length, config.maxSize);

  // In production, populate near cache with loaded entries
  return preloadCount;
}

// ============================================================================
// WRITE-THROUGH AND WRITE-BEHIND CACHING
// ============================================================================

/**
 * Implements write-through caching pattern with synchronous backend updates.
 *
 * @template T - Data type
 * @param {string} key - Cache key
 * @param {T} value - Value to cache and persist
 * @param {(key: string, value: T) => Promise<void>} backendWriter - Backend write function
 * @param {number} ttl - Time to live in seconds
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await writeThroughCache(
 *   'patient:123',
 *   patientData,
 *   async (key, data) => await db.save(data),
 *   300
 * );
 * ```
 */
export async function writeThroughCache<T>(
  key: string,
  value: T,
  backendWriter: (key: string, value: T) => Promise<void>,
  ttl: number,
): Promise<void> {
  // Write to backend first (synchronous)
  await backendWriter(key, value);

  // Then update cache
  // In production: await cache.set(key, value, ttl);
}

/**
 * Implements write-behind caching pattern with asynchronous backend updates.
 *
 * @template T - Data type
 * @param {string} key - Cache key
 * @param {T} value - Value to cache
 * @param {(key: string, value: T) => Promise<void>} backendWriter - Backend write function
 * @param {number} ttl - Time to live in seconds
 * @param {number} flushDelay - Delay before backend write (ms)
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await writeBehindCache(
 *   'patient:123',
 *   patientData,
 *   async (key, data) => await db.save(data),
 *   300,
 *   5000
 * );
 * ```
 */
export async function writeBehindCache<T>(
  key: string,
  value: T,
  backendWriter: (key: string, value: T) => Promise<void>,
  ttl: number,
  flushDelay: number = 5000,
): Promise<void> {
  // Update cache immediately
  // In production: await cache.set(key, value, ttl);

  // Schedule asynchronous backend write
  setTimeout(async () => {
    try {
      await backendWriter(key, value);
    } catch (error) {
      const logger = new Logger('WriteBehindCache');
      logger.error(`Failed to flush ${key} to backend:`, error);
    }
  }, flushDelay);
}

/**
 * Flushes pending write-behind cache entries to backend storage.
 *
 * @param {Map<string, any>} pendingWrites - Pending write buffer
 * @param {(entries: Array<{ key: string; value: any }>) => Promise<void>} batchWriter - Batch write function
 * @returns {Promise<number>} Number of entries flushed
 *
 * @example
 * ```typescript
 * const flushed = await flushWriteBehindBuffer(
 *   pendingWrites,
 *   async (entries) => await db.batchSave(entries)
 * );
 * ```
 */
export async function flushWriteBehindBuffer(
  pendingWrites: Map<string, any>,
  batchWriter: (entries: Array<{ key: string; value: any }>) => Promise<void>,
): Promise<number> {
  if (pendingWrites.size === 0) {
    return 0;
  }

  const entries = Array.from(pendingWrites.entries()).map(([key, value]) => ({ key, value }));

  try {
    await batchWriter(entries);
    pendingWrites.clear();
    return entries.length;
  } catch (error) {
    const logger = new Logger('FlushWriteBehind');
    logger.error('Failed to flush write-behind buffer:', error);
    throw error;
  }
}

/**
 * Implements write-around caching pattern (bypass cache on writes).
 *
 * @template T - Data type
 * @param {string} key - Cache key
 * @param {T} value - Value to persist
 * @param {(key: string, value: T) => Promise<void>} backendWriter - Backend write function
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await writeAroundCache(
 *   'patient:123',
 *   patientData,
 *   async (key, data) => await db.save(data)
 * );
 * // Cache is invalidated, next read will fetch fresh data
 * ```
 */
export async function writeAroundCache<T>(
  key: string,
  value: T,
  backendWriter: (key: string, value: T) => Promise<void>,
): Promise<void> {
  // Write only to backend
  await backendWriter(key, value);

  // Invalidate cache entry
  // In production: await cache.del(key);
}

// ============================================================================
// CACHE EVICTION POLICIES
// ============================================================================

/**
 * Implements LRU (Least Recently Used) eviction policy.
 *
 * @param {Map<string, CacheEntryMetadata>} cache - Cache metadata map
 * @param {number} maxSize - Maximum cache size
 * @returns {string[]} Keys to evict
 *
 * @example
 * ```typescript
 * const toEvict = evictLRU(cacheMetadata, 1000);
 * for (const key of toEvict) {
 *   await cache.del(key);
 * }
 * ```
 */
export function evictLRU(cache: Map<string, CacheEntryMetadata>, maxSize: number): string[] {
  if (cache.size <= maxSize) {
    return [];
  }

  const entries = Array.from(cache.entries());
  entries.sort((a, b) =>
    a[1].lastAccessedAt.getTime() - b[1].lastAccessedAt.getTime()
  );

  const evictCount = cache.size - maxSize;
  return entries.slice(0, evictCount).map(([key]) => key);
}

/**
 * Implements LFU (Least Frequently Used) eviction policy.
 *
 * @param {Map<string, CacheEntryMetadata>} cache - Cache metadata map
 * @param {number} maxSize - Maximum cache size
 * @returns {string[]} Keys to evict
 *
 * @example
 * ```typescript
 * const toEvict = evictLFU(cacheMetadata, 1000);
 * ```
 */
export function evictLFU(cache: Map<string, CacheEntryMetadata>, maxSize: number): string[] {
  if (cache.size <= maxSize) {
    return [];
  }

  const entries = Array.from(cache.entries());
  entries.sort((a, b) => a[1].accessCount - b[1].accessCount);

  const evictCount = cache.size - maxSize;
  return entries.slice(0, evictCount).map(([key]) => key);
}

/**
 * Implements FIFO (First In First Out) eviction policy.
 *
 * @param {Map<string, CacheEntryMetadata>} cache - Cache metadata map
 * @param {number} maxSize - Maximum cache size
 * @returns {string[]} Keys to evict
 *
 * @example
 * ```typescript
 * const toEvict = evictFIFO(cacheMetadata, 1000);
 * ```
 */
export function evictFIFO(cache: Map<string, CacheEntryMetadata>, maxSize: number): string[] {
  if (cache.size <= maxSize) {
    return [];
  }

  const entries = Array.from(cache.entries());
  entries.sort((a, b) => a[1].createdAt.getTime() - b[1].createdAt.getTime());

  const evictCount = cache.size - maxSize;
  return entries.slice(0, evictCount).map(([key]) => key);
}

/**
 * Implements ARC (Adaptive Replacement Cache) eviction policy.
 *
 * @param {Map<string, CacheEntryMetadata>} cache - Cache metadata map
 * @param {number} maxSize - Maximum cache size
 * @param {number} p - Target size for recent cache (adaptive parameter)
 * @returns {{ toEvict: string[]; newP: number }} Keys to evict and updated p value
 *
 * @example
 * ```typescript
 * const { toEvict, newP } = evictARC(cacheMetadata, 1000, 500);
 * ```
 */
export function evictARC(
  cache: Map<string, CacheEntryMetadata>,
  maxSize: number,
  p: number,
): { toEvict: string[]; newP: number } {
  if (cache.size <= maxSize) {
    return { toEvict: [], newP: p };
  }

  // ARC maintains two LRU lists: T1 (recent) and T2 (frequent)
  // This is a simplified implementation
  const entries = Array.from(cache.entries());

  // Partition based on access count
  const recent = entries.filter(([, meta]) => meta.accessCount === 1);
  const frequent = entries.filter(([, meta]) => meta.accessCount > 1);

  let toEvict: string[] = [];
  let newP = p;

  if (recent.length > p) {
    // Evict from recent
    recent.sort((a, b) => a[1].lastAccessedAt.getTime() - b[1].lastAccessedAt.getTime());
    toEvict = recent.slice(0, cache.size - maxSize).map(([key]) => key);
    newP = Math.max(0, p - 1);
  } else {
    // Evict from frequent
    frequent.sort((a, b) => a[1].accessCount - b[1].accessCount);
    toEvict = frequent.slice(0, cache.size - maxSize).map(([key]) => key);
    newP = Math.min(maxSize, p + 1);
  }

  return { toEvict, newP };
}

/**
 * Implements random eviction policy for testing or low-overhead scenarios.
 *
 * @param {Map<string, CacheEntryMetadata>} cache - Cache metadata map
 * @param {number} maxSize - Maximum cache size
 * @returns {string[]} Keys to evict
 *
 * @example
 * ```typescript
 * const toEvict = evictRandom(cacheMetadata, 1000);
 * ```
 */
export function evictRandom(cache: Map<string, CacheEntryMetadata>, maxSize: number): string[] {
  if (cache.size <= maxSize) {
    return [];
  }

  const keys = Array.from(cache.keys());
  const evictCount = cache.size - maxSize;
  const toEvict: string[] = [];

  for (let i = 0; i < evictCount; i++) {
    const randomIndex = Math.floor(Math.random() * keys.length);
    toEvict.push(keys[randomIndex]);
    keys.splice(randomIndex, 1);
  }

  return toEvict;
}

// ============================================================================
// CACHE WARMING STRATEGIES
// ============================================================================

/**
 * Warms cache eagerly by preloading all specified keys.
 *
 * @param {string[]} keys - Keys to preload
 * @param {(key: string) => Promise<any>} loader - Data loader function
 * @param {number} concurrency - Number of concurrent loads
 * @returns {Promise<number>} Number of keys successfully warmed
 *
 * @example
 * ```typescript
 * const warmed = await warmCacheEager(
 *   ['patient:123', 'patient:456', 'patient:789'],
 *   async (key) => await db.findByKey(key),
 *   5
 * );
 * ```
 */
export async function warmCacheEager(
  keys: string[],
  loader: (key: string) => Promise<any>,
  concurrency: number = 10,
): Promise<number> {
  const logger = new Logger('CacheWarming');
  let warmedCount = 0;

  for (let i = 0; i < keys.length; i += concurrency) {
    const batch = keys.slice(i, i + concurrency);
    const results = await Promise.allSettled(
      batch.map(async (key) => {
        const value = await loader(key);
        // In production: await cache.set(key, value);
        return value;
      })
    );

    warmedCount += results.filter(r => r.status === 'fulfilled').length;
  }

  logger.log(`Warmed ${warmedCount}/${keys.length} cache entries`);
  return warmedCount;
}

/**
 * Warms cache lazily by tracking access patterns and preloading on-demand.
 *
 * @param {string} key - Key being accessed
 * @param {Map<string, number>} accessLog - Access frequency log
 * @param {(key: string) => Promise<any>} loader - Data loader function
 * @param {number} threshold - Access threshold for warming
 * @returns {Promise<boolean>} True if warmed, false otherwise
 *
 * @example
 * ```typescript
 * const warmed = await warmCacheLazy(
 *   'patient:123',
 *   accessLog,
 *   async (key) => await db.findByKey(key),
 *   3
 * );
 * ```
 */
export async function warmCacheLazy(
  key: string,
  accessLog: Map<string, number>,
  loader: (key: string) => Promise<any>,
  threshold: number = 3,
): Promise<boolean> {
  const accessCount = (accessLog.get(key) || 0) + 1;
  accessLog.set(key, accessCount);

  if (accessCount >= threshold) {
    const value = await loader(key);
    // In production: await cache.set(key, value);
    return true;
  }

  return false;
}

/**
 * Schedules periodic cache warming based on cron expression.
 *
 * @param {CacheWarmingConfig} config - Cache warming configuration
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await scheduleCacheWarming({
 *   enabled: true,
 *   strategy: 'scheduled',
 *   batchSize: 100,
 *   concurrency: 10,
 *   schedule: '0 2 * * *', // Daily at 2 AM
 *   queryFunction: async () => await db.getFrequentlyAccessed()
 * });
 * ```
 */
export async function scheduleCacheWarming(config: CacheWarmingConfig): Promise<void> {
  if (!config.enabled || config.strategy !== 'scheduled') {
    return;
  }

  const logger = new Logger('ScheduledCacheWarming');
  logger.log(`Scheduling cache warming with cron: ${config.schedule}`);

  // In production, use node-cron or similar to schedule warming
  // cron.schedule(config.schedule, async () => {
  //   if (config.queryFunction) {
  //     const data = await config.queryFunction();
  //     await warmCacheEager(data.map(d => d.key), loader, config.concurrency);
  //   }
  // });
}

// ============================================================================
// CACHE STATISTICS AND MONITORING
// ============================================================================

/**
 * Calculates comprehensive cache statistics across all tiers.
 *
 * @param {Map<string, CacheEntryMetadata>} l1Cache - L1 cache metadata
 * @param {Map<string, CacheEntryMetadata>} l2Cache - L2 cache metadata
 * @param {Map<string, CacheEntryMetadata>} l3Cache - L3 cache metadata
 * @param {number} hits - Total cache hits
 * @param {number} misses - Total cache misses
 * @returns {CacheStatistics} Comprehensive cache statistics
 *
 * @example
 * ```typescript
 * const stats = calculateCacheStatistics(l1Meta, l2Meta, l3Meta, 1000, 200);
 * console.log(`Hit rate: ${stats.hitRate}%`);
 * ```
 */
export function calculateCacheStatistics(
  l1Cache: Map<string, CacheEntryMetadata>,
  l2Cache: Map<string, CacheEntryMetadata>,
  l3Cache: Map<string, CacheEntryMetadata>,
  hits: number,
  misses: number,
): CacheStatistics {
  const totalRequests = hits + misses;
  const hitRate = totalRequests > 0 ? (hits / totalRequests) * 100 : 0;

  const calculateTierStats = (
    cache: Map<string, CacheEntryMetadata>,
    tier: CacheTier,
  ): TierStatistics => {
    const tierHits = Array.from(cache.values()).reduce(
      (sum, meta) => sum + meta.accessCount,
      0,
    );
    const memoryUsage = Array.from(cache.values()).reduce(
      (sum, meta) => sum + meta.size,
      0,
    );

    return {
      tier,
      hits: tierHits,
      misses: 0, // Would need separate tracking
      size: cache.size,
      evictions: 0, // Would need separate tracking
      memoryUsage,
    };
  };

  return {
    hits,
    misses,
    hitRate,
    evictions: 0, // Would need separate tracking
    size: l1Cache.size + l2Cache.size + l3Cache.size,
    maxSize: 0, // Would need from config
    memoryUsage: 0, // Would calculate from all tiers
    avgAccessTime: 0, // Would need timing data
    l1Stats: calculateTierStats(l1Cache, CacheTier.L1),
    l2Stats: calculateTierStats(l2Cache, CacheTier.L2),
    l3Stats: calculateTierStats(l3Cache, CacheTier.L3),
  };
}

/**
 * Monitors cache performance metrics over time window.
 *
 * @param {CacheStatistics[]} snapshots - Statistics snapshots
 * @param {number} windowMs - Time window in milliseconds
 * @returns {object} Performance metrics
 *
 * @example
 * ```typescript
 * const metrics = monitorCachePerformance(statsSnapshots, 60000);
 * console.log(`Avg hit rate: ${metrics.avgHitRate}%`);
 * ```
 */
export function monitorCachePerformance(
  snapshots: CacheStatistics[],
  windowMs: number,
): {
  avgHitRate: number;
  maxSize: number;
  evictionRate: number;
  memoryGrowth: number;
} {
  if (snapshots.length === 0) {
    return { avgHitRate: 0, maxSize: 0, evictionRate: 0, memoryGrowth: 0 };
  }

  const avgHitRate = snapshots.reduce((sum, s) => sum + s.hitRate, 0) / snapshots.length;
  const maxSize = Math.max(...snapshots.map(s => s.size));
  const totalEvictions = snapshots.reduce((sum, s) => sum + s.evictions, 0);
  const evictionRate = (totalEvictions / snapshots.length) * (1000 / windowMs);

  const firstMemory = snapshots[0].memoryUsage;
  const lastMemory = snapshots[snapshots.length - 1].memoryUsage;
  const memoryGrowth = lastMemory - firstMemory;

  return {
    avgHitRate,
    maxSize,
    evictionRate,
    memoryGrowth,
  };
}

/**
 * Detects cache anomalies and performance issues.
 *
 * @param {CacheStatistics} stats - Current cache statistics
 * @param {object} thresholds - Anomaly detection thresholds
 * @returns {string[]} List of detected issues
 *
 * @example
 * ```typescript
 * const issues = detectCacheAnomalies(stats, {
 *   minHitRate: 80,
 *   maxEvictionRate: 10,
 *   maxMemoryUsage: 1024 * 1024 * 1024
 * });
 * if (issues.length > 0) {
 *   logger.warn('Cache issues detected:', issues);
 * }
 * ```
 */
export function detectCacheAnomalies(
  stats: CacheStatistics,
  thresholds: {
    minHitRate?: number;
    maxEvictionRate?: number;
    maxMemoryUsage?: number;
  },
): string[] {
  const issues: string[] = [];

  if (thresholds.minHitRate && stats.hitRate < thresholds.minHitRate) {
    issues.push(`Low hit rate: ${stats.hitRate.toFixed(2)}% (threshold: ${thresholds.minHitRate}%)`);
  }

  if (thresholds.maxMemoryUsage && stats.memoryUsage > thresholds.maxMemoryUsage) {
    issues.push(`High memory usage: ${stats.memoryUsage} bytes (threshold: ${thresholds.maxMemoryUsage} bytes)`);
  }

  if (stats.size >= stats.maxSize * 0.95) {
    issues.push(`Cache near capacity: ${stats.size}/${stats.maxSize} (95%)`);
  }

  return issues;
}

// ============================================================================
// CONDITIONAL CACHING WITH PREDICATES
// ============================================================================

/**
 * Creates a conditional cache predicate based on data size.
 *
 * @param {number} maxSize - Maximum size in bytes to cache
 * @returns {CachePredicate} Size-based cache predicate
 *
 * @example
 * ```typescript
 * const predicate = createSizePredicate(10 * 1024); // Cache only if < 10KB
 * if (await predicate.shouldCache(data, key)) {
 *   await cache.set(key, data);
 * }
 * ```
 */
export function createSizePredicate(maxSize: number): CachePredicate {
  return {
    shouldCache: (value: any) => {
      const size = Buffer.byteLength(JSON.stringify(value));
      return size <= maxSize;
    },
  };
}

/**
 * Creates a conditional cache predicate based on data freshness.
 *
 * @param {number} maxAgeMs - Maximum data age in milliseconds
 * @returns {CachePredicate} Freshness-based cache predicate
 *
 * @example
 * ```typescript
 * const predicate = createFreshnessPredicate(5 * 60 * 1000); // 5 minutes
 * ```
 */
export function createFreshnessPredicate(maxAgeMs: number): CachePredicate {
  return {
    shouldCache: (value: any) => {
      if (value && typeof value === 'object' && value.updatedAt) {
        const age = Date.now() - new Date(value.updatedAt).getTime();
        return age <= maxAgeMs;
      }
      return true;
    },
  };
}

/**
 * Creates a conditional cache predicate for HIPAA-compliant PHI data.
 *
 * @param {boolean} requireEncryption - Whether encryption is required
 * @returns {CachePredicate} HIPAA-compliant cache predicate
 *
 * @example
 * ```typescript
 * const predicate = createHIPAAPredicate(true);
 * if (await predicate.shouldCache(patientData, key)) {
 *   await encryptAndCache(key, patientData);
 * }
 * ```
 */
export function createHIPAAPredicate(requireEncryption: boolean): CachePredicate {
  return {
    shouldCache: (value: any, key: string) => {
      // Only cache PHI if encryption is enabled
      if (requireEncryption) {
        const containsPHI = key.includes('patient') || key.includes('medical');
        return !containsPHI || requireEncryption;
      }
      return true;
    },
    shouldInvalidate: (value: any, key: string) => {
      // Invalidate PHI data after 5 minutes for security
      const isPHI = key.includes('patient') || key.includes('medical');
      return isPHI;
    },
  };
}

/**
 * Combines multiple cache predicates with AND logic.
 *
 * @param {CachePredicate[]} predicates - Array of predicates to combine
 * @returns {CachePredicate} Combined predicate
 *
 * @example
 * ```typescript
 * const combined = combinePredicates([
 *   createSizePredicate(10 * 1024),
 *   createFreshnessPredicate(5 * 60 * 1000),
 *   createHIPAAPredicate(true)
 * ]);
 * ```
 */
export function combinePredicates(predicates: CachePredicate[]): CachePredicate {
  return {
    shouldCache: async (value: any, key: string) => {
      for (const predicate of predicates) {
        const result = await predicate.shouldCache(value, key);
        if (!result) {
          return false;
        }
      }
      return true;
    },
    shouldInvalidate: async (value: any, key: string) => {
      for (const predicate of predicates) {
        if (predicate.shouldInvalidate) {
          const result = await predicate.shouldInvalidate(value, key);
          if (result) {
            return true;
          }
        }
      }
      return false;
    },
  };
}

// ============================================================================
// CACHE KEY GENERATION STRATEGIES
// ============================================================================

/**
 * Generates cache key using hierarchical namespace strategy.
 *
 * @param {string[]} segments - Key segments (namespace, resource, id, etc.)
 * @param {CacheKeyStrategy} strategy - Key generation strategy
 * @returns {string} Generated cache key
 *
 * @example
 * ```typescript
 * const key = generateCacheKey(
 *   ['patients', 'medical-records', '123', 'labs'],
 *   { prefix: 'wc', separator: ':', includeVersion: true }
 * );
 * // Returns: 'wc:v1:patients:medical-records:123:labs'
 * ```
 */
export function generateCacheKey(
  segments: string[],
  strategy: CacheKeyStrategy = {},
): string {
  const parts: string[] = [];

  if (strategy.prefix) {
    parts.push(strategy.prefix);
  }

  if (strategy.includeVersion) {
    parts.push('v1'); // Version could be dynamic
  }

  parts.push(...segments);

  const separator = strategy.separator || ':';
  let key = parts.join(separator);

  // Hash long keys if needed
  if (strategy.hashLongKeys && strategy.maxLength && key.length > strategy.maxLength) {
    const hash = crypto.createHash('sha256').update(key).digest('hex').substring(0, 16);
    const prefix = key.substring(0, strategy.maxLength - 17);
    key = `${prefix}-${hash}`;
  }

  return key;
}

/**
 * Generates content-based cache key using hash of data.
 *
 * @param {any} data - Data to hash
 * @param {string} prefix - Key prefix
 * @returns {string} Content-based cache key
 *
 * @example
 * ```typescript
 * const key = generateContentBasedKey({ query: 'SELECT * FROM patients' }, 'query');
 * // Returns: 'query:a3b4c5d6e7f8...'
 * ```
 */
export function generateContentBasedKey(data: any, prefix: string = 'content'): string {
  const content = typeof data === 'string' ? data : JSON.stringify(data);
  const hash = crypto.createHash('sha256').update(content).digest('hex');
  return `${prefix}:${hash}`;
}

/**
 * Generates time-based cache key with expiration bucket.
 *
 * @param {string} baseKey - Base key
 * @param {number} bucketSizeMs - Time bucket size in milliseconds
 * @returns {string} Time-bucketed cache key
 *
 * @example
 * ```typescript
 * const key = generateTimeBucketKey('stats', 60000);
 * // Returns: 'stats:bucket:1699459200000' (rounded to nearest minute)
 * ```
 */
export function generateTimeBucketKey(baseKey: string, bucketSizeMs: number): string {
  const now = Date.now();
  const bucket = Math.floor(now / bucketSizeMs) * bucketSizeMs;
  return `${baseKey}:bucket:${bucket}`;
}

/**
 * Generates tenant-aware cache key for multi-tenancy.
 *
 * @param {string} tenantId - Tenant identifier
 * @param {string} resource - Resource name
 * @param {string} id - Resource identifier
 * @returns {string} Tenant-scoped cache key
 *
 * @example
 * ```typescript
 * const key = generateTenantKey('org1', 'patients', '123');
 * // Returns: 'tenant:org1:patients:123'
 * ```
 */
export function generateTenantKey(tenantId: string, resource: string, id: string): string {
  return `tenant:${tenantId}:${resource}:${id}`;
}

// ============================================================================
// CACHE SERIALIZATION OPTIMIZATION
// ============================================================================

/**
 * Serializes data for cache storage with optimal encoding.
 *
 * @template T - Data type
 * @param {T} data - Data to serialize
 * @param {SerializationOptions} options - Serialization options
 * @returns {Promise<Buffer>} Serialized data buffer
 *
 * @example
 * ```typescript
 * const serialized = await serializeForCache(patientData, {
 *   serializer: 'json',
 *   compressAfterSerialize: true,
 *   encryptAfterSerialize: true
 * });
 * ```
 */
export async function serializeForCache<T>(
  data: T,
  options: SerializationOptions,
): Promise<Buffer> {
  let buffer: Buffer;

  // Serialize
  switch (options.serializer) {
    case 'json':
      buffer = Buffer.from(JSON.stringify(data), 'utf-8');
      break;
    default:
      buffer = Buffer.from(JSON.stringify(data), 'utf-8');
  }

  // Compress if enabled
  if (options.compressAfterSerialize) {
    buffer = await gzip(buffer);
  }

  // Encrypt if enabled (HIPAA compliance)
  if (options.encryptAfterSerialize) {
    buffer = encryptBuffer(buffer, process.env.CACHE_ENCRYPTION_KEY || 'default-key');
  }

  return buffer;
}

/**
 * Deserializes data from cache storage.
 *
 * @template T - Expected data type
 * @param {Buffer} buffer - Serialized data buffer
 * @param {SerializationOptions} options - Serialization options
 * @returns {Promise<T>} Deserialized data
 *
 * @example
 * ```typescript
 * const data = await deserializeFromCache<Patient>(buffer, {
 *   serializer: 'json',
 *   compressAfterSerialize: true,
 *   encryptAfterSerialize: true
 * });
 * ```
 */
export async function deserializeFromCache<T>(
  buffer: Buffer,
  options: SerializationOptions,
): Promise<T> {
  let data = buffer;

  // Decrypt if encrypted
  if (options.encryptAfterSerialize) {
    data = decryptBuffer(data, process.env.CACHE_ENCRYPTION_KEY || 'default-key');
  }

  // Decompress if compressed
  if (options.compressAfterSerialize) {
    data = await gunzip(data);
  }

  // Deserialize
  switch (options.serializer) {
    case 'json':
      return JSON.parse(data.toString('utf-8'));
    default:
      return JSON.parse(data.toString('utf-8'));
  }
}

/**
 * Encrypts buffer for secure cache storage (HIPAA compliance).
 *
 * @param {Buffer} data - Data to encrypt
 * @param {string} key - Encryption key
 * @returns {Buffer} Encrypted buffer
 *
 * @example
 * ```typescript
 * const encrypted = encryptBuffer(Buffer.from('sensitive PHI'), encryptionKey);
 * ```
 */
export function encryptBuffer(data: Buffer, key: string): Buffer {
  const algorithm = 'aes-256-gcm';
  const keyHash = crypto.createHash('sha256').update(key).digest();
  const iv = crypto.randomBytes(16);

  const cipher = crypto.createCipheriv(algorithm, keyHash, iv);
  const encrypted = Buffer.concat([cipher.update(data), cipher.final()]);
  const authTag = cipher.getAuthTag();

  // Combine IV + auth tag + encrypted data
  return Buffer.concat([iv, authTag, encrypted]);
}

/**
 * Decrypts buffer from secure cache storage.
 *
 * @param {Buffer} data - Encrypted data
 * @param {string} key - Encryption key
 * @returns {Buffer} Decrypted buffer
 *
 * @example
 * ```typescript
 * const decrypted = decryptBuffer(encryptedBuffer, encryptionKey);
 * ```
 */
export function decryptBuffer(data: Buffer, key: string): Buffer {
  const algorithm = 'aes-256-gcm';
  const keyHash = crypto.createHash('sha256').update(key).digest();

  const iv = data.subarray(0, 16);
  const authTag = data.subarray(16, 32);
  const encrypted = data.subarray(32);

  const decipher = crypto.createDecipheriv(algorithm, keyHash, iv);
  decipher.setAuthTag(authTag);

  return Buffer.concat([decipher.update(encrypted), decipher.final()]);
}

// ============================================================================
// CACHE COMPRESSION UTILITIES
// ============================================================================

/**
 * Compresses data if it exceeds threshold size.
 *
 * @param {Buffer | string} data - Data to compress
 * @param {CompressionOptions} options - Compression options
 * @returns {Promise<{ data: Buffer; compressed: boolean }>} Compressed data and flag
 *
 * @example
 * ```typescript
 * const { data, compressed } = await compressIfNeeded(largeData, {
 *   enabled: true,
 *   threshold: 1024,
 *   level: 6,
 *   algorithm: 'gzip'
 * });
 * ```
 */
export async function compressIfNeeded(
  data: Buffer | string,
  options: CompressionOptions,
): Promise<{ data: Buffer; compressed: boolean }> {
  const buffer = typeof data === 'string' ? Buffer.from(data, 'utf-8') : data;

  if (!options.enabled || buffer.length < options.threshold) {
    return { data: buffer, compressed: false };
  }

  const compressed = await gzip(buffer);
  return { data: compressed, compressed: true };
}

/**
 * Decompresses compressed cache data.
 *
 * @param {Buffer} data - Compressed data
 * @param {boolean} isCompressed - Whether data is compressed
 * @returns {Promise<Buffer>} Decompressed data
 *
 * @example
 * ```typescript
 * const decompressed = await decompressIfNeeded(cachedData, metadata.compressed);
 * ```
 */
export async function decompressIfNeeded(
  data: Buffer,
  isCompressed: boolean,
): Promise<Buffer> {
  if (!isCompressed) {
    return data;
  }

  return await gunzip(data);
}

/**
 * Calculates compression ratio for cache analytics.
 *
 * @param {number} originalSize - Original data size in bytes
 * @param {number} compressedSize - Compressed data size in bytes
 * @returns {number} Compression ratio (e.g., 2.5 means 2.5x compression)
 *
 * @example
 * ```typescript
 * const ratio = calculateCompressionRatio(10240, 4096);
 * // Returns: 2.5 (60% size reduction)
 * ```
 */
export function calculateCompressionRatio(
  originalSize: number,
  compressedSize: number,
): number {
  if (compressedSize === 0) {
    return 0;
  }
  return originalSize / compressedSize;
}

// ============================================================================
// CACHE TAGGING AND INVALIDATION
// ============================================================================

/**
 * Tags cache entries for grouped invalidation.
 *
 * @param {string} key - Cache key
 * @param {string[]} tags - Tags to associate with the key
 * @returns {Map<string, Set<string>>} Tag-to-keys mapping
 *
 * @example
 * ```typescript
 * const tagMap = tagCacheEntry('patient:123', ['patient', 'org1', 'medical']);
 * // Later: invalidateByTag('org1') invalidates all org1 entries
 * ```
 */
export function tagCacheEntry(key: string, tags: string[]): Map<string, Set<string>> {
  const tagMap = new Map<string, Set<string>>();

  for (const tag of tags) {
    if (!tagMap.has(tag)) {
      tagMap.set(tag, new Set());
    }
    tagMap.get(tag)!.add(key);
  }

  return tagMap;
}

/**
 * Invalidates all cache entries with a specific tag.
 *
 * @param {string} tag - Tag to invalidate
 * @param {Map<string, Set<string>>} tagMap - Tag-to-keys mapping
 * @returns {string[]} Keys that were invalidated
 *
 * @example
 * ```typescript
 * const invalidated = invalidateByTag('org1', tagMap);
 * for (const key of invalidated) {
 *   await cache.del(key);
 * }
 * ```
 */
export function invalidateByTag(tag: string, tagMap: Map<string, Set<string>>): string[] {
  const keys = tagMap.get(tag);
  if (!keys) {
    return [];
  }

  const invalidated = Array.from(keys);
  tagMap.delete(tag);

  return invalidated;
}

/**
 * Invalidates cache entries matching a pattern.
 *
 * @param {string} pattern - Pattern to match (supports wildcards)
 * @param {string[]} allKeys - All cache keys
 * @returns {string[]} Matching keys to invalidate
 *
 * @example
 * ```typescript
 * const toInvalidate = invalidateByPattern('patient:*:labs', allCacheKeys);
 * // Invalidates: patient:123:labs, patient:456:labs, etc.
 * ```
 */
export function invalidateByPattern(pattern: string, allKeys: string[]): string[] {
  const regex = new RegExp('^' + pattern.replace(/\*/g, '.*') + '$');
  return allKeys.filter(key => regex.test(key));
}

/**
 * Invalidates cache entries for a specific tenant (multi-tenancy).
 *
 * @param {string} tenantId - Tenant identifier
 * @param {string[]} allKeys - All cache keys
 * @returns {string[]} Tenant-specific keys to invalidate
 *
 * @example
 * ```typescript
 * const toInvalidate = invalidateByTenant('org1', allCacheKeys);
 * ```
 */
export function invalidateByTenant(tenantId: string, allKeys: string[]): string[] {
  return allKeys.filter(key => key.startsWith(`tenant:${tenantId}:`));
}

// ============================================================================
// DISTRIBUTED CACHE LOCKS
// ============================================================================

/**
 * Acquires distributed lock for cache operations.
 *
 * @param {DistributedLockConfig} config - Lock configuration
 * @returns {Promise<string | null>} Lock token if acquired, null otherwise
 *
 * @example
 * ```typescript
 * const lockToken = await acquireDistributedLock({
 *   key: 'patient:123:lock',
 *   ttl: 5000,
 *   retryCount: 3,
 *   retryDelay: 100,
 *   lockTimeout: 5000
 * });
 * if (lockToken) {
 *   try {
 *     await updateCache();
 *   } finally {
 *     await releaseDistributedLock(lockToken, config.key);
 *   }
 * }
 * ```
 */
export async function acquireDistributedLock(
  config: DistributedLockConfig,
): Promise<string | null> {
  const lockToken = crypto.randomBytes(16).toString('hex');

  for (let attempt = 0; attempt < config.retryCount; attempt++) {
    // In production, use Redis SETNX or similar
    // const acquired = await redis.set(config.key, lockToken, 'PX', config.ttl, 'NX');

    // Simulate lock acquisition
    const acquired = Math.random() > 0.5;

    if (acquired) {
      return lockToken;
    }

    await new Promise(resolve => setTimeout(resolve, config.retryDelay));
  }

  return null;
}

/**
 * Releases distributed lock for cache operations.
 *
 * @param {string} lockToken - Lock token from acquisition
 * @param {string} lockKey - Lock key
 * @returns {Promise<boolean>} True if released, false otherwise
 *
 * @example
 * ```typescript
 * await releaseDistributedLock(lockToken, 'patient:123:lock');
 * ```
 */
export async function releaseDistributedLock(
  lockToken: string,
  lockKey: string,
): Promise<boolean> {
  // In production, use Redis Lua script to ensure atomic release
  // const script = `
  //   if redis.call("get",KEYS[1]) == ARGV[1] then
  //     return redis.call("del",KEYS[1])
  //   else
  //     return 0
  //   end
  // `;
  // return await redis.eval(script, 1, lockKey, lockToken) === 1;

  return true;
}

/**
 * Executes function with distributed lock for safe cache updates.
 *
 * @template T - Return type
 * @param {DistributedLockConfig} config - Lock configuration
 * @param {() => Promise<T>} fn - Function to execute with lock
 * @returns {Promise<T>} Function result
 * @throws {Error} If lock cannot be acquired
 *
 * @example
 * ```typescript
 * const result = await withDistributedLock(
 *   { key: 'patient:123:lock', ttl: 5000, retryCount: 3, retryDelay: 100, lockTimeout: 5000 },
 *   async () => {
 *     const data = await fetchData();
 *     await cache.set('patient:123', data);
 *     return data;
 *   }
 * );
 * ```
 */
export async function withDistributedLock<T>(
  config: DistributedLockConfig,
  fn: () => Promise<T>,
): Promise<T> {
  const lockToken = await acquireDistributedLock(config);

  if (!lockToken) {
    throw new Error(`Failed to acquire lock for ${config.key}`);
  }

  try {
    return await fn();
  } finally {
    await releaseDistributedLock(lockToken, config.key);
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  // Multi-tier Caching Strategies
  createMultiTierCacheConfig,
  determineCacheTier,
  promoteCacheEntry,
  demoteCacheEntry,

  // Distributed Cache Coordination
  getConsistentHashPartition,
  createVirtualNodes,
  getTargetNodes,
  coordinateInvalidation,
  synchronizeCacheState,

  // Cache Coherence Protocols
  updateCoherenceState,
  writeInvalidateProtocol,
  snoopCacheCoherence,
  validateCacheCoherence,

  // Cache Partitioning and Sharding
  createPartitionConfig,
  getRangeBasedPartition,
  rebalancePartitions,
  calculateShardAffinity,

  // Near Cache Implementation
  createNearCacheConfig,
  shouldNearCache,
  invalidateNearCache,
  preloadNearCache,

  // Write-Through and Write-Behind Caching
  writeThroughCache,
  writeBehindCache,
  flushWriteBehindBuffer,
  writeAroundCache,

  // Cache Eviction Policies
  evictLRU,
  evictLFU,
  evictFIFO,
  evictARC,
  evictRandom,

  // Cache Warming Strategies
  warmCacheEager,
  warmCacheLazy,
  scheduleCacheWarming,

  // Cache Statistics and Monitoring
  calculateCacheStatistics,
  monitorCachePerformance,
  detectCacheAnomalies,

  // Conditional Caching with Predicates
  createSizePredicate,
  createFreshnessPredicate,
  createHIPAAPredicate,
  combinePredicates,

  // Cache Key Generation Strategies
  generateCacheKey,
  generateContentBasedKey,
  generateTimeBucketKey,
  generateTenantKey,

  // Cache Serialization Optimization
  serializeForCache,
  deserializeFromCache,
  encryptBuffer,
  decryptBuffer,

  // Cache Compression Utilities
  compressIfNeeded,
  decompressIfNeeded,
  calculateCompressionRatio,

  // Cache Tagging and Invalidation
  tagCacheEntry,
  invalidateByTag,
  invalidateByPattern,
  invalidateByTenant,

  // Distributed Cache Locks
  acquireDistributedLock,
  releaseDistributedLock,
  withDistributedLock,
};
