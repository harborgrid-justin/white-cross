'use client';

/**
 * WF-ERROR-001 | GenericDomainError.tsx - Generic Domain Error Component
 * Purpose: Reusable error boundary for domain-specific routes
 * Upstream: Route error.tsx files | Dependencies: React
 * Downstream: Better error recovery UX
 * Related: Route-specific error boundaries
 * Exports: GenericDomainError component
 * Last Updated: 2025-10-27 | File Type: .tsx
 */

import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface GenericDomainErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
  domain: string;
  domainIcon?: React.ReactNode;
  customMessage?: string;
  customRecoverySteps?: string[];
}

export const GenericDomainError: React.FC<GenericDomainErrorProps> = ({
  error,
  reset,
  domain,
  domainIcon,
  customMessage,
  customRecoverySteps,
}) => {
  const defaultMessage = `Unable to load ${domain.toLowerCase()} data. This may be due to a network issue or server problem.`;
  const message = customMessage || defaultMessage;

  const defaultRecoverySteps = [
    'Click "Try Again" to reload',
    'Check your network connection',
    'Contact IT support if the problem persists',
  ];

  const recoverySteps = customRecoverySteps || defaultRecoverySteps;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8">
        <div className="text-center">
          {/* Icon */}
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 dark:bg-red-900/30 mb-4">
            {domainIcon || (
              <AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-400" />
            )}
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {domain} Data Error
          </h1>

          {/* Message */}
          <p className="text-gray-600 dark:text-gray-400 mb-6">{message}</p>

          {/* Recovery Steps */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6 text-left">
            <p className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
              What you can do:
            </p>
            <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
              {recoverySteps.map((step, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-blue-600 dark:text-blue-400">•</span>
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <Button
              onClick={reset}
              variant="default"
              className="w-full flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </Button>

            <a
              href="/dashboard"
              className="block w-full text-center py-2.5 px-4 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="flex items-center justify-center gap-2">
                <Home className="w-4 h-4" />
                Return to Dashboard
              </div>
            </a>
          </div>

          {/* Error Details (Development) */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-900 rounded-lg text-left">
              <p className="text-xs font-mono text-gray-700 dark:text-gray-300 mb-2">
                <strong>Error:</strong> {error.message}
              </p>
              {error.digest && (
                <p className="text-xs font-mono text-gray-600 dark:text-gray-400">
                  <strong>Digest:</strong> {error.digest}
                </p>
              )}
            </div>
          )}

          {/* Production Error ID */}
          {process.env.NODE_ENV === 'production' && error.digest && (
            <p className="mt-6 text-xs text-gray-500 dark:text-gray-500">
              Error ID: {error.digest}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

GenericDomainError.displayName = 'GenericDomainError';

export default GenericDomainError;



