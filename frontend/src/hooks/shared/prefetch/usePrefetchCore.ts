/**
 * Core Prefetch Hook
 *
 * Base prefetch functionality with hover support
 */

import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef, useCallback, useState } from 'react';
import type { PrefetchOptions } from '@/services/cache/types';
import { useNetworkIdle } from './useNetworkIdle';

/**
 * Prefetch Hook Options
 */
export interface UsePrefetchOptions extends PrefetchOptions {
  /** Query key to prefetch */
  queryKey?: unknown[];
  /** Query function to execute */
  queryFn?: () => Promise<unknown>;
  /** Enable prefetching */
  enabled?: boolean;
}

/**
 * Prefetch Hook
 *
 * @param options - Prefetch options
 * @returns Prefetch handlers and state
 */
export function usePrefetch(options: UsePrefetchOptions = {}) {
  const {
    queryKey,
    queryFn,
    enabled = true,
    onHover = false,
    hoverDelay = 100,
    onlyWhenIdle = false,
    priority = 5
  } = options;

  const queryClient = useQueryClient();
  const isNetworkIdle = useNetworkIdle();
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isPrefetching, setIsPrefetching] = useState(false);

  /**
   * Execute Prefetch
   */
  const executePrefetch = useCallback(async () => {
    if (!enabled || !queryKey || !queryFn) return;

    // Check network idle condition
    if (onlyWhenIdle && !isNetworkIdle) {
      return;
    }

    // Check if already cached
    const cachedData = queryClient.getQueryData(queryKey);
    if (cachedData) {
      return; // Already cached, no need to prefetch
    }

    try {
      setIsPrefetching(true);

      await queryClient.prefetchQuery({
        queryKey,
        queryFn,
        staleTime: 5 * 60 * 1000 // 5 minutes
      });

      console.log('[usePrefetch] Prefetched:', queryKey);
    } catch (error) {
      console.error('[usePrefetch] Prefetch failed:', error);
    } finally {
      setIsPrefetching(false);
    }
  }, [enabled, queryKey, queryFn, onlyWhenIdle, isNetworkIdle, queryClient]);

  /**
   * Handle Mouse Enter (Hover)
   */
  const handleMouseEnter = useCallback(() => {
    if (!onHover || !enabled) return;

    // Clear existing timeout
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }

    // Set new timeout
    hoverTimeoutRef.current = setTimeout(() => {
      executePrefetch();
    }, hoverDelay);
  }, [onHover, enabled, hoverDelay, executePrefetch]);

  /**
   * Handle Mouse Leave
   */
  const handleMouseLeave = useCallback(() => {
    // Clear timeout on mouse leave
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
  }, []);

  /**
   * Prefetch Immediately
   */
  const prefetchNow = useCallback(() => {
    executePrefetch();
  }, [executePrefetch]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  return {
    isPrefetching,
    prefetchNow,
    handleMouseEnter,
    handleMouseLeave,
    // Convenience props for spreading on elements
    hoverProps: onHover
      ? {
          onMouseEnter: handleMouseEnter,
          onMouseLeave: handleMouseLeave
        }
      : {}
  };
}
