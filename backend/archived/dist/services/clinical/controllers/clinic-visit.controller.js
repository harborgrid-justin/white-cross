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
exports.ClinicVisitController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const clinic_visit_basic_service_1 = require("../services/clinic-visit-basic.service");
const clinic_visit_analytics_service_1 = require("../services/clinic-visit-analytics.service");
const check_in_dto_1 = require("../dto/visit/check-in.dto");
const check_out_dto_1 = require("../dto/visit/check-out.dto");
const visit_filters_dto_1 = require("../dto/visit/visit-filters.dto");
const base_1 = require("../../../common/base");
let ClinicVisitController = class ClinicVisitController extends base_1.BaseController {
    clinicVisitBasicService;
    clinicVisitAnalyticsService;
    constructor(clinicVisitBasicService, clinicVisitAnalyticsService) {
        super();
        this.clinicVisitBasicService = clinicVisitBasicService;
        this.clinicVisitAnalyticsService = clinicVisitAnalyticsService;
    }
    async checkIn(checkInDto) {
        return this.clinicVisitBasicService.checkIn(checkInDto);
    }
    async checkOut(id, checkOutDto) {
        return this.clinicVisitBasicService.checkOut(id, checkOutDto);
    }
    async getActiveVisits() {
        return this.clinicVisitBasicService.getActiveVisits();
    }
    async getVisitById(id) {
        return this.clinicVisitBasicService.getVisitById(id);
    }
    async getVisits(filters) {
        return this.clinicVisitBasicService.getVisits(filters);
    }
    async getVisitsByStudent(studentId, limit) {
        return this.clinicVisitBasicService.getVisitsByStudent(studentId, limit);
    }
    async updateVisit(id, updates) {
        return this.clinicVisitBasicService.updateVisit(id, updates);
    }
    async deleteVisit(id) {
        await this.clinicVisitBasicService.deleteVisit(id);
    }
    async getStatistics(startDate, endDate) {
        return this.clinicVisitAnalyticsService.getStatistics(new Date(startDate), new Date(endDate));
    }
    async getStudentVisitSummary(studentId, startDate, endDate) {
        const start = startDate ? new Date(startDate) : undefined;
        const end = endDate ? new Date(endDate) : undefined;
        return this.clinicVisitAnalyticsService.getStudentVisitSummary(studentId, start, end);
    }
    async getFrequentVisitors(startDate, endDate, limit) {
        return this.clinicVisitAnalyticsService.getFrequentVisitors(new Date(startDate), new Date(endDate), limit);
    }
    async getVisitsByTimeOfDay(startDate, endDate) {
        return this.clinicVisitAnalyticsService.getVisitsByTimeOfDay(new Date(startDate), new Date(endDate));
    }
};
exports.ClinicVisitController = ClinicVisitController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Check in a student to the clinic", summary: 'Check in student to clinic',
        description: 'Creates a new clinic visit and validates no active visit exists' }),
    (0, common_1.Post)('check-in'),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Student checked in successfully' }),
    (0, swagger_1.ApiResponse)({
        status: 409,
        description: 'Student already has an active visit',
    }),
    openapi.ApiResponse({ status: 201, type: require("../../../database/models/clinic-visit.model").ClinicVisit }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [check_in_dto_1.CheckInDto]),
    __metadata("design:returntype", Promise)
], ClinicVisitController.prototype, "checkIn", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Check out a student from the clinic", summary: 'Check out student from clinic',
        description: 'Updates visit with treatment and disposition' }),
    (0, common_1.Post)(':id/check-out'),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Visit ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Student checked out successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Visit not found' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Visit already checked out' }),
    openapi.ApiResponse({ status: 201, type: require("../../../database/models/clinic-visit.model").ClinicVisit }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, check_out_dto_1.CheckOutDto]),
    __metadata("design:returntype", Promise)
], ClinicVisitController.prototype, "checkOut", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Get active clinic visits", summary: 'Get all active clinic visits',
        description: 'Returns visits that have not been checked out' }),
    (0, common_1.Get)('active'),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Active visits retrieved successfully',
    }),
    openapi.ApiResponse({ status: 200, type: [require("../../../database/models/clinic-visit.model").ClinicVisit] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ClinicVisitController.prototype, "getActiveVisits", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Get visit by ID", summary: 'Get visit by ID' }),
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Visit ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Visit found successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Visit not found' }),
    openapi.ApiResponse({ status: 200, type: require("../../../database/models/clinic-visit.model").ClinicVisit }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ClinicVisitController.prototype, "getVisitById", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Query visits with filters", summary: 'Query visits with filters',
        description: 'Search and filter visits with pagination' }),
    (0, common_1.Get)(),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Visits retrieved successfully' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [visit_filters_dto_1.VisitFiltersDto]),
    __metadata("design:returntype", Promise)
], ClinicVisitController.prototype, "getVisits", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Get student visit history", summary: 'Get visit history for a student' }),
    (0, common_1.Get)('student/:studentId'),
    (0, swagger_1.ApiParam)({ name: 'studentId', description: 'Student ID' }),
    (0, swagger_1.ApiQuery)({
        name: 'limit',
        required: false,
        description: 'Maximum number of results',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Student visits retrieved successfully',
    }),
    openapi.ApiResponse({ status: 200, type: [require("../../../database/models/clinic-visit.model").ClinicVisit] }),
    __param(0, (0, common_1.Param)('studentId')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], ClinicVisitController.prototype, "getVisitsByStudent", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Update visit information", summary: 'Update visit information' }),
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Visit ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Visit updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Visit not found' }),
    openapi.ApiResponse({ status: 200, type: require("../../../database/models/clinic-visit.model").ClinicVisit }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ClinicVisitController.prototype, "updateVisit", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Delete visit", summary: 'Delete visit record' }),
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Visit ID' }),
    (0, swagger_1.ApiResponse)({ status: 204, description: 'Visit deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Visit not found' }),
    openapi.ApiResponse({ status: common_1.HttpStatus.NO_CONTENT }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ClinicVisitController.prototype, "deleteVisit", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Get visit statistics", summary: 'Get visit statistics',
        description: 'Aggregated statistics for a date range' }),
    (0, common_1.Get)('statistics/summary'),
    (0, swagger_1.ApiQuery)({
        name: 'startDate',
        required: true,
        description: 'Start date (ISO 8601)',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'endDate',
        required: true,
        description: 'End date (ISO 8601)',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Statistics retrieved successfully',
    }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Query)('startDate')),
    __param(1, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ClinicVisitController.prototype, "getStatistics", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Get student visit summary", summary: 'Get visit summary for a student',
        description: 'Aggregated visit history and frequency for a student' }),
    (0, common_1.Get)('student/:studentId/summary'),
    (0, swagger_1.ApiParam)({ name: 'studentId', description: 'Student ID' }),
    (0, swagger_1.ApiQuery)({
        name: 'startDate',
        required: false,
        description: 'Start date (ISO 8601)',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'endDate',
        required: false,
        description: 'End date (ISO 8601)',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Student summary retrieved successfully',
    }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('studentId')),
    __param(1, (0, common_1.Query)('startDate')),
    __param(2, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], ClinicVisitController.prototype, "getStudentVisitSummary", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Get frequent visitors", summary: 'Get frequent clinic visitors',
        description: 'Students with highest visit frequency in date range' }),
    (0, common_1.Get)('statistics/frequent-visitors'),
    (0, swagger_1.ApiQuery)({
        name: 'startDate',
        required: true,
        description: 'Start date (ISO 8601)',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'endDate',
        required: true,
        description: 'End date (ISO 8601)',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'limit',
        required: false,
        description: 'Maximum number of results',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Frequent visitors retrieved successfully',
    }),
    openapi.ApiResponse({ status: 200, type: [Object] }),
    __param(0, (0, common_1.Query)('startDate')),
    __param(1, (0, common_1.Query)('endDate')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Number]),
    __metadata("design:returntype", Promise)
], ClinicVisitController.prototype, "getFrequentVisitors", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Get visits by time of day", summary: 'Get visit time distribution',
        description: 'Distribution of visits by time of day' }),
    (0, common_1.Get)('statistics/time-distribution'),
    (0, swagger_1.ApiQuery)({
        name: 'startDate',
        required: true,
        description: 'Start date (ISO 8601)',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'endDate',
        required: true,
        description: 'End date (ISO 8601)',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Time distribution retrieved successfully',
    }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Query)('startDate')),
    __param(1, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ClinicVisitController.prototype, "getVisitsByTimeOfDay", null);
exports.ClinicVisitController = ClinicVisitController = __decorate([
    (0, swagger_1.ApiTags)('Clinical - Clinic Visits'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('clinical/visits'),
    __metadata("design:paramtypes", [clinic_visit_basic_service_1.ClinicVisitBasicService,
        clinic_visit_analytics_service_1.ClinicVisitAnalyticsService])
], ClinicVisitController);
//# sourceMappingURL=clinic-visit.controller.js.map