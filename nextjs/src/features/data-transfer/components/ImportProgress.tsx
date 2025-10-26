/**
 * ImportProgress Component
 *
 * Real-time progress indicator for import operations with detailed metrics.
 */

'use client';

import React from 'react';
import type { ImportProgress as ImportProgressType } from '../types';

// ============================================================================
// Types
// ============================================================================

export interface ImportProgressProps {
  progress: ImportProgressType;
  onCancel?: () => void;
  onPause?: () => void;
  onResume?: () => void;
  showDetails?: boolean;
}

// ============================================================================
// Component
// ============================================================================

export function ImportProgress({
  progress,
  onCancel,
  onPause,
  onResume,
  showDetails = true,
}: ImportProgressProps) {
  /**
   * Formats time remaining
   */
  const formatTimeRemaining = (ms: number): string => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
      return `${hours}h ${minutes % 60}m remaining`;
    }
    if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s remaining`;
    }
    return `${seconds}s remaining`;
  };

  /**
   * Gets status color
   */
  const getStatusColor = (status: ImportProgressType['status']): string => {
    switch (status) {
      case 'pending':
        return 'text-gray-600';
      case 'validating':
        return 'text-blue-600';
      case 'processing':
        return 'text-blue-600';
      case 'completed':
        return 'text-green-600';
      case 'failed':
        return 'text-red-600';
      case 'cancelled':
        return 'text-gray-600';
      case 'paused':
        return 'text-yellow-600';
      default:
        return 'text-gray-600';
    }
  };

  /**
   * Gets progress bar color
   */
  const getProgressBarColor = (status: ImportProgressType['status']): string => {
    switch (status) {
      case 'processing':
        return 'bg-blue-500';
      case 'completed':
        return 'bg-green-500';
      case 'failed':
        return 'bg-red-500';
      case 'paused':
        return 'bg-yellow-500';
      default:
        return 'bg-blue-500';
    }
  };

  const isPaused = progress.status === 'paused';
  const isCompleted = progress.status === 'completed';
  const isFailed = progress.status === 'failed';
  const isActive = progress.status === 'processing' || progress.status === 'validating';

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Import Progress</h3>
          <p className={`text-sm font-medium ${getStatusColor(progress.status)}`}>
            {progress.status.charAt(0).toUpperCase() + progress.status.slice(1)}
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2">
          {isActive && onPause && (
            <button
              onClick={onPause}
              className="px-3 py-1 text-sm bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200"
            >
              Pause
            </button>
          )}

          {isPaused && onResume && (
            <button
              onClick={onResume}
              className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
            >
              Resume
            </button>
          )}

          {(isActive || isPaused) && onCancel && (
            <button
              onClick={onCancel}
              className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
          <span>
            {progress.currentRow.toLocaleString()} / {progress.totalRows.toLocaleString()} rows
          </span>
          <span>{Math.round(progress.percentage)}%</span>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${getProgressBarColor(progress.status)}`}
            style={{ width: `${Math.min(progress.percentage, 100)}%` }}
          >
            {isActive && (
              <div className="h-full w-full animate-pulse bg-white opacity-20" />
            )}
          </div>
        </div>
      </div>

      {/* Details */}
      {showDetails && (
        <div className="grid grid-cols-2 gap-4 text-sm">
          {/* Throughput */}
          <div>
            <span className="text-gray-500">Throughput:</span>
            <span className="ml-2 font-medium text-gray-900">
              {progress.throughput.toFixed(0)} rows/sec
            </span>
          </div>

          {/* Time remaining */}
          {progress.estimatedTimeRemaining && isActive && (
            <div>
              <span className="text-gray-500">Time remaining:</span>
              <span className="ml-2 font-medium text-gray-900">
                {formatTimeRemaining(progress.estimatedTimeRemaining)}
              </span>
            </div>
          )}

          {/* Errors */}
          {progress.errors > 0 && (
            <div>
              <span className="text-gray-500">Errors:</span>
              <span className="ml-2 font-medium text-red-600">{progress.errors}</span>
            </div>
          )}

          {/* Warnings */}
          {progress.warnings > 0 && (
            <div>
              <span className="text-gray-500">Warnings:</span>
              <span className="ml-2 font-medium text-yellow-600">{progress.warnings}</span>
            </div>
          )}
        </div>
      )}

      {/* Completion message */}
      {isCompleted && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded">
          <p className="text-sm text-green-800 font-medium">
            Import completed successfully!
          </p>
        </div>
      )}

      {/* Error message */}
      {isFailed && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded">
          <p className="text-sm text-red-800 font-medium">
            Import failed. Please check the error log for details.
          </p>
        </div>
      )}
    </div>
  );
}
