/**
 * @fileoverview Report Cache Functions
 * @module lib/actions/reports/cache
 *
 * Cached data fetching functions for report management with Next.js cache integration.
 * Uses React cache() for automatic memoization and Next.js revalidation tags.
 */

'use server';

import { cache } from 'react';

// Core API integrations
import { serverGet } from '@/lib/api/server';
import { CACHE_TTL } from '@/lib/cache/constants';

// Types
import type {
  Report,
  ReportTemplate,
  ReportFilters,
  ReportAnalytics,
} from './reports.types';
import { REPORT_CACHE_TAGS } from './reports.types';

// ==========================================
// CACHED DATA FUNCTIONS
// ==========================================

/**
 * Get report by ID with caching
 * Uses Next.js cache() for automatic memoization
 */
export const getReport = cache(async (id: string): Promise<Report | null> => {
  try {
    const response = await serverGet<{ success: boolean; data: Report }>(
      `/api/reports/${id}`,
      undefined,
      {
        cache: 'force-cache',
        next: {
          revalidate: CACHE_TTL.SESSION,
          tags: [`report-${id}`, REPORT_CACHE_TAGS.REPORTS]
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('Failed to get report:', error);
    return null;
  }
});

/**
 * Get all reports with caching
 */
export const getReports = cache(async (filters?: ReportFilters): Promise<Report[]> => {
  try {
    const response = await serverGet<{ success: boolean; data: Report[] }>(
      `/api/reports`,
      filters as Record<string, string | number | boolean>,
      {
        cache: 'force-cache',
        next: {
          revalidate: CACHE_TTL.SESSION,
          tags: [REPORT_CACHE_TAGS.REPORTS, 'report-list']
        }
      }
    );

    return response.data || [];
  } catch (error) {
    console.error('Failed to get reports:', error);
    return [];
  }
});

/**
 * Get report templates with caching
 */
export const getReportTemplates = cache(async (): Promise<ReportTemplate[]> => {
  try {
    const response = await serverGet<{ success: boolean; data: ReportTemplate[] }>(
      `/api/reports/templates`,
      undefined,
      {
        cache: 'force-cache',
        next: {
          revalidate: CACHE_TTL.STATIC,
          tags: [REPORT_CACHE_TAGS.TEMPLATES, 'report-template-list']
        }
      }
    );

    return response.data || [];
  } catch (error) {
    console.error('Failed to get report templates:', error);
    return [];
  }
});

/**
 * Get report analytics with caching
 */
export const getReportAnalytics = cache(async (filters?: Record<string, unknown>): Promise<ReportAnalytics | null> => {
  try {
    const response = await serverGet<{ success: boolean; data: ReportAnalytics }>(
      `/api/reports/analytics`,
      filters as Record<string, string | number | boolean>,
      {
        cache: 'force-cache',
        next: {
          revalidate: CACHE_TTL.STATS,
          tags: [REPORT_CACHE_TAGS.ANALYTICS, 'report-stats']
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('Failed to get report analytics:', error);
    return null;
  }
});

/**
 * Get scheduled reports with caching
 */
export const getScheduledReports = cache(async (): Promise<Report[]> => {
  try {
    const response = await serverGet<{ success: boolean; data: Report[] }>(
      `/api/reports/scheduled`,
      undefined,
      {
        cache: 'force-cache',
        next: {
          revalidate: CACHE_TTL.PHI_FREQUENT,
          tags: [REPORT_CACHE_TAGS.SCHEDULES, 'scheduled-reports']
        }
      }
    );

    return response.data || [];
  } catch (error) {
    console.error('Failed to get scheduled reports:', error);
    return [];
  }
});
