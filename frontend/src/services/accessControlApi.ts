import api from './api';

export interface Role {
  id: string;
  name: string;
  description?: string;
  isSystem: boolean;
  createdAt: string;
  updatedAt: string;
  permissions?: RolePermission[];
}

export interface Permission {
  id: string;
  resource: string;
  action: string;
  description?: string;
  createdAt: string;
}

export interface RolePermission {
  id: string;
  roleId: string;
  permissionId: string;
  permission: Permission;
  createdAt: string;
}

export interface Session {
  id: string;
  userId: string;
  token: string;
  ipAddress?: string;
  userAgent?: string;
  expiresAt: string;
  lastActivity: string;
  createdAt: string;
}

export interface SecurityIncident {
  id: string;
  type: string;
  severity: string;
  description: string;
  affectedResources: string[];
  detectedBy?: string;
  status: string;
  resolvedAt?: string;
  resolvedBy?: string;
  resolution?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IpRestriction {
  id: string;
  ipAddress: string;
  type: string;
  reason?: string;
  isActive: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export const accessControlApi = {
  // Roles
  getRoles: async () => {
    const response = await api.get('/access-control/roles');
    return response.data.data;
  },

  getRoleById: async (id: string) => {
    const response = await api.get(`/access-control/roles/${id}`);
    return response.data.data;
  },

  createRole: async (data: { name: string; description?: string }) => {
    const response = await api.post('/access-control/roles', data);
    return response.data.data;
  },

  updateRole: async (id: string, data: any) => {
    const response = await api.put(`/access-control/roles/${id}`, data);
    return response.data.data;
  },

  deleteRole: async (id: string) => {
    const response = await api.delete(`/access-control/roles/${id}`);
    return response.data.data;
  },

  // Permissions
  getPermissions: async () => {
    const response = await api.get('/access-control/permissions');
    return response.data.data;
  },

  createPermission: async (data: { resource: string; action: string; description?: string }) => {
    const response = await api.post('/access-control/permissions', data);
    return response.data.data;
  },

  // Role-Permission Assignments
  assignPermissionToRole: async (roleId: string, permissionId: string) => {
    const response = await api.post(`/access-control/roles/${roleId}/permissions/${permissionId}`);
    return response.data.data;
  },

  removePermissionFromRole: async (roleId: string, permissionId: string) => {
    const response = await api.delete(`/access-control/roles/${roleId}/permissions/${permissionId}`);
    return response.data.data;
  },

  // User-Role Assignments
  assignRoleToUser: async (userId: string, roleId: string) => {
    const response = await api.post(`/access-control/users/${userId}/roles/${roleId}`);
    return response.data.data;
  },

  removeRoleFromUser: async (userId: string, roleId: string) => {
    const response = await api.delete(`/access-control/users/${userId}/roles/${roleId}`);
    return response.data.data;
  },

  // User Permissions
  getUserPermissions: async (userId: string) => {
    const response = await api.get(`/access-control/users/${userId}/permissions`);
    return response.data;
  },

  checkPermission: async (userId: string, resource: string, action: string) => {
    const response = await api.get(`/access-control/users/${userId}/check`, {
      params: { resource, action }
    });
    return response.data.data;
  },

  // Sessions
  getUserSessions: async (userId: string) => {
    const response = await api.get(`/access-control/users/${userId}/sessions`);
    return response.data.data;
  },

  deleteSession: async (token: string) => {
    const response = await api.delete(`/access-control/sessions/${token}`);
    return response.data.data;
  },

  deleteAllUserSessions: async (userId: string) => {
    const response = await api.delete(`/access-control/users/${userId}/sessions`);
    return response.data;
  },

  // Security Incidents
  getSecurityIncidents: async (params?: any) => {
    const response = await api.get('/access-control/security-incidents', { params });
    return response.data.data;
  },

  createSecurityIncident: async (data: any) => {
    const response = await api.post('/access-control/security-incidents', data);
    return response.data.data;
  },

  updateSecurityIncident: async (id: string, data: any) => {
    const response = await api.put(`/access-control/security-incidents/${id}`, data);
    return response.data.data;
  },

  // IP Restrictions
  getIpRestrictions: async () => {
    const response = await api.get('/access-control/ip-restrictions');
    return response.data.data;
  },

  addIpRestriction: async (data: { ipAddress: string; type: string; reason?: string }) => {
    const response = await api.post('/access-control/ip-restrictions', data);
    return response.data.data;
  },

  removeIpRestriction: async (id: string) => {
    const response = await api.delete(`/access-control/ip-restrictions/${id}`);
    return response.data.data;
  },

  // Statistics
  getStatistics: async () => {
    const response = await api.get('/access-control/statistics');
    return response.data;
  },

  // Initialize default roles
  initializeDefaultRoles: async () => {
    const response = await api.post('/access-control/initialize-roles');
    return response.data.data;
  },
};
