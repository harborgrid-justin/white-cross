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
var AppointmentCoreController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppointmentCoreController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const appointment_read_service_1 = require("../services/appointment-read.service");
const appointment_write_service_1 = require("../services/appointment-write.service");
const create_appointment_dto_1 = require("../dto/create-appointment.dto");
const update_appointment_dto_1 = require("../dto/update-appointment.dto");
const appointment_filters_dto_1 = require("../dto/appointment-filters.dto");
const base_1 = require("../../../common/base");
let AppointmentCoreController = AppointmentCoreController_1 = class AppointmentCoreController extends base_1.BaseController {
    appointmentReadService;
    appointmentWriteService;
    logger = new common_1.Logger(AppointmentCoreController_1.name);
    constructor(appointmentReadService, appointmentWriteService) {
        super();
        this.appointmentReadService = appointmentReadService;
        this.appointmentWriteService = appointmentWriteService;
    }
    getAppointments(filters) {
        this.logger.log('GET /appointments');
        return this.appointmentReadService.getAppointments(filters);
    }
    getAppointmentById(id) {
        this.logger.log(`GET /appointments/${id}`);
        return this.appointmentReadService.getAppointmentById(id);
    }
    async createAppointment(createDto) {
        this.logger.log('POST /appointments');
        return this.appointmentWriteService.createAppointment(createDto);
    }
    async updateAppointment(id, updateDto) {
        this.logger.log(`PATCH /appointments/${id}`);
        return this.appointmentWriteService.updateAppointment(id, updateDto);
    }
    async cancelAppointment(id, reason) {
        this.logger.log(`DELETE /appointments/${id}`);
        return this.appointmentWriteService.cancelAppointment(id, reason);
    }
};
exports.AppointmentCoreController = AppointmentCoreController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Get appointments with pagination and filtering", summary: 'List appointments',
        description: 'Retrieve appointments with pagination and optional filtering by nurse, student, status, type, and date range' }),
    (0, common_1.Get)(),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Successfully retrieved appointments',
    }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [appointment_filters_dto_1.AppointmentFiltersDto]),
    __metadata("design:returntype", void 0)
], AppointmentCoreController.prototype, "getAppointments", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Get a single appointment by ID", summary: 'Get appointment by ID',
        description: 'Retrieve detailed information about a specific appointment' }),
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Appointment UUID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Appointment found' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid UUID format' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Appointment not found' }),
    openapi.ApiResponse({ status: 200, type: require("../../../database/models/appointment.model").Appointment }),
    __param(0, (0, common_1.Param)('id', new common_1.ParseUUIDPipe({ version: '4' }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AppointmentCoreController.prototype, "getAppointmentById", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Create a new appointment", summary: 'Create appointment',
        description: 'Create a new appointment with validation and conflict checking' }),
    (0, common_1.Post)(),
    (0, swagger_1.ApiBody)({ type: create_appointment_dto_1.CreateAppointmentDto }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Appointment created successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Validation failed or conflicts detected',
    }),
    openapi.ApiResponse({ status: 201, type: require("../../../database/models/appointment.model").Appointment }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_appointment_dto_1.CreateAppointmentDto]),
    __metadata("design:returntype", Promise)
], AppointmentCoreController.prototype, "createAppointment", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Update an existing appointment", summary: 'Update appointment',
        description: 'Update appointment details with validation and conflict checking' }),
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Appointment UUID' }),
    (0, swagger_1.ApiBody)({ type: update_appointment_dto_1.UpdateAppointmentDto }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Appointment updated successfully' }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Validation failed or invalid transition or invalid UUID',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Appointment not found' }),
    openapi.ApiResponse({ status: 200, type: require("../../../database/models/appointment.model").Appointment }),
    __param(0, (0, common_1.Param)('id', new common_1.ParseUUIDPipe({ version: '4' }))),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_appointment_dto_1.UpdateAppointmentDto]),
    __metadata("design:returntype", Promise)
], AppointmentCoreController.prototype, "updateAppointment", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Cancel an appointment", summary: 'Cancel appointment',
        description: 'Cancel an appointment with optional reason. Triggers waitlist processing.' }),
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Appointment UUID' }),
    (0, swagger_1.ApiQuery)({
        name: 'reason',
        required: false,
        description: 'Reason for cancellation',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Appointment cancelled successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Cannot cancel appointment in current state or invalid UUID',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Appointment not found' }),
    openapi.ApiResponse({ status: 200, type: require("../../../database/models/appointment.model").Appointment }),
    __param(0, (0, common_1.Param)('id', new common_1.ParseUUIDPipe({ version: '4' }))),
    __param(1, (0, common_1.Query)('reason')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AppointmentCoreController.prototype, "cancelAppointment", null);
exports.AppointmentCoreController = AppointmentCoreController = AppointmentCoreController_1 = __decorate([
    (0, swagger_1.ApiTags)('appointments-core'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('appointments'),
    __metadata("design:paramtypes", [appointment_read_service_1.AppointmentReadService,
        appointment_write_service_1.AppointmentWriteService])
], AppointmentCoreController);
//# sourceMappingURL=appointment-core.controller.js.map