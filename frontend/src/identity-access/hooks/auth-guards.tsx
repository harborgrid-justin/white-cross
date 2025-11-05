'use client';

/**
 * Auth Guard Hooks - Route Protection (Next.js App Router Compatible)
 *
 * Provides hooks for requiring authentication, permissions, and roles.
 * Uses proper Next.js App Router patterns with useEffect + useRouter.
 * Includes loading states to prevent flash of unauthorized content.
 *
 * @module hooks/core/auth-guards
 * @since 2025-11-04
 */

import { useRouter } from 'next/navigation';
import { useAuth } from '@/identity-access/contexts/AuthContext';
import { useEffect, useState } from 'react';
import { useHasPermission, useHasRole } from './auth-permission-hooks';
import { type Permission } from './auth-permissions';

// ==========================================
// TYPES
// ==========================================

interface AuthGuardState {
  isLoading: boolean;
  isAuthorized: boolean;
}

// ==========================================
// AUTH GUARD HOOKS
// ==========================================

/**
 * Hook to require authentication
 * Redirects to login if not authenticated
 *
 * @param redirectTo - Login page URL (default: '/login')
 * @returns Guard state with loading and authorization status
 *
 * @example
 * \`\`\`tsx
 * function ProtectedPage() {
 *   const { isLoading, isAuthorized } = useRequireAuth();
 *
 *   if (isLoading) {
 *     return <LoadingSpinner />;
 *   }
 *
 *   if (!isAuthorized) {
 *     return null; // Will redirect
 *   }
 *
 *   return <div>Protected Content</div>;
 * }
 * \`\`\`
 */
export function useRequireAuth(redirectTo = '/login'): AuthGuardState {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [state, setState] = useState<AuthGuardState>({
    isLoading: true,
    isAuthorized: false,
  });

  useEffect(() => {
    // Still loading auth state
    if (authLoading) {
      setState({ isLoading: true, isAuthorized: false });
      return;
    }

    // Auth loaded - check if authenticated
    if (!isAuthenticated) {
      // Not authenticated - redirect to login
      if (typeof window !== 'undefined') {
        const currentPath = window.location.pathname;
        const redirectPath = `${redirectTo}?redirect=${encodeURIComponent(currentPath)}`;
        router.push(redirectPath);
      }
      setState({ isLoading: false, isAuthorized: false });
      return;
    }

    // Authenticated
    setState({ isLoading: false, isAuthorized: true });
  }, [isAuthenticated, authLoading, router, redirectTo]);

  return state;
}

/**
 * Hook to require specific permission
 * Redirects to access denied if permission not granted
 *
 * @param permission - Required permission
 * @param redirectTo - Access denied page URL (default: '/access-denied')
 * @returns Guard state with loading and authorization status
 */
export function useRequirePermission(
  permission: Permission,
  redirectTo = '/access-denied'
): AuthGuardState {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const hasPermission = useHasPermission();
  const router = useRouter();
  const [state, setState] = useState<AuthGuardState>({
    isLoading: true,
    isAuthorized: false,
  });

  useEffect(() => {
    // Still loading auth state
    if (authLoading) {
      setState({ isLoading: true, isAuthorized: false });
      return;
    }

    // Not authenticated - redirect to login first
    if (!isAuthenticated) {
      if (typeof window !== 'undefined') {
        const currentPath = window.location.pathname;
        router.push(`/login?redirect=${encodeURIComponent(currentPath)}`);
      }
      setState({ isLoading: false, isAuthorized: false });
      return;
    }

    // Check permission
    const authorized = hasPermission(permission);

    if (!authorized) {
      // No permission - redirect to access denied
      router.push(redirectTo);
      setState({ isLoading: false, isAuthorized: false });
      return;
    }

    // Has permission
    setState({ isLoading: false, isAuthorized: true });
  }, [isAuthenticated, authLoading, permission, hasPermission, router, redirectTo]);

  return state;
}

/**
 * Hook to require specific role
 * Redirects to access denied if role not matched
 *
 * @param role - Required role (single role or array of acceptable roles)
 * @param redirectTo - Access denied page URL (default: '/access-denied')
 * @returns Guard state with loading and authorization status
 */
export function useRequireRole(
  role: string | string[],
  redirectTo = '/access-denied'
): AuthGuardState {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const hasRole = useHasRole();
  const router = useRouter();
  const [state, setState] = useState<AuthGuardState>({
    isLoading: true,
    isAuthorized: false,
  });

  useEffect(() => {
    // Still loading auth state
    if (authLoading) {
      setState({ isLoading: true, isAuthorized: false });
      return;
    }

    // Not authenticated - redirect to login first
    if (!isAuthenticated) {
      if (typeof window !== 'undefined') {
        const currentPath = window.location.pathname;
        router.push(`/login?redirect=${encodeURIComponent(currentPath)}`);
      }
      setState({ isLoading: false, isAuthorized: false });
      return;
    }

    // Check role
    const authorized = hasRole(role);

    if (!authorized) {
      // No role - redirect to access denied
      router.push(redirectTo);
      setState({ isLoading: false, isAuthorized: false });
      return;
    }

    // Has role
    setState({ isLoading: false, isAuthorized: true });
  }, [isAuthenticated, authLoading, role, hasRole, router, redirectTo]);

  return state;
}

// ==========================================
// GUARD COMPONENTS
// ==========================================

/**
 * Component wrapper that requires authentication
 */
export function AuthGuard({
  children,
  fallback = null,
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  const { isLoading, isAuthorized } = useRequireAuth();

  if (isLoading) {
    return <>{fallback}</>;
  }

  if (!isAuthorized) {
    return null;
  }

  return <>{children}</>;
}

/**
 * Component wrapper that requires specific permission
 */
export function PermissionGuard({
  permission,
  children,
  fallback = null,
}: {
  permission: Permission;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  const { isLoading, isAuthorized } = useRequirePermission(permission);

  if (isLoading) {
    return <>{fallback}</>;
  }

  if (!isAuthorized) {
    return null;
  }

  return <>{children}</>;
}

/**
 * Component wrapper that requires specific role
 */
export function RoleGuard({
  role,
  children,
  fallback = null,
}: {
  role: string | string[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  const { isLoading, isAuthorized } = useRequireRole(role);

  if (isLoading) {
    return <>{fallback}</>;
  }

  if (!isAuthorized) {
    return null;
  }

  return <>{children}</>;
}
