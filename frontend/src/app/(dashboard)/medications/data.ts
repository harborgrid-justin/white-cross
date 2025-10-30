/**
 * @fileoverview Medications Page Data Layer - Server-Side Data Fetching
 * @module app/(dashboard)/medications/data
 *
 * @description
 * Server-side data fetching functions for the medications dashboard.
 * Separates data logic from UI components for better maintainability.
 *
 * **Features:**
 * - Medication list fetching with pagination and filtering
 * - Statistics aggregation
 * - Error handling and caching
 * - Type-safe API responses
 *
 * @since 1.0.0
 */

import { medicationsApi } from '@/services/modules/medicationsApi';
import type { 
  Medication, 
  MedicationStats,
  MedicationsResponse 
} from '@/types/medications';

/**
 * Fetch medications data with optional filtering and pagination
 *
 * @param options - Filtering and pagination options
 * @returns Promise resolving to medications data
 */
export async function fetchMedications(options: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  type?: string;
} = {}): Promise<MedicationsResponse> {
  try {
    const response = await medicationsApi.getAll({
      page: options.page || 1,
      limit: options.limit || 50,
      search: options.search,
      ...options
    });
    
    return response;
  } catch (error) {
    console.error('Error fetching medications:', error);
    // Return empty response on error to prevent UI crashes
    return {
      medications: [],
      pagination: {
        page: 1,
        limit: 50,
        total: 0,
        pages: 0
      }
    };
  }
}

/**
 * Fetch medication statistics for dashboard metrics
 *
 * @returns Promise resolving to medication statistics
 */
export async function fetchMedicationStats(): Promise<MedicationStats> {
  try {
    const stats = await medicationsApi.getStats();
    return stats;
  } catch (error) {
    console.error('Error fetching medication stats:', error);
    // Return default stats on error
    return {
      totalMedications: 0,
      activePrescriptions: 0,
      administeredToday: 0,
      adverseReactions: 0,
      lowStockCount: 0,
      expiringCount: 0
    };
  }
}

/**
 * Fetch both medications and stats in parallel for the dashboard page
 *
 * @param medicationOptions - Options for medication fetching
 * @returns Promise resolving to both medications and stats data
 */
export async function fetchMedicationsDashboardData(medicationOptions: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  type?: string;
} = {}) {
  try {
    const [medicationsResponse, statsResponse] = await Promise.allSettled([
      fetchMedications(medicationOptions),
      fetchMedicationStats()
    ]);

    const medications = medicationsResponse.status === 'fulfilled' 
      ? medicationsResponse.value.medications || []
      : [];

    const stats = statsResponse.status === 'fulfilled'
      ? statsResponse.value
      : {
          totalMedications: 0,
          activePrescriptions: 0,
          administeredToday: 0,
          adverseReactions: 0,
          lowStockCount: 0,
          expiringCount: 0
        };

    return {
      medications,
      stats,
      error: null
    };
  } catch (error) {
    console.error('Error fetching medications dashboard data:', error);
    return {
      medications: [],
      stats: {
        totalMedications: 0,
        activePrescriptions: 0,
        administeredToday: 0,
        adverseReactions: 0,
        lowStockCount: 0,
        expiringCount: 0
      },
      error: error instanceof Error ? error.message : 'Failed to load medication data'
    };
  }
}
