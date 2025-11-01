/**
 * Route State Hook
 * Manages route-level state and navigation
 */

'use client';

import { useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export interface RouteState<T = any> {
  data: T;
  isLoading: boolean;
  error: Error | null;
}

export function useRouteState<T>(initialData: T) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [state, setState] = useState<RouteState<T>>({
    data: initialData,
    isLoading: false,
    error: null,
  });

  const updateState = useCallback((newData: Partial<T>) => {
    setState((prev) => ({
      ...prev,
      data: { ...prev.data, ...newData },
    }));
  }, []);

  const setLoading = useCallback((isLoading: boolean) => {
    setState((prev) => ({ ...prev, isLoading }));
  }, []);

  const setError = useCallback((error: Error | null) => {
    setState((prev) => ({ ...prev, error }));
  }, []);

  const navigateWithState = useCallback((path: string, stateData?: Record<string, any>) => {
    if (stateData) {
      const params = new URLSearchParams(stateData as any);
      router.push(`${path}?${params.toString()}`);
    } else {
      router.push(path);
    }
  }, [router]);

  return {
    ...state,
    updateState,
    setLoading,
    setError,
    navigateWithState,
    router,
    searchParams,
  };
}
