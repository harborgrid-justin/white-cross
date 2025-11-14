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
exports.SendTemplatedSmsDto = exports.CreateSmsTemplateDto = exports.SmsTemplateType = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
var SmsTemplateType;
(function (SmsTemplateType) {
    SmsTemplateType["ALERT"] = "alert";
    SmsTemplateType["REMINDER"] = "reminder";
    SmsTemplateType["NOTIFICATION"] = "notification";
    SmsTemplateType["VERIFICATION"] = "verification";
    SmsTemplateType["EMERGENCY"] = "emergency";
    SmsTemplateType["CUSTOM"] = "custom";
})(SmsTemplateType || (exports.SmsTemplateType = SmsTemplateType = {}));
class CreateSmsTemplateDto {
    templateId;
    type;
    content;
    description;
    requiredVariables;
    static _OPENAPI_METADATA_FACTORY() {
        return { templateId: { required: true, type: () => String, maxLength: 100 }, type: { required: true, enum: require("./sms-template.dto").SmsTemplateType }, content: { required: true, type: () => String, maxLength: 1600 }, description: { required: false, type: () => String, maxLength: 500 }, requiredVariables: { required: false, type: () => [String] } };
    }
}
exports.CreateSmsTemplateDto = CreateSmsTemplateDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Unique template identifier',
        example: 'medication-reminder',
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], CreateSmsTemplateDto.prototype, "templateId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Template type',
        enum: SmsTemplateType,
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEnum)(SmsTemplateType),
    __metadata("design:type", String)
], CreateSmsTemplateDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Template content with variables (use {{variableName}} syntax)',
        example: 'Hi {{studentName}}, reminder: {{medicationName}} at {{time}}',
        maxLength: 1600,
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(1600),
    __metadata("design:type", String)
], CreateSmsTemplateDto.prototype, "content", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Template description',
        example: 'Template for medication reminders',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], CreateSmsTemplateDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Required variables for this template',
        example: ['studentName', 'medicationName', 'time'],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateSmsTemplateDto.prototype, "requiredVariables", void 0);
class SendTemplatedSmsDto {
    templateId;
    variables;
    static _OPENAPI_METADATA_FACTORY() {
        return { templateId: { required: true, type: () => String }, variables: { required: true, type: () => Object } };
    }
}
exports.SendTemplatedSmsDto = SendTemplatedSmsDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Template identifier',
        example: 'medication-reminder',
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SendTemplatedSmsDto.prototype, "templateId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Variables to substitute in template',
        example: {
            studentName: 'John Doe',
            medicationName: 'Aspirin',
            time: '2:30 PM',
        },
    }),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Object)
], SendTemplatedSmsDto.prototype, "variables", void 0);
//# sourceMappingURL=sms-template.dto.js.map