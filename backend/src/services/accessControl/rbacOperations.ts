/**
 * LOC: 97740ACDE5
 * WC-GEN-179 | rbacOperations.ts - General utility functions and operations
 *
 * UPSTREAM (imports from):
 *   - logger.ts (utils/logger.ts)
 *   - auditService.ts (services/auditService.ts)
 *   - types.ts (services/accessControl/types.ts)
 *
 * DOWNSTREAM (imported by):
 *   - index.ts (services/accessControl/index.ts)
 */

/**
 * WC-GEN-179 | rbacOperations.ts - General utility functions and operations
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
 * Role-Based Access Control (RBAC) Operations
 *
 * This module handles user role assignments, permission checking,
 * and privilege escalation prevention. It implements the core RBAC
 * logic for the access control system.
 */

import { logger } from '../../utils/logger';
import {
  Role,
  Permission,
  RolePermission,
  UserRoleAssignment,
  User,
  SecurityIncident,
  sequelize
} from '../../database/models';
import {
  AuditAction,
  SecurityIncidentType,
  IncidentSeverity,
  SecurityIncidentStatus
} from '../../database/types/enums';
import { auditService, AuditService } from '../auditService';
import { UserPermissionsResult } from './types';

// Type augmentations for model associations
declare module '../../database/models' {
  interface Role {
    permissions?: any[];
  }
  
  interface UserRoleAssignment {
    role?: Role;
  }
}

/**
 * Assign role to user with privilege escalation prevention and audit logging
 */
export async function assignRoleToUser(
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
      const assigningUserRoles = await getUserPermissions(auditUserId);

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

/**
 * Remove role from user
 */
export async function removeRoleFromUser(
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

/**
 * Get user roles and permissions
 */
export async function getUserPermissions(userId: string): Promise<UserPermissionsResult> {
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

/**
 * Check if user has a specific permission
 */
export async function checkPermission(
  userId: string,
  resource: string,
  action: string
): Promise<boolean> {
  try {
    const userPermissions = await getUserPermissions(userId);

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
