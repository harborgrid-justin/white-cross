'use client';

/**
 * ErrorMessage Component
 *
 * Displays error messages with optional retry functionality.
 * Used throughout the application for consistent error UI.
 */

import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Button } from './ui/button';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  onRetry,
  className = '',
}) => {
  return (
    <div
      className={`flex items-center justify-center p-6 bg-red-50 border border-red-200 rounded-lg ${className}`}
      role="alert"
    >
      <div className="flex items-start gap-3 max-w-2xl">
        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-sm text-red-800">{message}</p>
          {onRetry && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRetry}
              className="mt-3"
            >
              Try Again
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorMessage;
