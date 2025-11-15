/**
 * Selection selectors
 */

import type { PageBuilderState, ComponentNode } from '../types';

/**
 * Select all selected component IDs
 */
export const selectSelectedIds = (state: PageBuilderState): string[] => {
  return state.selection.selectedIds;
};

/**
 * Check if a component is selected
 */
export const selectIsSelected = (state: PageBuilderState, componentId: string): boolean => {
  return state.selection.selectedIds.includes(componentId);
};

/**
 * Select all selected components
 */
export const selectSelectedComponents = (state: PageBuilderState): ComponentNode[] => {
  return state.selection.selectedIds
    .map((id) => state.canvas.components.byId[id])
    .filter((c): c is ComponentNode => c !== undefined);
};

/**
 * Select hovered component ID
 */
export const selectHoveredId = (state: PageBuilderState): string | null => {
  return state.selection.hoveredId;
};

/**
 * Select hovered component
 */
export const selectHoveredComponent = (state: PageBuilderState): ComponentNode | null => {
  if (!state.selection.hoveredId) return null;
  return state.canvas.components.byId[state.selection.hoveredId] || null;
};

/**
 * Select focused component ID
 */
export const selectFocusedId = (state: PageBuilderState): string | null => {
  return state.selection.focusedId;
};

/**
 * Select focused component
 */
export const selectFocusedComponent = (state: PageBuilderState): ComponentNode | null => {
  if (!state.selection.focusedId) return null;
  return state.canvas.components.byId[state.selection.focusedId] || null;
};

/**
 * Check if there is any selection
 */
export const selectHasSelection = (state: PageBuilderState): boolean => {
  return state.selection.selectedIds.length > 0;
};

/**
 * Check if multiple components are selected
 */
export const selectIsMultiSelection = (state: PageBuilderState): boolean => {
  return state.selection.selectedIds.length > 1;
};
