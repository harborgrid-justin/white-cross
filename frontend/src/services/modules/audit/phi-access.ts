/**
 * @fileoverview PHI Access Logging Operations
 * @module services/modules/audit/phi-access
 * @category Services - PHI Access Tracking
 *
 * HIPAA-compliant PHI (Protected Health Information) access logging.
 * All PHI access must be tracked with user identification, access reason,
 * timestamp, and data fields accessed for regulatory compliance.
 *
 * HIPAA Requirements:
 * - All PHI access must be logged with who, what, when, why
 * - Minimum 6-year audit trail retention
 * - Access logs must include IP address and user agent
 * - Tamper-evident logging mechanisms required
 */

import type { ApiClient } from '../../core/ApiClient';
import { ApiResponse, PaginatedResponse } from '../../utils/apiUtils';
import type { PHIAccessLog, PHIAccessFilters } from './types';

/**
 * PHI Access Logging Service
 * Manages HIPAA-compliant PHI access tracking
 */
export class PHIAccessService {
  constructor(private readonly client: ApiClient) {}

  /**
   * Get PHI access logs with optional filters
   * Retrieves HIPAA-compliant audit trail of PHI access events
   *
   * @param filters - Optional filters for PHI access logs
   * @returns Paginated PHI access logs
   */
  async getPHIAccessLogs(filters?: PHIAccessFilters): Promise<PaginatedResponse<PHIAccessLog>> {
    const paginationParams = {
      page: filters?.page ?? 1,
      limit: filters?.limit ?? 10,
    };
    const allParams = filters ? { ...paginationParams, ...filters } : paginationParams;
    const response = await this.client.get<PaginatedResponse<PHIAccessLog>>(
      '/audit/phi-access',
      { params: allParams }
    );
    return response.data;
  }

  /**
   * Log PHI access
   * Creates a HIPAA-compliant audit trail entry for PHI access
   * Note: Typically done automatically by backend, but available for manual logging
   *
   * @param accessData - PHI access details including user, student, and data accessed
   * @returns Created PHI access log
   */
  async logPHIAccess(accessData: Partial<PHIAccessLog>): Promise<PHIAccessLog> {
    const response = await this.client.post<ApiResponse<PHIAccessLog>>(
      '/audit/phi-access',
      accessData
    );
    return response.data.data!;
  }
}
