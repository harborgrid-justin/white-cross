/**
 * Core component type definitions for Next.js Page Builder
 *
 * This file defines the fundamental types for components that can be used
 * in the drag-and-drop page builder, including metadata, configuration,
 * and runtime behavior.
 */

import { ReactNode, ComponentType } from 'react';

/**
 * Component rendering mode for Next.js App Router
 */
export type ComponentRenderMode = 'client' | 'server' | 'hybrid';

/**
 * Component category for organization in the builder
 */
export type ComponentCategory =
  | 'layout'
  | 'navigation'
  | 'form'
  | 'data-display'
  | 'media'
  | 'nextjs'
  | 'custom';

/**
 * Responsive breakpoint identifiers
 */
export type Breakpoint = 'mobile' | 'tablet' | 'desktop' | 'wide';

/**
 * Responsive value that can vary by breakpoint
 */
export type ResponsiveValue<T> = T | Partial<Record<Breakpoint, T>>;

/**
 * Data binding source types
 */
export type DataBindingSource =
  | 'state'
  | 'props'
  | 'context'
  | 'api'
  | 'url'
  | 'localStorage'
  | 'computed';

/**
 * Data binding configuration
 */
export interface DataBinding {
  source: DataBindingSource;
  path: string;
  transform?: string; // JavaScript expression to transform the value
  fallback?: unknown;
}

/**
 * Event handler action types
 */
export type EventActionType =
  | 'navigate'
  | 'setState'
  | 'apiCall'
  | 'openModal'
  | 'closeModal'
  | 'showNotification'
  | 'customScript';

/**
 * Event handler action configuration
 */
export interface EventAction {
  type: EventActionType;
  params: Record<string, unknown>;
  condition?: string; // JavaScript expression that must be true to execute
}

/**
 * Event handler configuration
 */
export interface EventHandler {
  event: string; // e.g., 'onClick', 'onChange', 'onSubmit'
  actions: EventAction[];
  preventDefault?: boolean;
  stopPropagation?: boolean;
}

/**
 * Validation rule types
 */
export type ValidationType =
  | 'required'
  | 'minLength'
  | 'maxLength'
  | 'pattern'
  | 'email'
  | 'url'
  | 'number'
  | 'min'
  | 'max'
  | 'custom';

/**
 * Validation rule configuration
 */
export interface ValidationRule {
  type: ValidationType;
  value?: unknown;
  message?: string;
  customValidator?: string; // JavaScript expression
}

/**
 * Accessibility configuration
 */
export interface AccessibilityConfig {
  ariaLabel?: string;
  ariaDescribedBy?: string;
  ariaLabelledBy?: string;
  role?: string;
  tabIndex?: number;
  keyboardShortcut?: string;
  screenReaderOnly?: boolean;
}

/**
 * Style configuration options
 */
export interface StyleConfig {
  className?: string;
  style?: Record<string, string | number>;
  variant?: string;
  size?: string;
  color?: string;
  spacing?: ResponsiveValue<{
    margin?: string;
    padding?: string;
    gap?: string;
  }>;
  layout?: ResponsiveValue<{
    display?: string;
    width?: string;
    height?: string;
    minWidth?: string;
    maxWidth?: string;
    minHeight?: string;
    maxHeight?: string;
  }>;
  flexbox?: ResponsiveValue<{
    direction?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
    wrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
    alignItems?: 'start' | 'center' | 'end' | 'stretch' | 'baseline';
    justifyContent?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
    alignContent?: 'start' | 'center' | 'end' | 'between' | 'around' | 'stretch';
  }>;
  grid?: ResponsiveValue<{
    columns?: number | string;
    rows?: number | string;
    gap?: string;
    columnGap?: string;
    rowGap?: string;
    autoFlow?: 'row' | 'column' | 'dense' | 'row-dense' | 'column-dense';
  }>;
  typography?: {
    fontSize?: string;
    fontWeight?: string;
    lineHeight?: string;
    textAlign?: 'left' | 'center' | 'right' | 'justify';
    textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
  };
  border?: {
    width?: string;
    style?: string;
    color?: string;
    radius?: string;
  };
  shadow?: string;
  background?: string;
  transition?: string;
}

/**
 * Component instance in the builder
 */
export interface ComponentInstance {
  id: string;
  componentId: string; // Reference to ComponentDefinition
  props: Record<string, unknown>;
  style: StyleConfig;
  children?: ComponentInstance[];
  events?: EventHandler[];
  dataBindings?: Record<string, DataBinding>;
  accessibility?: AccessibilityConfig;
  conditions?: {
    visible?: string; // JavaScript expression
    enabled?: string; // JavaScript expression
  };
}

/**
 * Component definition metadata
 */
export interface ComponentDefinition {
  // Identification
  id: string;
  name: string;
  displayName: string;
  description: string;
  category: ComponentCategory;
  icon?: string; // Icon name or SVG
  tags?: string[];

  // Rendering
  renderMode: ComponentRenderMode;
  component?: ComponentType<any>; // Actual React component (lazy loaded)
  componentPath?: string; // Path to component for lazy loading

  // Configuration
  props: PropertyDefinition[];
  defaultProps?: Record<string, unknown>;
  requiredProps?: string[];

  // Children
  acceptsChildren?: boolean;
  childrenTypes?: string[]; // Allowed child component IDs
  maxChildren?: number;
  minChildren?: number;

  // Styling
  styleOptions?: {
    variants?: Array<{
      name: string;
      label: string;
      values: Array<{ value: string; label: string }>;
    }>;
    supportsResponsive?: boolean;
    supportsCustomCSS?: boolean;
  };

  // Events
  events?: Array<{
    name: string;
    label: string;
    description?: string;
    payloadSchema?: Record<string, unknown>;
  }>;

  // Data
  dataBindings?: Array<{
    prop: string;
    label: string;
    supportedSources: DataBindingSource[];
  }>;

  // Accessibility
  accessibility?: {
    defaultAriaLabel?: string;
    requiredAriaAttributes?: string[];
    keyboardNavigable?: boolean;
  };

  // Preview
  previewProps?: Record<string, unknown>;
  thumbnail?: string;

  // Metadata
  version?: string;
  deprecated?: boolean;
  deprecationMessage?: string;
  customizable?: boolean;
}

/**
 * Component group for organization
 */
export interface ComponentGroup {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  components: string[]; // Component IDs
  order?: number;
}

/**
 * Component template (pre-configured component combinations)
 */
export interface ComponentTemplate {
  id: string;
  name: string;
  description?: string;
  category: ComponentCategory;
  thumbnail?: string;
  components: ComponentInstance[];
  tags?: string[];
}
