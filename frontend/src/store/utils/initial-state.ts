/**
 * Initial state definitions for all store slices
 */

import type {
  CanvasState,
  SelectionState,
  ClipboardState,
  HistoryState,
  PreviewState,
  WorkflowState,
  PropertiesState,
  PreferencesState,
  CollaborationState,
  PageBuilderState,
} from '../types';

export const initialCanvasState: CanvasState = {
  components: {
    byId: {},
    allIds: [],
    rootIds: [],
  },
  activePageId: null,
};

export const initialSelectionState: SelectionState = {
  selectedIds: [],
  hoveredId: null,
  focusedId: null,
};

export const initialClipboardState: ClipboardState = {
  copiedComponents: [],
  operation: null,
};

export const initialHistoryState: HistoryState = {
  past: [],
  future: [],
  maxSnapshots: 50,
};

export const initialPreviewState: PreviewState = {
  isPreviewMode: false,
  viewport: {
    width: 1920,
    height: 1080,
    device: 'desktop',
  },
};

export const initialWorkflowState: WorkflowState = {
  pages: {
    byId: {},
    allIds: [],
  },
  currentPageId: null,
  workflowId: null,
};

export const initialPropertiesState: PropertiesState = {
  componentProperties: {},
};

export const initialPreferencesState: PreferencesState = {
  theme: 'light',
  autoSave: true,
  autoSaveInterval: 30, // 30 seconds
  snapToGrid: true,
  gridSize: 8,
  showRulers: true,
  showGuides: true,
  showGrid: true,
  zoomLevel: 100,
};

export const initialCollaborationState: CollaborationState = {
  activeUsers: [],
  cursors: {},
  locks: {},
  isConnected: false,
  sessionId: null,
};

export const initialPageBuilderState: PageBuilderState = {
  canvas: initialCanvasState,
  selection: initialSelectionState,
  clipboard: initialClipboardState,
  history: initialHistoryState,
  preview: initialPreviewState,
  workflow: initialWorkflowState,
  properties: initialPropertiesState,
  preferences: initialPreferencesState,
  collaboration: initialCollaborationState,
};
