/**
 * @fileoverview Edit Incident Report Page - Allows authorized users to modify existing
 * incident reports with comprehensive validation and audit logging.
 *
 * @module app/(dashboard)/incidents/[id]/edit/page
 * @category Incidents - Detail Pages
 *
 * ## Overview
 * Provides incident editing interface for authorized users to update incident details,
 * status, severity, and related information. All modifications are audit-logged for
 * compliance and maintain data integrity throughout the incident lifecycle.
 *
 * ## Edit Capabilities
 * - **Basic Information**: Incident type, date/time, location (restricted once submitted)
 * - **Description**: Full narrative of incident (can add details, corrections)
 * - **Severity Level**: Can escalate or de-escalate with justification
 * - **Status**: Workflow status transitions (permission-based)
 * - **Medical Response**: Add or update medical treatment details
 * - **Notifications**: Record additional parent/guardian notifications
 * - **Privacy Settings**: Toggle confidential/restricted access flags
 * - **Tags**: Add or remove categorization tags
 *
 * ## Authorization & Permissions
 * Edit access varies by role and incident status:
 *
 * ### School Nurse / Reporter
 * - Can edit own incidents in DRAFT or REQUIRES_ACTION status
 * - Can add medical notes and update severity (with justification)
 * - Cannot change incident type or student once submitted
 * - Cannot modify after RESOLVED status
 *
 * ### Administrator
 * - Can edit any incident in any status (except ARCHIVED)
 * - Can modify all fields including sensitive data
 * - Can override status transitions
 * - Can access confidential incidents
 *
 * ### Principal / District Admin
 * - Full edit access including ARCHIVED incidents
 * - Can modify confidential/restricted access settings
 * - Can reassign incident ownership
 * - Can delete incidents (with audit trail retention)
 *
 * ## Edit Restrictions by Status
 * - **DRAFT**: Full edit access (creator only)
 * - **PENDING_REVIEW**: Basic edits allowed, status change requires admin
 * - **UNDER_INVESTIGATION**: Description and notes can be added, core fields locked
 * - **REQUIRES_ACTION**: Full edit access to address action items
 * - **RESOLVED**: Administrative override required for any edits
 * - **ARCHIVED**: District admin only, all edits require justification
 *
 * ## Validation Rules
 * Same validation as creation, plus:
 * - Edit reason required for incidents in RESOLVED or ARCHIVED status
 * - Justification required for severity escalation (MODERATE → SERIOUS, etc.)
 * - Administrator approval required to change incident date by more than 7 days
 * - Cannot remove parent notification once recorded
 * - Cannot reduce severity below SERIOUS if medical transport occurred
 *
 * ## Audit Logging
 * All edits are comprehensively logged:
 * - **Before/After Values**: Field-level change tracking
 * - **User & Timestamp**: Who made the change and when
 * - **Edit Reason**: Required justification for significant changes
 * - **IP Address**: Source of modification for security
 * - **Session Info**: Browser and device information
 *
 * Changes triggering special audit events:
 * - Severity escalation or de-escalation
 * - Status transitions
 * - Privacy setting changes (confidential, restricted)
 * - Student or incident type changes (rare, admin-only)
 *
 * ## Status Change Workflow
 * Editing the incident status follows state machine rules:
 *
 * ```
 * DRAFT → PENDING_REVIEW (submit for review)
 * PENDING_REVIEW → UNDER_INVESTIGATION (approve and investigate)
 * PENDING_REVIEW → REQUIRES_ACTION (request more information)
 * UNDER_INVESTIGATION → RESOLVED (complete investigation)
 * REQUIRES_ACTION → PENDING_REVIEW (information provided)
 * ANY_STATUS → ARCHIVED (close permanently)
 * ```
 *
 * Invalid transitions are blocked with clear error messages.
 *
 * ## Notifications on Edit
 * Certain edits trigger notifications:
 * - **Severity Escalation**: Notifies administrators and parents (SERIOUS+)
 * - **Status to REQUIRES_ACTION**: Notifies incident creator
 * - **Status to RESOLVED**: Notifies administrators and creator
 * - **Medical Details Added**: Notifies school nurse
 * - **Confidential Flag Added**: Restricts access and notifies data privacy officer
 *
 * ## Integration Points
 * - **Student Records**: Updates linked to student health/behavioral history
 * - **Notification System**: Triggers notifications for significant changes
 * - **Audit System**: Comprehensive logging of all modifications
 * - **Document Management**: Maintains links to uploaded evidence/documents
 * - **Witness Records**: Preserves witness associations across edits
 * - **Follow-Up System**: Maintains follow-up action links
 *
 * ## Compliance Requirements
 * - **FERPA Compliance**: Student privacy maintained, edits not exposed in logs
 * - **Audit Trail**: All modifications permanently logged (cannot be deleted)
 * - **Data Integrity**: Original incident data preserved in version history
 * - **Edit Authorization**: Role-based access strictly enforced
 * - **Justification Required**: Significant changes require documented reason
 *
 * ## Form Behavior
 * - **Pre-populated Fields**: All current incident data loaded
 * - **Conditional Fields**: Type-specific fields shown based on incident type
 * - **Validation**: Real-time validation with error messages
 * - **Draft Saving**: Auto-save edits every 30 seconds (DRAFT/REQUIRES_ACTION only)
 * - **Confirmation**: Prompts for confirmation on significant changes
 * - **Cancel Protection**: Warns if unsaved changes exist on navigation
 *
 * ## Error Handling
 * - 404 if incident not found or user lacks view permission
 * - 403 if user lacks edit permission for this incident
 * - Validation errors displayed inline with field context
 * - Network errors allow retry without data loss
 * - Concurrent edit detection with merge conflict resolution
 *
 * ## User Experience
 * - Clear indication of required vs. optional fields
 * - Field-level help text for complex requirements
 * - Change summary before submission
 * - Success confirmation with link to view updated incident
 * - Option to continue editing or return to incident detail
 *
 * @see {@link IncidentReportForm} for the comprehensive form component
 * @see {@link getIncident} for server action fetching current incident data
 * @see {@link updateIncident} for server action handling incident updates
 * @see {@link /incidents/[id]} for return to detail view after edit
 *
 * @example
 * ```tsx
 * // Rendered at route: /incidents/[id]/edit
 * // Fetches current incident data and displays pre-populated form
 * // On save, updates incident and redirects to detail page
 * ```
 */

import React from 'react';
import { Metadata } from 'next';
import { getIncident } from '@/actions/incidents.actions';
import { IncidentReportForm } from '@/components/incidents/IncidentReportForm';
import { notFound } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Edit Incident Report | White Cross',
  description: 'Edit incident report',
};

// Force dynamic rendering due to auth requirements and CSRF protection
export const dynamic = 'force-dynamic';

/**
 * Edit Incident Page Component
 *
 * Server component that fetches existing incident data and renders pre-populated
 * edit form with comprehensive validation, authorization checks, and audit logging.
 *
 * @component
 * @async
 *
 * @param {Object} props - Component props
 * @param {Object} props.params - Next.js dynamic route params
 * @param {string} props.params.id - Incident UUID from route parameter
 *
 * @returns {Promise<JSX.Element>} Rendered incident edit form with pre-populated data
 *
 * @throws {NotFoundError} Redirects to 404 if incident not found or user lacks view permission
 * @throws {ForbiddenError} Handled by form - displays read-only view if user lacks edit permission
 *
 * @description
 * Displays incident edit form with:
 * - Pre-populated fields from existing incident data
 * - Permission-based field editability (some fields locked based on status)
 * - Real-time validation with contextual error messages
 * - Change tracking for audit logging
 * - Confirmation prompts for significant changes (severity, status)
 *
 * The IncidentReportForm component handles:
 * - Field-level authorization (some fields admin-only)
 * - Status-based edit restrictions
 * - Validation rules and error display
 * - Auto-save for DRAFT and REQUIRES_ACTION status
 * - Change summary before submission
 * - Redirect to detail page on successful update
 *
 * Form operates in "edit mode" when incident prop is provided, enabling:
 * - Pre-population of all fields
 * - Display of original values for comparison
 * - Field locking based on status and permissions
 * - Edit justification fields for significant changes
 *
 * @example
 * ```tsx
 * // Rendered at route: /incidents/[id]/edit
 * // Fetches incident "123..." and displays edit form
 * <EditIncidentPage params={{ id: "123e4567-e89b-12d3-a456-426614174000" }} />
 * ```
 */
export default async function EditIncidentPage({
  params,
}: {
  params: { id: string };
}) {
  // Fetch current incident data for form pre-population
  // getIncident handles authentication and basic authorization
  const result = await getIncident(params.id);

  // Handle not found or unauthorized view access
  // Edit permission is checked within the form component
  if (!result.success || !result.data) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Edit Incident Report</h1>
      {/* IncidentReportForm in edit mode - handles edit authorization, validation, and submission */}
      <IncidentReportForm incident={result.data as any} />
    </div>
  );
}
