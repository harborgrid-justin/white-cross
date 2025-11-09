"use strict";
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
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicRoute = exports.RequireOwnership = exports.RequirePermissions = exports.Roles = exports.createPermissionsGuard = exports.createRolesGuard = exports.revokeAclPermission = exports.checkAclPermission = exports.createAclEntry = exports.createPolicy = exports.evaluatePolicies = exports.evaluatePolicy = exports.evaluateSingleCondition = exports.evaluateContextualConditions = exports.evaluateLocationBasedCondition = exports.evaluateIpBasedCondition = exports.evaluateTimeBasedCondition = exports.invalidatePermissionCache = exports.generateCacheKey = exports.isPermissionCacheValid = exports.createPermissionCacheEntry = exports.subtractPermissions = exports.mergePermissions = exports.inheritPermissionsFromRole = exports.expandPermissionWithImplied = exports.getImpliedPermissions = exports.buildPermissionTree = exports.shareResourceWithUser = exports.createResourceOwnership = exports.checkSameDepartment = exports.checkSameOrganization = exports.checkResourceAccess = exports.checkResourceOwnership = exports.expandWildcardPermissions = exports.buildPermission = exports.parsePermission = exports.checkUserHasAllPermissions = exports.checkUserHasAnyPermission = exports.checkUserHasPermission = exports.getEffectiveRoles = exports.checkRoleInherits = exports.getRoleHierarchy = exports.checkUserHasAllRoles = exports.checkUserHasAnyRole = exports.checkUserHasRole = exports.UserRole = void 0;
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
const common_1 = require("@nestjs/common");
// ============================================================================
// TYPE DEFINITIONS
// ============================================================================
/**
 * User role enumeration
 */
var UserRole;
(function (UserRole) {
    UserRole["SUPER_ADMIN"] = "super_admin";
    UserRole["ADMIN"] = "admin";
    UserRole["DOCTOR"] = "doctor";
    UserRole["NURSE"] = "nurse";
    UserRole["PATIENT"] = "patient";
    UserRole["STAFF"] = "staff";
    UserRole["GUEST"] = "guest";
})(UserRole || (exports.UserRole = UserRole = {}));
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
const checkUserHasRole = (context, roles) => {
    const requiredRoles = Array.isArray(roles) ? roles : [roles];
    return requiredRoles.includes(context.user.role);
};
exports.checkUserHasRole = checkUserHasRole;
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
const checkUserHasAnyRole = (context, roles) => {
    return roles.includes(context.user.role);
};
exports.checkUserHasAnyRole = checkUserHasAnyRole;
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
const checkUserHasAllRoles = (userRoles, requiredRoles) => {
    return requiredRoles.every((role) => userRoles.includes(role));
};
exports.checkUserHasAllRoles = checkUserHasAllRoles;
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
const getRoleHierarchy = () => {
    const hierarchy = new Map();
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
exports.getRoleHierarchy = getRoleHierarchy;
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
const checkRoleInherits = (userRole, requiredRole) => {
    const hierarchy = (0, exports.getRoleHierarchy)();
    const inheritedRoles = hierarchy.get(userRole) || [];
    return userRole === requiredRole || inheritedRoles.includes(requiredRole);
};
exports.checkRoleInherits = checkRoleInherits;
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
const getEffectiveRoles = (role) => {
    const hierarchy = (0, exports.getRoleHierarchy)();
    const inheritedRoles = hierarchy.get(role) || [];
    return [role, ...inheritedRoles];
};
exports.getEffectiveRoles = getEffectiveRoles;
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
const checkUserHasPermission = (context, permission) => {
    return context.user.permissions?.includes(permission) || false;
};
exports.checkUserHasPermission = checkUserHasPermission;
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
const checkUserHasAnyPermission = (context, permissions) => {
    return permissions.some((perm) => context.user.permissions?.includes(perm));
};
exports.checkUserHasAnyPermission = checkUserHasAnyPermission;
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
const checkUserHasAllPermissions = (context, permissions) => {
    return permissions.every((perm) => context.user.permissions?.includes(perm));
};
exports.checkUserHasAllPermissions = checkUserHasAllPermissions;
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
const parsePermission = (permission) => {
    const [resource, action] = permission.split(':');
    return { resource, action };
};
exports.parsePermission = parsePermission;
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
const buildPermission = (resource, action) => {
    return `${resource}:${action}`;
};
exports.buildPermission = buildPermission;
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
const expandWildcardPermissions = (permissions, availableResources, availableActions) => {
    const expanded = [];
    for (const permission of permissions) {
        const [resource, action] = permission.split(':');
        if (resource === '*' && action === '*') {
            // Grant all permissions
            for (const res of availableResources) {
                for (const act of availableActions) {
                    expanded.push(`${res}:${act}`);
                }
            }
        }
        else if (resource === '*') {
            // Grant action on all resources
            for (const res of availableResources) {
                expanded.push(`${res}:${action}`);
            }
        }
        else if (action === '*') {
            // Grant all actions on resource
            for (const act of availableActions) {
                expanded.push(`${resource}:${act}`);
            }
        }
        else {
            expanded.push(permission);
        }
    }
    return [...new Set(expanded)];
};
exports.expandWildcardPermissions = expandWildcardPermissions;
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
const checkResourceOwnership = (context) => {
    if (!context.resource) {
        return false;
    }
    return context.resource.ownerId === context.user.id;
};
exports.checkResourceOwnership = checkResourceOwnership;
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
const checkResourceAccess = (context, ownership) => {
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
exports.checkResourceAccess = checkResourceAccess;
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
const checkSameOrganization = (context) => {
    if (!context.resource?.organizationId || !context.user.organization) {
        return false;
    }
    return context.resource.organizationId === context.user.organization;
};
exports.checkSameOrganization = checkSameOrganization;
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
const checkSameDepartment = (context, resourceDepartment) => {
    return context.user.department === resourceDepartment;
};
exports.checkSameDepartment = checkSameDepartment;
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
const createResourceOwnership = (resourceId, resourceType, ownerId) => {
    return {
        resourceId,
        resourceType,
        ownerId,
        sharedWith: [],
    };
};
exports.createResourceOwnership = createResourceOwnership;
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
const shareResourceWithUser = (ownership, userId) => {
    const sharedWith = ownership.sharedWith || [];
    if (!sharedWith.includes(userId)) {
        sharedWith.push(userId);
    }
    return { ...ownership, sharedWith };
};
exports.shareResourceWithUser = shareResourceWithUser;
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
const buildPermissionTree = () => {
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
exports.buildPermissionTree = buildPermissionTree;
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
const getImpliedPermissions = (permission, tree) => {
    const findNode = (node) => {
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
exports.getImpliedPermissions = getImpliedPermissions;
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
const expandPermissionWithImplied = (permissions, tree) => {
    const expanded = new Set(permissions);
    for (const permission of permissions) {
        const implied = (0, exports.getImpliedPermissions)(permission, tree);
        implied.forEach((p) => expanded.add(p));
    }
    return Array.from(expanded);
};
exports.expandPermissionWithImplied = expandPermissionWithImplied;
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
const inheritPermissionsFromRole = (role, roles) => {
    const roleDefinition = roles.get(role);
    if (!roleDefinition) {
        return [];
    }
    const permissions = roleDefinition.permissions.map((p) => `${p.resource}:${p.action}`);
    // Inherit from parent roles
    if (roleDefinition.inherits) {
        for (const parentRole of roleDefinition.inherits) {
            const parentPermissions = (0, exports.inheritPermissionsFromRole)(parentRole, roles);
            permissions.push(...parentPermissions);
        }
    }
    return [...new Set(permissions)];
};
exports.inheritPermissionsFromRole = inheritPermissionsFromRole;
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
const mergePermissions = (...permissionSets) => {
    const merged = new Set();
    for (const set of permissionSets) {
        set.forEach((p) => merged.add(p));
    }
    return Array.from(merged);
};
exports.mergePermissions = mergePermissions;
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
const subtractPermissions = (basePermissions, deniedPermissions) => {
    return basePermissions.filter((p) => !deniedPermissions.includes(p));
};
exports.subtractPermissions = subtractPermissions;
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
const createPermissionCacheEntry = (userId, permissions, roles, ttlSeconds = 3600) => {
    const now = new Date();
    return {
        userId,
        permissions,
        roles,
        cachedAt: now,
        expiresAt: new Date(now.getTime() + ttlSeconds * 1000),
    };
};
exports.createPermissionCacheEntry = createPermissionCacheEntry;
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
const isPermissionCacheValid = (entry) => {
    return new Date() < entry.expiresAt;
};
exports.isPermissionCacheValid = isPermissionCacheValid;
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
const generateCacheKey = (userId, context = 'permissions') => {
    return `authz:${context}:${userId}`;
};
exports.generateCacheKey = generateCacheKey;
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
const invalidatePermissionCache = (userId) => {
    return {
        userId,
        invalidatedAt: new Date(),
        reason: 'permission_change',
    };
};
exports.invalidatePermissionCache = invalidatePermissionCache;
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
const evaluateTimeBasedCondition = (currentTime, condition) => {
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
exports.evaluateTimeBasedCondition = evaluateTimeBasedCondition;
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
const evaluateIpBasedCondition = (ipAddress, allowedIps) => {
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
exports.evaluateIpBasedCondition = evaluateIpBasedCondition;
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
const evaluateLocationBasedCondition = (location, allowedLocations) => {
    return allowedLocations.includes(location);
};
exports.evaluateLocationBasedCondition = evaluateLocationBasedCondition;
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
const evaluateContextualConditions = (context, conditions) => {
    for (const condition of conditions) {
        if (!(0, exports.evaluateSingleCondition)(context, condition)) {
            return false;
        }
    }
    return true;
};
exports.evaluateContextualConditions = evaluateContextualConditions;
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
const evaluateSingleCondition = (context, condition) => {
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
exports.evaluateSingleCondition = evaluateSingleCondition;
/**
 * @function getFieldValue
 * @description Gets field value from context using dot notation
 * @param {AuthorizationContext} context - Authorization context
 * @param {string} field - Field path (e.g., 'user.department')
 * @returns {any} Field value
 */
const getFieldValue = (context, field) => {
    const parts = field.split('.');
    let value = context;
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
const evaluatePolicy = (context, policy) => {
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
        const conditionsMet = (0, exports.evaluateContextualConditions)(context, policy.conditions);
        if (!conditionsMet) {
            return { allowed: false, reason: 'Policy conditions not met' };
        }
    }
    return {
        allowed: policy.effect === 'allow',
        reason: policy.effect === 'allow' ? 'Policy allows access' : 'Policy denies access',
    };
};
exports.evaluatePolicy = evaluatePolicy;
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
const evaluatePolicies = (context, policies) => {
    // Sort by priority (higher priority first)
    const sortedPolicies = [...policies].sort((a, b) => b.priority - a.priority);
    let explicitDeny = false;
    let explicitAllow = false;
    for (const policy of sortedPolicies) {
        const result = (0, exports.evaluatePolicy)(context, policy);
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
exports.evaluatePolicies = evaluatePolicies;
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
const createPolicy = (name, effect, resources, actions, conditions, priority = 0) => {
    return {
        name,
        effect,
        resources,
        actions,
        conditions,
        priority,
    };
};
exports.createPolicy = createPolicy;
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
const createAclEntry = (principalId, principalType, resourceId, permissions, grantedBy) => {
    return {
        principalId,
        principalType,
        resourceId,
        permissions,
        grantedBy,
        grantedAt: new Date(),
    };
};
exports.createAclEntry = createAclEntry;
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
const checkAclPermission = (acls, principalId, permission) => {
    return acls.some((acl) => acl.principalId === principalId &&
        acl.permissions.includes(permission) &&
        (!acl.expiresAt || acl.expiresAt > new Date()));
};
exports.checkAclPermission = checkAclPermission;
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
const revokeAclPermission = (acl, permission) => {
    return {
        ...acl,
        permissions: acl.permissions.filter((p) => p !== permission),
    };
};
exports.revokeAclPermission = revokeAclPermission;
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
const createRolesGuard = () => {
    let RolesGuard = (() => {
        let _classDecorators = [(0, common_1.Injectable)()];
        let _classDescriptor;
        let _classExtraInitializers = [];
        let _classThis;
        var RolesGuard = _classThis = class {
            constructor(reflector) {
                this.reflector = reflector;
            }
            canActivate(context) {
                const requiredRoles = this.reflector.getAllAndOverride('roles', [
                    context.getHandler(),
                    context.getClass(),
                ]);
                if (!requiredRoles) {
                    return true;
                }
                const request = context.switchToHttp().getRequest();
                const user = request.user;
                if (!user) {
                    throw new common_1.ForbiddenException('User not authenticated');
                }
                return (0, exports.checkUserHasAnyRole)({ user, action: '' }, requiredRoles);
            }
        };
        __setFunctionName(_classThis, "RolesGuard");
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            RolesGuard = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        })();
        return RolesGuard = _classThis;
    })();
    return RolesGuard;
};
exports.createRolesGuard = createRolesGuard;
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
const createPermissionsGuard = () => {
    let PermissionsGuard = (() => {
        let _classDecorators = [(0, common_1.Injectable)()];
        let _classDescriptor;
        let _classExtraInitializers = [];
        let _classThis;
        var PermissionsGuard = _classThis = class {
            constructor(reflector) {
                this.reflector = reflector;
            }
            canActivate(context) {
                const requiredPermissions = this.reflector.getAllAndOverride('permissions', [
                    context.getHandler(),
                    context.getClass(),
                ]);
                if (!requiredPermissions) {
                    return true;
                }
                const request = context.switchToHttp().getRequest();
                const user = request.user;
                if (!user) {
                    throw new common_1.ForbiddenException('User not authenticated');
                }
                return (0, exports.checkUserHasAllPermissions)({ user, action: '' }, requiredPermissions);
            }
        };
        __setFunctionName(_classThis, "PermissionsGuard");
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            PermissionsGuard = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        })();
        return PermissionsGuard = _classThis;
    })();
    return PermissionsGuard;
};
exports.createPermissionsGuard = createPermissionsGuard;
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
const Roles = (...roles) => (0, common_1.SetMetadata)('roles', roles);
exports.Roles = Roles;
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
const RequirePermissions = (...permissions) => (0, common_1.SetMetadata)('permissions', permissions);
exports.RequirePermissions = RequirePermissions;
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
const RequireOwnership = () => (0, common_1.SetMetadata)('requireOwnership', true);
exports.RequireOwnership = RequireOwnership;
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
const PublicRoute = () => (0, common_1.SetMetadata)('isPublic', true);
exports.PublicRoute = PublicRoute;
// ============================================================================
// EXPORTS
// ============================================================================
exports.default = {
    // RBAC
    checkUserHasRole: exports.checkUserHasRole,
    checkUserHasAnyRole: exports.checkUserHasAnyRole,
    checkUserHasAllRoles: exports.checkUserHasAllRoles,
    getRoleHierarchy: exports.getRoleHierarchy,
    checkRoleInherits: exports.checkRoleInherits,
    getEffectiveRoles: exports.getEffectiveRoles,
    // Permissions
    checkUserHasPermission: exports.checkUserHasPermission,
    checkUserHasAnyPermission: exports.checkUserHasAnyPermission,
    checkUserHasAllPermissions: exports.checkUserHasAllPermissions,
    parsePermission: exports.parsePermission,
    buildPermission: exports.buildPermission,
    expandWildcardPermissions: exports.expandWildcardPermissions,
    // Resource-based
    checkResourceOwnership: exports.checkResourceOwnership,
    checkResourceAccess: exports.checkResourceAccess,
    checkSameOrganization: exports.checkSameOrganization,
    checkSameDepartment: exports.checkSameDepartment,
    createResourceOwnership: exports.createResourceOwnership,
    shareResourceWithUser: exports.shareResourceWithUser,
    // Hierarchical
    buildPermissionTree: exports.buildPermissionTree,
    getImpliedPermissions: exports.getImpliedPermissions,
    expandPermissionWithImplied: exports.expandPermissionWithImplied,
    // Inheritance
    inheritPermissionsFromRole: exports.inheritPermissionsFromRole,
    mergePermissions: exports.mergePermissions,
    subtractPermissions: exports.subtractPermissions,
    // Caching
    createPermissionCacheEntry: exports.createPermissionCacheEntry,
    isPermissionCacheValid: exports.isPermissionCacheValid,
    generateCacheKey: exports.generateCacheKey,
    invalidatePermissionCache: exports.invalidatePermissionCache,
    // Context-aware
    evaluateTimeBasedCondition: exports.evaluateTimeBasedCondition,
    evaluateIpBasedCondition: exports.evaluateIpBasedCondition,
    evaluateLocationBasedCondition: exports.evaluateLocationBasedCondition,
    evaluateContextualConditions: exports.evaluateContextualConditions,
    evaluateSingleCondition: exports.evaluateSingleCondition,
    // Policy-based
    evaluatePolicy: exports.evaluatePolicy,
    evaluatePolicies: exports.evaluatePolicies,
    createPolicy: exports.createPolicy,
    // ACL
    createAclEntry: exports.createAclEntry,
    checkAclPermission: exports.checkAclPermission,
    revokeAclPermission: exports.revokeAclPermission,
    // Guards
    createRolesGuard: exports.createRolesGuard,
    createPermissionsGuard: exports.createPermissionsGuard,
    // Decorators
    Roles: exports.Roles,
    RequirePermissions: exports.RequirePermissions,
    RequireOwnership: exports.RequireOwnership,
    PublicRoute: exports.PublicRoute,
};
//# sourceMappingURL=iam-authorization-kit.js.map