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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReminderScheduleResponseDto = exports.CustomizeReminderPreferencesDto = exports.ScheduleRemindersDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class ScheduleRemindersDto {
    appointmentId;
    static _OPENAPI_METADATA_FACTORY() {
        return { appointmentId: { required: true, type: () => String } };
    }
}
exports.ScheduleRemindersDto = ScheduleRemindersDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Appointment ID' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ScheduleRemindersDto.prototype, "appointmentId", void 0);
class CustomizeReminderPreferencesDto {
    studentId;
    preferences;
    static _OPENAPI_METADATA_FACTORY() {
        return { studentId: { required: true, type: () => String }, preferences: { required: true, type: () => ({ emailEnabled: { required: true, type: () => Boolean }, smsEnabled: { required: true, type: () => Boolean }, pushEnabled: { required: true, type: () => Boolean }, advanceNotice: { required: true, type: () => Object }, quietHours: { required: false, type: () => ({ start: { required: true, type: () => String }, end: { required: true, type: () => String } }) } }) } };
    }
}
exports.CustomizeReminderPreferencesDto = CustomizeReminderPreferencesDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Student ID' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CustomizeReminderPreferencesDto.prototype, "studentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Reminder preferences object',
        type: 'object',
        properties: {
            emailEnabled: { type: 'boolean' },
            smsEnabled: { type: 'boolean' },
            pushEnabled: { type: 'boolean' },
            advanceNotice: { enum: ['24h', '1h', '15m'] },
            quietHours: {
                type: 'object',
                properties: {
                    start: { type: 'string' },
                    end: { type: 'string' },
                },
            },
        },
    }),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CustomizeReminderPreferencesDto.prototype, "preferences", void 0);
class ReminderScheduleResponseDto {
    appointmentId;
    reminders;
    static _OPENAPI_METADATA_FACTORY() {
        return { appointmentId: { required: true, type: () => String }, reminders: { required: true } };
    }
}
exports.ReminderScheduleResponseDto = ReminderScheduleResponseDto;
//# sourceMappingURL=reminders.dto.js.map