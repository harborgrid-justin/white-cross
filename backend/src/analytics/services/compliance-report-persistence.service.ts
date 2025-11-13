import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { ComplianceStatus } from '../enums/compliance-status.enum';
import { ReportStatus } from '../enums/report-status.enum';
import { ReportType } from '../enums/report-type.enum';
import { ComplianceReport } from '../interfaces/compliance-report.interfaces';
import { AnalyticsReport } from '../entities/analytics-report.entity';

import { BaseService } from '../../../common/base';
/**
 * Compliance Report Persistence Service
 *
 * Responsible for database operations and caching for compliance reports.
 * Handles all data persistence and retrieval operations.
 *
 * @responsibilities
 * - Save reports to database
 * - Retrieve reports from database
 * - Manage report caching
 * - Map between database entities and domain models
 * - Handle report queries with filters
 */
@Injectable()
export class ComplianceReportPersistenceService extends BaseService {
  constructor(
    @InjectModel(AnalyticsReport)
    private readonly analyticsReportModel: typeof AnalyticsReport,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  /**
   * Save report to database
   */
  async saveReport(report: ComplianceReport): Promise<AnalyticsReport> {
    try {
      const dbReport = await this.analyticsReportModel.create({
        id: report.id,
        reportType: report.reportType as any,
        title: report.title,
        description: report.description,
        summary: {
          ...report.summary,
          status: report.summary.status as any,
        },
        sections: report.sections,
        findings: report.findings,
        recommendations: report.recommendations,
        schoolId: report.schoolId,
        periodStart: report.periodStart,
        periodEnd: report.periodEnd,
        generatedDate: report.generatedDate,
        status: report.status as any,
        format: report.format,
        generatedBy: report.generatedBy,
      });

      this.logInfo(`Report saved to database: ${report.id}`);
      return dbReport;
    } catch (error) {
      this.logError('Error saving report to database', error.stack);
      throw error;
    }
  }

  /**
   * Get report by ID with caching
   */
  async getReportById(reportId: string): Promise<ComplianceReport> {
    try {
      const cacheKey = `report:${reportId}`;
      const cached = await this.cacheManager.get<ComplianceReport>(cacheKey);
      if (cached) {
        this.logDebug(`Cache hit for report ${reportId}`);
        return cached;
      }

      const dbReport = await this.analyticsReportModel.findOne({
        where: { id: reportId },
      });

      if (!dbReport) {
        throw new NotFoundException(`Report with ID ${reportId} not found`);
      }

      const report = this.mapDbReportToCompliance(dbReport);

      // Cache for 5 minutes
      await this.cacheManager.set(cacheKey, report, 300000);

      return report;
    } catch (error) {
      this.logError(`Error retrieving report ${reportId}`, error.stack);
      throw error;
    }
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
    try {
      const where: any = {};

      if (filters?.reportType) {
        where.reportType = filters.reportType;
      }
      if (filters?.schoolId) {
        where.schoolId = filters.schoolId;
      }
      if (filters?.startDate || filters?.endDate) {
        where.generatedDate = {};
        if (filters.startDate) {
          where.generatedDate[Op.gte] = filters.startDate;
        }
        if (filters.endDate) {
          where.generatedDate[Op.lte] = filters.endDate;
        }
      }
      if (filters?.status) {
        where.status = filters.status;
      }

      const dbReports = await this.analyticsReportModel.findAll({
        where,
        order: [['generatedDate', 'DESC']],
      });

      return dbReports.map((r) => this.mapDbReportToCompliance(r));
    } catch (error) {
      this.logError('Error retrieving reports', error.stack);
      throw error;
    }
  }

  /**
   * Cache report with custom key and TTL
   */
  async cacheReport(
    cacheKey: string,
    report: ComplianceReport,
    ttl: number = 600000,
  ): Promise<void> {
    try {
      await this.cacheManager.set(cacheKey, report, ttl);
      this.logDebug(`Report cached with key: ${cacheKey}`);
    } catch (error) {
      this.logError('Error caching report', error.stack);
      // Don't throw - caching is not critical
    }
  }

  /**
   * Get cached report
   */
  async getCachedReport(cacheKey: string): Promise<ComplianceReport | null> {
    try {
      return await this.cacheManager.get<ComplianceReport>(cacheKey);
    } catch (error) {
      this.logError('Error retrieving cached report', error.stack);
      return null;
    }
  }

  /**
   * Update report with export information
   */
  async updateReportExport(
    reportId: string,
    fileUrl: string,
    fileSize: number,
  ): Promise<void> {
    try {
      const report = await this.getReportById(reportId);
      const updatedReport = { ...report, fileUrl, fileSize };

      // Update cache
      await this.cacheManager.set(`report:${reportId}`, updatedReport, 300000);

      this.logDebug(`Report export info updated: ${reportId}`);
    } catch (error) {
      this.logError('Error updating report export info', error.stack);
      // Don't throw - this is supplementary data
    }
  }

  /**
   * Update report with distribution information
   */
  async updateReportDistribution(
    reportId: string,
    recipients: string[],
  ): Promise<void> {
    try {
      const report = await this.getReportById(reportId);
      const updatedReport = {
        ...report,
        distributionList: recipients,
        sentAt: new Date(),
      };

      // Update cache
      await this.cacheManager.set(`report:${reportId}`, updatedReport, 300000);

      this.logDebug(`Report distribution info updated: ${reportId}`);
    } catch (error) {
      this.logError('Error updating report distribution info', error.stack);
      // Don't throw - this is supplementary data
    }
  }

  // ==================== Private Helper Methods ====================

  /**
   * Map database report to compliance report interface
   */
  private mapDbReportToCompliance(dbReport: AnalyticsReport): ComplianceReport {
    return {
      id: dbReport.id,
      reportType: dbReport.reportType as any as ReportType,
      title: dbReport.title,
      description: dbReport.description || '',
      periodStart: dbReport.periodStart,
      periodEnd: dbReport.periodEnd,
      generatedDate: dbReport.generatedDate,
      schoolId: dbReport.schoolId || '',
      summary: {
        ...dbReport.summary,
        status: dbReport.summary.status as any as ComplianceStatus,
      },
      sections: dbReport.sections,
      findings: dbReport.findings,
      recommendations: dbReport.recommendations,
      status: dbReport.status as any as ReportStatus,
      format: dbReport.format,
      generatedBy: dbReport.generatedBy || 'system',
      createdAt: dbReport.createdAt,
    };
  }
}
