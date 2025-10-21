/**
 * Core Domain Store
 * 
 * Handles fundamental application state including authentication, user management,
 * and system settings. This domain represents the core platform functionality
 * that is shared across all healthcare modules.
 * 
 * @domain core
 */

// Re-export existing slices with domain organization
export {
  // Auth slice - user authentication and session management
  loginUser,
  registerUser,
  logoutUser,
  refreshUser,
  clearError as clearAuthError,
  setUser,
} from '../../slices/authSlice';

export {
  // Users slice - user management and roles
  usersSlice,
  usersActions,
  usersThunks,
  usersSelectors,
  selectUsersByRole,
  selectActiveUsers,
  selectUsersBySchool,
  selectUsersByDistrict,
} from '../../slices/usersSlice';

export {
  // Settings slice - system configuration
  settingsSlice,
  settingsActions,
  settingsThunks,
  settingsSelectors,
} from '../../slices/settingsSlice';

// Domain-specific selectors and hooks
export * from './selectors';
export * from './hooks';
export * from './types';