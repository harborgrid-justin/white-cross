/**
 * Notification Communication Hooks
 *
 * Hooks for real-time notification management, unread tracking,
 * and notification read status updates.
 *
 * @module hooks/domains/communication/notifications
 * @author White Cross Healthcare Platform
 * @version 3.0.0
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { communicationApi } from '@/services';
import { useApiError } from '../../shared/useApiError';
import { communicationQueryKeys } from './query-keys';

/**
 * Fetches unread notifications with automatic polling for real-time updates.
 *
 * Retrieves all unread notifications for the current user with automatic
 * background polling to ensure timely delivery of critical healthcare
 * communications, emergency alerts, and system notifications. Ideal for
 * notification badges, alert centers, and real-time communication displays.
 *
 * @param {any} [options] - Additional TanStack Query options to customize query behavior
 *
 * @returns {UseQueryResult<Notification[], Error>} Query result object containing:
 *   - data: Array of unread notification objects with type, priority, content, and timestamps
 *   - isLoading: Boolean indicating if the initial fetch is in progress
 *   - isFetching: Boolean indicating if any fetch (including polling) is in progress
 *   - error: Error object if the query failed, or null
 *   - refetch: Function to manually trigger immediate notification check
 *
 * @example
 * ```typescript
 * // Basic notification badge implementation
 * const { data: notifications } = useUnreadNotifications();
 * const unreadCount = notifications?.length || 0;
 *
 * return (
 *   <NotificationBell>
 *     {unreadCount > 0 && <Badge>{unreadCount}</Badge>}
 *   </NotificationBell>
 * );
 * ```
 *
 * @example
 * ```typescript
 * // Notification center with manual refresh
 * const { data: notifications, refetch } = useUnreadNotifications({
 *   refetchInterval: 30 * 1000, // Poll more frequently (every 30 seconds)
 * });
 *
 * return (
 *   <NotificationCenter>
 *     <RefreshButton onClick={() => refetch()} />
 *     {notifications?.map(notif => (
 *       <NotificationItem
 *         key={notif.id}
 *         notification={notif}
 *         priority={notif.priority}
 *       />
 *     ))}
 *   </NotificationCenter>
 * );
 * ```
 *
 * @example
 * ```typescript
 * // Emergency alert monitoring
 * const { data: notifications } = useUnreadNotifications();
 * const emergencyAlerts = notifications?.filter(n => n.priority === 'URGENT');
 *
 * useEffect(() => {
 *   if (emergencyAlerts && emergencyAlerts.length > 0) {
 *     showEmergencyModal(emergencyAlerts[0]);
 *   }
 * }, [emergencyAlerts]);
 * ```
 *
 * @remarks
 * **Cache Strategy:**
 * - Stale time: 30 seconds (data considered fresh for half a minute)
 * - Automatic polling: Refetches every 60 seconds for real-time updates
 * - Short stale time ensures notifications appear quickly
 *
 * **Polling Behavior:**
 * - Background refetch occurs every minute even when data is fresh
 * - Polling continues while component is mounted
 * - Polling pauses when browser tab is inactive (controlled by TanStack Query)
 *
 * **Performance Considerations:**
 * - Lightweight queries optimized for frequent polling
 * - Consider increasing refetchInterval for battery-sensitive devices
 * - Polling automatically stops when component unmounts
 *
 * **Use Cases:**
 * - Notification bell/badge indicators
 * - Real-time alert centers
 * - Emergency broadcast reception
 * - System notification displays
 * - Parent communication alerts
 *
 * **Healthcare-Specific Notifications:**
 * - Medication administration reminders
 * - Student health incident alerts
 * - Emergency parent contact requests
 * - Compliance policy updates
 * - Training completion deadlines
 *
 * @see {@link useMarkNotificationRead} for marking notifications as read
 * @see {@link communicationQueryKeys} for cache key structure
 */
export function useUnreadNotifications(options?: any) {
  const { handleError } = useApiError();

  return useQuery({
    queryKey: communicationQueryKeys.notifications.unread(),
    queryFn: async () => {
      try {
        return await communicationApi.getUnreadNotifications();
      } catch (error: any) {
        throw handleError(error, 'fetch_notifications');
      }
    },
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 60 * 1000, // Poll every minute
    ...options,
  });
}

/**
 * Marks a notification as read with automatic cache updates and badge count refresh.
 *
 * Mutation hook for marking individual notifications as read, triggering real-time
 * updates to notification counts, badge displays, and unread notification lists.
 * Supports both manual user actions and automatic read tracking on notification view.
 *
 * @param {UseMutationOptions<void, Error, string>} [options] - Additional TanStack Query mutation options
 *
 * @returns {UseMutationResult<void, Error, string>} Mutation result object containing:
 *   - mutate: Function to mark notification as read (fire-and-forget)
 *   - mutateAsync: Async function to mark notification as read (returns promise)
 *   - isLoading: Boolean indicating if the update is in progress
 *   - isSuccess: Boolean indicating if notification was marked read successfully
 *   - error: Error object if update failed, or null
 *   - reset: Function to reset mutation state
 *
 * @example
 * ```typescript
 * // Mark notification as read on click
 * const markAsRead = useMarkNotificationRead();
 *
 * const handleNotificationClick = (notificationId: string) => {
 *   markAsRead.mutate(notificationId);
 *   navigateToDetails(notificationId);
 * };
 *
 * return (
 *   <NotificationList>
 *     {notifications.map(notif => (
 *       <NotificationItem
 *         key={notif.id}
 *         onClick={() => handleNotificationClick(notif.id)}
 *       />
 *     ))}
 *   </NotificationList>
 * );
 * ```
 *
 * @example
 * ```typescript
 * // Automatically mark as read when notification is viewed
 * const markAsRead = useMarkNotificationRead();
 * const { notificationId } = useParams();
 *
 * useEffect(() => {
 *   if (notificationId) {
 *     // Mark as read after 2 second view delay
 *     const timer = setTimeout(() => {
 *       markAsRead.mutate(notificationId);
 *     }, 2000);
 *     return () => clearTimeout(timer);
 *   }
 * }, [notificationId, markAsRead]);
 * ```
 *
 * @example
 * ```typescript
 * // Mark all notifications as read with loading state
 * const markAsRead = useMarkNotificationRead();
 * const { data: unreadNotifications } = useUnreadNotifications();
 *
 * const markAllAsRead = async () => {
 *   for (const notification of unreadNotifications || []) {
 *     await markAsRead.mutateAsync(notification.id);
 *   }
 *   toast.success('All notifications marked as read');
 * };
 * ```
 *
 * @remarks
 * **Cache Invalidation:**
 * - Automatically invalidates all notification queries on success
 * - Triggers immediate refetch of unread notification counts
 * - Updates notification badge numbers in real-time
 * - No explicit success toast (silent operation for better UX)
 *
 * **Read Tracking:**
 * - Marks notification with read timestamp in database
 * - Updates user's last-read notification pointer
 * - Notification remains accessible in read message history
 * - Does not delete the notification
 *
 * **Performance:**
 * - Lightweight mutation optimized for frequent use
 * - No blocking UI during update
 * - Failed updates retry automatically (TanStack Query default)
 *
 * **Use Cases:**
 * - Dismissing notification badge items
 * - Auto-marking notifications on view
 * - Bulk "mark all as read" operations
 * - Notification interaction tracking
 * - Read receipt generation for sender
 *
 * **Healthcare-Specific Applications:**
 * - Acknowledging medication administration alerts
 * - Confirming receipt of emergency broadcasts
 * - Tracking compliance training notifications
 * - Parent acknowledgment of health incident reports
 * - Policy update confirmation tracking
 *
 * @see {@link useUnreadNotifications} for fetching unread notifications
 * @see {@link communicationQueryKeys} for cache key structure
 */
export function useMarkNotificationRead() {
  const queryClient = useQueryClient();
  const { handleError } = useApiError();

  return useMutation({
    mutationFn: async (notificationId: string) => {
      try {
        return await communicationApi.markAsRead(notificationId);
      } catch (error: any) {
        throw handleError(error, 'mark_notification_read');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: communicationQueryKeys.notifications.all() });
    },
  });
}
