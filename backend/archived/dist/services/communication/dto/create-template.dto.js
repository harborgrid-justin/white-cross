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
exports.UpdateTemplateDto = exports.CreateTemplateDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const send_message_dto_1 = require("./send-message.dto");
class CreateTemplateDto {
    name;
    subject;
    content;
    type;
    category;
    variables;
    isActive;
    static _OPENAPI_METADATA_FACTORY() {
        return { name: { required: true, type: () => String, minLength: 3, maxLength: 100 }, subject: { required: false, type: () => String, maxLength: 255 }, content: { required: true, type: () => String, minLength: 1, maxLength: 50000 }, type: { required: true, enum: require("./send-message.dto").MessageType }, category: { required: true, enum: require("./send-message.dto").MessageCategory }, variables: { required: false, type: () => [String] }, isActive: { required: false, type: () => Boolean } };
    }
}
exports.CreateTemplateDto = CreateTemplateDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Template name',
        minLength: 3,
        maxLength: 100,
        example: 'Appointment Reminder Template',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(3),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], CreateTemplateDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Template subject line',
        maxLength: 255,
        example: 'Appointment Reminder for {{studentName}}',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], CreateTemplateDto.prototype, "subject", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Template content with variable placeholders',
        minLength: 1,
        maxLength: 50000,
        example: 'Dear {{parentName}}, this is a reminder that {{studentName}} has an appointment on {{date}} at {{time}}.',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(1),
    (0, class_validator_1.MaxLength)(50000),
    __metadata("design:type", String)
], CreateTemplateDto.prototype, "content", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Message type for this template',
        enum: send_message_dto_1.MessageType,
        example: send_message_dto_1.MessageType.EMAIL,
    }),
    (0, class_validator_1.IsEnum)(send_message_dto_1.MessageType),
    __metadata("design:type", String)
], CreateTemplateDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Message category',
        enum: send_message_dto_1.MessageCategory,
        example: send_message_dto_1.MessageCategory.APPOINTMENT_REMINDER,
    }),
    (0, class_validator_1.IsEnum)(send_message_dto_1.MessageCategory),
    __metadata("design:type", String)
], CreateTemplateDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Template variable names',
        type: [String],
        example: ['studentName', 'parentName', 'date', 'time'],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateTemplateDto.prototype, "variables", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Whether template is active',
        default: true,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateTemplateDto.prototype, "isActive", void 0);
class UpdateTemplateDto {
    name;
    subject;
    content;
    type;
    category;
    variables;
    isActive;
    static _OPENAPI_METADATA_FACTORY() {
        return { name: { required: false, type: () => String, minLength: 3, maxLength: 100 }, subject: { required: false, type: () => String, maxLength: 255 }, content: { required: false, type: () => String, minLength: 1, maxLength: 50000 }, type: { required: false, enum: require("./send-message.dto").MessageType }, category: { required: false, enum: require("./send-message.dto").MessageCategory }, variables: { required: false, type: () => [String] }, isActive: { required: false, type: () => Boolean } };
    }
}
exports.UpdateTemplateDto = UpdateTemplateDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Template name',
        minLength: 3,
        maxLength: 100,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(3),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], UpdateTemplateDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Template subject line',
        maxLength: 255,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], UpdateTemplateDto.prototype, "subject", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Template content',
        minLength: 1,
        maxLength: 50000,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(1),
    (0, class_validator_1.MaxLength)(50000),
    __metadata("design:type", String)
], UpdateTemplateDto.prototype, "content", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Message type',
        enum: send_message_dto_1.MessageType,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(send_message_dto_1.MessageType),
    __metadata("design:type", String)
], UpdateTemplateDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Message category',
        enum: send_message_dto_1.MessageCategory,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(send_message_dto_1.MessageCategory),
    __metadata("design:type", String)
], UpdateTemplateDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Template variables',
        type: [String],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], UpdateTemplateDto.prototype, "variables", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Whether template is active',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateTemplateDto.prototype, "isActive", void 0);
//# sourceMappingURL=create-template.dto.js.map