/**
 * Derived selectors that combine multiple state slices
 */

import type { PageBuilderState, ComponentNode } from '../types';

/**
 * Select if undo is available
 */
export const selectCanUndo = (state: PageBuilderState): boolean => {
  return state.history.past.length > 0;
};

/**
 * Select if redo is available
 */
export const selectCanRedo = (state: PageBuilderState): boolean => {
  return state.history.future.length > 0;
};

/**
 * Select if paste is available
 */
export const selectCanPaste = (state: PageBuilderState): boolean => {
  return state.clipboard.copiedComponents.length > 0;
};

/**
 * Select if a component is locked (in collaboration)
 */
export const selectIsComponentLocked = (
  state: PageBuilderState,
  componentId: string
): boolean => {
  return componentId in state.collaboration.locks;
};

/**
 * Select who locked a component
 */
export const selectComponentLocker = (
  state: PageBuilderState,
  componentId: string
): string | null => {
  return state.collaboration.locks[componentId] || null;
};

/**
 * Select if current user can edit a component (not locked by others)
 */
export const selectCanEditComponent = (
  state: PageBuilderState,
  componentId: string,
  currentUserId?: string
): boolean => {
  const lockerId = state.collaboration.locks[componentId];
  if (!lockerId) return true;
  return currentUserId ? lockerId === currentUserId : false;
};

/**
 * Select selected components with their properties
 */
export const selectSelectedComponentsWithProperties = (state: PageBuilderState) => {
  return state.selection.selectedIds.map((id) => {
    const component = state.canvas.components.byId[id];
    const properties = state.properties.componentProperties[id] || {};
    return component ? { component, properties } : null;
  }).filter((item): item is { component: ComponentNode; properties: any } => item !== null);
};

/**
 * Select if grid is visible
 */
export const selectIsGridVisible = (state: PageBuilderState): boolean => {
  return state.preferences.showGrid && !state.preview.isPreviewMode;
};

/**
 * Select if rulers are visible
 */
export const selectAreRulersVisible = (state: PageBuilderState): boolean => {
  return state.preferences.showRulers && !state.preview.isPreviewMode;
};

/**
 * Select if guides are visible
 */
export const selectAreGuidesVisible = (state: PageBuilderState): boolean => {
  return state.preferences.showGuides && !state.preview.isPreviewMode;
};

/**
 * Select current viewport with zoom
 */
export const selectViewportWithZoom = (state: PageBuilderState) => {
  const { viewport } = state.preview;
  const { zoomLevel } = state.preferences;

  return {
    ...viewport,
    effectiveWidth: (viewport.width * zoomLevel) / 100,
    effectiveHeight: (viewport.height * zoomLevel) / 100,
    zoom: zoomLevel,
  };
};
