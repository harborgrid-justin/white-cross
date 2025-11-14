"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_METRICS_CONFIG = void 0;
exports.DEFAULT_METRICS_CONFIG = {
    enabled: true,
    sampleRate: 1.0,
    enableHealthcareMetrics: true,
    enablePerformanceMetrics: true,
    enableUserMetrics: true,
    enableErrorMetrics: true,
    batchSize: 100,
    flushInterval: 30000,
    retentionDays: 90,
    defaultTags: {
        service: 'white-cross-healthcare',
        environment: process.env.NODE_ENV || 'development',
    },
    excludePaths: ['/health', '/metrics', '/favicon.ico'],
    enableAlerts: true,
    alertThresholds: {
        responseTime: 2000,
        errorRate: 0.05,
        memoryUsage: 0.85,
        cpuUsage: 0.8,
    },
};
//# sourceMappingURL=metrics.config.js.map