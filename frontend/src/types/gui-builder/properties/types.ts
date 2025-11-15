/**
 * Property Value Types
 *
 * This module defines the discriminated union types for all possible
 * property values, enabling type-safe property handling throughout the builder.
 *
 * @module gui-builder/properties/types
 */

import type { ComponentId, ServerActionId, DataSourceId } from '../core';

/**
 * Property data types enumeration.
 */
export enum PropertyType {
  String = 'string',
  Number = 'number',
  Boolean = 'boolean',
  Object = 'object',
  Array = 'array',
  Enum = 'enum',
  Color = 'color',
  Image = 'image',
  Icon = 'icon',
  URL = 'url',
  Date = 'date',
  DateTime = 'datetime',
  Time = 'time',
  RichText = 'richtext',
  Code = 'code',
  JSON = 'json',
  ComponentReference = 'component-reference',
  ServerAction = 'server-action',
  DataBinding = 'data-binding',
  Expression = 'expression',
  Style = 'style',
  ClassName = 'classname',
  Slot = 'slot',
}

/**
 * Base property value interface.
 */
export interface BasePropertyValue {
  readonly type: PropertyType;
  readonly isDynamic?: boolean;
  readonly isComputed?: boolean;
}

/**
 * String property value.
 */
export interface StringPropertyValue extends BasePropertyValue {
  readonly type: PropertyType.String;
  readonly value: string;
}

/**
 * Number property value.
 */
export interface NumberPropertyValue extends BasePropertyValue {
  readonly type: PropertyType.Number;
  readonly value: number;
}

/**
 * Boolean property value.
 */
export interface BooleanPropertyValue extends BasePropertyValue {
  readonly type: PropertyType.Boolean;
  readonly value: boolean;
}

/**
 * Object property value.
 */
export interface ObjectPropertyValue extends BasePropertyValue {
  readonly type: PropertyType.Object;
  readonly value: Record<string, unknown>;
}

/**
 * Array property value.
 */
export interface ArrayPropertyValue extends BasePropertyValue {
  readonly type: PropertyType.Array;
  readonly value: unknown[];
  readonly itemType?: PropertyType;
}

/**
 * Enum property value (one of predefined values).
 */
export interface EnumPropertyValue<T = string> extends BasePropertyValue {
  readonly type: PropertyType.Enum;
  readonly value: T;
  readonly allowedValues: readonly T[];
}

/**
 * Color property value.
 */
export interface ColorPropertyValue extends BasePropertyValue {
  readonly type: PropertyType.Color;
  readonly value: string; // Hex, RGB, RGBA, etc.
  readonly format?: 'hex' | 'rgb' | 'rgba' | 'hsl' | 'hsla';
}

/**
 * Image property value.
 */
export interface ImagePropertyValue extends BasePropertyValue {
  readonly type: PropertyType.Image;
  readonly value: string; // URL or path
  readonly alt?: string;
  readonly width?: number;
  readonly height?: number;
  readonly format?: string;
}

/**
 * Icon property value.
 */
export interface IconPropertyValue extends BasePropertyValue {
  readonly type: PropertyType.Icon;
  readonly value: string; // Icon name or identifier
  readonly library?: string; // Icon library (e.g., 'lucide', 'heroicons')
  readonly variant?: string;
}

/**
 * URL property value.
 */
export interface URLPropertyValue extends BasePropertyValue {
  readonly type: PropertyType.URL;
  readonly value: string;
  readonly openInNewTab?: boolean;
  readonly noFollow?: boolean;
}

/**
 * Date property value.
 */
export interface DatePropertyValue extends BasePropertyValue {
  readonly type: PropertyType.Date;
  readonly value: string; // ISO 8601 date string
}

/**
 * DateTime property value.
 */
export interface DateTimePropertyValue extends BasePropertyValue {
  readonly type: PropertyType.DateTime;
  readonly value: string; // ISO 8601 datetime string
  readonly timezone?: string;
}

/**
 * Time property value.
 */
export interface TimePropertyValue extends BasePropertyValue {
  readonly type: PropertyType.Time;
  readonly value: string; // HH:mm:ss format
}

/**
 * Rich text property value (HTML content).
 */
export interface RichTextPropertyValue extends BasePropertyValue {
  readonly type: PropertyType.RichText;
  readonly value: string; // HTML string
  readonly sanitized?: boolean;
}

/**
 * Code property value.
 */
export interface CodePropertyValue extends BasePropertyValue {
  readonly type: PropertyType.Code;
  readonly value: string;
  readonly language?: string;
  readonly highlightSyntax?: boolean;
}

/**
 * JSON property value.
 */
export interface JSONPropertyValue extends BasePropertyValue {
  readonly type: PropertyType.JSON;
  readonly value: string; // JSON string
  readonly parsed?: unknown; // Parsed JSON object
}

/**
 * Component reference property value.
 */
export interface ComponentReferencePropertyValue extends BasePropertyValue {
  readonly type: PropertyType.ComponentReference;
  readonly value: ComponentId;
  readonly allowedComponents?: readonly ComponentId[];
}

/**
 * Server Action property value.
 */
export interface ServerActionPropertyValue extends BasePropertyValue {
  readonly type: PropertyType.ServerAction;
  readonly value: ServerActionId;
  readonly parameters?: Record<string, unknown>;
}

/**
 * Data binding property value.
 */
export interface DataBindingPropertyValue extends BasePropertyValue {
  readonly type: PropertyType.DataBinding;
  readonly value: string; // Binding expression (e.g., '${user.name}')
  readonly dataSource?: DataSourceId;
  readonly fallbackValue?: unknown;
}

/**
 * Expression property value (computed from other properties).
 */
export interface ExpressionPropertyValue extends BasePropertyValue {
  readonly type: PropertyType.Expression;
  readonly value: string; // Expression code
  readonly dependencies?: readonly string[]; // Property IDs this depends on
}

/**
 * Style property value (CSS styles).
 */
export interface StylePropertyValue extends BasePropertyValue {
  readonly type: PropertyType.Style;
  readonly value: Record<string, string | number>;
}

/**
 * ClassName property value (CSS classes).
 */
export interface ClassNamePropertyValue extends BasePropertyValue {
  readonly type: PropertyType.ClassName;
  readonly value: string | readonly string[];
}

/**
 * Slot property value (named slots for children).
 */
export interface SlotPropertyValue extends BasePropertyValue {
  readonly type: PropertyType.Slot;
  readonly value: string; // Slot name
  readonly allowedComponents?: readonly ComponentId[];
}

/**
 * Discriminated union of all property value types.
 *
 * This enables exhaustive pattern matching and type-safe property handling.
 *
 * @example
 * ```typescript
 * function renderProperty(prop: PropertyValue): React.ReactNode {
 *   switch (prop.type) {
 *     case PropertyType.String:
 *       return <StringInput value={prop.value} />;
 *     case PropertyType.Number:
 *       return <NumberInput value={prop.value} />;
 *     case PropertyType.Boolean:
 *       return <Checkbox checked={prop.value} />;
 *     // ... handle all cases
 *     default:
 *       // TypeScript ensures this is never reached
 *       const _exhaustive: never = prop;
 *       return null;
 *   }
 * }
 * ```
 */
export type PropertyValue =
  | StringPropertyValue
  | NumberPropertyValue
  | BooleanPropertyValue
  | ObjectPropertyValue
  | ArrayPropertyValue
  | EnumPropertyValue
  | ColorPropertyValue
  | ImagePropertyValue
  | IconPropertyValue
  | URLPropertyValue
  | DatePropertyValue
  | DateTimePropertyValue
  | TimePropertyValue
  | RichTextPropertyValue
  | CodePropertyValue
  | JSONPropertyValue
  | ComponentReferencePropertyValue
  | ServerActionPropertyValue
  | DataBindingPropertyValue
  | ExpressionPropertyValue
  | StylePropertyValue
  | ClassNamePropertyValue
  | SlotPropertyValue;

/**
 * Extract the value type from a property value.
 *
 * @example
 * ```typescript
 * type StringValue = ExtractPropertyValueType<StringPropertyValue>; // string
 * type NumberValue = ExtractPropertyValueType<NumberPropertyValue>; // number
 * ```
 */
export type ExtractPropertyValueType<T extends PropertyValue> = T['value'];

/**
 * Helper type to get property value type by PropertyType enum.
 */
export type PropertyValueByType<T extends PropertyType> = Extract<
  PropertyValue,
  { type: T }
>;

/**
 * Type guard to check if a property value is of a specific type.
 */
export function isPropertyValueOfType<T extends PropertyType>(
  value: PropertyValue,
  type: T,
): value is PropertyValueByType<T> {
  return value.type === type;
}

/**
 * Helper to create a string property value.
 */
export function createStringProperty(value: string): StringPropertyValue {
  return { type: PropertyType.String, value };
}

/**
 * Helper to create a number property value.
 */
export function createNumberProperty(value: number): NumberPropertyValue {
  return { type: PropertyType.Number, value };
}

/**
 * Helper to create a boolean property value.
 */
export function createBooleanProperty(value: boolean): BooleanPropertyValue {
  return { type: PropertyType.Boolean, value };
}

/**
 * Helper to create an enum property value.
 */
export function createEnumProperty<T = string>(
  value: T,
  allowedValues: readonly T[],
): EnumPropertyValue<T> {
  return { type: PropertyType.Enum, value, allowedValues };
}

/**
 * Helper to create a color property value.
 */
export function createColorProperty(
  value: string,
  format?: ColorPropertyValue['format'],
): ColorPropertyValue {
  return { type: PropertyType.Color, value, format };
}
