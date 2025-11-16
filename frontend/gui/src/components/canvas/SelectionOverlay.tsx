/**
 * SelectionOverlay - Visual Selection Feedback
 *
 * Provides visual feedback for selected components with:
 * - Blue outline around selected components
 * - 8 resize handles (4 corners + 4 midpoints)
 * - Dimension labels showing width x height
 * - Multi-select bounding box
 *
 * This overlay appears on top of selected components and provides
 * interactive handles for future resize functionality.
 */

'use client';

import React, { useMemo, useCallback, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelection, useUpdateComponent } from '../../hooks/usePageBuilder';
import { usePageBuilderStore } from '../../store';
import { useResize, calculateHandlePositions } from '../../hooks/useDragAndDrop';
import type { ComponentInstance } from '../../types';
import type { ResizeHandle } from '../../types/drag-drop.types';

// Using ResizeHandle from drag-drop types instead

/**
 * Bounding box for single or multiple selected components
 */
interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * SelectionOverlay component
 *
 * Renders selection indicators and resize handles for selected components.
 * Supports both single and multi-select scenarios.
 */
export const SelectionOverlay: React.FC = () => {
  // ============================================================================
  // STATE & HOOKS
  // ============================================================================

  const { selectedIds } = useSelection();
  const updateComponent = useUpdateComponent();
  const { snapToGrid, size: gridSize } = usePageBuilderStore((state) => state.canvas.grid);

  // Get selected components
  const selectedComponents = usePageBuilderStore((state) =>
    selectedIds.map((id) => state.canvas.components.byId[id]).filter(Boolean)
  );

  // Only enable resize for single selection
  const canResize = selectedComponents.length === 1;
  const selectedComponent = canResize ? selectedComponents[0] : null;

  // ============================================================================
  // BOUNDING BOX CALCULATION
  // ============================================================================

  /**
   * Calculate bounding box that encompasses all selected components
   */
  const boundingBox = useMemo<BoundingBox | null>(() => {
    if (selectedComponents.length === 0) return null;

    if (selectedComponents.length === 1) {
      // Single selection - use component bounds directly
      const component = selectedComponents[0];
      return {
        x: component.position.x,
        y: component.position.y,
        width: component.size.width,
        height: component.size.height,
      };
    }

    // Multi-select - calculate bounding box
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    selectedComponents.forEach((component) => {
      const { x, y } = component.position;
      const { width, height } = component.size;

      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x + width);
      maxY = Math.max(maxY, y + height);
    });

    return {
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY,
    };
  }, [selectedComponents]);

  // ============================================================================
  // RESIZE FUNCTIONALITY
  // ============================================================================

  /**
   * Initialize resize hook for single selection
   */
  const {
    size: resizedSize,
    position: resizedPosition,
    isResizing,
    activeHandle,
    handleMouseDown,
  } = useResize({
    initialSize: selectedComponent?.size || { width: 0, height: 0 },
    initialPosition: selectedComponent?.position || { x: 0, y: 0 },
    constraints: {
      minWidth: 20,
      minHeight: 20,
      snapToGrid,
      gridSize,
    },
    onResize: (size, position) => {
      if (selectedComponent) {
        updateComponent(
          selectedComponent.id,
          { size, position },
          false // immediate update during resize
        );
      }
    },
    onResizeEnd: (size, position) => {
      if (selectedComponent) {
        updateComponent(
          selectedComponent.id,
          { size, position },
          false
        );
      }
    },
    disabled: !canResize,
  });

  // Update bounding box during resize
  const displayBox = useMemo<BoundingBox | null>(() => {
    if (isResizing && canResize) {
      return {
        x: resizedPosition.x,
        y: resizedPosition.y,
        width: resizedSize.width,
        height: resizedSize.height,
      };
    }
    return boundingBox;
  }, [isResizing, canResize, resizedPosition, resizedSize, boundingBox]);

  // ============================================================================
  // RESIZE HANDLE POSITIONS
  // ============================================================================

  /**
   * Calculate positions for all 8 resize handles
   */
  const handlePositions = useMemo(() => {
    if (!displayBox || !canResize) return [];

    return calculateHandlePositions(
      { width: displayBox.width, height: displayBox.height },
      { x: displayBox.x, y: displayBox.y },
      8 // handle size
    );
  }, [displayBox, canResize]);

  // Event handlers integrated with useResize hook above

  // ============================================================================
  // RENDER HELPERS
  // ============================================================================

  /**
   * Render dimension label
   */
  const renderDimensionLabel = () => {
    if (!displayBox) return null;

    const { width, height } = displayBox;

    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className={`
          absolute -top-8 left-1/2 transform -translate-x-1/2
          text-white text-xs font-medium px-2 py-1 rounded shadow-lg whitespace-nowrap
          ${isResizing ? 'bg-green-500' : 'bg-blue-500'}
        `}
        style={{
          left: `${displayBox.x + displayBox.width / 2}px`,
          top: `${displayBox.y - 32}px`,
        }}
      >
        {Math.round(width)} × {Math.round(height)}
        {isResizing && ' (resizing)'}
      </motion.div>
    );
  };

  /**
   * Render resize handle
   */
  const renderHandle = (handleData: {
    handle: ResizeHandle;
    x: number;
    y: number;
    cursor: string;
  }) => {
    const isActive = activeHandle === handleData.handle;

    return (
      <motion.div
        key={handleData.handle}
        className={`
          absolute w-2 h-2 bg-white border-2 rounded-sm
          hover:scale-150 transition-transform cursor-pointer
          ${isActive ? 'scale-150 bg-green-500 border-green-500' : 'border-blue-500'}
        `}
        style={{
          left: `${handleData.x}px`,
          top: `${handleData.y}px`,
          cursor: handleData.cursor,
          zIndex: 1001,
        }}
        onMouseDown={(e) => handleMouseDown(handleData.handle, e)}
        initial={{ scale: 0 }}
        animate={{ scale: isActive ? 1.5 : 1 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        whileHover={{ scale: 1.3 }}
      />
    );
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  if (!displayBox || selectedComponents.length === 0) {
    return null;
  }

  const borderColor = isResizing ? '#10b981' : '#3b82f6'; // Green when resizing, blue otherwise

  return (
    <AnimatePresence>
      {/* Selection Outline */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute pointer-events-none"
        style={{
          left: `${displayBox.x}px`,
          top: `${displayBox.y}px`,
          width: `${displayBox.width}px`,
          height: `${displayBox.height}px`,
          border: `2px solid ${borderColor}`,
          borderRadius: '4px',
          boxShadow: isResizing
            ? '0 0 0 4px rgba(16, 185, 129, 0.2)'
            : '0 0 0 1px rgba(59, 130, 246, 0.1)',
          zIndex: 1000,
        }}
      >
        {/* Corner decoration for visual feedback */}
        <div
          className="absolute -top-0.5 -left-0.5 w-3 h-3 border-t-2 border-l-2"
          style={{ borderColor }}
        />
        <div
          className="absolute -top-0.5 -right-0.5 w-3 h-3 border-t-2 border-r-2"
          style={{ borderColor }}
        />
        <div
          className="absolute -bottom-0.5 -left-0.5 w-3 h-3 border-b-2 border-l-2"
          style={{ borderColor }}
        />
        <div
          className="absolute -bottom-0.5 -right-0.5 w-3 h-3 border-b-2 border-r-2"
          style={{ borderColor }}
        />
      </motion.div>

      {/* Resize Handles - Only for single selection */}
      {canResize && (
        <div className="absolute inset-0 pointer-events-auto">
          {handlePositions.map((handleData) => renderHandle(handleData))}
        </div>
      )}

      {/* Dimension Label */}
      {renderDimensionLabel()}

      {/* Multi-Select Indicator */}
      {selectedComponents.length > 1 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="absolute bg-blue-500 text-white text-xs font-medium px-2 py-1 rounded-full shadow-lg"
          style={{
            left: `${displayBox.x}px`,
            top: `${displayBox.y - 40}px`,
          }}
        >
          {selectedComponents.length} components selected
        </motion.div>
      )}

      {/* Component Names (for multi-select) */}
      {selectedComponents.length > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="absolute bg-white border border-gray-200 rounded-lg shadow-lg p-2 max-w-xs"
          style={{
            left: `${displayBox.x + displayBox.width + 16}px`,
            top: `${displayBox.y}px`,
          }}
        >
          <div className="text-xs font-medium text-gray-700 mb-1">Selected Components:</div>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {selectedComponents.map((component) => (
              <div
                key={component.id}
                className="text-xs text-gray-600 flex items-center gap-2"
              >
                <div
                  className="w-2 h-2 rounded-full bg-blue-500"
                  aria-hidden="true"
                />
                <span className="truncate">{component.name}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
