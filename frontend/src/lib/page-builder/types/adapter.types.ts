/**
 * Adapter Type Definitions
 *
 * Generic types for adapting UI components to the page builder system
 */

import { ComponentType, ReactNode } from 'react';
import { ComponentDefinition, ComponentInstance } from './component.types';

/**
 * Base adapter configuration
 */
export interface AdapterConfig<UIProps = any, BuilderProps = any> {
  /** Transform builder props to UI component props */
  transformProps: (props: BuilderProps, context: BuilderContext) => UIProps;

  /** Transform builder events to UI component events */
  transformEvents?: (
    events: ComponentInstance['events'],
    context: BuilderContext
  ) => Partial<UIProps>;

  /** Validate props before rendering */
  validateProps?: (props: BuilderProps) => PropValidationResult;

  /** Default props for the adapter */
  defaults?: Partial<BuilderProps>;
}

/**
 * Context provided to adapters
 */
export interface BuilderContext {
  /** Current page state */
  pageState: Record<string, any>;

  /** Update page state */
  updateState: (updates: Record<string, any>) => void;

  /** Navigate to a route */
  navigate: (path: string) => void;

  /** Execute an action */
  executeAction: (action: any) => Promise<void>;

  /** Component registry for lookups */
  registry: any;

  /** Environment (builder vs. preview vs. production) */
  environment: 'builder' | 'preview' | 'production';
}

/**
 * Prop validation result
 */
export interface PropValidationResult {
  valid: boolean;
  errors: Array<{
    prop: string;
    message: string;
    severity: 'error' | 'warning';
  }>;
}

/**
 * Generic page builder adapter
 */
export interface PageBuilderAdapter<
  UIProps = Record<string, any>,
  BuilderProps = Record<string, any>
> {
  /** Component definition metadata */
  definition: ComponentDefinition;

  /** Adapter configuration */
  config: AdapterConfig<UIProps, BuilderProps>;

  /** The wrapped UI component */
  UIComponent: ComponentType<UIProps>;

  /** The adapter component */
  Component: ComponentType<PageBuilderAdapterProps<BuilderProps>>;
}

/**
 * Props for adapter components
 */
export interface PageBuilderAdapterProps<P = Record<string, any>> {
  /** Component instance data from builder */
  instance: ComponentInstance;

  /** Builder context */
  context: BuilderContext;

  /** Props from component instance */
  props: P;

  /** Children components */
  children?: ReactNode;
}

/**
 * Adapter factory function type
 */
export type AdapterFactory<
  UIProps = Record<string, any>,
  BuilderProps = Record<string, any>
> = (
  UIComponent: ComponentType<UIProps>,
  definition: ComponentDefinition,
  config?: Partial<AdapterConfig<UIProps, BuilderProps>>
) => PageBuilderAdapter<UIProps, BuilderProps>;

/**
 * Compound component adapter
 */
export interface CompoundAdapter<
  T extends Record<string, ComponentType<any>> = Record<string, ComponentType<any>>
> {
  /** Root component definition */
  rootDefinition: ComponentDefinition;

  /** Sub-component definitions */
  subDefinitions: {
    [K in keyof T]: ComponentDefinition;
  };

  /** Root adapter */
  Root: PageBuilderAdapter;

  /** Sub-component adapters */
  subAdapters: {
    [K in keyof T]: PageBuilderAdapter;
  };
}

/**
 * Data-bound adapter for components that display dynamic data
 */
export interface DataBoundAdapter<
  UIProps = Record<string, any>,
  BuilderProps = Record<string, any>,
  DataType = any
> extends PageBuilderAdapter<UIProps, BuilderProps> {
  /** Data transformation function */
  transformData: (data: DataType, config: any) => any;

  /** Data fetching configuration */
  dataConfig?: {
    source: 'api' | 'state' | 'props' | 'context';
    path: string;
    transform?: (data: any) => DataType;
  };
}

/**
 * Event adapter utilities
 */
export interface EventAdapter {
  /** Transform builder event to React event handler */
  toReactHandler: (
    builderEvent: ComponentInstance['events'],
    context: BuilderContext
  ) => Record<string, (e: any) => void>;

  /** Extract event handlers from component instance */
  extractHandlers: (instance: ComponentInstance) => Record<string, Function>;
}

/**
 * Style adapter utilities
 */
export interface StyleAdapter {
  /** Transform builder styles to className */
  toClassName: (styleConfig: ComponentInstance['style']) => string;

  /** Transform builder styles to inline styles */
  toInlineStyles: (styleConfig: ComponentInstance['style']) => React.CSSProperties;

  /** Merge builder styles with component styles */
  mergeStyles: (
    builderStyles: ComponentInstance['style'],
    componentClassName?: string
  ) => string;
}

/**
 * Accessibility adapter utilities
 */
export interface AccessibilityAdapter {
  /** Transform accessibility config to ARIA props */
  toAriaProps: (config: ComponentInstance['accessibility']) => Record<string, any>;

  /** Validate accessibility requirements */
  validate: (
    instance: ComponentInstance,
    definition: ComponentDefinition
  ) => PropValidationResult;
}

/**
 * Conditional rendering adapter
 */
export interface ConditionalAdapter {
  /** Evaluate visibility condition */
  shouldRender: (
    condition: string | undefined,
    context: BuilderContext
  ) => boolean;

  /** Evaluate enabled condition */
  shouldEnable: (
    condition: string | undefined,
    context: BuilderContext
  ) => boolean;
}

/**
 * Helper type to extract UI component props from adapter
 */
export type UIComponentProps<T> = T extends PageBuilderAdapter<infer P, any>
  ? P
  : never;

/**
 * Helper type to extract builder props from adapter
 */
export type BuilderComponentProps<T> = T extends PageBuilderAdapter<any, infer P>
  ? P
  : never;
