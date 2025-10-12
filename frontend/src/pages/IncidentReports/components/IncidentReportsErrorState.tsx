/**
 * Incident Reports Error State Component
 *
 * Displays error state when data loading fails
 *
 * @module components/IncidentReportsErrorState
 */

import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface IncidentReportsErrorStateProps {
  error: string;
  onRetry: () => void;
}

/**
 * Error state component for incident reports
 */
export default function IncidentReportsErrorState({
  error,
  onRetry,
}: IncidentReportsErrorStateProps) {
  return (
    <div className="card p-12 text-center">
      <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        Failed to Load Incident Reports
      </h3>
      <p className="text-gray-600 mb-4">{error}</p>
      <button onClick={onRetry} className="btn-primary inline-flex items-center">
        <RefreshCw className="h-4 w-4 mr-2" />
        Try Again
      </button>
    </div>
  );
}
