/**
 * Custom hooks for history (undo/redo) state
 */

import { useCallback } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { usePageBuilderStore } from '../index';
import { selectCanUndo, selectCanRedo } from '../selectors/derived-selectors';

/**
 * Hook to check if undo is available
 */
export function useCanUndo() {
  return usePageBuilderStore(useCallback((state) => selectCanUndo(state), []));
}

/**
 * Hook to check if redo is available
 */
export function useCanRedo() {
  return usePageBuilderStore(useCallback((state) => selectCanRedo(state), []));
}

/**
 * Hook to get undo action
 */
export function useUndo() {
  return usePageBuilderStore((state) => state.undo);
}

/**
 * Hook to get redo action
 */
export function useRedo() {
  return usePageBuilderStore((state) => state.redo);
}

/**
 * Hook to get history actions
 */
export function useHistoryActions() {
  return usePageBuilderStore(
    useShallow((state) => ({
      undo: state.undo,
      redo: state.redo,
      clearHistory: state.clearHistory,
      takeSnapshot: state.takeSnapshot,
    }))
  );
}

/**
 * Hook to get undo/redo state
 */
export function useHistoryState() {
  return usePageBuilderStore(
    useShallow((state) => ({
      canUndo: selectCanUndo(state),
      canRedo: selectCanRedo(state),
      pastLength: state.history.past.length,
      futureLength: state.history.future.length,
    }))
  );
}
