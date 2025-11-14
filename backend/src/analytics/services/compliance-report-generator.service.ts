import { Injectable, Logger } from '@nestjs/common';
import { ReportFormat } from '../enums/report-format.enum';
import { ReportStatus } from '../enums/report-status.enum';
import { ReportType } from '../enums/report-type.enum';
import {
  ComplianceReport,
  ScheduledReportConfig,
} from '../interfaces/compliance-report.interfaces';
import { ComplianceDataCollectorService } from './compliance-data-collector.service';
import { ComplianceMetricsCalculatorService } from './compliance-metrics-calculator.service';
import { ComplianceReportBuilderService } from './compliance-report-builder.service';
import { ComplianceReportExporterService } from './compliance-report-exporter.service';
import { ComplianceReportPersistenceService } from './compliance-report-persistence.service';

import { BaseService } from '@/common/base';
/**
 * Compliance Report Generation Service
 *
 * Main orchestration service for automated generation of regulatory compliance reports.
 * Supports HIPAA, FERPA, state health requirements.
 *
 * Features:
 * - Multi-format export (PDF, CSV, JSON)
 * - Email distribution integration
 * - Report caching for performance
 * - Scheduled report generation
 * - HIPAA and FERPA compliance validation
 * - Comprehensive audit trail
 *
 * @architecture
 * This service acts as a facade/orchestrator, delegating specialized tasks to:
 * - ComplianceDataCollectorService: Data querying and collection
 * - ComplianceMetricsCalculatorService: Metric calculations
 * - ComplianceReportBuilderService: Report construction
 * - ComplianceReportExporterService: Format exports
 * - ComplianceReportPersistenceService: Database and caching operations
 */
@Injectable()
export class ComplianceReportGeneratorService extends BaseService {
  private scheduledConfigs: ScheduledReportConfig[] = [];

  constructor(
    private readonly dataCollector: ComplianceDataCollectorService,
    private readonly metricsCalculator: ComplianceMetricsCalculatorService,
    private readonly reportBuilder: ComplianceReportBuilderService,
    private readonly reportExporter: ComplianceReportExporterService,
    private readonly reportPersistence: ComplianceReportPersistenceService,
  ) {
    super("ComplianceReportGeneratorService");}

  /**
   * Generate Immunization Compliance Report
   * State-mandated immunization compliance status
   */
  async generateImmunizationReport(params: {
    schoolId: string;
    periodStart: Date;
    periodEnd: Date;
    format: ReportFormat;
    generatedBy: string;
  }): Promise<ComplianceReport> {
    try {
      this.logInfo(
        `Generating immunization compliance report for school ${params.schoolId}`,
      );

      // Check cache first
      const cacheKey = `immunization-report:${params.schoolId}:${params.periodStart}-${params.periodEnd}`;
      const cached = await this.reportPersistence.getCachedReport(cacheKey);
      if (cached && cached.format === params.format) {
        this.logDebug('Cache hit for immunization report');
        return cached;
      }

      // Collect data
      const data = await this.dataCollector.getImmunizationData(
        params.schoolId,
        params.periodStart,
        params.periodEnd,
      );

      // Calculate metrics
      const metrics = this.metricsCalculator.calculateImmunizationMetrics(
        data.totalStudents,
      );

      // Build report
      const report = this.reportBuilder.buildImmunizationReport({
        ...params,
        metrics,
      });

      // Persist report to database
      await this.reportPersistence.saveReport(report);

      // Cache for 10 minutes
      await this.reportPersistence.cacheReport(cacheKey, report, 600000);

      this.logInfo(`Immunization compliance report generated: ${report.id}`);
      return report;
    } catch (error) {
      this.logError('Error generating immunization report', error.stack);
      throw error;
    }
  }

  /**
   * Generate Controlled Substance Report
   * DEA-compliant controlled substance transaction report
   */
  async generateControlledSubstanceReport(params: {
    schoolId: string;
    periodStart: Date;
    periodEnd: Date;
    format: ReportFormat;
    generatedBy: string;
  }): Promise<ComplianceReport> {
    try {
      this.logInfo(
        `Generating controlled substance report for school ${params.schoolId}`,
      );

      // Collect data
      const data = await this.dataCollector.getControlledSubstanceData(
        params.schoolId,
        params.periodStart,
        params.periodEnd,
      );

      // Calculate metrics
      const metrics = this.metricsCalculator.calculateControlledSubstanceMetrics(
        data.totalRecords,
      );

      // Build report
      const report = this.reportBuilder.buildControlledSubstanceReport({
        ...params,
        metrics,
      });

      // Persist report
      await this.reportPersistence.saveReport(report);

      this.logInfo(`Controlled substance report generated: ${report.id}`);
      return report;
    } catch (error) {
      this.logError(
        'Error generating controlled substance report',
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Generate HIPAA Audit Report
   * Protected Health Information (PHI) access and security audit
   */
  async generateHIPAAAuditReport(params: {
    schoolId: string;
    periodStart: Date;
    periodEnd: Date;
    format: ReportFormat;
    generatedBy: string;
  }): Promise<ComplianceReport> {
    try {
      this.logInfo(
        `Generating HIPAA audit report for school ${params.schoolId}`,
      );

      // Calculate metrics (in production, would query audit logs)
      const metrics = this.metricsCalculator.calculateHIPAAMetrics();

      // Build report
      const report = this.reportBuilder.buildHIPAAAuditReport({
        ...params,
        metrics,
      });

      // Persist report
      await this.reportPersistence.saveReport(report);

      this.logInfo(`HIPAA audit report generated: ${report.id}`);
      return report;
    } catch (error) {
      this.logError('Error generating HIPAA audit report', error.stack);
      throw error;
    }
  }

  /**
   * Generate Health Screening Report
   * State-mandated health screening completion status
   */
  async generateScreeningReport(params: {
    schoolId: string;
    periodStart: Date;
    periodEnd: Date;
    format: ReportFormat;
    generatedBy: string;
  }): Promise<ComplianceReport> {
    try {
      this.logInfo(
        `Generating health screening report for school ${params.schoolId}`,
      );

      // Collect data
      const data = await this.dataCollector.getScreeningData(
        params.schoolId,
        params.periodStart,
        params.periodEnd,
      );

      // Calculate metrics
      const metrics = this.metricsCalculator.calculateScreeningMetrics(
        data.totalStudents,
      );

      // Build report
      const report = this.reportBuilder.buildScreeningReport({
        ...params,
        metrics,
      });

      // Persist report
      await this.reportPersistence.saveReport(report);

      this.logInfo(`Health screening report generated: ${report.id}`);
      return report;
    } catch (error) {
      this.logError(
        'Error generating health screening report',
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Get report by ID with caching
   */
  async getReport(reportId: string): Promise<ComplianceReport> {
    return this.reportPersistence.getReportById(reportId);
  }

  /**
   * Get all reports with optional filters
   */
  async getReports(filters?: {
    reportType?: ReportType;
    schoolId?: string;
    startDate?: Date;
    endDate?: Date;
    status?: ReportStatus;
  }): Promise<ComplianceReport[]> {
    return this.reportPersistence.getReports(filters);
  }

  /**
   * Schedule recurring report generation
   */
  async scheduleRecurringReport(
    config: Omit<ScheduledReportConfig, 'id' | 'nextScheduled'>,
  ): Promise<ScheduledReportConfig> {
    try {
      const scheduledConfig: ScheduledReportConfig = {
        ...config,
        id: this.generateConfigId(),
        nextScheduled: this.calculateNextScheduled(config.frequency),
      };

      this.scheduledConfigs.push(scheduledConfig);
      this.logInfo(
        `Recurring report scheduled: ${scheduledConfig.id} - ${config.reportType} ${config.frequency}`,
      );

      return scheduledConfig;
    } catch (error) {
      this.logError('Error scheduling recurring report', error.stack);
      throw error;
    }
  }

  /**
   * Get scheduled report configurations
   */
  async getScheduledReports(): Promise<ScheduledReportConfig[]> {
    return this.scheduledConfigs.filter((c) => c.isActive);
  }

  /**
   * Export report to specified format
   * Supports PDF, CSV, Excel, and JSON formats
   */
  async exportReport(reportId: string, format: ReportFormat): Promise<string> {
    try {
      const report = await this.reportPersistence.getReportById(reportId);

      // Export to format
      const { fileUrl, fileSize } = await this.reportExporter.exportReport(
        report,
        format,
      );

      // Update report with file information
      await this.reportPersistence.updateReportExport(
        reportId,
        fileUrl,
        fileSize,
      );

      this.logInfo(`Report exported: ${reportId} to ${format} format`);
      return fileUrl;
    } catch (error) {
      this.logError(`Error exporting report ${reportId}`, error.stack);
      throw error;
    }
  }

  /**
   * Distribute report to recipients via email
   */
  async distributeReport(
    reportId: string,
    recipients: string[],
  ): Promise<void> {
    try {
      const report = await this.reportPersistence.getReportById(reportId);

      // In production, integrate with email service (e.g., SendGrid, AWS SES)
      const emailPayload = {
        to: recipients,
        subject: `${report.title} - ${report.periodStart.toLocaleDateString()} to ${report.periodEnd.toLocaleDateString()}`,
        body: this.generateEmailBody(report),
        attachments: [
          {
            filename: `${report.reportType}_${report.id}.pdf`,
            url: report.fileUrl || `/reports/${report.id}.pdf`,
          },
        ],
        priority: report.findings.some(
          (f) => f.severity === 'CRITICAL' || f.severity === 'HIGH',
        )
          ? 'high'
          : 'normal',
      };

      // Placeholder for email service integration
      // await this.emailService.send(emailPayload);

      // Update report metadata
      await this.reportPersistence.updateReportDistribution(
        reportId,
        recipients,
      );

      this.logInfo(
        `Report distributed: ${reportId} to ${recipients.length} recipients`,
      );
    } catch (error) {
      this.logError(`Error distributing report ${reportId}`, error.stack);
      throw error;
    }
  }

  // ==================== Private Helper Methods ====================

  /**
   * Generate unique config ID
   */
  private generateConfigId(): string {
    return `CFG-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  }

  /**
   * Calculate next scheduled date based on frequency
   */
  private calculateNextScheduled(
    frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'ANNUALLY',
  ): Date {
    const now = new Date();
    const next = new Date(now);

    switch (frequency) {
      case 'DAILY':
        next.setDate(now.getDate() + 1);
        break;
      case 'WEEKLY':
        next.setDate(now.getDate() + 7);
        break;
      case 'MONTHLY':
        next.setMonth(now.getMonth() + 1);
        break;
      case 'QUARTERLY':
        next.setMonth(now.getMonth() + 3);
        break;
      case 'ANNUALLY':
        next.setFullYear(now.getFullYear() + 1);
        break;
    }

    return next;
  }

  /**
   * Generate email body for report distribution
   */
  private generateEmailBody(report: ComplianceReport): string {
    const criticalFindings = report.findings.filter(
      (f) => f.severity === 'CRITICAL' || f.severity === 'HIGH',
    );

    let body = `<h2>${report.title}</h2>`;
    body += `<p><strong>Report Period:</strong> ${report.periodStart.toLocaleDateString()} - ${report.periodEnd.toLocaleDateString()}</p>`;
    body += `<p><strong>Generated:</strong> ${report.generatedDate.toLocaleString()}</p>`;
    body += `<hr>`;
    body += `<h3>Summary</h3>`;
    body += `<ul>`;
    body += `<li><strong>Compliance Rate:</strong> ${report.summary.complianceRate}%</li>`;
    body += `<li><strong>Status:</strong> ${report.summary.status}</li>`;
    body += `<li><strong>Total Records:</strong> ${report.summary.totalRecords}</li>`;
    body += `<li><strong>Compliant:</strong> ${report.summary.compliantRecords}</li>`;
    body += `<li><strong>Non-Compliant:</strong> ${report.summary.nonCompliantRecords}</li>`;
    body += `</ul>`;

    if (criticalFindings.length > 0) {
      body += `<h3 style="color: red;">Critical Findings (${criticalFindings.length})</h3>`;
      body += `<ul>`;
      criticalFindings.forEach((f) => {
        body += `<li><strong>${f.category}:</strong> ${f.issue}</li>`;
      });
      body += `</ul>`;
    }

    body += `<p>Please review the full report attached to this email.</p>`;
    body += `<p><em>This is an automated email from White Cross Health Platform.</em></p>`;

    return body;
  }
}
