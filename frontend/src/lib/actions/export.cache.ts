/**
 * @fileoverview Export Cache Functions
 * @module app/export/cache
 *
 * Cached data retrieval functions for export operations.
 * Uses Next.js cache() for automatic memoization and revalidation.
 */

'use server';

import { cache } from 'react';
import { serverGet } from '@/lib/api/nextjs-client';
import { API_ENDPOINTS } from '@/constants/api';
import { CACHE_TTL } from '@/lib/cache/constants';
import type { ApiResponse } from '@/types';
import type {
  ExportJob,
  ExportTemplate,
  ExportAnalytics,
  ExportFilters
} from './export.types';
import { EXPORT_CACHE_TAGS } from './export.types';

// ==========================================
// EXPORT JOB CACHE FUNCTIONS
// ==========================================

/**
 * Get export job by ID with caching
 * Uses Next.js cache() for automatic memoization
 */
export const getExportJob = cache(async (id: string): Promise<ExportJob | null> => {
  try {
    const response = await serverGet<ApiResponse<ExportJob>>(
      `${API_ENDPOINTS.ADMIN.CONFIGURATIONS}/export/jobs/${id}`,
      undefined,
      {
        cache: 'force-cache',
        next: {
          revalidate: CACHE_TTL.SESSION,
          tags: [`export-job-${id}`, EXPORT_CACHE_TAGS.JOBS]
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('Failed to get export job:', error);
    return null;
  }
});

/**
 * Get all export jobs with caching
 */
export const getExportJobs = cache(async (filters?: ExportFilters): Promise<ExportJob[]> => {
  try {
    const response = await serverGet<ApiResponse<ExportJob[]>>(
      `${API_ENDPOINTS.ADMIN.CONFIGURATIONS}/export/jobs`,
      filters as Record<string, string | number | boolean>,
      {
        cache: 'force-cache',
        next: {
          revalidate: CACHE_TTL.SESSION,
          tags: [EXPORT_CACHE_TAGS.JOBS, 'export-job-list']
        }
      }
    );

    return response.data || [];
  } catch (error) {
    console.error('Failed to get export jobs:', error);
    return [];
  }
});

// ==========================================
// EXPORT TEMPLATE CACHE FUNCTIONS
// ==========================================

/**
 * Get export template by ID with caching
 */
export const getExportTemplate = cache(async (id: string): Promise<ExportTemplate | null> => {
  try {
    const response = await serverGet<ApiResponse<ExportTemplate>>(
      `${API_ENDPOINTS.ADMIN.CONFIGURATIONS}/export/templates/${id}`,
      undefined,
      {
        cache: 'force-cache',
        next: {
          revalidate: CACHE_TTL.STATIC,
          tags: [`export-template-${id}`, EXPORT_CACHE_TAGS.TEMPLATES]
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('Failed to get export template:', error);
    return null;
  }
});

/**
 * Get all export templates with caching
 */
export const getExportTemplates = cache(async (format?: string): Promise<ExportTemplate[]> => {
  try {
    const params = format ? { format } : undefined;
    const response = await serverGet<ApiResponse<ExportTemplate[]>>(
      `${API_ENDPOINTS.ADMIN.CONFIGURATIONS}/export/templates`,
      params as Record<string, string | number | boolean>,
      {
        cache: 'force-cache',
        next: {
          revalidate: CACHE_TTL.STATIC,
          tags: [EXPORT_CACHE_TAGS.TEMPLATES, 'export-template-list']
        }
      }
    );

    return response.data || [];
  } catch (error) {
    console.error('Failed to get export templates:', error);
    return [];
  }
});

// ==========================================
// ANALYTICS CACHE FUNCTIONS
// ==========================================

/**
 * Get export analytics with caching
 */
export const getExportAnalytics = cache(async (filters?: Record<string, unknown>): Promise<ExportAnalytics | null> => {
  try {
    const response = await serverGet<ApiResponse<ExportAnalytics>>(
      `${API_ENDPOINTS.ANALYTICS.REPORTS}`,
      filters as Record<string, string | number | boolean>,
      {
        cache: 'force-cache',
        next: {
          revalidate: CACHE_TTL.STATS,
          tags: ['export-analytics', 'export-stats']
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('Failed to get export analytics:', error);
    return null;
  }
});
