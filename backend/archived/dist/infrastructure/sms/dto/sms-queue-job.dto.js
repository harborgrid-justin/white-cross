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
exports.SmsDeliveryResultDto = exports.SmsQueueJobDto = exports.SmsDeliveryStatus = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const send_sms_dto_1 = require("./send-sms.dto");
var SmsDeliveryStatus;
(function (SmsDeliveryStatus) {
    SmsDeliveryStatus["QUEUED"] = "queued";
    SmsDeliveryStatus["SENDING"] = "sending";
    SmsDeliveryStatus["SENT"] = "sent";
    SmsDeliveryStatus["DELIVERED"] = "delivered";
    SmsDeliveryStatus["FAILED"] = "failed";
    SmsDeliveryStatus["UNDELIVERED"] = "undelivered";
})(SmsDeliveryStatus || (exports.SmsDeliveryStatus = SmsDeliveryStatus = {}));
class SmsQueueJobDto {
    to;
    message;
    priority;
    attemptNumber;
    maxRetries;
    metadata;
    scheduledFor;
    static _OPENAPI_METADATA_FACTORY() {
        return { to: { required: true, type: () => String }, message: { required: true, type: () => String }, priority: { required: true, enum: require("./send-sms.dto").SmsPriority }, attemptNumber: { required: true, type: () => Number }, maxRetries: { required: true, type: () => Number }, metadata: { required: false, type: () => Object }, scheduledFor: { required: false, type: () => String } };
    }
}
exports.SmsQueueJobDto = SmsQueueJobDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Recipient phone number in E.164 format',
        example: '+15551234567',
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SmsQueueJobDto.prototype, "to", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'SMS message content',
        example: 'Your verification code is 123456',
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SmsQueueJobDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'SMS priority',
        enum: send_sms_dto_1.SmsPriority,
    }),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], SmsQueueJobDto.prototype, "priority", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Attempt number for retry logic',
        example: 1,
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], SmsQueueJobDto.prototype, "attemptNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Maximum retry attempts',
        example: 3,
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], SmsQueueJobDto.prototype, "maxRetries", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Custom metadata for tracking',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], SmsQueueJobDto.prototype, "metadata", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Original scheduled time for delivery',
        example: '2025-10-28T15:30:00Z',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SmsQueueJobDto.prototype, "scheduledFor", void 0);
class SmsDeliveryResultDto {
    status;
    messageId;
    to;
    segmentCount;
    cost;
    timestamp;
    error;
    errorCode;
    static _OPENAPI_METADATA_FACTORY() {
        return { status: { required: true, enum: require("./sms-queue-job.dto").SmsDeliveryStatus }, messageId: { required: false, type: () => String }, to: { required: true, type: () => String }, segmentCount: { required: true, type: () => Number }, cost: { required: true, type: () => Number }, timestamp: { required: true, type: () => String }, error: { required: false, type: () => String }, errorCode: { required: false, type: () => String } };
    }
}
exports.SmsDeliveryResultDto = SmsDeliveryResultDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'SMS delivery status',
        enum: SmsDeliveryStatus,
    }),
    __metadata("design:type", String)
], SmsDeliveryResultDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Provider message ID',
        example: 'SM1234567890abcdef',
        required: false,
    }),
    __metadata("design:type", String)
], SmsDeliveryResultDto.prototype, "messageId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Recipient phone number',
        example: '+15551234567',
    }),
    __metadata("design:type", String)
], SmsDeliveryResultDto.prototype, "to", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Number of message segments',
        example: 1,
    }),
    __metadata("design:type", Number)
], SmsDeliveryResultDto.prototype, "segmentCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Estimated cost in USD',
        example: 0.0075,
    }),
    __metadata("design:type", Number)
], SmsDeliveryResultDto.prototype, "cost", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Timestamp of delivery',
        example: '2025-10-28T15:30:00Z',
    }),
    __metadata("design:type", String)
], SmsDeliveryResultDto.prototype, "timestamp", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Error message if delivery failed',
        required: false,
    }),
    __metadata("design:type", String)
], SmsDeliveryResultDto.prototype, "error", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Provider-specific error code',
        required: false,
    }),
    __metadata("design:type", String)
], SmsDeliveryResultDto.prototype, "errorCode", void 0);
//# sourceMappingURL=sms-queue-job.dto.js.map