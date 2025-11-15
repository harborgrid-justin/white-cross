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

import React, { useMemo, useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelection, useUpdateComponent } from '../../hooks/usePageBuilder';
import { usePageBuilderStore } from '../../store';
import type { ComponentInstance } from '../../types';

/**
 * Resize handle positions
 */
type HandlePosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'middle-left'
  | 'middle-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right';

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

  const [activeHandle, setActiveHandle] = useState<HandlePosition | null>(null);
  const { selectedIds } = useSelection();
  const updateComponent = useUpdateComponent();

  // Get selected components
  const selectedComponents = usePageBuilderStore((state) =>
    selectedIds.map((id) => state.canvas.components.byId[id]).filter(Boolean)
  );

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
  // RESIZE HANDLE POSITIONS
  // ============================================================================

  /**
   * Calculate positions for all 8 resize handles
   */
  const handlePositions = useMemo(() => {
    if (!boundingBox) return [];

    const handleSize = 8; // Size of handle in pixels
    const { x, y, width, height } = boundingBox;

    return [
      { position: 'top-left' as const, x: x - handleSize / 2, y: y - handleSize / 2, cursor: 'nwse-resize' },
      { position: 'top-center' as const, x: x + width / 2 - handleSize / 2, y: y - handleSize / 2, cursor: 'ns-resize' },
      { position: 'top-right' as const, x: x + width - handleSize / 2, y: y - handleSize / 2, cursor: 'nesw-resize' },
      { position: 'middle-left' as const, x: x - handleSize / 2, y: y + height / 2 - handleSize / 2, cursor: 'ew-resize' },
      { position: 'middle-right' as const, x: x + width - handleSize / 2, y: y + height / 2 - handleSize / 2, cursor: 'ew-resize' },
      { position: 'bottom-left' as const, x: x - handleSize / 2, y: y + height - handleSize / 2, cursor: 'nesw-resize' },
      { position: 'bottom-center' as const, x: x + width / 2 - handleSize / 2, y: y + height - handleSize / 2, cursor: 'ns-resize' },
      { position: 'bottom-right' as const, x: x + width - handleSize / 2, y: y + height - handleSize / 2, cursor: 'nwse-resize' },
    ];
  }, [boundingBox]);

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================

  /**
   * Handle resize handle mouse down
   * Future: Implement resize functionality
   */
  const handleMouseDown = useCallback(
    (position: HandlePosition, event: React.MouseEvent) => {
      event.stopPropagation();
      setActiveHandle(position);
      // Future: Start resize operation
      console.log('Resize started from:', position);
    },
    []
  );

  /**
   * Handle resize handle hover
   */
  const handleMouseEnter = useCallback((position: HandlePosition) => {
    // Future: Show resize preview
  }, []);

  /**
   * Handle resize handle leave
   */
  const handleMouseLeave = useCallback(() => {
    if (!activeHandle) {
      // Clear any hover state
    }
  }, [activeHandle]);

  // ============================================================================
  // RENDER HELPERS
  // ============================================================================

  /**
   * Render dimension label
   */
  const renderDimensionLabel = () => {
    if (!boundingBox) return null;

    const { width, height } = boundingBox;

    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white text-xs font-medium px-2 py-1 rounded shadow-lg whitespace-nowrap"
        style={{
          left: `${boundingBox.x + boundingBox.width / 2}px`,
          top: `${boundingBox.y - 32}px`,
        }}
      >
        {Math.round(width)} × {Math.round(height)}
      </motion.div>
    );
  };

  /**
   * Render resize handle
   */
  const renderHandle = (handleData: {
    position: HandlePosition;
    x: number;
    y: number;
    cursor: string;
  }) => {
    const isActive = activeHandle === handleData.position;

    return (
      <motion.div
        key={handleData.position}
        className={`
          absolute w-2 h-2 bg-white border-2 border-blue-500 rounded-sm
          hover:scale-150 transition-transform
          ${isActive ? 'scale-150 bg-blue-500' : ''}
        `}
        style={{
          left: `${handleData.x}px`,
          top: `${handleData.y}px`,
          cursor: handleData.cursor,
          zIndex: 1001,
        }}
        onMouseDown={(e) => handleMouseDown(handleData.position, e)}
        onMouseEnter={() => handleMouseEnter(handleData.position)}
        onMouseLeave={handleMouseLeave}
        initial={{ scale: 0 }}
        animate={{ scale: isActive ? 1.5 : 1 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      />
    );
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  if (!boundingBox || selectedComponents.length === 0) {
    return null;
  }

  return (
    <AnimatePresence>
      {/* Selection Outline */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute pointer-events-none"
        style={{
          left: `${boundingBox.x}px`,
          top: `${boundingBox.y}px`,
          width: `${boundingBox.width}px`,
          height: `${boundingBox.height}px`,
          border: '2px solid #3b82f6',
          borderRadius: '4px',
          boxShadow: '0 0 0 1px rgba(59, 130, 246, 0.1)',
          zIndex: 1000,
        }}
      >
        {/* Corner decoration for visual feedback */}
        <div className="absolute -top-0.5 -left-0.5 w-3 h-3 border-t-2 border-l-2 border-blue-500" />
        <div className="absolute -top-0.5 -right-0.5 w-3 h-3 border-t-2 border-r-2 border-blue-500" />
        <div className="absolute -bottom-0.5 -left-0.5 w-3 h-3 border-b-2 border-l-2 border-blue-500" />
        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 border-b-2 border-r-2 border-blue-500" />
      </motion.div>

      {/* Resize Handles */}
      <div className="absolute inset-0 pointer-events-auto">
        {handlePositions.map((handleData) => renderHandle(handleData))}
      </div>

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
            left: `${boundingBox.x}px`,
            top: `${boundingBox.y - 40}px`,
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
            left: `${boundingBox.x + boundingBox.width + 16}px`,
            top: `${boundingBox.y}px`,
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
