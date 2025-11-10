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
import { Observable } from 'rxjs';
/**
 * Zod schema for complex gateway configuration.
 */
export declare const ComplexGatewayConfigSchema: any;
/**
 * Zod schema for multi-input multi-output (MIMO) configuration.
 */
export declare const MIMOGatewayConfigSchema: any;
/**
 * Zod schema for synchronization pattern.
 */
export declare const SynchronizationPatternSchema: any;
/**
 * Zod schema for composite gateway.
 */
export declare const CompositeGatewaySchema: any;
/**
 * Zod schema for gateway chain.
 */
export declare const GatewayChainSchema: any;
/**
 * Zod schema for adaptive routing configuration.
 */
export declare const AdaptiveRoutingConfigSchema: any;
/**
 * Zod schema for gateway performance profile.
 */
export declare const GatewayPerformanceProfileSchema: any;
/**
 * Zod schema for gateway debug context.
 */
export declare const GatewayDebugContextSchema: any;
export interface ComplexGatewayConfig {
    id: string;
    name: string;
    type: 'mimo' | 'composite' | 'adaptive' | 'synchronization' | 'custom';
    inputs: Array<{
        id: string;
        name: string;
        sourceNode: string;
        required: boolean;
    }>;
    outputs: Array<{
        id: string;
        name: string;
        targetNode: string;
        condition?: string;
    }>;
    evaluationLogic: string;
    synchronizationMode?: 'all' | 'any' | 'majority' | 'custom';
    timeoutMs?: number;
    metadata?: Record<string, any>;
}
export interface MIMOGatewayConfig {
    id: string;
    name: string;
    inputTokens: Array<{
        id: string;
        source: string;
        required: boolean;
        arrivalTime?: Date;
    }>;
    outputPaths: Array<{
        id: string;
        target: string;
        condition: string;
        priority: number;
    }>;
    routingStrategy: 'fanout' | 'selective' | 'conditional' | 'weighted';
    maxOutputs?: number;
    minOutputs: number;
}
export interface SynchronizationPattern {
    id: string;
    name: string;
    type: 'and' | 'or' | 'xor' | 'majority' | 'quorum' | 'deadline';
    inputs: string[];
    requiredInputs?: string[];
    quorumSize?: number;
    deadlineMs?: number;
    onTimeout: 'fail' | 'continue' | 'default';
    metadata?: Record<string, any>;
}
export interface CompositeGateway {
    id: string;
    name: string;
    components: Array<{
        id: string;
        type: 'exclusive' | 'parallel' | 'inclusive' | 'event-based';
        config: Record<string, any>;
        order: number;
    }>;
    compositionStrategy: 'sequential' | 'parallel' | 'conditional' | 'nested';
    metadata?: Record<string, any>;
}
export interface GatewayChain {
    id: string;
    name: string;
    gateways: Array<{
        gatewayId: string;
        order: number;
        condition?: string;
    }>;
    errorHandling: 'abort' | 'skip' | 'fallback';
    metadata?: Record<string, any>;
}
export interface AdaptiveRoutingConfig {
    id: string;
    name: string;
    learningMode: boolean;
    adaptationStrategy: 'performance' | 'success-rate' | 'load-balance' | 'cost';
    feedbackWindow: number;
    adaptationThreshold: number;
    metadata?: Record<string, any>;
}
export interface GatewayPerformanceProfile {
    gatewayId: string;
    profiledAt: Date;
    executionStats: {
        avgExecutionTime: number;
        minExecutionTime: number;
        maxExecutionTime: number;
        p50: number;
        p95: number;
        p99: number;
    };
    pathStats: Record<string, {
        selectionCount: number;
        avgExecutionTime: number;
        successRate: number;
    }>;
    resourceUsage: {
        avgCpuTime: number;
        avgMemoryBytes: number;
        peakMemoryBytes: number;
    };
    bottlenecks?: string[];
}
export interface GatewayDebugContext {
    gatewayId: string;
    timestamp: Date;
    inputs: Record<string, any>;
    evaluationSteps: Array<{
        step: number;
        description: string;
        result: any;
        duration: number;
    }>;
    outputs: Record<string, any>;
    errors?: string[];
}
export interface TokenArrival {
    tokenId: string;
    sourceId: string;
    arrivedAt: Date;
    data: Record<string, any>;
}
export interface GatewayExecutionResult {
    gatewayId: string;
    selectedOutputs: string[];
    executionTime: number;
    timestamp: Date;
    metadata?: Record<string, any>;
}
export interface CustomGatewayBehavior {
    evaluate(inputs: Record<string, any>, config: Record<string, any>): Promise<string[]>;
    validate(config: Record<string, any>): {
        valid: boolean;
        errors?: string[];
    };
}
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
export declare function evaluateComplexCondition(expression: string, context: Record<string, any>): Promise<boolean>;
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
export declare function evaluateWithTimeout(expression: string, context: Record<string, any>, timeoutMs: number): Promise<boolean>;
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
export declare function evaluateParallelConditions(expressions: string[], context: Record<string, any>, mode?: 'all' | 'any' | 'majority'): Promise<boolean>;
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
export declare function evaluateConditionalBranches(branches: Array<{
    condition: string;
    result: any;
}>, context: Record<string, any>, defaultResult: any): Promise<any>;
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
export declare function validateComplexExpression(expression: string): {
    valid: boolean;
    errors: string[];
};
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
export declare function optimizeComplexExpression(expression: string): string;
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
export declare function profileConditionEvaluation(expression: string, context: Record<string, any>, iterations?: number): Promise<{
    avgTime: number;
    minTime: number;
    maxTime: number;
}>;
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
export declare function createMIMOGateway(config: Partial<MIMOGatewayConfig> & {
    id: string;
    name: string;
    inputTokens: MIMOGatewayConfig['inputTokens'];
    outputPaths: MIMOGatewayConfig['outputPaths'];
}): MIMOGatewayConfig;
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
export declare function evaluateMIMOGateway(config: MIMOGatewayConfig, arrivedTokens: TokenArrival[]): Promise<string[]>;
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
export declare function createTokenTracker(config: MIMOGatewayConfig): {
    recordArrival(token: TokenArrival): void;
    getArrivedTokens(): TokenArrival[];
    isReady(): boolean;
    clear(): void;
};
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
export declare function validateMIMOConfiguration(config: MIMOGatewayConfig): {
    valid: boolean;
    errors: string[];
};
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
export declare function createFanoutRouting(targetNodes: string[]): MIMOGatewayConfig;
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
export declare function createSelectiveRouting(routes: Array<{
    target: string;
    condition: string;
}>): MIMOGatewayConfig;
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
export declare function createSynchronizationPattern(config: Partial<SynchronizationPattern> & {
    id: string;
    name: string;
    type: SynchronizationPattern['type'];
    inputs: string[];
}): SynchronizationPattern;
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
export declare function evaluateANDSync(pattern: SynchronizationPattern, arrivedInputs: Set<string>): boolean;
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
export declare function evaluateORSync(pattern: SynchronizationPattern, arrivedInputs: Set<string>): boolean;
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
export declare function evaluateXORSync(pattern: SynchronizationPattern, arrivedInputs: Set<string>): boolean;
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
export declare function evaluateQuorumSync(pattern: SynchronizationPattern, arrivedInputs: Set<string>): boolean;
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
export declare function evaluateMajoritySync(pattern: SynchronizationPattern, arrivedInputs: Set<string>): boolean;
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
export declare function createDeadlineSync(inputs: string[], deadlineMs: number, onTimeout?: 'fail' | 'continue' | 'default'): SynchronizationPattern;
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
export declare function monitorSynchronization(pattern: SynchronizationPattern, inputStream: Observable<string>): Promise<{
    completed: boolean;
    arrivedInputs: string[];
}>;
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
export declare function createCustomBehavior(evaluateFn: (inputs: Record<string, any>, config: Record<string, any>) => Promise<string[]>, validateFn: (config: Record<string, any>) => {
    valid: boolean;
    errors?: string[];
}): CustomGatewayBehavior;
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
export declare function registerCustomBehavior(behaviorId: string, behavior: CustomGatewayBehavior): void;
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
export declare function getCustomBehavior(behaviorId: string): CustomGatewayBehavior | null;
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
export declare function createRuleBasedBehavior(rules: Array<{
    condition: string;
    outputs: string[];
}>): CustomGatewayBehavior;
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
export declare function createCompositeGateway(config: Partial<CompositeGateway> & {
    id: string;
    name: string;
    components: CompositeGateway['components'];
}): CompositeGateway;
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
export declare function evaluateCompositeGateway(composite: CompositeGateway, inputs: Record<string, any>): Promise<GatewayExecutionResult>;
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
export declare function validateCompositeGateway(composite: CompositeGateway): {
    valid: boolean;
    errors: string[];
};
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
export declare function createSequentialComposition(components: Array<{
    type: 'exclusive' | 'parallel' | 'inclusive' | 'event-based';
    config: any;
}>): CompositeGateway;
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
export declare function createParallelComposition(components: Array<{
    type: 'exclusive' | 'parallel' | 'inclusive' | 'event-based';
    config: any;
}>): CompositeGateway;
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
export declare function createGatewayChain(config: Partial<GatewayChain> & {
    id: string;
    name: string;
    gateways: GatewayChain['gateways'];
}): GatewayChain;
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
export declare function executeGatewayChain(chain: GatewayChain, initialContext: Record<string, any>): Promise<{
    finalOutputs: string[];
    executionPath: string[];
}>;
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
export declare function validateGatewayChain(chain: GatewayChain): {
    valid: boolean;
    errors: string[];
};
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
export declare function optimizeGatewayConfiguration(config: ComplexGatewayConfig): ComplexGatewayConfig;
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
export declare function analyzeGatewayBottlenecks(profile: GatewayPerformanceProfile): string[];
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
export declare function suggestGatewayOptimizations(profile: GatewayPerformanceProfile): Array<{
    suggestion: string;
    priority: 'high' | 'medium' | 'low';
}>;
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
export declare function profileGatewayExecution(gatewayId: string, executionFn: () => Promise<any>): Promise<GatewayPerformanceProfile>;
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
export declare function collectGatewayMetrics(gatewayId: string, iterations: number, executionFn: () => Promise<any>): Promise<GatewayPerformanceProfile>;
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
export declare function exportPerformanceProfile(profile: GatewayPerformanceProfile): string;
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
export declare function createGatewayDebugContext(gatewayId: string, inputs: Record<string, any>): GatewayDebugContext;
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
export declare function recordDebugStep(context: GatewayDebugContext, description: string, result: any, duration: number): GatewayDebugContext;
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
export declare function visualizeGatewayEvaluation(context: GatewayDebugContext): string;
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
export declare function exportDebugContext(context: GatewayDebugContext): string;
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
export declare function getGatewayPatternLibrary(): Record<string, any>;
//# sourceMappingURL=workflow-complex-gateway.d.ts.map