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
var AppointmentStatisticsController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppointmentStatisticsController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const appointment_statistics_service_1 = require("../services/appointment-statistics.service");
const appointment_query_service_1 = require("../services/appointment-query.service");
const statistics_dto_1 = require("../dto/statistics.dto");
const base_1 = require("../../../common/base");
let AppointmentStatisticsController = AppointmentStatisticsController_1 = class AppointmentStatisticsController extends base_1.BaseController {
    appointmentStatisticsService;
    appointmentQueryService;
    logger = new common_1.Logger(AppointmentStatisticsController_1.name);
    constructor(appointmentStatisticsService, appointmentQueryService) {
        super();
        this.appointmentStatisticsService = appointmentStatisticsService;
        this.appointmentQueryService = appointmentQueryService;
    }
    async getStatistics(filters) {
        this.logger.log('GET /appointments/statistics');
        return this.appointmentStatisticsService.getStatistics(filters);
    }
    async searchAppointments(searchDto) {
        this.logger.log('GET /appointments/search');
        return this.appointmentStatisticsService.searchAppointments(searchDto);
    }
    async getAppointmentsByDateRange(dateRange) {
        this.logger.log('GET /appointments/range');
        return this.appointmentQueryService.getAppointmentsByDateRange(dateRange);
    }
    async getAppointmentTrends(dateFrom, dateTo, groupBy) {
        this.logger.log('GET /appointments/trends');
        return this.appointmentStatisticsService.getAppointmentTrends(dateFrom, dateTo, groupBy || 'day');
    }
    async getNoShowStats(nurseId, dateFrom, dateTo) {
        this.logger.log('GET /appointments/stats/no-show');
        return this.appointmentStatisticsService.getNoShowStats(nurseId, dateFrom, dateTo);
    }
    async getUtilizationStats(nurseId, dateFrom, dateTo) {
        this.logger.log('GET /appointments/stats/utilization');
        return this.appointmentStatisticsService.getUtilizationStats(nurseId, dateFrom, dateTo);
    }
};
exports.AppointmentStatisticsController = AppointmentStatisticsController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Get appointment statistics", summary: 'Get appointment statistics',
        description: 'Retrieve comprehensive appointment statistics and metrics' }),
    (0, common_1.Get)('statistics'),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Statistics retrieved successfully',
    }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [statistics_dto_1.StatisticsFiltersDto]),
    __metadata("design:returntype", Promise)
], AppointmentStatisticsController.prototype, "getStatistics", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Search appointments", summary: 'Search appointments',
        description: 'Search appointments by various criteria with full-text search' }),
    (0, common_1.Get)('search'),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Search results retrieved successfully',
    }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [statistics_dto_1.SearchAppointmentsDto]),
    __metadata("design:returntype", Promise)
], AppointmentStatisticsController.prototype, "searchAppointments", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Get appointments by date range", summary: 'Get appointments by date range',
        description: 'Retrieve appointments within a specific date range' }),
    (0, common_1.Get)('range'),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Appointments retrieved successfully',
    }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [statistics_dto_1.DateRangeDto]),
    __metadata("design:returntype", Promise)
], AppointmentStatisticsController.prototype, "getAppointmentsByDateRange", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Get appointment trends", summary: 'Get appointment trends',
        description: 'Retrieve appointment trends over time with analytics' }),
    (0, common_1.Get)('trends'),
    (0, swagger_1.ApiQuery)({
        name: 'dateFrom',
        required: true,
        description: 'Start date for trend analysis',
        example: '2025-10-01',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'dateTo',
        required: true,
        description: 'End date for trend analysis',
        example: '2025-10-31',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'groupBy',
        required: false,
        description: 'Grouping interval',
        enum: ['day', 'week', 'month'],
        example: 'day',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Trends retrieved successfully' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)('dateFrom')),
    __param(1, (0, common_1.Query)('dateTo')),
    __param(2, (0, common_1.Query)('groupBy')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], AppointmentStatisticsController.prototype, "getAppointmentTrends", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Get no-show statistics", summary: 'Get no-show statistics',
        description: 'Retrieve no-show rates and statistics' }),
    (0, common_1.Get)('stats/no-show'),
    (0, swagger_1.ApiQuery)({
        name: 'nurseId',
        required: false,
        description: 'Filter by nurse UUID',
        example: '987fcdeb-51a2-43d1-b456-426614174001',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'dateFrom',
        required: false,
        description: 'Start date for statistics',
        example: '2025-10-01',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'dateTo',
        required: false,
        description: 'End date for statistics',
        example: '2025-10-31',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'No-show statistics retrieved successfully',
    }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)('nurseId')),
    __param(1, (0, common_1.Query)('dateFrom')),
    __param(2, (0, common_1.Query)('dateTo')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], AppointmentStatisticsController.prototype, "getNoShowStats", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Get utilization statistics", summary: 'Get utilization statistics',
        description: 'Retrieve appointment slot utilization statistics' }),
    (0, common_1.Get)('stats/utilization'),
    (0, swagger_1.ApiQuery)({
        name: 'nurseId',
        required: true,
        description: 'Nurse UUID',
        example: '987fcdeb-51a2-43d1-b456-426614174001',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'dateFrom',
        required: true,
        description: 'Start date for statistics',
        example: '2025-10-01',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'dateTo',
        required: true,
        description: 'End date for statistics',
        example: '2025-10-31',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Utilization statistics retrieved successfully',
    }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)('nurseId')),
    __param(1, (0, common_1.Query)('dateFrom')),
    __param(2, (0, common_1.Query)('dateTo')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], AppointmentStatisticsController.prototype, "getUtilizationStats", null);
exports.AppointmentStatisticsController = AppointmentStatisticsController = AppointmentStatisticsController_1 = __decorate([
    (0, swagger_1.ApiTags)('appointments-statistics'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('appointments'),
    __metadata("design:paramtypes", [appointment_statistics_service_1.AppointmentStatisticsService,
        appointment_query_service_1.AppointmentQueryService])
], AppointmentStatisticsController);
//# sourceMappingURL=appointment-statistics.controller.js.map