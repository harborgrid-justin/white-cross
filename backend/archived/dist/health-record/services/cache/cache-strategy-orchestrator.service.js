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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheStrategyOrchestratorService = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const health_record_metrics_service_1 = require("../health-record-metrics.service");
const l1_cache_service_1 = require("./l1-cache.service");
const l2_cache_service_1 = require("./l2-cache.service");
const l3_cache_service_1 = require("./l3-cache.service");
const cache_optimization_service_1 = require("./cache-optimization.service");
const cache_access_pattern_tracker_service_1 = require("./cache-access-pattern-tracker.service");
const base_1 = require("../../../common/base");
const logger_service_1 = require("../../../common/logging/logger.service");
const cache_interfaces_1 = require("./cache-interfaces");
let CacheStrategyOrchestratorService = class CacheStrategyOrchestratorService extends base_1.BaseService {
    metricsService;
    eventEmitter;
    l1Cache;
    l2Cache;
    l3Cache;
    optimization;
    patternTracker;
    constructor(logger, metricsService, eventEmitter, l1Cache, l2Cache, l3Cache, optimization, patternTracker) {
        super({
            serviceName: 'CacheStrategyOrchestratorService',
            logger,
            enableAuditLogging: true,
        });
        this.metricsService = metricsService;
        this.eventEmitter = eventEmitter;
        this.l1Cache = l1Cache;
        this.l2Cache = l2Cache;
        this.l3Cache = l3Cache;
        this.optimization = optimization;
        this.patternTracker = patternTracker;
        this.initializeCacheStrategy();
        this.setupEventListeners();
    }
    initializeCacheStrategy() {
        this.logInfo('Initializing advanced multi-tier cache strategy orchestrator');
        this.logInfo('Cache strategy orchestrator initialized successfully');
    }
    async get(key, compliance) {
        const startTime = Date.now();
        try {
            const l1Result = await this.l1Cache.get(key, compliance);
            if (l1Result !== null) {
                this.patternTracker.updateAccessPattern(key, 'L1_HIT');
                this.recordCacheHit('L1', Date.now() - startTime);
                return {
                    success: true,
                    data: l1Result,
                    responseTime: Date.now() - startTime,
                    tier: cache_interfaces_1.CacheTier.L1,
                };
            }
            const l2Result = await this.l2Cache.get(key, compliance);
            if (l2Result !== null) {
                await this.promoteToL1(key, l2Result, compliance);
                this.patternTracker.updateAccessPattern(key, 'L2_HIT');
                this.recordCacheHit('L2', Date.now() - startTime);
                return {
                    success: true,
                    data: l2Result,
                    responseTime: Date.now() - startTime,
                    tier: cache_interfaces_1.CacheTier.L2,
                };
            }
            const l3Result = await this.l3Cache.get(key, compliance);
            if (l3Result !== null) {
                await this.considerPromotion(key, l3Result, compliance);
                this.patternTracker.updateAccessPattern(key, 'L3_HIT');
                this.recordCacheHit('L3', Date.now() - startTime);
                return {
                    success: true,
                    data: l3Result,
                    responseTime: Date.now() - startTime,
                    tier: cache_interfaces_1.CacheTier.L3,
                };
            }
            this.patternTracker.updateAccessPattern(key, 'MISS');
            this.recordCacheMiss(Date.now() - startTime);
            return {
                success: false,
                responseTime: Date.now() - startTime,
            };
        }
        catch (error) {
            this.logError(`Cache get operation failed for key ${key}:`, error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
                responseTime: Date.now() - startTime,
            };
        }
    }
    async set(key, data, ttl, compliance, tags = []) {
        const startTime = Date.now();
        const dataSize = this.calculateDataSize(data);
        try {
            const cacheEntry = {
                data,
                timestamp: new Date(),
                accessCount: 1,
                lastAccessed: new Date(),
                compliance,
                encrypted: compliance === cache_interfaces_1.ComplianceLevel.PHI || compliance === cache_interfaces_1.ComplianceLevel.SENSITIVE_PHI,
                tags,
                size: dataSize,
                tier: this.determineBestTier(key, dataSize, compliance),
            };
            await this.setInOptimalTier(key, cacheEntry, ttl);
            this.patternTracker.updateAccessPattern(key, 'SET', {
                dataType: this.extractDataType(key, tags),
            });
            this.recordCacheSet(cacheEntry.tier, Date.now() - startTime, dataSize);
            this.optimization.scheduleRelatedPrefetch(key, tags, compliance);
            return {
                success: true,
                responseTime: Date.now() - startTime,
                tier: cacheEntry.tier,
            };
        }
        catch (error) {
            this.logError(`Cache set operation failed for key ${key}:`, error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
                responseTime: Date.now() - startTime,
            };
        }
    }
    async invalidate(pattern, reason = 'manual') {
        const patterns = Array.isArray(pattern) ? pattern : [pattern];
        let invalidatedCount = 0;
        const tiersAffected = new Set();
        for (const pat of patterns) {
            const l1Count = await this.l1Cache.invalidate(pat);
            const l2Count = await this.l2Cache.invalidate(pat);
            const l3Count = await this.l3Cache.invalidate(pat);
            if (l1Count > 0)
                tiersAffected.add(cache_interfaces_1.CacheTier.L1);
            if (l2Count > 0)
                tiersAffected.add(cache_interfaces_1.CacheTier.L2);
            if (l3Count > 0)
                tiersAffected.add(cache_interfaces_1.CacheTier.L3);
            invalidatedCount += l1Count + l2Count + l3Count;
            this.patternTracker.removeAccessPattern(pat);
        }
        this.logInfo(`Cache invalidation completed: ${invalidatedCount} entries removed, reason: ${reason}`);
        this.eventEmitter.emit('cache.invalidated', {
            patterns,
            reason,
            count: invalidatedCount,
            tiersAffected: Array.from(tiersAffected),
        });
        return {
            invalidatedCount,
            tiersAffected: Array.from(tiersAffected),
        };
    }
    getCacheMetrics() {
        const l1Stats = this.l1Cache.getStats();
        const l2Stats = this.l2Cache.getStats();
        const l3Stats = this.l3Cache.getStats();
        const totalHits = l1Stats.hits + l2Stats.hits + l3Stats.hits;
        const totalMisses = l1Stats.misses + l2Stats.misses + l3Stats.misses;
        const totalRequests = totalHits + totalMisses;
        return {
            l1Stats,
            l2Stats,
            l3Stats,
            overall: {
                hitRate: totalRequests > 0 ? totalHits / totalRequests : 0,
                averageResponseTime: this.calculateAverageResponseTime(),
                totalMemoryUsage: l1Stats.memoryUsage || 0,
            },
        };
    }
    getAccessPatterns() {
        return this.patternTracker
            .getAccessPatterns()
            .sort((a, b) => b.importance - a.importance)
            .slice(0, 100);
    }
    async promoteToL1(key, data, compliance) {
        const entry = {
            data,
            timestamp: new Date(),
            accessCount: 1,
            lastAccessed: new Date(),
            compliance,
            encrypted: compliance === cache_interfaces_1.ComplianceLevel.PHI || compliance === cache_interfaces_1.ComplianceLevel.SENSITIVE_PHI,
            tags: [],
            size: this.calculateDataSize(data),
            tier: cache_interfaces_1.CacheTier.L1,
        };
        await this.l1Cache.set(key, entry, 3600);
    }
    async considerPromotion(key, data, compliance) {
        const pattern = this.patternTracker.getAccessPattern(key);
        if (pattern && pattern.frequency > 3) {
            await this.promoteToL1(key, data, compliance);
        }
    }
    determineBestTier(key, dataSize, compliance) {
        if (compliance === cache_interfaces_1.ComplianceLevel.PHI || compliance === cache_interfaces_1.ComplianceLevel.SENSITIVE_PHI) {
            return dataSize < 1024 * 10 ? cache_interfaces_1.CacheTier.L1 : cache_interfaces_1.CacheTier.L2;
        }
        if (dataSize > 1024 * 100) {
            return cache_interfaces_1.CacheTier.L3;
        }
        if (dataSize > 1024 * 10) {
            return cache_interfaces_1.CacheTier.L2;
        }
        return cache_interfaces_1.CacheTier.L1;
    }
    async setInOptimalTier(key, entry, ttl) {
        switch (entry.tier) {
            case cache_interfaces_1.CacheTier.L1:
                await this.l1Cache.set(key, entry, ttl);
                break;
            case cache_interfaces_1.CacheTier.L2:
                await this.l2Cache.set(key, entry, ttl);
                break;
            case cache_interfaces_1.CacheTier.L3:
                await this.l3Cache.set(key, entry, ttl);
                break;
        }
    }
    calculateDataSize(data) {
        try {
            return JSON.stringify(data).length;
        }
        catch {
            return 0;
        }
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
    setupEventListeners() {
        this.eventEmitter.on('health-record.created', (data) => {
            this.invalidateStudentCache(data.studentId);
        });
        this.eventEmitter.on('health-record.updated', (data) => {
            this.invalidateStudentCache(data.studentId);
        });
        this.eventEmitter.on('health-record.deleted', (data) => {
            this.invalidateStudentCache(data.studentId);
        });
    }
    async invalidateStudentCache(studentId) {
        const patterns = [
            `hr:*student/${studentId}*`,
            `hr:*student:${studentId}*`,
            `hr:*students:${studentId}*`,
        ];
        await this.invalidate(patterns, 'student_data_changed');
    }
    recordCacheHit(tier, responseTime) {
        this.metricsService.recordCacheMetrics('HIT', tier, responseTime);
    }
    recordCacheMiss(responseTime) {
        this.metricsService.recordCacheMetrics('MISS', 'MULTI_TIER', responseTime);
    }
    recordCacheSet(tier, responseTime, dataSize) {
        this.metricsService.recordCacheMetrics('SET', tier, responseTime);
    }
    calculateAverageResponseTime() {
        return 50;
    }
    onModuleDestroy() {
        this.logInfo('Cache Strategy Orchestrator Service destroyed');
    }
};
exports.CacheStrategyOrchestratorService = CacheStrategyOrchestratorService;
exports.CacheStrategyOrchestratorService = CacheStrategyOrchestratorService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(logger_service_1.LoggerService)),
    __metadata("design:paramtypes", [logger_service_1.LoggerService,
        health_record_metrics_service_1.HealthRecordMetricsService,
        event_emitter_1.EventEmitter2,
        l1_cache_service_1.L1CacheService,
        l2_cache_service_1.L2CacheService,
        l3_cache_service_1.L3CacheService,
        cache_optimization_service_1.CacheOptimizationService,
        cache_access_pattern_tracker_service_1.CacheAccessPatternTrackerService])
], CacheStrategyOrchestratorService);
//# sourceMappingURL=cache-strategy-orchestrator.service.js.map