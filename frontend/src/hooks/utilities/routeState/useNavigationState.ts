/**
 * WF-COMP-145 | useNavigationState.ts - Navigation history tracking hook
 * Purpose: Hook for tracking navigation history and scroll position
 * Upstream: React, Next.js | Dependencies: react, next/navigation
 * Downstream: Navigation components | Called by: React component tree
 * Related: Route state types, utilities
 * Exports: useNavigationState hook | Key Features: History tracking, scroll restoration
 * Last Updated: 2025-11-04 | File Type: .ts
 * Critical Path: Navigation → History tracking → State preservation → Restoration
 * LLM Context: Navigation history hook for Next.js App Router
 */

/**
 * Navigation State Hook
 *
 * Provides navigation history tracking with scroll position preservation
 * and state restoration capabilities.
 *
 * @module hooks/utilities/routeState/useNavigationState
 * @author White Cross Healthcare Platform
 */

'use client';

import { useEffect, useCallback, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import type { NavigationState, UseNavigationStateReturn } from './types';

// =====================
// HOOK: useNavigationState
// =====================

/**
 * Hook for tracking navigation history and preserving state.
 *
 * Tracks previous route state and scroll position, enabling
 * "back with state" functionality and scroll restoration.
 *
 * @returns Navigation state utilities
 *
 * @example
 * ```tsx
 * const {
 *   previousPath,
 *   previousState,
 *   navigateBack,
 *   navigateWithState,
 *   getScrollPosition
 * } = useNavigationState();
 *
 * // Navigate with preserved state
 * const handleNavigate = () => {
 *   navigateWithState('/students/123', { from: 'list' });
 * };
 *
 * // Navigate back with state restoration
 * const handleBack = () => {
 *   navigateBack(); // Returns to previous route with scroll position
 * };
 * ```
 */
export function useNavigationState(): UseNavigationStateReturn {
  const pathname = usePathname();
  const router = useRouter();
  const navigationHistoryRef = useRef<NavigationState[]>([]);
  const currentScrollRef = useRef({ x: 0, y: 0 });

  // Track current scroll position
  useEffect(() => {
    const handleScroll = () => {
      currentScrollRef.current = {
        x: window.scrollX,
        y: window.scrollY,
      };
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Track navigation changes
  useEffect(() => {
    const history = navigationHistoryRef.current;
    const currentPath = pathname;

    // Don't track if it's the same path (just param changes)
    if (history.length > 0 && history[history.length - 1].previousPath === currentPath) {
      return;
    }

    // Add to history
    const newEntry: NavigationState = {
      previousPath: history.length > 0 ? history[history.length - 1].previousPath : null,
      previousState: null, // Next.js doesn't support location.state in the same way
      scrollPosition: { ...currentScrollRef.current },
      timestamp: Date.now(),
    };

    navigationHistoryRef.current = [
      ...history.slice(-9), // Keep last 10 entries
      { ...newEntry, previousPath: currentPath },
    ];
  }, [pathname]);

  // Get previous navigation state
  const getPreviousState = useCallback((): NavigationState | null => {
    const history = navigationHistoryRef.current;
    return history.length > 1 ? history[history.length - 2] : null;
  }, []);

  // Navigate to a path with state
  // Note: Next.js doesn't support state in the same way as React Router
  // Consider using URL params or other state management instead
  const navigateWithState = useCallback(
    (path: string, state?: any) => {
      if (state) {
        console.warn(
          'Next.js navigation does not support state parameter. Consider using URL params instead.'
        );
      }
      router.push(path);
    },
    [router]
  );

  // Navigate back with state restoration
  const navigateBack = useCallback(
    (fallbackPath: string = '/') => {
      const prevState = getPreviousState();

      if (prevState?.previousPath) {
        router.push(prevState.previousPath);

        // Restore scroll position after navigation
        if (prevState.scrollPosition) {
          setTimeout(() => {
            window.scrollTo(
              prevState.scrollPosition!.x,
              prevState.scrollPosition!.y
            );
          }, 0);
        }
      } else {
        router.push(fallbackPath);
      }
    },
    [router, getPreviousState]
  );

  // Get scroll position for a specific path
  const getScrollPosition = useCallback(
    (path?: string): { x: number; y: number } | null => {
      if (!path) {
        return currentScrollRef.current;
      }

      const entry = navigationHistoryRef.current.find(
        (state) => state.previousPath === path
      );

      return entry?.scrollPosition || null;
    },
    []
  );

  const prevState = getPreviousState();

  return {
    previousPath: prevState?.previousPath || null,
    previousState: prevState?.previousState || null,
    canGoBack: !!prevState?.previousPath,
    navigateWithState,
    navigateBack,
    getScrollPosition,
    currentScroll: currentScrollRef.current,
  };
}
