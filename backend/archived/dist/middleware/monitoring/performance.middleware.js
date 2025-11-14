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
var PerformanceMiddleware_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PerformanceMiddleware = exports.PERFORMANCE_CONFIGS = void 0;
exports.createPerformanceMiddleware = createPerformanceMiddleware;
exports.createHealthcarePerformance = createHealthcarePerformance;
exports.createProductionPerformance = createProductionPerformance;
const common_1 = require("@nestjs/common");
exports.PERFORMANCE_CONFIGS = {
    healthcare: {
        slowRequestThreshold: 1000,
        criticalRequestThreshold: 3000,
        enableMemoryTracking: true,
        enableDetailedLogging: true,
        sampleRate: 1.0,
        maxMetricsHistory: 10000,
    },
    development: {
        slowRequestThreshold: 2000,
        criticalRequestThreshold: 5000,
        enableMemoryTracking: false,
        enableDetailedLogging: false,
        sampleRate: 0.1,
        maxMetricsHistory: 1000,
    },
    production: {
        slowRequestThreshold: 500,
        criticalRequestThreshold: 2000,
        enableMemoryTracking: true,
        enableDetailedLogging: false,
        sampleRate: 0.5,
        maxMetricsHistory: 50000,
    },
};
let PerformanceMiddleware = PerformanceMiddleware_1 = class PerformanceMiddleware {
    logger = new common_1.Logger(PerformanceMiddleware_1.name);
    config;
    metrics = [];
    requestCount = 0;
    startTime = Date.now();
    cleanupInterval;
    constructor() {
        this.config = exports.PERFORMANCE_CONFIGS.healthcare;
        this.cleanupInterval = setInterval(() => {
            this.cleanupOldMetrics();
        }, 5 * 60 * 1000);
    }
    use(req, res, next) {
        const requestId = this.startRequest(req.method, req.path, req.get('user-agent'), req.user?.userId);
        req.performanceRequestId = requestId;
        const originalEnd = res.end;
        res.end = ((chunk, encoding, cb) => {
            this.endRequest(requestId, res.statusCode, undefined);
            return originalEnd.call(res, chunk, encoding || 'utf8', cb);
        });
        next();
    }
    startRequest(method, path, userAgent, userId) {
        const requestId = this.generateRequestId();
        if (Math.random() > this.config.sampleRate) {
            return requestId;
        }
        const metrics = {
            requestId,
            method,
            path,
            startTime: Date.now(),
            userAgent,
            userId,
        };
        if (this.config.enableMemoryTracking) {
            metrics.memoryUsage = process.memoryUsage();
        }
        this.metrics.push(metrics);
        this.requestCount++;
        if (this.config.enableDetailedLogging) {
            this.logger.debug('Request started', {
                requestId,
                method,
                path,
                userId,
            });
        }
        return requestId;
    }
    endRequest(requestId, statusCode, error) {
        const metrics = this.metrics.find((m) => m.requestId === requestId);
        if (!metrics) {
            return null;
        }
        const endTime = Date.now();
        const duration = endTime - metrics.startTime;
        metrics.endTime = endTime;
        metrics.duration = duration;
        metrics.statusCode = statusCode;
        metrics.error = error;
        if (duration >= this.config.criticalRequestThreshold) {
            this.logger.error('Critical slow request detected', {
                requestId,
                method: metrics.method,
                path: metrics.path,
                duration,
                statusCode,
                userId: metrics.userId,
                error,
            });
        }
        else if (duration >= this.config.slowRequestThreshold) {
            this.logger.warn('Slow request detected', {
                requestId,
                method: metrics.method,
                path: metrics.path,
                duration,
                statusCode,
                userId: metrics.userId,
            });
        }
        if (this.config.enableDetailedLogging) {
            this.logger.log('Request completed', {
                requestId,
                method: metrics.method,
                path: metrics.path,
                duration,
                statusCode,
                userId: metrics.userId,
            });
        }
        return metrics;
    }
    getPerformanceSummary(timeWindow) {
        const now = Date.now();
        const windowStart = timeWindow ? now - timeWindow : 0;
        const relevantMetrics = this.metrics.filter((m) => m.endTime && m.endTime >= windowStart);
        const totalRequests = relevantMetrics.length;
        const completedRequests = relevantMetrics.filter((m) => m.duration !== undefined);
        if (completedRequests.length === 0) {
            return {
                totalRequests: 0,
                averageResponseTime: 0,
                slowRequests: 0,
                criticalRequests: 0,
                errorRate: 0,
                throughput: 0,
            };
        }
        const durations = completedRequests.map((m) => m.duration);
        const averageResponseTime = durations.reduce((sum, d) => sum + d, 0) / durations.length;
        const slowRequests = completedRequests.filter((m) => m.duration >= this.config.slowRequestThreshold).length;
        const criticalRequests = completedRequests.filter((m) => m.duration >= this.config.criticalRequestThreshold).length;
        const errorRequests = completedRequests.filter((m) => m.statusCode && (m.statusCode >= 400 || m.error)).length;
        const errorRate = errorRequests / completedRequests.length;
        const timeSpan = timeWindow || now - this.startTime;
        const throughput = (totalRequests / timeSpan) * 1000;
        return {
            totalRequests,
            averageResponseTime,
            slowRequests,
            criticalRequests,
            errorRate,
            throughput,
        };
    }
    getPathMetrics(pathPattern) {
        const regex = new RegExp(pathPattern);
        return this.metrics.filter((m) => regex.test(m.path));
    }
    getUserMetrics(userId) {
        return this.metrics.filter((m) => m.userId === userId);
    }
    getSlowestRequests(limit = 10) {
        return this.metrics
            .filter((m) => m.duration !== undefined)
            .sort((a, b) => (b.duration || 0) - (a.duration || 0))
            .slice(0, limit);
    }
    getErrorRequests(limit = 10) {
        return this.metrics
            .filter((m) => m.error || (m.statusCode && m.statusCode >= 400))
            .slice(-limit);
    }
    clearMetrics() {
        this.metrics = [];
        this.requestCount = 0;
        this.startTime = Date.now();
        this.logger.log('Performance metrics cleared');
    }
    exportMetrics() {
        return {
            summary: this.getPerformanceSummary(),
            metrics: [...this.metrics],
            config: { ...this.config },
        };
    }
    getSystemHealth() {
        const summary = this.getPerformanceSummary(5 * 60 * 1000);
        const issues = [];
        const recommendations = [];
        if (summary.averageResponseTime > this.config.criticalRequestThreshold) {
            issues.push('Average response time is critically high');
            recommendations.push('Investigate database queries and external API calls');
        }
        else if (summary.averageResponseTime > this.config.slowRequestThreshold) {
            issues.push('Average response time is elevated');
            recommendations.push('Monitor system resources and optimize slow endpoints');
        }
        if (summary.errorRate > 0.1) {
            issues.push('High error rate detected');
            recommendations.push('Check application logs for recurring errors');
        }
        const slowRequestPercentage = summary.totalRequests > 0
            ? summary.slowRequests / summary.totalRequests
            : 0;
        if (slowRequestPercentage > 0.2) {
            issues.push('High percentage of slow requests');
            recommendations.push('Optimize frequently used endpoints');
        }
        let status = 'healthy';
        if (summary.errorRate > 0.2 ||
            summary.averageResponseTime > this.config.criticalRequestThreshold) {
            status = 'critical';
        }
        else if (issues.length > 0) {
            status = 'degraded';
        }
        return { status, issues, recommendations };
    }
    generateRequestId() {
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substring(2, 8);
        return `req_${timestamp}_${random}`;
    }
    cleanupOldMetrics() {
        if (this.metrics.length > this.config.maxMetricsHistory) {
            const excess = this.metrics.length - this.config.maxMetricsHistory;
            this.metrics.splice(0, excess);
            if (this.config.enableDetailedLogging) {
                this.logger.debug('Cleaned up old performance metrics', {
                    removed: excess,
                });
            }
        }
    }
    onModuleDestroy() {
        if (this.cleanupInterval) {
            clearInterval(this.cleanupInterval);
        }
    }
};
exports.PerformanceMiddleware = PerformanceMiddleware;
exports.PerformanceMiddleware = PerformanceMiddleware = PerformanceMiddleware_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], PerformanceMiddleware);
function createPerformanceMiddleware(config) {
    const middleware = new PerformanceMiddleware();
    if (config) {
        middleware.config = config;
    }
    return middleware;
}
function createHealthcarePerformance() {
    const middleware = new PerformanceMiddleware();
    middleware.config = exports.PERFORMANCE_CONFIGS.healthcare;
    return middleware;
}
function createProductionPerformance() {
    const middleware = new PerformanceMiddleware();
    middleware.config = exports.PERFORMANCE_CONFIGS.production;
    return middleware;
}
exports.default = PerformanceMiddleware;
//# sourceMappingURL=performance.middleware.js.map