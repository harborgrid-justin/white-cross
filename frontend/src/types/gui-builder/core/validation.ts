/**
 * Validation Types and Error Handling
 *
 * This module provides types for validation rules, error handling,
 * and data integrity checks throughout the GUI builder.
 *
 * @module gui-builder/core/validation
 */

/**
 * Severity levels for validation errors and warnings.
 */
export enum ValidationSeverity {
  /**
   * Informational message, doesn't prevent operation.
   */
  Info = 'info',

  /**
   * Warning that should be addressed but doesn't block operation.
   */
  Warning = 'warning',

  /**
   * Error that blocks the operation from completing.
   */
  Error = 'error',

  /**
   * Critical error that may indicate system corruption.
   */
  Critical = 'critical',
}

/**
 * Represents a single validation issue.
 */
export interface ValidationIssue {
  /**
   * Unique identifier for the issue type.
   */
  readonly code: string;

  /**
   * Human-readable message describing the issue.
   */
  readonly message: string;

  /**
   * Severity level of the issue.
   */
  readonly severity: ValidationSeverity;

  /**
   * Path to the field or property that has the issue.
   * Uses dot notation for nested properties.
   *
   * @example 'properties.title.value'
   */
  readonly path?: string;

  /**
   * Additional context or metadata about the issue.
   */
  readonly context?: Record<string, unknown>;

  /**
   * Suggested fix or resolution for the issue.
   */
  readonly suggestion?: string;
}

/**
 * Result of a validation operation.
 */
export interface ValidationResult {
  /**
   * Whether the validation passed (no errors).
   */
  readonly valid: boolean;

  /**
   * All validation issues found.
   */
  readonly issues: readonly ValidationIssue[];

  /**
   * Quick access to errors only.
   */
  readonly errors: readonly ValidationIssue[];

  /**
   * Quick access to warnings only.
   */
  readonly warnings: readonly ValidationIssue[];

  /**
   * Timestamp when validation was performed.
   */
  readonly validatedAt: string;
}

/**
 * Constraint types for validation rules.
 */
export enum ConstraintType {
  Required = 'required',
  MinLength = 'minLength',
  MaxLength = 'maxLength',
  Min = 'min',
  Max = 'max',
  Pattern = 'pattern',
  Email = 'email',
  URL = 'url',
  Enum = 'enum',
  Custom = 'custom',
}

/**
 * Base constraint interface.
 */
export interface BaseConstraint {
  readonly type: ConstraintType;
  readonly message?: string;
}

/**
 * Required field constraint.
 */
export interface RequiredConstraint extends BaseConstraint {
  readonly type: ConstraintType.Required;
}

/**
 * Minimum length constraint for strings and arrays.
 */
export interface MinLengthConstraint extends BaseConstraint {
  readonly type: ConstraintType.MinLength;
  readonly value: number;
}

/**
 * Maximum length constraint for strings and arrays.
 */
export interface MaxLengthConstraint extends BaseConstraint {
  readonly type: ConstraintType.MaxLength;
  readonly value: number;
}

/**
 * Minimum value constraint for numbers.
 */
export interface MinConstraint extends BaseConstraint {
  readonly type: ConstraintType.Min;
  readonly value: number;
  readonly inclusive?: boolean;
}

/**
 * Maximum value constraint for numbers.
 */
export interface MaxConstraint extends BaseConstraint {
  readonly type: ConstraintType.Max;
  readonly value: number;
  readonly inclusive?: boolean;
}

/**
 * Pattern (regex) constraint for strings.
 */
export interface PatternConstraint extends BaseConstraint {
  readonly type: ConstraintType.Pattern;
  readonly pattern: string;
  readonly flags?: string;
}

/**
 * Email validation constraint.
 */
export interface EmailConstraint extends BaseConstraint {
  readonly type: ConstraintType.Email;
}

/**
 * URL validation constraint.
 */
export interface URLConstraint extends BaseConstraint {
  readonly type: ConstraintType.URL;
  readonly protocols?: readonly string[];
}

/**
 * Enum (allowed values) constraint.
 */
export interface EnumConstraint<T = unknown> extends BaseConstraint {
  readonly type: ConstraintType.Enum;
  readonly values: readonly T[];
}

/**
 * Custom validation function constraint.
 */
export interface CustomConstraint<T = unknown> extends BaseConstraint {
  readonly type: ConstraintType.Custom;
  readonly validate: (value: T) => boolean | Promise<boolean>;
}

/**
 * Union of all constraint types.
 */
export type Constraint =
  | RequiredConstraint
  | MinLengthConstraint
  | MaxLengthConstraint
  | MinConstraint
  | MaxConstraint
  | PatternConstraint
  | EmailConstraint
  | URLConstraint
  | EnumConstraint
  | CustomConstraint;

/**
 * Validation rule that can be applied to a value.
 */
export interface ValidationRule<T = unknown> {
  /**
   * Name of the rule for identification.
   */
  readonly name: string;

  /**
   * Constraints to apply.
   */
  readonly constraints: readonly Constraint[];

  /**
   * Whether this rule should be applied.
   * Can be a boolean or a function that determines applicability.
   */
  readonly enabled?: boolean | ((context: unknown) => boolean);

  /**
   * Custom validation function that runs after constraints.
   */
  readonly customValidation?: (
    value: T,
    context?: unknown,
  ) => ValidationIssue[] | Promise<ValidationIssue[]>;
}

/**
 * Schema defining validation rules for an object.
 */
export type ValidationSchema<T extends Record<string, unknown>> = {
  readonly [K in keyof T]?: ValidationRule<T[K]> | ValidationSchema<any>;
};

/**
 * Error code categories.
 */
export enum ErrorCategory {
  /**
   * Validation errors (user input, data integrity).
   */
  Validation = 'VALIDATION',

  /**
   * Configuration errors (invalid setup).
   */
  Configuration = 'CONFIGURATION',

  /**
   * Runtime errors (unexpected conditions).
   */
  Runtime = 'RUNTIME',

  /**
   * Network errors (API calls, connectivity).
   */
  Network = 'NETWORK',

  /**
   * Permission errors (access denied).
   */
  Permission = 'PERMISSION',

  /**
   * Not found errors (missing resources).
   */
  NotFound = 'NOT_FOUND',

  /**
   * Conflict errors (state conflicts, concurrency).
   */
  Conflict = 'CONFLICT',
}

/**
 * Structured error with category and context.
 */
export interface GuiBuilderError {
  /**
   * Unique error code.
   */
  readonly code: string;

  /**
   * Error category.
   */
  readonly category: ErrorCategory;

  /**
   * Human-readable error message.
   */
  readonly message: string;

  /**
   * Technical details about the error.
   */
  readonly details?: string;

  /**
   * Additional context data.
   */
  readonly context?: Record<string, unknown>;

  /**
   * Original error if this wraps another error.
   */
  readonly cause?: Error;

  /**
   * Timestamp when the error occurred.
   */
  readonly timestamp: string;

  /**
   * Stack trace if available.
   */
  readonly stack?: string;
}

/**
 * Helper to create a validation issue.
 */
export function createValidationIssue(
  code: string,
  message: string,
  severity: ValidationSeverity = ValidationSeverity.Error,
  options?: {
    path?: string;
    context?: Record<string, unknown>;
    suggestion?: string;
  },
): ValidationIssue {
  return {
    code,
    message,
    severity,
    path: options?.path,
    context: options?.context,
    suggestion: options?.suggestion,
  };
}

/**
 * Helper to create a validation result.
 */
export function createValidationResult(
  issues: ValidationIssue[],
): ValidationResult {
  const errors = issues.filter(
    (issue) =>
      issue.severity === ValidationSeverity.Error ||
      issue.severity === ValidationSeverity.Critical,
  );
  const warnings = issues.filter(
    (issue) => issue.severity === ValidationSeverity.Warning,
  );

  return {
    valid: errors.length === 0,
    issues,
    errors,
    warnings,
    validatedAt: new Date().toISOString(),
  };
}

/**
 * Helper to create a GUI builder error.
 */
export function createError(
  code: string,
  category: ErrorCategory,
  message: string,
  options?: {
    details?: string;
    context?: Record<string, unknown>;
    cause?: Error;
  },
): GuiBuilderError {
  return {
    code,
    category,
    message,
    details: options?.details,
    context: options?.context,
    cause: options?.cause,
    timestamp: new Date().toISOString(),
    stack: new Error().stack,
  };
}

/**
 * Type guard to check if an error is a GuiBuilderError.
 */
export function isGuiBuilderError(error: unknown): error is GuiBuilderError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    'category' in error &&
    'message' in error
  );
}
