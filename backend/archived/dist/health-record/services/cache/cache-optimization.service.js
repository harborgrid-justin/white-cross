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
exports.CacheOptimizationService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const event_emitter_1 = require("@nestjs/event-emitter");
const l1_cache_service_1 = require("./l1-cache.service");
const l2_cache_service_1 = require("./l2-cache.service");
const l3_cache_service_1 = require("./l3-cache.service");
const cache_access_pattern_tracker_service_1 = require("./cache-access-pattern-tracker.service");
const base_1 = require("../../../common/base");
const cache_interfaces_1 = require("./cache-interfaces");
let CacheOptimizationService = class CacheOptimizationService extends base_1.BaseService {
    l1Cache;
    l2Cache;
    l3Cache;
    patternTracker;
    eventEmitter;
    prefetchQueue = new Set();
    warmingEnabled = true;
    prefetchEnabled = true;
    constructor(l1Cache, l2Cache, l3Cache, patternTracker, eventEmitter) {
        super("CacheOptimizationService");
        this.l1Cache = l1Cache;
        this.l2Cache = l2Cache;
        this.l3Cache = l3Cache;
        this.patternTracker = patternTracker;
        this.eventEmitter = eventEmitter;
        this.initializeOptimization();
    }
    initializeOptimization() {
        this.logInfo('Initializing cache optimization service');
        if (this.warmingEnabled) {
            setTimeout(() => {
                this.performCacheWarming();
            }, 30000);
        }
        this.logInfo('Cache optimization service initialized');
    }
    async performCacheWarming() {
        if (!this.warmingEnabled) {
            return { warmedCount: 0, failedCount: 0, duration: 0 };
        }
        const startTime = Date.now();
        this.logDebug('Starting cache warming process');
        const topPatterns = this.getTopAccessPatterns(20);
        let warmedCount = 0;
        let failedCount = 0;
        for (const pattern of topPatterns) {
            if (this.shouldWarmCache(pattern)) {
                try {
                    await this.warmCacheEntry(pattern.key);
                    warmedCount++;
                }
                catch (error) {
                    this.logError(`Cache warming failed for ${pattern.key}:`, error);
                    failedCount++;
                }
            }
        }
        const duration = Date.now() - startTime;
        if (warmedCount > 0) {
            this.logInfo(`Cache warming completed: ${warmedCount} entries warmed, ${failedCount} failed`);
        }
        this.eventEmitter.emit('cache.warming.completed', {
            warmedCount,
            failedCount,
            duration,
        });
        return { warmedCount, failedCount, duration };
    }
    async performIntelligentPrefetch() {
        if (!this.prefetchEnabled || this.prefetchQueue.size === 0) {
            return { prefetchedCount: 0, failedCount: 0, duration: 0 };
        }
        const startTime = Date.now();
        this.logDebug(`Starting intelligent prefetch: ${this.prefetchQueue.size} candidates`);
        const prefetchBatch = Array.from(this.prefetchQueue).slice(0, 10);
        this.prefetchQueue.clear();
        let prefetchedCount = 0;
        let failedCount = 0;
        for (const key of prefetchBatch) {
            try {
                const success = await this.prefetchRelatedData(key);
                if (success) {
                    prefetchedCount++;
                }
                else {
                    failedCount++;
                }
            }
            catch (error) {
                this.logError(`Prefetch failed for ${key}:`, error);
                failedCount++;
            }
        }
        const duration = Date.now() - startTime;
        if (prefetchedCount > 0) {
            this.logInfo(`Intelligent prefetch completed: ${prefetchedCount} entries prefetched, ${failedCount} failed`);
        }
        this.eventEmitter.emit('cache.prefetch.completed', {
            prefetchedCount,
            failedCount,
            duration,
        });
        return { prefetchedCount, failedCount, duration };
    }
    async performCacheOptimization() {
        this.logDebug('Starting cache optimization');
        const l1Optimized = await this.optimizeL1Cache();
        const l3Cleaned = await this.l3Cache.cleanupExpired();
        const patternsCleanedUp = this.cleanupAccessPatterns();
        this.updateCacheMetrics();
        this.logInfo(`Cache optimization completed: L1 optimized: ${l1Optimized}, L3 cleaned: ${l3Cleaned}, patterns cleaned: ${patternsCleanedUp}`);
        this.eventEmitter.emit('cache.optimization.completed', {
            l1Optimized,
            l3Cleaned,
            patternsCleanedUp,
        });
        return { l1Optimized, l3Cleaned, patternsCleanedUp };
    }
    scheduleRelatedPrefetch(key, tags, compliance) {
        if (!this.prefetchEnabled)
            return;
        const studentId = this.extractStudentId(key);
        const dataType = this.extractDataType(key, tags);
        if (studentId) {
            const relatedKeys = this.generateRelatedKeys(studentId, dataType, compliance);
            relatedKeys.forEach((relatedKey) => this.prefetchQueue.add(relatedKey));
        }
    }
    getTopAccessPatterns(limit) {
        const patterns = this.patternTracker.getAccessPatterns();
        return patterns.sort((a, b) => b.importance - a.importance).slice(0, limit);
    }
    shouldWarmCache(pattern) {
        const now = new Date();
        const timeSinceLastAccess = now.getTime() - pattern.lastAccess.getTime();
        const timeUntilPredictedAccess = pattern.predictedNextAccess.getTime() - now.getTime();
        return (pattern.importance > 5 &&
            timeUntilPredictedAccess < 300000 &&
            timeSinceLastAccess > 60000);
    }
    async warmCacheEntry(key) {
        try {
            const data = await this.l3Cache.get(key, cache_interfaces_1.ComplianceLevel.INTERNAL);
            if (data) {
                return true;
            }
            return false;
        }
        catch (error) {
            this.logError(`Cache warming failed for key ${key}:`, error);
            return false;
        }
    }
    async prefetchRelatedData(key) {
        try {
            const studentId = this.extractStudentId(key);
            const dataType = this.extractDataType(key, []);
            if (!studentId)
                return false;
            const relatedKeys = this.generateRelatedKeys(studentId, dataType, cache_interfaces_1.ComplianceLevel.INTERNAL);
            let prefetched = false;
            for (const relatedKey of relatedKeys.slice(0, 3)) {
                const data = await this.l3Cache.get(relatedKey, cache_interfaces_1.ComplianceLevel.INTERNAL);
                if (data) {
                    prefetched = true;
                }
            }
            return prefetched;
        }
        catch (error) {
            this.logError(`Prefetch failed for key ${key}:`, error);
            return false;
        }
    }
    async optimizeL1Cache() {
        try {
            const l1Stats = this.l1Cache.getStats();
            const currentSize = l1Stats.size;
            const maxSize = 800;
            if (currentSize <= maxSize) {
                return 0;
            }
            const patterns = this.patternTracker.getAccessPatterns();
            const leastImportant = patterns
                .sort((a, b) => a.importance - b.importance)
                .slice(0, currentSize - maxSize);
            let evicted = 0;
            for (const pattern of leastImportant) {
                const success = this.l1Cache.delete(pattern.key);
                if (success)
                    evicted++;
            }
            return evicted;
        }
        catch (error) {
            this.logError('L1 cache optimization failed:', error);
            return 0;
        }
    }
    cleanupAccessPatterns() {
        const now = new Date();
        const maxAge = 7 * 24 * 60 * 60 * 1000;
        return this.patternTracker.cleanupStalePatterns(now, maxAge);
    }
    updateCacheMetrics() {
        const l1Stats = this.l1Cache.getStats();
        const l2Stats = this.l2Cache.getStats();
        const l3Stats = this.l3Cache.getStats();
        this.logDebug('Cache metrics updated', {
            l1: l1Stats,
            l2: l2Stats,
            l3: l3Stats,
        });
    }
    extractStudentId(key) {
        const match = key.match(/student[/:]([a-fA-F0-9-]+)/);
        return match ? match[1] : undefined;
    }
    extractDataType(key, tags) {
        if (tags.length > 0)
            return tags[0];
        if (key.includes('allergies'))
            return 'ALLERGIES';
        if (key.includes('vaccinations'))
            return 'VACCINATIONS';
        if (key.includes('conditions'))
            return 'CONDITIONS';
        if (key.includes('vitals'))
            return 'VITALS';
        if (key.includes('summary'))
            return 'SUMMARY';
        return 'HEALTH_RECORD';
    }
    generateRelatedKeys(studentId, dataType) {
        const relatedKeys = [];
        switch (dataType) {
            case 'ALLERGIES':
                relatedKeys.push(`hr:student/${studentId}/conditions`, `hr:student/${studentId}/medications`, `hr:student/${studentId}/summary`);
                break;
            case 'VACCINATIONS':
                relatedKeys.push(`hr:student/${studentId}/health-status`, `hr:student/${studentId}/immunization-schedule`);
                break;
            case 'CONDITIONS':
                relatedKeys.push(`hr:student/${studentId}/allergies`, `hr:student/${studentId}/medications`, `hr:student/${studentId}/vitals`);
                break;
            case 'VITALS':
                relatedKeys.push(`hr:student/${studentId}/conditions`, `hr:student/${studentId}/growth-tracking`, `hr:student/${studentId}/health-metrics`);
                break;
            default:
                relatedKeys.push(`hr:student/${studentId}/summary`);
        }
        return relatedKeys;
    }
    getOptimizationStats() {
        return {
            prefetchQueueSize: this.prefetchQueue.size,
            warmingEnabled: this.warmingEnabled,
            prefetchEnabled: this.prefetchEnabled,
        };
    }
    setWarmingEnabled(enabled) {
        this.logInfo(`Cache warming ${enabled ? 'enabled' : 'disabled'}`);
    }
    setPrefetchEnabled(enabled) {
        this.logInfo(`Cache prefetching ${enabled ? 'enabled' : 'disabled'}`);
    }
};
exports.CacheOptimizationService = CacheOptimizationService;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_5_MINUTES),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CacheOptimizationService.prototype, "performCacheWarming", null);
__decorate([
    (0, schedule_1.Cron)('*/2 * * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CacheOptimizationService.prototype, "performIntelligentPrefetch", null);
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_HOUR),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CacheOptimizationService.prototype, "performCacheOptimization", null);
exports.CacheOptimizationService = CacheOptimizationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [l1_cache_service_1.L1CacheService,
        l2_cache_service_1.L2CacheService,
        l3_cache_service_1.L3CacheService,
        cache_access_pattern_tracker_service_1.CacheAccessPatternTrackerService,
        event_emitter_1.EventEmitter2])
], CacheOptimizationService);
//# sourceMappingURL=cache-optimization.service.js.map