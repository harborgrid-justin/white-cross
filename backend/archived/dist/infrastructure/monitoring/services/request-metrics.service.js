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
exports.RequestMetricsService = void 0;
const common_1 = require("@nestjs/common");
const base_1 = require("../../../common/base");
let RequestMetricsService = class RequestMetricsService extends base_1.BaseService {
    constructor() {
        super('RequestMetricsService');
    }
    MAX_ENDPOINT_METRICS = 500;
    requestMetrics = new Map();
    requestDurations = [];
    totalRequests = 0;
    totalErrors = 0;
    recordRequest(endpoint, method, duration, statusCode) {
        this.totalRequests++;
        if (statusCode >= 400) {
            this.totalErrors++;
        }
        const key = `${method}:${endpoint}`;
        let metrics = this.requestMetrics.get(key);
        if (!metrics) {
            metrics = {
                endpoint,
                method,
                count: 0,
                totalDuration: 0,
                avgDuration: 0,
                minDuration: Infinity,
                maxDuration: 0,
                p50Duration: 0,
                p95Duration: 0,
                p99Duration: 0,
                statusCodes: {},
                errorCount: 0,
                lastAccessed: new Date(),
            };
            this.requestMetrics.set(key, metrics);
        }
        metrics.count++;
        metrics.totalDuration += duration;
        metrics.avgDuration = metrics.totalDuration / metrics.count;
        metrics.minDuration = Math.min(metrics.minDuration, duration);
        metrics.maxDuration = Math.max(metrics.maxDuration, duration);
        metrics.lastAccessed = new Date();
        metrics.statusCodes[statusCode] = (metrics.statusCodes[statusCode] || 0) + 1;
        if (statusCode >= 400) {
            metrics.errorCount++;
        }
        this.updateRequestPercentiles(metrics);
        this.requestDurations.push(duration);
        if (this.requestDurations.length > 10000) {
            this.requestDurations.shift();
        }
        if (this.requestMetrics.size > this.MAX_ENDPOINT_METRICS) {
            this.trimEndpointMetrics();
        }
    }
    updateRequestPercentiles(metrics) {
        const range = metrics.maxDuration - metrics.minDuration;
        metrics.p50Duration = metrics.minDuration + range * 0.5;
        metrics.p95Duration = metrics.minDuration + range * 0.95;
        metrics.p99Duration = metrics.minDuration + range * 0.99;
    }
    trimEndpointMetrics() {
        const entries = Array.from(this.requestMetrics.entries());
        entries.sort((a, b) => a[1].lastAccessed.getTime() - b[1].lastAccessed.getTime());
        const toRemove = Math.floor(entries.length * 0.1);
        for (let i = 0; i < toRemove; i++) {
            this.requestMetrics.delete(entries[i][0]);
        }
    }
    getEndpointMetrics(endpoint, method) {
        if (endpoint && method) {
            const key = `${method}:${endpoint}`;
            const metrics = this.requestMetrics.get(key);
            return metrics ? [metrics] : [];
        }
        return Array.from(this.requestMetrics.values());
    }
    getTopEndpoints(limit = 10) {
        return Array.from(this.requestMetrics.values())
            .sort((a, b) => b.count - a.count)
            .slice(0, limit);
    }
    getSlowestEndpoints(limit = 10) {
        return Array.from(this.requestMetrics.values())
            .sort((a, b) => b.avgDuration - a.avgDuration)
            .slice(0, limit);
    }
    getRequestStats() {
        const sortedDurations = [...this.requestDurations].sort((a, b) => a - b);
        const avgDuration = sortedDurations.length > 0
            ? sortedDurations.reduce((sum, d) => sum + d, 0) / sortedDurations.length
            : 0;
        return {
            totalRequests: this.totalRequests,
            totalErrors: this.totalErrors,
            errorRate: this.totalRequests > 0 ? this.totalErrors / this.totalRequests : 0,
            avgDuration,
            requestDurations: sortedDurations,
        };
    }
    cleanupOldMetrics(cutoffTime) {
        let cleaned = 0;
        for (const [key, metrics] of this.requestMetrics.entries()) {
            if (metrics.lastAccessed.getTime() < cutoffTime) {
                this.requestMetrics.delete(key);
                cleaned++;
            }
        }
        if (cleaned > 0) {
            this.logDebug(`Cleaned up ${cleaned} old endpoint metrics`);
        }
        return cleaned;
    }
    reset() {
        this.requestMetrics.clear();
        this.requestDurations = [];
        this.totalRequests = 0;
        this.totalErrors = 0;
        this.logInfo('Request metrics reset');
    }
};
exports.RequestMetricsService = RequestMetricsService;
exports.RequestMetricsService = RequestMetricsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], RequestMetricsService);
//# sourceMappingURL=request-metrics.service.js.map