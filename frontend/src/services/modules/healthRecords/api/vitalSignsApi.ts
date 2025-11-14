/**
 * Vital Signs API Module
 *
 * Handles vital signs monitoring including:
 * - CRUD operations for vital signs records
 * - Trend analysis
 * - Alert generation
 *
 * @module services/modules/healthRecords/api/vitalSignsApi
 */

import type { ApiClient } from '../../../core/ApiClient';
import { API_ENDPOINTS } from '../../../config/apiConfig';
import { z, type ZodIssue } from 'zod';
import { ApiResponse } from '../../../types';
import { AuditAction, AuditResourceType } from '../../../audit';
import { createValidationError } from '../../../core/errors';
import { BaseHealthApi } from './baseHealthApi';
import type {
  VitalSigns,
  VitalSignsCreate,
  VitalSignsUpdate,
  VitalSignsTrend,
  VitalSignsFilters,
  VitalType,
} from '../types';
import { vitalSignsCreateSchema } from '../validation/schemas';

/**
 * Vital Signs API client
 * Manages vital signs monitoring
 */
export class VitalSignsApiClient extends BaseHealthApi {
  private readonly baseEndpoint = API_ENDPOINTS.HEALTH_RECORDS.BASE;

  constructor(client: ApiClient) {
    super(client);
  }

  /**
   * Get vital signs for a student
   *
   * @param studentId - The student ID
   * @param filters - Optional filters for date range and limit
   * @returns List of vital signs records
   */
  async getVitalSigns(studentId: string, filters?: VitalSignsFilters): Promise<VitalSigns[]> {
    try {
      const params = new URLSearchParams();
      if (filters?.dateFrom) params.append('dateFrom', filters.dateFrom);
      if (filters?.dateTo) params.append('dateTo', filters.dateTo);
      if (filters?.limit) params.append('limit', String(filters.limit));

      const response = await this.client.get<ApiResponse<{ vitals: VitalSigns[] }>>(
        `${this.baseEndpoint}/vitals/student/${studentId}?${params.toString()}`
      );

      await this.logPHIAccess(AuditAction.VIEW_VITAL_SIGNS, studentId, AuditResourceType.VITAL_SIGNS);

      return response.data.data!.vitals;
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Get vital signs by ID
   *
   * @param id - The vital signs record ID
   * @returns The vital signs record
   */
  async getVitalSignsById(id: string): Promise<VitalSigns> {
    try {
      const response = await this.client.get<ApiResponse<VitalSigns>>(
        `${this.baseEndpoint}/vitals/${id}`
      );

      const vitals = response.data.data!;
      await this.logPHIAccess(AuditAction.VIEW_VITAL_SIGNS, vitals.studentId, AuditResourceType.VITAL_SIGNS, id);

      return vitals;
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Create new vital signs record
   *
   * @param data - The vital signs data
   * @returns The created vital signs record
   */
  async createVitalSigns(data: VitalSignsCreate): Promise<VitalSigns> {
    try {
      vitalSignsCreateSchema.parse(data);

      const response = await this.client.post<ApiResponse<VitalSigns>>(
        `${this.baseEndpoint}/vitals`,
        data
      );

      const vitals = response.data.data!;
      await this.logPHIAccess(AuditAction.CREATE_VITAL_SIGNS, data.studentId, AuditResourceType.VITAL_SIGNS, vitals.id);

      return vitals;
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
   * Update vital signs
   *
   * @param id - The vital signs record ID
   * @param data - The update data
   * @returns The updated vital signs record
   */
  async updateVitalSigns(id: string, data: VitalSignsUpdate): Promise<VitalSigns> {
    try {
      const response = await this.client.put<ApiResponse<VitalSigns>>(
        `${this.baseEndpoint}/vitals/${id}`,
        data
      );

      const vitals = response.data.data!;
      await this.logPHIAccess(AuditAction.UPDATE_VITAL_SIGNS, vitals.studentId, AuditResourceType.VITAL_SIGNS, id);

      return vitals;
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Delete vital signs
   *
   * @param id - The vital signs record ID
   */
  async deleteVitalSigns(id: string): Promise<void> {
    try {
      const vitals = await this.getVitalSignsById(id);
      await this.client.delete(`${this.baseEndpoint}/vitals/${id}`);
      await this.logPHIAccess(AuditAction.DELETE_VITAL_SIGNS, vitals.studentId, AuditResourceType.VITAL_SIGNS, id);
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Get vital signs trends
   *
   * @param studentId - The student ID
   * @param vitalType - The type of vital sign to analyze
   * @param dateFrom - Optional start date for trend analysis
   * @param dateTo - Optional end date for trend analysis
   * @returns Vital signs trend analysis
   */
  async getVitalTrends(
    studentId: string,
    vitalType: VitalType,
    dateFrom?: string,
    dateTo?: string
  ): Promise<VitalSignsTrend> {
    try {
      const params = new URLSearchParams();
      params.append('type', vitalType);
      if (dateFrom) params.append('dateFrom', dateFrom);
      if (dateTo) params.append('dateTo', dateTo);

      const response = await this.client.get<ApiResponse<VitalSignsTrend>>(
        `${this.baseEndpoint}/vitals/student/${studentId}/trends?${params.toString()}`
      );

      await this.logPHIAccess(AuditAction.VIEW_VITAL_TRENDS, studentId, AuditResourceType.VITAL_SIGNS);

      return response.data.data!;
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }
}
