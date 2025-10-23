/**
 * Medication API Module
 * API functions for medication operations
 */

import type { Medication, MedicationAdministration } from './types/medications';
import type { MedicationApiResponse, MedicationQueryParams, MedicationFormData } from './types/api';

/**
 * Get medication formulary
 */
export const getMedicationFormulary = async (): Promise<MedicationApiResponse<any[]>> => {
  console.warn('getMedicationFormulary() is a stub implementation');
  return {
    data: [],
    success: true,
  };
};

/**
 * Search medications
 */
export const searchMedications = async (params: MedicationQueryParams): Promise<MedicationApiResponse<Medication[]>> => {
  console.warn('searchMedications() is a stub implementation');
  return {
    data: [],
    success: true,
  };
};

/**
 * Get medication by ID
 */
export const getMedicationById = async (id: string): Promise<MedicationApiResponse<Medication>> => {
  console.warn('getMedicationById() is a stub implementation');
  throw new Error('Not implemented');
};

/**
 * Create medication
 */
export const createMedication = async (data: MedicationFormData): Promise<MedicationApiResponse<Medication>> => {
  console.warn('createMedication() is a stub implementation');
  throw new Error('Not implemented');
};

/**
 * Update medication
 */
export const updateMedication = async (id: string, data: Partial<MedicationFormData>): Promise<MedicationApiResponse<Medication>> => {
  console.warn('updateMedication() is a stub implementation');
  throw new Error('Not implemented');
};

/**
 * Delete medication
 */
export const deleteMedication = async (id: string): Promise<MedicationApiResponse<void>> => {
  console.warn('deleteMedication() is a stub implementation');
  return {
    data: undefined,
    success: true,
  };
};
