/**
 * @fileoverview Access Control Selectors - Optimized data access with memoization
 * @module identity-access/stores/accessControl/selectors
 * @category Access Control - Selectors
 */

import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '@/stores/store';
import { AccessControlState } from './state';
import {
  Role,
  Permission,
  SecurityIncident,
  UserSession,
  IpRestriction,
  AccessControlStatistics,
  IncidentFilters,
  SessionFilters,
  PaginationInfo,
  Notification,
} from '../types/accessControl.types';

// ==========================================
// BASIC SELECTORS
// ==========================================

export const selectAccessControlState = (state: RootState): AccessControlState =>
  state.accessControl;

export const selectRoles = (state: RootState): Role[] => state.accessControl.roles;

export const selectPermissions = (state: RootState): Permission[] =>
  state.accessControl.permissions;

export const selectSecurityIncidents = (state: RootState): SecurityIncident[] =>
  state.accessControl.securityIncidents;

export const selectSessions = (state: RootState): UserSession[] => state.accessControl.sessions;

export const selectIpRestrictions = (state: RootState): IpRestriction[] =>
  state.accessControl.ipRestrictions;

export const selectStatistics = (state: RootState): AccessControlStatistics | null =>
  state.accessControl.statistics;

export const selectSelectedRole = (state: RootState): Role | null =>
  state.accessControl.selectedRole;

export const selectSelectedPermission = (state: RootState): Permission | null =>
  state.accessControl.selectedPermission;

export const selectSelectedIncident = (state: RootState): SecurityIncident | null =>
  state.accessControl.selectedIncident;

export const selectIncidentFilters = (state: RootState): IncidentFilters =>
  state.accessControl.filters.incidents;

export const selectSessionFilters = (state: RootState): SessionFilters =>
  state.accessControl.filters.sessions;

export const selectRolesPagination = (state: RootState): PaginationInfo =>
  state.accessControl.pagination.roles;

export const selectPermissionsPagination = (state: RootState): PaginationInfo =>
  state.accessControl.pagination.permissions;

export const selectIncidentsPagination = (state: RootState): PaginationInfo =>
  state.accessControl.pagination.incidents;

export const selectSessionsPagination = (state: RootState): PaginationInfo =>
  state.accessControl.pagination.sessions;

export const selectLoading = (state: RootState): AccessControlState['loading'] =>
  state.accessControl.loading;

export const selectError = (state: RootState): string | null => state.accessControl.error;

export const selectNotifications = (state: RootState): Notification[] =>
  state.accessControl.notifications;

// ==========================================
// MEMOIZED SELECTORS (using createSelector)
// ==========================================

/**
 * Select only active roles (performance optimized)
 */
export const selectActiveRoles = createSelector([selectRoles], (roles) =>
  roles.filter((role) => role.isActive)
);

/**
 * Select critical and high severity incidents (performance optimized)
 */
export const selectCriticalIncidents = createSelector([selectSecurityIncidents], (incidents) =>
  incidents.filter(
    (incident) => incident.severity === 'CRITICAL' || incident.severity === 'HIGH'
  )
);

/**
 * Select only active sessions (performance optimized)
 */
export const selectActiveSessions = createSelector([selectSessions], (sessions) =>
  sessions.filter((session) => session.isActive)
);

/**
 * Select filtered incidents based on current filters (performance optimized)
 */
export const selectFilteredIncidents = createSelector(
  [selectSecurityIncidents, selectIncidentFilters],
  (incidents, filters) => {
    let filtered = incidents;

    if (filters.severity) {
      filtered = filtered.filter((incident) => incident.severity === filters.severity);
    }

    if (filters.type) {
      filtered = filtered.filter((incident) => incident.type === filters.type);
    }

    if (filters.userId) {
      filtered = filtered.filter((incident) => incident.userId === filters.userId);
    }

    if (filters.startDate && filters.endDate) {
      const startDate = new Date(filters.startDate);
      const endDate = new Date(filters.endDate);
      filtered = filtered.filter((incident) => {
        const incidentDate = new Date(incident.createdAt);
        return incidentDate >= startDate && incidentDate <= endDate;
      });
    }

    return filtered;
  }
);

/**
 * Select filtered sessions based on current filters (performance optimized)
 */
export const selectFilteredSessions = createSelector(
  [selectSessions, selectSessionFilters],
  (sessions, filters) => {
    let filtered = sessions;

    if (filters.userId) {
      filtered = filtered.filter((session) => session.userId === filters.userId);
    }

    if (filters.isActive !== undefined) {
      filtered = filtered.filter((session) => session.isActive === filters.isActive);
    }

    return filtered;
  }
);

/**
 * Select security metrics (performance optimized)
 */
export const selectSecurityMetrics = createSelector(
  [selectRoles, selectPermissions, selectSecurityIncidents, selectSessions],
  (roles, permissions, incidents, sessions) => {
    const totalRoles = roles.length;
    const activeRoles = roles.filter((r) => r.isActive).length;
    const totalPermissions = permissions.length;

    const recentIncidents = incidents.filter(
      (incident) => new Date(incident.createdAt) > new Date(Date.now() - 24 * 60 * 60 * 1000)
    ).length;

    const criticalIncidents = incidents.filter((incident) => incident.severity === 'CRITICAL')
      .length;

    const activeSessions = sessions.filter((s) => s.isActive).length;

    return {
      totalRoles,
      activeRoles,
      totalPermissions,
      recentIncidents,
      criticalIncidents,
      activeSessions,
      securityScore: criticalIncidents > 0 ? Math.max(0, 100 - criticalIncidents * 10) : 100,
    };
  }
);

/**
 * Select role by ID (memoized)
 */
export const selectRoleById = (roleId: string) =>
  createSelector([selectRoles], (roles) => roles.find((role) => role.id === roleId) || null);

/**
 * Select permission by ID (memoized)
 */
export const selectPermissionById = (permissionId: string) =>
  createSelector(
    [selectPermissions],
    (permissions) => permissions.find((perm) => perm.id === permissionId) || null
  );

/**
 * Select incidents by severity (memoized)
 */
export const selectIncidentsBySeverity = (severity: string) =>
  createSelector([selectSecurityIncidents], (incidents) =>
    incidents.filter((incident) => incident.severity === severity)
  );

/**
 * Select sessions by user ID (memoized)
 */
export const selectSessionsByUserId = (userId: string) =>
  createSelector([selectSessions], (sessions) =>
    sessions.filter((session) => session.userId === userId)
  );

/**
 * Select roles with permission count (memoized)
 */
export const selectRolesWithPermissionCount = createSelector([selectRoles], (roles) =>
  roles.map((role) => ({
    ...role,
    permissionCount: role.permissions?.length || 0,
  }))
);

/**
 * Select recent incidents (last 24 hours, memoized)
 */
export const selectRecentIncidents = createSelector([selectSecurityIncidents], (incidents) => {
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
  return incidents.filter((incident) => new Date(incident.createdAt) > yesterday);
});

/**
 * Select unread notifications (memoized)
 * Note: Assumes notifications have a 'read' property, adjust based on actual Notification interface
 */
export const selectUnreadNotifications = createSelector([selectNotifications], (notifications) =>
  notifications.filter((notification) => !((notification as Notification & { read?: boolean }).read))
);

/**
 * Select loading states summary (memoized)
 */
export const selectIsAnyLoading = createSelector([selectLoading], (loading) =>
  Object.values(loading).some((isLoading) => isLoading)
);
