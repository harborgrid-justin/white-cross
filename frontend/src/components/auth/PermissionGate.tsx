'use client';

/**
 * PermissionGate - Conditional rendering based on permissions
 *
 * Component-level authorization that shows/hides UI elements
 * based on user permissions and roles.
 *
 * @module components/auth/PermissionGate
 */

import { ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Permission type can be a string (e.g., "students:edit") or an object
 * For string-based permissions, use the format: "resource:action"
 */
export type PermissionString = string;

interface PermissionGateProps {
  children: ReactNode;
  permission?: PermissionString;
  permissions?: PermissionString[];
  role?: string | string[];
  minRole?: string;
  requireAll?: boolean;
  fallback?: ReactNode;
  inverse?: boolean;
}

/**
 * PermissionGate Component
 *
 * Conditionally renders children based on user permissions or roles.
 * Useful for showing/hiding UI elements without full route protection.
 *
 * @example Show button only if user can edit students
 * ```tsx
 * <PermissionGate permission="students:edit">
 *   <EditButton />
 * </PermissionGate>
 * ```
 *
 * @example Show admin panel only for admins
 * ```tsx
 * <PermissionGate role="ADMIN">
 *   <AdminPanel />
 * </PermissionGate>
 * ```
 *
 * @example Require multiple permissions (all)
 * ```tsx
 * <PermissionGate
 *   permissions={['students:view', 'students:edit']}
 *   requireAll
 * >
 *   <StudentEditForm />
 * </PermissionGate>
 * ```
 *
 * @example Require any of multiple permissions
 * ```tsx
 * <PermissionGate
 *   permissions={['students:create', 'students:edit']}
 *   requireAll={false}
 * >
 *   <StudentForm />
 * </PermissionGate>
 * ```
 *
 * @example With fallback content
 * ```tsx
 * <PermissionGate
 *   permission="admin:users"
 *   fallback={<p>You don't have admin access</p>}
 * >
 *   <UserManagement />
 * </PermissionGate>
 * ```
 *
 * @example Inverse logic (show if NOT authorized)
 * ```tsx
 * <PermissionGate role="ADMIN" inverse>
 *   <UpgradePrompt />
 * </PermissionGate>
 * ```
 */
export function PermissionGate({
  children,
  permission,
  permissions,
  role,
  minRole,
  requireAll = false,
  fallback = null,
  inverse = false,
}: PermissionGateProps) {
  const { hasPermission, hasRole } = useAuth();

  let hasAccess = true;

  // Check single permission
  if (permission) {
    hasAccess = hasPermission(permission as string);
  }

  // Check multiple permissions
  if (permissions && permissions.length > 0) {
    if (requireAll) {
      // Require all permissions
      hasAccess = permissions.every((p: PermissionString) => hasPermission(p as string));
    } else {
      // Require any permission
      hasAccess = permissions.some((p: PermissionString) => hasPermission(p as string));
    }
  }

  // Check role
  if (role) {
    hasAccess = hasRole(role);
  }

  // Check minimum role level
  if (minRole) {
    // This requires implementing role hierarchy in useAuth
    hasAccess = hasRole(minRole);
  }

  // Apply inverse logic if specified
  if (inverse) {
    hasAccess = !hasAccess;
  }

  // Render children or fallback
  return hasAccess ? <>{children}</> : <>{fallback}</>;
}
