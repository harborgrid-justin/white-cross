'use client';

/**
 * RoleGuard Component
 *
 * Conditionally renders children based on user role(s).
 * Provides a declarative way to control UI visibility based on role-based access.
 *
 * @module components/guards/RoleGuard
 */

import React from 'react';
import { useHasRole } from '@/identity-access/hooks/auth-permission-hooks';

// ==========================================
// TYPES & INTERFACES
// ==========================================

/**
 * Props for RoleGuard component
 */
export interface RoleGuardProps {
  /**
   * Required role(s) to view children
   * Can be a single role string or an array of roles
   */
  role: string | string[];

  /**
   * Content to render when role requirement is met
   */
  children: React.ReactNode;

  /**
   * Content to render when role requirement is not met (optional)
   * If not provided, nothing is rendered
   */
  fallback?: React.ReactNode;
}

// ==========================================
// COMPONENT
// ==========================================

/**
 * RoleGuard - Conditional rendering based on user roles
 *
 * This component checks if the current user has one of the required roles
 * and renders children only if authorized. Useful for showing/hiding
 * UI elements based on user roles.
 *
 * @example
 * ```tsx
 * // Simple usage - require single role
 * <RoleGuard role="ADMIN">
 *   <AdminPanel />
 * </RoleGuard>
 *
 * // Require one of multiple roles
 * <RoleGuard role={['NURSE', 'SCHOOL_ADMIN', 'ADMIN']}>
 *   <MedicationAdministration />
 * </RoleGuard>
 *
 * // With fallback UI
 * <RoleGuard
 *   role="DISTRICT_ADMIN"
 *   fallback={<UnauthorizedMessage message="District admin access required" />}
 * >
 *   <DistrictSettings />
 * </RoleGuard>
 * ```
 */
export function RoleGuard({
  role,
  children,
  fallback = null,
}: RoleGuardProps) {
  const hasRole = useHasRole();

  // Check if user has the required role(s)
  const isAuthorized = hasRole(role);

  // Generate test ID based on role(s)
  const testId = Array.isArray(role)
    ? `role-guard-${role.join('-')}`
    : `role-guard-${role}`;

  // Render children if authorized, otherwise render fallback
  return (
    <div data-testid={testId}>
      {isAuthorized ? children : fallback}
    </div>
  );
}

// Export as default as well for flexibility
export default RoleGuard;
