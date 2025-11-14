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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TranslationController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const language_translation_service_1 = require("../language-translation.service");
const dto_1 = require("../dto");
const base_1 = require("../../common/base");
let TranslationController = class TranslationController extends base_1.BaseController {
    translationService;
    constructor(translationService) {
        super();
        this.translationService = translationService;
    }
    translateMessage(dto) {
        return this.translationService.translateText(dto.text, dto.targetLanguage);
    }
    detectLanguage(dto) {
        return this.translationService.detectLanguage(dto.text);
    }
    translateBulkMessages(dto) {
        return this.translationService.translateBulk(dto.messages, dto.targetLanguage);
    }
};
exports.TranslationController = TranslationController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Translate message' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Message translated' }),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.TranslateMessageDto]),
    __metadata("design:returntype", void 0)
], TranslationController.prototype, "translateMessage", null);
__decorate([
    (0, common_1.Post)('detect'),
    (0, swagger_1.ApiOperation)({ summary: 'Detect language of text' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Language detected' }),
    openapi.ApiResponse({ status: 201, type: String }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.DetectLanguageDto]),
    __metadata("design:returntype", void 0)
], TranslationController.prototype, "detectLanguage", null);
__decorate([
    (0, common_1.Post)('bulk'),
    (0, swagger_1.ApiOperation)({ summary: 'Translate bulk messages' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Messages translated' }),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.TranslateBulkMessagesDto]),
    __metadata("design:returntype", void 0)
], TranslationController.prototype, "translateBulkMessages", null);
exports.TranslationController = TranslationController = __decorate([
    (0, swagger_1.ApiTags)('Language Translation'),
    (0, common_1.Controller)('enterprise-features/translate'),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [language_translation_service_1.LanguageTranslationService])
], TranslationController);
//# sourceMappingURL=translation.controller.js.map