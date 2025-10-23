/**
 * Emergency Contacts Slice Stub
 * Placeholder for emergency contacts state management
 */

import { createSlice } from '@reduxjs/toolkit';

const emergencyContactsSlice = createSlice({
  name: 'emergencyContacts',
  initialState: {
    contacts: [],
    isLoading: false,
    error: null,
  },
  reducers: {},
});

export default emergencyContactsSlice.reducer;
export const emergencyContactsActions = emergencyContactsSlice.actions;
