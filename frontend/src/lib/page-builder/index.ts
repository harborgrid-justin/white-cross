/**
 * Page Builder Library - Main Export
 *
 * Central export point for the page builder component library
 */

// Core types
export * from './types/component.types';
export * from './types/catalog.types';
export * from './types/property.types';
export * from './types/adapter.types';
export * from './types/variant.types';
export * from './types/composition.types';

// Component definitions
export * from './definitions/ui-components.definitions';
export * from './components';

// Adapters
export { ButtonAdapter, ButtonDefinition } from './adapters/Button.adapter';
export { BadgeAdapter, BadgeDefinition } from './adapters/Badge.adapter';
export {
  CardAdapter,
  CardHeaderAdapter,
  CardTitleAdapter,
  CardDescriptionAdapter,
  CardContentAdapter,
  CardFooterAdapter,
  CardDefinitions,
} from './adapters/Card.adapter';
export {
  AlertAdapter,
  AlertTitleAdapter,
  AlertDescriptionAdapter,
  AlertDefinitions,
} from './adapters/Alert.adapter';
export { SeparatorAdapter, SeparatorDefinition } from './adapters/Separator.adapter';

// Utilities
export { createAdapter } from './utils/createAdapter';
export * from './utils/composition';
export * from './utils/variantHelpers';

// Palette components
export { ComponentPalette } from './palette/ComponentPalette';
export { VariantPicker, MultiVariantPicker } from './palette/VariantPicker';

// Registry
export {
  ComponentCatalogRegistry,
  globalRegistry,
  getGlobalRegistry,
} from './catalog/registry';
