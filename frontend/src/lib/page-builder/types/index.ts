/**
 * Page Builder Type Definitions
 *
 * Central export point for all page builder types
 */

// Component types
export type {
  ComponentRenderMode,
  ComponentCategory,
  Breakpoint,
  ResponsiveValue,
  DataBindingSource,
  DataBinding,
  EventActionType,
  EventAction,
  EventHandler,
  ValidationType,
  ValidationRule,
  AccessibilityConfig,
  StyleConfig,
  ComponentInstance,
  ComponentDefinition,
  ComponentGroup,
  ComponentTemplate,
} from './component.types';

// Property types
export type {
  PropertyControlType,
  PropertyType,
  BasePropertyDefinition,
  TextPropertyDefinition,
  NumberPropertyDefinition,
  BooleanPropertyDefinition,
  SelectOption,
  SelectPropertyDefinition,
  ColorPropertyDefinition,
  DatePropertyDefinition,
  ImagePropertyDefinition,
  IconPropertyDefinition,
  AlignmentPropertyDefinition,
  SpacingPropertyDefinition,
  TypographyPropertyDefinition,
  BorderPropertyDefinition,
  ShadowPropertyDefinition,
  GradientPropertyDefinition,
  ObjectPropertyDefinition,
  ArrayPropertyDefinition,
  DataBindingPropertyDefinition,
  EventHandlerPropertyDefinition,
  ComponentPropertyDefinition,
  PropertyDefinition,
  PropertyGroup,
  PropertyPreset,
} from './property.types';

// Catalog types
export type {
  ComponentCatalog,
  CatalogFilter,
  CatalogSortBy,
  CatalogSort,
  ComponentUsageStats,
  ComponentSearchResult,
  CatalogViewConfig,
  ComponentLibraryMetadata,
  CustomComponentRegistration,
  MarketplaceComponent,
  ComponentExport,
  ComponentImportResult,
} from './catalog.types';
