/**
 * @fileoverview Audit Query Operations
 * @module services/modules/audit/queries
 * @category Services - Audit Queries
 *
 * Various audit log query operations including statistics,
 * user activity tracking, session analysis, and data access logs.
 */

import type { ApiClient } from '../../core/ApiClient';
import { ApiResponse } from '../../utils/apiUtils';
import type {
  AuditStatistics,
  UserActivity,
  SessionAudit,
  DataAccessLog
} from './types';

/**
 * Audit Query Service
 * Provides specialized audit log queries and analysis
 */
export class AuditQueryService {
  constructor(private readonly client: ApiClient) {}

  /**
   * Get audit statistics
   * Retrieves aggregated audit metrics and activity summary
   *
   * @param params - Optional date range for statistics
   * @returns Audit statistics with counts and recent activity
   */
  async getStatistics(params?: {
    startDate?: string;
    endDate?: string;
  }): Promise<AuditStatistics> {
    const response = await this.client.get<ApiResponse<AuditStatistics>>(
      '/audit/statistics',
      { params }
    );
    return response.data.data!;
  }

  /**
   * Get user activity logs
   * Retrieves all actions performed by a specific user
   *
   * @param userId - User identifier
   * @param params - Optional date range and pagination
   * @returns User activity summary
   */
  async getUserActivity(userId: string, params?: {
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  }): Promise<UserActivity> {
    const response = await this.client.get<ApiResponse<UserActivity>>(
      `/audit/user/${userId}/activity`,
      { params }
    );
    return response.data.data!;
  }

  /**
   * Get session audit data
   * Retrieves all audit logs and PHI access for a specific session
   *
   * @param sessionId - Session identifier
   * @returns Session audit trail with all actions and PHI access
   */
  async getSessionAudit(sessionId: string): Promise<SessionAudit> {
    const response = await this.client.get<ApiResponse<SessionAudit>>(
      `/audit/session/${sessionId}`
    );
    return response.data.data!;
  }

  /**
   * Get data access logs for a specific resource
   * Retrieves all access logs for a particular resource
   *
   * @param resourceType - Type of resource (e.g., 'student', 'health-record')
   * @param resourceId - Resource identifier
   * @param params - Optional date range filter
   * @returns Array of data access logs
   */
  async getDataAccessLogs(
    resourceType: string,
    resourceId: string,
    params?: {
      startDate?: string;
      endDate?: string;
    }
  ): Promise<DataAccessLog[]> {
    const response = await this.client.get<ApiResponse<DataAccessLog[]>>(
      `/audit/data-access/${resourceType}/${resourceId}`,
      { params }
    );
    return response.data.data || [];
  }
}
