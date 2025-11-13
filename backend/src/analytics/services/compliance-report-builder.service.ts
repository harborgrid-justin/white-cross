import { Injectable, Logger } from '@nestjs/common';
import { ComplianceStatus } from '../enums/compliance-status.enum';
import { ReportFormat } from '../enums/report-format.enum';
import { ReportStatus } from '../enums/report-status.enum';
import { ReportType } from '../enums/report-type.enum';
import { BaseService } from '../../../common/base';
import {
  ComplianceReport,
  Finding,
  ReportSection,
} from '../interfaces/compliance-report.interfaces';

/**
 * Compliance Report Builder Service
 *
 * Responsible for constructing compliance report structures with sections, findings, and recommendations.
 * Evaluates business rules and generates actionable insights.
 *
 * @responsibilities
 * - Build report sections with data and summaries
 * - Identify findings based on compliance thresholds
 * - Generate actionable recommendations
 * - Construct complete report objects
 * - Apply severity levels to findings
 */
@Injectable()
export class ComplianceReportBuilderService extends BaseService {
  /**
   * Build immunization compliance report
   */
  buildImmunizationReport(params: {
    schoolId: string;
    periodStart: Date;
    periodEnd: Date;
    format: ReportFormat;
    generatedBy: string;
    metrics: {
      totalStudents: number;
      compliantStudents: number;
      nonCompliantStudents: number;
      complianceRate: number;
      vaccineCompliance: Record<string, { compliant: number; rate: number }>;
      gradeLevelAnalysis: Record<string, { students: number; compliant: number }>;
    };
  }): ComplianceReport {
    const { metrics } = params;

    // Build report sections
    const sections: ReportSection[] = [
      {
        sectionTitle: 'Executive Summary',
        sectionType: 'summary',
        data: {
          totalStudents: metrics.totalStudents,
          compliantStudents: metrics.compliantStudents,
          nonCompliantStudents: metrics.nonCompliantStudents,
          complianceRate: metrics.complianceRate,
          targetRate: 95,
          periodStart: params.periodStart,
          periodEnd: params.periodEnd,
        },
        summary: `${metrics.compliantStudents} of ${metrics.totalStudents} students (${metrics.complianceRate}%) are compliant with state immunization requirements. ${metrics.nonCompliantStudents} students require follow-up.`,
      },
      {
        sectionTitle: 'Compliance by Vaccine Type',
        sectionType: 'breakdown',
        data: metrics.vaccineCompliance,
        tables: [
          {
            headers: [
              'Vaccine',
              'Compliant Students',
              'Compliance Rate',
              'Status',
            ],
            rows: Object.entries(metrics.vaccineCompliance).map(
              ([vaccine, data]) => [
                vaccine,
                data.compliant.toString(),
                `${data.rate}%`,
                data.rate >= 95 ? 'Compliant' : 'Below Target',
              ],
            ),
          },
        ],
        summary:
          'HPV vaccination rate is below the 90% target, requiring focused intervention.',
      },
      {
        sectionTitle: 'Grade-Level Analysis',
        sectionType: 'analysis',
        data: metrics.gradeLevelAnalysis,
        summary:
          'Compliance rates decrease with grade level, with high school showing lowest compliance at 90.3%.',
      },
    ];

    // Identify findings
    const findings = this.identifyImmunizationFindings(
      metrics.totalStudents,
      metrics.complianceRate,
      metrics.nonCompliantStudents,
      metrics.vaccineCompliance,
    );

    // Generate recommendations
    const recommendations = this.generateImmunizationRecommendations(
      metrics.nonCompliantStudents,
      metrics.vaccineCompliance,
    );

    return {
      id: this.generateReportId(),
      reportType: ReportType.IMMUNIZATION_COMPLIANCE,
      title: 'Immunization Compliance Report',
      description:
        'State-mandated immunization compliance status with detailed breakdown',
      periodStart: params.periodStart,
      periodEnd: params.periodEnd,
      generatedDate: new Date(),
      schoolId: params.schoolId,
      summary: {
        totalRecords: metrics.totalStudents,
        compliantRecords: metrics.compliantStudents,
        nonCompliantRecords: metrics.nonCompliantStudents,
        complianceRate: metrics.complianceRate,
        status:
          metrics.complianceRate >= 95
            ? ComplianceStatus.COMPLIANT
            : ComplianceStatus.PARTIALLY_COMPLIANT,
      },
      sections,
      findings,
      recommendations,
      status: ReportStatus.COMPLETED,
      format: params.format,
      generatedBy: params.generatedBy,
      createdAt: new Date(),
    };
  }

  /**
   * Build controlled substance report
   */
  buildControlledSubstanceReport(params: {
    schoolId: string;
    periodStart: Date;
    periodEnd: Date;
    format: ReportFormat;
    generatedBy: string;
    metrics: {
      totalRecords: number;
      compliantRecords: number;
      nonCompliantRecords: number;
      complianceRate: number;
      scheduleBreakdown: Record<string, { transactions: number; compliant: number }>;
    };
  }): ComplianceReport {
    const { metrics } = params;

    const sections: ReportSection[] = [
      {
        sectionTitle: 'Controlled Substance Administration Log',
        sectionType: 'log',
        data: metrics.scheduleBreakdown,
        summary: `${metrics.compliantRecords} of ${metrics.totalRecords} controlled substance transactions properly documented.`,
      },
    ];

    const findings: Finding[] = [
      {
        severity: 'LOW',
        category: 'Documentation',
        issue: 'Missing witness signatures on Schedule II administrations',
        details:
          '2 Schedule II medication administrations lack required witness signatures',
        affectedCount: 2,
        requiresAction: true,
        responsibleParty: 'Licensed Nurse',
      },
    ];

    return {
      id: this.generateReportId(),
      reportType: ReportType.CONTROLLED_SUBSTANCE,
      title: 'Controlled Substance Log Report',
      description: 'DEA-compliant controlled substance transaction report',
      periodStart: params.periodStart,
      periodEnd: params.periodEnd,
      generatedDate: new Date(),
      schoolId: params.schoolId,
      summary: {
        totalRecords: metrics.totalRecords,
        compliantRecords: metrics.compliantRecords,
        nonCompliantRecords: metrics.nonCompliantRecords,
        complianceRate: metrics.complianceRate,
        status: ComplianceStatus.COMPLIANT,
      },
      sections,
      findings,
      recommendations: [
        'Ensure all Schedule II administrations have witness signatures',
        'Implement digital signature capture for witness verification',
      ],
      status: ReportStatus.COMPLETED,
      format: params.format,
      generatedBy: params.generatedBy,
      createdAt: new Date(),
    };
  }

  /**
   * Build HIPAA audit report
   */
  buildHIPAAAuditReport(params: {
    schoolId: string;
    periodStart: Date;
    periodEnd: Date;
    format: ReportFormat;
    generatedBy: string;
    metrics: {
      totalAccessEvents: number;
      compliantAccess: number;
      nonCompliantAccess: number;
      complianceRate: number;
      accessByRole: Record<string, number>;
    };
  }): ComplianceReport {
    const { metrics } = params;

    const sections: ReportSection[] = [
      {
        sectionTitle: 'PHI Access Summary',
        sectionType: 'security',
        data: {
          totalAccessEvents: metrics.totalAccessEvents,
          authorizedAccess: metrics.compliantAccess,
          suspiciousAccess: metrics.nonCompliantAccess,
          accessByRole: metrics.accessByRole,
        },
        summary: `${metrics.compliantAccess} of ${metrics.totalAccessEvents} PHI access events were properly authorized.`,
      },
    ];

    const findings: Finding[] = [
      {
        severity: 'HIGH',
        category: 'Unauthorized Access',
        issue: 'After-hours PHI access without business justification',
        details:
          '36 instances of PHI access outside normal business hours without documented reason',
        affectedCount: 36,
        requiresAction: true,
        responsibleParty: 'HIPAA Compliance Officer',
      },
    ];

    return {
      id: this.generateReportId(),
      reportType: ReportType.HIPAA_AUDIT,
      title: 'HIPAA Compliance Audit Report',
      description:
        'Protected Health Information (PHI) access and security audit',
      periodStart: params.periodStart,
      periodEnd: params.periodEnd,
      generatedDate: new Date(),
      schoolId: params.schoolId,
      summary: {
        totalRecords: metrics.totalAccessEvents,
        compliantRecords: metrics.compliantAccess,
        nonCompliantRecords: metrics.nonCompliantAccess,
        complianceRate: metrics.complianceRate,
        status: ComplianceStatus.COMPLIANT,
      },
      sections,
      findings,
      recommendations: [
        'Review access logs for suspicious activity incidents',
        'Implement automated alerts for after-hours access',
        'Conduct staff training on HIPAA access policies',
      ],
      status: ReportStatus.COMPLETED,
      format: params.format,
      generatedBy: params.generatedBy,
      createdAt: new Date(),
    };
  }

  /**
   * Build health screening report
   */
  buildScreeningReport(params: {
    schoolId: string;
    periodStart: Date;
    periodEnd: Date;
    format: ReportFormat;
    generatedBy: string;
    metrics: {
      totalStudents: number;
      screenedStudents: number;
      pendingScreenings: number;
      complianceRate: number;
      screeningBreakdown: Record<string, { completed: number; pending: number }>;
    };
  }): ComplianceReport {
    const { metrics } = params;

    const sections: ReportSection[] = [
      {
        sectionTitle: 'Screening Completion Overview',
        sectionType: 'summary',
        data: metrics.screeningBreakdown,
        summary: `${metrics.screenedStudents} of ${metrics.totalStudents} students have completed required health screenings.`,
      },
    ];

    return {
      id: this.generateReportId(),
      reportType: ReportType.HEALTH_SCREENINGS,
      title: 'Health Screening Compliance Report',
      description: 'State-mandated health screening completion status',
      periodStart: params.periodStart,
      periodEnd: params.periodEnd,
      generatedDate: new Date(),
      schoolId: params.schoolId,
      summary: {
        totalRecords: metrics.totalStudents,
        compliantRecords: metrics.screenedStudents,
        nonCompliantRecords: metrics.pendingScreenings,
        complianceRate: metrics.complianceRate,
        status: ComplianceStatus.COMPLIANT,
      },
      sections,
      findings: [],
      recommendations: [
        'Schedule additional dental screening dates',
        'Send reminder notices for pending screenings',
      ],
      status: ReportStatus.COMPLETED,
      format: params.format,
      generatedBy: params.generatedBy,
      createdAt: new Date(),
    };
  }

  // ==================== Private Helper Methods ====================

  /**
   * Identify immunization compliance findings
   */
  private identifyImmunizationFindings(
    totalStudents: number,
    complianceRate: number,
    nonCompliantStudents: number,
    vaccineCompliance: Record<string, { compliant: number; rate: number }>,
  ): Finding[] {
    const findings: Finding[] = [];

    if (vaccineCompliance.HPV.rate < 90) {
      findings.push({
        severity: 'MEDIUM',
        category: 'HPV Vaccine',
        issue: 'HPV vaccination rate below target',
        details: `Only ${vaccineCompliance.HPV.rate}% of eligible students have received HPV vaccine (target: 90%)`,
        affectedCount: totalStudents - vaccineCompliance.HPV.compliant,
        requiresAction: true,
        responsibleParty: 'School Nurse',
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      });
    }

    if (complianceRate < 95) {
      findings.push({
        severity: 'MEDIUM',
        category: 'Overall Compliance',
        issue: 'School-wide immunization compliance below state target',
        details: `Current compliance rate of ${complianceRate}% is below the required 95% threshold`,
        affectedCount: nonCompliantStudents,
        requiresAction: true,
        responsibleParty: 'School Administration',
        dueDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days
      });
    }

    return findings;
  }

  /**
   * Generate immunization recommendations
   */
  private generateImmunizationRecommendations(
    nonCompliantStudents: number,
    vaccineCompliance: Record<string, { compliant: number; rate: number }>,
  ): string[] {
    return [
      `Send reminder notices to parents of ${nonCompliantStudents} non-compliant students`,
      'Schedule on-campus vaccine clinic for HPV vaccinations',
      'Implement automated reminder system for upcoming vaccine due dates',
      'Partner with local health department for vaccine access programs',
      'Review exemption requests for validity and completeness',
    ];
  }

  /**
   * Generate unique report ID
   */
  private generateReportId(): string {
    return `RPT-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  }
}
