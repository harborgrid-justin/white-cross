/**
 * @fileoverview Health Records Cache Management
 * @module lib/actions/health-records/cache
 *
 * Cache configuration and cached data retrieval functions for health records.
 * Uses Next.js cache() for automatic memoization and revalidation.
 * Designed for use with React Query in client components.
 */

'use server';

import { cache } from 'react';
import { revalidateTag, revalidatePath } from 'next/cache';
import { serverGet } from '@/lib/api/server';
import { CACHE_TAGS, CACHE_TTL } from '@/lib/cache/constants';
import type { ApiResponse } from '@/types';

// ==========================================
// CACHE TAG CONFIGURATION
// ==========================================

export const HEALTH_RECORDS_CACHE_TAGS = {
  RECORDS: 'health-records',
  VITAL_SIGNS: 'vital-signs',
  SCREENINGS: 'screenings',
  ALLERGIES: 'allergies',
  IMMUNIZATIONS: 'immunizations',
  CONDITIONS: 'conditions',
  MEDICATIONS: 'medications',
} as const;

// ==========================================
// TYPE DEFINITIONS (for cache functions)
// ==========================================

interface HealthRecord {
  id: string;
  studentId: string;
  recordType: string;
  title: string;
  description: string;
  date: string;
  provider?: string;
  diagnosis?: string;
  notes?: string;
  isConfidential?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface VitalSigns {
  id: string;
  studentId: string;
  recordDate: string;
  recordedBy: string;
  temperature?: number;
  temperatureMethod?: 'oral' | 'axillary' | 'tympanic' | 'temporal';
  bloodPressureSystolic?: number;
  bloodPressureDiastolic?: number;
  heartRate?: number;
  respiratoryRate?: number;
  oxygenSaturation?: number;
  pain?: number;
  glucose?: number;
  weight?: number;
  height?: number;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface Screening {
  id: string;
  studentId: string;
  screeningType: string;
  screeningDate: string;
  performedBy: string;
  outcome: string;
  results?: string;
  referralRequired?: boolean;
  referralTo?: string;
  followUpRequired?: boolean;
  followUpDate?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

// ==========================================
// CACHED DATA RETRIEVAL FUNCTIONS
// ==========================================

/**
 * Get health records for a student with caching
 * Uses Next.js cache() for automatic memoization
 */
export const getHealthRecords = cache(async (studentId: string): Promise<HealthRecord[]> => {
  try {
    const response = await serverGet<ApiResponse<HealthRecord[]>>(
      `/api/v1/health-records/student/${studentId}`,
      undefined,
      {
        cache: 'force-cache',
        next: {
          revalidate: CACHE_TTL.PHI_STANDARD,
          tags: [`student-${studentId}-health-records`, HEALTH_RECORDS_CACHE_TAGS.RECORDS, CACHE_TAGS.PHI]
        }
      }
    );

    return response.data || [];
  } catch (error) {
    console.error('Failed to get health records:', error);
    return [];
  }
});

/**
 * Get health record by ID with caching
 */
export const getHealthRecordById = cache(async (id: string): Promise<HealthRecord | null> => {
  try {
    const response = await serverGet<ApiResponse<HealthRecord>>(
      `/api/v1/health-records/${id}`,
      undefined,
      {
        cache: 'force-cache',
        next: {
          revalidate: CACHE_TTL.PHI_STANDARD,
          tags: [`health-record-${id}`, HEALTH_RECORDS_CACHE_TAGS.RECORDS, CACHE_TAGS.PHI]
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('Failed to get health record:', error);
    return null;
  }
});

/**
 * Get vital signs for a student with caching
 */
export const getStudentVitalSigns = cache(async (studentId: string): Promise<VitalSigns[]> => {
  try {
    const response = await serverGet<ApiResponse<VitalSigns[]>>(
      `/api/v1/health-records/students/${studentId}/vital-signs`,
      undefined,
      {
        cache: 'force-cache',
        next: {
          revalidate: CACHE_TTL.PHI_STANDARD,
          tags: [`student-${studentId}-vital-signs`, HEALTH_RECORDS_CACHE_TAGS.VITAL_SIGNS, CACHE_TAGS.PHI]
        }
      }
    );

    return response.data || [];
  } catch (error) {
    console.error('Failed to get vital signs:', error);
    return [];
  }
});

/**
 * Get vital signs by ID with caching
 */
export const getVitalSignsById = cache(async (id: string): Promise<VitalSigns | null> => {
  try {
    const response = await serverGet<ApiResponse<VitalSigns>>(
      `/api/v1/health-records/vital-signs/${id}`,
      undefined,
      {
        cache: 'force-cache',
        next: {
          revalidate: CACHE_TTL.PHI_STANDARD,
          tags: [`vital-signs-${id}`, HEALTH_RECORDS_CACHE_TAGS.VITAL_SIGNS, CACHE_TAGS.PHI]
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('Failed to get vital signs:', error);
    return null;
  }
});

/**
 * Get screenings for a student with caching
 */
export const getStudentScreenings = cache(async (studentId: string): Promise<Screening[]> => {
  try {
    const response = await serverGet<ApiResponse<Screening[]>>(
      `/api/v1/health-records/students/${studentId}/screenings`,
      undefined,
      {
        cache: 'force-cache',
        next: {
          revalidate: CACHE_TTL.PHI_STANDARD,
          tags: [`student-${studentId}-screenings`, HEALTH_RECORDS_CACHE_TAGS.SCREENINGS, CACHE_TAGS.PHI]
        }
      }
    );

    return response.data || [];
  } catch (error) {
    console.error('Failed to get screenings:', error);
    return [];
  }
});

/**
 * Get screening by ID with caching
 */
export const getScreeningById = cache(async (id: string): Promise<Screening | null> => {
  try {
    const response = await serverGet<ApiResponse<Screening>>(
      `/api/v1/health-records/screenings/${id}`,
      undefined,
      {
        cache: 'force-cache',
        next: {
          revalidate: CACHE_TTL.PHI_STANDARD,
          tags: [`screening-${id}`, HEALTH_RECORDS_CACHE_TAGS.SCREENINGS, CACHE_TAGS.PHI]
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('Failed to get screening:', error);
    return null;
  }
});

/**
 * Get all health records (admin view) with caching
 */
export const getAllHealthRecords = cache(async (filters?: Record<string, unknown>): Promise<HealthRecord[]> => {
  try {
    const response = await serverGet<ApiResponse<HealthRecord[]>>(
      `/api/v1/health-records`,
      filters as Record<string, string | number | boolean>,
      {
        cache: 'force-cache',
        next: {
          revalidate: CACHE_TTL.PHI_STANDARD,
          tags: [HEALTH_RECORDS_CACHE_TAGS.RECORDS, 'health-records-list', CACHE_TAGS.PHI]
        }
      }
    );

    return response.data || [];
  } catch (error) {
    console.error('Failed to get all health records:', error);
    return [];
  }
});

// ==========================================
// CACHE INVALIDATION
// ==========================================

/**
 * Clear health records cache
 */
export async function clearHealthRecordsCache(resourceType?: string, resourceId?: string): Promise<void> {
  if (resourceType && resourceId) {
    revalidateTag(`${resourceType}-${resourceId}`, 'default');
  }

  // Clear all health records caches
  Object.values(HEALTH_RECORDS_CACHE_TAGS).forEach(tag => {
    revalidateTag(tag, 'default');
  });

  // Clear list caches
  revalidateTag('health-records-list', 'default');
  revalidateTag(CACHE_TAGS.PHI, 'default');

  // Clear paths
  revalidatePath('/health-records', 'page');
  revalidatePath('/students', 'page');
}

/**
 * Clear student-specific health records cache
 */
export async function clearStudentHealthCache(studentId: string): Promise<void> {
  revalidateTag(`student-${studentId}-health-records`, 'default');
  revalidateTag(`student-${studentId}-vital-signs`, 'default');
  revalidateTag(`student-${studentId}-screenings`, 'default');
  revalidatePath(`/students/${studentId}/health-records`, 'page');
}
