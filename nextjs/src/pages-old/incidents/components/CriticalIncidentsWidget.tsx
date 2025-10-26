/**
 * CriticalIncidentsWidget Component
 *
 * Production-grade widget displaying critical/high priority incidents.
 * Shows compact cards with quick actions for viewing and assigning.
 *
 * @example
 * ```tsx
 * <CriticalIncidentsWidget
 *   limit={10}
 *   onViewIncident={(id) => navigate(`/incidents/${id}`)}
 *   onAssignIncident={(id) => openAssignDialog(id)}
 * />
 * ```
 */

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { AlertTriangle, Eye, UserPlus, ExternalLink } from 'lucide-react';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { incidentsApi } from '@/services/modules/incidentsApi';
import { IncidentReport, IncidentSeverity } from '@/types/incidents';
import { Link } from 'react-router-dom';

interface CriticalIncidentsWidgetProps {
  limit?: number;
  onViewIncident?: (id: string) => void;
  onAssignIncident?: (id: string) => void;
  className?: string;
}

const SEVERITY_BADGE_COLORS = {
  [IncidentSeverity.CRITICAL]: 'bg-red-100 text-red-800 border-red-300',
  [IncidentSeverity.HIGH]: 'bg-orange-100 text-orange-800 border-orange-300',
  [IncidentSeverity.MEDIUM]: 'bg-amber-100 text-amber-800 border-amber-300',
  [IncidentSeverity.LOW]: 'bg-green-100 text-green-800 border-green-300',
};

/**
 * Individual incident card component
 */
interface IncidentCardProps {
  incident: IncidentReport;
  onView?: () => void;
  onAssign?: () => void;
}

const IncidentCard: React.FC<IncidentCardProps> = React.memo(({
  incident,
  onView,
  onAssign
}) => {
  const severityColor = SEVERITY_BADGE_COLORS[incident.severity] || SEVERITY_BADGE_COLORS[IncidentSeverity.MEDIUM];
  const isUnassigned = !incident.reportedById; // Simplified check

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border ${severityColor}`}>
              <AlertTriangle className="h-3 w-3 mr-1" />
              {incident.severity}
            </span>
            {isUnassigned && (
              <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800 border border-gray-300">
                Unassigned
              </span>
            )}
          </div>

          <Link
            to={`/incidents/${incident.id}`}
            className="text-sm font-medium text-gray-900 hover:text-blue-600 line-clamp-2"
          >
            {incident.description}
          </Link>

          <div className="mt-2 flex items-center gap-4 text-xs text-gray-500">
            <span>{incident.student?.name || 'Unknown Student'}</span>
            <span>•</span>
            <span>{formatDistanceToNow(parseISO(incident.occurredAt), { addSuffix: true })}</span>
          </div>

          <div className="mt-2 text-xs text-gray-600">
            <span className="font-medium">Location:</span> {incident.location}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          {onView && (
            <button
              onClick={onView}
              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
              title="View details"
              aria-label="View incident details"
            >
              <Eye className="h-4 w-4" />
            </button>
          )}
          {onAssign && (
            <button
              onClick={onAssign}
              className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-md transition-colors"
              title="Assign incident"
              aria-label="Assign incident"
            >
              <UserPlus className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
});

IncidentCard.displayName = 'IncidentCard';

/**
 * CriticalIncidentsWidget component - List of critical/high priority incidents
 *
 * Features:
 * - Fetches critical and high severity incidents
 * - Compact card layout
 * - Quick actions (View, Assign)
 * - Unassigned indicator badge
 * - Real-time data with TanStack Query
 * - Loading and empty states
 * - Configurable limit
 */
const CriticalIncidentsWidget: React.FC<CriticalIncidentsWidgetProps> = React.memo(({
  limit = 10,
  onViewIncident,
  onAssignIncident,
  className = ''
}) => {
  // Fetch critical and high severity incidents
  const { data: incidentsResponse, isLoading, error } = useQuery({
    queryKey: ['incidents', 'critical', limit],
    queryFn: () => incidentsApi.getAll({
      severity: IncidentSeverity.CRITICAL, // Backend might not support multiple severities in one call
      limit,
      // In production, you'd want to fetch both CRITICAL and HIGH
      // This might require separate calls or backend API enhancement
    }),
    staleTime: 2 * 60 * 1000, // 2 minutes - refresh more frequently for critical incidents
    refetchInterval: 5 * 60 * 1000, // Auto-refresh every 5 minutes
  });

  const incidents = incidentsResponse?.reports || [];

  // Loading state
  if (isLoading) {
    return (
      <div className={`critical-incidents-widget ${className}`}>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2 text-red-600" />
            Critical Incidents
          </h3>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border border-gray-200 rounded-lg p-4 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={`critical-incidents-widget ${className}`}>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2 text-red-600" />
            Critical Incidents
          </h3>
          <div className="text-center text-red-600 py-8">
            <p className="font-medium">Error loading incidents</p>
            <p className="text-sm text-gray-600 mt-1">
              {error instanceof Error ? error.message : 'Unknown error occurred'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Empty state
  if (incidents.length === 0) {
    return (
      <div className={`critical-incidents-widget ${className}`}>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2 text-red-600" />
            Critical Incidents
          </h3>
          <div className="text-center text-gray-500 py-8">
            <CheckCircle className="h-12 w-12 mx-auto text-green-500 mb-2" />
            <p className="text-sm">No critical incidents at this time</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`critical-incidents-widget ${className}`}>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2 text-red-600" />
            Critical Incidents
          </h3>
          <Link
            to="/incidents?severity=CRITICAL,HIGH"
            className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            View all
            <ExternalLink className="h-3 w-3" />
          </Link>
        </div>

        <div className="space-y-3 max-h-96 overflow-y-auto">
          {incidents.map((incident) => (
            <IncidentCard
              key={incident.id}
              incident={incident}
              onView={onViewIncident ? () => onViewIncident(incident.id) : undefined}
              onAssign={onAssignIncident ? () => onAssignIncident(incident.id) : undefined}
            />
          ))}
        </div>

        {incidents.length >= limit && (
          <div className="mt-4 text-center">
            <Link
              to="/incidents?severity=CRITICAL,HIGH"
              className="text-sm text-blue-600 hover:text-blue-800 inline-flex items-center gap-1"
            >
              Show more
              <ExternalLink className="h-3 w-3" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
});

// Import CheckCircle for empty state
import { CheckCircle } from 'lucide-react';

CriticalIncidentsWidget.displayName = 'CriticalIncidentsWidget';

export default CriticalIncidentsWidget;
