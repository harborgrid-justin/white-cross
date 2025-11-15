/**
 * Property Validation Types
 *
 * This module extends the core validation system with property-specific
 * validation rules and helpers.
 *
 * @module gui-builder/properties/validation
 */

import type {
  ValidationResult,
  ValidationIssue,
  Constraint,
  PropertyId,
} from '../core';
import type { PropertyValue } from './types';
import type { PropertySchema } from './schema';

/**
 * Property-specific validation context.
 */
export interface PropertyValidationContext {
  /**
   * The property being validated.
   */
  readonly propertyId: PropertyId;

  /**
   * The property schema.
   */
  readonly schema: PropertySchema;

  /**
   * The current value.
   */
  readonly value: PropertyValue;

  /**
   * All property values (for cross-property validation).
   */
  readonly allValues?: Record<PropertyId, PropertyValue>;

  /**
   * Component-level context.
   */
  readonly componentContext?: Record<string, unknown>;
}

/**
 * Property validation function.
 */
export type PropertyValidator = (
  context: PropertyValidationContext,
) => ValidationResult | Promise<ValidationResult>;

/**
 * Built-in property validators.
 */
export interface PropertyValidators {
  /**
   * Validates that a required property has a value.
   */
  readonly required: PropertyValidator;

  /**
   * Validates string length constraints.
   */
  readonly stringLength: PropertyValidator;

  /**
   * Validates number range constraints.
   */
  readonly numberRange: PropertyValidator;

  /**
   * Validates enum values.
   */
  readonly enum: PropertyValidator;

  /**
   * Validates URL format.
   */
  readonly url: PropertyValidator;

  /**
   * Validates email format.
   */
  readonly email: PropertyValidator;

  /**
   * Validates color format.
   */
  readonly color: PropertyValidator;

  /**
   * Validates date format.
   */
  readonly date: PropertyValidator;

  /**
   * Validates JSON format.
   */
  readonly json: PropertyValidator;

  /**
   * Validates pattern (regex) match.
   */
  readonly pattern: PropertyValidator;
}

/**
 * Validation rule for a property.
 */
export interface PropertyValidationRule {
  /**
   * Unique identifier for the rule.
   */
  readonly id: string;

  /**
   * Display name for the rule.
   */
  readonly name: string;

  /**
   * Description of what the rule validates.
   */
  readonly description?: string;

  /**
   * Validator function.
   */
  readonly validator: PropertyValidator;

  /**
   * Whether this rule is enabled.
   */
  readonly enabled?: boolean;

  /**
   * Priority (higher = runs first).
   */
  readonly priority?: number;
}

/**
 * Collection of validation rules.
 */
export type PropertyValidationRules = Record<string, PropertyValidationRule>;

/**
 * Result of validating all properties.
 */
export interface PropertyCollectionValidationResult {
  /**
   * Whether all properties are valid.
   */
  readonly valid: boolean;

  /**
   * Results for each property.
   */
  readonly results: Record<PropertyId, ValidationResult>;

  /**
   * All validation issues across all properties.
   */
  readonly allIssues: readonly ValidationIssue[];

  /**
   * Properties with errors.
   */
  readonly propertiesWithErrors: readonly PropertyId[];

  /**
   * Properties with warnings.
   */
  readonly propertiesWithWarnings: readonly PropertyId[];

  /**
   * Validation timestamp.
   */
  readonly validatedAt: string;
}

/**
 * Validation configuration for a property.
 */
export interface PropertyValidationConfig {
  /**
   * Whether to validate on change.
   */
  readonly validateOnChange?: boolean;

  /**
   * Whether to validate on blur.
   */
  readonly validateOnBlur?: boolean;

  /**
   * Debounce delay for validation (milliseconds).
   */
  readonly debounce?: number;

  /**
   * Whether to show inline validation errors.
   */
  readonly showInlineErrors?: boolean;

  /**
   * Custom validation rules.
   */
  readonly customRules?: readonly PropertyValidationRule[];
}

/**
 * Helper to validate a single constraint.
 */
export function validateConstraint(
  value: PropertyValue,
  constraint: Constraint,
): ValidationIssue | null {
  // Implementation would validate the constraint
  // This is a type definition, actual implementation would be elsewhere
  return null;
}

/**
 * Helper to validate all constraints for a property.
 */
export function validatePropertyConstraints(
  value: PropertyValue,
  constraints: readonly Constraint[],
): ValidationIssue[] {
  return constraints
    .map((constraint) => validateConstraint(value, constraint))
    .filter((issue): issue is ValidationIssue => issue !== null);
}

/**
 * Helper to create a property validation result.
 */
export function createPropertyValidationResult(
  propertyId: PropertyId,
  issues: ValidationIssue[],
): ValidationResult {
  return {
    valid: issues.filter((i) => i.severity === 'error').length === 0,
    issues,
    errors: issues.filter((i) => i.severity === 'error'),
    warnings: issues.filter((i) => i.severity === 'warning'),
    validatedAt: new Date().toISOString(),
  };
}
