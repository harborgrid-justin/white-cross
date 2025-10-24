/**
 * Typed Redux Hooks
 *
 * Enhanced type-safe hooks for Redux with better DX.
 * Provides memoization and performance optimization.
 *
 * @module stores/hooks/typedHooks
 */

import { useDispatch, useSelector, type TypedUseSelectorHook, shallowEqual } from 'react-redux';
import { useCallback, useMemo } from 'react';
import type { RootState, AppDispatch } from '../reduxStore';
import { createSelector } from '@reduxjs/toolkit';

/**
 * Type-safe useDispatch hook
 */
export const useAppDispatch = () => useDispatch<AppDispatch>();

/**
 * Type-safe useSelector hook with optional equality function
 */
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

/**
 * Type-safe useSelector with shallow equality check
 * Useful when selecting multiple values as an object
 *
 * @example
 * ```typescript
 * const { user, isAuthenticated } = useShallowSelector(state => ({
 *   user: state.auth.user,
 *   isAuthenticated: state.auth.isAuthenticated
 * }));
 * ```
 */
export const useShallowSelector = <T>(
  selector: (state: RootState) => T
): T => {
  return useSelector(selector, shallowEqual);
};

/**
 * Hook to create a memoized selector inline
 * Useful for parameterized selectors with props
 *
 * @example
 * ```typescript
 * function StudentCard({ studentId }: { studentId: string }) {
 *   const student = useMemoizedSelector(
 *     state => state.students.entities[studentId],
 *     [studentId]
 *   );
 *
 *   return <div>{student?.name}</div>;
 * }
 * ```
 */
export const useMemoizedSelector = <T>(
  selector: (state: RootState) => T,
  deps: any[]
): T => {
  const memoizedSelector = useMemo(
    () => createSelector([(state: RootState) => state], selector),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    deps
  );

  return useAppSelector(memoizedSelector);
};

/**
 * Hook for selecting a slice of state with automatic memoization
 *
 * @example
 * ```typescript
 * const authState = useSlice('auth');
 * const studentsState = useSlice('students');
 * ```
 */
export const useSlice = <K extends keyof RootState>(
  sliceName: K
): RootState[K] => {
  return useAppSelector(state => state[sliceName]);
};

/**
 * Hook for selecting loading state across multiple slices
 *
 * @example
 * ```typescript
 * const isLoading = useIsLoading(['students', 'medications', 'healthRecords']);
 * ```
 */
export const useIsLoading = (
  sliceNames: Array<keyof RootState>
): boolean => {
  return useAppSelector(state =>
    sliceNames.some(sliceName => {
      const slice = state[sliceName] as any;
      return slice?.isLoading || false;
    })
  );
};

/**
 * Hook for selecting errors across multiple slices
 *
 * @example
 * ```typescript
 * const errors = useErrors(['students', 'medications']);
 * ```
 */
export const useErrors = (
  sliceNames: Array<keyof RootState>
): Record<string, string | null> => {
  return useAppSelector(state => {
    const errors: Record<string, string | null> = {};

    for (const sliceName of sliceNames) {
      const slice = state[sliceName] as any;
      errors[sliceName] = slice?.error || null;
    }

    return errors;
  });
};

/**
 * Hook for dispatching actions with automatic type inference
 *
 * @example
 * ```typescript
 * const dispatchAction = useTypedDispatch();
 *
 * // Automatically typed based on action creator
 * dispatchAction(fetchStudents());
 * dispatchAction(createStudent({ name: 'John' }));
 * ```
 */
export const useTypedDispatch = () => {
  const dispatch = useAppDispatch();

  return useCallback(
    <T extends (...args: any[]) => any>(action: ReturnType<T>) => {
      return dispatch(action);
    },
    [dispatch]
  );
};

/**
 * Hook for selecting and dispatching in one
 * Useful for managing slice state
 *
 * @example
 * ```typescript
 * const [authState, authActions] = useSliceActions('auth', {
 *   login: loginUser,
 *   logout: logoutUser
 * });
 *
 * // Use state
 * console.log(authState.user);
 *
 * // Dispatch actions
 * authActions.login(credentials);
 * ```
 */
export const useSliceActions = <
  K extends keyof RootState,
  A extends Record<string, (...args: any[]) => any>
>(
  sliceName: K,
  actions: A
): [RootState[K], { [P in keyof A]: (...args: Parameters<A[P]>) => void }] => {
  const state = useSlice(sliceName);
  const dispatch = useAppDispatch();

  const boundActions = useMemo(() => {
    const bound: any = {};

    for (const [key, actionCreator] of Object.entries(actions)) {
      bound[key] = (...args: any[]) => dispatch(actionCreator(...args));
    }

    return bound as { [P in keyof A]: (...args: Parameters<A[P]>) => void };
  }, [actions, dispatch]);

  return [state, boundActions];
};

/**
 * Hook for selecting entity by ID with memoization
 *
 * @example
 * ```typescript
 * const student = useEntityById('students', studentId);
 * ```
 */
export const useEntityById = <T>(
  sliceName: keyof RootState,
  id: string | undefined
): T | null => {
  return useAppSelector(state => {
    if (!id) return null;

    const slice = state[sliceName] as any;
    return slice?.entities?.[id] || null;
  });
};

/**
 * Hook for selecting all entities from a slice
 *
 * @example
 * ```typescript
 * const students = useEntities('students');
 * ```
 */
export const useEntities = <T>(
  sliceName: keyof RootState
): T[] => {
  return useAppSelector(state => {
    const slice = state[sliceName] as any;
    const entities = slice?.entities || {};
    return Object.values(entities).filter(Boolean) as T[];
  });
};

/**
 * Hook for selecting entity IDs
 *
 * @example
 * ```typescript
 * const studentIds = useEntityIds('students');
 * ```
 */
export const useEntityIds = (
  sliceName: keyof RootState
): string[] => {
  return useAppSelector(state => {
    const slice = state[sliceName] as any;
    return slice?.ids || [];
  });
};

/**
 * Hook that combines loading and error states
 *
 * @example
 * ```typescript
 * const { isLoading, error, hasError } = useAsyncState('students');
 * ```
 */
export const useAsyncState = (sliceName: keyof RootState) => {
  return useAppSelector(state => {
    const slice = state[sliceName] as any;

    return {
      isLoading: slice?.isLoading || false,
      error: slice?.error || null,
      hasError: !!slice?.error,
    };
  });
};
