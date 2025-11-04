/**
 * Communication Query Keys
 *
 * Query key factory for the communication domain, providing hierarchical
 * structure for organizing TanStack Query cache keys.
 *
 * @module hooks/domains/communication/query-keys
 * @author White Cross Healthcare Platform
 * @version 3.0.0
 */

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
