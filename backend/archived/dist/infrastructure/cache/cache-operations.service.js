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
exports.CacheOperationsService = void 0;
const common_1 = require("@nestjs/common");
const cache_config_1 = require("./cache.config");
const cache_connection_service_1 = require("./cache-connection.service");
const base_1 = require("../../common/base");
let CacheOperationsService = class CacheOperationsService extends base_1.BaseService {
    cacheConfig;
    connectionService;
    stats = {
        errors: 0,
    };
    constructor(cacheConfig, connectionService) {
        super("CacheOperationsService");
        this.cacheConfig = cacheConfig;
        this.connectionService = connectionService;
    }
    async increment(key, amount = 1, options = {}) {
        const fullKey = this.cacheConfig.buildKey(key, options.namespace);
        try {
            const redis = this.connectionService.getClient();
            if (!redis) {
                const error = new Error(`Redis not connected - cannot increment key: ${fullKey}`);
                this.logWarning(error.message, {
                    key: fullKey,
                    amount,
                    redisStatus: 'disconnected',
                    recommendation: 'Check Redis connection configuration and ensure Redis server is running',
                });
                this.stats.errors++;
                throw error;
            }
            const result = await redis.incrby(fullKey, amount);
            if (options.ttl) {
                await redis.expire(fullKey, options.ttl);
            }
            return result;
        }
        catch (error) {
            this.logError(`Cache increment error for key ${fullKey}:`, {
                error: error.message,
                key: fullKey,
                amount,
                redisConnected: this.connectionService.isConnected(),
            });
            this.stats.errors++;
            throw error;
        }
    }
    async decrement(key, amount = 1, options = {}) {
        const fullKey = this.cacheConfig.buildKey(key, options.namespace);
        try {
            const redis = this.connectionService.getClient();
            if (!redis) {
                const error = new Error(`Redis not connected - cannot decrement key: ${fullKey}`);
                this.logWarning(error.message, {
                    key: fullKey,
                    amount,
                    redisStatus: 'disconnected',
                    recommendation: 'Check Redis connection configuration and ensure Redis server is running',
                });
                this.stats.errors++;
                throw error;
            }
            const result = await redis.decrby(fullKey, amount);
            if (options.ttl) {
                await redis.expire(fullKey, options.ttl);
            }
            return result;
        }
        catch (error) {
            this.logError(`Cache decrement error for key ${fullKey}:`, {
                error: error.message,
                key: fullKey,
                amount,
                redisConnected: this.connectionService.isConnected(),
            });
            this.stats.errors++;
            throw error;
        }
    }
    async mget(keys, options, getCallback) {
        const results = [];
        for (const key of keys) {
            try {
                const value = await getCallback(key, options);
                results.push(value);
            }
            catch (error) {
                this.logError(`Batch get error for key ${key}:`, error);
                results.push(null);
                this.stats.errors++;
            }
        }
        return results;
    }
    async mset(entries, options, setCallback) {
        for (const entry of entries) {
            try {
                await setCallback(entry.key, entry.value, options);
            }
            catch (error) {
                this.logError(`Batch set error for key ${entry.key}:`, error);
                this.stats.errors++;
            }
        }
    }
    async mdel(keys, options, deleteCallback) {
        let count = 0;
        for (const key of keys) {
            try {
                const deleted = await deleteCallback(key, options);
                if (deleted) {
                    count++;
                }
            }
            catch (error) {
                this.logError(`Batch delete error for key ${key}:`, error);
                this.stats.errors++;
            }
        }
        return count;
    }
    getErrorCount() {
        return this.stats.errors;
    }
    resetErrorCount() {
        this.stats.errors = 0;
    }
};
exports.CacheOperationsService = CacheOperationsService;
exports.CacheOperationsService = CacheOperationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [cache_config_1.CacheConfigService,
        cache_connection_service_1.CacheConnectionService])
], CacheOperationsService);
//# sourceMappingURL=cache-operations.service.js.map