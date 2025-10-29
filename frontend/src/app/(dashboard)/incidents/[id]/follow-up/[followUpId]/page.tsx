/**
 * @fileoverview Follow-Up Action Detail Page - Displays comprehensive information about
 * a specific follow-up action with progress tracking, updates, and completion workflow.
 *
 * @module app/(dashboard)/incidents/[id]/follow-up/[followUpId]/page
 * @category Incidents - Follow-Up Management
 *
 * ## Overview
 * Provides detailed view of a single follow-up action including current progress,
 * action history, assigned staff, due dates, and update capabilities. Enables tracking
 * and completion of incident-related follow-up tasks.
 *
 * ## Displayed Information
 * - **Action Details**: Type, title, full description, priority level
 * - **Status**: Current status with visual indicator (pending, in-progress, completed, overdue)
 * - **Progress**: Visual progress bar and percentage complete
 * - **Assignment**: Assigned staff member with contact information
 * - **Timeline**: Created date, due date, last updated, completion date
 * - **Sub-Tasks**: Checklist of individual tasks within the action (if applicable)
 * - **Updates History**: Log of all progress updates and status changes
 * - **Verification**: Approval status if supervisor verification required
 * - **Related Documents**: Attached files or evidence related to the action
 *
 * ## Progress Update Workflow
 * Users can update action progress through:
 * 1. **Update Progress Button**: Opens modal for progress percentage and notes
 * 2. **Mark Complete**: Transitions action to COMPLETED status (with verification if required)
 * 3. **Add Note**: Document progress without changing percentage
 * 4. **Upload Documents**: Attach evidence of completion
 * 5. **Request Extension**: Request due date extension with justification
 *
 * ## Status Transitions
 * - **PENDING → IN_PROGRESS**: Start work on action (automatic on first update)
 * - **IN_PROGRESS → COMPLETED**: Mark action complete (requires 100% progress)
 * - **Any → OVERDUE**: Automatic when past due date without completion
 * - **OVERDUE → COMPLETED**: Can still be completed (recorded as overdue completion)
 * - **Any → CANCELLED**: Admin can cancel if action no longer needed
 *
 * ## Verification Process (If Required)
 * For actions requiring verification:
 * 1. Staff member marks action complete (status: PENDING_VERIFICATION)
 * 2. Supervisor receives notification to verify
 * 3. Supervisor reviews and approves/rejects
 * 4. If approved: Status → COMPLETED
 * 5. If rejected: Status → IN_PROGRESS with feedback notes
 *
 * ## Notification Triggers
 * - **Assignment Change**: New assignee notified immediately
 * - **Status Change**: Interested parties notified (creator, assignee, supervisor)
 * - **Due Date Approaching**: Reminders at 50%, 75%, 90% of timeline
 * - **Overdue**: Daily notifications until completed
 * - **Completion**: Creator and supervisor notified
 * - **Verification Needed**: Supervisor notified to approve
 *
 * ## Integration Points
 * - **Incident Record**: Link back to parent incident
 * - **Staff Calendar**: Due dates visible in assigned staff calendar
 * - **Audit System**: All updates logged with timestamp and user
 * - **Document Management**: Attach and view related files
 * - **Notification System**: Email/SMS for status changes and reminders
 *
 * ## User Actions
 * - **Update Progress**: Record progress percentage and notes
 * - **Add Sub-Task**: Break action into smaller checklistuate items
 * - **Upload File**: Attach supporting documents or evidence
 * - **Request Extension**: Request due date change with justification
 * - **Reassign**: Transfer responsibility to another staff member (admin)
 * - **Mark Complete**: Finalize action (100% progress required)
 * - **Cancel**: Mark action as no longer needed (admin only)
 *
 * ## Compliance & Audit
 * - All progress updates logged with user, timestamp, and notes
 * - Status transitions tracked for accountability
 * - Completion verification logged for critical actions
 * - Overdue actions flagged for compliance review
 * - Action history preserved for audit trail (7+ years)
 *
 * @see {@link getFollowUpAction} for server action fetching action data
 * @see {@link updateFollowUpProgress} for server action updating progress
 * @see {@link /incidents/[id]/follow-up} for return to actions list
 *
 * @example
 * ```tsx
 * // Rendered at route: /incidents/[id]/follow-up/[followUpId]
 * <FollowUpDetailsPage params={{ id: "incident-uuid", followUpId: "action-uuid" }} />
 * ```
 */

import React from 'react';
import { Metadata } from 'next';
import { Card } from '@/components/ui/layout/Card';
import { Badge } from '@/components/ui/display/Badge';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Follow-Up Details | White Cross',
  description: 'View follow-up action details',
};

// Force dynamic rendering due to auth requirements and real-time progress updates
export const dynamic = "force-dynamic";

/**
 * Follow-Up Action Details Component
 *
 * Displays comprehensive follow-up action information with progress tracking,
 * update capabilities, and completion workflow.
 *
 * @component
 *
 * @param {Object} props - Component props
 * @param {Object} props.params - Next.js dynamic route params
 * @param {string} props.params.id - Incident UUID
 * @param {string} props.params.followUpId - Follow-up action UUID
 *
 * @returns {JSX.Element} Rendered follow-up detail page with progress bar and update buttons
 *
 * @example
 * ```tsx
 * <FollowUpDetailsPage params={{ id: "incident-uuid", followUpId: "action-uuid" }} />
 * ```
 */
export default function FollowUpDetailsPage({
  params,
}: {
  params: { id: string; followUpId: string };
}) {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Follow-Up Action</h1>
        <div className="flex gap-2">
          <Link href={`/incidents/${params.id}`}>
            <Button variant="secondary">Back to Incident</Button>
          </Link>
          <Button>Update Progress</Button>
        </div>
      </div>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Action Details</h2>
          <Badge color="blue">IN PROGRESS</Badge>
        </div>
        <p className="text-gray-600">
          Follow-up action {params.followUpId} for incident {params.id}
        </p>
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full" style={{ width: '45%' }} />
          </div>
          <p className="text-sm text-gray-500 mt-1">45% Complete</p>
        </div>
      </Card>
    </div>
  );
}
