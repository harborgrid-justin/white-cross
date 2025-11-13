/**
 * @fileoverview Analytics Report Generator Service
 * @module analytics
 * @description Main service orchestrating all analytics report generation
 */

import { Injectable, Inject } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

import {
  AnalyticsReportType,
  AnalyticsTimePeriod,
  ReportGenerationOptions,
  ReportData,
  AnalyticsOperationResult,
} from './types/analytics-report.types';

import { BaseReportGeneratorService } from '@/analytics/services/base-report-generator.service';
import { ReportDataCollectorService } from '@/analytics/services/report-data-collector.service';
import { ReportFormatterService } from './services/report-formatter.service';
import { HealthInsightsService } from './services/health-insights.service';

import { BaseService } from '@/common/base';
import { BaseService } from '@/common/base';
import { LoggerService } from '@/common/logging/logger.service';
import { Inject } from '@nestjs/common';
@Injectable()
export class AnalyticsReportGeneratorService extends BaseReportGeneratorService {
  constructor(
    eventEmitter: EventEmitter2,
    @Inject(CACHE_MANAGER)
    cacheManager: Cache,
    private readonly dataCollector: ReportDataCollectorService,
    private readonly formatter: ReportFormatterService,
    private readonly healthInsights: HealthInsightsService,
  ) {
    super(eventEmitter, cacheManager, AnalyticsReportGeneratorService.name);
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
    return this.generateReport(
      schoolId,
      reportType,
      period,
      options,
      async () => {
        // Collect data
        const reportData = await this.dataCollector.collectReportData(schoolId, reportType, period, options.filters);

        // Generate report content
        const reportContent = await this.generateReportContent(reportData, reportType, options);

        return { data: reportData, content: reportContent };
      },
    );
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
    return this.generateReport(
      schoolId,
      AnalyticsReportType.DASHBOARD_SUMMARY,
      AnalyticsTimePeriod.LAST_30_DAYS,
      { format: 'JSON' },
      async () => {
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

        return { data: dashboardData, content: reportContent };
      },
    );
  }

  /**
   * Generate a student health summary report
   */
  async generateStudentHealthReport(
    studentId: string,
    studentMetrics: any,
  ): Promise<AnalyticsOperationResult<ReportData>> {
    return this.generateReport(
      'N/A',
      AnalyticsReportType.STUDENT_HEALTH_SUMMARY,
      studentMetrics.period,
      { format: 'JSON' },
      async () => {
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

        return { data: studentMetrics, content: reportContent };
      },
    );
  }

  /**
   * Generate a compliance report
   */
  async generateComplianceReport(
    schoolId: string,
    period: AnalyticsTimePeriod,
    complianceData: any,
  ): Promise<AnalyticsOperationResult<ReportData>> {
    return this.generateReport(
      schoolId,
      AnalyticsReportType.COMPLIANCE_REPORT,
      period,
      { format: 'JSON' },
      async () => {
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

        return { data: complianceData, content: reportContent };
      },
    );
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
}
