/**
 * WC-GEN-178 | permissionOperations.ts - General utility functions and operations
 * Purpose: general utility functions and operations
 * Upstream: ../../utils/logger, ../../database/models, ../../database/types/enums | Dependencies: ../../utils/logger, ../../database/models, ../../database/types/enums
 * Downstream: Routes, services, other modules | Called by: Application components
 * Related: Similar modules, tests, documentation
 * Exports: Various exports | Key Services: Core functionality
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Module loading → Function execution → Response handling
 * LLM Context: general utility functions and operations, part of backend architecture
 */

/**
 * Permission Management Operations
 *
 * This module handles permission-related operations including creating permissions,
 * assigning permissions to roles, and managing role-permission relationships.
 */

import { logger } from '../../utils/logger';
import {
  Permission,
  Role,
  RolePermission,
  sequelize
} from '../../database/models';
import { AuditAction } from '../../database/types/enums';
import { auditService } from '../auditService';
import { CreatePermissionData } from './types';

/**
 * Get all permissions ordered by resource and action
 */
export async function getPermissions(): Promise<Permission[]> {
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

/**
 * Create a new permission
 */
export async function createPermission(data: CreatePermissionData): Promise<Permission> {
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

/**
 * Assign permission to role with validation and audit logging
 */
export async function assignPermissionToRole(
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
    await auditService.logAction({
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
    await auditService.logAction({
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

/**
 * Remove permission from role
 */
export async function removePermissionFromRole(
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

/**
 * Initialize default permissions for the platform
 * This should be run once during system setup
 */
export async function initializeDefaultPermissions(transaction: any): Promise<Permission[]> {
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
