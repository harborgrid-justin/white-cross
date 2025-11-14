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
exports.SlowQueryDetectorService = void 0;
const common_1 = require("@nestjs/common");
const base_1 = require("../../../common/base");
let SlowQueryDetectorService = class SlowQueryDetectorService extends base_1.BaseService {
    SLOW_QUERY_THRESHOLD = 1000;
    MAX_SLOW_QUERIES = 100;
    slowQueries = [];
    alerts = [];
    constructor() {
        super("SlowQueryDetectorService");
    }
    checkAndRecordSlowQuery(sql, duration, model) {
        if (duration <= this.SLOW_QUERY_THRESHOLD) {
            return false;
        }
        const slowQuery = {
            sql: sql.substring(0, 500),
            duration,
            model,
            timestamp: new Date(),
            stackTrace: this.captureStackTrace(),
        };
        this.slowQueries.push(slowQuery);
        if (this.slowQueries.length > this.MAX_SLOW_QUERIES) {
            this.slowQueries.shift();
        }
        this.createAlert(slowQuery);
        this.logWarning(`SLOW QUERY (${duration}ms):`, {
            model,
            sql: sql.substring(0, 200),
            duration,
        });
        return true;
    }
    createAlert(slowQuery) {
        const alert = {
            type: 'slow_query',
            severity: slowQuery.duration > this.SLOW_QUERY_THRESHOLD * 2 ? 'critical' : 'warning',
            message: `Slow query detected: ${slowQuery.duration}ms`,
            details: {
                sql: slowQuery.sql.substring(0, 200),
                duration: slowQuery.duration,
                model: slowQuery.model,
            },
            timestamp: new Date(),
        };
        this.alerts.push(alert);
        if (this.alerts.length > 100) {
            this.alerts.shift();
        }
    }
    captureStackTrace() {
        const stack = new Error().stack || '';
        return stack
            .split('\n')
            .slice(3, 8)
            .join('\n');
    }
    getSlowQueries(limit = 20) {
        return [...this.slowQueries]
            .sort((a, b) => b.duration - a.duration)
            .slice(0, limit);
    }
    getSlowQueriesInRange(startTime, endTime) {
        return this.slowQueries.filter(query => query.timestamp >= startTime && query.timestamp <= endTime);
    }
    getTopSlowQueries(limit = 10) {
        return [...this.slowQueries]
            .sort((a, b) => b.duration - a.duration)
            .slice(0, limit);
    }
    getSlowQueryCount() {
        return this.slowQueries.length;
    }
    getAverageSlowQueryDuration() {
        if (this.slowQueries.length === 0)
            return 0;
        const total = this.slowQueries.reduce((sum, query) => sum + query.duration, 0);
        return total / this.slowQueries.length;
    }
    getAlerts(limit = 20) {
        return [...this.alerts].slice(-limit);
    }
    hasCriticalSlowQueries() {
        return this.slowQueries.some(query => query.duration > this.SLOW_QUERY_THRESHOLD * 2);
    }
    getSlowQueryStats() {
        const queries = this.slowQueries;
        const total = queries.length;
        if (total === 0) {
            return {
                total: 0,
                averageDuration: 0,
                maxDuration: 0,
                minDuration: 0,
                criticalCount: 0,
            };
        }
        const durations = queries.map(q => q.duration);
        const maxDuration = Math.max(...durations);
        const minDuration = Math.min(...durations);
        const averageDuration = durations.reduce((sum, d) => sum + d, 0) / total;
        const criticalCount = queries.filter(q => q.duration > this.SLOW_QUERY_THRESHOLD * 2).length;
        return {
            total,
            averageDuration,
            maxDuration,
            minDuration,
            criticalCount,
        };
    }
    reset() {
        this.slowQueries = [];
        this.alerts = [];
        this.logInfo('Slow query detector reset');
    }
};
exports.SlowQueryDetectorService = SlowQueryDetectorService;
exports.SlowQueryDetectorService = SlowQueryDetectorService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], SlowQueryDetectorService);
//# sourceMappingURL=slow-query-detector.service.js.map