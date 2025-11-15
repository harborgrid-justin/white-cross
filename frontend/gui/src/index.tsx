/**
 * Next.js GUI Builder - Main Exports
 * Export all components, hooks, types, and store
 */

// ============================================================================
// COMPONENTS
// ============================================================================

// Layout
export { BuilderLayout } from './components/BuilderLayout';

// Core Components
export { Toolbar } from './components/toolbar/Toolbar';
export { ComponentPalette } from './components/palette/ComponentPalette';
export { Canvas } from './components/canvas/Canvas';
export { PropertyEditor } from './components/properties/PropertyEditor';
export { LayerTree } from './components/layers/LayerTree';

// ============================================================================
// HOOKS
// ============================================================================

export {
  // Component hooks
  useAddComponent,
  useUpdateComponent,
  useDeleteComponent,
  useMoveComponent,
  useDuplicateComponent,

  // Selection hooks
  useSelection,
  useSelectComponent,
  useSelectedComponents,

  // Clipboard hooks
  useCopyPaste,

  // History hooks
  useHistory,
  useUndo,
  useRedo,

  // Preview hooks
  usePreview,

  // Viewport hooks
  useViewport,

  // Grid hooks
  useGrid,

  // Keyboard shortcuts
  useKeyboardShortcuts,
} from './hooks/usePageBuilder';

// ============================================================================
// STORE
// ============================================================================

export {
  usePageBuilderStore,
  useComponent,
  useRootComponents,
  useCanUndo,
  useCanRedo,
  useCurrentPage,
} from './store';

// ============================================================================
// TYPES
// ============================================================================

// Re-export all types from the types directory
export type {
  ComponentId,
  ComponentType,
  ComponentInstance,
  Position,
  Size,
  ComponentProps,
  ComponentStyles,

  // State types
  PageBuilderState,
  CanvasState,
  SelectionState,
  ClipboardState,
  HistoryState,
  PreviewState,
  WorkflowState,
  PropertiesState,
  PreferencesState,

  // Component data
  ComponentData,

  // Viewport
  Viewport,

  // Grid
  GridSettings,

  // Page
  Page,
} from './types';

// ============================================================================
// VERSION
// ============================================================================

export const VERSION = '1.0.0';
export const BUILD_DATE = new Date().toISOString();

// ============================================================================
// DEFAULT EXPORT
// ============================================================================

export default {
  VERSION,
  BUILD_DATE,
};
