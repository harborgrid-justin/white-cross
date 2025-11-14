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
exports.SendSmsDto = exports.SmsPriority = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
var SmsPriority;
(function (SmsPriority) {
    SmsPriority["LOW"] = "low";
    SmsPriority["NORMAL"] = "normal";
    SmsPriority["HIGH"] = "high";
    SmsPriority["URGENT"] = "urgent";
})(SmsPriority || (exports.SmsPriority = SmsPriority = {}));
class SendSmsDto {
    message;
    templateVariables;
    priority = SmsPriority.NORMAL;
    scheduledFor;
    trackDelivery = true;
    maxRetries = 3;
    metadata;
    static _OPENAPI_METADATA_FACTORY() {
        return { message: { required: true, type: () => String, maxLength: 1600 }, templateVariables: { required: false, type: () => Object }, priority: { required: false, default: SmsPriority.NORMAL, enum: require("./send-sms.dto").SmsPriority }, scheduledFor: { required: false, type: () => String }, trackDelivery: { required: false, type: () => Boolean, default: true }, maxRetries: { required: false, type: () => Number, default: 3, minimum: 0, maximum: 5 }, metadata: { required: false, type: () => Object } };
    }
}
exports.SendSmsDto = SendSmsDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'SMS message content',
        example: 'This is a notification message',
        maxLength: 1600,
    }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Message is required' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(1600, { message: 'Message cannot exceed 1600 characters' }),
    __metadata("design:type", String)
], SendSmsDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Template variables for substitution',
        example: { studentName: 'John Doe', time: '2:30 PM' },
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], SendSmsDto.prototype, "templateVariables", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'SMS priority for queue processing',
        enum: SmsPriority,
        default: SmsPriority.NORMAL,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(SmsPriority),
    __metadata("design:type", String)
], SendSmsDto.prototype, "priority", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Schedule SMS for future delivery (ISO 8601 timestamp)',
        example: '2025-10-28T15:30:00Z',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SendSmsDto.prototype, "scheduledFor", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Enable delivery status tracking',
        default: true,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], SendSmsDto.prototype, "trackDelivery", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Maximum retry attempts on failure',
        minimum: 0,
        maximum: 5,
        default: 3,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(5),
    __metadata("design:type", Number)
], SendSmsDto.prototype, "maxRetries", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Custom metadata for tracking',
        example: { userId: '123', alertId: '456' },
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], SendSmsDto.prototype, "metadata", void 0);
//# sourceMappingURL=send-sms.dto.js.map