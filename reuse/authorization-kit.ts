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

import * as crypto from 'crypto';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

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
  subjects: string[]; // roles, users, or groups
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
export function createRole(
  name: string,
  permissions: string[],
  options?: {
    displayName?: string;
    description?: string;
    inherits?: string[];
    priority?: number;
    isSystem?: boolean;
    metadata?: Record<string, any>;
  }
): Role {
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
export function hasRole(acl: AccessControlList, roleName: string): boolean {
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
export function hasAnyRole(acl: AccessControlList, roleNames: string[]): boolean {
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
export function hasAllRoles(acl: AccessControlList, roleNames: string[]): boolean {
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
export function resolveRolePermissions(roles: string[], roleDefinitions: Role[]): string[] {
  const resolvedPermissions = new Set<string>();
  const processedRoles = new Set<string>();

  function resolveRole(roleName: string): void {
    if (processedRoles.has(roleName)) return;
    processedRoles.add(roleName);

    const roleDef = roleDefinitions.find(r => r.name === roleName);
    if (!roleDef) return;

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
export function buildRoleHierarchy(roles: Role[]): RoleHierarchy[] {
  const hierarchy: RoleHierarchy[] = [];
  const roleMap = new Map<string, Role>();

  roles.forEach(role => roleMap.set(role.name, role));

  function calculateLevel(roleName: string, visited = new Set<string>()): number {
    if (visited.has(roleName)) return 0; // Circular reference
    visited.add(roleName);

    const role = roleMap.get(roleName);
    if (!role || !role.inherits || role.inherits.length === 0) return 0;

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
export function assignRole(acl: AccessControlList, roleName: string): AccessControlList {
  if (acl.roles.includes(roleName)) return acl;

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
export function revokeRole(acl: AccessControlList, roleName: string): AccessControlList {
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
export function createPermission(
  resource: string,
  action: string,
  options?: {
    description?: string;
    scope?: string[];
    conditions?: Record<string, any>;
    metadata?: Record<string, any>;
  }
): Permission {
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
export function hasPermission(
  acl: AccessControlList,
  permission: string,
  roleDefinitions: Role[]
): boolean {
  // Check if explicitly denied
  if (acl.deniedPermissions?.includes(permission)) return false;

  // Check direct permissions
  if (acl.permissions.includes(permission)) return true;

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
export function hasAnyPermission(
  acl: AccessControlList,
  permissions: string[],
  roleDefinitions: Role[]
): boolean {
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
export function hasAllPermissions(
  acl: AccessControlList,
  permissions: string[],
  roleDefinitions: Role[]
): boolean {
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
export function parsePermission(permission: string): { action: string; resource: string; scope?: string } | null {
  const parts = permission.split(':');
  if (parts.length < 2) return null;

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
export function buildPermission(action: string, resource: string, scope?: string): string {
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
export function grantPermission(acl: AccessControlList, permission: string): AccessControlList {
  if (acl.permissions.includes(permission)) return acl;

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
export function revokePermission(acl: AccessControlList, permission: string): AccessControlList {
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
export function evaluateAttributeRule(rule: AttributeRule, attributes: Record<string, any>): boolean {
  const attributeValue = attributes[rule.attribute];

  if (rule.required && attributeValue === undefined) return false;
  if (attributeValue === undefined) return true; // Optional attribute

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
export function evaluateAttributeRules(
  rules: AttributeRule[],
  attributes: Record<string, any>,
  logic: 'AND' | 'OR' = 'AND'
): boolean {
  if (rules.length === 0) return true;

  if (logic === 'AND') {
    return rules.every(rule => evaluateAttributeRule(rule, attributes));
  } else {
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
export function checkAttributeBasedPermission(
  context: AuthorizationContext,
  rules: AttributeRule[]
): boolean {
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
export function matchAttributes(
  userAttributes: Record<string, any>,
  requiredAttributes: Record<string, any>
): boolean {
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
export function filterResourcesByAttribute<T extends Record<string, any>>(
  resources: T[],
  userAttributes: Record<string, any>,
  attributeKey: string
): T[] {
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
export function validateAttributeConstraints(
  attributes: Record<string, any>,
  constraints: Record<string, any>
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  Object.entries(constraints).forEach(([key, constraint]) => {
    const value = attributes[key];

    if (constraint.required && value === undefined) {
      errors.push(`${key} is required`);
      return;
    }

    if (value === undefined) return;

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
export function createPolicy(
  name: string,
  config: {
    description?: string;
    effect: 'allow' | 'deny';
    subjects: string[];
    actions: string[];
    resources: string[];
    conditions?: PolicyCondition[];
    priority?: number;
  }
): Policy {
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
export function evaluatePolicyCondition(
  condition: PolicyCondition,
  context: Record<string, any>
): boolean {
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
export function evaluatePolicy(policy: Policy, context: AuthorizationContext): boolean {
  // Check if subject matches (role or user)
  const subjectMatches = policy.subjects.some(subject =>
    context.user.roles.includes(subject) || context.user.id === subject
  );

  if (!subjectMatches) return false;

  // Check if action matches
  const actionMatches = policy.actions.includes('*') || policy.actions.includes(context.action);
  if (!actionMatches) return false;

  // Check if resource matches
  const resourceMatches = policy.resources.includes('*') ||
    (context.resource && policy.resources.includes(context.resource.type));
  if (!resourceMatches) return false;

  // Evaluate conditions
  if (policy.conditions && policy.conditions.length > 0) {
    const conditionContext = {
      ...context.user.attributes,
      ...context.resource?.attributes,
      ...context.environment,
    };

    const allConditionsPass = policy.conditions.every(condition =>
      evaluatePolicyCondition(condition, conditionContext)
    );

    if (!allConditionsPass) return false;
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
export function evaluatePolicies(policies: Policy[], context: AuthorizationContext): AuthorizationResult {
  const matchedPolicies: string[] = [];
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
      } else if (policy.effect === 'allow') {
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
export function findApplicablePolicies(policies: Policy[], context: AuthorizationContext): Policy[] {
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
export function mergePolicyDecisions(policies: Policy[]): { effect: 'allow' | 'deny'; highestPriority: number } {
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
export function validatePolicy(policy: Policy): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!policy.name) errors.push('Policy name is required');
  if (!policy.effect) errors.push('Policy effect is required');
  if (!policy.subjects || policy.subjects.length === 0) errors.push('Policy must have at least one subject');
  if (!policy.actions || policy.actions.length === 0) errors.push('Policy must have at least one action');
  if (!policy.resources || policy.resources.length === 0) errors.push('Policy must have at least one resource');

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
export function isResourceOwner(userId: string, ownership: ResourceOwnership): boolean {
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
export function isResourceSharedWithUser(userId: string, ownership: ResourceOwnership): boolean {
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
export function getResourceAccessLevel(
  userId: string,
  ownership: ResourceOwnership
): 'read' | 'write' | 'admin' | null {
  if (ownership.ownerId === userId) return 'admin';
  if (ownership.sharedWith?.includes(userId)) return ownership.accessLevel || 'read';
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
export function canAccessResource(
  userId: string,
  action: string,
  ownership: ResourceOwnership
): boolean {
  const accessLevel = getResourceAccessLevel(userId, ownership);
  if (!accessLevel) return false;

  const actionMap: Record<string, string[]> = {
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
export function shareResourceWithUser(
  ownership: ResourceOwnership,
  userId: string,
  accessLevel: 'read' | 'write' | 'admin'
): ResourceOwnership {
  const sharedWith = ownership.sharedWith || [];
  if (sharedWith.includes(userId)) return ownership;

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
export function unshareResourceFromUser(
  ownership: ResourceOwnership,
  userId: string
): ResourceOwnership {
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
export function createScope(
  name: string,
  permissions: string[],
  options?: {
    description?: string;
    resources?: string[];
  }
): Scope {
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
export function validateScopePermissions(requestedScopes: string[], availableScopes: Scope[]): string[] {
  const permissions = new Set<string>();

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
export function scopeIncludesPermission(
  scopes: string[],
  permission: string,
  scopeDefinitions: Scope[]
): boolean {
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
export function resolveMinimumScopes(permissions: string[], scopeDefinitions: Scope[]): string[] {
  const requiredScopes: string[] = [];
  const remainingPermissions = new Set(permissions);

  // Sort scopes by number of permissions (descending)
  const sortedScopes = [...scopeDefinitions].sort(
    (a, b) => b.permissions.length - a.permissions.length
  );

  for (const scope of sortedScopes) {
    const matchedPermissions = scope.permissions.filter(p => remainingPermissions.has(p));

    if (matchedPermissions.length > 0) {
      requiredScopes.push(scope.name);
      matchedPermissions.forEach(p => remainingPermissions.delete(p));
    }

    if (remainingPermissions.size === 0) break;
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
export function expandScopes(scopes: string[], scopeDefinitions: Scope[]): string[] {
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
export function buildAuthorizationContext(
  user: any,
  resource: any,
  action: string,
  environment?: {
    ipAddress?: string;
    time?: Date;
    location?: string;
    deviceType?: string;
  }
): AuthorizationContext {
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
export function authorize(
  context: AuthorizationContext,
  roles: Role[],
  policies: Policy[]
): AuthorizationResult {
  // First, evaluate policies
  const policyResult = evaluatePolicies(policies, context);

  if (policyResult.authorized) {
    return policyResult;
  }

  // If no policy allows, check direct permissions
  const acl: AccessControlList = {
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
export function bulkAuthorize(
  request: BulkAuthorizationRequest,
  roles: Role[],
  policies: Policy[]
): Record<string, boolean> {
  const results: Record<string, boolean> = {};

  request.checks.forEach((check, index) => {
    const parsed = parsePermission(check.permission);
    if (!parsed) {
      results[`check_${index}`] = false;
      return;
    }

    const context: AuthorizationContext = {
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
export function filterAuthorizedResources<T extends Record<string, any>>(
  resources: T[],
  userId: string,
  action: string,
  roles: Role[]
): T[] {
  return resources.filter(resource => {
    const ownership: ResourceOwnership = {
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
export function generateAuthorizationAuditLog(
  context: AuthorizationContext,
  result: AuthorizationResult
): {
  timestamp: Date;
  userId: string;
  action: string;
  resourceType?: string;
  resourceId?: string;
  authorized: boolean;
  reason?: string;
  ipAddress?: string;
} {
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

export default {
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
