/**
 * WF-GUARDS-001 | index.ts - Navigation Guards Barrel Export
 *
 * Central export point for all navigation guard functionality including
 * authentication guards, RBAC enforcement, data loading guards, and
 * permission checking utilities for the healthcare platform.
 *
 * @module guards
 *
 * @remarks
 * **Purpose**: Navigation guards provide declarative route protection,
 * ensuring users have proper authentication, authorization, and data
 * access before rendering protected routes and components.
 *
 * **HIPAA Compliance**: Guards enforce access control policies required
 * for HIPAA compliance, preventing unauthorized access to PHI data.
 * All guard failures are logged to the audit service.
 *
 * **Guard Types**:
 * 1. **Authentication Guards**: Verify user is logged in
 * 2. **Role Guards**: Verify user has required role (nurse, admin, etc.)
 * 3. **Permission Guards**: Verify specific permissions (students:read, medications:write)
 * 4. **Data Guards**: Pre-load required data before rendering
 * 5. **Feature Guards**: Check feature flags before rendering
 *
 * **Composition Patterns**:
 * Guards can be composed together for complex protection scenarios:
 * ```typescript
 * // Single guard
 * const ProtectedComponent = withAuthGuard(MyComponent);
 *
 * // Multiple guards (all must pass)
 * const ProtectedComponent = composeGuards([
 *   withAuthGuard,
 *   withRoleGuard(['nurse', 'admin']),
 *   withPermissionGuard('students:read')
 * ])(MyComponent);
 * ```
 *
 * **Guard Failure Handling**:
 * - Authentication failure → Redirect to login
 * - Authorization failure → Show access denied
 * - Data loading failure → Show error page
 * - All failures logged to audit service for compliance
 *
 * **Performance**:
 * - Guards use React.memo for efficient rendering
 * - Data guards cache loaded data in Redux
 * - Permission checks are memoized
 *
 * **Usage Examples**:
 * ```typescript
 * import {
 *   withAuthGuard,
 *   withRoleGuard,
 *   withPermissionGuard,
 *   EnsureStudentLoaded,
 *   checkPermission
 * } from '@/guards';
 *
 * // Protect entire component
 * const StudentProfile = withAuthGuard(
 *   withPermissionGuard('students:read')(StudentProfileComponent)
 * );
 *
 * // Data loading guard
 * const StudentDetail = EnsureStudentLoaded(StudentDetailComponent);
 *
 * // Permission checking in component
 * if (checkPermission(user, 'medications:write')) {
 *   // Show medication form
 * }
 * ```
 *
 * @see {@link navigationGuards} for implementation details
 * @see {@link contexts/AuthContext} for authentication state
 *
 * Last Updated: 2025-10-26 | File Type: .ts
 */

/**
 * Higher-Order Components (HOCs) for route protection.
 *
 * @remarks
 * These HOCs wrap components to enforce access control policies.
 * They can be composed together for complex protection scenarios.
 */
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
} from '../pages/auth/AccessDenied';
