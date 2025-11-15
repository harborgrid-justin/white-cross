/**
 * @fileoverview Adverse Reactions API
 *
 * @deprecated This API is deprecated. Migrate to server actions (pending implementation).
 *
 * NOTE: Adverse reaction server actions are planned for future implementation.
 * This is a CRITICAL patient safety module and will remain functional until
 * the new server actions are thoroughly tested and validated.
 *
 * FUTURE MIGRATION PATH (when available):
 * ```typescript
 * // Before: Report adverse reaction
 * import { AdverseReactionsApi } from '@/services/modules/medications/adverseReactionsApi';
 * const api = new AdverseReactionsApi(client);
 * const report = await api.reportAdverseReaction({
 *   studentMedicationId: 'id',
 *   severity: 'SEVERE',
 *   reaction: 'Hives and swelling',
 *   actionTaken: 'Administered EpiPen',
 *   reportedAt: new Date().toISOString()
 * });
 *
 * // After: Use server action (pending)
 * import { reportAdverseReaction } from '@/lib/actions/adverse-reactions.crud';
 * const result = await reportAdverseReaction({
 *   medicationId: 'med-id',
 *   studentId: 'student-id',
 *   severity: 'SEVERE',
 *   reaction: 'Hives and swelling',
 *   actionTaken: 'Administered EpiPen'
 * });
 * ```
 *
 * BENEFITS OF SERVER ACTIONS (when available):
 * ✓ CRITICAL: Immediate HIPAA audit logging
 * ✓ Automatic physician notification triggers
 * ✓ Type-safe ActionResult pattern
 * ✓ Server-side severity validation
 * ✓ Better error handling for patient safety
 * ✓ Real-time alert generation
 *
 * Handles adverse reaction reporting and monitoring for medication safety.
 * Critical patient safety module requiring immediate documentation and
 * physician notification.
 *
 * **Key Features:**
 * - Adverse reaction reporting with severity levels
 * - Critical safety event handling
 * - Immediate audit logging
 * - Reaction history and tracking
 * - Physician notification triggers
 *
 * @module services/modules/medications/adverseReactionsApi
 */

import type { ApiClient } from '../../core/ApiClient';
import { API_ENDPOINTS } from '../../../constants/api';
import { ApiResponse } from '../../utils/apiUtils';
import { createApiError } from '../../core/errors';
import { auditService, AuditAction, AuditResourceType, AuditStatus } from '../../audit';
import type {
  AdverseReaction,
  AdverseReactionData,
  AdverseReactionFormData
} from './types';
import { reportAdverseReactionSchema } from './schemas';

/**
 * Adverse Reactions API Service
 *
 * Provides critical adverse reaction reporting and monitoring operations
 * with immediate audit logging and physician notification.
 */
export class AdverseReactionsApi {
  constructor(private client: ApiClient) {}

  /**
   * Report adverse reaction
   *
   * CRITICAL: Reports medication adverse reaction or side effect.
   * Patient safety event requiring immediate documentation and physician notification.
   *
   * **Severity Levels**:
   * - MILD: Minor discomfort, no intervention required
   * - MODERATE: Discomfort requiring monitoring or minor intervention
   * - SEVERE: Significant symptoms requiring medical intervention
   * - LIFE_THREATENING: Immediate emergency response required
   *
   * @param {AdverseReactionData | AdverseReactionFormData} reactionData - Reaction details
   * @returns {Promise<AdverseReaction>} Created adverse reaction report
   * @throws {ValidationError} If validation fails
   * @throws {ApiError} If reporting fails
   *
   * @example
   * ```typescript
   * // Report severe allergic reaction
   * const report = await adverseReactionsApi.reportAdverseReaction({
   *   studentMedicationId: 'prescription-uuid',
   *   severity: 'SEVERE',
   *   reaction: 'Hives, facial swelling, difficulty breathing',
   *   actionTaken: 'Administered EpiPen, called 911, notified parents',
   *   notes: 'Student responded well to epinephrine. Transported to ER.',
   *   reportedAt: new Date().toISOString()
   * });
   * ```
   *
   * @remarks
   * **CRITICAL**: Generates immediate audit log
   * **Notification**: Triggers alerts to prescribing physician
   * **Follow-up**: Requires physician review and documentation
   */
  async reportAdverseReaction(
    reactionData: AdverseReactionData | AdverseReactionFormData
  ): Promise<AdverseReaction> {
    try {
      // Validate adverse reaction data
      reportAdverseReactionSchema.parse(reactionData);

      const response = await this.client.post<ApiResponse<{ report: AdverseReaction }>>(
        `${API_ENDPOINTS.MEDICATIONS.BASE}/adverse-reaction`,
        reactionData
      );

      const report = response.data.data.report;

      // CRITICAL: Immediate audit log for adverse reaction
      await auditService.log({
        action: AuditAction.REPORT_ADVERSE_REACTION,
        resourceType: AuditResourceType.ADVERSE_REACTION,
        resourceId: report.id,
        studentId: report.studentId,
        status: AuditStatus.SUCCESS,
        isPHI: true,
        metadata: {
          severity: reactionData.severity,
          studentMedicationId: reactionData.studentMedicationId,
          reportedAt: reactionData.reportedAt,
        },
      });

      return report;
    } catch (error) {
      if (error.name === 'ZodError') {
        throw new Error(`Validation error: ${error.errors[0].message}`);
      }

      // CRITICAL: Log failed adverse reaction report
      await auditService.log({
        action: AuditAction.REPORT_ADVERSE_REACTION,
        resourceType: AuditResourceType.ADVERSE_REACTION,
        status: AuditStatus.FAILURE,
        isPHI: true,
        context: {
          error: error.message,
          severity: reactionData.severity,
          studentMedicationId: reactionData.studentMedicationId,
        },
      });

      throw createApiError(error, 'Failed to report adverse reaction');
    }
  }

  /**
   * Get adverse reactions
   *
   * Retrieves adverse reaction history filtered by medication or student.
   *
   * @param {string} [medicationId] - Filter by medication
   * @param {string} [studentId] - Filter by student
   * @returns {Promise<AdverseReaction[]>} Adverse reactions
   * @throws {ApiError} If request fails
   *
   * @example
   * ```typescript
   * // Get all adverse reactions for a specific medication
   * const reactions = await adverseReactionsApi.getAdverseReactions(
   *   'medication-uuid'
   * );
   *
   * // Get all adverse reactions for a specific student
   * const studentReactions = await adverseReactionsApi.getAdverseReactions(
   *   undefined,
   *   'student-uuid'
   * );
   * ```
   */
  async getAdverseReactions(
    medicationId?: string,
    studentId?: string
  ): Promise<AdverseReaction[]> {
    try {
      const params = new URLSearchParams();
      if (medicationId) params.append('medicationId', medicationId);
      if (studentId) params.append('studentId', studentId);

      const response = await this.client.get<ApiResponse<{ reactions: AdverseReaction[] }>>(
        `${API_ENDPOINTS.MEDICATIONS.BASE}/adverse-reactions?${params.toString()}`
      );

      return response.data.data.reactions;
    } catch (error) {
      throw createApiError(error, 'Failed to fetch adverse reactions');
    }
  }
}

/**
 * Factory function for creating AdverseReactionsApi instances
 *
 * @param {ApiClient} client - Configured ApiClient instance
 * @returns {AdverseReactionsApi} New instance
 */
export function createAdverseReactionsApi(client: ApiClient): AdverseReactionsApi {
  return new AdverseReactionsApi(client);
}
