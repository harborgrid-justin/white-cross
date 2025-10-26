/**
 * IncidentHistory Component
 *
 * Complete change history log for incident reports showing all field modifications.
 * Provides audit trail with filterable, sortable, and paginated change records.
 * Essential for compliance tracking and incident investigation.
 *
 * @module pages/incidents/components/IncidentHistory
 * @version 1.0.0
 */

import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  History,
  Download,
  Search,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Filter,
  X,
  User,
  Clock,
  FileText,
} from 'lucide-react';
import { incidentsApi } from '@/services/modules/incidentsApi';
import { useApiError } from '@/hooks/shared/useApiError';
import { useHealthcareCompliance } from '@/hooks/shared/useHealthcareCompliance';
import { format } from 'date-fns';

/**
 * Change Record Interface
 * Represents a single field change in the incident history
 */
export interface ChangeRecord {
  id: string;
  incidentId: string;
  timestamp: string;
  userId: string;
  userName: string;
  fieldName: string;
  fieldLabel: string;
  oldValue: string | null;
  newValue: string | null;
  changeType: 'created' | 'updated' | 'deleted';
}

/**
 * Props for IncidentHistory component
 */
interface IncidentHistoryProps {
  /** Incident ID to fetch history for */
  incidentId: string;
  /** Optional CSS class name */
  className?: string;
}

/**
 * Sort direction type
 */
type SortDirection = 'asc' | 'desc';

/**
 * Sort configuration
 */
interface SortConfig {
  field: keyof ChangeRecord;
  direction: SortDirection;
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
 * Format value for display
 */
const formatValue = (value: string | null): string => {
  if (value === null || value === undefined) {
    return 'Not set';
  }
  if (value === 'true') return 'Yes';
  if (value === 'false') return 'No';
  return value;
};

/**
 * Export history to CSV
 */
const exportToCSV = (records: ChangeRecord[], incidentId: string) => {
  const headers = ['Timestamp', 'User', 'Field', 'Old Value', 'New Value'];
  const rows = records.map((record) => [
    format(new Date(record.timestamp), 'yyyy-MM-dd HH:mm:ss'),
    record.userName,
    record.fieldLabel,
    formatValue(record.oldValue),
    formatValue(record.newValue),
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute(
    'download',
    `incident-history-${incidentId}-${format(new Date(), 'yyyy-MM-dd')}.csv`
  );
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * IncidentHistory Component
 *
 * Displays complete audit trail of all changes made to an incident report.
 * Features include filtering by field, sorting, pagination, and CSV export.
 *
 * @component
 * @param {IncidentHistoryProps} props - Component props
 * @returns {React.ReactElement} Rendered history component
 *
 * @example
 * ```tsx
 * <IncidentHistory incidentId="incident-uuid-123" />
 * ```
 */
const IncidentHistory: React.FC<IncidentHistoryProps> = ({
  incidentId,
  className = '',
}) => {
  const { handleApiError } = useApiError();
  const { logCompliantAccess } = useHealthcareCompliance();

  // State management
  const [searchQuery, setSearchQuery] = useState('');
  const [fieldFilter, setFieldFilter] = useState<string>('');
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    field: 'timestamp',
    direction: 'desc',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Fetch history data
  const {
    data: records = [],
    isLoading,
    error,
    refetch,
  } = useQuery<ChangeRecord[]>({
    queryKey: ['incident-history', incidentId],
    queryFn: async () => {
      try {
        // Log PHI access for compliance
        await logCompliantAccess(
          'view_incident_history',
          'incident',
          'high',
          { incidentId }
        );

        // TODO: Replace with actual API endpoint when available
        // const response = await incidentsApi.getHistory(incidentId);
        // return response.changes;

        // Placeholder data
        return [
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
            changeType: 'created',
          },
          {
            id: '2',
            incidentId,
            timestamp: new Date(Date.now() - 86400000 * 3).toISOString(),
            userId: 'user-1',
            userName: 'Sarah Johnson',
            fieldName: 'severity',
            fieldLabel: 'Severity',
            oldValue: null,
            newValue: 'MEDIUM',
            changeType: 'created',
          },
          {
            id: '3',
            incidentId,
            timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
            userId: 'user-2',
            userName: 'Mike Davis',
            fieldName: 'severity',
            fieldLabel: 'Severity',
            oldValue: 'MEDIUM',
            newValue: 'HIGH',
            changeType: 'updated',
          },
          {
            id: '4',
            incidentId,
            timestamp: new Date(Date.now() - 86400000 * 2 + 3600000).toISOString(),
            userId: 'user-1',
            userName: 'Sarah Johnson',
            fieldName: 'followUpRequired',
            fieldLabel: 'Follow-up Required',
            oldValue: 'false',
            newValue: 'true',
            changeType: 'updated',
          },
          {
            id: '5',
            incidentId,
            timestamp: new Date(Date.now() - 86400000 + 7200000).toISOString(),
            userId: 'user-1',
            userName: 'Sarah Johnson',
            fieldName: 'parentNotified',
            fieldLabel: 'Parent Notified',
            oldValue: 'false',
            newValue: 'true',
            changeType: 'updated',
          },
          {
            id: '6',
            incidentId,
            timestamp: new Date(Date.now() - 3600000 * 12).toISOString(),
            userId: 'user-1',
            userName: 'Sarah Johnson',
            fieldName: 'parentNotificationMethod',
            fieldLabel: 'Notification Method',
            oldValue: null,
            newValue: 'VOICE',
            changeType: 'updated',
          },
          {
            id: '7',
            incidentId,
            timestamp: new Date(Date.now() - 3600000 * 6).toISOString(),
            userId: 'user-3',
            userName: 'Emily Roberts',
            fieldName: 'actionsTaken',
            fieldLabel: 'Actions Taken',
            oldValue: 'Applied ice pack, contacted parent',
            newValue: 'Applied ice pack, contacted parent, sent to nurse for evaluation',
            changeType: 'updated',
          },
          {
            id: '8',
            incidentId,
            timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
            userId: 'user-1',
            userName: 'Sarah Johnson',
            fieldName: 'status',
            fieldLabel: 'Status',
            oldValue: 'OPEN',
            newValue: 'INVESTIGATING',
            changeType: 'updated',
          },
          {
            id: '9',
            incidentId,
            timestamp: new Date(Date.now() - 3600000).toISOString(),
            userId: 'user-2',
            userName: 'Mike Davis',
            fieldName: 'followUpNotes',
            fieldLabel: 'Follow-up Notes',
            oldValue: null,
            newValue: 'Student recovering well, no further medical attention needed',
            changeType: 'updated',
          },
        ] as ChangeRecord[];
      } catch (err: any) {
        throw handleApiError(err, 'fetch_incident_history');
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
    enabled: !!incidentId,
  });

  // Get unique field names for filter dropdown
  const uniqueFields = useMemo(() => {
    const fields = Array.from(new Set(records.map((r) => r.fieldName)));
    return fields.sort();
  }, [records]);

  // Filter and search records
  const filteredRecords = useMemo(() => {
    let filtered = records;

    // Apply field filter
    if (fieldFilter) {
      filtered = filtered.filter((r) => r.fieldName === fieldFilter);
    }

    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.fieldLabel.toLowerCase().includes(query) ||
          r.userName.toLowerCase().includes(query) ||
          formatValue(r.oldValue).toLowerCase().includes(query) ||
          formatValue(r.newValue).toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [records, fieldFilter, searchQuery]);

  // Sort records
  const sortedRecords = useMemo(() => {
    const sorted = [...filteredRecords];
    sorted.sort((a, b) => {
      const aValue = a[sortConfig.field];
      const bValue = b[sortConfig.field];

      if (aValue === null) return 1;
      if (bValue === null) return -1;

      let comparison = 0;
      if (aValue < bValue) comparison = -1;
      if (aValue > bValue) comparison = 1;

      return sortConfig.direction === 'asc' ? comparison : -comparison;
    });

    return sorted;
  }, [filteredRecords, sortConfig]);

  // Paginate records
  const paginatedRecords = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return sortedRecords.slice(startIndex, endIndex);
  }, [sortedRecords, currentPage, itemsPerPage]);

  // Pagination info
  const totalPages = Math.ceil(sortedRecords.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, sortedRecords.length);

  // Handle sort
  const handleSort = (field: keyof ChangeRecord) => {
    setSortConfig((prev) => ({
      field,
      direction:
        prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  // Render sort icon
  const renderSortIcon = (field: keyof ChangeRecord) => {
    if (sortConfig.field !== field) {
      return <ChevronDown className="h-4 w-4 text-gray-400" />;
    }
    return sortConfig.direction === 'asc' ? (
      <ChevronUp className="h-4 w-4 text-primary-600" />
    ) : (
      <ChevronDown className="h-4 w-4 text-primary-600" />
    );
  };

  if (isLoading) {
    return (
      <div className={`incident-history ${className}`}>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <History className="h-5 w-5" />
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
      <div className={`incident-history ${className}`}>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <History className="h-5 w-5" />
            Change History
          </h3>
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-red-800">
                  Failed to load history
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
    <div className={`incident-history ${className}`}>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <History className="h-5 w-5" />
              Change History
              <span className="ml-2 text-sm font-normal text-gray-500">
                ({sortedRecords.length} {sortedRecords.length === 1 ? 'change' : 'changes'})
              </span>
            </h3>
            <button
              onClick={() => exportToCSV(sortedRecords, incidentId)}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <Download className="h-4 w-4" />
              Export CSV
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <div className="flex gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search changes..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            {/* Field Filter */}
            <div className="relative">
              <select
                value={fieldFilter}
                onChange={(e) => {
                  setFieldFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="appearance-none pl-10 pr-10 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
              >
                <option value="">All Fields</option>
                {uniqueFields.map((field) => (
                  <option key={field} value={field}>
                    {getFieldLabel(field)}
                  </option>
                ))}
              </select>
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              {fieldFilter && (
                <button
                  onClick={() => setFieldFilter('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Table */}
        {paginatedRecords.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No changes found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchQuery || fieldFilter
                ? 'Try adjusting your search or filters.'
                : 'Change history will appear here as the incident is modified.'}
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('timestamp')}
                    >
                      <div className="flex items-center gap-2">
                        Timestamp
                        {renderSortIcon('timestamp')}
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('userName')}
                    >
                      <div className="flex items-center gap-2">
                        User
                        {renderSortIcon('userName')}
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('fieldLabel')}
                    >
                      <div className="flex items-center gap-2">
                        Field Changed
                        {renderSortIcon('fieldLabel')}
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Old Value
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      New Value
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedRecords.map((record) => (
                    <tr key={record.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-gray-400" />
                          <div>
                            <div>{format(new Date(record.timestamp), 'MMM d, yyyy')}</div>
                            <div className="text-xs text-gray-500">
                              {format(new Date(record.timestamp), 'h:mm a')}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-gray-400" />
                          {record.userName}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {record.fieldLabel}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                        {formatValue(record.oldValue)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                        {formatValue(record.newValue)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Showing <span className="font-medium">{startIndex}</span> to{' '}
                  <span className="font-medium">{endIndex}</span> of{' '}
                  <span className="font-medium">{sortedRecords.length}</span> changes
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`px-3 py-2 text-sm font-medium rounded-md ${
                            page === currentPage
                              ? 'bg-primary-600 text-white'
                              : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </button>
                      )
                    )}
                  </div>
                  <button
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default IncidentHistory;
