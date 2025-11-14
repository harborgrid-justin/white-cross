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
var AppointmentAdvancedController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppointmentAdvancedController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const appointment_recurring_service_1 = require("../services/appointment-recurring.service");
const appointment_write_service_1 = require("../services/appointment-write.service");
const appointment_scheduling_service_1 = require("../services/appointment-scheduling.service");
const appointment_query_service_1 = require("../services/appointment-query.service");
const recurring_dto_1 = require("../dto/recurring.dto");
const statistics_dto_1 = require("../dto/statistics.dto");
const base_1 = require("../../../common/base");
let AppointmentAdvancedController = AppointmentAdvancedController_1 = class AppointmentAdvancedController extends base_1.BaseController {
    appointmentRecurringService;
    appointmentWriteService;
    appointmentSchedulingService;
    appointmentQueryService;
    logger = new common_1.Logger(AppointmentAdvancedController_1.name);
    constructor(appointmentRecurringService, appointmentWriteService, appointmentSchedulingService, appointmentQueryService) {
        super();
        this.appointmentRecurringService = appointmentRecurringService;
        this.appointmentWriteService = appointmentWriteService;
        this.appointmentSchedulingService = appointmentSchedulingService;
        this.appointmentQueryService = appointmentQueryService;
    }
    async createRecurringAppointments(createDto) {
        this.logger.log('POST /appointments/recurring');
        return this.appointmentRecurringService.createRecurringAppointments(createDto);
    }
    async bulkCancelAppointments(bulkCancelDto) {
        this.logger.log('POST /appointments/bulk/cancel');
        return this.appointmentWriteService.bulkCancelAppointments(bulkCancelDto);
    }
    async getAppointmentsForStudents(studentIds, filters) {
        this.logger.log('GET /appointments/students');
        const studentIdArray = studentIds.split(',');
        return this.appointmentQueryService.getAppointmentsForStudents(studentIdArray, filters);
    }
    async checkConflicts(nurseId, startTime, duration, excludeAppointmentId) {
        this.logger.log('GET /appointments/conflicts');
        return this.appointmentSchedulingService.checkConflicts(nurseId, startTime, parseInt(duration, 10), excludeAppointmentId);
    }
    async exportCalendar(nurseId, dateFrom, dateTo) {
        this.logger.log(`GET /appointments/calendar/${nurseId}`);
        return this.appointmentQueryService.exportCalendar(nurseId, dateFrom, dateTo);
    }
};
exports.AppointmentAdvancedController = AppointmentAdvancedController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Create recurring appointments", summary: 'Create recurring appointments',
        description: 'Create a series of recurring appointments based on a pattern' }),
    (0, common_1.Post)('recurring'),
    (0, swagger_1.ApiBody)({ type: recurring_dto_1.CreateRecurringAppointmentDto }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Recurring appointments created successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Validation failed or scheduling conflicts',
    }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [recurring_dto_1.CreateRecurringAppointmentDto]),
    __metadata("design:returntype", Promise)
], AppointmentAdvancedController.prototype, "createRecurringAppointments", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Bulk cancel appointments", summary: 'Bulk cancel appointments',
        description: 'Cancel multiple appointments at once' }),
    (0, common_1.Post)('bulk/cancel'),
    (0, swagger_1.ApiBody)({ type: statistics_dto_1.BulkCancelDto }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Bulk cancellation completed' }),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [statistics_dto_1.BulkCancelDto]),
    __metadata("design:returntype", Promise)
], AppointmentAdvancedController.prototype, "bulkCancelAppointments", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Get appointments for multiple students", summary: 'Get appointments for students',
        description: 'Retrieve appointments for multiple students' }),
    (0, common_1.Get)('students'),
    (0, swagger_1.ApiQuery)({
        name: 'studentIds',
        required: true,
        description: 'Comma-separated list of student UUIDs',
        example: '123e4567-e89b-12d3-a456-426614174000,987fcdeb-51a2-43d1-b456-426614174001',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Appointments retrieved successfully',
    }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Query)('studentIds')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AppointmentAdvancedController.prototype, "getAppointmentsForStudents", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Check for scheduling conflicts", summary: 'Check conflicts',
        description: 'Check for scheduling conflicts before booking an appointment' }),
    (0, common_1.Get)('conflicts'),
    (0, swagger_1.ApiQuery)({
        name: 'nurseId',
        required: true,
        description: 'Nurse UUID',
        example: '987fcdeb-51a2-43d1-b456-426614174001',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'startTime',
        required: true,
        description: 'Proposed start time (ISO 8601)',
        example: '2025-10-28T10:30:00Z',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'duration',
        required: true,
        description: 'Appointment duration in minutes',
        example: 30,
    }),
    (0, swagger_1.ApiQuery)({
        name: 'excludeAppointmentId',
        required: false,
        description: 'Appointment ID to exclude from conflict check (for updates)',
        example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Conflict check completed' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)('nurseId')),
    __param(1, (0, common_1.Query)('startTime')),
    __param(2, (0, common_1.Query)('duration')),
    __param(3, (0, common_1.Query)('excludeAppointmentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", Promise)
], AppointmentAdvancedController.prototype, "checkConflicts", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Export calendar", summary: 'Export calendar',
        description: 'Export nurse calendar in iCal format' }),
    (0, common_1.Get)('calendar/:nurseId'),
    (0, swagger_1.ApiParam)({ name: 'nurseId', description: 'Nurse UUID' }),
    (0, swagger_1.ApiQuery)({
        name: 'dateFrom',
        required: false,
        description: 'Start date for export',
        example: '2025-10-01',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'dateTo',
        required: false,
        description: 'End date for export',
        example: '2025-10-31',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Calendar exported successfully',
        content: {
            'text/calendar': {
                schema: { type: 'string', format: 'binary' },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid UUID format' }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('nurseId', new common_1.ParseUUIDPipe({ version: '4' }))),
    __param(1, (0, common_1.Query)('dateFrom')),
    __param(2, (0, common_1.Query)('dateTo')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], AppointmentAdvancedController.prototype, "exportCalendar", null);
exports.AppointmentAdvancedController = AppointmentAdvancedController = AppointmentAdvancedController_1 = __decorate([
    (0, swagger_1.ApiTags)('appointments-advanced'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('appointments'),
    __metadata("design:paramtypes", [appointment_recurring_service_1.AppointmentRecurringService,
        appointment_write_service_1.AppointmentWriteService,
        appointment_scheduling_service_1.AppointmentSchedulingService,
        appointment_query_service_1.AppointmentQueryService])
], AppointmentAdvancedController);
//# sourceMappingURL=appointment-advanced.controller.js.map