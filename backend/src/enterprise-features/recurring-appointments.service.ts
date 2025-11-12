// Recurring Appointments Service
// Handles recurring appointment template management and generation

import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

import { RecurringTemplate, RecurrenceFrequency } from './enterprise-features-interfaces';
import { RECURRING_CONSTANTS, ENTERPRISE_CONSTANTS } from './enterprise-features-constants';

@Injectable()
export class RecurringAppointmentsService {
  private readonly logger = new Logger(RecurringAppointmentsService.name);
  private templates: RecurringTemplate[] = []; // In production, this would be a database

  constructor(private eventEmitter: EventEmitter2) {}

  /**
   * Create a new recurring appointment template
   */
  createRecurringTemplate(data: Omit<RecurringTemplate, 'id' | 'createdAt'>): RecurringTemplate {
    try {
      // Validate recurrence rule
      this.validateRecurrenceRule(data.recurrenceRule);

      const template: RecurringTemplate = {
        ...data,
        id: `${ENTERPRISE_CONSTANTS.ID_PREFIXES.RECURRING_TEMPLATE}${Date.now()}`,
        createdAt: new Date(),
      };

      this.templates.push(template);

      // Generate initial appointments
      this.generateAppointmentsFromTemplate(template);

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
        appointmentType: data.appointmentType,
      });
      throw error;
    }
  }

  /**
   * Get all active recurring templates
   */
  getActiveTemplates(): RecurringTemplate[] {
    try {
      const activeTemplates = this.templates.filter((template) => template.isActive);

      this.logger.log('Retrieved active recurring templates', {
        count: activeTemplates.length,
      });

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
        (template) => template.appointmentType === appointmentType && template.isActive,
      );

      this.logger.log('Retrieved templates by appointment type', {
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
   * Update an existing recurring template
   */
  updateRecurringTemplate(
    templateId: string,
    updates: Partial<Omit<RecurringTemplate, 'id' | 'createdAt'>>,
    updatedBy: string,
  ): RecurringTemplate | null {
    try {
      const templateIndex = this.templates.findIndex((t) => t.id === templateId);

      if (templateIndex === -1) {
        this.logger.warn('Recurring template not found', { templateId });
        return null;
      }

      const template = this.templates[templateIndex];

      // Validate recurrence rule if it's being updated
      if (updates.recurrenceRule) {
        this.validateRecurrenceRule(updates.recurrenceRule);
      }

      // Update the template
      const updatedTemplate = {
        ...template,
        ...updates,
      };

      this.templates[templateIndex] = updatedTemplate;

      this.logger.log('Recurring template updated', {
        templateId,
        updatedBy,
        changes: Object.keys(updates),
      });

      // Emit event for audit logging
      this.eventEmitter.emit('recurring-template.updated', {
        template: updatedTemplate,
        updatedBy,
        timestamp: new Date(),
      });

      return updatedTemplate;
    } catch (error) {
      this.logger.error('Error updating recurring template', {
        error: error instanceof Error ? error.message : String(error),
        templateId,
        updatedBy,
      });
      throw error;
    }
  }

  /**
   * Cancel a recurring series
   */
  cancelRecurringSeries(templateId: string, cancelledBy: string, reason?: string): boolean {
    try {
      const templateIndex = this.templates.findIndex((t) => t.id === templateId);

      if (templateIndex === -1) {
        this.logger.warn('Recurring template not found for cancellation', { templateId });
        return false;
      }

      const template = this.templates[templateIndex];
      template.isActive = false;

      this.logger.log('Recurring series cancelled', {
        templateId,
        cancelledBy,
        reason,
        appointmentType: template.appointmentType,
      });

      // Emit event for audit logging
      this.eventEmitter.emit('recurring-template.cancelled', {
        template,
        cancelledBy,
        reason,
        timestamp: new Date(),
      });

      return true;
    } catch (error) {
      this.logger.error('Error cancelling recurring series', {
        error: error instanceof Error ? error.message : String(error),
        templateId,
        cancelledBy,
      });
      throw error;
    }
  }

  /**
   * Generate upcoming appointments from all active templates
   */
  generateUpcomingAppointments(daysAhead: number = 30): Array<{
    templateId: string;
    appointmentDate: Date;
    appointmentType: string;
  }> {
    try {
      const upcomingAppointments: Array<{
        templateId: string;
        appointmentDate: Date;
        appointmentType: string;
      }> = [];

      const endDate = new Date();
      endDate.setDate(endDate.getDate() + daysAhead);

      for (const template of this.templates) {
        if (!template.isActive) continue;

        const appointments = this.generateAppointmentDates(template, endDate);
        upcomingAppointments.push(...appointments);
      }

      this.logger.log('Generated upcoming appointments', {
        daysAhead,
        totalAppointments: upcomingAppointments.length,
      });

      return upcomingAppointments.sort(
        (a, b) => a.appointmentDate.getTime() - b.appointmentDate.getTime(),
      );
    } catch (error) {
      this.logger.error('Error generating upcoming appointments', {
        error: error instanceof Error ? error.message : String(error),
        daysAhead,
      });
      throw error;
    }
  }

  /**
   * Get template statistics
   */
  getTemplateStatistics(): {
    totalTemplates: number;
    activeTemplates: number;
    templatesByFrequency: Record<string, number>;
    templatesByAppointmentType: Record<string, number>;
  } {
    try {
      const stats = {
        totalTemplates: this.templates.length,
        activeTemplates: this.templates.filter((t) => t.isActive).length,
        templatesByFrequency: {} as Record<string, number>,
        templatesByAppointmentType: {} as Record<string, number>,
      };

      // Count by frequency
      for (const template of this.templates) {
        const freq = template.recurrenceRule.frequency;
        stats.templatesByFrequency[freq] = (stats.templatesByFrequency[freq] || 0) + 1;
      }

      // Count by appointment type
      for (const template of this.templates) {
        const type = template.appointmentType;
        stats.templatesByAppointmentType[type] = (stats.templatesByAppointmentType[type] || 0) + 1;
      }

      this.logger.log('Retrieved template statistics', stats);
      return stats;
    } catch (error) {
      this.logger.error('Error getting template statistics', {
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  }

  /**
   * Validate recurrence rule
   */
  private validateRecurrenceRule(recurrenceRule: RecurringTemplate['recurrenceRule']): void {
    if (recurrenceRule.interval < 1) {
      throw new Error('Recurrence interval must be at least 1');
    }

    if (recurrenceRule.interval > RECURRING_CONSTANTS.MAX_RECURRENCE_INTERVAL) {
      throw new Error(
        `Recurrence interval cannot exceed ${RECURRING_CONSTANTS.MAX_RECURRENCE_INTERVAL} days`,
      );
    }

    if (recurrenceRule.endDate && recurrenceRule.endDate <= new Date()) {
      throw new Error('End date must be in the future');
    }

    // Validate days of week for weekly recurrence
    if (recurrenceRule.frequency === RecurrenceFrequency.WEEKLY && recurrenceRule.daysOfWeek) {
      const invalidDays = recurrenceRule.daysOfWeek.filter((day) => day < 0 || day > 6);
      if (invalidDays.length > 0) {
        throw new Error('Invalid days of week specified');
      }
    }
  }

  /**
   * Generate appointments from a template
   */
  private generateAppointmentsFromTemplate(template: RecurringTemplate): void {
    try {
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + RECURRING_CONSTANTS.MAX_FUTURE_GENERATION_MONTHS);

      const appointmentDates = this.generateAppointmentDates(template, endDate);

      this.logger.log('Generated appointments from template', {
        templateId: template.id,
        appointmentCount: appointmentDates.length,
      });

      // In production, this would create actual appointment records
      // For now, just log the generation
    } catch (error) {
      this.logger.error('Error generating appointments from template', {
        error: error instanceof Error ? error.message : String(error),
        templateId: template.id,
      });
      throw error;
    }
  }

  /**
   * Generate appointment dates from a template
   */
  private generateAppointmentDates(
    template: RecurringTemplate,
    endDate: Date,
  ): Array<{
    templateId: string;
    appointmentDate: Date;
    appointmentType: string;
  }> {
    const appointments: Array<{
      templateId: string;
      appointmentDate: Date;
      appointmentType: string;
    }> = [];

    const currentDate = new Date(); // Start from today

    while (currentDate <= endDate) {
      // Check if this date matches the recurrence pattern
      if (this.dateMatchesRecurrence(currentDate, template.recurrenceRule)) {
        appointments.push({
          templateId: template.id,
          appointmentDate: new Date(currentDate),
          appointmentType: template.appointmentType,
        });
      }

      // Move to next occurrence based on frequency
      switch (template.recurrenceRule.frequency) {
        case RecurrenceFrequency.DAILY:
          currentDate.setDate(currentDate.getDate() + template.recurrenceRule.interval);
          break;
        case RecurrenceFrequency.WEEKLY:
          currentDate.setDate(currentDate.getDate() + template.recurrenceRule.interval * 7);
          break;
        case RecurrenceFrequency.MONTHLY:
          currentDate.setMonth(currentDate.getMonth() + template.recurrenceRule.interval);
          break;
      }
    }

    return appointments;
  }

  /**
   * Check if a date matches the recurrence rule
   */
  private dateMatchesRecurrence(
    date: Date,
    recurrenceRule: RecurringTemplate['recurrenceRule'],
  ): boolean {
    // For weekly recurrence, check if the day of week matches
    if (recurrenceRule.frequency === RecurrenceFrequency.WEEKLY && recurrenceRule.daysOfWeek) {
      return recurrenceRule.daysOfWeek.includes(date.getDay());
    }

    // For daily and monthly, all dates match (filtered by interval in generateAppointmentDates)
    return true;
  }
}
