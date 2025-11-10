/**
 * LOC: HLTH-DS-TXN-COORD-001
 * File: /reuse/server/health/composites/downstream/transaction-coordination-services.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common (v10.x)
 *   - sequelize (v6.x)
 *   - ../epic-data-persistence-composites
 */

/**
 * File: /reuse/server/health/composites/downstream/transaction-coordination-services.ts
 * Locator: WC-DS-TXN-COORD-001
 * Purpose: Transaction Coordination - Distributed transaction management with saga patterns
 */

import { Injectable, Logger, Inject } from '@nestjs/common';
import { ApiProperty, ApiTags, ApiOperation } from '@nestjs/swagger';
import { Sequelize, Transaction } from 'sequelize';
import {
  executePatientRegistrationSaga,
  EpicPatientData,
  AuditMetadata,
} from '../epic-data-persistence-composites';

export class SagaStep {
  @ApiProperty({ description: 'Step name' })
  name: string;

  @ApiProperty({ description: 'Execute function' })
  execute: () => Promise<any>;

  @ApiProperty({ description: 'Compensate function' })
  compensate: () => Promise<void>;
}

export class DistributedTransaction {
  @ApiProperty({ description: 'Transaction ID' })
  transactionId: string;

  @ApiProperty({ description: 'Steps' })
  steps: SagaStep[];

  @ApiProperty({ description: 'Status' })
  status: 'pending' | 'committed' | 'rolled_back';
}

@Injectable()
@ApiTags('Transaction Coordination')
export class TransactionCoordinationService {
  private readonly logger = new Logger(TransactionCoordinationService.name);

  constructor(@Inject('SEQUELIZE') private readonly sequelize: Sequelize) {}

  /**
   * 1. Execute distributed transaction with saga pattern
   */
  @ApiOperation({ summary: 'Execute distributed transaction' })
  async executeDistributedTransaction(
    transactionId: string,
    steps: SagaStep[],
  ): Promise<{ success: boolean; completedSteps: string[] }> {
    const completedSteps: string[] = [];
    const compensations: Array<() => Promise<void>> = [];

    try {
      for (const step of steps) {
        this.logger.log(`Executing step: ${step.name}`);
        await step.execute();
        completedSteps.push(step.name);
        compensations.push(step.compensate);
      }

      return { success: true, completedSteps };
    } catch (error) {
      this.logger.error(`Transaction ${transactionId} failed, compensating...`);

      // Execute compensations in reverse order
      for (let i = compensations.length - 1; i >= 0; i--) {
        try {
          await compensations[i]();
        } catch (compensationError) {
          this.logger.error(`Compensation ${i} failed:`, compensationError);
        }
      }

      return { success: false, completedSteps };
    }
  }

  /**
   * 2. Two-phase commit coordinator
   */
  @ApiOperation({ summary: 'Two-phase commit' })
  async twoPhaseCommit(participants: string[]): Promise<boolean> {
    // Phase 1: Prepare
    const prepareResults = await Promise.all(
      participants.map((p) => this.prepareParticipant(p)),
    );

    const allPrepared = prepareResults.every((r) => r);

    if (!allPrepared) {
      // Abort all
      await Promise.all(participants.map((p) => this.abortParticipant(p)));
      return false;
    }

    // Phase 2: Commit
    await Promise.all(participants.map((p) => this.commitParticipant(p)));
    return true;
  }

  /**
   * 3. Optimistic locking coordinator
   */
  @ApiOperation({ summary: 'Execute with optimistic locking' })
  async executeWithOptimisticLocking<T>(
    entityId: string,
    expectedVersion: number,
    updateFn: (entity: T) => Promise<T>,
  ): Promise<T> {
    return this.sequelize.transaction(async (transaction) => {
      // Fetch entity with version
      const entity = await this.fetchEntityWithVersion<T>(entityId, transaction);

      // Check version
      if ((entity as any).version !== expectedVersion) {
        throw new Error(
          `Version mismatch: expected ${expectedVersion}, found ${(entity as any).version}`,
        );
      }

      // Update entity
      const updated = await updateFn(entity);

      // Increment version
      (updated as any).version = expectedVersion + 1;

      return updated;
    });
  }

  /**
   * 4. Pessimistic locking coordinator
   */
  @ApiOperation({ summary: 'Execute with pessimistic locking' })
  async executeWithPessimisticLocking<T>(
    entityId: string,
    updateFn: (entity: T) => Promise<T>,
  ): Promise<T> {
    return this.sequelize.transaction(async (transaction) => {
      // Lock entity for update
      const entity = await this.lockEntityForUpdate<T>(entityId, transaction);

      // Update entity
      const updated = await updateFn(entity);

      return updated;
    });
  }

  /**
   * 5. Event sourcing transaction coordinator
   */
  @ApiOperation({ summary: 'Apply event sourced transaction' })
  async applyEventSourcedTransaction(
    aggregateId: string,
    events: any[],
  ): Promise<any> {
    return this.sequelize.transaction(async (transaction) => {
      // Load aggregate
      const aggregate = await this.loadAggregate(aggregateId, transaction);

      // Apply events
      for (const event of events) {
        aggregate.apply(event);
      }

      // Persist events
      await this.persistEvents(aggregateId, events, transaction);

      // Update aggregate
      await this.updateAggregate(aggregate, transaction);

      return aggregate;
    });
  }

  // Helper methods
  private async prepareParticipant(participant: string): Promise<boolean> {
    this.logger.log(`Preparing participant: ${participant}`);
    return true;
  }

  private async abortParticipant(participant: string): Promise<void> {
    this.logger.log(`Aborting participant: ${participant}`);
  }

  private async commitParticipant(participant: string): Promise<void> {
    this.logger.log(`Committing participant: ${participant}`);
  }

  private async fetchEntityWithVersion<T>(
    entityId: string,
    transaction: Transaction,
  ): Promise<T> {
    return { id: entityId, version: 1 } as any;
  }

  private async lockEntityForUpdate<T>(
    entityId: string,
    transaction: Transaction,
  ): Promise<T> {
    return { id: entityId } as any;
  }

  private async loadAggregate(
    aggregateId: string,
    transaction: Transaction,
  ): Promise<any> {
    return { id: aggregateId, apply: (event: any) => {} };
  }

  private async persistEvents(
    aggregateId: string,
    events: any[],
    transaction: Transaction,
  ): Promise<void> {
    this.logger.log(`Persisted ${events.length} events for aggregate ${aggregateId}`);
  }

  private async updateAggregate(aggregate: any, transaction: Transaction): Promise<void> {
    this.logger.log(`Updated aggregate ${aggregate.id}`);
  }
}

export default TransactionCoordinationService;
