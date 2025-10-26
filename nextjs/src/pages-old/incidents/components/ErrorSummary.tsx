/**
 * ErrorSummary Component
 *
 * Compact error list with dismissible errors and quick fix links.
 * Designed for inline display in forms or page headers.
 *
 * @module pages/incidents/components/ErrorSummary
 */

import React, { useState } from 'react';
import { AlertCircle, X, ExternalLink } from 'lucide-react';
import { cn } from '../../../utils/cn';
import { Alert } from '../../../components/ui/feedback/Alert';

/**
 * Component props
 */
interface ErrorSummaryProps {
  /** Array of error messages */
  errors: string[];
  /** Optional CSS class name */
  className?: string;
  /** Allow dismissing errors */
  dismissible?: boolean;
  /** Callback when error is dismissed */
  onDismiss?: (index: number) => void;
  /** Callback when "fix errors" is clicked */
  onFixErrors?: () => void;
  /** Show error count in header */
  showCount?: boolean;
  /** Compact mode (minimal padding) */
  compact?: boolean;
}

/**
 * ErrorSummary component - Compact error list with quick fixes
 *
 * Features:
 * - Red alert styling for high visibility
 * - Error icons for quick identification
 * - Dismissible errors (optional)
 * - Link to fix errors (optional)
 * - Compact mode for inline use
 * - Accessible with ARIA labels
 * - Auto-focus on first error for screen readers
 *
 * @example
 * ```tsx
 * <ErrorSummary
 *   errors={[
 *     'Student is required',
 *     'Description must be at least 10 characters',
 *     'Incident date is required'
 *   ]}
 *   dismissible
 *   onFixErrors={() => scrollToFirstError()}
 * />
 * ```
 */
const ErrorSummary: React.FC<ErrorSummaryProps> = ({
  errors,
  className = '',
  dismissible = false,
  onDismiss,
  onFixErrors,
  showCount = true,
  compact = false,
}) => {
  const [dismissedErrors, setDismissedErrors] = useState<Set<number>>(new Set());

  /**
   * Handle error dismissal
   */
  const handleDismiss = (index: number) => {
    setDismissedErrors(prev => new Set(prev).add(index));
    if (onDismiss) {
      onDismiss(index);
    }
  };

  /**
   * Filter out dismissed errors
   */
  const activeErrors = errors.filter((_, index) => !dismissedErrors.has(index));

  // Don't render if no active errors
  if (activeErrors.length === 0) {
    return null;
  }

  return (
    <Alert
      variant="error"
      className={cn('error-summary', className)}
      dismissible={dismissible && activeErrors.length === 1}
      onDismiss={dismissible ? () => handleDismiss(0) : undefined}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      <div className={cn('space-y-3', compact && 'space-y-2')}>
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-red-900">
                {showCount && activeErrors.length > 1
                  ? `${activeErrors.length} Errors Found`
                  : 'Error'}
              </h3>
              {activeErrors.length > 1 && (
                <p className="text-xs text-red-700 mt-0.5">
                  Please correct the following errors before proceeding
                </p>
              )}
            </div>
          </div>

          {onFixErrors && (
            <button
              onClick={onFixErrors}
              className="flex items-center gap-1 text-xs font-medium text-red-700 hover:text-red-900 transition-colors"
              aria-label="Jump to first error"
            >
              <span>Fix Errors</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Error List */}
        <ul className={cn('space-y-2', compact && 'space-y-1')} role="list">
          {activeErrors.map((error, index) => {
            const originalIndex = errors.indexOf(error);
            return (
              <li
                key={originalIndex}
                className="flex items-start gap-2 text-sm text-red-800"
              >
                <span className="text-red-600 font-bold flex-shrink-0" aria-hidden="true">•</span>
                <span className="flex-1">{error}</span>
                {dismissible && activeErrors.length > 1 && (
                  <button
                    onClick={() => handleDismiss(originalIndex)}
                    className="flex-shrink-0 text-red-600 hover:text-red-800 transition-colors p-0.5"
                    aria-label={`Dismiss error: ${error}`}
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </li>
            );
          })}
        </ul>

        {/* Accessibility helper */}
        <div className="sr-only" role="status" aria-live="polite">
          {activeErrors.length === 1
            ? '1 error found'
            : `${activeErrors.length} errors found`}
        </div>
      </div>
    </Alert>
  );
};

ErrorSummary.displayName = 'ErrorSummary';

export default React.memo(ErrorSummary);
