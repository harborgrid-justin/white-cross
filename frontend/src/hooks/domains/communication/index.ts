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

// Re-export query keys
export { communicationQueryKeys } from './query-keys';

// Re-export message hooks
export { useUserMessages, useSendMessage } from './messages';

// Re-export notification hooks
export { useUnreadNotifications, useMarkNotificationRead } from './notifications';
