import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { OutputFormat } from '../constants/report.constants';
import { ExportResult } from '../interfaces/report-types.interface';
import { ExportOptionsDto } from '../dto/export-options.dto';
import * as fs from 'fs/promises';
import * as path from 'path';

/**
 * Report Export Service
 * Orchestrates export operations across different formats
 * Implements strategy pattern for format-specific exports
 */
@Injectable()
export class ReportExportService {
  private readonly logger = new Logger(ReportExportService.name);
  private readonly outputDir = path.join(process.cwd(), 'reports', 'generated');

  constructor() {
    this.ensureOutputDirectory();
  }

  /**
   * Export report data to specified format
   */
  async exportReport(
    data: any,
    options: ExportOptionsDto,
  ): Promise<ExportResult> {
    try {
      const { format, reportType } = options;

      let filePath: string;
      let buffer: Buffer;

      switch (format) {
        case OutputFormat.PDF:
          buffer = await this.exportToPdf(data, options);
          filePath = await this.saveFile(buffer, reportType, 'pdf');
          break;

        case OutputFormat.EXCEL:
          buffer = await this.exportToExcel(data, options);
          filePath = await this.saveFile(buffer, reportType, 'xlsx');
          break;

        case OutputFormat.CSV:
          buffer = await this.exportToCsv(data, options);
          filePath = await this.saveFile(buffer, reportType, 'csv');
          break;

        case OutputFormat.JSON:
          buffer = Buffer.from(JSON.stringify(data, null, 2));
          filePath = await this.saveFile(buffer, reportType, 'json');
          break;

        default:
          throw new BadRequestException(`Unsupported format: ${format}`);
      }

      const fileSize = buffer.length;
      const downloadUrl = `/api/reports/download/${path.basename(filePath)}`;
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

      this.logger.log(
        `Report exported: ${reportType} as ${format}, size: ${fileSize} bytes`,
      );

      return {
        format,
        filePath,
        downloadUrl,
        fileSize,
        generatedAt: new Date(),
        expiresAt,
      };
    } catch (error) {
      this.logger.error('Error exporting report:', error);
      throw error;
    }
  }

  /**
   * Export to PDF format
   */
  private async exportToPdf(
    data: any,
    options: ExportOptionsDto,
  ): Promise<Buffer> {
    // PDF generation using pdfkit would go here
    // For now, returning a placeholder
    this.logger.warn('PDF export not fully implemented - returning JSON as fallback');
    return Buffer.from(JSON.stringify(data, null, 2));
  }

  /**
   * Export to Excel format
   */
  private async exportToExcel(
    data: any,
    options: ExportOptionsDto,
  ): Promise<Buffer> {
    // Excel generation using xlsx would go here
    // Basic implementation for demonstration
    try {
      const XLSX = require('xlsx');

      // Convert data to worksheet format
      const worksheet = XLSX.utils.json_to_sheet(this.flattenData(data));
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, options.reportType);

      // Generate buffer
      const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
      return buffer;
    } catch (error) {
      this.logger.warn('Excel library not available - returning JSON as fallback');
      return Buffer.from(JSON.stringify(data, null, 2));
    }
  }

  /**
   * Export to CSV format
   */
  private async exportToCsv(
    data: any,
    options: ExportOptionsDto,
  ): Promise<Buffer> {
    try {
      const flatData = this.flattenData(data);

      if (flatData.length === 0) {
        return Buffer.from('No data available\n');
      }

      // Get headers from first object
      const headers = options.columns || Object.keys(flatData[0]);

      // Build CSV
      let csv = headers.join(',') + '\n';

      for (const row of flatData) {
        const values = headers.map(header => {
          const value = row[header];
          // Escape values containing commas or quotes
          if (value === null || value === undefined) return '';
          const stringValue = String(value);
          if (stringValue.includes(',') || stringValue.includes('"')) {
            return `"${stringValue.replace(/"/g, '""')}"`;
          }
          return stringValue;
        });
        csv += values.join(',') + '\n';
      }

      return Buffer.from(csv, 'utf-8');
    } catch (error) {
      this.logger.error('Error generating CSV:', error);
      throw error;
    }
  }

  /**
   * Flatten nested data structures for tabular export
   */
  private flattenData(data: any): any[] {
    if (Array.isArray(data)) {
      return data.map(item => this.flattenObject(item));
    } else if (typeof data === 'object' && data !== null) {
      // If data is an object with array properties, extract the first array
      const arrayProps = Object.keys(data).filter(key => Array.isArray(data[key]));
      if (arrayProps.length > 0) {
        return data[arrayProps[0]].map((item: any) => this.flattenObject(item));
      }
      return [this.flattenObject(data)];
    }
    return [];
  }

  /**
   * Flatten a single object
   */
  private flattenObject(obj: any, prefix = ''): any {
    const flattened: any = {};

    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const value = obj[key];
        const newKey = prefix ? `${prefix}.${key}` : key;

        if (value === null || value === undefined) {
          flattened[newKey] = '';
        } else if (typeof value === 'object' && !Array.isArray(value) && !(value instanceof Date)) {
          // Recursively flatten nested objects
          Object.assign(flattened, this.flattenObject(value, newKey));
        } else if (Array.isArray(value)) {
          // Convert arrays to string representation
          flattened[newKey] = value.join('; ');
        } else if (value instanceof Date) {
          flattened[newKey] = value.toISOString();
        } else {
          flattened[newKey] = value;
        }
      }
    }

    return flattened;
  }

  /**
   * Save file to disk
   */
  private async saveFile(
    buffer: Buffer,
    reportType: string,
    extension: string,
  ): Promise<string> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `${reportType}_${timestamp}.${extension}`;
    const filePath = path.join(this.outputDir, filename);

    await fs.writeFile(filePath, buffer);
    return filePath;
  }

  /**
   * Ensure output directory exists
   */
  private async ensureOutputDirectory() {
    try {
      await fs.mkdir(this.outputDir, { recursive: true });
    } catch (error) {
      this.logger.error('Error creating output directory:', error);
    }
  }

  /**
   * Clean up old report files
   */
  async cleanupOldReports(daysOld: number = 7) {
    try {
      const files = await fs.readdir(this.outputDir);
      const now = Date.now();
      const maxAge = daysOld * 24 * 60 * 60 * 1000;

      for (const file of files) {
        const filePath = path.join(this.outputDir, file);
        const stats = await fs.stat(filePath);

        if (now - stats.mtimeMs > maxAge) {
          await fs.unlink(filePath);
          this.logger.log(`Deleted old report file: ${file}`);
        }
      }
    } catch (error) {
      this.logger.error('Error cleaning up old reports:', error);
    }
  }
}
