/**
 * Medication Domain Types
 * Type definitions for medication domain objects
 */

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  studentId: string;
  startDate: string;
  endDate?: string;
  status: 'active' | 'paused' | 'completed';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MedicationAdministration {
  id: string;
  medicationId: string;
  studentId: string;
  administeredAt: string;
  administeredBy: string;
  dosageGiven: string;
  notes?: string;
}

export interface MedicationFormState {
  name: string;
  dosage: string;
  frequency: string;
  studentId: string;
  startDate: string;
  endDate?: string;
  notes?: string;
}

export interface MedicationValidationErrors {
  name?: string;
  dosage?: string;
  frequency?: string;
  studentId?: string;
  startDate?: string;
  endDate?: string;
}

/**
 * Generic form errors type for validation
 */
export interface FormErrors {
  [key: string]: string;
}

/**
 * Inventory form data for medication stock management
 */
export interface InventoryFormData {
  medicationId: string;
  batchNumber: string;
  quantity: number;
  reorderLevel: number;
  expirationDate: string;
  supplier?: string;
}

/**
 * Adverse reaction form data for safety reporting
 */
export interface AdverseReactionFormData {
  studentId: string;
  medicationId: string;
  severity: 'mild' | 'moderate' | 'severe';
  description: string;
  actionsTaken: string;
  occurredAt: string;
}

/**
 * Return type for form validation hook
 */
export interface UseFormValidationReturn {
  errors: FormErrors;
  validateMedicationForm: (data: any) => FormErrors;
  validateAdverseReactionForm: (data: AdverseReactionFormData) => FormErrors;
  validateInventoryForm: (data: InventoryFormData) => FormErrors;
  clearErrors: () => void;
  setFieldError: (field: string, error: string) => void;
  displayValidationErrors: (validationErrors: FormErrors, prefix?: string) => void;
}

/**
 * Return type for toast notification hook
 */
export interface UseToastReturn {
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
  showWarning: (message: string) => void;
  showInfo: (message: string) => void;
}
