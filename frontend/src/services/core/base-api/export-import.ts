/**
 * WF-EXPORT-265 | export-import.ts - BaseApiService Export/Import Operations
 *
 * @module services/core/base-api/export-import
 * @description
 * Export and import functionality for entity data interchange.
 * Supports multiple formats (CSV, JSON, PDF) and file upload.
 *
 * @purpose
 * - Export entities to CSV, JSON, or PDF formats
 * - Import entities from uploaded files
 * - Support filtered exports with query parameters
 * - Provide import error reporting
 *
 * @upstream ./types, ./utils, ../ApiClient
 * @dependencies FilterParams, ApiClient, buildQueryParams, extractData
 * @downstream BaseApiService
 * @exports ExportImportMixin class
 *
 * @keyFeatures
 * - Multi-format export (CSV, JSON, PDF)
 * - Filtered data exports
 * - File-based imports with error tracking
 * - Blob response handling for downloads
 *
 * @lastUpdated 2025-11-04
 * @fileType TypeScript Operations Module
 * @architecture Core export/import layer for service architecture
 */

import type { ApiClient } from '../ApiClient';
import type { FilterParams } from './types';
import { buildQueryParams, extractData } from './utils';

// ==========================================
// EXPORT/IMPORT OPERATIONS MIXIN
// ==========================================

/**
 * Export/Import operations mixin for data interchange
 *
 * @description
 * Implements export and import functionality for entity data.
 * Supports multiple export formats and file-based imports with error reporting.
 */
export class ExportImportMixin {
  constructor(
    protected client: ApiClient,
    protected baseEndpoint: string
  ) {}

  // ==========================================
  // EXPORT OPERATIONS
  // ==========================================

  /**
   * Export entities to specified format
   *
   * @param {'csv' | 'json' | 'pdf'} [format='json'] - The export format
   * @param {FilterParams} [filters] - Optional filters to apply to exported data
   * @returns {Promise<Blob>} Binary data blob for download
   * @throws {Error} When export request fails
   *
   * @description
   * Exports entities in the specified format (CSV, JSON, or PDF).
   * Supports filtering to export subsets of data based on query parameters.
   * Returns a Blob that can be used to trigger browser downloads.
   *
   * @example
   * ```typescript
   * // Export all entities as JSON
   * const jsonBlob = await exportImport.export('json');
   * const url = URL.createObjectURL(jsonBlob);
   * window.open(url);
   *
   * // Export filtered entities as CSV
   * const csvBlob = await exportImport.export('csv', {
   *   grade: 5,
   *   active: true
   * });
   *
   * // Export as PDF with pagination
   * const pdfBlob = await exportImport.export('pdf', {
   *   page: 1,
   *   limit: 100
   * });
   * ```
   */
  public async export(
    format: 'csv' | 'json' | 'pdf' = 'json',
    filters?: FilterParams
  ): Promise<Blob> {
    const params = buildQueryParams({ ...filters, format });
    const response = await this.client.getAxiosInstance().get(
      `${this.baseEndpoint}/export${params}`,
      { responseType: 'blob' }
    );
    return response.data;
  }

  // ==========================================
  // IMPORT OPERATIONS
  // ==========================================

  /**
   * Import entities from file
   *
   * @param {File} file - The file to import (CSV, JSON, etc.)
   * @returns {Promise<{ imported: number; errors: unknown[] }>} Import results with count and errors
   * @throws {Error} When import request fails
   *
   * @description
   * Imports entities from an uploaded file. The server processes the file,
   * validates entities, and returns the number of successfully imported entities
   * along with any errors encountered during import.
   *
   * Errors are reported per entity to help identify and fix invalid data.
   *
   * @example
   * ```typescript
   * // Import from file input
   * const fileInput = document.querySelector('input[type="file"]');
   * const file = fileInput.files[0];
   *
   * const result = await exportImport.import(file);
   *
   * console.log(`Imported ${result.imported} entities`);
   * if (result.errors.length > 0) {
   *   console.error('Import errors:', result.errors);
   * }
   *
   * // Example result:
   * // {
   * //   imported: 47,
   * //   errors: [
   * //     { row: 12, message: "Invalid email format" },
   * //     { row: 23, message: "Missing required field: name" }
   * //   ]
   * // }
   * ```
   */
  public async import(file: File): Promise<{ imported: number; errors: unknown[] }> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await this.client.post<{ imported: number; errors: unknown[] }>(
      `${this.baseEndpoint}/import`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      } as never
    );

    return extractData(response);
  }
}
