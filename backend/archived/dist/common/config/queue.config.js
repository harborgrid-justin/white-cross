"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@nestjs/config");
exports.default = (0, config_1.registerAs)('queue', () => {
    return {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379', 10),
        password: process.env.REDIS_PASSWORD || undefined,
        username: process.env.REDIS_USERNAME || undefined,
        db: parseInt(process.env.REDIS_QUEUE_DB || '1', 10),
        connectionTimeout: parseInt(process.env.REDIS_CONNECTION_TIMEOUT || '5000', 10),
        maxRetries: parseInt(process.env.REDIS_MAX_RETRIES || '3', 10),
        retryDelay: parseInt(process.env.REDIS_RETRY_DELAY || '1000', 10),
        keyPrefix: 'bull',
        concurrency: {
            delivery: parseInt(process.env.QUEUE_CONCURRENCY_DELIVERY || '10', 10),
            notification: parseInt(process.env.QUEUE_CONCURRENCY_NOTIFICATION || '15', 10),
            encryption: parseInt(process.env.QUEUE_CONCURRENCY_ENCRYPTION || '5', 10),
            indexing: parseInt(process.env.QUEUE_CONCURRENCY_INDEXING || '3', 10),
            batch: parseInt(process.env.QUEUE_CONCURRENCY_BATCH || '2', 10),
            cleanup: parseInt(process.env.QUEUE_CONCURRENCY_CLEANUP || '1', 10),
        },
        defaultJobOptions: {
            attempts: 3,
            backoff: {
                type: 'exponential',
                delay: 1000,
            },
            removeOnComplete: 100,
            removeOnFail: 500,
        },
        rateLimiter: {
            enabled: process.env.QUEUE_RATE_LIMITER_ENABLED !== 'false',
            max: parseInt(process.env.QUEUE_RATE_LIMITER_MAX || '100', 10),
            duration: parseInt(process.env.QUEUE_RATE_LIMITER_DURATION || '60000', 10),
        },
    };
});
//# sourceMappingURL=queue.config.js.map