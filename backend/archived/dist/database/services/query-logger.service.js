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
exports.QueryLoggerService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const sequelize_typescript_1 = require("sequelize-typescript");
const base_1 = require("../../common/base");
let QueryLoggerService = class QueryLoggerService extends base_1.BaseService {
    sequelize;
    SLOW_QUERY_THRESHOLD = 500;
    N_PLUS_ONE_THRESHOLD = 10;
    N_PLUS_ONE_WINDOW = 1000;
    queryStats = new Map();
    slowQueries = [];
    recentQueries = [];
    activeQueries = new Map();
    constructor(sequelize) {
        super();
        this.sequelize = sequelize;
    }
    async onModuleInit() {
        this.logInfo('Initializing Query Logger Service');
        this.setupQueryHooks();
    }
    setupQueryHooks() {
        this.sequelize.addHook('beforeQuery', (options, query) => {
            const queryId = this.generateQueryId();
            query.queryId = queryId;
            query.startTime = Date.now();
            this.activeQueries.set(queryId, {
                startTime: query.startTime,
                options,
            });
        });
        this.sequelize.addHook('afterQuery', (options, query) => {
            const duration = Date.now() - query.startTime;
            const queryId = query.queryId;
            this.activeQueries.delete(queryId);
            this.recordQueryExecution(options, duration);
            if (duration > this.SLOW_QUERY_THRESHOLD) {
                this.recordSlowQuery(options, duration);
            }
            this.detectNPlusOne(options, duration);
            if (Math.random() < 0.01) {
                this.cleanupOldData();
            }
        });
        this.logInfo('Query hooks configured successfully');
    }
    recordQueryExecution(options, duration) {
        const signature = this.normalizeQuery(options.sql);
        const existingStats = this.queryStats.get(signature) || {
            count: 0,
            totalDuration: 0,
            avgDuration: 0,
            maxDuration: 0,
            minDuration: Infinity,
            lastExecuted: new Date(),
        };
        existingStats.count++;
        existingStats.totalDuration += duration;
        existingStats.avgDuration =
            existingStats.totalDuration / existingStats.count;
        existingStats.maxDuration = Math.max(existingStats.maxDuration, duration);
        existingStats.minDuration = Math.min(existingStats.minDuration, duration);
        existingStats.lastExecuted = new Date();
        this.queryStats.set(signature, existingStats);
        this.recentQueries.push({
            signature,
            timestamp: Date.now(),
        });
    }
    recordSlowQuery(options, duration) {
        const slowQuery = {
            sql: options.sql?.substring(0, 500),
            duration,
            timestamp: new Date(),
            model: options.model?.name,
            bindings: options.bind,
        };
        this.slowQueries.push(slowQuery);
        if (this.slowQueries.length > 100) {
            this.slowQueries.shift();
        }
        this.logWarning(`Slow query detected (${duration}ms)`, {
            sql: slowQuery.sql,
            model: slowQuery.model,
            duration,
            threshold: this.SLOW_QUERY_THRESHOLD,
        });
    }
    detectNPlusOne(options, duration) {
        const signature = this.normalizeQuery(options.sql);
        const now = Date.now();
        this.recentQueries = this.recentQueries.filter((q) => now - q.timestamp < this.N_PLUS_ONE_WINDOW);
        const similarQueries = this.recentQueries.filter((q) => q.signature === signature);
        if (similarQueries.length >= this.N_PLUS_ONE_THRESHOLD) {
            this.logWarning(`Possible N+1 query pattern detected`, {
                count: similarQueries.length,
                window: `${this.N_PLUS_ONE_WINDOW}ms`,
                sql: options.sql?.substring(0, 200),
                model: options.model?.name,
                suggestion: 'Consider using eager loading with include/associations',
            });
            this.recentQueries = this.recentQueries.filter((q) => q.signature !== signature);
        }
    }
    normalizeQuery(sql) {
        if (!sql)
            return '';
        return (sql
            .replace(/\$\d+/g, '?')
            .replace(/'[^']*'/g, "'?'")
            .replace(/"\d+"/g, '"?"')
            .replace(/\d+/g, '?')
            .replace(/\s+/g, ' ')
            .trim()
            .toLowerCase());
    }
    generateQueryId() {
        return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    }
    cleanupOldData() {
        const now = Date.now();
        const ONE_HOUR = 60 * 60 * 1000;
        this.recentQueries = this.recentQueries.filter((q) => now - q.timestamp < ONE_HOUR);
        this.slowQueries = this.slowQueries.filter((q) => now - q.timestamp.getTime() < ONE_HOUR);
        if (this.queryStats.size > 1000) {
            const sortedStats = Array.from(this.queryStats.entries())
                .sort((a, b) => b[1].count - a[1].count)
                .slice(0, 1000);
            this.queryStats = new Map(sortedStats);
        }
    }
    getPerformanceReport() {
        const sortedByDuration = Array.from(this.queryStats.entries())
            .sort((a, b) => b[1].avgDuration - a[1].avgDuration)
            .slice(0, 10)
            .map(([signature, metrics]) => ({ signature, metrics }));
        const sortedByFrequency = Array.from(this.queryStats.entries())
            .sort((a, b) => b[1].count - a[1].count)
            .slice(0, 10)
            .map(([signature, metrics]) => ({ signature, metrics }));
        const totalQueries = Array.from(this.queryStats.values()).reduce((sum, stats) => sum + stats.count, 0);
        return {
            totalQueries,
            slowQueries: [...this.slowQueries].reverse(),
            topSlowQueries: sortedByDuration,
            topFrequentQueries: sortedByFrequency,
            activeQueries: this.activeQueries.size,
        };
    }
    getQueryStats(sql) {
        const signature = this.normalizeQuery(sql);
        return this.queryStats.get(signature) || null;
    }
    getSlowQueries() {
        return [...this.slowQueries].reverse();
    }
    getActiveQueries() {
        const now = Date.now();
        return Array.from(this.activeQueries.entries()).map(([queryId, data]) => ({
            queryId,
            duration: now - data.startTime,
            options: {
                sql: data.options.sql?.substring(0, 200),
                model: data.options.model?.name,
            },
        }));
    }
    resetStats() {
        this.queryStats.clear();
        this.slowQueries = [];
        this.recentQueries = [];
        this.logInfo('Query statistics reset');
    }
    getFormattedReport() {
        const report = this.getPerformanceReport();
        let output = '\n=== Query Performance Report ===\n';
        output += `Total Queries Executed: ${report.totalQueries}\n`;
        output += `Slow Queries (>${this.SLOW_QUERY_THRESHOLD}ms): ${report.slowQueries.length}\n`;
        output += `Active Queries: ${report.activeQueries}\n\n`;
        output += '=== Top 5 Slowest Queries (by avg duration) ===\n';
        report.topSlowQueries.slice(0, 5).forEach((item, idx) => {
            output += `${idx + 1}. Avg: ${item.metrics.avgDuration.toFixed(2)}ms, `;
            output += `Count: ${item.metrics.count}, `;
            output += `Max: ${item.metrics.maxDuration}ms\n`;
            output += `   SQL: ${item.signature.substring(0, 100)}...\n`;
        });
        output += '\n=== Top 5 Most Frequent Queries ===\n';
        report.topFrequentQueries.slice(0, 5).forEach((item, idx) => {
            output += `${idx + 1}. Count: ${item.metrics.count}, `;
            output += `Avg: ${item.metrics.avgDuration.toFixed(2)}ms\n`;
            output += `   SQL: ${item.signature.substring(0, 100)}...\n`;
        });
        if (report.slowQueries.length > 0) {
            output += '\n=== Recent Slow Queries (last 5) ===\n';
            report.slowQueries.slice(0, 5).forEach((query, idx) => {
                output += `${idx + 1}. ${query.duration}ms at ${query.timestamp.toISOString()}\n`;
                output += `   Model: ${query.model || 'N/A'}\n`;
                output += `   SQL: ${query.sql}\n`;
            });
        }
        return output;
    }
    getPrometheusMetrics() {
        const report = this.getPerformanceReport();
        return `
# HELP db_queries_total Total number of database queries executed
# TYPE db_queries_total counter
db_queries_total ${report.totalQueries}

# HELP db_slow_queries_total Total number of slow queries
# TYPE db_slow_queries_total counter
db_slow_queries_total ${report.slowQueries.length}

# HELP db_active_queries Number of currently executing queries
# TYPE db_active_queries gauge
db_active_queries ${report.activeQueries}

# HELP db_unique_query_patterns Number of unique query patterns
# TYPE db_unique_query_patterns gauge
db_unique_query_patterns ${this.queryStats.size}
    `.trim();
    }
};
exports.QueryLoggerService = QueryLoggerService;
exports.QueryLoggerService = QueryLoggerService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectConnection)()),
    __metadata("design:paramtypes", [sequelize_typescript_1.Sequelize])
], QueryLoggerService);
//# sourceMappingURL=query-logger.service.js.map