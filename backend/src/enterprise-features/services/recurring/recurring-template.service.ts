import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { RecurringTemplate } from '../../enterprise-features-interfaces';
import { ENTERPRISE_CONSTANTS } from '../../enterprise-features-constants';

/**
 * Template Service
 * Handles CRUD operations for recurring appointment templates
 */
@Injectable()
export class RecurringTemplateService {
  private readonly logger = new Logger(RecurringTemplateService.name);
  private templates: RecurringTemplate[] = []; // In production, this would be a database

  constructor(private eventEmitter: EventEmitter2) {}

  /**
   * Create a new recurring appointment template
   */
  createRecurringTemplate(data: Omit<RecurringTemplate, 'id' | 'createdAt'>): RecurringTemplate {
    try {
      const template: RecurringTemplate = {
        ...data,
        id: `${ENTERPRISE_CONSTANTS.ID_PREFIXES.RECURRING_TEMPLATE}${Date.now()}`,
        createdAt: new Date(),
      };

      this.templates.push(template);

      this.logger.log('Recurring appointment template created', {
        templateId: template.id,
        appointmentType: template.appointmentType,
        frequency: template.recurrenceRule.frequency,
      });

      // Emit event for audit logging
      this.eventEmitter.emit('recurring-template.created', {
        template,
        timestamp: new Date(),
      });

      return template;
    } catch (error) {
      this.logger.error('Error creating recurring template', {
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  }

  /**
   * Get all active templates
   */
  getActiveTemplates(): RecurringTemplate[] {
    try {
      const activeTemplates = this.templates.filter(template => template.isActive);
      this.logger.log('Active templates retrieved', { count: activeTemplates.length });
      return activeTemplates;
    } catch (error) {
      this.logger.error('Error getting active templates', {
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  }

  /**
   * Get templates by appointment type
   */
  getTemplatesByAppointmentType(appointmentType: string): RecurringTemplate[] {
    try {
      const filteredTemplates = this.templates.filter(
        template => template.appointmentType === appointmentType && template.isActive
      );
      this.logger.log('Templates retrieved by appointment type', {
        appointmentType,
        count: filteredTemplates.length,
      });
      return filteredTemplates;
    } catch (error) {
      this.logger.error('Error getting templates by appointment type', {
        error: error instanceof Error ? error.message : String(error),
        appointmentType,
      });
      throw error;
    }
  }

  /**
   * Update a recurring template
   */
  updateRecurringTemplate(
    templateId: string,
    updates: Partial<Omit<RecurringTemplate, 'id' | 'createdAt'>>
  ): RecurringTemplate | null {
    try {
      const templateIndex = this.templates.findIndex(template => template.id === templateId);

      if (templateIndex === -1) {
        this.logger.warn('Template not found for update', { templateId });
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

      this.logger.log('Recurring template updated', {
        templateId,
        updates: Object.keys(updates),
      });

      // Emit update event
      this.eventEmitter.emit('recurring-template.updated', {
        template: updatedTemplate,
        updates,
        timestamp: new Date(),
      });

      return updatedTemplate;
    } catch (error) {
      this.logger.error('Error updating recurring template', {
        error: error instanceof Error ? error.message : String(error),
        templateId,
      });
      throw error;
    }
  }

  /**
   * Cancel a recurring series
   */
  cancelRecurringSeries(templateId: string, cancelledBy: string, reason?: string): boolean {
    try {
      const templateIndex = this.templates.findIndex(template => template.id === templateId);

      if (templateIndex === -1) {
        this.logger.warn('Template not found for cancellation', { templateId });
        return false;
      }

      this.templates[templateIndex].isActive = false;
      this.templates[templateIndex].cancelledAt = new Date();
      this.templates[templateIndex].cancellationReason = reason;
      this.templates[templateIndex].updatedAt = new Date();

      this.logger.log('Recurring series cancelled', {
        templateId,
        cancelledBy,
        reason,
      });

      // Emit cancellation event
      this.eventEmitter.emit('recurring-template.cancelled', {
        template: this.templates[templateIndex],
        cancelledBy,
        reason,
        timestamp: new Date(),
      });

      return true;
    } catch (error) {
      this.logger.error('Error cancelling recurring series', {
        error: error instanceof Error ? error.message : String(error),
        templateId,
      });
      throw error;
    }
  }

  /**
   * Get all templates (for internal use)
   */
  getAllTemplates(): RecurringTemplate[] {
    return this.templates;
  }

  /**
   * Validate recurrence rule
   */
  private validateRecurrenceRule(recurrenceRule: any): void {
    if (!recurrenceRule || typeof recurrenceRule !== 'object') {
      throw new Error('Recurrence rule is required and must be an object');
    }

    if (!recurrenceRule.frequency) {
      throw new Error('Recurrence frequency is required');
    }

    if (recurrenceRule.interval < 1) {
      throw new Error('Recurrence interval must be at least 1');
    }

    if (recurrenceRule.interval > 52) { // Assuming weekly max
      throw new Error('Recurrence interval cannot exceed maximum allowed value');
    }

    if (recurrenceRule.endDate && recurrenceRule.endDate <= new Date()) {
      throw new Error('End date must be in the future');
    }

    // Additional validation for weekly frequency
    if (recurrenceRule.frequency === 'weekly' && recurrenceRule.daysOfWeek) {
      const validDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
      const invalidDays = recurrenceRule.daysOfWeek.filter((day: string) => !validDays.includes(day.toLowerCase()));

      if (invalidDays.length > 0) {
        throw new Error(`Invalid days of week: ${invalidDays.join(', ')}`);
      }
    }
  }
}