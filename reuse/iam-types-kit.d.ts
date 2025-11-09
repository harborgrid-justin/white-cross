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
/**
 * File: /reuse/iam-types-kit.ts
 * Locator: WC-UTL-IAM-TYPES-001
 * Purpose: Comprehensive IAM Type System - Advanced TypeScript patterns for Identity & Access Management
 *
 * Upstream: Independent type definitions module for IAM operations
 * Downstream: ../backend/*, IAM services, Guards, Policy engines, RBAC/ABAC systems
 * Dependencies: TypeScript 5.x (advanced type features required)
 * Exports: 50+ type definitions, type guards, validators, builders for IAM
 *
 * LLM Context: Enterprise-grade IAM type system for White Cross healthcare platform.
 * Provides advanced TypeScript patterns including branded types, discriminated unions,
 * conditional types, type guards, and compile-time permission checking. HIPAA-compliant
 * type-safe IAM patterns ensuring secure healthcare data access with zero-cost abstractions.
 */
/**
 * Brand symbol for nominal typing
 */
declare const __brand: unique symbol;
/**
 * Branded type for compile-time type safety
 */
type Brand<T, TBrand extends string> = T & {
    [__brand]: TBrand;
};
/**
 * User ID branded type - prevents mixing with other string IDs
 */
export type UserId = Brand<string, 'UserId'>;
/**
 * Role ID branded type - prevents mixing with other string IDs
 */
export type RoleId = Brand<string, 'RoleId'>;
/**
 * Permission ID branded type - prevents mixing with other string IDs
 */
export type PermissionId = Brand<string, 'PermissionId'>;
/**
 * Resource ID branded type - prevents mixing with other string IDs
 */
export type ResourceId = Brand<string, 'ResourceId'>;
/**
 * Group ID branded type - prevents mixing with other string IDs
 */
export type GroupId = Brand<string, 'GroupId'>;
/**
 * Policy ID branded type - prevents mixing with other string IDs
 */
export type PolicyId = Brand<string, 'PolicyId'>;
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
export declare const createUserId: (id: string) => UserId;
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
export declare const createRoleId: (id: string) => RoleId;
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
export declare const createPermissionId: (id: string) => PermissionId;
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
export declare const createResourceId: (id: string) => ResourceId;
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
export declare const createGroupId: (id: string) => GroupId;
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
export declare const createPolicyId: (id: string) => PolicyId;
/**
 * Principal type - represents an entity that can perform actions
 */
export interface Principal {
    readonly type: 'user' | 'service' | 'role' | 'anonymous';
    readonly id: UserId;
    readonly name: string;
    readonly attributes: Record<string, unknown>;
    readonly roles: ReadonlyArray<RoleId>;
    readonly groups: ReadonlyArray<GroupId>;
}
/**
 * Subject type - alias for Principal with additional context
 */
export interface Subject extends Principal {
    readonly sessionId?: string;
    readonly authenticationMethod: 'password' | 'oauth' | 'saml' | 'api-key' | 'biometric';
    readonly authenticatedAt: Date;
    readonly ipAddress?: string;
}
/**
 * Resource type - represents a protected entity
 */
export interface Resource {
    readonly type: string;
    readonly id: ResourceId;
    readonly arn: string;
    readonly owner?: UserId;
    readonly attributes: Record<string, unknown>;
    readonly tags: Record<string, string>;
}
/**
 * Action type - represents an operation that can be performed
 */
export interface Action {
    readonly type: string;
    readonly operation: string;
    readonly scope?: string;
}
/**
 * Context type - provides additional contextual information for authorization
 */
export interface AuthorizationContext {
    readonly timestamp: Date;
    readonly ipAddress?: string;
    readonly userAgent?: string;
    readonly location?: {
        country?: string;
        region?: string;
    };
    readonly environment: 'development' | 'staging' | 'production';
    readonly customAttributes: Record<string, unknown>;
}
/**
 * Effect type for policy decisions
 */
export type Effect = 'Allow' | 'Deny';
/**
 * Permission action patterns using template literal types
 */
export type ResourceType = 'patient' | 'appointment' | 'prescription' | 'lab-result' | 'billing';
export type OperationType = 'create' | 'read' | 'update' | 'delete' | 'list' | 'search';
export type PermissionAction = `${ResourceType}:${OperationType}` | `${ResourceType}:*` | '*:*';
/**
 * Permission definition with strict typing
 */
export interface Permission {
    readonly id: PermissionId;
    readonly action: PermissionAction;
    readonly resource: string | string[];
    readonly effect: Effect;
    readonly conditions?: PolicyCondition[];
}
/**
 * Policy statement structure
 */
export interface PolicyStatement {
    readonly sid?: string;
    readonly effect: Effect;
    readonly principals?: string[];
    readonly actions: PermissionAction[];
    readonly resources: string[];
    readonly conditions?: PolicyCondition[];
}
/**
 * Complete policy document
 */
export interface PolicyDocument {
    readonly version: '2012-10-17' | '2025-01-01';
    readonly id?: PolicyId;
    readonly statements: ReadonlyArray<PolicyStatement>;
}
/**
 * Policy condition operators
 */
export type ConditionOperator = 'StringEquals' | 'StringNotEquals' | 'StringLike' | 'StringNotLike' | 'NumericEquals' | 'NumericNotEquals' | 'NumericLessThan' | 'NumericGreaterThan' | 'DateEquals' | 'DateNotEquals' | 'DateLessThan' | 'DateGreaterThan' | 'Bool' | 'IpAddress' | 'NotIpAddress';
/**
 * Policy condition structure
 */
export interface PolicyCondition {
    readonly operator: ConditionOperator;
    readonly key: string;
    readonly values: ReadonlyArray<string | number | boolean>;
}
/**
 * Role definition with permissions
 */
export interface Role {
    readonly id: RoleId;
    readonly name: string;
    readonly description?: string;
    readonly permissions: ReadonlyArray<PermissionId>;
    readonly policies: ReadonlyArray<PolicyDocument>;
    readonly inheritsFrom?: ReadonlyArray<RoleId>;
    readonly isSystem: boolean;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
/**
 * Group definition for organizing principals
 */
export interface Group {
    readonly id: GroupId;
    readonly name: string;
    readonly description?: string;
    readonly members: ReadonlyArray<UserId>;
    readonly roles: ReadonlyArray<RoleId>;
    readonly policies: ReadonlyArray<PolicyDocument>;
    readonly parentGroup?: GroupId;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
/**
 * Role assignment with time-based constraints
 */
export interface RoleAssignment {
    readonly userId: UserId;
    readonly roleId: RoleId;
    readonly grantedBy: UserId;
    readonly grantedAt: Date;
    readonly expiresAt?: Date;
    readonly scope?: {
        resources?: ResourceId[];
        conditions?: PolicyCondition[];
    };
}
/**
 * Attribute definition for ABAC
 */
export interface Attribute<T = unknown> {
    readonly key: string;
    readonly value: T;
    readonly type: 'string' | 'number' | 'boolean' | 'array' | 'object';
    readonly source: 'user' | 'resource' | 'environment' | 'context';
}
/**
 * Attribute set for ABAC evaluation
 */
export interface AttributeSet {
    readonly user: Record<string, Attribute>;
    readonly resource: Record<string, Attribute>;
    readonly environment: Record<string, Attribute>;
    readonly context: Record<string, Attribute>;
}
/**
 * ABAC rule for attribute-based authorization
 */
export interface ABACRule {
    readonly id: string;
    readonly name: string;
    readonly effect: Effect;
    readonly conditions: ReadonlyArray<AttributeCondition>;
}
/**
 * Attribute condition for ABAC rules
 */
export interface AttributeCondition {
    readonly attribute: string;
    readonly operator: ConditionOperator;
    readonly value: unknown;
}
/**
 * Authorization decision result
 */
export interface AuthorizationDecision {
    readonly decision: 'Allow' | 'Deny' | 'NotApplicable';
    readonly reasons: ReadonlyArray<string>;
    readonly matchedPolicies: ReadonlyArray<PolicyId>;
    readonly evaluatedAt: Date;
    readonly obligations?: ReadonlyArray<Obligation>;
}
/**
 * Obligation type for post-decision actions
 */
export interface Obligation {
    readonly type: 'log' | 'notify' | 'audit' | 'encrypt' | 'custom';
    readonly action: string;
    readonly parameters: Record<string, unknown>;
}
/**
 * Authorization request structure
 */
export interface AuthorizationRequest {
    readonly subject: Subject;
    readonly action: Action;
    readonly resource: Resource;
    readonly context: AuthorizationContext;
}
/**
 * User principal type
 */
export interface UserPrincipal {
    readonly kind: 'user';
    readonly userId: UserId;
    readonly email: string;
    readonly roles: ReadonlyArray<RoleId>;
}
/**
 * Service principal type
 */
export interface ServicePrincipal {
    readonly kind: 'service';
    readonly serviceId: string;
    readonly apiKey: string;
    readonly scopes: ReadonlyArray<string>;
}
/**
 * Anonymous principal type
 */
export interface AnonymousPrincipal {
    readonly kind: 'anonymous';
    readonly sessionId: string;
}
/**
 * Discriminated union of all principal types
 */
export type IAMPrincipal = UserPrincipal | ServicePrincipal | AnonymousPrincipal;
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
export declare const isUserPrincipal: (principal: IAMPrincipal) => principal is UserPrincipal;
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
export declare const isServicePrincipal: (principal: IAMPrincipal) => principal is ServicePrincipal;
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
export declare const isAnonymousPrincipal: (principal: IAMPrincipal) => principal is AnonymousPrincipal;
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
export declare const isUserId: (value: unknown) => value is UserId;
/**
 * Type guard for checking if a value is a valid RoleId
 *
 * @param {unknown} value - Value to check
 * @returns {boolean} True if value is a RoleId
 */
export declare const isRoleId: (value: unknown) => value is RoleId;
/**
 * Type guard for checking if a value is a valid PermissionId
 *
 * @param {unknown} value - Value to check
 * @returns {boolean} True if value is a PermissionId
 */
export declare const isPermissionId: (value: unknown) => value is PermissionId;
/**
 * Type guard for checking if effect is Allow
 *
 * @param {Effect} effect - Effect to check
 * @returns {boolean} True if effect is Allow
 */
export declare const isAllowEffect: (effect: Effect) => effect is "Allow";
/**
 * Type guard for checking if effect is Deny
 *
 * @param {Effect} effect - Effect to check
 * @returns {boolean} True if effect is Deny
 */
export declare const isDenyEffect: (effect: Effect) => effect is "Deny";
/**
 * Type guard for validating permission action format
 *
 * @param {string} action - Action string to validate
 * @returns {boolean} True if action is valid PermissionAction
 */
export declare const isValidPermissionAction: (action: string) => action is PermissionAction;
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
export declare const validatePolicyDocument: (policy: unknown) => policy is PolicyDocument;
/**
 * Validates a role structure
 *
 * @param {unknown} role - Role to validate
 * @returns {boolean} True if role is valid
 */
export declare const validateRole: (role: unknown) => role is Role;
/**
 * Validates a subject structure
 *
 * @param {unknown} subject - Subject to validate
 * @returns {boolean} True if subject is valid
 */
export declare const validateSubject: (subject: unknown) => subject is Subject;
/**
 * Validates a resource structure
 *
 * @param {unknown} resource - Resource to validate
 * @returns {boolean} True if resource is valid
 */
export declare const validateResource: (resource: unknown) => resource is Resource;
/**
 * Validates an authorization request
 *
 * @param {unknown} request - Request to validate
 * @returns {boolean} True if request is valid
 */
export declare const validateAuthorizationRequest: (request: unknown) => request is AuthorizationRequest;
/**
 * Extract action types from permission action
 */
export type ExtractResource<T extends PermissionAction> = T extends `${infer R}:${string}` ? R : never;
/**
 * Extract operation types from permission action
 */
export type ExtractOperation<T extends PermissionAction> = T extends `${string}:${infer O}` ? O : never;
/**
 * Check if action allows operation
 */
export type AllowsOperation<TAction extends PermissionAction, TOperation extends OperationType> = TAction extends `${string}:${TOperation}` ? true : TAction extends `${string}:*` ? true : TAction extends '*:*' ? true : false;
/**
 * Check if action allows resource
 */
export type AllowsResource<TAction extends PermissionAction, TResource extends ResourceType> = TAction extends `${TResource}:${string}` ? true : TAction extends `*:${string}` ? true : false;
/**
 * Permission checker type using conditional types
 */
export type PermissionChecker<TResource extends ResourceType, TOperation extends OperationType> = {
    readonly action: `${TResource}:${TOperation}`;
    readonly check: (subject: Subject) => boolean;
};
/**
 * Policy builder for type-safe policy construction
 */
export declare class PolicyBuilder {
    private statements;
    private policyId?;
    /**
     * Sets the policy ID
     */
    withId(id: PolicyId): this;
    /**
     * Adds an allow statement
     */
    allow(actions: PermissionAction[], resources: string[]): this;
    /**
     * Adds a deny statement
     */
    deny(actions: PermissionAction[], resources: string[]): this;
    /**
     * Adds conditions to the last statement
     */
    withConditions(conditions: PolicyCondition[]): this;
    /**
     * Builds the final policy document
     */
    build(): PolicyDocument;
}
/**
 * Role builder for type-safe role construction
 */
export declare class RoleBuilder {
    private roleId?;
    private name?;
    private description?;
    private permissions;
    private policies;
    private inheritsFrom;
    private isSystem;
    /**
     * Sets the role ID
     */
    withId(id: RoleId): this;
    /**
     * Sets the role name
     */
    withName(name: string): this;
    /**
     * Sets the role description
     */
    withDescription(description: string): this;
    /**
     * Adds permissions to the role
     */
    addPermissions(...permissions: PermissionId[]): this;
    /**
     * Adds policies to the role
     */
    addPolicies(...policies: PolicyDocument[]): this;
    /**
     * Sets role inheritance
     */
    inherits(...roles: RoleId[]): this;
    /**
     * Marks as system role
     */
    asSystem(): this;
    /**
     * Builds the final role
     */
    build(): Role;
}
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
export declare const createPolicyBuilder: () => PolicyBuilder;
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
export declare const createRoleBuilder: () => RoleBuilder;
/**
 * Infers the subject type from an authorization request
 */
export type InferSubject<T> = T extends {
    subject: infer S;
} ? S : never;
/**
 * Infers the resource type from an authorization request
 */
export type InferResource<T> = T extends {
    resource: infer R;
} ? R : never;
/**
 * Infers the action type from an authorization request
 */
export type InferAction<T> = T extends {
    action: infer A;
} ? A : never;
/**
 * Maps permission to required attributes
 */
export type RequiredAttributes<T extends PermissionAction> = {
    resource: ExtractResource<T>;
    operation: ExtractOperation<T>;
};
/**
 * Extracts all permissions from a role
 *
 * @param {Role} role - Role to extract permissions from
 * @returns {ReadonlyArray<PermissionId>} Array of permission IDs
 */
export declare const extractPermissions: (role: Role) => ReadonlyArray<PermissionId>;
/**
 * Extracts all actions from a policy document
 *
 * @param {PolicyDocument} policy - Policy to extract actions from
 * @returns {ReadonlyArray<PermissionAction>} Array of actions
 */
export declare const extractActions: (policy: PolicyDocument) => ReadonlyArray<PermissionAction>;
/**
 * Extracts all resources from a policy document
 *
 * @param {PolicyDocument} policy - Policy to extract resources from
 * @returns {ReadonlyArray<string>} Array of resource ARNs
 */
export declare const extractResources: (policy: PolicyDocument) => ReadonlyArray<string>;
/**
 * Type-level permission checker
 */
export type HasPermission<TSubject extends {
    roles: ReadonlyArray<RoleId>;
}, TRequiredRole extends RoleId> = TSubject['roles'] extends ReadonlyArray<infer R> ? R extends TRequiredRole ? true : false : false;
/**
 * Runtime permission checker with type safety
 *
 * @param {Subject} subject - Subject to check
 * @param {PermissionId} permission - Required permission
 * @returns {boolean} True if subject has permission
 */
export declare const hasPermission: (subject: Subject, permission: PermissionId) => boolean;
/**
 * Runtime role checker with type safety
 *
 * @param {Subject} subject - Subject to check
 * @param {RoleId} role - Required role
 * @returns {boolean} True if subject has role
 */
export declare const hasRole: (subject: Subject, role: RoleId) => boolean;
/**
 * Checks if subject has any of the specified roles
 *
 * @param {Subject} subject - Subject to check
 * @param {RoleId[]} roles - Required roles (any)
 * @returns {boolean} True if subject has any role
 */
export declare const hasAnyRole: (subject: Subject, roles: RoleId[]) => boolean;
/**
 * Checks if subject has all of the specified roles
 *
 * @param {Subject} subject - Subject to check
 * @param {RoleId[]} roles - Required roles (all)
 * @returns {boolean} True if subject has all roles
 */
export declare const hasAllRoles: (subject: Subject, roles: RoleId[]) => boolean;
/**
 * Makes all properties of T mutable
 */
export type Mutable<T> = {
    -readonly [P in keyof T]: T[P];
};
/**
 * Deep partial type
 */
export type DeepPartial<T> = {
    [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};
/**
 * Deep readonly type
 */
export type DeepReadonly<T> = {
    readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};
/**
 * Requires at least one property from T
 */
export type RequireAtLeastOne<T, Keys extends keyof T = keyof T> = Pick<T, Exclude<keyof T, Keys>> & {
    [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>;
}[Keys];
/**
 * Requires exactly one property from T
 */
export type RequireExactlyOne<T, Keys extends keyof T = keyof T> = Pick<T, Exclude<keyof T, Keys>> & {
    [K in Keys]-?: Required<Pick<T, K>> & Partial<Record<Exclude<Keys, K>, never>>;
}[Keys];
/**
 * Merge two types
 */
export type Merge<T, U> = Omit<T, keyof U> & U;
/**
 * Extract keys of T where value extends V
 */
export type KeysOfType<T, V> = {
    [K in keyof T]: T[K] extends V ? K : never;
}[keyof T];
/**
 * Creates a strict subject from partial data
 *
 * @param {Partial<Subject>} data - Partial subject data
 * @returns {Subject} Complete subject
 */
export declare const createSubject: (data: RequireAtLeastOne<Subject, "id" | "name">) => Subject;
/**
 * Creates a resource from partial data
 *
 * @param {Partial<Resource>} data - Partial resource data
 * @returns {Resource} Complete resource
 */
export declare const createResource: (data: RequireAtLeastOne<Resource, "type" | "id" | "arn">) => Resource;
declare const _default: {
    createUserId: (id: string) => UserId;
    createRoleId: (id: string) => RoleId;
    createPermissionId: (id: string) => PermissionId;
    createResourceId: (id: string) => ResourceId;
    createGroupId: (id: string) => GroupId;
    createPolicyId: (id: string) => PolicyId;
    isUserPrincipal: (principal: IAMPrincipal) => principal is UserPrincipal;
    isServicePrincipal: (principal: IAMPrincipal) => principal is ServicePrincipal;
    isAnonymousPrincipal: (principal: IAMPrincipal) => principal is AnonymousPrincipal;
    isUserId: (value: unknown) => value is UserId;
    isRoleId: (value: unknown) => value is RoleId;
    isPermissionId: (value: unknown) => value is PermissionId;
    isAllowEffect: (effect: Effect) => effect is "Allow";
    isDenyEffect: (effect: Effect) => effect is "Deny";
    isValidPermissionAction: (action: string) => action is PermissionAction;
    validatePolicyDocument: (policy: unknown) => policy is PolicyDocument;
    validateRole: (role: unknown) => role is Role;
    validateSubject: (subject: unknown) => subject is Subject;
    validateResource: (resource: unknown) => resource is Resource;
    validateAuthorizationRequest: (request: unknown) => request is AuthorizationRequest;
    createPolicyBuilder: () => PolicyBuilder;
    createRoleBuilder: () => RoleBuilder;
    extractPermissions: (role: Role) => ReadonlyArray<PermissionId>;
    extractActions: (policy: PolicyDocument) => ReadonlyArray<PermissionAction>;
    extractResources: (policy: PolicyDocument) => ReadonlyArray<string>;
    hasPermission: (subject: Subject, permission: PermissionId) => boolean;
    hasRole: (subject: Subject, role: RoleId) => boolean;
    hasAnyRole: (subject: Subject, roles: RoleId[]) => boolean;
    hasAllRoles: (subject: Subject, roles: RoleId[]) => boolean;
    createSubject: (data: RequireAtLeastOne<Subject, "id" | "name">) => Subject;
    createResource: (data: RequireAtLeastOne<Resource, "type" | "id" | "arn">) => Resource;
};
export default _default;
//# sourceMappingURL=iam-types-kit.d.ts.map