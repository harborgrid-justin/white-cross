/**
 * Incident Reports Header Component
 *
 * Displays the page header with title, count, and action buttons
 *
 * @module components/IncidentReportsHeader
 */

import React from 'react';
import { Plus, RefreshCw } from 'lucide-react';

interface IncidentReportsHeaderProps {
  totalReports: number;
  isLoading: boolean;
  onRefresh: () => void;
  onCreateIncident: () => void;
}

/**
 * Header component for incident reports page
 */
export default function IncidentReportsHeader({
  totalReports,
  isLoading,
  onRefresh,
  onCreateIncident,
}: IncidentReportsHeaderProps) {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Incident Reports</h1>
        <p className="text-gray-600">
          {totalReports} total report{totalReports !== 1 ? 's' : ''}
        </p>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={onRefresh}
          className="btn-secondary flex items-center"
          disabled={isLoading}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
        <button
          onClick={onCreateIncident}
          className="btn-primary flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Report Incident
        </button>
      </div>
    </div>
  );
}
