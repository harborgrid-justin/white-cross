"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var ResourceReporter_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResourceReporter = void 0;
const common_1 = require("@nestjs/common");
let ResourceReporter = ResourceReporter_1 = class ResourceReporter {
    logger = new common_1.Logger(ResourceReporter_1.name);
    generateResourceReport(currentMetrics, activeAlerts, recommendations, resourceHistory) {
        const overallHealth = this.calculateOverallHealth(currentMetrics, activeAlerts);
        const trends = this.calculateResourceTrends(resourceHistory);
        const predictiveInsights = this.generatePredictiveInsights(resourceHistory);
        return {
            summary: {
                overallHealth,
                resourceUtilization: {
                    memory: currentMetrics.memory.utilization,
                    cpu: currentMetrics.cpu.usage,
                    database: (currentMetrics.database.activeConnections / 100) * 100,
                    cache: currentMetrics.cache.hitRate,
                },
                activeAlerts: activeAlerts.length,
                pendingOptimizations: recommendations.length,
                complianceStatus: 'COMPLIANT',
            },
            metrics: currentMetrics,
            trends,
            recommendations,
            alerts: activeAlerts,
            predictiveInsights,
        };
    }
    calculateOverallHealth(metrics, alerts) {
        if (alerts.some((a) => a.severity === 'CRITICAL'))
            return 'CRITICAL';
        if (alerts.some((a) => a.severity === 'WARNING' || a.severity === 'ERROR'))
            return 'WARNING';
        return 'HEALTHY';
    }
    calculateResourceTrends(history) {
        if (history.length < 2) {
            return {
                memory: 'STABLE',
                cpu: 'STABLE',
                database: 'STABLE',
                cache: 'STABLE',
            };
        }
        const recent = history.slice(-10);
        const older = history.slice(-20, -10);
        if (older.length === 0) {
            return {
                memory: 'STABLE',
                cpu: 'STABLE',
                database: 'STABLE',
                cache: 'STABLE',
            };
        }
        const calculateTrend = (recentValues, olderValues) => {
            const recentAvg = recentValues.reduce((a, b) => a + b, 0) / recentValues.length;
            const olderAvg = olderValues.reduce((a, b) => a + b, 0) / olderValues.length;
            const change = recentAvg - olderAvg;
            const threshold = Math.abs(olderAvg * 0.05);
            if (Math.abs(change) < threshold)
                return 'STABLE';
            return change < 0 ? 'IMPROVING' : 'DEGRADING';
        };
        return {
            memory: calculateTrend(recent.map((m) => m.memory.utilization), older.map((m) => m.memory.utilization)),
            cpu: calculateTrend(recent.map((m) => m.cpu.usage), older.map((m) => m.cpu.usage)),
            database: calculateTrend(recent.map((m) => m.database.activeConnections), older.map((m) => m.database.activeConnections)),
            cache: calculateTrend(recent.map((m) => m.cache.hitRate), older.map((m) => m.cache.hitRate)),
        };
    }
    generatePredictiveInsights(history) {
        const insights = [];
        if (history.length < 5) {
            return insights;
        }
        const recentMemory = history.slice(-5).map((m) => m.memory.utilization);
        const memoryTrend = this.calculateSimpleTrend(recentMemory);
        if (memoryTrend > 0.5) {
            insights.push({
                resource: 'memory',
                prediction: 'Memory usage is trending upward and may reach critical levels',
                confidence: Math.min(memoryTrend * 100, 85),
                timeframe: 'Next 2-4 hours',
            });
        }
        const recentCpu = history.slice(-5).map((m) => m.cpu.usage);
        const cpuTrend = this.calculateSimpleTrend(recentCpu);
        if (cpuTrend > 0.3) {
            insights.push({
                resource: 'cpu',
                prediction: 'CPU usage is increasing and may impact performance',
                confidence: Math.min(cpuTrend * 100, 75),
                timeframe: 'Next 1-2 hours',
            });
        }
        return insights;
    }
    calculateSimpleTrend(values) {
        if (values.length < 2)
            return 0;
        const n = values.length;
        const sumX = (n * (n - 1)) / 2;
        const sumY = values.reduce((a, b) => a + b, 0);
        const sumXY = values.reduce((sum, y, x) => sum + x * y, 0);
        const sumXX = (n * (n - 1) * (2 * n - 1)) / 6;
        const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
        return slope;
    }
    generateDetailedMetricsReport(metrics, timeRange = '24h') {
        const statistics = {
            averages: {
                memory: metrics.memory.utilization,
                cpu: metrics.cpu.usage,
                database: metrics.database.activeConnections,
                cache: metrics.cache.hitRate,
            },
            peaks: {
                memory: metrics.memory.utilization,
                cpu: metrics.cpu.usage,
                database: metrics.database.activeConnections,
                cache: metrics.cache.hitRate,
            },
            trends: {
                memory: 'STABLE',
                cpu: 'STABLE',
                database: 'STABLE',
                cache: 'STABLE',
            },
        };
        const recommendations = [];
        if (metrics.memory.utilization > 80) {
            recommendations.push('Consider implementing memory optimization strategies');
        }
        if (metrics.cpu.usage > 70) {
            recommendations.push('Monitor CPU usage and consider scaling resources');
        }
        if (metrics.cache.hitRate < 60) {
            recommendations.push('Optimize cache strategy to improve hit rate');
        }
        return {
            period: timeRange,
            metrics,
            statistics,
            recommendations,
        };
    }
};
exports.ResourceReporter = ResourceReporter;
exports.ResourceReporter = ResourceReporter = ResourceReporter_1 = __decorate([
    (0, common_1.Injectable)()
], ResourceReporter);
//# sourceMappingURL=resource-reporter.service.js.map