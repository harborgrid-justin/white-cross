/**
 * @fileoverview Medication Administration API
 *
 * @deprecated This API is deprecated. Migrate to @/lib/actions/medications.administration
 *
 * MIGRATION GUIDE:
 * ```typescript
 * // Before: Log medication administration
 * import { MedicationAdministrationApi } from '@/services/modules/medications/administrationApi';
 * const api = new MedicationAdministrationApi(client);
 * const log = await api.logAdministration({
 *   studentMedicationId: 'id',
 *   dosageGiven: '500mg',
 *   timeGiven: new Date().toISOString(),
 *   notes: 'No issues'
 * });
 *
 * // After: Use server action
 * import { administerMedication } from '@/lib/actions/medications.administration';
 * const result = await administerMedication({
 *   medicationId: 'med-id',
 *   studentId: 'student-id',
 *   administeredBy: 'nurse-id',
 *   administeredAt: new Date().toISOString(),
 *   dosageGiven: '500mg',
 *   notes: 'No issues'
 * });
 *
 * // Before: Get student logs
 * const response = await api.getStudentLogs('student-id', 1, 20);
 * const logs = response.medications;
 *
 * // After: Use cached query
 * import { getStudentMedicationLogs } from '@/lib/actions/medications.cache';
 * const logs = await getStudentMedicationLogs('student-id');
 * ```
 *
 * BENEFITS OF SERVER ACTIONS:
 * ✓ Automatic HIPAA audit logging (critical for medication administration)
 * ✓ Server-side Five Rights validation
 * ✓ Built-in cache invalidation
 * ✓ Type-safe ActionResult pattern
 * ✓ NO optimistic updates (safer for critical operations)
 * ✓ Better error handling and rollback
 *
 * Handles medication administration logging with Five Rights verification,
 * administration history retrieval, and real-time audit logging for HIPAA
 * compliance and patient safety.
 *
 * **Key Features:**
 * - Five Rights enforcement (Patient, Medication, Dose, Route, Time)
 * - Real-time administration logging with audit trails
 * - Administration history and student logs
 * - Critical safety verification before administration
 *
 * **CRITICAL:** All administration events must be logged immediately
 * for compliance and patient safety tracking. NO optimistic updates.
 *
 * @module services/modules/medications/administrationApi
 */

import type { ApiClient } from '../../core/ApiClient';
import { API_ENDPOINTS } from '../../../constants/api';
import { ApiResponse } from '../../utils/apiUtils';
import { createApiError } from '../../core/errors';
import { auditService, AuditAction, AuditResourceType, AuditStatus } from '../../audit';
import type {
  MedicationLog,
  MedicationAdministrationData,
  StudentMedicationsResponse
} from './types';
import { logAdministrationSchema } from './schemas';

/**
 * Medication Administration API Service
 *
 * Provides critical medication administration operations including logging,
 * verification, and history retrieval with comprehensive audit trails.
 */
export class MedicationAdministrationApi {
  constructor(private client: ApiClient) {}

  /**
   * Log medication administration
   *
   * CRITICAL: Records medication administration with Five Rights verification.
   * All administration events must be logged immediately for compliance and
   * patient safety tracking.
   *
   * **Five Rights Enforcement**:
   * - Patient verification via barcode/photo
   * - Medication verification via NDC/barcode
   * - Dosage calculation and verification
   * - Route confirmation
   * - Time window validation
   *
   * **Safety Checks**:
   * - Allergy verification required
   * - Patient identification confirmed
   * - Witness signature for controlled substances
   * - Side effect monitoring
   *
   * @param {MedicationAdministrationData} logData - Administration details
   * @returns {Promise<MedicationLog>} Created administration log
   * @throws {ValidationError} If validation or Five Rights check fails
   * @throws {ApiError} If logging fails
   *
   * @example
   * ```typescript
   * const log = await administrationApi.logAdministration({
   *   studentMedicationId: 'prescription-uuid',
   *   dosageGiven: '500mg',
   *   timeGiven: '2025-10-26T08:00:00Z',
   *   notes: 'Student took medication without difficulty',
   *   patientVerified: true,
   *   allergyChecked: true,
   *   deviceId: 'tablet-123'
   * });
   * ```
   *
   * @remarks
   * **CRITICAL**: NO optimistic updates - wait for server confirmation
   * **Audit Logging**: Immediate audit log on success and failure
   * **Cache**: No caching - administration logs are real-time
   * **Offline**: Queue for later submission if offline
   */
  async logAdministration(logData: MedicationAdministrationData): Promise<MedicationLog> {
    try {
      // Validate administration data with Five Rights
      logAdministrationSchema.parse(logData);

      const response = await this.client.post<ApiResponse<{ medicationLog: MedicationLog }>>(
        `${API_ENDPOINTS.MEDICATIONS.BASE}/administration`,
        logData
      );

      const medicationLog = response.data.data.medicationLog;

      // CRITICAL: Immediate audit log for medication administration
      await auditService.log({
        action: AuditAction.ADMINISTER_MEDICATION,
        resourceType: AuditResourceType.MEDICATION_LOG,
        resourceId: medicationLog.id,
        status: AuditStatus.SUCCESS,
        isPHI: true,
        metadata: {
          dosageGiven: logData.dosageGiven,
          timeGiven: logData.timeGiven,
          studentMedicationId: logData.studentMedicationId,
          hasSideEffects: !!logData.sideEffects,
        },
      });

      return medicationLog;
    } catch (error) {
      if (error.name === 'ZodError') {
        throw new Error(`Validation error: ${error.errors[0].message}`);
      }

      // CRITICAL: Log failed administration attempt
      await auditService.log({
        action: AuditAction.ADMINISTER_MEDICATION,
        resourceType: AuditResourceType.MEDICATION_LOG,
        status: AuditStatus.FAILURE,
        isPHI: true,
        context: {
          error: error.message,
          studentMedicationId: logData.studentMedicationId,
        },
      });

      throw createApiError(error, 'Failed to log administration');
    }
  }

  /**
   * Get administration logs for a student
   *
   * Retrieves paginated medication administration history for a student.
   * Includes medication details, dosages, times, and any reported side effects.
   *
   * @param {string} studentId - Student UUID
   * @param {number} [page=1] - Page number
   * @param {number} [limit=20] - Results per page
   * @returns {Promise<StudentMedicationsResponse>} Paginated administration logs
   * @throws {ApiError} If request fails
   *
   * @example
   * ```typescript
   * const logs = await administrationApi.getStudentLogs('student-uuid', 1, 50);
   * console.log(`Total administrations: ${logs.total}`);
   * ```
   */
  async getStudentLogs(
    studentId: string,
    page: number = 1,
    limit: number = 20
  ): Promise<StudentMedicationsResponse> {
    try {
      if (!studentId) {
        throw new Error('Student ID is required');
      }

      const response = await this.client.get<ApiResponse<StudentMedicationsResponse>>(
        `${API_ENDPOINTS.MEDICATIONS.BASE}/logs/${studentId}?page=${page}&limit=${limit}`
      );

      return response.data.data;
    } catch (error) {
      throw createApiError(error, 'Failed to fetch administration logs');
    }
  }

  /**
   * Alias for logAdministration (backward compatibility)
   *
   * @deprecated Use logAdministration() for consistency
   * @see {@link logAdministration}
   */
  async administer(logData: MedicationAdministrationData): Promise<MedicationLog> {
    return this.logAdministration(logData);
  }
}

/**
 * Factory function for creating MedicationAdministrationApi instances
 *
 * @param {ApiClient} client - Configured ApiClient instance
 * @returns {MedicationAdministrationApi} New instance
 */
export function createMedicationAdministrationApi(client: ApiClient): MedicationAdministrationApi {
  return new MedicationAdministrationApi(client);
}
