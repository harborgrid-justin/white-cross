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
exports.CreateAlertDto = exports.AlertCategory = exports.AlertSeverity = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
var AlertSeverity;
(function (AlertSeverity) {
    AlertSeverity["INFO"] = "INFO";
    AlertSeverity["LOW"] = "LOW";
    AlertSeverity["MEDIUM"] = "MEDIUM";
    AlertSeverity["HIGH"] = "HIGH";
    AlertSeverity["CRITICAL"] = "CRITICAL";
    AlertSeverity["EMERGENCY"] = "EMERGENCY";
})(AlertSeverity || (exports.AlertSeverity = AlertSeverity = {}));
var AlertCategory;
(function (AlertCategory) {
    AlertCategory["HEALTH"] = "HEALTH";
    AlertCategory["SAFETY"] = "SAFETY";
    AlertCategory["COMPLIANCE"] = "COMPLIANCE";
    AlertCategory["SYSTEM"] = "SYSTEM";
    AlertCategory["MEDICATION"] = "MEDICATION";
    AlertCategory["APPOINTMENT"] = "APPOINTMENT";
})(AlertCategory || (exports.AlertCategory = AlertCategory = {}));
class CreateAlertDto {
    definitionId;
    severity;
    category;
    title;
    message;
    studentId;
    userId;
    schoolId;
    metadata;
    expiresAt;
    autoEscalateAfter;
    requiresAcknowledgment;
    static _OPENAPI_METADATA_FACTORY() {
        return { definitionId: { required: false, type: () => String, format: "uuid" }, severity: { required: true, enum: require("./create-alert.dto").AlertSeverity }, category: { required: true, enum: require("./create-alert.dto").AlertCategory }, title: { required: true, type: () => String, maxLength: 500 }, message: { required: true, type: () => String, maxLength: 5000 }, studentId: { required: false, type: () => String, format: "uuid" }, userId: { required: false, type: () => String, format: "uuid" }, schoolId: { required: false, type: () => String, format: "uuid" }, metadata: { required: false, type: () => Object }, expiresAt: { required: false, type: () => Date }, autoEscalateAfter: { required: false, type: () => Number }, requiresAcknowledgment: { required: true, type: () => Boolean } };
    }
}
exports.CreateAlertDto = CreateAlertDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Alert definition ID',
        example: '123e4567-e89b-12d3-a456-426614174000',
        required: false,
        format: 'uuid',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(4, { message: 'Definition ID must be a valid UUID' }),
    __metadata("design:type", String)
], CreateAlertDto.prototype, "definitionId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Alert severity',
        enum: AlertSeverity,
        example: AlertSeverity.HIGH,
    }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Severity is required' }),
    (0, class_validator_1.IsEnum)(AlertSeverity, { message: 'Invalid severity' }),
    __metadata("design:type", String)
], CreateAlertDto.prototype, "severity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Alert category',
        enum: AlertCategory,
        example: AlertCategory.MEDICATION,
    }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Category is required' }),
    (0, class_validator_1.IsEnum)(AlertCategory, { message: 'Invalid category' }),
    __metadata("design:type", String)
], CreateAlertDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Alert title',
        example: 'Medication Reminder',
        maxLength: 500,
    }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Title is required' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500, { message: 'Title cannot exceed 500 characters' }),
    __metadata("design:type", String)
], CreateAlertDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Alert message',
        example: 'Student John Doe needs to take asthma medication at 2:00 PM',
        maxLength: 5000,
    }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Message is required' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(5000, { message: 'Message cannot exceed 5000 characters' }),
    __metadata("design:type", String)
], CreateAlertDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Related student ID',
        example: '123e4567-e89b-12d3-a456-426614174000',
        required: false,
        format: 'uuid',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(4, { message: 'Student ID must be a valid UUID' }),
    __metadata("design:type", String)
], CreateAlertDto.prototype, "studentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User ID to send alert to',
        example: '123e4567-e89b-12d3-a456-426614174000',
        required: false,
        format: 'uuid',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(4, { message: 'User ID must be a valid UUID' }),
    __metadata("design:type", String)
], CreateAlertDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'School ID',
        example: '123e4567-e89b-12d3-a456-426614174000',
        required: false,
        format: 'uuid',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(4, { message: 'School ID must be a valid UUID' }),
    __metadata("design:type", String)
], CreateAlertDto.prototype, "schoolId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Additional metadata',
        example: { medicationId: '123', dose: '10mg' },
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CreateAlertDto.prototype, "metadata", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Expiration date',
        example: '2023-12-31T23:59:59Z',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", Date)
], CreateAlertDto.prototype, "expiresAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Auto-escalate after minutes',
        example: 30,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateAlertDto.prototype, "autoEscalateAfter", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Requires acknowledgment',
        example: true,
        default: false,
    }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Requires acknowledgment is required' }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateAlertDto.prototype, "requiresAcknowledgment", void 0);
//# sourceMappingURL=create-alert.dto.js.map