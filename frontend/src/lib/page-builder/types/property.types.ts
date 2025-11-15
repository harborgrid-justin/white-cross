/**
 * Property definition types for component configuration
 *
 * This file defines the types for configurable properties that appear
 * in the property panel of the page builder.
 */

import { ValidationRule, DataBinding } from './component.types';

/**
 * Property input control types
 */
export type PropertyControlType =
  | 'text'
  | 'number'
  | 'boolean'
  | 'select'
  | 'multiSelect'
  | 'color'
  | 'date'
  | 'dateTime'
  | 'slider'
  | 'richText'
  | 'code'
  | 'json'
  | 'image'
  | 'icon'
  | 'url'
  | 'alignment'
  | 'spacing'
  | 'typography'
  | 'border'
  | 'shadow'
  | 'gradient'
  | 'dataBinding'
  | 'eventHandler'
  | 'component';

/**
 * Property value types
 */
export type PropertyType =
  | 'string'
  | 'number'
  | 'boolean'
  | 'object'
  | 'array'
  | 'date'
  | 'function'
  | 'node'
  | 'component';

/**
 * Base property definition
 */
export interface BasePropertyDefinition {
  name: string;
  label: string;
  description?: string;
  type: PropertyType;
  controlType: PropertyControlType;
  defaultValue?: unknown;
  required?: boolean;
  group?: string; // Group properties in the UI
  order?: number;
  hidden?: boolean;
  condition?: string; // JavaScript expression to show/hide property
  validation?: ValidationRule[];
  supportsDataBinding?: boolean;
  supportsResponsive?: boolean;
  placeholder?: string;
  helpText?: string;
}

/**
 * Text property
 */
export interface TextPropertyDefinition extends BasePropertyDefinition {
  type: 'string';
  controlType: 'text' | 'richText' | 'code' | 'url';
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  multiline?: boolean;
  rows?: number;
  language?: string; // For code editor
}

/**
 * Number property
 */
export interface NumberPropertyDefinition extends BasePropertyDefinition {
  type: 'number';
  controlType: 'number' | 'slider';
  min?: number;
  max?: number;
  step?: number;
  unit?: string; // e.g., 'px', '%', 'rem'
  showUnit?: boolean;
}

/**
 * Boolean property
 */
export interface BooleanPropertyDefinition extends BasePropertyDefinition {
  type: 'boolean';
  controlType: 'boolean';
  labelOn?: string;
  labelOff?: string;
}

/**
 * Select option
 */
export interface SelectOption {
  value: string | number;
  label: string;
  icon?: string;
  disabled?: boolean;
  group?: string;
}

/**
 * Select property
 */
export interface SelectPropertyDefinition extends BasePropertyDefinition {
  type: 'string' | 'number';
  controlType: 'select' | 'multiSelect';
  options: SelectOption[] | (() => SelectOption[]); // Can be dynamic
  allowCustomValue?: boolean;
  searchable?: boolean;
}

/**
 * Color property
 */
export interface ColorPropertyDefinition extends BasePropertyDefinition {
  type: 'string';
  controlType: 'color';
  format?: 'hex' | 'rgb' | 'rgba' | 'hsl' | 'hsla';
  presets?: string[]; // Predefined colors
  opacity?: boolean;
}

/**
 * Date property
 */
export interface DatePropertyDefinition extends BasePropertyDefinition {
  type: 'date';
  controlType: 'date' | 'dateTime';
  minDate?: Date;
  maxDate?: Date;
  format?: string;
  includeTime?: boolean;
}

/**
 * Image property
 */
export interface ImagePropertyDefinition extends BasePropertyDefinition {
  type: 'string' | 'object';
  controlType: 'image';
  acceptedFormats?: string[]; // e.g., ['jpg', 'png', 'webp']
  maxSize?: number; // In bytes
  dimensions?: {
    minWidth?: number;
    minHeight?: number;
    maxWidth?: number;
    maxHeight?: number;
    aspectRatio?: number;
  };
  upload?: {
    endpoint?: string;
    method?: string;
    headers?: Record<string, string>;
  };
}

/**
 * Icon property
 */
export interface IconPropertyDefinition extends BasePropertyDefinition {
  type: 'string';
  controlType: 'icon';
  iconSet?: string; // e.g., 'lucide', 'heroicons', 'fontawesome'
  categories?: string[];
}

/**
 * Alignment property
 */
export interface AlignmentPropertyDefinition extends BasePropertyDefinition {
  type: 'string';
  controlType: 'alignment';
  direction?: 'horizontal' | 'vertical' | 'both';
  options?: Array<'left' | 'center' | 'right' | 'justify' | 'top' | 'middle' | 'bottom'>;
}

/**
 * Spacing property
 */
export interface SpacingPropertyDefinition extends BasePropertyDefinition {
  type: 'object';
  controlType: 'spacing';
  sides?: Array<'top' | 'right' | 'bottom' | 'left' | 'all'>;
  unit?: string;
  min?: number;
  max?: number;
  step?: number;
}

/**
 * Typography property
 */
export interface TypographyPropertyDefinition extends BasePropertyDefinition {
  type: 'object';
  controlType: 'typography';
  fields?: Array<'fontFamily' | 'fontSize' | 'fontWeight' | 'lineHeight' | 'letterSpacing'>;
  fontFamilies?: string[];
}

/**
 * Border property
 */
export interface BorderPropertyDefinition extends BasePropertyDefinition {
  type: 'object';
  controlType: 'border';
  fields?: Array<'width' | 'style' | 'color' | 'radius'>;
  sides?: Array<'top' | 'right' | 'bottom' | 'left' | 'all'>;
}

/**
 * Shadow property
 */
export interface ShadowPropertyDefinition extends BasePropertyDefinition {
  type: 'string';
  controlType: 'shadow';
  presets?: Array<{ label: string; value: string }>;
  allowCustom?: boolean;
}

/**
 * Gradient property
 */
export interface GradientPropertyDefinition extends BasePropertyDefinition {
  type: 'string';
  controlType: 'gradient';
  types?: Array<'linear' | 'radial' | 'conic'>;
  maxStops?: number;
}

/**
 * Object property (nested properties)
 */
export interface ObjectPropertyDefinition extends BasePropertyDefinition {
  type: 'object';
  controlType: 'json';
  properties?: PropertyDefinition[];
  schema?: Record<string, unknown>; // JSON Schema
}

/**
 * Array property
 */
export interface ArrayPropertyDefinition extends BasePropertyDefinition {
  type: 'array';
  controlType: 'json';
  itemType?: PropertyType;
  itemDefinition?: PropertyDefinition;
  minItems?: number;
  maxItems?: number;
  sortable?: boolean;
}

/**
 * Data binding property
 */
export interface DataBindingPropertyDefinition extends BasePropertyDefinition {
  type: 'object';
  controlType: 'dataBinding';
  supportedSources?: DataBinding['source'][];
  valueType?: PropertyType;
  schema?: Record<string, unknown>;
}

/**
 * Event handler property
 */
export interface EventHandlerPropertyDefinition extends BasePropertyDefinition {
  type: 'function';
  controlType: 'eventHandler';
  eventName: string;
  payloadSchema?: Record<string, unknown>;
  availableActions?: string[]; // Restrict available actions
}

/**
 * Component property (nested component)
 */
export interface ComponentPropertyDefinition extends BasePropertyDefinition {
  type: 'component';
  controlType: 'component';
  allowedComponents?: string[]; // Component IDs
  renderMode?: 'inline' | 'reference';
}

/**
 * Union of all property definition types
 */
export type PropertyDefinition =
  | TextPropertyDefinition
  | NumberPropertyDefinition
  | BooleanPropertyDefinition
  | SelectPropertyDefinition
  | ColorPropertyDefinition
  | DatePropertyDefinition
  | ImagePropertyDefinition
  | IconPropertyDefinition
  | AlignmentPropertyDefinition
  | SpacingPropertyDefinition
  | TypographyPropertyDefinition
  | BorderPropertyDefinition
  | ShadowPropertyDefinition
  | GradientPropertyDefinition
  | ObjectPropertyDefinition
  | ArrayPropertyDefinition
  | DataBindingPropertyDefinition
  | EventHandlerPropertyDefinition
  | ComponentPropertyDefinition;

/**
 * Property group for organizing properties in the UI
 */
export interface PropertyGroup {
  id: string;
  label: string;
  description?: string;
  icon?: string;
  collapsible?: boolean;
  defaultExpanded?: boolean;
  order?: number;
}

/**
 * Property preset (saved property configurations)
 */
export interface PropertyPreset {
  id: string;
  name: string;
  description?: string;
  componentId: string;
  properties: Record<string, unknown>;
  thumbnail?: string;
}
