'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw, ArrowLeft, Home } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const cn = (...inputs: (string | undefined)[]) => twMerge(clsx(inputs));

/**
 * ErrorState props
 */
export interface ErrorStateProps {
  /** Error title */
  title?: string;
  /** Error message/description */
  message?: string;
  /** Error object */
  error?: Error | null;
  /** Show technical error details */
  showDetails?: boolean;
  /** Retry handler */
  onRetry?: () => void;
  /** Go back handler */
  onGoBack?: () => void;
  /** Go home handler */
  onGoHome?: () => void;
  /** Custom action button */
  customAction?: {
    label: string;
    onClick: () => void;
    icon?: React.ElementType;
  };
  /** Error variant */
  variant?: 'error' | 'warning' | 'network' | '404' | '403' | '500';
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Custom className */
  className?: string;
  /** Hide icon */
  hideIcon?: boolean;
}

const variantConfig = {
  error: {
    title: 'Something went wrong',
    message: 'An unexpected error occurred. Please try again.',
    iconColor: 'text-red-500 dark:text-red-400',
    bgColor: 'bg-red-100 dark:bg-red-900/20'
  },
  warning: {
    title: 'Warning',
    message: 'Please review the information and try again.',
    iconColor: 'text-yellow-500 dark:text-yellow-400',
    bgColor: 'bg-yellow-100 dark:bg-yellow-900/20'
  },
  network: {
    title: 'Connection Error',
    message: 'Unable to connect to the server. Please check your internet connection.',
    iconColor: 'text-orange-500 dark:text-orange-400',
    bgColor: 'bg-orange-100 dark:bg-orange-900/20'
  },
  '404': {
    title: 'Not Found',
    message: 'The page or resource you are looking for could not be found.',
    iconColor: 'text-gray-500 dark:text-gray-400',
    bgColor: 'bg-gray-100 dark:bg-gray-800'
  },
  '403': {
    title: 'Access Denied',
    message: 'You do not have permission to access this resource.',
    iconColor: 'text-red-500 dark:text-red-400',
    bgColor: 'bg-red-100 dark:bg-red-900/20'
  },
  '500': {
    title: 'Server Error',
    message: 'The server encountered an error. Please try again later.',
    iconColor: 'text-red-500 dark:text-red-400',
    bgColor: 'bg-red-100 dark:bg-red-900/20'
  }
} as const;

/**
 * ErrorState - Display error state with optional retry and navigation actions
 *
 * @example
 * ```tsx
 * <ErrorState
 *   variant="network"
 *   title="Connection Lost"
 *   message="Unable to load student data"
 *   onRetry={() => refetch()}
 *   showDetails={isDev}
 *   error={error}
 * />
 * ```
 */
export const ErrorState: React.FC<ErrorStateProps> = ({
  title,
  message,
  error,
  showDetails = false,
  onRetry,
  onGoBack,
  onGoHome,
  customAction,
  variant = 'error',
  size = 'md',
  className,
  hideIcon = false
}) => {
  const config = variantConfig[variant];
  const displayTitle = title || config.title;
  const displayMessage = message || config.message;

  const sizeClasses = {
    sm: {
      container: 'py-8',
      icon: 'h-12 w-12',
      title: 'text-base',
      message: 'text-sm',
      details: 'text-xs'
    },
    md: {
      container: 'py-12',
      icon: 'h-16 w-16',
      title: 'text-lg',
      message: 'text-base',
      details: 'text-sm'
    },
    lg: {
      container: 'py-16',
      icon: 'h-24 w-24',
      title: 'text-xl',
      message: 'text-lg',
      details: 'text-base'
    }
  };

  const sizes = sizeClasses[size];

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center',
        sizes.container,
        className
      )}
      role="alert"
      aria-live="assertive"
    >
      {/* Icon */}
      {!hideIcon && (
        <div
          className={cn(
            'mb-6 rounded-full p-4 animate-fadeIn',
            config.bgColor
          )}
        >
          <AlertCircle
            className={cn(sizes.icon, config.iconColor)}
            aria-hidden="true"
          />
        </div>
      )}

      {/* Title */}
      <h2
        className={cn(
          'font-bold text-gray-900 dark:text-gray-100 mb-2',
          sizes.title
        )}
      >
        {displayTitle}
      </h2>

      {/* Message */}
      <p
        className={cn(
          'text-gray-600 dark:text-gray-400 mb-6 max-w-md',
          sizes.message
        )}
      >
        {displayMessage}
      </p>

      {/* Error Details (for development) */}
      {showDetails && error && (
        <details className="mb-6 max-w-2xl w-full">
          <summary className={cn(
            'cursor-pointer text-left font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 mb-2',
            sizes.details
          )}>
            Technical Details
          </summary>
          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 text-left overflow-auto">
            <p className={cn('font-mono text-red-600 dark:text-red-400 mb-2', sizes.details)}>
              {error.name}: {error.message}
            </p>
            {error.stack && (
              <pre className={cn('font-mono text-gray-600 dark:text-gray-400 whitespace-pre-wrap', sizes.details)}>
                {error.stack}
              </pre>
            )}
          </div>
        </details>
      )}

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        {onRetry && (
          <Button
            variant="default"
            onClick={onRetry}
            className="transition-all duration-200 hover:scale-105 active:scale-95"
          >
            <RefreshCw className="h-4 w-4 mr-2" aria-hidden="true" />
            Try Again
          </Button>
        )}
        {onGoBack && (
          <Button
            variant="outline"
            onClick={onGoBack}
            className="transition-all duration-200 hover:scale-105 active:scale-95"
          >
            <ArrowLeft className="h-4 w-4 mr-2" aria-hidden="true" />
            Go Back
          </Button>
        )}
        {onGoHome && (
          <Button
            variant="ghost"
            onClick={onGoHome}
            className="transition-all duration-200 hover:scale-105 active:scale-95"
          >
            <Home className="h-4 w-4 mr-2" aria-hidden="true" />
            Go Home
          </Button>
        )}
        {customAction && (
          <Button
            variant="secondary"
            onClick={customAction.onClick}
            className="transition-all duration-200 hover:scale-105 active:scale-95"
          >
            {customAction.icon && <customAction.icon className="h-4 w-4 mr-2" aria-hidden="true" />}
            {customAction.label}
          </Button>
        )}
      </div>
    </div>
  );
};

ErrorState.displayName = 'ErrorState';

export default React.memo(ErrorState);



