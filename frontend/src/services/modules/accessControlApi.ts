import type { IAccessControlApi } from '../types'
import type { 
  Role, 
  Permission, 
  RolePermission, 
  Session, 
  SecurityIncident, 
  IpRestriction 
} from '../types'
import { apiInstance } from '../config/apiConfig'
import { extractApiData, handleApiError } from '../utils/apiUtils'

/**
 * Access Control API implementation
 * Handles roles, permissions, sessions, and security management
 */
class AccessControlApiImpl implements IAccessControlApi {
  // Roles
  /**
   * Get all roles
   */
  async getRoles(): Promise<{ roles: Role[] }> {
    try {
      const response = await apiInstance.get('/access-control/roles')
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  /**
   * Get role by ID
   */
  async getRoleById(id: string): Promise<{ role: Role }> {
    try {
      const response = await apiInstance.get(`/access-control/roles/${id}`)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  /**
   * Create a new role
   */
  async createRole(data: { name: string; description?: string }): Promise<{ role: Role }> {
    try {
      const response = await apiInstance.post('/access-control/roles', data)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  /**
   * Update an existing role
   */
  async updateRole(id: string, data: Partial<Role>): Promise<{ role: Role }> {
    try {
      const response = await apiInstance.put(`/access-control/roles/${id}`, data)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  /**
   * Delete a role
   */
  async deleteRole(id: string): Promise<{ success: boolean }> {
    try {
      const response = await apiInstance.delete(`/access-control/roles/${id}`)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  // Permissions
  /**
   * Get all permissions
   */
  async getPermissions(): Promise<{ permissions: Permission[] }> {
    try {
      const response = await apiInstance.get('/access-control/permissions')
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  /**
   * Create a new permission
   */
  async createPermission(data: { 
    resource: string; 
    action: string; 
    description?: string 
  }): Promise<{ permission: Permission }> {
    try {
      const response = await apiInstance.post('/access-control/permissions', data)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  // Role-Permission Assignments
  /**
   * Assign permission to role
   */
  async assignPermissionToRole(roleId: string, permissionId: string): Promise<{ assignment: RolePermission }> {
    try {
      const response = await apiInstance.post(`/access-control/roles/${roleId}/permissions/${permissionId}`)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  /**
   * Remove permission from role
   */
  async removePermissionFromRole(roleId: string, permissionId: string): Promise<{ success: boolean }> {
    try {
      const response = await apiInstance.delete(`/access-control/roles/${roleId}/permissions/${permissionId}`)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  // User-Role Assignments
  /**
   * Assign role to user
   */
  async assignRoleToUser(userId: string, roleId: string): Promise<{ assignment: any }> {
    try {
      const response = await apiInstance.post(`/access-control/users/${userId}/roles/${roleId}`)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  /**
   * Remove role from user
   */
  async removeRoleFromUser(userId: string, roleId: string): Promise<{ success: boolean }> {
    try {
      const response = await apiInstance.delete(`/access-control/users/${userId}/roles/${roleId}`)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  // User Permissions
  /**
   * Get user permissions
   */
  async getUserPermissions(userId: string): Promise<{ permissions: Permission[] }> {
    try {
      const response = await apiInstance.get(`/access-control/users/${userId}/permissions`)
      return response.data
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  /**
   * Check if user has specific permission
   */
  async checkPermission(userId: string, resource: string, action: string): Promise<{ hasPermission: boolean }> {
    try {
      const response = await apiInstance.get(`/access-control/users/${userId}/check`, {
        params: { resource, action }
      })
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  // Sessions
  /**
   * Get user sessions
   */
  async getUserSessions(userId: string): Promise<{ sessions: Session[] }> {
    try {
      const response = await apiInstance.get(`/access-control/users/${userId}/sessions`)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  /**
   * Delete a specific session
   */
  async deleteSession(token: string): Promise<{ success: boolean }> {
    try {
      const response = await apiInstance.delete(`/access-control/sessions/${token}`)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  /**
   * Delete all user sessions
   */
  async deleteAllUserSessions(userId: string): Promise<{ deletedCount: number }> {
    try {
      const response = await apiInstance.delete(`/access-control/users/${userId}/sessions`)
      return response.data
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  // Security Incidents
  /**
   * Get security incidents
   */
  async getSecurityIncidents(params?: any): Promise<{ incidents: SecurityIncident[] }> {
    try {
      const response = await apiInstance.get('/access-control/security-incidents', { params })
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  /**
   * Create security incident
   */
  async createSecurityIncident(data: {
    type: string;
    severity: string;
    description: string;
    affectedResources: string[];
    detectedBy?: string;
  }): Promise<{ incident: SecurityIncident }> {
    try {
      const response = await apiInstance.post('/access-control/security-incidents', data)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  /**
   * Update security incident
   */
  async updateSecurityIncident(id: string, data: Partial<SecurityIncident>): Promise<{ incident: SecurityIncident }> {
    try {
      const response = await apiInstance.put(`/access-control/security-incidents/${id}`, data)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  // IP Restrictions
  /**
   * Get IP restrictions
   */
  async getIpRestrictions(): Promise<{ restrictions: IpRestriction[] }> {
    try {
      const response = await apiInstance.get('/access-control/ip-restrictions')
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  /**
   * Add IP restriction
   */
  async addIpRestriction(data: { 
    ipAddress: string; 
    type: string; 
    reason?: string 
  }): Promise<{ restriction: IpRestriction }> {
    try {
      const response = await apiInstance.post('/access-control/ip-restrictions', data)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  /**
   * Remove IP restriction
   */
  async removeIpRestriction(id: string): Promise<{ success: boolean }> {
    try {
      const response = await apiInstance.delete(`/access-control/ip-restrictions/${id}`)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  // Statistics
  /**
   * Get access control statistics
   */
  async getStatistics(): Promise<any> {
    try {
      const response = await apiInstance.get('/access-control/statistics')
      return response.data
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  // Initialize default roles
  /**
   * Initialize default system roles
   */
  async initializeDefaultRoles(): Promise<{ roles: Role[] }> {
    try {
      const response = await apiInstance.post('/access-control/initialize-roles')
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }
}

export const accessControlApi = new AccessControlApiImpl()
export type { IAccessControlApi }
