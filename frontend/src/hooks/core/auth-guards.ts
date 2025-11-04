'use client';

/**
 * Auth Guard Hooks - Route Protection
 *
 * Provides hooks for requiring authentication, permissions, and roles.
 * Automatically redirects users who don't meet requirements.
 *
 * @module hooks/core/auth-guards
 */

import { useAuth } from '@/contexts/AuthContext';
import { useHasPermission, useHasRole } from './auth-permission-hooks';
import { type Permission } from './auth-permissions';

// ==========================================
// AUTH GUARD HOOKS
// ==========================================

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
