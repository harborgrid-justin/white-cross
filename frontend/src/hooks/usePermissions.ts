/**
 * Permissions Hook
 * Provides permission checking functionality
 */

'use client';

import { useMemo } from 'react';
import { useAppSelector } from './reduxStore';

export interface Permission {
  resource: string;
  action: 'create' | 'read' | 'update' | 'delete';
}

export function usePermissions() {
  const user = useAppSelector((state) => state.auth?.user);
  const role = user?.role;

  const hasPermission = useMemo(
    () => (permission: string | Permission): boolean => {
      if (!user || !role) return false;

      // Admin has all permissions
      if (role === 'ADMIN' || role === 'SUPER_ADMIN') return true;

      // Parse permission string if needed
      const permObj = typeof permission === 'string'
        ? parsePermissionString(permission)
        : permission;

      // Role-based permission checks
      switch (role) {
        case 'NURSE':
          return checkNursePermissions(permObj);
        case 'TEACHER':
          return checkTeacherPermissions(permObj);
        case 'STAFF':
          return checkStaffPermissions(permObj);
        default:
          return false;
      }
    },
    [user, role]
  );

  const hasAnyPermission = useMemo(
    () => (permissions: (string | Permission)[]): boolean => {
      return permissions.some((p) => hasPermission(p));
    },
    [hasPermission]
  );

  const hasAllPermissions = useMemo(
    () => (permissions: (string | Permission)[]): boolean => {
      return permissions.every((p) => hasPermission(p));
    },
    [hasPermission]
  );

  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    role,
    user,
  };
}

function parsePermissionString(permission: string): Permission {
  const [resource, action] = permission.split(':');
  return {
    resource,
    action: (action as Permission['action']) || 'read',
  };
}

function checkNursePermissions(permission: Permission): boolean {
  const nurseResources = ['students', 'health-records', 'medications', 'appointments', 'incidents'];
  return nurseResources.includes(permission.resource);
}

function checkTeacherPermissions(permission: Permission): boolean {
  const teacherResources = ['students', 'incidents'];
  return teacherResources.includes(permission.resource) && permission.action === 'read';
}

function checkStaffPermissions(permission: Permission): boolean {
  return permission.resource === 'students' && permission.action === 'read';
}
