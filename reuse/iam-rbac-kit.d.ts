/**
 * @fileoverview IAM Role-Based Access Control (RBAC) Kit
 * @module reuse/iam-rbac-kit
 * @description Comprehensive RBAC utilities with deep Sequelize integration for role hierarchy,
 * role inheritance, permission bundling, group-based access, and role analytics.
 *
 * Key Features:
 * - Role hierarchy and inheritance with Sequelize associations
 * - Role assignment and revocation with audit trails
 * - Group-based role management
 * - Permission bundling and effective permissions calculation
 * - Role templates and cloning
 * - Role conflict detection and resolution
 * - Role analytics and reporting
 * - Multi-tenancy support
 * - Temporary role assignments
 * - Role delegation and impersonation
 *
 * @target Sequelize v6.x, Node 18+, TypeScript 5.x
 *
 * @security
 * - HIPAA-compliant role management
 * - Audit logging for all role changes
 * - Role separation and least privilege enforcement
 * - Time-bound role assignments
 * - Role approval workflows
 *
 * @example Basic usage
 * ```typescript
 * import { assignRoleToUser, getUserEffectivePermissions, createRoleHierarchy } from './iam-rbac-kit';
 *
 * // Assign role
 * await assignRoleToUser(userId, roleId, { expiresAt: new Date('2025-12-31') });
 *
 * // Get effective permissions
 * const permissions = await getUserEffectivePermissions(userId);
 * ```
 *
 * @example Advanced usage
 * ```typescript
 * import {
 *   createRoleWithInheritance,
 *   detectRoleConflicts,
 *   cloneRoleTemplate
 * } from './iam-rbac-kit';
 *
 * // Create role with inheritance
 * const role = await createRoleWithInheritance({
 *   name: 'Senior Doctor',
 *   inheritsFrom: ['Doctor', 'Researcher']
 * });
 *
 * // Detect conflicts
 * const conflicts = await detectRoleConflicts(userId);
 * ```
 *
 * LOC: RBAC8901X234
 * UPSTREAM: sequelize, @types/sequelize
 * DOWNSTREAM: IAM services, authorization middleware, access control
 *
 * @version 1.0.0
 * @since 2025-11-08
 */
import { Model, ModelStatic, Transaction } from 'sequelize';
/**
 * @interface RoleModel
 * @description Base role model interface
 */
export interface RoleModel extends Model {
    id: string;
    name: string;
    description?: string;
    isSystem: boolean;
    priority: number;
    tenantId?: string;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * @interface UserRoleModel
 * @description User-role association model
 */
export interface UserRoleModel extends Model {
    id: string;
    userId: string;
    roleId: string;
    assignedBy?: string;
    assignedAt: Date;
    expiresAt?: Date;
    isActive: boolean;
    metadata?: Record<string, any>;
}
/**
 * @interface PermissionModel
 * @description Permission model interface
 */
export interface PermissionModel extends Model {
    id: string;
    resource: string;
    action: string;
    scope?: string;
    conditions?: Record<string, any>;
    tenantId?: string;
}
/**
 * @interface RolePermissionModel
 * @description Role-permission association model
 */
export interface RolePermissionModel extends Model {
    id: string;
    roleId: string;
    permissionId: string;
    isDenied: boolean;
    priority: number;
}
/**
 * @interface RoleHierarchyModel
 * @description Role inheritance hierarchy model
 */
export interface RoleHierarchyModel extends Model {
    id: string;
    parentRoleId: string;
    childRoleId: string;
    depth: number;
    priority: number;
}
/**
 * @interface GroupModel
 * @description Group model for group-based roles
 */
export interface GroupModel extends Model {
    id: string;
    name: string;
    description?: string;
    tenantId?: string;
}
/**
 * @interface RoleAssignmentConfig
 * @description Configuration for role assignment
 */
export interface RoleAssignmentConfig {
    /** User ID */
    userId: string;
    /** Role ID */
    roleId: string;
    /** Assigned by user ID */
    assignedBy?: string;
    /** Expiration date */
    expiresAt?: Date;
    /** Metadata */
    metadata?: Record<string, any>;
    /** Transaction */
    transaction?: Transaction;
}
/**
 * @interface RoleHierarchyConfig
 * @description Configuration for role hierarchy
 */
export interface RoleHierarchyConfig {
    /** Parent role ID */
    parentRoleId: string;
    /** Child role ID */
    childRoleId: string;
    /** Inheritance depth */
    depth?: number;
    /** Priority */
    priority?: number;
    /** Transaction */
    transaction?: Transaction;
}
/**
 * @interface EffectivePermissionsOptions
 * @description Options for calculating effective permissions
 */
export interface EffectivePermissionsOptions {
    /** Include denied permissions */
    includeDenied?: boolean;
    /** Include expired roles */
    includeExpired?: boolean;
    /** Filter by resource */
    resource?: string;
    /** Filter by action */
    action?: string;
    /** Tenant ID */
    tenantId?: string;
}
/**
 * @interface RoleConflict
 * @description Role conflict information
 */
export interface RoleConflict {
    /** Conflict type */
    type: 'permission' | 'hierarchy' | 'separation';
    /** Severity */
    severity: 'low' | 'medium' | 'high' | 'critical';
    /** Description */
    description: string;
    /** Involved roles */
    roles: string[];
    /** Conflicting permissions */
    permissions?: string[];
}
/**
 * @interface RoleTemplateConfig
 * @description Configuration for role templates
 */
export interface RoleTemplateConfig {
    /** Template name */
    name: string;
    /** Description */
    description?: string;
    /** Base permissions */
    permissions: string[];
    /** Inherits from roles */
    inheritsFrom?: string[];
    /** Metadata */
    metadata?: Record<string, any>;
}
/**
 * @interface RoleAnalytics
 * @description Role analytics data
 */
export interface RoleAnalytics {
    /** Total roles */
    totalRoles: number;
    /** Active assignments */
    activeAssignments: number;
    /** Expired assignments */
    expiredAssignments: number;
    /** Most assigned roles */
    mostAssigned: Array<{
        roleId: string;
        count: number;
    }>;
    /** Least used roles */
    leastUsed: Array<{
        roleId: string;
        count: number;
    }>;
    /** Average permissions per role */
    avgPermissionsPerRole: number;
}
/**
 * @function assignRoleToUser
 * @description Assigns a role to a user with audit trail
 *
 * @param {ModelStatic<UserRoleModel>} UserRole - UserRole model
 * @param {RoleAssignmentConfig} config - Assignment configuration
 * @returns {Promise<UserRoleModel>} Created assignment
 *
 * @example
 * ```typescript
 * const assignment = await assignRoleToUser(UserRole, {
 *   userId: 'user-123',
 *   roleId: 'role-456',
 *   assignedBy: 'admin-789',
 *   expiresAt: new Date('2025-12-31')
 * });
 * ```
 */
export declare function assignRoleToUser(UserRole: ModelStatic<UserRoleModel>, config: RoleAssignmentConfig): Promise<UserRoleModel>;
/**
 * @function revokeRoleFromUser
 * @description Revokes a role from a user
 *
 * @param {ModelStatic<UserRoleModel>} UserRole - UserRole model
 * @param {string} userId - User ID
 * @param {string} roleId - Role ID
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<number>} Number of revoked assignments
 *
 * @example
 * ```typescript
 * const revoked = await revokeRoleFromUser(UserRole, 'user-123', 'role-456');
 * console.log(`Revoked ${revoked} role assignments`);
 * ```
 */
export declare function revokeRoleFromUser(UserRole: ModelStatic<UserRoleModel>, userId: string, roleId: string, transaction?: Transaction): Promise<number>;
/**
 * @function assignTemporaryRole
 * @description Assigns a temporary role with automatic expiration
 *
 * @param {ModelStatic<UserRoleModel>} UserRole - UserRole model
 * @param {string} userId - User ID
 * @param {string} roleId - Role ID
 * @param {number} durationHours - Duration in hours
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<UserRoleModel>} Created assignment
 *
 * @example
 * ```typescript
 * // Assign role for 24 hours
 * const tempRole = await assignTemporaryRole(
 *   UserRole,
 *   'user-123',
 *   'emergency-access',
 *   24
 * );
 * ```
 */
export declare function assignTemporaryRole(UserRole: ModelStatic<UserRoleModel>, userId: string, roleId: string, durationHours: number, transaction?: Transaction): Promise<UserRoleModel>;
/**
 * @function assignRolesToUser
 * @description Bulk assigns multiple roles to a user
 *
 * @param {ModelStatic<UserRoleModel>} UserRole - UserRole model
 * @param {string} userId - User ID
 * @param {string[]} roleIds - Array of role IDs
 * @param {object} options - Assignment options
 * @returns {Promise<UserRoleModel[]>} Created assignments
 *
 * @example
 * ```typescript
 * const assignments = await assignRolesToUser(
 *   UserRole,
 *   'user-123',
 *   ['role-1', 'role-2', 'role-3'],
 *   { assignedBy: 'admin-789' }
 * );
 * ```
 */
export declare function assignRolesToUser(UserRole: ModelStatic<UserRoleModel>, userId: string, roleIds: string[], options?: {
    assignedBy?: string;
    expiresAt?: Date;
    transaction?: Transaction;
}): Promise<UserRoleModel[]>;
/**
 * @function getUserRoles
 * @description Gets all active roles for a user with associations
 *
 * @param {ModelStatic<UserRoleModel>} UserRole - UserRole model
 * @param {ModelStatic<RoleModel>} Role - Role model
 * @param {string} userId - User ID
 * @param {boolean} includeExpired - Include expired roles
 * @returns {Promise<RoleModel[]>} User's roles
 *
 * @example
 * ```typescript
 * const roles = await getUserRoles(UserRole, Role, 'user-123');
 * roles.forEach(role => console.log(role.name));
 * ```
 */
export declare function getUserRoles(UserRole: ModelStatic<UserRoleModel>, Role: ModelStatic<RoleModel>, userId: string, includeExpired?: boolean): Promise<RoleModel[]>;
/**
 * @function createRoleHierarchy
 * @description Creates a parent-child role hierarchy relationship
 *
 * @param {ModelStatic<RoleHierarchyModel>} RoleHierarchy - RoleHierarchy model
 * @param {RoleHierarchyConfig} config - Hierarchy configuration
 * @returns {Promise<RoleHierarchyModel>} Created hierarchy
 *
 * @example
 * ```typescript
 * const hierarchy = await createRoleHierarchy(RoleHierarchy, {
 *   parentRoleId: 'senior-doctor',
 *   childRoleId: 'doctor',
 *   depth: 1
 * });
 * ```
 */
export declare function createRoleHierarchy(RoleHierarchy: ModelStatic<RoleHierarchyModel>, config: RoleHierarchyConfig): Promise<RoleHierarchyModel>;
/**
 * @function getRoleAncestors
 * @description Gets all ancestor roles in the hierarchy
 *
 * @param {ModelStatic<RoleHierarchyModel>} RoleHierarchy - RoleHierarchy model
 * @param {ModelStatic<RoleModel>} Role - Role model
 * @param {string} roleId - Role ID
 * @param {number} maxDepth - Maximum depth to traverse
 * @returns {Promise<RoleModel[]>} Ancestor roles
 *
 * @example
 * ```typescript
 * const ancestors = await getRoleAncestors(
 *   RoleHierarchy,
 *   Role,
 *   'junior-doctor'
 * );
 * // Returns: ['doctor', 'healthcare-provider', 'user']
 * ```
 */
export declare function getRoleAncestors(RoleHierarchy: ModelStatic<RoleHierarchyModel>, Role: ModelStatic<RoleModel>, roleId: string, maxDepth?: number): Promise<RoleModel[]>;
/**
 * @function getRoleDescendants
 * @description Gets all descendant roles in the hierarchy
 *
 * @param {ModelStatic<RoleHierarchyModel>} RoleHierarchy - RoleHierarchy model
 * @param {ModelStatic<RoleModel>} Role - Role model
 * @param {string} roleId - Role ID
 * @param {number} maxDepth - Maximum depth to traverse
 * @returns {Promise<RoleModel[]>} Descendant roles
 *
 * @example
 * ```typescript
 * const descendants = await getRoleDescendants(
 *   RoleHierarchy,
 *   Role,
 *   'healthcare-provider'
 * );
 * // Returns: ['doctor', 'nurse', 'junior-doctor']
 * ```
 */
export declare function getRoleDescendants(RoleHierarchy: ModelStatic<RoleHierarchyModel>, Role: ModelStatic<RoleModel>, roleId: string, maxDepth?: number): Promise<RoleModel[]>;
/**
 * @function buildRoleTree
 * @description Builds a complete role hierarchy tree
 *
 * @param {ModelStatic<RoleModel>} Role - Role model
 * @param {ModelStatic<RoleHierarchyModel>} RoleHierarchy - RoleHierarchy model
 * @param {string} rootRoleId - Root role ID
 * @returns {Promise<any>} Role tree structure
 *
 * @example
 * ```typescript
 * const tree = await buildRoleTree(Role, RoleHierarchy, 'admin');
 * // Returns nested tree structure with children
 * ```
 */
export declare function buildRoleTree(Role: ModelStatic<RoleModel>, RoleHierarchy: ModelStatic<RoleHierarchyModel>, rootRoleId?: string): Promise<any>;
/**
 * @function getRoleInheritancePath
 * @description Gets the complete inheritance path for a role
 *
 * @param {ModelStatic<RoleHierarchyModel>} RoleHierarchy - RoleHierarchy model
 * @param {ModelStatic<RoleModel>} Role - Role model
 * @param {string} roleId - Role ID
 * @returns {Promise<string[]>} Array of role IDs from root to current role
 *
 * @example
 * ```typescript
 * const path = await getRoleInheritancePath(
 *   RoleHierarchy,
 *   Role,
 *   'junior-doctor'
 * );
 * // Returns: ['user', 'healthcare-provider', 'doctor', 'junior-doctor']
 * ```
 */
export declare function getRoleInheritancePath(RoleHierarchy: ModelStatic<RoleHierarchyModel>, Role: ModelStatic<RoleModel>, roleId: string): Promise<string[]>;
/**
 * @function assignPermissionToRole
 * @description Assigns a permission to a role
 *
 * @param {ModelStatic<RolePermissionModel>} RolePermission - RolePermission model
 * @param {string} roleId - Role ID
 * @param {string} permissionId - Permission ID
 * @param {object} options - Assignment options
 * @returns {Promise<RolePermissionModel>} Created assignment
 *
 * @example
 * ```typescript
 * await assignPermissionToRole(RolePermission, 'doctor', 'read-patient-records', {
 *   priority: 10
 * });
 * ```
 */
export declare function assignPermissionToRole(RolePermission: ModelStatic<RolePermissionModel>, roleId: string, permissionId: string, options?: {
    isDenied?: boolean;
    priority?: number;
    transaction?: Transaction;
}): Promise<RolePermissionModel>;
/**
 * @function assignPermissionsToRole
 * @description Bulk assigns permissions to a role
 *
 * @param {ModelStatic<RolePermissionModel>} RolePermission - RolePermission model
 * @param {string} roleId - Role ID
 * @param {string[]} permissionIds - Permission IDs
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<RolePermissionModel[]>} Created assignments
 *
 * @example
 * ```typescript
 * await assignPermissionsToRole(
 *   RolePermission,
 *   'nurse',
 *   ['read-vitals', 'update-vitals', 'create-notes']
 * );
 * ```
 */
export declare function assignPermissionsToRole(RolePermission: ModelStatic<RolePermissionModel>, roleId: string, permissionIds: string[], transaction?: Transaction): Promise<RolePermissionModel[]>;
/**
 * @function getRolePermissions
 * @description Gets all permissions for a role with associations
 *
 * @param {ModelStatic<RolePermissionModel>} RolePermission - RolePermission model
 * @param {ModelStatic<PermissionModel>} Permission - Permission model
 * @param {string} roleId - Role ID
 * @param {boolean} includeDenied - Include denied permissions
 * @returns {Promise<PermissionModel[]>} Role's permissions
 *
 * @example
 * ```typescript
 * const permissions = await getRolePermissions(
 *   RolePermission,
 *   Permission,
 *   'doctor'
 * );
 * ```
 */
export declare function getRolePermissions(RolePermission: ModelStatic<RolePermissionModel>, Permission: ModelStatic<PermissionModel>, roleId: string, includeDenied?: boolean): Promise<PermissionModel[]>;
/**
 * @function getUserEffectivePermissions
 * @description Calculates effective permissions for a user including inheritance
 *
 * @param {ModelStatic<UserRoleModel>} UserRole - UserRole model
 * @param {ModelStatic<RoleModel>} Role - Role model
 * @param {ModelStatic<RolePermissionModel>} RolePermission - RolePermission model
 * @param {ModelStatic<PermissionModel>} Permission - Permission model
 * @param {ModelStatic<RoleHierarchyModel>} RoleHierarchy - RoleHierarchy model
 * @param {string} userId - User ID
 * @param {EffectivePermissionsOptions} options - Calculation options
 * @returns {Promise<PermissionModel[]>} Effective permissions
 *
 * @example
 * ```typescript
 * const permissions = await getUserEffectivePermissions(
 *   UserRole,
 *   Role,
 *   RolePermission,
 *   Permission,
 *   RoleHierarchy,
 *   'user-123',
 *   { resource: 'patient-records' }
 * );
 * ```
 */
export declare function getUserEffectivePermissions(UserRole: ModelStatic<UserRoleModel>, Role: ModelStatic<RoleModel>, RolePermission: ModelStatic<RolePermissionModel>, Permission: ModelStatic<PermissionModel>, RoleHierarchy: ModelStatic<RoleHierarchyModel>, userId: string, options?: EffectivePermissionsOptions): Promise<PermissionModel[]>;
/**
 * @function checkUserPermission
 * @description Checks if a user has a specific permission
 *
 * @param {ModelStatic<UserRoleModel>} UserRole - UserRole model
 * @param {ModelStatic<RoleModel>} Role - Role model
 * @param {ModelStatic<RolePermissionModel>} RolePermission - RolePermission model
 * @param {ModelStatic<PermissionModel>} Permission - Permission model
 * @param {ModelStatic<RoleHierarchyModel>} RoleHierarchy - RoleHierarchy model
 * @param {string} userId - User ID
 * @param {string} resource - Resource name
 * @param {string} action - Action name
 * @returns {Promise<boolean>} True if user has permission
 *
 * @example
 * ```typescript
 * const canRead = await checkUserPermission(
 *   UserRole, Role, RolePermission, Permission, RoleHierarchy,
 *   'user-123', 'patient-records', 'read'
 * );
 * ```
 */
export declare function checkUserPermission(UserRole: ModelStatic<UserRoleModel>, Role: ModelStatic<RoleModel>, RolePermission: ModelStatic<RolePermissionModel>, Permission: ModelStatic<PermissionModel>, RoleHierarchy: ModelStatic<RoleHierarchyModel>, userId: string, resource: string, action: string): Promise<boolean>;
/**
 * @function assignRoleToGroup
 * @description Assigns a role to a group
 *
 * @param {ModelStatic<any>} GroupRole - GroupRole model
 * @param {string} groupId - Group ID
 * @param {string} roleId - Role ID
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<any>} Created assignment
 *
 * @example
 * ```typescript
 * await assignRoleToGroup(GroupRole, 'cardiology-dept', 'department-admin');
 * ```
 */
export declare function assignRoleToGroup(GroupRole: ModelStatic<any>, groupId: string, roleId: string, transaction?: Transaction): Promise<any>;
/**
 * @function getUserGroupRoles
 * @description Gets all roles assigned via groups for a user
 *
 * @param {ModelStatic<any>} UserGroup - UserGroup model
 * @param {ModelStatic<any>} GroupRole - GroupRole model
 * @param {ModelStatic<RoleModel>} Role - Role model
 * @param {string} userId - User ID
 * @returns {Promise<RoleModel[]>} Group-based roles
 *
 * @example
 * ```typescript
 * const groupRoles = await getUserGroupRoles(
 *   UserGroup,
 *   GroupRole,
 *   Role,
 *   'user-123'
 * );
 * ```
 */
export declare function getUserGroupRoles(UserGroup: ModelStatic<any>, GroupRole: ModelStatic<any>, Role: ModelStatic<RoleModel>, userId: string): Promise<RoleModel[]>;
/**
 * @function syncGroupMemberRoles
 * @description Synchronizes roles for all members of a group
 *
 * @param {ModelStatic<any>} UserGroup - UserGroup model
 * @param {ModelStatic<any>} GroupRole - GroupRole model
 * @param {ModelStatic<UserRoleModel>} UserRole - UserRole model
 * @param {string} groupId - Group ID
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * // Sync all group member roles after group role changes
 * await syncGroupMemberRoles(UserGroup, GroupRole, UserRole, 'emergency-team');
 * ```
 */
export declare function syncGroupMemberRoles(UserGroup: ModelStatic<any>, GroupRole: ModelStatic<any>, UserRole: ModelStatic<UserRoleModel>, groupId: string, transaction?: Transaction): Promise<void>;
/**
 * @function createRoleFromTemplate
 * @description Creates a role from a template configuration
 *
 * @param {ModelStatic<RoleModel>} Role - Role model
 * @param {ModelStatic<RolePermissionModel>} RolePermission - RolePermission model
 * @param {ModelStatic<PermissionModel>} Permission - Permission model
 * @param {RoleTemplateConfig} template - Template configuration
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<RoleModel>} Created role
 *
 * @example
 * ```typescript
 * const role = await createRoleFromTemplate(Role, RolePermission, Permission, {
 *   name: 'ICU Nurse',
 *   permissions: ['read-vitals', 'update-vitals', 'administer-meds'],
 *   inheritsFrom: ['nurse']
 * });
 * ```
 */
export declare function createRoleFromTemplate(Role: ModelStatic<RoleModel>, RolePermission: ModelStatic<RolePermissionModel>, Permission: ModelStatic<PermissionModel>, template: RoleTemplateConfig, transaction?: Transaction): Promise<RoleModel>;
/**
 * @function cloneRole
 * @description Creates a copy of an existing role
 *
 * @param {ModelStatic<RoleModel>} Role - Role model
 * @param {ModelStatic<RolePermissionModel>} RolePermission - RolePermission model
 * @param {string} sourceRoleId - Source role ID
 * @param {string} newName - New role name
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<RoleModel>} Cloned role
 *
 * @example
 * ```typescript
 * const newRole = await cloneRole(
 *   Role,
 *   RolePermission,
 *   'senior-doctor',
 *   'Senior Consultant'
 * );
 * ```
 */
export declare function cloneRole(Role: ModelStatic<RoleModel>, RolePermission: ModelStatic<RolePermissionModel>, sourceRoleId: string, newName: string, transaction?: Transaction): Promise<RoleModel>;
/**
 * @function exportRoleTemplate
 * @description Exports a role as a reusable template
 *
 * @param {ModelStatic<RoleModel>} Role - Role model
 * @param {ModelStatic<RolePermissionModel>} RolePermission - RolePermission model
 * @param {ModelStatic<PermissionModel>} Permission - Permission model
 * @param {string} roleId - Role ID
 * @returns {Promise<RoleTemplateConfig>} Role template
 *
 * @example
 * ```typescript
 * const template = await exportRoleTemplate(
 *   Role,
 *   RolePermission,
 *   Permission,
 *   'emergency-responder'
 * );
 * // Save template to file or database
 * ```
 */
export declare function exportRoleTemplate(Role: ModelStatic<RoleModel>, RolePermission: ModelStatic<RolePermissionModel>, Permission: ModelStatic<PermissionModel>, roleId: string): Promise<RoleTemplateConfig>;
/**
 * @function detectRoleConflicts
 * @description Detects conflicts in user's role assignments
 *
 * @param {ModelStatic<UserRoleModel>} UserRole - UserRole model
 * @param {ModelStatic<RoleModel>} Role - Role model
 * @param {ModelStatic<RolePermissionModel>} RolePermission - RolePermission model
 * @param {string} userId - User ID
 * @returns {Promise<RoleConflict[]>} Detected conflicts
 *
 * @example
 * ```typescript
 * const conflicts = await detectRoleConflicts(
 *   UserRole,
 *   Role,
 *   RolePermission,
 *   'user-123'
 * );
 * conflicts.forEach(c => console.log(c.description));
 * ```
 */
export declare function detectRoleConflicts(UserRole: ModelStatic<UserRoleModel>, Role: ModelStatic<RoleModel>, RolePermission: ModelStatic<RolePermissionModel>, userId: string): Promise<RoleConflict[]>;
/**
 * @function detectSeparationOfDutyViolations
 * @description Detects separation of duty violations
 *
 * @param {ModelStatic<UserRoleModel>} UserRole - UserRole model
 * @param {ModelStatic<RoleModel>} Role - Role model
 * @param {string} userId - User ID
 * @param {Array<[string, string]>} mutuallyExclusiveRoles - Pairs of mutually exclusive roles
 * @returns {Promise<RoleConflict[]>} Detected violations
 *
 * @example
 * ```typescript
 * const violations = await detectSeparationOfDutyViolations(
 *   UserRole,
 *   Role,
 *   'user-123',
 *   [['prescriber', 'dispenser'], ['auditor', 'operator']]
 * );
 * ```
 */
export declare function detectSeparationOfDutyViolations(UserRole: ModelStatic<UserRoleModel>, Role: ModelStatic<RoleModel>, userId: string, mutuallyExclusiveRoles: Array<[string, string]>): Promise<RoleConflict[]>;
/**
 * @function resolveRoleConflicts
 * @description Automatically resolves role conflicts based on priority
 *
 * @param {ModelStatic<UserRoleModel>} UserRole - UserRole model
 * @param {ModelStatic<RoleModel>} Role - Role model
 * @param {string} userId - User ID
 * @param {RoleConflict[]} conflicts - Conflicts to resolve
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * const conflicts = await detectRoleConflicts(UserRole, Role, RolePermission, userId);
 * await resolveRoleConflicts(UserRole, Role, userId, conflicts);
 * ```
 */
export declare function resolveRoleConflicts(UserRole: ModelStatic<UserRoleModel>, Role: ModelStatic<RoleModel>, userId: string, conflicts: RoleConflict[], transaction?: Transaction): Promise<void>;
/**
 * @function getRoleAnalytics
 * @description Generates comprehensive role analytics
 *
 * @param {ModelStatic<RoleModel>} Role - Role model
 * @param {ModelStatic<UserRoleModel>} UserRole - UserRole model
 * @param {ModelStatic<RolePermissionModel>} RolePermission - RolePermission model
 * @param {string} tenantId - Optional tenant ID
 * @returns {Promise<RoleAnalytics>} Analytics data
 *
 * @example
 * ```typescript
 * const analytics = await getRoleAnalytics(Role, UserRole, RolePermission);
 * console.log(`Total roles: ${analytics.totalRoles}`);
 * console.log(`Active assignments: ${analytics.activeAssignments}`);
 * ```
 */
export declare function getRoleAnalytics(Role: ModelStatic<RoleModel>, UserRole: ModelStatic<UserRoleModel>, RolePermission: ModelStatic<RolePermissionModel>, tenantId?: string): Promise<RoleAnalytics>;
/**
 * @function getRoleUsageReport
 * @description Generates detailed role usage report
 *
 * @param {ModelStatic<RoleModel>} Role - Role model
 * @param {ModelStatic<UserRoleModel>} UserRole - UserRole model
 * @param {string} roleId - Role ID
 * @returns {Promise<any>} Usage report
 *
 * @example
 * ```typescript
 * const report = await getRoleUsageReport(Role, UserRole, 'doctor');
 * console.log(`Active users: ${report.activeUsers}`);
 * console.log(`Assignment history: ${report.history.length}`);
 * ```
 */
export declare function getRoleUsageReport(Role: ModelStatic<RoleModel>, UserRole: ModelStatic<UserRoleModel>, roleId: string): Promise<any>;
/**
 * @function getUnusedRoles
 * @description Finds roles with no active assignments
 *
 * @param {ModelStatic<RoleModel>} Role - Role model
 * @param {ModelStatic<UserRoleModel>} UserRole - UserRole model
 * @param {number} daysSinceLastUse - Days threshold
 * @returns {Promise<RoleModel[]>} Unused roles
 *
 * @example
 * ```typescript
 * const unusedRoles = await getUnusedRoles(Role, UserRole, 90);
 * console.log(`Found ${unusedRoles.length} unused roles`);
 * ```
 */
export declare function getUnusedRoles(Role: ModelStatic<RoleModel>, UserRole: ModelStatic<UserRoleModel>, daysSinceLastUse?: number): Promise<RoleModel[]>;
/**
 * @function getRoleGrowthMetrics
 * @description Tracks role assignment growth over time
 *
 * @param {ModelStatic<UserRoleModel>} UserRole - UserRole model
 * @param {string} roleId - Role ID
 * @param {number} days - Number of days to analyze
 * @returns {Promise<Array<{ date: Date; count: number }>>} Growth metrics
 *
 * @example
 * ```typescript
 * const growth = await getRoleGrowthMetrics(UserRole, 'doctor', 30);
 * growth.forEach(g => console.log(`${g.date}: ${g.count} assignments`));
 * ```
 */
export declare function getRoleGrowthMetrics(UserRole: ModelStatic<UserRoleModel>, roleId: string, days?: number): Promise<Array<{
    date: Date;
    count: number;
}>>;
/**
 * @function delegateRole
 * @description Allows a user to temporarily delegate their role to another user
 *
 * @param {ModelStatic<UserRoleModel>} UserRole - UserRole model
 * @param {string} fromUserId - Delegating user ID
 * @param {string} toUserId - Receiving user ID
 * @param {string} roleId - Role ID to delegate
 * @param {number} durationHours - Delegation duration
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<UserRoleModel>} Delegated role assignment
 *
 * @example
 * ```typescript
 * // Delegate on-call doctor role for 12 hours
 * await delegateRole(UserRole, 'doctor-1', 'doctor-2', 'on-call-doctor', 12);
 * ```
 */
export declare function delegateRole(UserRole: ModelStatic<UserRoleModel>, fromUserId: string, toUserId: string, roleId: string, durationHours: number, transaction?: Transaction): Promise<UserRoleModel>;
/**
 * @function createImpersonationSession
 * @description Creates a temporary impersonation session
 *
 * @param {ModelStatic<any>} ImpersonationSession - ImpersonationSession model
 * @param {string} adminUserId - Admin user ID
 * @param {string} targetUserId - Target user ID
 * @param {string} reason - Impersonation reason
 * @param {number} durationMinutes - Duration in minutes
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<any>} Impersonation session
 *
 * @example
 * ```typescript
 * const session = await createImpersonationSession(
 *   ImpersonationSession,
 *   'admin-123',
 *   'user-456',
 *   'Emergency patient access',
 *   30
 * );
 * ```
 */
export declare function createImpersonationSession(ImpersonationSession: ModelStatic<any>, adminUserId: string, targetUserId: string, reason: string, durationMinutes: number, transaction?: Transaction): Promise<any>;
/**
 * @function endImpersonationSession
 * @description Ends an active impersonation session
 *
 * @param {ModelStatic<any>} ImpersonationSession - ImpersonationSession model
 * @param {string} sessionId - Session ID
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await endImpersonationSession(ImpersonationSession, 'session-789');
 * ```
 */
export declare function endImpersonationSession(ImpersonationSession: ModelStatic<any>, sessionId: string, transaction?: Transaction): Promise<void>;
/**
 * @function cleanupExpiredRoleAssignments
 * @description Removes expired role assignments
 *
 * @param {ModelStatic<UserRoleModel>} UserRole - UserRole model
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<number>} Number of cleaned up assignments
 *
 * @example
 * ```typescript
 * const cleaned = await cleanupExpiredRoleAssignments(UserRole);
 * console.log(`Cleaned up ${cleaned} expired role assignments`);
 * ```
 */
export declare function cleanupExpiredRoleAssignments(UserRole: ModelStatic<UserRoleModel>, transaction?: Transaction): Promise<number>;
/**
 * @function getRolesByPriority
 * @description Gets roles ordered by priority
 *
 * @param {ModelStatic<RoleModel>} Role - Role model
 * @param {string} tenantId - Optional tenant ID
 * @returns {Promise<RoleModel[]>} Roles ordered by priority
 *
 * @example
 * ```typescript
 * const roles = await getRolesByPriority(Role);
 * ```
 */
export declare function getRolesByPriority(Role: ModelStatic<RoleModel>, tenantId?: string): Promise<RoleModel[]>;
/**
 * @function mergeRoles
 * @description Merges two roles into a new role
 *
 * @param {ModelStatic<RoleModel>} Role - Role model
 * @param {ModelStatic<RolePermissionModel>} RolePermission - RolePermission model
 * @param {string} role1Id - First role ID
 * @param {string} role2Id - Second role ID
 * @param {string} newName - New role name
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<RoleModel>} Merged role
 *
 * @example
 * ```typescript
 * const merged = await mergeRoles(Role, RolePermission, 'doctor', 'researcher', 'Doctor-Researcher');
 * ```
 */
export declare function mergeRoles(Role: ModelStatic<RoleModel>, RolePermission: ModelStatic<RolePermissionModel>, role1Id: string, role2Id: string, newName: string, transaction?: Transaction): Promise<RoleModel>;
/**
 * @function getRoleComparison
 * @description Compares two roles and returns differences
 *
 * @param {ModelStatic<RolePermissionModel>} RolePermission - RolePermission model
 * @param {ModelStatic<PermissionModel>} Permission - Permission model
 * @param {string} role1Id - First role ID
 * @param {string} role2Id - Second role ID
 * @returns {Promise<any>} Comparison result
 *
 * @example
 * ```typescript
 * const comparison = await getRoleComparison(RolePermission, Permission, 'doctor', 'nurse');
 * console.log('Unique to role1:', comparison.uniqueToRole1);
 * console.log('Unique to role2:', comparison.uniqueToRole2);
 * console.log('Common:', comparison.common);
 * ```
 */
export declare function getRoleComparison(RolePermission: ModelStatic<RolePermissionModel>, Permission: ModelStatic<PermissionModel>, role1Id: string, role2Id: string): Promise<any>;
/**
 * @function getInheritedPermissions
 * @description Gets inherited permissions from parent roles
 *
 * @param {ModelStatic<RoleHierarchyModel>} RoleHierarchy - RoleHierarchy model
 * @param {ModelStatic<RolePermissionModel>} RolePermission - RolePermission model
 * @param {ModelStatic<PermissionModel>} Permission - Permission model
 * @param {ModelStatic<RoleModel>} Role - Role model
 * @param {string} roleId - Role ID
 * @returns {Promise<PermissionModel[]>} Inherited permissions
 *
 * @example
 * ```typescript
 * const inherited = await getInheritedPermissions(
 *   RoleHierarchy,
 *   RolePermission,
 *   Permission,
 *   Role,
 *   'junior-doctor'
 * );
 * ```
 */
export declare function getInheritedPermissions(RoleHierarchy: ModelStatic<RoleHierarchyModel>, RolePermission: ModelStatic<RolePermissionModel>, Permission: ModelStatic<PermissionModel>, Role: ModelStatic<RoleModel>, roleId: string): Promise<PermissionModel[]>;
/**
 * @function updateRolePriority
 * @description Updates role priority and reorders
 *
 * @param {ModelStatic<RoleModel>} Role - Role model
 * @param {string} roleId - Role ID
 * @param {number} newPriority - New priority
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<RoleModel>} Updated role
 *
 * @example
 * ```typescript
 * await updateRolePriority(Role, 'admin', 1000);
 * ```
 */
export declare function updateRolePriority(Role: ModelStatic<RoleModel>, roleId: string, newPriority: number, transaction?: Transaction): Promise<RoleModel>;
/**
 * @function getRolesByPermission
 * @description Gets all roles that have a specific permission
 *
 * @param {ModelStatic<RoleModel>} Role - Role model
 * @param {ModelStatic<RolePermissionModel>} RolePermission - RolePermission model
 * @param {string} permissionId - Permission ID
 * @returns {Promise<RoleModel[]>} Roles with permission
 *
 * @example
 * ```typescript
 * const roles = await getRolesByPermission(Role, RolePermission, 'delete-patient-records');
 * ```
 */
export declare function getRolesByPermission(Role: ModelStatic<RoleModel>, RolePermission: ModelStatic<RolePermissionModel>, permissionId: string): Promise<RoleModel[]>;
/**
 * @function getUsersByRole
 * @description Gets all users assigned to a specific role
 *
 * @param {ModelStatic<UserRoleModel>} UserRole - UserRole model
 * @param {string} roleId - Role ID
 * @param {boolean} activeOnly - Only active assignments
 * @returns {Promise<string[]>} User IDs
 *
 * @example
 * ```typescript
 * const userIds = await getUsersByRole(UserRole, 'doctor', true);
 * ```
 */
export declare function getUsersByRole(UserRole: ModelStatic<UserRoleModel>, roleId: string, activeOnly?: boolean): Promise<string[]>;
/**
 * @function getRoleChangeHistory
 * @description Gets role assignment change history for a user
 *
 * @param {ModelStatic<UserRoleModel>} UserRole - UserRole model
 * @param {string} userId - User ID
 * @param {number} limit - Limit results
 * @returns {Promise<UserRoleModel[]>} Role history
 *
 * @example
 * ```typescript
 * const history = await getRoleChangeHistory(UserRole, 'user-123', 10);
 * ```
 */
export declare function getRoleChangeHistory(UserRole: ModelStatic<UserRoleModel>, userId: string, limit?: number): Promise<UserRoleModel[]>;
/**
 * @function validateRoleAssignment
 * @description Validates if a role can be assigned to a user
 *
 * @param {ModelStatic<UserRoleModel>} UserRole - UserRole model
 * @param {ModelStatic<RoleModel>} Role - Role model
 * @param {string} userId - User ID
 * @param {string} roleId - Role ID
 * @returns {Promise<{ valid: boolean; reason?: string }>} Validation result
 *
 * @example
 * ```typescript
 * const validation = await validateRoleAssignment(UserRole, Role, 'user-123', 'admin');
 * if (!validation.valid) {
 *   console.error(validation.reason);
 * }
 * ```
 */
export declare function validateRoleAssignment(UserRole: ModelStatic<UserRoleModel>, Role: ModelStatic<RoleModel>, userId: string, roleId: string): Promise<{
    valid: boolean;
    reason?: string;
}>;
/**
 * @function cascadeRoleDelete
 * @description Deletes a role and cascades to assignments
 *
 * @param {ModelStatic<RoleModel>} Role - Role model
 * @param {ModelStatic<UserRoleModel>} UserRole - UserRole model
 * @param {ModelStatic<RolePermissionModel>} RolePermission - RolePermission model
 * @param {ModelStatic<RoleHierarchyModel>} RoleHierarchy - RoleHierarchy model
 * @param {string} roleId - Role ID
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await cascadeRoleDelete(Role, UserRole, RolePermission, RoleHierarchy, 'deprecated-role');
 * ```
 */
export declare function cascadeRoleDelete(Role: ModelStatic<RoleModel>, UserRole: ModelStatic<UserRoleModel>, RolePermission: ModelStatic<RolePermissionModel>, RoleHierarchy: ModelStatic<RoleHierarchyModel>, roleId: string, transaction?: Transaction): Promise<void>;
/**
 * @function batchAssignRoles
 * @description Assigns multiple roles to multiple users
 *
 * @param {ModelStatic<UserRoleModel>} UserRole - UserRole model
 * @param {string[]} userIds - User IDs
 * @param {string[]} roleIds - Role IDs
 * @param {object} options - Assignment options
 * @returns {Promise<UserRoleModel[]>} Created assignments
 *
 * @example
 * ```typescript
 * await batchAssignRoles(UserRole, ['user1', 'user2'], ['role1', 'role2'], {
 *   assignedBy: 'admin'
 * });
 * ```
 */
export declare function batchAssignRoles(UserRole: ModelStatic<UserRoleModel>, userIds: string[], roleIds: string[], options?: {
    assignedBy?: string;
    expiresAt?: Date;
    transaction?: Transaction;
}): Promise<UserRoleModel[]>;
/**
 * @function getRoleMetrics
 * @description Gets comprehensive metrics for a role
 *
 * @param {ModelStatic<RoleModel>} Role - Role model
 * @param {ModelStatic<UserRoleModel>} UserRole - UserRole model
 * @param {ModelStatic<RolePermissionModel>} RolePermission - RolePermission model
 * @param {string} roleId - Role ID
 * @returns {Promise<any>} Role metrics
 *
 * @example
 * ```typescript
 * const metrics = await getRoleMetrics(Role, UserRole, RolePermission, 'doctor');
 * console.log(`Active users: ${metrics.activeUsers}`);
 * console.log(`Permissions: ${metrics.permissionCount}`);
 * ```
 */
export declare function getRoleMetrics(Role: ModelStatic<RoleModel>, UserRole: ModelStatic<UserRoleModel>, RolePermission: ModelStatic<RolePermissionModel>, roleId: string): Promise<any>;
/**
 * @function findOrCreateRole
 * @description Finds or creates a role with the given name
 *
 * @param {ModelStatic<RoleModel>} Role - Role model
 * @param {string} name - Role name
 * @param {object} defaults - Default values if creating
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<[RoleModel, boolean]>} Role and whether it was created
 *
 * @example
 * ```typescript
 * const [role, created] = await findOrCreateRole(Role, 'Emergency Responder', {
 *   description: 'Emergency response role',
 *   priority: 100
 * });
 * if (created) {
 *   console.log('Created new role');
 * }
 * ```
 */
export declare function findOrCreateRole(Role: ModelStatic<RoleModel>, name: string, defaults?: {
    description?: string;
    priority?: number;
    tenantId?: string;
    metadata?: Record<string, any>;
}, transaction?: Transaction): Promise<[RoleModel, boolean]>;
//# sourceMappingURL=iam-rbac-kit.d.ts.map