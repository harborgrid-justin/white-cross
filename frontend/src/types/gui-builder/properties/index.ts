/**
 * Properties Module
 *
 * This module provides types for defining, validating, and managing
 * component properties, including data binding and grouping.
 *
 * @module gui-builder/properties
 */

// Property value types
export type {
  BasePropertyValue,
  StringPropertyValue,
  NumberPropertyValue,
  BooleanPropertyValue,
  ObjectPropertyValue,
  ArrayPropertyValue,
  EnumPropertyValue,
  ColorPropertyValue,
  ImagePropertyValue,
  IconPropertyValue,
  URLPropertyValue,
  DatePropertyValue,
  DateTimePropertyValue,
  TimePropertyValue,
  RichTextPropertyValue,
  CodePropertyValue,
  JSONPropertyValue,
  ComponentReferencePropertyValue,
  ServerActionPropertyValue,
  DataBindingPropertyValue,
  ExpressionPropertyValue,
  StylePropertyValue,
  ClassNamePropertyValue,
  SlotPropertyValue,
  PropertyValue,
  ExtractPropertyValueType,
  PropertyValueByType,
} from './types';

export {
  PropertyType,
  isPropertyValueOfType,
  createStringProperty,
  createNumberProperty,
  createBooleanProperty,
  createEnumProperty,
  createColorProperty,
} from './types';

// Property schema types
export type {
  PropertyControlConfig,
  PropertyCondition,
  PropertySchema,
  ResponsivePropertySchema,
  PropertySchemaCollection,
  PropertySchemaGroup,
  PropertyConfiguration,
} from './schema';

export {
  PropertyControlType,
  isResponsiveSchema,
  createPropertySchema,
  createPropertyGroup as createSchemaPropertyGroup,
} from './schema';

// Data binding types
export type {
  BaseBindingExpression,
  PathBindingExpression,
  TemplateBindingExpression,
  ExpressionBindingExpression,
  FunctionBindingExpression,
  ServerActionBindingExpression,
  PropertyReferenceBindingExpression,
  BindingExpression,
  DataSource,
  DataBinding,
  BindingContext,
  BindingEvaluationResult,
} from './bindings';

export {
  BindingExpressionType,
  DataSourceType,
  isPathExpression,
  isTemplateExpression,
  isJavaScriptExpression,
} from './bindings';

// Validation types
export type {
  PropertyValidationContext,
  PropertyValidator,
  PropertyValidators,
  PropertyValidationRule,
  PropertyValidationRules,
  PropertyCollectionValidationResult,
  PropertyValidationConfig,
} from './validation';

export {
  validateConstraint,
  validatePropertyConstraints,
  createPropertyValidationResult,
} from './validation';

// Grouping types
export type {
  PropertyGroupTheme,
  PropertyGroup,
  PropertyGroupCollection,
  FlatPropertyList,
} from './groups';

export {
  PropertyGroupId,
  PropertyGroupLayout,
  createPropertyGroup,
  flattenPropertyGroups,
  findPropertyGroup,
} from './groups';
