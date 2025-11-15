/**
 * Type definitions for the Page Builder state management system
 *
 * This file contains all TypeScript interfaces and types for the Zustand store.
 * It defines the schema for all 9 state domains.
 */

// ============================================================================
// Component Types
// ============================================================================

export type ComponentType =
  | 'Container'
  | 'Row'
  | 'Column'
  | 'Text'
  | 'Button'
  | 'Image'
  | 'Form'
  | 'Input'
  | 'Select'
  | 'Checkbox'
  | 'Radio'
  | 'Textarea'
  | 'Link'
  | 'Divider'
  | 'Spacer'
  | 'Video'
  | 'Iframe'
  | 'Custom';

export interface Position {
  x: number;
  y: number;
}

export interface Size {
  width: number | string;
  height: number | string;
}

export interface Spacing {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface ComponentStyle {
  backgroundColor?: string;
  color?: string;
  fontSize?: number | string;
  fontWeight?: number | string;
  fontFamily?: string;
  padding?: Spacing;
  margin?: Spacing;
  border?: {
    width: number;
    style: 'solid' | 'dashed' | 'dotted' | 'none';
    color: string;
    radius: number;
  };
  shadow?: {
    x: number;
    y: number;
    blur: number;
    color: string;
  };
  opacity?: number;
  [key: string]: any;
}

export interface ComponentProperties {
  // Common properties
  className?: string;
  style?: ComponentStyle;

  // Text properties
  text?: string;
  placeholder?: string;

  // Link properties
  href?: string;
  target?: '_blank' | '_self' | '_parent' | '_top';

  // Image properties
  src?: string;
  alt?: string;

  // Form properties
  name?: string;
  value?: any;
  defaultValue?: any;

  // Layout properties
  display?: 'block' | 'inline' | 'inline-block' | 'flex' | 'grid';
  flexDirection?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  justifyContent?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around';
  alignItems?: 'flex-start' | 'flex-end' | 'center' | 'baseline' | 'stretch';
  gap?: number;

  // Custom properties
  [key: string]: any;
}

export interface ComponentNode {
  id: string;
  type: ComponentType;
  name: string;
  parentId: string | null;
  childIds: string[];
  position: Position;
  size: Size;
  properties: ComponentProperties;
  locked: boolean;
  hidden: boolean;
  createdAt: number;
  updatedAt: number;
}

// ============================================================================
// Canvas State
// ============================================================================

export interface ComponentsMap {
  byId: Record<string, ComponentNode>;
  allIds: string[];
  rootIds: string[]; // Top-level components
}

export interface CanvasState {
  components: ComponentsMap;
  activePageId: string | null;
}

// ============================================================================
// Selection State
// ============================================================================

export interface SelectionState {
  selectedIds: string[];
  hoveredId: string | null;
  focusedId: string | null;
}

// ============================================================================
// Clipboard State
// ============================================================================

export type ClipboardOperation = 'copy' | 'cut';

export interface ClipboardState {
  copiedComponents: ComponentNode[];
  operation: ClipboardOperation | null;
}

// ============================================================================
// History State
// ============================================================================

export interface StateSnapshot {
  id: string;
  timestamp: number;
  canvas: CanvasState;
  selection: SelectionState;
  properties: PropertiesState;
  actionType: string;
  actionPayload?: any;
}

export interface HistoryState {
  past: StateSnapshot[];
  future: StateSnapshot[];
  maxSnapshots: number;
}

// ============================================================================
// Preview State
// ============================================================================

export type DeviceType = 'desktop' | 'tablet' | 'mobile';

export interface Viewport {
  width: number;
  height: number;
  device: DeviceType;
}

export interface PreviewState {
  isPreviewMode: boolean;
  viewport: Viewport;
}

// ============================================================================
// Workflow State (Multi-page)
// ============================================================================

export interface PageNode {
  id: string;
  name: string;
  canvasState: CanvasState;
  route: string;
  metadata: {
    title: string;
    description?: string;
    keywords?: string[];
  };
  createdAt: number;
  updatedAt: number;
}

export interface PagesMap {
  byId: Record<string, PageNode>;
  allIds: string[];
}

export interface WorkflowState {
  pages: PagesMap;
  currentPageId: string | null;
  workflowId: string | null;
}

// ============================================================================
// Properties State
// ============================================================================

export interface PropertiesState {
  componentProperties: Record<string, ComponentProperties>;
}

// ============================================================================
// User Preferences
// ============================================================================

export interface PreferencesState {
  theme: 'light' | 'dark';
  autoSave: boolean;
  autoSaveInterval: number; // in seconds
  snapToGrid: boolean;
  gridSize: number;
  showRulers: boolean;
  showGuides: boolean;
  showGrid: boolean;
  zoomLevel: number;
}

// ============================================================================
// Collaboration State
// ============================================================================

export interface CursorPosition {
  x: number;
  y: number;
  componentId?: string;
}

export interface CollaborationUser {
  id: string;
  name: string;
  email: string;
  color: string;
  cursor: CursorPosition | null;
  lastActive: number;
}

export interface CollaborationState {
  activeUsers: CollaborationUser[];
  cursors: Record<string, CursorPosition>; // userId -> cursor position
  locks: Record<string, string>; // componentId -> userId
  isConnected: boolean;
  sessionId: string | null;
}

// ============================================================================
// Complete Store State
// ============================================================================

export interface PageBuilderState {
  canvas: CanvasState;
  selection: SelectionState;
  clipboard: ClipboardState;
  history: HistoryState;
  preview: PreviewState;
  workflow: WorkflowState;
  properties: PropertiesState;
  preferences: PreferencesState;
  collaboration: CollaborationState;
}

// ============================================================================
// Action Types
// ============================================================================

export interface CanvasActions {
  addComponent: (component: Omit<ComponentNode, 'id' | 'createdAt' | 'updatedAt'>) => string;
  removeComponent: (componentId: string) => void;
  updateComponent: (componentId: string, updates: Partial<ComponentNode>) => void;
  moveComponent: (componentId: string, newParentId: string | null, index?: number) => void;
  duplicateComponent: (componentId: string) => string | null;
  clearCanvas: () => void;
  setActivePageId: (pageId: string | null) => void;
}

export interface SelectionActions {
  select: (componentId: string, multiSelect?: boolean) => void;
  deselect: (componentId: string) => void;
  selectMultiple: (componentIds: string[]) => void;
  clearSelection: () => void;
  setHovered: (componentId: string | null) => void;
  setFocused: (componentId: string | null) => void;
}

export interface ClipboardActions {
  copy: (componentIds: string[]) => void;
  cut: (componentIds: string[]) => void;
  paste: (targetParentId?: string | null) => string[];
  clearClipboard: () => void;
}

export interface HistoryActions {
  undo: () => void;
  redo: () => void;
  clearHistory: () => void;
  takeSnapshot: (actionType: string, actionPayload?: any) => void;
}

export interface PreviewActions {
  togglePreview: () => void;
  setPreviewMode: (isPreview: boolean) => void;
  setViewport: (viewport: Partial<Viewport>) => void;
  setDevice: (device: DeviceType) => void;
}

export interface WorkflowActions {
  addPage: (page: Omit<PageNode, 'id' | 'createdAt' | 'updatedAt'>) => string;
  removePage: (pageId: string) => void;
  updatePage: (pageId: string, updates: Partial<PageNode>) => void;
  setCurrentPage: (pageId: string | null) => void;
  reorderPages: (pageIds: string[]) => void;
}

export interface PropertiesActions {
  updateProperty: (componentId: string, propertyKey: string, value: any) => void;
  updateProperties: (componentId: string, properties: Partial<ComponentProperties>) => void;
  resetProperties: (componentId: string) => void;
}

export interface PreferencesActions {
  updatePreference: <K extends keyof PreferencesState>(
    key: K,
    value: PreferencesState[K]
  ) => void;
  resetPreferences: () => void;
}

export interface CollaborationActions {
  joinSession: (sessionId: string, user: Omit<CollaborationUser, 'lastActive'>) => void;
  leaveSession: () => void;
  updateCursor: (userId: string, cursor: CursorPosition | null) => void;
  lockComponent: (componentId: string, userId: string) => void;
  unlockComponent: (componentId: string) => void;
  setConnectionStatus: (isConnected: boolean) => void;
  updateActiveUsers: (users: CollaborationUser[]) => void;
}

// ============================================================================
// Combined Store Type
// ============================================================================

export type PageBuilderStore = PageBuilderState &
  CanvasActions &
  SelectionActions &
  ClipboardActions &
  HistoryActions &
  PreviewActions &
  WorkflowActions &
  PropertiesActions &
  PreferencesActions &
  CollaborationActions;
