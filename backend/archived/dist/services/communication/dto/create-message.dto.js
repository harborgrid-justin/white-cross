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
exports.CreateMessageDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const message_category_enum_1 = require("../enums/message-category.enum");
const message_priority_enum_1 = require("../enums/message-priority.enum");
const message_type_enum_1 = require("../enums/message-type.enum");
const recipient_dto_1 = require("./recipient.dto");
class CreateMessageDto {
    recipients;
    channels;
    subject;
    content;
    priority;
    category;
    templateId;
    scheduledAt;
    attachments;
    senderId;
    translateTo;
    static _OPENAPI_METADATA_FACTORY() {
        return { recipients: { required: true, type: () => [require("./recipient.dto").RecipientDto], minItems: 1 }, channels: { required: true, enum: require("../enums/message-type.enum").MessageType, isArray: true, minItems: 1 }, subject: { required: false, type: () => String }, content: { required: true, type: () => String }, priority: { required: true, enum: require("../enums/message-priority.enum").MessagePriority }, category: { required: true, enum: require("../enums/message-category.enum").MessageCategory }, templateId: { required: false, type: () => String }, scheduledAt: { required: false, type: () => Date }, attachments: { required: false, type: () => [String] }, senderId: { required: true, type: () => String }, translateTo: { required: false, type: () => [String] } };
    }
}
exports.CreateMessageDto = CreateMessageDto;
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMinSize)(1),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => recipient_dto_1.RecipientDto),
    __metadata("design:type", Array)
], CreateMessageDto.prototype, "recipients", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMinSize)(1),
    (0, class_validator_1.IsEnum)(message_type_enum_1.MessageType, { each: true }),
    __metadata("design:type", Array)
], CreateMessageDto.prototype, "channels", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMessageDto.prototype, "subject", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMessageDto.prototype, "content", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(message_priority_enum_1.MessagePriority),
    __metadata("design:type", String)
], CreateMessageDto.prototype, "priority", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(message_category_enum_1.MessageCategory),
    __metadata("design:type", String)
], CreateMessageDto.prototype, "category", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMessageDto.prototype, "templateId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", Date)
], CreateMessageDto.prototype, "scheduledAt", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateMessageDto.prototype, "attachments", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMessageDto.prototype, "senderId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateMessageDto.prototype, "translateTo", void 0);
//# sourceMappingURL=create-message.dto.js.map