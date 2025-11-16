/**
 * Drag-Drop State Management
 *
 * Dedicated state management for drag-and-drop operations.
 * Integrates with @dnd-kit for optimal DnD performance.
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type { ComponentId } from '../types';

// ============================================================================
// TYPES
// ============================================================================

export interface DraggedItem {
  id: ComponentId;
  type: string;
  isNew: boolean; // True if dragging from palette, false if from canvas
  ghostPosition: { x: number; y: number };
  offset: { x: number; y: number };
}

export interface DropTarget {
  id: ComponentId | null; // null for root canvas
  type: 'canvas' | 'container' | 'slot';
  accepts: string[]; // Component types that can be dropped
  position: { x: number; y: number; width: number; height: number };
  isValid: boolean;
}

export interface DragConstraints {
  snapToGrid: boolean;
  gridSize: number;
  bounds?: {
    minX: number;
    minY: number;
    maxX: number;
    maxY: number;
  };
  preserveAspectRatio?: boolean;
}

export interface CollisionInfo {
  componentId: ComponentId;
  overlap: number; // 0-1, percentage of overlap
  position: 'above' | 'below' | 'inside';
}

export interface DragDropState {
  // Active drag state
  isDragging: boolean;
  draggedItem: DraggedItem | null;
  
  // Drop targets
  validDropTargets: DropTarget[];
  hoveredDropTarget: DropTarget | null;
  
  // Constraints
  constraints: DragConstraints;
  
  // Collision detection
  collisions: CollisionInfo[];
  
  // Visual feedback
  showDropIndicator: boolean;
  dropIndicatorPosition: { x: number; y: number } | null;
  
  // Drag preview
  ghostStyle: {
    opacity: number;
    scale: number;
  };
  
  // Actions
  startDrag: (item: DraggedItem) => void;
  updateDragPosition: (position: { x: number; y: number }) => void;
  endDrag: () => void;
  cancelDrag: () => void;
  
  setValidDropTargets: (targets: DropTarget[]) => void;
  setHoveredDropTarget: (target: DropTarget | null) => void;
  
  updateConstraints: (constraints: Partial<DragConstraints>) => void;
  updateCollisions: (collisions: CollisionInfo[]) => void;
  
  setDropIndicator: (show: boolean, position?: { x: number; y: number }) => void;
  updateGhostStyle: (style: Partial<typeof initialState.ghostStyle>) => void;
  
  reset: () => void;
}

// ============================================================================
// INITIAL STATE
// ============================================================================

const initialState = {
  isDragging: false,
  draggedItem: null,
  validDropTargets: [],
  hoveredDropTarget: null,
  constraints: {
    snapToGrid: true,
    gridSize: 8,
  },
  collisions: [],
  showDropIndicator: false,
  dropIndicatorPosition: null,
  ghostStyle: {
    opacity: 0.6,
    scale: 1.0,
  },
};

// ============================================================================
// STORE
// ============================================================================

export const useDragDropStore = create<DragDropState>()(
  devtools(
    immer((set, get) => ({
      ...initialState,

      startDrag: (item) => {
        set((state) => {
          state.isDragging = true;
          state.draggedItem = item;
          state.ghostStyle.opacity = 0.6;
          state.ghostStyle.scale = 0.95;
        });
      },

      updateDragPosition: (position) => {
        set((state) => {
          if (!state.draggedItem) return;

          const { snapToGrid, gridSize } = state.constraints;

          let finalPosition = position;

          // Apply snap to grid if enabled
          if (snapToGrid) {
            finalPosition = {
              x: Math.round(position.x / gridSize) * gridSize,
              y: Math.round(position.y / gridSize) * gridSize,
            };
          }

          // Apply bounds constraints if defined
          if (state.constraints.bounds) {
            const { minX, minY, maxX, maxY } = state.constraints.bounds;
            finalPosition = {
              x: Math.max(minX, Math.min(maxX, finalPosition.x)),
              y: Math.max(minY, Math.min(maxY, finalPosition.y)),
            };
          }

          state.draggedItem.ghostPosition = finalPosition;
        });
      },

      endDrag: () => {
        set((state) => {
          state.isDragging = false;
          state.draggedItem = null;
          state.validDropTargets = [];
          state.hoveredDropTarget = null;
          state.collisions = [];
          state.showDropIndicator = false;
          state.dropIndicatorPosition = null;
        });
      },

      cancelDrag: () => {
        set(() => initialState);
      },

      setValidDropTargets: (targets) => {
        set((state) => {
          state.validDropTargets = targets;
        });
      },

      setHoveredDropTarget: (target) => {
        set((state) => {
          state.hoveredDropTarget = target;
          
          // Update ghost style based on drop validity
          if (target) {
            state.ghostStyle.opacity = target.isValid ? 0.8 : 0.3;
            state.ghostStyle.scale = target.isValid ? 1.0 : 0.9;
          } else {
            state.ghostStyle.opacity = 0.6;
            state.ghostStyle.scale = 0.95;
          }
        });
      },

      updateConstraints: (constraints) => {
        set((state) => {
          Object.assign(state.constraints, constraints);
        });
      },

      updateCollisions: (collisions) => {
        set((state) => {
          state.collisions = collisions;
        });
      },

      setDropIndicator: (show, position) => {
        set((state) => {
          state.showDropIndicator = show;
          state.dropIndicatorPosition = position || null;
        });
      },

      updateGhostStyle: (style) => {
        set((state) => {
          Object.assign(state.ghostStyle, style);
        });
      },

      reset: () => {
        set(() => initialState);
      },
    })),
    {
      name: 'DragDropStore',
      enabled: process.env.NODE_ENV === 'development',
    }
  )
);

// ============================================================================
// SELECTORS
// ============================================================================

export const useIsDragging = () => useDragDropStore((state) => state.isDragging);

export const useDraggedItem = () => useDragDropStore((state) => state.draggedItem);

export const useHoveredDropTarget = () =>
  useDragDropStore((state) => state.hoveredDropTarget);

export const useDropIndicator = () =>
  useDragDropStore((state) => ({
    show: state.showDropIndicator,
    position: state.dropIndicatorPosition,
  }));

export const useGhostStyle = () => useDragDropStore((state) => state.ghostStyle);

export const useCollisions = () => useDragDropStore((state) => state.collisions);

export const useCanDrop = (componentType: string) =>
  useDragDropStore((state) => {
    if (!state.hoveredDropTarget) return false;
    return state.hoveredDropTarget.accepts.includes(componentType);
  });

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Calculate if a point is inside a rectangle
 */
export function isPointInRect(
  point: { x: number; y: number },
  rect: { x: number; y: number; width: number; height: number }
): boolean {
  return (
    point.x >= rect.x &&
    point.x <= rect.x + rect.width &&
    point.y >= rect.y &&
    point.y <= rect.y + rect.height
  );
}

/**
 * Calculate overlap percentage between two rectangles
 */
export function calculateOverlap(
  rect1: { x: number; y: number; width: number; height: number },
  rect2: { x: number; y: number; width: number; height: number }
): number {
  const xOverlap = Math.max(
    0,
    Math.min(rect1.x + rect1.width, rect2.x + rect2.width) - Math.max(rect1.x, rect2.x)
  );
  const yOverlap = Math.max(
    0,
    Math.min(rect1.y + rect1.height, rect2.y + rect2.height) - Math.max(rect1.y, rect2.y)
  );

  const overlapArea = xOverlap * yOverlap;
  const rect1Area = rect1.width * rect1.height;

  return rect1Area > 0 ? overlapArea / rect1Area : 0;
}

/**
 * Determine drop position relative to target
 */
export function getDropPosition(
  dropPoint: { x: number; y: number },
  targetRect: { x: number; y: number; width: number; height: number }
): 'above' | 'below' | 'inside' {
  const relativeY = dropPoint.y - targetRect.y;
  const threshold = targetRect.height * 0.25;

  if (relativeY < threshold) return 'above';
  if (relativeY > targetRect.height - threshold) return 'below';
  return 'inside';
}

/**
 * Snap position to grid
 */
export function snapToGrid(
  position: { x: number; y: number },
  gridSize: number
): { x: number; y: number } {
  return {
    x: Math.round(position.x / gridSize) * gridSize,
    y: Math.round(position.y / gridSize) * gridSize,
  };
}

/**
 * Constrain position within bounds
 */
export function constrainPosition(
  position: { x: number; y: number },
  bounds: { minX: number; minY: number; maxX: number; maxY: number }
): { x: number; y: number } {
  return {
    x: Math.max(bounds.minX, Math.min(bounds.maxX, position.x)),
    y: Math.max(bounds.minY, Math.min(bounds.maxY, position.y)),
  };
}
