/**
 * useUnreadCount Hook
 *
 * React Query hook for tracking unread message counts
 * Provides real-time updates via polling or WebSocket
 */

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { conversationApi } from '@/services/messaging';
import { useConversationStore } from '@/stores/messaging';
import { conversationKeys } from './useConversations';

interface UseUnreadCountOptions {
  enabled?: boolean;
  refetchInterval?: number;
}

export function useUnreadCount({
  enabled = true,
  refetchInterval = 30000, // 30 seconds
}: UseUnreadCountOptions = {}) {
  const queryClient = useQueryClient();
  const updateConversation = useConversationStore((state) => state.updateConversation);

  const query = useQuery({
    queryKey: conversationKeys.unreadCount(),
    queryFn: async () => {
      const response = await conversationApi.getUnreadCount();

      // Update unread counts in conversation store
      response.byConversation.forEach(({ conversationId, count }) => {
        updateConversation(conversationId, { unreadCount: count });
      });

      return response;
    },
    enabled,
    staleTime: 1000 * 20, // 20 seconds
    gcTime: 1000 * 60 * 5, // 5 minutes
    refetchInterval,
    refetchOnWindowFocus: true,
  });

  /**
   * Manually update unread count for a conversation
   */
  const updateUnreadCount = (conversationId: string, count: number) => {
    queryClient.setQueryData(
      conversationKeys.unreadCount(),
      (old: any) => {
        if (!old) return old;

        const existingIndex = old.byConversation.findIndex(
          (item: any) => item.conversationId === conversationId
        );

        let byConversation;
        if (existingIndex !== -1) {
          byConversation = [...old.byConversation];
          byConversation[existingIndex] = { conversationId, count };
        } else {
          byConversation = [...old.byConversation, { conversationId, count }];
        }

        const total = byConversation.reduce((sum: number, item: any) => sum + item.count, 0);

        return {
          total,
          byConversation,
        };
      }
    );

    // Also update in conversation store
    updateConversation(conversationId, { unreadCount: count });
  };

  /**
   * Increment unread count for a conversation
   */
  const incrementUnreadCount = (conversationId: string, amount = 1) => {
    queryClient.setQueryData(
      conversationKeys.unreadCount(),
      (old: any) => {
        if (!old) {
          return {
            total: amount,
            byConversation: [{ conversationId, count: amount }],
          };
        }

        const existingIndex = old.byConversation.findIndex(
          (item: any) => item.conversationId === conversationId
        );

        let byConversation;
        if (existingIndex !== -1) {
          byConversation = [...old.byConversation];
          byConversation[existingIndex] = {
            conversationId,
            count: byConversation[existingIndex].count + amount,
          };
        } else {
          byConversation = [...old.byConversation, { conversationId, count: amount }];
        }

        const total = byConversation.reduce((sum: number, item: any) => sum + item.count, 0);

        return {
          total,
          byConversation,
        };
      }
    );
  };

  /**
   * Clear unread count for a conversation
   */
  const clearUnreadCount = (conversationId: string) => {
    updateUnreadCount(conversationId, 0);
  };

  return {
    ...query,
    totalUnread: query.data?.total || 0,
    unreadByConversation: query.data?.byConversation || [],
    updateUnreadCount,
    incrementUnreadCount,
    clearUnreadCount,
  };
}
