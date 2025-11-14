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
exports.HealthMetricsController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const health_metrics_service_1 = require("./health-metrics.service");
const create_vitals_dto_1 = require("./dto/create-vitals.dto");
const update_alert_dto_1 = require("./dto/update-alert.dto");
const get_metrics_query_dto_1 = require("./dto/get-metrics-query.dto");
const get_vitals_query_dto_1 = require("./dto/get-vitals-query.dto");
const get_alerts_query_dto_1 = require("./dto/get-alerts-query.dto");
const get_trends_query_dto_1 = require("./dto/get-trends-query.dto");
const get_department_query_dto_1 = require("./dto/get-department-query.dto");
const base_1 = require("../common/base");
let HealthMetricsController = class HealthMetricsController extends base_1.BaseController {
    healthMetricsService;
    constructor(healthMetricsService) {
        super();
        this.healthMetricsService = healthMetricsService;
    }
    async getMetricsOverview(query) {
        return this.healthMetricsService.getMetricsOverview(query.timeRange, query.department, query.refresh);
    }
    async getLiveVitals(query) {
        return this.healthMetricsService.getLiveVitals(query.patientIds, query.department, query.critical, query.limit);
    }
    async getPatientTrends(patientId, query) {
        return this.healthMetricsService.getPatientTrends(parseInt(patientId, 10), query.metrics, query.timeRange, query.granularity);
    }
    async getDepartmentPerformance(query) {
        return this.healthMetricsService.getDepartmentPerformance(query.timeRange || '24h', query.includeHistorical);
    }
    async recordVitals(createVitalsDto) {
        return this.healthMetricsService.recordVitals(createVitalsDto);
    }
    async getHealthAlerts(query) {
        return this.healthMetricsService.getHealthAlerts(query.severity, query.department, query.status, query.limit);
    }
    async updateAlertStatus(alertId, updateAlertDto) {
        return this.healthMetricsService.updateAlertStatus(parseInt(alertId, 10), updateAlertDto);
    }
};
exports.HealthMetricsController = HealthMetricsController;
__decorate([
    (0, common_1.Get)('overview'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get health metrics overview',
        description: 'Retrieves comprehensive health metrics overview with departmental statistics',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Health metrics overview retrieved successfully',
        type: 'MetricsOverview',
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized - authentication required',
    }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [get_metrics_query_dto_1.GetMetricsQueryDto]),
    __metadata("design:returntype", Promise)
], HealthMetricsController.prototype, "getMetricsOverview", null);
__decorate([
    (0, common_1.Get)('vitals/live'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get live vital signs monitoring',
        description: 'Retrieves real-time vital signs data for active monitoring. Used in critical care scenarios where immediate health status visibility is required. Includes filtering for critical patients and department-specific monitoring.',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'patientIds',
        required: false,
        type: String,
        description: 'Comma-separated patient IDs to monitor. If not provided, returns all patients in department. Format: "123,456,789"',
        example: '123,456,789',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'department',
        required: false,
        type: String,
        description: 'Filter by department code (ICU, ER, WARD, etc.)',
        example: 'ICU',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'critical',
        required: false,
        type: Boolean,
        description: 'Filter for only critical vital signs requiring immediate attention',
        example: true,
    }),
    (0, swagger_1.ApiQuery)({
        name: 'limit',
        required: false,
        type: Number,
        description: 'Maximum number of records to return (default: 50)',
        example: 50,
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Live vital signs retrieved successfully',
        schema: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    patientId: {
                        type: 'number',
                        example: 123,
                        description: 'Patient identifier',
                    },
                    timestamp: {
                        type: 'string',
                        format: 'date-time',
                        example: '2024-01-15T09:30:00Z',
                    },
                    vitals: {
                        type: 'object',
                        properties: {
                            heartRate: {
                                type: 'number',
                                example: 72,
                                description: 'Heart rate in BPM',
                            },
                            bloodPressure: {
                                type: 'object',
                                properties: {
                                    systolic: { type: 'number', example: 120 },
                                    diastolic: { type: 'number', example: 80 },
                                },
                            },
                            temperature: {
                                type: 'number',
                                example: 98.6,
                                description: 'Temperature in Fahrenheit',
                            },
                            oxygenSaturation: {
                                type: 'number',
                                example: 98,
                                description: 'SpO2 percentage',
                            },
                            respiratoryRate: {
                                type: 'number',
                                example: 16,
                                description: 'Breaths per minute',
                            },
                        },
                    },
                    alertLevel: {
                        type: 'string',
                        enum: ['normal', 'warning', 'critical'],
                        example: 'normal',
                    },
                    department: { type: 'string', example: 'ICU' },
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized - authentication required',
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Forbidden - insufficient permissions for patient data access',
    }),
    openapi.ApiResponse({ status: 200, type: [Object] }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [get_vitals_query_dto_1.GetVitalsQueryDto]),
    __metadata("design:returntype", Promise)
], HealthMetricsController.prototype, "getLiveVitals", null);
__decorate([
    (0, common_1.Get)('patients/:id/trends'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get patient health trends analysis',
        description: "Retrieves trending data for a specific patient's health metrics over time. Used for medical analysis, treatment effectiveness evaluation, and long-term health monitoring. Supports customizable time ranges and metric granularity.",
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        type: 'string',
        description: 'Patient ID for trend analysis',
        example: '123',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'metrics',
        required: false,
        type: String,
        description: 'Comma-separated list of metrics to include in trends (heartRate,bloodPressure,temperature,etc.)',
        example: 'heartRate,bloodPressure,temperature',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'timeRange',
        required: false,
        type: String,
        description: 'Time range for trend analysis (1h, 4h, 24h, 7d, 30d)',
        example: '24h',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'granularity',
        required: false,
        type: String,
        description: 'Data point granularity (minute, hour, day)',
        example: 'hour',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Patient health trends retrieved successfully',
        schema: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    timestamp: {
                        type: 'string',
                        format: 'date-time',
                        example: '2024-01-15T09:00:00Z',
                    },
                    metrics: {
                        type: 'object',
                        properties: {
                            heartRate: {
                                type: 'number',
                                example: 72,
                                description: 'Average heart rate for time period',
                            },
                            bloodPressure: {
                                type: 'object',
                                properties: {
                                    systolic: { type: 'number', example: 120 },
                                    diastolic: { type: 'number', example: 80 },
                                },
                            },
                            temperature: { type: 'number', example: 98.6 },
                            trend: {
                                type: 'string',
                                enum: ['improving', 'stable', 'declining'],
                                example: 'stable',
                            },
                        },
                    },
                    annotations: {
                        type: 'array',
                        items: {
                            type: 'object',
                            properties: {
                                type: { type: 'string', example: 'medication' },
                                note: {
                                    type: 'string',
                                    example: 'Blood pressure medication administered',
                                },
                                timestamp: { type: 'string', format: 'date-time' },
                            },
                        },
                    },
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized - authentication required',
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Forbidden - insufficient permissions for patient data access',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Patient not found',
    }),
    openapi.ApiResponse({ status: 200, type: [Object] }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, get_trends_query_dto_1.GetTrendsQueryDto]),
    __metadata("design:returntype", Promise)
], HealthMetricsController.prototype, "getPatientTrends", null);
__decorate([
    (0, common_1.Get)('departments/performance'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get department performance metrics',
        description: 'Retrieves comprehensive performance metrics for healthcare departments. Includes patient volume, response times, critical incident rates, and staff efficiency metrics. Used for administrative oversight and quality improvement initiatives.',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'timeRange',
        required: false,
        type: String,
        description: 'Time range for performance analysis (1h, 4h, 24h, 7d, 30d). Defaults to 24h',
        example: '24h',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'includeHistorical',
        required: false,
        type: Boolean,
        description: 'Include historical comparison data for trend analysis',
        example: true,
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Department performance metrics retrieved successfully',
        schema: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    departmentId: { type: 'string', example: 'ICU' },
                    departmentName: { type: 'string', example: 'Intensive Care Unit' },
                    metrics: {
                        type: 'object',
                        properties: {
                            patientVolume: {
                                type: 'number',
                                example: 45,
                                description: 'Total patients in timeframe',
                            },
                            averageStayDuration: {
                                type: 'number',
                                example: 2.5,
                                description: 'Average stay in hours',
                            },
                            criticalIncidents: {
                                type: 'number',
                                example: 3,
                                description: 'Number of critical incidents',
                            },
                            responseTime: {
                                type: 'object',
                                properties: {
                                    average: {
                                        type: 'number',
                                        example: 4.2,
                                        description: 'Average response time in minutes',
                                    },
                                    p95: {
                                        type: 'number',
                                        example: 8.5,
                                        description: '95th percentile response time',
                                    },
                                },
                            },
                            staffUtilization: {
                                type: 'number',
                                example: 85.5,
                                description: 'Staff utilization percentage',
                            },
                        },
                    },
                    alerts: {
                        type: 'object',
                        properties: {
                            active: {
                                type: 'number',
                                example: 2,
                                description: 'Active alerts count',
                            },
                            resolved: {
                                type: 'number',
                                example: 8,
                                description: 'Resolved alerts in timeframe',
                            },
                        },
                    },
                    comparison: {
                        type: 'object',
                        properties: {
                            previousPeriod: {
                                type: 'number',
                                example: -5.2,
                                description: 'Percentage change from previous period',
                            },
                            trend: {
                                type: 'string',
                                enum: ['improving', 'stable', 'declining'],
                                example: 'improving',
                            },
                        },
                    },
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized - authentication required',
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Forbidden - insufficient permissions for department metrics access',
    }),
    openapi.ApiResponse({ status: 200, type: [Object] }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [get_department_query_dto_1.GetDepartmentQueryDto]),
    __metadata("design:returntype", Promise)
], HealthMetricsController.prototype, "getDepartmentPerformance", null);
__decorate([
    (0, common_1.Post)('vitals'),
    (0, swagger_1.ApiOperation)({
        summary: 'Record new vital signs',
        description: 'Records new vital signs measurement for a patient. Includes automatic alert generation for critical values and integration with patient monitoring systems. Supports batch recording for multiple measurements.',
    }),
    (0, swagger_1.ApiBody)({
        type: create_vitals_dto_1.CreateVitalsDto,
        description: 'Vital signs data to record',
        schema: {
            type: 'object',
            required: ['patientId', 'vitals', 'recordedBy'],
            properties: {
                patientId: {
                    type: 'number',
                    example: 123,
                    description: 'Patient identifier',
                },
                vitals: {
                    type: 'object',
                    properties: {
                        heartRate: {
                            type: 'number',
                            example: 72,
                            description: 'Heart rate in BPM',
                        },
                        bloodPressure: {
                            type: 'object',
                            properties: {
                                systolic: { type: 'number', example: 120 },
                                diastolic: { type: 'number', example: 80 },
                            },
                        },
                        temperature: {
                            type: 'number',
                            example: 98.6,
                            description: 'Temperature in Fahrenheit',
                        },
                        oxygenSaturation: {
                            type: 'number',
                            example: 98,
                            description: 'SpO2 percentage',
                        },
                        respiratoryRate: {
                            type: 'number',
                            example: 16,
                            description: 'Breaths per minute',
                        },
                    },
                },
                recordedBy: {
                    type: 'string',
                    example: 'nurse_123',
                    description: 'ID of recording healthcare provider',
                },
                notes: {
                    type: 'string',
                    example: 'Patient resting, stable condition',
                    description: 'Optional notes about the measurement',
                },
                location: {
                    type: 'string',
                    example: 'ICU-Room-205',
                    description: 'Location where vitals were taken',
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Vital signs recorded successfully',
        schema: {
            type: 'object',
            properties: {
                id: {
                    type: 'number',
                    example: 456,
                    description: 'Unique ID of the vital signs record',
                },
                patientId: { type: 'number', example: 123 },
                timestamp: {
                    type: 'string',
                    format: 'date-time',
                    example: '2024-01-15T09:30:00Z',
                },
                vitals: { type: 'object', description: 'Recorded vital signs data' },
                alerts: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            type: { type: 'string', example: 'high_blood_pressure' },
                            severity: {
                                type: 'string',
                                enum: ['low', 'medium', 'high', 'critical'],
                                example: 'medium',
                            },
                            message: {
                                type: 'string',
                                example: 'Blood pressure slightly elevated',
                            },
                        },
                    },
                },
                recordedBy: { type: 'string', example: 'nurse_123' },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Bad Request - invalid vital signs data or missing required fields',
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized - authentication required',
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Forbidden - insufficient permissions to record vital signs',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Patient not found',
    }),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_vitals_dto_1.CreateVitalsDto]),
    __metadata("design:returntype", Promise)
], HealthMetricsController.prototype, "recordVitals", null);
__decorate([
    (0, common_1.Get)('alerts'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get health alerts',
        description: 'Retrieves active and historical health alerts based on vital signs monitoring. Includes filtering by severity, department, and status. Critical for early warning systems and patient safety monitoring.',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'severity',
        required: false,
        type: String,
        description: 'Filter by alert severity level',
        enum: ['low', 'medium', 'high', 'critical'],
        example: 'high',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'department',
        required: false,
        type: String,
        description: 'Filter by department code',
        example: 'ICU',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'status',
        required: false,
        type: String,
        description: 'Filter by alert status',
        enum: ['active', 'acknowledged', 'resolved'],
        example: 'active',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'limit',
        required: false,
        type: Number,
        description: 'Maximum number of alerts to return',
        example: 20,
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Health alerts retrieved successfully',
        type: 'HealthAlert',
        isArray: true,
        schema: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    id: {
                        type: 'number',
                        example: 789,
                        description: 'Alert unique identifier',
                    },
                    patientId: { type: 'number', example: 123 },
                    type: {
                        type: 'string',
                        example: 'vital_signs_critical',
                        description: 'Type of health alert',
                    },
                    severity: {
                        type: 'string',
                        enum: ['low', 'medium', 'high', 'critical'],
                        example: 'high',
                    },
                    message: {
                        type: 'string',
                        example: 'Heart rate critically high: 140 BPM',
                    },
                    department: { type: 'string', example: 'ICU' },
                    status: {
                        type: 'string',
                        enum: ['active', 'acknowledged', 'resolved'],
                        example: 'active',
                    },
                    triggeredBy: {
                        type: 'object',
                        properties: {
                            metric: { type: 'string', example: 'heart_rate' },
                            value: { type: 'number', example: 140 },
                            threshold: { type: 'number', example: 120 },
                        },
                    },
                    timestamps: {
                        type: 'object',
                        properties: {
                            created: {
                                type: 'string',
                                format: 'date-time',
                                example: '2024-01-15T09:30:00Z',
                            },
                            acknowledged: {
                                type: 'string',
                                format: 'date-time',
                                nullable: true,
                            },
                            resolved: { type: 'string', format: 'date-time', nullable: true },
                        },
                    },
                    assignedTo: {
                        type: 'string',
                        example: 'nurse_456',
                        description: 'Healthcare provider assigned to handle alert',
                    },
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized - authentication required',
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Forbidden - insufficient permissions for health alerts access',
    }),
    openapi.ApiResponse({ status: 200, type: [Object] }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [get_alerts_query_dto_1.GetAlertsQueryDto]),
    __metadata("design:returntype", Promise)
], HealthMetricsController.prototype, "getHealthAlerts", null);
__decorate([
    (0, common_1.Patch)('alerts/:id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Update health alert status',
        description: 'Updates the status of a health alert (acknowledge, resolve, or reassign). Includes audit trail for compliance and enables proper alert lifecycle management in critical care scenarios.',
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        type: 'string',
        description: 'Health alert ID to update',
        example: '789',
    }),
    (0, swagger_1.ApiBody)({
        type: update_alert_dto_1.UpdateAlertDto,
        description: 'Alert status update data',
        schema: {
            type: 'object',
            properties: {
                status: {
                    type: 'string',
                    enum: ['active', 'acknowledged', 'resolved'],
                    example: 'acknowledged',
                    description: 'New status for the alert',
                },
                assignedTo: {
                    type: 'string',
                    example: 'nurse_456',
                    description: 'Healthcare provider to assign alert to',
                },
                notes: {
                    type: 'string',
                    example: 'Patient responded well to intervention',
                    description: 'Optional notes about the status change',
                },
                resolution: {
                    type: 'string',
                    example: 'Medication adjusted, vitals stabilized',
                    description: 'Resolution details (required when status is resolved)',
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Alert status updated successfully',
        schema: {
            type: 'object',
            properties: {
                id: { type: 'number', example: 789 },
                status: { type: 'string', example: 'acknowledged' },
                updatedBy: { type: 'string', example: 'nurse_456' },
                updatedAt: {
                    type: 'string',
                    format: 'date-time',
                    example: '2024-01-15T09:35:00Z',
                },
                auditTrail: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            action: { type: 'string', example: 'status_change' },
                            from: { type: 'string', example: 'active' },
                            to: { type: 'string', example: 'acknowledged' },
                            timestamp: { type: 'string', format: 'date-time' },
                            performedBy: { type: 'string', example: 'nurse_456' },
                        },
                    },
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Bad Request - invalid status transition or missing required fields',
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized - authentication required',
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Forbidden - insufficient permissions to update alerts',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Alert not found',
    }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_alert_dto_1.UpdateAlertDto]),
    __metadata("design:returntype", Promise)
], HealthMetricsController.prototype, "updateAlertStatus", null);
exports.HealthMetricsController = HealthMetricsController = __decorate([
    (0, swagger_1.ApiTags)('Health Metrics'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('health-metrics'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true })),
    __metadata("design:paramtypes", [health_metrics_service_1.HealthMetricsService])
], HealthMetricsController);
//# sourceMappingURL=health-metrics.controller.js.map