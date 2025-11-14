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
exports.MonitoringService = void 0;
const common_1 = require("@nestjs/common");
const terminus_1 = require("@nestjs/terminus");
const base_1 = require("../base");
const metrics_provider_1 = require("./metrics.provider");
let MonitoringService = class MonitoringService extends base_1.BaseService {
    metricsProvider;
    healthCheckService;
    alerts = [];
    activeAlerts = new Map();
    constructor(metricsProvider, healthCheckService) {
        super("MonitoringService");
        this.metricsProvider = metricsProvider;
        this.healthCheckService = healthCheckService;
        this.initializeDefaultAlerts();
    }
    async recordMetric(name, value, type = metrics_provider_1.MetricType.COUNTER, labels = {}, description) {
        const metric = {
            name,
            type,
            value,
            labels,
            timestamp: new Date(),
            description
        };
        await this.metricsProvider.recordMetric(metric);
        await this.checkAlerts(metric);
    }
    async recordHttpRequest(method, path, statusCode, duration, userId) {
        const labels = {
            method,
            path: path.replace(/\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi, '/:id'),
            status_code: statusCode.toString(),
            user_id: userId || 'anonymous'
        };
        await this.metricsProvider.incrementCounter(metrics_provider_1.HealthcareMetrics.HTTP_REQUEST_TOTAL, labels);
        await this.metricsProvider.recordHistogram(metrics_provider_1.HealthcareMetrics.HTTP_REQUEST_DURATION, duration / 1000, labels);
        if (statusCode >= 400) {
            await this.metricsProvider.incrementCounter(metrics_provider_1.HealthcareMetrics.HTTP_REQUEST_ERRORS, labels);
        }
    }
    async recordDatabaseQuery(operation, table, duration, success = true) {
        const labels = {
            operation,
            table,
            success: success.toString()
        };
        await this.metricsProvider.recordHistogram(metrics_provider_1.HealthcareMetrics.DB_QUERY_DURATION, duration / 1000, labels);
    }
    async recordBusinessMetric(metric, value = 1, labels = {}) {
        await this.metricsProvider.recordCounter(metric, value, labels);
    }
    async recordPHIAccess(userId, resourceType, resourceId, action) {
        await this.metricsProvider.incrementCounter(metrics_provider_1.HealthcareMetrics.PHI_ACCESS_TOTAL, {
            user_id: userId,
            resource_type: resourceType,
            resource_id: resourceId,
            action,
        });
        await this.metricsProvider.incrementCounter(metrics_provider_1.HealthcareMetrics.AUDIT_EVENTS_TOTAL, {
            event_type: 'phi_access',
            user_id: userId,
        });
    }
    startTimer(name, labels = {}) {
        return this.metricsProvider.startTimer(name, labels);
    }
    addAlert(config) {
        this.alerts.push(config);
        this.logInfo(`Added alert: ${config.metric} ${config.condition} ${config.threshold}`);
    }
    getActiveAlerts() {
        return Array.from(this.activeAlerts.entries()).map(([key, value]) => ({
            config: value.config,
            triggered: value.triggered
        }));
    }
    async getHealthStatus() {
        try {
            const healthChecks = [];
            healthChecks.push(async () => {
                const memUsage = process.memoryUsage();
                const heapUsagePercent = (memUsage.heapUsed / memUsage.heapTotal) * 100;
                return {
                    memory: {
                        status: heapUsagePercent < 90 ? 'up' : 'down',
                        heapUsed: memUsage.heapUsed,
                        heapTotal: memUsage.heapTotal,
                        percentage: Math.round(heapUsagePercent * 100) / 100,
                    },
                };
            });
            healthChecks.push(async () => {
                const uptime = process.uptime();
                return {
                    process: {
                        status: uptime > 0 ? 'up' : 'down',
                        uptime,
                        pid: process.pid,
                        nodeVersion: process.version,
                    },
                };
            });
            if (healthChecks.length > 0) {
                return await this.healthCheckService.check(healthChecks);
            }
            else {
                return {
                    status: 'ok',
                    info: {
                        uptime: process.uptime(),
                        timestamp: new Date().toISOString(),
                    },
                    error: {},
                    details: {},
                };
            }
        }
        catch (error) {
            this.logError('Health status check failed', error);
            return {
                status: 'error',
                info: {},
                error: {
                    healthCheck: {
                        status: 'down',
                        message: error.message,
                    },
                },
                details: {},
            };
        }
    }
    getPerformanceStats() {
        const memUsage = process.memoryUsage();
        return {
            uptime: process.uptime(),
            memoryUsage: memUsage,
            activeAlerts: this.activeAlerts.size,
            totalMetrics: 0
        };
    }
    exportMetrics() {
        return '# Metrics export not implemented for current provider';
    }
    initializeDefaultAlerts() {
        this.addAlert({
            metric: metrics_provider_1.HealthcareMetrics.HTTP_REQUEST_ERRORS,
            condition: 'gt',
            threshold: 10,
            duration: 300,
            severity: 'high',
            description: 'High HTTP error rate detected'
        });
        this.addAlert({
            metric: metrics_provider_1.HealthcareMetrics.HTTP_REQUEST_DURATION,
            condition: 'gt',
            threshold: 5,
            duration: 60,
            severity: 'medium',
            description: 'Slow response times detected'
        });
        this.addAlert({
            metric: metrics_provider_1.HealthcareMetrics.PHI_ACCESS_TOTAL,
            condition: 'gt',
            threshold: 100,
            duration: 3600,
            severity: 'medium',
            description: 'High PHI access rate detected'
        });
        this.addAlert({
            metric: metrics_provider_1.HealthcareMetrics.DB_CONNECTION_ACTIVE,
            condition: 'gt',
            threshold: 50,
            duration: 300,
            severity: 'high',
            description: 'High database connection usage'
        });
    }
    async checkAlerts(metric) {
        for (const alert of this.alerts) {
            if (alert.metric !== metric.name)
                continue;
            const shouldTrigger = this.evaluateCondition(metric.value, alert.condition, alert.threshold);
            if (shouldTrigger) {
                const alertKey = `${alert.metric}:${alert.condition}:${alert.threshold}`;
                if (!this.activeAlerts.has(alertKey)) {
                    this.activeAlerts.set(alertKey, {
                        config: alert,
                        triggered: new Date()
                    });
                    this.logWarning(`Alert triggered: ${alert.description}`, {
                        metric: alert.metric,
                        value: metric.value,
                        threshold: alert.threshold,
                        severity: alert.severity
                    });
                }
            }
            else {
                const alertKey = `${alert.metric}:${alert.condition}:${alert.threshold}`;
                if (this.activeAlerts.has(alertKey)) {
                    this.activeAlerts.delete(alertKey);
                    this.logInfo(`Alert resolved: ${alert.description}`);
                }
            }
        }
    }
    evaluateCondition(value, condition, threshold) {
        switch (condition) {
            case 'gt': return value > threshold;
            case 'lt': return value < threshold;
            case 'eq': return value === threshold;
            case 'ne': return value !== threshold;
            default: return false;
        }
    }
};
exports.MonitoringService = MonitoringService;
exports.MonitoringService = MonitoringService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [Object, terminus_1.HealthCheckService])
], MonitoringService);
//# sourceMappingURL=monitoring.service.js.map