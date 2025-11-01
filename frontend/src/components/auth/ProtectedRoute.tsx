/**
 * WF-COMP-AUTH-001 | ProtectedRoute.tsx - Protected Route Component
 * Purpose: Route wrapper for role-based access control (RBAC)
 * Upstream: React Router | Dependencies: react-router-dom, AuthContext
 * Downstream: All protected routes | Called by: Route components
 * Related: AuthContext, access control system
 * Exports: ProtectedRoute component | Key Features: RBAC, authentication check, redirect
 * Last Updated: 2025-10-24 | File Type: .tsx
 * Critical Path: Route access → Auth check → Role validation → Render or redirect
 * LLM Context: Protected route wrapper component with role-based access control
 */

'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';

/**
 * Props for ProtectedRoute component
 */
interface ProtectedRouteProps {
  /** Child components to render if authorized */
  children: React.ReactNode;
  /** Required roles for accessing this route (optional) */
  allowedRoles?: string[];
  /** Redirect path if unauthorized (default: /auth/access-denied) */
  redirectTo?: string;
}

/**
 * ProtectedRoute Component
 *
 * A route wrapper component that provides:
 * - Authentication verification
 * - Role-based access control (RBAC)
 * - Automatic redirect for unauthorized access
 * - Preservation of intended destination
 * - Security event logging
 *
 * Features:
 * - Checks if user is authenticated
 * - Validates user role against allowed roles
 * - Redirects to login if not authenticated
 * - Redirects to access denied if authenticated but insufficient permissions
 * - Preserves the intended destination for post-login redirect
 * - Logs security events for audit trail
 *
 * @param props - ProtectedRoute props
 * @returns Rendered children if authorized, otherwise Navigate to appropriate page
 *
 * @example
 * ```tsx
 * // Protect a route requiring authentication
 * <ProtectedRoute>
 *   <Dashboard />
 * </ProtectedRoute>
 *
 * // Protect a route requiring specific roles
 * <ProtectedRoute allowedRoles={['ADMIN', 'SECURITY_MANAGER']}>
 *   <AdminPanel />
 * </ProtectedRoute>
 *
 * // Custom redirect path
 * <ProtectedRoute
 *   allowedRoles={['ADMIN']}
 *   redirectTo="/unauthorized"
 * >
 *   <SensitiveData />
 * </ProtectedRoute>
 * ```
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
  redirectTo = '/auth/access-denied'
}: ProtectedRouteProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, isLoading } = useAuth();

  // Show loading state while authentication is being verified
  if (isLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center bg-gray-50"
        role="status"
        aria-live="polite"
        aria-label="Loading authentication status"
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-sm text-gray-600">Verifying access...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !user)) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [isAuthenticated, user, isLoading, router, pathname]);

  if (!isAuthenticated || !user) {
    return null; // Return null while redirecting
  }

  // Check role-based access if allowedRoles is specified
  if (allowedRoles && allowedRoles.length > 0) {
    const userRole = user.role;
    const hasRequiredRole = allowedRoles.includes(userRole);

    if (!hasRequiredRole) {
      // Log security event for unauthorized access attempt
      console.warn('[Security] Unauthorized access attempt:', {
        userId: user.id,
        userRole: userRole,
        requiredRoles: allowedRoles,
        attemptedPath: pathname,
        timestamp: new Date().toISOString()
      });

      // Redirect to access denied page with context
      useEffect(() => {
        router.replace(`${redirectTo}?resource=${encodeURIComponent(pathname)}&reason=${encodeURIComponent('insufficient permissions')}`);
      }, []);

      return null; // Return null while redirecting
    }
  }

  // User is authenticated and authorized - render children
  return <>{children}</>;
};

export default ProtectedRoute;
