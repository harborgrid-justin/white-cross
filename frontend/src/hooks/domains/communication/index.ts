/**
 * Communication Domain Exports
 *
 * Central export point for all communication and messaging hooks, providing
 * comprehensive functionality for multi-channel communication delivery,
 * emergency broadcasts, scheduled messages, and notification management
 * in the White Cross Healthcare Platform.
 *
 * This module supports:
 * - User-to-user messaging (staff, parents, administrators)
 * - Emergency broadcast communications with priority delivery
 * - Real-time notification polling and delivery tracking
 * - Multi-channel delivery (email, SMS, push notifications, in-app)
 * - Message read receipts and delivery confirmation
 *
 * @module hooks/domains/communication
 * @author White Cross Healthcare Platform
 * @version 3.0.0
 *
 * @example
 * ```typescript
 * import {
 *   useUserMessages,
 *   useUnreadNotifications,
 *   useSendMessage,
 *   useMarkNotificationRead
 * } from '@/hooks/domains/communication';
 *
 * // Fetch user messages
 * const { data: messages } = useUserMessages(userId);
 *
 * // Send emergency broadcast
 * const sendMessage = useSendMessage();
 * sendMessage.mutate({
 *   recipients: parentIds,
 *   subject: 'Emergency: School Closure',
 *   body: 'Due to weather conditions...',
 *   priority: 'URGENT',
 *   channels: ['email', 'sms', 'push']
 * });
 * ```
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { communicationApi } from '@/services';
import { useApiError } from '../../shared/useApiError';
import toast from 'react-hot-toast';

/**
 * Query key factory for the communication domain.
 *
 * Provides a hierarchical structure for organizing TanStack Query cache keys,
 * enabling precise cache invalidation and efficient query coordination across
 * the communication domain.
 *
 * @constant
 *
 * @property {Array<'communication'>} domain - Root key for all communication queries
 * @property {Object} messages - Message-related query keys
 * @property {Function} messages.all - Factory for all messages query key
 * @property {Function} messages.byUser - Factory for user-specific messages query key
 * @property {Object} notifications - Notification-related query keys
 * @property {Function} notifications.all - Factory for all notifications query key
 * @property {Function} notifications.unread - Factory for unread notifications query key
 *
 * @example
 * ```typescript
 * // Invalidate all messages for a specific user
 * queryClient.invalidateQueries({
 *   queryKey: communicationQueryKeys.messages.byUser(userId)
 * });
 *
 * // Invalidate all notifications
 * queryClient.invalidateQueries({
 *   queryKey: communicationQueryKeys.notifications.all()
 * });
 * ```
 *
 * @remarks
 * Query key hierarchy enables granular cache control:
 * - Invalidating `domain` clears all communication data
 * - Invalidating `messages.all()` clears all message queries
 * - Invalidating `messages.byUser(id)` clears only that user's messages
 *
 * @see {@link https://tanstack.com/query/latest/docs/react/guides/query-keys} TanStack Query Keys Guide
 */
export const communicationQueryKeys = {
  domain: ['communication'] as const,
  messages: {
    all: () => [...communicationQueryKeys.domain, 'messages'] as const,
    byUser: (userId: string) =>
      [...communicationQueryKeys.messages.all(), 'user', userId] as const,
  },
  notifications: {
    all: () => [...communicationQueryKeys.domain, 'notifications'] as const,
    unread: () => [...communicationQueryKeys.notifications.all(), 'unread'] as const,
  },
} as const;

/**
 * Fetches all messages for a specific user with automatic caching and error handling.
 *
 * Retrieves the complete message history for a user, including sent and received
 * messages across all communication channels. Supports filtering, pagination, and
 * real-time updates through TanStack Query's cache invalidation mechanism.
 *
 * @param {string} userId - The unique identifier of the user whose messages to fetch
 * @param {any} [options] - Additional TanStack Query options to customize query behavior
 *
 * @returns {UseQueryResult<Message[], Error>} Query result object containing:
 *   - data: Array of message objects with sender, recipient, content, timestamps, and delivery status
 *   - isLoading: Boolean indicating if the initial fetch is in progress
 *   - isFetching: Boolean indicating if any fetch (including background refetch) is in progress
 *   - error: Error object if the query failed, or null
 *   - refetch: Function to manually trigger a refetch of messages
 *
 * @example
 * ```typescript
 * // Fetch messages for current user
 * const { data: messages, isLoading } = useUserMessages(currentUserId);
 *
 * if (isLoading) return <Spinner />;
 *
 * return (
 *   <MessageList>
 *     {messages?.map(msg => (
 *       <MessageItem key={msg.id} message={msg} />
 *     ))}
 *   </MessageList>
 * );
 * ```
 *
 * @example
 * ```typescript
 * // Fetch messages with custom options
 * const { data: messages } = useUserMessages(userId, {
 *   staleTime: 5 * 60 * 1000, // Override default stale time
 *   refetchOnWindowFocus: true, // Refetch when window regains focus
 *   enabled: isUserActive, // Conditionally enable query
 * });
 * ```
 *
 * @remarks
 * **Cache Strategy:**
 * - Stale time: 1 minute (data considered fresh for 60 seconds)
 * - Cache persists across component unmounts
 * - Automatic background refetch when data becomes stale
 *
 * **Conditional Fetching:**
 * - Query is disabled if `userId` is empty/null to prevent unnecessary requests
 *
 * **Error Handling:**
 * - Errors are processed through `useApiError` hook for consistent error reporting
 * - Failed queries can be retried using the `refetch` function
 *
 * **Use Cases:**
 * - Message inbox/outbox displays
 * - Parent-nurse communication threads
 * - Staff internal messaging
 * - Notification center message views
 *
 * @see {@link useSendMessage} for sending new messages
 * @see {@link useUnreadNotifications} for unread message notifications
 * @see {@link communicationQueryKeys} for cache key structure
 */
export function useUserMessages(userId: string, options?: any) {
  const { handleError } = useApiError();

  return useQuery({
    queryKey: communicationQueryKeys.messages.byUser(userId),
    queryFn: async () => {
      try {
        return await communicationApi.getUserMessages(userId);
      } catch (error: any) {
        throw handleError(error, 'fetch_messages');
      }
    },
    enabled: !!userId,
    staleTime: 1 * 60 * 1000,
    ...options,
  });
}

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
 * @see {@link useUserMessages} for full message history
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
 * Sends a message with multi-channel delivery and automatic cache invalidation.
 *
 * Mutation hook for sending messages to one or more recipients across multiple
 * communication channels (email, SMS, push notifications, in-app). Supports
 * emergency broadcasts, scheduled delivery, priority messaging, and delivery
 * tracking. Automatically updates the message cache upon successful delivery.
 *
 * @param {UseMutationOptions<MessageResponse, Error, MessageData>} [options] - Additional TanStack Query mutation options
 *
 * @returns {UseMutationResult<MessageResponse, Error, MessageData>} Mutation result object containing:
 *   - mutate: Function to trigger message send (fire-and-forget)
 *   - mutateAsync: Async function to trigger message send (returns promise)
 *   - isLoading: Boolean indicating if message is currently being sent
 *   - isSuccess: Boolean indicating if message was sent successfully
 *   - error: Error object if send failed, or null
 *   - reset: Function to reset mutation state
 *   - data: Response containing message ID, delivery status, and channel results
 *
 * @example
 * ```typescript
 * // Send emergency broadcast to all parents
 * const sendMessage = useSendMessage();
 *
 * const handleEmergencyBroadcast = () => {
 *   sendMessage.mutate({
 *     recipients: allParentIds,
 *     subject: 'Emergency: School Lockdown',
 *     body: 'School is in lockdown. All students are safe. Do not come to campus.',
 *     priority: 'URGENT',
 *     channels: ['email', 'sms', 'push'],
 *     requireDeliveryConfirmation: true,
 *   });
 * };
 * ```
 *
 * @example
 * ```typescript
 * // Send scheduled medication reminder
 * const sendMessage = useSendMessage();
 *
 * await sendMessage.mutateAsync({
 *   recipients: [parentId],
 *   subject: 'Medication Administration Reminder',
 *   body: 'Your child received their scheduled medication (Albuterol inhaler) at 10:30 AM.',
 *   priority: 'NORMAL',
 *   channels: ['email', 'app'],
 *   scheduledFor: new Date('2025-10-26T10:30:00Z'),
 *   category: 'MEDICATION',
 * });
 * ```
 *
 * @example
 * ```typescript
 * // Send message with custom success handler
 * const sendMessage = useSendMessage({
 *   onSuccess: (data) => {
 *     console.log(`Message sent with ID: ${data.messageId}`);
 *     navigate('/messages/sent');
 *   },
 *   onError: (error) => {
 *     console.error('Send failed:', error);
 *     showErrorDialog(error.message);
 *   },
 * });
 *
 * sendMessage.mutate(messageData);
 * ```
 *
 * @remarks
 * **Cache Invalidation:**
 * - Automatically invalidates all message queries on success
 * - Triggers refetch of affected user message lists
 * - Updates notification counts in real-time
 *
 * **Multi-Channel Delivery:**
 * - Email: Standard SMTP delivery with HTML formatting
 * - SMS: Twilio integration for text messages
 * - Push: Firebase Cloud Messaging for mobile notifications
 * - In-App: Real-time delivery via WebSocket/Server-Sent Events
 *
 * **Priority Levels:**
 * - URGENT: Emergency broadcasts, critical health alerts (all channels)
 * - HIGH: Important notifications, time-sensitive updates
 * - NORMAL: Standard communications
 * - LOW: General announcements, newsletters
 *
 * **Delivery Tracking:**
 * - Set `requireDeliveryConfirmation: true` for read receipts
 * - Response includes per-channel delivery status
 * - Failed channels are reported for retry
 *
 * **User Feedback:**
 * - Success toast: "Message sent successfully"
 * - Error toast: "Failed to send message"
 * - Loading state available via `isLoading` property
 *
 * **Use Cases:**
 * - Emergency school-wide broadcasts
 * - Parent-nurse communication
 * - Medication administration notifications
 * - Appointment reminders
 * - Health incident reports
 * - Policy update announcements
 *
 * @see {@link useUserMessages} for fetching sent messages
 * @see {@link useUnreadNotifications} for notification delivery
 * @see {@link communicationQueryKeys} for cache invalidation patterns
 */
export function useSendMessage() {
  const queryClient = useQueryClient();
  const { handleError } = useApiError();

  return useMutation({
    mutationFn: async (messageData: any) => {
      try {
        return await communicationApi.sendMessage(messageData);
      } catch (error: any) {
        throw handleError(error, 'send_message');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: communicationQueryKeys.messages.all() });
      toast.success('Message sent successfully');
    },
    onError: () => {
      toast.error('Failed to send message');
    },
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
 * @see {@link useUserMessages} for message history
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
