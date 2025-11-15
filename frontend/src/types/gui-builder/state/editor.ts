/**
 * Editor State Types
 *
 * This module defines types for managing the GUI builder editor state,
 * including selection, focus, and editing mode.
 *
 * @module gui-builder/state/editor
 */

import type {
  PageId,
  ComponentInstanceId,
  PropertyId,
} from '../core';
import type { ComponentTree } from '../layout';

/**
 * Editor mode.
 */
export enum EditorMode {
  /**
   * Visual editing mode (drag and drop).
   */
  Visual = 'visual',

  /**
   * Code editing mode.
   */
  Code = 'code',

  /**
   * Preview mode (no editing).
   */
  Preview = 'preview',

  /**
   * Split view (visual + code).
   */
  Split = 'split',
}

/**
 * Editor view mode.
 */
export enum EditorViewMode {
  /**
   * Desktop view.
   */
  Desktop = 'desktop',

  /**
   * Tablet view.
   */
  Tablet = 'tablet',

  /**
   * Mobile view.
   */
  Mobile = 'mobile',

  /**
   * Custom viewport size.
   */
  Custom = 'custom',
}

/**
 * Editor tool/action.
 */
export enum EditorTool {
  Select = 'select',
  Insert = 'insert',
  Delete = 'delete',
  Move = 'move',
  Resize = 'resize',
  Edit = 'edit',
  Clone = 'clone',
}

/**
 * Selection state.
 */
export interface SelectionState {
  /**
   * Currently selected component instances.
   */
  readonly selectedInstances: readonly ComponentInstanceId[];

  /**
   * Primary selected instance (for multi-selection).
   */
  readonly primarySelection: ComponentInstanceId | null;

  /**
   * Whether multi-select is active.
   */
  readonly multiSelect: boolean;

  /**
   * Selection bounding box.
   */
  readonly boundingBox?: {
    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;
  };
}

/**
 * Focus state for property editing.
 */
export interface FocusState {
  /**
   * Instance being edited.
   */
  readonly focusedInstance: ComponentInstanceId | null;

  /**
   * Property being edited.
   */
  readonly focusedProperty: PropertyId | null;

  /**
   * Whether a property editor is open.
   */
  readonly isEditing: boolean;
}

/**
 * Hover state for component highlighting.
 */
export interface HoverState {
  /**
   * Currently hovered instance.
   */
  readonly hoveredInstance: ComponentInstanceId | null;

  /**
   * Hover position.
   */
  readonly position?: {
    readonly x: number;
    readonly y: number;
  };
}

/**
 * Drag and drop state.
 */
export interface DragDropState {
  /**
   * Whether a drag operation is in progress.
   */
  readonly isDragging: boolean;

  /**
   * Instance being dragged.
   */
  readonly draggedInstance: ComponentInstanceId | null;

  /**
   * Component being dragged from palette (if new component).
   */
  readonly draggedComponentId?: string;

  /**
   * Drop target instance.
   */
  readonly dropTarget: ComponentInstanceId | null;

  /**
   * Drop position within target.
   */
  readonly dropPosition?: 'before' | 'after' | 'inside';

  /**
   * Drop index.
   */
  readonly dropIndex?: number;
}

/**
 * Clipboard state.
 */
export interface ClipboardState {
  /**
   * Copied/cut instances.
   */
  readonly items: readonly ComponentInstanceId[];

  /**
   * Operation type.
   */
  readonly operation: 'copy' | 'cut' | null;
}

/**
 * Viewport state.
 */
export interface ViewportState {
  /**
   * Current viewport width.
   */
  readonly width: number;

  /**
   * Current viewport height.
   */
  readonly height: number;

  /**
   * Zoom level (1.0 = 100%).
   */
  readonly zoom: number;

  /**
   * Scroll position.
   */
  readonly scroll: {
    readonly x: number;
    readonly y: number;
  };

  /**
   * Whether rulers are visible.
   */
  readonly showRulers: boolean;

  /**
   * Whether guides are visible.
   */
  readonly showGuides: boolean;

  /**
   * Whether grid is visible.
   */
  readonly showGrid: boolean;
}

/**
 * Panel visibility state.
 */
export interface PanelState {
  /**
   * Component palette visibility.
   */
  readonly componentPalette: boolean;

  /**
   * Properties panel visibility.
   */
  readonly properties: boolean;

  /**
   * Layers panel visibility.
   */
  readonly layers: boolean;

  /**
   * History panel visibility.
   */
  readonly history: boolean;

  /**
   * Settings panel visibility.
   */
  readonly settings: boolean;
}

/**
 * Complete editor state.
 */
export interface EditorState {
  /**
   * Current page being edited.
   */
  readonly currentPageId: PageId | null;

  /**
   * Editor mode.
   */
  readonly mode: EditorMode;

  /**
   * View mode.
   */
  readonly viewMode: EditorViewMode;

  /**
   * Active tool.
   */
  readonly activeTool: EditorTool;

  /**
   * Selection state.
   */
  readonly selection: SelectionState;

  /**
   * Focus state.
   */
  readonly focus: FocusState;

  /**
   * Hover state.
   */
  readonly hover: HoverState;

  /**
   * Drag and drop state.
   */
  readonly dragDrop: DragDropState;

  /**
   * Clipboard state.
   */
  readonly clipboard: ClipboardState;

  /**
   * Viewport state.
   */
  readonly viewport: ViewportState;

  /**
   * Panel visibility.
   */
  readonly panels: PanelState;

  /**
   * Whether the editor is in read-only mode.
   */
  readonly readOnly: boolean;

  /**
   * Whether changes have been made since last save.
   */
  readonly isDirty: boolean;

  /**
   * Whether a save operation is in progress.
   */
  readonly isSaving: boolean;

  /**
   * Last save timestamp.
   */
  readonly lastSaved?: string;
}
