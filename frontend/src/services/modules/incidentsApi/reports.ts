/**
 * Incidents API - Reports and Document Generation
 * 
 * Document generation, export functionality, and reporting
 * 
 * @module services/modules/incidentsApi/reports
 */

import type { ApiClient } from '../../core/ApiClient';
import { handleApiError, buildUrlParams } from '../../utils/apiUtils';
import type {
  IncidentReportFilters,
  IncidentReportDocument
} from './types';

/**
 * Reports and document generation operations
 */
export class Reports {
  constructor(private readonly client: ApiClient) {}

  /**
   * Generate official incident report document
   *
   * Creates structured document for legal/insurance purposes
   * Includes all incident details, witness statements, and follow-ups
   *
   * @param id - Incident report ID
   * @returns Structured document data
   *
   * Backend: GET /incidents/{id}/document
   */
  async generateDocument(id: string): Promise<{ document: IncidentReportDocument }> {
    try {
      const response = await this.client.get(`/incidents/${id}/document`);
      return response.data as { document: IncidentReportDocument };
    } catch (error) {
      throw handleApiError(error as Error);
    }
  }

  /**
   * Generate printable report (PDF/document)
   *
   * Returns blob for download
   * Formatted for printing and official records
   *
   * @param id - Incident report ID
   * @returns PDF blob for download
   *
   * @example
   * ```typescript
   * const blob = await reports.generatePDF(id);
   * const url = URL.createObjectURL(blob);
   * const link = document.createElement('a');
   * link.href = url;
   * link.download = `incident-${id}.pdf`;
   * link.click();
   * ```
   *
   * Backend: GET /incidents/{id}/generate
   */
  async generatePDF(id: string): Promise<Blob> {
    try {
      const response = await this.client.get(`/incidents/${id}/generate`, { responseType: 'blob' });
      return response.data as Blob;
    } catch (error) {
      throw handleApiError(error as Error);
    }
  }

  /**
   * Export multiple reports with filters
   *
   * Returns blob (CSV/Excel) for bulk export
   * Useful for analytics and reporting
   *
   * @param params - Optional filters for export
   * @returns CSV/Excel blob for download
   *
   * @example
   * ```typescript
   * const blob = await reports.export({
   *   dateFrom: '2025-01-01',
   *   dateTo: '2025-01-31',
   *   severity: IncidentSeverity.HIGH
   * });
   * ```
   *
   * Backend: GET /incidents/export
   */
  async export(params?: IncidentReportFilters): Promise<Blob> {
    try {
      const queryParams = params ? `?${buildUrlParams(params as Record<string, unknown>)}` : '';
      const response = await this.client.get(`/incidents/export${queryParams}`, { responseType: 'blob' });
      return response.data as Blob;
    } catch (error) {
      throw handleApiError(error as Error);
    }
  }
}
