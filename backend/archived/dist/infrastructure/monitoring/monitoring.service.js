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
exports.MonitoringService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const health_check_service_1 = require("./health-check.service");
const metrics_collection_service_1 = require("./metrics-collection.service");
const alert_management_service_1 = require("./alert-management.service");
const performance_tracking_service_1 = require("./performance-tracking.service");
const log_aggregation_service_1 = require("./log-aggregation.service");
const base_1 = require("../../common/base");
const logger_service_1 = require("../../common/logging/logger.service");
let MonitoringService = class MonitoringService extends base_1.BaseService {
    configService;
    healthCheckService;
    metricsCollectionService;
    alertManagementService;
    performanceTrackingService;
    logAggregationService;
    metricsInterval;
    lastMetrics;
    constructor(logger, configService, healthCheckService, metricsCollectionService, alertManagementService, performanceTrackingService, logAggregationService) {
        super({
            serviceName: 'MonitoringService',
            logger,
            enableAuditLogging: true,
        });
        this.configService = configService;
        this.healthCheckService = healthCheckService;
        this.metricsCollectionService = metricsCollectionService;
        this.alertManagementService = alertManagementService;
        this.performanceTrackingService = performanceTrackingService;
        this.logAggregationService = logAggregationService;
    }
    async onModuleInit() {
        this.logInfo('Initializing monitoring service...');
        await this.logAggregationService.initialize();
        const slowQueryThreshold = this.configService.get('SLOW_QUERY_THRESHOLD_MS', 1000);
        this.metricsCollectionService.setSlowQueryThreshold(slowQueryThreshold);
        this.startMetricsCollection();
        this.logInfo('Monitoring service initialized successfully');
    }
    async onModuleDestroy() {
        if (this.metricsInterval) {
            clearInterval(this.metricsInterval);
            this.metricsInterval = undefined;
        }
        this.logInfo('Monitoring service destroyed');
    }
    setCacheService(cacheService) {
        this.healthCheckService.setCacheService(cacheService);
        this.metricsCollectionService.setCacheService(cacheService);
        this.logInfo('Cache service registered for monitoring');
    }
    setWebSocketService(websocketService) {
        this.healthCheckService.setWebSocketService(websocketService);
        this.metricsCollectionService.setWebSocketService(websocketService);
        this.logInfo('WebSocket service registered for monitoring');
    }
    setQueueManagerService(queueManagerService) {
        this.healthCheckService.setQueueManagerService(queueManagerService);
        this.metricsCollectionService.setQueueManagerService(queueManagerService);
        this.logInfo('Queue manager service registered for monitoring');
    }
    setCircuitBreakerService(circuitBreakerService) {
        this.healthCheckService.setCircuitBreakerService(circuitBreakerService);
        this.logInfo('Circuit breaker service registered for monitoring');
    }
    async checkDatabaseHealth() {
        return this.healthCheckService.checkDatabaseHealth();
    }
    async checkRedisHealth() {
        return this.healthCheckService.checkRedisHealth();
    }
    async checkWebSocketHealth() {
        return this.healthCheckService.checkWebSocketHealth();
    }
    async checkJobQueueHealth() {
        return this.healthCheckService.checkJobQueueHealth();
    }
    async checkExternalAPIHealth() {
        return this.healthCheckService.checkExternalAPIHealth();
    }
    async performHealthCheck() {
        return this.healthCheckService.performHealthCheck();
    }
    async checkReadiness() {
        return this.healthCheckService.checkReadiness();
    }
    checkLiveness() {
        return this.healthCheckService.checkLiveness();
    }
    async collectSystemMetrics() {
        return this.metricsCollectionService.collectSystemMetrics();
    }
    async collectPerformanceMetrics() {
        return this.metricsCollectionService.collectPerformanceMetrics();
    }
    async collectMetrics() {
        const snapshot = await this.metricsCollectionService.collectMetrics();
        this.lastMetrics = snapshot;
        await this.alertManagementService.checkAlerts(snapshot);
        return snapshot;
    }
    trackRequest(responseTime, success = true) {
        this.metricsCollectionService.trackRequest(responseTime, success);
    }
    trackQuery(queryTime) {
        this.metricsCollectionService.trackQuery(queryTime);
    }
    trackWebSocketMessage(direction) {
        this.metricsCollectionService.trackWebSocketMessage(direction);
    }
    trackJobProcessing(processingTime, jobType) {
        this.metricsCollectionService.trackJobProcessing(processingTime, jobType);
    }
    getActiveAlerts() {
        return this.alertManagementService.getActiveAlerts();
    }
    acknowledgeAlert(alertId) {
        this.alertManagementService.acknowledgeAlert(alertId);
    }
    resolveAlert(alertId) {
        this.alertManagementService.resolveAlert(alertId);
    }
    trackPerformance(entry) {
        this.performanceTrackingService.trackPerformance(entry);
    }
    getRecentPerformance(limit = 100) {
        return this.performanceTrackingService.getRecentPerformance(limit);
    }
    addLogEntry(entry) {
        this.logAggregationService.addLogEntry(entry);
    }
    queryLogs(params) {
        return this.logAggregationService.queryLogs(params);
    }
    async getDashboardData() {
        const health = await this.performHealthCheck();
        const metrics = this.lastMetrics || (await this.collectMetrics());
        const alerts = this.getActiveAlerts();
        const recentPerformance = this.getRecentPerformance(50);
        return {
            status: {
                health: health.status,
                uptime: health.uptime,
                environment: health.environment,
                version: health.version,
            },
            metrics,
            alerts,
            recentPerformance,
            components: {
                database: health.components.database.status,
                cache: health.components.redis.status,
                websocket: health.components.websocket.status,
                queue: health.components.jobQueue.status,
                externalApis: health.components.externalAPIs.status,
            },
        };
    }
    startMetricsCollection() {
        this.collectMetrics().catch((error) => {
            this.logError('Failed to collect initial metrics', error);
        });
        this.metricsInterval = setInterval(() => {
            this.collectMetrics().catch((error) => {
                this.logError('Failed to collect metrics', error);
            });
        }, 30000);
        this.logInfo('Metrics collection started (30s interval)');
    }
    stopMetricsCollection() {
        if (this.metricsInterval) {
            clearInterval(this.metricsInterval);
            this.metricsInterval = undefined;
            this.logInfo('Metrics collection stopped');
        }
    }
};
exports.MonitoringService = MonitoringService;
exports.MonitoringService = MonitoringService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(logger_service_1.LoggerService)),
    __metadata("design:paramtypes", [logger_service_1.LoggerService,
        config_1.ConfigService,
        health_check_service_1.HealthCheckService,
        metrics_collection_service_1.MetricsCollectionService,
        alert_management_service_1.AlertManagementService,
        performance_tracking_service_1.PerformanceTrackingService,
        log_aggregation_service_1.LogAggregationService])
], MonitoringService);
//# sourceMappingURL=monitoring.service.js.map