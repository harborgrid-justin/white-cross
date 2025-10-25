/**
 * RecentIncidentsWidget Component
 *
 * Production-grade widget displaying recent incidents in timeline format.
 * Supports auto-refresh for real-time updates.
 *
 * @example
 * ```tsx
 * <RecentIncidentsWidget
 *   limit={15}
 *   autoRefresh={true}
 * />
 * ```
 */

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Clock, ExternalLink, AlertCircle, Activity } from 'lucide-react';
import { formatDistanceToNow, parseISO, format } from 'date-fns';
import { incidentsApi } from '@/services/modules/incidentsApi';
import { IncidentReport, IncidentType, IncidentSeverity } from '@/types/incidents';
import { Link } from 'react-router-dom';

interface RecentIncidentsWidgetProps {
  limit?: number;
  autoRefresh?: boolean;
  className?: string;
}

// Type icons mapping
const TYPE_ICONS = {
  [IncidentType.INJURY]: '🤕',
  [IncidentType.ILLNESS]: '🤒',
  [IncidentType.BEHAVIORAL]: '⚠️',
  [IncidentType.MEDICATION_ERROR]: '💊',
  [IncidentType.ALLERGIC_REACTION]: '🚨',
  [IncidentType.EMERGENCY]: '🆘',
  [IncidentType.OTHER]: '📋',
};

const TYPE_COLORS = {
  [IncidentType.INJURY]: 'text-red-600',
  [IncidentType.ILLNESS]: 'text-amber-600',
  [IncidentType.BEHAVIORAL]: 'text-purple-600',
  [IncidentType.MEDICATION_ERROR]: 'text-pink-600',
  [IncidentType.ALLERGIC_REACTION]: 'text-red-700',
  [IncidentType.EMERGENCY]: 'text-red-800',
  [IncidentType.OTHER]: 'text-gray-600',
};

/**
 * Timeline item component
 */
interface TimelineItemProps {
  incident: IncidentReport;
}

const TimelineItem: React.FC<TimelineItemProps> = React.memo(({ incident }) => {
  const typeColor = TYPE_COLORS[incident.type] || TYPE_COLORS[IncidentType.OTHER];
  const typeIcon = TYPE_ICONS[incident.type] || TYPE_ICONS[IncidentType.OTHER];

  return (
    <div className="relative pb-6 group">
      {/* Timeline line */}
      <div className="absolute top-5 left-4 -bottom-1 w-0.5 bg-gray-200 group-last:hidden" />

      <div className="relative flex items-start gap-4">
        {/* Timeline dot with icon */}
        <div className="relative flex-shrink-0">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white border-2 border-gray-300 text-lg">
            {typeIcon}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 bg-white border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between gap-2 mb-1">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-xs font-medium ${typeColor}`}>
                  {incident.type.replace(/_/g, ' ')}
                </span>
                {incident.severity === IncidentSeverity.CRITICAL && (
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                    CRITICAL
                  </span>
                )}
              </div>
              <Link
                to={`/incidents/${incident.id}`}
                className="text-sm font-medium text-gray-900 hover:text-blue-600 line-clamp-2"
              >
                {incident.description}
              </Link>
            </div>

            <Link
              to={`/incidents/${incident.id}`}
              className="flex-shrink-0 p-1 text-gray-400 hover:text-blue-600 transition-colors"
              aria-label="View incident"
            >
              <ExternalLink className="h-3 w-3" />
            </Link>
          </div>

          <div className="flex items-center gap-3 text-xs text-gray-500 mt-2">
            <span className="font-medium">{incident.student?.name || 'Unknown'}</span>
            <span>•</span>
            <span>{incident.location}</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {formatDistanceToNow(parseISO(incident.occurredAt), { addSuffix: true })}
            </span>
          </div>

          <div className="mt-2 text-xs text-gray-600">
            <span className="font-medium">Occurred:</span>{' '}
            {format(parseISO(incident.occurredAt), 'MMM dd, yyyy h:mm a')}
          </div>
        </div>
      </div>
    </div>
  );
});

TimelineItem.displayName = 'TimelineItem';

/**
 * RecentIncidentsWidget component - Timeline of recent incidents
 *
 * Features:
 * - Timeline-style layout
 * - Type icons and colors
 * - Time since incident
 * - Student and location info
 * - Auto-refresh capability
 * - Real-time updates
 * - Loading and empty states
 * - Configurable limit
 * - Links to full incident details
 */
const RecentIncidentsWidget: React.FC<RecentIncidentsWidgetProps> = React.memo(({
  limit = 15,
  autoRefresh = false,
  className = ''
}) => {
  // Fetch recent incidents
  const { data: incidentsResponse, isLoading, error } = useQuery({
    queryKey: ['incidents', 'recent', limit],
    queryFn: () => incidentsApi.getAll({
      limit,
      // Could add sorting by occurredAt desc if needed
    }),
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchInterval: autoRefresh ? 30 * 1000 : false, // Auto-refresh every 30 seconds if enabled
  });

  const incidents = incidentsResponse?.reports || [];

  // Loading state
  if (isLoading) {
    return (
      <div className={`recent-incidents-widget ${className}`}>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Activity className="h-5 w-5 mr-2 text-blue-600" />
            Recent Activity
            {autoRefresh && (
              <span className="ml-auto text-xs text-gray-500 font-normal flex items-center gap-1">
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                Live
              </span>
            )}
          </h3>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-4 animate-pulse">
                <div className="h-8 w-8 rounded-full bg-gray-200 flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                </div>
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
      <div className={`recent-incidents-widget ${className}`}>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Activity className="h-5 w-5 mr-2 text-blue-600" />
            Recent Activity
          </h3>
          <div className="text-center text-red-600 py-8">
            <AlertCircle className="h-12 w-12 mx-auto mb-2" />
            <p className="font-medium">Error loading recent incidents</p>
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
      <div className={`recent-incidents-widget ${className}`}>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Activity className="h-5 w-5 mr-2 text-blue-600" />
            Recent Activity
          </h3>
          <div className="text-center text-gray-500 py-8">
            <Activity className="h-12 w-12 mx-auto text-gray-400 mb-2" />
            <p className="text-sm">No recent incidents</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`recent-incidents-widget ${className}`}>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Activity className="h-5 w-5 mr-2 text-blue-600" />
            Recent Activity
          </h3>
          {autoRefresh && (
            <span className="text-xs text-gray-500 flex items-center gap-1">
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              Live
            </span>
          )}
        </div>

        <div className="max-h-[600px] overflow-y-auto pr-2">
          {incidents.map((incident) => (
            <TimelineItem key={incident.id} incident={incident} />
          ))}
        </div>

        {incidents.length >= limit && (
          <div className="mt-4 pt-4 border-t border-gray-200 text-center">
            <Link
              to="/incidents"
              className="text-sm text-blue-600 hover:text-blue-800 inline-flex items-center gap-1"
            >
              View all incidents
              <ExternalLink className="h-3 w-3" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
});

RecentIncidentsWidget.displayName = 'RecentIncidentsWidget';

export default RecentIncidentsWidget;
