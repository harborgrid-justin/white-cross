/**
 * Export Service - Main Entry Point
 *
 * Coordinates export operations with sanitization, compression,
 * and format conversion for healthcare data.
 */

import type {
  ExportConfig,
  ExportResult,
  ExportProgress,
  ExportError,
  SanitizationConfig,
} from '../../types';

// ============================================================================
// Export Service
// ============================================================================

export class ExportService {
  private exportId: string;
  private config: ExportConfig;
  private progressCallback?: (progress: ExportProgress) => void;

  constructor(
    config: ExportConfig,
    progressCallback?: (progress: ExportProgress) => void
  ) {
    this.exportId = crypto.randomUUID();
    this.config = config;
    this.progressCallback = progressCallback;
  }

  /**
   * Main export method
   */
  async export(data: Array<Record<string, unknown>>): Promise<ExportResult> {
    const startTime = Date.now();
    const result: ExportResult = {
      exportId: this.exportId,
      status: 'processing',
      entityType: this.config.entityType,
      startedAt: new Date(),
      totalRecords: data.length,
      exportedRecords: 0,
      errors: [],
    };

    try {
      // Report initial progress
      this.reportProgress({
        exportId: this.exportId,
        status: 'processing',
        currentRecord: 0,
        totalRecords: data.length,
        percentage: 0,
      });

      // Apply sanitization if enabled
      let processedData = data;
      if (this.config.options.sanitize) {
        processedData = await this.sanitizeData(data);
      }

      // Select fields
      const selectedData = this.selectFields(processedData);

      // Generate file based on format
      const fileBlob = await this.generateFile(selectedData);

      // Compress if enabled
      let finalBlob = fileBlob;
      if (this.config.options.compress) {
        finalBlob = await this.compressFile(fileBlob);
      }

      // Create file URL
      const fileUrl = URL.createObjectURL(finalBlob);
      const fileName = this.generateFileName();

      result.status = 'completed';
      result.completedAt = new Date();
      result.exportedRecords = selectedData.length;
      result.fileSize = finalBlob.size;
      result.fileUrl = fileUrl;
      result.fileName = fileName;

      // Report final progress
      this.reportProgress({
        exportId: this.exportId,
        status: 'completed',
        currentRecord: data.length,
        totalRecords: data.length,
        percentage: 100,
      });

      // Send email if configured
      if (this.config.options.emailTo && this.config.options.emailTo.length > 0) {
        await this.sendEmail(fileUrl, fileName);
      }

      return result;
    } catch (error) {
      result.status = 'failed';
      result.completedAt = new Date();

      result.errors.push({
        code: 'EXPORT_FAILED',
        message: error instanceof Error ? error.message : 'Unknown error',
        severity: 'critical',
      });

      return result;
    }
  }

  /**
   * Sanitizes data by removing or masking PHI
   */
  private async sanitizeData(
    data: Array<Record<string, unknown>>
  ): Promise<Array<Record<string, unknown>>> {
    const sanitizationConfig: SanitizationConfig = {
      removePHI: true,
      maskSSN: true,
      maskDOB: true,
      removeNotes: false,
      removeDiagnosticCodes: false,
    };

    return data.map((record) => {
      const sanitized = { ...record };

      // Mask SSN
      if (sanitizationConfig.maskSSN && sanitized.ssn) {
        sanitized.ssn = this.maskSSN(String(sanitized.ssn));
      }

      // Mask DOB
      if (sanitizationConfig.maskDOB && sanitized.dateOfBirth) {
        sanitized.dateOfBirth = this.maskDOB(String(sanitized.dateOfBirth));
      }

      // Remove sensitive fields
      if (sanitizationConfig.removePHI) {
        delete sanitized.medicalRecordNumber;
        delete sanitized.insuranceNumber;
      }

      if (sanitizationConfig.removeNotes) {
        delete sanitized.notes;
        delete sanitized.comments;
      }

      if (sanitizationConfig.removeDiagnosticCodes) {
        delete sanitized.diagnosisCode;
        delete sanitized.icd10Code;
      }

      return sanitized;
    });
  }

  /**
   * Masks SSN (XXX-XX-1234 -> ***-**-1234)
   */
  private maskSSN(ssn: string): string {
    if (ssn.length >= 4) {
      return '***-**-' + ssn.slice(-4);
    }
    return '***-**-****';
  }

  /**
   * Masks DOB (keeps only year)
   */
  private maskDOB(dob: string): string {
    const date = new Date(dob);
    if (!isNaN(date.getTime())) {
      return date.getFullYear().toString();
    }
    return '****';
  }

  /**
   * Selects specified fields from data
   */
  private selectFields(
    data: Array<Record<string, unknown>>
  ): Array<Record<string, unknown>> {
    return data.map((record) => {
      const selected: Record<string, unknown> = {};

      for (const fieldConfig of this.config.fields.fields) {
        const value = record[fieldConfig.field];

        // Apply transformation if specified
        const transformedValue = fieldConfig.transform
          ? this.applyTransform(value, fieldConfig.transform)
          : value;

        const label = fieldConfig.label || fieldConfig.field;
        selected[label] = transformedValue;
      }

      return selected;
    });
  }

  /**
   * Applies field transformation (reuse from import)
   */
  private applyTransform(value: unknown, transform: unknown): unknown {
    // TODO: Implement transformation logic (same as import)
    return value;
  }

  /**
   * Generates file based on format
   */
  private async generateFile(data: Array<Record<string, unknown>>): Promise<Blob> {
    const { format } = this.config;

    switch (format.type) {
      case 'csv':
        return this.generateCSV(data, format.delimiter, format.includeHeader);

      case 'excel':
        return this.generateExcel(data, format.sheetName);

      case 'json':
        return this.generateJSON(data, format.pretty);

      case 'pdf':
        return this.generatePDF(data, format.orientation);

      default:
        throw new Error(`Unsupported format: ${(format as { type: string }).type}`);
    }
  }

  /**
   * Generates CSV file
   */
  private generateCSV(
    data: Array<Record<string, unknown>>,
    delimiter: string,
    includeHeader: boolean
  ): Blob {
    const lines: string[] = [];

    if (data.length === 0) {
      return new Blob([''], { type: 'text/csv' });
    }

    // Get headers from first record
    const headers = Object.keys(data[0]);

    // Add header row
    if (includeHeader) {
      lines.push(headers.map((h) => this.escapeCSVField(h)).join(delimiter));
    }

    // Add data rows
    for (const record of data) {
      const values = headers.map((header) => {
        const value = record[header];
        return this.escapeCSVField(String(value ?? ''));
      });
      lines.push(values.join(delimiter));
    }

    const csvContent = lines.join('\n');
    return new Blob([csvContent], { type: 'text/csv' });
  }

  /**
   * Escapes CSV field (handles quotes and delimiters)
   */
  private escapeCSVField(field: string): string {
    // If field contains delimiter, newline, or quotes, wrap in quotes
    if (field.includes(',') || field.includes('\n') || field.includes('"')) {
      // Escape quotes by doubling them
      const escaped = field.replace(/"/g, '""');
      return `"${escaped}"`;
    }
    return field;
  }

  /**
   * Generates Excel file
   */
  private async generateExcel(
    data: Array<Record<string, unknown>>,
    sheetName: string
  ): Promise<Blob> {
    // TODO: Implement Excel generation using a library like exceljs
    throw new Error('Excel export not yet implemented');
  }

  /**
   * Generates JSON file
   */
  private generateJSON(data: Array<Record<string, unknown>>, pretty: boolean): Blob {
    const jsonContent = pretty ? JSON.stringify(data, null, 2) : JSON.stringify(data);
    return new Blob([jsonContent], { type: 'application/json' });
  }

  /**
   * Generates PDF file
   */
  private async generatePDF(
    data: Array<Record<string, unknown>>,
    orientation: 'portrait' | 'landscape'
  ): Promise<Blob> {
    // TODO: Implement PDF generation using a library like pdfmake or jspdf
    throw new Error('PDF export not yet implemented');
  }

  /**
   * Compresses file using ZIP
   */
  private async compressFile(blob: Blob): Promise<Blob> {
    // TODO: Implement compression using a library like jszip
    // For now, return original blob
    return blob;
  }

  /**
   * Generates filename based on configuration
   */
  private generateFileName(): string {
    const { entityType, format } = this.config;
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    const extension = this.getFileExtension(format.type);

    let fileName = `${entityType}-export-${timestamp}${extension}`;

    if (this.config.options.compress) {
      fileName += '.zip';
    }

    return fileName;
  }

  /**
   * Gets file extension for format
   */
  private getFileExtension(format: string): string {
    const extensions: Record<string, string> = {
      csv: '.csv',
      excel: '.xlsx',
      json: '.json',
      pdf: '.pdf',
    };

    return extensions[format] || '.dat';
  }

  /**
   * Sends export file via email
   */
  private async sendEmail(fileUrl: string, fileName: string): Promise<void> {
    // TODO: Implement email sending
    console.log(`Sending export to: ${this.config.options.emailTo?.join(', ')}`);
  }

  /**
   * Reports progress to callback
   */
  private reportProgress(progress: ExportProgress): void {
    if (this.progressCallback) {
      this.progressCallback(progress);
    }
  }
}

// ============================================================================
// Scheduled Export Service
// ============================================================================

export class ScheduledExportService {
  private schedules: Map<string, NodeJS.Timeout> = new Map();

  /**
   * Schedules a recurring export
   */
  scheduleExport(
    id: string,
    config: ExportConfig,
    getData: () => Promise<Array<Record<string, unknown>>>
  ): void {
    const schedule = config.options.schedule;

    if (!schedule || !schedule.enabled) {
      return;
    }

    // Cancel existing schedule
    this.cancelExport(id);

    // Calculate next run time
    const nextRun = this.calculateNextRun(schedule);
    const delay = nextRun.getTime() - Date.now();

    // Schedule export
    const timeout = setTimeout(async () => {
      try {
        const data = await getData();
        const exportService = new ExportService(config);
        await exportService.export(data);
      } catch (error) {
        console.error('Scheduled export failed:', error);
      }

      // Reschedule if recurring
      if (schedule.frequency !== 'once') {
        this.scheduleExport(id, config, getData);
      }
    }, delay);

    this.schedules.set(id, timeout);
  }

  /**
   * Cancels a scheduled export
   */
  cancelExport(id: string): void {
    const timeout = this.schedules.get(id);
    if (timeout) {
      clearTimeout(timeout);
      this.schedules.delete(id);
    }
  }

  /**
   * Calculates next run time based on schedule
   */
  private calculateNextRun(schedule: NonNullable<ExportConfig['options']['schedule']>): Date {
    const now = new Date();
    const nextRun = new Date(now);

    switch (schedule.frequency) {
      case 'once':
        return nextRun;

      case 'daily':
        if (schedule.time) {
          const [hours, minutes] = schedule.time.split(':').map(Number);
          nextRun.setHours(hours, minutes, 0, 0);

          // If time has passed today, schedule for tomorrow
          if (nextRun <= now) {
            nextRun.setDate(nextRun.getDate() + 1);
          }
        }
        break;

      case 'weekly':
        if (schedule.dayOfWeek !== undefined && schedule.time) {
          const [hours, minutes] = schedule.time.split(':').map(Number);
          const currentDay = nextRun.getDay();
          const targetDay = schedule.dayOfWeek;
          const daysUntilTarget = (targetDay - currentDay + 7) % 7 || 7;

          nextRun.setDate(nextRun.getDate() + daysUntilTarget);
          nextRun.setHours(hours, minutes, 0, 0);

          // If time has passed today and it's the target day, schedule for next week
          if (daysUntilTarget === 0 && nextRun <= now) {
            nextRun.setDate(nextRun.getDate() + 7);
          }
        }
        break;

      case 'monthly':
        if (schedule.dayOfMonth !== undefined && schedule.time) {
          const [hours, minutes] = schedule.time.split(':').map(Number);
          nextRun.setDate(schedule.dayOfMonth);
          nextRun.setHours(hours, minutes, 0, 0);

          // If date has passed this month, schedule for next month
          if (nextRun <= now) {
            nextRun.setMonth(nextRun.getMonth() + 1);
          }
        }
        break;
    }

    return nextRun;
  }
}
