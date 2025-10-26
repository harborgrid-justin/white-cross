/**
 * WF-APP-001 | App.tsx - Root Application Component
 *
 * This is the main application component that orchestrates all providers,
 * initializes application services, and handles backend connectivity checks.
 * It implements a healthcare-grade initialization sequence ensuring all
 * security, audit, and monitoring services are ready before rendering the UI.
 *
 * @module App
 *
 * @remarks
 * **HIPAA Compliance**: This component ensures audit logging is initialized
 * before any PHI can be accessed. It also verifies backend health to prevent
 * unauthorized operation without proper API connectivity.
 *
 * **Initialization Sequence**:
 * 1. Bootstrap application services (security, audit, cache, monitoring)
 * 2. Setup query persistence (non-PHI only)
 * 3. Verify backend API health
 * 4. Render application with all providers
 *
 * **Provider Stack** (outermost to innermost):
 * - GlobalErrorBoundary: Catches and logs all React errors
 * - ApolloProvider: GraphQL client for healthcare data
 * - QueryClientProvider: TanStack Query for REST API data
 * - Redux Provider: Global state management
 * - AuthProvider: Authentication context
 * - BrowserRouter: Client-side routing
 *
 * @see {@link bootstrap.ts} for initialization logic
 * @see {@link config/apolloClient.ts} for GraphQL configuration
 * @see {@link config/queryClient.ts} for REST API configuration
 *
 * Last Updated: 2025-10-26 | File Type: .tsx
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ApolloProvider } from '@apollo/client/react';
import { Toaster } from 'react-hot-toast';
import { Provider } from 'react-redux';
import { store } from './stores';
import { AuthProvider } from './hooks/utilities/AuthContext';
import AppRoutes from './routes';
import { GlobalErrorBoundary } from './components/shared/errors';
import { BackendConnectionError } from './components/shared/errors';
import { LoadingSpinner } from './components/ui/feedback';
import { initializeApp, BootstrapResult } from './bootstrap';
import { queryClient, setupQueryPersistence } from './config/queryClient';
import { apolloClient } from './config/apolloClient';

/**
 * Backend health check status type.
 * @typedef {'checking' | 'available' | 'unavailable'} BackendStatus
 */
type BackendStatus = 'checking' | 'available' | 'unavailable';

/**
 * Bootstrap initialization status type.
 * @typedef {'initializing' | 'ready' | 'failed'} BootstrapStatus
 */
type BootstrapStatus = 'initializing' | 'ready' | 'failed';

/**
 * Checks if the backend API is reachable by calling the health endpoint.
 *
 * This function prevents the application from rendering with a blank page
 * when the backend is not running. It uses a 5-second timeout to avoid
 * hanging the initialization process.
 *
 * @returns {Promise<boolean>} True if backend is healthy, false otherwise
 *
 * @remarks
 * The health endpoint is accessed at `/health` (not `/api/health`). This
 * endpoint does not require authentication and should always be available
 * when the backend is running.
 *
 * @example
 * ```typescript
 * const isHealthy = await checkBackendHealth();
 * if (!isHealthy) {
 *   console.error('Backend is not available');
 * }
 * ```
 */
async function checkBackendHealth(): Promise<boolean> {
  try {
    // Health endpoint is at /health (not /api/health)
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';
    const healthUrl = baseUrl.replace('/api', '/health');
    
    const response = await fetch(healthUrl, {
      method: 'GET',
      signal: AbortSignal.timeout(5000), // 5 second timeout
    });
    return response.ok;
  } catch (error) {
    console.error('Backend health check failed:', error);
    return false;
  }
}

/**
 * Root Application Component
 *
 * Orchestrates the entire application initialization sequence and provider stack.
 * Manages backend connectivity, bootstrap status, and error states.
 *
 * @returns {JSX.Element} The root application component with all providers
 *
 * @remarks
 * **State Management**:
 * - `backendStatus`: Tracks backend API connectivity ('checking' | 'available' | 'unavailable')
 * - `bootstrapStatus`: Tracks initialization status ('initializing' | 'ready' | 'failed')
 * - `bootstrapError`: Stores initialization error message if bootstrap fails
 *
 * **Initialization Flow**:
 * 1. Component mounts → `useEffect` triggers initialization
 * 2. Call `initializeApp()` to bootstrap all services
 * 3. Setup query persistence for non-PHI data
 * 4. Check backend health via `/health` endpoint
 * 5. Render appropriate UI based on status
 *
 * **Error Handling**:
 * - Bootstrap failures → Show error screen with reload option
 * - Backend unavailable → Show connection error with retry
 * - Runtime errors → Caught by GlobalErrorBoundary
 *
 * @example
 * ```typescript
 * // In main.tsx
 * import App from './App';
 * ReactDOM.createRoot(document.getElementById('root')!).render(
 *   <React.StrictMode>
 *     <App />
 *   </React.StrictMode>
 * );
 * ```
 */
function App() {
  const [backendStatus, setBackendStatus] = useState<'checking' | 'available' | 'unavailable'>('checking');
  const [bootstrapStatus, setBootstrapStatus] = useState<'initializing' | 'ready' | 'failed'>('initializing');
  const [bootstrapError, setBootstrapError] = useState<string | null>(null);

  useEffect(() => {
    // Initialize application services
    const initializeApplication = async () => {
      try {
        // Initialize all services (security, cache, audit, etc.)
        const result: BootstrapResult = await initializeApp({
          enableAuditLogging: true,
          enableCaching: true,
          enableMonitoring: true,
          enablePersistence: true,
          debug: import.meta.env.DEV,
        });

        if (!result.success) {
          console.error('[App] Bootstrap failed:', result.errors);
          setBootstrapError(result.errors.join(', '));
          setBootstrapStatus('failed');
          return;
        }

        // Setup query persistence (non-PHI only)
        setupQueryPersistence();

        // Check backend health
        const isHealthy = await checkBackendHealth();
        setBackendStatus(isHealthy ? 'available' : 'unavailable');

        // Mark bootstrap as complete
        setBootstrapStatus('ready');

        if (import.meta.env.DEV) {
          console.log('[App] Application initialized successfully', result);
        }
      } catch (error) {
        console.error('[App] Application initialization failed:', error);
        setBootstrapError(error instanceof Error ? error.message : 'Unknown error');
        setBootstrapStatus('failed');
      }
    };

    initializeApplication();
  }, []);

  // Handle retry - memoized to prevent recreation on every render
  const handleRetry = useCallback(async () => {
    setBackendStatus('checking');
    const isHealthy = await checkBackendHealth();
    setBackendStatus(isHealthy ? 'available' : 'unavailable');
  }, []);

  // Show loading spinner while initializing or checking backend
  if (bootstrapStatus === 'initializing' || backendStatus === 'checking') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <LoadingSpinner />
          <p className="mt-4 text-gray-600">
            {bootstrapStatus === 'initializing' ? 'Initializing application...' : 'Checking backend connection...'}
          </p>
        </div>
      </div>
    );
  }

  // Show error if bootstrap failed
  if (bootstrapStatus === 'failed') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50 px-4">
        <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Initialization Failed</h1>
          <p className="text-gray-700 mb-4">
            The application failed to initialize properly. Please refresh the page or contact support if the problem persists.
          </p>
          {bootstrapError && (
            <div className="bg-red-50 p-3 rounded mb-4">
              <p className="text-sm text-red-800">{bootstrapError}</p>
            </div>
          )}
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  // Show error screen if backend is unavailable
  if (backendStatus === 'unavailable') {
    return <BackendConnectionError onRetry={handleRetry} />;
  }

  // Memoize Toaster options to prevent recreation on every render
  const toasterOptions = useMemo(() => ({
    duration: 4000,
    style: {
      background: '#363636',
      color: '#fff',
    },
    success: {
      duration: 3000,
      className: 'success-toast',
      iconTheme: {
        primary: '#10B981',
        secondary: '#fff',
      },
    },
    error: {
      duration: 5000,
      className: 'error-toast',
      iconTheme: {
        primary: '#EF4444',
        secondary: '#fff',
      },
    },
  }), []);

  // Backend is available and app is initialized, render the app normally
  return (
    <GlobalErrorBoundary enableAuditLogging>
      <ApolloProvider client={apolloClient}>
        <QueryClientProvider client={queryClient}>
          <Provider store={store}>
            <AuthProvider>
              <BrowserRouter>
                <AppRoutes />
                <Toaster
                  position="top-right"
                  toastOptions={toasterOptions}
                />
                {import.meta.env.DEV && (
                  <ReactQueryDevtools initialIsOpen={false} />
                )}
              </BrowserRouter>
            </AuthProvider>
          </Provider>
        </QueryClientProvider>
      </ApolloProvider>
    </GlobalErrorBoundary>
  );
}

export default App;
