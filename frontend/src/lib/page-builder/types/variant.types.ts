/**
 * Variant Type Definitions
 *
 * Types for handling component variants in the page builder
 */

import { VariantProps as CVAVariantProps } from 'class-variance-authority';

/**
 * Variant value definition for builder UI
 */
export interface VariantValue {
  /** Variant value (e.g., 'primary', 'lg') */
  value: string;

  /** Human-readable label */
  label: string;

  /** Optional icon name */
  icon?: string;

  /** Optional preview/description */
  description?: string;

  /** Whether this is the default value */
  isDefault?: boolean;

  /** Optional preview image */
  preview?: string;
}

/**
 * Variant configuration for a component
 */
export interface VariantConfig {
  /** Variant name (e.g., 'variant', 'size') */
  name: string;

  /** Human-readable label */
  label: string;

  /** Description of the variant */
  description?: string;

  /** Possible values */
  values: VariantValue[];

  /** Default value */
  defaultValue?: string;

  /** Whether multiple values can be selected */
  multiSelect?: boolean;

  /** Grouping for related variants */
  group?: string;
}

/**
 * Complete variant system for a component
 */
export interface VariantSystem {
  /** All variant configurations */
  variants: VariantConfig[];

  /** Default variant values */
  defaults: Record<string, string>;

  /** Variant groups for organization */
  groups?: Array<{
    id: string;
    label: string;
    variants: string[];
  }>;
}

/**
 * Extract CVA variants and convert to variant system
 */
export type ExtractVariants<T> = T extends (...args: any) => any
  ? CVAVariantProps<T>
  : never;

/**
 * Variant mapping from CVA to page builder
 */
export interface VariantMapping<CVAVariants = any> {
  /** CVA variant name */
  cvaName: keyof CVAVariants;

  /** Page builder variant name (may differ) */
  builderName: string;

  /** Value transformation (if needed) */
  transform?: (value: any) => any;

  /** Reverse transformation for reading */
  reverseTransform?: (value: any) => any;
}

/**
 * Variant preset (saved variant combinations)
 */
export interface VariantPreset {
  /** Preset ID */
  id: string;

  /** Preset name */
  name: string;

  /** Description */
  description?: string;

  /** Component ID this preset is for */
  componentId: string;

  /** Variant values */
  variants: Record<string, string>;

  /** Optional thumbnail */
  thumbnail?: string;

  /** Tags for organization */
  tags?: string[];

  /** Whether this is a system preset */
  isSystem?: boolean;
}

/**
 * Variant picker UI state
 */
export interface VariantPickerState {
  /** Currently selected variant values */
  selectedValues: Record<string, string>;

  /** Available variants for current component */
  availableVariants: VariantConfig[];

  /** Whether picker is expanded */
  isExpanded: boolean;

  /** Current filter/search */
  searchQuery?: string;

  /** Preview mode */
  previewMode: 'compact' | 'expanded' | 'grid';
}

/**
 * Variant helper utilities type
 */
export interface VariantHelpers {
  /** Get default values for a variant system */
  getDefaults: (system: VariantSystem) => Record<string, string>;

  /** Validate variant values */
  validate: (
    values: Record<string, string>,
    system: VariantSystem
  ) => { valid: boolean; errors: string[] };

  /** Merge variant values with defaults */
  mergeWithDefaults: (
    values: Record<string, string>,
    system: VariantSystem
  ) => Record<string, string>;

  /** Convert CVA variants to variant system */
  fromCVA: <T>(
    cvaFn: T,
    metadata: {
      labels: Record<string, string>;
      descriptions?: Record<string, string>;
    }
  ) => VariantSystem;

  /** Convert variant system to CVA props */
  toCVA: (
    values: Record<string, string>,
    mapping?: VariantMapping[]
  ) => Record<string, any>;
}

/**
 * Responsive variant value
 */
export interface ResponsiveVariantValue<T = string> {
  /** Base value */
  base: T;

  /** Mobile override */
  mobile?: T;

  /** Tablet override */
  tablet?: T;

  /** Desktop override */
  desktop?: T;

  /** Wide screen override */
  wide?: T;
}

/**
 * Conditional variant (variant depends on state/props)
 */
export interface ConditionalVariant {
  /** Variant name */
  variant: string;

  /** Condition expression */
  condition: string;

  /** Value if condition is true */
  trueValue: string;

  /** Value if condition is false */
  falseValue: string;
}

/**
 * Variant animation configuration
 */
export interface VariantAnimation {
  /** Enable animation between variants */
  enabled: boolean;

  /** Animation duration (ms) */
  duration?: number;

  /** Animation easing */
  easing?: string;

  /** Properties to animate */
  properties?: string[];
}

/**
 * Helper type for type-safe variant selection
 */
export type TypedVariantValues<T extends VariantSystem> = {
  [K in T['variants'][number]['name']]: string;
};
