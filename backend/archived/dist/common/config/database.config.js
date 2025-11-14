"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@nestjs/config");
exports.default = (0, config_1.registerAs)('database', () => {
    const nodeEnv = process.env.NODE_ENV || 'development';
    const isTest = nodeEnv === 'test';
    const isProduction = nodeEnv === 'production';
    return {
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT || '5432', 10),
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: isTest ? process.env.DB_NAME_TEST : process.env.DB_NAME,
        ssl: process.env.DB_SSL === 'true' || isProduction,
        synchronize: process.env.DB_SYNC === 'true' && !isProduction,
        force: process.env.DB_SYNC === 'true' && !isProduction,
        logging: process.env.DB_LOGGING === 'true',
        pool: {
            min: parseInt(process.env.DB_POOL_MIN || '2', 10),
            max: parseInt(process.env.DB_POOL_MAX || (isProduction ? '50' : '10'), 10),
            acquireTimeoutMillis: parseInt(process.env.DB_ACQUIRE_TIMEOUT || '30000', 10),
            idleTimeoutMillis: parseInt(process.env.DB_IDLE_TIMEOUT || '10000', 10),
            evict: parseInt(process.env.DB_POOL_EVICT || '1000', 10),
            handleDisconnects: true,
        },
        benchmark: process.env.DB_BENCHMARK === 'true' || isProduction,
        retry: {
            max: parseInt(process.env.DB_RETRY_MAX || '3', 10),
            match: [
                /ETIMEDOUT/,
                /EHOSTUNREACH/,
                /ECONNRESET/,
                /ECONNREFUSED/,
                /EHOSTDOWN/,
                /ENETDOWN/,
                /ENETUNREACH/,
                /EAI_AGAIN/,
            ],
        },
        dialectOptions: {
            statement_timeout: parseInt(process.env.DB_STATEMENT_TIMEOUT || '30000', 10),
            idle_in_transaction_session_timeout: parseInt(process.env.DB_IDLE_IN_TRANSACTION_TIMEOUT || '30000', 10),
        },
    };
});
//# sourceMappingURL=database.config.js.map