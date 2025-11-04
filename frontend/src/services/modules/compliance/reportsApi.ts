/**
 * @fileoverview Compliance Reports API
 * @module services/modules/compliance/reportsApi
 * @category Services - Compliance Reports
 *
 * Handles compliance report generation, management, and tracking.
 * Supports HIPAA, FERPA, and other regulatory compliance reporting.
 *
 * Key Features:
 * - Compliance report CRUD operations
 * - Automated report generation with checklists
 * - Report status lifecycle management
 * - Findings and recommendations tracking
 *
 * @example Generate compliance report
 * ```typescript
 * const report = await generateReport('HIPAA_ANNUAL', 'FISCAL_YEAR_2025');
 * console.log(`Report created with ${report.checklistItems.length} items`);
 * ```
 */

import type { ApiClient } from '../../core/ApiClient';
import type {
  ComplianceReportFilters,
  ComplianceReportsResponse,
  ComplianceReportResponse,
  CreateComplianceReportData,
  UpdateComplianceReportData,
  SuccessResponse,
} from './types';
import { extractApiData, handleApiError } from '../../utils/apiUtils';

/**
 * Compliance Reports API
 * Manages compliance report lifecycle and tracking
 */
export class ComplianceReportsApi {
  constructor(private readonly client: ApiClient) {}

  /**
   * Get compliance reports with pagination and filters
   */
  async getReports(params?: ComplianceReportFilters): Promise<ComplianceReportsResponse> {
    try {
      const response = await this.client.get('/compliance', { params });
      return extractApiData(response);
    } catch (error) {
      throw handleApiError(error as any);
    }
  }

  /**
   * Get compliance report by ID with checklist items
   */
  async getReportById(id: string): Promise<ComplianceReportResponse> {
    try {
      const response = await this.client.get(`/compliance/${id}`);
      return extractApiData(response);
    } catch (error) {
      throw handleApiError(error as any);
    }
  }

  /**
   * Create a new compliance report
   */
  async createReport(data: CreateComplianceReportData): Promise<ComplianceReportResponse> {
    try {
      const response = await this.client.post('/compliance', data);
      return extractApiData(response);
    } catch (error) {
      throw handleApiError(error as any);
    }
  }

  /**
   * Update a compliance report (status, findings, recommendations)
   */
  async updateReport(id: string, data: UpdateComplianceReportData): Promise<ComplianceReportResponse> {
    try {
      const response = await this.client.put(`/compliance/${id}`, data);
      return extractApiData(response);
    } catch (error) {
      throw handleApiError(error as any);
    }
  }

  /**
   * Delete a compliance report
   */
  async deleteReport(id: string): Promise<SuccessResponse> {
    try {
      const response = await this.client.delete(`/compliance/${id}`);
      return extractApiData(response);
    } catch (error) {
      throw handleApiError(error as any);
    }
  }

  /**
   * Generate a compliance report with automatic checklist items
   */
  async generateReport(reportType: string, period: string): Promise<ComplianceReportResponse> {
    try {
      const response = await this.client.post('/compliance/generate', { reportType, period });
      return extractApiData(response);
    } catch (error) {
      throw handleApiError(error as any);
    }
  }
}
