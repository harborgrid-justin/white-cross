'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw, Home, ArrowLeft } from 'lucide-react';

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Student detail page error:', error);
  }, [error]);

  const getErrorMessage = (error: Error): string => {
    if (error.message.includes('fetch') || error.message.includes('network')) {
      return 'Unable to connect to the server. Please check your internet connection and try again.';
    }
    if (error.message.includes('404') || error.message.includes('not found')) {
      return 'The requested student could not be found. They may have been removed or you may not have access.';
    }
    if (error.message.includes('403') || error.message.includes('unauthorized')) {
      return 'You do not have permission to view this student\'s information.';
    }
    if (error.message.includes('500')) {
      return 'A server error occurred while loading student information. Please try again later.';
    }
    return 'An unexpected error occurred while loading student details.';
  };

  const getErrorType = (error: Error): 'network' | 'notFound' | 'permission' | 'server' | 'unknown' => {
    if (error.message.includes('fetch') || error.message.includes('network')) return 'network';
    if (error.message.includes('404') || error.message.includes('not found')) return 'notFound';
    if (error.message.includes('403') || error.message.includes('unauthorized')) return 'permission';
    if (error.message.includes('500')) return 'server';
    return 'unknown';
  };

  const errorType = getErrorType(error);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="min-h-96 flex items-center justify-center">
        <Card className="w-full max-w-2xl border-destructive">
          <CardHeader className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="rounded-full bg-destructive/10 p-4">
                <AlertTriangle className="h-12 w-12 text-destructive" />
              </div>
            </div>
            <CardTitle className="text-2xl text-destructive">
              Unable to Load Student Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-center text-muted-foreground">
              {getErrorMessage(error)}
            </p>

            {process.env.NODE_ENV === 'development' && (
              <details className="rounded-lg bg-muted p-4">
                <summary className="cursor-pointer font-medium text-sm text-foreground mb-2">
                  Technical Details (Development Only)
                </summary>
                <div className="mt-3 space-y-2 text-xs text-muted-foreground font-mono">
                  <div>
                    <strong>Error:</strong> {error.message}
                  </div>
                  {error.digest && (
                    <div>
                      <strong>Digest:</strong> {error.digest}
                    </div>
                  )}
                  {error.stack && (
                    <pre className="mt-2 overflow-x-auto whitespace-pre-wrap text-xs bg-background p-2 rounded border">
                      {error.stack}
                    </pre>
                  )}
                </div>
              </details>
            )}

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
              <Button
                onClick={reset}
                variant="default"
                className="gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Try Again
              </Button>

              <Button
                onClick={() => window.location.reload()}
                variant="outline"
                className="gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Reload Page
              </Button>

              <Link href="/students">
                <Button variant="outline" className="gap-2 w-full sm:w-auto">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Students
                </Button>
              </Link>

              {errorType === 'notFound' && (
                <Link href="/dashboard">
                  <Button variant="secondary" className="gap-2 w-full sm:w-auto">
                    <Home className="h-4 w-4" />
                    Go to Dashboard
                  </Button>
                </Link>
              )}
            </div>

            {errorType === 'permission' && (
              <div className="text-center text-sm text-muted-foreground border-t pt-4">
                <p>If you believe you should have access to this student's information,</p>
                <p>please contact your system administrator.</p>
              </div>
            )}

            {(errorType === 'network' || errorType === 'server') && (
              <div className="text-center text-sm text-muted-foreground border-t pt-4">
                <p>If this problem persists, please contact support or try again later.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
