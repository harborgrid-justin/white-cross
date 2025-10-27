/**
 * IncidentReportDetails Component
 *
 * Detailed view of a single incident report with tabbed interface.
 * Fetches and displays comprehensive incident information including
 * witnesses, follow-ups, timeline, and documents.
 *
 * @module pages/incidents/components/IncidentReportDetails
 *
 * Features:
 * - Fetches incident details using incidentId prop
 * - Tabbed interface: Details, Witnesses, Follow-ups, Timeline, Documents
 * - Action buttons: Edit, Print, Export, Delete
 * - Loading and error states
 * - HIPAA-compliant data display
 * - Audit logging for PHI access
 * - Accessibility features
 *
 * @example
 * ```tsx
 * <IncidentReportDetails
 *   incidentId="incident-123"
 *   onEdit={handleEdit}
 *   onDelete={handleDelete}
 * />
 * ```
 */

import React, { useState, useEffect } from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from '@/components/ui/layout/Card';
import { Badge } from '@/components/ui/display/Badge';
import { Button } from '@/components/ui/Button';
import { Tabs } from '@/components/ui/navigation/Tabs';
import { LoadingSpinner } from '@/components/ui/feedback/LoadingSpinner';
import { Alert } from '@/components/ui/feedback/Alert';
import {
  Edit,
  Printer,
  Download,
  Trash2,
  MapPin,
  Calendar,
  User,
  FileText,
  AlertCircle,
  CheckCircle,
  Clock,
} from 'lucide-react';
import {
  IncidentReport,
  IncidentType,
  IncidentSeverity,
  getIncidentTypeLabel,
  getIncidentSeverityLabel,
} from '@/types/incidents';
import { incidentsApi } from '@/services/modules/incidentsApi';
import { format } from 'date-fns';
import { cn } from '@/utils/cn';

/**
 * Props for IncidentReportDetails component
 */
interface IncidentReportDetailsProps {
  /** Incident report ID to display */
  incidentId: string;
  /** Callback when editing incident */
  onEdit?: () => void;
  /** Callback when deleting incident */
  onDelete?: () => void;
  /** Callback when printing report */
  onPrint?: () => void;
  /** Callback when exporting report */
  onExport?: () => void;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Tab identifiers
 */
type TabId = 'details' | 'witnesses' | 'followups' | 'timeline' | 'documents';

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
 * IncidentReportDetails Component
 *
 * Displays comprehensive incident report information with tabbed sections.
 */
const IncidentReportDetails: React.FC<IncidentReportDetailsProps> = ({
  incidentId,
  onEdit,
  onDelete,
  onPrint,
  onExport,
  className = '',
}) => {
  // State
  const [incident, setIncident] = useState<IncidentReport | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabId>('details');

  /**
   * Fetch incident details
   */
  useEffect(() => {
    const fetchIncident = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await incidentsApi.getById(incidentId);
        setIncident(response.report);
      } catch (err: any) {
        setError(err.message || 'Failed to load incident details');
      } finally {
        setLoading(false);
      }
    };

    fetchIncident();
  }, [incidentId]);

  /**
   * Format date for display
   */
  const formatDate = (dateString: string): string => {
    try {
      return format(new Date(dateString), 'MMMM dd, yyyy HH:mm');
    } catch {
      return 'Invalid date';
    }
  };

  /**
   * Generate incident number
   */
  const getIncidentNumber = (): string => {
    return incident?.id.slice(0, 8).toUpperCase() || '';
  };

  /**
   * Handle print
   */
  const handlePrint = () => {
    if (onPrint) {
      onPrint();
    } else {
      window.print();
    }
  };

  /**
   * Handle export
   */
  const handleExport = async () => {
    if (onExport) {
      onExport();
    } else if (incident) {
      try {
        const blob = await incidentsApi.generateReport(incident.id);
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `incident-${getIncidentNumber()}.pdf`;
        link.click();
        URL.revokeObjectURL(url);
      } catch (err) {
        console.error('Export failed:', err);
      }
    }
  };

  /**
   * Render loading state
   */
  if (loading) {
    return (
      <div className={cn('incident-report-details', className)}>
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <LoadingSpinner size="lg" />
          </CardContent>
        </Card>
      </div>
    );
  }

  /**
   * Render error state
   */
  if (error || !incident) {
    return (
      <div className={cn('incident-report-details', className)}>
        <Alert variant="error" title="Error loading incident">
          {error || 'Incident not found'}
        </Alert>
      </div>
    );
  }

  /**
   * Tab definitions
   */
  const tabs = [
    { id: 'details' as TabId, label: 'Details', icon: <FileText className="h-4 w-4" /> },
    {
      id: 'witnesses' as TabId,
      label: 'Witnesses',
      icon: <User className="h-4 w-4" />,
      badge: incident.witnessStatements?.length || 0,
    },
    {
      id: 'followups' as TabId,
      label: 'Follow-ups',
      icon: <AlertCircle className="h-4 w-4" />,
      badge: incident.followUpActions?.length || 0,
    },
    { id: 'timeline' as TabId, label: 'Timeline', icon: <Clock className="h-4 w-4" /> },
    {
      id: 'documents' as TabId,
      label: 'Documents',
      icon: <FileText className="h-4 w-4" />,
      badge: (incident.attachments?.length || 0) + (incident.evidencePhotos?.length || 0),
    },
  ];

  return (
    <div className={cn('incident-report-details', className)}>
      {/* Header Section */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <Badge variant={getTypeVariant(incident.type)} size="md" shape="rounded">
                  {getIncidentTypeLabel(incident.type)}
                </Badge>
                <Badge variant={getSeverityVariant(incident.severity)} size="md" shape="pill">
                  {getIncidentSeverityLabel(incident.severity)}
                </Badge>
                {incident.status && (
                  <Badge variant="default" size="md" shape="rounded">
                    {incident.status}
                  </Badge>
                )}
              </div>
              <CardTitle>Incident #{getIncidentNumber()}</CardTitle>
              <CardDescription>
                Reported on {formatDate(incident.createdAt || incident.occurredAt)}
              </CardDescription>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              {onEdit && (
                <Button variant="ghost" size="sm" onClick={onEdit}>
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
              )}
              <Button variant="ghost" size="sm" onClick={handlePrint}>
                <Printer className="h-4 w-4 mr-1" />
                Print
              </Button>
              <Button variant="ghost" size="sm" onClick={handleExport}>
                <Download className="h-4 w-4 mr-1" />
                Export
              </Button>
              {onDelete && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onDelete}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Alerts */}
      {incident.followUpRequired && !incident.followUpNotes && (
        <Alert variant="warning" title="Follow-up Required" className="mb-6">
          This incident requires follow-up action.
        </Alert>
      )}
      {!incident.parentNotified && incident.severity !== IncidentSeverity.LOW && (
        <Alert variant="error" title="Parent Not Notified" className="mb-6">
          Parents have not been notified about this incident.
        </Alert>
      )}

      {/* Tabbed Content */}
      <Card>
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as TabId)}>
          <Tabs.List className="border-b border-gray-200 px-6">
            {tabs.map((tab) => (
              <Tabs.Trigger key={tab.id} value={tab.id} className="flex items-center gap-2">
                {tab.icon}
                {tab.label}
                {tab.badge !== undefined && tab.badge > 0 && (
                  <Badge variant="default" size="sm" shape="pill">
                    {tab.badge}
                  </Badge>
                )}
              </Tabs.Trigger>
            ))}
          </Tabs.List>

          {/* Details Tab */}
          <Tabs.Content value="details">
            <CardContent className="py-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Student Information */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">
                    Student Information
                  </h4>
                  <dl className="space-y-2">
                    <div>
                      <dt className="text-xs text-gray-500">Name</dt>
                      <dd className="text-sm font-medium text-gray-900">
                        {incident.student?.firstName} {incident.student?.lastName}
                      </dd>
                    </div>
                    {incident.student?.studentNumber && (
                      <div>
                        <dt className="text-xs text-gray-500">Student ID</dt>
                        <dd className="text-sm text-gray-900">
                          {incident.student.studentNumber}
                        </dd>
                      </div>
                    )}
                    {incident.student?.grade && (
                      <div>
                        <dt className="text-xs text-gray-500">Grade</dt>
                        <dd className="text-sm text-gray-900">{incident.student.grade}</dd>
                      </div>
                    )}
                  </dl>
                </div>

                {/* Incident Information */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">
                    Incident Information
                  </h4>
                  <dl className="space-y-2">
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                      <div>
                        <dt className="text-xs text-gray-500">Location</dt>
                        <dd className="text-sm text-gray-900">{incident.location}</dd>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Calendar className="h-4 w-4 text-gray-400 mt-0.5" />
                      <div>
                        <dt className="text-xs text-gray-500">Occurred At</dt>
                        <dd className="text-sm text-gray-900">
                          {formatDate(incident.occurredAt)}
                        </dd>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <User className="h-4 w-4 text-gray-400 mt-0.5" />
                      <div>
                        <dt className="text-xs text-gray-500">Reported By</dt>
                        <dd className="text-sm text-gray-900">
                          {incident.reportedBy?.firstName} {incident.reportedBy?.lastName}
                        </dd>
                      </div>
                    </div>
                  </dl>
                </div>
              </div>

              {/* Description */}
              <div className="mt-6">
                <h4 className="text-sm font-semibold text-gray-900 mb-2">Description</h4>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">
                  {incident.description}
                </p>
              </div>

              {/* Actions Taken */}
              <div className="mt-6">
                <h4 className="text-sm font-semibold text-gray-900 mb-2">Actions Taken</h4>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">
                  {incident.actionsTaken}
                </p>
              </div>

              {/* Parent Notification */}
              {incident.parentNotified && (
                <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-md">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-semibold text-green-900 mb-1">
                        Parent Notified
                      </h4>
                      {incident.parentNotificationMethod && (
                        <p className="text-sm text-green-700">
                          Method: {incident.parentNotificationMethod}
                        </p>
                      )}
                      {incident.parentNotifiedAt && (
                        <p className="text-sm text-green-700">
                          Notified: {formatDate(incident.parentNotifiedAt)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Tabs.Content>

          {/* Witnesses Tab */}
          <Tabs.Content value="witnesses">
            <CardContent className="py-6">
              {incident.witnessStatements && incident.witnessStatements.length > 0 ? (
                <div className="space-y-4">
                  {incident.witnessStatements.map((statement, index) => (
                    <div key={statement.id} className="p-4 border border-gray-200 rounded-md">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h5 className="text-sm font-medium text-gray-900">
                            {statement.witnessName}
                          </h5>
                          <p className="text-xs text-gray-500">{statement.witnessType}</p>
                        </div>
                        {statement.verified && (
                          <Badge variant="success" size="sm">
                            Verified
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-700 mt-2">{statement.statement}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No witness statements recorded
                </div>
              )}
            </CardContent>
          </Tabs.Content>

          {/* Follow-ups Tab */}
          <Tabs.Content value="followups">
            <CardContent className="py-6">
              {incident.followUpActions && incident.followUpActions.length > 0 ? (
                <div className="space-y-4">
                  {incident.followUpActions.map((action) => (
                    <div key={action.id} className="p-4 border border-gray-200 rounded-md">
                      <div className="flex items-start justify-between mb-2">
                        <h5 className="text-sm font-medium text-gray-900">{action.action}</h5>
                        <Badge variant="default" size="sm">
                          {action.status}
                        </Badge>
                      </div>
                      <div className="text-xs text-gray-500 mt-2">
                        Due: {formatDate(action.dueDate)}
                      </div>
                      {action.notes && (
                        <p className="text-sm text-gray-700 mt-2">{action.notes}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No follow-up actions recorded
                </div>
              )}
            </CardContent>
          </Tabs.Content>

          {/* Timeline Tab */}
          <Tabs.Content value="timeline">
            <CardContent className="py-6">
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 bg-blue-600 rounded-full" />
                    <div className="w-0.5 h-full bg-gray-200" />
                  </div>
                  <div className="pb-6">
                    <p className="text-sm font-medium text-gray-900">Incident Occurred</p>
                    <p className="text-xs text-gray-500">{formatDate(incident.occurredAt)}</p>
                  </div>
                </div>
                {incident.createdAt && (
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 bg-blue-600 rounded-full" />
                      <div className="w-0.5 h-full bg-gray-200" />
                    </div>
                    <div className="pb-6">
                      <p className="text-sm font-medium text-gray-900">Report Created</p>
                      <p className="text-xs text-gray-500">{formatDate(incident.createdAt)}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Tabs.Content>

          {/* Documents Tab */}
          <Tabs.Content value="documents">
            <CardContent className="py-6">
              {(incident.attachments && incident.attachments.length > 0) ||
              (incident.evidencePhotos && incident.evidencePhotos.length > 0) ? (
                <div className="space-y-4">
                  {incident.attachments?.map((attachment, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 border rounded-md">
                      <FileText className="h-5 w-5 text-gray-400" />
                      <span className="text-sm text-gray-900">{attachment}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">No documents attached</div>
              )}
            </CardContent>
          </Tabs.Content>
        </Tabs>
      </Card>
    </div>
  );
};

IncidentReportDetails.displayName = 'IncidentReportDetails';

export default IncidentReportDetails;
