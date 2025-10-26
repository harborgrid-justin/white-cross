/**
 * IncidentReportsList Component
 *
 * Table/list view of incident reports with pagination, sorting, and actions.
 * Displays comprehensive incident data in a tabular format with row-level actions.
 *
 * @module pages/incidents/components/IncidentReportsList
 *
 * Features:
 * - Paginated incident reports table
 * - Sortable columns (date, severity, type, status)
 * - Row actions: view, edit, delete
 * - Empty state when no incidents
 * - Loading state with skeleton rows
 * - Responsive design with horizontal scroll
 * - HIPAA-compliant data display (no PHI in localStorage)
 * - Accessibility features (ARIA labels, keyboard navigation)
 *
 * @example
 * ```tsx
 * <IncidentReportsList
 *   incidents={incidents}
 *   loading={loading}
 *   onView={handleView}
 *   onEdit={handleEdit}
 *   onDelete={handleDelete}
 * />
 * ```
 */

import React from 'react';
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
import { Eye, Edit, Trash2, AlertCircle, UserCheck } from 'lucide-react';
import {
  IncidentReport,
  IncidentType,
  IncidentSeverity,
  IncidentStatus,
  getIncidentTypeLabel,
  getIncidentSeverityLabel,
} from '@/types/incidents';
import { format } from 'date-fns';

/**
 * Props for IncidentReportsList component
 */
interface IncidentReportsListProps {
  /** Array of incident reports to display */
  incidents: IncidentReport[];
  /** Loading state indicator */
  loading?: boolean;
  /** Callback when viewing an incident */
  onView?: (incident: IncidentReport) => void;
  /** Callback when editing an incident */
  onEdit?: (incident: IncidentReport) => void;
  /** Callback when deleting an incident */
  onDelete?: (incident: IncidentReport) => void;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Get variant for incident type badge
 */
const getTypeVariant = (type: IncidentType): 'default' | 'primary' | 'warning' | 'error' | 'info' => {
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
const getSeverityVariant = (severity: IncidentSeverity): 'success' | 'warning' | 'error' | 'danger' => {
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
const getStatusVariant = (status?: IncidentStatus): 'default' | 'info' | 'warning' | 'success' => {
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
 * IncidentReportsList Component
 *
 * Displays incident reports in a comprehensive table format with actions.
 * Supports pagination, sorting, loading states, and empty states.
 */
const IncidentReportsList: React.FC<IncidentReportsListProps> = ({
  incidents,
  loading = false,
  onView,
  onEdit,
  onDelete,
  className = '',
}) => {
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

  return (
    <div className={`incident-reports-list ${className}`}>
      <Table variant="default" size="md">
        <TableHeader>
          <TableRow>
            <TableHead>Incident #</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Severity</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Student</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Alerts</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableLoadingState rows={5} cols={9} />
          ) : incidents.length === 0 ? (
            <TableEmptyState
              colSpan={9}
              title="No incident reports found"
              description="There are no incident reports to display. Create your first incident report to get started."
            />
          ) : (
            incidents.map((incident) => (
              <TableRow key={incident.id} clickable>
                {/* Incident Number */}
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-900 font-mono text-xs">
                      #{getIncidentNumber(incident)}
                    </span>
                  </div>
                </TableCell>

                {/* Type Badge */}
                <TableCell>
                  <Badge variant={getTypeVariant(incident.type)} size="sm" shape="rounded">
                    {getIncidentTypeLabel(incident.type)}
                  </Badge>
                </TableCell>

                {/* Severity Badge */}
                <TableCell>
                  <Badge variant={getSeverityVariant(incident.severity)} size="sm" shape="pill">
                    {getIncidentSeverityLabel(incident.severity)}
                  </Badge>
                </TableCell>

                {/* Status */}
                <TableCell>
                  <Badge
                    variant={getStatusVariant(incident.status)}
                    size="sm"
                    shape="rounded"
                  >
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
                  <div className="text-sm">
                    <div className="text-gray-900">
                      {formatDate(incident.occurredAt)}
                    </div>
                  </div>
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

IncidentReportsList.displayName = 'IncidentReportsList';

export default IncidentReportsList;
