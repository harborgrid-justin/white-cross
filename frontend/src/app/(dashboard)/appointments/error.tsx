'use client';

import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Container } from '@/components/layouts/Container';

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Appointments page error:', error);
  }, [error]);

  const getErrorMessage = (error: Error): string => {
    if (error.message.includes('fetch')) {
      return 'Unable to connect to the server. Please check your internet connection and try again.';
    }
    if (error.message.includes('404')) {
      return 'The requested appointment data could not be found.';
    }
    if (error.message.includes('403')) {
      return 'You do not have permission to view this appointment data.';
    }
    if (error.message.includes('500')) {
      return 'A server error occurred. Please try again later.';
    }
    return 'An unexpected error occurred while loading appointment data.';
  };

  const getErrorIcon = (error: Error): string => {
    if (error.message.includes('fetch') || error.message.includes('network')) {
      return '🌐';
    }
    if (error.message.includes('404')) {
      return '🔍';
    }
    if (error.message.includes('403')) {
      return '🔒';
    }
    if (error.message.includes('500')) {
      return '⚠️';
    }
    return '❌';
  };

  return (
    <Container>
      <div className="min-h-96 flex items-center justify-center">
        <Card className="w-full max-w-lg">
          <CardHeader className="text-center">
            <div className="text-6xl mb-4">{getErrorIcon(error)}</div>
            <CardTitle className="text-xl text-red-600">
              Something went wrong
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <p className="text-gray-600">
              {getErrorMessage(error)}
            </p>

            {process.env.NODE_ENV === 'development' && (
              <details className="text-left bg-gray-100 p-4 rounded-lg">
                <summary className="font-medium text-sm cursor-pointer text-gray-700">
                  Technical Details (Development)
                </summary>
                <div className="mt-2 text-xs text-gray-600 font-mono">
                  <p><strong>Error:</strong> {error.message}</p>
                  {error.digest && <p><strong>Digest:</strong> {error.digest}</p>}
                  {error.stack && (
                    <pre className="mt-2 whitespace-pre-wrap text-xs">
                      {error.stack}
                    </pre>
                  )}
                </div>
              </details>
            )}

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={reset}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              >
                Try Again
              </button>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
              >
                Refresh Page
              </button>
              <a
                href="/appointments"
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors text-center"
              >
                Go to Appointments
              </a>
            </div>

            <div className="text-sm text-gray-500">
              <p>If this problem persists, please contact support.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
}


