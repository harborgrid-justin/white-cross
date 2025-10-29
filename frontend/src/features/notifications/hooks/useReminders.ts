import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Reminder,
  ReminderFilters,
  ReminderStats,
  ReminderInstance,
  CreateReminderInput,
  UpdateReminderInput,
} from '../types/reminder';
import { reminderService } from '../services/ReminderService';

/**
 * Query keys for reminders
 */
export const reminderKeys = {
  all: ['reminders'] as const,
  lists: () => [...reminderKeys.all, 'list'] as const,
  list: (userId: string, filters?: ReminderFilters) =>
    [...reminderKeys.lists(), userId, filters] as const,
  upcoming: (userId: string, hours: number) =>
    [...reminderKeys.all, 'upcoming', userId, hours] as const,
  overdue: (userId: string) => [...reminderKeys.all, 'overdue', userId] as const,
  stats: (userId: string) => [...reminderKeys.all, 'stats', userId] as const,
  detail: (id: string) => [...reminderKeys.all, 'detail', id] as const,
  instances: (id: string, startDate?: Date, endDate?: Date) =>
    [...reminderKeys.all, 'instances', id, startDate, endDate] as const,
};

/**
 * useReminders Hook
 *
 * Manages reminder fetching, filtering, and updates
 */
export function useReminders(
  userId: string,
  filters?: ReminderFilters,
  options?: {
    enabled?: boolean;
  }
) {
  const queryClient = useQueryClient();

  // Fetch reminders
  const {
    data: reminders = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: reminderKeys.list(userId, filters),
    queryFn: () => reminderService.getReminders(userId, filters),
    enabled: options?.enabled ?? true,
  });

  // Create reminder mutation
  const createMutation = useMutation({
    mutationFn: (input: CreateReminderInput) => reminderService.create(input),
    onSuccess: (newReminder) => {
      // Add to cache
      queryClient.setQueryData<Reminder[]>(
        reminderKeys.list(userId, filters),
        (old = []) => [newReminder, ...old]
      );

      // Invalidate stats
      queryClient.invalidateQueries({
        queryKey: reminderKeys.stats(userId),
      });
    },
  });

  // Update reminder mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateReminderInput }) =>
      reminderService.update(id, input),
    onSuccess: (updatedReminder) => {
      // Update cache
      queryClient.setQueryData<Reminder[]>(
        reminderKeys.list(userId, filters),
        (old) => old?.map((r) => (r.id === updatedReminder.id ? updatedReminder : r))
      );

      // Update detail cache
      queryClient.setQueryData(
        reminderKeys.detail(updatedReminder.id),
        updatedReminder
      );

      // Invalidate stats
      queryClient.invalidateQueries({
        queryKey: reminderKeys.stats(userId),
      });
    },
  });

  // Delete reminder mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => reminderService.delete(id),
    onSuccess: (_, id) => {
      // Remove from cache
      queryClient.setQueryData<Reminder[]>(
        reminderKeys.list(userId, filters),
        (old) => old?.filter((r) => r.id !== id)
      );

      // Invalidate stats
      queryClient.invalidateQueries({
        queryKey: reminderKeys.stats(userId),
      });
    },
  });

  // Pause reminder mutation
  const pauseMutation = useMutation({
    mutationFn: (id: string) => reminderService.pause(id),
    onSuccess: (updatedReminder) => {
      // Update cache
      queryClient.setQueryData<Reminder[]>(
        reminderKeys.list(userId, filters),
        (old) => old?.map((r) => (r.id === updatedReminder.id ? updatedReminder : r))
      );
    },
  });

  // Resume reminder mutation
  const resumeMutation = useMutation({
    mutationFn: (id: string) => reminderService.resume(id),
    onSuccess: (updatedReminder) => {
      // Update cache
      queryClient.setQueryData<Reminder[]>(
        reminderKeys.list(userId, filters),
        (old) => old?.map((r) => (r.id === updatedReminder.id ? updatedReminder : r))
      );
    },
  });

  // Complete reminder mutation
  const completeMutation = useMutation({
    mutationFn: (id: string) => reminderService.complete(id),
    onSuccess: (updatedReminder) => {
      // Update cache
      queryClient.setQueryData<Reminder[]>(
        reminderKeys.list(userId, filters),
        (old) => old?.map((r) => (r.id === updatedReminder.id ? updatedReminder : r))
      );

      // Invalidate stats
      queryClient.invalidateQueries({
        queryKey: reminderKeys.stats(userId),
      });
    },
  });

  // Snooze reminder mutation
  const snoozeMutation = useMutation({
    mutationFn: ({ id, snoozedUntil }: { id: string; snoozedUntil: Date }) =>
      reminderService.snooze(id, snoozedUntil),
    onSuccess: (updatedReminder) => {
      // Update cache
      queryClient.setQueryData<Reminder[]>(
        reminderKeys.list(userId, filters),
        (old) => old?.map((r) => (r.id === updatedReminder.id ? updatedReminder : r))
      );
    },
  });

  return {
    reminders,
    isLoading,
    error,
    refetch,
    create: createMutation.mutate,
    update: updateMutation.mutate,
    delete: deleteMutation.mutate,
    pause: pauseMutation.mutate,
    resume: resumeMutation.mutate,
    complete: completeMutation.mutate,
    snooze: snoozeMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}

/**
 * useReminder Hook
 *
 * Fetches a single reminder by ID
 */
export function useReminder(id: string) {
  const {
    data: reminder,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: reminderKeys.detail(id),
    queryFn: () => reminderService.getById(id),
    enabled: !!id,
  });

  return {
    reminder,
    isLoading,
    error,
    refetch,
  };
}

/**
 * useUpcomingReminders Hook
 *
 * Fetches upcoming reminders
 */
export function useUpcomingReminders(userId: string, hours: number = 24) {
  const {
    data: reminders = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: reminderKeys.upcoming(userId, hours),
    queryFn: () => reminderService.getUpcoming(userId, hours),
    refetchInterval: 60000, // Refetch every minute
  });

  return {
    reminders,
    isLoading,
    error,
    refetch,
  };
}

/**
 * useOverdueReminders Hook
 *
 * Fetches overdue reminders
 */
export function useOverdueReminders(userId: string) {
  const {
    data: reminders = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: reminderKeys.overdue(userId),
    queryFn: () => reminderService.getOverdue(userId),
    refetchInterval: 60000, // Refetch every minute
  });

  return {
    reminders,
    isLoading,
    error,
    refetch,
  };
}

/**
 * useReminderStats Hook
 *
 * Fetches reminder statistics
 */
export function useReminderStats(userId: string) {
  const {
    data: stats,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: reminderKeys.stats(userId),
    queryFn: () => reminderService.getStats(userId),
  });

  return {
    stats,
    isLoading,
    error,
    refetch,
  };
}

/**
 * useReminderInstances Hook
 *
 * Fetches instances for a recurring reminder
 */
export function useReminderInstances(
  reminderId: string,
  startDate?: Date,
  endDate?: Date
) {
  const {
    data: instances = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: reminderKeys.instances(reminderId, startDate, endDate),
    queryFn: () => reminderService.getInstances(reminderId, startDate, endDate),
    enabled: !!reminderId,
  });

  return {
    instances,
    isLoading,
    error,
    refetch,
  };
}
