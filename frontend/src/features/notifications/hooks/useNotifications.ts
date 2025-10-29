import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect, useCallback } from 'react';
import {
  Notification,
  NotificationFilters,
  NotificationGroup,
  NotificationStats,
} from '../types/notification';
import { notificationService } from '../services/NotificationService';

/**
 * Query keys for notifications
 */
export const notificationKeys = {
  all: ['notifications'] as const,
  lists: () => [...notificationKeys.all, 'list'] as const,
  list: (userId: string, filters?: NotificationFilters) =>
    [...notificationKeys.lists(), userId, filters] as const,
  grouped: (userId: string, filters?: NotificationFilters) =>
    [...notificationKeys.all, 'grouped', userId, filters] as const,
  stats: (userId: string) => [...notificationKeys.all, 'stats', userId] as const,
  unreadCount: (userId: string) =>
    [...notificationKeys.all, 'unread-count', userId] as const,
  detail: (id: string) => [...notificationKeys.all, 'detail', id] as const,
};

/**
 * useNotifications Hook
 *
 * Manages notification fetching, filtering, and real-time updates
 */
export function useNotifications(
  userId: string,
  filters?: NotificationFilters,
  options?: {
    enabled?: boolean;
    refetchInterval?: number;
  }
) {
  const queryClient = useQueryClient();

  // Fetch notifications
  const {
    data: notifications = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: notificationKeys.list(userId, filters),
    queryFn: () => notificationService.getNotifications(userId, filters),
    enabled: options?.enabled ?? true,
    refetchInterval: options?.refetchInterval,
  });

  // Mark as read mutation
  const markAsReadMutation = useMutation({
    mutationFn: (id: string) => notificationService.markAsRead(id),
    onSuccess: (updatedNotification) => {
      // Update cache
      queryClient.setQueryData<Notification[]>(
        notificationKeys.list(userId, filters),
        (old) =>
          old?.map((n) => (n.id === updatedNotification.id ? updatedNotification : n))
      );

      // Invalidate unread count
      queryClient.invalidateQueries({
        queryKey: notificationKeys.unreadCount(userId),
      });
    },
  });

  // Mark multiple as read mutation
  const markMultipleAsReadMutation = useMutation({
    mutationFn: (ids: string[]) => notificationService.markMultipleAsRead(ids),
    onSuccess: () => {
      // Refetch notifications
      queryClient.invalidateQueries({
        queryKey: notificationKeys.list(userId, filters),
      });

      // Invalidate unread count
      queryClient.invalidateQueries({
        queryKey: notificationKeys.unreadCount(userId),
      });
    },
  });

  // Mark all as read mutation
  const markAllAsReadMutation = useMutation({
    mutationFn: () => notificationService.markAllAsRead(userId),
    onSuccess: () => {
      // Refetch notifications
      queryClient.invalidateQueries({
        queryKey: notificationKeys.lists(),
      });

      // Invalidate unread count
      queryClient.invalidateQueries({
        queryKey: notificationKeys.unreadCount(userId),
      });
    },
  });

  // Snooze mutation
  const snoozeMutation = useMutation({
    mutationFn: ({ id, snoozedUntil }: { id: string; snoozedUntil: Date }) =>
      notificationService.snooze(id, snoozedUntil),
    onSuccess: (updatedNotification) => {
      // Update cache
      queryClient.setQueryData<Notification[]>(
        notificationKeys.list(userId, filters),
        (old) =>
          old?.map((n) => (n.id === updatedNotification.id ? updatedNotification : n))
      );
    },
  });

  // Archive mutation
  const archiveMutation = useMutation({
    mutationFn: (id: string) => notificationService.archive(id),
    onSuccess: () => {
      // Refetch notifications
      queryClient.invalidateQueries({
        queryKey: notificationKeys.list(userId, filters),
      });
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => notificationService.delete(id),
    onSuccess: (_, id) => {
      // Remove from cache
      queryClient.setQueryData<Notification[]>(
        notificationKeys.list(userId, filters),
        (old) => old?.filter((n) => n.id !== id)
      );

      // Invalidate unread count
      queryClient.invalidateQueries({
        queryKey: notificationKeys.unreadCount(userId),
      });
    },
  });

  return {
    notifications,
    isLoading,
    error,
    refetch,
    markAsRead: markAsReadMutation.mutate,
    markMultipleAsRead: markMultipleAsReadMutation.mutate,
    markAllAsRead: markAllAsReadMutation.mutate,
    snooze: snoozeMutation.mutate,
    archive: archiveMutation.mutate,
    delete: deleteMutation.mutate,
    isMarkingAsRead: markAsReadMutation.isPending,
    isSnoozing: snoozeMutation.isPending,
    isArchiving: archiveMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}

/**
 * useNotificationGroups Hook
 *
 * Fetches grouped notifications
 */
export function useNotificationGroups(
  userId: string,
  filters?: NotificationFilters
) {
  const {
    data: groups = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: notificationKeys.grouped(userId, filters),
    queryFn: () => notificationService.getGrouped(userId, filters),
  });

  return {
    groups,
    isLoading,
    error,
    refetch,
  };
}

/**
 * useNotificationStats Hook
 *
 * Fetches notification statistics
 */
export function useNotificationStats(userId: string) {
  const {
    data: stats,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: notificationKeys.stats(userId),
    queryFn: () => notificationService.getStats(userId),
  });

  return {
    stats,
    isLoading,
    error,
    refetch,
  };
}

/**
 * useUnreadCount Hook
 *
 * Fetches and tracks unread notification count
 */
export function useUnreadCount(userId: string) {
  const {
    data: count = 0,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: notificationKeys.unreadCount(userId),
    queryFn: () => notificationService.getUnreadCount(userId),
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  return {
    count,
    isLoading,
    error,
    refetch,
  };
}

/**
 * useNotification Hook
 *
 * Fetches a single notification by ID
 */
export function useNotification(id: string) {
  const {
    data: notification,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: notificationKeys.detail(id),
    queryFn: () => notificationService.getById(id),
    enabled: !!id,
  });

  return {
    notification,
    isLoading,
    error,
    refetch,
  };
}

/**
 * useNotificationRealtime Hook
 *
 * Handles real-time notification updates via WebSocket
 */
export function useNotificationRealtime(
  userId: string,
  onNotification?: (notification: Notification) => void
) {
  const queryClient = useQueryClient();
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // WebSocket connection will be established elsewhere
    // This hook listens for notification events

    const handleNotification = (event: CustomEvent<Notification>) => {
      const notification = event.detail;

      // Add to cache
      queryClient.setQueryData<Notification[]>(
        notificationKeys.lists(),
        (old = []) => [notification, ...old]
      );

      // Invalidate unread count
      queryClient.invalidateQueries({
        queryKey: notificationKeys.unreadCount(userId),
      });

      // Call callback
      if (onNotification) {
        onNotification(notification);
      }
    };

    window.addEventListener('notification', handleNotification as EventListener);

    return () => {
      window.removeEventListener('notification', handleNotification as EventListener);
    };
  }, [userId, queryClient, onNotification]);

  return {
    isConnected,
  };
}
