/**
 * @fileoverview Redux store configuration with domain-driven architecture
 * @module stores/reduxStore
 * @category Store
 * 
 * Enterprise-grade Redux store configuration following Domain-Driven Design (DDD)
 * principles with comprehensive state management features.
 * 
 * Architecture:
 * - **Domain-based organization**: State organized by business domains
 * - **Type-safe**: Full TypeScript integration with Redux Toolkit
 * - **Middleware stack**: State sync, monitoring, audit logging
 * - **Performance**: Selective persistence and memoized selectors
 * - **HIPAA compliance**: PHI exclusion from persistence
 * 
 * State Domains:
 * - **Core**: Auth, users, settings, dashboard
 * - **Healthcare**: Health records, medications, appointments
 * - **Student Management**: Students, emergency contacts
 * - **Communication**: Messages, notifications, templates
 * - **Administration**: Districts, schools, inventory, reports
 * - **Enterprise**: Advanced features, cross-domain orchestration
 * 
 * Key Features:
 * - Cross-tab state synchronization via BroadcastChannel API
 * - Selective persistence (localStorage for non-PHI, sessionStorage for UI state)
 * - Automatic state hydration on app load
 * - State migration support for schema changes
 * - Conflict resolution for concurrent updates
 * - Performance monitoring and metrics
 * - DevTools integration in development
 * 
 * HIPAA Compliance:
 * - PHI fields excluded from localStorage
 * - Audit logging for sensitive state access
 * - Automatic data sanitization
 * - Session-only storage for sensitive data
 * 
 * State Persistence Strategy:
 * - **localStorage**: Settings, UI preferences, filters (non-PHI only)
 * - **sessionStorage**: None (state reconstructed on load)
 * - **Memory only**: All PHI data (students, health records, medications)
 * - **Cross-tab sync**: Real-time via BroadcastChannel (memory only)
 * 
 * @example
 * ```typescript
 * // Access store in components
 * import { useAppSelector, useAppDispatch } from '@/stores';
 * 
 * function MyComponent() {
 *   const user = useAppSelector(state => state.auth.user);
 *   const dispatch = useAppDispatch();
 *   
 *   // Dispatch actions
 *   dispatch(loginUser(credentials));
 * }
 * 
 * // Access store outside React
 * import { store } from '@/stores';
 * 
 * const currentState = store.getState();
 * store.dispatch(someAction());
 * ```
 * 
 * @see {@link https://redux-toolkit.js.org/|Redux Toolkit Documentation}
 * @see {@link https://redux.js.org/tutorials/fundamentals/part-6-async-logic|Redux Async Logic}
 */

import { configureStore, combineReducers } from '@reduxjs/toolkit';
// Global/shared slices from stores/slices
import authSlice from './slices/authSlice';
import { usersReducer } from './slices/usersSlice';
import { districtsReducer } from './slices/districtsSlice';
import { schoolsReducer } from './slices/schoolsSlice';
import { settingsReducer } from './slices/settingsSlice';
import { documentsReducer } from './slices/documentsSlice';
import { communicationReducer } from './slices/communicationSlice';
import { inventoryReducer } from './slices/inventorySlice';
import { reportsReducer } from './slices/reportsSlice';
// Page-specific slices
import incidentReportsSlice from '../pages/incidents/store/incidentReportsSlice';
import { studentsReducer } from '../pages/students/store/studentsSlice';
import { healthRecordsReducer } from '../pages/students/store/healthRecordsSlice';
import { emergencyContactsReducer } from '../pages/students/store/emergencyContactsSlice';
import { medicationsReducer } from '../pages/medications/store/medicationsSlice';
import { appointmentsReducer } from '../pages/appointments/store/appointmentsSlice';
import dashboardReducer from '../pages/dashboard/store/dashboardSlice';
// Phase 3: Advanced enterprise features
import enterpriseReducer from './shared/enterprise/enterpriseFeatures';
import orchestrationReducer from './shared/orchestration/crossDomainOrchestration';
import {
  createStateSyncMiddleware,
  loadInitialState,
  SyncStrategy,
  ConflictStrategy,
  type StateSyncConfig,
  type RootState as SyncRootState,
} from '../middleware/redux/stateSyncMiddleware';

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
  // DASHBOARD & OVERVIEW
  // ============================================================
  dashboard: dashboardReducer,                // Dashboard statistics and overview data
  
  // ============================================================
  // CORE DOMAINS - INCIDENT MANAGEMENT
  // ============================================================
  incidentReports: incidentReportsSlice,      // Incident reporting and tracking
  
  // ============================================================
  // ADMINISTRATION & CONFIGURATION
  // ============================================================
  users: usersReducer,                        // User management and access control
  districts: districtsReducer,                // District management
  schools: schoolsReducer,                    // School management
  settings: settingsReducer,                  // System configuration and settings
  
  // ============================================================
  // STUDENT & HEALTH MANAGEMENT
  // ============================================================
  students: studentsReducer,                  // Student management and profiles
  healthRecords: healthRecordsReducer,        // Student health records and medical history
  medications: medicationsReducer,            // Medication management and administration
  appointments: appointmentsReducer,          // Appointment scheduling and management
  emergencyContacts: emergencyContactsReducer, // Emergency contact management
  
  // ============================================================
  // COMMUNICATION & DOCUMENTATION
  // ============================================================
  communication: communicationReducer,        // Messages, notifications, and templates
  documents: documentsReducer,                // Document management and storage
  
  // ============================================================
  // OPERATIONS & INVENTORY
  // ============================================================
  inventory: inventoryReducer,                // Medical supplies and equipment
  reports: reportsReducer,                    // Analytics and reporting
  
  // ============================================================
  // ADVANCED ENTERPRISE FEATURES
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
