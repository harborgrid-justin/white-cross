'use client';

import { useEffect } from 'react';
import { AlertTriangle, RefreshCw, Home, Phone } from 'lucide-react';

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    // Log the critical error to your monitoring service
    console.error('Critical dashboard error:', error);
    
    // You might want to send this to your error monitoring service
    // like Sentry, DataDog, etc.
  }, [error]);

  return (
    <html>
      <body>
        <div className="min-h-screen bg-red-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-6">
                <AlertTriangle className="h-8 w-8 text-red-600" aria-hidden="true" />
              </div>
              <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
                Critical System Error
              </h1>
              <p className="text-gray-600 mb-8">
                A critical error occurred in the healthcare platform
              </p>
            </div>
          </div>

          <div className="sm:mx-auto sm:w-full sm:max-w-lg">
            <div className="bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10 border border-red-200">
              {/* Critical Error Alert */}
              <div className="rounded-md bg-red-100 p-4 mb-6 border border-red-200">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertTriangle className="h-5 w-5 text-red-500" aria-hidden="true" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">
                      System Unavailable
                    </h3>
                    <div className="mt-2 text-sm text-red-700">
                      <p className="mb-2">
                        The White Cross Healthcare Platform is experiencing technical difficulties.
                        Our technical team has been automatically notified.
                      </p>
                      {process.env.NODE_ENV === 'development' && (
                        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded">
                          <p className="text-xs font-mono text-red-800 break-all">
                            <strong>Dev Error:</strong> {error.message}
                          </p>
                          {error.digest && (
                            <p className="text-xs font-mono text-red-600 mt-1">
                              ID: {error.digest}
                            </p>
                          )}
                        </div>
                      )}
                      {error.digest && process.env.NODE_ENV === 'production' && (
                        <p className="text-xs font-mono text-red-600 mt-2">
                          Error Reference: {error.digest}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Emergency Information */}
              <div className="rounded-md bg-yellow-50 p-4 mb-6 border border-yellow-200">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <Phone className="h-5 w-5 text-yellow-600" aria-hidden="true" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">
                      For Medical Emergencies
                    </h3>
                    <div className="mt-1 text-sm text-yellow-700">
                      <p>
                        If this is a medical emergency, call 911 immediately.
                        For urgent healthcare needs, contact your school nurse directly.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-4">
                <button
                  onClick={reset}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  <RefreshCw className="h-4 w-4 mr-2" aria-hidden="true" />
                  Try to Recover
                </button>

                <button
                  onClick={() => window.location.href = '/'}
                  className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  <Home className="h-4 w-4 mr-2" aria-hidden="true" />
                  Return to Home Page
                </button>

                <button
                  onClick={() => window.location.reload()}
                  className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Reload Page
                </button>
              </div>

              {/* Support Information */}
              <div className="mt-8 border-t border-gray-200 pt-6">
                <div className="text-center">
                  <h3 className="text-sm font-medium text-gray-900 mb-3">
                    Technical Support
                  </h3>
                  <div className="space-y-2 text-xs text-gray-600">
                    <p>White Cross Healthcare Platform</p>
                    <p>Technical Emergency Line: 1-800-HELP-NOW</p>
                    <p>Email: critical-support@whitecross.healthcare</p>
                    {error.digest && (
                      <p className="font-mono bg-gray-100 p-2 rounded mt-3">
                        Please reference error ID: {error.digest}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}