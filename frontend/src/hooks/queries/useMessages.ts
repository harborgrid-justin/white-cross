/**
 * Messages Query Hook
 * Provides message data queries with React Query
 */

'use client';

import { useQuery, useInfiniteQuery } from '@tanstack/react-query';

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  recipientId: string;
  content: string;
  read: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MessageListParams {
  conversationId?: string;
  limit?: number;
  cursor?: string;
}

export function useMessages(params?: MessageListParams) {
  return useQuery({
    queryKey: ['messages', params],
    queryFn: async (): Promise<Message[]> => {
      const queryParams = new URLSearchParams();
      if (params?.conversationId) queryParams.append('conversationId', params.conversationId);
      if (params?.limit) queryParams.append('limit', String(params.limit));

      const response = await fetch(`/api/messages?${queryParams.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch messages');
      return response.json();
    },
  });
}

export function useInfiniteMessages(params?: MessageListParams) {
  return useInfiniteQuery({
    queryKey: ['messages', 'infinite', params],
    queryFn: async ({ pageParam }): Promise<{ messages: Message[]; nextCursor?: string }> => {
      const queryParams = new URLSearchParams();
      if (params?.conversationId) queryParams.append('conversationId', params.conversationId);
      if (params?.limit) queryParams.append('limit', String(params.limit));
      if (pageParam) queryParams.append('cursor', pageParam);

      const response = await fetch(`/api/messages?${queryParams.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch messages');
      return response.json();
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: undefined,
  });
}

export function useMessage(messageId: string) {
  return useQuery({
    queryKey: ['messages', messageId],
    queryFn: async (): Promise<Message> => {
      const response = await fetch(`/api/messages/${messageId}`);
      if (!response.ok) throw new Error('Failed to fetch message');
      return response.json();
    },
    enabled: !!messageId,
  });
}
