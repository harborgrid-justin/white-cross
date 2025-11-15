/**
 * State Module
 *
 * This module provides types for managing editor state, history,
 * and component instance runtime state.
 *
 * @module gui-builder/state
 */

// Editor state types
export type {
  SelectionState,
  FocusState,
  HoverState,
  DragDropState,
  ClipboardState,
  ViewportState,
  PanelState,
  EditorState,
} from './editor';

export { EditorMode, EditorViewMode, EditorTool } from './editor';

// History types
export type {
  BaseHistoryAction,
  InsertComponentAction,
  UpdateComponentAction,
  DeleteComponentAction,
  MoveComponentAction,
  UpdatePropertyAction,
  BatchAction,
  HistoryAction,
  HistoryEntry,
  HistoryState,
} from './history';

export { HistoryActionType, canUndo, canRedo } from './history';

// Instance state types
export type { InstanceRuntimeState, InstanceStateMap } from './instance';
