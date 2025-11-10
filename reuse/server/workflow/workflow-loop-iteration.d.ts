/**
 * LOC: WFL-LOOP-001
 * File: /reuse/server/workflow/workflow-loop-iteration.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - sequelize / sequelize-typescript
 *   - zod
 *
 * DOWNSTREAM (imported by):
 *   - Workflow execution engines
 *   - Multi-instance task handlers
 *   - Loop orchestration services
 *   - Batch processing modules
 *   - Workflow state managers
 */
/**
 * Zod schema for loop configuration.
 */
export declare const LoopConfigSchema: any;
/**
 * Zod schema for loop iteration state.
 */
export declare const LoopIterationStateSchema: any;
/**
 * Zod schema for multi-instance configuration.
 */
export declare const MultiInstanceConfigSchema: any;
/**
 * Zod schema for loop audit entry.
 */
export declare const LoopAuditEntrySchema: any;
export interface LoopConfig {
    loopId: string;
    workflowInstanceId: string;
    loopType: 'standard' | 'multi-instance-sequential' | 'multi-instance-parallel' | 'while' | 'foreach';
    collection?: any[];
    cardinality?: number;
    completionCondition?: string;
    maxIterations?: number;
    timeoutMs?: number;
    variables?: Record<string, any>;
    metadata?: Record<string, any>;
}
export interface LoopIterationState {
    loopId: string;
    iterationIndex: number;
    currentItem?: any;
    loopCounter: number;
    totalIterations?: number;
    status: 'pending' | 'active' | 'completed' | 'failed' | 'terminated';
    startedAt?: Date;
    completedAt?: Date;
    result?: any;
    error?: string;
}
export interface MultiInstanceConfig {
    isSequential: boolean;
    collection: any[];
    elementVariable: string;
    completionCondition?: string;
    loopCardinality?: number;
    nrOfInstances?: number;
    nrOfActiveInstances?: number;
    nrOfCompletedInstances: number;
}
export interface LoopContext {
    loopId: string;
    variables: Record<string, any>;
    iterations: LoopIterationState[];
    currentIndex: number;
    startedAt: Date;
    completedAt?: Date;
    status: 'active' | 'completed' | 'failed' | 'terminated';
    results: any[];
    errors: string[];
}
export interface LoopConditionEvaluation {
    shouldContinue: boolean;
    reason?: string;
    evaluatedAt: Date;
    context: Record<string, any>;
}
export interface LoopAuditEntry {
    auditId: string;
    loopId: string;
    workflowInstanceId: string;
    eventType: 'loop_initialized' | 'iteration_started' | 'iteration_completed' | 'iteration_failed' | 'loop_completed' | 'loop_terminated' | 'variable_updated' | 'condition_evaluated';
    iterationIndex?: number;
    details: Record<string, any>;
    performedBy?: string;
    timestamp: Date;
}
export interface LoopMetrics {
    loopId: string;
    totalIterations: number;
    completedIterations: number;
    failedIterations: number;
    averageIterationTimeMs: number;
    totalExecutionTimeMs: number;
    throughput: number;
    errorRate: number;
}
export interface NestedLoopConfig {
    parentLoopId?: string;
    depth: number;
    maxDepth: number;
    isolateVariables: boolean;
}
export interface SecurityContext {
    userId: string;
    roles: string[];
    permissions: string[];
    tenantId?: string;
    ipAddress?: string;
    sessionId?: string;
}
/**
 * Validates user authorization for loop operations.
 */
export declare const validateLoopAuthorization: (context: SecurityContext, requiredPermission: string) => boolean;
/**
 * Creates audit log entry for loop operations.
 */
export declare const createLoopAuditLog: (loopId: string, workflowInstanceId: string, eventType: LoopAuditEntry["eventType"], details: Record<string, any>, context: SecurityContext) => LoopAuditEntry;
/**
 * 1. Initializes a standard loop with configuration and validation.
 *
 * @example
 * ```typescript
 * const loopContext = initializeLoop({
 *   loopId: crypto.randomUUID(),
 *   workflowInstanceId: 'workflow-123',
 *   loopType: 'standard',
 *   maxIterations: 10,
 *   variables: { counter: 0 }
 * }, securityContext);
 * ```
 */
export declare const initializeLoop: (config: LoopConfig, context: SecurityContext) => LoopContext;
/**
 * 2. Initializes a multi-instance sequential loop.
 *
 * @example
 * ```typescript
 * const multiInstance = initializeMultiInstanceSequential({
 *   isSequential: true,
 *   collection: [patient1, patient2, patient3],
 *   elementVariable: 'currentPatient',
 *   nrOfCompletedInstances: 0
 * }, loopContext, securityContext);
 * ```
 */
export declare const initializeMultiInstanceSequential: (config: MultiInstanceConfig, loopContext: LoopContext, context: SecurityContext) => MultiInstanceConfig;
/**
 * 3. Initializes a multi-instance parallel loop.
 *
 * @example
 * ```typescript
 * const parallelLoop = initializeMultiInstanceParallel({
 *   isSequential: false,
 *   collection: labResults,
 *   elementVariable: 'labResult',
 *   nrOfCompletedInstances: 0
 * }, loopContext, securityContext);
 * ```
 */
export declare const initializeMultiInstanceParallel: (config: MultiInstanceConfig, loopContext: LoopContext, context: SecurityContext) => MultiInstanceConfig;
/**
 * 4. Initializes loop variables with default values.
 *
 * @example
 * ```typescript
 * const variables = initializeLoopVariables({
 *   loopCounter: 0,
 *   maxRetries: 3,
 *   processingQueue: []
 * }, loopContext);
 * ```
 */
export declare const initializeLoopVariables: (variables: Record<string, any>, loopContext: LoopContext) => Record<string, any>;
/**
 * 5. Validates loop configuration before initialization.
 *
 * @example
 * ```typescript
 * const isValid = validateLoopConfiguration(loopConfig);
 * if (!isValid.valid) {
 *   throw new Error(isValid.errors.join(', '));
 * }
 * ```
 */
export declare const validateLoopConfiguration: (config: LoopConfig) => {
    valid: boolean;
    errors: string[];
};
/**
 * 6. Evaluates loop condition to determine continuation.
 *
 * @example
 * ```typescript
 * const evaluation = evaluateLoopCondition(
 *   'loopCounter < 10',
 *   loopContext,
 *   securityContext
 * );
 * if (evaluation.shouldContinue) {
 *   // Continue loop
 * }
 * ```
 */
export declare const evaluateLoopCondition: (condition: string, loopContext: LoopContext, context: SecurityContext) => LoopConditionEvaluation;
/**
 * 7. Checks if loop should continue based on iteration count.
 *
 * @example
 * ```typescript
 * const shouldContinue = checkIterationLimit(loopContext, 100);
 * ```
 */
export declare const checkIterationLimit: (loopContext: LoopContext, maxIterations: number) => boolean;
/**
 * 8. Evaluates completion condition for multi-instance loops.
 *
 * @example
 * ```typescript
 * const isComplete = evaluateCompletionCondition(
 *   'nrOfCompletedInstances >= nrOfInstances',
 *   multiInstanceConfig
 * );
 * ```
 */
export declare const evaluateCompletionCondition: (condition: string, multiInstanceConfig: MultiInstanceConfig) => boolean;
/**
 * 9. Checks for timeout conditions in loop execution.
 *
 * @example
 * ```typescript
 * const hasTimedOut = checkLoopTimeout(loopContext, 300000); // 5 minutes
 * if (hasTimedOut) {
 *   terminateLoop(loopContext, 'timeout', securityContext);
 * }
 * ```
 */
export declare const checkLoopTimeout: (loopContext: LoopContext, timeoutMs: number) => boolean;
/**
 * 10. Validates loop variables before condition evaluation.
 *
 * @example
 * ```typescript
 * const isValid = validateLoopVariables(loopContext.variables, ['counter', 'maxValue']);
 * ```
 */
export declare const validateLoopVariables: (variables: Record<string, any>, requiredVariables: string[]) => {
    valid: boolean;
    missing: string[];
};
/**
 * 11. Starts a new loop iteration.
 *
 * @example
 * ```typescript
 * const iteration = startLoopIteration(loopContext, patientRecord, securityContext);
 * ```
 */
export declare const startLoopIteration: (loopContext: LoopContext, currentItem?: any, context?: SecurityContext) => LoopIterationState;
/**
 * 12. Completes a loop iteration with result.
 *
 * @example
 * ```typescript
 * const completed = completeLoopIteration(iteration, { success: true, data: result }, loopContext, securityContext);
 * ```
 */
export declare const completeLoopIteration: (iteration: LoopIterationState, result: any, loopContext: LoopContext, context: SecurityContext) => LoopIterationState;
/**
 * 13. Fails a loop iteration with error.
 *
 * @example
 * ```typescript
 * const failed = failLoopIteration(iteration, error.message, loopContext, securityContext);
 * ```
 */
export declare const failLoopIteration: (iteration: LoopIterationState, error: string, loopContext: LoopContext, context: SecurityContext) => LoopIterationState;
/**
 * 14. Increments loop counter and updates variables.
 *
 * @example
 * ```typescript
 * incrementLoopCounter(loopContext);
 * ```
 */
export declare const incrementLoopCounter: (loopContext: LoopContext) => void;
/**
 * 15. Resets loop counter for nested loops.
 *
 * @example
 * ```typescript
 * resetLoopCounter(loopContext);
 * ```
 */
export declare const resetLoopCounter: (loopContext: LoopContext) => void;
/**
 * 16. Executes next instance in sequential multi-instance loop.
 *
 * @example
 * ```typescript
 * const instance = executeNextSequentialInstance(multiInstanceConfig, loopContext, async (item) => {
 *   return await processPatient(item);
 * }, securityContext);
 * ```
 */
export declare const executeNextSequentialInstance: (config: MultiInstanceConfig, loopContext: LoopContext, taskExecutor: (item: any) => Promise<any>, context: SecurityContext) => Promise<LoopIterationState | null>;
/**
 * 17. Gets current sequential instance details.
 *
 * @example
 * ```typescript
 * const instance = getCurrentSequentialInstance(multiInstanceConfig);
 * console.log(`Processing ${instance.index} of ${instance.total}`);
 * ```
 */
export declare const getCurrentSequentialInstance: (config: MultiInstanceConfig) => {
    index: number;
    item: any;
    total: number;
} | null;
/**
 * 18. Checks if sequential execution is complete.
 *
 * @example
 * ```typescript
 * if (isSequentialExecutionComplete(multiInstanceConfig)) {
 *   completeLoop(loopContext, securityContext);
 * }
 * ```
 */
export declare const isSequentialExecutionComplete: (config: MultiInstanceConfig) => boolean;
/**
 * 19. Gets sequential execution progress.
 *
 * @example
 * ```typescript
 * const progress = getSequentialExecutionProgress(multiInstanceConfig);
 * console.log(`Progress: ${progress.percentage}%`);
 * ```
 */
export declare const getSequentialExecutionProgress: (config: MultiInstanceConfig) => {
    completed: number;
    total: number;
    percentage: number;
};
/**
 * 20. Handles sequential instance failure with retry logic.
 *
 * @example
 * ```typescript
 * const retry = await handleSequentialInstanceFailure(
 *   multiInstanceConfig,
 *   loopContext,
 *   error,
 *   3,
 *   securityContext
 * );
 * ```
 */
export declare const handleSequentialInstanceFailure: (config: MultiInstanceConfig, loopContext: LoopContext, error: Error, maxRetries: number, context: SecurityContext) => Promise<boolean>;
/**
 * 21. Executes all instances in parallel multi-instance loop.
 *
 * @example
 * ```typescript
 * const results = await executeAllParallelInstances(
 *   multiInstanceConfig,
 *   loopContext,
 *   async (item) => await processRecord(item),
 *   securityContext
 * );
 * ```
 */
export declare const executeAllParallelInstances: (config: MultiInstanceConfig, loopContext: LoopContext, taskExecutor: (item: any) => Promise<any>, context: SecurityContext) => Promise<LoopIterationState[]>;
/**
 * 22. Executes parallel instances with concurrency limit.
 *
 * @example
 * ```typescript
 * const results = await executeParallelInstancesWithLimit(
 *   multiInstanceConfig,
 *   loopContext,
 *   async (item) => await processItem(item),
 *   5,
 *   securityContext
 * );
 * ```
 */
export declare const executeParallelInstancesWithLimit: (config: MultiInstanceConfig, loopContext: LoopContext, taskExecutor: (item: any) => Promise<any>, concurrencyLimit: number, context: SecurityContext) => Promise<LoopIterationState[]>;
/**
 * 23. Monitors parallel execution progress.
 *
 * @example
 * ```typescript
 * const status = monitorParallelExecution(multiInstanceConfig);
 * console.log(`Active: ${status.active}, Completed: ${status.completed}`);
 * ```
 */
export declare const monitorParallelExecution: (config: MultiInstanceConfig) => {
    active: number;
    completed: number;
    total: number;
    percentage: number;
};
/**
 * 24. Cancels parallel execution of remaining instances.
 *
 * @example
 * ```typescript
 * await cancelParallelExecution(multiInstanceConfig, loopContext, 'User requested cancellation', securityContext);
 * ```
 */
export declare const cancelParallelExecution: (config: MultiInstanceConfig, loopContext: LoopContext, reason: string, context: SecurityContext) => Promise<void>;
/**
 * 25. Aggregates results from parallel execution.
 *
 * @example
 * ```typescript
 * const aggregated = aggregateParallelResults(loopContext.results, (results) => {
 *   return results.reduce((sum, r) => sum + r.value, 0);
 * });
 * ```
 */
export declare const aggregateParallelResults: <T, R>(results: T[], aggregator: (results: T[]) => R) => R;
/**
 * 26. Updates loop variable with audit trail.
 *
 * @example
 * ```typescript
 * updateLoopVariable(loopContext, 'processedCount', 42, securityContext);
 * ```
 */
export declare const updateLoopVariable: (loopContext: LoopContext, variableName: string, value: any, context: SecurityContext) => void;
/**
 * 27. Gets loop variable with type safety.
 *
 * @example
 * ```typescript
 * const counter = getLoopVariable<number>(loopContext, 'counter', 0);
 * ```
 */
export declare const getLoopVariable: <T>(loopContext: LoopContext, variableName: string, defaultValue: T) => T;
/**
 * 28. Deletes loop variable.
 *
 * @example
 * ```typescript
 * deleteLoopVariable(loopContext, 'temporaryCache', securityContext);
 * ```
 */
export declare const deleteLoopVariable: (loopContext: LoopContext, variableName: string, context: SecurityContext) => void;
/**
 * 29. Creates isolated variable scope for nested loops.
 *
 * @example
 * ```typescript
 * const scope = createIsolatedVariableScope(parentLoopContext);
 * // Nested loop operations
 * restoreVariableScope(parentLoopContext, scope);
 * ```
 */
export declare const createIsolatedVariableScope: (loopContext: LoopContext) => Record<string, any>;
/**
 * 30. Restores variable scope after nested loop.
 *
 * @example
 * ```typescript
 * restoreVariableScope(loopContext, savedScope);
 * ```
 */
export declare const restoreVariableScope: (loopContext: LoopContext, savedScope: Record<string, any>) => void;
/**
 * 31. Calculates loop cardinality from collection.
 *
 * @example
 * ```typescript
 * const cardinality = calculateLoopCardinality(patients);
 * ```
 */
export declare const calculateLoopCardinality: (collection: any[]) => number;
/**
 * 32. Calculates cardinality based on expression.
 *
 * @example
 * ```typescript
 * const cardinality = calculateCardinalityFromExpression('patients.length * 2', loopContext);
 * ```
 */
export declare const calculateCardinalityFromExpression: (expression: string, loopContext: LoopContext) => number;
/**
 * 33. Validates cardinality constraints.
 *
 * @example
 * ```typescript
 * const isValid = validateCardinalityConstraints(cardinality, 1, 100);
 * ```
 */
export declare const validateCardinalityConstraints: (cardinality: number, minCardinality: number, maxCardinality: number) => {
    valid: boolean;
    reason?: string;
};
/**
 * 34. Adjusts cardinality dynamically based on conditions.
 *
 * @example
 * ```typescript
 * const adjusted = adjustCardinalityDynamically(
 *   initialCardinality,
 *   loopContext,
 *   (vars) => vars.failureRate > 0.1 ? initialCardinality * 0.5 : initialCardinality
 * );
 * ```
 */
export declare const adjustCardinalityDynamically: (currentCardinality: number, loopContext: LoopContext, adjustmentFunction: (variables: Record<string, any>) => number) => number;
/**
 * 35. Gets remaining iterations count.
 *
 * @example
 * ```typescript
 * const remaining = getRemainingIterations(loopContext, totalCardinality);
 * ```
 */
export declare const getRemainingIterations: (loopContext: LoopContext, totalCardinality: number) => number;
/**
 * 36. Checks if loop completion criteria are met.
 *
 * @example
 * ```typescript
 * const isComplete = checkLoopCompletionCriteria(
 *   loopContext,
 *   'completedCount >= targetCount',
 *   securityContext
 * );
 * ```
 */
export declare const checkLoopCompletionCriteria: (loopContext: LoopContext, completionCondition: string, context: SecurityContext) => boolean;
/**
 * 37. Validates completion conditions before loop start.
 *
 * @example
 * ```typescript
 * const validation = validateCompletionConditions('nrOfCompletedInstances >= nrOfInstances');
 * ```
 */
export declare const validateCompletionConditions: (condition: string) => {
    valid: boolean;
    error?: string;
};
/**
 * 38. Completes loop with final status.
 *
 * @example
 * ```typescript
 * completeLoop(loopContext, securityContext);
 * ```
 */
export declare const completeLoop: (loopContext: LoopContext, context: SecurityContext) => void;
/**
 * 39. Gets loop completion percentage.
 *
 * @example
 * ```typescript
 * const percentage = getLoopCompletionPercentage(loopContext, totalIterations);
 * ```
 */
export declare const getLoopCompletionPercentage: (loopContext: LoopContext, totalIterations: number) => number;
/**
 * 40. Checks if all iterations succeeded.
 *
 * @example
 * ```typescript
 * const allSucceeded = areAllIterationsSuccessful(loopContext);
 * ```
 */
export declare const areAllIterationsSuccessful: (loopContext: LoopContext) => boolean;
/**
 * 41. Terminates loop early with reason.
 *
 * @example
 * ```typescript
 * terminateLoop(loopContext, 'Critical error detected', securityContext);
 * ```
 */
export declare const terminateLoop: (loopContext: LoopContext, reason: string, context: SecurityContext) => void;
/**
 * 42. Checks for break conditions during iteration.
 *
 * @example
 * ```typescript
 * const shouldBreak = checkBreakCondition('errorCount > 5', loopContext);
 * if (shouldBreak) {
 *   terminateLoop(loopContext, 'Too many errors', securityContext);
 * }
 * ```
 */
export declare const checkBreakCondition: (breakCondition: string, loopContext: LoopContext) => boolean;
/**
 * 43. Handles emergency loop termination.
 *
 * @example
 * ```typescript
 * await emergencyTerminateLoop(loopContext, 'System shutdown', securityContext);
 * ```
 */
export declare const emergencyTerminateLoop: (loopContext: LoopContext, reason: string, context: SecurityContext) => Promise<void>;
/**
 * 44. Persists loop state to storage.
 *
 * @example
 * ```typescript
 * const serialized = persistLoopState(loopContext);
 * await database.save('loop_states', serialized);
 * ```
 */
export declare const persistLoopState: (loopContext: LoopContext) => string;
/**
 * 45. Restores loop state from storage.
 *
 * @example
 * ```typescript
 * const serialized = await database.get('loop_states', loopId);
 * const loopContext = restoreLoopState(serialized);
 * ```
 */
export declare const restoreLoopState: (serializedState: string) => LoopContext;
/**
 * 46. Creates nested loop context.
 *
 * @example
 * ```typescript
 * const nestedContext = createNestedLoopContext(parentLoopContext, nestedConfig, securityContext);
 * ```
 */
export declare const createNestedLoopContext: (parentContext: LoopContext, nestedConfig: NestedLoopConfig, config: LoopConfig, context: SecurityContext) => LoopContext;
/**
 * 47. Merges nested loop results into parent.
 *
 * @example
 * ```typescript
 * mergeNestedLoopResults(parentContext, nestedContext, 'nestedResults');
 * ```
 */
export declare const mergeNestedLoopResults: (parentContext: LoopContext, nestedContext: LoopContext, resultVariableName: string) => void;
/**
 * 48. Calculates loop execution metrics.
 *
 * @example
 * ```typescript
 * const metrics = calculateLoopMetrics(loopContext);
 * console.log(`Average iteration time: ${metrics.averageIterationTimeMs}ms`);
 * ```
 */
export declare const calculateLoopMetrics: (loopContext: LoopContext) => LoopMetrics;
//# sourceMappingURL=workflow-loop-iteration.d.ts.map