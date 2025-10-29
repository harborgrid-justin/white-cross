/**
 * @fileoverview Appointments API service for scheduling and availability management
 * @module services/modules/appointmentsApi
 * @category Services
 * 
 * Comprehensive appointment management API including scheduling, availability
 * tracking, waitlist management, and reminder processing for healthcare appointments.
 * 
 * Key Features:
 * - Appointment CRUD operations
 * - Availability slot management
 * - Waitlist functionality
 * - Recurring appointment scheduling
 * - Conflict detection and resolution
 * - Appointment reminders (email/SMS)
 * - Statistics and reporting
 * - Nurse availability management
 * 
 * Healthcare-Specific:
 * - PHI protection in all appointment data
 * - HIPAA-compliant logging
 * - Student-nurse appointment relationships
 * - Emergency appointment prioritization
 * - Parent notification integration
 * 
 * Scheduling Features:
 * - Single and recurring appointments
 * - Availability slot checking
 * - Conflict detection
 * - Waitlist with priority ordering
 * - Automated reminder processing
 * - Calendar integration
 * 
 * @example
 * ```typescript
 * // Create appointment
 * const { appointment } = await appointmentsApi.create({
 *   studentId: 'student-123',
 *   nurseId: 'nurse-456',
 *   type: 'CHECKUP',
 *   scheduledAt: '2025-01-15T10:00:00Z',
 *   duration: 30,
 *   reason: 'Annual checkup',
 *   priority: 'NORMAL'
 * });
 * 
 * // Get available slots
 * const slots = await appointmentsApi.getAvailability({
 *   nurseId: 'nurse-456',
 *   startDate: '2025-01-15',
 *   endDate: '2025-01-15',
 *   duration: 30
 * });
 * 
 * // Add to waitlist
 * const entry = await appointmentsApi.addToWaitlist({
 *   studentId: 'student-123',
 *   appointmentType: 'CHECKUP',
 *   preferredDate: '2025-01-15',
 *   priority: 'HIGH'
 * });
 * 
 * // Process reminders
 * const result = await appointmentsApi.processReminders({
 *   hoursAhead: 24,
 *   batchSize: 50
 * });
 * ```
 */

import type {
  Appointment,
  AppointmentFilters,
  AppointmentStatistics,
  NurseAvailability,
  NurseAvailabilityData,
  AppointmentWaitlist,
  WaitlistFilters,
  RecurringAppointmentData,
  AvailabilitySlot,
  ReminderProcessingResult,
  ConflictCheckResult,
  AppointmentReminder,
  WaitlistEntryData,
  CreateAppointmentData,
  UpdateAppointmentData
} from '../../types/appointments'
import type { PaginatedResponse } from '@/types/common'
import type { ApiClient } from '@/services/core/ApiClient'
import { extractApiData, handleApiError, buildUrlParams } from '@/services/utils/apiUtils'

/**
 * Appointments API Interface
 * Defines all appointment scheduling and management operations
 */
export interface IAppointmentsApi {
  // Core Appointment Operations
  getAll(filters?: AppointmentFilters): Promise<PaginatedResponse<Appointment>>;
  getById(id: string): Promise<{ appointment: Appointment }>;
  create(appointmentData: CreateAppointmentData): Promise<{ appointment: Appointment }>;
  update(id: string, data: UpdateAppointmentData): Promise<{ appointment: Appointment }>;
  cancel(id: string, reason?: string): Promise<{ appointment: Appointment }>;
  markNoShow(id: string): Promise<{ appointment: Appointment }>;
  complete(id: string, data?: {
    notes?: string;
    outcomes?: string;
    followUpRequired?: boolean;
    followUpDate?: string;
  }): Promise<{ appointment: Appointment }>;
  start(id: string): Promise<{ appointment: Appointment }>;
  reschedule(id: string, newScheduledAt: string, reason?: string): Promise<{ appointment: Appointment }>;

  // Availability Management
  getAvailability(nurseId: string, date?: string, duration?: number): Promise<{ slots: AvailabilitySlot[] }>;
  getUpcoming(nurseId: string, limit?: number): Promise<{ appointments: Appointment[] }>;
  getStatistics(filters?: {
    nurseId?: string;
    dateFrom?: string;
    dateTo?: string;
  }): Promise<AppointmentStatistics>;

  // Recurring Appointments
  createRecurring(data: RecurringAppointmentData): Promise<{ appointments: Appointment[]; count: number }>;

  // Nurse Availability
  setAvailability(data: NurseAvailabilityData): Promise<{ availability: NurseAvailability }>;
  getNurseAvailability(nurseId: string, date?: string): Promise<{ availability: NurseAvailability[] }>;
  updateAvailability(id: string, data: Partial<NurseAvailabilityData>): Promise<{ availability: NurseAvailability }>;
  deleteAvailability(id: string): Promise<void>;

  // Waitlist Management
  addToWaitlist(data: {
    studentId: string;
    nurseId?: string;
    type: string;
    reason: string;
    priority?: string;
    preferredDate?: string;
    duration?: number;
    notes?: string;
  }): Promise<{ entry: AppointmentWaitlist }>;
  getWaitlist(filters?: WaitlistFilters): Promise<{ waitlist: AppointmentWaitlist[] }>;
  removeFromWaitlist(id: string, reason?: string): Promise<{ entry: AppointmentWaitlist }>;
  addToWaitlistFull(data: WaitlistEntryData): Promise<{ entry: AppointmentWaitlist }>;
  updateWaitlistPriority(id: string, priority: string): Promise<{ entry: AppointmentWaitlist }>;
  getWaitlistPosition(waitlistEntryId: string): Promise<{ position: number; total: number }>;
  notifyWaitlistEntry(id: string, message?: string): Promise<{ entry: AppointmentWaitlist; notification: any }>;

  // Calendar Export
  exportCalendar(nurseId: string, dateFrom?: string, dateTo?: string): Promise<Blob>;

  // Reminder Management
  processPendingReminders(): Promise<ReminderProcessingResult>;
  getAppointmentReminders(appointmentId: string): Promise<{ reminders: AppointmentReminder[] }>;
  scheduleReminder(data: {
    appointmentId: string;
    type: string;
    scheduleTime: string;
    message?: string;
  }): Promise<{ reminder: AppointmentReminder }>;
  cancelReminder(reminderId: string): Promise<{ reminder: AppointmentReminder }>;

  // Conflict Detection
  checkConflicts(
    nurseId: string,
    startTime: string,
    duration: number,
    excludeAppointmentId?: string
  ): Promise<ConflictCheckResult>;

  // Bulk Operations
  cancelMultiple(appointmentIds: string[], reason?: string): Promise<{ cancelled: number; failed: number }>;
  getForStudents(studentIds: string[], filters?: Partial<AppointmentFilters>): Promise<{ appointments: Appointment[] }>;

  // Advanced Filtering
  getByDateRange(dateFrom: string, dateTo: string, nurseId?: string): Promise<{ appointments: Appointment[] }>;
  search(query: string, filters?: Partial<AppointmentFilters>): Promise<PaginatedResponse<Appointment>>;

  // Analytics
  getTrends(dateFrom: string, dateTo: string, groupBy?: 'day' | 'week' | 'month'): Promise<{ trends: any[] }>;
  getNoShowStats(nurseId?: string, dateFrom?: string, dateTo?: string): Promise<{
    rate: number;
    total: number;
    noShows: number;
    byStudent: any[];
  }>;
  getUtilizationStats(nurseId: string, dateFrom: string, dateTo: string): Promise<{
    utilizationRate: number;
    totalSlots: number;
    bookedSlots: number;
    availableSlots: number;
    byDay: any[];
  }>;
}

/**
 * Appointments API implementation
 * 
 * @class
 * @implements {IAppointmentsApi}
 * @classdesc Handles appointment scheduling, availability management, waitlist
 * functionality, and reminder processing for healthcare appointments.
 * 
 * API Endpoints:
 * - GET /appointments - List appointments with filters
 * - POST /appointments - Create new appointment
 * - PUT /appointments/:id - Update appointment
 * - DELETE /appointments/:id - Cancel appointment
 * - GET /appointments/availability - Check available slots
 * - POST /appointments/waitlist - Add to waitlist
 * - POST /appointments/reminders - Process reminders
 * 
 * PHI Considerations:
 * - All appointment data contains PHI (student info, medical reason)
 * - Audit logging required for all operations
 * - Access control enforced by backend
 * - No PHI in query parameters (use POST body)
 * 
 * @example
 * ```typescript
 * const appointmentsApi = new AppointmentsApiImpl();
 * 
 * // List today's appointments
 * const { data, pagination } = await appointmentsApi.getAll({
 *   startDate: '2025-01-15',
 *   endDate: '2025-01-15',
 *   status: 'SCHEDULED'
 * });
 * ```
 */
class AppointmentsApiImpl implements IAppointmentsApi {
  constructor(private readonly client: ApiClient) {}

  /**
   * Get all appointments with optional filtering and pagination
   *
   * Retrieves appointments with comprehensive filtering by date range, nurse,
   * student, status, and type. Supports pagination for large result sets.
   *
   * @param {AppointmentFilters} [filters] - Optional filters for appointment query
   * @param {string} [filters.startDate] - Start date for date range filter (ISO 8601)
   * @param {string} [filters.endDate] - End date for date range filter (ISO 8601)
   * @param {string} [filters.nurseId] - Filter by nurse UUID
   * @param {string} [filters.studentId] - Filter by student UUID
   * @param {AppointmentStatus} [filters.status] - Filter by appointment status
   * @param {AppointmentType} [filters.type] - Filter by appointment type
   * @param {number} [filters.page] - Page number for pagination (1-indexed)
   * @param {number} [filters.limit] - Number of results per page (default: 20)
   * @returns {Promise<PaginatedResponse<Appointment>>} Paginated list of appointments with metadata
   * @throws {ValidationError} Invalid filter parameters
   * @throws {ForbiddenError} User lacks permission to view appointments
   *
   * @remarks
   * **TanStack Query Integration**:
   * - Query key: `['appointments', 'list', filters]`
   * - Cache time: 5 minutes
   * - Stale time: 1 minute
   * - Invalidate on: appointment creation, update, cancellation
   *
   * **Real-time Updates**:
   * - Socket.io event: `appointment:updated` triggers query invalidation
   * - Optimistic updates for local changes
   * - Background refetch on window focus
   *
   * **RBAC Enforcement**:
   * - Nurses see only their own appointments unless admin
   * - Admins see all appointments in their school/district
   * - Parents see only their children's appointments
   *
   * @example
   * ```typescript
   * // Get today's scheduled appointments for a nurse
   * const today = new Date().toISOString().split('T')[0];
   * const { data, pagination } = await appointmentsApi.getAll({
   *   startDate: today,
   *   endDate: today,
   *   nurseId: currentNurse.id,
   *   status: 'SCHEDULED',
   *   page: 1,
   *   limit: 20
   * });
   *
   * // Use with TanStack Query
   * const { data, isLoading } = useQuery({
   *   queryKey: ['appointments', 'list', filters],
   *   queryFn: () => appointmentsApi.getAll(filters)
   * });
   * ```
   *
   * @see {@link getById} for retrieving single appointment details
   * @see {@link getUpcoming} for upcoming appointments without pagination
   */
  async getAll(filters?: AppointmentFilters): Promise<PaginatedResponse<Appointment>> {
    try {
      const params = filters ? `?${buildUrlParams(filters).toString()}` : ''
      const response = await this.client.get<PaginatedResponse<Appointment>>(`/appointments${params}`)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  /**
   * Create a new appointment with conflict detection and notifications
   *
   * Creates appointment with automatic conflict checking, waitlist processing,
   * and parent notification. Validates nurse availability and student scheduling.
   *
   * @param {CreateAppointmentData} appointmentData - Appointment creation data
   * @param {string} appointmentData.studentId - Student UUID (required)
   * @param {string} appointmentData.nurseId - Nurse UUID (required)
   * @param {AppointmentType} appointmentData.type - Appointment type (CHECKUP, MEDICATION, INJURY, etc.)
   * @param {string} appointmentData.scheduledAt - ISO 8601 datetime for appointment
   * @param {number} appointmentData.duration - Duration in minutes (default: 30)
   * @param {string} [appointmentData.reason] - Reason for appointment (optional)
   * @param {AppointmentPriority} [appointmentData.priority] - Priority level (default: NORMAL)
   * @returns {Promise<{appointment: Appointment}>} Created appointment with generated ID
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
   * **Real-time Notifications**:
   * - Socket.io event: `appointment:created` emitted to relevant users
   * - Notification channels: Nurse dashboard, student view, parent app
   * - Query invalidation: Invalidates appointment list and calendar queries
   *
   * **TanStack Query Optimistic Updates**:
   * ```typescript
   * useMutation({
   *   mutationFn: appointmentsApi.create,
   *   onMutate: async (newAppt) => {
   *     // Optimistically add to UI
   *     await queryClient.cancelQueries(['appointments', 'list'])
   *     const previous = queryClient.getQueryData(['appointments', 'list'])
   *     queryClient.setQueryData(['appointments', 'list'], old => [...old, newAppt])
   *     return { previous }
   *   },
   *   onError: (err, variables, context) => {
   *     // Rollback on error
   *     queryClient.setQueryData(['appointments', 'list'], context.previous)
   *   },
   *   onSuccess: () => {
   *     // Invalidate to refetch with server data
   *     queryClient.invalidateQueries(['appointments'])
   *   }
   * })
   * ```
   *
   * **Audit Trail**:
   * - Action logged: APPOINTMENT_CREATED
   * - PHI access: Student and nurse information
   * - Retention: 7 years for HIPAA compliance
   *
   * @example
   * ```typescript
   * // Create routine checkup appointment
   * const { appointment } = await appointmentsApi.create({
   *   studentId: 'student-uuid-123',
   *   nurseId: 'nurse-uuid-456',
   *   type: 'CHECKUP',
   *   scheduledAt: '2025-01-15T10:00:00Z',
   *   duration: 30,
   *   reason: 'Annual health screening',
   *   priority: 'NORMAL'
   * });
   *
   * // Create urgent medication administration appointment
   * const { appointment: urgentAppt } = await appointmentsApi.create({
   *   studentId: 'student-uuid-789',
   *   nurseId: 'nurse-uuid-456',
   *   type: 'MEDICATION',
   *   scheduledAt: new Date(Date.now() + 3600000).toISOString(), // 1 hour from now
   *   duration: 15,
   *   reason: 'Emergency inhaler administration',
   *   priority: 'URGENT'
   * });
   * // Note: URGENT priority triggers immediate parent notification
   * ```
   *
   * @see {@link checkConflicts} to check for scheduling conflicts before creating
   * @see {@link addToWaitlist} to add student to waitlist if slot unavailable
   * @see {@link scheduleReminder} to schedule custom reminders
   */
  async create(appointmentData: CreateAppointmentData): Promise<{ appointment: Appointment }> {
    try {
      const response = await this.client.post<{ appointment: Appointment }>('/appointments', appointmentData)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  /**
   * Update an existing appointment
   */
  async update(id: string, data: UpdateAppointmentData): Promise<{ appointment: Appointment }> {
    try {
      const response = await this.client.put(`/appointments/${id}`, data)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  /**
   * Cancel an appointment with automatic notifications and waitlist processing
   *
   * Cancels appointment, notifies affected parties, and offers slot to waitlisted
   * students. Updates appointment status and triggers cleanup workflows.
   *
   * @param {string} id - Appointment UUID to cancel
   * @param {string} [reason] - Optional cancellation reason for audit trail
   * @returns {Promise<{appointment: Appointment}>} Cancelled appointment with updated status
   * @throws {NotFoundError} Appointment not found
   * @throws {ForbiddenError} User lacks permission to cancel appointment
   * @throws {InvalidOperationError} Cannot cancel completed or already-cancelled appointment
   *
   * @remarks
   * **Automated Workflows**:
   * - Status update: Changes status to CANCELLED
   * - Notification: Sends cancellation notification to student/parent and nurse
   * - Waitlist processing: Offers slot to next waitlisted student if applicable
   * - Reminder cancellation: Cancels all pending reminders for this appointment
   * - Calendar update: Updates nurse availability calendar
   *
   * **Real-time Notifications**:
   * - Socket.io event: `appointment:cancelled` with appointment ID and reason
   * - Notification recipients: Nurse, student, parent (if configured)
   * - Query invalidation: Updates all appointment-related queries
   *
   * **Waitlist Integration**:
   * - If cancellation creates available slot, notifies next waitlist entry
   * - Waitlist entry receives notification with booking link
   * - Time-limited offer (default: 2 hours to accept)
   *
   * **Audit Trail**:
   * - Action logged: APPOINTMENT_CANCELLED with reason
   * - Cancellation tracking for no-show rate statistics
   * - Retention: 7 years for compliance
   *
   * @example
   * ```typescript
   * // Cancel with reason
   * const { appointment } = await appointmentsApi.cancel(
   *   'appointment-uuid-123',
   *   'Student absent from school'
   * );
   *
   * // Cancel and handle waitlist notification
   * const { appointment: cancelled } = await appointmentsApi.cancel(
   *   'appointment-uuid-456',
   *   'Nurse emergency - rescheduling required'
   * );
   * // System automatically notifies next waitlisted student
   *
   * // Use with TanStack Query mutation
   * const { mutate: cancelAppointment } = useMutation({
   *   mutationFn: ({ id, reason }) => appointmentsApi.cancel(id, reason),
   *   onSuccess: () => {
   *     queryClient.invalidateQueries(['appointments'])
   *     queryClient.invalidateQueries(['waitlist'])
   *     toast.success('Appointment cancelled successfully')
   *   }
   * });
   * ```
   *
   * @see {@link reschedule} to reschedule instead of cancelling
   * @see {@link getWaitlist} to view waitlisted students
   * @see {@link notifyWaitlistEntry} to manually notify waitlist entry
   */
  async cancel(id: string, reason?: string): Promise<{ appointment: Appointment }> {
    try {
      const response = await this.client.put(`/appointments/${id}/cancel`, { reason })
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  /**
   * Mark appointment as no-show
   */
  async markNoShow(id: string): Promise<{ appointment: Appointment }> {
    try {
      const response = await this.client.put(`/appointments/${id}/no-show`, {})
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  /**
   * Get available time slots for a nurse
   */
  async getAvailability(nurseId: string, date?: string, duration?: number): Promise<{ slots: AvailabilitySlot[] }> {
    try {
      const params = new URLSearchParams()
      if (date) params.append('date', date)
      if (duration) params.append('duration', String(duration))
      
      const response = await this.client.get(`/appointments/availability/${nurseId}?${params.toString()}`)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  /**
   * Get upcoming appointments for a nurse
   */
  async getUpcoming(nurseId: string, limit?: number): Promise<{ appointments: Appointment[] }> {
    try {
      const params = limit ? `?limit=${limit}` : ''
      const response = await this.client.get(`/appointments/upcoming/${nurseId}${params}`)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  /**
   * Get appointment statistics
   */
  async getStatistics(filters?: {
    nurseId?: string
    dateFrom?: string
    dateTo?: string
  }): Promise<AppointmentStatistics> {
    try {
      const params = filters ? `?${buildUrlParams(filters).toString()}` : ''
      const response = await this.client.get(`/appointments/statistics${params}`)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  /**
   * Create recurring appointments
   */
  async createRecurring(data: RecurringAppointmentData): Promise<{ appointments: Appointment[]; count: number }> {
    try {
      const response = await this.client.post('/appointments/recurring', data)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  // Nurse Availability Management
  /**
   * Set nurse availability
   */
  async setAvailability(data: NurseAvailabilityData): Promise<{ availability: NurseAvailability }> {
    try {
      const response = await this.client.post('/appointments/availability', data)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  /**
   * Get nurse availability schedule
   */
  async getNurseAvailability(nurseId: string, date?: string): Promise<{ availability: NurseAvailability[] }> {
    try {
      const params = date ? `?date=${date}` : ''
      const response = await this.client.get(`/appointments/availability/nurse/${nurseId}${params}`)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  /**
   * Update nurse availability
   */
  async updateAvailability(id: string, data: Partial<NurseAvailabilityData>): Promise<{ availability: NurseAvailability }> {
    try {
      const response = await this.client.put(`/appointments/availability/${id}`, data)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  /**
   * Delete nurse availability
   */
  async deleteAvailability(id: string): Promise<void> {
    try {
      await this.client.delete(`/appointments/availability/${id}`)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  // Waitlist Management
  /**
   * Add student to appointment waitlist
   */
  async addToWaitlist(data: {
    studentId: string
    nurseId?: string
    type: string
    reason: string
    priority?: string
    preferredDate?: string
    duration?: number
    notes?: string
  }): Promise<{ entry: AppointmentWaitlist }> {
    try {
      const response = await this.client.post('/appointments/waitlist', data)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  /**
   * Get appointment waitlist
   */
  async getWaitlist(filters?: WaitlistFilters): Promise<{ waitlist: AppointmentWaitlist[] }> {
    try {
      const params = filters ? `?${buildUrlParams(filters).toString()}` : ''
      const response = await this.client.get(`/appointments/waitlist${params}`)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  /**
   * Remove student from waitlist
   */
  async removeFromWaitlist(id: string, reason?: string): Promise<{ entry: AppointmentWaitlist }> {
    try {
      const response = await this.client.delete(`/appointments/waitlist/${id}`, {
        data: { reason }
      })
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  // Calendar Export
  /**
   * Export nurse calendar
   */
  async exportCalendar(nurseId: string, dateFrom?: string, dateTo?: string): Promise<Blob> {
    try {
      const params = new URLSearchParams()
      if (dateFrom) params.append('dateFrom', dateFrom)
      if (dateTo) params.append('dateTo', dateTo)

      const response = await this.client.get(`/appointments/calendar/${nurseId}?${params.toString()}`, {
        responseType: 'blob'
      })
      return response.data
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  // Reminder Management
  /**
   * Process pending appointment reminders with multi-channel delivery
   *
   * Processes all reminders scheduled for delivery, supporting email, SMS, and
   * push notifications. Typically called by scheduled job but can be triggered manually.
   *
   * @returns {Promise<ReminderProcessingResult>} Processing results with success/failure counts
   * @returns {number} result.processed - Total reminders processed
   * @returns {number} result.sent - Successfully sent reminders
   * @returns {number} result.failed - Failed reminders
   * @returns {Array<{reminderId: string, error: string}>} result.errors - Detailed failure information
   * @throws {ForbiddenError} Only admins and system jobs can process reminders
   *
   * @remarks
   * **Processing Logic**:
   * - Queries reminders scheduled for delivery within next 5 minutes
   * - Attempts delivery via configured channels (email, SMS, push)
   * - Retries failed deliveries up to 3 times with exponential backoff
   * - Updates reminder status after processing
   * - Logs all delivery attempts for audit trail
   *
   * **Notification Channels**:
   * - Email: Sent via SendGrid/AWS SES
   * - SMS: Sent via Twilio
   * - Push: Sent via Firebase Cloud Messaging
   * - Priority: Tries all channels, marks success if any succeed
   *
   * **Scheduling Pattern**:
   * - Automated: Runs every 5 minutes via cron job
   * - Manual: Can be triggered for immediate processing
   * - Default reminder time: 24 hours before appointment
   * - Custom reminders: Can be scheduled at any time
   *
   * **Error Handling**:
   * - Individual failures don't stop batch processing
   * - Failed reminders logged with reason
   * - Automatic retry on transient failures
   * - Permanent failures (invalid phone/email) marked as FAILED
   *
   * **Performance**:
   * - Batch size: 100 reminders per execution
   * - Parallel processing: Up to 10 concurrent notifications
   * - Timeout: 30 seconds per reminder
   * - Circuit breaker: Stops after 50% failure rate
   *
   * @example
   * ```typescript
   * // Manual reminder processing (admin only)
   * const result = await appointmentsApi.processPendingReminders();
   * console.log(`Processed ${result.processed} reminders`);
   * console.log(`Success: ${result.sent}, Failed: ${result.failed}`);
   *
   * // Check for errors
   * if (result.failed > 0) {
   *   console.error('Failed reminders:', result.errors);
   *   // Alert admin or retry failures
   * }
   *
   * // Typical cron job usage
   * cron.schedule('0/5 * * * *', async () => {
   *   try {
   *     const result = await appointmentsApi.processPendingReminders();
   *     logger.info('Reminders processed', result);
   *   } catch (error) {
   *     logger.error('Reminder processing failed', error);
   *   }
   * });
   * ```
   *
   * @see {@link scheduleReminder} to create custom reminders
   * @see {@link getAppointmentReminders} to view scheduled reminders
   * @see {@link cancelReminder} to cancel pending reminders
   */
  async processPendingReminders(): Promise<ReminderProcessingResult> {
    try {
      const response = await this.client.post('/appointments/reminders/process')
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  /**
   * Get reminders for a specific appointment
   */
  async getAppointmentReminders(appointmentId: string): Promise<{ reminders: AppointmentReminder[] }> {
    try {
      const response = await this.client.get(`/appointments/${appointmentId}/reminders`)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  /**
   * Schedule custom reminder for appointment
   */
  async scheduleReminder(data: {
    appointmentId: string
    type: string
    scheduleTime: string
    message?: string
  }): Promise<{ reminder: AppointmentReminder }> {
    try {
      const response = await this.client.post('/appointments/reminders', data)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  /**
   * Cancel a scheduled reminder
   */
  async cancelReminder(reminderId: string): Promise<{ reminder: AppointmentReminder }> {
    try {
      const response = await this.client.delete(`/appointments/reminders/${reminderId}`)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  // Conflict Detection
  /**
   * Check for scheduling conflicts
   */
  async checkConflicts(
    nurseId: string,
    startTime: string,
    duration: number,
    excludeAppointmentId?: string
  ): Promise<ConflictCheckResult> {
    try {
      const params = new URLSearchParams({
        nurseId,
        startTime,
        duration: String(duration)
      })
      if (excludeAppointmentId) {
        params.append('excludeAppointmentId', excludeAppointmentId)
      }

      const response = await this.client.get(`/appointments/conflicts?${params.toString()}`)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  // Enhanced Waitlist Management
  /**
   * Add to waitlist with full entry data
   */
  async addToWaitlistFull(data: WaitlistEntryData): Promise<{ entry: AppointmentWaitlist }> {
    try {
      const response = await this.client.post('/appointments/waitlist', data)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  /**
   * Update waitlist entry priority
   */
  async updateWaitlistPriority(
    id: string,
    priority: string
  ): Promise<{ entry: AppointmentWaitlist }> {
    try {
      const response = await this.client.patch(`/appointments/waitlist/${id}`, { priority })
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  /**
   * Get waitlist position for a student
   */
  async getWaitlistPosition(waitlistEntryId: string): Promise<{ position: number; total: number }> {
    try {
      const response = await this.client.get(`/appointments/waitlist/${waitlistEntryId}/position`)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  /**
   * Notify waitlist entry when slot becomes available
   */
  async notifyWaitlistEntry(
    id: string,
    message?: string
  ): Promise<{ entry: AppointmentWaitlist; notification: any }> {
    try {
      const response = await this.client.post(`/appointments/waitlist/${id}/notify`, { message })
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  // Appointment Details
  /**
   * Get single appointment by ID
   */
  async getById(id: string): Promise<{ appointment: Appointment }> {
    try {
      const response = await this.client.get(`/appointments/${id}`)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  /**
   * Complete appointment
   */
  async complete(id: string, data?: {
    notes?: string
    outcomes?: string
    followUpRequired?: boolean
    followUpDate?: string
  }): Promise<{ appointment: Appointment }> {
    try {
      const response = await this.client.put(`/appointments/${id}/complete`, data)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  /**
   * Start appointment (mark as in progress)
   */
  async start(id: string): Promise<{ appointment: Appointment }> {
    try {
      const response = await this.client.put(`/appointments/${id}/start`)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  /**
   * Reschedule appointment
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
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  // Bulk Operations
  /**
   * Cancel multiple appointments
   */
  async cancelMultiple(
    appointmentIds: string[],
    reason?: string
  ): Promise<{ cancelled: number; failed: number }> {
    try {
      const response = await this.client.post('/appointments/bulk/cancel', {
        appointmentIds,
        reason
      })
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  /**
   * Get appointments for multiple students
   */
  async getForStudents(
    studentIds: string[],
    filters?: Partial<AppointmentFilters>
  ): Promise<{ appointments: Appointment[] }> {
    try {
      const params = buildUrlParams({ ...filters, studentIds: studentIds.join(',') })
      const response = await this.client.get(`/appointments/students?${params.toString()}`)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  // Advanced Filtering
  /**
   * Get appointments by date range
   */
  async getByDateRange(
    dateFrom: string,
    dateTo: string,
    nurseId?: string
  ): Promise<{ appointments: Appointment[] }> {
    try {
      const params = buildUrlParams({ dateFrom, dateTo, nurseId })
      const response = await this.client.get(`/appointments/range?${params.toString()}`)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  /**
   * Search appointments
   */
  async search(query: string, filters?: Partial<AppointmentFilters>): Promise<PaginatedResponse<Appointment>> {
    try {
      const params = buildUrlParams({ ...filters, search: query })
      const response = await this.client.get(`/appointments/search?${params.toString()}`)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  // Analytics
  /**
   * Get appointment trends over time
   */
  async getTrends(
    dateFrom: string,
    dateTo: string,
    groupBy: 'day' | 'week' | 'month' = 'day'
  ): Promise<{ trends: any[] }> {
    try {
      const params = new URLSearchParams({ dateFrom, dateTo, groupBy })
      const response = await this.client.get(`/appointments/trends?${params.toString()}`)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  /**
   * Get no-show rate statistics
   */
  async getNoShowStats(
    nurseId?: string,
    dateFrom?: string,
    dateTo?: string
  ): Promise<{
    rate: number
    total: number
    noShows: number
    byStudent: any[]
  }> {
    try {
      const params = buildUrlParams({ nurseId, dateFrom, dateTo })
      const response = await this.client.get(`/appointments/stats/no-show?${params.toString()}`)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  /**
   * Get utilization statistics
   */
  async getUtilizationStats(
    nurseId: string,
    dateFrom: string,
    dateTo: string
  ): Promise<{
    utilizationRate: number
    totalSlots: number
    bookedSlots: number
    availableSlots: number
    byDay: any[]
  }> {
    try {
      const params = new URLSearchParams({ nurseId, dateFrom, dateTo })
      const response = await this.client.get(`/appointments/stats/utilization?${params.toString()}`)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }
}

/**
 * Factory function to create Appointments API instance
 * @param client - ApiClient instance with authentication and resilience patterns
 * @returns Configured AppointmentsApiImpl instance
 */
export function createAppointmentsApi(client: ApiClient): AppointmentsApiImpl {
  return new AppointmentsApiImpl(client);
}

export { AppointmentsApiImpl }
export type { IAppointmentsApi }

// Export singleton instance
import { apiClient } from '@/services/core/ApiClient'
export const appointmentsApi = createAppointmentsApi(apiClient)
