'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { AlertTriangle, RefreshCw, ExternalLink } from 'lucide-react';

interface BackendConnectionErrorProps {
  onRetry?: () => void | Promise<void>;
  apiUrl?: string;
}

/**
 * BackendConnectionError Component
 *
 * Displays a user-friendly error message when the backend API is unreachable.
 * Provides clear troubleshooting steps and retry functionality.
 * Performance: React.memo with useCallback for handlers and useMemo for computed values
 *
 * This addresses the blank page issue when the backend cannot connect to the database.
 */
const BackendConnectionError = React.memo<BackendConnectionErrorProps>(({
  onRetry,
  apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api'
}) => {
  const [isRetrying, setIsRetrying] = useState(false);

  // Memoize computed URLs to avoid recalculation on every render
  const { backendUrl, healthUrl } = useMemo(() => ({
    backendUrl: apiUrl.replace('/api', ''),
    healthUrl: `${apiUrl.replace('/api', '')}/health`
  }), [apiUrl]);

  // Memoize retry handler to prevent recreation on every render
  const handleRetry = useCallback(async () => {
    if (!onRetry) {
      window.location.reload();
      return;
    }

    setIsRetrying(true);
    try {
      await onRetry();
    } finally {
      // Keep the spinner for a moment to show activity
      setTimeout(() => setIsRetrying(false), 500);
    }
  }, [onRetry]);

  // Memoize reload handler
  const handleReload = useCallback(() => {
    window.location.reload();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg p-8">
        {/* Header */}
        <div className="flex items-center mb-6">
          <div className="flex-shrink-0">
            <AlertTriangle className="h-12 w-12 text-red-500" />
          </div>
          <div className="ml-4">
            <h1 className="text-2xl font-bold text-gray-900">
              Cannot Connect to Backend
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              The application server is not responding
            </p>
          </div>
        </div>

        {/* Description */}
        <div className="mb-6">
          <p className="text-gray-700 mb-4">
            The frontend loaded successfully, but cannot reach the backend API server. 
            This usually means the backend is not running or cannot connect to the database.
          </p>
        </div>

        {/* Troubleshooting Steps */}
        <div className="mb-6 bg-gray-50 rounded-lg p-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">
            🔧 Troubleshooting Steps
          </h2>
          <ol className="space-y-3 text-sm text-gray-700">
            <li className="flex items-start">
              <span className="font-semibold mr-2 text-gray-900">1.</span>
              <div>
                <strong>Check if the backend is running:</strong>
                <ul className="list-disc ml-5 mt-1 space-y-1">
                  <li>Open a terminal and navigate to the backend directory</li>
                  <li>Run: <code className="bg-gray-200 px-2 py-1 rounded text-xs">npm run dev</code></li>
                  <li>Backend should start on <code className="bg-gray-200 px-2 py-1 rounded text-xs">http://localhost:3001</code></li>
                </ul>
              </div>
            </li>
            <li className="flex items-start">
              <span className="font-semibold mr-2 text-gray-900">2.</span>
              <div>
                <strong>Verify database connection:</strong>
                <ul className="list-disc ml-5 mt-1 space-y-1">
                  <li>Run: <code className="bg-gray-200 px-2 py-1 rounded text-xs">cd backend && npm run db:test</code></li>
                  <li>If it fails, check your <code className="bg-gray-200 px-2 py-1 rounded text-xs">backend/.env</code> file</li>
                  <li>Make sure DATABASE_URL is correct</li>
                </ul>
              </div>
            </li>
            <li className="flex items-start">
              <span className="font-semibold mr-2 text-gray-900">3.</span>
              <div>
                <strong>Check if database is running:</strong>
                <ul className="list-disc ml-5 mt-1 space-y-1">
                  <li>For Docker: <code className="bg-gray-200 px-2 py-1 rounded text-xs">docker-compose up -d postgres redis</code></li>
                  <li>Verify with: <code className="bg-gray-200 px-2 py-1 rounded text-xs">docker ps</code></li>
                </ul>
              </div>
            </li>
          </ol>
        </div>

        {/* Quick Links */}
        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-blue-900 mb-2">
            📚 Need Help?
          </h3>
          <div className="space-y-2 text-sm">
            <a 
              href="/docs/BLANK_PAGE_FIX.md" 
              target="_blank"
              className="flex items-center text-blue-700 hover:text-blue-900"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              View Quick Fix Guide (BLANK_PAGE_FIX.md)
            </a>
            <a 
              href="/docs/DATABASE_CONNECTION_GUIDE.md" 
              target="_blank"
              className="flex items-center text-blue-700 hover:text-blue-900"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              View Detailed Setup Guide (DATABASE_CONNECTION_GUIDE.md)
            </a>
          </div>
        </div>

        {/* Technical Details */}
        {import.meta.env.DEV && (
          <details className="mb-6">
            <summary className="text-sm text-gray-600 cursor-pointer hover:text-gray-800 font-medium">
              Technical Details (Development Mode)
            </summary>
            <div className="mt-3 p-3 bg-gray-100 rounded text-xs font-mono">
              <div className="space-y-1">
                <div>
                  <span className="text-gray-600">API Base URL:</span>{' '}
                  <span className="text-gray-900">{apiUrl}</span>
                </div>
                <div>
                  <span className="text-gray-600">Health Check:</span>{' '}
                  <a 
                    href={healthUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    {healthUrl}
                  </a>
                </div>
                <div className="mt-2 pt-2 border-t border-gray-300">
                  <span className="text-gray-600">Expected backend response:</span>
                  <pre className="mt-1 text-gray-700">
{`{
  "status": "OK",
  "timestamp": "...",
  "uptime": ...
}`}
                  </pre>
                </div>
              </div>
            </div>
          </details>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <button
            onClick={handleRetry}
            disabled={isRetrying}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-4 rounded-md transition duration-150 ease-in-out flex items-center justify-center"
          >
            {isRetrying ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Retrying...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry Connection
              </>
            )}
          </button>
          <button
            onClick={handleReload}
            className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-3 px-4 rounded-md transition duration-150 ease-in-out"
          >
            Reload Page
          </button>
        </div>

        {/* Success Indicator */}
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <h3 className="text-sm font-semibold text-green-900 mb-2">
            ✅ Success Indicators
          </h3>
          <div className="text-sm text-green-800 space-y-1">
            <p>When backend is running correctly, you should see:</p>
            <ul className="list-disc ml-5 mt-2 space-y-1">
              <li>Backend log: <span className="font-mono text-xs">"✅ White Cross API Server running on http://localhost:3001"</span></li>
              <li>Health check returns: <span className="font-mono text-xs">{`{"status":"OK",...}`}</span></li>
              <li>Login page loads (not blank)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
});

// Display name for debugging
BackendConnectionError.displayName = 'BackendConnectionError';

export default BackendConnectionError;
