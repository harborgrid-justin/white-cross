/**
 * @fileoverview Medication Utility Functions
 * @module app/medications/utils
 *
 * Utility and helper functions for medication operations.
 * Includes cache management and dashboard data aggregation.
 */

'use server';

import { revalidateTag, revalidatePath } from 'next/cache';
import { CACHE_TAGS } from '@/lib/cache/constants';
import type { MedicationFilters } from './medications.types';
// Import individual functions rather than re-exporting to avoid duplicate 'use server'
import {
  getMedication,
  getMedications,
  getPaginatedMedications,
  getMedicationStats
} from './medications.cache';

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

/**
 * Check if medication exists
 */
export async function medicationExists(medicationId: string): Promise<boolean> {
  const medication = await getMedication(medicationId);
  return medication !== null;
}

/**
 * Get medication count
 */
export async function getMedicationCount(filters?: MedicationFilters): Promise<number> {
  try {
    const medications = await getMedications(filters);
    return medications.length;
  } catch {
    return 0;
  }
}

/**
 * Clear medication cache
 */
export async function clearMedicationCache(medicationId?: string): Promise<void> {
  if (medicationId) {
    revalidateTag(`medication-${medicationId}`, 'default');
  }
  revalidateTag(CACHE_TAGS.MEDICATIONS, 'default');
  revalidateTag('medication-list', 'default');
  revalidateTag('due-medications', 'default');
  revalidateTag('overdue-medications', 'default');
  revalidatePath('/dashboard/medications', 'page');
}

// ==========================================
// DASHBOARD DATA AGGREGATION
// ==========================================

/**
 * Fetch medications dashboard data combining medications and stats
 */
export async function getMedicationsDashboardData(options: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  type?: string;
  studentId?: string;
} = {}) {
  try {
    // Build filters object, only including defined values
    const filters: MedicationFilters = {};

    if (options.status && options.status !== 'all') {
      filters.status = options.status as 'active' | 'inactive' | 'discontinued';
    }

    if (options.search) {
      // Note: API may expect 'search' parameter, not 'name'
      filters.name = options.search;
    }

    if (options.studentId) {
      filters.studentId = options.studentId;
    }

    const [medicationsResponse, statsResponse] = await Promise.allSettled([
      getPaginatedMedications(options.page || 1, options.limit || 50, filters),
      getMedicationStats()
    ]);

    const medications = medicationsResponse.status === 'fulfilled' && medicationsResponse.value
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

// Note: getOverdueMedications is exported from medications.cache.ts and re-exported in medications.actions.ts
