/**
 * @fileoverview Report Formatter Service
 * @module analytics/services
 * @description Service for formatting reports in different output formats
 */

import { Injectable, Logger } from '@nestjs/common';

import { BaseService } from '../../../common/base';
@Injectable()
export class ReportFormatterService extends BaseService {
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
   * Format content as PDF (placeholder)
   */
  private formatAsPDF(content: any): string {
    // In a real implementation, this would use a PDF library like pdfkit or puppeteer
    // For now, return JSON with PDF metadata
    const pdfContent = {
      ...content,
      _format: 'PDF',
      _note: 'PDF generation would be implemented with a proper PDF library',
      _generatedAt: new Date().toISOString(),
    };
    return JSON.stringify(pdfContent, null, 2);
  }

  /**
   * Format content as XLSX (placeholder)
   */
  private formatAsXLSX(content: any): string {
    // In a real implementation, this would use a library like exceljs or xlsx
    // For now, return JSON with XLSX metadata
    const xlsxContent = {
      ...content,
      _format: 'XLSX',
      _note: 'XLSX generation would be implemented with a proper Excel library',
      _generatedAt: new Date().toISOString(),
    };
    return JSON.stringify(xlsxContent, null, 2);
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
