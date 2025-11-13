import { BadRequestException, Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectConnection } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize';
import { AuditService } from '../../database/services/audit.service';
import { ExecutionContext } from '../../database/types/execution-context.interface';
import { PermissionCacheService } from './permission-cache.service';
import {
  IncidentSeverity,
  SecurityIncidentType,
} from '../dto/create-security-incident.dto';
import { UserPermissionsResult } from '../interfaces/user-permissions-result.interface';
import { BaseService } from '../../../common/base';
import {
  PermissionModel,
  RolePermissionModel,
  SequelizeModelClass,
  UserRoleAssignmentModel,
} from '../types/sequelize-models.types';

// Security incident status enum
enum SecurityIncidentStatus {
  OPEN = 'OPEN',
  INVESTIGATING = 'INVESTIGATING',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED',
}

/**
 * User Role Assignment Service
 *
 * Handles all RBAC (Role-Based Access Control) operations including:
 * - User role assignments with privilege escalation prevention
 * - User role removal
 * - User permissions retrieval with caching
 * - Permission checking
 * - Audit logging for all role assignment operations
 */
@Injectable()
export class UserRoleAssignmentService extends BaseService {
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
      const targetUser = await this.findEntityOrFail(User, userId, 'User');

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

      this.logInfo(
        `Assigned role ${roleId} (${role.name}) to user ${userId} (${targetUser.email}) by user ${auditUserId || 'SYSTEM'}`,
      );
      return userRole;
    } catch (error) {
      await transaction.rollback();
      this.logError('Error assigning role to user:', error);
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

      this.logInfo(`Removed role ${roleId} from user ${userId}`);
      return { success: true };
    } catch (error) {
      this.logError('Error removing role from user:', error);
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
          this.logDebug(`Using cached permissions for user ${userId}`);
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
      const roles = userRoles.map((ur: UserRoleAssignmentModel) => ur.role).filter((r: any): r is any => !!r);

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

      this.logInfo(
        `Retrieved ${permissions.length} permissions for user ${userId}`,
      );
      return result;
    } catch (error) {
      this.logError(`Error getting user permissions for ${userId}:`, error);
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

      this.logInfo(
        `Permission check for user ${userId} on ${resource}.${action}: ${hasPermission}`,
      );
      return hasPermission;
    } catch (error) {
      this.logError('Error checking permission:', error);
      return false;
    }
  }
}
