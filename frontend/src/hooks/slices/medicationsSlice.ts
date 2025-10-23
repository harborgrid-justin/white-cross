/**
 * Medications Slice Stub
 * Placeholder for medications state management
 */

import { createSlice } from '@reduxjs/toolkit';

const medicationsSlice = createSlice({
  name: 'medications',
  initialState: {
    medications: [],
    isLoading: false,
    error: null,
  },
  reducers: {},
});

export default medicationsSlice.reducer;
export const medicationsActions = medicationsSlice.actions;
