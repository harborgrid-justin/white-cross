/**
 * @fileoverview Base Report Generator Service
 * @module analytics/services
 * @description Abstract base class for report generators with common functionality
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
  ReportMetadata,
  AnalyticsOperationResult,
} from '../types/analytics-report.types';

import {
  ANALYTICS_CONSTANTS,
  ANALYTICS_CACHE_KEYS,
  ANALYTICS_EVENTS,
} from '../analytics-constants';

@Injectable()
export abstract class BaseReportGeneratorService {
  protected readonly logger: Logger;
  protected readonly reportsDir: string;

  constructor(
    protected readonly eventEmitter: EventEmitter2,
    @Inject(CACHE_MANAGER)
    protected readonly cacheManager: Cache,
    serviceName: string,
  ) {
    this.logger = new Logger(serviceName);
    this.reportsDir = path.join(process.cwd(), 'reports', 'analytics');

    // Ensure reports directory exists
    if (!fs.existsSync(this.reportsDir)) {
      fs.mkdirSync(this.reportsDir, { recursive: true });
    }
  }

  /**
   * Generate a report with common caching and error handling
   */
  protected async generateReport(
    schoolId: string,
    reportType: AnalyticsReportType,
    period: AnalyticsTimePeriod,
    options: ReportGenerationOptions = {},
    generateContentFn: () => Promise<{ data: any; content: any }>,
  ): Promise<AnalyticsOperationResult<ReportData>> {
    try {
      const reportId = this.generateReportId();
      const cacheKey = ANALYTICS_CACHE_KEYS.REPORT_DATA(reportId);

      // Check cache unless force regenerate
      if (!options.forceRegenerate) {
        const cached = await this.cacheManager.get<ReportData>(cacheKey);
        if (cached) {
          return { success: true, data: cached };
        }
      }

      // Generate report content using provided function
      const { data, content } = await generateContentFn();

      // Format report
      const formattedReport = await this.formatReport(content, options.format || 'JSON');

      const report: ReportData = {
        id: reportId,
        schoolId,
        type: reportType,
        period,
        data,
        content,
        formattedContent,
        metadata: this.generateReportMetadata(reportId, schoolId, reportType, period, options),
        generatedAt: new Date(),
      };

      // Cache the report
      await this.cacheManager.set(cacheKey, report, ANALYTICS_CONSTANTS.CACHE_TTL.REPORT_DATA);

      // Save to file if requested
      if (options.saveToFile) {
        await this.saveReportToFile(report, options.format || 'JSON');
      }

      // Emit event
      this.eventEmitter.emit(ANALYTICS_EVENTS.REPORT_GENERATED, {
        reportId,
        schoolId,
        type: reportType,
        format: options.format || 'JSON',
      });

      return { success: true, data: report };
    } catch (error) {
      this.logger.error(`Failed to generate ${reportType} report for school ${schoolId}`, error);
      return {
        success: false,
        error: `Failed to generate report: ${error.message}`,
      };
    }
  }

  /**
   * Export report in multiple formats
   */
  protected async exportReport(
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

  /**
   * Format report content based on format type
   */
  protected async formatReport(content: any, format: string): Promise<string> {
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

  /**
   * Convert content to CSV format
   */
  private convertToCSV(data: any): string {
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

  /**
   * Convert content to XML format
   */
  private convertToXML(data: any): string {
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

  /**
   * Save report to file system
   */
  protected async saveReportToFile(report: ReportData, format: string): Promise<void> {
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

  /**
   * Generate unique report ID
   */
  protected generateReportId(): string {
    return `report_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Generate report metadata
   */
  protected generateReportMetadata(
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