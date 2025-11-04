'use client';

/**
 * Standardized Error Page Component
 *
 * Provides a consistent error display across the application using Lucide icons
 * and standardized button components. Supports different error types with
 * appropriate icons and messages.
 *
 * @module components/common/ErrorPage
 */

import React, { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Container } from '@/components/layouts/Container';
import {
  AlertCircle,
  RefreshCw,
  ArrowLeft,
  WifiOff,
  FileSearch,
  Lock,
  AlertTriangle,
  XCircle,
  Home,
  LucideIcon,
} from 'lucide-react';

interface ErrorPageProps {
  /** Error object from Next.js error boundary */
  error: Error & { digest?: string };
  /** Reset function to retry the operation */
  reset: () => void;
  /** Title to display on the error page */
  title?: string;
  /** Custom error message override */
  message?: string;
  /** Primary action button configuration */
  primaryAction?: {
    label: string;
    onClick: () => void;
    icon?: LucideIcon;
  };
  /** Secondary action button configuration */
  secondaryAction?: {
    label: string;
    href?: string;
    onClick?: () => void;
    icon?: LucideIcon;
  };
  /** Additional action button configuration */
  tertiaryAction?: {
    label: string;
    href?: string;
    onClick?: () => void;
    icon?: LucideIcon;
  };
  /** Context label for error logging (e.g., 'Appointments', 'Billing') */
  context?: string;
  /** Whether to show the Container wrapper */
  useContainer?: boolean;
  /** Additional footer message */
  footerMessage?: string;
}

/**
 * Get appropriate icon based on error type
 */
const getErrorIcon = (error: Error): LucideIcon => {
  const message = error.message.toLowerCase();

  if (message.includes('fetch') || message.includes('network') || message.includes('connection')) {
    return WifiOff;
  }
  if (message.includes('404') || message.includes('not found')) {
    return FileSearch;
  }
  if (message.includes('403') || message.includes('forbidden') || message.includes('permission')) {
    return Lock;
  }
  if (message.includes('500') || message.includes('server')) {
    return AlertTriangle;
  }
  return XCircle;
};

/**
 * Get user-friendly error message based on error type
 */
const getErrorMessage = (error: Error, customMessage?: string): string => {
  if (customMessage) return customMessage;

  const message = error.message.toLowerCase();

  if (message.includes('fetch') || message.includes('network') || message.includes('connection')) {
    return 'Unable to connect to the server. Please check your internet connection and try again.';
  }
  if (message.includes('404') || message.includes('not found')) {
    return 'The requested data could not be found.';
  }
  if (message.includes('403') || message.includes('forbidden') || message.includes('permission')) {
    return 'You do not have permission to view this data.';
  }
  if (message.includes('500') || message.includes('server')) {
    return 'A server error occurred. Please try again later.';
  }
  return 'An unexpected error occurred. Please try again.';
};

/**
 * ErrorPage Component
 *
 * Standardized error page with consistent design, proper ARIA labels,
 * and accessible action buttons using Lucide icons.
 *
 * @param props - ErrorPage component props
 * @returns JSX element representing the error page
 */
export const ErrorPage: React.FC<ErrorPageProps> = ({
  error,
  reset,
  title = 'Something went wrong',
  message,
  primaryAction,
  secondaryAction,
  tertiaryAction,
  context = 'Application',
  useContainer = true,
  footerMessage = 'If this problem persists, please contact support.',
}) => {
  useEffect(() => {
    // Log error to monitoring service
    console.error(`[${context} Error]`, error);

    // TODO: Send to external monitoring service
    // Example: Sentry.captureException(error, { tags: { context } });
  }, [error, context]);

  const ErrorIcon = getErrorIcon(error);
  const errorMessage = getErrorMessage(error, message);

  // Default actions if not provided
  const defaultPrimaryAction = {
    label: 'Try Again',
    onClick: reset,
    icon: RefreshCw,
  };

  const defaultSecondaryAction = {
    label: 'Go Home',
    href: '/dashboard',
    icon: Home,
  };

  const finalPrimaryAction = primaryAction || defaultPrimaryAction;
  const finalSecondaryAction = secondaryAction || defaultSecondaryAction;

  const content = (
    <div className="min-h-96 flex items-center justify-center py-8">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <div
            className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 dark:bg-red-900/20 mb-4"
            aria-hidden="true"
          >
            <ErrorIcon className="h-8 w-8 text-red-600 dark:text-red-400" aria-hidden="true" />
          </div>
          <CardTitle className="text-xl text-red-600 dark:text-red-400">
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <p className="text-gray-600 dark:text-gray-400">
            {errorMessage}
          </p>

          {/* Development error details */}
          {process.env.NODE_ENV === 'development' && (
            <details className="text-left bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
              <summary className="font-medium text-sm cursor-pointer text-gray-700 dark:text-gray-300">
                Technical Details (Development Only)
              </summary>
              <div className="mt-2 text-xs text-gray-600 dark:text-gray-400 font-mono">
                <p><strong>Error:</strong> {error.message}</p>
                {error.digest && <p><strong>Digest:</strong> {error.digest}</p>}
                {error.stack && (
                  <pre className="mt-2 whitespace-pre-wrap text-xs overflow-auto max-h-40">
                    {error.stack}
                  </pre>
                )}
              </div>
            </details>
          )}

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {/* Primary action */}
            <Button
              variant="default"
              onClick={finalPrimaryAction.onClick}
              aria-label={finalPrimaryAction.label}
            >
              {finalPrimaryAction.icon && (
                <finalPrimaryAction.icon className="h-4 w-4 mr-2" aria-hidden="true" />
              )}
              {finalPrimaryAction.label}
            </Button>

            {/* Secondary action */}
            {finalSecondaryAction.href ? (
              <Link href={finalSecondaryAction.href}>
                <Button
                  variant="secondary"
                  aria-label={finalSecondaryAction.label}
                >
                  {finalSecondaryAction.icon && (
                    <finalSecondaryAction.icon className="h-4 w-4 mr-2" aria-hidden="true" />
                  )}
                  {finalSecondaryAction.label}
                </Button>
              </Link>
            ) : finalSecondaryAction.onClick ? (
              <Button
                variant="secondary"
                onClick={finalSecondaryAction.onClick}
                aria-label={finalSecondaryAction.label}
              >
                {finalSecondaryAction.icon && (
                  <finalSecondaryAction.icon className="h-4 w-4 mr-2" aria-hidden="true" />
                )}
                {finalSecondaryAction.label}
              </Button>
            ) : null}

            {/* Tertiary action */}
            {tertiaryAction && (
              tertiaryAction.href ? (
                <Link href={tertiaryAction.href}>
                  <Button
                    variant="ghost"
                    size="sm"
                    aria-label={tertiaryAction.label}
                  >
                    {tertiaryAction.icon && (
                      <tertiaryAction.icon className="h-4 w-4 mr-2" aria-hidden="true" />
                    )}
                    {tertiaryAction.label}
                  </Button>
                </Link>
              ) : tertiaryAction.onClick ? (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={tertiaryAction.onClick}
                  aria-label={tertiaryAction.label}
                >
                  {tertiaryAction.icon && (
                    <tertiaryAction.icon className="h-4 w-4 mr-2" aria-hidden="true" />
                  )}
                  {tertiaryAction.label}
                </Button>
              ) : null
            )}
          </div>

          {/* Footer message */}
          <div className="text-sm text-gray-500 dark:text-gray-400">
            <p>{footerMessage}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return useContainer ? <Container>{content}</Container> : content;
};

export default ErrorPage;
