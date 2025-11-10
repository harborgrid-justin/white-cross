/**
 * LOC: WF-INC-001
 * File: /reuse/server/workflow/workflow-inclusive-gateway.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common (v11.1.8)
 *   - @nestjs/swagger (v11.2.1)
 *   - class-validator (v0.14.2)
 *   - class-transformer (v0.5.1)
 *   - rxjs (v7.8.1)
 *
 * DOWNSTREAM (imported by):
 *   - Workflow orchestration services
 *   - Business process automation
 *   - Decision gateway handlers
 *   - Conditional routing modules
 */
import { Observable } from 'rxjs';
/**
 * Inclusive gateway evaluation mode
 */
export declare enum EvaluationMode {
    SEQUENTIAL = "SEQUENTIAL",// Evaluate conditions sequentially
    PARALLEL = "PARALLEL",// Evaluate all conditions in parallel
    SHORT_CIRCUIT = "SHORT_CIRCUIT",// Stop on first false
    LAZY = "LAZY"
}
/**
 * Condition evaluation result
 */
export declare enum ConditionResult {
    TRUE = "TRUE",
    FALSE = "FALSE",
    UNKNOWN = "UNKNOWN",
    ERROR = "ERROR"
}
/**
 * Branch activation status
 */
export declare enum ActivationStatus {
    INACTIVE = "INACTIVE",
    ACTIVATED = "ACTIVATED",
    EXECUTING = "EXECUTING",
    COMPLETED = "COMPLETED",
    FAILED = "FAILED",
    SKIPPED = "SKIPPED"
}
/**
 * Inclusive join state
 */
export declare enum InclusiveJoinState {
    WAITING = "WAITING",
    COLLECTING = "COLLECTING",
    SYNCHRONIZING = "SYNCHRONIZING",
    COMPLETED = "COMPLETED",
    TIMEOUT = "TIMEOUT",
    FAILED = "FAILED"
}
/**
 * Token arrival strategy
 */
export declare enum TokenStrategy {
    WAIT_ALL = "WAIT_ALL",// Wait for all activated branches
    WAIT_ANY = "WAIT_ANY",// Wait for any activated branch
    WAIT_TIMEOUT = "WAIT_TIMEOUT",// Wait with timeout
    OPTIMISTIC = "OPTIMISTIC"
}
/**
 * Inclusive gateway configuration DTO
 */
export declare class InclusiveGatewayConfigDto {
    gatewayId: string;
    name: string;
    evaluationMode: EvaluationMode;
    tokenStrategy: TokenStrategy;
    joinTimeoutMs?: number;
    allowIncomplete?: boolean;
    defaultActivation?: boolean;
    maxActivations?: number;
    metadata?: Record<string, any>;
}
/**
 * Condition definition DTO
 */
export declare class ConditionDefinitionDto {
    conditionId: string;
    branchId: string;
    expression: string;
    priority?: number;
    weight?: number;
    required?: boolean;
    description?: string;
    metadata?: Record<string, any>;
}
/**
 * Branch activation definition
 */
export interface BranchActivation {
    branchId: string;
    conditionId: string;
    activatedAt: Date;
    status: ActivationStatus;
    tokenId?: string;
    result?: any;
    error?: string;
}
/**
 * Condition evaluation result
 */
export interface ConditionEvaluation {
    conditionId: string;
    branchId: string;
    result: ConditionResult;
    value?: boolean;
    evaluatedAt: Date;
    evaluationTime: number;
    error?: string;
    metadata?: Record<string, any>;
}
/**
 * Inclusive gateway instance
 */
export interface InclusiveGatewayInstance {
    instanceId: string;
    gatewayId: string;
    state: InclusiveJoinState;
    evaluationMode: EvaluationMode;
    tokenStrategy: TokenStrategy;
    activatedBranches: Map<string, BranchActivation>;
    conditions: Map<string, ConditionEvaluation>;
    expectedTokens: Set<string>;
    arrivedTokens: Set<string>;
    splitTime?: Date;
    joinTime?: Date;
    timeoutHandle?: NodeJS.Timeout;
    metadata?: Record<string, any>;
}
/**
 * Inclusive join token
 */
export interface InclusiveToken {
    tokenId: string;
    branchId: string;
    gatewayId: string;
    instanceId: string;
    createdAt: Date;
    arrivedAt?: Date;
    consumed: boolean;
    data?: Record<string, any>;
}
/**
 * Branch activation pattern
 */
export interface ActivationPattern {
    patternId: string;
    name: string;
    conditions: string[];
    minActivations: number;
    maxActivations?: number;
    activationLogic: 'AND' | 'OR' | 'XOR' | 'CUSTOM';
}
/**
 * Join synchronization context
 */
export interface JoinSyncContext {
    instanceId: string;
    gatewayId: string;
    expectedBranches: Set<string>;
    arrivedBranches: Set<string>;
    pendingBranches: Set<string>;
    completedBranches: Set<string>;
    failedBranches: Set<string>;
    startTime: Date;
    timeoutMs: number;
}
/**
 * Incomplete branch handler
 */
export interface IncompleteBranchHandler {
    strategy: 'WAIT' | 'SKIP' | 'COMPENSATE' | 'FAIL';
    timeoutAction?: () => void;
    compensationAction?: (branchId: string) => Promise<void>;
}
/**
 * 1. Creates inclusive gateway instance
 *
 * @param {InclusiveGatewayConfigDto} config - Gateway configuration
 * @param {ConditionDefinitionDto[]} conditions - Branch conditions
 * @returns {InclusiveGatewayInstance} Gateway instance
 *
 * @example
 * ```typescript
 * const gateway = createInclusiveGateway(config, conditions);
 * console.log(`Created inclusive gateway ${gateway.instanceId}`);
 * ```
 */
export declare function createInclusiveGateway(config: InclusiveGatewayConfigDto, conditions: ConditionDefinitionDto[]): InclusiveGatewayInstance;
/**
 * 2. Evaluates all conditions for branch activation
 *
 * @param {InclusiveGatewayInstance} instance - Gateway instance
 * @param {ConditionDefinitionDto[]} conditions - Conditions to evaluate
 * @param {Record<string, any>} context - Evaluation context
 * @returns {Promise<Map<string, ConditionEvaluation>>} Evaluation results
 *
 * @example
 * ```typescript
 * const results = await evaluateAllConditions(instance, conditions, context);
 * console.log(`Evaluated ${results.size} conditions`);
 * ```
 */
export declare function evaluateAllConditions(instance: InclusiveGatewayInstance, conditions: ConditionDefinitionDto[], context: Record<string, any>): Promise<Map<string, ConditionEvaluation>>;
/**
 * 3. Evaluates single condition expression
 *
 * @param {ConditionDefinitionDto} condition - Condition definition
 * @param {Record<string, any>} context - Evaluation context
 * @returns {Promise<ConditionEvaluation>} Evaluation result
 *
 * @example
 * ```typescript
 * const result = await evaluateSingleCondition(condition, { priority: 8 });
 * console.log(`Condition ${result.conditionId}: ${result.result}`);
 * ```
 */
export declare function evaluateSingleCondition(condition: ConditionDefinitionDto, context: Record<string, any>): Promise<ConditionEvaluation>;
/**
 * 4. Evaluates condition expression safely
 *
 * @param {string} expression - Condition expression
 * @param {Record<string, any>} context - Evaluation context
 * @returns {boolean} Evaluation result
 *
 * @example
 * ```typescript
 * const result = evaluateExpression('age >= 18', { age: 25 });
 * console.log(`Expression result: ${result}`);
 * ```
 */
export declare function evaluateExpression(expression: string, context: Record<string, any>): boolean;
/**
 * 5. Validates condition syntax
 *
 * @param {string} expression - Condition expression
 * @returns {{ valid: boolean; error?: string }} Validation result
 *
 * @example
 * ```typescript
 * const { valid, error } = validateConditionSyntax('priority > 5');
 * if (!valid) console.error(`Invalid: ${error}`);
 * ```
 */
export declare function validateConditionSyntax(expression: string): {
    valid: boolean;
    error?: string;
};
/**
 * 6. Evaluates composite AND conditions
 *
 * @param {ConditionDefinitionDto[]} conditions - Conditions to evaluate
 * @param {Record<string, any>} context - Evaluation context
 * @returns {Promise<boolean>} Whether all conditions are true
 *
 * @example
 * ```typescript
 * const allTrue = await evaluateAndConditions(conditions, context);
 * console.log(`All conditions met: ${allTrue}`);
 * ```
 */
export declare function evaluateAndConditions(conditions: ConditionDefinitionDto[], context: Record<string, any>): Promise<boolean>;
/**
 * 7. Evaluates composite OR conditions
 *
 * @param {ConditionDefinitionDto[]} conditions - Conditions to evaluate
 * @param {Record<string, any>} context - Evaluation context
 * @returns {Promise<boolean>} Whether any condition is true
 *
 * @example
 * ```typescript
 * const anyTrue = await evaluateOrConditions(conditions, context);
 * console.log(`At least one condition met: ${anyTrue}`);
 * ```
 */
export declare function evaluateOrConditions(conditions: ConditionDefinitionDto[], context: Record<string, any>): Promise<boolean>;
/**
 * 8. Evaluates weighted conditions
 *
 * @param {ConditionDefinitionDto[]} conditions - Weighted conditions
 * @param {Record<string, any>} context - Evaluation context
 * @param {number} threshold - Activation threshold (0-1)
 * @returns {Promise<{ score: number; activates: boolean }>} Weighted result
 *
 * @example
 * ```typescript
 * const { score, activates } = await evaluateWeightedConditions(conditions, context, 0.7);
 * console.log(`Score: ${score}, Activates: ${activates}`);
 * ```
 */
export declare function evaluateWeightedConditions(conditions: ConditionDefinitionDto[], context: Record<string, any>, threshold: number): Promise<{
    score: number;
    activates: boolean;
}>;
/**
 * 9. Evaluates priority-based conditions
 *
 * @param {ConditionDefinitionDto[]} conditions - Prioritized conditions
 * @param {Record<string, any>} context - Evaluation context
 * @returns {Promise<ConditionDefinitionDto[]>} Sorted by priority and result
 *
 * @example
 * ```typescript
 * const sorted = await evaluatePriorityConditions(conditions, context);
 * console.log(`Highest priority true condition: ${sorted[0]?.conditionId}`);
 * ```
 */
export declare function evaluatePriorityConditions(conditions: ConditionDefinitionDto[], context: Record<string, any>): Promise<ConditionDefinitionDto[]>;
/**
 * 10. Evaluates required vs optional conditions
 *
 * @param {ConditionDefinitionDto[]} conditions - Conditions to evaluate
 * @param {Record<string, any>} context - Evaluation context
 * @returns {Promise<{ canActivate: boolean; required: number; optional: number }>} Evaluation summary
 *
 * @example
 * ```typescript
 * const { canActivate, required } = await evaluateRequiredConditions(conditions, context);
 * console.log(`Can activate: ${canActivate}, Required met: ${required}`);
 * ```
 */
export declare function evaluateRequiredConditions(conditions: ConditionDefinitionDto[], context: Record<string, any>): Promise<{
    canActivate: boolean;
    requiredMet: number;
    optionalMet: number;
}>;
/**
 * 11. Activates branches based on condition evaluations
 *
 * @param {InclusiveGatewayInstance} instance - Gateway instance
 * @param {Map<string, ConditionEvaluation>} evaluations - Condition results
 * @returns {Map<string, BranchActivation>} Activated branches
 *
 * @example
 * ```typescript
 * const activated = activateBranches(instance, evaluations);
 * console.log(`Activated ${activated.size} branches`);
 * ```
 */
export declare function activateBranches(instance: InclusiveGatewayInstance, evaluations: Map<string, ConditionEvaluation>): Map<string, BranchActivation>;
/**
 * 12. Determines dynamic branch activation
 *
 * @param {ConditionDefinitionDto[]} conditions - Available conditions
 * @param {Record<string, any>} context - Evaluation context
 * @param {number} maxActivations - Maximum branches to activate
 * @returns {Promise<string[]>} Branch IDs to activate
 *
 * @example
 * ```typescript
 * const branches = await determineDynamicActivation(conditions, context, 5);
 * console.log(`Dynamically activated ${branches.length} branches`);
 * ```
 */
export declare function determineDynamicActivation(conditions: ConditionDefinitionDto[], context: Record<string, any>, maxActivations?: number): Promise<string[]>;
/**
 * 13. Validates activation pattern
 *
 * @param {ActivationPattern} pattern - Activation pattern
 * @param {string[]} activatedBranches - Currently activated branches
 * @returns {boolean} Whether pattern is valid
 *
 * @example
 * ```typescript
 * const valid = validateActivationPattern(pattern, activatedBranches);
 * console.log(`Pattern valid: ${valid}`);
 * ```
 */
export declare function validateActivationPattern(pattern: ActivationPattern, activatedBranches: string[]): boolean;
/**
 * 14. Creates activation pattern
 *
 * @param {string} name - Pattern name
 * @param {string[]} conditions - Condition IDs
 * @param {number} minActivations - Minimum activations
 * @param {number} maxActivations - Maximum activations
 * @returns {ActivationPattern} Activation pattern
 *
 * @example
 * ```typescript
 * const pattern = createActivationPattern('approval', conditions, 1, 3);
 * console.log(`Created pattern: ${pattern.name}`);
 * ```
 */
export declare function createActivationPattern(name: string, conditions: string[], minActivations: number, maxActivations?: number): ActivationPattern;
/**
 * 15. Tracks branch activation lifecycle
 *
 * @param {InclusiveGatewayInstance} instance - Gateway instance
 * @param {string} branchId - Branch identifier
 * @param {ActivationStatus} status - New status
 *
 * @example
 * ```typescript
 * trackActivationStatus(instance, branchId, ActivationStatus.EXECUTING);
 * ```
 */
export declare function trackActivationStatus(instance: InclusiveGatewayInstance, branchId: string, status: ActivationStatus): void;
/**
 * 16. Initializes inclusive join synchronization
 *
 * @param {InclusiveGatewayInstance} instance - Gateway instance
 * @param {number} timeoutMs - Join timeout
 * @returns {JoinSyncContext} Synchronization context
 *
 * @example
 * ```typescript
 * const syncCtx = initializeInclusiveJoin(instance, 60000);
 * console.log(`Waiting for ${syncCtx.expectedBranches.size} branches`);
 * ```
 */
export declare function initializeInclusiveJoin(instance: InclusiveGatewayInstance, timeoutMs: number): JoinSyncContext;
/**
 * 17. Registers token arrival at join
 *
 * @param {InclusiveGatewayInstance} instance - Gateway instance
 * @param {JoinSyncContext} syncContext - Sync context
 * @param {InclusiveToken} token - Arriving token
 * @returns {boolean} Whether all expected tokens arrived
 *
 * @example
 * ```typescript
 * const allArrived = registerTokenArrival(instance, syncCtx, token);
 * console.log(`All tokens arrived: ${allArrived}`);
 * ```
 */
export declare function registerTokenArrival(instance: InclusiveGatewayInstance, syncContext: JoinSyncContext, token: InclusiveToken): boolean;
/**
 * 18. Checks join completion criteria
 *
 * @param {InclusiveGatewayInstance} instance - Gateway instance
 * @param {JoinSyncContext} syncContext - Sync context
 * @returns {boolean} Whether join can complete
 *
 * @example
 * ```typescript
 * const canComplete = checkJoinCompletion(instance, syncCtx);
 * console.log(`Join can complete: ${canComplete}`);
 * ```
 */
export declare function checkJoinCompletion(instance: InclusiveGatewayInstance, syncContext: JoinSyncContext): boolean;
/**
 * 19. Executes inclusive join
 *
 * @param {InclusiveGatewayInstance} instance - Gateway instance
 * @param {JoinSyncContext} syncContext - Sync context
 * @returns {Promise<boolean>} Whether join succeeded
 *
 * @example
 * ```typescript
 * const success = await executeInclusiveJoin(instance, syncCtx);
 * console.log(`Join ${success ? 'succeeded' : 'failed'}`);
 * ```
 */
export declare function executeInclusiveJoin(instance: InclusiveGatewayInstance, syncContext: JoinSyncContext): Promise<boolean>;
/**
 * 20. Handles join timeout
 *
 * @param {InclusiveGatewayInstance} instance - Gateway instance
 * @param {JoinSyncContext} syncContext - Sync context
 * @param {IncompleteBranchHandler} handler - Incomplete branch handler
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await handleJoinTimeout(instance, syncCtx, { strategy: 'SKIP' });
 * ```
 */
export declare function handleJoinTimeout(instance: InclusiveGatewayInstance, syncContext: JoinSyncContext, handler: IncompleteBranchHandler): Promise<void>;
/**
 * 21. Implements discriminator join pattern
 *
 * @param {InclusiveGatewayInstance} instance - Gateway instance
 * @param {string} discriminatorBranchId - Discriminator branch
 * @returns {Promise<boolean>} Whether discriminator arrived
 *
 * @example
 * ```typescript
 * const arrived = await implementDiscriminatorJoin(instance, discriminatorId);
 * console.log(`Discriminator arrived: ${arrived}`);
 * ```
 */
export declare function implementDiscriminatorJoin(instance: InclusiveGatewayInstance, discriminatorBranchId: string): Promise<boolean>;
/**
 * 22. Implements cascading join pattern
 *
 * @param {InclusiveGatewayInstance} instance - Gateway instance
 * @param {string[][]} cascadeLevels - Branch groups per level
 * @returns {Promise<number>} Number of levels completed
 *
 * @example
 * ```typescript
 * const levels = await implementCascadingJoin(instance, [[b1, b2], [b3]]);
 * console.log(`Completed ${levels} cascade levels`);
 * ```
 */
export declare function implementCascadingJoin(instance: InclusiveGatewayInstance, cascadeLevels: string[][]): Promise<number>;
/**
 * 23. Implements partial join with threshold
 *
 * @param {InclusiveGatewayInstance} instance - Gateway instance
 * @param {number} threshold - Percentage threshold (0-100)
 * @returns {Promise<boolean>} Whether threshold met
 *
 * @example
 * ```typescript
 * const met = await implementThresholdJoin(instance, 75);
 * console.log(`75% threshold met: ${met}`);
 * ```
 */
export declare function implementThresholdJoin(instance: InclusiveGatewayInstance, threshold: number): Promise<boolean>;
/**
 * 24. Implements priority-based join
 *
 * @param {InclusiveGatewayInstance} instance - Gateway instance
 * @param {Map<string, number>} branchPriorities - Branch priorities
 * @returns {Promise<string[]>} Branches in arrival order
 *
 * @example
 * ```typescript
 * const order = await implementPriorityJoin(instance, priorities);
 * console.log(`Highest priority first: ${order[0]}`);
 * ```
 */
export declare function implementPriorityJoin(instance: InclusiveGatewayInstance, branchPriorities: Map<string, number>): Promise<string[]>;
/**
 * 25. Implements cancellation region join
 *
 * @param {InclusiveGatewayInstance} instance - Gateway instance
 * @param {string} cancelBranchId - Cancellation trigger branch
 * @returns {Promise<boolean>} Whether cancelled
 *
 * @example
 * ```typescript
 * const cancelled = await implementCancellationJoin(instance, cancelBranchId);
 * console.log(`Join cancelled: ${cancelled}`);
 * ```
 */
export declare function implementCancellationJoin(instance: InclusiveGatewayInstance, cancelBranchId: string): Promise<boolean>;
/**
 * 26. Creates inclusive join token
 *
 * @param {string} branchId - Branch identifier
 * @param {string} gatewayId - Gateway identifier
 * @param {string} instanceId - Instance identifier
 * @returns {InclusiveToken} Join token
 *
 * @example
 * ```typescript
 * const token = createInclusiveToken(branchId, gatewayId, instanceId);
 * console.log(`Token ${token.tokenId} created`);
 * ```
 */
export declare function createInclusiveToken(branchId: string, gatewayId: string, instanceId: string): InclusiveToken;
/**
 * 27. Validates token authenticity
 *
 * @param {InclusiveToken} token - Token to validate
 * @param {InclusiveGatewayInstance} instance - Gateway instance
 * @returns {boolean} Whether token is valid
 *
 * @example
 * ```typescript
 * const valid = validateToken(token, instance);
 * if (!valid) console.error('Invalid token');
 * ```
 */
export declare function validateToken(token: InclusiveToken, instance: InclusiveGatewayInstance): boolean;
/**
 * 28. Consumes token at join point
 *
 * @param {InclusiveGatewayInstance} instance - Gateway instance
 * @param {InclusiveToken} token - Token to consume
 * @returns {boolean} Whether consumption succeeded
 *
 * @example
 * ```typescript
 * const consumed = consumeInclusiveToken(instance, token);
 * console.log(`Token consumed: ${consumed}`);
 * ```
 */
export declare function consumeInclusiveToken(instance: InclusiveGatewayInstance, token: InclusiveToken): boolean;
/**
 * 29. Counts expected tokens
 *
 * @param {InclusiveGatewayInstance} instance - Gateway instance
 * @returns {number} Number of expected tokens
 *
 * @example
 * ```typescript
 * const expected = countExpectedTokens(instance);
 * console.log(`Expecting ${expected} tokens`);
 * ```
 */
export declare function countExpectedTokens(instance: InclusiveGatewayInstance): number;
/**
 * 30. Counts arrived tokens
 *
 * @param {InclusiveGatewayInstance} instance - Gateway instance
 * @returns {number} Number of arrived tokens
 *
 * @example
 * ```typescript
 * const arrived = countArrivedTokens(instance);
 * console.log(`${arrived} tokens arrived`);
 * ```
 */
export declare function countArrivedTokens(instance: InclusiveGatewayInstance): number;
/**
 * 31. Counts activated branches
 *
 * @param {InclusiveGatewayInstance} instance - Gateway instance
 * @returns {number} Number of activated branches
 *
 * @example
 * ```typescript
 * const count = countActivatedBranches(instance);
 * console.log(`${count} branches activated`);
 * ```
 */
export declare function countActivatedBranches(instance: InclusiveGatewayInstance): number;
/**
 * 32. Counts completed branches
 *
 * @param {InclusiveGatewayInstance} instance - Gateway instance
 * @returns {number} Number of completed branches
 *
 * @example
 * ```typescript
 * const completed = countCompletedBranches(instance);
 * console.log(`${completed} branches completed`);
 * ```
 */
export declare function countCompletedBranches(instance: InclusiveGatewayInstance): number;
/**
 * 33. Counts failed branches
 *
 * @param {InclusiveGatewayInstance} instance - Gateway instance
 * @returns {number} Number of failed branches
 *
 * @example
 * ```typescript
 * const failed = countFailedBranches(instance);
 * console.log(`${failed} branches failed`);
 * ```
 */
export declare function countFailedBranches(instance: InclusiveGatewayInstance): number;
/**
 * 34. Gets pending branches
 *
 * @param {InclusiveGatewayInstance} instance - Gateway instance
 * @returns {BranchActivation[]} Pending branches
 *
 * @example
 * ```typescript
 * const pending = getPendingActivations(instance);
 * console.log(`${pending.length} branches still pending`);
 * ```
 */
export declare function getPendingActivations(instance: InclusiveGatewayInstance): BranchActivation[];
/**
 * 35. Calculates branch completion rate
 *
 * @param {InclusiveGatewayInstance} instance - Gateway instance
 * @returns {number} Completion rate (0-100)
 *
 * @example
 * ```typescript
 * const rate = calculateCompletionRate(instance);
 * console.log(`Completion rate: ${rate}%`);
 * ```
 */
export declare function calculateCompletionRate(instance: InclusiveGatewayInstance): number;
/**
 * 36. Sets join timeout
 *
 * @param {InclusiveGatewayInstance} instance - Gateway instance
 * @param {number} timeoutMs - Timeout in milliseconds
 * @param {() => void} callback - Timeout callback
 *
 * @example
 * ```typescript
 * setJoinTimeout(instance, 60000, () => console.log('Join timeout!'));
 * ```
 */
export declare function setJoinTimeout(instance: InclusiveGatewayInstance, timeoutMs: number, callback: () => void): void;
/**
 * 37. Clears join timeout
 *
 * @param {InclusiveGatewayInstance} instance - Gateway instance
 *
 * @example
 * ```typescript
 * clearJoinTimeout(instance);
 * ```
 */
export declare function clearJoinTimeout(instance: InclusiveGatewayInstance): void;
/**
 * 38. Extends join timeout
 *
 * @param {InclusiveGatewayInstance} instance - Gateway instance
 * @param {number} additionalMs - Additional time in milliseconds
 *
 * @example
 * ```typescript
 * extendJoinTimeout(instance, 30000);
 * console.log('Timeout extended by 30s');
 * ```
 */
export declare function extendJoinTimeout(instance: InclusiveGatewayInstance, additionalMs: number): void;
/**
 * 39. Calculates remaining timeout
 *
 * @param {JoinSyncContext} syncContext - Sync context
 * @returns {number} Remaining time in milliseconds
 *
 * @example
 * ```typescript
 * const remaining = calculateRemainingTimeout(syncCtx);
 * console.log(`${remaining}ms remaining`);
 * ```
 */
export declare function calculateRemainingTimeout(syncContext: JoinSyncContext): number;
/**
 * 40. Checks if timeout exceeded
 *
 * @param {JoinSyncContext} syncContext - Sync context
 * @returns {boolean} Whether timeout exceeded
 *
 * @example
 * ```typescript
 * if (isTimeoutExceeded(syncCtx)) {
 *   console.log('Timeout exceeded!');
 * }
 * ```
 */
export declare function isTimeoutExceeded(syncContext: JoinSyncContext): boolean;
/**
 * 41. Persists gateway state
 *
 * @param {InclusiveGatewayInstance} instance - Gateway instance
 * @returns {string} Serialized state
 *
 * @example
 * ```typescript
 * const state = persistGatewayState(instance);
 * await storage.save(state);
 * ```
 */
export declare function persistGatewayState(instance: InclusiveGatewayInstance): string;
/**
 * 42. Restores gateway state
 *
 * @param {string} serialized - Serialized state
 * @returns {InclusiveGatewayInstance} Restored instance
 *
 * @example
 * ```typescript
 * const instance = restoreGatewayState(serializedState);
 * console.log(`Restored gateway ${instance.instanceId}`);
 * ```
 */
export declare function restoreGatewayState(serialized: string): InclusiveGatewayInstance;
/**
 * 43. Optimizes condition evaluation order
 *
 * @param {ConditionDefinitionDto[]} conditions - Conditions to optimize
 * @returns {ConditionDefinitionDto[]} Optimized order
 *
 * @example
 * ```typescript
 * const optimized = optimizeEvaluationOrder(conditions);
 * console.log(`Optimized evaluation order`);
 * ```
 */
export declare function optimizeEvaluationOrder(conditions: ConditionDefinitionDto[]): ConditionDefinitionDto[];
/**
 * 44. Creates execution report
 *
 * @param {InclusiveGatewayInstance} instance - Gateway instance
 * @returns {object} Detailed execution report
 *
 * @example
 * ```typescript
 * const report = createInclusiveGatewayReport(instance);
 * console.log(`Report: ${report.activatedBranches} activated`);
 * ```
 */
export declare function createInclusiveGatewayReport(instance: InclusiveGatewayInstance): {
    instanceId: string;
    gatewayId: string;
    state: InclusiveJoinState;
    evaluatedConditions: number;
    activatedBranches: number;
    completedBranches: number;
    failedBranches: number;
    expectedTokens: number;
    arrivedTokens: number;
    completionRate: number;
    duration?: number;
};
/**
 * 45. Streams real-time gateway updates
 *
 * @param {InclusiveGatewayInstance} instance - Gateway instance
 * @returns {Observable<any>} Update stream
 *
 * @example
 * ```typescript
 * const updates$ = streamGatewayUpdates(instance);
 * updates$.subscribe(update => console.log('Update:', update));
 * ```
 */
export declare function streamGatewayUpdates(instance: InclusiveGatewayInstance): Observable<{
    timestamp: Date;
    state: InclusiveJoinState;
    activatedBranches: number;
    arrivedTokens: number;
    completionRate: number;
}>;
declare const _default: {
    createInclusiveGateway: typeof createInclusiveGateway;
    evaluateAllConditions: typeof evaluateAllConditions;
    evaluateSingleCondition: typeof evaluateSingleCondition;
    evaluateExpression: typeof evaluateExpression;
    validateConditionSyntax: typeof validateConditionSyntax;
    evaluateAndConditions: typeof evaluateAndConditions;
    evaluateOrConditions: typeof evaluateOrConditions;
    evaluateWeightedConditions: typeof evaluateWeightedConditions;
    evaluatePriorityConditions: typeof evaluatePriorityConditions;
    evaluateRequiredConditions: typeof evaluateRequiredConditions;
    activateBranches: typeof activateBranches;
    determineDynamicActivation: typeof determineDynamicActivation;
    validateActivationPattern: typeof validateActivationPattern;
    createActivationPattern: typeof createActivationPattern;
    trackActivationStatus: typeof trackActivationStatus;
    initializeInclusiveJoin: typeof initializeInclusiveJoin;
    registerTokenArrival: typeof registerTokenArrival;
    checkJoinCompletion: typeof checkJoinCompletion;
    executeInclusiveJoin: typeof executeInclusiveJoin;
    handleJoinTimeout: typeof handleJoinTimeout;
    implementDiscriminatorJoin: typeof implementDiscriminatorJoin;
    implementCascadingJoin: typeof implementCascadingJoin;
    implementThresholdJoin: typeof implementThresholdJoin;
    implementPriorityJoin: typeof implementPriorityJoin;
    implementCancellationJoin: typeof implementCancellationJoin;
    createInclusiveToken: typeof createInclusiveToken;
    validateToken: typeof validateToken;
    consumeInclusiveToken: typeof consumeInclusiveToken;
    countExpectedTokens: typeof countExpectedTokens;
    countArrivedTokens: typeof countArrivedTokens;
    countActivatedBranches: typeof countActivatedBranches;
    countCompletedBranches: typeof countCompletedBranches;
    countFailedBranches: typeof countFailedBranches;
    getPendingActivations: typeof getPendingActivations;
    calculateCompletionRate: typeof calculateCompletionRate;
    setJoinTimeout: typeof setJoinTimeout;
    clearJoinTimeout: typeof clearJoinTimeout;
    extendJoinTimeout: typeof extendJoinTimeout;
    calculateRemainingTimeout: typeof calculateRemainingTimeout;
    isTimeoutExceeded: typeof isTimeoutExceeded;
    persistGatewayState: typeof persistGatewayState;
    restoreGatewayState: typeof restoreGatewayState;
    optimizeEvaluationOrder: typeof optimizeEvaluationOrder;
    createInclusiveGatewayReport: typeof createInclusiveGatewayReport;
    streamGatewayUpdates: typeof streamGatewayUpdates;
};
export default _default;
//# sourceMappingURL=workflow-inclusive-gateway.d.ts.map