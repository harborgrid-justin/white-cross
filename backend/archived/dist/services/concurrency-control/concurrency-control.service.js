"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var DistributedLockManager_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LockEscalationMonitor = exports.ReadWriteLock = exports.DistributedMutex = exports.LocalMutex = exports.RedisSemaphore = exports.DistributedLockManager = exports.DistributedLockError = exports.DeadlockError = exports.PessimisticLockError = exports.OptimisticLockError = void 0;
exports.addOptimisticLocking = addOptimisticLocking;
exports.optimisticUpdate = optimisticUpdate;
exports.validateOptimisticLock = validateOptimisticLock;
exports.createVersionedWhereClause = createVersionedWhereClause;
exports.incrementVersion = incrementVersion;
exports.compareAndSwap = compareAndSwap;
exports.getCurrentVersion = getCurrentVersion;
exports.resetVersion = resetVersion;
exports.acquireRowLockForUpdate = acquireRowLockForUpdate;
exports.acquireSharedLock = acquireSharedLock;
exports.acquireMultipleRowLocks = acquireMultipleRowLocks;
exports.acquireTableLock = acquireTableLock;
exports.acquireLockWithTimeout = acquireLockWithTimeout;
exports.selectForUpdateSkipLocked = selectForUpdateSkipLocked;
exports.queuedLockAcquisition = queuedLockAcquisition;
exports.isRecordLocked = isRecordLocked;
exports.isDeadlockError = isDeadlockError;
exports.retryOnDeadlock = retryOnDeadlock;
exports.transactionWithDeadlockRetry = transactionWithDeadlockRetry;
exports.analyzeDeadlock = analyzeDeadlock;
const sequelize_1 = require("sequelize");
const common_1 = require("@nestjs/common");
const ioredis_1 = __importDefault(require("ioredis"));
const crypto = __importStar(require("crypto"));
class OptimisticLockError extends Error {
    currentVersion;
    expectedVersion;
    modelName;
    constructor(message, currentVersion, expectedVersion, modelName) {
        super(message);
        this.currentVersion = currentVersion;
        this.expectedVersion = expectedVersion;
        this.modelName = modelName;
        this.name = 'OptimisticLockError';
    }
}
exports.OptimisticLockError = OptimisticLockError;
class PessimisticLockError extends Error {
    timeout;
    constructor(message, timeout = false) {
        super(message);
        this.timeout = timeout;
        this.name = 'PessimisticLockError';
    }
}
exports.PessimisticLockError = PessimisticLockError;
class DeadlockError extends Error {
    attemptNumber;
    constructor(message, attemptNumber) {
        super(message);
        this.attemptNumber = attemptNumber;
        this.name = 'DeadlockError';
    }
}
exports.DeadlockError = DeadlockError;
class DistributedLockError extends Error {
    lockKey;
    constructor(message, lockKey) {
        super(message);
        this.lockKey = lockKey;
        this.name = 'DistributedLockError';
    }
}
exports.DistributedLockError = DistributedLockError;
function addOptimisticLocking(model, versionField = 'version') {
    model.addHook('beforeUpdate', async (instance) => {
        if (instance.changed()) {
            const currentVersion = instance.getDataValue(versionField);
            instance.setDataValue(versionField, currentVersion + 1);
            instance._previousVersion = currentVersion;
        }
    });
    model.addHook('afterUpdate', async (instance) => {
        if (instance._previousVersion !== undefined) {
            const affectedRows = instance.constructor.sequelize?.queryInterface;
            if (affectedRows === 0) {
                throw new OptimisticLockError('Optimistic lock failed - record was modified by another transaction', instance.getDataValue(versionField), instance._previousVersion, model.name);
            }
        }
    });
    return model;
}
async function optimisticUpdate(model, id, updateData, config = {}) {
    const { versionField = 'version', maxRetries = 3, retryDelay = 100, onConflict } = config;
    let lastError = null;
    for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
            const record = await model.findByPk(id);
            if (!record) {
                throw new Error(`Record with id ${id} not found`);
            }
            const currentVersion = record[versionField];
            const [affectedCount, affectedRows] = await model.update({
                ...updateData,
                [versionField]: currentVersion + 1
            }, {
                where: {
                    id,
                    [versionField]: currentVersion
                },
                returning: true
            });
            if (affectedCount === 0) {
                throw new OptimisticLockError('Optimistic lock conflict detected', currentVersion + 1, currentVersion, model.name);
            }
            return affectedRows[0];
        }
        catch (error) {
            lastError = error;
            if (error instanceof OptimisticLockError) {
                if (onConflict) {
                    onConflict(error);
                }
                if (attempt < maxRetries - 1) {
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
function validateOptimisticLock(record, expectedVersion, versionField = 'version') {
    const currentVersion = record[versionField];
    if (currentVersion !== expectedVersion) {
        throw new OptimisticLockError(`Version mismatch: expected ${expectedVersion}, got ${currentVersion}`, currentVersion, expectedVersion, record.constructor.name);
    }
}
function createVersionedWhereClause(id, version, versionField = 'version') {
    return {
        id,
        [versionField]: version
    };
}
async function incrementVersion(model, id, versionField = 'version') {
    const [affectedCount] = await model.update({
        [versionField]: model.sequelize.literal(`${versionField} + 1`)
    }, {
        where: { id }
    });
    if (affectedCount === 0) {
        throw new Error(`Failed to increment version for record ${id}`);
    }
    const record = await model.findByPk(id);
    return record[versionField];
}
async function compareAndSwap(model, id, field, expectedValue, newValue, version) {
    const [affectedCount] = await model.update({
        [field]: newValue,
        version: version + 1
    }, {
        where: {
            id,
            [field]: expectedValue,
            version
        }
    });
    return affectedCount > 0;
}
async function getCurrentVersion(model, id, versionField = 'version') {
    const record = await model.findByPk(id, {
        attributes: [versionField]
    });
    if (!record) {
        throw new Error(`Record with id ${id} not found`);
    }
    return record[versionField];
}
async function resetVersion(model, id, initialVersion = 0, versionField = 'version') {
    await model.update({
        [versionField]: initialVersion
    }, {
        where: { id }
    });
}
async function acquireRowLockForUpdate(model, id, transaction, config = {}) {
    const { timeout = 5000, skipLocked = false, nowait = false } = config;
    const lockClause = skipLocked ? 'FOR UPDATE SKIP LOCKED' :
        nowait ? 'FOR UPDATE NOWAIT' :
            'FOR UPDATE';
    try {
        const record = await model.findByPk(id, {
            lock: sequelize_1.Transaction.LOCK.UPDATE,
            transaction,
            skipLocked,
        });
        if (!record) {
            throw new PessimisticLockError(`Record with id ${id} not found`);
        }
        return record;
    }
    catch (error) {
        if (error.message?.includes('timeout') || error.message?.includes('lock')) {
            throw new PessimisticLockError(`Failed to acquire lock on record ${id}`, true);
        }
        throw error;
    }
}
async function acquireSharedLock(model, id, transaction) {
    const record = await model.findByPk(id, {
        lock: sequelize_1.Transaction.LOCK.SHARE,
        transaction
    });
    if (!record) {
        throw new PessimisticLockError(`Record with id ${id} not found`);
    }
    return record;
}
async function acquireMultipleRowLocks(model, ids, transaction, config = {}) {
    const sortedIds = [...ids].sort((a, b) => {
        if (typeof a === 'string' && typeof b === 'string') {
            return a.localeCompare(b);
        }
        return Number(a) - Number(b);
    });
    const lockedRecords = [];
    for (const id of sortedIds) {
        const record = await acquireRowLockForUpdate(model, id, transaction, config);
        lockedRecords.push(record);
    }
    return lockedRecords;
}
async function acquireTableLock(sequelize, tableName, lockMode, transaction) {
    const query = `LOCK TABLE "${tableName}" IN ${lockMode} MODE`;
    try {
        await sequelize.query(query, { transaction });
    }
    catch (error) {
        throw new PessimisticLockError(`Failed to acquire ${lockMode} lock on table ${tableName}: ${error.message}`);
    }
}
async function acquireLockWithTimeout(lockFunction, timeout) {
    return Promise.race([
        lockFunction(),
        new Promise((resolve) => setTimeout(() => resolve(null), timeout))
    ]);
}
async function selectForUpdateSkipLocked(model, whereClause, transaction, limit) {
    const options = {
        where: whereClause,
        lock: sequelize_1.Transaction.LOCK.UPDATE,
        skipLocked: true,
        transaction
    };
    if (limit) {
        options.limit = limit;
    }
    return await model.findAll(options);
}
async function queuedLockAcquisition(model, id, transaction, queueTimeout = 30000) {
    const startTime = Date.now();
    const pollInterval = 100;
    while (Date.now() - startTime < queueTimeout) {
        try {
            const record = await model.findByPk(id, {
                lock: sequelize_1.Transaction.LOCK.UPDATE,
                transaction,
                skipLocked: true
            });
            if (record) {
                return record;
            }
            await new Promise(resolve => setTimeout(resolve, pollInterval));
        }
        catch (error) {
        }
    }
    return null;
}
async function isRecordLocked(model, id, transaction) {
    try {
        const record = await model.findByPk(id, {
            lock: sequelize_1.Transaction.LOCK.UPDATE,
            transaction,
            skipLocked: true
        });
        return record === null;
    }
    catch (error) {
        return true;
    }
}
let DistributedLockManager = DistributedLockManager_1 = class DistributedLockManager {
    redis;
    logger = new common_1.Logger(DistributedLockManager_1.name);
    locks = new Map();
    constructor(redis) {
        this.redis = redis;
    }
    async acquireLock(config) {
        const { key, ttl, retryCount = 3, retryDelay = 100, clockDriftFactor = 0.01 } = config;
        const identifier = crypto.randomBytes(16).toString('hex');
        const lockKey = `lock:${key}`;
        for (let i = 0; i < retryCount; i++) {
            try {
                const result = await this.redis.set(lockKey, identifier, 'PX', ttl, 'NX');
                if (result === 'OK') {
                    this.locks.set(key, identifier);
                    this.logger.debug(`Acquired distributed lock: ${key}`);
                    return identifier;
                }
                const delay = retryDelay * Math.pow(2, i);
                await new Promise(resolve => setTimeout(resolve, delay));
            }
            catch (error) {
                this.logger.error(`Error acquiring lock ${key}:`, error);
            }
        }
        return null;
    }
    async releaseLock(key, identifier) {
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
        }
        catch (error) {
            this.logger.error(`Error releasing lock ${key}:`, error);
            return false;
        }
    }
    async extendLock(key, identifier, additionalTtl) {
        const lockKey = `lock:${key}`;
        const script = `
      if redis.call("get", KEYS[1]) == ARGV[1] then
        return redis.call("pexpire", KEYS[1], ARGV[2])
      else
        return 0
      end
    `;
        try {
            const result = await this.redis.eval(script, 1, lockKey, identifier, additionalTtl.toString());
            return result === 1;
        }
        catch (error) {
            this.logger.error(`Error extending lock ${key}:`, error);
            return false;
        }
    }
    async hasLock(key) {
        const lockKey = `lock:${key}`;
        const exists = await this.redis.exists(lockKey);
        return exists === 1;
    }
    async getLockTTL(key) {
        const lockKey = `lock:${key}`;
        return await this.redis.pttl(lockKey);
    }
    async acquireLockWithRetry(key, ttl, maxRetries = 5) {
        return await this.acquireLock({
            key,
            ttl,
            retryCount: maxRetries,
            retryDelay: 100
        });
    }
    async withLock(key, ttl, fn) {
        const identifier = await this.acquireLock({ key, ttl });
        if (!identifier) {
            throw new DistributedLockError(`Failed to acquire distributed lock for key: ${key}`, key);
        }
        try {
            return await fn();
        }
        finally {
            await this.releaseLock(key, identifier);
        }
    }
    async redlock(redisClients, key, ttl) {
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
            }
            catch (error) {
                this.logger.warn(`Failed to acquire lock on Redis instance: ${error}`);
            }
        }
        const elapsedTime = Date.now() - startTime;
        const validityTime = ttl - elapsedTime - (ttl * 0.01);
        if (locksAcquired >= quorum && validityTime > 0) {
            return identifier;
        }
        await this.releaseRedlock(redisClients, key, identifier);
        return null;
    }
    async releaseRedlock(redisClients, key, identifier) {
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
            }
            catch (error) {
                this.logger.warn(`Failed to release lock on Redis instance: ${error}`);
            }
        }
    }
};
exports.DistributedLockManager = DistributedLockManager;
exports.DistributedLockManager = DistributedLockManager = DistributedLockManager_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [ioredis_1.default])
], DistributedLockManager);
function isDeadlockError(error) {
    const deadlockPatterns = [
        /deadlock detected/i,
        /deadlock found/i,
        /lock wait timeout exceeded/i,
        /could not serialize access/i,
        /ER_LOCK_DEADLOCK/,
        /40P01/,
        /40001/
    ];
    const errorMessage = error?.message || error?.toString() || '';
    return deadlockPatterns.some(pattern => pattern.test(errorMessage));
}
async function retryOnDeadlock(fn, config) {
    const { maxRetries, initialDelay, maxDelay, backoffMultiplier, jitter = true } = config;
    let lastError = null;
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            return await fn();
        }
        catch (error) {
            lastError = error;
            if (!isDeadlockError(error)) {
                throw error;
            }
            if (attempt === maxRetries) {
                throw new DeadlockError(`Deadlock persisted after ${maxRetries} retries: ${error.message}`, attempt);
            }
            let delay = Math.min(initialDelay * Math.pow(backoffMultiplier, attempt), maxDelay);
            if (jitter) {
                delay = delay * (0.5 + Math.random() * 0.5);
            }
            const logger = new common_1.Logger('DeadlockRetry');
            logger.warn(`Deadlock detected, retrying in ${delay}ms (attempt ${attempt + 1}/${maxRetries})`);
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
    throw lastError || new Error('Retry failed');
}
async function transactionWithDeadlockRetry(sequelize, fn, config) {
    return retryOnDeadlock(async () => {
        return await sequelize.transaction(async (transaction) => {
            return await fn(transaction);
        });
    }, config);
}
async function analyzeDeadlock(error, sequelize) {
    if (!isDeadlockError(error)) {
        return {
            detected: false,
            analysis: 'Not a deadlock error',
            suggestions: []
        };
    }
    const suggestions = [
        'Ensure locks are acquired in consistent order',
        'Reduce transaction duration',
        'Use lower isolation levels if possible',
        'Consider optimistic locking for read-heavy workloads',
        'Review index strategy to reduce lock contention'
    ];
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
    }
    catch (queryError) {
    }
    return {
        detected: true,
        analysis,
        suggestions
    };
}
class RedisSemaphore {
    redis;
    key;
    maxConcurrent;
    timeout;
    logger = new common_1.Logger(RedisSemaphore.name);
    constructor(redis, key, maxConcurrent, timeout = 60000) {
        this.redis = redis;
        this.key = key;
        this.maxConcurrent = maxConcurrent;
        this.timeout = timeout;
    }
    async acquire() {
        const identifier = crypto.randomBytes(16).toString('hex');
        const now = Date.now();
        const lockKey = `semaphore:${this.key}`;
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
            const result = await this.redis.eval(script, 1, lockKey, this.maxConcurrent.toString(), now.toString(), identifier);
            if (result) {
                this.logger.debug(`Acquired semaphore permit: ${this.key}`);
                return identifier;
            }
            return null;
        }
        catch (error) {
            this.logger.error(`Error acquiring semaphore: ${error}`);
            return null;
        }
    }
    async release(identifier) {
        const lockKey = `semaphore:${this.key}`;
        try {
            const result = await this.redis.zrem(lockKey, identifier);
            if (result === 1) {
                this.logger.debug(`Released semaphore permit: ${this.key}`);
                return true;
            }
            return false;
        }
        catch (error) {
            this.logger.error(`Error releasing semaphore: ${error}`);
            return false;
        }
    }
    async getCount() {
        const lockKey = `semaphore:${this.key}`;
        const now = Date.now();
        await this.redis.zremrangebyscore(lockKey, '-inf', now - this.timeout);
        return await this.redis.zcard(lockKey);
    }
    async withPermit(fn, waitTimeout = 30000) {
        const startTime = Date.now();
        let identifier = null;
        while (Date.now() - startTime < waitTimeout) {
            identifier = await this.acquire();
            if (identifier) {
                break;
            }
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        if (!identifier) {
            throw new Error(`Failed to acquire semaphore permit within ${waitTimeout}ms`);
        }
        try {
            return await fn();
        }
        finally {
            await this.release(identifier);
        }
    }
}
exports.RedisSemaphore = RedisSemaphore;
class LocalMutex {
    locked = false;
    queue = [];
    async acquire(timeout) {
        if (!this.locked) {
            this.locked = true;
            return true;
        }
        return new Promise((resolve) => {
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
    release() {
        if (!this.locked) {
            throw new Error('Mutex is not locked');
        }
        const next = this.queue.shift();
        if (next) {
            next();
        }
        else {
            this.locked = false;
        }
    }
    isLocked() {
        return this.locked;
    }
    async withLock(fn, timeout) {
        const acquired = await this.acquire(timeout);
        if (!acquired) {
            throw new Error('Failed to acquire mutex lock');
        }
        try {
            return await fn();
        }
        finally {
            this.release();
        }
    }
}
exports.LocalMutex = LocalMutex;
class DistributedMutex {
    redis;
    key;
    logger = new common_1.Logger(DistributedMutex.name);
    constructor(redis, key) {
        this.redis = redis;
        this.key = key;
    }
    async acquire(ttl = 30000, timeout) {
        const identifier = crypto.randomBytes(16).toString('hex');
        const lockKey = `mutex:${this.key}`;
        const startTime = Date.now();
        while (!timeout || Date.now() - startTime < timeout) {
            const result = await this.redis.set(lockKey, identifier, 'PX', ttl, 'NX');
            if (result === 'OK') {
                this.logger.debug(`Acquired distributed mutex: ${this.key}`);
                return identifier;
            }
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        return null;
    }
    async release(identifier) {
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
        }
        catch (error) {
            this.logger.error(`Error releasing mutex: ${error}`);
            return false;
        }
    }
    async withLock(fn, ttl = 30000, timeout) {
        const identifier = await this.acquire(ttl, timeout);
        if (!identifier) {
            throw new Error(`Failed to acquire distributed mutex: ${this.key}`);
        }
        try {
            return await fn();
        }
        finally {
            await this.release(identifier);
        }
    }
}
exports.DistributedMutex = DistributedMutex;
class ReadWriteLock {
    readers = 0;
    writers = 0;
    writerWaiting = false;
    readerQueue = [];
    writerQueue = [];
    writerPriority;
    constructor(config = {}) {
        this.writerPriority = config.writerPriority ?? false;
    }
    async acquireRead(timeout) {
        if (this.writers === 0 && (!this.writerPriority || !this.writerWaiting)) {
            this.readers++;
            return true;
        }
        return new Promise((resolve) => {
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
    releaseRead() {
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
    async acquireWrite(timeout) {
        if (this.readers === 0 && this.writers === 0) {
            this.writers = 1;
            return true;
        }
        this.writerWaiting = true;
        return new Promise((resolve) => {
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
    releaseWrite() {
        if (this.writers === 0) {
            throw new Error('No active writer to release');
        }
        this.writers = 0;
        if (this.writerPriority && this.writerQueue.length > 0) {
            const next = this.writerQueue.shift();
            if (next) {
                next();
                return;
            }
        }
        if (this.readerQueue.length > 0) {
            const readers = [...this.readerQueue];
            this.readerQueue = [];
            readers.forEach(reader => reader());
        }
        else if (this.writerQueue.length > 0) {
            const next = this.writerQueue.shift();
            if (next) {
                next();
            }
        }
        else {
            this.writerWaiting = false;
        }
    }
    async withReadLock(fn, timeout) {
        const acquired = await this.acquireRead(timeout);
        if (!acquired) {
            throw new Error('Failed to acquire read lock');
        }
        try {
            return await fn();
        }
        finally {
            this.releaseRead();
        }
    }
    async withWriteLock(fn, timeout) {
        const acquired = await this.acquireWrite(timeout);
        if (!acquired) {
            throw new Error('Failed to acquire write lock');
        }
        try {
            return await fn();
        }
        finally {
            this.releaseWrite();
        }
    }
}
exports.ReadWriteLock = ReadWriteLock;
class LockEscalationMonitor {
    config;
    logger = new common_1.Logger(LockEscalationMonitor.name);
    rowLockCounts = new Map();
    constructor(config) {
        this.config = config;
    }
    trackRowLock(tableName) {
        const currentCount = this.rowLockCounts.get(tableName) || 0;
        const newCount = currentCount + 1;
        this.rowLockCounts.set(tableName, newCount);
        if (newCount >= this.config.rowLockThreshold) {
            this.logger.warn(`Row lock threshold reached for table ${tableName}: ${newCount} locks`);
            if (this.config.tableLockAfterThreshold) {
                this.logger.info(`Escalating to table lock for ${tableName}`);
                return false;
            }
        }
        return true;
    }
    releaseRowLock(tableName) {
        const currentCount = this.rowLockCounts.get(tableName) || 0;
        if (currentCount > 0) {
            this.rowLockCounts.set(tableName, currentCount - 1);
        }
    }
    getLockCount(tableName) {
        return this.rowLockCounts.get(tableName) || 0;
    }
    resetLockCount(tableName) {
        this.rowLockCounts.delete(tableName);
    }
    getEscalationRecommendation(tableName) {
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
exports.LockEscalationMonitor = LockEscalationMonitor;
//# sourceMappingURL=concurrency-control.service.js.map