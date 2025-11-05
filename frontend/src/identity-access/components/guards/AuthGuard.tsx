'use client';

/**
 * AuthGuard Component
 *
 * Protects routes by requiring authentication before rendering children.
 * Automatically redirects unauthenticated users to the login page.
 *
 * @module components/guards/AuthGuard
 */

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/identity-access/contexts/AuthContext';

// ==========================================
// TYPES & INTERFACES
// ==========================================

/**
 * Props for AuthGuard component
 */
export interface AuthGuardProps {
  /**
   * Content to render when user is authenticated
   */
  children: React.ReactNode;

  /**
   * Content to render while checking authentication status (optional)
   * If not provided, nothing is rendered during loading
   */
  fallback?: React.ReactNode;

  /**
   * Path to redirect to when user is not authenticated (optional)
   * Defaults to '/login'
   */
  redirectTo?: string;
}

// ==========================================
// COMPONENT
// ==========================================

/**
 * AuthGuard - Route protection requiring authentication
 *
 * This component ensures that only authenticated users can access protected routes.
 * It checks authentication status and redirects unauthenticated users to the login page,
 * preserving the original URL for post-login redirect.
 *
 * Uses useEffect for redirect instead of imperative window.location for better
 * Next.js integration and testing support.
 *
 * @example
 * ```tsx
 * // Basic usage - protect entire page
 * export default function DashboardPage() {
 *   return (
 *     <AuthGuard>
 *       <DashboardContent />
 *     </AuthGuard>
 *   );
 * }
 *
 * // With custom loading fallback
 * <AuthGuard fallback={<LoadingSpinner />}>
 *   <ProtectedContent />
 * </AuthGuard>
 *
 * // With custom redirect path
 * <AuthGuard redirectTo="/signin">
 *   <ProtectedContent />
 * </AuthGuard>
 * ```
 */
export function AuthGuard({
  children,
  fallback = null,
  redirectTo = '/login',
}: AuthGuardProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  // ==========================================
  // AUTHENTICATION CHECK & REDIRECT
  // ==========================================

  useEffect(() => {
    // Wait for auth state to be determined
    if (isLoading) {
      return;
    }

    // If not authenticated, redirect to login
    if (!isAuthenticated) {
      // Preserve current path for post-login redirect
      const currentPath = window.location.pathname + window.location.search;
      const loginUrl = `${redirectTo}?redirect=${encodeURIComponent(currentPath)}`;

      router.push(loginUrl);
    } else {
      // Authentication confirmed
      setIsChecking(false);
    }
  }, [isAuthenticated, isLoading, router, redirectTo]);

  // ==========================================
  // RENDER
  // ==========================================

  // Show fallback while checking authentication
  if (isLoading || isChecking) {
    return (
      <div data-testid="auth-guard-loading">
        {fallback}
      </div>
    );
  }

  // Show children only when authenticated
  if (isAuthenticated) {
    return (
      <div data-testid="auth-guard-authenticated">
        {children}
      </div>
    );
  }

  // Show nothing while redirecting
  return null;
}

// Export as default as well for flexibility
export default AuthGuard;
