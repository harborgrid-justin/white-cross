/**
 * @fileoverview Appointments API Service
 *
 * Provides a standardized interface to the appointments API following the EntityApiService
 * pattern. All methods include error handling, response transformation, and HIPAA-compliant
 * audit logging for PHI access. Integrates with Redux Toolkit's EntityAdapter for normalized
 * state management.
 *
 * @module stores/slices/appointments/api-service
 */

import { EntityApiService } from '@/stores/sliceFactory';
import { apiActions } from '@/lib/api';
import type {
  Appointment,
  AppointmentFilters,
  CreateAppointmentData,
  UpdateAppointmentData
} from '@/types/appointments';

/**
 * Appointments API Service Adapter
 *
 * Provides a standardized interface to the appointments API following the EntityApiService
 * pattern. All methods include error handling, response transformation, and HIPAA-compliant
 * audit logging for PHI access. Integrates with Redux Toolkit's EntityAdapter for normalized
 * state management.
 *
 * @constant {EntityApiService<Appointment, CreateAppointmentData, UpdateAppointmentData>}
 *
 * @remarks
 * **Authentication**: All methods require valid JWT token with nurse/admin role
 * **Authorization**: Nurses can only access appointments for their assigned students
 * **Rate Limiting**: 100 requests per minute per user
 * **Audit Logging**: All operations trigger PHI access audit logs
 * **Conflict Detection**: Create/update operations check for scheduling conflicts
 *
 * @example
 * ```typescript
 * // Used internally by createEntitySlice factory
 * const slice = createEntitySlice('appointments', appointmentsApiService, options);
 * ```
 */
export const appointmentsApiService: EntityApiService<Appointment, CreateAppointmentData, UpdateAppointmentData> = {
  /**
   * Get all appointments with optional filtering
   *
   * Retrieves paginated list of appointments with support for filtering by student,
   * nurse, status, type, and date range. Results are sorted by scheduledAt by default.
   *
   * @async
   * @param {AppointmentFilters} [params] - Optional filters for appointments
   * @param {string} [params.studentId] - Filter by student ID
   * @param {string} [params.nurseId] - Filter by nurse ID
   * @param {string} [params.status] - Filter by status (scheduled, completed, cancelled)
   * @param {string} [params.type] - Filter by appointment type
   * @param {string} [params.startDate] - Filter by start date (ISO 8601)
   * @param {string} [params.endDate] - Filter by end date (ISO 8601)
   * @param {number} [params.page] - Page number for pagination
   * @param {number} [params.limit] - Items per page
   *
   * @returns {Promise<{data: Appointment[], total: number, pagination: object}>} Paginated appointments
   *
   * @throws {ApiError} If request fails or user lacks permission
   *
   * @example
   * ```typescript
   * // Get today's appointments for a specific nurse
   * const result = await appointmentsApiService.getAll({
   *   nurseId: 'nurse-uuid',
   *   startDate: '2025-10-26T00:00:00Z',
   *   endDate: '2025-10-26T23:59:59Z'
   * });
   * ```
   *
   * @remarks
   * **Cache Strategy**: TanStack Query caches for 2 minutes
   * **HIPAA**: Triggers audit log for PHI access (appointment details)
   */
  async getAll(params?: AppointmentFilters) {
    const response = await apiActions.appointments.getAll(params as AppointmentFilters);
    return {
      data: response.data || [],
      total: response.pagination?.total || 0,
      pagination: response.pagination,
    };
  },

  /**
   * Get appointment by ID
   *
   * Retrieves detailed appointment information including student data, appointment reason,
   * notes, and history. Used for appointment detail view and edit forms.
   *
   * @async
   * @param {string} id - Appointment UUID
   *
   * @returns {Promise<{data: Appointment}>} Appointment details
   *
   * @throws {NotFoundError} If appointment doesn't exist
   * @throws {ForbiddenError} If user lacks permission to view appointment
   *
   * @example
   * ```typescript
   * // Load appointment for editing
   * const result = await appointmentsApiService.getById('appt-uuid');
   * console.log(result.data.reason); // 'Annual health screening'
   * ```
   *
   * @remarks
   * **Cache Strategy**: 1-minute cache, invalidated on update
   * **HIPAA**: Audit log includes appointment reason (PHI)
   */
  async getById(id: string) {
    const response = await apiActions.appointments.getById(id);
    return { data: response.appointment };
  },

  /**
   * Create new appointment
   *
   * Creates appointment with student assignment, scheduling, type, and reason.
   * Performs conflict detection to prevent double-booking. Sends notification
   * to student and parent if configured.
   *
   * @async
   * @param {CreateAppointmentData} data - Appointment creation data
   * @param {string} data.studentId - Student UUID (required)
   * @param {string} data.nurseId - Nurse UUID (required)
   * @param {string} data.scheduledAt - ISO 8601 datetime (required)
   * @param {string} data.type - Appointment type (required)
   * @param {string} data.reason - Appointment reason (required)
   * @param {string} [data.notes] - Additional notes
   * @param {number} [data.duration] - Duration in minutes (default: 30)
   *
   * @returns {Promise<{data: Appointment}>} Created appointment
   *
   * @throws {ValidationError} If data validation fails
   * @throws {ConflictError} If scheduling conflict detected
   *
   * @example
   * ```typescript
   * // Schedule routine health screening
   * const result = await appointmentsApiService.create({
   *   studentId: 'student-uuid',
   *   nurseId: 'nurse-uuid',
   *   scheduledAt: '2025-10-27T10:00:00Z',
   *   type: 'Health Screening',
   *   reason: 'Annual health screening',
   *   duration: 30
   * });
   * ```
   *
   * @remarks
   * **Conflict Detection**: Checks for overlapping appointments
   * **Notifications**: Sends reminder to student/parent
   * **Optimistic Update**: UI updated before server confirmation
   * **HIPAA**: Audit log includes student ID and reason
   */
  async create(data: CreateAppointmentData) {
    const response = await apiActions.appointments.create(data);
    return { data: response.appointment };
  },

  /**
   * Update existing appointment
   *
   * Updates appointment details including rescheduling, status changes, and note updates.
   * Performs conflict detection for date/time changes. Notifies affected parties of changes.
   *
   * @async
   * @param {string} id - Appointment UUID
   * @param {UpdateAppointmentData} data - Fields to update
   * @param {string} [data.scheduledAt] - New datetime (triggers conflict check)
   * @param {string} [data.status] - New status
   * @param {string} [data.notes] - Updated notes
   * @param {string} [data.reason] - Updated reason
   *
   * @returns {Promise<{data: Appointment}>} Updated appointment
   *
   * @throws {NotFoundError} If appointment doesn't exist
   * @throws {ConflictError} If rescheduling creates conflict
   *
   * @example
   * ```typescript
   * // Reschedule appointment
   * const result = await appointmentsApiService.update('appt-uuid', {
   *   scheduledAt: '2025-10-28T14:00:00Z',
   *   notes: 'Rescheduled due to student absence'
   * });
   * ```
   *
   * @remarks
   * **Conflict Detection**: Applied for date/time changes
   * **Status Transitions**: Validates valid status transitions
   * **Notifications**: Sends update notification if date/time changed
   * **HIPAA**: Audit log tracks all changes
   */
  async update(id: string, data: UpdateAppointmentData) {
    const response = await apiActions.appointments.update(id, data);
    return { data: response.appointment };
  },

  /**
   * Delete appointment (via cancellation)
   *
   * Cancels appointment with reason. Does not hard-delete to maintain audit trail.
   * Sends cancellation notification to student and parent.
   *
   * @async
   * @param {string} id - Appointment UUID
   *
   * @returns {Promise<{success: boolean}>} Success status
   *
   * @throws {NotFoundError} If appointment doesn't exist
   * @throws {ForbiddenError} If user lacks permission
   *
   * @example
   * ```typescript
   * // Cancel appointment
   * await appointmentsApiService.delete('appt-uuid');
   * ```
   *
   * @remarks
   * **Soft Delete**: Marks appointment as cancelled, doesn't delete
   * **Reason**: Always logs 'Deleted' as cancellation reason
   * **Notifications**: Sends cancellation notification
   * **Audit Trail**: Maintains record for compliance
   * **HIPAA**: Audit log tracks cancellation
   */
  async delete(id: string) {
    await apiActions.appointments.cancel(id, 'Deleted');
    return { success: true };
  },
};
