/**
 * LOC: NOTX7891K2M3
 * File: /reuse/san/nestjs-oracle-transaction-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common (v11.1.8)
 *   - typeorm (v0.3.x)
 *   - oracledb (v6.x)
 *   - rxjs (v7.8.x)
 *
 * DOWNSTREAM (imported by):
 *   - Services requiring distributed transactions
 *   - Repository implementations with complex transactions
 *   - Saga orchestration services
 *   - Healthcare transaction coordinators
 */
import { DataSource, EntityManager, QueryRunner } from 'typeorm';
import { Subject, Observable } from 'rxjs';
/**
 * Transaction isolation levels for Oracle Database
 */
export declare enum TransactionIsolationLevel {
    READ_UNCOMMITTED = "READ UNCOMMITTED",
    READ_COMMITTED = "READ COMMITTED",
    REPEATABLE_READ = "REPEATABLE READ",
    SERIALIZABLE = "SERIALIZABLE"
}
/**
 * Transaction state enumeration
 */
export declare enum TransactionState {
    PENDING = "PENDING",
    ACTIVE = "ACTIVE",
    PREPARING = "PREPARING",
    PREPARED = "PREPARED",
    COMMITTING = "COMMITTING",
    COMMITTED = "COMMITTED",
    ROLLING_BACK = "ROLLING_BACK",
    ROLLED_BACK = "ROLLED_BACK",
    FAILED = "FAILED"
}
/**
 * Transaction phase for two-phase commit
 */
export declare enum TransactionPhase {
    PREPARE = "PREPARE",
    COMMIT = "COMMIT",
    ROLLBACK = "ROLLBACK"
}
/**
 * Transaction configuration options
 */
export interface TransactionOptions {
    isolationLevel?: TransactionIsolationLevel;
    timeout?: number;
    readOnly?: boolean;
    deferrable?: boolean;
    name?: string;
    retryAttempts?: number;
    retryDelay?: number;
    enableAudit?: boolean;
}
/**
 * Distributed transaction participant
 */
export interface TransactionParticipant {
    id: string;
    name: string;
    dataSource: DataSource;
    state: TransactionState;
    prepareResult?: boolean;
    error?: Error;
}
/**
 * Two-phase commit coordinator configuration
 */
export interface TwoPhaseCommitConfig {
    participants: TransactionParticipant[];
    timeout: number;
    coordinator: string;
    transactionId: string;
    enableLogging?: boolean;
}
/**
 * Transaction savepoint
 */
export interface TransactionSavepoint {
    name: string;
    id: string;
    timestamp: Date;
    queryRunner: QueryRunner;
    level: number;
}
/**
 * Transaction context for nested transactions
 */
export interface TransactionContext {
    id: string;
    parentId?: string;
    level: number;
    state: TransactionState;
    savepoints: TransactionSavepoint[];
    startTime: Date;
    isolationLevel: TransactionIsolationLevel;
    metadata?: Record<string, any>;
}
/**
 * Transaction event types
 */
export declare enum TransactionEventType {
    STARTED = "STARTED",
    COMMITTED = "COMMITTED",
    ROLLED_BACK = "ROLLED_BACK",
    SAVEPOINT_CREATED = "SAVEPOINT_CREATED",
    SAVEPOINT_RELEASED = "SAVEPOINT_RELEASED",
    SAVEPOINT_ROLLED_BACK = "SAVEPOINT_ROLLED_BACK",
    PREPARED = "PREPARED",
    FAILED = "FAILED"
}
/**
 * Transaction event
 */
export interface TransactionEvent {
    type: TransactionEventType;
    transactionId: string;
    timestamp: Date;
    data?: any;
    error?: Error;
}
/**
 * Transaction retry policy
 */
export interface TransactionRetryPolicy {
    maxAttempts: number;
    initialDelay: number;
    maxDelay: number;
    backoffMultiplier: number;
    retryableErrors: string[];
}
/**
 * XA transaction configuration
 */
export interface XATransactionConfig {
    xid: string;
    globalTransactionId: string;
    branchQualifier: string;
    formatId: number;
    timeout?: number;
}
/**
 * Transaction compensation action
 */
export interface CompensationAction {
    name: string;
    execute: () => Promise<void>;
    rollback: () => Promise<void>;
    order: number;
}
/**
 * Saga transaction step
 */
export interface SagaStep {
    name: string;
    transaction: () => Promise<any>;
    compensation: () => Promise<void>;
    retryable?: boolean;
}
/**
 * Transaction health metrics
 */
export interface TransactionHealthMetrics {
    activeTransactions: number;
    committedCount: number;
    rolledBackCount: number;
    failedCount: number;
    averageDuration: number;
    longestTransaction: number;
    timestamp: Date;
}
/**
 * Distributed lock configuration
 */
export interface DistributedLockConfig {
    resourceName: string;
    timeout: number;
    owner: string;
    exclusive?: boolean;
}
/**
 * Creates a new transaction with specified options.
 *
 * @param {DataSource} dataSource - TypeORM data source
 * @param {TransactionOptions} options - Transaction configuration
 * @returns {Promise<QueryRunner>} Transaction query runner
 *
 * @example
 * ```typescript
 * const queryRunner = await createTransaction(dataSource, {
 *   isolationLevel: TransactionIsolationLevel.SERIALIZABLE,
 *   timeout: 30000,
 *   name: 'patient-update-transaction'
 * });
 * ```
 */
export declare const createTransaction: (dataSource: DataSource, options?: TransactionOptions) => Promise<QueryRunner>;
/**
 * Commits a transaction with validation and audit logging.
 *
 * @param {QueryRunner} queryRunner - Transaction query runner
 * @param {string} [auditMessage] - Audit log message
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await commitTransaction(queryRunner, 'Patient record updated successfully');
 * ```
 */
export declare const commitTransaction: (queryRunner: QueryRunner, auditMessage?: string) => Promise<void>;
/**
 * Rolls back a transaction with error logging.
 *
 * @param {QueryRunner} queryRunner - Transaction query runner
 * @param {Error} [error] - Error that caused rollback
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await rollbackTransaction(queryRunner, new Error('Validation failed'));
 * ```
 */
export declare const rollbackTransaction: (queryRunner: QueryRunner, error?: Error) => Promise<void>;
/**
 * Executes a function within a transaction with automatic commit/rollback.
 *
 * @template T
 * @param {DataSource} dataSource - TypeORM data source
 * @param {(manager: EntityManager) => Promise<T>} work - Work to execute
 * @param {TransactionOptions} options - Transaction options
 * @returns {Promise<T>} Result of work function
 *
 * @example
 * ```typescript
 * const result = await executeInTransaction(dataSource, async (manager) => {
 *   const patient = await manager.save(Patient, patientData);
 *   await manager.save(MedicalRecord, { patientId: patient.id, ...recordData });
 *   return patient;
 * }, { isolationLevel: TransactionIsolationLevel.SERIALIZABLE });
 * ```
 */
export declare const executeInTransaction: <T>(dataSource: DataSource, work: (manager: EntityManager) => Promise<T>, options?: TransactionOptions) => Promise<T>;
/**
 * Sets transaction isolation level dynamically.
 *
 * @param {QueryRunner} queryRunner - Transaction query runner
 * @param {TransactionIsolationLevel} level - Isolation level
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await setTransactionIsolation(queryRunner, TransactionIsolationLevel.SERIALIZABLE);
 * ```
 */
export declare const setTransactionIsolation: (queryRunner: QueryRunner, level: TransactionIsolationLevel) => Promise<void>;
/**
 * Gets current transaction state.
 *
 * @param {QueryRunner} queryRunner - Transaction query runner
 * @returns {Promise<TransactionState>} Current transaction state
 *
 * @example
 * ```typescript
 * const state = await getTransactionState(queryRunner);
 * if (state === TransactionState.ACTIVE) {
 *   // Transaction is active
 * }
 * ```
 */
export declare const getTransactionState: (queryRunner: QueryRunner) => Promise<TransactionState>;
/**
 * Executes two-phase commit across multiple participants.
 *
 * @param {TwoPhaseCommitConfig} config - 2PC configuration
 * @returns {Promise<boolean>} True if all commits succeeded
 *
 * @example
 * ```typescript
 * const success = await executeTwoPhaseCommit({
 *   participants: [participant1, participant2],
 *   timeout: 30000,
 *   coordinator: 'main-coordinator',
 *   transactionId: 'txn-12345'
 * });
 * ```
 */
export declare const executeTwoPhaseCommit: (config: TwoPhaseCommitConfig) => Promise<boolean>;
/**
 * Prepares a participant for two-phase commit.
 *
 * @param {TransactionParticipant} participant - Transaction participant
 * @param {number} timeout - Prepare timeout in milliseconds
 * @returns {Promise<boolean>} True if prepare succeeded
 *
 * @example
 * ```typescript
 * const prepared = await prepareParticipant(participant, 10000);
 * ```
 */
export declare const prepareParticipant: (participant: TransactionParticipant, timeout: number) => Promise<boolean>;
/**
 * Commits a prepared participant.
 *
 * @param {TransactionParticipant} participant - Transaction participant
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await commitParticipant(participant);
 * ```
 */
export declare const commitParticipant: (participant: TransactionParticipant) => Promise<void>;
/**
 * Aborts a participant and rolls back changes.
 *
 * @param {TransactionParticipant} participant - Transaction participant
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await abortParticipant(participant);
 * ```
 */
export declare const abortParticipant: (participant: TransactionParticipant) => Promise<void>;
/**
 * Creates a distributed transaction coordinator.
 *
 * @param {string} coordinatorId - Coordinator identifier
 * @param {number} timeout - Transaction timeout
 * @returns {TwoPhaseCommitConfig} Coordinator configuration
 *
 * @example
 * ```typescript
 * const coordinator = createTransactionCoordinator('coordinator-1', 30000);
 * ```
 */
export declare const createTransactionCoordinator: (coordinatorId: string, timeout: number) => Omit<TwoPhaseCommitConfig, "participants">;
/**
 * Validates two-phase commit configuration.
 *
 * @param {TwoPhaseCommitConfig} config - Configuration to validate
 * @returns {boolean} True if valid
 *
 * @example
 * ```typescript
 * const isValid = validateTwoPhaseConfig(config);
 * ```
 */
export declare const validateTwoPhaseConfig: (config: TwoPhaseCommitConfig) => boolean;
/**
 * Creates a transaction savepoint.
 *
 * @param {QueryRunner} queryRunner - Transaction query runner
 * @param {string} name - Savepoint name
 * @returns {Promise<TransactionSavepoint>} Created savepoint
 *
 * @example
 * ```typescript
 * const savepoint = await createSavepoint(queryRunner, 'before-update');
 * ```
 */
export declare const createSavepoint: (queryRunner: QueryRunner, name: string) => Promise<TransactionSavepoint>;
/**
 * Releases a transaction savepoint.
 *
 * @param {TransactionSavepoint} savepoint - Savepoint to release
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await releaseSavepoint(savepoint);
 * ```
 */
export declare const releaseSavepoint: (savepoint: TransactionSavepoint) => Promise<void>;
/**
 * Rolls back to a specific savepoint.
 *
 * @param {TransactionSavepoint} savepoint - Savepoint to rollback to
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await rollbackToSavepoint(savepoint);
 * ```
 */
export declare const rollbackToSavepoint: (savepoint: TransactionSavepoint) => Promise<void>;
/**
 * Creates a named savepoint chain for complex transactions.
 *
 * @param {QueryRunner} queryRunner - Transaction query runner
 * @param {string[]} names - Savepoint names in order
 * @returns {Promise<TransactionSavepoint[]>} Created savepoints
 *
 * @example
 * ```typescript
 * const savepoints = await createSavepointChain(queryRunner, ['step1', 'step2', 'step3']);
 * ```
 */
export declare const createSavepointChain: (queryRunner: QueryRunner, names: string[]) => Promise<TransactionSavepoint[]>;
/**
 * Executes work with automatic savepoint management.
 *
 * @template T
 * @param {QueryRunner} queryRunner - Transaction query runner
 * @param {string} savepointName - Savepoint name
 * @param {() => Promise<T>} work - Work to execute
 * @returns {Promise<T>} Result of work
 *
 * @example
 * ```typescript
 * const result = await executeWithSavepoint(queryRunner, 'update-patient', async () => {
 *   return await updatePatientRecord(patientId, data);
 * });
 * ```
 */
export declare const executeWithSavepoint: <T>(queryRunner: QueryRunner, savepointName: string, work: () => Promise<T>) => Promise<T>;
/**
 * Creates a nested transaction context.
 *
 * @param {QueryRunner} queryRunner - Parent transaction query runner
 * @param {string} [parentId] - Parent transaction ID
 * @returns {Promise<TransactionContext>} Nested transaction context
 *
 * @example
 * ```typescript
 * const nestedCtx = await createNestedTransaction(queryRunner, parentTransactionId);
 * ```
 */
export declare const createNestedTransaction: (queryRunner: QueryRunner, parentId?: string) => Promise<TransactionContext>;
/**
 * Commits a nested transaction.
 *
 * @param {TransactionContext} context - Nested transaction context
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await commitNestedTransaction(nestedContext);
 * ```
 */
export declare const commitNestedTransaction: (context: TransactionContext) => Promise<void>;
/**
 * Rolls back a nested transaction.
 *
 * @param {TransactionContext} context - Nested transaction context
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await rollbackNestedTransaction(nestedContext);
 * ```
 */
export declare const rollbackNestedTransaction: (context: TransactionContext) => Promise<void>;
/**
 * Executes work in nested transaction with automatic management.
 *
 * @template T
 * @param {QueryRunner} queryRunner - Parent transaction query runner
 * @param {() => Promise<T>} work - Work to execute
 * @param {string} [parentId] - Parent transaction ID
 * @returns {Promise<T>} Result of work
 *
 * @example
 * ```typescript
 * const result = await executeNestedTransaction(queryRunner, async () => {
 *   return await performNestedOperation();
 * }, parentTransactionId);
 * ```
 */
export declare const executeNestedTransaction: <T>(queryRunner: QueryRunner, work: () => Promise<T>, parentId?: string) => Promise<T>;
/**
 * Gets nested transaction depth level.
 *
 * @param {TransactionContext} context - Transaction context
 * @returns {number} Nesting depth level
 *
 * @example
 * ```typescript
 * const depth = getTransactionDepth(context); // 2
 * ```
 */
export declare const getTransactionDepth: (context: TransactionContext) => number;
/**
 * Executes transaction with automatic retry on failure.
 *
 * @template T
 * @param {DataSource} dataSource - TypeORM data source
 * @param {(manager: EntityManager) => Promise<T>} work - Work to execute
 * @param {TransactionRetryPolicy} policy - Retry policy
 * @returns {Promise<T>} Result of work
 *
 * @example
 * ```typescript
 * const result = await executeWithRetry(dataSource, async (manager) => {
 *   return await manager.save(Patient, patientData);
 * }, {
 *   maxAttempts: 3,
 *   initialDelay: 1000,
 *   maxDelay: 10000,
 *   backoffMultiplier: 2,
 *   retryableErrors: ['ORA-08177', 'ORA-00060']
 * });
 * ```
 */
export declare const executeWithRetry: <T>(dataSource: DataSource, work: (manager: EntityManager) => Promise<T>, policy: TransactionRetryPolicy) => Promise<T>;
/**
 * Determines if error is retryable based on policy.
 *
 * @param {Error} error - Error to check
 * @param {string[]} retryableErrors - List of retryable error codes
 * @returns {boolean} True if error is retryable
 *
 * @example
 * ```typescript
 * const canRetry = isRetryableError(error, ['ORA-08177', 'ORA-00060']);
 * ```
 */
export declare const isRetryableError: (error: Error, retryableErrors: string[]) => boolean;
/**
 * Calculates retry delay with exponential backoff.
 *
 * @param {number} attempt - Current attempt number
 * @param {TransactionRetryPolicy} policy - Retry policy
 * @returns {number} Delay in milliseconds
 *
 * @example
 * ```typescript
 * const delay = calculateRetryDelay(2, policy); // 4000ms
 * ```
 */
export declare const calculateRetryDelay: (attempt: number, policy: TransactionRetryPolicy) => number;
/**
 * Creates default transaction retry policy.
 *
 * @returns {TransactionRetryPolicy} Default retry policy
 *
 * @example
 * ```typescript
 * const policy = createDefaultRetryPolicy();
 * ```
 */
export declare const createDefaultRetryPolicy: () => TransactionRetryPolicy;
/**
 * Recovers failed transaction with compensation logic.
 *
 * @param {string} transactionId - Failed transaction ID
 * @param {CompensationAction[]} compensations - Compensation actions
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await recoverFailedTransaction('txn-12345', compensationActions);
 * ```
 */
export declare const recoverFailedTransaction: (transactionId: string, compensations: CompensationAction[]) => Promise<void>;
/**
 * Creates XA transaction identifier.
 *
 * @param {number} formatId - XA format identifier
 * @param {string} globalId - Global transaction ID
 * @param {string} branchId - Branch qualifier
 * @returns {XATransactionConfig} XA configuration
 *
 * @example
 * ```typescript
 * const xaConfig = createXATransaction(1, 'global-123', 'branch-456');
 * ```
 */
export declare const createXATransaction: (formatId: number, globalId: string, branchId: string) => XATransactionConfig;
/**
 * Starts XA transaction.
 *
 * @param {QueryRunner} queryRunner - Query runner
 * @param {XATransactionConfig} config - XA configuration
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await startXATransaction(queryRunner, xaConfig);
 * ```
 */
export declare const startXATransaction: (queryRunner: QueryRunner, config: XATransactionConfig) => Promise<void>;
/**
 * Ends XA transaction.
 *
 * @param {QueryRunner} queryRunner - Query runner
 * @param {XATransactionConfig} config - XA configuration
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await endXATransaction(queryRunner, xaConfig);
 * ```
 */
export declare const endXATransaction: (queryRunner: QueryRunner, config: XATransactionConfig) => Promise<void>;
/**
 * Prepares XA transaction.
 *
 * @param {QueryRunner} queryRunner - Query runner
 * @param {XATransactionConfig} config - XA configuration
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await prepareXATransaction(queryRunner, xaConfig);
 * ```
 */
export declare const prepareXATransaction: (queryRunner: QueryRunner, config: XATransactionConfig) => Promise<void>;
/**
 * Commits XA transaction.
 *
 * @param {QueryRunner} queryRunner - Query runner
 * @param {XATransactionConfig} config - XA configuration
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await commitXATransaction(queryRunner, xaConfig);
 * ```
 */
export declare const commitXATransaction: (queryRunner: QueryRunner, config: XATransactionConfig) => Promise<void>;
/**
 * Rolls back XA transaction.
 *
 * @param {QueryRunner} queryRunner - Query runner
 * @param {XATransactionConfig} config - XA configuration
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await rollbackXATransaction(queryRunner, xaConfig);
 * ```
 */
export declare const rollbackXATransaction: (queryRunner: QueryRunner, config: XATransactionConfig) => Promise<void>;
/**
 * Creates transaction event emitter.
 *
 * @returns {Subject<TransactionEvent>} Event emitter
 *
 * @example
 * ```typescript
 * const eventEmitter = createTransactionEventEmitter();
 * eventEmitter.subscribe(event => console.log(event));
 * ```
 */
export declare const createTransactionEventEmitter: () => Subject<TransactionEvent>;
/**
 * Emits transaction event.
 *
 * @param {Subject<TransactionEvent>} emitter - Event emitter
 * @param {TransactionEventType} type - Event type
 * @param {string} transactionId - Transaction ID
 * @param {any} [data] - Event data
 * @returns {void}
 *
 * @example
 * ```typescript
 * emitTransactionEvent(emitter, TransactionEventType.COMMITTED, 'txn-123');
 * ```
 */
export declare const emitTransactionEvent: (emitter: Subject<TransactionEvent>, type: TransactionEventType, transactionId: string, data?: any) => void;
/**
 * Subscribes to transaction events.
 *
 * @param {Subject<TransactionEvent>} emitter - Event emitter
 * @param {(event: TransactionEvent) => void} handler - Event handler
 * @returns {Observable<TransactionEvent>} Observable stream
 *
 * @example
 * ```typescript
 * subscribeToTransactionEvents(emitter, (event) => {
 *   console.log(`Transaction ${event.transactionId}: ${event.type}`);
 * });
 * ```
 */
export declare const subscribeToTransactionEvents: (emitter: Subject<TransactionEvent>, handler: (event: TransactionEvent) => void) => Observable<TransactionEvent>;
/**
 * Creates transaction lifecycle hooks.
 *
 * @returns {Record<string, Subject<TransactionEvent>>} Lifecycle hooks
 *
 * @example
 * ```typescript
 * const hooks = createTransactionHooks();
 * hooks.beforeCommit.subscribe(event => validateTransaction(event));
 * ```
 */
export declare const createTransactionHooks: () => Record<string, Subject<TransactionEvent>>;
/**
 * Executes saga transaction pattern.
 *
 * @param {SagaStep[]} steps - Saga steps
 * @returns {Promise<any[]>} Results of all steps
 *
 * @example
 * ```typescript
 * const results = await executeSaga([
 *   {
 *     name: 'create-order',
 *     transaction: async () => createOrder(orderData),
 *     compensation: async () => deleteOrder(orderId)
 *   },
 *   {
 *     name: 'reserve-inventory',
 *     transaction: async () => reserveInventory(items),
 *     compensation: async () => releaseInventory(items)
 *   }
 * ]);
 * ```
 */
export declare const executeSaga: (steps: SagaStep[]) => Promise<any[]>;
/**
 * Validates saga configuration.
 *
 * @param {SagaStep[]} steps - Saga steps
 * @returns {boolean} True if valid
 *
 * @example
 * ```typescript
 * const isValid = validateSagaSteps(steps);
 * ```
 */
export declare const validateSagaSteps: (steps: SagaStep[]) => boolean;
/**
 * Gets transaction health metrics.
 *
 * @param {DataSource} dataSource - TypeORM data source
 * @returns {Promise<TransactionHealthMetrics>} Health metrics
 *
 * @example
 * ```typescript
 * const metrics = await getTransactionMetrics(dataSource);
 * console.log(`Active transactions: ${metrics.activeTransactions}`);
 * ```
 */
export declare const getTransactionMetrics: (dataSource: DataSource) => Promise<TransactionHealthMetrics>;
/**
 * Acquires distributed lock for transaction coordination.
 *
 * @param {QueryRunner} queryRunner - Query runner
 * @param {DistributedLockConfig} config - Lock configuration
 * @returns {Promise<boolean>} True if lock acquired
 *
 * @example
 * ```typescript
 * const locked = await acquireDistributedLock(queryRunner, {
 *   resourceName: 'patient-12345',
 *   timeout: 5000,
 *   owner: 'service-instance-1',
 *   exclusive: true
 * });
 * ```
 */
export declare const acquireDistributedLock: (queryRunner: QueryRunner, config: DistributedLockConfig) => Promise<boolean>;
/**
 * Releases distributed lock.
 *
 * @param {QueryRunner} queryRunner - Query runner
 * @param {string} resourceName - Resource name
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await releaseDistributedLock(queryRunner, 'patient-12345');
 * ```
 */
export declare const releaseDistributedLock: (queryRunner: QueryRunner, resourceName: string) => Promise<void>;
declare const _default: {
    createTransaction: (dataSource: DataSource, options?: TransactionOptions) => Promise<QueryRunner>;
    commitTransaction: (queryRunner: QueryRunner, auditMessage?: string) => Promise<void>;
    rollbackTransaction: (queryRunner: QueryRunner, error?: Error) => Promise<void>;
    executeInTransaction: <T>(dataSource: DataSource, work: (manager: EntityManager) => Promise<T>, options?: TransactionOptions) => Promise<T>;
    setTransactionIsolation: (queryRunner: QueryRunner, level: TransactionIsolationLevel) => Promise<void>;
    getTransactionState: (queryRunner: QueryRunner) => Promise<TransactionState>;
    executeTwoPhaseCommit: (config: TwoPhaseCommitConfig) => Promise<boolean>;
    prepareParticipant: (participant: TransactionParticipant, timeout: number) => Promise<boolean>;
    commitParticipant: (participant: TransactionParticipant) => Promise<void>;
    abortParticipant: (participant: TransactionParticipant) => Promise<void>;
    createTransactionCoordinator: (coordinatorId: string, timeout: number) => Omit<TwoPhaseCommitConfig, "participants">;
    validateTwoPhaseConfig: (config: TwoPhaseCommitConfig) => boolean;
    createSavepoint: (queryRunner: QueryRunner, name: string) => Promise<TransactionSavepoint>;
    releaseSavepoint: (savepoint: TransactionSavepoint) => Promise<void>;
    rollbackToSavepoint: (savepoint: TransactionSavepoint) => Promise<void>;
    createSavepointChain: (queryRunner: QueryRunner, names: string[]) => Promise<TransactionSavepoint[]>;
    executeWithSavepoint: <T>(queryRunner: QueryRunner, savepointName: string, work: () => Promise<T>) => Promise<T>;
    createNestedTransaction: (queryRunner: QueryRunner, parentId?: string) => Promise<TransactionContext>;
    commitNestedTransaction: (context: TransactionContext) => Promise<void>;
    rollbackNestedTransaction: (context: TransactionContext) => Promise<void>;
    executeNestedTransaction: <T>(queryRunner: QueryRunner, work: () => Promise<T>, parentId?: string) => Promise<T>;
    getTransactionDepth: (context: TransactionContext) => number;
    executeWithRetry: <T>(dataSource: DataSource, work: (manager: EntityManager) => Promise<T>, policy: TransactionRetryPolicy) => Promise<T>;
    isRetryableError: (error: Error, retryableErrors: string[]) => boolean;
    calculateRetryDelay: (attempt: number, policy: TransactionRetryPolicy) => number;
    createDefaultRetryPolicy: () => TransactionRetryPolicy;
    recoverFailedTransaction: (transactionId: string, compensations: CompensationAction[]) => Promise<void>;
    createXATransaction: (formatId: number, globalId: string, branchId: string) => XATransactionConfig;
    startXATransaction: (queryRunner: QueryRunner, config: XATransactionConfig) => Promise<void>;
    endXATransaction: (queryRunner: QueryRunner, config: XATransactionConfig) => Promise<void>;
    prepareXATransaction: (queryRunner: QueryRunner, config: XATransactionConfig) => Promise<void>;
    commitXATransaction: (queryRunner: QueryRunner, config: XATransactionConfig) => Promise<void>;
    rollbackXATransaction: (queryRunner: QueryRunner, config: XATransactionConfig) => Promise<void>;
    createTransactionEventEmitter: () => Subject<TransactionEvent>;
    emitTransactionEvent: (emitter: Subject<TransactionEvent>, type: TransactionEventType, transactionId: string, data?: any) => void;
    subscribeToTransactionEvents: (emitter: Subject<TransactionEvent>, handler: (event: TransactionEvent) => void) => Observable<TransactionEvent>;
    createTransactionHooks: () => Record<string, Subject<TransactionEvent>>;
    executeSaga: (steps: SagaStep[]) => Promise<any[]>;
    validateSagaSteps: (steps: SagaStep[]) => boolean;
    getTransactionMetrics: (dataSource: DataSource) => Promise<TransactionHealthMetrics>;
    acquireDistributedLock: (queryRunner: QueryRunner, config: DistributedLockConfig) => Promise<boolean>;
    releaseDistributedLock: (queryRunner: QueryRunner, resourceName: string) => Promise<void>;
};
export default _default;
//# sourceMappingURL=nestjs-oracle-transaction-kit.d.ts.map