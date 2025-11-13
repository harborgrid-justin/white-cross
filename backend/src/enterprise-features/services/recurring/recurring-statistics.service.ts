import { Injectable, Logger } from '@nestjs/common';
import { RecurringTemplate } from '../../enterprise-features-interfaces';

import { BaseService } from '../../common/base';
/**
 * Statistics Service
 * Handles statistics calculations for recurring appointments
 */
@Injectable()
export class RecurringStatisticsService extends BaseService {
  /**
   * Get template statistics
   */
  getTemplateStatistics(templates: RecurringTemplate[]): {
    totalTemplates: number;
    activeTemplates: number;
    templatesByType: Record<string, number>;
    templatesByFrequency: Record<string, number>;
    averageAppointmentsPerTemplate: number;
  } {
    try {
      const stats = {
        totalTemplates: templates.length,
        activeTemplates: templates.filter((t) => t.isActive).length,
        templatesByType: {} as Record<string, number>,
        templatesByFrequency: {} as Record<string, number>,
        averageAppointmentsPerTemplate: 0,
      };

      // Count by appointment type
      for (const template of templates) {
        stats.templatesByType[template.appointmentType] =
          (stats.templatesByType[template.appointmentType] || 0) + 1;
      }

      // Count by frequency
      for (const template of templates) {
        const frequency = template.recurrenceRule.frequency;
        stats.templatesByFrequency[frequency] =
          (stats.templatesByFrequency[frequency] || 0) + 1;
      }

      // Calculate average appointments per template (simplified)
      if (stats.activeTemplates > 0) {
        // In production, this would count actual generated appointments
        stats.averageAppointmentsPerTemplate = Math.round(30 / stats.activeTemplates); // Rough estimate
      }

      this.logInfo('Template statistics calculated', stats);

      return stats;
    } catch (error) {
      this.logError('Error getting template statistics', {
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  }
}