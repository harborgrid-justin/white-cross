/**
 * @fileoverview Appointments Page Data Layer - Server-Side Data Fetching
 * @module app/(dashboard)/appointments/data
 *
 * @description
 * Server-side data fetching functions for the appointments dashboard.
 * Separates data logic from UI components for better maintainability.
 *
 * **Features:**
 * - Appointment fetching with filtering and search
 * - Error handling and caching
 * - Type-safe API responses
 *
 * @since 1.0.0
 */

import { appointmentsApi } from '@/services/modules/appointmentsApi';
import { type Appointment } from '@/types/appointments';

/**
 * Fetch appointments data with optional filtering
 *
 * @param filters - Filtering options for appointments
 * @returns Promise resolving to appointments data
 */
export async function fetchAppointments(filters: {
  search?: string;
  status?: string;
  date?: string;
} = {}): Promise<Appointment[]> {
  try {
    const apiFilters: Record<string, string | number> = {};
    
    if (filters.search?.trim()) {
      apiFilters.search = filters.search.trim();
    }
    
    if (filters.status) {
      apiFilters.status = filters.status;
    }
    
    if (filters.date) {
      apiFilters.date = filters.date;
    }
    
    const response = await appointmentsApi.getAll(apiFilters);
    return response.data || [];
  } catch (error) {
    console.error('Error fetching appointments:', error);
    // Return empty array on error to prevent UI crashes
    return [];
  }
}

/**
 * Fetch appointments dashboard data with filters
 *
 * @param filters - Filtering options
 * @returns Promise resolving to appointments data and error state
 */
export async function fetchAppointmentsDashboardData(filters: {
  search?: string;
  status?: string;
  date?: string;
} = {}) {
  try {
    const appointments = await fetchAppointments(filters);
    
    return {
      appointments,
      error: null
    };
  } catch (error) {
    console.error('Error fetching appointments dashboard data:', error);
    return {
      appointments: [],
      error: error instanceof Error ? error.message : 'Failed to load appointments data'
    };
  }
}
