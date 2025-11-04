/**
 * Budget Status Query Hooks
 *
 * Provides TanStack Query hooks for fetching real-time budget status data including
 * utilization monitoring, alert notifications, and health metrics with automatic polling.
 *
 * @module hooks/domains/budgets/queries/useBudgetStatusQueries
 *
 * @remarks
 * **Architecture:**
 * - Uses TanStack Query v5 for data fetching and caching
 * - Query keys managed through budgetKeys factory for consistency
 * - Automatic background refetching with configurable polling
 * - Retry logic with exponential backoff (3 attempts)
 *
 * **Cache Strategy:**
 * - Status: Real-time data with automatic polling (default 1 minute)
 * - Stale time: 0 (always refetch to ensure current data)
 * - Polling pauses when page is hidden for battery optimization
 *
 * @see {@link budgetKeys} for query key factory
 * @see {@link useBudgetMutations} for data modification hooks
 *
 * @since 1.0.0
 */

import { useQuery } from '@tanstack/react-query';
import { budgetKeys } from '../budgetQueryKeys';

/**
 * Fetches real-time budget status with utilization alerts and notifications.
 *
 * Provides live budget health monitoring with automatic polling for status updates,
 * utilization percentages, and alert notifications for budget thresholds.
 *
 * @param {string} budgetId - Budget ID to monitor
 * @param {Object} [options] - Configuration options
 * @param {number} [options.pollingInterval=60000] - Polling interval in milliseconds (default: 1 minute)
 *
 * @returns {UseQueryResult} TanStack Query result object
 * @returns {Object} returns.data - Real-time status object
 * @returns {string} returns.data.budgetId - Budget identifier
 * @returns {'draft' | 'approved' | 'active' | 'archived'} returns.data.status - Current budget status
 * @returns {number} returns.data.utilizationPercentage - Percentage of budget used (0-100+)
 * @returns {'low' | 'medium' | 'high' | 'critical'} returns.data.alertLevel - Alert severity level
 * @returns {string} returns.data.lastUpdated - ISO timestamp of last status update
 * @returns {Array} returns.data.notifications - Array of alert notifications
 *
 * @example
 * ```typescript
 * function BudgetStatusMonitor({ budgetId }: Props) {
 *   const { data: status, isLoading } = useBudgetStatus(budgetId, {
 *     pollingInterval: 30000 // Poll every 30 seconds
 *   });
 *
 *   if (isLoading) return <StatusSkeleton />;
 *   if (!status) return null;
 *
 *   return (
 *     <Card>
 *       <h3>Budget Status</h3>
 *       <Badge variant={getStatusVariant(status.status)}>
 *         {status.status}
 *       </Badge>
 *
 *       <ProgressBar
 *         value={status.utilizationPercentage}
 *         max={100}
 *         variant={getUtilizationVariant(status.alertLevel)}
 *       />
 *       <p>{status.utilizationPercentage}% utilized</p>
 *
 *       {status.notifications.length > 0 && (
 *         <div>
 *           <h4>Alerts</h4>
 *           {status.notifications.map((notification, index) => (
 *             <Alert key={index} variant={notification.type}>
 *               {notification.message}
 *               <small>{new Date(notification.timestamp).toLocaleString()}</small>
 *             </Alert>
 *           ))}
 *         </div>
 *       )}
 *     </Card>
 *   );
 * }
 *
 * // Example: Critical alert banner
 * function BudgetAlertBanner({ budgetId }: Props) {
 *   const { data: status } = useBudgetStatus(budgetId);
 *
 *   if (status?.alertLevel !== 'critical') return null;
 *
 *   return (
 *     <AlertBanner variant="danger">
 *       <strong>Critical Budget Alert!</strong>
 *       {status.notifications
 *         .filter(n => n.type === 'alert')
 *         .map(n => <p key={n.timestamp}>{n.message}</p>)
 *       }
 *     </AlertBanner>
 *   );
 * }
 * ```
 *
 * @remarks
 * **TanStack Query Configuration:**
 * - Query Key: budgetKeys.status(budgetId)
 * - Stale Time: 0 (always refetch)
 * - Refetch Interval: Configurable via options.pollingInterval (default: 60000ms)
 * - Enabled: Only when budgetId is truthy
 * - Refetch on Mount: Yes
 * - Refetch on Window Focus: Yes
 *
 * **Alert Levels:**
 * - low: <60% utilization
 * - medium: 60-80% utilization
 * - high: 80-95% utilization
 * - critical: >95% utilization or over budget
 *
 * **Notification Types:**
 * - warning: Approaching threshold (80%)
 * - alert: Threshold exceeded (95%)
 * - info: Status changes or approvals
 *
 * **Polling Strategy:**
 * - Default: 1-minute intervals
 * - Configurable from 10 seconds to 5 minutes
 * - Polling pauses when page is hidden (battery optimization)
 * - Resumes when page becomes visible
 *
 * **Real-time Updates:**
 * - Automatic polling keeps status current
 * - Critical alerts update within polling interval
 * - Consider WebSocket for sub-second updates
 *
 * **Performance:**
 * - Lightweight status endpoint (minimal payload)
 * - Polling only active for mounted components
 * - Cleanup on unmount prevents memory leaks
 *
 * @see {@link useBudgetAnalytics} for detailed analytics
 * @see {@link useBudgetWorkflow} for workflow with status
 *
 * @since 1.0.0
 */
export const useBudgetStatus = (budgetId: string, options?: { pollingInterval?: number }) => {
  return useQuery({
    queryKey: budgetKeys.status(budgetId),
    queryFn: async (): Promise<{
      budgetId: string;
      status: 'draft' | 'approved' | 'active' | 'archived';
      utilizationPercentage: number;
      alertLevel: 'low' | 'medium' | 'high' | 'critical';
      lastUpdated: string;
      notifications: Array<{
        type: 'warning' | 'alert' | 'info';
        message: string;
        timestamp: string;
      }>;
    }> => {
      const response = await fetch(`/api/budgets/${budgetId}/status`);
      if (!response.ok) throw new Error('Failed to fetch budget status');
      return response.json();
    },
    enabled: !!budgetId,
    refetchInterval: options?.pollingInterval || 60000, // Default 1 minute polling
  });
};
