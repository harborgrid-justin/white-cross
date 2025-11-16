/**
 * Lazy Loading Components
 *
 * Provides lazy-loaded versions of heavy components to improve initial bundle size
 * and application load time. Uses React.lazy() and Suspense for code splitting.
 */

import React, { Suspense, ComponentType } from 'react';

// ============================================================================
// LOADING FALLBACKS
// ============================================================================

/**
 * Simple spinner component for loading states
 */
export const Spinner: React.FC<{ size?: 'sm' | 'md' | 'lg'; className?: string }> = ({
  size = 'md',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-2',
    lg: 'w-12 h-12 border-3',
  };

  return (
    <div
      className={`${sizeClasses[size]} border-blue-600 border-t-transparent rounded-full animate-spin ${className}`}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
};

/**
 * Full-page loading fallback
 */
export const PageLoading: React.FC = () => (
  <div className="flex items-center justify-center h-screen w-screen bg-gray-50 dark:bg-gray-950">
    <div className="text-center">
      <Spinner size="lg" />
      <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">Loading...</p>
    </div>
  </div>
);

/**
 * Modal loading fallback
 */
export const ModalLoading: React.FC = () => (
  <div className="flex items-center justify-center p-12">
    <div className="text-center">
      <Spinner size="md" />
      <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">Loading...</p>
    </div>
  </div>
);

/**
 * Panel loading fallback
 */
export const PanelLoading: React.FC = () => (
  <div className="flex items-center justify-center h-full bg-white dark:bg-gray-900">
    <Spinner size="sm" />
  </div>
);

/**
 * Inline loading fallback
 */
export const InlineLoading: React.FC = () => (
  <div className="flex items-center gap-2 p-2">
    <Spinner size="sm" />
    <span className="text-sm text-gray-600 dark:text-gray-400">Loading...</span>
  </div>
);

// ============================================================================
// LAZY LOADING WRAPPER
// ============================================================================

interface LazyComponentProps {
  /** The fallback component to show while loading */
  fallback?: React.ReactNode;
  /** Optional error boundary fallback */
  onError?: (error: Error) => void;
}

/**
 * Higher-order component that wraps a lazy-loaded component with Suspense
 *
 * @example
 * ```tsx
 * const PreviewModal = withLazyLoad(
 *   React.lazy(() => import('./PreviewModal')),
 *   <ModalLoading />
 * );
 * ```
 */
export function withLazyLoad<P extends object>(
  LazyComponent: React.LazyExoticComponent<ComponentType<P>>,
  fallback: React.ReactNode = <InlineLoading />
): React.FC<P> {
  return function LazyLoadWrapper(props: P) {
    return (
      <Suspense fallback={fallback}>
        <LazyComponent {...props} />
      </Suspense>
    );
  };
}

/**
 * Error Boundary for lazy-loaded components
 */
interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  fallback?: (error: Error) => React.ReactNode;
  onError?: (error: Error) => void;
  children: React.ReactNode;
}

export class LazyLoadErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('LazyLoad Error:', error, errorInfo);
    this.props.onError?.(error);
  }

  render() {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) {
        return this.props.fallback(this.state.error);
      }

      return (
        <div className="flex items-center justify-center p-8 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
          <div className="text-center">
            <h3 className="text-sm font-medium text-red-800 dark:text-red-200 mb-2">
              Failed to load component
            </h3>
            <p className="text-xs text-red-600 dark:text-red-400">
              {this.state.error.message}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Enhanced lazy load with error boundary
 *
 * @example
 * ```tsx
 * const PreviewModal = withLazyLoadAndErrorBoundary(
 *   React.lazy(() => import('./PreviewModal')),
 *   <ModalLoading />,
 *   (error) => <ErrorDisplay error={error} />
 * );
 * ```
 */
export function withLazyLoadAndErrorBoundary<P extends object>(
  LazyComponent: React.LazyExoticComponent<ComponentType<P>>,
  fallback: React.ReactNode = <InlineLoading />,
  errorFallback?: (error: Error) => React.ReactNode
): React.FC<P> {
  return function LazyLoadWithErrorBoundary(props: P) {
    return (
      <LazyLoadErrorBoundary fallback={errorFallback}>
        <Suspense fallback={fallback}>
          <LazyComponent {...props} />
        </Suspense>
      </LazyLoadErrorBoundary>
    );
  };
}

// ============================================================================
// PRELOADING UTILITIES
// ============================================================================

/**
 * Preload a lazy component
 * Useful for preloading components that will likely be needed soon
 *
 * @example
 * ```tsx
 * // Preload on hover
 * <button
 *   onMouseEnter={() => preloadComponent(() => import('./HeavyComponent'))}
 * >
 *   Show Heavy Component
 * </button>
 * ```
 */
export function preloadComponent<T>(
  importFn: () => Promise<{ default: ComponentType<T> }>
): void {
  if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
    requestIdleCallback(() => {
      importFn().catch((error) => {
        console.warn('Failed to preload component:', error);
      });
    });
  } else {
    setTimeout(() => {
      importFn().catch((error) => {
        console.warn('Failed to preload component:', error);
      });
    }, 100);
  }
}

/**
 * Hook to preload a component on mount
 *
 * @example
 * ```tsx
 * // Preload when component mounts
 * usePreloadComponent(() => import('./HeavyComponent'));
 * ```
 */
export function usePreloadComponent<T>(
  importFn: () => Promise<{ default: ComponentType<T> }>
): void {
  React.useEffect(() => {
    preloadComponent(importFn);
  }, [importFn]);
}
