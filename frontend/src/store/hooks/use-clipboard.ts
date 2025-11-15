/**
 * Custom hooks for clipboard state
 */

import { useCallback } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { usePageBuilderStore } from '../index';
import { selectCanPaste } from '../selectors/derived-selectors';

/**
 * Hook to check if paste is available
 */
export function useCanPaste() {
  return usePageBuilderStore(useCallback((state) => selectCanPaste(state), []));
}

/**
 * Hook to get clipboard actions
 */
export function useClipboardActions() {
  return usePageBuilderStore(
    useShallow((state) => ({
      copy: state.copy,
      cut: state.cut,
      paste: state.paste,
      clearClipboard: state.clearClipboard,
    }))
  );
}

/**
 * Hook to get specific clipboard actions
 */
export function useCopy() {
  return usePageBuilderStore((state) => state.copy);
}

export function useCut() {
  return usePageBuilderStore((state) => state.cut);
}

export function usePaste() {
  return usePageBuilderStore((state) => state.paste);
}

/**
 * Hook to get clipboard state
 */
export function useClipboardState() {
  return usePageBuilderStore(
    useShallow((state) => ({
      copiedComponents: state.clipboard.copiedComponents,
      operation: state.clipboard.operation,
      canPaste: selectCanPaste(state),
    }))
  );
}
