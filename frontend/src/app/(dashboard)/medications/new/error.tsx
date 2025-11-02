'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw, ArrowLeft, ShieldAlert, Save } from 'lucide-react';

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error('New medication page error:', error);
  }, [error]);

  const getErrorMessage = (error: Error): string => {
    if (error.message.includes('fetch') || error.message.includes('network')) {
      return 'Unable to connect to the server. Please check your internet connection and try again.';
    }
    if (error.message.includes('403') || error.message.includes('unauthorized')) {
      return 'You do not have permission to add new medications.';
    }
    if (error.message.includes('validation')) {
      return 'There was a validation error. Please check your form inputs.';
    }
    if (error.message.includes('duplicate')) {
      return 'A similar medication record already exists for this student.';
    }
    if (error.message.includes('500')) {
      return 'A server error occurred. Please try again later.';
    }
    return 'An unexpected error occurred while loading the new medication form.';
  };

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
              Unable to Load New Medication Form
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-center text-muted-foreground">
              {getErrorMessage(error)}
            </p>

            <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <ShieldAlert className="h-5 w-5 text-red-600 dark:text-red-500 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-red-800 dark:text-red-200">
                  <p className="font-medium mb-1">Medication Safety Critical</p>
                  <p>Adding new medications requires proper authorization and careful data entry. All medication records are audited for safety and compliance.</p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Save className="h-5 w-5 text-blue-600 dark:text-blue-500 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-blue-800 dark:text-blue-200">
                  <p className="font-medium mb-1">Data Not Lost</p>
                  <p>If you had started filling out the form, your browser may have saved some of the data. Try refreshing to recover it.</p>
                </div>
              </div>
            </div>

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
              <Button onClick={reset} variant="default" className="gap-2">
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

              <Link href="/medications">
                <Button variant="outline" className="gap-2 w-full sm:w-auto">
                  <ArrowLeft className="h-4 w-4" />
                  All Medications
                </Button>
              </Link>
            </div>

            <div className="text-center text-sm text-muted-foreground border-t pt-4">
              <p>If this problem persists, please contact support or your administrator.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
