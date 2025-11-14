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
var MetricsMiddleware_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetricsMiddleware = exports.DEFAULT_METRICS_CONFIG = exports.HealthcareMetricCategory = exports.MetricType = void 0;
exports.createMetricsMiddleware = createMetricsMiddleware;
const common_1 = require("@nestjs/common");
var MetricType;
(function (MetricType) {
    MetricType["COUNTER"] = "counter";
    MetricType["GAUGE"] = "gauge";
    MetricType["HISTOGRAM"] = "histogram";
    MetricType["TIMER"] = "timer";
    MetricType["RATE"] = "rate";
})(MetricType || (exports.MetricType = MetricType = {}));
var HealthcareMetricCategory;
(function (HealthcareMetricCategory) {
    HealthcareMetricCategory["PATIENT_ACCESS"] = "patient_access";
    HealthcareMetricCategory["PHI_ACCESS"] = "phi_access";
    HealthcareMetricCategory["MEDICATION_ADMIN"] = "medication_administration";
    HealthcareMetricCategory["EMERGENCY_ACCESS"] = "emergency_access";
    HealthcareMetricCategory["AUDIT_EVENTS"] = "audit_events";
    HealthcareMetricCategory["COMPLIANCE"] = "compliance";
    HealthcareMetricCategory["SECURITY"] = "security";
    HealthcareMetricCategory["PERFORMANCE"] = "performance";
    HealthcareMetricCategory["USAGE"] = "usage";
})(HealthcareMetricCategory || (exports.HealthcareMetricCategory = HealthcareMetricCategory = {}));
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
class MetricsStore {
    batchSize;
    flushInterval;
    onFlush;
    metrics = [];
    flushTimer;
    constructor(batchSize, flushInterval, onFlush) {
        this.batchSize = batchSize;
        this.flushInterval = flushInterval;
        this.onFlush = onFlush;
        this.startFlushTimer();
    }
    add(metric) {
        this.metrics.push(metric);
        if (this.metrics.length >= this.batchSize) {
            this.flush();
        }
    }
    startFlushTimer() {
        this.flushTimer = setInterval(() => {
            if (this.metrics.length > 0) {
                this.flush();
            }
        }, this.flushInterval);
    }
    async flush() {
        if (this.metrics.length === 0)
            return;
        const metricsToFlush = [...this.metrics];
        this.metrics = [];
        try {
            await this.onFlush(metricsToFlush);
        }
        catch (error) {
            console.error('[MetricsStore] Error flushing metrics:', error);
            this.metrics.unshift(...metricsToFlush);
        }
    }
    async forceFlush() {
        await this.flush();
    }
    destroy() {
        if (this.flushTimer) {
            clearInterval(this.flushTimer);
        }
        this.flush();
    }
}
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
        const os = require('os');
        const totalMemory = os.totalmem();
        const freeMemory = os.freemem();
        const usedMemory = totalMemory - freeMemory;
        const memoryUtilization = usedMemory / totalMemory;
        metrics.push({
            name: 'system.memory.heap_used',
            type: MetricType.GAUGE,
            category: HealthcareMetricCategory.PERFORMANCE,
            value: memUsage.heapUsed,
            timestamp: now,
            tags: { ...tags, unit: 'bytes' },
            unit: 'bytes',
        });
        metrics.push({
            name: 'system.memory.utilization',
            type: MetricType.GAUGE,
            category: HealthcareMetricCategory.PERFORMANCE,
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
            name: 'system.cpu.utilization',
            type: MetricType.GAUGE,
            category: HealthcareMetricCategory.PERFORMANCE,
            value: cpuUtilization,
            timestamp: now,
            tags: { ...tags, unit: 'seconds' },
            unit: 'seconds',
        });
        const hrTime = process.hrtime();
        const eventLoopLag = hrTime[0] * 1000 + hrTime[1] / 1000000;
        metrics.push({
            name: 'system.event_loop.lag',
            type: MetricType.GAUGE,
            category: HealthcareMetricCategory.PERFORMANCE,
            value: eventLoopLag,
            timestamp: now,
            tags: { ...tags, unit: 'ms' },
            unit: 'ms',
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
let MetricsMiddleware = MetricsMiddleware_1 = class MetricsMiddleware {
    logger = new common_1.Logger(MetricsMiddleware_1.name);
    config;
    metricsStore;
    systemCollector;
    requestCounts = new Map();
    errorCounts = new Map();
    responseTimeBuckets = new Map();
    systemMetricsInterval;
    constructor() {
        this.config = exports.DEFAULT_METRICS_CONFIG;
        if (this.config.enabled) {
            this.metricsStore = new MetricsStore(this.config.batchSize, this.config.flushInterval, this.onMetricsFlush.bind(this));
            this.systemCollector = new SystemMetricsCollector(this.config.alertThresholds.memoryUsage, this.config.alertThresholds.cpuUsage);
            this.systemMetricsInterval = setInterval(() => {
                if (this.shouldSample()) {
                    this.collectSystemMetrics();
                }
            }, 60000);
        }
    }
    use(req, res, next) {
        if (!this.config.enabled || !this.shouldSample()) {
            return next();
        }
        if (this.config.excludePaths.some((path) => req.path.includes(path))) {
            return next();
        }
        const metricsContext = this.createContext(req);
        this.collectRequestMetrics(metricsContext).catch((err) => {
            this.logger.error('Error collecting request metrics', err);
        });
        this.instrumentResponse(res, metricsContext);
        next();
    }
    createContext(req) {
        const user = req.user;
        return {
            requestId: req.headers['x-request-id'] || this.generateRequestId(),
            startTime: Date.now(),
            timestamp: new Date(),
            user,
            method: req.method,
            path: req.path || req.url,
            facility: user?.facilityId || null,
            userAgent: req.headers['user-agent'] || 'Unknown',
            clientIP: this.getClientIP(req),
            bytes: {
                in: this.calculateRequestSize(req),
                out: 0,
            },
        };
    }
    generateRequestId() {
        return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    getClientIP(req) {
        return (req.headers['x-forwarded-for']?.toString().split(',')[0] ||
            req.headers['x-real-ip']?.toString() ||
            req.ip ||
            'unknown');
    }
    calculateRequestSize(req) {
        let size = 0;
        Object.entries(req.headers).forEach(([key, value]) => {
            size +=
                key.length +
                    (Array.isArray(value) ? value.join('').length : String(value).length);
        });
        if (req.body && typeof req.body === 'string') {
            size += Buffer.byteLength(req.body, 'utf8');
        }
        else if (req.body && typeof req.body === 'object') {
            size += Buffer.byteLength(JSON.stringify(req.body), 'utf8');
        }
        return size;
    }
    shouldSample() {
        return Math.random() < this.config.sampleRate;
    }
    async collectRequestMetrics(context) {
        const tags = {
            ...this.config.defaultTags,
            method: context.method,
            path: this.normalizePath(context.path),
            facility: context.facility || 'unknown',
            user_role: context.user?.role || 'anonymous',
        };
        this.recordMetric({
            name: 'http.requests.total',
            type: MetricType.COUNTER,
            category: HealthcareMetricCategory.USAGE,
            value: 1,
            timestamp: context.timestamp,
            tags,
            description: 'Total number of HTTP requests',
        });
        if (this.config.enableUserMetrics && context.user) {
            await this.collectUserMetrics(context, tags);
        }
        if (this.config.enableHealthcareMetrics) {
            await this.collectHealthcareMetrics(context, tags);
        }
        const pathKey = `${context.method}:${this.normalizePath(context.path)}`;
        this.requestCounts.set(pathKey, (this.requestCounts.get(pathKey) || 0) + 1);
    }
    instrumentResponse(res, context) {
        const originalEnd = res.end;
        res.end = ((...args) => {
            context.responseTime = Date.now() - context.startTime;
            context.statusCode = res.statusCode;
            if (args.length > 0 && args[0]) {
                const responseData = args[0];
                context.bytes.out = Buffer.byteLength(typeof responseData === 'string'
                    ? responseData
                    : JSON.stringify(responseData), 'utf8');
            }
            setImmediate(() => {
                this.collectResponseMetrics(context).catch((err) => {
                    this.logger.error('Error collecting response metrics', err);
                });
            });
            return originalEnd.apply(res, args);
        });
    }
    async collectResponseMetrics(context) {
        if (!context.responseTime || !context.statusCode)
            return;
        const tags = {
            ...this.config.defaultTags,
            method: context.method,
            path: this.normalizePath(context.path),
            status_code: context.statusCode.toString(),
            facility: context.facility || 'unknown',
            user_role: context.user?.role || 'anonymous',
        };
        if (this.config.enablePerformanceMetrics) {
            this.recordMetric({
                name: 'http.request.duration',
                type: MetricType.HISTOGRAM,
                category: HealthcareMetricCategory.PERFORMANCE,
                value: context.responseTime,
                timestamp: new Date(),
                tags: { ...tags, unit: 'ms' },
                unit: 'ms',
                description: 'HTTP request duration in milliseconds',
            });
            if (this.config.enableAlerts &&
                context.responseTime > this.config.alertThresholds.responseTime) {
                this.logger.warn(`Slow response detected: ${context.responseTime}ms for ${context.method} ${context.path}`);
            }
        }
        if (this.config.enableErrorMetrics && context.statusCode >= 400) {
            this.recordMetric({
                name: 'http.errors.total',
                type: MetricType.COUNTER,
                category: HealthcareMetricCategory.SECURITY,
                value: 1,
                timestamp: new Date(),
                tags,
                description: 'Total number of HTTP errors',
            });
            const pathKey = `${context.method}:${this.normalizePath(context.path)}`;
            this.errorCounts.set(pathKey, (this.errorCounts.get(pathKey) || 0) + 1);
        }
        this.recordMetric({
            name: 'http.request.bytes.in',
            type: MetricType.HISTOGRAM,
            category: HealthcareMetricCategory.USAGE,
            value: context.bytes?.in || 0,
            timestamp: new Date(),
            tags: { ...tags, unit: 'bytes' },
            unit: 'bytes',
        });
        this.recordMetric({
            name: 'http.response.bytes.out',
            type: MetricType.HISTOGRAM,
            category: HealthcareMetricCategory.USAGE,
            value: context.bytes?.out || 0,
            timestamp: new Date(),
            tags: { ...tags, unit: 'bytes' },
            unit: 'bytes',
        });
    }
    async collectUserMetrics(context, tags) {
        if (!context.user)
            return;
        this.recordMetric({
            name: 'user.activity.total',
            type: MetricType.COUNTER,
            category: HealthcareMetricCategory.USAGE,
            value: 1,
            timestamp: context.timestamp,
            tags: {
                ...tags,
                user_id: context.user.userId,
                user_role: context.user.role,
                facility: context.user.facilityId || 'unknown',
            },
            description: 'User activity counter',
        });
    }
    async collectHealthcareMetrics(context, tags) {
        if (this.isPHIAccess(context.path)) {
            this.recordMetric({
                name: 'healthcare.phi.access.total',
                type: MetricType.COUNTER,
                category: HealthcareMetricCategory.PHI_ACCESS,
                value: 1,
                timestamp: context.timestamp,
                tags: {
                    ...tags,
                    access_type: this.getAccessType(context.path),
                    user_role: context.user?.role || 'anonymous',
                },
                description: 'PHI access events',
            });
        }
        if (this.isEmergencyAccess(context.path)) {
            this.recordMetric({
                name: 'healthcare.emergency.access.total',
                type: MetricType.COUNTER,
                category: HealthcareMetricCategory.EMERGENCY_ACCESS,
                value: 1,
                timestamp: context.timestamp,
                tags,
                description: 'Emergency access events',
            });
        }
        if (this.isMedicationAdmin(context.path)) {
            this.recordMetric({
                name: 'healthcare.medication.admin.total',
                type: MetricType.COUNTER,
                category: HealthcareMetricCategory.MEDICATION_ADMIN,
                value: 1,
                timestamp: context.timestamp,
                tags,
                description: 'Medication administration events',
            });
        }
    }
    collectSystemMetrics() {
        const metrics = this.systemCollector.collectSystemMetrics(this.config.defaultTags);
        metrics.forEach((metric) => this.recordMetric(metric));
    }
    recordMetric(metric) {
        if (this.metricsStore) {
            this.metricsStore.add(metric);
        }
    }
    normalizePath(path) {
        return path
            .replace(/\/\d+/g, '/:id')
            .replace(/\/[a-f0-9-]{36}/gi, '/:uuid')
            .replace(/\/[a-f0-9]{24}/gi, '/:objectid');
    }
    isPHIAccess(path) {
        const phiPaths = [
            '/api/patients',
            '/api/health-records',
            '/api/medical-history',
            '/api/medications',
            '/api/immunizations',
        ];
        return phiPaths.some((phiPath) => path.startsWith(phiPath));
    }
    getAccessType(path) {
        if (path.includes('/emergency'))
            return 'emergency';
        if (path.includes('/break-glass'))
            return 'break_glass';
        return 'routine';
    }
    isEmergencyAccess(path) {
        return path.includes('/emergency') || path.includes('/break-glass');
    }
    isMedicationAdmin(path) {
        return path.includes('/medications') && path.includes('/administer');
    }
    async onMetricsFlush(metrics) {
        try {
            this.logger.debug(`Flushing ${metrics.length} metrics`);
            const groupedMetrics = this.groupMetricsByCategory(metrics);
            for (const [category, categoryMetrics] of Object.entries(groupedMetrics)) {
                this.logger.debug(`[METRICS][${category}] ${categoryMetrics.length} metrics`, categoryMetrics);
            }
        }
        catch (error) {
            this.logger.error('Error in metrics flush', error);
            throw error;
        }
    }
    groupMetricsByCategory(metrics) {
        return metrics.reduce((groups, metric) => {
            const category = metric.category;
            if (!groups[category]) {
                groups[category] = [];
            }
            groups[category].push(metric);
            return groups;
        }, {});
    }
    getMetricsSummary() {
        return {
            requestCounts: Object.fromEntries(this.requestCounts),
            errorCounts: Object.fromEntries(this.errorCounts),
            config: this.config,
            uptime: process.uptime(),
            memoryUsage: process.memoryUsage(),
            timestamp: new Date().toISOString(),
        };
    }
    onModuleDestroy() {
        if (this.metricsStore) {
            this.metricsStore.destroy();
        }
        if (this.systemMetricsInterval) {
            clearInterval(this.systemMetricsInterval);
        }
    }
};
exports.MetricsMiddleware = MetricsMiddleware;
exports.MetricsMiddleware = MetricsMiddleware = MetricsMiddleware_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], MetricsMiddleware);
function createMetricsMiddleware(config = {}) {
    const middleware = new MetricsMiddleware();
    middleware.config = { ...exports.DEFAULT_METRICS_CONFIG, ...config };
    return middleware;
}
exports.default = MetricsMiddleware;
//# sourceMappingURL=metrics.middleware.js.map