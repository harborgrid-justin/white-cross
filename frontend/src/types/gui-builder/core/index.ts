/**
 * Core Types for GUI Builder
 *
 * This module provides foundational types, utilities, and helpers used
 * throughout the GUI builder system.
 *
 * @module gui-builder/core
 */

// Brand types for type-safe identifiers
export type {
  Brand,
  ComponentId,
  ComponentInstanceId,
  PageId,
  PropertyId,
  WorkflowId,
  TemplateId,
  VersionId,
  BindingId,
  ServerActionId,
  DataSourceId,
} from './brands';

export { isNonEmptyString, createBrandedId } from './brands';

// Common utility types
export type {
  RequireKeys,
  OptionalKeys,
  DeepReadonly,
  DeepPartial,
  KeysOfType,
  RequireAtLeastOne,
  RequireExactlyOne,
  Awaited,
  ValueOf,
  Nullable,
  NonNullable,
  JsonValue,
  JsonObject,
  JsonArray,
  Metadata,
  Point,
  Size,
  Rectangle,
  Result,
} from './common';

export { success, failure } from './common';

// Identifier generation and management
export type {
  IdGeneratorConfig,
  ParsedId,
  IdPrefix,
} from './identifiers';

export {
  DEFAULT_PREFIXES,
  generateRandomString,
  generateId,
  parseId,
  createTypedId,
  createComponentId,
  createComponentInstanceId,
  createPageId,
  createPropertyId,
  createWorkflowId,
  createTemplateId,
  createVersionId,
  createBindingId,
  createServerActionId,
  createDataSourceId,
  isValidId,
} from './identifiers';

// Validation and error handling
export type {
  ValidationIssue,
  ValidationResult,
  BaseConstraint,
  RequiredConstraint,
  MinLengthConstraint,
  MaxLengthConstraint,
  MinConstraint,
  MaxConstraint,
  PatternConstraint,
  EmailConstraint,
  URLConstraint,
  EnumConstraint,
  CustomConstraint,
  Constraint,
  ValidationRule,
  ValidationSchema,
  GuiBuilderError,
} from './validation';

export {
  ValidationSeverity,
  ConstraintType,
  ErrorCategory,
  createValidationIssue,
  createValidationResult,
  createError,
  isGuiBuilderError,
} from './validation';
