/**
 * Component Definition Types
 *
 * This module defines the structure for component definitions,
 * which serve as templates for creating component instances.
 *
 * @module gui-builder/components/definitions
 */

import type { ComponentId, PropertyId, JsonValue } from '../core';
import type { ComponentMetadata } from './metadata';
import type { PropertySchema } from '../properties';

/**
 * Slot definition for components that support named slots.
 */
export interface SlotDefinition {
  /**
   * Unique identifier for the slot.
   */
  readonly id: string;

  /**
   * Display name for the slot.
   */
  readonly name: string;

  /**
   * Description of what should go in this slot.
   */
  readonly description?: string;

  /**
   * Whether this slot is required.
   */
  readonly required?: boolean;

  /**
   * Allowed component types for this slot.
   */
  readonly allowedComponents?: readonly ComponentId[];

  /**
   * Maximum number of components in this slot.
   */
  readonly maxComponents?: number;

  /**
   * Default components to place in this slot.
   */
  readonly defaultComponents?: readonly ComponentId[];
}

/**
 * Style presets for quick styling options.
 */
export interface StylePreset {
  /**
   * Unique identifier for the preset.
   */
  readonly id: string;

  /**
   * Display name for the preset.
   */
  readonly name: string;

  /**
   * CSS class names to apply.
   */
  readonly classNames?: readonly string[];

  /**
   * Inline styles to apply.
   */
  readonly styles?: Record<string, string>;

  /**
   * Tailwind classes to apply.
   */
  readonly tailwindClasses?: readonly string[];

  /**
   * Preview thumbnail for the preset.
   */
  readonly thumbnail?: string;
}

/**
 * Event handler definition for component events.
 */
export interface EventHandlerDefinition {
  /**
   * Event name (e.g., 'onClick', 'onSubmit').
   */
  readonly event: string;

  /**
   * Description of when this event is triggered.
   */
  readonly description?: string;

  /**
   * Parameters passed to the event handler.
   */
  readonly parameters?: readonly {
    readonly name: string;
    readonly type: string;
    readonly description?: string;
  }[];

  /**
   * Whether this event can trigger Server Actions.
   */
  readonly supportsServerAction?: boolean;

  /**
   * Example usage.
   */
  readonly example?: string;
}

/**
 * Default property values for a component.
 */
export type DefaultPropertyValues = Record<PropertyId, JsonValue>;

/**
 * Component state definition for stateful components.
 */
export interface ComponentStateDefinition {
  /**
   * State variable name.
   */
  readonly name: string;

  /**
   * State variable type.
   */
  readonly type: string;

  /**
   * Default/initial value.
   */
  readonly defaultValue?: JsonValue;

  /**
   * Description of the state variable.
   */
  readonly description?: string;

  /**
   * Whether this state should persist across sessions.
   */
  readonly persistent?: boolean;
}

/**
 * Component context definition for components that provide context.
 */
export interface ComponentContextDefinition {
  /**
   * Context name.
   */
  readonly name: string;

  /**
   * Context value type.
   */
  readonly type: string;

  /**
   * Description of the context.
   */
  readonly description?: string;

  /**
   * Default context value.
   */
  readonly defaultValue?: JsonValue;
}

/**
 * Responsive variant configuration.
 */
export interface ResponsiveVariant {
  /**
   * Breakpoint name (xs, sm, md, lg, xl, 2xl).
   */
  readonly breakpoint: string;

  /**
   * Property overrides for this breakpoint.
   */
  readonly propertyOverrides?: DefaultPropertyValues;

  /**
   * Style overrides for this breakpoint.
   */
  readonly styleOverrides?: Record<string, string>;
}

/**
 * Component code template for generation.
 */
export interface ComponentCodeTemplate {
  /**
   * Template language (jsx, tsx).
   */
  readonly language: 'jsx' | 'tsx';

  /**
   * Template string with placeholders.
   *
   * Placeholders:
   * - {{props.propertyName}} - Insert property value
   * - {{children}} - Insert children
   * - {{slot.slotName}} - Insert slot content
   */
  readonly template: string;

  /**
   * Required imports for the component.
   */
  readonly imports?: readonly {
    readonly source: string;
    readonly named?: readonly string[];
    readonly default?: string;
  }[];

  /**
   * Additional helper functions.
   */
  readonly helpers?: readonly string[];
}

/**
 * Complete component definition.
 *
 * This serves as the template from which component instances are created.
 */
export interface ComponentDefinition {
  /**
   * Component metadata (ID, display, taxonomy, etc.).
   */
  readonly metadata: ComponentMetadata;

  /**
   * Property schema defining configurable properties.
   */
  readonly properties: Record<PropertyId, PropertySchema>;

  /**
   * Default values for properties.
   */
  readonly defaultProperties?: DefaultPropertyValues;

  /**
   * Slot definitions if the component supports slots.
   */
  readonly slots?: readonly SlotDefinition[];

  /**
   * Available style presets.
   */
  readonly stylePresets?: readonly StylePreset[];

  /**
   * Event handlers supported by the component.
   */
  readonly events?: readonly EventHandlerDefinition[];

  /**
   * State definitions for stateful components.
   */
  readonly state?: readonly ComponentStateDefinition[];

  /**
   * Context provided by this component.
   */
  readonly context?: readonly ComponentContextDefinition[];

  /**
   * Responsive variants.
   */
  readonly responsiveVariants?: readonly ResponsiveVariant[];

  /**
   * Code generation template.
   */
  readonly codeTemplate?: ComponentCodeTemplate;

  /**
   * Custom validation function for the component configuration.
   *
   * @param properties - The property values to validate
   * @param children - Child component instances
   * @returns Validation errors, if any
   */
  readonly customValidation?: (
    properties: DefaultPropertyValues,
    children?: unknown[],
  ) => string[] | Promise<string[]>;

  /**
   * Initialization function called when a new instance is created.
   *
   * @param properties - Initial property values
   * @returns Modified property values
   */
  readonly onInit?: (
    properties: DefaultPropertyValues,
  ) => DefaultPropertyValues | Promise<DefaultPropertyValues>;

  /**
   * Whether this is a built-in component.
   */
  readonly isBuiltIn: boolean;

  /**
   * Whether this component is marked as favorite.
   */
  readonly isFavorite?: boolean;

  /**
   * Custom metadata for extensions.
   */
  readonly customMetadata?: Record<string, JsonValue>;
}

/**
 * Minimal component definition for registration.
 * Used when registering a component without full metadata.
 */
export type MinimalComponentDefinition = RequireKeys<
  Partial<ComponentDefinition>,
  'metadata' | 'properties'
>;

/**
 * Component definition with computed/derived fields.
 * Used when retrieving a component from the registry.
 */
export interface ResolvedComponentDefinition extends ComponentDefinition {
  /**
   * Resolved dependencies (fully loaded).
   */
  readonly resolvedDependencies?: {
    readonly components: readonly ComponentDefinition[];
    readonly packages: readonly string[];
  };

  /**
   * Computed property count.
   */
  readonly propertyCount: number;

  /**
   * Whether all dependencies are satisfied.
   */
  readonly isDependenciesSatisfied: boolean;

  /**
   * Validation errors, if any.
   */
  readonly validationErrors?: readonly string[];
}

/**
 * Type guard to check if a definition is minimal.
 */
export function isMinimalDefinition(
  def: ComponentDefinition | MinimalComponentDefinition,
): def is MinimalComponentDefinition {
  return !('isBuiltIn' in def);
}

/**
 * Type guard to check if a definition is resolved.
 */
export function isResolvedDefinition(
  def: ComponentDefinition | ResolvedComponentDefinition,
): def is ResolvedComponentDefinition {
  return 'propertyCount' in def && 'isDependenciesSatisfied' in def;
}

// Re-export for convenience
type RequireKeys<T, K extends keyof T> = T & Required<Pick<T, K>>;
