/**
 * WF-IDX-121 | index.ts - React component or utility module
 * Purpose: react component or utility module
 * Upstream: React, external libs | Dependencies: React ecosystem
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: types, named exports | Key Features: Standard module
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */

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
