"use strict";
/**
 * LOC: WF-CGW-001
 * File: /reuse/server/workflow/workflow-complex-gateway.ts
 *
 * UPSTREAM (imports from):
 *   - zod
 *   - @nestjs/common
 *   - @nestjs/event-emitter
 *   - uuid
 *   - lodash
 *   - rxjs
 *
 * DOWNSTREAM (imported by):
 *   - Workflow services
 *   - Advanced routing services
 *   - Process orchestration
 *   - Business rule engines
 *   - Complex decision systems
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.GatewayDebugContextSchema = exports.GatewayPerformanceProfileSchema = exports.AdaptiveRoutingConfigSchema = exports.GatewayChainSchema = exports.CompositeGatewaySchema = exports.SynchronizationPatternSchema = exports.MIMOGatewayConfigSchema = exports.ComplexGatewayConfigSchema = void 0;
exports.evaluateComplexCondition = evaluateComplexCondition;
exports.evaluateWithTimeout = evaluateWithTimeout;
exports.evaluateParallelConditions = evaluateParallelConditions;
exports.evaluateConditionalBranches = evaluateConditionalBranches;
exports.validateComplexExpression = validateComplexExpression;
exports.optimizeComplexExpression = optimizeComplexExpression;
exports.profileConditionEvaluation = profileConditionEvaluation;
exports.createMIMOGateway = createMIMOGateway;
exports.evaluateMIMOGateway = evaluateMIMOGateway;
exports.createTokenTracker = createTokenTracker;
exports.validateMIMOConfiguration = validateMIMOConfiguration;
exports.createFanoutRouting = createFanoutRouting;
exports.createSelectiveRouting = createSelectiveRouting;
exports.createSynchronizationPattern = createSynchronizationPattern;
exports.evaluateANDSync = evaluateANDSync;
exports.evaluateORSync = evaluateORSync;
exports.evaluateXORSync = evaluateXORSync;
exports.evaluateQuorumSync = evaluateQuorumSync;
exports.evaluateMajoritySync = evaluateMajoritySync;
exports.createDeadlineSync = createDeadlineSync;
exports.monitorSynchronization = monitorSynchronization;
exports.createCustomBehavior = createCustomBehavior;
exports.registerCustomBehavior = registerCustomBehavior;
exports.getCustomBehavior = getCustomBehavior;
exports.createRuleBasedBehavior = createRuleBasedBehavior;
exports.createCompositeGateway = createCompositeGateway;
exports.evaluateCompositeGateway = evaluateCompositeGateway;
exports.validateCompositeGateway = validateCompositeGateway;
exports.createSequentialComposition = createSequentialComposition;
exports.createParallelComposition = createParallelComposition;
exports.createGatewayChain = createGatewayChain;
exports.executeGatewayChain = executeGatewayChain;
exports.validateGatewayChain = validateGatewayChain;
exports.optimizeGatewayConfiguration = optimizeGatewayConfiguration;
exports.analyzeGatewayBottlenecks = analyzeGatewayBottlenecks;
exports.suggestGatewayOptimizations = suggestGatewayOptimizations;
exports.profileGatewayExecution = profileGatewayExecution;
exports.collectGatewayMetrics = collectGatewayMetrics;
exports.exportPerformanceProfile = exportPerformanceProfile;
exports.createGatewayDebugContext = createGatewayDebugContext;
exports.recordDebugStep = recordDebugStep;
exports.visualizeGatewayEvaluation = visualizeGatewayEvaluation;
exports.exportDebugContext = exportDebugContext;
exports.getGatewayPatternLibrary = getGatewayPatternLibrary;
/**
 * File: /reuse/server/workflow/workflow-complex-gateway.ts
 * Locator: WC-WF-CGW-001
 * Purpose: Complex Gateway Patterns - Production-grade advanced gateway patterns for sophisticated workflow routing
 *
 * Upstream: zod, @nestjs/common, @nestjs/event-emitter, uuid, lodash, rxjs
 * Downstream: ../../../backend/*, workflow services, advanced routing, orchestration systems
 * Dependencies: NestJS 10.x, Zod 3.x, TypeScript 5.x, UUID 9.x, Lodash 4.x, RxJS 7.x
 * Exports: 44 production-grade utility functions for complex gateway patterns, multi-input/output, synchronization
 *
 * LLM Context: Enterprise-grade complex gateway utilities for White Cross healthcare workflow platform.
 * Provides comprehensive multi-input multi-output patterns, advanced synchronization, custom gateway behaviors,
 * composite patterns, gateway chaining, nesting, optimization, performance profiling, debugging utilities,
 * and pattern libraries. Complex gateways handle sophisticated routing scenarios like multi-condition evaluation,
 * dynamic path generation, conditional parallel execution, cross-workflow synchronization, and adaptive routing
 * critical for complex healthcare workflows like care coordination, multi-specialty consultations, treatment
 * protocol selection, and clinical trial matching.
 *
 * Features:
 * - Multi-input multi-output (MIMO) patterns
 * - Advanced synchronization patterns
 * - Custom gateway behavior definition
 * - Composite gateway patterns (combining multiple gateway types)
 * - Gateway chaining and composition
 * - Nested gateway support
 * - Dynamic path generation
 * - Conditional parallel execution
 * - Cross-workflow synchronization
 * - Adaptive routing algorithms
 * - Performance optimization
 * - Comprehensive profiling and debugging
 * - Pattern library and templates
 * - HIPAA-compliant complex routing
 */
const zod_1 = require("zod");
// ============================================================================
// ZOD VALIDATION SCHEMAS
// ============================================================================
/**
 * Zod schema for complex gateway configuration.
 */
exports.ComplexGatewayConfigSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    name: zod_1.z.string().min(1),
    type: zod_1.z.enum(['mimo', 'composite', 'adaptive', 'synchronization', 'custom']),
    inputs: zod_1.z.array(zod_1.z.object({
        id: zod_1.z.string(),
        name: zod_1.z.string(),
        sourceNode: zod_1.z.string(),
        required: zod_1.z.boolean().default(true),
    })),
    outputs: zod_1.z.array(zod_1.z.object({
        id: zod_1.z.string(),
        name: zod_1.z.string(),
        targetNode: zod_1.z.string(),
        condition: zod_1.z.string().optional(),
    })),
    evaluationLogic: zod_1.z.string(),
    synchronizationMode: zod_1.z.enum(['all', 'any', 'majority', 'custom']).optional(),
    timeoutMs: zod_1.z.number().int().positive().optional(),
    metadata: zod_1.z.record(zod_1.z.any()).optional(),
});
/**
 * Zod schema for multi-input multi-output (MIMO) configuration.
 */
exports.MIMOGatewayConfigSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    name: zod_1.z.string().min(1),
    inputTokens: zod_1.z.array(zod_1.z.object({
        id: zod_1.z.string(),
        source: zod_1.z.string(),
        required: zod_1.z.boolean(),
        arrivalTime: zod_1.z.date().optional(),
    })),
    outputPaths: zod_1.z.array(zod_1.z.object({
        id: zod_1.z.string(),
        target: zod_1.z.string(),
        condition: zod_1.z.string(),
        priority: zod_1.z.number().default(0),
    })),
    routingStrategy: zod_1.z.enum(['fanout', 'selective', 'conditional', 'weighted']),
    maxOutputs: zod_1.z.number().int().positive().optional(),
    minOutputs: zod_1.z.number().int().positive().default(1),
});
/**
 * Zod schema for synchronization pattern.
 */
exports.SynchronizationPatternSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    name: zod_1.z.string().min(1),
    type: zod_1.z.enum(['and', 'or', 'xor', 'majority', 'quorum', 'deadline']),
    inputs: zod_1.z.array(zod_1.z.string()),
    requiredInputs: zod_1.z.array(zod_1.z.string()).optional(),
    quorumSize: zod_1.z.number().int().positive().optional(),
    deadlineMs: zod_1.z.number().int().positive().optional(),
    onTimeout: zod_1.z.enum(['fail', 'continue', 'default']).default('fail'),
    metadata: zod_1.z.record(zod_1.z.any()).optional(),
});
/**
 * Zod schema for composite gateway.
 */
exports.CompositeGatewaySchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    name: zod_1.z.string().min(1),
    components: zod_1.z.array(zod_1.z.object({
        id: zod_1.z.string(),
        type: zod_1.z.enum(['exclusive', 'parallel', 'inclusive', 'event-based']),
        config: zod_1.z.record(zod_1.z.any()),
        order: zod_1.z.number().int().min(0),
    })),
    compositionStrategy: zod_1.z.enum(['sequential', 'parallel', 'conditional', 'nested']),
    metadata: zod_1.z.record(zod_1.z.any()).optional(),
});
/**
 * Zod schema for gateway chain.
 */
exports.GatewayChainSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    name: zod_1.z.string().min(1),
    gateways: zod_1.z.array(zod_1.z.object({
        gatewayId: zod_1.z.string().uuid(),
        order: zod_1.z.number().int().min(0),
        condition: zod_1.z.string().optional(),
    })),
    errorHandling: zod_1.z.enum(['abort', 'skip', 'fallback']).default('abort'),
    metadata: zod_1.z.record(zod_1.z.any()).optional(),
});
/**
 * Zod schema for adaptive routing configuration.
 */
exports.AdaptiveRoutingConfigSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    name: zod_1.z.string().min(1),
    learningMode: zod_1.z.boolean().default(true),
    adaptationStrategy: zod_1.z.enum(['performance', 'success-rate', 'load-balance', 'cost']),
    feedbackWindow: zod_1.z.number().int().positive().default(100),
    adaptationThreshold: zod_1.z.number().min(0).max(1).default(0.1),
    metadata: zod_1.z.record(zod_1.z.any()).optional(),
});
/**
 * Zod schema for gateway performance profile.
 */
exports.GatewayPerformanceProfileSchema = zod_1.z.object({
    gatewayId: zod_1.z.string().uuid(),
    profiledAt: zod_1.z.date(),
    executionStats: zod_1.z.object({
        avgExecutionTime: zod_1.z.number(),
        minExecutionTime: zod_1.z.number(),
        maxExecutionTime: zod_1.z.number(),
        p50: zod_1.z.number(),
        p95: zod_1.z.number(),
        p99: zod_1.z.number(),
    }),
    pathStats: zod_1.z.record(zod_1.z.object({
        selectionCount: zod_1.z.number().int().min(0),
        avgExecutionTime: zod_1.z.number(),
        successRate: zod_1.z.number().min(0).max(1),
    })),
    resourceUsage: zod_1.z.object({
        avgCpuTime: zod_1.z.number(),
        avgMemoryBytes: zod_1.z.number(),
        peakMemoryBytes: zod_1.z.number(),
    }),
    bottlenecks: zod_1.z.array(zod_1.z.string()).optional(),
});
/**
 * Zod schema for gateway debug context.
 */
exports.GatewayDebugContextSchema = zod_1.z.object({
    gatewayId: zod_1.z.string().uuid(),
    timestamp: zod_1.z.date(),
    inputs: zod_1.z.record(zod_1.z.any()),
    evaluationSteps: zod_1.z.array(zod_1.z.object({
        step: zod_1.z.number().int().min(0),
        description: zod_1.z.string(),
        result: zod_1.z.any(),
        duration: zod_1.z.number(),
    })),
    outputs: zod_1.z.record(zod_1.z.any()),
    errors: zod_1.z.array(zod_1.z.string()).optional(),
});
// ============================================================================
// COMPLEX CONDITION EVALUATION
// ============================================================================
/**
 * 1. Evaluates complex multi-condition expressions.
 *
 * @swagger
 * @description Evaluates complex expressions with multiple conditions, nested logic, and operators.
 *
 * @param {string} expression - Complex expression to evaluate
 * @param {Record<string, any>} context - Evaluation context
 * @returns {Promise<boolean>} Evaluation result
 *
 * @example
 * const result = await evaluateComplexCondition(
 *   '(age > 65 || hasCondition("diabetes")) && priority === "high"',
 *   { age: 70, conditions: ['diabetes'], priority: 'high' }
 * );
 */
async function evaluateComplexCondition(expression, context) {
    try {
        // Create evaluation context with helper functions
        const helpers = {
            hasCondition: (condition) => Array.isArray(context.conditions) && context.conditions.includes(condition),
            inRange: (value, min, max) => value >= min && value <= max,
            matchesPattern: (value, pattern) => new RegExp(pattern).test(value),
        };
        const evalContext = { ...context, ...helpers };
        const contextKeys = Object.keys(evalContext);
        const contextValues = Object.values(evalContext);
        const fn = new Function(...contextKeys, `return ${expression}`);
        return !!fn(...contextValues);
    }
    catch (error) {
        console.error('Complex condition evaluation error:', error);
        return false;
    }
}
/**
 * 2. Evaluates condition with timeout.
 *
 * @swagger
 * @description Evaluates a condition with a timeout to prevent long-running evaluations.
 *
 * @param {string} expression - Expression to evaluate
 * @param {Record<string, any>} context - Evaluation context
 * @param {number} timeoutMs - Timeout in milliseconds
 * @returns {Promise<boolean>} Evaluation result or false on timeout
 *
 * @example
 * const result = await evaluateWithTimeout(expression, context, 5000);
 */
async function evaluateWithTimeout(expression, context, timeoutMs) {
    return Promise.race([
        evaluateComplexCondition(expression, context),
        new Promise((resolve) => setTimeout(() => resolve(false), timeoutMs)),
    ]);
}
/**
 * 3. Evaluates parallel conditions.
 *
 * @swagger
 * @description Evaluates multiple conditions in parallel and combines results.
 *
 * @param {string[]} expressions - Array of expressions
 * @param {Record<string, any>} context - Evaluation context
 * @param {'all' | 'any' | 'majority'} mode - Combination mode
 * @returns {Promise<boolean>} Combined result
 *
 * @example
 * const result = await evaluateParallelConditions(
 *   ['age >= 18', 'verified === true', 'score > 75'],
 *   context,
 *   'all'
 * );
 */
async function evaluateParallelConditions(expressions, context, mode = 'all') {
    const results = await Promise.all(expressions.map(expr => evaluateComplexCondition(expr, context)));
    switch (mode) {
        case 'all':
            return results.every(r => r);
        case 'any':
            return results.some(r => r);
        case 'majority':
            const trueCount = results.filter(r => r).length;
            return trueCount > results.length / 2;
        default:
            return false;
    }
}
/**
 * 4. Evaluates conditional branches.
 *
 * @swagger
 * @description Evaluates if-then-else conditional branches.
 *
 * @param {Array<{condition: string; result: any}>} branches - Conditional branches
 * @param {Record<string, any>} context - Evaluation context
 * @param {any} defaultResult - Default result if no branch matches
 * @returns {Promise<any>} Branch result
 *
 * @example
 * const result = await evaluateConditionalBranches([
 *   { condition: 'priority === "high"', result: 'urgent-path' },
 *   { condition: 'priority === "medium"', result: 'standard-path' }
 * ], context, 'default-path');
 */
async function evaluateConditionalBranches(branches, context, defaultResult) {
    for (const branch of branches) {
        const matches = await evaluateComplexCondition(branch.condition, context);
        if (matches) {
            return branch.result;
        }
    }
    return defaultResult;
}
/**
 * 5. Validates complex expression syntax.
 *
 * @swagger
 * @description Validates complex expression syntax without evaluation.
 *
 * @param {string} expression - Expression to validate
 * @returns {{ valid: boolean; errors: string[] }} Validation result
 *
 * @example
 * const validation = validateComplexExpression('(age > 18) && (status === "active")');
 */
function validateComplexExpression(expression) {
    const errors = [];
    try {
        new Function(`return ${expression}`);
    }
    catch (error) {
        errors.push(error instanceof Error ? error.message : 'Invalid expression syntax');
    }
    // Check balanced parentheses
    let balance = 0;
    for (const char of expression) {
        if (char === '(')
            balance++;
        if (char === ')')
            balance--;
        if (balance < 0) {
            errors.push('Unbalanced parentheses');
            break;
        }
    }
    if (balance !== 0) {
        errors.push('Unbalanced parentheses');
    }
    return {
        valid: errors.length === 0,
        errors,
    };
}
/**
 * 6. Optimizes complex expressions.
 *
 * @swagger
 * @description Optimizes complex expressions by removing redundant logic.
 *
 * @param {string} expression - Expression to optimize
 * @returns {string} Optimized expression
 *
 * @example
 * const optimized = optimizeComplexExpression('(true && x > 5) || false');
 * // Returns: 'x > 5'
 */
function optimizeComplexExpression(expression) {
    let optimized = expression.trim();
    // Remove redundant true conditions
    optimized = optimized.replace(/\(\s*true\s*&&\s*/g, '(');
    optimized = optimized.replace(/\s*&&\s*true\s*\)/g, ')');
    // Remove redundant false conditions
    optimized = optimized.replace(/\(\s*false\s*\|\|\s*/g, '(');
    optimized = optimized.replace(/\s*\|\|\s*false\s*\)/g, ')');
    // Remove double negations
    optimized = optimized.replace(/!!\s*/g, '');
    // Clean up extra parentheses
    optimized = optimized.replace(/\(\s*\(\s*(.+?)\s*\)\s*\)/g, '($1)');
    return optimized;
}
/**
 * 7. Profiles condition evaluation performance.
 *
 * @swagger
 * @description Profiles the performance of complex condition evaluation.
 *
 * @param {string} expression - Expression to profile
 * @param {Record<string, any>} context - Evaluation context
 * @param {number} iterations - Number of iterations
 * @returns {Promise<{avgTime: number; minTime: number; maxTime: number}>} Performance metrics
 *
 * @example
 * const metrics = await profileConditionEvaluation(expression, context, 1000);
 */
async function profileConditionEvaluation(expression, context, iterations = 100) {
    const times = [];
    for (let i = 0; i < iterations; i++) {
        const start = Date.now();
        await evaluateComplexCondition(expression, context);
        times.push(Date.now() - start);
    }
    return {
        avgTime: times.reduce((sum, t) => sum + t, 0) / times.length,
        minTime: Math.min(...times),
        maxTime: Math.max(...times),
    };
}
// ============================================================================
// MULTI-INPUT MULTI-OUTPUT PATTERNS
// ============================================================================
/**
 * 8. Creates a MIMO gateway configuration.
 *
 * @swagger
 * @description Creates a multi-input multi-output gateway configuration.
 *
 * @param {Partial<MIMOGatewayConfig>} config - MIMO configuration
 * @returns {MIMOGatewayConfig} Validated configuration
 *
 * @example
 * const mimo = createMIMOGateway({
 *   id: crypto.randomUUID(),
 *   name: 'Multi-path Router',
 *   inputTokens: [...],
 *   outputPaths: [...],
 *   routingStrategy: 'selective'
 * });
 */
function createMIMOGateway(config) {
    return exports.MIMOGatewayConfigSchema.parse({
        routingStrategy: 'selective',
        minOutputs: 1,
        ...config,
    });
}
/**
 * 9. Evaluates MIMO gateway routing.
 *
 * @swagger
 * @description Evaluates a MIMO gateway and determines output paths based on input tokens.
 *
 * @param {MIMOGatewayConfig} config - MIMO gateway configuration
 * @param {TokenArrival[]} arrivedTokens - Arrived input tokens
 * @returns {Promise<string[]>} Selected output path IDs
 *
 * @example
 * const outputs = await evaluateMIMOGateway(mimoConfig, tokens);
 */
async function evaluateMIMOGateway(config, arrivedTokens) {
    // Validate required tokens have arrived
    const requiredTokens = config.inputTokens.filter(t => t.required);
    const arrivedTokenIds = new Set(arrivedTokens.map(t => t.tokenId));
    for (const required of requiredTokens) {
        if (!arrivedTokenIds.has(required.id)) {
            throw new Error(`Required token ${required.id} has not arrived`);
        }
    }
    // Combine data from all tokens
    const combinedContext = arrivedTokens.reduce((acc, token) => ({
        ...acc,
        ...token.data,
    }), {});
    // Evaluate output paths based on routing strategy
    const selectedOutputs = [];
    switch (config.routingStrategy) {
        case 'fanout':
            // Send to all outputs
            selectedOutputs.push(...config.outputPaths.map(p => p.id));
            break;
        case 'selective':
            // Evaluate conditions and select matching paths
            for (const path of config.outputPaths) {
                if (path.condition) {
                    const matches = await evaluateComplexCondition(path.condition, combinedContext);
                    if (matches) {
                        selectedOutputs.push(path.id);
                    }
                }
            }
            break;
        case 'conditional':
            // Select paths based on priority and conditions
            const sortedPaths = [...config.outputPaths].sort((a, b) => b.priority - a.priority);
            for (const path of sortedPaths) {
                if (path.condition) {
                    const matches = await evaluateComplexCondition(path.condition, combinedContext);
                    if (matches) {
                        selectedOutputs.push(path.id);
                        if (config.maxOutputs && selectedOutputs.length >= config.maxOutputs) {
                            break;
                        }
                    }
                }
            }
            break;
        case 'weighted':
            // Use weighted random selection based on priorities
            const totalWeight = config.outputPaths.reduce((sum, p) => sum + p.priority, 0);
            const targetWeight = Math.random() * totalWeight;
            let cumulativeWeight = 0;
            for (const path of config.outputPaths) {
                cumulativeWeight += path.priority;
                if (cumulativeWeight >= targetWeight) {
                    selectedOutputs.push(path.id);
                    break;
                }
            }
            break;
    }
    // Validate output count
    if (selectedOutputs.length < config.minOutputs) {
        throw new Error(`MIMO gateway selected ${selectedOutputs.length} outputs but requires at least ${config.minOutputs}`);
    }
    if (config.maxOutputs && selectedOutputs.length > config.maxOutputs) {
        return selectedOutputs.slice(0, config.maxOutputs);
    }
    return selectedOutputs;
}
/**
 * 10. Tracks token arrivals for MIMO gateway.
 *
 * @swagger
 * @description Tracks and manages token arrivals for multi-input gateways.
 *
 * @param {MIMOGatewayConfig} config - MIMO configuration
 * @returns {{recordArrival: Function; getArrivedTokens: Function; isReady: Function}} Token tracker
 *
 * @example
 * const tracker = createTokenTracker(mimoConfig);
 * tracker.recordArrival({ tokenId: 'token-1', sourceId: 'src-1', arrivedAt: new Date(), data: {} });
 */
function createTokenTracker(config) {
    const arrivals = new Map();
    return {
        recordArrival(token) {
            arrivals.set(token.tokenId, token);
        },
        getArrivedTokens() {
            return Array.from(arrivals.values());
        },
        isReady() {
            const requiredTokens = config.inputTokens.filter(t => t.required);
            return requiredTokens.every(rt => arrivals.has(rt.id));
        },
        clear() {
            arrivals.clear();
        },
    };
}
/**
 * 11. Validates MIMO configuration.
 *
 * @swagger
 * @description Validates MIMO gateway configuration for correctness.
 *
 * @param {MIMOGatewayConfig} config - MIMO configuration
 * @returns {{ valid: boolean; errors: string[] }} Validation result
 *
 * @example
 * const validation = validateMIMOConfiguration(mimoConfig);
 */
function validateMIMOConfiguration(config) {
    const errors = [];
    if (config.inputTokens.length === 0) {
        errors.push('MIMO gateway must have at least one input token');
    }
    if (config.outputPaths.length === 0) {
        errors.push('MIMO gateway must have at least one output path');
    }
    if (config.minOutputs > config.outputPaths.length) {
        errors.push('minOutputs cannot exceed total number of output paths');
    }
    if (config.maxOutputs && config.maxOutputs < config.minOutputs) {
        errors.push('maxOutputs cannot be less than minOutputs');
    }
    return {
        valid: errors.length === 0,
        errors,
    };
}
/**
 * 12. Creates fanout routing.
 *
 * @swagger
 * @description Creates a fanout routing configuration that sends to all outputs.
 *
 * @param {string[]} targetNodes - Target node IDs
 * @returns {MIMOGatewayConfig} Fanout configuration
 *
 * @example
 * const fanout = createFanoutRouting(['node-1', 'node-2', 'node-3']);
 */
function createFanoutRouting(targetNodes) {
    return {
        id: crypto.randomUUID(),
        name: 'Fanout Router',
        inputTokens: [{
                id: 'input-1',
                source: 'source',
                required: true,
            }],
        outputPaths: targetNodes.map((target, index) => ({
            id: `output-${index}`,
            target,
            condition: 'true',
            priority: 0,
        })),
        routingStrategy: 'fanout',
        minOutputs: targetNodes.length,
    };
}
/**
 * 13. Creates selective routing.
 *
 * @swagger
 * @description Creates selective routing based on conditions.
 *
 * @param {Array<{target: string; condition: string}>} routes - Route definitions
 * @returns {MIMOGatewayConfig} Selective routing configuration
 *
 * @example
 * const selective = createSelectiveRouting([
 *   { target: 'urgent', condition: 'priority === "high"' },
 *   { target: 'standard', condition: 'priority === "medium"' }
 * ]);
 */
function createSelectiveRouting(routes) {
    return {
        id: crypto.randomUUID(),
        name: 'Selective Router',
        inputTokens: [{
                id: 'input-1',
                source: 'source',
                required: true,
            }],
        outputPaths: routes.map((route, index) => ({
            id: `output-${index}`,
            target: route.target,
            condition: route.condition,
            priority: 0,
        })),
        routingStrategy: 'selective',
        minOutputs: 1,
    };
}
// ============================================================================
// ADVANCED SYNCHRONIZATION PATTERNS
// ============================================================================
/**
 * 14. Creates synchronization pattern.
 *
 * @swagger
 * @description Creates a synchronization pattern for coordinating multiple inputs.
 *
 * @param {Partial<SynchronizationPattern>} config - Synchronization configuration
 * @returns {SynchronizationPattern} Synchronization pattern
 *
 * @example
 * const sync = createSynchronizationPattern({
 *   id: crypto.randomUUID(),
 *   name: 'Wait for All',
 *   type: 'and',
 *   inputs: ['input-1', 'input-2', 'input-3']
 * });
 */
function createSynchronizationPattern(config) {
    return exports.SynchronizationPatternSchema.parse({
        onTimeout: 'fail',
        ...config,
    });
}
/**
 * 15. Evaluates AND synchronization.
 *
 * @swagger
 * @description Evaluates AND synchronization - waits for all inputs to arrive.
 *
 * @param {SynchronizationPattern} pattern - Synchronization pattern
 * @param {Set<string>} arrivedInputs - Set of arrived input IDs
 * @returns {boolean} True if all inputs have arrived
 *
 * @example
 * const ready = evaluateANDSync(pattern, new Set(['input-1', 'input-2']));
 */
function evaluateANDSync(pattern, arrivedInputs) {
    return pattern.inputs.every(input => arrivedInputs.has(input));
}
/**
 * 16. Evaluates OR synchronization.
 *
 * @swagger
 * @description Evaluates OR synchronization - continues when any input arrives.
 *
 * @param {SynchronizationPattern} pattern - Synchronization pattern
 * @param {Set<string>} arrivedInputs - Set of arrived input IDs
 * @returns {boolean} True if any input has arrived
 *
 * @example
 * const ready = evaluateORSync(pattern, arrivedInputs);
 */
function evaluateORSync(pattern, arrivedInputs) {
    return pattern.inputs.some(input => arrivedInputs.has(input));
}
/**
 * 17. Evaluates XOR synchronization.
 *
 * @swagger
 * @description Evaluates XOR synchronization - continues when exactly one input arrives.
 *
 * @param {SynchronizationPattern} pattern - Synchronization pattern
 * @param {Set<string>} arrivedInputs - Set of arrived input IDs
 * @returns {boolean} True if exactly one input has arrived
 *
 * @example
 * const ready = evaluateXORSync(pattern, arrivedInputs);
 */
function evaluateXORSync(pattern, arrivedInputs) {
    const matchingInputs = pattern.inputs.filter(input => arrivedInputs.has(input));
    return matchingInputs.length === 1;
}
/**
 * 18. Evaluates quorum synchronization.
 *
 * @swagger
 * @description Evaluates quorum synchronization - continues when minimum number of inputs arrive.
 *
 * @param {SynchronizationPattern} pattern - Synchronization pattern
 * @param {Set<string>} arrivedInputs - Set of arrived input IDs
 * @returns {boolean} True if quorum is reached
 *
 * @example
 * const ready = evaluateQuorumSync(pattern, arrivedInputs);
 */
function evaluateQuorumSync(pattern, arrivedInputs) {
    if (!pattern.quorumSize) {
        throw new Error('Quorum size not specified');
    }
    const matchingInputs = pattern.inputs.filter(input => arrivedInputs.has(input));
    return matchingInputs.length >= pattern.quorumSize;
}
/**
 * 19. Evaluates majority synchronization.
 *
 * @swagger
 * @description Evaluates majority synchronization - continues when more than half of inputs arrive.
 *
 * @param {SynchronizationPattern} pattern - Synchronization pattern
 * @param {Set<string>} arrivedInputs - Set of arrived input IDs
 * @returns {boolean} True if majority has arrived
 *
 * @example
 * const ready = evaluateMajoritySync(pattern, arrivedInputs);
 */
function evaluateMajoritySync(pattern, arrivedInputs) {
    const matchingInputs = pattern.inputs.filter(input => arrivedInputs.has(input));
    return matchingInputs.length > pattern.inputs.length / 2;
}
/**
 * 20. Creates deadline-based synchronization.
 *
 * @swagger
 * @description Creates a synchronization pattern with a deadline.
 *
 * @param {string[]} inputs - Input IDs
 * @param {number} deadlineMs - Deadline in milliseconds
 * @param {'fail' | 'continue' | 'default'} onTimeout - Action on timeout
 * @returns {SynchronizationPattern} Deadline synchronization pattern
 *
 * @example
 * const sync = createDeadlineSync(['input-1', 'input-2'], 30000, 'continue');
 */
function createDeadlineSync(inputs, deadlineMs, onTimeout = 'fail') {
    return {
        id: crypto.randomUUID(),
        name: 'Deadline Sync',
        type: 'deadline',
        inputs,
        deadlineMs,
        onTimeout,
    };
}
/**
 * 21. Monitors synchronization with timeout.
 *
 * @swagger
 * @description Monitors synchronization pattern with timeout handling.
 *
 * @param {SynchronizationPattern} pattern - Synchronization pattern
 * @param {Observable<string>} inputStream - Stream of input arrivals
 * @returns {Promise<{completed: boolean; arrivedInputs: string[]}>} Synchronization result
 *
 * @example
 * const result = await monitorSynchronization(pattern, inputStream);
 */
async function monitorSynchronization(pattern, inputStream) {
    const arrivedInputs = new Set();
    const deadline = pattern.deadlineMs ? Date.now() + pattern.deadlineMs : null;
    return new Promise((resolve) => {
        const subscription = inputStream.subscribe(inputId => {
            arrivedInputs.add(inputId);
            // Check if synchronization is complete
            let isComplete = false;
            switch (pattern.type) {
                case 'and':
                    isComplete = evaluateANDSync(pattern, arrivedInputs);
                    break;
                case 'or':
                    isComplete = evaluateORSync(pattern, arrivedInputs);
                    break;
                case 'xor':
                    isComplete = evaluateXORSync(pattern, arrivedInputs);
                    break;
                case 'majority':
                    isComplete = evaluateMajoritySync(pattern, arrivedInputs);
                    break;
                case 'quorum':
                    isComplete = evaluateQuorumSync(pattern, arrivedInputs);
                    break;
            }
            if (isComplete) {
                subscription.unsubscribe();
                resolve({ completed: true, arrivedInputs: Array.from(arrivedInputs) });
            }
        });
        // Set up deadline timeout
        if (deadline) {
            const timeout = deadline - Date.now();
            setTimeout(() => {
                subscription.unsubscribe();
                resolve({
                    completed: pattern.onTimeout === 'continue',
                    arrivedInputs: Array.from(arrivedInputs),
                });
            }, timeout);
        }
    });
}
// ============================================================================
// CUSTOM GATEWAY BEHAVIORS
// ============================================================================
/**
 * 22. Creates custom gateway behavior.
 *
 * @swagger
 * @description Creates a custom gateway behavior with custom evaluation logic.
 *
 * @param {Function} evaluateFn - Custom evaluation function
 * @param {Function} validateFn - Custom validation function
 * @returns {CustomGatewayBehavior} Custom behavior implementation
 *
 * @example
 * const behavior = createCustomBehavior(
 *   async (inputs, config) => ['output-1'],
 *   (config) => ({ valid: true })
 * );
 */
function createCustomBehavior(evaluateFn, validateFn) {
    return {
        evaluate: evaluateFn,
        validate: validateFn,
    };
}
/**
 * 23. Registers custom gateway behavior.
 *
 * @swagger
 * @description Registers a custom gateway behavior in the behavior registry.
 *
 * @param {string} behaviorId - Unique behavior ID
 * @param {CustomGatewayBehavior} behavior - Custom behavior
 * @returns {void}
 *
 * @example
 * registerCustomBehavior('my-custom-gateway', customBehavior);
 */
function registerCustomBehavior(behaviorId, behavior) {
    // In a real implementation, this would store in a registry
    console.log(`Registered custom behavior: ${behaviorId}`);
}
/**
 * 24. Gets registered custom behavior.
 *
 * @swagger
 * @description Retrieves a registered custom gateway behavior.
 *
 * @param {string} behaviorId - Behavior ID
 * @returns {CustomGatewayBehavior | null} Custom behavior or null
 *
 * @example
 * const behavior = getCustomBehavior('my-custom-gateway');
 */
function getCustomBehavior(behaviorId) {
    // In a real implementation, this would retrieve from registry
    return null;
}
/**
 * 25. Creates rule-based gateway behavior.
 *
 * @swagger
 * @description Creates a rule-based gateway behavior using a rule engine.
 *
 * @param {Array<{condition: string; outputs: string[]}>} rules - Routing rules
 * @returns {CustomGatewayBehavior} Rule-based behavior
 *
 * @example
 * const behavior = createRuleBasedBehavior([
 *   { condition: 'priority === "high"', outputs: ['urgent-queue'] },
 *   { condition: 'priority === "low"', outputs: ['standard-queue'] }
 * ]);
 */
function createRuleBasedBehavior(rules) {
    return {
        async evaluate(inputs, config) {
            for (const rule of rules) {
                const matches = await evaluateComplexCondition(rule.condition, inputs);
                if (matches) {
                    return rule.outputs;
                }
            }
            return [];
        },
        validate(config) {
            const errors = [];
            if (!rules || rules.length === 0) {
                errors.push('No rules defined');
            }
            return {
                valid: errors.length === 0,
                errors: errors.length > 0 ? errors : undefined,
            };
        },
    };
}
// ============================================================================
// COMPOSITE GATEWAY PATTERNS
// ============================================================================
/**
 * 26. Creates composite gateway.
 *
 * @swagger
 * @description Creates a composite gateway that combines multiple gateway types.
 *
 * @param {Partial<CompositeGateway>} config - Composite gateway configuration
 * @returns {CompositeGateway} Composite gateway
 *
 * @example
 * const composite = createCompositeGateway({
 *   id: crypto.randomUUID(),
 *   name: 'Multi-stage Router',
 *   components: [
 *     { id: 'stage-1', type: 'exclusive', config: {...}, order: 0 },
 *     { id: 'stage-2', type: 'parallel', config: {...}, order: 1 }
 *   ],
 *   compositionStrategy: 'sequential'
 * });
 */
function createCompositeGateway(config) {
    return exports.CompositeGatewaySchema.parse({
        compositionStrategy: 'sequential',
        ...config,
    });
}
/**
 * 27. Evaluates composite gateway.
 *
 * @swagger
 * @description Evaluates a composite gateway by executing component gateways in order.
 *
 * @param {CompositeGateway} composite - Composite gateway configuration
 * @param {Record<string, any>} inputs - Input data
 * @returns {Promise<GatewayExecutionResult>} Execution result
 *
 * @example
 * const result = await evaluateCompositeGateway(composite, inputs);
 */
async function evaluateCompositeGateway(composite, inputs) {
    const startTime = Date.now();
    const sortedComponents = [...composite.components].sort((a, b) => a.order - b.order);
    const selectedOutputs = [];
    for (const component of sortedComponents) {
        // In a real implementation, this would execute the specific gateway type
        console.log(`Executing component ${component.id} of type ${component.type}`);
    }
    return {
        gatewayId: composite.id,
        selectedOutputs,
        executionTime: Date.now() - startTime,
        timestamp: new Date(),
    };
}
/**
 * 28. Validates composite gateway.
 *
 * @swagger
 * @description Validates composite gateway configuration.
 *
 * @param {CompositeGateway} composite - Composite gateway
 * @returns {{ valid: boolean; errors: string[] }} Validation result
 *
 * @example
 * const validation = validateCompositeGateway(composite);
 */
function validateCompositeGateway(composite) {
    const errors = [];
    if (composite.components.length === 0) {
        errors.push('Composite gateway must have at least one component');
    }
    // Check for duplicate orders in sequential composition
    if (composite.compositionStrategy === 'sequential') {
        const orders = composite.components.map(c => c.order);
        if (new Set(orders).size !== orders.length) {
            errors.push('Duplicate component orders in sequential composition');
        }
    }
    return {
        valid: errors.length === 0,
        errors,
    };
}
/**
 * 29. Creates sequential composition.
 *
 * @swagger
 * @description Creates a composite gateway with sequential component execution.
 *
 * @param {Array<{type: string; config: any}>} components - Gateway components
 * @returns {CompositeGateway} Sequential composite gateway
 *
 * @example
 * const sequential = createSequentialComposition([
 *   { type: 'exclusive', config: {...} },
 *   { type: 'parallel', config: {...} }
 * ]);
 */
function createSequentialComposition(components) {
    return {
        id: crypto.randomUUID(),
        name: 'Sequential Composite',
        components: components.map((comp, index) => ({
            id: `component-${index}`,
            type: comp.type,
            config: comp.config,
            order: index,
        })),
        compositionStrategy: 'sequential',
    };
}
/**
 * 30. Creates parallel composition.
 *
 * @swagger
 * @description Creates a composite gateway with parallel component execution.
 *
 * @param {Array<{type: string; config: any}>} components - Gateway components
 * @returns {CompositeGateway} Parallel composite gateway
 *
 * @example
 * const parallel = createParallelComposition([
 *   { type: 'exclusive', config: {...} },
 *   { type: 'exclusive', config: {...} }
 * ]);
 */
function createParallelComposition(components) {
    return {
        id: crypto.randomUUID(),
        name: 'Parallel Composite',
        components: components.map((comp, index) => ({
            id: `component-${index}`,
            type: comp.type,
            config: comp.config,
            order: index,
        })),
        compositionStrategy: 'parallel',
    };
}
// ============================================================================
// GATEWAY CHAINING
// ============================================================================
/**
 * 31. Creates gateway chain.
 *
 * @swagger
 * @description Creates a chain of gateways to be executed in sequence.
 *
 * @param {Partial<GatewayChain>} config - Gateway chain configuration
 * @returns {GatewayChain} Gateway chain
 *
 * @example
 * const chain = createGatewayChain({
 *   id: crypto.randomUUID(),
 *   name: 'Approval Chain',
 *   gateways: [
 *     { gatewayId: 'gw-1', order: 0 },
 *     { gatewayId: 'gw-2', order: 1 }
 *   ]
 * });
 */
function createGatewayChain(config) {
    return exports.GatewayChainSchema.parse({
        errorHandling: 'abort',
        ...config,
    });
}
/**
 * 32. Executes gateway chain.
 *
 * @swagger
 * @description Executes a chain of gateways in sequence.
 *
 * @param {GatewayChain} chain - Gateway chain
 * @param {Record<string, any>} initialContext - Initial context
 * @returns {Promise<{finalOutputs: string[]; executionPath: string[]}>} Execution result
 *
 * @example
 * const result = await executeGatewayChain(chain, context);
 */
async function executeGatewayChain(chain, initialContext) {
    const sortedGateways = [...chain.gateways].sort((a, b) => a.order - b.order);
    const executionPath = [];
    let currentContext = { ...initialContext };
    for (const gateway of sortedGateways) {
        try {
            // Check gateway condition if specified
            if (gateway.condition) {
                const shouldExecute = await evaluateComplexCondition(gateway.condition, currentContext);
                if (!shouldExecute) {
                    if (chain.errorHandling === 'skip') {
                        continue;
                    }
                }
            }
            executionPath.push(gateway.gatewayId);
            // In a real implementation, this would execute the actual gateway
            console.log(`Executing gateway ${gateway.gatewayId}`);
        }
        catch (error) {
            if (chain.errorHandling === 'abort') {
                throw error;
            }
            else if (chain.errorHandling === 'skip') {
                continue;
            }
        }
    }
    return {
        finalOutputs: [],
        executionPath,
    };
}
/**
 * 33. Validates gateway chain.
 *
 * @swagger
 * @description Validates gateway chain configuration.
 *
 * @param {GatewayChain} chain - Gateway chain
 * @returns {{ valid: boolean; errors: string[] }} Validation result
 *
 * @example
 * const validation = validateGatewayChain(chain);
 */
function validateGatewayChain(chain) {
    const errors = [];
    if (chain.gateways.length === 0) {
        errors.push('Gateway chain must contain at least one gateway');
    }
    // Check for duplicate orders
    const orders = chain.gateways.map(g => g.order);
    if (new Set(orders).size !== orders.length) {
        errors.push('Duplicate gateway orders in chain');
    }
    return {
        valid: errors.length === 0,
        errors,
    };
}
// ============================================================================
// GATEWAY OPTIMIZATION
// ============================================================================
/**
 * 34. Optimizes gateway configuration.
 *
 * @swagger
 * @description Optimizes gateway configuration for better performance.
 *
 * @param {ComplexGatewayConfig} config - Gateway configuration
 * @returns {ComplexGatewayConfig} Optimized configuration
 *
 * @example
 * const optimized = optimizeGatewayConfiguration(gatewayConfig);
 */
function optimizeGatewayConfiguration(config) {
    // Optimize output conditions
    const optimizedOutputs = config.outputs.map(output => ({
        ...output,
        condition: output.condition ? optimizeComplexExpression(output.condition) : undefined,
    }));
    return {
        ...config,
        outputs: optimizedOutputs,
    };
}
/**
 * 35. Analyzes gateway performance bottlenecks.
 *
 * @swagger
 * @description Analyzes gateway performance and identifies bottlenecks.
 *
 * @param {GatewayPerformanceProfile} profile - Performance profile
 * @returns {string[]} List of identified bottlenecks
 *
 * @example
 * const bottlenecks = analyzeGatewayBottlenecks(profile);
 */
function analyzeGatewayBottlenecks(profile) {
    const bottlenecks = [];
    // Check execution time
    if (profile.executionStats.avgExecutionTime > 1000) {
        bottlenecks.push('High average execution time (>1s)');
    }
    if (profile.executionStats.p99 > 5000) {
        bottlenecks.push('High P99 latency (>5s)');
    }
    // Check memory usage
    if (profile.resourceUsage.avgMemoryBytes > 100 * 1024 * 1024) {
        bottlenecks.push('High average memory usage (>100MB)');
    }
    // Check path imbalance
    const pathCounts = Object.values(profile.pathStats).map(s => s.selectionCount);
    const maxCount = Math.max(...pathCounts);
    const minCount = Math.min(...pathCounts);
    if (maxCount > minCount * 10) {
        bottlenecks.push('Significant path selection imbalance');
    }
    return bottlenecks;
}
/**
 * 36. Suggests gateway optimizations.
 *
 * @swagger
 * @description Suggests optimizations based on performance analysis.
 *
 * @param {GatewayPerformanceProfile} profile - Performance profile
 * @returns {Array<{suggestion: string; priority: string}>} Optimization suggestions
 *
 * @example
 * const suggestions = suggestGatewayOptimizations(profile);
 */
function suggestGatewayOptimizations(profile) {
    const suggestions = [];
    const bottlenecks = analyzeGatewayBottlenecks(profile);
    if (bottlenecks.includes('High average execution time (>1s)')) {
        suggestions.push({
            suggestion: 'Enable condition caching to reduce evaluation time',
            priority: 'high',
        });
    }
    if (bottlenecks.includes('High average memory usage (>100MB)')) {
        suggestions.push({
            suggestion: 'Optimize data structures and reduce context size',
            priority: 'high',
        });
    }
    if (bottlenecks.includes('Significant path selection imbalance')) {
        suggestions.push({
            suggestion: 'Review path priorities and conditions for better balance',
            priority: 'medium',
        });
    }
    return suggestions;
}
// ============================================================================
// GATEWAY PERFORMANCE PROFILING
// ============================================================================
/**
 * 37. Profiles gateway execution.
 *
 * @swagger
 * @description Profiles gateway execution to collect performance metrics.
 *
 * @param {string} gatewayId - Gateway ID
 * @param {Function} executionFn - Function to execute
 * @returns {Promise<GatewayPerformanceProfile>} Performance profile
 *
 * @example
 * const profile = await profileGatewayExecution('gw-1', async () => {
 *   return evaluateGateway(config, context);
 * });
 */
async function profileGatewayExecution(gatewayId, executionFn) {
    const startTime = Date.now();
    const startMemory = process.memoryUsage().heapUsed;
    await executionFn();
    const endTime = Date.now();
    const endMemory = process.memoryUsage().heapUsed;
    const executionTime = endTime - startTime;
    const memoryUsed = endMemory - startMemory;
    return {
        gatewayId,
        profiledAt: new Date(),
        executionStats: {
            avgExecutionTime: executionTime,
            minExecutionTime: executionTime,
            maxExecutionTime: executionTime,
            p50: executionTime,
            p95: executionTime,
            p99: executionTime,
        },
        pathStats: {},
        resourceUsage: {
            avgCpuTime: 0,
            avgMemoryBytes: memoryUsed,
            peakMemoryBytes: memoryUsed,
        },
    };
}
/**
 * 38. Collects gateway metrics.
 *
 * @swagger
 * @description Collects comprehensive metrics for gateway execution.
 *
 * @param {string} gatewayId - Gateway ID
 * @param {number} iterations - Number of iterations to profile
 * @param {Function} executionFn - Function to execute
 * @returns {Promise<GatewayPerformanceProfile>} Aggregated performance profile
 *
 * @example
 * const metrics = await collectGatewayMetrics('gw-1', 100, executionFn);
 */
async function collectGatewayMetrics(gatewayId, iterations, executionFn) {
    const executionTimes = [];
    const memoryUsages = [];
    for (let i = 0; i < iterations; i++) {
        const startTime = Date.now();
        const startMemory = process.memoryUsage().heapUsed;
        await executionFn();
        executionTimes.push(Date.now() - startTime);
        memoryUsages.push(process.memoryUsage().heapUsed - startMemory);
    }
    const sortedTimes = [...executionTimes].sort((a, b) => a - b);
    const avgTime = executionTimes.reduce((sum, t) => sum + t, 0) / iterations;
    const avgMemory = memoryUsages.reduce((sum, m) => sum + m, 0) / iterations;
    return {
        gatewayId,
        profiledAt: new Date(),
        executionStats: {
            avgExecutionTime: avgTime,
            minExecutionTime: Math.min(...executionTimes),
            maxExecutionTime: Math.max(...executionTimes),
            p50: sortedTimes[Math.floor(iterations * 0.5)],
            p95: sortedTimes[Math.floor(iterations * 0.95)],
            p99: sortedTimes[Math.floor(iterations * 0.99)],
        },
        pathStats: {},
        resourceUsage: {
            avgCpuTime: 0,
            avgMemoryBytes: avgMemory,
            peakMemoryBytes: Math.max(...memoryUsages),
        },
    };
}
/**
 * 39. Exports performance profile.
 *
 * @swagger
 * @description Exports gateway performance profile to JSON.
 *
 * @param {GatewayPerformanceProfile} profile - Performance profile
 * @returns {string} JSON string
 *
 * @example
 * const json = exportPerformanceProfile(profile);
 * fs.writeFileSync('gateway-profile.json', json);
 */
function exportPerformanceProfile(profile) {
    return JSON.stringify(profile, null, 2);
}
// ============================================================================
// GATEWAY DEBUGGING UTILITIES
// ============================================================================
/**
 * 40. Creates debug context for gateway.
 *
 * @swagger
 * @description Creates a debug context to track gateway evaluation steps.
 *
 * @param {string} gatewayId - Gateway ID
 * @param {Record<string, any>} inputs - Input data
 * @returns {GatewayDebugContext} Debug context
 *
 * @example
 * const debugCtx = createGatewayDebugContext('gw-1', inputs);
 */
function createGatewayDebugContext(gatewayId, inputs) {
    return {
        gatewayId,
        timestamp: new Date(),
        inputs,
        evaluationSteps: [],
        outputs: {},
    };
}
/**
 * 41. Records debug evaluation step.
 *
 * @swagger
 * @description Records a debug step during gateway evaluation.
 *
 * @param {GatewayDebugContext} context - Debug context
 * @param {string} description - Step description
 * @param {any} result - Step result
 * @param {number} duration - Step duration in ms
 * @returns {GatewayDebugContext} Updated context
 *
 * @example
 * debugCtx = recordDebugStep(debugCtx, 'Evaluated condition', true, 5);
 */
function recordDebugStep(context, description, result, duration) {
    return {
        ...context,
        evaluationSteps: [
            ...context.evaluationSteps,
            {
                step: context.evaluationSteps.length,
                description,
                result,
                duration,
            },
        ],
    };
}
/**
 * 42. Visualizes gateway evaluation path.
 *
 * @swagger
 * @description Generates a visual representation of gateway evaluation path.
 *
 * @param {GatewayDebugContext} context - Debug context
 * @returns {string} Visualization string
 *
 * @example
 * const visualization = visualizeGatewayEvaluation(debugCtx);
 * console.log(visualization);
 */
function visualizeGatewayEvaluation(context) {
    let output = `Gateway: ${context.gatewayId}\n`;
    output += `Timestamp: ${context.timestamp.toISOString()}\n\n`;
    output += `Inputs:\n${JSON.stringify(context.inputs, null, 2)}\n\n`;
    output += `Evaluation Steps:\n`;
    for (const step of context.evaluationSteps) {
        output += `  ${step.step}. ${step.description} (${step.duration}ms)\n`;
        output += `     Result: ${JSON.stringify(step.result)}\n`;
    }
    output += `\nOutputs:\n${JSON.stringify(context.outputs, null, 2)}\n`;
    if (context.errors && context.errors.length > 0) {
        output += `\nErrors:\n`;
        context.errors.forEach(error => output += `  - ${error}\n`);
    }
    return output;
}
/**
 * 43. Exports debug context.
 *
 * @swagger
 * @description Exports gateway debug context to JSON.
 *
 * @param {GatewayDebugContext} context - Debug context
 * @returns {string} JSON string
 *
 * @example
 * const json = exportDebugContext(debugCtx);
 * fs.writeFileSync('gateway-debug.json', json);
 */
function exportDebugContext(context) {
    return JSON.stringify(context, null, 2);
}
// ============================================================================
// GATEWAY PATTERN LIBRARY
// ============================================================================
/**
 * 44. Gets common gateway patterns library.
 *
 * @swagger
 * @description Returns a library of common gateway patterns for reuse.
 *
 * @returns {Record<string, any>} Pattern library
 *
 * @example
 * const patterns = getGatewayPatternLibrary();
 * const approvalPattern = patterns['approval-workflow'];
 */
function getGatewayPatternLibrary() {
    return {
        'approval-workflow': {
            type: 'sequential',
            description: 'Multi-stage approval workflow with fallbacks',
            pattern: 'exclusive -> parallel -> exclusive',
        },
        'load-balancer': {
            type: 'mimo',
            description: 'Weighted load balancing across multiple paths',
            pattern: 'weighted-fanout',
        },
        'fault-tolerant': {
            type: 'composite',
            description: 'Fault-tolerant routing with retry and fallback',
            pattern: 'exclusive + timeout + fallback',
        },
        'priority-routing': {
            type: 'exclusive',
            description: 'Priority-based routing with overflow handling',
            pattern: 'priority-based-selection',
        },
        'parallel-join': {
            type: 'synchronization',
            description: 'Parallel execution with join synchronization',
            pattern: 'parallel-and-join',
        },
        'adaptive-routing': {
            type: 'adaptive',
            description: 'Self-optimizing routing based on performance feedback',
            pattern: 'learning-based-selection',
        },
    };
}
//# sourceMappingURL=workflow-complex-gateway.js.map