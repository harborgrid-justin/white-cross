/**
 * @fileoverview Immunization Cache Management
 * @module lib/actions/immunizations/cache
 *
 * Cache configuration and cached data retrieval functions for immunizations.
 * Uses Next.js cache() for automatic memoization and revalidation.
 */

'use server';

import { cache } from 'react';
import { revalidateTag, revalidatePath } from 'next/cache';
import { serverGet } from '@/lib/api/server';
import { CACHE_TAGS, CACHE_TTL } from '@/lib/cache/constants';
import type { ApiResponse } from '@/types';
import type {
  ImmunizationRecord,
  ImmunizationFilters,
  Vaccine,
  ImmunizationRequirement,
  ImmunizationAnalytics,
} from './immunizations.types';

// ==========================================
// CACHE TAG CONFIGURATION
// ==========================================

export const IMMUNIZATION_CACHE_TAGS = {
  RECORDS: 'immunization-records',
  VACCINES: 'vaccines',
  SCHEDULES: 'immunization-schedules',
  REQUIREMENTS: 'immunization-requirements',
  EXEMPTIONS: 'immunization-exemptions',
} as const;

// ==========================================
// CACHED DATA RETRIEVAL FUNCTIONS
// ==========================================

/**
 * Get immunization record by ID with caching
 * Uses Next.js cache() for automatic memoization
 */
export const getImmunizationRecord = cache(async (id: string): Promise<ImmunizationRecord | null> => {
  try {
    const response = await serverGet<ApiResponse<ImmunizationRecord>>(
      `/api/immunizations/records/${id}`,
      undefined,
      {
        cache: 'force-cache',
        next: {
          revalidate: CACHE_TTL.PHI_STANDARD,
          tags: [`immunization-record-${id}`, IMMUNIZATION_CACHE_TAGS.RECORDS, CACHE_TAGS.PHI]
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('Failed to get immunization record:', error);
    return null;
  }
});

/**
 * Get all immunization records with caching
 */
export const getImmunizationRecords = cache(async (filters?: ImmunizationFilters): Promise<ImmunizationRecord[]> => {
  try {
    const response = await serverGet<ApiResponse<ImmunizationRecord[]>>(
      `/api/immunizations/records`,
      filters as Record<string, string | number | boolean>,
      {
        cache: 'force-cache',
        next: {
          revalidate: CACHE_TTL.PHI_STANDARD,
          tags: [IMMUNIZATION_CACHE_TAGS.RECORDS, 'immunization-record-list', CACHE_TAGS.PHI]
        }
      }
    );

    return response.data || [];
  } catch (error) {
    console.error('Failed to get immunization records:', error);
    return [];
  }
});

/**
 * Get student immunization records with caching
 */
export const getStudentImmunizations = cache(async (studentId: string): Promise<ImmunizationRecord[]> => {
  try {
    const response = await serverGet<ApiResponse<ImmunizationRecord[]>>(
      `/api/students/${studentId}/immunizations`,
      undefined,
      {
        cache: 'force-cache',
        next: {
          revalidate: CACHE_TTL.PHI_STANDARD,
          tags: [`student-${studentId}-immunizations`, IMMUNIZATION_CACHE_TAGS.RECORDS, CACHE_TAGS.PHI]
        }
      }
    );

    return response.data || [];
  } catch (error) {
    console.error('Failed to get student immunizations:', error);
    return [];
  }
});

/**
 * Get all vaccines with caching
 */
export const getVaccines = cache(async (): Promise<Vaccine[]> => {
  try {
    const response = await serverGet<ApiResponse<Vaccine[]>>(
      `/api/immunizations/vaccines`,
      undefined,
      {
        cache: 'force-cache',
        next: {
          revalidate: CACHE_TTL.STATIC,
          tags: [IMMUNIZATION_CACHE_TAGS.VACCINES, 'vaccine-list']
        }
      }
    );

    return response.data || [];
  } catch (error) {
    console.error('Failed to get vaccines:', error);
    return [];
  }
});

/**
 * Get immunization requirements with caching
 */
export const getImmunizationRequirements = cache(async (grade?: string): Promise<ImmunizationRequirement[]> => {
  try {
    const params = grade ? { grade } : undefined;
    const response = await serverGet<ApiResponse<ImmunizationRequirement[]>>(
      `/api/immunizations/requirements`,
      params as Record<string, string | number | boolean>,
      {
        cache: 'force-cache',
        next: {
          revalidate: CACHE_TTL.STATIC,
          tags: [IMMUNIZATION_CACHE_TAGS.REQUIREMENTS, 'immunization-requirement-list']
        }
      }
    );

    return response.data || [];
  } catch (error) {
    console.error('Failed to get immunization requirements:', error);
    return [];
  }
});

/**
 * Get immunization analytics with caching
 */
export const getImmunizationAnalytics = cache(async (filters?: Record<string, unknown>): Promise<ImmunizationAnalytics | null> => {
  try {
    const response = await serverGet<ApiResponse<ImmunizationAnalytics>>(
      `/api/immunizations/analytics`,
      filters as Record<string, string | number | boolean>,
      {
        cache: 'force-cache',
        next: {
          revalidate: CACHE_TTL.STATS,
          tags: ['immunization-analytics', 'immunization-stats']
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('Failed to get immunization analytics:', error);
    return null;
  }
});

// ==========================================
// CACHE INVALIDATION
// ==========================================

/**
 * Clear immunization cache
 */
export async function clearImmunizationCache(resourceType?: string, resourceId?: string): Promise<void> {
  if (resourceType && resourceId) {
    revalidateTag(`${resourceType}-${resourceId}`, 'default');
  }

  // Clear all immunization caches
  Object.values(IMMUNIZATION_CACHE_TAGS).forEach(tag => {
    revalidateTag(tag, 'default');
  });

  // Clear list caches
  revalidateTag('immunization-record-list', 'default');
  revalidateTag('vaccine-list', 'default');
  revalidateTag('immunization-requirement-list', 'default');
  revalidateTag('immunization-stats', 'default');

  // Clear paths
  revalidatePath('/immunizations', 'page');
  revalidatePath('/immunizations/records', 'page');
  revalidatePath('/immunizations/vaccines', 'page');
  revalidatePath('/immunizations/requirements', 'page');
}
