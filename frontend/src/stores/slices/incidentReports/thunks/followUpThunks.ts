/**
 * Incident Reports Store - Follow-up Action Thunks
 *
 * Redux async thunks for follow-up action operations
 *
 * @module stores/slices/incidentReports/thunks/followUpThunks
 */

import { createAsyncThunk } from '@reduxjs/toolkit';
import * as followUpActions from '@/lib/actions/incidents.followup';
import type { CreateFollowUpActionRequest } from '@/types/domain/incidents';
import type { FollowUpAction } from '@/lib/actions/incidents.types';
import toast from 'react-hot-toast';
import debug from 'debug';

const log = debug('whitecross:incident-reports-thunks:followup');

/**
 * Fetch follow-up actions for incident.
 *
 * Retrieves all follow-up actions associated with the specified incident report.
 * Includes action descriptions, assignments, priorities, due dates, and completion status.
 *
 * @async
 * @function fetchFollowUpActions
 *
 * @param {string} incidentReportId - Incident report unique identifier
 *
 * @returns {Promise<FollowUpAction[]>} Array of follow-up actions
 *
 * @throws {Error} When incident not found or user lacks permissions
 *
 * @remarks
 * Follow-up actions support assignment tracking and automated escalation
 * for overdue items. Completion status is tracked with notes and outcomes.
 *
 * @example
 * ```typescript
 * // Load follow-up actions for incident detail view
 * dispatch(fetchFollowUpActions('incident-123'));
 * ```
 */
export const fetchFollowUpActions = createAsyncThunk(
  'incidentReports/fetchFollowUpActions',
  async (incidentReportId: string, { rejectWithValue }) => {
    try {
      log('Fetching follow-up actions for incident:', incidentReportId);
      const actions = await followUpActions.getFollowUpActions(incidentReportId);
      return actions;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch follow-up actions';
      log('Error fetching follow-up actions:', error);
      return rejectWithValue(errorMessage);
    }
  }
);

/**
 * Create follow-up action.
 *
 * Creates trackable action item with assignment, priority, and due date.
 * Actions can be assigned to staff members with automatic notification.
 *
 * @async
 * @function createFollowUpAction
 *
 * @param {CreateFollowUpActionRequest} data - Follow-up action data
 * @param {string} data.incidentReportId - Related incident ID
 * @param {string} data.description - Action description
 * @param {string} [data.assignedTo] - User ID of assigned staff member
 * @param {('LOW'|'MEDIUM'|'HIGH'|'URGENT')} data.priority - Action priority
 * @param {string} [data.dueDate] - Due date (ISO 8601)
 *
 * @returns {Promise<FollowUpAction>} Created follow-up action
 *
 * @throws {Error} When validation fails or API request fails
 *
 * @remarks
 * ## Assignment Notification
 *
 * When an action is assigned to a staff member, they receive:
 * - Email notification with action details
 * - In-app notification
 * - Calendar event (if due date specified)
 *
 * ## Escalation Rules
 *
 * Overdue actions trigger automatic escalation:
 * - 1 day overdue: Reminder to assignee
 * - 3 days overdue: Notification to supervisor
 * - 7 days overdue: Notification to administrator
 *
 * @example
 * ```typescript
 * // Create urgent follow-up action with assignment
 * dispatch(createFollowUpAction({
 *   incidentReportId: 'incident-123',
 *   description: 'Schedule parent meeting to discuss incident',
 *   assignedTo: 'user-789',
 *   priority: 'URGENT',
 *   dueDate: '2025-01-20T17:00:00Z'
 * }));
 * ```
 */
export const createFollowUpAction = createAsyncThunk(
  'incidentReports/createFollowUpAction',
  async (data: CreateFollowUpActionRequest, { rejectWithValue }) => {
    try {
      log('Creating follow-up action:', data);
      const result = await followUpActions.addFollowUpAction(
        data.incidentReportId,
        data as Partial<FollowUpAction>
      );
      if (!result.success) {
        toast.error(result.error || 'Failed to create follow-up action');
        return rejectWithValue(result.error || 'Failed to create follow-up action');
      }
      toast.success('Follow-up action created successfully');
      // Fetch the created action if we have an ID
      if (result.id) {
        const actions = await followUpActions.getFollowUpActions(data.incidentReportId);
        const createdAction = actions.find(a => a.id === result.id);
        if (createdAction) {
          return createdAction;
        }
      }
      return rejectWithValue('Failed to retrieve created follow-up action');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create follow-up action';
      log('Error creating follow-up action:', error);
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);
