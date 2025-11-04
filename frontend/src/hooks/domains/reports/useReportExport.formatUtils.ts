/**
 * Format utility functions for report exports
 *
 * Handles MIME types and file extensions for different export formats.
 *
 * @module hooks/domains/reports/useReportExport.formatUtils
 */

'use client';

import type { ExportFormat } from '@/types/schemas/reports.schema';

/**
 * Gets the appropriate MIME type for the export format
 *
 * @param format - The export format
 * @returns The corresponding MIME type
 *
 * @example
 * ```ts
 * getMimeType('pdf') // 'application/pdf'
 * getMimeType('excel') // 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
 * ```
 */
export function getMimeType(format: ExportFormat): string {
  const mimeTypes: Record<ExportFormat, string> = {
    pdf: 'application/pdf',
    excel: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    csv: 'text/csv',
    json: 'application/json'
  };
  return mimeTypes[format];
}

/**
 * Gets the file extension for the export format
 *
 * @param format - The export format
 * @returns The corresponding file extension (without dot)
 *
 * @example
 * ```ts
 * getFileExtension('pdf') // 'pdf'
 * getFileExtension('excel') // 'xlsx'
 * ```
 */
export function getFileExtension(format: ExportFormat): string {
  const extensions: Record<ExportFormat, string> = {
    pdf: 'pdf',
    excel: 'xlsx',
    csv: 'csv',
    json: 'json'
  };
  return extensions[format];
}
