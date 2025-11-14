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
exports.BulkSmsResultDto = exports.BulkSmsDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const generic_sms_dto_1 = require("./generic-sms.dto");
const send_sms_dto_1 = require("./send-sms.dto");
class BulkSmsDto extends generic_sms_dto_1.GenericSmsDto {
    recipients;
    priority = send_sms_dto_1.SmsPriority.NORMAL;
    metadata;
    static _OPENAPI_METADATA_FACTORY() {
        return { recipients: { required: true, type: () => [String], minItems: 1, maxItems: 100 }, priority: { required: false, default: send_sms_dto_1.SmsPriority.NORMAL, enum: require("./send-sms.dto").SmsPriority }, metadata: { required: false, type: () => Object } };
    }
}
exports.BulkSmsDto = BulkSmsDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Array of recipient phone numbers (max 100)',
        example: ['+15551234567', '+15559876543'],
        minItems: 1,
        maxItems: 100,
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMinSize)(1, { message: 'At least one recipient is required' }),
    (0, class_validator_1.ArrayMaxSize)(100, { message: 'Maximum 100 recipients allowed per batch' }),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], BulkSmsDto.prototype, "recipients", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Priority for all messages in batch',
        enum: send_sms_dto_1.SmsPriority,
        default: send_sms_dto_1.SmsPriority.NORMAL,
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], BulkSmsDto.prototype, "priority", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Custom metadata for tracking',
        example: { campaignId: '123', batchId: '456' },
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], BulkSmsDto.prototype, "metadata", void 0);
class BulkSmsResultDto {
    totalRecipients;
    successCount;
    failedCount;
    failures;
    estimatedCost;
    timestamp;
    static _OPENAPI_METADATA_FACTORY() {
        return { totalRecipients: { required: true, type: () => Number }, successCount: { required: true, type: () => Number }, failedCount: { required: true, type: () => Number }, failures: { required: true }, estimatedCost: { required: true, type: () => Number }, timestamp: { required: true, type: () => String } };
    }
}
exports.BulkSmsResultDto = BulkSmsResultDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Total number of recipients',
        example: 50,
    }),
    __metadata("design:type", Number)
], BulkSmsResultDto.prototype, "totalRecipients", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Number of successfully queued messages',
        example: 48,
    }),
    __metadata("design:type", Number)
], BulkSmsResultDto.prototype, "successCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Number of failed messages',
        example: 2,
    }),
    __metadata("design:type", Number)
], BulkSmsResultDto.prototype, "failedCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Failed recipients with error details',
        example: [{ phoneNumber: '+15551234567', error: 'Invalid phone number' }],
    }),
    __metadata("design:type", Array)
], BulkSmsResultDto.prototype, "failures", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Estimated total cost in USD',
        example: 0.36,
    }),
    __metadata("design:type", Number)
], BulkSmsResultDto.prototype, "estimatedCost", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Batch processing timestamp',
        example: '2025-10-28T15:30:00Z',
    }),
    __metadata("design:type", String)
], BulkSmsResultDto.prototype, "timestamp", void 0);
//# sourceMappingURL=bulk-sms.dto.js.map