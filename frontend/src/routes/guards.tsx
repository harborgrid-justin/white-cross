/**
 * Route Guards for White Cross Healthcare Platform
 *
 * This module provides comprehensive route protection mechanisms including:
 * - Authentication verification
 * - Role-based access control
 * - Permission checking
 * - Data loading guards
 * - Unsaved changes warnings
 * - Feature flag validation
 * - Route parameter validation
 *
 * @module routes/guards
 */

import React, { ReactNode, useEffect, useState, useCallback } from 'react';
import { Navigate, useLocation, useParams, useNavigate, useBlocker } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';
import { User } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import AccessDenied from '../pages/AccessDenied';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * User role types supported by the platform
 */
export type UserRole = 'ADMIN' | 'NURSE' | 'SCHOOL_ADMIN' | 'DISTRICT_ADMIN' | 'READ_ONLY' | 'COUNSELOR' | 'STAFF';

/**
 * Permission format: resource.action
 */
export type Permission = string;

/**
 * Feature flag configuration
 */
export interface FeatureFlag {
  name: string;
  enabled: boolean;
  roles?: UserRole[];
  users?: string[];
}

/**
 * Route parameter validation schema
 */
export interface ParamValidationSchema {
  [key: string]: 'uuid' | 'number' | 'enum' | RegExp | ((value: string) => boolean);
}

/**
 * Enum validation options
 */
export interface EnumValidation {
  type: 'enum';
  values: string[];
}

/**
 * Data loading guard configuration
 */
export interface DataLoadConfig<T = any> {
  /** Function to load required data */
  loadData: () => Promise<T>;
  /** Validation function to check if data is valid */
  validateData?: (data: T) => boolean;
  /** Error message when data fails to load */
  errorMessage?: string;
  /** Redirect path on error */
  redirectOnError?: string;
}

/**
 * Unsaved changes guard configuration
 */
export interface UnsavedChangesConfig {
  /** Check if there are unsaved changes */
  hasUnsavedChanges: boolean;
  /** Custom message to show in confirmation dialog */
  message?: string;
}

// ============================================================================
// AUTHENTICATION GUARD
// ============================================================================

/**
 * AuthGuard - Verifies user authentication
 *
 * Ensures the user is authenticated before allowing access to protected routes.
 * Redirects to login page with return URL if not authenticated.
 *
 * @example
 * ```tsx
 * <AuthGuard>
 *   <ProtectedPage />
 * </AuthGuard>
 * ```
 */
export interface AuthGuardProps {
  /** Content to render if authenticated */
  children: ReactNode;
  /** Custom redirect path (default: /login) */
  redirectTo?: string;
  /** Show loading spinner while checking auth */
  showLoading?: boolean;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({
  children,
  redirectTo = '/login',
  showLoading = true,
}) => {
  const { user, loading } = useAuthContext();
  const location = useLocation();

  if (loading && showLoading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    // Preserve the attempted URL for redirect after login
    const redirectUrl = `${redirectTo}?redirect=${encodeURIComponent(location.pathname + location.search)}`;
    return <Navigate to={redirectUrl} replace />;
  }

  return <>{children}</>;
};

// ============================================================================
// ROLE GUARD
// ============================================================================

/**
 * RoleGuard - Checks if user has required role(s)
 *
 * Restricts access based on user roles. Supports single role requirement
 * or multiple allowed roles.
 *
 * @example
 * ```tsx
 * // Single role
 * <RoleGuard requiredRole="ADMIN">
 *   <AdminPanel />
 * </RoleGuard>
 *
 * // Multiple roles
 * <RoleGuard allowedRoles={['ADMIN', 'NURSE']}>
 *   <HealthRecords />
 * </RoleGuard>
 * ```
 */
export interface RoleGuardProps {
  /** Content to render if role check passes */
  children: ReactNode;
  /** Single required role */
  requiredRole?: UserRole;
  /** Multiple allowed roles (user must have one) */
  allowedRoles?: UserRole[];
  /** Custom fallback component */
  fallback?: ReactNode;
  /** Redirect path instead of showing access denied */
  redirectTo?: string;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({
  children,
  requiredRole,
  allowedRoles,
  fallback,
  redirectTo,
}) => {
  const { user } = useAuthContext();

  // Check if user has required role
  const hasRequiredRole = useCallback(() => {
    if (!user) return false;

    if (requiredRole && user.role !== requiredRole) {
      return false;
    }

    if (allowedRoles && !allowedRoles.includes(user.role as UserRole)) {
      return false;
    }

    return true;
  }, [user, requiredRole, allowedRoles]);

  if (!hasRequiredRole()) {
    if (redirectTo) {
      return <Navigate to={redirectTo} replace />;
    }
    return <>{fallback || <AccessDenied />}</>;
  }

  return <>{children}</>;
};

// ============================================================================
// PERMISSION GUARD
// ============================================================================

/**
 * PermissionGuard - Verifies specific permissions
 *
 * Checks if user has specific permissions for resource actions.
 * Permissions follow the format: resource.action (e.g., 'students.create')
 *
 * @example
 * ```tsx
 * <PermissionGuard
 *   requiredPermission="medications.administer"
 *   requireAll={false}
 * >
 *   <MedicationAdministration />
 * </PermissionGuard>
 * ```
 */
export interface PermissionGuardProps {
  /** Content to render if permission check passes */
  children: ReactNode;
  /** Single permission to check */
  requiredPermission?: Permission;
  /** Multiple permissions to check */
  requiredPermissions?: Permission[];
  /** If true, user must have ALL permissions. If false, user needs ANY permission */
  requireAll?: boolean;
  /** Custom fallback component */
  fallback?: ReactNode;
  /** Redirect path instead of showing access denied */
  redirectTo?: string;
}

export const PermissionGuard: React.FC<PermissionGuardProps> = ({
  children,
  requiredPermission,
  requiredPermissions,
  requireAll = true,
  fallback,
  redirectTo,
}) => {
  const { user } = useAuthContext();

  // Check if user has required permissions
  const hasPermission = useCallback(() => {
    if (!user) return false;

    const permissions = requiredPermissions || (requiredPermission ? [requiredPermission] : []);
    if (permissions.length === 0) return true;

    // TODO: Implement actual permission checking when permission system is defined
    // For now, use role-based approximation
    const hasPermissionCheck = (permission: string): boolean => {
      const [resource, action] = permission.split('.');

      // Admin has all permissions
      if (user.role === 'ADMIN') return true;

      // Role-based permission approximation
      const rolePermissions: Record<UserRole, string[]> = {
        ADMIN: ['*.*'],
        NURSE: [
          'students.*', 'medications.*', 'health_records.*',
          'appointments.*', 'incidents.*', 'emergency_contacts.*'
        ],
        SCHOOL_ADMIN: [
          'students.read', 'medications.read', 'health_records.read',
          'reports.read', 'incidents.read'
        ],
        DISTRICT_ADMIN: [
          'students.read', 'medications.read', 'health_records.read',
          'reports.*', 'incidents.read', 'settings.read'
        ],
        READ_ONLY: [
          'students.read', 'medications.read', 'health_records.read',
          'appointments.read', 'incidents.read'
        ],
        COUNSELOR: [
          'students.read', 'students.update', 'health_records.read',
          'incidents.read', 'incidents.create'
        ],
        STAFF: ['communication.*', 'incidents.read']
      };

      const userPermissions = rolePermissions[user.role as UserRole] || [];

      // Check for wildcard permission
      if (userPermissions.includes('*.*')) return true;
      if (userPermissions.includes(`${resource}.*`)) return true;
      if (userPermissions.includes(permission)) return true;

      return false;
    };

    if (requireAll) {
      return permissions.every(hasPermissionCheck);
    } else {
      return permissions.some(hasPermissionCheck);
    }
  }, [user, requiredPermission, requiredPermissions, requireAll]);

  if (!hasPermission()) {
    if (redirectTo) {
      return <Navigate to={redirectTo} replace />;
    }
    return <>{fallback || <AccessDenied />}</>;
  }

  return <>{children}</>;
};

// ============================================================================
// DATA LOAD GUARD
// ============================================================================

/**
 * DataLoadGuard - Ensures required data is loaded before rendering
 *
 * Loads and validates required data before allowing route access.
 * Useful for routes that depend on specific data being available.
 *
 * @example
 * ```tsx
 * <DataLoadGuard
 *   loadData={async () => await fetchStudent(id)}
 *   validateData={(student) => !!student && student.isActive}
 *   errorMessage="Student not found or inactive"
 * >
 *   <StudentDetail />
 * </DataLoadGuard>
 * ```
 */
export interface DataLoadGuardProps<T = any> {
  /** Content to render after data loads */
  children: ReactNode | ((data: T) => ReactNode);
  /** Configuration for data loading */
  config: DataLoadConfig<T>;
  /** Custom loading component */
  loadingComponent?: ReactNode;
}

export function DataLoadGuard<T = any>({
  children,
  config,
  loadingComponent,
}: DataLoadGuardProps<T>) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        const loadedData = await config.loadData();

        // Validate data if validator provided
        if (config.validateData && !config.validateData(loadedData)) {
          throw new Error(config.errorMessage || 'Data validation failed');
        }

        setData(loadedData);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load required data';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [config]);

  if (loading) {
    return <>{loadingComponent || <LoadingSpinner />}</>;
  }

  if (error || !data) {
    if (config.redirectOnError) {
      return <Navigate to={config.redirectOnError} replace />;
    }
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Error Loading Data</h2>
          <p className="text-gray-600">{error || config.errorMessage || 'Failed to load required data'}</p>
        </div>
      </div>
    );
  }

  return <>{typeof children === 'function' ? children(data) : children}</>;
}

// ============================================================================
// UNSAVED CHANGES GUARD
// ============================================================================

/**
 * UnsavedChangesGuard - Warns before leaving with unsaved changes
 *
 * Prompts user confirmation before navigating away when there are unsaved changes.
 * Uses React Router's useBlocker for navigation blocking.
 *
 * @example
 * ```tsx
 * const [hasChanges, setHasChanges] = useState(false);
 *
 * <UnsavedChangesGuard
 *   hasUnsavedChanges={hasChanges}
 *   message="You have unsaved changes. Are you sure you want to leave?"
 * >
 *   <FormPage />
 * </UnsavedChangesGuard>
 * ```
 */
export interface UnsavedChangesGuardProps {
  /** Content to render */
  children: ReactNode;
  /** Whether there are unsaved changes */
  hasUnsavedChanges: boolean;
  /** Custom confirmation message */
  message?: string;
  /** Callback when navigation is blocked */
  onBlock?: () => void;
}

export const UnsavedChangesGuard: React.FC<UnsavedChangesGuardProps> = ({
  children,
  hasUnsavedChanges,
  message = 'You have unsaved changes. Are you sure you want to leave?',
  onBlock,
}) => {
  const navigate = useNavigate();
  const [showPrompt, setShowPrompt] = useState(false);
  const [nextLocation, setNextLocation] = useState<string | null>(null);

  // Block navigation when there are unsaved changes
  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      hasUnsavedChanges && currentLocation.pathname !== nextLocation.pathname
  );

  useEffect(() => {
    if (blocker.state === 'blocked') {
      setNextLocation(blocker.location.pathname);
      setShowPrompt(true);
      onBlock?.();
    }
  }, [blocker, onBlock]);

  // Browser beforeunload event for page refresh/close
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = message;
        return message;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges, message]);

  const handleConfirm = () => {
    setShowPrompt(false);
    if (blocker.state === 'blocked') {
      blocker.proceed?.();
    }
    if (nextLocation) {
      navigate(nextLocation);
    }
  };

  const handleCancel = () => {
    setShowPrompt(false);
    if (blocker.state === 'blocked') {
      blocker.reset?.();
    }
    setNextLocation(null);
  };

  return (
    <>
      {children}

      {/* Confirmation Modal */}
      {showPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Unsaved Changes</h3>
            <p className="text-gray-600 mb-6">{message}</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleCancel}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className="px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
              >
                Leave Page
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// ============================================================================
// FEATURE FLAG GUARD
// ============================================================================

/**
 * FeatureFlagGuard - Checks feature availability
 *
 * Controls access based on feature flags. Supports role-based and user-specific
 * feature enablement.
 *
 * @example
 * ```tsx
 * <FeatureFlagGuard
 *   featureName="incident-timeline"
 *   fallback={<ComingSoon />}
 * >
 *   <IncidentTimeline />
 * </FeatureFlagGuard>
 * ```
 */
export interface FeatureFlagGuardProps {
  /** Content to render if feature is enabled */
  children: ReactNode;
  /** Name of the feature flag to check */
  featureName: string;
  /** Custom fallback component when feature is disabled */
  fallback?: ReactNode;
  /** Redirect path instead of showing fallback */
  redirectTo?: string;
}

// Feature flags configuration (can be moved to context or API)
const FEATURE_FLAGS: Record<string, FeatureFlag> = {
  'incident-timeline': {
    name: 'incident-timeline',
    enabled: true,
    roles: ['ADMIN', 'NURSE', 'SCHOOL_ADMIN'],
  },
  'incident-witnesses': {
    name: 'incident-witnesses',
    enabled: true,
    roles: ['ADMIN', 'NURSE'],
  },
  'incident-actions': {
    name: 'incident-actions',
    enabled: true,
    roles: ['ADMIN', 'NURSE'],
  },
  'incident-evidence': {
    name: 'incident-evidence',
    enabled: true,
    roles: ['ADMIN', 'NURSE'],
  },
  'incident-export': {
    name: 'incident-export',
    enabled: true,
    roles: ['ADMIN', 'NURSE', 'SCHOOL_ADMIN', 'DISTRICT_ADMIN'],
  },
  'advanced-analytics': {
    name: 'advanced-analytics',
    enabled: false,
  },
  'telemedicine': {
    name: 'telemedicine',
    enabled: false,
  },
};

export const FeatureFlagGuard: React.FC<FeatureFlagGuardProps> = ({
  children,
  featureName,
  fallback,
  redirectTo,
}) => {
  const { user } = useAuthContext();

  const isFeatureEnabled = useCallback(() => {
    const feature = FEATURE_FLAGS[featureName];

    if (!feature || !feature.enabled) {
      return false;
    }

    // Check role-based access
    if (feature.roles && user) {
      return feature.roles.includes(user.role as UserRole);
    }

    // Check user-specific access
    if (feature.users && user) {
      return feature.users.includes(user.id);
    }

    // If no restrictions, feature is enabled for all
    return true;
  }, [featureName, user]);

  if (!isFeatureEnabled()) {
    if (redirectTo) {
      return <Navigate to={redirectTo} replace />;
    }
    return <>{fallback || <AccessDenied />}</>;
  }

  return <>{children}</>;
};

// ============================================================================
// ROUTE PARAMETER VALIDATION
// ============================================================================

/**
 * Validates UUID format (v4)
 */
export const isValidUUID = (value: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(value);
};

/**
 * Validates numeric value
 */
export const isValidNumber = (value: string): boolean => {
  return /^\d+$/.test(value) && !isNaN(Number(value));
};

/**
 * Validates enum value
 */
export const isValidEnum = (value: string, validValues: string[]): boolean => {
  return validValues.includes(value.toUpperCase());
};

/**
 * Route parameter validator
 *
 * @example
 * ```tsx
 * <RouteParamValidator
 *   schema={{
 *     id: 'uuid',
 *     type: ['INJURY', 'ILLNESS', 'BEHAVIORAL']
 *   }}
 *   redirectOnInvalid="/404"
 * >
 *   <IncidentDetail />
 * </RouteParamValidator>
 * ```
 */
export interface RouteParamValidatorProps {
  /** Content to render if params are valid */
  children: ReactNode;
  /** Validation schema for route parameters */
  schema: ParamValidationSchema;
  /** Redirect path for invalid params */
  redirectOnInvalid?: string;
  /** Custom fallback component */
  fallback?: ReactNode;
}

export const RouteParamValidator: React.FC<RouteParamValidatorProps> = ({
  children,
  schema,
  redirectOnInvalid = '/404',
  fallback,
}) => {
  const params = useParams();

  const validateParams = useCallback((): boolean => {
    for (const [paramName, validator] of Object.entries(schema)) {
      const paramValue = params[paramName];

      if (!paramValue) {
        console.warn(`Route parameter '${paramName}' is missing`);
        return false;
      }

      let isValid = false;

      if (validator === 'uuid') {
        isValid = isValidUUID(paramValue);
      } else if (validator === 'number') {
        isValid = isValidNumber(paramValue);
      } else if (typeof validator === 'function') {
        isValid = validator(paramValue);
      } else if (validator instanceof RegExp) {
        isValid = validator.test(paramValue);
      } else if (Array.isArray(validator)) {
        isValid = isValidEnum(paramValue, validator);
      }

      if (!isValid) {
        console.warn(`Route parameter '${paramName}' failed validation. Value: ${paramValue}`);
        return false;
      }
    }

    return true;
  }, [params, schema]);

  if (!validateParams()) {
    if (fallback) {
      return <>{fallback}</>;
    }
    return <Navigate to={redirectOnInvalid} replace />;
  }

  return <>{children}</>;
};

// ============================================================================
// COMBINED GUARD (Convenience Component)
// ============================================================================

/**
 * CombinedGuard - Applies multiple guards in sequence
 *
 * Convenience component that combines multiple guard checks.
 * Guards are evaluated in order: Auth -> Role -> Permission -> FeatureFlag
 *
 * @example
 * ```tsx
 * <CombinedGuard
 *   requiredRole="NURSE"
 *   requiredPermission="medications.administer"
 *   featureName="medication-administration"
 * >
 *   <MedicationPage />
 * </CombinedGuard>
 * ```
 */
export interface CombinedGuardProps {
  children: ReactNode;
  // Auth guard
  requireAuth?: boolean;
  // Role guard
  requiredRole?: UserRole;
  allowedRoles?: UserRole[];
  // Permission guard
  requiredPermission?: Permission;
  requiredPermissions?: Permission[];
  requireAllPermissions?: boolean;
  // Feature flag guard
  featureName?: string;
  // Param validation
  paramSchema?: ParamValidationSchema;
  // Common options
  fallback?: ReactNode;
  redirectTo?: string;
}

export const CombinedGuard: React.FC<CombinedGuardProps> = ({
  children,
  requireAuth = true,
  requiredRole,
  allowedRoles,
  requiredPermission,
  requiredPermissions,
  requireAllPermissions,
  featureName,
  paramSchema,
  fallback,
  redirectTo,
}) => {
  let content = <>{children}</>;

  // Apply param validation (innermost)
  if (paramSchema) {
    content = (
      <RouteParamValidator schema={paramSchema} redirectOnInvalid={redirectTo || '/404'}>
        {content}
      </RouteParamValidator>
    );
  }

  // Apply feature flag check
  if (featureName) {
    content = (
      <FeatureFlagGuard
        featureName={featureName}
        fallback={fallback}
        redirectTo={redirectTo}
      >
        {content}
      </FeatureFlagGuard>
    );
  }

  // Apply permission check
  if (requiredPermission || requiredPermissions) {
    content = (
      <PermissionGuard
        requiredPermission={requiredPermission}
        requiredPermissions={requiredPermissions}
        requireAll={requireAllPermissions}
        fallback={fallback}
        redirectTo={redirectTo}
      >
        {content}
      </PermissionGuard>
    );
  }

  // Apply role check
  if (requiredRole || allowedRoles) {
    content = (
      <RoleGuard
        requiredRole={requiredRole}
        allowedRoles={allowedRoles}
        fallback={fallback}
        redirectTo={redirectTo}
      >
        {content}
      </RoleGuard>
    );
  }

  // Apply auth check (outermost)
  if (requireAuth) {
    content = <AuthGuard>{content}</AuthGuard>;
  }

  return content;
};

export default {
  AuthGuard,
  RoleGuard,
  PermissionGuard,
  DataLoadGuard,
  UnsavedChangesGuard,
  FeatureFlagGuard,
  RouteParamValidator,
  CombinedGuard,
};
