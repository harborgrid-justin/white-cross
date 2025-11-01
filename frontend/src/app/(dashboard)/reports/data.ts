/**
 * @fileoverview Reports Page Data Layer - Server-Side Data Fetching
 * @module app/(dashboard)/reports/data
 *
 * @description
 * Server-side data fetching functions for the reports dashboard.
 * Separates data logic from UI components for better maintainability.
 *
 * **Features:**
 * - Report history fetching with filtering and search
 * - Error handling and caching
 * - Type-safe API responses
 *
 * @since 1.0.0
 */

import { apiActions } from '@/lib/api';
import { type ReportHistory } from '@/types/reports';

/**
 * Fetch reports data with optional filtering
 *
 * @param filters - Filtering options for reports
 * @returns Promise resolving to reports data
 */
export async function fetchReports(filters: {
  search?: string;
  type?: string;
  status?: string;
} = {}): Promise<ReportHistory[]> {
  try {
    const apiFilters: Record<string, string | number> = {};
    
    if (filters.search?.trim()) {
      apiFilters.search = filters.search.trim();
    }
    
    if (filters.type) {
      apiFilters.type = filters.type;
    }
    
    if (filters.status) {
      apiFilters.status = filters.status;
    }
    
    const response = await apiActions.reports.getReportHistory(apiFilters);
    return response.history || [];
  } catch (error) {
    console.error('Error fetching reports:', error);
    // Return empty array on error to prevent UI crashes
    return [];
  }
}

/**
 * Fetch reports dashboard data with filters
 *
 * @param filters - Filtering options
 * @returns Promise resolving to reports data and error state
 */
export async function fetchReportsDashboardData(filters: {
  search?: string;
  type?: string;
  status?: string;
} = {}) {
  try {
    const reports = await fetchReports(filters);
    
    return {
      reports,
      error: null
    };
  } catch (error) {
    console.error('Error fetching reports dashboard data:', error);
    return {
      reports: [],
      error: error instanceof Error ? error.message : 'Failed to load reports data'
    };
  }
}
