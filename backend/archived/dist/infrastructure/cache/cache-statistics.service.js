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
exports.CacheStatisticsService = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const terminus_1 = require("@nestjs/terminus");
const cache_service_1 = require("./cache.service");
const cache_warming_service_1 = require("./cache-warming.service");
const rate_limiter_service_1 = require("./rate-limiter.service");
const cache_interfaces_1 = require("./cache.interfaces");
const logger_service_1 = require("../../common/logging/logger.service");
const common_2 = require("@nestjs/common");
let CacheStatisticsService = class CacheStatisticsService extends terminus_1.HealthIndicator {
    cacheService;
    warmingService;
    rateLimiterService;
    eventCounts = {
        hits: 0,
        misses: 0,
        sets: 0,
        deletes: 0,
        invalidations: 0,
        errors: 0,
        evictions: 0,
        warms: 0,
    };
    latencyBuckets = {
        '<10ms': 0,
        '<50ms': 0,
        '<100ms': 0,
        '<500ms': 0,
        '>=500ms': 0,
    };
    constructor(logger, cacheService, warmingService, rateLimiterService) {
        super({
            serviceName: 'CacheStatisticsService',
            logger,
            enableAuditLogging: true,
        });
        this.cacheService = cacheService;
        this.warmingService = warmingService;
        this.rateLimiterService = rateLimiterService;
    }
    async getMetrics() {
        const stats = this.cacheService.getStats();
        const health = await this.cacheService.getHealth();
        const warming = this.warmingService.getStats();
        const rateLimit = this.rateLimiterService.getStats();
        const failureRate = stats.totalOperations > 0
            ? (stats.failedOperations / stats.totalOperations) * 100
            : 0;
        return {
            stats: {
                hits: stats.hits,
                misses: stats.misses,
                hitRate: stats.hitRate,
                l1Hits: stats.l1Hits,
                l2Hits: stats.l2Hits,
                keys: stats.keys,
                memoryUsage: stats.memoryUsage,
            },
            performance: {
                avgGetLatency: stats.avgGetLatency,
                avgSetLatency: stats.avgSetLatency,
                totalOperations: stats.totalOperations,
                failedOperations: stats.failedOperations,
                failureRate: Math.round(failureRate * 100) / 100,
            },
            health: {
                status: health.status,
                redisConnected: health.redisConnected,
                redisLatency: health.redisLatency,
                l1Status: health.l1Status,
                uptime: health.uptime,
            },
            warming: {
                totalWarmed: warming.totalWarmed,
                lastCount: warming.lastCount,
                failures: warming.failures,
                lastWarmingTime: warming.lastWarmingTime,
                strategies: warming.strategies,
            },
            rateLimit: {
                totalRequests: rateLimit.totalRequests,
                limitedRequests: rateLimit.limitedRequests,
                limitRate: rateLimit.limitRate,
                uniqueKeys: rateLimit.uniqueKeys,
            },
            events: {
                hits: this.eventCounts.hits,
                misses: this.eventCounts.misses,
                sets: this.eventCounts.sets,
                deletes: this.eventCounts.deletes,
                invalidations: this.eventCounts.invalidations,
                errors: this.eventCounts.errors,
                evictions: this.eventCounts.evictions,
            },
        };
    }
    async getPrometheusMetrics() {
        const metrics = await this.getMetrics();
        const lines = [];
        lines.push('# HELP cache_hits_total Total number of cache hits');
        lines.push('# TYPE cache_hits_total counter');
        lines.push(`cache_hits_total ${metrics.stats.hits}`);
        lines.push('# HELP cache_misses_total Total number of cache misses');
        lines.push('# TYPE cache_misses_total counter');
        lines.push(`cache_misses_total ${metrics.stats.misses}`);
        lines.push('# HELP cache_hit_rate Cache hit rate percentage');
        lines.push('# TYPE cache_hit_rate gauge');
        lines.push(`cache_hit_rate ${metrics.stats.hitRate}`);
        lines.push('# HELP cache_l1_hits_total Total number of L1 cache hits');
        lines.push('# TYPE cache_l1_hits_total counter');
        lines.push(`cache_l1_hits_total ${metrics.stats.l1Hits}`);
        lines.push('# HELP cache_l2_hits_total Total number of L2 cache hits');
        lines.push('# TYPE cache_l2_hits_total counter');
        lines.push(`cache_l2_hits_total ${metrics.stats.l2Hits}`);
        lines.push('# HELP cache_keys_total Total number of keys in cache');
        lines.push('# TYPE cache_keys_total gauge');
        lines.push(`cache_keys_total ${metrics.stats.keys}`);
        lines.push('# HELP cache_memory_bytes Memory usage in bytes');
        lines.push('# TYPE cache_memory_bytes gauge');
        lines.push(`cache_memory_bytes ${metrics.stats.memoryUsage}`);
        lines.push('# HELP cache_get_latency_ms Average GET latency in milliseconds');
        lines.push('# TYPE cache_get_latency_ms gauge');
        lines.push(`cache_get_latency_ms ${metrics.performance.avgGetLatency}`);
        lines.push('# HELP cache_set_latency_ms Average SET latency in milliseconds');
        lines.push('# TYPE cache_set_latency_ms gauge');
        lines.push(`cache_set_latency_ms ${metrics.performance.avgSetLatency}`);
        lines.push('# HELP cache_operations_total Total cache operations');
        lines.push('# TYPE cache_operations_total counter');
        lines.push(`cache_operations_total ${metrics.performance.totalOperations}`);
        lines.push('# HELP cache_failed_operations_total Total failed cache operations');
        lines.push('# TYPE cache_failed_operations_total counter');
        lines.push(`cache_failed_operations_total ${metrics.performance.failedOperations}`);
        lines.push('# HELP cache_health_status Cache health status (1=healthy, 0=unhealthy)');
        lines.push('# TYPE cache_health_status gauge');
        lines.push(`cache_health_status ${metrics.health.status === 'healthy' ? 1 : 0}`);
        lines.push('# HELP cache_redis_connected Redis connection status (1=connected, 0=disconnected)');
        lines.push('# TYPE cache_redis_connected gauge');
        lines.push(`cache_redis_connected ${metrics.health.redisConnected ? 1 : 0}`);
        lines.push('# HELP cache_redis_latency_ms Redis ping latency in milliseconds');
        lines.push('# TYPE cache_redis_latency_ms gauge');
        lines.push(`cache_redis_latency_ms ${metrics.health.redisLatency}`);
        lines.push('# HELP cache_warmed_total Total number of cache entries warmed');
        lines.push('# TYPE cache_warmed_total counter');
        lines.push(`cache_warmed_total ${metrics.warming.totalWarmed}`);
        lines.push('# HELP rate_limit_requests_total Total rate limit requests');
        lines.push('# TYPE rate_limit_requests_total counter');
        lines.push(`rate_limit_requests_total ${metrics.rateLimit.totalRequests}`);
        lines.push('# HELP rate_limit_limited_total Total rate limited requests');
        lines.push('# TYPE rate_limit_limited_total counter');
        lines.push(`rate_limit_limited_total ${metrics.rateLimit.limitedRequests}`);
        return lines.join('\n') + '\n';
    }
    async isHealthy(key) {
        try {
            const health = await this.cacheService.getHealth();
            if (health.status === 'healthy') {
                return this.getStatus(key, true, {
                    status: health.status,
                    redisConnected: health.redisConnected,
                    redisLatency: health.redisLatency,
                    uptime: health.uptime,
                });
            }
            if (health.status === 'degraded') {
                return this.getStatus(key, true, {
                    status: 'degraded',
                    redisConnected: health.redisConnected,
                    warning: 'Cache is operating in degraded mode',
                });
            }
            throw new terminus_1.HealthCheckError('Cache unhealthy', this.getStatus(key, false, health));
        }
        catch (error) {
            throw new terminus_1.HealthCheckError('Cache health check failed', this.getStatus(key, false, {
                error: error instanceof Error ? error.message : 'Unknown error',
            }));
        }
    }
    async getReport() {
        const metrics = await this.getMetrics();
        const lines = [];
        lines.push('=== CACHE STATISTICS REPORT ===');
        lines.push('');
        lines.push('Basic Statistics:');
        lines.push(`  Hits: ${metrics.stats.hits}`);
        lines.push(`  Misses: ${metrics.stats.misses}`);
        lines.push(`  Hit Rate: ${metrics.stats.hitRate}%`);
        lines.push(`  L1 Hits: ${metrics.stats.l1Hits}`);
        lines.push(`  L2 Hits: ${metrics.stats.l2Hits}`);
        lines.push(`  Total Keys: ${metrics.stats.keys}`);
        lines.push(`  Memory Usage: ${this.formatBytes(metrics.stats.memoryUsage)}`);
        lines.push('');
        lines.push('Performance:');
        lines.push(`  Avg GET Latency: ${metrics.performance.avgGetLatency.toFixed(2)}ms`);
        lines.push(`  Avg SET Latency: ${metrics.performance.avgSetLatency.toFixed(2)}ms`);
        lines.push(`  Total Operations: ${metrics.performance.totalOperations}`);
        lines.push(`  Failed Operations: ${metrics.performance.failedOperations}`);
        lines.push(`  Failure Rate: ${metrics.performance.failureRate}%`);
        lines.push('');
        lines.push('Health:');
        lines.push(`  Status: ${metrics.health.status}`);
        lines.push(`  Redis Connected: ${metrics.health.redisConnected ? 'Yes' : 'No'}`);
        lines.push(`  Redis Latency: ${metrics.health.redisLatency}ms`);
        lines.push(`  L1 Status: ${metrics.health.l1Status}`);
        lines.push(`  Uptime: ${this.formatDuration(metrics.health.uptime)}`);
        lines.push('');
        lines.push('Cache Warming:');
        lines.push(`  Total Warmed: ${metrics.warming.totalWarmed}`);
        lines.push(`  Last Count: ${metrics.warming.lastCount}`);
        lines.push(`  Failures: ${metrics.warming.failures}`);
        lines.push(`  Strategies: ${metrics.warming.strategies}`);
        if (metrics.warming.lastWarmingTime) {
            lines.push(`  Last Warming: ${metrics.warming.lastWarmingTime.toISOString()}`);
        }
        lines.push('');
        lines.push('Rate Limiting:');
        lines.push(`  Total Requests: ${metrics.rateLimit.totalRequests}`);
        lines.push(`  Limited Requests: ${metrics.rateLimit.limitedRequests}`);
        lines.push(`  Limit Rate: ${metrics.rateLimit.limitRate}%`);
        lines.push(`  Unique Keys: ${metrics.rateLimit.uniqueKeys}`);
        lines.push('');
        lines.push('Events:');
        lines.push(`  Hits: ${metrics.events.hits}`);
        lines.push(`  Misses: ${metrics.events.misses}`);
        lines.push(`  Sets: ${metrics.events.sets}`);
        lines.push(`  Deletes: ${metrics.events.deletes}`);
        lines.push(`  Invalidations: ${metrics.events.invalidations}`);
        lines.push(`  Errors: ${metrics.events.errors}`);
        lines.push(`  Evictions: ${metrics.events.evictions}`);
        lines.push('');
        lines.push('===============================');
        return lines.join('\n');
    }
    async resetStats() {
        this.cacheService.resetStats();
        this.warmingService.resetStats();
        this.rateLimiterService.resetStats();
        this.eventCounts = {
            hits: 0,
            misses: 0,
            sets: 0,
            deletes: 0,
            invalidations: 0,
            errors: 0,
            evictions: 0,
            warms: 0,
        };
        this.latencyBuckets = {
            '<10ms': 0,
            '<50ms': 0,
            '<100ms': 0,
            '<500ms': 0,
            '>=500ms': 0,
        };
        this.logInfo('Cache statistics reset');
    }
    handleCacheHit(payload) {
        this.eventCounts.hits++;
    }
    handleCacheMiss(payload) {
        this.eventCounts.misses++;
    }
    handleCacheSet(payload) {
        this.eventCounts.sets++;
    }
    handleCacheDelete(payload) {
        this.eventCounts.deletes++;
    }
    handleCacheInvalidate(payload) {
        this.eventCounts.invalidations++;
    }
    handleCacheError(payload) {
        this.eventCounts.errors++;
    }
    handleCacheEvict(payload) {
        this.eventCounts.evictions++;
    }
    handleCacheWarm(payload) {
        this.eventCounts.warms++;
    }
    formatBytes(bytes) {
        if (bytes === 0)
            return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
    }
    formatDuration(seconds) {
        const days = Math.floor(seconds / 86400);
        const hours = Math.floor((seconds % 86400) / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        const parts = [];
        if (days > 0)
            parts.push(`${days}d`);
        if (hours > 0)
            parts.push(`${hours}h`);
        if (minutes > 0)
            parts.push(`${minutes}m`);
        if (secs > 0 || parts.length === 0)
            parts.push(`${secs}s`);
        return parts.join(' ');
    }
};
exports.CacheStatisticsService = CacheStatisticsService;
__decorate([
    (0, event_emitter_1.OnEvent)(cache_interfaces_1.CacheEvent.HIT),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CacheStatisticsService.prototype, "handleCacheHit", null);
__decorate([
    (0, event_emitter_1.OnEvent)(cache_interfaces_1.CacheEvent.MISS),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CacheStatisticsService.prototype, "handleCacheMiss", null);
__decorate([
    (0, event_emitter_1.OnEvent)(cache_interfaces_1.CacheEvent.SET),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CacheStatisticsService.prototype, "handleCacheSet", null);
__decorate([
    (0, event_emitter_1.OnEvent)(cache_interfaces_1.CacheEvent.DELETE),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CacheStatisticsService.prototype, "handleCacheDelete", null);
__decorate([
    (0, event_emitter_1.OnEvent)(cache_interfaces_1.CacheEvent.INVALIDATE),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CacheStatisticsService.prototype, "handleCacheInvalidate", null);
__decorate([
    (0, event_emitter_1.OnEvent)(cache_interfaces_1.CacheEvent.ERROR),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CacheStatisticsService.prototype, "handleCacheError", null);
__decorate([
    (0, event_emitter_1.OnEvent)(cache_interfaces_1.CacheEvent.EVICT),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CacheStatisticsService.prototype, "handleCacheEvict", null);
__decorate([
    (0, event_emitter_1.OnEvent)(cache_interfaces_1.CacheEvent.WARM),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CacheStatisticsService.prototype, "handleCacheWarm", null);
exports.CacheStatisticsService = CacheStatisticsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_2.Inject)(logger_service_1.LoggerService)),
    __metadata("design:paramtypes", [logger_service_1.LoggerService,
        cache_service_1.CacheService,
        cache_warming_service_1.CacheWarmingService,
        rate_limiter_service_1.RateLimiterService])
], CacheStatisticsService);
//# sourceMappingURL=cache-statistics.service.js.map