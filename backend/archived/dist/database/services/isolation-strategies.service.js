"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsolationStrategies = exports.SerializationError = exports.LostUpdateError = exports.WriteSkewError = exports.NonRepeatableReadError = exports.PhantomReadError = exports.DirtyReadError = void 0;
exports.withReadUncommitted = withReadUncommitted;
exports.dirtyRead = dirtyRead;
exports.detectDirtyRead = detectDirtyRead;
exports.validateUncommittedRead = validateUncommittedRead;
exports.withReadCommitted = withReadCommitted;
exports.consistentRead = consistentRead;
exports.preventDirtyRead = preventDirtyRead;
exports.verifyReadCommitted = verifyReadCommitted;
exports.stableRead = stableRead;
exports.withRepeatableRead = withRepeatableRead;
exports.repeatableRead = repeatableRead;
exports.detectNonRepeatableRead = detectNonRepeatableRead;
exports.preventNonRepeatableRead = preventNonRepeatableRead;
exports.createReadSnapshot = createReadSnapshot;
exports.withSerializable = withSerializable;
exports.serializableRead = serializableRead;
exports.detectSerializationConflict = detectSerializationConflict;
exports.preventPhantomRead = preventPhantomRead;
exports.createSnapshotContext = createSnapshotContext;
exports.readAtSnapshot = readAtSnapshot;
exports.validateSnapshotConsistency = validateSnapshotConsistency;
exports.withSnapshotIsolation = withSnapshotIsolation;
exports.createVersionSnapshot = createVersionSnapshot;
exports.readVersion = readVersion;
exports.getVersionHistory = getVersionHistory;
exports.garbageCollectVersions = garbageCollectVersions;
exports.detectPhantomRead = detectPhantomRead;
exports.preventPhantomReadWithTableLock = preventPhantomReadWithTableLock;
exports.detectWriteSkew = detectWriteSkew;
exports.preventWriteSkew = preventWriteSkew;
exports.validateConstraint = validateConstraint;
exports.preventLostUpdate = preventLostUpdate;
exports.detectLostUpdate = detectLostUpdate;
exports.atomicCompareAndSwap = atomicCompareAndSwap;
exports.upgradeIsolationLevel = upgradeIsolationLevel;
exports.downgradeIsolationLevel = downgradeIsolationLevel;
exports.detectConflict = detectConflict;
exports.resolveConflict = resolveConflict;
const sequelize_1 = require("sequelize");
const common_1 = require("@nestjs/common");
class DirtyReadError extends Error {
    recordId;
    constructor(message, recordId) {
        super(message);
        this.recordId = recordId;
        this.name = 'DirtyReadError';
    }
}
exports.DirtyReadError = DirtyReadError;
class PhantomReadError extends Error {
    query;
    constructor(message, query) {
        super(message);
        this.query = query;
        this.name = 'PhantomReadError';
    }
}
exports.PhantomReadError = PhantomReadError;
class NonRepeatableReadError extends Error {
    recordId;
    versions;
    constructor(message, recordId, versions) {
        super(message);
        this.recordId = recordId;
        this.versions = versions;
        this.name = 'NonRepeatableReadError';
    }
}
exports.NonRepeatableReadError = NonRepeatableReadError;
class WriteSkewError extends Error {
    constraint;
    constructor(message, constraint) {
        super(message);
        this.constraint = constraint;
        this.name = 'WriteSkewError';
    }
}
exports.WriteSkewError = WriteSkewError;
class LostUpdateError extends Error {
    recordId;
    expectedVersion;
    constructor(message, recordId, expectedVersion) {
        super(message);
        this.recordId = recordId;
        this.expectedVersion = expectedVersion;
        this.name = 'LostUpdateError';
    }
}
exports.LostUpdateError = LostUpdateError;
class SerializationError extends Error {
    conflictingTransactions;
    constructor(message, conflictingTransactions) {
        super(message);
        this.conflictingTransactions = conflictingTransactions;
        this.name = 'SerializationError';
    }
}
exports.SerializationError = SerializationError;
async function withReadUncommitted(sequelize, fn) {
    const logger = new common_1.Logger('IsolationStrategy::ReadUncommitted');
    logger.warn('Using READ UNCOMMITTED isolation - dirty reads are possible');
    return sequelize.transaction({ isolationLevel: sequelize_1.IsolationLevel.READ_UNCOMMITTED }, async (transaction) => fn(transaction));
}
async function dirtyRead(model, id, transaction) {
    const logger = new common_1.Logger('IsolationStrategy::DirtyRead');
    logger.debug(`Performing dirty read on ${model.name} ${id}`);
    await transaction.sequelize.query('SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED', { transaction });
    return model.findByPk(id, { transaction });
}
async function detectDirtyRead(model, id, transaction) {
    const uncommittedData = await model.findByPk(id, { transaction });
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
async function validateUncommittedRead(results, validationRules) {
    const warnings = [];
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
async function withReadCommitted(sequelize, fn) {
    return sequelize.transaction({ isolationLevel: sequelize_1.IsolationLevel.READ_COMMITTED }, async (transaction) => fn(transaction));
}
async function consistentRead(model, options, transaction) {
    const logger = new common_1.Logger('IsolationStrategy::ConsistentRead');
    if (transaction.options.isolationLevel !== sequelize_1.IsolationLevel.READ_COMMITTED) {
        logger.warn('Transaction not using READ COMMITTED isolation');
    }
    return model.findAll({ ...options, transaction });
}
async function preventDirtyRead(model, id, transaction) {
    return model.findByPk(id, {
        transaction,
        lock: sequelize_1.Transaction.LOCK.SHARE
    });
}
async function verifyReadCommitted(transaction) {
    const sequelize = transaction.sequelize;
    if (sequelize.getDialect() === 'postgres') {
        const [result] = await sequelize.query('SELECT current_setting(\'transaction_isolation\')', { transaction });
        const isolation = result[0]?.current_setting;
        return isolation === 'read committed';
    }
    return transaction.options.isolationLevel === sequelize_1.IsolationLevel.READ_COMMITTED;
}
async function stableRead(model, id, transaction, maxRetries = 3) {
    let previousVersion = null;
    let currentVersion;
    for (let attempt = 0; attempt < maxRetries; attempt++) {
        currentVersion = await model.findByPk(id, { transaction });
        if (attempt > 0 && JSON.stringify(previousVersion) !== JSON.stringify(currentVersion)) {
            await new Promise(resolve => setTimeout(resolve, 50 * Math.pow(2, attempt)));
            previousVersion = currentVersion;
            continue;
        }
        return currentVersion;
    }
    return currentVersion;
}
async function withRepeatableRead(sequelize, fn) {
    return sequelize.transaction({ isolationLevel: sequelize_1.IsolationLevel.REPEATABLE_READ }, async (transaction) => fn(transaction));
}
async function repeatableRead(model, id, transaction) {
    return model.findByPk(id, {
        transaction,
        lock: sequelize_1.Transaction.LOCK.SHARE
    });
}
async function detectNonRepeatableRead(model, id, transaction, readCount = 3) {
    const logger = new common_1.Logger('IsolationStrategy::DetectNonRepeatableRead');
    const reads = [];
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
async function preventNonRepeatableRead(model, where, transaction) {
    return model.findAll({
        where,
        transaction,
        lock: sequelize_1.Transaction.LOCK.SHARE
    });
}
async function createReadSnapshot(model, ids, transaction) {
    const snapshot = new Map();
    for (const id of ids) {
        const record = await model.findByPk(id, {
            transaction,
            lock: sequelize_1.Transaction.LOCK.SHARE
        });
        if (record) {
            snapshot.set(id, record);
        }
    }
    return snapshot;
}
async function withSerializable(sequelize, fn) {
    return sequelize.transaction({ isolationLevel: sequelize_1.IsolationLevel.SERIALIZABLE }, async (transaction) => fn(transaction));
}
async function serializableRead(model, options, transaction) {
    return model.findAll({
        ...options,
        transaction,
        lock: sequelize_1.Transaction.LOCK.UPDATE
    });
}
async function detectSerializationConflict(transaction, operations) {
    const logger = new common_1.Logger('IsolationStrategy::SerializationConflict');
    const writes = operations.filter(op => op.operation === 'WRITE');
    const reads = operations.filter(op => op.operation === 'READ');
    const conflicts = [];
    for (const write of writes) {
        const conflictingReads = reads.filter(read => read.model === write.model && read.recordId === write.recordId);
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
async function preventPhantomRead(model, where, transaction) {
    return model.findAll({
        where,
        transaction,
        lock: sequelize_1.Transaction.LOCK.UPDATE
    });
}
async function createSnapshotContext(sequelize, transactionId) {
    return {
        transactionId,
        snapshotTime: Date.now(),
        visibleVersions: new Map(),
        isolationLevel: sequelize_1.IsolationLevel.REPEATABLE_READ
    };
}
async function readAtSnapshot(model, id, snapshotContext, transaction) {
    const logger = new common_1.Logger('IsolationStrategy::SnapshotRead');
    const record = await model.findByPk(id, {
        transaction,
        lock: sequelize_1.Transaction.LOCK.SHARE
    });
    if (record && 'version' in record) {
        const version = record.version;
        snapshotContext.visibleVersions.set(id.toString(), version);
    }
    logger.debug(`Read snapshot for ${model.name}:${id} at ${snapshotContext.snapshotTime}`);
    return record;
}
async function validateSnapshotConsistency(snapshotContext, model, ids, transaction) {
    for (const id of ids) {
        const expectedVersion = snapshotContext.visibleVersions.get(id.toString());
        if (expectedVersion !== undefined) {
            const currentRecord = await model.findByPk(id, { transaction });
            if (currentRecord && 'version' in currentRecord) {
                const currentVersion = currentRecord.version;
                if (currentVersion !== expectedVersion) {
                    return false;
                }
            }
        }
    }
    return true;
}
async function withSnapshotIsolation(sequelize, fn) {
    return sequelize.transaction({ isolationLevel: sequelize_1.IsolationLevel.REPEATABLE_READ }, async (transaction) => {
        const snapshot = await createSnapshotContext(sequelize, transaction.id);
        return fn(transaction, snapshot);
    });
}
async function createVersionSnapshot(model, id, transaction) {
    const record = await model.findByPk(id, { transaction });
    if (!record) {
        return null;
    }
    return {
        id: id.toString(),
        version: record.version || 0,
        data: record.toJSON(),
        timestamp: Date.now(),
        transactionId: transaction.id
    };
}
async function readVersion(model, id, version, transaction) {
    const record = await model.findOne({
        where: {
            id,
            version
        },
        transaction
    });
    return record;
}
async function getVersionHistory(model, id, transaction) {
    const snapshot = await createVersionSnapshot(model, id, transaction);
    return snapshot ? [snapshot] : [];
}
async function garbageCollectVersions(model, retentionDays, transaction) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - retentionDays);
    const logger = new common_1.Logger('IsolationStrategy::GarbageCollect');
    logger.log(`Garbage collecting versions older than ${cutoffDate.toISOString()}`);
    return 0;
}
async function detectPhantomRead(model, where, transaction, iterations = 3) {
    const logger = new common_1.Logger('IsolationStrategy::DetectPhantomRead');
    const resultSets = [];
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
async function preventPhantomReadWithTableLock(model, where, transaction) {
    const sequelize = transaction.sequelize;
    const tableName = model.getTableName();
    await sequelize.query(`LOCK TABLE "${tableName}" IN SHARE MODE`, { transaction });
    return model.findAll({ where, transaction });
}
async function detectWriteSkew(config, model, transaction) {
    const logger = new common_1.Logger('IsolationStrategy::WriteSkew');
    const records = await model.findAll({ transaction });
    const constraintSatisfied = await config.constraintCheck(records);
    if (!constraintSatisfied) {
        logger.warn(`Write skew detected: constraint ${config.constraintName} violated`);
        return true;
    }
    return false;
}
async function preventWriteSkew(config, model, where, transaction) {
    const logger = new common_1.Logger('IsolationStrategy::PreventWriteSkew');
    if (config.preventionStrategy === 'LOCK') {
        const records = await model.findAll({
            where,
            transaction,
            lock: sequelize_1.Transaction.LOCK.UPDATE
        });
        logger.debug(`Locked ${records.length} records to prevent write skew`);
        return records;
    }
    return model.findAll({ where, transaction });
}
async function validateConstraint(model, constraint, transaction) {
    const records = await model.findAll({
        transaction,
        lock: sequelize_1.Transaction.LOCK.SHARE
    });
    return constraint(records);
}
async function preventLostUpdate(model, id, updates, expectedVersion, transaction) {
    const [affectedCount, affectedRows] = await model.update({
        ...updates,
        version: expectedVersion + 1
    }, {
        where: {
            id,
            version: expectedVersion
        },
        transaction,
        returning: true
    });
    if (affectedCount === 0) {
        throw new LostUpdateError('Lost update prevented - record version mismatch', id.toString(), expectedVersion);
    }
    return affectedRows[0];
}
async function detectLostUpdate(model, id, originalVersion, transaction) {
    const currentRecord = await model.findByPk(id, { transaction });
    if (!currentRecord) {
        return false;
    }
    const currentVersion = currentRecord.version || 0;
    return currentVersion !== originalVersion;
}
async function atomicCompareAndSwap(model, id, field, expectedValue, newValue, transaction) {
    const [affectedCount] = await model.update({ [field]: newValue }, {
        where: {
            id,
            [field]: expectedValue
        },
        transaction
    });
    return affectedCount > 0;
}
async function upgradeIsolationLevel(transaction, targetLevel) {
    const logger = new common_1.Logger('IsolationStrategy::Upgrade');
    const sequelize = transaction.sequelize;
    const levelMap = {
        [sequelize_1.IsolationLevel.READ_UNCOMMITTED]: 'READ UNCOMMITTED',
        [sequelize_1.IsolationLevel.READ_COMMITTED]: 'READ COMMITTED',
        [sequelize_1.IsolationLevel.REPEATABLE_READ]: 'REPEATABLE READ',
        [sequelize_1.IsolationLevel.SERIALIZABLE]: 'SERIALIZABLE'
    };
    const levelStr = levelMap[targetLevel];
    if (sequelize.getDialect() === 'postgres') {
        await sequelize.query(`SET TRANSACTION ISOLATION LEVEL ${levelStr}`, {
            transaction
        });
        logger.log(`Upgraded isolation level to ${levelStr}`);
    }
    else {
        logger.warn('Isolation level upgrade not supported for this database');
    }
}
async function downgradeIsolationLevel(transaction, targetLevel) {
    const logger = new common_1.Logger('IsolationStrategy::Downgrade');
    logger.warn('Downgrading isolation level - may introduce anomalies');
    await upgradeIsolationLevel(transaction, targetLevel);
}
async function detectConflict(model, id, transaction) {
    const logger = new common_1.Logger('IsolationStrategy::ConflictDetection');
    try {
        const record = await model.findByPk(id, {
            transaction,
            lock: sequelize_1.Transaction.LOCK.UPDATE,
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
    }
    catch (error) {
        logger.error('Conflict detection error', error);
        return {
            hasConflict: true,
            conflictType: 'SERIALIZATION',
            details: error.message,
            conflictingTransactions: []
        };
    }
}
async function resolveConflict(conflictResult, strategy, retryFn) {
    const logger = new common_1.Logger('IsolationStrategy::ConflictResolution');
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
exports.IsolationStrategies = {
    withReadUncommitted,
    dirtyRead,
    detectDirtyRead,
    validateUncommittedRead,
    withReadCommitted,
    consistentRead,
    preventDirtyRead,
    verifyReadCommitted,
    stableRead,
    withRepeatableRead,
    repeatableRead,
    detectNonRepeatableRead,
    preventNonRepeatableRead,
    createReadSnapshot,
    withSerializable,
    serializableRead,
    detectSerializationConflict,
    preventPhantomRead,
    createSnapshotContext,
    readAtSnapshot,
    validateSnapshotConsistency,
    withSnapshotIsolation,
    createVersionSnapshot,
    readVersion,
    getVersionHistory,
    garbageCollectVersions,
    detectPhantomRead,
    preventPhantomReadWithTableLock,
    detectWriteSkew,
    preventWriteSkew,
    validateConstraint,
    preventLostUpdate,
    detectLostUpdate,
    atomicCompareAndSwap,
    upgradeIsolationLevel,
    downgradeIsolationLevel,
    detectConflict,
    resolveConflict
};
//# sourceMappingURL=isolation-strategies.service.js.map