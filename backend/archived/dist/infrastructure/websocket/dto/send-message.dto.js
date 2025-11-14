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
exports.SendMessageDto = exports.MessageMetadataDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class MessageMetadataDto {
    mentions;
    attachments;
    replyToMessageId;
    static _OPENAPI_METADATA_FACTORY() {
        return { mentions: { required: false, type: () => [String], format: "uuid" }, attachments: { required: false, type: () => [String], format: "uuid" }, replyToMessageId: { required: false, type: () => String, format: "uuid" } };
    }
}
exports.MessageMetadataDto = MessageMetadataDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsUUID)('4', { each: true }),
    __metadata("design:type", Array)
], MessageMetadataDto.prototype, "mentions", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsUUID)('4', { each: true }),
    __metadata("design:type", Array)
], MessageMetadataDto.prototype, "attachments", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)('4'),
    __metadata("design:type", String)
], MessageMetadataDto.prototype, "replyToMessageId", void 0);
class SendMessageDto {
    messageId;
    conversationId;
    content;
    recipientIds;
    metadata;
    static _OPENAPI_METADATA_FACTORY() {
        return { messageId: { required: true, type: () => String, format: "uuid" }, conversationId: { required: true, type: () => String, format: "uuid" }, content: { required: true, type: () => String, maxLength: 10000 }, recipientIds: { required: false, type: () => [String], format: "uuid" }, metadata: { required: false, type: () => require("./send-message.dto").MessageMetadataDto } };
    }
}
exports.SendMessageDto = SendMessageDto;
__decorate([
    (0, class_validator_1.IsUUID)('4'),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], SendMessageDto.prototype, "messageId", void 0);
__decorate([
    (0, class_validator_1.IsUUID)('4'),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], SendMessageDto.prototype, "conversationId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MaxLength)(10000, {
        message: 'Message content cannot exceed 10,000 characters',
    }),
    __metadata("design:type", String)
], SendMessageDto.prototype, "content", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsUUID)('4', { each: true }),
    __metadata("design:type", Array)
], SendMessageDto.prototype, "recipientIds", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => MessageMetadataDto),
    __metadata("design:type", MessageMetadataDto)
], SendMessageDto.prototype, "metadata", void 0);
//# sourceMappingURL=send-message.dto.js.map