import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

import { BaseService } from '@/common/base';
/**
 * Export Service
 * Handles data export functionality
 */
@Injectable()
export class ExportService extends BaseService {
  constructor(private eventEmitter: EventEmitter2) {}

  /**
   * Export dashboard data
   */
  exportDashboardData(period: 'day' | 'week' | 'month', format: 'json' | 'csv' | 'pdf'): string {
    try {
      this.validatePeriod(period);
      this.validateExportFormat(format);

      // In production, generate actual export file
      const filename = `dashboard-${period}-${Date.now()}.${format}`;
      const filepath = `/exports/${filename}`;

      this.logInfo('Dashboard data exported', {
        period,
        format,
        filename,
      });

      // Emit export event
      this.eventEmitter.emit('analytics.dashboard.exported', {
        period,
        format,
        filename,
        timestamp: new Date(),
      });

      return filepath;
    } catch (error) {
      this.logError('Error exporting dashboard data', {
        error: error instanceof Error ? error.message : String(error),
        period,
        format,
      });
      throw error;
    }
  }

  /**
   * Validate period parameter
   */
  private validatePeriod(period: string): void {
    const validPeriods = ['day', 'week', 'month'];
    if (!validPeriods.includes(period)) {
      throw new Error(`Invalid period: ${period}. Must be one of: ${validPeriods.join(', ')}`);
    }
  }

  /**
   * Validate export format
   */
  private validateExportFormat(format: string): void {
    const validFormats = ['json', 'csv', 'pdf'];
    if (!validFormats.includes(format)) {
      throw new Error(`Invalid format: ${format}. Must be one of: ${validFormats.join(', ')}`);
    }
  }
}