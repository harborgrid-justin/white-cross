/**
 * LOC: IAM_AUTHZ_KIT_001
 * File: /reuse/iam-authorization-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/core
 *   - @nestjs/swagger
 *   - express
 *   - crypto
 *
 * DOWNSTREAM (imported by):
 *   - Authorization services
 *   - Guard implementations
 *   - Controllers
 *   - Authorization middleware
 *   - Policy engines
 */

/**
 * File: /reuse/iam-authorization-kit.ts
 * Locator: WC-IAM-AUTHZ-KIT-001
 * Purpose: Comprehensive IAM Authorization Kit - Enterprise-grade authorization toolkit
 *
 * Upstream: NestJS, Express, Crypto
 * Downstream: ../backend/auth/*, Guards, Controllers, Middleware
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, @nestjs/core
 * Exports: 48 authorization functions for guards, permissions, RBAC, ABAC, policies
 *
 * LLM Context: Enterprise-grade authorization utilities for White Cross healthcare platform.
 * Provides comprehensive authorization controls including Role-Based Access Control (RBAC),
 * Attribute-Based Access Control (ABAC), resource-based authorization, hierarchical permissions,
 * permission inheritance, authorization caching, context-aware authorization, NestJS guards,
 * custom decorators, and policy-based authorization middleware. HIPAA-compliant authorization
 * patterns for secure healthcare data access control.
 */

import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  createParamDecorator,
  SetMetadata,
  applyDecorators,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import * as crypto from 'crypto';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * User role enumeration
 */
export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  DOCTOR = 'doctor',
  NURSE = 'nurse',
  PATIENT = 'patient',
  STAFF = 'staff',
  GUEST = 'guest',
}

/**
 * Permission structure
 */
export interface Permission {
  resource: string;
  action: string;
  conditions?: Record<string, any>;
}

/**
 * Role definition with permissions
 */
export interface RoleDefinition {
  name: string;
  description: string;
  permissions: Permission[];
  inherits?: string[];
  priority: number;
}

/**
 * Authorization context
 */
export interface AuthorizationContext {
  user: {
    id: string;
    email: string;
    role: string;
    permissions: string[];
    department?: string;
    organization?: string;
  };
  resource?: {
    id: string;
    type: string;
    ownerId?: string;
    organizationId?: string;
    metadata?: Record<string, any>;
  };
  action: string;
  environment?: {
    ipAddress?: string;
    time?: Date;
    location?: string;
  };
}

/**
 * Policy evaluation result
 */
export interface PolicyResult {
  allowed: boolean;
  reason?: string;
  conditions?: string[];
}

/**
 * Resource ownership
 */
export interface ResourceOwnership {
  resourceId: string;
  resourceType: string;
  ownerId: string;
  sharedWith?: string[];
}

/**
 * Permission cache entry
 */
export interface PermissionCacheEntry {
  userId: string;
  permissions: string[];
  roles: string[];
  cachedAt: Date;
  expiresAt: Date;
}

/**
 * Hierarchical permission node
 */
export interface PermissionNode {
  name: string;
  children?: PermissionNode[];
  implied?: string[];
}

/**
 * Authorization policy
 */
export interface AuthorizationPolicy {
  name: string;
  effect: 'allow' | 'deny';
  resources: string[];
  actions: string[];
  conditions?: PolicyCondition[];
  priority: number;
}

/**
 * Policy condition
 */
export interface PolicyCondition {
  field: string;
  operator: 'eq' | 'ne' | 'in' | 'nin' | 'gt' | 'lt' | 'contains';
  value: any;
}

/**
 * Access control list entry
 */
export interface AclEntry {
  principalId: string;
  principalType: 'user' | 'role' | 'group';
  resourceId: string;
  permissions: string[];
  grantedBy: string;
  grantedAt: Date;
  expiresAt?: Date;
}

// ============================================================================
// ROLE-BASED ACCESS CONTROL (RBAC)
// ============================================================================

/**
 * @function checkUserHasRole
 * @description Checks if user has specific role
 * @param {AuthorizationContext} context - Authorization context
 * @param {string | string[]} roles - Required role(s)
 * @returns {boolean} True if user has role
 *
 * @example
 * ```typescript
 * if (checkUserHasRole(context, 'admin')) {
 *   // Allow access
 * }
 * ```
 */
export const checkUserHasRole = (
  context: AuthorizationContext,
  roles: string | string[],
): boolean => {
  const requiredRoles = Array.isArray(roles) ? roles : [roles];
  return requiredRoles.includes(context.user.role);
};

/**
 * @function checkUserHasAnyRole
 * @description Checks if user has any of the specified roles
 * @param {AuthorizationContext} context - Authorization context
 * @param {string[]} roles - Required roles
 * @returns {boolean} True if user has any role
 *
 * @example
 * ```typescript
 * if (checkUserHasAnyRole(context, ['admin', 'doctor'])) {
 *   // Allow access
 * }
 * ```
 */
export const checkUserHasAnyRole = (
  context: AuthorizationContext,
  roles: string[],
): boolean => {
  return roles.includes(context.user.role);
};

/**
 * @function checkUserHasAllRoles
 * @description Checks if user has all specified roles (for multi-role systems)
 * @param {string[]} userRoles - User's roles
 * @param {string[]} requiredRoles - Required roles
 * @returns {boolean} True if user has all roles
 *
 * @example
 * ```typescript
 * if (checkUserHasAllRoles(user.roles, ['doctor', 'researcher'])) {
 *   // Allow access
 * }
 * ```
 */
export const checkUserHasAllRoles = (
  userRoles: string[],
  requiredRoles: string[],
): boolean => {
  return requiredRoles.every((role) => userRoles.includes(role));
};

/**
 * @function getRoleHierarchy
 * @description Gets role hierarchy for inheritance
 * @returns {Map<string, string[]>} Role hierarchy map
 *
 * @example
 * ```typescript
 * const hierarchy = getRoleHierarchy();
 * // super_admin > admin > doctor > nurse > staff > patient
 * ```
 */
export const getRoleHierarchy = (): Map<string, string[]> => {
  const hierarchy = new Map<string, string[]>();

  hierarchy.set(UserRole.SUPER_ADMIN, [
    UserRole.ADMIN,
    UserRole.DOCTOR,
    UserRole.NURSE,
    UserRole.STAFF,
    UserRole.PATIENT,
    UserRole.GUEST,
  ]);
  hierarchy.set(UserRole.ADMIN, [
    UserRole.DOCTOR,
    UserRole.NURSE,
    UserRole.STAFF,
    UserRole.PATIENT,
    UserRole.GUEST,
  ]);
  hierarchy.set(UserRole.DOCTOR, [UserRole.NURSE, UserRole.STAFF, UserRole.PATIENT, UserRole.GUEST]);
  hierarchy.set(UserRole.NURSE, [UserRole.STAFF, UserRole.PATIENT, UserRole.GUEST]);
  hierarchy.set(UserRole.STAFF, [UserRole.PATIENT, UserRole.GUEST]);
  hierarchy.set(UserRole.PATIENT, [UserRole.GUEST]);
  hierarchy.set(UserRole.GUEST, []);

  return hierarchy;
};

/**
 * @function checkRoleInherits
 * @description Checks if role inherits permissions from another role
 * @param {string} userRole - User's role
 * @param {string} requiredRole - Required role
 * @returns {boolean} True if role inherits permissions
 *
 * @example
 * ```typescript
 * if (checkRoleInherits('super_admin', 'doctor')) {
 *   // Super admin has all doctor permissions
 * }
 * ```
 */
export const checkRoleInherits = (userRole: string, requiredRole: string): boolean => {
  const hierarchy = getRoleHierarchy();
  const inheritedRoles = hierarchy.get(userRole) || [];
  return userRole === requiredRole || inheritedRoles.includes(requiredRole as UserRole);
};

/**
 * @function getEffectiveRoles
 * @description Gets all effective roles including inherited ones
 * @param {string} role - User's primary role
 * @returns {string[]} All effective roles
 *
 * @example
 * ```typescript
 * const roles = getEffectiveRoles('admin');
 * // Returns: ['admin', 'doctor', 'nurse', 'staff', 'patient', 'guest']
 * ```
 */
export const getEffectiveRoles = (role: string): string[] => {
  const hierarchy = getRoleHierarchy();
  const inheritedRoles = hierarchy.get(role) || [];
  return [role, ...inheritedRoles];
};

// ============================================================================
// PERMISSION CHECKING UTILITIES
// ============================================================================

/**
 * @function checkUserHasPermission
 * @description Checks if user has specific permission
 * @param {AuthorizationContext} context - Authorization context
 * @param {string} permission - Required permission (resource:action)
 * @returns {boolean} True if user has permission
 *
 * @example
 * ```typescript
 * if (checkUserHasPermission(context, 'patients:read')) {
 *   // Allow access
 * }
 * ```
 */
export const checkUserHasPermission = (
  context: AuthorizationContext,
  permission: string,
): boolean => {
  return context.user.permissions?.includes(permission) || false;
};

/**
 * @function checkUserHasAnyPermission
 * @description Checks if user has any of the specified permissions
 * @param {AuthorizationContext} context - Authorization context
 * @param {string[]} permissions - Required permissions
 * @returns {boolean} True if user has any permission
 *
 * @example
 * ```typescript
 * if (checkUserHasAnyPermission(context, ['patients:read', 'patients:write'])) {
 *   // Allow access
 * }
 * ```
 */
export const checkUserHasAnyPermission = (
  context: AuthorizationContext,
  permissions: string[],
): boolean => {
  return permissions.some((perm) => context.user.permissions?.includes(perm));
};

/**
 * @function checkUserHasAllPermissions
 * @description Checks if user has all specified permissions
 * @param {AuthorizationContext} context - Authorization context
 * @param {string[]} permissions - Required permissions
 * @returns {boolean} True if user has all permissions
 *
 * @example
 * ```typescript
 * if (checkUserHasAllPermissions(context, ['patients:read', 'patients:write'])) {
 *   // Allow access
 * }
 * ```
 */
export const checkUserHasAllPermissions = (
  context: AuthorizationContext,
  permissions: string[],
): boolean => {
  return permissions.every((perm) => context.user.permissions?.includes(perm));
};

/**
 * @function parsePermission
 * @description Parses permission string into resource and action
 * @param {string} permission - Permission string (resource:action)
 * @returns {object} Parsed permission
 *
 * @example
 * ```typescript
 * const parsed = parsePermission('patients:read');
 * // Returns: { resource: 'patients', action: 'read' }
 * ```
 */
export const parsePermission = (permission: string): {
  resource: string;
  action: string;
} => {
  const [resource, action] = permission.split(':');
  return { resource, action };
};

/**
 * @function buildPermission
 * @description Builds permission string from resource and action
 * @param {string} resource - Resource name
 * @param {string} action - Action name
 * @returns {string} Permission string
 *
 * @example
 * ```typescript
 * const permission = buildPermission('patients', 'read');
 * // Returns: 'patients:read'
 * ```
 */
export const buildPermission = (resource: string, action: string): string => {
  return `${resource}:${action}`;
};

/**
 * @function expandWildcardPermissions
 * @description Expands wildcard permissions to concrete permissions
 * @param {string[]} permissions - Permissions with wildcards
 * @param {string[]} availableResources - Available resources
 * @param {string[]} availableActions - Available actions
 * @returns {string[]} Expanded permissions
 *
 * @example
 * ```typescript
 * const expanded = expandWildcardPermissions(
 *   ['patients:*', '*:read'],
 *   ['patients', 'appointments'],
 *   ['read', 'write', 'delete']
 * );
 * ```
 */
export const expandWildcardPermissions = (
  permissions: string[],
  availableResources: string[],
  availableActions: string[],
): string[] => {
  const expanded: string[] = [];

  for (const permission of permissions) {
    const [resource, action] = permission.split(':');

    if (resource === '*' && action === '*') {
      // Grant all permissions
      for (const res of availableResources) {
        for (const act of availableActions) {
          expanded.push(`${res}:${act}`);
        }
      }
    } else if (resource === '*') {
      // Grant action on all resources
      for (const res of availableResources) {
        expanded.push(`${res}:${action}`);
      }
    } else if (action === '*') {
      // Grant all actions on resource
      for (const act of availableActions) {
        expanded.push(`${resource}:${act}`);
      }
    } else {
      expanded.push(permission);
    }
  }

  return [...new Set(expanded)];
};

// ============================================================================
// RESOURCE-BASED AUTHORIZATION
// ============================================================================

/**
 * @function checkResourceOwnership
 * @description Checks if user owns the resource
 * @param {AuthorizationContext} context - Authorization context
 * @returns {boolean} True if user owns resource
 *
 * @example
 * ```typescript
 * if (checkResourceOwnership(context)) {
 *   // User owns the resource
 * }
 * ```
 */
export const checkResourceOwnership = (context: AuthorizationContext): boolean => {
  if (!context.resource) {
    return false;
  }
  return context.resource.ownerId === context.user.id;
};

/**
 * @function checkResourceAccess
 * @description Checks if user has access to resource
 * @param {AuthorizationContext} context - Authorization context
 * @param {ResourceOwnership} ownership - Resource ownership data
 * @returns {boolean} True if user has access
 *
 * @example
 * ```typescript
 * if (checkResourceAccess(context, ownership)) {
 *   // User has access to resource
 * }
 * ```
 */
export const checkResourceAccess = (
  context: AuthorizationContext,
  ownership: ResourceOwnership,
): boolean => {
  // Owner has access
  if (ownership.ownerId === context.user.id) {
    return true;
  }

  // Shared with user
  if (ownership.sharedWith?.includes(context.user.id)) {
    return true;
  }

  return false;
};

/**
 * @function checkSameOrganization
 * @description Checks if user and resource belong to same organization
 * @param {AuthorizationContext} context - Authorization context
 * @returns {boolean} True if same organization
 *
 * @example
 * ```typescript
 * if (checkSameOrganization(context)) {
 *   // User and resource in same organization
 * }
 * ```
 */
export const checkSameOrganization = (context: AuthorizationContext): boolean => {
  if (!context.resource?.organizationId || !context.user.organization) {
    return false;
  }
  return context.resource.organizationId === context.user.organization;
};

/**
 * @function checkSameDepartment
 * @description Checks if user and resource belong to same department
 * @param {AuthorizationContext} context - Authorization context
 * @param {string} resourceDepartment - Resource department
 * @returns {boolean} True if same department
 *
 * @example
 * ```typescript
 * if (checkSameDepartment(context, resource.department)) {
 *   // User and resource in same department
 * }
 * ```
 */
export const checkSameDepartment = (
  context: AuthorizationContext,
  resourceDepartment: string,
): boolean => {
  return context.user.department === resourceDepartment;
};

/**
 * @function createResourceOwnership
 * @description Creates resource ownership record
 * @param {string} resourceId - Resource ID
 * @param {string} resourceType - Resource type
 * @param {string} ownerId - Owner user ID
 * @returns {ResourceOwnership} Ownership record
 *
 * @example
 * ```typescript
 * const ownership = createResourceOwnership('patient-123', 'patient', 'doctor-456');
 * ```
 */
export const createResourceOwnership = (
  resourceId: string,
  resourceType: string,
  ownerId: string,
): ResourceOwnership => {
  return {
    resourceId,
    resourceType,
    ownerId,
    sharedWith: [],
  };
};

/**
 * @function shareResourceWithUser
 * @description Shares resource with another user
 * @param {ResourceOwnership} ownership - Ownership record
 * @param {string} userId - User ID to share with
 * @returns {ResourceOwnership} Updated ownership
 *
 * @example
 * ```typescript
 * const updated = shareResourceWithUser(ownership, 'nurse-789');
 * ```
 */
export const shareResourceWithUser = (
  ownership: ResourceOwnership,
  userId: string,
): ResourceOwnership => {
  const sharedWith = ownership.sharedWith || [];
  if (!sharedWith.includes(userId)) {
    sharedWith.push(userId);
  }
  return { ...ownership, sharedWith };
};

// ============================================================================
// HIERARCHICAL PERMISSIONS
// ============================================================================

/**
 * @function buildPermissionTree
 * @description Builds hierarchical permission tree
 * @returns {PermissionNode} Root permission node
 *
 * @example
 * ```typescript
 * const tree = buildPermissionTree();
 * // patients.read implies patients.list
 * ```
 */
export const buildPermissionTree = (): PermissionNode => {
  return {
    name: 'root',
    children: [
      {
        name: 'patients',
        children: [
          { name: 'patients:read', implied: ['patients:list'] },
          { name: 'patients:write', implied: ['patients:read', 'patients:list'] },
          { name: 'patients:delete', implied: ['patients:read'] },
        ],
      },
      {
        name: 'appointments',
        children: [
          { name: 'appointments:read', implied: ['appointments:list'] },
          { name: 'appointments:write', implied: ['appointments:read'] },
          { name: 'appointments:delete', implied: ['appointments:read'] },
        ],
      },
    ],
  };
};

/**
 * @function getImpliedPermissions
 * @description Gets permissions implied by a permission
 * @param {string} permission - Permission to check
 * @param {PermissionNode} tree - Permission tree
 * @returns {string[]} Implied permissions
 *
 * @example
 * ```typescript
 * const implied = getImpliedPermissions('patients:write', tree);
 * // Returns: ['patients:read', 'patients:list']
 * ```
 */
export const getImpliedPermissions = (
  permission: string,
  tree: PermissionNode,
): string[] => {
  const findNode = (node: PermissionNode): string[] | null => {
    if (node.name === permission) {
      return node.implied || [];
    }

    if (node.children) {
      for (const child of node.children) {
        const result = findNode(child);
        if (result) {
          return result;
        }
      }
    }

    return null;
  };

  return findNode(tree) || [];
};

/**
 * @function expandPermissionWithImplied
 * @description Expands permission to include implied permissions
 * @param {string[]} permissions - Base permissions
 * @param {PermissionNode} tree - Permission tree
 * @returns {string[]} Expanded permissions
 *
 * @example
 * ```typescript
 * const expanded = expandPermissionWithImplied(['patients:write'], tree);
 * // Returns: ['patients:write', 'patients:read', 'patients:list']
 * ```
 */
export const expandPermissionWithImplied = (
  permissions: string[],
  tree: PermissionNode,
): string[] => {
  const expanded = new Set<string>(permissions);

  for (const permission of permissions) {
    const implied = getImpliedPermissions(permission, tree);
    implied.forEach((p) => expanded.add(p));
  }

  return Array.from(expanded);
};

// ============================================================================
// PERMISSION INHERITANCE
// ============================================================================

/**
 * @function inheritPermissionsFromRole
 * @description Inherits permissions from role definition
 * @param {string} role - Role name
 * @param {Map<string, RoleDefinition>} roles - Role definitions
 * @returns {string[]} Inherited permissions
 *
 * @example
 * ```typescript
 * const permissions = inheritPermissionsFromRole('admin', roleDefinitions);
 * ```
 */
export const inheritPermissionsFromRole = (
  role: string,
  roles: Map<string, RoleDefinition>,
): string[] => {
  const roleDefinition = roles.get(role);
  if (!roleDefinition) {
    return [];
  }

  const permissions = roleDefinition.permissions.map((p) => `${p.resource}:${p.action}`);

  // Inherit from parent roles
  if (roleDefinition.inherits) {
    for (const parentRole of roleDefinition.inherits) {
      const parentPermissions = inheritPermissionsFromRole(parentRole, roles);
      permissions.push(...parentPermissions);
    }
  }

  return [...new Set(permissions)];
};

/**
 * @function mergePermissions
 * @description Merges multiple permission sets
 * @param {...string[][]} permissionSets - Permission sets to merge
 * @returns {string[]} Merged permissions
 *
 * @example
 * ```typescript
 * const merged = mergePermissions(rolePermissions, groupPermissions, userPermissions);
 * ```
 */
export const mergePermissions = (...permissionSets: string[][]): string[] => {
  const merged = new Set<string>();
  for (const set of permissionSets) {
    set.forEach((p) => merged.add(p));
  }
  return Array.from(merged);
};

/**
 * @function subtractPermissions
 * @description Subtracts permissions (for deny rules)
 * @param {string[]} basePermissions - Base permissions
 * @param {string[]} deniedPermissions - Permissions to remove
 * @returns {string[]} Remaining permissions
 *
 * @example
 * ```typescript
 * const allowed = subtractPermissions(allPermissions, deniedPermissions);
 * ```
 */
export const subtractPermissions = (
  basePermissions: string[],
  deniedPermissions: string[],
): string[] => {
  return basePermissions.filter((p) => !deniedPermissions.includes(p));
};

// ============================================================================
// AUTHORIZATION CACHING
// ============================================================================

/**
 * @function createPermissionCacheEntry
 * @description Creates permission cache entry
 * @param {string} userId - User ID
 * @param {string[]} permissions - User permissions
 * @param {string[]} roles - User roles
 * @param {number} ttlSeconds - Cache TTL in seconds
 * @returns {PermissionCacheEntry} Cache entry
 *
 * @example
 * ```typescript
 * const cacheEntry = createPermissionCacheEntry('user123', permissions, roles, 3600);
 * ```
 */
export const createPermissionCacheEntry = (
  userId: string,
  permissions: string[],
  roles: string[],
  ttlSeconds: number = 3600,
): PermissionCacheEntry => {
  const now = new Date();
  return {
    userId,
    permissions,
    roles,
    cachedAt: now,
    expiresAt: new Date(now.getTime() + ttlSeconds * 1000),
  };
};

/**
 * @function isPermissionCacheValid
 * @description Checks if permission cache is still valid
 * @param {PermissionCacheEntry} entry - Cache entry
 * @returns {boolean} True if valid
 *
 * @example
 * ```typescript
 * if (isPermissionCacheValid(cacheEntry)) {
 *   // Use cached permissions
 * }
 * ```
 */
export const isPermissionCacheValid = (entry: PermissionCacheEntry): boolean => {
  return new Date() < entry.expiresAt;
};

/**
 * @function generateCacheKey
 * @description Generates cache key for permissions
 * @param {string} userId - User ID
 * @param {string} context - Cache context
 * @returns {string} Cache key
 *
 * @example
 * ```typescript
 * const key = generateCacheKey('user123', 'permissions');
 * ```
 */
export const generateCacheKey = (userId: string, context: string = 'permissions'): string => {
  return `authz:${context}:${userId}`;
};

/**
 * @function invalidatePermissionCache
 * @description Creates invalidation marker for cache
 * @param {string} userId - User ID
 * @returns {object} Invalidation metadata
 *
 * @example
 * ```typescript
 * const marker = invalidatePermissionCache('user123');
 * // Delete cache entry
 * ```
 */
export const invalidatePermissionCache = (userId: string): {
  userId: string;
  invalidatedAt: Date;
  reason: string;
} => {
  return {
    userId,
    invalidatedAt: new Date(),
    reason: 'permission_change',
  };
};

// ============================================================================
// CONTEXT-AWARE AUTHORIZATION
// ============================================================================

/**
 * @function evaluateTimeBasedCondition
 * @description Evaluates time-based authorization condition
 * @param {Date} currentTime - Current time
 * @param {object} condition - Time condition
 * @returns {boolean} True if condition met
 *
 * @example
 * ```typescript
 * const allowed = evaluateTimeBasedCondition(
 *   new Date(),
 *   { startHour: 9, endHour: 17 }
 * );
 * ```
 */
export const evaluateTimeBasedCondition = (
  currentTime: Date,
  condition: { startHour?: number; endHour?: number; allowedDays?: number[] },
): boolean => {
  const hour = currentTime.getHours();
  const day = currentTime.getDay();

  if (condition.startHour !== undefined && hour < condition.startHour) {
    return false;
  }

  if (condition.endHour !== undefined && hour >= condition.endHour) {
    return false;
  }

  if (condition.allowedDays && !condition.allowedDays.includes(day)) {
    return false;
  }

  return true;
};

/**
 * @function evaluateIpBasedCondition
 * @description Evaluates IP-based authorization condition
 * @param {string} ipAddress - Client IP address
 * @param {string[]} allowedIps - Allowed IP addresses/ranges
 * @returns {boolean} True if IP is allowed
 *
 * @example
 * ```typescript
 * const allowed = evaluateIpBasedCondition('192.168.1.100', ['192.168.1.0/24']);
 * ```
 */
export const evaluateIpBasedCondition = (
  ipAddress: string,
  allowedIps: string[],
): boolean => {
  // Simplified IP check - in production use proper IP range library
  return allowedIps.some((allowed) => {
    if (allowed.includes('/')) {
      // CIDR notation - simplified check
      const [network] = allowed.split('/');
      return ipAddress.startsWith(network.split('.').slice(0, 3).join('.'));
    }
    return ipAddress === allowed;
  });
};

/**
 * @function evaluateLocationBasedCondition
 * @description Evaluates location-based authorization condition
 * @param {string} location - User location
 * @param {string[]} allowedLocations - Allowed locations
 * @returns {boolean} True if location is allowed
 *
 * @example
 * ```typescript
 * const allowed = evaluateLocationBasedCondition('US', ['US', 'CA']);
 * ```
 */
export const evaluateLocationBasedCondition = (
  location: string,
  allowedLocations: string[],
): boolean => {
  return allowedLocations.includes(location);
};

/**
 * @function evaluateContextualConditions
 * @description Evaluates all contextual conditions
 * @param {AuthorizationContext} context - Authorization context
 * @param {PolicyCondition[]} conditions - Policy conditions
 * @returns {boolean} True if all conditions met
 *
 * @example
 * ```typescript
 * const allowed = evaluateContextualConditions(context, policy.conditions);
 * ```
 */
export const evaluateContextualConditions = (
  context: AuthorizationContext,
  conditions: PolicyCondition[],
): boolean => {
  for (const condition of conditions) {
    if (!evaluateSingleCondition(context, condition)) {
      return false;
    }
  }
  return true;
};

/**
 * @function evaluateSingleCondition
 * @description Evaluates single policy condition
 * @param {AuthorizationContext} context - Authorization context
 * @param {PolicyCondition} condition - Policy condition
 * @returns {boolean} True if condition met
 *
 * @example
 * ```typescript
 * const met = evaluateSingleCondition(context, {
 *   field: 'user.department',
 *   operator: 'eq',
 *   value: 'cardiology'
 * });
 * ```
 */
export const evaluateSingleCondition = (
  context: AuthorizationContext,
  condition: PolicyCondition,
): boolean => {
  const fieldValue = getFieldValue(context, condition.field);

  switch (condition.operator) {
    case 'eq':
      return fieldValue === condition.value;
    case 'ne':
      return fieldValue !== condition.value;
    case 'in':
      return Array.isArray(condition.value) && condition.value.includes(fieldValue);
    case 'nin':
      return Array.isArray(condition.value) && !condition.value.includes(fieldValue);
    case 'gt':
      return fieldValue > condition.value;
    case 'lt':
      return fieldValue < condition.value;
    case 'contains':
      return String(fieldValue).includes(String(condition.value));
    default:
      return false;
  }
};

/**
 * @function getFieldValue
 * @description Gets field value from context using dot notation
 * @param {AuthorizationContext} context - Authorization context
 * @param {string} field - Field path (e.g., 'user.department')
 * @returns {any} Field value
 */
const getFieldValue = (context: AuthorizationContext, field: string): any => {
  const parts = field.split('.');
  let value: any = context;

  for (const part of parts) {
    value = value?.[part];
  }

  return value;
};

// ============================================================================
// POLICY-BASED AUTHORIZATION
// ============================================================================

/**
 * @function evaluatePolicy
 * @description Evaluates authorization policy
 * @param {AuthorizationContext} context - Authorization context
 * @param {AuthorizationPolicy} policy - Authorization policy
 * @returns {PolicyResult} Policy evaluation result
 *
 * @example
 * ```typescript
 * const result = evaluatePolicy(context, policy);
 * if (result.allowed) {
 *   // Grant access
 * }
 * ```
 */
export const evaluatePolicy = (
  context: AuthorizationContext,
  policy: AuthorizationPolicy,
): PolicyResult => {
  // Check if policy applies to resource
  const resourceMatch = policy.resources.includes('*') ||
    (context.resource && policy.resources.includes(context.resource.type));

  if (!resourceMatch) {
    return { allowed: false, reason: 'Resource not in policy scope' };
  }

  // Check if policy applies to action
  const actionMatch = policy.actions.includes('*') || policy.actions.includes(context.action);

  if (!actionMatch) {
    return { allowed: false, reason: 'Action not in policy scope' };
  }

  // Evaluate conditions
  if (policy.conditions && policy.conditions.length > 0) {
    const conditionsMet = evaluateContextualConditions(context, policy.conditions);
    if (!conditionsMet) {
      return { allowed: false, reason: 'Policy conditions not met' };
    }
  }

  return {
    allowed: policy.effect === 'allow',
    reason: policy.effect === 'allow' ? 'Policy allows access' : 'Policy denies access',
  };
};

/**
 * @function evaluatePolicies
 * @description Evaluates multiple policies and combines results
 * @param {AuthorizationContext} context - Authorization context
 * @param {AuthorizationPolicy[]} policies - Authorization policies
 * @returns {PolicyResult} Combined policy result
 *
 * @example
 * ```typescript
 * const result = evaluatePolicies(context, [policy1, policy2, policy3]);
 * ```
 */
export const evaluatePolicies = (
  context: AuthorizationContext,
  policies: AuthorizationPolicy[],
): PolicyResult => {
  // Sort by priority (higher priority first)
  const sortedPolicies = [...policies].sort((a, b) => b.priority - a.priority);

  let explicitDeny = false;
  let explicitAllow = false;

  for (const policy of sortedPolicies) {
    const result = evaluatePolicy(context, policy);

    if (result.allowed && policy.effect === 'deny') {
      explicitDeny = true;
      break; // Deny takes precedence
    }

    if (result.allowed && policy.effect === 'allow') {
      explicitAllow = true;
    }
  }

  if (explicitDeny) {
    return { allowed: false, reason: 'Explicitly denied by policy' };
  }

  if (explicitAllow) {
    return { allowed: true, reason: 'Explicitly allowed by policy' };
  }

  return { allowed: false, reason: 'No matching allow policy' };
};

/**
 * @function createPolicy
 * @description Creates authorization policy
 * @param {string} name - Policy name
 * @param {string} effect - Policy effect (allow/deny)
 * @param {string[]} resources - Resources
 * @param {string[]} actions - Actions
 * @param {PolicyCondition[]} conditions - Conditions
 * @returns {AuthorizationPolicy} Authorization policy
 *
 * @example
 * ```typescript
 * const policy = createPolicy('doctor-read-patients', 'allow', ['patients'], ['read']);
 * ```
 */
export const createPolicy = (
  name: string,
  effect: 'allow' | 'deny',
  resources: string[],
  actions: string[],
  conditions?: PolicyCondition[],
  priority: number = 0,
): AuthorizationPolicy => {
  return {
    name,
    effect,
    resources,
    actions,
    conditions,
    priority,
  };
};

// ============================================================================
// ACCESS CONTROL LISTS (ACL)
// ============================================================================

/**
 * @function createAclEntry
 * @description Creates ACL entry
 * @param {string} principalId - Principal ID (user/role/group)
 * @param {string} principalType - Principal type
 * @param {string} resourceId - Resource ID
 * @param {string[]} permissions - Granted permissions
 * @param {string} grantedBy - Granter user ID
 * @returns {AclEntry} ACL entry
 *
 * @example
 * ```typescript
 * const acl = createAclEntry('user123', 'user', 'patient-456', ['read', 'write'], 'admin-789');
 * ```
 */
export const createAclEntry = (
  principalId: string,
  principalType: 'user' | 'role' | 'group',
  resourceId: string,
  permissions: string[],
  grantedBy: string,
): AclEntry => {
  return {
    principalId,
    principalType,
    resourceId,
    permissions,
    grantedBy,
    grantedAt: new Date(),
  };
};

/**
 * @function checkAclPermission
 * @description Checks if ACL grants permission
 * @param {AclEntry[]} acls - ACL entries
 * @param {string} principalId - Principal ID
 * @param {string} permission - Required permission
 * @returns {boolean} True if granted
 *
 * @example
 * ```typescript
 * if (checkAclPermission(acls, 'user123', 'read')) {
 *   // Permission granted
 * }
 * ```
 */
export const checkAclPermission = (
  acls: AclEntry[],
  principalId: string,
  permission: string,
): boolean => {
  return acls.some(
    (acl) =>
      acl.principalId === principalId &&
      acl.permissions.includes(permission) &&
      (!acl.expiresAt || acl.expiresAt > new Date()),
  );
};

/**
 * @function revokeAclPermission
 * @description Revokes permission from ACL
 * @param {AclEntry} acl - ACL entry
 * @param {string} permission - Permission to revoke
 * @returns {AclEntry} Updated ACL
 *
 * @example
 * ```typescript
 * const updated = revokeAclPermission(acl, 'write');
 * ```
 */
export const revokeAclPermission = (acl: AclEntry, permission: string): AclEntry => {
  return {
    ...acl,
    permissions: acl.permissions.filter((p) => p !== permission),
  };
};

// ============================================================================
// NESTJS GUARD UTILITIES
// ============================================================================

/**
 * @function createRolesGuard
 * @description Creates NestJS roles guard
 * @returns {Function} Guard class
 *
 * @example
 * ```typescript
 * @UseGuards(createRolesGuard())
 * @Roles('admin', 'doctor')
 * async getPatients() { }
 * ```
 */
export const createRolesGuard = (): any => {
  @Injectable()
  class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
      const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
        context.getHandler(),
        context.getClass(),
      ]);

      if (!requiredRoles) {
        return true;
      }

      const request = context.switchToHttp().getRequest();
      const user = request.user;

      if (!user) {
        throw new ForbiddenException('User not authenticated');
      }

      return checkUserHasAnyRole({ user, action: '' }, requiredRoles);
    }
  }

  return RolesGuard;
};

/**
 * @function createPermissionsGuard
 * @description Creates NestJS permissions guard
 * @returns {Function} Guard class
 *
 * @example
 * ```typescript
 * @UseGuards(createPermissionsGuard())
 * @RequirePermissions('patients:read')
 * async getPatients() { }
 * ```
 */
export const createPermissionsGuard = (): any => {
  @Injectable()
  class PermissionsGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
      const requiredPermissions = this.reflector.getAllAndOverride<string[]>('permissions', [
        context.getHandler(),
        context.getClass(),
      ]);

      if (!requiredPermissions) {
        return true;
      }

      const request = context.switchToHttp().getRequest();
      const user = request.user;

      if (!user) {
        throw new ForbiddenException('User not authenticated');
      }

      return checkUserHasAllPermissions({ user, action: '' }, requiredPermissions);
    }
  }

  return PermissionsGuard;
};

// ============================================================================
// CUSTOM DECORATORS
// ============================================================================

/**
 * @function Roles
 * @description Decorator to specify required roles
 * @param {...string} roles - Required roles
 * @returns {Function} Method decorator
 *
 * @example
 * ```typescript
 * @Roles('admin', 'doctor')
 * async getPatients() { }
 * ```
 */
export const Roles = (...roles: string[]) => SetMetadata('roles', roles);

/**
 * @function RequirePermissions
 * @description Decorator to specify required permissions
 * @param {...string} permissions - Required permissions
 * @returns {Function} Method decorator
 *
 * @example
 * ```typescript
 * @RequirePermissions('patients:read', 'patients:write')
 * async updatePatient() { }
 * ```
 */
export const RequirePermissions = (...permissions: string[]) =>
  SetMetadata('permissions', permissions);

/**
 * @function RequireOwnership
 * @description Decorator to require resource ownership
 * @returns {Function} Method decorator
 *
 * @example
 * ```typescript
 * @RequireOwnership()
 * async deletePatient() { }
 * ```
 */
export const RequireOwnership = () => SetMetadata('requireOwnership', true);

/**
 * @function PublicRoute
 * @description Decorator to mark route as public (no auth required)
 * @returns {Function} Method decorator
 *
 * @example
 * ```typescript
 * @PublicRoute()
 * async login() { }
 * ```
 */
export const PublicRoute = () => SetMetadata('isPublic', true);

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  // RBAC
  checkUserHasRole,
  checkUserHasAnyRole,
  checkUserHasAllRoles,
  getRoleHierarchy,
  checkRoleInherits,
  getEffectiveRoles,

  // Permissions
  checkUserHasPermission,
  checkUserHasAnyPermission,
  checkUserHasAllPermissions,
  parsePermission,
  buildPermission,
  expandWildcardPermissions,

  // Resource-based
  checkResourceOwnership,
  checkResourceAccess,
  checkSameOrganization,
  checkSameDepartment,
  createResourceOwnership,
  shareResourceWithUser,

  // Hierarchical
  buildPermissionTree,
  getImpliedPermissions,
  expandPermissionWithImplied,

  // Inheritance
  inheritPermissionsFromRole,
  mergePermissions,
  subtractPermissions,

  // Caching
  createPermissionCacheEntry,
  isPermissionCacheValid,
  generateCacheKey,
  invalidatePermissionCache,

  // Context-aware
  evaluateTimeBasedCondition,
  evaluateIpBasedCondition,
  evaluateLocationBasedCondition,
  evaluateContextualConditions,
  evaluateSingleCondition,

  // Policy-based
  evaluatePolicy,
  evaluatePolicies,
  createPolicy,

  // ACL
  createAclEntry,
  checkAclPermission,
  revokeAclPermission,

  // Guards
  createRolesGuard,
  createPermissionsGuard,

  // Decorators
  Roles,
  RequirePermissions,
  RequireOwnership,
  PublicRoute,
};
