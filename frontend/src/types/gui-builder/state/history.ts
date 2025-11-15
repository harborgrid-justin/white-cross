/**
 * History and Undo/Redo Types
 *
 * This module defines types for tracking changes and implementing
 * undo/redo functionality in the editor.
 *
 * @module gui-builder/state/history
 */

import type { ComponentInstance } from '../layout';

/**
 * Action type for history tracking.
 */
export enum HistoryActionType {
  InsertComponent = 'insert-component',
  UpdateComponent = 'update-component',
  DeleteComponent = 'delete-component',
  MoveComponent = 'move-component',
  UpdateProperty = 'update-property',
  UpdatePage = 'update-page',
  Batch = 'batch',
}

/**
 * Base history action.
 */
export interface BaseHistoryAction {
  readonly type: HistoryActionType;
  readonly timestamp: string;
  readonly userId?: string;
}

/**
 * Insert component action.
 */
export interface InsertComponentAction extends BaseHistoryAction {
  readonly type: HistoryActionType.InsertComponent;
  readonly instance: ComponentInstance;
  readonly parentId: string | null;
  readonly index?: number;
}

/**
 * Update component action.
 */
export interface UpdateComponentAction extends BaseHistoryAction {
  readonly type: HistoryActionType.UpdateComponent;
  readonly instanceId: string;
  readonly previous: ComponentInstance;
  readonly current: ComponentInstance;
}

/**
 * Delete component action.
 */
export interface DeleteComponentAction extends BaseHistoryAction {
  readonly type: HistoryActionType.DeleteComponent;
  readonly instance: ComponentInstance;
  readonly parentId: string | null;
  readonly index: number;
}

/**
 * Move component action.
 */
export interface MoveComponentAction extends BaseHistoryAction {
  readonly type: HistoryActionType.MoveComponent;
  readonly instanceId: string;
  readonly oldParentId: string | null;
  readonly newParentId: string | null;
  readonly oldIndex: number;
  readonly newIndex: number;
}

/**
 * Update property action.
 */
export interface UpdatePropertyAction extends BaseHistoryAction {
  readonly type: HistoryActionType.UpdateProperty;
  readonly instanceId: string;
  readonly propertyId: string;
  readonly previousValue: unknown;
  readonly currentValue: unknown;
}

/**
 * Batch action (multiple actions as one).
 */
export interface BatchAction extends BaseHistoryAction {
  readonly type: HistoryActionType.Batch;
  readonly actions: readonly HistoryAction[];
  readonly description: string;
}

/**
 * Union of all history actions.
 */
export type HistoryAction =
  | InsertComponentAction
  | UpdateComponentAction
  | DeleteComponentAction
  | MoveComponentAction
  | UpdatePropertyAction
  | BatchAction;

/**
 * History entry.
 */
export interface HistoryEntry {
  readonly id: string;
  readonly action: HistoryAction;
  readonly description: string;
  readonly timestamp: string;
}

/**
 * History state.
 */
export interface HistoryState {
  readonly past: readonly HistoryEntry[];
  readonly future: readonly HistoryEntry[];
  readonly maxSize: number;
  readonly currentIndex: number;
}

/**
 * Helper to check if undo is available.
 */
export function canUndo(history: HistoryState): boolean {
  return history.past.length > 0;
}

/**
 * Helper to check if redo is available.
 */
export function canRedo(history: HistoryState): boolean {
  return history.future.length > 0;
}
