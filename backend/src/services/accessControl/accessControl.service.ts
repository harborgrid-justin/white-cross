import { Op } from 'sequelize';
import { logger } from '../../utils/logger';
import {
  SecurityIncident,
  Session,
  LoginAttempt,
  IpRestriction,
  Role,
  Permission,
  RolePermission,
  UserRoleAssignment,
  User,
  sequelize
} from '../../database/models';
import {
  SecurityIncidentType,
  IncidentSeverity,
  SecurityIncidentStatus,
  IpRestrictionType,
  AuditAction
} from '../../database/types/enums';
import { auditService, AuditService } from '../auditService';
import {
  CreateSecurityIncidentData,
  UpdateSecurityIncidentData,
  SecurityIncidentFilters,
  SecurityStatistics,
  CreateSessionData,
  LogLoginAttemptData,
  AddIpRestrictionData,
  IpRestrictionCheckResult,
  CreateRoleData,
  UpdateRoleData,
  CreatePermissionData,
  UserPermissionsResult
} from './accessControl.types';

// Type augmentations for model associations
declare module '../../database/models' {
  interface Role {
    permissions?: any[];
  }
  
  interface UserRoleAssignment {
    role?: Role;
  }
}

export class AccessControlService {
  // Role Management Operations
  static async getRoles(): Promise<Role[]> {
    try {
      const roles = await Role.findAll({
        include: [
          {
            model: RolePermission,
            as: 'permissions',
            include: [
              {
                model: Permission,
                as: 'permission'
              }
            ]
          },
          {
            model: UserRoleAssignment,
            as: 'userRoles'
          }
        ],
        order: [['name', 'ASC']]
      });

      logger.info(`Retrieved ${roles.length} roles`);
      return roles;
    } catch (error) {
      logger.error('Error getting roles:', error);
      throw error;
    }
  }

  static async getRoleById(id: string): Promise<Role> {
    try {
      const role = await Role.findByPk(id, {
        include: [
          {
            model: RolePermission,
            as: 'permissions',
            include: [
              {
                model: Permission,
                as: 'permission'
              }
            ]
          },
          {
            model: UserRoleAssignment,
            as: 'userRoles'
          }
        ]
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

  static async createRole(data: CreateRoleData, auditUserId?: string): Promise<Role> {
    const transaction = await sequelize.transaction();

    try {
      // Validation: Check for duplicate role name (case-insensitive)
      const existingRole = await Role.findOne({
        where: sequelize.where(
          sequelize.fn('LOWER', sequelize.col('name')),
          sequelize.fn('LOWER', data.name)
        ),
        transaction
      });

      if (existingRole) {
        throw new Error(`Role with name '${data.name}' already exists`);
      }

      // Validation: Trim and validate name
      const trimmedName = data.name.trim();
      if (trimmedName.length < 2 || trimmedName.length > 100) {
        throw new Error('Role name must be between 2 and 100 characters');
      }

      // Create role
      const role = await Role.create({
        name: trimmedName,
        description: data.description?.trim(),
        isSystem: false
      }, { transaction });

      // Reload with associations
      await role.reload({
        include: [
          {
            model: RolePermission,
            as: 'permissions',
            include: [
              {
                model: Permission,
                as: 'permission'
              }
            ]
          }
        ],
        transaction
      });

      await transaction.commit();

      // Audit logging
      await AuditService.logAction({
        userId: auditUserId,
        action: AuditAction.CREATE,
        entityType: 'Role',
        entityId: role.id,
        changes: {
          name: role.name,
          description: role.description,
          isSystem: role.isSystem
        }
      });

      logger.info(`Created role: ${role.id} (${role.name}) by user ${auditUserId || 'SYSTEM'}`);
      return role;
    } catch (error) {
      await transaction.rollback();
      logger.error('Error creating role:', error);

      // Audit failed attempt
      await AuditService.logAction({
        userId: auditUserId,
        action: AuditAction.CREATE,
        entityType: 'Role',
        changes: { name: data.name },
        success: false,
        errorMessage: error instanceof Error ? error.message : 'Unknown error'
      });

      throw error;
    }
  }

  static async updateRole(id: string, data: UpdateRoleData, auditUserId?: string): Promise<Role> {
    const transaction = await sequelize.transaction();

    try {
      const role = await Role.findByPk(id, { transaction });

      if (!role) {
        throw new Error('Role not found');
      }

      // Validation: Prevent modification of system roles
      if (role.isSystem) {
        throw new Error('Cannot modify system roles');
      }

      // Store original values for audit trail
      const originalValues = {
        name: role.name,
        description: role.description
      };

      // Validation: Check for duplicate name if name is being changed
      if (data.name && data.name.trim() !== role.name) {
        const trimmedName = data.name.trim();

        const existingRole = await Role.findOne({
          where: {
            id: { [Op.ne]: id },
            [Op.and]: sequelize.where(
              sequelize.fn('LOWER', sequelize.col('name')),
              sequelize.fn('LOWER', trimmedName)
            )
          },
          transaction
        });

        if (existingRole) {
          throw new Error(`Role with name '${trimmedName}' already exists`);
        }

        // Validate name length
        if (trimmedName.length < 2 || trimmedName.length > 100) {
          throw new Error('Role name must be between 2 and 100 characters');
        }
      }

      // Prepare update data
      const updateData: any = {};
      if (data.name) updateData.name = data.name.trim();
      if (data.description !== undefined) updateData.description = data.description?.trim();

      await role.update(updateData, { transaction });

      // Reload with associations
      await role.reload({
        include: [
          {
            model: RolePermission,
            as: 'permissions',
            include: [
              {
                model: Permission,
                as: 'permission'
              }
            ]
          }
        ],
        transaction
      });

      await transaction.commit();

      // Audit logging
      await AuditService.logAction({
        userId: auditUserId,
        action: AuditAction.UPDATE,
        entityType: 'Role',
        entityId: role.id,
        changes: {
          before: originalValues,
          after: {
            name: role.name,
            description: role.description
          }
        }
      });

      logger.info(`Updated role: ${id} by user ${auditUserId || 'SYSTEM'}`);
      return role;
    } catch (error) {
      await transaction.rollback();
      logger.error(`Error updating role ${id}:`, error);

      // Audit failed attempt
      await AuditService.logAction({
        userId: auditUserId,
        action: AuditAction.UPDATE,
        entityType: 'Role',
        entityId: id,
        changes: data,
        success: false,
        errorMessage: error instanceof Error ? error.message : 'Unknown error'
      });

      throw error;
    }
  }

  static async deleteRole(id: string, auditUserId?: string): Promise<{ success: boolean }> {
    const transaction = await sequelize.transaction();

    try {
      const role = await Role.findByPk(id, {
        include: [
          {
            model: UserRoleAssignment,
            as: 'userRoles'
          }
        ],
        transaction
      });

      if (!role) {
        throw new Error('Role not found');
      }

      // Validation: Prevent deletion of system roles
      if (role.isSystem) {
        throw new Error('Cannot delete system role');
      }

      // Validation: Check if role is assigned to users
      const assignedUsers = await UserRoleAssignment.count({
        where: { roleId: id },
        transaction
      });

      if (assignedUsers > 0) {
        throw new Error(`Cannot delete role: It is currently assigned to ${assignedUsers} user(s). Remove all user assignments first.`);
      }

      // Store role data for audit trail
      const roleData = {
        id: role.id,
        name: role.name,
        description: role.description,
        isSystem: role.isSystem
      };

      await role.destroy({ transaction });
      await transaction.commit();

      // Audit logging
      await AuditService.logAction({
        userId: auditUserId,
        action: AuditAction.DELETE,
        entityType: 'Role',
        entityId: id,
        changes: { deletedRole: roleData }
      });

      logger.info(`Deleted role: ${id} (${roleData.name}) by user ${auditUserId || 'SYSTEM'}`);
      return { success: true };
    } catch (error) {
      await transaction.rollback();
      logger.error(`Error deleting role ${id}:`, error);

      // Audit failed attempt
      await AuditService.logAction({
        userId: auditUserId,
        action: AuditAction.DELETE,
        entityType: 'Role',
        entityId: id,
        success: false,
        errorMessage: error instanceof Error ? error.message : 'Unknown error'
      });

      throw error;
    }
  }

  // Permission Management Operations
  static async getPermissions(): Promise<Permission[]> {
    try {
      const permissions = await Permission.findAll({
        order: [
          ['resource', 'ASC'],
          ['action', 'ASC']
        ]
      });

      logger.info(`Retrieved ${permissions.length} permissions`);
      return permissions;
    } catch (error) {
      logger.error('Error getting permissions:', error);
      throw error;
    }
  }

  static async createPermission(data: CreatePermissionData): Promise<Permission> {
    try {
      const permission = await Permission.create({
        resource: data.resource,
        action: data.action,
        description: data.description
      });

      logger.info(`Created permission: ${permission.id}`);
      return permission;
    } catch (error) {
      logger.error('Error creating permission:', error);
      throw error;
    }
  }

  static async assignPermissionToRole(
    roleId: string,
    permissionId: string,
    auditUserId?: string
  ): Promise<RolePermission> {
    const transaction = await sequelize.transaction();

    try {
      // Verify role and permission exist
      const [role, permission] = await Promise.all([
        Role.findByPk(roleId, { transaction }),
        Permission.findByPk(permissionId, { transaction })
      ]);

      if (!role) {
        throw new Error('Role not found');
      }

      if (!permission) {
        throw new Error('Permission not found');
      }

      // Validation: Prevent modification of system role permissions
      if (role.isSystem) {
        throw new Error('Cannot modify permissions of system roles');
      }

      // Check if assignment already exists
      const existingAssignment = await RolePermission.findOne({
        where: {
          roleId,
          permissionId
        },
        transaction
      });

      if (existingAssignment) {
        throw new Error('Permission already assigned to role');
      }

      const rolePermission = await RolePermission.create({
        roleId,
        permissionId
      }, { transaction });

      // Reload with associations
      await rolePermission.reload({
        include: [
          {
            model: Role,
            as: 'role'
          },
          {
            model: Permission,
            as: 'permission'
          }
        ],
        transaction
      });

      await transaction.commit();

      // Audit logging
      await AuditService.logAction({
        userId: auditUserId,
        action: AuditAction.CREATE,
        entityType: 'RolePermission',
        entityId: rolePermission.id,
        changes: {
          roleId,
          roleName: role.name,
          permissionId,
          permissionResource: permission.resource,
          permissionAction: permission.action
        }
      });

      logger.info(`Assigned permission ${permissionId} (${permission.resource}.${permission.action}) to role ${roleId} (${role.name}) by user ${auditUserId || 'SYSTEM'}`);
      return rolePermission;
    } catch (error) {
      await transaction.rollback();
      logger.error('Error assigning permission to role:', error);

      // Audit failed attempt
      await AuditService.logAction({
        userId: auditUserId,
        action: AuditAction.CREATE,
        entityType: 'RolePermission',
        changes: { roleId, permissionId },
        success: false,
        errorMessage: error instanceof Error ? error.message : 'Unknown error'
      });

      throw error;
    }
  }

  static async removePermissionFromRole(
    roleId: string,
    permissionId: string
  ): Promise<{ success: boolean }> {
    try {
      const deletedCount = await RolePermission.destroy({
        where: {
          roleId,
          permissionId
        }
      });

      if (deletedCount === 0) {
        throw new Error('Permission assignment not found');
      }

      logger.info(`Removed permission ${permissionId} from role ${roleId}`);
      return { success: true };
    } catch (error) {
      logger.error('Error removing permission from role:', error);
      throw error;
    }
  }

  private static async _createDefaultPermissions(transaction: any): Promise<Permission[]> {
    const permissionsData: CreatePermissionData[] = [
      // Student permissions
      { resource: 'students', action: 'read', description: 'View students' },
      { resource: 'students', action: 'create', description: 'Create students' },
      { resource: 'students', action: 'update', description: 'Update students' },
      { resource: 'students', action: 'delete', description: 'Delete students' },

      // Medication permissions
      { resource: 'medications', action: 'read', description: 'View medications' },
      { resource: 'medications', action: 'administer', description: 'Administer medications' },
      { resource: 'medications', action: 'manage', description: 'Manage medication inventory' },

      // Health records permissions
      { resource: 'health_records', action: 'read', description: 'View health records' },
      { resource: 'health_records', action: 'create', description: 'Create health records' },
      { resource: 'health_records', action: 'update', description: 'Update health records' },

      // Reports permissions
      { resource: 'reports', action: 'read', description: 'View reports' },
      { resource: 'reports', action: 'create', description: 'Create reports' },

      // Admin permissions
      { resource: 'users', action: 'manage', description: 'Manage users' },
      { resource: 'system', action: 'configure', description: 'Configure system' },
      { resource: 'security', action: 'manage', description: 'Manage security settings' }
    ];

    const permissions: Permission[] = [];
    for (const permData of permissionsData) {
      const permission = await Permission.create(permData, { transaction });
      permissions.push(permission);
    }
    logger.info(`Initialized ${permissions.length} default permissions`);
    return permissions;
  }

  // RBAC Operations (User Role Assignments)
  static async assignRoleToUser(
    userId: string,
    roleId: string,
    auditUserId?: string,
    bypassPrivilegeCheck: boolean = false
  ): Promise<UserRoleAssignment> {
    const transaction = await sequelize.transaction();

    try {
      // Verify target user exists
      const targetUser = await User.findByPk(userId, { transaction });
      if (!targetUser) {
        throw new Error('User not found');
      }

      // Verify role exists
      const role = await Role.findByPk(roleId, {
        include: [
          {
            model: RolePermission,
            as: 'permissions',
            include: [
              {
                model: Permission,
                as: 'permission'
              }
            ]
          }
        ],
        transaction
      });

      if (!role) {
        throw new Error('Role not found');
      }

      // Validation: Privilege escalation prevention
      if (!bypassPrivilegeCheck && auditUserId) {
        // Get assigning user's roles and permissions
        const assigningUserRoles = await this.getUserPermissions(auditUserId);

        // Check if assigning user has permission to manage users
        const canManageUsers = assigningUserRoles.permissions.some(
          p => p.resource === 'users' && p.action === 'manage'
        );

        if (!canManageUsers) {
          throw new Error('You do not have permission to assign roles to users');
        }

        // Prevent assigning higher-privilege roles
        // Check if the role being assigned has security or system management permissions
        const rolePermissions = role.permissions as any[] || [];
        const hasCriticalPermissions = rolePermissions.some((rp: any) => {
          const perm = rp.permission;
          return (perm.resource === 'security' && perm.action === 'manage') ||
                 (perm.resource === 'system' && perm.action === 'configure');
        });

        if (hasCriticalPermissions) {
          // Only users with security.manage can assign security-sensitive roles
          const canManageSecurity = assigningUserRoles.permissions.some(
            p => p.resource === 'security' && p.action === 'manage'
          );

          if (!canManageSecurity) {
            throw new Error('You do not have sufficient privileges to assign this role. Security management permission required.');
          }
        }
      }

      // Check if assignment already exists
      const existingAssignment = await UserRoleAssignment.findOne({
        where: {
          userId,
          roleId
        },
        transaction
      });

      if (existingAssignment) {
        throw new Error('Role already assigned to user');
      }

      const userRole = await UserRoleAssignment.create({
        userId,
        roleId
      }, { transaction });

      // Reload with associations
      await userRole.reload({
        include: [
          {
            model: Role,
            as: 'role',
            include: [
              {
                model: RolePermission,
                as: 'permissions',
                include: [
                  {
                    model: Permission,
                    as: 'permission'
                  }
                ]
              }
            ]
          }
        ],
        transaction
      });

      await transaction.commit();

      // Audit logging - Security-critical operation
      await AuditService.logAction({
        userId: auditUserId,
        action: AuditAction.CREATE,
        entityType: 'UserRoleAssignment',
        entityId: userRole.id,
        changes: {
          targetUserId: userId,
          targetUserEmail: targetUser.email,
          roleId,
          roleName: role.name,
          assignedBy: auditUserId || 'SYSTEM'
        }
      });

      // Log security incident if assigning high-privilege role
      const rolePermissions = role.permissions as any[] || [];
      const hasHighPrivilege = rolePermissions.some((rp: any) => {
        const perm = rp.permission;
        return perm.resource === 'security' || perm.resource === 'system';
      });

      if (hasHighPrivilege) {
        await SecurityIncident.create({
          type: SecurityIncidentType.POLICY_VIOLATION,
          severity: IncidentSeverity.LOW,
          description: `High-privilege role '${role.name}' assigned to user ${targetUser.email}`,
          affectedResources: [`user:${userId}`, `role:${roleId}`],
          detectedBy: auditUserId || 'SYSTEM',
          status: SecurityIncidentStatus.CLOSED,
          resolution: 'Role assignment completed successfully. Review for compliance.'
        });
      }

      logger.info(`Assigned role ${roleId} (${role.name}) to user ${userId} (${targetUser.email}) by user ${auditUserId || 'SYSTEM'}`);
      return userRole;
    } catch (error) {
      await transaction.rollback();
      logger.error('Error assigning role to user:', error);

      // Audit failed attempt - Security-critical
      await AuditService.logAction({
        userId: auditUserId,
        action: AuditAction.CREATE,
        entityType: 'UserRoleAssignment',
        changes: { userId, roleId },
        success: false,
        errorMessage: error instanceof Error ? error.message : 'Unknown error'
      });

      throw error;
    }
  }

  static async removeRoleFromUser(
    userId: string,
    roleId: string
  ): Promise<{ success: boolean }> {
    try {
      const deletedCount = await UserRoleAssignment.destroy({
        where: {
          userId,
          roleId
        }
      });

      if (deletedCount === 0) {
        throw new Error('Role assignment not found');
      }

      logger.info(`Removed role ${roleId} from user ${userId}`);
      return { success: true };
    } catch (error) {
      logger.error('Error removing role from user:', error);
      throw error;
    }
  }

  static async getUserPermissions(userId: string): Promise<UserPermissionsResult> {
    try {
      const userRoles = await UserRoleAssignment.findAll({
        where: { userId },
        include: [
          {
            model: Role,
            as: 'role',
            include: [
              {
                model: RolePermission,
                as: 'permissions',
                include: [
                  {
                    model: Permission,
                    as: 'permission'
                  }
                ]
              }
            ]
          }
        ]
      });

      // Extract roles
      const roles = userRoles.map(ur => ur.role!);

      // Flatten permissions from all roles
      const permissionsMap = new Map<string, Permission>();

      for (const userRole of userRoles) {
        if (userRole.role && userRole.role.permissions) {
          for (const rolePermission of userRole.role.permissions as any[]) {
            if (rolePermission.permission) {
              const perm = rolePermission.permission;
              permissionsMap.set(perm.id, perm);
            }
          }
        }
      }

      const permissions = Array.from(permissionsMap.values());

      logger.info(`Retrieved ${permissions.length} permissions for user ${userId}`);
      return {
        roles,
        permissions
      };
    } catch (error) {
      logger.error(`Error getting user permissions for ${userId}:`, error);
      throw error;
    }
  }

  static async checkPermission(
    userId: string,
    resource: string,
    action: string
  ): Promise<boolean> {
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

  // Session Management Operations
  static async createSession(data: CreateSessionData): Promise<Session> {
    try {
      const session = await Session.create({
        userId: data.userId,
        token: data.token,
        ipAddress: data.ipAddress,
        userAgent: data.userAgent,
        expiresAt: data.expiresAt,
        lastActivity: new Date()
      });

      logger.info(`Created session for user ${data.userId}`);
      return session;
    } catch (error) {
      logger.error('Error creating session:', error);
      throw error;
    }
  }

  static async getUserSessions(userId: string): Promise<Session[]> {
    try {
      const sessions = await Session.findAll({
        where: {
          userId,
          expiresAt: {
            [Op.gt]: new Date()
          }
        },
        order: [['createdAt', 'DESC']]
      });

      logger.info(`Retrieved ${sessions.length} active sessions for user ${userId}`);
      return sessions;
    } catch (error) {
      logger.error(`Error getting sessions for user ${userId}:`, error);
      throw error;
    }
  }

  static async updateSessionActivity(token: string): Promise<void> {
    try {
      const session = await Session.findOne({
        where: { token }
      });

      if (session) {
        await session.update({
          lastActivity: new Date()
        });
      }
    } catch (error) {
      logger.error('Error updating session activity:', error);
      // Don't throw - this is a background operation
    }
  }

  static async deleteSession(token: string): Promise<{ success: boolean }> {
    try {
      const deletedCount = await Session.destroy({
        where: { token }
      });

      if (deletedCount === 0) {
        throw new Error('Session not found');
      }

      logger.info('Session deleted');
      return { success: true };
    } catch (error) {
      logger.error('Error deleting session:', error);
      throw error;
    }
  }

  static async deleteAllUserSessions(userId: string): Promise<{ deleted: number }> {
    try {
      const deletedCount = await Session.destroy({
        where: { userId }
      });

      logger.info(`Deleted ${deletedCount} sessions for user ${userId}`);
      return { deleted: deletedCount };
    } catch (error) {
      logger.error(`Error deleting sessions for user ${userId}:`, error);
      throw error;
    }
  }

  static async cleanupExpiredSessions(): Promise<{ deleted: number }> {
    try {
      const deletedCount = await Session.destroy({
        where: {
          expiresAt: {
            [Op.lt]: new Date()
          }
        }
      });

      logger.info(`Cleaned up ${deletedCount} expired sessions`);
      return { deleted: deletedCount };
    } catch (error) {
      logger.error('Error cleaning up expired sessions:', error);
      throw error;
    }
  }

  // Login Attempt Tracking
  static async logLoginAttempt(data: LogLoginAttemptData): Promise<LoginAttempt | undefined> {
    try {
      const attempt = await LoginAttempt.create({
        email: data.email,
        success: data.success,
        ipAddress: data.ipAddress,
        userAgent: data.userAgent,
        failureReason: data.failureReason
      });

      logger.info(`Logged login attempt for ${data.email}: ${data.success ? 'success' : 'failure'}`);
      return attempt;
    } catch (error) {
      logger.error('Error logging login attempt:', error);
      // Don't throw - logging failures shouldn't break login
      return undefined;
    }
  }

  static async getFailedLoginAttempts(email: string, minutes: number = 15): Promise<LoginAttempt[]> {
    try {
      const since = new Date(Date.now() - minutes * 60 * 1000);

      const attempts = await LoginAttempt.findAll({
        where: {
          email,
          success: false,
          createdAt: {
            [Op.gte]: since
          }
        },
        order: [['createdAt', 'DESC']]
      });

      logger.info(`Retrieved ${attempts.length} failed login attempts for ${email}`);
      return attempts;
    } catch (error) {
      logger.error('Error getting failed login attempts:', error);
      throw error;
    }
  }

  // IP Restriction Management
  static async getIpRestrictions(): Promise<IpRestriction[]> {
    try {
      const restrictions = await IpRestriction.findAll({
        where: { isActive: true },
        order: [['createdAt', 'DESC']]
      });

      logger.info(`Retrieved ${restrictions.length} IP restrictions`);
      return restrictions;
    } catch (error) {
      logger.error('Error getting IP restrictions:', error);
      throw error;
    }
  }

  static async addIpRestriction(data: AddIpRestrictionData): Promise<IpRestriction> {
    try {
      // Check if restriction already exists for this IP
      const existingRestriction = await IpRestriction.findOne({
        where: {
          ipAddress: data.ipAddress,
          isActive: true
        }
      });

      if (existingRestriction) {
        throw new Error('IP restriction already exists for this address');
      }

      const restriction = await IpRestriction.create({
        ipAddress: data.ipAddress,
        type: data.type,
        reason: data.reason,
        isActive: true,
        createdBy: data.createdBy
      });

      logger.info(`Added IP restriction: ${data.ipAddress} (${data.type})`);
      return restriction;
    } catch (error) {
      logger.error('Error adding IP restriction:', error);
      throw error;
    }
  }

  static async removeIpRestriction(id: string): Promise<{ success: boolean }> {
    try {
      const restriction = await IpRestriction.findByPk(id);

      if (!restriction) {
        throw new Error('IP restriction not found');
      }

      await restriction.update({
        isActive: false
      });

      logger.info(`Removed IP restriction: ${id}`);
      return { success: true };
    } catch (error) {
      logger.error(`Error removing IP restriction ${id}:`, error);
      throw error;
    }
  }

  static async checkIpRestriction(ipAddress: string): Promise<IpRestrictionCheckResult> {
    try {
      const restriction = await IpRestriction.findOne({
        where: {
          ipAddress,
          isActive: true
        }
      });

      if (!restriction) {
        return { isRestricted: false };
      }

      const isRestricted = restriction.type === IpRestrictionType.BLACKLIST;

      return {
        isRestricted,
        type: restriction.type,
        reason: restriction.reason || undefined
      };
    } catch (error) {
      logger.error('Error checking IP restriction:', error);
      return { isRestricted: false };
    }
  }

  // Security Incident Management
  static async createSecurityIncident(data: CreateSecurityIncidentData): Promise<SecurityIncident> {
    try {
      const incident = await SecurityIncident.create({
        type: data.type,
        severity: data.severity,
        description: data.description,
        affectedResources: data.affectedResources || [],
        detectedBy: data.detectedBy,
        status: SecurityIncidentStatus.OPEN
      });

      logger.warn(`Security incident created: ${incident.id} - ${data.type}`);
      return incident;
    } catch (error) {
      logger.error('Error creating security incident:', error);
      throw error;
    }
  }

  static async updateSecurityIncident(
    id: string,
    data: UpdateSecurityIncidentData
  ): Promise<SecurityIncident> {
    try {
      const incident = await SecurityIncident.findByPk(id);

      if (!incident) {
        throw new Error('Security incident not found');
      }

      const updateData: any = {};

      if (data.status) {
        updateData.status = data.status;
      }

      if (data.resolution) {
        updateData.resolution = data.resolution;
      }

      if (data.resolvedBy) {
        updateData.resolvedBy = data.resolvedBy;
      }

      // Automatically set resolvedAt when status changes to RESOLVED
      if (data.status === SecurityIncidentStatus.RESOLVED && !incident.resolvedAt) {
        updateData.resolvedAt = new Date();
      }

      await incident.update(updateData);

      logger.info(`Updated security incident: ${id}`);
      return incident;
    } catch (error) {
      logger.error(`Error updating security incident ${id}:`, error);
      throw error;
    }
  }

  static async getSecurityIncidents(
    page: number = 1,
    limit: number = 20,
    filters: SecurityIncidentFilters = {}
  ): Promise<{
    incidents: SecurityIncident[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  }> {
    try {
      const offset = (page - 1) * limit;
      const whereClause: any = {};

      if (filters.type) {
        whereClause.type = filters.type;
      }

      if (filters.severity) {
        whereClause.severity = filters.severity;
      }

      if (filters.status) {
        whereClause.status = filters.status;
      }

      const { rows: incidents, count: total } = await SecurityIncident.findAndCountAll({
        where: whereClause,
        offset,
        limit,
        order: [['createdAt', 'DESC']]
      });

      logger.info(`Retrieved ${incidents.length} security incidents`);

      return {
        incidents,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      logger.error('Error getting security incidents:', error);
      throw error;
    }
  }

  // Security Statistics and Monitoring
  static async getSecurityStatistics(): Promise<SecurityStatistics> {
    try {
      const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);

      const [
        totalIncidents,
        openIncidents,
        criticalIncidents,
        recentFailedLogins,
        activeSessions,
        activeIpRestrictions
      ] = await Promise.all([
        SecurityIncident.count(),
        SecurityIncident.count({
          where: { status: SecurityIncidentStatus.OPEN }
        }),
        SecurityIncident.count({
          where: {
            severity: IncidentSeverity.CRITICAL,
            status: {
              [Op.ne]: SecurityIncidentStatus.CLOSED
            }
          }
        }),
        LoginAttempt.count({
          where: {
            success: false,
            createdAt: {
              [Op.gte]: last24Hours
            }
          }
        }),
        Session.count({
          where: {
            expiresAt: {
              [Op.gt]: new Date()
            }
          }
        }),
        IpRestriction.count({
          where: { isActive: true }
        })
      ]);

      const statistics: SecurityStatistics = {
        incidents: {
          total: totalIncidents,
          open: openIncidents,
          critical: criticalIncidents
        },
        authentication: {
          recentFailedLogins,
          activeSessions
        },
        ipRestrictions: activeIpRestrictions
      };

      logger.info('Retrieved security statistics');
      return statistics;
    } catch (error) {
      logger.error('Error getting security statistics:', error);
      throw error;
    }
  }

  // System Initialization
  static async initializeDefaultRoles(): Promise<void> {
    const transaction = await sequelize.transaction();

    try {
      // Check if roles already exist
      const existingRolesCount = await Role.count({ transaction });
      if (existingRolesCount > 0) {
        logger.info('Roles already initialized');
        await transaction.rollback();
        return;
      }

      const permissions = await this._createDefaultPermissions(transaction);

      // Create default roles
      const nurseRole = await Role.create(
        {
          name: 'Nurse',
          description: 'School nurse with full access to student health management',
          isSystem: true
        },
        { transaction }
      );

      const adminRole = await Role.create(
        {
          name: 'Administrator',
          description: 'System administrator with full access',
          isSystem: true
        },
        { transaction }
      );

      // Assign permissions to nurse role
      const nursePermissions = permissions.filter(p =>
        ['students', 'medications', 'health_records', 'reports'].includes(p.resource)
      );

      for (const permission of nursePermissions) {
        await RolePermission.create(
          {
            roleId: nurseRole.id,
            permissionId: permission.id
          },
          { transaction }
        );
      }

      // Assign all permissions to admin role
      for (const permission of permissions) {
        await RolePermission.create(
          {
            roleId: adminRole.id,
            permissionId: permission.id
          },
          { transaction }
        );
      }

      await transaction.commit();
      logger.info('Initialized default roles and permissions successfully');
    } catch (error) {
      await transaction.rollback();
      logger.error('Error initializing default roles:', error);
      throw error;
    }
  }
}
