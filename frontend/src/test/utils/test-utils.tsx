/**
 * Test Utilities
 * Custom render functions with all necessary providers
 */

import { ReactElement, ReactNode } from 'react';
import { render, RenderOptions, renderHook } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { configureStore, PreloadedState } from '@reduxjs/toolkit';
import type { RootState } from '@/stores/reduxStore';

// Import all reducers
import authSlice from '@/stores/slices/authSlice';
import { usersReducer } from '@/stores/slices/usersSlice';
import { districtsReducer } from '@/stores/slices/districtsReducer';
import { schoolsReducer } from '@/stores/slices/schoolsReducer';
import { settingsReducer } from '@/stores/slices/settingsReducer';
import { documentsReducer } from '@/stores/slices/documentsReducer';
import { communicationReducer } from '@/stores/slices/communicationReducer';
import { inventoryReducer } from '@/stores/slices/inventoryReducer';
import { reportsReducer } from '@/stores/slices/reportsReducer';
import incidentReportsSlice from '@/pages/incidents/store/incidentReportsSlice';
import { studentsReducer } from '@/pages/students/store/studentsSlice';
import { healthRecordsReducer } from '@/pages/students/store/healthRecordsSlice';
import { emergencyContactsReducer } from '@/pages/students/store/emergencyContactsSlice';
import { medicationsReducer } from '@/pages/medications/store/medicationsSlice';
import { appointmentsReducer } from '@/pages/appointments/store/appointmentsSlice';
import dashboardReducer from '@/pages/dashboard/store/dashboardSlice';
import complianceReducer from '@/pages/compliance/store/complianceSlice';
import accessControlReducer from '@/pages/access-control/store/accessControlSlice';
import enterpriseReducer from '@/stores/shared/enterprise/enterpriseFeatures';
import orchestrationReducer from '@/stores/shared/orchestration/crossDomainOrchestration';

/**
 * Interface for render options with Redux store
 */
interface ExtendedRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  preloadedState?: PreloadedState<RootState>;
  store?: ReturnType<typeof setupStore>;
  initialEntries?: string[];
  queryClient?: QueryClient;
}

/**
 * Create a test store with optional preloaded state
 */
export function setupStore(preloadedState?: PreloadedState<RootState>) {
  return configureStore({
    reducer: {
      auth: authSlice,
      dashboard: dashboardReducer,
      incidentReports: incidentReportsSlice,
      users: usersReducer,
      districts: districtsReducer,
      schools: schoolsReducer,
      settings: settingsReducer,
      students: studentsReducer,
      healthRecords: healthRecordsReducer,
      medications: medicationsReducer,
      appointments: appointmentsReducer,
      emergencyContacts: emergencyContactsReducer,
      communication: communicationReducer,
      documents: documentsReducer,
      inventory: inventoryReducer,
      reports: reportsReducer,
      compliance: complianceReducer,
      accessControl: accessControlReducer,
      enterprise: enterpriseReducer,
      orchestration: orchestrationReducer,
    },
    preloadedState,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
        immutableCheck: false,
      }),
  });
}

/**
 * Create a test query client
 */
export function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
        staleTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
    logger: {
      log: console.log,
      warn: console.warn,
      error: () => {}, // Suppress errors in tests
    },
  });
}

/**
 * Render component with all providers (Redux, React Query, Router)
 */
export function renderWithProviders(
  ui: ReactElement,
  {
    preloadedState,
    store = setupStore(preloadedState),
    initialEntries = ['/'],
    queryClient = createTestQueryClient(),
    ...renderOptions
  }: ExtendedRenderOptions = {}
) {
  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <MemoryRouter initialEntries={initialEntries}>
            {children}
          </MemoryRouter>
        </QueryClientProvider>
      </Provider>
    );
  }

  return {
    store,
    queryClient,
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
  };
}

/**
 * Render component with providers and BrowserRouter (for testing navigation)
 */
export function renderWithBrowserRouter(
  ui: ReactElement,
  {
    preloadedState,
    store = setupStore(preloadedState),
    queryClient = createTestQueryClient(),
    ...renderOptions
  }: ExtendedRenderOptions = {}
) {
  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            {children}
          </BrowserRouter>
        </QueryClientProvider>
      </Provider>
    );
  }

  return {
    store,
    queryClient,
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
  };
}

/**
 * Render hook with all providers
 */
export function renderHookWithProviders<TResult, TProps>(
  hook: (props: TProps) => TResult,
  {
    preloadedState,
    store = setupStore(preloadedState),
    queryClient = createTestQueryClient(),
  }: ExtendedRenderOptions = {}
) {
  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            {children}
          </BrowserRouter>
        </QueryClientProvider>
      </Provider>
    );
  }

  return {
    store,
    queryClient,
    ...renderHook(hook, { wrapper: Wrapper }),
  };
}

/**
 * Wait for a condition with timeout
 */
export async function waitForCondition(
  condition: () => boolean,
  timeout = 5000,
  interval = 50
): Promise<void> {
  const startTime = Date.now();

  while (!condition()) {
    if (Date.now() - startTime > timeout) {
      throw new Error('Timeout waiting for condition');
    }
    await new Promise(resolve => setTimeout(resolve, interval));
  }
}

// Re-export everything from @testing-library/react
export * from '@testing-library/react';
export { renderWithProviders as render };
