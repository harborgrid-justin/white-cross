/**
 * @fileoverview Error state component for profile errors
 * @module app/(dashboard)/profile/_components/ui/ErrorState
 * @category Profile - UI Components
 */

'use client';

import { AlertTriangle } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

/**
 * Error state component with retry functionality
 * Displays error messages and optional retry button
 */
export function ErrorState({
  title = 'Error Loading Profile',
  message,
  onRetry
}: ErrorStateProps) {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <AlertTriangle className="h-12 w-12 text-red-600 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-4">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        )}
      </div>
    </div>
  );
}
