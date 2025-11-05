/**
 * Memoized Redux Selectors for Access Control
 *
 * Performance-optimized selectors using Reselect for memoization.
 * Prevents unnecessary re-renders by caching selector results.
 *
 * @module utils/performance/accessControlSelectors
 */

import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '@/stores/store';

// ==========================================
// BASE SELECTORS (Simple field access)
// ==========================================

export const selectAccessControlState = (state: RootState) => state.accessControl;

export const selectRoles = (state: RootState) => state.accessControl.roles;
export const selectPermissions = (state: RootState) => state.accessControl.permissions;
export const selectSecurityIncidents = (state: RootState) => state.accessControl.securityIncidents;
export const selectSessions = (state: RootState) => state.accessControl.sessions;
export const selectIpRestrictions = (state: RootState) => state.accessControl.ipRestrictions;
export const selectStatistics = (state: RootState) => state.accessControl.statistics;

export const selectSelectedRole = (state: RootState) => state.accessControl.selectedRole;
export const selectSelectedPermission = (state: RootState) =>
  state.accessControl.selectedPermission;
export const selectSelectedIncident = (state: RootState) => state.accessControl.selectedIncident;

export const selectIncidentFilters = (state: RootState) => state.accessControl.filters.incidents;
export const selectSessionFilters = (state: RootState) => state.accessControl.filters.sessions;

export const selectRolesPagination = (state: RootState) => state.accessControl.pagination.roles;
export const selectPermissionsPagination = (state: RootState) =>
  state.accessControl.pagination.permissions;
export const selectIncidentsPagination = (state: RootState) =>
  state.accessControl.pagination.incidents;
export const selectSessionsPagination = (state: RootState) =>
  state.accessControl.pagination.sessions;

export const selectLoading = (state: RootState) => state.accessControl.loading;
export const selectError = (state: RootState) => state.accessControl.error;
export const selectNotifications = (state: RootState) => state.accessControl.notifications;

// ==========================================
// MEMOIZED SELECTORS (Computed/filtered data)
// ==========================================

/**
 * Select only active roles (isActive = true)
 * Memoized to prevent recalculation on every render
 */
export const selectActiveRoles = createSelector(
  [selectRoles],
  (roles) => roles.filter((role: any) => role.isActive)
);

/**
 * Select critical and high severity incidents
 * Memoized for performance
 */
export const selectCriticalIncidents = createSelector(
  [selectSecurityIncidents],
  (incidents) =>
    incidents.filter(
      (incident: any) => incident.severity === 'CRITICAL' || incident.severity === 'HIGH'
    )
);

/**
 * Select only active sessions
 * Memoized to avoid filtering on every render
 */
export const selectActiveSessions = createSelector(
  [selectSessions],
  (sessions) => sessions.filter((session: any) => session.isActive)
);

/**
 * Select filtered incidents based on current filters
 * Memoized with complex filtering logic
 */
export const selectFilteredIncidents = createSelector(
  [selectSecurityIncidents, selectIncidentFilters],
  (incidents, filters) => {
    let filtered = incidents;

    if (filters.severity) {
      filtered = filtered.filter((incident: any) => incident.severity === filters.severity);
    }

    if (filters.type) {
      filtered = filtered.filter((incident: any) => incident.type === filters.type);
    }

    if (filters.userId) {
      filtered = filtered.filter((incident: any) => incident.userId === filters.userId);
    }

    if (filters.startDate && filters.endDate) {
      const startDate = new Date(filters.startDate);
      const endDate = new Date(filters.endDate);
      filtered = filtered.filter((incident: any) => {
        const incidentDate = new Date(incident.createdAt);
        return incidentDate >= startDate && incidentDate <= endDate;
      });
    }

    return filtered;
  }
);

/**
 * Select filtered sessions based on current filters
 * Memoized session filtering
 */
export const selectFilteredSessions = createSelector(
  [selectSessions, selectSessionFilters],
  (sessions, filters) => {
    let filtered = sessions;

    if (filters.userId) {
      filtered = filtered.filter((session: any) => session.userId === filters.userId);
    }

    if (filters.isActive !== undefined) {
      filtered = filtered.filter((session: any) => session.isActive === filters.isActive);
    }

    return filtered;
  }
);

/**
 * Select security metrics with computed statistics
 * Heavily memoized to avoid expensive calculations
 */
export const selectSecurityMetrics = createSelector(
  [selectRoles, selectPermissions, selectSecurityIncidents, selectSessions],
  (roles, permissions, securityIncidents, sessions) => {
    const totalRoles = roles.length;
    const activeRoles = roles.filter((r: any) => r.isActive).length;
    const totalPermissions = permissions.length;

    const recentIncidents = securityIncidents.filter(
      (incident: any) =>
        new Date(incident.createdAt) > new Date(Date.now() - 24 * 60 * 60 * 1000)
    ).length;

    const criticalIncidents = securityIncidents.filter(
      (incident: any) => incident.severity === 'CRITICAL'
    ).length;

    const activeSessions = sessions.filter((s: any) => s.isActive).length;

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
 * Select roles by ID (memoized lookup)
 * Useful for detail views
 */
export const makeSelectRoleById = () =>
  createSelector(
    [selectRoles, (_: RootState, roleId: string) => roleId],
    (roles, roleId) => roles.find((role: any) => role.id === roleId)
  );

/**
 * Select permissions by role ID
 * Memoized permission lookup
 */
export const makeSelectPermissionsByRoleId = () =>
  createSelector(
    [selectPermissions, selectRoles, (_: RootState, roleId: string) => roleId],
    (permissions, roles, roleId) => {
      const role = roles.find((r: any) => r.id === roleId);
      if (!role || !role.permissionIds) return [];

      return permissions.filter((p: any) => role.permissionIds.includes(p.id));
    }
  );

/**
 * Select incidents by user ID
 * Memoized user incident lookup
 */
export const makeSelectIncidentsByUserId = () =>
  createSelector(
    [selectSecurityIncidents, (_: RootState, userId: string) => userId],
    (incidents, userId) => incidents.filter((incident: any) => incident.userId === userId)
  );

/**
 * Select sessions by user ID
 * Memoized user session lookup
 */
export const makeSelectSessionsByUserId = () =>
  createSelector(
    [selectSessions, (_: RootState, userId: string) => userId],
    (sessions, userId) => sessions.filter((session: any) => session.userId === userId)
  );

/**
 * Select incident statistics by severity
 * Memoized grouping by severity
 */
export const selectIncidentsBySeverity = createSelector(
  [selectSecurityIncidents],
  (incidents) => {
    return incidents.reduce(
      (acc: Record<string, number>, incident: any) => {
        const severity = incident.severity || 'UNKNOWN';
        acc[severity] = (acc[severity] || 0) + 1;
        return acc;
      },
      {}
    );
  }
);

/**
 * Select incident statistics by type
 * Memoized grouping by type
 */
export const selectIncidentsByType = createSelector(
  [selectSecurityIncidents],
  (incidents) => {
    return incidents.reduce(
      (acc: Record<string, number>, incident: any) => {
        const type = incident.type || 'UNKNOWN';
        acc[type] = (acc[type] || 0) + 1;
        return acc;
      },
      {}
    );
  }
);

/**
 * Select recent incidents (last 24 hours)
 * Memoized time-based filtering
 */
export const selectRecentIncidents = createSelector(
  [selectSecurityIncidents],
  (incidents) => {
    const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
    return incidents.filter(
      (incident: any) => new Date(incident.createdAt).getTime() > oneDayAgo
    );
  }
);

/**
 * Select loading state for specific operations
 * Useful for showing loading indicators
 */
export const selectIsRolesLoading = (state: RootState) => state.accessControl.loading.roles;
export const selectIsPermissionsLoading = (state: RootState) =>
  state.accessControl.loading.permissions;
export const selectIsIncidentsLoading = (state: RootState) =>
  state.accessControl.loading.incidents;
export const selectIsSessionsLoading = (state: RootState) =>
  state.accessControl.loading.sessions;
export const selectIsStatisticsLoading = (state: RootState) =>
  state.accessControl.loading.statistics;
export const selectIsOperationsLoading = (state: RootState) =>
  state.accessControl.loading.operations;

/**
 * Select if any operation is loading
 * Useful for global loading indicators
 */
export const selectIsAnyLoading = createSelector([selectLoading], (loading) => {
  return Object.values(loading).some((isLoading) => isLoading);
});

/**
 * Select unread notifications
 * Can be extended with read/unread tracking
 */
export const selectUnreadNotifications = createSelector(
  [selectNotifications],
  (notifications) => {
    // For now, all notifications are considered unread
    // Can be extended with read/unread tracking
    return notifications.filter((n: any) => !n.read);
  }
);

/**
 * Select notifications by type
 * Memoized notification filtering
 */
export const makeSelectNotificationsByType = () =>
  createSelector(
    [selectNotifications, (_: RootState, type: string) => type],
    (notifications, type) => notifications.filter((n: any) => n.type === type)
  );
