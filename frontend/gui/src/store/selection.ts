/**
 * Advanced Selection Features
 *
 * Provides advanced selection functionality including box selection,
 * keyboard navigation, and multi-selection helpers.
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type { ComponentId, ComponentInstance } from '../types';

// ============================================================================
// TYPES
// ============================================================================

export interface BoxSelection {
  isActive: boolean;
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
}

export interface SelectionHistory {
  past: ComponentId[][];
  future: ComponentId[][];
  maxSize: number;
}

export interface AdvancedSelectionState {
  boxSelection: BoxSelection;
  selectionHistory: SelectionHistory;
  lastSelectedId: ComponentId | null;
  
  startBoxSelection: (x: number, y: number) => void;
  updateBoxSelection: (x: number, y: number) => void;
  endBoxSelection: () => void;
  cancelBoxSelection: () => void;
  
  saveSelectionToHistory: (selection: ComponentId[]) => void;
  undoSelection: () => ComponentId[] | null;
  redoSelection: () => ComponentId[] | null;
  
  setLastSelected: (id: ComponentId | null) => void;
  
  reset: () => void;
}

// ============================================================================
// INITIAL STATE
// ============================================================================

const initialState = {
  boxSelection: {
    isActive: false,
    startX: 0,
    startY: 0,
    currentX: 0,
    currentY: 0,
  },
  selectionHistory: {
    past: [],
    future: [],
    maxSize: 50,
  },
  lastSelectedId: null,
};

// ============================================================================
// STORE
// ============================================================================

export const useAdvancedSelectionStore = create<AdvancedSelectionState>()(
  devtools(
    immer((set, get) => ({
      ...initialState,

      startBoxSelection: (x, y) => {
        set((state) => {
          state.boxSelection.isActive = true;
          state.boxSelection.startX = x;
          state.boxSelection.startY = y;
          state.boxSelection.currentX = x;
          state.boxSelection.currentY = y;
        });
      },

      updateBoxSelection: (x, y) => {
        set((state) => {
          if (!state.boxSelection.isActive) return;
          state.boxSelection.currentX = x;
          state.boxSelection.currentY = y;
        });
      },

      endBoxSelection: () => {
        set((state) => {
          state.boxSelection.isActive = false;
        });
      },

      cancelBoxSelection: () => {
        set((state) => {
          state.boxSelection = initialState.boxSelection;
        });
      },

      saveSelectionToHistory: (selection) => {
        set((state) => {
          state.selectionHistory.past.push([...selection]);
          
          if (state.selectionHistory.past.length > state.selectionHistory.maxSize) {
            state.selectionHistory.past.shift();
          }
          
          state.selectionHistory.future = [];
        });
      },

      undoSelection: () => {
        const past = get().selectionHistory.past;
        if (past.length === 0) return null;

        const previous = past[past.length - 1];
        
        set((state) => {
          state.selectionHistory.past.pop();
          state.selectionHistory.future.push([...previous]);
        });

        return previous;
      },

      redoSelection: () => {
        const future = get().selectionHistory.future;
        if (future.length === 0) return null;

        const next = future[future.length - 1];
        
        set((state) => {
          state.selectionHistory.future.pop();
          state.selectionHistory.past.push([...next]);
        });

        return next;
      },

      setLastSelected: (id) => {
        set((state) => {
          state.lastSelectedId = id;
        });
      },

      reset: () => {
        set(() => initialState);
      },
    })),
    {
      name: 'AdvancedSelectionStore',
      enabled: process.env.NODE_ENV === 'development',
    }
  )
);

// ============================================================================
// SELECTORS
// ============================================================================

export const useBoxSelection = () =>
  useAdvancedSelectionStore((state) => state.boxSelection);

export const useIsBoxSelecting = () =>
  useAdvancedSelectionStore((state) => state.boxSelection.isActive);

export const useCanUndoSelection = () =>
  useAdvancedSelectionStore((state) => state.selectionHistory.past.length > 0);

export const useCanRedoSelection = () =>
  useAdvancedSelectionStore((state) => state.selectionHistory.future.length > 0);

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

export function getBoxSelectionRect(box: BoxSelection): {
  x: number;
  y: number;
  width: number;
  height: number;
} {
  const x = Math.min(box.startX, box.currentX);
  const y = Math.min(box.startY, box.currentY);
  const width = Math.abs(box.currentX - box.startX);
  const height = Math.abs(box.currentY - box.startY);

  return { x, y, width, height };
}

export function isComponentInBox(
  component: ComponentInstance,
  box: BoxSelection
): boolean {
  const boxRect = getBoxSelectionRect(box);
  const compRect = {
    x: component.position.x,
    y: component.position.y,
    width: component.size.width,
    height: component.size.height,
  };

  return rectsIntersect(boxRect, compRect);
}

export function getComponentsInBox(
  components: ComponentInstance[],
  box: BoxSelection
): ComponentInstance[] {
  return components.filter((comp) => isComponentInBox(comp, box));
}

function rectsIntersect(
  rect1: { x: number; y: number; width: number; height: number },
  rect2: { x: number; y: number; width: number; height: number }
): boolean {
  return !(
    rect1.x + rect1.width < rect2.x ||
    rect2.x + rect2.width < rect1.x ||
    rect1.y + rect1.height < rect2.y ||
    rect2.y + rect2.height < rect1.y
  );
}

// ============================================================================
// KEYBOARD NAVIGATION HELPERS
// ============================================================================

export interface NavigationOptions {
  wrap?: boolean;
  skipHidden?: boolean;
  skipLocked?: boolean;
}

export function getNextSibling(
  components: ComponentInstance[],
  currentComponent: ComponentInstance,
  options?: NavigationOptions
): ComponentInstance | null {
  if (!currentComponent.parentId) {
    return null;
  }

  const parent = components.find((c) => c.id === currentComponent.parentId);
  if (!parent) return null;

  let siblings = parent.childIds
    .map((id) => components.find((c) => c.id === id))
    .filter((c): c is ComponentInstance => c !== undefined);

  if (options?.skipHidden) {
    siblings = siblings.filter((c) => !c.hidden);
  }
  if (options?.skipLocked) {
    siblings = siblings.filter((c) => !c.locked);
  }

  const currentIndex = siblings.findIndex((c) => c.id === currentComponent.id);
  if (currentIndex === -1) return null;

  const nextIndex = currentIndex + 1;

  if (nextIndex >= siblings.length) {
    return options?.wrap ? siblings[0] : null;
  }

  return siblings[nextIndex];
}

export function getPreviousSibling(
  components: ComponentInstance[],
  currentComponent: ComponentInstance,
  options?: NavigationOptions
): ComponentInstance | null {
  if (!currentComponent.parentId) {
    return null;
  }

  const parent = components.find((c) => c.id === currentComponent.parentId);
  if (!parent) return null;

  let siblings = parent.childIds
    .map((id) => components.find((c) => c.id === id))
    .filter((c): c is ComponentInstance => c !== undefined);

  if (options?.skipHidden) {
    siblings = siblings.filter((c) => !c.hidden);
  }
  if (options?.skipLocked) {
    siblings = siblings.filter((c) => !c.locked);
  }

  const currentIndex = siblings.findIndex((c) => c.id === currentComponent.id);
  if (currentIndex === -1) return null;

  const prevIndex = currentIndex - 1;

  if (prevIndex < 0) {
    return options?.wrap ? siblings[siblings.length - 1] : null;
  }

  return siblings[prevIndex];
}

export function getFirstChild(
  components: ComponentInstance[],
  component: ComponentInstance,
  options?: NavigationOptions
): ComponentInstance | null {
  let children = component.childIds
    .map((id) => components.find((c) => c.id === id))
    .filter((c): c is ComponentInstance => c !== undefined);

  if (options?.skipHidden) {
    children = children.filter((c) => !c.hidden);
  }
  if (options?.skipLocked) {
    children = children.filter((c) => !c.locked);
  }

  return children[0] || null;
}

export function getLastChild(
  components: ComponentInstance[],
  component: ComponentInstance,
  options?: NavigationOptions
): ComponentInstance | null {
  let children = component.childIds
    .map((id) => components.find((c) => c.id === id))
    .filter((c): c is ComponentInstance => c !== undefined);

  if (options?.skipHidden) {
    children = children.filter((c) => !c.hidden);
  }
  if (options?.skipLocked) {
    children = children.filter((c) => !c.locked);
  }

  return children[children.length - 1] || null;
}

export function getParentComponent(
  components: ComponentInstance[],
  component: ComponentInstance
): ComponentInstance | null {
  if (!component.parentId) return null;
  return components.find((c) => c.id === component.parentId) || null;
}

// ============================================================================
// RANGE SELECTION HELPERS
// ============================================================================

export function getRangeSelection(
  components: ComponentInstance[],
  startComponent: ComponentInstance,
  endComponent: ComponentInstance
): ComponentInstance[] {
  const startIndex = components.findIndex((c) => c.id === startComponent.id);
  const endIndex = components.findIndex((c) => c.id === endComponent.id);

  if (startIndex === -1 || endIndex === -1) return [];

  const minIndex = Math.min(startIndex, endIndex);
  const maxIndex = Math.max(startIndex, endIndex);

  return components.slice(minIndex, maxIndex + 1);
}

export function selectBetween(
  components: ComponentInstance[],
  component1: ComponentInstance,
  component2: ComponentInstance,
  currentSelection: ComponentId[]
): ComponentId[] {
  const range = getRangeSelection(components, component1, component2);
  const rangeIds = range.map((c) => c.id);

  const combined = new Set([...currentSelection, ...rangeIds]);
  return Array.from(combined);
}

// ============================================================================
// SMART SELECTION HELPERS
// ============================================================================

export function selectAll(
  components: ComponentInstance[],
  options?: NavigationOptions
): ComponentId[] {
  let filtered = components;

  if (options?.skipHidden) {
    filtered = filtered.filter((c) => !c.hidden);
  }
  if (options?.skipLocked) {
    filtered = filtered.filter((c) => !c.locked);
  }

  return filtered.map((c) => c.id);
}

export function selectSiblings(
  components: ComponentInstance[],
  component: ComponentInstance,
  options?: NavigationOptions
): ComponentId[] {
  if (!component.parentId) return [];

  const parent = components.find((c) => c.id === component.parentId);
  if (!parent) return [];

  let siblings = parent.childIds
    .map((id) => components.find((c) => c.id === id))
    .filter((c): c is ComponentInstance => c !== undefined)
    .filter((c) => c.id !== component.id);

  if (options?.skipHidden) {
    siblings = siblings.filter((c) => !c.hidden);
  }
  if (options?.skipLocked) {
    siblings = siblings.filter((c) => !c.locked);
  }

  return siblings.map((c) => c.id);
}

export function selectChildren(
  components: ComponentInstance[],
  component: ComponentInstance,
  options?: NavigationOptions
): ComponentId[] {
  let children = component.childIds
    .map((id) => components.find((c) => c.id === id))
    .filter((c): c is ComponentInstance => c !== undefined);

  if (options?.skipHidden) {
    children = children.filter((c) => !c.hidden);
  }
  if (options?.skipLocked) {
    children = children.filter((c) => !c.locked);
  }

  return children.map((c) => c.id);
}

export function selectDescendants(
  components: ComponentInstance[],
  component: ComponentInstance,
  options?: NavigationOptions
): ComponentId[] {
  const descendants: ComponentId[] = [];

  function traverse(comp: ComponentInstance) {
    comp.childIds.forEach((childId) => {
      const child = components.find((c) => c.id === childId);
      if (!child) return;

      if (options?.skipHidden && child.hidden) return;
      if (options?.skipLocked && child.locked) return;

      descendants.push(child.id);
      traverse(child);
    });
  }

  traverse(component);
  return descendants;
}
