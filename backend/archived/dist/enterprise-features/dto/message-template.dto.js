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
exports.MessageTemplateResponseDto = exports.RenderTemplateDto = exports.CreateMessageTemplateDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class CreateMessageTemplateDto {
    name;
    category;
    subject;
    body;
    variables;
    language;
    createdBy;
    static _OPENAPI_METADATA_FACTORY() {
        return { name: { required: true, type: () => String }, category: { required: true, type: () => String }, subject: { required: true, type: () => String }, body: { required: true, type: () => String }, variables: { required: true, type: () => [String] }, language: { required: true, type: () => String }, createdBy: { required: true, type: () => String } };
    }
}
exports.CreateMessageTemplateDto = CreateMessageTemplateDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Template name' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMessageTemplateDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Template category' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMessageTemplateDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Email subject line' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMessageTemplateDto.prototype, "subject", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Message body template' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMessageTemplateDto.prototype, "body", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'List of variable names in template',
        type: [String],
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateMessageTemplateDto.prototype, "variables", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Language code (e.g., en, es)' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMessageTemplateDto.prototype, "language", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'User who created the template' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMessageTemplateDto.prototype, "createdBy", void 0);
class RenderTemplateDto {
    templateId;
    variables;
    static _OPENAPI_METADATA_FACTORY() {
        return { templateId: { required: true, type: () => String } };
    }
}
exports.RenderTemplateDto = RenderTemplateDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Template ID' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RenderTemplateDto.prototype, "templateId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Variable values for template rendering' }),
    __metadata("design:type", Object)
], RenderTemplateDto.prototype, "variables", void 0);
class MessageTemplateResponseDto {
    id;
    name;
    category;
    subject;
    body;
    variables;
    language;
    createdBy;
    createdAt;
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, name: { required: true, type: () => String }, category: { required: true, type: () => String }, subject: { required: true, type: () => String }, body: { required: true, type: () => String }, variables: { required: true, type: () => [String] }, language: { required: true, type: () => String }, createdBy: { required: true, type: () => String }, createdAt: { required: true, type: () => Date } };
    }
}
exports.MessageTemplateResponseDto = MessageTemplateResponseDto;
//# sourceMappingURL=message-template.dto.js.map