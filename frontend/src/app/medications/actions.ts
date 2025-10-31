/**
 * @fileoverview Medication Management Server Actions - Next.js v14+ Compatible
 * @module app/medications/actions
 *
 * HIPAA-compliant server actions for medication data management with comprehensive
 * caching, audit logging, and error handling.
 *
 * Features:
 * - Server actions with proper 'use server' directive
 * - Next.js cache integration with revalidateTag/revalidatePath
 * - HIPAA audit logging for all PHI operations (medications are PHI)
 * - Type-safe CRUD operations
 * - Form data handling for UI integration
 * - Comprehensive error handling and validation
 * - Medication administration tracking
 */

'use server';

import { cache } from 'react';
import { revalidateTag, revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

// Core API integrations
import { serverGet, serverPost, serverPut, serverDelete, NextApiClientError } from '@/lib/api/nextjs-client';
import { API_ENDPOINTS } from '@/constants/api';
import { auditLog, AUDIT_ACTIONS } from '@/lib/audit';
import { CACHE_TAGS, CACHE_TTL } from '@/lib/cache/constants';

// Types
import type { ApiResponse } from '@/types/api';
import type { Medication } from '@/types/medications';

// Utils
import { formatDate } from '@/utils/dateUtils';
import { validateEmail, validatePhone } from '@/utils/validation/userValidation';
import { generateId } from '@/utils/generators';
import { formatName, formatPhone } from '@/utils/formatters';

// ==========================================
// TYPE DEFINITIONS
// ==========================================

export interface ActionResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface CreateMedicationData {
  studentId: string;
  name: string;
  genericName?: string;
  dosage: string;
  dosageForm?: string;
  strength?: string;
  route: string;
  frequency: string;
  startDate: string;
  endDate?: string;
  prescribedBy: string;
  prescriptionNumber?: string;
  instructions?: string;
  sideEffects?: string;
  contraindications?: string;
  storage?: string;
  requiresParentConsent?: boolean;
  isControlledSubstance?: boolean;
  rxNumber?: string;
  refillsRemaining?: number;
}

export interface UpdateMedicationData {
  name?: string;
  genericName?: string;
  dosage?: string;
  dosageForm?: string;
  strength?: string;
  route?: string;
  frequency?: string;
  startDate?: string;
  endDate?: string;
  prescribedBy?: string;
  prescriptionNumber?: string;
  instructions?: string;
  sideEffects?: string;
  contraindications?: string;
  storage?: string;
  requiresParentConsent?: boolean;
  isControlledSubstance?: boolean;
  rxNumber?: string;
  refillsRemaining?: number;
  isActive?: boolean;
}

export interface AdministerMedicationData {
  medicationId: string;
  studentId: string;
  administeredBy: string;
  administeredAt: string;
  dosageGiven: string;
  notes?: string;
  witnessedBy?: string;
  method?: string;
  location?: string;
}

export interface MedicationFilters {
  studentId?: string;
  status?: 'active' | 'inactive' | 'discontinued';
  name?: string;
  prescribedBy?: string;
  isControlledSubstance?: boolean;
  requiresParentConsent?: boolean;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export interface MedicationLog {
  id: string;
  medicationId: string;
  studentId: string;
  administeredAt: string;
  administeredBy: string;
  dosageGiven: string;
  notes?: string;
  witnessedBy?: string;
  method?: string;
  location?: string;
  createdAt: string;
}

export interface PaginatedMedicationsResponse {
  medications: Medication[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  total: number;
}

// ==========================================
// CACHED DATA FUNCTIONS
// ==========================================

/**
 * Get medication by ID with caching
 * Uses Next.js cache() for automatic memoization
 */
export const getMedication = cache(async (id: string): Promise<Medication | null> => {
  try {
    const response = await serverGet<ApiResponse<Medication>>(
      API_ENDPOINTS.MEDICATIONS.BY_ID(id),
      undefined,
      {
        cache: 'force-cache',
        next: { 
          revalidate: CACHE_TTL.PHI_STANDARD,
          tags: [`medication-${id}`, CACHE_TAGS.MEDICATIONS, CACHE_TAGS.PHI] 
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('Failed to get medication:', error);
    return null;
  }
});

/**
 * Get all medications with caching
 * Uses shorter TTL for frequently updated data
 */
export const getMedications = cache(async (filters?: MedicationFilters): Promise<Medication[]> => {
  try {
    const response = await serverGet<ApiResponse<Medication[]>>(
      API_ENDPOINTS.MEDICATIONS.BASE,
      filters as Record<string, string | number | boolean>,
      {
        cache: 'force-cache',
        next: { 
          revalidate: CACHE_TTL.PHI_STANDARD,
          tags: [CACHE_TAGS.MEDICATIONS, 'medication-list', CACHE_TAGS.PHI] 
        }
      }
    );

    return response.data || [];
  } catch (error) {
    console.error('Failed to get medications:', error);
    return [];
  }
});

/**
 * Get medications for a specific student
 */
export const getStudentMedications = cache(async (studentId: string): Promise<Medication[]> => {
  try {
    const response = await serverGet<ApiResponse<Medication[]>>(
      API_ENDPOINTS.MEDICATIONS.BY_STUDENT(studentId),
      undefined,
      {
        cache: 'force-cache',
        next: { 
          revalidate: CACHE_TTL.PHI_FREQUENT, // More frequent updates for active medications
          tags: [`student-medications-${studentId}`, CACHE_TAGS.MEDICATIONS, CACHE_TAGS.PHI] 
        }
      }
    );

    return response.data || [];
  } catch (error) {
    console.error('Failed to get student medications:', error);
    return [];
  }
});

/**
 * Get due medications (requiring administration)
 */
export const getDueMedications = cache(async (): Promise<Medication[]> => {
  try {
    const response = await serverGet<ApiResponse<Medication[]>>(
      API_ENDPOINTS.MEDICATIONS.DUE,
      undefined,
      {
        cache: 'force-cache',
        next: { 
          revalidate: CACHE_TTL.PHI_FREQUENT, // Short TTL for time-sensitive data
          tags: ['due-medications', CACHE_TAGS.MEDICATIONS, CACHE_TAGS.PHI] 
        }
      }
    );

    return response.data || [];
  } catch (error) {
    console.error('Failed to get due medications:', error);
    return [];
  }
});

/**
 * Get paginated medications
 */
export const getPaginatedMedications = cache(async (
  page: number = 1,
  limit: number = 20,
  filters?: MedicationFilters
): Promise<PaginatedMedicationsResponse | null> => {
  try {
    const params = {
      page: page.toString(),
      limit: limit.toString(),
      ...filters
    };

    const response = await serverGet<ApiResponse<PaginatedMedicationsResponse>>(
      API_ENDPOINTS.MEDICATIONS.BASE,
      params as Record<string, string | number | boolean>,
      {
        cache: 'force-cache',
        next: { 
          revalidate: CACHE_TTL.PHI_STANDARD,
          tags: [CACHE_TAGS.MEDICATIONS, 'medication-list', CACHE_TAGS.PHI] 
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('Failed to get paginated medications:', error);
    return null;
  }
});

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
    revalidateTag(CACHE_TAGS.MEDICATIONS);
    revalidateTag('medication-list');
    revalidateTag(`student-medications-${data.studentId}`);
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
      changes: data,
      success: true
    });

    // Cache invalidation
    revalidateTag(CACHE_TAGS.MEDICATIONS);
    revalidateTag(`medication-${medicationId}`);
    revalidateTag('medication-list');
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
    revalidateTag(CACHE_TAGS.MEDICATIONS);
    revalidateTag(`medication-${data.medicationId}`);
    revalidateTag(`student-medications-${data.studentId}`);
    revalidateTag('due-medications');
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
    revalidateTag(CACHE_TAGS.MEDICATIONS);
    revalidateTag(`medication-${medicationId}`);
    revalidateTag('medication-list');
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

// ==========================================
// SPECIALIZED OPERATIONS
// ==========================================

/**
 * Discontinue medication (soft delete with reason)
 */
export async function discontinueMedication(
  medicationId: string,
  reason?: string
): Promise<ActionResult<Medication>> {
  try {
    const response = await serverPost<ApiResponse<Medication>>(
      API_ENDPOINTS.MEDICATIONS.DISCONTINUE(medicationId),
      { reason },
      {
        cache: 'no-store',
        next: { tags: [CACHE_TAGS.MEDICATIONS, `medication-${medicationId}`, CACHE_TAGS.PHI] }
      }
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to discontinue medication');
    }

    await auditLog({
      action: AUDIT_ACTIONS.UPDATE_MEDICATION,
      resource: 'Medication',
      resourceId: medicationId,
      details: `Discontinued medication${reason ? ` - Reason: ${reason}` : ''}`,
      changes: { isActive: false, discontinuedReason: reason },
      success: true
    });

    revalidateTag(CACHE_TAGS.MEDICATIONS);
    revalidateTag(`medication-${medicationId}`);
    revalidatePath('/dashboard/medications', 'page');
    revalidatePath(`/dashboard/medications/${medicationId}`, 'page');

    return {
      success: true,
      data: response.data,
      message: 'Medication discontinued successfully'
    };
  } catch (error) {
    const errorMessage = error instanceof NextApiClientError
      ? error.message
      : error instanceof Error
      ? error.message
      : 'Failed to discontinue medication';

    await auditLog({
      action: AUDIT_ACTIONS.UPDATE_MEDICATION,
      resource: 'Medication',
      resourceId: medicationId,
      details: `Failed to discontinue medication: ${errorMessage}`,
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
 * Request medication refill
 */
export async function requestMedicationRefill(
  medicationId: string,
  requestedBy: string,
  notes?: string
): Promise<ActionResult<{ refillRequestId: string }>> {
  try {
    const response = await serverPost<ApiResponse<{ refillRequestId: string }>>(
      API_ENDPOINTS.MEDICATIONS.REFILL(medicationId),
      { requestedBy, notes },
      {
        cache: 'no-store',
        next: { tags: [CACHE_TAGS.MEDICATIONS, `medication-${medicationId}`, CACHE_TAGS.PHI] }
      }
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to request medication refill');
    }

    await auditLog({
      action: AUDIT_ACTIONS.UPDATE_MEDICATION,
      resource: 'Medication',
      resourceId: medicationId,
      details: `Requested medication refill by ${requestedBy}`,
      success: true
    });

    revalidateTag(CACHE_TAGS.MEDICATIONS);
    revalidateTag(`medication-${medicationId}`);
    revalidatePath('/dashboard/medications', 'page');

    return {
      success: true,
      data: response.data,
      message: 'Medication refill requested successfully'
    };
  } catch (error) {
    const errorMessage = error instanceof NextApiClientError
      ? error.message
      : error instanceof Error
      ? error.message
      : 'Failed to request medication refill';

    return {
      success: false,
      error: errorMessage
    };
  }
}

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

/**
 * Check if medication exists
 */
export async function medicationExists(medicationId: string): Promise<boolean> {
  const medication = await getMedication(medicationId);
  return medication !== null;
}

/**
 * Get medication count
 */
export async function getMedicationCount(filters?: MedicationFilters): Promise<number> {
  try {
    const medications = await getMedications(filters);
    return medications.length;
  } catch {
    return 0;
  }
}

/**
 * Get overdue medications
 */
export async function getOverdueMedications(): Promise<Medication[]> {
  try {
    const response = await serverGet<ApiResponse<Medication[]>>(
      API_ENDPOINTS.MEDICATIONS.OVERDUE,
      undefined,
      {
        cache: 'force-cache',
        next: { 
          revalidate: CACHE_TTL.PHI_FREQUENT,
          tags: ['overdue-medications', CACHE_TAGS.MEDICATIONS, CACHE_TAGS.PHI] 
        }
      }
    );

    return response.data || [];
  } catch (error) {
    console.error('Failed to get overdue medications:', error);
    return [];
  }
}

/**
 * Clear medication cache
 */
export async function clearMedicationCache(medicationId?: string): Promise<void> {
  if (medicationId) {
    revalidateTag(`medication-${medicationId}`);
  }
  revalidateTag(CACHE_TAGS.MEDICATIONS);
  revalidateTag('medication-list');
  revalidateTag('due-medications');
  revalidateTag('overdue-medications');
  revalidatePath('/dashboard/medications', 'page');
}

/**
 * Get medication administration history
 */
export const getMedicationHistory = cache(async (medicationId: string): Promise<MedicationLog[]> => {
  try {
    const response = await serverGet<ApiResponse<MedicationLog[]>>(
      `${API_ENDPOINTS.MEDICATIONS.BY_ID(medicationId)}/history`,
      undefined,
      {
        cache: 'force-cache',
        next: { 
          revalidate: CACHE_TTL.PHI_STANDARD,
          tags: [`medication-history-${medicationId}`, CACHE_TAGS.MEDICATIONS, CACHE_TAGS.PHI] 
        }
      }
    );

    return response.data || [];
  } catch (error) {
    console.error('Failed to get medication history:', error);
    return [];
  }
});
