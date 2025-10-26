/**
 * Utilities - Central Export Hub
 * 
 * Cross-cutting utility hooks that can be used across all domains
 * including validation, communication, and UI utilities.
 */

// Form & Validation
export * from './useFormValidation';
export * from './routeValidation';

// Communication & Notifications  
export * from './useCommunicationOptions';
export * from './useReminderManagement';
export * from './useToast';
export * from './useMedicationToast';

// Navigation & State Management
export * from './useRouteState';

// Route Management
export * from './useStudentsRoute';
export * from './useStudentsRouteEnhanced';
export * from './useMedicationsRoute';

// Student-related Utilities
export { useStudentSelection } from './useStudentSelection';
export { useStudentViewManagement } from './useStudentViewManagement';
export * from './studentUtils';
export * from './studentRedux';

// System & Monitoring
export * from './useSystemHealth';

// Offline & Queue Management
export * from './useOfflineQueue';

// Authentication (Legacy Context - use specific exports to avoid conflicts)
export { AuthProvider } from './AuthContext';
export { useAuthContext } from './AuthContext';