/**
 * @fileoverview Appointment Analytics API Module
 * @module services/modules/analytics/appointmentAnalytics
 * @category Services - Analytics
 *
 * Provides appointment analytics, no-show rate tracking, and resource utilization metrics.
 * Supports appointment volume trends, nurse utilization, and wait time analysis.
 *
 * ## Features
 * - Appointment volume trends over time
 * - No-show rate analysis
 * - Nurse utilization metrics
 * - Appointment type distribution
 * - Wait time analysis
 * - Period-based comparative analysis
 * - Intelligent caching for performance
 *
 * @example
 * ```typescript
 * const appointmentAnalytics = new AppointmentAnalytics(apiClient);
 *
 * // Get appointment trends
 * const trends = await appointmentAnalytics.getAppointmentTrends({
 *   startDate: '2025-01-01',
 *   endDate: '2025-01-31',
 *   period: 'weekly',
 *   schoolId: 'school-123'
 * });
 *
 * // Get no-show rate
 * const noShowRate = await appointmentAnalytics.getNoShowRate({
 *   startDate: '2025-01-01',
 *   endDate: '2025-01-31',
 *   schoolId: 'school-123'
 * });
 * ```
 */

import type { ApiClient } from '../../core/ApiClient';
import { ApiResponse } from '../../utils/apiUtils';
import {
  AppointmentTrends,
  NoShowRate
} from '../../types';
import { analyticsCache, CacheKeys, CacheTTL } from './cacheUtils';

/**
 * Appointment Analytics API Service
 * Handles appointment trends and no-show analytics with caching
 */
export class AppointmentAnalytics {
  constructor(private readonly client: ApiClient) {}

  /**
   * Get appointment trends with caching
   * @param params - Query parameters for appointment trends
   * @returns Appointment trends data
   */
  async getAppointmentTrends(params?: {
    startDate?: string;
    endDate?: string;
    period?: 'daily' | 'weekly' | 'monthly';
    schoolId?: string;
  }): Promise<AppointmentTrends> {
    const cacheKey = analyticsCache.buildKey(CacheKeys.APPOINTMENT_TRENDS, params);
    const cached = analyticsCache.get<AppointmentTrends>(cacheKey);
    if (cached) return cached;

    const response = await this.client.get<ApiResponse<AppointmentTrends>>(
      '/analytics/appointments/trends',
      { params }
    );

    const data = response.data.data!;
    analyticsCache.set(cacheKey, data, CacheTTL.TRENDS);

    return data;
  }

  /**
   * Get appointment no-show rate
   * @param params - Query parameters for no-show rate analysis
   * @returns No-show rate data
   */
  async getNoShowRate(params?: {
    startDate?: string;
    endDate?: string;
    schoolId?: string;
  }): Promise<NoShowRate> {
    const response = await this.client.get<ApiResponse<NoShowRate>>(
      '/analytics/appointments/no-show-rate',
      { params }
    );

    return response.data.data!;
  }
}

/**
 * Factory function to create Appointment Analytics instance
 * @param client - ApiClient instance
 * @returns Configured AppointmentAnalytics instance
 */
export function createAppointmentAnalytics(client: ApiClient): AppointmentAnalytics {
  return new AppointmentAnalytics(client);
}
