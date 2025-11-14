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
exports.IncidentCoreController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const incident_read_service_1 = require("../services/incident-read.service");
const incident_write_service_1 = require("../services/incident-write.service");
const create_incident_report_dto_1 = require("../dto/create-incident-report.dto");
const incident_filters_dto_1 = require("../dto/incident-filters.dto");
const update_incident_report_dto_1 = require("../dto/update-incident-report.dto");
const base_1 = require("../../common/base");
let IncidentCoreController = class IncidentCoreController extends base_1.BaseController {
    readService;
    writeService;
    constructor(readService, writeService) {
        super();
        this.readService = readService;
        this.writeService = writeService;
    }
    async getIncidentReports(filters) {
        return this.readService.getIncidentReports(filters);
    }
    async getIncidentReportById(id) {
        return this.readService.getIncidentReportById(id);
    }
    async createIncidentReport(dto) {
        return this.writeService.createIncidentReport(dto);
    }
    async updateIncidentReport(id, dto) {
        return this.writeService.updateIncidentReport(id, dto);
    }
};
exports.IncidentCoreController = IncidentCoreController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Get all incident reports with filters',
        description: 'Retrieves paginated incident reports with comprehensive filtering by type, severity, status, date range, student, and location.',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'page',
        required: false,
        type: Number,
        description: 'Page number (default: 1)',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'limit',
        required: false,
        type: Number,
        description: 'Items per page (default: 20)',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'studentId',
        required: false,
        type: String,
        description: 'Filter by student ID',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'reportedById',
        required: false,
        type: String,
        description: 'Filter by reporter ID',
    }),
    (0, swagger_1.ApiQuery)({ name: 'type', required: false, type: String, description: 'Filter by incident type' }),
    (0, swagger_1.ApiQuery)({ name: 'severity', required: false, type: String, description: 'Filter by severity' }),
    (0, swagger_1.ApiQuery)({
        name: 'dateFrom',
        required: false,
        type: String,
        description: 'Filter from date (ISO string)',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'dateTo',
        required: false,
        type: String,
        description: 'Filter to date (ISO string)',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Incident reports retrieved successfully',
        schema: {
            type: 'object',
            properties: {
                data: { type: 'array', items: { $ref: '#/components/schemas/IncidentReport' } },
                pagination: {
                    type: 'object',
                    properties: {
                        page: { type: 'number' },
                        limit: { type: 'number' },
                        total: { type: 'number' },
                        totalPages: { type: 'number' },
                        hasNext: { type: 'boolean' },
                        hasPrev: { type: 'boolean' },
                    },
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid filters provided' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [incident_filters_dto_1.IncidentFiltersDto]),
    __metadata("design:returntype", Promise)
], IncidentCoreController.prototype, "getIncidentReports", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get incident report by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string', format: 'uuid' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Incident report retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Incident report not found' }),
    openapi.ApiResponse({ status: 200, type: require("../../database/models/incident-report.model").IncidentReport }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], IncidentCoreController.prototype, "getIncidentReportById", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Create new incident report',
        description: 'Creates a new incident report with validation and automatic notifications',
    }),
    (0, swagger_1.ApiBody)({ type: create_incident_report_dto_1.CreateIncidentReportDto }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Incident report created successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid incident report data' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Internal server error' }),
    openapi.ApiResponse({ status: 201, type: require("../../database/models/incident-report.model").IncidentReport }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_incident_report_dto_1.CreateIncidentReportDto]),
    __metadata("design:returntype", Promise)
], IncidentCoreController.prototype, "createIncidentReport", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Update incident report',
        description: 'Updates an existing incident report with validation',
    }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string', format: 'uuid' }),
    (0, swagger_1.ApiBody)({ type: update_incident_report_dto_1.UpdateIncidentReportDto }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Incident report updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Incident report not found' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid update data' }),
    openapi.ApiResponse({ status: 200, type: require("../../database/models/incident-report.model").IncidentReport }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_incident_report_dto_1.UpdateIncidentReportDto]),
    __metadata("design:returntype", Promise)
], IncidentCoreController.prototype, "updateIncidentReport", null);
exports.IncidentCoreController = IncidentCoreController = __decorate([
    (0, swagger_1.ApiTags)('incident-reports-core'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('incident-reports'),
    __metadata("design:paramtypes", [incident_read_service_1.IncidentReadService,
        incident_write_service_1.IncidentWriteService])
], IncidentCoreController);
//# sourceMappingURL=incident-core.controller.js.map