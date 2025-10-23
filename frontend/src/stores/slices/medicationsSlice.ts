/**
 * Medications Slice
 * Manages medications state
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Medication {
  id: string;
  studentId: string;
  name: string;
  dosage: string;
  route: string;
  frequency: string;
  active: boolean;
  expiresAt?: string;
}

interface MedicationsState {
  medications: Medication[];
  isLoading: boolean;
  error: string | null;
}

const initialState: MedicationsState = {
  medications: [],
  isLoading: false,
  error: null,
};

const medicationsSlice = createSlice({
  name: 'medications',
  initialState,
  reducers: {
    setMedications: (state, action: PayloadAction<Medication[]>) => {
      state.medications = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export { medicationsSlice };
export const medicationsActions = medicationsSlice.actions;
export const medicationsThunks = {};
export const medicationsSelectors = {
  selectAll: (state: any) => state.medications.medications,
  selectLoading: (state: any) => state.medications.isLoading,
  selectError: (state: any) => state.medications.error,
};

export const selectActiveMedications = (state: any) =>
  state.medications.medications.filter((m: Medication) => m.active);

export const selectMedicationsByStudent = (studentId: string) => (state: any) =>
  state.medications.medications.filter((m: Medication) => m.studentId === studentId);

export const selectActiveMedicationsByStudent = (studentId: string) => (state: any) =>
  state.medications.medications.filter((m: Medication) => m.studentId === studentId && m.active);

export const selectMedicationsRequiringConsent = (state: any) =>
  state.medications.medications.filter((m: Medication) => m.active);

export const selectMedicationsByRoute = (route: string) => (state: any) =>
  state.medications.medications.filter((m: Medication) => m.route === route);

export const selectExpiringMedications = (state: any) =>
  state.medications.medications.filter((m: Medication) => m.expiresAt);

export const selectMedicationsDueToday = (state: any) =>
  state.medications.medications.filter((m: Medication) => m.active);

export default medicationsSlice.reducer;
