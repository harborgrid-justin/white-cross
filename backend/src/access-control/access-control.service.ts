import { BadRequestException, Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectConnection } from '@nestjs/sequelize';
import { Op, Sequelize } from 'sequelize';
import { AuditService } from '../database/services/audit.service';
import { ExecutionContext } from '../database/types/execution-context.interface';
import { PermissionCacheService } from './services/permission-cache.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { CreateSessionDto } from './dto/create-session.dto';
import { LogLoginAttemptDto } from './dto/log-login-attempt.dto';
import { AccessControlCreateIpRestrictionDto, IpRestrictionType } from './dto/create-ip-restriction.dto';
import {
  AccessControlCreateIncidentDto,
  IncidentSeverity,
  SecurityIncidentType,
} from './dto/create-security-incident.dto';
import { IpRestrictionCheckResult, SecurityStatistics, UserPermissionsResult } from './interfaces';
import {
  IpRestrictionInstance,
  LoginAttemptInstance,
  PaginationResult,
  PermissionInstance,
  PermissionModel,
  RoleModel,
  RolePermissionInstance,
  RolePermissionModel,
  RoleUpdateData,
  RoleWithPermissions,
  SecurityIncidentFilters,
  SecurityIncidentInstance,
  SecurityIncidentUpdateData,
  SecurityIncidentWhereClause,
  SequelizeModelClass,
  SessionInstance,
  UserRoleAssignmentModel,
} from './types';

/**
 * NOTE: This service requires the following Sequelize models to be available:
 * - Role (from backend/src/database/models/security/Role.ts)
 * - Permission (from backend/src/database/models/security/Permission.ts)
 * - RolePermission (from backend/src/database/models/security/RolePermission.ts)
 * - UserRoleAssignment (from backend/src/database/models/security/UserRoleAssignment.ts)
 * - Session (from backend/src/database/models/security/Session.ts)
 * - LoginAttempt (from backend/src/database/models/security/LoginAttempt.ts)
 * - IpRestriction (from backend/src/database/models/security/IpRestriction.ts)
 * - SecurityIncident (from backend/src/database/models/security/SecurityIncident.ts)
 * - User (from backend/src/database/models/core/User.ts)
 *
 * These models should be registered in the DatabaseModule and made available
 * through Sequelize's model registry.
 */

// Security incident status enum
enum SecurityIncidentStatus {
  OPEN = 'OPEN',
  INVESTIGATING = 'INVESTIGATING',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED',
}

/**
 * Access Control Service
 *
 * Comprehensive RBAC implementation with:
 * - Role management
 * - Permission management
 * - User role assignments with privilege escalation prevention
 * - Session management
 * - Login attempt tracking
 * - IP restriction management
 * - Security incident management
 */
@Injectable()
export class AccessControlService {
  private readonly logger = new Logger(AccessControlService.name);

  constructor(
    @InjectConnection() private readonly sequelize: Sequelize,
    @Inject('IAuditLogger') private readonly auditService: AuditService,
    private readonly cacheService: PermissionCacheService,
  ) {}

  /**
   * Get Sequelize models dynamically
   */
  private getModel<T>(modelName: string): SequelizeModelClass<T> {
    return this.sequelize.models[modelName];
  }

  // ============================================================================
  // ROLE MANAGEMENT
  // ============================================================================

  /**
   * Get all roles with their permissions and user assignments
   */
  async getRoles(): Promise<RoleWithPermissions[]> {
    try {
      const Role = this.getModel('Role');
      const roles = await Role.findAll({
        include: [
          {
            model: this.getModel('RolePermission'),
            as: 'permissions',
            include: [
              {
                model: this.getModel('Permission'),
                as: 'permission',
              },
            ],
          },
          {
            model: this.getModel('UserRoleAssignment'),
            as: 'userRoles',
          },
        ],
        order: [['name', 'ASC']],
      });

      this.logger.log(`Retrieved ${roles.length} roles`);
      return roles;
    } catch (error) {
      this.logger.error('Error getting roles:', error);
      throw error;
    }
  }

  /**
   * Get role by ID with permissions and user assignments
   */
  async getRoleById(id: string): Promise<RoleWithPermissions> {
    try {
      const Role = this.getModel('Role');
      const role = await Role.findByPk(id, {
        include: [
          {
            model: this.getModel('RolePermission'),
            as: 'permissions',
            include: [
              {
                model: this.getModel('Permission'),
                as: 'permission',
              },
            ],
          },
          {
            model: this.getModel('UserRoleAssignment'),
            as: 'userRoles',
          },
        ],
      });

      if (!role) {
        throw new NotFoundException('Role not found');
      }

      this.logger.log(`Retrieved role: ${id}`);
      return role;
    } catch (error) {
      this.logger.error(`Error getting role ${id}:`, error);
      throw error;
    }
  }

  /**
   * Create a new role with validation and audit logging
   */
  async createRole(data: CreateRoleDto, auditUserId?: string): Promise<RoleWithPermissions> {
    const transaction = await this.sequelize.transaction();

    try {
      const Role = this.getModel('Role');

      // Check for duplicate role name (case-insensitive)
      const existingRole = await Role.findOne({
        where: this.sequelize.where(
          this.sequelize.fn('LOWER', this.sequelize.col('name')),
          this.sequelize.fn('LOWER', data.name),
        ),
        transaction,
      });

      if (existingRole) {
        throw new BadRequestException(
          `Role with name '${data.name}' already exists`,
        );
      }

      // Create role
      const role = await Role.create(
        {
          name: data.name.trim(),
          description: data.description?.trim(),
          isSystem: false,
        },
        { transaction },
      );

      // Reload with associations
      await role.reload({
        include: [
          {
            model: this.getModel('RolePermission'),
            as: 'permissions',
            include: [
              {
                model: this.getModel('Permission'),
                as: 'permission',
              },
            ],
          },
        ],
        transaction,
      });

      await transaction.commit();

      // Invalidate cache for all users since new role created
      this.cacheService.invalidateAllUserPermissions();

      await this.auditService.logCreate(
        'Role',
        role.id,
        {
          userId: auditUserId || null,
          userName: auditUserId ? 'User' : 'SYSTEM',
          userRole: 'SYSTEM' as 'SYSTEM',
          ipAddress: null,
          userAgent: null,
          timestamp: new Date(),
        } as ExecutionContext,
        role,
      );

      this.logger.log(
        `Created role: ${role.id} (${role.name}) by user ${auditUserId || 'SYSTEM'}`,
      );
      return role;
    } catch (error) {
      await transaction.rollback();
      this.logger.error('Error creating role:', error);
      throw error;
    }
  }

  /**
   * Update role with validation and audit logging
   */
  async updateRole(
    id: string,
    data: UpdateRoleDto,
    auditUserId?: string,
  ): Promise<any> {
    const transaction = await this.sequelize.transaction();

    try {
      const Role = this.getModel('Role');
      const role = await Role.findByPk(id, { transaction });

      if (!role) {
        throw new NotFoundException('Role not found');
      }

      // Prevent modification of system roles
      if (role.isSystem) {
        throw new BadRequestException('Cannot modify system roles');
      }

      // Store original values for audit trail
      const originalValues = {
        name: role.name,
        description: role.description,
      };

      // Check for duplicate name if name is being changed
      if (data.name && data.name.trim() !== role.name) {
        const trimmedName = data.name.trim();

        const existingRole = await Role.findOne({
          where: {
            id: { [Op.ne]: id },
            [Op.and]: this.sequelize.where(
              this.sequelize.fn('LOWER', this.sequelize.col('name')),
              this.sequelize.fn('LOWER', trimmedName),
            ),
          },
          transaction,
        });

        if (existingRole) {
          throw new BadRequestException(
            `Role with name '${trimmedName}' already exists`,
          );
        }
      }

      // Prepare update data
      const updateData: RoleUpdateData = {};
      if (data.name) updateData.name = data.name.trim();
      if (data.description !== undefined)
        updateData.description = data.description?.trim();

      await role.update(updateData, { transaction });

      // Reload with associations
      await role.reload({
        include: [
          {
            model: this.getModel('RolePermission'),
            as: 'permissions',
            include: [
              {
                model: this.getModel('Permission'),
                as: 'permission',
              },
            ],
          },
        ],
        transaction,
      });

      await transaction.commit();

      // Invalidate cache for all users since role changed
      this.cacheService.invalidateAllUserPermissions();

      // Audit logging
      const changes: Record<string, { before: unknown; after: unknown }> = {};
      if (data.name && data.name !== originalValues.name) {
        changes.name = { before: originalValues.name, after: data.name };
      }
      if (
        data.description !== undefined &&
        data.description !== originalValues.description
      ) {
        changes.description = {
          before: originalValues.description,
          after: data.description,
        };
      }

      await this.auditService.logUpdate(
        'Role',
        id,
        {
          userId: auditUserId || null,
          userName: auditUserId ? 'User' : 'SYSTEM',
          userRole: 'SYSTEM' as 'SYSTEM',
          ipAddress: null,
          userAgent: null,
          timestamp: new Date(),
        } as ExecutionContext,
        changes,
      );

      this.logger.log(`Updated role: ${id} by user ${auditUserId || 'SYSTEM'}`);
      return role;
    } catch (error) {
      await transaction.rollback();
      this.logger.error(`Error updating role ${id}:`, error);
      throw error;
    }
  }

  /**
   * Delete role with validation and audit logging
   */
  async deleteRole(
    id: string,
    auditUserId?: string,
  ): Promise<{ success: boolean }> {
    const transaction = await this.sequelize.transaction();

    try {
      const Role = this.getModel('Role');
      const UserRoleAssignment = this.getModel('UserRoleAssignment');

      const role = await Role.findByPk(id, {
        include: [
          {
            model: UserRoleAssignment,
            as: 'userRoles',
          },
        ],
        transaction,
      });

      if (!role) {
        throw new NotFoundException('Role not found');
      }

      // Prevent deletion of system roles
      if (role.isSystem) {
        throw new BadRequestException('Cannot delete system role');
      }

      // Check if role is assigned to users
      const assignedUsers = await UserRoleAssignment.count({
        where: { roleId: id },
        transaction,
      });

      if (assignedUsers > 0) {
        throw new BadRequestException(
          `Cannot delete role: It is currently assigned to ${assignedUsers} user(s). Remove all user assignments first.`,
        );
      }

      // Store role data for audit trail
      const roleData = {
        id: role.id,
        name: role.name,
        description: role.description,
        isSystem: role.isSystem,
      };

      await role.destroy({ transaction });
      await transaction.commit();

      // Invalidate cache for all users since role deleted
      this.cacheService.invalidateAllUserPermissions();

      await this.auditService.logDelete(
        'Role',
        id,
        {
          userId: auditUserId || null,
          userName: auditUserId ? 'User' : 'SYSTEM',
          userRole: 'SYSTEM' as 'SYSTEM',
          ipAddress: null,
          userAgent: null,
          timestamp: new Date(),
        } as ExecutionContext,
        roleData,
      );

      this.logger.log(
        `Deleted role: ${id} (${roleData.name}) by user ${auditUserId || 'SYSTEM'}`,
      );
      return { success: true };
    } catch (error) {
      await transaction.rollback();
      this.logger.error(`Error deleting role ${id}:`, error);
      throw error;
    }
  }

  // ============================================================================
  // PERMISSION MANAGEMENT
  // ============================================================================

  /**
   * Get all permissions ordered by resource and action
   */
  async getPermissions(): Promise<PermissionInstance[]> {
    try {
      const Permission = this.getModel('Permission');
      const permissions = await Permission.findAll({
        order: [
          ['resource', 'ASC'],
          ['action', 'ASC'],
        ],
      });

      this.logger.log(`Retrieved ${permissions.length} permissions`);
      return permissions;
    } catch (error) {
      this.logger.error('Error getting permissions:', error);
      throw error;
    }
  }

  /**
   * Create a new permission
   */
  async createPermission(data: CreatePermissionDto): Promise<PermissionInstance> {
    try {
      const Permission = this.getModel('Permission');
      const permission = await Permission.create({
        resource: data.resource,
        action: data.action,
        description: data.description,
      });

      this.logger.log(`Created permission: ${permission.id}`);
      return permission;
    } catch (error) {
      this.logger.error('Error creating permission:', error);
      throw error;
    }
  }

  /**
   * Assign permission to role with validation and audit logging
   */
  async assignPermissionToRole(
    roleId: string,
    permissionId: string,
    auditUserId?: string,
  ): Promise<RolePermissionInstance> {
    const transaction = await this.sequelize.transaction();

    try {
      const Role = this.getModel('Role');
      const Permission = this.getModel('Permission');
      const RolePermission = this.getModel('RolePermission');

      // Verify role and permission exist
      const [role, permission] = await Promise.all([
        Role.findByPk(roleId, { transaction }),
        Permission.findByPk(permissionId, { transaction }),
      ]);

      if (!role) {
        throw new NotFoundException('Role not found');
      }

      if (!permission) {
        throw new NotFoundException('Permission not found');
      }

      // Prevent modification of system role permissions
      if (role.isSystem) {
        throw new BadRequestException(
          'Cannot modify permissions of system roles',
        );
      }

      // Check if assignment already exists
      const existingAssignment = await RolePermission.findOne({
        where: {
          roleId,
          permissionId,
        },
        transaction,
      });

      if (existingAssignment) {
        throw new BadRequestException('Permission already assigned to role');
      }

      const rolePermission = await RolePermission.create(
        {
          roleId,
          permissionId,
        },
        { transaction },
      );

      // Reload with associations
      await rolePermission.reload({
        include: [
          {
            model: Role,
            as: 'role',
          },
          {
            model: Permission,
            as: 'permission',
          },
        ],
        transaction,
      });

      await transaction.commit();

      // Invalidate role permissions cache
      this.cacheService.invalidateRolePermissions(roleId);

      await this.auditService.logCreate(
        'RolePermission',
        rolePermission.id,
        {
          userId: auditUserId || null,
          userName: auditUserId ? 'User' : 'SYSTEM',
          userRole: 'SYSTEM' as 'SYSTEM',
          ipAddress: null,
          userAgent: null,
          timestamp: new Date(),
        } as ExecutionContext,
        rolePermission,
      );

      this.logger.log(
        `Assigned permission ${permissionId} (${permission.resource}.${permission.action}) to role ${roleId} (${role.name}) by user ${auditUserId || 'SYSTEM'}`,
      );
      return rolePermission;
    } catch (error) {
      await transaction.rollback();
      this.logger.error('Error assigning permission to role:', error);
      throw error;
    }
  }

  /**
   * Remove permission from role with audit logging
   */
  async removePermissionFromRole(
    roleId: string,
    permissionId: string,
    auditUserId?: string,
  ): Promise<{ success: boolean }> {
    const transaction = await this.sequelize.transaction();

    try {
      const Role = this.getModel('Role');
      const Permission = this.getModel('Permission');
      const RolePermission = this.getModel('RolePermission');

      // Get role and permission details for audit logging
      const [role, permission] = await Promise.all([
        Role.findByPk(roleId, { transaction }),
        Permission.findByPk(permissionId, { transaction }),
      ]);

      const deletedCount = await RolePermission.destroy({
        where: {
          roleId,
          permissionId,
        },
        transaction,
      });

      if (deletedCount === 0) {
        throw new NotFoundException('Permission assignment not found');
      }

      await transaction.commit();

      // Invalidate role permissions cache
      this.cacheService.invalidateRolePermissions(roleId);

      // Audit logging
      if (role && permission) {
        await this.auditService.logDelete(
          'RolePermission',
          `${roleId}:${permissionId}`,
          {
            userId: auditUserId || null,
            userName: auditUserId ? 'User' : 'SYSTEM',
            userRole: 'SYSTEM' as 'SYSTEM',
            ipAddress: null,
            userAgent: null,
            timestamp: new Date(),
          } as ExecutionContext,
          { roleId, permissionId },
        );
      }

      this.logger.log(
        `Removed permission ${permissionId} from role ${roleId} by user ${auditUserId || 'SYSTEM'}`,
      );
      return { success: true };
    } catch (error) {
      await transaction.rollback();
      this.logger.error('Error removing permission from role:', error);
      throw error;
    }
  }

  // ============================================================================
  // RBAC OPERATIONS (User Role Assignments)
  // ============================================================================

  /**
   * Assign role to user with privilege escalation prevention and audit logging
   */
  async assignRoleToUser(
    userId: string,
    roleId: string,
    auditUserId?: string,
    bypassPrivilegeCheck: boolean = false,
  ): Promise<any> {
    const transaction = await this.sequelize.transaction();

    try {
      const User = this.getModel('User');
      const Role = this.getModel('Role');
      const UserRoleAssignment = this.getModel('UserRoleAssignment');
      const SecurityIncident = this.getModel('SecurityIncident');

      // Verify target user exists
      const targetUser = await User.findByPk(userId, { transaction });
      if (!targetUser) {
        throw new NotFoundException('User not found');
      }

      // Verify role exists
      const role = await Role.findByPk(roleId, {
        include: [
          {
            model: this.getModel('RolePermission'),
            as: 'permissions',
            include: [
              {
                model: this.getModel('Permission'),
                as: 'permission',
              },
            ],
          },
        ],
        transaction,
      });

      if (!role) {
        throw new NotFoundException('Role not found');
      }

      // Privilege escalation prevention
      if (!bypassPrivilegeCheck && auditUserId) {
        const assigningUserPermissions =
          await this.getUserPermissions(auditUserId);

        // Check if assigning user has permission to manage users
        const canManageUsers = assigningUserPermissions.permissions.some(
          (p: PermissionModel) => p.resource === 'users' && p.action === 'manage',
        );

        if (!canManageUsers) {
          throw new BadRequestException(
            'You do not have permission to assign roles to users',
          );
        }

        // Prevent assigning higher-privilege roles
        const rolePermissions = role.permissions || [];
        const hasCriticalPermissions = rolePermissions.some((rp: RolePermissionModel) => {
          const perm = rp.permission;
          return (
            (perm.resource === 'security' && perm.action === 'manage') ||
            (perm.resource === 'system' && perm.action === 'configure')
          );
        });

        if (hasCriticalPermissions) {
          const canManageSecurity = assigningUserPermissions.permissions.some(
            (p: PermissionModel) => p.resource === 'security' && p.action === 'manage',
          );

          if (!canManageSecurity) {
            throw new BadRequestException(
              'You do not have sufficient privileges to assign this role. Security management permission required.',
            );
          }
        }
      }

      // Check if assignment already exists
      const existingAssignment = await UserRoleAssignment.findOne({
        where: {
          userId,
          roleId,
        },
        transaction,
      });

      if (existingAssignment) {
        throw new BadRequestException('Role already assigned to user');
      }

      const userRole = await UserRoleAssignment.create(
        {
          userId,
          roleId,
        },
        { transaction },
      );

      // Reload with associations
      await userRole.reload({
        include: [
          {
            model: Role,
            as: 'role',
            include: [
              {
                model: this.getModel('RolePermission'),
                as: 'permissions',
                include: [
                  {
                    model: this.getModel('Permission'),
                    as: 'permission',
                  },
                ],
              },
            ],
          },
        ],
        transaction,
      });

      await transaction.commit();

      // Invalidate user permissions cache
      this.cacheService.invalidateUserPermissions(userId);

      // Check if this is a high-privilege role
      const rolePermissions = role.permissions || [];
      const hasHighPrivilege = rolePermissions.some((rp: RolePermissionModel) => {
        const perm = rp.permission;
        return perm.resource === 'security' || perm.resource === 'system';
      });

      // @ts-expect-error - AuditService types need refinement
      this.auditService.logCreate(
        'UserRoleAssignment',
        userRole.id,
        {
          userId: auditUserId || null,
          userName: auditUserId ? 'User' : 'SYSTEM',
          userRole: 'SYSTEM' as 'SYSTEM',
          ipAddress: null,
          userAgent: null,
          timestamp: new Date(),
        },
        {
          targetUserId: userId,
          targetUserEmail: targetUser.email,
          roleId,
          roleName: role.name,
          isHighPrivilege: hasHighPrivilege,
        },
      );

      // Log security incident if assigning high-privilege role

      if (hasHighPrivilege) {
        await SecurityIncident.create({
          type: SecurityIncidentType.POLICY_VIOLATION,
          severity: IncidentSeverity.LOW,
          description: `High-privilege role '${role.name}' assigned to user ${targetUser.email}`,
          affectedResources: [`user:${userId}`, `role:${roleId}`],
          detectedBy: auditUserId || 'SYSTEM',
          status: SecurityIncidentStatus.CLOSED,
          resolution:
            'Role assignment completed successfully. Review for compliance.',
        });
      }

      this.logger.log(
        `Assigned role ${roleId} (${role.name}) to user ${userId} (${targetUser.email}) by user ${auditUserId || 'SYSTEM'}`,
      );
      return userRole;
    } catch (error) {
      await transaction.rollback();
      this.logger.error('Error assigning role to user:', error);
      throw error;
    }
  }

  /**
   * Remove role from user with cache invalidation
   */
  async removeRoleFromUser(
    userId: string,
    roleId: string,
  ): Promise<{ success: boolean }> {
    try {
      const UserRoleAssignment = this.getModel('UserRoleAssignment');
      const deletedCount = await UserRoleAssignment.destroy({
        where: {
          userId,
          roleId,
        },
      });

      if (deletedCount === 0) {
        throw new NotFoundException('Role assignment not found');
      }

      // Invalidate user permissions cache
      this.cacheService.invalidateUserPermissions(userId);

      this.logger.log(`Removed role ${roleId} from user ${userId}`);
      return { success: true };
    } catch (error) {
      this.logger.error('Error removing role from user:', error);
      throw error;
    }
  }

  /**
   * Get user roles and permissions with caching and audit logging
   */
  async getUserPermissions(
    userId: string,
    bypassCache: boolean = false,
  ): Promise<UserPermissionsResult> {
    try {
      // Check cache first
      if (!bypassCache) {
        const cached = this.cacheService.getUserPermissions(userId);
        if (cached) {
          this.logger.debug(`Using cached permissions for user ${userId}`);
          return cached;
        }
      }

      const UserRoleAssignment = this.getModel('UserRoleAssignment');
      const userRoles = await UserRoleAssignment.findAll({
        where: { userId },
        include: [
          {
            model: this.getModel('Role'),
            as: 'role',
            include: [
              {
                model: this.getModel('RolePermission'),
                as: 'permissions',
                include: [
                  {
                    model: this.getModel('Permission'),
                    as: 'permission',
                  },
                ],
              },
            ],
          },
        ],
      });

      // Extract roles
      const roles = userRoles.map((ur: UserRoleAssignmentModel) => ur.role).filter((r: RoleModel | undefined): r is RoleModel => !!r);

      // Flatten permissions from all roles
      const permissionsMap = new Map<string, PermissionModel>();

      for (const userRole of userRoles) {
        if (userRole.role && userRole.role.permissions) {
          for (const rolePermission of userRole.role.permissions) {
            if (rolePermission.permission) {
              const perm = rolePermission.permission;
              permissionsMap.set(perm.id, perm);
            }
          }
        }
      }

      const permissions = Array.from(permissionsMap.values());

      const result: UserPermissionsResult = {
        roles,
        permissions,
      };

      // Cache the result
      this.cacheService.setUserPermissions(userId, result);

      // Audit logging for permission retrieval
      await this.auditService.logRead('UserPermissions', userId, {
        userId: userId,
        userName: 'User',
        userRole: 'USER' as 'USER',
        ipAddress: null,
        userAgent: null,
        timestamp: new Date(),
      } as ExecutionContext);

      this.logger.log(
        `Retrieved ${permissions.length} permissions for user ${userId}`,
      );
      return result;
    } catch (error) {
      this.logger.error(`Error getting user permissions for ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Check if user has a specific permission with audit logging
   */
  async checkPermission(
    userId: string,
    resource: string,
    action: string,
  ): Promise<boolean> {
    try {
      const userPermissions = await this.getUserPermissions(userId);

      const hasPermission = userPermissions.permissions.some(
        (p: PermissionModel) => p.resource === resource && p.action === action,
      );

      // Audit logging for permission checks
      await this.auditService.logRead('Permission', `${resource}:${action}`, {
        userId: userId,
        userName: 'User',
        userRole: 'USER' as 'USER',
        ipAddress: null,
        userAgent: null,
        timestamp: new Date(),
      } as ExecutionContext);

      this.logger.log(
        `Permission check for user ${userId} on ${resource}.${action}: ${hasPermission}`,
      );
      return hasPermission;
    } catch (error) {
      this.logger.error('Error checking permission:', error);
      return false;
    }
  }

  // ============================================================================
  // SESSION MANAGEMENT
  // ============================================================================

  /**
   * Create a new session
   */
  async createSession(data: CreateSessionDto): Promise<SessionInstance> {
    try {
      const Session = this.getModel('Session');
      const session = await Session.create({
        userId: data.userId,
        token: data.token,
        ipAddress: data.ipAddress,
        userAgent: data.userAgent,
        expiresAt: data.expiresAt,
        lastActivity: new Date(),
      });

      this.logger.log(`Created session for user ${data.userId}`);
      return session;
    } catch (error) {
      this.logger.error('Error creating session:', error);
      throw error;
    }
  }

  /**
   * Get user sessions (only active ones)
   */
  async getUserSessions(userId: string): Promise<SessionInstance[]> {
    try {
      const Session = this.getModel('Session');
      const sessions = await Session.findAll({
        where: {
          userId,
          expiresAt: {
            [Op.gt]: new Date(),
          },
        },
        order: [['createdAt', 'DESC']],
      });

      this.logger.log(
        `Retrieved ${sessions.length} active sessions for user ${userId}`,
      );
      return sessions;
    } catch (error) {
      this.logger.error(`Error getting sessions for user ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Update session activity timestamp with audit logging
   */
  async updateSessionActivity(
    token: string,
    ipAddress?: string,
  ): Promise<void> {
    try {
      const Session = this.getModel('Session');
      const session = await Session.findOne({
        where: { token },
      });

      if (session) {
        await session.update({
          lastActivity: new Date(),
        });

        // Audit logging for session activity
        await this.auditService.logUpdate(
          'Session',
          session.id,
          {
            userId: session.userId,
            userName: 'User',
            userRole: 'USER' as 'USER',
            ipAddress: ipAddress || session.ipAddress,
            userAgent: session.userAgent,
            timestamp: new Date(),
          } as ExecutionContext,
          { lastActivity: { before: session.lastActivity, after: new Date() } },
        );
      }
    } catch (error) {
      this.logger.error('Error updating session activity:', error);
      // Don't throw - this is a background operation
    }
  }

  /**
   * Delete session
   */
  async deleteSession(token: string): Promise<{ success: boolean }> {
    try {
      const Session = this.getModel('Session');
      const deletedCount = await Session.destroy({
        where: { token },
      });

      if (deletedCount === 0) {
        throw new NotFoundException('Session not found');
      }

      this.logger.log('Session deleted');
      return { success: true };
    } catch (error) {
      this.logger.error('Error deleting session:', error);
      throw error;
    }
  }

  /**
   * Delete all user sessions
   */
  async deleteAllUserSessions(userId: string): Promise<{ deleted: number }> {
    try {
      const Session = this.getModel('Session');
      const deletedCount = await Session.destroy({
        where: { userId },
      });

      this.logger.log(`Deleted ${deletedCount} sessions for user ${userId}`);
      return { deleted: deletedCount };
    } catch (error) {
      this.logger.error(`Error deleting sessions for user ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Cleanup expired sessions
   */
  async cleanupExpiredSessions(): Promise<{ deleted: number }> {
    try {
      const Session = this.getModel('Session');
      const deletedCount = await Session.destroy({
        where: {
          expiresAt: {
            [Op.lt]: new Date(),
          },
        },
      });

      this.logger.log(`Cleaned up ${deletedCount} expired sessions`);
      return { deleted: deletedCount };
    } catch (error) {
      this.logger.error('Error cleaning up expired sessions:', error);
      throw error;
    }
  }

  // ============================================================================
  // LOGIN ATTEMPT TRACKING
  // ============================================================================

  /**
   * Log a login attempt
   */
  async logLoginAttempt(data: LogLoginAttemptDto): Promise<LoginAttemptInstance | undefined> {
    try {
      const LoginAttempt = this.getModel('LoginAttempt');
      const attempt = await LoginAttempt.create({
        email: data.email,
        success: data.success,
        ipAddress: data.ipAddress,
        userAgent: data.userAgent,
        failureReason: data.failureReason,
      });

      this.logger.log(
        `Logged login attempt for ${data.email}: ${data.success ? 'success' : 'failure'}`,
      );
      return attempt;
    } catch (error) {
      this.logger.error('Error logging login attempt:', error);
      // Don't throw - logging failures shouldn't break login
      return undefined;
    }
  }

  /**
   * Get failed login attempts within a time window
   */
  async getFailedLoginAttempts(
    email: string,
    minutes: number = 15,
  ): Promise<any[]> {
    try {
      const LoginAttempt = this.getModel('LoginAttempt');
      const since = new Date(Date.now() - minutes * 60 * 1000);

      const attempts = await LoginAttempt.findAll({
        where: {
          email,
          success: false,
          createdAt: {
            [Op.gte]: since,
          },
        },
        order: [['createdAt', 'DESC']],
      });

      this.logger.log(
        `Retrieved ${attempts.length} failed login attempts for ${email}`,
      );
      return attempts;
    } catch (error) {
      this.logger.error('Error getting failed login attempts:', error);
      throw error;
    }
  }

  // ============================================================================
  // IP RESTRICTION MANAGEMENT
  // ============================================================================

  /**
   * Get all active IP restrictions
   */
  async getIpRestrictions(): Promise<IpRestrictionInstance[]> {
    try {
      const IpRestriction = this.getModel('IpRestriction');
      const restrictions = await IpRestriction.findAll({
        where: { isActive: true },
        order: [['createdAt', 'DESC']],
      });

      this.logger.log(`Retrieved ${restrictions.length} IP restrictions`);
      return restrictions;
    } catch (error) {
      this.logger.error('Error getting IP restrictions:', error);
      throw error;
    }
  }

  /**
   * Add IP restriction
   */
  async addIpRestriction(
    data: AccessControlCreateIpRestrictionDto,
  ): Promise<any> {
    try {
      const IpRestriction = this.getModel('IpRestriction');

      // Check if restriction already exists for this IP
      const existingRestriction = await IpRestriction.findOne({
        where: {
          ipAddress: data.ipAddress,
          isActive: true,
        },
      });

      if (existingRestriction) {
        throw new BadRequestException(
          'IP restriction already exists for this address',
        );
      }

      const restriction = await IpRestriction.create({
        ipAddress: data.ipAddress,
        type: data.type,
        reason: data.reason,
        isActive: true,
        createdBy: data.createdBy,
      });

      this.logger.log(`Added IP restriction: ${data.ipAddress} (${data.type})`);
      return restriction;
    } catch (error) {
      this.logger.error('Error adding IP restriction:', error);
      throw error;
    }
  }

  /**
   * Remove IP restriction (soft delete)
   */
  async removeIpRestriction(id: string): Promise<{ success: boolean }> {
    try {
      const IpRestriction = this.getModel('IpRestriction');
      const restriction = await IpRestriction.findByPk(id);

      if (!restriction) {
        throw new NotFoundException('IP restriction not found');
      }

      await restriction.update({
        isActive: false,
      });

      this.logger.log(`Removed IP restriction: ${id}`);
      return { success: true };
    } catch (error) {
      this.logger.error(`Error removing IP restriction ${id}:`, error);
      throw error;
    }
  }

  /**
   * Check if IP is restricted with audit logging
   */
  async checkIpRestriction(
    ipAddress: string,
    userId?: string,
  ): Promise<IpRestrictionCheckResult> {
    try {
      const IpRestriction = this.getModel('IpRestriction');

      // If IpRestriction model doesn't exist, skip IP restriction check
      if (!IpRestriction) {
        this.logger.warn(
          'IpRestriction model not found, skipping IP restriction check',
        );
        return {
          isRestricted: false,
          reason: undefined,
        };
      }

      const restriction = await IpRestriction.findOne({
        where: {
          ipAddress,
          isActive: true,
        },
      });

      const isRestricted = restriction
        ? restriction.type === IpRestrictionType.BLACKLIST
        : false;

      // Audit logging for IP restriction checks
      if (restriction) {
        await this.auditService.logRead('IpRestriction', restriction.id, {
          userId: userId || null,
          userName: userId ? 'User' : 'Anonymous',
          userRole: userId ? 'USER' : ('ANONYMOUS' as any),
          ipAddress: ipAddress,
          userAgent: null,
          timestamp: new Date(),
        } as ExecutionContext);
      }

      if (!restriction) {
        return { isRestricted: false };
      }

      return {
        isRestricted,
        type: restriction.type,
        reason: restriction.reason || undefined,
      };
    } catch (error) {
      this.logger.error('Error checking IP restriction:', error);
      return { isRestricted: false };
    }
  }

  // ============================================================================
  // SECURITY INCIDENT MANAGEMENT
  // ============================================================================

  /**
   * Create a security incident
   */
  async createSecurityIncident(
    data: AccessControlCreateIncidentDto,
  ): Promise<any> {
    try {
      const SecurityIncident = this.getModel('SecurityIncident');
      const incident = await SecurityIncident.create({
        type: data.type,
        severity: data.severity,
        description: data.description,
        affectedResources: data.affectedResources || [],
        detectedBy: data.detectedBy,
        status: SecurityIncidentStatus.OPEN,
      });

      this.logger.warn(
        `Security incident created: ${incident.id} - ${data.type}`,
      );
      return incident;
    } catch (error) {
      this.logger.error('Error creating security incident:', error);
      throw error;
    }
  }

  /**
   * Update security incident
   */
  async updateSecurityIncident(id: string, data: SecurityIncidentUpdateData): Promise<SecurityIncidentInstance> {
    try {
      const SecurityIncident = this.getModel('SecurityIncident');
      const incident = await SecurityIncident.findByPk(id);

      if (!incident) {
        throw new NotFoundException('Security incident not found');
      }

      const updateData: RoleUpdateData = {};

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
      if (
        data.status === SecurityIncidentStatus.RESOLVED &&
        !incident.resolvedAt
      ) {
        updateData.resolvedAt = new Date();
      }

      await incident.update(updateData);

      this.logger.log(`Updated security incident: ${id}`);
      return incident;
    } catch (error) {
      this.logger.error(`Error updating security incident ${id}:`, error);
      throw error;
    }
  }

  /**
   * Get security incidents with pagination and filters
   */
  async getSecurityIncidents(
    page: number = 1,
    limit: number = 20,
    filters: SecurityIncidentFilters = {},
  ): Promise<{ incidents: SecurityIncidentInstance[]; pagination: PaginationResult }> {
    try {
      const SecurityIncident = this.getModel('SecurityIncident');
      const offset = (page - 1) * limit;
      const whereClause: SecurityIncidentWhereClause = {};

      if (filters.type) {
        whereClause.type = filters.type;
      }

      if (filters.severity) {
        whereClause.severity = filters.severity;
      }

      if (filters.status) {
        whereClause.status = filters.status;
      }

      const { rows: incidents, count: total } =
        await SecurityIncident.findAndCountAll({
          where: whereClause,
          offset,
          limit,
          order: [['createdAt', 'DESC']],
        });

      this.logger.log(`Retrieved ${incidents.length} security incidents`);

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
      this.logger.error('Error getting security incidents:', error);
      throw error;
    }
  }

  /**
   * Get security statistics
   */
  async getSecurityStatistics(): Promise<SecurityStatistics> {
    try {
      const SecurityIncident = this.getModel('SecurityIncident');
      const LoginAttempt = this.getModel('LoginAttempt');
      const Session = this.getModel('Session');
      const IpRestriction = this.getModel('IpRestriction');

      const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);

      const [
        totalIncidents,
        openIncidents,
        criticalIncidents,
        recentFailedLogins,
        activeSessions,
        activeIpRestrictions,
      ] = await Promise.all([
        SecurityIncident.count(),
        SecurityIncident.count({
          where: { status: SecurityIncidentStatus.OPEN },
        }),
        SecurityIncident.count({
          where: {
            severity: IncidentSeverity.CRITICAL,
            status: {
              [Op.ne]: SecurityIncidentStatus.CLOSED,
            },
          },
        }),
        LoginAttempt.count({
          where: {
            success: false,
            createdAt: {
              [Op.gte]: last24Hours,
            },
          },
        }),
        Session.count({
          where: {
            expiresAt: {
              [Op.gt]: new Date(),
            },
          },
        }),
        IpRestriction.count({
          where: { isActive: true },
        }),
      ]);

      const statistics: SecurityStatistics = {
        incidents: {
          total: totalIncidents,
          open: openIncidents,
          critical: criticalIncidents,
        },
        authentication: {
          recentFailedLogins,
          activeSessions,
        },
        ipRestrictions: activeIpRestrictions,
      };

      this.logger.log('Retrieved security statistics');
      return statistics;
    } catch (error) {
      this.logger.error('Error getting security statistics:', error);
      throw error;
    }
  }

  // ============================================================================
  // SYSTEM INITIALIZATION
  // ============================================================================

  /**
   * Initialize default roles and permissions
   * This should be run once during system setup
   */
  async initializeDefaultRoles(): Promise<void> {
    const transaction = await this.sequelize.transaction();

    try {
      const Role = this.getModel('Role');
      const Permission = this.getModel('Permission');
      const RolePermission = this.getModel('RolePermission');

      // Check if roles already exist
      const existingRolesCount = await Role.count({ transaction });
      if (existingRolesCount > 0) {
        this.logger.log('Roles already initialized');
        await transaction.rollback();
        return;
      }

      // Create default permissions
      const permissions = await this.initializeDefaultPermissions(transaction);

      // Create default roles
      const nurseRole = await Role.create(
        {
          name: 'Nurse',
          description:
            'School nurse with full access to student health management',
          isSystem: true,
        },
        { transaction },
      );

      const adminRole = await Role.create(
        {
          name: 'Administrator',
          description: 'System administrator with full access',
          isSystem: true,
        },
        { transaction },
      );

      // Assign permissions to nurse role
      const nursePermissions = permissions.filter((p: PermissionModel) =>
        ['students', 'medications', 'health_records', 'reports'].includes(
          p.resource,
        ),
      );

      for (const permission of nursePermissions) {
        await RolePermission.create(
          {
            roleId: nurseRole.id,
            permissionId: permission.id,
          },
          { transaction },
        );
      }

      // Assign all permissions to admin role
      for (const permission of permissions) {
        await RolePermission.create(
          {
            roleId: adminRole.id,
            permissionId: permission.id,
          },
          { transaction },
        );
      }

      await transaction.commit();
      this.logger.log('Initialized default roles and permissions successfully');
    } catch (error) {
      await transaction.rollback();
      this.logger.error('Error initializing default roles:', error);
      throw error;
    }
  }

  /**
   * Initialize default permissions
   */
  private async initializeDefaultPermissions(transaction: unknown): Promise<PermissionInstance[]> {
    const Permission = this.getModel('Permission');

    const permissionsData: CreatePermissionDto[] = [
      // Student permissions
      { resource: 'students', action: 'read', description: 'View students' },
      {
        resource: 'students',
        action: 'create',
        description: 'Create students',
      },
      {
        resource: 'students',
        action: 'update',
        description: 'Update students',
      },
      {
        resource: 'students',
        action: 'delete',
        description: 'Delete students',
      },

      // Medication permissions
      {
        resource: 'medications',
        action: 'read',
        description: 'View medications',
      },
      {
        resource: 'medications',
        action: 'administer',
        description: 'Administer medications',
      },
      {
        resource: 'medications',
        action: 'manage',
        description: 'Manage medication inventory',
      },

      // Health records permissions
      {
        resource: 'health_records',
        action: 'read',
        description: 'View health records',
      },
      {
        resource: 'health_records',
        action: 'create',
        description: 'Create health records',
      },
      {
        resource: 'health_records',
        action: 'update',
        description: 'Update health records',
      },

      // Reports permissions
      { resource: 'reports', action: 'read', description: 'View reports' },
      { resource: 'reports', action: 'create', description: 'Create reports' },

      // Admin permissions
      { resource: 'users', action: 'manage', description: 'Manage users' },
      {
        resource: 'system',
        action: 'configure',
        description: 'Configure system',
      },
      {
        resource: 'security',
        action: 'manage',
        description: 'Manage security settings',
      },
    ];

    const permissions: PermissionInstance[] = [];
    for (const permData of permissionsData) {
      const permission = await Permission.create(permData, { transaction });
      permissions.push(permission);
    }

    this.logger.log(`Initialized ${permissions.length} default permissions`);
    return permissions;
  }
}
