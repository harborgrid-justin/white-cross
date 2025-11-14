"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.SystemMetricsCollector = void 0;
const os = __importStar(require("os"));
const metrics_types_1 = require("./metrics.types");
class SystemMetricsCollector {
    memoryThreshold;
    cpuThreshold;
    lastCpuUsage;
    constructor(memoryThreshold, cpuThreshold) {
        this.memoryThreshold = memoryThreshold;
        this.cpuThreshold = cpuThreshold;
        this.lastCpuUsage = process.cpuUsage();
    }
    collectSystemMetrics(tags) {
        const metrics = [];
        const now = new Date();
        const memUsage = process.memoryUsage();
        const totalMemory = os.totalmem();
        const freeMemory = os.freemem();
        const usedMemory = totalMemory - freeMemory;
        const memoryUtilization = usedMemory / totalMemory;
        metrics.push({
            name: 'system.memory.heap_used',
            type: metrics_types_1.MetricType.GAUGE,
            category: metrics_types_1.HealthcareMetricCategory.PERFORMANCE,
            value: memUsage.heapUsed,
            timestamp: now,
            tags: { ...tags, unit: 'bytes' },
            unit: 'bytes',
        });
        metrics.push({
            name: 'system.memory.heap_total',
            type: metrics_types_1.MetricType.GAUGE,
            category: metrics_types_1.HealthcareMetricCategory.PERFORMANCE,
            value: memUsage.heapTotal,
            timestamp: now,
            tags: { ...tags, unit: 'bytes' },
            unit: 'bytes',
        });
        metrics.push({
            name: 'system.memory.external',
            type: metrics_types_1.MetricType.GAUGE,
            category: metrics_types_1.HealthcareMetricCategory.PERFORMANCE,
            value: memUsage.external,
            timestamp: now,
            tags: { ...tags, unit: 'bytes' },
            unit: 'bytes',
        });
        metrics.push({
            name: 'system.memory.rss',
            type: metrics_types_1.MetricType.GAUGE,
            category: metrics_types_1.HealthcareMetricCategory.PERFORMANCE,
            value: memUsage.rss,
            timestamp: now,
            tags: { ...tags, unit: 'bytes' },
            unit: 'bytes',
        });
        metrics.push({
            name: 'system.memory.utilization',
            type: metrics_types_1.MetricType.GAUGE,
            category: metrics_types_1.HealthcareMetricCategory.PERFORMANCE,
            value: memoryUtilization,
            timestamp: now,
            tags: { ...tags, unit: 'percent' },
            unit: 'percent',
        });
        const currentCpuUsage = process.cpuUsage(this.lastCpuUsage);
        const totalCpuTime = currentCpuUsage.user + currentCpuUsage.system;
        const cpuUtilization = totalCpuTime / 1000000;
        this.lastCpuUsage = process.cpuUsage();
        metrics.push({
            name: 'system.cpu.user',
            type: metrics_types_1.MetricType.GAUGE,
            category: metrics_types_1.HealthcareMetricCategory.PERFORMANCE,
            value: currentCpuUsage.user / 1000000,
            timestamp: now,
            tags: { ...tags, unit: 'seconds' },
            unit: 'seconds',
        });
        metrics.push({
            name: 'system.cpu.system',
            type: metrics_types_1.MetricType.GAUGE,
            category: metrics_types_1.HealthcareMetricCategory.PERFORMANCE,
            value: currentCpuUsage.system / 1000000,
            timestamp: now,
            tags: { ...tags, unit: 'seconds' },
            unit: 'seconds',
        });
        metrics.push({
            name: 'system.cpu.utilization',
            type: metrics_types_1.MetricType.GAUGE,
            category: metrics_types_1.HealthcareMetricCategory.PERFORMANCE,
            value: cpuUtilization,
            timestamp: now,
            tags: { ...tags, unit: 'seconds' },
            unit: 'seconds',
        });
        const hrTime = process.hrtime();
        const eventLoopLag = hrTime[0] * 1000 + hrTime[1] / 1000000;
        metrics.push({
            name: 'system.event_loop.lag',
            type: metrics_types_1.MetricType.GAUGE,
            category: metrics_types_1.HealthcareMetricCategory.PERFORMANCE,
            value: eventLoopLag,
            timestamp: now,
            tags: { ...tags, unit: 'ms' },
            unit: 'ms',
        });
        const loadAvg = os.loadavg();
        metrics.push({
            name: 'system.load_average.1min',
            type: metrics_types_1.MetricType.GAUGE,
            category: metrics_types_1.HealthcareMetricCategory.PERFORMANCE,
            value: loadAvg[0],
            timestamp: now,
            tags,
        });
        metrics.push({
            name: 'system.load_average.5min',
            type: metrics_types_1.MetricType.GAUGE,
            category: metrics_types_1.HealthcareMetricCategory.PERFORMANCE,
            value: loadAvg[1],
            timestamp: now,
            tags,
        });
        metrics.push({
            name: 'system.load_average.15min',
            type: metrics_types_1.MetricType.GAUGE,
            category: metrics_types_1.HealthcareMetricCategory.PERFORMANCE,
            value: loadAvg[2],
            timestamp: now,
            tags,
        });
        return metrics;
    }
    checkThresholds(memoryUtilization, cpuUtilization) {
        const alerts = [];
        if (memoryUtilization > this.memoryThreshold) {
            alerts.push(`Memory utilization ${(memoryUtilization * 100).toFixed(2)}% exceeds threshold ${(this.memoryThreshold * 100).toFixed(2)}%`);
        }
        if (cpuUtilization > this.cpuThreshold) {
            alerts.push(`CPU utilization ${(cpuUtilization * 100).toFixed(2)}% exceeds threshold ${(this.cpuThreshold * 100).toFixed(2)}%`);
        }
        return alerts;
    }
}
exports.SystemMetricsCollector = SystemMetricsCollector;
//# sourceMappingURL=metrics.system-collector.js.map