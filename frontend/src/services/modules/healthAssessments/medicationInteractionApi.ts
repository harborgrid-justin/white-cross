/**
 * Medication Interaction API Module
 *
 * Handles medication interaction checking and analysis.
 * Identifies drug-drug, drug-food, and drug-condition interactions.
 *
 * @module HealthAssessments/MedicationInteractionApi
 * @version 2.0.0
 * @since 2025-10-24
 */

import type { ApiClient } from '../../core/ApiClient';
import { ApiResponse } from '../../utils/apiUtils';
import { createApiError } from '../../core/errors';
import { auditService, AuditAction, AuditResourceType, AuditStatus } from '../../audit';
import { z } from 'zod';
import { checkNewMedicationSchema } from './validationSchemas';
import type { MedicationInteractionCheck, CheckNewMedicationRequest } from './types';

/**
 * Medication Interaction API Service
 *
 * Provides methods for:
 * - Checking current medication interactions
 * - Validating new medication additions
 */
export class MedicationInteractionApi {
  constructor(private readonly client: ApiClient) {}

  /**
   * Get comprehensive medication interactions for a student
   *
   * Analyzes all current medications, supplements, and known allergies
   * for potential interactions including drug-drug, drug-food, and
   * drug-condition interactions.
   *
   * @param studentId - Student UUID
   * @returns Medication interaction analysis
   * @throws {ApiError} If analysis fails
   *
   * @example
   * ```typescript
   * const interactions = await medicationInteractionApi.getMedicationInteractions('student-uuid');
   * const major = interactions.interactions.filter(i => i.severity === 'MAJOR');
   * if (major.length > 0) {
   *   console.warn('Major interactions found:', major);
   * }
   * ```
   */
  async getMedicationInteractions(studentId: string): Promise<MedicationInteractionCheck> {
    try {
      if (!studentId) {
        throw new Error('Student ID is required');
      }

      const response = await this.client.get<ApiResponse<MedicationInteractionCheck>>(
        `/health-assessments/medication-interactions/${studentId}`
      );

      // Audit PHI access
      await auditService.log({
        action: AuditAction.VIEW_MEDICATIONS,
        resourceType: AuditResourceType.MEDICATION,
        studentId,
        status: AuditStatus.SUCCESS,
        isPHI: true,
        metadata: {
          queryType: 'medication_interactions',
          interactionCount: response.data.data!.interactions.length,
          highSeverityCount: response.data.data!.highSeverityCount,
        },
      });

      return response.data.data!;
    } catch (error) {
      await auditService.log({
        action: AuditAction.VIEW_MEDICATIONS,
        resourceType: AuditResourceType.MEDICATION,
        studentId,
        status: AuditStatus.FAILURE,
        isPHI: true,
        context: { error: (error as Error).message },
      });
      throw createApiError(error, 'Failed to fetch medication interactions');
    }
  }

  /**
   * Check interactions for a potential new medication
   *
   * Validates potential interactions before adding a new medication
   * to a student's regimen. Includes severity assessment and
   * management recommendations.
   *
   * @param studentId - Student UUID
   * @param medicationData - New medication details
   * @returns Interaction check results
   * @throws {ValidationError} If validation fails
   * @throws {ApiError} If check fails
   *
   * @example
   * ```typescript
   * const check = await medicationInteractionApi.checkNewMedicationInteractions('student-uuid', {
   *   medicationName: 'Amoxicillin',
   *   dosage: '500mg',
   *   frequency: 'three times daily'
   * });
   *
   * if (check.requiresReview) {
   *   console.warn('Pharmacist review required before prescribing');
   * }
   * ```
   */
  async checkNewMedicationInteractions(
    studentId: string,
    medicationData: CheckNewMedicationRequest
  ): Promise<MedicationInteractionCheck> {
    try {
      if (!studentId) {
        throw new Error('Student ID is required');
      }

      // Validate request data
      checkNewMedicationSchema.parse(medicationData);

      const response = await this.client.post<ApiResponse<MedicationInteractionCheck>>(
        `/health-assessments/medication-interactions/${studentId}/check`,
        medicationData
      );

      // Audit PHI access and check
      await auditService.log({
        action: AuditAction.VIEW_MEDICATIONS,
        resourceType: AuditResourceType.MEDICATION,
        studentId,
        status: AuditStatus.SUCCESS,
        isPHI: true,
        metadata: {
          queryType: 'check_new_medication',
          medicationName: medicationData.medicationName,
          interactionCount: response.data.data!.interactions.length,
          requiresReview: response.data.data!.requiresReview,
        },
      });

      return response.data.data!;
    } catch (error: unknown) {
      if (error instanceof z.ZodError) {
        throw createApiError(error, `Validation error: ${error.errors[0].message}`);
      }

      await auditService.log({
        action: AuditAction.VIEW_MEDICATIONS,
        resourceType: AuditResourceType.MEDICATION,
        studentId,
        status: AuditStatus.FAILURE,
        isPHI: true,
        context: {
          error: error instanceof Error ? error.message : 'Unknown error',
          medicationName: medicationData.medicationName,
        },
      });
      throw createApiError(error, 'Failed to check medication interactions');
    }
  }
}
