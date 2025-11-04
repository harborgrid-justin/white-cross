/**
 * @fileoverview Advanced Analytics API Module
 * @module services/modules/analytics/advancedAnalytics
 * @category Services - Analytics
 *
 * Provides advanced analytics features including real-time updates, predictive analytics,
 * drill-down analysis, data export, and chart transformations.
 *
 * ## Features
 * - Real-time dashboard updates via polling or WebSocket
 * - Predictive analytics and trend forecasting
 * - Drill-down analysis from summary to detail
 * - Report data export in various formats
 * - Chart data transformations
 * - Subscription-based data streaming
 *
 * @example
 * ```typescript
 * const advancedAnalytics = new AdvancedAnalytics(apiClient);
 *
 * // Subscribe to real-time updates
 * const unsubscribe = advancedAnalytics.subscribeToRealTimeUpdates(
 *   'nurse',
 *   { nurseId: 'nurse-123' },
 *   (data) => console.log('Dashboard updated:', data),
 *   30000 // Poll every 30 seconds
 * );
 *
 * // Get forecast
 * const forecast = await advancedAnalytics.getForecast({
 *   metricType: 'INCIDENTS',
 *   historicalPeriod: 90,
 *   forecastPeriod: 30,
 *   schoolId: 'school-123'
 * });
 *
 * // Drill down into data
 * const detailData = await advancedAnalytics.drillDown(
 *   'INCIDENTS',
 *   { schoolId: 'school-123', incidentType: 'INJURY' },
 *   'detail'
 * );
 *
 * // Export report
 * const reportBlob = await advancedAnalytics.exportReportData('report-123', 'PDF');
 * ```
 */

import type { ApiClient } from '../../core/ApiClient';
import { ApiResponse } from '../../utils/apiUtils';
import {
  ChartConfiguration,
  ReportExportFormat
} from '../../types';

/**
 * Advanced Analytics API Service
 * Handles advanced analytics features including real-time updates and predictions
 */
export class AdvancedAnalytics {
  constructor(private readonly client: ApiClient) {}

  /**
   * Get real-time dashboard updates using polling or WebSocket
   * This method demonstrates how to set up real-time updates
   * @param dashboardType - Type of dashboard to subscribe to
   * @param params - Dashboard-specific parameters
   * @param callback - Callback function to receive updates
   * @param intervalMs - Polling interval in milliseconds (default: 30000)
   * @returns Cleanup function to stop subscription
   */
  subscribeToRealTimeUpdates(
    dashboardType: 'nurse' | 'admin' | 'school',
    params: any,
    callback: (data: any) => void,
    intervalMs: number = 30000
  ): () => void {
    let intervalId: NodeJS.Timeout;

    const fetchUpdate = async () => {
      try {
        let endpoint: string;
        let queryParams: any = {};

        switch (dashboardType) {
          case 'nurse':
            endpoint = '/analytics/dashboard/nurse';
            queryParams = { nurseId: params.nurseId, ...params };
            break;
          case 'admin':
            endpoint = '/analytics/dashboard/admin';
            queryParams = params;
            break;
          case 'school':
            endpoint = `/analytics/dashboard/school/${params.schoolId}`;
            queryParams = { ...params };
            delete queryParams.schoolId;
            break;
        }

        const response = await this.client.get<ApiResponse<any>>(
          endpoint,
          { params: queryParams }
        );

        callback(response.data.data);
      } catch (error) {
        console.error('Real-time update error:', error);
      }
    };

    // Initial fetch
    fetchUpdate();

    // Set up polling
    intervalId = setInterval(fetchUpdate, intervalMs);

    // Return cleanup function
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }

  /**
   * Export report data in various formats
   * Helper method for client-side export handling
   * @param reportId - Report identifier
   * @param format - Export format (PDF, Excel, CSV)
   * @returns Blob containing exported data
   */
  async exportReportData(
    reportId: string,
    format: ReportExportFormat
  ): Promise<Blob> {
    const response = await this.client.get<Blob>(
      `/analytics/reports/${reportId}/export`,
      {
        params: { format },
        responseType: 'blob'
      }
    );

    return response.data;
  }

  /**
   * Get chart-ready data for visualization
   * Transforms report data into chart configuration
   * @param data - Raw data to transform
   * @param config - Chart configuration parameters
   * @returns Chart configuration object
   */
  transformToChartData(
    data: any[],
    config: {
      xField: string;
      yField: string | string[];
      chartType: string;
      groupBy?: string;
    }
  ): ChartConfiguration {
    // This is a helper method that would transform raw data
    // into chart-ready format for libraries like Chart.js, Recharts, etc.
    // Implementation depends on the charting library being used

    return {
      type: config.chartType as any,
      series: [],
      // ... additional configuration
    };
  }

  /**
   * Perform drill-down analysis
   * Navigate from summary to detailed data
   * @param metricType - Type of metric to drill down into
   * @param filters - Filters to apply to drill-down query
   * @param level - Level of detail (summary, detail, record)
   * @returns Drill-down data
   */
  async drillDown(
    metricType: string,
    filters: Record<string, any>,
    level: 'summary' | 'detail' | 'record'
  ): Promise<any> {
    const response = await this.client.get<ApiResponse<any>>(
      '/analytics/drill-down',
      {
        params: {
          metricType,
          level,
          ...filters
        }
      }
    );

    return response.data.data;
  }

  /**
   * Get predictive analytics and trend forecasting
   * @param params - Forecast parameters
   * @returns Forecast data
   */
  async getForecast(params: {
    metricType: string;
    historicalPeriod: number;
    forecastPeriod: number;
    schoolId?: string;
  }): Promise<any> {
    const response = await this.client.get<ApiResponse<any>>(
      '/analytics/forecast',
      { params }
    );

    return response.data.data;
  }
}

/**
 * Factory function to create Advanced Analytics instance
 * @param client - ApiClient instance
 * @returns Configured AdvancedAnalytics instance
 */
export function createAdvancedAnalytics(client: ApiClient): AdvancedAnalytics {
  return new AdvancedAnalytics(client);
}
