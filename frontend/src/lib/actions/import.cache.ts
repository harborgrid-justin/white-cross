/**
 * @fileoverview Import Cache Management
 * @module lib/actions/import.cache
 *
 * Caching functions and cache tag configurations for import operations.
 * Integrates with Next.js cache() and revalidateTag/revalidatePath.
 */

'use server';

import { cache } from 'react';
import { revalidateTag, revalidatePath } from 'next/cache';

// Core API integrations
import { serverGet } from '@/lib/api/nextjs-client';
import { CACHE_TTL } from '@/lib/cache/constants';

// Types
import type { ApiResponse } from '@/types/api';
import type {
  ImportJob,
  ImportTemplate,
  ImportFilters,
  ImportAnalytics,
} from './import.types';

// ==========================================
// CACHE TAG CONFIGURATION
// ==========================================

export const IMPORT_CACHE_TAGS = {
  JOBS: 'import-jobs',
  TEMPLATES: 'import-templates',
  VALIDATIONS: 'import-validations',
  MAPPINGS: 'import-mappings',
  HISTORY: 'import-history',
} as const;

// ==========================================
// CACHED DATA FUNCTIONS
// ==========================================

/**
 * Get import job by ID with caching
 * Uses Next.js cache() for automatic memoization
 */
export const getImportJob = cache(async (id: string): Promise<ImportJob | null> => {
  try {
    const response = await serverGet<ApiResponse<ImportJob>>(
      `/api/import/jobs/${id}`,
      undefined,
      {
        cache: 'force-cache',
        next: {
          revalidate: CACHE_TTL.SESSION,
          tags: [`import-job-${id}`, IMPORT_CACHE_TAGS.JOBS]
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('Failed to get import job:', error);
    return null;
  }
});

/**
 * Get all import jobs with caching
 */
export const getImportJobs = cache(async (filters?: ImportFilters): Promise<ImportJob[]> => {
  try {
    const response = await serverGet<ApiResponse<ImportJob[]>>(
      `/api/import/jobs`,
      filters as Record<string, string | number | boolean>,
      {
        cache: 'force-cache',
        next: {
          revalidate: CACHE_TTL.SESSION,
          tags: [IMPORT_CACHE_TAGS.JOBS, 'import-job-list']
        }
      }
    );

    return response.data || [];
  } catch (error) {
    console.error('Failed to get import jobs:', error);
    return [];
  }
});

/**
 * Get import template by ID with caching
 */
export const getImportTemplate = cache(async (id: string): Promise<ImportTemplate | null> => {
  try {
    const response = await serverGet<ApiResponse<ImportTemplate>>(
      `/api/import/templates/${id}`,
      undefined,
      {
        cache: 'force-cache',
        next: {
          revalidate: CACHE_TTL.STATIC,
          tags: [`import-template-${id}`, IMPORT_CACHE_TAGS.TEMPLATES]
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('Failed to get import template:', error);
    return null;
  }
});

/**
 * Get all import templates with caching
 */
export const getImportTemplates = cache(async (format?: string): Promise<ImportTemplate[]> => {
  try {
    const params = format ? { format } : undefined;
    const response = await serverGet<ApiResponse<ImportTemplate[]>>(
      `/api/import/templates`,
      params as Record<string, string | number | boolean>,
      {
        cache: 'force-cache',
        next: {
          revalidate: CACHE_TTL.STATIC,
          tags: [IMPORT_CACHE_TAGS.TEMPLATES, 'import-template-list']
        }
      }
    );

    return response.data || [];
  } catch (error) {
    console.error('Failed to get import templates:', error);
    return [];
  }
});

/**
 * Get import analytics with caching
 */
export const getImportAnalytics = cache(async (filters?: Record<string, unknown>): Promise<ImportAnalytics | null> => {
  try {
    const response = await serverGet<ApiResponse<ImportAnalytics>>(
      `/api/import/analytics`,
      filters as Record<string, string | number | boolean>,
      {
        cache: 'force-cache',
        next: {
          revalidate: CACHE_TTL.STATS,
          tags: ['import-analytics', 'import-stats']
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('Failed to get import analytics:', error);
    return null;
  }
});

/**
 * Clear import cache
 */
export async function clearImportCache(resourceType?: string, resourceId?: string): Promise<void> {
  try {
    if (resourceType && resourceId) {
      // Handle version compatibility for revalidateTag
      (revalidateTag as unknown as (tag: string) => void)(`${resourceType}-${resourceId}`);
    }

    // Clear all import caches
    Object.values(IMPORT_CACHE_TAGS).forEach(tag => {
      (revalidateTag as unknown as (tag: string) => void)(tag);
    });

    // Clear list caches
    (revalidateTag as unknown as (tag: string) => void)('import-job-list');
    (revalidateTag as unknown as (tag: string) => void)('import-template-list');
    (revalidateTag as unknown as (tag: string) => void)('import-stats');
    (revalidateTag as unknown as (tag: string) => void)('import-dashboard');
  } catch (error) {
    console.warn('[Import] Cache invalidation warning:', error);
  }

  // Clear paths - these typically work across versions
  revalidatePath('/import', 'page');
  revalidatePath('/import/jobs', 'page');
  revalidatePath('/import/templates', 'page');
  revalidatePath('/import/analytics', 'page');
}
