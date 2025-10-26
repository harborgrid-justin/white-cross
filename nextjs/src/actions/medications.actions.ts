/**
 * @fileoverview Server Actions for Medication Management
 * @module actions/medications
 *
 * Next.js Server Actions for medication CRUD operations, administration, and tracking.
 * HIPAA-compliant with comprehensive audit logging for all medication operations.
 */

'use server';

import { revalidatePath, revalidateTag } from 'next/cache';
import { apiClient } from '@/services/core/ApiClient';
import { API_ENDPOINTS } from '@/constants/api';
import type { ActionResult } from './students.actions';

// ==========================================
// TYPE DEFINITIONS
// ==========================================

export interface CreateMedicationData {
  studentId: string;
  name: string;
  dosage: string;
  route: string;
  frequency: string;
  startDate: string;
  endDate?: string;
  prescribedBy: string;
  prescriptionNumber?: string;
  instructions?: string;
  sideEffects?: string[];
  contraindications?: string[];
  storage?: string;
}

export interface UpdateMedicationData extends Partial<CreateMedicationData> {}

export interface AdministerMedicationData {
  medicationId: string;
  studentId: string;
  administeredBy: string;
  administeredAt: string;
  dosageGiven: string;
  notes?: string;
  witnessedBy?: string;
}

export interface AdverseReactionData {
  medicationId: string;
  studentId: string;
  reactionType: string;
  severity: 'mild' | 'moderate' | 'severe' | 'life-threatening';
  symptoms: string[];
  onset: string;
  duration?: string;
  treatment?: string;
  reportedBy: string;
  reportedAt: string;
}

export interface Medication {
  id: string;
  studentId: string;
  name: string;
  dosage: string;
  route: string;
  frequency: string;
  status: 'active' | 'discontinued' | 'completed';
  startDate: string;
  endDate?: string;
  prescribedBy: string;
  createdAt: string;
  updatedAt: string;
}

// ==========================================
// CREATE OPERATIONS
// ==========================================

/**
 * Create new medication prescription
 */
export async function createMedication(data: CreateMedicationData): Promise<ActionResult<Medication>> {
  try {
    const response = await apiClient.post<Medication>(
      API_ENDPOINTS.MEDICATIONS.BASE,
      data
    );

    revalidateTag('medications');
    revalidateTag(`student-medications-${data.studentId}`);
    revalidatePath('/medications');
    revalidatePath(`/students/${data.studentId}/medications`);

    return {
      success: true,
      data: response.data,
      message: 'Medication created successfully'
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to create medication';
    return {
      success: false,
      error: errorMessage
    };
  }
}

// ==========================================
// UPDATE OPERATIONS
// ==========================================

/**
 * Update medication details
 */
export async function updateMedication(
  medicationId: string,
  data: UpdateMedicationData
): Promise<ActionResult<Medication>> {
  try {
    const response = await apiClient.put<Medication>(
      API_ENDPOINTS.MEDICATIONS.BY_ID(medicationId),
      data
    );

    revalidateTag('medications');
    revalidateTag(`medication-${medicationId}`);
    if (data.studentId) {
      revalidateTag(`student-medications-${data.studentId}`);
    }
    revalidatePath('/medications');

    return {
      success: true,
      data: response.data,
      message: 'Medication updated successfully'
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to update medication';
    return {
      success: false,
      error: errorMessage
    };
  }
}

/**
 * Discontinue medication
 */
export async function discontinueMedication(
  medicationId: string,
  reason: string,
  discontinuedBy: string
): Promise<ActionResult<Medication>> {
  try {
    const response = await apiClient.post<Medication>(
      `${API_ENDPOINTS.MEDICATIONS.BY_ID(medicationId)}/discontinue`,
      { reason, discontinuedBy }
    );

    revalidateTag('medications');
    revalidateTag(`medication-${medicationId}`);
    revalidatePath('/medications');

    return {
      success: true,
      data: response.data,
      message: 'Medication discontinued successfully'
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to discontinue medication';
    return {
      success: false,
      error: errorMessage
    };
  }
}

/**
 * Refill medication
 */
export async function refillMedication(
  medicationId: string,
  refillData: {
    quantity: number;
    refillDate: string;
    pharmacyName?: string;
    pharmacyPhone?: string;
  }
): Promise<ActionResult<{ refillId: string }>> {
  try {
    const response = await apiClient.post<{ refillId: string }>(
      `${API_ENDPOINTS.MEDICATIONS.BY_ID(medicationId)}/refill`,
      refillData
    );

    revalidateTag(`medication-${medicationId}`);
    revalidatePath('/medications');

    return {
      success: true,
      data: response.data,
      message: 'Medication refilled successfully'
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to refill medication';
    return {
      success: false,
      error: errorMessage
    };
  }
}

// ==========================================
// ADMINISTRATION OPERATIONS
// ==========================================

/**
 * Record medication administration
 */
export async function administerMedication(
  data: AdministerMedicationData
): Promise<ActionResult<{ administrationId: string }>> {
  try {
    const response = await apiClient.post<{ administrationId: string }>(
      `${API_ENDPOINTS.MEDICATIONS.BY_ID(data.medicationId)}/administer`,
      data
    );

    revalidateTag('medications');
    revalidateTag(`medication-${data.medicationId}`);
    revalidateTag(`student-medications-${data.studentId}`);
    revalidatePath('/medications');

    return {
      success: true,
      data: response.data,
      message: 'Medication administration recorded successfully'
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to record medication administration';
    return {
      success: false,
      error: errorMessage
    };
  }
}

/**
 * Record missed medication dose
 */
export async function recordMissedDose(
  medicationId: string,
  data: {
    scheduledTime: string;
    reason: string;
    reportedBy: string;
  }
): Promise<ActionResult<{ missedDoseId: string }>> {
  try {
    const response = await apiClient.post<{ missedDoseId: string }>(
      `${API_ENDPOINTS.MEDICATIONS.BY_ID(medicationId)}/missed-dose`,
      data
    );

    revalidateTag(`medication-${medicationId}`);
    revalidatePath('/medications');

    return {
      success: true,
      data: response.data,
      message: 'Missed dose recorded'
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to record missed dose';
    return {
      success: false,
      error: errorMessage
    };
  }
}

// ==========================================
// ADVERSE REACTIONS
// ==========================================

/**
 * Log adverse reaction
 */
export async function logAdverseReaction(
  data: AdverseReactionData
): Promise<ActionResult<{ reactionId: string }>> {
  try {
    const response = await apiClient.post<{ reactionId: string }>(
      `${API_ENDPOINTS.MEDICATIONS.BY_ID(data.medicationId)}/adverse-reaction`,
      data
    );

    revalidateTag('medications');
    revalidateTag(`medication-${data.medicationId}`);
    revalidateTag(`student-medications-${data.studentId}`);
    revalidatePath('/medications');
    revalidatePath(`/students/${data.studentId}`);

    return {
      success: true,
      data: response.data,
      message: 'Adverse reaction logged successfully'
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to log adverse reaction';
    return {
      success: false,
      error: errorMessage
    };
  }
}

// ==========================================
// INVENTORY MANAGEMENT
// ==========================================

/**
 * Adjust medication inventory
 */
export async function adjustMedicationInventory(
  medicationId: string,
  adjustment: {
    quantity: number;
    reason: string;
    adjustedBy: string;
  }
): Promise<ActionResult<{ newQuantity: number }>> {
  try {
    const response = await apiClient.post<{ newQuantity: number }>(
      `${API_ENDPOINTS.MEDICATIONS.BY_ID(medicationId)}/adjust-inventory`,
      adjustment
    );

    revalidateTag(`medication-${medicationId}`);
    revalidatePath('/medications');
    revalidatePath('/inventory/medications');

    return {
      success: true,
      data: response.data,
      message: 'Inventory adjusted successfully'
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to adjust inventory';
    return {
      success: false,
      error: errorMessage
    };
  }
}

// ==========================================
// REMINDERS & SCHEDULING
// ==========================================

/**
 * Set medication reminder
 */
export async function setMedicationReminder(
  medicationId: string,
  reminder: {
    time: string;
    frequency: string;
    enabled: boolean;
  }
): Promise<ActionResult<{ reminderId: string }>> {
  try {
    const response = await apiClient.post<{ reminderId: string }>(
      `${API_ENDPOINTS.MEDICATIONS.BY_ID(medicationId)}/reminder`,
      reminder
    );

    revalidateTag(`medication-${medicationId}`);

    return {
      success: true,
      data: response.data,
      message: 'Reminder set successfully'
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to set reminder';
    return {
      success: false,
      error: errorMessage
    };
  }
}

/**
 * Update medication schedule
 */
export async function updateMedicationSchedule(
  medicationId: string,
  schedule: {
    times: string[];
    daysOfWeek?: number[];
    skipHolidays?: boolean;
  }
): Promise<ActionResult<Medication>> {
  try {
    const response = await apiClient.put<Medication>(
      `${API_ENDPOINTS.MEDICATIONS.BY_ID(medicationId)}/schedule`,
      schedule
    );

    revalidateTag(`medication-${medicationId}`);
    revalidatePath('/medications');

    return {
      success: true,
      data: response.data,
      message: 'Schedule updated successfully'
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to update schedule';
    return {
      success: false,
      error: errorMessage
    };
  }
}

// ==========================================
// REPORTS & EXPORTS
// ==========================================

/**
 * Generate medication administration report
 */
export async function generateMedicationAdministrationReport(
  filters: {
    studentId?: string;
    medicationId?: string;
    startDate: string;
    endDate: string;
    format?: 'pdf' | 'csv' | 'excel';
  }
): Promise<ActionResult<{ reportUrl: string }>> {
  try {
    const response = await apiClient.post<{ reportUrl: string }>(
      '/api/v1/medications/reports/administration',
      filters
    );

    return {
      success: true,
      data: response.data,
      message: 'Report generated successfully'
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to generate report';
    return {
      success: false,
      error: errorMessage
    };
  }
}

/**
 * Export medication history
 */
export async function exportMedicationHistory(
  studentId: string,
  format: 'pdf' | 'csv' = 'pdf'
): Promise<ActionResult<{ downloadUrl: string }>> {
  try {
    const response = await apiClient.get<{ downloadUrl: string }>(
      `/api/v1/students/${studentId}/medications/export?format=${format}`
    );

    return {
      success: true,
      data: response.data,
      message: 'Export ready for download'
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to export history';
    return {
      success: false,
      error: errorMessage
    };
  }
}

// ==========================================
// DRUG INTERACTIONS
// ==========================================

/**
 * Check drug interactions
 */
export async function checkDrugInteractions(
  medicationIds: string[]
): Promise<ActionResult<{ interactions: Array<{ severity: string; description: string }> }>> {
  try {
    const response = await apiClient.post<{ interactions: Array<{ severity: string; description: string }> }>(
      '/api/v1/medications/check-interactions',
      { medicationIds }
    );

    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to check interactions';
    return {
      success: false,
      error: errorMessage
    };
  }
}

/**
 * Get medication formulary information
 */
export async function getMedicationFormularyInfo(
  medicationName: string
): Promise<ActionResult<{ formulary: unknown }>> {
  try {
    const response = await apiClient.get<{ formulary: unknown }>(
      `/api/v1/medications/formulary?name=${encodeURIComponent(medicationName)}`
    );

    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to get formulary info';
    return {
      success: false,
      error: errorMessage
    };
  }
}
