/**
 * @fileoverview Student Medication API
 *
 * Handles student medication assignments (prescriptions), tracking, and
 * management with Five Rights validation and comprehensive audit logging.
 *
 * **Key Features:**
 * - Medication assignment to students (prescriptions)
 * - Five Rights validation for patient safety
 * - Prescription management and tracking
 * - Student medication deactivation
 * - HIPAA-compliant PHI protection
 *
 * @module services/modules/medications/studentMedicationApi
 */

import type { ApiClient } from '../../core/ApiClient';
import { API_ENDPOINTS } from '../../../constants/api';
import { ApiResponse } from '../../utils/apiUtils';
import { createApiError } from '../../core/errors';
import type {
  StudentMedication,
  StudentMedicationFormData
} from './types';
import { assignMedicationSchema } from './schemas';

/**
 * Student Medication API Service
 *
 * Provides student medication assignment and management operations
 * with comprehensive validation and audit trails.
 */
export class StudentMedicationApi {
  constructor(private client: ApiClient) {}

  /**
   * Assign medication to student (create prescription)
   *
   * Creates a new student medication assignment with prescription details.
   * Implements Five Rights validation before assignment.
   *
   * **Five Rights Validation**:
   * - Right Patient: studentId UUID validation
   * - Right Medication: medicationId UUID validation
   * - Right Dose: dosage format validation
   * - Right Route: administration route validation
   * - Right Time: start/end date validation
   *
   * @param {StudentMedicationFormData} assignmentData - Prescription details
   * @returns {Promise<StudentMedication>} Created student medication assignment
   * @throws {ValidationError} If Five Rights validation fails
   * @throws {ApiError} If assignment fails
   *
   * @example
   * ```typescript
   * const assignment = await studentMedicationApi.assignToStudent({
   *   studentId: 'student-uuid',
   *   medicationId: 'amoxicillin-uuid',
   *   dosage: '500mg',
   *   frequency: 'three times daily',
   *   route: 'Oral',
   *   startDate: '2025-10-26',
   *   endDate: '2025-11-02',
   *   prescribedBy: 'Dr. Johnson',
   *   prescriptionNumber: 'RX123456',
   *   instructions: 'Take with food. Complete full course.'
   * });
   * ```
   *
   * @remarks
   * **HIPAA Compliance**: Generates PHI access audit log
   * **Cache Invalidation**: Invalidates student medications query
   */
  async assignToStudent(assignmentData: StudentMedicationFormData): Promise<StudentMedication> {
    try {
      // Validate assignment data with Five Rights
      assignMedicationSchema.parse(assignmentData);

      const response = await this.client.post<ApiResponse<{ studentMedication: StudentMedication }>>(
        `${API_ENDPOINTS.MEDICATIONS.BASE}/assign`,
        assignmentData
      );

      return response.data.data.studentMedication;
    } catch (error) {
      if (error.name === 'ZodError') {
        throw new Error(`Validation error: ${error.errors[0].message}`);
      }
      throw createApiError(error, 'Failed to assign medication');
    }
  }

  /**
   * Deactivate student medication
   *
   * Discontinues an active student medication prescription.
   * Soft delete preserving history for audit trail.
   *
   * @param {string} studentMedicationId - Student medication UUID
   * @param {string} [reason] - Reason for discontinuation
   * @returns {Promise<StudentMedication>} Deactivated student medication
   * @throws {ApiError} If deactivation fails
   *
   * @example
   * ```typescript
   * const deactivated = await studentMedicationApi.deactivateStudentMedication(
   *   'student-medication-uuid',
   *   'Course of treatment completed'
   * );
   * ```
   */
  async deactivateStudentMedication(
    studentMedicationId: string,
    reason?: string
  ): Promise<StudentMedication> {
    try {
      if (!studentMedicationId) {
        throw new Error('Student medication ID is required');
      }

      const response = await this.client.put<ApiResponse<{ studentMedication: StudentMedication }>>(
        `${API_ENDPOINTS.MEDICATIONS.BASE}/student-medication/${studentMedicationId}/deactivate`,
        { reason }
      );

      return response.data.data.studentMedication;
    } catch (error) {
      throw createApiError(error, 'Failed to deactivate medication');
    }
  }
}

/**
 * Factory function for creating StudentMedicationApi instances
 *
 * @param {ApiClient} client - Configured ApiClient instance
 * @returns {StudentMedicationApi} New instance
 */
export function createStudentMedicationApi(client: ApiClient): StudentMedicationApi {
  return new StudentMedicationApi(client);
}
