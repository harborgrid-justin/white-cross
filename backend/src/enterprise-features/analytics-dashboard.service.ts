import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { DashboardMetric, HealthTrendData } from './enterprise-features-interfaces';
import { MetricsService } from './services/analytics/metrics.service';
import { StatisticsService } from './services/analytics/statistics.service';
import { ComplianceService } from './services/analytics/compliance.service';
import { ExportService } from './services/analytics/export.service';

/**
 * Analytics Dashboard Service
 * Provides real-time analytics and health trends
 * Delegates to specialized sub-services for different functionality
 */
@Injectable()
export class AnalyticsDashboardService {
  private readonly logger = new Logger(AnalyticsDashboardService.name);

  constructor(
    private eventEmitter: EventEmitter2,
    private metricsService: MetricsService,
    private statisticsService: StatisticsService,
    private complianceService: ComplianceService,
    private exportService: ExportService,
  ) {}

  /**
   * Get real-time dashboard metrics
   */
  async getRealtimeMetrics(): Promise<DashboardMetric[]> {
    return this.metricsService.getRealtimeMetrics();
  }

  /**
   * Get health trends for a specific period
   */
  async getHealthTrends(period: 'day' | 'week' | 'month'): Promise<HealthTrendData> {
    return this.metricsService.getHealthTrends(period);
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
    return this.statisticsService.getAppointmentStatistics(period);
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
    return this.statisticsService.getMedicationStatistics(period);
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
    return this.statisticsService.getIncidentStatistics(period);
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
    return this.complianceService.getComplianceMetrics();
  }

  /**
   * Export dashboard data
   */
  async exportDashboardData(
    period: 'day' | 'week' | 'month',
    format: 'json' | 'csv' | 'pdf',
  ): Promise<string> {
    return this.exportService.exportDashboardData(period, format);
  }
}
