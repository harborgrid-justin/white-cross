/**
 * @fileoverview Specialized Report Generator Service
 * @module analytics
 * @description Handles specialized report generation (student health, compliance)
 */

import { Injectable, Inject } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

import {
  AnalyticsReportType,
  AnalyticsTimePeriod,
  ReportData,
  AnalyticsOperationResult,
  StudentHealthMetrics,
} from './types/analytics-report.types';

import { ANALYTICS_CONSTANTS } from './analytics-constants';

import { BaseReportGeneratorService } from '@/services/base-report-generator.service';

import { BaseService } from '@/common/base';
import { BaseService } from '@/common/base';
import { LoggerService } from '@/common/logging/logger.service';
import { Inject } from '@nestjs/common';
@Injectable()
export class SpecializedReportGeneratorService extends BaseReportGeneratorService {
  constructor(
    eventEmitter: EventEmitter2,
    @Inject(CACHE_MANAGER)
    cacheManager: Cache,
  ) {
    super(eventEmitter, cacheManager, SpecializedReportGeneratorService.name);
  }

  /**
   * Generate a student health summary report
   */
  async generateStudentHealthReport(
    studentId: string,
    studentMetrics: StudentHealthMetrics,
  ): Promise<AnalyticsOperationResult<ReportData>> {
    return this.generateReport(
      'N/A',
      AnalyticsReportType.STUDENT_HEALTH_SUMMARY,
      studentMetrics.period,
      { format: 'JSON' },
      async () => {
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
    complianceData: {
      medicationAdherence: number;
      immunizationCompliance: number;
      appointmentCompletion: number;
      incidentReporting: number;
    },
  ): Promise<AnalyticsOperationResult<ReportData>> {
    return this.generateReport(
      schoolId,
      AnalyticsReportType.COMPLIANCE_REPORT,
      period,
      { format: 'JSON' },
      async () => {
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

        return { data: complianceData, content: reportContent };
      },
    );
  }

  /**
   * Generate a dashboard summary report
   */
  async generateDashboardSummaryReport(
    schoolId: string,
    userType: string,
    timeRange: string,
    dashboardData: {
      alerts?: Array<{ severity: string }>;
      keyMetrics?: unknown[];
      recommendations?: unknown[];
      upcomingAppointments?: number;
      pendingTasks?: number;
    },
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
            criticalAlerts: dashboardData.alerts?.filter((a: { severity: string }) => a.severity === 'CRITICAL').length || 0,
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

  // Private helper methods

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

  private calculateOverallCompliance(data: {
    medicationAdherence: number;
    immunizationCompliance: number;
    appointmentCompletion: number;
    incidentReporting: number;
  }): number {
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

  private determineComplianceStatus(scores: {
    overall: number;
    medication: number;
    immunization: number;
    appointments: number;
    incidents: number;
  }): 'EXCELLENT' | 'GOOD' | 'NEEDS_IMPROVEMENT' | 'CRITICAL' {
    const overall = scores.overall;

    if (overall >= 95) return 'EXCELLENT';
    if (overall >= 85) return 'GOOD';
    if (overall >= 70) return 'NEEDS_IMPROVEMENT';
    return 'CRITICAL';
  }

  private identifyComplianceConcerns(scores: {
    overall: number;
    medication: number;
    immunization: number;
    appointments: number;
    incidents: number;
  }): string[] {
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

  private generateComplianceRecommendations(scores: {
    overall: number;
    medication: number;
    immunization: number;
    appointments: number;
    incidents: number;
  }): string[] {
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
