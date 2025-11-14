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
exports.SendEmergencyNotificationDto = exports.EmergencySeverity = exports.EmergencyType = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
var EmergencyType;
(function (EmergencyType) {
    EmergencyType["MEDICAL"] = "medical";
    EmergencyType["SAFETY"] = "safety";
    EmergencyType["EVACUATION"] = "evacuation";
    EmergencyType["LOCKDOWN"] = "lockdown";
    EmergencyType["WEATHER"] = "weather";
    EmergencyType["OTHER"] = "other";
})(EmergencyType || (exports.EmergencyType = EmergencyType = {}));
var EmergencySeverity;
(function (EmergencySeverity) {
    EmergencySeverity["LOW"] = "low";
    EmergencySeverity["MEDIUM"] = "medium";
    EmergencySeverity["HIGH"] = "high";
    EmergencySeverity["CRITICAL"] = "critical";
})(EmergencySeverity || (exports.EmergencySeverity = EmergencySeverity = {}));
class SendEmergencyNotificationDto {
    studentId;
    emergencyType;
    severity;
    title;
    message;
    location;
    recipientIds;
    static _OPENAPI_METADATA_FACTORY() {
        return { studentId: { required: false, type: () => String, format: "uuid" }, emergencyType: { required: true, enum: require("./send-emergency-notification.dto").EmergencyType }, severity: { required: true, enum: require("./send-emergency-notification.dto").EmergencySeverity }, title: { required: true, type: () => String, maxLength: 200 }, message: { required: true, type: () => String, maxLength: 1000 }, location: { required: false, type: () => String }, recipientIds: { required: false, type: () => [String], format: "uuid" } };
    }
}
exports.SendEmergencyNotificationDto = SendEmergencyNotificationDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Student ID (if student-specific emergency)',
        example: '123e4567-e89b-12d3-a456-426614174000',
        format: 'uuid',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(4, { message: 'Student ID must be a valid UUID' }),
    __metadata("design:type", String)
], SendEmergencyNotificationDto.prototype, "studentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Emergency type',
        enum: EmergencyType,
        example: EmergencyType.MEDICAL,
    }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Emergency type is required' }),
    (0, class_validator_1.IsEnum)(EmergencyType, { message: 'Invalid emergency type' }),
    __metadata("design:type", String)
], SendEmergencyNotificationDto.prototype, "emergencyType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Emergency severity',
        enum: EmergencySeverity,
        example: EmergencySeverity.HIGH,
    }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Severity is required' }),
    (0, class_validator_1.IsEnum)(EmergencySeverity, { message: 'Invalid severity' }),
    __metadata("design:type", String)
], SendEmergencyNotificationDto.prototype, "severity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Emergency title',
        example: 'Medical Emergency - Room 201',
        maxLength: 200,
    }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Title is required' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(200, { message: 'Title cannot exceed 200 characters' }),
    __metadata("design:type", String)
], SendEmergencyNotificationDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Emergency message',
        example: 'Student requires immediate medical attention',
        maxLength: 1000,
    }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Message is required' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(1000, { message: 'Message cannot exceed 1000 characters' }),
    __metadata("design:type", String)
], SendEmergencyNotificationDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Location of emergency',
        example: 'Building A, Room 201',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SendEmergencyNotificationDto.prototype, "location", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Recipient user IDs (if not broadcasting)',
        example: ['123e4567-e89b-12d3-a456-426614174000'],
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsUUID)(4, { each: true, message: 'Each recipient ID must be a valid UUID' }),
    __metadata("design:type", Array)
], SendEmergencyNotificationDto.prototype, "recipientIds", void 0);
//# sourceMappingURL=send-emergency-notification.dto.js.map