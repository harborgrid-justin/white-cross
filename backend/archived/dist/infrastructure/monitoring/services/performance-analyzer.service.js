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
exports.PerformanceAnalyzerService = void 0;
const common_1 = require("@nestjs/common");
const request_metrics_service_1 = require("./request-metrics.service");
const cache_metrics_service_1 = require("./cache-metrics.service");
const system_metrics_service_1 = require("./system-metrics.service");
const base_1 = require("../../../common/base");
let PerformanceAnalyzerService = class PerformanceAnalyzerService extends base_1.BaseService {
    requestMetrics;
    cacheMetrics;
    systemMetrics;
    MAX_HISTORY_POINTS = 1440;
    performanceHistory = [];
    startTime = Date.now();
    constructor(requestMetrics, cacheMetrics, systemMetrics) {
        super('PerformanceAnalyzerService');
        this.requestMetrics = requestMetrics;
        this.cacheMetrics = cacheMetrics;
        this.systemMetrics = systemMetrics;
    }
    recordPerformanceSummary() {
        const uptime = Date.now() - this.startTime;
        const uptimeSeconds = uptime / 1000;
        const requestStats = this.requestMetrics.getRequestStats();
        const cacheMetrics = this.cacheMetrics.getCacheMetrics();
        const systemMetrics = this.systemMetrics.collectSystemMetrics();
        const topEndpoints = this.requestMetrics.getTopEndpoints(10);
        const slowestEndpoints = this.requestMetrics.getSlowestEndpoints(10);
        const summary = {
            timestamp: new Date(),
            uptime,
            requests: {
                total: requestStats.totalRequests,
                perSecond: requestStats.totalRequests / uptimeSeconds,
                avgDuration: requestStats.avgDuration,
                errorRate: requestStats.errorRate,
            },
            queries: {
                totalQueries: 0,
                slowQueries: 0,
                avgQueryTime: 0,
                p50QueryTime: 0,
                p95QueryTime: 0,
                p99QueryTime: 0,
                n1DetectionCount: 0,
                queryDistribution: {
                    fast: 0,
                    medium: 0,
                    slow: 0,
                    verySlow: 0,
                },
            },
            cache: cacheMetrics,
            pool: systemMetrics.pool,
            memory: systemMetrics.memory,
            topEndpoints,
            slowestEndpoints,
        };
        this.performanceHistory.push(summary);
        if (this.performanceHistory.length > this.MAX_HISTORY_POINTS) {
            this.performanceHistory.shift();
        }
    }
    getCurrentSummary() {
        this.systemMetrics.collectSystemMetrics();
        this.recordPerformanceSummary();
        return this.performanceHistory[this.performanceHistory.length - 1];
    }
    getPerformanceTrends(hours = 1) {
        const trends = [];
        const cutoff = Date.now() - hours * 3600000;
        const recentHistory = this.performanceHistory.filter((h) => h.timestamp.getTime() >= cutoff);
        if (recentHistory.length < 2) {
            return trends;
        }
        const baseline = recentHistory[0];
        const current = recentHistory[recentHistory.length - 1];
        trends.push(this.calculateTrend('avgRequestDuration', baseline, current));
        trends.push(this.calculateTrend('requestsPerSecond', baseline, current));
        trends.push(this.calculateTrend('errorRate', baseline, current));
        trends.push(this.calculateTrend('cacheHitRate', baseline, current));
        trends.push(this.calculateTrend('memoryUtilization', baseline, current));
        trends.push(this.calculateTrend('poolUtilization', baseline, current));
        return trends;
    }
    calculateTrend(metric, baseline, current) {
        let baselineValue = 0;
        let currentValue = 0;
        switch (metric) {
            case 'avgRequestDuration':
                baselineValue = baseline.requests.avgDuration;
                currentValue = current.requests.avgDuration;
                break;
            case 'requestsPerSecond':
                baselineValue = baseline.requests.perSecond;
                currentValue = current.requests.perSecond;
                break;
            case 'errorRate':
                baselineValue = baseline.requests.errorRate;
                currentValue = current.requests.errorRate;
                break;
            case 'cacheHitRate':
                baselineValue = baseline.cache.hitRate;
                currentValue = current.cache.hitRate;
                break;
            case 'memoryUtilization':
                baselineValue = baseline.memory.utilizationPercent;
                currentValue = current.memory.utilizationPercent;
                break;
            case 'poolUtilization':
                baselineValue = baseline.pool.utilizationPercent;
                currentValue = current.pool.utilizationPercent;
                break;
        }
        const percentChange = baselineValue !== 0 ? ((currentValue - baselineValue) / baselineValue) * 100 : 0;
        let trend;
        if (Math.abs(percentChange) < 5) {
            trend = 'stable';
        }
        else if ((metric === 'avgRequestDuration' ||
            metric === 'errorRate' ||
            metric === 'memoryUtilization') &&
            percentChange > 0) {
            trend = 'degrading';
        }
        else if (percentChange > 0) {
            trend = 'improving';
        }
        else {
            trend = 'degrading';
        }
        return {
            timestamp: current.timestamp,
            metric,
            value: currentValue,
            baseline: baselineValue,
            percentChange,
            trend,
        };
    }
    getPerformanceHistory(hours = 1) {
        const cutoff = Date.now() - hours * 3600000;
        return this.performanceHistory.filter((h) => h.timestamp.getTime() >= cutoff);
    }
    reset() {
        this.performanceHistory = [];
        this.startTime = Date.now();
        this.logInfo('Performance history reset');
    }
};
exports.PerformanceAnalyzerService = PerformanceAnalyzerService;
exports.PerformanceAnalyzerService = PerformanceAnalyzerService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [request_metrics_service_1.RequestMetricsService,
        cache_metrics_service_1.CacheMetricsService,
        system_metrics_service_1.SystemMetricsService])
], PerformanceAnalyzerService);
//# sourceMappingURL=performance-analyzer.service.js.map