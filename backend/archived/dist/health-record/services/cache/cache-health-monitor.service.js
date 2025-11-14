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
exports.CacheHealthMonitorService = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const cache_constants_1 = require("./cache-constants");
const cache_metrics_collector_service_1 = require("./cache-metrics-collector.service");
const base_1 = require("../../../common/base");
let CacheHealthMonitorService = class CacheHealthMonitorService extends base_1.BaseService {
    eventEmitter;
    metricsCollector;
    alerts = [];
    maxAlertsHistory = cache_constants_1.CACHE_CONSTANTS.METRICS.MAX_ALERTS_HISTORY;
    constructor(eventEmitter, metricsCollector) {
        super("CacheHealthMonitorService");
        this.eventEmitter = eventEmitter;
        this.metricsCollector = metricsCollector;
        this.startHealthMonitoring();
    }
    getHealthStatus() {
        const stats = this.metricsCollector.getPerformanceStats();
        const activeAlerts = this.alerts.filter(alert => !alert.resolved);
        let status = 'healthy';
        let issues = [];
        if (stats.overallHitRate < cache_constants_1.CACHE_CONSTANTS.METRICS.HEALTH_THRESHOLDS.MIN_HIT_RATE) {
            status = 'critical';
            issues.push(`Low hit rate: ${(stats.overallHitRate * 100).toFixed(1)}%`);
        }
        else if (stats.overallHitRate < cache_constants_1.CACHE_CONSTANTS.METRICS.HEALTH_THRESHOLDS.WARNING_HIT_RATE) {
            status = status === 'critical' ? 'critical' : 'warning';
            issues.push(`Below optimal hit rate: ${(stats.overallHitRate * 100).toFixed(1)}%`);
        }
        if (stats.averageResponseTime > cache_constants_1.CACHE_CONSTANTS.METRICS.HEALTH_THRESHOLDS.MAX_RESPONSE_TIME) {
            status = 'critical';
            issues.push(`High response time: ${stats.averageResponseTime.toFixed(0)}ms`);
        }
        else if (stats.averageResponseTime > cache_constants_1.CACHE_CONSTANTS.METRICS.HEALTH_THRESHOLDS.WARNING_RESPONSE_TIME) {
            status = status === 'critical' ? 'critical' : 'warning';
            issues.push(`Elevated response time: ${stats.averageResponseTime.toFixed(0)}ms`);
        }
        const errorRate = this.calculateErrorRate();
        if (errorRate > cache_constants_1.CACHE_CONSTANTS.METRICS.HEALTH_THRESHOLDS.MAX_ERROR_RATE) {
            status = 'critical';
            issues.push(`High error rate: ${(errorRate * 100).toFixed(1)}%`);
        }
        const memoryUsagePercent = this.calculateMemoryUsagePercent();
        if (memoryUsagePercent > cache_constants_1.CACHE_CONSTANTS.METRICS.HEALTH_THRESHOLDS.MAX_MEMORY_USAGE) {
            status = 'critical';
            issues.push(`High memory usage: ${memoryUsagePercent.toFixed(1)}%`);
        }
        return {
            status,
            issues,
            activeAlerts: activeAlerts.length,
            lastChecked: new Date(),
            recommendations: this.generateHealthRecommendations(status, issues),
        };
    }
    getActiveAlerts() {
        return this.alerts.filter(alert => !alert.resolved);
    }
    resolveAlert(alertId) {
        const alert = this.alerts.find(a => a.id === alertId);
        if (alert && !alert.resolved) {
            alert.resolved = true;
            alert.resolvedAt = new Date();
            this.logInfo(`Alert resolved: ${alert.message}`);
            return true;
        }
        return false;
    }
    getHealthSummary() {
        const health = this.getHealthStatus();
        const recentAlerts = this.alerts
            .filter(alert => !alert.resolved)
            .sort((a, b) => b.lastOccurred.getTime() - a.lastOccurred.getTime())
            .slice(0, 5);
        return {
            status: health,
            alerts: {
                active: this.alerts.filter(a => !a.resolved).length,
                total: this.alerts.length,
            },
            recentIssues: recentAlerts.map(alert => alert.message),
        };
    }
    reset() {
        this.alerts.length = 0;
        this.logInfo('Cache health monitor reset');
    }
    startHealthMonitoring() {
        setInterval(() => {
            try {
                this.performHealthCheck();
            }
            catch (error) {
                this.logError('Failed to perform health check:', error);
            }
        }, 30000);
        setInterval(() => {
            try {
                this.cleanupOldAlerts();
            }
            catch (error) {
                this.logError('Failed to cleanup old alerts:', error);
            }
        }, 60 * 60 * 1000);
    }
    performHealthCheck() {
        const health = this.getHealthStatus();
        if (health.status === 'critical') {
            this.logError('Cache health status: CRITICAL', { issues: health.issues });
        }
        else if (health.status === 'warning') {
            this.logWarning('Cache health status: WARNING', { issues: health.issues });
        }
        this.checkForAlerts();
    }
    checkForAlerts() {
        const stats = this.metricsCollector.getPerformanceStats();
        if (stats.averageResponseTime > cache_constants_1.CACHE_CONSTANTS.METRICS.ALERT_THRESHOLDS.RESPONSE_TIME) {
            this.createAlert('high_response_time', `High average response time: ${stats.averageResponseTime.toFixed(0)}ms`, 'warning', { averageResponseTime: stats.averageResponseTime });
        }
        if (stats.overallHitRate < cache_constants_1.CACHE_CONSTANTS.METRICS.ALERT_THRESHOLDS.MIN_HIT_RATE) {
            this.createAlert('low_hit_rate', `Low hit rate: ${(stats.overallHitRate * 100).toFixed(1)}%`, 'critical', { hitRate: stats.overallHitRate });
        }
        const memoryUsagePercent = this.calculateMemoryUsagePercent();
        if (memoryUsagePercent > cache_constants_1.CACHE_CONSTANTS.METRICS.ALERT_THRESHOLDS.MEMORY_USAGE) {
            this.createAlert('high_memory_usage', `High memory usage: ${memoryUsagePercent.toFixed(1)}%`, 'warning', { memoryUsagePercent });
        }
        if (stats.operationsPerSecond < cache_constants_1.CACHE_CONSTANTS.METRICS.ALERT_THRESHOLDS.MIN_OPS_PER_SECOND) {
            this.createAlert('low_throughput', `Low cache throughput: ${stats.operationsPerSecond.toFixed(1)} ops/sec`, 'warning', { operationsPerSecond: stats.operationsPerSecond });
        }
    }
    calculateErrorRate() {
        const rawMetrics = this.metricsCollector.getRawMetrics();
        let totalFailed = 0;
        let totalOperations = 0;
        for (const tierMetrics of rawMetrics.tiers.values()) {
            totalFailed += tierMetrics.failedOperations;
            totalOperations += tierMetrics.totalOperations;
        }
        return totalOperations > 0 ? totalFailed / totalOperations : 0;
    }
    calculateMemoryUsagePercent() {
        const rawMetrics = this.metricsCollector.getRawMetrics();
        const maxMemory = cache_constants_1.CACHE_CONSTANTS.METRICS.MAX_MEMORY_USAGE_BYTES;
        return maxMemory > 0 ? (rawMetrics.totalCacheSize / maxMemory) * 100 : 0;
    }
    createAlert(type, message, severity, metadata) {
        const existingAlert = this.alerts.find(alert => alert.type === type && !alert.resolved && alert.severity === severity);
        if (existingAlert) {
            existingAlert.occurrences++;
            existingAlert.lastOccurred = new Date();
            return;
        }
        const alert = {
            id: `${type}_${Date.now()}`,
            type,
            message,
            severity,
            createdAt: new Date(),
            lastOccurred: new Date(),
            occurrences: 1,
            resolved: false,
            metadata,
        };
        this.alerts.push(alert);
        if (this.alerts.length > this.maxAlertsHistory) {
            this.alerts.shift();
        }
        this.logInfo(`Cache alert created: ${message}`, { type, severity, metadata });
        this.eventEmitter.emit('cache.alert.created', alert);
    }
    generateHealthRecommendations(status, issues) {
        const recommendations = [];
        if (issues.some(issue => issue.includes('hit rate'))) {
            recommendations.push('Consider increasing cache TTL or implementing cache warming');
            recommendations.push('Review cache key generation strategy');
            recommendations.push('Check if cache size limits are too restrictive');
        }
        if (issues.some(issue => issue.includes('response time'))) {
            recommendations.push('Consider promoting frequently accessed data to higher cache tiers');
            recommendations.push('Review network latency and Redis configuration');
            recommendations.push('Check for memory pressure causing GC pauses');
        }
        if (issues.some(issue => issue.includes('memory'))) {
            recommendations.push('Implement more aggressive cache eviction policies');
            recommendations.push('Consider increasing cache memory allocation');
            recommendations.push('Review data serialization sizes');
        }
        if (issues.some(issue => issue.includes('error rate'))) {
            recommendations.push('Check Redis connectivity and error logs');
            recommendations.push('Review cache serialization/deserialization logic');
            recommendations.push('Monitor for network issues affecting cache operations');
        }
        if (issues.some(issue => issue.includes('throughput'))) {
            recommendations.push('Consider horizontal scaling of cache instances');
            recommendations.push('Review cache key distribution for better parallelism');
            recommendations.push('Check for lock contention in cache operations');
        }
        return recommendations;
    }
    cleanupOldAlerts() {
        const cutoffTime = Date.now() - (24 * 60 * 60 * 1000);
        const initialCount = this.alerts.length;
        this.alerts.forEach(alert => {
            if (!alert.resolved && alert.lastOccurred.getTime() < cutoffTime) {
                alert.resolved = true;
                alert.resolvedAt = new Date();
            }
        });
        if (this.alerts.length > 100) {
            this.alerts.splice(0, this.alerts.length - 100);
        }
        const removedCount = initialCount - this.alerts.length;
        if (removedCount > 0) {
            this.logDebug(`Cleaned up ${removedCount} old alerts`);
        }
    }
};
exports.CacheHealthMonitorService = CacheHealthMonitorService;
exports.CacheHealthMonitorService = CacheHealthMonitorService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [event_emitter_1.EventEmitter2,
        cache_metrics_collector_service_1.CacheMetricsCollectorService])
], CacheHealthMonitorService);
//# sourceMappingURL=cache-health-monitor.service.js.map