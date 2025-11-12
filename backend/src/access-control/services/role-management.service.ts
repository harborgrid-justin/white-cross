import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectConnection } from '@nestjs/sequelize';
import { Op, Sequelize } from 'sequelize';
import { RequestContextService } from '../../shared/context/request-context.service';
import { BaseService } from '../../shared/base/base.service';
import { AuditService } from '../../database/services/audit.service';
import { ExecutionContext } from '../../database/types/execution-context.interface';
import { PermissionCacheService } from './permission-cache.service';
import { CreateRoleDto } from '../dto/create-role.dto';
import { UpdateRoleDto } from '../dto/update-role.dto';
import {
  RoleUpdateData,
  RoleWithPermissions,
  SequelizeModelClass,
  UserRoleAssignmentModel,
} from '../types/sequelize-models.types';

/**
 * Role Management Service
 *
 * Handles all role-related operations including:
 * - Role CRUD operations
 * - Role validation and duplicate checking
 * - System role protection
 * - Cache invalidation on role changes
 * - Audit logging for role operations
 */
@Injectable()
export class RoleManagementService extends BaseService {
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
}
