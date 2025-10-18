/**
 * WF-COMP-294 | reportsApi.d.ts - React component or utility module
 * Purpose: react component or utility module
 * Upstream: React, external libs | Dependencies: React ecosystem
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: constants, interfaces | Key Features: Standard module
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */

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
