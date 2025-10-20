/**
 * WF-COMP-307 | reduxStore.ts - React component or utility module
 * Purpose: react component or utility module
 * Upstream: ./slices/authSlice, ./slices/incidentReportsSlice, ../middleware/stateSyncMiddleware | Dependencies: @reduxjs/toolkit, ./slices/authSlice, ./slices/incidentReportsSlice
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: default export, constants, functions, types | Key Features: component
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */

/**
 * Redux Store Configuration
 *
 * Enterprise-grade Redux store with:
 * - State synchronization across tabs (BroadcastChannel)
 * - Persistent state (localStorage/sessionStorage)
 * - HIPAA-compliant data exclusion
 * - State hydration on app load
 * - Type-safe configuration
 *
 * @module reduxStore
 */

import { configureStore, combineReducers } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import incidentReportsSlice from './slices/incidentReportsSlice';
import { usersReducer } from './slices/usersSlice';
import { districtsReducer } from './slices/districtsSlice';
import { schoolsReducer } from './slices/schoolsSlice';
import { settingsReducer } from './slices/settingsSlice';
import { studentsReducer } from './slices/studentsSlice';
import { healthRecordsReducer } from './slices/healthRecordsSlice';
import { medicationsReducer } from './slices/medicationsSlice';
import { appointmentsReducer } from './slices/appointmentsSlice';
import { emergencyContactsReducer } from './slices/emergencyContactsSlice';
import { documentsReducer } from './slices/documentsSlice';
import { communicationReducer } from './slices/communicationSlice';
import { inventoryReducer } from './slices/inventorySlice';
import { reportsReducer } from './slices/reportsSlice';
// Phase 3: Advanced enterprise features
import enterpriseReducer from './enterprise/enterpriseFeatures';
import orchestrationReducer from './orchestration/crossDomainOrchestration';
import {
  createStateSyncMiddleware,
  loadInitialState,
  SyncStrategy,
  ConflictStrategy,
  type StateSyncConfig,
  type RootState as SyncRootState,
} from '../middleware/stateSyncMiddleware';

/**
 * Root reducer configuration
 * Combines all domain slices into a single root reducer
 */
const rootReducer = combineReducers({
  // ============================================================
  // AUTHENTICATION & AUTHORIZATION
  // ============================================================
  auth: authSlice,

  // ============================================================
  // IMPLEMENTED CORE DOMAINS
  // ============================================================
  incidentReports: incidentReportsSlice,      // Incident reporting and tracking
  
  // ============================================================
  // PHASE 2: ADMINISTRATION & CONFIGURATION
  // ============================================================
  users: usersReducer,                        // User management and access control
  districts: districtsReducer,                // District management
  schools: schoolsReducer,                    // School management
  settings: settingsReducer,                  // System configuration and settings
  
  // ============================================================
  // PHASE 2: STUDENT & HEALTH MANAGEMENT
  // ============================================================
  students: studentsReducer,                  // Student management and profiles
  healthRecords: healthRecordsReducer,        // Student health records and medical history
  medications: medicationsReducer,            // Medication management and administration
  appointments: appointmentsReducer,          // Appointment scheduling and management
  
  // ============================================================
  // PHASE 2: COMMUNICATION & DOCUMENTATION
  // ============================================================
  communication: communicationReducer,        // Messages, notifications, and templates
  documents: documentsReducer,                // Document management and storage
  emergencyContacts: emergencyContactsReducer, // Emergency contact management
  
  // ============================================================
  // PHASE 2: OPERATIONS & INVENTORY
  // ============================================================
  inventory: inventoryReducer,                // Medical supplies and equipment
  reports: reportsReducer,                    // Analytics and reporting
  
  // ============================================================
  // PHASE 3: ADVANCED ENTERPRISE FEATURES
  // ============================================================
  enterprise: enterpriseReducer,              // Bulk operations, audit trails, and data sync
  orchestration: orchestrationReducer,        // Cross-domain workflow orchestration
  
  // ============================================================
  // TODO: COMPLIANCE & AUDIT (FUTURE PHASE)
  // ============================================================
  // compliance: complianceSlice,                // HIPAA compliance and audit tracking
  
  // ============================================================
  // TODO: UI & APPLICATION STATE (FUTURE PHASE)
  // ============================================================
  // ui: uiSlice,                               // Global UI state and preferences
});

/**
 * State synchronization configuration
 * Defines which slices to sync and how to sync them
 */
const stateSyncConfig: StateSyncConfig = {
  slices: [
    // ============================================================
    // AUTH SLICE - Session Storage (Security)
    // ============================================================
    {
      sliceName: 'auth',
      storage: 'sessionStorage', // Session only for security
      strategy: SyncStrategy.DEBOUNCED,
      debounceDelay: 500,
      // HIPAA Compliance: Exclude sensitive authentication data
      excludePaths: [
        'token', // JWT tokens
        'refreshToken', // Refresh tokens
        'password', // Passwords
        'user.ssn', // SSN if stored
      ],
      enableCrossTab: false, // Don't sync auth across tabs for security
      compress: false,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      version: 1,
    },

    // ============================================================
    // INCIDENT REPORTS SLICE - LocalStorage (UI Preferences)
    // ============================================================
    {
      sliceName: 'incidentReports',
      storage: 'localStorage',
      strategy: SyncStrategy.DEBOUNCED,
      debounceDelay: 1000, // Higher debounce for less frequent writes
      // HIPAA Compliance: Exclude sensitive PHI data
      excludePaths: [
        'reports', // Don't persist actual incident data (PHI)
        'selectedReport', // Don't persist selected report details
        'searchResults', // Don't persist search results
        'witnessStatements', // Don't persist witness statements
        'followUpActions', // Don't persist follow-up actions
      ],
      enableCrossTab: true, // Sync UI preferences across tabs
      compress: false,
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days for UI preferences
      version: 1,
      // Custom serializer to handle Date objects in filters
      serializer: {
        serialize: (state: any): string => {
          return JSON.stringify(state, (key, value) => {
            if (value instanceof Date) {
              return { __type: 'Date', value: value.toISOString() };
            }
            return value;
          });
        },
        deserialize: (data: string): any => {
          return JSON.parse(data, (key, value) => {
            if (value && typeof value === 'object' && value.__type === 'Date') {
              return new Date(value.value);
            }
            return value;
          });
        },
        validate: (state: any): boolean => {
          return state !== null && typeof state === 'object';
        },
      },
    },
  ],

  // ============================================================
  // GLOBAL CONFIGURATION
  // ============================================================
  conflictStrategy: ConflictStrategy.LAST_WRITE_WINS,
  channelName: 'whitecross-state-sync',
  debug: import.meta.env.DEV, // Enable debug logging in development
  storagePrefix: 'whitecross',
  maxStorageSize: 5 * 1024 * 1024, // 5MB limit

  // Error handling callback
  onError: (error: Error, context: string) => {
    console.error(`[StateSyncMiddleware] Error in ${context}:`, error);
    // In production, send to error tracking service (e.g., Sentry)
    if (import.meta.env.PROD) {
      // window.Sentry?.captureException(error, { tags: { context } });
    }
  },

  // Conflict handling callback
  onConflict: (conflict) => {
    console.warn('[StateSyncMiddleware] State conflict detected:', conflict);
    // In production, log to analytics for monitoring
    if (import.meta.env.PROD) {
      // window.analytics?.track('state_sync_conflict', conflict);
    }
  },
};

/**
 * Load persisted state from storage
 * Called before store creation to hydrate initial state
 */
const preloadedState = loadInitialState(stateSyncConfig);

/**
 * Create state synchronization middleware
 */
const stateSyncMiddleware = createStateSyncMiddleware(stateSyncConfig);

/**
 * Configure and create Redux store
 */
export const store = configureStore({
  reducer: rootReducer,
  preloadedState: preloadedState as any, // Hydrate store with persisted state
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types for serialization checks
        ignoredActions: [
          'persist/PERSIST',
          'persist/REHYDRATE',
          // State sync actions
          'STATE_UPDATE',
          'STATE_REQUEST',
          'STATE_RESPONSE',
          // Phase 3 async thunk actions
          'analytics/generateTrendAnalysis/pending',
          'analytics/generateTrendAnalysis/fulfilled',
          'analytics/generateTrendAnalysis/rejected',
          'analytics/assessStudentRisks/pending',
          'analytics/assessStudentRisks/fulfilled',
          'analytics/assessStudentRisks/rejected',
          'analytics/generateComplianceReport/pending',
          'analytics/generateComplianceReport/fulfilled',
          'analytics/generateComplianceReport/rejected',
          'enterprise/executeBulkOperation/pending',
          'enterprise/executeBulkOperation/fulfilled',
          'enterprise/executeBulkOperation/rejected',
          'enterprise/rollbackBulkOperation/pending',
          'enterprise/rollbackBulkOperation/fulfilled',
          'enterprise/rollbackBulkOperation/rejected',
          'enterprise/createAuditEntry/pending',
          'enterprise/createAuditEntry/fulfilled',
          'enterprise/createAuditEntry/rejected',
          'enterprise/syncEntityData/pending',
          'enterprise/syncEntityData/fulfilled',
          'enterprise/syncEntityData/rejected',
          'enterprise/executeWorkflow/pending',
          'enterprise/executeWorkflow/fulfilled',
          'enterprise/executeWorkflow/rejected',
          'orchestration/executeStudentEnrollment/pending',
          'orchestration/executeStudentEnrollment/fulfilled',
          'orchestration/executeStudentEnrollment/rejected',
          'orchestration/executeMedicationManagement/pending',
          'orchestration/executeMedicationManagement/fulfilled',
          'orchestration/executeMedicationManagement/rejected',
        ],
        // Ignore these paths in the state for serialization checks
        ignoredPaths: [
          'incidentReports.filters.startDate',
          'incidentReports.filters.endDate',
          // Phase 3 complex state paths
          'enterprise.auditTrail',
          'enterprise.bulkOperations',
          'orchestration.executions',
          'orchestration.workflows',
        ],
      },
      // Improve performance by disabling immutability checks in production
      immutableCheck: import.meta.env.DEV,
    }).concat(stateSyncMiddleware as any), // Add state sync middleware
  devTools: import.meta.env.DEV,
});

/**
 * Type definitions for Redux
 */
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

/**
 * Type guard to check if state is valid
 */
export function isValidRootState(state: any): state is RootState {
  return (
    state !== null &&
    typeof state === 'object' &&
    'auth' in state &&
    'incidentReports' in state
  );
}

/**
 * Reset all persisted state
 * Useful for logout or clearing cached data
 */
export function clearPersistedState(): void {
  try {
    // Clear localStorage
    const localStorageKeys = Object.keys(localStorage).filter((key) =>
      key.startsWith('whitecross_')
    );
    localStorageKeys.forEach((key) => localStorage.removeItem(key));

    // Clear sessionStorage
    const sessionStorageKeys = Object.keys(sessionStorage).filter((key) =>
      key.startsWith('whitecross_')
    );
    sessionStorageKeys.forEach((key) => sessionStorage.removeItem(key));

    console.log('[ReduxStore] Cleared all persisted state');
  } catch (error) {
    console.error('[ReduxStore] Error clearing persisted state:', error);
  }
}

/**
 * Get storage usage statistics
 * Helps monitor storage consumption for compliance
 */
export function getStorageStats(): {
  localStorage: { used: number; available: number; percentage: number };
  sessionStorage: { used: number; available: number; percentage: number };
} {
  const getSize = (storage: Storage): number => {
    let size = 0;
    for (const key in storage) {
      if (storage.hasOwnProperty(key) && key.startsWith('whitecross_')) {
        size += storage[key].length + key.length;
      }
    }
    return size;
  };

  const maxSize = 5 * 1024 * 1024; // 5MB typical browser limit
  const localUsed = getSize(localStorage);
  const sessionUsed = getSize(sessionStorage);

  return {
    localStorage: {
      used: localUsed,
      available: maxSize - localUsed,
      percentage: (localUsed / maxSize) * 100,
    },
    sessionStorage: {
      used: sessionUsed,
      available: maxSize - sessionUsed,
      percentage: (sessionUsed / maxSize) * 100,
    },
  };
}

// Export the store as default for use in the app
export default store;
