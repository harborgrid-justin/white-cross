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
var AppointmentStatusController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppointmentStatusController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const appointment_status_service_1 = require("../services/appointment-status.service");
const base_1 = require("../../../common/base");
let AppointmentStatusController = AppointmentStatusController_1 = class AppointmentStatusController extends base_1.BaseController {
    appointmentStatusService;
    logger = new common_1.Logger(AppointmentStatusController_1.name);
    constructor(appointmentStatusService) {
        super();
        this.appointmentStatusService = appointmentStatusService;
    }
    async startAppointment(id) {
        this.logger.log(`PATCH /appointments/${id}/start`);
        return this.appointmentStatusService.startAppointment(id);
    }
    async completeAppointment(id, completionData) {
        this.logger.log(`PATCH /appointments/${id}/complete`);
        return this.appointmentStatusService.completeAppointment(id, completionData);
    }
    async markNoShow(id) {
        this.logger.log(`PATCH /appointments/${id}/no-show`);
        return this.appointmentStatusService.markNoShow(id);
    }
};
exports.AppointmentStatusController = AppointmentStatusController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Start an appointment (transition to IN_PROGRESS)", summary: 'Start appointment',
        description: 'Mark appointment as in progress when student arrives' }),
    (0, common_1.Patch)(':id/start'),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Appointment UUID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Appointment started successfully' }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Cannot start appointment in current state or invalid UUID',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Appointment not found' }),
    openapi.ApiResponse({ status: 200, type: require("../../../database/models/appointment.model").Appointment }),
    __param(0, (0, common_1.Param)('id', new common_1.ParseUUIDPipe({ version: '4' }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AppointmentStatusController.prototype, "startAppointment", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Complete an appointment", summary: 'Complete appointment',
        description: 'Mark appointment as completed with optional outcome data' }),
    (0, common_1.Patch)(':id/complete'),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Appointment UUID' }),
    (0, swagger_1.ApiBody)({
        required: false,
        schema: {
            type: 'object',
            properties: {
                notes: { type: 'string', description: 'Completion notes' },
                outcomes: { type: 'string', description: 'Health outcomes' },
                followUpRequired: {
                    type: 'boolean',
                    description: 'Whether follow-up is required',
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Appointment completed successfully' }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Cannot complete appointment in current state or invalid UUID',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Appointment not found' }),
    openapi.ApiResponse({ status: 200, type: require("../../../database/models/appointment.model").Appointment }),
    __param(0, (0, common_1.Param)('id', new common_1.ParseUUIDPipe({ version: '4' }))),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AppointmentStatusController.prototype, "completeAppointment", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Mark appointment as no-show", summary: 'Mark appointment as no-show',
        description: 'Mark a scheduled appointment as no-show when student does not arrive' }),
    (0, common_1.Patch)(':id/no-show'),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Appointment UUID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Appointment marked as no-show successfully' }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Cannot mark appointment as no-show in current state or invalid UUID',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Appointment not found' }),
    openapi.ApiResponse({ status: 200, type: require("../../../database/models/appointment.model").Appointment }),
    __param(0, (0, common_1.Param)('id', new common_1.ParseUUIDPipe({ version: '4' }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AppointmentStatusController.prototype, "markNoShow", null);
exports.AppointmentStatusController = AppointmentStatusController = AppointmentStatusController_1 = __decorate([
    (0, swagger_1.ApiTags)('appointments-status'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('appointments'),
    __metadata("design:paramtypes", [appointment_status_service_1.AppointmentStatusService])
], AppointmentStatusController);
//# sourceMappingURL=appointment-status.controller.js.map