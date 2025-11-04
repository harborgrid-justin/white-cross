/**
 * @fileoverview Health Analytics API Module
 * @module services/modules/analytics/healthAnalytics
 * @category Services - Analytics
 *
 * Provides health metrics tracking, trend analysis, and population health insights.
 * Supports student-specific and school-specific health data with intelligent caching.
 *
 * ## Features
 * - Student health metrics tracking (vitals, conditions, medications)
 * - Health trend analysis over time with comparison periods
 * - Population health insights
 * - School-level and student-level health metrics
 * - Intelligent caching for performance optimization
 *
 * @example
 * ```typescript
 * const healthAnalytics = new HealthAnalytics(apiClient);
 *
 * // Get health metrics with caching
 * const metrics = await healthAnalytics.getHealthMetrics({
 *   startDate: '2025-01-01',
 *   endDate: '2025-01-31',
 *   schoolId: 'school-123'
 * });
 *
 * // Get health trends with comparison
 * const trends = await healthAnalytics.getHealthTrends({
 *   startDate: '2025-01-01',
 *   endDate: '2025-01-31',
 *   period: 'weekly',
 *   includeComparison: true
 * });
 *
 * // Get student-specific metrics
 * const studentMetrics = await healthAnalytics.getStudentHealthMetrics('student-123', {
 *   startDate: '2025-01-01',
 *   endDate: '2025-01-31'
 * });
 * ```
 */

import type { ApiClient } from '../../core/ApiClient';
import { ApiResponse } from '../../utils/apiUtils';
import {
  HealthMetrics,
  HealthTrends,
  ComparisonPeriod
} from '../../types';
import { analyticsCache, CacheKeys, CacheTTL } from './cacheUtils';

/**
 * Health Analytics API Service
 * Handles health metrics and trend analytics with caching
 */
export class HealthAnalytics {
  constructor(private readonly client: ApiClient) {}

  /**
   * Get health metrics with caching and validation
   * @param params - Query parameters for filtering health metrics
   * @returns Array of health metrics
   */
  async getHealthMetrics(params?: {
    startDate?: string;
    endDate?: string;
    metricType?: string;
    schoolId?: string;
    studentId?: string;
  }): Promise<HealthMetrics[]> {
    // Check cache
    const cacheKey = analyticsCache.buildKey(CacheKeys.HEALTH_METRICS, params);
    const cached = analyticsCache.get<HealthMetrics[]>(cacheKey);
    if (cached) return cached;

    // Fetch from API
    const response = await this.client.get<ApiResponse<HealthMetrics[]>>(
      '/analytics/health-metrics',
      { params }
    );

    const data = response.data.data || [];
    analyticsCache.set(cacheKey, data, CacheTTL.METRICS);

    return data;
  }

  /**
   * Get health trends with comparison support
   * @param params - Query parameters for health trends
   * @returns Health trends data with optional comparison
   */
  async getHealthTrends(params?: {
    startDate?: string;
    endDate?: string;
    period?: 'daily' | 'weekly' | 'monthly';
    includeComparison?: boolean;
    comparisonPeriod?: ComparisonPeriod;
  }): Promise<HealthTrends> {
    const cacheKey = analyticsCache.buildKey(CacheKeys.HEALTH_TRENDS, params);
    const cached = analyticsCache.get<HealthTrends>(cacheKey);
    if (cached) return cached;

    const response = await this.client.get<ApiResponse<HealthTrends>>(
      '/analytics/health-trends',
      { params }
    );

    const data = response.data.data!;
    analyticsCache.set(cacheKey, data, CacheTTL.TRENDS);

    return data;
  }

  /**
   * Get health metrics for specific student
   * @param studentId - Student identifier
   * @param params - Additional query parameters
   * @returns Student health metrics
   * @throws Error if studentId is not provided
   */
  async getStudentHealthMetrics(studentId: string, params?: {
    startDate?: string;
    endDate?: string;
    metricType?: string;
  }): Promise<HealthMetrics[]> {
    if (!studentId) {
      throw new Error('Student ID is required');
    }

    const response = await this.client.get<ApiResponse<HealthMetrics[]>>(
      `/analytics/health-metrics/student/${studentId}`,
      { params }
    );

    return response.data.data || [];
  }

  /**
   * Get health metrics for specific school
   * @param schoolId - School identifier
   * @param params - Additional query parameters
   * @returns School health metrics
   * @throws Error if schoolId is not provided
   */
  async getSchoolHealthMetrics(schoolId: string, params?: {
    startDate?: string;
    endDate?: string;
    metricType?: string;
  }): Promise<HealthMetrics[]> {
    if (!schoolId) {
      throw new Error('School ID is required');
    }

    const response = await this.client.get<ApiResponse<HealthMetrics[]>>(
      `/analytics/health-metrics/school/${schoolId}`,
      { params }
    );

    return response.data.data || [];
  }
}

/**
 * Factory function to create Health Analytics instance
 * @param client - ApiClient instance
 * @returns Configured HealthAnalytics instance
 */
export function createHealthAnalytics(client: ApiClient): HealthAnalytics {
  return new HealthAnalytics(client);
}
