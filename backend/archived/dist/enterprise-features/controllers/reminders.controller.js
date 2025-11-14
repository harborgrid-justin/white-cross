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
exports.RemindersController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const reminder_scheduler_service_1 = require("../reminder-scheduler.service");
const dto_1 = require("../dto");
const base_1 = require("../../common/base");
let RemindersController = class RemindersController extends base_1.BaseController {
    reminderService;
    constructor(reminderService) {
        super();
        this.reminderService = reminderService;
    }
    scheduleReminders(dto) {
        return this.reminderService.scheduleReminders(dto.appointmentId);
    }
    sendDueReminders() {
        return this.reminderService.sendDueReminders();
    }
    customizeReminderPreferences(studentId, dto) {
        return this.reminderService.updatePreferences(studentId, dto.preferences);
    }
};
exports.RemindersController = RemindersController;
__decorate([
    (0, common_1.Post)('schedule'),
    (0, swagger_1.ApiOperation)({ summary: 'Schedule reminders for appointment' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Reminders scheduled',
        type: dto_1.ReminderScheduleResponseDto,
    }),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.ScheduleRemindersDto]),
    __metadata("design:returntype", void 0)
], RemindersController.prototype, "scheduleReminders", null);
__decorate([
    (0, common_1.Post)('send-due'),
    (0, swagger_1.ApiOperation)({ summary: 'Send all due reminders' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Due reminders sent' }),
    openapi.ApiResponse({ status: 201, type: Number }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], RemindersController.prototype, "sendDueReminders", null);
__decorate([
    (0, common_1.Put)('preferences/:studentId'),
    (0, swagger_1.ApiOperation)({ summary: 'Customize reminder preferences' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Preferences updated' }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('studentId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.CustomizeReminderPreferencesDto]),
    __metadata("design:returntype", void 0)
], RemindersController.prototype, "customizeReminderPreferences", null);
exports.RemindersController = RemindersController = __decorate([
    (0, swagger_1.ApiTags)('Appointment Reminders'),
    (0, common_1.Controller)('enterprise-features/reminders'),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [reminder_scheduler_service_1.ReminderSchedulerService])
], RemindersController);
//# sourceMappingURL=reminders.controller.js.map