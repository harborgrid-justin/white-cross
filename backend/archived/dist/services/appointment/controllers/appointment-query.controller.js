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
var AppointmentQueryController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppointmentQueryController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const appointment_query_service_1 = require("../services/appointment-query.service");
const base_1 = require("../../../common/base");
let AppointmentQueryController = AppointmentQueryController_1 = class AppointmentQueryController extends base_1.BaseController {
    appointmentQueryService;
    logger = new common_1.Logger(AppointmentQueryController_1.name);
    constructor(appointmentQueryService) {
        super();
        this.appointmentQueryService = appointmentQueryService;
    }
    async getAppointmentsByDate(dateStr) {
        this.logger.log(`GET /appointments/by-date?date=${dateStr}`);
        return this.appointmentQueryService.getAppointmentsByDate(dateStr);
    }
    async getUpcomingAppointments(limit) {
        this.logger.log('GET /appointments/upcoming');
        return this.appointmentQueryService.getGeneralUpcomingAppointments(limit);
    }
    async getNurseUpcomingAppointments(nurseId, limit) {
        this.logger.log(`GET /appointments/nurse/${nurseId}/upcoming`);
        return this.appointmentQueryService.getUpcomingAppointments(nurseId, limit);
    }
    async checkAvailability(nurseId, query) {
        this.logger.log(`GET /appointments/availability/${nurseId}`);
        return this.appointmentQueryService.getAvailableSlots(nurseId, query.dateFrom, query.dateTo, query.duration);
    }
};
exports.AppointmentQueryController = AppointmentQueryController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Get appointments by date", summary: 'Get appointments by date',
        description: 'Retrieve all appointments for a specific date' }),
    (0, common_1.Get)('by-date'),
    (0, swagger_1.ApiQuery)({ name: 'date', description: 'Date in YYYY-MM-DD format', example: '2024-01-15' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Successfully retrieved appointments for the date',
    }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)('date')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AppointmentQueryController.prototype, "getAppointmentsByDate", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Get upcoming appointments", summary: 'Get upcoming appointments',
        description: 'Retrieve upcoming appointments across all nurses' }),
    (0, common_1.Get)('upcoming'),
    (0, swagger_1.ApiQuery)({
        name: 'limit',
        required: false,
        description: 'Maximum number of appointments to return',
        example: 10,
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Successfully retrieved upcoming appointments',
    }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AppointmentQueryController.prototype, "getUpcomingAppointments", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Get nurse's upcoming appointments", summary: 'Get nurse upcoming appointments',
        description: 'Retrieve upcoming appointments for a specific nurse' }),
    (0, common_1.Get)('nurse/:nurseId/upcoming'),
    (0, swagger_1.ApiParam)({ name: 'nurseId', description: 'Nurse UUID' }),
    (0, swagger_1.ApiQuery)({
        name: 'limit',
        required: false,
        description: 'Maximum number of appointments to return',
        example: 10,
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Successfully retrieved nurse upcoming appointments',
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid nurse UUID' }),
    openapi.ApiResponse({ status: 200, type: [require("../../../database/models/appointment.model").Appointment] }),
    __param(0, (0, common_1.Param)('nurseId', new common_1.ParseUUIDPipe({ version: '4' }))),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], AppointmentQueryController.prototype, "getNurseUpcomingAppointments", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Check nurse availability", summary: 'Check nurse availability',
        description: 'Check availability slots for a nurse within a date range' }),
    (0, common_1.Get)('availability/:nurseId'),
    (0, swagger_1.ApiParam)({ name: 'nurseId', description: 'Nurse UUID' }),
    (0, swagger_1.ApiQuery)({
        name: 'dateFrom',
        required: false,
        description: 'Start date for availability check (YYYY-MM-DD)',
        example: '2024-01-15',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'dateTo',
        required: false,
        description: 'End date for availability check (YYYY-MM-DD)',
        example: '2024-01-20',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'duration',
        required: false,
        description: 'Appointment duration in minutes',
        example: 30,
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Successfully retrieved availability slots',
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid nurse UUID' }),
    openapi.ApiResponse({ status: 200, type: [Object] }),
    __param(0, (0, common_1.Param)('nurseId', new common_1.ParseUUIDPipe({ version: '4' }))),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AppointmentQueryController.prototype, "checkAvailability", null);
exports.AppointmentQueryController = AppointmentQueryController = AppointmentQueryController_1 = __decorate([
    (0, swagger_1.ApiTags)('appointments-query'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('appointments'),
    __metadata("design:paramtypes", [appointment_query_service_1.AppointmentQueryService])
], AppointmentQueryController);
//# sourceMappingURL=appointment-query.controller.js.map