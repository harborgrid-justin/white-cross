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
exports.IncidentReportController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../services/auth/guards/jwt-auth.guard");
const incident_core_service_1 = require("./services/incident-core.service");
const incident_follow_up_service_1 = require("./services/incident-follow-up.service");
const incident_notification_service_1 = require("./services/incident-notification.service");
const incident_statistics_service_1 = require("./services/incident-statistics.service");
const incident_witness_service_1 = require("./services/incident-witness.service");
const create_follow_up_action_dto_1 = require("./dto/create-follow-up-action.dto");
const create_incident_report_dto_1 = require("./dto/create-incident-report.dto");
const create_witness_statement_dto_1 = require("./dto/create-witness-statement.dto");
const incident_filters_dto_1 = require("./dto/incident-filters.dto");
const update_follow_up_action_dto_1 = require("./dto/update-follow-up-action.dto");
const update_incident_report_dto_1 = require("./dto/update-incident-report.dto");
const base_1 = require("../common/base");
let IncidentReportController = class IncidentReportController extends base_1.BaseController {
    coreService;
    followUpService;
    witnessService;
    statisticsService;
    notificationService;
    constructor(coreService, followUpService, witnessService, statisticsService, notificationService) {
        super();
        this.coreService = coreService;
        this.followUpService = followUpService;
        this.witnessService = witnessService;
        this.statisticsService = statisticsService;
        this.notificationService = notificationService;
    }
    async getIncidentReports(filters) {
        return this.coreService.getIncidentReports(filters);
    }
    async getIncidentsRequiringFollowUp() {
        return this.coreService.getIncidentsRequiringFollowUp();
    }
    async getStudentRecentIncidents(studentId, limit) {
        return this.coreService.getStudentRecentIncidents(studentId, limit ? parseInt(limit.toString()) : 5);
    }
    async getStatistics(dateFrom, dateTo, studentId) {
        return this.statisticsService.getIncidentStatistics(dateFrom ? new Date(dateFrom) : undefined, dateTo ? new Date(dateTo) : undefined, studentId);
    }
    async getIncidentsByType(dateFrom, dateTo) {
        return this.statisticsService.getIncidentsByType(dateFrom ? new Date(dateFrom) : undefined, dateTo ? new Date(dateTo) : undefined);
    }
    async getIncidentsBySeverity(dateFrom, dateTo) {
        return this.statisticsService.getIncidentsBySeverity(dateFrom ? new Date(dateFrom) : undefined, dateTo ? new Date(dateTo) : undefined);
    }
    async getSeverityTrends(dateFrom, dateTo) {
        return this.statisticsService.getSeverityTrends(new Date(dateFrom), new Date(dateTo));
    }
    async getIncidentReportById(id) {
        return this.coreService.getIncidentReportById(id);
    }
    async createIncidentReport(dto) {
        return this.coreService.createIncidentReport(dto);
    }
    async updateIncidentReport(id, dto) {
        return this.coreService.updateIncidentReport(id, dto);
    }
    async addFollowUpNotes(id, notes, completedBy) {
        return this.coreService.addFollowUpNotes(id, notes, completedBy);
    }
    async markParentNotified(id, method, notifiedBy) {
        return this.coreService.markParentNotified(id, method, notifiedBy);
    }
    async addEvidence(id, evidenceType, evidenceUrls) {
        return this.coreService.addEvidence(id, evidenceType, evidenceUrls);
    }
    async updateInsuranceClaim(id, claimNumber, status) {
        return this.coreService.updateInsuranceClaim(id, claimNumber, status);
    }
    async updateComplianceStatus(id, status) {
        return this.coreService.updateComplianceStatus(id, status);
    }
    async notifyEmergencyContacts(id) {
        return this.notificationService.notifyEmergencyContacts(id);
    }
    async notifyParent(id, method, notifiedBy) {
        return this.notificationService.notifyParent(id, method, notifiedBy);
    }
    async getFollowUpActions(id) {
        return this.followUpService.getFollowUpActions(id);
    }
    async addFollowUpAction(id, dto) {
        return this.followUpService.addFollowUpAction(id, dto);
    }
    async updateFollowUpAction(actionId, dto) {
        return this.followUpService.updateFollowUpAction(actionId, dto);
    }
    async deleteFollowUpAction(actionId) {
        return this.followUpService.deleteFollowUpAction(actionId);
    }
    async getOverdueActions() {
        return this.followUpService.getOverdueActions();
    }
    async getUrgentActions() {
        return this.followUpService.getUrgentActions();
    }
    async getUserPendingActions(userId) {
        return this.followUpService.getUserPendingActions(userId);
    }
    async getFollowUpStatistics(dateFrom, dateTo) {
        return this.followUpService.getFollowUpStatistics(dateFrom ? new Date(dateFrom) : undefined, dateTo ? new Date(dateTo) : undefined);
    }
    async getWitnessStatements(id) {
        return this.witnessService.getWitnessStatements(id);
    }
    async addWitnessStatement(id, dto) {
        return this.witnessService.addWitnessStatement(id, dto);
    }
    async updateWitnessStatement(statementId, data) {
        return this.witnessService.updateWitnessStatement(statementId, data);
    }
    async verifyWitnessStatement(statementId, verifiedBy) {
        return this.witnessService.verifyWitnessStatement(statementId, verifiedBy);
    }
    async deleteWitnessStatement(statementId) {
        return this.witnessService.deleteWitnessStatement(statementId);
    }
    async getUnverifiedStatements() {
        return this.witnessService.getUnverifiedStatements();
    }
};
exports.IncidentReportController = IncidentReportController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Get all incident reports with filters',
        description: 'Retrieves paginated incident reports with comprehensive filtering by type, severity, status, date range, student, and location. Includes summary statistics and trends.',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'page',
        required: false,
        type: 'number',
        example: 1,
        description: 'Page number for pagination',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'limit',
        required: false,
        type: 'number',
        example: 20,
        description: 'Items per page',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'type',
        required: false,
        description: 'Filter by incident type (injury, illness, behavioral, etc.)',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'severity',
        required: false,
        enum: ['low', 'medium', 'high', 'critical'],
        description: 'Filter by severity level',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'status',
        required: false,
        description: 'Filter by incident status',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'studentId',
        required: false,
        format: 'uuid',
        description: 'Filter by student UUID',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'dateFrom',
        required: false,
        format: 'date',
        description: 'Filter incidents from this date',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'dateTo',
        required: false,
        format: 'date',
        description: 'Filter incidents up to this date',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Incident reports retrieved successfully with pagination and filters applied',
        schema: {
            type: 'object',
            properties: {
                incidents: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            id: { type: 'string', format: 'uuid' },
                            incidentNumber: { type: 'string' },
                            type: { type: 'string' },
                            severity: { type: 'string' },
                            status: { type: 'string' },
                            studentId: { type: 'string', format: 'uuid' },
                            location: { type: 'string' },
                            incidentDate: { type: 'string', format: 'date-time' },
                            reportedBy: { type: 'string' },
                            requiresFollowUp: { type: 'boolean' },
                        },
                    },
                },
                pagination: {
                    type: 'object',
                    properties: {
                        page: { type: 'number' },
                        limit: { type: 'number' },
                        total: { type: 'number' },
                        pages: { type: 'number' },
                    },
                },
                summary: {
                    type: 'object',
                    properties: {
                        totalIncidents: { type: 'number' },
                        criticalCount: { type: 'number' },
                        pendingFollowUp: { type: 'number' },
                    },
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized - Authentication required',
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Forbidden - Insufficient permissions',
    }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Internal server error' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [incident_filters_dto_1.IncidentFiltersDto]),
    __metadata("design:returntype", Promise)
], IncidentReportController.prototype, "getIncidentReports", null);
__decorate([
    (0, common_1.Get)('follow-up/required'),
    (0, swagger_1.ApiOperation)({ summary: 'Get incidents requiring follow-up' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Returns incidents requiring follow-up',
    }),
    openapi.ApiResponse({ status: 200, type: [require("../database/models/incident-report.model").IncidentReport] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], IncidentReportController.prototype, "getIncidentsRequiringFollowUp", null);
__decorate([
    (0, common_1.Get)('student/:studentId/recent'),
    (0, swagger_1.ApiOperation)({ summary: 'Get recent incidents for a student' }),
    (0, swagger_1.ApiParam)({ name: 'studentId', type: 'string', format: 'uuid' }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: 'number', example: 5 }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns recent student incidents' }),
    openapi.ApiResponse({ status: 200, type: [require("../database/models/incident-report.model").IncidentReport] }),
    __param(0, (0, common_1.Param)('studentId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], IncidentReportController.prototype, "getStudentRecentIncidents", null);
__decorate([
    (0, common_1.Get)('statistics'),
    (0, swagger_1.ApiOperation)({ summary: 'Get incident statistics' }),
    (0, swagger_1.ApiQuery)({ name: 'dateFrom', required: false, type: 'string' }),
    (0, swagger_1.ApiQuery)({ name: 'dateTo', required: false, type: 'string' }),
    (0, swagger_1.ApiQuery)({ name: 'studentId', required: false, type: 'string' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns incident statistics' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)('dateFrom')),
    __param(1, (0, common_1.Query)('dateTo')),
    __param(2, (0, common_1.Query)('studentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], IncidentReportController.prototype, "getStatistics", null);
__decorate([
    (0, common_1.Get)('statistics/by-type'),
    (0, swagger_1.ApiOperation)({ summary: 'Get incidents grouped by type' }),
    (0, swagger_1.ApiQuery)({ name: 'dateFrom', required: false, type: 'string' }),
    (0, swagger_1.ApiQuery)({ name: 'dateTo', required: false, type: 'string' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns incidents by type' }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Query)('dateFrom')),
    __param(1, (0, common_1.Query)('dateTo')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], IncidentReportController.prototype, "getIncidentsByType", null);
__decorate([
    (0, common_1.Get)('statistics/by-severity'),
    (0, swagger_1.ApiOperation)({ summary: 'Get incidents grouped by severity' }),
    (0, swagger_1.ApiQuery)({ name: 'dateFrom', required: false, type: 'string' }),
    (0, swagger_1.ApiQuery)({ name: 'dateTo', required: false, type: 'string' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns incidents by severity' }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Query)('dateFrom')),
    __param(1, (0, common_1.Query)('dateTo')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], IncidentReportController.prototype, "getIncidentsBySeverity", null);
__decorate([
    (0, common_1.Get)('statistics/severity-trends'),
    (0, swagger_1.ApiOperation)({ summary: 'Get severity trends over time' }),
    (0, swagger_1.ApiQuery)({ name: 'dateFrom', required: true, type: 'string' }),
    (0, swagger_1.ApiQuery)({ name: 'dateTo', required: true, type: 'string' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns severity trends' }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Query)('dateFrom')),
    __param(1, (0, common_1.Query)('dateTo')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], IncidentReportController.prototype, "getSeverityTrends", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get incident report by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string', format: 'uuid' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns incident report' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Incident report not found' }),
    openapi.ApiResponse({ status: 200, type: require("../database/models/incident-report.model").IncidentReport }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], IncidentReportController.prototype, "getIncidentReportById", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Create new incident report',
        description: 'Creates a comprehensive incident report with detailed information including student involvement, injuries, treatments, witnesses, and immediate actions taken. Triggers notification workflows based on severity.',
    }),
    (0, swagger_1.ApiBody)({ type: create_incident_report_dto_1.CreateIncidentReportDto }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Incident report created successfully with auto-generated incident number',
        schema: {
            type: 'object',
            properties: {
                id: { type: 'string', format: 'uuid' },
                incidentNumber: { type: 'string', example: 'INC-2024-001234' },
                type: { type: 'string' },
                severity: { type: 'string' },
                status: { type: 'string', example: 'open' },
                studentId: { type: 'string', format: 'uuid' },
                incidentDate: { type: 'string', format: 'date-time' },
                location: { type: 'string' },
                reportedBy: { type: 'string' },
                reportedAt: { type: 'string', format: 'date-time' },
                requiresFollowUp: { type: 'boolean' },
                notificationsTriggered: {
                    type: 'array',
                    items: { type: 'string' },
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Invalid input data or validation errors',
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized - Authentication required',
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Forbidden - Insufficient permissions to create incident reports',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Referenced student or user not found',
    }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Internal server error' }),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    openapi.ApiResponse({ status: common_1.HttpStatus.CREATED, type: require("../database/models/incident-report.model").IncidentReport }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_incident_report_dto_1.CreateIncidentReportDto]),
    __metadata("design:returntype", Promise)
], IncidentReportController.prototype, "createIncidentReport", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update incident report' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string', format: 'uuid' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Incident report updated successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Incident report not found' }),
    openapi.ApiResponse({ status: 200, type: require("../database/models/incident-report.model").IncidentReport }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_incident_report_dto_1.UpdateIncidentReportDto]),
    __metadata("design:returntype", Promise)
], IncidentReportController.prototype, "updateIncidentReport", null);
__decorate([
    (0, common_1.Post)(':id/follow-up-notes'),
    (0, swagger_1.ApiOperation)({ summary: 'Add follow-up notes to incident' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string', format: 'uuid' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Follow-up notes added successfully',
    }),
    openapi.ApiResponse({ status: 201, type: require("../database/models/incident-report.model").IncidentReport }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)('notes')),
    __param(2, (0, common_1.Body)('completedBy')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], IncidentReportController.prototype, "addFollowUpNotes", null);
__decorate([
    (0, common_1.Post)(':id/parent-notified'),
    (0, swagger_1.ApiOperation)({ summary: 'Mark parent as notified' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string', format: 'uuid' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Parent marked as notified' }),
    openapi.ApiResponse({ status: 201, type: require("../database/models/incident-report.model").IncidentReport }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)('method')),
    __param(2, (0, common_1.Body)('notifiedBy')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], IncidentReportController.prototype, "markParentNotified", null);
__decorate([
    (0, common_1.Post)(':id/evidence'),
    (0, swagger_1.ApiOperation)({ summary: 'Add evidence to incident report' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string', format: 'uuid' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Evidence added successfully' }),
    openapi.ApiResponse({ status: 201, type: require("../database/models/incident-report.model").IncidentReport }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)('evidenceType')),
    __param(2, (0, common_1.Body)('evidenceUrls')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Array]),
    __metadata("design:returntype", Promise)
], IncidentReportController.prototype, "addEvidence", null);
__decorate([
    (0, common_1.Patch)(':id/insurance'),
    (0, swagger_1.ApiOperation)({ summary: 'Update insurance claim information' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string', format: 'uuid' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Insurance claim updated successfully',
    }),
    openapi.ApiResponse({ status: 200, type: require("../database/models/incident-report.model").IncidentReport }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)('claimNumber')),
    __param(2, (0, common_1.Body)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], IncidentReportController.prototype, "updateInsuranceClaim", null);
__decorate([
    (0, common_1.Patch)(':id/compliance'),
    (0, swagger_1.ApiOperation)({ summary: 'Update compliance status' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string', format: 'uuid' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Compliance status updated successfully',
    }),
    openapi.ApiResponse({ status: 200, type: require("../database/models/incident-report.model").IncidentReport }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], IncidentReportController.prototype, "updateComplianceStatus", null);
__decorate([
    (0, common_1.Post)(':id/notify-emergency'),
    (0, swagger_1.ApiOperation)({ summary: 'Notify emergency contacts for incident' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string', format: 'uuid' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Emergency contacts notified' }),
    openapi.ApiResponse({ status: 201, type: Boolean }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], IncidentReportController.prototype, "notifyEmergencyContacts", null);
__decorate([
    (0, common_1.Post)(':id/notify-parent'),
    (0, swagger_1.ApiOperation)({ summary: 'Send parent notification' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string', format: 'uuid' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Parent notified successfully' }),
    openapi.ApiResponse({ status: 201, type: require("../database/models/incident-report.model").IncidentReport }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)('method')),
    __param(2, (0, common_1.Body)('notifiedBy')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], IncidentReportController.prototype, "notifyParent", null);
__decorate([
    (0, common_1.Get)(':id/follow-up-actions'),
    (0, swagger_1.ApiOperation)({ summary: 'Get follow-up actions for incident' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string', format: 'uuid' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns follow-up actions' }),
    openapi.ApiResponse({ status: 200, type: [require("../database/models/follow-up-action.model").FollowUpAction] }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], IncidentReportController.prototype, "getFollowUpActions", null);
__decorate([
    (0, common_1.Post)(':id/follow-up-action'),
    (0, swagger_1.ApiOperation)({ summary: 'Add follow-up action to incident' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string', format: 'uuid' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Follow-up action created successfully',
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    openapi.ApiResponse({ status: common_1.HttpStatus.CREATED, type: require("../database/models/follow-up-action.model").FollowUpAction }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_follow_up_action_dto_1.CreateFollowUpActionDto]),
    __metadata("design:returntype", Promise)
], IncidentReportController.prototype, "addFollowUpAction", null);
__decorate([
    (0, common_1.Patch)('follow-up-action/:actionId'),
    (0, swagger_1.ApiOperation)({ summary: 'Update follow-up action' }),
    (0, swagger_1.ApiParam)({ name: 'actionId', type: 'string', format: 'uuid' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Follow-up action updated successfully',
    }),
    openapi.ApiResponse({ status: 200, type: require("../database/models/follow-up-action.model").FollowUpAction }),
    __param(0, (0, common_1.Param)('actionId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_follow_up_action_dto_1.UpdateFollowUpActionDto]),
    __metadata("design:returntype", Promise)
], IncidentReportController.prototype, "updateFollowUpAction", null);
__decorate([
    (0, common_1.Delete)('follow-up-action/:actionId'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete follow-up action' }),
    (0, swagger_1.ApiParam)({ name: 'actionId', type: 'string', format: 'uuid' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Follow-up action deleted successfully',
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    openapi.ApiResponse({ status: common_1.HttpStatus.OK, type: Boolean }),
    __param(0, (0, common_1.Param)('actionId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], IncidentReportController.prototype, "deleteFollowUpAction", null);
__decorate([
    (0, common_1.Get)('follow-up-actions/overdue'),
    (0, swagger_1.ApiOperation)({ summary: 'Get overdue follow-up actions' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Returns overdue follow-up actions',
    }),
    openapi.ApiResponse({ status: 200, type: [require("../database/models/follow-up-action.model").FollowUpAction] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], IncidentReportController.prototype, "getOverdueActions", null);
__decorate([
    (0, common_1.Get)('follow-up-actions/urgent'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get urgent follow-up actions (due within 24 hours)',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns urgent follow-up actions' }),
    openapi.ApiResponse({ status: 200, type: [require("../database/models/follow-up-action.model").FollowUpAction] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], IncidentReportController.prototype, "getUrgentActions", null);
__decorate([
    (0, common_1.Get)('follow-up-actions/user/:userId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get pending follow-up actions for a user' }),
    (0, swagger_1.ApiParam)({ name: 'userId', type: 'string', format: 'uuid' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns user pending actions' }),
    openapi.ApiResponse({ status: 200, type: [require("../database/models/follow-up-action.model").FollowUpAction] }),
    __param(0, (0, common_1.Param)('userId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], IncidentReportController.prototype, "getUserPendingActions", null);
__decorate([
    (0, common_1.Get)('follow-up-actions/statistics'),
    (0, swagger_1.ApiOperation)({ summary: 'Get follow-up action statistics' }),
    (0, swagger_1.ApiQuery)({ name: 'dateFrom', required: false, type: 'string' }),
    (0, swagger_1.ApiQuery)({ name: 'dateTo', required: false, type: 'string' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns follow-up statistics' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)('dateFrom')),
    __param(1, (0, common_1.Query)('dateTo')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], IncidentReportController.prototype, "getFollowUpStatistics", null);
__decorate([
    (0, common_1.Get)(':id/witness-statements'),
    (0, swagger_1.ApiOperation)({ summary: 'Get witness statements for incident' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string', format: 'uuid' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns witness statements' }),
    openapi.ApiResponse({ status: 200, type: [require("../database/models/witness-statement.model").WitnessStatement] }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], IncidentReportController.prototype, "getWitnessStatements", null);
__decorate([
    (0, common_1.Post)(':id/witness-statement'),
    (0, swagger_1.ApiOperation)({ summary: 'Add witness statement to incident' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string', format: 'uuid' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Witness statement created successfully',
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    openapi.ApiResponse({ status: common_1.HttpStatus.CREATED, type: require("../database/models/witness-statement.model").WitnessStatement }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_witness_statement_dto_1.CreateWitnessStatementDto]),
    __metadata("design:returntype", Promise)
], IncidentReportController.prototype, "addWitnessStatement", null);
__decorate([
    (0, common_1.Patch)('witness-statement/:statementId'),
    (0, swagger_1.ApiOperation)({ summary: 'Update witness statement' }),
    (0, swagger_1.ApiParam)({ name: 'statementId', type: 'string', format: 'uuid' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Witness statement updated successfully',
    }),
    openapi.ApiResponse({ status: 200, type: require("../database/models/witness-statement.model").WitnessStatement }),
    __param(0, (0, common_1.Param)('statementId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], IncidentReportController.prototype, "updateWitnessStatement", null);
__decorate([
    (0, common_1.Post)('witness-statement/:statementId/verify'),
    (0, swagger_1.ApiOperation)({ summary: 'Verify witness statement' }),
    (0, swagger_1.ApiParam)({ name: 'statementId', type: 'string', format: 'uuid' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Witness statement verified successfully',
    }),
    openapi.ApiResponse({ status: 201, type: require("../database/models/witness-statement.model").WitnessStatement }),
    __param(0, (0, common_1.Param)('statementId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)('verifiedBy')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], IncidentReportController.prototype, "verifyWitnessStatement", null);
__decorate([
    (0, common_1.Delete)('witness-statement/:statementId'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete witness statement' }),
    (0, swagger_1.ApiParam)({ name: 'statementId', type: 'string', format: 'uuid' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Witness statement deleted successfully',
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    openapi.ApiResponse({ status: common_1.HttpStatus.OK, type: Boolean }),
    __param(0, (0, common_1.Param)('statementId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], IncidentReportController.prototype, "deleteWitnessStatement", null);
__decorate([
    (0, common_1.Get)('witness-statements/unverified'),
    (0, swagger_1.ApiOperation)({ summary: 'Get unverified witness statements' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Returns unverified witness statements',
    }),
    openapi.ApiResponse({ status: 200, type: [require("../database/models/witness-statement.model").WitnessStatement] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], IncidentReportController.prototype, "getUnverifiedStatements", null);
exports.IncidentReportController = IncidentReportController = __decorate([
    (0, swagger_1.ApiTags)('Incident Reports'),
    (0, common_1.Controller)('incident-reports'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [incident_core_service_1.IncidentCoreService,
        incident_follow_up_service_1.IncidentFollowUpService,
        incident_witness_service_1.IncidentWitnessService,
        incident_statistics_service_1.IncidentStatisticsService,
        incident_notification_service_1.IncidentNotificationService])
], IncidentReportController);
//# sourceMappingURL=incident-report.controller.js.map