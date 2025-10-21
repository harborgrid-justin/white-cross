/**
 * Core Domain Selectors
 * 
 * Specialized selectors for the core domain that combine state from multiple slices
 * and provide computed properties specific to authentication, user management, and settings.
 */

import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../../reduxStore';

// ==========================================
// USER AUTHENTICATION SELECTORS
// ==========================================

/**
 * Select current authenticated user
 */
export const selectCurrentUser = (state: RootState) => state.auth.user;

/**
 * Select authentication status
 */
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;

/**
 * Select authentication loading state
 */
export const selectAuthLoading = (state: RootState) => state.auth.isLoading;

/**
 * Select authentication error
 */
export const selectAuthError = (state: RootState) => state.auth.error;

/**
 * Select user role
 */
export const selectUserRole = createSelector(
  [selectCurrentUser],
  (user) => user?.role || null
);

/**
 * Check if user has admin role
 */
export const selectIsAdmin = createSelector(
  [selectUserRole],
  (role) => role === 'admin' || role === 'district_admin'
);

/**
 * Check if user is a nurse
 */
export const selectIsNurse = createSelector(
  [selectUserRole],
  (role) => role === 'nurse' || role === 'head_nurse'
);

// ==========================================
// CORE DOMAIN STATUS SELECTORS
// ==========================================

/**
 * Select combined loading state for core domain
 */
export const selectCoreIsLoading = createSelector(
  [selectAuthLoading],
  (authLoading) => authLoading
);

/**
 * Select authentication status summary
 */
export const selectAuthStatus = createSelector(
  [selectIsAuthenticated, selectAuthLoading, selectAuthError],
  (isAuthenticated, isLoading, error) => ({
    isAuthenticated,
    isLoading,
    hasError: !!error,
    error,
    status: isLoading ? 'loading' : error ? 'error' : isAuthenticated ? 'authenticated' : 'unauthenticated'
  })
);

// ==========================================
// USER PROFILE SELECTORS
// ==========================================

/**
 * Select user profile information
 */
export const selectUserProfile = createSelector(
  [selectCurrentUser],
  (user) => user ? {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    fullName: `${user.firstName} ${user.lastName}`,
    role: user.role,
    schoolId: user.schoolId,
    avatar: user.avatar,
  } : null
);

/**
 * Select user display name
 */
export const selectUserDisplayName = createSelector(
  [selectUserProfile],
  (profile) => profile ? profile.fullName : 'Guest User'
);

// ==========================================
// DOMAIN UTILITIES
// ==========================================

/**
 * Create a permission checker selector
 */
export const createPermissionChecker = (requiredRole: string) =>
  createSelector(
    [selectUserRole],
    (userRole) => {
      if (!userRole) return false;
      
      // Define role hierarchy
      const roleHierarchy = {
        'guest': 0,
        'parent': 1,
        'teacher': 2,
        'nurse': 3,
        'head_nurse': 4,
        'admin': 5,
        'district_admin': 6,
        'super_admin': 7
      };
      
      const userLevel = roleHierarchy[userRole as keyof typeof roleHierarchy] || 0;
      const requiredLevel = roleHierarchy[requiredRole as keyof typeof roleHierarchy] || 0;
      
      return userLevel >= requiredLevel;
    }
  );