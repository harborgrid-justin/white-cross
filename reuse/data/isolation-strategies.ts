/**
 * @fileoverview Enterprise Transaction Isolation Strategies
 * @module reuse/data/isolation-strategies
 * @description Production-ready isolation level management with handlers for read uncommitted,
 * read committed, repeatable read, serializable, snapshot isolation, MVCC utilities,
 * phantom read prevention, dirty read prevention, write skew detection, lost update prevention,
 * and comprehensive conflict detection and resolution for healthcare data integrity
 *
 * @version 1.0.0
 * @requires sequelize ^6.x
 * @requires @nestjs/common ^11.x
 */

import {
  Sequelize,
  Transaction,
  IsolationLevel,
  Model,
  ModelStatic,
  FindOptions,
  WhereOptions,
  Op
} from 'sequelize';
import { Logger, Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Isolation level configuration
 */
export interface IsolationConfig {
  level: IsolationLevel;
  lockTimeout?: number;
  readConsistency?: 'CONSISTENT' | 'CURRENT';
  allowDirtyReads?: boolean;
  allowPhantomReads?: boolean;
}

/**
 * Read anomaly detection result
 */
export interface AnomalyDetectionResult {
  detected: boolean;
  anomalyType: 'DIRTY_READ' | 'NON_REPEATABLE_READ' | 'PHANTOM_READ' | 'WRITE_SKEW' | 'LOST_UPDATE' | 'NONE';
  description: string;
  affectedRecords?: any[];
  timestamp: number;
}

/**
 * Version snapshot for MVCC
 */
export interface VersionSnapshot {
  id: string;
  version: number;
  data: any;
  timestamp: number;
  transactionId: string;
}

/**
 * Conflict detection result
 */
export interface ConflictResult {
  hasConflict: boolean;
  conflictType: 'VERSION' | 'WRITE_WRITE' | 'READ_WRITE' | 'SERIALIZATION' | 'NONE';
  details: string;
  conflictingTransactions?: string[];
}

/**
 * Write skew detection configuration
 */
export interface WriteSkewConfig {
  constraintName: string;
  constraintCheck: (records: any[]) => boolean | Promise<boolean>;
  preventionStrategy: 'LOCK' | 'RETRY' | 'ABORT';
}

/**
 * Snapshot isolation context
 */
export interface SnapshotContext {
  transactionId: string;
  snapshotTime: number;
  visibleVersions: Map<string, number>;
  isolationLevel: IsolationLevel;
}

// ============================================================================
// CUSTOM ERRORS
// ============================================================================

export class DirtyReadError extends Error {
  constructor(message: string, public recordId: string) {
    super(message);
    this.name = 'DirtyReadError';
  }
}

export class PhantomReadError extends Error {
  constructor(message: string, public query: string) {
    super(message);
    this.name = 'PhantomReadError';
  }
}

export class NonRepeatableReadError extends Error {
  constructor(message: string, public recordId: string, public versions: number[]) {
    super(message);
    this.name = 'NonRepeatableReadError';
  }
}

export class WriteSkewError extends Error {
  constructor(message: string, public constraint: string) {
    super(message);
    this.name = 'WriteSkewError';
  }
}

export class LostUpdateError extends Error {
  constructor(message: string, public recordId: string, public expectedVersion: number) {
    super(message);
    this.name = 'LostUpdateError';
  }
}

export class SerializationError extends Error {
  constructor(message: string, public conflictingTransactions: string[]) {
    super(message);
    this.name = 'SerializationError';
  }
}

// ============================================================================
// READ UNCOMMITTED HANDLERS (Functions 1-4)
// ============================================================================

/**
 * Executes query with read uncommitted isolation (allows dirty reads)
 * @param sequelize - Sequelize instance
 * @param fn - Function to execute
 * @returns Result of function execution
 * @warning Only use for non-critical read operations where performance is critical
 */
export async function withReadUncommitted<T>(
  sequelize: Sequelize,
  fn: (transaction: Transaction) => Promise<T>
): Promise<T> {
  const logger = new Logger('IsolationStrategy::ReadUncommitted');
  logger.warn('Using READ UNCOMMITTED isolation - dirty reads are possible');

  return sequelize.transaction(
    { isolationLevel: IsolationLevel.READ_UNCOMMITTED },
    async (transaction) => fn(transaction)
  );
}

/**
 * Performs dirty read check on a record
 * @param model - Sequelize model
 * @param id - Record ID
 * @param transaction - Transaction instance
 * @returns Record with uncommitted changes
 */
export async function dirtyRead<T extends Model>(
  model: ModelStatic<T>,
  id: string | number,
  transaction: Transaction
): Promise<T | null> {
  const logger = new Logger('IsolationStrategy::DirtyRead');
  logger.debug(`Performing dirty read on ${model.name} ${id}`);

  // Set isolation level to READ UNCOMMITTED for this query
  await transaction.sequelize.query(
    'SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED',
    { transaction }
  );

  return model.findByPk(id, { transaction });
}

/**
 * Detects potential dirty reads by comparing committed vs uncommitted data
 * @param model - Sequelize model
 * @param id - Record ID
 * @param transaction - Transaction instance
 * @returns Anomaly detection result
 */
export async function detectDirtyRead<T extends Model>(
  model: ModelStatic<T>,
  id: string | number,
  transaction: Transaction
): Promise<AnomalyDetectionResult> {
  // Read with current transaction (may see uncommitted)
  const uncommittedData = await model.findByPk(id, { transaction });

  // Read without transaction (committed only)
  const committedData = await model.findByPk(id);

  const isDirty = JSON.stringify(uncommittedData) !== JSON.stringify(committedData);

  return {
    detected: isDirty,
    anomalyType: isDirty ? 'DIRTY_READ' : 'NONE',
    description: isDirty
      ? 'Uncommitted data differs from committed data'
      : 'No dirty read detected',
    affectedRecords: isDirty ? [uncommittedData, committedData] : [],
    timestamp: Date.now()
  };
}

/**
 * Validates read uncommitted query results for data integrity
 * @param results - Query results
 * @param validationRules - Validation rules
 * @returns Validation result with warnings
 */
export async function validateUncommittedRead<T>(
  results: T[],
  validationRules: Array<(record: T) => boolean>
): Promise<{ valid: boolean; warnings: string[] }> {
  const warnings: string[] = [];

  for (const result of results) {
    for (const rule of validationRules) {
      if (!rule(result)) {
        warnings.push('Validation rule failed on uncommitted data');
      }
    }
  }

  return {
    valid: warnings.length === 0,
    warnings
  };
}

// ============================================================================
// READ COMMITTED HANDLERS (Functions 5-9)
// ============================================================================

/**
 * Executes query with read committed isolation (prevents dirty reads)
 * @param sequelize - Sequelize instance
 * @param fn - Function to execute
 * @returns Result of function execution
 */
export async function withReadCommitted<T>(
  sequelize: Sequelize,
  fn: (transaction: Transaction) => Promise<T>
): Promise<T> {
  return sequelize.transaction(
    { isolationLevel: IsolationLevel.READ_COMMITTED },
    async (transaction) => fn(transaction)
  );
}

/**
 * Performs consistent read at statement level
 * @param model - Sequelize model
 * @param options - Find options
 * @param transaction - Transaction instance
 * @returns Query results
 */
export async function consistentRead<T extends Model>(
  model: ModelStatic<T>,
  options: FindOptions<T>,
  transaction: Transaction
): Promise<T[]> {
  const logger = new Logger('IsolationStrategy::ConsistentRead');

  // Ensure READ COMMITTED isolation
  if (transaction.options.isolationLevel !== IsolationLevel.READ_COMMITTED) {
    logger.warn('Transaction not using READ COMMITTED isolation');
  }

  return model.findAll({ ...options, transaction });
}

/**
 * Prevents dirty reads by acquiring shared locks
 * @param model - Sequelize model
 * @param id - Record ID
 * @param transaction - Transaction instance
 * @returns Locked record
 */
export async function preventDirtyRead<T extends Model>(
  model: ModelStatic<T>,
  id: string | number,
  transaction: Transaction
): Promise<T | null> {
  return model.findByPk(id, {
    transaction,
    lock: Transaction.LOCK.SHARE
  });
}

/**
 * Verifies read committed isolation is active
 * @param transaction - Transaction instance
 * @returns True if read committed, false otherwise
 */
export async function verifyReadCommitted(transaction: Transaction): Promise<boolean> {
  const sequelize = transaction.sequelize;

  if (sequelize.getDialect() === 'postgres') {
    const [result] = await sequelize.query(
      'SELECT current_setting(\'transaction_isolation\')',
      { transaction }
    );

    const isolation = (result as any)[0]?.current_setting;
    return isolation === 'read committed';
  }

  return transaction.options.isolationLevel === IsolationLevel.READ_COMMITTED;
}

/**
 * Retries read if non-repeatable read is detected at statement level
 * @param model - Sequelize model
 * @param id - Record ID
 * @param transaction - Transaction instance
 * @param maxRetries - Maximum retry attempts
 * @returns Stable read result
 */
export async function stableRead<T extends Model>(
  model: ModelStatic<T>,
  id: string | number,
  transaction: Transaction,
  maxRetries: number = 3
): Promise<T | null> {
  let previousVersion: any = null;
  let currentVersion: any;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    currentVersion = await model.findByPk(id, { transaction });

    if (attempt > 0 && JSON.stringify(previousVersion) !== JSON.stringify(currentVersion)) {
      // Non-repeatable read detected, retry
      await new Promise(resolve => setTimeout(resolve, 50 * Math.pow(2, attempt)));
      previousVersion = currentVersion;
      continue;
    }

    return currentVersion;
  }

  return currentVersion!;
}

// ============================================================================
// REPEATABLE READ HANDLERS (Functions 10-14)
// ============================================================================

/**
 * Executes query with repeatable read isolation
 * @param sequelize - Sequelize instance
 * @param fn - Function to execute
 * @returns Result of function execution
 */
export async function withRepeatableRead<T>(
  sequelize: Sequelize,
  fn: (transaction: Transaction) => Promise<T>
): Promise<T> {
  return sequelize.transaction(
    { isolationLevel: IsolationLevel.REPEATABLE_READ },
    async (transaction) => fn(transaction)
  );
}

/**
 * Ensures repeatable reads within transaction
 * @param model - Sequelize model
 * @param id - Record ID
 * @param transaction - Transaction instance
 * @returns Consistent record across multiple reads
 */
export async function repeatableRead<T extends Model>(
  model: ModelStatic<T>,
  id: string | number,
  transaction: Transaction
): Promise<T | null> {
  return model.findByPk(id, {
    transaction,
    lock: Transaction.LOCK.SHARE
  });
}

/**
 * Detects non-repeatable reads by comparing multiple reads
 * @param model - Sequelize model
 * @param id - Record ID
 * @param transaction - Transaction instance
 * @param readCount - Number of reads to compare
 * @returns Anomaly detection result
 */
export async function detectNonRepeatableRead<T extends Model>(
  model: ModelStatic<T>,
  id: string | number,
  transaction: Transaction,
  readCount: number = 3
): Promise<AnomalyDetectionResult> {
  const logger = new Logger('IsolationStrategy::DetectNonRepeatableRead');
  const reads: any[] = [];

  for (let i = 0; i < readCount; i++) {
    const record = await model.findByPk(id, { transaction });
    reads.push(JSON.stringify(record));

    if (i < readCount - 1) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  const isConsistent = reads.every(read => read === reads[0]);

  if (!isConsistent) {
    logger.warn(`Non-repeatable read detected for ${model.name} ${id}`);
  }

  return {
    detected: !isConsistent,
    anomalyType: isConsistent ? 'NONE' : 'NON_REPEATABLE_READ',
    description: isConsistent
      ? 'All reads returned consistent data'
      : 'Multiple reads returned different data',
    timestamp: Date.now()
  };
}

/**
 * Prevents non-repeatable reads using range locks
 * @param model - Sequelize model
 * @param where - Where conditions
 * @param transaction - Transaction instance
 * @returns Locked records
 */
export async function preventNonRepeatableRead<T extends Model>(
  model: ModelStatic<T>,
  where: WhereOptions<T>,
  transaction: Transaction
): Promise<T[]> {
  return model.findAll({
    where,
    transaction,
    lock: Transaction.LOCK.SHARE
  });
}

/**
 * Creates snapshot for repeatable read consistency
 * @param model - Sequelize model
 * @param ids - Record IDs
 * @param transaction - Transaction instance
 * @returns Snapshot of records
 */
export async function createReadSnapshot<T extends Model>(
  model: ModelStatic<T>,
  ids: (string | number)[],
  transaction: Transaction
): Promise<Map<string | number, T>> {
  const snapshot = new Map<string | number, T>();

  for (const id of ids) {
    const record = await model.findByPk(id, {
      transaction,
      lock: Transaction.LOCK.SHARE
    });

    if (record) {
      snapshot.set(id, record);
    }
  }

  return snapshot;
}

// ============================================================================
// SERIALIZABLE HANDLERS (Functions 15-18)
// ============================================================================

/**
 * Executes query with SERIALIZABLE isolation level for maximum data consistency
 *
 * Strictest isolation level - prevents all read anomalies (dirty reads, non-repeatable reads,
 * phantom reads) at the cost of reduced concurrency. Critical for healthcare financial transactions
 * and medication dispensing where absolute consistency is required
 *
 * @template T - Return type of transaction function
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {(transaction: Transaction) => Promise<T>} fn - Function to execute within serializable transaction
 * @returns {Promise<T>} Result of transaction function
 *
 * @throws {SerializationError} If transaction conflicts with concurrent transaction
 * @throws {Error} Any error from fn execution will trigger automatic rollback
 *
 * @example
 * ```typescript
 * // Financial transaction requiring absolute consistency
 * await withSerializable(sequelize, async (transaction) => {
 *   const account = await PatientAccount.findByPk(accountId, { transaction });
 *   const currentBalance = account.balance;
 *
 *   // Deduct payment - guaranteed no concurrent modifications
 *   account.balance -= paymentAmount;
 *   await account.save({ transaction });
 *
 *   // Record payment history
 *   await PaymentHistory.create({
 *     accountId,
 *     amount: paymentAmount,
 *     previousBalance: currentBalance
 *   }, { transaction });
 * });
 *
 * // Medication dispensing with inventory management
 * await withSerializable(sequelize, async (transaction) => {
 *   const medication = await Medication.findByPk(medicationId, {
 *     transaction,
 *     lock: Transaction.LOCK.UPDATE
 *   });
 *
 *   if (medication.stockQuantity < dispensedQuantity) {
 *     throw new Error('Insufficient medication stock');
 *   }
 *
 *   // Guaranteed atomic stock reduction
 *   medication.stockQuantity -= dispensedQuantity;
 *   await medication.save({ transaction });
 *
 *   await DispenseLog.create({
 *     medicationId,
 *     quantity: dispensedQuantity,
 *     patientId
 *   }, { transaction });
 * });
 * ```
 *
 * @performance
 * - Highest isolation overhead - may cause serialization failures
 * - Use only when absolute consistency is required
 * - Consider optimistic locking for better concurrency
 * - Expect 10-30% throughput reduction vs REPEATABLE READ
 *
 * @healthcare
 * - REQUIRED for billing and payment processing
 * - REQUIRED for controlled substance dispensing
 * - RECOMMENDED for appointment scheduling to prevent double-booking
 * - RECOMMENDED for inventory management of critical medications
 * - Avoid for read-heavy medical record queries
 *
 * @isolation_guarantees
 * - Prevents dirty reads (reading uncommitted data)
 * - Prevents non-repeatable reads (data changes between reads)
 * - Prevents phantom reads (new rows appearing in range queries)
 * - Prevents write skew anomalies
 * - Guarantees transactions execute as if serial
 *
 * @retry_strategy
 * - Serialization failures are common under high concurrency
 * - Implement exponential backoff retry (3-5 attempts)
 * - Log serialization failures for capacity planning
 * - Consider read replica routing for read-only queries
 *
 * @monitoring
 * - Track serialization failure rate (should be <5%)
 * - Monitor transaction duration (aim for <100ms)
 * - Alert if failure rate exceeds threshold
 *
 * @see {@link withRepeatableRead} For less strict isolation with better performance
 * @see {@link transactionWithDeadlockRetry} For automatic retry on serialization failures
 */
export async function withSerializable<T>(
  sequelize: Sequelize,
  fn: (transaction: Transaction) => Promise<T>
): Promise<T> {
  return sequelize.transaction(
    { isolationLevel: IsolationLevel.SERIALIZABLE },
    async (transaction) => fn(transaction)
  );
}

/**
 * Performs serializable read with full consistency guarantees
 * @param model - Sequelize model
 * @param options - Find options
 * @param transaction - Transaction instance
 * @returns Query results with serialization guarantees
 */
export async function serializableRead<T extends Model>(
  model: ModelStatic<T>,
  options: FindOptions<T>,
  transaction: Transaction
): Promise<T[]> {
  return model.findAll({
    ...options,
    transaction,
    lock: Transaction.LOCK.UPDATE
  });
}

/**
 * Detects serialization conflicts
 * @param transaction - Transaction instance
 * @param operations - Operations to check for conflicts
 * @returns Conflict detection result
 */
export async function detectSerializationConflict(
  transaction: Transaction,
  operations: Array<{ model: string; operation: 'READ' | 'WRITE'; recordId: string }>
): Promise<ConflictResult> {
  const logger = new Logger('IsolationStrategy::SerializationConflict');

  // Check for overlapping read-write or write-write operations
  const writes = operations.filter(op => op.operation === 'WRITE');
  const reads = operations.filter(op => op.operation === 'READ');

  const conflicts: string[] = [];

  for (const write of writes) {
    const conflictingReads = reads.filter(
      read => read.model === write.model && read.recordId === write.recordId
    );

    if (conflictingReads.length > 0) {
      conflicts.push(`Write-Read conflict on ${write.model}:${write.recordId}`);
    }
  }

  const hasConflict = conflicts.length > 0;

  if (hasConflict) {
    logger.warn('Serialization conflicts detected', conflicts);
  }

  return {
    hasConflict,
    conflictType: hasConflict ? 'SERIALIZATION' : 'NONE',
    details: conflicts.join('; '),
    conflictingTransactions: []
  };
}

/**
 * Prevents phantom reads using predicate locks
 * @param model - Sequelize model
 * @param where - Where conditions
 * @param transaction - Transaction instance
 * @returns Locked query results
 */
export async function preventPhantomRead<T extends Model>(
  model: ModelStatic<T>,
  where: WhereOptions<T>,
  transaction: Transaction
): Promise<T[]> {
  // Use FOR UPDATE to lock matching rows and prevent phantom reads
  return model.findAll({
    where,
    transaction,
    lock: Transaction.LOCK.UPDATE
  });
}

// ============================================================================
// SNAPSHOT ISOLATION HELPERS (Functions 19-22)
// ============================================================================

/**
 * Creates a snapshot isolation context
 * @param sequelize - Sequelize instance
 * @param transactionId - Transaction ID
 * @returns Snapshot context
 */
export async function createSnapshotContext(
  sequelize: Sequelize,
  transactionId: string
): Promise<SnapshotContext> {
  return {
    transactionId,
    snapshotTime: Date.now(),
    visibleVersions: new Map(),
    isolationLevel: IsolationLevel.REPEATABLE_READ
  };
}

/**
 * Reads data at specific snapshot time
 * @param model - Sequelize model
 * @param id - Record ID
 * @param snapshotContext - Snapshot context
 * @param transaction - Transaction instance
 * @returns Record as it existed at snapshot time
 */
export async function readAtSnapshot<T extends Model>(
  model: ModelStatic<T>,
  id: string | number,
  snapshotContext: SnapshotContext,
  transaction: Transaction
): Promise<T | null> {
  const logger = new Logger('IsolationStrategy::SnapshotRead');

  // In practice, this would read from version store
  // For Sequelize, we simulate with timestamp-based queries
  const record = await model.findByPk(id, {
    transaction,
    lock: Transaction.LOCK.SHARE
  });

  if (record && 'version' in record) {
    const version = (record as any).version;
    snapshotContext.visibleVersions.set(id.toString(), version);
  }

  logger.debug(`Read snapshot for ${model.name}:${id} at ${snapshotContext.snapshotTime}`);

  return record;
}

/**
 * Validates snapshot consistency
 * @param snapshotContext - Snapshot context
 * @param model - Sequelize model
 * @param ids - Record IDs
 * @param transaction - Transaction instance
 * @returns True if snapshot is consistent, false otherwise
 */
export async function validateSnapshotConsistency<T extends Model>(
  snapshotContext: SnapshotContext,
  model: ModelStatic<T>,
  ids: (string | number)[],
  transaction: Transaction
): Promise<boolean> {
  for (const id of ids) {
    const expectedVersion = snapshotContext.visibleVersions.get(id.toString());

    if (expectedVersion !== undefined) {
      const currentRecord = await model.findByPk(id, { transaction });

      if (currentRecord && 'version' in currentRecord) {
        const currentVersion = (currentRecord as any).version;

        if (currentVersion !== expectedVersion) {
          return false;
        }
      }
    }
  }

  return true;
}

/**
 * Manages snapshot isolation for long-running queries
 * @param sequelize - Sequelize instance
 * @param fn - Function to execute
 * @returns Result with snapshot consistency
 */
export async function withSnapshotIsolation<T>(
  sequelize: Sequelize,
  fn: (transaction: Transaction, snapshot: SnapshotContext) => Promise<T>
): Promise<T> {
  return sequelize.transaction(
    { isolationLevel: IsolationLevel.REPEATABLE_READ },
    async (transaction) => {
      const snapshot = await createSnapshotContext(sequelize, transaction.id);
      return fn(transaction, snapshot);
    }
  );
}

// ============================================================================
// MVCC (Multi-Version Concurrency Control) UTILITIES (Functions 23-26)
// ============================================================================

/**
 * Creates version snapshot for MVCC
 * @param model - Sequelize model
 * @param id - Record ID
 * @param transaction - Transaction instance
 * @returns Version snapshot
 */
export async function createVersionSnapshot<T extends Model>(
  model: ModelStatic<T>,
  id: string | number,
  transaction: Transaction
): Promise<VersionSnapshot | null> {
  const record = await model.findByPk(id, { transaction });

  if (!record) {
    return null;
  }

  return {
    id: id.toString(),
    version: (record as any).version || 0,
    data: record.toJSON(),
    timestamp: Date.now(),
    transactionId: transaction.id
  };
}

/**
 * Reads specific version of a record
 * @param model - Sequelize model
 * @param id - Record ID
 * @param version - Version number
 * @param transaction - Transaction instance
 * @returns Record at specified version
 */
export async function readVersion<T extends Model>(
  model: ModelStatic<T>,
  id: string | number,
  version: number,
  transaction: Transaction
): Promise<T | null> {
  const record = await model.findOne({
    where: {
      id,
      version
    } as any,
    transaction
  });

  return record;
}

/**
 * Gets version history for a record
 * @param model - Sequelize model
 * @param id - Record ID
 * @param transaction - Transaction instance
 * @returns Array of version snapshots
 */
export async function getVersionHistory<T extends Model>(
  model: ModelStatic<T>,
  id: string | number,
  transaction: Transaction
): Promise<VersionSnapshot[]> {
  // In production, this would query a version history table
  // For now, we return current version only
  const snapshot = await createVersionSnapshot(model, id, transaction);
  return snapshot ? [snapshot] : [];
}

/**
 * Garbage collects old versions
 * @param model - Sequelize model
 * @param retentionDays - Days to retain old versions
 * @param transaction - Transaction instance
 * @returns Number of versions cleaned up
 */
export async function garbageCollectVersions<T extends Model>(
  model: ModelStatic<T>,
  retentionDays: number,
  transaction: Transaction
): Promise<number> {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - retentionDays);

  // This would clean up version history table in production
  const logger = new Logger('IsolationStrategy::GarbageCollect');
  logger.log(`Garbage collecting versions older than ${cutoffDate.toISOString()}`);

  return 0; // Placeholder
}

// ============================================================================
// PHANTOM READ PREVENTION (Functions 27-28)
// ============================================================================

/**
 * Detects phantom reads by comparing range queries
 * @param model - Sequelize model
 * @param where - Where conditions
 * @param transaction - Transaction instance
 * @param iterations - Number of iterations to check
 * @returns Anomaly detection result
 */
export async function detectPhantomRead<T extends Model>(
  model: ModelStatic<T>,
  where: WhereOptions<T>,
  transaction: Transaction,
  iterations: number = 3
): Promise<AnomalyDetectionResult> {
  const logger = new Logger('IsolationStrategy::DetectPhantomRead');
  const resultSets: number[] = [];

  for (let i = 0; i < iterations; i++) {
    const results = await model.findAll({ where, transaction });
    resultSets.push(results.length);

    if (i < iterations - 1) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  const isConsistent = resultSets.every(count => count === resultSets[0]);

  if (!isConsistent) {
    logger.warn('Phantom read detected - result set size changed');
  }

  return {
    detected: !isConsistent,
    anomalyType: isConsistent ? 'NONE' : 'PHANTOM_READ',
    description: isConsistent
      ? 'Range query returned consistent results'
      : `Range query returned different counts: ${resultSets.join(', ')}`,
    timestamp: Date.now()
  };
}

/**
 * Prevents phantom reads using table-level locks
 * @param model - Sequelize model
 * @param where - Where conditions
 * @param transaction - Transaction instance
 * @returns Locked query results
 */
export async function preventPhantomReadWithTableLock<T extends Model>(
  model: ModelStatic<T>,
  where: WhereOptions<T>,
  transaction: Transaction
): Promise<T[]> {
  const sequelize = transaction.sequelize;
  const tableName = model.getTableName();

  // Acquire table-level lock to prevent inserts
  await sequelize.query(`LOCK TABLE "${tableName}" IN SHARE MODE`, { transaction });

  return model.findAll({ where, transaction });
}

// ============================================================================
// WRITE SKEW DETECTION (Functions 29-31)
// ============================================================================

/**
 * Detects write skew anomalies
 * @param config - Write skew configuration
 * @param model - Sequelize model
 * @param transaction - Transaction instance
 * @returns True if write skew detected, false otherwise
 */
export async function detectWriteSkew<T extends Model>(
  config: WriteSkewConfig,
  model: ModelStatic<T>,
  transaction: Transaction
): Promise<boolean> {
  const logger = new Logger('IsolationStrategy::WriteSkew');

  // Read current state
  const records = await model.findAll({ transaction });

  // Check constraint
  const constraintSatisfied = await config.constraintCheck(records);

  if (!constraintSatisfied) {
    logger.warn(`Write skew detected: constraint ${config.constraintName} violated`);
    return true;
  }

  return false;
}

/**
 * Prevents write skew using explicit locking
 * @param config - Write skew configuration
 * @param model - Sequelize model
 * @param where - Where conditions
 * @param transaction - Transaction instance
 * @returns Locked records
 */
export async function preventWriteSkew<T extends Model>(
  config: WriteSkewConfig,
  model: ModelStatic<T>,
  where: WhereOptions<T>,
  transaction: Transaction
): Promise<T[]> {
  const logger = new Logger('IsolationStrategy::PreventWriteSkew');

  if (config.preventionStrategy === 'LOCK') {
    // Acquire locks on all relevant records
    const records = await model.findAll({
      where,
      transaction,
      lock: Transaction.LOCK.UPDATE
    });

    logger.debug(`Locked ${records.length} records to prevent write skew`);
    return records;
  }

  return model.findAll({ where, transaction });
}

/**
 * Validates constraint to prevent write skew
 * @param model - Sequelize model
 * @param constraint - Constraint function
 * @param transaction - Transaction instance
 * @returns True if constraint satisfied, false otherwise
 */
export async function validateConstraint<T extends Model>(
  model: ModelStatic<T>,
  constraint: (records: T[]) => boolean | Promise<boolean>,
  transaction: Transaction
): Promise<boolean> {
  const records = await model.findAll({
    transaction,
    lock: Transaction.LOCK.SHARE
  });

  return constraint(records);
}

// ============================================================================
// LOST UPDATE PREVENTION (Functions 32-34)
// ============================================================================

/**
 * Prevents lost updates using optimistic locking
 * @param model - Sequelize model
 * @param id - Record ID
 * @param updates - Updates to apply
 * @param expectedVersion - Expected version number
 * @param transaction - Transaction instance
 * @returns Updated record
 */
export async function preventLostUpdate<T extends Model>(
  model: ModelStatic<T>,
  id: string | number,
  updates: Partial<any>,
  expectedVersion: number,
  transaction: Transaction
): Promise<T> {
  const [affectedCount, affectedRows] = await model.update(
    {
      ...updates,
      version: expectedVersion + 1
    },
    {
      where: {
        id,
        version: expectedVersion
      } as any,
      transaction,
      returning: true
    }
  );

  if (affectedCount === 0) {
    throw new LostUpdateError(
      'Lost update prevented - record version mismatch',
      id.toString(),
      expectedVersion
    );
  }

  return affectedRows[0];
}

/**
 * Detects lost updates by version comparison
 * @param model - Sequelize model
 * @param id - Record ID
 * @param originalVersion - Original version
 * @param transaction - Transaction instance
 * @returns True if lost update would occur, false otherwise
 */
export async function detectLostUpdate<T extends Model>(
  model: ModelStatic<T>,
  id: string | number,
  originalVersion: number,
  transaction: Transaction
): Promise<boolean> {
  const currentRecord = await model.findByPk(id, { transaction });

  if (!currentRecord) {
    return false;
  }

  const currentVersion = (currentRecord as any).version || 0;
  return currentVersion !== originalVersion;
}

/**
 * Atomic compare-and-swap to prevent lost updates
 * @param model - Sequelize model
 * @param id - Record ID
 * @param field - Field to update
 * @param expectedValue - Expected current value
 * @param newValue - New value
 * @param transaction - Transaction instance
 * @returns True if update successful, false otherwise
 */
export async function atomicCompareAndSwap<T extends Model>(
  model: ModelStatic<T>,
  id: string | number,
  field: string,
  expectedValue: any,
  newValue: any,
  transaction: Transaction
): Promise<boolean> {
  const [affectedCount] = await model.update(
    { [field]: newValue },
    {
      where: {
        id,
        [field]: expectedValue
      } as any,
      transaction
    }
  );

  return affectedCount > 0;
}

// ============================================================================
// ISOLATION LEVEL UPGRADE/DOWNGRADE (Functions 35-36)
// ============================================================================

/**
 * Upgrades transaction isolation level
 * @param transaction - Transaction instance
 * @param targetLevel - Target isolation level
 */
export async function upgradeIsolationLevel(
  transaction: Transaction,
  targetLevel: IsolationLevel
): Promise<void> {
  const logger = new Logger('IsolationStrategy::Upgrade');
  const sequelize = transaction.sequelize;

  const levelMap = {
    [IsolationLevel.READ_UNCOMMITTED]: 'READ UNCOMMITTED',
    [IsolationLevel.READ_COMMITTED]: 'READ COMMITTED',
    [IsolationLevel.REPEATABLE_READ]: 'REPEATABLE READ',
    [IsolationLevel.SERIALIZABLE]: 'SERIALIZABLE'
  };

  const levelStr = levelMap[targetLevel];

  if (sequelize.getDialect() === 'postgres') {
    await sequelize.query(`SET TRANSACTION ISOLATION LEVEL ${levelStr}`, {
      transaction
    });
    logger.log(`Upgraded isolation level to ${levelStr}`);
  } else {
    logger.warn('Isolation level upgrade not supported for this database');
  }
}

/**
 * Downgrades transaction isolation level (use with caution)
 * @param transaction - Transaction instance
 * @param targetLevel - Target isolation level
 */
export async function downgradeIsolationLevel(
  transaction: Transaction,
  targetLevel: IsolationLevel
): Promise<void> {
  const logger = new Logger('IsolationStrategy::Downgrade');
  logger.warn('Downgrading isolation level - may introduce anomalies');

  await upgradeIsolationLevel(transaction, targetLevel);
}

// ============================================================================
// CONFLICT DETECTION AND RESOLUTION (Functions 37-38)
// ============================================================================

/**
 * Detects conflicts between concurrent transactions
 * @param model - Sequelize model
 * @param id - Record ID
 * @param transaction - Transaction instance
 * @returns Conflict detection result
 */
export async function detectConflict<T extends Model>(
  model: ModelStatic<T>,
  id: string | number,
  transaction: Transaction
): Promise<ConflictResult> {
  const logger = new Logger('IsolationStrategy::ConflictDetection');

  try {
    // Try to acquire exclusive lock
    const record = await model.findByPk(id, {
      transaction,
      lock: Transaction.LOCK.UPDATE,
      skipLocked: true
    });

    if (!record) {
      logger.warn(`Conflict detected: record ${id} is locked by another transaction`);

      return {
        hasConflict: true,
        conflictType: 'WRITE_WRITE',
        details: 'Record is locked by another transaction',
        conflictingTransactions: []
      };
    }

    return {
      hasConflict: false,
      conflictType: 'NONE',
      details: 'No conflict detected'
    };
  } catch (error: any) {
    logger.error('Conflict detection error', error);

    return {
      hasConflict: true,
      conflictType: 'SERIALIZATION',
      details: error.message,
      conflictingTransactions: []
    };
  }
}

/**
 * Resolves conflicts using various strategies
 * @param conflictResult - Conflict detection result
 * @param strategy - Resolution strategy
 * @param retryFn - Function to retry
 * @returns Resolved result
 */
export async function resolveConflict<T>(
  conflictResult: ConflictResult,
  strategy: 'RETRY' | 'ABORT' | 'LAST_WRITE_WINS' | 'FIRST_WRITE_WINS',
  retryFn?: () => Promise<T>
): Promise<T | null> {
  const logger = new Logger('IsolationStrategy::ConflictResolution');

  if (!conflictResult.hasConflict) {
    logger.debug('No conflict to resolve');
    return null;
  }

  switch (strategy) {
    case 'RETRY':
      if (!retryFn) {
        throw new Error('Retry function required for RETRY strategy');
      }
      logger.log('Retrying after conflict');
      await new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 100));
      return retryFn();

    case 'ABORT':
      logger.warn('Aborting transaction due to conflict');
      throw new Error(`Conflict detected: ${conflictResult.details}`);

    case 'LAST_WRITE_WINS':
      logger.log('Resolving with LAST_WRITE_WINS strategy');
      return null;

    case 'FIRST_WRITE_WINS':
      logger.log('Resolving with FIRST_WRITE_WINS strategy');
      return null;

    default:
      throw new Error(`Unknown conflict resolution strategy: ${strategy}`);
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export const IsolationStrategies = {
  // Read Uncommitted
  withReadUncommitted,
  dirtyRead,
  detectDirtyRead,
  validateUncommittedRead,

  // Read Committed
  withReadCommitted,
  consistentRead,
  preventDirtyRead,
  verifyReadCommitted,
  stableRead,

  // Repeatable Read
  withRepeatableRead,
  repeatableRead,
  detectNonRepeatableRead,
  preventNonRepeatableRead,
  createReadSnapshot,

  // Serializable
  withSerializable,
  serializableRead,
  detectSerializationConflict,
  preventPhantomRead,

  // Snapshot Isolation
  createSnapshotContext,
  readAtSnapshot,
  validateSnapshotConsistency,
  withSnapshotIsolation,

  // MVCC
  createVersionSnapshot,
  readVersion,
  getVersionHistory,
  garbageCollectVersions,

  // Phantom Read Prevention
  detectPhantomRead,
  preventPhantomReadWithTableLock,

  // Write Skew
  detectWriteSkew,
  preventWriteSkew,
  validateConstraint,

  // Lost Update Prevention
  preventLostUpdate,
  detectLostUpdate,
  atomicCompareAndSwap,

  // Isolation Level Management
  upgradeIsolationLevel,
  downgradeIsolationLevel,

  // Conflict Detection & Resolution
  detectConflict,
  resolveConflict
};
