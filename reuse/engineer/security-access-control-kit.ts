/**
 * LOC: SEC_ACCESS_CTRL_001
 * File: /reuse/engineer/security-access-control-kit.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize
 *   - @nestjs/common
 *   - @nestjs/config
 *   - zod
 *   - crypto
 *   - jsonwebtoken
 *   - ioredis
 *
 * DOWNSTREAM (imported by):
 *   - Authorization middleware
 *   - Security modules
 *   - Access control services
 *   - Permission management
 *   - RBAC/ABAC services
 */

/**
 * File: /reuse/engineer/security-access-control-kit.ts
 * Locator: WC-SEC-ACCESS-CTRL-001
 * Purpose: Production-Grade Security & Access Control Kit - Comprehensive RBAC/ABAC & permission management
 *
 * Upstream: Sequelize, NestJS, Zod, Redis, JWT
 * Downstream: ../backend/modules/security/*, Auth middleware, Permission services
 * Dependencies: TypeScript 5.x, Node 18+, sequelize, ioredis, zod
 * Exports: 50 production-ready security and access control functions for enterprise applications
 *
 * LLM Context: Production-grade security and access control toolkit for White Cross healthcare platform.
 * Provides comprehensive role-based access control (RBAC) with hierarchical roles, attribute-based access
 * control (ABAC) with policy evaluation engine, permission matrix management with complex many-to-many
 * relationships, dynamic permission evaluation with context-aware rules, resource-level permissions with
 * fine-grained control, permission inheritance through role hierarchies, security groups with nested
 * memberships, ACL management for object-level permissions, permission caching strategies with Redis,
 * security policy enforcement engine, comprehensive permission audit logging, temporary access grants
 * with expiration, permission delegation with approval workflows, context-aware access control with
 * environmental factors, complex Sequelize associations for User-Role-Permission-SecurityGroup models,
 * efficient permission checking queries with optimization, batch permission operations, permission
 * conflict resolution, dynamic role assignment, attribute-based policy rules, permission templates,
 * access control inheritance, security group hierarchies, permission scope management, resource
 * ownership tracking, permission request workflows, approval chains, permission revocation,
 * compliance reporting, security posture analysis, and HIPAA-compliant access control with full audit trails.
 */

import {
  Model,
  Sequelize,
  DataTypes,
  Op,
  Transaction,
  Association,
  HasManyGetAssociationsMixin,
  HasManyAddAssociationMixin,
  HasManyHasAssociationMixin,
  HasManyCountAssociationsMixin,
  HasManyCreateAssociationMixin,
  BelongsToManyGetAssociationsMixin,
  BelongsToManyAddAssociationMixin,
  BelongsToManyHasAssociationMixin,
  BelongsToManyCountAssociationsMixin,
  BelongsToManyCreateAssociationMixin,
  FindOptions,
  WhereOptions,
  Includeable,
} from 'sequelize';
import {
  Injectable,
  Inject,
  Logger,
  BadRequestException,
  ForbiddenException,
  NotFoundException,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { z } from 'zod';
import * as crypto from 'crypto';
import * as jwt from 'jsonwebtoken';
import Redis from 'ioredis';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Permission action types
 */
export enum PermissionAction {
  CREATE = 'create',
  READ = 'read',
  UPDATE = 'update',
  DELETE = 'delete',
  EXECUTE = 'execute',
  MANAGE = 'manage',
  APPROVE = 'approve',
  REJECT = 'reject',
  SHARE = 'share',
  EXPORT = 'export',
  IMPORT = 'import',
  ARCHIVE = 'archive',
}

/**
 * Resource types for permission management
 */
export enum ResourceType {
  USER = 'user',
  ROLE = 'role',
  PERMISSION = 'permission',
  SECURITY_GROUP = 'security_group',
  PATIENT = 'patient',
  MEDICAL_RECORD = 'medical_record',
  APPOINTMENT = 'appointment',
  PRESCRIPTION = 'prescription',
  LAB_RESULT = 'lab_result',
  BILLING = 'billing',
  REPORT = 'report',
  DOCUMENT = 'document',
  ASSET = 'asset',
  CUSTOM = 'custom',
}

/**
 * Access control policy effect
 */
export enum PolicyEffect {
  ALLOW = 'allow',
  DENY = 'deny',
}

/**
 * Permission scope levels
 */
export enum PermissionScope {
  GLOBAL = 'global',
  ORGANIZATION = 'organization',
  DEPARTMENT = 'department',
  TEAM = 'team',
  PERSONAL = 'personal',
}

/**
 * Access grant status
 */
export enum AccessGrantStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  ACTIVE = 'active',
  EXPIRED = 'expired',
  REVOKED = 'revoked',
}

/**
 * Role entity interface
 */
export interface IRole {
  id: string;
  name: string;
  description?: string;
  parentRoleId?: string;
  level: number;
  isSystem: boolean;
  scope: PermissionScope;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Permission entity interface
 */
export interface IPermission {
  id: string;
  name: string;
  description?: string;
  resource: ResourceType;
  action: PermissionAction;
  conditions?: Record<string, any>;
  effect: PolicyEffect;
  priority: number;
  isSystem: boolean;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Security group interface
 */
export interface ISecurityGroup {
  id: string;
  name: string;
  description?: string;
  parentGroupId?: string;
  level: number;
  scope: PermissionScope;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * User interface (simplified for access control)
 */
export interface IUser {
  id: string;
  email: string;
  attributes?: Record<string, any>;
  metadata?: Record<string, any>;
}

/**
 * Access control list entry
 */
export interface IAclEntry {
  id: string;
  resourceType: ResourceType;
  resourceId: string;
  principalType: 'user' | 'role' | 'group';
  principalId: string;
  action: PermissionAction;
  effect: PolicyEffect;
  conditions?: Record<string, any>;
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Access grant for temporary permissions
 */
export interface IAccessGrant {
  id: string;
  userId: string;
  roleId?: string;
  permissionId?: string;
  grantedBy: string;
  approvedBy?: string;
  status: AccessGrantStatus;
  reason?: string;
  startsAt: Date;
  expiresAt: Date;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Permission audit log entry
 */
export interface IPermissionAuditLog {
  id: string;
  userId: string;
  action: string;
  resource: ResourceType;
  resourceId: string;
  permissionId?: string;
  roleId?: string;
  result: 'allowed' | 'denied';
  reason?: string;
  context?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  timestamp: Date;
}

/**
 * ABAC policy rule
 */
export interface IAbacPolicy {
  id: string;
  name: string;
  description?: string;
  resource: ResourceType;
  action: PermissionAction;
  effect: PolicyEffect;
  conditions: {
    user?: Record<string, any>;
    resource?: Record<string, any>;
    environment?: Record<string, any>;
  };
  priority: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Permission evaluation context
 */
export interface PermissionContext {
  user: IUser;
  resource?: {
    type: ResourceType;
    id: string;
    attributes?: Record<string, any>;
    ownerId?: string;
  };
  environment?: {
    ipAddress?: string;
    timestamp?: Date;
    location?: string;
    deviceType?: string;
    sessionId?: string;
  };
  requestedAction: PermissionAction;
}

/**
 * Permission check result
 */
export interface PermissionCheckResult {
  allowed: boolean;
  reason?: string;
  matchedPolicies?: string[];
  deniedBy?: string;
  requiresApproval?: boolean;
  metadata?: Record<string, any>;
}

/**
 * Role hierarchy node
 */
export interface RoleHierarchyNode {
  role: IRole;
  parent?: RoleHierarchyNode;
  children: RoleHierarchyNode[];
  inheritedPermissions: IPermission[];
  directPermissions: IPermission[];
}

/**
 * Permission matrix entry
 */
export interface PermissionMatrixEntry {
  roleId: string;
  roleName: string;
  resource: ResourceType;
  permissions: {
    [key in PermissionAction]?: boolean;
  };
}

// ============================================================================
// VALIDATION SCHEMAS
// ============================================================================

/**
 * Role creation schema
 */
export const RoleSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().optional(),
  parentRoleId: z.string().uuid().optional(),
  scope: z.nativeEnum(PermissionScope),
  metadata: z.record(z.any()).optional(),
});

/**
 * Permission creation schema
 */
export const PermissionSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().optional(),
  resource: z.nativeEnum(ResourceType),
  action: z.nativeEnum(PermissionAction),
  conditions: z.record(z.any()).optional(),
  effect: z.nativeEnum(PolicyEffect),
  priority: z.number().int().min(0).max(1000).default(500),
  metadata: z.record(z.any()).optional(),
});

/**
 * Security group creation schema
 */
export const SecurityGroupSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().optional(),
  parentGroupId: z.string().uuid().optional(),
  scope: z.nativeEnum(PermissionScope),
  metadata: z.record(z.any()).optional(),
});

/**
 * ACL entry schema
 */
export const AclEntrySchema = z.object({
  resourceType: z.nativeEnum(ResourceType),
  resourceId: z.string(),
  principalType: z.enum(['user', 'role', 'group']),
  principalId: z.string().uuid(),
  action: z.nativeEnum(PermissionAction),
  effect: z.nativeEnum(PolicyEffect),
  conditions: z.record(z.any()).optional(),
  expiresAt: z.date().optional(),
});

/**
 * Access grant request schema
 */
export const AccessGrantSchema = z.object({
  userId: z.string().uuid(),
  roleId: z.string().uuid().optional(),
  permissionId: z.string().uuid().optional(),
  reason: z.string().optional(),
  startsAt: z.date(),
  expiresAt: z.date(),
  metadata: z.record(z.any()).optional(),
});

/**
 * ABAC policy schema
 */
export const AbacPolicySchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().optional(),
  resource: z.nativeEnum(ResourceType),
  action: z.nativeEnum(PermissionAction),
  effect: z.nativeEnum(PolicyEffect),
  conditions: z.object({
    user: z.record(z.any()).optional(),
    resource: z.record(z.any()).optional(),
    environment: z.record(z.any()).optional(),
  }),
  priority: z.number().int().min(0).max(1000).default(500),
});

// ============================================================================
// SEQUELIZE MODEL DEFINITIONS
// ============================================================================

/**
 * Role model with hierarchical structure
 */
export class Role extends Model<IRole> implements IRole {
  public id!: string;
  public name!: string;
  public description?: string;
  public parentRoleId?: string;
  public level!: number;
  public isSystem!: boolean;
  public scope!: PermissionScope;
  public metadata?: Record<string, any>;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Association mixins
  public getPermissions!: BelongsToManyGetAssociationsMixin<Permission>;
  public addPermission!: BelongsToManyAddAssociationMixin<Permission, string>;
  public hasPermission!: BelongsToManyHasAssociationMixin<Permission, string>;
  public countPermissions!: BelongsToManyCountAssociationsMixin;

  public getUsers!: BelongsToManyGetAssociationsMixin<User>;
  public addUser!: BelongsToManyAddAssociationMixin<User, string>;
  public hasUser!: BelongsToManyHasAssociationMixin<User, string>;
  public countUsers!: BelongsToManyCountAssociationsMixin;

  public getChildren!: HasManyGetAssociationsMixin<Role>;
  public addChild!: HasManyAddAssociationMixin<Role, string>;
  public countChildren!: HasManyCountAssociationsMixin;

  // Associations
  public static associations: {
    permissions: Association.BelongsToMany<Role, Permission>;
    users: Association.BelongsToMany<Role, User>;
    parentRole: Association.BelongsTo<Role, Role>;
    childRoles: Association.HasMany<Role, Role>;
  };
}

/**
 * Permission model
 */
export class Permission extends Model<IPermission> implements IPermission {
  public id!: string;
  public name!: string;
  public description?: string;
  public resource!: ResourceType;
  public action!: PermissionAction;
  public conditions?: Record<string, any>;
  public effect!: PolicyEffect;
  public priority!: number;
  public isSystem!: boolean;
  public metadata?: Record<string, any>;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Association mixins
  public getRoles!: BelongsToManyGetAssociationsMixin<Role>;
  public addRole!: BelongsToManyAddAssociationMixin<Role, string>;
  public hasRole!: BelongsToManyHasAssociationMixin<Role, string>;
  public countRoles!: BelongsToManyCountAssociationsMixin;

  public getUsers!: BelongsToManyGetAssociationsMixin<User>;
  public addUser!: BelongsToManyAddAssociationMixin<User, string>;
  public hasUser!: BelongsToManyHasAssociationMixin<User, string>;
  public countUsers!: BelongsToManyCountAssociationsMixin;

  // Associations
  public static associations: {
    roles: Association.BelongsToMany<Permission, Role>;
    users: Association.BelongsToMany<Permission, User>;
  };
}

/**
 * Security group model with hierarchical structure
 */
export class SecurityGroup extends Model<ISecurityGroup> implements ISecurityGroup {
  public id!: string;
  public name!: string;
  public description?: string;
  public parentGroupId?: string;
  public level!: number;
  public scope!: PermissionScope;
  public metadata?: Record<string, any>;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Association mixins
  public getUsers!: BelongsToManyGetAssociationsMixin<User>;
  public addUser!: BelongsToManyAddAssociationMixin<User, string>;
  public hasUser!: BelongsToManyHasAssociationMixin<User, string>;
  public countUsers!: BelongsToManyCountAssociationsMixin;

  public getRoles!: BelongsToManyGetAssociationsMixin<Role>;
  public addRole!: BelongsToManyAddAssociationMixin<Role, string>;
  public hasRole!: BelongsToManyHasAssociationMixin<Role, string>;
  public countRoles!: BelongsToManyCountAssociationsMixin;

  public getChildren!: HasManyGetAssociationsMixin<SecurityGroup>;
  public addChild!: HasManyAddAssociationMixin<SecurityGroup, string>;
  public countChildren!: HasManyCountAssociationsMixin;

  // Associations
  public static associations: {
    users: Association.BelongsToMany<SecurityGroup, User>;
    roles: Association.BelongsToMany<SecurityGroup, Role>;
    parentGroup: Association.BelongsTo<SecurityGroup, SecurityGroup>;
    childGroups: Association.HasMany<SecurityGroup, SecurityGroup>;
  };
}

/**
 * User model (simplified for access control)
 */
export class User extends Model<IUser> implements IUser {
  public id!: string;
  public email!: string;
  public attributes?: Record<string, any>;
  public metadata?: Record<string, any>;

  // Association mixins
  public getRoles!: BelongsToManyGetAssociationsMixin<Role>;
  public addRole!: BelongsToManyAddAssociationMixin<Role, string>;
  public hasRole!: BelongsToManyHasAssociationMixin<Role, string>;
  public countRoles!: BelongsToManyCountAssociationsMixin;

  public getPermissions!: BelongsToManyGetAssociationsMixin<Permission>;
  public addPermission!: BelongsToManyAddAssociationMixin<Permission, string>;
  public hasPermission!: BelongsToManyHasAssociationMixin<Permission, string>;
  public countPermissions!: BelongsToManyCountAssociationsMixin;

  public getSecurityGroups!: BelongsToManyGetAssociationsMixin<SecurityGroup>;
  public addSecurityGroup!: BelongsToManyAddAssociationMixin<SecurityGroup, string>;
  public hasSecurityGroup!: BelongsToManyHasAssociationMixin<SecurityGroup, string>;
  public countSecurityGroups!: BelongsToManyCountAssociationsMixin;

  // Associations
  public static associations: {
    roles: Association.BelongsToMany<User, Role>;
    permissions: Association.BelongsToMany<User, Permission>;
    securityGroups: Association.BelongsToMany<User, SecurityGroup>;
  };
}

/**
 * ACL entry model
 */
export class AclEntry extends Model<IAclEntry> implements IAclEntry {
  public id!: string;
  public resourceType!: ResourceType;
  public resourceId!: string;
  public principalType!: 'user' | 'role' | 'group';
  public principalId!: string;
  public action!: PermissionAction;
  public effect!: PolicyEffect;
  public conditions?: Record<string, any>;
  public expiresAt?: Date;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

/**
 * Access grant model
 */
export class AccessGrant extends Model<IAccessGrant> implements IAccessGrant {
  public id!: string;
  public userId!: string;
  public roleId?: string;
  public permissionId?: string;
  public grantedBy!: string;
  public approvedBy?: string;
  public status!: AccessGrantStatus;
  public reason?: string;
  public startsAt!: Date;
  public expiresAt!: Date;
  public metadata?: Record<string, any>;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

/**
 * Permission audit log model
 */
export class PermissionAuditLog extends Model<IPermissionAuditLog> implements IPermissionAuditLog {
  public id!: string;
  public userId!: string;
  public action!: string;
  public resource!: ResourceType;
  public resourceId!: string;
  public permissionId?: string;
  public roleId?: string;
  public result!: 'allowed' | 'denied';
  public reason?: string;
  public context?: Record<string, any>;
  public ipAddress?: string;
  public userAgent?: string;
  public readonly timestamp!: Date;
}

/**
 * ABAC policy model
 */
export class AbacPolicy extends Model<IAbacPolicy> implements IAbacPolicy {
  public id!: string;
  public name!: string;
  public description?: string;
  public resource!: ResourceType;
  public action!: PermissionAction;
  public effect!: PolicyEffect;
  public conditions!: {
    user?: Record<string, any>;
    resource?: Record<string, any>;
    environment?: Record<string, any>;
  };
  public priority!: number;
  public isActive!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// ============================================================================
// MODEL INITIALIZATION & ASSOCIATIONS
// ============================================================================

/**
 * Initialize all security access control models
 *
 * @param sequelize - Sequelize instance
 * @returns Initialized models
 *
 * @example
 * ```typescript
 * const models = initializeSecurityModels(sequelize);
 * ```
 */
export function initializeSecurityModels(sequelize: Sequelize): {
  Role: typeof Role;
  Permission: typeof Permission;
  SecurityGroup: typeof SecurityGroup;
  User: typeof User;
  AclEntry: typeof AclEntry;
  AccessGrant: typeof AccessGrant;
  PermissionAuditLog: typeof PermissionAuditLog;
  AbacPolicy: typeof AbacPolicy;
} {
  // Initialize Role model
  Role.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      parentRoleId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: 'roles',
          key: 'id',
        },
      },
      level: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      isSystem: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      scope: {
        type: DataTypes.ENUM(...Object.values(PermissionScope)),
        allowNull: false,
        defaultValue: PermissionScope.ORGANIZATION,
      },
      metadata: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: 'Role',
      tableName: 'roles',
      indexes: [
        { fields: ['name'], unique: true },
        { fields: ['parentRoleId'] },
        { fields: ['level'] },
        { fields: ['scope'] },
      ],
    }
  );

  // Initialize Permission model
  Permission.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      resource: {
        type: DataTypes.ENUM(...Object.values(ResourceType)),
        allowNull: false,
      },
      action: {
        type: DataTypes.ENUM(...Object.values(PermissionAction)),
        allowNull: false,
      },
      conditions: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
      effect: {
        type: DataTypes.ENUM(...Object.values(PolicyEffect)),
        allowNull: false,
        defaultValue: PolicyEffect.ALLOW,
      },
      priority: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 500,
      },
      isSystem: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      metadata: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: 'Permission',
      tableName: 'permissions',
      indexes: [
        { fields: ['name'], unique: true },
        { fields: ['resource', 'action'] },
        { fields: ['priority'] },
      ],
    }
  );

  // Initialize SecurityGroup model
  SecurityGroup.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      parentGroupId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: 'security_groups',
          key: 'id',
        },
      },
      level: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      scope: {
        type: DataTypes.ENUM(...Object.values(PermissionScope)),
        allowNull: false,
        defaultValue: PermissionScope.ORGANIZATION,
      },
      metadata: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: 'SecurityGroup',
      tableName: 'security_groups',
      indexes: [
        { fields: ['name'], unique: true },
        { fields: ['parentGroupId'] },
        { fields: ['level'] },
        { fields: ['scope'] },
      ],
    }
  );

  // Initialize User model
  User.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
      },
      attributes: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
      metadata: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'User',
      tableName: 'users',
      indexes: [{ fields: ['email'], unique: true }],
    }
  );

  // Initialize AclEntry model
  AclEntry.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      resourceType: {
        type: DataTypes.ENUM(...Object.values(ResourceType)),
        allowNull: false,
      },
      resourceId: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      principalType: {
        type: DataTypes.ENUM('user', 'role', 'group'),
        allowNull: false,
      },
      principalId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      action: {
        type: DataTypes.ENUM(...Object.values(PermissionAction)),
        allowNull: false,
      },
      effect: {
        type: DataTypes.ENUM(...Object.values(PolicyEffect)),
        allowNull: false,
        defaultValue: PolicyEffect.ALLOW,
      },
      conditions: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
      expiresAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: 'AclEntry',
      tableName: 'acl_entries',
      indexes: [
        { fields: ['resourceType', 'resourceId'] },
        { fields: ['principalType', 'principalId'] },
        { fields: ['expiresAt'] },
      ],
    }
  );

  // Initialize AccessGrant model
  AccessGrant.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      roleId: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      permissionId: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      grantedBy: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      approvedBy: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM(...Object.values(AccessGrantStatus)),
        allowNull: false,
        defaultValue: AccessGrantStatus.PENDING,
      },
      reason: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      startsAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      expiresAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      metadata: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: 'AccessGrant',
      tableName: 'access_grants',
      indexes: [
        { fields: ['userId'] },
        { fields: ['status'] },
        { fields: ['expiresAt'] },
        { fields: ['startsAt'] },
      ],
    }
  );

  // Initialize PermissionAuditLog model
  PermissionAuditLog.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      action: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      resource: {
        type: DataTypes.ENUM(...Object.values(ResourceType)),
        allowNull: false,
      },
      resourceId: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      permissionId: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      roleId: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      result: {
        type: DataTypes.ENUM('allowed', 'denied'),
        allowNull: false,
      },
      reason: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      context: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
      ipAddress: {
        type: DataTypes.STRING(45),
        allowNull: true,
      },
      userAgent: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      timestamp: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: 'PermissionAuditLog',
      tableName: 'permission_audit_logs',
      timestamps: false,
      indexes: [
        { fields: ['userId'] },
        { fields: ['resource', 'resourceId'] },
        { fields: ['timestamp'] },
        { fields: ['result'] },
      ],
    }
  );

  // Initialize AbacPolicy model
  AbacPolicy.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      resource: {
        type: DataTypes.ENUM(...Object.values(ResourceType)),
        allowNull: false,
      },
      action: {
        type: DataTypes.ENUM(...Object.values(PermissionAction)),
        allowNull: false,
      },
      effect: {
        type: DataTypes.ENUM(...Object.values(PolicyEffect)),
        allowNull: false,
        defaultValue: PolicyEffect.ALLOW,
      },
      conditions: {
        type: DataTypes.JSONB,
        allowNull: false,
      },
      priority: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 500,
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: 'AbacPolicy',
      tableName: 'abac_policies',
      indexes: [
        { fields: ['name'], unique: true },
        { fields: ['resource', 'action'] },
        { fields: ['priority'] },
        { fields: ['isActive'] },
      ],
    }
  );

  // Define associations
  defineSecurityAssociations();

  return {
    Role,
    Permission,
    SecurityGroup,
    User,
    AclEntry,
    AccessGrant,
    PermissionAuditLog,
    AbacPolicy,
  };
}

/**
 * Define all security model associations
 *
 * @example
 * ```typescript
 * defineSecurityAssociations();
 * ```
 */
export function defineSecurityAssociations(): void {
  // Role-Permission many-to-many
  Role.belongsToMany(Permission, {
    through: 'role_permissions',
    foreignKey: 'roleId',
    otherKey: 'permissionId',
    as: 'permissions',
  });

  Permission.belongsToMany(Role, {
    through: 'role_permissions',
    foreignKey: 'permissionId',
    otherKey: 'roleId',
    as: 'roles',
  });

  // User-Role many-to-many
  User.belongsToMany(Role, {
    through: 'user_roles',
    foreignKey: 'userId',
    otherKey: 'roleId',
    as: 'roles',
  });

  Role.belongsToMany(User, {
    through: 'user_roles',
    foreignKey: 'roleId',
    otherKey: 'userId',
    as: 'users',
  });

  // User-Permission many-to-many (direct permissions)
  User.belongsToMany(Permission, {
    through: 'user_permissions',
    foreignKey: 'userId',
    otherKey: 'permissionId',
    as: 'permissions',
  });

  Permission.belongsToMany(User, {
    through: 'user_permissions',
    foreignKey: 'permissionId',
    otherKey: 'userId',
    as: 'users',
  });

  // User-SecurityGroup many-to-many
  User.belongsToMany(SecurityGroup, {
    through: 'user_security_groups',
    foreignKey: 'userId',
    otherKey: 'groupId',
    as: 'securityGroups',
  });

  SecurityGroup.belongsToMany(User, {
    through: 'user_security_groups',
    foreignKey: 'groupId',
    otherKey: 'userId',
    as: 'users',
  });

  // SecurityGroup-Role many-to-many
  SecurityGroup.belongsToMany(Role, {
    through: 'group_roles',
    foreignKey: 'groupId',
    otherKey: 'roleId',
    as: 'roles',
  });

  Role.belongsToMany(SecurityGroup, {
    through: 'group_roles',
    foreignKey: 'roleId',
    otherKey: 'groupId',
    as: 'securityGroups',
  });

  // Role hierarchical self-reference
  Role.belongsTo(Role, {
    foreignKey: 'parentRoleId',
    as: 'parentRole',
  });

  Role.hasMany(Role, {
    foreignKey: 'parentRoleId',
    as: 'childRoles',
  });

  // SecurityGroup hierarchical self-reference
  SecurityGroup.belongsTo(SecurityGroup, {
    foreignKey: 'parentGroupId',
    as: 'parentGroup',
  });

  SecurityGroup.hasMany(SecurityGroup, {
    foreignKey: 'parentGroupId',
    as: 'childGroups',
  });
}

// ============================================================================
// ROLE-BASED ACCESS CONTROL (RBAC) FUNCTIONS
// ============================================================================

/**
 * Create a new role with hierarchical support
 *
 * @param roleData - Role creation data
 * @param transaction - Optional database transaction
 * @returns Created role
 *
 * @example
 * ```typescript
 * const adminRole = await createRole({
 *   name: 'Administrator',
 *   description: 'Full system access',
 *   scope: PermissionScope.GLOBAL,
 * });
 * ```
 */
export async function createRole(
  roleData: z.infer<typeof RoleSchema>,
  transaction?: Transaction
): Promise<Role> {
  const validated = RoleSchema.parse(roleData);

  // Calculate role level based on parent
  let level = 0;
  if (validated.parentRoleId) {
    const parentRole = await Role.findByPk(validated.parentRoleId, { transaction });
    if (!parentRole) {
      throw new NotFoundException('Parent role not found');
    }
    level = parentRole.level + 1;
  }

  const role = await Role.create(
    {
      ...validated,
      level,
      isSystem: false,
    },
    { transaction }
  );

  return role;
}

/**
 * Get role hierarchy tree starting from a role
 *
 * @param roleId - Role identifier
 * @param maxDepth - Maximum depth to traverse (default: 10)
 * @returns Role hierarchy tree
 *
 * @example
 * ```typescript
 * const hierarchy = await getRoleHierarchy('admin-role-id');
 * ```
 */
export async function getRoleHierarchy(
  roleId: string,
  maxDepth: number = 10
): Promise<RoleHierarchyNode> {
  const role = await Role.findByPk(roleId, {
    include: [
      {
        model: Permission,
        as: 'permissions',
        through: { attributes: [] },
      },
    ],
  });

  if (!role) {
    throw new NotFoundException('Role not found');
  }

  const node: RoleHierarchyNode = {
    role,
    children: [],
    directPermissions: await role.getPermissions(),
    inheritedPermissions: [],
  };

  // Get parent recursively
  if (role.parentRoleId && maxDepth > 0) {
    const parentNode = await getRoleHierarchy(role.parentRoleId, maxDepth - 1);
    node.parent = parentNode;
    node.inheritedPermissions = [
      ...parentNode.directPermissions,
      ...parentNode.inheritedPermissions,
    ];
  }

  // Get children
  const childRoles = await Role.findAll({
    where: { parentRoleId: roleId },
    include: [
      {
        model: Permission,
        as: 'permissions',
        through: { attributes: [] },
      },
    ],
  });

  if (maxDepth > 0) {
    for (const childRole of childRoles) {
      const childNode = await getRoleHierarchy(childRole.id, maxDepth - 1);
      node.children.push(childNode);
    }
  }

  return node;
}

/**
 * Assign role to user with validation
 *
 * @param userId - User identifier
 * @param roleId - Role identifier
 * @param transaction - Optional database transaction
 * @returns Success status
 *
 * @example
 * ```typescript
 * await assignRoleToUser('user-id', 'role-id');
 * ```
 */
export async function assignRoleToUser(
  userId: string,
  roleId: string,
  transaction?: Transaction
): Promise<boolean> {
  const user = await User.findByPk(userId, { transaction });
  if (!user) {
    throw new NotFoundException('User not found');
  }

  const role = await Role.findByPk(roleId, { transaction });
  if (!role) {
    throw new NotFoundException('Role not found');
  }

  // Check if user already has this role
  const hasRole = await user.hasRole(role);
  if (hasRole) {
    return true;
  }

  await user.addRole(role, { transaction });
  return true;
}

/**
 * Remove role from user
 *
 * @param userId - User identifier
 * @param roleId - Role identifier
 * @param transaction - Optional database transaction
 * @returns Success status
 *
 * @example
 * ```typescript
 * await removeRoleFromUser('user-id', 'role-id');
 * ```
 */
export async function removeRoleFromUser(
  userId: string,
  roleId: string,
  transaction?: Transaction
): Promise<boolean> {
  const user = await User.findByPk(userId, { transaction });
  if (!user) {
    throw new NotFoundException('User not found');
  }

  const role = await Role.findByPk(roleId, { transaction });
  if (!role) {
    throw new NotFoundException('Role not found');
  }

  await user.removeRole(role, { transaction });
  return true;
}

/**
 * Get all roles for a user including inherited roles
 *
 * @param userId - User identifier
 * @param includeInherited - Include roles from parent roles and groups
 * @returns Array of roles
 *
 * @example
 * ```typescript
 * const roles = await getUserRoles('user-id', true);
 * ```
 */
export async function getUserRoles(
  userId: string,
  includeInherited: boolean = true
): Promise<Role[]> {
  const user = await User.findByPk(userId, {
    include: [
      {
        model: Role,
        as: 'roles',
        through: { attributes: [] },
      },
      {
        model: SecurityGroup,
        as: 'securityGroups',
        through: { attributes: [] },
        include: [
          {
            model: Role,
            as: 'roles',
            through: { attributes: [] },
          },
        ],
      },
    ],
  });

  if (!user) {
    throw new NotFoundException('User not found');
  }

  const directRoles = await user.getRoles();
  if (!includeInherited) {
    return directRoles;
  }

  const allRoles = new Map<string, Role>();

  // Add direct roles
  for (const role of directRoles) {
    allRoles.set(role.id, role);
  }

  // Add roles from security groups
  const groups = await user.getSecurityGroups({
    include: [
      {
        model: Role,
        as: 'roles',
        through: { attributes: [] },
      },
    ],
  });

  for (const group of groups) {
    const groupRoles = await group.getRoles();
    for (const role of groupRoles) {
      allRoles.set(role.id, role);
    }
  }

  // Add inherited roles from parent roles
  for (const role of Array.from(allRoles.values())) {
    if (role.parentRoleId) {
      const parentHierarchy = await getRoleHierarchy(role.parentRoleId);
      const collectParentRoles = (node: RoleHierarchyNode) => {
        allRoles.set(node.role.id, node.role);
        if (node.parent) {
          collectParentRoles(node.parent);
        }
      };
      if (parentHierarchy.parent) {
        collectParentRoles(parentHierarchy.parent);
      }
    }
  }

  return Array.from(allRoles.values());
}

/**
 * Assign permission to role
 *
 * @param roleId - Role identifier
 * @param permissionId - Permission identifier
 * @param transaction - Optional database transaction
 * @returns Success status
 *
 * @example
 * ```typescript
 * await assignPermissionToRole('role-id', 'permission-id');
 * ```
 */
export async function assignPermissionToRole(
  roleId: string,
  permissionId: string,
  transaction?: Transaction
): Promise<boolean> {
  const role = await Role.findByPk(roleId, { transaction });
  if (!role) {
    throw new NotFoundException('Role not found');
  }

  const permission = await Permission.findByPk(permissionId, { transaction });
  if (!permission) {
    throw new NotFoundException('Permission not found');
  }

  await role.addPermission(permission, { transaction });
  return true;
}

// ============================================================================
// PERMISSION MANAGEMENT
// ============================================================================

/**
 * Create a new permission
 *
 * @param permissionData - Permission creation data
 * @param transaction - Optional database transaction
 * @returns Created permission
 *
 * @example
 * ```typescript
 * const permission = await createPermission({
 *   name: 'patient.read',
 *   resource: ResourceType.PATIENT,
 *   action: PermissionAction.READ,
 *   effect: PolicyEffect.ALLOW,
 * });
 * ```
 */
export async function createPermission(
  permissionData: z.infer<typeof PermissionSchema>,
  transaction?: Transaction
): Promise<Permission> {
  const validated = PermissionSchema.parse(permissionData);

  const permission = await Permission.create(
    {
      ...validated,
      isSystem: false,
    },
    { transaction }
  );

  return permission;
}

/**
 * Get all permissions for a user including role-based and direct permissions
 *
 * @param userId - User identifier
 * @param includeInherited - Include permissions from parent roles
 * @returns Array of permissions
 *
 * @example
 * ```typescript
 * const permissions = await getUserPermissions('user-id', true);
 * ```
 */
export async function getUserPermissions(
  userId: string,
  includeInherited: boolean = true
): Promise<Permission[]> {
  const user = await User.findByPk(userId, {
    include: [
      {
        model: Permission,
        as: 'permissions',
        through: { attributes: [] },
      },
    ],
  });

  if (!user) {
    throw new NotFoundException('User not found');
  }

  const allPermissions = new Map<string, Permission>();

  // Add direct permissions
  const directPermissions = await user.getPermissions();
  for (const permission of directPermissions) {
    allPermissions.set(permission.id, permission);
  }

  if (includeInherited) {
    // Get all roles (including inherited)
    const roles = await getUserRoles(userId, true);

    // Get permissions from all roles
    for (const role of roles) {
      const rolePermissions = await role.getPermissions();
      for (const permission of rolePermissions) {
        allPermissions.set(permission.id, permission);
      }
    }
  }

  return Array.from(allPermissions.values());
}

/**
 * Grant direct permission to user
 *
 * @param userId - User identifier
 * @param permissionId - Permission identifier
 * @param transaction - Optional database transaction
 * @returns Success status
 *
 * @example
 * ```typescript
 * await grantPermissionToUser('user-id', 'permission-id');
 * ```
 */
export async function grantPermissionToUser(
  userId: string,
  permissionId: string,
  transaction?: Transaction
): Promise<boolean> {
  const user = await User.findByPk(userId, { transaction });
  if (!user) {
    throw new NotFoundException('User not found');
  }

  const permission = await Permission.findByPk(permissionId, { transaction });
  if (!permission) {
    throw new NotFoundException('Permission not found');
  }

  await user.addPermission(permission, { transaction });
  return true;
}

/**
 * Revoke direct permission from user
 *
 * @param userId - User identifier
 * @param permissionId - Permission identifier
 * @param transaction - Optional database transaction
 * @returns Success status
 *
 * @example
 * ```typescript
 * await revokePermissionFromUser('user-id', 'permission-id');
 * ```
 */
export async function revokePermissionFromUser(
  userId: string,
  permissionId: string,
  transaction?: Transaction
): Promise<boolean> {
  const user = await User.findByPk(userId, { transaction });
  if (!user) {
    throw new NotFoundException('User not found');
  }

  const permission = await Permission.findByPk(permissionId, { transaction });
  if (!permission) {
    throw new NotFoundException('Permission not found');
  }

  await user.removePermission(permission, { transaction });
  return true;
}

/**
 * Build permission matrix for all roles
 *
 * @param resourceType - Optional filter by resource type
 * @returns Permission matrix
 *
 * @example
 * ```typescript
 * const matrix = await buildPermissionMatrix(ResourceType.PATIENT);
 * ```
 */
export async function buildPermissionMatrix(
  resourceType?: ResourceType
): Promise<PermissionMatrixEntry[]> {
  const whereClause: WhereOptions<IPermission> = resourceType
    ? { resource: resourceType }
    : {};

  const roles = await Role.findAll({
    include: [
      {
        model: Permission,
        as: 'permissions',
        where: whereClause,
        required: false,
        through: { attributes: [] },
      },
    ],
  });

  const matrix: PermissionMatrixEntry[] = [];

  for (const role of roles) {
    const permissions = await role.getPermissions({ where: whereClause });
    const entry: PermissionMatrixEntry = {
      roleId: role.id,
      roleName: role.name,
      resource: resourceType || ResourceType.CUSTOM,
      permissions: {},
    };

    for (const permission of permissions) {
      if (permission.effect === PolicyEffect.ALLOW) {
        entry.permissions[permission.action] = true;
      }
    }

    matrix.push(entry);
  }

  return matrix;
}

// ============================================================================
// SECURITY GROUPS & HIERARCHIES
// ============================================================================

/**
 * Create a new security group
 *
 * @param groupData - Security group creation data
 * @param transaction - Optional database transaction
 * @returns Created security group
 *
 * @example
 * ```typescript
 * const group = await createSecurityGroup({
 *   name: 'Medical Staff',
 *   description: 'All medical personnel',
 *   scope: PermissionScope.DEPARTMENT,
 * });
 * ```
 */
export async function createSecurityGroup(
  groupData: z.infer<typeof SecurityGroupSchema>,
  transaction?: Transaction
): Promise<SecurityGroup> {
  const validated = SecurityGroupSchema.parse(groupData);

  // Calculate group level based on parent
  let level = 0;
  if (validated.parentGroupId) {
    const parentGroup = await SecurityGroup.findByPk(validated.parentGroupId, {
      transaction,
    });
    if (!parentGroup) {
      throw new NotFoundException('Parent group not found');
    }
    level = parentGroup.level + 1;
  }

  const group = await SecurityGroup.create(
    {
      ...validated,
      level,
    },
    { transaction }
  );

  return group;
}

/**
 * Add user to security group
 *
 * @param userId - User identifier
 * @param groupId - Security group identifier
 * @param transaction - Optional database transaction
 * @returns Success status
 *
 * @example
 * ```typescript
 * await addUserToSecurityGroup('user-id', 'group-id');
 * ```
 */
export async function addUserToSecurityGroup(
  userId: string,
  groupId: string,
  transaction?: Transaction
): Promise<boolean> {
  const user = await User.findByPk(userId, { transaction });
  if (!user) {
    throw new NotFoundException('User not found');
  }

  const group = await SecurityGroup.findByPk(groupId, { transaction });
  if (!group) {
    throw new NotFoundException('Security group not found');
  }

  await user.addSecurityGroup(group, { transaction });
  return true;
}

/**
 * Remove user from security group
 *
 * @param userId - User identifier
 * @param groupId - Security group identifier
 * @param transaction - Optional database transaction
 * @returns Success status
 *
 * @example
 * ```typescript
 * await removeUserFromSecurityGroup('user-id', 'group-id');
 * ```
 */
export async function removeUserFromSecurityGroup(
  userId: string,
  groupId: string,
  transaction?: Transaction
): Promise<boolean> {
  const user = await User.findByPk(userId, { transaction });
  if (!user) {
    throw new NotFoundException('User not found');
  }

  const group = await SecurityGroup.findByPk(groupId, { transaction });
  if (!group) {
    throw new NotFoundException('Security group not found');
  }

  await user.removeSecurityGroup(group, { transaction });
  return true;
}

/**
 * Get all security groups for a user including parent groups
 *
 * @param userId - User identifier
 * @param includeParents - Include parent groups in hierarchy
 * @returns Array of security groups
 *
 * @example
 * ```typescript
 * const groups = await getUserSecurityGroups('user-id', true);
 * ```
 */
export async function getUserSecurityGroups(
  userId: string,
  includeParents: boolean = true
): Promise<SecurityGroup[]> {
  const user = await User.findByPk(userId, {
    include: [
      {
        model: SecurityGroup,
        as: 'securityGroups',
        through: { attributes: [] },
      },
    ],
  });

  if (!user) {
    throw new NotFoundException('User not found');
  }

  const allGroups = new Map<string, SecurityGroup>();
  const directGroups = await user.getSecurityGroups();

  for (const group of directGroups) {
    allGroups.set(group.id, group);

    if (includeParents && group.parentGroupId) {
      // Recursively get parent groups
      const addParentGroups = async (groupId: string) => {
        const parentGroup = await SecurityGroup.findByPk(groupId);
        if (parentGroup) {
          allGroups.set(parentGroup.id, parentGroup);
          if (parentGroup.parentGroupId) {
            await addParentGroups(parentGroup.parentGroupId);
          }
        }
      };
      await addParentGroups(group.parentGroupId);
    }
  }

  return Array.from(allGroups.values());
}

/**
 * Assign role to security group
 *
 * @param groupId - Security group identifier
 * @param roleId - Role identifier
 * @param transaction - Optional database transaction
 * @returns Success status
 *
 * @example
 * ```typescript
 * await assignRoleToSecurityGroup('group-id', 'role-id');
 * ```
 */
export async function assignRoleToSecurityGroup(
  groupId: string,
  roleId: string,
  transaction?: Transaction
): Promise<boolean> {
  const group = await SecurityGroup.findByPk(groupId, { transaction });
  if (!group) {
    throw new NotFoundException('Security group not found');
  }

  const role = await Role.findByPk(roleId, { transaction });
  if (!role) {
    throw new NotFoundException('Role not found');
  }

  await group.addRole(role, { transaction });
  return true;
}

// ============================================================================
// ACCESS CONTROL LIST (ACL) MANAGEMENT
// ============================================================================

/**
 * Create ACL entry for resource-level permissions
 *
 * @param aclData - ACL entry data
 * @param transaction - Optional database transaction
 * @returns Created ACL entry
 *
 * @example
 * ```typescript
 * const acl = await createAclEntry({
 *   resourceType: ResourceType.PATIENT,
 *   resourceId: 'patient-123',
 *   principalType: 'user',
 *   principalId: 'user-id',
 *   action: PermissionAction.READ,
 *   effect: PolicyEffect.ALLOW,
 * });
 * ```
 */
export async function createAclEntry(
  aclData: z.infer<typeof AclEntrySchema>,
  transaction?: Transaction
): Promise<AclEntry> {
  const validated = AclEntrySchema.parse(aclData);

  const acl = await AclEntry.create(validated, { transaction });

  return acl;
}

/**
 * Check ACL permission for a resource
 *
 * @param resourceType - Resource type
 * @param resourceId - Resource identifier
 * @param userId - User identifier
 * @param action - Requested action
 * @returns Permission check result
 *
 * @example
 * ```typescript
 * const result = await checkAclPermission(
 *   ResourceType.PATIENT,
 *   'patient-123',
 *   'user-id',
 *   PermissionAction.READ
 * );
 * ```
 */
export async function checkAclPermission(
  resourceType: ResourceType,
  resourceId: string,
  userId: string,
  action: PermissionAction
): Promise<PermissionCheckResult> {
  const now = new Date();

  // Get user's roles and groups
  const user = await User.findByPk(userId, {
    include: [
      {
        model: Role,
        as: 'roles',
        through: { attributes: [] },
      },
      {
        model: SecurityGroup,
        as: 'securityGroups',
        through: { attributes: [] },
      },
    ],
  });

  if (!user) {
    return {
      allowed: false,
      reason: 'User not found',
    };
  }

  const roles = await user.getRoles();
  const groups = await user.getSecurityGroups();

  const principalIds = [
    userId,
    ...roles.map((r) => r.id),
    ...groups.map((g) => g.id),
  ];

  // Find ACL entries
  const aclEntries = await AclEntry.findAll({
    where: {
      resourceType,
      resourceId,
      principalId: { [Op.in]: principalIds },
      action,
      [Op.or]: [{ expiresAt: null }, { expiresAt: { [Op.gt]: now } }],
    },
  });

  // Check for explicit DENY (takes precedence)
  const denyEntry = aclEntries.find((entry) => entry.effect === PolicyEffect.DENY);
  if (denyEntry) {
    return {
      allowed: false,
      reason: 'Explicitly denied by ACL',
      deniedBy: denyEntry.id,
    };
  }

  // Check for ALLOW
  const allowEntry = aclEntries.find((entry) => entry.effect === PolicyEffect.ALLOW);
  if (allowEntry) {
    return {
      allowed: true,
      matchedPolicies: [allowEntry.id],
    };
  }

  return {
    allowed: false,
    reason: 'No matching ACL entry found',
  };
}

/**
 * Get all ACL entries for a resource
 *
 * @param resourceType - Resource type
 * @param resourceId - Resource identifier
 * @returns Array of ACL entries
 *
 * @example
 * ```typescript
 * const acls = await getResourceAcls(ResourceType.PATIENT, 'patient-123');
 * ```
 */
export async function getResourceAcls(
  resourceType: ResourceType,
  resourceId: string
): Promise<AclEntry[]> {
  return await AclEntry.findAll({
    where: {
      resourceType,
      resourceId,
    },
  });
}

/**
 * Remove ACL entry
 *
 * @param aclId - ACL entry identifier
 * @param transaction - Optional database transaction
 * @returns Success status
 *
 * @example
 * ```typescript
 * await removeAclEntry('acl-id');
 * ```
 */
export async function removeAclEntry(
  aclId: string,
  transaction?: Transaction
): Promise<boolean> {
  const acl = await AclEntry.findByPk(aclId, { transaction });
  if (!acl) {
    throw new NotFoundException('ACL entry not found');
  }

  await acl.destroy({ transaction });
  return true;
}

/**
 * Bulk create ACL entries for a resource
 *
 * @param resourceType - Resource type
 * @param resourceId - Resource identifier
 * @param entries - Array of ACL entry data
 * @param transaction - Optional database transaction
 * @returns Created ACL entries
 *
 * @example
 * ```typescript
 * const acls = await bulkCreateAclEntries(
 *   ResourceType.PATIENT,
 *   'patient-123',
 *   [
 *     { principalType: 'user', principalId: 'user-1', action: PermissionAction.READ, effect: PolicyEffect.ALLOW },
 *     { principalType: 'role', principalId: 'role-1', action: PermissionAction.UPDATE, effect: PolicyEffect.ALLOW },
 *   ]
 * );
 * ```
 */
export async function bulkCreateAclEntries(
  resourceType: ResourceType,
  resourceId: string,
  entries: Array<Omit<z.infer<typeof AclEntrySchema>, 'resourceType' | 'resourceId'>>,
  transaction?: Transaction
): Promise<AclEntry[]> {
  const aclEntries = entries.map((entry) => ({
    ...entry,
    resourceType,
    resourceId,
  }));

  return await AclEntry.bulkCreate(aclEntries, { transaction });
}

// ============================================================================
// ATTRIBUTE-BASED ACCESS CONTROL (ABAC)
// ============================================================================

/**
 * Create ABAC policy
 *
 * @param policyData - ABAC policy data
 * @param transaction - Optional database transaction
 * @returns Created policy
 *
 * @example
 * ```typescript
 * const policy = await createAbacPolicy({
 *   name: 'Patient Access Policy',
 *   resource: ResourceType.PATIENT,
 *   action: PermissionAction.READ,
 *   effect: PolicyEffect.ALLOW,
 *   conditions: {
 *     user: { department: 'cardiology' },
 *     resource: { department: 'cardiology' },
 *   },
 * });
 * ```
 */
export async function createAbacPolicy(
  policyData: z.infer<typeof AbacPolicySchema>,
  transaction?: Transaction
): Promise<AbacPolicy> {
  const validated = AbacPolicySchema.parse(policyData);

  const policy = await AbacPolicy.create(validated, { transaction });

  return policy;
}

/**
 * Evaluate ABAC policies for permission check
 *
 * @param context - Permission evaluation context
 * @returns Permission check result
 *
 * @example
 * ```typescript
 * const result = await evaluateAbacPolicies({
 *   user: { id: 'user-id', attributes: { department: 'cardiology' } },
 *   resource: {
 *     type: ResourceType.PATIENT,
 *     id: 'patient-123',
 *     attributes: { department: 'cardiology' },
 *   },
 *   requestedAction: PermissionAction.READ,
 * });
 * ```
 */
export async function evaluateAbacPolicies(
  context: PermissionContext
): Promise<PermissionCheckResult> {
  const policies = await AbacPolicy.findAll({
    where: {
      resource: context.resource?.type || ResourceType.CUSTOM,
      action: context.requestedAction,
      isActive: true,
    },
    order: [['priority', 'DESC']],
  });

  const matchedPolicies: string[] = [];
  let explicitDeny = false;
  let explicitAllow = false;
  let denyReason: string | undefined;

  for (const policy of policies) {
    const matches = evaluatePolicyConditions(policy.conditions, context);

    if (matches) {
      matchedPolicies.push(policy.id);

      if (policy.effect === PolicyEffect.DENY) {
        explicitDeny = true;
        denyReason = `Denied by policy: ${policy.name}`;
        break; // DENY takes precedence
      } else if (policy.effect === PolicyEffect.ALLOW) {
        explicitAllow = true;
      }
    }
  }

  if (explicitDeny) {
    return {
      allowed: false,
      reason: denyReason,
      matchedPolicies,
    };
  }

  if (explicitAllow) {
    return {
      allowed: true,
      matchedPolicies,
    };
  }

  return {
    allowed: false,
    reason: 'No matching ABAC policy found',
  };
}

/**
 * Evaluate policy conditions against context
 *
 * @param conditions - Policy conditions
 * @param context - Permission context
 * @returns Whether conditions match
 *
 * @example
 * ```typescript
 * const matches = evaluatePolicyConditions(
 *   { user: { department: 'cardiology' } },
 *   { user: { id: 'user-id', attributes: { department: 'cardiology' } } }
 * );
 * ```
 */
export function evaluatePolicyConditions(
  conditions: IAbacPolicy['conditions'],
  context: PermissionContext
): boolean {
  // Evaluate user conditions
  if (conditions.user) {
    for (const [key, value] of Object.entries(conditions.user)) {
      const userValue = context.user.attributes?.[key];
      if (!matchConditionValue(userValue, value)) {
        return false;
      }
    }
  }

  // Evaluate resource conditions
  if (conditions.resource && context.resource) {
    for (const [key, value] of Object.entries(conditions.resource)) {
      const resourceValue = context.resource.attributes?.[key];
      if (!matchConditionValue(resourceValue, value)) {
        return false;
      }
    }
  }

  // Evaluate environment conditions
  if (conditions.environment && context.environment) {
    for (const [key, value] of Object.entries(conditions.environment)) {
      const envValue = context.environment[key as keyof typeof context.environment];
      if (!matchConditionValue(envValue, value)) {
        return false;
      }
    }
  }

  return true;
}

/**
 * Match condition value with operators support
 *
 * @param actualValue - Actual value from context
 * @param conditionValue - Expected value or condition object
 * @returns Whether values match
 *
 * @example
 * ```typescript
 * const matches = matchConditionValue('cardiology', 'cardiology'); // true
 * const matches2 = matchConditionValue(5, { $gt: 3 }); // true
 * ```
 */
export function matchConditionValue(actualValue: any, conditionValue: any): boolean {
  if (typeof conditionValue === 'object' && conditionValue !== null) {
    // Support operators
    for (const [operator, expectedValue] of Object.entries(conditionValue)) {
      switch (operator) {
        case '$eq':
          if (actualValue !== expectedValue) return false;
          break;
        case '$ne':
          if (actualValue === expectedValue) return false;
          break;
        case '$gt':
          if (!(actualValue > expectedValue)) return false;
          break;
        case '$gte':
          if (!(actualValue >= expectedValue)) return false;
          break;
        case '$lt':
          if (!(actualValue < expectedValue)) return false;
          break;
        case '$lte':
          if (!(actualValue <= expectedValue)) return false;
          break;
        case '$in':
          if (!Array.isArray(expectedValue) || !expectedValue.includes(actualValue))
            return false;
          break;
        case '$nin':
          if (!Array.isArray(expectedValue) || expectedValue.includes(actualValue))
            return false;
          break;
        case '$contains':
          if (
            typeof actualValue !== 'string' ||
            !actualValue.includes(expectedValue as string)
          )
            return false;
          break;
        default:
          return false;
      }
    }
    return true;
  }

  // Simple equality check
  return actualValue === conditionValue;
}

/**
 * Update ABAC policy
 *
 * @param policyId - Policy identifier
 * @param updates - Policy updates
 * @param transaction - Optional database transaction
 * @returns Updated policy
 *
 * @example
 * ```typescript
 * const policy = await updateAbacPolicy('policy-id', {
 *   isActive: false,
 *   priority: 600,
 * });
 * ```
 */
export async function updateAbacPolicy(
  policyId: string,
  updates: Partial<IAbacPolicy>,
  transaction?: Transaction
): Promise<AbacPolicy> {
  const policy = await AbacPolicy.findByPk(policyId, { transaction });
  if (!policy) {
    throw new NotFoundException('ABAC policy not found');
  }

  await policy.update(updates, { transaction });
  return policy;
}

/**
 * Delete ABAC policy
 *
 * @param policyId - Policy identifier
 * @param transaction - Optional database transaction
 * @returns Success status
 *
 * @example
 * ```typescript
 * await deleteAbacPolicy('policy-id');
 * ```
 */
export async function deleteAbacPolicy(
  policyId: string,
  transaction?: Transaction
): Promise<boolean> {
  const policy = await AbacPolicy.findByPk(policyId, { transaction });
  if (!policy) {
    throw new NotFoundException('ABAC policy not found');
  }

  await policy.destroy({ transaction });
  return true;
}

// ============================================================================
// PERMISSION EVALUATION & CHECKING
// ============================================================================

/**
 * Check if user has permission with comprehensive evaluation
 *
 * @param userId - User identifier
 * @param resource - Resource type
 * @param action - Requested action
 * @param context - Optional permission context
 * @returns Permission check result
 *
 * @example
 * ```typescript
 * const result = await checkUserPermission(
 *   'user-id',
 *   ResourceType.PATIENT,
 *   PermissionAction.READ,
 *   { resourceId: 'patient-123' }
 * );
 * ```
 */
export async function checkUserPermission(
  userId: string,
  resource: ResourceType,
  action: PermissionAction,
  context?: Partial<PermissionContext>
): Promise<PermissionCheckResult> {
  const user = await User.findByPk(userId);
  if (!user) {
    return {
      allowed: false,
      reason: 'User not found',
    };
  }

  // Build full context
  const fullContext: PermissionContext = {
    user,
    resource: context?.resource || { type: resource, id: '' },
    environment: context?.environment || {},
    requestedAction: action,
  };

  // 1. Check ACL first (most specific)
  if (context?.resource?.id) {
    const aclResult = await checkAclPermission(
      resource,
      context.resource.id,
      userId,
      action
    );
    if (aclResult.allowed || aclResult.deniedBy) {
      return aclResult;
    }
  }

  // 2. Check ABAC policies
  const abacResult = await evaluateAbacPolicies(fullContext);
  if (abacResult.allowed || abacResult.deniedBy) {
    return abacResult;
  }

  // 3. Check RBAC permissions
  const permissions = await getUserPermissions(userId, true);
  const matchingPermissions = permissions.filter(
    (p) => p.resource === resource && p.action === action
  );

  // Check for explicit DENY
  const denyPermission = matchingPermissions.find(
    (p) => p.effect === PolicyEffect.DENY
  );
  if (denyPermission) {
    return {
      allowed: false,
      reason: `Denied by permission: ${denyPermission.name}`,
      deniedBy: denyPermission.id,
    };
  }

  // Check for ALLOW
  const allowPermission = matchingPermissions.find(
    (p) => p.effect === PolicyEffect.ALLOW
  );
  if (allowPermission) {
    return {
      allowed: true,
      matchedPolicies: [allowPermission.id],
    };
  }

  return {
    allowed: false,
    reason: 'No matching permission found',
  };
}

/**
 * Batch check permissions for multiple actions
 *
 * @param userId - User identifier
 * @param resource - Resource type
 * @param actions - Array of actions to check
 * @param context - Optional permission context
 * @returns Map of action to permission check result
 *
 * @example
 * ```typescript
 * const results = await batchCheckPermissions(
 *   'user-id',
 *   ResourceType.PATIENT,
 *   [PermissionAction.READ, PermissionAction.UPDATE]
 * );
 * ```
 */
export async function batchCheckPermissions(
  userId: string,
  resource: ResourceType,
  actions: PermissionAction[],
  context?: Partial<PermissionContext>
): Promise<Map<PermissionAction, PermissionCheckResult>> {
  const results = new Map<PermissionAction, PermissionCheckResult>();

  for (const action of actions) {
    const result = await checkUserPermission(userId, resource, action, context);
    results.set(action, result);
  }

  return results;
}

/**
 * Check if user can perform any of the specified actions
 *
 * @param userId - User identifier
 * @param resource - Resource type
 * @param actions - Array of actions
 * @param context - Optional permission context
 * @returns Whether user can perform any action
 *
 * @example
 * ```typescript
 * const canPerform = await canPerformAnyAction(
 *   'user-id',
 *   ResourceType.PATIENT,
 *   [PermissionAction.READ, PermissionAction.UPDATE]
 * );
 * ```
 */
export async function canPerformAnyAction(
  userId: string,
  resource: ResourceType,
  actions: PermissionAction[],
  context?: Partial<PermissionContext>
): Promise<boolean> {
  for (const action of actions) {
    const result = await checkUserPermission(userId, resource, action, context);
    if (result.allowed) {
      return true;
    }
  }
  return false;
}

/**
 * Check if user can perform all of the specified actions
 *
 * @param userId - User identifier
 * @param resource - Resource type
 * @param actions - Array of actions
 * @param context - Optional permission context
 * @returns Whether user can perform all actions
 *
 * @example
 * ```typescript
 * const canPerformAll = await canPerformAllActions(
 *   'user-id',
 *   ResourceType.PATIENT,
 *   [PermissionAction.READ, PermissionAction.UPDATE]
 * );
 * ```
 */
export async function canPerformAllActions(
  userId: string,
  resource: ResourceType,
  actions: PermissionAction[],
  context?: Partial<PermissionContext>
): Promise<boolean> {
  for (const action of actions) {
    const result = await checkUserPermission(userId, resource, action, context);
    if (!result.allowed) {
      return false;
    }
  }
  return true;
}

// ============================================================================
// TEMPORARY ACCESS GRANTS
// ============================================================================

/**
 * Create temporary access grant request
 *
 * @param grantData - Access grant data
 * @param grantedBy - User granting access
 * @param transaction - Optional database transaction
 * @returns Created access grant
 *
 * @example
 * ```typescript
 * const grant = await createAccessGrant(
 *   {
 *     userId: 'user-id',
 *     roleId: 'emergency-role-id',
 *     reason: 'Emergency patient access',
 *     startsAt: new Date(),
 *     expiresAt: new Date(Date.now() + 3600000), // 1 hour
 *   },
 *   'admin-id'
 * );
 * ```
 */
export async function createAccessGrant(
  grantData: z.infer<typeof AccessGrantSchema>,
  grantedBy: string,
  transaction?: Transaction
): Promise<AccessGrant> {
  const validated = AccessGrantSchema.parse(grantData);

  const grant = await AccessGrant.create(
    {
      ...validated,
      grantedBy,
      status: AccessGrantStatus.PENDING,
    },
    { transaction }
  );

  return grant;
}

/**
 * Approve access grant
 *
 * @param grantId - Access grant identifier
 * @param approvedBy - User approving the grant
 * @param transaction - Optional database transaction
 * @returns Updated access grant
 *
 * @example
 * ```typescript
 * const grant = await approveAccessGrant('grant-id', 'approver-id');
 * ```
 */
export async function approveAccessGrant(
  grantId: string,
  approvedBy: string,
  transaction?: Transaction
): Promise<AccessGrant> {
  const grant = await AccessGrant.findByPk(grantId, { transaction });
  if (!grant) {
    throw new NotFoundException('Access grant not found');
  }

  if (grant.status !== AccessGrantStatus.PENDING) {
    throw new BadRequestException('Access grant is not in pending status');
  }

  await grant.update(
    {
      status: AccessGrantStatus.APPROVED,
      approvedBy,
    },
    { transaction }
  );

  // Activate if start time has passed
  const now = new Date();
  if (grant.startsAt <= now && grant.expiresAt > now) {
    await grant.update({ status: AccessGrantStatus.ACTIVE }, { transaction });

    // Grant the access
    if (grant.roleId) {
      await assignRoleToUser(grant.userId, grant.roleId, transaction);
    } else if (grant.permissionId) {
      await grantPermissionToUser(grant.userId, grant.permissionId, transaction);
    }
  }

  return grant;
}

/**
 * Reject access grant
 *
 * @param grantId - Access grant identifier
 * @param transaction - Optional database transaction
 * @returns Updated access grant
 *
 * @example
 * ```typescript
 * const grant = await rejectAccessGrant('grant-id');
 * ```
 */
export async function rejectAccessGrant(
  grantId: string,
  transaction?: Transaction
): Promise<AccessGrant> {
  const grant = await AccessGrant.findByPk(grantId, { transaction });
  if (!grant) {
    throw new NotFoundException('Access grant not found');
  }

  await grant.update({ status: AccessGrantStatus.REJECTED }, { transaction });
  return grant;
}

/**
 * Revoke active access grant
 *
 * @param grantId - Access grant identifier
 * @param transaction - Optional database transaction
 * @returns Updated access grant
 *
 * @example
 * ```typescript
 * const grant = await revokeAccessGrant('grant-id');
 * ```
 */
export async function revokeAccessGrant(
  grantId: string,
  transaction?: Transaction
): Promise<AccessGrant> {
  const grant = await AccessGrant.findByPk(grantId, { transaction });
  if (!grant) {
    throw new NotFoundException('Access grant not found');
  }

  await grant.update({ status: AccessGrantStatus.REVOKED }, { transaction });

  // Remove the granted access
  if (grant.roleId) {
    await removeRoleFromUser(grant.userId, grant.roleId, transaction);
  } else if (grant.permissionId) {
    await revokePermissionFromUser(grant.userId, grant.permissionId, transaction);
  }

  return grant;
}

/**
 * Process expired access grants (to be run periodically)
 *
 * @param transaction - Optional database transaction
 * @returns Number of grants processed
 *
 * @example
 * ```typescript
 * const count = await processExpiredAccessGrants();
 * ```
 */
export async function processExpiredAccessGrants(
  transaction?: Transaction
): Promise<number> {
  const now = new Date();

  const expiredGrants = await AccessGrant.findAll({
    where: {
      status: AccessGrantStatus.ACTIVE,
      expiresAt: { [Op.lte]: now },
    },
    transaction,
  });

  for (const grant of expiredGrants) {
    await grant.update({ status: AccessGrantStatus.EXPIRED }, { transaction });

    // Remove the granted access
    if (grant.roleId) {
      await removeRoleFromUser(grant.userId, grant.roleId, transaction);
    } else if (grant.permissionId) {
      await revokePermissionFromUser(grant.userId, grant.permissionId, transaction);
    }
  }

  // Activate pending grants whose start time has come
  const pendingGrants = await AccessGrant.findAll({
    where: {
      status: AccessGrantStatus.APPROVED,
      startsAt: { [Op.lte]: now },
      expiresAt: { [Op.gt]: now },
    },
    transaction,
  });

  for (const grant of pendingGrants) {
    await grant.update({ status: AccessGrantStatus.ACTIVE }, { transaction });

    // Grant the access
    if (grant.roleId) {
      await assignRoleToUser(grant.userId, grant.roleId, transaction);
    } else if (grant.permissionId) {
      await grantPermissionToUser(grant.userId, grant.permissionId, transaction);
    }
  }

  return expiredGrants.length + pendingGrants.length;
}

// ============================================================================
// PERMISSION AUDIT LOGGING
// ============================================================================

/**
 * Log permission check for audit trail
 *
 * @param logData - Audit log data
 * @param transaction - Optional database transaction
 * @returns Created audit log entry
 *
 * @example
 * ```typescript
 * await logPermissionCheck({
 *   userId: 'user-id',
 *   action: 'read',
 *   resource: ResourceType.PATIENT,
 *   resourceId: 'patient-123',
 *   result: 'allowed',
 *   ipAddress: '192.168.1.1',
 * });
 * ```
 */
export async function logPermissionCheck(
  logData: Omit<IPermissionAuditLog, 'id' | 'timestamp'>,
  transaction?: Transaction
): Promise<PermissionAuditLog> {
  const log = await PermissionAuditLog.create(
    {
      ...logData,
      timestamp: new Date(),
    },
    { transaction }
  );

  return log;
}

/**
 * Get audit logs for a user
 *
 * @param userId - User identifier
 * @param options - Query options
 * @returns Array of audit logs
 *
 * @example
 * ```typescript
 * const logs = await getUserAuditLogs('user-id', {
 *   limit: 100,
 *   startDate: new Date('2024-01-01'),
 * });
 * ```
 */
export async function getUserAuditLogs(
  userId: string,
  options?: {
    limit?: number;
    offset?: number;
    startDate?: Date;
    endDate?: Date;
    result?: 'allowed' | 'denied';
  }
): Promise<PermissionAuditLog[]> {
  const where: WhereOptions<IPermissionAuditLog> = { userId };

  if (options?.startDate || options?.endDate) {
    where.timestamp = {};
    if (options.startDate) {
      where.timestamp[Op.gte] = options.startDate;
    }
    if (options.endDate) {
      where.timestamp[Op.lte] = options.endDate;
    }
  }

  if (options?.result) {
    where.result = options.result;
  }

  return await PermissionAuditLog.findAll({
    where,
    order: [['timestamp', 'DESC']],
    limit: options?.limit || 100,
    offset: options?.offset || 0,
  });
}

/**
 * Get audit logs for a resource
 *
 * @param resourceType - Resource type
 * @param resourceId - Resource identifier
 * @param options - Query options
 * @returns Array of audit logs
 *
 * @example
 * ```typescript
 * const logs = await getResourceAuditLogs(
 *   ResourceType.PATIENT,
 *   'patient-123',
 *   { limit: 50 }
 * );
 * ```
 */
export async function getResourceAuditLogs(
  resourceType: ResourceType,
  resourceId: string,
  options?: {
    limit?: number;
    offset?: number;
    startDate?: Date;
    endDate?: Date;
  }
): Promise<PermissionAuditLog[]> {
  const where: WhereOptions<IPermissionAuditLog> = {
    resource: resourceType,
    resourceId,
  };

  if (options?.startDate || options?.endDate) {
    where.timestamp = {};
    if (options.startDate) {
      where.timestamp[Op.gte] = options.startDate;
    }
    if (options.endDate) {
      where.timestamp[Op.lte] = options.endDate;
    }
  }

  return await PermissionAuditLog.findAll({
    where,
    order: [['timestamp', 'DESC']],
    limit: options?.limit || 100,
    offset: options?.offset || 0,
  });
}

/**
 * Get security compliance report
 *
 * @param startDate - Report start date
 * @param endDate - Report end date
 * @returns Compliance report data
 *
 * @example
 * ```typescript
 * const report = await getSecurityComplianceReport(
 *   new Date('2024-01-01'),
 *   new Date('2024-01-31')
 * );
 * ```
 */
export async function getSecurityComplianceReport(
  startDate: Date,
  endDate: Date
): Promise<{
  totalChecks: number;
  allowedChecks: number;
  deniedChecks: number;
  uniqueUsers: number;
  topDeniedResources: Array<{ resource: ResourceType; count: number }>;
  topDeniedUsers: Array<{ userId: string; count: number }>;
}> {
  const logs = await PermissionAuditLog.findAll({
    where: {
      timestamp: {
        [Op.gte]: startDate,
        [Op.lte]: endDate,
      },
    },
  });

  const totalChecks = logs.length;
  const allowedChecks = logs.filter((l) => l.result === 'allowed').length;
  const deniedChecks = logs.filter((l) => l.result === 'denied').length;
  const uniqueUsers = new Set(logs.map((l) => l.userId)).size;

  // Top denied resources
  const resourceDenials = new Map<ResourceType, number>();
  logs
    .filter((l) => l.result === 'denied')
    .forEach((l) => {
      resourceDenials.set(l.resource, (resourceDenials.get(l.resource) || 0) + 1);
    });

  const topDeniedResources = Array.from(resourceDenials.entries())
    .map(([resource, count]) => ({ resource, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  // Top denied users
  const userDenials = new Map<string, number>();
  logs
    .filter((l) => l.result === 'denied')
    .forEach((l) => {
      userDenials.set(l.userId, (userDenials.get(l.userId) || 0) + 1);
    });

  const topDeniedUsers = Array.from(userDenials.entries())
    .map(([userId, count]) => ({ userId, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  return {
    totalChecks,
    allowedChecks,
    deniedChecks,
    uniqueUsers,
    topDeniedResources,
    topDeniedUsers,
  };
}

// ============================================================================
// PERMISSION CACHING WITH REDIS
// ============================================================================

/**
 * Cache user permissions in Redis
 *
 * @param redis - Redis client
 * @param userId - User identifier
 * @param ttl - Cache TTL in seconds (default: 300)
 * @returns Success status
 *
 * @example
 * ```typescript
 * await cacheUserPermissions(redisClient, 'user-id', 600);
 * ```
 */
export async function cacheUserPermissions(
  redis: Redis,
  userId: string,
  ttl: number = 300
): Promise<boolean> {
  const permissions = await getUserPermissions(userId, true);
  const roles = await getUserRoles(userId, true);

  const cacheData = {
    permissions: permissions.map((p) => ({
      id: p.id,
      resource: p.resource,
      action: p.action,
      effect: p.effect,
    })),
    roles: roles.map((r) => ({ id: r.id, name: r.name })),
    cachedAt: new Date().toISOString(),
  };

  const cacheKey = `user:permissions:${userId}`;
  await redis.setex(cacheKey, ttl, JSON.stringify(cacheData));

  return true;
}

/**
 * Get cached user permissions from Redis
 *
 * @param redis - Redis client
 * @param userId - User identifier
 * @returns Cached permissions or null
 *
 * @example
 * ```typescript
 * const cached = await getCachedUserPermissions(redisClient, 'user-id');
 * ```
 */
export async function getCachedUserPermissions(
  redis: Redis,
  userId: string
): Promise<{
  permissions: Array<{
    id: string;
    resource: ResourceType;
    action: PermissionAction;
    effect: PolicyEffect;
  }>;
  roles: Array<{ id: string; name: string }>;
  cachedAt: string;
} | null> {
  const cacheKey = `user:permissions:${userId}`;
  const cached = await redis.get(cacheKey);

  if (!cached) {
    return null;
  }

  return JSON.parse(cached);
}

/**
 * Invalidate user permission cache
 *
 * @param redis - Redis client
 * @param userId - User identifier
 * @returns Success status
 *
 * @example
 * ```typescript
 * await invalidateUserPermissionCache(redisClient, 'user-id');
 * ```
 */
export async function invalidateUserPermissionCache(
  redis: Redis,
  userId: string
): Promise<boolean> {
  const cacheKey = `user:permissions:${userId}`;
  await redis.del(cacheKey);
  return true;
}

/**
 * Check permission with cache fallback
 *
 * @param redis - Redis client
 * @param userId - User identifier
 * @param resource - Resource type
 * @param action - Requested action
 * @returns Permission check result
 *
 * @example
 * ```typescript
 * const result = await checkPermissionWithCache(
 *   redisClient,
 *   'user-id',
 *   ResourceType.PATIENT,
 *   PermissionAction.READ
 * );
 * ```
 */
export async function checkPermissionWithCache(
  redis: Redis,
  userId: string,
  resource: ResourceType,
  action: PermissionAction
): Promise<PermissionCheckResult> {
  // Try cache first
  const cached = await getCachedUserPermissions(redis, userId);

  if (cached) {
    const matchingPermission = cached.permissions.find(
      (p) => p.resource === resource && p.action === action
    );

    if (matchingPermission) {
      if (matchingPermission.effect === PolicyEffect.DENY) {
        return {
          allowed: false,
          reason: 'Denied by cached permission',
        };
      }
      return {
        allowed: true,
        matchedPolicies: [matchingPermission.id],
      };
    }
  }

  // Cache miss or no matching permission - do full check
  const result = await checkUserPermission(userId, resource, action);

  // Update cache
  await cacheUserPermissions(redis, userId);

  return result;
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Generate permission name from resource and action
 *
 * @param resource - Resource type
 * @param action - Permission action
 * @returns Permission name
 *
 * @example
 * ```typescript
 * const name = generatePermissionName(ResourceType.PATIENT, PermissionAction.READ);
 * // Returns: 'patient.read'
 * ```
 */
export function generatePermissionName(
  resource: ResourceType,
  action: PermissionAction
): string {
  return `${resource}.${action}`;
}

/**
 * Parse permission name to resource and action
 *
 * @param permissionName - Permission name
 * @returns Resource and action
 *
 * @example
 * ```typescript
 * const { resource, action } = parsePermissionName('patient.read');
 * ```
 */
export function parsePermissionName(permissionName: string): {
  resource: ResourceType;
  action: PermissionAction;
} {
  const [resourceStr, actionStr] = permissionName.split('.');

  return {
    resource: resourceStr as ResourceType,
    action: actionStr as PermissionAction,
  };
}

/**
 * Clone role with all permissions
 *
 * @param roleId - Source role identifier
 * @param newRoleName - New role name
 * @param transaction - Optional database transaction
 * @returns Cloned role
 *
 * @example
 * ```typescript
 * const newRole = await cloneRole('admin-role-id', 'Super Admin');
 * ```
 */
export async function cloneRole(
  roleId: string,
  newRoleName: string,
  transaction?: Transaction
): Promise<Role> {
  const sourceRole = await Role.findByPk(roleId, {
    include: [{ model: Permission, as: 'permissions' }],
    transaction,
  });

  if (!sourceRole) {
    throw new NotFoundException('Source role not found');
  }

  // Create new role
  const newRole = await Role.create(
    {
      name: newRoleName,
      description: `Cloned from ${sourceRole.name}`,
      scope: sourceRole.scope,
      level: sourceRole.level,
      isSystem: false,
      metadata: sourceRole.metadata,
    },
    { transaction }
  );

  // Copy permissions
  const permissions = await sourceRole.getPermissions();
  await newRole.addPermissions(permissions, { transaction });

  return newRole;
}

/**
 * Export all permissions to JSON
 *
 * @returns Permissions data
 *
 * @example
 * ```typescript
 * const data = await exportPermissions();
 * ```
 */
export async function exportPermissions(): Promise<{
  roles: any[];
  permissions: any[];
  rolePermissions: any[];
}> {
  const roles = await Role.findAll();
  const permissions = await Permission.findAll();

  const rolePermissions: any[] = [];
  for (const role of roles) {
    const perms = await role.getPermissions();
    for (const perm of perms) {
      rolePermissions.push({
        roleId: role.id,
        roleName: role.name,
        permissionId: perm.id,
        permissionName: perm.name,
      });
    }
  }

  return {
    roles: roles.map((r) => r.toJSON()),
    permissions: permissions.map((p) => p.toJSON()),
    rolePermissions,
  };
}

/**
 * Default export object with all functions
 */
export default {
  // Models
  initializeSecurityModels,
  defineSecurityAssociations,

  // RBAC
  createRole,
  getRoleHierarchy,
  assignRoleToUser,
  removeRoleFromUser,
  getUserRoles,
  assignPermissionToRole,

  // Permissions
  createPermission,
  getUserPermissions,
  grantPermissionToUser,
  revokePermissionFromUser,
  buildPermissionMatrix,

  // Security Groups
  createSecurityGroup,
  addUserToSecurityGroup,
  removeUserFromSecurityGroup,
  getUserSecurityGroups,
  assignRoleToSecurityGroup,

  // ACL
  createAclEntry,
  checkAclPermission,
  getResourceAcls,
  removeAclEntry,
  bulkCreateAclEntries,

  // ABAC
  createAbacPolicy,
  evaluateAbacPolicies,
  evaluatePolicyConditions,
  matchConditionValue,
  updateAbacPolicy,
  deleteAbacPolicy,

  // Permission Checking
  checkUserPermission,
  batchCheckPermissions,
  canPerformAnyAction,
  canPerformAllActions,

  // Temporary Access
  createAccessGrant,
  approveAccessGrant,
  rejectAccessGrant,
  revokeAccessGrant,
  processExpiredAccessGrants,

  // Audit Logging
  logPermissionCheck,
  getUserAuditLogs,
  getResourceAuditLogs,
  getSecurityComplianceReport,

  // Caching
  cacheUserPermissions,
  getCachedUserPermissions,
  invalidateUserPermissionCache,
  checkPermissionWithCache,

  // Utilities
  generatePermissionName,
  parsePermissionName,
  cloneRole,
  exportPermissions,
};
