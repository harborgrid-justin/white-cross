import React, { useState, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'react-hot-toast';
import { Provider } from 'react-redux';
import { store } from './stores/reduxStore';
import { AuthProvider } from './contexts/AuthContext';
import AppRoutes from './routes';
import GlobalErrorBoundary from './components/errors/GlobalErrorBoundary';
import BackendConnectionError from './components/BackendConnectionError';
import LoadingSpinner from './components/LoadingSpinner';
import { initializeApp, BootstrapResult } from './bootstrap';
import { queryClient, setupQueryPersistence } from './config/queryClient';

/**
 * Check if the backend API is reachable
 * This prevents the blank page issue when backend is not running
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

// Main App Component
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

  // Handle retry
  const handleRetry = async () => {
    setBackendStatus('checking');
    const isHealthy = await checkBackendHealth();
    setBackendStatus(isHealthy ? 'available' : 'unavailable');
  };

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

  // Backend is available and app is initialized, render the app normally
  return (
    <GlobalErrorBoundary enableAuditLogging>
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <AuthProvider>
            <BrowserRouter>
              <AppRoutes />
              <Toaster
                position="top-right"
                toastOptions={{
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
                }}
              />
              {import.meta.env.DEV && (
                <ReactQueryDevtools initialIsOpen={false} />
              )}
            </BrowserRouter>
          </AuthProvider>
        </Provider>
      </QueryClientProvider>
    </GlobalErrorBoundary>
  );
}

export default App;
