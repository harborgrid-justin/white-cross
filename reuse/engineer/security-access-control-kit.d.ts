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
import { Model, Sequelize, Transaction, Association, HasManyGetAssociationsMixin, HasManyAddAssociationMixin, HasManyCountAssociationsMixin, BelongsToManyGetAssociationsMixin, BelongsToManyAddAssociationMixin, BelongsToManyHasAssociationMixin, BelongsToManyCountAssociationsMixin } from 'sequelize';
import { z } from 'zod';
import Redis from 'ioredis';
/**
 * Permission action types
 */
export declare enum PermissionAction {
    CREATE = "create",
    READ = "read",
    UPDATE = "update",
    DELETE = "delete",
    EXECUTE = "execute",
    MANAGE = "manage",
    APPROVE = "approve",
    REJECT = "reject",
    SHARE = "share",
    EXPORT = "export",
    IMPORT = "import",
    ARCHIVE = "archive"
}
/**
 * Resource types for permission management
 */
export declare enum ResourceType {
    USER = "user",
    ROLE = "role",
    PERMISSION = "permission",
    SECURITY_GROUP = "security_group",
    PATIENT = "patient",
    MEDICAL_RECORD = "medical_record",
    APPOINTMENT = "appointment",
    PRESCRIPTION = "prescription",
    LAB_RESULT = "lab_result",
    BILLING = "billing",
    REPORT = "report",
    DOCUMENT = "document",
    ASSET = "asset",
    CUSTOM = "custom"
}
/**
 * Access control policy effect
 */
export declare enum PolicyEffect {
    ALLOW = "allow",
    DENY = "deny"
}
/**
 * Permission scope levels
 */
export declare enum PermissionScope {
    GLOBAL = "global",
    ORGANIZATION = "organization",
    DEPARTMENT = "department",
    TEAM = "team",
    PERSONAL = "personal"
}
/**
 * Access grant status
 */
export declare enum AccessGrantStatus {
    PENDING = "pending",
    APPROVED = "approved",
    REJECTED = "rejected",
    ACTIVE = "active",
    EXPIRED = "expired",
    REVOKED = "revoked"
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
/**
 * Role creation schema
 */
export declare const RoleSchema: any;
/**
 * Permission creation schema
 */
export declare const PermissionSchema: any;
/**
 * Security group creation schema
 */
export declare const SecurityGroupSchema: any;
/**
 * ACL entry schema
 */
export declare const AclEntrySchema: any;
/**
 * Access grant request schema
 */
export declare const AccessGrantSchema: any;
/**
 * ABAC policy schema
 */
export declare const AbacPolicySchema: any;
/**
 * Role model with hierarchical structure
 */
export declare class Role extends Model<IRole> implements IRole {
    id: string;
    name: string;
    description?: string;
    parentRoleId?: string;
    level: number;
    isSystem: boolean;
    scope: PermissionScope;
    metadata?: Record<string, any>;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    getPermissions: BelongsToManyGetAssociationsMixin<Permission>;
    addPermission: BelongsToManyAddAssociationMixin<Permission, string>;
    hasPermission: BelongsToManyHasAssociationMixin<Permission, string>;
    countPermissions: BelongsToManyCountAssociationsMixin;
    getUsers: BelongsToManyGetAssociationsMixin<User>;
    addUser: BelongsToManyAddAssociationMixin<User, string>;
    hasUser: BelongsToManyHasAssociationMixin<User, string>;
    countUsers: BelongsToManyCountAssociationsMixin;
    getChildren: HasManyGetAssociationsMixin<Role>;
    addChild: HasManyAddAssociationMixin<Role, string>;
    countChildren: HasManyCountAssociationsMixin;
    static associations: {
        permissions: Association.BelongsToMany<Role, Permission>;
        users: Association.BelongsToMany<Role, User>;
        parentRole: Association.BelongsTo<Role, Role>;
        childRoles: Association.HasMany<Role, Role>;
    };
}
/**
 * Permission model
 */
export declare class Permission extends Model<IPermission> implements IPermission {
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
    readonly createdAt: Date;
    readonly updatedAt: Date;
    getRoles: BelongsToManyGetAssociationsMixin<Role>;
    addRole: BelongsToManyAddAssociationMixin<Role, string>;
    hasRole: BelongsToManyHasAssociationMixin<Role, string>;
    countRoles: BelongsToManyCountAssociationsMixin;
    getUsers: BelongsToManyGetAssociationsMixin<User>;
    addUser: BelongsToManyAddAssociationMixin<User, string>;
    hasUser: BelongsToManyHasAssociationMixin<User, string>;
    countUsers: BelongsToManyCountAssociationsMixin;
    static associations: {
        roles: Association.BelongsToMany<Permission, Role>;
        users: Association.BelongsToMany<Permission, User>;
    };
}
/**
 * Security group model with hierarchical structure
 */
export declare class SecurityGroup extends Model<ISecurityGroup> implements ISecurityGroup {
    id: string;
    name: string;
    description?: string;
    parentGroupId?: string;
    level: number;
    scope: PermissionScope;
    metadata?: Record<string, any>;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    getUsers: BelongsToManyGetAssociationsMixin<User>;
    addUser: BelongsToManyAddAssociationMixin<User, string>;
    hasUser: BelongsToManyHasAssociationMixin<User, string>;
    countUsers: BelongsToManyCountAssociationsMixin;
    getRoles: BelongsToManyGetAssociationsMixin<Role>;
    addRole: BelongsToManyAddAssociationMixin<Role, string>;
    hasRole: BelongsToManyHasAssociationMixin<Role, string>;
    countRoles: BelongsToManyCountAssociationsMixin;
    getChildren: HasManyGetAssociationsMixin<SecurityGroup>;
    addChild: HasManyAddAssociationMixin<SecurityGroup, string>;
    countChildren: HasManyCountAssociationsMixin;
    static associations: {
        users: Association.BelongsToMany<SecurityGroup, User>;
        roles: Association.BelongsToMany<SecurityGroup, Role>;
        parentGroup: Association.BelongsTo<SecurityGroup, SecurityGroup>;
        childGroups: Association.HasMany<SecurityGroup, SecurityGroup>;
    };
}
/**
 * User model (simplified for access control)
 */
export declare class User extends Model<IUser> implements IUser {
    id: string;
    email: string;
    attributes?: Record<string, any>;
    metadata?: Record<string, any>;
    getRoles: BelongsToManyGetAssociationsMixin<Role>;
    addRole: BelongsToManyAddAssociationMixin<Role, string>;
    hasRole: BelongsToManyHasAssociationMixin<Role, string>;
    countRoles: BelongsToManyCountAssociationsMixin;
    getPermissions: BelongsToManyGetAssociationsMixin<Permission>;
    addPermission: BelongsToManyAddAssociationMixin<Permission, string>;
    hasPermission: BelongsToManyHasAssociationMixin<Permission, string>;
    countPermissions: BelongsToManyCountAssociationsMixin;
    getSecurityGroups: BelongsToManyGetAssociationsMixin<SecurityGroup>;
    addSecurityGroup: BelongsToManyAddAssociationMixin<SecurityGroup, string>;
    hasSecurityGroup: BelongsToManyHasAssociationMixin<SecurityGroup, string>;
    countSecurityGroups: BelongsToManyCountAssociationsMixin;
    static associations: {
        roles: Association.BelongsToMany<User, Role>;
        permissions: Association.BelongsToMany<User, Permission>;
        securityGroups: Association.BelongsToMany<User, SecurityGroup>;
    };
}
/**
 * ACL entry model
 */
export declare class AclEntry extends Model<IAclEntry> implements IAclEntry {
    id: string;
    resourceType: ResourceType;
    resourceId: string;
    principalType: 'user' | 'role' | 'group';
    principalId: string;
    action: PermissionAction;
    effect: PolicyEffect;
    conditions?: Record<string, any>;
    expiresAt?: Date;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
/**
 * Access grant model
 */
export declare class AccessGrant extends Model<IAccessGrant> implements IAccessGrant {
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
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
/**
 * Permission audit log model
 */
export declare class PermissionAuditLog extends Model<IPermissionAuditLog> implements IPermissionAuditLog {
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
    readonly timestamp: Date;
}
/**
 * ABAC policy model
 */
export declare class AbacPolicy extends Model<IAbacPolicy> implements IAbacPolicy {
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
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
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
export declare function initializeSecurityModels(sequelize: Sequelize): {
    Role: typeof Role;
    Permission: typeof Permission;
    SecurityGroup: typeof SecurityGroup;
    User: typeof User;
    AclEntry: typeof AclEntry;
    AccessGrant: typeof AccessGrant;
    PermissionAuditLog: typeof PermissionAuditLog;
    AbacPolicy: typeof AbacPolicy;
};
/**
 * Define all security model associations
 *
 * @example
 * ```typescript
 * defineSecurityAssociations();
 * ```
 */
export declare function defineSecurityAssociations(): void;
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
export declare function createRole(roleData: z.infer<typeof RoleSchema>, transaction?: Transaction): Promise<Role>;
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
export declare function getRoleHierarchy(roleId: string, maxDepth?: number): Promise<RoleHierarchyNode>;
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
export declare function assignRoleToUser(userId: string, roleId: string, transaction?: Transaction): Promise<boolean>;
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
export declare function removeRoleFromUser(userId: string, roleId: string, transaction?: Transaction): Promise<boolean>;
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
export declare function getUserRoles(userId: string, includeInherited?: boolean): Promise<Role[]>;
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
export declare function assignPermissionToRole(roleId: string, permissionId: string, transaction?: Transaction): Promise<boolean>;
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
export declare function createPermission(permissionData: z.infer<typeof PermissionSchema>, transaction?: Transaction): Promise<Permission>;
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
export declare function getUserPermissions(userId: string, includeInherited?: boolean): Promise<Permission[]>;
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
export declare function grantPermissionToUser(userId: string, permissionId: string, transaction?: Transaction): Promise<boolean>;
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
export declare function revokePermissionFromUser(userId: string, permissionId: string, transaction?: Transaction): Promise<boolean>;
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
export declare function buildPermissionMatrix(resourceType?: ResourceType): Promise<PermissionMatrixEntry[]>;
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
export declare function createSecurityGroup(groupData: z.infer<typeof SecurityGroupSchema>, transaction?: Transaction): Promise<SecurityGroup>;
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
export declare function addUserToSecurityGroup(userId: string, groupId: string, transaction?: Transaction): Promise<boolean>;
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
export declare function removeUserFromSecurityGroup(userId: string, groupId: string, transaction?: Transaction): Promise<boolean>;
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
export declare function getUserSecurityGroups(userId: string, includeParents?: boolean): Promise<SecurityGroup[]>;
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
export declare function assignRoleToSecurityGroup(groupId: string, roleId: string, transaction?: Transaction): Promise<boolean>;
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
export declare function createAclEntry(aclData: z.infer<typeof AclEntrySchema>, transaction?: Transaction): Promise<AclEntry>;
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
export declare function checkAclPermission(resourceType: ResourceType, resourceId: string, userId: string, action: PermissionAction): Promise<PermissionCheckResult>;
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
export declare function getResourceAcls(resourceType: ResourceType, resourceId: string): Promise<AclEntry[]>;
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
export declare function removeAclEntry(aclId: string, transaction?: Transaction): Promise<boolean>;
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
export declare function bulkCreateAclEntries(resourceType: ResourceType, resourceId: string, entries: Array<Omit<z.infer<typeof AclEntrySchema>, 'resourceType' | 'resourceId'>>, transaction?: Transaction): Promise<AclEntry[]>;
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
export declare function createAbacPolicy(policyData: z.infer<typeof AbacPolicySchema>, transaction?: Transaction): Promise<AbacPolicy>;
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
export declare function evaluateAbacPolicies(context: PermissionContext): Promise<PermissionCheckResult>;
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
export declare function evaluatePolicyConditions(conditions: IAbacPolicy['conditions'], context: PermissionContext): boolean;
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
export declare function matchConditionValue(actualValue: any, conditionValue: any): boolean;
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
export declare function updateAbacPolicy(policyId: string, updates: Partial<IAbacPolicy>, transaction?: Transaction): Promise<AbacPolicy>;
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
export declare function deleteAbacPolicy(policyId: string, transaction?: Transaction): Promise<boolean>;
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
export declare function checkUserPermission(userId: string, resource: ResourceType, action: PermissionAction, context?: Partial<PermissionContext>): Promise<PermissionCheckResult>;
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
export declare function batchCheckPermissions(userId: string, resource: ResourceType, actions: PermissionAction[], context?: Partial<PermissionContext>): Promise<Map<PermissionAction, PermissionCheckResult>>;
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
export declare function canPerformAnyAction(userId: string, resource: ResourceType, actions: PermissionAction[], context?: Partial<PermissionContext>): Promise<boolean>;
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
export declare function canPerformAllActions(userId: string, resource: ResourceType, actions: PermissionAction[], context?: Partial<PermissionContext>): Promise<boolean>;
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
export declare function createAccessGrant(grantData: z.infer<typeof AccessGrantSchema>, grantedBy: string, transaction?: Transaction): Promise<AccessGrant>;
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
export declare function approveAccessGrant(grantId: string, approvedBy: string, transaction?: Transaction): Promise<AccessGrant>;
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
export declare function rejectAccessGrant(grantId: string, transaction?: Transaction): Promise<AccessGrant>;
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
export declare function revokeAccessGrant(grantId: string, transaction?: Transaction): Promise<AccessGrant>;
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
export declare function processExpiredAccessGrants(transaction?: Transaction): Promise<number>;
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
export declare function logPermissionCheck(logData: Omit<IPermissionAuditLog, 'id' | 'timestamp'>, transaction?: Transaction): Promise<PermissionAuditLog>;
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
export declare function getUserAuditLogs(userId: string, options?: {
    limit?: number;
    offset?: number;
    startDate?: Date;
    endDate?: Date;
    result?: 'allowed' | 'denied';
}): Promise<PermissionAuditLog[]>;
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
export declare function getResourceAuditLogs(resourceType: ResourceType, resourceId: string, options?: {
    limit?: number;
    offset?: number;
    startDate?: Date;
    endDate?: Date;
}): Promise<PermissionAuditLog[]>;
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
export declare function getSecurityComplianceReport(startDate: Date, endDate: Date): Promise<{
    totalChecks: number;
    allowedChecks: number;
    deniedChecks: number;
    uniqueUsers: number;
    topDeniedResources: Array<{
        resource: ResourceType;
        count: number;
    }>;
    topDeniedUsers: Array<{
        userId: string;
        count: number;
    }>;
}>;
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
export declare function cacheUserPermissions(redis: Redis, userId: string, ttl?: number): Promise<boolean>;
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
export declare function getCachedUserPermissions(redis: Redis, userId: string): Promise<{
    permissions: Array<{
        id: string;
        resource: ResourceType;
        action: PermissionAction;
        effect: PolicyEffect;
    }>;
    roles: Array<{
        id: string;
        name: string;
    }>;
    cachedAt: string;
} | null>;
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
export declare function invalidateUserPermissionCache(redis: Redis, userId: string): Promise<boolean>;
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
export declare function checkPermissionWithCache(redis: Redis, userId: string, resource: ResourceType, action: PermissionAction): Promise<PermissionCheckResult>;
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
export declare function generatePermissionName(resource: ResourceType, action: PermissionAction): string;
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
export declare function parsePermissionName(permissionName: string): {
    resource: ResourceType;
    action: PermissionAction;
};
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
export declare function cloneRole(roleId: string, newRoleName: string, transaction?: Transaction): Promise<Role>;
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
export declare function exportPermissions(): Promise<{
    roles: any[];
    permissions: any[];
    rolePermissions: any[];
}>;
/**
 * Default export object with all functions
 */
declare const _default: {
    initializeSecurityModels: typeof initializeSecurityModels;
    defineSecurityAssociations: typeof defineSecurityAssociations;
    createRole: typeof createRole;
    getRoleHierarchy: typeof getRoleHierarchy;
    assignRoleToUser: typeof assignRoleToUser;
    removeRoleFromUser: typeof removeRoleFromUser;
    getUserRoles: typeof getUserRoles;
    assignPermissionToRole: typeof assignPermissionToRole;
    createPermission: typeof createPermission;
    getUserPermissions: typeof getUserPermissions;
    grantPermissionToUser: typeof grantPermissionToUser;
    revokePermissionFromUser: typeof revokePermissionFromUser;
    buildPermissionMatrix: typeof buildPermissionMatrix;
    createSecurityGroup: typeof createSecurityGroup;
    addUserToSecurityGroup: typeof addUserToSecurityGroup;
    removeUserFromSecurityGroup: typeof removeUserFromSecurityGroup;
    getUserSecurityGroups: typeof getUserSecurityGroups;
    assignRoleToSecurityGroup: typeof assignRoleToSecurityGroup;
    createAclEntry: typeof createAclEntry;
    checkAclPermission: typeof checkAclPermission;
    getResourceAcls: typeof getResourceAcls;
    removeAclEntry: typeof removeAclEntry;
    bulkCreateAclEntries: typeof bulkCreateAclEntries;
    createAbacPolicy: typeof createAbacPolicy;
    evaluateAbacPolicies: typeof evaluateAbacPolicies;
    evaluatePolicyConditions: typeof evaluatePolicyConditions;
    matchConditionValue: typeof matchConditionValue;
    updateAbacPolicy: typeof updateAbacPolicy;
    deleteAbacPolicy: typeof deleteAbacPolicy;
    checkUserPermission: typeof checkUserPermission;
    batchCheckPermissions: typeof batchCheckPermissions;
    canPerformAnyAction: typeof canPerformAnyAction;
    canPerformAllActions: typeof canPerformAllActions;
    createAccessGrant: typeof createAccessGrant;
    approveAccessGrant: typeof approveAccessGrant;
    rejectAccessGrant: typeof rejectAccessGrant;
    revokeAccessGrant: typeof revokeAccessGrant;
    processExpiredAccessGrants: typeof processExpiredAccessGrants;
    logPermissionCheck: typeof logPermissionCheck;
    getUserAuditLogs: typeof getUserAuditLogs;
    getResourceAuditLogs: typeof getResourceAuditLogs;
    getSecurityComplianceReport: typeof getSecurityComplianceReport;
    cacheUserPermissions: typeof cacheUserPermissions;
    getCachedUserPermissions: typeof getCachedUserPermissions;
    invalidateUserPermissionCache: typeof invalidateUserPermissionCache;
    checkPermissionWithCache: typeof checkPermissionWithCache;
    generatePermissionName: typeof generatePermissionName;
    parsePermissionName: typeof parsePermissionName;
    cloneRole: typeof cloneRole;
    exportPermissions: typeof exportPermissions;
};
export default _default;
//# sourceMappingURL=security-access-control-kit.d.ts.map