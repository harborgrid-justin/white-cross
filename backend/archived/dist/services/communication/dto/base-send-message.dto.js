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
exports.BaseSendMessageDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class BaseSendMessageDto {
    content;
    attachments;
    parentId;
    encrypted;
    metadata;
    static _OPENAPI_METADATA_FACTORY() {
        return { content: { required: true, type: () => String, minLength: 1, maxLength: 10000 }, attachments: { required: false, type: () => [String], format: "uri" }, parentId: { required: false, type: () => String }, encrypted: { required: false, type: () => Boolean }, metadata: { required: false, type: () => Object } };
    }
}
exports.BaseSendMessageDto = BaseSendMessageDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Message content',
        minLength: 1,
        maxLength: 10000,
        example: 'Hello!',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(1),
    (0, class_validator_1.MaxLength)(10000),
    __metadata("design:type", String)
], BaseSendMessageDto.prototype, "content", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Message attachments (file URLs)',
        type: [String],
        maxItems: 10,
        example: ['https://example.com/file.pdf'],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsUrl)({}, { each: true }),
    __metadata("design:type", Array)
], BaseSendMessageDto.prototype, "attachments", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Parent message ID for threaded replies',
        example: '789e0123-e89b-12d3-a456-426614174000',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BaseSendMessageDto.prototype, "parentId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Whether to encrypt the message content',
        default: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], BaseSendMessageDto.prototype, "encrypted", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Additional metadata for the message',
        type: 'object',
        additionalProperties: true,
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], BaseSendMessageDto.prototype, "metadata", void 0);
//# sourceMappingURL=base-send-message.dto.js.map