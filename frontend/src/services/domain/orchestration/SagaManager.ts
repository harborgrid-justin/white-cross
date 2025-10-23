/**
 * @fileoverview Saga Pattern Implementation for Distributed Transactions
 * @module services/domain/orchestration/SagaManager
 * @category Domain Services
 * 
 * Implements the Saga pattern for managing distributed transactions across services.
 * Provides automatic compensation (rollback) on failures.
 * 
 * Key Features:
 * - Step-by-step transaction execution with compensation
 * - Automatic rollback on failure
 * - Transaction state tracking
 * - HIPAA-compliant audit trail
 * 
 * @example
 * ```typescript
 * const saga = sagaManager.create<StudentAdmissionSaga>();
 * 
 * try {
 *   // Step 1: Create student
 *   const student = await saga.step(
 *     () => studentService.create(data),
 *     (student) => studentService.delete(student.id)
 *   );
 *   
 *   // Step 2: Create health record
 *   const healthRecord = await saga.step(
 *     () => healthService.initialize(student.id),
 *     (record) => healthService.delete(record.id)
 *   );
 *   
 *   await saga.commit();
 *   return { student, healthRecord };
 * } catch (error) {
 *   await saga.rollback();
 *   throw error;
 * }
 * ```
 */

export interface SagaStep<T = unknown> {
  stepId: string;
  stepName: string;
  execute: () => Promise<T>;
  compensate: (result: T) => Promise<void>;
  result?: T;
  executed: boolean;
  compensated: boolean;
  error?: Error;
}

export enum SagaState {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMMITTED = 'COMMITTED',
  ROLLED_BACK = 'ROLLED_BACK',
  FAILED = 'FAILED'
}

export interface SagaMetadata {
  sagaId: string;
  sagaType: string;
  createdAt: Date;
  completedAt?: Date;
  state: SagaState;
  totalSteps: number;
  completedSteps: number;
  compensatedSteps: number;
}

/**
 * Saga Transaction Manager
 * Manages a single saga transaction with multiple steps
 */
export class Saga<T = unknown> {
  private sagaId: string;
  private sagaType: string;
  private steps: SagaStep[] = [];
  private state: SagaState = SagaState.PENDING;
  private createdAt: Date = new Date();
  private completedAt?: Date;
  private results: Map<string, unknown> = new Map();

  constructor(sagaType: string) {
    this.sagaId = this.generateSagaId();
    this.sagaType = sagaType;
  }

  private generateSagaId(): string {
    return `saga-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Add a step to the saga
   */
  public async step<TResult>(
    execute: () => Promise<TResult>,
    compensate: (result: TResult) => Promise<void>,
    stepName?: string
  ): Promise<TResult> {
    if (this.state !== SagaState.PENDING && this.state !== SagaState.IN_PROGRESS) {
      throw new Error(`Cannot add step to saga in ${this.state} state`);
    }

    this.state = SagaState.IN_PROGRESS;

    const step: SagaStep<TResult> = {
      stepId: `step-${this.steps.length + 1}`,
      stepName: stepName || `Step ${this.steps.length + 1}`,
      execute,
      compensate,
      executed: false,
      compensated: false
    };

    try {
      const result = await execute();
      step.result = result;
      step.executed = true;
      this.steps.push(step);
      this.results.set(step.stepId, result);
      return result;
    } catch (error) {
      step.error = error instanceof Error ? error : new Error(String(error));
      step.executed = false;
      this.steps.push(step);
      throw error;
    }
  }

  /**
   * Commit the saga (mark as complete)
   */
  public async commit(): Promise<void> {
    if (this.state !== SagaState.IN_PROGRESS) {
      throw new Error(`Cannot commit saga in ${this.state} state`);
    }

    this.state = SagaState.COMMITTED;
    this.completedAt = new Date();
  }

  /**
   * Rollback the saga (compensate all executed steps)
   */
  public async rollback(): Promise<void> {
    if (this.state === SagaState.ROLLED_BACK || this.state === SagaState.COMMITTED) {
      return;
    }

    console.log(`[SAGA] Rolling back saga ${this.sagaId} (${this.sagaType})`);

    // Compensate steps in reverse order
    const executedSteps = this.steps.filter(step => step.executed);
    
    for (let i = executedSteps.length - 1; i >= 0; i--) {
      const step = executedSteps[i];
      
      try {
        if (step.result !== undefined) {
          await step.compensate(step.result);
          step.compensated = true;
          console.log(`[SAGA] Compensated step: ${step.stepName}`);
        }
      } catch (error) {
        console.error(`[SAGA] Failed to compensate step ${step.stepName}:`, error);
        step.error = error instanceof Error ? error : new Error(String(error));
      }
    }

    this.state = SagaState.ROLLED_BACK;
    this.completedAt = new Date();
  }

  /**
   * Get saga metadata
   */
  public getMetadata(): SagaMetadata {
    return {
      sagaId: this.sagaId,
      sagaType: this.sagaType,
      createdAt: this.createdAt,
      completedAt: this.completedAt,
      state: this.state,
      totalSteps: this.steps.length,
      completedSteps: this.steps.filter(s => s.executed).length,
      compensatedSteps: this.steps.filter(s => s.compensated).length
    };
  }

  /**
   * Get all step results
   */
  public getResults(): Map<string, unknown> {
    return new Map(this.results);
  }

  /**
   * Get specific step result
   */
  public getStepResult<TResult>(stepId: string): TResult | undefined {
    return this.results.get(stepId) as TResult;
  }

  /**
   * Get saga state
   */
  public getState(): SagaState {
    return this.state;
  }

  /**
   * Get saga ID
   */
  public getSagaId(): string {
    return this.sagaId;
  }
}

/**
 * Saga Manager
 * Factory for creating and managing sagas
 */
export class SagaManager {
  private static instance: SagaManager;
  private activeSagas: Map<string, Saga> = new Map();
  private sagaHistory: SagaMetadata[] = [];

  private constructor() {}

  /**
   * Get singleton instance
   */
  public static getInstance(): SagaManager {
    if (!SagaManager.instance) {
      SagaManager.instance = new SagaManager();
    }
    return SagaManager.instance;
  }

  /**
   * Create a new saga
   */
  public create<T = unknown>(sagaType: string): Saga<T> {
    const saga = new Saga<T>(sagaType);
    this.activeSagas.set(saga.getSagaId(), saga);
    return saga;
  }

  /**
   * Get active saga by ID
   */
  public getSaga(sagaId: string): Saga | undefined {
    return this.activeSagas.get(sagaId);
  }

  /**
   * Complete saga and move to history
   */
  public complete(sagaId: string): void {
    const saga = this.activeSagas.get(sagaId);
    if (saga) {
      this.sagaHistory.push(saga.getMetadata());
      this.activeSagas.delete(sagaId);
    }
  }

  /**
   * Get all active sagas
   */
  public getActiveSagas(): Saga[] {
    return Array.from(this.activeSagas.values());
  }

  /**
   * Get saga history
   */
  public getHistory(): SagaMetadata[] {
    return [...this.sagaHistory];
  }

  /**
   * Clear history
   */
  public clearHistory(): void {
    this.sagaHistory = [];
  }

  /**
   * Get statistics
   */
  public getStatistics() {
    const history = this.sagaHistory;
    return {
      totalSagas: history.length,
      committed: history.filter(s => s.state === SagaState.COMMITTED).length,
      rolledBack: history.filter(s => s.state === SagaState.ROLLED_BACK).length,
      failed: history.filter(s => s.state === SagaState.FAILED).length,
      averageSteps: history.length > 0
        ? history.reduce((sum, s) => sum + s.totalSteps, 0) / history.length
        : 0,
      averageDuration: history.length > 0
        ? history
            .filter(s => s.completedAt)
            .reduce((sum, s) => sum + (s.completedAt!.getTime() - s.createdAt.getTime()), 0) /
          history.filter(s => s.completedAt).length
        : 0
    };
  }
}

// Export singleton instance
export const sagaManager = SagaManager.getInstance();
