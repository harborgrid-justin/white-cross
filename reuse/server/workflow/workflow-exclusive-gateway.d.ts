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
/**
 * Zod schema for gateway path condition.
 */
export declare const GatewayPathConditionSchema: any;
/**
 * Zod schema for gateway path.
 */
export declare const GatewayPathSchema: any;
/**
 * Zod schema for exclusive gateway configuration.
 */
export declare const ExclusiveGatewayConfigSchema: any;
/**
 * Zod schema for gateway evaluation context.
 */
export declare const GatewayEvaluationContextSchema: any;
/**
 * Zod schema for gateway evaluation result.
 */
export declare const GatewayEvaluationResultSchema: any;
/**
 * Zod schema for gateway decision log entry.
 */
export declare const GatewayDecisionLogSchema: any;
/**
 * Zod schema for condition cache entry.
 */
export declare const ConditionCacheEntrySchema: any;
/**
 * Zod schema for gateway performance metrics.
 */
export declare const GatewayPerformanceMetricsSchema: any;
/**
 * Zod schema for path probability.
 */
export declare const PathProbabilitySchema: any;
export interface GatewayPathCondition {
    id: string;
    pathId: string;
    expression: string;
    priority: number;
    enabled: boolean;
    description?: string;
    metadata?: Record<string, any>;
}
export interface GatewayPath {
    id: string;
    name: string;
    targetNode: string;
    condition: GatewayPathCondition;
    isDefault: boolean;
    weight?: number;
    metadata?: Record<string, any>;
}
export interface ExclusiveGatewayConfig {
    id: string;
    name: string;
    paths: GatewayPath[];
    defaultPath?: string;
    evaluationStrategy: 'priority' | 'first-match' | 'best-match';
    enableCaching: boolean;
    cacheTimeout: number;
    enableLogging: boolean;
    strictMode: boolean;
    metadata?: Record<string, any>;
}
export interface GatewayEvaluationContext {
    workflowInstanceId: string;
    gatewayId: string;
    variables: Record<string, any>;
    timestamp: Date;
    actor?: string;
    metadata?: Record<string, any>;
}
export interface GatewayEvaluationResult {
    gatewayId: string;
    selectedPath: string;
    selectedPathId: string;
    evaluatedConditions: Array<{
        pathId: string;
        conditionId: string;
        result: boolean;
        evaluationTime: number;
        cached: boolean;
    }>;
    evaluationTime: number;
    timestamp: Date;
    reason?: string;
    metadata?: Record<string, any>;
}
export interface GatewayDecisionLog {
    id: string;
    gatewayId: string;
    workflowInstanceId: string;
    selectedPath: string;
    selectedPathId: string;
    evaluationContext: GatewayEvaluationContext;
    result: GatewayEvaluationResult;
    timestamp: Date;
    actor?: string;
}
export interface ConditionCacheEntry {
    conditionId: string;
    expression: string;
    contextHash: string;
    result: boolean;
    cachedAt: Date;
    expiresAt: Date;
    hitCount: number;
}
export interface GatewayPerformanceMetrics {
    gatewayId: string;
    totalEvaluations: number;
    averageEvaluationTime: number;
    minEvaluationTime: number;
    maxEvaluationTime: number;
    cacheHitRate: number;
    pathSelectionCounts: Record<string, number>;
    errorCount: number;
    lastEvaluationAt?: Date;
}
export interface PathProbability {
    pathId: string;
    pathName: string;
    probability: number;
    selectionCount: number;
    totalEvaluations: number;
    lastSelectedAt?: Date;
}
export interface ExpressionEvaluator {
    evaluate(expression: string, context: Record<string, any>): boolean;
    validate(expression: string): {
        valid: boolean;
        error?: string;
    };
}
export interface ConditionCache {
    get(key: string): ConditionCacheEntry | null;
    set(key: string, entry: ConditionCacheEntry): void;
    clear(): void;
    prune(): number;
}
export interface GatewayStateSnapshot {
    gatewayId: string;
    timestamp: Date;
    evaluationCount: number;
    lastSelectedPath: string;
    pathHistory: string[];
    metrics: GatewayPerformanceMetrics;
}
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
export declare function evaluateExclusiveGateway(config: ExclusiveGatewayConfig, context: GatewayEvaluationContext, evaluator: ExpressionEvaluator): Promise<GatewayEvaluationResult>;
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
export declare function createExclusiveGateway(config: Partial<ExclusiveGatewayConfig> & {
    id: string;
    name: string;
    paths: GatewayPath[];
}): ExclusiveGatewayConfig;
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
export declare function validateExclusiveGatewayPaths(config: ExclusiveGatewayConfig): {
    valid: boolean;
    issues: string[];
};
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
export declare function evaluatePathCondition(condition: GatewayPathCondition, variables: Record<string, any>, evaluator: ExpressionEvaluator): Promise<boolean>;
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
export declare function testGatewayScenarios(config: ExclusiveGatewayConfig, scenarios: Array<{
    name: string;
    variables: Record<string, any>;
}>, evaluator: ExpressionEvaluator): Promise<Array<{
    scenario: string;
    selectedPath: string;
    success: boolean;
    error?: string;
}>>;
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
export declare function getGatewayPaths(config: ExclusiveGatewayConfig): GatewayPath[];
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
export declare function getEnabledPaths(config: ExclusiveGatewayConfig): GatewayPath[];
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
export declare function simulateGatewayEvaluation(config: ExclusiveGatewayConfig, variables: Record<string, any>, evaluator: ExpressionEvaluator): Promise<{
    predictedPath: string;
    predictedPathId: string;
    confidence: number;
}>;
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
export declare function selectFirstMatchingPath(paths: GatewayPath[], variables: Record<string, any>, evaluator: ExpressionEvaluator): Promise<GatewayPath | null>;
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
export declare function selectHighestPriorityPath(paths: GatewayPath[], variables: Record<string, any>, evaluator: ExpressionEvaluator): Promise<GatewayPath | null>;
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
export declare function selectBestMatchPath(paths: GatewayPath[], variables: Record<string, any>, evaluator: ExpressionEvaluator): Promise<{
    path: GatewayPath;
    score: number;
} | null>;
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
export declare function selectDefaultPath(config: ExclusiveGatewayConfig): GatewayPath | null;
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
export declare function validateSinglePathSelection(result: GatewayEvaluationResult): {
    valid: boolean;
    error?: string;
};
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
export declare function findPathById(config: ExclusiveGatewayConfig, pathId: string): GatewayPath | null;
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
export declare function sortPathsByPriority(paths: GatewayPath[]): GatewayPath[];
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
export declare function updatePathPriority(config: ExclusiveGatewayConfig, pathId: string, newPriority: number): ExclusiveGatewayConfig;
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
export declare function getPathsByPriorityOrder(config: ExclusiveGatewayConfig): Array<{
    path: GatewayPath;
    priority: number;
}>;
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
export declare function validatePriorityConfiguration(config: ExclusiveGatewayConfig): {
    valid: boolean;
    warnings: string[];
};
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
export declare function rebalancePathPriorities(config: ExclusiveGatewayConfig, startPriority?: number, increment?: number): ExclusiveGatewayConfig;
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
export declare function getHighestPriority(config: ExclusiveGatewayConfig): number;
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
export declare function setDefaultPath(config: ExclusiveGatewayConfig, pathId: string): ExclusiveGatewayConfig;
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
export declare function clearDefaultPath(config: ExclusiveGatewayConfig): ExclusiveGatewayConfig;
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
export declare function isDefaultPath(config: ExclusiveGatewayConfig, pathId: string): boolean;
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
export declare function validateDefaultPath(config: ExclusiveGatewayConfig): {
    valid: boolean;
    error?: string;
};
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
export declare function createFallbackPath(targetNode: string, name?: string): GatewayPath;
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
export declare function createSimpleExpressionEvaluator(): ExpressionEvaluator;
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
export declare function validateExpression(expression: string, evaluator: ExpressionEvaluator): {
    valid: boolean;
    error?: string;
};
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
export declare function testExpression(expression: string, testCases: Array<{
    context: Record<string, any>;
    expected: boolean;
}>, evaluator: ExpressionEvaluator): Array<{
    passed: boolean;
    context: any;
    expected: boolean;
    actual: boolean;
}>;
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
export declare function extractExpressionVariables(expression: string): string[];
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
export declare function optimizeExpression(expression: string): string;
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
export declare function createConditionCache(maxSize?: number, ttl?: number): ConditionCache;
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
export declare function generateConditionCacheKey(conditionId: string, context: Record<string, any>): string;
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
export declare function hashString(str: string): string;
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
export declare function getConditionCacheStats(cache: ConditionCache): {
    size: number;
    hitRate: number;
    avgHitsPerEntry: number;
};
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
export declare function createDecisionLog(result: GatewayEvaluationResult, context: GatewayEvaluationContext): GatewayDecisionLog;
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
export declare function logGatewayDecision(log: GatewayDecisionLog, verbose?: boolean): void;
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
export declare function queryDecisionHistory(logs: GatewayDecisionLog[], filters: {
    gatewayId?: string;
    workflowInstanceId?: string;
    selectedPath?: string;
    startDate?: Date;
    endDate?: Date;
}): GatewayDecisionLog[];
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
export declare function exportDecisionLogs(logs: GatewayDecisionLog[]): string;
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
export declare function createGatewayStateSnapshot(gatewayId: string, metrics: GatewayPerformanceMetrics, pathHistory: string[]): GatewayStateSnapshot;
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
export declare function trackGatewayPerformance(metrics: GatewayPerformanceMetrics, result: GatewayEvaluationResult): GatewayPerformanceMetrics;
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
export declare function calculatePathProbabilities(config: ExclusiveGatewayConfig, metrics: GatewayPerformanceMetrics): PathProbability[];
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
export declare function predictNextPathSelection(probabilities: PathProbability[]): {
    pathId: string;
    pathName: string;
    confidence: number;
};
//# sourceMappingURL=workflow-exclusive-gateway.d.ts.map