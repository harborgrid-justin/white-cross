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
exports.SendMessageDto = exports.RecipientDto = exports.RecipientType = exports.MessageType = exports.MessageCategory = exports.MessagePriority = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
var MessagePriority;
(function (MessagePriority) {
    MessagePriority["LOW"] = "LOW";
    MessagePriority["MEDIUM"] = "MEDIUM";
    MessagePriority["HIGH"] = "HIGH";
    MessagePriority["URGENT"] = "URGENT";
})(MessagePriority || (exports.MessagePriority = MessagePriority = {}));
var MessageCategory;
(function (MessageCategory) {
    MessageCategory["EMERGENCY"] = "EMERGENCY";
    MessageCategory["HEALTH_UPDATE"] = "HEALTH_UPDATE";
    MessageCategory["APPOINTMENT_REMINDER"] = "APPOINTMENT_REMINDER";
    MessageCategory["MEDICATION_REMINDER"] = "MEDICATION_REMINDER";
    MessageCategory["GENERAL"] = "GENERAL";
    MessageCategory["INCIDENT_NOTIFICATION"] = "INCIDENT_NOTIFICATION";
    MessageCategory["COMPLIANCE"] = "COMPLIANCE";
})(MessageCategory || (exports.MessageCategory = MessageCategory = {}));
var MessageType;
(function (MessageType) {
    MessageType["EMAIL"] = "EMAIL";
    MessageType["SMS"] = "SMS";
    MessageType["PUSH_NOTIFICATION"] = "PUSH_NOTIFICATION";
    MessageType["VOICE"] = "VOICE";
})(MessageType || (exports.MessageType = MessageType = {}));
var RecipientType;
(function (RecipientType) {
    RecipientType["NURSE"] = "NURSE";
    RecipientType["PARENT"] = "PARENT";
    RecipientType["GUARDIAN"] = "GUARDIAN";
    RecipientType["EMERGENCY_CONTACT"] = "EMERGENCY_CONTACT";
    RecipientType["STUDENT"] = "STUDENT";
    RecipientType["STAFF"] = "STAFF";
    RecipientType["ADMINISTRATOR"] = "ADMINISTRATOR";
})(RecipientType || (exports.RecipientType = RecipientType = {}));
class RecipientDto {
    type;
    id;
    email;
    phoneNumber;
    pushToken;
    preferredLanguage;
    static _OPENAPI_METADATA_FACTORY() {
        return { type: { required: true, enum: require("./send-message.dto").RecipientType }, id: { required: true, type: () => String, format: "uuid" }, email: { required: false, type: () => String }, phoneNumber: { required: false, type: () => String }, pushToken: { required: false, type: () => String }, preferredLanguage: { required: false, type: () => String } };
    }
}
exports.RecipientDto = RecipientDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Type of recipient',
        enum: RecipientType,
        example: RecipientType.PARENT,
    }),
    (0, class_validator_1.IsEnum)(RecipientType),
    __metadata("design:type", String)
], RecipientDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Recipient unique identifier',
        example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], RecipientDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Recipient email address',
        example: 'parent@example.com',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RecipientDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Recipient phone number',
        example: '+1234567890',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RecipientDto.prototype, "phoneNumber", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Push notification token',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RecipientDto.prototype, "pushToken", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Preferred language code',
        example: 'en',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RecipientDto.prototype, "preferredLanguage", void 0);
class SendMessageDto {
    recipients;
    channels;
    subject;
    content;
    priority;
    category;
    templateId;
    scheduledAt;
    attachments;
    translateTo;
    static _OPENAPI_METADATA_FACTORY() {
        return { recipients: { required: true, type: () => [require("./send-message.dto").RecipientDto], minItems: 1 }, channels: { required: false, enum: require("./send-message.dto").MessageType, isArray: true }, subject: { required: false, type: () => String, maxLength: 255 }, content: { required: true, type: () => String, minLength: 1, maxLength: 50000 }, priority: { required: false, enum: require("./send-message.dto").MessagePriority }, category: { required: true, enum: require("./send-message.dto").MessageCategory }, templateId: { required: false, type: () => String, format: "uuid" }, scheduledAt: { required: false, type: () => String }, attachments: { required: false, type: () => [String], format: "uri" }, translateTo: { required: false, type: () => [String] } };
    }
}
exports.SendMessageDto = SendMessageDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'List of message recipients',
        type: [RecipientDto],
        minItems: 1,
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMinSize)(1),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => RecipientDto),
    __metadata("design:type", Array)
], SendMessageDto.prototype, "recipients", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Communication channels to use',
        enum: MessageType,
        isArray: true,
        example: [MessageType.EMAIL, MessageType.SMS],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsEnum)(MessageType, { each: true }),
    __metadata("design:type", Array)
], SendMessageDto.prototype, "channels", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Message subject line',
        maxLength: 255,
        example: 'Important Health Update',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], SendMessageDto.prototype, "subject", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Message content',
        minLength: 1,
        maxLength: 50000,
        example: 'Your child has a scheduled health appointment tomorrow at 2 PM.',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(1),
    (0, class_validator_1.MaxLength)(50000),
    __metadata("design:type", String)
], SendMessageDto.prototype, "content", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Message priority level',
        enum: MessagePriority,
        default: MessagePriority.MEDIUM,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(MessagePriority),
    __metadata("design:type", String)
], SendMessageDto.prototype, "priority", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Message category',
        enum: MessageCategory,
        example: MessageCategory.HEALTH_UPDATE,
    }),
    (0, class_validator_1.IsEnum)(MessageCategory),
    __metadata("design:type", String)
], SendMessageDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Message template ID if using template',
        example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], SendMessageDto.prototype, "templateId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Scheduled delivery time (ISO 8601)',
        example: '2025-10-28T14:00:00Z',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], SendMessageDto.prototype, "scheduledAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Attachment URLs (HTTPS only)',
        type: [String],
        maxItems: 10,
        example: ['https://example.com/consent-form.pdf'],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsUrl)({}, { each: true }),
    __metadata("design:type", Array)
], SendMessageDto.prototype, "attachments", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Target languages for translation',
        type: [String],
        example: ['es', 'fr'],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], SendMessageDto.prototype, "translateTo", void 0);
//# sourceMappingURL=send-message.dto.js.map