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
exports.CacheMonitoringService = void 0;
const common_1 = require("@nestjs/common");
const query_cache_service_1 = require("./query-cache.service");
const base_1 = require("../../common/base");
let CacheMonitoringService = class CacheMonitoringService extends base_1.BaseService {
    queryCacheService;
    serviceStats = new Map();
    constructor(queryCacheService) {
        super("CacheMonitoringService");
        this.queryCacheService = queryCacheService;
    }
    getCacheHealthReport() {
        const stats = this.queryCacheService.getStats();
        const serviceBreakdown = Array.from(this.serviceStats.values());
        const overallHitRate = stats.hitRate;
        const recommendations = this.generateRecommendations(stats, serviceBreakdown);
        const performanceGrade = this.calculatePerformanceGrade(overallHitRate);
        return {
            overallHitRate,
            totalCacheSize: stats.localCacheSize,
            recommendedActions: recommendations,
            serviceBreakdown,
            timestamp: new Date().toISOString(),
            performanceGrade,
        };
    }
    getDetailedStats() {
        const stats = this.queryCacheService.getStats();
        return {
            ...stats,
            cacheEfficiency: this.calculateCacheEfficiency(stats),
            memoryUsage: this.estimateMemoryUsage(stats.localCacheSize),
            recommendations: this.generateRecommendations(stats, []),
            formattedReport: this.queryCacheService.getFormattedStats(),
        };
    }
    recordServiceQuery(serviceName, wasCached, responseTime) {
        const existing = this.serviceStats.get(serviceName) || {
            serviceName,
            totalQueries: 0,
            cachedQueries: 0,
            hitRate: 0,
            averageResponseTime: 0,
            lastUpdate: new Date().toISOString(),
        };
        existing.totalQueries++;
        if (wasCached) {
            existing.cachedQueries++;
        }
        existing.hitRate = existing.cachedQueries / existing.totalQueries;
        existing.averageResponseTime =
            (existing.averageResponseTime * (existing.totalQueries - 1) +
                responseTime) /
                existing.totalQueries;
        existing.lastUpdate = new Date().toISOString();
        this.serviceStats.set(serviceName, existing);
    }
    calculateCacheEfficiency(stats) {
        if (stats.hits + stats.misses === 0)
            return 0;
        const hitRateScore = stats.hitRate * 60;
        const utilizationScore = Math.min(stats.localCacheSize / 1000, 1) * 20;
        const operationalScore = (stats.sets / (stats.sets + stats.deletes + 1)) * 20;
        return Math.round(hitRateScore + utilizationScore + operationalScore);
    }
    estimateMemoryUsage(cacheSize) {
        const estimatedBytes = cacheSize * 1024;
        if (estimatedBytes < 1024)
            return `${estimatedBytes} B`;
        if (estimatedBytes < 1024 * 1024)
            return `${(estimatedBytes / 1024).toFixed(2)} KB`;
        return `${(estimatedBytes / (1024 * 1024)).toFixed(2)} MB`;
    }
    generateRecommendations(stats, serviceBreakdown) {
        const recommendations = [];
        if (stats.hitRate < 0.4) {
            recommendations.push('CRITICAL: Cache hit rate below 40%. Consider increasing TTL values or reviewing cache key strategies.');
        }
        else if (stats.hitRate < 0.6) {
            recommendations.push('WARNING: Cache hit rate below 60%. Review frequently accessed queries and increase cache coverage.');
        }
        else if (stats.hitRate >= 0.8) {
            recommendations.push('EXCELLENT: Cache hit rate above 80%. Current caching strategy is highly effective.');
        }
        if (stats.localCacheSize > 900) {
            recommendations.push('WARNING: Cache approaching maximum size (90%). Consider implementing cache eviction policies or increasing cache limits.');
        }
        serviceBreakdown.forEach((service) => {
            if (service.hitRate < 0.3 && service.totalQueries > 10) {
                recommendations.push(`Consider increasing cache TTL for ${service.serviceName} (current hit rate: ${(service.hitRate * 100).toFixed(1)}%)`);
            }
        });
        if (!stats.redisAvailable && stats.localCacheSize > 500) {
            recommendations.push('OPTIMIZATION: Consider enabling Redis for distributed caching and improved scalability.');
        }
        if (recommendations.length === 0) {
            recommendations.push('Cache performance is optimal. No immediate actions required.');
        }
        return recommendations;
    }
    calculatePerformanceGrade(hitRate) {
        if (hitRate >= 0.8)
            return 'A';
        if (hitRate >= 0.6)
            return 'B';
        if (hitRate >= 0.4)
            return 'C';
        if (hitRate >= 0.2)
            return 'D';
        return 'F';
    }
    resetStatistics() {
        this.queryCacheService.resetStats();
        this.serviceStats.clear();
        this.logInfo('Cache statistics reset');
    }
    getServiceStats(serviceName) {
        return this.serviceStats.get(serviceName) || null;
    }
    getTopPerformingServices(limit = 5) {
        return Array.from(this.serviceStats.values())
            .sort((a, b) => b.hitRate - a.hitRate)
            .slice(0, limit);
    }
    getUnderperformingServices(threshold = 0.4) {
        return Array.from(this.serviceStats.values())
            .filter((s) => s.hitRate < threshold && s.totalQueries > 10)
            .sort((a, b) => a.hitRate - b.hitRate);
    }
};
exports.CacheMonitoringService = CacheMonitoringService;
exports.CacheMonitoringService = CacheMonitoringService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [query_cache_service_1.QueryCacheService])
], CacheMonitoringService);
//# sourceMappingURL=cache-monitoring.service.js.map