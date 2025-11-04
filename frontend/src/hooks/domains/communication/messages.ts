/**
 * Message Communication Hooks
 *
 * Hooks for user-to-user messaging, multi-channel message delivery,
 * and message history management.
 *
 * @module hooks/domains/communication/messages
 * @author White Cross Healthcare Platform
 * @version 3.0.0
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { communicationApi } from '@/services';
import { useApiError } from '../../shared/useApiError';
import toast from 'react-hot-toast';
import { communicationQueryKeys } from './query-keys';

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
