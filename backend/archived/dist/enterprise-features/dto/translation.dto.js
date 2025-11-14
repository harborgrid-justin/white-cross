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
exports.TranslateBulkMessagesDto = exports.DetectLanguageDto = exports.TranslateMessageDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class TranslateMessageDto {
    text;
    targetLanguage;
    static _OPENAPI_METADATA_FACTORY() {
        return { text: { required: true, type: () => String }, targetLanguage: { required: true, type: () => String } };
    }
}
exports.TranslateMessageDto = TranslateMessageDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Text to translate' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TranslateMessageDto.prototype, "text", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Target language code (e.g., es, fr, zh)' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TranslateMessageDto.prototype, "targetLanguage", void 0);
class DetectLanguageDto {
    text;
    static _OPENAPI_METADATA_FACTORY() {
        return { text: { required: true, type: () => String } };
    }
}
exports.DetectLanguageDto = DetectLanguageDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Text to analyze' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DetectLanguageDto.prototype, "text", void 0);
class TranslateBulkMessagesDto {
    messages;
    targetLanguage;
    static _OPENAPI_METADATA_FACTORY() {
        return { messages: { required: true, type: () => [String] }, targetLanguage: { required: true, type: () => String } };
    }
}
exports.TranslateBulkMessagesDto = TranslateBulkMessagesDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Array of messages to translate',
        type: [String],
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], TranslateBulkMessagesDto.prototype, "messages", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Target language code' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TranslateBulkMessagesDto.prototype, "targetLanguage", void 0);
//# sourceMappingURL=translation.dto.js.map