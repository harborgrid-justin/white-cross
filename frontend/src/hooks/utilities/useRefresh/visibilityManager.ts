'use client';

/**
 * @fileoverview Visibility API integration for refresh management
 * @module hooks/utilities/useRefresh/visibilityManager
 */

import { useEffect } from 'react';

/**
 * Handle visibility change and trigger refresh when tab becomes visible
 */
export function useVisibilityManager(
  refreshWhenVisible: boolean,
  interval: number | undefined,
  isPaused: boolean,
  isVisibleRef: React.MutableRefObject<boolean>,
  refresh: () => Promise<void>,
  debug?: boolean
) {
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
  }, [refreshWhenVisible, interval, isPaused, refresh, debug, isVisibleRef]);
}
