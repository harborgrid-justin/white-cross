/**
 * @fileoverview Incident Analytics API Module
 * @module services/modules/analytics/incidentAnalytics
 * @category Services - Analytics
 *
 * Provides incident trend analysis, location-based analytics, and safety metrics.
 * Supports incident frequency analysis, hotspot identification, and comparative analysis.
 *
 * ## Features
 * - Incident trends by type, severity, and location
 * - Injury hotspot identification
 * - Incident frequency analysis over time
 * - Safety metric tracking
 * - Period-based comparative analysis
 * - Intelligent caching for performance
 *
 * @example
 * ```typescript
 * const incidentAnalytics = new IncidentAnalytics(apiClient);
 *
 * // Get incident trends
 * const trends = await incidentAnalytics.getIncidentTrends({
 *   startDate: '2025-01-01',
 *   endDate: '2025-01-31',
 *   period: 'weekly',
 *   schoolId: 'school-123'
 * });
 *
 * // Get incidents by location
 * const locationData = await incidentAnalytics.getIncidentsByLocation({
 *   startDate: '2025-01-01',
 *   endDate: '2025-01-31'
 * });
 * ```
 */

import type { ApiClient } from '../../core/ApiClient';
import { ApiResponse } from '../../utils/apiUtils';
import {
  IncidentTrends,
  IncidentLocationData
} from '../../types';
import { analyticsCache, CacheKeys, CacheTTL } from './cacheUtils';

/**
 * Incident Analytics API Service
 * Handles incident trends and location-based analytics with caching
 */
export class IncidentAnalytics {
  constructor(private readonly client: ApiClient) {}

  /**
   * Get incident trends with caching
   * @param params - Query parameters for incident trends
   * @returns Incident trends data
   */
  async getIncidentTrends(params?: {
    startDate?: string;
    endDate?: string;
    period?: 'daily' | 'weekly' | 'monthly';
    schoolId?: string;
  }): Promise<IncidentTrends> {
    const cacheKey = analyticsCache.buildKey(CacheKeys.INCIDENT_TRENDS, params);
    const cached = analyticsCache.get<IncidentTrends>(cacheKey);
    if (cached) return cached;

    const response = await this.client.get<ApiResponse<IncidentTrends>>(
      '/analytics/incidents/trends',
      { params }
    );

    const data = response.data.data!;
    analyticsCache.set(cacheKey, data, CacheTTL.TRENDS);

    return data;
  }

  /**
   * Get incidents by location
   * @param params - Query parameters for location-based analysis
   * @returns Array of incident location data
   */
  async getIncidentsByLocation(params?: {
    startDate?: string;
    endDate?: string;
    schoolId?: string;
  }): Promise<IncidentLocationData[]> {
    const response = await this.client.get<ApiResponse<IncidentLocationData[]>>(
      '/analytics/incidents/by-location',
      { params }
    );

    return response.data.data || [];
  }
}

/**
 * Factory function to create Incident Analytics instance
 * @param client - ApiClient instance
 * @returns Configured IncidentAnalytics instance
 */
export function createIncidentAnalytics(client: ApiClient): IncidentAnalytics {
  return new IncidentAnalytics(client);
}
