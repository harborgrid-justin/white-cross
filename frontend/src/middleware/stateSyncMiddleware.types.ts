/**
 * WF-COMP-154 | stateSyncMiddleware.types.ts - React component or utility module
 * Purpose: react component or utility module
 * Upstream: React, external libs | Dependencies: @/middleware/stateSyncMiddleware.types, @/middleware/stateSyncMiddleware, @/middleware/stateSyncMiddleware
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: default export, functions, interfaces, types | Key Features: Standard module
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */

/**
 * State Synchronization Middleware - Type Definitions
 *
 * Comprehensive type definitions for state sync middleware.
 * Import these types when configuring the middleware in your application.
 *
 * @module stateSyncMiddleware.types
 */

import type { Middleware } from '@reduxjs/toolkit';

/**
 * Root state type - import from your store or use generic
 * This allows the middleware to work with any Redux store structure
 */
export type RootState = Record<string, any>;

/* ============================================================================
 * CORE ENUMS
 * ========================================================================== */

/**
 * Storage types supported by the sync middleware
 *
 * @example
 * ```typescript
 * import { StorageType } from '@/middleware/stateSyncMiddleware.types';
 *
 * const config = {
 *   storage: 'localStorage' as StorageType,
 * };
 * ```
 */
export type StorageType = 'localStorage' | 'sessionStorage' | 'url' | 'none';

/**
 * Sync strategies determine when and how state is synchronized
 *
 * @example
 * ```typescript
 * import { SyncStrategy } from '@/middleware/stateSyncMiddleware';
 *
 * const config = {
 *   strategy: SyncStrategy.DEBOUNCED,
 * };
 * ```
 */
export enum SyncStrategy {
  /** Sync immediately on every action - use for critical state */
  IMMEDIATE = 'immediate',

  /** Debounce sync operations by specified delay - use for frequently changing state */
  DEBOUNCED = 'debounced',

  /** Throttle sync operations to max frequency - use for high-frequency updates */
  THROTTLED = 'throttled',

  /** Only sync when state actually changes - use to avoid unnecessary writes */
  ON_CHANGE = 'onChange',

  /** Sync at fixed intervals - use for periodic backups */
  SCHEDULED = 'scheduled',

  /** Manual sync only (no automatic sync) - use for sensitive operations */
  MANUAL = 'manual',
}

/**
 * Conflict resolution strategies for cross-tab sync
 *
 * @example
 * ```typescript
 * import { ConflictStrategy } from '@/middleware/stateSyncMiddleware';
 *
 * const config = {
 *   conflictStrategy: ConflictStrategy.LAST_WRITE_WINS,
 * };
 * ```
 */
export enum ConflictStrategy {
  /** Last write wins (most recent timestamp) - default */
  LAST_WRITE_WINS = 'lastWriteWins',

  /** First write wins (oldest timestamp) */
  FIRST_WRITE_WINS = 'firstWriteWins',

  /** Use custom merge function */
  CUSTOM_MERGE = 'customMerge',

  /** Prefer local state */
  PREFER_LOCAL = 'preferLocal',

  /** Prefer remote state */
  PREFER_REMOTE = 'preferRemote',
}

/* ============================================================================
 * SERIALIZATION TYPES
 * ========================================================================== */

/**
 * Custom serializer interface for handling complex types
 *
 * Implement this interface to handle types that don't serialize well with JSON.stringify,
 * such as Date, Map, Set, BigInt, or circular references.
 *
 * @template T - The type of state being serialized
 *
 * @example
 * ```typescript
 * const customSerializer: StateSerializer<MyState> = {
 *   serialize: (state) => JSON.stringify(state, dateReviver),
 *   deserialize: (data) => JSON.parse(data, dateReplacer),
 *   validate: (state) => state !== null && typeof state === 'object',
 * };
 * ```
 */
export interface StateSerializer<T = any> {
  /**
   * Serialize state to string
   * @param state - The state object to serialize
   * @returns Serialized string representation
   */
  serialize: (state: T) => string;

  /**
   * Deserialize string to state
   * @param data - The serialized string data
   * @returns Deserialized state object
   */
  deserialize: (data: string) => T;

  /**
   * Validate deserialized state (optional)
   * @param state - The deserialized state to validate
   * @returns True if state is valid
   */
  validate?: (state: T) => boolean;
}

/* ============================================================================
 * CONFLICT RESOLUTION TYPES
 * ========================================================================== */

/**
 * Metadata about state conflicts
 *
 * Provided to conflict resolvers to help make intelligent merge decisions.
 */
export interface ConflictMetadata {
  /** Timestamp of local state update */
  localTimestamp: number;

  /** Timestamp of remote state update */
  remoteTimestamp: number;

  /** Version number of local state */
  localVersion: number;

  /** Version number of remote state */
  remoteVersion: number;

  /** Name of the state slice */
  sliceName: string;
}

/**
 * Conflict resolver for handling state merge conflicts
 *
 * Implement this interface to provide custom logic for merging conflicting state
 * from different browser tabs.
 *
 * @template T - The type of state being resolved
 *
 * @example
 * ```typescript
 * const smartMergeResolver: ConflictResolver<MyState> = {
 *   resolve: (local, remote, metadata) => {
 *     // Custom merge logic
 *     return { ...local, ...remote };
 *   },
 *   hasConflict: (local, remote) => {
 *     return JSON.stringify(local) !== JSON.stringify(remote);
 *   },
 * };
 * ```
 */
export interface ConflictResolver<T = any> {
  /**
   * Resolve conflict between local and remote state
   * @param local - Local state
   * @param remote - Remote state from another tab
   * @param metadata - Metadata about the conflict
   * @returns Resolved state
   */
  resolve: (local: T, remote: T, metadata: ConflictMetadata) => T;

  /**
   * Detect if conflict exists (optional)
   * @param local - Local state
   * @param remote - Remote state
   * @returns True if there is a conflict
   */
  hasConflict?: (local: T, remote: T) => boolean;
}

/* ============================================================================
 * CONFIGURATION TYPES
 * ========================================================================== */

/**
 * Configuration for a single state slice sync
 *
 * Defines how a specific Redux state slice should be synchronized.
 *
 * @template T - The type of the state slice
 *
 * @example
 * ```typescript
 * const authSliceConfig: SliceSyncConfig<AuthState> = {
 *   sliceName: 'auth',
 *   storage: 'sessionStorage',
 *   strategy: SyncStrategy.DEBOUNCED,
 *   debounceDelay: 500,
 *   excludePaths: ['token', 'refreshToken'],
 *   enableCrossTab: false,
 * };
 * ```
 */
export interface SliceSyncConfig<T = any> {
  /**
   * Name of the state slice (must match Redux state key)
   * @example 'auth', 'ui', 'user'
   */
  sliceName: keyof RootState;

  /**
   * Storage type for this slice
   * - localStorage: Persists across browser sessions
   * - sessionStorage: Persists only during browser session
   * - url: Syncs to URL query parameters
   * - none: No persistence
   */
  storage: StorageType;

  /**
   * Sync strategy determining when to persist state
   */
  strategy: SyncStrategy;

  /**
   * Debounce delay in milliseconds (for DEBOUNCED strategy)
   * @default 300
   * @example 500 // Wait 500ms after last change
   */
  debounceDelay?: number;

  /**
   * Throttle delay in milliseconds (for THROTTLED strategy)
   * @default 1000
   * @example 2000 // Max once every 2 seconds
   */
  throttleDelay?: number;

  /**
   * Schedule interval in milliseconds (for SCHEDULED strategy)
   * @default 5000
   * @example 60000 // Every minute
   */
  scheduleInterval?: number;

  /**
   * Custom serializer for complex types
   * @see StateSerializer
   */
  serializer?: StateSerializer<T>;

  /**
   * Custom conflict resolver
   * @see ConflictResolver
   */
  conflictResolver?: ConflictResolver<T>;

  /**
   * Paths to exclude from sync (e.g., sensitive data)
   * Uses dot notation for nested paths
   * @example ['token', 'refreshToken', 'user.ssn']
   */
  excludePaths?: string[];

  /**
   * Whether to sync across tabs via BroadcastChannel
   * @default true
   */
  enableCrossTab?: boolean;

  /**
   * Whether to compress state before storage
   * @default false
   */
  compress?: boolean;

  /**
   * Maximum age in milliseconds before state is considered stale
   * @default 86400000 (24 hours)
   * @example 3600000 // 1 hour
   */
  maxAge?: number;

  /**
   * Version for state migration
   * @default 1
   */
  version?: number;

  /**
   * State migration function for version updates
   * @param oldState - State from storage with old version
   * @param oldVersion - Version number of stored state
   * @returns Migrated state with current structure
   *
   * @example
   * ```typescript
   * migrate: (oldState, oldVersion) => {
   *   if (oldVersion === 1) {
   *     return { ...oldState, newField: 'default' };
   *   }
   *   return oldState;
   * }
   * ```
   */
  migrate?: (oldState: any, oldVersion: number) => T;
}

/**
 * Global sync middleware configuration
 *
 * Main configuration object for the state sync middleware.
 *
 * @example
 * ```typescript
 * const syncConfig: StateSyncConfig = {
 *   slices: [
 *     {
 *       sliceName: 'auth',
 *       storage: 'sessionStorage',
 *       strategy: SyncStrategy.IMMEDIATE,
 *     },
 *   ],
 *   debug: true,
 *   storagePrefix: 'myapp',
 * };
 * ```
 */
export interface StateSyncConfig {
  /**
   * Array of slice configurations
   * Each slice can have its own storage type and sync strategy
   */
  slices: SliceSyncConfig[];

  /**
   * Global conflict strategy (can be overridden per slice)
   * @default ConflictStrategy.LAST_WRITE_WINS
   */
  conflictStrategy?: ConflictStrategy;

  /**
   * BroadcastChannel name for cross-tab sync
   * Use unique name to avoid conflicts with other apps
   * @default 'redux-state-sync'
   */
  channelName?: string;

  /**
   * Enable debug logging
   * @default false
   */
  debug?: boolean;

  /**
   * Storage key prefix to avoid conflicts
   * @default 'whitecross'
   * @example 'myapp' results in keys like 'myapp_auth'
   */
  storagePrefix?: string;

  /**
   * Global serializer (can be overridden per slice)
   * @see StateSerializer
   */
  serializer?: StateSerializer;

  /**
   * Callback for sync errors
   * Use for error logging and monitoring
   *
   * @param error - The error that occurred
   * @param context - Context string describing where error occurred
   *
   * @example
   * ```typescript
   * onError: (error, context) => {
   *   console.error(`[Sync Error] ${context}:`, error);
   *   errorTracker.captureException(error, { context });
   * }
   * ```
   */
  onError?: (error: Error, context: string) => void;

  /**
   * Callback for conflicts
   * Use for conflict logging and monitoring
   *
   * @param conflict - Metadata about the conflict
   *
   * @example
   * ```typescript
   * onConflict: (conflict) => {
   *   console.warn('[Sync Conflict]', conflict);
   *   auditLog.recordConflict(conflict);
   * }
   * ```
   */
  onConflict?: (conflict: ConflictMetadata) => void;

  /**
   * Maximum storage size in bytes (prevents overflow)
   * @default 5242880 (5MB)
   * @example 10 * 1024 * 1024 // 10MB
   */
  maxStorageSize?: number;
}

/* ============================================================================
 * INTERNAL TYPES (for reference)
 * ========================================================================== */

/**
 * Message format for cross-tab communication
 * @internal
 */
export interface SyncMessage {
  type: 'STATE_UPDATE' | 'STATE_REQUEST' | 'STATE_RESPONSE';
  sliceName: string;
  state: any;
  timestamp: number;
  version: number;
  senderId: string;
}

/**
 * Persisted state metadata
 * @internal
 */
export interface PersistedStateMetadata {
  timestamp: number;
  version: number;
  checksum?: string;
}

/**
 * Internal state tracking for middleware
 * @internal
 */
export interface SyncState {
  lastSyncTimestamp: Map<string, number>;
  pendingSync: Map<string, NodeJS.Timeout>;
  broadcastChannel: BroadcastChannel | null;
  instanceId: string;
  stateVersions: Map<string, number>;
}

/* ============================================================================
 * MIDDLEWARE TYPE
 * ========================================================================== */

/**
 * State sync middleware type
 *
 * Redux middleware that intercepts actions and syncs state to storage.
 */
export type StateSyncMiddleware = Middleware<{}, RootState>;

/* ============================================================================
 * FUNCTION TYPES
 * ========================================================================== */

/**
 * Function to create state sync middleware
 */
export type CreateStateSyncMiddleware = (
  config: StateSyncConfig
) => StateSyncMiddleware;

/**
 * Function to load initial state from storage
 */
export type LoadInitialState = (config: StateSyncConfig) => Partial<RootState>;

/**
 * Function to manually trigger sync
 */
export type ManualSync = (
  sliceName: keyof RootState,
  state: any,
  config: StateSyncConfig
) => void;

/**
 * Function to clear all synced state
 */
export type ClearSyncedState = (config: StateSyncConfig) => void;

/* ============================================================================
 * UTILITY TYPES
 * ========================================================================== */

/**
 * Extract the state type for a specific slice
 *
 * @example
 * ```typescript
 * type AuthState = SliceState<'auth'>; // Returns RootState['auth']
 * ```
 */
export type SliceState<K extends keyof RootState> = RootState[K];

/**
 * Configuration with required fields only
 * Useful for creating minimal configs
 */
export type MinimalSliceSyncConfig = Pick<
  SliceSyncConfig,
  'sliceName' | 'storage' | 'strategy'
>;

/**
 * Configuration with all optional fields
 * Useful for type-safe partial updates
 */
export type PartialSliceSyncConfig = Partial<SliceSyncConfig>;

/**
 * Union type of all sync strategy values
 */
export type SyncStrategyValue = `${SyncStrategy}`;

/**
 * Union type of all conflict strategy values
 */
export type ConflictStrategyValue = `${ConflictStrategy}`;

/* ============================================================================
 * TYPE GUARDS
 * ========================================================================== */

/**
 * Type guard to check if value is a valid StorageType
 */
export function isStorageType(value: any): value is StorageType {
  return ['localStorage', 'sessionStorage', 'url', 'none'].includes(value);
}

/**
 * Type guard to check if value is a valid SyncStrategy
 */
export function isSyncStrategy(value: any): value is SyncStrategy {
  return Object.values(SyncStrategy).includes(value);
}

/**
 * Type guard to check if value is a valid ConflictStrategy
 */
export function isConflictStrategy(value: any): value is ConflictStrategy {
  return Object.values(ConflictStrategy).includes(value);
}

/* ============================================================================
 * HELPER TYPES
 * ========================================================================== */

/**
 * Configuration builder type for fluent API
 */
export interface ConfigBuilder {
  addSlice(config: SliceSyncConfig): ConfigBuilder;
  setDebug(debug: boolean): ConfigBuilder;
  setPrefix(prefix: string): ConfigBuilder;
  setConflictStrategy(strategy: ConflictStrategy): ConfigBuilder;
  build(): StateSyncConfig;
}

/**
 * Sync middleware options for advanced usage
 */
export interface SyncMiddlewareOptions {
  /** Config object */
  config: StateSyncConfig;
  /** Override default storage handlers */
  storageHandlers?: Map<StorageType, Storage>;
  /** Custom logger */
  logger?: Console;
}

/* ============================================================================
 * DEFAULT EXPORT
 * ========================================================================== */

// Default export with utility functions
export default {
  isStorageType,
  isSyncStrategy,
  isConflictStrategy,
};
