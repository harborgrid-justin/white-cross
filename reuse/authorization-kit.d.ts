/**
 * LOC: AUTHZKIT001
 * File: /reuse/authorization-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/core
 *   - crypto (Node.js)
 *
 * DOWNSTREAM (imported by):
 *   - Authorization guards
 *   - Permission services
 *   - RBAC/ABAC modules
 *   - Policy engines
 *   - Resource access controllers
 */
/**
 * Role definition
 */
export interface Role {
    id: string;
    name: string;
    displayName: string;
    description?: string;
    permissions: string[];
    inherits?: string[];
    priority?: number;
    isSystem?: boolean;
    metadata?: Record<string, any>;
}
/**
 * Permission definition
 */
export interface Permission {
    id: string;
    name: string;
    resource: string;
    action: string;
    description?: string;
    scope?: string[];
    conditions?: Record<string, any>;
    metadata?: Record<string, any>;
}
/**
 * Access Control List (ACL) for a user
 */
export interface AccessControlList {
    userId: string;
    roles: string[];
    permissions: string[];
    deniedPermissions?: string[];
    attributes?: Record<string, any>;
}
/**
 * Authorization context
 */
export interface AuthorizationContext {
    user: {
        id: string;
        roles: string[];
        permissions: string[];
        attributes?: Record<string, any>;
    };
    resource?: {
        id?: string;
        type: string;
        ownerId?: string;
        attributes?: Record<string, any>;
    };
    environment?: {
        ipAddress?: string;
        time?: Date;
        location?: string;
        deviceType?: string;
    };
    action: string;
}
/**
 * Policy definition
 */
export interface Policy {
    id: string;
    name: string;
    description?: string;
    effect: 'allow' | 'deny';
    subjects: string[];
    actions: string[];
    resources: string[];
    conditions?: PolicyCondition[];
    priority?: number;
}
/**
 * Policy condition
 */
export interface PolicyCondition {
    field: string;
    operator: 'equals' | 'notEquals' | 'contains' | 'notContains' | 'greaterThan' | 'lessThan' | 'in' | 'notIn';
    value: any;
}
/**
 * Authorization result
 */
export interface AuthorizationResult {
    authorized: boolean;
    reason?: string;
    matchedPolicies?: string[];
    missingPermissions?: string[];
}
/**
 * Resource ownership
 */
export interface ResourceOwnership {
    resourceId: string;
    resourceType: string;
    ownerId: string;
    sharedWith?: string[];
    accessLevel?: 'read' | 'write' | 'admin';
}
/**
 * Scope definition
 */
export interface Scope {
    name: string;
    description?: string;
    permissions: string[];
    resources?: string[];
}
/**
 * Role hierarchy
 */
export interface RoleHierarchy {
    role: string;
    parent?: string;
    children?: string[];
    level: number;
}
/**
 * Permission check request
 */
export interface PermissionCheckRequest {
    userId: string;
    permission: string;
    resourceId?: string;
    context?: Record<string, any>;
}
/**
 * Bulk authorization request
 */
export interface BulkAuthorizationRequest {
    userId: string;
    checks: Array<{
        permission: string;
        resourceId?: string;
    }>;
}
/**
 * Attribute-based rule
 */
export interface AttributeRule {
    attribute: string;
    operator: 'equals' | 'contains' | 'greaterThan' | 'lessThan' | 'matches';
    value: any;
    required?: boolean;
}
/**
 * 1. Creates a new role with permissions and inheritance.
 *
 * @param {string} name - Role name
 * @param {string[]} permissions - List of permissions
 * @param {object} options - Additional role options
 * @returns {Role} Created role
 *
 * @example
 * ```typescript
 * const doctorRole = createRole('doctor', [
 *   'read:patients',
 *   'write:prescriptions',
 *   'read:medical-records'
 * ], {
 *   displayName: 'Doctor',
 *   inherits: ['healthcare_worker'],
 *   priority: 100
 * });
 * ```
 */
export declare function createRole(name: string, permissions: string[], options?: {
    displayName?: string;
    description?: string;
    inherits?: string[];
    priority?: number;
    isSystem?: boolean;
    metadata?: Record<string, any>;
}): Role;
/**
 * 2. Checks if user has a specific role.
 *
 * @param {AccessControlList} acl - User's access control list
 * @param {string} roleName - Role to check
 * @returns {boolean} True if user has role
 *
 * @example
 * ```typescript
 * if (hasRole(userACL, 'doctor')) {
 *   // User is a doctor
 *   console.log('Access to medical functions granted');
 * }
 * ```
 */
export declare function hasRole(acl: AccessControlList, roleName: string): boolean;
/**
 * 3. Checks if user has any of the specified roles.
 *
 * @param {AccessControlList} acl - User's access control list
 * @param {string[]} roleNames - Roles to check
 * @returns {boolean} True if user has any role
 *
 * @example
 * ```typescript
 * if (hasAnyRole(userACL, ['doctor', 'nurse', 'admin'])) {
 *   // User has at least one of these roles
 *   allowAccess();
 * }
 * ```
 */
export declare function hasAnyRole(acl: AccessControlList, roleNames: string[]): boolean;
/**
 * 4. Checks if user has all specified roles.
 *
 * @param {AccessControlList} acl - User's access control list
 * @param {string[]} roleNames - Roles to check
 * @returns {boolean} True if user has all roles
 *
 * @example
 * ```typescript
 * if (hasAllRoles(userACL, ['doctor', 'researcher'])) {
 *   // User is both a doctor and researcher
 *   grantResearchAccess();
 * }
 * ```
 */
export declare function hasAllRoles(acl: AccessControlList, roleNames: string[]): boolean;
/**
 * 5. Resolves all permissions from roles including inheritance.
 *
 * @param {string[]} roles - User's roles
 * @param {Role[]} roleDefinitions - All role definitions
 * @returns {string[]} Resolved permissions
 *
 * @example
 * ```typescript
 * const permissions = resolveRolePermissions(['doctor'], allRoles);
 * // Returns permissions from 'doctor' role and all inherited roles
 * console.log('User permissions:', permissions);
 * ```
 */
export declare function resolveRolePermissions(roles: string[], roleDefinitions: Role[]): string[];
/**
 * 6. Builds role hierarchy tree.
 *
 * @param {Role[]} roles - All roles
 * @returns {RoleHierarchy[]} Role hierarchy
 *
 * @example
 * ```typescript
 * const hierarchy = buildRoleHierarchy(allRoles);
 * // Visualize role inheritance structure
 * hierarchy.forEach(node => {
 *   console.log(`${node.role} (level ${node.level})`);
 * });
 * ```
 */
export declare function buildRoleHierarchy(roles: Role[]): RoleHierarchy[];
/**
 * 7. Assigns role to user.
 *
 * @param {AccessControlList} acl - User's access control list
 * @param {string} roleName - Role to assign
 * @returns {AccessControlList} Updated ACL
 *
 * @example
 * ```typescript
 * const updatedACL = assignRole(userACL, 'doctor');
 * await saveUserACL(userId, updatedACL);
 * ```
 */
export declare function assignRole(acl: AccessControlList, roleName: string): AccessControlList;
/**
 * 8. Revokes role from user.
 *
 * @param {AccessControlList} acl - User's access control list
 * @param {string} roleName - Role to revoke
 * @returns {AccessControlList} Updated ACL
 *
 * @example
 * ```typescript
 * const updatedACL = revokeRole(userACL, 'temp_access');
 * await saveUserACL(userId, updatedACL);
 * ```
 */
export declare function revokeRole(acl: AccessControlList, roleName: string): AccessControlList;
/**
 * 9. Creates a permission definition.
 *
 * @param {string} resource - Resource type
 * @param {string} action - Action to perform
 * @param {object} options - Additional options
 * @returns {Permission} Created permission
 *
 * @example
 * ```typescript
 * const permission = createPermission('patients', 'read', {
 *   description: 'View patient records',
 *   scope: ['own', 'team'],
 *   conditions: { departmentMatch: true }
 * });
 * ```
 */
export declare function createPermission(resource: string, action: string, options?: {
    description?: string;
    scope?: string[];
    conditions?: Record<string, any>;
    metadata?: Record<string, any>;
}): Permission;
/**
 * 10. Checks if user has a specific permission.
 *
 * @param {AccessControlList} acl - User's access control list
 * @param {string} permission - Permission to check
 * @param {Role[]} roleDefinitions - All role definitions
 * @returns {boolean} True if user has permission
 *
 * @example
 * ```typescript
 * if (hasPermission(userACL, 'write:prescriptions', allRoles)) {
 *   // User can write prescriptions
 *   allowPrescriptionCreation();
 * }
 * ```
 */
export declare function hasPermission(acl: AccessControlList, permission: string, roleDefinitions: Role[]): boolean;
/**
 * 11. Checks if user has any of the specified permissions.
 *
 * @param {AccessControlList} acl - User's access control list
 * @param {string[]} permissions - Permissions to check
 * @param {Role[]} roleDefinitions - All role definitions
 * @returns {boolean} True if user has any permission
 *
 * @example
 * ```typescript
 * if (hasAnyPermission(userACL, ['read:patients', 'read:appointments'], roles)) {
 *   showPatientInfo();
 * }
 * ```
 */
export declare function hasAnyPermission(acl: AccessControlList, permissions: string[], roleDefinitions: Role[]): boolean;
/**
 * 12. Checks if user has all specified permissions.
 *
 * @param {AccessControlList} acl - User's access control list
 * @param {string[]} permissions - Permissions to check
 * @param {Role[]} roleDefinitions - All role definitions
 * @returns {boolean} True if user has all permissions
 *
 * @example
 * ```typescript
 * if (hasAllPermissions(userACL, ['read:patients', 'write:notes'], roles)) {
 *   enableFullAccess();
 * }
 * ```
 */
export declare function hasAllPermissions(acl: AccessControlList, permissions: string[], roleDefinitions: Role[]): boolean;
/**
 * 13. Parses permission string into components.
 *
 * @param {string} permission - Permission string (e.g., 'read:patients')
 * @returns {object | null} Parsed permission or null
 *
 * @example
 * ```typescript
 * const parsed = parsePermission('read:patients:own');
 * // { action: 'read', resource: 'patients', scope: 'own' }
 * ```
 */
export declare function parsePermission(permission: string): {
    action: string;
    resource: string;
    scope?: string;
} | null;
/**
 * 14. Builds permission string from components.
 *
 * @param {string} action - Action (e.g., 'read', 'write')
 * @param {string} resource - Resource (e.g., 'patients')
 * @param {string} scope - Optional scope (e.g., 'own', 'team')
 * @returns {string} Permission string
 *
 * @example
 * ```typescript
 * const permission = buildPermission('write', 'prescriptions', 'own');
 * // Result: 'write:prescriptions:own'
 * ```
 */
export declare function buildPermission(action: string, resource: string, scope?: string): string;
/**
 * 15. Grants permission to user.
 *
 * @param {AccessControlList} acl - User's access control list
 * @param {string} permission - Permission to grant
 * @returns {AccessControlList} Updated ACL
 *
 * @example
 * ```typescript
 * const updatedACL = grantPermission(userACL, 'write:reports');
 * await saveUserACL(userId, updatedACL);
 * ```
 */
export declare function grantPermission(acl: AccessControlList, permission: string): AccessControlList;
/**
 * 16. Revokes permission from user.
 *
 * @param {AccessControlList} acl - User's access control list
 * @param {string} permission - Permission to revoke
 * @returns {AccessControlList} Updated ACL
 *
 * @example
 * ```typescript
 * const updatedACL = revokePermission(userACL, 'delete:records');
 * await saveUserACL(userId, updatedACL);
 * ```
 */
export declare function revokePermission(acl: AccessControlList, permission: string): AccessControlList;
/**
 * 17. Evaluates attribute-based rule.
 *
 * @param {AttributeRule} rule - Attribute rule
 * @param {Record<string, any>} attributes - User/resource attributes
 * @returns {boolean} True if rule passes
 *
 * @example
 * ```typescript
 * const rule = { attribute: 'department', operator: 'equals', value: 'cardiology' };
 * if (evaluateAttributeRule(rule, user.attributes)) {
 *   grantAccess();
 * }
 * ```
 */
export declare function evaluateAttributeRule(rule: AttributeRule, attributes: Record<string, any>): boolean;
/**
 * 18. Evaluates multiple attribute rules.
 *
 * @param {AttributeRule[]} rules - Attribute rules
 * @param {Record<string, any>} attributes - Attributes to check
 * @param {string} logic - Logic operator ('AND' or 'OR')
 * @returns {boolean} True if rules pass
 *
 * @example
 * ```typescript
 * const rules = [
 *   { attribute: 'department', operator: 'equals', value: 'cardiology' },
 *   { attribute: 'clearanceLevel', operator: 'greaterThan', value: 3 }
 * ];
 * if (evaluateAttributeRules(rules, user.attributes, 'AND')) {
 *   grantAccess();
 * }
 * ```
 */
export declare function evaluateAttributeRules(rules: AttributeRule[], attributes: Record<string, any>, logic?: 'AND' | 'OR'): boolean;
/**
 * 19. Checks attribute-based permission.
 *
 * @param {AuthorizationContext} context - Authorization context
 * @param {AttributeRule[]} rules - Access rules
 * @returns {boolean} True if authorized
 *
 * @example
 * ```typescript
 * const context = {
 *   user: { id: 'user-123', roles: ['doctor'], permissions: [], attributes: { dept: 'cardio' } },
 *   resource: { type: 'patient', attributes: { dept: 'cardio' } },
 *   action: 'read'
 * };
 * const rules = [{ attribute: 'dept', operator: 'equals', value: context.resource.attributes.dept }];
 * if (checkAttributeBasedPermission(context, rules)) {
 *   allowAccess();
 * }
 * ```
 */
export declare function checkAttributeBasedPermission(context: AuthorizationContext, rules: AttributeRule[]): boolean;
/**
 * 20. Matches user attributes with resource requirements.
 *
 * @param {Record<string, any>} userAttributes - User attributes
 * @param {Record<string, any>} requiredAttributes - Required attributes
 * @returns {boolean} True if attributes match
 *
 * @example
 * ```typescript
 * if (matchAttributes(user.attributes, { department: 'cardiology', role: 'senior' })) {
 *   grantAccess();
 * }
 * ```
 */
export declare function matchAttributes(userAttributes: Record<string, any>, requiredAttributes: Record<string, any>): boolean;
/**
 * 21. Filters resources based on user attributes.
 *
 * @param {any[]} resources - Resources to filter
 * @param {Record<string, any>} userAttributes - User attributes
 * @param {string} attributeKey - Attribute to match
 * @returns {any[]} Filtered resources
 *
 * @example
 * ```typescript
 * const accessiblePatients = filterResourcesByAttribute(
 *   allPatients,
 *   { department: 'cardiology' },
 *   'department'
 * );
 * ```
 */
export declare function filterResourcesByAttribute<T extends Record<string, any>>(resources: T[], userAttributes: Record<string, any>, attributeKey: string): T[];
/**
 * 22. Validates attribute constraints.
 *
 * @param {Record<string, any>} attributes - Attributes to validate
 * @param {Record<string, any>} constraints - Validation constraints
 * @returns {object} Validation result
 *
 * @example
 * ```typescript
 * const result = validateAttributeConstraints(user.attributes, {
 *   clearanceLevel: { min: 3, max: 5 },
 *   department: { allowed: ['cardiology', 'neurology'] }
 * });
 * ```
 */
export declare function validateAttributeConstraints(attributes: Record<string, any>, constraints: Record<string, any>): {
    valid: boolean;
    errors: string[];
};
/**
 * 23. Creates an authorization policy.
 *
 * @param {string} name - Policy name
 * @param {object} config - Policy configuration
 * @returns {Policy} Created policy
 *
 * @example
 * ```typescript
 * const policy = createPolicy('doctor-patient-access', {
 *   effect: 'allow',
 *   subjects: ['doctor'],
 *   actions: ['read', 'write'],
 *   resources: ['patients'],
 *   conditions: [{ field: 'department', operator: 'equals', value: 'cardiology' }]
 * });
 * ```
 */
export declare function createPolicy(name: string, config: {
    description?: string;
    effect: 'allow' | 'deny';
    subjects: string[];
    actions: string[];
    resources: string[];
    conditions?: PolicyCondition[];
    priority?: number;
}): Policy;
/**
 * 24. Evaluates policy condition.
 *
 * @param {PolicyCondition} condition - Policy condition
 * @param {Record<string, any>} context - Evaluation context
 * @returns {boolean} True if condition passes
 *
 * @example
 * ```typescript
 * const condition = { field: 'time', operator: 'greaterThan', value: '09:00' };
 * if (evaluatePolicyCondition(condition, { time: '10:30' })) {
 *   // Within business hours
 * }
 * ```
 */
export declare function evaluatePolicyCondition(condition: PolicyCondition, context: Record<string, any>): boolean;
/**
 * 25. Evaluates policy against authorization context.
 *
 * @param {Policy} policy - Policy to evaluate
 * @param {AuthorizationContext} context - Authorization context
 * @returns {boolean} True if policy applies and passes
 *
 * @example
 * ```typescript
 * if (evaluatePolicy(policy, authContext)) {
 *   // Policy allows this action
 *   grantAccess();
 * }
 * ```
 */
export declare function evaluatePolicy(policy: Policy, context: AuthorizationContext): boolean;
/**
 * 26. Evaluates multiple policies and returns authorization result.
 *
 * @param {Policy[]} policies - All policies
 * @param {AuthorizationContext} context - Authorization context
 * @returns {AuthorizationResult} Authorization result
 *
 * @example
 * ```typescript
 * const result = evaluatePolicies(allPolicies, authContext);
 * if (!result.authorized) {
 *   throw new ForbiddenException(result.reason);
 * }
 * ```
 */
export declare function evaluatePolicies(policies: Policy[], context: AuthorizationContext): AuthorizationResult;
/**
 * 27. Finds applicable policies for context.
 *
 * @param {Policy[]} policies - All policies
 * @param {AuthorizationContext} context - Authorization context
 * @returns {Policy[]} Applicable policies
 *
 * @example
 * ```typescript
 * const applicable = findApplicablePolicies(allPolicies, authContext);
 * console.log('Policies that apply:', applicable.map(p => p.name));
 * ```
 */
export declare function findApplicablePolicies(policies: Policy[], context: AuthorizationContext): Policy[];
/**
 * 28. Merges multiple policies into a single decision.
 *
 * @param {Policy[]} policies - Policies to merge
 * @returns {object} Merged policy decision
 *
 * @example
 * ```typescript
 * const decision = mergePolicyDecisions(applicablePolicies);
 * // { effect: 'allow', highestPriority: 100 }
 * ```
 */
export declare function mergePolicyDecisions(policies: Policy[]): {
    effect: 'allow' | 'deny';
    highestPriority: number;
};
/**
 * 29. Validates policy definition.
 *
 * @param {Policy} policy - Policy to validate
 * @returns {object} Validation result
 *
 * @example
 * ```typescript
 * const result = validatePolicy(policy);
 * if (!result.valid) {
 *   console.error('Policy errors:', result.errors);
 * }
 * ```
 */
export declare function validatePolicy(policy: Policy): {
    valid: boolean;
    errors: string[];
};
/**
 * 30. Checks if user owns a resource.
 *
 * @param {string} userId - User ID
 * @param {ResourceOwnership} ownership - Resource ownership
 * @returns {boolean} True if user owns resource
 *
 * @example
 * ```typescript
 * if (isResourceOwner(userId, resourceOwnership)) {
 *   grantFullAccess();
 * }
 * ```
 */
export declare function isResourceOwner(userId: string, ownership: ResourceOwnership): boolean;
/**
 * 31. Checks if resource is shared with user.
 *
 * @param {string} userId - User ID
 * @param {ResourceOwnership} ownership - Resource ownership
 * @returns {boolean} True if resource is shared
 *
 * @example
 * ```typescript
 * if (isResourceSharedWithUser(userId, resourceOwnership)) {
 *   grantReadAccess();
 * }
 * ```
 */
export declare function isResourceSharedWithUser(userId: string, ownership: ResourceOwnership): boolean;
/**
 * 32. Gets user's access level for resource.
 *
 * @param {string} userId - User ID
 * @param {ResourceOwnership} ownership - Resource ownership
 * @returns {string | null} Access level or null
 *
 * @example
 * ```typescript
 * const accessLevel = getResourceAccessLevel(userId, resourceOwnership);
 * if (accessLevel === 'admin') {
 *   allowFullControl();
 * }
 * ```
 */
export declare function getResourceAccessLevel(userId: string, ownership: ResourceOwnership): 'read' | 'write' | 'admin' | null;
/**
 * 33. Checks if user can perform action on resource.
 *
 * @param {string} userId - User ID
 * @param {string} action - Action to perform
 * @param {ResourceOwnership} ownership - Resource ownership
 * @returns {boolean} True if action is allowed
 *
 * @example
 * ```typescript
 * if (canAccessResource(userId, 'write', resourceOwnership)) {
 *   allowModification();
 * }
 * ```
 */
export declare function canAccessResource(userId: string, action: string, ownership: ResourceOwnership): boolean;
/**
 * 34. Shares resource with user.
 *
 * @param {ResourceOwnership} ownership - Resource ownership
 * @param {string} userId - User to share with
 * @param {string} accessLevel - Access level to grant
 * @returns {ResourceOwnership} Updated ownership
 *
 * @example
 * ```typescript
 * const updated = shareResourceWithUser(ownership, 'user-456', 'write');
 * await saveResourceOwnership(resourceId, updated);
 * ```
 */
export declare function shareResourceWithUser(ownership: ResourceOwnership, userId: string, accessLevel: 'read' | 'write' | 'admin'): ResourceOwnership;
/**
 * 35. Unshares resource from user.
 *
 * @param {ResourceOwnership} ownership - Resource ownership
 * @param {string} userId - User to unshare from
 * @returns {ResourceOwnership} Updated ownership
 *
 * @example
 * ```typescript
 * const updated = unshareResourceFromUser(ownership, 'user-456');
 * await saveResourceOwnership(resourceId, updated);
 * ```
 */
export declare function unshareResourceFromUser(ownership: ResourceOwnership, userId: string): ResourceOwnership;
/**
 * 36. Creates an authorization scope.
 *
 * @param {string} name - Scope name
 * @param {string[]} permissions - Included permissions
 * @param {object} options - Additional options
 * @returns {Scope} Created scope
 *
 * @example
 * ```typescript
 * const scope = createScope('patient-read', [
 *   'read:patients',
 *   'read:appointments'
 * ], {
 *   description: 'Read access to patient data',
 *   resources: ['patients', 'appointments']
 * });
 * ```
 */
export declare function createScope(name: string, permissions: string[], options?: {
    description?: string;
    resources?: string[];
}): Scope;
/**
 * 37. Validates scope permissions.
 *
 * @param {string[]} requestedScopes - Requested scopes
 * @param {Scope[]} availableScopes - Available scopes
 * @returns {string[]} Valid permissions
 *
 * @example
 * ```typescript
 * const permissions = validateScopePermissions(['patient-read', 'patient-write'], allScopes);
 * console.log('Granted permissions:', permissions);
 * ```
 */
export declare function validateScopePermissions(requestedScopes: string[], availableScopes: Scope[]): string[];
/**
 * 38. Checks if scopes include permission.
 *
 * @param {string[]} scopes - User's scopes
 * @param {string} permission - Permission to check
 * @param {Scope[]} scopeDefinitions - Scope definitions
 * @returns {boolean} True if permission is included
 *
 * @example
 * ```typescript
 * if (scopeIncludesPermission(['patient-read'], 'read:patients', allScopes)) {
 *   allowAccess();
 * }
 * ```
 */
export declare function scopeIncludesPermission(scopes: string[], permission: string, scopeDefinitions: Scope[]): boolean;
/**
 * 39. Resolves minimum required scopes for permissions.
 *
 * @param {string[]} permissions - Required permissions
 * @param {Scope[]} scopeDefinitions - Scope definitions
 * @returns {string[]} Minimum scopes needed
 *
 * @example
 * ```typescript
 * const scopes = resolveMinimumScopes(['read:patients', 'write:patients'], allScopes);
 * // Result: ['patient-write'] (includes both read and write)
 * ```
 */
export declare function resolveMinimumScopes(permissions: string[], scopeDefinitions: Scope[]): string[];
/**
 * 40. Expands scopes to full permission list.
 *
 * @param {string[]} scopes - Scope names
 * @param {Scope[]} scopeDefinitions - Scope definitions
 * @returns {string[]} All permissions
 *
 * @example
 * ```typescript
 * const permissions = expandScopes(['patient-full', 'appointment-read'], allScopes);
 * console.log('Total permissions:', permissions.length);
 * ```
 */
export declare function expandScopes(scopes: string[], scopeDefinitions: Scope[]): string[];
/**
 * 41. Builds authorization context from request.
 *
 * @param {any} user - User object
 * @param {any} resource - Resource object
 * @param {string} action - Action to perform
 * @param {object} environment - Environment data
 * @returns {AuthorizationContext} Authorization context
 *
 * @example
 * ```typescript
 * const context = buildAuthorizationContext(
 *   req.user,
 *   patient,
 *   'read',
 *   { ipAddress: req.ip, time: new Date() }
 * );
 * ```
 */
export declare function buildAuthorizationContext(user: any, resource: any, action: string, environment?: {
    ipAddress?: string;
    time?: Date;
    location?: string;
    deviceType?: string;
}): AuthorizationContext;
/**
 * 42. Authorizes action with comprehensive checks.
 *
 * @param {AuthorizationContext} context - Authorization context
 * @param {Role[]} roles - Role definitions
 * @param {Policy[]} policies - Policy definitions
 * @returns {AuthorizationResult} Authorization result
 *
 * @example
 * ```typescript
 * const result = authorize(context, allRoles, allPolicies);
 * if (!result.authorized) {
 *   throw new ForbiddenException(result.reason);
 * }
 * ```
 */
export declare function authorize(context: AuthorizationContext, roles: Role[], policies: Policy[]): AuthorizationResult;
/**
 * 43. Performs bulk authorization check.
 *
 * @param {BulkAuthorizationRequest} request - Bulk authorization request
 * @param {Role[]} roles - Role definitions
 * @param {Policy[]} policies - Policy definitions
 * @returns {Record<string, boolean>} Authorization results
 *
 * @example
 * ```typescript
 * const results = bulkAuthorize({
 *   userId: 'user-123',
 *   checks: [
 *     { permission: 'read:patients', resourceId: 'patient-1' },
 *     { permission: 'write:patients', resourceId: 'patient-2' }
 *   ]
 * }, allRoles, allPolicies);
 * ```
 */
export declare function bulkAuthorize(request: BulkAuthorizationRequest, roles: Role[], policies: Policy[]): Record<string, boolean>;
/**
 * 44. Filters authorized resources from list.
 *
 * @param {any[]} resources - Resources to filter
 * @param {string} userId - User ID
 * @param {string} action - Action to perform
 * @param {Role[]} roles - Role definitions
 * @returns {any[]} Authorized resources
 *
 * @example
 * ```typescript
 * const accessiblePatients = filterAuthorizedResources(
 *   allPatients,
 *   userId,
 *   'read',
 *   allRoles
 * );
 * ```
 */
export declare function filterAuthorizedResources<T extends Record<string, any>>(resources: T[], userId: string, action: string, roles: Role[]): T[];
/**
 * 45. Generates authorization audit log entry.
 *
 * @param {AuthorizationContext} context - Authorization context
 * @param {AuthorizationResult} result - Authorization result
 * @returns {object} Audit log entry
 *
 * @example
 * ```typescript
 * const auditLog = generateAuthorizationAuditLog(context, result);
 * await saveAuditLog(auditLog);
 * ```
 */
export declare function generateAuthorizationAuditLog(context: AuthorizationContext, result: AuthorizationResult): {
    timestamp: Date;
    userId: string;
    action: string;
    resourceType?: string;
    resourceId?: string;
    authorized: boolean;
    reason?: string;
    ipAddress?: string;
};
declare const _default: {
    createRole: typeof createRole;
    hasRole: typeof hasRole;
    hasAnyRole: typeof hasAnyRole;
    hasAllRoles: typeof hasAllRoles;
    resolveRolePermissions: typeof resolveRolePermissions;
    buildRoleHierarchy: typeof buildRoleHierarchy;
    assignRole: typeof assignRole;
    revokeRole: typeof revokeRole;
    createPermission: typeof createPermission;
    hasPermission: typeof hasPermission;
    hasAnyPermission: typeof hasAnyPermission;
    hasAllPermissions: typeof hasAllPermissions;
    parsePermission: typeof parsePermission;
    buildPermission: typeof buildPermission;
    grantPermission: typeof grantPermission;
    revokePermission: typeof revokePermission;
    evaluateAttributeRule: typeof evaluateAttributeRule;
    evaluateAttributeRules: typeof evaluateAttributeRules;
    checkAttributeBasedPermission: typeof checkAttributeBasedPermission;
    matchAttributes: typeof matchAttributes;
    filterResourcesByAttribute: typeof filterResourcesByAttribute;
    validateAttributeConstraints: typeof validateAttributeConstraints;
    createPolicy: typeof createPolicy;
    evaluatePolicyCondition: typeof evaluatePolicyCondition;
    evaluatePolicy: typeof evaluatePolicy;
    evaluatePolicies: typeof evaluatePolicies;
    findApplicablePolicies: typeof findApplicablePolicies;
    mergePolicyDecisions: typeof mergePolicyDecisions;
    validatePolicy: typeof validatePolicy;
    isResourceOwner: typeof isResourceOwner;
    isResourceSharedWithUser: typeof isResourceSharedWithUser;
    getResourceAccessLevel: typeof getResourceAccessLevel;
    canAccessResource: typeof canAccessResource;
    shareResourceWithUser: typeof shareResourceWithUser;
    unshareResourceFromUser: typeof unshareResourceFromUser;
    createScope: typeof createScope;
    validateScopePermissions: typeof validateScopePermissions;
    scopeIncludesPermission: typeof scopeIncludesPermission;
    resolveMinimumScopes: typeof resolveMinimumScopes;
    expandScopes: typeof expandScopes;
    buildAuthorizationContext: typeof buildAuthorizationContext;
    authorize: typeof authorize;
    bulkAuthorize: typeof bulkAuthorize;
    filterAuthorizedResources: typeof filterAuthorizedResources;
    generateAuthorizationAuditLog: typeof generateAuthorizationAuditLog;
};
export default _default;
//# sourceMappingURL=authorization-kit.d.ts.map