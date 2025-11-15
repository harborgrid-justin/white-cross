/**
 * DragOverlay - Ghost Component During Drag
 *
 * Provides visual feedback during drag operations with:
 * - Semi-transparent ghost preview
 * - Follows cursor smoothly
 * - Shows component being dragged
 * - Snap-to-grid preview
 * - Different styles for palette vs canvas drag
 *
 * This overlay appears during drag operations to give users
 * visual feedback of what they're dragging and where it will drop.
 */

'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Package, Lock, Eye, EyeOff } from 'lucide-react';
import { usePageBuilderStore } from '../../store';
import { useGrid } from '../../hooks/usePageBuilder';
import type { ComponentId, ComponentInstance } from '../../types';

/**
 * DragOverlay props
 */
interface DragOverlayProps {
  /** ID of the component being dragged */
  componentId: ComponentId;
}

/**
 * DragOverlay component
 *
 * Renders a ghost preview of the component being dragged.
 * Provides visual feedback during drag-and-drop operations.
 */
export const DragOverlay: React.FC<DragOverlayProps> = ({ componentId }) => {
  // ============================================================================
  // HOOKS & STATE
  // ============================================================================

  const { snapToGrid, size: gridSize } = useGrid();

  // Get the component being dragged
  const component = usePageBuilderStore(
    (state) => state.canvas.components.byId[componentId]
  );

  // Get viewport state for positioning calculations
  const viewport = usePageBuilderStore((state) => state.canvas.viewport);

  // ============================================================================
  // COMPONENT RENDERING
  // ============================================================================

  /**
   * Determine background color based on component type
   */
  const backgroundColorByType = useMemo(() => {
    if (!component) return '#f9fafb';

    const typeColors: Record<string, string> = {
      container: '#f3f4f6',
      button: '#dbeafe',
      text: '#fef3c7',
      image: '#e0e7ff',
      input: '#f0fdf4',
      header: '#fce7f3',
      footer: '#f0fdfa',
      section: '#fef3c7',
      card: '#f5f3ff',
      list: '#fef2f2',
    };

    return typeColors[component.type] || '#f9fafb';
  }, [component]);

  /**
   * Calculate drag overlay style
   */
  const overlayStyle = useMemo(() => {
    if (!component) return {};

    return {
      width: `${component.size.width}px`,
      height: `${component.size.height}px`,
      backgroundColor: backgroundColorByType,
      opacity: 0.75,
      cursor: 'grabbing',
    };
  }, [component, backgroundColorByType]);

  /**
   * Render component content preview
   */
  const renderContent = () => {
    if (!component) return null;

    return (
      <div className="flex flex-col items-center justify-center h-full p-4 text-gray-700">
        <Package className="w-8 h-8 text-gray-400 mb-2" />
        <div className="text-sm font-medium">{component.name}</div>
        <div className="text-xs text-gray-500 mt-1">{component.type}</div>
        <div className="text-xs text-gray-400 mt-2">
          {Math.round(component.size.width)} × {Math.round(component.size.height)}
        </div>
      </div>
    );
  };

  /**
   * Render grid snap indicator
   */
  const renderGridSnapIndicator = () => {
    if (!snapToGrid) return null;

    return (
      <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white text-xs px-2 py-1 rounded whitespace-nowrap shadow-lg">
        Snap to {gridSize}px grid
      </div>
    );
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  if (!component) {
    return null;
  }

  return (
    <motion.div
      className="relative rounded-md shadow-2xl border-2 border-blue-400 overflow-hidden"
      style={overlayStyle}
      initial={{ scale: 0.95, rotate: -2 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
    >
      {/* Drag indicator overlay */}
      <div className="absolute inset-0 bg-blue-500 opacity-10 pointer-events-none" />

      {/* Striped pattern for visual feedback */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(59, 130, 246, 0.05) 10px, rgba(59, 130, 246, 0.05) 20px)',
        }}
      />

      {/* Component content */}
      <div className="relative w-full h-full">{renderContent()}</div>

      {/* Status badges */}
      {(component.locked || component.hidden) && (
        <div className="absolute top-2 right-2 flex gap-1 bg-white rounded shadow-sm p-1">
          {component.locked && <Lock className="w-3 h-3 text-gray-500" />}
          {component.hidden && <EyeOff className="w-3 h-3 text-gray-500" />}
        </div>
      )}

      {/* Dragging indicator badge */}
      <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs font-medium px-2 py-1 rounded shadow-lg flex items-center gap-1">
        <Package className="w-3 h-3" />
        Dragging
      </div>

      {/* Grid snap indicator */}
      {renderGridSnapIndicator()}

      {/* Corner decorations */}
      <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-blue-400" />
      <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-blue-400" />
      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-blue-400" />
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-blue-400" />
    </motion.div>
  );
};

/**
 * PaletteDragOverlay - Special overlay for components dragged from palette
 *
 * This is a specialized version of DragOverlay for components being dragged
 * from the palette (not yet on the canvas). It shows a preview of what the
 * component will look like when dropped.
 */
interface PaletteDragOverlayProps {
  /** Type of component being dragged from palette */
  componentType: string;
  /** Optional custom size */
  size?: { width: number; height: number };
}

export const PaletteDragOverlay: React.FC<PaletteDragOverlayProps> = ({
  componentType,
  size = { width: 200, height: 100 },
}) => {
  // ============================================================================
  // HOOKS & STATE
  // ============================================================================

  const { snapToGrid, size: gridSize } = useGrid();

  // ============================================================================
  // STYLE CALCULATIONS
  // ============================================================================

  const backgroundColorByType = useMemo(() => {
    const typeColors: Record<string, string> = {
      container: '#f3f4f6',
      button: '#dbeafe',
      text: '#fef3c7',
      image: '#e0e7ff',
      input: '#f0fdf4',
      header: '#fce7f3',
      footer: '#f0fdfa',
      section: '#fef3c7',
      card: '#f5f3ff',
      list: '#fef2f2',
    };

    return typeColors[componentType] || '#f9fafb';
  }, [componentType]);

  const overlayStyle = useMemo(() => {
    return {
      width: `${size.width}px`,
      height: `${size.height}px`,
      backgroundColor: backgroundColorByType,
      opacity: 0.8,
      cursor: 'grabbing',
    };
  }, [size, backgroundColorByType]);

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <motion.div
      className="relative rounded-md shadow-2xl border-2 border-dashed border-blue-400 overflow-hidden"
      style={overlayStyle}
      initial={{ scale: 0.9, rotate: -3 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
    >
      {/* New component indicator overlay */}
      <div className="absolute inset-0 bg-green-500 opacity-10 pointer-events-none" />

      {/* Dashed pattern for new component */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'repeating-linear-gradient(45deg, transparent, transparent 8px, rgba(34, 197, 94, 0.08) 8px, rgba(34, 197, 94, 0.08) 16px)',
        }}
      />

      {/* Component preview content */}
      <div className="flex flex-col items-center justify-center h-full p-4 text-gray-700">
        <Package className="w-8 h-8 text-green-500 mb-2" />
        <div className="text-sm font-medium">New {componentType}</div>
        <div className="text-xs text-gray-400 mt-2">
          {size.width} × {size.height}
        </div>
      </div>

      {/* New component badge */}
      <div className="absolute top-2 left-2 bg-green-500 text-white text-xs font-medium px-2 py-1 rounded shadow-lg flex items-center gap-1">
        <Package className="w-3 h-3" />
        New Component
      </div>

      {/* Grid snap indicator */}
      {snapToGrid && (
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white text-xs px-2 py-1 rounded whitespace-nowrap shadow-lg">
          Snap to {gridSize}px grid
        </div>
      )}

      {/* Corner decorations */}
      <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-green-400" />
      <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-green-400" />
      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-green-400" />
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-green-400" />
    </motion.div>
  );
};
