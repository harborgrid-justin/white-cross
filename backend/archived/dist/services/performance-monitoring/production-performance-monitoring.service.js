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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PerformanceFactory = exports.ProductionPerformanceMonitoringService = void 0;
exports.MonitorPerformance = MonitorPerformance;
const common_1 = require("@nestjs/common");
const events_1 = require("events");
const sequelize_1 = require("sequelize");
const perf_hooks_1 = require("perf_hooks");
const os = __importStar(require("os"));
const process = __importStar(require("process"));
let ProductionPerformanceMonitoringService = class ProductionPerformanceMonitoringService extends events_1.EventEmitter {
    metrics = [];
    queryPerformance = [];
    systemMetrics = [];
    alerts = [];
    recommendations = [];
    monitoringIntervals = [];
    slowQueryThreshold = 1000;
    alertThresholds = new Map();
    constructor(logger) {
        super();
        this.initializeAlertThresholds();
        this.startSystemMonitoring();
        this.startMetricAggregation();
    }
    async monitorQuery(sequelize, queryName, queryFn, tags = {}) {
        const queryId = this.generateQueryId();
        const startTime = perf_hooks_1.performance.now();
        const startMemory = process.memoryUsage();
        try {
            const result = await queryFn();
            const endTime = perf_hooks_1.performance.now();
            const endMemory = process.memoryUsage();
            const executionTime = endTime - startTime;
            const memoryUsed = endMemory.heapUsed - startMemory.heapUsed;
            const queryPerf = {
                queryId,
                sql: this.extractSQLFromFunction(queryFn),
                executionTime,
                rowsReturned: Array.isArray(result) ? result.length : 1,
                rowsExamined: 0,
                indexesUsed: [],
                planHash: '',
                timestamp: new Date(),
                optimized: executionTime < this.slowQueryThreshold,
                suggestions: []
            };
            if (executionTime > this.slowQueryThreshold) {
                queryPerf.suggestions = await this.analyzeSlowQuery(queryPerf);
            }
            this.queryPerformance.push(queryPerf);
            await this.recordMetric({
                id: this.generateMetricId(),
                timestamp: new Date(),
                metricType: 'query',
                name: queryName,
                value: executionTime,
                unit: 'ms',
                tags: { ...tags, queryId },
                metadata: { memoryUsed, rowsReturned: queryPerf.rowsReturned }
            });
            await this.checkPerformanceAlerts('query_time', executionTime);
            this.emit('queryExecuted', { queryPerf, executionTime, memoryUsed });
            return result;
        }
        catch (error) {
            const endTime = perf_hooks_1.performance.now();
            const executionTime = endTime - startTime;
            await this.recordMetric({
                id: this.generateMetricId(),
                timestamp: new Date(),
                metricType: 'query',
                name: `${queryName}_error`,
                value: executionTime,
                unit: 'ms',
                tags: { ...tags, queryId, error: 'true' },
                metadata: { error: error.message }
            });
            this.emit('queryError', { queryId, executionTime, error });
            throw error;
        }
    }
    async monitorAPICall(endpoint, method, handler, metadata = {}) {
        const startTime = perf_hooks_1.performance.now();
        const startMemory = process.memoryUsage();
        try {
            const result = await handler();
            const endTime = perf_hooks_1.performance.now();
            const endMemory = process.memoryUsage();
            const responseTime = endTime - startTime;
            const memoryUsed = endMemory.heapUsed - startMemory.heapUsed;
            await this.recordMetric({
                id: this.generateMetricId(),
                timestamp: new Date(),
                metricType: 'api',
                name: 'response_time',
                value: responseTime,
                unit: 'ms',
                tags: { endpoint, method, status: 'success' },
                metadata: { ...metadata, memoryUsed }
            });
            await this.checkPerformanceAlerts('api_response_time', responseTime);
            return result;
        }
        catch (error) {
            const endTime = perf_hooks_1.performance.now();
            const responseTime = endTime - startTime;
            await this.recordMetric({
                id: this.generateMetricId(),
                timestamp: new Date(),
                metricType: 'api',
                name: 'response_time',
                value: responseTime,
                unit: 'ms',
                tags: { endpoint, method, status: 'error' },
                metadata: { ...metadata, error: error.message }
            });
            throw error;
        }
    }
    async collectSystemMetrics() {
        const memoryUsage = process.memoryUsage();
        const cpuUsage = process.cpuUsage();
        return {
            timestamp: new Date(),
            cpu: {
                usage: this.calculateCPUUsage(),
                load: os.loadavg(),
                cores: os.cpus().length
            },
            memory: {
                used: os.totalmem() - os.freemem(),
                free: os.freemem(),
                total: os.totalmem(),
                percentage: ((os.totalmem() - os.freemem()) / os.totalmem()) * 100,
                heap: {
                    used: memoryUsage.heapUsed,
                    total: memoryUsage.heapTotal,
                    percentage: (memoryUsage.heapUsed / memoryUsage.heapTotal) * 100
                }
            },
            disk: {
                reads: 0,
                writes: 0,
                readTime: 0,
                writeTime: 0
            },
            network: {
                bytesIn: 0,
                bytesOut: 0,
                packetsIn: 0,
                packetsOut: 0
            }
        };
    }
    async analyzeQueryPerformance(sequelize, timeWindow = 3600000) {
        const cutoffTime = new Date(Date.now() - timeWindow);
        const recentQueries = this.queryPerformance.filter(q => q.timestamp > cutoffTime);
        const recommendations = [];
        const slowQueries = recentQueries.filter(q => q.executionTime > this.slowQueryThreshold);
        for (const query of slowQueries) {
            const recommendation = await this.generateQueryOptimizationRecommendation(query);
            if (recommendation) {
                recommendations.push(recommendation);
            }
        }
        const queryFrequency = new Map();
        for (const query of recentQueries) {
            const count = queryFrequency.get(query.planHash) || 0;
            queryFrequency.set(query.planHash, count + 1);
        }
        for (const [planHash, frequency] of queryFrequency) {
            if (frequency > 10) {
                const sampleQuery = recentQueries.find(q => q.planHash === planHash);
                if (sampleQuery && sampleQuery.indexesUsed.length === 0) {
                    recommendations.push({
                        id: this.generateRecommendationId(),
                        type: 'index',
                        priority: 'high',
                        description: `Create index for frequently executed query (${frequency} times)`,
                        impact: 'Significant performance improvement for frequent queries',
                        effort: 'Low - Single index creation',
                        sqlBefore: sampleQuery.sql,
                        sqlAfter: this.generateIndexSuggestion(sampleQuery.sql),
                        estimatedImprovement: 60,
                        createdAt: new Date(),
                        applied: false
                    });
                }
            }
        }
        this.recommendations.push(...recommendations);
        return recommendations;
    }
    async analyzeDatabasePerformance(sequelize) {
        try {
            const indexUsageQuery = `
        SELECT 
          s.schemaname,
          s.tablename,
          s.indexname,
          s.idx_tup_read,
          s.idx_tup_fetch
        FROM pg_stat_user_indexes s
        JOIN pg_index i ON s.indexrelid = i.indexrelid
        WHERE i.indisunique = false
        ORDER BY s.idx_tup_read DESC
      `;
            const indexUsage = await sequelize.query(indexUsageQuery, {
                type: sequelize_1.QueryTypes.SELECT
            }).catch(() => []);
            const tableStatsQuery = `
        SELECT 
          schemaname,
          tablename,
          n_tup_ins as inserts,
          n_tup_upd as updates,
          n_tup_del as deletes,
          n_tup_hot_upd as hot_updates,
          n_live_tup as live_tuples,
          n_dead_tup as dead_tuples
        FROM pg_stat_user_tables
        ORDER BY n_live_tup DESC
      `;
            const tableStats = await sequelize.query(tableStatsQuery, {
                type: sequelize_1.QueryTypes.SELECT
            }).catch(() => []);
            const slowQueries = this.queryPerformance
                .filter(q => q.executionTime > this.slowQueryThreshold)
                .sort((a, b) => b.executionTime - a.executionTime)
                .slice(0, 20);
            const recommendations = await this.analyzeQueryPerformance(sequelize);
            return {
                indexUsage,
                tableStats,
                slowQueries,
                recommendations
            };
        }
        catch (error) {
            this.logError('Database performance analysis failed:', error);
            return {
                indexUsage: [],
                tableStats: [],
                slowQueries: [],
                recommendations: []
            };
        }
    }
    async recordMetric(metric) {
        this.metrics.push(metric);
        this.emit('metricRecorded', metric);
        await this.checkPerformanceAlerts(metric.name, metric.value);
    }
    async recordCustomMetric(name, value, unit, tags = {}, metadata = {}) {
        await this.recordMetric({
            id: this.generateMetricId(),
            timestamp: new Date(),
            metricType: 'custom',
            name,
            value,
            unit,
            tags,
            metadata
        });
    }
    async checkPerformanceAlerts(metricName, value) {
        const threshold = this.alertThresholds.get(metricName);
        if (threshold && value > threshold) {
            const alert = {
                id: this.generateAlertId(),
                type: 'threshold',
                severity: this.calculateAlertSeverity(metricName, value, threshold),
                metric: metricName,
                message: `${metricName} exceeded threshold: ${value} > ${threshold}`,
                timestamp: new Date(),
                threshold,
                actualValue: value,
                acknowledged: false
            };
            this.alerts.push(alert);
            this.emit('performanceAlert', alert);
        }
    }
    getPerformanceDashboard(timeWindow = 3600000) {
        const cutoffTime = new Date(Date.now() - timeWindow);
        const recentMetrics = this.metrics.filter(m => m.timestamp > cutoffTime);
        const recentQueries = this.queryPerformance.filter(q => q.timestamp > cutoffTime);
        const recentSystemMetrics = this.systemMetrics.filter(m => m.timestamp > cutoffTime);
        const queryMetrics = recentMetrics.filter(m => m.metricType === 'query');
        const apiMetrics = recentMetrics.filter(m => m.metricType === 'api');
        const avgResponseTime = queryMetrics.length > 0
            ? queryMetrics.reduce((sum, m) => sum + m.value, 0) / queryMetrics.length
            : 0;
        const slowQueries = recentQueries.filter(q => q.executionTime > this.slowQueryThreshold);
        const errorMetrics = recentMetrics.filter(m => m.tags.error === 'true');
        const errorRate = recentMetrics.length > 0 ? errorMetrics.length / recentMetrics.length : 0;
        const latestSystemMetrics = recentSystemMetrics[recentSystemMetrics.length - 1];
        return {
            metrics: {
                avgResponseTime,
                totalQueries: recentQueries.length,
                slowQueries: slowQueries.length,
                errorRate
            },
            systemHealth: {
                cpuUsage: latestSystemMetrics?.cpu.usage || 0,
                memoryUsage: latestSystemMetrics?.memory.percentage || 0,
                diskUsage: 0
            },
            topSlowQueries: slowQueries
                .sort((a, b) => b.executionTime - a.executionTime)
                .slice(0, 10),
            recentAlerts: this.alerts
                .filter(a => a.timestamp > cutoffTime)
                .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()),
            recommendations: this.recommendations
                .filter(r => !r.applied)
                .sort((a, b) => this.getPriorityWeight(b.priority) - this.getPriorityWeight(a.priority))
        };
    }
    exportMetricsForPrometheus() {
        const latest = this.systemMetrics[this.systemMetrics.length - 1];
        if (!latest)
            return '';
        return `
# HELP cpu_usage_percent CPU usage percentage
# TYPE cpu_usage_percent gauge
cpu_usage_percent ${latest.cpu.usage}

# HELP memory_usage_percent Memory usage percentage
# TYPE memory_usage_percent gauge
memory_usage_percent ${latest.memory.percentage}

# HELP heap_usage_percent Heap usage percentage
# TYPE heap_usage_percent gauge
heap_usage_percent ${latest.memory.heap.percentage}

# HELP query_response_time_ms Query response time in milliseconds
# TYPE query_response_time_ms histogram
${this.generateQueryResponseTimeHistogram()}

# HELP api_response_time_ms API response time in milliseconds
# TYPE api_response_time_ms histogram
${this.generateAPIResponseTimeHistogram()}
    `.trim();
    }
    initializeAlertThresholds() {
        this.alertThresholds.set('query_time', 2000);
        this.alertThresholds.set('api_response_time', 1000);
        this.alertThresholds.set('cpu_usage', 80);
        this.alertThresholds.set('memory_usage', 85);
        this.alertThresholds.set('error_rate', 0.05);
    }
    startSystemMonitoring() {
        const interval = setInterval(async () => {
            try {
                const metrics = await this.collectSystemMetrics();
                this.systemMetrics.push(metrics);
                const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
                this.systemMetrics = this.systemMetrics.filter(m => m.timestamp > oneDayAgo);
                await this.checkPerformanceAlerts('cpu_usage', metrics.cpu.usage);
                await this.checkPerformanceAlerts('memory_usage', metrics.memory.percentage);
                this.emit('systemMetricsUpdated', metrics);
            }
            catch (error) {
                this.logError('System monitoring error:', error);
            }
        }, 30000);
        this.monitoringIntervals.push(interval);
    }
    startMetricAggregation() {
        const interval = setInterval(() => {
            try {
                const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
                this.metrics = this.metrics.filter(m => m.timestamp > weekAgo);
                this.queryPerformance = this.queryPerformance.filter(q => q.timestamp > weekAgo);
                this.alerts = this.alerts.filter(a => a.timestamp > weekAgo);
            }
            catch (error) {
                this.logError('Metric aggregation error:', error);
            }
        }, 60 * 60 * 1000);
        this.monitoringIntervals.push(interval);
    }
    calculateCPUUsage() {
        const loadAvg = os.loadavg()[0];
        const cpuCount = os.cpus().length;
        return Math.min((loadAvg / cpuCount) * 100, 100);
    }
    async analyzeSlowQuery(query) {
        const suggestions = [];
        if (query.sql.toLowerCase().includes('select *')) {
            suggestions.push('Avoid SELECT * - specify only needed columns');
        }
        if (query.sql.toLowerCase().includes('order by') && !query.sql.toLowerCase().includes('limit')) {
            suggestions.push('Consider adding LIMIT to ORDER BY queries');
        }
        if (query.indexesUsed.length === 0) {
            suggestions.push('Query not using any indexes - consider adding appropriate indexes');
        }
        if (query.rowsExamined > query.rowsReturned * 10) {
            suggestions.push('Query examining too many rows - optimize WHERE conditions');
        }
        return suggestions;
    }
    async generateQueryOptimizationRecommendation(query) {
        if (query.executionTime > this.slowQueryThreshold * 2) {
            return {
                id: this.generateRecommendationId(),
                type: 'query',
                priority: 'high',
                description: `Optimize slow query (${query.executionTime.toFixed(2)}ms execution time)`,
                impact: `Reduce query time from ${query.executionTime.toFixed(2)}ms to estimated ${(query.executionTime * 0.3).toFixed(2)}ms`,
                effort: 'Medium - Query rewriting and index optimization',
                sqlBefore: query.sql,
                sqlAfter: query.sql,
                estimatedImprovement: 70,
                createdAt: new Date(),
                applied: false
            };
        }
        return null;
    }
    generateIndexSuggestion(sql) {
        return `-- Consider adding appropriate indexes based on WHERE clauses\n${sql}`;
    }
    calculateAlertSeverity(metricName, value, threshold) {
        const ratio = value / threshold;
        if (ratio > 2)
            return 'critical';
        if (ratio > 1.5)
            return 'high';
        if (ratio > 1.2)
            return 'medium';
        return 'low';
    }
    getPriorityWeight(priority) {
        const weights = { low: 1, medium: 2, high: 3, critical: 4 };
        return weights[priority] || 0;
    }
    generateQueryResponseTimeHistogram() {
        const buckets = [10, 50, 100, 500, 1000, 5000];
        const recentQueries = this.queryPerformance.filter(q => q.timestamp > new Date(Date.now() - 3600000));
        let histogram = '';
        buckets.forEach(bucket => {
            const count = recentQueries.filter(q => q.executionTime <= bucket).length;
            histogram += `query_response_time_ms_bucket{le="${bucket}"} ${count}\n`;
        });
        return histogram;
    }
    generateAPIResponseTimeHistogram() {
        const buckets = [10, 50, 100, 500, 1000];
        const recentAPIMetrics = this.metrics.filter(m => m.metricType === 'api' &&
            m.timestamp > new Date(Date.now() - 3600000));
        let histogram = '';
        buckets.forEach(bucket => {
            const count = recentAPIMetrics.filter(m => m.value <= bucket).length;
            histogram += `api_response_time_ms_bucket{le="${bucket}"} ${count}\n`;
        });
        return histogram;
    }
    extractSQLFromFunction(queryFn) {
        return queryFn.toString().substring(0, 100) + '...';
    }
    generateQueryId() {
        return `query_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    generateMetricId() {
        return `metric_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    generateAlertId() {
        return `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    generateRecommendationId() {
        return `rec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    destroy() {
        this.monitoringIntervals.forEach(interval => clearInterval(interval));
        this.removeAllListeners();
    }
    async healthCheck() {
        try {
            const recentMetrics = this.metrics.filter(m => m.timestamp > new Date(Date.now() - 300000));
            const recentSystemMetrics = this.systemMetrics.filter(m => m.timestamp > new Date(Date.now() - 60000));
            return {
                monitoring: this.monitoringIntervals.length > 0,
                metrics: recentMetrics.length > 0,
                alerts: true,
                systemHealth: recentSystemMetrics.length > 0
            };
        }
        catch (error) {
            this.logError('Performance monitoring health check failed:', error);
            return {
                monitoring: false,
                metrics: false,
                alerts: false,
                systemHealth: false
            };
        }
    }
};
exports.ProductionPerformanceMonitoringService = ProductionPerformanceMonitoringService;
exports.ProductionPerformanceMonitoringService = ProductionPerformanceMonitoringService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, Inject(LoggerService)),
    __metadata("design:paramtypes", [typeof (_a = typeof LoggerService !== "undefined" && LoggerService) === "function" ? _a : Object])
], ProductionPerformanceMonitoringService);
class PerformanceFactory {
    static createProductionPerformanceMonitoring() {
        return new ProductionPerformanceMonitoringService();
    }
}
exports.PerformanceFactory = PerformanceFactory;
function MonitorPerformance(metricName) {
    return function (target, propertyKey, descriptor) {
        const originalMethod = descriptor.value;
        const name = metricName || `${target.constructor.name}.${propertyKey}`;
        descriptor.value = async function (...args) {
            const startTime = perf_hooks_1.performance.now();
            try {
                const result = await originalMethod.apply(this, args);
                const endTime = perf_hooks_1.performance.now();
                console.log(`Performance: ${name} took ${endTime - startTime}ms`);
                return result;
            }
            catch (error) {
                const endTime = perf_hooks_1.performance.now();
                console.log(`Performance Error: ${name} took ${endTime - startTime}ms and failed`);
                throw error;
            }
        };
        return descriptor;
    };
}
//# sourceMappingURL=production-performance-monitoring.service.js.map