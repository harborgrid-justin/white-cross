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
exports.NotificationResultDto = exports.ContactInfoDto = exports.ChannelResultDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
class ChannelResultDto {
    success;
    messageId;
    callId;
    error;
    static _OPENAPI_METADATA_FACTORY() {
        return { success: { required: true, type: () => Boolean }, messageId: { required: false, type: () => String }, callId: { required: false, type: () => String }, error: { required: false, type: () => String } };
    }
}
exports.ChannelResultDto = ChannelResultDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Whether the notification was successful',
        example: true,
    }),
    __metadata("design:type", Boolean)
], ChannelResultDto.prototype, "success", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Message ID or call ID if successful',
        example: 'sms_1234567890',
    }),
    __metadata("design:type", String)
], ChannelResultDto.prototype, "messageId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Call ID if voice notification',
        example: 'call_1234567890',
    }),
    __metadata("design:type", String)
], ChannelResultDto.prototype, "callId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Error message if unsuccessful',
        example: 'Phone number is invalid',
    }),
    __metadata("design:type", String)
], ChannelResultDto.prototype, "error", void 0);
class ContactInfoDto {
    firstName;
    lastName;
    phoneNumber;
    email;
    static _OPENAPI_METADATA_FACTORY() {
        return { firstName: { required: true, type: () => String }, lastName: { required: true, type: () => String }, phoneNumber: { required: true, type: () => String }, email: { required: false, type: () => String } };
    }
}
exports.ContactInfoDto = ContactInfoDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Contact first name',
        example: 'Jane',
    }),
    __metadata("design:type", String)
], ContactInfoDto.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Contact last name',
        example: 'Doe',
    }),
    __metadata("design:type", String)
], ContactInfoDto.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Contact phone number',
        example: '+1-555-123-4567',
    }),
    __metadata("design:type", String)
], ContactInfoDto.prototype, "phoneNumber", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Contact email address',
        example: 'jane.doe@example.com',
    }),
    __metadata("design:type", String)
], ContactInfoDto.prototype, "email", void 0);
class NotificationResultDto {
    contactId;
    contact;
    channels;
    timestamp;
    static _OPENAPI_METADATA_FACTORY() {
        return { contactId: { required: true, type: () => String }, contact: { required: true, type: () => require("./notification-result.dto").ContactInfoDto }, channels: { required: true, type: () => ({ sms: { required: false, type: () => require("./notification-result.dto").ChannelResultDto }, email: { required: false, type: () => require("./notification-result.dto").ChannelResultDto }, voice: { required: false, type: () => require("./notification-result.dto").ChannelResultDto } }) }, timestamp: { required: true, type: () => Date } };
    }
}
exports.NotificationResultDto = NotificationResultDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Emergency contact ID',
        example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    __metadata("design:type", String)
], NotificationResultDto.prototype, "contactId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Contact information',
        type: ContactInfoDto,
    }),
    __metadata("design:type", ContactInfoDto)
], NotificationResultDto.prototype, "contact", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Results per notification channel',
        example: {
            sms: { success: true, messageId: 'sms_1234567890' },
            email: { success: true, messageId: 'email_0987654321' },
        },
    }),
    __metadata("design:type", Object)
], NotificationResultDto.prototype, "channels", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Timestamp when notification was sent',
        example: '2025-10-28T02:45:00Z',
    }),
    __metadata("design:type", Date)
], NotificationResultDto.prototype, "timestamp", void 0);
//# sourceMappingURL=notification-result.dto.js.map