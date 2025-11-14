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
var ResourceMonitor_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResourceMonitor = exports.ResourceAlertType = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const phi_access_logger_service_1 = require("./phi-access-logger.service");
const resource_metrics_collector_service_1 = require("./resource-metrics-collector.service");
var ResourceAlertType;
(function (ResourceAlertType) {
    ResourceAlertType["HIGH_MEMORY_USAGE"] = "HIGH_MEMORY_USAGE";
    ResourceAlertType["HIGH_CPU_USAGE"] = "HIGH_CPU_USAGE";
    ResourceAlertType["DATABASE_CONNECTION_POOL_EXHAUSTED"] = "DATABASE_CONNECTION_POOL_EXHAUSTED";
    ResourceAlertType["CACHE_HIT_RATE_LOW"] = "CACHE_HIT_RATE_LOW";
    ResourceAlertType["NETWORK_LATENCY_HIGH"] = "NETWORK_LATENCY_HIGH";
    ResourceAlertType["PHI_PROCESSING_OVERLOAD"] = "PHI_PROCESSING_OVERLOAD";
    ResourceAlertType["COMPLIANCE_RISK_DETECTED"] = "COMPLIANCE_RISK_DETECTED";
})(ResourceAlertType || (exports.ResourceAlertType = ResourceAlertType = {}));
let ResourceMonitor = ResourceMonitor_1 = class ResourceMonitor {
    metricsCollector;
    phiLogger;
    eventEmitter;
    logger = new common_1.Logger(ResourceMonitor_1.name);
    alerts = new Map();
    maxHistorySize = 1000;
    thresholds = {
        memory: {
            warning: 70,
            critical: 85,
            leakSuspicion: 90,
        },
        cpu: {
            warning: 60,
            critical: 80,
        },
        database: {
            connectionWarning: 80,
            connectionCritical: 95,
            slowQueryThreshold: 2000,
        },
        cache: {
            hitRateWarning: 60,
            hitRateCritical: 40,
        },
        network: {
            latencyWarning: 500,
            latencyCritical: 1000,
        },
    };
    constructor(metricsCollector, phiLogger, eventEmitter) {
        this.metricsCollector = metricsCollector;
        this.phiLogger = phiLogger;
        this.eventEmitter = eventEmitter;
    }
    getCurrentMetrics() {
        return this.metricsCollector.collectResourceMetrics();
    }
    getActiveAlerts() {
        return Array.from(this.alerts.values())
            .filter((alert) => !alert.acknowledged && !alert.resolvedAt)
            .sort((a, b) => this.getSeverityWeight(b.severity) -
            this.getSeverityWeight(a.severity));
    }
    async checkForAlerts(metrics) {
        const alerts = [];
        if (metrics.memory.utilization > this.thresholds.memory.critical) {
            alerts.push(this.createAlert(ResourceAlertType.HIGH_MEMORY_USAGE, 'CRITICAL', 'Critical Memory Usage', `Memory usage at ${metrics.memory.utilization.toFixed(1)}% (threshold: ${this.thresholds.memory.critical}%)`, this.thresholds.memory.critical, metrics.memory.utilization));
        }
        else if (metrics.memory.utilization > this.thresholds.memory.warning) {
            alerts.push(this.createAlert(ResourceAlertType.HIGH_MEMORY_USAGE, 'WARNING', 'High Memory Usage', `Memory usage at ${metrics.memory.utilization.toFixed(1)}% (threshold: ${this.thresholds.memory.warning}%)`, this.thresholds.memory.warning, metrics.memory.utilization));
        }
        if (metrics.cpu.usage > this.thresholds.cpu.critical) {
            alerts.push(this.createAlert(ResourceAlertType.HIGH_CPU_USAGE, 'CRITICAL', 'Critical CPU Usage', `CPU usage at ${metrics.cpu.usage.toFixed(1)}% (threshold: ${this.thresholds.cpu.critical}%)`, this.thresholds.cpu.critical, metrics.cpu.usage));
        }
        else if (metrics.cpu.usage > this.thresholds.cpu.warning) {
            alerts.push(this.createAlert(ResourceAlertType.HIGH_CPU_USAGE, 'WARNING', 'High CPU Usage', `CPU usage at ${metrics.cpu.usage.toFixed(1)}% (threshold: ${this.thresholds.cpu.warning}%)`, this.thresholds.cpu.warning, metrics.cpu.usage));
        }
        const dbUtilization = (metrics.database.activeConnections / 100) * 100;
        if (dbUtilization > this.thresholds.database.connectionCritical) {
            alerts.push(this.createAlert(ResourceAlertType.DATABASE_CONNECTION_POOL_EXHAUSTED, 'CRITICAL', 'Database Connection Pool Critical', `Database connections at ${dbUtilization.toFixed(1)}% capacity`, this.thresholds.database.connectionCritical, dbUtilization));
        }
        if (metrics.cache.hitRate < this.thresholds.cache.hitRateCritical) {
            alerts.push(this.createAlert(ResourceAlertType.CACHE_HIT_RATE_LOW, 'CRITICAL', 'Critical Cache Hit Rate', `Cache hit rate at ${metrics.cache.hitRate.toFixed(1)}% (threshold: ${this.thresholds.cache.hitRateCritical}%)`, this.thresholds.cache.hitRateCritical, metrics.cache.hitRate));
        }
        for (const alert of alerts) {
            if (!this.alerts.has(alert.id)) {
                this.alerts.set(alert.id, alert);
                await this.handleNewAlert(alert);
            }
        }
    }
    acknowledgeAlert(alertId) {
        const alert = this.alerts.get(alertId);
        if (alert && !alert.acknowledged) {
            alert.acknowledged = true;
            this.logger.log(`Alert acknowledged: ${alert.title}`);
            return true;
        }
        return false;
    }
    resolveAlert(alertId) {
        const alert = this.alerts.get(alertId);
        if (alert && !alert.resolvedAt) {
            alert.resolvedAt = new Date();
            this.logger.log(`Alert resolved: ${alert.title}`);
            return true;
        }
        return false;
    }
    createAlert(alertType, severity, title, message, threshold, currentValue) {
        return {
            id: this.generateAlertId(alertType),
            alertType,
            severity,
            title,
            message,
            timestamp: new Date(),
            threshold,
            currentValue,
            trend: this.calculateTrend(alertType, currentValue),
            acknowledged: false,
            metadata: {
                resourceType: alertType.split('_')[0].toLowerCase(),
                complianceImpact: this.assessComplianceImpact(alertType),
                autoRecoveryAttempted: false,
            },
        };
    }
    async handleNewAlert(alert) {
        this.logger.warn(`Resource alert: ${alert.title} - ${alert.message}`);
        this.eventEmitter.emit('resource.alert', {
            alert,
            timestamp: new Date(),
        });
        if (alert.metadata.complianceImpact) {
            this.phiLogger.logSecurityIncident({
                correlationId: alert.id,
                timestamp: alert.timestamp,
                incidentType: 'RESOURCE_ALERT',
                operation: 'RESOURCE_MONITORING',
                errorMessage: alert.message,
                severity: this.mapAlertSeverityToIncidentSeverity(alert.severity),
                ipAddress: 'internal',
            });
        }
    }
    generateAlertId(alertType) {
        return `${alertType}_${Date.now()}`;
    }
    calculateTrend(alertType, currentValue) {
        return 'STABLE';
    }
    assessComplianceImpact(alertType) {
        return (alertType === ResourceAlertType.PHI_PROCESSING_OVERLOAD ||
            alertType === ResourceAlertType.COMPLIANCE_RISK_DETECTED);
    }
    getSeverityWeight(severity) {
        switch (severity) {
            case 'CRITICAL':
                return 4;
            case 'ERROR':
                return 3;
            case 'WARNING':
                return 2;
            case 'INFO':
                return 1;
            default:
                return 0;
        }
    }
    mapAlertSeverityToIncidentSeverity(alertSeverity) {
        switch (alertSeverity) {
            case 'INFO':
                return 'LOW';
            case 'WARNING':
                return 'MEDIUM';
            case 'ERROR':
                return 'HIGH';
            case 'CRITICAL':
                return 'CRITICAL';
            default:
                return 'MEDIUM';
        }
    }
    cleanupOldAlerts() {
        const cutoffDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        let cleanedCount = 0;
        for (const [id, alert] of this.alerts.entries()) {
            if (alert.timestamp < cutoffDate && alert.resolvedAt) {
                this.alerts.delete(id);
                cleanedCount++;
            }
        }
        return cleanedCount;
    }
};
exports.ResourceMonitor = ResourceMonitor;
exports.ResourceMonitor = ResourceMonitor = ResourceMonitor_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [resource_metrics_collector_service_1.ResourceMetricsCollector,
        phi_access_logger_service_1.PHIAccessLogger,
        event_emitter_1.EventEmitter2])
], ResourceMonitor);
//# sourceMappingURL=resource-monitor.service.js.map