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
exports.EnterpriseMetricsService = void 0;
const common_1 = require("@nestjs/common");
const base_1 = require("../../base");
let EnterpriseMetricsService = class EnterpriseMetricsService extends base_1.BaseService {
    moduleName;
    counters = new Map();
    gauges = new Map();
    histograms = new Map();
    startTime = Date.now();
    constructor(moduleName) {
        super("EnterpriseMetricsService");
        this.moduleName = moduleName;
        this.logInfo(`Enterprise metrics service initialized for module: ${moduleName}`);
    }
    incrementCounter(name, value = 1, labels) {
        try {
            const key = this.getMetricKey(name);
            const existing = this.counters.get(key);
            if (existing) {
                existing.value += value;
                existing.labels = { ...existing.labels, ...labels };
            }
            else {
                this.counters.set(key, {
                    value,
                    labels,
                    description: `Counter metric for ${name} in ${this.moduleName}`,
                });
            }
        }
        catch (error) {
            this.logError(`Failed to increment counter ${name}:`, error);
        }
    }
    recordGauge(name, value, labels) {
        try {
            const key = this.getMetricKey(name);
            this.gauges.set(key, {
                value,
                labels,
                description: `Gauge metric for ${name} in ${this.moduleName}`,
            });
        }
        catch (error) {
            this.logError(`Failed to record gauge ${name}:`, error);
        }
    }
    recordHistogram(name, value, labels) {
        try {
            const key = this.getMetricKey(name);
            const existing = this.histograms.get(key);
            if (existing) {
                existing.count++;
                existing.sum += value;
                existing.min = Math.min(existing.min, value);
                existing.max = Math.max(existing.max, value);
                existing.avg = existing.sum / existing.count;
                existing.labels = { ...existing.labels, ...labels };
            }
            else {
                this.histograms.set(key, {
                    count: 1,
                    sum: value,
                    avg: value,
                    min: value,
                    max: value,
                    labels,
                    description: `Histogram metric for ${name} in ${this.moduleName}`,
                });
            }
        }
        catch (error) {
            this.logError(`Failed to record histogram ${name}:`, error);
        }
    }
    recordSecurityMetrics(metrics) {
        if (metrics.loginAttempts !== undefined) {
            this.recordGauge('security_login_attempts', metrics.loginAttempts);
        }
        if (metrics.failedLogins !== undefined) {
            this.incrementCounter('security_failed_logins', metrics.failedLogins);
        }
        if (metrics.suspiciousActivities !== undefined) {
            this.incrementCounter('security_suspicious_activities', metrics.suspiciousActivities);
        }
        if (metrics.blockedRequests !== undefined) {
            this.incrementCounter('security_blocked_requests', metrics.blockedRequests);
        }
        if (metrics.sessionCount !== undefined) {
            this.recordGauge('security_active_sessions', metrics.sessionCount);
        }
        if (metrics.averageSessionDuration !== undefined) {
            this.recordGauge('security_avg_session_duration', metrics.averageSessionDuration);
        }
    }
    recordPerformanceMetrics(metrics) {
        if (metrics.requestCount !== undefined) {
            this.incrementCounter('performance_requests', metrics.requestCount);
        }
        if (metrics.averageResponseTime !== undefined) {
            this.recordHistogram('performance_response_time', metrics.averageResponseTime);
        }
        if (metrics.errorRate !== undefined) {
            this.recordGauge('performance_error_rate', metrics.errorRate);
        }
        if (metrics.cacheHitRate !== undefined) {
            this.recordGauge('performance_cache_hit_rate', metrics.cacheHitRate);
        }
        if (metrics.databaseQueryTime !== undefined) {
            this.recordHistogram('performance_db_query_time', metrics.databaseQueryTime);
        }
        if (metrics.memoryUsage !== undefined) {
            this.recordGauge('performance_memory_usage', metrics.memoryUsage);
        }
    }
    recordComplianceMetrics(metrics) {
        if (metrics.phiAccesses !== undefined) {
            this.incrementCounter('compliance_phi_accesses', metrics.phiAccesses);
        }
        if (metrics.auditLogEntries !== undefined) {
            this.incrementCounter('compliance_audit_entries', metrics.auditLogEntries);
        }
        if (metrics.dataRetentionViolations !== undefined) {
            this.incrementCounter('compliance_retention_violations', metrics.dataRetentionViolations);
        }
        if (metrics.encryptionFailures !== undefined) {
            this.incrementCounter('compliance_encryption_failures', metrics.encryptionFailures);
        }
        if (metrics.accessViolations !== undefined) {
            this.incrementCounter('compliance_access_violations', metrics.accessViolations);
        }
    }
    getMetrics() {
        return {
            counters: Object.fromEntries(this.counters.entries()),
            gauges: Object.fromEntries(this.gauges.entries()),
            histograms: Object.fromEntries(this.histograms.entries()),
            timestamp: Date.now(),
        };
    }
    getPrometheusMetrics() {
        const lines = [];
        const timestamp = Date.now();
        const uptime = Math.round((Date.now() - this.startTime) / 1000);
        lines.push(`# HELP ${this.moduleName}_uptime_seconds Module uptime in seconds`);
        lines.push(`# TYPE ${this.moduleName}_uptime_seconds gauge`);
        lines.push(`${this.moduleName}_uptime_seconds ${uptime} ${timestamp}`);
        for (const [name, counter] of this.counters.entries()) {
            const metricName = `${name}_total`;
            lines.push(`# HELP ${metricName} ${counter.description || 'Counter metric'}`);
            lines.push(`# TYPE ${metricName} counter`);
            const labels = this.formatLabels(counter.labels);
            lines.push(`${metricName}${labels} ${counter.value} ${timestamp}`);
        }
        for (const [name, gauge] of this.gauges.entries()) {
            lines.push(`# HELP ${name} ${gauge.description || 'Gauge metric'}`);
            lines.push(`# TYPE ${name} gauge`);
            const labels = this.formatLabels(gauge.labels);
            lines.push(`${name}${labels} ${gauge.value} ${timestamp}`);
        }
        for (const [name, histogram] of this.histograms.entries()) {
            lines.push(`# HELP ${name} ${histogram.description || 'Histogram metric'}`);
            lines.push(`# TYPE ${name} histogram`);
            const labels = this.formatLabels(histogram.labels);
            lines.push(`${name}_count${labels} ${histogram.count} ${timestamp}`);
            lines.push(`${name}_sum${labels} ${histogram.sum} ${timestamp}`);
            lines.push(`${name}_avg${labels} ${histogram.avg} ${timestamp}`);
        }
        return lines.join('\n') + '\n';
    }
    getHealthCheck() {
        const uptime = Math.round((Date.now() - this.startTime) / 1000);
        const errors = [];
        const warnings = [];
        const errorRateGauge = this.gauges.get(this.getMetricKey('performance_error_rate'));
        if (errorRateGauge && errorRateGauge.value > 0.1) {
            errors.push(`High error rate: ${(errorRateGauge.value * 100).toFixed(2)}%`);
        }
        const memoryGauge = this.gauges.get(this.getMetricKey('performance_memory_usage'));
        if (memoryGauge && memoryGauge.value > 1000) {
            warnings.push(`High memory usage: ${memoryGauge.value}MB`);
        }
        let status = 'healthy';
        if (errors.length > 0) {
            status = 'unhealthy';
        }
        else if (warnings.length > 0) {
            status = 'degraded';
        }
        const moduleStatus = {
            status,
            uptime,
            lastCheck: Date.now(),
            errors,
            warnings,
            dependencies: {},
        };
        return {
            module: this.moduleName,
            status: moduleStatus,
            metrics: {
                security: this.extractSecurityMetrics(),
                performance: this.extractPerformanceMetrics(),
                compliance: this.extractComplianceMetrics(),
            },
            timestamp: Date.now(),
        };
    }
    reset() {
        this.counters.clear();
        this.gauges.clear();
        this.histograms.clear();
        this.startTime = Date.now();
        this.logInfo(`Metrics reset for module: ${this.moduleName}`);
    }
    getCounter(name) {
        const key = this.getMetricKey(name);
        return this.counters.get(key)?.value || 0;
    }
    getGauge(name) {
        const key = this.getMetricKey(name);
        return this.gauges.get(key)?.value;
    }
    getHistogram(name) {
        const key = this.getMetricKey(name);
        return this.histograms.get(key);
    }
    getMetricKey(name) {
        return `${this.moduleName}_${name}`;
    }
    formatLabels(labels) {
        if (!labels || Object.keys(labels).length === 0) {
            return '';
        }
        const labelPairs = Object.entries(labels)
            .map(([key, value]) => `${key}="${value}"`)
            .join(',');
        return `{${labelPairs}}`;
    }
    extractSecurityMetrics() {
        return {
            loginAttempts: this.getGauge('security_login_attempts') || 0,
            failedLogins: this.getCounter('security_failed_logins'),
            suspiciousActivities: this.getCounter('security_suspicious_activities'),
            blockedRequests: this.getCounter('security_blocked_requests'),
            sessionCount: this.getGauge('security_active_sessions') || 0,
            averageSessionDuration: this.getGauge('security_avg_session_duration') || 0,
        };
    }
    extractPerformanceMetrics() {
        const responseTimeHist = this.getHistogram('performance_response_time');
        return {
            requestCount: this.getCounter('performance_requests'),
            averageResponseTime: responseTimeHist?.avg || 0,
            errorRate: this.getGauge('performance_error_rate') || 0,
            cacheHitRate: this.getGauge('performance_cache_hit_rate') || 0,
            databaseQueryTime: this.getHistogram('performance_db_query_time')?.avg || 0,
            memoryUsage: this.getGauge('performance_memory_usage') || 0,
        };
    }
    extractComplianceMetrics() {
        return {
            phiAccesses: this.getCounter('compliance_phi_accesses'),
            auditLogEntries: this.getCounter('compliance_audit_entries'),
            dataRetentionViolations: this.getCounter('compliance_retention_violations'),
            encryptionFailures: this.getCounter('compliance_encryption_failures'),
            accessViolations: this.getCounter('compliance_access_violations'),
        };
    }
    onModuleDestroy() {
        this.logInfo(`Enterprise metrics service destroyed for module: ${this.moduleName}`);
    }
};
exports.EnterpriseMetricsService = EnterpriseMetricsService;
exports.EnterpriseMetricsService = EnterpriseMetricsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [String])
], EnterpriseMetricsService);
//# sourceMappingURL=enterprise-metrics.service.js.map