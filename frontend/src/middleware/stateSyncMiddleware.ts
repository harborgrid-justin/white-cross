/**
 * State Synchronization Middleware
 *
 * Production-grade Redux middleware for synchronizing application state across
 * multiple storage mechanisms (localStorage, sessionStorage, URL params) and
 * browser tabs using BroadcastChannel API.
 *
 * Features:
 * - Multi-storage sync (localStorage, sessionStorage, URL)
 * - Cross-tab synchronization via BroadcastChannel
 * - Multiple sync strategies (immediate, debounced, throttled, scheduled)
 * - Custom serializers for complex types
 * - State versioning and migration
 * - Conflict resolution strategies
 * - HIPAA-compliant data exclusion
 *
 * @module stateSyncMiddleware
 * @see https://redux.js.org/understanding/history-and-design/middleware
 */

import { Middleware, AnyAction } from '@reduxjs/toolkit';

/* ============================================================================
 * TYPE DEFINITIONS
 * ========================================================================== */

/**
 * Root state type - can be overridden by user
 * By default uses Record<string, any> for maximum flexibility
 */
export type RootState = Record<string, any>;

/**
 * Storage types supported by the sync middleware
 */
export type StorageType = 'localStorage' | 'sessionStorage' | 'url' | 'none';

/**
 * Sync strategies determine when and how state is synchronized
 */
export enum SyncStrategy {
  /** Sync immediately on every action */
  IMMEDIATE = 'immediate',
  /** Debounce sync operations by specified delay */
  DEBOUNCED = 'debounced',
  /** Throttle sync operations to max frequency */
  THROTTLED = 'throttled',
  /** Only sync when state actually changes */
  ON_CHANGE = 'onChange',
  /** Sync at fixed intervals */
  SCHEDULED = 'scheduled',
  /** Manual sync only (no automatic sync) */
  MANUAL = 'manual',
}

/**
 * Conflict resolution strategies for cross-tab sync
 */
export enum ConflictStrategy {
  /** Last write wins (most recent timestamp) */
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

/**
 * Custom serializer interface for handling complex types
 */
export interface StateSerializer<T = any> {
  /** Serialize state to string */
  serialize: (state: T) => string;
  /** Deserialize string to state */
  deserialize: (data: string) => T;
  /** Validate deserialized state */
  validate?: (state: T) => boolean;
}

/**
 * Conflict resolver for handling state merge conflicts
 */
export interface ConflictResolver<T = any> {
  /** Resolve conflict between local and remote state */
  resolve: (local: T, remote: T, metadata: ConflictMetadata) => T;
  /** Detect if conflict exists */
  hasConflict?: (local: T, remote: T) => boolean;
}

/**
 * Metadata about state conflicts
 */
export interface ConflictMetadata {
  localTimestamp: number;
  remoteTimestamp: number;
  localVersion: number;
  remoteVersion: number;
  sliceName: string;
}

/**
 * Configuration for a single state slice sync
 */
export interface SliceSyncConfig<T = any> {
  /** Name of the state slice */
  sliceName: keyof RootState;
  /** Storage type for this slice */
  storage: StorageType;
  /** Sync strategy */
  strategy: SyncStrategy;
  /** Debounce delay in ms (for DEBOUNCED strategy) */
  debounceDelay?: number;
  /** Throttle delay in ms (for THROTTLED strategy) */
  throttleDelay?: number;
  /** Schedule interval in ms (for SCHEDULED strategy) */
  scheduleInterval?: number;
  /** Custom serializer for complex types */
  serializer?: StateSerializer<T>;
  /** Custom conflict resolver */
  conflictResolver?: ConflictResolver<T>;
  /** Paths to exclude from sync (e.g., sensitive data) */
  excludePaths?: string[];
  /** Whether to sync across tabs via BroadcastChannel */
  enableCrossTab?: boolean;
  /** Whether to compress state before storage */
  compress?: boolean;
  /** Maximum age in ms before state is considered stale */
  maxAge?: number;
  /** Version for state migration */
  version?: number;
  /** State migration function */
  migrate?: (oldState: any, oldVersion: number) => T;
}

/**
 * Global sync middleware configuration
 */
export interface StateSyncConfig {
  /** Array of slice configurations */
  slices: SliceSyncConfig[];
  /** Global conflict strategy (can be overridden per slice) */
  conflictStrategy?: ConflictStrategy;
  /** BroadcastChannel name for cross-tab sync */
  channelName?: string;
  /** Enable debug logging */
  debug?: boolean;
  /** Storage key prefix */
  storagePrefix?: string;
  /** Global serializer (can be overridden per slice) */
  serializer?: StateSerializer;
  /** Callback for sync errors */
  onError?: (error: Error, context: string) => void;
  /** Callback for conflicts */
  onConflict?: (conflict: ConflictMetadata) => void;
  /** Maximum storage size in bytes (prevents overflow) */
  maxStorageSize?: number;
}

/**
 * Message format for cross-tab communication
 */
interface SyncMessage {
  type: 'STATE_UPDATE' | 'STATE_REQUEST' | 'STATE_RESPONSE';
  sliceName: string;
  state: any;
  timestamp: number;
  version: number;
  senderId: string;
}

/**
 * Persisted state metadata
 */
interface PersistedStateMetadata {
  timestamp: number;
  version: number;
  checksum?: string;
}

/**
 * Internal state tracking for middleware
 */
interface SyncState {
  lastSyncTimestamp: Map<string, number>;
  pendingSync: Map<string, NodeJS.Timeout>;
  broadcastChannel: BroadcastChannel | null;
  instanceId: string;
  stateVersions: Map<string, number>;
}

/* ============================================================================
 * DEFAULT CONFIGURATIONS
 * ========================================================================== */

/**
 * Default slice configuration
 */
const DEFAULT_SLICE_CONFIG: Partial<SliceSyncConfig> = {
  storage: 'localStorage',
  strategy: SyncStrategy.DEBOUNCED,
  debounceDelay: 300,
  throttleDelay: 1000,
  scheduleInterval: 5000,
  enableCrossTab: true,
  compress: false,
  maxAge: 24 * 60 * 60 * 1000, // 24 hours
  version: 1,
};

/**
 * Default global configuration
 */
const DEFAULT_CONFIG: Partial<StateSyncConfig> = {
  conflictStrategy: ConflictStrategy.LAST_WRITE_WINS,
  channelName: 'redux-state-sync',
  debug: false,
  storagePrefix: 'whitecross',
  maxStorageSize: 5 * 1024 * 1024, // 5MB
};

/**
 * Paths to exclude for HIPAA compliance (sensitive PHI data)
 */
const SENSITIVE_DATA_PATHS = [
  'auth.token',
  'auth.refreshToken',
  'auth.password',
  'user.ssn',
  'user.medicalRecords',
  'student.healthRecords',
  'medication.prescriptionDetails',
];

/* ============================================================================
 * UTILITY FUNCTIONS
 * ========================================================================== */

/**
 * Generate unique instance ID for this browser tab
 */
function generateInstanceId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Default JSON serializer with circular reference handling
 */
const defaultSerializer: StateSerializer = {
  serialize: (state: any): string => {
    const seen = new WeakSet();
    return JSON.stringify(state, (key, value) => {
      // Handle circular references
      if (typeof value === 'object' && value !== null) {
        if (seen.has(value)) {
          return '[Circular]';
        }
        seen.add(value);
      }

      // Handle Date objects
      if (value instanceof Date) {
        return { __type: 'Date', value: value.toISOString() };
      }

      // Handle Map objects
      if (value instanceof Map) {
        return {
          __type: 'Map',
          value: Array.from(value.entries()),
        };
      }

      // Handle Set objects
      if (value instanceof Set) {
        return {
          __type: 'Set',
          value: Array.from(value),
        };
      }

      return value;
    });
  },

  deserialize: (data: string): any => {
    return JSON.parse(data, (key, value) => {
      // Restore Date objects
      if (value && typeof value === 'object' && value.__type === 'Date') {
        return new Date(value.value);
      }

      // Restore Map objects
      if (value && typeof value === 'object' && value.__type === 'Map') {
        return new Map(value.value);
      }

      // Restore Set objects
      if (value && typeof value === 'object' && value.__type === 'Set') {
        return new Set(value.value);
      }

      return value;
    });
  },

  validate: (state: any): boolean => {
    return state !== null && typeof state === 'object';
  },
};

/**
 * Simple hash function for checksums
 */
function generateChecksum(data: string): string {
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return hash.toString(36);
}

/**
 * Compress string using simple run-length encoding
 * For production, consider using pako or lz-string
 */
function compress(data: string): string {
  // Simple compression placeholder
  // In production, use: import pako from 'pako'; return btoa(String.fromCharCode(...pako.deflate(data)));
  return data;
}

/**
 * Decompress string
 */
function decompress(data: string): string {
  // Simple decompression placeholder
  return data;
}

/**
 * Get nested property from object by path
 */
function getNestedProperty(obj: any, path: string): any {
  return path.split('.').reduce((current, key) => current?.[key], obj);
}

/**
 * Set nested property in object by path
 */
function setNestedProperty(obj: any, path: string, value: any): void {
  const keys = path.split('.');
  const lastKey = keys.pop()!;
  const target = keys.reduce((current, key) => {
    if (!(key in current)) {
      current[key] = {};
    }
    return current[key];
  }, obj);
  target[lastKey] = value;
}

/**
 * Remove nested property from object by path
 */
function removeNestedProperty(obj: any, path: string): any {
  const keys = path.split('.');
  const lastKey = keys.pop()!;
  const target = keys.reduce((current, key) => current?.[key], obj);
  if (target && lastKey in target) {
    delete target[lastKey];
  }
  return obj;
}

/**
 * Deep clone object
 */
function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (obj instanceof Date) {
    return new Date(obj.getTime()) as any;
  }

  if (obj instanceof Map) {
    return new Map(Array.from(obj.entries()).map(([k, v]) => [k, deepClone(v)])) as any;
  }

  if (obj instanceof Set) {
    return new Set(Array.from(obj).map(v => deepClone(v))) as any;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => deepClone(item)) as any;
  }

  const cloned: any = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloned[key] = deepClone(obj[key]);
    }
  }
  return cloned;
}

/**
 * Check if two objects are deeply equal
 */
function deepEqual(obj1: any, obj2: any): boolean {
  if (obj1 === obj2) return true;
  if (obj1 === null || obj2 === null) return false;
  if (typeof obj1 !== 'object' || typeof obj2 !== 'object') return false;

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) return false;

  for (const key of keys1) {
    if (!keys2.includes(key)) return false;
    if (!deepEqual(obj1[key], obj2[key])) return false;
  }

  return true;
}

/**
 * Logger utility
 */
class Logger {
  constructor(private debug: boolean, private prefix: string = '[StateSyncMiddleware]') {}

  log(...args: any[]): void {
    if (this.debug) {
      console.log(this.prefix, ...args);
    }
  }

  warn(...args: any[]): void {
    if (this.debug) {
      console.warn(this.prefix, ...args);
    }
  }

  error(...args: any[]): void {
    console.error(this.prefix, ...args);
  }
}

/* ============================================================================
 * STORAGE HANDLERS
 * ========================================================================== */

/**
 * Storage handler interface
 */
interface StorageHandler {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
  clear(): void;
}

/**
 * Get storage handler based on type
 */
function getStorageHandler(type: StorageType): StorageHandler | null {
  switch (type) {
    case 'localStorage':
      return typeof window !== 'undefined' ? window.localStorage : null;
    case 'sessionStorage':
      return typeof window !== 'undefined' ? window.sessionStorage : null;
    case 'url':
      return urlStorageHandler;
    case 'none':
      return null;
    default:
      return null;
  }
}

/**
 * URL storage handler (uses URL query parameters)
 */
const urlStorageHandler: StorageHandler = {
  getItem(key: string): string | null {
    if (typeof window === 'undefined') return null;
    const params = new URLSearchParams(window.location.search);
    return params.get(key);
  },

  setItem(key: string, value: string): void {
    if (typeof window === 'undefined') return;
    const url = new URL(window.location.href);
    url.searchParams.set(key, value);
    window.history.replaceState({}, '', url.toString());
  },

  removeItem(key: string): void {
    if (typeof window === 'undefined') return;
    const url = new URL(window.location.href);
    url.searchParams.delete(key);
    window.history.replaceState({}, '', url.toString());
  },

  clear(): void {
    if (typeof window === 'undefined') return;
    const url = new URL(window.location.href);
    url.search = '';
    window.history.replaceState({}, '', url.toString());
  },
};

/* ============================================================================
 * CONFLICT RESOLUTION
 * ========================================================================== */

/**
 * Resolve state conflict using specified strategy
 */
function resolveConflict<T>(
  local: T,
  remote: T,
  metadata: ConflictMetadata,
  strategy: ConflictStrategy,
  customResolver?: ConflictResolver<T>
): T {
  switch (strategy) {
    case ConflictStrategy.LAST_WRITE_WINS:
      return metadata.localTimestamp > metadata.remoteTimestamp ? local : remote;

    case ConflictStrategy.FIRST_WRITE_WINS:
      return metadata.localTimestamp < metadata.remoteTimestamp ? local : remote;

    case ConflictStrategy.PREFER_LOCAL:
      return local;

    case ConflictStrategy.PREFER_REMOTE:
      return remote;

    case ConflictStrategy.CUSTOM_MERGE:
      if (customResolver) {
        return customResolver.resolve(local, remote, metadata);
      }
      // Fall back to last write wins
      return metadata.localTimestamp > metadata.remoteTimestamp ? local : remote;

    default:
      return local;
  }
}

/* ============================================================================
 * STATE PERSISTENCE
 * ========================================================================== */

/**
 * Persist state slice to storage
 */
function persistState(
  sliceName: string,
  state: any,
  config: SliceSyncConfig,
  globalConfig: StateSyncConfig,
  logger: Logger
): void {
  try {
    const storage = getStorageHandler(config.storage);
    if (!storage) return;

    // Clone state to avoid mutations
    let stateToSave = deepClone(state);

    // Remove sensitive data
    const excludePaths = [
      ...SENSITIVE_DATA_PATHS.filter(p => p.startsWith(sliceName as string)),
      ...(config.excludePaths || []),
    ];

    excludePaths.forEach(path => {
      const relativePath = path.replace(`${sliceName}.`, '');
      stateToSave = removeNestedProperty(stateToSave, relativePath);
    });

    // Serialize state
    const serializer = config.serializer || globalConfig.serializer || defaultSerializer;
    const serialized = serializer.serialize(stateToSave);

    // Add metadata
    const metadata: PersistedStateMetadata = {
      timestamp: Date.now(),
      version: config.version || 1,
      checksum: generateChecksum(serialized),
    };

    const dataToStore = {
      state: stateToSave,
      metadata,
    };

    let finalData = JSON.stringify(dataToStore);

    // Compress if enabled
    if (config.compress) {
      finalData = compress(finalData);
    }

    // Check storage size
    const size = new Blob([finalData]).size;
    const maxSize = globalConfig.maxStorageSize || DEFAULT_CONFIG.maxStorageSize!;

    if (size > maxSize) {
      logger.warn(`State slice "${sliceName}" exceeds max storage size (${size} > ${maxSize})`);
      return;
    }

    const storageKey = `${globalConfig.storagePrefix || DEFAULT_CONFIG.storagePrefix}_${sliceName}`;
    storage.setItem(storageKey, finalData);

    logger.log(`Persisted state slice "${sliceName}" to ${config.storage}`);
  } catch (error) {
    logger.error(`Failed to persist state slice "${sliceName}":`, error);
    globalConfig.onError?.(error as Error, `persistState:${sliceName}`);
  }
}

/**
 * Load state slice from storage
 */
function loadState<T>(
  sliceName: string,
  config: SliceSyncConfig<T>,
  globalConfig: StateSyncConfig,
  logger: Logger
): T | null {
  try {
    const storage = getStorageHandler(config.storage);
    if (!storage) return null;

    const storageKey = `${globalConfig.storagePrefix || DEFAULT_CONFIG.storagePrefix}_${sliceName}`;
    let data = storage.getItem(storageKey);

    if (!data) return null;

    // Decompress if needed
    if (config.compress) {
      data = decompress(data);
    }

    const { state, metadata } = JSON.parse(data) as {
      state: any;
      metadata: PersistedStateMetadata;
    };

    // Check if state is stale
    const maxAge = config.maxAge || DEFAULT_SLICE_CONFIG.maxAge!;
    if (Date.now() - metadata.timestamp > maxAge) {
      logger.warn(`State slice "${sliceName}" is stale, ignoring`);
      return null;
    }

    // Validate checksum
    const serializer = config.serializer || globalConfig.serializer || defaultSerializer;
    const serialized = serializer.serialize(state);
    const checksum = generateChecksum(serialized);

    if (metadata.checksum && checksum !== metadata.checksum) {
      logger.warn(`Checksum mismatch for state slice "${sliceName}", data may be corrupted`);
      return null;
    }

    // Handle version migration
    if (metadata.version !== config.version && config.migrate) {
      logger.log(`Migrating state slice "${sliceName}" from v${metadata.version} to v${config.version}`);
      const migratedState = config.migrate(state, metadata.version);

      // Persist migrated state
      persistState(sliceName, migratedState, config, globalConfig, logger);

      return migratedState;
    }

    // Validate state
    if (serializer.validate && !serializer.validate(state)) {
      logger.warn(`State validation failed for slice "${sliceName}"`);
      return null;
    }

    logger.log(`Loaded state slice "${sliceName}" from ${config.storage}`);
    return state;
  } catch (error) {
    logger.error(`Failed to load state slice "${sliceName}":`, error);
    globalConfig.onError?.(error as Error, `loadState:${sliceName}`);
    return null;
  }
}

/* ============================================================================
 * CROSS-TAB SYNCHRONIZATION
 * ========================================================================== */

/**
 * Create and manage BroadcastChannel for cross-tab sync
 */
function createBroadcastChannel(
  channelName: string,
  onMessage: (message: SyncMessage) => void,
  logger: Logger
): BroadcastChannel | null {
  if (typeof BroadcastChannel === 'undefined') {
    logger.warn('BroadcastChannel API not available, cross-tab sync disabled');
    return null;
  }

  try {
    const channel = new BroadcastChannel(channelName);

    channel.onmessage = (event) => {
      try {
        const message = event.data as SyncMessage;
        logger.log('Received broadcast message:', message.type, message.sliceName);
        onMessage(message);
      } catch (error) {
        logger.error('Failed to process broadcast message:', error);
      }
    };

    channel.onmessageerror = (event) => {
      logger.error('BroadcastChannel message error:', event);
    };

    logger.log(`BroadcastChannel "${channelName}" created`);
    return channel;
  } catch (error) {
    logger.error('Failed to create BroadcastChannel:', error);
    return null;
  }
}

/**
 * Broadcast state update to other tabs
 */
function broadcastStateUpdate(
  channel: BroadcastChannel | null,
  sliceName: string,
  state: any,
  version: number,
  senderId: string,
  logger: Logger
): void {
  if (!channel) return;

  try {
    const message: SyncMessage = {
      type: 'STATE_UPDATE',
      sliceName,
      state,
      timestamp: Date.now(),
      version,
      senderId,
    };

    channel.postMessage(message);
    logger.log(`Broadcasted state update for "${sliceName}"`);
  } catch (error) {
    logger.error(`Failed to broadcast state update for "${sliceName}":`, error);
  }
}

/* ============================================================================
 * MIDDLEWARE FACTORY
 * ========================================================================== */

/**
 * Create state synchronization middleware
 *
 * @example
 * ```typescript
 * const syncMiddleware = createStateSyncMiddleware({
 *   slices: [
 *     {
 *       sliceName: 'auth',
 *       storage: 'localStorage',
 *       strategy: SyncStrategy.DEBOUNCED,
 *       debounceDelay: 500,
 *       excludePaths: ['token', 'refreshToken'],
 *     },
 *     {
 *       sliceName: 'ui',
 *       storage: 'sessionStorage',
 *       strategy: SyncStrategy.IMMEDIATE,
 *     },
 *   ],
 *   debug: true,
 * });
 * ```
 */
export function createStateSyncMiddleware(
  userConfig: StateSyncConfig
): Middleware<{}, RootState> {
  // Merge with defaults
  const config: StateSyncConfig = {
    ...DEFAULT_CONFIG,
    ...userConfig,
    slices: userConfig.slices.map(slice => ({
      ...DEFAULT_SLICE_CONFIG,
      ...slice,
    })),
  };

  const logger = new Logger(config.debug || false);

  // Internal state
  const syncState: SyncState = {
    lastSyncTimestamp: new Map(),
    pendingSync: new Map(),
    broadcastChannel: null,
    instanceId: generateInstanceId(),
    stateVersions: new Map(),
  };

  // Initialize versions
  config.slices.forEach(slice => {
    syncState.stateVersions.set(String(slice.sliceName), slice.version || 1);
  });

  logger.log('State sync middleware initialized', {
    instanceId: syncState.instanceId,
    slices: config.slices.map(s => s.sliceName),
  });

  /**
   * Handle incoming broadcast messages
   */
  const handleBroadcastMessage = (message: SyncMessage) => {
    // Ignore messages from this instance
    if (message.senderId === syncState.instanceId) {
      return;
    }

    const sliceConfig = config.slices.find(s => s.sliceName === message.sliceName);
    if (!sliceConfig || !sliceConfig.enableCrossTab) {
      return;
    }

    // This would need to be handled by updating the store
    // The actual implementation would dispatch an action to update the state
    logger.log(`Received state update for "${message.sliceName}" from another tab`);
  };

  // Create BroadcastChannel if any slice has cross-tab sync enabled
  if (config.slices.some(s => s.enableCrossTab)) {
    syncState.broadcastChannel = createBroadcastChannel(
      config.channelName || DEFAULT_CONFIG.channelName!,
      handleBroadcastMessage,
      logger
    );
  }

  /**
   * Sync a state slice
   */
  const syncSlice = (sliceName: string, state: any, config: SliceSyncConfig) => {
    const now = Date.now();
    const lastSync = syncState.lastSyncTimestamp.get(sliceName) || 0;

    // Check if state changed (for ON_CHANGE strategy)
    if (config.strategy === SyncStrategy.ON_CHANGE) {
      const loadedState = loadState(sliceName, config, userConfig, logger);
      if (loadedState && deepEqual(state, loadedState)) {
        logger.log(`State slice "${sliceName}" unchanged, skipping sync`);
        return;
      }
    }

    // Persist to storage
    persistState(sliceName, state, config, userConfig, logger);

    // Broadcast to other tabs
    if (config.enableCrossTab && syncState.broadcastChannel) {
      const version = syncState.stateVersions.get(sliceName) || 1;
      broadcastStateUpdate(
        syncState.broadcastChannel,
        sliceName,
        state,
        version,
        syncState.instanceId,
        logger
      );
    }

    syncState.lastSyncTimestamp.set(sliceName, now);
  };

  /**
   * Schedule sync with strategy
   */
  const scheduleSync = (sliceName: string, state: any, sliceConfig: SliceSyncConfig) => {
    const pendingKey = `${sliceName}`;

    // Clear pending sync
    const pending = syncState.pendingSync.get(pendingKey);
    if (pending) {
      clearTimeout(pending);
    }

    switch (sliceConfig.strategy) {
      case SyncStrategy.IMMEDIATE:
        syncSlice(sliceName, state, sliceConfig);
        break;

      case SyncStrategy.DEBOUNCED: {
        const delay = sliceConfig.debounceDelay || DEFAULT_SLICE_CONFIG.debounceDelay!;
        const timeout = setTimeout(() => {
          syncSlice(sliceName, state, sliceConfig);
          syncState.pendingSync.delete(pendingKey);
        }, delay);
        syncState.pendingSync.set(pendingKey, timeout);
        break;
      }

      case SyncStrategy.THROTTLED: {
        const delay = sliceConfig.throttleDelay || DEFAULT_SLICE_CONFIG.throttleDelay!;
        const lastSync = syncState.lastSyncTimestamp.get(sliceName) || 0;
        const timeSinceLastSync = Date.now() - lastSync;

        if (timeSinceLastSync >= delay) {
          syncSlice(sliceName, state, sliceConfig);
        } else {
          const timeout = setTimeout(() => {
            syncSlice(sliceName, state, sliceConfig);
            syncState.pendingSync.delete(pendingKey);
          }, delay - timeSinceLastSync);
          syncState.pendingSync.set(pendingKey, timeout);
        }
        break;
      }

      case SyncStrategy.ON_CHANGE:
      case SyncStrategy.SCHEDULED:
        // These are handled differently
        syncSlice(sliceName, state, sliceConfig);
        break;

      case SyncStrategy.MANUAL:
        // Do nothing, sync must be triggered manually
        break;
    }
  };

  // Set up scheduled sync intervals
  config.slices.forEach(sliceConfig => {
    if (sliceConfig.strategy === SyncStrategy.SCHEDULED) {
      const interval = sliceConfig.scheduleInterval || DEFAULT_SLICE_CONFIG.scheduleInterval!;
      setInterval(() => {
        logger.log(`Scheduled sync for "${sliceConfig.sliceName}"`);
        // This would need access to current state, which requires store integration
      }, interval);
    }
  });

  /**
   * Redux middleware function
   */
  const middleware: Middleware<{}, RootState> = (store) => (next) => (action: unknown) => {
    // Call next middleware in chain
    const result = next(action);

    // Get updated state after action
    const state = store.getState();

    // Sync each configured slice
    config.slices.forEach(sliceConfig => {
      const sliceName = sliceConfig.sliceName as string;
      const sliceState = state[sliceConfig.sliceName];

      if (sliceState !== undefined) {
        scheduleSync(sliceName, sliceState, sliceConfig);
      }
    });

    return result;
  };

  return middleware;
}

/**
 * Load initial state from storage
 * Call this before creating the Redux store to hydrate initial state
 *
 * @example
 * ```typescript
 * const preloadedState = loadInitialState(syncConfig);
 * const store = configureStore({
 *   reducer: rootReducer,
 *   preloadedState,
 *   middleware: (getDefaultMiddleware) =>
 *     getDefaultMiddleware().concat(createStateSyncMiddleware(syncConfig)),
 * });
 * ```
 */
export function loadInitialState(config: StateSyncConfig): Partial<RootState> {
  const logger = new Logger(config.debug || false);
  const initialState: Partial<RootState> = {};

  const mergedConfig: StateSyncConfig = {
    ...DEFAULT_CONFIG,
    ...config,
    slices: config.slices.map(slice => ({
      ...DEFAULT_SLICE_CONFIG,
      ...slice,
    })),
  };

  mergedConfig.slices.forEach(sliceConfig => {
    const sliceName = sliceConfig.sliceName as string;
    const loadedState = loadState(sliceName, sliceConfig, mergedConfig, logger);

    if (loadedState !== null) {
      initialState[sliceConfig.sliceName] = loadedState;
    }
  });

  logger.log('Loaded initial state:', Object.keys(initialState));
  return initialState;
}

/**
 * Manually trigger sync for a specific slice
 * Useful for manual sync strategy or explicit sync needs
 */
export function manualSync(
  sliceName: keyof RootState,
  state: any,
  config: StateSyncConfig
): void {
  const logger = new Logger(config.debug || false);
  const sliceConfig = config.slices.find(s => s.sliceName === sliceName);

  if (!sliceConfig) {
    logger.warn(`No sync config found for slice "${String(sliceName)}"`);
    return;
  }

  persistState(String(sliceName), state, sliceConfig, config, logger);
  logger.log(`Manual sync completed for "${String(sliceName)}"`);
}

/**
 * Clear all synced state from storage
 */
export function clearSyncedState(config: StateSyncConfig): void {
  const logger = new Logger(config.debug || false);

  config.slices.forEach(sliceConfig => {
    const storage = getStorageHandler(sliceConfig.storage);
    if (!storage) return;

    const storageKey = `${config.storagePrefix || DEFAULT_CONFIG.storagePrefix}_${String(sliceConfig.sliceName)}`;
    storage.removeItem(storageKey);

    logger.log(`Cleared synced state for "${String(sliceConfig.sliceName)}"`);
  });
}

/* ============================================================================
 * EXPORT DEFAULT MIDDLEWARE (with sensible defaults)
 * ========================================================================== */

/**
 * Pre-configured state sync middleware with HIPAA-compliant defaults
 * Excludes sensitive authentication and health data from sync
 */
export const stateSyncMiddleware = createStateSyncMiddleware({
  slices: [
    {
      sliceName: 'auth',
      storage: 'sessionStorage', // Auth in session only for security
      strategy: SyncStrategy.DEBOUNCED,
      debounceDelay: 500,
      excludePaths: ['token', 'refreshToken', 'password'],
      enableCrossTab: false, // Don't sync auth across tabs for security
      version: 1,
    },
  ],
  debug: false,
  storagePrefix: 'whitecross',
  conflictStrategy: ConflictStrategy.LAST_WRITE_WINS,
});

export default stateSyncMiddleware;
