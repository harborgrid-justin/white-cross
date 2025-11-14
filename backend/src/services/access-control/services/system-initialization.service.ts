import { Injectable, Logger } from '@nestjs/common';
import { InjectConnection } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize';
import { CreatePermissionDto } from '../dto/create-permission.dto';
import { PermissionInstance, PermissionModel, SequelizeModelClass } from '../types/sequelize-models.types';

import { BaseService } from '@/common/base';
/**
 * System Initialization Service
 *
 * Handles system initialization operations including:
 * - Default role creation
 * - Default permission creation
 * - Initial role-permission assignments
 * - One-time system setup
 */
@Injectable()
export class SystemInitializationService extends BaseService {
  constructor(
    @InjectConnection() private readonly sequelize: Sequelize,
  ) {
    super("SystemInitializationService");
  }

  /**
   * Get Sequelize models dynamically
   */
  private getModel<T>(modelName: string): SequelizeModelClass<T> {
    return this.sequelize.models[modelName];
  }

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
        this.logInfo('Roles already initialized');
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
      this.logInfo('Initialized default roles and permissions successfully');
    } catch (error) {
      await transaction.rollback();
      this.logError('Error initializing default roles:', error);
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

    this.logInfo(`Initialized ${permissions.length} default permissions`);
    return permissions;
  }
}
