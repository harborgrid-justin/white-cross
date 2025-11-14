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
exports.NotificationDto = exports.NotificationPriority = exports.NotificationType = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
var NotificationType;
(function (NotificationType) {
    NotificationType["EMERGENCY"] = "emergency";
    NotificationType["HEALTH"] = "health";
    NotificationType["MEDICATION"] = "medication";
    NotificationType["GENERAL"] = "general";
})(NotificationType || (exports.NotificationType = NotificationType = {}));
var NotificationPriority;
(function (NotificationPriority) {
    NotificationPriority["LOW"] = "low";
    NotificationPriority["MEDIUM"] = "medium";
    NotificationPriority["HIGH"] = "high";
    NotificationPriority["CRITICAL"] = "critical";
})(NotificationPriority || (exports.NotificationPriority = NotificationPriority = {}));
class NotificationDto {
    message;
    type;
    priority;
    studentId;
    channels;
    attachments;
    static _OPENAPI_METADATA_FACTORY() {
        return { message: { required: true, type: () => String, minLength: 1 }, type: { required: true, enum: require("./notification.dto").NotificationType }, priority: { required: true, enum: require("./notification.dto").NotificationPriority }, studentId: { required: true, type: () => String, format: "uuid" }, channels: { required: true, type: () => [Object], minItems: 1 }, attachments: { required: false, type: () => [String] } };
    }
}
exports.NotificationDto = NotificationDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Notification message content',
        example: "Your child has a minor injury and is in the nurse's office.",
        minLength: 1,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(1),
    __metadata("design:type", String)
], NotificationDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Type of notification',
        enum: NotificationType,
        example: NotificationType.EMERGENCY,
    }),
    (0, class_validator_1.IsEnum)(NotificationType),
    __metadata("design:type", String)
], NotificationDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Priority level',
        enum: NotificationPriority,
        example: NotificationPriority.HIGH,
    }),
    (0, class_validator_1.IsEnum)(NotificationPriority),
    __metadata("design:type", String)
], NotificationDto.prototype, "priority", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Student ID',
        example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], NotificationDto.prototype, "studentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Notification channels to use',
        example: ['sms', 'email'],
        type: [String],
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMinSize)(1),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], NotificationDto.prototype, "channels", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'File attachments (URLs or paths)',
        example: ['https://example.com/document.pdf'],
        type: [String],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], NotificationDto.prototype, "attachments", void 0);
//# sourceMappingURL=notification.dto.js.map