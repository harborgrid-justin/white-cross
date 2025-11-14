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
exports.CacheMetricsCollectorService = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const cache_constants_1 = require("./cache-constants");
const base_1 = require("../../../common/base");
let CacheMetricsCollectorService = class CacheMetricsCollectorService extends base_1.BaseService {
    eventEmitter;
    metrics = this.initializeMetrics();
    constructor(eventEmitter) {
        super("CacheMetricsCollectorService");
        this.eventEmitter = eventEmitter;
        this.setupEventListeners();
    }
    recordOperation(operation, tier, success, responseTime) {
        try {
            const tierMetrics = this.getOrCreateTierMetrics(tier);
            tierMetrics.totalOperations++;
            if (success) {
                tierMetrics.successfulOperations++;
            }
            else {
                tierMetrics.failedOperations++;
            }
            this.updateResponseTimeStats(tierMetrics, responseTime);
            this.metrics.totalOperations++;
            if (success) {
                this.metrics.totalHits++;
            }
            else {
                this.metrics.totalMisses++;
            }
            this.metrics.lastUpdated = new Date();
        }
        catch (error) {
            this.logError(`Failed to record operation metrics:`, error);
        }
    }
    recordCacheSize(tier, size, itemCount) {
        try {
            const tierMetrics = this.getOrCreateTierMetrics(tier);
            tierMetrics.currentSize = size;
            tierMetrics.itemCount = itemCount;
            tierMetrics.lastSizeUpdate = new Date();
            this.updateGlobalCacheSize();
        }
        catch (error) {
            this.logError(`Failed to record cache size metrics:`, error);
        }
    }
    recordEviction(tier, reason, evictedItems) {
        try {
            const tierMetrics = this.getOrCreateTierMetrics(tier);
            tierMetrics.evictions++;
            tierMetrics.evictedItems += evictedItems;
            tierMetrics.lastEviction = new Date();
            this.metrics.totalEvictions += evictedItems;
            this.logDebug(`Cache eviction in ${tier}: ${evictedItems} items (${reason})`);
        }
        catch (error) {
            this.logError(`Failed to record eviction metrics:`, error);
        }
    }
    getPerformanceStats() {
        const now = Date.now();
        const uptime = now - this.metrics.startTime.getTime();
        return {
            uptime,
            totalOperations: this.metrics.totalOperations,
            totalHits: this.metrics.totalHits,
            totalMisses: this.metrics.totalMisses,
            overallHitRate: this.calculateOverallHitRate(),
            averageResponseTime: this.calculateAverageResponseTime(),
            operationsPerSecond: this.metrics.totalOperations / Math.max(1, uptime / 1000),
            tierBreakdown: this.getTierPerformanceBreakdown(),
            memoryUsage: this.calculateMemoryUsage(),
            lastUpdated: this.metrics.lastUpdated,
        };
    }
    getMetricsSummary() {
        const stats = this.getPerformanceStats();
        return {
            operations: {
                total: stats.totalOperations,
                hits: stats.totalHits,
                misses: stats.totalMisses,
                hitRate: stats.overallHitRate,
            },
            performance: {
                avgResponseTime: stats.averageResponseTime,
                opsPerSecond: stats.operationsPerSecond,
            },
            memory: {
                totalSize: this.metrics.totalCacheSize,
                itemCount: this.metrics.totalItemCount,
                usagePercent: this.calculateMemoryUsagePercent(),
            },
        };
    }
    getRawMetrics() {
        return { ...this.metrics };
    }
    reset() {
        Object.assign(this.metrics, this.initializeMetrics());
        this.logInfo('Cache metrics reset');
    }
    initializeMetrics() {
        return {
            startTime: new Date(),
            totalOperations: 0,
            totalHits: 0,
            totalMisses: 0,
            totalEvictions: 0,
            totalCacheSize: 0,
            totalItemCount: 0,
            tiers: new Map(),
            lastUpdated: new Date(),
        };
    }
    setupEventListeners() {
        this.eventEmitter.on(cache_constants_1.CACHE_EVENTS.ACCESS_RECORDED, (data) => {
            this.recordOperation('access', data.tier, data.hit, data.responseTime);
        });
        this.eventEmitter.on(cache_constants_1.CACHE_EVENTS.INVALIDATED, (data) => {
            this.recordOperation('invalidate', data.tier || 'unknown', true, 0);
        });
        this.eventEmitter.on(cache_constants_1.CACHE_EVENTS.WARMED, (data) => {
            this.recordOperation('warm', 'unknown', data.success, data.responseTime || 0);
        });
    }
    getOrCreateTierMetrics(tier) {
        let tierMetrics = this.metrics.tiers.get(tier);
        if (!tierMetrics) {
            tierMetrics = {
                tier,
                totalOperations: 0,
                successfulOperations: 0,
                failedOperations: 0,
                evictions: 0,
                evictedItems: 0,
                currentSize: 0,
                itemCount: 0,
                averageResponseTime: 0,
                minResponseTime: Infinity,
                maxResponseTime: 0,
                lastSizeUpdate: new Date(),
                lastEviction: null,
            };
            this.metrics.tiers.set(tier, tierMetrics);
        }
        return tierMetrics;
    }
    updateResponseTimeStats(tierMetrics, responseTime) {
        tierMetrics.averageResponseTime = ((tierMetrics.averageResponseTime * (tierMetrics.totalOperations - 1)) + responseTime) / tierMetrics.totalOperations;
        tierMetrics.minResponseTime = Math.min(tierMetrics.minResponseTime, responseTime);
        tierMetrics.maxResponseTime = Math.max(tierMetrics.maxResponseTime, responseTime);
    }
    updateGlobalCacheSize() {
        this.metrics.totalCacheSize = 0;
        this.metrics.totalItemCount = 0;
        for (const tierMetrics of this.metrics.tiers.values()) {
            this.metrics.totalCacheSize += tierMetrics.currentSize;
            this.metrics.totalItemCount += tierMetrics.itemCount;
        }
    }
    calculateOverallHitRate() {
        const totalRequests = this.metrics.totalHits + this.metrics.totalMisses;
        return totalRequests > 0 ? this.metrics.totalHits / totalRequests : 0;
    }
    calculateAverageResponseTime() {
        let totalResponseTime = 0;
        let totalOperations = 0;
        for (const tierMetrics of this.metrics.tiers.values()) {
            totalResponseTime += tierMetrics.averageResponseTime * tierMetrics.totalOperations;
            totalOperations += tierMetrics.totalOperations;
        }
        return totalOperations > 0 ? totalResponseTime / totalOperations : 0;
    }
    calculateMemoryUsage() {
        return this.metrics.totalCacheSize;
    }
    calculateMemoryUsagePercent() {
        const maxMemory = cache_constants_1.CACHE_CONSTANTS.METRICS.MAX_MEMORY_USAGE_BYTES;
        return maxMemory > 0 ? (this.metrics.totalCacheSize / maxMemory) * 100 : 0;
    }
    getTierPerformanceBreakdown() {
        const breakdown = {};
        for (const [tier, metrics] of this.metrics.tiers.entries()) {
            const hitRate = metrics.totalOperations > 0 ?
                metrics.successfulOperations / metrics.totalOperations : 0;
            breakdown[tier] = {
                operations: metrics.totalOperations,
                hitRate,
                avgResponseTime: metrics.averageResponseTime,
                size: metrics.currentSize,
                itemCount: metrics.itemCount,
            };
        }
        return breakdown;
    }
};
exports.CacheMetricsCollectorService = CacheMetricsCollectorService;
exports.CacheMetricsCollectorService = CacheMetricsCollectorService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [event_emitter_1.EventEmitter2])
], CacheMetricsCollectorService);
//# sourceMappingURL=cache-metrics-collector.service.js.map