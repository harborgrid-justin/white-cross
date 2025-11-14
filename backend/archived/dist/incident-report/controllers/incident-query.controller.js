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
exports.IncidentQueryController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const incident_read_service_1 = require("../services/incident-read.service");
const incident_statistics_service_1 = require("../services/incident-statistics.service");
const base_1 = require("../../common/base");
let IncidentQueryController = class IncidentQueryController extends base_1.BaseController {
    readService;
    statisticsService;
    constructor(readService, statisticsService) {
        super();
        this.readService = readService;
        this.statisticsService = statisticsService;
    }
    async getIncidentsRequiringFollowUp() {
        return this.readService.getIncidentsRequiringFollowUp();
    }
    async getStudentRecentIncidents(studentId, limit) {
        const limitNum = limit ? parseInt(limit.toString()) : 10;
        return this.readService.getStudentRecentIncidents(studentId, limitNum);
    }
    async getStatistics(dateFrom, dateTo, studentId) {
        return await this.statisticsService.getIncidentStatistics(dateFrom ? new Date(dateFrom) : undefined, dateTo ? new Date(dateTo) : undefined, studentId);
    }
    async getIncidentsByType(dateFrom, dateTo) {
        return await this.statisticsService.getIncidentsByType(dateFrom ? new Date(dateFrom) : undefined, dateTo ? new Date(dateTo) : undefined);
    }
    async getIncidentsBySeverity(dateFrom, dateTo) {
        return await this.statisticsService.getIncidentsBySeverity(dateFrom ? new Date(dateFrom) : undefined, dateTo ? new Date(dateTo) : undefined);
    }
    async getSeverityTrends(dateFrom, dateTo) {
        return await this.statisticsService.getSeverityTrends(new Date(dateFrom), new Date(dateTo));
    }
};
exports.IncidentQueryController = IncidentQueryController;
__decorate([
    (0, common_1.Get)('follow-up/required'),
    (0, swagger_1.ApiOperation)({ summary: 'Get incidents requiring follow-up' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns incidents requiring follow-up' }),
    openapi.ApiResponse({ status: 200, type: [require("../../database/models/incident-report.model").IncidentReport] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], IncidentQueryController.prototype, "getIncidentsRequiringFollowUp", null);
__decorate([
    (0, common_1.Get)('student/:studentId/recent'),
    (0, swagger_1.ApiOperation)({ summary: 'Get recent incidents for a student' }),
    (0, swagger_1.ApiParam)({ name: 'studentId', type: 'string', format: 'uuid' }),
    (0, swagger_1.ApiQuery)({
        name: 'limit',
        required: false,
        type: Number,
        description: 'Maximum number of incidents to return (default: 10)',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns recent incidents for the student' }),
    openapi.ApiResponse({ status: 200, type: [require("../../database/models/incident-report.model").IncidentReport] }),
    __param(0, (0, common_1.Param)('studentId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], IncidentQueryController.prototype, "getStudentRecentIncidents", null);
__decorate([
    (0, common_1.Get)('statistics'),
    (0, swagger_1.ApiOperation)({ summary: 'Get incident statistics' }),
    (0, swagger_1.ApiQuery)({
        name: 'dateFrom',
        required: false,
        type: String,
        description: 'Start date for statistics (ISO string)',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'dateTo',
        required: false,
        type: String,
        description: 'End date for statistics (ISO string)',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'studentId',
        required: false,
        type: String,
        description: 'Filter by student ID',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns incident statistics' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)('dateFrom')),
    __param(1, (0, common_1.Query)('dateTo')),
    __param(2, (0, common_1.Query)('studentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], IncidentQueryController.prototype, "getStatistics", null);
__decorate([
    (0, common_1.Get)('by-type'),
    (0, swagger_1.ApiOperation)({ summary: 'Get incident counts by type' }),
    (0, swagger_1.ApiQuery)({
        name: 'dateFrom',
        required: false,
        type: String,
        description: 'Start date filter (ISO string)',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'dateTo',
        required: false,
        type: String,
        description: 'End date filter (ISO string)',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns incident counts grouped by type' }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Query)('dateFrom')),
    __param(1, (0, common_1.Query)('dateTo')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], IncidentQueryController.prototype, "getIncidentsByType", null);
__decorate([
    (0, common_1.Get)('by-severity'),
    (0, swagger_1.ApiOperation)({ summary: 'Get incident counts by severity' }),
    (0, swagger_1.ApiQuery)({
        name: 'dateFrom',
        required: false,
        type: String,
        description: 'Start date filter (ISO string)',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'dateTo',
        required: false,
        type: String,
        description: 'End date filter (ISO string)',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns incident counts grouped by severity' }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Query)('dateFrom')),
    __param(1, (0, common_1.Query)('dateTo')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], IncidentQueryController.prototype, "getIncidentsBySeverity", null);
__decorate([
    (0, common_1.Get)('severity-trends'),
    (0, swagger_1.ApiOperation)({ summary: 'Get severity trends over time' }),
    (0, swagger_1.ApiQuery)({
        name: 'dateFrom',
        required: true,
        type: String,
        description: 'Start date for trends (ISO string)',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'dateTo',
        required: true,
        type: String,
        description: 'End date for trends (ISO string)',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns severity trends data' }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Query)('dateFrom')),
    __param(1, (0, common_1.Query)('dateTo')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], IncidentQueryController.prototype, "getSeverityTrends", null);
exports.IncidentQueryController = IncidentQueryController = __decorate([
    (0, swagger_1.ApiTags)('incident-reports-query'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('incident-reports'),
    __metadata("design:paramtypes", [incident_read_service_1.IncidentReadService,
        incident_statistics_service_1.IncidentStatisticsService])
], IncidentQueryController);
//# sourceMappingURL=incident-query.controller.js.map