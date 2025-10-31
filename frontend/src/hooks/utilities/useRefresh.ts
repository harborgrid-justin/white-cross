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
import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Configuration options for useRefresh hook
 */
export interface UseRefreshOptions {
  /**
   * Auto-refresh interval in milliseconds
   * Set to 0 or undefined to disable auto-refresh
   * @default undefined
   */
  interval?: number;

  /**
   * Only refresh when tab/window is visible
   * Pauses refresh when user navigates away
   * @default true
   */
  refreshWhenVisible?: boolean;

  /**
   * Callback function called after successful refresh
   */
  onRefreshSuccess?: () => void;

  /**
   * Callback function called if refresh fails
   */
  onRefreshError?: (error: Error) => void;

  /**
   * Enable debug logging for refresh operations
   * @default false
   */
  debug?: boolean;
}

/**
 * Return type for useRefresh hook
 */
export interface UseRefreshReturn {
  /**
   * Manually trigger a data refresh
   * Returns a promise that resolves when refresh completes
   */
  refresh: () => Promise<void>;

  /**
   * Whether a refresh is currently in progress
   */
  isRefreshing: boolean;

  /**
   * Timestamp of last successful refresh
   */
  lastRefreshed: Date | null;

  /**
   * Number of refresh operations performed
   */
  refreshCount: number;

  /**
   * Pause automatic refreshes (if interval is set)
   */
  pause: () => void;

  /**
   * Resume automatic refreshes (if interval is set)
   */
  resume: () => void;

  /**
   * Whether automatic refresh is currently paused
   */
  isPaused: boolean;
}

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
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isVisibleRef = useRef(true);

  /**
   * Manual refresh function
   */
  const refresh = useCallback(async () => {
    if (isRefreshing) {
      if (debug) {
        console.log('[useRefresh] Refresh already in progress, skipping');
      }
      return;
    }

    try {
      setIsRefreshing(true);
      if (debug) {
        console.log('[useRefresh] Starting refresh...');
      }

      // Trigger Next.js router refresh
      router.refresh();

      // Small delay to ensure refresh completes
      await new Promise((resolve) => setTimeout(resolve, 100));

      setLastRefreshed(new Date());
      setRefreshCount((prev) => prev + 1);

      if (debug) {
        console.log('[useRefresh] Refresh completed successfully');
      }

      onRefreshSuccess?.();
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Refresh failed');
      if (debug) {
        console.error('[useRefresh] Refresh failed:', err);
      }
      onRefreshError?.(err);
    } finally {
      setIsRefreshing(false);
    }
  }, [router, isRefreshing, onRefreshSuccess, onRefreshError, debug]);

  /**
   * Pause automatic refreshes
   */
  const pause = useCallback(() => {
    setIsPaused(true);
    if (debug) {
      console.log('[useRefresh] Auto-refresh paused');
    }
  }, [debug]);

  /**
   * Resume automatic refreshes
   */
  const resume = useCallback(() => {
    setIsPaused(false);
    if (debug) {
      console.log('[useRefresh] Auto-refresh resumed');
    }
  }, [debug]);

  /**
   * Set up automatic refresh interval
   */
  useEffect(() => {
    if (!interval || interval <= 0) {
      return;
    }

    const startInterval = () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      intervalRef.current = setInterval(() => {
        // Check if refresh should be skipped
        const shouldRefresh =
          !isPaused &&
          (!refreshWhenVisible || (refreshWhenVisible && isVisibleRef.current));

        if (shouldRefresh) {
          if (debug) {
            console.log('[useRefresh] Auto-refresh triggered');
          }
          refresh();
        } else if (debug) {
          console.log('[useRefresh] Auto-refresh skipped (paused or not visible)');
        }
      }, interval);

      if (debug) {
        console.log(`[useRefresh] Auto-refresh interval set to ${interval}ms`);
      }
    };

    startInterval();

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [interval, isPaused, refreshWhenVisible, refresh, debug]);

  /**
   * Handle visibility change
   */
  useEffect(() => {
    if (!refreshWhenVisible) {
      return;
    }

    const handleVisibilityChange = () => {
      isVisibleRef.current = !document.hidden;

      if (debug) {
        console.log(
          `[useRefresh] Visibility changed: ${isVisibleRef.current ? 'visible' : 'hidden'}`
        );
      }

      // Trigger immediate refresh when tab becomes visible again
      if (isVisibleRef.current && interval && !isPaused) {
        if (debug) {
          console.log('[useRefresh] Tab became visible, triggering refresh');
        }
        refresh();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [refreshWhenVisible, interval, isPaused, refresh, debug]);

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

/**
 * Lightweight version for simple manual refresh only
 *
 * @example
 * ```tsx
 * const refresh = useSimpleRefresh();
 * <button onClick={refresh}>Refresh</button>
 * ```
 */
export function useSimpleRefresh(): () => void {
  const router = useRouter();
  return useCallback(() => {
    router.refresh();
  }, [router]);
}
