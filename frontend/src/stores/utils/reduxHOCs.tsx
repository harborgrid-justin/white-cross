/**
 * Redux Higher-Order Components (HOCs)
 *
 * Reusable HOCs for common Redux patterns throughout the application.
 * These HOCs provide consistent data fetching, loading states, and error handling.
 */

import React, { useEffect, ComponentType } from 'react';
import { useAppSelector, useAppDispatch } from '../hooks';
import type { RootState, AppDispatch } from '../reduxStore';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';

/**
 * Props injected by withReduxData HOC
 */
export interface WithDataProps<T> {
  data: T[];
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

/**
 * HOC that handles data fetching, loading, and error states
 *
 * @example
 * const StudentsWithData = withReduxData(
 *   StudentsList,
 *   {
 *     selector: (state) => selectActiveStudents(state),
 *     loadingSelector: (state) => state.students.loading.list.isLoading,
 *     errorSelector: (state) => state.students.loading.list.error,
 *     fetchAction: fetchStudents,
 *   }
 * );
 */
export function withReduxData<T, P extends WithDataProps<T>>(
  WrappedComponent: ComponentType<P>,
  config: {
    selector: (state: RootState) => T[];
    loadingSelector: (state: RootState) => boolean;
    errorSelector: (state: RootState) => string | null;
    fetchAction: (params?: any) => any;
    fetchParams?: any;
    showLoadingSpinner?: boolean;
    showErrorMessage?: boolean;
  }
) {
  const {
    selector,
    loadingSelector,
    errorSelector,
    fetchAction,
    fetchParams,
    showLoadingSpinner = true,
    showErrorMessage = true,
  } = config;

  return function WithDataComponent(props: Omit<P, keyof WithDataProps<T>>) {
    const dispatch = useAppDispatch();
    const data = useAppSelector(selector);
    const loading = useAppSelector(loadingSelector);
    const error = useAppSelector(errorSelector);

    const refresh = () => {
      dispatch(fetchAction(fetchParams));
    };

    useEffect(() => {
      refresh();
    }, []);

    if (loading && showLoadingSpinner) {
      return <LoadingSpinner />;
    }

    if (error && showErrorMessage) {
      return <ErrorMessage message={error} onRetry={refresh} />;
    }

    return (
      <WrappedComponent
        {...(props as P)}
        data={data}
        loading={loading}
        error={error}
        refresh={refresh}
      />
    );
  };
}

/**
 * Props injected by withLoadingState HOC
 */
export interface WithLoadingProps {
  loading: boolean;
  error: string | null;
}

/**
 * HOC that only handles loading and error states without data fetching
 *
 * @example
 * const StudentForm = withLoadingState(
 *   StudentFormContent,
 *   {
 *     loadingSelector: (state) => state.students.loading.create.isLoading,
 *     errorSelector: (state) => state.students.loading.create.error,
 *   }
 * );
 */
export function withLoadingState<P extends WithLoadingProps>(
  WrappedComponent: ComponentType<P>,
  config: {
    loadingSelector: (state: RootState) => boolean;
    errorSelector: (state: RootState) => string | null;
    showLoadingSpinner?: boolean;
  }
) {
  const { loadingSelector, errorSelector, showLoadingSpinner = false } = config;

  return function WithLoadingComponent(props: Omit<P, keyof WithLoadingProps>) {
    const loading = useAppSelector(loadingSelector);
    const error = useAppSelector(errorSelector);

    if (loading && showLoadingSpinner) {
      return <LoadingSpinner />;
    }

    return (
      <WrappedComponent {...(props as P)} loading={loading} error={error} />
    );
  };
}

/**
 * Props injected by withEntityById HOC
 */
export interface WithEntityProps<T> {
  entity: T | null;
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

/**
 * HOC for fetching and displaying a single entity by ID
 *
 * @example
 * const StudentDetail = withEntityById(
 *   StudentDetailContent,
 *   {
 *     entitySelector: (state, id) => state.students.entities[id],
 *     loadingSelector: (state) => state.students.loading.detail.isLoading,
 *     errorSelector: (state) => state.students.loading.detail.error,
 *     fetchAction: fetchStudentById,
 *     idProp: 'studentId',
 *   }
 * );
 */
export function withEntityById<T, P extends WithEntityProps<T> & { [key: string]: any }>(
  WrappedComponent: ComponentType<P>,
  config: {
    entitySelector: (state: RootState, id: string) => T | undefined;
    loadingSelector: (state: RootState) => boolean;
    errorSelector: (state: RootState) => string | null;
    fetchAction: (id: string) => any;
    idProp?: string;
    showLoadingSpinner?: boolean;
    showErrorMessage?: boolean;
  }
) {
  const {
    entitySelector,
    loadingSelector,
    errorSelector,
    fetchAction,
    idProp = 'id',
    showLoadingSpinner = true,
    showErrorMessage = true,
  } = config;

  return function WithEntityComponent(props: Omit<P, keyof WithEntityProps<T>>) {
    const dispatch = useAppDispatch();
    const id = (props as any)[idProp] as string;

    const entity = useAppSelector(state => entitySelector(state, id)) || null;
    const loading = useAppSelector(loadingSelector);
    const error = useAppSelector(errorSelector);

    const refresh = () => {
      if (id) {
        dispatch(fetchAction(id));
      }
    };

    useEffect(() => {
      refresh();
    }, [id]);

    if (loading && showLoadingSpinner) {
      return <LoadingSpinner />;
    }

    if (error && showErrorMessage) {
      return <ErrorMessage message={error} onRetry={refresh} />;
    }

    if (!entity && !loading) {
      return <div>Entity not found</div>;
    }

    return (
      <WrappedComponent
        {...(props as P)}
        entity={entity}
        loading={loading}
        error={error}
        refresh={refresh}
      />
    );
  };
}

/**
 * HOC for components that require authentication
 *
 * @example
 * const ProtectedDashboard = withAuth(Dashboard, {
 *   requiredRole: 'nurse',
 *   redirectTo: '/login',
 * });
 */
export function withAuth<P extends object>(
  WrappedComponent: ComponentType<P>,
  config?: {
    requiredRole?: string;
    redirectTo?: string;
  }
) {
  const { requiredRole, redirectTo = '/login' } = config || {};

  return function WithAuthComponent(props: P) {
    const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated);
    const user = useAppSelector(state => state.auth.user);

    useEffect(() => {
      if (!isAuthenticated) {
        window.location.href = redirectTo;
      } else if (requiredRole && user?.role !== requiredRole) {
        window.location.href = '/access-denied';
      }
    }, [isAuthenticated, user]);

    if (!isAuthenticated) {
      return <LoadingSpinner />;
    }

    if (requiredRole && user?.role !== requiredRole) {
      return <div>Access Denied</div>;
    }

    return <WrappedComponent {...props} />;
  };
}

/**
 * HOC that provides optimistic updates for a component
 *
 * @example
 * const OptimisticStudentForm = withOptimisticUpdates(
 *   StudentForm,
 *   {
 *     optimisticAction: optimisticUpdateStudent,
 *     actualAction: updateStudent,
 *   }
 * );
 */
export function withOptimisticUpdates<P extends object>(
  WrappedComponent: ComponentType<P & { onUpdate: (data: any) => Promise<void> }>,
  config: {
    optimisticAction: (id: string, data: any) => any;
    actualAction: (params: { id: string; data: any }) => any;
  }
) {
  const { optimisticAction, actualAction } = config;

  return function WithOptimisticComponent(props: P) {
    const dispatch = useAppDispatch();

    const handleUpdate = async (id: string, data: any) => {
      // Optimistic update
      dispatch(optimisticAction(id, data));

      try {
        // Actual API call
        await dispatch(actualAction({ id, data })).unwrap();
      } catch (error) {
        // Redux will automatically revert the optimistic update on error
        throw error;
      }
    };

    return (
      <WrappedComponent
        {...props}
        onUpdate={(data: any) => handleUpdate(data.id, data)}
      />
    );
  };
}

/**
 * HOC that adds retry logic for failed operations
 *
 * @example
 * const StudentListWithRetry = withRetry(StudentList, {
 *   maxRetries: 3,
 *   retryDelay: 1000,
 * });
 */
export function withRetry<P extends object>(
  WrappedComponent: ComponentType<P>,
  config: {
    maxRetries?: number;
    retryDelay?: number;
    errorSelector: (state: RootState) => string | null;
    fetchAction: () => any;
  }
) {
  const { maxRetries = 3, retryDelay = 1000, errorSelector, fetchAction } = config;

  return function WithRetryComponent(props: P) {
    const dispatch = useAppDispatch();
    const error = useAppSelector(errorSelector);
    const [retryCount, setRetryCount] = React.useState(0);
    const [isRetrying, setIsRetrying] = React.useState(false);

    const handleRetry = async () => {
      if (retryCount >= maxRetries) return;

      setIsRetrying(true);
      setRetryCount(prev => prev + 1);

      await new Promise(resolve => setTimeout(resolve, retryDelay));

      dispatch(fetchAction());
      setIsRetrying(false);
    };

    const canRetry = error && retryCount < maxRetries;

    return (
      <div>
        <WrappedComponent {...props} />
        {error && (
          <div className="retry-banner">
            <p>Error: {error}</p>
            {canRetry && (
              <button onClick={handleRetry} disabled={isRetrying}>
                {isRetrying ? 'Retrying...' : `Retry (${retryCount}/${maxRetries})`}
              </button>
            )}
            {!canRetry && retryCount >= maxRetries && (
              <p>Maximum retry attempts reached. Please refresh the page.</p>
            )}
          </div>
        )}
      </div>
    );
  };
}

/**
 * HOC that automatically refreshes data at a specified interval
 *
 * @example
 * const AutoRefreshDashboard = withAutoRefresh(Dashboard, {
 *   intervalMs: 30000, // Refresh every 30 seconds
 *   fetchAction: fetchDashboardData,
 * });
 */
export function withAutoRefresh<P extends object>(
  WrappedComponent: ComponentType<P>,
  config: {
    intervalMs: number;
    fetchAction: () => any;
    enabledSelector?: (state: RootState) => boolean;
  }
) {
  const { intervalMs, fetchAction, enabledSelector } = config;

  return function WithAutoRefreshComponent(props: P) {
    const dispatch = useAppDispatch();
    const enabled = enabledSelector
      ? useAppSelector(enabledSelector)
      : true;

    useEffect(() => {
      if (!enabled) return;

      const interval = setInterval(() => {
        dispatch(fetchAction());
      }, intervalMs);

      return () => clearInterval(interval);
    }, [enabled]);

    return <WrappedComponent {...props} />;
  };
}

/**
 * Compose multiple HOCs together
 *
 * @example
 * const EnhancedComponent = compose(
 *   withAuth({ requiredRole: 'nurse' }),
 *   withReduxData(config),
 *   withAutoRefresh({ intervalMs: 30000 })
 * )(BaseComponent);
 */
export function compose<P>(...hocs: Array<(component: ComponentType<any>) => ComponentType<any>>) {
  return (component: ComponentType<P>) => {
    return hocs.reduceRight((acc, hoc) => hoc(acc), component);
  };
}
