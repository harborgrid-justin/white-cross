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
exports.CacheConfigService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
let CacheConfigService = class CacheConfigService {
    configService;
    config;
    constructor(configService) {
        this.configService = configService;
        this.config = this.loadConfiguration();
    }
    loadConfiguration() {
        const connectionTimeoutStr = this.configService.get('REDIS_CONNECTION_TIMEOUT', '5000');
        const connectionTimeout = parseInt(connectionTimeoutStr, 10);
        return {
            host: this.configService.get('REDIS_HOST', 'localhost'),
            port: parseInt(this.configService.get('REDIS_PORT', '6379'), 10),
            password: this.configService.get('REDIS_PASSWORD'),
            db: parseInt(this.configService.get('REDIS_DB', '0'), 10),
            ttl: parseInt(this.configService.get('REDIS_TTL_DEFAULT', '300'), 10),
            keyPrefix: this.configService.get('CACHE_KEY_PREFIX', 'cache'),
            enableCompression: this.configService.get('CACHE_ENABLE_COMPRESSION', 'false') === 'true',
            compressionThreshold: parseInt(this.configService.get('CACHE_COMPRESSION_THRESHOLD', '1024'), 10),
            enableL1Cache: this.configService.get('CACHE_ENABLE_L1', 'true') === 'true',
            l1MaxSize: parseInt(this.configService.get('CACHE_L1_MAX_SIZE', '1000'), 10),
            l1Ttl: parseInt(this.configService.get('CACHE_L1_TTL', '60'), 10),
            connectionTimeout: isNaN(connectionTimeout) ? 5000 : connectionTimeout,
            maxRetries: parseInt(this.configService.get('REDIS_MAX_RETRIES', '3'), 10),
            retryDelay: parseInt(this.configService.get('REDIS_RETRY_DELAY', '1000'), 10),
            enableLogging: this.configService.get('CACHE_ENABLE_LOGGING', 'false') === 'true',
        };
    }
    getConfig() {
        return Object.freeze({ ...this.config });
    }
    getRedisConfig() {
        return {
            host: this.config.host,
            port: this.config.port,
            password: this.config.password,
            db: this.config.db,
            connectionTimeout: this.config.connectionTimeout,
            maxRetries: this.config.maxRetries,
            retryDelay: this.config.retryDelay,
        };
    }
    isRedisConfigured() {
        return Boolean(this.config.host && this.config.port);
    }
    isCompressionEnabled() {
        return this.config.enableCompression;
    }
    isL1CacheEnabled() {
        return this.config.enableL1Cache;
    }
    getDefaultTTL() {
        return this.config.ttl;
    }
    getKeyPrefix() {
        return this.config.keyPrefix;
    }
    buildKey(key, namespace) {
        const parts = [this.config.keyPrefix];
        if (namespace) {
            parts.push(namespace);
        }
        parts.push(key);
        return parts.join(':');
    }
    validate() {
        const errors = [];
        if (!this.config.host) {
            errors.push('Redis host is required (REDIS_HOST)');
        }
        if (!this.config.port || this.config.port < 1 || this.config.port > 65535) {
            errors.push('Invalid Redis port (REDIS_PORT)');
        }
        if (this.config.db < 0 || this.config.db > 15) {
            errors.push('Invalid Redis database number (REDIS_DB, must be 0-15)');
        }
        if (this.config.ttl <= 0) {
            errors.push('Invalid default TTL (REDIS_TTL_DEFAULT, must be > 0)');
        }
        if (this.config.l1MaxSize <= 0) {
            errors.push('Invalid L1 cache size (CACHE_L1_MAX_SIZE, must be > 0)');
        }
        if (this.config.connectionTimeout <= 0) {
            errors.push('Invalid connection timeout (REDIS_CONNECTION_TIMEOUT, must be > 0)');
        }
        if (errors.length > 0) {
            throw new Error(`Cache configuration validation failed:\n${errors.join('\n')}`);
        }
    }
    getSummary() {
        return {
            host: this.config.host,
            port: this.config.port,
            db: this.config.db,
            ttl: this.config.ttl,
            keyPrefix: this.config.keyPrefix,
            compression: this.config.enableCompression,
            l1Cache: this.config.enableL1Cache,
            l1MaxSize: this.config.l1MaxSize,
            logging: this.config.enableLogging,
        };
    }
};
exports.CacheConfigService = CacheConfigService;
exports.CacheConfigService = CacheConfigService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], CacheConfigService);
//# sourceMappingURL=cache.config.js.map