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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheStorageService = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const cache_config_1 = require("./cache.config");
const cache_connection_service_1 = require("./cache-connection.service");
const cache_serialization_service_1 = require("./cache-serialization.service");
const cache_interfaces_1 = require("./cache.interfaces");
const modules_1 = require("../../discovery/modules");
const base_1 = require("../../common/base");
let CacheStorageService = class CacheStorageService extends base_1.BaseService {
    cacheConfig;
    connectionService;
    serializationService;
    eventEmitter;
    l1Cache = new Map();
    l1CleanupInterval;
    constructor(cacheConfig, connectionService, serializationService, eventEmitter) {
        super("CacheStorageService");
        this.cacheConfig = cacheConfig;
        this.connectionService = connectionService;
        this.serializationService = serializationService;
        this.eventEmitter = eventEmitter;
    }
    startCleanup() {
        if (!this.cacheConfig.isL1CacheEnabled()) {
            return;
        }
        this.l1CleanupInterval = setInterval(() => {
            this.cleanupL1();
        }, 60000);
    }
    stopCleanup() {
        if (this.l1CleanupInterval) {
            clearInterval(this.l1CleanupInterval);
            this.l1CleanupInterval = undefined;
        }
    }
    async clearAll() {
        this.l1Cache.clear();
        const redis = this.connectionService.getClient();
        if (redis) {
            const pattern = `${this.cacheConfig.getKeyPrefix()}:*`;
            const keys = await redis.keys(pattern);
            if (keys.length > 0) {
                await redis.del(...keys);
            }
        }
        this.logWarning('All cache cleared');
    }
    getL1Size() {
        return this.l1Cache.size;
    }
    getL1MemoryUsage() {
        let memoryUsage = 0;
        for (const entry of this.l1Cache.values()) {
            memoryUsage += entry.size;
        }
        return memoryUsage;
    }
    getFromL1(key) {
        const entry = this.l1Cache.get(key);
        if (!entry) {
            return null;
        }
        if (entry.expiresAt <= Date.now()) {
            this.l1Cache.delete(key);
            return null;
        }
        return entry.data;
    }
    setToL1(key, value, options) {
        const config = this.cacheConfig.getConfig();
        if (this.l1Cache.size >= config.l1MaxSize) {
            this.evictL1();
        }
        const ttl = options.ttl || config.l1Ttl;
        const entry = {
            data: value,
            expiresAt: Date.now() + ttl * 1000,
            compressed: false,
            size: this.serializationService.estimateSize(value),
        };
        this.l1Cache.set(key, entry);
    }
    deleteFromL1(key) {
        return this.l1Cache.delete(key);
    }
    hasInL1(key) {
        const entry = this.l1Cache.get(key);
        if (!entry) {
            return false;
        }
        if (entry.expiresAt <= Date.now()) {
            this.l1Cache.delete(key);
            return false;
        }
        return true;
    }
    async getFromL2(key) {
        const redis = this.connectionService.getClient();
        if (!redis) {
            return null;
        }
        try {
            const value = await redis.get(key);
            if (!value) {
                return null;
            }
            return await this.serializationService.deserialize(value);
        }
        catch (error) {
            this.logError(`L2 cache get error for key ${key}:`, error);
            return null;
        }
    }
    async setToL2(key, value, options) {
        const redis = this.connectionService.getClient();
        if (!redis) {
            const error = new Error(`Redis not connected - cannot set key in L2 cache: ${key}`);
            this.logWarning(error.message, {
                key,
                redisStatus: 'disconnected',
                fallback: 'L1 cache only',
            });
            throw error;
        }
        const ttl = options.ttl || this.cacheConfig.getDefaultTTL();
        const serialized = await this.serializationService.serialize(value, options);
        await redis.setex(key, ttl, serialized);
    }
    async deleteFromL2(key) {
        const redis = this.connectionService.getClient();
        if (!redis) {
            return false;
        }
        try {
            await redis.del(key);
            return true;
        }
        catch (error) {
            this.logError(`L2 cache delete error for key ${key}:`, error);
            return false;
        }
    }
    async hasInL2(key) {
        const redis = this.connectionService.getClient();
        if (!redis) {
            return false;
        }
        try {
            const exists = await redis.exists(key);
            return exists === 1;
        }
        catch (error) {
            this.logError(`L2 cache has error for key ${key}:`, error);
            return false;
        }
    }
    getL1Keys() {
        return Array.from(this.l1Cache.keys());
    }
    async getL2KeysByPattern(pattern) {
        const redis = this.connectionService.getClient();
        if (!redis) {
            return [];
        }
        try {
            return await redis.keys(pattern);
        }
        catch (error) {
            this.logError(`L2 cache keys error for pattern ${pattern}:`, error);
            return [];
        }
    }
    evictL1() {
        let oldestKey = null;
        let oldestExpiry = Number.MAX_SAFE_INTEGER;
        for (const [key, entry] of this.l1Cache.entries()) {
            if (entry.expiresAt < oldestExpiry) {
                oldestExpiry = entry.expiresAt;
                oldestKey = key;
            }
        }
        if (oldestKey) {
            this.l1Cache.delete(oldestKey);
            this.emitEvent(cache_interfaces_1.CacheEvent.EVICT, oldestKey, { source: 'L1' });
        }
    }
    cleanupL1() {
        const now = Date.now();
        let removed = 0;
        for (const [key, entry] of this.l1Cache.entries()) {
            if (entry.expiresAt <= now) {
                this.l1Cache.delete(key);
                removed++;
            }
        }
        if (removed > 0) {
            this.logDebug(`L1 cache cleanup: removed ${removed} expired entries`);
        }
    }
    emitEvent(event, key, metadata) {
        this.eventEmitter.emit(event, {
            event,
            key,
            timestamp: Date.now(),
            metadata,
        });
    }
};
exports.CacheStorageService = CacheStorageService;
__decorate([
    (0, modules_1.MemorySensitive)(50),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_a = typeof T !== "undefined" && T) === "function" ? _a : Object, Object]),
    __metadata("design:returntype", void 0)
], CacheStorageService.prototype, "setToL1", null);
__decorate([
    (0, modules_1.Cleanup)('normal'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CacheStorageService.prototype, "cleanupL1", null);
exports.CacheStorageService = CacheStorageService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [cache_config_1.CacheConfigService,
        cache_connection_service_1.CacheConnectionService,
        cache_serialization_service_1.CacheSerializationService,
        event_emitter_1.EventEmitter2])
], CacheStorageService);
//# sourceMappingURL=cache-storage.service.js.map