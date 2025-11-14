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
exports.BulkMessageResponseDto = exports.SendBulkMessageDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class SendBulkMessageDto {
    subject;
    body;
    recipients;
    channels;
    static _OPENAPI_METADATA_FACTORY() {
        return { subject: { required: true, type: () => String }, body: { required: true, type: () => String }, recipients: { required: true, type: () => [String] }, channels: { required: true, type: () => [Object] } };
    }
}
exports.SendBulkMessageDto = SendBulkMessageDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Email subject' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SendBulkMessageDto.prototype, "subject", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Message body' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SendBulkMessageDto.prototype, "body", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'List of recipient IDs', type: [String] }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], SendBulkMessageDto.prototype, "recipients", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: ['sms', 'email', 'push'],
        isArray: true,
        description: 'Delivery channels',
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsEnum)(['sms', 'email', 'push'], { each: true }),
    __metadata("design:type", Array)
], SendBulkMessageDto.prototype, "channels", void 0);
class BulkMessageResponseDto {
    id;
    subject;
    body;
    recipients;
    channels;
    status;
    deliveryStats;
    sentAt;
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, subject: { required: true, type: () => String }, body: { required: true, type: () => String }, recipients: { required: true, type: () => [String] }, channels: { required: true, type: () => [Object] }, status: { required: true, type: () => Object }, deliveryStats: { required: true, type: () => ({ sent: { required: true, type: () => Number }, delivered: { required: true, type: () => Number }, failed: { required: true, type: () => Number }, opened: { required: true, type: () => Number } }) }, sentAt: { required: false, type: () => Date } };
    }
}
exports.BulkMessageResponseDto = BulkMessageResponseDto;
//# sourceMappingURL=bulk-messaging.dto.js.map