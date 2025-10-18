/**
 * WF-COMP-150 | stateSyncMiddleware.examples.ts - React component or utility module
 * Purpose: react component or utility module
 * Upstream: ./stateSyncMiddleware, ./reducers, ./reducers | Dependencies: ./stateSyncMiddleware, @reduxjs/toolkit, @/middleware/stateSyncMiddleware
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: default export, constants, functions | Key Features: useEffect
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */

/**
 * State Synchronization Middleware - Configuration Examples
 *
 * This file provides comprehensive examples of how to configure and use
 * the state synchronization middleware in various scenarios.
 *
 * @module stateSyncMiddleware.examples
 */

import {
  createStateSyncMiddleware,
  loadInitialState,
  manualSync,
  clearSyncedState,
  SyncStrategy,
  ConflictStrategy,
  type StateSyncConfig,
  type SliceSyncConfig,
  type StateSerializer,
  type ConflictResolver,
} from './stateSyncMiddleware';
import type { RootState } from '@/stores/reduxStore';

/* ============================================================================
 * EXAMPLE 1: Basic Configuration
 * ========================================================================== */

/**
 * Simple configuration with default settings
 * Good for getting started quickly
 */
export const basicSyncConfig: StateSyncConfig = {
  slices: [
    {
      sliceName: 'auth',
      storage: 'sessionStorage',
      strategy: SyncStrategy.DEBOUNCED,
      debounceDelay: 500,
      excludePaths: ['token', 'refreshToken', 'password'],
    },
    {
      sliceName: 'ui',
      storage: 'localStorage',
      strategy: SyncStrategy.IMMEDIATE,
    },
  ],
  debug: true,
};

/* ============================================================================
 * EXAMPLE 2: HIPAA-Compliant Healthcare Configuration
 * ========================================================================== */

/**
 * Healthcare-specific configuration with strict data exclusion
 * Ensures PHI (Protected Health Information) is never persisted
 */
export const hipaaCompliantConfig: StateSyncConfig = {
  slices: [
    // Auth: Session storage only, no cross-tab sync
    {
      sliceName: 'auth',
      storage: 'sessionStorage',
      strategy: SyncStrategy.DEBOUNCED,
      debounceDelay: 300,
      excludePaths: [
        'token',
        'refreshToken',
        'password',
        'mfaSecret',
        'recoveryCode',
      ],
      enableCrossTab: false, // Security: Don't sync auth across tabs
      maxAge: 30 * 60 * 1000, // 30 minutes max age
    },

    // UI preferences: Can be synced across tabs
    {
      sliceName: 'ui',
      storage: 'localStorage',
      strategy: SyncStrategy.THROTTLED,
      throttleDelay: 1000,
      enableCrossTab: true,
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    },

    // Incident reports: Never persist sensitive data
    {
      sliceName: 'incidentReports',
      storage: 'sessionStorage',
      strategy: SyncStrategy.ON_CHANGE,
      excludePaths: [
        'medicalDetails',
        'diagnosis',
        'prescription',
        'studentSsn',
        'parentContact',
      ],
      enableCrossTab: false,
      maxAge: 60 * 60 * 1000, // 1 hour
    },
  ],

  conflictStrategy: ConflictStrategy.PREFER_LOCAL,
  channelName: 'whitecross-secure-sync',
  debug: false,
  storagePrefix: 'whitecross_secure',
  maxStorageSize: 2 * 1024 * 1024, // 2MB limit

  // Error handling for audit logging
  onError: (error, context) => {
    console.error(`[HIPAA Sync Error] Context: ${context}`, error);
    // In production, send to audit log service
    // auditLogService.logError({ error, context, timestamp: Date.now() });
  },

  // Conflict logging for compliance
  onConflict: (conflict) => {
    console.warn('[HIPAA Sync Conflict]', conflict);
    // In production, log conflicts for review
    // auditLogService.logConflict(conflict);
  },
};

/* ============================================================================
 * EXAMPLE 3: Custom Serializer for Complex Types
 * ========================================================================== */

/**
 * Custom serializer that handles Date objects, moment objects, and BigInt
 */
const customSerializer: StateSerializer = {
  serialize: (state: any): string => {
    return JSON.stringify(state, (key, value) => {
      // Handle Date objects
      if (value instanceof Date) {
        return { __type: 'Date', value: value.toISOString() };
      }

      // Handle BigInt
      if (typeof value === 'bigint') {
        return { __type: 'BigInt', value: value.toString() };
      }

      // Handle moment objects (if using moment.js)
      if (value && typeof value === 'object' && value._isAMomentObject) {
        return { __type: 'Moment', value: value.toISOString() };
      }

      // Handle Map
      if (value instanceof Map) {
        return { __type: 'Map', value: Array.from(value.entries()) };
      }

      // Handle Set
      if (value instanceof Set) {
        return { __type: 'Set', value: Array.from(value) };
      }

      return value;
    });
  },

  deserialize: (data: string): any => {
    return JSON.parse(data, (key, value) => {
      if (!value || typeof value !== 'object') return value;

      // Restore Date objects
      if (value.__type === 'Date') {
        return new Date(value.value);
      }

      // Restore BigInt
      if (value.__type === 'BigInt') {
        return BigInt(value.value);
      }

      // Restore moment objects
      if (value.__type === 'Moment') {
        // return moment(value.value);
        return new Date(value.value); // Fallback to Date
      }

      // Restore Map
      if (value.__type === 'Map') {
        return new Map(value.value);
      }

      // Restore Set
      if (value.__type === 'Set') {
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
 * Configuration using custom serializer
 */
export const customSerializerConfig: StateSyncConfig = {
  slices: [
    {
      sliceName: 'appointments',
      storage: 'localStorage',
      strategy: SyncStrategy.DEBOUNCED,
      serializer: customSerializer,
    },
  ],
  debug: true,
};

/* ============================================================================
 * EXAMPLE 4: Custom Conflict Resolver
 * ========================================================================== */

/**
 * Custom conflict resolver that merges arrays and prefers newer objects
 */
const smartMergeResolver: ConflictResolver = {
  resolve: (local: any, remote: any, metadata) => {
    // If types don't match, use last write wins
    if (typeof local !== typeof remote) {
      return metadata.localTimestamp > metadata.remoteTimestamp ? local : remote;
    }

    // For arrays, merge and deduplicate
    if (Array.isArray(local) && Array.isArray(remote)) {
      const merged = [...local, ...remote];
      return Array.from(new Set(merged.map(JSON.stringify))).map(JSON.parse);
    }

    // For objects, deep merge with newer values winning
    if (typeof local === 'object' && local !== null) {
      const merged = { ...local };

      for (const key in remote) {
        if (remote.hasOwnProperty(key)) {
          if (
            typeof remote[key] === 'object' &&
            remote[key] !== null &&
            !Array.isArray(remote[key])
          ) {
            merged[key] = smartMergeResolver.resolve(
              local[key] || {},
              remote[key],
              metadata
            );
          } else {
            // For primitive values, prefer newer timestamp
            merged[key] = metadata.remoteTimestamp > metadata.localTimestamp
              ? remote[key]
              : local[key];
          }
        }
      }

      return merged;
    }

    // Default to last write wins
    return metadata.localTimestamp > metadata.remoteTimestamp ? local : remote;
  },

  hasConflict: (local: any, remote: any): boolean => {
    return JSON.stringify(local) !== JSON.stringify(remote);
  },
};

/**
 * Configuration with custom conflict resolution
 */
export const customConflictConfig: StateSyncConfig = {
  slices: [
    {
      sliceName: 'ui',
      storage: 'localStorage',
      strategy: SyncStrategy.IMMEDIATE,
      enableCrossTab: true,
      conflictResolver: smartMergeResolver,
    },
  ],
  conflictStrategy: ConflictStrategy.CUSTOM_MERGE,
  debug: true,
};

/* ============================================================================
 * EXAMPLE 5: State Migration
 * ========================================================================== */

/**
 * Configuration with state version migration
 */
interface OldAuthState {
  isAuthenticated: boolean;
  user: string;
}

interface NewAuthState {
  isAuthenticated: boolean;
  user: {
    id: string;
    name: string;
    email: string;
  };
  permissions: string[];
}

export const migrationConfig: StateSyncConfig = {
  slices: [
    {
      sliceName: 'auth',
      storage: 'localStorage',
      strategy: SyncStrategy.DEBOUNCED,
      version: 2, // Current version

      // Migration function from v1 to v2
      migrate: (oldState: any, oldVersion: number): NewAuthState => {
        if (oldVersion === 1) {
          // Migrate from v1 to v2
          const v1State = oldState as OldAuthState;
          return {
            isAuthenticated: v1State.isAuthenticated,
            user: {
              id: '',
              name: v1State.user,
              email: '',
            },
            permissions: [],
          };
        }

        // If unknown version, return default state
        return {
          isAuthenticated: false,
          user: { id: '', name: '', email: '' },
          permissions: [],
        };
      },
    },
  ],
  debug: true,
};

/* ============================================================================
 * EXAMPLE 6: Different Sync Strategies
 * ========================================================================== */

/**
 * Configuration demonstrating all sync strategies
 */
export const multiStrategyConfig: StateSyncConfig = {
  slices: [
    // Immediate: Sync on every action (use for critical state)
    {
      sliceName: 'auth',
      storage: 'sessionStorage',
      strategy: SyncStrategy.IMMEDIATE,
    },

    // Debounced: Wait for pause in actions (use for frequently changing state)
    {
      sliceName: 'ui',
      storage: 'localStorage',
      strategy: SyncStrategy.DEBOUNCED,
      debounceDelay: 500, // Wait 500ms after last change
    },

    // Throttled: Sync at most once per interval (use for high-frequency updates)
    {
      sliceName: 'notifications',
      storage: 'localStorage',
      strategy: SyncStrategy.THROTTLED,
      throttleDelay: 2000, // Max once every 2 seconds
    },

    // OnChange: Only sync if state actually changed (use to avoid unnecessary writes)
    {
      sliceName: 'settings',
      storage: 'localStorage',
      strategy: SyncStrategy.ON_CHANGE,
    },

    // Scheduled: Sync at fixed intervals (use for periodic backups)
    {
      sliceName: 'drafts',
      storage: 'localStorage',
      strategy: SyncStrategy.SCHEDULED,
      scheduleInterval: 30000, // Every 30 seconds
    },

    // Manual: Only sync when explicitly called (use for sensitive operations)
    {
      sliceName: 'reports',
      storage: 'sessionStorage',
      strategy: SyncStrategy.MANUAL,
    },
  ],
  debug: true,
};

/* ============================================================================
 * EXAMPLE 7: URL Parameter Sync
 * ========================================================================== */

/**
 * Sync state with URL parameters (useful for shareable links)
 */
export const urlSyncConfig: StateSyncConfig = {
  slices: [
    {
      sliceName: 'filters',
      storage: 'url',
      strategy: SyncStrategy.DEBOUNCED,
      debounceDelay: 300,
      enableCrossTab: false,
    },
  ],
  debug: true,
};

/* ============================================================================
 * EXAMPLE 8: Cross-Tab Synchronization
 * ========================================================================== */

/**
 * Configuration optimized for cross-tab sync
 */
export const crossTabConfig: StateSyncConfig = {
  slices: [
    {
      sliceName: 'notifications',
      storage: 'localStorage',
      strategy: SyncStrategy.IMMEDIATE,
      enableCrossTab: true, // Enable cross-tab sync
    },
    {
      sliceName: 'ui',
      storage: 'localStorage',
      strategy: SyncStrategy.DEBOUNCED,
      debounceDelay: 200,
      enableCrossTab: true,
    },
  ],
  channelName: 'whitecross-cross-tab', // Custom channel name
  conflictStrategy: ConflictStrategy.LAST_WRITE_WINS,
  debug: true,
};

/* ============================================================================
 * EXAMPLE 9: Compressed Storage
 * ========================================================================== */

/**
 * Configuration with compression for large state objects
 */
export const compressionConfig: StateSyncConfig = {
  slices: [
    {
      sliceName: 'incidentReports',
      storage: 'localStorage',
      strategy: SyncStrategy.ON_CHANGE,
      compress: true, // Enable compression
      maxStorageSize: 10 * 1024 * 1024, // 10MB max
    },
  ],
  debug: true,
};

/* ============================================================================
 * USAGE EXAMPLES IN STORE CONFIGURATION
 * ========================================================================== */

/**
 * Example 1: Basic store setup with sync middleware
 */
export function exampleBasicStoreSetup() {
  /*
  import { configureStore } from '@reduxjs/toolkit';
  import { createStateSyncMiddleware } from '@/middleware/stateSyncMiddleware';
  import { basicSyncConfig } from '@/middleware/stateSyncMiddleware.examples';
  import rootReducer from './reducers';

  const syncMiddleware = createStateSyncMiddleware(basicSyncConfig);

  export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(syncMiddleware),
  });
  */
}

/**
 * Example 2: Store setup with state hydration
 */
export function exampleStoreWithHydration() {
  /*
  import { configureStore } from '@reduxjs/toolkit';
  import {
    createStateSyncMiddleware,
    loadInitialState,
  } from '@/middleware/stateSyncMiddleware';
  import { hipaaCompliantConfig } from '@/middleware/stateSyncMiddleware.examples';
  import rootReducer from './reducers';

  // Load persisted state before creating store
  const preloadedState = loadInitialState(hipaaCompliantConfig);

  const syncMiddleware = createStateSyncMiddleware(hipaaCompliantConfig);

  export const store = configureStore({
    reducer: rootReducer,
    preloadedState, // Hydrate with persisted state
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
        },
      }).concat(syncMiddleware),
  });
  */
}

/**
 * Example 3: Manual sync usage
 */
export function exampleManualSync() {
  /*
  import { manualSync } from '@/middleware/stateSyncMiddleware';
  import { multiStrategyConfig } from '@/middleware/stateSyncMiddleware.examples';
  import { store } from '@/stores/reduxStore';

  // Get current state for a slice
  const reportsState = store.getState().reports;

  // Manually trigger sync
  manualSync('reports', reportsState, multiStrategyConfig);
  */
}

/**
 * Example 4: Clear synced state (logout scenario)
 */
export function exampleClearState() {
  /*
  import { clearSyncedState } from '@/middleware/stateSyncMiddleware';
  import { hipaaCompliantConfig } from '@/middleware/stateSyncMiddleware.examples';

  // Clear all synced state from storage
  clearSyncedState(hipaaCompliantConfig);
  */
}

/**
 * Example 5: Multiple storage strategies
 */
export function exampleMultipleStrategies() {
  /*
  import { createStateSyncMiddleware } from '@/middleware/stateSyncMiddleware';

  const multiStorageConfig: StateSyncConfig = {
    slices: [
      // Critical auth data: sessionStorage only
      {
        sliceName: 'auth',
        storage: 'sessionStorage',
        strategy: SyncStrategy.IMMEDIATE,
      },

      // UI preferences: localStorage, persist across sessions
      {
        sliceName: 'ui',
        storage: 'localStorage',
        strategy: SyncStrategy.DEBOUNCED,
      },

      // Filter state: URL params for shareability
      {
        sliceName: 'filters',
        storage: 'url',
        strategy: SyncStrategy.DEBOUNCED,
      },

      // Draft data: localStorage with scheduled backup
      {
        sliceName: 'drafts',
        storage: 'localStorage',
        strategy: SyncStrategy.SCHEDULED,
        scheduleInterval: 60000, // Every minute
      },
    ],
  };

  const syncMiddleware = createStateSyncMiddleware(multiStorageConfig);
  */
}

/**
 * Example 6: React component using synced state
 */
export function exampleReactComponent() {
  /*
  import React, { useEffect } from 'react';
  import { useAppSelector, useAppDispatch } from '@/stores/hooks/reduxHooks';
  import { manualSync } from '@/middleware/stateSyncMiddleware';
  import { hipaaCompliantConfig } from '@/middleware/stateSyncMiddleware.examples';

  function ExampleComponent() {
    const dispatch = useAppDispatch();
    const reportsState = useAppSelector((state) => state.reports);

    // Manual sync on component mount
    useEffect(() => {
      manualSync('reports', reportsState, hipaaCompliantConfig);
    }, []);

    // Manual sync before critical operation
    const handleSaveReport = async () => {
      // Sync current state before save
      manualSync('reports', reportsState, hipaaCompliantConfig);

      // Perform save operation
      // ...
    };

    return <div>Component content</div>;
  }
  */
}

/**
 * Example 7: Integration with existing Redux Persist
 */
export function exampleReduxPersistMigration() {
  /*
  // If you're migrating from redux-persist, you can run both in parallel:

  import { persistStore, persistReducer } from 'redux-persist';
  import storage from 'redux-persist/lib/storage';
  import { createStateSyncMiddleware } from '@/middleware/stateSyncMiddleware';

  const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['ui'], // Only persist UI with redux-persist
  };

  const persistedReducer = persistReducer(persistConfig, rootReducer);

  const syncConfig: StateSyncConfig = {
    slices: [
      {
        sliceName: 'auth', // Sync auth with our middleware
        storage: 'sessionStorage',
        strategy: SyncStrategy.IMMEDIATE,
      },
    ],
  };

  const syncMiddleware = createStateSyncMiddleware(syncConfig);

  export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
        },
      }).concat(syncMiddleware),
  });

  export const persistor = persistStore(store);
  */
}

/* ============================================================================
 * TESTING UTILITIES
 * ========================================================================== */

/**
 * Mock configuration for testing
 */
export const testSyncConfig: StateSyncConfig = {
  slices: [
    {
      sliceName: 'auth',
      storage: 'sessionStorage',
      strategy: SyncStrategy.IMMEDIATE,
      enableCrossTab: false,
    },
  ],
  debug: false,
  storagePrefix: 'test',
};

/**
 * Example test setup
 */
export function exampleTest() {
  /*
  import { createStateSyncMiddleware, clearSyncedState } from '@/middleware/stateSyncMiddleware';
  import { testSyncConfig } from '@/middleware/stateSyncMiddleware.examples';

  describe('State Sync Middleware', () => {
    beforeEach(() => {
      // Clear state before each test
      clearSyncedState(testSyncConfig);
    });

    it('should sync state to storage', () => {
      const syncMiddleware = createStateSyncMiddleware(testSyncConfig);
      // Test implementation
    });
  });
  */
}

export default {
  basicSyncConfig,
  hipaaCompliantConfig,
  customSerializerConfig,
  customConflictConfig,
  migrationConfig,
  multiStrategyConfig,
  urlSyncConfig,
  crossTabConfig,
  compressionConfig,
  testSyncConfig,
};
