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
var ReportsController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportsController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const report_generation_service_1 = require("../services/report-generation.service");
const report_export_service_1 = require("../services/report-export.service");
const dashboard_service_1 = require("../services/dashboard.service");
const health_trends_dto_1 = require("../dto/health-trends.dto");
const medication_usage_dto_1 = require("../dto/medication-usage.dto");
const incident_statistics_dto_1 = require("../dto/incident-statistics.dto");
const attendance_correlation_dto_1 = require("../dto/attendance-correlation.dto");
const base_report_dto_1 = require("../dto/base-report.dto");
const export_options_dto_1 = require("../dto/export-options.dto");
const report_constants_1 = require("../constants/report.constants");
const base_1 = require("../../common/base");
let ReportsController = ReportsController_1 = class ReportsController extends base_1.BaseController {
    reportGenerationService;
    reportExportService;
    dashboardService;
    logger = new common_1.Logger(ReportsController_1.name);
    constructor(reportGenerationService, reportExportService, dashboardService) {
        super();
        this.reportGenerationService = reportGenerationService;
        this.reportExportService = reportExportService;
        this.dashboardService = dashboardService;
    }
    async getHealthTrends(dto) {
        this.logger.log('Generating health trends report');
        return this.reportGenerationService.generateReport(report_constants_1.ReportType.HEALTH_TRENDS, dto);
    }
    async getMedicationUsage(dto) {
        this.logger.log('Generating medication usage report');
        return this.reportGenerationService.generateReport(report_constants_1.ReportType.MEDICATION_USAGE, dto);
    }
    async getIncidentStatistics(dto) {
        this.logger.log('Generating incident statistics report');
        return this.reportGenerationService.generateReport(report_constants_1.ReportType.INCIDENT_STATISTICS, dto);
    }
    async getAttendanceCorrelation(dto) {
        this.logger.log('Generating attendance correlation report');
        return this.reportGenerationService.generateReport(report_constants_1.ReportType.ATTENDANCE_CORRELATION, dto);
    }
    async getComplianceReport(dto) {
        this.logger.log('Generating compliance report');
        return this.reportGenerationService.generateReport(report_constants_1.ReportType.COMPLIANCE, dto);
    }
    async getDashboardMetrics() {
        this.logger.log('Retrieving dashboard metrics');
        return this.dashboardService.getRealTimeDashboard();
    }
    async exportReport(dto) {
        this.logger.log(`Exporting report: ${dto.reportType} as ${dto.format}`);
        return this.reportExportService.exportReport(dto.data, dto);
    }
    async generateCustomReport(body) {
        this.logger.log(`Generating custom report: ${body.reportType}`);
        return this.reportGenerationService.generateReport(body.reportType, body.parameters);
    }
};
exports.ReportsController = ReportsController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Generate health trends analysis report", summary: 'Generate health trends report',
        description: 'Creates comprehensive health trend analysis over time periods. Tracks changes in health conditions, medication usage patterns, immunization compliance, and incident rates. Supports school-level and district-level aggregation with seasonal pattern identification and predictive insights.' }),
    (0, common_1.Get)('health-trends'),
    (0, swagger_1.ApiQuery)({
        name: 'startDate',
        required: false,
        description: 'Start date for analysis period',
        example: '2024-01-01',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'endDate',
        required: false,
        description: 'End date for analysis period',
        example: '2024-12-31',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'schoolId',
        required: false,
        description: 'Filter by specific school',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'gradeLevel',
        required: false,
        description: 'Filter by grade level',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'includeGraphs',
        required: false,
        description: 'Include trend visualizations',
        example: true,
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Health trends report generated successfully',
        schema: {
            type: 'object',
            properties: {
                summary: { type: 'object' },
                trends: { type: 'array' },
                recommendations: { type: 'array' },
                visualizations: { type: 'array' },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid query parameters' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [health_trends_dto_1.HealthTrendsDto]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getHealthTrends", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Generate medication usage analytics report", summary: 'Generate medication usage report',
        description: 'Analyzes medication administration patterns, adherence rates, and usage trends. Includes controlled substance tracking, most-used medications, administration compliance, and cost analysis. Essential for inventory management and clinical oversight.' }),
    (0, common_1.Get)('medication-usage'),
    (0, swagger_1.ApiQuery)({
        name: 'startDate',
        required: false,
        description: 'Start date for usage analysis',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'endDate',
        required: false,
        description: 'End date for usage analysis',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'medicationType',
        required: false,
        description: 'Filter by medication type (controlled, OTC, prescription)',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'includeAdherence',
        required: false,
        description: 'Include adherence calculations',
        example: true,
    }),
    (0, swagger_1.ApiQuery)({
        name: 'groupBy',
        required: false,
        description: 'Group results by (medication, student, condition)',
        example: 'medication',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Medication usage report generated successfully',
        schema: {
            type: 'object',
            properties: {
                totalAdministrations: { type: 'number' },
                topMedications: { type: 'array' },
                adherenceRates: { type: 'object' },
                trends: { type: 'array' },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid query parameters' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [medication_usage_dto_1.MedicationUsageDto]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getMedicationUsage", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Generate incident statistics and safety analysis report", summary: 'Generate incident statistics report',
        description: 'Comprehensive safety and incident analysis including injury types, locations, time patterns, and severity trends. Identifies high-risk areas and times for targeted safety interventions and resource allocation.' }),
    (0, common_1.Get)('incident-statistics'),
    (0, swagger_1.ApiQuery)({
        name: 'startDate',
        required: false,
        description: 'Start date for incident analysis',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'endDate',
        required: false,
        description: 'End date for incident analysis',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'incidentType',
        required: false,
        description: 'Filter by incident type (injury, illness, emergency)',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'location',
        required: false,
        description: 'Filter by location (classroom, playground, gymnasium)',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'severity',
        required: false,
        description: 'Filter by severity level',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Incident statistics report generated successfully',
        schema: {
            type: 'object',
            properties: {
                totalIncidents: { type: 'number' },
                byType: { type: 'object' },
                byLocation: { type: 'object' },
                timePatterns: { type: 'object' },
                recommendations: { type: 'array' },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid query parameters' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [incident_statistics_dto_1.IncidentStatisticsDto]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getIncidentStatistics", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Generate attendance and health correlation analysis", summary: 'Generate attendance correlation report',
        description: 'Analyzes correlations between health visits and attendance patterns. Identifies students with frequent health-related absences, chronic conditions affecting attendance, and seasonal health patterns impacting school participation.' }),
    (0, common_1.Get)('attendance-correlation'),
    (0, swagger_1.ApiQuery)({
        name: 'startDate',
        required: false,
        description: 'Start date for correlation analysis',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'endDate',
        required: false,
        description: 'End date for correlation analysis',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'minimumVisits',
        required: false,
        description: 'Minimum health visits threshold',
        example: '3',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'includeChronicConditions',
        required: false,
        description: 'Include chronic condition analysis',
        example: true,
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Attendance correlation report generated successfully',
        schema: {
            type: 'object',
            properties: {
                correlationCoefficient: { type: 'number' },
                studentsAtRisk: { type: 'array' },
                seasonalPatterns: { type: 'object' },
                recommendations: { type: 'array' },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid correlation parameters' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [attendance_correlation_dto_1.AttendanceCorrelationDto]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getAttendanceCorrelation", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Generate comprehensive compliance audit report", summary: 'Generate compliance audit report',
        description: 'Comprehensive HIPAA/FERPA compliance audit including documentation completeness, consent management, audit trail integrity, policy adherence, and violation tracking. Essential for regulatory compliance and accreditation.' }),
    (0, common_1.Get)('compliance'),
    (0, swagger_1.ApiQuery)({
        name: 'auditPeriod',
        required: false,
        description: 'Audit period (monthly, quarterly, annual)',
        example: 'quarterly',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'includeRecommendations',
        required: false,
        description: 'Include compliance recommendations',
        example: true,
    }),
    (0, swagger_1.ApiQuery)({
        name: 'complianceType',
        required: false,
        description: 'Filter by compliance type (HIPAA, FERPA, both)',
        example: 'HIPAA',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Compliance report generated successfully',
        schema: {
            type: 'object',
            properties: {
                overallScore: { type: 'number' },
                hipaaCompliance: { type: 'object' },
                ferpaCompliance: { type: 'object' },
                violations: { type: 'array' },
                actionItems: { type: 'array' },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Insufficient permissions for compliance reporting',
    }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [base_report_dto_1.BaseReportDto]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getComplianceReport", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Retrieve real-time dashboard metrics", summary: 'Get real-time dashboard metrics',
        description: 'Provides real-time operational dashboard data including active students, health visits today, critical alerts, medication due, and system status. Updates every 5 minutes for operational awareness.' }),
    (0, common_1.Get)('dashboard'),
    (0, swagger_1.ApiQuery)({
        name: 'schoolId',
        required: false,
        description: 'Filter by specific school for district users',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'refreshRate',
        required: false,
        description: 'Data refresh rate in minutes',
        example: '5',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Dashboard metrics retrieved successfully',
        schema: {
            type: 'object',
            properties: {
                activeStudents: { type: 'number' },
                todayVisits: { type: 'number' },
                criticalAlerts: { type: 'array' },
                medicationsDue: { type: 'number' },
                systemStatus: { type: 'object' },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getDashboardMetrics", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Export report to specific format", summary: 'Export report to specific format',
        description: 'Exports generated reports to various formats including PDF, Excel, CSV, and Word. Supports password protection for sensitive healthcare data and custom branding for organizational requirements. Maintains audit trail of all report exports.' }),
    (0, common_1.Post)('export'),
    (0, swagger_1.ApiBody)({
        type: export_options_dto_1.ExportOptionsDto,
        description: 'Export configuration and data',
        schema: {
            type: 'object',
            required: ['reportType', 'format', 'data'],
            properties: {
                reportType: {
                    type: 'string',
                    enum: [
                        'health-trends',
                        'medication-usage',
                        'incident-statistics',
                        'attendance-correlation',
                        'compliance',
                    ],
                    example: 'health-trends',
                },
                format: {
                    type: 'string',
                    enum: ['pdf', 'excel', 'csv', 'word'],
                    example: 'pdf',
                },
                data: {
                    type: 'object',
                    description: 'Report data to export',
                },
                options: {
                    type: 'object',
                    properties: {
                        password: {
                            type: 'string',
                            description: 'Password protection for sensitive reports',
                        },
                        includeCharts: {
                            type: 'boolean',
                            example: true,
                            description: 'Include visualizations in export',
                        },
                        watermark: { type: 'string', description: 'Custom watermark text' },
                        branding: {
                            type: 'boolean',
                            example: true,
                            description: 'Include organizational branding',
                        },
                    },
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Report exported successfully',
        schema: {
            type: 'object',
            properties: {
                exportId: {
                    type: 'string',
                    example: 'export_12345',
                    description: 'Unique export identifier',
                },
                downloadUrl: {
                    type: 'string',
                    example: '/api/downloads/report_12345.pdf',
                    description: 'Secure download URL',
                },
                filename: { type: 'string', example: 'health_trends_2024_Q1.pdf' },
                fileSize: {
                    type: 'number',
                    example: 2048576,
                    description: 'File size in bytes',
                },
                expiresAt: {
                    type: 'string',
                    format: 'date-time',
                    example: '2024-01-15T12:00:00Z',
                    description: 'Download link expiration',
                },
                format: { type: 'string', example: 'pdf' },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Bad Request - invalid export parameters or unsupported format',
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized - authentication required',
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Forbidden - insufficient permissions for report export',
    }),
    (0, swagger_1.ApiResponse)({
        status: 413,
        description: 'Payload Too Large - report data exceeds export limits',
    }),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [export_options_dto_1.ExportOptionsDto]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "exportReport", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Generate custom report", summary: 'Generate custom report',
        description: 'Creates custom reports with user-defined parameters and filters. Supports flexible data selection, custom date ranges, multi-dimensional analysis, and real-time data processing. Ideal for ad-hoc analysis and specialized reporting requirements.' }),
    (0, common_1.Post)('generate'),
    (0, swagger_1.ApiBody)({
        description: 'Custom report configuration',
        schema: {
            type: 'object',
            required: ['reportType', 'parameters'],
            properties: {
                reportType: {
                    type: 'string',
                    enum: [
                        'health-trends',
                        'medication-usage',
                        'incident-statistics',
                        'attendance-correlation',
                        'compliance',
                        'custom-analytics',
                    ],
                    example: 'custom-analytics',
                },
                parameters: {
                    type: 'object',
                    properties: {
                        dateRange: {
                            type: 'object',
                            properties: {
                                startDate: {
                                    type: 'string',
                                    format: 'date',
                                    example: '2024-01-01',
                                },
                                endDate: {
                                    type: 'string',
                                    format: 'date',
                                    example: '2024-12-31',
                                },
                            },
                        },
                        filters: {
                            type: 'object',
                            properties: {
                                schoolIds: { type: 'array', items: { type: 'string' } },
                                gradeLevels: { type: 'array', items: { type: 'string' } },
                                conditions: { type: 'array', items: { type: 'string' } },
                                departments: { type: 'array', items: { type: 'string' } },
                            },
                        },
                        metrics: {
                            type: 'array',
                            items: { type: 'string' },
                            example: ['visit_count', 'medication_adherence', 'incident_rate'],
                        },
                        groupBy: {
                            type: 'array',
                            items: { type: 'string' },
                            example: ['month', 'grade', 'condition'],
                        },
                        includeGraphs: { type: 'boolean', example: true },
                        includeRecommendations: { type: 'boolean', example: false },
                    },
                },
                outputOptions: {
                    type: 'object',
                    properties: {
                        format: {
                            type: 'string',
                            enum: ['json', 'excel', 'pdf'],
                            example: 'json',
                        },
                        includeRawData: { type: 'boolean', example: false },
                        maxRecords: { type: 'number', example: 10000 },
                    },
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Custom report generated successfully',
        schema: {
            type: 'object',
            properties: {
                reportId: {
                    type: 'string',
                    example: 'report_67890',
                    description: 'Unique report identifier',
                },
                generatedAt: {
                    type: 'string',
                    format: 'date-time',
                    example: '2024-01-15T10:30:00Z',
                },
                reportType: { type: 'string', example: 'custom-analytics' },
                summary: {
                    type: 'object',
                    properties: {
                        totalRecords: { type: 'number', example: 1250 },
                        dateRange: { type: 'string', example: '2024-01-01 to 2024-12-31' },
                        dataPoints: { type: 'number', example: 52 },
                    },
                },
                data: {
                    type: 'object',
                    description: 'Report data structure varies by report type and parameters',
                },
                visualizations: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            type: { type: 'string', example: 'line_chart' },
                            title: { type: 'string', example: 'Health Visits Over Time' },
                            data: { type: 'object' },
                        },
                    },
                },
                recommendations: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            priority: {
                                type: 'string',
                                enum: ['high', 'medium', 'low'],
                                example: 'high',
                            },
                            category: { type: 'string', example: 'safety' },
                            recommendation: {
                                type: 'string',
                                example: 'Increase playground supervision during peak injury hours',
                            },
                            evidence: {
                                type: 'string',
                                example: 'Based on 65% of playground injuries occurring between 12-1 PM',
                            },
                        },
                    },
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Bad Request - invalid report parameters or unsupported report type',
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized - authentication required',
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Forbidden - insufficient permissions for custom report generation',
    }),
    (0, swagger_1.ApiResponse)({
        status: 422,
        description: 'Unprocessable Entity - report parameters conflict or produce no data',
    }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "generateCustomReport", null);
exports.ReportsController = ReportsController = ReportsController_1 = __decorate([
    (0, swagger_1.ApiTags)('Reports'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('reports'),
    __metadata("design:paramtypes", [report_generation_service_1.ReportGenerationService,
        report_export_service_1.ReportExportService,
        dashboard_service_1.DashboardService])
], ReportsController);
//# sourceMappingURL=reports.controller.js.map