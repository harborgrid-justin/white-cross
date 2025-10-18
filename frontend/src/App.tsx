import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'react-hot-toast';
import { Provider } from 'react-redux';
import { store } from './stores/reduxStore';
import { AuthProvider } from './contexts/AuthContext';
import AppRoutes from './routes';
import ErrorBoundary from './components/ErrorBoundary';
import BackendConnectionError from './components/BackendConnectionError';
import LoadingSpinner from './components/LoadingSpinner';
import { apiInstance } from './services';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      retry: (failureCount, error: any) => {
        // Don't retry on 4xx errors except 429 (rate limit)
        if (error?.status >= 400 && error?.status < 500 && error?.status !== 429) {
          return false;
        }
        return failureCount < 3;
      },
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
});

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

  useEffect(() => {
    // Check backend health on mount
    const verifyBackend = async () => {
      const isHealthy = await checkBackendHealth();
      setBackendStatus(isHealthy ? 'available' : 'unavailable');
    };

    verifyBackend();
  }, []);

  // Handle retry
  const handleRetry = async () => {
    setBackendStatus('checking');
    const isHealthy = await checkBackendHealth();
    setBackendStatus(isHealthy ? 'available' : 'unavailable');
  };

  // Show loading spinner while checking backend
  if (backendStatus === 'checking') {
    return <LoadingSpinner />;
  }

  // Show error screen if backend is unavailable
  if (backendStatus === 'unavailable') {
    return <BackendConnectionError onRetry={handleRetry} />;
  }

  // Backend is available, render the app normally
  return (
    <ErrorBoundary>
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
    </ErrorBoundary>
  );
}

export default App;
