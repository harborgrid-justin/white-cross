/**
 * useMessages Hook
 *
 * React Query hook for fetching message history with infinite scroll
 * Provides automatic pagination, caching, and real-time updates
 */

import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { messageApi } from '@/services/messaging';
import { useMessageStore } from '@/stores/messaging';
import type { MessageDto } from '@/services/messaging';

export const messageKeys = {
  all: ['messages'] as const,
  lists: () => [...messageKeys.all, 'list'] as const,
  list: (conversationId: string) => [...messageKeys.lists(), conversationId] as const,
  details: () => [...messageKeys.all, 'detail'] as const,
  detail: (id: string) => [...messageKeys.details(), id] as const,
};

interface UseMessagesOptions {
  conversationId: string;
  limit?: number;
  enabled?: boolean;
}

export function useMessages({
  conversationId,
  limit = 50,
  enabled = true,
}: UseMessagesOptions) {
  const queryClient = useQueryClient();
  const addMessages = useMessageStore((state) => state.addMessages);
  const setLoadingMessages = useMessageStore((state) => state.setLoadingMessages);

  const query = useInfiniteQuery({
    queryKey: messageKeys.list(conversationId),
    queryFn: async ({ pageParam }) => {
      setLoadingMessages(conversationId, true);
      try {
        const response = await messageApi.getByConversation(conversationId, {
          before: pageParam,
          limit,
        });

        // Update Zustand store with fetched messages
        addMessages(conversationId, response.messages);

        return response;
      } finally {
        setLoadingMessages(conversationId, false);
      }
    },
    getNextPageParam: (lastPage) => {
      return lastPage.hasMore ? lastPage.nextCursor : undefined;
    },
    initialPageParam: undefined as string | undefined,
    enabled: enabled && !!conversationId,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes (formerly cacheTime)
    refetchOnWindowFocus: true,
    refetchOnMount: 'always',
  });

  /**
   * Add new message to cache (optimistic update)
   */
  const addMessageToCache = (message: MessageDto) => {
    queryClient.setQueryData(
      messageKeys.list(conversationId),
      (old: any) => {
        if (!old) return old;

        const firstPage = old.pages[0];
        if (!firstPage) return old;

        return {
          ...old,
          pages: [
            {
              ...firstPage,
              messages: [...firstPage.messages, message],
            },
            ...old.pages.slice(1),
          ],
        };
      }
    );
  };

  /**
   * Update message in cache
   */
  const updateMessageInCache = (messageId: string, updates: Partial<MessageDto>) => {
    queryClient.setQueryData(
      messageKeys.list(conversationId),
      (old: any) => {
        if (!old) return old;

        return {
          ...old,
          pages: old.pages.map((page: any) => ({
            ...page,
            messages: page.messages.map((msg: MessageDto) =>
              msg.id === messageId ? { ...msg, ...updates } : msg
            ),
          })),
        };
      }
    );
  };

  /**
   * Remove message from cache
   */
  const removeMessageFromCache = (messageId: string) => {
    queryClient.setQueryData(
      messageKeys.list(conversationId),
      (old: any) => {
        if (!old) return old;

        return {
          ...old,
          pages: old.pages.map((page: any) => ({
            ...page,
            messages: page.messages.filter((msg: MessageDto) => msg.id !== messageId),
          })),
        };
      }
    );
  };

  /**
   * Invalidate and refetch messages
   */
  const refetch = () => {
    return queryClient.invalidateQueries({
      queryKey: messageKeys.list(conversationId),
    });
  };

  // Flatten all messages from all pages
  const allMessages = query.data?.pages.flatMap((page) => page.messages) || [];

  return {
    ...query,
    messages: allMessages,
    addMessageToCache,
    updateMessageInCache,
    removeMessageFromCache,
    refetch,
  };
}
