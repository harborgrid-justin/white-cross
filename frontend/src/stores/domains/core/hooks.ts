/**
 * Core Domain Hooks
 * 
 * Custom hooks for the core domain that provide convenient access to
 * authentication, user management, and settings functionality.
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