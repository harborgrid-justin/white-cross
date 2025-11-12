/**
 * Health Records API Module
 *
 * Handles main health records operations including:
 * - CRUD operations for health records
 * - Health summaries
 * - Search and export
 * - Bulk import operations
 *
 * @module services/modules/healthRecords/api/healthRecordsApi
 */

import type { ApiClient } from '../../../core/ApiClient';
import { API_ENDPOINTS } from '../../../config/apiConfig';
import { z, type ZodIssue } from 'zod';
import {
  ApiResponse,
  PaginatedResponse,
} from '../../../types';
import { AuditAction, AuditResourceType } from '../../../audit';
import { createValidationError } from '../../../core/errors';
import { BaseHealthApi } from './baseHealthApi';
import type {
  HealthRecord,
  HealthRecordCreate,
  HealthRecordUpdate,
  HealthRecordFilters,
  HealthSummary,
  BulkImportRequest,
  BulkImportResult,
} from '../types';
import {
  healthRecordCreateSchema,
  bulkImportSchema,
} from '../validation/schemas';

/**
 * Health Records API client
 * Manages main health records operations
 */
export class HealthRecordsApiClient extends BaseHealthApi {
  private readonly baseEndpoint = API_ENDPOINTS.HEALTH_RECORDS.BASE;

  constructor(client: ApiClient) {
    super(client);
  }

  /**
   * Get all health records for a student
   *
   * @param studentId - The student ID
   * @param filters - Optional filters for the query
   * @returns Paginated list of health records
   */
  async getRecords(studentId: string, filters?: HealthRecordFilters): Promise<PaginatedResponse<HealthRecord>> {
    try {
      const params = new URLSearchParams();
      if (filters?.type) params.append('type', filters.type);
      if (filters?.dateFrom) params.append('dateFrom', filters.dateFrom);
      if (filters?.dateTo) params.append('dateTo', filters.dateTo);
      if (filters?.provider) params.append('provider', filters.provider);
      if (filters?.followUpRequired !== undefined) params.append('followUpRequired', String(filters.followUpRequired));
      if (filters?.isConfidential !== undefined) params.append('isConfidential', String(filters.isConfidential));
      if (filters?.page) params.append('page', String(filters.page));
      if (filters?.limit) params.append('limit', String(filters.limit));

      const response = await this.client.get<ApiResponse<PaginatedResponse<HealthRecord>>>(
        `${this.baseEndpoint}/student/${studentId}?${params.toString()}`
      );

      await this.logPHIAccess(AuditAction.VIEW_HEALTH_RECORDS, studentId, AuditResourceType.HEALTH_RECORD);

      return response.data.data!;
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Get a single health record by ID
   *
   * @param id - The health record ID
   * @returns The health record
   */
  async getRecordById(id: string): Promise<HealthRecord> {
    try {
      const response = await this.client.get<ApiResponse<HealthRecord>>(
        `${this.baseEndpoint}/${id}`
      );

      const record = response.data.data!;
      await this.logPHIAccess(AuditAction.VIEW_HEALTH_RECORD, record.studentId, AuditResourceType.HEALTH_RECORD, id);

      return record;
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Create a new health record
   *
   * @param data - The health record data
   * @returns The created health record
   */
  async createRecord(data: HealthRecordCreate): Promise<HealthRecord> {
    try {
      healthRecordCreateSchema.parse(data);

      const response = await this.client.post<ApiResponse<HealthRecord>>(
        this.baseEndpoint,
        data
      );

      const record = response.data.data!;
      await this.logPHIAccess(AuditAction.CREATE_HEALTH_RECORD, data.studentId, AuditResourceType.HEALTH_RECORD, record.id);

      return record;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw createValidationError(
          error.issues[0]?.message || 'Validation error',
          error.issues[0]?.path.join('.'),
          error.issues.reduce((acc: Record<string, string[]>, err: ZodIssue) => {
            const path = err.path.join('.');
            if (!acc[path]) acc[path] = [];
            acc[path].push(err.message);
            return acc;
          }, {} as Record<string, string[]>),
          error
        );
      }
      throw this.sanitizeError(error);
    }
  }

  /**
   * Update an existing health record
   *
   * @param id - The health record ID
   * @param data - The update data
   * @returns The updated health record
   */
  async updateRecord(id: string, data: HealthRecordUpdate): Promise<HealthRecord> {
    try {
      const response = await this.client.put<ApiResponse<HealthRecord>>(
        `${this.baseEndpoint}/${id}`,
        data
      );

      const record = response.data.data!;
      await this.logPHIAccess(AuditAction.UPDATE_HEALTH_RECORD, record.studentId, AuditResourceType.HEALTH_RECORD, id);

      return record;
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Delete a health record (soft delete)
   *
   * @param id - The health record ID
   */
  async deleteRecord(id: string): Promise<void> {
    try {
      const record = await this.getRecordById(id);
      await this.client.delete(`${this.baseEndpoint}/${id}`);
      await this.logPHIAccess(AuditAction.DELETE_HEALTH_RECORD, record.studentId, AuditResourceType.HEALTH_RECORD, id);
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Get comprehensive health summary for a student
   *
   * @param studentId - The student ID
   * @returns Health summary with all relevant information
   */
  async getSummary(studentId: string): Promise<HealthSummary> {
    try {
      const response = await this.client.get<ApiResponse<HealthSummary>>(
        `${this.baseEndpoint}/${studentId}/summary`
      );

      await this.logPHIAccess(AuditAction.VIEW_HEALTH_SUMMARY, studentId, AuditResourceType.HEALTH_RECORD);

      return response.data.data!;
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Search health records across all students (admin only)
   *
   * @param query - The search query
   * @param filters - Optional filters
   * @returns Paginated search results
   */
  async searchRecords(query: string, filters?: HealthRecordFilters): Promise<PaginatedResponse<HealthRecord>> {
    try {
      const params = new URLSearchParams();
      params.append('query', query);
      if (filters?.type) params.append('type', filters.type);
      if (filters?.dateFrom) params.append('dateFrom', filters.dateFrom);
      if (filters?.dateTo) params.append('dateTo', filters.dateTo);
      if (filters?.page) params.append('page', String(filters.page));
      if (filters?.limit) params.append('limit', String(filters.limit));

      const response = await this.client.get<ApiResponse<PaginatedResponse<HealthRecord>>>(
        `${this.baseEndpoint}/search?${params.toString()}`
      );

      return response.data.data!;
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Export health records for a student
   *
   * @param studentId - The student ID
   * @param format - Export format (pdf, json, or csv)
   * @returns Blob containing the exported data
   */
  async exportRecords(studentId: string, format: 'pdf' | 'json' | 'csv' = 'pdf'): Promise<Blob> {
    try {
      const response = await this.client.get<Blob>(
        `${this.baseEndpoint}/student/${studentId}/export?format=${format}`,
        { responseType: 'blob' }
      );

      await this.logPHIAccess(AuditAction.EXPORT_HEALTH_RECORDS, studentId, AuditResourceType.HEALTH_RECORD);

      return response.data;
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Bulk import health records with comprehensive validation
   *
   * @param data - Bulk import request data
   * @returns Import results including successes and failures
   */
  async bulkImportRecords(data: BulkImportRequest): Promise<BulkImportResult> {
    try {
      bulkImportSchema.parse(data);

      const response = await this.client.post<ApiResponse<BulkImportResult>>(
        `${this.baseEndpoint}/bulk-import`,
        data
      );

      const result = response.data.data!;

      // Log PHI access for each unique student
      const uniqueStudentIds = [...new Set(data.records.map(r => r.studentId))];
      await Promise.all(
        uniqueStudentIds.map(studentId =>
          this.logPHIAccess(AuditAction.IMPORT_HEALTH_RECORDS, studentId, AuditResourceType.HEALTH_RECORD)
        )
      );

      return result;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw createValidationError(
          error.issues[0]?.message || 'Validation error',
          error.issues[0]?.path.join('.'),
          error.issues.reduce((acc: Record<string, string[]>, err: ZodIssue) => {
            const path = err.path.join('.');
            if (!acc[path]) acc[path] = [];
            acc[path].push(err.message);
            return acc;
          }, {} as Record<string, string[]>),
          error
        );
      }
      throw this.sanitizeError(error);
    }
  }
}
