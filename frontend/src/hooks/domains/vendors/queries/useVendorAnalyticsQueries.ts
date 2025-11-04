/**
 * Vendor Analytics and Performance Query Hooks
 *
 * Provides TanStack Query hooks for fetching vendor analytics and performance data.
 *
 * @module hooks/domains/vendors/queries/useVendorAnalyticsQueries
 */

import { useQuery } from '@tanstack/react-query';
import { vendorKeys } from '../config';

/**
 * Fetches vendor analytics data including spending, performance trends, and risk assessment.
 *
 * @param {string} vendorId - Vendor ID to fetch analytics for
 * @param {string} period - Optional time period for analytics (monthly, quarterly, yearly)
 * @returns TanStack Query result with analytics data and query states
 */
export const useVendorAnalytics = (vendorId: string, period?: 'monthly' | 'quarterly' | 'yearly') => {
  return useQuery({
    queryKey: vendorKeys.analytics(vendorId, period),
    queryFn: async (): Promise<{
      totalSpent: number;
      averageOrderValue: number;
      onTimeDeliveryRate: number;
      qualityScore: number;
      costSavings: number;

      monthlySpending: Array<{
        month: string;
        amount: number;
        orderCount: number;
      }>;

      performanceTrends: Array<{
        period: string;
        deliveryRate: number;
        qualityScore: number;
        costEffectiveness: number;
      }>;

      riskAssessment: {
        overallRisk: 'LOW' | 'MEDIUM' | 'HIGH';
        riskFactors: Array<{
          category: string;
          level: 'LOW' | 'MEDIUM' | 'HIGH';
          description: string;
        }>;
      };
    }> => {
      const params = period ? `?period=${period}` : '';
      const response = await fetch(`/api/vendors/${vendorId}/analytics${params}`);
      if (!response.ok) throw new Error('Failed to fetch analytics');
      return response.json();
    },
    enabled: !!vendorId,
  });
};

/**
 * Fetches vendor performance data including KPIs, issues, and improvement suggestions.
 *
 * @param {string} vendorId - Vendor ID to fetch performance data for
 * @returns TanStack Query result with performance data and query states
 */
export const useVendorPerformance = (vendorId: string) => {
  return useQuery({
    queryKey: vendorKeys.performance(vendorId),
    queryFn: async (): Promise<{
      currentRating: number;
      ratingHistory: Array<{
        date: string;
        rating: number;
        evaluationType: string;
      }>;

      kpis: {
        onTimeDelivery: {
          current: number;
          target: number;
          trend: 'UP' | 'DOWN' | 'STABLE';
        };
        qualityScore: {
          current: number;
          target: number;
          trend: 'UP' | 'DOWN' | 'STABLE';
        };
        costEffectiveness: {
          current: number;
          target: number;
          trend: 'UP' | 'DOWN' | 'STABLE';
        };
      };

      recentIssues: Array<{
        date: string;
        type: string;
        description: string;
        severity: 'LOW' | 'MEDIUM' | 'HIGH';
        resolved: boolean;
      }>;

      improvements: Array<{
        area: string;
        suggestion: string;
        priority: 'LOW' | 'MEDIUM' | 'HIGH';
      }>;
    }> => {
      const response = await fetch(`/api/vendors/${vendorId}/performance`);
      if (!response.ok) throw new Error('Failed to fetch performance');
      return response.json();
    },
    enabled: !!vendorId,
    refetchInterval: 300000, // Refresh every 5 minutes
  });
};
