/**
 * @fileoverview Report Utility Functions
 * @module lib/actions/reports/utils
 *
 * Utility functions for report management including existence checks,
 * counts, overview data, and cache management.
 */

'use server';

import { cache } from 'react';
import { revalidateTag, revalidatePath } from 'next/cache';

// Import cache functions
import { getReport, getReports } from './reports.cache';

// Types
import type { ReportFilters } from './reports.types';
import { REPORT_CACHE_TAGS } from './reports.types';

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

/**
 * Check if report exists
 */
export async function reportExists(reportId: string): Promise<boolean> {
  const report = await getReport(reportId);
  return report !== null;
}

/**
 * Get report count
 */
export const getReportCount = cache(async (filters?: ReportFilters): Promise<number> => {
  try {
    const reports = await getReports(filters);
    return reports.length;
  } catch {
    return 0;
  }
});

/**
 * Get report overview
 */
export async function getReportOverview(): Promise<{
  totalReports: number;
  completedReports: number;
  scheduledReports: number;
  failedReports: number;
  recentReports: number;
}> {
  try {
    const reports = await getReports();

    return {
      totalReports: reports.length,
      completedReports: reports.filter(r => r.status === 'completed').length,
      scheduledReports: reports.filter(r => r.isScheduled).length,
      failedReports: reports.filter(r => r.status === 'failed').length,
      recentReports: reports.filter(r => {
        const createdAt = new Date(r.createdAt);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return createdAt >= weekAgo;
      }).length,
    };
  } catch {
    return {
      totalReports: 0,
      completedReports: 0,
      scheduledReports: 0,
      failedReports: 0,
      recentReports: 0,
    };
  }
}

/**
 * Clear report cache
 */
export async function clearReportCache(reportId?: string): Promise<void> {
  if (reportId) {
    revalidateTag(`report-${reportId}`, 'default');
  }

  // Clear all report caches
  Object.values(REPORT_CACHE_TAGS).forEach(tag => {
    revalidateTag(tag, 'default');
  });

  // Clear list caches
  revalidateTag('report-list', 'default');
  revalidateTag('report-template-list', 'default');
  revalidateTag('scheduled-reports', 'default');
  revalidateTag('report-stats', 'default');
  revalidateTag('report-dashboard', 'default');

  // Clear paths
  revalidatePath('/reports', 'page');
  revalidatePath('/reports/templates', 'page');
  revalidatePath('/reports/scheduled', 'page');
  revalidatePath('/reports/analytics', 'page');
}
