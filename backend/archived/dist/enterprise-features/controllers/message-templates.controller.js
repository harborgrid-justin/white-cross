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
exports.MessageTemplatesController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const message_template_library_service_1 = require("../message-template-library.service");
const dto_1 = require("../dto");
const base_1 = require("../../common/base");
let MessageTemplatesController = class MessageTemplatesController extends base_1.BaseController {
    messageTemplateService;
    constructor(messageTemplateService) {
        super();
        this.messageTemplateService = messageTemplateService;
    }
    createTemplate(dto) {
        return this.messageTemplateService.createMessageTemplate(dto.name, dto.category, dto.subject, dto.body, dto.variables, dto.language, dto.createdBy);
    }
    renderTemplate(templateId, dto) {
        return this.messageTemplateService.renderMessageTemplate(templateId, dto.variables);
    }
    getTemplatesByCategory(category) {
        return this.messageTemplateService.getMessageTemplatesByCategory(category);
    }
};
exports.MessageTemplatesController = MessageTemplatesController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create message template' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Template created',
        type: dto_1.MessageTemplateResponseDto,
    }),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateMessageTemplateDto]),
    __metadata("design:returntype", void 0)
], MessageTemplatesController.prototype, "createTemplate", null);
__decorate([
    (0, common_1.Post)(':templateId/render'),
    (0, swagger_1.ApiOperation)({ summary: 'Render message template' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Template rendered' }),
    openapi.ApiResponse({ status: 201, type: String }),
    __param(0, (0, common_1.Param)('templateId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.RenderTemplateDto]),
    __metadata("design:returntype", void 0)
], MessageTemplatesController.prototype, "renderTemplate", null);
__decorate([
    (0, common_1.Get)('category/:category'),
    (0, swagger_1.ApiOperation)({ summary: 'Get templates by category' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Templates retrieved',
        type: [dto_1.MessageTemplateResponseDto],
    }),
    openapi.ApiResponse({ status: 200, type: [Object] }),
    __param(0, (0, common_1.Param)('category')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MessageTemplatesController.prototype, "getTemplatesByCategory", null);
exports.MessageTemplatesController = MessageTemplatesController = __decorate([
    (0, swagger_1.ApiTags)('Message Templates'),
    (0, common_1.Controller)('enterprise-features/message-templates'),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [message_template_library_service_1.MessageTemplateLibraryService])
], MessageTemplatesController);
//# sourceMappingURL=message-templates.controller.js.map