/**
 * Canvas selectors for optimized component access
 */

import type { PageBuilderState, ComponentNode, ComponentsMap } from '../types';
import { buildComponentTree } from '../utils/normalization';

/**
 * Select a component by ID
 */
export const selectComponent = (state: PageBuilderState, componentId: string): ComponentNode | undefined => {
  return state.canvas.components.byId[componentId];
};

/**
 * Select all components
 */
export const selectAllComponents = (state: PageBuilderState): ComponentNode[] => {
  return state.canvas.components.allIds.map((id) => state.canvas.components.byId[id]);
};

/**
 * Select root components (components without parents)
 */
export const selectRootComponents = (state: PageBuilderState): ComponentNode[] => {
  return state.canvas.components.rootIds.map((id) => state.canvas.components.byId[id]);
};

/**
 * Select children of a component
 */
export const selectChildren = (state: PageBuilderState, componentId: string): ComponentNode[] => {
  const component = state.canvas.components.byId[componentId];
  if (!component) return [];

  return component.childIds.map((id) => state.canvas.components.byId[id]).filter(Boolean);
};

/**
 * Select parent of a component
 */
export const selectParent = (state: PageBuilderState, componentId: string): ComponentNode | null => {
  const component = state.canvas.components.byId[componentId];
  if (!component || !component.parentId) return null;

  return state.canvas.components.byId[component.parentId] || null;
};

/**
 * Select component tree (hierarchical structure)
 */
export const selectComponentTree = (state: PageBuilderState) => {
  return buildComponentTree(state.canvas.components);
};

/**
 * Select components map
 */
export const selectComponentsMap = (state: PageBuilderState): ComponentsMap => {
  return state.canvas.components;
};

/**
 * Check if canvas is empty
 */
export const selectIsCanvasEmpty = (state: PageBuilderState): boolean => {
  return state.canvas.components.allIds.length === 0;
};

/**
 * Select active page ID
 */
export const selectActivePageId = (state: PageBuilderState): string | null => {
  return state.canvas.activePageId;
};
