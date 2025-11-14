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
exports.SmsTemplateService = void 0;
const common_1 = require("@nestjs/common");
const sms_template_dto_1 = require("../dto/sms-template.dto");
const base_1 = require("../../../common/base");
let SmsTemplateService = class SmsTemplateService extends base_1.BaseService {
    templates = new Map();
    constructor() {
        super('SmsTemplateService');
        this.initializeDefaultTemplates();
    }
    async createTemplate(dto) {
        const detectedVariables = this.extractVariables(dto.content);
        const requiredVars = dto.requiredVariables || detectedVariables;
        const missingVars = requiredVars.filter((v) => !detectedVariables.includes(v));
        if (missingVars.length > 0) {
            throw new common_1.BadRequestException(`Required variables not found in template content: ${missingVars.join(', ')}`);
        }
        const template = {
            templateId: dto.templateId,
            type: dto.type,
            content: dto.content,
            description: dto.description,
            requiredVariables: requiredVars,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        this.templates.set(dto.templateId, template);
        this.logInfo(`Created SMS template: ${dto.templateId}`);
        return template;
    }
    async getTemplate(templateId) {
        const template = this.templates.get(templateId);
        if (!template) {
            throw new common_1.NotFoundException(`SMS template not found: ${templateId}`);
        }
        return template;
    }
    async renderTemplate(templateId, variables) {
        const template = await this.getTemplate(templateId);
        const missingVars = template.requiredVariables.filter((varName) => !(varName in variables));
        if (missingVars.length > 0) {
            throw new common_1.BadRequestException(`Missing required variables for template ${templateId}: ${missingVars.join(', ')}`);
        }
        let rendered = template.content;
        for (const [key, value] of Object.entries(variables)) {
            const placeholder = `{{${key}}}`;
            const stringValue = this.formatVariableValue(value);
            rendered = rendered.replace(new RegExp(placeholder, 'g'), stringValue);
        }
        const unreplaced = this.extractVariables(rendered);
        if (unreplaced.length > 0) {
            this.logWarning(`Template ${templateId} has unreplaced variables: ${unreplaced.join(', ')}`);
        }
        this.logDebug(`Rendered template ${templateId}: ${rendered}`);
        return rendered;
    }
    async listTemplates(type) {
        const allTemplates = Array.from(this.templates.values());
        if (type) {
            return allTemplates.filter((t) => t.type === type);
        }
        return allTemplates;
    }
    async deleteTemplate(templateId) {
        const deleted = this.templates.delete(templateId);
        if (deleted) {
            this.logInfo(`Deleted SMS template: ${templateId}`);
        }
        return deleted;
    }
    async templateExists(templateId) {
        return this.templates.has(templateId);
    }
    async validateTemplateContent(content) {
        const errors = [];
        const variables = this.extractVariables(content);
        const openBraces = (content.match(/\{\{/g) || []).length;
        const closeBraces = (content.match(/\}\}/g) || []).length;
        if (openBraces !== closeBraces) {
            errors.push('Malformed template: mismatched variable braces');
        }
        if (!content.trim()) {
            errors.push('Template content cannot be empty');
        }
        if (content.length > 1600) {
            errors.push('Template content exceeds maximum SMS length (1600 characters)');
        }
        return {
            isValid: errors.length === 0,
            variables,
            errors,
        };
    }
    extractVariables(content) {
        const regex = /\{\{(\w+)\}\}/g;
        const variables = [];
        let match;
        while ((match = regex.exec(content)) !== null) {
            if (!variables.includes(match[1])) {
                variables.push(match[1]);
            }
        }
        return variables;
    }
    formatVariableValue(value) {
        if (value === null || value === undefined) {
            return '';
        }
        if (typeof value === 'object') {
            if (value instanceof Date) {
                return value.toLocaleString();
            }
            return JSON.stringify(value);
        }
        return String(value);
    }
    initializeDefaultTemplates() {
        const defaultTemplates = [
            {
                templateId: 'medication-reminder',
                type: sms_template_dto_1.SmsTemplateType.REMINDER,
                content: 'Hi {{studentName}}, reminder: {{medicationName}} at {{time}}. - {{schoolName}}',
                description: 'Medication reminder for students',
                requiredVariables: [
                    'studentName',
                    'medicationName',
                    'time',
                    'schoolName',
                ],
            },
            {
                templateId: 'emergency-alert',
                type: sms_template_dto_1.SmsTemplateType.EMERGENCY,
                content: '[URGENT] {{studentName}} requires immediate attention: {{reason}}. Contact {{contactNumber}}',
                description: 'Emergency alert for critical situations',
                requiredVariables: ['studentName', 'reason', 'contactNumber'],
            },
            {
                templateId: 'appointment-reminder',
                type: sms_template_dto_1.SmsTemplateType.REMINDER,
                content: 'Reminder: {{studentName}} has a {{appointmentType}} appointment on {{date}} at {{time}}',
                description: 'Appointment reminder',
                requiredVariables: ['studentName', 'appointmentType', 'date', 'time'],
            },
            {
                templateId: 'verification-code',
                type: sms_template_dto_1.SmsTemplateType.VERIFICATION,
                content: 'Your White Cross verification code is: {{code}}. Valid for {{expiryMinutes}} minutes.',
                description: 'Verification code for authentication',
                requiredVariables: ['code', 'expiryMinutes'],
            },
            {
                templateId: 'illness-notification',
                type: sms_template_dto_1.SmsTemplateType.NOTIFICATION,
                content: '{{studentName}} visited the health office today for {{reason}}. {{action}} - {{schoolName}}',
                description: 'Illness notification to parents',
                requiredVariables: ['studentName', 'reason', 'action', 'schoolName'],
            },
            {
                templateId: 'consent-required',
                type: sms_template_dto_1.SmsTemplateType.NOTIFICATION,
                content: 'Consent required for {{studentName}}: {{description}}. Please respond or visit {{portalUrl}}',
                description: 'Parent consent request',
                requiredVariables: ['studentName', 'description', 'portalUrl'],
            },
        ];
        defaultTemplates.forEach((dto) => {
            try {
                this.createTemplate(dto);
            }
            catch (error) {
                this.logError(`Failed to create default template ${dto.templateId}: ${error.message}`);
            }
        });
        this.logInfo(`Initialized ${defaultTemplates.length} default SMS templates`);
    }
};
exports.SmsTemplateService = SmsTemplateService;
exports.SmsTemplateService = SmsTemplateService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], SmsTemplateService);
//# sourceMappingURL=sms-template.service.js.map