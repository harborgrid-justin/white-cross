/**
 * Health Records Slice
 * 
 * Redux slice for managing student health records using the slice factory.
 * Handles CRUD operations for health records with HIPAA compliance.
 */

import { createEntitySlice, EntityApiService } from '../sliceFactory';
import { HealthRecord } from '../../types/student.types';
import { healthRecordsApi } from '../../services/api';

// Health record creation data
interface CreateHealthRecordData {
  studentId: string;
  recordType: string;
  recordDate: string;
  provider?: string;
  notes?: string;
  attachments?: string[];
}

// Health record update data
interface UpdateHealthRecordData {
  recordType?: string;
  recordDate?: string;
  provider?: string;
  notes?: string;
  attachments?: string[];
}

// Health record filters
interface HealthRecordFilters {
  studentId?: string;
  recordType?: string;
  startDate?: string;
  endDate?: string;
  provider?: string;
  page?: number;
  limit?: number;
}

// Create API service adapter for health records
const healthRecordsApiService: EntityApiService<HealthRecord, CreateHealthRecordData, UpdateHealthRecordData> = {
  async getAll(params?: HealthRecordFilters) {
    const response = await healthRecordsApi.getAll(params);
    return {
      data: response.data?.healthRecords || [],
      total: response.data?.pagination?.total,
      pagination: response.data?.pagination,
    };
  },

  async getById(id: string) {
    const response = await healthRecordsApi.getById(id);
    return { data: response.data };
  },

  async create(data: CreateHealthRecordData) {
    const response = await healthRecordsApi.create(data);
    return { data: response.data };
  },

  async update(id: string, data: UpdateHealthRecordData) {
    const response = await healthRecordsApi.update(id, data);
    return { data: response.data };
  },

  async delete(id: string) {
    await healthRecordsApi.delete(id);
    return { success: true };
  },
};

// Create the health records slice using the entity factory
const healthRecordsSliceFactory = createEntitySlice<HealthRecord, CreateHealthRecordData, UpdateHealthRecordData>(
  'healthRecords',
  healthRecordsApiService,
  {
    enableBulkOperations: false, // Disable bulk operations for sensitive health data
  }
);

// Export the slice and its components
export const healthRecordsSlice = healthRecordsSliceFactory.slice;
export const healthRecordsReducer = healthRecordsSlice.reducer;
export const healthRecordsActions = healthRecordsSliceFactory.actions;
export const healthRecordsSelectors = healthRecordsSliceFactory.adapter.getSelectors((state: any) => state.healthRecords);
export const healthRecordsThunks = healthRecordsSliceFactory.thunks;

// Export custom selectors
export const selectHealthRecordsByStudent = (state: any, studentId: string): HealthRecord[] => {
  const allRecords = healthRecordsSelectors.selectAll(state) as HealthRecord[];
  return allRecords.filter(record => record.studentId === studentId);
};

export const selectHealthRecordsByType = (state: any, recordType: string): HealthRecord[] => {
  const allRecords = healthRecordsSelectors.selectAll(state) as HealthRecord[];
  return allRecords.filter(record => record.recordType === recordType);
};

export const selectHealthRecordsByProvider = (state: any, provider: string): HealthRecord[] => {
  const allRecords = healthRecordsSelectors.selectAll(state) as HealthRecord[];
  return allRecords.filter(record => record.provider === provider);
};

export const selectRecentHealthRecords = (state: any, days: number = 30): HealthRecord[] => {
  const allRecords = healthRecordsSelectors.selectAll(state) as HealthRecord[];
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);
  
  return allRecords.filter(record => {
    const recordDate = new Date(record.recordDate);
    return recordDate >= cutoffDate;
  }).sort((a, b) => new Date(b.recordDate).getTime() - new Date(a.recordDate).getTime());
};
