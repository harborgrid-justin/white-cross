/**
 * @fileoverview Analytics Report Generator Service
 * @module analytics
 * @description Handles custom report generation and formatting for analytics
 */

import { Injectable, Logger } from '@nestjs/common';
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
  HealthMetricsData,
  StudentHealthMetrics,
  MedicationAnalyticsData,
  AppointmentAnalyticsData,
  IncidentAnalyticsData,
  DashboardData,
  ReportMetadata,
} from './analytics-interfaces';

import {
  ANALYTICS_CONSTANTS,
  ANALYTICS_CACHE_KEYS,
  ANALYTICS_EVENTS,
} from './analytics-constants';

@Injectable()
export class AnalyticsReportGeneratorService {
  private readonly logger = new Logger(AnalyticsReportGeneratorService.name);
  private readonly reportsDir = path.join(process.cwd(), 'reports', 'analytics');

  constructor(
    private readonly eventEmitter: EventEmitter2,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
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
      const cacheKey = ANALYTICS_CACHE_KEYS.REPORT_DATA(reportId);
      const cached = await this.cacheManager.get<ReportData>(cacheKey);

      if (cached && !options.forceRegenerate) {
        return { success: true, data: cached };
      }

      // Collect all necessary data based on report type
      const reportData = await this.collectReportData(schoolId, reportType, period, options);

      // Generate report content
      const reportContent = await this.generateReportContent(reportData, reportType, options);

      // Format report based on requested format
      const formattedReport = await this.formatReport(reportContent, options.format || 'JSON');

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
      await this.cacheManager.set(
        cacheKey,
        report,
        ANALYTICS_CONSTANTS.CACHE_TTL.REPORT_DATA,
      );

      // Save report to file if requested
      if (options.saveToFile) {
        await this.saveReportToFile(report, options.format || 'JSON');
      }

      this.eventEmitter.emit(ANALYTICS_EVENTS.REPORT_GENERATED, {
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
    dashboardData: DashboardData,
  ): Promise<AnalyticsOperationResult<ReportData>> {
    try {
      const reportId = this.generateReportId();

      const reportContent = {
        title: `Dashboard Summary - ${schoolId}`,
        generatedFor: userType,
        timeRange,
        summary: {
          totalAlerts: dashboardData.alerts?.length || 0,
          criticalAlerts: dashboardData.alerts?.filter(a => a.severity === 'CRITICAL').length || 0,
          upcomingAppointments: dashboardData.upcomingAppointments || 0,
          pendingTasks: dashboardData.pendingTasks || 0,
        },
        keyMetrics: dashboardData.keyMetrics || [],
        alerts: dashboardData.alerts || [],
        recommendations: dashboardData.recommendations || [],
        generatedAt: new Date(),
      };

      const formattedReport = await this.formatReport(reportContent, 'JSON');

      const report: ReportData = {
        id: reportId,
        schoolId,
        type: AnalyticsReportType.DASHBOARD_SUMMARY,
        period: AnalyticsTimePeriod.LAST_30_DAYS, // Default period
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
    studentMetrics: StudentHealthMetrics,
  ): Promise<AnalyticsOperationResult<ReportData>> {
    try {
      const reportId = this.generateReportId();

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
        riskAssessment: this.assessStudentRisk(studentMetrics),
        recommendations: this.generateStudentRecommendations(studentMetrics),
        generatedAt: new Date(),
      };

      const formattedReport = await this.formatReport(reportContent, 'JSON');

      const report: ReportData = {
        id: reportId,
        schoolId: 'N/A', // Student-specific report
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
    complianceData: {
      medicationAdherence: number;
      immunizationCompliance: number;
      appointmentCompletion: number;
      incidentReporting: number;
    },
  ): Promise<AnalyticsOperationResult<ReportData>> {
    try {
      const reportId = this.generateReportId();

      const complianceScores = {
        overall: this.calculateOverallCompliance(complianceData),
        medication: complianceData.medicationAdherence,
        immunization: complianceData.immunizationCompliance,
        appointments: complianceData.appointmentCompletion,
        incidents: complianceData.incidentReporting,
      };

      const reportContent = {
        title: `Compliance Report - ${schoolId}`,
        schoolId,
        period,
        complianceScores,
        status: this.determineComplianceStatus(complianceScores),
        areasOfConcern: this.identifyComplianceConcerns(complianceScores),
        recommendations: this.generateComplianceRecommendations(complianceScores),
        generatedAt: new Date(),
      };

      const formattedReport = await this.formatReport(reportContent, 'JSON');

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

  private async collectReportData(
    schoolId: string,
    reportType: AnalyticsReportType,
    period: AnalyticsTimePeriod,
    options: ReportGenerationOptions,
  ): Promise<any> {
    // This would integrate with the data collector service in a real implementation
    // For now, return mock data structure
    switch (reportType) {
      case AnalyticsReportType.HEALTH_OVERVIEW:
        return {
          schoolId,
          period,
          metrics: {
            totalStudents: 500,
            activeHealthRecords: 1250,
            medicationAdherence: 87.5,
            immunizationCompliance: 92.3,
          },
        };
      case AnalyticsReportType.MEDICATION_SUMMARY:
        return {
          schoolId,
          period,
          medications: [
            { name: 'Ibuprofen', count: 45, students: 32 },
            { name: 'Acetaminophen', count: 38, students: 28 },
          ],
        };
      default:
        return { schoolId, period, data: 'Mock data for ' + reportType };
    }
  }

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
            totalStudents: data.metrics.totalStudents,
            healthRecordCoverage: (data.metrics.activeHealthRecords / data.metrics.totalStudents * 100).toFixed(1) + '%',
            medicationAdherence: data.metrics.medicationAdherence + '%',
            immunizationCompliance: data.metrics.immunizationCompliance + '%',
          },
          insights: this.generateHealthInsights(data),
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
        };
      default:
        return baseContent;
    }
  }

  private async formatReport(content: any, format: string): Promise<string> {
    switch (format.toUpperCase()) {
      case 'JSON':
        return JSON.stringify(content, null, 2);
      case 'CSV':
        return this.convertToCSV(content);
      case 'PDF':
        // In a real implementation, this would use a PDF library
        return JSON.stringify(content); // Placeholder
      case 'XLSX':
        // In a real implementation, this would use an Excel library
        return JSON.stringify(content); // Placeholder
      default:
        return JSON.stringify(content, null, 2);
    }
  }

  private convertToCSV(data: any): string {
    // Simple CSV conversion - in a real implementation, this would be more sophisticated
    const rows: string[] = [];

    const flattenObject = (obj: any, prefix = ''): string[] => {
      const result: string[] = [];
      for (const [key, value] of Object.entries(obj)) {
        const newKey = prefix ? `${prefix}.${key}` : key;
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
          result.push(...flattenObject(value, newKey));
        } else {
          result.push(`${newKey},${value}`);
        }
      }
      return result;
    };

    rows.push(...flattenObject(data));
    return rows.join('\n');
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

  private generateHealthInsights(data: any): string[] {
    const insights: string[] = [];

    if (data.metrics.medicationAdherence > 85) {
      insights.push('Excellent medication adherence rates');
    }
    if (data.metrics.immunizationCompliance > 90) {
      insights.push('Strong immunization compliance');
    }
    if (data.metrics.activeHealthRecords / data.metrics.totalStudents > 2) {
      insights.push('High health record activity per student');
    }

    return insights;
  }

  private assessStudentRisk(metrics: StudentHealthMetrics): {
    level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    factors: string[];
  } {
    const factors: string[] = [];
    let riskScore = 0;

    if (metrics.incidents > 5) {
      factors.push('High incident count');
      riskScore += 3;
    } else if (metrics.incidents > 2) {
      factors.push('Moderate incident count');
      riskScore += 1;
    }

    if (metrics.appointments > 10) {
      factors.push('Frequent appointments');
      riskScore += 2;
    }

    if (metrics.medicationAdministrations > 20) {
      factors.push('High medication usage');
      riskScore += 2;
    }

    let level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    if (riskScore >= 5) level = 'CRITICAL';
    else if (riskScore >= 3) level = 'HIGH';
    else if (riskScore >= 1) level = 'MEDIUM';
    else level = 'LOW';

    return { level, factors };
  }

  private generateStudentRecommendations(metrics: StudentHealthMetrics): string[] {
    const recommendations: string[] = [];

    if (metrics.incidents > 2) {
      recommendations.push('Consider additional supervision or support');
    }
    if (metrics.appointments > 5 && metrics.upcomingAppointments > 2) {
      recommendations.push('Schedule follow-up appointments carefully');
    }
    if (!metrics.lastHealthRecord || metrics.lastHealthRecord < new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)) {
      recommendations.push('Due for health record update');
    }

    return recommendations;
  }

  private calculateOverallCompliance(data: any): number {
    const weights = {
      medication: 0.3,
      immunization: 0.3,
      appointments: 0.2,
      incidents: 0.2,
    };

    return (
      data.medicationAdherence * weights.medication +
      data.immunizationCompliance * weights.immunization +
      data.appointmentCompletion * weights.appointments +
      data.incidentReporting * weights.incidents
    );
  }

  private determineComplianceStatus(scores: any): 'EXCELLENT' | 'GOOD' | 'NEEDS_IMPROVEMENT' | 'CRITICAL' {
    const overall = scores.overall;

    if (overall >= 95) return 'EXCELLENT';
    if (overall >= 85) return 'GOOD';
    if (overall >= 70) return 'NEEDS_IMPROVEMENT';
    return 'CRITICAL';
  }

  private identifyComplianceConcerns(scores: any): string[] {
    const concerns: string[] = [];

    if (scores.medication < ANALYTICS_CONSTANTS.THRESHOLDS.MEDICATION_ADHERENCE) {
      concerns.push('Medication adherence below threshold');
    }
    if (scores.immunization < ANALYTICS_CONSTANTS.THRESHOLDS.IMMUNIZATION_COMPLIANCE) {
      concerns.push('Immunization compliance below threshold');
    }
    if (scores.appointments < ANALYTICS_CONSTANTS.THRESHOLDS.APPOINTMENT_COMPLETION) {
      concerns.push('Appointment completion below threshold');
    }

    return concerns;
  }

  private generateComplianceRecommendations(scores: any): string[] {
    const recommendations: string[] = [];

    if (scores.medication < 85) {
      recommendations.push('Implement medication reminder systems');
    }
    if (scores.immunization < 90) {
      recommendations.push('Enhance immunization tracking and reminders');
    }
    if (scores.appointments < 80) {
      recommendations.push('Review appointment scheduling and follow-up processes');
    }

    return recommendations;
  }
}
