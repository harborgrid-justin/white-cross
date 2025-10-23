/**
 * Health Records Slice
 * Manages health records state
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface HealthRecord {
  id: string;
  studentId: string;
  type: string;
  date: string;
  data: any;
}

interface HealthRecordsState {
  records: HealthRecord[];
  isLoading: boolean;
  error: string | null;
}

const initialState: HealthRecordsState = {
  records: [],
  isLoading: false,
  error: null,
};

const healthRecordsSlice = createSlice({
  name: 'healthRecords',
  initialState,
  reducers: {
    setRecords: (state, action: PayloadAction<HealthRecord[]>) => {
      state.records = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export { healthRecordsSlice };
export const healthRecordsActions = healthRecordsSlice.actions;
export const healthRecordsThunks = {};
export const healthRecordsSelectors = {
  selectAll: (state: any) => state.healthRecords.records,
  selectLoading: (state: any) => state.healthRecords.isLoading,
  selectError: (state: any) => state.healthRecords.error,
};

export const selectHealthRecordsByStudent = (studentId: string) => (state: any) =>
  state.healthRecords.records.filter((r: HealthRecord) => r.studentId === studentId);

export const selectHealthRecordsByType = (type: string) => (state: any) =>
  state.healthRecords.records.filter((r: HealthRecord) => r.type === type);

export const selectRecentHealthRecords = (state: any) =>
  state.healthRecords.records.slice(0, 10);

export default healthRecordsSlice.reducer;
