'use client';

/**
 * Permission Hooks - Role-Based Access Control (RBAC)
 *
 * Provides hooks for checking user permissions and roles in components.
 * Integrates with AuthContext for centralized permission management.
 *
 * @module hooks/usePermissions
 */

import { useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';

// ==========================================
// ROLE HIERARCHY
// ==========================================

/**
 * Role hierarchy for permission inheritance
 * Higher roles inherit permissions from lower roles
 */
const ROLE_HIERARCHY: Record<string, number> = {
  VIEWER: 1,
  STAFF: 2,
  COUNSELOR: 3,
  NURSE: 4,
  SCHOOL_ADMIN: 5,
  DISTRICT_ADMIN: 6,
  ADMIN: 7,
};

// ==========================================
// PERMISSION DEFINITIONS
// ==========================================

/**
 * System permissions mapped to required roles
 */
export const PERMISSIONS = {
  // Student Management
  'students:view': ['NURSE', 'SCHOOL_ADMIN', 'DISTRICT_ADMIN', 'ADMIN', 'COUNSELOR', 'STAFF'],
  'students:create': ['NURSE', 'SCHOOL_ADMIN', 'DISTRICT_ADMIN', 'ADMIN'],
  'students:edit': ['NURSE', 'SCHOOL_ADMIN', 'DISTRICT_ADMIN', 'ADMIN'],
  'students:delete': ['SCHOOL_ADMIN', 'DISTRICT_ADMIN', 'ADMIN'],

  // Health Records (PHI)
  'health_records:view': ['NURSE', 'SCHOOL_ADMIN', 'DISTRICT_ADMIN', 'ADMIN'],
  'health_records:create': ['NURSE', 'SCHOOL_ADMIN', 'DISTRICT_ADMIN', 'ADMIN'],
  'health_records:edit': ['NURSE', 'SCHOOL_ADMIN', 'DISTRICT_ADMIN', 'ADMIN'],
  'health_records:delete': ['SCHOOL_ADMIN', 'DISTRICT_ADMIN', 'ADMIN'],

  // Medications
  'medications:view': ['NURSE', 'SCHOOL_ADMIN', 'DISTRICT_ADMIN', 'ADMIN'],
  'medications:administer': ['NURSE', 'ADMIN'],
  'medications:create': ['NURSE', 'SCHOOL_ADMIN', 'DISTRICT_ADMIN', 'ADMIN'],
  'medications:edit': ['NURSE', 'SCHOOL_ADMIN', 'DISTRICT_ADMIN', 'ADMIN'],
  'medications:delete': ['SCHOOL_ADMIN', 'DISTRICT_ADMIN', 'ADMIN'],

  // Inventory
  'inventory:view': ['NURSE', 'SCHOOL_ADMIN', 'DISTRICT_ADMIN', 'ADMIN', 'STAFF'],
  'inventory:create': ['NURSE', 'SCHOOL_ADMIN', 'DISTRICT_ADMIN', 'ADMIN'],
  'inventory:edit': ['NURSE', 'SCHOOL_ADMIN', 'DISTRICT_ADMIN', 'ADMIN'],
  'inventory:delete': ['SCHOOL_ADMIN', 'DISTRICT_ADMIN', 'ADMIN'],

  // Reports
  'reports:view': ['NURSE', 'SCHOOL_ADMIN', 'DISTRICT_ADMIN', 'ADMIN', 'COUNSELOR'],
  'reports:create': ['NURSE', 'SCHOOL_ADMIN', 'DISTRICT_ADMIN', 'ADMIN'],
  'reports:export': ['SCHOOL_ADMIN', 'DISTRICT_ADMIN', 'ADMIN'],

  // Admin Functions
  'admin:users': ['ADMIN', 'DISTRICT_ADMIN'],
  'admin:schools': ['ADMIN', 'DISTRICT_ADMIN'],
  'admin:districts': ['ADMIN'],
  'admin:settings': ['ADMIN', 'DISTRICT_ADMIN', 'SCHOOL_ADMIN'],
  'admin:audit_logs': ['ADMIN', 'DISTRICT_ADMIN'],
  'admin:compliance': ['ADMIN', 'DISTRICT_ADMIN'],

  // Communication
  'communication:send': ['NURSE', 'SCHOOL_ADMIN', 'DISTRICT_ADMIN', 'ADMIN'],
  'communication:broadcast': ['SCHOOL_ADMIN', 'DISTRICT_ADMIN', 'ADMIN'],
  'communication:emergency': ['NURSE', 'SCHOOL_ADMIN', 'DISTRICT_ADMIN', 'ADMIN'],

  // Appointments
  'appointments:view': ['NURSE', 'SCHOOL_ADMIN', 'DISTRICT_ADMIN', 'ADMIN', 'STAFF'],
  'appointments:create': ['NURSE', 'SCHOOL_ADMIN', 'DISTRICT_ADMIN', 'ADMIN'],
  'appointments:edit': ['NURSE', 'SCHOOL_ADMIN', 'DISTRICT_ADMIN', 'ADMIN'],
  'appointments:cancel': ['NURSE', 'SCHOOL_ADMIN', 'DISTRICT_ADMIN', 'ADMIN'],
} as const;

export type Permission = keyof typeof PERMISSIONS;

// ==========================================
// HOOKS
// ==========================================

/**
 * Check if user has a specific permission
 *
 * @example
 * ```tsx
 * const hasPermission = useHasPermission();
 *
 * if (hasPermission('students:edit')) {
 *   return <EditButton />;
 * }
 * ```
 */
export function useHasPermission() {
  const { user } = useAuth();

  return useCallback(
    (permission: Permission): boolean => {
      if (!user) return false;

      const allowedRoles = PERMISSIONS[permission];
      if (!allowedRoles) return false;

      return allowedRoles.includes(user.role);
    },
    [user]
  );
}

/**
 * Check if user has a specific role or higher in hierarchy
 *
 * @example
 * ```tsx
 * const hasRole = useHasRole();
 *
 * if (hasRole('NURSE')) {
 *   return <NurseFeatures />;
 * }
 *
 * if (hasRole(['ADMIN', 'DISTRICT_ADMIN'])) {
 *   return <AdminFeatures />;
 * }
 * ```
 */
export function useHasRole() {
  const { user } = useAuth();

  return useCallback(
    (role: string | string[]): boolean => {
      if (!user) return false;

      const roles = Array.isArray(role) ? role : [role];
      return roles.includes(user.role);
    },
    [user]
  );
}

/**
 * Check if user has a role with equal or higher privilege level
 *
 * @example
 * ```tsx
 * const hasMinRole = useHasMinRole();
 *
 * if (hasMinRole('SCHOOL_ADMIN')) {
 *   // User is SCHOOL_ADMIN, DISTRICT_ADMIN, or ADMIN
 *   return <AdminPanel />;
 * }
 * ```
 */
export function useHasMinRole() {
  const { user } = useAuth();

  return useCallback(
    (minRole: string): boolean => {
      if (!user) return false;

      const userLevel = ROLE_HIERARCHY[user.role] || 0;
      const minLevel = ROLE_HIERARCHY[minRole] || 0;

      return userLevel >= minLevel;
    },
    [user]
  );
}

/**
 * Check if user has all specified permissions
 *
 * @example
 * ```tsx
 * const hasAllPermissions = useHasAllPermissions();
 *
 * if (hasAllPermissions(['students:view', 'students:edit'])) {
 *   return <StudentEditForm />;
 * }
 * ```
 */
export function useHasAllPermissions() {
  const hasPermission = useHasPermission();

  return useCallback(
    (permissions: Permission[]): boolean => {
      return permissions.every(permission => hasPermission(permission));
    },
    [hasPermission]
  );
}

/**
 * Check if user has any of the specified permissions
 *
 * @example
 * ```tsx
 * const hasAnyPermission = useHasAnyPermission();
 *
 * if (hasAnyPermission(['students:create', 'students:edit'])) {
 *   return <StudentForm />;
 * }
 * ```
 */
export function useHasAnyPermission() {
  const hasPermission = useHasPermission();

  return useCallback(
    (permissions: Permission[]): boolean => {
      return permissions.some(permission => hasPermission(permission));
    },
    [hasPermission]
  );
}

/**
 * Get all permissions for current user
 *
 * @example
 * ```tsx
 * const userPermissions = useUserPermissions();
 *
 * console.log('User can:', userPermissions);
 * ```
 */
export function useUserPermissions(): Permission[] {
  const { user } = useAuth();

  if (!user) return [];

  return (Object.keys(PERMISSIONS) as Permission[]).filter(permission => {
    const allowedRoles = PERMISSIONS[permission];
    return allowedRoles.includes(user.role);
  });
}

/**
 * Hook to require authentication
 * Redirects to login if not authenticated
 *
 * @example
 * ```tsx
 * function ProtectedPage() {
 *   useRequireAuth();
 *   return <div>Protected Content</div>;
 * }
 * ```
 */
export function useRequireAuth(redirectTo = '/login') {
  const { isAuthenticated } = useAuth();

  if (typeof window !== 'undefined' && !isAuthenticated) {
    const currentPath = window.location.pathname;
    window.location.href = `${redirectTo}?redirect=${encodeURIComponent(currentPath)}`;
  }
}

/**
 * Hook to require specific permission
 * Redirects to access denied if permission not granted
 *
 * @example
 * ```tsx
 * function StudentEditPage() {
 *   useRequirePermission('students:edit');
 *   return <StudentEditForm />;
 * }
 * ```
 */
export function useRequirePermission(permission: Permission) {
  const hasPermission = useHasPermission();

  if (typeof window !== 'undefined' && !hasPermission(permission)) {
    window.location.href = '/access-denied';
  }
}

/**
 * Hook to require specific role
 * Redirects to access denied if role not matched
 *
 * @example
 * ```tsx
 * function AdminPage() {
 *   useRequireRole('ADMIN');
 *   return <AdminPanel />;
 * }
 * ```
 */
export function useRequireRole(role: string | string[]) {
  const hasRole = useHasRole();

  if (typeof window !== 'undefined' && !hasRole(role)) {
    window.location.href = '/access-denied';
  }
}
