import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ComplianceReportGeneratorService } from './compliance-report-generator.service';
import { HealthTrendAnalyticsService } from './health-trend-analytics.service';
import { TimePeriod } from '../enums/time-period.enum';
import { AnalyticsGenerateCustomReportDto } from '../dto/custom-reports.dto';
import { GetReportQueryDto } from '../dto/report-generation.dto';

import { BaseService } from '@/common/base';
interface GeneratedReport {
  id: string;
  reportName?: string;
  title?: string;
  reportType: string;
  generatedDate: Date;
  status: string;
  format: string;
  fileUrl?: string;
  period?: {
    start: Date;
    end: Date;
  };
  data?: unknown;
}

interface CustomReportResponse {
  report: {
    id: string;
    name: string;
    type: string;
    format: string;
    generatedAt: Date;
    status: string;
    downloadUrl: string;
    recipients?: string[];
    schedule?: string;
  };
}

interface ReportResponse {
  report: GeneratedReport | {
    id: string;
    title: string;
    reportType: string;
    generatedDate: Date;
    status: string;
    format: string;
    fileUrl?: string;
  };
}

/**
 * Analytics Report Service
 * Handles custom report generation and retrieval
 *
 * Responsibilities:
 * - Generate custom analytics reports
 * - Retrieve generated reports
 * - Coordinate with compliance report generator
 * - Support various report formats (JSON, PDF, CSV)
 */
@Injectable()
export class AnalyticsReportService extends BaseService {
  constructor(
    private readonly healthTrendService: HealthTrendAnalyticsService,
    private readonly reportGeneratorService: ComplianceReportGeneratorService,
  ) {
    super("AnalyticsReportService");}

  /**
   * Generate custom report
   */
  async generateCustomReport(
    dto: AnalyticsGenerateCustomReportDto,
    userId: string,
  ): Promise<CustomReportResponse> {
    try {
      const start = dto.startDate;
      const end = dto.endDate;
      const format = dto.format || 'JSON';
      const schoolId = dto.filters?.schoolId || 'default-school';

      let report: GeneratedReport;

      switch (dto.reportType) {
        case 'IMMUNIZATION_REPORT':
          report = await this.reportGeneratorService.generateImmunizationReport(
            {
              schoolId,
              periodStart: start,
              periodEnd: end,
              format: format as 'JSON' | 'PDF' | 'CSV',
              generatedBy: userId,
            },
          ) as GeneratedReport;
          break;

        case 'COMPLIANCE_STATUS':
          report =
            await this.reportGeneratorService.generateControlledSubstanceReport(
              {
                schoolId,
                periodStart: start,
                periodEnd: end,
                format: format as 'JSON' | 'PDF' | 'CSV',
                generatedBy: userId,
              },
            ) as GeneratedReport;
          break;

        case 'STUDENT_HEALTH_SUMMARY':
          report = await this.reportGeneratorService.generateScreeningReport({
            schoolId,
            periodStart: start,
            periodEnd: end,
            format: format as 'JSON' | 'PDF' | 'CSV',
            generatedBy: userId,
          }) as GeneratedReport;
          break;

        default:
          // Generate generic health metrics report
          const summary = await this.healthTrendService.getPopulationSummary(
            schoolId,
            TimePeriod.CUSTOM,
            { start, end },
          );

          report = {
            id: `RPT-${Date.now()}`,
            reportName: dto.reportName,
            reportType: dto.reportType,
            generatedDate: new Date(),
            period: { start, end },
            data: summary,
            format,
            status: 'COMPLETED',
          };
      }

      return {
        report: {
          id: report.id,
          name: dto.reportName,
          type: dto.reportType,
          format,
          generatedAt: new Date(),
          status: 'COMPLETED',
          downloadUrl:
            report.fileUrl || `/api/v1/analytics/reports/${report.id}`,
          recipients: dto.recipients,
          schedule: dto.schedule,
        },
      };
    } catch (error) {
      this.logError('Error generating custom report', error);
      throw error;
    }
  }

  /**
   * Get generated report
   */
  async getGeneratedReport(reportId: string, query: GetReportQueryDto): Promise<ReportResponse> {
    try {
      const report = await this.reportGeneratorService.getReport(reportId);

      if (!report) {
        throw new NotFoundException('Report not found');
      }

      // Return full report or metadata only
      if (!query.includeData) {
        return {
          report: {
            id: report.id,
            title: report.title,
            reportType: report.reportType,
            generatedDate: report.generatedDate,
            status: report.status,
            format: report.format,
            fileUrl: report.fileUrl,
          },
        };
      }

      return { report };
    } catch (error) {
      this.logError('Error getting generated report', error);
      throw error;
    }
  }
}
