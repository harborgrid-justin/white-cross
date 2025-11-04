/**
 * Network Idle Detection Hook
 *
 * Detects when the network is idle based on active request count
 */

import { useEffect, useRef, useState } from 'react';

/**
 * Network Idle Detection Hook
 */
export function useNetworkIdle(threshold = 2): boolean {
  const [isIdle, setIsIdle] = useState(false);
  const activeRequestsRef = useRef(0);

  useEffect(() => {
    // Monitor network requests using Performance API
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();

      for (const entry of entries) {
        if (entry.entryType === 'resource') {
          const resourceEntry = entry as PerformanceResourceTiming;

          // Check if request is complete
          if (resourceEntry.responseEnd > 0) {
            activeRequestsRef.current = Math.max(
              0,
              activeRequestsRef.current - 1
            );
          } else {
            activeRequestsRef.current++;
          }
        }
      }

      // Update idle state
      setIsIdle(activeRequestsRef.current < threshold);
    });

    observer.observe({ entryTypes: ['resource'] });

    return () => {
      observer.disconnect();
    };
  }, [threshold]);

  return isIdle;
}
