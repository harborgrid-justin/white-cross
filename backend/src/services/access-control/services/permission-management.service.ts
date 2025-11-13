import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectConnection } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize';
import { RequestContextService } from '@/common/context/request-context.service';
import { BaseService } from '@/common/base';
import { AuditService } from '@/services/database/audit.service';
import { ExecutionContext } from '../../database/types/execution-context.interface';
import { PermissionCacheService } from './permission-cache.service';
import { CreatePermissionDto } from '../dto/create-permission.dto';
import {
  PermissionInstance,
  RolePermissionInstance,
  SequelizeModelClass,
} from '../types/sequelize-models.types';

/**
 * Permission Management Service
 *
 * Handles all permission-related operations including:
 * - Permission CRUD operations
 * - Permission-to-role assignments
 * - Permission validation
 * - Cache invalidation on permission changes
 * - Audit logging for permission operations
 */
@Injectable()
export class PermissionManagementService extends BaseService {
  constructor(
    protected readonly requestContext: RequestContextService,
    @InjectConnection() private readonly sequelize: Sequelize,
    @Inject('IAuditLogger') private readonly auditService: AuditService,
    private readonly cacheService: PermissionCacheService,
  ) {
    super(requestContext);
  }

  /**
   * Get Sequelize models dynamically
   */
  private getModel<T>(modelName: string): SequelizeModelClass<T> {
    return this.sequelize.models[modelName];
  }

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
}
