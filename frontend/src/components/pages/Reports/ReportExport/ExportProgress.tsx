'use client';

import React from 'react';
import type { ExportStatus } from './types';

/**
 * Props for the ExportProgress component
 */
export interface ExportProgressProps {
  /** Progress percentage (0-100) */
  progress: number;
  /** Current export status */
  status: ExportStatus;
  /** Estimated completion time */
  estimatedCompletion?: string;
  /** Whether to show progress label */
  showLabel?: boolean;
  /** Custom CSS classes */
  className?: string;
}

/**
 * ExportProgress Component
 *
 * Displays export job progress with a visual progress bar.
 * Shows different colors based on export status and optional completion time.
 *
 * @param props - ExportProgress component props
 * @returns JSX element representing the progress bar
 */
export const ExportProgress: React.FC<ExportProgressProps> = React.memo(({
  progress,
  status,
  estimatedCompletion,
  showLabel = true,
  className = ''
}) => {
  // Determine progress bar color based on status
  const getProgressColor = (): string => {
    switch (status) {
      case 'completed':
        return 'bg-green-600';
      case 'failed':
        return 'bg-red-600';
      case 'cancelled':
        return 'bg-gray-600';
      case 'processing':
        return 'bg-blue-600';
      case 'pending':
        return 'bg-yellow-600';
      default:
        return 'bg-blue-600';
    }
  };

  // Clamp progress between 0 and 100
  const clampedProgress = Math.max(0, Math.min(100, progress));

  return (
    <div className={`space-y-1 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${getProgressColor()}`}
            style={{ width: `${clampedProgress}%` }}
            role="progressbar"
            aria-valuenow={clampedProgress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Export progress: ${clampedProgress}%`}
          />
        </div>
        {showLabel && (
          <span className="text-sm text-gray-600 min-w-[3rem] text-right">
            {clampedProgress}%
          </span>
        )}
      </div>
      {estimatedCompletion && status === 'processing' && (
        <p className="text-xs text-gray-500">
          Estimated completion: {new Date(estimatedCompletion).toLocaleTimeString()}
        </p>
      )}
    </div>
  );
});

ExportProgress.displayName = 'ExportProgress';

export default ExportProgress;
