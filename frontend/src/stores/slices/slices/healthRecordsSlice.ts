/**
 * Health Records Slice Stub
 * Placeholder for health records state management
 */

import { createSlice } from '@reduxjs/toolkit';

const healthRecordsSlice = createSlice({
  name: 'healthRecords',
  initialState: {
    records: [],
    isLoading: false,
    error: null,
  },
  reducers: {},
});

export default healthRecordsSlice.reducer;
export const healthRecordsActions = healthRecordsSlice.actions;
