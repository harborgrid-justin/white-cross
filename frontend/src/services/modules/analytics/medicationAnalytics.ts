/**
 * @fileoverview Medication Analytics API Module
 * @module services/modules/analytics/medicationAnalytics
 * @category Services - Analytics
 *
 * Provides medication usage analytics, adherence tracking, and compliance monitoring.
 * Supports medication pattern analysis, stock level tracking, and cost analysis.
 *
 * ## Features
 * - Medication usage pattern analysis
 * - Adherence rate tracking
 * - Dosage compliance monitoring
 * - Stock level analytics
 * - Cost per medication analysis
 * - Student-specific and school-specific metrics
 * - Intelligent caching for performance
 *
 * @example
 * ```typescript
 * const medicationAnalytics = new MedicationAnalytics(apiClient);
 *
 * // Get medication usage analytics
 * const usage = await medicationAnalytics.getMedicationUsage({
 *   startDate: '2025-01-01',
 *   endDate: '2025-01-31',
 *   schoolId: 'school-123'
 * });
 *
 * // Get medication adherence data
 * const adherence = await medicationAnalytics.getMedicationAdherence({
 *   studentId: 'student-123',
 *   startDate: '2025-01-01',
 *   endDate: '2025-01-31'
 * });
 * ```
 */

import type { ApiClient } from '../../core/ApiClient';
import { ApiResponse } from '../../utils/apiUtils';
import {
  MedicationUsage,
  MedicationAdherence
} from '../../types';
import { analyticsCache, CacheKeys, CacheTTL } from './cacheUtils';

/**
 * Medication Analytics API Service
 * Handles medication usage and adherence analytics with caching
 */
export class MedicationAnalytics {
  constructor(private readonly client: ApiClient) {}

  /**
   * Get medication usage analytics with caching
   * @param params - Query parameters for medication usage
   * @returns Array of medication usage data
   */
  async getMedicationUsage(params?: {
    startDate?: string;
    endDate?: string;
    medicationId?: string;
    schoolId?: string;
  }): Promise<MedicationUsage[]> {
    const cacheKey = analyticsCache.buildKey(CacheKeys.MEDICATION_USAGE, params);
    const cached = analyticsCache.get<MedicationUsage[]>(cacheKey);
    if (cached) return cached;

    const response = await this.client.get<ApiResponse<MedicationUsage[]>>(
      '/analytics/medications/usage',
      { params }
    );

    const data = response.data.data || [];
    analyticsCache.set(cacheKey, data, CacheTTL.METRICS);

    return data;
  }

  /**
   * Get medication adherence data
   * @param params - Query parameters for adherence tracking
   * @returns Array of medication adherence data
   */
  async getMedicationAdherence(params?: {
    startDate?: string;
    endDate?: string;
    studentId?: string;
    schoolId?: string;
  }): Promise<MedicationAdherence[]> {
    const response = await this.client.get<ApiResponse<MedicationAdherence[]>>(
      '/analytics/medications/adherence',
      { params }
    );

    return response.data.data || [];
  }
}

/**
 * Factory function to create Medication Analytics instance
 * @param client - ApiClient instance
 * @returns Configured MedicationAnalytics instance
 */
export function createMedicationAnalytics(client: ApiClient): MedicationAnalytics {
  return new MedicationAnalytics(client);
}
