"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@nestjs/config");
exports.default = (0, config_1.registerAs)('app', () => {
    const nodeEnv = process.env.NODE_ENV || 'development';
    return {
        env: nodeEnv,
        port: parseInt(process.env.PORT || '3001', 10),
        name: 'White Cross School Health Platform',
        version: '2.0.0',
        apiPrefix: 'api',
        logging: {
            level: process.env.LOG_LEVEL || 'info',
            format: nodeEnv === 'production' ? 'json' : 'text',
            enableConsole: true,
            enableFile: nodeEnv === 'production',
            filePath: process.env.LOG_FILE_PATH,
        },
        websocket: {
            enabled: process.env.FEATURES_ENABLE_WEBSOCKET !== 'false',
            port: parseInt(process.env.WS_PORT || '3002', 10),
            path: process.env.WS_PATH || '/socket.io',
            corsOrigin: process.env.WS_CORS_ORIGIN || 'http://localhost:3000',
            pingTimeout: parseInt(process.env.WS_PING_TIMEOUT || '60000', 10),
            pingInterval: parseInt(process.env.WS_PING_INTERVAL || '25000', 10),
        },
        monitoring: {
            sentryDsn: process.env.SENTRY_DSN,
            enableMetrics: nodeEnv === 'production',
            enableTracing: nodeEnv === 'production',
        },
        timeout: {
            request: parseInt(process.env.REQUEST_TIMEOUT || '30000', 10),
            gracefulShutdown: 10000,
        },
        features: {
            aiSearch: process.env.FEATURES_ENABLE_AI_SEARCH === 'true',
            analytics: process.env.ENABLE_ANALYTICS !== 'false',
            websocket: process.env.FEATURES_ENABLE_WEBSOCKET !== 'false',
            reporting: process.env.ENABLE_REPORTING !== 'false',
            dashboard: process.env.ENABLE_DASHBOARD !== 'false',
            advancedFeatures: process.env.ENABLE_ADVANCED_FEATURES !== 'false',
            enterprise: process.env.ENABLE_ENTERPRISE !== 'false',
            discovery: nodeEnv === 'development' && process.env.ENABLE_DISCOVERY === 'true',
            cliMode: process.env.CLI_MODE === 'true',
        },
        throttle: {
            short: {
                ttl: 1000,
                limit: nodeEnv === 'development' ? 100 : 10,
            },
            medium: {
                ttl: 10000,
                limit: nodeEnv === 'development' ? 500 : 50,
            },
            long: {
                ttl: 60000,
                limit: nodeEnv === 'development' ? 1000 : 100,
            },
        },
    };
});
//# sourceMappingURL=app.config.js.map