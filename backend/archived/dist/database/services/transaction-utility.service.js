"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.__testing__ = exports.TransactionHelper = void 0;
exports.withTransactionRetry = withTransactionRetry;
const sequelize_1 = require("sequelize");
const common_1 = require("@nestjs/common");
const RETRYABLE_ERROR_CODES = new Set([
    '40P01',
    '40001',
    '55P03',
    'ER_LOCK_DEADLOCK',
    'ER_LOCK_WAIT_TIMEOUT',
]);
function isRetryableError(error) {
    if (!error)
        return false;
    if (error.code && RETRYABLE_ERROR_CODES.has(error.code)) {
        return true;
    }
    if (error.original?.code && RETRYABLE_ERROR_CODES.has(error.original.code)) {
        return true;
    }
    const errorMessage = error.message?.toLowerCase() || '';
    return (errorMessage.includes('deadlock') ||
        errorMessage.includes('serialization failure') ||
        errorMessage.includes('lock timeout') ||
        errorMessage.includes('could not serialize'));
}
function calculateDefaultDelay(attempt) {
    const baseDelay = Math.min(1000, 100 * Math.pow(2, attempt));
    const jitter = Math.random() * baseDelay;
    return Math.floor(baseDelay + jitter);
}
function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
function getIsolationLevel(level) {
    const isolationLevels = {
        READ_UNCOMMITTED: sequelize_1.Transaction.ISOLATION_LEVELS.READ_UNCOMMITTED,
        READ_COMMITTED: sequelize_1.Transaction.ISOLATION_LEVELS.READ_COMMITTED,
        REPEATABLE_READ: sequelize_1.Transaction.ISOLATION_LEVELS.REPEATABLE_READ,
        SERIALIZABLE: sequelize_1.Transaction.ISOLATION_LEVELS.SERIALIZABLE,
    };
    return isolationLevels[level] || sequelize_1.Transaction.ISOLATION_LEVELS.READ_COMMITTED;
}
async function withTransactionRetry(sequelize, callback, options = {}) {
    const { maxRetries = 3, isolationLevel = 'READ_COMMITTED', calculateDelay = calculateDefaultDelay, onRetry, onSuccess, onFailure, } = options;
    const logger = new common_1.Logger('TransactionUtility');
    const stats = {
        attempts: 0,
        totalDuration: 0,
        retries: 0,
    };
    const startTime = Date.now();
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        stats.attempts++;
        try {
            const result = await sequelize.transaction({
                isolationLevel: getIsolationLevel(isolationLevel),
            }, async (transaction) => {
                return await callback(transaction);
            });
            const duration = Date.now() - startTime;
            stats.totalDuration = duration;
            if (onSuccess) {
                onSuccess(duration);
            }
            if (duration > 500) {
                logger.warn(`Long-running transaction: ${duration}ms (attempts: ${stats.attempts})`);
            }
            if (attempt > 0) {
                logger.log(`Transaction succeeded after ${attempt} retries (${duration}ms total)`);
            }
            return result;
        }
        catch (error) {
            stats.lastError = error;
            const shouldRetry = isRetryableError(error) && attempt < maxRetries;
            if (shouldRetry) {
                stats.retries++;
                const delay = calculateDelay(attempt);
                logger.warn(`Transaction failed (attempt ${attempt + 1}/${maxRetries + 1}): ${error.message}. Retrying in ${delay}ms...`);
                if (onRetry) {
                    onRetry(attempt, error);
                }
                await sleep(delay);
                continue;
            }
            const duration = Date.now() - startTime;
            stats.totalDuration = duration;
            if (onFailure) {
                onFailure(error, stats.attempts);
            }
            if (attempt >= maxRetries && isRetryableError(error)) {
                logger.error(`Transaction failed after ${maxRetries} retries (${duration}ms total): ${error.message}`);
                throw new Error(`Transaction failed after ${maxRetries} retries due to ${error.message}. This may indicate high database contention.`);
            }
            throw error;
        }
    }
    throw new Error('Transaction retry logic error: exceeded max attempts without throwing');
}
class TransactionHelper {
    sequelize;
    logger = new common_1.Logger('TransactionHelper');
    constructor(sequelize) {
        this.sequelize = sequelize;
    }
    async withRetry(callback, options) {
        return withTransactionRetry(this.sequelize, callback, options);
    }
    async withRepeatableRead(callback, options) {
        return withTransactionRetry(this.sequelize, callback, {
            ...options,
            isolationLevel: 'REPEATABLE_READ',
        });
    }
    async withSerializable(callback, options) {
        return withTransactionRetry(this.sequelize, callback, {
            ...options,
            isolationLevel: 'SERIALIZABLE',
            maxRetries: options?.maxRetries || 5,
        });
    }
    async withParallel(callbacks, options) {
        return withTransactionRetry(this.sequelize, async (transaction) => {
            return Promise.all(callbacks.map((cb) => cb(transaction)));
        }, options);
    }
    async withSequential(callbacks, options) {
        return withTransactionRetry(this.sequelize, async (transaction) => {
            const results = [];
            for (const callback of callbacks) {
                const result = await callback(transaction);
                results.push(result);
            }
            return results;
        }, options);
    }
}
exports.TransactionHelper = TransactionHelper;
exports.__testing__ = {
    isRetryableError,
    calculateDefaultDelay,
    RETRYABLE_ERROR_CODES,
};
//# sourceMappingURL=transaction-utility.service.js.map