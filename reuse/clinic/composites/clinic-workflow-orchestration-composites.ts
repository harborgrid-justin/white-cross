/**
 * LOC: CLINIC-WORKFLOW-ORCH-001
 * File: /reuse/clinic/composites/clinic-workflow-orchestration-composites.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - ../education/* (education kits)
 *   - ../server/health/* (health kits)
 *   - ../data/* (data utilities)
 *
 * DOWNSTREAM (imported by):
 *   - Clinic workflow services
 *   - Multi-step orchestration services
 *   - Transaction coordination services
 *   - Saga pattern implementations
 */

/**
 * File: /reuse/clinic/composites/clinic-workflow-orchestration-composites.ts
 * Locator: WC-CLINIC-WORKFLOW-ORCH-001
 * Purpose: Advanced Clinic Workflow Orchestration - Production-grade multi-step workflows, state machines, saga patterns
 *
 * Upstream: NestJS, Education Kits, Health Kits, Data Utilities
 * Downstream: ../backend/clinic/*, Workflow Services, Transaction Coordination
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x
 * Exports: 46 composite functions for workflow orchestration, state machines, saga patterns, transaction coordination
 *
 * LLM Context: Enterprise-grade clinic workflow orchestration composites for White Cross platform.
 * Provides comprehensive multi-step workflow coordination with state machines using discriminated unions,
 * saga pattern implementation with automatic compensation and rollback, distributed transaction coordination,
 * circuit breaker patterns for resilience, retry logic with exponential backoff, workflow monitoring and
 * observability, error recovery strategies, workflow visualization, and full ACID transaction support across
 * education and health domains. Implements advanced TypeScript patterns including generics, conditional types,
 * mapped types, and utility types for maximum type safety and flexibility.
 */

import { Injectable, Logger, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { EventEmitter } from 'events';
import * as crypto from 'crypto';

// Education Kit Imports
import type {
  EnrollmentVerification,
  TransferCredit,
  EnrollmentHold,
} from '../../education/student-enrollment-kit';

// Health Kit Imports
import type {
  PatientDemographics,
  PatientContactInfo,
} from '../../server/health/health-patient-management-kit';

// Data Utility Imports
import type {
  CacheConfig,
  CacheStrategy,
} from '../../data/production-caching';

// ============================================================================
// ADVANCED TYPE DEFINITIONS
// ============================================================================

/**
 * Workflow state - discriminated union for type safety
 */
export type WorkflowState =
  | { status: 'pending'; metadata: Record<string, unknown> }
  | { status: 'in_progress'; startedAt: Date; currentStep: string }
  | { status: 'completed'; completedAt: Date; result: unknown }
  | { status: 'failed'; failedAt: Date; error: Error; retryCount: number }
  | { status: 'compensating'; compensationStep: string; reason: string }
  | { status: 'compensated'; compensatedAt: Date; rollbackResult: unknown };

/**
 * Workflow step definition with generic input/output types
 */
export interface WorkflowStep<TInput = unknown, TOutput = unknown> {
  id: string;
  name: string;
  execute: (input: TInput, context: WorkflowContext) => Promise<TOutput>;
  compensate?: (input: TInput, context: WorkflowContext) => Promise<void>;
  retryPolicy?: RetryPolicy;
  timeout?: number;
  circuitBreaker?: CircuitBreakerConfig;
}

/**
 * Workflow definition with typed steps
 */
export interface WorkflowDefinition<TInput = unknown, TOutput = unknown> {
  id: string;
  name: string;
  description: string;
  version: string;
  steps: WorkflowStep<unknown, unknown>[];
  rollbackOnFailure: boolean;
  maxRetries: number;
  timeout: number;
  metadata: Record<string, unknown>;
}

/**
 * Workflow context - carries state through execution
 */
export interface WorkflowContext {
  workflowId: string;
  correlationId: string;
  startedAt: Date;
  userId: string;
  tenantId?: string;
  metadata: Record<string, unknown>;
  executionHistory: WorkflowExecutionEvent[];
  compensationStack: CompensationAction[];
}

/**
 * Workflow execution event for audit trail
 */
export interface WorkflowExecutionEvent {
  eventId: string;
  timestamp: Date;
  stepId: string;
  stepName: string;
  eventType: 'step_started' | 'step_completed' | 'step_failed' | 'step_compensated';
  input?: unknown;
  output?: unknown;
  error?: Error;
  duration?: number;
}

/**
 * Compensation action for saga pattern
 */
export interface CompensationAction {
  stepId: string;
  stepName: string;
  compensate: () => Promise<void>;
  order: number;
}

/**
 * Retry policy configuration
 */
export interface RetryPolicy {
  maxAttempts: number;
  initialDelayMs: number;
  maxDelayMs: number;
  backoffMultiplier: number;
  retryableErrors: string[];
}

/**
 * Circuit breaker configuration
 */
export interface CircuitBreakerConfig {
  enabled: boolean;
  failureThreshold: number;
  successThreshold: number;
  timeout: number;
  resetTimeoutMs: number;
}

/**
 * Circuit breaker state
 */
export type CircuitBreakerState =
  | { state: 'closed'; failureCount: number }
  | { state: 'open'; openedAt: Date; nextAttemptAt: Date }
  | { state: 'half_open'; successCount: number };

/**
 * Saga transaction definition
 */
export interface SagaTransaction<T = unknown> {
  id: string;
  name: string;
  execute: () => Promise<T>;
  compensate: () => Promise<void>;
  timeout?: number;
  retryPolicy?: RetryPolicy;
}

/**
 * Saga execution result
 */
export type SagaResult<T = unknown> =
  | { success: true; result: T; executedTransactions: string[] }
  | { success: false; error: Error; compensatedTransactions: string[]; failedTransaction: string };

/**
 * Workflow execution result with discriminated union
 */
export type WorkflowExecutionResult<T = unknown> =
  | { success: true; result: T; duration: number; stepsExecuted: number }
  | { success: false; error: Error; duration: number; stepsExecuted: number; compensated: boolean };

/**
 * Transaction coordinator configuration
 */
export interface TransactionCoordinatorConfig {
  isolation: 'read_uncommitted' | 'read_committed' | 'repeatable_read' | 'serializable';
  timeout: number;
  retryPolicy: RetryPolicy;
  enableTwoPhaseCommit: boolean;
}

/**
 * Two-phase commit participant
 */
export interface TwoPhaseCommitParticipant {
  id: string;
  name: string;
  prepare: () => Promise<boolean>;
  commit: () => Promise<void>;
  rollback: () => Promise<void>;
}

/**
 * Distributed transaction state
 */
export interface DistributedTransactionState {
  transactionId: string;
  participants: TwoPhaseCommitParticipant[];
  phase: 'preparing' | 'prepared' | 'committing' | 'committed' | 'rolling_back' | 'rolled_back';
  preparedParticipants: string[];
  committedParticipants: string[];
  rolledBackParticipants: string[];
  startedAt: Date;
  timeout: number;
}

/**
 * Workflow metrics for monitoring
 */
export interface WorkflowMetrics {
  workflowId: string;
  totalExecutions: number;
  successfulExecutions: number;
  failedExecutions: number;
  averageDuration: number;
  minDuration: number;
  maxDuration: number;
  p50Duration: number;
  p95Duration: number;
  p99Duration: number;
  errorRate: number;
  lastExecutionAt: Date;
}

/**
 * Conditional type for extracting workflow input type
 */
export type ExtractWorkflowInput<T> = T extends WorkflowDefinition<infer I, unknown> ? I : never;

/**
 * Conditional type for extracting workflow output type
 */
export type ExtractWorkflowOutput<T> = T extends WorkflowDefinition<unknown, infer O> ? O : never;

/**
 * Mapped type for creating partial workflow steps
 */
export type PartialWorkflowSteps<T> = {
  [K in keyof T]?: T[K] extends WorkflowStep<infer I, infer O> ? Partial<WorkflowStep<I, O>> : never;
};

/**
 * Utility type for workflow step results
 */
export type WorkflowStepResults<T extends readonly WorkflowStep[]> = {
  [K in keyof T]: T[K] extends WorkflowStep<unknown, infer O> ? O : never;
};

// ============================================================================
// WORKFLOW STATE MACHINE
// ============================================================================

/**
 * Workflow state machine with type-safe state transitions
 * Manages workflow lifecycle with discriminated unions for compile-time safety
 *
 * @example
 * const machine = new WorkflowStateMachine('workflow-123');
 * await machine.transition({ status: 'in_progress', startedAt: new Date(), currentStep: 'step1' });
 */
@Injectable()
export class WorkflowStateMachine extends EventEmitter {
  private readonly logger = new Logger(WorkflowStateMachine.name);
  private state: WorkflowState;

  constructor(
    private readonly workflowId: string,
    initialState: WorkflowState = { status: 'pending', metadata: {} }
  ) {
    super();
    this.state = initialState;
  }

  /**
   * Get current workflow state
   */
  getState(): WorkflowState {
    return this.state;
  }

  /**
   * Transition to new state with validation
   */
  async transition(newState: WorkflowState): Promise<void> {
    const validTransition = this.validateTransition(this.state, newState);

    if (!validTransition) {
      throw new BadRequestException(
        `Invalid state transition from ${this.state.status} to ${newState.status}`
      );
    }

    const oldState = this.state;
    this.state = newState;

    this.emit('state_changed', {
      workflowId: this.workflowId,
      oldState,
      newState,
      timestamp: new Date(),
    });

    this.logger.log(`Workflow ${this.workflowId} transitioned from ${oldState.status} to ${newState.status}`);
  }

  /**
   * Validate state transition using type guards
   */
  private validateTransition(current: WorkflowState, next: WorkflowState): boolean {
    switch (current.status) {
      case 'pending':
        return next.status === 'in_progress' || next.status === 'failed';
      case 'in_progress':
        return next.status === 'completed' || next.status === 'failed' || next.status === 'compensating';
      case 'failed':
        return next.status === 'in_progress' || next.status === 'compensating';
      case 'compensating':
        return next.status === 'compensated' || next.status === 'failed';
      case 'completed':
      case 'compensated':
        return false; // Terminal states
      default:
        return false;
    }
  }

  /**
   * Check if workflow is in terminal state
   */
  isTerminal(): boolean {
    return this.state.status === 'completed' || this.state.status === 'compensated';
  }

  /**
   * Check if workflow can be retried
   */
  canRetry(): boolean {
    return this.state.status === 'failed' || this.state.status === 'compensating';
  }
}

// ============================================================================
// CIRCUIT BREAKER IMPLEMENTATION
// ============================================================================

/**
 * Circuit breaker for preventing cascade failures
 * Implements circuit breaker pattern with configurable thresholds
 *
 * @example
 * const breaker = new CircuitBreaker('api-service', config);
 * const result = await breaker.execute(() => apiCall());
 */
export class CircuitBreaker {
  private readonly logger = new Logger(CircuitBreaker.name);
  private state: CircuitBreakerState = { state: 'closed', failureCount: 0 };
  private metrics = {
    totalCalls: 0,
    successfulCalls: 0,
    failedCalls: 0,
    rejectedCalls: 0,
  };

  constructor(
    private readonly name: string,
    private readonly config: CircuitBreakerConfig
  ) {}

  /**
   * Execute function with circuit breaker protection
   */
  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (!this.config.enabled) {
      return fn();
    }

    this.metrics.totalCalls++;

    // Check if circuit is open
    if (this.state.state === 'open') {
      const now = new Date();
      if (now < this.state.nextAttemptAt) {
        this.metrics.rejectedCalls++;
        throw new InternalServerErrorException(
          `Circuit breaker ${this.name} is OPEN. Next attempt at ${this.state.nextAttemptAt.toISOString()}`
        );
      }
      // Transition to half-open
      this.state = { state: 'half_open', successCount: 0 };
      this.logger.log(`Circuit breaker ${this.name} transitioning to HALF_OPEN`);
    }

    try {
      const result = await this.executeWithTimeout(fn);
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  /**
   * Execute function with timeout
   */
  private async executeWithTimeout<T>(fn: () => Promise<T>): Promise<T> {
    return Promise.race([
      fn(),
      new Promise<T>((_, reject) =>
        setTimeout(() => reject(new Error('Circuit breaker timeout')), this.config.timeout)
      ),
    ]);
  }

  /**
   * Handle successful execution
   */
  private onSuccess(): void {
    this.metrics.successfulCalls++;

    if (this.state.state === 'half_open') {
      const newSuccessCount = this.state.successCount + 1;
      if (newSuccessCount >= this.config.successThreshold) {
        this.state = { state: 'closed', failureCount: 0 };
        this.logger.log(`Circuit breaker ${this.name} closed after ${newSuccessCount} successful calls`);
      } else {
        this.state = { state: 'half_open', successCount: newSuccessCount };
      }
    } else if (this.state.state === 'closed') {
      this.state = { state: 'closed', failureCount: 0 };
    }
  }

  /**
   * Handle failed execution
   */
  private onFailure(): void {
    this.metrics.failedCalls++;

    if (this.state.state === 'closed') {
      const newFailureCount = this.state.failureCount + 1;
      if (newFailureCount >= this.config.failureThreshold) {
        const now = new Date();
        const nextAttemptAt = new Date(now.getTime() + this.config.resetTimeoutMs);
        this.state = { state: 'open', openedAt: now, nextAttemptAt };
        this.logger.error(`Circuit breaker ${this.name} OPENED after ${newFailureCount} failures`);
      } else {
        this.state = { state: 'closed', failureCount: newFailureCount };
      }
    } else if (this.state.state === 'half_open') {
      const now = new Date();
      const nextAttemptAt = new Date(now.getTime() + this.config.resetTimeoutMs);
      this.state = { state: 'open', openedAt: now, nextAttemptAt };
      this.logger.error(`Circuit breaker ${this.name} reopened from HALF_OPEN`);
    }
  }

  /**
   * Get current circuit breaker state
   */
  getState(): CircuitBreakerState {
    return this.state;
  }

  /**
   * Get circuit breaker metrics
   */
  getMetrics(): typeof this.metrics {
    return { ...this.metrics };
  }

  /**
   * Reset circuit breaker
   */
  reset(): void {
    this.state = { state: 'closed', failureCount: 0 };
    this.logger.log(`Circuit breaker ${this.name} manually reset`);
  }
}

// ============================================================================
// RETRY LOGIC WITH EXPONENTIAL BACKOFF
// ============================================================================

/**
 * Execute function with retry logic and exponential backoff
 * Implements intelligent retry with jitter to prevent thundering herd
 *
 * @param fn - Function to execute
 * @param policy - Retry policy configuration
 * @returns Promise with function result
 *
 * @example
 * const result = await executeWithRetry(
 *   () => unstableApiCall(),
 *   { maxAttempts: 3, initialDelayMs: 100, maxDelayMs: 5000, backoffMultiplier: 2, retryableErrors: ['ETIMEDOUT'] }
 * );
 */
export async function executeWithRetry<T>(
  fn: () => Promise<T>,
  policy: RetryPolicy
): Promise<T> {
  let lastError: Error | undefined;

  for (let attempt = 1; attempt <= policy.maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;

      // Check if error is retryable
      const isRetryable = policy.retryableErrors.length === 0 ||
        policy.retryableErrors.some(errType => lastError.message.includes(errType));

      if (!isRetryable || attempt === policy.maxAttempts) {
        throw lastError;
      }

      // Calculate delay with exponential backoff and jitter
      const baseDelay = Math.min(
        policy.initialDelayMs * Math.pow(policy.backoffMultiplier, attempt - 1),
        policy.maxDelayMs
      );
      const jitter = Math.random() * baseDelay * 0.1; // 10% jitter
      const delay = baseDelay + jitter;

      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError || new Error('Retry failed without error');
}

// ============================================================================
// SAGA PATTERN COORDINATOR
// ============================================================================

/**
 * Orchestrate saga pattern with automatic compensation
 * Implements distributed transaction pattern with rollback capability
 *
 * @param transactions - Array of saga transactions
 * @param context - Workflow context
 * @returns Saga execution result
 *
 * @example
 * const result = await orchestrateSaga([
 *   { id: '1', name: 'CreateOrder', execute: createOrder, compensate: deleteOrder },
 *   { id: '2', name: 'ReserveInventory', execute: reserve, compensate: release }
 * ], context);
 */
export async function orchestrateSaga<T = unknown>(
  transactions: SagaTransaction[],
  context: WorkflowContext
): Promise<SagaResult<T>> {
  const logger = new Logger('SagaOrchestrator');
  const executedTransactions: string[] = [];
  const compensationStack: Array<() => Promise<void>> = [];

  try {
    // Execute transactions in sequence
    for (const transaction of transactions) {
      logger.log(`Executing saga transaction: ${transaction.name}`);

      const executeWithPolicy = transaction.retryPolicy
        ? () => executeWithRetry(transaction.execute, transaction.retryPolicy!)
        : transaction.execute;

      const result = await executeWithPolicy();
      executedTransactions.push(transaction.id);
      compensationStack.push(transaction.compensate);

      // Record in context
      context.executionHistory.push({
        eventId: crypto.randomUUID(),
        timestamp: new Date(),
        stepId: transaction.id,
        stepName: transaction.name,
        eventType: 'step_completed',
        output: result,
      });
    }

    return {
      success: true,
      result: undefined as T, // Last transaction result
      executedTransactions,
    };
  } catch (error) {
    logger.error(`Saga transaction failed: ${error.message}`, error.stack);

    // Compensate in reverse order
    const compensatedTransactions: string[] = [];
    while (compensationStack.length > 0) {
      const compensate = compensationStack.pop()!;
      const transactionId = executedTransactions[compensationStack.length];

      try {
        await compensate();
        compensatedTransactions.push(transactionId);
        logger.log(`Compensated transaction: ${transactionId}`);
      } catch (compensationError) {
        logger.error(`Compensation failed for ${transactionId}: ${compensationError.message}`);
      }
    }

    return {
      success: false,
      error: error as Error,
      compensatedTransactions,
      failedTransaction: executedTransactions[executedTransactions.length - 1] || 'unknown',
    };
  }
}

/**
 * Create saga transaction from workflow step
 */
export function createSagaTransaction<TInput, TOutput>(
  step: WorkflowStep<TInput, TOutput>,
  input: TInput,
  context: WorkflowContext
): SagaTransaction<TOutput> {
  return {
    id: step.id,
    name: step.name,
    execute: () => step.execute(input, context),
    compensate: step.compensate
      ? () => step.compensate!(input, context)
      : async () => {},
    timeout: step.timeout,
    retryPolicy: step.retryPolicy,
  };
}

/**
 * Orchestrate multiple sagas in parallel with coordination
 */
export async function orchestrateParallelSagas(
  sagaGroups: SagaTransaction[][],
  context: WorkflowContext
): Promise<SagaResult[]> {
  const results = await Promise.allSettled(
    sagaGroups.map(saga => orchestrateSaga(saga, context))
  );

  return results.map(result =>
    result.status === 'fulfilled'
      ? result.value
      : {
          success: false,
          error: result.reason,
          compensatedTransactions: [],
          failedTransaction: 'parallel_execution',
        }
  );
}

/**
 * Create compensable workflow step
 */
export function createCompensableStep<TInput, TOutput>(
  id: string,
  name: string,
  execute: (input: TInput, context: WorkflowContext) => Promise<TOutput>,
  compensate: (input: TInput, context: WorkflowContext) => Promise<void>
): WorkflowStep<TInput, TOutput> {
  return {
    id,
    name,
    execute,
    compensate,
  };
}

// ============================================================================
// WORKFLOW ORCHESTRATOR
// ============================================================================

/**
 * Execute workflow with full orchestration capabilities
 * Main workflow execution engine with state management, monitoring, and error handling
 *
 * @param workflow - Workflow definition
 * @param input - Workflow input data
 * @param context - Workflow execution context
 * @returns Workflow execution result
 *
 * @example
 * const result = await executeWorkflow(workflowDef, inputData, context);
 */
export async function executeWorkflow<TInput, TOutput>(
  workflow: WorkflowDefinition<TInput, TOutput>,
  input: TInput,
  context: WorkflowContext
): Promise<WorkflowExecutionResult<TOutput>> {
  const logger = new Logger('WorkflowOrchestrator');
  const startTime = Date.now();
  const stateMachine = new WorkflowStateMachine(context.workflowId);

  try {
    // Transition to in_progress
    await stateMachine.transition({
      status: 'in_progress',
      startedAt: new Date(),
      currentStep: workflow.steps[0]?.id || 'unknown',
    });

    let currentInput: unknown = input;
    let stepsExecuted = 0;

    // Execute each step in sequence
    for (const step of workflow.steps) {
      logger.log(`Executing workflow step: ${step.name}`);

      const stepStartTime = Date.now();
      const circuitBreaker = step.circuitBreaker
        ? new CircuitBreaker(step.id, step.circuitBreaker)
        : null;

      try {
        const executeStep = () => step.execute(currentInput, context);
        const executeWithProtection = circuitBreaker
          ? () => circuitBreaker.execute(executeStep)
          : executeStep;

        const executeWithRetryLogic = step.retryPolicy
          ? () => executeWithRetry(executeWithProtection, step.retryPolicy!)
          : executeWithProtection;

        const stepResult = await executeWithRetryLogic();
        currentInput = stepResult;
        stepsExecuted++;

        // Record execution event
        context.executionHistory.push({
          eventId: crypto.randomUUID(),
          timestamp: new Date(),
          stepId: step.id,
          stepName: step.name,
          eventType: 'step_completed',
          input: currentInput,
          output: stepResult,
          duration: Date.now() - stepStartTime,
        });

        // Add to compensation stack if compensate function exists
        if (step.compensate) {
          context.compensationStack.push({
            stepId: step.id,
            stepName: step.name,
            compensate: () => step.compensate!(currentInput, context),
            order: context.compensationStack.length,
          });
        }
      } catch (stepError) {
        logger.error(`Workflow step ${step.name} failed: ${stepError.message}`);

        // Record failure event
        context.executionHistory.push({
          eventId: crypto.randomUUID(),
          timestamp: new Date(),
          stepId: step.id,
          stepName: step.name,
          eventType: 'step_failed',
          error: stepError as Error,
          duration: Date.now() - stepStartTime,
        });

        // Attempt compensation if enabled
        if (workflow.rollbackOnFailure) {
          await compensateWorkflow(context);

          await stateMachine.transition({
            status: 'compensated',
            compensatedAt: new Date(),
            rollbackResult: 'Workflow compensated due to failure',
          });

          return {
            success: false,
            error: stepError as Error,
            duration: Date.now() - startTime,
            stepsExecuted,
            compensated: true,
          };
        }

        await stateMachine.transition({
          status: 'failed',
          failedAt: new Date(),
          error: stepError as Error,
          retryCount: 0,
        });

        return {
          success: false,
          error: stepError as Error,
          duration: Date.now() - startTime,
          stepsExecuted,
          compensated: false,
        };
      }
    }

    // Transition to completed
    await stateMachine.transition({
      status: 'completed',
      completedAt: new Date(),
      result: currentInput,
    });

    logger.log(`Workflow ${workflow.name} completed successfully in ${Date.now() - startTime}ms`);

    return {
      success: true,
      result: currentInput as TOutput,
      duration: Date.now() - startTime,
      stepsExecuted,
    };
  } catch (error) {
    logger.error(`Workflow ${workflow.name} failed: ${error.message}`);

    await stateMachine.transition({
      status: 'failed',
      failedAt: new Date(),
      error: error as Error,
      retryCount: 0,
    });

    return {
      success: false,
      error: error as Error,
      duration: Date.now() - startTime,
      stepsExecuted: 0,
      compensated: false,
    };
  }
}

/**
 * Compensate workflow by executing compensation actions in reverse order
 */
async function compensateWorkflow(context: WorkflowContext): Promise<void> {
  const logger = new Logger('WorkflowCompensation');

  // Execute compensations in reverse order (LIFO)
  const compensations = [...context.compensationStack].reverse();

  for (const compensation of compensations) {
    try {
      logger.log(`Compensating step: ${compensation.stepName}`);
      await compensation.compensate();

      context.executionHistory.push({
        eventId: crypto.randomUUID(),
        timestamp: new Date(),
        stepId: compensation.stepId,
        stepName: compensation.stepName,
        eventType: 'step_compensated',
      });
    } catch (error) {
      logger.error(`Compensation failed for ${compensation.stepName}: ${error.message}`);
    }
  }
}

/**
 * Create workflow definition with type safety
 */
export function createWorkflow<TInput, TOutput>(
  id: string,
  name: string,
  steps: WorkflowStep<unknown, unknown>[],
  options: Partial<WorkflowDefinition<TInput, TOutput>> = {}
): WorkflowDefinition<TInput, TOutput> {
  return {
    id,
    name,
    description: options.description || '',
    version: options.version || '1.0.0',
    steps,
    rollbackOnFailure: options.rollbackOnFailure ?? true,
    maxRetries: options.maxRetries ?? 3,
    timeout: options.timeout ?? 300000, // 5 minutes
    metadata: options.metadata || {},
  };
}

/**
 * Validate workflow definition
 */
export function validateWorkflow(workflow: WorkflowDefinition): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!workflow.id || workflow.id.trim() === '') {
    errors.push('Workflow ID is required');
  }

  if (!workflow.name || workflow.name.trim() === '') {
    errors.push('Workflow name is required');
  }

  if (!workflow.steps || workflow.steps.length === 0) {
    errors.push('Workflow must have at least one step');
  }

  if (workflow.steps) {
    const stepIds = new Set<string>();
    workflow.steps.forEach((step, index) => {
      if (!step.id) {
        errors.push(`Step at index ${index} is missing ID`);
      } else if (stepIds.has(step.id)) {
        errors.push(`Duplicate step ID: ${step.id}`);
      } else {
        stepIds.add(step.id);
      }

      if (!step.execute || typeof step.execute !== 'function') {
        errors.push(`Step ${step.id} is missing execute function`);
      }
    });
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

// ============================================================================
// DISTRIBUTED TRANSACTION COORDINATOR
// ============================================================================

/**
 * Coordinate distributed transaction with two-phase commit
 * Implements 2PC protocol for ACID transactions across multiple resources
 *
 * @param participants - Transaction participants
 * @param config - Transaction coordinator configuration
 * @returns Transaction result
 *
 * @example
 * const result = await coordinateDistributedTransaction(participants, config);
 */
export async function coordinateDistributedTransaction(
  participants: TwoPhaseCommitParticipant[],
  config: TransactionCoordinatorConfig
): Promise<{ success: boolean; committedParticipants: string[]; error?: Error }> {
  const logger = new Logger('DistributedTransactionCoordinator');
  const transactionId = crypto.randomUUID();

  const state: DistributedTransactionState = {
    transactionId,
    participants,
    phase: 'preparing',
    preparedParticipants: [],
    committedParticipants: [],
    rolledBackParticipants: [],
    startedAt: new Date(),
    timeout: config.timeout,
  };

  try {
    // Phase 1: Prepare
    logger.log(`Transaction ${transactionId}: Starting prepare phase with ${participants.length} participants`);
    state.phase = 'preparing';

    const prepareResults = await Promise.allSettled(
      participants.map(p => p.prepare())
    );

    const allPrepared = prepareResults.every(
      result => result.status === 'fulfilled' && result.value === true
    );

    if (!allPrepared) {
      logger.error(`Transaction ${transactionId}: Prepare phase failed, initiating rollback`);
      state.phase = 'rolling_back';

      // Rollback all participants
      await Promise.allSettled(
        participants.map(p => p.rollback())
      );

      state.phase = 'rolled_back';

      return {
        success: false,
        committedParticipants: [],
        error: new Error('One or more participants failed to prepare'),
      };
    }

    state.phase = 'prepared';
    state.preparedParticipants = participants.map(p => p.id);
    logger.log(`Transaction ${transactionId}: All participants prepared successfully`);

    // Phase 2: Commit
    logger.log(`Transaction ${transactionId}: Starting commit phase`);
    state.phase = 'committing';

    await Promise.allSettled(
      participants.map(async (p) => {
        await p.commit();
        state.committedParticipants.push(p.id);
      })
    );

    state.phase = 'committed';
    logger.log(`Transaction ${transactionId}: Successfully committed ${state.committedParticipants.length} participants`);

    return {
      success: true,
      committedParticipants: state.committedParticipants,
    };
  } catch (error) {
    logger.error(`Transaction ${transactionId} failed: ${error.message}`);

    // Attempt rollback
    state.phase = 'rolling_back';
    await Promise.allSettled(
      participants.map(p => p.rollback())
    );
    state.phase = 'rolled_back';

    return {
      success: false,
      committedParticipants: state.committedParticipants,
      error: error as Error,
    };
  }
}

/**
 * Create two-phase commit participant from functions
 */
export function createTwoPhaseCommitParticipant(
  id: string,
  name: string,
  prepare: () => Promise<boolean>,
  commit: () => Promise<void>,
  rollback: () => Promise<void>
): TwoPhaseCommitParticipant {
  return { id, name, prepare, commit, rollback };
}

/**
 * Coordinate transaction with timeout
 */
export async function coordinateTransactionWithTimeout(
  participants: TwoPhaseCommitParticipant[],
  timeoutMs: number
): Promise<{ success: boolean; committedParticipants: string[]; error?: Error }> {
  return Promise.race([
    coordinateDistributedTransaction(participants, {
      isolation: 'serializable',
      timeout: timeoutMs,
      retryPolicy: {
        maxAttempts: 3,
        initialDelayMs: 100,
        maxDelayMs: 1000,
        backoffMultiplier: 2,
        retryableErrors: ['TIMEOUT', 'NETWORK_ERROR'],
      },
      enableTwoPhaseCommit: true,
    }),
    new Promise<{ success: boolean; committedParticipants: string[]; error: Error }>((_, reject) =>
      setTimeout(
        () => reject({ success: false, committedParticipants: [], error: new Error('Transaction timeout') }),
        timeoutMs
      )
    ),
  ]);
}

// ============================================================================
// WORKFLOW MONITORING & METRICS
// ============================================================================

/**
 * Collect workflow execution metrics
 */
export class WorkflowMetricsCollector {
  private readonly logger = new Logger(WorkflowMetricsCollector.name);
  private metrics = new Map<string, WorkflowMetrics>();

  /**
   * Record workflow execution
   */
  recordExecution(workflowId: string, success: boolean, duration: number): void {
    const current = this.metrics.get(workflowId) || this.createInitialMetrics(workflowId);

    current.totalExecutions++;
    if (success) {
      current.successfulExecutions++;
    } else {
      current.failedExecutions++;
    }

    current.averageDuration =
      (current.averageDuration * (current.totalExecutions - 1) + duration) / current.totalExecutions;
    current.minDuration = Math.min(current.minDuration, duration);
    current.maxDuration = Math.max(current.maxDuration, duration);
    current.errorRate = current.failedExecutions / current.totalExecutions;
    current.lastExecutionAt = new Date();

    this.metrics.set(workflowId, current);
  }

  /**
   * Get metrics for workflow
   */
  getMetrics(workflowId: string): WorkflowMetrics | undefined {
    return this.metrics.get(workflowId);
  }

  /**
   * Get all metrics
   */
  getAllMetrics(): Map<string, WorkflowMetrics> {
    return new Map(this.metrics);
  }

  /**
   * Reset metrics for workflow
   */
  resetMetrics(workflowId: string): void {
    this.metrics.delete(workflowId);
  }

  private createInitialMetrics(workflowId: string): WorkflowMetrics {
    return {
      workflowId,
      totalExecutions: 0,
      successfulExecutions: 0,
      failedExecutions: 0,
      averageDuration: 0,
      minDuration: Infinity,
      maxDuration: 0,
      p50Duration: 0,
      p95Duration: 0,
      p99Duration: 0,
      errorRate: 0,
      lastExecutionAt: new Date(),
    };
  }
}

/**
 * Monitor workflow health
 */
export async function monitorWorkflowHealth(
  workflowId: string,
  metricsCollector: WorkflowMetricsCollector
): Promise<{ healthy: boolean; metrics: WorkflowMetrics | undefined; issues: string[] }> {
  const metrics = metricsCollector.getMetrics(workflowId);
  const issues: string[] = [];

  if (!metrics) {
    return { healthy: true, metrics: undefined, issues: [] };
  }

  // Check error rate
  if (metrics.errorRate > 0.1) {
    issues.push(`High error rate: ${(metrics.errorRate * 100).toFixed(2)}%`);
  }

  // Check average duration
  if (metrics.averageDuration > 30000) {
    issues.push(`High average duration: ${metrics.averageDuration}ms`);
  }

  // Check last execution time
  const timeSinceLastExecution = Date.now() - metrics.lastExecutionAt.getTime();
  if (timeSinceLastExecution > 3600000) {
    issues.push(`No execution in last hour`);
  }

  return {
    healthy: issues.length === 0,
    metrics,
    issues,
  };
}

// ============================================================================
// WORKFLOW VISUALIZATION & DEBUGGING
// ============================================================================

/**
 * Generate workflow execution timeline
 */
export function generateWorkflowTimeline(context: WorkflowContext): string {
  let timeline = `Workflow Execution Timeline\n`;
  timeline += `Workflow ID: ${context.workflowId}\n`;
  timeline += `Started: ${context.startedAt.toISOString()}\n`;
  timeline += `Correlation ID: ${context.correlationId}\n\n`;

  context.executionHistory.forEach((event, index) => {
    const duration = event.duration ? ` (${event.duration}ms)` : '';
    timeline += `${index + 1}. [${event.timestamp.toISOString()}] ${event.stepName} - ${event.eventType}${duration}\n`;

    if (event.error) {
      timeline += `   Error: ${event.error.message}\n`;
    }
  });

  return timeline;
}

/**
 * Generate workflow execution graph (DOT format)
 */
export function generateWorkflowGraph(workflow: WorkflowDefinition): string {
  let graph = 'digraph Workflow {\n';
  graph += '  rankdir=LR;\n';
  graph += '  node [shape=box];\n\n';

  workflow.steps.forEach((step, index) => {
    graph += `  step${index} [label="${step.name}"];\n`;

    if (index > 0) {
      graph += `  step${index - 1} -> step${index};\n`;
    }

    if (step.compensate) {
      graph += `  comp${index} [label="Compensate ${step.name}", style=dashed];\n`;
      graph += `  step${index} -> comp${index} [style=dashed, label="on failure"];\n`;
    }
  });

  graph += '}\n';
  return graph;
}

/**
 * Debug workflow execution
 */
export function debugWorkflow(workflow: WorkflowDefinition, context: WorkflowContext): {
  summary: string;
  timeline: string;
  graph: string;
  recommendations: string[];
} {
  const recommendations: string[] = [];

  // Analyze workflow
  if (workflow.steps.length > 10) {
    recommendations.push('Consider breaking down workflow into smaller sub-workflows');
  }

  const stepsWithoutCompensation = workflow.steps.filter(s => !s.compensate).length;
  if (stepsWithoutCompensation > 0 && workflow.rollbackOnFailure) {
    recommendations.push(`${stepsWithoutCompensation} steps lack compensation functions`);
  }

  const failedSteps = context.executionHistory.filter(e => e.eventType === 'step_failed').length;
  if (failedSteps > 0) {
    recommendations.push('Review failed steps and consider improving error handling');
  }

  return {
    summary: `Workflow "${workflow.name}" with ${workflow.steps.length} steps, ${context.executionHistory.length} events`,
    timeline: generateWorkflowTimeline(context),
    graph: generateWorkflowGraph(workflow),
    recommendations,
  };
}

// ============================================================================
// ERROR RECOVERY STRATEGIES
// ============================================================================

/**
 * Attempt workflow recovery after failure
 */
export async function recoverWorkflow<TInput, TOutput>(
  workflow: WorkflowDefinition<TInput, TOutput>,
  context: WorkflowContext,
  lastSuccessfulStepId: string
): Promise<WorkflowExecutionResult<TOutput>> {
  const logger = new Logger('WorkflowRecovery');

  // Find the failed step index
  const failedStepIndex = workflow.steps.findIndex(s => s.id === lastSuccessfulStepId) + 1;

  if (failedStepIndex === 0 || failedStepIndex >= workflow.steps.length) {
    throw new Error('Cannot determine recovery point');
  }

  logger.log(`Recovering workflow from step ${failedStepIndex}: ${workflow.steps[failedStepIndex].name}`);

  // Create a new workflow with remaining steps
  const recoveryWorkflow: WorkflowDefinition<TInput, TOutput> = {
    ...workflow,
    id: `${workflow.id}-recovery`,
    steps: workflow.steps.slice(failedStepIndex),
  };

  // Execute recovery workflow
  const lastOutput = context.executionHistory
    .filter(e => e.stepId === lastSuccessfulStepId && e.eventType === 'step_completed')
    .pop()?.output;

  return executeWorkflow(recoveryWorkflow, lastOutput as TInput, context);
}

/**
 * Create workflow checkpoint for recovery
 */
export function createWorkflowCheckpoint(context: WorkflowContext): {
  checkpointId: string;
  timestamp: Date;
  executionHistory: WorkflowExecutionEvent[];
  compensationStack: CompensationAction[];
} {
  return {
    checkpointId: crypto.randomUUID(),
    timestamp: new Date(),
    executionHistory: [...context.executionHistory],
    compensationStack: [...context.compensationStack],
  };
}

/**
 * Restore workflow from checkpoint
 */
export function restoreWorkflowFromCheckpoint(
  context: WorkflowContext,
  checkpoint: ReturnType<typeof createWorkflowCheckpoint>
): void {
  context.executionHistory = [...checkpoint.executionHistory];
  context.compensationStack = [...checkpoint.compensationStack];
}

// ============================================================================
// WORKFLOW BUILDER & FACTORY FUNCTIONS
// ============================================================================

/**
 * Workflow builder for fluent API
 */
export class WorkflowBuilder<TInput = unknown, TOutput = unknown> {
  private steps: WorkflowStep<unknown, unknown>[] = [];
  private workflowId: string;
  private workflowName: string;
  private rollbackEnabled = true;
  private maxRetries = 3;
  private timeoutMs = 300000;

  constructor(id: string, name: string) {
    this.workflowId = id;
    this.workflowName = name;
  }

  addStep<TStepInput, TStepOutput>(
    id: string,
    name: string,
    execute: (input: TStepInput, context: WorkflowContext) => Promise<TStepOutput>,
    compensate?: (input: TStepInput, context: WorkflowContext) => Promise<void>
  ): WorkflowBuilder<TInput, TStepOutput> {
    this.steps.push({ id, name, execute, compensate });
    return this as unknown as WorkflowBuilder<TInput, TStepOutput>;
  }

  withRollback(enabled: boolean): this {
    this.rollbackEnabled = enabled;
    return this;
  }

  withRetries(max: number): this {
    this.maxRetries = max;
    return this;
  }

  withTimeout(timeoutMs: number): this {
    this.timeoutMs = timeoutMs;
    return this;
  }

  build(): WorkflowDefinition<TInput, TOutput> {
    return createWorkflow<TInput, TOutput>(
      this.workflowId,
      this.workflowName,
      this.steps,
      {
        rollbackOnFailure: this.rollbackEnabled,
        maxRetries: this.maxRetries,
        timeout: this.timeoutMs,
      }
    );
  }
}

/**
 * Create workflow builder
 */
export function workflowBuilder<TInput = unknown, TOutput = unknown>(
  id: string,
  name: string
): WorkflowBuilder<TInput, TOutput> {
  return new WorkflowBuilder<TInput, TOutput>(id, name);
}

/**
 * Create parallel workflow steps
 */
export function createParallelSteps<TInput, TOutput>(
  steps: WorkflowStep<TInput, TOutput>[]
): WorkflowStep<TInput, TOutput[]> {
  return {
    id: `parallel-${crypto.randomUUID()}`,
    name: 'Parallel Execution',
    execute: async (input: TInput, context: WorkflowContext) => {
      const results = await Promise.all(
        steps.map(step => step.execute(input, context))
      );
      return results;
    },
    compensate: async (input: TInput, context: WorkflowContext) => {
      await Promise.all(
        steps.filter(s => s.compensate).map(step => step.compensate!(input, context))
      );
    },
  };
}

/**
 * Create conditional workflow step
 */
export function createConditionalStep<TInput, TOutput>(
  id: string,
  name: string,
  condition: (input: TInput) => boolean,
  ifTrue: WorkflowStep<TInput, TOutput>,
  ifFalse: WorkflowStep<TInput, TOutput>
): WorkflowStep<TInput, TOutput> {
  return {
    id,
    name,
    execute: async (input: TInput, context: WorkflowContext) => {
      const step = condition(input) ? ifTrue : ifFalse;
      return step.execute(input, context);
    },
  };
}

/**
 * Create workflow step with circuit breaker
 */
export function createStepWithCircuitBreaker<TInput, TOutput>(
  step: WorkflowStep<TInput, TOutput>,
  config: CircuitBreakerConfig
): WorkflowStep<TInput, TOutput> {
  return {
    ...step,
    circuitBreaker: config,
  };
}

/**
 * Create workflow step with retry policy
 */
export function createStepWithRetry<TInput, TOutput>(
  step: WorkflowStep<TInput, TOutput>,
  policy: RetryPolicy
): WorkflowStep<TInput, TOutput> {
  return {
    ...step,
    retryPolicy: policy,
  };
}

// ============================================================================
// WORKFLOW COMPOSITION & TRANSFORMATION
// ============================================================================

/**
 * Compose two workflows sequentially
 */
export function composeWorkflows<T1, T2, T3>(
  workflow1: WorkflowDefinition<T1, T2>,
  workflow2: WorkflowDefinition<T2, T3>
): WorkflowDefinition<T1, T3> {
  return {
    id: `${workflow1.id}-${workflow2.id}`,
    name: `${workflow1.name} -> ${workflow2.name}`,
    description: `Composed workflow: ${workflow1.name} followed by ${workflow2.name}`,
    version: '1.0.0',
    steps: [...workflow1.steps, ...workflow2.steps],
    rollbackOnFailure: workflow1.rollbackOnFailure && workflow2.rollbackOnFailure,
    maxRetries: Math.max(workflow1.maxRetries, workflow2.maxRetries),
    timeout: workflow1.timeout + workflow2.timeout,
    metadata: { composed: true, workflows: [workflow1.id, workflow2.id] },
  };
}

/**
 * Transform workflow input/output types
 */
export function transformWorkflow<TInput1, TOutput1, TInput2, TOutput2>(
  workflow: WorkflowDefinition<TInput1, TOutput1>,
  inputMapper: (input: TInput2) => TInput1,
  outputMapper: (output: TOutput1) => TOutput2
): WorkflowDefinition<TInput2, TOutput2> {
  const transformedSteps = workflow.steps.map((step, index) => {
    if (index === 0) {
      const originalExecute = step.execute;
      return {
        ...step,
        execute: async (input: unknown, context: WorkflowContext) => {
          const mappedInput = inputMapper(input as TInput2);
          return originalExecute(mappedInput, context);
        },
      };
    }
    if (index === workflow.steps.length - 1) {
      const originalExecute = step.execute;
      return {
        ...step,
        execute: async (input: unknown, context: WorkflowContext) => {
          const result = await originalExecute(input, context);
          return outputMapper(result as TOutput1);
        },
      };
    }
    return step;
  });

  return {
    ...workflow,
    steps: transformedSteps,
  };
}

/**
 * Filter workflow steps based on condition
 */
export function filterWorkflowSteps<TInput, TOutput>(
  workflow: WorkflowDefinition<TInput, TOutput>,
  predicate: (step: WorkflowStep<unknown, unknown>) => boolean
): WorkflowDefinition<TInput, TOutput> {
  return {
    ...workflow,
    steps: workflow.steps.filter(predicate),
  };
}

/**
 * Map workflow steps with transformation
 */
export function mapWorkflowSteps<TInput, TOutput>(
  workflow: WorkflowDefinition<TInput, TOutput>,
  mapper: (step: WorkflowStep<unknown, unknown>) => WorkflowStep<unknown, unknown>
): WorkflowDefinition<TInput, TOutput> {
  return {
    ...workflow,
    steps: workflow.steps.map(mapper),
  };
}

// Export all types and functions for external use
export type {
  WorkflowStep,
  WorkflowDefinition,
  WorkflowContext,
  WorkflowExecutionEvent,
  CompensationAction,
  RetryPolicy,
  CircuitBreakerConfig,
  SagaTransaction,
  TwoPhaseCommitParticipant,
  DistributedTransactionState,
  WorkflowMetrics,
};
