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
exports.HealthRecordComplianceController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const throttler_1 = require("@nestjs/throttler");
const auth_1 = require("../../services/auth");
const phi_access_logger_service_1 = require("../services/phi-access-logger.service");
const health_record_metrics_service_1 = require("../services/health-record-metrics.service");
const health_record_audit_interceptor_1 = require("../interceptors/health-record-audit.interceptor");
const health_record_cache_interceptor_1 = require("../interceptors/health-record-cache.interceptor");
const health_record_rate_limit_guard_1 = require("../guards/health-record-rate-limit.guard");
const base_1 = require("../../common/base");
let HealthRecordComplianceController = class HealthRecordComplianceController extends base_1.BaseController {
    phiAccessLogger;
    metricsService;
    constructor(phiAccessLogger, metricsService) {
        super();
        this.phiAccessLogger = phiAccessLogger;
        this.metricsService = metricsService;
    }
    async getPHIAccessStatistics(startDate, endDate) {
        const start = startDate ? new Date(startDate) : new Date(Date.now() - 24 * 60 * 60 * 1000);
        const end = endDate ? new Date(endDate) : new Date();
        return this.phiAccessLogger.getPHIAccessStatistics(start, end);
    }
    async getPHIAccessLogs(limit, userId, studentId, operation) {
        if (userId || studentId || operation) {
            return this.phiAccessLogger.searchPHIAccessLogs({
                userId,
                studentId,
                operation,
            });
        }
        return this.phiAccessLogger.getRecentPHIAccessLogs(limit || 100);
    }
    async getSecurityIncidents(limit) {
        return this.phiAccessLogger.getSecurityIncidents(limit || 50);
    }
    async generateComplianceReport(startDate, endDate) {
        if (!startDate || !endDate) {
            throw new common_1.BadRequestException('Start date and end date are required');
        }
        const start = new Date(startDate);
        const end = new Date(endDate);
        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            throw new common_1.BadRequestException('Invalid date format');
        }
        return this.phiAccessLogger.generateComplianceReport(start, end);
    }
    getPerformanceMetrics() {
        return this.metricsService.getHealthRecordMetricsSnapshot();
    }
    getHealthStatus() {
        return this.metricsService.getHealthStatus();
    }
    getPrometheusMetrics() {
        return {
            metrics: this.metricsService.getPrometheusMetrics(),
            contentType: 'text/plain',
        };
    }
    getComplianceDashboard() {
        const phiStats = this.phiAccessLogger.getPHIAccessStatistics(new Date(Date.now() - 24 * 60 * 60 * 1000), new Date());
        const securityIncidents = this.phiAccessLogger.getSecurityIncidents(10);
        const metricsSnapshot = this.metricsService.getHealthRecordMetricsSnapshot();
        const complianceReport = this.metricsService.getComplianceReport();
        const healthStatus = this.metricsService.getHealthStatus();
        return {
            summary: {
                totalPHIAccesses: phiStats.totalAccesses,
                securityIncidentCount: securityIncidents.length,
                systemHealth: healthStatus.healthy,
                complianceScore: complianceReport.complianceScore,
            },
            phiAccessStatistics: phiStats,
            recentSecurityIncidents: securityIncidents,
            performanceMetrics: metricsSnapshot.performanceMetrics,
            complianceMetrics: complianceReport,
            systemHealth: healthStatus,
            lastUpdated: new Date().toISOString(),
        };
    }
};
exports.HealthRecordComplianceController = HealthRecordComplianceController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Get PHI access statistics for compliance monitoring", summary: 'Get PHI access statistics',
        description: 'Retrieves PHI access statistics for HIPAA compliance monitoring.' }),
    (0, common_1.Get)('compliance/phi-access-stats'),
    (0, throttler_1.Throttle)({ default: { limit: 30, ttl: 60000 } }),
    (0, swagger_1.ApiQuery)({
        name: 'startDate',
        required: false,
        description: 'Start date for statistics (ISO string)',
        example: '2024-01-01T00:00:00.000Z',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'endDate',
        required: false,
        description: 'End date for statistics (ISO string)',
        example: '2024-01-31T23:59:59.999Z',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'PHI access statistics retrieved successfully',
        schema: {
            type: 'object',
            properties: {
                totalAccesses: { type: 'number' },
                uniqueUsers: { type: 'number' },
                uniqueStudents: { type: 'number' },
                operationCounts: { type: 'object' },
                dataTypeCounts: { type: 'object' },
                securityIncidents: { type: 'number' },
                period: {
                    type: 'object',
                    properties: {
                        start: { type: 'string', format: 'date-time' },
                        end: { type: 'string', format: 'date-time' },
                    },
                },
            },
        },
    }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Query)('startDate')),
    __param(1, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], HealthRecordComplianceController.prototype, "getPHIAccessStatistics", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Get recent PHI access logs for audit review", summary: 'Get PHI access logs',
        description: 'Retrieves recent PHI access logs for audit purposes.' }),
    (0, common_1.Get)('compliance/phi-access-logs'),
    (0, swagger_1.ApiQuery)({
        name: 'limit',
        required: false,
        description: 'Maximum number of entries to return',
        example: 100,
    }),
    (0, swagger_1.ApiQuery)({
        name: 'userId',
        required: false,
        description: 'Filter by user ID',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'studentId',
        required: false,
        description: 'Filter by student ID',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'operation',
        required: false,
        description: 'Filter by operation type',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'PHI access logs retrieved successfully',
    }),
    openapi.ApiResponse({ status: 200, type: [Object] }),
    __param(0, (0, common_1.Query)('limit')),
    __param(1, (0, common_1.Query)('userId')),
    __param(2, (0, common_1.Query)('studentId')),
    __param(3, (0, common_1.Query)('operation')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, String, String]),
    __metadata("design:returntype", Promise)
], HealthRecordComplianceController.prototype, "getPHIAccessLogs", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Get security incidents for compliance review", summary: 'Get security incidents',
        description: 'Retrieves security incidents related to PHI access for compliance review.' }),
    (0, common_1.Get)('compliance/security-incidents'),
    (0, swagger_1.ApiQuery)({
        name: 'limit',
        required: false,
        description: 'Maximum number of incidents to return',
        example: 50,
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Security incidents retrieved successfully',
    }),
    openapi.ApiResponse({ status: 200, type: [Object] }),
    __param(0, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], HealthRecordComplianceController.prototype, "getSecurityIncidents", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Generate comprehensive compliance report", summary: 'Generate compliance report',
        description: 'Generates comprehensive HIPAA compliance report with PHI access details.' }),
    (0, common_1.Get)('compliance/report'),
    (0, throttler_1.Throttle)({ default: { limit: 10, ttl: 60000 } }),
    (0, swagger_1.ApiQuery)({
        name: 'startDate',
        required: true,
        description: 'Report start date (ISO string)',
        example: '2024-01-01T00:00:00.000Z',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'endDate',
        required: true,
        description: 'Report end date (ISO string)',
        example: '2024-01-31T23:59:59.999Z',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Compliance report generated successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Invalid date parameters',
    }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)('startDate')),
    __param(1, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], HealthRecordComplianceController.prototype, "generateComplianceReport", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Get health record performance metrics", summary: 'Get performance metrics',
        description: 'Retrieves performance metrics for health record operations.' }),
    (0, common_1.Get)('metrics/performance'),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Performance metrics retrieved successfully',
    }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], HealthRecordComplianceController.prototype, "getPerformanceMetrics", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Get health status including compliance checks", summary: 'Get system health status',
        description: 'Retrieves health status including HIPAA compliance checks.' }),
    (0, common_1.Get)('health'),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Health status retrieved successfully',
        schema: {
            type: 'object',
            properties: {
                healthy: { type: 'boolean' },
                issues: { type: 'array', items: { type: 'string' } },
                metrics: { type: 'object' },
            },
        },
    }),
    openapi.ApiResponse({ status: 200 }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], HealthRecordComplianceController.prototype, "getHealthStatus", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Get Prometheus metrics for monitoring", summary: 'Get Prometheus metrics',
        description: 'Retrieves Prometheus-formatted metrics for external monitoring systems.' }),
    (0, common_1.Get)('metrics/prometheus'),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Prometheus metrics retrieved successfully',
        content: {
            'text/plain': {
                schema: { type: 'string' },
            },
        },
    }),
    openapi.ApiResponse({ status: 200 }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], HealthRecordComplianceController.prototype, "getPrometheusMetrics", null);
__decorate([
    (0, common_1.Get)('compliance/dashboard'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get compliance dashboard data',
        description: 'Retrieves comprehensive compliance dashboard data for monitoring interface.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Compliance dashboard data retrieved successfully',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], HealthRecordComplianceController.prototype, "getComplianceDashboard", null);
exports.HealthRecordComplianceController = HealthRecordComplianceController = __decorate([
    (0, swagger_1.ApiTags)('Health Records - Compliance'),
    (0, common_1.Controller)('health-records'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(auth_1.JwtAuthGuard, health_record_rate_limit_guard_1.HealthRecordRateLimitGuard),
    (0, common_1.UseInterceptors)(health_record_audit_interceptor_1.HealthRecordAuditInterceptor, health_record_cache_interceptor_1.HealthRecordCacheInterceptor),
    __metadata("design:paramtypes", [phi_access_logger_service_1.PHIAccessLogger,
        health_record_metrics_service_1.HealthRecordMetricsService])
], HealthRecordComplianceController);
//# sourceMappingURL=health-record-compliance.controller.js.map