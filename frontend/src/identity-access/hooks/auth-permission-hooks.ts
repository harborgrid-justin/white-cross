'use client';

/**
 * Permission Hooks - Role-Based Access Control (RBAC)
 *
 * Provides hooks for checking user permissions and roles in components.
 * Integrates with AuthContext for centralized permission management.
 *
 * @module hooks/core/auth-permission-hooks
 */

import { useCallback } from 'react';
import { useAuth } from '@/identity-access/contexts/AuthContext';
import { PERMISSIONS, ROLE_HIERARCHY, type Permission } from './auth-permissions';

// ==========================================
// PERMISSION HOOKS
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
