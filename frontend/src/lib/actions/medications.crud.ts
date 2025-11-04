/**
 * @fileoverview Medication CRUD Operations
 * @module app/medications/crud
 *
 * Create, Read, Update, Delete operations for medications.
 * Includes HIPAA audit logging and cache invalidation.
 */

'use server';

import { revalidateTag, revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { serverPost, serverPut, serverDelete, NextApiClientError } from '@/lib/api/nextjs-client';
import { API_ENDPOINTS } from '@/constants/api';
import { auditLog, AUDIT_ACTIONS } from '@/lib/audit';
import { CACHE_TAGS } from '@/lib/cache/constants';
import type { ApiResponse } from '@/types/core/api';
import type { Medication } from '@/types/domain/medications';
import type { ActionResult, CreateMedicationData, UpdateMedicationData } from './medications.types';

// ==========================================
// CREATE OPERATIONS
// ==========================================

/**
 * Create a new medication prescription
 * Includes HIPAA audit logging and cache invalidation
 */
export async function createMedication(data: CreateMedicationData): Promise<ActionResult<Medication>> {
  try {
    // Validate required fields
    if (!data.studentId || !data.name || !data.dosage || !data.route || !data.frequency || !data.startDate || !data.prescribedBy) {
      return {
        success: false,
        error: 'Missing required fields: studentId, name, dosage, route, frequency, startDate, prescribedBy'
      };
    }

    const response = await serverPost<ApiResponse<Medication>>(
      API_ENDPOINTS.MEDICATIONS.BASE,
      data,
      {
        cache: 'no-store',
        next: { tags: [CACHE_TAGS.MEDICATIONS, CACHE_TAGS.PHI] }
      }
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to create medication');
    }

    // HIPAA AUDIT LOG - Mandatory for PHI creation (medications are PHI)
    await auditLog({
      action: AUDIT_ACTIONS.CREATE_MEDICATION,
      resource: 'Medication',
      resourceId: response.data.id,
      details: `Created medication prescription: ${data.name} for student ${data.studentId}`,
      success: true
    });

    // Cache invalidation
    revalidateTag(CACHE_TAGS.MEDICATIONS, 'default');
    revalidateTag('medication-list', 'default');
    revalidateTag(`student-medications-${data.studentId}`, 'default');
    revalidatePath('/dashboard/medications', 'page');
    revalidatePath(`/dashboard/students/${data.studentId}/medications`, 'page');

    return {
      success: true,
      data: response.data,
      message: 'Medication created successfully'
    };
  } catch (error) {
    const errorMessage = error instanceof NextApiClientError
      ? error.message
      : error instanceof Error
      ? error.message
      : 'Failed to create medication';

    // HIPAA AUDIT LOG - Log failed attempt
    await auditLog({
      action: AUDIT_ACTIONS.CREATE_MEDICATION,
      resource: 'Medication',
      details: `Failed to create medication record: ${errorMessage}`,
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
 * Create medication from form data
 * Form-friendly wrapper for createMedication
 */
export async function createMedicationFromForm(formData: FormData): Promise<ActionResult<Medication>> {
  const medicationData: CreateMedicationData = {
    studentId: formData.get('studentId') as string,
    name: formData.get('name') as string,
    genericName: formData.get('genericName') as string || undefined,
    dosage: formData.get('dosage') as string,
    dosageForm: formData.get('dosageForm') as string || undefined,
    strength: formData.get('strength') as string || undefined,
    route: formData.get('route') as string,
    frequency: formData.get('frequency') as string,
    startDate: formData.get('startDate') as string,
    endDate: formData.get('endDate') as string || undefined,
    prescribedBy: formData.get('prescribedBy') as string,
    prescriptionNumber: formData.get('prescriptionNumber') as string || undefined,
    instructions: formData.get('instructions') as string || undefined,
    sideEffects: formData.get('sideEffects') as string || undefined,
    contraindications: formData.get('contraindications') as string || undefined,
    storage: formData.get('storage') as string || undefined,
    requiresParentConsent: formData.get('requiresParentConsent') === 'true',
    isControlledSubstance: formData.get('isControlledSubstance') === 'true',
    rxNumber: formData.get('rxNumber') as string || undefined,
    refillsRemaining: formData.get('refillsRemaining') ? parseInt(formData.get('refillsRemaining') as string) : undefined,
  };

  const result = await createMedication(medicationData);

  if (result.success && result.data) {
    redirect(`/dashboard/medications/${result.data.id}` as any);
  }

  return result;
}

// ==========================================
// UPDATE OPERATIONS
// ==========================================

/**
 * Update medication information
 * Includes HIPAA audit logging and cache invalidation
 */
export async function updateMedication(
  medicationId: string,
  data: UpdateMedicationData
): Promise<ActionResult<Medication>> {
  try {
    if (!medicationId) {
      return {
        success: false,
        error: 'Medication ID is required'
      };
    }

    const response = await serverPut<ApiResponse<Medication>>(
      API_ENDPOINTS.MEDICATIONS.BY_ID(medicationId),
      data,
      {
        cache: 'no-store',
        next: { tags: [CACHE_TAGS.MEDICATIONS, `medication-${medicationId}`, CACHE_TAGS.PHI] }
      }
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to update medication');
    }

    // HIPAA AUDIT LOG - Mandatory for PHI modification
    await auditLog({
      action: AUDIT_ACTIONS.UPDATE_MEDICATION,
      resource: 'Medication',
      resourceId: medicationId,
      details: `Updated medication record`,
      changes: data as Record<string, unknown>,
      success: true
    });

    // Cache invalidation
    revalidateTag(CACHE_TAGS.MEDICATIONS, 'default');
    revalidateTag(`medication-${medicationId}`, 'default');
    revalidateTag('medication-list', 'default');
    revalidatePath('/dashboard/medications', 'page');
    revalidatePath(`/dashboard/medications/${medicationId}`, 'page');

    return {
      success: true,
      data: response.data,
      message: 'Medication updated successfully'
    };
  } catch (error) {
    const errorMessage = error instanceof NextApiClientError
      ? error.message
      : error instanceof Error
      ? error.message
      : 'Failed to update medication';

    // HIPAA AUDIT LOG - Log failed attempt
    await auditLog({
      action: AUDIT_ACTIONS.UPDATE_MEDICATION,
      resource: 'Medication',
      resourceId: medicationId,
      details: `Failed to update medication record: ${errorMessage}`,
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
 * Update medication from form data
 * Form-friendly wrapper for updateMedication
 */
export async function updateMedicationFromForm(
  medicationId: string,
  formData: FormData
): Promise<ActionResult<Medication>> {
  const medicationData: UpdateMedicationData = {
    name: formData.get('name') as string || undefined,
    genericName: formData.get('genericName') as string || undefined,
    dosage: formData.get('dosage') as string || undefined,
    dosageForm: formData.get('dosageForm') as string || undefined,
    strength: formData.get('strength') as string || undefined,
    route: formData.get('route') as string || undefined,
    frequency: formData.get('frequency') as string || undefined,
    startDate: formData.get('startDate') as string || undefined,
    endDate: formData.get('endDate') as string || undefined,
    prescribedBy: formData.get('prescribedBy') as string || undefined,
    prescriptionNumber: formData.get('prescriptionNumber') as string || undefined,
    instructions: formData.get('instructions') as string || undefined,
    sideEffects: formData.get('sideEffects') as string || undefined,
    contraindications: formData.get('contraindications') as string || undefined,
    storage: formData.get('storage') as string || undefined,
    requiresParentConsent: formData.has('requiresParentConsent') ? formData.get('requiresParentConsent') === 'true' : undefined,
    isControlledSubstance: formData.has('isControlledSubstance') ? formData.get('isControlledSubstance') === 'true' : undefined,
    rxNumber: formData.get('rxNumber') as string || undefined,
    refillsRemaining: formData.get('refillsRemaining') ? parseInt(formData.get('refillsRemaining') as string) : undefined,
  };

  // Filter out undefined values
  const filteredData = Object.entries(medicationData).reduce((acc, [key, value]) => {
    if (value !== undefined) {
      acc[key as keyof UpdateMedicationData] = value;
    }
    return acc;
  }, {} as UpdateMedicationData);

  const result = await updateMedication(medicationId, filteredData);

  if (result.success && result.data) {
    redirect(`/dashboard/medications/${result.data.id}` as any);
  }

  return result;
}

// ==========================================
// DELETE OPERATIONS
// ==========================================

/**
 * Delete medication (discontinue)
 * Includes HIPAA audit logging and cache invalidation
 */
export async function deleteMedication(medicationId: string): Promise<ActionResult<void>> {
  try {
    if (!medicationId) {
      return {
        success: false,
        error: 'Medication ID is required'
      };
    }

    await serverDelete<ApiResponse<void>>(
      API_ENDPOINTS.MEDICATIONS.BY_ID(medicationId),
      {
        cache: 'no-store',
        next: { tags: [CACHE_TAGS.MEDICATIONS, `medication-${medicationId}`, CACHE_TAGS.PHI] }
      }
    );

    // HIPAA AUDIT LOG - Mandatory for PHI deletion
    await auditLog({
      action: AUDIT_ACTIONS.DELETE_MEDICATION,
      resource: 'Medication',
      resourceId: medicationId,
      details: `Deleted/discontinued medication record`,
      success: true
    });

    // Cache invalidation
    revalidateTag(CACHE_TAGS.MEDICATIONS, 'default');
    revalidateTag(`medication-${medicationId}`, 'default');
    revalidateTag('medication-list', 'default');
    revalidatePath('/dashboard/medications', 'page');

    return {
      success: true,
      message: 'Medication deleted successfully'
    };
  } catch (error) {
    const errorMessage = error instanceof NextApiClientError
      ? error.message
      : error instanceof Error
      ? error.message
      : 'Failed to delete medication';

    // HIPAA AUDIT LOG - Log failed attempt
    await auditLog({
      action: AUDIT_ACTIONS.DELETE_MEDICATION,
      resource: 'Medication',
      resourceId: medicationId,
      details: `Failed to delete medication record: ${errorMessage}`,
      success: false,
      errorMessage
    });

    return {
      success: false,
      error: errorMessage
    };
  }
}
