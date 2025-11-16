/**
 * Adapter Creation Utilities
 *
 * Factory functions for creating page builder adapters from UI components
 */

'use client';

import React, { ComponentType, useMemo, useCallback } from 'react';
import {
  PageBuilderAdapter,
  AdapterConfig,
  BuilderContext,
  PageBuilderAdapterProps,
  PropValidationResult,
} from '../types/adapter.types';
import { ComponentDefinition, ComponentInstance } from '../types/component.types';
import { cn } from '@/lib/utils';

/**
 * Default adapter configuration
 */
const defaultConfig: Partial<AdapterConfig> = {
  transformProps: (props) => props,
  transformEvents: () => ({}),
  validateProps: () => ({ valid: true, errors: [] }),
  defaults: {},
};

/**
 * Create a page builder adapter for a UI component
 */
export function createAdapter<UIProps = any, BuilderProps = any>(
  UIComponent: ComponentType<UIProps>,
  definition: ComponentDefinition,
  config?: Partial<AdapterConfig<UIProps, BuilderProps>>
): PageBuilderAdapter<UIProps, BuilderProps> {
  const adapterConfig: AdapterConfig<UIProps, BuilderProps> = {
    ...defaultConfig,
    ...config,
  } as AdapterConfig<UIProps, BuilderProps>;

  // Create the adapter component
  const AdapterComponent: ComponentType<PageBuilderAdapterProps<BuilderProps>> = React.memo(
    ({ instance, context, props, children }) => {
      // Transform props
      const transformedProps = useMemo(() => {
        const mergedProps = { ...adapterConfig.defaults, ...props };
        return adapterConfig.transformProps(mergedProps as BuilderProps, context);
      }, [props, context]);

      // Transform events
      const eventHandlers = useMemo(() => {
        return adapterConfig.transformEvents?.(instance.events, context) || {};
      }, [instance.events, context]);

      // Transform styles
      const styles = useMemo(() => {
        return transformStyles(instance.style);
      }, [instance.style]);

      // Transform accessibility
      const ariaProps = useMemo(() => {
        return transformAccessibility(instance.accessibility);
      }, [instance.accessibility]);

      // Check conditional rendering
      const shouldRender = useCallback(() => {
        if (!instance.conditions?.visible) return true;
        return evaluateCondition(instance.conditions.visible, context);
      }, [instance.conditions?.visible, context]);

      const shouldEnable = useCallback(() => {
        if (!instance.conditions?.enabled) return true;
        return evaluateCondition(instance.conditions.enabled, context);
      }, [instance.conditions?.enabled, context]);

      if (!shouldRender()) {
        return null;
      }

      const isEnabled = shouldEnable();

      // Merge all props
      const finalProps = {
        ...transformedProps,
        ...eventHandlers,
        ...ariaProps,
        className: styles.className,
        style: styles.inlineStyles,
        disabled: !isEnabled || (transformedProps as any)?.disabled,
      } as UIProps;

      return <UIComponent {...finalProps}>{children}</UIComponent>;
    }
  );

  AdapterComponent.displayName = `PageBuilder(${definition.displayName})`;

  return {
    definition,
    config: adapterConfig,
    UIComponent,
    Component: AdapterComponent,
  };
}

/**
 * Transform builder styles to className and inline styles
 */
function transformStyles(styleConfig: ComponentInstance['style']) {
  const classNames: string[] = [];
  const inlineStyles: React.CSSProperties = {};

  if (!styleConfig) {
    return { className: '', inlineStyles };
  }

  // Add custom className
  if (styleConfig.className) {
    classNames.push(styleConfig.className);
  }

  // Add inline styles
  if (styleConfig.style) {
    Object.assign(inlineStyles, styleConfig.style);
  }

  // Transform layout styles
  if (styleConfig.layout) {
    const layout = typeof styleConfig.layout === 'object' && 'base' in styleConfig.layout
      ? (styleConfig.layout as any).base
      : styleConfig.layout;

    if (layout) {
      Object.assign(inlineStyles, {
        display: layout.display,
        width: layout.width,
        height: layout.height,
        minWidth: layout.minWidth,
        maxWidth: layout.maxWidth,
        minHeight: layout.minHeight,
        maxHeight: layout.maxHeight,
      });
    }
  }

  // Transform spacing styles
  if (styleConfig.spacing) {
    const spacing = typeof styleConfig.spacing === 'object' && 'base' in styleConfig.spacing
      ? (styleConfig.spacing as any).base
      : styleConfig.spacing;

    if (spacing) {
      Object.assign(inlineStyles, {
        margin: spacing.margin,
        padding: spacing.padding,
        gap: spacing.gap,
      });
    }
  }

  return {
    className: cn(...classNames),
    inlineStyles,
  };
}

/**
 * Transform accessibility config to ARIA props
 */
function transformAccessibility(config: ComponentInstance['accessibility']) {
  if (!config) return {};

  return {
    'aria-label': config.ariaLabel,
    'aria-describedby': config.ariaDescribedBy,
    'aria-labelledby': config.ariaLabelledBy,
    role: config.role,
    tabIndex: config.tabIndex,
  };
}

/**
 * Evaluate a condition expression
 */
function evaluateCondition(condition: string, context: BuilderContext): boolean {
  try {
    // Create a safe evaluation context
    const evalContext = {
      state: context.pageState,
      env: context.environment,
    };

    // Simple condition evaluation (in production, use a proper expression parser)
    const func = new Function('context', `with(context) { return ${condition}; }`);
    return Boolean(func(evalContext));
  } catch (error) {
    console.error('Error evaluating condition:', condition, error);
    return true; // Default to visible/enabled on error
  }
}

/**
 * Create event handlers from builder event configuration
 */
export function createEventHandlers(
  events: ComponentInstance['events'],
  context: BuilderContext
): Record<string, (e: any) => void> {
  if (!events || events.length === 0) return {};

  const handlers: Record<string, (e: any) => void> = {};

  for (const eventHandler of events) {
    handlers[eventHandler.event] = (e: any) => {
      if (eventHandler.preventDefault) {
        e.preventDefault();
      }
      if (eventHandler.stopPropagation) {
        e.stopPropagation();
      }

      // Execute actions sequentially
      for (const action of eventHandler.actions) {
        // Check condition if present
        if (action.condition) {
          const shouldExecute = evaluateCondition(action.condition, context);
          if (!shouldExecute) continue;
        }

        // Execute the action
        executeAction(action, context);
      }
    };
  }

  return handlers;
}

/**
 * Execute an action
 */
function executeAction(action: any, context: BuilderContext): void {
  switch (action.type) {
    case 'navigate':
      context.navigate(action.params.path);
      break;

    case 'setState':
      context.updateState({ [action.params.key]: action.params.value });
      break;

    case 'apiCall':
      // API call would be handled by context.executeAction
      context.executeAction(action);
      break;

    case 'showNotification':
      // Notification would be handled by context
      context.executeAction(action);
      break;

    case 'openModal':
    case 'closeModal':
      context.executeAction(action);
      break;

    case 'customScript':
      // Execute custom JavaScript (careful with security)
      try {
        const func = new Function('context', 'params', action.params.script);
        func(context, action.params);
      } catch (error) {
        console.error('Error executing custom script:', error);
      }
      break;

    default:
      console.warn('Unknown action type:', action.type);
  }
}

/**
 * Validate component props
 */
export function validateProps(
  props: Record<string, any>,
  definition: ComponentDefinition
): PropValidationResult {
  const errors: PropValidationResult['errors'] = [];

  // Check required props
  if (definition.requiredProps) {
    for (const requiredProp of definition.requiredProps) {
      if (!(requiredProp in props) || props[requiredProp] === undefined) {
        errors.push({
          prop: requiredProp,
          message: `Required prop '${requiredProp}' is missing`,
          severity: 'error',
        });
      }
    }
  }

  // Validate prop types
  for (const propDef of definition.props) {
    if (propDef.name in props) {
      const value = props[propDef.name];
      const typeError = validatePropType(value, propDef.type, propDef.name);
      if (typeError) {
        errors.push(typeError);
      }
    }
  }

  return {
    valid: errors.filter((e) => e.severity === 'error').length === 0,
    errors,
  };
}

/**
 * Validate a single prop type
 */
function validatePropType(
  value: any,
  expectedType: string,
  propName: string
): PropValidationResult['errors'][0] | null {
  let valid = true;

  switch (expectedType) {
    case 'string':
      valid = typeof value === 'string';
      break;
    case 'number':
      valid = typeof value === 'number';
      break;
    case 'boolean':
      valid = typeof value === 'boolean';
      break;
    case 'array':
      valid = Array.isArray(value);
      break;
    case 'object':
      valid = typeof value === 'object' && !Array.isArray(value);
      break;
  }

  if (!valid) {
    return {
      prop: propName,
      message: `Prop '${propName}' should be of type '${expectedType}'`,
      severity: 'error',
    };
  }

  return null;
}
