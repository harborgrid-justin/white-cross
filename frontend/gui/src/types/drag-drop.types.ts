/**
 * Drag and Drop Type Definitions
 *
 * Comprehensive type definitions for the drag-drop system.
 * Provides type-safe interfaces for all drag-drop operations.
 */

import type { ComponentId, ComponentInstance } from './index';

// ============================================================================
// DRAG OPERATION TYPES
// ============================================================================

/**
 * Drag operation type
 */
export type DragOperation = 'move' | 'copy' | 'link' | 'none';

/**
 * Drop effect feedback
 */
export type DropEffect = 'move' | 'copy' | 'link' | 'none';

/**
 * Drag state during operation
 */
export type DragState = 'idle' | 'dragging' | 'dropping' | 'cancelled';

// ============================================================================
// DRAGGABLE TYPES
// ============================================================================

/**
 * Data attached to a draggable item
 */
export interface DraggableData<T = any> {
  /** Unique identifier for the draggable item */
  id: string | ComponentId;
  /** Type of draggable item */
  type: string;
  /** Whether this is from the component palette */
  fromPalette?: boolean;
  /** Custom data payload */
  data?: T;
  /** Component instance (if dragging existing component) */
  component?: ComponentInstance;
  /** Index in parent list (for sortable) */
  index?: number;
}

/**
 * Draggable item configuration
 */
export interface DraggableConfig<T = any> {
  /** Unique ID for this draggable */
  id: string | ComponentId;
  /** Data to attach to drag operation */
  data: DraggableData<T>;
  /** Whether dragging is disabled */
  disabled?: boolean;
  /** Allowed drag operations */
  operations?: DragOperation[];
  /** Activation constraint distance in pixels */
  activationDistance?: number;
  /** Custom drag preview renderer */
  renderPreview?: () => React.ReactNode;
}

/**
 * Draggable item state
 */
export interface DraggableState {
  /** Current drag state */
  state: DragState;
  /** Whether this item is currently being dragged */
  isDragging: boolean;
  /** Current transform during drag */
  transform?: {
    x: number;
    y: number;
    scaleX: number;
    scaleY: number;
  };
}

// ============================================================================
// DROPPABLE TYPES
// ============================================================================

/**
 * Drop zone state
 */
export type DropZoneState =
  | 'idle'          // No drag operation
  | 'potential'     // Drag in progress, but not over this zone
  | 'active'        // Dragged item is over this zone
  | 'valid'         // Drop would be valid
  | 'invalid'       // Drop would be invalid
  | 'dropping';     // Drop operation in progress

/**
 * Drop zone validation result
 */
export interface DropValidation {
  /** Whether drop is allowed */
  isValid: boolean;
  /** Reason for invalid drop (if applicable) */
  reason?: string;
  /** Warning message (drop allowed but with caveats) */
  warning?: string;
}

/**
 * Droppable area configuration
 */
export interface DroppableConfig<T = any> {
  /** Unique ID for this droppable */
  id: string | ComponentId;
  /** Accepted draggable types */
  accepts?: string[];
  /** Whether dropping is disabled */
  disabled?: boolean;
  /** Custom validation function */
  validate?: (data: DraggableData, context?: T) => DropValidation;
  /** Whether to show drop zone indicator */
  showIndicator?: boolean;
  /** Custom drop zone styles */
  indicatorStyle?: 'outline' | 'fill' | 'glow' | 'custom';
}

/**
 * Droppable area state
 */
export interface DroppableState {
  /** Current drop zone state */
  state: DropZoneState;
  /** Whether drop zone is currently active */
  isActive: boolean;
  /** Whether current drag can be dropped here */
  canDrop: boolean;
  /** Validation result for current drag */
  validation?: DropValidation;
}

// ============================================================================
// COLLISION DETECTION
// ============================================================================

/**
 * Collision detection strategy
 */
export type CollisionDetectionStrategy =
  | 'pointer'           // Based on pointer position
  | 'closestCenter'     // Closest to center
  | 'closestCorners'    // Closest to corners
  | 'rectIntersection'  // Rectangle intersection
  | 'custom';           // Custom algorithm

/**
 * Collision information
 */
export interface CollisionInfo {
  /** Droppable ID that was hit */
  droppableId: string | ComponentId;
  /** Collision score (0-1, higher = better match) */
  score: number;
  /** Position of collision */
  position: {
    x: number;
    y: number;
  };
  /** Rectangle of droppable area */
  rect: DOMRect;
}

// ============================================================================
// DROP ZONE VISUAL FEEDBACK
// ============================================================================

/**
 * Drop zone indicator appearance
 */
export interface DropZoneIndicator {
  /** Indicator type */
  type: 'border' | 'fill' | 'glow' | 'overlay' | 'custom';
  /** Color (valid state) */
  validColor?: string;
  /** Color (invalid state) */
  invalidColor?: string;
  /** Animation type */
  animation?: 'pulse' | 'glow' | 'shimmer' | 'none';
  /** Show drop position guide */
  showGuide?: boolean;
}

/**
 * Alignment guide configuration
 */
export interface AlignmentGuide {
  /** Show vertical alignment guides */
  showVertical?: boolean;
  /** Show horizontal alignment guides */
  showHorizontal?: boolean;
  /** Show distance measurements */
  showDistances?: boolean;
  /** Snap threshold in pixels */
  snapThreshold?: number;
}

// ============================================================================
// RESIZE TYPES
// ============================================================================

/**
 * Resize handle position
 */
export type ResizeHandle =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'middle-left'
  | 'middle-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right';

/**
 * Resize constraints
 */
export interface ResizeConstraints {
  /** Minimum width */
  minWidth?: number;
  /** Minimum height */
  minHeight?: number;
  /** Maximum width */
  maxWidth?: number;
  /** Maximum height */
  maxHeight?: number;
  /** Lock aspect ratio */
  lockAspectRatio?: boolean;
  /** Snap to grid during resize */
  snapToGrid?: boolean;
  /** Grid size for snapping */
  gridSize?: number;
}

/**
 * Resize state
 */
export interface ResizeState {
  /** Whether currently resizing */
  isResizing: boolean;
  /** Active resize handle */
  activeHandle: ResizeHandle | null;
  /** Original size before resize */
  originalSize?: {
    width: number;
    height: number;
  };
  /** Current size during resize */
  currentSize?: {
    width: number;
    height: number;
  };
}

// ============================================================================
// KEYBOARD NAVIGATION
// ============================================================================

/**
 * Keyboard drag-drop mode
 */
export type KeyboardDragMode = 'off' | 'grab' | 'move' | 'resize';

/**
 * Keyboard navigation state
 */
export interface KeyboardNavigationState {
  /** Current mode */
  mode: KeyboardDragMode;
  /** Currently focused component */
  focusedId: ComponentId | null;
  /** Component being dragged via keyboard */
  draggedId: ComponentId | null;
  /** Movement step size (pixels) */
  stepSize: number;
  /** Fine movement (1px) enabled */
  fineMovement: boolean;
}

/**
 * Keyboard command
 */
export interface KeyboardCommand {
  /** Key combination */
  key: string;
  /** Ctrl modifier */
  ctrl?: boolean;
  /** Shift modifier */
  shift?: boolean;
  /** Alt modifier */
  alt?: boolean;
  /** Command description (for help/accessibility) */
  description: string;
  /** Command handler */
  handler: () => void;
}

// ============================================================================
// EVENT TYPES
// ============================================================================

/**
 * Drag start event data
 */
export interface DragStartEvent<T = any> {
  /** Item being dragged */
  data: DraggableData<T>;
  /** Starting position */
  startPosition: {
    x: number;
    y: number;
  };
  /** Timestamp */
  timestamp: number;
}

/**
 * Drag move event data
 */
export interface DragMoveEvent<T = any> {
  /** Item being dragged */
  data: DraggableData<T>;
  /** Current position */
  position: {
    x: number;
    y: number;
  };
  /** Delta from last position */
  delta: {
    x: number;
    y: number;
  };
  /** Over droppable (if any) */
  over?: {
    id: string | ComponentId;
    data?: any;
  };
}

/**
 * Drag end event data
 */
export interface DragEndEvent<T = any> {
  /** Item being dragged */
  data: DraggableData<T>;
  /** Final position */
  finalPosition: {
    x: number;
    y: number;
  };
  /** Total delta from start */
  totalDelta: {
    x: number;
    y: number;
  };
  /** Drop target (if any) */
  dropTarget?: {
    id: string | ComponentId;
    data?: any;
  };
  /** Whether drop was successful */
  success: boolean;
  /** Drop operation performed */
  operation: DragOperation;
}

/**
 * Drop event data
 */
export interface DropEvent<T = any> {
  /** Dragged item data */
  draggedData: DraggableData<T>;
  /** Drop target ID */
  targetId: string | ComponentId;
  /** Drop position */
  position: {
    x: number;
    y: number;
  };
  /** Drop operation */
  operation: DragOperation;
}

// ============================================================================
// ACCESSIBILITY
// ============================================================================

/**
 * Accessibility announcement
 */
export interface A11yAnnouncement {
  /** Announcement message */
  message: string;
  /** Announcement priority */
  priority: 'polite' | 'assertive';
  /** Timestamp */
  timestamp: number;
}

/**
 * Screen reader instructions
 */
export interface ScreenReaderInstructions {
  /** Instructions for drag start */
  dragStart: string;
  /** Instructions during drag */
  dragging: string;
  /** Instructions for drop */
  drop: string;
  /** Instructions for cancel */
  cancel: string;
}

// ============================================================================
// UTILITIES
// ============================================================================

/**
 * Bounding box
 */
export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Position
 */
export interface Position {
  x: number;
  y: number;
}

/**
 * Size
 */
export interface Size {
  width: number;
  height: number;
}

/**
 * Transform
 */
export interface Transform {
  x: number;
  y: number;
  scaleX?: number;
  scaleY?: number;
  rotation?: number;
}
