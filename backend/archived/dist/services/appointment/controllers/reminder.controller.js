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
var ReminderController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReminderController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const reminder_service_1 = require("../services/reminder.service");
const base_1 = require("../../../common/base");
let ReminderController = ReminderController_1 = class ReminderController extends base_1.BaseController {
    reminderService;
    logger = new common_1.Logger(ReminderController_1.name);
    constructor(reminderService) {
        super();
        this.reminderService = reminderService;
    }
    async processPendingReminders() {
        this.logger.log('POST /appointments/reminders/process');
        return this.reminderService.processPendingReminders();
    }
    async getAppointmentReminders(id) {
        this.logger.log(`GET /appointments/${id}/reminders`);
        return this.reminderService.getAppointmentReminders(id);
    }
    async createAppointmentReminder(id, createDto) {
        this.logger.log(`POST /appointments/${id}/reminders`);
        return this.reminderService.createAppointmentReminder(id, createDto);
    }
};
exports.ReminderController = ReminderController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Process pending reminders", summary: 'Process pending reminders',
        description: 'Process all pending appointment reminders for delivery' }),
    (0, common_1.Post)('reminders/process'),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Reminders processed successfully' }),
    openapi.ApiResponse({ status: 201, type: require("../dto/reminder.dto").ReminderProcessingResultDto }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ReminderController.prototype, "processPendingReminders", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Get appointment reminders", summary: 'Get appointment reminders',
        description: 'Retrieve all reminders for a specific appointment' }),
    (0, common_1.Get)(':id/reminders'),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Appointment UUID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Reminders retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid UUID format' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Appointment not found' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id', new common_1.ParseUUIDPipe({ version: '4' }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReminderController.prototype, "getAppointmentReminders", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Create appointment reminder (manual)", summary: 'Create appointment reminder',
        description: 'Create a manual reminder for a specific appointment' }),
    (0, common_1.Post)(':id/reminders'),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Appointment UUID' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Reminder created successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid UUID format or validation failed' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Appointment not found' }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Param)('id', new common_1.ParseUUIDPipe({ version: '4' }))),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ReminderController.prototype, "createAppointmentReminder", null);
exports.ReminderController = ReminderController = ReminderController_1 = __decorate([
    (0, swagger_1.ApiTags)('appointments-reminders'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('appointments'),
    __metadata("design:paramtypes", [reminder_service_1.ReminderService])
], ReminderController);
//# sourceMappingURL=reminder.controller.js.map