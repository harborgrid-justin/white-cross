/**
 * Incident Reports Loading State Component
 *
 * Displays loading state while fetching data
 *
 * @module components/IncidentReportsLoadingState
 */

import React from 'react';
import { RefreshCw } from 'lucide-react';

/**
 * Loading state component for incident reports
 */
export default function IncidentReportsLoadingState() {
  return (
    <div className="card p-12 text-center">
      <RefreshCw className="h-12 w-12 text-blue-500 animate-spin mx-auto mb-4" />
      <p className="text-gray-600">Loading incident reports...</p>
    </div>
  );
}
