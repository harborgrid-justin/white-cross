/**
 * Redux Hooks - Centralized Export
 *
 * Consolidated Redux hooks with TypeScript support for all features:
 * - Core typed hooks (useAppDispatch, useAppSelector)
 * - Domain-specific hooks (auth, incidents, students, etc.)
 * - Entity management hooks
 * - Analytics and advanced features (Phase 3)
 * - Utility hooks for performance optimization
 *
 * @module hooks
 */

import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import { useCallback, useMemo, useState, useEffect } from 'react';
import type { RootState, AppDispatch } from '../reduxStore';
import type { BaseEntity, StandardEntityState, LoadingState } from '../types/entityTypes';

// ============================================================
// CORE TYPED HOOKS
// ============================================================

/**
 * Typed version of useDispatch hook
 * Use throughout your app instead of plain `useDispatch`
 */
export const useAppDispatch = () => useDispatch<AppDispatch>();

/**
 * Typed version of useSelector hook
 * Use throughout your app instead of plain `useSelector`
 */
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// ============================================================
// ENTITY SELECTION HOOKS
// ============================================================

/**
 * Hook to select entity state with loading and error information
 */
export function useEntityState<T extends BaseEntity>(
  selector: (state: RootState) => StandardEntityState<T>
) {
  return useAppSelector((state) => {
    const entityState = selector(state);
    return {
      ...entityState,
      isLoading: entityState.loading.list.isLoading ||
                 entityState.loading.detail.isLoading ||
                 entityState.loading.create.isLoading ||
                 entityState.loading.update.isLoading ||
                 entityState.loading.delete.isLoading ||
                 entityState.loading.bulk.isLoading,
      hasError: entityState.loading.list.error !== null ||
                entityState.loading.detail.error !== null ||
                entityState.loading.create.error !== null ||
                entityState.loading.update.error !== null ||
                entityState.loading.delete.error !== null ||
                entityState.loading.bulk.error !== null,
    };
  });
}

/**
 * Hook to select entities by ID with memoization
 */
export function useEntitiesById<T extends BaseEntity>(
  selector: (state: RootState) => StandardEntityState<T>,
  ids: string[]
): T[] {
  return useAppSelector((state) => {
    const entityState = selector(state);
    return ids
      .map(id => entityState.entities[id])
      .filter((entity): entity is T => entity !== undefined);
  });
}

/**
 * Hook to select a single entity by ID
 */
export function useEntityById<T extends BaseEntity>(
  selector: (state: RootState) => StandardEntityState<T>,
  id: string | undefined
): T | undefined {
  return useAppSelector((state) => {
    if (!id) return undefined;
    const entityState = selector(state);
    return entityState.entities[id];
  });
}

/**
 * Hook to select entities with filtering and sorting
 */
export function useFilteredEntities<T extends BaseEntity>(
  selector: (state: RootState) => StandardEntityState<T>,
  filterFn?: (entity: T) => boolean,
  sortFn?: (a: T, b: T) => number
): T[] {
  return useAppSelector((state) => {
    const entityState = selector(state);
    let entities = entityState.ids
      .map(id => entityState.entities[id])
      .filter((entity): entity is T => entity !== undefined);

    if (filterFn) {
      entities = entities.filter(filterFn);
    }

    if (sortFn) {
      entities = entities.sort(sortFn);
    }

    return entities;
  });
}

// ============================================================
// LOADING STATE HOOKS
// ============================================================

/**
 * Hook to get loading state for specific operations
 */
export function useLoadingState(
  selector: (state: RootState) => LoadingState
) {
  return useAppSelector(selector);
}

/**
 * Hook to check if any operation is loading
 */
export function useIsLoading(
  selector: (state: RootState) => LoadingState
): boolean {
  return useAppSelector((state) => {
    const loading = selector(state);
    return Object.values(loading).some(Boolean);
  });
}

/**
 * Hook to get specific loading operations
 */
export function useOperationLoading(
  selector: (state: RootState) => LoadingState,
  operations: (keyof LoadingState)[]
): boolean {
  return useAppSelector((state) => {
    const loading = selector(state);
    return operations.some(op => loading[op]);
  });
}

// ============================================================
// UTILITY HOOKS
// ============================================================

/**
 * Hook to create memoized selectors
 */
export function useMemoizedSelector<T>(
  selector: (state: RootState) => T,
  deps: React.DependencyList
): T {
  return useAppSelector(
    useMemo(() => selector, deps)
  );
}

/**
 * Hook to select multiple state slices at once
 */
export function useMultipleSelectors<T extends Record<string, any>>(
  selectors: {
    [K in keyof T]: (state: RootState) => T[K]
  }
): T {
  return useAppSelector((state) => {
    const result = {} as T;
    for (const [key, selector] of Object.entries(selectors)) {
      (result as any)[key] = selector(state);
    }
    return result;
  });
}

/**
 * Hook to debounce selector updates
 */
export function useDebouncedSelector<T>(
  selector: (state: RootState) => T,
  delay: number = 300
): T {
  const value = useAppSelector(selector);
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// ============================================================
// RE-EXPORT DOMAIN-SPECIFIC HOOKS
// ============================================================
// Import after core hooks are defined to avoid circular deps

export * from './domainHooks';
export * from './advancedHooks';
export * from './allDomainHooks';
