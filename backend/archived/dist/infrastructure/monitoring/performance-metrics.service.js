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
exports.PerformanceMetricsService = void 0;
const common_1 = require("@nestjs/common");
const request_metrics_service_1 = require("./services/request-metrics.service");
const cache_metrics_service_1 = require("./services/cache-metrics.service");
const system_metrics_service_1 = require("./services/system-metrics.service");
const performance_analyzer_service_1 = require("./services/performance-analyzer.service");
const base_1 = require("../../common/base");
let PerformanceMetricsService = class PerformanceMetricsService extends base_1.BaseService {
    requestMetrics;
    cacheMetrics;
    systemMetrics;
    performanceAnalyzer;
    METRICS_RETENTION_HOURS = 24;
    metricsCollectionInterval = null;
    cleanupInterval = null;
    constructor(requestMetrics, cacheMetrics, systemMetrics, performanceAnalyzer) {
        super('PerformanceMetricsService');
        this.requestMetrics = requestMetrics;
        this.cacheMetrics = cacheMetrics;
        this.systemMetrics = systemMetrics;
        this.performanceAnalyzer = performanceAnalyzer;
    }
    async onModuleInit() {
        this.logInfo('Initializing Performance Metrics Service');
        this.startMetricsCollection();
    }
    startMetricsCollection() {
        this.metricsCollectionInterval = setInterval(() => {
            this.systemMetrics.collectSystemMetrics();
            this.performanceAnalyzer.recordPerformanceSummary();
        }, 60000);
        this.cleanupInterval = setInterval(() => {
            this.cleanupOldMetrics();
        }, 3600000);
        this.logInfo('Performance metrics collection started');
    }
    recordRequest(endpoint, method, duration, statusCode) {
        this.requestMetrics.recordRequest(endpoint, method, duration, statusCode);
    }
    recordCacheOperation(operation, duration) {
        this.cacheMetrics.recordCacheOperation(operation, duration);
    }
    updateCacheSize(size) {
        this.cacheMetrics.updateCacheSize(size);
    }
    cleanupOldMetrics() {
        const cutoff = Date.now() - this.METRICS_RETENTION_HOURS * 3600000;
        this.requestMetrics.cleanupOldMetrics(cutoff);
    }
    getCurrentSummary() {
        return this.performanceAnalyzer.getCurrentSummary();
    }
    getPerformanceTrends(hours = 1) {
        return this.performanceAnalyzer.getPerformanceTrends(hours);
    }
    getEndpointMetrics(endpoint, method) {
        return this.requestMetrics.getEndpointMetrics(endpoint, method);
    }
    async onModuleDestroy() {
        if (this.metricsCollectionInterval) {
            clearInterval(this.metricsCollectionInterval);
        }
        if (this.cleanupInterval) {
            clearInterval(this.cleanupInterval);
        }
        this.logInfo('Performance metrics service stopped');
    }
};
exports.PerformanceMetricsService = PerformanceMetricsService;
exports.PerformanceMetricsService = PerformanceMetricsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [request_metrics_service_1.RequestMetricsService,
        cache_metrics_service_1.CacheMetricsService,
        system_metrics_service_1.SystemMetricsService,
        performance_analyzer_service_1.PerformanceAnalyzerService])
], PerformanceMetricsService);
//# sourceMappingURL=performance-metrics.service.js.map