/**
 * @fileoverview IAM Attribute-Based Access Control (ABAC) Kit
 * @module reuse/iam-abac-kit
 * @description Comprehensive ABAC utilities with deep Sequelize integration for policy evaluation,
 * attribute providers, context builders, dynamic attribute resolution, and policy simulation.
 *
 * Key Features:
 * - Policy evaluation engine with complex conditions
 * - Attribute providers with caching and lazy loading
 * - Context builders for request evaluation
 * - Policy language parser and compiler
 * - Condition evaluators with operators
 * - Dynamic attribute resolution from Sequelize models
 * - Policy simulation and testing
 * - Multi-tenancy and resource-based policies
 * - Time-based and location-based access
 * - Hierarchical resource policies
 *
 * @target Sequelize v6.x, Node 18+, TypeScript 5.x
 *
 * @security
 * - HIPAA-compliant attribute-based access
 * - Fine-grained resource access control
 * - Attribute encryption and masking
 * - Policy audit trails
 * - Context validation and sanitization
 *
 * @example Basic usage
 * ```typescript
 * import { evaluatePolicy, buildContext, createAttributeProvider } from './iam-abac-kit';
 *
 * // Build context
 * const context = await buildContext(user, resource, action);
 *
 * // Evaluate policy
 * const allowed = await evaluatePolicy(policy, context);
 * ```
 *
 * @example Advanced usage
 * ```typescript
 * import {
 *   createDynamicAttributeProvider,
 *   compilePolicyExpression,
 *   simulatePolicy
 * } from './iam-abac-kit';
 *
 * // Create attribute provider
 * const provider = createDynamicAttributeProvider(User, {
 *   department: 'department.name',
 *   role: 'roles[0].name'
 * });
 *
 * // Simulate policy
 * const result = await simulatePolicy(policy, testCases);
 * ```
 *
 * LOC: ABAC7823Z567
 * UPSTREAM: sequelize, @types/sequelize
 * DOWNSTREAM: IAM services, authorization middleware, policy management
 *
 * @version 1.0.0
 * @since 2025-11-08
 */
import { Model, ModelStatic, Transaction, IncludeOptions } from 'sequelize';
/**
 * @interface PolicyModel
 * @description ABAC policy model
 */
export interface PolicyModel extends Model {
    id: string;
    name: string;
    description?: string;
    effect: 'allow' | 'deny';
    resources: string[];
    actions: string[];
    conditions?: PolicyCondition[];
    priority: number;
    isActive: boolean;
    tenantId?: string;
    metadata?: Record<string, any>;
}
/**
 * @interface PolicyCondition
 * @description Policy condition structure
 */
export interface PolicyCondition {
    /** Attribute path */
    attribute: string;
    /** Comparison operator */
    operator: PolicyOperator;
    /** Value to compare */
    value: any;
    /** Logical operator for combining */
    logicalOp?: 'AND' | 'OR';
}
/**
 * @type PolicyOperator
 * @description Supported comparison operators
 */
export type PolicyOperator = 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'notIn' | 'contains' | 'startsWith' | 'endsWith' | 'matches' | 'exists' | 'notExists';
/**
 * @interface EvaluationContext
 * @description Context for policy evaluation
 */
export interface EvaluationContext {
    /** Subject (user) attributes */
    subject: Record<string, any>;
    /** Resource attributes */
    resource: Record<string, any>;
    /** Action being performed */
    action: string;
    /** Environment attributes */
    environment: Record<string, any>;
    /** Tenant context */
    tenant?: string;
    /** Request metadata */
    request?: Record<string, any>;
}
/**
 * @interface AttributeProvider
 * @description Attribute provider interface
 */
export interface AttributeProvider {
    /** Provider name */
    name: string;
    /** Get attributes for subject */
    getAttributes: (subjectId: string) => Promise<Record<string, any>>;
    /** Cache TTL in seconds */
    cacheTTL?: number;
}
/**
 * @interface PolicyEvaluationResult
 * @description Result of policy evaluation
 */
export interface PolicyEvaluationResult {
    /** Evaluation decision */
    decision: 'allow' | 'deny' | 'not_applicable';
    /** Matched policy ID */
    policyId?: string;
    /** Evaluation reason */
    reason?: string;
    /** Matched conditions */
    matchedConditions?: PolicyCondition[];
    /** Evaluation metadata */
    metadata?: Record<string, any>;
}
/**
 * @interface AttributeMapping
 * @description Maps attribute paths to model associations
 */
export interface AttributeMapping {
    /** Attribute name */
    [key: string]: string | AttributeResolver;
}
/**
 * @type AttributeResolver
 * @description Function to resolve an attribute
 */
export type AttributeResolver = (instance: any) => Promise<any> | any;
/**
 * @interface ContextBuilderOptions
 * @description Options for building evaluation context
 */
export interface ContextBuilderOptions {
    /** Include user attributes */
    includeUser?: boolean;
    /** Include resource attributes */
    includeResource?: boolean;
    /** Include environment attributes */
    includeEnvironment?: boolean;
    /** Attribute providers */
    providers?: AttributeProvider[];
    /** Custom resolvers */
    resolvers?: Record<string, AttributeResolver>;
}
/**
 * @interface PolicySimulationCase
 * @description Test case for policy simulation
 */
export interface PolicySimulationCase {
    /** Test case name */
    name: string;
    /** Evaluation context */
    context: EvaluationContext;
    /** Expected result */
    expectedDecision: 'allow' | 'deny' | 'not_applicable';
}
/**
 * @interface PolicySimulationResult
 * @description Result of policy simulation
 */
export interface PolicySimulationResult {
    /** Test case name */
    name: string;
    /** Actual decision */
    actualDecision: 'allow' | 'deny' | 'not_applicable';
    /** Expected decision */
    expectedDecision: 'allow' | 'deny' | 'not_applicable';
    /** Test passed */
    passed: boolean;
    /** Evaluation details */
    details: PolicyEvaluationResult;
}
/**
 * @interface CompiledPolicy
 * @description Compiled policy for efficient evaluation
 */
export interface CompiledPolicy {
    /** Policy ID */
    id: string;
    /** Effect */
    effect: 'allow' | 'deny';
    /** Compiled condition function */
    conditionFn: (context: EvaluationContext) => boolean;
    /** Resource patterns */
    resourcePatterns: RegExp[];
    /** Action patterns */
    actionPatterns: RegExp[];
    /** Priority */
    priority: number;
}
/**
 * @function evaluatePolicy
 * @description Evaluates a policy against a context
 *
 * @param {PolicyModel} policy - Policy to evaluate
 * @param {EvaluationContext} context - Evaluation context
 * @returns {Promise<PolicyEvaluationResult>} Evaluation result
 *
 * @example
 * ```typescript
 * const result = await evaluatePolicy(policy, {
 *   subject: { department: 'cardiology', role: 'doctor' },
 *   resource: { type: 'patient-record', department: 'cardiology' },
 *   action: 'read',
 *   environment: { time: new Date() }
 * });
 * ```
 */
export declare function evaluatePolicy(policy: PolicyModel, context: EvaluationContext): Promise<PolicyEvaluationResult>;
/**
 * @function evaluatePolicies
 * @description Evaluates multiple policies and returns final decision
 *
 * @param {ModelStatic<PolicyModel>} Policy - Policy model
 * @param {EvaluationContext} context - Evaluation context
 * @param {object} options - Evaluation options
 * @returns {Promise<PolicyEvaluationResult>} Final evaluation result
 *
 * @example
 * ```typescript
 * const result = await evaluatePolicies(Policy, context, {
 *   tenantId: 'hospital-1',
 *   combineAlgorithm: 'deny-overrides'
 * });
 * ```
 */
export declare function evaluatePolicies(Policy: ModelStatic<PolicyModel>, context: EvaluationContext, options?: {
    tenantId?: string;
    combineAlgorithm?: 'deny-overrides' | 'allow-overrides' | 'first-applicable';
}): Promise<PolicyEvaluationResult>;
/**
 * @function combinePolicyResults
 * @description Combines multiple policy evaluation results
 *
 * @param {PolicyEvaluationResult[]} results - Array of results
 * @param {string} algorithm - Combination algorithm
 * @returns {PolicyEvaluationResult} Combined result
 *
 * @example
 * ```typescript
 * const combined = combinePolicyResults(results, 'deny-overrides');
 * ```
 */
export declare function combinePolicyResults(results: PolicyEvaluationResult[], algorithm: 'deny-overrides' | 'allow-overrides' | 'first-applicable'): PolicyEvaluationResult;
/**
 * @function evaluateConditions
 * @description Evaluates policy conditions against context
 *
 * @param {PolicyCondition[]} conditions - Conditions to evaluate
 * @param {EvaluationContext} context - Evaluation context
 * @returns {Promise<boolean>} True if all conditions match
 *
 * @example
 * ```typescript
 * const match = await evaluateConditions([
 *   { attribute: 'subject.department', operator: 'eq', value: 'cardiology' },
 *   { attribute: 'subject.clearance', operator: 'gte', value: 3, logicalOp: 'AND' }
 * ], context);
 * ```
 */
export declare function evaluateConditions(conditions: PolicyCondition[], context: EvaluationContext): Promise<boolean>;
/**
 * @function evaluateCondition
 * @description Evaluates a single condition
 *
 * @param {PolicyCondition} condition - Condition to evaluate
 * @param {EvaluationContext} context - Evaluation context
 * @returns {boolean} True if condition matches
 *
 * @example
 * ```typescript
 * const match = evaluateCondition(
 *   { attribute: 'subject.role', operator: 'eq', value: 'doctor' },
 *   context
 * );
 * ```
 */
export declare function evaluateCondition(condition: PolicyCondition, context: EvaluationContext): boolean;
/**
 * @function getAttributeValue
 * @description Extracts attribute value from context using path
 *
 * @param {string} path - Attribute path (e.g., 'subject.department')
 * @param {EvaluationContext} context - Evaluation context
 * @returns {any} Attribute value
 *
 * @example
 * ```typescript
 * const dept = getAttributeValue('subject.department', context);
 * const resourceId = getAttributeValue('resource.id', context);
 * ```
 */
export declare function getAttributeValue(path: string, context: EvaluationContext): any;
/**
 * @function matchesPattern
 * @description Checks if a value matches any pattern
 *
 * @param {string} value - Value to check
 * @param {string[]} patterns - Patterns (support wildcards)
 * @returns {boolean} True if matches
 *
 * @example
 * ```typescript
 * matchesPattern('patient-records', ['patient-*', 'medical-*']); // true
 * matchesPattern('billing', ['patient-*', 'medical-*']); // false
 * ```
 */
export declare function matchesPattern(value: string, patterns: string[]): boolean;
/**
 * @function createAttributeProvider
 * @description Creates a basic attribute provider
 *
 * @param {string} name - Provider name
 * @param {Function} getAttributes - Attribute getter function
 * @param {number} cacheTTL - Cache TTL in seconds
 * @returns {AttributeProvider} Attribute provider
 *
 * @example
 * ```typescript
 * const provider = createAttributeProvider(
 *   'user-attributes',
 *   async (userId) => {
 *     const user = await User.findByPk(userId);
 *     return { department: user.department, role: user.role };
 *   },
 *   300
 * );
 * ```
 */
export declare function createAttributeProvider(name: string, getAttributes: (subjectId: string) => Promise<Record<string, any>>, cacheTTL?: number): AttributeProvider;
/**
 * @function createSequelizeAttributeProvider
 * @description Creates an attribute provider from Sequelize model
 *
 * @param {ModelStatic<any>} Model - Sequelize model
 * @param {AttributeMapping} mapping - Attribute mapping
 * @param {IncludeOptions[]} includes - Associations to include
 * @returns {AttributeProvider} Attribute provider
 *
 * @example
 * ```typescript
 * const provider = createSequelizeAttributeProvider(
 *   User,
 *   {
 *     department: 'department.name',
 *     role: 'primaryRole.name',
 *     clearance: 'securityClearance'
 *   },
 *   [
 *     { model: Department, as: 'department' },
 *     { model: Role, as: 'primaryRole' }
 *   ]
 * );
 * ```
 */
export declare function createSequelizeAttributeProvider(Model: ModelStatic<any>, mapping: AttributeMapping, includes?: IncludeOptions[]): AttributeProvider;
/**
 * @function createDynamicAttributeProvider
 * @description Creates a dynamic attribute provider with lazy loading
 *
 * @param {ModelStatic<any>} Model - Sequelize model
 * @param {AttributeMapping} mapping - Attribute mapping
 * @param {object} options - Provider options
 * @returns {AttributeProvider} Dynamic attribute provider
 *
 * @example
 * ```typescript
 * const provider = createDynamicAttributeProvider(User, {
 *   roles: async (user) => {
 *     const roles = await user.getRoles();
 *     return roles.map(r => r.name);
 *   },
 *   permissions: async (user) => {
 *     const perms = await user.getPermissions();
 *     return perms.map(p => `${p.resource}:${p.action}`);
 *   }
 * });
 * ```
 */
export declare function createDynamicAttributeProvider(Model: ModelStatic<any>, mapping: AttributeMapping, options?: {
    cacheTTL?: number;
}): AttributeProvider;
/**
 * @function createCachedAttributeProvider
 * @description Wraps an attribute provider with caching
 *
 * @param {AttributeProvider} provider - Base provider
 * @param {number} cacheTTL - Cache TTL in seconds
 * @returns {AttributeProvider} Cached provider
 *
 * @example
 * ```typescript
 * const cachedProvider = createCachedAttributeProvider(baseProvider, 600);
 * ```
 */
export declare function createCachedAttributeProvider(provider: AttributeProvider, cacheTTL?: number): AttributeProvider;
/**
 * @function mergeAttributeProviders
 * @description Merges multiple attribute providers
 *
 * @param {AttributeProvider[]} providers - Providers to merge
 * @returns {AttributeProvider} Merged provider
 *
 * @example
 * ```typescript
 * const merged = mergeAttributeProviders([
 *   userProvider,
 *   roleProvider,
 *   departmentProvider
 * ]);
 * ```
 */
export declare function mergeAttributeProviders(providers: AttributeProvider[]): AttributeProvider;
/**
 * @function getNestedValue
 * @description Gets nested value from object using path
 *
 * @param {any} obj - Object
 * @param {string} path - Path (e.g., 'department.name')
 * @returns {any} Value
 *
 * @example
 * ```typescript
 * const deptName = getNestedValue(user, 'department.name');
 * ```
 */
export declare function getNestedValue(obj: any, path: string): any;
/**
 * @function buildContext
 * @description Builds evaluation context from subject, resource, and action
 *
 * @param {any} subject - Subject (user)
 * @param {any} resource - Resource
 * @param {string} action - Action
 * @param {ContextBuilderOptions} options - Builder options
 * @returns {Promise<EvaluationContext>} Evaluation context
 *
 * @example
 * ```typescript
 * const context = await buildContext(user, patientRecord, 'read', {
 *   providers: [userProvider, resourceProvider],
 *   includeEnvironment: true
 * });
 * ```
 */
export declare function buildContext(subject: any, resource: any, action: string, options?: ContextBuilderOptions): Promise<EvaluationContext>;
/**
 * @function buildContextFromModels
 * @description Builds context from Sequelize models with associations
 *
 * @param {ModelStatic<any>} UserModel - User model
 * @param {ModelStatic<any>} ResourceModel - Resource model
 * @param {string} userId - User ID
 * @param {string} resourceId - Resource ID
 * @param {string} action - Action
 * @param {object} options - Builder options
 * @returns {Promise<EvaluationContext>} Evaluation context
 *
 * @example
 * ```typescript
 * const context = await buildContextFromModels(
 *   User,
 *   PatientRecord,
 *   'user-123',
 *   'record-456',
 *   'read',
 *   {
 *     userIncludes: [{ model: Department }, { model: Role }],
 *     resourceIncludes: [{ model: Patient }]
 *   }
 * );
 * ```
 */
export declare function buildContextFromModels(UserModel: ModelStatic<any>, ResourceModel: ModelStatic<any>, userId: string, resourceId: string, action: string, options?: {
    userIncludes?: IncludeOptions[];
    resourceIncludes?: IncludeOptions[];
    providers?: AttributeProvider[];
}): Promise<EvaluationContext>;
/**
 * @function enrichContext
 * @description Enriches an existing context with additional attributes
 *
 * @param {EvaluationContext} context - Base context
 * @param {AttributeProvider[]} providers - Attribute providers
 * @returns {Promise<EvaluationContext>} Enriched context
 *
 * @example
 * ```typescript
 * const enriched = await enrichContext(baseContext, [
 *   roleProvider,
 *   permissionProvider
 * ]);
 * ```
 */
export declare function enrichContext(context: EvaluationContext, providers: AttributeProvider[]): Promise<EvaluationContext>;
/**
 * @function buildRequestContext
 * @description Builds context from HTTP request
 *
 * @param {any} req - HTTP request object
 * @param {any} resource - Resource
 * @param {string} action - Action
 * @returns {EvaluationContext} Evaluation context
 *
 * @example
 * ```typescript
 * const context = buildRequestContext(req, patientRecord, 'update');
 * ```
 */
export declare function buildRequestContext(req: any, resource: any, action: string): EvaluationContext;
/**
 * @function compilePolicyExpression
 * @description Compiles a policy expression to executable function
 *
 * @param {string} expression - Policy expression
 * @returns {Function} Compiled function
 *
 * @example
 * ```typescript
 * const fn = compilePolicyExpression(
 *   "subject.department == resource.department && subject.clearance >= 3"
 * );
 * const allowed = fn(context);
 * ```
 */
export declare function compilePolicyExpression(expression: string): (context: EvaluationContext) => boolean;
/**
 * @function compilePolicy
 * @description Compiles a policy for efficient evaluation
 *
 * @param {PolicyModel} policy - Policy to compile
 * @returns {CompiledPolicy} Compiled policy
 *
 * @example
 * ```typescript
 * const compiled = compilePolicy(policy);
 * const allowed = compiled.conditionFn(context);
 * ```
 */
export declare function compilePolicy(policy: PolicyModel): CompiledPolicy;
/**
 * @function parsePolicyLanguage
 * @description Parses policy language to policy conditions
 *
 * @param {string} policyText - Policy in DSL format
 * @returns {PolicyCondition[]} Parsed conditions
 *
 * @example
 * ```typescript
 * const conditions = parsePolicyLanguage(`
 *   subject.department = resource.department AND
 *   subject.role IN ['doctor', 'nurse'] AND
 *   environment.hour >= 8 AND environment.hour <= 18
 * `);
 * ```
 */
export declare function parsePolicyLanguage(policyText: string): PolicyCondition[];
/**
 * @function simulatePolicy
 * @description Simulates policy against test cases
 *
 * @param {PolicyModel} policy - Policy to simulate
 * @param {PolicySimulationCase[]} testCases - Test cases
 * @returns {Promise<PolicySimulationResult[]>} Simulation results
 *
 * @example
 * ```typescript
 * const results = await simulatePolicy(policy, [
 *   {
 *     name: 'Same department access',
 *     context: { ... },
 *     expectedDecision: 'allow'
 *   },
 *   {
 *     name: 'Different department',
 *     context: { ... },
 *     expectedDecision: 'deny'
 *   }
 * ]);
 * ```
 */
export declare function simulatePolicy(policy: PolicyModel, testCases: PolicySimulationCase[]): Promise<PolicySimulationResult[]>;
/**
 * @function generateTestCases
 * @description Generates test cases for policy coverage
 *
 * @param {PolicyModel} policy - Policy
 * @returns {PolicySimulationCase[]} Generated test cases
 *
 * @example
 * ```typescript
 * const testCases = generateTestCases(policy);
 * const results = await simulatePolicy(policy, testCases);
 * ```
 */
export declare function generateTestCases(policy: PolicyModel): PolicySimulationCase[];
/**
 * @function analyzePolicyCoverage
 * @description Analyzes test coverage for policies
 *
 * @param {PolicyModel[]} policies - Policies to analyze
 * @param {PolicySimulationCase[]} testCases - Test cases
 * @returns {Promise<any>} Coverage report
 *
 * @example
 * ```typescript
 * const coverage = await analyzePolicyCoverage(policies, testCases);
 * console.log(`Coverage: ${coverage.percentage}%`);
 * ```
 */
export declare function analyzePolicyCoverage(policies: PolicyModel[], testCases: PolicySimulationCase[]): Promise<any>;
/**
 * @function createResourcePolicy
 * @description Creates a resource-specific policy
 *
 * @param {ModelStatic<PolicyModel>} Policy - Policy model
 * @param {string} resourceType - Resource type
 * @param {string} resourceId - Resource ID
 * @param {object} policyData - Policy data
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<PolicyModel>} Created policy
 *
 * @example
 * ```typescript
 * const policy = await createResourcePolicy(Policy, 'patient-record', 'record-123', {
 *   effect: 'allow',
 *   actions: ['read', 'update'],
 *   conditions: [
 *     { attribute: 'subject.department', operator: 'eq', value: 'cardiology' }
 *   ]
 * });
 * ```
 */
export declare function createResourcePolicy(Policy: ModelStatic<PolicyModel>, resourceType: string, resourceId: string, policyData: {
    name?: string;
    effect: 'allow' | 'deny';
    actions: string[];
    conditions?: PolicyCondition[];
}, transaction?: Transaction): Promise<PolicyModel>;
/**
 * @function getResourcePolicies
 * @description Gets all policies for a specific resource
 *
 * @param {ModelStatic<PolicyModel>} Policy - Policy model
 * @param {string} resourceType - Resource type
 * @param {string} resourceId - Resource ID
 * @returns {Promise<PolicyModel[]>} Resource policies
 *
 * @example
 * ```typescript
 * const policies = await getResourcePolicies(
 *   Policy,
 *   'patient-record',
 *   'record-123'
 * );
 * ```
 */
export declare function getResourcePolicies(Policy: ModelStatic<PolicyModel>, resourceType: string, resourceId: string): Promise<PolicyModel[]>;
/**
 * @function evaluateResourceAccess
 * @description Evaluates access to a specific resource
 *
 * @param {ModelStatic<PolicyModel>} Policy - Policy model
 * @param {string} userId - User ID
 * @param {string} resourceType - Resource type
 * @param {string} resourceId - Resource ID
 * @param {string} action - Action
 * @param {AttributeProvider[]} providers - Attribute providers
 * @returns {Promise<PolicyEvaluationResult>} Evaluation result
 *
 * @example
 * ```typescript
 * const result = await evaluateResourceAccess(
 *   Policy,
 *   'user-123',
 *   'patient-record',
 *   'record-456',
 *   'read',
 *   [userProvider]
 * );
 * ```
 */
export declare function evaluateResourceAccess(Policy: ModelStatic<PolicyModel>, userId: string, resourceType: string, resourceId: string, action: string, providers?: AttributeProvider[]): Promise<PolicyEvaluationResult>;
/**
 * @function createTimeBasedPolicy
 * @description Creates a time-based access policy
 *
 * @param {ModelStatic<PolicyModel>} Policy - Policy model
 * @param {object} timeConstraints - Time constraints
 * @param {object} policyData - Policy data
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<PolicyModel>} Created policy
 *
 * @example
 * ```typescript
 * const policy = await createTimeBasedPolicy(Policy, {
 *   startHour: 8,
 *   endHour: 18,
 *   daysOfWeek: [1, 2, 3, 4, 5] // Mon-Fri
 * }, {
 *   resources: ['patient-records'],
 *   actions: ['read', 'update'],
 *   effect: 'allow'
 * });
 * ```
 */
export declare function createTimeBasedPolicy(Policy: ModelStatic<PolicyModel>, timeConstraints: {
    startHour?: number;
    endHour?: number;
    daysOfWeek?: number[];
}, policyData: {
    name?: string;
    resources: string[];
    actions: string[];
    effect: 'allow' | 'deny';
}, transaction?: Transaction): Promise<PolicyModel>;
/**
 * @function createLocationBasedPolicy
 * @description Creates a location-based access policy
 *
 * @param {ModelStatic<PolicyModel>} Policy - Policy model
 * @param {string[]} allowedLocations - Allowed IP ranges or locations
 * @param {object} policyData - Policy data
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<PolicyModel>} Created policy
 *
 * @example
 * ```typescript
 * const policy = await createLocationBasedPolicy(Policy, [
 *   '192.168.1.*',
 *   '10.0.0.*'
 * ], {
 *   resources: ['patient-records'],
 *   actions: ['*'],
 *   effect: 'allow'
 * });
 * ```
 */
export declare function createLocationBasedPolicy(Policy: ModelStatic<PolicyModel>, allowedLocations: string[], policyData: {
    name?: string;
    resources: string[];
    actions: string[];
    effect: 'allow' | 'deny';
}, transaction?: Transaction): Promise<PolicyModel>;
/**
 * @function clonePolicy
 * @description Creates a copy of an existing policy
 *
 * @param {ModelStatic<PolicyModel>} Policy - Policy model
 * @param {string} policyId - Source policy ID
 * @param {object} overrides - Property overrides
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<PolicyModel>} Cloned policy
 *
 * @example
 * ```typescript
 * const newPolicy = await clonePolicy(Policy, 'policy-123', {
 *   name: 'Cloned Policy',
 *   tenantId: 'new-tenant'
 * });
 * ```
 */
export declare function clonePolicy(Policy: ModelStatic<PolicyModel>, policyId: string, overrides?: Partial<PolicyModel>, transaction?: Transaction): Promise<PolicyModel>;
/**
 * @function validatePolicy
 * @description Validates policy structure and syntax
 *
 * @param {PolicyModel | any} policy - Policy to validate
 * @returns {object} Validation result
 *
 * @example
 * ```typescript
 * const validation = validatePolicy(policy);
 * if (!validation.valid) {
 *   console.error(validation.errors);
 * }
 * ```
 */
export declare function validatePolicy(policy: PolicyModel | any): {
    valid: boolean;
    errors: string[];
};
/**
 * @function optimizePolicies
 * @description Optimizes policies by removing duplicates and conflicts
 *
 * @param {ModelStatic<PolicyModel>} Policy - Policy model
 * @param {string} tenantId - Optional tenant ID
 * @returns {Promise<{ removed: number; optimized: number }>} Optimization result
 *
 * @example
 * ```typescript
 * const result = await optimizePolicies(Policy);
 * console.log(`Removed ${result.removed} duplicate policies`);
 * ```
 */
export declare function optimizePolicies(Policy: ModelStatic<PolicyModel>, tenantId?: string): Promise<{
    removed: number;
    optimized: number;
}>;
/**
 * @function getPolicyDependencies
 * @description Gets dependencies between policies
 *
 * @param {ModelStatic<PolicyModel>} Policy - Policy model
 * @param {string} policyId - Policy ID
 * @returns {Promise<PolicyModel[]>} Dependent policies
 *
 * @example
 * ```typescript
 * const dependencies = await getPolicyDependencies(Policy, 'policy-123');
 * ```
 */
export declare function getPolicyDependencies(Policy: ModelStatic<PolicyModel>, policyId: string): Promise<PolicyModel[]>;
/**
 * @function exportPolicyToJson
 * @description Exports a policy to JSON format
 *
 * @param {PolicyModel} policy - Policy to export
 * @returns {string} JSON string
 *
 * @example
 * ```typescript
 * const json = exportPolicyToJson(policy);
 * fs.writeFileSync('policy.json', json);
 * ```
 */
export declare function exportPolicyToJson(policy: PolicyModel): string;
/**
 * @function importPolicyFromJson
 * @description Imports a policy from JSON
 *
 * @param {ModelStatic<PolicyModel>} Policy - Policy model
 * @param {string} jsonString - JSON string
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<PolicyModel>} Created policy
 *
 * @example
 * ```typescript
 * const json = fs.readFileSync('policy.json', 'utf8');
 * const policy = await importPolicyFromJson(Policy, json);
 * ```
 */
export declare function importPolicyFromJson(Policy: ModelStatic<PolicyModel>, jsonString: string, transaction?: Transaction): Promise<PolicyModel>;
/**
 * @function evaluateBatchContexts
 * @description Evaluates a policy against multiple contexts
 *
 * @param {PolicyModel} policy - Policy to evaluate
 * @param {EvaluationContext[]} contexts - Contexts to evaluate
 * @returns {Promise<PolicyEvaluationResult[]>} Evaluation results
 *
 * @example
 * ```typescript
 * const results = await evaluateBatchContexts(policy, [context1, context2, context3]);
 * ```
 */
export declare function evaluateBatchContexts(policy: PolicyModel, contexts: EvaluationContext[]): Promise<PolicyEvaluationResult[]>;
/**
 * @function createConditionalPolicy
 * @description Creates a policy with complex conditional logic
 *
 * @param {ModelStatic<PolicyModel>} Policy - Policy model
 * @param {object} policyData - Policy data with conditions
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<PolicyModel>} Created policy
 *
 * @example
 * ```typescript
 * const policy = await createConditionalPolicy(Policy, {
 *   name: 'Department Access',
 *   effect: 'allow',
 *   resources: ['patient-records'],
 *   actions: ['read'],
 *   conditions: [
 *     { attribute: 'subject.department', operator: 'eq', value: 'cardiology' },
 *     { attribute: 'resource.department', operator: 'eq', value: 'cardiology', logicalOp: 'AND' }
 *   ]
 * });
 * ```
 */
export declare function createConditionalPolicy(Policy: ModelStatic<PolicyModel>, policyData: {
    name: string;
    description?: string;
    effect: 'allow' | 'deny';
    resources: string[];
    actions: string[];
    conditions: PolicyCondition[];
    priority?: number;
}, transaction?: Transaction): Promise<PolicyModel>;
/**
 * @function getPolicyConflicts
 * @description Detects conflicts between policies
 *
 * @param {ModelStatic<PolicyModel>} Policy - Policy model
 * @param {string} tenantId - Optional tenant ID
 * @returns {Promise<Array<{ policy1: PolicyModel; policy2: PolicyModel; reason: string }>>} Conflicts
 *
 * @example
 * ```typescript
 * const conflicts = await getPolicyConflicts(Policy);
 * conflicts.forEach(c => console.log(`Conflict: ${c.reason}`));
 * ```
 */
export declare function getPolicyConflicts(Policy: ModelStatic<PolicyModel>, tenantId?: string): Promise<Array<{
    policy1: PolicyModel;
    policy2: PolicyModel;
    reason: string;
}>>;
/**
 * @function evaluateWithAttributeCache
 * @description Evaluates policies with attribute caching
 *
 * @param {ModelStatic<PolicyModel>} Policy - Policy model
 * @param {EvaluationContext} context - Evaluation context
 * @param {Map<string, any>} cache - Attribute cache
 * @returns {Promise<PolicyEvaluationResult>} Evaluation result
 *
 * @example
 * ```typescript
 * const cache = new Map();
 * const result = await evaluateWithAttributeCache(Policy, context, cache);
 * ```
 */
export declare function evaluateWithAttributeCache(Policy: ModelStatic<PolicyModel>, context: EvaluationContext, cache: Map<string, any>): Promise<PolicyEvaluationResult>;
/**
 * @function createDynamicPolicy
 * @description Creates a policy with dynamic conditions based on runtime data
 *
 * @param {ModelStatic<PolicyModel>} Policy - Policy model
 * @param {object} dynamicData - Dynamic policy data
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<PolicyModel>} Created policy
 *
 * @example
 * ```typescript
 * const policy = await createDynamicPolicy(Policy, {
 *   resourceType: 'patient-record',
 *   allowedDepartments: ['cardiology', 'neurology'],
 *   minClearance: 3
 * });
 * ```
 */
export declare function createDynamicPolicy(Policy: ModelStatic<PolicyModel>, dynamicData: {
    name?: string;
    resourceType: string;
    allowedDepartments?: string[];
    minClearance?: number;
    actions?: string[];
}, transaction?: Transaction): Promise<PolicyModel>;
/**
 * @function getPolicyEffectivenessScore
 * @description Calculates effectiveness score for a policy
 *
 * @param {ModelStatic<PolicyModel>} Policy - Policy model
 * @param {string} policyId - Policy ID
 * @param {number} evaluationCount - Number of times evaluated
 * @param {number} matchCount - Number of times matched
 * @returns {Promise<number>} Effectiveness score (0-100)
 *
 * @example
 * ```typescript
 * const score = await getPolicyEffectivenessScore(Policy, 'policy-123', 1000, 750);
 * console.log(`Effectiveness: ${score}%`);
 * ```
 */
export declare function getPolicyEffectivenessScore(Policy: ModelStatic<PolicyModel>, policyId: string, evaluationCount: number, matchCount: number): Promise<number>;
/**
 * @function createHierarchicalPolicy
 * @description Creates a hierarchical policy that applies to nested resources
 *
 * @param {ModelStatic<PolicyModel>} Policy - Policy model
 * @param {object} hierarchyData - Hierarchy data
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<PolicyModel>} Created policy
 *
 * @example
 * ```typescript
 * const policy = await createHierarchicalPolicy(Policy, {
 *   rootResource: 'organization',
 *   childResources: ['department', 'team', 'user'],
 *   actions: ['read'],
 *   effect: 'allow'
 * });
 * ```
 */
export declare function createHierarchicalPolicy(Policy: ModelStatic<PolicyModel>, hierarchyData: {
    name?: string;
    rootResource: string;
    childResources: string[];
    actions: string[];
    effect: 'allow' | 'deny';
    conditions?: PolicyCondition[];
}, transaction?: Transaction): Promise<PolicyModel>;
/**
 * @function evaluateWithExplicitDeny
 * @description Evaluates with explicit deny taking precedence
 *
 * @param {ModelStatic<PolicyModel>} Policy - Policy model
 * @param {EvaluationContext} context - Evaluation context
 * @returns {Promise<PolicyEvaluationResult>} Evaluation result
 *
 * @example
 * ```typescript
 * const result = await evaluateWithExplicitDeny(Policy, context);
 * // Deny policies always override allow policies
 * ```
 */
export declare function evaluateWithExplicitDeny(Policy: ModelStatic<PolicyModel>, context: EvaluationContext): Promise<PolicyEvaluationResult>;
/**
 * @function createMultiTenantPolicy
 * @description Creates a multi-tenant aware policy
 *
 * @param {ModelStatic<PolicyModel>} Policy - Policy model
 * @param {string} tenantId - Tenant ID
 * @param {object} policyData - Policy data
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<PolicyModel>} Created policy
 *
 * @example
 * ```typescript
 * const policy = await createMultiTenantPolicy(Policy, 'hospital-1', {
 *   name: 'Hospital Access',
 *   resources: ['patient-records'],
 *   actions: ['read', 'update'],
 *   effect: 'allow'
 * });
 * ```
 */
export declare function createMultiTenantPolicy(Policy: ModelStatic<PolicyModel>, tenantId: string, policyData: {
    name: string;
    resources: string[];
    actions: string[];
    effect: 'allow' | 'deny';
    conditions?: PolicyCondition[];
}, transaction?: Transaction): Promise<PolicyModel>;
/**
 * @function getPolicyUsageStatistics
 * @description Gets usage statistics for policies
 *
 * @param {ModelStatic<PolicyModel>} Policy - Policy model
 * @param {string} tenantId - Optional tenant ID
 * @returns {Promise<any>} Usage statistics
 *
 * @example
 * ```typescript
 * const stats = await getPolicyUsageStatistics(Policy);
 * console.log(`Total policies: ${stats.total}`);
 * console.log(`Active policies: ${stats.active}`);
 * ```
 */
export declare function getPolicyUsageStatistics(Policy: ModelStatic<PolicyModel>, tenantId?: string): Promise<any>;
/**
 * @function evaluateWithLogging
 * @description Evaluates policies with detailed logging
 *
 * @param {ModelStatic<PolicyModel>} Policy - Policy model
 * @param {EvaluationContext} context - Evaluation context
 * @param {Function} logger - Logger function
 * @returns {Promise<PolicyEvaluationResult>} Evaluation result
 *
 * @example
 * ```typescript
 * const result = await evaluateWithLogging(Policy, context, console.log);
 * ```
 */
export declare function evaluateWithLogging(Policy: ModelStatic<PolicyModel>, context: EvaluationContext, logger: (message: string) => void): Promise<PolicyEvaluationResult>;
//# sourceMappingURL=iam-abac-kit.d.ts.map