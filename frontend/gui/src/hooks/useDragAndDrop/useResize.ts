/**
 * useResize Hook
 *
 * Provides resize functionality for components with handle-based resizing.
 * Supports constraints, aspect ratio locking, and grid snapping.
 */

import { useCallback, useState, useRef, useEffect } from 'react';
import type {
  ResizeHandle,
  ResizeConstraints,
  ResizeState,
  Size,
  Position,
} from '../../types/drag-drop.types';

/**
 * Resize configuration
 */
export interface UseResizeConfig {
  /** Initial size */
  initialSize: Size;
  /** Initial position */
  initialPosition: Position;
  /** Resize constraints */
  constraints?: ResizeConstraints;
  /** Callback when resize starts */
  onResizeStart?: (handle: ResizeHandle) => void;
  /** Callback during resize */
  onResize?: (size: Size, position: Position) => void;
  /** Callback when resize ends */
  onResizeEnd?: (size: Size, position: Position) => void;
  /** Whether resize is disabled */
  disabled?: boolean;
}

/**
 * useResize Hook
 *
 * Manages component resizing with multiple handles and constraints.
 *
 * @example
 * ```tsx
 * const {
 *   size,
 *   position,
 *   isResizing,
 *   activeHandle,
 *   handleMouseDown,
 * } = useResize({
 *   initialSize: { width: 200, height: 100 },
 *   initialPosition: { x: 0, y: 0 },
 *   constraints: { minWidth: 50, minHeight: 50 },
 *   onResize: (size, pos) => updateComponent(id, { size, position: pos }),
 * });
 * ```
 */
export const useResize = (config: UseResizeConfig) => {
  const {
    initialSize,
    initialPosition,
    constraints = {},
    onResizeStart,
    onResize,
    onResizeEnd,
    disabled = false,
  } = config;

  const {
    minWidth = 20,
    minHeight = 20,
    maxWidth = Infinity,
    maxHeight = Infinity,
    lockAspectRatio = false,
    snapToGrid = false,
    gridSize = 8,
  } = constraints;

  // State
  const [isResizing, setIsResizing] = useState(false);
  const [activeHandle, setActiveHandle] = useState<ResizeHandle | null>(null);
  const [size, setSize] = useState<Size>(initialSize);
  const [position, setPosition] = useState<Position>(initialPosition);

  // Refs for tracking resize operation
  const startSize = useRef<Size>(initialSize);
  const startPosition = useRef<Position>(initialPosition);
  const startMousePos = useRef<Position>({ x: 0, y: 0 });
  const aspectRatio = useRef<number>(initialSize.width / initialSize.height);

  /**
   * Snap value to grid
   */
  const snapValue = useCallback(
    (value: number): number => {
      if (!snapToGrid || gridSize <= 0) return value;
      return Math.round(value / gridSize) * gridSize;
    },
    [snapToGrid, gridSize]
  );

  /**
   * Apply constraints to size
   */
  const applyConstraints = useCallback(
    (newSize: Size, maintainAspectRatio: boolean = false): Size => {
      let { width, height } = newSize;

      // Apply min/max constraints
      width = Math.max(minWidth, Math.min(maxWidth, width));
      height = Math.max(minHeight, Math.min(maxHeight, height));

      // Apply aspect ratio if locked or Shift is pressed
      if (maintainAspectRatio) {
        const currentRatio = width / height;

        if (currentRatio > aspectRatio.current) {
          // Width is too large, adjust based on height
          width = height * aspectRatio.current;
        } else {
          // Height is too large, adjust based on width
          height = width / aspectRatio.current;
        }

        // Re-apply constraints after aspect ratio adjustment
        width = Math.max(minWidth, Math.min(maxWidth, width));
        height = Math.max(minHeight, Math.min(maxHeight, height));
      }

      // Apply grid snapping
      if (snapToGrid) {
        width = snapValue(width);
        height = snapValue(height);
      }

      return { width, height };
    },
    [minWidth, minHeight, maxWidth, maxHeight, snapToGrid, snapValue]
  );

  /**
   * Calculate new size and position based on handle and mouse delta
   */
  const calculateResize = useCallback(
    (
      handle: ResizeHandle,
      mouseDelta: Position,
      shiftKey: boolean
    ): { size: Size; position: Position } => {
      const maintainAspectRatio = lockAspectRatio || shiftKey;

      let newWidth = startSize.current.width;
      let newHeight = startSize.current.height;
      let newX = startPosition.current.x;
      let newY = startPosition.current.y;

      // Calculate size changes based on handle position
      switch (handle) {
        case 'top-left':
          newWidth = startSize.current.width - mouseDelta.x;
          newHeight = startSize.current.height - mouseDelta.y;
          newX = startPosition.current.x + mouseDelta.x;
          newY = startPosition.current.y + mouseDelta.y;
          break;

        case 'top-center':
          newHeight = startSize.current.height - mouseDelta.y;
          newY = startPosition.current.y + mouseDelta.y;
          break;

        case 'top-right':
          newWidth = startSize.current.width + mouseDelta.x;
          newHeight = startSize.current.height - mouseDelta.y;
          newY = startPosition.current.y + mouseDelta.y;
          break;

        case 'middle-left':
          newWidth = startSize.current.width - mouseDelta.x;
          newX = startPosition.current.x + mouseDelta.x;
          break;

        case 'middle-right':
          newWidth = startSize.current.width + mouseDelta.x;
          break;

        case 'bottom-left':
          newWidth = startSize.current.width - mouseDelta.x;
          newHeight = startSize.current.height + mouseDelta.y;
          newX = startPosition.current.x + mouseDelta.x;
          break;

        case 'bottom-center':
          newHeight = startSize.current.height + mouseDelta.y;
          break;

        case 'bottom-right':
          newWidth = startSize.current.width + mouseDelta.x;
          newHeight = startSize.current.height + mouseDelta.y;
          break;
      }

      // Apply constraints
      const constrainedSize = applyConstraints(
        { width: newWidth, height: newHeight },
        maintainAspectRatio
      );

      // Adjust position if resizing from left or top edges
      if (handle.includes('left')) {
        newX = startPosition.current.x + (startSize.current.width - constrainedSize.width);
      }
      if (handle.includes('top')) {
        newY = startPosition.current.y + (startSize.current.height - constrainedSize.height);
      }

      // Snap position to grid
      if (snapToGrid) {
        newX = snapValue(newX);
        newY = snapValue(newY);
      }

      return {
        size: constrainedSize,
        position: { x: newX, y: newY },
      };
    },
    [lockAspectRatio, applyConstraints, snapToGrid, snapValue]
  );

  /**
   * Handle mouse down on resize handle
   */
  const handleMouseDown = useCallback(
    (handle: ResizeHandle, event: React.MouseEvent) => {
      if (disabled) return;

      event.preventDefault();
      event.stopPropagation();

      setIsResizing(true);
      setActiveHandle(handle);

      startSize.current = size;
      startPosition.current = position;
      startMousePos.current = { x: event.clientX, y: event.clientY };
      aspectRatio.current = size.width / size.height;

      if (onResizeStart) {
        onResizeStart(handle);
      }
    },
    [disabled, size, position, onResizeStart]
  );

  /**
   * Handle mouse move during resize
   */
  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      if (!isResizing || !activeHandle) return;

      const mouseDelta = {
        x: event.clientX - startMousePos.current.x,
        y: event.clientY - startMousePos.current.y,
      };

      const { size: newSize, position: newPosition } = calculateResize(
        activeHandle,
        mouseDelta,
        event.shiftKey
      );

      setSize(newSize);
      setPosition(newPosition);

      if (onResize) {
        onResize(newSize, newPosition);
      }
    },
    [isResizing, activeHandle, calculateResize, onResize]
  );

  /**
   * Handle mouse up to end resize
   */
  const handleMouseUp = useCallback(() => {
    if (!isResizing) return;

    setIsResizing(false);
    setActiveHandle(null);

    if (onResizeEnd) {
      onResizeEnd(size, position);
    }
  }, [isResizing, size, position, onResizeEnd]);

  /**
   * Attach mouse event listeners during resize
   */
  useEffect(() => {
    if (!isResizing) return;

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, handleMouseMove, handleMouseUp]);

  /**
   * Update size/position when props change (controlled mode)
   */
  useEffect(() => {
    if (!isResizing) {
      setSize(initialSize);
      setPosition(initialPosition);
    }
  }, [initialSize, initialPosition, isResizing]);

  return {
    size,
    position,
    isResizing,
    activeHandle,
    handleMouseDown,
    state: {
      isResizing,
      activeHandle,
      originalSize: startSize.current,
      currentSize: size,
    } as ResizeState,
  };
};

/**
 * Get cursor style for resize handle
 */
export const getResizeHandleCursor = (handle: ResizeHandle): string => {
  const cursors: Record<ResizeHandle, string> = {
    'top-left': 'nwse-resize',
    'top-center': 'ns-resize',
    'top-right': 'nesw-resize',
    'middle-left': 'ew-resize',
    'middle-right': 'ew-resize',
    'bottom-left': 'nesw-resize',
    'bottom-center': 'ns-resize',
    'bottom-right': 'nwse-resize',
  };

  return cursors[handle];
};

/**
 * Resize handle positions calculator
 */
export const calculateHandlePositions = (
  size: Size,
  position: Position,
  handleSize: number = 8
): Array<{
  handle: ResizeHandle;
  x: number;
  y: number;
  cursor: string;
}> => {
  const { width, height } = size;
  const { x, y } = position;
  const offset = handleSize / 2;

  return [
    {
      handle: 'top-left',
      x: x - offset,
      y: y - offset,
      cursor: 'nwse-resize',
    },
    {
      handle: 'top-center',
      x: x + width / 2 - offset,
      y: y - offset,
      cursor: 'ns-resize',
    },
    {
      handle: 'top-right',
      x: x + width - offset,
      y: y - offset,
      cursor: 'nesw-resize',
    },
    {
      handle: 'middle-left',
      x: x - offset,
      y: y + height / 2 - offset,
      cursor: 'ew-resize',
    },
    {
      handle: 'middle-right',
      x: x + width - offset,
      y: y + height / 2 - offset,
      cursor: 'ew-resize',
    },
    {
      handle: 'bottom-left',
      x: x - offset,
      y: y + height - offset,
      cursor: 'nesw-resize',
    },
    {
      handle: 'bottom-center',
      x: x + width / 2 - offset,
      y: y + height - offset,
      cursor: 'ns-resize',
    },
    {
      handle: 'bottom-right',
      x: x + width - offset,
      y: y + height - offset,
      cursor: 'nwse-resize',
    },
  ];
};
