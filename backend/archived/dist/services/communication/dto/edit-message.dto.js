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
exports.EditMessageDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class EditMessageDto {
    content;
    attachments;
    metadata;
    static _OPENAPI_METADATA_FACTORY() {
        return { content: { required: true, type: () => String, minLength: 1, maxLength: 10000 }, attachments: { required: false, type: () => [String], format: "uri" }, metadata: { required: false, type: () => Object } };
    }
}
exports.EditMessageDto = EditMessageDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Updated message content',
        minLength: 1,
        maxLength: 10000,
        example: 'Updated message content',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(1),
    (0, class_validator_1.MaxLength)(10000),
    __metadata("design:type", String)
], EditMessageDto.prototype, "content", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Updated attachments (replaces existing attachments)',
        type: [String],
        maxItems: 10,
        example: ['https://example.com/updated-file.pdf'],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsUrl)({}, { each: true }),
    __metadata("design:type", Array)
], EditMessageDto.prototype, "attachments", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Additional metadata for the edit',
        type: 'object',
        additionalProperties: true,
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], EditMessageDto.prototype, "metadata", void 0);
//# sourceMappingURL=edit-message.dto.js.map