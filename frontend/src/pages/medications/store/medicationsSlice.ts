/**
 * Medications Slice
 * 
 * Redux slice for managing student medications using the slice factory.
 * Handles CRUD operations for medication management and administration.
 */

import { createEntitySlice, EntityApiService } from '../../../stores/sliceFactory';
import { Medication } from '../../../types/api';
import { medicationsApi } from '../../../services/api';

// Medication creation data
interface CreateMedicationData {
  studentId: string;
  medicationId: string;
  dosage: string;
  frequency: string;
  route: string;
  startDate: string;
  endDate?: string;
  prescribedBy?: string;
  instructions?: string;
  sideEffects?: string;
  requiresParentConsent?: boolean;
}

// Medication update data
interface UpdateMedicationData {
  dosage?: string;
  frequency?: string;
  route?: string;
  startDate?: string;
  endDate?: string;
  prescribedBy?: string;
  instructions?: string;
  sideEffects?: string;
  isActive?: boolean;
  requiresParentConsent?: boolean;
  parentConsentDate?: string;
}

// Medication filters
interface MedicationFilters {
  studentId?: string;
  medicationId?: string;
  isActive?: boolean;
  requiresParentConsent?: boolean;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

// Create API service adapter for medications
const medicationsApiService: EntityApiService<Medication, CreateMedicationData, UpdateMedicationData> = {
  async getAll(params?: MedicationFilters) {
    const response = await medicationsApi.getAll(params);
    return {
      data: response.medications || [],
      total: response.pagination?.total,
      pagination: response.pagination,
    };
  },

  async getById(id: string) {
    const response = await medicationsApi.getById(id);
    return { data: response };
  },

  async create(data: CreateMedicationData) {
    const response = await medicationsApi.create(data as any);
    return { data: response };
  },

  async update(id: string, data: UpdateMedicationData) {
    const response = await medicationsApi.update(id, data as any);
    return { data: response };
  },

  async delete(id: string) {
    await medicationsApi.delete(id);
    return { success: true };
  },
};

// Create the medications slice using the entity factory
const medicationsSliceFactory = createEntitySlice<Medication, CreateMedicationData, UpdateMedicationData>(
  'medications',
  medicationsApiService,
  {
    enableBulkOperations: false, // Disable bulk operations for medication safety
  }
);

// Export the slice and its components
export const medicationsSlice = medicationsSliceFactory.slice;
export const medicationsReducer = medicationsSlice.reducer;
export const medicationsActions = medicationsSliceFactory.actions;
export const medicationsSelectors = medicationsSliceFactory.adapter.getSelectors((state: any) => state.medications);
export const medicationsThunks = medicationsSliceFactory.thunks;

// Export custom selectors for medication catalog
export const selectActiveMedications = (state: any): Medication[] => {
  const allMedications = medicationsSelectors.selectAll(state) as Medication[];
  // Medication catalog doesn't have isActive - all medications in catalog are assumed available
  return allMedications;
};

export const selectControlledMedications = (state: any): Medication[] => {
  const allMedications = medicationsSelectors.selectAll(state) as Medication[];
  return allMedications.filter(medication => medication.isControlled);
};

export const selectMedicationsByCategory = (state: any, category: string): Medication[] => {
  const allMedications = medicationsSelectors.selectAll(state) as Medication[];
  return allMedications.filter(medication => medication.category === category);
};

export const selectMedicationsByForm = (state: any, dosageForm: string): Medication[] => {
  const allMedications = medicationsSelectors.selectAll(state) as Medication[];
  return allMedications.filter(medication => medication.dosageForm === dosageForm);
};

export const selectMedicationsRequiringWitness = (state: any): Medication[] => {
  const allMedications = medicationsSelectors.selectAll(state) as Medication[];
  return allMedications.filter(medication => medication.requiresWitness);
};
