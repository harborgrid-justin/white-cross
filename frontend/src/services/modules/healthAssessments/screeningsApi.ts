/**
 * Health Screenings API Module
 *
 * Handles health screening recording and history retrieval.
 * Supports multiple screening types: vision, hearing, dental, scoliosis, BMI, etc.
 *
 * @module HealthAssessments/ScreeningsApi
 * @version 2.0.0
 * @since 2025-10-24
 */

import type { ApiClient } from '../../core/ApiClient';
import { ApiResponse, PaginatedResponse, buildPaginationParams } from '../../utils/apiUtils';
import { createApiError } from '../../core/errors';
import { auditService, AuditAction, AuditResourceType, AuditStatus } from '../../audit';
import { z } from 'zod';
import { createScreeningSchema } from './validationSchemas';
import type { HealthScreening, CreateScreeningRequest, ScreeningType } from './types';

/**
 * Query parameters for screening history
 */
export interface ScreeningHistoryQueryParams {
  screeningType?: ScreeningType;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

/**
 * Health Screenings API Service
 *
 * Provides methods for:
 * - Recording screening results
 * - Retrieving screening history with filtering
 */
export class ScreeningsApi {
  constructor(private readonly client: ApiClient) {}

  /**
   * Record health screening results
   *
   * Documents results from various screening types including vision,
   * hearing, dental, scoliosis, and BMI assessments.
   *
   * @param screeningData - Screening information
   * @returns Created screening record
   * @throws {ValidationError} If validation fails
   * @throws {ApiError} If creation fails
   *
   * @example
   * ```typescript
   * const screening = await screeningsApi.recordScreening({
   *   studentId: 'student-uuid',
   *   screeningType: 'VISION',
   *   result: 'REFER',
   *   detailedResults: {
   *     type: 'VISION',
   *     data: {
   *       leftEye: '20/40',
   *       rightEye: '20/60'
   *     }
   *   },
   *   followUpRequired: true,
   *   followUpNotes: 'Refer to optometrist for comprehensive exam'
   * });
   * ```
   */
  async recordScreening(screeningData: CreateScreeningRequest): Promise<HealthScreening> {
    try {
      // Validate request data
      createScreeningSchema.parse(screeningData);

      const response = await this.client.post<ApiResponse<HealthScreening>>(
        '/health-assessments/screenings',
        screeningData
      );

      const screening = response.data.data!;

      // Audit PHI creation
      await auditService.log({
        action: AuditAction.CREATE_SCREENING,
        resourceType: AuditResourceType.SCREENING,
        resourceId: screening.id,
        studentId: screeningData.studentId,
        status: AuditStatus.SUCCESS,
        isPHI: true,
        metadata: {
          screeningType: screeningData.screeningType,
          result: screeningData.result,
          followUpRequired: screeningData.followUpRequired,
        },
      });

      return screening;
    } catch (error: unknown) {
      if (error instanceof z.ZodError) {
        throw createApiError(error, `Validation error: ${error.errors[0].message}`);
      }

      await auditService.log({
        action: AuditAction.CREATE_SCREENING,
        resourceType: AuditResourceType.SCREENING,
        studentId: screeningData.studentId,
        status: AuditStatus.FAILURE,
        isPHI: true,
        context: { error: error instanceof Error ? error.message : 'Unknown error' },
      });
      throw createApiError(error, 'Failed to record screening');
    }
  }

  /**
   * Get screening history for a student
   *
   * Retrieves complete screening history with filtering options.
   *
   * @param studentId - Student UUID
   * @param params - Filter and pagination parameters
   * @returns Paginated screening history
   * @throws {ApiError} If query fails
   *
   * @example
   * ```typescript
   * const screenings = await screeningsApi.getScreeningHistory('student-uuid', {
   *   screeningType: 'VISION',
   *   startDate: '2025-01-01',
   *   endDate: '2025-12-31',
   *   page: 1,
   *   limit: 10
   * });
   * ```
   */
  async getScreeningHistory(
    studentId: string,
    params?: ScreeningHistoryQueryParams
  ): Promise<PaginatedResponse<HealthScreening>> {
    try {
      if (!studentId) {
        throw new Error('Student ID is required');
      }

      const paginationParams = buildPaginationParams(params?.page, params?.limit);
      const allParams = params ? { ...paginationParams, ...params } : paginationParams;

      const response = await this.client.get<PaginatedResponse<HealthScreening>>(
        `/health-assessments/screenings/${studentId}`,
        { params: allParams }
      );

      // Audit PHI access
      await auditService.log({
        action: AuditAction.VIEW_SCREENINGS,
        resourceType: AuditResourceType.SCREENING,
        studentId,
        status: AuditStatus.SUCCESS,
        isPHI: true,
        metadata: {
          screeningType: params?.screeningType,
          resultCount: response.data.data.length,
        },
      });

      return response.data;
    } catch (error) {
      await auditService.log({
        action: AuditAction.VIEW_SCREENINGS,
        resourceType: AuditResourceType.SCREENING,
        studentId,
        status: AuditStatus.FAILURE,
        isPHI: true,
        context: { error: (error as Error).message },
      });
      throw createApiError(error, 'Failed to fetch screening history');
    }
  }
}
