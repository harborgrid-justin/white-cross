/**
 * @fileoverview Core Appointments API - CRUD operations
 * @module services/modules/appointments/appointmentsApi.core
 * @category Services
 *
 * @deprecated This module is deprecated. Use server actions instead:
 * - Server: `@/lib/actions/appointments.actions`
 * - Client: Use React Query with server actions
 *
 * Migration example:
 * ```typescript
 * // OLD:
 * import { AppointmentsCoreApiImpl } from '@/services/modules/appointments/appointmentsApi.core';
 * const api = new AppointmentsCoreApiImpl(client);
 * const { appointment } = await api.getById(id);
 *
 * // NEW (Server Component):
 * import { getAppointment } from '@/lib/actions/appointments.actions';
 * const appointment = await getAppointment(id);
 *
 * // NEW (Client Component with React Query):
 * import { useQuery } from '@tanstack/react-query';
 * import { getAppointment } from '@/lib/actions/appointments.actions';
 * const { data: appointment } = useQuery({
 *   queryKey: ['appointment', id],
 *   queryFn: () => getAppointment(id)
 * });
 * ```
 *
 * Will be removed in v2.0.0 (Q2 2025)
 *
 * Core appointment management API providing essential CRUD operations
 * for scheduling and managing healthcare appointments with PHI protection
 * and HIPAA-compliant logging.
 */

import type {
  Appointment,
  AppointmentFilters,
  CreateAppointmentData,
  UpdateAppointmentData
} from '@/types/domain/appointments'
import type { PaginatedResponse } from '@/types/common'
import type { ApiClient } from '@/services/core/ApiClient'
import { extractApiData, handleApiError, buildUrlParams } from '@/services/utils/apiUtils'

/**
 * Core Appointments API Interface
 * Defines essential CRUD operations for appointment management
 */
export interface IAppointmentsCoreApi {
  /** Get all appointments with optional filtering and pagination */
  getAll(filters?: AppointmentFilters): Promise<PaginatedResponse<Appointment>>;

  /** Get single appointment by ID */
  getById(id: string): Promise<{ appointment: Appointment }>;

  /** Create a new appointment with conflict detection */
  create(appointmentData: CreateAppointmentData): Promise<{ appointment: Appointment }>;

  /** Update an existing appointment */
  update(id: string, data: UpdateAppointmentData): Promise<{ appointment: Appointment }>;

  /** Cancel an appointment with automatic notifications */
  cancel(id: string, reason?: string): Promise<{ appointment: Appointment }>;

  /** Mark appointment as no-show */
  markNoShow(id: string): Promise<{ appointment: Appointment }>;

  /** Complete an appointment with optional outcomes */
  complete(id: string, data?: {
    notes?: string;
    outcomes?: string;
    followUpRequired?: boolean;
    followUpDate?: string;
  }): Promise<{ appointment: Appointment }>;

  /** Start an appointment (mark as in progress) */
  start(id: string): Promise<{ appointment: Appointment }>;

  /** Reschedule an appointment to a new time */
  reschedule(id: string, newScheduledAt: string, reason?: string): Promise<{ appointment: Appointment }>;
}

/**
 * Core Appointments API Implementation
 *
 * Handles core CRUD operations for healthcare appointments with comprehensive
 * validation, error handling, and PHI protection.
 *
 * **API Endpoints**:
 * - GET /appointments - List appointments with filters
 * - GET /appointments/:id - Get single appointment
 * - POST /appointments - Create new appointment
 * - PUT /appointments/:id - Update appointment
 * - PUT /appointments/:id/cancel - Cancel appointment
 * - PUT /appointments/:id/no-show - Mark as no-show
 * - PUT /appointments/:id/complete - Complete appointment
 * - PUT /appointments/:id/start - Start appointment
 * - PUT /appointments/:id/reschedule - Reschedule appointment
 *
 * **PHI Considerations**:
 * - All appointment data contains PHI (student info, medical reason)
 * - Audit logging required for all operations
 * - Access control enforced by backend
 */
export class AppointmentsCoreApiImpl implements IAppointmentsCoreApi {
  constructor(private readonly client: ApiClient) {}

  /**
   * Get all appointments with optional filtering and pagination
   *
   * @param filters - Optional filters for appointment query
   * @returns Paginated list of appointments with metadata
   * @throws {ValidationError} Invalid filter parameters
   * @throws {ForbiddenError} User lacks permission to view appointments
   *
   * @remarks
   * - Query key: `['appointments', 'list', filters]`
   * - Real-time updates via Socket.io: `appointment:updated`
   * - RBAC: Nurses see only their own unless admin
   *
   * @example
   * ```typescript
   * const { data, pagination } = await coreApi.getAll({
   *   nurseId: 'nurse-456',
   *   status: 'SCHEDULED',
   *   page: 1,
   *   limit: 20
   * });
   * ```
   */
  async getAll(filters?: AppointmentFilters): Promise<PaginatedResponse<Appointment>> {
    try {
      const params = filters ? `?${buildUrlParams(filters).toString()}` : ''
      const response = await this.client.get<PaginatedResponse<Appointment>>(`/appointments${params}`)
      return response.data
    } catch (error) {
      throw handleApiError(error as Error)
    }
  }

  /**
   * Get single appointment by ID with full details
   *
   * @param id - Appointment UUID
   * @returns Complete appointment details
   * @throws {NotFoundError} Appointment not found
   * @throws {ForbiddenError} User lacks permission to view appointment
   *
   * @example
   * ```typescript
   * const { appointment } = await coreApi.getById('appointment-uuid-123');
   * ```
   */
  async getById(id: string): Promise<{ appointment: Appointment }> {
    try {
      const response = await this.client.get(`/appointments/${id}`)
      return response.data
    } catch (error) {
      throw handleApiError(error as Error)
    }
  }

  /**
   * Create a new appointment with conflict detection and notifications
   *
   * @param appointmentData - Appointment creation data
   * @returns Created appointment with generated ID
   * @throws {ValidationError} Invalid appointment data or scheduling conflict
   * @throws {ForbiddenError} User lacks permission to create appointments
   * @throws {ConflictError} Nurse unavailable or student has conflicting appointment
   *
   * @remarks
   * **Automated Workflows**:
   * - Conflict detection: Checks nurse availability and student scheduling
   * - Waitlist processing: Removes student from waitlist if exists
   * - Parent notification: Sends notification for high-priority appointments
   * - Reminder scheduling: Automatically schedules 24-hour reminder
   *
   * **Audit Trail**: Action logged as APPOINTMENT_CREATED, 7-year retention
   *
   * @example
   * ```typescript
   * const { appointment } = await coreApi.create({
   *   studentId: 'student-uuid-123',
   *   nurseId: 'nurse-uuid-456',
   *   type: 'CHECKUP',
   *   scheduledAt: '2025-01-15T10:00:00Z',
   *   duration: 30,
   *   reason: 'Annual health screening'
   * });
   * ```
   */
  async create(appointmentData: CreateAppointmentData): Promise<{ appointment: Appointment }> {
    try {
      const response = await this.client.post<{ appointment: Appointment }>('/appointments', appointmentData)
      return response.data
    } catch (error) {
      throw handleApiError(error as Error)
    }
  }

  /**
   * Update an existing appointment with validation
   *
   * Supports partial updates - only provided fields will be modified.
   *
   * @param id - Appointment UUID to update
   * @param data - Fields to update
   * @returns Updated appointment
   * @throws {NotFoundError} Appointment not found
   * @throws {ValidationError} Invalid update data
   * @throws {ForbiddenError} User lacks permission to update appointment
   * @throws {ConflictError} Update creates scheduling conflict
   *
   * @example
   * ```typescript
   * const { appointment } = await coreApi.update('appointment-uuid-123', {
   *   reason: 'Updated reason for visit'
   * });
   * ```
   */
  async update(id: string, data: UpdateAppointmentData): Promise<{ appointment: Appointment }> {
    try {
      const response = await this.client.put(`/appointments/${id}`, data)
      return response.data
    } catch (error) {
      throw handleApiError(error as Error)
    }
  }

  /**
   * Cancel an appointment with automatic notifications and waitlist processing
   *
   * @param id - Appointment UUID to cancel
   * @param reason - Optional cancellation reason for audit trail
   * @returns Cancelled appointment with updated status
   * @throws {NotFoundError} Appointment not found
   * @throws {ForbiddenError} User lacks permission to cancel appointment
   * @throws {InvalidOperationError} Cannot cancel completed or already-cancelled appointment
   *
   * @remarks
   * **Automated Workflows**:
   * - Status update: Changes status to CANCELLED
   * - Notification: Sends to student/parent and nurse
   * - Waitlist processing: Offers slot to next waitlisted student
   * - Reminder cancellation: Cancels all pending reminders
   * - Calendar update: Updates nurse availability
   *
   * @example
   * ```typescript
   * const { appointment } = await coreApi.cancel(
   *   'appointment-uuid-123',
   *   'Student absent from school'
   * );
   * ```
   */
  async cancel(id: string, reason?: string): Promise<{ appointment: Appointment }> {
    try {
      const response = await this.client.put(`/appointments/${id}/cancel`, { reason })
      return response.data
    } catch (error) {
      throw handleApiError(error as Error)
    }
  }

  /**
   * Mark appointment as no-show with statistics tracking
   *
   * @param id - Appointment UUID to mark as no-show
   * @returns Updated appointment with NO_SHOW status
   * @throws {NotFoundError} Appointment not found
   * @throws {ForbiddenError} User lacks permission to mark no-show
   * @throws {InvalidOperationError} Cannot mark future appointment as no-show
   *
   * @remarks
   * - Updates student no-show rate statistics
   * - Notifies parent of no-show
   * - Triggers workflow for repeated no-shows (e.g., 3+ no-shows)
   *
   * @example
   * ```typescript
   * const { appointment } = await coreApi.markNoShow('appointment-uuid-123');
   * ```
   */
  async markNoShow(id: string): Promise<{ appointment: Appointment }> {
    try {
      const response = await this.client.put(`/appointments/${id}/no-show`, {})
      return response.data
    } catch (error) {
      throw handleApiError(error as Error)
    }
  }

  /**
   * Complete an appointment with optional outcomes and follow-up
   *
   * @param id - Appointment UUID to complete
   * @param data - Optional completion data (notes, outcomes, follow-up)
   * @returns Completed appointment
   * @throws {NotFoundError} Appointment not found
   * @throws {ForbiddenError} User lacks permission to complete appointment
   * @throws {InvalidOperationError} Cannot complete appointment not in progress
   *
   * @remarks
   * - Stores completion notes and outcomes
   * - Creates follow-up appointment if required
   * - Updates completion rate metrics
   *
   * @example
   * ```typescript
   * const { appointment } = await coreApi.complete('appointment-uuid-123', {
   *   notes: 'Student received medication as scheduled',
   *   outcomes: 'Successful administration, no adverse reactions',
   *   followUpRequired: false
   * });
   * ```
   */
  async complete(id: string, data?: {
    notes?: string;
    outcomes?: string;
    followUpRequired?: boolean;
    followUpDate?: string;
  }): Promise<{ appointment: Appointment }> {
    try {
      const response = await this.client.put(`/appointments/${id}/complete`, data)
      return response.data
    } catch (error) {
      throw handleApiError(error as Error)
    }
  }

  /**
   * Start an appointment (mark as in progress)
   *
   * @param id - Appointment UUID to start
   * @returns Started appointment with IN_PROGRESS status
   * @throws {NotFoundError} Appointment not found
   * @throws {ForbiddenError} User lacks permission to start appointment
   * @throws {InvalidOperationError} Cannot start cancelled or completed appointment
   *
   * @example
   * ```typescript
   * const { appointment } = await coreApi.start('appointment-uuid-123');
   * ```
   */
  async start(id: string): Promise<{ appointment: Appointment }> {
    try {
      const response = await this.client.put(`/appointments/${id}/start`)
      return response.data
    } catch (error) {
      throw handleApiError(error as Error)
    }
  }

  /**
   * Reschedule an appointment to a new time
   *
   * @param id - Appointment UUID to reschedule
   * @param newScheduledAt - New appointment time (ISO 8601 datetime)
   * @param reason - Optional reason for rescheduling
   * @returns Rescheduled appointment
   * @throws {NotFoundError} Appointment not found
   * @throws {ValidationError} Invalid scheduled time
   * @throws {ForbiddenError} User lacks permission to reschedule
   * @throws {ConflictError} New time slot unavailable or conflicts
   *
   * @remarks
   * - Validates new time slot availability
   * - Sends reschedule notification to all parties
   * - Updates reminder schedule for new time
   * - Updates nurse calendar
   *
   * @example
   * ```typescript
   * const { appointment } = await coreApi.reschedule(
   *   'appointment-uuid-123',
   *   '2025-01-16T14:00:00Z',
   *   'Nurse schedule change'
   * );
   * ```
   */
  async reschedule(
    id: string,
    newScheduledAt: string,
    reason?: string
  ): Promise<{ appointment: Appointment }> {
    try {
      const response = await this.client.put(`/appointments/${id}/reschedule`, {
        scheduledAt: newScheduledAt,
        reason
      })
      return response.data
    } catch (error) {
      throw handleApiError(error as Error)
    }
  }
}
