"use strict";
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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRole = createRole;
exports.hasRole = hasRole;
exports.hasAnyRole = hasAnyRole;
exports.hasAllRoles = hasAllRoles;
exports.resolveRolePermissions = resolveRolePermissions;
exports.buildRoleHierarchy = buildRoleHierarchy;
exports.assignRole = assignRole;
exports.revokeRole = revokeRole;
exports.createPermission = createPermission;
exports.hasPermission = hasPermission;
exports.hasAnyPermission = hasAnyPermission;
exports.hasAllPermissions = hasAllPermissions;
exports.parsePermission = parsePermission;
exports.buildPermission = buildPermission;
exports.grantPermission = grantPermission;
exports.revokePermission = revokePermission;
exports.evaluateAttributeRule = evaluateAttributeRule;
exports.evaluateAttributeRules = evaluateAttributeRules;
exports.checkAttributeBasedPermission = checkAttributeBasedPermission;
exports.matchAttributes = matchAttributes;
exports.filterResourcesByAttribute = filterResourcesByAttribute;
exports.validateAttributeConstraints = validateAttributeConstraints;
exports.createPolicy = createPolicy;
exports.evaluatePolicyCondition = evaluatePolicyCondition;
exports.evaluatePolicy = evaluatePolicy;
exports.evaluatePolicies = evaluatePolicies;
exports.findApplicablePolicies = findApplicablePolicies;
exports.mergePolicyDecisions = mergePolicyDecisions;
exports.validatePolicy = validatePolicy;
exports.isResourceOwner = isResourceOwner;
exports.isResourceSharedWithUser = isResourceSharedWithUser;
exports.getResourceAccessLevel = getResourceAccessLevel;
exports.canAccessResource = canAccessResource;
exports.shareResourceWithUser = shareResourceWithUser;
exports.unshareResourceFromUser = unshareResourceFromUser;
exports.createScope = createScope;
exports.validateScopePermissions = validateScopePermissions;
exports.scopeIncludesPermission = scopeIncludesPermission;
exports.resolveMinimumScopes = resolveMinimumScopes;
exports.expandScopes = expandScopes;
exports.buildAuthorizationContext = buildAuthorizationContext;
exports.authorize = authorize;
exports.bulkAuthorize = bulkAuthorize;
exports.filterAuthorizedResources = filterAuthorizedResources;
exports.generateAuthorizationAuditLog = generateAuthorizationAuditLog;
/**
 * File: /reuse/authorization-kit.ts
 * Locator: WC-UTL-AUTHZKIT-001
 * Purpose: Comprehensive Authorization Utilities Kit - Complete authorization toolkit for NestJS applications
 *
 * Upstream: Independent utility module for authorization operations
 * Downstream: ../backend/*, Authorization modules, Guards, Decorators, Policy engines
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, @nestjs/core
 * Exports: 45 utility functions for RBAC, ABAC, permissions, policies, resource access control
 *
 * LLM Context: Enterprise-grade authorization utilities for White Cross healthcare platform.
 * Provides comprehensive role-based access control (RBAC), attribute-based access control (ABAC),
 * permission checking and validation, policy engine functions, resource ownership validation,
 * scope-based authorization, hierarchical role management, context-based authorization, and
 * NestJS-specific guards and decorators for HIPAA-compliant secure healthcare data access.
 */
const crypto = __importStar(require("crypto"));
// ============================================================================
// SECTION 1: ROLE-BASED ACCESS CONTROL (RBAC) (Functions 1-8)
// ============================================================================
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
function createRole(name, permissions, options) {
    return {
        id: crypto.randomUUID(),
        name,
        displayName: options?.displayName || name,
        description: options?.description,
        permissions,
        inherits: options?.inherits,
        priority: options?.priority || 0,
        isSystem: options?.isSystem || false,
        metadata: options?.metadata,
    };
}
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
function hasRole(acl, roleName) {
    return acl.roles.includes(roleName);
}
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
function hasAnyRole(acl, roleNames) {
    return roleNames.some(role => acl.roles.includes(role));
}
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
function hasAllRoles(acl, roleNames) {
    return roleNames.every(role => acl.roles.includes(role));
}
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
function resolveRolePermissions(roles, roleDefinitions) {
    const resolvedPermissions = new Set();
    const processedRoles = new Set();
    function resolveRole(roleName) {
        if (processedRoles.has(roleName))
            return;
        processedRoles.add(roleName);
        const roleDef = roleDefinitions.find(r => r.name === roleName);
        if (!roleDef)
            return;
        // Add role's permissions
        roleDef.permissions.forEach(p => resolvedPermissions.add(p));
        // Recursively resolve inherited roles
        if (roleDef.inherits) {
            roleDef.inherits.forEach(inheritedRole => resolveRole(inheritedRole));
        }
    }
    roles.forEach(role => resolveRole(role));
    return Array.from(resolvedPermissions);
}
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
function buildRoleHierarchy(roles) {
    const hierarchy = [];
    const roleMap = new Map();
    roles.forEach(role => roleMap.set(role.name, role));
    function calculateLevel(roleName, visited = new Set()) {
        if (visited.has(roleName))
            return 0; // Circular reference
        visited.add(roleName);
        const role = roleMap.get(roleName);
        if (!role || !role.inherits || role.inherits.length === 0)
            return 0;
        const parentLevels = role.inherits.map(parent => calculateLevel(parent, new Set(visited)));
        return Math.max(...parentLevels) + 1;
    }
    roles.forEach(role => {
        const level = calculateLevel(role.name);
        const children = roles
            .filter(r => r.inherits?.includes(role.name))
            .map(r => r.name);
        hierarchy.push({
            role: role.name,
            parent: role.inherits?.[0],
            children: children.length > 0 ? children : undefined,
            level,
        });
    });
    return hierarchy.sort((a, b) => a.level - b.level);
}
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
function assignRole(acl, roleName) {
    if (acl.roles.includes(roleName))
        return acl;
    return {
        ...acl,
        roles: [...acl.roles, roleName],
    };
}
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
function revokeRole(acl, roleName) {
    return {
        ...acl,
        roles: acl.roles.filter(r => r !== roleName),
    };
}
// ============================================================================
// SECTION 2: PERMISSION MANAGEMENT (Functions 9-16)
// ============================================================================
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
function createPermission(resource, action, options) {
    return {
        id: crypto.randomUUID(),
        name: `${action}:${resource}`,
        resource,
        action,
        description: options?.description,
        scope: options?.scope,
        conditions: options?.conditions,
        metadata: options?.metadata,
    };
}
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
function hasPermission(acl, permission, roleDefinitions) {
    // Check if explicitly denied
    if (acl.deniedPermissions?.includes(permission))
        return false;
    // Check direct permissions
    if (acl.permissions.includes(permission))
        return true;
    // Check role-based permissions
    const rolePermissions = resolveRolePermissions(acl.roles, roleDefinitions);
    return rolePermissions.includes(permission);
}
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
function hasAnyPermission(acl, permissions, roleDefinitions) {
    return permissions.some(perm => hasPermission(acl, perm, roleDefinitions));
}
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
function hasAllPermissions(acl, permissions, roleDefinitions) {
    return permissions.every(perm => hasPermission(acl, perm, roleDefinitions));
}
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
function parsePermission(permission) {
    const parts = permission.split(':');
    if (parts.length < 2)
        return null;
    return {
        action: parts[0],
        resource: parts[1],
        scope: parts[2],
    };
}
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
function buildPermission(action, resource, scope) {
    return scope ? `${action}:${resource}:${scope}` : `${action}:${resource}`;
}
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
function grantPermission(acl, permission) {
    if (acl.permissions.includes(permission))
        return acl;
    return {
        ...acl,
        permissions: [...acl.permissions, permission],
        deniedPermissions: acl.deniedPermissions?.filter(p => p !== permission),
    };
}
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
function revokePermission(acl, permission) {
    return {
        ...acl,
        permissions: acl.permissions.filter(p => p !== permission),
    };
}
// ============================================================================
// SECTION 3: ATTRIBUTE-BASED ACCESS CONTROL (ABAC) (Functions 17-22)
// ============================================================================
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
function evaluateAttributeRule(rule, attributes) {
    const attributeValue = attributes[rule.attribute];
    if (rule.required && attributeValue === undefined)
        return false;
    if (attributeValue === undefined)
        return true; // Optional attribute
    switch (rule.operator) {
        case 'equals':
            return attributeValue === rule.value;
        case 'contains':
            return Array.isArray(attributeValue)
                ? attributeValue.includes(rule.value)
                : String(attributeValue).includes(String(rule.value));
        case 'greaterThan':
            return Number(attributeValue) > Number(rule.value);
        case 'lessThan':
            return Number(attributeValue) < Number(rule.value);
        case 'matches':
            return new RegExp(rule.value).test(String(attributeValue));
        default:
            return false;
    }
}
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
function evaluateAttributeRules(rules, attributes, logic = 'AND') {
    if (rules.length === 0)
        return true;
    if (logic === 'AND') {
        return rules.every(rule => evaluateAttributeRule(rule, attributes));
    }
    else {
        return rules.some(rule => evaluateAttributeRule(rule, attributes));
    }
}
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
function checkAttributeBasedPermission(context, rules) {
    return evaluateAttributeRules(rules, {
        ...context.user.attributes,
        ...context.resource?.attributes,
        ...context.environment,
    }, 'AND');
}
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
function matchAttributes(userAttributes, requiredAttributes) {
    return Object.entries(requiredAttributes).every(([key, value]) => {
        const userValue = userAttributes[key];
        if (Array.isArray(value)) {
            return value.includes(userValue);
        }
        return userValue === value;
    });
}
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
function filterResourcesByAttribute(resources, userAttributes, attributeKey) {
    return resources.filter(resource => {
        const resourceAttrValue = resource.attributes?.[attributeKey] || resource[attributeKey];
        const userAttrValue = userAttributes[attributeKey];
        if (Array.isArray(userAttrValue)) {
            return userAttrValue.includes(resourceAttrValue);
        }
        return resourceAttrValue === userAttrValue;
    });
}
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
function validateAttributeConstraints(attributes, constraints) {
    const errors = [];
    Object.entries(constraints).forEach(([key, constraint]) => {
        const value = attributes[key];
        if (constraint.required && value === undefined) {
            errors.push(`${key} is required`);
            return;
        }
        if (value === undefined)
            return;
        if (constraint.min !== undefined && Number(value) < constraint.min) {
            errors.push(`${key} must be at least ${constraint.min}`);
        }
        if (constraint.max !== undefined && Number(value) > constraint.max) {
            errors.push(`${key} must not exceed ${constraint.max}`);
        }
        if (constraint.allowed && !constraint.allowed.includes(value)) {
            errors.push(`${key} must be one of: ${constraint.allowed.join(', ')}`);
        }
        if (constraint.pattern && !new RegExp(constraint.pattern).test(String(value))) {
            errors.push(`${key} does not match required pattern`);
        }
    });
    return {
        valid: errors.length === 0,
        errors,
    };
}
// ============================================================================
// SECTION 4: POLICY ENGINE (Functions 23-29)
// ============================================================================
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
function createPolicy(name, config) {
    return {
        id: crypto.randomUUID(),
        name,
        description: config.description,
        effect: config.effect,
        subjects: config.subjects,
        actions: config.actions,
        resources: config.resources,
        conditions: config.conditions,
        priority: config.priority || 0,
    };
}
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
function evaluatePolicyCondition(condition, context) {
    const value = context[condition.field];
    switch (condition.operator) {
        case 'equals':
            return value === condition.value;
        case 'notEquals':
            return value !== condition.value;
        case 'contains':
            return Array.isArray(value) ? value.includes(condition.value) : String(value).includes(String(condition.value));
        case 'notContains':
            return Array.isArray(value) ? !value.includes(condition.value) : !String(value).includes(String(condition.value));
        case 'greaterThan':
            return Number(value) > Number(condition.value);
        case 'lessThan':
            return Number(value) < Number(condition.value);
        case 'in':
            return Array.isArray(condition.value) && condition.value.includes(value);
        case 'notIn':
            return Array.isArray(condition.value) && !condition.value.includes(value);
        default:
            return false;
    }
}
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
function evaluatePolicy(policy, context) {
    // Check if subject matches (role or user)
    const subjectMatches = policy.subjects.some(subject => context.user.roles.includes(subject) || context.user.id === subject);
    if (!subjectMatches)
        return false;
    // Check if action matches
    const actionMatches = policy.actions.includes('*') || policy.actions.includes(context.action);
    if (!actionMatches)
        return false;
    // Check if resource matches
    const resourceMatches = policy.resources.includes('*') ||
        (context.resource && policy.resources.includes(context.resource.type));
    if (!resourceMatches)
        return false;
    // Evaluate conditions
    if (policy.conditions && policy.conditions.length > 0) {
        const conditionContext = {
            ...context.user.attributes,
            ...context.resource?.attributes,
            ...context.environment,
        };
        const allConditionsPass = policy.conditions.every(condition => evaluatePolicyCondition(condition, conditionContext));
        if (!allConditionsPass)
            return false;
    }
    return true;
}
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
function evaluatePolicies(policies, context) {
    const matchedPolicies = [];
    let explicitDeny = false;
    let explicitAllow = false;
    // Sort by priority (higher priority first)
    const sortedPolicies = [...policies].sort((a, b) => (b.priority || 0) - (a.priority || 0));
    for (const policy of sortedPolicies) {
        if (evaluatePolicy(policy, context)) {
            matchedPolicies.push(policy.name);
            if (policy.effect === 'deny') {
                explicitDeny = true;
                break; // Deny takes precedence
            }
            else if (policy.effect === 'allow') {
                explicitAllow = true;
            }
        }
    }
    // Explicit deny overrides everything
    if (explicitDeny) {
        return {
            authorized: false,
            reason: 'explicit_deny',
            matchedPolicies,
        };
    }
    // Must have explicit allow
    if (explicitAllow) {
        return {
            authorized: true,
            matchedPolicies,
        };
    }
    // Default deny (no matching policy)
    return {
        authorized: false,
        reason: 'no_matching_policy',
        matchedPolicies,
    };
}
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
function findApplicablePolicies(policies, context) {
    return policies.filter(policy => evaluatePolicy(policy, context));
}
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
function mergePolicyDecisions(policies) {
    if (policies.length === 0) {
        return { effect: 'deny', highestPriority: 0 };
    }
    // Check for any explicit deny
    const hasDeny = policies.some(p => p.effect === 'deny');
    if (hasDeny) {
        return { effect: 'deny', highestPriority: Math.max(...policies.map(p => p.priority || 0)) };
    }
    // Check for explicit allow
    const hasAllow = policies.some(p => p.effect === 'allow');
    return {
        effect: hasAllow ? 'allow' : 'deny',
        highestPriority: Math.max(...policies.map(p => p.priority || 0)),
    };
}
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
function validatePolicy(policy) {
    const errors = [];
    if (!policy.name)
        errors.push('Policy name is required');
    if (!policy.effect)
        errors.push('Policy effect is required');
    if (!policy.subjects || policy.subjects.length === 0)
        errors.push('Policy must have at least one subject');
    if (!policy.actions || policy.actions.length === 0)
        errors.push('Policy must have at least one action');
    if (!policy.resources || policy.resources.length === 0)
        errors.push('Policy must have at least one resource');
    return {
        valid: errors.length === 0,
        errors,
    };
}
// ============================================================================
// SECTION 5: RESOURCE OWNERSHIP (Functions 30-35)
// ============================================================================
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
function isResourceOwner(userId, ownership) {
    return ownership.ownerId === userId;
}
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
function isResourceSharedWithUser(userId, ownership) {
    return ownership.sharedWith?.includes(userId) || false;
}
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
function getResourceAccessLevel(userId, ownership) {
    if (ownership.ownerId === userId)
        return 'admin';
    if (ownership.sharedWith?.includes(userId))
        return ownership.accessLevel || 'read';
    return null;
}
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
function canAccessResource(userId, action, ownership) {
    const accessLevel = getResourceAccessLevel(userId, ownership);
    if (!accessLevel)
        return false;
    const actionMap = {
        read: ['read'],
        write: ['read', 'write'],
        admin: ['read', 'write', 'delete', 'share'],
    };
    return actionMap[accessLevel]?.includes(action) || false;
}
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
function shareResourceWithUser(ownership, userId, accessLevel) {
    const sharedWith = ownership.sharedWith || [];
    if (sharedWith.includes(userId))
        return ownership;
    return {
        ...ownership,
        sharedWith: [...sharedWith, userId],
        accessLevel,
    };
}
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
function unshareResourceFromUser(ownership, userId) {
    return {
        ...ownership,
        sharedWith: ownership.sharedWith?.filter(id => id !== userId),
    };
}
// ============================================================================
// SECTION 6: SCOPE-BASED AUTHORIZATION (Functions 36-40)
// ============================================================================
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
function createScope(name, permissions, options) {
    return {
        name,
        description: options?.description,
        permissions,
        resources: options?.resources,
    };
}
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
function validateScopePermissions(requestedScopes, availableScopes) {
    const permissions = new Set();
    requestedScopes.forEach(scopeName => {
        const scope = availableScopes.find(s => s.name === scopeName);
        if (scope) {
            scope.permissions.forEach(p => permissions.add(p));
        }
    });
    return Array.from(permissions);
}
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
function scopeIncludesPermission(scopes, permission, scopeDefinitions) {
    const permissions = validateScopePermissions(scopes, scopeDefinitions);
    return permissions.includes(permission);
}
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
function resolveMinimumScopes(permissions, scopeDefinitions) {
    const requiredScopes = [];
    const remainingPermissions = new Set(permissions);
    // Sort scopes by number of permissions (descending)
    const sortedScopes = [...scopeDefinitions].sort((a, b) => b.permissions.length - a.permissions.length);
    for (const scope of sortedScopes) {
        const matchedPermissions = scope.permissions.filter(p => remainingPermissions.has(p));
        if (matchedPermissions.length > 0) {
            requiredScopes.push(scope.name);
            matchedPermissions.forEach(p => remainingPermissions.delete(p));
        }
        if (remainingPermissions.size === 0)
            break;
    }
    return requiredScopes;
}
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
function expandScopes(scopes, scopeDefinitions) {
    return validateScopePermissions(scopes, scopeDefinitions);
}
// ============================================================================
// SECTION 7: CONTEXT-BASED AUTHORIZATION (Functions 41-45)
// ============================================================================
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
function buildAuthorizationContext(user, resource, action, environment) {
    return {
        user: {
            id: user.id || user.userId,
            roles: user.roles || [],
            permissions: user.permissions || [],
            attributes: user.attributes || {},
        },
        resource: resource ? {
            id: resource.id,
            type: resource.type || resource.constructor.name.toLowerCase(),
            ownerId: resource.ownerId || resource.userId,
            attributes: resource.attributes || {},
        } : undefined,
        environment: environment || {},
        action,
    };
}
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
function authorize(context, roles, policies) {
    // First, evaluate policies
    const policyResult = evaluatePolicies(policies, context);
    if (policyResult.authorized) {
        return policyResult;
    }
    // If no policy allows, check direct permissions
    const acl = {
        userId: context.user.id,
        roles: context.user.roles,
        permissions: context.user.permissions,
        attributes: context.user.attributes,
    };
    const permission = buildPermission(context.action, context.resource?.type || '*');
    const hasDirectPermission = hasPermission(acl, permission, roles);
    if (hasDirectPermission) {
        return {
            authorized: true,
            reason: 'direct_permission',
        };
    }
    return {
        authorized: false,
        reason: policyResult.reason || 'insufficient_permissions',
        missingPermissions: [permission],
    };
}
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
function bulkAuthorize(request, roles, policies) {
    const results = {};
    request.checks.forEach((check, index) => {
        const parsed = parsePermission(check.permission);
        if (!parsed) {
            results[`check_${index}`] = false;
            return;
        }
        const context = {
            user: {
                id: request.userId,
                roles: [],
                permissions: [],
            },
            resource: check.resourceId ? {
                id: check.resourceId,
                type: parsed.resource,
            } : undefined,
            action: parsed.action,
        };
        const result = authorize(context, roles, policies);
        results[`check_${index}`] = result.authorized;
    });
    return results;
}
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
function filterAuthorizedResources(resources, userId, action, roles) {
    return resources.filter(resource => {
        const ownership = {
            resourceId: resource.id,
            resourceType: resource.type || resource.constructor.name.toLowerCase(),
            ownerId: resource.ownerId || resource.userId,
            sharedWith: resource.sharedWith,
            accessLevel: resource.accessLevel,
        };
        return canAccessResource(userId, action, ownership);
    });
}
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
function generateAuthorizationAuditLog(context, result) {
    return {
        timestamp: new Date(),
        userId: context.user.id,
        action: context.action,
        resourceType: context.resource?.type,
        resourceId: context.resource?.id,
        authorized: result.authorized,
        reason: result.reason,
        ipAddress: context.environment?.ipAddress,
    };
}
// ============================================================================
// EXPORTS
// ============================================================================
exports.default = {
    // Role-Based Access Control (RBAC)
    createRole,
    hasRole,
    hasAnyRole,
    hasAllRoles,
    resolveRolePermissions,
    buildRoleHierarchy,
    assignRole,
    revokeRole,
    // Permission Management
    createPermission,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    parsePermission,
    buildPermission,
    grantPermission,
    revokePermission,
    // Attribute-Based Access Control (ABAC)
    evaluateAttributeRule,
    evaluateAttributeRules,
    checkAttributeBasedPermission,
    matchAttributes,
    filterResourcesByAttribute,
    validateAttributeConstraints,
    // Policy Engine
    createPolicy,
    evaluatePolicyCondition,
    evaluatePolicy,
    evaluatePolicies,
    findApplicablePolicies,
    mergePolicyDecisions,
    validatePolicy,
    // Resource Ownership
    isResourceOwner,
    isResourceSharedWithUser,
    getResourceAccessLevel,
    canAccessResource,
    shareResourceWithUser,
    unshareResourceFromUser,
    // Scope-Based Authorization
    createScope,
    validateScopePermissions,
    scopeIncludesPermission,
    resolveMinimumScopes,
    expandScopes,
    // Context-Based Authorization
    buildAuthorizationContext,
    authorize,
    bulkAuthorize,
    filterAuthorizedResources,
    generateAuthorizationAuditLog,
};
//# sourceMappingURL=authorization-kit.js.map