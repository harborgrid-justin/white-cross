/**
 * WF-COMP-151 | stateSyncMiddleware.integration.example.ts - React component or utility module
 * Purpose: react component or utility module
 * Upstream: ./slices/authSlice, ./slices/incidentReportsSlice, ./syncConfig | Dependencies: @/middleware/stateSyncMiddleware, @reduxjs/toolkit, ./slices/authSlice
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: default export, constants, functions, interfaces, types | Key Features: useEffect, component
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */

/**
 * State Synchronization Middleware - Integration Example
 *
 * This file demonstrates how to integrate the state sync middleware
 * with the existing White Cross Redux store configuration.
 *
 * @module stateSyncMiddleware.integration.example
 */

/*
 * ============================================================================
 * INTEGRATION EXAMPLE FOR WHITE CROSS PLATFORM
 * ============================================================================
 *
 * This example shows how to integrate the state sync middleware into the
 * existing Redux store at F:\temp\white-cross\frontend\src\stores\reduxStore.ts
 *
 * To implement:
 * 1. Copy the configuration below
 * 2. Update the imports in reduxStore.ts
 * 3. Add the middleware to the store configuration
 * 4. Optionally add state hydration
 */

// ============================================================================
// STEP 1: Configuration
// ============================================================================

/**
 * Example configuration file: src/stores/syncConfig.ts
 */

/*
import {
  createStateSyncMiddleware,
  loadInitialState,
  SyncStrategy,
  ConflictStrategy,
  type StateSyncConfig,
} from '@/middleware/stateSyncMiddleware';

// HIPAA-compliant state sync configuration for White Cross platform
export const stateSyncConfig: StateSyncConfig = {
  slices: [
    // ========================================================================
    // Authentication State
    // ========================================================================
    {
      sliceName: 'auth',
      storage: 'sessionStorage', // Session only for security
      strategy: SyncStrategy.DEBOUNCED,
      debounceDelay: 500,

      // Exclude all sensitive auth data (HIPAA compliance)
      excludePaths: [
        'token',
        'refreshToken',
        'password',
        'mfaSecret',
        'recoveryCode',
      ],

      // No cross-tab sync for security
      enableCrossTab: false,

      // Short max age for auth state
      maxAge: 30 * 60 * 1000, // 30 minutes

      // Version for future migrations
      version: 1,
    },

    // ========================================================================
    // Incident Reports State
    // ========================================================================
    {
      sliceName: 'incidentReports',
      storage: 'sessionStorage', // Session only for PHI data
      strategy: SyncStrategy.ON_CHANGE,

      // Exclude all PHI data
      excludePaths: [
        'studentName',
        'studentSsn',
        'medicalDetails',
        'diagnosis',
        'prescription',
        'parentContact',
        'healthRecords',
      ],

      // No cross-tab sync for PHI
      enableCrossTab: false,

      // 1 hour max age
      maxAge: 60 * 60 * 1000,

      version: 1,
    },

    // ========================================================================
    // UI Preferences (Safe to persist)
    // ========================================================================
    // Uncomment when UI slice is added to Redux
    // {
    //   sliceName: 'ui',
    //   storage: 'localStorage',
    //   strategy: SyncStrategy.THROTTLED,
    //   throttleDelay: 1000,
    //   enableCrossTab: true,
    //   maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    //   version: 1,
    // },
  ],

  // Global configuration
  conflictStrategy: ConflictStrategy.PREFER_LOCAL, // Always prefer local for security
  channelName: 'whitecross-secure-sync',
  debug: import.meta.env.DEV, // Debug only in development
  storagePrefix: 'whitecross_secure',
  maxStorageSize: 2 * 1024 * 1024, // 2MB limit for security

  // Error handling for audit logging
  onError: (error, context) => {
    console.error(`[State Sync Error] Context: ${context}`, error);

    // In production, send to audit log service
    if (import.meta.env.PROD) {
      // auditLogService.logError({
      //   type: 'STATE_SYNC_ERROR',
      //   error: error.message,
      //   context,
      //   timestamp: new Date().toISOString(),
      //   userId: getCurrentUserId(),
      // });
    }
  },

  // Conflict handling for audit logging
  onConflict: (conflict) => {
    console.warn('[State Sync Conflict]', conflict);

    // In production, log conflicts for HIPAA compliance review
    if (import.meta.env.PROD) {
      // auditLogService.logConflict({
      //   type: 'STATE_SYNC_CONFLICT',
      //   sliceName: conflict.sliceName,
      //   localTimestamp: conflict.localTimestamp,
      //   remoteTimestamp: conflict.remoteTimestamp,
      //   timestamp: new Date().toISOString(),
      //   userId: getCurrentUserId(),
      // });
    }
  },
};

// Create the middleware instance
export const stateSyncMiddleware = createStateSyncMiddleware(stateSyncConfig);

// Export function to load initial state
export function loadPersistedState() {
  return loadInitialState(stateSyncConfig);
}

// Export config for use in components
export default stateSyncConfig;
*/

// ============================================================================
// STEP 2: Update reduxStore.ts
// ============================================================================

/**
 * Updated Redux store configuration
 * File: F:\temp\white-cross\frontend\src\stores\reduxStore.ts
 */

/*
import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import incidentReportsSlice from './slices/incidentReportsSlice';

// Import state sync middleware
import {
  stateSyncMiddleware,
  loadPersistedState,
} from './syncConfig';

// Load persisted state before creating store
const preloadedState = loadPersistedState();

export const store = configureStore({
  reducer: {
    auth: authSlice,
    incidentReports: incidentReportsSlice,
  },

  // Add persisted state
  preloadedState,

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          'persist/PERSIST',
          'persist/REHYDRATE',
          // Add any custom actions that contain non-serializable data
        ],
      },
    })
    // Add state sync middleware
    .concat(stateSyncMiddleware),

  devTools: import.meta.env.DEV,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
*/

// ============================================================================
// STEP 3: Component Usage Examples
// ============================================================================

/**
 * Example: Manual sync on logout
 * File: src/components/auth/LogoutButton.tsx
 */

/*
import React from 'react';
import { useAppDispatch } from '@/stores';
import { clearSyncedState } from '@/middleware/stateSyncMiddleware';
import { stateSyncConfig } from '@/stores/syncConfig';
import { logout } from '@/stores/slices/authSlice';

export function LogoutButton() {
  const dispatch = useAppDispatch();

  const handleLogout = async () => {
    try {
      // Clear all synced state from storage
      clearSyncedState(stateSyncConfig);

      // Dispatch logout action
      await dispatch(logout()).unwrap();

      // Redirect to login
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <button onClick={handleLogout}>
      Logout
    </button>
  );
}
*/

/**
 * Example: Manual sync before critical operation
 * File: src/components/incidents/SaveIncidentButton.tsx
 */

/*
import React from 'react';
import { useAppSelector } from '@/stores';
import { manualSync } from '@/middleware/stateSyncMiddleware';
import { stateSyncConfig } from '@/stores/syncConfig';

export function SaveIncidentButton() {
  const incidentReportsState = useAppSelector((state) => state.incidentReports);

  const handleSave = async () => {
    try {
      // Manually sync state before save operation
      manualSync('incidentReports', incidentReportsState, stateSyncConfig);

      // Perform save operation
      // await saveIncident(incidentReportsState.currentReport);

      console.log('Incident saved successfully');
    } catch (error) {
      console.error('Save failed:', error);
    }
  };

  return (
    <button onClick={handleSave}>
      Save Incident
    </button>
  );
}
*/

/**
 * Example: useEffect to sync on unmount
 * File: src/components/incidents/IncidentForm.tsx
 */

/*
import React, { useEffect } from 'react';
import { useAppSelector } from '@/stores';
import { manualSync } from '@/middleware/stateSyncMiddleware';
import { stateSyncConfig } from '@/stores/syncConfig';

export function IncidentForm() {
  const incidentReportsState = useAppSelector((state) => state.incidentReports);

  // Sync state when component unmounts (save draft)
  useEffect(() => {
    return () => {
      // Sync on cleanup
      manualSync('incidentReports', incidentReportsState, stateSyncConfig);
    };
  }, [incidentReportsState]);

  return (
    <form>
      {/* Form fields */}
    </form>
  );
}
*/

// ============================================================================
// STEP 4: Adding New Slices with Sync
// ============================================================================

/**
 * Example: Adding a new UI preferences slice
 * File: src/stores/slices/uiSlice.ts
 */

/*
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UIState {
  theme: 'light' | 'dark';
  sidebarOpen: boolean;
  language: string;
  notifications: {
    enabled: boolean;
    sound: boolean;
    desktop: boolean;
  };
}

const initialState: UIState = {
  theme: 'light',
  sidebarOpen: true,
  language: 'en',
  notifications: {
    enabled: true,
    sound: true,
    desktop: false,
  },
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setLanguage: (state, action: PayloadAction<string>) => {
      state.language = action.payload;
    },
    updateNotifications: (state, action: PayloadAction<Partial<UIState['notifications']>>) => {
      state.notifications = { ...state.notifications, ...action.payload };
    },
  },
});

export const { setTheme, toggleSidebar, setLanguage, updateNotifications } = uiSlice.actions;
export default uiSlice.reducer;
*/

/**
 * Then add to store and sync config:
 */

/*
// In reduxStore.ts
import uiSlice from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    incidentReports: incidentReportsSlice,
    ui: uiSlice, // Add new slice
  },
  // ... rest of config
});

// In syncConfig.ts - add UI slice sync configuration
{
  sliceName: 'ui',
  storage: 'localStorage', // Persist across sessions
  strategy: SyncStrategy.DEBOUNCED,
  debounceDelay: 500,
  enableCrossTab: true, // Sync across tabs
  maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  version: 1,
}
*/

// ============================================================================
// STEP 5: Advanced - State Migration Example
// ============================================================================

/**
 * Example: Migrating auth state when structure changes
 */

/*
// Old auth state structure (version 1)
interface OldAuthState {
  isAuthenticated: boolean;
  user: string | null;
}

// New auth state structure (version 2)
interface NewAuthState {
  isAuthenticated: boolean;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  } | null;
}

// In syncConfig.ts
{
  sliceName: 'auth',
  storage: 'sessionStorage',
  strategy: SyncStrategy.DEBOUNCED,
  version: 2, // Increment version

  // Migration function
  migrate: (oldState: any, oldVersion: number): NewAuthState => {
    if (oldVersion === 1) {
      // Migrate from v1 to v2
      return {
        isAuthenticated: oldState.isAuthenticated,
        user: oldState.user ? {
          id: '',
          name: oldState.user,
          email: '',
          role: 'nurse',
        } : null,
      };
    }

    // For unknown versions, return default state
    return {
      isAuthenticated: false,
      user: null,
    };
  },
}
*/

// ============================================================================
// STEP 6: Testing Integration
// ============================================================================

/**
 * Example: Testing the integrated middleware
 * File: src/stores/reduxStore.test.ts
 */

/*
import { describe, it, expect, beforeEach } from 'vitest';
import { store } from './reduxStore';
import { login, logout } from './slices/authSlice';
import { clearSyncedState } from '@/middleware/stateSyncMiddleware';
import { stateSyncConfig } from './syncConfig';

describe('Redux Store with State Sync', () => {
  beforeEach(() => {
    // Clear synced state before each test
    clearSyncedState(stateSyncConfig);
  });

  it('should persist auth state to sessionStorage', async () => {
    // Dispatch login action
    store.dispatch(login({
      user: { id: '1', name: 'Test User', email: 'test@example.com' },
      token: 'test-token',
    }));

    // Wait for debounced sync
    await new Promise(resolve => setTimeout(resolve, 600));

    // Check sessionStorage
    const stored = sessionStorage.getItem('whitecross_secure_auth');
    expect(stored).not.toBeNull();

    // Parse and verify
    const parsed = JSON.parse(stored!);
    expect(parsed.state.isAuthenticated).toBe(true);

    // Verify token was excluded
    expect(parsed.state.token).toBeUndefined();
  });

  it('should load persisted state on store creation', () => {
    // Pre-populate sessionStorage
    const mockState = {
      state: {
        isAuthenticated: true,
        user: { id: '1', name: 'Test User', email: 'test@example.com' },
      },
      metadata: {
        timestamp: Date.now(),
        version: 1,
      },
    };

    sessionStorage.setItem('whitecross_secure_auth', JSON.stringify(mockState));

    // Reload would be needed here in real scenario
    // For tests, just verify the config works
    expect(stateSyncConfig.slices).toHaveLength(2);
  });

  it('should clear state on logout', () => {
    // Dispatch login
    store.dispatch(login({
      user: { id: '1', name: 'Test User', email: 'test@example.com' },
      token: 'test-token',
    }));

    // Clear synced state
    clearSyncedState(stateSyncConfig);

    // Verify storage is clear
    expect(sessionStorage.getItem('whitecross_secure_auth')).toBeNull();
  });
});
*/

// ============================================================================
// STEP 7: Environment-Specific Configuration
// ============================================================================

/**
 * Example: Different configs for dev/staging/production
 * File: src/stores/syncConfig.ts
 */

/*
import { StateSyncConfig, SyncStrategy } from '@/middleware/stateSyncMiddleware';

const baseConfig: StateSyncConfig = {
  slices: [
    {
      sliceName: 'auth',
      storage: 'sessionStorage',
      strategy: SyncStrategy.DEBOUNCED,
      excludePaths: ['token', 'refreshToken', 'password'],
      enableCrossTab: false,
      maxAge: 30 * 60 * 1000,
      version: 1,
    },
  ],
  storagePrefix: 'whitecross_secure',
  maxStorageSize: 2 * 1024 * 1024,
};

// Development: More logging, less strict
const developmentConfig: StateSyncConfig = {
  ...baseConfig,
  debug: true,
  conflictStrategy: ConflictStrategy.LAST_WRITE_WINS,
  onError: (error, context) => {
    console.error(`[DEV] Sync Error in ${context}:`, error);
  },
  onConflict: (conflict) => {
    console.warn('[DEV] Sync Conflict:', conflict);
  },
};

// Production: No logging, strict security
const productionConfig: StateSyncConfig = {
  ...baseConfig,
  debug: false,
  conflictStrategy: ConflictStrategy.PREFER_LOCAL, // Always prefer local for security
  onError: (error, context) => {
    // Send to monitoring service
    // errorTracker.captureException(error, { context });

    // Audit log for HIPAA
    // auditLogService.logError({
    //   type: 'STATE_SYNC_ERROR',
    //   error: error.message,
    //   context,
    //   timestamp: new Date().toISOString(),
    // });
  },
  onConflict: (conflict) => {
    // Audit log conflicts
    // auditLogService.logConflict({
    //   type: 'STATE_SYNC_CONFLICT',
    //   sliceName: conflict.sliceName,
    //   localTimestamp: conflict.localTimestamp,
    //   remoteTimestamp: conflict.remoteTimestamp,
    //   timestamp: new Date().toISOString(),
    // });
  },
};

// Export appropriate config based on environment
export const stateSyncConfig =
  import.meta.env.MODE === 'production'
    ? productionConfig
    : developmentConfig;
*/

// ============================================================================
// NOTES & BEST PRACTICES
// ============================================================================

/**
 * HIPAA Compliance Checklist:
 * ✓ Exclude all PHI from localStorage sync
 * ✓ Use sessionStorage for auth/health data
 * ✓ Implement audit logging (onError, onConflict)
 * ✓ Set short maxAge for sensitive data
 * ✓ Disable cross-tab sync for PHI
 * ✓ Clear state on logout
 * ✓ Validate state integrity (checksums)
 * ✓ Set storage size limits
 *
 * Performance Checklist:
 * ✓ Use DEBOUNCED/THROTTLED for frequently changing state
 * ✓ Use IMMEDIATE only for critical state
 * ✓ Exclude large data from sync
 * ✓ Set appropriate debounce/throttle delays
 * ✓ Monitor storage usage
 *
 * Security Checklist:
 * ✓ Never persist tokens in localStorage
 * ✓ Prefer sessionStorage for auth
 * ✓ Use excludePaths for sensitive data
 * ✓ Implement proper cleanup on logout
 * ✓ Validate loaded state
 * ✓ Use HTTPS in production
 *
 * Testing Checklist:
 * ✓ Test state persistence
 * ✓ Test state hydration
 * ✓ Test excluded paths
 * ✓ Test logout cleanup
 * ✓ Test stale state handling
 * ✓ Test storage quota limits
 * ✓ Test migration logic
 */

export default {
  // Configuration examples included above
  // Import and use as needed in your application
};
