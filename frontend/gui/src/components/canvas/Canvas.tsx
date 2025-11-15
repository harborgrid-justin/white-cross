/**
 * Canvas - Main Design Surface for Page Builder
 *
 * This is the primary canvas component where users design their pages.
 * It provides drag-drop functionality, viewport controls (zoom/pan),
 * grid background, and renders all components on the canvas.
 *
 * Features:
 * - @dnd-kit drag-and-drop integration
 * - Zoom and pan viewport controls
 * - Grid background with snap-to-grid
 * - Component tree rendering
 * - Selection management
 * - Keyboard shortcuts
 */

'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragOverlay as DndKitDragOverlay,
} from '@dnd-kit/core';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Grid3x3,
  Move,
} from 'lucide-react';
import {
  useViewport,
  useGrid,
  useSelection,
  useAddComponent,
  useMoveComponent,
  useKeyboardShortcuts,
} from '../../hooks/usePageBuilder';
import { usePageBuilderStore } from '../../store';
import type { ComponentId, ComponentInstance } from '../../types';
import { CanvasComponent } from './CanvasComponent';
import { SelectionOverlay } from './SelectionOverlay';
import { DragOverlay } from './DragOverlay';

/**
 * Canvas component props
 */
interface CanvasProps {
  /** Optional className for custom styling */
  className?: string;
  /** Optional width override */
  width?: number;
  /** Optional height override */
  height?: number;
}

/**
 * Main canvas component for the page builder
 *
 * Provides the design surface with drag-drop, zoom, pan, and grid capabilities.
 * Integrates with Zustand store for state management.
 */
export const Canvas: React.FC<CanvasProps> = ({
  className = '',
  width,
  height,
}) => {
  // ============================================================================
  // STATE & REFS
  // ============================================================================

  const canvasRef = useRef<HTMLDivElement>(null);
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [activeId, setActiveId] = useState<ComponentId | null>(null);

  // ============================================================================
  // STORE HOOKS
  // ============================================================================

  const { zoom, panX, panY, setZoom, setPan, resetViewport } = useViewport();
  const { enabled: gridEnabled, size: gridSize, snapToGrid, toggleGrid, toggleSnapToGrid } = useGrid();
  const { selectedIds, hoveredId } = useSelection();
  const addComponent = useAddComponent();
  const moveComponent = useMoveComponent();
  const clearSelection = usePageBuilderStore((state) => state.clearSelection);
  const selectComponent = usePageBuilderStore((state) => state.selectComponent);

  // Get root components to render
  const rootComponents = usePageBuilderStore((state) =>
    state.canvas.components.rootIds
      .map((id) => state.canvas.components.byId[id])
      .filter(Boolean)
  );

  // ============================================================================
  // KEYBOARD SHORTCUTS
  // ============================================================================

  const handleKeyDown = useKeyboardShortcuts();

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // ============================================================================
  // DRAG AND DROP HANDLERS
  // ============================================================================

  /**
   * Configure drag sensors with activation constraints
   */
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 8, // Prevent accidental drags
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 8,
      },
    })
  );

  /**
   * Handle drag start - set active dragged item
   */
  const handleDragStart = useCallback((event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id as ComponentId);
  }, []);

  /**
   * Handle drag over - provide visual feedback
   */
  const handleDragOver = useCallback((event: DragOverEvent) => {
    // Future: Show drop zone indicators
    // This will be enhanced when we add container components
  }, []);

  /**
   * Handle drag end - update component position or add new component
   */
  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, delta } = event;

      if (!canvasRef.current) {
        setActiveId(null);
        return;
      }

      try {
        // Check if this is a new component from the palette
        const isPaletteComponent = active.data.current?.fromPalette;

        if (isPaletteComponent) {
          // Adding new component from palette
          const componentType = active.data.current?.componentType;
          const canvasRect = canvasRef.current.getBoundingClientRect();

          // Calculate drop position relative to canvas
          let dropX = (event.activatorEvent as MouseEvent).clientX - canvasRect.left;
          let dropY = (event.activatorEvent as MouseEvent).clientY - canvasRect.top;

          // Apply viewport transformations
          dropX = (dropX - panX) / zoom;
          dropY = (dropY - panY) / zoom;

          // Snap to grid if enabled
          if (snapToGrid) {
            dropX = Math.round(dropX / gridSize) * gridSize;
            dropY = Math.round(dropY / gridSize) * gridSize;
          }

          // Add component to canvas
          addComponent({
            type: componentType,
            name: `${componentType}-${Date.now()}`,
            parentId: null,
            childIds: [],
            position: { x: dropX, y: dropY },
            size: { width: 200, height: 100 },
            properties: {},
            styles: {},
            locked: false,
            hidden: false,
          });
        } else {
          // Moving existing component
          const componentId = active.id as ComponentId;
          const component = usePageBuilderStore.getState().canvas.components.byId[componentId];

          if (component) {
            // Calculate new position with delta
            let newX = component.position.x + delta.x / zoom;
            let newY = component.position.y + delta.y / zoom;

            // Snap to grid if enabled
            if (snapToGrid) {
              newX = Math.round(newX / gridSize) * gridSize;
              newY = Math.round(newY / gridSize) * gridSize;
            }

            // Update component position
            moveComponent(componentId, component.parentId, { x: newX, y: newY });
          }
        }
      } catch (error) {
        console.error('Error handling drag end:', error);
      } finally {
        setActiveId(null);
      }
    },
    [addComponent, moveComponent, zoom, panX, panY, snapToGrid, gridSize]
  );

  // ============================================================================
  // ZOOM HANDLERS
  // ============================================================================

  /**
   * Zoom in by 10%
   */
  const handleZoomIn = useCallback(() => {
    setZoom(Math.min(zoom * 1.1, 5));
  }, [zoom, setZoom]);

  /**
   * Zoom out by 10%
   */
  const handleZoomOut = useCallback(() => {
    setZoom(Math.max(zoom * 0.9, 0.1));
  }, [zoom, setZoom]);

  /**
   * Reset zoom and pan to defaults
   */
  const handleResetViewport = useCallback(() => {
    resetViewport();
  }, [resetViewport]);

  /**
   * Handle mouse wheel zoom
   */
  const handleWheel = useCallback(
    (event: React.WheelEvent) => {
      if (event.ctrlKey || event.metaKey) {
        event.preventDefault();
        const delta = event.deltaY > 0 ? 0.9 : 1.1;
        setZoom(Math.max(0.1, Math.min(5, zoom * delta)));
      }
    },
    [zoom, setZoom]
  );

  // ============================================================================
  // PAN HANDLERS
  // ============================================================================

  /**
   * Handle pan start (space + mouse down)
   */
  const handlePanStart = useCallback((event: React.MouseEvent) => {
    if (event.button === 1 || (event.button === 0 && event.shiftKey)) {
      event.preventDefault();
      setIsPanning(true);
      setPanStart({ x: event.clientX - panX, y: event.clientY - panY });
    }
  }, [panX, panY]);

  /**
   * Handle pan move
   */
  const handlePanMove = useCallback(
    (event: React.MouseEvent) => {
      if (isPanning) {
        const newPanX = event.clientX - panStart.x;
        const newPanY = event.clientY - panStart.y;
        setPan(newPanX, newPanY);
      }
    },
    [isPanning, panStart, setPan]
  );

  /**
   * Handle pan end
   */
  const handlePanEnd = useCallback(() => {
    setIsPanning(false);
  }, []);

  // ============================================================================
  // SELECTION HANDLERS
  // ============================================================================

  /**
   * Handle canvas background click - clear selection
   */
  const handleCanvasClick = useCallback(
    (event: React.MouseEvent) => {
      // Only clear selection if clicking directly on canvas background
      if (event.target === event.currentTarget) {
        clearSelection();
      }
    },
    [clearSelection]
  );

  // ============================================================================
  // GRID RENDERING
  // ============================================================================

  /**
   * Generate grid background pattern as SVG
   */
  const gridPattern = gridEnabled
    ? `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${gridSize}' height='${gridSize}'%3E%3Crect width='${gridSize}' height='${gridSize}' fill='none' stroke='%23e5e7eb' stroke-width='0.5'/%3E%3C/svg%3E")`
    : 'none';

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div className={`relative flex flex-col h-full bg-gray-50 overflow-hidden ${className}`}>
      {/* Toolbar */}
      <div className="absolute top-4 left-4 z-50 flex items-center gap-2 bg-white rounded-lg shadow-lg p-2 border border-gray-200">
        {/* Zoom Controls */}
        <div className="flex items-center gap-1 border-r border-gray-200 pr-2">
          <button
            onClick={handleZoomOut}
            className="p-2 hover:bg-gray-100 rounded transition-colors"
            title="Zoom Out (Ctrl + Mouse Wheel)"
            aria-label="Zoom out"
          >
            <ZoomOut className="w-4 h-4 text-gray-700" />
          </button>
          <span className="text-sm font-medium text-gray-700 min-w-[4rem] text-center">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={handleZoomIn}
            className="p-2 hover:bg-gray-100 rounded transition-colors"
            title="Zoom In (Ctrl + Mouse Wheel)"
            aria-label="Zoom in"
          >
            <ZoomIn className="w-4 h-4 text-gray-700" />
          </button>
        </div>

        {/* Reset Viewport */}
        <button
          onClick={handleResetViewport}
          className="p-2 hover:bg-gray-100 rounded transition-colors"
          title="Reset Viewport"
          aria-label="Reset viewport"
        >
          <Maximize2 className="w-4 h-4 text-gray-700" />
        </button>

        {/* Grid Toggle */}
        <button
          onClick={toggleGrid}
          className={`p-2 rounded transition-colors ${
            gridEnabled ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100 text-gray-700'
          }`}
          title="Toggle Grid"
          aria-label="Toggle grid"
        >
          <Grid3x3 className="w-4 h-4" />
        </button>

        {/* Snap to Grid Toggle */}
        <button
          onClick={toggleSnapToGrid}
          className={`p-2 rounded transition-colors ${
            snapToGrid ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100 text-gray-700'
          }`}
          title="Snap to Grid"
          aria-label="Snap to grid"
        >
          <Move className="w-4 h-4" />
        </button>
      </div>

      {/* Canvas Container */}
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div
          ref={canvasRef}
          className="flex-1 relative overflow-hidden cursor-default"
          onClick={handleCanvasClick}
          onMouseDown={handlePanStart}
          onMouseMove={handlePanMove}
          onMouseUp={handlePanEnd}
          onMouseLeave={handlePanEnd}
          onWheel={handleWheel}
          style={{
            cursor: isPanning ? 'grabbing' : 'default',
          }}
        >
          {/* Canvas Surface */}
          <motion.div
            className="absolute inset-0 origin-top-left"
            style={{
              transform: `translate(${panX}px, ${panY}px) scale(${zoom})`,
              backgroundImage: gridPattern,
              backgroundSize: `${gridSize}px ${gridSize}px`,
              width: width || '100%',
              height: height || '100%',
            }}
            animate={{
              transform: `translate(${panX}px, ${panY}px) scale(${zoom})`,
            }}
            transition={{ type: 'tween', duration: 0.1 }}
          >
            {/* Render Root Components */}
            <AnimatePresence>
              {rootComponents.map((component) => (
                <CanvasComponent
                  key={component.id}
                  component={component}
                  isSelected={selectedIds.includes(component.id)}
                  isHovered={hoveredId === component.id}
                />
              ))}
            </AnimatePresence>

            {/* Selection Overlay */}
            {selectedIds.length > 0 && <SelectionOverlay />}
          </motion.div>
        </div>

        {/* Drag Overlay - Shows ghost during drag */}
        <DndKitDragOverlay dropAnimation={null}>
          {activeId ? <DragOverlay componentId={activeId} /> : null}
        </DndKitDragOverlay>
      </DndContext>

      {/* Info Panel (bottom right) */}
      <div className="absolute bottom-4 right-4 bg-white rounded-lg shadow-lg p-3 border border-gray-200 text-sm">
        <div className="flex flex-col gap-1 text-gray-600">
          <div>
            <span className="font-medium">Pan:</span> {Math.round(panX)}, {Math.round(panY)}
          </div>
          <div>
            <span className="font-medium">Components:</span> {rootComponents.length}
          </div>
          <div>
            <span className="font-medium">Selected:</span> {selectedIds.length}
          </div>
        </div>
      </div>
    </div>
  );
};
