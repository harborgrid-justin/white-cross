// Recurring Appointments Service
// Handles recurring appointment template management and generation

import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

import { RecurringTemplate } from './enterprise-features-interfaces';
import { RecurringTemplateService } from './services/recurring/recurring-template.service';
import { RecurringGenerationService } from './services/recurring/recurring-generation.service';
import { RecurringStatisticsService } from './services/recurring/recurring-statistics.service';

@Injectable()
export class RecurringAppointmentsService {
  private readonly logger = new Logger(RecurringAppointmentsService.name);

  constructor(
    private eventEmitter: EventEmitter2,
    private templateService: RecurringTemplateService,
    private generationService: RecurringGenerationService,
    private statisticsService: RecurringStatisticsService,
  ) {}

  /**
   * Create a new recurring appointment template
   */
  createRecurringTemplate(data: Omit<RecurringTemplate, 'id' | 'createdAt'>): RecurringTemplate {
    return this.templateService.createRecurringTemplate(data);
  }

  /**
   * Get all active templates
   */
  getActiveTemplates(): RecurringTemplate[] {
    return this.templateService.getActiveTemplates();
  }

  /**
   * Get templates by appointment type
   */
  getTemplatesByAppointmentType(appointmentType: string): RecurringTemplate[] {
    return this.templateService.getTemplatesByAppointmentType(appointmentType);
  }

  /**
   * Update a recurring template
   */
  updateRecurringTemplate(
    templateId: string,
    updates: Partial<Omit<RecurringTemplate, 'id' | 'createdAt'>>
  ): RecurringTemplate | null {
    return this.templateService.updateRecurringTemplate(templateId, updates);
  }

  /**
   * Cancel a recurring series
   */
  cancelRecurringSeries(templateId: string, cancelledBy: string, reason?: string): boolean {
    return this.templateService.cancelRecurringSeries(templateId, cancelledBy, reason);
  }

  /**
   * Generate upcoming appointments
   */
  generateUpcomingAppointments(daysAhead: number = 30): Array<{
    templateId: string;
    appointmentDate: Date;
    appointmentType: string;
    studentId?: string;
    notes?: string;
  }> {
    return this.generationService.generateUpcomingAppointments(
      this.templateService.getAllTemplates(),
      daysAhead
    );
  }

  /**
   * Get template statistics
   */
  getTemplateStatistics(): {
    totalTemplates: number;
    activeTemplates: number;
    templatesByType: Record<string, number>;
    templatesByFrequency: Record<string, number>;
    averageAppointmentsPerTemplate: number;
  } {
    return this.statisticsService.getTemplateStatistics(this.templateService.getAllTemplates());
  }
}
}
