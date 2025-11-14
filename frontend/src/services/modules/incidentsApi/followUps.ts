/**
 * Incidents API - Follow-up Actions and Notifications
 * 
 * Follow-up action management and parent notification system
 * 
 * @module services/modules/incidentsApi/followUps
 */

import type { ApiClient } from '../../core/ApiClient';
import { handleApiError } from '../../utils/apiUtils';
import type {
  MarkParentNotifiedRequest,
  AddFollowUpNotesRequest,
  NotifyParentRequest,
  CreateFollowUpActionRequest,
  UpdateFollowUpActionRequest,
  FollowUpActionResponse,
  FollowUpActionListResponse,
  IncidentReportResponse
} from './types';

/**
 * Follow-up actions and notification operations
 */
export class FollowUps {
  constructor(private readonly client: ApiClient) {}

  // =====================
  // PARENT NOTIFICATION
  // =====================

  /**
   * Mark parent as notified manually
   *
   * Updates notification status and records method/person
   * Used when notification was done outside the system (phone call, in-person)
   *
   * @param id - Incident report ID
   * @param data - Notification method and person who notified
   * @returns Updated incident report
   *
   * Backend: PUT /incidents/{id}/notify
   */
  async markParentNotified(id: string, data: MarkParentNotifiedRequest): Promise<IncidentReportResponse> {
    try {
      const response = await this.client.put(`/incidents/${id}/notify`, data);
      return response.data as IncidentReportResponse;
    } catch (error) {
      throw handleApiError(error as Error);
    }
  }

  /**
   * Send automated parent notification
   *
   * Triggers notification via specified method (email, SMS, voice)
   * Automatically records notification timestamp and method
   *
   * @param id - Incident report ID
   * @param data - Notification method
   * @returns Updated incident report with notification status
   *
   * @example
   * ```typescript
   * await followUps.notifyParent(id, {
   *   method: ParentNotificationMethod.EMAIL
   * });
   * ```
   *
   * Backend: POST /incidents/{id}/notify
   */
  async notifyParent(id: string, data: NotifyParentRequest): Promise<IncidentReportResponse> {
    try {
      const response = await this.client.post(`/incidents/${id}/notify`, data);
      return response.data as IncidentReportResponse;
    } catch (error) {
      throw handleApiError(error as Error);
    }
  }

  // =====================
  // FOLLOW-UP NOTES AND ACTIONS
  // =====================

  /**
   * Add follow-up notes to incident
   *
   * Marks incident as completed if followUpRequired was true
   * Used for unstructured follow-up information
   *
   * @param id - Incident report ID
   * @param data - Follow-up notes
   * @returns Updated incident report
   *
   * Backend: PUT /incidents/{id}
   */
  async addNotes(id: string, data: AddFollowUpNotesRequest): Promise<IncidentReportResponse> {
    try {
      const response = await this.client.put(`/incidents/${id}`, {
        followUpNotes: data.notes
      });
      return response.data as IncidentReportResponse;
    } catch (error) {
      throw handleApiError(error as Error);
    }
  }

  /**
   * Add structured follow-up action
   *
   * Creates trackable action item with assignment and due date
   * Supports task delegation and priority management
   *
   * @param data - Follow-up action creation data
   * @returns Created follow-up action
   *
   * @example
   * ```typescript
   * const action = await followUps.addAction({
   *   incidentReportId: id,
   *   action: 'Schedule follow-up appointment with nurse',
   *   priority: ActionPriority.HIGH,
   *   dueDate: '2025-02-01',
   *   assignedTo: nurseUserId
   * });
   * ```
   *
   * Backend: POST /incidents/{incidentReportId}/follow-ups
   */
  async addAction(data: CreateFollowUpActionRequest): Promise<FollowUpActionResponse> {
    try {
      const response = await this.client.post(`/incidents/${data.incidentReportId}/follow-ups`, data);
      return response.data as FollowUpActionResponse;
    } catch (error) {
      throw handleApiError(error as Error);
    }
  }

  /**
   * Update follow-up action status
   *
   * Updates status, adds completion tracking, and notes
   * Supports partial updates
   *
   * @param id - Follow-up action ID
   * @param data - Partial update data
   * @returns Updated follow-up action
   *
   * Backend: PUT /incidents/follow-ups/{id}
   */
  async updateAction(id: string, data: UpdateFollowUpActionRequest): Promise<FollowUpActionResponse> {
    try {
      const response = await this.client.put(`/incidents/follow-ups/${id}`, data);
      return response.data as FollowUpActionResponse;
    } catch (error) {
      throw handleApiError(error as Error);
    }
  }

  /**
   * Complete follow-up action
   *
   * Shortcut method to mark action as completed with optional notes
   * Sets status to COMPLETED and records completion timestamp
   *
   * @param id - Follow-up action ID
   * @param notes - Optional completion notes
   * @returns Updated follow-up action
   *
   * Backend: PUT /incidents/follow-ups/{id}
   */
  async completeAction(id: string, notes?: string): Promise<FollowUpActionResponse> {
    try {
      const response = await this.client.put(`/incidents/follow-ups/${id}`, {
        status: 'COMPLETED' as const,
        notes
      });
      return response.data as FollowUpActionResponse;
    } catch (error) {
      throw handleApiError(error as Error);
    }
  }

  /**
   * Get all follow-up actions for an incident
   *
   * @param incidentReportId - Incident report ID
   * @returns List of follow-up actions
   *
   * Backend: GET /incidents/{id}/follow-ups
   */
  async getActions(incidentReportId: string): Promise<FollowUpActionListResponse> {
    try {
      const response = await this.client.get(`/incidents/${incidentReportId}/follow-ups`);
      return response.data as FollowUpActionListResponse;
    } catch (error) {
      throw handleApiError(error as Error);
    }
  }

  /**
   * Delete follow-up action
   *
   * @param id - Follow-up action ID
   * @returns Success indicator
   *
   * Backend: DELETE /incidents/follow-ups/{id}
   */
  async deleteAction(id: string): Promise<{ success: boolean }> {
    try {
      const response = await this.client.delete(`/incidents/follow-ups/${id}`);
      return response.data as { success: boolean };
    } catch (error) {
      throw handleApiError(error as Error);
    }
  }
}
