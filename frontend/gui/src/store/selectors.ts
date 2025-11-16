/**
 * Advanced Selectors for Page Builder Store
 *
 * This module provides memoized selectors with optimal re-render performance.
 * Uses Zustand's built-in shallow equality and custom memoization strategies.
 */

import { usePageBuilderStore } from './index';
import { shallow } from 'zustand/shallow';
import type { ComponentId, ComponentInstance } from '../types';

// ============================================================================
// SELECTOR UTILITIES
// ============================================================================

/**
 * Creates a memoized selector that compares results using shallow equality
 */
export const createShallowSelector = <T>(selector: (state: any) => T) => {
  return () => usePageBuilderStore(selector, shallow);
};

// ============================================================================
// COMPONENT SELECTORS
// ============================================================================

/**
 * Get a specific component by ID (memoized)
 */
export const useComponentById = (id: ComponentId) =>
  usePageBuilderStore((state) => state.canvas.components.byId[id]);

/**
 * Get multiple components by IDs (memoized with shallow comparison)
 */
export const useComponentsByIds = (ids: ComponentId[]) =>
  usePageBuilderStore(
    (state) => ids.map((id) => state.canvas.components.byId[id]).filter(Boolean),
    shallow
  );

/**
 * Get root components (top-level, no parent)
 */
export const useRootComponents = createShallowSelector((state) =>
  state.canvas.components.rootIds
    .map((id: ComponentId) => state.canvas.components.byId[id])
    .filter(Boolean)
);

/**
 * Get children of a specific component
 */
export const useComponentChildren = (parentId: ComponentId) =>
  usePageBuilderStore(
    (state) => {
      const parent = state.canvas.components.byId[parentId];
      if (!parent) return [];
      return parent.childIds
        .map((id) => state.canvas.components.byId[id])
        .filter(Boolean);
    },
    shallow
  );

/**
 * Get parent of a component
 */
export const useComponentParent = (childId: ComponentId) =>
  usePageBuilderStore((state) => {
    const child = state.canvas.components.byId[childId];
    if (!child?.parentId) return null;
    return state.canvas.components.byId[child.parentId];
  });

/**
 * Get all ancestors of a component (from parent to root)
 */
export const useComponentAncestors = (componentId: ComponentId) =>
  usePageBuilderStore(
    (state) => {
      const ancestors: ComponentInstance[] = [];
      let currentId: ComponentId | null = componentId;

      while (currentId) {
        const component = state.canvas.components.byId[currentId];
        if (!component?.parentId) break;

        const parent = state.canvas.components.byId[component.parentId];
        if (!parent) break;

        ancestors.push(parent);
        currentId = component.parentId;
      }

      return ancestors;
    },
    shallow
  );

/**
 * Get all descendants of a component (recursive)
 */
export const useComponentDescendants = (componentId: ComponentId) =>
  usePageBuilderStore(
    (state) => {
      const descendants: ComponentInstance[] = [];

      const traverse = (id: ComponentId) => {
        const component = state.canvas.components.byId[id];
        if (!component) return;

        component.childIds.forEach((childId) => {
          const child = state.canvas.components.byId[childId];
          if (child) {
            descendants.push(child);
            traverse(childId);
          }
        });
      };

      traverse(componentId);
      return descendants;
    },
    shallow
  );

/**
 * Get siblings of a component (components with same parent)
 */
export const useComponentSiblings = (componentId: ComponentId) =>
  usePageBuilderStore(
    (state) => {
      const component = state.canvas.components.byId[componentId];
      if (!component) return [];

      if (component.parentId === null) {
        // Root component - siblings are other root components
        return state.canvas.components.rootIds
          .filter((id) => id !== componentId)
          .map((id) => state.canvas.components.byId[id])
          .filter(Boolean);
      }

      const parent = state.canvas.components.byId[component.parentId];
      if (!parent) return [];

      return parent.childIds
        .filter((id) => id !== componentId)
        .map((id) => state.canvas.components.byId[id])
        .filter(Boolean);
    },
    shallow
  );

/**
 * Check if component has children
 */
export const useHasChildren = (componentId: ComponentId) =>
  usePageBuilderStore((state) => {
    const component = state.canvas.components.byId[componentId];
    return component ? component.childIds.length > 0 : false;
  });

/**
 * Get component depth in tree (0 for root, 1 for children of root, etc.)
 */
export const useComponentDepth = (componentId: ComponentId) =>
  usePageBuilderStore((state) => {
    let depth = 0;
    let currentId: ComponentId | null = componentId;

    while (currentId) {
      const component = state.canvas.components.byId[currentId];
      if (!component?.parentId) break;
      depth++;
      currentId = component.parentId;
    }

    return depth;
  });

/**
 * Get all components as a flat array
 */
export const useAllComponents = createShallowSelector((state) =>
  state.canvas.components.allIds
    .map((id: ComponentId) => state.canvas.components.byId[id])
    .filter(Boolean)
);

/**
 * Get component count
 */
export const useComponentCount = () =>
  usePageBuilderStore((state) => state.canvas.components.allIds.length);

/**
 * Search components by name or type
 */
export const useComponentSearch = (query: string) =>
  usePageBuilderStore(
    (state) => {
      if (!query) return [];

      const lowerQuery = query.toLowerCase();
      return state.canvas.components.allIds
        .map((id) => state.canvas.components.byId[id])
        .filter((comp) => {
          if (!comp) return false;
          return (
            comp.name.toLowerCase().includes(lowerQuery) ||
            comp.type.toLowerCase().includes(lowerQuery)
          );
        });
    },
    shallow
  );

// ============================================================================
// SELECTION SELECTORS
// ============================================================================

/**
 * Get selected component IDs
 */
export const useSelectedIds = () =>
  usePageBuilderStore((state) => state.selection.selectedIds, shallow);

/**
 * Get selected components
 */
export const useSelectedComponents = createShallowSelector((state) =>
  state.selection.selectedIds
    .map((id: ComponentId) => state.canvas.components.byId[id])
    .filter(Boolean)
);

/**
 * Get first selected component (primary selection)
 */
export const usePrimarySelection = () =>
  usePageBuilderStore((state) => {
    const firstId = state.selection.selectedIds[0];
    return firstId ? state.canvas.components.byId[firstId] : null;
  });

/**
 * Check if a specific component is selected
 */
export const useIsSelected = (componentId: ComponentId) =>
  usePageBuilderStore((state) => state.selection.selectedIds.includes(componentId));

/**
 * Get selection count
 */
export const useSelectionCount = () =>
  usePageBuilderStore((state) => state.selection.selectedIds.length);

/**
 * Get hovered component
 */
export const useHoveredComponent = () =>
  usePageBuilderStore((state) => {
    const id = state.selection.hoveredId;
    return id ? state.canvas.components.byId[id] : null;
  });

/**
 * Get focused component
 */
export const useFocusedComponent = () =>
  usePageBuilderStore((state) => {
    const id = state.selection.focusedId;
    return id ? state.canvas.components.byId[id] : null;
  });

/**
 * Check if there's an active selection
 */
export const useHasSelection = () =>
  usePageBuilderStore((state) => state.selection.selectedIds.length > 0);

/**
 * Check if multiple components are selected
 */
export const useIsMultiSelect = () =>
  usePageBuilderStore((state) => state.selection.selectedIds.length > 1);

// ============================================================================
// HISTORY SELECTORS
// ============================================================================

/**
 * Check if undo is available
 */
export const useCanUndo = () =>
  usePageBuilderStore((state) => state.history.past.length > 0);

/**
 * Check if redo is available
 */
export const useCanRedo = () =>
  usePageBuilderStore((state) => state.history.future.length > 0);

/**
 * Get undo/redo state
 */
export const useHistoryState = createShallowSelector((state) => ({
  canUndo: state.history.past.length > 0,
  canRedo: state.history.future.length > 0,
  pastCount: state.history.past.length,
  futureCount: state.history.future.length,
}));

// ============================================================================
// CLIPBOARD SELECTORS
// ============================================================================

/**
 * Get clipboard state
 */
export const useClipboard = createShallowSelector((state) => ({
  operation: state.clipboard.operation,
  hasContent: state.clipboard.components.length > 0,
  count: state.clipboard.components.length,
}));

/**
 * Check if paste is available
 */
export const useCanPaste = () =>
  usePageBuilderStore((state) => state.clipboard.components.length > 0);

// ============================================================================
// VIEWPORT SELECTORS
// ============================================================================

/**
 * Get viewport state
 */
export const useViewportState = createShallowSelector((state) => state.canvas.viewport);

/**
 * Get current zoom level
 */
export const useZoom = () =>
  usePageBuilderStore((state) => state.canvas.viewport.zoom);

/**
 * Get pan position
 */
export const usePan = createShallowSelector((state) => ({
  x: state.canvas.viewport.panX,
  y: state.canvas.viewport.panY,
}));

// ============================================================================
// GRID SELECTORS
// ============================================================================

/**
 * Get grid state
 */
export const useGridState = createShallowSelector((state) => state.canvas.grid);

/**
 * Check if grid is enabled
 */
export const useIsGridEnabled = () =>
  usePageBuilderStore((state) => state.canvas.grid.enabled);

/**
 * Check if snap to grid is enabled
 */
export const useIsSnapToGrid = () =>
  usePageBuilderStore((state) => state.canvas.grid.snapToGrid);

// ============================================================================
// PREVIEW SELECTORS
// ============================================================================

/**
 * Get preview state
 */
export const usePreviewState = createShallowSelector((state) => state.preview);

/**
 * Check if in preview mode
 */
export const useIsPreviewMode = () =>
  usePageBuilderStore((state) => state.preview.isPreviewMode);

/**
 * Get preview device
 */
export const usePreviewDevice = () =>
  usePageBuilderStore((state) => state.preview.device);

// ============================================================================
// WORKFLOW SELECTORS
// ============================================================================

/**
 * Get all pages
 */
export const usePages = createShallowSelector((state) => state.workflow.pages);

/**
 * Get current page
 */
export const useCurrentPage = () =>
  usePageBuilderStore((state) =>
    state.workflow.pages.find((page) => page.id === state.workflow.currentPageId)
  );

/**
 * Get current page ID
 */
export const useCurrentPageId = () =>
  usePageBuilderStore((state) => state.workflow.currentPageId);

/**
 * Get page count
 */
export const usePageCount = () =>
  usePageBuilderStore((state) => state.workflow.pages.length);

/**
 * Get page by ID
 */
export const usePageById = (pageId: string) =>
  usePageBuilderStore((state) =>
    state.workflow.pages.find((page) => page.id === pageId)
  );

// ============================================================================
// PROPERTIES PANEL SELECTORS
// ============================================================================

/**
 * Get properties panel state
 */
export const usePropertiesState = createShallowSelector((state) => state.properties);

/**
 * Check if properties panel is open
 */
export const useIsPropertiesPanelOpen = () =>
  usePageBuilderStore((state) => state.properties.isPanelOpen);

/**
 * Get active properties tab
 */
export const useActivePropertiesTab = () =>
  usePageBuilderStore((state) => state.properties.activeTab);

// ============================================================================
// PREFERENCES SELECTORS
// ============================================================================

/**
 * Get user preferences
 */
export const usePreferences = createShallowSelector((state) => state.preferences);

/**
 * Get theme preference
 */
export const useTheme = () =>
  usePageBuilderStore((state) => state.preferences.theme);

/**
 * Check if auto-save is enabled
 */
export const useIsAutoSaveEnabled = () =>
  usePageBuilderStore((state) => state.preferences.autoSave);

// ============================================================================
// COMPOSITE SELECTORS (Multi-slice)
// ============================================================================

/**
 * Get selected components with their properties (optimized for property panel)
 */
export const useSelectedComponentsWithDetails = createShallowSelector((state) => {
  const selected = state.selection.selectedIds
    .map((id: ComponentId) => state.canvas.components.byId[id])
    .filter(Boolean);

  return selected.map((component: ComponentInstance) => {
    const parent = component.parentId
      ? state.canvas.components.byId[component.parentId]
      : null;

    const siblings = parent
      ? parent.childIds
          .filter((id: ComponentId) => id !== component.id)
          .map((id: ComponentId) => state.canvas.components.byId[id])
      : state.canvas.components.rootIds
          .filter((id: ComponentId) => id !== component.id)
          .map((id: ComponentId) => state.canvas.components.byId[id]);

    return {
      component,
      parent,
      siblings: siblings.filter(Boolean),
      hasChildren: component.childIds.length > 0,
      childCount: component.childIds.length,
    };
  });
});

/**
 * Get builder UI state (combines multiple UI-related states)
 */
export const useBuilderUIState = createShallowSelector((state) => ({
  isPreviewMode: state.preview.isPreviewMode,
  device: state.preview.device,
  orientation: state.preview.orientation,
  zoom: state.canvas.viewport.zoom,
  gridEnabled: state.canvas.grid.enabled,
  snapToGrid: state.canvas.grid.snapToGrid,
  propertiesPanelOpen: state.properties.isPanelOpen,
  activeTab: state.properties.activeTab,
}));

/**
 * Get editor state summary (for status bar)
 */
export const useEditorSummary = createShallowSelector((state) => ({
  componentCount: state.canvas.components.allIds.length,
  selectedCount: state.selection.selectedIds.length,
  pageCount: state.workflow.pages.length,
  currentPageName: state.workflow.pages.find((p: any) => p.id === state.workflow.currentPageId)?.name || '',
  canUndo: state.history.past.length > 0,
  canRedo: state.history.future.length > 0,
  canPaste: state.clipboard.components.length > 0,
}));
