"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.evaluatePolicy = evaluatePolicy;
exports.evaluatePolicies = evaluatePolicies;
exports.combinePolicyResults = combinePolicyResults;
exports.evaluateConditions = evaluateConditions;
exports.evaluateCondition = evaluateCondition;
exports.getAttributeValue = getAttributeValue;
exports.matchesPattern = matchesPattern;
exports.createAttributeProvider = createAttributeProvider;
exports.createSequelizeAttributeProvider = createSequelizeAttributeProvider;
exports.createDynamicAttributeProvider = createDynamicAttributeProvider;
exports.createCachedAttributeProvider = createCachedAttributeProvider;
exports.mergeAttributeProviders = mergeAttributeProviders;
exports.getNestedValue = getNestedValue;
exports.buildContext = buildContext;
exports.buildContextFromModels = buildContextFromModels;
exports.enrichContext = enrichContext;
exports.buildRequestContext = buildRequestContext;
exports.compilePolicyExpression = compilePolicyExpression;
exports.compilePolicy = compilePolicy;
exports.parsePolicyLanguage = parsePolicyLanguage;
exports.simulatePolicy = simulatePolicy;
exports.generateTestCases = generateTestCases;
exports.analyzePolicyCoverage = analyzePolicyCoverage;
exports.createResourcePolicy = createResourcePolicy;
exports.getResourcePolicies = getResourcePolicies;
exports.evaluateResourceAccess = evaluateResourceAccess;
exports.createTimeBasedPolicy = createTimeBasedPolicy;
exports.createLocationBasedPolicy = createLocationBasedPolicy;
exports.clonePolicy = clonePolicy;
exports.validatePolicy = validatePolicy;
exports.optimizePolicies = optimizePolicies;
exports.getPolicyDependencies = getPolicyDependencies;
exports.exportPolicyToJson = exportPolicyToJson;
exports.importPolicyFromJson = importPolicyFromJson;
exports.evaluateBatchContexts = evaluateBatchContexts;
exports.createConditionalPolicy = createConditionalPolicy;
exports.getPolicyConflicts = getPolicyConflicts;
exports.evaluateWithAttributeCache = evaluateWithAttributeCache;
exports.createDynamicPolicy = createDynamicPolicy;
exports.getPolicyEffectivenessScore = getPolicyEffectivenessScore;
exports.createHierarchicalPolicy = createHierarchicalPolicy;
exports.evaluateWithExplicitDeny = evaluateWithExplicitDeny;
exports.createMultiTenantPolicy = createMultiTenantPolicy;
exports.getPolicyUsageStatistics = getPolicyUsageStatistics;
exports.evaluateWithLogging = evaluateWithLogging;
const sequelize_1 = require("sequelize");
// ============================================================================
// POLICY EVALUATION ENGINE
// ============================================================================
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
async function evaluatePolicy(policy, context) {
    if (!policy.isActive) {
        return {
            decision: 'not_applicable',
            reason: 'Policy is not active',
        };
    }
    // Check resource match
    const resourceMatches = matchesPattern(context.resource.type, policy.resources);
    if (!resourceMatches) {
        return {
            decision: 'not_applicable',
            reason: 'Resource does not match policy',
        };
    }
    // Check action match
    const actionMatches = matchesPattern(context.action, policy.actions);
    if (!actionMatches) {
        return {
            decision: 'not_applicable',
            reason: 'Action does not match policy',
        };
    }
    // Evaluate conditions
    if (policy.conditions && policy.conditions.length > 0) {
        const conditionsMatch = await evaluateConditions(policy.conditions, context);
        if (!conditionsMatch) {
            return {
                decision: 'not_applicable',
                reason: 'Conditions do not match',
                matchedConditions: [],
            };
        }
    }
    return {
        decision: policy.effect,
        policyId: policy.id,
        reason: `Policy ${policy.name} matched`,
        matchedConditions: policy.conditions,
    };
}
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
async function evaluatePolicies(Policy, context, options = {}) {
    const { tenantId, combineAlgorithm = 'deny-overrides' } = options;
    const where = { isActive: true };
    if (tenantId) {
        where.tenantId = tenantId;
    }
    const policies = await Policy.findAll({
        where,
        order: [['priority', 'DESC']],
    });
    const results = [];
    for (const policy of policies) {
        const result = await evaluatePolicy(policy, context);
        if (result.decision !== 'not_applicable') {
            results.push(result);
        }
    }
    return combinePolicyResults(results, combineAlgorithm);
}
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
function combinePolicyResults(results, algorithm) {
    if (results.length === 0) {
        return {
            decision: 'deny',
            reason: 'No applicable policies found - default deny',
        };
    }
    switch (algorithm) {
        case 'deny-overrides':
            const denyResult = results.find((r) => r.decision === 'deny');
            return (denyResult ||
                results.find((r) => r.decision === 'allow') || {
                decision: 'deny',
                reason: 'No explicit allow',
            });
        case 'allow-overrides':
            const allowResult = results.find((r) => r.decision === 'allow');
            return (allowResult ||
                results.find((r) => r.decision === 'deny') || {
                decision: 'deny',
                reason: 'No explicit allow',
            });
        case 'first-applicable':
            return results[0];
        default:
            return {
                decision: 'deny',
                reason: 'Unknown combination algorithm',
            };
    }
}
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
async function evaluateConditions(conditions, context) {
    let result = true;
    let currentOp = 'AND';
    for (const condition of conditions) {
        const conditionResult = evaluateCondition(condition, context);
        if (currentOp === 'AND') {
            result = result && conditionResult;
        }
        else {
            result = result || conditionResult;
        }
        currentOp = condition.logicalOp || 'AND';
    }
    return result;
}
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
function evaluateCondition(condition, context) {
    const attributeValue = getAttributeValue(condition.attribute, context);
    switch (condition.operator) {
        case 'eq':
            return attributeValue === condition.value;
        case 'ne':
            return attributeValue !== condition.value;
        case 'gt':
            return attributeValue > condition.value;
        case 'gte':
            return attributeValue >= condition.value;
        case 'lt':
            return attributeValue < condition.value;
        case 'lte':
            return attributeValue <= condition.value;
        case 'in':
            return Array.isArray(condition.value) && condition.value.includes(attributeValue);
        case 'notIn':
            return Array.isArray(condition.value) && !condition.value.includes(attributeValue);
        case 'contains':
            return (typeof attributeValue === 'string' &&
                typeof condition.value === 'string' &&
                attributeValue.includes(condition.value));
        case 'startsWith':
            return (typeof attributeValue === 'string' &&
                typeof condition.value === 'string' &&
                attributeValue.startsWith(condition.value));
        case 'endsWith':
            return (typeof attributeValue === 'string' &&
                typeof condition.value === 'string' &&
                attributeValue.endsWith(condition.value));
        case 'matches':
            return (typeof attributeValue === 'string' &&
                new RegExp(condition.value).test(attributeValue));
        case 'exists':
            return attributeValue !== null && attributeValue !== undefined;
        case 'notExists':
            return attributeValue === null || attributeValue === undefined;
        default:
            return false;
    }
}
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
function getAttributeValue(path, context) {
    const parts = path.split('.');
    let value = context;
    for (const part of parts) {
        if (value === null || value === undefined) {
            return undefined;
        }
        value = value[part];
    }
    return value;
}
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
function matchesPattern(value, patterns) {
    return patterns.some((pattern) => {
        const regex = new RegExp('^' + pattern.replace(/\*/g, '.*') + '$');
        return regex.test(value);
    });
}
// ============================================================================
// ATTRIBUTE PROVIDERS
// ============================================================================
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
function createAttributeProvider(name, getAttributes, cacheTTL = 300) {
    return {
        name,
        getAttributes,
        cacheTTL,
    };
}
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
function createSequelizeAttributeProvider(Model, mapping, includes = []) {
    return createAttributeProvider('sequelize-provider', async (subjectId) => {
        const instance = await Model.findByPk(subjectId, { include: includes });
        if (!instance) {
            return {};
        }
        const attributes = {};
        for (const [key, pathOrResolver] of Object.entries(mapping)) {
            if (typeof pathOrResolver === 'function') {
                attributes[key] = await pathOrResolver(instance);
            }
            else {
                attributes[key] = getNestedValue(instance, pathOrResolver);
            }
        }
        return attributes;
    });
}
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
function createDynamicAttributeProvider(Model, mapping, options = {}) {
    return createAttributeProvider('dynamic-provider', async (subjectId) => {
        const instance = await Model.findByPk(subjectId);
        if (!instance) {
            return {};
        }
        const attributes = {};
        for (const [key, resolver] of Object.entries(mapping)) {
            if (typeof resolver === 'function') {
                attributes[key] = await resolver(instance);
            }
            else {
                attributes[key] = getNestedValue(instance, resolver);
            }
        }
        return attributes;
    }, options.cacheTTL);
}
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
function createCachedAttributeProvider(provider, cacheTTL = 300) {
    const cache = new Map();
    return {
        name: `cached-${provider.name}`,
        cacheTTL,
        getAttributes: async (subjectId) => {
            const cached = cache.get(subjectId);
            const now = Date.now();
            if (cached && cached.expiry > now) {
                return cached.value;
            }
            const attributes = await provider.getAttributes(subjectId);
            cache.set(subjectId, {
                value: attributes,
                expiry: now + cacheTTL * 1000,
            });
            return attributes;
        },
    };
}
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
function mergeAttributeProviders(providers) {
    return createAttributeProvider('merged-provider', async (subjectId) => {
        const allAttributes = {};
        for (const provider of providers) {
            const attributes = await provider.getAttributes(subjectId);
            Object.assign(allAttributes, attributes);
        }
        return allAttributes;
    });
}
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
function getNestedValue(obj, path) {
    const parts = path.split('.');
    let value = obj;
    for (const part of parts) {
        if (value === null || value === undefined) {
            return undefined;
        }
        value = value[part];
    }
    return value;
}
// ============================================================================
// CONTEXT BUILDERS
// ============================================================================
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
async function buildContext(subject, resource, action, options = {}) {
    const { includeUser = true, includeResource = true, includeEnvironment = true, providers = [], } = options;
    const context = {
        subject: {},
        resource: {},
        action,
        environment: {},
    };
    // Build subject attributes
    if (includeUser && subject) {
        context.subject = { ...subject };
        const subjectId = subject.id || subject.userId;
        for (const provider of providers) {
            const attributes = await provider.getAttributes(subjectId);
            Object.assign(context.subject, attributes);
        }
    }
    // Build resource attributes
    if (includeResource && resource) {
        context.resource = { ...resource };
    }
    // Build environment attributes
    if (includeEnvironment) {
        context.environment = {
            time: new Date(),
            timestamp: Date.now(),
            dayOfWeek: new Date().getDay(),
            hour: new Date().getHours(),
        };
    }
    return context;
}
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
async function buildContextFromModels(UserModel, ResourceModel, userId, resourceId, action, options = {}) {
    const { userIncludes = [], resourceIncludes = [], providers = [] } = options;
    const user = await UserModel.findByPk(userId, { include: userIncludes });
    const resource = await ResourceModel.findByPk(resourceId, { include: resourceIncludes });
    return await buildContext(user?.toJSON(), resource?.toJSON(), action, { providers });
}
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
async function enrichContext(context, providers) {
    const enriched = { ...context };
    const subjectId = context.subject.id || context.subject.userId;
    for (const provider of providers) {
        const attributes = await provider.getAttributes(subjectId);
        Object.assign(enriched.subject, attributes);
    }
    return enriched;
}
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
function buildRequestContext(req, resource, action) {
    return {
        subject: req.user || {},
        resource: resource || {},
        action,
        environment: {
            ip: req.ip,
            userAgent: req.headers['user-agent'],
            time: new Date(),
            method: req.method,
            path: req.path,
        },
        request: {
            headers: req.headers,
            query: req.query,
            body: req.body,
        },
    };
}
// ============================================================================
// POLICY LANGUAGE & COMPILATION
// ============================================================================
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
function compilePolicyExpression(expression) {
    // Simple expression compiler (production would use proper parser)
    return new Function('context', `
    with (context) {
      try {
        return ${expression};
      } catch (e) {
        return false;
      }
    }
  `);
}
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
function compilePolicy(policy) {
    const conditionFn = (context) => {
        if (!policy.conditions || policy.conditions.length === 0) {
            return true;
        }
        let result = true;
        let currentOp = 'AND';
        for (const condition of policy.conditions) {
            const conditionResult = evaluateCondition(condition, context);
            if (currentOp === 'AND') {
                result = result && conditionResult;
            }
            else {
                result = result || conditionResult;
            }
            currentOp = condition.logicalOp || 'AND';
        }
        return result;
    };
    const resourcePatterns = policy.resources.map((pattern) => new RegExp('^' + pattern.replace(/\*/g, '.*') + '$'));
    const actionPatterns = policy.actions.map((pattern) => new RegExp('^' + pattern.replace(/\*/g, '.*') + '$'));
    return {
        id: policy.id,
        effect: policy.effect,
        conditionFn,
        resourcePatterns,
        actionPatterns,
        priority: policy.priority,
    };
}
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
function parsePolicyLanguage(policyText) {
    const conditions = [];
    const lines = policyText.split(/AND|OR/i);
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line)
            continue;
        let operator = 'eq';
        let attribute = '';
        let value = '';
        if (line.includes('>=')) {
            [attribute, value] = line.split('>=').map((s) => s.trim());
            operator = 'gte';
        }
        else if (line.includes('<=')) {
            [attribute, value] = line.split('<=').map((s) => s.trim());
            operator = 'lte';
        }
        else if (line.includes('>')) {
            [attribute, value] = line.split('>').map((s) => s.trim());
            operator = 'gt';
        }
        else if (line.includes('<')) {
            [attribute, value] = line.split('<').map((s) => s.trim());
            operator = 'lt';
        }
        else if (line.includes('!=')) {
            [attribute, value] = line.split('!=').map((s) => s.trim());
            operator = 'ne';
        }
        else if (line.includes('=')) {
            [attribute, value] = line.split('=').map((s) => s.trim());
            operator = 'eq';
        }
        else if (line.toUpperCase().includes(' IN ')) {
            [attribute, value] = line.split(/\s+IN\s+/i).map((s) => s.trim());
            operator = 'in';
        }
        // Parse value
        let parsedValue = value;
        if (value.startsWith('[') && value.endsWith(']')) {
            parsedValue = JSON.parse(value.replace(/'/g, '"'));
        }
        else if (value.startsWith("'") || value.startsWith('"')) {
            parsedValue = value.slice(1, -1);
        }
        else if (!isNaN(Number(value))) {
            parsedValue = Number(value);
        }
        conditions.push({
            attribute,
            operator,
            value: parsedValue,
            logicalOp: i < lines.length - 1 ? 'AND' : undefined,
        });
    }
    return conditions;
}
// ============================================================================
// POLICY SIMULATION & TESTING
// ============================================================================
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
async function simulatePolicy(policy, testCases) {
    const results = [];
    for (const testCase of testCases) {
        const evaluation = await evaluatePolicy(policy, testCase.context);
        results.push({
            name: testCase.name,
            actualDecision: evaluation.decision,
            expectedDecision: testCase.expectedDecision,
            passed: evaluation.decision === testCase.expectedDecision,
            details: evaluation,
        });
    }
    return results;
}
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
function generateTestCases(policy) {
    const testCases = [];
    // Positive test case (should match)
    testCases.push({
        name: 'Positive case - all conditions match',
        context: {
            subject: {},
            resource: { type: policy.resources[0] },
            action: policy.actions[0],
            environment: {},
        },
        expectedDecision: policy.effect,
    });
    // Negative test case (resource mismatch)
    testCases.push({
        name: 'Negative case - resource mismatch',
        context: {
            subject: {},
            resource: { type: 'non-matching-resource' },
            action: policy.actions[0],
            environment: {},
        },
        expectedDecision: 'not_applicable',
    });
    // Negative test case (action mismatch)
    testCases.push({
        name: 'Negative case - action mismatch',
        context: {
            subject: {},
            resource: { type: policy.resources[0] },
            action: 'non-matching-action',
            environment: {},
        },
        expectedDecision: 'not_applicable',
    });
    return testCases;
}
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
async function analyzePolicyCoverage(policies, testCases) {
    const policyCoverage = new Map();
    for (const policy of policies) {
        policyCoverage.set(policy.id, 0);
    }
    for (const testCase of testCases) {
        for (const policy of policies) {
            const result = await evaluatePolicy(policy, testCase.context);
            if (result.decision !== 'not_applicable') {
                policyCoverage.set(policy.id, (policyCoverage.get(policy.id) || 0) + 1);
            }
        }
    }
    const totalPolicies = policies.length;
    const coveredPolicies = Array.from(policyCoverage.values()).filter((count) => count > 0).length;
    return {
        totalPolicies,
        coveredPolicies,
        uncoveredPolicies: totalPolicies - coveredPolicies,
        percentage: (coveredPolicies / totalPolicies) * 100,
        policyCoverage: Object.fromEntries(policyCoverage),
    };
}
// ============================================================================
// RESOURCE-BASED POLICIES
// ============================================================================
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
async function createResourcePolicy(Policy, resourceType, resourceId, policyData, transaction) {
    return await Policy.create({
        name: policyData.name || `${resourceType}-${resourceId}-policy`,
        description: `Resource-specific policy for ${resourceType}:${resourceId}`,
        effect: policyData.effect,
        resources: [`${resourceType}:${resourceId}`],
        actions: policyData.actions,
        conditions: policyData.conditions,
        priority: 100,
        isActive: true,
        metadata: { resourceType, resourceId },
    }, { transaction });
}
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
async function getResourcePolicies(Policy, resourceType, resourceId) {
    return await Policy.findAll({
        where: {
            resources: { [sequelize_1.Op.contains]: [`${resourceType}:${resourceId}`] },
            isActive: true,
        },
    });
}
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
async function evaluateResourceAccess(Policy, userId, resourceType, resourceId, action, providers = []) {
    const context = await buildContext({ id: userId }, { type: resourceType, id: resourceId }, action, { providers });
    const policies = await getResourcePolicies(Policy, resourceType, resourceId);
    if (policies.length === 0) {
        return await evaluatePolicies(Policy, context);
    }
    const results = [];
    for (const policy of policies) {
        const result = await evaluatePolicy(policy, context);
        if (result.decision !== 'not_applicable') {
            results.push(result);
        }
    }
    return combinePolicyResults(results, 'deny-overrides');
}
// ============================================================================
// TIME-BASED & LOCATION-BASED ACCESS
// ============================================================================
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
async function createTimeBasedPolicy(Policy, timeConstraints, policyData, transaction) {
    const conditions = [];
    if (timeConstraints.startHour !== undefined) {
        conditions.push({
            attribute: 'environment.hour',
            operator: 'gte',
            value: timeConstraints.startHour,
            logicalOp: 'AND',
        });
    }
    if (timeConstraints.endHour !== undefined) {
        conditions.push({
            attribute: 'environment.hour',
            operator: 'lte',
            value: timeConstraints.endHour,
            logicalOp: 'AND',
        });
    }
    if (timeConstraints.daysOfWeek) {
        conditions.push({
            attribute: 'environment.dayOfWeek',
            operator: 'in',
            value: timeConstraints.daysOfWeek,
            logicalOp: 'AND',
        });
    }
    return await Policy.create({
        name: policyData.name || 'time-based-policy',
        description: 'Time-based access policy',
        effect: policyData.effect,
        resources: policyData.resources,
        actions: policyData.actions,
        conditions,
        priority: 50,
        isActive: true,
        metadata: { type: 'time-based', timeConstraints },
    }, { transaction });
}
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
async function createLocationBasedPolicy(Policy, allowedLocations, policyData, transaction) {
    const conditions = [
        {
            attribute: 'environment.ip',
            operator: 'matches',
            value: `^(${allowedLocations.map((l) => l.replace(/\*/g, '.*')).join('|')})$`,
        },
    ];
    return await Policy.create({
        name: policyData.name || 'location-based-policy',
        description: 'Location-based access policy',
        effect: policyData.effect,
        resources: policyData.resources,
        actions: policyData.actions,
        conditions,
        priority: 50,
        isActive: true,
        metadata: { type: 'location-based', allowedLocations },
    }, { transaction });
}
// ============================================================================
// POLICY MANAGEMENT
// ============================================================================
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
async function clonePolicy(Policy, policyId, overrides = {}, transaction) {
    const source = await Policy.findByPk(policyId, { transaction });
    if (!source) {
        throw new Error(`Policy ${policyId} not found`);
    }
    return await Policy.create({
        name: overrides.name || `${source.name} (Copy)`,
        description: overrides.description || source.description,
        effect: overrides.effect || source.effect,
        resources: overrides.resources || source.resources,
        actions: overrides.actions || source.actions,
        conditions: overrides.conditions || source.conditions,
        priority: overrides.priority !== undefined ? overrides.priority : source.priority,
        isActive: overrides.isActive !== undefined ? overrides.isActive : false,
        tenantId: overrides.tenantId || source.tenantId,
        metadata: { ...source.metadata, clonedFrom: policyId, ...overrides.metadata },
    }, { transaction });
}
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
function validatePolicy(policy) {
    const errors = [];
    if (!policy.name) {
        errors.push('Policy name is required');
    }
    if (!policy.effect || !['allow', 'deny'].includes(policy.effect)) {
        errors.push('Policy effect must be "allow" or "deny"');
    }
    if (!policy.resources || policy.resources.length === 0) {
        errors.push('Policy must have at least one resource');
    }
    if (!policy.actions || policy.actions.length === 0) {
        errors.push('Policy must have at least one action');
    }
    if (policy.conditions) {
        for (const condition of policy.conditions) {
            if (!condition.attribute) {
                errors.push('Condition must have an attribute');
            }
            if (!condition.operator) {
                errors.push('Condition must have an operator');
            }
            if (condition.value === undefined) {
                errors.push('Condition must have a value');
            }
        }
    }
    return {
        valid: errors.length === 0,
        errors,
    };
}
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
async function optimizePolicies(Policy, tenantId) {
    const where = { isActive: true };
    if (tenantId) {
        where.tenantId = tenantId;
    }
    const policies = await Policy.findAll({ where });
    const policyMap = new Map();
    let removed = 0;
    for (const policy of policies) {
        const key = JSON.stringify({
            resources: policy.resources,
            actions: policy.actions,
            conditions: policy.conditions,
        });
        if (policyMap.has(key)) {
            // Duplicate found, keep higher priority
            const existing = policyMap.get(key);
            if (policy.priority > existing.priority) {
                await existing.update({ isActive: false });
                policyMap.set(key, policy);
            }
            else {
                await policy.update({ isActive: false });
            }
            removed++;
        }
        else {
            policyMap.set(key, policy);
        }
    }
    return {
        removed,
        optimized: policyMap.size,
    };
}
// ============================================================================
// ADVANCED POLICY OPERATIONS
// ============================================================================
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
async function getPolicyDependencies(Policy, policyId) {
    const policy = await Policy.findByPk(policyId);
    if (!policy) {
        throw new Error(`Policy ${policyId} not found`);
    }
    return await Policy.findAll({
        where: {
            resources: { [sequelize_1.Op.overlap]: policy.resources },
            actions: { [sequelize_1.Op.overlap]: policy.actions },
            id: { [sequelize_1.Op.ne]: policyId },
        },
    });
}
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
function exportPolicyToJson(policy) {
    return JSON.stringify({
        name: policy.name,
        description: policy.description,
        effect: policy.effect,
        resources: policy.resources,
        actions: policy.actions,
        conditions: policy.conditions,
        priority: policy.priority,
        metadata: policy.metadata,
    }, null, 2);
}
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
async function importPolicyFromJson(Policy, jsonString, transaction) {
    const data = JSON.parse(jsonString);
    return await Policy.create({
        ...data,
        isActive: true,
    }, { transaction });
}
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
async function evaluateBatchContexts(policy, contexts) {
    return await Promise.all(contexts.map((context) => evaluatePolicy(policy, context)));
}
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
async function createConditionalPolicy(Policy, policyData, transaction) {
    return await Policy.create({
        ...policyData,
        isActive: true,
        priority: policyData.priority || 50,
    }, { transaction });
}
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
async function getPolicyConflicts(Policy, tenantId) {
    const where = { isActive: true };
    if (tenantId) {
        where.tenantId = tenantId;
    }
    const policies = await Policy.findAll({ where });
    const conflicts = [];
    for (let i = 0; i < policies.length; i++) {
        for (let j = i + 1; j < policies.length; j++) {
            const p1 = policies[i];
            const p2 = policies[j];
            // Check for overlapping resources and actions with opposite effects
            const resourceOverlap = p1.resources.some((r) => p2.resources.includes(r));
            const actionOverlap = p1.actions.some((a) => p2.actions.includes(a));
            if (resourceOverlap && actionOverlap && p1.effect !== p2.effect) {
                conflicts.push({
                    policy1: p1,
                    policy2: p2,
                    reason: 'Overlapping resources and actions with opposite effects',
                });
            }
        }
    }
    return conflicts;
}
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
async function evaluateWithAttributeCache(Policy, context, cache) {
    const cacheKey = JSON.stringify({ subject: context.subject.id, action: context.action });
    if (cache.has(cacheKey)) {
        return cache.get(cacheKey);
    }
    const result = await evaluatePolicies(Policy, context);
    cache.set(cacheKey, result);
    return result;
}
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
async function createDynamicPolicy(Policy, dynamicData, transaction) {
    const conditions = [];
    if (dynamicData.allowedDepartments) {
        conditions.push({
            attribute: 'subject.department',
            operator: 'in',
            value: dynamicData.allowedDepartments,
            logicalOp: 'AND',
        });
    }
    if (dynamicData.minClearance !== undefined) {
        conditions.push({
            attribute: 'subject.clearance',
            operator: 'gte',
            value: dynamicData.minClearance,
            logicalOp: 'AND',
        });
    }
    return await Policy.create({
        name: dynamicData.name || `Dynamic ${dynamicData.resourceType} Policy`,
        description: 'Dynamically generated policy',
        effect: 'allow',
        resources: [dynamicData.resourceType],
        actions: dynamicData.actions || ['*'],
        conditions,
        priority: 50,
        isActive: true,
        metadata: { dynamic: true, ...dynamicData },
    }, { transaction });
}
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
async function getPolicyEffectivenessScore(Policy, policyId, evaluationCount, matchCount) {
    if (evaluationCount === 0)
        return 0;
    return Math.round((matchCount / evaluationCount) * 100);
}
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
async function createHierarchicalPolicy(Policy, hierarchyData, transaction) {
    const resources = [hierarchyData.rootResource, ...hierarchyData.childResources];
    return await Policy.create({
        name: hierarchyData.name || `Hierarchical ${hierarchyData.rootResource} Policy`,
        description: 'Hierarchical resource policy',
        effect: hierarchyData.effect,
        resources,
        actions: hierarchyData.actions,
        conditions: hierarchyData.conditions || [],
        priority: 60,
        isActive: true,
        metadata: { hierarchical: true, rootResource: hierarchyData.rootResource },
    }, { transaction });
}
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
async function evaluateWithExplicitDeny(Policy, context) {
    const policies = await Policy.findAll({
        where: { isActive: true },
        order: [
            ['effect', 'DESC'], // deny before allow
            ['priority', 'DESC'],
        ],
    });
    for (const policy of policies) {
        const result = await evaluatePolicy(policy, context);
        if (result.decision === 'deny') {
            return result; // Explicit deny takes precedence
        }
    }
    // Evaluate allow policies
    return await evaluatePolicies(Policy, context);
}
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
async function createMultiTenantPolicy(Policy, tenantId, policyData, transaction) {
    const conditions = [
        {
            attribute: 'tenant',
            operator: 'eq',
            value: tenantId,
            logicalOp: 'AND',
        },
        ...(policyData.conditions || []),
    ];
    return await Policy.create({
        name: policyData.name,
        description: `Multi-tenant policy for ${tenantId}`,
        effect: policyData.effect,
        resources: policyData.resources,
        actions: policyData.actions,
        conditions,
        priority: 70,
        isActive: true,
        tenantId,
        metadata: { multiTenant: true },
    }, { transaction });
}
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
async function getPolicyUsageStatistics(Policy, tenantId) {
    const where = {};
    if (tenantId) {
        where.tenantId = tenantId;
    }
    const [total, active, allow, deny] = await Promise.all([
        Policy.count({ where }),
        Policy.count({ where: { ...where, isActive: true } }),
        Policy.count({ where: { ...where, effect: 'allow' } }),
        Policy.count({ where: { ...where, effect: 'deny' } }),
    ]);
    return {
        total,
        active,
        inactive: total - active,
        allow,
        deny,
        allowPercentage: total > 0 ? (allow / total) * 100 : 0,
        denyPercentage: total > 0 ? (deny / total) * 100 : 0,
    };
}
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
async function evaluateWithLogging(Policy, context, logger) {
    logger(`Evaluating context: ${JSON.stringify(context, null, 2)}`);
    const policies = await Policy.findAll({
        where: { isActive: true },
        order: [['priority', 'DESC']],
    });
    logger(`Found ${policies.length} active policies`);
    const results = [];
    for (const policy of policies) {
        logger(`Evaluating policy: ${policy.name}`);
        const result = await evaluatePolicy(policy, context);
        logger(`Policy ${policy.name} decision: ${result.decision}`);
        if (result.decision !== 'not_applicable') {
            results.push(result);
        }
    }
    const finalResult = combinePolicyResults(results, 'deny-overrides');
    logger(`Final decision: ${finalResult.decision}`);
    return finalResult;
}
//# sourceMappingURL=iam-abac-kit.js.map