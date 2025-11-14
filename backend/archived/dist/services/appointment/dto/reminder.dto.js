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
exports.ReminderProcessingResultDto = exports.CreateReminderDto = exports.ReminderStatus = exports.MessageType = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
var MessageType;
(function (MessageType) {
    MessageType["EMAIL"] = "EMAIL";
    MessageType["SMS"] = "SMS";
    MessageType["PUSH_NOTIFICATION"] = "PUSH_NOTIFICATION";
    MessageType["VOICE"] = "VOICE";
})(MessageType || (exports.MessageType = MessageType = {}));
var ReminderStatus;
(function (ReminderStatus) {
    ReminderStatus["SCHEDULED"] = "SCHEDULED";
    ReminderStatus["SENT"] = "SENT";
    ReminderStatus["FAILED"] = "FAILED";
    ReminderStatus["CANCELLED"] = "CANCELLED";
})(ReminderStatus || (exports.ReminderStatus = ReminderStatus = {}));
class CreateReminderDto {
    appointmentId;
    type;
    scheduleTime;
    message;
    static _OPENAPI_METADATA_FACTORY() {
        return { appointmentId: { required: true, type: () => String, format: "uuid" }, type: { required: true, enum: require("./reminder.dto").MessageType }, scheduleTime: { required: true, type: () => Date }, message: { required: false, type: () => String } };
    }
}
exports.CreateReminderDto = CreateReminderDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Appointment UUID to create reminder for',
        example: '123e4567-e89b-12d3-a456-426614174000',
        format: 'uuid',
    }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateReminderDto.prototype, "appointmentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Type of message delivery channel',
        enum: MessageType,
        example: MessageType.EMAIL,
    }),
    (0, class_validator_1.IsEnum)(MessageType),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateReminderDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'When to send the reminder',
        example: '2025-10-27T10:30:00Z',
        type: 'string',
        format: 'date-time',
    }),
    (0, class_transformer_1.Type)(() => Date),
    (0, class_validator_1.IsDate)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Date)
], CreateReminderDto.prototype, "scheduleTime", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Custom reminder message (optional - default message will be used if not provided)',
        example: 'Reminder: You have an appointment tomorrow at 10:30 AM with Nurse Johnson.',
        maxLength: 500,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateReminderDto.prototype, "message", void 0);
class ReminderProcessingResultDto {
    total;
    sent;
    failed;
    errors;
    static _OPENAPI_METADATA_FACTORY() {
        return { total: { required: true, type: () => Number }, sent: { required: true, type: () => Number }, failed: { required: true, type: () => Number }, errors: { required: false } };
    }
}
exports.ReminderProcessingResultDto = ReminderProcessingResultDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Total number of reminders processed',
        example: 25,
    }),
    __metadata("design:type", Number)
], ReminderProcessingResultDto.prototype, "total", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Number of reminders successfully sent',
        example: 23,
    }),
    __metadata("design:type", Number)
], ReminderProcessingResultDto.prototype, "sent", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Number of reminders that failed to send',
        example: 2,
    }),
    __metadata("design:type", Number)
], ReminderProcessingResultDto.prototype, "failed", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Details of failed reminders',
        type: 'array',
        items: {
            type: 'object',
            properties: {
                reminderId: { type: 'string', format: 'uuid' },
                error: { type: 'string' },
            },
        },
    }),
    __metadata("design:type", Array)
], ReminderProcessingResultDto.prototype, "errors", void 0);
//# sourceMappingURL=reminder.dto.js.map