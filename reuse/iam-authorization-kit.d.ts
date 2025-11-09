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
 * User role enumeration
 */
export declare enum UserRole {
    SUPER_ADMIN = "super_admin",
    ADMIN = "admin",
    DOCTOR = "doctor",
    NURSE = "nurse",
    PATIENT = "patient",
    STAFF = "staff",
    GUEST = "guest"
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
export declare const checkUserHasRole: (context: AuthorizationContext, roles: string | string[]) => boolean;
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
export declare const checkUserHasAnyRole: (context: AuthorizationContext, roles: string[]) => boolean;
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
export declare const checkUserHasAllRoles: (userRoles: string[], requiredRoles: string[]) => boolean;
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
export declare const getRoleHierarchy: () => Map<string, string[]>;
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
export declare const checkRoleInherits: (userRole: string, requiredRole: string) => boolean;
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
export declare const getEffectiveRoles: (role: string) => string[];
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
export declare const checkUserHasPermission: (context: AuthorizationContext, permission: string) => boolean;
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
export declare const checkUserHasAnyPermission: (context: AuthorizationContext, permissions: string[]) => boolean;
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
export declare const checkUserHasAllPermissions: (context: AuthorizationContext, permissions: string[]) => boolean;
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
export declare const parsePermission: (permission: string) => {
    resource: string;
    action: string;
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
export declare const buildPermission: (resource: string, action: string) => string;
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
export declare const expandWildcardPermissions: (permissions: string[], availableResources: string[], availableActions: string[]) => string[];
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
export declare const checkResourceOwnership: (context: AuthorizationContext) => boolean;
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
export declare const checkResourceAccess: (context: AuthorizationContext, ownership: ResourceOwnership) => boolean;
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
export declare const checkSameOrganization: (context: AuthorizationContext) => boolean;
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
export declare const checkSameDepartment: (context: AuthorizationContext, resourceDepartment: string) => boolean;
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
export declare const createResourceOwnership: (resourceId: string, resourceType: string, ownerId: string) => ResourceOwnership;
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
export declare const shareResourceWithUser: (ownership: ResourceOwnership, userId: string) => ResourceOwnership;
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
export declare const buildPermissionTree: () => PermissionNode;
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
export declare const getImpliedPermissions: (permission: string, tree: PermissionNode) => string[];
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
export declare const expandPermissionWithImplied: (permissions: string[], tree: PermissionNode) => string[];
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
export declare const inheritPermissionsFromRole: (role: string, roles: Map<string, RoleDefinition>) => string[];
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
export declare const mergePermissions: (...permissionSets: string[][]) => string[];
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
export declare const subtractPermissions: (basePermissions: string[], deniedPermissions: string[]) => string[];
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
export declare const createPermissionCacheEntry: (userId: string, permissions: string[], roles: string[], ttlSeconds?: number) => PermissionCacheEntry;
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
export declare const isPermissionCacheValid: (entry: PermissionCacheEntry) => boolean;
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
export declare const generateCacheKey: (userId: string, context?: string) => string;
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
export declare const invalidatePermissionCache: (userId: string) => {
    userId: string;
    invalidatedAt: Date;
    reason: string;
};
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
export declare const evaluateTimeBasedCondition: (currentTime: Date, condition: {
    startHour?: number;
    endHour?: number;
    allowedDays?: number[];
}) => boolean;
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
export declare const evaluateIpBasedCondition: (ipAddress: string, allowedIps: string[]) => boolean;
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
export declare const evaluateLocationBasedCondition: (location: string, allowedLocations: string[]) => boolean;
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
export declare const evaluateContextualConditions: (context: AuthorizationContext, conditions: PolicyCondition[]) => boolean;
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
export declare const evaluateSingleCondition: (context: AuthorizationContext, condition: PolicyCondition) => boolean;
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
export declare const evaluatePolicy: (context: AuthorizationContext, policy: AuthorizationPolicy) => PolicyResult;
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
export declare const evaluatePolicies: (context: AuthorizationContext, policies: AuthorizationPolicy[]) => PolicyResult;
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
export declare const createPolicy: (name: string, effect: "allow" | "deny", resources: string[], actions: string[], conditions?: PolicyCondition[], priority?: number) => AuthorizationPolicy;
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
export declare const createAclEntry: (principalId: string, principalType: "user" | "role" | "group", resourceId: string, permissions: string[], grantedBy: string) => AclEntry;
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
export declare const checkAclPermission: (acls: AclEntry[], principalId: string, permission: string) => boolean;
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
export declare const revokeAclPermission: (acl: AclEntry, permission: string) => AclEntry;
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
export declare const createRolesGuard: () => any;
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
export declare const createPermissionsGuard: () => any;
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
export declare const Roles: (...roles: string[]) => any;
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
export declare const RequirePermissions: (...permissions: string[]) => any;
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
export declare const RequireOwnership: () => any;
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
export declare const PublicRoute: () => any;
declare const _default: {
    checkUserHasRole: (context: AuthorizationContext, roles: string | string[]) => boolean;
    checkUserHasAnyRole: (context: AuthorizationContext, roles: string[]) => boolean;
    checkUserHasAllRoles: (userRoles: string[], requiredRoles: string[]) => boolean;
    getRoleHierarchy: () => Map<string, string[]>;
    checkRoleInherits: (userRole: string, requiredRole: string) => boolean;
    getEffectiveRoles: (role: string) => string[];
    checkUserHasPermission: (context: AuthorizationContext, permission: string) => boolean;
    checkUserHasAnyPermission: (context: AuthorizationContext, permissions: string[]) => boolean;
    checkUserHasAllPermissions: (context: AuthorizationContext, permissions: string[]) => boolean;
    parsePermission: (permission: string) => {
        resource: string;
        action: string;
    };
    buildPermission: (resource: string, action: string) => string;
    expandWildcardPermissions: (permissions: string[], availableResources: string[], availableActions: string[]) => string[];
    checkResourceOwnership: (context: AuthorizationContext) => boolean;
    checkResourceAccess: (context: AuthorizationContext, ownership: ResourceOwnership) => boolean;
    checkSameOrganization: (context: AuthorizationContext) => boolean;
    checkSameDepartment: (context: AuthorizationContext, resourceDepartment: string) => boolean;
    createResourceOwnership: (resourceId: string, resourceType: string, ownerId: string) => ResourceOwnership;
    shareResourceWithUser: (ownership: ResourceOwnership, userId: string) => ResourceOwnership;
    buildPermissionTree: () => PermissionNode;
    getImpliedPermissions: (permission: string, tree: PermissionNode) => string[];
    expandPermissionWithImplied: (permissions: string[], tree: PermissionNode) => string[];
    inheritPermissionsFromRole: (role: string, roles: Map<string, RoleDefinition>) => string[];
    mergePermissions: (...permissionSets: string[][]) => string[];
    subtractPermissions: (basePermissions: string[], deniedPermissions: string[]) => string[];
    createPermissionCacheEntry: (userId: string, permissions: string[], roles: string[], ttlSeconds?: number) => PermissionCacheEntry;
    isPermissionCacheValid: (entry: PermissionCacheEntry) => boolean;
    generateCacheKey: (userId: string, context?: string) => string;
    invalidatePermissionCache: (userId: string) => {
        userId: string;
        invalidatedAt: Date;
        reason: string;
    };
    evaluateTimeBasedCondition: (currentTime: Date, condition: {
        startHour?: number;
        endHour?: number;
        allowedDays?: number[];
    }) => boolean;
    evaluateIpBasedCondition: (ipAddress: string, allowedIps: string[]) => boolean;
    evaluateLocationBasedCondition: (location: string, allowedLocations: string[]) => boolean;
    evaluateContextualConditions: (context: AuthorizationContext, conditions: PolicyCondition[]) => boolean;
    evaluateSingleCondition: (context: AuthorizationContext, condition: PolicyCondition) => boolean;
    evaluatePolicy: (context: AuthorizationContext, policy: AuthorizationPolicy) => PolicyResult;
    evaluatePolicies: (context: AuthorizationContext, policies: AuthorizationPolicy[]) => PolicyResult;
    createPolicy: (name: string, effect: "allow" | "deny", resources: string[], actions: string[], conditions?: PolicyCondition[], priority?: number) => AuthorizationPolicy;
    createAclEntry: (principalId: string, principalType: "user" | "role" | "group", resourceId: string, permissions: string[], grantedBy: string) => AclEntry;
    checkAclPermission: (acls: AclEntry[], principalId: string, permission: string) => boolean;
    revokeAclPermission: (acl: AclEntry, permission: string) => AclEntry;
    createRolesGuard: () => any;
    createPermissionsGuard: () => any;
    Roles: (...roles: string[]) => any;
    RequirePermissions: (...permissions: string[]) => any;
    RequireOwnership: () => any;
    PublicRoute: () => any;
};
export default _default;
//# sourceMappingURL=iam-authorization-kit.d.ts.map