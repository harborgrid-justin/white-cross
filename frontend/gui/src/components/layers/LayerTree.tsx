/**
 * LayerTree Component
 *
 * Main layer hierarchy panel with virtualization, drag-drop, and full interaction support.
 * Displays the component tree with search, filter, and keyboard navigation.
 */

import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { FixedSizeList as List } from 'react-window';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import type { ComponentId, ComponentInstance } from '../../types';
import { usePageBuilderStore } from '../../store';
import { LayerTreeItem } from './LayerTreeItem';
import { LayerTreeActions, type FilterState } from './LayerTreeActions';

// ============================================================================
// TYPES
// ============================================================================

interface LayerTreeProps {
  className?: string;
  height?: number;
  onComponentClick?: (id: ComponentId) => void;
}

interface FlattenedNode {
  id: ComponentId;
  depth: number;
  component: ComponentInstance;
  hasChildren: boolean;
  index: number;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const ITEM_HEIGHT = 32; // Height of each tree item in pixels
const DEFAULT_HEIGHT = 400;

// ============================================================================
// CUSTOM HOOKS
// ============================================================================

/**
 * Flattens the component tree into an array for virtualization
 */
function useFlattenedTree(
  componentsById: Record<ComponentId, ComponentInstance>,
  rootIds: ComponentId[],
  expandedIds: Set<ComponentId>,
  searchQuery: string,
  filterState: FilterState
): FlattenedNode[] {
  return useMemo(() => {
    const flattened: FlattenedNode[] = [];
    const searchLower = searchQuery.toLowerCase().trim();

    const shouldIncludeComponent = (component: ComponentInstance): boolean => {
      // Apply filters
      if (!filterState.showHidden && component.hidden) return false;
      if (!filterState.showLocked && component.locked) return false;

      // Apply search
      if (searchLower && !component.name.toLowerCase().includes(searchLower)) {
        return false;
      }

      return true;
    };

    const flatten = (id: ComponentId, depth: number) => {
      const component = componentsById[id];
      if (!component || !shouldIncludeComponent(component)) return;

      const hasChildren = component.childIds.length > 0;
      const isExpanded = expandedIds.has(id);

      flattened.push({
        id,
        depth,
        component,
        hasChildren,
        index: flattened.length,
      });

      // Recursively flatten children if expanded
      if (hasChildren && isExpanded) {
        component.childIds.forEach((childId) => {
          flatten(childId, depth + 1);
        });
      }
    };

    rootIds.forEach((id) => flatten(id, 0));

    return flattened;
  }, [componentsById, rootIds, expandedIds, searchQuery, filterState]);
}

/**
 * Keyboard navigation hook
 */
function useKeyboardNavigation(
  flattenedTree: FlattenedNode[],
  expandedIds: Set<ComponentId>,
  onToggleExpand: (id: ComponentId) => void
) {
  const selectedIds = usePageBuilderStore((state) => state.selection.selectedIds);
  const selectComponent = usePageBuilderStore((state) => state.selectComponent);
  const deleteComponent = usePageBuilderStore((state) => state.deleteComponent);
  const duplicateComponent = usePageBuilderStore((state) => state.duplicateComponent);
  const copy = usePageBuilderStore((state) => state.copy);
  const cut = usePageBuilderStore((state) => state.cut);
  const paste = usePageBuilderStore((state) => state.paste);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle if we have a selection and tree is focused
      if (selectedIds.length === 0 || flattenedTree.length === 0) return;

      const currentId = selectedIds[0];
      const currentIndex = flattenedTree.findIndex((node) => node.id === currentId);
      if (currentIndex === -1) return;

      const currentNode = flattenedTree[currentIndex];

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          if (currentIndex < flattenedTree.length - 1) {
            selectComponent(flattenedTree[currentIndex + 1].id, false);
          }
          break;

        case 'ArrowUp':
          e.preventDefault();
          if (currentIndex > 0) {
            selectComponent(flattenedTree[currentIndex - 1].id, false);
          }
          break;

        case 'ArrowRight':
          e.preventDefault();
          if (currentNode.hasChildren && !expandedIds.has(currentId)) {
            onToggleExpand(currentId);
          }
          break;

        case 'ArrowLeft':
          e.preventDefault();
          if (currentNode.hasChildren && expandedIds.has(currentId)) {
            onToggleExpand(currentId);
          }
          break;

        case 'Enter':
        case ' ':
          e.preventDefault();
          if (currentNode.hasChildren) {
            onToggleExpand(currentId);
          }
          break;

        case 'Delete':
        case 'Backspace':
          e.preventDefault();
          selectedIds.forEach((id) => deleteComponent(id));
          break;

        case 'd':
          if (e.metaKey || e.ctrlKey) {
            e.preventDefault();
            duplicateComponent(currentId);
          }
          break;

        case 'c':
          if (e.metaKey || e.ctrlKey) {
            e.preventDefault();
            copy();
          }
          break;

        case 'x':
          if (e.metaKey || e.ctrlKey) {
            e.preventDefault();
            cut();
          }
          break;

        case 'v':
          if (e.metaKey || e.ctrlKey) {
            e.preventDefault();
            paste();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    flattenedTree,
    selectedIds,
    expandedIds,
    selectComponent,
    deleteComponent,
    duplicateComponent,
    copy,
    cut,
    paste,
    onToggleExpand,
  ]);
}

// ============================================================================
// COMPONENT
// ============================================================================

export const LayerTree: React.FC<LayerTreeProps> = ({
  className = '',
  height = DEFAULT_HEIGHT,
  onComponentClick,
}) => {
  // Store hooks
  const componentsById = usePageBuilderStore((state) => state.canvas.components.byId);
  const rootIds = usePageBuilderStore((state) => state.canvas.components.rootIds);
  const moveComponent = usePageBuilderStore((state) => state.moveComponent);

  // Local state
  const [expandedIds, setExpandedIds] = useState<Set<ComponentId>>(new Set(rootIds));
  const [searchQuery, setSearchQuery] = useState('');
  const [filterState, setFilterState] = useState<FilterState>({
    showHidden: true,
    showLocked: true,
    componentTypes: [],
  });

  const listRef = useRef<List>(null);

  // Flatten tree for virtualization
  const flattenedTree = useFlattenedTree(
    componentsById,
    rootIds,
    expandedIds,
    searchQuery,
    filterState
  );

  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Prevent accidental drags
      },
    }),
    useSensor(KeyboardSensor)
  );

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================

  const handleToggleExpand = useCallback((id: ComponentId) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const handleCollapseAll = useCallback(() => {
    setExpandedIds(new Set());
  }, []);

  const handleExpandAll = useCallback(() => {
    const allIds = new Set<ComponentId>();
    const collectIds = (id: ComponentId) => {
      const component = componentsById[id];
      if (component && component.childIds.length > 0) {
        allIds.add(id);
        component.childIds.forEach(collectIds);
      }
    };
    rootIds.forEach(collectIds);
    setExpandedIds(allIds);
  }, [componentsById, rootIds]);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      if (!over || active.id === over.id) return;

      const activeId = active.id as ComponentId;
      const overId = over.id as ComponentId;

      const activeComponent = componentsById[activeId];
      const overComponent = componentsById[overId];

      if (!activeComponent || !overComponent) return;

      // Prevent dropping parent into its own child
      const isDescendant = (parentId: ComponentId, childId: ComponentId): boolean => {
        let current = componentsById[childId];
        while (current) {
          if (current.id === parentId) return true;
          if (!current.parentId) break;
          current = componentsById[current.parentId];
        }
        return false;
      };

      if (isDescendant(activeId, overId)) {
        console.warn('Cannot drop parent into its own child');
        return;
      }

      // Move component to new parent
      moveComponent(activeId, overComponent.parentId, activeComponent.position);
    },
    [componentsById, moveComponent]
  );

  // Keyboard navigation
  useKeyboardNavigation(flattenedTree, expandedIds, handleToggleExpand);

  // Auto-expand when searching
  useEffect(() => {
    if (searchQuery.trim()) {
      handleExpandAll();
    }
  }, [searchQuery, handleExpandAll]);

  // ============================================================================
  // RENDER HELPERS
  // ============================================================================

  const Row = useCallback(
    ({ index, style }: { index: number; style: React.CSSProperties }) => {
      const node = flattenedTree[index];
      if (!node) return null;

      return (
        <LayerTreeItem
          key={node.id}
          id={node.id}
          depth={node.depth}
          index={node.index}
          isExpanded={expandedIds.has(node.id)}
          hasChildren={node.hasChildren}
          onToggleExpand={handleToggleExpand}
          style={style}
          totalCount={flattenedTree.length}
        />
      );
    },
    [flattenedTree, expandedIds, handleToggleExpand]
  );

  // ============================================================================
  // RENDER
  // ============================================================================

  if (rootIds.length === 0) {
    return (
      <div className={`flex flex-col h-full bg-white dark:bg-gray-900 ${className}`}>
        <LayerTreeActions
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          filterState={filterState}
          onFilterChange={setFilterState}
          onCollapseAll={handleCollapseAll}
          onExpandAll={handleExpandAll}
          hasExpandedNodes={expandedIds.size > 0}
        />
        <div className="flex-1 flex items-center justify-center text-gray-500 dark:text-gray-400 text-sm">
          No components yet. Start by dragging from the palette.
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex flex-col h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 ${className}`}
      role="tree"
      aria-label="Component Layer Tree"
    >
      {/* Actions toolbar */}
      <LayerTreeActions
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        filterState={filterState}
        onFilterChange={setFilterState}
        onCollapseAll={handleCollapseAll}
        onExpandAll={handleExpandAll}
        hasExpandedNodes={expandedIds.size > 0}
      />

      {/* Virtualized tree list */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={flattenedTree.map((node) => node.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="flex-1 overflow-hidden">
            {flattenedTree.length > 0 ? (
              <List
                ref={listRef}
                height={height}
                itemCount={flattenedTree.length}
                itemSize={ITEM_HEIGHT}
                width="100%"
                overscanCount={5}
              >
                {Row}
              </List>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400 text-sm">
                {searchQuery
                  ? `No components match "${searchQuery}"`
                  : 'No components to display'}
              </div>
            )}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};
