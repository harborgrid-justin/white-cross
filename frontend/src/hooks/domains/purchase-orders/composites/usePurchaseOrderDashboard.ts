/**
 * Purchase Order Dashboard Hook
 *
 * Aggregates multiple data sources for dashboard display.
 *
 * @module hooks/domains/purchase-orders/composites/usePurchaseOrderDashboard
 */

import { useQuery, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import { purchaseOrderKeys } from '../config';

/**
 * Purchase Order Dashboard Composite Hook.
 *
 * Fetches and aggregates data for dashboard display including pending approvals,
 * recent activity, analytics, and quick actions.
 *
 * @param {string} userId - User ID to fetch personalized dashboard data
 * @param {UseQueryOptions} [options] - React Query options
 * @returns {UseQueryResult} Dashboard data including pending approvals, analytics, and quick actions
 *
 * @example
 * ```tsx
 * const { data: dashboard, isLoading } = usePurchaseOrderDashboard('user-123');
 *
 * return (
 *   <div>
 *     <PendingApprovals items={dashboard?.pendingApprovals.items} />
 *     <RecentActivity orders={dashboard?.recentActivity.purchaseOrders} />
 *     <AnalyticsSummary data={dashboard?.analytics} />
 *     <QuickActions actions={dashboard?.quickActions} />
 *   </div>
 * );
 * ```
 */
export const usePurchaseOrderDashboard = (
  userId: string,
  options?: UseQueryOptions<any, Error>
) => {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ['purchase-orders', 'dashboard', userId],
    queryFn: async () => {
      // Fetch multiple related data sets in parallel
      const [pendingApprovals, recentPOs, analytics] = await Promise.all([
        queryClient.fetchQuery({
          queryKey: purchaseOrderKeys.pendingApprovals(userId),
          queryFn: () => [], // This would be your actual API call
        }),
        queryClient.fetchQuery({
          queryKey: purchaseOrderKeys.purchaseOrdersList({ limit: 10, sortBy: 'created_at', sortOrder: 'desc' }),
          queryFn: () => [], // This would be your actual API call
        }),
        queryClient.fetchQuery({
          queryKey: purchaseOrderKeys.analytics({ timeframe: 'month' }),
          queryFn: () => ({}), // This would be your actual API call
        }),
      ]);

      // Aggregate and transform data for dashboard display
      return {
        pendingApprovals: {
          count: pendingApprovals.length,
          urgent: pendingApprovals.filter((pa: any) => pa.priority === 'HIGH').length,
          items: pendingApprovals.slice(0, 5),
        },
        recentActivity: {
          purchaseOrders: recentPOs.slice(0, 5),
          totalThisMonth: recentPOs.length,
        },
        analytics: {
          totalSpent: analytics.totalSpent || 0,
          averageProcessingTime: analytics.averageProcessingTime || 0,
          onTimeDeliveryRate: analytics.onTimeDeliveryRate || 0,
          costSavings: analytics.costSavings || 0,
        },
        quickActions: [
          {
            key: 'create-po',
            label: 'Create Purchase Order',
            icon: 'plus',
            available: true
          },
          {
            key: 'pending-approvals',
            label: `Pending Approvals (${pendingApprovals.length})`,
            icon: 'clock',
            available: pendingApprovals.length > 0
          },
          {
            key: 'receive-items',
            label: 'Receive Items',
            icon: 'package',
            available: true
          },
          {
            key: 'reports',
            label: 'View Reports',
            icon: 'chart',
            available: true
          },
        ],
      };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
};
