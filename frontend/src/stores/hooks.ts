/**
 * Redux Store Hooks
 *
 * Type-safe hooks for accessing Redux store.
 * This is a placeholder implementation that should be integrated with actual store.
 *
 * @module stores/hooks
 */

import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from './types';

/**
 * Type-safe version of useDispatch hook
 */
export const useAppDispatch = () => useDispatch<AppDispatch>();

/**
 * Type-safe version of useSelector hook
 */
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

/**
 * Hook to get a specific slice from the store
 */
export const useStore = () => {
  return useAppSelector(state => state);
};
