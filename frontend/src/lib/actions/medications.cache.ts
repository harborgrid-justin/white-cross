/**
 * @fileoverview Medication Caching Functions
 * @module app/medications/cache
 *
 * HIPAA-compliant cached data fetching for medications.
 * All functions use React cache() for automatic memoization.
 */

'use server';

import { cache } from 'react';
import { serverGet } from '@/lib/api/nextjs-client';
import { API_ENDPOINTS } from '@/constants/api';
import { CACHE_TAGS, CACHE_TTL } from '@/lib/cache/constants';
import type { ApiResponse } from '@/types/api';
import type { Medication } from '@/types/medications';
import type {
  MedicationFilters,
  MedicationLog,
  PaginatedMedicationsResponse,
  MedicationStats
} from './medications.types';

// ==========================================
// CACHED MEDICATION READS
// ==========================================

/**
 * Get medication by ID with caching
 * Uses Next.js cache() for automatic memoization
 */
export const getMedication = cache(async (id: string): Promise<Medication | null> => {
  try {
    const response = await serverGet<ApiResponse<Medication>>(
      API_ENDPOINTS.MEDICATIONS.BY_ID(id),
      undefined,
      {
        cache: 'force-cache',
        next: {
          revalidate: CACHE_TTL.PHI_STANDARD,
          tags: [`medication-${id}`, CACHE_TAGS.MEDICATIONS, CACHE_TAGS.PHI]
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('Failed to get medication:', error);
    return null;
  }
});

/**
 * Get all medications with caching
 * Uses shorter TTL for frequently updated data
 */
export const getMedications = cache(async (filters?: MedicationFilters): Promise<Medication[]> => {
  try {
    const response = await serverGet<ApiResponse<Medication[]>>(
      API_ENDPOINTS.MEDICATIONS.BASE,
      filters as Record<string, string | number | boolean>,
      {
        cache: 'force-cache',
        next: {
          revalidate: CACHE_TTL.PHI_STANDARD,
          tags: [CACHE_TAGS.MEDICATIONS, 'medication-list', CACHE_TAGS.PHI]
        }
      }
    );

    return response.data || [];
  } catch (error) {
    console.error('Failed to get medications:', error);
    return [];
  }
});

/**
 * Get medications for a specific student
 */
export const getStudentMedications = cache(async (studentId: string): Promise<Medication[]> => {
  try {
    const response = await serverGet<ApiResponse<Medication[]>>(
      API_ENDPOINTS.MEDICATIONS.BY_STUDENT(studentId),
      undefined,
      {
        cache: 'force-cache',
        next: {
          revalidate: CACHE_TTL.PHI_FREQUENT, // More frequent updates for active medications
          tags: [`student-medications-${studentId}`, CACHE_TAGS.MEDICATIONS, CACHE_TAGS.PHI]
        }
      }
    );

    return response.data || [];
  } catch (error) {
    console.error('Failed to get student medications:', error);
    return [];
  }
});

/**
 * Get due medications (requiring administration)
 */
export const getDueMedications = cache(async (): Promise<Medication[]> => {
  try {
    const response = await serverGet<ApiResponse<Medication[]>>(
      API_ENDPOINTS.MEDICATIONS.DUE,
      undefined,
      {
        cache: 'force-cache',
        next: {
          revalidate: CACHE_TTL.PHI_FREQUENT, // Short TTL for time-sensitive data
          tags: ['due-medications', CACHE_TAGS.MEDICATIONS, CACHE_TAGS.PHI]
        }
      }
    );

    return response.data || [];
  } catch (error) {
    console.error('Failed to get due medications:', error);
    return [];
  }
});

/**
 * Get paginated medications
 */
export const getPaginatedMedications = cache(async (
  page: number = 1,
  limit: number = 20,
  filters?: MedicationFilters
): Promise<PaginatedMedicationsResponse | null> => {
  try {
    const params = {
      page: page.toString(),
      limit: limit.toString(),
      ...filters
    };

    const response = await serverGet<ApiResponse<PaginatedMedicationsResponse>>(
      API_ENDPOINTS.MEDICATIONS.BASE,
      params as Record<string, string | number | boolean>,
      {
        cache: 'force-cache',
        next: {
          revalidate: CACHE_TTL.PHI_STANDARD,
          tags: [CACHE_TAGS.MEDICATIONS, 'medication-list', CACHE_TAGS.PHI]
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('Failed to get paginated medications:', error);
    return null;
  }
});

/**
 * Get medication administration history
 */
export const getMedicationHistory = cache(async (medicationId: string): Promise<MedicationLog[]> => {
  try {
    const response = await serverGet<ApiResponse<MedicationLog[]>>(
      `${API_ENDPOINTS.MEDICATIONS.BY_ID(medicationId)}/history`,
      undefined,
      {
        cache: 'force-cache',
        next: {
          revalidate: CACHE_TTL.PHI_STANDARD,
          tags: [`medication-history-${medicationId}`, CACHE_TAGS.MEDICATIONS, CACHE_TAGS.PHI]
        }
      }
    );

    return response.data || [];
  } catch (error) {
    console.error('Failed to get medication history:', error);
    return [];
  }
});

/**
 * Get medication statistics for dashboard metrics
 */
export const getMedicationStats = cache(async (): Promise<MedicationStats> => {
  try {
    const response = await serverGet<ApiResponse<MedicationStats>>(
      `${API_ENDPOINTS.MEDICATIONS.BASE}/stats`,
      undefined,
      {
        cache: 'force-cache',
        next: {
          revalidate: CACHE_TTL.PHI_FREQUENT, // Frequent updates for dashboard stats
          tags: ['medication-stats', CACHE_TAGS.MEDICATIONS]
        }
      }
    );

    return response.data || {
      totalMedications: 0,
      activePrescriptions: 0,
      administeredToday: 0,
      adverseReactions: 0,
      lowStockCount: 0,
      expiringCount: 0
    };
  } catch (error) {
    console.error('Failed to get medication stats:', error);
    return {
      totalMedications: 0,
      activePrescriptions: 0,
      administeredToday: 0,
      adverseReactions: 0,
      lowStockCount: 0,
      expiringCount: 0
    };
  }
});

/**
 * Get overdue medications
 */
export const getOverdueMedications = cache(async (): Promise<Medication[]> => {
  try {
    const response = await serverGet<ApiResponse<Medication[]>>(
      API_ENDPOINTS.MEDICATIONS.OVERDUE,
      undefined,
      {
        cache: 'force-cache',
        next: {
          revalidate: CACHE_TTL.PHI_FREQUENT,
          tags: ['overdue-medications', CACHE_TAGS.MEDICATIONS, CACHE_TAGS.PHI]
        }
      }
    );

    return response.data || [];
  } catch (error) {
    console.error('Failed to get overdue medications:', error);
    return [];
  }
});
