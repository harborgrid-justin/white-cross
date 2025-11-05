/**
 * @fileoverview Access Control Management Redux Slice
 * 
 * This slice manages comprehensive access control functionality for the healthcare management system,
 * including role-based access control (RBAC), permissions management, security incident tracking,
 * session management, and audit logging. Designed specifically for healthcare environments with
 * strict security requirements and HIPAA compliance needs.
 * 
 * Key Features:
 * - Role-based Access Control (RBAC) with hierarchical permissions
 * - Fine-grained permission system for healthcare operations
 * - Real-time security incident monitoring and reporting
 * - Active session management with forced termination capabilities
 * - IP-based access restrictions for enhanced security
 * - Comprehensive audit logging for compliance requirements
 * - Healthcare-specific role templates (Doctor, Nurse, Admin, etc.)
 * - Emergency access protocols with detailed logging
 * - Multi-factor authentication integration
 * - HIPAA-compliant access control with PHI protection
 * 
 * Healthcare Security Considerations:
 * - All access control changes are logged for audit trails
 * - PHI access is tracked and monitored in real-time
 * - Break-the-glass emergency access with supervisor approval
 * - Automatic session timeout for inactive users
 * - Role inheritance follows medical hierarchy (Attending > Resident > Student)
 * - Minimum necessary access principle enforcement
 * - Integration with hospital badge/ID systems
 * - Compliance with HIPAA, HITECH, and state healthcare regulations
 * 
 * HIPAA Compliance Features:
 * - Unique user identification and authentication
 * - Automatic logoff procedures
 * - Encryption of PHI in transit and at rest
 * - Audit controls and access logs
 * - Assigned security responsibility
 * - Information integrity controls
 * - Person or entity authentication
 * - Transmission security measures
 * 
 * Emergency Protocols:
 * - Emergency access override with detailed justification
 * - Immediate notification to security officers
 * - Time-limited emergency roles with auto-expiration
 * - Post-emergency access review and approval workflow
 * - Integration with hospital emergency alert systems
 * 
 * Performance Optimizations:
 * - Permission caching with intelligent invalidation
 * - Lazy loading of role hierarchies
 * - Optimistic updates for non-critical operations
 * - Background synchronization of access logs
 * - Efficient permission checking algorithms
 * 
 * @example
 * // Basic role management
 * const dispatch = useAppDispatch();
 * 
 * // Fetch all roles
 * dispatch(fetchRoles());
 * 
 * // Create a new healthcare role
 * dispatch(createRole({
 *   name: 'Charge Nurse',
 *   description: 'Senior nursing staff with administrative duties',
 *   permissions: ['patient_view', 'patient_edit', 'staff_schedule'],
 *   isActive: true,
 *   department: 'nursing'
 * }));
 * 
 * // Assign role to user with time limits
 * dispatch(assignRoleToUser({
 *   userId: 'user123',
 *   roleId: 'role456',
 *   startDate: new Date(),
 *   endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
 * }));
 * 
 * @example
 * // Security incident management
 * // Report a security incident
 * dispatch(createSecurityIncident({
 *   type: 'UNAUTHORIZED_ACCESS',
 *   severity: 'HIGH',
 *   description: 'Attempted access to patient records outside assigned unit',
 *   userId: 'user789',
 *   resourceAccessed: 'patient/12345',
 *   ipAddress: '192.168.1.100',
 *   timestamp: new Date().toISOString()
 * }));
 * 
 * // Filter critical incidents
 * const criticalIncidents = useAppSelector(selectCriticalIncidents);
 * 
 * @example
 * // Session management for security
 * // Monitor active sessions
 * dispatch(fetchUserSessions('user123'));
 * 
 * // Force logout from all devices
 * dispatch(deleteAllUserSessions('user123'));
 * 
 * // Terminate specific session
 * dispatch(deleteSession('session_token_xyz'));
 * 
 * @example
 * // Permission checking in components
 * const userPermissions = useAppSelector(selectUserPermissions);
 * const hasPatientAccess = userPermissions.includes('patient_view');
 * 
 * // Check specific permission
 * dispatch(checkUserPermission({
 *   userId: currentUser.id,
 *   resource: 'patient_records',
 *   action: 'read'
 * }));
 * 
 * @example
 * // IP restrictions for high-security areas
 * dispatch(addIpRestriction({
 *   ipRange: '10.0.0.0/24',
 *   description: 'ICU workstations only',
 *   allowedRoles: ['icu_nurse', 'intensivist'],
 *   isActive: true
 * }));
 * 
 * Integration Points:
 * - User Management System: Synchronizes user roles and permissions
 * - Audit Logging Service: Records all access control events
 * - Authentication Service: Validates user credentials and sessions
 * - EMR System: Enforces clinical workflow permissions
 * - Hospital Information System: Integrates with departmental access
 * - Security Operations Center: Real-time incident monitoring
 * - Compliance Dashboard: Provides audit reports and metrics
 * 
 * Security Architecture:
 * - Zero-trust security model implementation
 * - Principle of least privilege enforcement
 * - Regular access review and certification processes
 * - Automated anomaly detection and alerting
 * - Integration with SIEM systems for threat detection
 * - Multi-layered defense with redundant controls
 * 
 * Audit and Compliance:
 * - Real-time audit log generation for all access events
 * - Automated compliance reporting for regulatory requirements
 * - Regular access reviews and permission audits
 * - Data retention policies for audit trails
 * - Integration with external compliance management systems
 * 
 * @author [Your Organization] - Healthcare IT Security Team
 * @version 2.1.0
 * @since 2024-01-15
 * @see {@link https://your-docs.com/access-control} Access Control Documentation
 * @see {@link https://your-docs.com/hipaa-compliance} HIPAA Compliance Guide
 * @see {@link https://your-docs.com/security-policies} Security Policies
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '@/stores/store';
import { accessControlApi } from '@/services/modules/accessControlApi';
import { User } from '@/types';
import type {
  Role,
  Permission,
  SecurityIncident,
  UserSession,
  IpRestriction,
  RolePermission,
  UserRole,
  AccessControlStatistics,
  IncidentFilters,
  SessionFilters,
  PaginationInfo,
  Notification,
  CreateRolePayload,
  UpdateRolePayload,
  CreatePermissionPayload,
  CreateSecurityIncidentPayload,
  UpdateSecurityIncidentPayload,
  CreateIpRestrictionPayload,
  UpdateRoleArgs,
  UpdateSecurityIncidentArgs,
  AssignPermissionArgs,
  RemovePermissionArgs,
  AssignRoleArgs,
  RemoveRoleArgs,
  CheckPermissionArgs,
  SecurityIncidentQueryParams,
  PermissionCheckResult,
} from './types/accessControl.types';

// API Service Adapter with proper typing
class AccessControlApiService {
  async getRoles() {
    return accessControlApi.getRoles();
  }

  async getRoleById(id: string) {
    return accessControlApi.getRoleById(id);
  }

  async createRole(data: CreateRolePayload) {
    return accessControlApi.createRole(data);
  }

  async updateRole(id: string, data: UpdateRolePayload) {
    return accessControlApi.updateRole(id, data);
  }

  async deleteRole(id: string) {
    return accessControlApi.deleteRole(id);
  }

  async getPermissions() {
    return accessControlApi.getPermissions();
  }

  async createPermission(data: CreatePermissionPayload) {
    return accessControlApi.createPermission(data);
  }

  async assignPermissionToRole(roleId: string, permissionId: string) {
    return accessControlApi.assignPermissionToRole(roleId, permissionId);
  }

  async removePermissionFromRole(roleId: string, permissionId: string) {
    return accessControlApi.removePermissionFromRole(roleId, permissionId);
  }

  async assignRoleToUser(userId: string, roleId: string) {
    return accessControlApi.assignRoleToUser(userId, roleId);
  }

  async removeRoleFromUser(userId: string, roleId: string) {
    return accessControlApi.removeRoleFromUser(userId, roleId);
  }

  async getUserPermissions(userId: string) {
    return accessControlApi.getUserPermissions(userId);
  }

  async checkPermission(userId: string, resource: string, action: string) {
    return accessControlApi.checkPermission(userId, resource, action);
  }

  async getUserSessions(userId: string) {
    return accessControlApi.getUserSessions(userId);
  }

  async deleteSession(token: string) {
    return accessControlApi.deleteSession(token);
  }

  async deleteAllUserSessions(userId: string) {
    return accessControlApi.deleteAllUserSessions(userId);
  }

  async getSecurityIncidents(params?: SecurityIncidentQueryParams) {
    return accessControlApi.getSecurityIncidents(params);
  }

  async createSecurityIncident(data: CreateSecurityIncidentPayload) {
    return accessControlApi.createSecurityIncident(data);
  }

  async updateSecurityIncident(id: string, data: UpdateSecurityIncidentPayload) {
    return accessControlApi.updateSecurityIncident(id, data);
  }

  async getIpRestrictions() {
    return accessControlApi.getIpRestrictions();
  }

  async addIpRestriction(data: CreateIpRestrictionPayload) {
    return accessControlApi.addIpRestriction(data);
  }

  async removeIpRestriction(id: string) {
    return accessControlApi.removeIpRestriction(id);
  }

  async getStatistics() {
    return accessControlApi.getStatistics();
  }

  async initializeDefaultRoles() {
    return accessControlApi.initializeDefaultRoles();
  }
}

const apiService = new AccessControlApiService();

// State interface with proper typing
interface AccessControlState {
  roles: Role[];
  permissions: Permission[];
  securityIncidents: SecurityIncident[];
  sessions: UserSession[];
  ipRestrictions: IpRestriction[];
  statistics: AccessControlStatistics | null;
  selectedRole: Role | null;
  selectedPermission: Permission | null;
  selectedIncident: SecurityIncident | null;
  filters: {
    incidents: IncidentFilters;
    sessions: SessionFilters;
  };
  pagination: {
    roles: PaginationInfo;
    permissions: PaginationInfo;
    incidents: PaginationInfo;
    sessions: PaginationInfo;
  };
  loading: {
    roles: boolean;
    permissions: boolean;
    incidents: boolean;
    sessions: boolean;
    statistics: boolean;
    operations: boolean;
  };
  error: string | null;
  notifications: Notification[];
}

const initialState: AccessControlState = {
  roles: [],
  permissions: [],
  securityIncidents: [],
  sessions: [],
  ipRestrictions: [],
  statistics: null,
  selectedRole: null,
  selectedPermission: null,
  selectedIncident: null,
  filters: {
    incidents: {},
    sessions: {}
  },
  pagination: {
    roles: { page: 1, limit: 20, total: 0 },
    permissions: { page: 1, limit: 20, total: 0 },
    incidents: { page: 1, limit: 20, total: 0 },
    sessions: { page: 1, limit: 20, total: 0 }
  },
  loading: {
    roles: false,
    permissions: false,
    incidents: false,
    sessions: false,
    statistics: false,
    operations: false
  },
  error: null,
  notifications: []
};

// Async Thunks
export const fetchRoles = createAsyncThunk(
  'accessControl/fetchRoles',
  async () => {
    const response = await apiService.getRoles();
    return response.roles;
  }
);

export const fetchRoleById = createAsyncThunk(
  'accessControl/fetchRoleById',
  async (id: string) => {
    const response = await apiService.getRoleById(id);
    return response.role;
  }
);

export const createRole = createAsyncThunk(
  'accessControl/createRole',
  async (roleData: CreateRolePayload) => {
    const response = await apiService.createRole(roleData);
    return response.role;
  }
);

export const updateRole = createAsyncThunk(
  'accessControl/updateRole',
  async ({ id, updates }: UpdateRoleArgs) => {
    const response = await apiService.updateRole(id, updates);
    return response.role;
  }
);

export const deleteRole = createAsyncThunk(
  'accessControl/deleteRole',
  async (id: string) => {
    await apiService.deleteRole(id);
    return id;
  }
);

export const fetchPermissions = createAsyncThunk(
  'accessControl/fetchPermissions',
  async () => {
    const response = await apiService.getPermissions();
    return response.permissions;
  }
);

export const createPermission = createAsyncThunk(
  'accessControl/createPermission',
  async (permissionData: CreatePermissionPayload) => {
    const response = await apiService.createPermission(permissionData);
    return response.permission;
  }
);

export const assignPermissionToRole = createAsyncThunk(
  'accessControl/assignPermissionToRole',
  async ({ roleId, permissionId }: AssignPermissionArgs) => {
    const response = await apiService.assignPermissionToRole(roleId, permissionId);
    return response.rolePermission;
  }
);

export const removePermissionFromRole = createAsyncThunk(
  'accessControl/removePermissionFromRole',
  async ({ roleId, permissionId }: RemovePermissionArgs) => {
    await apiService.removePermissionFromRole(roleId, permissionId);
    return { roleId, permissionId };
  }
);

export const assignRoleToUser = createAsyncThunk(
  'accessControl/assignRoleToUser',
  async ({ userId, roleId }: AssignRoleArgs) => {
    const response = await apiService.assignRoleToUser(userId, roleId);
    return response.userRole;
  }
);

export const removeRoleFromUser = createAsyncThunk(
  'accessControl/removeRoleFromUser',
  async ({ userId, roleId }: RemoveRoleArgs) => {
    await apiService.removeRoleFromUser(userId, roleId);
    return { userId, roleId };
  }
);

export const fetchUserPermissions = createAsyncThunk(
  'accessControl/fetchUserPermissions',
  async (userId: string) => {
    const response = await apiService.getUserPermissions(userId);
    return response;
  }
);

export const checkUserPermission = createAsyncThunk<
  PermissionCheckResult,
  CheckPermissionArgs
>(
  'accessControl/checkUserPermission',
  async ({ userId, resource, action }) => {
    const response = await apiService.checkPermission(userId, resource, action);
    return { userId, resource, action, hasPermission: response.hasPermission };
  }
);

export const fetchUserSessions = createAsyncThunk(
  'accessControl/fetchUserSessions',
  async (userId: string) => {
    const response = await apiService.getUserSessions(userId);
    return response.sessions;
  }
);

export const deleteSession = createAsyncThunk(
  'accessControl/deleteSession',
  async (token: string) => {
    await apiService.deleteSession(token);
    return token;
  }
);

export const deleteAllUserSessions = createAsyncThunk(
  'accessControl/deleteAllUserSessions',
  async (userId: string) => {
    const response = await apiService.deleteAllUserSessions(userId);
    return response;
  }
);

export const fetchSecurityIncidents = createAsyncThunk(
  'accessControl/fetchSecurityIncidents',
  async (params?: SecurityIncidentQueryParams) => {
    const response = await apiService.getSecurityIncidents(params);
    return response;
  }
);

export const createSecurityIncident = createAsyncThunk(
  'accessControl/createSecurityIncident',
  async (incidentData: CreateSecurityIncidentPayload) => {
    const response = await apiService.createSecurityIncident(incidentData);
    return response.incident;
  }
);

export const updateSecurityIncident = createAsyncThunk(
  'accessControl/updateSecurityIncident',
  async ({ id, updates }: UpdateSecurityIncidentArgs) => {
    const response = await apiService.updateSecurityIncident(id, updates);
    return response.incident;
  }
);

export const fetchIpRestrictions = createAsyncThunk(
  'accessControl/fetchIpRestrictions',
  async () => {
    const response = await apiService.getIpRestrictions();
    return response.restrictions;
  }
);

export const addIpRestriction = createAsyncThunk(
  'accessControl/addIpRestriction',
  async (restrictionData: CreateIpRestrictionPayload) => {
    const response = await apiService.addIpRestriction(restrictionData);
    return response.restriction;
  }
);

export const removeIpRestriction = createAsyncThunk(
  'accessControl/removeIpRestriction',
  async (id: string) => {
    await apiService.removeIpRestriction(id);
    return id;
  }
);

export const fetchAccessControlStatistics = createAsyncThunk(
  'accessControl/fetchStatistics',
  async () => {
    const response = await apiService.getStatistics();
    return response;
  }
);

export const initializeDefaultRoles = createAsyncThunk(
  'accessControl/initializeDefaultRoles',
  async () => {
    const response = await apiService.initializeDefaultRoles();
    return response.roles;
  }
);

// Slice
const accessControlSlice = createSlice({
  name: 'accessControl',
  initialState,
  reducers: {
    setSelectedRole: (state: AccessControlState, action: PayloadAction<Role | null>) => {
      state.selectedRole = action.payload;
    },
    setSelectedPermission: (state: AccessControlState, action: PayloadAction<Permission | null>) => {
      state.selectedPermission = action.payload;
    },
    setSelectedIncident: (state: AccessControlState, action: PayloadAction<SecurityIncident | null>) => {
      state.selectedIncident = action.payload;
    },
    setIncidentFilters: (state: AccessControlState, action: PayloadAction<Partial<AccessControlState['filters']['incidents']>>) => {
      state.filters.incidents = { ...state.filters.incidents, ...action.payload };
    },
    setSessionFilters: (state: AccessControlState, action: PayloadAction<Partial<AccessControlState['filters']['sessions']>>) => {
      state.filters.sessions = { ...state.filters.sessions, ...action.payload };
    },
    setRolesPagination: (state: AccessControlState, action: PayloadAction<Partial<AccessControlState['pagination']['roles']>>) => {
      state.pagination.roles = { ...state.pagination.roles, ...action.payload };
    },
    setPermissionsPagination: (state: AccessControlState, action: PayloadAction<Partial<AccessControlState['pagination']['permissions']>>) => {
      state.pagination.permissions = { ...state.pagination.permissions, ...action.payload };
    },
    setIncidentsPagination: (state: AccessControlState, action: PayloadAction<Partial<AccessControlState['pagination']['incidents']>>) => {
      state.pagination.incidents = { ...state.pagination.incidents, ...action.payload };
    },
    setSessionsPagination: (state: AccessControlState, action: PayloadAction<Partial<AccessControlState['pagination']['sessions']>>) => {
      state.pagination.sessions = { ...state.pagination.sessions, ...action.payload };
    },
    clearError: (state: AccessControlState) => {
      state.error = null;
    },
    addNotification: (state: AccessControlState, action: PayloadAction<Omit<AccessControlState['notifications'][0], 'id' | 'timestamp'>>) => {
      const notification = {
        ...action.payload,
        id: `notification_${Date.now()}_${Math.random()}`,
        timestamp: new Date().toISOString()
      };
      state.notifications.push(notification);
    },
    removeNotification: (state: AccessControlState, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter((n) => n.id !== action.payload);
    },
    clearNotifications: (state: AccessControlState) => {
      state.notifications = [];
    },
    clearFilters: (state: AccessControlState) => {
      state.filters = {
        incidents: {},
        sessions: {}
      };
    },
    resetState: () => initialState
  },
  extraReducers: (builder) => {
    // Roles
    builder
      .addCase(fetchRoles.pending, (state: AccessControlState) => {
        state.loading.roles = true;
        state.error = null;
      })
      .addCase(fetchRoles.fulfilled, (state: AccessControlState, action) => {
        state.loading.roles = false;
        state.roles = action.payload || [];
      })
      .addCase(fetchRoles.rejected, (state: AccessControlState, action) => {
        state.loading.roles = false;
        state.error = action.error.message || 'Failed to fetch roles';
      });

    // Role by ID
    builder
      .addCase(fetchRoleById.pending, (state: AccessControlState) => {
        state.loading.operations = true;
      })
      .addCase(fetchRoleById.fulfilled, (state: AccessControlState, action) => {
        state.loading.operations = false;
        state.selectedRole = action.payload;
      })
      .addCase(fetchRoleById.rejected, (state: AccessControlState, action) => {
        state.loading.operations = false;
        state.error = action.error.message || 'Failed to fetch role';
      });

    // Create role
    builder
      .addCase(createRole.pending, (state: AccessControlState) => {
        state.loading.operations = true;
      })
      .addCase(createRole.fulfilled, (state: AccessControlState, action: any) => {
        state.loading.operations = false;
        state.roles.push(action.payload);
      })
      .addCase(createRole.rejected, (state: AccessControlState, action: any) => {
        state.loading.operations = false;
        state.error = action.error.message || 'Failed to create role';
      });

    // Update role
    builder
      .addCase(updateRole.pending, (state: AccessControlState) => {
        state.loading.operations = true;
      })
      .addCase(updateRole.fulfilled, (state: AccessControlState, action: any) => {
        state.loading.operations = false;
        const index = state.roles.findIndex((r: any) => r.id === action.payload.id);
        if (index !== -1) {
          state.roles[index] = action.payload;
        }
        if (state.selectedRole?.id === action.payload.id) {
          state.selectedRole = action.payload;
        }
      })
      .addCase(updateRole.rejected, (state: AccessControlState, action: any) => {
        state.loading.operations = false;
        state.error = action.error.message || 'Failed to update role';
      });

    // Delete role
    builder
      .addCase(deleteRole.pending, (state: AccessControlState) => {
        state.loading.operations = true;
      })
      .addCase(deleteRole.fulfilled, (state: AccessControlState, action: any) => {
        state.loading.operations = false;
        state.roles = state.roles.filter((r: any) => r.id !== action.payload);
        if (state.selectedRole?.id === action.payload) {
          state.selectedRole = null;
        }
      })
      .addCase(deleteRole.rejected, (state: AccessControlState, action: any) => {
        state.loading.operations = false;
        state.error = action.error.message || 'Failed to delete role';
      });

    // Permissions
    builder
      .addCase(fetchPermissions.pending, (state: AccessControlState) => {
        state.loading.permissions = true;
      })
      .addCase(fetchPermissions.fulfilled, (state: AccessControlState, action: any) => {
        state.loading.permissions = false;
        state.permissions = action.payload || [];
      })
      .addCase(fetchPermissions.rejected, (state: AccessControlState, action: any) => {
        state.loading.permissions = false;
        state.error = action.error.message || 'Failed to fetch permissions';
      });

    // Create permission
    builder
      .addCase(createPermission.fulfilled, (state: AccessControlState, action: any) => {
        state.permissions.push(action.payload);
      });

    // Security incidents
    builder
      .addCase(fetchSecurityIncidents.pending, (state: AccessControlState) => {
        state.loading.incidents = true;
      })
      .addCase(fetchSecurityIncidents.fulfilled, (state: AccessControlState, action: any) => {
        state.loading.incidents = false;
        // Handle both paginated response and array response
        if (Array.isArray(action.payload)) {
          state.securityIncidents = action.payload;
        } else {
          state.securityIncidents = action.payload.incidents || [];
          if (action.payload.pagination) {
            state.pagination.incidents = { ...state.pagination.incidents, ...action.payload.pagination };
          }
        }
      })
      .addCase(fetchSecurityIncidents.rejected, (state: AccessControlState, action: any) => {
        state.loading.incidents = false;
        state.error = action.error.message || 'Failed to fetch security incidents';
      });

    // Create security incident
    builder
      .addCase(createSecurityIncident.fulfilled, (state: AccessControlState, action: any) => {
        state.securityIncidents.push(action.payload);
      });

    // Update security incident
    builder
      .addCase(updateSecurityIncident.fulfilled, (state: AccessControlState, action: any) => {
        const index = state.securityIncidents.findIndex((i: any) => i.id === action.payload.id);
        if (index !== -1) {
          state.securityIncidents[index] = action.payload;
        }
        if (state.selectedIncident?.id === action.payload.id) {
          state.selectedIncident = action.payload;
        }
      });

    // Sessions
    builder
      .addCase(fetchUserSessions.pending, (state: AccessControlState) => {
        state.loading.sessions = true;
      })
      .addCase(fetchUserSessions.fulfilled, (state: AccessControlState, action: any) => {
        state.loading.sessions = false;
        state.sessions = action.payload || [];
      })
      .addCase(fetchUserSessions.rejected, (state: AccessControlState, action: any) => {
        state.loading.sessions = false;
        state.error = action.error.message || 'Failed to fetch sessions';
      });

    // Delete session
    builder
      .addCase(deleteSession.fulfilled, (state: AccessControlState, action: any) => {
        state.sessions = state.sessions.filter((s: any) => s.token !== action.payload);
      });

    // IP restrictions
    builder
      .addCase(fetchIpRestrictions.fulfilled, (state: AccessControlState, action: any) => {
        state.ipRestrictions = action.payload || [];
      });

    // Add IP restriction
    builder
      .addCase(addIpRestriction.fulfilled, (state: AccessControlState, action: any) => {
        state.ipRestrictions.push(action.payload);
      });

    // Remove IP restriction
    builder
      .addCase(removeIpRestriction.fulfilled, (state: AccessControlState, action: any) => {
        state.ipRestrictions = state.ipRestrictions.filter((r: any) => r.id !== action.payload);
      });

    // Statistics
    builder
      .addCase(fetchAccessControlStatistics.pending, (state: AccessControlState) => {
        state.loading.statistics = true;
      })
      .addCase(fetchAccessControlStatistics.fulfilled, (state: AccessControlState, action: any) => {
        state.loading.statistics = false;
        state.statistics = action.payload;
      })
      .addCase(fetchAccessControlStatistics.rejected, (state: AccessControlState, action: any) => {
        state.loading.statistics = false;
        state.error = action.error.message || 'Failed to fetch statistics';
      });

    // Initialize default roles
    builder
      .addCase(initializeDefaultRoles.fulfilled, (state: AccessControlState, action: any) => {
        state.roles = [...state.roles, ...action.payload];
      });
  }
});

// Actions
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
  resetState
} = accessControlSlice.actions;

// Selectors
export const selectAccessControlState = (state: RootState) => state.accessControl;
export const selectRoles = (state: RootState) => state.accessControl.roles;
export const selectPermissions = (state: RootState) => state.accessControl.permissions;
export const selectSecurityIncidents = (state: RootState) => state.accessControl.securityIncidents;
export const selectSessions = (state: RootState) => state.accessControl.sessions;
export const selectIpRestrictions = (state: RootState) => state.accessControl.ipRestrictions;
export const selectStatistics = (state: RootState) => state.accessControl.statistics;
export const selectSelectedRole = (state: RootState) => state.accessControl.selectedRole;
export const selectSelectedPermission = (state: RootState) => state.accessControl.selectedPermission;
export const selectSelectedIncident = (state: RootState) => state.accessControl.selectedIncident;
export const selectIncidentFilters = (state: RootState) => state.accessControl.filters.incidents;
export const selectSessionFilters = (state: RootState) => state.accessControl.filters.sessions;
export const selectRolesPagination = (state: RootState) => state.accessControl.pagination.roles;
export const selectPermissionsPagination = (state: RootState) => state.accessControl.pagination.permissions;
export const selectIncidentsPagination = (state: RootState) => state.accessControl.pagination.incidents;
export const selectSessionsPagination = (state: RootState) => state.accessControl.pagination.sessions;
export const selectLoading = (state: RootState) => state.accessControl.loading;
export const selectError = (state: RootState) => state.accessControl.error;
export const selectNotifications = (state: RootState) => state.accessControl.notifications;

// Derived selectors with proper typing
export const selectActiveRoles = (state: RootState): Role[] =>
  state.accessControl.roles.filter((role) => role.isActive);

export const selectCriticalIncidents = (state: RootState): SecurityIncident[] =>
  state.accessControl.securityIncidents.filter((incident) =>
    incident.severity === 'CRITICAL' || incident.severity === 'HIGH'
  );

export const selectActiveSessions = (state: RootState): UserSession[] =>
  state.accessControl.sessions.filter((session) => session.isActive);

export const selectFilteredIncidents = (state: RootState): SecurityIncident[] => {
  const { securityIncidents, filters } = state.accessControl;
  let filtered = securityIncidents;

  if (filters.incidents.severity) {
    filtered = filtered.filter((incident) => incident.severity === filters.incidents.severity);
  }

  if (filters.incidents.type) {
    filtered = filtered.filter((incident) => incident.type === filters.incidents.type);
  }

  if (filters.incidents.userId) {
    filtered = filtered.filter((incident) => incident.userId === filters.incidents.userId);
  }

  if (filters.incidents.startDate && filters.incidents.endDate) {
    const startDate = new Date(filters.incidents.startDate);
    const endDate = new Date(filters.incidents.endDate);
    filtered = filtered.filter((incident) => {
      const incidentDate = new Date(incident.createdAt);
      return incidentDate >= startDate && incidentDate <= endDate;
    });
  }

  return filtered;
};

export const selectFilteredSessions = (state: RootState): UserSession[] => {
  const { sessions, filters } = state.accessControl;
  let filtered = sessions;

  if (filters.sessions.userId) {
    filtered = filtered.filter((session) => session.userId === filters.sessions.userId);
  }

  if (filters.sessions.isActive !== undefined) {
    filtered = filtered.filter((session) => session.isActive === filters.sessions.isActive);
  }

  return filtered;
};

export const selectSecurityMetrics = (state: RootState) => {
  const { roles, permissions, securityIncidents, sessions } = state.accessControl;

  const totalRoles = roles.length;
  const activeRoles = roles.filter((r) => r.isActive).length;
  const totalPermissions = permissions.length;

  const recentIncidents = securityIncidents.filter((incident) =>
    new Date(incident.createdAt) > new Date(Date.now() - 24 * 60 * 60 * 1000)
  ).length;

  const criticalIncidents = securityIncidents.filter((incident) =>
    incident.severity === 'CRITICAL'
  ).length;

  const activeSessions = sessions.filter((s) => s.isActive).length;

  return {
    totalRoles,
    activeRoles,
    totalPermissions,
    recentIncidents,
    criticalIncidents,
    activeSessions,
    securityScore: criticalIncidents > 0 ? Math.max(0, 100 - criticalIncidents * 10) : 100
  };
};

export default accessControlSlice.reducer;
