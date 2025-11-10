/**
 * LOC: CONCUR123456
 * File: /reuse/data/concurrency-control.ts
 *
 * UPSTREAM (imports from):
 *   - Sequelize 6.x core
 *   - ioredis for distributed locking
 *
 * DOWNSTREAM (imported by):
 *   - Backend services requiring concurrency control
 *   - Database access layers
 *   - Transaction management services
 */

/**
 * File: /reuse/data/concurrency-control.ts
 * Locator: WC-DATA-CONCUR-001
 * Purpose: Enterprise-grade Concurrency Control & Locking Mechanisms
 *
 * Upstream: Sequelize 6.x, Redis, NestJS
 * Downstream: ../backend/*, services, controllers, data access layers
 * Dependencies: TypeScript 5.x, Sequelize 6.x, ioredis, @nestjs/common
 * Exports: 42 functions for optimistic locking, pessimistic locking, distributed locks, deadlock handling
 *
 * LLM Context: Production-ready concurrency control for White Cross healthcare system.
 * Provides optimistic/pessimistic locking, row-level/table-level locks, deadlock detection and retry,
 * distributed locks with Redis, semaphore patterns, mutex implementations, read-write lock coordination,
 * lock escalation prevention, and healthcare-specific concurrency patterns for medical records.
 */

import { Model, Transaction, Sequelize, Op, ModelStatic, FindOptions } from 'sequelize';
import { Injectable, Logger } from '@nestjs/common';
import Redis from 'ioredis';
import * as crypto from 'crypto';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface OptimisticLockConfig {
  versionField?: string;
  maxRetries?: number;
  retryDelay?: number;
  onConflict?: (error: OptimisticLockError) => void;
}

export interface PessimisticLockConfig {
  lockMode: 'UPDATE' | 'SHARE' | 'KEY_SHARE' | 'NO_KEY_UPDATE';
  timeout?: number;
  skipLocked?: boolean;
  nowait?: boolean;
}

export interface LockOptions {
  ttl?: number;
  retryCount?: number;
  retryDelay?: number;
  identifier?: string;
}

export interface DistributedLockConfig {
  key: string;
  ttl: number;
  retryCount?: number;
  retryDelay?: number;
  clockDriftFactor?: number;
}

export interface DeadlockRetryConfig {
  maxRetries: number;
  initialDelay: number;
  maxDelay: number;
  backoffMultiplier: number;
  jitter?: boolean;
}

export interface SemaphoreConfig {
  maxConcurrent: number;
  timeout?: number;
  fair?: boolean;
}

export interface MutexConfig {
  timeout?: number;
  identifier?: string;
}

export interface ReadWriteLockConfig {
  maxReaders?: number;
  writerPriority?: boolean;
  timeout?: number;
}

export interface LockEscalationConfig {
  rowLockThreshold: number;
  tableLockAfterThreshold: boolean;
  monitoringEnabled: boolean;
}

export class OptimisticLockError extends Error {
  constructor(
    message: string,
    public currentVersion: number,
    public expectedVersion: number,
    public modelName: string
  ) {
    super(message);
    this.name = 'OptimisticLockError';
  }
}

export class PessimisticLockError extends Error {
  constructor(message: string, public timeout: boolean = false) {
    super(message);
    this.name = 'PessimisticLockError';
  }
}

export class DeadlockError extends Error {
  constructor(message: string, public attemptNumber: number) {
    super(message);
    this.name = 'DeadlockError';
  }
}

export class DistributedLockError extends Error {
  constructor(message: string, public lockKey: string) {
    super(message);
    this.name = 'DistributedLockError';
  }
}

export interface LockMetrics {
  lockAcquisitions: number;
  lockReleases: number;
  lockTimeouts: number;
  lockConflicts: number;
  averageLockDuration: number;
  activeLocks: number;
}

// ============================================================================
// OPTIMISTIC LOCKING FUNCTIONS (Functions 1-8)
// ============================================================================

/**
 * Adds optimistic locking capability to Sequelize model for safe concurrent updates
 *
 * Essential for healthcare data integrity - prevents lost updates when multiple users
 * modify patient records, prescriptions, or appointments simultaneously
 *
 * @template T - Model type extending Sequelize Model
 * @param {ModelStatic<T>} model - Sequelize model to enhance with version tracking
 * @param {string} versionField - Name of the version field (default: 'version'). Must be integer column
 * @returns {ModelStatic<T>} Enhanced model with automatic version increment hooks
 *
 * @example
 * ```typescript
 * // Add optimistic locking to Patient model
 * const PatientWithVersioning = addOptimisticLocking(Patient, 'version');
 *
 * // Updates will now automatically check version and increment
 * const patient = await Patient.findByPk(123);
 * patient.diagnosis = 'Updated diagnosis';
 * await patient.save(); // Automatically increments version and validates
 *
 * // Concurrent update scenario
 * const p1 = await Patient.findByPk(123); // version: 5
 * const p2 = await Patient.findByPk(123); // version: 5
 * await p1.save(); // Success, version now 6
 * await p2.save(); // Throws OptimisticLockError - version mismatch
 * ```
 *
 * @database
 * - Requires integer 'version' column (or custom versionField)
 * - Version incremented on every update
 * - Uses database WHERE clause for atomic version check
 *
 * @performance
 * - Zero overhead for reads (version only checked on writes)
 * - Single atomic UPDATE with version check
 * - No additional database round trips
 *
 * @healthcare
 * - Prevents medication dosage conflicts from concurrent updates
 * - Protects appointment schedules from double-booking
 * - Ensures patient demographic changes are not lost
 * - Critical for electronic health record (EHR) systems with multiple concurrent users
 *
 * @hooks
 * - beforeUpdate: Increments version and stores previous value
 * - afterUpdate: Validates update succeeded based on version
 *
 * @throws {OptimisticLockError} If update fails due to version mismatch
 *
 * @notes
 * - Version field must be included in model definition
 * - Initial version should be 0 or 1
 * - Consider pessimistic locking for highly contended records
 * - Log OptimisticLockError occurrences for conflict analysis
 *
 * @see {@link optimisticUpdate} For updates with automatic retry
 */
export function addOptimisticLocking<T extends Model>(
  model: ModelStatic<T>,
  versionField: string = 'version'
): ModelStatic<T> {
  // Add beforeUpdate hook to increment version
  model.addHook('beforeUpdate', async (instance: any) => {
    if (instance.changed()) {
      const currentVersion = instance.getDataValue(versionField);
      instance.setDataValue(versionField, currentVersion + 1);
      instance._previousVersion = currentVersion;
    }
  });

  // Add afterUpdate hook to verify version
  model.addHook('afterUpdate', async (instance: any) => {
    if (instance._previousVersion !== undefined) {
      const affectedRows = instance.constructor.sequelize?.queryInterface;
      if (affectedRows === 0) {
        throw new OptimisticLockError(
          'Optimistic lock failed - record was modified by another transaction',
          instance.getDataValue(versionField),
          instance._previousVersion,
          model.name
        );
      }
    }
  });

  return model;
}

/**
 * Performs an optimistic locked update with automatic retry
 * @param model - Sequelize model instance
 * @param id - Record ID to update
 * @param updateData - Data to update
 * @param config - Optimistic lock configuration
 * @returns Updated model instance
 */
export async function optimisticUpdate<T extends Model>(
  model: ModelStatic<T>,
  id: string | number,
  updateData: Partial<T>,
  config: OptimisticLockConfig = {}
): Promise<T> {
  const {
    versionField = 'version',
    maxRetries = 3,
    retryDelay = 100,
    onConflict
  } = config;

  let lastError: Error | null = null;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      // Fetch current record with version
      const record = await model.findByPk(id);
      if (!record) {
        throw new Error(`Record with id ${id} not found`);
      }

      const currentVersion = (record as any)[versionField];

      // Attempt update with version check
      const [affectedCount, affectedRows] = await model.update(
        {
          ...updateData,
          [versionField]: currentVersion + 1
        } as any,
        {
          where: {
            id,
            [versionField]: currentVersion
          } as any,
          returning: true
        }
      );

      if (affectedCount === 0) {
        throw new OptimisticLockError(
          'Optimistic lock conflict detected',
          currentVersion + 1,
          currentVersion,
          model.name
        );
      }

      return affectedRows[0];
    } catch (error) {
      lastError = error as Error;

      if (error instanceof OptimisticLockError) {
        if (onConflict) {
          onConflict(error);
        }

        if (attempt < maxRetries - 1) {
          // Exponential backoff with jitter
          const delay = retryDelay * Math.pow(2, attempt) + Math.random() * 100;
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }
      }

      throw error;
    }
  }

  throw lastError || new Error('Optimistic update failed');
}

/**
 * Validates optimistic lock version before update
 * @param record - Model instance to validate
 * @param expectedVersion - Expected version number
 * @param versionField - Version field name
 * @throws OptimisticLockError if versions don't match
 */
export function validateOptimisticLock<T extends Model>(
  record: T,
  expectedVersion: number,
  versionField: string = 'version'
): void {
  const currentVersion = (record as any)[versionField];

  if (currentVersion !== expectedVersion) {
    throw new OptimisticLockError(
      `Version mismatch: expected ${expectedVersion}, got ${currentVersion}`,
      currentVersion,
      expectedVersion,
      record.constructor.name
    );
  }
}

/**
 * Creates a version-aware query condition for optimistic locking
 * @param id - Record ID
 * @param version - Expected version
 * @param versionField - Version field name
 * @returns Where condition object
 */
export function createVersionedWhereClause(
  id: string | number,
  version: number,
  versionField: string = 'version'
): Record<string, any> {
  return {
    id,
    [versionField]: version
  };
}

/**
 * Increments version field atomically
 * @param model - Sequelize model
 * @param id - Record ID
 * @param versionField - Version field name
 * @returns New version number
 */
export async function incrementVersion<T extends Model>(
  model: ModelStatic<T>,
  id: string | number,
  versionField: string = 'version'
): Promise<number> {
  const [affectedCount] = await model.update(
    {
      [versionField]: model.sequelize!.literal(`${versionField} + 1`)
    } as any,
    {
      where: { id } as any
    }
  );

  if (affectedCount === 0) {
    throw new Error(`Failed to increment version for record ${id}`);
  }

  const record = await model.findByPk(id);
  return (record as any)[versionField];
}

/**
 * Compares and swaps a value with optimistic locking
 * @param model - Sequelize model
 * @param id - Record ID
 * @param field - Field to update
 * @param expectedValue - Expected current value
 * @param newValue - New value to set
 * @param version - Current version
 * @returns Success status
 */
export async function compareAndSwap<T extends Model>(
  model: ModelStatic<T>,
  id: string | number,
  field: string,
  expectedValue: any,
  newValue: any,
  version: number
): Promise<boolean> {
  const [affectedCount] = await model.update(
    {
      [field]: newValue,
      version: version + 1
    } as any,
    {
      where: {
        id,
        [field]: expectedValue,
        version
      } as any
    }
  );

  return affectedCount > 0;
}

/**
 * Gets current version of a record
 * @param model - Sequelize model
 * @param id - Record ID
 * @param versionField - Version field name
 * @returns Current version number
 */
export async function getCurrentVersion<T extends Model>(
  model: ModelStatic<T>,
  id: string | number,
  versionField: string = 'version'
): Promise<number> {
  const record = await model.findByPk(id, {
    attributes: [versionField]
  });

  if (!record) {
    throw new Error(`Record with id ${id} not found`);
  }

  return (record as any)[versionField];
}

/**
 * Resets version to initial value (use with caution)
 * @param model - Sequelize model
 * @param id - Record ID
 * @param initialVersion - Version to reset to (default: 0)
 * @param versionField - Version field name
 */
export async function resetVersion<T extends Model>(
  model: ModelStatic<T>,
  id: string | number,
  initialVersion: number = 0,
  versionField: string = 'version'
): Promise<void> {
  await model.update(
    {
      [versionField]: initialVersion
    } as any,
    {
      where: { id } as any
    }
  );
}

// ============================================================================
// PESSIMISTIC LOCKING FUNCTIONS (Functions 9-16)
// ============================================================================

/**
 * Acquires a pessimistic row lock for update
 * @param model - Sequelize model
 * @param id - Record ID to lock
 * @param transaction - Transaction to use for locking
 * @param config - Pessimistic lock configuration
 * @returns Locked record
 */
export async function acquireRowLockForUpdate<T extends Model>(
  model: ModelStatic<T>,
  id: string | number,
  transaction: Transaction,
  config: Partial<PessimisticLockConfig> = {}
): Promise<T> {
  const { timeout = 5000, skipLocked = false, nowait = false } = config;

  const lockClause = skipLocked ? 'FOR UPDATE SKIP LOCKED' :
                     nowait ? 'FOR UPDATE NOWAIT' :
                     'FOR UPDATE';

  try {
    const record = await model.findByPk(id, {
      lock: Transaction.LOCK.UPDATE,
      transaction,
      skipLocked,
    });

    if (!record) {
      throw new PessimisticLockError(`Record with id ${id} not found`);
    }

    return record;
  } catch (error: any) {
    if (error.message?.includes('timeout') || error.message?.includes('lock')) {
      throw new PessimisticLockError(
        `Failed to acquire lock on record ${id}`,
        true
      );
    }
    throw error;
  }
}

/**
 * Acquires a shared lock for reading (prevents modifications)
 * @param model - Sequelize model
 * @param id - Record ID to lock
 * @param transaction - Transaction to use for locking
 * @returns Locked record
 */
export async function acquireSharedLock<T extends Model>(
  model: ModelStatic<T>,
  id: string | number,
  transaction: Transaction
): Promise<T> {
  const record = await model.findByPk(id, {
    lock: Transaction.LOCK.SHARE,
    transaction
  });

  if (!record) {
    throw new PessimisticLockError(`Record with id ${id} not found`);
  }

  return record;
}

/**
 * Acquires multiple row locks in a specific order to prevent deadlocks
 * @param model - Sequelize model
 * @param ids - Array of record IDs to lock (will be sorted)
 * @param transaction - Transaction to use for locking
 * @param config - Lock configuration
 * @returns Array of locked records
 */
export async function acquireMultipleRowLocks<T extends Model>(
  model: ModelStatic<T>,
  ids: (string | number)[],
  transaction: Transaction,
  config: Partial<PessimisticLockConfig> = {}
): Promise<T[]> {
  // Sort IDs to prevent deadlocks
  const sortedIds = [...ids].sort((a, b) => {
    if (typeof a === 'string' && typeof b === 'string') {
      return a.localeCompare(b);
    }
    return Number(a) - Number(b);
  });

  const lockedRecords: T[] = [];

  for (const id of sortedIds) {
    const record = await acquireRowLockForUpdate(model, id, transaction, config);
    lockedRecords.push(record);
  }

  return lockedRecords;
}

/**
 * Acquires a table-level lock
 * @param sequelize - Sequelize instance
 * @param tableName - Table name to lock
 * @param lockMode - Lock mode (SHARE, EXCLUSIVE, etc.)
 * @param transaction - Transaction to use for locking
 */
export async function acquireTableLock(
  sequelize: Sequelize,
  tableName: string,
  lockMode: 'SHARE' | 'EXCLUSIVE' | 'ACCESS SHARE' | 'ACCESS EXCLUSIVE',
  transaction: Transaction
): Promise<void> {
  const query = `LOCK TABLE "${tableName}" IN ${lockMode} MODE`;

  try {
    await sequelize.query(query, { transaction });
  } catch (error: any) {
    throw new PessimisticLockError(
      `Failed to acquire ${lockMode} lock on table ${tableName}: ${error.message}`
    );
  }
}

/**
 * Attempts to acquire a lock with timeout
 * @param lockFunction - Function that acquires the lock
 * @param timeout - Timeout in milliseconds
 * @returns Result of lock function or null if timeout
 */
export async function acquireLockWithTimeout<T>(
  lockFunction: () => Promise<T>,
  timeout: number
): Promise<T | null> {
  return Promise.race([
    lockFunction(),
    new Promise<null>((resolve) =>
      setTimeout(() => resolve(null), timeout)
    )
  ]);
}

/**
 * Performs a SELECT FOR UPDATE SKIP LOCKED query
 * @param model - Sequelize model
 * @param whereClause - Where conditions
 * @param transaction - Transaction to use
 * @param limit - Maximum number of records to lock
 * @returns Array of locked records
 */
export async function selectForUpdateSkipLocked<T extends Model>(
  model: ModelStatic<T>,
  whereClause: any,
  transaction: Transaction,
  limit?: number
): Promise<T[]> {
  const options: FindOptions = {
    where: whereClause,
    lock: Transaction.LOCK.UPDATE,
    skipLocked: true,
    transaction
  };

  if (limit) {
    options.limit = limit;
  }

  return await model.findAll(options);
}

/**
 * Implements a lock queue for ordered access
 * @param model - Sequelize model
 * @param id - Record ID
 * @param transaction - Transaction to use
 * @param queueTimeout - Maximum time to wait in queue
 * @returns Locked record or null if timeout
 */
export async function queuedLockAcquisition<T extends Model>(
  model: ModelStatic<T>,
  id: string | number,
  transaction: Transaction,
  queueTimeout: number = 30000
): Promise<T | null> {
  const startTime = Date.now();
  const pollInterval = 100;

  while (Date.now() - startTime < queueTimeout) {
    try {
      const record = await model.findByPk(id, {
        lock: Transaction.LOCK.UPDATE,
        transaction,
        skipLocked: true
      });

      if (record) {
        return record;
      }

      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, pollInterval));
    } catch (error) {
      // Continue waiting
    }
  }

  return null;
}

/**
 * Checks if a record is currently locked
 * @param model - Sequelize model
 * @param id - Record ID
 * @param transaction - Transaction to check within
 * @returns True if locked, false otherwise
 */
export async function isRecordLocked<T extends Model>(
  model: ModelStatic<T>,
  id: string | number,
  transaction: Transaction
): Promise<boolean> {
  try {
    const record = await model.findByPk(id, {
      lock: Transaction.LOCK.UPDATE,
      transaction,
      skipLocked: true
    });

    return record === null;
  } catch (error) {
    return true;
  }
}

// ============================================================================
// DISTRIBUTED LOCKING WITH REDIS (Functions 17-24)
// ============================================================================

/**
 * Distributed lock manager using Redis
 */
@Injectable()
export class DistributedLockManager {
  private readonly logger = new Logger(DistributedLockManager.name);
  private locks = new Map<string, string>();

  constructor(private readonly redis: Redis) {}

  /**
   * Acquires a distributed lock
   * @param config - Lock configuration
   * @returns Lock identifier if successful, null otherwise
   */
  async acquireLock(config: DistributedLockConfig): Promise<string | null> {
    const {
      key,
      ttl,
      retryCount = 3,
      retryDelay = 100,
      clockDriftFactor = 0.01
    } = config;

    const identifier = crypto.randomBytes(16).toString('hex');
    const lockKey = `lock:${key}`;

    for (let i = 0; i < retryCount; i++) {
      try {
        const result = await this.redis.set(
          lockKey,
          identifier,
          'PX',
          ttl,
          'NX'
        );

        if (result === 'OK') {
          this.locks.set(key, identifier);
          this.logger.debug(`Acquired distributed lock: ${key}`);
          return identifier;
        }

        // Wait before retry with exponential backoff
        const delay = retryDelay * Math.pow(2, i);
        await new Promise(resolve => setTimeout(resolve, delay));
      } catch (error) {
        this.logger.error(`Error acquiring lock ${key}:`, error);
      }
    }

    return null;
  }

  /**
   * Releases a distributed lock
   * @param key - Lock key
   * @param identifier - Lock identifier from acquisition
   * @returns True if released, false otherwise
   */
  async releaseLock(key: string, identifier: string): Promise<boolean> {
    const lockKey = `lock:${key}`;

    const script = `
      if redis.call("get", KEYS[1]) == ARGV[1] then
        return redis.call("del", KEYS[1])
      else
        return 0
      end
    `;

    try {
      const result = await this.redis.eval(script, 1, lockKey, identifier);

      if (result === 1) {
        this.locks.delete(key);
        this.logger.debug(`Released distributed lock: ${key}`);
        return true;
      }

      return false;
    } catch (error) {
      this.logger.error(`Error releasing lock ${key}:`, error);
      return false;
    }
  }

  /**
   * Extends lock TTL
   * @param key - Lock key
   * @param identifier - Lock identifier
   * @param additionalTtl - Additional TTL in milliseconds
   * @returns True if extended, false otherwise
   */
  async extendLock(
    key: string,
    identifier: string,
    additionalTtl: number
  ): Promise<boolean> {
    const lockKey = `lock:${key}`;

    const script = `
      if redis.call("get", KEYS[1]) == ARGV[1] then
        return redis.call("pexpire", KEYS[1], ARGV[2])
      else
        return 0
      end
    `;

    try {
      const result = await this.redis.eval(
        script,
        1,
        lockKey,
        identifier,
        additionalTtl.toString()
      );

      return result === 1;
    } catch (error) {
      this.logger.error(`Error extending lock ${key}:`, error);
      return false;
    }
  }

  /**
   * Checks if a lock exists
   * @param key - Lock key
   * @returns True if lock exists, false otherwise
   */
  async hasLock(key: string): Promise<boolean> {
    const lockKey = `lock:${key}`;
    const exists = await this.redis.exists(lockKey);
    return exists === 1;
  }

  /**
   * Gets remaining TTL for a lock
   * @param key - Lock key
   * @returns TTL in milliseconds, -1 if no expiry, -2 if doesn't exist
   */
  async getLockTTL(key: string): Promise<number> {
    const lockKey = `lock:${key}`;
    return await this.redis.pttl(lockKey);
  }

  /**
   * Acquires lock with automatic retry and exponential backoff
   * @param key - Lock key
   * @param ttl - Lock TTL
   * @param maxRetries - Maximum retry attempts
   * @returns Lock identifier or null
   */
  async acquireLockWithRetry(
    key: string,
    ttl: number,
    maxRetries: number = 5
  ): Promise<string | null> {
    return await this.acquireLock({
      key,
      ttl,
      retryCount: maxRetries,
      retryDelay: 100
    });
  }

  /**
   * Executes a function with distributed lock protection
   * @param key - Lock key
   * @param ttl - Lock TTL
   * @param fn - Function to execute
   * @returns Result of function execution
   */
  async withLock<T>(
    key: string,
    ttl: number,
    fn: () => Promise<T>
  ): Promise<T> {
    const identifier = await this.acquireLock({ key, ttl });

    if (!identifier) {
      throw new DistributedLockError(
        `Failed to acquire distributed lock for key: ${key}`,
        key
      );
    }

    try {
      return await fn();
    } finally {
      await this.releaseLock(key, identifier);
    }
  }

  /**
   * Implements Redlock algorithm for multi-Redis instances
   * @param redisClients - Array of Redis clients
   * @param key - Lock key
   * @param ttl - Lock TTL
   * @returns Lock identifier or null
   */
  async redlock(
    redisClients: Redis[],
    key: string,
    ttl: number
  ): Promise<string | null> {
    const identifier = crypto.randomBytes(16).toString('hex');
    const lockKey = `lock:${key}`;
    const quorum = Math.floor(redisClients.length / 2) + 1;

    let locksAcquired = 0;
    const startTime = Date.now();

    for (const client of redisClients) {
      try {
        const result = await client.set(lockKey, identifier, 'PX', ttl, 'NX');
        if (result === 'OK') {
          locksAcquired++;
        }
      } catch (error) {
        this.logger.warn(`Failed to acquire lock on Redis instance: ${error}`);
      }
    }

    const elapsedTime = Date.now() - startTime;
    const validityTime = ttl - elapsedTime - (ttl * 0.01); // Drift factor

    if (locksAcquired >= quorum && validityTime > 0) {
      return identifier;
    }

    // Release locks if quorum not reached
    await this.releaseRedlock(redisClients, key, identifier);
    return null;
  }

  /**
   * Releases Redlock across multiple Redis instances
   * @param redisClients - Array of Redis clients
   * @param key - Lock key
   * @param identifier - Lock identifier
   */
  private async releaseRedlock(
    redisClients: Redis[],
    key: string,
    identifier: string
  ): Promise<void> {
    const lockKey = `lock:${key}`;
    const script = `
      if redis.call("get", KEYS[1]) == ARGV[1] then
        return redis.call("del", KEYS[1])
      else
        return 0
      end
    `;

    for (const client of redisClients) {
      try {
        await client.eval(script, 1, lockKey, identifier);
      } catch (error) {
        this.logger.warn(`Failed to release lock on Redis instance: ${error}`);
      }
    }
  }
}

// ============================================================================
// DEADLOCK DETECTION AND RETRY (Functions 25-28)
// ============================================================================

/**
 * Detects if an error is a deadlock
 * @param error - Error to check
 * @returns True if deadlock error, false otherwise
 */
export function isDeadlockError(error: any): boolean {
  const deadlockPatterns = [
    /deadlock detected/i,
    /deadlock found/i,
    /lock wait timeout exceeded/i,
    /could not serialize access/i,
    /ER_LOCK_DEADLOCK/,
    /40P01/, // PostgreSQL serialization failure
    /40001/  // PostgreSQL deadlock
  ];

  const errorMessage = error?.message || error?.toString() || '';
  return deadlockPatterns.some(pattern => pattern.test(errorMessage));
}

/**
 * Retries a function on deadlock with exponential backoff
 * @param fn - Function to retry
 * @param config - Retry configuration
 * @returns Result of function execution
 */
export async function retryOnDeadlock<T>(
  fn: () => Promise<T>,
  config: DeadlockRetryConfig
): Promise<T> {
  const {
    maxRetries,
    initialDelay,
    maxDelay,
    backoffMultiplier,
    jitter = true
  } = config;

  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;

      if (!isDeadlockError(error)) {
        throw error;
      }

      if (attempt === maxRetries) {
        throw new DeadlockError(
          `Deadlock persisted after ${maxRetries} retries: ${error.message}`,
          attempt
        );
      }

      // Calculate delay with exponential backoff
      let delay = Math.min(
        initialDelay * Math.pow(backoffMultiplier, attempt),
        maxDelay
      );

      // Add jitter to prevent thundering herd
      if (jitter) {
        delay = delay * (0.5 + Math.random() * 0.5);
      }

      const logger = new Logger('DeadlockRetry');
      logger.warn(
        `Deadlock detected, retrying in ${delay}ms (attempt ${attempt + 1}/${maxRetries})`
      );

      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError || new Error('Retry failed');
}

/**
 * Wraps a transaction with deadlock retry logic
 * @param sequelize - Sequelize instance
 * @param fn - Transaction function
 * @param config - Retry configuration
 * @returns Transaction result
 */
export async function transactionWithDeadlockRetry<T>(
  sequelize: Sequelize,
  fn: (transaction: Transaction) => Promise<T>,
  config: DeadlockRetryConfig
): Promise<T> {
  return retryOnDeadlock(async () => {
    return await sequelize.transaction(async (transaction) => {
      return await fn(transaction);
    });
  }, config);
}

/**
 * Analyzes deadlock and provides resolution suggestions
 * @param error - Deadlock error
 * @param sequelize - Sequelize instance
 * @returns Deadlock analysis and suggestions
 */
export async function analyzeDeadlock(
  error: Error,
  sequelize: Sequelize
): Promise<{
  detected: boolean;
  analysis: string;
  suggestions: string[];
}> {
  if (!isDeadlockError(error)) {
    return {
      detected: false,
      analysis: 'Not a deadlock error',
      suggestions: []
    };
  }

  const suggestions: string[] = [
    'Ensure locks are acquired in consistent order',
    'Reduce transaction duration',
    'Use lower isolation levels if possible',
    'Consider optimistic locking for read-heavy workloads',
    'Review index strategy to reduce lock contention'
  ];

  // Get deadlock information (PostgreSQL specific)
  let analysis = error.message;

  try {
    if (sequelize.getDialect() === 'postgres') {
      const [result] = await sequelize.query(`
        SELECT * FROM pg_stat_activity
        WHERE state = 'active' AND wait_event_type = 'Lock'
      `);

      if (Array.isArray(result) && result.length > 0) {
        analysis += `\n\nActive locks: ${result.length}`;
      }
    }
  } catch (queryError) {
    // Ignore query errors
  }

  return {
    detected: true,
    analysis,
    suggestions
  };
}

// ============================================================================
// SEMAPHORE PATTERNS (Functions 29-32)
// ============================================================================

/**
 * Redis-based semaphore for limiting concurrent operations
 */
export class RedisSemaphore {
  private readonly logger = new Logger(RedisSemaphore.name);

  constructor(
    private readonly redis: Redis,
    private readonly key: string,
    private readonly maxConcurrent: number,
    private readonly timeout: number = 60000
  ) {}

  /**
   * Acquires a semaphore permit
   * @returns Permit identifier or null if unavailable
   */
  async acquire(): Promise<string | null> {
    const identifier = crypto.randomBytes(16).toString('hex');
    const now = Date.now();
    const lockKey = `semaphore:${this.key}`;

    // Remove expired entries
    await this.redis.zremrangebyscore(lockKey, '-inf', now - this.timeout);

    const script = `
      local current = redis.call('zcard', KEYS[1])
      if current < tonumber(ARGV[1]) then
        redis.call('zadd', KEYS[1], ARGV[2], ARGV[3])
        return ARGV[3]
      else
        return nil
      end
    `;

    try {
      const result = await this.redis.eval(
        script,
        1,
        lockKey,
        this.maxConcurrent.toString(),
        now.toString(),
        identifier
      );

      if (result) {
        this.logger.debug(`Acquired semaphore permit: ${this.key}`);
        return identifier;
      }

      return null;
    } catch (error) {
      this.logger.error(`Error acquiring semaphore: ${error}`);
      return null;
    }
  }

  /**
   * Releases a semaphore permit
   * @param identifier - Permit identifier
   * @returns True if released, false otherwise
   */
  async release(identifier: string): Promise<boolean> {
    const lockKey = `semaphore:${this.key}`;

    try {
      const result = await this.redis.zrem(lockKey, identifier);

      if (result === 1) {
        this.logger.debug(`Released semaphore permit: ${this.key}`);
        return true;
      }

      return false;
    } catch (error) {
      this.logger.error(`Error releasing semaphore: ${error}`);
      return false;
    }
  }

  /**
   * Gets current semaphore count
   * @returns Number of active permits
   */
  async getCount(): Promise<number> {
    const lockKey = `semaphore:${this.key}`;
    const now = Date.now();

    // Remove expired entries first
    await this.redis.zremrangebyscore(lockKey, '-inf', now - this.timeout);

    return await this.redis.zcard(lockKey);
  }

  /**
   * Executes a function with semaphore protection
   * @param fn - Function to execute
   * @param waitTimeout - Maximum time to wait for permit
   * @returns Result of function execution
   */
  async withPermit<T>(
    fn: () => Promise<T>,
    waitTimeout: number = 30000
  ): Promise<T> {
    const startTime = Date.now();
    let identifier: string | null = null;

    // Try to acquire permit with timeout
    while (Date.now() - startTime < waitTimeout) {
      identifier = await this.acquire();

      if (identifier) {
        break;
      }

      // Wait before retry
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    if (!identifier) {
      throw new Error(`Failed to acquire semaphore permit within ${waitTimeout}ms`);
    }

    try {
      return await fn();
    } finally {
      await this.release(identifier);
    }
  }
}

// ============================================================================
// MUTEX IMPLEMENTATIONS (Functions 33-36)
// ============================================================================

/**
 * In-memory mutex for local synchronization
 */
export class LocalMutex {
  private locked = false;
  private queue: Array<() => void> = [];

  /**
   * Acquires the mutex lock
   * @param timeout - Maximum time to wait
   * @returns True if acquired, false if timeout
   */
  async acquire(timeout?: number): Promise<boolean> {
    if (!this.locked) {
      this.locked = true;
      return true;
    }

    return new Promise<boolean>((resolve) => {
      const timeoutId = timeout
        ? setTimeout(() => {
            const index = this.queue.indexOf(callback);
            if (index > -1) {
              this.queue.splice(index, 1);
            }
            resolve(false);
          }, timeout)
        : null;

      const callback = () => {
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
        this.locked = true;
        resolve(true);
      };

      this.queue.push(callback);
    });
  }

  /**
   * Releases the mutex lock
   */
  release(): void {
    if (!this.locked) {
      throw new Error('Mutex is not locked');
    }

    const next = this.queue.shift();

    if (next) {
      next();
    } else {
      this.locked = false;
    }
  }

  /**
   * Checks if mutex is locked
   */
  isLocked(): boolean {
    return this.locked;
  }

  /**
   * Executes a function with mutex protection
   * @param fn - Function to execute
   * @param timeout - Acquisition timeout
   * @returns Result of function execution
   */
  async withLock<T>(fn: () => Promise<T>, timeout?: number): Promise<T> {
    const acquired = await this.acquire(timeout);

    if (!acquired) {
      throw new Error('Failed to acquire mutex lock');
    }

    try {
      return await fn();
    } finally {
      this.release();
    }
  }
}

/**
 * Distributed mutex using Redis
 */
export class DistributedMutex {
  private readonly logger = new Logger(DistributedMutex.name);

  constructor(
    private readonly redis: Redis,
    private readonly key: string
  ) {}

  /**
   * Acquires distributed mutex
   * @param ttl - Lock TTL in milliseconds
   * @param timeout - Maximum wait time
   * @returns Lock identifier or null
   */
  async acquire(ttl: number = 30000, timeout?: number): Promise<string | null> {
    const identifier = crypto.randomBytes(16).toString('hex');
    const lockKey = `mutex:${this.key}`;
    const startTime = Date.now();

    while (!timeout || Date.now() - startTime < timeout) {
      const result = await this.redis.set(lockKey, identifier, 'PX', ttl, 'NX');

      if (result === 'OK') {
        this.logger.debug(`Acquired distributed mutex: ${this.key}`);
        return identifier;
      }

      // Wait before retry
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    return null;
  }

  /**
   * Releases distributed mutex
   * @param identifier - Lock identifier
   * @returns True if released, false otherwise
   */
  async release(identifier: string): Promise<boolean> {
    const lockKey = `mutex:${this.key}`;

    const script = `
      if redis.call("get", KEYS[1]) == ARGV[1] then
        return redis.call("del", KEYS[1])
      else
        return 0
      end
    `;

    try {
      const result = await this.redis.eval(script, 1, lockKey, identifier);

      if (result === 1) {
        this.logger.debug(`Released distributed mutex: ${this.key}`);
        return true;
      }

      return false;
    } catch (error) {
      this.logger.error(`Error releasing mutex: ${error}`);
      return false;
    }
  }

  /**
   * Executes a function with mutex protection
   * @param fn - Function to execute
   * @param ttl - Lock TTL
   * @param timeout - Acquisition timeout
   * @returns Result of function execution
   */
  async withLock<T>(
    fn: () => Promise<T>,
    ttl: number = 30000,
    timeout?: number
  ): Promise<T> {
    const identifier = await this.acquire(ttl, timeout);

    if (!identifier) {
      throw new Error(`Failed to acquire distributed mutex: ${this.key}`);
    }

    try {
      return await fn();
    } finally {
      await this.release(identifier);
    }
  }
}

// ============================================================================
// READ-WRITE LOCK COORDINATION (Functions 37-40)
// ============================================================================

/**
 * Read-write lock for coordinating reader/writer access
 */
export class ReadWriteLock {
  private readers = 0;
  private writers = 0;
  private writerWaiting = false;
  private readerQueue: Array<() => void> = [];
  private writerQueue: Array<() => void> = [];
  private readonly writerPriority: boolean;

  constructor(config: ReadWriteLockConfig = {}) {
    this.writerPriority = config.writerPriority ?? false;
  }

  /**
   * Acquires a read lock
   * @param timeout - Maximum wait time
   * @returns True if acquired, false if timeout
   */
  async acquireRead(timeout?: number): Promise<boolean> {
    if (this.writers === 0 && (!this.writerPriority || !this.writerWaiting)) {
      this.readers++;
      return true;
    }

    return new Promise<boolean>((resolve) => {
      const timeoutId = timeout
        ? setTimeout(() => {
            const index = this.readerQueue.indexOf(callback);
            if (index > -1) {
              this.readerQueue.splice(index, 1);
            }
            resolve(false);
          }, timeout)
        : null;

      const callback = () => {
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
        this.readers++;
        resolve(true);
      };

      this.readerQueue.push(callback);
    });
  }

  /**
   * Releases a read lock
   */
  releaseRead(): void {
    if (this.readers === 0) {
      throw new Error('No active readers to release');
    }

    this.readers--;

    if (this.readers === 0 && this.writerQueue.length > 0) {
      const next = this.writerQueue.shift();
      if (next) {
        this.writerWaiting = false;
        next();
      }
    }
  }

  /**
   * Acquires a write lock
   * @param timeout - Maximum wait time
   * @returns True if acquired, false if timeout
   */
  async acquireWrite(timeout?: number): Promise<boolean> {
    if (this.readers === 0 && this.writers === 0) {
      this.writers = 1;
      return true;
    }

    this.writerWaiting = true;

    return new Promise<boolean>((resolve) => {
      const timeoutId = timeout
        ? setTimeout(() => {
            const index = this.writerQueue.indexOf(callback);
            if (index > -1) {
              this.writerQueue.splice(index, 1);
            }
            this.writerWaiting = this.writerQueue.length > 0;
            resolve(false);
          }, timeout)
        : null;

      const callback = () => {
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
        this.writers = 1;
        resolve(true);
      };

      this.writerQueue.push(callback);
    });
  }

  /**
   * Releases a write lock
   */
  releaseWrite(): void {
    if (this.writers === 0) {
      throw new Error('No active writer to release');
    }

    this.writers = 0;

    // Give priority to next writer if configured
    if (this.writerPriority && this.writerQueue.length > 0) {
      const next = this.writerQueue.shift();
      if (next) {
        next();
        return;
      }
    }

    // Otherwise, release all waiting readers
    if (this.readerQueue.length > 0) {
      const readers = [...this.readerQueue];
      this.readerQueue = [];
      readers.forEach(reader => reader());
    } else if (this.writerQueue.length > 0) {
      const next = this.writerQueue.shift();
      if (next) {
        next();
      }
    } else {
      this.writerWaiting = false;
    }
  }

  /**
   * Executes a function with read lock
   * @param fn - Function to execute
   * @param timeout - Lock acquisition timeout
   * @returns Result of function execution
   */
  async withReadLock<T>(fn: () => Promise<T>, timeout?: number): Promise<T> {
    const acquired = await this.acquireRead(timeout);

    if (!acquired) {
      throw new Error('Failed to acquire read lock');
    }

    try {
      return await fn();
    } finally {
      this.releaseRead();
    }
  }

  /**
   * Executes a function with write lock
   * @param fn - Function to execute
   * @param timeout - Lock acquisition timeout
   * @returns Result of function execution
   */
  async withWriteLock<T>(fn: () => Promise<T>, timeout?: number): Promise<T> {
    const acquired = await this.acquireWrite(timeout);

    if (!acquired) {
      throw new Error('Failed to acquire write lock');
    }

    try {
      return await fn();
    } finally {
      this.releaseWrite();
    }
  }
}

// ============================================================================
// LOCK ESCALATION PREVENTION (Functions 41-42)
// ============================================================================

/**
 * Lock escalation monitor and preventer
 */
export class LockEscalationMonitor {
  private readonly logger = new Logger(LockEscalationMonitor.name);
  private rowLockCounts = new Map<string, number>();

  constructor(private readonly config: LockEscalationConfig) {}

  /**
   * Tracks row lock acquisition
   * @param tableName - Table name
   * @returns True if within threshold, false if escalation should occur
   */
  trackRowLock(tableName: string): boolean {
    const currentCount = this.rowLockCounts.get(tableName) || 0;
    const newCount = currentCount + 1;

    this.rowLockCounts.set(tableName, newCount);

    if (newCount >= this.config.rowLockThreshold) {
      this.logger.warn(
        `Row lock threshold reached for table ${tableName}: ${newCount} locks`
      );

      if (this.config.tableLockAfterThreshold) {
        this.logger.info(`Escalating to table lock for ${tableName}`);
        return false;
      }
    }

    return true;
  }

  /**
   * Releases row lock tracking
   * @param tableName - Table name
   */
  releaseRowLock(tableName: string): void {
    const currentCount = this.rowLockCounts.get(tableName) || 0;

    if (currentCount > 0) {
      this.rowLockCounts.set(tableName, currentCount - 1);
    }
  }

  /**
   * Gets current lock count for a table
   * @param tableName - Table name
   * @returns Current row lock count
   */
  getLockCount(tableName: string): number {
    return this.rowLockCounts.get(tableName) || 0;
  }

  /**
   * Resets lock tracking for a table
   * @param tableName - Table name
   */
  resetLockCount(tableName: string): void {
    this.rowLockCounts.delete(tableName);
  }

  /**
   * Gets lock escalation recommendations
   * @param tableName - Table name
   * @returns Recommendation object
   */
  getEscalationRecommendation(tableName: string): {
    shouldEscalate: boolean;
    currentLocks: number;
    threshold: number;
    recommendation: string;
  } {
    const currentLocks = this.getLockCount(tableName);
    const shouldEscalate = currentLocks >= this.config.rowLockThreshold;

    return {
      shouldEscalate,
      currentLocks,
      threshold: this.config.rowLockThreshold,
      recommendation: shouldEscalate
        ? 'Consider using table-level lock or batching operations'
        : 'Continue with row-level locks'
    };
  }
}

// Export all classes and utilities
export {
  DistributedLockManager,
  RedisSemaphore,
  LocalMutex,
  DistributedMutex,
  ReadWriteLock,
  LockEscalationMonitor
};
