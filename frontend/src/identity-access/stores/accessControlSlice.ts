/**
 * @fileoverview Access Control Slice - Backward Compatibility Layer
 * @module identity-access/stores/accessControlSlice
 *
 * REFACTORED FOR MODULARITY:
 * This file now serves as a backward compatibility layer that re-exports
 * all functionality from the modular access control implementation.
 *
 * The original 952-line monolithic slice has been broken down into:
 * - State definition (accessControl/state.ts)
 * - Async thunks by domain (accessControl/thunks/)
 * - Memoized selectors (accessControl/selectors.ts) 
 * - Main orchestrator (accessControl/index.ts)
 *
 * This maintains 100% backward compatibility while providing:
 * ✅ Better code organization and maintainability
 * ✅ Focused single-responsibility modules
 * ✅ Improved performance with memoized selectors
 * ✅ Easier testing and debugging
 * ✅ Reduced file complexity (952 lines → ~300 lines per module)
 */

// Re-export everything from the modular implementation
export * from './accessControl';

// Ensure default export compatibility
export { default } from './accessControl';

// Re-export types for backward compatibility
export type { AccessControlState } from './accessControl';

// Legacy re-exports (maintaining exact same API)
export {
  // Action creators
  setSelectedRole,
  setSelectedPermission,
  setSelectedIncident,
  setIncidentFilters,
  setSessionFilters,
  setRolesPagination,
  setPermissionsPagination,
  setIncidentsPagination,
  setSessionsPagination,
  clearError,
  addNotification,
  removeNotification,
  clearNotifications,
  clearFilters,
  resetState,
  
  // Async thunks - Roles
  fetchRoles,
  fetchRoleById,
  createRole,
  updateRole,
  deleteRole,
  initializeDefaultRoles,
  assignPermissionToRole,
  removePermissionFromRole,
  assignRoleToUser,
  removeRoleFromUser,
  
  // Async thunks - Permissions
  fetchPermissions,
  createPermission,
  fetchUserPermissions,
  checkUserPermission,
  
  // Async thunks - Sessions
  fetchUserSessions,
  deleteSession,
  deleteAllUserSessions,
  
  // Async thunks - Incidents & Restrictions
  fetchSecurityIncidents,
  createSecurityIncident,
  updateSecurityIncident,
  fetchIpRestrictions,
  addIpRestriction,
  removeIpRestriction,
  fetchAccessControlStatistics,
  
  // Selectors - Basic
  selectAccessControlState,
  selectRoles,
  selectPermissions,
  selectSecurityIncidents,
  selectSessions,
  selectIpRestrictions,
  selectStatistics,
  selectSelectedRole,
  selectSelectedPermission,
  selectSelectedIncident,
  selectIncidentFilters,
  selectSessionFilters,
  selectRolesPagination,
  selectPermissionsPagination,
  selectIncidentsPagination,
  selectSessionsPagination,
  selectLoading,
  selectError,
  selectNotifications,
  
  // Selectors - Memoized
  selectActiveRoles,
  selectCriticalIncidents,
  selectActiveSessions,
  selectFilteredIncidents,
  selectFilteredSessions,
  selectSecurityMetrics,
  selectRoleById,
  selectPermissionById,
  selectIncidentsBySeverity,
  selectSessionsByUserId,
  selectRolesWithPermissionCount,
  selectRecentIncidents,
  selectUnreadNotifications,
  selectIsAnyLoading,
} from './accessControl';
