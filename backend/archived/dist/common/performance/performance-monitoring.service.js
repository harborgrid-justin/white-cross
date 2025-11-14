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
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthcarePerformanceFactory = exports.HealthcarePerformanceMonitoringService = void 0;
exports.MonitorHealthcarePerformance = MonitorHealthcarePerformance;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const events_1 = require("events");
const perf_hooks_1 = require("perf_hooks");
const os = __importStar(require("os"));
const process = __importStar(require("process"));
const logger_service_1 = require("../logging/logger.service");
let HealthcarePerformanceMonitoringService = class HealthcarePerformanceMonitoringService extends events_1.EventEmitter {
    configService;
    metrics = [];
    queryPerformance = [];
    systemMetrics = [];
    alerts = [];
    recommendations = [];
    monitoringIntervals = [];
    slowQueryThreshold = 1000;
    criticalQueryThreshold = 5000;
    phiQueryThreshold = 500;
    alertThresholds = new Map();
    constructor(logger, configService) {
        super({
            serviceName: 'HealthcarePerformanceMonitoringService',
            logger,
            enableAuditLogging: true,
        });
        this.configService = configService;
        super();
        this.initializeHealthcareAlertThresholds();
        this.startHealthcareSystemMonitoring();
        this.startHealthcareMetricAggregation();
        this.startHealthcareAuditLogging();
    }
    async monitorHealthcareQuery(sequelize, queryName, queryFn, options = {}) {
        const queryId = this.generateQueryId();
        const startTime = perf_hooks_1.performance.now();
        const startMemory = process.memoryUsage();
        const relevantThreshold = options.containsPHI
            ? this.phiQueryThreshold
            : this.slowQueryThreshold;
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
                planHash: this.generatePlanHash(queryFn),
                timestamp: new Date(),
                optimized: executionTime < relevantThreshold,
                suggestions: [],
                containsPHI: options.containsPHI || false,
                patientId: options.patientId,
                providerId: options.providerId,
                clinicalContext: options.clinicalContext
            };
            if (executionTime > relevantThreshold) {
                queryPerf.suggestions = await this.analyzeHealthcareSlowQuery(queryPerf);
            }
            this.queryPerformance.push(queryPerf);
            await this.recordHealthcareMetric({
                id: this.generateMetricId(),
                timestamp: new Date(),
                metricType: options.containsPHI ? 'healthcare' : 'query',
                name: queryName,
                value: executionTime,
                unit: 'ms',
                tags: {
                    ...options.tags,
                    queryId,
                    containsPHI: String(options.containsPHI),
                    patientId: options.patientId || 'none',
                },
                metadata: {
                    memoryUsed,
                    rowsReturned: queryPerf.rowsReturned,
                    clinicalContext: options.clinicalContext,
                },
                patientImpactLevel: this.calculatePatientImpactLevel(executionTime, options.containsPHI),
                hipaaAuditRequired: options.containsPHI,
            });
            await this.checkHealthcarePerformanceAlerts(options.containsPHI ? 'phi_query_time' : 'query_time', executionTime, options.patientId);
            this.emit('healthcareQueryExecuted', {
                queryPerf,
                executionTime,
                memoryUsed,
                patientImpact: this.calculatePatientImpactLevel(executionTime, options.containsPHI),
            });
            return result;
        }
        catch (error) {
            const endTime = perf_hooks_1.performance.now();
            const executionTime = endTime - startTime;
            await this.recordHealthcareMetric({
                id: this.generateMetricId(),
                timestamp: new Date(),
                metricType: 'healthcare',
                name: `${queryName}_error`,
                value: executionTime,
                unit: 'ms',
                tags: {
                    ...options.tags,
                    queryId,
                    error: 'true',
                    containsPHI: String(options.containsPHI),
                    patientId: options.patientId || 'none',
                },
                metadata: {
                    error: error.message,
                    clinicalContext: options.clinicalContext,
                },
                patientImpactLevel: 'HIGH',
                hipaaAuditRequired: true,
            });
            await this.createHealthcareAlert({
                type: 'anomaly',
                severity: 'critical',
                metric: 'healthcare_query_failure',
                message: `Healthcare query failed: ${queryName} - ${error.message}`,
                actualValue: executionTime,
                patientImpact: 'HIGH',
                requiresNotification: true,
                clinicalTeamNotified: false,
            });
            this.emit('healthcareQueryError', {
                queryId,
                executionTime,
                error,
                patientId: options.patientId,
            });
            throw error;
        }
    }
    async monitorHealthcareAPI(endpoint, method, handler, options = {}) {
        const startTime = perf_hooks_1.performance.now();
        const startMemory = process.memoryUsage();
        try {
            const result = await handler();
            const endTime = perf_hooks_1.performance.now();
            const endMemory = process.memoryUsage();
            const responseTime = endTime - startTime;
            const memoryUsed = endMemory.heapUsed - startMemory.heapUsed;
            await this.recordHealthcareMetric({
                id: this.generateMetricId(),
                timestamp: new Date(),
                metricType: 'api',
                name: 'healthcare_api_response_time',
                value: responseTime,
                unit: 'ms',
                tags: {
                    endpoint,
                    method,
                    status: 'success',
                    containsPHI: String(options.containsPHI),
                    clinicalWorkflow: options.clinicalWorkflow || 'unknown',
                },
                metadata: {
                    ...options.metadata,
                    memoryUsed,
                    patientId: options.patientId,
                    providerId: options.providerId,
                },
                patientImpactLevel: this.calculateAPIPatientImpactLevel(endpoint, responseTime),
                hipaaAuditRequired: options.containsPHI,
            });
            await this.checkHealthcarePerformanceAlerts('healthcare_api_response_time', responseTime);
            return result;
        }
        catch (error) {
            const endTime = perf_hooks_1.performance.now();
            const responseTime = endTime - startTime;
            await this.recordHealthcareMetric({
                id: this.generateMetricId(),
                timestamp: new Date(),
                metricType: 'api',
                name: 'healthcare_api_response_time',
                value: responseTime,
                unit: 'ms',
                tags: {
                    endpoint,
                    method,
                    status: 'error',
                    containsPHI: String(options.containsPHI),
                    clinicalWorkflow: options.clinicalWorkflow || 'unknown',
                },
                metadata: {
                    ...options.metadata,
                    error: error.message,
                    patientId: options.patientId,
                    providerId: options.providerId,
                },
                patientImpactLevel: 'HIGH',
                hipaaAuditRequired: true,
            });
            await this.createHealthcareAlert({
                type: 'anomaly',
                severity: 'high',
                metric: 'healthcare_api_failure',
                message: `Healthcare API failure: ${method} ${endpoint} - ${error.message}`,
                actualValue: responseTime,
                patientImpact: 'HIGH',
                requiresNotification: true,
                clinicalTeamNotified: false,
            });
            throw error;
        }
    }
    collectHealthcareSystemMetrics() {
        const memoryUsage = process.memoryUsage();
        return {
            timestamp: new Date(),
            cpu: {
                usage: this.calculateCPUUsage(),
                load: os.loadavg(),
                cores: os.cpus().length,
                healthcareProcessUsage: this.calculateHealthcareProcessUsage(),
            },
            memory: {
                used: os.totalmem() - os.freemem(),
                free: os.freemem(),
                total: os.totalmem(),
                percentage: ((os.totalmem() - os.freemem()) / os.totalmem()) * 100,
                heap: {
                    used: memoryUsage.heapUsed,
                    total: memoryUsage.heapTotal,
                    percentage: (memoryUsage.heapUsed / memoryUsage.heapTotal) * 100,
                },
                phiCacheUsage: this.calculatePHICacheUsage(),
            },
            disk: {
                reads: 0,
                writes: 0,
                readTime: 0,
                writeTime: 0,
                healthcareDataWrites: this.calculateHealthcareDataWrites(),
            },
            network: {
                bytesIn: 0,
                bytesOut: 0,
                packetsIn: 0,
                packetsOut: 0,
                secureConnections: this.calculateSecureConnections(),
            },
            database: {
                activeConnections: 0,
                queryQueueLength: 0,
                lockWaitTime: 0,
                deadlocks: 0,
            },
        };
    }
    async analyzeHealthcareQueryPerformance(sequelize, timeWindow = 3600000) {
        const cutoffTime = new Date(Date.now() - timeWindow);
        const recentQueries = this.queryPerformance.filter((q) => q.timestamp > cutoffTime);
        const recommendations = [];
        const phiQueries = recentQueries.filter((q) => q.containsPHI);
        const slowPHIQueries = phiQueries.filter((q) => q.executionTime > this.phiQueryThreshold);
        for (const query of slowPHIQueries) {
            const recommendation = await this.generateHealthcareQueryOptimizationRecommendation(query);
            if (recommendation) {
                recommendations.push(recommendation);
            }
        }
        const queryByContext = new Map();
        for (const query of recentQueries.filter((q) => q.clinicalContext)) {
            const context = query.clinicalContext;
            if (!queryByContext.has(context)) {
                queryByContext.set(context, []);
            }
            queryByContext.get(context)?.push(query);
        }
        for (const [context, contextQueries] of queryByContext) {
            if (contextQueries.length > 5) {
                const avgExecutionTime = contextQueries.reduce((sum, q) => sum + q.executionTime, 0) / contextQueries.length;
                if (avgExecutionTime > this.slowQueryThreshold) {
                    recommendations.push({
                        id: this.generateRecommendationId(),
                        type: 'healthcare',
                        priority: 'high',
                        description: `Optimize queries for clinical workflow: ${context}`,
                        impact: `Improve ${context} workflow performance by ${Math.round(((avgExecutionTime - this.slowQueryThreshold) / avgExecutionTime) * 100)}%`,
                        effort: 'Medium - Clinical workflow optimization',
                        estimatedImprovement: 50,
                        createdAt: new Date(),
                        applied: false,
                        patientSafetyImpact: 'Faster clinical workflows improve patient care quality',
                        complianceImplication: 'Improved system responsiveness supports timely care delivery',
                    });
                }
            }
        }
        this.recommendations.push(...recommendations);
        return recommendations;
    }
    getHealthcarePerformanceDashboard(timeWindow = 3600000) {
        const cutoffTime = new Date(Date.now() - timeWindow);
        const recentMetrics = this.metrics.filter(m => m.timestamp > cutoffTime);
        const recentQueries = this.queryPerformance.filter(q => q.timestamp > cutoffTime);
        const recentSystemMetrics = this.systemMetrics.filter(m => m.timestamp > cutoffTime);
        const healthcareMetrics = recentMetrics.filter(m => m.metricType === 'healthcare' || m.tags.containsPHI === 'true');
        const phiQueries = recentQueries.filter(q => q.containsPHI);
        const avgPHIQueryTime = phiQueries.length > 0
            ? phiQueries.reduce((sum, q) => sum + q.executionTime, 0) / phiQueries.length
            : 0;
        const slowPHIQueries = phiQueries.filter(q => q.executionTime > this.phiQueryThreshold);
        const patientSafetyAlerts = this.alerts.filter(a => a.timestamp > cutoffTime &&
            (a.patientImpact === 'HIGH' || a.patientImpact === 'CRITICAL'));
        const complianceAlerts = this.alerts.filter(a => a.timestamp > cutoffTime &&
            a.type === 'security');
        const latestSystemMetrics = recentSystemMetrics[recentSystemMetrics.length - 1];
        return {
            clinicalMetrics: {
                avgPHIQueryTime,
                totalHealthcareQueries: healthcareMetrics.length,
                slowPHIQueries: slowPHIQueries.length,
                patientSafetyAlerts: patientSafetyAlerts.length,
                complianceAlerts: complianceAlerts.length
            },
            systemHealth: {
                cpuUsage: latestSystemMetrics?.cpu.usage || 0,
                memoryUsage: latestSystemMetrics?.memory.percentage || 0,
                phiCacheUsage: latestSystemMetrics?.memory.phiCacheUsage || 0,
                secureConnections: latestSystemMetrics?.network.secureConnections || 0
            },
            topSlowHealthcareQueries: slowPHIQueries
                .sort((a, b) => b.executionTime - a.executionTime)
                .slice(0, 10),
            criticalAlerts: this.alerts
                .filter(a => a.timestamp > cutoffTime && a.severity === 'critical')
                .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()),
            clinicalRecommendations: this.recommendations
                .filter(r => !r.applied && r.type === 'healthcare')
                .sort((a, b) => this.getPriorityWeight(b.priority) - this.getPriorityWeight(a.priority))
        };
    }
    async recordHealthcareMetric(metric) {
        this.metrics.push(metric);
        this.emit('healthcareMetricRecorded', metric);
        if (metric.hipaaAuditRequired) {
            this.logHIPAAAuditMetric(metric);
        }
        await this.checkHealthcarePerformanceAlerts(metric.name, metric.value);
    }
    async createHealthcareAlert(alertData) {
        const alert = {
            id: this.generateAlertId(),
            timestamp: new Date(),
            acknowledged: false,
            patientImpact: 'MEDIUM',
            requiresNotification: false,
            clinicalTeamNotified: false,
            ...alertData
        };
        this.alerts.push(alert);
        this.emit('healthcarePerformanceAlert', alert);
        if (alert.severity === 'critical') {
            this.logError(`CRITICAL Healthcare Performance Alert: ${alert.message} | Impact: ${alert.patientImpact} | Time: ${alert.timestamp.toISOString()}`);
        }
    }
    async checkHealthcarePerformanceAlerts(metricName, value, patientId) {
        const threshold = this.alertThresholds.get(metricName);
        if (threshold && value > threshold) {
            const patientImpact = this.calculatePatientImpactFromMetric(metricName, value, threshold);
            const severity = this.calculateHealthcareAlertSeverity(metricName, value, threshold, patientImpact);
            await this.createHealthcareAlert({
                type: 'threshold',
                severity,
                metric: metricName,
                message: `Healthcare performance threshold exceeded: ${metricName} = ${value} > ${threshold}${patientId ? ` (Patient: ${patientId})` : ''}`,
                threshold,
                actualValue: value,
                patientImpact,
                requiresNotification: patientImpact === 'HIGH' || patientImpact === 'CRITICAL',
                clinicalTeamNotified: false
            });
        }
    }
    initializeHealthcareAlertThresholds() {
        this.alertThresholds.set('phi_query_time', this.phiQueryThreshold);
        this.alertThresholds.set('query_time', this.slowQueryThreshold);
        this.alertThresholds.set('healthcare_api_response_time', 800);
        this.alertThresholds.set('cpu_usage', 75);
        this.alertThresholds.set('memory_usage', 80);
        this.alertThresholds.set('phi_cache_usage', 70);
        this.alertThresholds.set('patient_safety_response_time', 2000);
        this.alertThresholds.set('clinical_workflow_time', 3000);
        this.alertThresholds.set('healthcare_error_rate', 0.01);
    }
    startHealthcareSystemMonitoring() {
        const interval = setInterval(async () => {
            try {
                const metrics = await this.collectHealthcareSystemMetrics();
                this.systemMetrics.push(metrics);
                const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
                this.systemMetrics = this.systemMetrics.filter(m => m.timestamp > oneDayAgo);
                await this.checkHealthcarePerformanceAlerts('cpu_usage', metrics.cpu.usage);
                await this.checkHealthcarePerformanceAlerts('memory_usage', metrics.memory.percentage);
                await this.checkHealthcarePerformanceAlerts('phi_cache_usage', metrics.memory.phiCacheUsage);
                this.emit('healthcareSystemMetricsUpdated', metrics);
            }
            catch (error) {
                this.logError('Healthcare system monitoring error:', error);
            }
        }, 30000);
        this.monitoringIntervals.push(interval);
    }
    startHealthcareMetricAggregation() {
        const interval = setInterval(() => {
            try {
                const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
                this.metrics = this.metrics.filter(m => m.timestamp > weekAgo);
                this.queryPerformance = this.queryPerformance.filter(q => q.timestamp > weekAgo);
                this.alerts = this.alerts.filter(a => a.timestamp > weekAgo);
                this.generateHealthcareAggregatedMetrics();
            }
            catch (error) {
                this.logError('Healthcare metric aggregation error:', error);
            }
        }, 60 * 60 * 1000);
        this.monitoringIntervals.push(interval);
    }
    startHealthcareAuditLogging() {
        const interval = setInterval(() => {
            try {
                this.generateHealthcarePerformanceAuditLog();
            }
            catch (error) {
                this.logError('Healthcare audit logging error:', error);
            }
        }, 15 * 60 * 1000);
        this.monitoringIntervals.push(interval);
    }
    calculatePatientImpactLevel(executionTime, containsPHI) {
        if (executionTime > this.criticalQueryThreshold)
            return 'CRITICAL';
        if (executionTime > this.slowQueryThreshold * 2)
            return 'HIGH';
        if (containsPHI && executionTime > this.phiQueryThreshold)
            return 'MEDIUM';
        if (executionTime > this.slowQueryThreshold)
            return 'LOW';
        return 'NONE';
    }
    calculateAPIPatientImpactLevel(endpoint, responseTime) {
        const criticalEndpoints = ['/emergency', '/vitals', '/medication', '/alerts'];
        const highPriorityEndpoints = ['/patient', '/lab-results', '/imaging'];
        const isCritical = criticalEndpoints.some(path => endpoint.includes(path));
        const isHighPriority = highPriorityEndpoints.some(path => endpoint.includes(path));
        if (isCritical && responseTime > 1000)
            return 'CRITICAL';
        if (isHighPriority && responseTime > 2000)
            return 'HIGH';
        if (responseTime > 3000)
            return 'MEDIUM';
        if (responseTime > 1000)
            return 'LOW';
        return 'NONE';
    }
    calculatePatientImpactFromMetric(metricName, value, threshold) {
        const ratio = value / threshold;
        if (metricName.includes('phi') || metricName.includes('patient')) {
            if (ratio > 3)
                return 'CRITICAL';
            if (ratio > 2)
                return 'HIGH';
            if (ratio > 1.5)
                return 'MEDIUM';
            return 'LOW';
        }
        if (ratio > 2.5)
            return 'CRITICAL';
        if (ratio > 2)
            return 'HIGH';
        if (ratio > 1.5)
            return 'MEDIUM';
        return 'LOW';
    }
    calculateHealthcareAlertSeverity(metricName, value, threshold, patientImpact) {
        if (patientImpact === 'CRITICAL')
            return 'critical';
        if (patientImpact === 'HIGH')
            return 'high';
        const ratio = value / threshold;
        if (ratio > 2)
            return 'critical';
        if (ratio > 1.5)
            return 'high';
        if (ratio > 1.2)
            return 'medium';
        return 'low';
    }
    async analyzeHealthcareSlowQuery(query) {
        const suggestions = [];
        if (query.containsPHI) {
            suggestions.push('PHI Query Optimization: Consider data masking for non-essential fields');
            suggestions.push('PHI Security: Ensure query uses encrypted indexes where possible');
        }
        if (query.clinicalContext) {
            suggestions.push(`Clinical Workflow: Optimize for ${query.clinicalContext} workflow patterns`);
        }
        if (query.sql.toLowerCase().includes('select *')) {
            suggestions.push('Security Risk: Avoid SELECT * to prevent unnecessary PHI exposure');
        }
        if (query.sql.toLowerCase().includes('order by') && !query.sql.toLowerCase().includes('limit')) {
            suggestions.push('Patient Safety: Add LIMIT to ORDER BY queries to prevent timeout');
        }
        if (query.indexesUsed.length === 0) {
            suggestions.push('Performance: Query not using indexes - critical for healthcare response times');
        }
        return suggestions;
    }
    async generateHealthcareQueryOptimizationRecommendation(query) {
        if (query.executionTime > this.criticalQueryThreshold) {
            return {
                id: this.generateRecommendationId(),
                type: 'healthcare',
                priority: 'critical',
                description: `Critical healthcare query optimization needed (${query.executionTime.toFixed(2)}ms)`,
                impact: `Reduce patient wait time from ${query.executionTime.toFixed(2)}ms to estimated ${(query.executionTime * 0.2).toFixed(2)}ms`,
                effort: 'High - Requires clinical workflow analysis and database optimization',
                sqlBefore: query.sql,
                sqlAfter: query.sql,
                estimatedImprovement: 80,
                createdAt: new Date(),
                applied: false,
                patientSafetyImpact: 'Faster query response improves clinical decision-making speed',
                complianceImplication: 'Improved performance supports timely care delivery requirements'
            };
        }
        return null;
    }
    logHIPAAAuditMetric(metric) {
        this.logInfo(`HIPAA Performance Audit: ${metric.name} | Value: ${metric.value}${metric.unit} | Patient Impact: ${metric.patientImpactLevel} | Time: ${metric.timestamp.toISOString()}`);
    }
    generateHealthcareAggregatedMetrics() {
        const recentMetrics = this.metrics.filter(m => m.timestamp > new Date(Date.now() - 60 * 60 * 1000));
        const phiMetrics = recentMetrics.filter(m => m.tags.containsPHI === 'true');
        const highImpactMetrics = recentMetrics.filter(m => m.patientImpactLevel === 'HIGH' || m.patientImpactLevel === 'CRITICAL');
        this.logInfo(`Healthcare Performance Summary: PHI Operations: ${phiMetrics.length}, High Impact Events: ${highImpactMetrics.length}`);
    }
    generateHealthcarePerformanceAuditLog() {
        const recentAlerts = this.alerts.filter(a => a.timestamp > new Date(Date.now() - 15 * 60 * 1000));
        const criticalAlerts = recentAlerts.filter(a => a.severity === 'critical');
        const patientImpactAlerts = recentAlerts.filter(a => a.patientImpact === 'HIGH' || a.patientImpact === 'CRITICAL');
        this.logInfo(`Healthcare Performance Audit: Critical Alerts: ${criticalAlerts.length}, Patient Impact Alerts: ${patientImpactAlerts.length}`);
    }
    calculateCPUUsage() {
        const loadAvg = os.loadavg()[0];
        const cpuCount = os.cpus().length;
        return Math.min((loadAvg / cpuCount) * 100, 100);
    }
    calculateHealthcareProcessUsage() {
        return 0;
    }
    calculatePHICacheUsage() {
        return 0;
    }
    calculateHealthcareDataWrites() {
        return 0;
    }
    calculateSecureConnections() {
        return 0;
    }
    getPriorityWeight(priority) {
        const weights = { low: 1, medium: 2, high: 3, critical: 4 };
        return weights[priority] || 0;
    }
    extractSQLFromFunction(queryFn) {
        return queryFn.toString().substring(0, 100) + '...';
    }
    generatePlanHash(queryFn) {
        return `plan_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    generateQueryId() {
        return `hc_query_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    generateMetricId() {
        return `hc_metric_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    generateAlertId() {
        return `hc_alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    generateRecommendationId() {
        return `hc_rec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    async healthCheck() {
        try {
            const recentMetrics = this.metrics.filter(m => m.timestamp > new Date(Date.now() - 300000));
            const recentSystemMetrics = this.systemMetrics.filter(m => m.timestamp > new Date(Date.now() - 60000));
            const hipaaAuditMetrics = recentMetrics.filter(m => m.hipaaAuditRequired);
            return {
                monitoring: this.monitoringIntervals.length > 0,
                metrics: recentMetrics.length > 0,
                alerts: true,
                systemHealth: recentSystemMetrics.length > 0,
                hipaaCompliance: hipaaAuditMetrics.length >= 0
            };
        }
        catch (error) {
            this.logError('Healthcare performance monitoring health check failed:', error);
            return {
                monitoring: false,
                metrics: false,
                alerts: false,
                systemHealth: false,
                hipaaCompliance: false
            };
        }
    }
    destroy() {
        this.monitoringIntervals.forEach(interval => clearInterval(interval));
        this.removeAllListeners();
        this.logInfo('Healthcare Performance Monitoring Service destroyed');
    }
};
exports.HealthcarePerformanceMonitoringService = HealthcarePerformanceMonitoringService;
exports.HealthcarePerformanceMonitoringService = HealthcarePerformanceMonitoringService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, Inject(logger_service_1.LoggerService)),
    __metadata("design:paramtypes", [logger_service_1.LoggerService,
        config_1.ConfigService])
], HealthcarePerformanceMonitoringService);
class HealthcarePerformanceFactory {
    static createHealthcarePerformanceMonitoring(configService) {
        return new HealthcarePerformanceMonitoringService(configService);
    }
}
exports.HealthcarePerformanceFactory = HealthcarePerformanceFactory;
function MonitorHealthcarePerformance(options = {}) {
    return function (target, propertyKey, descriptor) {
        const originalMethod = descriptor.value;
        const name = options.metricName || `${target.constructor.name}.${propertyKey}`;
        descriptor.value = async function (...args) {
            const startTime = perf_hooks_1.performance.now();
            try {
                const result = await originalMethod.apply(this, args);
                const endTime = perf_hooks_1.performance.now();
                const executionTime = endTime - startTime;
                console.log(`Healthcare Performance: ${name} took ${executionTime.toFixed(2)}ms | PHI: ${options.containsPHI} | Context: ${options.clinicalContext}`);
                return result;
            }
            catch (error) {
                const endTime = perf_hooks_1.performance.now();
                const executionTime = endTime - startTime;
                console.error(`Healthcare Performance Error: ${name} took ${executionTime.toFixed(2)}ms and failed | PHI: ${options.containsPHI} | Context: ${options.clinicalContext}`);
                throw error;
            }
        };
        return descriptor;
    };
}
//# sourceMappingURL=performance-monitoring.service.js.map