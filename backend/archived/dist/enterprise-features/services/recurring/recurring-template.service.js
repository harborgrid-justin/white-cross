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
exports.RecurringTemplateService = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const enterprise_features_constants_1 = require("../../enterprise-features-constants");
const base_1 = require("../../../common/base");
let RecurringTemplateService = class RecurringTemplateService extends base_1.BaseService {
    eventEmitter;
    templates = [];
    constructor(eventEmitter) {
        super('RecurringTemplateService');
        this.eventEmitter = eventEmitter;
    }
    createRecurringTemplate(data) {
        try {
            const template = {
                ...data,
                id: `${enterprise_features_constants_1.ENTERPRISE_CONSTANTS.ID_PREFIXES.RECURRING_TEMPLATE}${Date.now()}`,
                createdAt: new Date(),
            };
            this.templates.push(template);
            this.logInfo('Recurring appointment template created', {
                templateId: template.id,
                appointmentType: template.appointmentType,
                frequency: template.recurrenceRule.frequency,
            });
            this.eventEmitter.emit('recurring-template.created', {
                template,
                timestamp: new Date(),
            });
            return template;
        }
        catch (error) {
            this.logError('Error creating recurring template', {
                error: error instanceof Error ? error.message : String(error),
            });
            throw error;
        }
    }
    getActiveTemplates() {
        try {
            const activeTemplates = this.templates.filter(template => template.isActive);
            this.logInfo('Active templates retrieved', { count: activeTemplates.length });
            return activeTemplates;
        }
        catch (error) {
            this.logError('Error getting active templates', {
                error: error instanceof Error ? error.message : String(error),
            });
            throw error;
        }
    }
    getTemplatesByAppointmentType(appointmentType) {
        try {
            const filteredTemplates = this.templates.filter(template => template.appointmentType === appointmentType && template.isActive);
            this.logInfo('Templates retrieved by appointment type', {
                appointmentType,
                count: filteredTemplates.length,
            });
            return filteredTemplates;
        }
        catch (error) {
            this.logError('Error getting templates by appointment type', {
                error: error instanceof Error ? error.message : String(error),
                appointmentType,
            });
            throw error;
        }
    }
    updateRecurringTemplate(templateId, updates) {
        try {
            const templateIndex = this.templates.findIndex(template => template.id === templateId);
            if (templateIndex === -1) {
                this.logWarning('Template not found for update', { templateId });
                return null;
            }
            if (updates.recurrenceRule) {
                this.validateRecurrenceRule(updates.recurrenceRule);
            }
            this.templates[templateIndex] = {
                ...this.templates[templateIndex],
                ...updates,
                updatedAt: new Date(),
            };
            const updatedTemplate = this.templates[templateIndex];
            this.logInfo('Recurring template updated', {
                templateId,
                updates: Object.keys(updates),
            });
            this.eventEmitter.emit('recurring-template.updated', {
                template: updatedTemplate,
                updates,
                timestamp: new Date(),
            });
            return updatedTemplate;
        }
        catch (error) {
            this.logError('Error updating recurring template', {
                error: error instanceof Error ? error.message : String(error),
                templateId,
            });
            throw error;
        }
    }
    cancelRecurringSeries(templateId, cancelledBy, reason) {
        try {
            const templateIndex = this.templates.findIndex(template => template.id === templateId);
            if (templateIndex === -1) {
                this.logWarning('Template not found for cancellation', { templateId });
                return false;
            }
            this.templates[templateIndex].isActive = false;
            this.templates[templateIndex].cancelledAt = new Date();
            this.templates[templateIndex].cancellationReason = reason;
            this.templates[templateIndex].updatedAt = new Date();
            this.logInfo('Recurring series cancelled', {
                templateId,
                cancelledBy,
                reason,
            });
            this.eventEmitter.emit('recurring-template.cancelled', {
                template: this.templates[templateIndex],
                cancelledBy,
                reason,
                timestamp: new Date(),
            });
            return true;
        }
        catch (error) {
            this.logError('Error cancelling recurring series', {
                error: error instanceof Error ? error.message : String(error),
                templateId,
            });
            throw error;
        }
    }
    getAllTemplates() {
        return this.templates;
    }
    validateRecurrenceRule(recurrenceRule) {
        if (!recurrenceRule || typeof recurrenceRule !== 'object') {
            throw new Error('Recurrence rule is required and must be an object');
        }
        if (!recurrenceRule.frequency) {
            throw new Error('Recurrence frequency is required');
        }
        if (recurrenceRule.interval < 1) {
            throw new Error('Recurrence interval must be at least 1');
        }
        if (recurrenceRule.interval > 52) {
            throw new Error('Recurrence interval cannot exceed maximum allowed value');
        }
        if (recurrenceRule.endDate && recurrenceRule.endDate <= new Date()) {
            throw new Error('End date must be in the future');
        }
        if (recurrenceRule.frequency === 'weekly' && recurrenceRule.daysOfWeek) {
            const validDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
            const invalidDays = recurrenceRule.daysOfWeek.filter((day) => !validDays.includes(day.toLowerCase()));
            if (invalidDays.length > 0) {
                throw new Error(`Invalid days of week: ${invalidDays.join(', ')}`);
            }
        }
    }
};
exports.RecurringTemplateService = RecurringTemplateService;
exports.RecurringTemplateService = RecurringTemplateService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [event_emitter_1.EventEmitter2])
], RecurringTemplateService);
//# sourceMappingURL=recurring-template.service.js.map