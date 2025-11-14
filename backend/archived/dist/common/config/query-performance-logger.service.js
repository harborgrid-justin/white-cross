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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryPerformanceLoggerService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const sequelize_2 = require("sequelize");
const base_1 = require("../base");
const logger_service_1 = require("../logging/logger.service");
let QueryPerformanceLoggerService = class QueryPerformanceLoggerService extends base_1.BaseService {
    sequelize;
    metrics = [];
    slowQueries = [];
    queryStats = new Map();
    MAX_METRICS_HISTORY = 1000;
    MAX_SLOW_QUERY_HISTORY = 100;
    SLOW_QUERY_THRESHOLD = 1000;
    VERY_SLOW_QUERY_THRESHOLD = 5000;
    constructor(logger, sequelize) {
        super({
            serviceName: 'QueryPerformanceLoggerService',
            logger,
            enableAuditLogging: false,
        });
        this.sequelize = sequelize;
    }
    async onModuleInit() {
        this.setupQueryLogging();
        this.logInfo('Query Performance Logger initialized');
    }
    setupQueryLogging() {
        this.sequelize.addHook('beforeQuery', (options, query) => {
            query.startTime = Date.now();
            query.startDate = new Date();
        });
        this.sequelize.addHook('afterQuery', (options, query) => {
            const duration = Date.now() - query.startTime;
            this.recordQueryMetrics({
                sql: this.sanitizeSQL(options.sql),
                duration,
                timestamp: query.startDate,
                model: options.model?.name,
                operation: this.extractOperation(options.sql),
            });
            if (duration > this.SLOW_QUERY_THRESHOLD) {
                this.recordSlowQuery({
                    sql: this.sanitizeSQL(options.sql),
                    duration,
                    threshold: this.SLOW_QUERY_THRESHOLD,
                    model: options.model?.name,
                    timestamp: query.startDate,
                });
                if (duration > this.VERY_SLOW_QUERY_THRESHOLD) {
                    this.logError(`VERY SLOW QUERY (${duration}ms):`, {
                        sql: this.sanitizeSQL(options.sql).substring(0, 200),
                        model: options.model?.name,
                        duration,
                    });
                }
                else {
                    this.logWarning(`SLOW QUERY (${duration}ms):`, {
                        sql: this.sanitizeSQL(options.sql).substring(0, 200),
                        model: options.model?.name,
                        duration,
                    });
                }
            }
            if (process.env.DB_LOGGING === 'true' ||
                process.env.LOG_LEVEL === 'debug') {
                this.logDebug(`Query [${duration}ms]: ${this.sanitizeSQL(options.sql).substring(0, 100)}`);
            }
            this.updateQueryStats(options.sql, duration);
        });
    }
    recordQueryMetrics(metrics) {
        this.metrics.push(metrics);
        if (this.metrics.length > this.MAX_METRICS_HISTORY) {
            this.metrics.shift();
        }
    }
    recordSlowQuery(alert) {
        this.slowQueries.push(alert);
        if (this.slowQueries.length > this.MAX_SLOW_QUERY_HISTORY) {
            this.slowQueries.shift();
        }
    }
    updateQueryStats(sql, duration) {
        const normalizedQuery = this.normalizeQuery(sql);
        const stats = this.queryStats.get(normalizedQuery) || {
            count: 0,
            totalDuration: 0,
            maxDuration: 0,
        };
        stats.count++;
        stats.totalDuration += duration;
        stats.maxDuration = Math.max(stats.maxDuration, duration);
        this.queryStats.set(normalizedQuery, stats);
    }
    getStatistics() {
        if (this.metrics.length === 0) {
            return {
                totalQueries: 0,
                slowQueries: 0,
                avgDuration: 0,
                maxDuration: 0,
                minDuration: 0,
                queriesByModel: {},
                slowestQueries: [],
                mostFrequentQueries: [],
            };
        }
        const durations = this.metrics.map((m) => m.duration);
        const avgDuration = durations.reduce((sum, d) => sum + d, 0) / durations.length;
        const maxDuration = Math.max(...durations);
        const minDuration = Math.min(...durations);
        const queriesByModel = {};
        this.metrics.forEach((m) => {
            if (m.model) {
                queriesByModel[m.model] = (queriesByModel[m.model] || 0) + 1;
            }
        });
        const slowestQueries = [...this.metrics]
            .sort((a, b) => b.duration - a.duration)
            .slice(0, 10);
        const mostFrequentQueries = Array.from(this.queryStats.entries())
            .map(([query, stats]) => ({
            query,
            count: stats.count,
            avgDuration: stats.totalDuration / stats.count,
        }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 10);
        return {
            totalQueries: this.metrics.length,
            slowQueries: this.slowQueries.length,
            avgDuration: Math.round(avgDuration * 100) / 100,
            maxDuration,
            minDuration,
            queriesByModel,
            slowestQueries,
            mostFrequentQueries,
        };
    }
    getSlowQueries(limit = 20) {
        return this.slowQueries.slice(-limit);
    }
    getRecentQueries(limit = 50) {
        return this.metrics.slice(-limit);
    }
    getPerformanceReport() {
        const stats = this.getStatistics();
        const report = [
            '=== Database Query Performance Report ===',
            '',
            `Total Queries: ${stats.totalQueries}`,
            `Slow Queries: ${stats.slowQueries} (${((stats.slowQueries / stats.totalQueries) * 100).toFixed(2)}%)`,
            `Average Duration: ${stats.avgDuration.toFixed(2)}ms`,
            `Max Duration: ${stats.maxDuration}ms`,
            `Min Duration: ${stats.minDuration}ms`,
            '',
            'Queries by Model:',
            ...Object.entries(stats.queriesByModel)
                .sort((a, b) => b[1] - a[1])
                .map(([model, count]) => `  ${model}: ${count} queries`),
            '',
            'Top 5 Slowest Queries:',
            ...stats.slowestQueries
                .slice(0, 5)
                .map((q, i) => `  ${i + 1}. [${q.duration}ms] ${q.model || 'Unknown'}: ${q.sql.substring(0, 100)}...`),
            '',
            'Top 5 Most Frequent Queries:',
            ...stats.mostFrequentQueries
                .slice(0, 5)
                .map((q, i) => `  ${i + 1}. [${q.count}x, avg ${q.avgDuration.toFixed(2)}ms] ${q.query.substring(0, 100)}...`),
            '',
            '========================================',
        ];
        return report.join('\n');
    }
    clearHistory() {
        this.metrics = [];
        this.slowQueries = [];
        this.queryStats.clear();
        this.logInfo('Query performance history cleared');
    }
    resetStatistics() {
        this.queryStats.clear();
        this.logInfo('Query statistics reset');
    }
    sanitizeSQL(sql) {
        return sql
            .replace(/'\w+@\w+\.\w+'/g, "'[EMAIL]'")
            .replace(/'\d{3}-\d{2}-\d{4}'/g, "'[SSN]'")
            .replace(/'\d{10,}'/g, "'[PHONE]'")
            .replace(/'[A-Z][a-z]+ [A-Z][a-z]+'/g, "'[NAME]'");
    }
    normalizeQuery(sql) {
        return sql
            .replace(/\$\d+/g, '?')
            .replace(/'\d+'/g, "'?'")
            .replace(/\d+/g, '?')
            .replace(/\s+/g, ' ')
            .toLowerCase()
            .substring(0, 500);
    }
    extractOperation(sql) {
        const normalized = sql.trim().toLowerCase();
        if (normalized.startsWith('select'))
            return 'SELECT';
        if (normalized.startsWith('insert'))
            return 'INSERT';
        if (normalized.startsWith('update'))
            return 'UPDATE';
        if (normalized.startsWith('delete'))
            return 'DELETE';
        if (normalized.startsWith('create'))
            return 'CREATE';
        if (normalized.startsWith('alter'))
            return 'ALTER';
        if (normalized.startsWith('drop'))
            return 'DROP';
        return 'UNKNOWN';
    }
    logPerformanceSummary() {
        const stats = this.getStatistics();
        if (stats.totalQueries === 0) {
            return;
        }
        this.logInfo('Query Performance Summary:', {
            totalQueries: stats.totalQueries,
            slowQueries: stats.slowQueries,
            avgDuration: `${stats.avgDuration.toFixed(2)}ms`,
            maxDuration: `${stats.maxDuration}ms`,
        });
        const slowQueryRate = (stats.slowQueries / stats.totalQueries) * 100;
        if (slowQueryRate > 10) {
            this.logWarning(`High slow query rate: ${slowQueryRate.toFixed(2)}% (${stats.slowQueries}/${stats.totalQueries})`);
        }
    }
};
exports.QueryPerformanceLoggerService = QueryPerformanceLoggerService;
exports.QueryPerformanceLoggerService = QueryPerformanceLoggerService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(logger_service_1.LoggerService)),
    __param(1, (0, sequelize_1.InjectConnection)()),
    __metadata("design:paramtypes", [logger_service_1.LoggerService,
        sequelize_2.Sequelize])
], QueryPerformanceLoggerService);
//# sourceMappingURL=query-performance-logger.service.js.map