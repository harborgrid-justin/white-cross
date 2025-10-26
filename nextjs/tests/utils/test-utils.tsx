import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

// Import all slices
import authReducer from '@/hooks/slices/authSlice';
import studentsReducer from '@/hooks/slices/studentsSlice';
import medicationsReducer from '@/hooks/slices/medicationsSlice';
import appointmentsReducer from '@/hooks/slices/appointmentsSlice';
import healthRecordsReducer from '@/hooks/slices/healthRecordsSlice';
import incidentReportsReducer from '@/hooks/slices/incidentReportsSlice';
import inventoryReducer from '@/hooks/slices/inventorySlice';
import reportsReducer from '@/hooks/slices/reportsSlice';
import settingsReducer from '@/hooks/slices/settingsSlice';
import usersReducer from '@/hooks/slices/usersSlice';
import schoolsReducer from '@/hooks/slices/schoolsSlice';
import districtsReducer from '@/hooks/slices/districtsSlice';
import documentsReducer from '@/hooks/slices/documentsSlice';
import emergencyContactsReducer from '@/hooks/slices/emergencyContactsSlice';
import communicationReducer from '@/hooks/slices/communicationSlice';

interface ExtendedRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  preloadedState?: any;
  store?: any;
  queryClient?: QueryClient;
}

/**
 * Custom render function that wraps components with necessary providers
 */
export function renderWithProviders(
  ui: ReactElement,
  {
    preloadedState = {},
    store = configureStore({
      reducer: {
        auth: authReducer,
        students: studentsReducer,
        medications: medicationsReducer,
        appointments: appointmentsReducer,
        healthRecords: healthRecordsReducer,
        incidentReports: incidentReportsReducer,
        inventory: inventoryReducer,
        reports: reportsReducer,
        settings: settingsReducer,
        users: usersReducer,
        schools: schoolsReducer,
        districts: districtsReducer,
        documents: documentsReducer,
        emergencyContacts: emergencyContactsReducer,
        communication: communicationReducer,
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
) {
  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          {children}
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
 * Create a test query client with sensible defaults
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
      log: () => {},
      warn: () => {},
      error: () => {},
    },
  });
}

/**
 * Create a test Redux store with preloaded state
 */
export function createTestStore(preloadedState = {}) {
  return configureStore({
    reducer: {
      auth: authReducer,
      students: studentsReducer,
      medications: medicationsReducer,
      appointments: appointmentsReducer,
      healthRecords: healthRecordsReducer,
      incidentReports: incidentReportsReducer,
      inventory: inventoryReducer,
      reports: reportsReducer,
      settings: settingsReducer,
      users: usersReducer,
      schools: schoolsReducer,
      districts: districtsReducer,
      documents: documentsReducer,
      emergencyContacts: emergencyContactsReducer,
      communication: communicationReducer,
    },
    preloadedState,
  });
}

/**
 * Wait for async operations to complete
 */
export const waitForAsync = () =>
  new Promise((resolve) => setTimeout(resolve, 0));

/**
 * Flush all pending promises
 */
export const flushPromises = () =>
  new Promise((resolve) => setImmediate(resolve));

// Re-export everything from React Testing Library
export * from '@testing-library/react';
export { renderWithProviders as render };
