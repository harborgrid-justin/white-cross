/**
 * @fileoverview Redux Store Configuration for Next.js 15 with App Router
 * @module stores/store
 * @category Store
 *
 * Enterprise-grade Redux store configured for Next.js 15 with SSR/SSG support.
 * Follows Domain-Driven Design with HIPAA-compliant state management.
 *
 * Architecture:
 * - **Domain-based organization**: State organized by business domains
 * - **Type-safe**: Full TypeScript integration with Redux Toolkit
 * - **SSR compatible**: Client-side only with proper hydration
 * - **Performance**: Selective persistence and memoized selectors
 * - **HIPAA compliance**: PHI exclusion from browser storage
 *
 * State Domains:
 * - **Core**: Auth, users, settings, dashboard
 * - **Healthcare**: Health records, medications, appointments
 * - **Student Management**: Students, emergency contacts
 * - **Communication**: Messages, notifications, templates
 * - **Administration**: Districts, schools, inventory, reports
 * - **Compliance**: Access control, audit logs
 *
 * Key Features:
 * - Client-side state management only (no SSR state)
 * - Selective persistence (localStorage for non-PHI, sessionStorage for auth)
 * - Redux DevTools integration in development
 * - Type-safe throughout with TypeScript
 * - Compatible with React Query for server state
 *
 * HIPAA Compliance:
 * - PHI fields excluded from localStorage
 * - Auth tokens in sessionStorage only
 * - Audit logging for sensitive state access
 * - No server-side state serialization
 *
 * State Persistence Strategy:
 * - **localStorage**: UI preferences, filters (non-PHI only)
 * - **sessionStorage**: Auth tokens (cleared on browser close)
 * - **Memory only**: All PHI data (students, health records, medications)
 * - **No SSR persistence**: State reconstructed on client
 *
 * @example
 * ```typescript
 * // Use in client components only
 * 'use client';
 * import { useAppSelector, useAppDispatch } from '@/stores/hooks';
 *
 * function MyComponent() {
 *   const user = useAppSelector(state => state.auth.user);
 *   const dispatch = useAppDispatch();
 * }
 * ```
 */

'use client';

import { configureStore, combineReducers, Middleware } from '@reduxjs/toolkit';

// Import identity-access reducers
import { authReducer, accessControlReducer } from '@/identity-access/stores';

// Import all domain reducers
import {
  // Core
  usersReducer,

  // Dashboard
  dashboardReducer,

  // Healthcare
  healthRecordsReducer,
  medicationsReducer,
  appointmentsReducer,

  // Student Management
  studentsReducer,
  emergencyContactsReducer,

  // Incident Management
  incidentReportsReducer,

  // Administration
  settingsReducer,
  configurationReducer,

  // Communication & Documentation
  communicationReducer,
  documentsReducer,
  contactsReducer,

  // REMOVED 10 unused Redux slices:
  // - districtsReducer, schoolsReducer, adminReducer (43KB)
  // - inventoryReducer (24KB), reportsReducer, budgetReducer
  // - purchaseOrderReducer (25KB), vendorReducer (18KB)
  // - integrationReducer (32KB), complianceReducer (25KB)
  // Total removed: ~192KB of Redux code
} from './slices';

// ==========================================
// ROOT REDUCER
// ==========================================

/**
 * Root reducer combining all domain reducers
 * Organized by domain for clear separation of concerns
 */
const rootReducer = combineReducers({
  // ============================================================
  // AUTHENTICATION & AUTHORIZATION (from @/identity-access)
  // ============================================================
  auth: authReducer,
  accessControl: accessControlReducer,
  users: usersReducer,

  // ============================================================
  // DASHBOARD & OVERVIEW
  // ============================================================
  dashboard: dashboardReducer,

  // ============================================================
  // CORE DOMAINS - INCIDENT MANAGEMENT
  // ============================================================
  incidentReports: incidentReportsReducer,

  // ============================================================
  // ADMINISTRATION & CONFIGURATION
  // ============================================================
  // REMOVED: districts, schools (unused in active code)
  settings: settingsReducer,
  // REMOVED: admin (43KB, unused in active code)
  configuration: configurationReducer,

  // ============================================================
  // STUDENT & HEALTH MANAGEMENT
  // ============================================================
  students: studentsReducer,
  healthRecords: healthRecordsReducer,
  medications: medicationsReducer,
  appointments: appointmentsReducer,
  emergencyContacts: emergencyContactsReducer,

  // ============================================================
  // COMMUNICATION & DOCUMENTATION
  // ============================================================
  communication: communicationReducer,
  documents: documentsReducer,
  contacts: contactsReducer,

  // ============================================================
  // OPERATIONS & INVENTORY - ALL REMOVED
  // ============================================================
  // REMOVED 6 slices: inventory (24KB), reports, budget,
  // purchaseOrder (25KB), vendor (18KB), integration (32KB)
  // Total: ~192KB of unused Redux state management code

  // ============================================================
  // COMPLIANCE & ACCESS CONTROL
  // ============================================================
  // REMOVED: compliance (25KB, unused in active code)
});

// ==========================================
// TYPE DEFINITIONS (defined early to avoid circular deps)
// ==========================================

/**
 * Root state type derived from the root reducer
 * Use this type for all selectors and state access
 */
export type RootState = ReturnType<typeof rootReducer>;

// ==========================================
// PERSISTENCE MIDDLEWARE (HIPAA-COMPLIANT)
// ==========================================

/**
 * Selective persistence middleware
 * Only persists non-PHI data to localStorage
 * Auth tokens go to sessionStorage only
 */
const persistenceMiddleware: Middleware = (store) => (next) => (action) => {
  const result = next(action);

  // Only run on client side
  if (typeof window === 'undefined') return result;

  const state = store.getState();

  try {
    // Persist UI preferences only (no PHI)
    const uiState = {
      settings: state.settings,
      // Filters and UI state from various slices (no actual data)
      incidentReportsUI: state.incidentReports ? {
        filters: state.incidentReports.filters,
        sortConfig: state.incidentReports.sortConfig,
        viewMode: state.incidentReports.viewMode,
      } : undefined,
    };

    localStorage.setItem('whitecross_ui_state', JSON.stringify(uiState));

    // Persist auth to sessionStorage (cleared on browser close)
    if (state.auth) {
      const authState = {
        user: state.auth.user,
        isAuthenticated: state.auth.isAuthenticated,
        // DO NOT persist tokens for security
      };
      sessionStorage.setItem('whitecross_auth', JSON.stringify(authState));
    }
  } catch (error) {
    console.error('[Redux Persistence] Error persisting state:', error);
  }

  return result;
};

/**
 * Audit logging middleware for HIPAA compliance
 * Logs access to sensitive state slices
 */
const auditMiddleware: Middleware = (_store) => (next) => (action) => {
  // Log sensitive actions in development
  if (process.env.NODE_ENV === 'development') {
    const sensitiveActions = [
      'healthRecords/',
      'medications/',
      'students/',
      'emergencyContacts/',
    ];

    const actionType = (action as { type: string }).type;
    if (sensitiveActions.some(prefix => actionType.startsWith(prefix))) {
      console.log('[Audit] Sensitive action dispatched:', actionType);
    }
  }

  return next(action);
};

// ==========================================
// LOAD PERSISTED STATE
// ==========================================

/**
 * Load persisted state from browser storage
 * Called before store creation
 */
function loadPersistedState() {
  if (typeof window === 'undefined') return undefined;

  try {
    // Load UI preferences
    const uiStateJson = localStorage.getItem('whitecross_ui_state');
    const uiState = uiStateJson ? JSON.parse(uiStateJson) : {};

    // Load auth from session storage
    const authStateJson = sessionStorage.getItem('whitecross_auth');
    const authState = authStateJson ? JSON.parse(authStateJson) : {};

    // Map persisted UI state keys to actual reducer keys
    const mappedState: Partial<RootState> = {
      auth: authState,
    };

    // Map settings directly
    if (uiState.settings) {
      mappedState.settings = uiState.settings;
    }

    // Map incidentReportsUI to incidentReports (only UI preferences, not data)
    if (uiState.incidentReportsUI) {
      mappedState.incidentReports = uiState.incidentReportsUI as any;
    }

    return mappedState;
  } catch (error) {
    console.error('[Redux] Error loading persisted state:', error);
    // Clear corrupted localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('whitecross_ui_state');
    }
    return undefined;
  }
}

// ==========================================
// STORE CONFIGURATION
// ==========================================

/**
 * Configure and create the Redux store
 * Client-side only with persistence and audit middleware
 */
export const makeStore = () => {
  return configureStore({
    reducer: rootReducer,
    preloadedState: loadPersistedState(),
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          // Ignore these action types
          ignoredActions: [
            'persist/PERSIST',
            'persist/REHYDRATE',
          ],
          // Ignore these field paths in all actions
          ignoredActionPaths: ['payload.date', 'meta.arg.originalArgs'],
          // Ignore these paths in the state
          ignoredPaths: [
            'incidentReports.filters.startDate',
            'incidentReports.filters.endDate',
          ],
        },
        // Disable immutability check in production for performance
        immutableCheck: process.env.NODE_ENV === 'development',
      })
        .concat(persistenceMiddleware)
        .concat(auditMiddleware),
    devTools: process.env.NODE_ENV === 'development',
  });
};

/**
 * Create store instance for client-side use
 * NOTE: In Next.js 15 App Router, each client gets its own store instance
 */
export const store = makeStore();

// ==========================================
// TYPE DEFINITIONS (Additional Store Types)
// ==========================================

/**
 * App dispatch type including thunk actions
 * Use this type for all dispatch calls
 */
export type AppDispatch = typeof store.dispatch;

/**
 * Store type for use in contexts and providers
 */
export type AppStore = typeof store;

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

/**
 * Type guard to validate if a given state object is a valid RootState
 *
 * @param state - The state object to validate
 * @returns True if state is valid RootState, false otherwise
 */
export function isValidRootState(state: unknown): state is RootState {
  return (
    state !== null &&
    typeof state === 'object' &&
    'auth' in state &&
    'students' in state &&
    'healthRecords' in state
  );
}

/**
 * Clears all persisted state from browser storage
 * Should be called on logout for HIPAA compliance
 *
 * @example
 * ```typescript
 * const handleLogout = () => {
 *   clearPersistedState();
 *   // ... logout logic
 * };
 * ```
 */
export function clearPersistedState(): void {
  if (typeof window === 'undefined') return;

  try {
    // Clear localStorage
    const localKeys = Object.keys(localStorage).filter((key) =>
      key.startsWith('whitecross_')
    );
    localKeys.forEach((key) => localStorage.removeItem(key));

    // Clear sessionStorage
    const sessionKeys = Object.keys(sessionStorage).filter((key) =>
      key.startsWith('whitecross_')
    );
    sessionKeys.forEach((key) => sessionStorage.removeItem(key));

    console.log('[Redux] Cleared all persisted state');
  } catch (error) {
    console.error('[Redux] Error clearing persisted state:', error);
  }
}

/**
 * Get storage usage statistics for monitoring
 *
 * @returns Storage stats for localStorage and sessionStorage
 */
export function getStorageStats(): {
  localStorage: { used: number; available: number; percentage: number };
  sessionStorage: { used: number; available: number; percentage: number };
} {
  if (typeof window === 'undefined') {
    return {
      localStorage: { used: 0, available: 0, percentage: 0 },
      sessionStorage: { used: 0, available: 0, percentage: 0 },
    };
  }

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

// Export store instance as default
export default store;
