/**
 * @fileoverview Health Records Follow-Up and Document Management Service
 * @module services/modules/health/healthRecordsFollowUp
 * @category Services
 *
 * Health Records Follow-Up Tracking and Document Management
 *
 * Purpose:
 * Manages follow-up requirements for health records and handles document attachments.
 * Ensures no missed care by tracking follow-up requirements and completion. Provides
 * secure document attachment and management for health records.
 *
 * Features:
 * - Follow-up requirement tracking
 * - Follow-up completion workflows
 * - Overdue follow-up identification
 * - Document attachment to health records
 * - Confidential record marking
 * - Cross-school follow-up reporting
 *
 * Healthcare Safety:
 * - Prevents missed care by tracking required follow-ups
 * - Alerts for overdue follow-ups
 * - Ensures documentation completeness
 * - Supports care coordination workflows
 *
 * HIPAA Compliance:
 * - All operations automatically logged for PHI access
 * - Confidential record handling with enhanced controls
 * - Secure document storage and transmission
 * - Access audit trail maintained
 *
 * @example
 * ```typescript
 * import { createHealthRecordsFollowUpService } from '@/services/modules/health';
 * import { apiClient } from '@/services/core/ApiClient';
 *
 * const followUpService = createHealthRecordsFollowUpService(apiClient);
 *
 * // Get all follow-ups needed at a school
 * const followUps = await followUpService.getFollowUpRequired('school-uuid');
 *
 * // Complete a follow-up
 * await followUpService.completeFollowUp('record-uuid', {
 *   completionDate: new Date().toISOString(),
 *   notes: 'Follow-up completed, student improving'
 * });
 * ```
 */

import { API_ENDPOINTS } from '@/constants/api';
import type { ApiClient } from '@/services/core/ApiClient';
import type { ApiResponse, PaginatedResponse } from '@/services/types';
import type {
  HealthRecord,
  FollowUpCompletionData,
  DocumentAttachmentResult
} from './healthRecordsTypes';
import { createHealthRecordsPHILogger } from './healthRecordsPHI';

/**
 * Health Records Follow-Up Service
 *
 * @class
 * @description
 * Service for managing follow-up requirements and document attachments.
 * Ensures continuity of care by tracking required follow-ups and managing documentation.
 * All operations logged for HIPAA compliance.
 */
export class HealthRecordsFollowUpService {
  private phiLogger: ReturnType<typeof createHealthRecordsPHILogger>;

  constructor(private client: ApiClient) {
    this.phiLogger = createHealthRecordsPHILogger(client);
  }

  /**
   * Get records requiring follow-up
   * Can be filtered by school and overdue status.
   */
  async getFollowUpRequired(
    schoolId?: string,
    overdue?: boolean
  ): Promise<PaginatedResponse<HealthRecord>> {
    const params = this.buildQueryParams({
      followUpRequired: true,
      schoolId,
      overdue
    });

    const response = await this.client.get<PaginatedResponse<HealthRecord>>(
      `${API_ENDPOINTS.HEALTH_RECORDS.BASE}/follow-up-required${params}`
    );

    return response.data;
  }

  /**
   * Complete a follow-up for a health record
   * Marks follow-up complete and optionally schedules next follow-up.
   * Logs PHI access for HIPAA compliance.
   */
  async completeFollowUp(
    recordId: string,
    followUpData: FollowUpCompletionData
  ): Promise<HealthRecord> {
    this.validateId(recordId);

    const response = await this.client.post<ApiResponse<HealthRecord>>(
      `${API_ENDPOINTS.HEALTH_RECORDS.BASE}/${recordId}/complete-follow-up`,
      followUpData
    );

    const record = this.extractData(response);
    await this.phiLogger.logPHIAccess(
      'COMPLETE_FOLLOW_UP',
      record.studentId,
      'HEALTH_RECORD',
      recordId
    );
    return record;
  }

  /**
   * Attach a document to a health record
   * Supports consent forms, lab results, reports, etc.
   * Logs PHI access for HIPAA compliance.
   */
  async attachDocument(
    recordId: string,
    file: File,
    description?: string
  ): Promise<DocumentAttachmentResult> {
    this.validateId(recordId);

    const formData = new FormData();
    formData.append('file', file);
    if (description) {
      formData.append('description', description);
    }

    const response = await this.client.post<ApiResponse<DocumentAttachmentResult>>(
      `${API_ENDPOINTS.HEALTH_RECORDS.BASE}/${recordId}/attachments`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );

    // Get record to access studentId for logging
    const record = await this.getRecordForLogging(recordId);
    await this.phiLogger.logPHIAccess(
      'ATTACH_DOCUMENT',
      record.studentId,
      'HEALTH_RECORD',
      recordId
    );

    return this.extractData(response);
  }

  /**
   * Mark a health record as confidential
   * Enables enhanced access controls for sensitive health information.
   * Logs PHI access for HIPAA compliance.
   */
  async markConfidential(recordId: string, reason: string): Promise<HealthRecord> {
    this.validateId(recordId);

    const response = await this.client.post<ApiResponse<HealthRecord>>(
      `${API_ENDPOINTS.HEALTH_RECORDS.BASE}/${recordId}/mark-confidential`,
      { reason }
    );

    const record = this.extractData(response);
    await this.phiLogger.logPHIAccess(
      'MARK_CONFIDENTIAL',
      record.studentId,
      'HEALTH_RECORD',
      recordId
    );
    return record;
  }

  /**
   * Get record for PHI logging purposes
   * @private
   */
  private async getRecordForLogging(recordId: string): Promise<HealthRecord> {
    const response = await this.client.get<ApiResponse<HealthRecord>>(
      `${API_ENDPOINTS.HEALTH_RECORDS.BASE}/${recordId}`
    );
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
   * Build query parameters string
   * @private
   */
  private buildQueryParams(params: Record<string, unknown>): string {
    const filteredParams: Record<string, string> = {};

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        filteredParams[key] = String(value);
      }
    });

    const queryString = new URLSearchParams(filteredParams).toString();
    return queryString ? `?${queryString}` : '';
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
 * Factory function to create follow-up service instance
 *
 * @param {ApiClient} client - API client instance
 * @returns {HealthRecordsFollowUpService} Configured follow-up service
 *
 * @example
 * ```typescript
 * import { createHealthRecordsFollowUpService } from '@/services/modules/health';
 * import { apiClient } from '@/services/core/ApiClient';
 *
 * const followUpService = createHealthRecordsFollowUpService(apiClient);
 * ```
 */
export function createHealthRecordsFollowUpService(
  client: ApiClient
): HealthRecordsFollowUpService {
  return new HealthRecordsFollowUpService(client);
}
