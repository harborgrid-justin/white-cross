/**
 * @fileoverview Import Utility Functions
 * @module lib/actions/import.utils
 *
 * Utility functions for import operations including validation,
 * counting, and overview generation.
 */

'use server';

import { cache } from 'react';

// Types
import type { ImportFilters } from './import.types';

// Cache functions
import {
  getImportJob,
  getImportJobs,
  getImportTemplate,
  getImportTemplates,
  getImportAnalytics,
} from './import.cache';

// ==========================================
// VALIDATION UTILITIES
// ==========================================

/**
 * Check if import job exists
 */
export async function importJobExists(jobId: string): Promise<boolean> {
  const job = await getImportJob(jobId);
  return job !== null;
}

/**
 * Check if import template exists
 */
export async function importTemplateExists(templateId: string): Promise<boolean> {
  const template = await getImportTemplate(templateId);
  return template !== null;
}

// ==========================================
// COUNT UTILITIES
// ==========================================

/**
 * Get import job count
 */
export const getImportJobCount = cache(async (filters?: ImportFilters): Promise<number> => {
  try {
    const jobs = await getImportJobs(filters);
    return jobs.length;
  } catch {
    return 0;
  }
});

/**
 * Get import template count
 */
export const getImportTemplateCount = cache(async (format?: string): Promise<number> => {
  try {
    const templates = await getImportTemplates(format);
    return templates.length;
  } catch {
    return 0;
  }
});

// ==========================================
// OVERVIEW UTILITIES
// ==========================================

/**
 * Get import overview
 */
export async function getImportOverview(): Promise<{
  totalJobs: number;
  completedJobs: number;
  processingJobs: number;
  failedJobs: number;
  totalRecordsImported: number;
}> {
  try {
    const jobs = await getImportJobs();
    const analytics = await getImportAnalytics();

    return {
      totalJobs: jobs.length,
      completedJobs: jobs.filter(j => j.status === 'completed').length,
      processingJobs: jobs.filter(j => ['validating', 'processing'].includes(j.status)).length,
      failedJobs: jobs.filter(j => j.status === 'failed').length,
      totalRecordsImported: analytics?.totalRecordsImported || 0,
    };
  } catch {
    return {
      totalJobs: 0,
      completedJobs: 0,
      processingJobs: 0,
      failedJobs: 0,
      totalRecordsImported: 0,
    };
  }
}
