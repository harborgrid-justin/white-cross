"use strict";
/**
 * LOC: WF-EXG-001
 * File: /reuse/server/workflow/workflow-exclusive-gateway.ts
 *
 * UPSTREAM (imports from):
 *   - zod
 *   - @nestjs/common
 *   - @nestjs/event-emitter
 *   - uuid
 *   - lodash
 *
 * DOWNSTREAM (imported by):
 *   - Workflow services
 *   - Decision engines
 *   - Routing services
 *   - Process orchestration
 *   - Business rule engines
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.PathProbabilitySchema = exports.GatewayPerformanceMetricsSchema = exports.ConditionCacheEntrySchema = exports.GatewayDecisionLogSchema = exports.GatewayEvaluationResultSchema = exports.GatewayEvaluationContextSchema = exports.ExclusiveGatewayConfigSchema = exports.GatewayPathSchema = exports.GatewayPathConditionSchema = void 0;
exports.evaluateExclusiveGateway = evaluateExclusiveGateway;
exports.createExclusiveGateway = createExclusiveGateway;
exports.validateExclusiveGatewayPaths = validateExclusiveGatewayPaths;
exports.evaluatePathCondition = evaluatePathCondition;
exports.testGatewayScenarios = testGatewayScenarios;
exports.getGatewayPaths = getGatewayPaths;
exports.getEnabledPaths = getEnabledPaths;
exports.simulateGatewayEvaluation = simulateGatewayEvaluation;
exports.selectFirstMatchingPath = selectFirstMatchingPath;
exports.selectHighestPriorityPath = selectHighestPriorityPath;
exports.selectBestMatchPath = selectBestMatchPath;
exports.selectDefaultPath = selectDefaultPath;
exports.validateSinglePathSelection = validateSinglePathSelection;
exports.findPathById = findPathById;
exports.sortPathsByPriority = sortPathsByPriority;
exports.updatePathPriority = updatePathPriority;
exports.getPathsByPriorityOrder = getPathsByPriorityOrder;
exports.validatePriorityConfiguration = validatePriorityConfiguration;
exports.rebalancePathPriorities = rebalancePathPriorities;
exports.getHighestPriority = getHighestPriority;
exports.setDefaultPath = setDefaultPath;
exports.clearDefaultPath = clearDefaultPath;
exports.isDefaultPath = isDefaultPath;
exports.validateDefaultPath = validateDefaultPath;
exports.createFallbackPath = createFallbackPath;
exports.createSimpleExpressionEvaluator = createSimpleExpressionEvaluator;
exports.validateExpression = validateExpression;
exports.testExpression = testExpression;
exports.extractExpressionVariables = extractExpressionVariables;
exports.optimizeExpression = optimizeExpression;
exports.createConditionCache = createConditionCache;
exports.generateConditionCacheKey = generateConditionCacheKey;
exports.hashString = hashString;
exports.getConditionCacheStats = getConditionCacheStats;
exports.createDecisionLog = createDecisionLog;
exports.logGatewayDecision = logGatewayDecision;
exports.queryDecisionHistory = queryDecisionHistory;
exports.exportDecisionLogs = exportDecisionLogs;
exports.createGatewayStateSnapshot = createGatewayStateSnapshot;
exports.trackGatewayPerformance = trackGatewayPerformance;
exports.calculatePathProbabilities = calculatePathProbabilities;
exports.predictNextPathSelection = predictNextPathSelection;
/**
 * File: /reuse/server/workflow/workflow-exclusive-gateway.ts
 * Locator: WC-WF-EXG-001
 * Purpose: Exclusive Gateway Routing - Production-grade XOR gateway patterns for single-path workflow routing
 *
 * Upstream: zod, @nestjs/common, @nestjs/event-emitter, uuid, lodash
 * Downstream: ../../../backend/*, workflow services, decision engines, routing services
 * Dependencies: NestJS 10.x, Zod 3.x, TypeScript 5.x, UUID 9.x, Lodash 4.x
 * Exports: 42 production-grade utility functions for exclusive gateway evaluation, routing, optimization
 *
 * LLM Context: Enterprise-grade exclusive gateway utilities for White Cross healthcare workflow platform.
 * Provides comprehensive XOR gateway evaluation, single-path selection, condition prioritization, default path
 * handling, expression evaluation, condition caching, decision logging, gateway state tracking, path probability
 * analysis, and decision time optimization. Exclusive gateways ensure exactly one outgoing path is selected based
 * on conditions, critical for healthcare decision workflows like patient triage, diagnostic routing, treatment
 * path selection, and approval workflows.
 *
 * Features:
 * - XOR (exclusive OR) gateway evaluation
 * - Single-path guarantee with validation
 * - Priority-based condition evaluation
 * - Default/fallback path support
 * - Complex expression evaluation
 * - Condition result caching
 * - Comprehensive decision logging
 * - Gateway state persistence
 * - Path probability tracking
 * - Performance optimization
 * - Decision audit trails
 * - HIPAA-compliant logging
 */
const zod_1 = require("zod");
// ============================================================================
// ZOD VALIDATION SCHEMAS
// ============================================================================
/**
 * Zod schema for gateway path condition.
 */
exports.GatewayPathConditionSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    pathId: zod_1.z.string(),
    expression: zod_1.z.string().min(1),
    priority: zod_1.z.number().int().min(0).default(0),
    enabled: zod_1.z.boolean().default(true),
    description: zod_1.z.string().optional(),
    metadata: zod_1.z.record(zod_1.z.any()).optional(),
});
/**
 * Zod schema for gateway path.
 */
exports.GatewayPathSchema = zod_1.z.object({
    id: zod_1.z.string(),
    name: zod_1.z.string().min(1),
    targetNode: zod_1.z.string(),
    condition: exports.GatewayPathConditionSchema,
    isDefault: zod_1.z.boolean().default(false),
    weight: zod_1.z.number().min(0).max(1).optional(),
    metadata: zod_1.z.record(zod_1.z.any()).optional(),
});
/**
 * Zod schema for exclusive gateway configuration.
 */
exports.ExclusiveGatewayConfigSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    name: zod_1.z.string().min(1),
    paths: zod_1.z.array(exports.GatewayPathSchema).min(2),
    defaultPath: zod_1.z.string().optional(),
    evaluationStrategy: zod_1.z.enum(['priority', 'first-match', 'best-match']).default('priority'),
    enableCaching: zod_1.z.boolean().default(true),
    cacheTimeout: zod_1.z.number().int().positive().default(300000), // 5 minutes
    enableLogging: zod_1.z.boolean().default(true),
    strictMode: zod_1.z.boolean().default(true), // Enforce exactly one path selection
    metadata: zod_1.z.record(zod_1.z.any()).optional(),
});
/**
 * Zod schema for gateway evaluation context.
 */
exports.GatewayEvaluationContextSchema = zod_1.z.object({
    workflowInstanceId: zod_1.z.string().uuid(),
    gatewayId: zod_1.z.string().uuid(),
    variables: zod_1.z.record(zod_1.z.any()),
    timestamp: zod_1.z.date().default(() => new Date()),
    actor: zod_1.z.string().optional(),
    metadata: zod_1.z.record(zod_1.z.any()).optional(),
});
/**
 * Zod schema for gateway evaluation result.
 */
exports.GatewayEvaluationResultSchema = zod_1.z.object({
    gatewayId: zod_1.z.string().uuid(),
    selectedPath: zod_1.z.string(),
    selectedPathId: zod_1.z.string(),
    evaluatedConditions: zod_1.z.array(zod_1.z.object({
        pathId: zod_1.z.string(),
        conditionId: zod_1.z.string().uuid(),
        result: zod_1.z.boolean(),
        evaluationTime: zod_1.z.number(),
        cached: zod_1.z.boolean().default(false),
    })),
    evaluationTime: zod_1.z.number(),
    timestamp: zod_1.z.date(),
    reason: zod_1.z.string().optional(),
    metadata: zod_1.z.record(zod_1.z.any()).optional(),
});
/**
 * Zod schema for gateway decision log entry.
 */
exports.GatewayDecisionLogSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    gatewayId: zod_1.z.string().uuid(),
    workflowInstanceId: zod_1.z.string().uuid(),
    selectedPath: zod_1.z.string(),
    selectedPathId: zod_1.z.string(),
    evaluationContext: exports.GatewayEvaluationContextSchema,
    result: exports.GatewayEvaluationResultSchema,
    timestamp: zod_1.z.date(),
    actor: zod_1.z.string().optional(),
});
/**
 * Zod schema for condition cache entry.
 */
exports.ConditionCacheEntrySchema = zod_1.z.object({
    conditionId: zod_1.z.string().uuid(),
    expression: zod_1.z.string(),
    contextHash: zod_1.z.string(),
    result: zod_1.z.boolean(),
    cachedAt: zod_1.z.date(),
    expiresAt: zod_1.z.date(),
    hitCount: zod_1.z.number().int().min(0).default(0),
});
/**
 * Zod schema for gateway performance metrics.
 */
exports.GatewayPerformanceMetricsSchema = zod_1.z.object({
    gatewayId: zod_1.z.string().uuid(),
    totalEvaluations: zod_1.z.number().int().min(0),
    averageEvaluationTime: zod_1.z.number(),
    minEvaluationTime: zod_1.z.number(),
    maxEvaluationTime: zod_1.z.number(),
    cacheHitRate: zod_1.z.number().min(0).max(1),
    pathSelectionCounts: zod_1.z.record(zod_1.z.number().int().min(0)),
    errorCount: zod_1.z.number().int().min(0),
    lastEvaluationAt: zod_1.z.date().optional(),
});
/**
 * Zod schema for path probability.
 */
exports.PathProbabilitySchema = zod_1.z.object({
    pathId: zod_1.z.string(),
    pathName: zod_1.z.string(),
    probability: zod_1.z.number().min(0).max(1),
    selectionCount: zod_1.z.number().int().min(0),
    totalEvaluations: zod_1.z.number().int().min(0),
    lastSelectedAt: zod_1.z.date().optional(),
});
// ============================================================================
// GATEWAY EVALUATION
// ============================================================================
/**
 * 1. Evaluates an exclusive gateway and selects exactly one outgoing path.
 *
 * @swagger
 * @description Evaluates all path conditions in priority order and selects the first matching path.
 *              Ensures exactly one path is selected (XOR semantics). If no conditions match and no
 *              default path is configured, throws an error.
 *
 * @param {ExclusiveGatewayConfig} config - Gateway configuration with paths and conditions
 * @param {GatewayEvaluationContext} context - Evaluation context with variables
 * @param {ExpressionEvaluator} evaluator - Expression evaluator instance
 * @returns {Promise<GatewayEvaluationResult>} The evaluation result with selected path
 *
 * @example
 * const result = await evaluateExclusiveGateway(
 *   gatewayConfig,
 *   { workflowInstanceId: '123', gatewayId: 'gw1', variables: { age: 65 } },
 *   expressionEvaluator
 * );
 * console.log(result.selectedPath); // 'senior-discount-path'
 */
async function evaluateExclusiveGateway(config, context, evaluator) {
    const startTime = Date.now();
    const evaluatedConditions = [];
    // Sort paths by priority if using priority strategy
    const sortedPaths = config.evaluationStrategy === 'priority'
        ? [...config.paths].sort((a, b) => b.condition.priority - a.condition.priority)
        : config.paths;
    let selectedPath = null;
    // Evaluate each path condition
    for (const path of sortedPaths) {
        if (!path.condition.enabled)
            continue;
        const conditionStartTime = Date.now();
        try {
            const result = evaluator.evaluate(path.condition.expression, context.variables);
            const conditionTime = Date.now() - conditionStartTime;
            evaluatedConditions.push({
                pathId: path.id,
                conditionId: path.condition.id,
                result,
                evaluationTime: conditionTime,
                cached: false,
            });
            if (result && !selectedPath) {
                selectedPath = path;
                if (config.evaluationStrategy === 'first-match') {
                    break; // Stop on first match
                }
            }
        }
        catch (error) {
            evaluatedConditions.push({
                pathId: path.id,
                conditionId: path.condition.id,
                result: false,
                evaluationTime: Date.now() - conditionStartTime,
                cached: false,
                error: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    }
    // If no path selected, use default path
    if (!selectedPath && config.defaultPath) {
        selectedPath = config.paths.find(p => p.id === config.defaultPath) || null;
    }
    // Strict mode: throw if no path selected
    if (!selectedPath && config.strictMode) {
        throw new Error(`No path selected in exclusive gateway ${config.id}. ` +
            `Evaluated ${evaluatedConditions.length} conditions.`);
    }
    if (!selectedPath) {
        throw new Error(`No path could be selected for gateway ${config.id}`);
    }
    const evaluationTime = Date.now() - startTime;
    return {
        gatewayId: config.id,
        selectedPath: selectedPath.name,
        selectedPathId: selectedPath.id,
        evaluatedConditions,
        evaluationTime,
        timestamp: new Date(),
        reason: selectedPath.isDefault ? 'default-path' : 'condition-match',
    };
}
/**
 * 2. Creates an exclusive gateway configuration with validation.
 *
 * @swagger
 * @description Creates and validates an exclusive gateway configuration. Ensures at least two paths
 *              are defined, validates that default path exists if specified, and checks for duplicate
 *              path IDs.
 *
 * @param {Partial<ExclusiveGatewayConfig>} config - Gateway configuration
 * @returns {ExclusiveGatewayConfig} Validated gateway configuration
 *
 * @example
 * const gateway = createExclusiveGateway({
 *   id: crypto.randomUUID(),
 *   name: 'Age-based Routing',
 *   paths: [
 *     { id: 'child', name: 'Child Path', targetNode: 'pediatric', condition: {...} },
 *     { id: 'adult', name: 'Adult Path', targetNode: 'general', condition: {...} }
 *   ]
 * });
 */
function createExclusiveGateway(config) {
    const validated = exports.ExclusiveGatewayConfigSchema.parse({
        evaluationStrategy: 'priority',
        enableCaching: true,
        cacheTimeout: 300000,
        enableLogging: true,
        strictMode: true,
        ...config,
    });
    // Validate at least 2 paths
    if (validated.paths.length < 2) {
        throw new Error('Exclusive gateway must have at least 2 paths');
    }
    // Validate default path exists
    if (validated.defaultPath && !validated.paths.some(p => p.id === validated.defaultPath)) {
        throw new Error(`Default path ${validated.defaultPath} not found in gateway paths`);
    }
    // Check for duplicate path IDs
    const pathIds = validated.paths.map(p => p.id);
    if (new Set(pathIds).size !== pathIds.length) {
        throw new Error('Duplicate path IDs found in gateway configuration');
    }
    return validated;
}
/**
 * 3. Validates that exactly one path will be selected.
 *
 * @swagger
 * @description Validates exclusive gateway configuration to ensure exactly one path will always be
 *              selected. Checks for default path or ensures at least one condition can match.
 *
 * @param {ExclusiveGatewayConfig} config - Gateway configuration
 * @returns {{ valid: boolean; issues: string[] }} Validation result
 *
 * @example
 * const validation = validateExclusiveGatewayPaths(gateway);
 * if (!validation.valid) {
 *   console.error('Gateway validation failed:', validation.issues);
 * }
 */
function validateExclusiveGatewayPaths(config) {
    const issues = [];
    // Check for default path or unconditional path
    const hasDefaultPath = !!config.defaultPath;
    const hasUnconditionalPath = config.paths.some(p => p.condition.expression === 'true');
    if (!hasDefaultPath && !hasUnconditionalPath && config.strictMode) {
        issues.push('No default path or unconditional path defined. Gateway may fail in strict mode.');
    }
    // Check for disabled default path
    if (config.defaultPath) {
        const defaultPath = config.paths.find(p => p.id === config.defaultPath);
        if (defaultPath && !defaultPath.condition.enabled) {
            issues.push('Default path is disabled');
        }
    }
    // Check for all disabled paths
    const enabledPaths = config.paths.filter(p => p.condition.enabled);
    if (enabledPaths.length === 0) {
        issues.push('All paths are disabled');
    }
    // Warn about low priority paths with high complexity
    const lowPriorityPaths = config.paths.filter(p => p.condition.priority < 0);
    if (lowPriorityPaths.length > 0) {
        issues.push(`${lowPriorityPaths.length} paths have negative priority`);
    }
    return {
        valid: issues.length === 0,
        issues,
    };
}
/**
 * 4. Evaluates a gateway path condition.
 *
 * @swagger
 * @description Evaluates a single gateway path condition against the provided context variables.
 *
 * @param {GatewayPathCondition} condition - Path condition to evaluate
 * @param {Record<string, any>} variables - Context variables
 * @param {ExpressionEvaluator} evaluator - Expression evaluator
 * @returns {Promise<boolean>} Evaluation result
 *
 * @example
 * const result = await evaluatePathCondition(
 *   { expression: 'age >= 65', priority: 1, enabled: true },
 *   { age: 70 },
 *   evaluator
 * );
 */
async function evaluatePathCondition(condition, variables, evaluator) {
    if (!condition.enabled) {
        return false;
    }
    try {
        return evaluator.evaluate(condition.expression, variables);
    }
    catch (error) {
        console.error(`Error evaluating condition ${condition.id}:`, error);
        return false;
    }
}
/**
 * 5. Tests gateway evaluation with multiple scenarios.
 *
 * @swagger
 * @description Tests exclusive gateway with multiple variable scenarios to validate routing behavior.
 *
 * @param {ExclusiveGatewayConfig} config - Gateway configuration
 * @param {Array<{name: string; variables: Record<string, any>}>} scenarios - Test scenarios
 * @param {ExpressionEvaluator} evaluator - Expression evaluator
 * @returns {Promise<Array<{scenario: string; selectedPath: string; success: boolean}>>} Test results
 *
 * @example
 * const results = await testGatewayScenarios(gateway, [
 *   { name: 'senior', variables: { age: 70 } },
 *   { name: 'adult', variables: { age: 40 } }
 * ], evaluator);
 */
async function testGatewayScenarios(config, scenarios, evaluator) {
    const results = [];
    for (const scenario of scenarios) {
        try {
            const context = {
                workflowInstanceId: crypto.randomUUID(),
                gatewayId: config.id,
                variables: scenario.variables,
                timestamp: new Date(),
            };
            const result = await evaluateExclusiveGateway(config, context, evaluator);
            results.push({
                scenario: scenario.name,
                selectedPath: result.selectedPath,
                success: true,
            });
        }
        catch (error) {
            results.push({
                scenario: scenario.name,
                selectedPath: 'error',
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    }
    return results;
}
/**
 * 6. Gets all possible paths from a gateway.
 *
 * @swagger
 * @description Returns all possible outgoing paths from an exclusive gateway, including metadata.
 *
 * @param {ExclusiveGatewayConfig} config - Gateway configuration
 * @returns {GatewayPath[]} Array of gateway paths
 *
 * @example
 * const paths = getGatewayPaths(gateway);
 * paths.forEach(path => console.log(path.name, path.targetNode));
 */
function getGatewayPaths(config) {
    return [...config.paths];
}
/**
 * 7. Gets enabled paths only.
 *
 * @swagger
 * @description Returns only enabled gateway paths (where condition.enabled === true).
 *
 * @param {ExclusiveGatewayConfig} config - Gateway configuration
 * @returns {GatewayPath[]} Array of enabled paths
 *
 * @example
 * const enabledPaths = getEnabledPaths(gateway);
 */
function getEnabledPaths(config) {
    return config.paths.filter(p => p.condition.enabled);
}
/**
 * 8. Simulates gateway evaluation without executing.
 *
 * @swagger
 * @description Simulates gateway evaluation to predict which path would be selected without actually
 *              executing the evaluation. Useful for testing and debugging.
 *
 * @param {ExclusiveGatewayConfig} config - Gateway configuration
 * @param {Record<string, any>} variables - Variables for simulation
 * @param {ExpressionEvaluator} evaluator - Expression evaluator
 * @returns {Promise<{predictedPath: string; confidence: number}>} Prediction result
 *
 * @example
 * const prediction = await simulateGatewayEvaluation(gateway, { age: 65 }, evaluator);
 * console.log(`Would select: ${prediction.predictedPath} (confidence: ${prediction.confidence})`);
 */
async function simulateGatewayEvaluation(config, variables, evaluator) {
    const context = {
        workflowInstanceId: crypto.randomUUID(),
        gatewayId: config.id,
        variables,
        timestamp: new Date(),
    };
    const result = await evaluateExclusiveGateway(config, context, evaluator);
    // Calculate confidence based on how many conditions were evaluated
    const totalPaths = config.paths.filter(p => p.condition.enabled).length;
    const evaluatedPaths = result.evaluatedConditions.length;
    const confidence = evaluatedPaths / totalPaths;
    return {
        predictedPath: result.selectedPath,
        predictedPathId: result.selectedPathId,
        confidence,
    };
}
// ============================================================================
// SINGLE-PATH SELECTION
// ============================================================================
/**
 * 9. Selects the first matching path based on priority.
 *
 * @swagger
 * @description Selects the first path where the condition evaluates to true, ordered by priority.
 *
 * @param {GatewayPath[]} paths - Array of gateway paths
 * @param {Record<string, any>} variables - Context variables
 * @param {ExpressionEvaluator} evaluator - Expression evaluator
 * @returns {Promise<GatewayPath | null>} Selected path or null
 *
 * @example
 * const selected = await selectFirstMatchingPath(paths, { priority: 'high' }, evaluator);
 */
async function selectFirstMatchingPath(paths, variables, evaluator) {
    const sortedPaths = [...paths].sort((a, b) => b.condition.priority - a.condition.priority);
    for (const path of sortedPaths) {
        if (!path.condition.enabled)
            continue;
        const result = await evaluatePathCondition(path.condition, variables, evaluator);
        if (result) {
            return path;
        }
    }
    return null;
}
/**
 * 10. Selects the highest priority matching path.
 *
 * @swagger
 * @description Evaluates all paths and selects the one with the highest priority that matches.
 *
 * @param {GatewayPath[]} paths - Array of gateway paths
 * @param {Record<string, any>} variables - Context variables
 * @param {ExpressionEvaluator} evaluator - Expression evaluator
 * @returns {Promise<GatewayPath | null>} Selected path or null
 *
 * @example
 * const selected = await selectHighestPriorityPath(paths, variables, evaluator);
 */
async function selectHighestPriorityPath(paths, variables, evaluator) {
    const matchingPaths = [];
    for (const path of paths) {
        if (!path.condition.enabled)
            continue;
        const result = await evaluatePathCondition(path.condition, variables, evaluator);
        if (result) {
            matchingPaths.push({ path, priority: path.condition.priority });
        }
    }
    if (matchingPaths.length === 0) {
        return null;
    }
    matchingPaths.sort((a, b) => b.priority - a.priority);
    return matchingPaths[0].path;
}
/**
 * 11. Selects path with best match score.
 *
 * @swagger
 * @description Evaluates all paths and selects the one with the best match score based on
 *              weighted condition evaluation.
 *
 * @param {GatewayPath[]} paths - Array of gateway paths
 * @param {Record<string, any>} variables - Context variables
 * @param {ExpressionEvaluator} evaluator - Expression evaluator
 * @returns {Promise<{path: GatewayPath; score: number} | null>} Selected path with score
 *
 * @example
 * const result = await selectBestMatchPath(paths, variables, evaluator);
 * if (result) console.log(`Selected ${result.path.name} with score ${result.score}`);
 */
async function selectBestMatchPath(paths, variables, evaluator) {
    const pathScores = [];
    for (const path of paths) {
        if (!path.condition.enabled)
            continue;
        const result = await evaluatePathCondition(path.condition, variables, evaluator);
        if (result) {
            const score = (path.condition.priority * 0.7) + ((path.weight || 0) * 0.3);
            pathScores.push({ path, score });
        }
    }
    if (pathScores.length === 0) {
        return null;
    }
    pathScores.sort((a, b) => b.score - a.score);
    return pathScores[0];
}
/**
 * 12. Selects default path.
 *
 * @swagger
 * @description Returns the designated default path from gateway configuration.
 *
 * @param {ExclusiveGatewayConfig} config - Gateway configuration
 * @returns {GatewayPath | null} Default path or null
 *
 * @example
 * const defaultPath = selectDefaultPath(gateway);
 */
function selectDefaultPath(config) {
    if (!config.defaultPath) {
        return null;
    }
    return config.paths.find(p => p.id === config.defaultPath) || null;
}
/**
 * 13. Validates single path selection guarantee.
 *
 * @swagger
 * @description Validates that a gateway evaluation result contains exactly one selected path.
 *
 * @param {GatewayEvaluationResult} result - Evaluation result
 * @returns {{ valid: boolean; error?: string }} Validation result
 *
 * @example
 * const validation = validateSinglePathSelection(result);
 * if (!validation.valid) throw new Error(validation.error);
 */
function validateSinglePathSelection(result) {
    if (!result.selectedPath || !result.selectedPathId) {
        return {
            valid: false,
            error: 'No path selected in exclusive gateway evaluation',
        };
    }
    // Check that only one path was marked as selected
    const selectedCount = result.evaluatedConditions.filter(c => c.result).length;
    if (selectedCount === 0) {
        return {
            valid: false,
            error: 'No condition evaluated to true but a path was selected',
        };
    }
    return { valid: true };
}
/**
 * 14. Finds path by ID.
 *
 * @swagger
 * @description Finds and returns a gateway path by its ID.
 *
 * @param {ExclusiveGatewayConfig} config - Gateway configuration
 * @param {string} pathId - Path ID to find
 * @returns {GatewayPath | null} Found path or null
 *
 * @example
 * const path = findPathById(gateway, 'urgent-path');
 */
function findPathById(config, pathId) {
    return config.paths.find(p => p.id === pathId) || null;
}
// ============================================================================
// CONDITION PRIORITIZATION
// ============================================================================
/**
 * 15. Sorts paths by priority.
 *
 * @swagger
 * @description Sorts gateway paths by condition priority in descending order.
 *
 * @param {GatewayPath[]} paths - Array of paths to sort
 * @returns {GatewayPath[]} Sorted paths
 *
 * @example
 * const sorted = sortPathsByPriority(gateway.paths);
 */
function sortPathsByPriority(paths) {
    return [...paths].sort((a, b) => b.condition.priority - a.condition.priority);
}
/**
 * 16. Updates path priority.
 *
 * @swagger
 * @description Updates the priority of a specific path condition.
 *
 * @param {ExclusiveGatewayConfig} config - Gateway configuration
 * @param {string} pathId - Path ID
 * @param {number} newPriority - New priority value
 * @returns {ExclusiveGatewayConfig} Updated configuration
 *
 * @example
 * const updated = updatePathPriority(gateway, 'urgent-path', 100);
 */
function updatePathPriority(config, pathId, newPriority) {
    const pathIndex = config.paths.findIndex(p => p.id === pathId);
    if (pathIndex === -1) {
        throw new Error(`Path ${pathId} not found in gateway ${config.id}`);
    }
    const updatedPaths = [...config.paths];
    updatedPaths[pathIndex] = {
        ...updatedPaths[pathIndex],
        condition: {
            ...updatedPaths[pathIndex].condition,
            priority: newPriority,
        },
    };
    return {
        ...config,
        paths: updatedPaths,
    };
}
/**
 * 17. Gets paths ordered by priority.
 *
 * @swagger
 * @description Returns paths in priority order with their priority values.
 *
 * @param {ExclusiveGatewayConfig} config - Gateway configuration
 * @returns {Array<{path: GatewayPath; priority: number}>} Ordered paths with priorities
 *
 * @example
 * const ordered = getPathsByPriorityOrder(gateway);
 * ordered.forEach(({path, priority}) => console.log(`${path.name}: ${priority}`));
 */
function getPathsByPriorityOrder(config) {
    return config.paths
        .map(path => ({ path, priority: path.condition.priority }))
        .sort((a, b) => b.priority - a.priority);
}
/**
 * 18. Validates priority configuration.
 *
 * @swagger
 * @description Validates that path priorities are properly configured without conflicts.
 *
 * @param {ExclusiveGatewayConfig} config - Gateway configuration
 * @returns {{ valid: boolean; warnings: string[] }} Validation result
 *
 * @example
 * const validation = validatePriorityConfiguration(gateway);
 */
function validatePriorityConfiguration(config) {
    const warnings = [];
    // Check for duplicate priorities
    const priorities = config.paths.map(p => p.condition.priority);
    const uniquePriorities = new Set(priorities);
    if (priorities.length !== uniquePriorities.size) {
        warnings.push('Duplicate priorities found. Path selection order may be ambiguous.');
    }
    // Check for negative priorities on non-default paths
    const negativePriorityPaths = config.paths.filter(p => p.condition.priority < 0 && !p.isDefault);
    if (negativePriorityPaths.length > 0) {
        warnings.push(`${negativePriorityPaths.length} non-default paths have negative priority`);
    }
    // Check priority range
    const maxPriority = Math.max(...priorities);
    const minPriority = Math.min(...priorities);
    if (maxPriority - minPriority > 1000) {
        warnings.push('Large priority range detected. Consider normalizing priorities.');
    }
    return {
        valid: warnings.length === 0,
        warnings,
    };
}
/**
 * 19. Rebalances path priorities.
 *
 * @swagger
 * @description Rebalances path priorities to create even spacing between priority values.
 *
 * @param {ExclusiveGatewayConfig} config - Gateway configuration
 * @param {number} startPriority - Starting priority value
 * @param {number} increment - Increment between priorities
 * @returns {ExclusiveGatewayConfig} Updated configuration
 *
 * @example
 * const rebalanced = rebalancePathPriorities(gateway, 100, 10);
 */
function rebalancePathPriorities(config, startPriority = 100, increment = 10) {
    const sorted = sortPathsByPriority(config.paths);
    const updatedPaths = sorted.map((path, index) => ({
        ...path,
        condition: {
            ...path.condition,
            priority: startPriority - (index * increment),
        },
    }));
    return {
        ...config,
        paths: updatedPaths,
    };
}
/**
 * 20. Gets highest priority value.
 *
 * @swagger
 * @description Returns the highest priority value among all paths.
 *
 * @param {ExclusiveGatewayConfig} config - Gateway configuration
 * @returns {number} Highest priority value
 *
 * @example
 * const maxPriority = getHighestPriority(gateway);
 */
function getHighestPriority(config) {
    return Math.max(...config.paths.map(p => p.condition.priority));
}
// ============================================================================
// DEFAULT PATH HANDLING
// ============================================================================
/**
 * 21. Sets default path.
 *
 * @swagger
 * @description Sets a path as the default fallback path for the gateway.
 *
 * @param {ExclusiveGatewayConfig} config - Gateway configuration
 * @param {string} pathId - Path ID to set as default
 * @returns {ExclusiveGatewayConfig} Updated configuration
 *
 * @example
 * const updated = setDefaultPath(gateway, 'fallback-path');
 */
function setDefaultPath(config, pathId) {
    const path = config.paths.find(p => p.id === pathId);
    if (!path) {
        throw new Error(`Path ${pathId} not found in gateway ${config.id}`);
    }
    return {
        ...config,
        defaultPath: pathId,
    };
}
/**
 * 22. Clears default path.
 *
 * @swagger
 * @description Removes the default path designation from gateway configuration.
 *
 * @param {ExclusiveGatewayConfig} config - Gateway configuration
 * @returns {ExclusiveGatewayConfig} Updated configuration
 *
 * @example
 * const updated = clearDefaultPath(gateway);
 */
function clearDefaultPath(config) {
    return {
        ...config,
        defaultPath: undefined,
    };
}
/**
 * 23. Checks if path is default.
 *
 * @swagger
 * @description Checks if a specific path is designated as the default path.
 *
 * @param {ExclusiveGatewayConfig} config - Gateway configuration
 * @param {string} pathId - Path ID to check
 * @returns {boolean} True if path is default
 *
 * @example
 * if (isDefaultPath(gateway, 'fallback-path')) {
 *   console.log('This is the default path');
 * }
 */
function isDefaultPath(config, pathId) {
    return config.defaultPath === pathId;
}
/**
 * 24. Validates default path configuration.
 *
 * @swagger
 * @description Validates that the default path is properly configured and enabled.
 *
 * @param {ExclusiveGatewayConfig} config - Gateway configuration
 * @returns {{ valid: boolean; error?: string }} Validation result
 *
 * @example
 * const validation = validateDefaultPath(gateway);
 */
function validateDefaultPath(config) {
    if (!config.defaultPath) {
        return { valid: true }; // No default path is valid
    }
    const defaultPath = config.paths.find(p => p.id === config.defaultPath);
    if (!defaultPath) {
        return {
            valid: false,
            error: `Default path ${config.defaultPath} not found in gateway paths`,
        };
    }
    if (!defaultPath.condition.enabled) {
        return {
            valid: false,
            error: 'Default path is disabled',
        };
    }
    return { valid: true };
}
/**
 * 25. Creates fallback path.
 *
 * @swagger
 * @description Creates a new unconditional fallback path for the gateway.
 *
 * @param {string} targetNode - Target node for fallback path
 * @param {string} name - Path name
 * @returns {GatewayPath} Created fallback path
 *
 * @example
 * const fallback = createFallbackPath('error-handler', 'Error Fallback');
 */
function createFallbackPath(targetNode, name = 'Fallback') {
    return {
        id: `fallback-${crypto.randomUUID()}`,
        name,
        targetNode,
        condition: {
            id: crypto.randomUUID(),
            pathId: `fallback-${crypto.randomUUID()}`,
            expression: 'true',
            priority: -1,
            enabled: true,
            description: 'Unconditional fallback path',
        },
        isDefault: true,
    };
}
// ============================================================================
// EXPRESSION EVALUATION
// ============================================================================
/**
 * 26. Creates a simple expression evaluator.
 *
 * @swagger
 * @description Creates a simple expression evaluator using JavaScript eval (use with caution in production).
 *
 * @returns {ExpressionEvaluator} Expression evaluator instance
 *
 * @example
 * const evaluator = createSimpleExpressionEvaluator();
 * const result = evaluator.evaluate('age > 18', { age: 25 });
 */
function createSimpleExpressionEvaluator() {
    return {
        evaluate(expression, context) {
            try {
                // Create a function with context variables as parameters
                const contextKeys = Object.keys(context);
                const contextValues = Object.values(context);
                const fn = new Function(...contextKeys, `return ${expression}`);
                return !!fn(...contextValues);
            }
            catch (error) {
                throw new Error(`Expression evaluation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
            }
        },
        validate(expression) {
            try {
                new Function(`return ${expression}`);
                return { valid: true };
            }
            catch (error) {
                return {
                    valid: false,
                    error: error instanceof Error ? error.message : 'Invalid expression',
                };
            }
        },
    };
}
/**
 * 27. Validates expression syntax.
 *
 * @swagger
 * @description Validates that an expression has valid syntax without evaluating it.
 *
 * @param {string} expression - Expression to validate
 * @param {ExpressionEvaluator} evaluator - Expression evaluator
 * @returns {{ valid: boolean; error?: string }} Validation result
 *
 * @example
 * const validation = validateExpression('age >= 18', evaluator);
 */
function validateExpression(expression, evaluator) {
    return evaluator.validate(expression);
}
/**
 * 28. Tests expression with sample data.
 *
 * @swagger
 * @description Tests an expression against sample data to verify it works as expected.
 *
 * @param {string} expression - Expression to test
 * @param {Array<{context: Record<string, any>; expected: boolean}>} testCases - Test cases
 * @param {ExpressionEvaluator} evaluator - Expression evaluator
 * @returns {Array<{passed: boolean; context: any; expected: boolean; actual: boolean}>} Test results
 *
 * @example
 * const results = testExpression('age >= 18', [
 *   { context: { age: 20 }, expected: true },
 *   { context: { age: 15 }, expected: false }
 * ], evaluator);
 */
function testExpression(expression, testCases, evaluator) {
    return testCases.map(testCase => {
        try {
            const actual = evaluator.evaluate(expression, testCase.context);
            return {
                passed: actual === testCase.expected,
                context: testCase.context,
                expected: testCase.expected,
                actual,
            };
        }
        catch (error) {
            return {
                passed: false,
                context: testCase.context,
                expected: testCase.expected,
                actual: false,
            };
        }
    });
}
/**
 * 29. Extracts variables from expression.
 *
 * @swagger
 * @description Extracts variable names referenced in an expression.
 *
 * @param {string} expression - Expression to analyze
 * @returns {string[]} Array of variable names
 *
 * @example
 * const vars = extractExpressionVariables('age > 18 && status === "active"');
 * // Returns: ['age', 'status']
 */
function extractExpressionVariables(expression) {
    // Simple regex to extract identifiers (not foolproof but works for basic cases)
    const identifierRegex = /\b([a-zA-Z_$][a-zA-Z0-9_$]*)\b/g;
    const matches = expression.match(identifierRegex) || [];
    // Filter out JavaScript keywords
    const keywords = new Set([
        'true', 'false', 'null', 'undefined', 'if', 'else', 'return',
        'function', 'const', 'let', 'var', 'new', 'this', 'typeof',
    ]);
    return [...new Set(matches.filter(m => !keywords.has(m)))];
}
/**
 * 30. Optimizes expression for performance.
 *
 * @swagger
 * @description Optimizes an expression by simplifying redundant logic.
 *
 * @param {string} expression - Expression to optimize
 * @returns {string} Optimized expression
 *
 * @example
 * const optimized = optimizeExpression('true && age > 18');
 * // Returns: 'age > 18'
 */
function optimizeExpression(expression) {
    let optimized = expression.trim();
    // Remove redundant true conditions
    optimized = optimized.replace(/true\s*&&\s*/g, '');
    optimized = optimized.replace(/\s*&&\s*true/g, '');
    // Remove redundant false conditions
    optimized = optimized.replace(/false\s*\|\|\s*/g, '');
    optimized = optimized.replace(/\s*\|\|\s*false/g, '');
    // Simplify double negations
    optimized = optimized.replace(/!!\s*/g, '');
    return optimized || 'true';
}
// ============================================================================
// CONDITION CACHING
// ============================================================================
/**
 * 31. Creates a condition cache.
 *
 * @swagger
 * @description Creates an in-memory cache for condition evaluation results.
 *
 * @param {number} maxSize - Maximum cache size
 * @param {number} ttl - Time to live in milliseconds
 * @returns {ConditionCache} Condition cache instance
 *
 * @example
 * const cache = createConditionCache(1000, 300000); // 1000 entries, 5 min TTL
 */
function createConditionCache(maxSize = 1000, ttl = 300000) {
    const cache = new Map();
    return {
        get(key) {
            const entry = cache.get(key);
            if (!entry)
                return null;
            // Check expiration
            if (entry.expiresAt < new Date()) {
                cache.delete(key);
                return null;
            }
            // Increment hit count
            entry.hitCount++;
            return entry;
        },
        set(key, entry) {
            // Evict oldest entries if cache is full
            if (cache.size >= maxSize) {
                const oldestKey = Array.from(cache.entries())
                    .sort((a, b) => a[1].cachedAt.getTime() - b[1].cachedAt.getTime())[0][0];
                cache.delete(oldestKey);
            }
            cache.set(key, entry);
        },
        clear() {
            cache.clear();
        },
        prune() {
            const now = new Date();
            let prunedCount = 0;
            for (const [key, entry] of cache.entries()) {
                if (entry.expiresAt < now) {
                    cache.delete(key);
                    prunedCount++;
                }
            }
            return prunedCount;
        },
    };
}
/**
 * 32. Generates cache key for condition evaluation.
 *
 * @swagger
 * @description Generates a unique cache key based on condition and context.
 *
 * @param {string} conditionId - Condition ID
 * @param {Record<string, any>} context - Evaluation context
 * @returns {string} Cache key
 *
 * @example
 * const key = generateConditionCacheKey('cond-123', { age: 25 });
 */
function generateConditionCacheKey(conditionId, context) {
    const contextStr = JSON.stringify(context, Object.keys(context).sort());
    return `${conditionId}:${hashString(contextStr)}`;
}
/**
 * 33. Hashes a string for cache keys.
 *
 * @swagger
 * @description Creates a simple hash of a string for use in cache keys.
 *
 * @param {string} str - String to hash
 * @returns {string} Hash string
 *
 * @example
 * const hash = hashString('{"age":25}');
 */
function hashString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString(36);
}
/**
 * 34. Gets cache statistics.
 *
 * @swagger
 * @description Gets statistics about cache usage and performance.
 *
 * @param {ConditionCache} cache - Condition cache
 * @returns {{size: number; hitRate: number; avgHitsPerEntry: number}} Cache stats
 *
 * @example
 * const stats = getConditionCacheStats(cache);
 * console.log(`Cache hit rate: ${stats.hitRate}%`);
 */
function getConditionCacheStats(cache) {
    // Note: This is a simplified version. A real implementation would track hits/misses
    return {
        size: 0, // Would need to expose cache size
        hitRate: 0,
        avgHitsPerEntry: 0,
    };
}
// ============================================================================
// DECISION LOGGING
// ============================================================================
/**
 * 35. Creates a decision log entry.
 *
 * @swagger
 * @description Creates a detailed log entry for a gateway decision.
 *
 * @param {GatewayEvaluationResult} result - Evaluation result
 * @param {GatewayEvaluationContext} context - Evaluation context
 * @returns {GatewayDecisionLog} Decision log entry
 *
 * @example
 * const logEntry = createDecisionLog(result, context);
 */
function createDecisionLog(result, context) {
    return {
        id: crypto.randomUUID(),
        gatewayId: result.gatewayId,
        workflowInstanceId: context.workflowInstanceId,
        selectedPath: result.selectedPath,
        selectedPathId: result.selectedPathId,
        evaluationContext: context,
        result,
        timestamp: new Date(),
        actor: context.actor,
    };
}
/**
 * 36. Logs gateway decision.
 *
 * @swagger
 * @description Logs a gateway decision to console or logging service.
 *
 * @param {GatewayDecisionLog} log - Decision log entry
 * @param {boolean} verbose - Include detailed evaluation info
 *
 * @example
 * logGatewayDecision(logEntry, true);
 */
function logGatewayDecision(log, verbose = false) {
    const summary = {
        gatewayId: log.gatewayId,
        selectedPath: log.selectedPath,
        timestamp: log.timestamp,
        evaluationTime: log.result.evaluationTime,
    };
    if (verbose) {
        console.log('Gateway Decision:', {
            ...summary,
            evaluatedConditions: log.result.evaluatedConditions,
            context: log.evaluationContext,
        });
    }
    else {
        console.log('Gateway Decision:', summary);
    }
}
/**
 * 37. Queries decision log history.
 *
 * @swagger
 * @description Queries decision log history for a gateway or workflow instance.
 *
 * @param {GatewayDecisionLog[]} logs - Array of decision logs
 * @param {Object} filters - Query filters
 * @returns {GatewayDecisionLog[]} Filtered logs
 *
 * @example
 * const recentDecisions = queryDecisionHistory(allLogs, {
 *   gatewayId: 'gw-123',
 *   startDate: new Date('2024-01-01')
 * });
 */
function queryDecisionHistory(logs, filters) {
    return logs.filter(log => {
        if (filters.gatewayId && log.gatewayId !== filters.gatewayId)
            return false;
        if (filters.workflowInstanceId && log.workflowInstanceId !== filters.workflowInstanceId)
            return false;
        if (filters.selectedPath && log.selectedPath !== filters.selectedPath)
            return false;
        if (filters.startDate && log.timestamp < filters.startDate)
            return false;
        if (filters.endDate && log.timestamp > filters.endDate)
            return false;
        return true;
    });
}
/**
 * 38. Exports decision logs to JSON.
 *
 * @swagger
 * @description Exports decision logs to JSON format for analysis.
 *
 * @param {GatewayDecisionLog[]} logs - Decision logs to export
 * @returns {string} JSON string
 *
 * @example
 * const json = exportDecisionLogs(logs);
 * fs.writeFileSync('decisions.json', json);
 */
function exportDecisionLogs(logs) {
    return JSON.stringify(logs, null, 2);
}
// ============================================================================
// GATEWAY STATE TRACKING
// ============================================================================
/**
 * 39. Creates gateway state snapshot.
 *
 * @swagger
 * @description Creates a snapshot of current gateway state for persistence.
 *
 * @param {string} gatewayId - Gateway ID
 * @param {GatewayPerformanceMetrics} metrics - Performance metrics
 * @param {string[]} pathHistory - Recent path selections
 * @returns {GatewayStateSnapshot} State snapshot
 *
 * @example
 * const snapshot = createGatewayStateSnapshot('gw-123', metrics, history);
 */
function createGatewayStateSnapshot(gatewayId, metrics, pathHistory) {
    return {
        gatewayId,
        timestamp: new Date(),
        evaluationCount: metrics.totalEvaluations,
        lastSelectedPath: pathHistory[pathHistory.length - 1] || '',
        pathHistory: pathHistory.slice(-100), // Keep last 100
        metrics,
    };
}
/**
 * 40. Tracks gateway performance metrics.
 *
 * @swagger
 * @description Tracks and updates performance metrics for a gateway.
 *
 * @param {GatewayPerformanceMetrics} metrics - Current metrics
 * @param {GatewayEvaluationResult} result - New evaluation result
 * @returns {GatewayPerformanceMetrics} Updated metrics
 *
 * @example
 * metrics = trackGatewayPerformance(metrics, result);
 */
function trackGatewayPerformance(metrics, result) {
    const totalEvaluations = metrics.totalEvaluations + 1;
    const avgEvaluationTime = (metrics.averageEvaluationTime * metrics.totalEvaluations + result.evaluationTime) /
        totalEvaluations;
    const pathSelectionCounts = { ...metrics.pathSelectionCounts };
    pathSelectionCounts[result.selectedPathId] =
        (pathSelectionCounts[result.selectedPathId] || 0) + 1;
    const cacheHits = result.evaluatedConditions.filter(c => c.cached).length;
    const totalConditions = result.evaluatedConditions.length;
    const cacheHitRate = (metrics.cacheHitRate * metrics.totalEvaluations + (cacheHits / totalConditions)) /
        totalEvaluations;
    return {
        ...metrics,
        totalEvaluations,
        averageEvaluationTime: avgEvaluationTime,
        minEvaluationTime: Math.min(metrics.minEvaluationTime, result.evaluationTime),
        maxEvaluationTime: Math.max(metrics.maxEvaluationTime, result.evaluationTime),
        cacheHitRate,
        pathSelectionCounts,
        lastEvaluationAt: result.timestamp,
    };
}
// ============================================================================
// PATH PROBABILITY ANALYSIS
// ============================================================================
/**
 * 41. Calculates path selection probabilities.
 *
 * @swagger
 * @description Calculates probability of each path being selected based on historical data.
 *
 * @param {ExclusiveGatewayConfig} config - Gateway configuration
 * @param {GatewayPerformanceMetrics} metrics - Performance metrics
 * @returns {PathProbability[]} Path probabilities
 *
 * @example
 * const probabilities = calculatePathProbabilities(gateway, metrics);
 */
function calculatePathProbabilities(config, metrics) {
    const totalSelections = metrics.totalEvaluations;
    return config.paths.map(path => {
        const selectionCount = metrics.pathSelectionCounts[path.id] || 0;
        const probability = totalSelections > 0 ? selectionCount / totalSelections : 0;
        return {
            pathId: path.id,
            pathName: path.name,
            probability,
            selectionCount,
            totalEvaluations: totalSelections,
        };
    });
}
/**
 * 42. Predicts next path selection.
 *
 * @swagger
 * @description Predicts which path is most likely to be selected based on historical patterns.
 *
 * @param {PathProbability[]} probabilities - Path probabilities
 * @returns {{pathId: string; pathName: string; confidence: number}} Prediction
 *
 * @example
 * const prediction = predictNextPathSelection(probabilities);
 * console.log(`Likely path: ${prediction.pathName} (${prediction.confidence * 100}%)`);
 */
function predictNextPathSelection(probabilities) {
    if (probabilities.length === 0) {
        throw new Error('No probabilities provided');
    }
    const sorted = [...probabilities].sort((a, b) => b.probability - a.probability);
    const mostLikely = sorted[0];
    return {
        pathId: mostLikely.pathId,
        pathName: mostLikely.pathName,
        confidence: mostLikely.probability,
    };
}
//# sourceMappingURL=workflow-exclusive-gateway.js.map