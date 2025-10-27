/**
 * IncidentReportCard Component
 *
 * Card display for a single incident report with summary information and actions.
 * Designed for grid layouts and dashboard widgets.
 *
 * @module pages/incidents/components/IncidentReportCard
 *
 * Features:
 * - Compact card design with incident summary
 * - Type and severity badges
 * - Student information display
 * - Location and date information
 * - Alert indicators (follow-up required, parent not notified)
 * - Action buttons (view details, edit)
 * - Responsive card design
 * - HIPAA-compliant data display
 * - Accessibility features
 *
 * @example
 * ```tsx
 * <IncidentReportCard
 *   incident={incident}
 *   onView={() => handleView(incident.id)}
 *   onEdit={() => handleEdit(incident.id)}
 * />
 * ```
 */

import React from 'react';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/layout/Card';
import { Badge } from '@/components/ui/display/Badge';
import { Button } from '@/components/ui/Button';
import { Eye, Edit, AlertCircle, UserCheck, MapPin, Calendar } from 'lucide-react';
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
 * Props for IncidentReportCard component
 */
interface IncidentReportCardProps {
  /** Incident report to display */
  incident: IncidentReport;
  /** Callback when viewing incident details */
  onView?: () => void;
  /** Callback when editing incident */
  onEdit?: () => void;
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
 * IncidentReportCard Component
 *
 * Displays a single incident report in a card format with summary information.
 * Highlights important alerts and provides quick action buttons.
 */
const IncidentReportCard: React.FC<IncidentReportCardProps> = ({
  incident,
  onView,
  onEdit,
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
  const getIncidentNumber = (): string => {
    return incident.id.slice(0, 8).toUpperCase();
  };

  /**
   * Check if card should be highlighted (critical or has alerts)
   */
  const shouldHighlight = (): boolean => {
    return (
      incident.severity === IncidentSeverity.CRITICAL ||
      (incident.followUpRequired && !incident.followUpNotes) ||
      (!incident.parentNotified && incident.severity !== IncidentSeverity.LOW)
    );
  };

  return (
    <Card
      variant={shouldHighlight() ? 'outlined' : 'default'}
      padding="none"
      rounded="lg"
      className={cn(
        'hover:shadow-md transition-shadow duration-200',
        shouldHighlight() && 'border-orange-300 bg-orange-50/30',
        className
      )}
    >
      {/* Card Header - Type, Severity, Status */}
      <CardHeader divider className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant={getTypeVariant(incident.type)} size="sm" shape="rounded">
                {getIncidentTypeLabel(incident.type)}
              </Badge>
              <Badge variant={getSeverityVariant(incident.severity)} size="sm" shape="pill">
                {getIncidentSeverityLabel(incident.severity)}
              </Badge>
              {incident.status && (
                <Badge variant={getStatusVariant(incident.status)} size="sm" shape="rounded">
                  {incident.status}
                </Badge>
              )}
            </div>
            <div className="text-xs font-mono text-gray-500">
              Incident #{getIncidentNumber()}
            </div>
          </div>

          {/* Alert Indicators */}
          <div className="flex items-center gap-2">
            {incident.followUpRequired && !incident.followUpNotes && (
              <div
                className="flex items-center text-orange-600"
                title="Follow-up required"
                aria-label="Follow-up required"
              >
                <AlertCircle className="h-5 w-5" />
              </div>
            )}
            {!incident.parentNotified && incident.severity !== IncidentSeverity.LOW && (
              <div
                className="flex items-center text-red-600"
                title="Parent not notified"
                aria-label="Parent not notified"
              >
                <UserCheck className="h-5 w-5" />
              </div>
            )}
          </div>
        </div>
      </CardHeader>

      {/* Card Content - Student, Location, Date */}
      <CardContent className="py-4">
        {/* Student Information */}
        <div className="mb-3">
          <div className="text-sm font-medium text-gray-900">
            {incident.student?.firstName} {incident.student?.lastName}
          </div>
          {incident.student?.studentNumber && (
            <div className="text-xs text-gray-500">
              Student ID: {incident.student.studentNumber}
            </div>
          )}
          {incident.student?.grade && (
            <div className="text-xs text-gray-500">
              Grade: {incident.student.grade}
            </div>
          )}
        </div>

        {/* Location */}
        <div className="flex items-start gap-2 mb-2">
          <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-gray-700">{incident.location}</div>
        </div>

        {/* Date */}
        <div className="flex items-start gap-2">
          <Calendar className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-gray-700">{formatDate(incident.occurredAt)}</div>
        </div>

        {/* Description Preview (truncated) */}
        {incident.description && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <p className="text-sm text-gray-600 line-clamp-2">
              {incident.description}
            </p>
          </div>
        )}
      </CardContent>

      {/* Card Footer - Actions */}
      <CardFooter divider className="py-3">
        <div className="flex items-center justify-between gap-2">
          <div className="text-xs text-gray-500">
            Reported by: {incident.reportedBy?.firstName} {incident.reportedBy?.lastName}
          </div>
          <div className="flex items-center gap-2">
            {onView && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onView}
                aria-label={`View incident ${getIncidentNumber()}`}
                title="View details"
              >
                <Eye className="h-4 w-4 mr-1" />
                View
              </Button>
            )}
            {onEdit && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onEdit}
                aria-label={`Edit incident ${getIncidentNumber()}`}
                title="Edit incident"
              >
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
            )}
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

IncidentReportCard.displayName = 'IncidentReportCard';

export default IncidentReportCard;
