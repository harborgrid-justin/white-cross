/**
 * @fileoverview Core domain hooks for authentication and user management
 * @module stores/domains/core/hooks
 * @category Store
 * 
 * Custom React hooks providing convenient access to core domain functionality
 * including authentication, user management, and settings with type-safe Redux integration.
 * 
 * Hook Categories:
 * - **Authentication**: Login, logout, registration, token refresh
 * - **User Info**: Current user, role, permissions, display name
 * - **Authorization**: Permission checks, role-based access
 * - **Settings**: User preferences and system settings
 * 
 * Design Pattern:
 * - Hooks encapsulate Redux dispatch and selector logic
 * - useCallback for action creators (prevent re-renders)
 * - Memoized selectors for optimal performance
 * - Type-safe with full TypeScript support
 * 
 * @example
 * ```typescript
 * // Authentication hook
 * function LoginPage() {
 *   const { login, isLoading, error, isAuthenticated } = useAuth();
 *   
 *   const handleLogin = async () => {
 *     await login({ email, password, rememberMe: true });
 *   };
 *   
 *   if (isAuthenticated) return <Redirect to="/dashboard" />;
 *   return <LoginForm onSubmit={handleLogin} loading={isLoading} />;
 * }
 * 
 * // User info hook
 * function UserProfile() {
 *   const user = useCurrentUser();
 *   return <div>Welcome, {user?.firstName}!</div>;
 * }
 * 
 * // Role check hook
 * function AdminPanel() {
 *   const isAdmin = useIsAdmin();
 *   if (!isAdmin) return <AccessDenied />;
 *   return <AdminDashboard />;
 * }
 * 
 * // Permission check hook
 * function MedicationAdmin() {
 *   const canAdminister = useHasPermission('administer_medication');
 *   return canAdminister ? <MedicationForm /> : <AccessDenied />;
 * }
 * ```
 */

import { useCallback } from 'react';
import { useAppSelector, useAppDispatch } from '../../hooks/reduxHooks';
import { 
  loginUser, 
  registerUser, 
  logoutUser, 
  refreshUser 
} from '../../slices/authSlice';
import type { LoginCredentials, RegisterData } from '../../../services/modules/authApi';

// Import selectors
import {
  selectCurrentUser,
  selectIsAuthenticated,
  selectAuthLoading,
  selectAuthError,
  selectUserRole,
  selectIsAdmin,
  selectIsNurse,
  selectAuthStatus,
  selectUserProfile,
  selectUserDisplayName,
  createPermissionChecker,
} from './selectors';

// ==========================================
// AUTHENTICATION HOOKS
// ==========================================

/**
 * Hook for authentication state and actions
 * 
 * @hook
 * @returns {Object} Authentication state and action creators
 * @returns {User | null} returns.user - Currently authenticated user
 * @returns {boolean} returns.isAuthenticated - Whether user is logged in
 * @returns {boolean} returns.isLoading - Loading state for auth operations
 * @returns {string | null} returns.error - Error message if auth failed
 * @returns {AuthStatus} returns.status - Current auth status (idle, loading, succeeded, failed)
 * @returns {Function} returns.login - Login action creator
 * @returns {Function} returns.register - Registration action creator
 * @returns {Function} returns.logout - Logout action creator
 * @returns {Function} returns.refresh - Token refresh action creator
 * 
 * @description
 * Provides complete authentication functionality including login, registration,
 * logout, and token refresh with loading states and error handling.
 * 
 * Action creators are memoized with useCallback to prevent unnecessary re-renders.
 * All actions return promises that can be awaited for error handling.
 * 
 * @example
 * ```typescript
 * function LoginPage() {
 *   const { login, register, isLoading, error, isAuthenticated } = useAuth();
 *   
 *   const handleLogin = async (credentials) => {
 *     try {
 *       await login(credentials);
 *       // Redirect on success
 *       navigate('/dashboard');
 *     } catch (err) {
 *       // Error is already in Redux state
 *       console.error('Login failed:', error);
 *     }
 *   };
 *   
 *   if (isAuthenticated) return <Navigate to="/dashboard" />;
 *   
 *   return (
 *     <LoginForm
 *       onSubmit={handleLogin}
 *       loading={isLoading}
 *       error={error}
 *     />
 *   );
 * }
 * ```
 */
export const useAuth = () => {
  const dispatch = useAppDispatch();
  
  const user = useAppSelector(selectCurrentUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isLoading = useAppSelector(selectAuthLoading);
  const error = useAppSelector(selectAuthError);
  const status = useAppSelector(selectAuthStatus);

  const login = useCallback(
    (credentials: LoginCredentials) => {
      return dispatch(loginUser(credentials));
    },
    [dispatch]
  );

  const register = useCallback(
    (data: RegisterData) => {
      return dispatch(registerUser(data));
    },
    [dispatch]
  );

  const logout = useCallback(() => {
    return dispatch(logoutUser());
  }, [dispatch]);

  const refresh = useCallback(() => {
    return dispatch(refreshUser());
  }, [dispatch]);

  return {
    // State
    user,
    isAuthenticated,
    isLoading,
    error,
    status,
    
    // Actions
    login,
    register,
    logout,
    refresh,
  };
};

/**
 * Hook for current user information
 */
export const useCurrentUser = () => {
  return useAppSelector(selectCurrentUser);
};

/**
 * Hook for authentication status
 */
export const useIsAuthenticated = () => {
  return useAppSelector(selectIsAuthenticated);
};

/**
 * Hook for user profile information
 */
export const useUserProfile = () => {
  return useAppSelector(selectUserProfile);
};

/**
 * Hook for user display name
 */
export const useUserDisplayName = () => {
  return useAppSelector(selectUserDisplayName);
};

// ==========================================
// ROLE-BASED HOOKS
// ==========================================

/**
 * Hook for user role
 */
export const useUserRole = () => {
  return useAppSelector(selectUserRole);
};

/**
 * Hook to check if user is admin
 */
export const useIsAdmin = () => {
  return useAppSelector(selectIsAdmin);
};

/**
 * Hook to check if user is nurse
 */
export const useIsNurse = () => {
  return useAppSelector(selectIsNurse);
};

/**
 * Hook to check user permissions
 */
export const useHasPermission = (requiredRole: string) => {
  const permissionChecker = createPermissionChecker(requiredRole);
  return useAppSelector(permissionChecker);
};

/**
 * Hook for role-based access control
 */
export const useRoleAccess = () => {
  const role = useUserRole();
  const isAdmin = useIsAdmin();
  const isNurse = useIsNurse();

  const hasRole = useCallback(
    (requiredRole: string) => {
      const permissionChecker = createPermissionChecker(requiredRole);
      return permissionChecker({ auth: { user: { role } } } as any);
    },
    [role]
  );

  const canAccess = useCallback(
    (resource: string) => {
      // Define resource access rules
      const accessRules: Record<string, string[]> = {
        'students': ['nurse', 'head_nurse', 'admin', 'district_admin'],
        'medications': ['nurse', 'head_nurse', 'admin', 'district_admin'],
        'reports': ['nurse', 'head_nurse', 'admin', 'district_admin'],
        'administration': ['admin', 'district_admin'],
        'users': ['admin', 'district_admin'],
        'settings': ['admin', 'district_admin'],
      };

      const allowedRoles = accessRules[resource] || [];
      return role ? allowedRoles.includes(role) : false;
    },
    [role]
  );

  return {
    role,
    isAdmin,
    isNurse,
    hasRole,
    canAccess,
  };
};

// ==========================================
// AUTHENTICATION STATUS HOOKS
// ==========================================

/**
 * Hook for authentication loading state
 */
export const useAuthLoading = () => {
  return useAppSelector(selectAuthLoading);
};

/**
 * Hook for authentication error
 */
export const useAuthError = () => {
  return useAppSelector(selectAuthError);
};

/**
 * Hook for complete authentication status
 */
export const useAuthStatus = () => {
  return useAppSelector(selectAuthStatus);
};

// ==========================================
// COMPOSITE HOOKS
// ==========================================

/**
 * Hook that combines authentication and role checking
 */
export const useAuthenticatedUser = () => {
  const { user, isAuthenticated, isLoading, error } = useAuth();
  const { role, isAdmin, isNurse, canAccess } = useRoleAccess();

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    role,
    isAdmin,
    isNurse,
    canAccess,
    isReady: isAuthenticated && !isLoading && !error,
  };
};

/**
 * Hook for protected routes/components
 */
export const useRequireAuth = (requiredRole?: string) => {
  const isAuthenticated = useIsAuthenticated();
  const hasPermission = useHasPermission(requiredRole || 'guest');
  const isLoading = useAuthLoading();

  return {
    isAuthenticated,
    hasPermission,
    isLoading,
    canAccess: isAuthenticated && (requiredRole ? hasPermission : true),
    shouldRedirect: !isLoading && (!isAuthenticated || (requiredRole && !hasPermission)),
  };
};