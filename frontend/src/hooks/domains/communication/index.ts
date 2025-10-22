/**
 * Communication Domain Exports
 * 
 * Central export point for all communication and messaging hooks.
 * 
 * @module hooks/domains/communication
 * @author White Cross Healthcare Platform
 * @version 3.0.0
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { communicationApi } from '@/services';
import { useApiError } from '../../shared/useApiError';
import toast from 'react-hot-toast';

// Query keys
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
 * Get user messages
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
 * Get unread notifications
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
 * Send message mutation
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
 * Mark notification as read
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
