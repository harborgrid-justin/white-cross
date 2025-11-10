"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbacPolicy = exports.PermissionAuditLog = exports.AccessGrant = exports.AclEntry = exports.User = exports.SecurityGroup = exports.Permission = exports.Role = exports.AbacPolicySchema = exports.AccessGrantSchema = exports.AclEntrySchema = exports.SecurityGroupSchema = exports.PermissionSchema = exports.RoleSchema = exports.AccessGrantStatus = exports.PermissionScope = exports.PolicyEffect = exports.ResourceType = exports.PermissionAction = void 0;
exports.initializeSecurityModels = initializeSecurityModels;
exports.defineSecurityAssociations = defineSecurityAssociations;
exports.createRole = createRole;
exports.getRoleHierarchy = getRoleHierarchy;
exports.assignRoleToUser = assignRoleToUser;
exports.removeRoleFromUser = removeRoleFromUser;
exports.getUserRoles = getUserRoles;
exports.assignPermissionToRole = assignPermissionToRole;
exports.createPermission = createPermission;
exports.getUserPermissions = getUserPermissions;
exports.grantPermissionToUser = grantPermissionToUser;
exports.revokePermissionFromUser = revokePermissionFromUser;
exports.buildPermissionMatrix = buildPermissionMatrix;
exports.createSecurityGroup = createSecurityGroup;
exports.addUserToSecurityGroup = addUserToSecurityGroup;
exports.removeUserFromSecurityGroup = removeUserFromSecurityGroup;
exports.getUserSecurityGroups = getUserSecurityGroups;
exports.assignRoleToSecurityGroup = assignRoleToSecurityGroup;
exports.createAclEntry = createAclEntry;
exports.checkAclPermission = checkAclPermission;
exports.getResourceAcls = getResourceAcls;
exports.removeAclEntry = removeAclEntry;
exports.bulkCreateAclEntries = bulkCreateAclEntries;
exports.createAbacPolicy = createAbacPolicy;
exports.evaluateAbacPolicies = evaluateAbacPolicies;
exports.evaluatePolicyConditions = evaluatePolicyConditions;
exports.matchConditionValue = matchConditionValue;
exports.updateAbacPolicy = updateAbacPolicy;
exports.deleteAbacPolicy = deleteAbacPolicy;
exports.checkUserPermission = checkUserPermission;
exports.batchCheckPermissions = batchCheckPermissions;
exports.canPerformAnyAction = canPerformAnyAction;
exports.canPerformAllActions = canPerformAllActions;
exports.createAccessGrant = createAccessGrant;
exports.approveAccessGrant = approveAccessGrant;
exports.rejectAccessGrant = rejectAccessGrant;
exports.revokeAccessGrant = revokeAccessGrant;
exports.processExpiredAccessGrants = processExpiredAccessGrants;
exports.logPermissionCheck = logPermissionCheck;
exports.getUserAuditLogs = getUserAuditLogs;
exports.getResourceAuditLogs = getResourceAuditLogs;
exports.getSecurityComplianceReport = getSecurityComplianceReport;
exports.cacheUserPermissions = cacheUserPermissions;
exports.getCachedUserPermissions = getCachedUserPermissions;
exports.invalidateUserPermissionCache = invalidateUserPermissionCache;
exports.checkPermissionWithCache = checkPermissionWithCache;
exports.generatePermissionName = generatePermissionName;
exports.parsePermissionName = parsePermissionName;
exports.cloneRole = cloneRole;
exports.exportPermissions = exportPermissions;
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
const sequelize_1 = require("sequelize");
const common_1 = require("@nestjs/common");
const zod_1 = require("zod");
// ============================================================================
// TYPE DEFINITIONS
// ============================================================================
/**
 * Permission action types
 */
var PermissionAction;
(function (PermissionAction) {
    PermissionAction["CREATE"] = "create";
    PermissionAction["READ"] = "read";
    PermissionAction["UPDATE"] = "update";
    PermissionAction["DELETE"] = "delete";
    PermissionAction["EXECUTE"] = "execute";
    PermissionAction["MANAGE"] = "manage";
    PermissionAction["APPROVE"] = "approve";
    PermissionAction["REJECT"] = "reject";
    PermissionAction["SHARE"] = "share";
    PermissionAction["EXPORT"] = "export";
    PermissionAction["IMPORT"] = "import";
    PermissionAction["ARCHIVE"] = "archive";
})(PermissionAction || (exports.PermissionAction = PermissionAction = {}));
/**
 * Resource types for permission management
 */
var ResourceType;
(function (ResourceType) {
    ResourceType["USER"] = "user";
    ResourceType["ROLE"] = "role";
    ResourceType["PERMISSION"] = "permission";
    ResourceType["SECURITY_GROUP"] = "security_group";
    ResourceType["PATIENT"] = "patient";
    ResourceType["MEDICAL_RECORD"] = "medical_record";
    ResourceType["APPOINTMENT"] = "appointment";
    ResourceType["PRESCRIPTION"] = "prescription";
    ResourceType["LAB_RESULT"] = "lab_result";
    ResourceType["BILLING"] = "billing";
    ResourceType["REPORT"] = "report";
    ResourceType["DOCUMENT"] = "document";
    ResourceType["ASSET"] = "asset";
    ResourceType["CUSTOM"] = "custom";
})(ResourceType || (exports.ResourceType = ResourceType = {}));
/**
 * Access control policy effect
 */
var PolicyEffect;
(function (PolicyEffect) {
    PolicyEffect["ALLOW"] = "allow";
    PolicyEffect["DENY"] = "deny";
})(PolicyEffect || (exports.PolicyEffect = PolicyEffect = {}));
/**
 * Permission scope levels
 */
var PermissionScope;
(function (PermissionScope) {
    PermissionScope["GLOBAL"] = "global";
    PermissionScope["ORGANIZATION"] = "organization";
    PermissionScope["DEPARTMENT"] = "department";
    PermissionScope["TEAM"] = "team";
    PermissionScope["PERSONAL"] = "personal";
})(PermissionScope || (exports.PermissionScope = PermissionScope = {}));
/**
 * Access grant status
 */
var AccessGrantStatus;
(function (AccessGrantStatus) {
    AccessGrantStatus["PENDING"] = "pending";
    AccessGrantStatus["APPROVED"] = "approved";
    AccessGrantStatus["REJECTED"] = "rejected";
    AccessGrantStatus["ACTIVE"] = "active";
    AccessGrantStatus["EXPIRED"] = "expired";
    AccessGrantStatus["REVOKED"] = "revoked";
})(AccessGrantStatus || (exports.AccessGrantStatus = AccessGrantStatus = {}));
// ============================================================================
// VALIDATION SCHEMAS
// ============================================================================
/**
 * Role creation schema
 */
exports.RoleSchema = zod_1.z.object({
    name: zod_1.z.string().min(1).max(100),
    description: zod_1.z.string().optional(),
    parentRoleId: zod_1.z.string().uuid().optional(),
    scope: zod_1.z.nativeEnum(PermissionScope),
    metadata: zod_1.z.record(zod_1.z.any()).optional(),
});
/**
 * Permission creation schema
 */
exports.PermissionSchema = zod_1.z.object({
    name: zod_1.z.string().min(1).max(100),
    description: zod_1.z.string().optional(),
    resource: zod_1.z.nativeEnum(ResourceType),
    action: zod_1.z.nativeEnum(PermissionAction),
    conditions: zod_1.z.record(zod_1.z.any()).optional(),
    effect: zod_1.z.nativeEnum(PolicyEffect),
    priority: zod_1.z.number().int().min(0).max(1000).default(500),
    metadata: zod_1.z.record(zod_1.z.any()).optional(),
});
/**
 * Security group creation schema
 */
exports.SecurityGroupSchema = zod_1.z.object({
    name: zod_1.z.string().min(1).max(100),
    description: zod_1.z.string().optional(),
    parentGroupId: zod_1.z.string().uuid().optional(),
    scope: zod_1.z.nativeEnum(PermissionScope),
    metadata: zod_1.z.record(zod_1.z.any()).optional(),
});
/**
 * ACL entry schema
 */
exports.AclEntrySchema = zod_1.z.object({
    resourceType: zod_1.z.nativeEnum(ResourceType),
    resourceId: zod_1.z.string(),
    principalType: zod_1.z.enum(['user', 'role', 'group']),
    principalId: zod_1.z.string().uuid(),
    action: zod_1.z.nativeEnum(PermissionAction),
    effect: zod_1.z.nativeEnum(PolicyEffect),
    conditions: zod_1.z.record(zod_1.z.any()).optional(),
    expiresAt: zod_1.z.date().optional(),
});
/**
 * Access grant request schema
 */
exports.AccessGrantSchema = zod_1.z.object({
    userId: zod_1.z.string().uuid(),
    roleId: zod_1.z.string().uuid().optional(),
    permissionId: zod_1.z.string().uuid().optional(),
    reason: zod_1.z.string().optional(),
    startsAt: zod_1.z.date(),
    expiresAt: zod_1.z.date(),
    metadata: zod_1.z.record(zod_1.z.any()).optional(),
});
/**
 * ABAC policy schema
 */
exports.AbacPolicySchema = zod_1.z.object({
    name: zod_1.z.string().min(1).max(100),
    description: zod_1.z.string().optional(),
    resource: zod_1.z.nativeEnum(ResourceType),
    action: zod_1.z.nativeEnum(PermissionAction),
    effect: zod_1.z.nativeEnum(PolicyEffect),
    conditions: zod_1.z.object({
        user: zod_1.z.record(zod_1.z.any()).optional(),
        resource: zod_1.z.record(zod_1.z.any()).optional(),
        environment: zod_1.z.record(zod_1.z.any()).optional(),
    }),
    priority: zod_1.z.number().int().min(0).max(1000).default(500),
});
// ============================================================================
// SEQUELIZE MODEL DEFINITIONS
// ============================================================================
/**
 * Role model with hierarchical structure
 */
class Role extends sequelize_1.Model {
}
exports.Role = Role;
/**
 * Permission model
 */
class Permission extends sequelize_1.Model {
}
exports.Permission = Permission;
/**
 * Security group model with hierarchical structure
 */
class SecurityGroup extends sequelize_1.Model {
}
exports.SecurityGroup = SecurityGroup;
/**
 * User model (simplified for access control)
 */
class User extends sequelize_1.Model {
}
exports.User = User;
/**
 * ACL entry model
 */
class AclEntry extends sequelize_1.Model {
}
exports.AclEntry = AclEntry;
/**
 * Access grant model
 */
class AccessGrant extends sequelize_1.Model {
}
exports.AccessGrant = AccessGrant;
/**
 * Permission audit log model
 */
class PermissionAuditLog extends sequelize_1.Model {
}
exports.PermissionAuditLog = PermissionAuditLog;
/**
 * ABAC policy model
 */
class AbacPolicy extends sequelize_1.Model {
}
exports.AbacPolicy = AbacPolicy;
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
function initializeSecurityModels(sequelize) {
    // Initialize Role model
    Role.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        name: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            unique: true,
        },
        description: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
        },
        parentRoleId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'roles',
                key: 'id',
            },
        },
        level: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        isSystem: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        scope: {
            type: sequelize_1.DataTypes.ENUM(...Object.values(PermissionScope)),
            allowNull: false,
            defaultValue: PermissionScope.ORGANIZATION,
        },
        metadata: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
        },
        createdAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
        },
        updatedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
        },
    }, {
        sequelize,
        modelName: 'Role',
        tableName: 'roles',
        indexes: [
            { fields: ['name'], unique: true },
            { fields: ['parentRoleId'] },
            { fields: ['level'] },
            { fields: ['scope'] },
        ],
    });
    // Initialize Permission model
    Permission.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        name: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            unique: true,
        },
        description: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
        },
        resource: {
            type: sequelize_1.DataTypes.ENUM(...Object.values(ResourceType)),
            allowNull: false,
        },
        action: {
            type: sequelize_1.DataTypes.ENUM(...Object.values(PermissionAction)),
            allowNull: false,
        },
        conditions: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
        },
        effect: {
            type: sequelize_1.DataTypes.ENUM(...Object.values(PolicyEffect)),
            allowNull: false,
            defaultValue: PolicyEffect.ALLOW,
        },
        priority: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 500,
        },
        isSystem: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        metadata: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
        },
        createdAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
        },
        updatedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
        },
    }, {
        sequelize,
        modelName: 'Permission',
        tableName: 'permissions',
        indexes: [
            { fields: ['name'], unique: true },
            { fields: ['resource', 'action'] },
            { fields: ['priority'] },
        ],
    });
    // Initialize SecurityGroup model
    SecurityGroup.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        name: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            unique: true,
        },
        description: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
        },
        parentGroupId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'security_groups',
                key: 'id',
            },
        },
        level: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        scope: {
            type: sequelize_1.DataTypes.ENUM(...Object.values(PermissionScope)),
            allowNull: false,
            defaultValue: PermissionScope.ORGANIZATION,
        },
        metadata: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
        },
        createdAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
        },
        updatedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
        },
    }, {
        sequelize,
        modelName: 'SecurityGroup',
        tableName: 'security_groups',
        indexes: [
            { fields: ['name'], unique: true },
            { fields: ['parentGroupId'] },
            { fields: ['level'] },
            { fields: ['scope'] },
        ],
    });
    // Initialize User model
    User.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        email: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
            unique: true,
        },
        attributes: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
        },
        metadata: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
        },
    }, {
        sequelize,
        modelName: 'User',
        tableName: 'users',
        indexes: [{ fields: ['email'], unique: true }],
    });
    // Initialize AclEntry model
    AclEntry.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        resourceType: {
            type: sequelize_1.DataTypes.ENUM(...Object.values(ResourceType)),
            allowNull: false,
        },
        resourceId: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
        },
        principalType: {
            type: sequelize_1.DataTypes.ENUM('user', 'role', 'group'),
            allowNull: false,
        },
        principalId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
        },
        action: {
            type: sequelize_1.DataTypes.ENUM(...Object.values(PermissionAction)),
            allowNull: false,
        },
        effect: {
            type: sequelize_1.DataTypes.ENUM(...Object.values(PolicyEffect)),
            allowNull: false,
            defaultValue: PolicyEffect.ALLOW,
        },
        conditions: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
        },
        expiresAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
        },
        createdAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
        },
        updatedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
        },
    }, {
        sequelize,
        modelName: 'AclEntry',
        tableName: 'acl_entries',
        indexes: [
            { fields: ['resourceType', 'resourceId'] },
            { fields: ['principalType', 'principalId'] },
            { fields: ['expiresAt'] },
        ],
    });
    // Initialize AccessGrant model
    AccessGrant.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        userId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
        },
        roleId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
        },
        permissionId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
        },
        grantedBy: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
        },
        approvedBy: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
        },
        status: {
            type: sequelize_1.DataTypes.ENUM(...Object.values(AccessGrantStatus)),
            allowNull: false,
            defaultValue: AccessGrantStatus.PENDING,
        },
        reason: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
        },
        startsAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
        },
        expiresAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
        },
        metadata: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
        },
        createdAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
        },
        updatedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
        },
    }, {
        sequelize,
        modelName: 'AccessGrant',
        tableName: 'access_grants',
        indexes: [
            { fields: ['userId'] },
            { fields: ['status'] },
            { fields: ['expiresAt'] },
            { fields: ['startsAt'] },
        ],
    });
    // Initialize PermissionAuditLog model
    PermissionAuditLog.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        userId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
        },
        action: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
        },
        resource: {
            type: sequelize_1.DataTypes.ENUM(...Object.values(ResourceType)),
            allowNull: false,
        },
        resourceId: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
        },
        permissionId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
        },
        roleId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
        },
        result: {
            type: sequelize_1.DataTypes.ENUM('allowed', 'denied'),
            allowNull: false,
        },
        reason: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
        },
        context: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
        },
        ipAddress: {
            type: sequelize_1.DataTypes.STRING(45),
            allowNull: true,
        },
        userAgent: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
        },
        timestamp: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
        },
    }, {
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
    });
    // Initialize AbacPolicy model
    AbacPolicy.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        name: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            unique: true,
        },
        description: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
        },
        resource: {
            type: sequelize_1.DataTypes.ENUM(...Object.values(ResourceType)),
            allowNull: false,
        },
        action: {
            type: sequelize_1.DataTypes.ENUM(...Object.values(PermissionAction)),
            allowNull: false,
        },
        effect: {
            type: sequelize_1.DataTypes.ENUM(...Object.values(PolicyEffect)),
            allowNull: false,
            defaultValue: PolicyEffect.ALLOW,
        },
        conditions: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: false,
        },
        priority: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 500,
        },
        isActive: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
        createdAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
        },
        updatedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
        },
    }, {
        sequelize,
        modelName: 'AbacPolicy',
        tableName: 'abac_policies',
        indexes: [
            { fields: ['name'], unique: true },
            { fields: ['resource', 'action'] },
            { fields: ['priority'] },
            { fields: ['isActive'] },
        ],
    });
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
function defineSecurityAssociations() {
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
async function createRole(roleData, transaction) {
    const validated = exports.RoleSchema.parse(roleData);
    // Calculate role level based on parent
    let level = 0;
    if (validated.parentRoleId) {
        const parentRole = await Role.findByPk(validated.parentRoleId, { transaction });
        if (!parentRole) {
            throw new common_1.NotFoundException('Parent role not found');
        }
        level = parentRole.level + 1;
    }
    const role = await Role.create({
        ...validated,
        level,
        isSystem: false,
    }, { transaction });
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
async function getRoleHierarchy(roleId, maxDepth = 10) {
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
        throw new common_1.NotFoundException('Role not found');
    }
    const node = {
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
async function assignRoleToUser(userId, roleId, transaction) {
    const user = await User.findByPk(userId, { transaction });
    if (!user) {
        throw new common_1.NotFoundException('User not found');
    }
    const role = await Role.findByPk(roleId, { transaction });
    if (!role) {
        throw new common_1.NotFoundException('Role not found');
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
async function removeRoleFromUser(userId, roleId, transaction) {
    const user = await User.findByPk(userId, { transaction });
    if (!user) {
        throw new common_1.NotFoundException('User not found');
    }
    const role = await Role.findByPk(roleId, { transaction });
    if (!role) {
        throw new common_1.NotFoundException('Role not found');
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
async function getUserRoles(userId, includeInherited = true) {
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
        throw new common_1.NotFoundException('User not found');
    }
    const directRoles = await user.getRoles();
    if (!includeInherited) {
        return directRoles;
    }
    const allRoles = new Map();
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
            const collectParentRoles = (node) => {
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
async function assignPermissionToRole(roleId, permissionId, transaction) {
    const role = await Role.findByPk(roleId, { transaction });
    if (!role) {
        throw new common_1.NotFoundException('Role not found');
    }
    const permission = await Permission.findByPk(permissionId, { transaction });
    if (!permission) {
        throw new common_1.NotFoundException('Permission not found');
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
async function createPermission(permissionData, transaction) {
    const validated = exports.PermissionSchema.parse(permissionData);
    const permission = await Permission.create({
        ...validated,
        isSystem: false,
    }, { transaction });
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
async function getUserPermissions(userId, includeInherited = true) {
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
        throw new common_1.NotFoundException('User not found');
    }
    const allPermissions = new Map();
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
async function grantPermissionToUser(userId, permissionId, transaction) {
    const user = await User.findByPk(userId, { transaction });
    if (!user) {
        throw new common_1.NotFoundException('User not found');
    }
    const permission = await Permission.findByPk(permissionId, { transaction });
    if (!permission) {
        throw new common_1.NotFoundException('Permission not found');
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
async function revokePermissionFromUser(userId, permissionId, transaction) {
    const user = await User.findByPk(userId, { transaction });
    if (!user) {
        throw new common_1.NotFoundException('User not found');
    }
    const permission = await Permission.findByPk(permissionId, { transaction });
    if (!permission) {
        throw new common_1.NotFoundException('Permission not found');
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
async function buildPermissionMatrix(resourceType) {
    const whereClause = resourceType
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
    const matrix = [];
    for (const role of roles) {
        const permissions = await role.getPermissions({ where: whereClause });
        const entry = {
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
async function createSecurityGroup(groupData, transaction) {
    const validated = exports.SecurityGroupSchema.parse(groupData);
    // Calculate group level based on parent
    let level = 0;
    if (validated.parentGroupId) {
        const parentGroup = await SecurityGroup.findByPk(validated.parentGroupId, {
            transaction,
        });
        if (!parentGroup) {
            throw new common_1.NotFoundException('Parent group not found');
        }
        level = parentGroup.level + 1;
    }
    const group = await SecurityGroup.create({
        ...validated,
        level,
    }, { transaction });
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
async function addUserToSecurityGroup(userId, groupId, transaction) {
    const user = await User.findByPk(userId, { transaction });
    if (!user) {
        throw new common_1.NotFoundException('User not found');
    }
    const group = await SecurityGroup.findByPk(groupId, { transaction });
    if (!group) {
        throw new common_1.NotFoundException('Security group not found');
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
async function removeUserFromSecurityGroup(userId, groupId, transaction) {
    const user = await User.findByPk(userId, { transaction });
    if (!user) {
        throw new common_1.NotFoundException('User not found');
    }
    const group = await SecurityGroup.findByPk(groupId, { transaction });
    if (!group) {
        throw new common_1.NotFoundException('Security group not found');
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
async function getUserSecurityGroups(userId, includeParents = true) {
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
        throw new common_1.NotFoundException('User not found');
    }
    const allGroups = new Map();
    const directGroups = await user.getSecurityGroups();
    for (const group of directGroups) {
        allGroups.set(group.id, group);
        if (includeParents && group.parentGroupId) {
            // Recursively get parent groups
            const addParentGroups = async (groupId) => {
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
async function assignRoleToSecurityGroup(groupId, roleId, transaction) {
    const group = await SecurityGroup.findByPk(groupId, { transaction });
    if (!group) {
        throw new common_1.NotFoundException('Security group not found');
    }
    const role = await Role.findByPk(roleId, { transaction });
    if (!role) {
        throw new common_1.NotFoundException('Role not found');
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
async function createAclEntry(aclData, transaction) {
    const validated = exports.AclEntrySchema.parse(aclData);
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
async function checkAclPermission(resourceType, resourceId, userId, action) {
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
            principalId: { [sequelize_1.Op.in]: principalIds },
            action,
            [sequelize_1.Op.or]: [{ expiresAt: null }, { expiresAt: { [sequelize_1.Op.gt]: now } }],
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
async function getResourceAcls(resourceType, resourceId) {
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
async function removeAclEntry(aclId, transaction) {
    const acl = await AclEntry.findByPk(aclId, { transaction });
    if (!acl) {
        throw new common_1.NotFoundException('ACL entry not found');
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
async function bulkCreateAclEntries(resourceType, resourceId, entries, transaction) {
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
async function createAbacPolicy(policyData, transaction) {
    const validated = exports.AbacPolicySchema.parse(policyData);
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
async function evaluateAbacPolicies(context) {
    const policies = await AbacPolicy.findAll({
        where: {
            resource: context.resource?.type || ResourceType.CUSTOM,
            action: context.requestedAction,
            isActive: true,
        },
        order: [['priority', 'DESC']],
    });
    const matchedPolicies = [];
    let explicitDeny = false;
    let explicitAllow = false;
    let denyReason;
    for (const policy of policies) {
        const matches = evaluatePolicyConditions(policy.conditions, context);
        if (matches) {
            matchedPolicies.push(policy.id);
            if (policy.effect === PolicyEffect.DENY) {
                explicitDeny = true;
                denyReason = `Denied by policy: ${policy.name}`;
                break; // DENY takes precedence
            }
            else if (policy.effect === PolicyEffect.ALLOW) {
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
function evaluatePolicyConditions(conditions, context) {
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
            const envValue = context.environment[key];
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
function matchConditionValue(actualValue, conditionValue) {
    if (typeof conditionValue === 'object' && conditionValue !== null) {
        // Support operators
        for (const [operator, expectedValue] of Object.entries(conditionValue)) {
            switch (operator) {
                case '$eq':
                    if (actualValue !== expectedValue)
                        return false;
                    break;
                case '$ne':
                    if (actualValue === expectedValue)
                        return false;
                    break;
                case '$gt':
                    if (!(actualValue > expectedValue))
                        return false;
                    break;
                case '$gte':
                    if (!(actualValue >= expectedValue))
                        return false;
                    break;
                case '$lt':
                    if (!(actualValue < expectedValue))
                        return false;
                    break;
                case '$lte':
                    if (!(actualValue <= expectedValue))
                        return false;
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
                    if (typeof actualValue !== 'string' ||
                        !actualValue.includes(expectedValue))
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
async function updateAbacPolicy(policyId, updates, transaction) {
    const policy = await AbacPolicy.findByPk(policyId, { transaction });
    if (!policy) {
        throw new common_1.NotFoundException('ABAC policy not found');
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
async function deleteAbacPolicy(policyId, transaction) {
    const policy = await AbacPolicy.findByPk(policyId, { transaction });
    if (!policy) {
        throw new common_1.NotFoundException('ABAC policy not found');
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
async function checkUserPermission(userId, resource, action, context) {
    const user = await User.findByPk(userId);
    if (!user) {
        return {
            allowed: false,
            reason: 'User not found',
        };
    }
    // Build full context
    const fullContext = {
        user,
        resource: context?.resource || { type: resource, id: '' },
        environment: context?.environment || {},
        requestedAction: action,
    };
    // 1. Check ACL first (most specific)
    if (context?.resource?.id) {
        const aclResult = await checkAclPermission(resource, context.resource.id, userId, action);
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
    const matchingPermissions = permissions.filter((p) => p.resource === resource && p.action === action);
    // Check for explicit DENY
    const denyPermission = matchingPermissions.find((p) => p.effect === PolicyEffect.DENY);
    if (denyPermission) {
        return {
            allowed: false,
            reason: `Denied by permission: ${denyPermission.name}`,
            deniedBy: denyPermission.id,
        };
    }
    // Check for ALLOW
    const allowPermission = matchingPermissions.find((p) => p.effect === PolicyEffect.ALLOW);
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
async function batchCheckPermissions(userId, resource, actions, context) {
    const results = new Map();
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
async function canPerformAnyAction(userId, resource, actions, context) {
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
async function canPerformAllActions(userId, resource, actions, context) {
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
async function createAccessGrant(grantData, grantedBy, transaction) {
    const validated = exports.AccessGrantSchema.parse(grantData);
    const grant = await AccessGrant.create({
        ...validated,
        grantedBy,
        status: AccessGrantStatus.PENDING,
    }, { transaction });
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
async function approveAccessGrant(grantId, approvedBy, transaction) {
    const grant = await AccessGrant.findByPk(grantId, { transaction });
    if (!grant) {
        throw new common_1.NotFoundException('Access grant not found');
    }
    if (grant.status !== AccessGrantStatus.PENDING) {
        throw new common_1.BadRequestException('Access grant is not in pending status');
    }
    await grant.update({
        status: AccessGrantStatus.APPROVED,
        approvedBy,
    }, { transaction });
    // Activate if start time has passed
    const now = new Date();
    if (grant.startsAt <= now && grant.expiresAt > now) {
        await grant.update({ status: AccessGrantStatus.ACTIVE }, { transaction });
        // Grant the access
        if (grant.roleId) {
            await assignRoleToUser(grant.userId, grant.roleId, transaction);
        }
        else if (grant.permissionId) {
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
async function rejectAccessGrant(grantId, transaction) {
    const grant = await AccessGrant.findByPk(grantId, { transaction });
    if (!grant) {
        throw new common_1.NotFoundException('Access grant not found');
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
async function revokeAccessGrant(grantId, transaction) {
    const grant = await AccessGrant.findByPk(grantId, { transaction });
    if (!grant) {
        throw new common_1.NotFoundException('Access grant not found');
    }
    await grant.update({ status: AccessGrantStatus.REVOKED }, { transaction });
    // Remove the granted access
    if (grant.roleId) {
        await removeRoleFromUser(grant.userId, grant.roleId, transaction);
    }
    else if (grant.permissionId) {
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
async function processExpiredAccessGrants(transaction) {
    const now = new Date();
    const expiredGrants = await AccessGrant.findAll({
        where: {
            status: AccessGrantStatus.ACTIVE,
            expiresAt: { [sequelize_1.Op.lte]: now },
        },
        transaction,
    });
    for (const grant of expiredGrants) {
        await grant.update({ status: AccessGrantStatus.EXPIRED }, { transaction });
        // Remove the granted access
        if (grant.roleId) {
            await removeRoleFromUser(grant.userId, grant.roleId, transaction);
        }
        else if (grant.permissionId) {
            await revokePermissionFromUser(grant.userId, grant.permissionId, transaction);
        }
    }
    // Activate pending grants whose start time has come
    const pendingGrants = await AccessGrant.findAll({
        where: {
            status: AccessGrantStatus.APPROVED,
            startsAt: { [sequelize_1.Op.lte]: now },
            expiresAt: { [sequelize_1.Op.gt]: now },
        },
        transaction,
    });
    for (const grant of pendingGrants) {
        await grant.update({ status: AccessGrantStatus.ACTIVE }, { transaction });
        // Grant the access
        if (grant.roleId) {
            await assignRoleToUser(grant.userId, grant.roleId, transaction);
        }
        else if (grant.permissionId) {
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
async function logPermissionCheck(logData, transaction) {
    const log = await PermissionAuditLog.create({
        ...logData,
        timestamp: new Date(),
    }, { transaction });
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
async function getUserAuditLogs(userId, options) {
    const where = { userId };
    if (options?.startDate || options?.endDate) {
        where.timestamp = {};
        if (options.startDate) {
            where.timestamp[sequelize_1.Op.gte] = options.startDate;
        }
        if (options.endDate) {
            where.timestamp[sequelize_1.Op.lte] = options.endDate;
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
async function getResourceAuditLogs(resourceType, resourceId, options) {
    const where = {
        resource: resourceType,
        resourceId,
    };
    if (options?.startDate || options?.endDate) {
        where.timestamp = {};
        if (options.startDate) {
            where.timestamp[sequelize_1.Op.gte] = options.startDate;
        }
        if (options.endDate) {
            where.timestamp[sequelize_1.Op.lte] = options.endDate;
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
async function getSecurityComplianceReport(startDate, endDate) {
    const logs = await PermissionAuditLog.findAll({
        where: {
            timestamp: {
                [sequelize_1.Op.gte]: startDate,
                [sequelize_1.Op.lte]: endDate,
            },
        },
    });
    const totalChecks = logs.length;
    const allowedChecks = logs.filter((l) => l.result === 'allowed').length;
    const deniedChecks = logs.filter((l) => l.result === 'denied').length;
    const uniqueUsers = new Set(logs.map((l) => l.userId)).size;
    // Top denied resources
    const resourceDenials = new Map();
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
    const userDenials = new Map();
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
async function cacheUserPermissions(redis, userId, ttl = 300) {
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
async function getCachedUserPermissions(redis, userId) {
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
async function invalidateUserPermissionCache(redis, userId) {
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
async function checkPermissionWithCache(redis, userId, resource, action) {
    // Try cache first
    const cached = await getCachedUserPermissions(redis, userId);
    if (cached) {
        const matchingPermission = cached.permissions.find((p) => p.resource === resource && p.action === action);
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
function generatePermissionName(resource, action) {
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
function parsePermissionName(permissionName) {
    const [resourceStr, actionStr] = permissionName.split('.');
    return {
        resource: resourceStr,
        action: actionStr,
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
async function cloneRole(roleId, newRoleName, transaction) {
    const sourceRole = await Role.findByPk(roleId, {
        include: [{ model: Permission, as: 'permissions' }],
        transaction,
    });
    if (!sourceRole) {
        throw new common_1.NotFoundException('Source role not found');
    }
    // Create new role
    const newRole = await Role.create({
        name: newRoleName,
        description: `Cloned from ${sourceRole.name}`,
        scope: sourceRole.scope,
        level: sourceRole.level,
        isSystem: false,
        metadata: sourceRole.metadata,
    }, { transaction });
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
async function exportPermissions() {
    const roles = await Role.findAll();
    const permissions = await Permission.findAll();
    const rolePermissions = [];
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
exports.default = {
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
//# sourceMappingURL=security-access-control-kit.js.map