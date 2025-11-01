/**
 * Optimistic Update Utilities
 *
 * Reusable patterns for optimistic updates with automatic rollback on error.
 * Follows React Query best practices for optimistic UI.
 *
 * @module hooks/utils/optimisticUpdates
 */

import { QueryClient } from '@tanstack/react-query';

/**
 * Context returned from optimistic update for rollback
 */
export interface OptimisticContext<T = any> {
  previousData: T | undefined;
  rollback: () => void;
}

/**
 * Create an optimistic update for a single item
 *
 * @example
 * ```typescript
 * onMutate: async (variables) => {
 *   return createOptimisticUpdate(
 *     queryClient,
 *     ['students', variables.id],
 *     (old) => ({ ...old, ...variables })
 *   );
 * }
 * ```
 */
export const createOptimisticUpdate = async <T>(
  queryClient: QueryClient,
  queryKey: any[],
  updater: (old: T | undefined) => T
): Promise<OptimisticContext<T>> => {
  // Cancel outgoing refetches
  await queryClient.cancelQueries({ queryKey });

  // Snapshot previous value
  const previousData = queryClient.getQueryData<T>(queryKey);

  // Optimistically update
  queryClient.setQueryData<T>(queryKey, updater);

  // Return context for rollback
  return {
    previousData,
    rollback: () => {
      queryClient.setQueryData(queryKey, previousData);
    },
  };
};

/**
 * Create an optimistic update for a list (add item)
 */
export const createOptimisticListAdd = async <T extends { id: string | number }>(
  queryClient: QueryClient,
  queryKey: any[],
  newItem: T
): Promise<OptimisticContext<T[]>> => {
  await queryClient.cancelQueries({ queryKey });

  const previousData = queryClient.getQueryData<T[]>(queryKey);

  queryClient.setQueryData<T[]>(queryKey, (old = []) => [newItem, ...old]);

  return {
    previousData,
    rollback: () => {
      queryClient.setQueryData(queryKey, previousData);
    },
  };
};

/**
 * Create an optimistic update for a list (update item)
 */
export const createOptimisticListUpdate = async <T extends { id: string | number }>(
  queryClient: QueryClient,
  queryKey: any[],
  itemId: string | number,
  updates: Partial<T>
): Promise<OptimisticContext<T[]>> => {
  await queryClient.cancelQueries({ queryKey });

  const previousData = queryClient.getQueryData<T[]>(queryKey);

  queryClient.setQueryData<T[]>(queryKey, (old = []) =>
    old.map(item => (item.id === itemId ? { ...item, ...updates } : item))
  );

  return {
    previousData,
    rollback: () => {
      queryClient.setQueryData(queryKey, previousData);
    },
  };
};

/**
 * Create an optimistic update for a list (remove item)
 */
export const createOptimisticListRemove = async <T extends { id: string | number }>(
  queryClient: QueryClient,
  queryKey: any[],
  itemId: string | number
): Promise<OptimisticContext<T[]>> => {
  await queryClient.cancelQueries({ queryKey });

  const previousData = queryClient.getQueryData<T[]>(queryKey);

  queryClient.setQueryData<T[]>(queryKey, (old = []) =>
    old.filter(item => item.id !== itemId)
  );

  return {
    previousData,
    rollback: () => {
      queryClient.setQueryData(queryKey, previousData);
    },
  };
};

/**
 * Create an optimistic update for a paginated response
 */
export const createOptimisticPaginatedUpdate = async <T extends { id: string | number }>(
  queryClient: QueryClient,
  queryKey: any[],
  itemId: string | number,
  updates: Partial<T>
): Promise<OptimisticContext<{ data: T[]; total: number; pagination: any }>> => {
  await queryClient.cancelQueries({ queryKey });

  const previousData = queryClient.getQueryData<{ data: T[]; total: number; pagination: any }>(queryKey);

  queryClient.setQueryData<{ data: T[]; total: number; pagination: any }>(queryKey, (old) => {
    if (!old) return old;

    return {
      ...old,
      data: old.data.map(item => (item.id === itemId ? { ...item, ...updates } : item)),
    };
  });

  return {
    previousData,
    rollback: () => {
      queryClient.setQueryData(queryKey, previousData);
    },
  };
};

/**
 * Create optimistic updates for multiple related queries
 *
 * @example
 * ```typescript
 * onMutate: async (variables) => {
 *   return createMultiQueryOptimisticUpdate(queryClient, [
 *     {
 *       queryKey: ['students', variables.studentId],
 *       updater: (old) => ({ ...old, ...variables })
 *     },
 *     {
 *       queryKey: ['students'],
 *       updater: (old) => old.map(s => s.id === variables.studentId ? { ...s, ...variables } : s)
 *     }
 *   ]);
 * }
 * ```
 */
export const createMultiQueryOptimisticUpdate = async (
  queryClient: QueryClient,
  updates: Array<{
    queryKey: any[];
    updater: (old: any) => any;
  }>
): Promise<OptimisticContext<Record<string, any>>> => {
  const previousDataMap: Record<string, any> = {};

  // Cancel and snapshot all queries
  for (const { queryKey } of updates) {
    await queryClient.cancelQueries({ queryKey });
    previousDataMap[JSON.stringify(queryKey)] = queryClient.getQueryData(queryKey);
  }

  // Apply all optimistic updates
  for (const { queryKey, updater } of updates) {
    queryClient.setQueryData(queryKey, updater);
  }

  return {
    previousData: previousDataMap,
    rollback: () => {
      for (const { queryKey } of updates) {
        const key = JSON.stringify(queryKey);
        queryClient.setQueryData(queryKey, previousDataMap[key]);
      }
    },
  };
};

/**
 * Medication administration optimistic update
 */
export const createMedicationAdministrationOptimistic = async (
  queryClient: QueryClient,
  medicationId: string,
  studentId: string,
  administrationData: any
) => {
  return createMultiQueryOptimisticUpdate(queryClient, [
    // Update medication detail
    {
      queryKey: ['medications', medicationId],
      updater: (old: any) => ({
        ...old,
        lastAdministeredAt: new Date().toISOString(),
        administrationHistory: [
          administrationData,
          ...(old?.administrationHistory || []),
        ],
      }),
    },
    // Update medications list for student
    {
      queryKey: ['medications', 'student', studentId],
      updater: (old: any) => {
        if (!old?.medications) return old;

        return {
          ...old,
          medications: old.medications.map((med: any) =>
            med.id === medicationId
              ? {
                  ...med,
                  lastAdministeredAt: new Date().toISOString(),
                }
              : med
          ),
        };
      },
    },
    // Update medications due today
    {
      queryKey: ['medications', 'due-today'],
      updater: (old: any[] = []) =>
        old.filter((med: any) => med.id !== medicationId),
    },
  ]);
};

/**
 * Student creation optimistic update
 */
export const createStudentCreationOptimistic = async (
  queryClient: QueryClient,
  newStudent: any
) => {
  return createOptimisticListAdd(
    queryClient,
    ['students', 'list'],
    newStudent
  );
};

/**
 * Health record creation optimistic update
 */
export const createHealthRecordOptimistic = async (
  queryClient: QueryClient,
  studentId: string,
  newRecord: any
) => {
  return createMultiQueryOptimisticUpdate(queryClient, [
    // Add to student's health records
    {
      queryKey: ['health-records', 'student', studentId],
      updater: (old: any = []) => [newRecord, ...old],
    },
    // Add to all health records list
    {
      queryKey: ['health-records', 'list'],
      updater: (old: any = []) => [newRecord, ...old],
    },
    // Update student's health record count
    {
      queryKey: ['students', 'detail', studentId],
      updater: (old: any) => ({
        ...old,
        healthRecordCount: (old?.healthRecordCount || 0) + 1,
      }),
    },
  ]);
};

/**
 * Appointment scheduling optimistic update
 */
export const createAppointmentSchedulingOptimistic = async (
  queryClient: QueryClient,
  studentId: string,
  newAppointment: any
) => {
  return createMultiQueryOptimisticUpdate(queryClient, [
    // Add to student's appointments
    {
      queryKey: ['appointments', 'student', studentId],
      updater: (old: any = []) => [...old, newAppointment],
    },
    // Add to upcoming appointments
    {
      queryKey: ['appointments', 'upcoming'],
      updater: (old: any = []) => {
        const appointments = [...old, newAppointment];
        return appointments.sort((a, b) =>
          new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime()
        );
      },
    },
  ]);
};

/**
 * Generic optimistic update error handler
 */
export const handleOptimisticError = (
  error: any,
  context: OptimisticContext | undefined
) => {
  console.error('Mutation failed, rolling back optimistic update:', error);

  if (context?.rollback) {
    context.rollback();
  }
};

/**
 * Generic optimistic update settled handler
 * Invalidates related queries after mutation completes
 */
export const handleOptimisticSettled = (
  queryClient: QueryClient,
  queryKeysToInvalidate: any[][]
) => {
  return async () => {
    for (const queryKey of queryKeysToInvalidate) {
      await queryClient.invalidateQueries({ queryKey });
    }
  };
};
