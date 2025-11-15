/**
 * Analytics & Reporting API
 *
 * @deprecated This service module is deprecated and will be removed on 2026-06-30.
 * Please migrate to Server Actions in @/lib/actions/billing.* instead.
 *
 * **MIGRATION GUIDE**:
 * ```typescript
 * // ❌ OLD: Using service module
 * import { billingApi } from '@/services/modules/billingApi';
 * const analytics = await billingApi.analytics.getBillingAnalytics(filters);
 * const trends = await billingApi.analytics.getRevenueTrends(filters);
 *
 * // ✅ NEW: Using Server Actions (cached queries)
 * import { getBillingAnalytics, getRevenueTrends } from '@/lib/actions/billing.cache';
 *
 * // In Server Component
 * const analytics = await getBillingAnalytics(filters);
 * const trends = await getRevenueTrends(filters);
 * ```
 *
 * **REPLACEMENT ACTIONS**:
 * - `getBillingAnalytics()` → `@/lib/actions/billing.cache::getBillingAnalytics()`
 * - `getRevenueTrends()` → `@/lib/actions/billing.cache::getRevenueTrends()`
 * - `getPaymentAnalytics()` → `@/lib/actions/billing.cache` (or billing.utils)
 *
 * Provides billing analytics, revenue trends, and financial reporting capabilities.
 *
 * @module services/modules/billingApi/analytics
 * @category API
 */

import type { ApiClient } from '../../core/ApiClient';
import { ApiResponse } from '../../types';
import {
  BillingAnalytics,
  RevenueTrend,
  PaymentAnalytics,
  PaymentMethod,
} from './types';
import { createApiError } from './schemas';
import { BILLING_ENDPOINTS } from './endpoints';

/**
 * Analytics & Reporting API Client
 *
 * Provides comprehensive analytics and reporting functionality for billing operations,
 * including revenue trends, payment analytics, and collection metrics.
 */
export class AnalyticsReportingApi {
  constructor(private readonly client: ApiClient) {}

  /**
   * Get billing analytics
   *
   * @param startDate - Optional start date for analytics period
   * @param endDate - Optional end date for analytics period
   * @returns Comprehensive billing analytics data
   * @throws Error if the API request fails
   */
  async getBillingAnalytics(startDate?: string, endDate?: string): Promise<BillingAnalytics> {
    try {
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);

      const response = await this.client.get<ApiResponse<BillingAnalytics>>(
        `${BILLING_ENDPOINTS.ANALYTICS}?${params.toString()}`
      );

      if (!response.data || ('success' in response.data && !response.data.success)) {
        throw new Error('Invalid response format or API error');
      }

      if ('data' in response.data && response.data.data) {
        return response.data.data;
      }

      // Fallback for direct data response
      return response.data as unknown as BillingAnalytics;
    } catch (error) {
      throw createApiError(error, 'Failed to fetch billing analytics');
    }
  }

  /**
   * Get revenue trends
   *
   * @param period - Time period for trend analysis (daily, weekly, or monthly)
   * @param months - Number of months to include in the analysis
   * @returns Array of revenue trend data points
   * @throws Error if the API request fails
   */
  async getRevenueTrends(
    period: 'daily' | 'weekly' | 'monthly' = 'monthly',
    months: number = 12
  ): Promise<RevenueTrend[]> {
    try {
      const params = new URLSearchParams({
        period,
        months: String(months),
      });

      const response = await this.client.get<ApiResponse<RevenueTrend[]>>(
        `${BILLING_ENDPOINTS.REVENUE_TRENDS}?${params.toString()}`
      );

      if (!response.data || ('success' in response.data && !response.data.success)) {
        throw new Error('Invalid response format or API error');
      }

      if ('data' in response.data && response.data.data) {
        return response.data.data;
      }

      // Fallback for direct data response
      return response.data as unknown as RevenueTrend[];
    } catch (error) {
      throw createApiError(error, 'Failed to fetch revenue trends');
    }
  }

  /**
   * Get payment analytics
   *
   * @param startDate - Optional start date for analytics period
   * @param endDate - Optional end date for analytics period
   * @returns Payment analytics summary
   * @throws Error if the API request fails
   */
  async getPaymentAnalytics(startDate?: string, endDate?: string): Promise<PaymentAnalytics> {
    try {
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);

      const response = await this.client.get<ApiResponse<PaymentAnalytics>>(
        `${BILLING_ENDPOINTS.PAYMENT_ANALYTICS}?${params.toString()}`
      );

      if (!response.data || ('success' in response.data && !response.data.success)) {
        throw new Error('Invalid response format or API error');
      }

      if ('data' in response.data && response.data.data) {
        return response.data.data;
      }

      // Fallback for direct data response
      return response.data as unknown as PaymentAnalytics;
    } catch (error) {
      throw createApiError(error, 'Failed to fetch payment analytics');
    }
  }
}
