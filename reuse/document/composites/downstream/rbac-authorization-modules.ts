/**
 * LOC: RBAC001
 * File: /reuse/document/composites/downstream/rbac-authorization-modules.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - crypto (Node.js built-in)
 *   - ../document-security-encryption-composite
 *   - access-control-services
 *
 * DOWNSTREAM (imported by):
 *   - Authorization guards
 *   - Role management controllers
 *   - Permission enforcement services
 */

import { Injectable, BadRequestException, ForbiddenException, Logger } from '@nestjs/common';
import * as crypto from 'crypto';

/**
 * Role definition
 */
export interface RoleDefinition {
  roleId: string;
  name: string;
  description: string;
  permissions: string[];
  parentRoles?: string[];
  createdAt: Date;
  isSystem: boolean;
  status: 'ACTIVE' | 'INACTIVE' | 'DEPRECATED';
}

/**
 * User role assignment
 */
export interface RoleAssignment {
  assignmentId: string;
  userId: string;
  roleId: string;
  assignedBy: string;
  assignedAt: Date;
  expiresAt?: Date;
  scope?: string; // Organization, Department, Project
  status: 'ACTIVE' | 'REVOKED' | 'EXPIRED';
}

/**
 * Role hierarchy
 */
export interface RoleHierarchy {
  parentRole: string;
  childRoles: string[];
  inheritPermissions: boolean;
}

/**
 * RBAC authorization module
 * Manages roles, role assignments, and permission inheritance
 */
@Injectable()
export class RBACAuthorizationModule {
  private readonly logger = new Logger(RBACAuthorizationModule.name);
  private roles: Map<string, RoleDefinition> = new Map();
  private assignments: Map<string, RoleAssignment> = new Map();
  private hierarchy: Map<string, RoleHierarchy> = new Map();

  constructor() {
    this.initializeDefaultRoles();
  }

  /**
   * Initializes default system roles
   */
  private initializeDefaultRoles(): void {
    const defaultRoles: RoleDefinition[] = [
      {
        roleId: 'SYSTEM_ADMIN',
        name: 'System Administrator',
        description: 'Full system access',
        permissions: ['*'],
        createdAt: new Date(),
        isSystem: true,
        status: 'ACTIVE'
      },
      {
        roleId: 'SECURITY_OFFICER',
        name: 'Security Officer',
        description: 'Security and compliance management',
        permissions: [
          'audit:read',
          'security:manage',
          'compliance:review',
          'policy:manage'
        ],
        createdAt: new Date(),
        isSystem: true,
        status: 'ACTIVE'
      },
      {
        roleId: 'DOCUMENT_OWNER',
        name: 'Document Owner',
        description: 'Own and manage documents',
        permissions: [
          'document:create',
          'document:read',
          'document:update',
          'document:delete',
          'document:share',
          'permission:manage'
        ],
        createdAt: new Date(),
        isSystem: true,
        status: 'ACTIVE'
      },
      {
        roleId: 'VIEWER',
        name: 'Viewer',
        description: 'Read-only access',
        permissions: ['document:read', 'audit:read'],
        createdAt: new Date(),
        isSystem: true,
        status: 'ACTIVE'
      }
    ];

    defaultRoles.forEach(role => {
      this.roles.set(role.roleId, role);
    });

    // Setup hierarchy
    this.hierarchy.set('SYSTEM_ADMIN', {
      parentRole: 'SYSTEM_ADMIN',
      childRoles: ['SECURITY_OFFICER', 'DOCUMENT_OWNER', 'VIEWER'],
      inheritPermissions: true
    });
  }

  /**
   * Creates custom role
   * @param name - Role name
   * @param description - Role description
   * @param permissions - List of permissions
   * @returns Created role
   */
  async createRole(
    name: string,
    description: string,
    permissions: string[]
  ): Promise<RoleDefinition> {
    try {
      const roleId = `CUSTOM_${crypto.randomUUID().substring(0, 8).toUpperCase()}`;

      const role: RoleDefinition = {
        roleId,
        name,
        description,
        permissions,
        createdAt: new Date(),
        isSystem: false,
        status: 'ACTIVE'
      };

      this.roles.set(roleId, role);

      this.logger.log(`Custom role created: ${roleId} - ${name}`);

      return role;
    } catch (error) {
      this.logger.error(`Failed to create role: ${error.message}`);
      throw new BadRequestException('Failed to create role');
    }
  }

  /**
   * Assigns role to user
   * @param userId - User identifier
   * @param roleId - Role identifier
   * @param assignedBy - Administrator assigning role
   * @param expiresAt - Optional expiration date
   * @param scope - Optional scope (org, department, project)
   * @returns Role assignment
   */
  async assignRole(
    userId: string,
    roleId: string,
    assignedBy: string,
    expiresAt?: Date,
    scope?: string
  ): Promise<RoleAssignment> {
    try {
      const role = this.roles.get(roleId);
      if (!role) {
        throw new BadRequestException('Role not found');
      }

      const assignmentId = crypto.randomUUID();

      const assignment: RoleAssignment = {
        assignmentId,
        userId,
        roleId,
        assignedBy,
        assignedAt: new Date(),
        expiresAt,
        scope,
        status: 'ACTIVE'
      };

      this.assignments.set(assignmentId, assignment);

      this.logger.log(`Role assigned: ${roleId} to ${userId}`);

      return assignment;
    } catch (error) {
      this.logger.error(`Failed to assign role: ${error.message}`);
      throw new BadRequestException('Failed to assign role');
    }
  }

  /**
   * Revokes role from user
   * @param assignmentId - Assignment identifier
   * @param revokedBy - Administrator revoking
   * @returns Revocation result
   */
  async revokeRole(assignmentId: string, revokedBy: string): Promise<{ revoked: boolean; timestamp: Date }> {
    const assignment = this.assignments.get(assignmentId);
    if (!assignment) {
      throw new BadRequestException('Assignment not found');
    }

    assignment.status = 'REVOKED';

    this.logger.log(`Role revoked: ${assignment.roleId} from ${assignment.userId}`);

    return {
      revoked: true,
      timestamp: new Date()
    };
  }

  /**
   * Gets user roles
   * @param userId - User identifier
   * @returns List of assigned roles
   */
  async getUserRoles(userId: string): Promise<RoleDefinition[]> {
    const assignments = Array.from(this.assignments.values()).filter(a =>
      a.userId === userId &&
      a.status === 'ACTIVE' &&
      (!a.expiresAt || a.expiresAt > new Date())
    );

    return assignments
      .map(a => this.roles.get(a.roleId))
      .filter((r): r is RoleDefinition => r !== undefined);
  }

  /**
   * Gets all permissions for user (including inherited)
   * @param userId - User identifier
   * @returns Complete permission set
   */
  async getUserPermissions(userId: string): Promise<string[]> {
    const roles = await this.getUserRoles(userId);
    const permissions = new Set<string>();

    for (const role of roles) {
      // Add direct permissions
      role.permissions.forEach(p => permissions.add(p));

      // Add inherited permissions
      const inheritedPerms = await this.getInheritedPermissions(role.roleId);
      inheritedPerms.forEach(p => permissions.add(p));
    }

    return Array.from(permissions);
  }

  /**
   * Checks if user has permission
   * @param userId - User identifier
   * @param permission - Permission to check
   * @returns Permission status
   */
  async hasPermission(userId: string, permission: string): Promise<boolean> {
    const permissions = await this.getUserPermissions(userId);

    // Check exact match
    if (permissions.includes(permission)) {
      return true;
    }

    // Check wildcard
    if (permissions.includes('*')) {
      return true;
    }

    // Check resource wildcard (e.g., 'document:*' matches 'document:read')
    const [resource] = permission.split(':');
    if (permissions.includes(`${resource}:*`)) {
      return true;
    }

    return false;
  }

  /**
   * Sets up role hierarchy
   * @param parentRole - Parent role
   * @param childRoles - Child roles
   * @param inheritPermissions - Whether to inherit permissions
   */
  async setupRoleHierarchy(
    parentRole: string,
    childRoles: string[],
    inheritPermissions: boolean = true
  ): Promise<RoleHierarchy> {
    const hierarchy: RoleHierarchy = {
      parentRole,
      childRoles,
      inheritPermissions
    };

    this.hierarchy.set(parentRole, hierarchy);

    this.logger.log(`Role hierarchy set: ${parentRole} -> ${childRoles.join(', ')}`);

    return hierarchy;
  }

  /**
   * Gets all roles
   * @param includeSystem - Include system roles
   * @returns List of roles
   */
  async getAllRoles(includeSystem: boolean = true): Promise<RoleDefinition[]> {
    let roles = Array.from(this.roles.values());

    if (!includeSystem) {
      roles = roles.filter(r => !r.isSystem);
    }

    return roles;
  }

  /**
   * Gets role details
   * @param roleId - Role identifier
   * @returns Role definition or null
   */
  async getRole(roleId: string): Promise<RoleDefinition | null> {
    return this.roles.get(roleId) || null;
  }

  /**
   * Updates role permissions
   * @param roleId - Role identifier
   * @param permissions - New permissions
   * @returns Updated role
   */
  async updateRolePermissions(roleId: string, permissions: string[]): Promise<RoleDefinition> {
    const role = this.roles.get(roleId);
    if (!role) {
      throw new BadRequestException('Role not found');
    }

    if (role.isSystem) {
      throw new ForbiddenException('Cannot modify system roles');
    }

    role.permissions = permissions;

    this.logger.log(`Role permissions updated: ${roleId}`);

    return role;
  }

  /**
   * Deprecates role
   * @param roleId - Role identifier
   * @param replacement - Replacement role
   * @returns Deprecated role
   */
  async deprecateRole(roleId: string, replacement?: string): Promise<RoleDefinition> {
    const role = this.roles.get(roleId);
    if (!role) {
      throw new BadRequestException('Role not found');
    }

    role.status = 'DEPRECATED';

    this.logger.log(`Role deprecated: ${roleId}`);

    return role;
  }

  /**
   * Gets inherited permissions from parent roles
   */
  private async getInheritedPermissions(roleId: string): Promise<string[]> {
    const permissions: string[] = [];
    const hierarchy = this.hierarchy.get(roleId);

    if (!hierarchy || !hierarchy.inheritPermissions) {
      return permissions;
    }

    const parentRole = this.roles.get(hierarchy.parentRole);
    if (parentRole) {
      parentRole.permissions.forEach(p => permissions.push(p));
    }

    return permissions;
  }
}

export default RBACAuthorizationModule;
