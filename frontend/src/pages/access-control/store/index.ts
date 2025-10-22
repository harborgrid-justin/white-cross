/**
 * WF-IDX-009 | index.ts - Access Control Store Exports
 * Purpose: Export access control store components
 * Dependencies: ./accessControlSlice
 */

export { default as accessControlReducer } from './accessControlSlice';

export {
  // Async thunks
  fetchRoles,
  fetchRoleById,
  createRole,
  updateRole,
  deleteRole,
  fetchPermissions,
  createPermission,
  assignPermissionToRole,
  removePermissionFromRole,
  assignRoleToUser,
  removeRoleFromUser,
  fetchUserPermissions,
  checkUserPermission,
  fetchUserSessions,
  deleteSession,
  deleteAllUserSessions,
  fetchSecurityIncidents,
  createSecurityIncident,
  updateSecurityIncident,
  fetchIpRestrictions,
  addIpRestriction,
  removeIpRestriction,
  fetchAccessControlStatistics,
  initializeDefaultRoles,

  // Actions
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

  // Selectors
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
  selectActiveRoles,
  selectCriticalIncidents,
  selectActiveSessions,
  selectFilteredIncidents,
  selectFilteredSessions,
  selectSecurityMetrics
} from './accessControlSlice';
