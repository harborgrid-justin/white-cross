/**
 * Conversations Query Hook
 * Provides conversation data queries with React Query
 */

'use client';

import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import type { Message } from './useMessages';

export interface Conversation {
  id: string;
  participants: string[];
  lastMessage?: Message;
  unreadCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ConversationListParams {
  userId?: string;
  limit?: number;
  cursor?: string;
}

export function useConversations(params?: ConversationListParams) {
  return useQuery({
    queryKey: ['conversations', params],
    queryFn: async (): Promise<Conversation[]> => {
      const queryParams = new URLSearchParams();
      if (params?.userId) queryParams.append('userId', params.userId);
      if (params?.limit) queryParams.append('limit', String(params.limit));

      const response = await fetch(`/api/conversations?${queryParams.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch conversations');
      return response.json();
    },
  });
}

export function useInfiniteConversations(params?: ConversationListParams) {
  return useInfiniteQuery({
    queryKey: ['conversations', 'infinite', params],
    queryFn: async ({ pageParam }): Promise<{ conversations: Conversation[]; nextCursor?: string }> => {
      const queryParams = new URLSearchParams();
      if (params?.userId) queryParams.append('userId', params.userId);
      if (params?.limit) queryParams.append('limit', String(params.limit));
      if (pageParam) queryParams.append('cursor', pageParam);

      const response = await fetch(`/api/conversations?${queryParams.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch conversations');
      return response.json();
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: undefined,
  });
}

export function useConversation(conversationId: string) {
  return useQuery({
    queryKey: ['conversations', conversationId],
    queryFn: async (): Promise<Conversation> => {
      const response = await fetch(`/api/conversations/${conversationId}`);
      if (!response.ok) throw new Error('Failed to fetch conversation');
      return response.json();
    },
    enabled: !!conversationId,
  });
}
