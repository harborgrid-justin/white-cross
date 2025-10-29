'use client'

import { useState, useCallback } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

export interface RouteState {
  from?: string;
  returnTo?: string;
  data?: Record<string, any>;
}

/**
 * Custom hook for managing route state in Next.js
 * Migrated from react-router-dom to Next.js navigation
 */
export const useRouteState = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [routeState, setRouteState] = useState<RouteState>({});

  const updateRouteState = useCallback((newState: Partial<RouteState>) => {
    const updatedState = { ...routeState, ...newState };
    setRouteState(updatedState);

    // Update the current location's state without triggering navigation
    const search = searchParams?.toString() ? `?${searchParams.toString()}` : '';
    window.history.replaceState(updatedState, '', pathname + search);
  }, [routeState, pathname, searchParams]);

  const navigateWithState = useCallback((to: string, state?: RouteState) => {
    const navigationState = {
      ...state,
      from: pathname
    };
    setRouteState(navigationState);
    router.push(to);
  }, [router, pathname]);

  const goBack = useCallback(() => {
    if (routeState.returnTo) {
      router.push(routeState.returnTo);
    } else if (routeState.from) {
      router.push(routeState.from);
    } else {
      router.back();
    }
  }, [router, routeState]);

  return {
    routeState,
    updateRouteState,
    navigateWithState,
    goBack,
    canGoBack: !!(routeState.returnTo || routeState.from)
  };
};

/**
 * Backward compatibility alias for useRouteState
 * @deprecated Use useRouteState instead
 */
export const useNavigationState = useRouteState;

export default useRouteState;
