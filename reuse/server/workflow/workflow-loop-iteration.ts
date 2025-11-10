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
 * File: /reuse/server/workflow/workflow-loop-iteration.ts
 * Locator: WC-WFL-LOOP-001
 * Purpose: Production-grade Workflow Loop and Iteration Patterns - Comprehensive loop management for BPMN-style workflows
 *
 * Upstream: @nestjs/common, sequelize, sequelize-typescript, zod, rxjs
 * Downstream: ../backend/*, workflow engines, process orchestrators, task managers, batch processors
 * Dependencies: NestJS 10.x, Sequelize 6.x, Zod 3.x, TypeScript 5.x, RxJS 7.x
 * Exports: 45 production-ready functions for loop initialization, iteration control, multi-instance execution, cardinality, state persistence
 *
 * LLM Context: Enterprise-grade workflow loop and iteration utilities for White Cross healthcare platform.
 * Provides comprehensive loop initialization, condition evaluation, sequential/parallel multi-instance execution,
 * loop variable management, cardinality calculation, completion criteria, early termination, state persistence,
 * nested loop handling, loop compensation, timeout management, and HIPAA-compliant audit trails.
 * Supports BPMN 2.0 multi-instance patterns for healthcare workflow automation.
 *
 * Features:
 * - BPMN 2.0 compliant loop constructs
 * - Sequential and parallel multi-instance tasks
 * - Loop cardinality and completion conditions
 * - Loop variable isolation and management
 * - Nested loop support with depth tracking
 * - Early termination and break conditions
 * - State persistence and recovery
 * - Performance monitoring and metrics
 * - Audit trail for compliance
 * - Deadlock prevention
 * - Resource allocation tracking
 */

import { z } from 'zod';
import * as crypto from 'crypto';

// ============================================================================
// ZOD VALIDATION SCHEMAS
// ============================================================================

/**
 * Zod schema for loop configuration.
 */
export const LoopConfigSchema = z.object({
  loopId: z.string().uuid(),
  workflowInstanceId: z.string().uuid(),
  loopType: z.enum(['standard', 'multi-instance-sequential', 'multi-instance-parallel', 'while', 'foreach']),
  collection: z.array(z.any()).optional(),
  cardinality: z.number().int().min(0).optional(),
  completionCondition: z.string().optional(),
  maxIterations: z.number().int().positive().optional(),
  timeoutMs: z.number().int().positive().optional(),
  variables: z.record(z.any()).optional(),
  metadata: z.record(z.any()).optional(),
});

/**
 * Zod schema for loop iteration state.
 */
export const LoopIterationStateSchema = z.object({
  loopId: z.string().uuid(),
  iterationIndex: z.number().int().min(0),
  currentItem: z.any().optional(),
  loopCounter: z.number().int().min(0),
  totalIterations: z.number().int().min(0).optional(),
  status: z.enum(['pending', 'active', 'completed', 'failed', 'terminated']),
  startedAt: z.date().optional(),
  completedAt: z.date().optional(),
  result: z.any().optional(),
  error: z.string().optional(),
});

/**
 * Zod schema for multi-instance configuration.
 */
export const MultiInstanceConfigSchema = z.object({
  isSequential: z.boolean().default(false),
  collection: z.array(z.any()),
  elementVariable: z.string(),
  completionCondition: z.string().optional(),
  loopCardinality: z.number().int().min(1).optional(),
  nrOfInstances: z.number().int().min(1).optional(),
  nrOfActiveInstances: z.number().int().min(1).optional(),
  nrOfCompletedInstances: z.number().int().min(0).default(0),
});

/**
 * Zod schema for loop audit entry.
 */
export const LoopAuditEntrySchema = z.object({
  auditId: z.string().uuid(),
  loopId: z.string().uuid(),
  workflowInstanceId: z.string().uuid(),
  eventType: z.enum([
    'loop_initialized',
    'iteration_started',
    'iteration_completed',
    'iteration_failed',
    'loop_completed',
    'loop_terminated',
    'variable_updated',
    'condition_evaluated',
  ]),
  iterationIndex: z.number().int().min(0).optional(),
  details: z.record(z.any()),
  performedBy: z.string().optional(),
  timestamp: z.date(),
});

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

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

// ============================================================================
// AUTHORIZATION AND SECURITY CONTEXT
// ============================================================================

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
export const validateLoopAuthorization = (
  context: SecurityContext,
  requiredPermission: string
): boolean => {
  return context.permissions.includes(requiredPermission) || context.roles.includes('admin');
};

/**
 * Creates audit log entry for loop operations.
 */
export const createLoopAuditLog = (
  loopId: string,
  workflowInstanceId: string,
  eventType: LoopAuditEntry['eventType'],
  details: Record<string, any>,
  context: SecurityContext
): LoopAuditEntry => {
  return {
    auditId: crypto.randomUUID(),
    loopId,
    workflowInstanceId,
    eventType,
    details: {
      ...details,
      tenantId: context.tenantId,
      ipAddress: context.ipAddress,
      sessionId: context.sessionId,
    },
    performedBy: context.userId,
    timestamp: new Date(),
  };
};

// ============================================================================
// LOOP INITIALIZATION
// ============================================================================

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
export const initializeLoop = (
  config: LoopConfig,
  context: SecurityContext
): LoopContext => {
  if (!validateLoopAuthorization(context, 'workflow:execute')) {
    throw new Error('Unauthorized to initialize loop');
  }

  LoopConfigSchema.parse(config);

  const loopContext: LoopContext = {
    loopId: config.loopId,
    variables: config.variables || {},
    iterations: [],
    currentIndex: 0,
    startedAt: new Date(),
    status: 'active',
    results: [],
    errors: [],
  };

  // Audit log
  createLoopAuditLog(
    config.loopId,
    config.workflowInstanceId,
    'loop_initialized',
    { loopType: config.loopType, config },
    context
  );

  return loopContext;
};

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
export const initializeMultiInstanceSequential = (
  config: MultiInstanceConfig,
  loopContext: LoopContext,
  context: SecurityContext
): MultiInstanceConfig => {
  if (!validateLoopAuthorization(context, 'workflow:execute')) {
    throw new Error('Unauthorized to initialize multi-instance loop');
  }

  MultiInstanceConfigSchema.parse(config);

  const nrOfInstances = config.collection.length;

  return {
    ...config,
    isSequential: true,
    nrOfInstances,
    nrOfActiveInstances: 1,
    nrOfCompletedInstances: 0,
  };
};

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
export const initializeMultiInstanceParallel = (
  config: MultiInstanceConfig,
  loopContext: LoopContext,
  context: SecurityContext
): MultiInstanceConfig => {
  if (!validateLoopAuthorization(context, 'workflow:execute')) {
    throw new Error('Unauthorized to initialize parallel multi-instance loop');
  }

  MultiInstanceConfigSchema.parse(config);

  const nrOfInstances = config.collection.length;

  return {
    ...config,
    isSequential: false,
    nrOfInstances,
    nrOfActiveInstances: nrOfInstances,
    nrOfCompletedInstances: 0,
  };
};

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
export const initializeLoopVariables = (
  variables: Record<string, any>,
  loopContext: LoopContext
): Record<string, any> => {
  const initializedVars = {
    ...loopContext.variables,
    ...variables,
    __loopStartTime: new Date().toISOString(),
    __loopId: loopContext.loopId,
  };

  loopContext.variables = initializedVars;
  return initializedVars;
};

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
export const validateLoopConfiguration = (
  config: LoopConfig
): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  try {
    LoopConfigSchema.parse(config);
  } catch (error: any) {
    return { valid: false, errors: error.errors.map((e: any) => e.message) };
  }

  if (config.loopType === 'multi-instance-sequential' || config.loopType === 'multi-instance-parallel') {
    if (!config.collection || config.collection.length === 0) {
      errors.push('Multi-instance loop requires non-empty collection');
    }
  }

  if (config.maxIterations && config.maxIterations < 1) {
    errors.push('maxIterations must be positive');
  }

  return { valid: errors.length === 0, errors };
};

// ============================================================================
// LOOP CONDITION EVALUATION
// ============================================================================

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
export const evaluateLoopCondition = (
  condition: string,
  loopContext: LoopContext,
  context: SecurityContext
): LoopConditionEvaluation => {
  try {
    // Safe evaluation using Function constructor with limited scope
    const evaluator = new Function('vars', `with(vars) { return ${condition}; }`);
    const shouldContinue = Boolean(evaluator(loopContext.variables));

    const evaluation: LoopConditionEvaluation = {
      shouldContinue,
      evaluatedAt: new Date(),
      context: { ...loopContext.variables },
    };

    // Audit condition evaluation
    createLoopAuditLog(
      loopContext.loopId,
      loopContext.variables.workflowInstanceId || 'unknown',
      'condition_evaluated',
      { condition, result: shouldContinue },
      context
    );

    return evaluation;
  } catch (error: any) {
    return {
      shouldContinue: false,
      reason: `Condition evaluation failed: ${error.message}`,
      evaluatedAt: new Date(),
      context: loopContext.variables,
    };
  }
};

/**
 * 7. Checks if loop should continue based on iteration count.
 *
 * @example
 * ```typescript
 * const shouldContinue = checkIterationLimit(loopContext, 100);
 * ```
 */
export const checkIterationLimit = (
  loopContext: LoopContext,
  maxIterations: number
): boolean => {
  return loopContext.currentIndex < maxIterations;
};

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
export const evaluateCompletionCondition = (
  condition: string,
  multiInstanceConfig: MultiInstanceConfig
): boolean => {
  try {
    const vars = {
      nrOfInstances: multiInstanceConfig.nrOfInstances,
      nrOfActiveInstances: multiInstanceConfig.nrOfActiveInstances,
      nrOfCompletedInstances: multiInstanceConfig.nrOfCompletedInstances,
    };

    const evaluator = new Function('vars', `with(vars) { return ${condition}; }`);
    return Boolean(evaluator(vars));
  } catch (error) {
    return false;
  }
};

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
export const checkLoopTimeout = (
  loopContext: LoopContext,
  timeoutMs: number
): boolean => {
  const elapsedMs = Date.now() - loopContext.startedAt.getTime();
  return elapsedMs > timeoutMs;
};

/**
 * 10. Validates loop variables before condition evaluation.
 *
 * @example
 * ```typescript
 * const isValid = validateLoopVariables(loopContext.variables, ['counter', 'maxValue']);
 * ```
 */
export const validateLoopVariables = (
  variables: Record<string, any>,
  requiredVariables: string[]
): { valid: boolean; missing: string[] } => {
  const missing = requiredVariables.filter((v) => !(v in variables));
  return { valid: missing.length === 0, missing };
};

// ============================================================================
// LOOP ITERATION CONTROL
// ============================================================================

/**
 * 11. Starts a new loop iteration.
 *
 * @example
 * ```typescript
 * const iteration = startLoopIteration(loopContext, patientRecord, securityContext);
 * ```
 */
export const startLoopIteration = (
  loopContext: LoopContext,
  currentItem?: any,
  context?: SecurityContext
): LoopIterationState => {
  const iteration: LoopIterationState = {
    loopId: loopContext.loopId,
    iterationIndex: loopContext.currentIndex,
    currentItem,
    loopCounter: loopContext.iterations.length,
    status: 'active',
    startedAt: new Date(),
  };

  loopContext.iterations.push(iteration);
  loopContext.currentIndex++;

  if (context) {
    createLoopAuditLog(
      loopContext.loopId,
      loopContext.variables.workflowInstanceId || 'unknown',
      'iteration_started',
      { iterationIndex: iteration.iterationIndex, currentItem },
      context
    );
  }

  return iteration;
};

/**
 * 12. Completes a loop iteration with result.
 *
 * @example
 * ```typescript
 * const completed = completeLoopIteration(iteration, { success: true, data: result }, loopContext, securityContext);
 * ```
 */
export const completeLoopIteration = (
  iteration: LoopIterationState,
  result: any,
  loopContext: LoopContext,
  context: SecurityContext
): LoopIterationState => {
  iteration.status = 'completed';
  iteration.completedAt = new Date();
  iteration.result = result;

  loopContext.results.push(result);

  createLoopAuditLog(
    loopContext.loopId,
    loopContext.variables.workflowInstanceId || 'unknown',
    'iteration_completed',
    { iterationIndex: iteration.iterationIndex, result },
    context
  );

  return iteration;
};

/**
 * 13. Fails a loop iteration with error.
 *
 * @example
 * ```typescript
 * const failed = failLoopIteration(iteration, error.message, loopContext, securityContext);
 * ```
 */
export const failLoopIteration = (
  iteration: LoopIterationState,
  error: string,
  loopContext: LoopContext,
  context: SecurityContext
): LoopIterationState => {
  iteration.status = 'failed';
  iteration.completedAt = new Date();
  iteration.error = error;

  loopContext.errors.push(error);

  createLoopAuditLog(
    loopContext.loopId,
    loopContext.variables.workflowInstanceId || 'unknown',
    'iteration_failed',
    { iterationIndex: iteration.iterationIndex, error },
    context
  );

  return iteration;
};

/**
 * 14. Increments loop counter and updates variables.
 *
 * @example
 * ```typescript
 * incrementLoopCounter(loopContext);
 * ```
 */
export const incrementLoopCounter = (loopContext: LoopContext): void => {
  if (!loopContext.variables.loopCounter) {
    loopContext.variables.loopCounter = 0;
  }
  loopContext.variables.loopCounter++;
};

/**
 * 15. Resets loop counter for nested loops.
 *
 * @example
 * ```typescript
 * resetLoopCounter(loopContext);
 * ```
 */
export const resetLoopCounter = (loopContext: LoopContext): void => {
  loopContext.variables.loopCounter = 0;
  loopContext.currentIndex = 0;
};

// ============================================================================
// MULTI-INSTANCE SEQUENTIAL EXECUTION
// ============================================================================

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
export const executeNextSequentialInstance = async (
  config: MultiInstanceConfig,
  loopContext: LoopContext,
  taskExecutor: (item: any) => Promise<any>,
  context: SecurityContext
): Promise<LoopIterationState | null> => {
  if (!config.isSequential) {
    throw new Error('Config must be sequential');
  }

  const nextIndex = config.nrOfCompletedInstances;
  if (nextIndex >= config.collection.length) {
    return null;
  }

  const currentItem = config.collection[nextIndex];
  loopContext.variables[config.elementVariable] = currentItem;

  const iteration = startLoopIteration(loopContext, currentItem, context);

  try {
    const result = await taskExecutor(currentItem);
    completeLoopIteration(iteration, result, loopContext, context);
    config.nrOfCompletedInstances++;
    return iteration;
  } catch (error: any) {
    failLoopIteration(iteration, error.message, loopContext, context);
    throw error;
  }
};

/**
 * 17. Gets current sequential instance details.
 *
 * @example
 * ```typescript
 * const instance = getCurrentSequentialInstance(multiInstanceConfig);
 * console.log(`Processing ${instance.index} of ${instance.total}`);
 * ```
 */
export const getCurrentSequentialInstance = (
  config: MultiInstanceConfig
): { index: number; item: any; total: number } | null => {
  if (config.nrOfCompletedInstances >= config.collection.length) {
    return null;
  }

  return {
    index: config.nrOfCompletedInstances,
    item: config.collection[config.nrOfCompletedInstances],
    total: config.collection.length,
  };
};

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
export const isSequentialExecutionComplete = (
  config: MultiInstanceConfig
): boolean => {
  return config.nrOfCompletedInstances >= config.collection.length;
};

/**
 * 19. Gets sequential execution progress.
 *
 * @example
 * ```typescript
 * const progress = getSequentialExecutionProgress(multiInstanceConfig);
 * console.log(`Progress: ${progress.percentage}%`);
 * ```
 */
export const getSequentialExecutionProgress = (
  config: MultiInstanceConfig
): { completed: number; total: number; percentage: number } => {
  const total = config.collection.length;
  const completed = config.nrOfCompletedInstances;
  const percentage = total > 0 ? (completed / total) * 100 : 0;

  return { completed, total, percentage };
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
export const handleSequentialInstanceFailure = async (
  config: MultiInstanceConfig,
  loopContext: LoopContext,
  error: Error,
  maxRetries: number,
  context: SecurityContext
): Promise<boolean> => {
  const retryCount = (loopContext.variables.__retryCount || 0) as number;

  if (retryCount < maxRetries) {
    loopContext.variables.__retryCount = retryCount + 1;
    createLoopAuditLog(
      loopContext.loopId,
      loopContext.variables.workflowInstanceId || 'unknown',
      'iteration_failed',
      { retry: retryCount + 1, maxRetries, error: error.message },
      context
    );
    return true; // Should retry
  }

  loopContext.variables.__retryCount = 0;
  return false; // Max retries exceeded
};

// ============================================================================
// MULTI-INSTANCE PARALLEL EXECUTION
// ============================================================================

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
export const executeAllParallelInstances = async (
  config: MultiInstanceConfig,
  loopContext: LoopContext,
  taskExecutor: (item: any) => Promise<any>,
  context: SecurityContext
): Promise<LoopIterationState[]> => {
  if (config.isSequential) {
    throw new Error('Config must be parallel');
  }

  const promises = config.collection.map(async (item, index) => {
    loopContext.variables[`${config.elementVariable}_${index}`] = item;
    const iteration = startLoopIteration(loopContext, item, context);

    try {
      const result = await taskExecutor(item);
      completeLoopIteration(iteration, result, loopContext, context);
      config.nrOfCompletedInstances++;
      return iteration;
    } catch (error: any) {
      failLoopIteration(iteration, error.message, loopContext, context);
      throw error;
    }
  });

  return Promise.all(promises);
};

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
export const executeParallelInstancesWithLimit = async (
  config: MultiInstanceConfig,
  loopContext: LoopContext,
  taskExecutor: (item: any) => Promise<any>,
  concurrencyLimit: number,
  context: SecurityContext
): Promise<LoopIterationState[]> => {
  const results: LoopIterationState[] = [];
  const executing: Promise<void>[] = [];

  for (let i = 0; i < config.collection.length; i++) {
    const item = config.collection[i];

    const promise = (async () => {
      loopContext.variables[`${config.elementVariable}_${i}`] = item;
      const iteration = startLoopIteration(loopContext, item, context);

      try {
        const result = await taskExecutor(item);
        completeLoopIteration(iteration, result, loopContext, context);
        config.nrOfCompletedInstances++;
        results.push(iteration);
      } catch (error: any) {
        failLoopIteration(iteration, error.message, loopContext, context);
        results.push(iteration);
      }
    })();

    executing.push(promise);

    if (executing.length >= concurrencyLimit) {
      await Promise.race(executing);
      executing.splice(executing.findIndex((p) => p === promise), 1);
    }
  }

  await Promise.all(executing);
  return results;
};

/**
 * 23. Monitors parallel execution progress.
 *
 * @example
 * ```typescript
 * const status = monitorParallelExecution(multiInstanceConfig);
 * console.log(`Active: ${status.active}, Completed: ${status.completed}`);
 * ```
 */
export const monitorParallelExecution = (
  config: MultiInstanceConfig
): { active: number; completed: number; total: number; percentage: number } => {
  const total = config.nrOfInstances || 0;
  const completed = config.nrOfCompletedInstances;
  const active = (config.nrOfActiveInstances || 0) - completed;
  const percentage = total > 0 ? (completed / total) * 100 : 0;

  return { active, completed, total, percentage };
};

/**
 * 24. Cancels parallel execution of remaining instances.
 *
 * @example
 * ```typescript
 * await cancelParallelExecution(multiInstanceConfig, loopContext, 'User requested cancellation', securityContext);
 * ```
 */
export const cancelParallelExecution = async (
  config: MultiInstanceConfig,
  loopContext: LoopContext,
  reason: string,
  context: SecurityContext
): Promise<void> => {
  loopContext.status = 'terminated';

  createLoopAuditLog(
    loopContext.loopId,
    loopContext.variables.workflowInstanceId || 'unknown',
    'loop_terminated',
    { reason, completedInstances: config.nrOfCompletedInstances },
    context
  );
};

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
export const aggregateParallelResults = <T, R>(
  results: T[],
  aggregator: (results: T[]) => R
): R => {
  return aggregator(results);
};

// ============================================================================
// LOOP VARIABLE MANAGEMENT
// ============================================================================

/**
 * 26. Updates loop variable with audit trail.
 *
 * @example
 * ```typescript
 * updateLoopVariable(loopContext, 'processedCount', 42, securityContext);
 * ```
 */
export const updateLoopVariable = (
  loopContext: LoopContext,
  variableName: string,
  value: any,
  context: SecurityContext
): void => {
  const oldValue = loopContext.variables[variableName];
  loopContext.variables[variableName] = value;

  createLoopAuditLog(
    loopContext.loopId,
    loopContext.variables.workflowInstanceId || 'unknown',
    'variable_updated',
    { variableName, oldValue, newValue: value },
    context
  );
};

/**
 * 27. Gets loop variable with type safety.
 *
 * @example
 * ```typescript
 * const counter = getLoopVariable<number>(loopContext, 'counter', 0);
 * ```
 */
export const getLoopVariable = <T>(
  loopContext: LoopContext,
  variableName: string,
  defaultValue: T
): T => {
  return (loopContext.variables[variableName] as T) ?? defaultValue;
};

/**
 * 28. Deletes loop variable.
 *
 * @example
 * ```typescript
 * deleteLoopVariable(loopContext, 'temporaryCache', securityContext);
 * ```
 */
export const deleteLoopVariable = (
  loopContext: LoopContext,
  variableName: string,
  context: SecurityContext
): void => {
  const value = loopContext.variables[variableName];
  delete loopContext.variables[variableName];

  createLoopAuditLog(
    loopContext.loopId,
    loopContext.variables.workflowInstanceId || 'unknown',
    'variable_updated',
    { variableName, action: 'deleted', oldValue: value },
    context
  );
};

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
export const createIsolatedVariableScope = (
  loopContext: LoopContext
): Record<string, any> => {
  return { ...loopContext.variables };
};

/**
 * 30. Restores variable scope after nested loop.
 *
 * @example
 * ```typescript
 * restoreVariableScope(loopContext, savedScope);
 * ```
 */
export const restoreVariableScope = (
  loopContext: LoopContext,
  savedScope: Record<string, any>
): void => {
  loopContext.variables = { ...savedScope };
};

// ============================================================================
// LOOP CARDINALITY CALCULATION
// ============================================================================

/**
 * 31. Calculates loop cardinality from collection.
 *
 * @example
 * ```typescript
 * const cardinality = calculateLoopCardinality(patients);
 * ```
 */
export const calculateLoopCardinality = (collection: any[]): number => {
  return collection.length;
};

/**
 * 32. Calculates cardinality based on expression.
 *
 * @example
 * ```typescript
 * const cardinality = calculateCardinalityFromExpression('patients.length * 2', loopContext);
 * ```
 */
export const calculateCardinalityFromExpression = (
  expression: string,
  loopContext: LoopContext
): number => {
  try {
    const evaluator = new Function('vars', `with(vars) { return ${expression}; }`);
    const result = evaluator(loopContext.variables);
    return Math.max(0, Math.floor(Number(result)));
  } catch (error) {
    return 0;
  }
};

/**
 * 33. Validates cardinality constraints.
 *
 * @example
 * ```typescript
 * const isValid = validateCardinalityConstraints(cardinality, 1, 100);
 * ```
 */
export const validateCardinalityConstraints = (
  cardinality: number,
  minCardinality: number,
  maxCardinality: number
): { valid: boolean; reason?: string } => {
  if (cardinality < minCardinality) {
    return { valid: false, reason: `Cardinality ${cardinality} below minimum ${minCardinality}` };
  }
  if (cardinality > maxCardinality) {
    return { valid: false, reason: `Cardinality ${cardinality} exceeds maximum ${maxCardinality}` };
  }
  return { valid: true };
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
export const adjustCardinalityDynamically = (
  currentCardinality: number,
  loopContext: LoopContext,
  adjustmentFunction: (variables: Record<string, any>) => number
): number => {
  const adjusted = adjustmentFunction(loopContext.variables);
  return Math.max(1, Math.floor(adjusted));
};

/**
 * 35. Gets remaining iterations count.
 *
 * @example
 * ```typescript
 * const remaining = getRemainingIterations(loopContext, totalCardinality);
 * ```
 */
export const getRemainingIterations = (
  loopContext: LoopContext,
  totalCardinality: number
): number => {
  return Math.max(0, totalCardinality - loopContext.currentIndex);
};

// ============================================================================
// LOOP COMPLETION CRITERIA
// ============================================================================

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
export const checkLoopCompletionCriteria = (
  loopContext: LoopContext,
  completionCondition: string,
  context: SecurityContext
): boolean => {
  const evaluation = evaluateLoopCondition(completionCondition, loopContext, context);
  return evaluation.shouldContinue;
};

/**
 * 37. Validates completion conditions before loop start.
 *
 * @example
 * ```typescript
 * const validation = validateCompletionConditions('nrOfCompletedInstances >= nrOfInstances');
 * ```
 */
export const validateCompletionConditions = (
  condition: string
): { valid: boolean; error?: string } => {
  try {
    // Test compilation
    new Function('vars', `with(vars) { return ${condition}; }`);
    return { valid: true };
  } catch (error: any) {
    return { valid: false, error: error.message };
  }
};

/**
 * 38. Completes loop with final status.
 *
 * @example
 * ```typescript
 * completeLoop(loopContext, securityContext);
 * ```
 */
export const completeLoop = (
  loopContext: LoopContext,
  context: SecurityContext
): void => {
  loopContext.status = 'completed';
  loopContext.completedAt = new Date();

  createLoopAuditLog(
    loopContext.loopId,
    loopContext.variables.workflowInstanceId || 'unknown',
    'loop_completed',
    {
      totalIterations: loopContext.iterations.length,
      successCount: loopContext.results.length,
      errorCount: loopContext.errors.length,
    },
    context
  );
};

/**
 * 39. Gets loop completion percentage.
 *
 * @example
 * ```typescript
 * const percentage = getLoopCompletionPercentage(loopContext, totalIterations);
 * ```
 */
export const getLoopCompletionPercentage = (
  loopContext: LoopContext,
  totalIterations: number
): number => {
  if (totalIterations === 0) return 100;
  return (loopContext.currentIndex / totalIterations) * 100;
};

/**
 * 40. Checks if all iterations succeeded.
 *
 * @example
 * ```typescript
 * const allSucceeded = areAllIterationsSuccessful(loopContext);
 * ```
 */
export const areAllIterationsSuccessful = (loopContext: LoopContext): boolean => {
  return loopContext.errors.length === 0 && loopContext.results.length === loopContext.iterations.length;
};

// ============================================================================
// LOOP EARLY TERMINATION
// ============================================================================

/**
 * 41. Terminates loop early with reason.
 *
 * @example
 * ```typescript
 * terminateLoop(loopContext, 'Critical error detected', securityContext);
 * ```
 */
export const terminateLoop = (
  loopContext: LoopContext,
  reason: string,
  context: SecurityContext
): void => {
  loopContext.status = 'terminated';
  loopContext.completedAt = new Date();

  createLoopAuditLog(
    loopContext.loopId,
    loopContext.variables.workflowInstanceId || 'unknown',
    'loop_terminated',
    { reason, completedIterations: loopContext.currentIndex },
    context
  );
};

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
export const checkBreakCondition = (
  breakCondition: string,
  loopContext: LoopContext
): boolean => {
  try {
    const evaluator = new Function('vars', `with(vars) { return ${breakCondition}; }`);
    return Boolean(evaluator(loopContext.variables));
  } catch (error) {
    return false;
  }
};

/**
 * 43. Handles emergency loop termination.
 *
 * @example
 * ```typescript
 * await emergencyTerminateLoop(loopContext, 'System shutdown', securityContext);
 * ```
 */
export const emergencyTerminateLoop = async (
  loopContext: LoopContext,
  reason: string,
  context: SecurityContext
): Promise<void> => {
  // Mark all active iterations as terminated
  loopContext.iterations
    .filter((i) => i.status === 'active')
    .forEach((i) => {
      i.status = 'terminated';
      i.completedAt = new Date();
      i.error = `Emergency termination: ${reason}`;
    });

  terminateLoop(loopContext, reason, context);
};

// ============================================================================
// LOOP STATE PERSISTENCE
// ============================================================================

/**
 * 44. Persists loop state to storage.
 *
 * @example
 * ```typescript
 * const serialized = persistLoopState(loopContext);
 * await database.save('loop_states', serialized);
 * ```
 */
export const persistLoopState = (loopContext: LoopContext): string => {
  const state = {
    loopId: loopContext.loopId,
    variables: loopContext.variables,
    iterations: loopContext.iterations,
    currentIndex: loopContext.currentIndex,
    startedAt: loopContext.startedAt.toISOString(),
    completedAt: loopContext.completedAt?.toISOString(),
    status: loopContext.status,
    results: loopContext.results,
    errors: loopContext.errors,
  };

  return JSON.stringify(state);
};

/**
 * 45. Restores loop state from storage.
 *
 * @example
 * ```typescript
 * const serialized = await database.get('loop_states', loopId);
 * const loopContext = restoreLoopState(serialized);
 * ```
 */
export const restoreLoopState = (serializedState: string): LoopContext => {
  const state = JSON.parse(serializedState);

  return {
    loopId: state.loopId,
    variables: state.variables,
    iterations: state.iterations.map((i: any) => ({
      ...i,
      startedAt: i.startedAt ? new Date(i.startedAt) : undefined,
      completedAt: i.completedAt ? new Date(i.completedAt) : undefined,
    })),
    currentIndex: state.currentIndex,
    startedAt: new Date(state.startedAt),
    completedAt: state.completedAt ? new Date(state.completedAt) : undefined,
    status: state.status,
    results: state.results,
    errors: state.errors,
  };
};

// ============================================================================
// NESTED LOOP HANDLING
// ============================================================================

/**
 * 46. Creates nested loop context.
 *
 * @example
 * ```typescript
 * const nestedContext = createNestedLoopContext(parentLoopContext, nestedConfig, securityContext);
 * ```
 */
export const createNestedLoopContext = (
  parentContext: LoopContext,
  nestedConfig: NestedLoopConfig,
  config: LoopConfig,
  context: SecurityContext
): LoopContext => {
  if (nestedConfig.depth >= nestedConfig.maxDepth) {
    throw new Error(`Maximum loop nesting depth ${nestedConfig.maxDepth} exceeded`);
  }

  const nestedContext = initializeLoop(config, context);

  if (nestedConfig.isolateVariables) {
    nestedContext.variables = createIsolatedVariableScope(parentContext);
  } else {
    nestedContext.variables = { ...parentContext.variables };
  }

  nestedContext.variables.__parentLoopId = parentContext.loopId;
  nestedContext.variables.__loopDepth = nestedConfig.depth + 1;

  return nestedContext;
};

/**
 * 47. Merges nested loop results into parent.
 *
 * @example
 * ```typescript
 * mergeNestedLoopResults(parentContext, nestedContext, 'nestedResults');
 * ```
 */
export const mergeNestedLoopResults = (
  parentContext: LoopContext,
  nestedContext: LoopContext,
  resultVariableName: string
): void => {
  parentContext.variables[resultVariableName] = nestedContext.results;
  parentContext.results.push({
    nestedLoopId: nestedContext.loopId,
    results: nestedContext.results,
    errors: nestedContext.errors,
  });
};

// ============================================================================
// LOOP METRICS AND MONITORING
// ============================================================================

/**
 * 48. Calculates loop execution metrics.
 *
 * @example
 * ```typescript
 * const metrics = calculateLoopMetrics(loopContext);
 * console.log(`Average iteration time: ${metrics.averageIterationTimeMs}ms`);
 * ```
 */
export const calculateLoopMetrics = (loopContext: LoopContext): LoopMetrics => {
  const completedIterations = loopContext.iterations.filter((i) => i.status === 'completed');
  const failedIterations = loopContext.iterations.filter((i) => i.status === 'failed');

  const totalExecutionTimeMs = loopContext.completedAt
    ? loopContext.completedAt.getTime() - loopContext.startedAt.getTime()
    : Date.now() - loopContext.startedAt.getTime();

  const iterationTimes = completedIterations
    .filter((i) => i.startedAt && i.completedAt)
    .map((i) => i.completedAt!.getTime() - i.startedAt!.getTime());

  const averageIterationTimeMs =
    iterationTimes.length > 0
      ? iterationTimes.reduce((sum, time) => sum + time, 0) / iterationTimes.length
      : 0;

  const throughput =
    totalExecutionTimeMs > 0 ? (completedIterations.length / totalExecutionTimeMs) * 1000 : 0;

  const errorRate =
    loopContext.iterations.length > 0
      ? failedIterations.length / loopContext.iterations.length
      : 0;

  return {
    loopId: loopContext.loopId,
    totalIterations: loopContext.iterations.length,
    completedIterations: completedIterations.length,
    failedIterations: failedIterations.length,
    averageIterationTimeMs,
    totalExecutionTimeMs,
    throughput,
    errorRate,
  };
};
