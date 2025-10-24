/**
 * Medication API Types
 * Type definitions for medication API interactions
 */

export interface MedicationApiResponse<T = any> {
  data: T;
  success: boolean;
  message?: string;
  errors?: string[];
}

export interface MedicationQueryParams {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: string;
  studentId?: string;
}

export interface MedicationFormData {
  name: string;
  dosageForm?: string;
  strength?: string;
  genericName?: string;
  manufacturer?: string;
  dosage?: string;
  frequency?: string;
  studentId?: string;
  startDate?: string;
  endDate?: string;
  notes?: string;
}
