/**
 * LOC: C94B779741
 * WC-GEN-180 | roleOperations.ts - General utility functions and operations
 *
 * UPSTREAM (imports from):
 *   - logger.ts (utils/logger.ts)
 *   - enums.ts (database/types/enums.ts)
 *   - auditService.ts (services/auditService.ts)
 *
 * DOWNSTREAM (imported by):
 *   - index.ts (services/accessControl/index.ts)
 */

/**
 * WC-GEN-180 | roleOperations.ts - General utility functions and operations
 * Purpose: general utility functions and operations
 * Upstream: ../../utils/logger, ../../database/models, ../../database/types/enums | Dependencies: sequelize, ../../utils/logger, ../../database/models
 * Downstream: Routes, services, other modules | Called by: Application components
 * Related: Similar modules, tests, documentation
 * Exports: Various exports | Key Services: Core functionality
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Module loading → Function execution → Response handling
 * LLM Context: general utility functions and operations, part of backend architecture
 */

/**
 * Role Management Operations
 *
 * This module handles all role-related operations including CRUD operations,
 * validation, and audit logging for role management in the access control system.
 */

import { Op } from 'sequelize';
import { logger } from '../../utils/logger';
import {
  Role,
  RolePermission,
  Permission,
  UserRoleAssignment,
  sequelize
} from '../../database/models';
import { AuditAction } from '../../database/types/enums';
import { auditService, AuditService } from '../auditService';
import {
  CreateRoleData,
  UpdateRoleData
} from './types';

/**
 * Get all roles with their permissions and user assignments
 */
export async function getRoles(): Promise<Role[]> {
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

/**
 * Get role by ID with permissions and user assignments
 */
export async function getRoleById(id: string): Promise<Role> {
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

/**
 * Create a new role with validation and audit logging
 */
export async function createRole(data: CreateRoleData, auditUserId?: string): Promise<Role> {
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

/**
 * Update role with validation and audit logging
 */
export async function updateRole(id: string, data: UpdateRoleData, auditUserId?: string): Promise<Role> {
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

/**
 * Delete role with validation and audit logging (prevents deletion of system roles)
 */
export async function deleteRole(id: string, auditUserId?: string): Promise<{ success: boolean }> {
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
