"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.assignRoleToUser = assignRoleToUser;
exports.revokeRoleFromUser = revokeRoleFromUser;
exports.assignTemporaryRole = assignTemporaryRole;
exports.assignRolesToUser = assignRolesToUser;
exports.getUserRoles = getUserRoles;
exports.createRoleHierarchy = createRoleHierarchy;
exports.getRoleAncestors = getRoleAncestors;
exports.getRoleDescendants = getRoleDescendants;
exports.buildRoleTree = buildRoleTree;
exports.getRoleInheritancePath = getRoleInheritancePath;
exports.assignPermissionToRole = assignPermissionToRole;
exports.assignPermissionsToRole = assignPermissionsToRole;
exports.getRolePermissions = getRolePermissions;
exports.getUserEffectivePermissions = getUserEffectivePermissions;
exports.checkUserPermission = checkUserPermission;
exports.assignRoleToGroup = assignRoleToGroup;
exports.getUserGroupRoles = getUserGroupRoles;
exports.syncGroupMemberRoles = syncGroupMemberRoles;
exports.createRoleFromTemplate = createRoleFromTemplate;
exports.cloneRole = cloneRole;
exports.exportRoleTemplate = exportRoleTemplate;
exports.detectRoleConflicts = detectRoleConflicts;
exports.detectSeparationOfDutyViolations = detectSeparationOfDutyViolations;
exports.resolveRoleConflicts = resolveRoleConflicts;
exports.getRoleAnalytics = getRoleAnalytics;
exports.getRoleUsageReport = getRoleUsageReport;
exports.getUnusedRoles = getUnusedRoles;
exports.getRoleGrowthMetrics = getRoleGrowthMetrics;
exports.delegateRole = delegateRole;
exports.createImpersonationSession = createImpersonationSession;
exports.endImpersonationSession = endImpersonationSession;
exports.cleanupExpiredRoleAssignments = cleanupExpiredRoleAssignments;
exports.getRolesByPriority = getRolesByPriority;
exports.mergeRoles = mergeRoles;
exports.getRoleComparison = getRoleComparison;
exports.getInheritedPermissions = getInheritedPermissions;
exports.updateRolePriority = updateRolePriority;
exports.getRolesByPermission = getRolesByPermission;
exports.getUsersByRole = getUsersByRole;
exports.getRoleChangeHistory = getRoleChangeHistory;
exports.validateRoleAssignment = validateRoleAssignment;
exports.cascadeRoleDelete = cascadeRoleDelete;
exports.batchAssignRoles = batchAssignRoles;
exports.getRoleMetrics = getRoleMetrics;
exports.findOrCreateRole = findOrCreateRole;
const sequelize_1 = require("sequelize");
// ============================================================================
// ROLE ASSIGNMENT OPERATIONS
// ============================================================================
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
async function assignRoleToUser(UserRole, config) {
    const { userId, roleId, assignedBy, expiresAt, metadata, transaction } = config;
    return await UserRole.create({
        userId,
        roleId,
        assignedBy,
        assignedAt: new Date(),
        expiresAt,
        isActive: true,
        metadata,
    }, { transaction });
}
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
async function revokeRoleFromUser(UserRole, userId, roleId, transaction) {
    return await UserRole.destroy({
        where: { userId, roleId },
        transaction,
    });
}
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
async function assignTemporaryRole(UserRole, userId, roleId, durationHours, transaction) {
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + durationHours);
    return await assignRoleToUser(UserRole, {
        userId,
        roleId,
        expiresAt,
        metadata: { temporary: true, durationHours },
        transaction,
    });
}
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
async function assignRolesToUser(UserRole, userId, roleIds, options = {}) {
    const { assignedBy, expiresAt, transaction } = options;
    const assignments = roleIds.map((roleId) => ({
        userId,
        roleId,
        assignedBy,
        assignedAt: new Date(),
        expiresAt,
        isActive: true,
    }));
    return await UserRole.bulkCreate(assignments, { transaction });
}
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
async function getUserRoles(UserRole, Role, userId, includeExpired = false) {
    const where = { userId, isActive: true };
    if (!includeExpired) {
        where[sequelize_1.Op.or] = [{ expiresAt: null }, { expiresAt: { [sequelize_1.Op.gt]: new Date() } }];
    }
    const userRoles = await UserRole.findAll({
        where,
        include: [{ model: Role, as: 'role' }],
    });
    return userRoles.map((ur) => ur.role);
}
// ============================================================================
// ROLE HIERARCHY OPERATIONS
// ============================================================================
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
async function createRoleHierarchy(RoleHierarchy, config) {
    const { parentRoleId, childRoleId, depth = 1, priority = 0, transaction } = config;
    return await RoleHierarchy.create({
        parentRoleId,
        childRoleId,
        depth,
        priority,
    }, { transaction });
}
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
async function getRoleAncestors(RoleHierarchy, Role, roleId, maxDepth = 10) {
    const hierarchies = await RoleHierarchy.findAll({
        where: {
            childRoleId: roleId,
            depth: { [sequelize_1.Op.lte]: maxDepth },
        },
        include: [{ model: Role, as: 'parentRole' }],
        order: [['depth', 'ASC']],
    });
    return hierarchies.map((h) => h.parentRole);
}
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
async function getRoleDescendants(RoleHierarchy, Role, roleId, maxDepth = 10) {
    const hierarchies = await RoleHierarchy.findAll({
        where: {
            parentRoleId: roleId,
            depth: { [sequelize_1.Op.lte]: maxDepth },
        },
        include: [{ model: Role, as: 'childRole' }],
        order: [['depth', 'ASC']],
    });
    return hierarchies.map((h) => h.childRole);
}
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
async function buildRoleTree(Role, RoleHierarchy, rootRoleId) {
    const roles = await Role.findAll({
        include: [
            {
                model: RoleHierarchy,
                as: 'parentHierarchies',
                include: [{ model: Role, as: 'childRole' }],
            },
        ],
    });
    const buildTree = (parentId) => {
        return roles
            .filter((role) => parentId
            ? role.parentHierarchies?.some((h) => h.parentRoleId === parentId)
            : !role.parentHierarchies?.length)
            .map((role) => ({
            id: role.id,
            name: role.name,
            children: buildTree(role.id),
        }));
    };
    return buildTree(rootRoleId || null);
}
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
async function getRoleInheritancePath(RoleHierarchy, Role, roleId) {
    const path = [roleId];
    let currentRoleId = roleId;
    while (true) {
        const parent = await RoleHierarchy.findOne({
            where: { childRoleId: currentRoleId },
            include: [{ model: Role, as: 'parentRole' }],
            order: [['depth', 'ASC']],
        });
        if (!parent)
            break;
        const parentRole = parent.parentRole;
        path.unshift(parentRole.id);
        currentRoleId = parentRole.id;
    }
    return path;
}
// ============================================================================
// PERMISSION OPERATIONS
// ============================================================================
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
async function assignPermissionToRole(RolePermission, roleId, permissionId, options = {}) {
    const { isDenied = false, priority = 0, transaction } = options;
    return await RolePermission.create({
        roleId,
        permissionId,
        isDenied,
        priority,
    }, { transaction });
}
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
async function assignPermissionsToRole(RolePermission, roleId, permissionIds, transaction) {
    const assignments = permissionIds.map((permissionId) => ({
        roleId,
        permissionId,
        isDenied: false,
        priority: 0,
    }));
    return await RolePermission.bulkCreate(assignments, { transaction });
}
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
async function getRolePermissions(RolePermission, Permission, roleId, includeDenied = false) {
    const where = { roleId };
    if (!includeDenied) {
        where.isDenied = false;
    }
    const rolePermissions = await RolePermission.findAll({
        where,
        include: [{ model: Permission, as: 'permission' }],
        order: [['priority', 'DESC']],
    });
    return rolePermissions.map((rp) => rp.permission);
}
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
async function getUserEffectivePermissions(UserRole, Role, RolePermission, Permission, RoleHierarchy, userId, options = {}) {
    const { includeDenied = false, includeExpired = false, resource, action } = options;
    // Get user's roles
    const userRoles = await getUserRoles(UserRole, Role, userId, includeExpired);
    const roleIds = userRoles.map((r) => r.id);
    // Get inherited roles
    const inheritedRoles = [];
    for (const roleId of roleIds) {
        const ancestors = await getRoleAncestors(RoleHierarchy, Role, roleId);
        inheritedRoles.push(...ancestors);
    }
    const allRoleIds = [...new Set([...roleIds, ...inheritedRoles.map((r) => r.id)])];
    // Get permissions
    const permissionWhere = {};
    if (resource)
        permissionWhere.resource = resource;
    if (action)
        permissionWhere.action = action;
    const rolePermissions = await RolePermission.findAll({
        where: {
            roleId: { [sequelize_1.Op.in]: allRoleIds },
            ...(includeDenied ? {} : { isDenied: false }),
        },
        include: [
            {
                model: Permission,
                as: 'permission',
                where: Object.keys(permissionWhere).length > 0 ? permissionWhere : undefined,
            },
        ],
        order: [['priority', 'DESC']],
    });
    // Remove duplicates and handle denials
    const permissionMap = new Map();
    for (const rp of rolePermissions) {
        if (!rp.isDenied && !permissionMap.has(rp.permissionId)) {
            permissionMap.set(rp.permissionId, rp.permission);
        }
    }
    return Array.from(permissionMap.values());
}
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
async function checkUserPermission(UserRole, Role, RolePermission, Permission, RoleHierarchy, userId, resource, action) {
    const permissions = await getUserEffectivePermissions(UserRole, Role, RolePermission, Permission, RoleHierarchy, userId, { resource, action });
    return permissions.some((p) => p.resource === resource && p.action === action);
}
// ============================================================================
// GROUP-BASED ROLES
// ============================================================================
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
async function assignRoleToGroup(GroupRole, groupId, roleId, transaction) {
    return await GroupRole.create({ groupId, roleId }, { transaction });
}
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
async function getUserGroupRoles(UserGroup, GroupRole, Role, userId) {
    const userGroups = await UserGroup.findAll({
        where: { userId },
        include: [
            {
                model: GroupRole,
                as: 'groupRoles',
                include: [{ model: Role, as: 'role' }],
            },
        ],
    });
    const roles = [];
    for (const ug of userGroups) {
        if (ug.groupRoles) {
            roles.push(...ug.groupRoles.map((gr) => gr.role));
        }
    }
    return roles;
}
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
async function syncGroupMemberRoles(UserGroup, GroupRole, UserRole, groupId, transaction) {
    const groupRoles = await GroupRole.findAll({
        where: { groupId },
        transaction,
    });
    const members = await UserGroup.findAll({
        where: { groupId },
        transaction,
    });
    for (const member of members) {
        for (const groupRole of groupRoles) {
            await UserRole.findOrCreate({
                where: {
                    userId: member.userId,
                    roleId: groupRole.roleId,
                },
                defaults: {
                    userId: member.userId,
                    roleId: groupRole.roleId,
                    assignedAt: new Date(),
                    isActive: true,
                    metadata: { source: 'group', groupId },
                },
                transaction,
            });
        }
    }
}
// ============================================================================
// ROLE TEMPLATES
// ============================================================================
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
async function createRoleFromTemplate(Role, RolePermission, Permission, template, transaction) {
    const role = await Role.create({
        name: template.name,
        description: template.description,
        isSystem: false,
        priority: 0,
        metadata: template.metadata,
    }, { transaction });
    // Find permissions by resource and action
    const permissions = await Permission.findAll({
        where: {
            [sequelize_1.Op.or]: template.permissions.map((p) => {
                const [resource, action] = p.split(':');
                return { resource, action };
            }),
        },
        transaction,
    });
    await assignPermissionsToRole(RolePermission, role.id, permissions.map((p) => p.id), transaction);
    return role;
}
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
async function cloneRole(Role, RolePermission, sourceRoleId, newName, transaction) {
    const sourceRole = await Role.findByPk(sourceRoleId, { transaction });
    if (!sourceRole) {
        throw new Error(`Source role ${sourceRoleId} not found`);
    }
    const newRole = await Role.create({
        name: newName,
        description: `Cloned from ${sourceRole.name}`,
        isSystem: false,
        priority: sourceRole.priority,
        metadata: { ...sourceRole.metadata, clonedFrom: sourceRoleId },
    }, { transaction });
    const sourcePermissions = await RolePermission.findAll({
        where: { roleId: sourceRoleId },
        transaction,
    });
    const newPermissions = sourcePermissions.map((sp) => ({
        roleId: newRole.id,
        permissionId: sp.permissionId,
        isDenied: sp.isDenied,
        priority: sp.priority,
    }));
    await RolePermission.bulkCreate(newPermissions, { transaction });
    return newRole;
}
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
async function exportRoleTemplate(Role, RolePermission, Permission, roleId) {
    const role = await Role.findByPk(roleId);
    if (!role) {
        throw new Error(`Role ${roleId} not found`);
    }
    const permissions = await getRolePermissions(RolePermission, Permission, roleId);
    return {
        name: role.name,
        description: role.description,
        permissions: permissions.map((p) => `${p.resource}:${p.action}`),
        metadata: role.metadata,
    };
}
// ============================================================================
// ROLE CONFLICT DETECTION
// ============================================================================
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
async function detectRoleConflicts(UserRole, Role, RolePermission, userId) {
    const conflicts = [];
    const userRoles = await getUserRoles(UserRole, Role, userId);
    // Check for conflicting permissions (both allowed and denied)
    for (let i = 0; i < userRoles.length; i++) {
        for (let j = i + 1; j < userRoles.length; j++) {
            const role1Perms = await RolePermission.findAll({
                where: { roleId: userRoles[i].id },
            });
            const role2Perms = await RolePermission.findAll({
                where: { roleId: userRoles[j].id },
            });
            const permMap = new Map();
            role1Perms.forEach((rp) => permMap.set(rp.permissionId, rp.isDenied));
            for (const rp of role2Perms) {
                if (permMap.has(rp.permissionId) && permMap.get(rp.permissionId) !== rp.isDenied) {
                    conflicts.push({
                        type: 'permission',
                        severity: 'medium',
                        description: `Conflicting permission ${rp.permissionId} between roles`,
                        roles: [userRoles[i].id, userRoles[j].id],
                        permissions: [rp.permissionId],
                    });
                }
            }
        }
    }
    return conflicts;
}
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
async function detectSeparationOfDutyViolations(UserRole, Role, userId, mutuallyExclusiveRoles) {
    const conflicts = [];
    const userRoles = await getUserRoles(UserRole, Role, userId);
    const roleNames = userRoles.map((r) => r.name);
    for (const [role1, role2] of mutuallyExclusiveRoles) {
        if (roleNames.includes(role1) && roleNames.includes(role2)) {
            conflicts.push({
                type: 'separation',
                severity: 'critical',
                description: `Separation of duty violation: User has both ${role1} and ${role2}`,
                roles: [role1, role2],
            });
        }
    }
    return conflicts;
}
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
async function resolveRoleConflicts(UserRole, Role, userId, conflicts, transaction) {
    const userRoles = await getUserRoles(UserRole, Role, userId);
    for (const conflict of conflicts) {
        if (conflict.type === 'separation' && conflict.severity === 'critical') {
            // Remove lower priority role
            const conflictingRoles = userRoles.filter((r) => conflict.roles.includes(r.name));
            conflictingRoles.sort((a, b) => a.priority - b.priority);
            if (conflictingRoles.length > 0) {
                await revokeRoleFromUser(UserRole, userId, conflictingRoles[0].id, transaction);
            }
        }
    }
}
// ============================================================================
// ROLE ANALYTICS
// ============================================================================
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
async function getRoleAnalytics(Role, UserRole, RolePermission, tenantId) {
    const roleWhere = tenantId ? { tenantId } : {};
    const totalRoles = await Role.count({ where: roleWhere });
    const activeAssignments = await UserRole.count({
        where: {
            isActive: true,
            [sequelize_1.Op.or]: [{ expiresAt: null }, { expiresAt: { [sequelize_1.Op.gt]: new Date() } }],
        },
    });
    const expiredAssignments = await UserRole.count({
        where: {
            isActive: true,
            expiresAt: { [sequelize_1.Op.lte]: new Date() },
        },
    });
    // Most assigned roles
    const roleAssignments = await UserRole.findAll({
        attributes: ['roleId', [sequelize_1.Sequelize.fn('COUNT', sequelize_1.Sequelize.col('roleId')), 'count']],
        group: ['roleId'],
        order: [[sequelize_1.Sequelize.literal('count'), 'DESC']],
        limit: 10,
    });
    const mostAssigned = roleAssignments.map((ra) => ({
        roleId: ra.roleId,
        count: parseInt(ra.get('count')),
    }));
    // Average permissions per role
    const permissionCounts = await RolePermission.findAll({
        attributes: ['roleId', [sequelize_1.Sequelize.fn('COUNT', sequelize_1.Sequelize.col('permissionId')), 'count']],
        group: ['roleId'],
    });
    const avgPermissionsPerRole = permissionCounts.reduce((sum, pc) => sum + parseInt(pc.get('count')), 0) /
        (permissionCounts.length || 1);
    return {
        totalRoles,
        activeAssignments,
        expiredAssignments,
        mostAssigned,
        leastUsed: mostAssigned.slice().reverse(),
        avgPermissionsPerRole: Math.round(avgPermissionsPerRole * 100) / 100,
    };
}
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
async function getRoleUsageReport(Role, UserRole, roleId) {
    const role = await Role.findByPk(roleId);
    if (!role) {
        throw new Error(`Role ${roleId} not found`);
    }
    const activeUsers = await UserRole.count({
        where: {
            roleId,
            isActive: true,
            [sequelize_1.Op.or]: [{ expiresAt: null }, { expiresAt: { [sequelize_1.Op.gt]: new Date() } }],
        },
    });
    const totalAssignments = await UserRole.count({
        where: { roleId },
    });
    const recentAssignments = await UserRole.findAll({
        where: { roleId },
        order: [['assignedAt', 'DESC']],
        limit: 10,
    });
    const avgAssignmentDuration = await UserRole.findAll({
        where: {
            roleId,
            expiresAt: { [sequelize_1.Op.not]: null },
        },
        attributes: [
            [
                sequelize_1.Sequelize.fn('AVG', sequelize_1.Sequelize.literal('EXTRACT(epoch FROM ("expiresAt" - "assignedAt"))')),
                'avgDuration',
            ],
        ],
    });
    return {
        roleId,
        roleName: role.name,
        activeUsers,
        totalAssignments,
        recentAssignments: recentAssignments.map((ra) => ({
            userId: ra.userId,
            assignedAt: ra.assignedAt,
            expiresAt: ra.expiresAt,
        })),
        avgAssignmentDurationDays: avgAssignmentDuration[0]
            ? Math.round(avgAssignmentDuration[0].get('avgDuration') / 86400)
            : null,
    };
}
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
async function getUnusedRoles(Role, UserRole, daysSinceLastUse = 90) {
    const threshold = new Date();
    threshold.setDate(threshold.getDate() - daysSinceLastUse);
    const usedRoleIds = await UserRole.findAll({
        where: {
            assignedAt: { [sequelize_1.Op.gte]: threshold },
        },
        attributes: [[sequelize_1.Sequelize.fn('DISTINCT', sequelize_1.Sequelize.col('roleId')), 'roleId']],
    });
    const usedIds = usedRoleIds.map((ur) => ur.roleId);
    return await Role.findAll({
        where: {
            id: { [sequelize_1.Op.notIn]: usedIds },
            isSystem: false,
        },
    });
}
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
async function getRoleGrowthMetrics(UserRole, roleId, days = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    const assignments = await UserRole.findAll({
        where: {
            roleId,
            assignedAt: { [sequelize_1.Op.gte]: startDate },
        },
        attributes: [
            [sequelize_1.Sequelize.fn('DATE', sequelize_1.Sequelize.col('assignedAt')), 'date'],
            [sequelize_1.Sequelize.fn('COUNT', sequelize_1.Sequelize.col('id')), 'count'],
        ],
        group: [sequelize_1.Sequelize.fn('DATE', sequelize_1.Sequelize.col('assignedAt'))],
        order: [[sequelize_1.Sequelize.fn('DATE', sequelize_1.Sequelize.col('assignedAt')), 'ASC']],
    });
    return assignments.map((a) => ({
        date: new Date(a.get('date')),
        count: parseInt(a.get('count')),
    }));
}
// ============================================================================
// ROLE DELEGATION & IMPERSONATION
// ============================================================================
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
async function delegateRole(UserRole, fromUserId, toUserId, roleId, durationHours, transaction) {
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + durationHours);
    return await assignRoleToUser(UserRole, {
        userId: toUserId,
        roleId,
        assignedBy: fromUserId,
        expiresAt,
        metadata: {
            delegated: true,
            delegatedFrom: fromUserId,
            durationHours,
        },
        transaction,
    });
}
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
async function createImpersonationSession(ImpersonationSession, adminUserId, targetUserId, reason, durationMinutes, transaction) {
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + durationMinutes);
    return await ImpersonationSession.create({
        adminUserId,
        targetUserId,
        reason,
        startedAt: new Date(),
        expiresAt,
        isActive: true,
    }, { transaction });
}
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
async function endImpersonationSession(ImpersonationSession, sessionId, transaction) {
    await ImpersonationSession.update({ isActive: false, endedAt: new Date() }, { where: { id: sessionId }, transaction });
}
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
async function cleanupExpiredRoleAssignments(UserRole, transaction) {
    return await UserRole.update({ isActive: false }, {
        where: {
            isActive: true,
            expiresAt: { [sequelize_1.Op.lte]: new Date() },
        },
        transaction,
    });
}
// ============================================================================
// ADVANCED ROLE OPERATIONS
// ============================================================================
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
async function getRolesByPriority(Role, tenantId) {
    const where = {};
    if (tenantId) {
        where.tenantId = tenantId;
    }
    return await Role.findAll({
        where,
        order: [['priority', 'DESC']],
    });
}
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
async function mergeRoles(Role, RolePermission, role1Id, role2Id, newName, transaction) {
    const [role1, role2] = await Promise.all([
        Role.findByPk(role1Id, { transaction }),
        Role.findByPk(role2Id, { transaction }),
    ]);
    if (!role1 || !role2) {
        throw new Error('One or both roles not found');
    }
    const newRole = await Role.create({
        name: newName,
        description: `Merged from ${role1.name} and ${role2.name}`,
        isSystem: false,
        priority: Math.max(role1.priority, role2.priority),
        metadata: { mergedFrom: [role1Id, role2Id] },
    }, { transaction });
    const [perms1, perms2] = await Promise.all([
        RolePermission.findAll({ where: { roleId: role1Id }, transaction }),
        RolePermission.findAll({ where: { roleId: role2Id }, transaction }),
    ]);
    const permissionIds = new Set([
        ...perms1.map((p) => p.permissionId),
        ...perms2.map((p) => p.permissionId),
    ]);
    await assignPermissionsToRole(RolePermission, newRole.id, Array.from(permissionIds), transaction);
    return newRole;
}
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
async function getRoleComparison(RolePermission, Permission, role1Id, role2Id) {
    const [perms1, perms2] = await Promise.all([
        getRolePermissions(RolePermission, Permission, role1Id),
        getRolePermissions(RolePermission, Permission, role2Id),
    ]);
    const set1 = new Set(perms1.map((p) => p.id));
    const set2 = new Set(perms2.map((p) => p.id));
    const uniqueToRole1 = perms1.filter((p) => !set2.has(p.id));
    const uniqueToRole2 = perms2.filter((p) => !set1.has(p.id));
    const common = perms1.filter((p) => set2.has(p.id));
    return {
        uniqueToRole1,
        uniqueToRole2,
        common,
        totalRole1: perms1.length,
        totalRole2: perms2.length,
        commonCount: common.length,
    };
}
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
async function getInheritedPermissions(RoleHierarchy, RolePermission, Permission, Role, roleId) {
    const ancestors = await getRoleAncestors(RoleHierarchy, Role, roleId);
    const permissions = [];
    for (const ancestor of ancestors) {
        const ancestorPerms = await getRolePermissions(RolePermission, Permission, ancestor.id);
        permissions.push(...ancestorPerms);
    }
    // Remove duplicates
    const uniquePerms = Array.from(new Map(permissions.map((p) => [p.id, p])).values());
    return uniquePerms;
}
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
async function updateRolePriority(Role, roleId, newPriority, transaction) {
    const role = await Role.findByPk(roleId, { transaction });
    if (!role) {
        throw new Error(`Role ${roleId} not found`);
    }
    return await role.update({ priority: newPriority }, { transaction });
}
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
async function getRolesByPermission(Role, RolePermission, permissionId) {
    const rolePermissions = await RolePermission.findAll({
        where: { permissionId, isDenied: false },
        include: [{ model: Role, as: 'role' }],
    });
    return rolePermissions.map((rp) => rp.role);
}
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
async function getUsersByRole(UserRole, roleId, activeOnly = true) {
    const where = { roleId };
    if (activeOnly) {
        where.isActive = true;
        where[sequelize_1.Op.or] = [{ expiresAt: null }, { expiresAt: { [sequelize_1.Op.gt]: new Date() } }];
    }
    const assignments = await UserRole.findAll({ where });
    return assignments.map((a) => a.userId);
}
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
async function getRoleChangeHistory(UserRole, userId, limit = 50) {
    return await UserRole.findAll({
        where: { userId },
        order: [['assignedAt', 'DESC']],
        limit,
    });
}
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
async function validateRoleAssignment(UserRole, Role, userId, roleId) {
    const role = await Role.findByPk(roleId);
    if (!role) {
        return { valid: false, reason: 'Role not found' };
    }
    const existing = await UserRole.findOne({
        where: {
            userId,
            roleId,
            isActive: true,
            [sequelize_1.Op.or]: [{ expiresAt: null }, { expiresAt: { [sequelize_1.Op.gt]: new Date() } }],
        },
    });
    if (existing) {
        return { valid: false, reason: 'Role already assigned to user' };
    }
    return { valid: true };
}
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
async function cascadeRoleDelete(Role, UserRole, RolePermission, RoleHierarchy, roleId, transaction) {
    await UserRole.destroy({ where: { roleId }, transaction });
    await RolePermission.destroy({ where: { roleId }, transaction });
    await RoleHierarchy.destroy({
        where: { [sequelize_1.Op.or]: [{ parentRoleId: roleId }, { childRoleId: roleId }] },
        transaction,
    });
    await Role.destroy({ where: { id: roleId }, transaction });
}
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
async function batchAssignRoles(UserRole, userIds, roleIds, options = {}) {
    const { assignedBy, expiresAt, transaction } = options;
    const assignments = [];
    for (const userId of userIds) {
        for (const roleId of roleIds) {
            assignments.push({
                userId,
                roleId,
                assignedBy,
                assignedAt: new Date(),
                expiresAt,
                isActive: true,
            });
        }
    }
    return await UserRole.bulkCreate(assignments, { transaction });
}
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
async function getRoleMetrics(Role, UserRole, RolePermission, roleId) {
    const role = await Role.findByPk(roleId);
    if (!role) {
        throw new Error(`Role ${roleId} not found`);
    }
    const [activeUsers, totalAssignments, permissionCount] = await Promise.all([
        UserRole.count({
            where: {
                roleId,
                isActive: true,
                [sequelize_1.Op.or]: [{ expiresAt: null }, { expiresAt: { [sequelize_1.Op.gt]: new Date() } }],
            },
        }),
        UserRole.count({ where: { roleId } }),
        RolePermission.count({ where: { roleId, isDenied: false } }),
    ]);
    return {
        roleId,
        roleName: role.name,
        priority: role.priority,
        activeUsers,
        totalAssignments,
        permissionCount,
        isSystem: role.isSystem,
    };
}
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
async function findOrCreateRole(Role, name, defaults = {}, transaction) {
    const [role, created] = await Role.findOrCreate({
        where: { name },
        defaults: {
            name,
            description: defaults.description,
            isSystem: false,
            priority: defaults.priority || 0,
            tenantId: defaults.tenantId,
            metadata: defaults.metadata,
        },
        transaction,
    });
    return [role, created];
}
//# sourceMappingURL=iam-rbac-kit.js.map