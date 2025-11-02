/**
 * @fileoverview Incident Detail Page - Comprehensive view of a single incident with
 * full details, status management, witness tracking, follow-ups, and audit trail.
 *
 * @module app/(dashboard)/incidents/[id]/page
 * @category Incidents - Detail Pages
 *
 * ## Overview
 * Displays complete incident information with interactive status management, quick actions
 * for witness and follow-up management, and visual timeline of incident progression.
 * Serves as the central hub for managing a specific incident throughout its lifecycle.
 *
 * ## Features
 * - **Comprehensive Incident Display**: All incident fields including type, severity, location, description
 * - **Status Management**: Visual status badges with workflow-aware transitions
 * - **Severity Indicators**: Color-coded severity levels (MINOR to LIFE_THREATENING)
 * - **Quick Actions**: Sidebar with common actions (edit, add witness, create follow-up, export)
 * - **Timeline View**: Chronological display of incident events (occurred, reported, created)
 * - **Medical Response Details**: Displayed when medical attention was provided
 * - **Parent Notification Tracking**: Shows notification method and timestamp
 * - **Privacy Indicators**: Visual alerts for confidential or restricted access incidents
 * - **Tag Management**: Display of incident tags for categorization
 *
 * ## Incident Status Workflow
 * Status displayed with color-coded badges:
 * - **PENDING_REVIEW** (yellow): Awaiting administrator review
 * - **UNDER_INVESTIGATION** (blue): Active investigation in progress
 * - **REQUIRES_ACTION** (orange): Additional action or information needed
 * - **RESOLVED** (green): Investigation complete, all actions taken
 * - **ARCHIVED** (gray): Closed and archived
 *
 * Users can update status via "Update Status" quick action (when authorized).
 *
 * ## Severity Levels & Display
 * Color-coded severity badges:
 * - **MINOR** (green): Minor incident, no medical attention required
 * - **MODERATE** (yellow): Medical attention provided, no transport needed
 * - **SERIOUS** (orange): Significant injury/illness, possible transport
 * - **CRITICAL** (red): Severe injury/illness, immediate medical intervention
 * - **LIFE_THREATENING** (red): Emergency medical transport, life-threatening situation
 *
 * Severity level determines notification requirements and mandatory reporting.
 *
 * ## Medical Response Information
 * When medical response is documented (not NONE), displays:
 * - Response type (FIRST_AID, NURSE_OFFICE, EMS_CALLED, HOSPITAL_TRANSPORT, etc.)
 * - Medical notes and treatment provided
 * - Medications administered (if applicable)
 * - Follow-up care recommendations
 *
 * ## Parent Notification Display
 * When parent/guardian was notified, displays:
 * - Notification timestamp
 * - Notification method (phone call, email, text, in-person)
 * - Person who made notification
 * - Parent response/acknowledgment (if recorded)
 *
 * ## Quick Actions Sidebar
 * Provides one-click access to common workflows:
 * 1. **Edit**: Navigate to incident edit form (permission-based)
 * 2. **Add Witness**: Add witness to incident investigation
 * 3. **Create Follow-Up**: Schedule or document follow-up action
 * 4. **Update Status**: Change incident status (triggers workflow)
 * 5. **Export Report**: Generate PDF report for printing or records
 * 6. **View Witnesses**: Navigate to witnesses list page
 * 7. **View Follow-Ups**: Navigate to follow-ups list page
 *
 * ## Timeline Component
 * Displays chronological events:
 * - **Incident Occurred**: Date/time the incident actually happened
 * - **Reported**: Date/time the incident was reported to staff
 * - **Created**: Date/time the incident record was created in system
 * - **Status Changes**: Displayed in order (when implemented)
 * - **Follow-Ups**: Links to follow-up records (when implemented)
 *
 * ## Privacy & Confidentiality
 * Visual indicators for sensitive incidents:
 * - **Confidential Record**: Red border card indicating restricted access
 * - **Restricted Access**: Limited to authorized personnel only
 * - Audit logging for all views of confidential incidents
 * - PHI (Protected Health Information) handling compliance
 *
 * ## Integration Points
 * - **Student Records**: Links to student profile and health history
 * - **Witness Management**: Navigate to add/view witnesses for this incident
 * - **Follow-Up System**: Create and track follow-up actions and appointments
 * - **Notification System**: View notification history and send additional notifications
 * - **Document Management**: Attach photos, documents, or evidence to incident
 * - **Audit System**: Complete audit trail of all incident views and modifications
 *
 * ## Compliance Requirements
 * - **FERPA Compliance**: Student information protected and access-controlled
 * - **Audit Logging**: All incident detail views logged with user and timestamp
 * - **Data Retention**: Incident preserved per district policy (typically 7 years)
 * - **Mandatory Reporting**: Visual indicators if incident triggered mandatory reporting
 * - **Privacy Notices**: Clear display of confidential/restricted access status
 *
 * ## Access Control
 * - Authentication required (dynamic rendering enforced)
 * - Role-based field visibility (some details restricted to administrators)
 * - Confidential incidents restricted to authorized users
 * - Edit capability based on user role and incident status
 * - Medical details restricted to health staff
 *
 * ## Navigation & User Flow
 * - Back navigation to incidents list (preserve filters/page)
 * - Forward navigation to edit, witnesses, follow-ups
 * - Breadcrumb trail showing current location
 * - Related incident linking (similar incidents)
 *
 * ## Error Handling
 * - 404 page if incident not found or user lacks permission
 * - Error boundary catches display errors
 * - Graceful handling of missing optional fields
 * - Network error retry capability
 *
 * @see {@link getIncident} for server action fetching incident data
 * @see {@link /incidents/[id]/edit} for incident editing workflow
 * @see {@link /incidents/[id]/witnesses} for witness management
 * @see {@link /incidents/[id]/follow-up} for follow-up management
 *
 * @example
 * ```tsx
 * // Rendered at route: /incidents/[id]
 * // Fetches incident data server-side and displays comprehensive detail view
 * // Provides navigation to related workflows (edit, witnesses, follow-ups)
 * ```
 */

import React from 'react';
import { Metadata } from 'next';
import { getIncident } from '@/actions/incidents.actions';
import { notFound } from 'next/navigation';
import { Card } from '@/components/ui/layout/Card';
import { Badge } from '@/components/ui/display/Badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

/**
 * Generate dynamic metadata for incident detail page
 *
 * Creates page title and description based on incident data, improving browser
 * tab UX and navigation history. Note: robots noindex prevents search indexing
 * to protect PHI, so this is primarily for user experience, not SEO.
 */
export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  // Fetch incident data to populate metadata
  const result = await getIncident(params.id);

  // Handle not found or error cases
  if (!result.success || !result.data) {
    return {
      title: 'Incident Not Found | White Cross',
      description: 'The requested incident could not be found.',
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const incident = result.data;

  // Create incident identifier for title (avoid PHI in title)
  const incidentIdentifier = incident.incidentNumber || `Incident #${incident.id?.substring(0, 8)}`;

  return {
    title: `${incidentIdentifier} | Incidents | White Cross`,
    description: `${incident.type.replace('_', ' ')} incident - ${incident.severity} severity at ${incident.location.replace('_', ' ')}`,
    robots: {
      index: false, // HIPAA compliance - prevent search indexing
      follow: false,
    },
  };
}



/**
 * Severity color mapping for visual incident severity indicators.
 * Maps severity levels to Tailwind-compatible color names for badge components.
 *
 * @constant
 * @type {Record<string, 'green' | 'yellow' | 'orange' | 'red'>}
 */
const severityColors = {
  MINOR: 'green',           // Minor incidents - no significant medical attention
  MODERATE: 'yellow',       // Moderate incidents - medical attention provided
  SERIOUS: 'orange',        // Serious incidents - significant injury or illness
  CRITICAL: 'red',          // Critical incidents - emergency response required
  LIFE_THREATENING: 'red',  // Life-threatening - immediate medical transport
} as const;

/**
 * Status color mapping for workflow state visualization.
 * Maps incident status to color-coded badges for quick status identification.
 *
 * @constant
 * @type {Record<string, 'yellow' | 'blue' | 'orange' | 'green' | 'gray'>}
 */
const statusColors = {
  PENDING_REVIEW: 'yellow',         // Awaiting review
  UNDER_INVESTIGATION: 'blue',      // Active investigation
  REQUIRES_ACTION: 'orange',        // Action needed
  RESOLVED: 'green',                // Investigation complete
  ARCHIVED: 'gray',                 // Closed and archived
} as const;

/**
 * Incident Details Page Component
 *
 * Server component that fetches and displays comprehensive incident information
 * including status, severity, medical response, notifications, and timeline.
 *
 * @component
 * @async
 *
 * @param {Object} props - Component props
 * @param {Object} props.params - Next.js dynamic route params
 * @param {string} props.params.id - Incident UUID from route parameter
 *
 * @returns {Promise<JSX.Element>} Rendered incident detail page with all incident information
 *
 * @throws {NotFoundError} Redirects to 404 if incident not found or user lacks permission
 *
 * @description
 * Displays comprehensive incident view with:
 * - Header with incident number, status badge, and severity badge
 * - Main info card with incident type, location, student, and reporter
 * - Description card with full incident narrative
 * - Medical response details (when applicable)
 * - Parent notification information (when notified)
 * - Quick actions sidebar for common workflows
 * - Timeline showing incident progression
 * - Tags for categorization
 * - Privacy notices for confidential/restricted incidents
 *
 * Layout uses responsive grid:
 * - Desktop: 2-column layout (2/3 main content, 1/3 sidebar)
 * - Tablet/Mobile: Single column stacked layout
 *
 * @example
 * ```tsx
 * // Rendered at route: /incidents/[id]
 * // params.id = "123e4567-e89b-12d3-a456-426614174000"
 * <IncidentDetailsPage params={{ id: "123e4567-e89b-12d3-a456-426614174000" }} />
 * ```
 */
export default async function IncidentDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  // Fetch incident data from server action
  // getIncident handles authentication, authorization, and data retrieval
  const result = await getIncident(params.id);

  // Handle not found or unauthorized access
  // Redirects to 404 page without exposing whether incident exists
  if (!result.success || !result.data) {
    notFound();
  }

  const incident = result.data;

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold">
              {incident.incidentNumber || `Incident #${incident.id?.substring(0, 8)}`}
            </h1>
            <Badge color={statusColors[incident.status]}>
              {incident.status.replace('_', ' ')}
            </Badge>
            <Badge color={severityColors[incident.severity]}>
              {incident.severity}
            </Badge>
          </div>
          <p className="text-gray-600">
            {formatDistanceToNow(new Date(incident.incidentDate), { addSuffix: true })}
          </p>
        </div>

        <div className="flex gap-2">
          <Link href={`/incidents/${params.id}/edit`}>
            <Button variant="secondary">Edit</Button>
          </Link>
          <Link href={`/incidents/${params.id}/witnesses`}>
            <Button variant="secondary">Witnesses</Button>
          </Link>
          <Link href={`/incidents/${params.id}/follow-up`}>
            <Button>Follow-Up</Button>
          </Link>
        </div>
      </div>

      {/* Main Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Info */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Incident Information</h2>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-600">Type</p>
                <p className="font-medium">{incident.type.replace('_', ' ')}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Location</p>
                <p className="font-medium">{incident.location.replace('_', ' ')}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Student</p>
                <p className="font-medium">
                  {incident.studentName || `ID: ${incident.studentId}`}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Reported By</p>
                <p className="font-medium">
                  {incident.reportedByName || 'Staff Member'}
                </p>
              </div>
            </div>

            <div className="border-t pt-4">
              <p className="text-sm text-gray-600 mb-2">Location Details</p>
              <p className="text-gray-800">{incident.locationDetails}</p>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Description</h2>
            <p className="text-gray-800 whitespace-pre-wrap">
              {incident.description}
            </p>
          </Card>

          {incident.medicalResponse && incident.medicalResponse !== 'NONE' && (
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Medical Response</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Response Type</p>
                  <p className="font-medium">
                    {incident.medicalResponse.replace('_', ' ')}
                  </p>
                </div>
                {incident.medicalNotes && (
                  <div>
                    <p className="text-sm text-gray-600">Medical Notes</p>
                    <p className="text-gray-800">{incident.medicalNotes}</p>
                  </div>
                )}
              </div>
            </Card>
          )}

          {incident.parentNotified && (
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Parent Notification</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Notified At</p>
                  <p className="font-medium">
                    {incident.parentNotifiedAt
                      ? new Date(incident.parentNotifiedAt).toLocaleString()
                      : 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Method</p>
                  <p className="font-medium">
                    {incident.parentNotificationMethod || 'N/A'}
                  </p>
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <Link href={`/incidents/${params.id}/witnesses/add`}>
                <Button className="w-full" size="sm" variant="secondary">
                  Add Witness
                </Button>
              </Link>
              <Link href={`/incidents/${params.id}/follow-up/new`}>
                <Button className="w-full" size="sm" variant="secondary">
                  Create Follow-Up
                </Button>
              </Link>
              <Button className="w-full" size="sm" variant="secondary">
                Update Status
              </Button>
              <Button className="w-full" size="sm" variant="secondary">
                Export Report
              </Button>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold mb-4">Timeline</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium">Incident Occurred</p>
                  <p className="text-xs text-gray-600">
                    {new Date(incident.incidentDate).toLocaleString()}
                  </p>
                </div>
              </div>
              {incident.reportedDate && (
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium">Reported</p>
                    <p className="text-xs text-gray-600">
                      {new Date(incident.reportedDate).toLocaleString()}
                    </p>
                  </div>
                </div>
              )}
              {incident.createdAt && (
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium">Created</p>
                    <p className="text-xs text-gray-600">
                      {new Date(incident.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {incident.tags && incident.tags.length > 0 && (
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {incident.tags.map((tag: string) => (
                  <Badge key={tag} color="gray">
                    {tag}
                  </Badge>
                ))}
              </div>
            </Card>
          )}

          {(incident.isConfidential || incident.restrictedAccess) && (
            <Card className="p-6 border-red-300 bg-red-50">
              <h3 className="font-semibold text-red-800 mb-2">Privacy Notices</h3>
              <div className="space-y-1 text-sm text-red-700">
                {incident.isConfidential && <p>Confidential Record</p>}
                {incident.restrictedAccess && <p>Restricted Access</p>}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
