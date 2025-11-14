"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppConfigService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const base_1 = require("../base");
let AppConfigService = class AppConfigService extends base_1.BaseService {
    configService;
    cache = new Map();
    constructor(configService) {
        super({ serviceName: 'AppConfigService' });
        this.configService = configService;
        this.logInfo('AppConfigService initialized');
    }
    get(key, defaultValue) {
        const cacheKey = `${key}:${defaultValue}`;
        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey);
        }
        const value = defaultValue !== undefined
            ? this.configService.get(key, defaultValue)
            : this.configService.get(key);
        if (value === undefined) {
            throw new Error(`Configuration key '${key}' not found and no default value provided`);
        }
        this.cache.set(cacheKey, value);
        return value;
    }
    getOrThrow(key) {
        const value = this.configService.get(key);
        if (value === undefined || value === null) {
            const error = `CRITICAL: Required configuration key "${key}" is not set`;
            this.logError(error);
            throw new Error(error);
        }
        return value;
    }
    get app() {
        return this.configService.get('app');
    }
    get environment() {
        return this.app.env;
    }
    get port() {
        return this.app.port;
    }
    get appName() {
        return this.app.name;
    }
    get apiVersion() {
        return this.app.version;
    }
    get apiPrefix() {
        return this.app.apiPrefix;
    }
    get logLevel() {
        return this.app.logging.level;
    }
    get requestTimeout() {
        return this.app.timeout.request;
    }
    get gracefulShutdownTimeout() {
        return this.app.timeout.gracefulShutdown;
    }
    get database() {
        return this.configService.get('database');
    }
    get databaseHost() {
        return this.database.host;
    }
    get databasePort() {
        return this.database.port;
    }
    get databaseName() {
        return this.database.database;
    }
    get databaseUsername() {
        return this.database.username;
    }
    get databasePassword() {
        return this.database.password;
    }
    get isDatabaseSslEnabled() {
        return this.database.ssl;
    }
    get isDatabaseSyncEnabled() {
        return this.database.synchronize;
    }
    get auth() {
        return this.configService.get('auth');
    }
    get jwtSecret() {
        return this.auth.jwt.secret;
    }
    get jwtRefreshSecret() {
        return this.auth.jwt.refreshSecret;
    }
    get jwtExpiresIn() {
        return this.auth.jwt.expiresIn;
    }
    get jwtRefreshExpiresIn() {
        return this.auth.jwt.refreshExpiresIn;
    }
    get jwtIssuer() {
        return this.auth.jwt.issuer;
    }
    get jwtAudience() {
        return this.auth.jwt.audience;
    }
    get security() {
        return this.configService.get('security');
    }
    get corsOrigin() {
        return this.security.cors.origin;
    }
    get corsOrigins() {
        const origin = this.corsOrigin;
        if (Array.isArray(origin)) {
            return origin;
        }
        return origin
            .split(',')
            .map((o) => o.trim())
            .filter(Boolean);
    }
    get isCsrfEnabled() {
        return this.security.csrf.enabled;
    }
    get csrfSecret() {
        return this.security.csrf.secret;
    }
    get encryptionAlgorithm() {
        return this.security.encryption.algorithm;
    }
    get isKeyRotationEnabled() {
        return this.security.keyRotation.enabled;
    }
    get redis() {
        return this.configService.get('redis');
    }
    get redisCache() {
        return this.redis.cache;
    }
    get redisQueue() {
        return this.redis.queue;
    }
    get redisHost() {
        return this.redis.cache.host;
    }
    get redisPort() {
        return this.redis.cache.port;
    }
    get redisPassword() {
        return this.redis.cache.password;
    }
    get redisUsername() {
        return this.redis.cache.username;
    }
    get redisCacheDb() {
        return this.redis.cache.db;
    }
    get redisQueueDb() {
        return this.redis.queue.db;
    }
    get isWebSocketEnabled() {
        return this.app.websocket.enabled;
    }
    get webSocketPort() {
        return this.app.websocket.port;
    }
    get webSocketPath() {
        return this.app.websocket.path;
    }
    get webSocketCorsOrigin() {
        return this.app.websocket.corsOrigin;
    }
    get webSocketPingTimeout() {
        return this.app.websocket.pingTimeout;
    }
    get webSocketPingInterval() {
        return this.app.websocket.pingInterval;
    }
    get sentryDsn() {
        return this.app.monitoring.sentryDsn;
    }
    get isMetricsEnabled() {
        return this.app.monitoring.enableMetrics;
    }
    get isTracingEnabled() {
        return this.app.monitoring.enableTracing;
    }
    get isAiSearchEnabled() {
        return this.app.features.aiSearch;
    }
    get isAnalyticsEnabled() {
        return this.app.features.analytics;
    }
    get isReportingEnabled() {
        return this.app.features.reporting;
    }
    get isDashboardEnabled() {
        return this.app.features.dashboard;
    }
    get isAdvancedFeaturesEnabled() {
        return this.app.features.advancedFeatures;
    }
    get isEnterpriseEnabled() {
        return this.app.features.enterprise;
    }
    get isDiscoveryEnabled() {
        return this.app.features.discovery;
    }
    get isCliMode() {
        return this.app.features.cliMode;
    }
    isFeatureEnabled(feature) {
        return this.get(`features.${feature}`, false);
    }
    get throttle() {
        return this.app.throttle;
    }
    get throttleShort() {
        return this.app.throttle.short;
    }
    get throttleMedium() {
        return this.app.throttle.medium;
    }
    get throttleLong() {
        return this.app.throttle.long;
    }
    get isDevelopment() {
        return this.environment === 'development';
    }
    get isProduction() {
        return this.environment === 'production';
    }
    get isStaging() {
        return this.environment === 'staging';
    }
    get isTest() {
        return this.environment === 'test';
    }
    clearCache() {
        this.cache.clear();
        this.logInfo('Configuration cache cleared');
    }
    getAll() {
        if (this.isProduction) {
            this.logWarning('Attempted to get all configuration in production - blocked');
            return {};
        }
        return {
            app: this.app,
            database: {
                ...this.database,
                password: '[REDACTED]',
            },
            auth: {
                ...this.auth,
                jwt: {
                    ...this.auth.jwt,
                    secret: '[REDACTED]',
                    refreshSecret: '[REDACTED]',
                },
            },
            security: {
                ...this.security,
                csrf: {
                    ...this.security.csrf,
                    secret: '[REDACTED]',
                },
                encryption: {
                    ...this.security.encryption,
                    configKey: '[REDACTED]',
                },
            },
            redis: {
                ...this.redis,
                cache: {
                    ...this.redis.cache,
                    password: '[REDACTED]',
                },
                queue: {
                    ...this.redis.queue,
                    password: '[REDACTED]',
                },
            },
        };
    }
    validateCriticalConfig() {
        const checks = [
            { key: 'database.host', name: 'Database Host' },
            { key: 'database.username', name: 'Database Username' },
            { key: 'database.password', name: 'Database Password' },
            { key: 'database.database', name: 'Database Name' },
            { key: 'auth.jwt.secret', name: 'JWT Secret' },
            { key: 'auth.jwt.refreshSecret', name: 'JWT Refresh Secret' },
            { key: 'security.cors.origin', name: 'CORS Origin' },
        ];
        const errors = [];
        for (const check of checks) {
            const value = this.get(check.key);
            if (!value || value === '') {
                errors.push(`${check.name} (${check.key}) is not configured`);
            }
        }
        if (this.isProduction) {
            if (this.corsOrigins.includes('*')) {
                errors.push('Wildcard CORS origin (*) is not allowed in production');
            }
            if (!this.isDatabaseSslEnabled) {
                errors.push('Database SSL must be enabled in production');
            }
            if (this.isDatabaseSyncEnabled) {
                errors.push('Database sync must be disabled in production (data loss risk)');
            }
            if (!this.isCsrfEnabled) {
                errors.push('CSRF protection must be enabled in production');
            }
        }
        if (errors.length > 0) {
            const errorMessage = '\n' +
                '='.repeat(80) +
                '\n' +
                'CRITICAL CONFIGURATION ERRORS\n' +
                '='.repeat(80) +
                '\n' +
                errors.map((e) => `  - ${e}`).join('\n') +
                '\n' +
                '='.repeat(80) +
                '\n' +
                'Application cannot start with invalid configuration.\n' +
                'Please check your .env file and ensure all required variables are set.\n' +
                '='.repeat(80);
            this.logError(errorMessage);
            throw new Error(errorMessage);
        }
        this.logInfo('Critical configuration validation passed');
    }
};
exports.AppConfigService = AppConfigService;
exports.AppConfigService = AppConfigService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], AppConfigService);
//# sourceMappingURL=app-config.service.js.map