/**
 * Appointments Slice Stub
 * Placeholder for appointments state management
 */

import { createSlice } from '@reduxjs/toolkit';

const appointmentsSlice = createSlice({
  name: 'appointments',
  initialState: {
    appointments: [],
    isLoading: false,
    error: null,
  },
  reducers: {},
});

export default appointmentsSlice.reducer;
export const appointmentsActions = appointmentsSlice.actions;
