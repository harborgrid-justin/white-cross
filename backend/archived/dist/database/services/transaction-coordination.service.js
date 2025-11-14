"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var NestedTransactionManager_1, TwoPhaseCommitCoordinator_1, DistributedTransactionCoordinator_1, TransactionBoundaryManager_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionBoundaryManager = exports.DistributedTransactionCoordinator = exports.TwoPhaseCommitCoordinator = exports.NestedTransactionManager = exports.SavepointStack = exports.DistributedTransactionError = exports.SavepointError = exports.TransactionError = exports.TransactionState = exports.TransactionPropagation = void 0;
exports.createTransaction = createTransaction;
exports.withTransaction = withTransaction;
exports.commitTransaction = commitTransaction;
exports.rollbackTransaction = rollbackTransaction;
exports.isTransactionActive = isTransactionActive;
exports.getTransactionInfo = getTransactionInfo;
exports.isRetryableError = isRetryableError;
exports.retryTransaction = retryTransaction;
exports.executeWithRetry = executeWithRetry;
exports.executeWithCircuitBreaker = executeWithCircuitBreaker;
exports.resilientTransaction = resilientTransaction;
exports.createSavepoint = createSavepoint;
exports.rollbackToSavepoint = rollbackToSavepoint;
exports.releaseSavepoint = releaseSavepoint;
exports.withSavepoint = withSavepoint;
exports.createSavepointStack = createSavepointStack;
exports.getIsolationLevelForOperation = getIsolationLevelForOperation;
exports.readOnlyTransaction = readOnlyTransaction;
exports.serializableTransaction = serializableTransaction;
exports.isIsolationLevelCompatible = isIsolationLevelCompatible;
exports.Transactional = Transactional;
const sequelize_1 = require("sequelize");
const common_1 = require("@nestjs/common");
const events_1 = require("events");
var TransactionPropagation;
(function (TransactionPropagation) {
    TransactionPropagation["REQUIRED"] = "REQUIRED";
    TransactionPropagation["REQUIRES_NEW"] = "REQUIRES_NEW";
    TransactionPropagation["SUPPORTS"] = "SUPPORTS";
    TransactionPropagation["NOT_SUPPORTED"] = "NOT_SUPPORTED";
    TransactionPropagation["MANDATORY"] = "MANDATORY";
    TransactionPropagation["NEVER"] = "NEVER";
})(TransactionPropagation || (exports.TransactionPropagation = TransactionPropagation = {}));
var TransactionState;
(function (TransactionState) {
    TransactionState["PENDING"] = "PENDING";
    TransactionState["PREPARING"] = "PREPARING";
    TransactionState["PREPARED"] = "PREPARED";
    TransactionState["COMMITTING"] = "COMMITTING";
    TransactionState["COMMITTED"] = "COMMITTED";
    TransactionState["ROLLING_BACK"] = "ROLLING_BACK";
    TransactionState["ROLLED_BACK"] = "ROLLED_BACK";
    TransactionState["FAILED"] = "FAILED";
})(TransactionState || (exports.TransactionState = TransactionState = {}));
class TransactionError extends Error {
    transactionId;
    state;
    constructor(message, transactionId, state) {
        super(message);
        this.transactionId = transactionId;
        this.state = state;
        this.name = 'TransactionError';
    }
}
exports.TransactionError = TransactionError;
class SavepointError extends Error {
    savepointName;
    constructor(message, savepointName) {
        super(message);
        this.savepointName = savepointName;
        this.name = 'SavepointError';
    }
}
exports.SavepointError = SavepointError;
class DistributedTransactionError extends Error {
    failedParticipants;
    state;
    constructor(message, failedParticipants, state) {
        super(message);
        this.failedParticipants = failedParticipants;
        this.state = state;
        this.name = 'DistributedTransactionError';
    }
}
exports.DistributedTransactionError = DistributedTransactionError;
async function createTransaction(sequelize, config = {}) {
    const { isolationLevel = sequelize_1.Transaction.ISOLATION_LEVELS.READ_COMMITTED, type = sequelize_1.Transaction.TYPES.DEFERRED, deferrable, autocommit = false, readOnly = false, logging } = config;
    try {
        return await sequelize.transaction({
            isolationLevel,
            type,
            deferrable,
            autocommit,
            readOnly,
            logging
        });
    }
    catch (error) {
        throw new TransactionError(`Failed to create transaction: ${error.message}`, undefined, TransactionState.FAILED);
    }
}
async function withTransaction(sequelize, fn, config = {}) {
    try {
        return await sequelize.transaction({
            isolationLevel: config.isolationLevel,
            type: config.type,
            deferrable: config.deferrable,
            autocommit: config.autocommit,
            logging: config.logging
        }, async (transaction) => {
            return await fn(transaction);
        });
    }
    catch (error) {
        throw new TransactionError(`Transaction failed: ${error.message}`, undefined, TransactionState.ROLLED_BACK);
    }
}
async function commitTransaction(transaction, validate) {
    if (validate) {
        const isValid = await validate();
        if (!isValid) {
            await transaction.rollback();
            throw new TransactionError('Transaction validation failed, rolled back', undefined, TransactionState.ROLLED_BACK);
        }
    }
    try {
        await transaction.commit();
    }
    catch (error) {
        throw new TransactionError(`Failed to commit transaction: ${error.message}`, undefined, TransactionState.FAILED);
    }
}
async function rollbackTransaction(transaction, cleanup) {
    const logger = new common_1.Logger('TransactionRollback');
    try {
        await transaction.rollback();
        logger.debug('Transaction rolled back successfully');
    }
    catch (error) {
        logger.error(`Failed to rollback transaction: ${error.message}`);
        throw new TransactionError(`Rollback failed: ${error.message}`, undefined, TransactionState.FAILED);
    }
    finally {
        if (cleanup) {
            try {
                await cleanup();
            }
            catch (cleanupError) {
                logger.error(`Cleanup failed after rollback: ${cleanupError.message}`);
            }
        }
    }
}
function isTransactionActive(transaction) {
    try {
        return transaction.finished === undefined ||
            transaction.finished === false;
    }
    catch {
        return false;
    }
}
function getTransactionInfo(transaction) {
    return {
        id: transaction.id || 'unknown',
        isolationLevel: transaction.options?.isolationLevel || 'unknown',
        readOnly: transaction.options?.readOnly || false,
        active: isTransactionActive(transaction)
    };
}
function isRetryableError(error, customPatterns = []) {
    const defaultPatterns = [
        /deadlock detected/i,
        /deadlock found/i,
        /circular dependency/i,
        /lock wait timeout/i,
        /lock timeout exceeded/i,
        /timeout waiting for lock/i,
        /could not serialize/i,
        /serialization failure/i,
        /concurrent update/i,
        /snapshot too old/i,
        /connection terminated/i,
        /connection reset/i,
        /connection refused/i,
        /connection pool exhausted/i,
        /ECONNRESET/,
        /ETIMEDOUT/,
        /ECONNREFUSED/,
        /ENOTFOUND/,
        /SequelizeConnectionError/,
        /SequelizeConnectionRefusedError/,
        /SequelizeConnectionTimedOutError/,
        /SequelizeDatabaseError.*deadlock/i,
        /40P01/,
        /40001/,
        /55P03/,
        /ER_LOCK_DEADLOCK/,
        /ER_LOCK_WAIT_TIMEOUT/,
        /ER_LOCK_TABLE_FULL/,
        /statement timeout/i,
        /query timeout/i,
        /execution timeout/i,
    ];
    const patterns = [...defaultPatterns, ...customPatterns];
    const errorMessage = error?.message || error?.toString() || '';
    const errorCode = error?.code || error?.parent?.code || '';
    const sqlState = error?.parent?.sqlState || '';
    return patterns.some(pattern => pattern.test(errorMessage) ||
        pattern.test(errorCode) ||
        pattern.test(sqlState));
}
async function retryTransaction(sequelize, fn, config) {
    const { maxRetries, initialDelay, maxDelay, backoffMultiplier, retryableErrors = [], onRetry } = config;
    let lastError = null;
    const logger = new common_1.Logger('TransactionRetry');
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            return await sequelize.transaction(async (transaction) => {
                return await fn(transaction);
            });
        }
        catch (error) {
            lastError = error;
            if (!isRetryableError(error, retryableErrors)) {
                logger.error(`Non-retryable error encountered: ${error.message}`);
                throw error;
            }
            if (attempt === maxRetries) {
                throw new TransactionError(`Transaction failed after ${maxRetries} retries: ${error.message}`, undefined, TransactionState.FAILED);
            }
            let delay = Math.min(initialDelay * Math.pow(backoffMultiplier, attempt), maxDelay);
            const jitter = delay * (0.5 + Math.random());
            delay = Math.min(jitter, maxDelay);
            if (onRetry) {
                onRetry(attempt + 1, error);
            }
            logger.warn(`Transaction failed with retryable error (${error.message}), ` +
                `retrying in ${Math.round(delay)}ms (attempt ${attempt + 1}/${maxRetries})`);
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
    throw lastError || new TransactionError('Transaction retry failed', undefined, TransactionState.FAILED);
}
async function executeWithRetry(sequelize, fn, maxRetries = 3) {
    return retryTransaction(sequelize, fn, {
        maxRetries,
        initialDelay: 100,
        maxDelay: 5000,
        backoffMultiplier: 2
    });
}
async function executeWithCircuitBreaker(sequelize, fn, failureThreshold = 5, resetTimeout = 60000) {
    const breaker = CircuitBreakerRegistry.getOrCreate('transaction', failureThreshold, resetTimeout);
    if (breaker.isOpen()) {
        throw new TransactionError('Circuit breaker is open');
    }
    try {
        const result = await sequelize.transaction(async (transaction) => {
            return await fn(transaction);
        });
        breaker.recordSuccess();
        return result;
    }
    catch (error) {
        breaker.recordFailure();
        throw error;
    }
}
async function resilientTransaction(sequelize, fn, timeout = 30000, retryConfig) {
    const config = {
        maxRetries: 3,
        initialDelay: 100,
        maxDelay: 5000,
        backoffMultiplier: 2,
        ...retryConfig
    };
    return retryTransaction(sequelize, async (transaction) => {
        return await Promise.race([
            fn(transaction),
            new Promise((_, reject) => setTimeout(() => reject(new TransactionError('Transaction timeout')), timeout))
        ]);
    }, config);
}
async function createSavepoint(transaction, config = {}) {
    const savepointName = config.name ||
        `sp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    try {
        const dialect = transaction.sequelize.getDialect();
        const savepointSQL = dialect === 'postgres' || dialect === 'mysql' || dialect === 'sqlite'
            ? `SAVEPOINT "${savepointName}"`
            : `SAVEPOINT ${savepointName}`;
        await transaction.sequelize.query(savepointSQL, { transaction });
        return savepointName;
    }
    catch (error) {
        throw new SavepointError(`Failed to create savepoint '${savepointName}': ${error.message}`, savepointName);
    }
}
async function rollbackToSavepoint(transaction, savepointName) {
    try {
        const dialect = transaction.sequelize.getDialect();
        const rollbackSQL = dialect === 'postgres' || dialect === 'mysql' || dialect === 'sqlite'
            ? `ROLLBACK TO SAVEPOINT "${savepointName}"`
            : `ROLLBACK TO SAVEPOINT ${savepointName}`;
        await transaction.sequelize.query(rollbackSQL, { transaction });
    }
    catch (error) {
        throw new SavepointError(`Failed to rollback to savepoint '${savepointName}': ${error.message}`, savepointName);
    }
}
async function releaseSavepoint(transaction, savepointName) {
    try {
        const dialect = transaction.sequelize.getDialect();
        const releaseSQL = dialect === 'postgres' || dialect === 'mysql' || dialect === 'sqlite'
            ? `RELEASE SAVEPOINT "${savepointName}"`
            : `RELEASE SAVEPOINT ${savepointName}`;
        await transaction.sequelize.query(releaseSQL, { transaction });
    }
    catch (error) {
        throw new SavepointError(`Failed to release savepoint '${savepointName}': ${error.message}`, savepointName);
    }
}
async function withSavepoint(transaction, fn, savepointName) {
    const spName = await createSavepoint(transaction, { name: savepointName });
    try {
        const result = await fn();
        await releaseSavepoint(transaction, spName);
        return result;
    }
    catch (error) {
        await rollbackToSavepoint(transaction, spName);
        throw error;
    }
}
function createSavepointStack(transaction) {
    return new SavepointStack(transaction);
}
class SavepointStack {
    transaction;
    stack = [];
    constructor(transaction) {
        this.transaction = transaction;
    }
    async push(name) {
        const savepointName = await createSavepoint(this.transaction, { name });
        this.stack.push(savepointName);
        return savepointName;
    }
    async pop() {
        if (this.stack.length === 0) {
            throw new SavepointError('Savepoint stack is empty', '');
        }
        const savepointName = this.stack.pop();
        await releaseSavepoint(this.transaction, savepointName);
        return savepointName;
    }
    async rollbackTop() {
        if (this.stack.length === 0) {
            throw new SavepointError('Savepoint stack is empty', '');
        }
        const savepointName = this.stack[this.stack.length - 1];
        await rollbackToSavepoint(this.transaction, savepointName);
        return savepointName;
    }
    get depth() {
        return this.stack.length;
    }
    async clear() {
        while (this.stack.length > 0) {
            await this.pop();
        }
    }
}
exports.SavepointStack = SavepointStack;
let NestedTransactionManager = NestedTransactionManager_1 = class NestedTransactionManager {
    logger = new common_1.Logger(NestedTransactionManager_1.name);
    contexts = new Map();
    async begin(transaction, config = {}) {
        const { maxDepth = 10, savepointPrefix = 'nested_' } = config;
        const contextId = this.getTransactionId(transaction);
        let context = this.contexts.get(contextId);
        if (!context) {
            context = {
                id: contextId,
                depth: 0,
                savepoints: [],
                startTime: Date.now(),
                metadata: {}
            };
            this.contexts.set(contextId, context);
        }
        if (context.depth >= maxDepth) {
            throw new TransactionError(`Maximum nested transaction depth (${maxDepth}) exceeded`, contextId);
        }
        const savepointName = `${savepointPrefix}${context.depth}`;
        await createSavepoint(transaction, { name: savepointName });
        context.depth++;
        context.savepoints.push(savepointName);
        this.logger.debug(`Created nested transaction at depth ${context.depth}: ${savepointName}`);
        return savepointName;
    }
    async commit(transaction, savepointName) {
        const contextId = this.getTransactionId(transaction);
        const context = this.contexts.get(contextId);
        if (!context) {
            throw new TransactionError('No transaction context found', contextId);
        }
        await releaseSavepoint(transaction, savepointName);
        const index = context.savepoints.indexOf(savepointName);
        if (index > -1) {
            context.savepoints.splice(index, 1);
            context.depth--;
        }
        if (context.depth === 0) {
            this.contexts.delete(contextId);
        }
        this.logger.debug(`Committed nested transaction: ${savepointName}`);
    }
    async rollback(transaction, savepointName) {
        const contextId = this.getTransactionId(transaction);
        const context = this.contexts.get(contextId);
        if (!context) {
            throw new TransactionError('No transaction context found', contextId);
        }
        await rollbackToSavepoint(transaction, savepointName);
        const index = context.savepoints.indexOf(savepointName);
        if (index > -1) {
            context.savepoints.splice(index, 1);
            context.depth--;
        }
        this.logger.debug(`Rolled back nested transaction: ${savepointName}`);
    }
    async execute(transaction, fn, config) {
        const savepointName = await this.begin(transaction, config);
        try {
            const result = await fn(savepointName);
            await this.commit(transaction, savepointName);
            return result;
        }
        catch (error) {
            await this.rollback(transaction, savepointName);
            throw error;
        }
    }
    getDepth(transaction) {
        const contextId = this.getTransactionId(transaction);
        const context = this.contexts.get(contextId);
        return context?.depth || 0;
    }
    getTransactionId(transaction) {
        return transaction.id || 'unknown';
    }
};
exports.NestedTransactionManager = NestedTransactionManager;
exports.NestedTransactionManager = NestedTransactionManager = NestedTransactionManager_1 = __decorate([
    (0, common_1.Injectable)()
], NestedTransactionManager);
let TwoPhaseCommitCoordinator = TwoPhaseCommitCoordinator_1 = class TwoPhaseCommitCoordinator {
    logger = new common_1.Logger(TwoPhaseCommitCoordinator_1.name);
    eventEmitter = new events_1.EventEmitter();
    async execute(config) {
        const { participants, timeout = 30000, coordinatorId = 'coordinator' } = config;
        const transactions = new Map();
        const preparedParticipants = [];
        const state = TransactionState.PENDING;
        try {
            this.logger.log('Starting Phase 1: PREPARE');
            this.eventEmitter.emit('phase', { phase: 1, state: TransactionState.PREPARING });
            for (const participant of participants) {
                const transaction = await participant.sequelize.transaction();
                transactions.set(participant.id, transaction);
                const prepared = await Promise.race([
                    participant.prepare(transaction),
                    new Promise((_, reject) => setTimeout(() => reject(new Error('Prepare timeout')), timeout))
                ]);
                if (prepared) {
                    preparedParticipants.push(participant.id);
                    this.logger.debug(`Participant ${participant.id} prepared successfully`);
                }
                else {
                    throw new Error(`Participant ${participant.id} failed to prepare`);
                }
            }
            this.eventEmitter.emit('phase', { phase: 1, state: TransactionState.PREPARED });
            this.logger.log('Starting Phase 2: COMMIT');
            this.eventEmitter.emit('phase', { phase: 2, state: TransactionState.COMMITTING });
            for (const participant of participants) {
                const transaction = transactions.get(participant.id);
                await Promise.race([
                    participant.commit(transaction),
                    new Promise((_, reject) => setTimeout(() => reject(new Error('Commit timeout')), timeout))
                ]);
                this.logger.debug(`Participant ${participant.id} committed successfully`);
            }
            this.eventEmitter.emit('phase', { phase: 2, state: TransactionState.COMMITTED });
            this.logger.log('Two-phase commit completed successfully');
            return true;
        }
        catch (error) {
            this.logger.error(`Two-phase commit failed: ${error.message}`);
            this.eventEmitter.emit('phase', { phase: 2, state: TransactionState.ROLLING_BACK });
            for (const participant of participants) {
                const transaction = transactions.get(participant.id);
                if (transaction) {
                    try {
                        await participant.rollback(transaction);
                        this.logger.debug(`Participant ${participant.id} rolled back`);
                    }
                    catch (rollbackError) {
                        this.logger.error(`Failed to rollback participant ${participant.id}: ${rollbackError.message}`);
                    }
                }
            }
            this.eventEmitter.emit('phase', { phase: 2, state: TransactionState.ROLLED_BACK });
            throw new DistributedTransactionError('Two-phase commit failed', participants.map(p => p.id).filter(id => !preparedParticipants.includes(id)), TransactionState.ROLLED_BACK);
        }
        finally {
            for (const [id, transaction] of Array.from(transactions)) {
                try {
                    if (isTransactionActive(transaction)) {
                        await transaction.rollback();
                    }
                }
                catch (error) {
                    this.logger.warn(`Error closing transaction for participant ${id}`);
                }
            }
        }
    }
    onPhaseChange(listener) {
        this.eventEmitter.on('phase', listener);
    }
    async prepareParticipant(participant, transaction) {
        try {
            return await participant.prepare(transaction);
        }
        catch (error) {
            this.logger.error(`Failed to prepare participant ${participant.id}: ${error.message}`);
            return false;
        }
    }
    async commitParticipant(participant, transaction) {
        await participant.commit(transaction);
    }
    async rollbackParticipant(participant, transaction) {
        await participant.rollback(transaction);
    }
};
exports.TwoPhaseCommitCoordinator = TwoPhaseCommitCoordinator;
exports.TwoPhaseCommitCoordinator = TwoPhaseCommitCoordinator = TwoPhaseCommitCoordinator_1 = __decorate([
    (0, common_1.Injectable)()
], TwoPhaseCommitCoordinator);
let DistributedTransactionCoordinator = DistributedTransactionCoordinator_1 = class DistributedTransactionCoordinator {
    logger = new common_1.Logger(DistributedTransactionCoordinator_1.name);
    async execute(config, operations) {
        const { databases, compensationHandlers } = config;
        const transactions = new Map();
        const results = new Map();
        const completedDatabases = [];
        try {
            for (const db of databases) {
                const transaction = await db.transaction();
                transactions.set(db, transaction);
            }
            for (const [db, operation] of Array.from(operations)) {
                const transaction = transactions.get(db);
                if (!transaction) {
                    throw new Error(`No transaction found for database`);
                }
                const result = await operation(transaction);
                results.set(db, result);
                completedDatabases.push(db);
            }
            for (const [db, transaction] of Array.from(transactions)) {
                await transaction.commit();
                this.logger.debug(`Committed transaction on database`);
            }
            return results;
        }
        catch (error) {
            this.logger.error(`Distributed transaction failed: ${error.message}`);
            for (const [db, transaction] of Array.from(transactions)) {
                try {
                    if (isTransactionActive(transaction)) {
                        await transaction.rollback();
                    }
                }
                catch (rollbackError) {
                    this.logger.error(`Failed to rollback transaction: ${rollbackError.message}`);
                }
            }
            if (config.sagaPattern && compensationHandlers) {
                await this.executeCompensations(compensationHandlers, results);
            }
            throw new DistributedTransactionError('Distributed transaction failed', databases.map((_, idx) => `db_${idx}`), TransactionState.FAILED);
        }
    }
    async executeCompensations(handlers, completedOperations) {
        this.logger.log('Executing compensation handlers');
        for (const [name, handler] of Array.from(handlers)) {
            try {
                const data = Array.from(completedOperations.values());
                await handler.compensate(data);
                this.logger.debug(`Executed compensation handler: ${name}`);
            }
            catch (error) {
                this.logger.error(`Compensation handler ${name} failed: ${error.message}`);
            }
        }
    }
    async executeSaga(steps) {
        const results = [];
        const completedSteps = [];
        try {
            for (let i = 0; i < steps.length; i++) {
                const step = steps[i];
                const result = await step.execute();
                results.push(result);
                completedSteps.push(i);
                this.logger.debug(`Completed SAGA step ${i + 1}/${steps.length}: ${step.name}`);
            }
            return results;
        }
        catch (error) {
            this.logger.error(`SAGA failed at step ${completedSteps.length + 1}: ${error.message}`);
            for (let i = completedSteps.length - 1; i >= 0; i--) {
                const stepIndex = completedSteps[i];
                const step = steps[stepIndex];
                if (step.compensate) {
                    try {
                        await step.compensate(results[i]);
                        this.logger.debug(`Compensated SAGA step ${stepIndex + 1}: ${step.name}`);
                    }
                    catch (compensationError) {
                        this.logger.error(`Failed to compensate step ${stepIndex + 1}: ${compensationError.message}`);
                    }
                }
            }
            throw error;
        }
    }
    async executeParallel(operations, timeout = 30000) {
        const promises = operations.map(op => Promise.race([
            op(),
            new Promise((_, reject) => setTimeout(() => reject(new Error('Operation timeout')), timeout))
        ]));
        return await Promise.all(promises);
    }
    async coordinateSequential(databases, fn) {
        const results = [];
        const transactions = [];
        try {
            for (let i = 0; i < databases.length; i++) {
                const db = databases[i];
                const transaction = await db.transaction();
                transactions.push(transaction);
                const result = await fn(db, transaction, i);
                results.push(result);
            }
            for (const transaction of transactions) {
                await transaction.commit();
            }
            return results;
        }
        catch (error) {
            for (const transaction of transactions) {
                try {
                    if (isTransactionActive(transaction)) {
                        await transaction.rollback();
                    }
                }
                catch (rollbackError) {
                    this.logger.error('Failed to rollback transaction:', rollbackError);
                }
            }
            throw error;
        }
    }
};
exports.DistributedTransactionCoordinator = DistributedTransactionCoordinator;
exports.DistributedTransactionCoordinator = DistributedTransactionCoordinator = DistributedTransactionCoordinator_1 = __decorate([
    (0, common_1.Injectable)()
], DistributedTransactionCoordinator);
function getIsolationLevelForOperation(operationType) {
    const levels = {
        read: sequelize_1.Transaction.ISOLATION_LEVELS.READ_COMMITTED,
        write: sequelize_1.Transaction.ISOLATION_LEVELS.REPEATABLE_READ,
        critical: sequelize_1.Transaction.ISOLATION_LEVELS.SERIALIZABLE,
        reporting: sequelize_1.Transaction.ISOLATION_LEVELS.READ_UNCOMMITTED
    };
    return levels[operationType] || sequelize_1.Transaction.ISOLATION_LEVELS.READ_COMMITTED;
}
async function readOnlyTransaction(sequelize, fn) {
    return withTransaction(sequelize, fn, {
        isolationLevel: sequelize_1.Transaction.ISOLATION_LEVELS.READ_COMMITTED,
        readOnly: true
    });
}
async function serializableTransaction(sequelize, fn) {
    return withTransaction(sequelize, fn, {
        isolationLevel: sequelize_1.Transaction.ISOLATION_LEVELS.SERIALIZABLE
    });
}
function isIsolationLevelCompatible(requiredLevel, actualLevel) {
    const levels = [
        sequelize_1.Transaction.ISOLATION_LEVELS.READ_UNCOMMITTED,
        sequelize_1.Transaction.ISOLATION_LEVELS.READ_COMMITTED,
        sequelize_1.Transaction.ISOLATION_LEVELS.REPEATABLE_READ,
        sequelize_1.Transaction.ISOLATION_LEVELS.SERIALIZABLE
    ];
    const requiredIndex = levels.indexOf(requiredLevel);
    const actualIndex = levels.indexOf(actualLevel);
    return actualIndex >= requiredIndex;
}
function Transactional(boundary) {
    return function (target, propertyKey, descriptor) {
        const originalMethod = descriptor.value;
        descriptor.value = async function (...args) {
            const sequelize = this.sequelize || this.getSequelize();
            if (!sequelize) {
                throw new Error('Sequelize instance not found');
            }
            const existingTransaction = args.find(arg => arg instanceof sequelize_1.Transaction);
            if (boundary.propagation === TransactionPropagation.NEVER) {
                if (existingTransaction) {
                    throw new TransactionError('Transaction exists but propagation is NEVER');
                }
                return originalMethod.apply(this, args);
            }
            if (boundary.propagation === TransactionPropagation.MANDATORY) {
                if (!existingTransaction) {
                    throw new TransactionError('Transaction required but none found');
                }
                return originalMethod.apply(this, args);
            }
            if (boundary.propagation === TransactionPropagation.NOT_SUPPORTED) {
                const filteredArgs = args.filter(arg => !(arg instanceof sequelize_1.Transaction));
                return originalMethod.apply(this, filteredArgs);
            }
            if (boundary.propagation === TransactionPropagation.SUPPORTS) {
                return originalMethod.apply(this, args);
            }
            const requiresNew = boundary.requiresNew ||
                boundary.propagation === TransactionPropagation.REQUIRES_NEW;
            if (existingTransaction && !requiresNew) {
                return originalMethod.apply(this, args);
            }
            return withTransaction(sequelize, async (transaction) => {
                const newArgs = [...args, transaction];
                return originalMethod.apply(this, newArgs);
            }, {
                isolationLevel: boundary.isolationLevel,
                readOnly: boundary.readOnly
            });
        };
        return descriptor;
    };
}
let TransactionBoundaryManager = TransactionBoundaryManager_1 = class TransactionBoundaryManager {
    logger = new common_1.Logger(TransactionBoundaryManager_1.name);
    boundaries = new Map();
    registerBoundary(name, boundary) {
        this.boundaries.set(name, boundary);
        this.logger.debug(`Registered transaction boundary: ${name}`);
    }
    async executeWithinBoundary(boundaryName, sequelize, fn, existingTransaction) {
        const boundary = this.boundaries.get(boundaryName);
        if (!boundary) {
            throw new TransactionError(`Transaction boundary not found: ${boundaryName}`);
        }
        const shouldCreateNew = boundary.requiresNew ||
            boundary.propagation === TransactionPropagation.REQUIRES_NEW ||
            (boundary.propagation === TransactionPropagation.REQUIRED &&
                !existingTransaction);
        if (shouldCreateNew) {
            return withTransaction(sequelize, async (transaction) => fn(transaction), {
                isolationLevel: boundary.isolationLevel,
                readOnly: boundary.readOnly
            });
        }
        return fn(existingTransaction);
    }
    getBoundary(name) {
        return this.boundaries.get(name);
    }
    removeBoundary(name) {
        this.boundaries.delete(name);
    }
};
exports.TransactionBoundaryManager = TransactionBoundaryManager;
exports.TransactionBoundaryManager = TransactionBoundaryManager = TransactionBoundaryManager_1 = __decorate([
    (0, common_1.Injectable)()
], TransactionBoundaryManager);
class CircuitBreaker {
    failureThreshold;
    resetTimeout;
    failures = 0;
    lastFailureTime = 0;
    state = 'CLOSED';
    constructor(failureThreshold, resetTimeout) {
        this.failureThreshold = failureThreshold;
        this.resetTimeout = resetTimeout;
    }
    isOpen() {
        if (this.state === 'OPEN') {
            if (Date.now() - this.lastFailureTime > this.resetTimeout) {
                this.state = 'HALF_OPEN';
                return false;
            }
            return true;
        }
        return false;
    }
    recordSuccess() {
        this.failures = 0;
        this.state = 'CLOSED';
    }
    recordFailure() {
        this.failures++;
        this.lastFailureTime = Date.now();
        if (this.failures >= this.failureThreshold) {
            this.state = 'OPEN';
        }
    }
}
class CircuitBreakerRegistry {
    static breakers = new Map();
    static getOrCreate(key, failureThreshold, resetTimeout) {
        let breaker = this.breakers.get(key);
        if (!breaker) {
            breaker = new CircuitBreaker(failureThreshold, resetTimeout);
            this.breakers.set(key, breaker);
        }
        return breaker;
    }
}
//# sourceMappingURL=transaction-coordination.service.js.map