/**
 * LayerTreeItem Component
 *
 * Individual tree item in the layer hierarchy panel.
 * Displays component info, controls, and handles interactions.
 */

import React, { useCallback } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  ChevronRight,
  ChevronDown,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  GripVertical,
  Box,
  Type,
  Image,
  Layout,
  Grid3x3,
  CircleDot,
} from 'lucide-react';
import type { ComponentId, ComponentInstance } from '../../types';
import { usePageBuilderStore } from '../../store';
import { ContextMenu } from './ContextMenu';

// ============================================================================
// TYPES
// ============================================================================

interface LayerTreeItemProps {
  id: ComponentId;
  depth: number;
  index: number;
  isExpanded: boolean;
  hasChildren: boolean;
  onToggleExpand: (id: ComponentId) => void;
  style?: React.CSSProperties;
  totalCount?: number;
}

// ============================================================================
// ICON MAPPING
// ============================================================================

const COMPONENT_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  // Layout
  'container': Layout,
  'flex-container': Layout,
  'grid-container': Grid3x3,
  'section': Box,

  // Content
  'text': Type,
  'heading': Type,
  'paragraph': Type,
  'image': Image,
  'icon': CircleDot,

  // Default
  'default': Box,
};

function getComponentIcon(type: string): React.ComponentType<{ className?: string }> {
  return COMPONENT_ICONS[type] || COMPONENT_ICONS.default;
}

// ============================================================================
// COMPONENT
// ============================================================================

const LayerTreeItemComponent: React.FC<LayerTreeItemProps> = ({
  id,
  depth,
  index,
  isExpanded,
  hasChildren,
  onToggleExpand,
  style,
  totalCount,
}) => {
  // Store hooks
  const component = usePageBuilderStore((state) => state.canvas.components.byId[id]);
  const selectedIds = usePageBuilderStore((state) => state.selection.selectedIds);
  const selectComponent = usePageBuilderStore((state) => state.selectComponent);
  const updateComponent = usePageBuilderStore((state) => state.updateComponent);
  const hoveredId = usePageBuilderStore((state) => state.selection.hoveredId);
  const setHoveredComponent = usePageBuilderStore((state) => state.setHoveredComponent);

  // Drag and drop
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id,
    disabled: component?.locked,
  });

  // Derived state
  const isSelected = selectedIds.includes(id);
  const isHovered = hoveredId === id;

  // Component data check
  if (!component) {
    return null;
  }

  // Get icon component
  const IconComponent = getComponentIcon(component.type);

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      const isMultiSelect = e.metaKey || e.ctrlKey;
      selectComponent(id, isMultiSelect);
    },
    [id, selectComponent]
  );

  const handleToggleExpand = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (hasChildren) {
        onToggleExpand(id);
      }
    },
    [id, hasChildren, onToggleExpand]
  );

  const handleToggleVisibility = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      updateComponent(id, { hidden: !component.hidden });
    },
    [id, component.hidden, updateComponent]
  );

  const handleToggleLock = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      updateComponent(id, { locked: !component.locked });
    },
    [id, component.locked, updateComponent]
  );

  const handleMouseEnter = useCallback(() => {
    setHoveredComponent(id);
  }, [id, setHoveredComponent]);

  const handleMouseLeave = useCallback(() => {
    setHoveredComponent(null);
  }, [setHoveredComponent]);

  // ============================================================================
  // STYLES
  // ============================================================================

  const dragStyle = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const indentationStyle = {
    paddingLeft: `${depth * 20 + 8}px`,
  };

  const baseClasses = [
    'flex',
    'items-center',
    'h-8',
    'px-2',
    'cursor-pointer',
    'select-none',
    'group',
    'border-b',
    'border-gray-100',
    'dark:border-gray-800',
  ];

  const stateClasses = [
    isSelected && 'bg-blue-100 dark:bg-blue-900/30',
    !isSelected && isHovered && 'bg-gray-50 dark:bg-gray-800/50',
    !isSelected && !isHovered && 'hover:bg-gray-50 dark:hover:bg-gray-800/30',
    component.hidden && 'opacity-50',
    component.locked && 'cursor-not-allowed',
  ];

  const className = [...baseClasses, ...stateClasses].filter(Boolean).join(' ');

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <ContextMenu componentId={id}>
      <div
        ref={setNodeRef}
        style={{ ...style, ...dragStyle }}
        className={className}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        role="treeitem"
        aria-selected={isSelected}
        aria-expanded={hasChildren ? isExpanded : undefined}
        aria-level={depth + 1}
        aria-posinset={index + 1}
        aria-setsize={totalCount || 1}
        aria-label={`${component.name}, ${component.type}${component.hidden ? ', hidden' : ''}${component.locked ? ', locked' : ''}`}
        tabIndex={isSelected ? 0 : -1}
      >
        {/* Indentation spacer */}
        <div style={indentationStyle} />

        {/* Drag handle */}
        <button
          {...attributes}
          {...listeners}
          className="mr-1 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label="Drag to reorder"
          disabled={component.locked}
        >
          <GripVertical className="w-3 h-3 text-gray-400" />
        </button>

        {/* Expand/collapse arrow */}
        <button
          onClick={handleToggleExpand}
          className="mr-1 flex items-center justify-center w-4 h-4"
          aria-label={isExpanded ? 'Collapse' : 'Expand'}
          disabled={!hasChildren}
        >
          {hasChildren ? (
            isExpanded ? (
              <ChevronDown className="w-3 h-3 text-gray-600 dark:text-gray-400" />
            ) : (
              <ChevronRight className="w-3 h-3 text-gray-600 dark:text-gray-400" />
            )
          ) : (
            <span className="w-3 h-3" />
          )}
        </button>

        {/* Component icon */}
        <IconComponent className="w-4 h-4 mr-2 text-gray-600 dark:text-gray-400 flex-shrink-0" />

        {/* Component name */}
        <span className="flex-1 truncate text-sm text-gray-900 dark:text-gray-100">
          {component.name}
        </span>

        {/* Visibility toggle */}
        <button
          onClick={handleToggleVisibility}
          className="ml-2 p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100"
          aria-label={component.hidden ? 'Show component' : 'Hide component'}
          aria-pressed={!component.hidden}
          tabIndex={-1}
        >
          {component.hidden ? (
            <EyeOff className="w-3 h-3 text-gray-500" aria-hidden="true" />
          ) : (
            <Eye className="w-3 h-3 text-gray-500" aria-hidden="true" />
          )}
        </button>

        {/* Lock toggle */}
        <button
          onClick={handleToggleLock}
          className="ml-1 p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100"
          aria-label={component.locked ? 'Unlock component' : 'Lock component'}
          aria-pressed={component.locked}
          tabIndex={-1}
        >
          {component.locked ? (
            <Lock className="w-3 h-3 text-gray-500" aria-hidden="true" />
          ) : (
            <Unlock className="w-3 h-3 text-gray-500" aria-hidden="true" />
          )}
        </button>
      </div>
    </ContextMenu>
  );
};

// ============================================================================
// MEMOIZATION
// ============================================================================

export const LayerTreeItem = React.memo(
  LayerTreeItemComponent,
  (prev, next) => {
    return (
      prev.id === next.id &&
      prev.depth === next.depth &&
      prev.index === next.index &&
      prev.isExpanded === next.isExpanded &&
      prev.hasChildren === next.hasChildren &&
      prev.style === next.style &&
      prev.totalCount === next.totalCount
    );
  }
);

LayerTreeItem.displayName = 'LayerTreeItem';
