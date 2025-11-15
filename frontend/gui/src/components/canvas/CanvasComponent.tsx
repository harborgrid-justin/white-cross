/**
 * CanvasComponent - Individual Component Renderer
 *
 * Renders a single component instance on the canvas with:
 * - Drag functionality for repositioning
 * - Selection state visualization
 * - Hover state indication
 * - Locked state handling
 * - Recursive child rendering
 *
 * This component is responsible for rendering each component instance
 * and managing its interactions within the canvas.
 */

'use client';

import React, { useCallback, useMemo } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { usePageBuilderStore } from '../../store';
import type { ComponentInstance, ComponentId } from '../../types';

/**
 * CanvasComponent props
 */
interface CanvasComponentProps {
  /** The component instance to render */
  component: ComponentInstance;
  /** Whether this component is currently selected */
  isSelected: boolean;
  /** Whether this component is currently hovered */
  isHovered: boolean;
}

/**
 * Renders an individual component on the canvas
 *
 * Provides drag functionality, selection visualization, and recursive child rendering.
 * Integrates with @dnd-kit for drag-and-drop operations.
 */
export const CanvasComponent: React.FC<CanvasComponentProps> = ({
  component,
  isSelected,
  isHovered,
}) => {
  // ============================================================================
  // STORE HOOKS
  // ============================================================================

  const selectComponent = usePageBuilderStore((state) => state.selectComponent);
  const setHoveredComponent = usePageBuilderStore((state) => state.setHoveredComponent);
  const updateComponent = usePageBuilderStore((state) => state.updateComponent);

  // Get child components
  const childComponents = usePageBuilderStore((state) =>
    component.childIds.map((id) => state.canvas.components.byId[id]).filter(Boolean)
  );

  // ============================================================================
  // DRAG AND DROP
  // ============================================================================

  /**
   * Configure draggable behavior
   * Disabled when component is locked
   */
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: component.id,
    disabled: component.locked,
    data: {
      component,
      fromPalette: false,
    },
  });

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================

  /**
   * Handle component click - select component
   */
  const handleClick = useCallback(
    (event: React.MouseEvent) => {
      event.stopPropagation();

      // Multi-select with Cmd/Ctrl key
      const isMultiSelect = event.metaKey || event.ctrlKey;
      selectComponent(component.id, isMultiSelect);
    },
    [component.id, selectComponent]
  );

  /**
   * Handle mouse enter - show hover state
   */
  const handleMouseEnter = useCallback(() => {
    if (!component.locked) {
      setHoveredComponent(component.id);
    }
  }, [component.id, component.locked, setHoveredComponent]);

  /**
   * Handle mouse leave - clear hover state
   */
  const handleMouseLeave = useCallback(() => {
    setHoveredComponent(null);
  }, [setHoveredComponent]);

  /**
   * Handle double click - enter edit mode (future enhancement)
   */
  const handleDoubleClick = useCallback(
    (event: React.MouseEvent) => {
      event.stopPropagation();
      // Future: Enter edit mode for text components
      console.log('Double clicked component:', component.name);
    },
    [component.name]
  );

  // ============================================================================
  // STYLE CALCULATIONS
  // ============================================================================

  /**
   * Calculate component style with position, size, and custom styles
   */
  const componentStyle = useMemo(() => {
    return {
      position: 'absolute' as const,
      left: `${component.position.x}px`,
      top: `${component.position.y}px`,
      width: `${component.size.width}px`,
      height: `${component.size.height}px`,
      ...component.styles,
      // Apply transform during drag
      transform: transform
        ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
        : undefined,
      // Visual feedback
      opacity: component.hidden ? 0.3 : isDragging ? 0.5 : 1,
      pointerEvents: component.hidden ? ('none' as const) : ('auto' as const),
      zIndex: isDragging ? 1000 : component.styles.zIndex || 1,
    };
  }, [component.position, component.size, component.styles, component.hidden, transform, isDragging]);

  /**
   * Border style for selection and hover states
   */
  const borderStyle = useMemo(() => {
    if (isSelected) {
      return '2px solid #3b82f6'; // Blue border for selected
    }
    if (isHovered && !component.locked) {
      return '2px dashed #3b82f6'; // Dashed blue border for hover
    }
    return '2px solid transparent'; // Transparent border for consistent sizing
  }, [isSelected, isHovered, component.locked]);

  /**
   * Background color based on component type
   * This is a placeholder - real components will render actual content
   */
  const backgroundColorByType = useMemo(() => {
    const typeColors: Record<string, string> = {
      container: '#f3f4f6',
      button: '#dbeafe',
      text: '#fef3c7',
      image: '#e0e7ff',
      input: '#f0fdf4',
    };
    return typeColors[component.type] || '#f9fafb';
  }, [component.type]);

  // ============================================================================
  // RENDER PLACEHOLDER CONTENT
  // ============================================================================

  /**
   * Render component content placeholder
   * Future: This will be replaced with actual component rendering
   */
  const renderContent = () => {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4 text-gray-700">
        <div className="text-sm font-medium">{component.name}</div>
        <div className="text-xs text-gray-500 mt-1">{component.type}</div>
        {component.locked && (
          <Lock className="w-4 h-4 text-gray-400 mt-2" aria-label="Component is locked" />
        )}
        {component.hidden && (
          <EyeOff className="w-4 h-4 text-gray-400 mt-2" aria-label="Component is hidden" />
        )}
      </div>
    );
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <motion.div
      ref={setNodeRef}
      style={componentStyle}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: component.hidden ? 0.3 : 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className={`
        rounded-md
        transition-shadow
        ${isSelected ? 'shadow-lg' : isHovered ? 'shadow-md' : 'shadow-sm'}
        ${component.locked ? 'cursor-not-allowed' : 'cursor-move'}
      `}
      {...(component.locked ? {} : listeners)}
      {...(component.locked ? {} : attributes)}
    >
      {/* Component Border */}
      <div
        className="absolute inset-0 rounded-md pointer-events-none"
        style={{ border: borderStyle }}
      />

      {/* Component Content */}
      <div
        className="w-full h-full rounded-md overflow-hidden"
        style={{ backgroundColor: backgroundColorByType }}
      >
        {renderContent()}
      </div>

      {/* Status Indicators (top-right corner) */}
      {(component.locked || component.hidden) && (
        <div className="absolute top-1 right-1 flex gap-1 bg-white rounded shadow-sm p-1">
          {component.locked && <Lock className="w-3 h-3 text-gray-500" />}
          {component.hidden && <EyeOff className="w-3 h-3 text-gray-500" />}
        </div>
      )}

      {/* Drag Handle (when not locked) */}
      {!component.locked && isHovered && (
        <div
          className="absolute top-1 left-1 bg-blue-500 text-white rounded px-2 py-1 text-xs font-medium shadow-md cursor-move"
          {...listeners}
          {...attributes}
        >
          Drag
        </div>
      )}

      {/* Child Components (for containers) */}
      {childComponents.length > 0 && (
        <div className="relative w-full h-full">
          <AnimatePresence>
            {childComponents.map((child) => {
              const isChildSelected = usePageBuilderStore
                .getState()
                .selection.selectedIds.includes(child.id);
              const isChildHovered =
                usePageBuilderStore.getState().selection.hoveredId === child.id;

              return (
                <CanvasComponent
                  key={child.id}
                  component={child}
                  isSelected={isChildSelected}
                  isHovered={isChildHovered}
                />
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
};
