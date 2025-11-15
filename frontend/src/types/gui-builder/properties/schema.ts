/**
 * Property Schema Types
 *
 * This module defines the schema structure for component properties,
 * including their configuration, validation, and UI presentation.
 *
 * @module gui-builder/properties/schema
 */

import type { PropertyId, Constraint } from '../core';
import type { PropertyType, PropertyValue } from './types';

/**
 * Control type for property input in the builder UI.
 */
export enum PropertyControlType {
  /**
   * Single-line text input.
   */
  TextInput = 'text-input',

  /**
   * Multi-line text area.
   */
  TextArea = 'textarea',

  /**
   * Number input with increment/decrement.
   */
  NumberInput = 'number-input',

  /**
   * Range slider.
   */
  Slider = 'slider',

  /**
   * Checkbox.
   */
  Checkbox = 'checkbox',

  /**
   * Toggle switch.
   */
  Toggle = 'toggle',

  /**
   * Radio button group.
   */
  RadioGroup = 'radio-group',

  /**
   * Dropdown select.
   */
  Select = 'select',

  /**
   * Multi-select dropdown.
   */
  MultiSelect = 'multi-select',

  /**
   * Color picker.
   */
  ColorPicker = 'color-picker',

  /**
   * Image upload/selector.
   */
  ImagePicker = 'image-picker',

  /**
   * Icon selector.
   */
  IconPicker = 'icon-picker',

  /**
   * Date picker.
   */
  DatePicker = 'date-picker',

  /**
   * Date and time picker.
   */
  DateTimePicker = 'datetime-picker',

  /**
   * Rich text editor.
   */
  RichTextEditor = 'richtext-editor',

  /**
   * Code editor with syntax highlighting.
   */
  CodeEditor = 'code-editor',

  /**
   * JSON editor.
   */
  JSONEditor = 'json-editor',

  /**
   * Component selector.
   */
  ComponentSelector = 'component-selector',

  /**
   * Server Action selector.
   */
  ActionSelector = 'action-selector',

  /**
   * Data binding editor.
   */
  BindingEditor = 'binding-editor',

  /**
   * Expression editor.
   */
  ExpressionEditor = 'expression-editor',

  /**
   * Style editor (CSS).
   */
  StyleEditor = 'style-editor',

  /**
   * Custom control (requires custom component).
   */
  Custom = 'custom',
}

/**
 * Configuration for property control UI.
 */
export interface PropertyControlConfig {
  /**
   * Type of control to render.
   */
  readonly type: PropertyControlType;

  /**
   * Placeholder text.
   */
  readonly placeholder?: string;

  /**
   * Helper text shown below the control.
   */
  readonly helperText?: string;

  /**
   * For Select/RadioGroup: options to display.
   */
  readonly options?: readonly {
    readonly label: string;
    readonly value: unknown;
    readonly description?: string;
    readonly icon?: string;
    readonly disabled?: boolean;
  }[];

  /**
   * For Slider: min, max, step values.
   */
  readonly sliderConfig?: {
    readonly min: number;
    readonly max: number;
    readonly step?: number;
    readonly showValue?: boolean;
  };

  /**
   * For CodeEditor: language and theme.
   */
  readonly codeConfig?: {
    readonly language?: string;
    readonly theme?: string;
    readonly lineNumbers?: boolean;
    readonly readOnly?: boolean;
  };

  /**
   * For Custom control: component identifier.
   */
  readonly customComponent?: string;

  /**
   * Additional configuration options.
   */
  readonly config?: Record<string, unknown>;
}

/**
 * Conditional visibility for properties.
 */
export interface PropertyCondition {
  /**
   * Type of condition.
   */
  readonly type: 'equals' | 'not-equals' | 'contains' | 'custom';

  /**
   * Property ID to check.
   */
  readonly propertyId: PropertyId;

  /**
   * Value to compare against.
   */
  readonly value?: unknown;

  /**
   * For 'custom': custom evaluation function.
   */
  readonly evaluate?: (propertyValues: Record<PropertyId, PropertyValue>) => boolean;

  /**
   * Operator for combining multiple conditions.
   */
  readonly operator?: 'and' | 'or';

  /**
   * Additional conditions to combine.
   */
  readonly conditions?: readonly PropertyCondition[];
}

/**
 * Property schema defining a single property.
 */
export interface PropertySchema {
  /**
   * Unique identifier for this property.
   */
  readonly id: PropertyId;

  /**
   * Display label for the property.
   */
  readonly label: string;

  /**
   * Data type of the property.
   */
  readonly type: PropertyType;

  /**
   * Description of what this property controls.
   */
  readonly description?: string;

  /**
   * Default value for the property.
   */
  readonly defaultValue?: PropertyValue;

  /**
   * Whether this property is required.
   */
  readonly required?: boolean;

  /**
   * Validation constraints.
   */
  readonly constraints?: readonly Constraint[];

  /**
   * UI control configuration.
   */
  readonly control: PropertyControlConfig;

  /**
   * Group this property belongs to.
   */
  readonly group?: string;

  /**
   * Display order within the group (lower = earlier).
   */
  readonly order?: number;

  /**
   * Conditional visibility.
   */
  readonly condition?: PropertyCondition;

  /**
   * Whether this property should be hidden in the UI.
   */
  readonly hidden?: boolean;

  /**
   * Whether this property is read-only.
   */
  readonly readOnly?: boolean;

  /**
   * Whether this property is deprecated.
   */
  readonly deprecated?: boolean;

  /**
   * Deprecation message.
   */
  readonly deprecationMessage?: string;

  /**
   * Whether changes to this property should trigger a re-render.
   */
  readonly triggersRerender?: boolean;

  /**
   * Whether this property supports responsive values.
   */
  readonly responsive?: boolean;

  /**
   * Custom metadata for extensions.
   */
  readonly customMetadata?: Record<string, unknown>;
}

/**
 * Property schema with responsive configuration.
 */
export interface ResponsivePropertySchema extends PropertySchema {
  readonly responsive: true;

  /**
   * Breakpoint-specific configurations.
   */
  readonly responsiveConfig?: {
    readonly breakpoint: string;
    readonly defaultValue?: PropertyValue;
    readonly hidden?: boolean;
  }[];
}

/**
 * Collection of property schemas.
 */
export type PropertySchemaCollection = Record<PropertyId, PropertySchema>;

/**
 * Property schema group for organizing properties in the UI.
 */
export interface PropertySchemaGroup {
  /**
   * Unique identifier for the group.
   */
  readonly id: string;

  /**
   * Display label for the group.
   */
  readonly label: string;

  /**
   * Description of the group.
   */
  readonly description?: string;

  /**
   * Icon for the group.
   */
  readonly icon?: string;

  /**
   * Whether the group is collapsible.
   */
  readonly collapsible?: boolean;

  /**
   * Whether the group is initially collapsed.
   */
  readonly defaultCollapsed?: boolean;

  /**
   * Display order of the group.
   */
  readonly order?: number;

  /**
   * Property IDs in this group.
   */
  readonly properties: readonly PropertyId[];

  /**
   * Conditional visibility for the entire group.
   */
  readonly condition?: PropertyCondition;
}

/**
 * Complete property configuration for a component.
 */
export interface PropertyConfiguration {
  /**
   * All property schemas.
   */
  readonly schemas: PropertySchemaCollection;

  /**
   * Property groups for UI organization.
   */
  readonly groups?: readonly PropertySchemaGroup[];

  /**
   * Global constraints that apply to all properties.
   */
  readonly globalConstraints?: readonly Constraint[];

  /**
   * Custom validation function.
   */
  readonly customValidation?: (
    values: Record<PropertyId, PropertyValue>,
  ) => string[] | Promise<string[]>;
}

/**
 * Type guard to check if a schema is responsive.
 */
export function isResponsiveSchema(
  schema: PropertySchema,
): schema is ResponsivePropertySchema {
  return schema.responsive === true;
}

/**
 * Helper to create a property schema.
 */
export function createPropertySchema(
  config: Omit<PropertySchema, 'id'> & { id: string },
): PropertySchema {
  return {
    ...config,
    id: config.id as PropertyId,
  };
}

/**
 * Helper to create a property group.
 */
export function createPropertyGroup(
  config: PropertySchemaGroup,
): PropertySchemaGroup {
  return config;
}
