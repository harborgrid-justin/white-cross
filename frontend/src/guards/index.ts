/**
 * Navigation Guards - Main Export
 *
 * Central export point for all navigation guard functionality.
 * Import from this file for a clean API.
 *
 * @module guards
 */

// Export all guard HOCs
export {
  withAuthGuard,
  withRoleGuard,
  withPermissionGuard,
  withDataGuard,
  withFeatureGuard,
  composeGuards
} from './navigationGuards';

// Export specialized data loaders
export {
  EnsureStudentLoaded,
  EnsureIncidentReportLoaded,
  EnsureMedicationLoaded,
  EnsureEntityLoaded
} from './navigationGuards';

// Export permission checking functions
export {
  checkPermission,
  checkAnyPermission,
  checkAllPermissions,
  checkRolePermission,
  hasAccessToRoute
} from './navigationGuards';

// Export unsaved changes management
export {
  useUnsavedChanges,
  UnsavedChangesPrompt
} from './navigationGuards';

// Export navigation interceptor
export {
  navigationInterceptorManager
} from './navigationGuards';

// Export guard failure handlers
export {
  RedirectToLogin,
  ShowAccessDenied,
  ShowDataLoadingError,
  ShowMaintenanceMode
} from './navigationGuards';

// Export utility namespace
export {
  navigationGuards
} from './navigationGuards';

// Export types
export type {
  NavigationGuard,
  GuardContext,
  GuardResult,
  PermissionCheck,
  RouteMetadata,
  BreadcrumbItem,
  DataLoader,
  GuardCompositionMode,
  NavigationInterceptor
} from './navigationGuards';

// Re-export components
export {
  default as LoadingSpinner
} from '../components/LoadingSpinner';

export {
  default as AccessDenied
} from '../pages/AccessDenied';
