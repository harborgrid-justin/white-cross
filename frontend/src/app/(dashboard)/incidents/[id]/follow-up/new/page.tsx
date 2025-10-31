/**
 * @fileoverview Create Follow-Up Action Page - Form for creating new follow-up actions
 * for incident investigation, monitoring, and closure workflow.
 *
 * @module app/(dashboard)/incidents/[id]/follow-up/new/page
 * @category Incidents - Follow-Up Management
 *
 * ## Overview
 * Provides comprehensive form for creating follow-up actions linked to an incident.
 * Actions can include scheduled tasks, appointments, interventions, documentation
 * requirements, or monitoring activities necessary for incident resolution.
 *
 * ## Form Fields
 * - **Action Type**: Category of follow-up (contact parent, medical checkup, etc.)
 * - **Title**: Brief description of the action (max 100 characters)
 * - **Description**: Detailed explanation of what needs to be done
 * - **Priority**: URGENT, HIGH, MEDIUM, or LOW
 * - **Assigned To**: Staff member responsible for completion
 * - **Due Date**: Deadline for completion (with time)
 * - **Estimated Duration**: Expected time to complete (in minutes/hours)
 * - **Notify On Due**: Toggle for reminder notifications
 * - **Requires Verification**: Flag if supervisor verification needed on completion
 * - **Related Documents**: Link to supporting documentation
 *
 * ## Validation Rules
 * - Action type and title are required
 * - Due date must be in the future (or today)
 * - Due date should be within reasonable timeframe (configurable, default 90 days)
 * - Assigned staff member must have appropriate permissions for action type
 * - URGENT actions must have due date within 24 hours (warning if longer)
 * - Description minimum 10 characters for documentation
 *
 * ## Auto-Population Features
 * Form pre-fills suggested values based on:
 * - **Incident Type**: Injury incidents auto-suggest medical follow-up
 * - **Severity**: SERIOUS+ incidents auto-select URGENT priority
 * - **Previous Actions**: Similar incidents' follow-ups suggested
 * - **Staff Assignment**: Defaults to appropriate staff based on action type
 * - **Due Dates**: Calculated based on priority level and action type
 *
 * ## Action Type Workflows
 *
 * ### CONTACT_PARENT
 * - Suggests phone call or meeting within 24 hours for SERIOUS+ incidents
 * - Pre-fills parent contact information from incident
 * - Optionally schedules calendar event
 *
 * ### MEDICAL_CHECKUP
 * - Assigns to school nurse by default
 * - Calculates due date based on injury severity (1-7 days)
 * - Links to student health record for medical history
 *
 * ### BEHAVIORAL_INTERVENTION
 * - Assigns to counselor or behavioral specialist
 * - Suggests intervention strategies based on incident type
 * - May create recurring action for ongoing monitoring
 *
 * ### SAFETY_INSPECTION
 * - Assigns to facilities manager
 * - Requires photo documentation of hazard resolution
 * - Links to safety inspection checklist
 *
 * ## Notification Configuration
 * Actions can trigger notifications:
 * - **Assigned Staff**: Immediate email/SMS notification on creation
 * - **Reminders**: Configurable reminders at 50%, 75%, 90% of timeline
 * - **Overdue**: Daily reminders if action becomes overdue
 * - **Escalation**: Notify supervisor if overdue by >2 days (URGENT) or >7 days (others)
 *
 * ## Integration Points
 * - **Incident Records**: Action automatically linked to parent incident
 * - **Staff Calendars**: Due dates can be added to assigned staff calendar
 * - **Task Management**: Syncs with district task management system (optional)
 * - **Notification System**: Email/SMS reminders and escalations
 * - **Audit System**: Action creation logged with user and timestamp
 * - **Parent Portal**: Some actions visible to parents (configurable)
 *
 * ## Compliance Considerations
 * - **Documentation**: All actions documented for audit trail
 * - **Timeliness**: Priority-based due dates ensure regulatory compliance
 * - **Accountability**: Clear staff assignment for responsibility
 * - **Verification**: Critical actions require supervisor sign-off
 * - **Retention**: Follow-up records retained with incident (7+ years)
 *
 * ## User Experience
 * - **Form Validation**: Real-time validation with helpful error messages
 * - **Smart Defaults**: Pre-populated fields based on incident context
 * - **Action Templates**: Quick-select common action types
 * - **Save Draft**: Actions can be saved as draft and completed later
 * - **Duplicate Action**: Copy existing action to create similar follow-up
 * - **Success Redirect**: Returns to follow-up list after successful creation
 *
 * ## Error Handling
 * - Form validation prevents submission of invalid data
 * - Network errors allow retry without losing form data
 * - Staff availability checked before assignment
 * - Concurrent action creation detected and prevented
 *
 * @see {@link FollowUpForm} for comprehensive form component with validation
 * @see {@link createFollowUpAction} for server action handling creation
 * @see {@link /incidents/[id]/follow-up} for return to actions list after creation
 *
 * @example
 * ```tsx
 * // Rendered at route: /incidents/[id]/follow-up/new
 * // User fills form, submits, and redirects to follow-up list
 * <NewFollowUpPage params={{ id: "incident-uuid" }} />
 * ```
 */

'use client';

import React from 'react';
import { FollowUpForm } from '@/components/incidents/FollowUpForm';
import { useRouter } from 'next/navigation';

// Force dynamic rendering due to auth requirements and CSRF protection
export const dynamic = 'force-dynamic';

/**
 * New Follow-Up Action Page Component
 *
 * Client component that renders follow-up action creation form with validation,
 * smart defaults, and success handling.
 *
 * @component
 * @client
 *
 * @param {Object} props - Component props
 * @param {Object} props.params - Next.js dynamic route params
 * @param {string} props.params.id - Incident UUID for which follow-up is being created
 *
 * @returns {JSX.Element} Rendered follow-up creation form with success handler
 *
 * @description
 * Displays comprehensive form for follow-up action creation with:
 * - Action type selection (medical, behavioral, safety, etc.)
 * - Priority and due date configuration
 * - Staff assignment with availability checking
 * - Real-time validation and error messaging
 * - Success redirect back to follow-up list
 *
 * Form handles submission via server action and redirects on success.
 * On successful creation, user is navigated back to the follow-up actions
 * list where the new action will be visible.
 *
 * @example
 * ```tsx
 * // Rendered at route: /incidents/[id]/follow-up/new
 * <NewFollowUpPage params={{ id: "123e4567-e89b-12d3-a456-426614174000" }} />
 * ```
 */
export default function NewFollowUpPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();

  /**
   * Success handler for follow-up creation
   * Redirects user back to follow-up actions list after successful creation
   */
  const handleSuccess = () => {
    router.push(`/incidents/${params.id}/follow-up`);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Create Follow-Up Action</h1>
      {/* FollowUpForm handles validation, submission, and error display */}
      <FollowUpForm incidentId={params.id} onSuccess={handleSuccess} />
    </div>
  );
}
