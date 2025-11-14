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
exports.AlertManagementService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const base_1 = require("../../common/base");
const metrics_interface_1 = require("./interfaces/metrics.interface");
let AlertManagementService = class AlertManagementService extends base_1.BaseService {
    configService;
    alerts = new Map();
    alertConfig = {
        enabled: true,
        cpuThreshold: 80,
        memoryThreshold: 85,
        responseTimeThreshold: 5000,
        errorRateThreshold: 5,
        dbConnectionThreshold: 90,
        failedJobsThreshold: 100,
    };
    constructor(configService) {
        super("AlertManagementService");
        this.configService = configService;
        this.loadAlertConfig();
    }
    loadAlertConfig() {
        this.alertConfig = {
            enabled: this.configService.get('ALERTS_ENABLED', 'true') === 'true',
            cpuThreshold: this.configService.get('ALERT_CPU_THRESHOLD', 80),
            memoryThreshold: this.configService.get('ALERT_MEMORY_THRESHOLD', 85),
            responseTimeThreshold: this.configService.get('ALERT_RESPONSE_TIME_THRESHOLD', 5000),
            errorRateThreshold: this.configService.get('ALERT_ERROR_RATE_THRESHOLD', 5),
            dbConnectionThreshold: this.configService.get('ALERT_DB_CONNECTION_THRESHOLD', 90),
            failedJobsThreshold: this.configService.get('ALERT_FAILED_JOBS_THRESHOLD', 100),
        };
        this.logInfo('Alert configuration loaded', this.alertConfig);
    }
    getAlertConfig() {
        return { ...this.alertConfig };
    }
    updateAlertConfig(config) {
        this.alertConfig = { ...this.alertConfig, ...config };
        this.logInfo('Alert configuration updated', this.alertConfig);
    }
    async checkAlerts(metrics) {
        if (!this.alertConfig.enabled) {
            return;
        }
        const alerts = [];
        if (metrics.system.cpu.usage > this.alertConfig.cpuThreshold) {
            alerts.push({
                id: `cpu-high-${Date.now()}`,
                severity: metrics_interface_1.AlertSeverity.WARNING,
                title: 'High CPU Usage',
                message: `CPU usage is ${metrics.system.cpu.usage.toFixed(2)}% (threshold: ${this.alertConfig.cpuThreshold}%)`,
                component: 'system',
                timestamp: new Date().toISOString(),
                acknowledged: false,
                metadata: { cpuUsage: metrics.system.cpu.usage },
            });
        }
        if (metrics.system.memory.usagePercent > this.alertConfig.memoryThreshold) {
            alerts.push({
                id: `memory-high-${Date.now()}`,
                severity: metrics_interface_1.AlertSeverity.WARNING,
                title: 'High Memory Usage',
                message: `Memory usage is ${metrics.system.memory.usagePercent.toFixed(2)}% (threshold: ${this.alertConfig.memoryThreshold}%)`,
                component: 'system',
                timestamp: new Date().toISOString(),
                acknowledged: false,
                metadata: { memoryUsage: metrics.system.memory.usagePercent },
            });
        }
        if (metrics.performance.requests.averageResponseTime >
            this.alertConfig.responseTimeThreshold) {
            alerts.push({
                id: `response-time-high-${Date.now()}`,
                severity: metrics_interface_1.AlertSeverity.ERROR,
                title: 'High Response Time',
                message: `Average response time is ${metrics.performance.requests.averageResponseTime.toFixed(2)}ms (threshold: ${this.alertConfig.responseTimeThreshold}ms)`,
                component: 'application',
                timestamp: new Date().toISOString(),
                acknowledged: false,
                metadata: {
                    responseTime: metrics.performance.requests.averageResponseTime,
                },
            });
        }
        const errorRate = 100 - metrics.performance.requests.successRate;
        if (errorRate > this.alertConfig.errorRateThreshold) {
            alerts.push({
                id: `error-rate-high-${Date.now()}`,
                severity: metrics_interface_1.AlertSeverity.CRITICAL,
                title: 'High Error Rate',
                message: `Error rate is ${errorRate.toFixed(2)}% (threshold: ${this.alertConfig.errorRateThreshold}%)`,
                component: 'application',
                timestamp: new Date().toISOString(),
                acknowledged: false,
                metadata: { errorRate },
            });
        }
        if (metrics.performance.queue.failedJobs >
            this.alertConfig.failedJobsThreshold) {
            alerts.push({
                id: `failed-jobs-high-${Date.now()}`,
                severity: metrics_interface_1.AlertSeverity.ERROR,
                title: 'High Failed Jobs Count',
                message: `Failed jobs count is ${metrics.performance.queue.failedJobs} (threshold: ${this.alertConfig.failedJobsThreshold})`,
                component: 'queue',
                timestamp: new Date().toISOString(),
                acknowledged: false,
                metadata: { failedJobs: metrics.performance.queue.failedJobs },
            });
        }
        alerts.forEach((alert) => {
            this.alerts.set(alert.id, alert);
            this.logWarning(`Alert triggered: ${alert.title}`, alert);
        });
        this.cleanupOldAlerts();
    }
    cleanupOldAlerts() {
        const oneHourAgo = Date.now() - 3600000;
        Array.from(this.alerts.entries()).forEach(([id, alert]) => {
            if (new Date(alert.timestamp).getTime() < oneHourAgo) {
                this.alerts.delete(id);
            }
        });
    }
    getAllAlerts() {
        return Array.from(this.alerts.values());
    }
    getActiveAlerts() {
        return Array.from(this.alerts.values()).filter((alert) => !alert.acknowledged && !alert.resolvedAt);
    }
    getAlert(alertId) {
        return this.alerts.get(alertId);
    }
    acknowledgeAlert(alertId) {
        const alert = this.alerts.get(alertId);
        if (alert) {
            alert.acknowledged = true;
            this.logInfo(`Alert acknowledged: ${alertId}`);
            return true;
        }
        return false;
    }
    resolveAlert(alertId) {
        const alert = this.alerts.get(alertId);
        if (alert) {
            alert.resolvedAt = new Date().toISOString();
            this.logInfo(`Alert resolved: ${alertId}`);
            return true;
        }
        return false;
    }
    clearAllAlerts() {
        this.alerts.clear();
        this.logInfo('All alerts cleared');
    }
    clearResolvedAlerts() {
        Array.from(this.alerts.entries()).forEach(([id, alert]) => {
            if (alert.resolvedAt) {
                this.alerts.delete(id);
            }
        });
        this.logInfo('Resolved alerts cleared');
    }
};
exports.AlertManagementService = AlertManagementService;
exports.AlertManagementService = AlertManagementService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], AlertManagementService);
//# sourceMappingURL=alert-management.service.js.map