/**
 * Variant Helper Utilities
 *
 * Utilities for working with component variants
 */

import { VariantSystem, VariantConfig, VariantHelpers } from '../types/variant.types';

/**
 * Get default values from a variant system
 */
export function getDefaultVariantValues(system: VariantSystem): Record<string, string> {
  return system.defaults || {};
}

/**
 * Validate variant values against a variant system
 */
export function validateVariantValues(
  values: Record<string, string>,
  system: VariantSystem
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  for (const variant of system.variants) {
    const value = values[variant.name];

    // Check if value is in allowed values
    if (value && !variant.values.some((v) => v.value === value)) {
      errors.push(
        `Invalid value '${value}' for variant '${variant.name}'. Allowed values: ${variant.values
          .map((v) => v.value)
          .join(', ')}`
      );
    }

    // Check multi-select
    if (variant.multiSelect && typeof value === 'string') {
      const multiValues = value.split(',');
      for (const mv of multiValues) {
        if (!variant.values.some((v) => v.value === mv.trim())) {
          errors.push(
            `Invalid multi-select value '${mv.trim()}' for variant '${variant.name}'`
          );
        }
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Merge variant values with defaults
 */
export function mergeVariantValues(
  values: Record<string, string>,
  system: VariantSystem
): Record<string, string> {
  const defaults = getDefaultVariantValues(system);
  return { ...defaults, ...values };
}

/**
 * Convert CVA variant function to variant system
 */
export function cvaToVariantSystem<T>(
  cvaVariants: any,
  metadata: {
    labels: Record<string, string>;
    descriptions?: Record<string, string>;
  }
): VariantSystem {
  const variants: VariantConfig[] = [];
  const defaults: Record<string, string> = {};

  // This is a simplified conversion - in practice, you'd need to
  // extract variant metadata from the CVA function
  const variantNames = Object.keys(metadata.labels);

  for (const variantName of variantNames) {
    const values = cvaVariants.variants?.[variantName] || {};
    const variantValues = Object.keys(values).map((value) => ({
      value,
      label: value.charAt(0).toUpperCase() + value.slice(1),
    }));

    variants.push({
      name: variantName,
      label: metadata.labels[variantName],
      description: metadata.descriptions?.[variantName],
      values: variantValues,
      defaultValue: cvaVariants.defaultVariants?.[variantName],
    });

    if (cvaVariants.defaultVariants?.[variantName]) {
      defaults[variantName] = cvaVariants.defaultVariants[variantName];
    }
  }

  return {
    variants,
    defaults,
  };
}

/**
 * Convert variant system to CVA props
 */
export function variantSystemToCVA(
  values: Record<string, string>,
  mapping?: Array<{ cvaName: string; builderName: string; transform?: (value: any) => any }>
): Record<string, any> {
  if (!mapping) {
    return values;
  }

  const cvaProps: Record<string, any> = {};

  for (const map of mapping) {
    const value = values[map.builderName];
    if (value !== undefined) {
      cvaProps[map.cvaName] = map.transform ? map.transform(value) : value;
    }
  }

  return cvaProps;
}

/**
 * Get variant label by value
 */
export function getVariantLabel(
  variantName: string,
  value: string,
  system: VariantSystem
): string | undefined {
  const variant = system.variants.find((v) => v.name === variantName);
  if (!variant) return undefined;

  const variantValue = variant.values.find((v) => v.value === value);
  return variantValue?.label;
}

/**
 * Create variant helpers
 */
export const variantHelpers: VariantHelpers = {
  getDefaults: getDefaultVariantValues,
  validate: validateVariantValues,
  mergeWithDefaults: mergeVariantValues,
  fromCVA: cvaToVariantSystem,
  toCVA: variantSystemToCVA,
};
