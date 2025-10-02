import api from './api';

export interface DateRange {
  startDate?: string;
  endDate?: string;
}

export interface CustomReportRequest {
  reportType: string;
  filters?: any;
}

export interface ExportRequest extends CustomReportRequest {
  format: 'csv' | 'pdf' | 'excel';
}

export const reportsApi = {
  // Health Trend Analysis
  getHealthTrends: async (dateRange?: DateRange) => {
    const params = new URLSearchParams();
    if (dateRange?.startDate) params.append('startDate', dateRange.startDate);
    if (dateRange?.endDate) params.append('endDate', dateRange.endDate);
    
    const response = await api.get(`/reports/health-trends?${params}`);
    return response.data.data;
  },

  // Medication Usage & Compliance
  getMedicationUsage: async (dateRange?: DateRange) => {
    const params = new URLSearchParams();
    if (dateRange?.startDate) params.append('startDate', dateRange.startDate);
    if (dateRange?.endDate) params.append('endDate', dateRange.endDate);
    
    const response = await api.get(`/reports/medication-usage?${params}`);
    return response.data.data;
  },

  // Incident Statistics
  getIncidentStatistics: async (dateRange?: DateRange) => {
    const params = new URLSearchParams();
    if (dateRange?.startDate) params.append('startDate', dateRange.startDate);
    if (dateRange?.endDate) params.append('endDate', dateRange.endDate);
    
    const response = await api.get(`/reports/incident-statistics?${params}`);
    return response.data.data;
  },

  // Attendance Correlation
  getAttendanceCorrelation: async (dateRange?: DateRange) => {
    const params = new URLSearchParams();
    if (dateRange?.startDate) params.append('startDate', dateRange.startDate);
    if (dateRange?.endDate) params.append('endDate', dateRange.endDate);
    
    const response = await api.get(`/reports/attendance-correlation?${params}`);
    return response.data.data;
  },

  // Performance Metrics
  getPerformanceMetrics: async (metricType?: string, dateRange?: DateRange) => {
    const params = new URLSearchParams();
    if (metricType) params.append('metricType', metricType);
    if (dateRange?.startDate) params.append('startDate', dateRange.startDate);
    if (dateRange?.endDate) params.append('endDate', dateRange.endDate);
    
    const response = await api.get(`/reports/performance-metrics?${params}`);
    return response.data.data;
  },

  // Real-time Dashboard
  getDashboard: async () => {
    const response = await api.get('/reports/dashboard');
    return response.data.data;
  },

  // Compliance Report
  getComplianceReport: async (dateRange?: DateRange) => {
    const params = new URLSearchParams();
    if (dateRange?.startDate) params.append('startDate', dateRange.startDate);
    if (dateRange?.endDate) params.append('endDate', dateRange.endDate);
    
    const response = await api.get(`/reports/compliance?${params}`);
    return response.data.data;
  },

  // Custom Report Builder
  generateCustomReport: async (request: CustomReportRequest) => {
    const response = await api.post('/reports/custom', request);
    return response.data.data;
  },

  // Export Report
  exportReport: async (request: ExportRequest) => {
    const response = await api.post('/reports/export', request);
    return response.data.data;
  }
};
