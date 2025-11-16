/**
 * Purchase Order Analytics Query Hooks
 *
 * Provides React Query hooks for purchase order analytics and reporting:
 * - Performance metrics and KPIs
 * - Spending analysis and trends
 * - Vendor performance tracking
 * - Dashboard aggregations
 * - Statistics and reports
 *
 * @module hooks/domains/purchase-orders/queries/analytics
 */

import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { serverGet } from '@/lib/api/server';
import { PURCHASE_ORDERS_ENDPOINTS } from '@/constants/api/admin';
import { useApiError } from '../../../shared/useApiError';
import {
  purchaseOrderKeys,
  PURCHASE_ORDERS_CACHE_CONFIG,
  PurchaseOrder,
  POApprovalWorkflow,
  POAnalytics,
} from '../config';

// Analytics Queries
export const usePOAnalytics = (
  filters?: any,
  options?: UseQueryOptions<POAnalytics, Error>
) => {
  const { handleError } = useApiError();

  return useQuery({
    queryKey: purchaseOrderKeys.analytics(filters),
    queryFn: async () => {
      try {
        const response = await serverGet(PURCHASE_ORDERS_ENDPOINTS.STATISTICS, {
          params: filters,
        });
        return response.data;
      } catch (error) {
        handleError(error);
        throw error;
      }
    },
    staleTime: PURCHASE_ORDERS_CACHE_CONFIG.DEFAULT_STALE_TIME,
    ...options,
    meta: {
      errorMessage: 'Failed to load purchase order analytics'
    },
  });
};

export const usePOSpendingAnalysis = (
  timeframe: string = 'month',
  options?: UseQueryOptions<any, Error>
) => {
  const { handleError } = useApiError();

  return useQuery({
    queryKey: purchaseOrderKeys.spendingAnalysis(timeframe),
    queryFn: async () => {
      try {
        const response = await serverGet(`${PURCHASE_ORDERS_ENDPOINTS.BASE}/analytics/spending`, {
          params: { timeframe },
        });
        return response.data;
      } catch (error) {
        handleError(error);
        throw error;
      }
    },
    staleTime: PURCHASE_ORDERS_CACHE_CONFIG.DEFAULT_STALE_TIME,
    ...options,
    meta: {
      errorMessage: 'Failed to load spending analysis'
    },
  });
};

export const usePOVendorPerformance = (
  vendorId?: string,
  options?: UseQueryOptions<any[], Error>
) => {
  const { handleError } = useApiError();

  return useQuery({
    queryKey: purchaseOrderKeys.vendorPerformance(vendorId),
    queryFn: async () => {
      try {
        const endpoint = vendorId
          ? `${PURCHASE_ORDERS_ENDPOINTS.BASE}/analytics/vendors/${vendorId}`
          : `${PURCHASE_ORDERS_ENDPOINTS.BASE}/analytics/vendors`;
        const response = await serverGet(endpoint);
        return response.data;
      } catch (error) {
        handleError(error);
        throw error;
      }
    },
    staleTime: PURCHASE_ORDERS_CACHE_CONFIG.DEFAULT_STALE_TIME,
    ...options,
    meta: {
      errorMessage: 'Failed to load vendor performance'
    },
  });
};

// Dashboard Queries
export const usePODashboard = (
  options?: UseQueryOptions<any, Error>
) => {
  const { handleError } = useApiError();

  return useQuery({
    queryKey: ['purchase-orders', 'dashboard'],
    queryFn: async () => {
      try {
        const [pendingPOs, recentPOs, analytics, pendingApprovals] = await Promise.all([
          serverGet(PURCHASE_ORDERS_ENDPOINTS.PENDING),
          serverGet(PURCHASE_ORDERS_ENDPOINTS.BASE, {
            params: { limit: 5, sortBy: 'created_at', sortOrder: 'desc' }
          }),
          serverGet(PURCHASE_ORDERS_ENDPOINTS.STATISTICS),
          serverGet(`${PURCHASE_ORDERS_ENDPOINTS.BASE}/approvals`, {
            params: { status: 'PENDING', limit: 5 }
          }),
        ]);

        return {
          pendingPurchaseOrders: pendingPOs.data,
          recentPurchaseOrders: recentPOs.data,
          analytics: analytics.data,
          pendingApprovals: pendingApprovals.data,
          stats: {
            totalPOs: pendingPOs.data?.length || 0,
            pendingApprovals: pendingApprovals.data?.length || 0,
            totalSpent: analytics.data?.totalSpent || 0,
            averageProcessingTime: analytics.data?.averageProcessingTime || 0,
          },
        };
      } catch (error) {
        handleError(error);
        throw error;
      }
    },
    staleTime: PURCHASE_ORDERS_CACHE_CONFIG.DEFAULT_STALE_TIME,
    ...options,
    meta: {
      errorMessage: 'Failed to load purchase order dashboard'
    },
  });
};

// Statistics Queries
export const usePOStatistics = (
  timeframe?: 'week' | 'month' | 'quarter' | 'year',
  options?: UseQueryOptions<any, Error>
) => {
  const { handleError } = useApiError();

  return useQuery({
    queryKey: ['purchase-orders', 'statistics', timeframe],
    queryFn: async () => {
      try {
        const response = await serverGet(PURCHASE_ORDERS_ENDPOINTS.STATISTICS, {
          params: { timeframe },
        });
        const analytics = response.data;

        return {
          orderStats: {
            total: analytics.totalOrders || 0,
            approved: analytics.approvedOrders || 0,
            pending: analytics.pendingOrders || 0,
            rejected: analytics.rejectedOrders || 0,
          },
          financialStats: {
            totalSpent: analytics.totalSpent || 0,
            averageOrderValue: analytics.averageOrderValue || 0,
            budgetUtilization: analytics.budgetUtilization || 0,
          },
          processingStats: {
            averageApprovalTime: analytics.averageApprovalTime || 0,
            averageDeliveryTime: analytics.averageDeliveryTime || 0,
            onTimeDeliveryRate: analytics.onTimeDeliveryRate || 0,
          },
          vendorStats: {
            totalVendors: analytics.totalVendors || 0,
            topVendorsBySpend: analytics.topVendorsBySpend || [],
            vendorPerformanceScore: analytics.vendorPerformanceScore || 0,
          },
        };
      } catch (error) {
        handleError(error);
        throw error;
      }
    },
    staleTime: PURCHASE_ORDERS_CACHE_CONFIG.DEFAULT_STALE_TIME,
    ...options,
    meta: {
      errorMessage: 'Failed to load purchase order statistics'
    },
  });
};

// Reports Queries
export const usePOReports = (
  type: 'spending' | 'vendor-performance' | 'approval-times' | 'department-analysis',
  filters?: any,
  options?: UseQueryOptions<any[], Error>
) => {
  const { handleError } = useApiError();

  return useQuery({
    queryKey: ['purchase-orders', 'reports', type, filters],
    queryFn: async () => {
      try {
        let endpoint: string;
        let params: any = {};

        switch (type) {
          case 'spending':
            endpoint = `${PURCHASE_ORDERS_ENDPOINTS.BASE}/analytics/spending`;
            params = { timeframe: filters?.timeframe || 'month' };
            break;
          case 'vendor-performance':
            endpoint = filters?.vendorId
              ? `${PURCHASE_ORDERS_ENDPOINTS.BASE}/analytics/vendors/${filters.vendorId}`
              : `${PURCHASE_ORDERS_ENDPOINTS.BASE}/analytics/vendors`;
            break;
          case 'approval-times':
            endpoint = `${PURCHASE_ORDERS_ENDPOINTS.BASE}/approvals`;
            params = filters || {};
            break;
          case 'department-analysis':
            endpoint = PURCHASE_ORDERS_ENDPOINTS.BASE;
            params = filters || {};
            break;
          default:
            throw new Error(`Unknown report type: ${type}`);
        }

        const response = await serverGet(endpoint, { params });
        return response.data;
      } catch (error) {
        handleError(error);
        throw error;
      }
    },
    staleTime: PURCHASE_ORDERS_CACHE_CONFIG.DEFAULT_STALE_TIME,
    ...options,
    meta: {
      errorMessage: 'Failed to load purchase order reports'
    },
  });
};
