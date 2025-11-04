'use client';

/**
 * @fileoverview Data Refresh Hook for Next.js App Router
 *
 * Provides utilities for refreshing server-side data and revalidating pages
 * using Next.js router.refresh() for optimal performance and user experience.
 *
 * @module hooks/utilities/useRefresh
 * @category Performance
 * @subcategory Hooks
 *
 * **Use Cases:**
 * - Real-time data synchronization
 * - Background data polling
 * - Manual refresh triggers
 * - Optimistic UI updates with revalidation
 * - Interval-based data refreshes
 *
 * **Performance Considerations:**
 * - refresh() only refetches server components
 * - Client state is preserved
 * - Efficient for partial page updates
 * - Network efficient (only changed data)
 *
 * @see {@link https://nextjs.org/docs/app/api-reference/functions/use-router#refresh | Next.js router.refresh()}
 *
 * @example
 * ```tsx
 * // Basic manual refresh
 * const { refresh, isRefreshing } = useRefresh();
 *
 * return (
 *   <button onClick={refresh} disabled={isRefreshing}>
 *     {isRefreshing ? 'Refreshing...' : 'Refresh Data'}
 *   </button>
 * );
 * ```
 *
 * @example
 * ```tsx
 * // Automatic polling every 30 seconds
 * useRefresh({ interval: 30000 });
 * ```
 *
 * @since 1.0.0
 * @version 1.0.0
 */

import { useRouter } from 'next/navigation';
import { useCallback, useRef, useState } from 'react';
import { useAutoRefreshInterval, usePauseResume } from './useRefresh/autoRefresh';
import { useManualRefresh } from './useRefresh/manualRefresh';
import { UseRefreshOptions, UseRefreshReturn } from './useRefresh/types';
import { useVisibilityManager } from './useRefresh/visibilityManager';

// Re-export types
export type { UseRefreshOptions, UseRefreshReturn };

// Re-export utilities
export { useSimpleRefresh } from './useRefresh/manualRefresh';

/**
 * Hook for refreshing server-side data with Next.js App Router
 *
 * This hook provides utilities for refreshing data rendered by Server Components
 * using the Next.js router.refresh() method. It supports manual refreshes,
 * automatic polling, visibility-based pausing, and refresh state tracking.
 *
 * **Key Features:**
 * - Manual refresh trigger
 * - Automatic polling with configurable interval
 * - Pause/resume automatic refreshes
 * - Visibility API integration (pause when tab hidden)
 * - Refresh state tracking (loading, count, timestamp)
 * - Success/error callbacks
 * - Debug logging
 *
 * **Performance Benefits:**
 * - Only refetches server-rendered data (not entire page)
 * - Preserves client-side state
 * - Efficient network usage
 * - Supports optimistic UI patterns
 *
 * **Best Practices:**
 * 1. Use for pages with frequently changing server data
 * 2. Set reasonable polling intervals (avoid < 5 seconds)
 * 3. Enable refreshWhenVisible to conserve resources
 * 4. Combine with React Query for client-side caching
 * 5. Use manual refresh for user-triggered updates
 *
 * @param options - Configuration options for refresh behavior
 * @returns Object with refresh utilities and state
 *
 * @example
 * ```tsx
 * // Medical records that need real-time updates
 * export function MedicationSchedule() {
 *   const { refresh, isRefreshing, lastRefreshed } = useRefresh({
 *     interval: 60000, // Refresh every minute
 *     refreshWhenVisible: true,
 *     onRefreshSuccess: () => {
 *       console.log('Schedule updated');
 *     },
 *   });
 *
 *   return (
 *     <div>
 *       <h1>Medication Schedule</h1>
 *       {isRefreshing && <LoadingSpinner />}
 *       <button onClick={refresh}>Refresh Now</button>
 *       {lastRefreshed && (
 *         <p>Last updated: {lastRefreshed.toLocaleTimeString()}</p>
 *       )}
 *     </div>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Dashboard with pause/resume control
 * export function Dashboard() {
 *   const {
 *     refresh,
 *     isRefreshing,
 *     isPaused,
 *     pause,
 *     resume,
 *     refreshCount,
 *   } = useRefresh({
 *     interval: 30000, // 30 seconds
 *     debug: true,
 *   });
 *
 *   return (
 *     <div>
 *       <h1>Dashboard (Refreshed {refreshCount} times)</h1>
 *       <button onClick={isPaused ? resume : pause}>
 *         {isPaused ? 'Resume Auto-Refresh' : 'Pause Auto-Refresh'}
 *       </button>
 *       <button onClick={refresh} disabled={isRefreshing}>
 *         Manual Refresh
 *       </button>
 *     </div>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Optimistic update with revalidation
 * export function StudentList() {
 *   const { refresh } = useRefresh();
 *   const [optimisticStudents, setOptimisticStudents] = useState(students);
 *
 *   const handleAddStudent = async (student: Student) => {
 *     // Optimistic update
 *     setOptimisticStudents([...optimisticStudents, student]);
 *
 *     try {
 *       await addStudentAPI(student);
 *       // Revalidate server data
 *       await refresh();
 *     } catch (error) {
 *       // Rollback on error
 *       setOptimisticStudents(optimisticStudents);
 *     }
 *   };
 *
 *   return <StudentTable students={optimisticStudents} onAdd={handleAddStudent} />;
 * }
 * ```
 */
export function useRefresh(options: UseRefreshOptions = {}): UseRefreshReturn {
  const {
    interval,
    refreshWhenVisible = true,
    onRefreshSuccess,
    onRefreshError,
    debug = false,
  } = options;

  const router = useRouter();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null);
  const [refreshCount, setRefreshCount] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const isVisibleRef = useRef(true);

  // Manual refresh logic
  const manualRefreshFn = useManualRefresh(
    router,
    isRefreshing,
    onRefreshSuccess,
    onRefreshError,
    debug
  );

  const refresh = useCallback(async () => {
    await manualRefreshFn(setIsRefreshing, setLastRefreshed, setRefreshCount);
  }, [manualRefreshFn]);

  // Pause/resume controls
  const { pause: pauseFn, resume: resumeFn } = usePauseResume(debug);

  const pause = useCallback(() => {
    setIsPaused(true);
    pauseFn();
  }, [pauseFn]);

  const resume = useCallback(() => {
    setIsPaused(false);
    resumeFn();
  }, [resumeFn]);

  // Auto-refresh interval
  useAutoRefreshInterval(
    interval,
    isPaused,
    refreshWhenVisible,
    isVisibleRef,
    refresh,
    debug
  );

  // Visibility manager
  useVisibilityManager(
    refreshWhenVisible,
    interval,
    isPaused,
    isVisibleRef,
    refresh,
    debug
  );

  return {
    refresh,
    isRefreshing,
    lastRefreshed,
    refreshCount,
    pause,
    resume,
    isPaused,
  };
}
