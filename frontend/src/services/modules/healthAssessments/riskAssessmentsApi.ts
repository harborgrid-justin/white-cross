/**
 * Health Risk Assessments API Module
 *
 * Handles health risk assessment calculations and high-risk student queries.
 * Provides comprehensive risk analysis based on chronic conditions, allergies,
 * medications, and recent health incidents.
 *
 * @module HealthAssessments/RiskAssessmentsApi
 * @version 2.0.0
 * @since 2025-10-24
 */

import type { ApiClient } from '../../core/ApiClient';
import { ApiResponse, PaginatedResponse, buildPaginationParams } from '../../utils/apiUtils';
import { createApiError } from '../../core/errors';
import { auditService, AuditAction, AuditResourceType, AuditStatus } from '../../audit';
import type { HealthRiskAssessment, HighRiskStudent } from './types';

/**
 * Query parameters for high-risk students
 */
export interface HighRiskStudentsQueryParams {
  minRiskScore?: number;
  schoolId?: string;
  gradeLevel?: string;
  page?: number;
  limit?: number;
}

/**
 * Health Risk Assessments API Service
 *
 * Provides methods for:
 * - Individual student risk assessment
 * - High-risk student identification and monitoring
 */
export class RiskAssessmentsApi {
  constructor(private readonly client: ApiClient) {}

  /**
   * Get health risk assessment for a specific student
   *
   * Calculates comprehensive risk score based on:
   * - Active chronic conditions
   * - Severe allergies
   * - Current medications
   * - Recent health incidents
   *
   * @param studentId - Student UUID
   * @returns Health risk assessment with recommendations
   * @throws {ApiError} If student not found or calculation fails
   *
   * @example
   * ```typescript
   * const assessment = await riskAssessmentsApi.getHealthRisk('student-uuid');
   * console.log(`Risk Level: ${assessment.riskLevel}`);
   * console.log(`Recommendations: ${assessment.recommendations.join(', ')}`);
   * ```
   */
  async getHealthRisk(studentId: string): Promise<HealthRiskAssessment> {
    try {
      if (!studentId) {
        throw new Error('Student ID is required');
      }

      const response = await this.client.get<ApiResponse<{ assessment: HealthRiskAssessment }>>(
        `/health-assessments/risk/${studentId}`
      );

      // Audit PHI access
      await auditService.log({
        action: AuditAction.VIEW_HEALTH_RECORD,
        resourceType: AuditResourceType.HEALTH_RECORD,
        resourceId: studentId,
        studentId,
        status: AuditStatus.SUCCESS,
        isPHI: true,
        metadata: {
          assessmentType: 'health_risk',
          riskLevel: response.data.data.assessment.riskLevel,
        },
      });

      return response.data.data.assessment;
    } catch (error) {
      await auditService.log({
        action: AuditAction.VIEW_HEALTH_RECORD,
        resourceType: AuditResourceType.HEALTH_RECORD,
        resourceId: studentId,
        studentId,
        status: AuditStatus.FAILURE,
        isPHI: true,
        context: { error: (error as Error).message },
      });
      throw createApiError(error, 'Failed to fetch health risk assessment');
    }
  }

  /**
   * Get list of high-risk students
   *
   * Returns students with elevated health risk scores requiring
   * proactive monitoring and intervention.
   *
   * @param params - Filter and pagination parameters
   * @returns Paginated list of high-risk students
   * @throws {ApiError} If query fails
   *
   * @example
   * ```typescript
   * const highRiskStudents = await riskAssessmentsApi.getHighRiskStudents({
   *   minRiskScore: 70,
   *   page: 1,
   *   limit: 20
   * });
   * ```
   */
  async getHighRiskStudents(
    params?: HighRiskStudentsQueryParams
  ): Promise<PaginatedResponse<HighRiskStudent>> {
    try {
      const paginationParams = buildPaginationParams(params?.page, params?.limit);
      const allParams = params ? { ...paginationParams, ...params } : paginationParams;

      const response = await this.client.get<PaginatedResponse<HighRiskStudent>>(
        '/health-assessments/high-risk-students',
        { params: allParams }
      );

      // Audit bulk PHI access
      await auditService.log({
        action: AuditAction.VIEW_HEALTH_RECORD,
        resourceType: AuditResourceType.HEALTH_RECORD,
        status: AuditStatus.SUCCESS,
        isPHI: true,
        metadata: {
          queryType: 'high_risk_students',
          resultCount: response.data.data.length,
          minRiskScore: params?.minRiskScore,
        },
      });

      return response.data;
    } catch (error) {
      await auditService.log({
        action: AuditAction.VIEW_HEALTH_RECORD,
        resourceType: AuditResourceType.HEALTH_RECORD,
        status: AuditStatus.FAILURE,
        isPHI: true,
        context: { error: (error as Error).message },
      });
      throw createApiError(error, 'Failed to fetch high-risk students');
    }
  }
}
