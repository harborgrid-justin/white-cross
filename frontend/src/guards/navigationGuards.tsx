/**
 * WF-COMP-125 | navigationGuards.tsx - React component or utility module
 * Purpose: react component or utility module
 * Upstream: ../contexts/AuthContext, ../types, ../components/LoadingSpinner | Dependencies: react-router-dom, ../contexts/AuthContext, ../types
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: default export, constants, functions, interfaces, types, named exports | Key Features: useState, useEffect, useMemo
 * Last Updated: 2025-10-17 | File Type: .tsx
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */

/**
 * Navigation Guards & Permission System
 *
 * Comprehensive navigation guard system with HOCs, permission checking,
 * data loading guards, and navigation interceptors for React Router v6.
 *
 * @module navigationGuards
 * @since 1.0.0
 */

import React, { ComponentType, useEffect, useState, useCallback, useMemo } from 'react';
import { useNavigate, useLocation, Location, NavigateFunction } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';
import { User, UserRole, Permission, PermissionAction, PermissionResource } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import { AccessDenied } from '../components/AccessDenied';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Navigation guard function type
 */
export type NavigationGuard<T = any> = (
  context: GuardContext
) => Promise<GuardResult> | GuardResult;

/**
 * Guard context provided to all navigation guards
 */
export interface GuardContext {
  user: User | null;
  location: Location;
  navigate: NavigateFunction;
  params?: Record<string, string>;
  data?: Record<string, any>;
}

/**
 * Result returned by navigation guards
 */
export interface GuardResult {
  /** Whether the guard allows navigation */
  allowed: boolean;
  /** Optional redirect path if navigation is denied */
  redirectTo?: string;
  /** Optional error message */
  error?: string;
  /** Optional data to pass to next guard */
  data?: Record<string, any>;
}

/**
 * Permission check configuration
 */
export interface PermissionCheck {
  /** Resource being accessed */
  resource: PermissionResource | string;
  /** Action being performed */
  action: PermissionAction | string;
  /** Additional context for permission check */
  context?: Record<string, unknown>;
}

/**
 * Route metadata configuration
 */
export interface RouteMetadata {
  /** Required roles to access this route */
  roles?: UserRole[];
  /** Required permissions to access this route */
  permissions?: PermissionCheck[];
  /** Data that must be loaded before showing route */
  requiredData?: string[];
  /** Page title */
  title?: string;
  /** Breadcrumb configuration */
  breadcrumbs?: BreadcrumbItem[];
  /** Feature flags required for this route */
  features?: string[];
  /** Whether this route requires authentication */
  requiresAuth?: boolean;
}

/**
 * Breadcrumb item
 */
export interface BreadcrumbItem {
  label: string;
  path?: string;
  icon?: string;
}

/**
 * Data loader function
 */
export type DataLoader<T = any> = (
  context: GuardContext
) => Promise<T>;

/**
 * Guard composition mode
 */
export type GuardCompositionMode = 'sequence' | 'parallel';

/**
 * Navigation interceptor function
 */
export type NavigationInterceptor = (
  to: Location,
  from: Location
) => Promise<boolean | string> | boolean | string;

// ============================================================================
// NAVIGATION GUARD HOCS
// ============================================================================

/**
 * Higher-order component that ensures user is authenticated
 *
 * @example
 * ```tsx
 * const ProtectedPage = withAuthGuard(MyPage);
 * ```
 */
export function withAuthGuard<P extends object>(
  Component: ComponentType<P>
): ComponentType<P> {
  return function AuthGuardedComponent(props: P) {
    const { user, loading } = useAuthContext();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
      if (!loading && !user) {
        // Store intended destination for redirect after login
        const redirectPath = encodeURIComponent(location.pathname + location.search);
        navigate(`/login?redirect=${redirectPath}`, { replace: true });

        // Log guard rejection
        logGuardAction('AUTH_GUARD', false, {
          reason: 'User not authenticated',
          attemptedPath: location.pathname
        });
      }
    }, [user, loading, navigate, location]);

    if (loading) {
      return <LoadingSpinner />;
    }

    if (!user) {
      return null; // Will redirect in useEffect
    }

    logGuardAction('AUTH_GUARD', true, {
      userId: user.id,
      path: location.pathname
    });

    return <Component {...props} />;
  };
}

/**
 * Higher-order component that checks user roles
 *
 * @example
 * ```tsx
 * const AdminPage = withRoleGuard(['ADMIN', 'SCHOOL_ADMIN'])(MyPage);
 * ```
 */
export function withRoleGuard<P extends object>(
  allowedRoles: UserRole[]
): (Component: ComponentType<P>) => ComponentType<P> {
  return function (Component: ComponentType<P>) {
    return function RoleGuardedComponent(props: P) {
      const { user, loading } = useAuthContext();
      const location = useLocation();

      if (loading) {
        return <LoadingSpinner />;
      }

      if (!user) {
        return <AccessDenied message="Authentication required" />;
      }

      const hasRole = allowedRoles.includes(user.role);

      if (!hasRole) {
        logGuardAction('ROLE_GUARD', false, {
          userId: user.id,
          userRole: user.role,
          allowedRoles,
          path: location.pathname
        });

        return (
          <AccessDenied
            message={`This page requires one of the following roles: ${allowedRoles.join(', ')}`}
          />
        );
      }

      logGuardAction('ROLE_GUARD', true, {
        userId: user.id,
        userRole: user.role,
        path: location.pathname
      });

      return <Component {...props} />;
    };
  };
}

/**
 * Higher-order component that checks user permissions
 *
 * @example
 * ```tsx
 * const StudentEditPage = withPermissionGuard([
 *   { resource: 'students', action: 'update' }
 * ])(MyPage);
 * ```
 */
export function withPermissionGuard<P extends object>(
  requiredPermissions: PermissionCheck[]
): (Component: ComponentType<P>) => ComponentType<P> {
  return function (Component: ComponentType<P>) {
    return function PermissionGuardedComponent(props: P) {
      const { user, loading } = useAuthContext();
      const location = useLocation();

      if (loading) {
        return <LoadingSpinner />;
      }

      if (!user) {
        return <AccessDenied message="Authentication required" />;
      }

      // Check all required permissions
      const hasAllPermissions = checkAllPermissions(user, requiredPermissions);

      if (!hasAllPermissions) {
        logGuardAction('PERMISSION_GUARD', false, {
          userId: user.id,
          userRole: user.role,
          requiredPermissions,
          path: location.pathname
        });

        return (
          <AccessDenied
            message="You don't have the required permissions to access this page"
          />
        );
      }

      logGuardAction('PERMISSION_GUARD', true, {
        userId: user.id,
        path: location.pathname
      });

      return <Component {...props} />;
    };
  };
}

/**
 * Higher-order component that ensures data is loaded before rendering
 *
 * @example
 * ```tsx
 * const StudentPage = withDataGuard(
 *   async (context) => {
 *     const student = await studentsApi.getById(context.params.id);
 *     return { student };
 *   }
 * )(MyPage);
 * ```
 */
export function withDataGuard<P extends object, T = any>(
  dataLoader: DataLoader<T>
): (Component: ComponentType<P & { guardData: T }>) => ComponentType<P> {
  return function (Component: ComponentType<P & { guardData: T }>) {
    return function DataGuardedComponent(props: P) {
      const { user } = useAuthContext();
      const navigate = useNavigate();
      const location = useLocation();
      const [data, setData] = useState<T | null>(null);
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState<string | null>(null);

      useEffect(() => {
        let mounted = true;

        const loadData = async () => {
          try {
            setLoading(true);
            setError(null);

            const context: GuardContext = {
              user,
              location,
              navigate,
            };

            const loadedData = await dataLoader(context);

            if (mounted) {
              setData(loadedData);
              logGuardAction('DATA_GUARD', true, {
                path: location.pathname,
                dataLoaded: true
              });
            }
          } catch (err: any) {
            if (mounted) {
              const errorMessage = err.message || 'Failed to load required data';
              setError(errorMessage);

              logGuardAction('DATA_GUARD', false, {
                path: location.pathname,
                error: errorMessage
              });
            }
          } finally {
            if (mounted) {
              setLoading(false);
            }
          }
        };

        loadData();

        return () => {
          mounted = false;
        };
      }, [user, location, navigate]);

      if (loading) {
        return <LoadingSpinner />;
      }

      if (error || !data) {
        return (
          <div className="p-8 text-center">
            <div className="inline-block p-6 bg-red-50 rounded-lg">
              <h2 className="text-xl font-semibold text-red-900 mb-2">
                Data Loading Error
              </h2>
              <p className="text-red-700">
                {error || 'Failed to load required data'}
              </p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Retry
              </button>
            </div>
          </div>
        );
      }

      return <Component {...props} guardData={data} />;
    };
  };
}

/**
 * Higher-order component that checks feature flags
 *
 * @example
 * ```tsx
 * const BetaPage = withFeatureGuard('beta-features')(MyPage);
 * ```
 */
export function withFeatureGuard<P extends object>(
  featureFlag: string
): (Component: ComponentType<P>) => ComponentType<P> {
  return function (Component: ComponentType<P>) {
    return function FeatureGuardedComponent(props: P) {
      const location = useLocation();
      const isFeatureEnabled = checkFeatureFlag(featureFlag);

      if (!isFeatureEnabled) {
        logGuardAction('FEATURE_GUARD', false, {
          feature: featureFlag,
          path: location.pathname
        });

        return (
          <div className="p-8 text-center">
            <div className="inline-block p-6 bg-yellow-50 rounded-lg">
              <h2 className="text-xl font-semibold text-yellow-900 mb-2">
                Feature Not Available
              </h2>
              <p className="text-yellow-700">
                This feature is currently not enabled on your account.
              </p>
            </div>
          </div>
        );
      }

      logGuardAction('FEATURE_GUARD', true, {
        feature: featureFlag,
        path: location.pathname
      });

      return <Component {...props} />;
    };
  };
}

// ============================================================================
// GUARD COMPOSITION
// ============================================================================

/**
 * Composes multiple guards into a single HOC
 *
 * @example
 * ```tsx
 * const ProtectedPage = composeGuards([
 *   withAuthGuard,
 *   withRoleGuard(['ADMIN']),
 *   withPermissionGuard([{ resource: 'users', action: 'manage' }])
 * ])(MyPage);
 * ```
 */
export function composeGuards<P extends object>(
  guards: Array<(Component: ComponentType<any>) => ComponentType<any>>,
  mode: GuardCompositionMode = 'sequence'
): (Component: ComponentType<P>) => ComponentType<P> {
  return function (Component: ComponentType<P>) {
    // Apply guards in reverse order (like function composition)
    return guards.reduceRight(
      (AccumulatedComponent, guard) => guard(AccumulatedComponent),
      Component
    );
  };
}

// ============================================================================
// PERMISSION CHECKING SYSTEM
// ============================================================================

/**
 * Check if user has a specific permission
 */
export function checkPermission(
  user: User | null,
  permission: PermissionCheck
): boolean {
  if (!user) return false;

  // Admin users have all permissions
  if (user.role === 'ADMIN' || user.role === 'DISTRICT_ADMIN') {
    return true;
  }

  // Role-based permission mapping
  const rolePermissions = getRolePermissions(user.role);

  // Check if role has the required permission
  const permissionKey = `${permission.resource}.${permission.action}`;
  return rolePermissions.includes(permissionKey) ||
         rolePermissions.includes(`${permission.resource}.*`) ||
         rolePermissions.includes('*.*');
}

/**
 * Check if user has any of the specified permissions
 */
export function checkAnyPermission(
  user: User | null,
  permissions: PermissionCheck[]
): boolean {
  if (!user) return false;
  return permissions.some(permission => checkPermission(user, permission));
}

/**
 * Check if user has all of the specified permissions
 */
export function checkAllPermissions(
  user: User | null,
  permissions: PermissionCheck[]
): boolean {
  if (!user) return false;
  return permissions.every(permission => checkPermission(user, permission));
}

/**
 * Check if a role has a specific permission
 */
export function checkRolePermission(
  role: UserRole,
  permission: PermissionCheck
): boolean {
  const rolePermissions = getRolePermissions(role);
  const permissionKey = `${permission.resource}.${permission.action}`;

  return rolePermissions.includes(permissionKey) ||
         rolePermissions.includes(`${permission.resource}.*`) ||
         rolePermissions.includes('*.*');
}

/**
 * Check if user has access to a specific route based on metadata
 */
export function hasAccessToRoute(
  user: User | null,
  metadata: RouteMetadata
): boolean {
  if (!user && metadata.requiresAuth !== false) {
    return false;
  }

  // Check role requirements
  if (metadata.roles && metadata.roles.length > 0) {
    if (!user || !metadata.roles.includes(user.role)) {
      return false;
    }
  }

  // Check permission requirements
  if (metadata.permissions && metadata.permissions.length > 0) {
    if (!checkAllPermissions(user, metadata.permissions)) {
      return false;
    }
  }

  // Check feature flag requirements
  if (metadata.features && metadata.features.length > 0) {
    const allFeaturesEnabled = metadata.features.every(checkFeatureFlag);
    if (!allFeaturesEnabled) {
      return false;
    }
  }

  return true;
}

/**
 * Get all permissions for a specific role
 */
function getRolePermissions(role: UserRole): string[] {
  const permissionMap: Record<UserRole, string[]> = {
    ADMIN: ['*.*'], // Admin has all permissions
    DISTRICT_ADMIN: ['*.*'], // District admin has all permissions
    SCHOOL_ADMIN: [
      'students.*',
      'medications.read',
      'medications.create',
      'medications.update',
      'health_records.read',
      'health_records.create',
      'health_records.update',
      'appointments.*',
      'incident_reports.*',
      'reports.read',
      'reports.create',
      'communication.*',
      'inventory.read',
      'inventory.update'
    ],
    NURSE: [
      'students.read',
      'students.update',
      'medications.*',
      'health_records.*',
      'appointments.*',
      'incident_reports.*',
      'reports.read',
      'reports.create',
      'emergency_contacts.*',
      'communication.*',
      'documents.*',
      'inventory.*'
    ],
    COUNSELOR: [
      'students.read',
      'health_records.read',
      'incident_reports.read',
      'incident_reports.create',
      'reports.read',
      'communication.read'
    ],
    READ_ONLY: [
      'students.read',
      'medications.read',
      'health_records.read',
      'appointments.read',
      'incident_reports.read',
      'reports.read'
    ]
  };

  return permissionMap[role] || [];
}

// ============================================================================
// DATA LOADING GUARDS
// ============================================================================

/**
 * Ensure incident report is loaded
 */
export function EnsureIncidentReportLoaded<P extends object>(
  Component: ComponentType<P & { incidentReport: any }>
): ComponentType<P & { incidentReportId: string }> {
  return withDataGuard<P & { incidentReportId: string }, { incidentReport: any }>(
    async (context) => {
      const { incidentReportsApi } = await import('../services');
      const incidentReportId = (context as any).incidentReportId;

      if (!incidentReportId) {
        throw new Error('Incident report ID is required');
      }

      const { report } = await incidentReportsApi.getById(incidentReportId);
      return { incidentReport: report };
    }
  )(Component as any) as any;
}

/**
 * Ensure student is loaded
 */
export function EnsureStudentLoaded<P extends object>(
  Component: ComponentType<P & { student: any }>
): ComponentType<P & { studentId: string }> {
  return withDataGuard<P & { studentId: string }, { student: any }>(
    async (context) => {
      const { studentsApi } = await import('../services');
      const studentId = (context as any).studentId;

      if (!studentId) {
        throw new Error('Student ID is required');
      }

      const student = await studentsApi.getById(studentId);
      return { student };
    }
  )(Component as any) as any;
}

/**
 * Ensure medication is loaded
 */
export function EnsureMedicationLoaded<P extends object>(
  Component: ComponentType<P & { medication: any }>
): ComponentType<P & { medicationId: string }> {
  return withDataGuard<P & { medicationId: string }, { medication: any }>(
    async (context) => {
      const { medicationsApi } = await import('../services');
      const medicationId = (context as any).medicationId;

      if (!medicationId) {
        throw new Error('Medication ID is required');
      }

      const medication = await medicationsApi.getById(medicationId);
      return { medication };
    }
  )(Component as any) as any;
}

/**
 * Generic entity loader guard
 */
export function EnsureEntityLoaded<T, P extends object>(
  entityName: string,
  loader: (id: string) => Promise<T>
): (Component: ComponentType<P & Record<string, T>>) => ComponentType<P & { entityId: string }> {
  return function (Component: ComponentType<P & Record<string, T>>) {
    return withDataGuard<P & { entityId: string }, Record<string, T>>(
      async (context) => {
        const entityId = (context as any).entityId;

        if (!entityId) {
          throw new Error(`${entityName} ID is required`);
        }

        const entity = await loader(entityId);
        return { [entityName]: entity } as Record<string, T>;
      }
    )(Component as any) as any;
  };
}

// ============================================================================
// UNSAVED CHANGES GUARD
// ============================================================================

/**
 * Hook for tracking unsaved changes
 *
 * @example
 * ```tsx
 * function MyForm() {
 *   const { setHasUnsavedChanges, showPrompt } = useUnsavedChanges();
 *
 *   useEffect(() => {
 *     setHasUnsavedChanges(formDirty);
 *   }, [formDirty, setHasUnsavedChanges]);
 *
 *   return <form>...</form>;
 * }
 * ```
 */
export function useUnsavedChanges() {
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null);
  const navigate = useNavigate();

  // Handle browser refresh/close
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
        return '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  const confirmNavigation = useCallback(() => {
    setHasUnsavedChanges(false);
    setShowPrompt(false);
    if (pendingNavigation) {
      navigate(pendingNavigation);
      setPendingNavigation(null);
    }
  }, [pendingNavigation, navigate]);

  const cancelNavigation = useCallback(() => {
    setShowPrompt(false);
    setPendingNavigation(null);
  }, []);

  const attemptNavigation = useCallback((path: string) => {
    if (hasUnsavedChanges) {
      setPendingNavigation(path);
      setShowPrompt(true);
      return false;
    }
    navigate(path);
    return true;
  }, [hasUnsavedChanges, navigate]);

  return {
    hasUnsavedChanges,
    setHasUnsavedChanges,
    showPrompt,
    confirmNavigation,
    cancelNavigation,
    attemptNavigation
  };
}

/**
 * Unsaved changes prompt component
 */
export function UnsavedChangesPrompt({
  isOpen,
  onSave,
  onDiscard,
  onCancel
}: {
  isOpen: boolean;
  onSave?: () => void;
  onDiscard: () => void;
  onCancel: () => void;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Unsaved Changes
        </h2>
        <p className="text-gray-700 mb-6">
          You have unsaved changes. What would you like to do?
        </p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded hover:bg-gray-200"
          >
            Stay on Page
          </button>
          <button
            onClick={onDiscard}
            className="px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700"
          >
            Discard Changes
          </button>
          {onSave && (
            <button
              onClick={onSave}
              className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
            >
              Save & Continue
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// NAVIGATION INTERCEPTORS
// ============================================================================

/**
 * Navigation interceptor manager
 */
class NavigationInterceptorManager {
  private interceptors: NavigationInterceptor[] = [];
  private beforeNavigateCallbacks: Array<(to: Location, from: Location, next: () => void) => void> = [];
  private afterNavigateCallbacks: Array<(to: Location, from: Location) => void> = [];
  private errorCallbacks: Array<(error: Error) => void> = [];
  private cancelCallbacks: Array<() => void> = [];

  addInterceptor(interceptor: NavigationInterceptor): () => void {
    this.interceptors.push(interceptor);
    return () => {
      const index = this.interceptors.indexOf(interceptor);
      if (index > -1) {
        this.interceptors.splice(index, 1);
      }
    };
  }

  async runInterceptors(to: Location, from: Location): Promise<boolean | string> {
    for (const interceptor of this.interceptors) {
      try {
        const result = await interceptor(to, from);
        if (result !== true) {
          return result;
        }
      } catch (error) {
        this.errorCallbacks.forEach(cb => cb(error as Error));
        return false;
      }
    }
    return true;
  }

  beforeNavigate(
    callback: (to: Location, from: Location, next: () => void) => void
  ): () => void {
    this.beforeNavigateCallbacks.push(callback);
    return () => {
      const index = this.beforeNavigateCallbacks.indexOf(callback);
      if (index > -1) {
        this.beforeNavigateCallbacks.splice(index, 1);
      }
    };
  }

  afterNavigate(callback: (to: Location, from: Location) => void): () => void {
    this.afterNavigateCallbacks.push(callback);
    return () => {
      const index = this.afterNavigateCallbacks.indexOf(callback);
      if (index > -1) {
        this.afterNavigateCallbacks.splice(index, 1);
      }
    };
  }

  onNavigationError(callback: (error: Error) => void): () => void {
    this.errorCallbacks.push(callback);
    return () => {
      const index = this.errorCallbacks.indexOf(callback);
      if (index > -1) {
        this.errorCallbacks.splice(index, 1);
      }
    };
  }

  onNavigationCancelled(callback: () => void): () => void {
    this.cancelCallbacks.push(callback);
    return () => {
      const index = this.cancelCallbacks.indexOf(callback);
      if (index > -1) {
        this.cancelCallbacks.splice(index, 1);
      }
    };
  }

  triggerBeforeNavigate(to: Location, from: Location): Promise<void> {
    return new Promise((resolve) => {
      let completed = 0;
      const total = this.beforeNavigateCallbacks.length;

      if (total === 0) {
        resolve();
        return;
      }

      const next = () => {
        completed++;
        if (completed === total) {
          resolve();
        }
      };

      this.beforeNavigateCallbacks.forEach(cb => cb(to, from, next));
    });
  }

  triggerAfterNavigate(to: Location, from: Location): void {
    this.afterNavigateCallbacks.forEach(cb => cb(to, from));
  }

  triggerNavigationCancelled(): void {
    this.cancelCallbacks.forEach(cb => cb());
  }
}

export const navigationInterceptorManager = new NavigationInterceptorManager();

// ============================================================================
// GUARD FAILURE HANDLERS
// ============================================================================

/**
 * Redirect to login page
 */
export function RedirectToLogin({ redirectUrl }: { redirectUrl?: string }) {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const destination = redirectUrl || location.pathname + location.search;
    navigate(`/login?redirect=${encodeURIComponent(destination)}`, { replace: true });
  }, [navigate, location, redirectUrl]);

  return <LoadingSpinner />;
}

/**
 * Show access denied page
 */
export function ShowAccessDenied({ message }: { message?: string }) {
  return <AccessDenied message={message} />;
}

/**
 * Show data loading error
 */
export function ShowDataLoadingError({
  error,
  onRetry
}: {
  error: string;
  onRetry?: () => void;
}) {
  return (
    <div className="p-8 text-center">
      <div className="inline-block p-6 bg-red-50 rounded-lg">
        <h2 className="text-xl font-semibold text-red-900 mb-2">
          Data Loading Error
        </h2>
        <p className="text-red-700 mb-4">{error}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Retry
          </button>
        )}
      </div>
    </div>
  );
}

/**
 * Show maintenance mode page
 */
export function ShowMaintenanceMode({
  message,
  estimatedEndTime
}: {
  message?: string;
  estimatedEndTime?: string;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full mx-4 p-8 bg-white rounded-lg shadow-lg text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-yellow-100 rounded-full flex items-center justify-center">
          <svg
            className="w-8 h-8 text-yellow-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Maintenance Mode
        </h1>
        <p className="text-gray-600 mb-4">
          {message || 'The system is currently under maintenance. Please check back later.'}
        </p>
        {estimatedEndTime && (
          <p className="text-sm text-gray-500">
            Estimated completion: {new Date(estimatedEndTime).toLocaleString()}
          </p>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Check if a feature flag is enabled
 */
function checkFeatureFlag(flag: string): boolean {
  // In a real implementation, this would check against a feature flag service
  // For now, we'll use environment variables or local storage

  try {
    const featureFlags = JSON.parse(
      localStorage.getItem('featureFlags') || '{}'
    );
    return featureFlags[flag] === true;
  } catch {
    return false;
  }
}

/**
 * Log guard action for analytics and debugging
 */
function logGuardAction(
  guardType: string,
  allowed: boolean,
  metadata: Record<string, any>
): void {
  if (import.meta.env.DEV) {
    console.log(`[${guardType}]`, allowed ? 'ALLOWED' : 'DENIED', metadata);
  }

  // In production, send to analytics service
  if (import.meta.env.PROD) {
    // Analytics tracking would go here
    // Example: analytics.track('navigation_guard', { guardType, allowed, ...metadata });
  }

  // Track security-relevant events for audit log
  if (!allowed && (guardType === 'AUTH_GUARD' || guardType === 'PERMISSION_GUARD')) {
    // In a real implementation, send to backend audit log
    console.warn('[SECURITY]', guardType, 'denied access', metadata);
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export {
  // Re-export components
  LoadingSpinner,
  AccessDenied
};

/**
 * Navigation guard utilities
 */
export const navigationGuards = {
  withAuthGuard,
  withRoleGuard,
  withPermissionGuard,
  withDataGuard,
  withFeatureGuard,
  composeGuards,
  checkPermission,
  checkAnyPermission,
  checkAllPermissions,
  checkRolePermission,
  hasAccessToRoute,
  useUnsavedChanges,
  navigationInterceptorManager
};

export default navigationGuards;
