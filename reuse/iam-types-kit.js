"use strict";
/**
 * LOC: IAM1234567
 * File: /reuse/iam-types-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable type definitions)
 *
 * DOWNSTREAM (imported by):
 *   - IAM services
 *   - Authorization middleware
 *   - Policy engines
 *   - Permission guards
 *   - RBAC/ABAC implementations
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createResource = exports.createSubject = exports.hasAllRoles = exports.hasAnyRole = exports.hasRole = exports.hasPermission = exports.extractResources = exports.extractActions = exports.extractPermissions = exports.createRoleBuilder = exports.createPolicyBuilder = exports.RoleBuilder = exports.PolicyBuilder = exports.validateAuthorizationRequest = exports.validateResource = exports.validateSubject = exports.validateRole = exports.validatePolicyDocument = exports.isValidPermissionAction = exports.isDenyEffect = exports.isAllowEffect = exports.isPermissionId = exports.isRoleId = exports.isUserId = exports.isAnonymousPrincipal = exports.isServicePrincipal = exports.isUserPrincipal = exports.createPolicyId = exports.createGroupId = exports.createResourceId = exports.createPermissionId = exports.createRoleId = exports.createUserId = void 0;
/**
 * Creates a branded UserId from a string
 *
 * @param {string} id - Raw user ID string
 * @returns {UserId} Branded user ID
 *
 * @example
 * ```typescript
 * const userId = createUserId('user-123');
 * // Type-safe, cannot be confused with RoleId or other IDs
 * ```
 */
const createUserId = (id) => id;
exports.createUserId = createUserId;
/**
 * Creates a branded RoleId from a string
 *
 * @param {string} id - Raw role ID string
 * @returns {RoleId} Branded role ID
 *
 * @example
 * ```typescript
 * const roleId = createRoleId('role-admin');
 * ```
 */
const createRoleId = (id) => id;
exports.createRoleId = createRoleId;
/**
 * Creates a branded PermissionId from a string
 *
 * @param {string} id - Raw permission ID string
 * @returns {PermissionId} Branded permission ID
 *
 * @example
 * ```typescript
 * const permId = createPermissionId('patient:read');
 * ```
 */
const createPermissionId = (id) => id;
exports.createPermissionId = createPermissionId;
/**
 * Creates a branded ResourceId from a string
 *
 * @param {string} id - Raw resource ID string
 * @returns {ResourceId} Branded resource ID
 *
 * @example
 * ```typescript
 * const resourceId = createResourceId('patient-456');
 * ```
 */
const createResourceId = (id) => id;
exports.createResourceId = createResourceId;
/**
 * Creates a branded GroupId from a string
 *
 * @param {string} id - Raw group ID string
 * @returns {GroupId} Branded group ID
 *
 * @example
 * ```typescript
 * const groupId = createGroupId('doctors-group');
 * ```
 */
const createGroupId = (id) => id;
exports.createGroupId = createGroupId;
/**
 * Creates a branded PolicyId from a string
 *
 * @param {string} id - Raw policy ID string
 * @returns {PolicyId} Branded policy ID
 *
 * @example
 * ```typescript
 * const policyId = createPolicyId('policy-123');
 * ```
 */
const createPolicyId = (id) => id;
exports.createPolicyId = createPolicyId;
// ============================================================================
// TYPE GUARDS
// ============================================================================
/**
 * Type guard for checking if a principal is a user
 *
 * @param {IAMPrincipal} principal - Principal to check
 * @returns {boolean} True if principal is a user
 *
 * @example
 * ```typescript
 * if (isUserPrincipal(principal)) {
 *   console.log(principal.email); // Type-safe access to email
 * }
 * ```
 */
const isUserPrincipal = (principal) => {
    return principal.kind === 'user';
};
exports.isUserPrincipal = isUserPrincipal;
/**
 * Type guard for checking if a principal is a service
 *
 * @param {IAMPrincipal} principal - Principal to check
 * @returns {boolean} True if principal is a service
 *
 * @example
 * ```typescript
 * if (isServicePrincipal(principal)) {
 *   console.log(principal.apiKey); // Type-safe access to apiKey
 * }
 * ```
 */
const isServicePrincipal = (principal) => {
    return principal.kind === 'service';
};
exports.isServicePrincipal = isServicePrincipal;
/**
 * Type guard for checking if a principal is anonymous
 *
 * @param {IAMPrincipal} principal - Principal to check
 * @returns {boolean} True if principal is anonymous
 *
 * @example
 * ```typescript
 * if (isAnonymousPrincipal(principal)) {
 *   console.log(principal.sessionId); // Type-safe access to sessionId
 * }
 * ```
 */
const isAnonymousPrincipal = (principal) => {
    return principal.kind === 'anonymous';
};
exports.isAnonymousPrincipal = isAnonymousPrincipal;
/**
 * Type guard for checking if a value is a valid UserId
 *
 * @param {unknown} value - Value to check
 * @returns {boolean} True if value is a UserId
 *
 * @example
 * ```typescript
 * if (isUserId(value)) {
 *   // value is typed as UserId
 * }
 * ```
 */
const isUserId = (value) => {
    return typeof value === 'string' && value.length > 0;
};
exports.isUserId = isUserId;
/**
 * Type guard for checking if a value is a valid RoleId
 *
 * @param {unknown} value - Value to check
 * @returns {boolean} True if value is a RoleId
 */
const isRoleId = (value) => {
    return typeof value === 'string' && value.length > 0;
};
exports.isRoleId = isRoleId;
/**
 * Type guard for checking if a value is a valid PermissionId
 *
 * @param {unknown} value - Value to check
 * @returns {boolean} True if value is a PermissionId
 */
const isPermissionId = (value) => {
    return typeof value === 'string' && value.length > 0;
};
exports.isPermissionId = isPermissionId;
/**
 * Type guard for checking if effect is Allow
 *
 * @param {Effect} effect - Effect to check
 * @returns {boolean} True if effect is Allow
 */
const isAllowEffect = (effect) => {
    return effect === 'Allow';
};
exports.isAllowEffect = isAllowEffect;
/**
 * Type guard for checking if effect is Deny
 *
 * @param {Effect} effect - Effect to check
 * @returns {boolean} True if effect is Deny
 */
const isDenyEffect = (effect) => {
    return effect === 'Deny';
};
exports.isDenyEffect = isDenyEffect;
/**
 * Type guard for validating permission action format
 *
 * @param {string} action - Action string to validate
 * @returns {boolean} True if action is valid PermissionAction
 */
const isValidPermissionAction = (action) => {
    const pattern = /^(patient|appointment|prescription|lab-result|billing|\*):(create|read|update|delete|list|search|\*)$/;
    return pattern.test(action) || action === '*:*';
};
exports.isValidPermissionAction = isValidPermissionAction;
// ============================================================================
// VALIDATORS
// ============================================================================
/**
 * Validates a policy document structure
 *
 * @param {unknown} policy - Policy to validate
 * @returns {boolean} True if policy is valid
 *
 * @example
 * ```typescript
 * if (validatePolicyDocument(policy)) {
 *   // policy is typed as PolicyDocument
 * }
 * ```
 */
const validatePolicyDocument = (policy) => {
    if (typeof policy !== 'object' || policy === null)
        return false;
    const p = policy;
    if (!p.version || (p.version !== '2012-10-17' && p.version !== '2025-01-01')) {
        return false;
    }
    if (!Array.isArray(p.statements))
        return false;
    return p.statements.every((stmt) => stmt.effect &&
        Array.isArray(stmt.actions) &&
        Array.isArray(stmt.resources));
};
exports.validatePolicyDocument = validatePolicyDocument;
/**
 * Validates a role structure
 *
 * @param {unknown} role - Role to validate
 * @returns {boolean} True if role is valid
 */
const validateRole = (role) => {
    if (typeof role !== 'object' || role === null)
        return false;
    const r = role;
    return ((0, exports.isRoleId)(r.id) &&
        typeof r.name === 'string' &&
        Array.isArray(r.permissions) &&
        Array.isArray(r.policies) &&
        typeof r.isSystem === 'boolean' &&
        r.createdAt instanceof Date &&
        r.updatedAt instanceof Date);
};
exports.validateRole = validateRole;
/**
 * Validates a subject structure
 *
 * @param {unknown} subject - Subject to validate
 * @returns {boolean} True if subject is valid
 */
const validateSubject = (subject) => {
    if (typeof subject !== 'object' || subject === null)
        return false;
    const s = subject;
    return ((0, exports.isUserId)(s.id) &&
        typeof s.name === 'string' &&
        Array.isArray(s.roles) &&
        Array.isArray(s.groups) &&
        typeof s.authenticationMethod === 'string' &&
        s.authenticatedAt instanceof Date);
};
exports.validateSubject = validateSubject;
/**
 * Validates a resource structure
 *
 * @param {unknown} resource - Resource to validate
 * @returns {boolean} True if resource is valid
 */
const validateResource = (resource) => {
    if (typeof resource !== 'object' || resource === null)
        return false;
    const r = resource;
    return (typeof r.type === 'string' &&
        typeof r.id === 'string' &&
        typeof r.arn === 'string' &&
        typeof r.attributes === 'object' &&
        typeof r.tags === 'object');
};
exports.validateResource = validateResource;
/**
 * Validates an authorization request
 *
 * @param {unknown} request - Request to validate
 * @returns {boolean} True if request is valid
 */
const validateAuthorizationRequest = (request) => {
    if (typeof request !== 'object' || request === null)
        return false;
    const r = request;
    return ((0, exports.validateSubject)(r.subject) &&
        typeof r.action === 'object' &&
        (0, exports.validateResource)(r.resource) &&
        typeof r.context === 'object');
};
exports.validateAuthorizationRequest = validateAuthorizationRequest;
// ============================================================================
// TYPE-SAFE BUILDER PATTERNS
// ============================================================================
/**
 * Policy builder for type-safe policy construction
 */
class PolicyBuilder {
    constructor() {
        this.statements = [];
    }
    /**
     * Sets the policy ID
     */
    withId(id) {
        this.policyId = id;
        return this;
    }
    /**
     * Adds an allow statement
     */
    allow(actions, resources) {
        this.statements.push({
            effect: 'Allow',
            actions,
            resources,
        });
        return this;
    }
    /**
     * Adds a deny statement
     */
    deny(actions, resources) {
        this.statements.push({
            effect: 'Deny',
            actions,
            resources,
        });
        return this;
    }
    /**
     * Adds conditions to the last statement
     */
    withConditions(conditions) {
        if (this.statements.length > 0) {
            const lastStatement = this.statements[this.statements.length - 1];
            this.statements[this.statements.length - 1] = {
                ...lastStatement,
                conditions,
            };
        }
        return this;
    }
    /**
     * Builds the final policy document
     */
    build() {
        return {
            version: '2025-01-01',
            id: this.policyId,
            statements: this.statements,
        };
    }
}
exports.PolicyBuilder = PolicyBuilder;
/**
 * Role builder for type-safe role construction
 */
class RoleBuilder {
    constructor() {
        this.permissions = [];
        this.policies = [];
        this.inheritsFrom = [];
        this.isSystem = false;
    }
    /**
     * Sets the role ID
     */
    withId(id) {
        this.roleId = id;
        return this;
    }
    /**
     * Sets the role name
     */
    withName(name) {
        this.name = name;
        return this;
    }
    /**
     * Sets the role description
     */
    withDescription(description) {
        this.description = description;
        return this;
    }
    /**
     * Adds permissions to the role
     */
    addPermissions(...permissions) {
        this.permissions.push(...permissions);
        return this;
    }
    /**
     * Adds policies to the role
     */
    addPolicies(...policies) {
        this.policies.push(...policies);
        return this;
    }
    /**
     * Sets role inheritance
     */
    inherits(...roles) {
        this.inheritsFrom.push(...roles);
        return this;
    }
    /**
     * Marks as system role
     */
    asSystem() {
        this.isSystem = true;
        return this;
    }
    /**
     * Builds the final role
     */
    build() {
        if (!this.roleId || !this.name) {
            throw new Error('Role ID and name are required');
        }
        const now = new Date();
        return {
            id: this.roleId,
            name: this.name,
            description: this.description,
            permissions: this.permissions,
            policies: this.policies,
            inheritsFrom: this.inheritsFrom.length > 0 ? this.inheritsFrom : undefined,
            isSystem: this.isSystem,
            createdAt: now,
            updatedAt: now,
        };
    }
}
exports.RoleBuilder = RoleBuilder;
/**
 * Creates a new policy builder instance
 *
 * @returns {PolicyBuilder} New policy builder
 *
 * @example
 * ```typescript
 * const policy = createPolicyBuilder()
 *   .allow(['patient:read', 'patient:list'], ['*'])
 *   .deny(['patient:delete'], ['*'])
 *   .build();
 * ```
 */
const createPolicyBuilder = () => {
    return new PolicyBuilder();
};
exports.createPolicyBuilder = createPolicyBuilder;
/**
 * Creates a new role builder instance
 *
 * @returns {RoleBuilder} New role builder
 *
 * @example
 * ```typescript
 * const role = createRoleBuilder()
 *   .withId(createRoleId('doctor'))
 *   .withName('Doctor')
 *   .addPermissions(createPermissionId('patient:read'))
 *   .build();
 * ```
 */
const createRoleBuilder = () => {
    return new RoleBuilder();
};
exports.createRoleBuilder = createRoleBuilder;
/**
 * Extracts all permissions from a role
 *
 * @param {Role} role - Role to extract permissions from
 * @returns {ReadonlyArray<PermissionId>} Array of permission IDs
 */
const extractPermissions = (role) => {
    return role.permissions;
};
exports.extractPermissions = extractPermissions;
/**
 * Extracts all actions from a policy document
 *
 * @param {PolicyDocument} policy - Policy to extract actions from
 * @returns {ReadonlyArray<PermissionAction>} Array of actions
 */
const extractActions = (policy) => {
    return policy.statements.flatMap(stmt => stmt.actions);
};
exports.extractActions = extractActions;
/**
 * Extracts all resources from a policy document
 *
 * @param {PolicyDocument} policy - Policy to extract resources from
 * @returns {ReadonlyArray<string>} Array of resource ARNs
 */
const extractResources = (policy) => {
    return policy.statements.flatMap(stmt => stmt.resources);
};
exports.extractResources = extractResources;
/**
 * Runtime permission checker with type safety
 *
 * @param {Subject} subject - Subject to check
 * @param {PermissionId} permission - Required permission
 * @returns {boolean} True if subject has permission
 */
const hasPermission = (subject, permission) => {
    // This would integrate with actual permission resolution logic
    return true; // Placeholder
};
exports.hasPermission = hasPermission;
/**
 * Runtime role checker with type safety
 *
 * @param {Subject} subject - Subject to check
 * @param {RoleId} role - Required role
 * @returns {boolean} True if subject has role
 */
const hasRole = (subject, role) => {
    return subject.roles.includes(role);
};
exports.hasRole = hasRole;
/**
 * Checks if subject has any of the specified roles
 *
 * @param {Subject} subject - Subject to check
 * @param {RoleId[]} roles - Required roles (any)
 * @returns {boolean} True if subject has any role
 */
const hasAnyRole = (subject, roles) => {
    return roles.some(role => subject.roles.includes(role));
};
exports.hasAnyRole = hasAnyRole;
/**
 * Checks if subject has all of the specified roles
 *
 * @param {Subject} subject - Subject to check
 * @param {RoleId[]} roles - Required roles (all)
 * @returns {boolean} True if subject has all roles
 */
const hasAllRoles = (subject, roles) => {
    return roles.every(role => subject.roles.includes(role));
};
exports.hasAllRoles = hasAllRoles;
/**
 * Creates a strict subject from partial data
 *
 * @param {Partial<Subject>} data - Partial subject data
 * @returns {Subject} Complete subject
 */
const createSubject = (data) => {
    const now = new Date();
    return {
        type: 'user',
        id: data.id,
        name: data.name,
        attributes: data.attributes || {},
        roles: data.roles || [],
        groups: data.groups || [],
        authenticationMethod: data.authenticationMethod || 'password',
        authenticatedAt: data.authenticatedAt || now,
        ...data,
    };
};
exports.createSubject = createSubject;
/**
 * Creates a resource from partial data
 *
 * @param {Partial<Resource>} data - Partial resource data
 * @returns {Resource} Complete resource
 */
const createResource = (data) => {
    return {
        type: data.type,
        id: data.id,
        arn: data.arn,
        attributes: data.attributes || {},
        tags: data.tags || {},
        ...data,
    };
};
exports.createResource = createResource;
// ============================================================================
// DEFAULT EXPORT
// ============================================================================
exports.default = {
    // Branded type creators
    createUserId: exports.createUserId,
    createRoleId: exports.createRoleId,
    createPermissionId: exports.createPermissionId,
    createResourceId: exports.createResourceId,
    createGroupId: exports.createGroupId,
    createPolicyId: exports.createPolicyId,
    // Type guards
    isUserPrincipal: exports.isUserPrincipal,
    isServicePrincipal: exports.isServicePrincipal,
    isAnonymousPrincipal: exports.isAnonymousPrincipal,
    isUserId: exports.isUserId,
    isRoleId: exports.isRoleId,
    isPermissionId: exports.isPermissionId,
    isAllowEffect: exports.isAllowEffect,
    isDenyEffect: exports.isDenyEffect,
    isValidPermissionAction: exports.isValidPermissionAction,
    // Validators
    validatePolicyDocument: exports.validatePolicyDocument,
    validateRole: exports.validateRole,
    validateSubject: exports.validateSubject,
    validateResource: exports.validateResource,
    validateAuthorizationRequest: exports.validateAuthorizationRequest,
    // Builders
    createPolicyBuilder: exports.createPolicyBuilder,
    createRoleBuilder: exports.createRoleBuilder,
    // Type inference helpers
    extractPermissions: exports.extractPermissions,
    extractActions: exports.extractActions,
    extractResources: exports.extractResources,
    // Permission checking
    hasPermission: exports.hasPermission,
    hasRole: exports.hasRole,
    hasAnyRole: exports.hasAnyRole,
    hasAllRoles: exports.hasAllRoles,
    // Entity creators
    createSubject: exports.createSubject,
    createResource: exports.createResource,
};
//# sourceMappingURL=iam-types-kit.js.map