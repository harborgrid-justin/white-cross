/**
 * Medications Page Type Definitions
 *
 * Page-specific types for the medications module
 */

/**
 * Tab type for medication management sections
 */
export type MedicationTab = 'overview' | 'medications' | 'inventory' | 'reminders' | 'adverse-reactions';

/**
 * Filter form state interface for medication filters
 */
export interface MedicationFilters {
  searchTerm: string;
  dosageForm: string;
  controlledStatus: string;
}

/**
 * Medication form data for creating/editing medications
 */
export interface MedicationFormData {
  name: string;
  genericName: string;
  dosageForm: string;
  strength: string;
  manufacturer: string;
  ndc: string;
  isControlled: boolean;
}

/**
 * Form validation errors
 */
export interface MedicationFormErrors {
  name?: string;
  genericName?: string;
  dosageForm?: string;
  strength?: string;
  manufacturer?: string;
  ndc?: string;
}

/**
 * Medication data structure
 */
export interface Medication {
  id: string;
  name: string;
  genericName: string;
  dosageForm: string;
  strength: string;
  manufacturer: string;
  ndc: string;
  isControlled: boolean;
  _count?: {
    studentMedications?: number;
  };
}

/**
 * Props for medication modal components
 */
export interface MedicationModalProps {
  show: boolean;
  onClose: () => void;
}
