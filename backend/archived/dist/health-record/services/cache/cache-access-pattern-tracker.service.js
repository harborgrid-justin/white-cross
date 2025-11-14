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
exports.CacheAccessPatternTrackerService = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const cache_constants_1 = require("./cache-constants");
const base_1 = require("../../../common/base");
let CacheAccessPatternTrackerService = class CacheAccessPatternTrackerService extends base_1.BaseService {
    eventEmitter;
    accessPatterns = new Map();
    frequencyMap = new Map();
    maxTrackedPatterns = cache_constants_1.CACHE_CONSTANTS.METRICS.MAX_TRACKED_PATTERNS;
    constructor(eventEmitter) {
        super("CacheAccessPatternTrackerService");
        this.eventEmitter = eventEmitter;
        this.setupEventListeners();
    }
    recordAccess(key, hit, responseTime, tier) {
        try {
            this.updateAccessPattern(key, hit, responseTime, tier);
            this.updateFrequencyMap(key, hit);
            this.eventEmitter.emit(cache_constants_1.CACHE_EVENTS.ACCESS_RECORDED, {
                key,
                hit,
                responseTime,
                tier,
                timestamp: new Date(),
            });
        }
        catch (error) {
            this.logError(`Failed to record access for key ${key}:`, error);
        }
    }
    getAccessPattern(key) {
        return this.accessPatterns.get(key) || null;
    }
    getAccessPatterns() {
        return Array.from(this.accessPatterns.values());
    }
    getTopAccessedKeys(limit = 10) {
        return Array.from(this.accessPatterns.entries())
            .sort(([, a], [, b]) => b.totalAccesses - a.totalAccesses)
            .slice(0, limit)
            .map(([key, pattern]) => ({ key, pattern }));
    }
    getPredictiveRecommendations() {
        const recommendations = [];
        for (const [key, pattern] of this.accessPatterns.entries()) {
            if (this.shouldPromoteToHigherTier(pattern)) {
                recommendations.push({
                    key,
                    action: 'promote',
                    reason: 'High access frequency and hit rate',
                    confidence: this.calculatePromotionConfidence(pattern),
                    estimatedBenefit: this.calculateEstimatedBenefit(pattern),
                });
            }
            else if (this.shouldDemoteToLowerTier(pattern)) {
                recommendations.push({
                    key,
                    action: 'demote',
                    reason: 'Low access frequency',
                    confidence: this.calculateDemotionConfidence(pattern),
                    estimatedBenefit: this.calculateEstimatedBenefit(pattern),
                });
            }
        }
        return recommendations.sort((a, b) => b.confidence - a.confidence);
    }
    getAccessStats() {
        const totalAccesses = Array.from(this.accessPatterns.values())
            .reduce((sum, pattern) => sum + pattern.totalAccesses, 0);
        const totalHits = Array.from(this.accessPatterns.values())
            .reduce((sum, pattern) => sum + pattern.hits, 0);
        const averageHitRate = totalAccesses > 0 ? totalHits / totalAccesses : 0;
        const topKeysByAccess = this.getTopAccessedKeys(5).map(item => item.key);
        const patternsByFrequency = this.categorizePatternsByFrequency();
        return {
            totalKeys: this.accessPatterns.size,
            totalAccesses,
            averageHitRate,
            topKeysByAccess,
            patternsByFrequency,
        };
    }
    cleanupOldPatterns(maxAge = cache_constants_1.CACHE_CONSTANTS.METRICS.MAX_AGE) {
        const cutoffTime = Date.now() - maxAge;
        let removedCount = 0;
        for (const [key, pattern] of this.accessPatterns.entries()) {
            if (pattern.lastAccessed.getTime() < cutoffTime) {
                this.accessPatterns.delete(key);
                this.frequencyMap.delete(key);
                removedCount++;
            }
        }
        if (removedCount > 0) {
            this.logInfo(`Cleaned up ${removedCount} old access patterns`);
        }
        return removedCount;
    }
    reset() {
        this.accessPatterns.clear();
        this.frequencyMap.clear();
        this.logInfo('Access pattern tracking reset');
    }
    setupEventListeners() {
        this.eventEmitter.on(cache_constants_1.CACHE_EVENTS.INVALIDATED, (data) => {
            const pattern = this.accessPatterns.get(data.key);
            if (pattern) {
                pattern.invalidations++;
                pattern.lastInvalidated = new Date();
            }
        });
        this.eventEmitter.on(cache_constants_1.CACHE_EVENTS.WARMED, (data) => {
            const pattern = this.accessPatterns.get(data.key);
            if (pattern) {
                pattern.warmingAttempts++;
                if (data.success) {
                    pattern.successfulWarmings++;
                }
            }
        });
    }
    updateAccessPattern(key, hit, responseTime, tier) {
        let pattern = this.accessPatterns.get(key);
        if (!pattern) {
            if (this.accessPatterns.size >= this.maxTrackedPatterns) {
                this.evictLeastImportantPattern();
            }
            pattern = {
                key,
                totalAccesses: 0,
                hits: 0,
                misses: 0,
                averageResponseTime: 0,
                lastAccessed: new Date(),
                firstAccessed: new Date(),
                accessFrequency: 'low',
                tier,
                invalidations: 0,
                warmingAttempts: 0,
                successfulWarmings: 0,
                lastInvalidated: null,
            };
            this.accessPatterns.set(key, pattern);
        }
        pattern.totalAccesses++;
        if (hit) {
            pattern.hits++;
        }
        else {
            pattern.misses++;
        }
        pattern.averageResponseTime = ((pattern.averageResponseTime * (pattern.totalAccesses - 1)) + responseTime) / pattern.totalAccesses;
        pattern.lastAccessed = new Date();
        pattern.tier = tier;
        pattern.accessFrequency = this.calculateAccessFrequency(pattern);
    }
    updateFrequencyMap(key, hit) {
        let frequency = this.frequencyMap.get(key);
        if (!frequency) {
            frequency = {
                key,
                hourlyAccesses: 0,
                dailyAccesses: 0,
                weeklyAccesses: 0,
                lastHourAccesses: 0,
                lastDayAccesses: 0,
                lastWeekAccesses: 0,
                hitRate: 0,
                lastUpdated: new Date(),
            };
            this.frequencyMap.set(key, frequency);
        }
        frequency.hourlyAccesses++;
        frequency.dailyAccesses++;
        frequency.lastHourAccesses++;
        frequency.lastDayAccesses++;
        frequency.lastWeekAccesses++;
        const pattern = this.accessPatterns.get(key);
        if (pattern) {
            frequency.hitRate = pattern.hits / pattern.totalAccesses;
        }
        frequency.lastUpdated = new Date();
    }
    calculateAccessFrequency(pattern) {
        const accessesPerHour = pattern.totalAccesses /
            Math.max(1, (Date.now() - pattern.firstAccessed.getTime()) / (1000 * 60 * 60));
        if (accessesPerHour >= cache_constants_1.CACHE_CONSTANTS.METRICS.FREQUENCY_THRESHOLDS.VERY_HIGH)
            return 'very_high';
        if (accessesPerHour >= cache_constants_1.CACHE_CONSTANTS.METRICS.FREQUENCY_THRESHOLDS.HIGH)
            return 'high';
        if (accessesPerHour >= cache_constants_1.CACHE_CONSTANTS.METRICS.FREQUENCY_THRESHOLDS.MEDIUM)
            return 'medium';
        return 'low';
    }
    shouldPromoteToHigherTier(pattern) {
        const hitRate = pattern.hits / pattern.totalAccesses;
        return (pattern.accessFrequency === 'high' || pattern.accessFrequency === 'very_high') && hitRate > cache_constants_1.CACHE_CONSTANTS.METRICS.PROMOTION_HIT_RATE_THRESHOLD
            && pattern.averageResponseTime > cache_constants_1.CACHE_CONSTANTS.METRICS.PROMOTION_RESPONSE_TIME_THRESHOLD;
    }
    shouldDemoteToLowerTier(pattern) {
        const timeSinceLastAccess = Date.now() - pattern.lastAccessed.getTime();
        return timeSinceLastAccess > cache_constants_1.CACHE_CONSTANTS.METRICS.DEMOTION_TIME_THRESHOLD
            && pattern.accessFrequency === 'low';
    }
    calculatePromotionConfidence(pattern) {
        const hitRate = pattern.hits / pattern.totalAccesses;
        const frequencyScore = pattern.accessFrequency === 'very_high' ? 1 :
            pattern.accessFrequency === 'high' ? 0.8 : 0.6;
        const hitRateScore = Math.min(hitRate / 0.9, 1);
        return (frequencyScore + hitRateScore) / 2;
    }
    calculateDemotionConfidence(pattern) {
        const timeSinceLastAccess = Date.now() - pattern.lastAccessed.getTime();
        const timeScore = Math.min(timeSinceLastAccess / (7 * 24 * 60 * 60 * 1000), 1);
        const frequencyScore = pattern.accessFrequency === 'low' ? 1 : 0.5;
        return (timeScore + frequencyScore) / 2;
    }
    calculateEstimatedBenefit(pattern) {
        return pattern.averageResponseTime * (pattern.hits / pattern.totalAccesses) * pattern.totalAccesses;
    }
    categorizePatternsByFrequency() {
        const categories = {
            very_high: 0,
            high: 0,
            medium: 0,
            low: 0,
        };
        for (const pattern of this.accessPatterns.values()) {
            categories[pattern.accessFrequency]++;
        }
        return categories;
    }
    evictLeastImportantPattern() {
        if (this.accessPatterns.size === 0)
            return;
        let leastImportantKey = null;
        let lowestScore = Infinity;
        for (const [key, pattern] of this.accessPatterns.entries()) {
            const score = this.calculatePatternImportanceScore(pattern);
            if (score < lowestScore) {
                lowestScore = score;
                leastImportantKey = key;
            }
        }
        if (leastImportantKey) {
            this.accessPatterns.delete(leastImportantKey);
            this.frequencyMap.delete(leastImportantKey);
        }
    }
    calculatePatternImportanceScore(pattern) {
        const recencyScore = Date.now() - pattern.lastAccessed.getTime();
        const frequencyScore = pattern.totalAccesses;
        const hitRateScore = pattern.hits / pattern.totalAccesses;
        return recencyScore / (frequencyScore * hitRateScore + 1);
    }
};
exports.CacheAccessPatternTrackerService = CacheAccessPatternTrackerService;
exports.CacheAccessPatternTrackerService = CacheAccessPatternTrackerService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [event_emitter_1.EventEmitter2])
], CacheAccessPatternTrackerService);
//# sourceMappingURL=cache-access-pattern-tracker.service.js.map