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
exports.NotificationTemplateService = void 0;
const common_1 = require("@nestjs/common");
const base_1 = require("../../../common/base");
const logger_service_1 = require("../../../common/logging/logger.service");
const enums_1 = require("../enums");
let NotificationTemplateService = class NotificationTemplateService extends base_1.BaseService {
    templates = new Map();
    constructor(logger) {
        super({
            serviceName: 'NotificationTemplateService',
            logger,
            enableAuditLogging: false,
        });
    }
    async onModuleInit() {
        try {
            await this.loadTemplates();
            this.logInfo('NotificationTemplateService initialized successfully');
        }
        catch (error) {
            this.logError('Failed to initialize NotificationTemplateService', error);
        }
    }
    async loadTemplates() {
        const defaultTemplates = [
            {
                id: 'medication-reminder',
                category: enums_1.NotificationCategory.MEDICATION,
                title: 'Medication Reminder',
                body: 'Time to take {{medicationName}} - {{dosage}}',
                variables: ['medicationName', 'dosage'],
                priority: enums_1.NotificationPriority.HIGH,
                sound: 'medication_alert.wav',
            },
            {
                id: 'appointment-reminder',
                category: enums_1.NotificationCategory.APPOINTMENT,
                title: 'Appointment Reminder',
                body: 'Your appointment with {{providerName}} is at {{time}}',
                variables: ['providerName', 'time'],
                priority: enums_1.NotificationPriority.NORMAL,
            },
            {
                id: 'incident-alert',
                category: enums_1.NotificationCategory.INCIDENT,
                title: 'Incident Alert',
                body: 'New incident reported: {{incidentType}} - {{studentName}}',
                variables: ['incidentType', 'studentName'],
                priority: enums_1.NotificationPriority.CRITICAL,
                sound: 'emergency_alert.wav',
            },
            {
                id: 'screening-due',
                category: enums_1.NotificationCategory.SCREENING,
                title: 'Health Screening Due',
                body: '{{screeningType}} screening is due for {{studentName}}',
                variables: ['screeningType', 'studentName'],
                priority: enums_1.NotificationPriority.NORMAL,
            },
            {
                id: 'immunization-reminder',
                category: enums_1.NotificationCategory.IMMUNIZATION,
                title: 'Immunization Reminder',
                body: '{{vaccineName}} immunization due on {{dueDate}}',
                variables: ['vaccineName', 'dueDate'],
                priority: enums_1.NotificationPriority.HIGH,
            },
        ];
        for (const template of defaultTemplates) {
            this.templates.set(template.id, template);
        }
        this.logInfo(`Loaded ${defaultTemplates.length} notification templates`);
    }
    getTemplate(templateId) {
        const template = this.templates.get(templateId);
        if (!template) {
            throw new common_1.NotFoundException(`Template not found: ${templateId}`);
        }
        return template;
    }
    getAllTemplates() {
        return Array.from(this.templates.values());
    }
    getTemplatesByCategory(category) {
        return Array.from(this.templates.values()).filter((template) => template.category === category);
    }
    renderTemplate(templateId, variables) {
        const template = this.getTemplate(templateId);
        let title = template.title;
        let body = template.body;
        for (const [key, value] of Object.entries(variables)) {
            const placeholder = `{{${key}}}`;
            title = title.replace(new RegExp(placeholder, 'g'), value);
            body = body.replace(new RegExp(placeholder, 'g'), value);
        }
        return { title, body };
    }
    validateTemplateVariables(templateId, variables) {
        const template = this.getTemplate(templateId);
        const missing = [];
        for (const requiredVar of template.variables) {
            if (!variables[requiredVar]) {
                missing.push(requiredVar);
            }
        }
        return {
            valid: missing.length === 0,
            missing,
        };
    }
    addTemplate(template) {
        this.templates.set(template.id, template);
        this.logInfo(`Template added/updated: ${template.id}`);
    }
    removeTemplate(templateId) {
        const deleted = this.templates.delete(templateId);
        if (deleted) {
            this.logInfo(`Template removed: ${templateId}`);
        }
        return deleted;
    }
};
exports.NotificationTemplateService = NotificationTemplateService;
exports.NotificationTemplateService = NotificationTemplateService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(logger_service_1.LoggerService)),
    __metadata("design:paramtypes", [logger_service_1.LoggerService])
], NotificationTemplateService);
//# sourceMappingURL=notification-template.service.js.map