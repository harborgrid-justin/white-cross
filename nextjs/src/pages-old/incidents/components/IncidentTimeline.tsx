/**
 * IncidentTimeline Component
 *
 * Visual timeline of incident events showing chronological incident history.
 * Displays key events like creation, status changes, witnesses added, follow-ups,
 * parent notifications, document uploads, and comments.
 *
 * @module pages/incidents/components/IncidentTimeline
 * @version 1.0.0
 */

import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Clock,
  FileText,
  UserPlus,
  CheckCircle,
  MessageSquare,
  Bell,
  Upload,
  AlertCircle,
  Filter,
  ChevronDown,
  ChevronUp,
  User,
  Activity,
} from 'lucide-react';
import { incidentsApi } from '@/services/modules/incidentsApi';
import { useApiError } from '@/hooks/shared/useApiError';
import { useHealthcareCompliance } from '@/hooks/shared/useHealthcareCompliance';
import { formatDistanceToNow } from 'date-fns';

/**
 * Timeline Event Types
 */
export enum TimelineEventType {
  CREATED = 'CREATED',
  STATUS_CHANGED = 'STATUS_CHANGED',
  WITNESS_ADDED = 'WITNESS_ADDED',
  FOLLOW_UP_CREATED = 'FOLLOW_UP_CREATED',
  FOLLOW_UP_COMPLETED = 'FOLLOW_UP_COMPLETED',
  PARENT_NOTIFIED = 'PARENT_NOTIFIED',
  DOCUMENT_UPLOADED = 'DOCUMENT_UPLOADED',
  COMMENT_ADDED = 'COMMENT_ADDED',
  SEVERITY_CHANGED = 'SEVERITY_CHANGED',
  ASSIGNED = 'ASSIGNED',
}

/**
 * Timeline Event Interface
 */
export interface TimelineEvent {
  id: string;
  incidentId: string;
  type: TimelineEventType;
  timestamp: string;
  userId: string;
  userName: string;
  description: string;
  metadata?: Record<string, any>;
}

/**
 * Props for IncidentTimeline component
 */
interface IncidentTimelineProps {
  /** Incident ID to fetch timeline for */
  incidentId: string;
  /** Optional CSS class name */
  className?: string;
}

/**
 * Get icon for timeline event type
 */
const getEventIcon = (type: TimelineEventType) => {
  switch (type) {
    case TimelineEventType.CREATED:
      return FileText;
    case TimelineEventType.STATUS_CHANGED:
      return Activity;
    case TimelineEventType.WITNESS_ADDED:
      return UserPlus;
    case TimelineEventType.FOLLOW_UP_CREATED:
      return CheckCircle;
    case TimelineEventType.FOLLOW_UP_COMPLETED:
      return CheckCircle;
    case TimelineEventType.PARENT_NOTIFIED:
      return Bell;
    case TimelineEventType.DOCUMENT_UPLOADED:
      return Upload;
    case TimelineEventType.COMMENT_ADDED:
      return MessageSquare;
    case TimelineEventType.SEVERITY_CHANGED:
      return AlertCircle;
    case TimelineEventType.ASSIGNED:
      return User;
    default:
      return Clock;
  }
};

/**
 * Get color classes for timeline event type
 */
const getEventColor = (type: TimelineEventType): string => {
  switch (type) {
    case TimelineEventType.CREATED:
      return 'bg-blue-100 text-blue-600 border-blue-200';
    case TimelineEventType.STATUS_CHANGED:
      return 'bg-purple-100 text-purple-600 border-purple-200';
    case TimelineEventType.WITNESS_ADDED:
      return 'bg-indigo-100 text-indigo-600 border-indigo-200';
    case TimelineEventType.FOLLOW_UP_CREATED:
      return 'bg-yellow-100 text-yellow-600 border-yellow-200';
    case TimelineEventType.FOLLOW_UP_COMPLETED:
      return 'bg-green-100 text-green-600 border-green-200';
    case TimelineEventType.PARENT_NOTIFIED:
      return 'bg-orange-100 text-orange-600 border-orange-200';
    case TimelineEventType.DOCUMENT_UPLOADED:
      return 'bg-cyan-100 text-cyan-600 border-cyan-200';
    case TimelineEventType.COMMENT_ADDED:
      return 'bg-gray-100 text-gray-600 border-gray-200';
    case TimelineEventType.SEVERITY_CHANGED:
      return 'bg-red-100 text-red-600 border-red-200';
    case TimelineEventType.ASSIGNED:
      return 'bg-teal-100 text-teal-600 border-teal-200';
    default:
      return 'bg-gray-100 text-gray-600 border-gray-200';
  }
};

/**
 * Get human-readable label for event type
 */
const getEventLabel = (type: TimelineEventType): string => {
  switch (type) {
    case TimelineEventType.CREATED:
      return 'Incident Created';
    case TimelineEventType.STATUS_CHANGED:
      return 'Status Changed';
    case TimelineEventType.WITNESS_ADDED:
      return 'Witness Added';
    case TimelineEventType.FOLLOW_UP_CREATED:
      return 'Follow-up Created';
    case TimelineEventType.FOLLOW_UP_COMPLETED:
      return 'Follow-up Completed';
    case TimelineEventType.PARENT_NOTIFIED:
      return 'Parent Notified';
    case TimelineEventType.DOCUMENT_UPLOADED:
      return 'Document Uploaded';
    case TimelineEventType.COMMENT_ADDED:
      return 'Comment Added';
    case TimelineEventType.SEVERITY_CHANGED:
      return 'Severity Changed';
    case TimelineEventType.ASSIGNED:
      return 'Assigned';
    default:
      return 'Event';
  }
};

/**
 * Timeline Event Item Component
 */
const TimelineEventItem: React.FC<{
  event: TimelineEvent;
  isLast: boolean;
}> = ({ event, isLast }) => {
  const [expanded, setExpanded] = useState(false);
  const Icon = getEventIcon(event.type);
  const colorClasses = getEventColor(event.type);
  const hasMetadata = event.metadata && Object.keys(event.metadata).length > 0;

  return (
    <div className="relative pb-8">
      {!isLast && (
        <span
          className="absolute top-10 left-5 -ml-px h-full w-0.5 bg-gray-200"
          aria-hidden="true"
        />
      )}
      <div className="relative flex items-start space-x-3">
        <div className="relative">
          <div
            className={`h-10 w-10 rounded-full border-2 flex items-center justify-center ${colorClasses}`}
          >
            <Icon className="h-5 w-5" aria-hidden="true" />
          </div>
        </div>
        <div className="min-w-0 flex-1">
          <div>
            <div className="text-sm">
              <span className="font-medium text-gray-900">
                {getEventLabel(event.type)}
              </span>
            </div>
            <p className="mt-0.5 text-sm text-gray-500">
              {event.description}
            </p>
            <div className="mt-2 flex items-center gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <User className="h-3 w-3" />
                {event.userName}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {formatDistanceToNow(new Date(event.timestamp), {
                  addSuffix: true,
                })}
              </span>
            </div>
          </div>
          {hasMetadata && (
            <div className="mt-2">
              <button
                onClick={() => setExpanded(!expanded)}
                className="text-xs text-primary-600 hover:text-primary-800 flex items-center gap-1"
              >
                {expanded ? (
                  <>
                    <ChevronUp className="h-3 w-3" />
                    Hide details
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-3 w-3" />
                    Show details
                  </>
                )}
              </button>
              {expanded && (
                <div className="mt-2 p-3 bg-gray-50 rounded-md border border-gray-200">
                  <dl className="space-y-1">
                    {Object.entries(event.metadata).map(([key, value]) => (
                      <div key={key} className="flex gap-2 text-xs">
                        <dt className="font-medium text-gray-700 capitalize">
                          {key.replace(/_/g, ' ')}:
                        </dt>
                        <dd className="text-gray-600">{String(value)}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * IncidentTimeline Component
 *
 * Displays a chronological timeline of all events related to an incident.
 * Supports filtering by event type and collapsible event details.
 *
 * @component
 * @param {IncidentTimelineProps} props - Component props
 * @returns {React.ReactElement} Rendered timeline component
 *
 * @example
 * ```tsx
 * <IncidentTimeline incidentId="incident-uuid-123" />
 * ```
 */
const IncidentTimeline: React.FC<IncidentTimelineProps> = ({
  incidentId,
  className = '',
}) => {
  const { handleApiError } = useApiError();
  const { logCompliantAccess } = useHealthcareCompliance();
  const [selectedFilters, setSelectedFilters] = useState<TimelineEventType[]>(
    []
  );
  const [showFilters, setShowFilters] = useState(false);

  // Fetch timeline data
  const {
    data: events = [],
    isLoading,
    error,
    refetch,
  } = useQuery<TimelineEvent[]>({
    queryKey: ['incident-timeline', incidentId],
    queryFn: async () => {
      try {
        // Log PHI access for compliance
        await logCompliantAccess(
          'view_incident_timeline',
          'incident',
          'moderate',
          { incidentId }
        );

        // TODO: Replace with actual API endpoint when available
        // const response = await incidentsApi.getTimeline(incidentId);
        // return response.events;

        // Placeholder data for now
        return [
          {
            id: '1',
            incidentId,
            type: TimelineEventType.CREATED,
            timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
            userId: 'user-1',
            userName: 'Sarah Johnson',
            description: 'Incident report created for playground fall',
          },
          {
            id: '2',
            incidentId,
            type: TimelineEventType.WITNESS_ADDED,
            timestamp: new Date(Date.now() - 86400000 * 2 + 3600000).toISOString(),
            userId: 'user-2',
            userName: 'Mike Davis',
            description: 'Teacher witness statement added',
            metadata: {
              witness_name: 'Mrs. Anderson',
              witness_type: 'STAFF',
            },
          },
          {
            id: '3',
            incidentId,
            type: TimelineEventType.FOLLOW_UP_CREATED,
            timestamp: new Date(Date.now() - 86400000 + 7200000).toISOString(),
            userId: 'user-1',
            userName: 'Sarah Johnson',
            description: 'Follow-up action created: Schedule parent meeting',
            metadata: {
              priority: 'HIGH',
              due_date: new Date(Date.now() + 86400000).toISOString(),
            },
          },
          {
            id: '4',
            incidentId,
            type: TimelineEventType.PARENT_NOTIFIED,
            timestamp: new Date(Date.now() - 3600000 * 12).toISOString(),
            userId: 'user-1',
            userName: 'Sarah Johnson',
            description: 'Parent notified via phone call',
            metadata: {
              method: 'VOICE',
              contact_name: 'John Smith',
            },
          },
          {
            id: '5',
            incidentId,
            type: TimelineEventType.DOCUMENT_UPLOADED,
            timestamp: new Date(Date.now() - 3600000 * 6).toISOString(),
            userId: 'user-3',
            userName: 'Emily Roberts',
            description: 'Incident photo uploaded',
            metadata: {
              file_name: 'playground-incident-001.jpg',
              file_size: '2.4 MB',
            },
          },
          {
            id: '6',
            incidentId,
            type: TimelineEventType.STATUS_CHANGED,
            timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
            userId: 'user-1',
            userName: 'Sarah Johnson',
            description: 'Status updated from OPEN to INVESTIGATING',
            metadata: {
              old_status: 'OPEN',
              new_status: 'INVESTIGATING',
            },
          },
          {
            id: '7',
            incidentId,
            type: TimelineEventType.COMMENT_ADDED,
            timestamp: new Date(Date.now() - 3600000).toISOString(),
            userId: 'user-2',
            userName: 'Mike Davis',
            description: 'Added comment about student recovery',
          },
        ] as TimelineEvent[];
      } catch (err: any) {
        throw handleApiError(err, 'fetch_incident_timeline');
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
    enabled: !!incidentId,
  });

  // Filter events based on selected filters
  const filteredEvents = useMemo(() => {
    if (selectedFilters.length === 0) {
      return events;
    }
    return events.filter((event) => selectedFilters.includes(event.type));
  }, [events, selectedFilters]);

  // Toggle filter
  const toggleFilter = (type: TimelineEventType) => {
    setSelectedFilters((prev) =>
      prev.includes(type)
        ? prev.filter((t) => t !== type)
        : [...prev, type]
    );
  };

  // Get unique event types from events
  const availableEventTypes = useMemo(() => {
    return Array.from(new Set(events.map((e) => e.type)));
  }, [events]);

  if (isLoading) {
    return (
      <div className={`incident-timeline ${className}`}>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Incident Timeline
          </h3>
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`incident-timeline ${className}`}>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Incident Timeline
          </h3>
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-red-800">
                  Failed to load timeline
                </h4>
                <p className="mt-1 text-sm text-red-700">
                  {error instanceof Error ? error.message : 'An error occurred'}
                </p>
                <button
                  onClick={() => refetch()}
                  className="mt-3 text-sm font-medium text-red-800 hover:text-red-900"
                >
                  Try again
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`incident-timeline ${className}`}>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Incident Timeline
            <span className="ml-2 text-sm font-normal text-gray-500">
              ({filteredEvents.length} {filteredEvents.length === 1 ? 'event' : 'events'})
            </span>
          </h3>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <Filter className="h-4 w-4" />
            Filters
            {selectedFilters.length > 0 && (
              <span className="ml-1 px-2 py-0.5 text-xs font-medium text-white bg-primary-600 rounded-full">
                {selectedFilters.length}
              </span>
            )}
          </button>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="mb-6 p-4 bg-gray-50 rounded-md border border-gray-200">
            <h4 className="text-sm font-medium text-gray-900 mb-3">
              Filter by event type:
            </h4>
            <div className="flex flex-wrap gap-2">
              {availableEventTypes.map((type) => {
                const Icon = getEventIcon(type);
                const isSelected = selectedFilters.includes(type);
                return (
                  <button
                    key={type}
                    onClick={() => toggleFilter(type)}
                    className={`inline-flex items-center gap-2 px-3 py-1.5 text-sm rounded-md border transition-colors ${
                      isSelected
                        ? 'bg-primary-100 border-primary-300 text-primary-700'
                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {getEventLabel(type)}
                  </button>
                );
              })}
            </div>
            {selectedFilters.length > 0 && (
              <button
                onClick={() => setSelectedFilters([])}
                className="mt-3 text-sm text-primary-600 hover:text-primary-800"
              >
                Clear all filters
              </button>
            )}
          </div>
        )}

        {/* Timeline */}
        {filteredEvents.length === 0 ? (
          <div className="text-center py-12">
            <Clock className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No events found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {selectedFilters.length > 0
                ? 'Try adjusting your filters to see more events.'
                : 'Timeline events will appear here as the incident progresses.'}
            </p>
          </div>
        ) : (
          <div className="flow-root">
            <ul className="-mb-8">
              {filteredEvents.map((event, idx) => (
                <li key={event.id}>
                  <TimelineEventItem
                    event={event}
                    isLast={idx === filteredEvents.length - 1}
                  />
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default IncidentTimeline;
