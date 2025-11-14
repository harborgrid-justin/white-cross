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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheService = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const cache_config_1 = require("./cache.config");
const cache_connection_service_1 = require("./cache-connection.service");
const cache_storage_service_1 = require("./cache-storage.service");
const cache_serialization_service_1 = require("./cache-serialization.service");
const cache_invalidation_service_1 = require("./cache-invalidation.service");
const cache_operations_service_1 = require("./cache-operations.service");
const cache_interfaces_1 = require("./cache.interfaces");
const base_1 = require("../../common/base");
const logger_service_1 = require("../../common/logging/logger.service");
const common_2 = require("@nestjs/common");
const modules_1 = require("../../discovery/modules");
let CacheService = class CacheService extends base_1.BaseService {
    cacheConfig;
    connectionService;
    storageService;
    serializationService;
    invalidationService;
    operationsService;
    eventEmitter;
    stats;
    startTime;
    constructor(logger, cacheConfig, connectionService, storageService, serializationService, invalidationService, operationsService, eventEmitter) {
        super({
            serviceName: 'CacheService',
            logger,
            enableAuditLogging: true,
        });
        this.cacheConfig = cacheConfig;
        this.connectionService = connectionService;
        this.storageService = storageService;
        this.serializationService = serializationService;
        this.invalidationService = invalidationService;
        this.operationsService = operationsService;
        this.eventEmitter = eventEmitter;
        this.stats = {
            hits: 0,
            misses: 0,
            l1Hits: 0,
            l2Hits: 0,
            sets: 0,
            deletes: 0,
            errors: 0,
            getTotalLatency: 0,
            setTotalLatency: 0,
        };
        this.startTime = Date.now();
    }
    async onModuleInit() {
        try {
            this.cacheConfig.validate();
            await this.connectionService.connect();
            this.storageService.startCleanup();
            this.logInfo(`Cache service initialized: ${JSON.stringify(this.cacheConfig.getSummary())}`);
        }
        catch (error) {
            this.logError('Failed to initialize cache service', error);
        }
    }
    async onModuleDestroy() {
        this.storageService.stopCleanup();
        await this.connectionService.disconnect();
        this.invalidationService.clearTagIndex();
        this.logInfo('Cache service destroyed');
    }
    async get(key, options = {}) {
        const startTime = Date.now();
        const fullKey = this.cacheConfig.buildKey(key, options.namespace);
        try {
            if (this.cacheConfig.isL1CacheEnabled() && !options.skipL1) {
                const l1Result = this.storageService.getFromL1(fullKey);
                if (l1Result !== null) {
                    this.stats.hits++;
                    this.stats.l1Hits++;
                    this.stats.getTotalLatency += Date.now() - startTime;
                    this.emitEvent(cache_interfaces_1.CacheEvent.HIT, fullKey, { source: 'L1' });
                    return l1Result;
                }
            }
            const l2Result = await this.storageService.getFromL2(fullKey);
            if (l2Result !== null) {
                this.stats.hits++;
                this.stats.l2Hits++;
                this.stats.getTotalLatency += Date.now() - startTime;
                this.emitEvent(cache_interfaces_1.CacheEvent.HIT, fullKey, { source: 'L2' });
                if (this.cacheConfig.isL1CacheEnabled() && !options.skipL1) {
                    this.storageService.setToL1(fullKey, l2Result, options);
                }
                return l2Result;
            }
            this.stats.misses++;
            this.stats.getTotalLatency += Date.now() - startTime;
            this.emitEvent(cache_interfaces_1.CacheEvent.MISS, fullKey);
            return null;
        }
        catch (error) {
            this.logError(`Cache get error for key ${fullKey}:`, error);
            this.stats.errors++;
            this.emitEvent(cache_interfaces_1.CacheEvent.ERROR, fullKey, { error });
            return null;
        }
    }
    async set(key, value, options = {}) {
        const startTime = Date.now();
        const fullKey = this.cacheConfig.buildKey(key, options.namespace);
        try {
            try {
                await this.storageService.setToL2(fullKey, value, options);
            }
            catch (redisError) {
                if (!this.connectionService.isConnected()) {
                    this.logWarning(`Redis unavailable, using L1 cache only for key: ${fullKey}`, {
                        key: fullKey,
                        cacheMode: 'L1-only',
                        redisStatus: 'disconnected',
                    });
                }
                else {
                    this.logError(`Redis operation failed for key ${fullKey}:`, {
                        error: redisError.message,
                        key: fullKey,
                    });
                    this.stats.errors++;
                    throw redisError;
                }
            }
            if (this.cacheConfig.isL1CacheEnabled() && !options.skipL1) {
                this.storageService.setToL1(fullKey, value, options);
            }
            if (options.tags && options.tags.length > 0) {
                this.invalidationService.indexTags(fullKey, options.tags);
            }
            this.stats.sets++;
            this.stats.setTotalLatency += Date.now() - startTime;
            this.emitEvent(cache_interfaces_1.CacheEvent.SET, fullKey, { tags: options.tags });
        }
        catch (error) {
            this.logError(`Cache set error for key ${fullKey}:`, {
                error: error.message,
                key: fullKey,
                redisConnected: this.connectionService.isConnected(),
                l1Enabled: this.cacheConfig.isL1CacheEnabled(),
            });
            this.stats.errors++;
            this.emitEvent(cache_interfaces_1.CacheEvent.ERROR, fullKey, { error });
            throw error;
        }
    }
    async delete(key, options = {}) {
        const fullKey = this.cacheConfig.buildKey(key, options.namespace);
        try {
            this.storageService.deleteFromL1(fullKey);
            if (this.connectionService.isConnected()) {
                try {
                    await this.storageService.deleteFromL2(fullKey);
                }
                catch (redisError) {
                    this.logWarning(`Redis delete failed for key ${fullKey}, L1 cache cleared`, {
                        error: redisError.message,
                        key: fullKey,
                        l1Deleted: true,
                    });
                }
            }
            else {
                this.logDebug(`Redis unavailable, deleted from L1 cache only: ${fullKey}`);
            }
            this.invalidationService.removeFromTagIndex(fullKey);
            this.stats.deletes++;
            this.emitEvent(cache_interfaces_1.CacheEvent.DELETE, fullKey);
            return true;
        }
        catch (error) {
            this.logError(`Cache delete error for key ${fullKey}:`, {
                error: error.message,
                key: fullKey,
                redisConnected: this.connectionService.isConnected(),
            });
            this.stats.errors++;
            this.emitEvent(cache_interfaces_1.CacheEvent.ERROR, fullKey, { error });
            return false;
        }
    }
    async has(key, options = {}) {
        const fullKey = this.cacheConfig.buildKey(key, options.namespace);
        if (this.storageService.hasInL1(fullKey)) {
            return true;
        }
        return await this.storageService.hasInL2(fullKey);
    }
    async invalidate(pattern) {
        return await this.invalidationService.invalidate(pattern, (key) => this.delete(key, {}));
    }
    async mget(keys, options = {}) {
        return await this.operationsService.mget(keys, options, (key, opts) => this.get(key, opts));
    }
    async mset(entries, options = {}) {
        await this.operationsService.mset(entries, options, (key, value, opts) => this.set(key, value, opts));
    }
    async mdel(keys, options = {}) {
        return await this.operationsService.mdel(keys, options, (key, opts) => this.delete(key, opts));
    }
    async increment(key, amount = 1, options = {}) {
        return await this.operationsService.increment(key, amount, options);
    }
    async decrement(key, amount = 1, options = {}) {
        return await this.operationsService.decrement(key, amount, options);
    }
    getStats() {
        const totalOps = this.stats.hits + this.stats.misses;
        const hitRate = totalOps > 0 ? (this.stats.hits / totalOps) * 100 : 0;
        return {
            hits: this.stats.hits,
            misses: this.stats.misses,
            hitRate: Math.round(hitRate * 100) / 100,
            l1Hits: this.stats.l1Hits,
            l2Hits: this.stats.l2Hits,
            keys: this.storageService.getL1Size(),
            l1Size: this.storageService.getL1Size(),
            l2Size: -1,
            avgGetLatency: totalOps > 0 ? Math.round((this.stats.getTotalLatency / totalOps) * 100) / 100 : 0,
            avgSetLatency: this.stats.sets > 0
                ? Math.round((this.stats.setTotalLatency / this.stats.sets) * 100) / 100
                : 0,
            totalOperations: totalOps + this.stats.sets + this.stats.deletes,
            failedOperations: this.stats.errors + this.operationsService.getErrorCount(),
            memoryUsage: this.storageService.getL1MemoryUsage(),
        };
    }
    resetStats() {
        this.stats = {
            hits: 0,
            misses: 0,
            l1Hits: 0,
            l2Hits: 0,
            sets: 0,
            deletes: 0,
            errors: 0,
            getTotalLatency: 0,
            setTotalLatency: 0,
        };
        this.operationsService.resetErrorCount();
    }
    async getHealth() {
        const redisLatency = await this.connectionService.checkHealth();
        const redisConnected = this.connectionService.isConnected();
        const l1Status = !this.cacheConfig.isL1CacheEnabled()
            ? 'disabled'
            : this.storageService.getL1Size() >= this.cacheConfig.getConfig().l1MaxSize
                ? 'full'
                : 'ok';
        let status;
        if (redisConnected && l1Status !== 'full') {
            status = 'healthy';
        }
        else if (redisConnected || l1Status === 'ok') {
            status = 'degraded';
        }
        else {
            status = 'unhealthy';
        }
        const lastError = this.connectionService.getLastError();
        return {
            status,
            redisConnected,
            redisLatency,
            l1Status,
            recentErrors: this.stats.errors + this.operationsService.getErrorCount(),
            lastError: lastError?.message,
            uptime: Math.floor((Date.now() - this.startTime) / 1000),
        };
    }
    async clear() {
        await this.storageService.clearAll();
        this.invalidationService.clearTagIndex();
        this.logWarning('Cache cleared');
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
exports.CacheService = CacheService;
__decorate([
    (0, modules_1.MemorySensitive)(50),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CacheService.prototype, "get", null);
__decorate([
    (0, modules_1.MemorySensitive)(75),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_a = typeof T !== "undefined" && T) === "function" ? _a : Object, Object]),
    __metadata("design:returntype", Promise)
], CacheService.prototype, "set", null);
__decorate([
    (0, modules_1.ImmediateCleanup)(),
    (0, modules_1.Cleanup)('high'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CacheService.prototype, "clear", null);
exports.CacheService = CacheService = __decorate([
    (0, modules_1.HighPerformance)(),
    (0, modules_1.GCSchedule)({
        gcTriggerThreshold: 256,
        aggressiveGcThreshold: 512,
        maxRequestsBeforeGC: 10000,
        timeBasedGC: true,
        gcInterval: 300000,
        priority: 'critical',
        leakDetectionEnabled: true,
        preventiveGC: true,
    }),
    (0, modules_1.MemoryIntensive)({
        enabled: true,
        threshold: 200,
        priority: 'high',
        cleanupStrategy: 'aggressive',
        monitoring: true,
    }),
    (0, modules_1.ResourcePool)({
        enabled: true,
        resourceType: 'connection',
        minSize: 2,
        maxSize: 20,
        priority: 9,
        validationEnabled: true,
        autoScale: true,
    }),
    (0, modules_1.MemoryMonitoring)({
        enabled: true,
        interval: 30000,
        threshold: 150,
        alerts: true,
    }),
    (0, common_1.Injectable)(),
    __param(0, (0, common_2.Inject)(logger_service_1.LoggerService)),
    __metadata("design:paramtypes", [logger_service_1.LoggerService,
        cache_config_1.CacheConfigService,
        cache_connection_service_1.CacheConnectionService,
        cache_storage_service_1.CacheStorageService,
        cache_serialization_service_1.CacheSerializationService,
        cache_invalidation_service_1.CacheInvalidationService,
        cache_operations_service_1.CacheOperationsService,
        event_emitter_1.EventEmitter2])
], CacheService);
//# sourceMappingURL=cache.service.js.map