/**
 * WF-MAIN-191 | index.main.tsx - React component or utility module
 * Purpose: react component or utility module
 * Upstream: ../contexts/WitnessStatementContext, ../contexts/FollowUpActionContext, ../services/modules/incidentReportsApi | Dependencies: react-router-dom, @tanstack/react-query, lucide-react
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: default export | Key Features: useState, useEffect, useMemo
 * Last Updated: 2025-10-17 | File Type: .tsx
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */

/**
 * Incident Report Detail Page
 *
 * Comprehensive incident detail view with integrated witness statements
 * and follow-up actions management.
 *
 * Features:
 * - Full incident report details display
 * - Tabbed interface (Details, Witness Statements, Follow-Up Actions, Timeline)
 * - Context-based state management for statements and actions
 * - CRUD operations for witness statements
 * - CRUD operations with status tracking for follow-up actions
 * - Overdue action alerts
 * - Route parameter validation
 * - Breadcrumb navigation
 * - Loading and error states
 * - Type-safe implementation
 *
 * @module IncidentReportDetail
 */

import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  AlertTriangle,
  ArrowLeft,
  Calendar,
  CheckCircle,
  Clock,
  Edit,
  FileText,
  MapPin,
  Plus,
  Shield,
  Trash2,
  User,
  Users,
  XCircle,
  AlertCircle,
  Camera,
  Download,
  Bell,
} from 'lucide-react';

// Context Providers
import { WitnessStatementProvider, useWitnessStatements } from '../contexts/WitnessStatementContext';
import { FollowUpActionProvider, useFollowUpActions } from '../contexts/FollowUpActionContext';

// Services and Types
import { incidentReportsApi } from '../services/modules/incidentReportsApi';
import {
  IncidentReport,
  WitnessStatement,
  FollowUpAction,
  WitnessType,
  ActionStatus,
  ActionPriority,
  CreateWitnessStatementRequest,
  CreateFollowUpActionRequest,
  UpdateFollowUpActionRequest,
  getIncidentSeverityColor,
  getActionPriorityColor,
  getActionStatusColor,
  getIncidentTypeLabel,
} from '../types/incidents';

// Validation
import { useValidatedParams, IncidentIdParamSchema } from '../utils/routeValidation';

// Utils
import { showSuccessToast, showErrorToast } from '../utils/toast';
import { formatDate, formatDateTime } from '../utils/dateHelpers';

// =====================
// TYPE DEFINITIONS
// =====================

type TabType = 'details' | 'witness-statements' | 'follow-up-actions' | 'timeline';

interface TimelineEvent {
  id: string;
  type: 'incident' | 'statement' | 'action' | 'notification';
  timestamp: string;
  title: string;
  description: string;
  actor?: string;
}

// =====================
// MAIN COMPONENT WITH PROVIDERS
// =====================

/**
 * Main Incident Report Detail Page Component
 * Wraps content with necessary context providers
 */
export default function IncidentReportDetail() {
  // Validate route parameters
  const { data: params, loading: paramsLoading, error: paramsError } = useValidatedParams(
    IncidentIdParamSchema,
    { fallbackRoute: '/incident-reports' }
  );

  if (paramsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading incident report...</p>
        </div>
      </div>
    );
  }

  if (paramsError || !params) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md">
          <XCircle className="h-16 w-16 text-red-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Invalid Incident ID</h2>
          <p className="text-gray-600 mb-4">
            {paramsError?.userMessage || 'The incident report ID is invalid or malformed.'}
          </p>
          <Link
            to="/incident-reports"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Incident Reports
          </Link>
        </div>
      </div>
    );
  }

  const incidentId = params.id;

  return (
    <WitnessStatementProvider incidentId={incidentId}>
      <FollowUpActionProvider initialIncidentId={incidentId}>
        <IncidentDetailContent incidentId={incidentId} />
      </FollowUpActionProvider>
    </WitnessStatementProvider>
  );
}

// =====================
// INCIDENT DETAIL CONTENT COMPONENT
// =====================

interface IncidentDetailContentProps {
  incidentId: string;
}

/**
 * Main content component with access to contexts
 */
function IncidentDetailContent({ incidentId }: IncidentDetailContentProps) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('details');

  // Fetch incident report
  const {
    data: incidentData,
    isLoading: isLoadingIncident,
    error: incidentError,
    refetch: refetchIncident,
  } = useQuery({
    queryKey: ['incident-report', incidentId],
    queryFn: async () => {
      return await incidentReportsApi.getIncidentReport(incidentId);
    },
    staleTime: 60000, // 1 minute
  });

  const incident = incidentData?.report;

  // Access witness statements context
  const witnessContext = useWitnessStatements();

  // Access follow-up actions context
  const followUpContext = useFollowUpActions();

  // Load data when component mounts
  useEffect(() => {
    witnessContext.loadWitnessStatements(incidentId);
    followUpContext.loadFollowUpActions(incidentId);
  }, [incidentId]);

  // Generate timeline
  const timeline = useMemo<TimelineEvent[]>(() => {
    if (!incident) return [];

    const events: TimelineEvent[] = [];

    // Incident creation
    events.push({
      id: 'incident-created',
      type: 'incident',
      timestamp: incident.occurredAt,
      title: 'Incident Occurred',
      description: `${getIncidentTypeLabel(incident.type)} - ${incident.severity} severity`,
      actor: incident.reportedBy?.firstName + ' ' + incident.reportedBy?.lastName,
    });

    // Witness statements
    witnessContext.statements.forEach((statement) => {
      events.push({
        id: `statement-${statement.id}`,
        type: 'statement',
        timestamp: statement.createdAt,
        title: 'Witness Statement Added',
        description: `Statement from ${statement.witnessName} (${statement.witnessType})`,
      });
    });

    // Follow-up actions
    followUpContext.actions.forEach((action) => {
      events.push({
        id: `action-${action.id}`,
        type: 'action',
        timestamp: action.createdAt,
        title: 'Follow-up Action Created',
        description: action.action,
      });

      if (action.completedAt) {
        events.push({
          id: `action-completed-${action.id}`,
          type: 'action',
          timestamp: action.completedAt,
          title: 'Follow-up Action Completed',
          description: action.action,
        });
      }
    });

    // Parent notification
    if (incident.parentNotified && incident.parentNotifiedAt) {
      events.push({
        id: 'parent-notified',
        type: 'notification',
        timestamp: incident.parentNotifiedAt,
        title: 'Parent Notified',
        description: `Via ${incident.parentNotificationMethod || 'unknown method'}`,
      });
    }

    // Sort by timestamp (most recent first)
    return events.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [incident, witnessContext.statements, followUpContext.actions]);

  // Loading state
  if (isLoadingIncident) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading incident details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (incidentError || !incident) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md">
          <AlertCircle className="h-16 w-16 text-red-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Failed to Load Incident</h2>
          <p className="text-gray-600 mb-4">
            {incidentError instanceof Error ? incidentError.message : 'An error occurred while loading the incident report.'}
          </p>
          <div className="flex gap-2 justify-center">
            <button
              onClick={() => refetchIncident()}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Retry
            </button>
            <button
              onClick={() => navigate('/incident-reports')}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
            >
              Back to List
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb Navigation */}
        <nav className="flex mb-6" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center">
              <Link
                to="/dashboard"
                className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600"
              >
                Dashboard
              </Link>
            </li>
            <li>
              <div className="flex items-center">
                <span className="mx-2 text-gray-400">/</span>
                <Link
                  to="/incident-reports"
                  className="text-sm font-medium text-gray-700 hover:text-blue-600"
                >
                  Incident Reports
                </Link>
              </div>
            </li>
            <li aria-current="page">
              <div className="flex items-center">
                <span className="mx-2 text-gray-400">/</span>
                <span className="text-sm font-medium text-gray-500">
                  {incident.type} - {incident.student?.firstName} {incident.student?.lastName}
                </span>
              </div>
            </li>
          </ol>
        </nav>

        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/incident-reports')}
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="h-5 w-5 mr-1" />
                Back
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Incident Report Details</h1>
                <p className="text-sm text-gray-600 mt-1">
                  Report ID: INC-{incident.id.slice(-8).toUpperCase()}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  // TODO: Implement edit functionality
                  showSuccessToast('Edit functionality coming soon');
                }}
                className="flex items-center px-4 py-2 text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 transition-colors"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </button>
              <button
                onClick={async () => {
                  try {
                    await incidentReportsApi.generateDocument(incident.id);
                    showSuccessToast('Document generated successfully');
                  } catch (error) {
                    showErrorToast('Failed to generate document');
                  }
                }}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <Download className="h-4 w-4 mr-2" />
                Generate Report
              </button>
            </div>
          </div>

          {/* Quick Info Bar */}
          <div className="flex flex-wrap gap-4 pt-4 border-t">
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getIncidentSeverityColor(incident.severity)}`}>
                {incident.severity}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <User className="h-4 w-4" />
              <span>
                {incident.student?.firstName} {incident.student?.lastName}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="h-4 w-4" />
              <span>{incident.location}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="h-4 w-4" />
              <span>{formatDateTime(incident.occurredAt)}</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('details')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'details'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <FileText className="h-4 w-4 inline mr-2" />
                Details
              </button>
              <button
                onClick={() => setActiveTab('witness-statements')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'witness-statements'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Users className="h-4 w-4 inline mr-2" />
                Witness Statements
                {witnessContext.statements.length > 0 && (
                  <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-600 rounded-full text-xs">
                    {witnessContext.statements.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveTab('follow-up-actions')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'follow-up-actions'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Clock className="h-4 w-4 inline mr-2" />
                Follow-Up Actions
                {followUpContext.stats.overdue > 0 && (
                  <span className="ml-2 px-2 py-0.5 bg-red-100 text-red-600 rounded-full text-xs">
                    {followUpContext.stats.overdue} Overdue
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveTab('timeline')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'timeline'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Calendar className="h-4 w-4 inline mr-2" />
                Timeline
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'details' && <DetailsTab incident={incident} />}
            {activeTab === 'witness-statements' && <WitnessStatementsTab incidentId={incident.id} />}
            {activeTab === 'follow-up-actions' && <FollowUpActionsTab incidentId={incident.id} />}
            {activeTab === 'timeline' && <TimelineTab timeline={timeline} />}
          </div>
        </div>
      </div>
    </div>
  );
}

// =====================
// DETAILS TAB COMPONENT
// =====================

interface DetailsTabProps {
  incident: IncidentReport;
}

function DetailsTab({ incident }: DetailsTabProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Details */}
      <div className="lg:col-span-2 space-y-6">
        {/* Incident Information */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Incident Information</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Type</label>
              <p className="text-gray-900 mt-1">{getIncidentTypeLabel(incident.type)}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Severity</label>
              <span className={`inline-block mt-1 px-3 py-1 rounded-full text-sm font-medium ${getIncidentSeverityColor(incident.severity)}`}>
                {incident.severity}
              </span>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Student</label>
              <p className="text-gray-900 mt-1">
                {incident.student?.firstName} {incident.student?.lastName}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Occurred At</label>
              <p className="text-gray-900 mt-1">{formatDateTime(incident.occurredAt)}</p>
            </div>
            <div className="col-span-2">
              <label className="text-sm font-medium text-gray-700">Location</label>
              <p className="text-gray-900 mt-1">{incident.location}</p>
            </div>
            <div className="col-span-2">
              <label className="text-sm font-medium text-gray-700">Description</label>
              <p className="text-gray-900 mt-1 whitespace-pre-wrap">{incident.description}</p>
            </div>
            <div className="col-span-2">
              <label className="text-sm font-medium text-gray-700">Actions Taken</label>
              <p className="text-gray-900 mt-1 whitespace-pre-wrap">{incident.actionsTaken}</p>
            </div>
            {incident.followUpNotes && (
              <div className="col-span-2">
                <label className="text-sm font-medium text-gray-700">Follow-up Notes</label>
                <p className="text-gray-900 mt-1 whitespace-pre-wrap">{incident.followUpNotes}</p>
              </div>
            )}
          </div>
        </div>

        {/* Evidence */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Camera className="h-5 w-5 mr-2" />
            Evidence
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">
                Photos ({incident.evidencePhotos?.length || 0})
              </label>
              <p className="text-gray-600 mt-1">
                {(incident.evidencePhotos?.length || 0) > 0 ? 'Photos available' : 'No photos uploaded'}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">
                Videos ({incident.evidenceVideos?.length || 0})
              </label>
              <p className="text-gray-600 mt-1">
                {(incident.evidenceVideos?.length || 0) > 0 ? 'Videos available' : 'No videos uploaded'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        {/* Parent Notification */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Bell className="h-5 w-5 mr-2" />
            Parent Notification
          </h3>
          {incident.parentNotified ? (
            <div className="space-y-2">
              <p className="text-green-600 flex items-center text-sm">
                <CheckCircle className="h-4 w-4 mr-2" />
                Parent Notified
              </p>
              {incident.parentNotificationMethod && (
                <p className="text-sm text-gray-600">Via: {incident.parentNotificationMethod}</p>
              )}
              {incident.parentNotifiedAt && (
                <p className="text-sm text-gray-600">At: {formatDateTime(incident.parentNotifiedAt)}</p>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-gray-600 text-sm mb-3">Parent has not been notified</p>
              <button
                onClick={async () => {
                  try {
                    await incidentReportsApi.notifyParent(incident.id, { method: 'email' });
                    showSuccessToast('Parent notified via email');
                  } catch (error) {
                    showErrorToast('Failed to notify parent');
                  }
                }}
                className="w-full px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Send Email Notification
              </button>
            </div>
          )}
        </div>

        {/* Compliance & Insurance */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Shield className="h-5 w-5 mr-2" />
            Compliance & Insurance
          </h3>
          <div className="space-y-3">
            {incident.legalComplianceStatus && (
              <div>
                <label className="text-sm font-medium text-gray-700">Compliance Status</label>
                <span className="block mt-1 px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-600">
                  {incident.legalComplianceStatus}
                </span>
              </div>
            )}
            {incident.insuranceClaimNumber && (
              <div>
                <label className="text-sm font-medium text-gray-700">Insurance Claim</label>
                <p className="text-gray-900 text-sm mt-1">{incident.insuranceClaimNumber}</p>
                {incident.insuranceClaimStatus && (
                  <p className="text-xs text-gray-600 mt-1">Status: {incident.insuranceClaimStatus}</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Reporter Information */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <User className="h-5 w-5 mr-2" />
            Reporter Information
          </h3>
          <div className="space-y-2">
            <div>
              <label className="text-sm font-medium text-gray-700">Reported By</label>
              <p className="text-gray-900 text-sm mt-1">
                {incident.reportedBy?.firstName} {incident.reportedBy?.lastName}
              </p>
              <p className="text-xs text-gray-600">{incident.reportedBy?.role}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Reported At</label>
              <p className="text-gray-900 text-sm mt-1">{formatDateTime(incident.createdAt)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// =====================
// WITNESS STATEMENTS TAB COMPONENT
// =====================

interface WitnessStatementsTabProps {
  incidentId: string;
}

function WitnessStatementsTab({ incidentId }: WitnessStatementsTabProps) {
  const {
    statements,
    isLoading,
    error,
    createWitnessStatement,
    updateWitnessStatement,
    deleteWitnessStatement,
    verifyStatement,
    unverifyStatement,
    operationLoading,
  } = useWitnessStatements();

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingStatement, setEditingStatement] = useState<WitnessStatement | null>(null);
  const [formData, setFormData] = useState<CreateWitnessStatementRequest>({
    incidentReportId: incidentId,
    witnessName: '',
    witnessType: WitnessType.STAFF,
    witnessContact: '',
    statement: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingStatement) {
        await updateWitnessStatement(editingStatement.id, {
          witnessName: formData.witnessName,
          witnessType: formData.witnessType,
          witnessContact: formData.witnessContact,
          statement: formData.statement,
        });
      } else {
        await createWitnessStatement(formData);
      }

      // Reset form
      setFormData({
        incidentReportId: incidentId,
        witnessName: '',
        witnessType: WitnessType.STAFF,
        witnessContact: '',
        statement: '',
      });
      setShowAddForm(false);
      setEditingStatement(null);
    } catch (error) {
      // Error handling is done in context
      console.error('Failed to save witness statement:', error);
    }
  };

  const handleEdit = (statement: WitnessStatement) => {
    setEditingStatement(statement);
    setFormData({
      incidentReportId: incidentId,
      witnessName: statement.witnessName,
      witnessType: statement.witnessType,
      witnessContact: statement.witnessContact || '',
      statement: statement.statement,
    });
    setShowAddForm(true);
  };

  const handleDelete = async (statementId: string) => {
    if (window.confirm('Are you sure you want to delete this witness statement?')) {
      try {
        await deleteWitnessStatement(statementId);
      } catch (error) {
        console.error('Failed to delete witness statement:', error);
      }
    }
  };

  const handleCancelForm = () => {
    setShowAddForm(false);
    setEditingStatement(null);
    setFormData({
      incidentReportId: incidentId,
      witnessName: '',
      witnessType: WitnessType.STAFF,
      witnessContact: '',
      statement: '',
    });
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading witness statements...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
        <p className="text-gray-900 font-medium">Failed to load witness statements</p>
        <p className="text-gray-600 text-sm mt-2">{error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">
          Witness Statements ({statements.length})
        </h3>
        {!showAddForm && (
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Statement
          </button>
        )}
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
          <h4 className="font-medium text-gray-900 mb-4">
            {editingStatement ? 'Edit Witness Statement' : 'New Witness Statement'}
          </h4>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Witness Name *
                </label>
                <input
                  type="text"
                  value={formData.witnessName}
                  onChange={(e) => setFormData({ ...formData, witnessName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Witness Type *
                </label>
                <select
                  value={formData.witnessType}
                  onChange={(e) => setFormData({ ...formData, witnessType: e.target.value as WitnessType })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value={WitnessType.STAFF}>Staff</option>
                  <option value={WitnessType.STUDENT}>Student</option>
                  <option value={WitnessType.PARENT}>Parent</option>
                  <option value={WitnessType.OTHER}>Other</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contact Information
              </label>
              <input
                type="text"
                value={formData.witnessContact}
                onChange={(e) => setFormData({ ...formData, witnessContact: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Email, phone, or other contact"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Statement *
              </label>
              <textarea
                value={formData.statement}
                onChange={(e) => setFormData({ ...formData, statement: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
                required
                placeholder="Describe what the witness observed..."
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={operationLoading.create || operationLoading.update}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {operationLoading.create || operationLoading.update ? 'Saving...' : editingStatement ? 'Update Statement' : 'Add Statement'}
              </button>
              <button
                type="button"
                onClick={handleCancelForm}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Statements List */}
      {statements.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No witness statements recorded yet</p>
          {!showAddForm && (
            <button
              onClick={() => setShowAddForm(true)}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Add First Statement
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {statements.map((statement) => (
            <div
              key={statement.id}
              className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-medium text-gray-900">{statement.witnessName}</h4>
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                      {statement.witnessType}
                    </span>
                    {statement.verified ? (
                      <span className="flex items-center text-green-600 text-sm">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Verified
                      </span>
                    ) : (
                      <span className="text-gray-500 text-sm">Not Verified</span>
                    )}
                  </div>
                  {statement.witnessContact && (
                    <p className="text-sm text-gray-600 mb-2">{statement.witnessContact}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  {!statement.verified ? (
                    <button
                      onClick={() => verifyStatement(statement.id)}
                      disabled={operationLoading.verify}
                      className="text-green-600 hover:text-green-700 disabled:text-gray-400"
                      title="Verify statement"
                    >
                      <CheckCircle className="h-5 w-5" />
                    </button>
                  ) : (
                    <button
                      onClick={() => unverifyStatement(statement.id)}
                      disabled={operationLoading.verify}
                      className="text-yellow-600 hover:text-yellow-700 disabled:text-gray-400"
                      title="Unverify statement"
                    >
                      <XCircle className="h-5 w-5" />
                    </button>
                  )}
                  <button
                    onClick={() => handleEdit(statement)}
                    className="text-blue-600 hover:text-blue-700"
                    title="Edit statement"
                  >
                    <Edit className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(statement.id)}
                    disabled={operationLoading.delete}
                    className="text-red-600 hover:text-red-700 disabled:text-gray-400"
                    title="Delete statement"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
              <p className="text-gray-700 whitespace-pre-wrap">{statement.statement}</p>
              <div className="mt-3 pt-3 border-t border-gray-200">
                <p className="text-xs text-gray-500">
                  Added {formatDateTime(statement.createdAt)}
                  {statement.verifiedAt && statement.verifiedBy && (
                    <span> • Verified {formatDateTime(statement.verifiedAt)}</span>
                  )}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// =====================
// FOLLOW-UP ACTIONS TAB COMPONENT
// =====================

interface FollowUpActionsTabProps {
  incidentId: string;
}

function FollowUpActionsTab({ incidentId }: FollowUpActionsTabProps) {
  const {
    actions,
    isLoading,
    error,
    stats,
    overdueActions,
    createFollowUpAction,
    updateFollowUpAction,
    deleteFollowUpAction,
    updateActionStatus,
    completeAction,
    isActionOverdue,
    filters,
    setFilters,
    isCreating,
    isUpdating,
    isDeleting,
  } = useFollowUpActions();

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAction, setEditingAction] = useState<FollowUpAction | null>(null);
  const [formData, setFormData] = useState<CreateFollowUpActionRequest>({
    incidentReportId: incidentId,
    action: '',
    dueDate: '',
    priority: ActionPriority.MEDIUM,
    assignedTo: undefined,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingAction) {
        await updateFollowUpAction(editingAction.id, {
          action: formData.action,
          dueDate: formData.dueDate,
          priority: formData.priority,
          assignedTo: formData.assignedTo,
        });
      } else {
        await createFollowUpAction(formData);
      }

      // Reset form
      setFormData({
        incidentReportId: incidentId,
        action: '',
        dueDate: '',
        priority: ActionPriority.MEDIUM,
        assignedTo: undefined,
      });
      setShowAddForm(false);
      setEditingAction(null);
    } catch (error) {
      console.error('Failed to save follow-up action:', error);
    }
  };

  const handleStatusChange = async (actionId: string, newStatus: ActionStatus) => {
    if (newStatus === ActionStatus.COMPLETED) {
      const notes = window.prompt('Add completion notes (optional):');
      if (notes !== null) {
        await completeAction(actionId, notes || 'Completed');
      }
    } else {
      await updateActionStatus(actionId, newStatus);
    }
  };

  const handleDelete = async (actionId: string) => {
    if (window.confirm('Are you sure you want to delete this follow-up action?')) {
      try {
        await deleteFollowUpAction(actionId);
      } catch (error) {
        console.error('Failed to delete follow-up action:', error);
      }
    }
  };

  const handleEdit = (action: FollowUpAction) => {
    setEditingAction(action);
    setFormData({
      incidentReportId: incidentId,
      action: action.action,
      dueDate: action.dueDate.split('T')[0], // Format for date input
      priority: action.priority,
      assignedTo: action.assignedTo,
    });
    setShowAddForm(true);
  };

  const handleCancelForm = () => {
    setShowAddForm(false);
    setEditingAction(null);
    setFormData({
      incidentReportId: incidentId,
      action: '',
      dueDate: '',
      priority: ActionPriority.MEDIUM,
      assignedTo: undefined,
    });
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading follow-up actions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
        <p className="text-gray-900 font-medium">Failed to load follow-up actions</p>
        <p className="text-gray-600 text-sm mt-2">{error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm text-gray-600">Total</p>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-yellow-50 rounded-lg p-4">
          <p className="text-sm text-gray-600">Pending</p>
          <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
        </div>
        <div className="bg-blue-50 rounded-lg p-4">
          <p className="text-sm text-gray-600">In Progress</p>
          <p className="text-2xl font-bold text-blue-600">{stats.inProgress}</p>
        </div>
        <div className="bg-green-50 rounded-lg p-4">
          <p className="text-sm text-gray-600">Completed</p>
          <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
        </div>
        <div className="bg-red-50 rounded-lg p-4">
          <p className="text-sm text-gray-600">Overdue</p>
          <p className="text-2xl font-bold text-red-600">{stats.overdue}</p>
        </div>
      </div>

      {/* Overdue Alerts */}
      {overdueActions.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start">
            <AlertTriangle className="h-5 w-5 text-red-600 mr-3 mt-0.5" />
            <div>
              <h4 className="font-medium text-red-900">Overdue Actions</h4>
              <p className="text-sm text-red-700 mt-1">
                You have {overdueActions.length} overdue action{overdueActions.length > 1 ? 's' : ''} that require attention.
              </p>
              <ul className="mt-2 space-y-1">
                {overdueActions.map((alert) => (
                  <li key={alert.action.id} className="text-sm text-red-700">
                    {alert.action.action} - {alert.daysOverdue} day{alert.daysOverdue > 1 ? 's' : ''} overdue
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Filters and Add Button */}
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex gap-2">
          <select
            value={filters.status?.[0] || ''}
            onChange={(e) => {
              if (e.target.value) {
                setFilters({ status: [e.target.value as ActionStatus] });
              } else {
                setFilters({ status: undefined });
              }
            }}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Status</option>
            <option value={ActionStatus.PENDING}>Pending</option>
            <option value={ActionStatus.IN_PROGRESS}>In Progress</option>
            <option value={ActionStatus.COMPLETED}>Completed</option>
            <option value={ActionStatus.CANCELLED}>Cancelled</option>
          </select>

          <select
            value={filters.priority?.[0] || ''}
            onChange={(e) => {
              if (e.target.value) {
                setFilters({ priority: [e.target.value as ActionPriority] });
              } else {
                setFilters({ priority: undefined });
              }
            }}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Priorities</option>
            <option value={ActionPriority.URGENT}>Urgent</option>
            <option value={ActionPriority.HIGH}>High</option>
            <option value={ActionPriority.MEDIUM}>Medium</option>
            <option value={ActionPriority.LOW}>Low</option>
          </select>

          <label className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md text-sm cursor-pointer hover:bg-gray-50">
            <input
              type="checkbox"
              checked={filters.overduedOnly || false}
              onChange={(e) => setFilters({ overduedOnly: e.target.checked })}
              className="rounded"
            />
            <span>Overdue Only</span>
          </label>
        </div>

        {!showAddForm && (
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Action
          </button>
        )}
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
          <h4 className="font-medium text-gray-900 mb-4">
            {editingAction ? 'Edit Follow-up Action' : 'New Follow-up Action'}
          </h4>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Action Description *
              </label>
              <textarea
                value={formData.action}
                onChange={(e) => setFormData({ ...formData, action: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                required
                placeholder="Describe the action that needs to be taken..."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Due Date *
                </label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Priority *
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value as ActionPriority })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value={ActionPriority.LOW}>Low</option>
                  <option value={ActionPriority.MEDIUM}>Medium</option>
                  <option value={ActionPriority.HIGH}>High</option>
                  <option value={ActionPriority.URGENT}>Urgent</option>
                </select>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={isCreating || isUpdating}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isCreating || isUpdating ? 'Saving...' : editingAction ? 'Update Action' : 'Add Action'}
              </button>
              <button
                type="button"
                onClick={handleCancelForm}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Actions List */}
      {actions.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No follow-up actions created yet</p>
          {!showAddForm && (
            <button
              onClick={() => setShowAddForm(true)}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Add First Action
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {actions.map((action) => {
            const overdue = isActionOverdue(action);
            return (
              <div
                key={action.id}
                className={`bg-white border rounded-lg p-4 hover:shadow-md transition-shadow ${
                  overdue ? 'border-red-300 bg-red-50' : 'border-gray-200'
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getActionPriorityColor(action.priority)}`}>
                        {action.priority}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getActionStatusColor(action.status)}`}>
                        {action.status}
                      </span>
                      {overdue && (
                        <span className="flex items-center text-red-600 text-sm font-medium">
                          <AlertTriangle className="h-4 w-4 mr-1" />
                          Overdue
                        </span>
                      )}
                    </div>
                    <p className="text-gray-900 font-medium">{action.action}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(action)}
                      className="text-blue-600 hover:text-blue-700"
                      title="Edit action"
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(action.id)}
                      disabled={isDeleting}
                      className="text-red-600 hover:text-red-700 disabled:text-gray-400"
                      title="Delete action"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>Due: {formatDate(action.dueDate)}</span>
                  </div>
                  {action.assignedToUser && (
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      <span>
                        Assigned: {action.assignedToUser.firstName} {action.assignedToUser.lastName}
                      </span>
                    </div>
                  )}
                </div>

                {action.notes && (
                  <div className="mt-2 pt-2 border-t border-gray-200">
                    <p className="text-sm text-gray-700">{action.notes}</p>
                  </div>
                )}

                {/* Status Actions */}
                {action.status !== ActionStatus.COMPLETED && action.status !== ActionStatus.CANCELLED && (
                  <div className="mt-3 pt-3 border-t border-gray-200 flex gap-2">
                    {action.status === ActionStatus.PENDING && (
                      <button
                        onClick={() => handleStatusChange(action.id, ActionStatus.IN_PROGRESS)}
                        className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                      >
                        Start Working
                      </button>
                    )}
                    {action.status === ActionStatus.IN_PROGRESS && (
                      <button
                        onClick={() => handleStatusChange(action.id, ActionStatus.COMPLETED)}
                        className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                      >
                        Mark Complete
                      </button>
                    )}
                    <button
                      onClick={() => handleStatusChange(action.id, ActionStatus.CANCELLED)}
                      className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                )}

                {action.completedAt && (
                  <div className="mt-2 text-xs text-green-600">
                    Completed {formatDateTime(action.completedAt)}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// =====================
// TIMELINE TAB COMPONENT
// =====================

interface TimelineTabProps {
  timeline: TimelineEvent[];
}

function TimelineTab({ timeline }: TimelineTabProps) {
  const getEventIcon = (type: TimelineEvent['type']) => {
    switch (type) {
      case 'incident':
        return <AlertTriangle className="h-5 w-5 text-red-600" />;
      case 'statement':
        return <Users className="h-5 w-5 text-blue-600" />;
      case 'action':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'notification':
        return <Bell className="h-5 w-5 text-yellow-600" />;
      default:
        return <Clock className="h-5 w-5 text-gray-600" />;
    }
  };

  const getEventColor = (type: TimelineEvent['type']) => {
    switch (type) {
      case 'incident':
        return 'bg-red-100';
      case 'statement':
        return 'bg-blue-100';
      case 'action':
        return 'bg-green-100';
      case 'notification':
        return 'bg-yellow-100';
      default:
        return 'bg-gray-100';
    }
  };

  if (timeline.length === 0) {
    return (
      <div className="text-center py-12">
        <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">No timeline events available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Incident Timeline</h3>

      <div className="relative">
        {/* Timeline Line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>

        {/* Timeline Events */}
        <div className="space-y-6">
          {timeline.map((event, index) => (
            <div key={event.id} className="relative flex gap-4">
              {/* Icon */}
              <div className={`relative z-10 flex items-center justify-center w-12 h-12 rounded-full ${getEventColor(event.type)}`}>
                {getEventIcon(event.type)}
              </div>

              {/* Content */}
              <div className="flex-1 bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-gray-900">{event.title}</h4>
                  <span className="text-xs text-gray-500">{formatDateTime(event.timestamp)}</span>
                </div>
                <p className="text-sm text-gray-700">{event.description}</p>
                {event.actor && (
                  <p className="text-xs text-gray-500 mt-2">By: {event.actor}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// =====================
// HELPER FUNCTION FOR DATE FORMATTING
// (Add these if they don't exist in utils)
// =====================

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function formatDateTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
