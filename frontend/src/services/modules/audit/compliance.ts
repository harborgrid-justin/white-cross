/**
 * @fileoverview Compliance Reporting Operations
 * @module services/modules/audit/compliance
 * @category Services - Compliance
 *
 * HIPAA compliance reporting and regulatory audit support.
 * Generates comprehensive compliance reports with metrics, violations,
 * and recommendations for regulatory compliance.
 *
 * Compliance Features:
 * - HIPAA compliance reports with audit evidence
 * - Access frequency analysis by user and resource
 * - Compliance score calculation based on audit data
 * - Violation detection and reporting
 * - Regulatory audit support with exportable evidence
 * - PHI access summary and analysis
 * - Unauthorized access attempt tracking
 */

import type { ApiClient } from '../../core/ApiClient';
import { ApiResponse } from '../../utils/apiUtils';
import type { ComplianceReport } from './types';

/**
 * Compliance Reporting Service
 * Manages HIPAA compliance reports and regulatory audit support
 */
export class ComplianceReportingService {
  constructor(private readonly client: ApiClient) {}

  /**
   * Get compliance report
   * Generates or retrieves a comprehensive HIPAA compliance report
   * for the specified date range
   *
   * @param params - Optional date range for report
   * @returns Compliance report with metrics, violations, and recommendations
   */
  async getComplianceReport(params?: {
    startDate?: string;
    endDate?: string;
  }): Promise<ComplianceReport> {
    const response = await this.client.get<ApiResponse<ComplianceReport>>(
      '/audit/compliance-report',
      { params }
    );
    return response.data.data!;
  }
}
