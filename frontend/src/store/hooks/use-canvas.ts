/**
 * Custom hooks for canvas state
 */

import { useCallback } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { usePageBuilderStore } from '../index';
import {
  selectComponent,
  selectAllComponents,
  selectRootComponents,
  selectChildren,
  selectParent,
  selectComponentTree,
  selectIsCanvasEmpty,
} from '../selectors/canvas-selectors';

/**
 * Hook to get a component by ID
 */
export function useComponent(componentId: string) {
  return usePageBuilderStore(
    useCallback((state) => selectComponent(state, componentId), [componentId])
  );
}

/**
 * Hook to get all components
 */
export function useAllComponents() {
  return usePageBuilderStore(useCallback((state) => selectAllComponents(state), []));
}

/**
 * Hook to get root components
 */
export function useRootComponents() {
  return usePageBuilderStore(useCallback((state) => selectRootComponents(state), []));
}

/**
 * Hook to get children of a component
 */
export function useComponentChildren(componentId: string) {
  return usePageBuilderStore(
    useCallback((state) => selectChildren(state, componentId), [componentId])
  );
}

/**
 * Hook to get parent of a component
 */
export function useComponentParent(componentId: string) {
  return usePageBuilderStore(
    useCallback((state) => selectParent(state, componentId), [componentId])
  );
}

/**
 * Hook to get component tree
 */
export function useComponentTree() {
  return usePageBuilderStore(useCallback((state) => selectComponentTree(state), []));
}

/**
 * Hook to check if canvas is empty
 */
export function useIsCanvasEmpty() {
  return usePageBuilderStore(useCallback((state) => selectIsCanvasEmpty(state), []));
}

/**
 * Hook to get canvas actions
 */
export function useCanvasActions() {
  return usePageBuilderStore(
    useShallow((state) => ({
      addComponent: state.addComponent,
      removeComponent: state.removeComponent,
      updateComponent: state.updateComponent,
      moveComponent: state.moveComponent,
      duplicateComponent: state.duplicateComponent,
      clearCanvas: state.clearCanvas,
    }))
  );
}

/**
 * Hook to get specific canvas action
 */
export function useAddComponent() {
  return usePageBuilderStore((state) => state.addComponent);
}

export function useRemoveComponent() {
  return usePageBuilderStore((state) => state.removeComponent);
}

export function useUpdateComponent() {
  return usePageBuilderStore((state) => state.updateComponent);
}

export function useMoveComponent() {
  return usePageBuilderStore((state) => state.moveComponent);
}

export function useDuplicateComponent() {
  return usePageBuilderStore((state) => state.duplicateComponent);
}

export function useClearCanvas() {
  return usePageBuilderStore((state) => state.clearCanvas);
}
