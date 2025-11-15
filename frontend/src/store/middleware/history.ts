/**
 * History middleware for undo/redo functionality
 *
 * This middleware tracks state changes and creates snapshots for time-travel debugging.
 * It implements a simple undo/redo stack with configurable snapshot limits.
 */

import type { StateCreator, StoreMutatorIdentifier } from 'zustand';
import { nanoid } from 'nanoid';
import type { PageBuilderState, StateSnapshot } from '../types';

type HistoryMiddleware = <
  T extends PageBuilderState,
  Mps extends [StoreMutatorIdentifier, unknown][] = [],
  Mcs extends [StoreMutatorIdentifier, unknown][] = []
>(
  config: StateCreator<T, Mps, Mcs>,
  options?: HistoryOptions
) => StateCreator<T, Mps, Mcs>;

export interface HistoryOptions {
  /**
   * Maximum number of snapshots to keep in history
   * @default 50
   */
  limit?: number;

  /**
   * Actions to exclude from history tracking
   */
  excludeActions?: string[];

  /**
   * Actions to include in history tracking (if set, only these actions are tracked)
   */
  includeActions?: string[];

  /**
   * Debounce delay in milliseconds
   * @default 0
   */
  debounce?: number;
}

type HistoryImpl = <T extends PageBuilderState>(
  config: StateCreator<T, [], []>,
  options?: HistoryOptions
) => StateCreator<T, [], []>;

/**
 * Create a state snapshot
 */
function createSnapshot(
  state: PageBuilderState,
  actionType: string,
  actionPayload?: any
): StateSnapshot {
  return {
    id: nanoid(),
    timestamp: Date.now(),
    canvas: state.canvas,
    selection: state.selection,
    properties: state.properties,
    actionType,
    actionPayload,
  };
}

/**
 * Check if an action should be tracked
 */
function shouldTrackAction(
  actionType: string,
  options?: HistoryOptions
): boolean {
  if (!actionType) return false;

  // Exclude specific actions
  if (options?.excludeActions?.includes(actionType)) {
    return false;
  }

  // If includeActions is set, only track those actions
  if (options?.includeActions && options.includeActions.length > 0) {
    return options.includeActions.includes(actionType);
  }

  // Default: track all actions except history actions
  const historyActions = ['undo', 'redo', 'clearHistory', 'takeSnapshot'];
  const selectionActions = ['select', 'deselect', 'selectMultiple', 'clearSelection', 'setHovered', 'setFocused'];
  const previewActions = ['togglePreview', 'setPreviewMode', 'setViewport', 'setDevice'];

  return (
    !historyActions.includes(actionType) &&
    !selectionActions.includes(actionType) &&
    !previewActions.includes(actionType)
  );
}

/**
 * History middleware implementation
 *
 * This is a simplified version. For production, you might want to use
 * a library like `zustand-middleware-history` or implement more sophisticated
 * snapshot management with compression.
 */
export const historyMiddleware: HistoryImpl = (config, options) => (set, get, api) => {
  let debounceTimer: NodeJS.Timeout | null = null;
  let lastActionType: string | null = null;

  const wrappedSet: typeof set = (partial, replace, actionType) => {
    // Call original set
    set(partial, replace, actionType);

    // Track snapshot if needed
    if (typeof actionType === 'string' && shouldTrackAction(actionType, options)) {
      const takeSnapshot = () => {
        const state = get() as PageBuilderState;
        const snapshot = createSnapshot(state, actionType);

        // Update history
        set((state: any) => {
          const newPast = [...state.history.past, snapshot];
          const limit = options?.limit || state.history.maxSnapshots || 50;

          // Trim past if exceeds limit
          if (newPast.length > limit) {
            newPast.shift();
          }

          return {
            history: {
              ...state.history,
              past: newPast,
              future: [], // Clear future on new action
            },
          };
        });
      };

      if (options?.debounce && options.debounce > 0) {
        if (debounceTimer) {
          clearTimeout(debounceTimer);
        }
        debounceTimer = setTimeout(takeSnapshot, options.debounce);
      } else {
        takeSnapshot();
      }

      lastActionType = actionType;
    }
  };

  return config(wrappedSet, get, api);
};

/**
 * Note: The above middleware is a basic implementation.
 * For production use, consider these enhancements:
 *
 * 1. Snapshot compression to reduce memory usage
 * 2. Differential snapshots (only store changes)
 * 3. IndexedDB persistence for large histories
 * 4. Grouped actions (batch multiple actions into one snapshot)
 * 5. Custom equality checks to avoid duplicate snapshots
 */
