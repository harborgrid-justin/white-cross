/**
 * Test Providers - Comprehensive wrapper for testing React components
 * Includes Redux, React Query, Router, and other providers
 */

import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { configureStore, EnhancedStore } from '@reduxjs/toolkit';
import { RootState } from '@/store';

// Import all reducers
import authReducer from '@/store/slices/authSlice';
// Add other reducers as needed

interface ExtendedRenderOptions extends Omit<RenderOptions, 'queries'> {
  preloadedState?: Partial<RootState>;
  store?: EnhancedStore;
  queryClient?: QueryClient;
}

/**
 * Create a test store with preloaded state
 */
export function createTestStore(preloadedState?: Partial<RootState>): EnhancedStore {
  return configureStore({
    reducer: {
      auth: authReducer,
      // Add other reducers
    },
    preloadedState: preloadedState as any,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }),
  });
}

/**
 * Create a test query client with sensible defaults
 */
export function createTestQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: Infinity,
        staleTime: Infinity,
      },
      mutations: {
        retry: false,
      },
    },
    logger: {
      log: console.log,
      warn: console.warn,
      error: () => {}, // Suppress error logs in tests
    },
  });
}

/**
 * All Providers Wrapper for Testing
 */
export function AllTheProviders({
  children,
  store,
  queryClient,
}: {
  children: React.ReactNode;
  store?: EnhancedStore;
  queryClient?: QueryClient;
}) {
  const testStore = store || createTestStore();
  const testQueryClient = queryClient || createTestQueryClient();

  return (
    <Provider store={testStore}>
      <QueryClientProvider client={testQueryClient}>
        {children}
      </QueryClientProvider>
    </Provider>
  );
}

/**
 * Custom render function with all providers
 */
export function renderWithProviders(
  ui: ReactElement,
  {
    preloadedState,
    store = createTestStore(preloadedState),
    queryClient = createTestQueryClient(),
    ...renderOptions
  }: ExtendedRenderOptions = {}
) {
  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <AllTheProviders store={store} queryClient={queryClient}>
        {children}
      </AllTheProviders>
    );
  }

  return {
    store,
    queryClient,
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
  };
}

/**
 * Render with Redux only (no React Query)
 */
export function renderWithRedux(
  ui: ReactElement,
  {
    preloadedState,
    store = createTestStore(preloadedState),
    ...renderOptions
  }: ExtendedRenderOptions = {}
) {
  function Wrapper({ children }: { children: React.ReactNode }) {
    return <Provider store={store}>{children}</Provider>;
  }

  return {
    store,
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
  };
}

/**
 * Render with React Query only (no Redux)
 */
export function renderWithQuery(
  ui: ReactElement,
  {
    queryClient = createTestQueryClient(),
    ...renderOptions
  }: ExtendedRenderOptions = {}
) {
  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    );
  }

  return {
    queryClient,
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
  };
}

/**
 * Create mock authenticated user state
 */
export const createMockAuthState = (overrides = {}) => ({
  auth: {
    isAuthenticated: true,
    user: {
      id: '1',
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
      role: 'nurse',
      permissions: ['read:students', 'write:medications'],
    },
    token: 'mock-jwt-token',
    refreshToken: 'mock-refresh-token',
    isLoading: false,
    error: null,
    ...overrides,
  },
});

/**
 * Create mock unauthenticated user state
 */
export const createMockUnauthenticatedState = () => ({
  auth: {
    isAuthenticated: false,
    user: null,
    token: null,
    refreshToken: null,
    isLoading: false,
    error: null,
  },
});

/**
 * Wait for loading states to complete
 */
export const waitForLoadingToFinish = () => {
  return new Promise((resolve) => {
    setTimeout(resolve, 0);
  });
};

// Re-export everything from @testing-library/react
export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';
