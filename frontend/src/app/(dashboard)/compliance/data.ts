/**
 * @fileoverview Compliance Page Data Layer - Server-Side Data Fetching
 * @module app/(dashboard)/compliance/data
 *
 * @description
 * Server-side data fetching functions for the compliance dashboard.
 * Separates data logic from UI components for better maintainability.
 *
 * **Features:**
 * - Compliance report fetching with date range filtering
 * - Error handling and caching
 * - Type-safe API responses
 *
 * @since 1.0.0
 */

import { reportsApi } from '@/services/modules/reportsApi';
import { type ComplianceReport } from '@/types/reports';

/**
 * Fetch compliance data with date range filtering
 *
 * @param filters - Filtering options for compliance data
 * @returns Promise resolving to compliance data
 */
export async function fetchComplianceData(filters: {
  startDate?: string;
  endDate?: string;
  dateRange?: string;
} = {}): Promise<ComplianceReport | null> {
  try {
    let startDate: string;
    let endDate: string;
    
    if (filters.startDate && filters.endDate) {
      startDate = filters.startDate;
      endDate = filters.endDate;
    } else {
      const end = new Date();
      const start = new Date();
      const days = parseInt(filters.dateRange || '30');
      start.setDate(end.getDate() - days);
      
      startDate = start.toISOString();
      endDate = end.toISOString();
    }
    
    const apiFilters = {
      startDate,
      endDate
    };
    
    const response = await reportsApi.getComplianceReport(apiFilters);
    return response;
  } catch (error) {
    console.error('Error fetching compliance data:', error);
    // Return null on error to indicate failure
    return null;
  }
}

/**
 * Fetch compliance dashboard data with date range
 *
 * @param filters - Filtering options
 * @returns Promise resolving to compliance data and error state
 */
export async function fetchComplianceDashboardData(filters: {
  startDate?: string;
  endDate?: string;
  dateRange?: string;
} = {}) {
  try {
    const complianceData = await fetchComplianceData(filters);
    
    return {
      complianceData,
      error: complianceData === null ? 'Failed to load compliance data' : null
    };
  } catch (error) {
    console.error('Error fetching compliance dashboard data:', error);
    return {
      complianceData: null,
      error: error instanceof Error ? error.message : 'Failed to load compliance data'
    };
  }
}
