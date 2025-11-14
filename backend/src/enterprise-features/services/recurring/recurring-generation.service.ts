import { Injectable, Logger } from '@nestjs/common';
import { RecurringTemplate, RecurrenceFrequency } from '../../enterprise-features-interfaces';

import { BaseService } from '@/common/base';
/**
 * Generation Service
 * Handles appointment generation from recurring templates
 */
@Injectable()
export class RecurringGenerationService extends BaseService {
  constructor() {
    super('RecurringGenerationService');
  }

  /**
   * Generate upcoming appointments from all active templates
   */
  generateUpcomingAppointments(templates: RecurringTemplate[], daysAhead: number = 30): Array<{
    templateId: string;
    appointmentDate: Date;
    appointmentType: string;
    studentId?: string;
    notes?: string;
  }> {
    try {
      const upcomingAppointments: Array<{
        templateId: string;
        appointmentDate: Date;
        appointmentType: string;
        studentId?: string;
        notes?: string;
      }> = [];

      const endDate = new Date();
      endDate.setDate(endDate.getDate() + daysAhead);

      for (const template of templates) {
        if (!template.isActive) continue;

        const appointments = this.generateAppointmentsFromTemplate(template, endDate);
        upcomingAppointments.push(...appointments);
      }

      // Sort by date
      upcomingAppointments.sort((a, b) => a.appointmentDate.getTime() - b.appointmentDate.getTime());

      this.logInfo('Upcoming appointments generated', {
        templateCount: templates.length,
        appointmentCount: upcomingAppointments.length,
        daysAhead,
      });

      return upcomingAppointments;
    } catch (error) {
      this.logError('Error generating upcoming appointments', {
        error: error instanceof Error ? error.message : String(error),
        daysAhead,
      });
      throw error;
    }
  }

  /**
   * Generate appointments from a single template
   */
  private generateAppointmentsFromTemplate(
    template: RecurringTemplate,
    endDate: Date
  ): Array<{
    templateId: string;
    appointmentDate: Date;
    appointmentType: string;
    studentId?: string;
    notes?: string;
  }> {
    const appointments: Array<{
      templateId: string;
      appointmentDate: Date;
      appointmentType: string;
      studentId?: string;
      notes?: string;
    }> = [];

    let currentDate = new Date(template.startDate);

    // If start date is in the past, find the next occurrence
    if (currentDate < new Date()) {
      currentDate = this.getNextOccurrence(template, new Date());
    }

    while (currentDate <= endDate) {
      appointments.push({
        templateId: template.id,
        appointmentDate: new Date(currentDate),
        appointmentType: template.appointmentType,
        studentId: template.studentId,
        notes: template.notes,
      });

      // Calculate next occurrence
      currentDate = this.getNextOccurrence(template, currentDate);
    }

    return appointments;
  }

  /**
   * Get the next occurrence date for a template
   */
  private getNextOccurrence(template: RecurringTemplate, fromDate: Date): Date {
    const nextDate = new Date(fromDate);
    const { frequency, interval } = template.recurrenceRule;

    switch (frequency) {
      case RecurrenceFrequency.DAILY:
        nextDate.setDate(nextDate.getDate() + interval);
        break;

      case RecurrenceFrequency.WEEKLY:
        if (template.recurrenceRule.daysOfWeek && template.recurrenceRule.daysOfWeek.length > 0) {
          nextDate.setDate(nextDate.getDate() + 1);
          // Find next valid day of week
          while (!template.recurrenceRule.daysOfWeek.includes(this.getDayName(nextDate.getDay()))) {
            nextDate.setDate(nextDate.getDate() + 1);
          }
        } else {
          nextDate.setDate(nextDate.getDate() + (interval * 7));
        }
        break;

      case RecurrenceFrequency.MONTHLY:
        nextDate.setMonth(nextDate.getMonth() + interval);
        break;

      default:
        throw new Error(`Unsupported recurrence frequency: ${frequency}`);
    }

    return nextDate;
  }

  /**
   * Get day name from day number (0 = Sunday, 1 = Monday, etc.)
   */
  private getDayName(dayIndex: number): string {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    return days[dayIndex];
  }
}