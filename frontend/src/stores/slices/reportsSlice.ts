/**
 * Reports Slice
 * 
 * Redux slice for managing reports and analytics using the slice factory.
 * Handles CRUD operations for report generation and management.
 */

import { createEntitySlice, EntityApiService } from '../sliceFactory';
import { reportsApi } from '../../services/api';

// Report interface
interface Report {
  id: string;
  name: string;
  type: string;
  description?: string;
  parameters: Record<string, any>;
  status: string;
  generatedAt?: string;
  generatedBy: string;
  fileUrl?: string;
  fileSize?: number;
  format: string;
  expiresAt?: string;
  isScheduled: boolean;
  scheduleConfig?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

// Report creation data
interface CreateReportData {
  name: string;
  type: string;
  description?: string;
  parameters: Record<string, any>;
  format: string;
  isScheduled?: boolean;
  scheduleConfig?: Record<string, any>;
}

// Report update data
interface UpdateReportData {
  name?: string;
  description?: string;
  parameters?: Record<string, any>;
  status?: string;
  format?: string;
  isScheduled?: boolean;
  scheduleConfig?: Record<string, any>;
}

// Report filters
interface ReportFilters {
  type?: string;
  status?: string;
  generatedBy?: string;
  format?: string;
  isScheduled?: boolean;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

// Create API service adapter for reports
const reportsApiService: EntityApiService<Report, CreateReportData, UpdateReportData> = {
  async getAll(params?: ReportFilters) {
    const response = await reportsApi.getAll(params);
    return {
      data: response.data?.reports || [],
      total: response.data?.pagination?.total,
      pagination: response.data?.pagination,
    };
  },

  async getById(id: string) {
    const response = await reportsApi.getById(id);
    return { data: response.data };
  },

  async create(data: CreateReportData) {
    const response = await reportsApi.create(data);
    return { data: response.data };
  },

  async update(id: string, data: UpdateReportData) {
    const response = await reportsApi.update(id, data);
    return { data: response.data };
  },

  async delete(id: string) {
    await reportsApi.delete(id);
    return { success: true };
  },
};

// Create the reports slice using the entity factory
const reportsSliceFactory = createEntitySlice<Report, CreateReportData, UpdateReportData>(
  'reports',
  reportsApiService,
  {
    enableBulkOperations: true,
  }
);

// Export the slice and its components
export const reportsSlice = reportsSliceFactory.slice;
export const reportsReducer = reportsSlice.reducer;
export const reportsActions = reportsSliceFactory.actions;
export const reportsSelectors = reportsSliceFactory.adapter.getSelectors((state: any) => state.reports);
export const reportsThunks = reportsSliceFactory.thunks;

// Export custom selectors
export const selectReportsByType = (state: any, type: string): Report[] => {
  const allReports = reportsSelectors.selectAll(state) as Report[];
  return allReports.filter(report => report.type === type);
};

export const selectReportsByStatus = (state: any, status: string): Report[] => {
  const allReports = reportsSelectors.selectAll(state) as Report[];
  return allReports.filter(report => report.status === status);
};

export const selectReportsByGenerator = (state: any, generatedBy: string): Report[] => {
  const allReports = reportsSelectors.selectAll(state) as Report[];
  return allReports.filter(report => report.generatedBy === generatedBy);
};

export const selectScheduledReports = (state: any): Report[] => {
  const allReports = reportsSelectors.selectAll(state) as Report[];
  return allReports.filter(report => report.isScheduled);
};

export const selectCompletedReports = (state: any): Report[] => {
  const allReports = reportsSelectors.selectAll(state) as Report[];
  return allReports.filter(report => report.status === 'COMPLETED');
};

export const selectPendingReports = (state: any): Report[] => {
  const allReports = reportsSelectors.selectAll(state) as Report[];
  return allReports.filter(report => report.status === 'PENDING' || report.status === 'GENERATING');
};

export const selectReportsByFormat = (state: any, format: string): Report[] => {
  const allReports = reportsSelectors.selectAll(state) as Report[];
  return allReports.filter(report => report.format === format);
};

export const selectRecentReports = (state: any, days: number = 7): Report[] => {
  const allReports = reportsSelectors.selectAll(state) as Report[];
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);
  
  return allReports.filter(report => {
    if (!report.generatedAt) return false;
    const generatedDate = new Date(report.generatedAt);
    return generatedDate >= cutoffDate;
  }).sort((a, b) => new Date(b.generatedAt!).getTime() - new Date(a.generatedAt!).getTime());
};

export const selectExpiringReports = (state: any, days: number = 7): Report[] => {
  const allReports = reportsSelectors.selectAll(state) as Report[];
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() + days);
  
  return allReports.filter(report => {
    if (!report.expiresAt) return false;
    const expirationDate = new Date(report.expiresAt);
    return expirationDate <= cutoffDate;
  }).sort((a, b) => new Date(a.expiresAt!).getTime() - new Date(b.expiresAt!).getTime());
};
