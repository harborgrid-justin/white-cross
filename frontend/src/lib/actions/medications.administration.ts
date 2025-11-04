/**
 * @fileoverview Medication Administration Operations
 * @module app/medications/administration
 *
 * Functions for recording and tracking medication administration.
 * Critical for medication safety and HIPAA compliance.
 */

'use server';

import { revalidateTag, revalidatePath } from 'next/cache';
import { serverPost, NextApiClientError } from '@/lib/api/nextjs-client';
import { API_ENDPOINTS } from '@/constants/api';
import { auditLog, AUDIT_ACTIONS } from '@/lib/audit';
import { CACHE_TAGS } from '@/lib/cache/constants';
import type { ApiResponse } from '@/types/core/api';
import type { ActionResult, AdministerMedicationData, MedicationLog } from './medications.types';

// ==========================================
// ADMINISTRATION OPERATIONS
// ==========================================

/**
 * Record medication administration
 * Critical for medication tracking and compliance
 */
export async function administerMedication(
  data: AdministerMedicationData
): Promise<ActionResult<MedicationLog>> {
  try {
    if (!data.medicationId || !data.studentId || !data.administeredBy || !data.administeredAt || !data.dosageGiven) {
      return {
        success: false,
        error: 'Missing required fields: medicationId, studentId, administeredBy, administeredAt, dosageGiven'
      };
    }

    const response = await serverPost<ApiResponse<MedicationLog>>(
      API_ENDPOINTS.MEDICATIONS.ADMINISTER(data.medicationId),
      data,
      {
        cache: 'no-store',
        next: { tags: [CACHE_TAGS.MEDICATIONS, `medication-${data.medicationId}`, CACHE_TAGS.PHI] }
      }
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to record medication administration');
    }

    // HIPAA AUDIT LOG - Mandatory for medication administration (critical PHI event)
    await auditLog({
      action: AUDIT_ACTIONS.ADMINISTER_MEDICATION,
      resource: 'Medication',
      resourceId: data.medicationId,
      details: `Administered medication to student ${data.studentId} by ${data.administeredBy} - Dosage: ${data.dosageGiven}`,
      success: true
    });

    // Cache invalidation
    revalidateTag(CACHE_TAGS.MEDICATIONS, 'default');
    revalidateTag(`medication-${data.medicationId}`, 'default');
    revalidateTag(`student-medications-${data.studentId}`, 'default');
    revalidateTag('due-medications', 'default');
    revalidatePath('/dashboard/medications', 'page');
    revalidatePath(`/dashboard/medications/${data.medicationId}`, 'page');
    revalidatePath(`/dashboard/students/${data.studentId}/medications`, 'page');

    return {
      success: true,
      data: response.data,
      message: 'Medication administration recorded successfully'
    };
  } catch (error) {
    const errorMessage = error instanceof NextApiClientError
      ? error.message
      : error instanceof Error
      ? error.message
      : 'Failed to record medication administration';

    // HIPAA AUDIT LOG - Log failed attempt (critical for medication safety)
    await auditLog({
      action: AUDIT_ACTIONS.ADMINISTER_MEDICATION,
      resource: 'Medication',
      resourceId: data.medicationId,
      details: `Failed to record medication administration: ${errorMessage}`,
      success: false,
      errorMessage
    });

    return {
      success: false,
      error: errorMessage
    };
  }
}

/**
 * Record medication administration from form data
 */
export async function administerMedicationFromForm(formData: FormData): Promise<ActionResult<MedicationLog>> {
  const administrationData: AdministerMedicationData = {
    medicationId: formData.get('medicationId') as string,
    studentId: formData.get('studentId') as string,
    administeredBy: formData.get('administeredBy') as string,
    administeredAt: formData.get('administeredAt') as string || new Date().toISOString(),
    dosageGiven: formData.get('dosageGiven') as string,
    notes: formData.get('notes') as string || undefined,
    witnessedBy: formData.get('witnessedBy') as string || undefined,
    method: formData.get('method') as string || undefined,
    location: formData.get('location') as string || undefined,
  };

  return await administerMedication(administrationData);
}
