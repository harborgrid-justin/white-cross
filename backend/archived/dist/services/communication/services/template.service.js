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
exports.TemplateService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const models_1 = require("../../../database/models");
const base_1 = require("../../../common/base");
let TemplateService = class TemplateService extends base_1.BaseService {
    templateModel;
    constructor(templateModel) {
        super("TemplateService");
        this.templateModel = templateModel;
    }
    async createTemplate(data) {
        this.logInfo(`Creating template: ${data.name}`);
        const subjectValidation = this.validateTemplateContent(data.subject || '');
        const contentValidation = this.validateTemplateContent(data.content);
        if (!contentValidation.isValid) {
            throw new common_1.BadRequestException(`Invalid template content: ${contentValidation.errors.join(', ')}`);
        }
        const allDetectedVariables = [
            ...new Set([...subjectValidation.detectedVariables, ...contentValidation.detectedVariables])
        ];
        const variables = data.variables && data.variables.length > 0
            ? data.variables
            : allDetectedVariables;
        const template = await this.templateModel.create({
            name: data.name,
            subject: data.subject,
            content: data.content,
            type: data.type,
            category: data.category,
            variables,
            isActive: data.isActive !== undefined ? data.isActive : true,
            createdById: data.createdById,
        });
        this.logInfo(`Template created with ${variables.length} variables: ${variables.join(', ')}`);
        return { template: template.toJSON() };
    }
    async getTemplates(type, category, isActive) {
        const where = {};
        if (type)
            where.type = type;
        if (category)
            where.category = category;
        if (isActive !== undefined)
            where.isActive = isActive;
        const templates = await this.templateModel.findAll({
            where,
            order: [['name', 'ASC']],
        });
        return {
            templates: templates.map((t) => t.toJSON()),
        };
    }
    async getTemplateById(id) {
        const template = await this.templateModel.findByPk(id, {
            include: [{ all: true }],
        });
        if (!template) {
            throw new common_1.NotFoundException('Template not found');
        }
        return { template: template.toJSON() };
    }
    async updateTemplate(id, data) {
        const template = await this.templateModel.findByPk(id);
        if (!template) {
            throw new common_1.NotFoundException('Template not found');
        }
        if (data.content) {
            const validation = this.validateTemplateContent(data.content);
            if (!validation.isValid) {
                throw new common_1.BadRequestException(`Invalid template content: ${validation.errors.join(', ')}`);
            }
            if (!data.variables) {
                data.variables = validation.detectedVariables;
            }
        }
        await template.update(data);
        return { template: template.toJSON() };
    }
    async deleteTemplate(id) {
        const template = await this.templateModel.findByPk(id);
        if (!template) {
            throw new common_1.NotFoundException('Template not found');
        }
        await template.destroy();
    }
    async renderTemplate(templateId, variables) {
        const { template } = await this.getTemplateById(templateId);
        if (!template.isActive) {
            throw new common_1.BadRequestException('Cannot render inactive template');
        }
        const missingVariables = template.variables.filter((varName) => !(varName in variables));
        if (missingVariables.length > 0) {
            throw new common_1.BadRequestException(`Missing required variables: ${missingVariables.join(', ')}`);
        }
        const renderedSubject = this.substituteVariables(template.subject || '', variables);
        const renderedContent = this.substituteVariables(template.content, variables);
        const renderedVariables = template.variables.filter((varName) => variables.hasOwnProperty(varName));
        this.logInfo(`Template ${template.name} rendered with variables: ${renderedVariables.join(', ')}`);
        return {
            subject: renderedSubject,
            content: renderedContent,
            renderedVariables,
        };
    }
    validateTemplateContent(content) {
        const errors = [];
        const detectedVariables = [];
        if (!content || content.trim().length === 0) {
            errors.push('Template content cannot be empty');
            return { isValid: false, errors, detectedVariables };
        }
        const openBraces = (content.match(/\{\{/g) || []).length;
        const closeBraces = (content.match(/\}\}/g) || []).length;
        if (openBraces !== closeBraces) {
            errors.push('Mismatched braces in template variables');
        }
        const variablePattern = /\{\{(\s*[\w.]+\s*)\}\}/g;
        let match;
        while ((match = variablePattern.exec(content)) !== null) {
            const varName = match[1].trim();
            if (!/^[\w.]+$/.test(varName)) {
                errors.push(`Invalid variable name: ${varName}`);
            }
            else if (!detectedVariables.includes(varName)) {
                detectedVariables.push(varName);
            }
        }
        const invalidSyntax = content.match(/\{(?!\{)[^}]*\}(?!\})/g);
        if (invalidSyntax && invalidSyntax.length > 0) {
            errors.push('Found single braces - use {{variableName}} syntax');
        }
        return {
            isValid: errors.length === 0,
            errors,
            detectedVariables,
        };
    }
    substituteVariables(template, variables) {
        return template.replace(/\{\{(\s*[\w.]+\s*)\}\}/g, (match, varPath) => {
            const trimmedPath = varPath.trim();
            const value = this.getNestedProperty(variables, trimmedPath);
            if (value === undefined || value === null) {
                this.logWarning(`Variable ${trimmedPath} is null or undefined`);
                return '';
            }
            return this.formatValue(value);
        });
    }
    getNestedProperty(obj, path) {
        return path.split('.').reduce((current, prop) => {
            return current?.[prop];
        }, obj);
    }
    formatValue(value) {
        if (typeof value === 'string') {
            return value;
        }
        if (typeof value === 'number' || typeof value === 'boolean') {
            return String(value);
        }
        if (value instanceof Date) {
            return value.toLocaleString();
        }
        if (Array.isArray(value)) {
            return value.join(', ');
        }
        if (typeof value === 'object') {
            return JSON.stringify(value);
        }
        return String(value);
    }
    async previewTemplate(templateId, sampleVariables) {
        const { template } = await this.getTemplateById(templateId);
        const variablesWithDefaults = { ...sampleVariables };
        template.variables.forEach((varName) => {
            if (!(varName in variablesWithDefaults)) {
                variablesWithDefaults[varName] = `[${varName}]`;
            }
        });
        return this.renderTemplate(templateId, variablesWithDefaults);
    }
};
exports.TemplateService = TemplateService;
exports.TemplateService = TemplateService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(models_1.MessageTemplate)),
    __metadata("design:paramtypes", [Object])
], TemplateService);
//# sourceMappingURL=template.service.js.map