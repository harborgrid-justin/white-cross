/**
 * @fileoverview Basic Report Generator Service
 * @module analytics
 * @description Handles basic report generation and formatting
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

import {
  ANALYTICS_CONSTANTS,
  ANALYTICS_CACHE_KEYS,
  ANALYTICS_EVENTS,
} from './analytics-constants';

@Injectable()
export class BasicReportGeneratorService {
  private readonly logger = new Logger(BasicReportGeneratorService.name);
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
   * Generate a basic analytics report
   */
  async generateBasicReport(
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

      // Collect basic data
      const reportData = await this.collectBasicData(schoolId, reportType, period);

      // Generate basic content
      const reportContent = await this.generateBasicContent(reportData, reportType);

      // Format report
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

      // Save to file if requested
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
      this.logger.error(`Failed to generate basic report for school ${schoolId}`, error);
      return {
        success: false,
        error: `Failed to generate report: ${error.message}`,
      };
    }
  }

  /**
   * Export report in multiple formats
   */
  async exportReport(
    reportData: ReportData,
    formats: string[] = ['JSON'],
  ): Promise<AnalyticsOperationResult<{ [format: string]: string }>> {
    try {
      const exports: { [format: string]: string } = {};

      for (const format of formats) {
        exports[format] = await this.formatReport(reportData.content, format);
      }

      return { success: true, data: exports };
    } catch (error) {
      this.logger.error(`Failed to export report ${reportData.id}`, error);
      return {
        success: false,
        error: `Failed to export report: ${error.message}`,
      };
    }
  }

  // Private helper methods

  private async collectBasicData(
    schoolId: string,
    reportType: AnalyticsReportType,
    period: AnalyticsTimePeriod,
  ): Promise<Record<string, unknown>> {
    // Basic data collection - would be extended by specific report generators
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
        return { schoolId, period, data: 'Basic data for ' + reportType };
    }
  }

  private async generateBasicContent(
    data: Record<string, unknown>,
    reportType: AnalyticsReportType,
  ): Promise<Record<string, unknown>> {
    const baseContent = {
      title: `${reportType.replace('_', ' ')} Report`,
      type: reportType,
      generatedAt: new Date(),
      data,
    };

    // Add basic insights
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
          insights: this.generateBasicInsights(data),
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

  private async formatReport(content: Record<string, unknown>, format: string): Promise<string> {
    switch (format.toUpperCase()) {
      case 'JSON':
        return JSON.stringify(content, null, 2);
      case 'CSV':
        return this.convertToCSV(content);
      case 'XML':
        return this.convertToXML(content);
      default:
        return JSON.stringify(content, null, 2);
    }
  }

  private convertToCSV(data: Record<string, unknown>): string {
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

  private convertToXML(data: Record<string, unknown>): string {
    const convertToXML = (obj: any, rootName = 'report'): string => {
      let xml = `<${rootName}>`;

      for (const [key, value] of Object.entries(obj)) {
        if (Array.isArray(value)) {
          xml += `<${key}>`;
          value.forEach((item, index) => {
            xml += convertToXML(item, `item${index}`);
          });
          xml += `</${key}>`;
        } else if (typeof value === 'object' && value !== null) {
          xml += convertToXML(value, key);
        } else {
          xml += `<${key}>${value}</${key}>`;
        }
      }

      xml += `</${rootName}>`;
      return xml;
    };

    return convertToXML(data);
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

  private generateBasicInsights(data: Record<string, unknown>): string[] {
    const insights: string[] = [];

    if (data.metrics?.medicationAdherence > 85) {
      insights.push('Good medication adherence rates');
    }
    if (data.metrics?.immunizationCompliance > 90) {
      insights.push('Strong immunization compliance');
    }
    if (data.metrics && data.metrics.activeHealthRecords / data.metrics.totalStudents > 2) {
      insights.push('High health record activity per student');
    }

    return insights;
  }
}
