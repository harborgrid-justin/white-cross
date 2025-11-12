/**
 * @fileoverview Analytics Report Generator Service
 * @module analytics
 * @description Main service orchestrating all analytics report generation
 */

import { Injectable, Logger, Inject } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import * as fs from 'fs';
import * as path from 'path';
import {
  AnalyticsReportType,
  AnalyticsTimePeriod,
  ReportGenerationOptions,
  ReportData,
  AnalyticsOperationResult,
  ReportMetadata,
} from './analytics-interfaces';
import { ReportDataCollectorService } from './services/report-data-collector.service';
import { ReportFormatterService } from './services/report-formatter.service';
import { HealthInsightsService } from './services/health-insights.service';

@Injectable()
export class AnalyticsReportGeneratorService {
  private readonly logger = new Logger(AnalyticsReportGeneratorService.name);
  private readonly reportsDir = path.join(process.cwd(), 'reports', 'analytics');

  constructor(
    private readonly eventEmitter: EventEmitter2,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
    private readonly dataCollector: ReportDataCollectorService,
    private readonly formatter: ReportFormatterService,
    private readonly healthInsights: HealthInsightsService,
  ) {
    // Ensure reports directory exists
    if (!fs.existsSync(this.reportsDir)) {
      fs.mkdirSync(this.reportsDir, { recursive: true });
    }
  }

  /**
   * Generate a comprehensive analytics report
   */
  async generateAnalyticsReport(
    schoolId: string,
    reportType: AnalyticsReportType,
    period: AnalyticsTimePeriod,
    options: ReportGenerationOptions = {},
  ): Promise<AnalyticsOperationResult<ReportData>> {
    try {
      const reportId = this.generateReportId();
      const cacheKey = `analytics:report:${reportId}`;

      // Check cache unless force regenerate
      if (!options.forceRegenerate) {
        const cached = await this.cacheManager.get<ReportData>(cacheKey);
        if (cached) {
          return { success: true, data: cached };
        }
      }

      // Collect data
      const reportData = await this.dataCollector.collectReportData(schoolId, reportType, period, options.filters);

      // Generate report content
      const reportContent = await this.generateReportContent(reportData, reportType, options);

      // Format report
      const formattedReport = await this.formatter.formatReport(reportContent, options.format || 'JSON');

      const report: ReportData = {
        id: reportId,
        schoolId,
        type: reportType,
        period,
        data: reportData,
        content: reportContent,
        formattedContent: formattedReport,
        metadata: this.generateReportMetadata(reportId, schoolId, reportType, period, options),
        generatedAt: new Date(),
      };

      // Cache the report
      await this.cacheManager.set(cacheKey, report, 3600000); // 1 hour TTL

      // Save to file if requested
      if (options.saveToFile) {
        await this.saveReportToFile(report, options.format || 'JSON');
      }

      // Emit event
      this.eventEmitter.emit('analytics.report.generated', {
        reportId,
        schoolId,
        type: reportType,
        format: options.format || 'JSON',
      });

      return { success: true, data: report };
    } catch (error) {
      this.logger.error(`Failed to generate analytics report for school ${schoolId}`, error);
      return {
        success: false,
        error: `Failed to generate report: ${error.message}`,
      };
    }
  }

  /**
   * Generate a dashboard summary report
   */
  async generateDashboardReport(
    schoolId: string,
    userType: string,
    timeRange: string,
    dashboardData: any,
  ): Promise<AnalyticsOperationResult<ReportData>> {
    try {
      const reportId = this.generateReportId();

      const reportContent = {
        title: `Dashboard Summary - ${schoolId}`,
        generatedFor: userType,
        timeRange,
        summary: {
          totalAlerts: dashboardData.alerts?.length || 0,
          criticalAlerts: dashboardData.alerts?.filter((a: any) => a.severity === 'CRITICAL').length || 0,
          upcomingAppointments: dashboardData.upcomingAppointments || 0,
          pendingTasks: dashboardData.pendingTasks || 0,
        },
        keyMetrics: dashboardData.keyMetrics || [],
        alerts: dashboardData.alerts || [],
        recommendations: dashboardData.recommendations || [],
        generatedAt: new Date(),
      };

      const formattedReport = await this.formatter.formatReport(reportContent, 'JSON');

      const report: ReportData = {
        id: reportId,
        schoolId,
        type: AnalyticsReportType.DASHBOARD_SUMMARY,
        period: AnalyticsTimePeriod.LAST_30_DAYS,
        data: dashboardData,
        content: reportContent,
        formattedContent: formattedReport,
        metadata: this.generateReportMetadata(
          reportId,
          schoolId,
          AnalyticsReportType.DASHBOARD_SUMMARY,
          AnalyticsTimePeriod.LAST_30_DAYS,
          { format: 'JSON' },
        ),
        generatedAt: new Date(),
      };

      return { success: true, data: report };
    } catch (error) {
      this.logger.error(`Failed to generate dashboard report for school ${schoolId}`, error);
      return {
        success: false,
        error: `Failed to generate dashboard report: ${error.message}`,
      };
    }
  }

  /**
   * Generate a student health summary report
   */
  async generateStudentHealthReport(
    studentId: string,
    studentMetrics: any,
  ): Promise<AnalyticsOperationResult<ReportData>> {
    try {
      const reportId = this.generateReportId();

      const riskAssessment = this.healthInsights.assessStudentRisk(studentMetrics);

      const reportContent = {
        title: `Student Health Summary - ${studentId}`,
        studentId,
        period: studentMetrics.period,
        overview: {
          totalHealthRecords: studentMetrics.healthRecords,
          medicationAdministrations: studentMetrics.medicationAdministrations,
          appointments: studentMetrics.appointments,
          incidents: studentMetrics.incidents,
        },
        timeline: {
          lastHealthRecord: studentMetrics.lastHealthRecord,
          lastMedication: studentMetrics.lastMedication,
          upcomingAppointments: studentMetrics.upcomingAppointments,
        },
        riskAssessment,
        recommendations: this.healthInsights.generateStudentRecommendations(studentMetrics),
        generatedAt: new Date(),
      };

      const formattedReport = await this.formatter.formatReport(reportContent, 'JSON');

      const report: ReportData = {
        id: reportId,
        schoolId: 'N/A',
        type: AnalyticsReportType.STUDENT_HEALTH_SUMMARY,
        period: studentMetrics.period,
        data: studentMetrics,
        content: reportContent,
        formattedContent: formattedReport,
        metadata: {
          id: reportId,
          title: `Student Health Summary - ${studentId}`,
          type: AnalyticsReportType.STUDENT_HEALTH_SUMMARY,
          generatedAt: new Date(),
          period: studentMetrics.period,
          format: 'JSON',
          size: JSON.stringify(reportContent).length,
        },
        generatedAt: new Date(),
      };

      return { success: true, data: report };
    } catch (error) {
      this.logger.error(`Failed to generate student health report for ${studentId}`, error);
      return {
        success: false,
        error: `Failed to generate student report: ${error.message}`,
      };
    }
  }

  /**
   * Generate a compliance report
   */
  async generateComplianceReport(
    schoolId: string,
    period: AnalyticsTimePeriod,
    complianceData: any,
  ): Promise<AnalyticsOperationResult<ReportData>> {
    try {
      const reportId = this.generateReportId();

      const reportContent = {
        title: `Compliance Report - ${schoolId}`,
        schoolId,
        period,
        complianceScores: {
          overall: complianceData.overall,
          medication: complianceData.medicationAdherence,
          immunization: complianceData.immunizationCompliance,
          appointments: complianceData.appointmentCompletion,
          incidents: complianceData.incidentReporting,
        },
        status: complianceData.status,
        areasOfConcern: complianceData.areasOfConcern,
        recommendations: complianceData.recommendations,
        generatedAt: new Date(),
      };

      const formattedReport = await this.formatter.formatReport(reportContent, 'JSON');

      const report: ReportData = {
        id: reportId,
        schoolId,
        type: AnalyticsReportType.COMPLIANCE_REPORT,
        period,
        data: complianceData,
        content: reportContent,
        formattedContent: formattedReport,
        metadata: this.generateReportMetadata(
          reportId,
          schoolId,
          AnalyticsReportType.COMPLIANCE_REPORT,
          period,
          { format: 'JSON' },
        ),
        generatedAt: new Date(),
      };

      return { success: true, data: report };
    } catch (error) {
      this.logger.error(`Failed to generate compliance report for school ${schoolId}`, error);
      return {
        success: false,
        error: `Failed to generate compliance report: ${error.message}`,
      };
    }
  }

  // Private helper methods

  private async generateReportContent(
    data: any,
    reportType: AnalyticsReportType,
    options: ReportGenerationOptions,
  ): Promise<any> {
    const baseContent = {
      title: `${reportType.replace('_', ' ')} Report`,
      type: reportType,
      generatedAt: new Date(),
      data,
    };

    // Add report-specific content
    switch (reportType) {
      case AnalyticsReportType.HEALTH_OVERVIEW:
        return {
          ...baseContent,
          summary: {
            totalStudents: data.totalStudents,
            healthRecordCoverage: (data.activeHealthRecords / data.totalStudents * 100).toFixed(1) + '%',
            medicationAdherence: data.medicationAdherence + '%',
            immunizationCompliance: data.immunizationCompliance + '%',
          },
          insights: this.healthInsights.generateHealthInsights(data),
        };

      case AnalyticsReportType.MEDICATION_SUMMARY:
        return {
          ...baseContent,
          summary: {
            totalMedications: data.medications.reduce((sum: number, med: any) => sum + med.count, 0),
            uniqueMedications: data.medications.length,
            totalStudents: data.medications.reduce((sum: number, med: any) => sum + med.students, 0),
          },
          topMedications: data.medications,
          insights: this.healthInsights.generateMedicationInsights(data),
        };

      default:
        return baseContent;
    }
  }

  private async saveReportToFile(report: ReportData, format: string): Promise<void> {
    const fileName = `${report.id}.${format.toLowerCase()}`;
    const filePath = path.join(this.reportsDir, fileName);

    try {
      await fs.promises.writeFile(filePath, report.formattedContent, 'utf8');
      this.logger.log(`Report saved to ${filePath}`);
    } catch (error) {
      this.logger.error(`Failed to save report to file: ${error}`);
      throw error;
    }
  }

  private generateReportId(): string {
    return `report_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateReportMetadata(
    reportId: string,
    schoolId: string,
    reportType: AnalyticsReportType,
    period: AnalyticsTimePeriod,
    options: ReportGenerationOptions,
  ): ReportMetadata {
    return {
      id: reportId,
      title: `${reportType.replace('_', ' ')} Report - ${schoolId}`,
      type: reportType,
      generatedAt: new Date(),
      period,
      format: options.format || 'JSON',
      size: 0, // Would be calculated based on content size
    };
  }
}
