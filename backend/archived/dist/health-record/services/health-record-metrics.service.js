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
exports.HealthRecordMetricsService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const sequelize_1 = require("@nestjs/sequelize");
const sequelize_2 = require("sequelize");
const uuid_1 = require("uuid");
const enterprise_metrics_service_1 = require("../../common/enterprise/services/enterprise-metrics.service");
const models_1 = require("../../database/models");
const base_1 = require("../../common/base");
const logger_service_1 = require("../../common/logging/logger.service");
let HealthRecordMetricsService = class HealthRecordMetricsService extends base_1.BaseService {
    healthMetricSnapshotModel;
    enterpriseMetrics;
    constructor(logger, healthMetricSnapshotModel) {
        super({
            serviceName: 'HealthRecordMetricsService',
            logger,
            enableAuditLogging: true,
        });
        this.healthMetricSnapshotModel = healthMetricSnapshotModel;
        this.enterpriseMetrics = new enterprise_metrics_service_1.EnterpriseMetricsService('health-record');
        this.logInfo('Health Record Metrics Service initialized with database persistence');
    }
    recordPHIAccess(operation, complianceLevel, dataTypes, responseTime, success, recordCount = 1) {
        this.enterpriseMetrics.incrementCounter(`phi_operation_${operation.toLowerCase()}`, 1, {
            compliance_level: complianceLevel,
            success: success.toString(),
        });
        this.enterpriseMetrics.incrementCounter('phi_access_by_compliance', recordCount, {
            level: complianceLevel,
        });
        dataTypes.forEach((dataType) => {
            this.enterpriseMetrics.incrementCounter('phi_access_by_datatype', recordCount, {
                data_type: dataType,
                compliance_level: complianceLevel,
            });
        });
        this.enterpriseMetrics.recordHistogram('phi_response_time', responseTime, {
            operation,
            compliance_level: complianceLevel,
        });
        this.enterpriseMetrics.recordComplianceMetrics({
            phiAccesses: recordCount,
            auditLogEntries: 1,
        });
        if (recordCount > 50) {
            this.logWarning(`High-volume PHI access detected: ${recordCount} records, operation: ${operation}, compliance: ${complianceLevel}`);
            this.recordSecurityMetric('bulk_phi_access', 1);
        }
        if (!success) {
            this.recordSecurityMetric('phi_access_failure', 1);
        }
    }
    recordHealthRecordOperation(operation, responseTime, success, cached = false) {
        this.enterpriseMetrics.incrementCounter(`health_record_${operation.toLowerCase()}`, 1, {
            success: success.toString(),
            cached: cached.toString(),
        });
        this.enterpriseMetrics.recordHistogram(`health_record_${operation.toLowerCase()}_time`, responseTime, {
            success: success.toString(),
        });
        if (operation === 'READ') {
            if (cached) {
                this.enterpriseMetrics.incrementCounter('health_record_cache_hits');
            }
            else {
                this.enterpriseMetrics.incrementCounter('health_record_cache_misses');
            }
        }
        this.enterpriseMetrics.recordPerformanceMetrics({
            requestCount: 1,
            averageResponseTime: responseTime,
            errorRate: success ? 0 : 1,
            cacheHitRate: cached ? 1 : 0,
        });
    }
    recordSearchOperation(searchType, resultsCount, responseTime, success) {
        this.enterpriseMetrics.incrementCounter('health_record_search', 1, {
            search_type: searchType,
            success: success.toString(),
        });
        this.enterpriseMetrics.recordGauge('search_results_count', resultsCount, {
            search_type: searchType,
        });
        this.enterpriseMetrics.recordHistogram('search_response_time', responseTime, {
            search_type: searchType,
        });
        if (resultsCount > 100) {
            this.logDebug(`Large search result set: ${resultsCount} records, type: ${searchType}`);
        }
    }
    recordAllergyOperation(operation, severity, responseTime, success) {
        this.enterpriseMetrics.incrementCounter(`allergy_${operation.toLowerCase()}`, 1, {
            severity: severity.toLowerCase(),
            success: success.toString(),
        });
        this.enterpriseMetrics.recordHistogram(`allergy_${operation.toLowerCase()}_time`, responseTime, {
            severity: severity.toLowerCase(),
        });
        if (severity === 'LIFE_THREATENING') {
            this.recordSecurityMetric('life_threatening_allergy_operation', 1);
        }
    }
    recordVaccinationOperation(operation, vaccineType, responseTime, success) {
        this.enterpriseMetrics.incrementCounter(`vaccination_${operation.toLowerCase()}`, 1, {
            vaccine_type: vaccineType,
            success: success.toString(),
        });
        this.enterpriseMetrics.recordHistogram(`vaccination_${operation.toLowerCase()}_time`, responseTime, {
            vaccine_type: vaccineType,
        });
    }
    recordChronicConditionOperation(operation, conditionType, responseTime, success) {
        this.enterpriseMetrics.incrementCounter(`chronic_condition_${operation.toLowerCase()}`, 1, {
            condition_type: conditionType,
            success: success.toString(),
        });
        this.enterpriseMetrics.recordHistogram(`chronic_condition_${operation.toLowerCase()}_time`, responseTime, {
            condition_type: conditionType,
        });
    }
    recordVitalSignsOperation(operation, vitalType, responseTime, success, abnormal = false) {
        this.enterpriseMetrics.incrementCounter(`vital_signs_${operation.toLowerCase()}`, 1, {
            vital_type: vitalType,
            success: success.toString(),
            abnormal: abnormal.toString(),
        });
        this.enterpriseMetrics.recordHistogram(`vital_signs_${operation.toLowerCase()}_time`, responseTime, {
            vital_type: vitalType,
        });
        if (abnormal && operation === 'CREATE') {
            this.recordSecurityMetric('abnormal_vital_signs_recorded', 1);
        }
    }
    recordSecurityMetric(metricName, value, tags) {
        this.enterpriseMetrics.incrementCounter(`security_${metricName}`, value, tags);
    }
    async storeMetricsSnapshot() {
        try {
            const snapshot = this.getHealthRecordMetricsSnapshot();
            const schoolId = 'system';
            const metricsToStore = [
                {
                    metricName: 'phi_reads',
                    value: snapshot.phiOperations.reads,
                    unit: 'count',
                    category: 'phi_operations',
                },
                {
                    metricName: 'phi_writes',
                    value: snapshot.phiOperations.writes,
                    unit: 'count',
                    category: 'phi_operations',
                },
                {
                    metricName: 'phi_deletes',
                    value: snapshot.phiOperations.deletes,
                    unit: 'count',
                    category: 'phi_operations',
                },
                {
                    metricName: 'phi_exports',
                    value: snapshot.phiOperations.exports,
                    unit: 'count',
                    category: 'phi_operations',
                },
                {
                    metricName: 'phi_searches',
                    value: snapshot.phiOperations.searches,
                    unit: 'count',
                    category: 'phi_operations',
                },
                {
                    metricName: 'average_response_time',
                    value: snapshot.performanceMetrics.averageResponseTime,
                    unit: 'ms',
                    category: 'performance',
                },
                {
                    metricName: 'error_rate',
                    value: snapshot.performanceMetrics.errorRate * 100,
                    unit: 'percent',
                    category: 'performance',
                },
                {
                    metricName: 'cache_hit_rate',
                    value: snapshot.performanceMetrics.cacheHitRate * 100,
                    unit: 'percent',
                    category: 'performance',
                },
                {
                    metricName: 'security_incidents',
                    value: snapshot.securityMetrics.securityIncidents,
                    unit: 'count',
                    category: 'security',
                },
            ];
            const snapshotRecords = metricsToStore.map((metric) => ({
                id: (0, uuid_1.v4)(),
                schoolId,
                metricName: metric.metricName,
                value: metric.value,
                unit: metric.unit,
                category: metric.category,
                snapshotDate: snapshot.timestamp,
                metadata: {
                    complianceLevels: snapshot.complianceLevels,
                    dataTypes: snapshot.dataTypes,
                },
            }));
            await this.healthMetricSnapshotModel.bulkCreate(snapshotRecords);
            this.logInfo(`Stored ${snapshotRecords.length} health metrics snapshots for ${snapshot.timestamp.toISOString()}`);
        }
        catch (error) {
            this.logError('Failed to store health metrics snapshot:', error);
        }
    }
    async getHistoricalMetrics(schoolId, startDate, endDate, metricNames) {
        try {
            const whereClause = {
                schoolId,
                snapshotDate: {
                    [sequelize_2.Op.between]: [startDate, endDate],
                },
            };
            if (metricNames && metricNames.length > 0) {
                whereClause.metricName = {
                    [sequelize_2.Op.in]: metricNames,
                };
            }
            const snapshots = await this.healthMetricSnapshotModel.findAll({
                where: whereClause,
                order: [
                    ['snapshotDate', 'ASC'],
                    ['metricName', 'ASC'],
                ],
            });
            return snapshots;
        }
        catch (error) {
            this.logError('Failed to retrieve historical metrics:', error);
            return [];
        }
    }
    getMetricValue(snapshots, metricName, date) {
        const snapshot = snapshots.find((s) => s.metricName === metricName &&
            s.snapshotDate.toISOString() === date.toISOString());
        return snapshot ? snapshot.value : 0;
    }
    getHealthRecordMetricsSnapshot() {
        return {
            timestamp: new Date(),
            phiOperations: {
                reads: this.enterpriseMetrics.getCounter('phi_operation_read') || 0,
                writes: this.enterpriseMetrics.getCounter('phi_operation_create') ||
                    0 + this.enterpriseMetrics.getCounter('phi_operation_update') ||
                    0,
                deletes: this.enterpriseMetrics.getCounter('phi_operation_delete') || 0,
                exports: this.enterpriseMetrics.getCounter('phi_operation_export') || 0,
                searches: this.enterpriseMetrics.getCounter('health_record_search') || 0,
            },
            complianceLevels: {
                phi: this.enterpriseMetrics.getCounter('phi_access_phi') || 0,
                sensitivePhi: this.enterpriseMetrics.getCounter('phi_access_sensitive_phi') || 0,
                internal: this.enterpriseMetrics.getCounter('phi_access_internal') || 0,
                public: this.enterpriseMetrics.getCounter('phi_access_public') || 0,
            },
            dataTypes: {
                healthRecords: this.enterpriseMetrics.getCounter('datatype_health_records') || 0,
                allergies: this.enterpriseMetrics.getCounter('datatype_allergies') || 0,
                vaccinations: this.enterpriseMetrics.getCounter('datatype_vaccinations') || 0,
                chronicConditions: this.enterpriseMetrics.getCounter('datatype_chronic_conditions') || 0,
                vitalSigns: this.enterpriseMetrics.getCounter('datatype_vital_signs') || 0,
            },
            performanceMetrics: {
                averageResponseTime: this.enterpriseMetrics.getHistogram('phi_response_time')?.avg || 0,
                errorRate: this.calculateErrorRate(),
                cacheHitRate: this.calculateCacheHitRate(),
            },
            securityMetrics: {
                securityIncidents: this.enterpriseMetrics.getCounter('security_incident_unauthorized_access') || 0,
                suspiciousActivity: this.enterpriseMetrics.getCounter('security_bulk_phi_access') ||
                    0 +
                        this.enterpriseMetrics.getCounter('security_life_threatening_allergy_operation') ||
                    0,
                accessViolations: this.enterpriseMetrics.getCounter('security_phi_access_failure') || 0,
            },
        };
    }
    calculateErrorRate() {
        const totalOperations = this.getTotalOperations();
        const errorOperations = this.enterpriseMetrics.getCounter('phi_access_failure') || 0;
        return totalOperations > 0 ? errorOperations / totalOperations : 0;
    }
    calculateCacheHitRate() {
        const cacheHits = this.enterpriseMetrics.getCounter('health_record_cache_hits') || 0;
        const cacheMisses = this.enterpriseMetrics.getCounter('health_record_cache_misses') || 0;
        const totalCacheRequests = cacheHits + cacheMisses;
        return totalCacheRequests > 0 ? cacheHits / totalCacheRequests : 0;
    }
    getTotalOperations() {
        return ((this.enterpriseMetrics.getCounter('phi_operation_read') || 0) +
            (this.enterpriseMetrics.getCounter('phi_operation_create') || 0) +
            (this.enterpriseMetrics.getCounter('phi_operation_update') || 0) +
            (this.enterpriseMetrics.getCounter('phi_operation_delete') || 0) +
            (this.enterpriseMetrics.getCounter('health_record_search') || 0));
    }
    getHealthStatus() {
        const issues = [];
        const snapshot = this.getHealthRecordMetricsSnapshot();
        if (snapshot.performanceMetrics.errorRate > 0.05) {
            issues.push(`High error rate: ${(snapshot.performanceMetrics.errorRate * 100).toFixed(2)}%`);
        }
        if (snapshot.performanceMetrics.cacheHitRate < 0.7) {
            issues.push(`Low cache hit rate: ${(snapshot.performanceMetrics.cacheHitRate * 100).toFixed(2)}%`);
        }
        if (snapshot.performanceMetrics.averageResponseTime > 2000) {
            issues.push(`High average response time: ${snapshot.performanceMetrics.averageResponseTime.toFixed(2)}ms`);
        }
        if (snapshot.securityMetrics.securityIncidents > 10) {
            issues.push(`High security incidents: ${snapshot.securityMetrics.securityIncidents}`);
        }
        return {
            healthy: issues.length === 0,
            issues,
            metrics: snapshot,
        };
    }
    resetMetrics() {
        this.enterpriseMetrics.reset();
        this.logWarning('Health record metrics have been reset');
    }
    getComplianceReport() {
        const phiAccessCount = this.enterpriseMetrics.getCounter('phi_access_phi') || 0;
        const sensitivePhiAccessCount = this.enterpriseMetrics.getCounter('phi_access_sensitive_phi') || 0;
        const auditLogEntries = this.enterpriseMetrics.getCounter('compliance_audit_entries') || 0;
        const securityIncidents = this.enterpriseMetrics.getCounter('security_incident_unauthorized_access') || 0;
        let complianceScore = 100;
        if (securityIncidents > 0)
            complianceScore -= Math.min(securityIncidents * 5, 50);
        if (auditLogEntries === 0 && phiAccessCount + sensitivePhiAccessCount > 0)
            complianceScore -= 30;
        return {
            phiAccessCount,
            sensitivePhiAccessCount,
            auditLogEntries,
            securityIncidents,
            complianceScore: Math.max(complianceScore, 0),
        };
    }
    onModuleDestroy() {
        this.logInfo('Health Record Metrics Service destroyed');
    }
    recordCacheMetrics(operation, cacheType, responseTime) {
        const metricKey = operation === 'HIT' ? 'cache_hits' : 'cache_misses';
        this.enterpriseMetrics.incrementCounter(metricKey, 1, {
            cache_type: cacheType,
        });
        this.enterpriseMetrics.recordHistogram('cache_response_time', responseTime, {
            cache_type: cacheType,
            operation: operation.toLowerCase(),
        });
        this.logDebug(`Cache ${operation.toLowerCase()} recorded for type: ${cacheType}, response time: ${responseTime}ms`);
    }
    getPrometheusMetrics() {
        return this.enterpriseMetrics.getPrometheusMetrics();
    }
};
exports.HealthRecordMetricsService = HealthRecordMetricsService;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_DAY_AT_MIDNIGHT),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], HealthRecordMetricsService.prototype, "storeMetricsSnapshot", null);
exports.HealthRecordMetricsService = HealthRecordMetricsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(logger_service_1.LoggerService)),
    __param(1, (0, sequelize_1.InjectModel)(models_1.HealthMetricSnapshot)),
    __metadata("design:paramtypes", [logger_service_1.LoggerService, Object])
], HealthRecordMetricsService);
//# sourceMappingURL=health-record-metrics.service.js.map