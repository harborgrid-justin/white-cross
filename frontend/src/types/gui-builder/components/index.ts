/**
 * Component Types Module
 *
 * This module provides types for defining, managing, and categorizing
 * draggable components in the GUI builder.
 *
 * @module gui-builder/components
 */

// Categories and classification
export type { ComponentSubcategory, ComponentTaxonomy, ComponentTag } from './categories';

export {
  ComponentCategory,
  ComponentComplexity,
  ComponentMaturity,
  LayoutSubcategories,
  FormSubcategories,
  ComponentTags,
} from './categories';

// Metadata and capabilities
export type {
  ComponentCapabilities,
  ComponentConstraints,
  ComponentDisplay,
  ComponentDocumentation,
  ComponentPerformance,
  ComponentDependencies,
  ComponentMetadata,
} from './metadata';

export { RenderMode, DefaultCapabilities } from './metadata';

// Component definitions
export type {
  SlotDefinition,
  StylePreset,
  EventHandlerDefinition,
  DefaultPropertyValues,
  ComponentStateDefinition,
  ComponentContextDefinition,
  ResponsiveVariant,
  ComponentCodeTemplate,
  ComponentDefinition,
  MinimalComponentDefinition,
  ResolvedComponentDefinition,
} from './definitions';

export { isMinimalDefinition, isResolvedDefinition } from './definitions';

// Registry
export type {
  ComponentFilterOptions,
  ComponentSortOptions,
  PaginationOptions,
  PaginatedResult,
  RegisterComponentOptions,
  RegisterComponentResult,
  RegistryStatistics,
  RegistryChangeEvent,
  RegistryChangeListener,
  ComponentRegistry,
  ComponentRegistryFactory,
} from './registry';
