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
exports.MessageTemplateLibraryService = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const template_validation_helper_1 = require("./helpers/template-validation.helper");
const base_1 = require("../common/base");
let MessageTemplateLibraryService = class MessageTemplateLibraryService extends base_1.BaseService {
    eventEmitter;
    messageTemplates = [];
    constructor(eventEmitter) {
        super('MessageTemplateLibraryService');
        this.eventEmitter = eventEmitter;
    }
    createMessageTemplate(name, category, subject, body, variables, language, createdBy) {
        try {
            template_validation_helper_1.TemplateValidationHelper.validateTemplateParameters(name, category, subject, body, variables, language);
            const template = {
                id: `MT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                name,
                category,
                subject,
                body,
                variables,
                language,
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date(),
                createdBy,
                usageCount: 0,
            };
            this.messageTemplates.push(template);
            this.eventEmitter.emit('message.template.created', {
                templateId: template.id,
                name,
                category,
                createdBy,
                timestamp: new Date(),
            });
            this.logInfo('Message template created', {
                templateId: template.id,
                name,
                category,
                createdBy,
            });
            return template;
        }
        catch (error) {
            this.logError('Error creating message template', {
                error: error instanceof Error ? error.message : String(error),
                name,
                category,
            });
            throw error;
        }
    }
    updateMessageTemplate(templateId, updates, updatedBy) {
        try {
            template_validation_helper_1.TemplateValidationHelper.validateUpdateParameters(templateId, updates, updatedBy);
            const template = this.messageTemplates.find((t) => t.id === templateId);
            if (!template) {
                throw new Error(`Message template not found: ${templateId}`);
            }
            const updatedTemplate = {
                ...template,
                ...updates,
                updatedAt: new Date(),
            };
            const index = this.messageTemplates.findIndex((t) => t.id === templateId);
            this.messageTemplates[index] = updatedTemplate;
            this.eventEmitter.emit('message.template.updated', {
                templateId,
                updatedBy,
                changes: Object.keys(updates),
                timestamp: new Date(),
            });
            this.logInfo('Message template updated', {
                templateId,
                updatedBy,
                changes: Object.keys(updates),
            });
            return updatedTemplate;
        }
        catch (error) {
            this.logError('Error updating message template', {
                error: error instanceof Error ? error.message : String(error),
                templateId,
            });
            throw error;
        }
    }
    getMessageTemplate(templateId) {
        try {
            template_validation_helper_1.TemplateValidationHelper.validateTemplateId(templateId);
            const template = this.messageTemplates.find((t) => t.id === templateId);
            if (!template) {
                this.logWarning('Message template not found', { templateId });
                return null;
            }
            this.logInfo('Message template retrieved', { templateId });
            return template;
        }
        catch (error) {
            this.logError('Error retrieving message template', {
                error: error instanceof Error ? error.message : String(error),
                templateId,
            });
            return null;
        }
    }
    getMessageTemplatesByCategory(category) {
        try {
            template_validation_helper_1.TemplateValidationHelper.validateCategory(category);
            const templates = this.messageTemplates.filter((t) => t.category === category && t.isActive);
            this.logInfo('Message templates retrieved by category', {
                category,
                count: templates.length,
            });
            return templates;
        }
        catch (error) {
            this.logError('Error retrieving message templates by category', {
                error: error instanceof Error ? error.message : String(error),
                category,
            });
            return [];
        }
    }
    getAllActiveMessageTemplates() {
        try {
            const activeTemplates = this.messageTemplates.filter((t) => t.isActive);
            this.logInfo('All active message templates retrieved', {
                count: activeTemplates.length,
            });
            return activeTemplates;
        }
        catch (error) {
            this.logError('Error retrieving active message templates', {
                error: error instanceof Error ? error.message : String(error),
            });
            return [];
        }
    }
    renderMessageTemplate(templateId, variables) {
        try {
            template_validation_helper_1.TemplateValidationHelper.validateRenderParameters(templateId, variables);
            const template = this.messageTemplates.find((t) => t.id === templateId);
            if (!template) {
                throw new Error(`Message template not found: ${templateId}`);
            }
            if (!template.isActive) {
                throw new Error(`Message template is not active: ${templateId}`);
            }
            let renderedContent = template.body;
            for (const [key, value] of Object.entries(variables)) {
                const placeholder = `{{${key}}}`;
                renderedContent = renderedContent.replace(new RegExp(placeholder, 'g'), value);
            }
            const missingVars = template_validation_helper_1.TemplateValidationHelper.findMissingVariables(renderedContent);
            if (missingVars.length > 0) {
                throw new Error(`Missing required variables: ${missingVars.join(', ')}`);
            }
            template.usageCount += 1;
            this.eventEmitter.emit('message.template.rendered', {
                templateId,
                variables: Object.keys(variables),
                timestamp: new Date(),
            });
            this.logInfo('Message template rendered', {
                templateId,
                variablesCount: Object.keys(variables).length,
            });
            return renderedContent;
        }
        catch (error) {
            this.logError('Error rendering message template', {
                error: error instanceof Error ? error.message : String(error),
                templateId,
            });
            throw error;
        }
    }
    deleteMessageTemplate(templateId, deletedBy) {
        try {
            template_validation_helper_1.TemplateValidationHelper.validateDeleteParameters(templateId, deletedBy);
            const template = this.messageTemplates.find((t) => t.id === templateId);
            if (!template) {
                throw new Error(`Message template not found: ${templateId}`);
            }
            template.isActive = false;
            template.updatedAt = new Date();
            this.eventEmitter.emit('message.template.deleted', {
                templateId,
                deletedBy,
                timestamp: new Date(),
            });
            this.logInfo('Message template deleted', { templateId, deletedBy });
            return true;
        }
        catch (error) {
            this.logError('Error deleting message template', {
                error: error instanceof Error ? error.message : String(error),
                templateId,
            });
            return false;
        }
    }
    getTemplateUsageStatistics() {
        try {
            const stats = {};
            for (const template of this.messageTemplates) {
                if (template.isActive) {
                    stats[template.id] = template.usageCount;
                }
            }
            this.logInfo('Template usage statistics retrieved', {
                templateCount: Object.keys(stats).length,
            });
            return stats;
        }
        catch (error) {
            this.logError('Error retrieving template usage statistics', {
                error: error instanceof Error ? error.message : String(error),
            });
            return {};
        }
    }
    cloneMessageTemplate(templateId, newName, clonedBy) {
        try {
            template_validation_helper_1.TemplateValidationHelper.validateCloneParameters(templateId, newName, clonedBy);
            const originalTemplate = this.messageTemplates.find((t) => t.id === templateId);
            if (!originalTemplate) {
                throw new Error(`Message template not found: ${templateId}`);
            }
            const clonedTemplate = {
                ...originalTemplate,
                id: `MT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                name: newName,
                createdAt: new Date(),
                updatedAt: new Date(),
                createdBy: clonedBy,
                usageCount: 0,
            };
            this.messageTemplates.push(clonedTemplate);
            this.eventEmitter.emit('message.template.cloned', {
                originalTemplateId: templateId,
                newTemplateId: clonedTemplate.id,
                clonedBy,
                timestamp: new Date(),
            });
            this.logInfo('Message template cloned', {
                originalTemplateId: templateId,
                newTemplateId: clonedTemplate.id,
                clonedBy,
            });
            return clonedTemplate;
        }
        catch (error) {
            this.logError('Error cloning message template', {
                error: error instanceof Error ? error.message : String(error),
                templateId,
            });
            throw error;
        }
    }
};
exports.MessageTemplateLibraryService = MessageTemplateLibraryService;
exports.MessageTemplateLibraryService = MessageTemplateLibraryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [event_emitter_1.EventEmitter2])
], MessageTemplateLibraryService);
//# sourceMappingURL=message-template-library.service.js.map