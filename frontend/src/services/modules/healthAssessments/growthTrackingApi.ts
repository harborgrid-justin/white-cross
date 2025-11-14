/**
 * Growth Tracking API Module
 *
 * Handles growth measurement recording and analysis.
 * Tracks height, weight, BMI, and provides percentile-based growth analysis.
 *
 * @module HealthAssessments/GrowthTrackingApi
 * @version 2.0.0
 * @since 2025-10-24
 */

import type { ApiClient } from '../../core/ApiClient';
import { ApiResponse } from '../../utils/apiUtils';
import { createApiError } from '../../core/errors';
import { auditService, AuditAction, AuditResourceType, AuditStatus } from '../../audit';
import { z } from 'zod';
import { createGrowthMeasurementSchema } from './validationSchemas';
import type { GrowthMeasurement, CreateGrowthMeasurementRequest, GrowthAnalysis } from './types';

/**
 * Query parameters for growth analysis
 */
export interface GrowthAnalysisQueryParams {
  includeHistory?: boolean;
  monthsBack?: number;
}

/**
 * Growth Tracking API Service
 *
 * Provides methods for:
 * - Recording growth measurements
 * - Retrieving growth analysis and trends
 */
export class GrowthTrackingApi {
  constructor(private readonly client: ApiClient) {}

  /**
   * Record growth measurement for a student
   *
   * Records height, weight, BMI, and optional head circumference.
   * Automatically calculates percentiles based on age and gender.
   *
   * @param studentId - Student UUID
   * @param measurementData - Growth measurement data
   * @returns Created growth measurement with calculated percentiles
   * @throws {ValidationError} If validation fails
   * @throws {ApiError} If recording fails
   *
   * @example
   * ```typescript
   * const measurement = await growthTrackingApi.recordGrowthMeasurement('student-uuid', {
   *   height: 155.5,
   *   weight: 48.2,
   *   measurementDate: '2025-10-24',
   *   notes: 'Regular checkup'
   * });
   * ```
   */
  async recordGrowthMeasurement(
    studentId: string,
    measurementData: CreateGrowthMeasurementRequest
  ): Promise<GrowthMeasurement> {
    try {
      if (!studentId) {
        throw new Error('Student ID is required');
      }

      // Validate request data
      createGrowthMeasurementSchema.parse(measurementData);

      const response = await this.client.post<ApiResponse<GrowthMeasurement>>(
        `/health-assessments/growth/${studentId}`,
        measurementData
      );

      const measurement = response.data.data!;

      // Audit PHI creation
      await auditService.log({
        action: AuditAction.CREATE_GROWTH_MEASUREMENT,
        resourceType: AuditResourceType.GROWTH_MEASUREMENT,
        resourceId: measurement.id,
        studentId,
        status: AuditStatus.SUCCESS,
        isPHI: true,
        metadata: {
          height: measurementData.height,
          weight: measurementData.weight,
          bmi: measurement.bmi,
        },
      });

      return measurement;
    } catch (error: unknown) {
      if (error instanceof z.ZodError) {
        throw createApiError(error, `Validation error: ${error.errors[0].message}`);
      }

      await auditService.log({
        action: AuditAction.CREATE_GROWTH_MEASUREMENT,
        resourceType: AuditResourceType.GROWTH_MEASUREMENT,
        studentId,
        status: AuditStatus.FAILURE,
        isPHI: true,
        context: { error: error instanceof Error ? error.message : 'Unknown error' },
      });
      throw createApiError(error, 'Failed to record growth measurement');
    }
  }

  /**
   * Get growth analysis for a student
   *
   * Provides comprehensive growth trend analysis including percentile
   * tracking, velocity calculations, and clinical recommendations.
   *
   * @param studentId - Student UUID
   * @param params - Analysis parameters
   * @returns Growth analysis with trends and recommendations
   * @throws {ApiError} If analysis fails or insufficient data
   *
   * @example
   * ```typescript
   * const analysis = await growthTrackingApi.getGrowthAnalysis('student-uuid', {
   *   includeHistory: true,
   *   monthsBack: 24
   * });
   * console.log(`BMI Percentile: ${analysis.percentiles.bmiPercentile}`);
   * console.log(`Recommendations: ${analysis.recommendations.join(', ')}`);
   * ```
   */
  async getGrowthAnalysis(
    studentId: string,
    params?: GrowthAnalysisQueryParams
  ): Promise<GrowthAnalysis> {
    try {
      if (!studentId) {
        throw new Error('Student ID is required');
      }

      const response = await this.client.get<ApiResponse<GrowthAnalysis>>(
        `/health-assessments/growth/${studentId}/analysis`,
        { params }
      );

      // Audit PHI access
      await auditService.log({
        action: AuditAction.VIEW_GROWTH_TRENDS,
        resourceType: AuditResourceType.GROWTH_MEASUREMENT,
        studentId,
        status: AuditStatus.SUCCESS,
        isPHI: true,
        metadata: {
          includeHistory: params?.includeHistory,
          monthsBack: params?.monthsBack,
        },
      });

      return response.data.data!;
    } catch (error) {
      await auditService.log({
        action: AuditAction.VIEW_GROWTH_TRENDS,
        resourceType: AuditResourceType.GROWTH_MEASUREMENT,
        studentId,
        status: AuditStatus.FAILURE,
        isPHI: true,
        context: { error: (error as Error).message },
      });
      throw createApiError(error, 'Failed to fetch growth analysis');
    }
  }
}
