/**
 * Immunization API Module
 *
 * Handles immunization forecasting based on CDC guidelines.
 * Provides due date calculations and compliance status.
 *
 * @module HealthAssessments/ImmunizationApi
 * @version 2.0.0
 * @since 2025-10-24
 */

import type { ApiClient } from '../../core/ApiClient';
import { ApiResponse } from '../../utils/apiUtils';
import { createApiError } from '../../core/errors';
import { auditService, AuditAction, AuditResourceType, AuditStatus } from '../../audit';
import type { ImmunizationForecast } from './types';

/**
 * Query parameters for immunization forecast
 */
export interface ImmunizationForecastQueryParams {
  includeHistory?: boolean;
}

/**
 * Immunization API Service
 *
 * Provides methods for:
 * - Generating immunization forecasts based on CDC guidelines
 * - Identifying overdue and upcoming vaccinations
 */
export class ImmunizationApi {
  constructor(private readonly client: ApiClient) {}

  /**
   * Get immunization forecast for a student
   *
   * Generates immunization schedule based on current status, age,
   * and CDC guidelines. Shows overdue, due soon, and future immunizations.
   *
   * @param studentId - Student UUID
   * @param params - Forecast parameters
   * @returns Immunization forecast with due dates
   * @throws {ApiError} If forecast generation fails
   *
   * @example
   * ```typescript
   * const forecast = await immunizationApi.getImmunizationForecast('student-uuid', {
   *   includeHistory: true
   * });
   * const overdue = forecast.forecasts.filter(f => f.status === 'OVERDUE');
   * console.log(`Overdue vaccinations: ${overdue.length}`);
   * ```
   */
  async getImmunizationForecast(
    studentId: string,
    params?: ImmunizationForecastQueryParams
  ): Promise<ImmunizationForecast> {
    try {
      if (!studentId) {
        throw new Error('Student ID is required');
      }

      const response = await this.client.get<ApiResponse<ImmunizationForecast>>(
        `/health-assessments/immunizations/${studentId}/forecast`,
        { params }
      );

      // Audit PHI access
      await auditService.log({
        action: AuditAction.VIEW_HEALTH_RECORD,
        resourceType: AuditResourceType.HEALTH_RECORD,
        studentId,
        status: AuditStatus.SUCCESS,
        isPHI: true,
        metadata: {
          queryType: 'immunization_forecast',
          overdueCount: response.data.data!.overdueCount,
        },
      });

      return response.data.data!;
    } catch (error) {
      await auditService.log({
        action: AuditAction.VIEW_HEALTH_RECORD,
        resourceType: AuditResourceType.HEALTH_RECORD,
        studentId,
        status: AuditStatus.FAILURE,
        isPHI: true,
        context: { error: (error as Error).message },
      });
      throw createApiError(error, 'Failed to fetch immunization forecast');
    }
  }
}
