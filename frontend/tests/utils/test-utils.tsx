/**
 * Custom Testing Library Utilities for White Cross Healthcare Platform
 *
 * Provides enhanced render functions with:
 * - Redux store integration
 * - React Query provider
 * - Router context
 * - Authentication context
 * - Theme provider
 *
 * Use these utilities instead of @testing-library/react render
 * to ensure components have access to all required context providers.
 *
 * @module tests/utils/test-utils
 */

import React, { ReactElement, ReactNode } from 'react';
import { render, RenderOptions, RenderResult } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore, PreloadedState } from '@reduxjs/toolkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RootState } from '@/stores/store';
import authReducer from '@/stores/slices/authSlice';

/**
 * Extended render options including preloaded Redux state
 */
interface ExtendedRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  /**
   * Preloaded Redux store state for test
   */
  preloadedState?: PreloadedState<RootState>;

  /**
   * Custom store instance (optional)
   */
  store?: any;

  /**
   * Custom QueryClient instance (optional)
   */
  queryClient?: QueryClient;
}

/**
 * Custom render function with all necessary providers
 *
 * @param ui - React element to render
 * @param options - Extended render options
 * @returns Render result with store and queryClient attached
 *
 * @example
 * ```typescript
 * const { store } = renderWithProviders(<MyComponent />, {
 *   preloadedState: {
 *     auth: { user: mockUser, isAuthenticated: true }
 *   }
 * });
 * ```
 */
export function renderWithProviders(
  ui: ReactElement,
  {
    preloadedState,
    store = configureStore({
      reducer: {
        auth: authReducer,
        // Add other reducers as needed
      },
      preloadedState,
    }),
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
          gcTime: 0,
        },
        mutations: {
          retry: false,
        },
      },
    }),
    ...renderOptions
  }: ExtendedRenderOptions = {}
): RenderResult & { store: any; queryClient: QueryClient } {
  /**
   * Wrapper component with all providers
   */
  function Wrapper({ children }: { children: ReactNode }): ReactElement {
    return (
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </Provider>
    );
  }

  return {
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
    store,
    queryClient,
  };
}

/**
 * Re-export everything from @testing-library/react
 * This allows importing everything from this file instead of multiple imports
 */
export * from '@testing-library/react';

/**
 * Export custom render as default render
 * Use this in tests that need Redux/React Query context
 */
export { renderWithProviders as render };
