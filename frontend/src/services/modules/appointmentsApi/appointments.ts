/**
 * Appointments API - Core Appointment Operations
 * 
 * Handles CRUD operations for appointments, including scheduling, updating,
 * cancellation, and appointment lifecycle management with healthcare-specific
 * business logic and validation.
 * 
 * @module services/modules/appointmentsApi/appointments
 */

import type { ApiClient } from '../../core/ApiClient';
import {
  Appointment,
  AppointmentWithRelations,
  CreateAppointmentData,
  UpdateAppointmentData,
  AppointmentFilters,
  AppointmentStatus,
  AppointmentPriority,
  AppointmentType,
  ConflictCheckResult,
  RecurringAppointmentData,
  AppointmentCalendarEvent,
  APPOINTMENT_VALIDATION,
  APPOINTMENT_STATUS_TRANSITIONS
} from './types';
import {
  createAppointmentSchema,
  updateAppointmentSchema,
  appointmentFiltersSchema,
  recurringAppointmentSchema,
  conflictCheckSchema,
  bulkCancelSchema,
  validateAppointmentBusinessRules,
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
 * Appointments Service Class
 * 
 * Provides comprehensive appointment management capabilities including
 * scheduling, updates, cancellations, and advanced operations like
 * recurring appointments and conflict resolution.
 */
export class AppointmentsService {
  private readonly endpoint = '/api/appointments';

  constructor(private readonly client: ApiClient) {}

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
  // CORE CRUD OPERATIONS
  // ==========================================

  /**
   * Create a new appointment
   * 
   * @param data - Appointment creation data
   * @returns Promise resolving to the created appointment
   * @throws ValidationError if data is invalid
   * @throws ConflictError if appointment conflicts exist
   */
  async createAppointment(data: CreateAppointmentData): Promise<Appointment> {
    // Validate input data
    const validationResult = createAppointmentSchema.safeParse(data);
    if (!validationResult.success) {
      const errors = getValidationErrors(validationResult.error);
      throw this.createError('Validation failed', 'VALIDATION_ERROR', { errors });
    }

    const validatedData = validationResult.data;

    // Validate business rules
    const businessRules = validateAppointmentBusinessRules({
      scheduledAt: validatedData.scheduledAt,
      duration: validatedData.duration || APPOINTMENT_VALIDATION.DEFAULT_DURATION,
      type: validatedData.type,
      priority: validatedData.priority || AppointmentPriority.NORMAL
    });

    if (!businessRules.valid) {
      throw this.createError('Business rule validation failed', 'BUSINESS_RULE_ERROR', {
        errors: businessRules.errors
      });
    }

    // Check for conflicts
    const conflicts = await this.checkConflicts({
      nurseId: validatedData.nurseId,
      startTime: validatedData.scheduledAt,
      duration: validatedData.duration || APPOINTMENT_VALIDATION.DEFAULT_DURATION
    });

    if (conflicts.hasConflicts) {
      throw this.createError('Appointment conflicts detected', 'CONFLICT_ERROR', {
        conflicts: conflicts.conflicts,
        suggestions: conflicts.suggestions
      });
    }

    try {
      const response = await this.client.post<{data: Appointment}>(this.endpoint, validatedData);
      const appointment = response.data.data;
      
      // Log appointment creation for audit
      this.logActivity('appointment_created', {
        appointmentId: appointment.id,
        studentId: validatedData.studentId,
        nurseId: validatedData.nurseId,
        type: validatedData.type,
        scheduledAt: validatedData.scheduledAt
      });

      return appointment;
    } catch (error) {
      this.handleError(error, 'Failed to create appointment');
      throw error;
    }
  }

  /**
   * Get appointment by ID with optional relation population
   * 
   * @param id - Appointment ID
   * @param includeRelations - Whether to include student/nurse details
   * @returns Promise resolving to the appointment
   */
  async getAppointment(id: string, includeRelations = false): Promise<AppointmentWithRelations> {
    if (!id?.trim()) {
      throw this.createError('Appointment ID is required', 'VALIDATION_ERROR');
    }

    try {
      const params = includeRelations ? { include: 'student,nurse,reminders' } : {};
      const queryParams = new URLSearchParams(params as Record<string, string>);
      const url = `${this.endpoint}/${id}${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
      const response = await this.client.get<{data: AppointmentWithRelations}>(url);
      
      return response.data.data;
    } catch (error) {
      this.handleError(error, 'Failed to fetch appointment');
      throw error;
    }
  }

  /**
   * Update an existing appointment
   * 
   * @param id - Appointment ID
   * @param data - Update data
   * @returns Promise resolving to the updated appointment
   */
  async updateAppointment(id: string, data: UpdateAppointmentData): Promise<Appointment> {
    if (!id?.trim()) {
      throw this.createError('Appointment ID is required', 'VALIDATION_ERROR');
    }

    // Validate input data
    const validationResult = updateAppointmentSchema.safeParse(data);
    if (!validationResult.success) {
      const errors = getValidationErrors(validationResult.error);
      throw this.createError('Validation failed', 'VALIDATION_ERROR', { errors });
    }

    const validatedData = validationResult.data;

    try {
      // Get current appointment for validation
      const currentAppointment = await this.getAppointment(id);

      // Validate status transitions
      if (validatedData.scheduledAt && currentAppointment.status !== AppointmentStatus.SCHEDULED) {
        throw this.createError(
          'Cannot reschedule non-scheduled appointment',
          'BUSINESS_RULE_ERROR'
        );
      }

      // Check for conflicts if rescheduling
      if (validatedData.scheduledAt) {
        const conflicts = await this.checkConflicts({
          nurseId: currentAppointment.nurseId,
          startTime: validatedData.scheduledAt,
          duration: validatedData.duration || currentAppointment.duration,
          excludeAppointmentId: id
        });

        if (conflicts.hasConflicts) {
          throw this.createError('Rescheduling conflicts detected', 'CONFLICT_ERROR', {
            conflicts: conflicts.conflicts,
            suggestions: conflicts.suggestions
          });
        }
      }

      const response = await this.client.put<{data: Appointment}>(`${this.endpoint}/${id}`, validatedData);
      
      // Log appointment update for audit
      this.logActivity('appointment_updated', {
        appointmentId: id,
        changes: validatedData,
        previousStatus: currentAppointment.status
      });

      return response.data.data;
    } catch (error) {
      this.handleError(error, 'Failed to update appointment');
      throw error;
    }
  }

  /**
   * Delete an appointment (soft delete)
   * 
   * @param id - Appointment ID
   * @param reason - Cancellation reason
   */
  async deleteAppointment(id: string, reason?: string): Promise<void> {
    if (!id?.trim()) {
      throw this.createError('Appointment ID is required', 'VALIDATION_ERROR');
    }

    try {
      const currentAppointment = await this.getAppointment(id);

      // Validate that appointment can be cancelled
      if (![AppointmentStatus.SCHEDULED, AppointmentStatus.IN_PROGRESS].includes(currentAppointment.status)) {
        throw this.createError(
          'Cannot cancel appointment with current status',
          'BUSINESS_RULE_ERROR'
        );
      }

      await this.client.delete(`${this.endpoint}/${id}`, { data: { reason } });
      
      // Log appointment cancellation for audit
      this.logActivity('appointment_cancelled', {
        appointmentId: id,
        reason,
        originalStatus: currentAppointment.status
      });
    } catch (error) {
      this.handleError(error, 'Failed to cancel appointment');
      throw error;
    }
  }

  // ==========================================
  // APPOINTMENT LISTING AND FILTERING
  // ==========================================

  /**
   * Get appointments with filtering and pagination
   * 
   * @param filters - Filter criteria
   * @returns Promise resolving to paginated appointment list
   */
  async getAppointments(filters: AppointmentFilters = {}) {
    // Validate filters
    const validationResult = appointmentFiltersSchema.safeParse(filters);
    if (!validationResult.success) {
      const errors = getValidationErrors(validationResult.error);
      throw this.createError('Invalid filters', 'VALIDATION_ERROR', { errors });
    }

    const validatedFilters = validationResult.data;

    try {
      const queryParams = new URLSearchParams();
      Object.entries(validatedFilters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });
      
      const url = `${this.endpoint}${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
      const response = await this.client.get<{
        data: Appointment[];
        pagination: {
          page: number;
          limit: number;
          total: number;
          totalPages: number;
        };
        filters: AppointmentFilters;
      }>(url);

      return response.data;
    } catch (error) {
      this.handleError(error, 'Failed to fetch appointments');
      throw error;
    }
  }

  /**
   * Get appointments for a specific date range
   * 
   * @param startDate - Start date (YYYY-MM-DD)
   * @param endDate - End date (YYYY-MM-DD)
   * @param nurseId - Optional nurse filter
   * @returns Promise resolving to appointments in date range
   */
  async getAppointmentsByDateRange(
    startDate: string,
    endDate: string,
    nurseId?: string
  ): Promise<Appointment[]> {
    const filters: AppointmentFilters = {
      startDate,
      endDate,
      nurseId,
      sortBy: 'scheduledAt',
      sortOrder: 'asc',
      limit: 1000 // Large limit for calendar views
    };

    const result = await this.getAppointments(filters);
    return result.data;
  }

  /**
   * Get today's appointments for a nurse
   * 
   * @param nurseId - Nurse ID
   * @returns Promise resolving to today's appointments
   */
  async getTodaysAppointments(nurseId: string): Promise<Appointment[]> {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
    
    return this.getAppointmentsByDateRange(today, today, nurseId);
  }

  /**
   * Get upcoming appointments for a student
   * 
   * @param studentId - Student ID
   * @param limit - Number of appointments to return
   * @returns Promise resolving to upcoming appointments
   */
  async getUpcomingAppointments(studentId: string, limit = 5): Promise<Appointment[]> {
    const today = new Date().toISOString().split('T')[0];
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    const endDate = nextMonth.toISOString().split('T')[0];

    const filters: AppointmentFilters = {
      studentId,
      startDate: today,
      endDate,
      status: AppointmentStatus.SCHEDULED,
      sortBy: 'scheduledAt',
      sortOrder: 'asc',
      limit
    };

    const result = await this.getAppointments(filters);
    return result.data;
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
    const updateData: UpdateAppointmentData = {
      outcomes,
      followUpRequired,
      ...(followUpDate && { followUpDate })
    };

    // Update the appointment data first
    await this.updateAppointment(id, updateData);

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

  // ==========================================
  // CONFLICT DETECTION
  // ==========================================

  /**
   * Check for appointment conflicts
   * 
   * @param conflictData - Conflict check parameters
   * @returns Promise resolving to conflict check result
   */
  async checkConflicts(conflictData: {
    nurseId: string;
    startTime: string;
    duration: number;
    excludeAppointmentId?: string;
  }): Promise<ConflictCheckResult> {
    // Validate input
    const validationResult = conflictCheckSchema.safeParse(conflictData);
    if (!validationResult.success) {
      const errors = getValidationErrors(validationResult.error);
      throw this.createError('Invalid conflict check data', 'VALIDATION_ERROR', { errors });
    }

    try {
      const response = await this.client.post<{data: ConflictCheckResult}>(
        `${this.endpoint}/conflicts/check`,
        validationResult.data
      );

      return response.data.data;
    } catch (error) {
      this.handleError(error, 'Failed to check conflicts');
      throw error;
    }
  }

  /**
   * Find available time slots for appointment scheduling
   * 
   * @param nurseId - Nurse ID
   * @param date - Date to check (YYYY-MM-DD)
   * @param duration - Appointment duration in minutes
   * @returns Promise resolving to available time slots
   */
  async findAvailableSlots(nurseId: string, date: string, duration: number = APPOINTMENT_VALIDATION.DEFAULT_DURATION) {
    if (!nurseId?.trim() || !date?.trim()) {
      throw this.createError('Nurse ID and date are required', 'VALIDATION_ERROR');
    }

    try {
      const queryParams = new URLSearchParams({
        nurseId,
        date,
        duration: duration.toString()
      });
      
      const response = await this.client.get<{data: {
        date: string;
        nurseId: string;
        duration: number;
        slots: Array<{
          startTime: string;
          endTime: string;
          available: boolean;
        }>;
      }}>(`${this.endpoint}/availability/slots?${queryParams.toString()}`);

      return response.data.data;
    } catch (error) {
      this.handleError(error, 'Failed to find available slots');
      throw error;
    }
  }

  // ==========================================
  // RECURRING APPOINTMENTS
  // ==========================================

  /**
   * Create recurring appointments
   * 
   * @param data - Recurring appointment data
   * @returns Promise resolving to created appointments
   */
  async createRecurringAppointments(data: RecurringAppointmentData): Promise<Appointment[]> {
    // Validate input data
    const validationResult = recurringAppointmentSchema.safeParse(data);
    if (!validationResult.success) {
      const errors = getValidationErrors(validationResult.error);
      throw this.createError('Validation failed', 'VALIDATION_ERROR', { errors });
    }

    try {
      const response = await this.client.post<{data: {
        appointments: Appointment[];
        summary: {
          requested: number;
          created: number;
          skipped: number;
          conflicts: string[];
        };
      }}>(`${this.endpoint}/recurring`, validationResult.data);

      // Log recurring appointment creation
      this.logActivity('recurring_appointments_created', {
        studentId: data.studentId,
        nurseId: data.nurseId,
        frequency: data.recurrence.frequency,
        created: response.data.data.summary.created,
        conflicts: response.data.data.summary.conflicts.length
      });

      return response.data.data.appointments;
    } catch (error) {
      this.handleError(error, 'Failed to create recurring appointments');
      throw error;
    }
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

  // ==========================================
  // UTILITY METHODS
  // ==========================================

  /**
   * Validate appointment data without creating
   * 
   * @param data - Appointment data to validate
   * @returns Validation result with errors if any
   */
  validateAppointmentData(data: CreateAppointmentData) {
    const schemaResult = createAppointmentSchema.safeParse(data);
    const businessRules = validateAppointmentBusinessRules({
      scheduledAt: data.scheduledAt,
      duration: data.duration || APPOINTMENT_VALIDATION.DEFAULT_DURATION,
      type: data.type,
      priority: data.priority || AppointmentPriority.NORMAL
    });

    return {
      valid: schemaResult.success && businessRules.valid,
      schemaErrors: schemaResult.success ? [] : getValidationErrors(schemaResult.error),
      businessErrors: businessRules.errors,
      allErrors: [
        ...(schemaResult.success ? [] : Object.values(getValidationErrors(schemaResult.error)).flat()),
        ...businessRules.errors
      ]
    };
  }

  /**
   * Check if appointment can be modified
   * 
   * @param appointment - Appointment to check
   * @returns Whether appointment can be modified
   */
  canModifyAppointment(appointment: Appointment): boolean {
    const modifiableStatuses = [AppointmentStatus.SCHEDULED, AppointmentStatus.IN_PROGRESS];
    const now = new Date();
    const appointmentTime = new Date(appointment.scheduledAt);
    const timeDiff = appointmentTime.getTime() - now.getTime();
    const minutesDiff = timeDiff / (1000 * 60);

    return modifiableStatuses.includes(appointment.status) && 
           minutesDiff >= APPOINTMENT_VALIDATION.CANCELLATION_NOTICE * 60;
  }

  /**
   * Get next available appointment slot
   * 
   * @param nurseId - Nurse ID
   * @param preferredDate - Preferred date (optional)
   * @param duration - Appointment duration
   * @returns Promise resolving to next available slot
   */
  async getNextAvailableSlot(nurseId: string, preferredDate?: string, duration = APPOINTMENT_VALIDATION.DEFAULT_DURATION) {
    const startDate = preferredDate || new Date().toISOString().split('T')[0];
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 30); // Search within next 30 days
    
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('nurseId', nurseId);
      queryParams.append('startDate', startDate);
      queryParams.append('endDate', endDate.toISOString().split('T')[0]);
      queryParams.append('duration', duration.toString());
      
      const response = await this.client.get<{data: {
        startTime: string;
        endTime: string;
        date: string;
        nurseName: string;
      } | null}>(`${this.endpoint}/availability/next?${queryParams.toString()}`);

      return response.data.data;
    } catch (error) {
      this.handleError(error, 'Failed to find next available slot');
      throw error;
    }
  }
}

/**
 * Factory function to create AppointmentsService
 */
export function createAppointmentsService(client: ApiClient): AppointmentsService {
  return new AppointmentsService(client);
}
