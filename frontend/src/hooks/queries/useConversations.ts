/**
 * useConversations Hook
 *
 * React Query hook for fetching conversations with filters
 * Integrates with Zustand conversation store
 */

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { conversationApi } from '@/services/messaging';
import { useConversationStore } from '@/stores/messaging';
import type { ConversationFilters, ConversationDto } from '@/services/messaging';

export const conversationKeys = {
  all: ['conversations'] as const,
  lists: () => [...conversationKeys.all, 'list'] as const,
  list: (filters?: ConversationFilters) =>
    [...conversationKeys.lists(), filters] as const,
  details: () => [...conversationKeys.all, 'detail'] as const,
  detail: (id: string) => [...conversationKeys.details(), id] as const,
  unreadCount: () => [...conversationKeys.all, 'unreadCount'] as const,
};

interface UseConversationsOptions {
  filters?: ConversationFilters;
  enabled?: boolean;
  refetchInterval?: number;
}

export function useConversations({
  filters,
  enabled = true,
  refetchInterval,
}: UseConversationsOptions = {}) {
  const queryClient = useQueryClient();
  const setConversations = useConversationStore((state) => state.setConversations);
  const setLoading = useConversationStore((state) => state.setLoading);
  const setError = useConversationStore((state) => state.setError);

  const query = useQuery({
    queryKey: conversationKeys.list(filters),
    queryFn: async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await conversationApi.getConversations(filters);

        // Update Zustand store
        setConversations(response.conversations);

        return response;
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to fetch conversations';
        setError(message);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    enabled,
    staleTime: 1000 * 60 * 2, // 2 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
    refetchOnWindowFocus: true,
    refetchInterval,
  });

  /**
   * Add conversation to cache
   */
  const addConversationToCache = (conversation: ConversationDto) => {
    queryClient.setQueryData(
      conversationKeys.list(filters),
      (old: any) => {
        if (!old) return old;

        // Check for duplicates
        const exists = old.conversations.some(
          (c: ConversationDto) => c.id === conversation.id
        );

        if (exists) return old;

        return {
          ...old,
          conversations: [conversation, ...old.conversations],
          total: old.total + 1,
        };
      }
    );
  };

  /**
   * Update conversation in cache
   */
  const updateConversationInCache = (
    conversationId: string,
    updates: Partial<ConversationDto>
  ) => {
    queryClient.setQueryData(
      conversationKeys.list(filters),
      (old: any) => {
        if (!old) return old;

        return {
          ...old,
          conversations: old.conversations.map((c: ConversationDto) =>
            c.id === conversationId ? { ...c, ...updates } : c
          ),
        };
      }
    );
  };

  /**
   * Remove conversation from cache
   */
  const removeConversationFromCache = (conversationId: string) => {
    queryClient.setQueryData(
      conversationKeys.list(filters),
      (old: any) => {
        if (!old) return old;

        return {
          ...old,
          conversations: old.conversations.filter(
            (c: ConversationDto) => c.id !== conversationId
          ),
          total: Math.max(0, old.total - 1),
        };
      }
    );
  };

  /**
   * Prefetch conversation
   */
  const prefetchConversation = (conversationId: string) => {
    return queryClient.prefetchQuery({
      queryKey: conversationKeys.detail(conversationId),
      queryFn: () => conversationApi.getById(conversationId),
      staleTime: 1000 * 60 * 5,
    });
  };

  /**
   * Invalidate and refetch
   */
  const refetch = () => {
    return queryClient.invalidateQueries({
      queryKey: conversationKeys.lists(),
    });
  };

  return {
    ...query,
    conversations: query.data?.conversations || [],
    total: query.data?.total || 0,
    addConversationToCache,
    updateConversationInCache,
    removeConversationFromCache,
    prefetchConversation,
    refetch,
  };
}
