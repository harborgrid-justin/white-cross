/**
 * @fileoverview Report Formatter Service
 * @module analytics/services
 * @description Service for formatting reports in different output formats
 */

import { Injectable, Logger } from '@nestjs/common';

import { BaseService } from '@/common/base';
@Injectable()
export class ReportFormatterService extends BaseService {
  constructor() {
    super("ReportFormatterService");
  }

  /**
   * Format report content based on requested format
   */
  async formatReport(content: any, format: 'JSON' | 'CSV' | 'PDF' | 'XLSX'): Promise<string> {
    try {
      switch (format.toUpperCase()) {
        case 'JSON':
          return this.formatAsJSON(content);

        case 'CSV':
          return this.formatAsCSV(content);

        case 'PDF':
          return this.formatAsPDF(content);

        case 'XLSX':
          return this.formatAsXLSX(content);

        default:
          return this.formatAsJSON(content);
      }
    } catch (error) {
      this.logError(`Failed to format report as ${format}`, error);
      // Fallback to JSON
      return this.formatAsJSON(content);
    }
  }

  /**
   * Format content as JSON
   */
  private formatAsJSON(content: any): string {
    return JSON.stringify(content, null, 2);
  }

  /**
   * Format content as CSV
   */
  private formatAsCSV(content: any): string {
    const rows: string[] = [];

    // Simple CSV conversion - in a real implementation, this would be more sophisticated
    const flattenObject = (obj: any, prefix = ''): string[] => {
      const result: string[] = [];
      for (const [key, value] of Object.entries(obj)) {
        const newKey = prefix ? `${prefix}.${key}` : key;
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
          result.push(...flattenObject(value, newKey));
        } else if (Array.isArray(value)) {
          // Handle arrays by creating multiple rows
          value.forEach((item, index) => {
            if (typeof item === 'object' && item !== null) {
              result.push(...flattenObject(item, `${newKey}[${index}]`));
            } else {
              result.push(`${newKey}[${index}],${item}`);
            }
          });
        } else {
          result.push(`${newKey},${value}`);
        }
      }
      return result;
    };

    rows.push(...flattenObject(content));
    return rows.join('\n');
  }

  /**
   * Format content as PDF using pdfkit
   */
  private formatAsPDF(content: any): string {
    try {
      // Import PDFKit dynamically
      const PDFDocument = require('pdfkit');
      const chunks: Buffer[] = [];

      // Create PDF document
      const doc = new PDFDocument({
        size: 'LETTER',
        margins: { top: 50, bottom: 50, left: 50, right: 50 },
        info: {
          Title: content.title || 'Health Report',
          Author: 'White Cross Health Platform',
          Subject: 'Healthcare Analytics Report',
          Keywords: 'health, analytics, report',
          CreationDate: new Date(),
        },
      });

      // Collect PDF data
      doc.on('data', (chunk: Buffer) => chunks.push(chunk));

      // Add HIPAA compliance watermark/header
      doc.fontSize(8)
        .fillColor('#999999')
        .text('CONFIDENTIAL - HIPAA Protected Health Information', 50, 20, {
          align: 'center',
        });

      // Add title
      doc.fontSize(20)
        .fillColor('#000000')
        .text(content.title || 'Analytics Report', 50, 60);

      // Add metadata
      doc.fontSize(10)
        .fillColor('#666666')
        .text(`Generated: ${new Date().toLocaleString()}`, 50, 95)
        .text(`Report Period: ${content.period || 'N/A'}`, 50, 110);

      // Add divider
      doc.moveTo(50, 130).lineTo(562, 130).stroke();

      let yPosition = 150;

      // Format content based on type
      if (content.metrics || content.data) {
        const dataToFormat = content.metrics || content.data;

        if (Array.isArray(dataToFormat)) {
          // Table format for arrays
          dataToFormat.forEach((item, index) => {
            if (yPosition > 700) {
              doc.addPage();
              yPosition = 50;
            }

            doc.fontSize(12).fillColor('#000000');
            doc.text(`${index + 1}. ${this.formatObjectForPDF(item)}`, 50, yPosition);
            yPosition += 25;
          });
        } else if (typeof dataToFormat === 'object') {
          // Key-value format for objects
          Object.entries(dataToFormat).forEach(([key, value]) => {
            if (yPosition > 700) {
              doc.addPage();
              yPosition = 50;
            }

            doc.fontSize(11).fillColor('#333333');
            const formattedKey = key.replace(/([A-Z])/g, ' $1').trim();
            const formattedValue = this.formatValueForPDF(value);

            doc.text(`${formattedKey}:`, 50, yPosition, { continued: true });
            doc.fillColor('#000000').text(` ${formattedValue}`);
            yPosition += 20;
          });
        }
      }

      // Add footer
      const pageCount = doc.bufferedPageRange().count;
      for (let i = 0; i < pageCount; i++) {
        doc.switchToPage(i);
        doc.fontSize(8)
          .fillColor('#999999')
          .text(
            `Page ${i + 1} of ${pageCount} | White Cross Health Platform`,
            50,
            750,
            { align: 'center' }
          );
      }

      // Finalize PDF
      doc.end();

      // Wait for PDF to be generated and return as base64
      return new Promise<string>((resolve) => {
        doc.on('end', () => {
          const pdfBuffer = Buffer.concat(chunks);
          resolve(pdfBuffer.toString('base64'));
        });
      });
    } catch (error) {
      this.logError('Error generating PDF', error);
      // Fallback to JSON if PDF generation fails
      return JSON.stringify(content, null, 2);
    }
  }

  /**
   * Format object for PDF display
   */
  private formatObjectForPDF(obj: any): string {
    if (typeof obj === 'object' && obj !== null) {
      return Object.entries(obj)
        .map(([k, v]) => `${k}: ${this.formatValueForPDF(v)}`)
        .join(', ');
    }
    return String(obj);
  }

  /**
   * Format value for PDF display
   */
  private formatValueForPDF(value: any): string {
    if (value === null || value === undefined) return 'N/A';
    if (typeof value === 'number') return this.formatNumber(value);
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';
    if (value instanceof Date) return value.toLocaleDateString();
    if (Array.isArray(value)) return value.join(', ');
    if (typeof value === 'object') return JSON.stringify(value);
    return String(value);
  }

  /**
   * Format content as XLSX using xlsx library
   */
  private formatAsXLSX(content: any): string {
    try {
      const XLSX = require('xlsx');

      // Create workbook
      const workbook = XLSX.utils.book_new();

      // Convert content to worksheet format
      let worksheetData: any[] = [];

      if (content.data && Array.isArray(content.data)) {
        worksheetData = content.data;
      } else if (content.metrics) {
        worksheetData = Array.isArray(content.metrics)
          ? content.metrics
          : [content.metrics];
      } else if (typeof content === 'object') {
        worksheetData = [content];
      }

      // Create worksheet
      const worksheet = XLSX.utils.json_to_sheet(worksheetData);

      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Report Data');

      // Add metadata sheet
      const metadata = [
        { Property: 'Title', Value: content.title || 'Analytics Report' },
        { Property: 'Generated', Value: new Date().toISOString() },
        { Property: 'Period', Value: content.period || 'N/A' },
        { Property: 'Source', Value: 'White Cross Health Platform' },
      ];
      const metadataSheet = XLSX.utils.json_to_sheet(metadata);
      XLSX.utils.book_append_sheet(workbook, metadataSheet, 'Metadata');

      // Generate XLSX file as base64
      const xlsxBuffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
      return xlsxBuffer.toString('base64');
    } catch (error) {
      this.logError('Error generating XLSX', error);
      // Fallback to JSON if XLSX generation fails
      return JSON.stringify(content, null, 2);
    }
  }

  /**
   * Generate CSV from tabular data
   */
  generateCSVFromTable(data: any[], headers?: string[]): string {
    if (!data || data.length === 0) {
      return '';
    }

    const csvRows: string[] = [];

    // Add headers if provided
    if (headers && headers.length > 0) {
      csvRows.push(headers.join(','));
    } else if (data.length > 0) {
      // Use object keys as headers
      const firstRow = data[0];
      if (typeof firstRow === 'object' && firstRow !== null) {
        csvRows.push(Object.keys(firstRow).join(','));
      }
    }

    // Add data rows
    data.forEach(row => {
      if (typeof row === 'object' && row !== null) {
        const values = Object.values(row).map(value => {
          // Escape commas and quotes in CSV
          const stringValue = String(value || '');
          if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
            return `"${stringValue.replace(/"/g, '""')}"`;
          }
          return stringValue;
        });
        csvRows.push(values.join(','));
      }
    });

    return csvRows.join('\n');
  }

  /**
   * Format numeric values for display
   */
  formatNumber(value: number, decimals: number = 2): string {
    return value.toFixed(decimals);
  }

  /**
   * Format percentage values
   */
  formatPercentage(value: number, decimals: number = 1): string {
    return `${(value).toFixed(decimals)}%`;
  }

  /**
   * Format currency values
   */
  formatCurrency(value: number, currency: string = 'USD'): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(value);
  }

  /**
   * Format date values
   */
  formatDate(date: Date | string, format: 'short' | 'long' | 'iso' = 'iso'): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;

    switch (format) {
      case 'short':
        return dateObj.toLocaleDateString();
      case 'long':
        return dateObj.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });
      case 'iso':
      default:
        return dateObj.toISOString().split('T')[0];
    }
  }

  /**
   * Format duration in human-readable format
   */
  formatDuration(milliseconds: number): string {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `${days}d ${hours % 24}h`;
    } else if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    } else {
      return `${seconds}s`;
    }
  }
}
