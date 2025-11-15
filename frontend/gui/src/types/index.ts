/**
 * Next.js Drag-and-Drop GUI Builder - Core Type Definitions
 *
 * This file contains all TypeScript types and interfaces for the page builder.
 * It provides complete type safety for components, properties, state management,
 * and code generation.
 */

// ============================================================================
// COMPONENT TYPES
// ============================================================================

/**
 * Unique identifier for components
 */
export type ComponentId = string;

/**
 * Component categories for organization
 */
export enum ComponentCategory {
  Layout = 'layout',
  Navigation = 'navigation',
  Form = 'form',
  DataDisplay = 'data-display',
  Media = 'media',
  NextJS = 'nextjs',
  Custom = 'custom',
}

/**
 * Render mode for Next.js components
 */
export enum RenderMode {
  Server = 'server',    // Server Component (default)
  Client = 'client',     // Client Component ('use client')
  Hybrid = 'hybrid',     // Can be either
}

/**
 * Component definition in the palette
 */
export interface ComponentDefinition {
  id: ComponentId;
  name: string;
  description: string;
  category: ComponentCategory;
  icon: string;
  renderMode: RenderMode;

  // Default properties when component is added
  defaultProps: Record<string, any>;

  // Property schema for the property editor
  propertySchema: PropertySchema[];

  // Capabilities
  isContainer: boolean;      // Can contain children
  isDraggable: boolean;      // Can be dragged
  isResizable: boolean;      // Can be resized
  isLocked: boolean;         // Initially locked

  // Constraints
  allowedChildren?: ComponentCategory[];
  maxChildren?: number;
  minChildren?: number;

  // Templates
  thumbnail?: string;
  codeTemplate?: string;
}

/**
 * Component instance on the canvas
 */
export interface ComponentInstance {
  id: ComponentId;
  type: string;              // ComponentDefinition.id
  name: string;

  // Hierarchy
  parentId: ComponentId | null;
  childIds: ComponentId[];

  // Layout
  position: { x: number; y: number };
  size: { width: number; height: number };

  // Properties
  properties: Record<string, any>;
  styles: CSSProperties;

  // State
  locked: boolean;
  hidden: boolean;

  // Metadata
  createdAt: string;
  updatedAt: string;
}

/**
 * CSS properties type
 */
export interface CSSProperties {
  // Layout
  display?: string;
  position?: string;
  top?: string | number;
  right?: string | number;
  bottom?: string | number;
  left?: string | number;

  // Box model
  width?: string | number;
  height?: string | number;
  margin?: string;
  padding?: string;

  // Flex/Grid
  flexDirection?: string;
  justifyContent?: string;
  alignItems?: string;
  gap?: string;
  gridTemplateColumns?: string;
  gridTemplateRows?: string;

  // Typography
  fontSize?: string | number;
  fontWeight?: string | number;
  fontFamily?: string;
  lineHeight?: string | number;
  textAlign?: string;
  color?: string;

  // Background
  backgroundColor?: string;
  backgroundImage?: string;
  backgroundSize?: string;
  backgroundPosition?: string;

  // Border
  border?: string;
  borderRadius?: string;

  // Effects
  boxShadow?: string;
  opacity?: number;
  transform?: string;
  transition?: string;

  // Other
  cursor?: string;
  overflow?: string;
  zIndex?: number;

  [key: string]: any;
}

// ============================================================================
// PROPERTY TYPES
// ============================================================================

/**
 * Property value types
 */
export enum PropertyType {
  String = 'string',
  Number = 'number',
  Boolean = 'boolean',
  Select = 'select',
  Color = 'color',
  Image = 'image',
  Icon = 'icon',
  Spacing = 'spacing',
  Typography = 'typography',
  Border = 'border',
  Shadow = 'shadow',
  Gradient = 'gradient',
  Code = 'code',
  JSON = 'json',
  Array = 'array',
  Object = 'object',
}

/**
 * Property control types (how it's edited in UI)
 */
export enum PropertyControlType {
  TextInput = 'text-input',
  NumberInput = 'number-input',
  Textarea = 'textarea',
  Select = 'select',
  Toggle = 'toggle',
  ColorPicker = 'color-picker',
  ImageUpload = 'image-upload',
  IconPicker = 'icon-picker',
  SpacingEditor = 'spacing-editor',
  TypographyEditor = 'typography-editor',
  BorderEditor = 'border-editor',
  ShadowEditor = 'shadow-editor',
  GradientEditor = 'gradient-editor',
  CodeEditor = 'code-editor',
  JsonEditor = 'json-editor',
}

/**
 * Property schema definition
 */
export interface PropertySchema {
  id: string;
  label: string;
  type: PropertyType;
  control: PropertyControlType;

  // Validation
  required?: boolean;
  defaultValue?: any;
  validation?: PropertyValidation;

  // UI
  group?: string;
  placeholder?: string;
  helpText?: string;

  // Conditional visibility
  visibleWhen?: (props: Record<string, any>) => boolean;

  // Options for select/radio
  options?: Array<{ label: string; value: any }>;
}

/**
 * Property validation rules
 */
export interface PropertyValidation {
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => boolean | string;
}

// ============================================================================
// STATE MANAGEMENT TYPES
// ============================================================================

/**
 * Main page builder state
 */
export interface PageBuilderState {
  // Canvas state
  canvas: CanvasState;

  // Selection state
  selection: SelectionState;

  // Clipboard state
  clipboard: ClipboardState;

  // History state (undo/redo)
  history: HistoryState;

  // Preview state
  preview: PreviewState;

  // Workflow state (multi-page)
  workflow: WorkflowState;

  // Properties state
  properties: PropertiesState;

  // Preferences state
  preferences: PreferencesState;
}

/**
 * Canvas state - component hierarchy
 */
export interface CanvasState {
  components: {
    byId: Record<ComponentId, ComponentInstance>;
    allIds: ComponentId[];
    rootIds: ComponentId[];  // Top-level components
  };

  // Viewport
  viewport: {
    zoom: number;
    panX: number;
    panY: number;
  };

  // Grid
  grid: {
    enabled: boolean;
    size: number;
    snapToGrid: boolean;
  };
}

/**
 * Selection state
 */
export interface SelectionState {
  selectedIds: ComponentId[];
  hoveredId: ComponentId | null;
  focusedId: ComponentId | null;
}

/**
 * Clipboard state
 */
export interface ClipboardState {
  operation: 'copy' | 'cut' | null;
  components: ComponentInstance[];
}

/**
 * History state for undo/redo
 */
export interface HistoryState {
  past: CanvasState[];
  future: CanvasState[];
  maxSize: number;
}

/**
 * Preview state
 */
export interface PreviewState {
  isPreviewMode: boolean;
  device: 'desktop' | 'tablet' | 'mobile';
  orientation: 'portrait' | 'landscape';
}

/**
 * Workflow state (multi-page)
 */
export interface WorkflowState {
  pages: Array<{
    id: string;
    name: string;
    path: string;
    canvasState: CanvasState;
  }>;
  currentPageId: string;
}

/**
 * Properties state
 */
export interface PropertiesState {
  isPanelOpen: boolean;
  activeTab: 'properties' | 'styles' | 'events';
}

/**
 * User preferences
 */
export interface PreferencesState {
  theme: 'light' | 'dark' | 'system';
  autoSave: boolean;
  autoSaveInterval: number;  // seconds
  showGrid: boolean;
  snapToGrid: boolean;
  gridSize: number;
  zoom: number;
}

// ============================================================================
// CODE GENERATION TYPES
// ============================================================================

/**
 * Generated code output
 */
export interface GeneratedCode {
  type: 'page' | 'component' | 'action' | 'type' | 'route';
  path: string;
  content: string;
  language: 'typescript' | 'javascript' | 'tsx' | 'jsx';
}

/**
 * Code generation options
 */
export interface CodeGenerationOptions {
  useTypeScript: boolean;
  useServerComponents: boolean;
  useTailwind: boolean;
  prettier: boolean;
  eslint: boolean;
}

/**
 * Next.js page configuration
 */
export interface NextJSPageConfig {
  title: string;
  description: string;
  path: string;

  // Metadata
  metadata: {
    title: string;
    description: string;
    openGraph?: {
      title: string;
      description: string;
      images: string[];
    };
  };

  // Data fetching
  dataFetching?: {
    type: 'static' | 'dynamic' | 'isr';
    revalidate?: number;
  };

  // Components
  components: ComponentInstance[];
}

// ============================================================================
// TEMPLATE TYPES
// ============================================================================

/**
 * Page template
 */
export interface PageTemplate {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  category: string;
  tags: string[];

  // Template data
  config: NextJSPageConfig;

  // Metadata
  author: string;
  createdAt: string;
  downloads: number;
  rating: number;
}

// ============================================================================
// EXPORT TYPES
// ============================================================================

/**
 * Project export format
 */
export interface ProjectExport {
  version: string;
  name: string;
  description: string;

  // Pages
  pages: NextJSPageConfig[];

  // Assets
  assets: Array<{
    id: string;
    name: string;
    type: string;
    url: string;
    data?: string; // Base64 for small assets
  }>;

  // Settings
  settings: {
    theme: any;
    fonts: string[];
    plugins: string[];
  };

  // Metadata
  exportedAt: string;
  exportedBy: string;
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

/**
 * Deep readonly type
 */
export type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};

/**
 * Partial deep type
 */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

/**
 * Result type for operations
 */
export type Result<T, E = Error> =
  | { success: true; data: T }
  | { success: false; error: E };
