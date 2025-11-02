/**
 * @fileoverview Follow-Up Actions List Page - Displays all follow-up actions associated
 * with an incident, tracking progress, priority, and completion status.
 *
 * @module app/(dashboard)/incidents/[id]/follow-up/page
 * @category Incidents - Follow-Up Management
 *
 * ## Overview
 * Provides comprehensive view of all follow-up actions for a specific incident,
 * including action items, scheduled appointments, required interventions, and
 * monitoring tasks. Tracks progress, deadlines, and completion status for
 * accountability and compliance.
 *
 * ## Follow-Up Action Types
 * - **CONTACT_PARENT**: Schedule or document parent communication
 * - **MEDICAL_CHECKUP**: Follow-up medical evaluation or monitoring
 * - **BEHAVIORAL_INTERVENTION**: Implement behavioral support plan
 * - **SAFETY_INSPECTION**: Verify hazard remediation or safety measures
 * - **ADMINISTRATIVE_REVIEW**: Administrative follow-up meeting or review
 * - **COUNSELING_SESSION**: Schedule counseling or mental health support
 * - **DOCUMENTATION**: Complete additional documentation or reporting
 * - **TRAINING**: Provide staff training based on incident findings
 *
 * ## Action Status States
 * - **PENDING**: Action created but not yet started
 * - **IN_PROGRESS**: Action currently being worked on
 * - **COMPLETED**: Action finished and verified
 * - **OVERDUE**: Action past due date without completion
 * - **CANCELLED**: Action no longer needed or superseded
 *
 * Status transitions follow workflow:
 * ```
 * PENDING → IN_PROGRESS → COMPLETED
 *         ↓
 *      OVERDUE (automatic when past due date)
 *         ↓
 *      CANCELLED (manual override)
 * ```
 *
 * ## Priority Levels
 * - **URGENT**: Requires immediate attention (within 24 hours)
 * - **HIGH**: Important action (within 3 days)
 * - **MEDIUM**: Standard priority (within 1 week)
 * - **LOW**: Non-urgent action (within 2 weeks)
 *
 * Overdue URGENT actions trigger administrator notifications.
 *
 * ## Progress Tracking
 * Each action displays:
 * - **Progress Bar**: Visual representation of completion percentage
 * - **Percent Complete**: Numeric progress indicator (0-100%)
 * - **Due Date**: Deadline for completion with overdue visual indicators
 * - **Assigned To**: Staff member responsible for action
 * - **Last Updated**: Timestamp of most recent progress update
 *
 * Progress is updated manually by assigned staff or automatically based on
 * completed sub-tasks.
 *
 * ## Follow-Up Escalation
 * Automatic escalation occurs for:
 * - **Overdue URGENT Actions**: Notify administrator and principal immediately
 * - **Overdue HIGH Actions**: Notify administrator after 1 day past due
 * - **Incomplete Actions**: Reminder notifications at 50% of timeline
 * - **Blocked Actions**: Escalation if marked as blocked for >24 hours
 *
 * ## Integration Points
 * - **Incident Records**: All actions linked to parent incident
 * - **Staff Directory**: Assigned staff retrieved from directory
 * - **Calendar System**: Due dates sync to staff calendars
 * - **Notification System**: Reminders and escalations via email/SMS
 * - **Audit System**: All progress updates logged for accountability
 * - **Parent Portal**: Some actions visible to parents (with permission)
 *
 * ## Compliance Requirements
 * - **Documentation**: All follow-ups documented for compliance audits
 * - **Timeliness**: Due dates tracked and monitored for regulatory compliance
 * - **Accountability**: Clear assignment and progress tracking
 * - **Verification**: Completion requires verification by supervisor (for critical actions)
 * - **Retention**: Follow-up records retained with incident (7+ years)
 *
 * ## User Experience
 * - **Card Layout**: Each action displayed as clickable card for details
 * - **Status Indicators**: Color-coded badges for quick status identification
 * - **Progress Visualization**: Progress bars show completion at a glance
 * - **Quick Actions**: One-click access to update progress or mark complete
 * - **Empty State**: Helpful prompt to create first action when none exist
 *
 * ## Navigation
 * - **Back to Incident**: Return to incident detail page
 * - **Create Action**: Navigate to follow-up creation form
 * - **Action Details**: Click card to view full action details
 * - **Update Progress**: Quick link from card or via detail page
 *
 * @see {@link listFollowUpActions} for server action fetching follow-up data
 * @see {@link /incidents/[id]/follow-up/new} for creating new follow-up actions
 * @see {@link /incidents/[id]/follow-up/[followUpId]} for individual action details
 * @see {@link /incidents/[id]} for parent incident detail page
 *
 * @example
 * ```tsx
 * // Rendered at route: /incidents/[id]/follow-up
 * // Displays all follow-up actions for incident with ID
 * <FollowUpActionsPage params={{ id: "incident-uuid" }} />
 * ```
 */

import React from 'react';
import { Metadata } from 'next';
import { listFollowUpActions } from '@/lib/actions/incidents.actions';
import { Card } from '@/components/ui/layout/Card';
import { Badge } from '@/components/ui/display/Badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Follow-Up Actions | White Cross',
  description: 'View and manage follow-up actions',
};



/**
 * Follow-Up Actions List Component
 *
 * Server component that fetches and displays all follow-up actions for an incident
 * with status indicators, progress tracking, and navigation to action management.
 *
 * @component
 * @async
 *
 * @param {Object} props - Component props
 * @param {Object} props.params - Next.js dynamic route params
 * @param {string} props.params.id - Incident UUID from route parameter
 *
 * @returns {Promise<JSX.Element>} Rendered follow-up actions list with cards and progress indicators
 *
 * @description
 * Displays grid of action cards, each showing:
 * - Action title and description (truncated to 2 lines)
 * - Status badge (color-coded: green=completed, red=overdue, blue=in-progress)
 * - Action type and priority level
 * - Due date with formatting
 * - Progress bar showing completion percentage
 *
 * Actions are clickable cards that navigate to detail page for full information
 * and progress updates.
 *
 * Empty state provides helpful prompt to create first follow-up action when
 * incident has no actions yet.
 *
 * @example
 * ```tsx
 * // Rendered at route: /incidents/[id]/follow-up
 * <FollowUpActionsPage params={{ id: "123e4567-e89b-12d3-a456-426614174000" }} />
 * ```
 */
export default async function FollowUpActionsPage({
  params,
}: {
  params: { id: string };
}) {
  // Fetch all follow-up actions for this incident
  // listFollowUpActions handles authentication and authorization
  const result = await listFollowUpActions(params.id);
  const actions = result.data || [];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Follow-Up Actions</h1>
        <div className="flex gap-2">
          <Link href={`/incidents/${params.id}`}>
            <Button variant="secondary">Back to Incident</Button>
          </Link>
          <Link href={`/incidents/${params.id}/follow-up/new`}>
            <Button>Create Action</Button>
          </Link>
        </div>
      </div>

      <div className="space-y-4">
        {actions.map((action: any) => (
          <Link key={action.id} href={`/incidents/${params.id}/follow-up/${action.id}`}>
            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1">{action.title}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {action.description}
                  </p>
                </div>
                <Badge
                  color={
                    action.status === 'COMPLETED'
                      ? 'green'
                      : action.status === 'OVERDUE'
                      ? 'red'
                      : 'blue'
                  }
                >
                  {action.status}
                </Badge>
              </div>

              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span>{action.actionType.replace('_', ' ')}</span>
                <span>Priority: {action.priority}</span>
                <span>Due: {new Date(action.dueDate).toLocaleDateString()}</span>
              </div>

              <div className="mt-3">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${action.percentComplete}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {action.percentComplete}% Complete
                </p>
              </div>
            </Card>
          </Link>
        ))}

        {actions.length === 0 && (
          <Card className="p-8 text-center">
            <p className="text-gray-500">No follow-up actions for this incident.</p>
            <Link href={`/incidents/${params.id}/follow-up/new`}>
              <Button className="mt-4">Create First Action</Button>
            </Link>
          </Card>
        )}
      </div>
    </div>
  );
}
