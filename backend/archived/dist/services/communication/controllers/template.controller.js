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
exports.TemplateController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const template_service_1 = require("../services/template.service");
const create_template_dto_1 = require("../dto/create-template.dto");
const base_1 = require("../../../common/base");
let TemplateController = class TemplateController extends base_1.BaseController {
    templateService;
    constructor(templateService) {
        super();
        this.templateService = templateService;
    }
    async createTemplate(dto, req) {
        const createdById = req.user?.id;
        return this.templateService.createTemplate({ ...dto, createdById });
    }
    async listTemplates(type, category, isActive) {
        return this.templateService.getTemplates(type, category, isActive);
    }
    async getTemplateById(id) {
        return this.templateService.getTemplateById(id);
    }
    async updateTemplate(id, dto) {
        return this.templateService.updateTemplate(id, dto);
    }
    async deleteTemplate(id) {
        await this.templateService.deleteTemplate(id);
    }
};
exports.TemplateController = TemplateController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Create message template',
        description: 'Create a reusable message template with variables',
    }),
    (0, swagger_1.ApiBody)({ type: create_template_dto_1.CreateTemplateDto }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Template created successfully',
        schema: {
            example: {
                template: {
                    id: '123e4567-e89b-12d3-a456-426614174000',
                    name: 'Appointment Reminder',
                    subject: 'Appointment for {{studentName}}',
                    content: 'Dear {{parentName}}, reminder for {{studentName}}...',
                    type: 'EMAIL',
                    category: 'APPOINTMENT_REMINDER',
                    variables: ['studentName', 'parentName', 'date', 'time'],
                    isActive: true,
                    createdAt: '2025-10-28T10:00:00Z',
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid template data' }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_template_dto_1.CreateTemplateDto, Object]),
    __metadata("design:returntype", Promise)
], TemplateController.prototype, "createTemplate", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({
        summary: 'List message templates',
        description: 'Get filtered list of message templates',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'type',
        required: false,
        enum: ['EMAIL', 'SMS', 'PUSH_NOTIFICATION', 'VOICE'],
    }),
    (0, swagger_1.ApiQuery)({ name: 'category', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'isActive', required: false, type: Boolean, example: true }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Templates retrieved successfully',
        schema: {
            example: {
                templates: [
                    {
                        id: '123e4567-e89b-12d3-a456-426614174000',
                        name: 'Appointment Reminder',
                        type: 'EMAIL',
                        category: 'APPOINTMENT_REMINDER',
                        isActive: true,
                    },
                ],
            },
        },
    }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)('type')),
    __param(1, (0, common_1.Query)('category')),
    __param(2, (0, common_1.Query)('isActive')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Boolean]),
    __metadata("design:returntype", Promise)
], TemplateController.prototype, "listTemplates", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get template by ID',
        description: 'Retrieve detailed information about a template',
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Template ID (UUID)' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Template retrieved successfully',
        schema: {
            example: {
                template: {
                    id: '123e4567-e89b-12d3-a456-426614174000',
                    name: 'Appointment Reminder',
                    subject: 'Appointment for {{studentName}}',
                    content: 'Full template content...',
                    type: 'EMAIL',
                    category: 'APPOINTMENT_REMINDER',
                    variables: ['studentName', 'parentName', 'date', 'time'],
                    isActive: true,
                    createdBy: {
                        id: '456e7890-e89b-12d3-a456-426614174000',
                        firstName: 'John',
                        lastName: 'Doe',
                    },
                    createdAt: '2025-10-28T10:00:00Z',
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Template not found' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TemplateController.prototype, "getTemplateById", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Update message template',
        description: 'Update an existing message template',
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Template ID (UUID)' }),
    (0, swagger_1.ApiBody)({ type: create_template_dto_1.UpdateTemplateDto }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Template updated successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Template not found' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_template_dto_1.UpdateTemplateDto]),
    __metadata("design:returntype", Promise)
], TemplateController.prototype, "updateTemplate", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({
        summary: 'Delete message template',
        description: 'Permanently delete a message template',
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Template ID (UUID)' }),
    (0, swagger_1.ApiResponse)({
        status: 204,
        description: 'Template deleted successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Template not found' }),
    openapi.ApiResponse({ status: common_1.HttpStatus.NO_CONTENT }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TemplateController.prototype, "deleteTemplate", null);
exports.TemplateController = TemplateController = __decorate([
    (0, swagger_1.ApiTags)('Message Templates'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('templates'),
    __metadata("design:paramtypes", [template_service_1.TemplateService])
], TemplateController);
//# sourceMappingURL=template.controller.js.map