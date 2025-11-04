/**
 * @fileoverview Immunization Utility Functions
 * @module lib/actions/immunizations/utils
 *
 * Utility functions for immunization management.
 * Includes record existence checks, counts, and overview data.
 */

'use server';

import { cache } from 'react';
import type { ImmunizationFilters } from './immunizations.types';
import {
  getImmunizationRecord,
  getImmunizationRecords,
  getImmunizationAnalytics,
} from './immunizations.cache';

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

/**
 * Check if immunization record exists
 */
export async function immunizationRecordExists(recordId: string): Promise<boolean> {
  const record = await getImmunizationRecord(recordId);
  return record !== null;
}

/**
 * Get immunization record count
 */
export const getImmunizationRecordCount = cache(async (filters?: ImmunizationFilters): Promise<number> => {
  try {
    const records = await getImmunizationRecords(filters);
    return records.length;
  } catch {
    return 0;
  }
});

/**
 * Get immunization overview
 */
export async function getImmunizationOverview(): Promise<{
  totalRecords: number;
  uniqueStudents: number;
  completedSeries: number;
  pendingDoses: number;
  averageCompliance: number;
}> {
  try {
    const records = await getImmunizationRecords();
    const analytics = await getImmunizationAnalytics();

    return {
      totalRecords: records.length,
      uniqueStudents: analytics?.uniqueStudents || 0,
      completedSeries: records.filter(r => r.seriesComplete).length,
      pendingDoses: analytics?.pendingDoses || 0,
      averageCompliance: analytics?.complianceRate || 0,
    };
  } catch {
    return {
      totalRecords: 0,
      uniqueStudents: 0,
      completedSeries: 0,
      pendingDoses: 0,
      averageCompliance: 0,
    };
  }
}
