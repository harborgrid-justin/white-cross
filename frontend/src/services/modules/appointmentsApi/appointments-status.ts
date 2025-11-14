/**
 * Appointments API - Status and Workflow Management
 * 
 * Handles appointment status updates, workflow transitions, and lifecycle
 * management including completion, no-shows, and bulk operations.
 * 
 * @module services/modules/appointmentsApi/appointments-status
 */

import type { ApiClient } from '../../core/ApiClient';
import {
  Appointment,
  UpdateAppointmentData,
  AppointmentStatus,
  AppointmentType,
  AppointmentCalendarEvent,
  APPOINTMENT_STATUS_TRANSITIONS
} from './types';
import {
  bulkCancelSchema,
  getValidationErrors
} from './validation';

/**
 * Appointment Status Update Data
 */
interface StatusUpdateData {
  status: AppointmentStatus;
  reason?: string;
  outcomes?: string;
}

/**
 * Bulk Operation Result
 */
interface BulkOperationResult {
  successful: string[];
  failed: Array<{
    id: string;
    error: string;
  }>;
  summary: {
    total: number;
    successful: number;
    failed: number;
  };
}

/**
 * Appointments Status Service Class
 * 
 * Provides status management and workflow operations for appointments
 * including status transitions, bulk operations, and calendar integration.
 */
export class AppointmentsStatusService {
  private readonly endpoint = '/api/appointments';

  constructor(
    private readonly client: ApiClient,
    private readonly getAppointment: (id: string) => Promise<Appointment>
  ) {}

  /**
   * Create standardized API error
   */
  private createError(message: string, code?: string, metadata?: unknown): Error {
    const error = new Error(message);
    (error as Error & { code?: string; metadata?: unknown }).code = code || 'API_ERROR';
    (error as Error & { code?: string; metadata?: unknown }).metadata = metadata;
    return error;
  }

  /**
   * Handle API errors with sanitization
   */
  private handleError(error: unknown, defaultMessage: string): void {
    console.error(defaultMessage, error);
    // Error handling would be expanded based on actual requirements
  }

  /**
   * Log activity for audit purposes
   */
  private logActivity(action: string, metadata: Record<string, unknown>): void {
    console.log(`Activity: ${action}`, metadata);
    // Activity logging would be expanded based on actual requirements
  }

  // ==========================================
  // STATUS MANAGEMENT
  // ==========================================

  /**
   * Update appointment status
   * 
   * @param id - Appointment ID
   * @param statusData - Status update data
   * @returns Promise resolving to updated appointment
   */
  async updateStatus(id: string, statusData: StatusUpdateData): Promise<Appointment> {
    if (!id?.trim()) {
      throw this.createError('Appointment ID is required', 'VALIDATION_ERROR');
    }

    try {
      const currentAppointment = await this.getAppointment(id);
      const { status, reason, outcomes } = statusData;

      // Validate status transition
      const allowedTransitions = APPOINTMENT_STATUS_TRANSITIONS[currentAppointment.status];
      if (!allowedTransitions.includes(status)) {
        throw this.createError(
          `Cannot transition from ${currentAppointment.status} to ${status}`,
          'BUSINESS_RULE_ERROR'
        );
      }

      const updateData: UpdateAppointmentData = {
        ...(outcomes && { outcomes }),
        ...(reason && { notes: `${currentAppointment.notes || ''}\nStatus change reason: ${reason}`.trim() })
      };

      const response = await this.client.put<{data: Appointment}>(`${this.endpoint}/${id}/status`, {
        status,
        ...updateData
      });

      // Log status change for audit
      this.logActivity('appointment_status_changed', {
        appointmentId: id,
        fromStatus: currentAppointment.status,
        toStatus: status,
        reason
      });

      return response.data.data;
    } catch (error) {
      this.handleError(error, 'Failed to update appointment status');
      throw error;
    }
  }

  /**
   * Mark appointment as completed
   * 
   * @param id - Appointment ID
   * @param outcomes - Appointment outcomes/notes
   * @param followUpRequired - Whether follow-up is needed
   * @param followUpDate - Follow-up date if required
   * @returns Promise resolving to updated appointment
   */
  async completeAppointment(
    id: string,
    outcomes?: string,
    followUpRequired = false,
    followUpDate?: string
  ): Promise<Appointment> {
    // First update the appointment data
    const updateData: UpdateAppointmentData = {
      outcomes,
      followUpRequired,
      ...(followUpDate && { followUpDate })
    };

    // Update appointment with outcomes data
    const response = await this.client.put<{data: Appointment}>(`${this.endpoint}/${id}`, updateData);

    // Then update the status
    return this.updateStatus(id, {
      status: AppointmentStatus.COMPLETED,
      outcomes
    });
  }

  /**
   * Mark appointment as no-show
   * 
   * @param id - Appointment ID
   * @param reason - No-show reason
   * @returns Promise resolving to updated appointment
   */
  async markNoShow(id: string, reason?: string): Promise<Appointment> {
    return this.updateStatus(id, {
      status: AppointmentStatus.NO_SHOW,
      reason
    });
  }

  /**
   * Mark appointment as in progress
   * 
   * @param id - Appointment ID
   * @returns Promise resolving to updated appointment
   */
  async startAppointment(id: string): Promise<Appointment> {
    return this.updateStatus(id, {
      status: AppointmentStatus.IN_PROGRESS
    });
  }

  /**
   * Cancel appointment with reason
   * 
   * @param id - Appointment ID
   * @param reason - Cancellation reason
   * @returns Promise resolving to updated appointment
   */
  async cancelAppointment(id: string, reason?: string): Promise<Appointment> {
    return this.updateStatus(id, {
      status: AppointmentStatus.CANCELLED,
      reason
    });
  }

  // ==========================================
  // BULK OPERATIONS
  // ==========================================

  /**
   * Cancel multiple appointments
   * 
   * @param appointmentIds - Array of appointment IDs
   * @param reason - Cancellation reason
   * @returns Promise resolving to bulk operation result
   */
  async bulkCancel(appointmentIds: string[], reason?: string): Promise<BulkOperationResult> {
    // Validate input
    const validationResult = bulkCancelSchema.safeParse({ appointmentIds, reason });
    if (!validationResult.success) {
      const errors = getValidationErrors(validationResult.error);
      throw this.createError('Validation failed', 'VALIDATION_ERROR', { errors });
    }

    try {
      const response = await this.client.post<{data: BulkOperationResult}>(
        `${this.endpoint}/bulk/cancel`,
        validationResult.data
      );

      // Log bulk cancellation
      this.logActivity('appointments_bulk_cancelled', {
        total: response.data.data.summary.total,
        successful: response.data.data.summary.successful,
        failed: response.data.data.summary.failed,
        reason
      });

      return response.data.data;
    } catch (error) {
      this.handleError(error, 'Failed to cancel appointments');
      throw error;
    }
  }

  /**
   * Reschedule multiple appointments
   * 
   * @param rescheduleData - Array of reschedule operations
   * @returns Promise resolving to bulk operation result
   */
  async bulkReschedule(rescheduleData: Array<{
    appointmentId: string;
    newDateTime: string;
    reason?: string;
  }>): Promise<BulkOperationResult> {
    if (!rescheduleData?.length) {
      throw this.createError('Reschedule data is required', 'VALIDATION_ERROR');
    }

    try {
      const response = await this.client.post<{data: BulkOperationResult}>(
        `${this.endpoint}/bulk/reschedule`,
        { operations: rescheduleData }
      );

      // Log bulk reschedule
      this.logActivity('appointments_bulk_rescheduled', {
        total: response.data.data.summary.total,
        successful: response.data.data.summary.successful,
        failed: response.data.data.summary.failed
      });

      return response.data.data;
    } catch (error) {
      this.handleError(error, 'Failed to reschedule appointments');
      throw error;
    }
  }

  /**
   * Bulk status update for multiple appointments
   * 
   * @param appointmentIds - Array of appointment IDs
   * @param status - New status to apply
   * @param reason - Reason for status change
   * @returns Promise resolving to bulk operation result
   */
  async bulkUpdateStatus(
    appointmentIds: string[], 
    status: AppointmentStatus, 
    reason?: string
  ): Promise<BulkOperationResult> {
    if (!appointmentIds?.length) {
      throw this.createError('Appointment IDs are required', 'VALIDATION_ERROR');
    }

    try {
      const response = await this.client.post<{data: BulkOperationResult}>(
        `${this.endpoint}/bulk/status`,
        { 
          appointmentIds,
          status,
          reason
        }
      );

      // Log bulk status update
      this.logActivity('appointments_bulk_status_updated', {
        total: response.data.data.summary.total,
        successful: response.data.data.summary.successful,
        failed: response.data.data.summary.failed,
        status,
        reason
      });

      return response.data.data;
    } catch (error) {
      this.handleError(error, 'Failed to update appointment statuses');
      throw error;
    }
  }

  // ==========================================
  // CALENDAR INTEGRATION
  // ==========================================

  /**
   * Get appointments formatted for calendar display
   * 
   * @param filters - Calendar filter parameters
   * @returns Promise resolving to calendar events
   */
  async getCalendarEvents(filters: {
    startDate: string;
    endDate: string;
    nurseIds?: string[];
    types?: AppointmentType[];
  }): Promise<AppointmentCalendarEvent[]> {
    try {
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            value.forEach(v => queryParams.append(key, String(v)));
          } else {
            queryParams.append(key, String(value));
          }
        }
      });
      
      const url = `${this.endpoint}/calendar${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
      const response = await this.client.get<{data: AppointmentCalendarEvent[]}>(url);

      return response.data.data;
    } catch (error) {
      this.handleError(error, 'Failed to fetch calendar events');
      throw error;
    }
  }

  /**
   * Get appointment statistics for a date range
   * 
   * @param startDate - Start date (YYYY-MM-DD)
   * @param endDate - End date (YYYY-MM-DD)
   * @param nurseId - Optional nurse filter
   * @returns Promise resolving to appointment statistics
   */
  async getAppointmentStatistics(startDate: string, endDate: string, nurseId?: string) {
    try {
      const queryParams = new URLSearchParams({
        startDate,
        endDate,
        ...(nurseId && { nurseId })
      });

      const response = await this.client.get<{data: {
        total: number;
        byStatus: Record<AppointmentStatus, number>;
        byType: Record<AppointmentType, number>;
        completionRate: number;
        noShowRate: number;
        averageDuration: number;
        peakHours: Array<{
          hour: number;
          count: number;
        }>;
      }}>(`${this.endpoint}/statistics?${queryParams.toString()}`);

      return response.data.data;
    } catch (error) {
      this.handleError(error, 'Failed to fetch appointment statistics');
      throw error;
    }
  }

  // ==========================================
  // WORKFLOW UTILITIES
  // ==========================================

  /**
   * Check if status transition is valid
   * 
   * @param currentStatus - Current appointment status
   * @param newStatus - Desired new status
   * @returns Whether the transition is valid
   */
  isValidStatusTransition(currentStatus: AppointmentStatus, newStatus: AppointmentStatus): boolean {
    const allowedTransitions = APPOINTMENT_STATUS_TRANSITIONS[currentStatus];
    return allowedTransitions.includes(newStatus);
  }

  /**
   * Get available status transitions for an appointment
   * 
   * @param currentStatus - Current appointment status
   * @returns Array of valid next statuses
   */
  getAvailableStatusTransitions(currentStatus: AppointmentStatus): AppointmentStatus[] {
    return APPOINTMENT_STATUS_TRANSITIONS[currentStatus] || [];
  }

  /**
   * Get appointment workflow summary
   * 
   * @param appointmentId - Appointment ID
   * @returns Promise resolving to workflow summary
   */
  async getWorkflowSummary(appointmentId: string) {
    try {
      const response = await this.client.get<{data: {
        currentStatus: AppointmentStatus;
        availableTransitions: AppointmentStatus[];
        statusHistory: Array<{
          status: AppointmentStatus;
          timestamp: string;
          reason?: string;
          changedBy: string;
        }>;
        canModify: boolean;
        canCancel: boolean;
        canReschedule: boolean;
      }}>(`${this.endpoint}/${appointmentId}/workflow`);

      return response.data.data;
    } catch (error) {
      this.handleError(error, 'Failed to fetch workflow summary');
      throw error;
    }
  }
}

/**
 * Factory function to create AppointmentsStatusService
 */
export function createAppointmentsStatusService(
  client: ApiClient, 
  getAppointment: (id: string) => Promise<Appointment>
): AppointmentsStatusService {
  return new AppointmentsStatusService(client, getAppointment);
}
