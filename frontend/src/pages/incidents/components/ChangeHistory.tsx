/**
 * ChangeHistory Component
 *
 * Advanced diff viewer for incident field changes showing before/after comparison.
 * Provides visual diff display with highlighting, change navigation, and audit review.
 * Supports multiple change types with customizable diff rendering.
 *
 * @module pages/incidents/components/ChangeHistory
 * @version 1.0.0
 */

import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  GitCompare,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  User,
  Clock,
  FileText,
  ArrowRight,
  Eye,
  EyeOff,
} from 'lucide-react';
import { incidentsApi } from '@/services/modules/incidentsApi';
import { useApiError } from '@/hooks/shared/useApiError';
import { useHealthcareCompliance } from '@/hooks/shared/useHealthcareCompliance';
import { format } from 'date-fns';

/**
 * Field Change Interface
 */
export interface FieldChange {
  id: string;
  incidentId: string;
  timestamp: string;
  userId: string;
  userName: string;
  fieldName: string;
  fieldLabel: string;
  oldValue: string | null;
  newValue: string | null;
  changeType: 'added' | 'modified' | 'removed';
}

/**
 * Props for ChangeHistory component
 */
interface ChangeHistoryProps {
  /** Incident ID to fetch changes for */
  incidentId: string;
  /** Optional field name to filter by */
  fieldName?: string;
  /** Optional CSS class name */
  className?: string;
}

/**
 * Get human-readable field label
 */
const getFieldLabel = (fieldName: string): string => {
  const labels: Record<string, string> = {
    type: 'Incident Type',
    severity: 'Severity',
    description: 'Description',
    location: 'Location',
    occurredAt: 'Occurrence Date/Time',
    actionsTaken: 'Actions Taken',
    parentNotified: 'Parent Notified',
    parentNotificationMethod: 'Notification Method',
    followUpRequired: 'Follow-up Required',
    followUpNotes: 'Follow-up Notes',
    insuranceClaimNumber: 'Insurance Claim Number',
    insuranceClaimStatus: 'Insurance Claim Status',
    legalComplianceStatus: 'Compliance Status',
    status: 'Status',
  };
  return labels[fieldName] || fieldName.replace(/_/g, ' ');
};

/**
 * Compute simple diff between two strings
 */
const computeDiff = (
  oldValue: string | null,
  newValue: string | null
): { removed: string[]; added: string[]; unchanged: string[] } => {
  if (!oldValue && !newValue) {
    return { removed: [], added: [], unchanged: [] };
  }

  if (!oldValue) {
    return { removed: [], added: [newValue || ''], unchanged: [] };
  }

  if (!newValue) {
    return { removed: [oldValue], added: [], unchanged: [] };
  }

  // Simple word-based diff
  const oldWords = oldValue.split(/\s+/);
  const newWords = newValue.split(/\s+/);

  const removed: string[] = [];
  const added: string[] = [];
  const unchanged: string[] = [];

  // Very basic diff algorithm - finds removed and added words
  oldWords.forEach((word) => {
    if (!newWords.includes(word)) {
      removed.push(word);
    } else {
      unchanged.push(word);
    }
  });

  newWords.forEach((word) => {
    if (!oldWords.includes(word)) {
      added.push(word);
    }
  });

  return { removed, added, unchanged };
};

/**
 * Diff Viewer Component
 */
const DiffViewer: React.FC<{
  oldValue: string | null;
  newValue: string | null;
  fieldLabel: string;
}> = ({ oldValue, newValue, fieldLabel }) => {
  const [showDiff, setShowDiff] = useState(true);

  const diff = useMemo(() => {
    return computeDiff(oldValue, newValue);
  }, [oldValue, newValue]);

  const formatValue = (value: string | null): string => {
    if (value === null || value === undefined) {
      return 'Not set';
    }
    if (value === 'true') return 'Yes';
    if (value === 'false') return 'No';
    return value;
  };

  return (
    <div className="space-y-3">
      {/* Toggle Diff View */}
      <div className="flex items-center justify-between">
        <h5 className="text-sm font-medium text-gray-700">{fieldLabel}</h5>
        <button
          onClick={() => setShowDiff(!showDiff)}
          className="text-xs text-primary-600 hover:text-primary-800 flex items-center gap-1"
        >
          {showDiff ? (
            <>
              <EyeOff className="h-3 w-3" />
              Hide diff
            </>
          ) : (
            <>
              <Eye className="h-3 w-3" />
              Show diff
            </>
          )}
        </button>
      </div>

      {showDiff ? (
        /* Diff View */
        <div className="grid grid-cols-2 gap-4">
          {/* Old Value */}
          <div className="space-y-2">
            <div className="text-xs font-medium text-gray-500 uppercase">
              Before
            </div>
            <div className="p-3 bg-red-50 border border-red-200 rounded-md min-h-[60px]">
              <div className="text-sm text-gray-900 whitespace-pre-wrap">
                {oldValue ? (
                  <span className="bg-red-100 px-1 rounded">{oldValue}</span>
                ) : (
                  <span className="text-gray-400 italic">Not set</span>
                )}
              </div>
              {diff.removed.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {diff.removed.map((word, idx) => (
                    <span
                      key={idx}
                      className="text-xs bg-red-200 text-red-800 px-1.5 py-0.5 rounded"
                    >
                      -{word}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* New Value */}
          <div className="space-y-2">
            <div className="text-xs font-medium text-gray-500 uppercase">
              After
            </div>
            <div className="p-3 bg-green-50 border border-green-200 rounded-md min-h-[60px]">
              <div className="text-sm text-gray-900 whitespace-pre-wrap">
                {newValue ? (
                  <span className="bg-green-100 px-1 rounded">{newValue}</span>
                ) : (
                  <span className="text-gray-400 italic">Not set</span>
                )}
              </div>
              {diff.added.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {diff.added.map((word, idx) => (
                    <span
                      key={idx}
                      className="text-xs bg-green-200 text-green-800 px-1.5 py-0.5 rounded"
                    >
                      +{word}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Simple View */
        <div className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-md">
          <div className="flex-1 text-sm text-gray-600 truncate">
            {formatValue(oldValue)}
          </div>
          <ArrowRight className="h-4 w-4 text-gray-400 flex-shrink-0" />
          <div className="flex-1 text-sm text-gray-900 font-medium truncate">
            {formatValue(newValue)}
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * ChangeHistory Component
 *
 * Displays detailed diff view for incident field changes with before/after comparison.
 * Supports navigation between changes and visual diff highlighting.
 *
 * @component
 * @param {ChangeHistoryProps} props - Component props
 * @returns {React.ReactElement} Rendered change history component
 *
 * @example
 * ```tsx
 * // Show all changes
 * <ChangeHistory incidentId="incident-uuid-123" />
 *
 * // Show changes for specific field
 * <ChangeHistory incidentId="incident-uuid-123" fieldName="severity" />
 * ```
 */
const ChangeHistory: React.FC<ChangeHistoryProps> = ({
  incidentId,
  fieldName,
  className = '',
}) => {
  const { handleApiError } = useApiError();
  const { logCompliantAccess } = useHealthcareCompliance();

  const [currentIndex, setCurrentIndex] = useState(0);

  // Fetch change data
  const {
    data: changes = [],
    isLoading,
    error,
    refetch,
  } = useQuery<FieldChange[]>({
    queryKey: ['incident-change-history', incidentId, fieldName],
    queryFn: async () => {
      try {
        // Log PHI access for compliance
        await logCompliantAccess(
          'view_incident_change_history',
          'incident',
          'high',
          { incidentId, fieldName }
        );

        // TODO: Replace with actual API endpoint when available
        // const response = fieldName
        //   ? await incidentsApi.getFieldChanges(incidentId, fieldName)
        //   : await incidentsApi.getAllChanges(incidentId);
        // return response.changes;

        // Placeholder data
        const allChanges: FieldChange[] = [
          {
            id: '1',
            incidentId,
            timestamp: new Date(Date.now() - 86400000 * 3).toISOString(),
            userId: 'user-1',
            userName: 'Sarah Johnson',
            fieldName: 'description',
            fieldLabel: 'Description',
            oldValue: null,
            newValue: 'Student fell on playground during recess',
            changeType: 'added',
          },
          {
            id: '2',
            incidentId,
            timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
            userId: 'user-2',
            userName: 'Mike Davis',
            fieldName: 'severity',
            fieldLabel: 'Severity',
            oldValue: 'MEDIUM',
            newValue: 'HIGH',
            changeType: 'modified',
          },
          {
            id: '3',
            incidentId,
            timestamp: new Date(Date.now() - 86400000 + 7200000).toISOString(),
            userId: 'user-1',
            userName: 'Sarah Johnson',
            fieldName: 'followUpRequired',
            fieldLabel: 'Follow-up Required',
            oldValue: 'false',
            newValue: 'true',
            changeType: 'modified',
          },
          {
            id: '4',
            incidentId,
            timestamp: new Date(Date.now() - 3600000 * 6).toISOString(),
            userId: 'user-3',
            userName: 'Emily Roberts',
            fieldName: 'actionsTaken',
            fieldLabel: 'Actions Taken',
            oldValue: 'Applied ice pack, contacted parent',
            newValue:
              'Applied ice pack, contacted parent, sent to nurse for evaluation',
            changeType: 'modified',
          },
          {
            id: '5',
            incidentId,
            timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
            userId: 'user-1',
            userName: 'Sarah Johnson',
            fieldName: 'status',
            fieldLabel: 'Status',
            oldValue: 'OPEN',
            newValue: 'INVESTIGATING',
            changeType: 'modified',
          },
          {
            id: '6',
            incidentId,
            timestamp: new Date(Date.now() - 3600000).toISOString(),
            userId: 'user-2',
            userName: 'Mike Davis',
            fieldName: 'followUpNotes',
            fieldLabel: 'Follow-up Notes',
            oldValue: null,
            newValue:
              'Student recovering well, no further medical attention needed',
            changeType: 'added',
          },
        ];

        // Filter by field name if provided
        return fieldName
          ? allChanges.filter((change) => change.fieldName === fieldName)
          : allChanges;
      } catch (err: any) {
        throw handleApiError(err, 'fetch_incident_change_history');
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
    enabled: !!incidentId,
  });

  // Navigation handlers
  const goToPrevious = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => Math.min(changes.length - 1, prev + 1));
  };

  const currentChange = changes[currentIndex];

  if (isLoading) {
    return (
      <div className={`change-history ${className}`}>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <GitCompare className="h-5 w-5" />
            Change History
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
      <div className={`change-history ${className}`}>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <GitCompare className="h-5 w-5" />
            Change History
          </h3>
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-red-800">
                  Failed to load changes
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

  if (changes.length === 0) {
    return (
      <div className={`change-history ${className}`}>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <GitCompare className="h-5 w-5" />
            Change History
            {fieldName && (
              <span className="text-sm font-normal text-gray-500">
                for {getFieldLabel(fieldName)}
              </span>
            )}
          </h3>
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No changes found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {fieldName
                ? `No changes have been made to ${getFieldLabel(fieldName)}.`
                : 'No changes have been made to this incident.'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`change-history ${className}`}>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <GitCompare className="h-5 w-5" />
              Change History
              {fieldName && (
                <span className="text-sm font-normal text-gray-500">
                  for {getFieldLabel(fieldName)}
                </span>
              )}
            </h3>
            {changes.length > 1 && (
              <div className="flex items-center gap-2">
                <button
                  onClick={goToPrevious}
                  disabled={currentIndex === 0}
                  className="p-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Previous change"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="text-sm text-gray-600">
                  {currentIndex + 1} / {changes.length}
                </span>
                <button
                  onClick={goToNext}
                  disabled={currentIndex === changes.length - 1}
                  className="p-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Next change"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Change Details */}
        {currentChange && (
          <div className="px-6 py-6">
            {/* Metadata */}
            <div className="mb-6 flex items-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-400" />
                <span className="font-medium">{currentChange.userName}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-400" />
                <span>
                  {format(new Date(currentChange.timestamp), 'MMM d, yyyy at h:mm a')}
                </span>
              </div>
              <div className="flex-1"></div>
              <div>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    currentChange.changeType === 'added'
                      ? 'bg-green-100 text-green-800'
                      : currentChange.changeType === 'removed'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}
                >
                  {currentChange.changeType === 'added'
                    ? 'Added'
                    : currentChange.changeType === 'removed'
                    ? 'Removed'
                    : 'Modified'}
                </span>
              </div>
            </div>

            {/* Diff Viewer */}
            <DiffViewer
              oldValue={currentChange.oldValue}
              newValue={currentChange.newValue}
              fieldLabel={currentChange.fieldLabel}
            />

            {/* Quick Navigation */}
            {changes.length > 1 && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="text-sm font-medium text-gray-700 mb-3">
                  All Changes
                </h4>
                <div className="flex flex-wrap gap-2">
                  {changes.map((change, idx) => (
                    <button
                      key={change.id}
                      onClick={() => setCurrentIndex(idx)}
                      className={`px-3 py-1.5 text-xs rounded-md border transition-colors ${
                        idx === currentIndex
                          ? 'bg-primary-100 border-primary-300 text-primary-700 font-medium'
                          : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {change.fieldLabel}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChangeHistory;
