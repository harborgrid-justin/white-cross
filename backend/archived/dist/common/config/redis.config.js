"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@nestjs/config");
exports.default = (0, config_1.registerAs)('redis', () => {
    const host = process.env.REDIS_HOST || 'localhost';
    const port = parseInt(process.env.REDIS_PORT || '6379', 10);
    const password = process.env.REDIS_PASSWORD || undefined;
    const username = process.env.REDIS_USERNAME || undefined;
    return {
        cache: {
            host,
            port,
            password,
            username,
            db: parseInt(process.env.REDIS_DB || '0', 10),
            ttl: parseInt(process.env.REDIS_TTL_DEFAULT || '300', 10),
            keyPrefix: process.env.CACHE_KEY_PREFIX || 'cache',
            enableCompression: process.env.CACHE_ENABLE_COMPRESSION === 'true',
            compressionThreshold: parseInt(process.env.CACHE_COMPRESSION_THRESHOLD || '1024', 10),
            enableL1Cache: process.env.CACHE_ENABLE_L1 !== 'false',
            l1MaxSize: parseInt(process.env.CACHE_L1_MAX_SIZE || '1000', 10),
            l1Ttl: parseInt(process.env.CACHE_L1_TTL || '60', 10),
            connectionTimeout: parseInt(process.env.REDIS_CONNECTION_TIMEOUT || '5000', 10),
            maxRetries: parseInt(process.env.REDIS_MAX_RETRIES || '3', 10),
            retryDelay: parseInt(process.env.REDIS_RETRY_DELAY || '1000', 10),
            enableLogging: process.env.CACHE_ENABLE_LOGGING === 'true',
        },
        queue: {
            host,
            port,
            password,
            username,
            db: parseInt(process.env.REDIS_QUEUE_DB || '1', 10),
            keyPrefix: 'msg-queue',
            maxRetries: 20,
        },
        connection: {
            enableReadyCheck: true,
            lazyConnect: false,
            keepAlive: 30000,
            family: 4,
        },
    };
});
//# sourceMappingURL=redis.config.js.map