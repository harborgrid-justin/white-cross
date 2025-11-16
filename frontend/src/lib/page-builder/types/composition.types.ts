/**
 * Composition Pattern Type Definitions
 *
 * Types for component composition patterns in the page builder
 */

import { ComponentType, ReactNode, ReactElement } from 'react';
import { ComponentDefinition, ComponentInstance } from './component.types';
import { PageBuilderAdapter } from './adapter.types';

/**
 * Slot-based composition
 */
export interface SlotConfig {
  /** Slot name */
  name: string;

  /** Slot label for builder UI */
  label: string;

  /** Description */
  description?: string;

  /** Whether slot is required */
  required?: boolean;

  /** Allowed component types in this slot */
  allowedComponents?: string[];

  /** Default component for slot */
  defaultComponent?: string;

  /** Maximum number of components in slot */
  maxComponents?: number;

  /** Minimum number of components in slot */
  minComponents?: number;
}

/**
 * Component with slots
 */
export interface SlottedComponent {
  /** Component definition */
  definition: ComponentDefinition;

  /** Available slots */
  slots: SlotConfig[];

  /** Render function with slots */
  render: (props: any, slots: Record<string, ReactNode>) => ReactElement;
}

/**
 * HOC (Higher-Order Component) configuration
 */
export interface HOCConfig<P = any> {
  /** HOC name */
  name: string;

  /** Description */
  description?: string;

  /** Props added by the HOC */
  addedProps?: string[];

  /** Props transformed by the HOC */
  transformedProps?: string[];

  /** The HOC function */
  hoc: (Component: ComponentType<P>) => ComponentType<P>;
}

/**
 * Render prop configuration
 */
export interface RenderPropConfig {
  /** Prop name that accepts render function */
  propName: string;

  /** Arguments passed to render function */
  args: Array<{
    name: string;
    type: string;
    description?: string;
  }>;

  /** Default render function */
  defaultRender?: (...args: any[]) => ReactNode;
}

/**
 * Compound component configuration
 */
export interface CompoundComponentConfig<
  T extends Record<string, ComponentType<any>> = Record<string, ComponentType<any>>
> {
  /** Root component */
  Root: {
    component: ComponentType<any>;
    definition: ComponentDefinition;
  };

  /** Sub-components */
  components: {
    [K in keyof T]: {
      component: T[K];
      definition: ComponentDefinition;
      /** Parent component (for nesting rules) */
      parent?: string;
      /** Whether this is required */
      required?: boolean;
    };
  };

  /** Default composition */
  defaultComposition?: ComponentInstance[];
}

/**
 * Provider pattern configuration
 */
export interface ProviderConfig {
  /** Provider component */
  Provider: ComponentType<any>;

  /** Consumer component or hook */
  Consumer: ComponentType<any> | (() => any);

  /** Context value type */
  contextValue: any;

  /** Default context value */
  defaultValue?: any;
}

/**
 * Composition utilities
 */
export interface CompositionUtilities {
  /** Create a slotted component */
  createSlottedComponent: (config: SlotConfig[]) => SlottedComponent;

  /** Create a compound component */
  createCompoundComponent: <T extends Record<string, ComponentType<any>>>(
    config: CompoundComponentConfig<T>
  ) => {
    Root: PageBuilderAdapter;
    [K in keyof T]: PageBuilderAdapter;
  };

  /** Create a provider-based component */
  createProviderComponent: (
    config: ProviderConfig
  ) => PageBuilderAdapter;

  /** Wrap component with HOCs */
  withHOCs: <P>(
    Component: ComponentType<P>,
    hocs: HOCConfig[]
  ) => ComponentType<P>;
}

/**
 * Component template (pre-configured composition)
 */
export interface ComponentTemplate {
  /** Template ID */
  id: string;

  /** Template name */
  name: string;

  /** Description */
  description?: string;

  /** Category */
  category: string;

  /** Thumbnail */
  thumbnail?: string;

  /** Component instances in template */
  components: ComponentInstance[];

  /** Default props for the template */
  defaultProps?: Record<string, any>;

  /** Tags */
  tags?: string[];
}

/**
 * Layout pattern (common layouts)
 */
export interface LayoutPattern {
  /** Pattern ID */
  id: string;

  /** Pattern name */
  name: string;

  /** Description */
  description?: string;

  /** Pattern type */
  type: 'grid' | 'flex' | 'stack' | 'sidebar' | 'header-footer' | 'custom';

  /** Configuration */
  config: {
    /** Number of sections */
    sections: number;

    /** Section proportions */
    proportions?: number[];

    /** Gap between sections */
    gap?: string;

    /** Responsive behavior */
    responsive?: {
      mobile?: string;
      tablet?: string;
      desktop?: string;
    };
  };

  /** Template for the pattern */
  template: ComponentInstance[];
}

/**
 * Composition validator
 */
export interface CompositionValidator {
  /** Validate component hierarchy */
  validateHierarchy: (
    parent: ComponentInstance,
    children: ComponentInstance[]
  ) => {
    valid: boolean;
    errors: Array<{
      childId: string;
      message: string;
    }>;
  };

  /** Validate slot usage */
  validateSlots: (
    component: ComponentInstance,
    slots: Record<string, ReactNode>
  ) => {
    valid: boolean;
    errors: Array<{
      slotName: string;
      message: string;
    }>;
  };

  /** Check if component can be nested */
  canNest: (
    parentId: string,
    childId: string,
    definitions: Map<string, ComponentDefinition>
  ) => boolean;
}

/**
 * Composition helpers
 */
export interface CompositionHelpers {
  /** Find all children of a component */
  findChildren: (
    parentId: string,
    instances: ComponentInstance[]
  ) => ComponentInstance[];

  /** Find parent of a component */
  findParent: (
    childId: string,
    instances: ComponentInstance[]
  ) => ComponentInstance | undefined;

  /** Get component depth in tree */
  getDepth: (
    componentId: string,
    instances: ComponentInstance[]
  ) => number;

  /** Flatten component tree */
  flattenTree: (instances: ComponentInstance[]) => ComponentInstance[];

  /** Build component tree */
  buildTree: (instances: ComponentInstance[]) => ComponentInstance[];
}

/**
 * Dynamic composition (runtime composition)
 */
export interface DynamicComposition {
  /** Add component to composition */
  addComponent: (
    parent: ComponentInstance,
    component: ComponentInstance,
    position?: number
  ) => ComponentInstance[];

  /** Remove component from composition */
  removeComponent: (
    componentId: string,
    instances: ComponentInstance[]
  ) => ComponentInstance[];

  /** Move component in composition */
  moveComponent: (
    componentId: string,
    newParentId: string,
    position: number,
    instances: ComponentInstance[]
  ) => ComponentInstance[];

  /** Clone component */
  cloneComponent: (
    componentId: string,
    instances: ComponentInstance[]
  ) => ComponentInstance;
}
