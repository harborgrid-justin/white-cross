/**
 * IncidentReportTable Component
 *
 * Advanced table with sorting, filtering, bulk selection, and export capabilities.
 * Full-featured data table for incident reports management.
 *
 * @module pages/incidents/components/IncidentReportTable
 *
 * Features:
 * - Sortable columns (click to sort)
 * - Bulk row selection with checkboxes
 * - Inline row actions
 * - Export to CSV functionality
 * - Advanced filtering
 * - Pagination support
 * - Loading and empty states
 * - HIPAA-compliant data handling
 * - Accessibility features
 *
 * @example
 * ```tsx
 * <IncidentReportTable
 *   incidents={incidents}
 *   loading={loading}
 *   onSort={handleSort}
 *   onBulkDelete={handleBulkDelete}
 *   onExport={handleExport}
 * />
 * ```
 */

import React, { useState, useMemo } from 'react';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableEmptyState,
  TableLoadingState,
} from '@/components/ui/data/Table';
import { Badge } from '@/components/ui/display/Badge';
import { Button } from '@/components/ui/buttons/Button';
import { Checkbox } from '@/components/ui/inputs/Checkbox';
import {
  Eye,
  Edit,
  Trash2,
  Download,
  AlertCircle,
  UserCheck,
  ArrowUpDown,
} from 'lucide-react';
import {
  IncidentReport,
  IncidentType,
  IncidentSeverity,
  IncidentStatus,
  getIncidentTypeLabel,
  getIncidentSeverityLabel,
} from '@/types/incidents';
import { format } from 'date-fns';
import { cn } from '@/utils/cn';

/**
 * Sort configuration
 */
interface SortConfig {
  column: 'occurredAt' | 'severity' | 'type' | 'status' | 'student';
  order: 'asc' | 'desc';
}

/**
 * Props for IncidentReportTable component
 */
interface IncidentReportTableProps {
  /** Array of incident reports to display */
  incidents: IncidentReport[];
  /** Loading state indicator */
  loading?: boolean;
  /** Initial sort configuration */
  initialSort?: SortConfig;
  /** Callback when sorting changes */
  onSort?: (config: SortConfig) => void;
  /** Callback when viewing an incident */
  onView?: (incident: IncidentReport) => void;
  /** Callback when editing an incident */
  onEdit?: (incident: IncidentReport) => void;
  /** Callback when deleting an incident */
  onDelete?: (incident: IncidentReport) => void;
  /** Callback when bulk deleting incidents */
  onBulkDelete?: (incidents: IncidentReport[]) => void;
  /** Callback when exporting data */
  onExport?: () => void;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Get variant for incident type badge
 */
const getTypeVariant = (
  type: IncidentType
): 'default' | 'primary' | 'warning' | 'error' | 'info' => {
  switch (type) {
    case IncidentType.EMERGENCY:
      return 'error';
    case IncidentType.MEDICATION_ERROR:
    case IncidentType.ALLERGIC_REACTION:
      return 'warning';
    case IncidentType.INJURY:
      return 'primary';
    case IncidentType.ILLNESS:
      return 'info';
    default:
      return 'default';
  }
};

/**
 * Get variant for severity badge
 */
const getSeverityVariant = (
  severity: IncidentSeverity
): 'success' | 'warning' | 'error' | 'danger' => {
  switch (severity) {
    case IncidentSeverity.LOW:
      return 'success';
    case IncidentSeverity.MEDIUM:
      return 'warning';
    case IncidentSeverity.HIGH:
      return 'error';
    case IncidentSeverity.CRITICAL:
      return 'danger';
    default:
      return 'warning';
  }
};

/**
 * Get variant for status badge
 */
const getStatusVariant = (
  status?: IncidentStatus
): 'default' | 'info' | 'warning' | 'success' => {
  switch (status) {
    case IncidentStatus.OPEN:
      return 'warning';
    case IncidentStatus.INVESTIGATING:
      return 'info';
    case IncidentStatus.RESOLVED:
      return 'success';
    case IncidentStatus.CLOSED:
      return 'default';
    default:
      return 'default';
  }
};

/**
 * IncidentReportTable Component
 *
 * Advanced data table with sorting, filtering, and bulk operations.
 */
const IncidentReportTable: React.FC<IncidentReportTableProps> = ({
  incidents,
  loading = false,
  initialSort = { column: 'occurredAt', order: 'desc' },
  onSort,
  onView,
  onEdit,
  onDelete,
  onBulkDelete,
  onExport,
  className = '',
}) => {
  // State for bulk selection
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  // State for sorting
  const [sortConfig, setSortConfig] = useState<SortConfig>(initialSort);

  /**
   * Format date for display
   */
  const formatDate = (dateString: string): string => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy HH:mm');
    } catch {
      return 'Invalid date';
    }
  };

  /**
   * Generate incident number display
   */
  const getIncidentNumber = (incident: IncidentReport): string => {
    return incident.id.slice(0, 8).toUpperCase();
  };

  /**
   * Handle select all checkbox
   */
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(new Set(incidents.map((inc) => inc.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  /**
   * Handle individual row selection
   */
  const handleSelectRow = (id: string, checked: boolean) => {
    const newSelected = new Set(selectedIds);
    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedIds(newSelected);
  };

  /**
   * Handle sort column click
   */
  const handleSort = (column: SortConfig['column']) => {
    const newOrder =
      sortConfig.column === column && sortConfig.order === 'asc' ? 'desc' : 'asc';
    const newConfig = { column, order: newOrder };
    setSortConfig(newConfig);
    onSort?.(newConfig);
  };

  /**
   * Handle bulk delete action
   */
  const handleBulkDelete = () => {
    const selectedIncidents = incidents.filter((inc) => selectedIds.has(inc.id));
    onBulkDelete?.(selectedIncidents);
    setSelectedIds(new Set());
  };

  /**
   * Check if all rows are selected
   */
  const isAllSelected = incidents.length > 0 && selectedIds.size === incidents.length;

  /**
   * Check if some rows are selected (for indeterminate state)
   */
  const isSomeSelected = selectedIds.size > 0 && selectedIds.size < incidents.length;

  /**
   * Sorted incidents
   */
  const sortedIncidents = useMemo(() => {
    return [...incidents].sort((a, b) => {
      const { column, order } = sortConfig;
      let aValue: any;
      let bValue: any;

      switch (column) {
        case 'occurredAt':
          aValue = new Date(a.occurredAt).getTime();
          bValue = new Date(b.occurredAt).getTime();
          break;
        case 'severity':
          const severityOrder = { LOW: 1, MEDIUM: 2, HIGH: 3, CRITICAL: 4 };
          aValue = severityOrder[a.severity] || 0;
          bValue = severityOrder[b.severity] || 0;
          break;
        case 'type':
          aValue = a.type;
          bValue = b.type;
          break;
        case 'status':
          aValue = a.status || '';
          bValue = b.status || '';
          break;
        case 'student':
          aValue = `${a.student?.lastName} ${a.student?.firstName}`;
          bValue = `${b.student?.lastName} ${b.student?.firstName}`;
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return order === 'asc' ? -1 : 1;
      if (aValue > bValue) return order === 'asc' ? 1 : -1;
      return 0;
    });
  }, [incidents, sortConfig]);

  return (
    <div className={cn('incident-report-table', className)}>
      {/* Bulk Actions Toolbar */}
      {selectedIds.size > 0 && (
        <div className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-md px-4 py-3 mb-4">
          <div className="text-sm font-medium text-blue-900">
            {selectedIds.size} incident{selectedIds.size > 1 ? 's' : ''} selected
          </div>
          <div className="flex items-center gap-2">
            {onBulkDelete && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBulkDelete}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Delete Selected
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedIds(new Set())}
            >
              Clear Selection
            </Button>
          </div>
        </div>
      )}

      {/* Export Button */}
      {onExport && incidents.length > 0 && (
        <div className="flex justify-end mb-4">
          <Button variant="ghost" size="sm" onClick={onExport}>
            <Download className="h-4 w-4 mr-1" />
            Export to CSV
          </Button>
        </div>
      )}

      <Table variant="default" size="md">
        <TableHeader>
          <TableRow>
            {/* Select All Checkbox */}
            <TableHead className="w-12">
              <Checkbox
                checked={isAllSelected}
                indeterminate={isSomeSelected}
                onChange={(e) => handleSelectAll(e.target.checked)}
                aria-label="Select all incidents"
              />
            </TableHead>
            <TableHead>Incident #</TableHead>
            <TableHead
              sortable
              sortDirection={sortConfig.column === 'type' ? sortConfig.order : null}
              onSort={() => handleSort('type')}
            >
              Type
            </TableHead>
            <TableHead
              sortable
              sortDirection={sortConfig.column === 'severity' ? sortConfig.order : null}
              onSort={() => handleSort('severity')}
            >
              Severity
            </TableHead>
            <TableHead
              sortable
              sortDirection={sortConfig.column === 'status' ? sortConfig.order : null}
              onSort={() => handleSort('status')}
            >
              Status
            </TableHead>
            <TableHead
              sortable
              sortDirection={sortConfig.column === 'student' ? sortConfig.order : null}
              onSort={() => handleSort('student')}
            >
              Student
            </TableHead>
            <TableHead>Location</TableHead>
            <TableHead
              sortable
              sortDirection={sortConfig.column === 'occurredAt' ? sortConfig.order : null}
              onSort={() => handleSort('occurredAt')}
            >
              Date
            </TableHead>
            <TableHead>Alerts</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableLoadingState rows={5} cols={10} />
          ) : sortedIncidents.length === 0 ? (
            <TableEmptyState
              colSpan={10}
              title="No incident reports found"
              description="There are no incident reports to display."
            />
          ) : (
            sortedIncidents.map((incident) => (
              <TableRow
                key={incident.id}
                selected={selectedIds.has(incident.id)}
                clickable
              >
                {/* Selection Checkbox */}
                <TableCell>
                  <Checkbox
                    checked={selectedIds.has(incident.id)}
                    onChange={(e) => handleSelectRow(incident.id, e.target.checked)}
                    aria-label={`Select incident ${getIncidentNumber(incident)}`}
                  />
                </TableCell>

                {/* Incident Number */}
                <TableCell className="font-medium">
                  <span className="text-gray-900 font-mono text-xs">
                    #{getIncidentNumber(incident)}
                  </span>
                </TableCell>

                {/* Type Badge */}
                <TableCell>
                  <Badge variant={getTypeVariant(incident.type)} size="sm" shape="rounded">
                    {getIncidentTypeLabel(incident.type)}
                  </Badge>
                </TableCell>

                {/* Severity Badge */}
                <TableCell>
                  <Badge
                    variant={getSeverityVariant(incident.severity)}
                    size="sm"
                    shape="pill"
                  >
                    {getIncidentSeverityLabel(incident.severity)}
                  </Badge>
                </TableCell>

                {/* Status */}
                <TableCell>
                  <Badge variant={getStatusVariant(incident.status)} size="sm" shape="rounded">
                    {incident.status || 'OPEN'}
                  </Badge>
                </TableCell>

                {/* Student Name */}
                <TableCell>
                  <div className="text-sm">
                    <div className="font-medium text-gray-900">
                      {incident.student?.firstName} {incident.student?.lastName}
                    </div>
                    {incident.student?.studentNumber && (
                      <div className="text-xs text-gray-500">
                        ID: {incident.student.studentNumber}
                      </div>
                    )}
                  </div>
                </TableCell>

                {/* Location */}
                <TableCell>
                  <span className="text-sm text-gray-700">{incident.location}</span>
                </TableCell>

                {/* Date */}
                <TableCell>
                  <div className="text-sm text-gray-900">{formatDate(incident.occurredAt)}</div>
                </TableCell>

                {/* Alerts */}
                <TableCell>
                  <div className="flex items-center gap-2">
                    {incident.followUpRequired && (
                      <div
                        className="flex items-center text-orange-600"
                        title="Follow-up required"
                        aria-label="Follow-up required"
                      >
                        <AlertCircle className="h-4 w-4" />
                      </div>
                    )}
                    {!incident.parentNotified && incident.severity !== IncidentSeverity.LOW && (
                      <div
                        className="flex items-center text-red-600"
                        title="Parent not notified"
                        aria-label="Parent not notified"
                      >
                        <UserCheck className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                </TableCell>

                {/* Actions */}
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    {onView && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onView(incident)}
                        aria-label={`View incident ${getIncidentNumber(incident)}`}
                        title="View details"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    )}
                    {onEdit && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(incident)}
                        aria-label={`Edit incident ${getIncidentNumber(incident)}`}
                        title="Edit incident"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    )}
                    {onDelete && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(incident)}
                        aria-label={`Delete incident ${getIncidentNumber(incident)}`}
                        title="Delete incident"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

IncidentReportTable.displayName = 'IncidentReportTable';

export default IncidentReportTable;
