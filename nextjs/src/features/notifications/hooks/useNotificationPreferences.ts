import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  NotificationPreferences,
  UpdatePreferencesInput,
} from '../types/preferences';
import { preferenceService } from '../services/PreferenceService';

/**
 * Query keys for notification preferences
 */
export const preferenceKeys = {
  all: ['notification-preferences'] as const,
  detail: (userId: string) => [...preferenceKeys.all, userId] as const,
};

/**
 * useNotificationPreferences Hook
 *
 * Manages notification preference fetching and updates
 */
export function useNotificationPreferences(userId: string) {
  const queryClient = useQueryClient();

  // Fetch preferences
  const {
    data: preferences,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: preferenceKeys.detail(userId),
    queryFn: () => preferenceService.getPreferences(userId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  // Update preferences mutation
  const updateMutation = useMutation({
    mutationFn: (input: UpdatePreferencesInput) =>
      preferenceService.updatePreferences(userId, input),
    onSuccess: (updated) => {
      // Update cache
      queryClient.setQueryData(preferenceKeys.detail(userId), updated);
    },
  });

  // Reset to defaults mutation
  const resetMutation = useMutation({
    mutationFn: () => preferenceService.resetToDefaults(userId),
    onSuccess: (updated) => {
      // Update cache
      queryClient.setQueryData(preferenceKeys.detail(userId), updated);
    },
  });

  // Send test notification mutation
  const sendTestMutation = useMutation({
    mutationFn: (channel: string) =>
      preferenceService.sendTestNotification(userId, channel),
  });

  return {
    preferences,
    isLoading,
    error,
    refetch,
    update: updateMutation.mutate,
    updateAsync: updateMutation.mutateAsync,
    reset: resetMutation.mutate,
    sendTest: sendTestMutation.mutate,
    isUpdating: updateMutation.isPending,
    isResetting: resetMutation.isPending,
    isSendingTest: sendTestMutation.isPending,
  };
}
