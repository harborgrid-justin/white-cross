/**
 * @fileoverview Audit Export and Archive Operations
 * @module services/modules/audit/exports
 * @category Services - Audit Export
 *
 * Audit log export (CSV, PDF, JSON) and archival operations.
 * Supports long-term audit log retention and regulatory compliance exports.
 *
 * Export Features:
 * - Multiple export formats (CSV, PDF, JSON)
 * - Date range filtering
 * - Custom filter application
 * - Regulatory compliance formatting
 *
 * Archive Features:
 * - Long-term audit log archival
 * - HIPAA-compliant 6-year retention
 * - Archive before specified date
 * - Archive count tracking
 */

import type { ApiClient } from '../../core/ApiClient';
import { ApiResponse } from '../../utils/apiUtils';
import type { AuditFilters } from './types';

/**
 * Audit Export and Archive Service
 * Manages audit log export and archival operations
 */
export class AuditExportService {
  constructor(private readonly client: ApiClient) {}

  /**
   * Export audit logs
   * Exports audit logs in specified format for regulatory compliance or analysis
   *
   * @param params - Export parameters including format, date range, and filters
   * @returns Blob containing exported audit data
   */
  async exportLogs(params?: {
    startDate?: string;
    endDate?: string;
    format?: 'CSV' | 'PDF' | 'JSON';
    filters?: AuditFilters;
  }): Promise<Blob> {
    const response = await this.client.get<Blob>(
      '/audit/export',
      {
        params,
        responseType: 'blob'
      }
    );
    // When responseType is 'blob', the response.data contains the Blob directly
    // However, ApiClient wraps it in ApiResponse, so we need to extract it
    return response.data as unknown as Blob;
  }

  /**
   * Archive old audit logs
   * Archives audit logs before specified date for long-term retention
   * Supports HIPAA-compliant 6-year retention requirement
   *
   * @param params - Archive parameters including cutoff date
   * @returns Archive result with success status and count of archived logs
   */
  async archiveLogs(params: {
    beforeDate: string;
  }): Promise<{ success: boolean; archivedCount: number }> {
    const response = await this.client.post<ApiResponse<{ success: boolean; archivedCount: number }>>(
      '/audit/logs/archive',
      params
    );
    return response.data.data!;
  }
}
