'use client';

import React from 'react';
import { Loader, AlertCircle, RefreshCw, FileText } from 'lucide-react';
import type { ReportFilter } from './ReportList.types';

/**
 * Props for LoadingState component
 */
interface LoadingStateProps {
  /** Custom CSS classes */
  className?: string;
}

/**
 * Loading state component for ReportList
 *
 * @param props - LoadingState component props
 * @returns JSX element representing the loading state
 */
export const LoadingState: React.FC<LoadingStateProps> = ({ className = '' }) => {
  return (
    <div
      className={`flex items-center justify-center min-h-64 ${className}`}
      role="status"
      aria-label="Loading reports"
    >
      <div className="text-center">
        <Loader className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
        <p className="text-gray-600">Loading reports...</p>
      </div>
    </div>
  );
};

/**
 * Props for ErrorState component
 */
interface ErrorStateProps {
  /** Error message to display */
  error: string;
  /** Custom CSS classes */
  className?: string;
  /** Refresh handler */
  onRefresh?: () => void;
}

/**
 * Error state component for ReportList
 *
 * @param props - ErrorState component props
 * @returns JSX element representing the error state
 */
export const ErrorState: React.FC<ErrorStateProps> = ({ error, className = '', onRefresh }) => {
  return (
    <div
      className={`flex items-center justify-center min-h-64 ${className}`}
      role="alert"
    >
      <div className="text-center">
        <AlertCircle className="w-8 h-8 text-red-600 mx-auto mb-4" />
        <p className="text-red-600 font-medium mb-2">Error loading reports</p>
        <p className="text-gray-600 mb-4">{error}</p>
        {onRefresh && (
          <button
            onClick={onRefresh}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white
                     bg-red-600 border border-transparent rounded-md hover:bg-red-700"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </button>
        )}
      </div>
    </div>
  );
};

/**
 * Props for EmptyState component
 */
interface EmptyStateProps {
  /** Filter configuration to determine if filters are active */
  filters: ReportFilter;
  /** Custom CSS classes */
  className?: string;
}

/**
 * Empty state component for ReportList
 *
 * @param props - EmptyState component props
 * @returns JSX element representing the empty state
 */
export const EmptyState: React.FC<EmptyStateProps> = ({ filters, className = '' }) => {
  const hasActiveFilters = filters.searchQuery || Object.keys(filters).length > 0;

  return (
    <div className={`flex items-center justify-center min-h-64 ${className}`}>
      <div className="text-center">
        <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-lg font-medium text-gray-900 mb-2">No reports found</p>
        <p className="text-gray-600 mb-4">
          {hasActiveFilters
            ? "Try adjusting your search or filters"
            : "Get started by creating your first report"
          }
        </p>
      </div>
    </div>
  );
};
