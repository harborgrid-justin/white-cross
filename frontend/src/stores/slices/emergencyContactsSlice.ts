/**
 * Emergency Contacts Slice
 * Manages emergency contacts state
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface EmergencyContact {
  id: string;
  studentId: string;
  name: string;
  relationship: string;
  phoneNumber: string;
  isPrimary: boolean;
  canPickup: boolean;
}

interface EmergencyContactsState {
  contacts: EmergencyContact[];
  isLoading: boolean;
  error: string | null;
}

const initialState: EmergencyContactsState = {
  contacts: [],
  isLoading: false,
  error: null,
};

const emergencyContactsSlice = createSlice({
  name: 'emergencyContacts',
  initialState,
  reducers: {
    setContacts: (state, action: PayloadAction<EmergencyContact[]>) => {
      state.contacts = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export { emergencyContactsSlice };
export const emergencyContactsActions = emergencyContactsSlice.actions;
export const emergencyContactsThunks = {};
export const emergencyContactsSelectors = {
  selectAll: (state: any) => state.emergencyContacts.contacts,
  selectLoading: (state: any) => state.emergencyContacts.isLoading,
  selectError: (state: any) => state.emergencyContacts.error,
};

export const selectContactsByStudent = (studentId: string) => (state: any) =>
  state.emergencyContacts.contacts.filter((c: EmergencyContact) => c.studentId === studentId);

export const selectPrimaryContacts = (state: any) =>
  state.emergencyContacts.contacts.filter((c: EmergencyContact) => c.isPrimary);

export default emergencyContactsSlice.reducer;
