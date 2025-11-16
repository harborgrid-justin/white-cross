/**
 * Composition Utilities
 *
 * Higher-order components and utilities for component composition patterns
 */

'use client';

import React, { ComponentType, ReactNode, useMemo } from 'react';
import {
  CompoundComponentConfig,
  SlotConfig,
  HOCConfig,
} from '../types/composition.types';
import { ComponentDefinition, ComponentInstance } from '../types/component.types';
import { PageBuilderAdapter, BuilderContext } from '../types/adapter.types';
import { createAdapter } from './createAdapter';

/**
 * Higher-Order Component: withPageBuilder
 *
 * Wraps a component to make it compatible with the page builder
 */
export function withPageBuilder<P extends object>(
  Component: ComponentType<P>,
  definition: ComponentDefinition
): ComponentType<P> {
  const WrappedComponent = React.forwardRef<any, P>((props, ref) => {
    return <Component {...props} ref={ref} />;
  });

  WrappedComponent.displayName = `withPageBuilder(${definition.displayName})`;

  return WrappedComponent as ComponentType<P>;
}

/**
 * Higher-Order Component: withVariants
 *
 * Adds variant support to a component
 */
export function withVariants<P extends object>(
  Component: ComponentType<P>,
  variantMap: Record<string, any>
) {
  return React.forwardRef<any, P & { variant?: string }>((props, ref) => {
    const { variant, ...restProps } = props;

    const variantProps = useMemo(() => {
      if (!variant || !variantMap[variant]) {
        return {};
      }
      return variantMap[variant];
    }, [variant]);

    return <Component {...(restProps as P)} {...variantProps} ref={ref} />;
  });
}

/**
 * Higher-Order Component: withConditionalRender
 *
 * Adds conditional rendering support
 */
export function withConditionalRender<P extends object>(
  Component: ComponentType<P>,
  condition: (props: P, context: BuilderContext) => boolean
) {
  return function ConditionalComponent(props: P & { context?: BuilderContext }) {
    const { context, ...componentProps } = props as any;

    if (context && !condition(componentProps as P, context)) {
      return null;
    }

    return <Component {...(componentProps as P)} />;
  };
}

/**
 * Higher-Order Component: withSlots
 *
 * Adds slot-based composition support
 */
export function withSlots<P extends object>(
  Component: ComponentType<P>,
  slotConfigs: SlotConfig[]
) {
  return function SlottedComponent(
    props: P & { slots?: Record<string, ReactNode> }
  ) {
    const { slots = {}, ...componentProps } = props as any;

    // Validate required slots
    for (const slotConfig of slotConfigs) {
      if (slotConfig.required && !slots[slotConfig.name]) {
        console.warn(
          `Required slot '${slotConfig.name}' is missing in ${Component.displayName}`
        );
      }
    }

    return <Component {...(componentProps as P)} />;
  };
}

/**
 * Create a compound component structure
 *
 * Combines multiple components into a compound component pattern
 */
export function createCompoundComponent<
  T extends Record<string, ComponentType<any>>
>(config: CompoundComponentConfig<T>): {
  Root: PageBuilderAdapter;
  [K in keyof T]: PageBuilderAdapter;
} {
  const { Root, components } = config;

  // Create adapter for root
  const rootAdapter = createAdapter(
    Root.component,
    Root.definition,
    {
      transformProps: (props) => props,
    }
  );

  // Create adapters for sub-components
  const subAdapters = Object.entries(components).reduce(
    (acc, [key, componentConfig]) => {
      const adapter = createAdapter(
        componentConfig.component,
        componentConfig.definition,
        {
          transformProps: (props) => props,
        }
      );

      return {
        ...acc,
        [key]: adapter,
      };
    },
    {} as any
  );

  return {
    Root: rootAdapter,
    ...subAdapters,
  };
}

/**
 * Create render prop component
 *
 * Helper for creating components that use the render prop pattern
 */
export function createRenderProp<T extends any[]>(
  defaultRender: (...args: T) => ReactNode
) {
  return function useRenderProp(
    renderProp?: (...args: T) => ReactNode
  ): (...args: T) => ReactNode {
    return renderProp || defaultRender;
  };
}

/**
 * Compose multiple HOCs
 *
 * Applies multiple higher-order components in sequence
 */
export function composeHOCs<P extends object>(
  ...hocs: Array<(component: ComponentType<P>) => ComponentType<P>>
): (component: ComponentType<P>) => ComponentType<P> {
  return (component: ComponentType<P>) => {
    return hocs.reduceRight((acc, hoc) => hoc(acc), component);
  };
}

/**
 * Create a provider-consumer pattern
 */
export function createProviderPattern<T>(defaultValue: T) {
  const Context = React.createContext<T>(defaultValue);

  const Provider = ({ value, children }: { value: T; children: ReactNode }) => {
    return <Context.Provider value={value}>{children}</Context.Provider>;
  };

  const useContext = () => {
    const context = React.useContext(Context);
    if (context === undefined) {
      throw new Error('useContext must be used within a Provider');
    }
    return context;
  };

  const Consumer = Context.Consumer;

  return {
    Provider,
    Consumer,
    useContext,
    Context,
  };
}

/**
 * Slot renderer
 *
 * Renders content in a slot with validation
 */
export function Slot({
  name,
  config,
  children,
  fallback,
}: {
  name: string;
  config?: SlotConfig;
  children?: ReactNode;
  fallback?: ReactNode;
}) {
  // Validate slot content
  if (config?.required && !children) {
    console.warn(`Required slot '${name}' has no content`);
    return fallback ? <>{fallback}</> : null;
  }

  // Validate max components
  if (config?.maxComponents && React.Children.count(children) > config.maxComponents) {
    console.warn(
      `Slot '${name}' has too many children. Max: ${config.maxComponents}`
    );
  }

  return <>{children || fallback}</>;
}

/**
 * Component combinator
 *
 * Combines multiple components into a single component
 */
export function combineComponents<P extends object>(
  components: ComponentType<P>[],
  combineStrategy: 'sequential' | 'parallel' = 'sequential'
): ComponentType<P> {
  if (combineStrategy === 'sequential') {
    return function SequentialComponents(props: P) {
      return (
        <>
          {components.map((Component, index) => (
            <Component key={index} {...props} />
          ))}
        </>
      );
    };
  }

  return function ParallelComponents(props: P) {
    return (
      <div style={{ display: 'flex', gap: '1rem' }}>
        {components.map((Component, index) => (
          <Component key={index} {...props} />
        ))}
      </div>
    );
  };
}

/**
 * Lazy component loader
 *
 * Creates a lazy-loaded wrapper for a component
 */
export function createLazyComponent<P extends object>(
  loader: () => Promise<{ default: ComponentType<P> }>,
  fallback?: ReactNode
): ComponentType<P> {
  const LazyComponent = React.lazy(loader);

  return function LazyWrapper(props: P) {
    return (
      <React.Suspense fallback={fallback || <div>Loading...</div>}>
        <LazyComponent {...props} />
      </React.Suspense>
    );
  };
}

/**
 * Memoized component wrapper
 *
 * Wraps a component with React.memo and custom comparison
 */
export function createMemoizedComponent<P extends object>(
  Component: ComponentType<P>,
  arePropsEqual?: (prevProps: P, nextProps: P) => boolean
): ComponentType<P> {
  return React.memo(Component, arePropsEqual);
}

/**
 * Component with error boundary
 */
interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode | ((error: Error) => ReactNode);
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  { hasError: boolean; error: Error | null }
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.props.onError?.(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (typeof this.props.fallback === 'function') {
        return this.props.fallback(this.state.error!);
      }
      return this.props.fallback || <div>Something went wrong</div>;
    }

    return this.props.children;
  }
}

/**
 * Wrap component with error boundary
 */
export function withErrorBoundary<P extends object>(
  Component: ComponentType<P>,
  errorFallback?: ReactNode | ((error: Error) => ReactNode),
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
): ComponentType<P> {
  return function ComponentWithErrorBoundary(props: P) {
    return (
      <ErrorBoundary fallback={errorFallback} onError={onError}>
        <Component {...props} />
      </ErrorBoundary>
    );
  };
}
