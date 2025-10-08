import { PrismaClient, SecurityIncidentType, IncidentSeverity, IpRestrictionType, Prisma } from '@prisma/client';
import { logger } from '../utils/logger';

const prisma = new PrismaClient();

export interface CreateRoleData {
  name: string;
  description?: string;
}

export interface CreatePermissionData {
  resource: string;
  action: string;
  description?: string;
}

export interface CreateSecurityIncidentData {
  type: string;
  severity: string;
  description: string;
  affectedResources?: string[];
  detectedBy?: string;
}

export class AccessControlService {
  /**
   * Get all roles
   */
  static async getRoles() {
    try {
      const roles = await prisma.role.findMany({
        include: {
          permissions: {
            include: {
              permission: true,
            },
          },
          userRoles: true,
        },
        orderBy: { name: 'asc' },
      });

      logger.info(`Retrieved ${roles.length} roles`);
      return roles;
    } catch (error) {
      logger.error('Error getting roles:', error);
      throw error;
    }
  }

  /**
   * Get role by ID
   */
  static async getRoleById(id: string) {
    try {
      const role = await prisma.role.findUnique({
        where: { id },
        include: {
          permissions: {
            include: {
              permission: true,
            },
          },
          userRoles: true,
        },
      });

      if (!role) {
        throw new Error('Role not found');
      }

      logger.info(`Retrieved role: ${id}`);
      return role;
    } catch (error) {
      logger.error(`Error getting role ${id}:`, error);
      throw error;
    }
  }

  /**
   * Create a new role
   */
  static async createRole(data: CreateRoleData) {
    try {
      const role = await prisma.role.create({
        data: {
          name: data.name,
          description: data.description,
          isSystem: false,
        },
        include: {
          permissions: true,
        },
      });

      logger.info(`Created role: ${role.id}`);
      return role;
    } catch (error) {
      logger.error('Error creating role:', error);
      throw error;
    }
  }

  /**
   * Update role
   */
  static async updateRole(id: string, data: { name?: string; description?: string }) {
    try {
      const role = await prisma.role.update({
        where: { id },
        data,
        include: {
          permissions: {
            include: {
              permission: true,
            },
          },
        },
      });

      logger.info(`Updated role: ${id}`);
      return role;
    } catch (error) {
      logger.error(`Error updating role ${id}:`, error);
      throw error;
    }
  }

  /**
   * Delete role
   */
  static async deleteRole(id: string) {
    try {
      const role = await prisma.role.findUnique({ where: { id } });
      
      if (role?.isSystem) {
        throw new Error('Cannot delete system role');
      }

      await prisma.role.delete({ where: { id } });

      logger.info(`Deleted role: ${id}`);
      return { success: true };
    } catch (error) {
      logger.error(`Error deleting role ${id}:`, error);
      throw error;
    }
  }

  /**
   * Get all permissions
   */
  static async getPermissions() {
    try {
      const permissions = await prisma.permission.findMany({
        orderBy: [{ resource: 'asc' }, { action: 'asc' }],
      });

      logger.info(`Retrieved ${permissions.length} permissions`);
      return permissions;
    } catch (error) {
      logger.error('Error getting permissions:', error);
      throw error;
    }
  }

  /**
   * Create permission
   */
  static async createPermission(data: CreatePermissionData) {
    try {
      const permission = await prisma.permission.create({
        data: {
          resource: data.resource,
          action: data.action,
          description: data.description,
        },
      });

      logger.info(`Created permission: ${permission.id}`);
      return permission;
    } catch (error) {
      logger.error('Error creating permission:', error);
      throw error;
    }
  }

  /**
   * Assign permission to role
   */
  static async assignPermissionToRole(roleId: string, permissionId: string) {
    try {
      const rolePermission = await prisma.rolePermission.create({
        data: {
          roleId,
          permissionId,
        },
        include: {
          role: true,
          permission: true,
        },
      });

      logger.info(`Assigned permission ${permissionId} to role ${roleId}`);
      return rolePermission;
    } catch (error) {
      logger.error('Error assigning permission to role:', error);
      throw error;
    }
  }

  /**
   * Remove permission from role
   */
  static async removePermissionFromRole(roleId: string, permissionId: string) {
    try {
      await prisma.rolePermission.deleteMany({
        where: {
          roleId,
          permissionId,
        },
      });

      logger.info(`Removed permission ${permissionId} from role ${roleId}`);
      return { success: true };
    } catch (error) {
      logger.error('Error removing permission from role:', error);
      throw error;
    }
  }

  /**
   * Assign role to user
   */
  static async assignRoleToUser(userId: string, roleId: string) {
    try {
      const userRole = await prisma.userRoleAssignment.create({
        data: {
          userId,
          roleId,
        },
        include: {
          role: {
            include: {
              permissions: {
                include: {
                  permission: true,
                },
              },
            },
          },
        },
      });

      logger.info(`Assigned role ${roleId} to user ${userId}`);
      return userRole;
    } catch (error) {
      logger.error('Error assigning role to user:', error);
      throw error;
    }
  }

  /**
   * Remove role from user
   */
  static async removeRoleFromUser(userId: string, roleId: string) {
    try {
      await prisma.userRoleAssignment.deleteMany({
        where: {
          userId,
          roleId,
        },
      });

      logger.info(`Removed role ${roleId} from user ${userId}`);
      return { success: true };
    } catch (error) {
      logger.error('Error removing role from user:', error);
      throw error;
    }
  }

  /**
   * Get user roles and permissions
   */
  static async getUserPermissions(userId: string) {
    try {
      const userRoles = await prisma.userRoleAssignment.findMany({
        where: { userId },
        include: {
          role: {
            include: {
              permissions: {
                include: {
                  permission: true,
                },
              },
            },
          },
        },
      });

      // Flatten permissions
      const permissions = userRoles.flatMap(ur =>
        ur.role.permissions.map(rp => rp.permission)
      );

      // Remove duplicates
      const uniquePermissions = Array.from(
        new Map(permissions.map(p => [p.id, p])).values()
      );

      logger.info(`Retrieved ${uniquePermissions.length} permissions for user ${userId}`);
      return {
        roles: userRoles.map(ur => ur.role),
        permissions: uniquePermissions,
      };
    } catch (error) {
      logger.error(`Error getting user permissions for ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Check if user has permission
   */
  static async checkPermission(userId: string, resource: string, action: string): Promise<boolean> {
    try {
      const userPermissions = await this.getUserPermissions(userId);
      
      const hasPermission = userPermissions.permissions.some(
        p => p.resource === resource && p.action === action
      );

      logger.info(`Permission check for user ${userId} on ${resource}.${action}: ${hasPermission}`);
      return hasPermission;
    } catch (error) {
      logger.error('Error checking permission:', error);
      return false;
    }
  }

  /**
   * Create session
   */
  static async createSession(data: {
    userId: string;
    token: string;
    ipAddress?: string;
    userAgent?: string;
    expiresAt: Date;
  }) {
    try {
      const session = await prisma.session.create({
        data: {
          userId: data.userId,
          token: data.token,
          ipAddress: data.ipAddress,
          userAgent: data.userAgent,
          expiresAt: data.expiresAt,
        },
      });

      logger.info(`Created session for user ${data.userId}`);
      return session;
    } catch (error) {
      logger.error('Error creating session:', error);
      throw error;
    }
  }

  /**
   * Get active sessions for user
   */
  static async getUserSessions(userId: string) {
    try {
      const sessions = await prisma.session.findMany({
        where: {
          userId,
          expiresAt: { gt: new Date() },
        },
        orderBy: { createdAt: 'desc' },
      });

      logger.info(`Retrieved ${sessions.length} active sessions for user ${userId}`);
      return sessions;
    } catch (error) {
      logger.error(`Error getting sessions for user ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Update session activity
   */
  static async updateSessionActivity(token: string) {
    try {
      await prisma.session.update({
        where: { token },
        data: { lastActivity: new Date() },
      });
    } catch (error) {
      logger.error('Error updating session activity:', error);
      // Don't throw - this is a background operation
    }
  }

  /**
   * Delete session (logout)
   */
  static async deleteSession(token: string) {
    try {
      await prisma.session.delete({
        where: { token },
      });

      logger.info('Session deleted');
      return { success: true };
    } catch (error) {
      logger.error('Error deleting session:', error);
      throw error;
    }
  }

  /**
   * Delete all user sessions (logout all devices)
   */
  static async deleteAllUserSessions(userId: string) {
    try {
      const result = await prisma.session.deleteMany({
        where: { userId },
      });

      logger.info(`Deleted ${result.count} sessions for user ${userId}`);
      return { deleted: result.count };
    } catch (error) {
      logger.error(`Error deleting sessions for user ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Clean up expired sessions
   */
  static async cleanupExpiredSessions() {
    try {
      const result = await prisma.session.deleteMany({
        where: {
          expiresAt: { lt: new Date() },
        },
      });

      logger.info(`Cleaned up ${result.count} expired sessions`);
      return { deleted: result.count };
    } catch (error) {
      logger.error('Error cleaning up expired sessions:', error);
      throw error;
    }
  }

  /**
   * Log login attempt
   */
  static async logLoginAttempt(data: {
    email: string;
    success: boolean;
    ipAddress?: string;
    userAgent?: string;
    failureReason?: string;
  }) {
    try {
      const attempt = await prisma.loginAttempt.create({
        data: {
          email: data.email,
          success: data.success,
          ipAddress: data.ipAddress,
          userAgent: data.userAgent,
          failureReason: data.failureReason,
        },
      });

      logger.info(`Logged login attempt for ${data.email}: ${data.success ? 'success' : 'failure'}`);
      return attempt;
    } catch (error) {
      logger.error('Error logging login attempt:', error);
      // Don't throw - logging failures shouldn't break login
    }
  }

  /**
   * Get recent failed login attempts
   */
  static async getFailedLoginAttempts(email: string, minutes: number = 15) {
    try {
      const since = new Date(Date.now() - minutes * 60 * 1000);

      const attempts = await prisma.loginAttempt.findMany({
        where: {
          email,
          success: false,
          createdAt: { gte: since },
        },
        orderBy: { createdAt: 'desc' },
      });

      logger.info(`Retrieved ${attempts.length} failed login attempts for ${email}`);
      return attempts;
    } catch (error) {
      logger.error('Error getting failed login attempts:', error);
      throw error;
    }
  }

  /**
   * Create security incident
   */
  static async createSecurityIncident(data: CreateSecurityIncidentData) {
    try {
      const incident = await prisma.securityIncident.create({
        data: {
          type: data.type as SecurityIncidentType,
          severity: data.severity as IncidentSeverity,
          description: data.description,
          affectedResources: data.affectedResources || [],
          detectedBy: data.detectedBy,
          status: 'OPEN',
        },
      });

      logger.warn(`Security incident created: ${incident.id} - ${data.type}`);
      return incident;
    } catch (error) {
      logger.error('Error creating security incident:', error);
      throw error;
    }
  }

  /**
   * Update security incident
   */
  static async updateSecurityIncident(
    id: string,
    data: {
      status?: string;
      resolution?: string;
      resolvedBy?: string;
    }
  ) {
    try {
      const updateData: Prisma.SecurityIncidentUpdateInput = {};
      if (data.status) updateData.status = data.status as any;
      if (data.resolution) updateData.resolution = data.resolution;
      if (data.resolvedBy) updateData.resolvedBy = data.resolvedBy;

      if (data.status === 'RESOLVED' && !updateData.resolvedAt) {
        updateData.resolvedAt = new Date();
      }

      const incident = await prisma.securityIncident.update({
        where: { id },
        data: updateData,
      });

      logger.info(`Updated security incident: ${id}`);
      return incident;
    } catch (error) {
      logger.error(`Error updating security incident ${id}:`, error);
      throw error;
    }
  }

  /**
   * Get security incidents
   */
  static async getSecurityIncidents(
    page: number = 1,
    limit: number = 20,
    filters: {
      type?: string;
      severity?: string;
      status?: string;
    } = {}
  ) {
    try {
      const skip = (page - 1) * limit;
      const where: Prisma.SecurityIncidentWhereInput = {};

      if (filters.type) {
        where.type = filters.type as SecurityIncidentType;
      }
      if (filters.severity) {
        where.severity = filters.severity as IncidentSeverity;
      }
      if (filters.status) {
        where.status = filters.status as Prisma.EnumSecurityIncidentStatusFilter;
      }

      const [incidents, total] = await Promise.all([
        prisma.securityIncident.findMany({
          where,
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
        }),
        prisma.securityIncident.count({ where }),
      ]);

      logger.info(`Retrieved ${incidents.length} security incidents`);

      return {
        incidents,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      logger.error('Error getting security incidents:', error);
      throw error;
    }
  }

  /**
   * Get IP restrictions
   */
  static async getIpRestrictions() {
    try {
      const restrictions = await prisma.ipRestriction.findMany({
        where: { isActive: true },
        orderBy: { createdAt: 'desc' },
      });

      logger.info(`Retrieved ${restrictions.length} IP restrictions`);
      return restrictions;
    } catch (error) {
      logger.error('Error getting IP restrictions:', error);
      throw error;
    }
  }

  /**
   * Add IP restriction
   */
  static async addIpRestriction(data: {
    ipAddress: string;
    type: string;
    reason?: string;
    createdBy: string;
  }) {
    try {
      const restriction = await prisma.ipRestriction.create({
        data: {
          ipAddress: data.ipAddress,
          type: data.type as IpRestrictionType,
          reason: data.reason,
          isActive: true,
          createdBy: data.createdBy,
        },
      });

      logger.info(`Added IP restriction: ${data.ipAddress} (${data.type})`);
      return restriction;
    } catch (error) {
      logger.error('Error adding IP restriction:', error);
      throw error;
    }
  }

  /**
   * Remove IP restriction
   */
  static async removeIpRestriction(id: string) {
    try {
      await prisma.ipRestriction.update({
        where: { id },
        data: { isActive: false },
      });

      logger.info(`Removed IP restriction: ${id}`);
      return { success: true };
    } catch (error) {
      logger.error(`Error removing IP restriction ${id}:`, error);
      throw error;
    }
  }

  /**
   * Check if IP is restricted
   */
  static async checkIpRestriction(ipAddress: string): Promise<{
    isRestricted: boolean;
    type?: string;
    reason?: string;
  }> {
    try {
      const restriction = await prisma.ipRestriction.findFirst({
        where: {
          ipAddress,
          isActive: true,
        },
      });

      if (!restriction) {
        return { isRestricted: false };
      }

      const isRestricted = restriction.type === 'BLACKLIST';

      return {
        isRestricted,
        type: restriction.type,
        reason: restriction.reason || undefined,
      };
    } catch (error) {
      logger.error('Error checking IP restriction:', error);
      return { isRestricted: false };
    }
  }

  /**
   * Get security statistics
   */
  static async getSecurityStatistics() {
    try {
      const [
        totalIncidents,
        openIncidents,
        criticalIncidents,
        recentFailedLogins,
        activeSessions,
        ipRestrictions,
      ] = await Promise.all([
        prisma.securityIncident.count(),
        prisma.securityIncident.count({ where: { status: 'OPEN' } }),
        prisma.securityIncident.count({
          where: {
            severity: 'CRITICAL',
            status: { not: 'CLOSED' },
          },
        }),
        prisma.loginAttempt.count({
          where: {
            success: false,
            createdAt: {
              gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
            },
          },
        }),
        prisma.session.count({
          where: {
            expiresAt: { gt: new Date() },
          },
        }),
        prisma.ipRestriction.count({ where: { isActive: true } }),
      ]);

      const statistics = {
        incidents: {
          total: totalIncidents,
          open: openIncidents,
          critical: criticalIncidents,
        },
        authentication: {
          recentFailedLogins,
          activeSessions,
        },
        ipRestrictions,
      };

      logger.info('Retrieved security statistics');
      return statistics;
    } catch (error) {
      logger.error('Error getting security statistics:', error);
      throw error;
    }
  }

  /**
   * Initialize default roles and permissions
   */
  static async initializeDefaultRoles() {
    try {
      // Check if roles already exist
      const existingRoles = await prisma.role.count();
      if (existingRoles > 0) {
        logger.info('Roles already initialized');
        return;
      }

      // Create default permissions
      const permissions = await Promise.all([
        // Student permissions
        this.createPermission({ resource: 'students', action: 'read', description: 'View students' }),
        this.createPermission({ resource: 'students', action: 'create', description: 'Create students' }),
        this.createPermission({ resource: 'students', action: 'update', description: 'Update students' }),
        this.createPermission({ resource: 'students', action: 'delete', description: 'Delete students' }),
        
        // Medication permissions
        this.createPermission({ resource: 'medications', action: 'read', description: 'View medications' }),
        this.createPermission({ resource: 'medications', action: 'administer', description: 'Administer medications' }),
        this.createPermission({ resource: 'medications', action: 'manage', description: 'Manage medication inventory' }),
        
        // Health records permissions
        this.createPermission({ resource: 'health_records', action: 'read', description: 'View health records' }),
        this.createPermission({ resource: 'health_records', action: 'create', description: 'Create health records' }),
        this.createPermission({ resource: 'health_records', action: 'update', description: 'Update health records' }),
        
        // Reports permissions
        this.createPermission({ resource: 'reports', action: 'read', description: 'View reports' }),
        this.createPermission({ resource: 'reports', action: 'create', description: 'Create reports' }),
        
        // Admin permissions
        this.createPermission({ resource: 'users', action: 'manage', description: 'Manage users' }),
        this.createPermission({ resource: 'system', action: 'configure', description: 'Configure system' }),
      ]);

      // Create default roles
      const nurseRole = await this.createRole({
        name: 'Nurse',
        description: 'School nurse with full access to student health management',
      });

      const adminRole = await this.createRole({
        name: 'Administrator',
        description: 'System administrator with full access',
      });

      // Assign permissions to nurse role
      const nursePermissions = permissions.filter(p =>
        ['students', 'medications', 'health_records', 'reports'].includes(p.resource)
      );
      
      for (const permission of nursePermissions) {
        await this.assignPermissionToRole(nurseRole.id, permission.id);
      }

      // Assign all permissions to admin role
      for (const permission of permissions) {
        await this.assignPermissionToRole(adminRole.id, permission.id);
      }

      logger.info('Initialized default roles and permissions');
    } catch (error) {
      logger.error('Error initializing default roles:', error);
      throw error;
    }
  }
}
