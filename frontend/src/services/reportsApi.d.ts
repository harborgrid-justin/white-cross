export interface ReportsApi {
  getDashboard(): Promise<any>;
  getHealthTrends(dateRange: any): Promise<any>;
  getMedicationUsage(dateRange: any): Promise<any>;
  getIncidentStatistics(dateRange: any): Promise<any>;
  getAttendanceCorrelation(dateRange: any): Promise<any>;
  getComplianceReport(dateRange: any): Promise<any>;
  exportReport(data: any): Promise<void>;
}

export const reportsApi: ReportsApi;
