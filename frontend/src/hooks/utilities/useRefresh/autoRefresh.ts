'use client';

/**
 * @fileoverview Auto-refresh interval management
 * @module hooks/utilities/useRefresh/autoRefresh
 */

import { useCallback, useEffect, useRef } from 'react';

/**
 * Pause/resume controls for auto-refresh
 */
export function usePauseResume(debug?: boolean) {
  const pause = useCallback(() => {
    if (debug) {
      console.log('[useRefresh] Auto-refresh paused');
    }
  }, [debug]);

  const resume = useCallback(() => {
    if (debug) {
      console.log('[useRefresh] Auto-refresh resumed');
    }
  }, [debug]);

  return { pause, resume };
}

/**
 * Set up automatic refresh interval
 */
export function useAutoRefreshInterval(
  interval: number | undefined,
  isPaused: boolean,
  refreshWhenVisible: boolean,
  isVisibleRef: React.MutableRefObject<boolean>,
  refresh: () => Promise<void>,
  debug?: boolean
) {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

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
  }, [interval, isPaused, refreshWhenVisible, refresh, debug, isVisibleRef]);
}
