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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheConnectionService = void 0;
const common_1 = require("@nestjs/common");
const ioredis_1 = __importDefault(require("ioredis"));
const cache_config_1 = require("./cache.config");
const base_1 = require("../../common/base");
const logger_service_1 = require("../../common/logging/logger.service");
let CacheConnectionService = class CacheConnectionService extends base_1.BaseService {
    cacheConfig;
    redis = null;
    reconnectAttempts = 0;
    isHealthy = true;
    lastError;
    constructor(logger, cacheConfig) {
        super({
            serviceName: 'CacheConnectionService',
            logger,
            enableAuditLogging: true,
        });
        this.cacheConfig = cacheConfig;
    }
    getClient() {
        return this.redis;
    }
    isConnected() {
        return this.isHealthy && this.redis !== null;
    }
    getLastError() {
        return this.lastError;
    }
    getReconnectAttempts() {
        return this.reconnectAttempts;
    }
    async connect() {
        const config = this.cacheConfig.getRedisConfig();
        try {
            this.redis = new ioredis_1.default({
                host: config.host,
                port: config.port,
                password: config.password,
                db: config.db,
                connectTimeout: config.connectionTimeout,
                retryStrategy: (times) => {
                    if (times > config.maxRetries) {
                        this.logError('Redis connection failed after max retries');
                        return null;
                    }
                    const delay = Math.min(times * config.retryDelay, 10000);
                    this.logWarning(`Retrying Redis connection in ${delay}ms (attempt ${times})`);
                    return delay;
                },
                maxRetriesPerRequest: 3,
                enableReadyCheck: true,
                lazyConnect: false,
            });
            this.setupEventHandlers();
            await this.redis.ping();
            this.logInfo('Redis connection established');
        }
        catch (error) {
            this.logError('Failed to connect to Redis', error);
            this.isHealthy = false;
            this.lastError = error;
            throw error;
        }
    }
    async disconnect() {
        if (this.redis) {
            await this.redis.quit();
            this.redis = null;
            this.logInfo('Redis disconnected');
        }
    }
    async checkHealth() {
        if (!this.redis) {
            return -1;
        }
        try {
            const start = Date.now();
            await this.redis.ping();
            return Date.now() - start;
        }
        catch (error) {
            this.logError('Redis health check failed:', error);
            this.isHealthy = false;
            this.lastError = error;
            return -1;
        }
    }
    async onModuleDestroy() {
        await this.disconnect();
    }
    setupEventHandlers() {
        if (!this.redis) {
            return;
        }
        this.redis.on('error', (error) => {
            this.logError('Redis error:', error);
            this.isHealthy = false;
            this.lastError = error;
        });
        this.redis.on('connect', () => {
            this.logInfo('Redis connected');
            this.isHealthy = true;
            this.reconnectAttempts = 0;
        });
        this.redis.on('ready', () => {
            this.logInfo('Redis ready');
        });
        this.redis.on('close', () => {
            this.logWarning('Redis connection closed');
            this.isHealthy = false;
        });
        this.redis.on('reconnecting', () => {
            this.reconnectAttempts++;
            this.logInfo(`Redis reconnecting (attempt ${this.reconnectAttempts})`);
        });
    }
};
exports.CacheConnectionService = CacheConnectionService;
exports.CacheConnectionService = CacheConnectionService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(logger_service_1.LoggerService)),
    __metadata("design:paramtypes", [logger_service_1.LoggerService,
        cache_config_1.CacheConfigService])
], CacheConnectionService);
//# sourceMappingURL=cache-connection.service.js.map