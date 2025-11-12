/**
 * @fileoverview Health Records Export and Import Service
 * @module services/modules/health/healthRecordsExport
 * @category Services
 *
 * Health Records Export and Import Operations
 *
 * Purpose:
 * Provides comprehensive export and import capabilities for health records supporting
 * multiple formats for various use cases including parent sharing, provider referrals,
 * EMR interoperability, and data analysis.
 *
 * Export Formats:
 * - **PDF**: Human-readable format for printing, parent sharing, provider referrals
 * - **JSON**: Structured data for system-to-system integration, data analysis
 * - **CSV**: Spreadsheet-compatible format for data analysis, reporting
 * - **CCD**: Continuity of Care Document (HL7 standard) for EMR interoperability
 *
 * Import Formats:
 * - **JSON**: Import from other systems or backups
 * - **CSV**: Bulk import from spreadsheets or legacy systems
 * - **CCD**: Import from EMR systems (HL7 standard)
 *
 * Features:
 * - Multi-format export with customizable data inclusion
 * - Date range filtering for historical or recent data
 * - Selective module inclusion (allergies, vaccinations, vitals, etc.)
 * - Confidential record handling with authorization
 * - Comprehensive health summary inclusion
 * - Streaming export for large datasets
 * - Import validation and error reporting
 *
 * Healthcare Applications:
 * - Parent communication and sharing
 * - Provider referrals with complete history
 * - EMR system transfers and integration
 * - Legal documentation and records requests
 * - Backup and archival
 * - Data analysis and research
 *
 * HIPAA Compliance:
 * - All exports logged as PHI access
 * - Authorization checks for confidential data
 * - Encryption required for transmission
 * - Patient consent verification for external sharing
 * - Complete audit trail maintained
 *
 * @example
 * ```typescript
 * import { createHealthRecordsExportService } from '@/services/modules/health';
 * import { apiClient } from '@/services/core/ApiClient';
 *
 * const exportService = createHealthRecordsExportService(apiClient);
 *
 * // Export comprehensive PDF for parent
 * const pdfBlob = await exportService.exportRecords({
 *   studentId: 'student-uuid',
 *   format: 'PDF',
 *   includeSummary: true,
 *   includeAllergies: true,
 *   includeVaccinations: true
 * });
 *
 * // Download PDF
 * const url = window.URL.createObjectURL(pdfBlob);
 * const link = document.createElement('a');
 * link.href = url;
 * link.download = 'health-records.pdf';
 * link.click();
 * ```
 */

import { API_ENDPOINTS } from '@/constants/api';
import type { ApiClient } from '@/services/core/ApiClient';
import type { ApiResponse } from '@/services/types';
import type { ExportOptions, ImportResult } from './healthRecordsTypes';
import { createHealthRecordsPHILogger } from './healthRecordsPHI';

/**
 * Health Records Export Service
 *
 * @class
 * @description
 * Service for exporting and importing health records in multiple formats (PDF, JSON, CSV, CCD).
 * Supports parent sharing, provider referrals, EMR transfers, and data analysis workflows.
 * All operations logged for HIPAA compliance.
 */
export class HealthRecordsExportService {
  private phiLogger: ReturnType<typeof createHealthRecordsPHILogger>;

  constructor(private client: ApiClient) {
    this.phiLogger = createHealthRecordsPHILogger(client);
  }

  /**
   * Export comprehensive health records in multiple formats
   * Supports PDF, JSON, CSV, and CCD formats with selective data inclusion.
   * Logs PHI access for HIPAA compliance.
   */
  async exportRecords(options: ExportOptions): Promise<Blob> {
    this.validateId(options.studentId);

    const response = await this.client.post(
      `${API_ENDPOINTS.HEALTH_RECORDS.BASE}/export`,
      options,
      { responseType: 'blob' }
    );

    await this.phiLogger.logPHIAccess('EXPORT_HEALTH_RECORDS', options.studentId);
    return response.data as Blob;
  }

  /**
   * Import health records from external sources
   * Supports JSON, CSV, and CCD formats with validation and error reporting.
   * Logs PHI access for HIPAA compliance.
   */
  async importRecords(
    studentId: string,
    file: File,
    format: 'JSON' | 'CSV' | 'CCD'
  ): Promise<ImportResult> {
    this.validateId(studentId);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('studentId', studentId);
    formData.append('format', format);

    const response = await this.client.post<ApiResponse<ImportResult>>(
      `${API_ENDPOINTS.HEALTH_RECORDS.BASE}/import`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );

    await this.phiLogger.logPHIAccess('IMPORT_HEALTH_RECORDS', studentId);
    return this.extractData(response);
  }

  /**
   * Validate UUID format
   * @private
   */
  private validateId(id: string): void {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      throw new Error(`Invalid UUID format: ${id}`);
    }
  }

  /**
   * Extract data from API response
   * @private
   */
  private extractData<T>(response: ApiResponse<T>): T {
    if (response.data) {
      return response.data;
    }
    throw new Error('Invalid API response: missing data');
  }
}

/**
 * Factory function to create export service instance
 *
 * @param {ApiClient} client - API client instance
 * @returns {HealthRecordsExportService} Configured export service
 *
 * @example
 * ```typescript
 * import { createHealthRecordsExportService } from '@/services/modules/health';
 * import { apiClient } from '@/services/core/ApiClient';
 *
 * const exportService = createHealthRecordsExportService(apiClient);
 * ```
 */
export function createHealthRecordsExportService(
  client: ApiClient
): HealthRecordsExportService {
  return new HealthRecordsExportService(client);
}
