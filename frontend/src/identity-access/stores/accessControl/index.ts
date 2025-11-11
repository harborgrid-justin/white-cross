/**
 * @fileoverview Access Control Redux Slice - Modular Orchestrator
 * @module identity-access/stores/accessControl/index
 * @category Access Control - State Management
 * 
 * Orchestrates all access control functionality with modular architecture.
 * This is the main entry point that combines:
 * - State definition and initial state
 * - Async thunks from specialized modules
 * - Memoized selectors
 * - Redux slice with reducers
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AccessControlState, initialState } from './state';
import {
  Role,
  Permission,
  SecurityIncident,
  IncidentFilters,
  SessionFilters,
  PaginationInfo,
  Notification,
} from '../types/accessControl.types';

// Import all thunks from modular files
import {
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
} from './thunks/rolesThunks';

import {
  fetchPermissions,
  createPermission,
  fetchUserPermissions,
  checkUserPermission,
} from './thunks/permissionsThunks';

import {
  fetchUserSessions,
  deleteSession,
  deleteAllUserSessions,
} from './thunks/sessionsThunks';

import {
  fetchSecurityIncidents,
  createSecurityIncident,
  updateSecurityIncident,
  fetchIpRestrictions,
  addIpRestriction,
  removeIpRestriction,
  fetchAccessControlStatistics,
} from './thunks/incidentsThunks';

// ==========================================
// SLICE DEFINITION
// ==========================================

const accessControlSlice = createSlice({
  name: 'accessControl',
  initialState,
  reducers: {
    setSelectedRole: (state, action: PayloadAction<Role | null>) => {
      state.selectedRole = action.payload;
    },
    setSelectedPermission: (state, action: PayloadAction<Permission | null>) => {
      state.selectedPermission = action.payload;
    },
    setSelectedIncident: (state, action: PayloadAction<SecurityIncident | null>) => {
      state.selectedIncident = action.payload;
    },
    setIncidentFilters: (state, action: PayloadAction<Partial<IncidentFilters>>) => {
      state.filters.incidents = { ...state.filters.incidents, ...action.payload };
    },
    setSessionFilters: (state, action: PayloadAction<Partial<SessionFilters>>) => {
      state.filters.sessions = { ...state.filters.sessions, ...action.payload };
    },
    setRolesPagination: (state, action: PayloadAction<Partial<PaginationInfo>>) => {
      state.pagination.roles = { ...state.pagination.roles, ...action.payload };
    },
    setPermissionsPagination: (state, action: PayloadAction<Partial<PaginationInfo>>) => {
      state.pagination.permissions = { ...state.pagination.permissions, ...action.payload };
    },
    setIncidentsPagination: (state, action: PayloadAction<Partial<PaginationInfo>>) => {
      state.pagination.incidents = { ...state.pagination.incidents, ...action.payload };
    },
    setSessionsPagination: (state, action: PayloadAction<Partial<PaginationInfo>>) => {
      state.pagination.sessions = { ...state.pagination.sessions, ...action.payload };
    },
    clearError: (state) => {
      state.error = null;
    },
    addNotification: (state, action: PayloadAction<Omit<Notification, 'id' | 'timestamp'>>) => {
      const notification: Notification = {
        ...action.payload,
        id: `notification_${Date.now()}_${Math.random()}`,
        timestamp: new Date().toISOString(),
      };
      state.notifications.push(notification);
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter((n: Notification) => n.id !== action.payload);
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    clearFilters: (state) => {
      state.filters = {
        incidents: {},
        sessions: {},
      };
    },
    resetState: () => initialState,
  },
  extraReducers: (builder) => {
    // ==========================================
    // ROLES REDUCERS
    // ==========================================
    builder
      .addCase(fetchRoles.pending, (state) => {
        state.loading.roles = true;
        state.error = null;
      })
      .addCase(fetchRoles.fulfilled, (state, action) => {
        state.loading.roles = false;
        state.roles = action.payload;
      })
      .addCase(fetchRoles.rejected, (state, action) => {
        state.loading.roles = false;
        state.error = action.payload || 'Failed to fetch roles';
      })

      // Role by ID
      .addCase(fetchRoleById.pending, (state) => {
        state.loading.operations = true;
      })
      .addCase(fetchRoleById.fulfilled, (state, action) => {
        state.loading.operations = false;
        state.selectedRole = action.payload;
      })
      .addCase(fetchRoleById.rejected, (state, action) => {
        state.loading.operations = false;
        state.error = action.payload || 'Failed to fetch role';
      })

      // Create role
      .addCase(createRole.pending, (state) => {
        state.loading.operations = true;
      })
      .addCase(createRole.fulfilled, (state, action) => {
        state.loading.operations = false;
        state.roles.push(action.payload);
      })
      .addCase(createRole.rejected, (state, action) => {
        state.loading.operations = false;
        state.error = action.payload || 'Failed to create role';
      })

      // Update role
      .addCase(updateRole.pending, (state) => {
        state.loading.operations = true;
      })
      .addCase(updateRole.fulfilled, (state, action) => {
        state.loading.operations = false;
        const index = state.roles.findIndex((r) => r.id === action.payload.id);
        if (index !== -1) {
          state.roles[index] = action.payload;
        }
        if (state.selectedRole?.id === action.payload.id) {
          state.selectedRole = action.payload;
        }
      })
      .addCase(updateRole.rejected, (state, action) => {
        state.loading.operations = false;
        state.error = action.payload || 'Failed to update role';
      })

      // Delete role
      .addCase(deleteRole.pending, (state) => {
        state.loading.operations = true;
      })
      .addCase(deleteRole.fulfilled, (state, action) => {
        state.loading.operations = false;
        state.roles = state.roles.filter((r) => r.id !== action.payload);
        if (state.selectedRole?.id === action.payload) {
          state.selectedRole = null;
        }
      })
      .addCase(deleteRole.rejected, (state, action) => {
        state.loading.operations = false;
        state.error = action.payload || 'Failed to delete role';
      })

      // Initialize default roles
      .addCase(initializeDefaultRoles.fulfilled, (state, action) => {
        state.roles = [...state.roles, ...action.payload];
      })

      // ==========================================
      // PERMISSIONS REDUCERS
      // ==========================================
      .addCase(fetchPermissions.pending, (state) => {
        state.loading.permissions = true;
      })
      .addCase(fetchPermissions.fulfilled, (state, action) => {
        state.loading.permissions = false;
        state.permissions = action.payload;
      })
      .addCase(fetchPermissions.rejected, (state, action) => {
        state.loading.permissions = false;
        state.error = action.payload || 'Failed to fetch permissions';
      })

      // Create permission
      .addCase(createPermission.fulfilled, (state, action) => {
        state.permissions.push(action.payload);
      })

      // ==========================================
      // SESSIONS REDUCERS
      // ==========================================
      .addCase(fetchUserSessions.pending, (state) => {
        state.loading.sessions = true;
      })
      .addCase(fetchUserSessions.fulfilled, (state, action) => {
        state.loading.sessions = false;
        state.sessions = action.payload;
      })
      .addCase(fetchUserSessions.rejected, (state, action) => {
        state.loading.sessions = false;
        state.error = action.payload || 'Failed to fetch sessions';
      })

      // Delete session
      .addCase(deleteSession.fulfilled, (state, action) => {
        state.sessions = state.sessions.filter((s) => s.token !== action.payload);
      })

      // ==========================================
      // SECURITY INCIDENTS REDUCERS
      // ==========================================
      .addCase(fetchSecurityIncidents.pending, (state) => {
        state.loading.incidents = true;
      })
      .addCase(fetchSecurityIncidents.fulfilled, (state, action) => {
        state.loading.incidents = false;
        state.securityIncidents = action.payload.incidents;
        if (action.payload.pagination) {
          state.pagination.incidents = {
            ...state.pagination.incidents,
            ...action.payload.pagination,
          };
        }
      })
      .addCase(fetchSecurityIncidents.rejected, (state, action) => {
        state.loading.incidents = false;
        state.error = action.payload || 'Failed to fetch security incidents';
      })

      // Create security incident
      .addCase(createSecurityIncident.fulfilled, (state, action) => {
        state.securityIncidents.push(action.payload);
      })

      // Update security incident
      .addCase(updateSecurityIncident.fulfilled, (state, action) => {
        const index = state.securityIncidents.findIndex((i) => i.id === action.payload.id);
        if (index !== -1) {
          state.securityIncidents[index] = action.payload;
        }
        if (state.selectedIncident?.id === action.payload.id) {
          state.selectedIncident = action.payload;
        }
      })

      // ==========================================
      // IP RESTRICTIONS REDUCERS
      // ==========================================
      .addCase(fetchIpRestrictions.fulfilled, (state, action) => {
        state.ipRestrictions = action.payload;
      })

      // Add IP restriction
      .addCase(addIpRestriction.fulfilled, (state, action) => {
        state.ipRestrictions.push(action.payload);
      })

      // Remove IP restriction
      .addCase(removeIpRestriction.fulfilled, (state, action) => {
        state.ipRestrictions = state.ipRestrictions.filter((r) => r.id !== action.payload);
      })

      // ==========================================
      // STATISTICS REDUCERS
      // ==========================================
      .addCase(fetchAccessControlStatistics.pending, (state) => {
        state.loading.statistics = true;
      })
      .addCase(fetchAccessControlStatistics.fulfilled, (state, action) => {
        state.loading.statistics = false;
        state.statistics = action.payload;
      })
      .addCase(fetchAccessControlStatistics.rejected, (state, action) => {
        state.loading.statistics = false;
        state.error = action.payload || 'Failed to fetch statistics';
      });
  },
});

// ==========================================
// EXPORTS
// ==========================================

// Action creators
export const {
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
} = accessControlSlice.actions;

// Async thunks
export {
  // Roles
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
  // Permissions
  fetchPermissions,
  createPermission,
  fetchUserPermissions,
  checkUserPermission,
  // Sessions
  fetchUserSessions,
  deleteSession,
  deleteAllUserSessions,
  // Incidents & Restrictions
  fetchSecurityIncidents,
  createSecurityIncident,
  updateSecurityIncident,
  fetchIpRestrictions,
  addIpRestriction,
  removeIpRestriction,
  fetchAccessControlStatistics,
};

// Selectors
export * from './selectors';

// State interface
export type { AccessControlState };

// Reducer
export default accessControlSlice.reducer;
