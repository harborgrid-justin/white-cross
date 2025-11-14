"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@nestjs/config");
exports.default = (0, config_1.registerAs)('cache', () => {
    return {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379', 10),
        password: process.env.REDIS_PASSWORD || undefined,
        username: process.env.REDIS_USERNAME || undefined,
        db: parseInt(process.env.REDIS_DB || '0', 10),
        connectionTimeout: parseInt(process.env.REDIS_CONNECTION_TIMEOUT || '5000', 10),
        maxRetries: parseInt(process.env.REDIS_MAX_RETRIES || '3', 10),
        retryDelay: parseInt(process.env.REDIS_RETRY_DELAY || '1000', 10),
        keyPrefix: process.env.CACHE_KEY_PREFIX || 'cache',
        defaultTtl: parseInt(process.env.CACHE_DEFAULT_TTL || '300000', 10),
        enableCompression: process.env.CACHE_ENABLE_COMPRESSION === 'true',
        compressionThreshold: parseInt(process.env.CACHE_COMPRESSION_THRESHOLD || '1024', 10),
        enableL1: process.env.CACHE_ENABLE_L1 !== 'false',
        l1MaxSize: parseInt(process.env.CACHE_L1_MAX_SIZE || '1000', 10),
        l1Ttl: parseInt(process.env.CACHE_L1_TTL || '60', 10),
        enableLogging: process.env.CACHE_ENABLE_LOGGING === 'true',
        warmingEnabled: process.env.CACHE_WARMING_ENABLED === 'true',
        maxSize: parseInt(process.env.CACHE_MAX_SIZE || '1000', 10),
    };
});
//# sourceMappingURL=cache.config.js.map