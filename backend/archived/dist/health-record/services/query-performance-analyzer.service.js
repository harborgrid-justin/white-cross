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
var QueryPerformanceAnalyzer_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryPerformanceAnalyzer = exports.QueryComplexity = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const schedule_1 = require("@nestjs/schedule");
const event_emitter_1 = require("@nestjs/event-emitter");
const sequelize_2 = require("sequelize");
const health_record_metrics_service_1 = require("./health-record-metrics.service");
const phi_access_logger_service_1 = require("./phi-access-logger.service");
const models_1 = require("../../database/models");
var QueryComplexity;
(function (QueryComplexity) {
    QueryComplexity["SIMPLE"] = "SIMPLE";
    QueryComplexity["MODERATE"] = "MODERATE";
    QueryComplexity["COMPLEX"] = "COMPLEX";
    QueryComplexity["VERY_COMPLEX"] = "VERY_COMPLEX";
})(QueryComplexity || (exports.QueryComplexity = QueryComplexity = {}));
let QueryPerformanceAnalyzer = QueryPerformanceAnalyzer_1 = class QueryPerformanceAnalyzer {
    metricsService;
    phiLogger;
    eventEmitter;
    performanceMetricModel;
    logger = new common_1.Logger(QueryPerformanceAnalyzer_1.name);
    slowQueries = new Map();
    queryPatterns = new Map();
    slowQueryThreshold = 1000;
    verySlowQueryThreshold = 5000;
    constructor(metricsService, phiLogger, eventEmitter, performanceMetricModel) {
        this.metricsService = metricsService;
        this.phiLogger = phiLogger;
        this.eventEmitter = eventEmitter;
        this.performanceMetricModel = performanceMetricModel;
        this.initializeAnalyzer();
        this.setupEventListeners();
    }
    initializeAnalyzer() {
        this.logger.log('Initializing Query Performance Analyzer with database persistence');
        this.logger.log('Query Performance Analyzer initialized successfully');
    }
    async recordQuery(sql, executionTime, rowsAffected = 0, compliance = 'INTERNAL', parameters, stackTrace) {
        const queryId = this.generateQueryId(sql);
        const normalizedSQL = this.normalizeSQL(sql);
        const queryMetrics = {
            queryId,
            sql: normalizedSQL,
            executionTime,
            rowsAffected,
            indexesUsed: this.extractIndexesUsed(sql),
            planHash: this.generatePlanHash(sql),
            complexity: this.calculateComplexity(sql),
            compliance,
            timestamp: new Date(),
            parameters,
            stackTrace,
        };
        try {
            await this.performanceMetricModel.create({
                metricType: models_1.MetricType.DATABASE_QUERY_TIME,
                value: executionTime,
                unit: 'ms',
                recordedAt: new Date(),
                tags: {
                    queryId,
                    sql: normalizedSQL,
                    rowsAffected,
                    indexesUsed: queryMetrics.indexesUsed,
                    planHash: queryMetrics.planHash,
                    complexity: queryMetrics.complexity,
                    compliance,
                    parameters: parameters ? JSON.stringify(parameters) : null,
                    stackTrace,
                },
            });
            if (executionTime > this.slowQueryThreshold) {
                await this.recordSlowQuery(queryMetrics);
            }
            await this.updateQueryPattern(queryMetrics);
            if (compliance === 'PHI' || compliance === 'SENSITIVE_PHI') {
                this.phiLogger.logPHIAccess({
                    correlationId: queryId,
                    timestamp: new Date(),
                    operation: 'QUERY_EXECUTE',
                    dataTypes: this.extractDataTypesFromSQL(sql),
                    recordCount: rowsAffected,
                    sensitivityLevel: compliance,
                    ipAddress: 'internal',
                    userAgent: 'query-performance-analyzer',
                    success: true,
                });
            }
            this.logger.debug(`Recorded query performance: ${queryId}, time: ${executionTime}ms, complexity: ${queryMetrics.complexity}`);
        }
        catch (error) {
            this.logger.error(`Failed to record query metrics for ${queryId}:`, error);
        }
        return queryId;
    }
    async getQueryPerformanceStats(startDate, endDate, complianceLevel) {
        try {
            const whereClause = {
                metricType: models_1.MetricType.DATABASE_QUERY_TIME,
                recordedAt: {
                    [sequelize_2.Op.between]: [startDate, endDate],
                },
            };
            if (complianceLevel) {
            }
            const metrics = await this.performanceMetricModel.findAll({
                where: whereClause,
                attributes: ['value', 'tags'],
            });
            const totalQueries = metrics.length;
            const totalTime = metrics.reduce((sum, metric) => sum + metric.value, 0);
            const averageExecutionTime = totalQueries > 0 ? totalTime / totalQueries : 0;
            const slowQueriesCount = metrics.filter((m) => m.value > this.slowQueryThreshold).length;
            const queriesByComplexity = {
                SIMPLE: 0,
                MODERATE: 0,
                COMPLEX: 0,
                VERY_COMPLEX: 0,
            };
            metrics.forEach((metric) => {
                const complexity = metric.tags?.complexity;
                if (complexity && queriesByComplexity[complexity] !== undefined) {
                    queriesByComplexity[complexity]++;
                }
            });
            const topSlowQueries = await this.getTopSlowQueries(10, startDate, endDate);
            return {
                totalQueries,
                averageExecutionTime,
                slowQueriesCount,
                queriesByComplexity,
                topSlowQueries,
            };
        }
        catch (error) {
            this.logger.error('Failed to get query performance stats:', error);
            return {
                totalQueries: 0,
                averageExecutionTime: 0,
                slowQueriesCount: 0,
                queriesByComplexity: {
                    SIMPLE: 0,
                    MODERATE: 0,
                    COMPLEX: 0,
                    VERY_COMPLEX: 0,
                },
                topSlowQueries: [],
            };
        }
    }
    async getTopSlowQueries(limit = 10, startDate, endDate) {
        try {
            const whereClause = {
                metricType: models_1.MetricType.DATABASE_QUERY_TIME,
                value: {
                    [sequelize_2.Op.gt]: this.slowQueryThreshold,
                },
            };
            if (startDate && endDate) {
                whereClause.recordedAt = {
                    [sequelize_2.Op.between]: [startDate, endDate],
                };
            }
            const slowMetrics = await this.performanceMetricModel.findAll({
                where: whereClause,
                order: [['value', 'DESC']],
                limit,
                attributes: ['value', 'tags', 'createdAt'],
            });
            return slowMetrics.map((metric) => {
                const tags = metric.tags;
                return {
                    queryMetrics: {
                        queryId: tags?.queryId || '',
                        sql: tags?.sql || '',
                        executionTime: metric.value,
                        rowsAffected: tags?.rowsAffected || 0,
                        indexesUsed: tags?.indexesUsed || [],
                        planHash: tags?.planHash || '',
                        complexity: tags?.complexity || QueryComplexity.SIMPLE,
                        compliance: tags?.compliance || 'INTERNAL',
                        timestamp: metric.recordedAt || new Date(),
                        parameters: tags?.parameters,
                        stackTrace: tags?.stackTrace,
                    },
                    frequency: 1,
                    averageTime: metric.value,
                    maxTime: metric.value,
                    minTime: metric.value,
                    lastSeen: metric.recordedAt || new Date(),
                    optimizationSuggestions: this.generateOptimizationSuggestions(tags?.sql || '', metric.value),
                };
            });
        }
        catch (error) {
            this.logger.error('Failed to get top slow queries:', error);
            return [];
        }
    }
    async storePerformanceAnalysisSnapshot() {
        try {
            const endDate = new Date();
            const startDate = new Date(endDate.getTime() - 24 * 60 * 60 * 1000);
            const stats = await this.getQueryPerformanceStats(startDate, endDate);
            const analysisMetrics = [
                {
                    metricType: models_1.MetricType.REQUEST_COUNT,
                    value: stats.totalQueries,
                    unit: 'count',
                },
                {
                    metricType: models_1.MetricType.API_RESPONSE_TIME,
                    value: stats.averageExecutionTime,
                    unit: 'ms',
                },
                {
                    metricType: models_1.MetricType.ERROR_RATE,
                    value: stats.slowQueriesCount,
                    unit: 'count',
                },
            ];
            await this.performanceMetricModel.bulkCreate(analysisMetrics.map((metric) => ({
                metricType: metric.metricType,
                value: metric.value,
                unit: metric.unit,
                recordedAt: new Date(),
                tags: {
                    analysisPeriod: { start: startDate, end: endDate },
                    snapshotType: 'daily_performance_analysis',
                },
            })));
            this.logger.log(`Stored performance analysis snapshot: ${stats.totalQueries} queries analyzed`);
        }
        catch (error) {
            this.logger.error('Failed to store performance analysis snapshot:', error);
        }
    }
    async recordSlowQuery(queryMetrics) {
        const key = queryMetrics.planHash;
        try {
            await this.performanceMetricModel.create({
                metricType: models_1.MetricType.ERROR_RATE,
                value: queryMetrics.executionTime,
                unit: 'ms',
                recordedAt: new Date(),
                tags: {
                    queryId: queryMetrics.queryId,
                    sql: queryMetrics.sql,
                    planHash: queryMetrics.planHash,
                    complexity: queryMetrics.complexity,
                    compliance: queryMetrics.compliance,
                    type: 'slow_query',
                },
            });
            const existing = this.slowQueries.get(key);
            if (existing) {
                existing.frequency++;
                existing.averageTime =
                    (existing.averageTime + queryMetrics.executionTime) / 2;
                existing.maxTime = Math.max(existing.maxTime, queryMetrics.executionTime);
                existing.minTime = Math.min(existing.minTime, queryMetrics.executionTime);
                existing.lastSeen = queryMetrics.timestamp;
            }
            else {
                this.slowQueries.set(key, {
                    queryMetrics,
                    frequency: 1,
                    averageTime: queryMetrics.executionTime,
                    maxTime: queryMetrics.executionTime,
                    minTime: queryMetrics.executionTime,
                    lastSeen: queryMetrics.timestamp,
                    optimizationSuggestions: this.generateOptimizationSuggestions(queryMetrics.sql, queryMetrics.executionTime),
                });
            }
            this.logger.warn(`Slow query detected: ${queryMetrics.queryId}, time: ${queryMetrics.executionTime}ms`);
        }
        catch (error) {
            this.logger.error(`Failed to record slow query ${queryMetrics.queryId}:`, error);
        }
    }
    async updateQueryPattern(queryMetrics) {
        const pattern = this.extractQueryPattern(queryMetrics.sql);
        const existing = this.queryPatterns.get(pattern);
        if (existing) {
            existing.frequency++;
            existing.averageExecutionTime =
                (existing.averageExecutionTime + queryMetrics.executionTime) / 2;
        }
        else {
            this.queryPatterns.set(pattern, {
                pattern,
                frequency: 1,
                averageExecutionTime: queryMetrics.executionTime,
                dataTypes: this.extractDataTypesFromSQL(queryMetrics.sql),
                complianceLevel: queryMetrics.compliance,
                suggestions: this.generateOptimizationSuggestions(queryMetrics.sql, queryMetrics.executionTime),
            });
        }
    }
    generateOptimizationSuggestions(sql, executionTime) {
        const suggestions = [];
        if (sql.toLowerCase().includes('select *')) {
            suggestions.push({
                type: 'QUERY_REWRITE',
                priority: 'MEDIUM',
                description: 'Replace SELECT * with specific column names',
                estimatedImprovement: 15,
                implementation: 'Specify only required columns in SELECT clause',
                riskLevel: 'LOW',
            });
        }
        if (executionTime > this.verySlowQueryThreshold) {
            suggestions.push({
                type: 'INDEX',
                priority: 'HIGH',
                description: 'Consider adding database indexes on frequently queried columns',
                estimatedImprovement: 80,
                implementation: 'Analyze query execution plan and add appropriate indexes',
                riskLevel: 'MEDIUM',
            });
        }
        if (sql.toLowerCase().includes('like') &&
            !sql.toLowerCase().includes('like binary')) {
            suggestions.push({
                type: 'INDEX',
                priority: 'MEDIUM',
                description: 'LIKE queries without indexes can be slow',
                estimatedImprovement: 70,
                implementation: 'Consider full-text search or add appropriate indexes',
                riskLevel: 'MEDIUM',
            });
        }
        return suggestions;
    }
    extractQueryPattern(sql) {
        return sql
            .replace(/\b\d+\b/g, '?')
            .replace(/'[^']*'/g, '?')
            .replace(/\b(true|false)\b/gi, '?')
            .trim();
    }
    extractDataTypesFromSQL(sql) {
        const dataTypes = [];
        const lowerSQL = sql.toLowerCase();
        if (lowerSQL.includes('allerg'))
            dataTypes.push('allergies');
        if (lowerSQL.includes('vaccin'))
            dataTypes.push('vaccinations');
        if (lowerSQL.includes('chronic') || lowerSQL.includes('condition'))
            dataTypes.push('chronicConditions');
        if (lowerSQL.includes('vital') || lowerSQL.includes('sign'))
            dataTypes.push('vitalSigns');
        if (lowerSQL.includes('student'))
            dataTypes.push('students');
        if (lowerSQL.includes('clinic') || lowerSQL.includes('visit'))
            dataTypes.push('clinicVisits');
        return dataTypes.length > 0 ? dataTypes : ['unknown'];
    }
    extractIndexesUsed(sql) {
        const indexes = [];
        const lowerSQL = sql.toLowerCase();
        if (lowerSQL.includes('where') && lowerSQL.includes('id')) {
            indexes.push('primary_key');
        }
        return indexes;
    }
    generatePlanHash(sql) {
        let hash = 0;
        for (let i = 0; i < sql.length; i++) {
            const char = sql.charCodeAt(i);
            hash = (hash << 5) - hash + char;
            hash = hash & hash;
        }
        return Math.abs(hash).toString(16);
    }
    calculateComplexity(sql) {
        const lowerSQL = sql.toLowerCase();
        const joinCount = (lowerSQL.match(/\bjoin\b/g) || []).length;
        const hasSubquery = lowerSQL.includes('select') &&
            lowerSQL.includes('(') &&
            lowerSQL.includes(')');
        const hasCTE = lowerSQL.includes('with') &&
            lowerSQL.includes('as') &&
            lowerSQL.includes('(');
        const hasAggregation = /\b(count|sum|avg|min|max|group by)\b/.test(lowerSQL);
        if (hasCTE || hasSubquery || joinCount > 3) {
            return QueryComplexity.VERY_COMPLEX;
        }
        else if (joinCount > 1 || hasAggregation) {
            return QueryComplexity.COMPLEX;
        }
        else if (joinCount === 1) {
            return QueryComplexity.MODERATE;
        }
        else {
            return QueryComplexity.SIMPLE;
        }
    }
    normalizeSQL(sql) {
        return sql
            .replace(/\s+/g, ' ')
            .replace(/\b\d+\b/g, '?')
            .replace(/'[^']*'/g, '?')
            .trim();
    }
    generateQueryId(sql) {
        return `q_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    setupEventListeners() {
        this.eventEmitter.on('database.query.executed', (event) => {
            this.recordQuery(event.sql, event.executionTime, event.rowsAffected, event.compliance || 'INTERNAL', event.parameters, event.stackTrace);
        });
    }
    onModuleDestroy() {
        this.logger.log('Query Performance Analyzer Service destroyed');
    }
};
exports.QueryPerformanceAnalyzer = QueryPerformanceAnalyzer;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_DAY_AT_MIDNIGHT),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], QueryPerformanceAnalyzer.prototype, "storePerformanceAnalysisSnapshot", null);
exports.QueryPerformanceAnalyzer = QueryPerformanceAnalyzer = QueryPerformanceAnalyzer_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(3, (0, sequelize_1.InjectModel)(models_1.PerformanceMetric)),
    __metadata("design:paramtypes", [health_record_metrics_service_1.HealthRecordMetricsService,
        phi_access_logger_service_1.PHIAccessLogger,
        event_emitter_1.EventEmitter2, Object])
], QueryPerformanceAnalyzer);
//# sourceMappingURL=query-performance-analyzer.service.js.map