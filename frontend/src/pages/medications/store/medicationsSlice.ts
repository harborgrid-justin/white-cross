/**
 * Medications Slice
 * 
 * Redux slice for managing student medications using the slice factory.
 * Handles CRUD operations for medication management and administration.
 */

import { createEntitySlice, EntityApiService } from '../../../stores/sliceFactory';
import { StudentMedication } from '../../../types/student.types';
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
const medicationsApiService: EntityApiService<StudentMedication, CreateMedicationData, UpdateMedicationData> = {
  async getAll(params?: MedicationFilters) {
    const response = await medicationsApi.getAll(params);
    return {
      data: response.data?.medications || [],
      total: response.data?.pagination?.total,
      pagination: response.data?.pagination,
    };
  },

  async getById(id: string) {
    const response = await medicationsApi.getById(id);
    return { data: response.data };
  },

  async create(data: CreateMedicationData) {
    const response = await medicationsApi.create(data);
    return { data: response.data };
  },

  async update(id: string, data: UpdateMedicationData) {
    const response = await medicationsApi.update(id, data);
    return { data: response.data };
  },

  async delete(id: string) {
    await medicationsApi.delete(id);
    return { success: true };
  },
};

// Create the medications slice using the entity factory
const medicationsSliceFactory = createEntitySlice<StudentMedication, CreateMedicationData, UpdateMedicationData>(
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

// Export custom selectors
export const selectMedicationsByStudent = (state: any, studentId: string): StudentMedication[] => {
  const allMedications = medicationsSelectors.selectAll(state) as StudentMedication[];
  return allMedications.filter(medication => medication.studentId === studentId);
};

export const selectActiveMedications = (state: any): StudentMedication[] => {
  const allMedications = medicationsSelectors.selectAll(state) as StudentMedication[];
  return allMedications.filter(medication => medication.isActive);
};

export const selectActiveMedicationsByStudent = (state: any, studentId: string): StudentMedication[] => {
  const allMedications = medicationsSelectors.selectAll(state) as StudentMedication[];
  return allMedications.filter(medication => 
    medication.studentId === studentId && medication.isActive
  );
};

export const selectMedicationsRequiringConsent = (state: any): StudentMedication[] => {
  const allMedications = medicationsSelectors.selectAll(state) as StudentMedication[];
  return allMedications.filter(medication => 
    medication.requiresParentConsent && !medication.parentConsentDate
  );
};

export const selectMedicationsByRoute = (state: any, route: string): StudentMedication[] => {
  const allMedications = medicationsSelectors.selectAll(state) as StudentMedication[];
  return allMedications.filter(medication => medication.route === route);
};

export const selectExpiringMedications = (state: any, days: number = 30): StudentMedication[] => {
  const allMedications = medicationsSelectors.selectAll(state) as StudentMedication[];
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() + days);
  
  return allMedications.filter(medication => {
    if (!medication.endDate || !medication.isActive) return false;
    const endDate = new Date(medication.endDate);
    return endDate <= cutoffDate;
  }).sort((a, b) => new Date(a.endDate!).getTime() - new Date(b.endDate!).getTime());
};
