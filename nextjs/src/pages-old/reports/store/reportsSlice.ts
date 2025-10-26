/**
 * Reports Redux Slice
 *
 * Redux slice for managing reports and analytics using the entity slice factory.
 * Handles CRUD operations for report generation, scheduling, and management.
 *
 * @module pages/reports/store/reportsSlice
 *
 * @remarks
 * - Uses entity adapter pattern for normalized state
 * - Integrates with reportsApi service layer
 * - Supports filtering by type, status, format, and date range
 * - Manages scheduled reports and report history
 * - Provides selectors for common report queries
 *
 * @example
 * ```typescript
 * // Dispatch actions
 * dispatch(reportsThunks.fetchAll({ type: 'incident' }));
 * dispatch(reportsThunks.create({ name: 'Monthly Report', type: 'health', format: 'PDF' }));
 *
 * // Use selectors
 * const reports = reportsSelectors.selectAll(state);
 * const report = reportsSelectors.selectById(state, reportId);
 * ```
 */

import { createEntitySlice, EntityApiService } from '../../../stores/sliceFactory';
import { reportsApi } from '../../../services';

/**
 * Report entity interface.
 *
 * Represents a generated or scheduled report with metadata, parameters,
 * and file information.
 *
 * @property id - Unique report identifier
 * @property name - Human-readable report name
 * @property type - Report category (student, health, medication, etc.)
 * @property description - Optional detailed description
 * @property parameters - Report-specific filter and configuration parameters
 * @property status - Current status of the report
 * @property generatedAt - Timestamp when report was generated
 * @property generatedBy - User ID who generated the report
 * @property fileUrl - URL to download the generated report file
 * @property fileSize - Size of the generated file in bytes
 * @property format - Output format (PDF, Excel, CSV)
 * @property expiresAt - Optional expiration timestamp for temporary reports
 * @property isScheduled - Whether this is a scheduled recurring report
 * @property scheduleConfig - Cron expression and scheduling configuration
 * @property createdAt - Entity creation timestamp
 * @property updatedAt - Entity last update timestamp
 */
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

/**
 * Report creation payload.
 *
 * Data required to create a new report or schedule a recurring report.
 *
 * @property name - Report name
 * @property type - Report category
 * @property description - Optional description
 * @property parameters - Filters and configuration
 * @property format - Output format
 * @property isScheduled - Enable scheduling
 * @property scheduleConfig - Scheduling configuration (cron, timezone)
 */
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

/**
 * Report query filters.
 *
 * Supports filtering reports by various criteria including type, status,
 * creator, format, scheduling status, and date range.
 *
 * @property type - Filter by report type
 * @property status - Filter by generation status
 * @property generatedBy - Filter by creator user ID
 * @property format - Filter by output format
 * @property isScheduled - Filter scheduled vs. on-demand reports
 * @property startDate - Filter by creation date (start)
 * @property endDate - Filter by creation date (end)
 * @property page - Pagination page number
 * @property limit - Pagination results per page
 */
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
    // Get report history as the main reports list
    const response = await reportsApi.getReportHistory({
      reportType: params?.type,
    });
    return {
      data: response.history.map((item: any) => ({
        id: item.id,
        name: item.title || 'Untitled Report',
        type: item.reportType || 'unknown',
        description: 'Generated report',
        parameters: item.filters || {},
        status: 'COMPLETED',
        generatedAt: item.createdAt,
        generatedBy: item.generatedBy,
        fileUrl: item.fileUrl,
        fileSize: item.fileSize,
        format: item.format || 'PDF',
        isScheduled: false,
        scheduleConfig: {},
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      })) || [],
      total: response.history?.length || 0,
      pagination: {
        page: 1,
        limit: response.history?.length || 0,
        total: response.history?.length || 0,
        pages: 1,
      },
    };
  },

  async getById(id: string) {
    // Since there's no direct getById, we'll get from history and find by ID
    const response = await reportsApi.getReportHistory({});
    const report = response.history.find((item: any) => item.id === id);
    if (!report) throw new Error('Report not found');
    
    return {
      data: {
        id: report.id,
        name: report.title || 'Untitled Report',
        type: report.reportType || 'unknown',
        description: 'Generated report',
        parameters: report.filters || {},
        status: 'COMPLETED',
        generatedAt: report.createdAt,
        generatedBy: report.generatedBy,
        fileUrl: report.fileUrl,
        fileSize: report.fileSize,
        format: report.format || 'PDF',
        isScheduled: false,
        scheduleConfig: {},
        createdAt: report.createdAt,
        updatedAt: report.updatedAt,
      }
    };
  },

  async create(data: CreateReportData) {
    // Use custom report generation
    const response = await reportsApi.generateCustomReport({
      reportType: data.type as any,
      title: data.name,
      description: data.description,
      filters: data.parameters as any,
    });
    
    return {
      data: {
        id: crypto.randomUUID(),
        name: data.name,
        type: data.type,
        description: data.description,
        parameters: data.parameters,
        status: 'COMPLETED',
        generatedAt: new Date().toISOString(),
        generatedBy: 'current-user',
        format: data.format,
        isScheduled: data.isScheduled || false,
        scheduleConfig: data.scheduleConfig,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    };
  },

  async update(id: string, data: UpdateReportData) {
    // Report updates not implemented in API
    throw new Error('Report update not implemented in API');
  },

  async delete(id: string) {
    // Report deletion not implemented in API
    throw new Error('Report deletion not implemented in API');
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
