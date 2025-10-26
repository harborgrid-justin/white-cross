/**
 * IncidentReportSummary Component
 *
 * Summary card/widget for displaying concise incident information.
 * Designed for dashboards and quick overview displays.
 *
 * @module pages/incidents/components/IncidentReportSummary
 *
 * Features:
 * - Compact summary format
 * - Key information at a glance
 * - Type, severity, status indicators
 * - Optional click handler for navigation
 * - Compact and expanded modes
 * - HIPAA-compliant display
 *
 * @example
 * ```tsx
 * // Compact mode for dashboard
 * <IncidentReportSummary
 *   incident={incident}
 *   compact
 *   onClick={() => navigate(`/incidents/${incident.id}`)}
 * />
 *
 * // Expanded mode with more details
 * <IncidentReportSummary
 *   incident={incident}
 *   onClick={handleClick}
 * />
 * ```
 */

import React from 'react';
import { Card, CardContent } from '@/components/ui/layout/Card';
import { Badge } from '@/components/ui/display/Badge';
import {
  AlertCircle,
  UserCheck,
  MapPin,
  Calendar,
  ChevronRight,
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
 * Props for IncidentReportSummary component
 */
interface IncidentReportSummaryProps {
  /** Incident report to display */
  incident: IncidentReport;
  /** Compact mode for smaller displays */
  compact?: boolean;
  /** Optional click handler for navigation */
  onClick?: () => void;
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
 * IncidentReportSummary Component
 *
 * Displays a concise summary of an incident report for dashboard widgets.
 */
const IncidentReportSummary: React.FC<IncidentReportSummaryProps> = ({
  incident,
  compact = false,
  onClick,
  className = '',
}) => {
  /**
   * Format date for display
   */
  const formatDate = (dateString: string): string => {
    try {
      if (compact) {
        return format(new Date(dateString), 'MMM dd, HH:mm');
      }
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
   * Check if incident has alerts
   */
  const hasAlerts = (): boolean => {
    return (
      (incident.followUpRequired && !incident.followUpNotes) ||
      (!incident.parentNotified && incident.severity !== IncidentSeverity.LOW)
    );
  };

  /**
   * Render compact mode
   */
  if (compact) {
    return (
      <div
        className={cn(
          'incident-report-summary-compact p-3 border border-gray-200 rounded-md hover:border-gray-300 transition-colors',
          onClick && 'cursor-pointer',
          hasAlerts() && 'border-orange-300 bg-orange-50/30',
          className
        )}
        onClick={onClick}
        role={onClick ? 'button' : undefined}
        tabIndex={onClick ? 0 : undefined}
        onKeyDown={
          onClick
            ? (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onClick();
                }
              }
            : undefined
        }
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            {/* Incident Number */}
            <span className="text-xs font-mono text-gray-500 flex-shrink-0">
              #{getIncidentNumber()}
            </span>

            {/* Badges */}
            <Badge variant={getTypeVariant(incident.type)} size="sm" shape="rounded">
              {getIncidentTypeLabel(incident.type)}
            </Badge>
            <Badge variant={getSeverityVariant(incident.severity)} size="sm" shape="pill">
              {getIncidentSeverityLabel(incident.severity)}
            </Badge>

            {/* Alerts */}
            {hasAlerts() && <AlertCircle className="h-4 w-4 text-orange-600 flex-shrink-0" />}
          </div>

          {/* Arrow */}
          {onClick && <ChevronRight className="h-4 w-4 text-gray-400 flex-shrink-0" />}
        </div>

        {/* Student Name */}
        <div className="mt-2 text-sm font-medium text-gray-900 truncate">
          {incident.student?.firstName} {incident.student?.lastName}
        </div>

        {/* Date */}
        <div className="mt-1 text-xs text-gray-500">{formatDate(incident.occurredAt)}</div>
      </div>
    );
  }

  /**
   * Render expanded mode
   */
  return (
    <Card
      variant="default"
      padding="none"
      className={cn(
        'incident-report-summary',
        onClick && 'cursor-pointer hover:shadow-md',
        hasAlerts() && 'border-orange-300 bg-orange-50/30',
        className
      )}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick();
              }
            }
          : undefined
      }
    >
      <CardContent className="py-4">
        {/* Header - Badges and Incident Number */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex flex-wrap items-center gap-2">
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

          {/* Alerts */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {incident.followUpRequired && !incident.followUpNotes && (
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
        </div>

        {/* Incident Number */}
        <div className="text-xs font-mono text-gray-500 mb-3">Incident #{getIncidentNumber()}</div>

        {/* Student Information */}
        <div className="mb-2">
          <div className="text-sm font-medium text-gray-900">
            {incident.student?.firstName} {incident.student?.lastName}
          </div>
          {incident.student?.studentNumber && (
            <div className="text-xs text-gray-500">ID: {incident.student.studentNumber}</div>
          )}
        </div>

        {/* Location */}
        <div className="flex items-start gap-2 mb-2">
          <MapPin className="h-3.5 w-3.5 text-gray-400 mt-0.5 flex-shrink-0" />
          <span className="text-xs text-gray-600">{incident.location}</span>
        </div>

        {/* Date */}
        <div className="flex items-start gap-2">
          <Calendar className="h-3.5 w-3.5 text-gray-400 mt-0.5 flex-shrink-0" />
          <span className="text-xs text-gray-600">{formatDate(incident.occurredAt)}</span>
        </div>

        {/* Description Preview (if not compact) */}
        {incident.description && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <p className="text-xs text-gray-600 line-clamp-2">{incident.description}</p>
          </div>
        )}

        {/* Click Indicator */}
        {onClick && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Click to view details</span>
              <ChevronRight className="h-4 w-4" />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

IncidentReportSummary.displayName = 'IncidentReportSummary';

export default IncidentReportSummary;
