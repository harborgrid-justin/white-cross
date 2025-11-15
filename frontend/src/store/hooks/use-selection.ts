/**
 * Custom hooks for selection state
 */

import { useCallback } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { usePageBuilderStore } from '../index';
import {
  selectSelectedIds,
  selectIsSelected,
  selectSelectedComponents,
  selectHoveredComponent,
  selectFocusedComponent,
  selectHasSelection,
  selectIsMultiSelection,
} from '../selectors/selection-selectors';

/**
 * Hook to get selected component IDs
 */
export function useSelectedIds() {
  return usePageBuilderStore(useCallback((state) => selectSelectedIds(state), []));
}

/**
 * Hook to check if a component is selected
 */
export function useIsSelected(componentId: string) {
  return usePageBuilderStore(
    useCallback((state) => selectIsSelected(state, componentId), [componentId])
  );
}

/**
 * Hook to get selected components
 */
export function useSelectedComponents() {
  return usePageBuilderStore(useCallback((state) => selectSelectedComponents(state), []));
}

/**
 * Hook to get hovered component
 */
export function useHoveredComponent() {
  return usePageBuilderStore(useCallback((state) => selectHoveredComponent(state), []));
}

/**
 * Hook to get focused component
 */
export function useFocusedComponent() {
  return usePageBuilderStore(useCallback((state) => selectFocusedComponent(state), []));
}

/**
 * Hook to check if there is any selection
 */
export function useHasSelection() {
  return usePageBuilderStore(useCallback((state) => selectHasSelection(state), []));
}

/**
 * Hook to check if multiple components are selected
 */
export function useIsMultiSelection() {
  return usePageBuilderStore(useCallback((state) => selectIsMultiSelection(state), []));
}

/**
 * Hook to get selection actions
 */
export function useSelectionActions() {
  return usePageBuilderStore(
    useShallow((state) => ({
      select: state.select,
      deselect: state.deselect,
      selectMultiple: state.selectMultiple,
      clearSelection: state.clearSelection,
      setHovered: state.setHovered,
      setFocused: state.setFocused,
    }))
  );
}

/**
 * Hook to get specific selection actions
 */
export function useSelect() {
  return usePageBuilderStore((state) => state.select);
}

export function useDeselect() {
  return usePageBuilderStore((state) => state.deselect);
}

export function useClearSelection() {
  return usePageBuilderStore((state) => state.clearSelection);
}

export function useSetHovered() {
  return usePageBuilderStore((state) => state.setHovered);
}
