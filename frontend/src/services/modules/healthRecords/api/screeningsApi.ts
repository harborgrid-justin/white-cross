/**
 * Screenings API Module
 *
 * Handles health screening operations including:
 * - CRUD operations for screening records
 * - Due date tracking
 * - Referral management
 *
 * @module services/modules/healthRecords/api/screeningsApi
 */

import type { ApiClient } from '../../../core/ApiClient';
import { API_ENDPOINTS } from '../../../config/apiConfig';
import { z, type ZodIssue } from 'zod';
import { ApiResponse } from '../../../types';
import { AuditAction, AuditResourceType } from '../../../audit';
import { createValidationError } from '../../../core/errors';
import { BaseHealthApi } from './baseHealthApi';
import type {
  Screening,
  ScreeningCreate,
  ScreeningUpdate,
  ScreeningDue,
} from '../types';
import { screeningCreateSchema } from '../validation/schemas';

/**
 * Screenings API client
 * Manages health screening records
 */
export class ScreeningsApiClient extends BaseHealthApi {
  private readonly baseEndpoint = API_ENDPOINTS.HEALTH_RECORDS.BASE;

  constructor(client: ApiClient) {
    super(client);
  }

  /**
   * Get all screenings for a student
   *
   * @param studentId - The student ID
   * @returns List of screenings
   */
  async getScreenings(studentId: string): Promise<Screening[]> {
    try {
      const response = await this.client.get<ApiResponse<{ screenings: Screening[] }>>(
        `${this.baseEndpoint}/screenings/student/${studentId}`
      );

      await this.logPHIAccess(AuditAction.VIEW_SCREENINGS, studentId, AuditResourceType.SCREENING);

      return response.data.data!.screenings;
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Get a single screening by ID
   *
   * @param id - The screening ID
   * @returns The screening record
   */
  async getScreeningById(id: string): Promise<Screening> {
    try {
      const response = await this.client.get<ApiResponse<Screening>>(
        `${this.baseEndpoint}/screenings/${id}`
      );

      const screening = response.data.data!;
      await this.logPHIAccess(AuditAction.VIEW_SCREENING, screening.studentId, AuditResourceType.SCREENING, id);

      return screening;
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Create a new screening
   *
   * @param data - The screening data
   * @returns The created screening record
   */
  async createScreening(data: ScreeningCreate): Promise<Screening> {
    try {
      screeningCreateSchema.parse(data);

      const response = await this.client.post<ApiResponse<Screening>>(
        `${this.baseEndpoint}/screenings`,
        data
      );

      const screening = response.data.data!;
      await this.logPHIAccess(AuditAction.CREATE_SCREENING, data.studentId, AuditResourceType.SCREENING, screening.id);

      return screening;
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
   * Update an existing screening
   *
   * @param id - The screening ID
   * @param data - The update data
   * @returns The updated screening record
   */
  async updateScreening(id: string, data: ScreeningUpdate): Promise<Screening> {
    try {
      const response = await this.client.put<ApiResponse<Screening>>(
        `${this.baseEndpoint}/screenings/${id}`,
        data
      );

      const screening = response.data.data!;
      await this.logPHIAccess(AuditAction.UPDATE_SCREENING, screening.studentId, AuditResourceType.SCREENING, id);

      return screening;
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Delete a screening
   *
   * @param id - The screening ID
   */
  async deleteScreening(id: string): Promise<void> {
    try {
      const screening = await this.getScreeningById(id);
      await this.client.delete(`${this.baseEndpoint}/screenings/${id}`);
      await this.logPHIAccess(AuditAction.DELETE_SCREENING, screening.studentId, AuditResourceType.SCREENING, id);
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Get screenings that are due for review
   *
   * @returns List of screenings that are due or overdue
   */
  async getScreeningsDue(): Promise<ScreeningDue[]> {
    try {
      const response = await this.client.get<ApiResponse<{ screenings: ScreeningDue[] }>>(
        `${this.baseEndpoint}/screenings/due`
      );

      return response.data.data!.screenings;
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }
}
