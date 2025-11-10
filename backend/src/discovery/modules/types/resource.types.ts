/**
 * Type definitions for Discovery Module Resources
 *
 * Provides strong typing for resource management, caching, and memory optimization
 */

import { Request } from 'express';

/**
 * Generic resource that can be managed by pools
 */
export interface ManagedResource {
  id: string;
  type: string;
  [key: string]: unknown;
}

/**
 * Database connection resource
 */
export interface DatabaseConnection extends ManagedResource {
  type: 'connection';
  host?: string;
  database?: string;
  connected: boolean;
  destroy?: () => Promise<void>;
}

/**
 * Worker resource
 */
export interface WorkerResource extends ManagedResource {
  type: 'worker';
  busy: boolean;
  destroy?: () => Promise<void>;
}

/**
 * Cache resource
 */
export interface CacheResource extends ManagedResource {
  type: 'cache';
  size: number;
  clear?: () => void;
}

/**
 * Generic managed resource
 */
export interface GenericResource extends ManagedResource {
  type: 'generic';
  destroy?: () => Promise<void>;
}

/**
 * Union type for all resource types
 */
export type PoolableResource =
  | DatabaseConnection
  | WorkerResource
  | CacheResource
  | GenericResource
  | ManagedResource;

/**
 * Factory function for creating resources
 */
export type ResourceFactory<T extends PoolableResource = PoolableResource> =
  () => Promise<T>;

/**
 * Validation function for resources
 */
export type ResourceValidator<T extends PoolableResource = PoolableResource> = (
  resource: T,
) => boolean | Promise<boolean>;

/**
 * Provider metadata for database operations
 */
export interface DatabaseProviderMetadata {
  minConnections?: number;
  maxConnections?: number;
  connectionFactory?: ResourceFactory<DatabaseConnection>;
  validateConnection?: ResourceValidator<DatabaseConnection>;
  idleTimeout?: number;
  maxLifetime?: number;
}

/**
 * Provider instance that can have cleanup methods
 */
export interface CleanableProvider {
  cleanup?(): Promise<void> | void;
  clearCache?(): Promise<void> | void;
  dispose?(): Promise<void> | void;
  destroy?(): Promise<void> | void;
  reset?(): Promise<void> | void;
  compact?(): Promise<void> | void;
  optimize?(): Promise<void> | void;
  lightCleanup?(): Promise<void> | void;
}

/**
 * RxJS Subscriber with typed callbacks
 */
export interface TypedSubscriber<T> {
  next: (value: T) => void;
  error: (err: Error) => void;
  complete: () => void;
}

/**
 * Request with potential user and metadata
 */
export interface AuthenticatedRequest extends Request {
  user?: {
    id: string | number;
    [key: string]: unknown;
  };
  method: string;
  ip: string;
  [key: string]: unknown;
}

/**
 * Serializable data type for caching
 */
export type SerializableData =
  | string
  | number
  | boolean
  | null
  | SerializableData[]
  | { [key: string]: SerializableData };

/**
 * Cache data that can be compressed/decompressed
 */
export type CacheableData = SerializableData | Record<string, unknown>;

/**
 * Metadata type for dynamic configurations
 */
export type ProviderMetadata = Record<string, unknown>;

/**
 * Options for resource pool operations
 */
export interface ResourcePoolGlobalOptions {
  idleTimeout?: number;
  maxLifetime?: number;
  enableMonitoring?: boolean;
  autoScale?: boolean;
  [key: string]: unknown;
}

/**
 * Options for memory cache operations
 */
export interface MemoryCacheOptions {
  maxMemoryThreshold: number; // MB
  compressionEnabled?: boolean;
  evictionStrategy?: 'lru' | 'lfu' | 'fifo';
  [key: string]: unknown;
}

/**
 * GC strategy condition function
 */
export type GCConditionFunction = (
  memoryUsage: NodeJS.MemoryUsage,
  options?: Partial<GCOptimizationOptions>,
) => boolean | Promise<boolean>;

/**
 * GC strategy execution function
 */
export type GCExecuteFunction = (
  options?: Partial<GCOptimizationOptions>,
) => Promise<void>;

/**
 * GC optimization options
 */
export interface GCOptimizationOptions {
  memoryThreshold: number;
  gcInterval: number;
  aggressiveThreshold: number;
  enableHeapProfiling: boolean;
  customStrategies: Map<string, unknown>;
}

/**
 * Smart GC options
 */
export interface SmartGCOptions {
  enableAutoGC?: boolean;
  gcThreshold?: number;
  [key: string]: unknown;
}

/**
 * Queue item with typed resolve/reject
 */
export interface QueueItem<T = PoolableResource> {
  resolve: (value: T) => void;
  reject: (error: Error) => void;
  timeout: NodeJS.Timeout;
}

/**
 * Resource throttle queue item
 */
export interface ThrottleQueueItem {
  resolve: (result: unknown) => void;
  reject: (error: Error) => void;
  config: {
    maxConcurrent: number;
    queueSize: number;
    timeoutMs: number;
    priority: number;
    resourceType: string;
  };
}

/**
 * Type guard for CleanableProvider
 */
export function isCleanableProvider(obj: unknown): obj is CleanableProvider {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    (typeof (obj as CleanableProvider).cleanup === 'function' ||
      typeof (obj as CleanableProvider).clearCache === 'function' ||
      typeof (obj as CleanableProvider).dispose === 'function' ||
      typeof (obj as CleanableProvider).destroy === 'function')
  );
}

/**
 * Type guard for resources with destroy method
 */
export function hasDestroyMethod(
  resource: unknown,
): resource is { destroy: () => Promise<void> } {
  return (
    typeof resource === 'object' &&
    resource !== null &&
    typeof (resource as { destroy?: unknown }).destroy === 'function'
  );
}
