'use client';

/**
 * PermissionGate Component
 *
 * Conditionally renders children based on user permissions.
 * Provides a declarative way to control UI visibility based on RBAC permissions.
 *
 * @module components/guards/PermissionGate
 */

import React from 'react';
import { useHasPermission } from '@/identity-access/hooks/auth-permission-hooks';
import { type Permission } from '@/identity-access/hooks/auth-permissions';

// ==========================================
// TYPES & INTERFACES
// ==========================================

/**
 * Props for PermissionGate component
 */
export interface PermissionGateProps {
  /**
   * Required permission to view children
   */
  permission: Permission;

  /**
   * Content to render when permission is granted
   */
  children: React.ReactNode;

  /**
   * Content to render when permission is denied (optional)
   * If not provided, nothing is rendered
   */
  fallback?: React.ReactNode;
}

// ==========================================
// COMPONENT
// ==========================================

/**
 * PermissionGate - Conditional rendering based on permissions
 *
 * This component checks if the current user has the required permission
 * and renders children only if authorized. Useful for showing/hiding
 * UI elements based on user permissions.
 *
 * @example
 * ```tsx
 * // Simple usage - hide content if no permission
 * <PermissionGate permission="students:edit">
 *   <EditButton />
 * </PermissionGate>
 *
 * // With fallback UI
 * <PermissionGate
 *   permission="students:delete"
 *   fallback={<span>You don't have permission to delete students</span>}
 * >
 *   <DeleteButton />
 * </PermissionGate>
 * ```
 */
export function PermissionGate({
  permission,
  children,
  fallback = null,
}: PermissionGateProps) {
  const hasPermission = useHasPermission();

  // Check if user has the required permission
  const isAuthorized = hasPermission(permission);

  // Render children if authorized, otherwise render fallback
  return (
    <div data-testid={`permission-gate-${permission}`}>
      {isAuthorized ? children : fallback}
    </div>
  );
}

// Export as default as well for flexibility
export default PermissionGate;
