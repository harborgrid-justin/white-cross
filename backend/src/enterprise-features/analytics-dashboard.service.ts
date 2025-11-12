import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { DashboardMetric, HealthTrendData } from './enterprise-features-interfaces';

/**
 * Analytics Dashboard Service
 * Provides real-time analytics and health trends
 */
@Injectable()
export class AnalyticsDashboardService {
  private readonly logger = new Logger(AnalyticsDashboardService.name);

  constructor(private eventEmitter: EventEmitter2) {}

  /**
   * Get real-time dashboard metrics
   */
  async getRealtimeMetrics(): Promise<DashboardMetric[]> {
    try {
      const metrics: DashboardMetric[] = [
        {
          name: 'Active Students',
          value: 1250,
          trend: 'up',
          change: 32,
          changePercent: 2.5,
          unit: 'students',
          period: 'today',
          lastUpdated: new Date(),
        },
        {
          name: 'Appointments Today',
          value: 45,
          trend: 'stable',
          change: 0,
          changePercent: 0,
          unit: 'appointments',
          period: 'today',
          lastUpdated: new Date(),
        },
        {
          name: 'Medications Administered',
          value: 120,
          trend: 'up',
          change: 5,
          changePercent: 4.3,
          unit: 'doses',
          period: 'today',
          lastUpdated: new Date(),
        },
        {
          name: 'Incident Reports',
          value: 8,
          trend: 'down',
          change: -2,
          changePercent: -20,
          unit: 'reports',
          period: 'today',
          lastUpdated: new Date(),
        },
        {
          name: 'Consent Forms Pending',
          value: 15,
          trend: 'down',
          change: -5,
          changePercent: -25,
          unit: 'forms',
          period: 'today',
          lastUpdated: new Date(),
        },
      ];

      this.logger.log('Real-time metrics retrieved', {
        metricCount: metrics.length,
        timestamp: new Date(),
      });

      // Emit metrics event for real-time updates
      this.eventEmitter.emit('analytics.metrics.retrieved', {
        metrics: metrics.map((m) => ({ name: m.name, value: m.value })),
        timestamp: new Date(),
      });

      return metrics;
    } catch (error) {
      this.logger.error('Error getting real-time metrics', {
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  }

  /**
   * Get health trends for a specific period
   */
  async getHealthTrends(period: 'day' | 'week' | 'month'): Promise<HealthTrendData> {
    try {
      this.validatePeriod(period);

      // In production, this would query actual data from database
      const trendData: HealthTrendData = {
        period,
        metrics: [
          {
            name: 'Nurse Visits',
            value: 450,
            previousValue: 420,
            change: 30,
            changePercent: 7.1,
          },
          {
            name: 'Medication Administration',
            value: 1200,
            previousValue: 1150,
            change: 50,
            changePercent: 4.3,
          },
          {
            name: 'Immunization Compliance',
            value: 95,
            previousValue: 93,
            change: 2,
            changePercent: 2.2,
          },
          {
            name: 'Health Screenings Completed',
            value: 380,
            previousValue: 350,
            change: 30,
            changePercent: 8.6,
          },
        ],
        alerts: [],
      };

      // Check for critical metrics
      if (trendData.metrics.some((m) => m.name === 'Immunization Compliance' && m.value < 90)) {
        trendData.alerts.push({
          type: 'critical',
          message: 'Immunization compliance below threshold',
          metric: 'Immunization Compliance',
        });
      }

      this.logger.log('Health trends retrieved', {
        period,
        metricCount: trendData.metrics.length,
        alertCount: trendData.alerts.length,
      });

      // Emit trends event
      this.eventEmitter.emit('analytics.trends.retrieved', {
        period,
        metricCount: trendData.metrics.length,
        timestamp: new Date(),
      });

      return trendData;
    } catch (error) {
      this.logger.error('Error getting health trends', {
        error: error instanceof Error ? error.message : String(error),
        period,
      });
      throw error;
    }
  }

  /**
   * Get appointment statistics
   */
  async getAppointmentStatistics(period: 'day' | 'week' | 'month'): Promise<{
    totalAppointments: number;
    completedAppointments: number;
    cancelledAppointments: number;
    noShowAppointments: number;
    averageWaitTime: number;
    peakHours: string[];
  }> {
    try {
      this.validatePeriod(period);

      // In production, query actual appointment data
      const stats = {
        totalAppointments: 450,
        completedAppointments: 380,
        cancelledAppointments: 50,
        noShowAppointments: 20,
        averageWaitTime: 15, // minutes
        peakHours: ['09:00-10:00', '13:00-14:00'],
      };

      this.logger.log('Appointment statistics retrieved', {
        period,
        totalAppointments: stats.totalAppointments,
      });

      return stats;
    } catch (error) {
      this.logger.error('Error getting appointment statistics', {
        error: error instanceof Error ? error.message : String(error),
        period,
      });
      throw error;
    }
  }

  /**
   * Get medication administration statistics
   */
  async getMedicationStatistics(period: 'day' | 'week' | 'month'): Promise<{
    totalDoses: number;
    uniqueStudents: number;
    mostCommonMedications: Array<{ name: string; count: number }>;
    adherenceRate: number;
    missedDoses: number;
  }> {
    try {
      this.validatePeriod(period);

      // In production, query actual medication data
      const stats = {
        totalDoses: 1200,
        uniqueStudents: 450,
        mostCommonMedications: [
          { name: 'Albuterol Inhaler', count: 180 },
          { name: 'EpiPen', count: 45 },
          { name: 'Insulin', count: 120 },
        ],
        adherenceRate: 96.5,
        missedDoses: 42,
      };

      this.logger.log('Medication statistics retrieved', {
        period,
        totalDoses: stats.totalDoses,
        adherenceRate: stats.adherenceRate,
      });

      return stats;
    } catch (error) {
      this.logger.error('Error getting medication statistics', {
        error: error instanceof Error ? error.message : String(error),
        period,
      });
      throw error;
    }
  }

  /**
   * Get incident report statistics
   */
  async getIncidentStatistics(period: 'day' | 'week' | 'month'): Promise<{
    totalIncidents: number;
    byType: Record<string, number>;
    bySeverity: Record<string, number>;
    resolutionTime: { average: number; median: number };
    pendingReports: number;
  }> {
    try {
      this.validatePeriod(period);

      // In production, query actual incident data
      const stats = {
        totalIncidents: 85,
        byType: {
          injury: 45,
          illness: 25,
          behavioral: 10,
          other: 5,
        },
        bySeverity: {
          minor: 65,
          moderate: 15,
          severe: 5,
        },
        resolutionTime: {
          average: 3.5, // hours
          median: 2.0,
        },
        pendingReports: 8,
      };

      this.logger.log('Incident statistics retrieved', {
        period,
        totalIncidents: stats.totalIncidents,
        pendingReports: stats.pendingReports,
      });

      return stats;
    } catch (error) {
      this.logger.error('Error getting incident statistics', {
        error: error instanceof Error ? error.message : String(error),
        period,
      });
      throw error;
    }
  }

  /**
   * Get compliance metrics
   */
  async getComplianceMetrics(): Promise<{
    hipaaCompliance: number;
    consentFormCompletion: number;
    immunizationCompliance: number;
    staffCertifications: number;
    documentRetention: number;
  }> {
    try {
      // In production, query actual compliance data
      const metrics = {
        hipaaCompliance: 98.5,
        consentFormCompletion: 92.3,
        immunizationCompliance: 95.7,
        staffCertifications: 100,
        documentRetention: 97.2,
      };

      this.logger.log('Compliance metrics retrieved', metrics);

      // Emit compliance event if any metric is below threshold
      const lowMetrics = Object.entries(metrics).filter(([, value]) => value < 95);
      if (lowMetrics.length > 0) {
        this.eventEmitter.emit('analytics.compliance.warning', {
          lowMetrics: lowMetrics.map(([name, value]) => ({ name, value })),
          timestamp: new Date(),
        });
      }

      return metrics;
    } catch (error) {
      this.logger.error('Error getting compliance metrics', {
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  }

  /**
   * Export dashboard data
   */
  async exportDashboardData(
    period: 'day' | 'week' | 'month',
    format: 'json' | 'csv' | 'pdf',
  ): Promise<string> {
    try {
      this.validatePeriod(period);
      this.validateExportFormat(format);

      // In production, generate actual export file
      const filename = `dashboard-${period}-${Date.now()}.${format}`;
      const filepath = `/exports/${filename}`;

      this.logger.log('Dashboard data exported', {
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
      this.logger.error('Error exporting dashboard data', {
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
