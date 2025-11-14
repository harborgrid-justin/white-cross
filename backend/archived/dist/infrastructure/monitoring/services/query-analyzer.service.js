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
exports.QueryAnalyzerService = void 0;
const common_1 = require("@nestjs/common");
const base_1 = require("../../../common/base");
let QueryAnalyzerService = class QueryAnalyzerService extends base_1.BaseService {
    MAX_HISTORY_SIZE = 1000;
    queryMetrics = new Map();
    queryExecutions = [];
    totalQueries = 0;
    queryDistribution = {
        fast: 0,
        medium: 0,
        slow: 0,
        verySlow: 0,
    };
    constructor() {
        super("QueryAnalyzerService");
    }
    recordQuery(sql, duration, model) {
        this.totalQueries++;
        const signature = this.normalizeQuery(sql);
        this.updateQueryMetrics(signature, duration);
        this.classifyQuery(duration);
        this.recordExecution(signature, duration);
        this.logDebug(`Query recorded: ${duration}ms`, {
            signature: signature.substring(0, 50),
            model,
        });
    }
    normalizeQuery(sql) {
        return sql
            .replace(/\$\d+/g, '?')
            .replace(/'[^']*'/g, "'?'")
            .replace(/\b\d+\b/g, '?')
            .replace(/\s+/g, ' ')
            .trim()
            .toLowerCase();
    }
    updateQueryMetrics(signature, duration) {
        let metrics = this.queryMetrics.get(signature);
        if (!metrics) {
            metrics = {
                querySignature: signature,
                count: 0,
                totalDuration: 0,
                avgDuration: 0,
                minDuration: Infinity,
                maxDuration: 0,
                p50Duration: 0,
                p95Duration: 0,
                p99Duration: 0,
                lastExecuted: new Date(),
                isSlowQuery: false,
            };
            this.queryMetrics.set(signature, metrics);
        }
        metrics.count++;
        metrics.totalDuration += duration;
        metrics.avgDuration = metrics.totalDuration / metrics.count;
        metrics.minDuration = Math.min(metrics.minDuration, duration);
        metrics.maxDuration = Math.max(metrics.maxDuration, duration);
        metrics.lastExecuted = new Date();
        metrics.isSlowQuery = metrics.avgDuration > 1000;
        this.updatePercentiles(metrics);
    }
    updatePercentiles(metrics) {
        const range = metrics.maxDuration - metrics.minDuration;
        metrics.p50Duration = metrics.minDuration + range * 0.5;
        metrics.p95Duration = metrics.minDuration + range * 0.95;
        metrics.p99Duration = metrics.minDuration + range * 0.99;
    }
    classifyQuery(duration) {
        if (duration < 100) {
            this.queryDistribution.fast++;
        }
        else if (duration < 500) {
            this.queryDistribution.medium++;
        }
        else if (duration < 1000) {
            this.queryDistribution.slow++;
        }
        else {
            this.queryDistribution.verySlow++;
        }
    }
    recordExecution(signature, duration) {
        this.queryExecutions.push({
            signature,
            duration,
            timestamp: new Date(),
        });
        if (this.queryExecutions.length > this.MAX_HISTORY_SIZE) {
            this.queryExecutions.shift();
        }
    }
    getQueryMetrics(signature) {
        return this.queryMetrics.get(signature);
    }
    getAllQueryMetrics() {
        return Array.from(this.queryMetrics.values());
    }
    getRecentExecutions(limit = 100) {
        return this.queryExecutions.slice(-limit);
    }
    getQueryDistribution() {
        return { ...this.queryDistribution };
    }
    getTotalQueries() {
        return this.totalQueries;
    }
    calculatePercentile(percentile) {
        const durations = this.queryExecutions.map(exec => exec.duration).sort((a, b) => a - b);
        return this.calculatePercentileFromArray(durations, percentile);
    }
    calculatePercentileFromArray(sortedArray, percentile) {
        if (sortedArray.length === 0)
            return 0;
        const index = Math.ceil((percentile / 100) * sortedArray.length) - 1;
        return sortedArray[Math.max(0, index)];
    }
    getTopFrequentQueries(limit = 10) {
        return Array.from(this.queryMetrics.values())
            .sort((a, b) => b.count - a.count)
            .slice(0, limit);
    }
    resetMetrics() {
        this.queryMetrics.clear();
        this.queryExecutions = [];
        this.totalQueries = 0;
        this.queryDistribution = {
            fast: 0,
            medium: 0,
            slow: 0,
            verySlow: 0,
        };
        this.logInfo('Query analyzer metrics reset');
    }
};
exports.QueryAnalyzerService = QueryAnalyzerService;
exports.QueryAnalyzerService = QueryAnalyzerService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], QueryAnalyzerService);
//# sourceMappingURL=query-analyzer.service.js.map