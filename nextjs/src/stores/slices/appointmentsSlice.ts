/**
 * @fileoverview Appointments Redux Slice
 *
 * Comprehensive state management for student appointment scheduling with Redux Toolkit's
 * EntityAdapter pattern. Manages appointment CRUD operations, nurse scheduling, student
 * appointment tracking, and multi-view filtering (by date, status, type, nurse, student).
 * All operations include HIPAA-compliant audit logging for PHI access.
 *
 * **Key Features:**
 * - Appointment CRUD operations with validation
 * - Student appointment scheduling and management
 * - Nurse schedule management and conflict detection
 * - Multi-dimensional filtering (by student, nurse, status, type, date range)
 * - Today's appointments view with real-time updates
 * - Upcoming appointments with configurable lookahead
 * - Appointment status tracking (scheduled, completed, cancelled, no-show)
 * - Reminder integration for notifications
 *
 * **State Management Architecture:**
 * - Redux Toolkit with createEntitySlice factory pattern
 * - EntityAdapter for normalized state with optimized lookups
 * - No localStorage persistence (appointments are transient data)
 * - Real-time synchronization via TanStack Query cache invalidation
 * - Optimistic updates for improved UX
 *
 * **HIPAA Compliance:**
 * - All appointment operations trigger PHI access audit logs
 * - Appointment data contains student PHI (reason, notes)
 * - Audit logging includes appointment type, reason visibility
 * - No caching of appointment details in localStorage
 * - Nurse access to student appointments is role-based
 * - Cancellation reasons are logged for compliance
 *
 * **Appointment Scheduling Workflows:**
 * - **New Appointment**: Student selection → date/time → type → reason → nurse assignment
 * - **Rescheduling**: Load appointment → modify date/time → conflict check → update
 * - **Cancellation**: Select appointment → reason → notify student/parent → audit log
 * - **Completion**: Mark complete → add notes → record outcomes → update student record
 * - **No-Show**: Mark no-show → follow-up required → parent notification
 *
 * **TanStack Query Integration:**
 * - Appointments list: 2-minute cache, invalidate on create/update/cancel
 * - Student appointments: 1-minute cache, invalidate on student-specific changes
 * - Today's appointments: 30-second cache, real-time polling
 * - Upcoming appointments: 2-minute cache
 * - Appointment details: 1-minute cache, invalidate on update
 *
 * **Nurse Scheduling Features:**
 * - View all appointments by nurse
 * - Conflict detection for double-booking prevention
 * - Daily schedule view with time blocks
 * - Workload balancing across nurses
 * - Appointment type tracking (routine, urgent, follow-up)
 *
 * @module pages/appointments/store/appointmentsSlice
 * @see {@link services/modules/appointmentsApi} for API implementation
 * @see {@link types/appointments} for type definitions
 * @see {@link stores/sliceFactory} for EntityAdapter factory pattern
 */

import { createEntitySlice, EntityApiService } from '../../stores/sliceFactory';
import { appointmentsApi } from '../../services/api';
import type {
  Appointment,
  AppointmentFilters,
  CreateAppointmentData,
  UpdateAppointmentData
} from '../../types/appointments';

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
const appointmentsApiService: EntityApiService<Appointment, CreateAppointmentData, UpdateAppointmentData> = {
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
    const response = await appointmentsApi.getAll(params as AppointmentFilters);
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
    const response = await appointmentsApi.getById(id);
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
    const response = await appointmentsApi.create(data);
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
    const response = await appointmentsApi.update(id, data);
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
    await appointmentsApi.cancel(id, 'Deleted');
    return { success: true };
  },
};

/**
 * Create the appointments slice using the entity factory
 *
 * Uses createEntitySlice factory to generate a Redux slice with EntityAdapter
 * for normalized state management. Automatically creates standard CRUD thunks,
 * actions, and selectors.
 *
 * @constant {Object} appointmentsSliceFactory
 *
 * @remarks
 * **Factory Configuration**:
 * - Name: 'appointments'
 * - EntityAdapter: Normalized appointments by ID
 * - Bulk Operations: Disabled (appointments managed individually)
 * - Optimistic Updates: Enabled for create/update/delete
 *
 * **Generated Thunks**:
 * - fetchAll: Load all appointments with filters
 * - fetchById: Load single appointment
 * - createEntity: Create new appointment
 * - updateEntity: Update appointment
 * - deleteEntity: Delete (cancel) appointment
 *
 * **Generated Actions**:
 * - setAll, setOne, addOne, updateOne, removeOne
 * - Standard EntityAdapter actions
 *
 * **Generated Selectors**:
 * - selectAll, selectById, selectIds, selectEntities
 * - selectTotal (entity count)
 */
const appointmentsSliceFactory = createEntitySlice<Appointment, CreateAppointmentData, UpdateAppointmentData>(
  'appointments',
  appointmentsApiService,
  {
    enableBulkOperations: false,
  }
);

/**
 * Appointments Redux slice
 *
 * @constant {Slice} appointmentsSlice
 * @see {@link createEntitySlice} for factory implementation
 */
export const appointmentsSlice = appointmentsSliceFactory.slice;

/**
 * Appointments reducer for Redux store
 *
 * @constant {Reducer} appointmentsReducer
 * @example
 * ```typescript
 * // In store configuration
 * import { appointmentsReducer } from './pages/appointments/store/appointmentsSlice';
 *
 * const store = configureStore({
 *   reducer: {
 *     appointments: appointmentsReducer,
 *   },
 * });
 * ```
 */
export const appointmentsReducer = appointmentsSlice.reducer;

/**
 * Appointments actions (standard EntityAdapter actions)
 *
 * @constant {Object} appointmentsActions
 * @property {Action} setAll - Replace all appointments
 * @property {Action} setOne - Set single appointment
 * @property {Action} addOne - Add single appointment
 * @property {Action} updateOne - Update single appointment
 * @property {Action} removeOne - Remove single appointment
 */
export const appointmentsActions = appointmentsSliceFactory.actions;

/**
 * Standard EntityAdapter selectors
 *
 * @constant {Object} appointmentsSelectors
 * @property {Function} selectAll - Select all appointments
 * @property {Function} selectById - Select appointment by ID
 * @property {Function} selectIds - Select all appointment IDs
 * @property {Function} selectEntities - Select appointments dictionary
 * @property {Function} selectTotal - Select total count
 */
export const appointmentsSelectors = appointmentsSliceFactory.adapter.getSelectors((state: any) => state.appointments);

/**
 * Appointments async thunks for API operations
 *
 * @constant {Object} appointmentsThunks
 * @property {AsyncThunk} fetchAll - Fetch all appointments with filters
 * @property {AsyncThunk} fetchById - Fetch single appointment
 * @property {AsyncThunk} createEntity - Create new appointment
 * @property {AsyncThunk} updateEntity - Update appointment
 * @property {AsyncThunk} deleteEntity - Delete (cancel) appointment
 */
export const appointmentsThunks = appointmentsSliceFactory.thunks;

// ============================================================================
// Custom Selectors
// ============================================================================

/**
 * Select all appointments for a specific student
 *
 * Filters appointments by student ID. Used in student detail view to show
 * appointment history and upcoming appointments for a single student.
 *
 * @function selectAppointmentsByStudent
 *
 * @param {any} state - Redux root state
 * @param {string} studentId - Student UUID to filter by
 *
 * @returns {Appointment[]} Filtered appointments for the student
 *
 * @example
 * ```typescript
 * // In a component
 * import { useSelector } from 'react-redux';
 * import { selectAppointmentsByStudent } from '@/pages/appointments/store/appointmentsSlice';
 *
 * const StudentAppointments = ({ studentId }) => {
 *   const appointments = useSelector(state =>
 *     selectAppointmentsByStudent(state, studentId)
 *   );
 *
 *   return <AppointmentList appointments={appointments} />;
 * };
 * ```
 *
 * @remarks
 * **Performance**: O(n) filter operation on all appointments
 * **Memoization**: Consider using reselect for frequently accessed data
 * **HIPAA**: Ensure user has permission to view student's appointments
 */
export const selectAppointmentsByStudent = (state: any, studentId: string): Appointment[] => {
  const allAppointments = appointmentsSelectors.selectAll(state) as Appointment[];
  return allAppointments.filter(appointment => appointment.studentId === studentId);
};

/**
 * Select all appointments for a specific nurse
 *
 * Filters appointments by nurse ID. Used in nurse schedule view to show
 * daily/weekly schedule and workload for a single nurse.
 *
 * @function selectAppointmentsByNurse
 *
 * @param {any} state - Redux root state
 * @param {string} nurseId - Nurse UUID to filter by
 *
 * @returns {Appointment[]} Filtered appointments for the nurse
 *
 * @example
 * ```typescript
 * // Nurse schedule component
 * const NurseSchedule = ({ nurseId }) => {
 *   const appointments = useSelector(state =>
 *     selectAppointmentsByNurse(state, nurseId)
 *   );
 *
 *   return (
 *     <ScheduleCalendar
 *       appointments={appointments}
 *       nurseId={nurseId}
 *     />
 *   );
 * };
 * ```
 *
 * @remarks
 * **Use Case**: Daily nurse schedule, workload balancing
 * **Sorting**: Appointments not sorted by this selector (sort in component)
 * **Conflict Detection**: Use with date filters to check for overlaps
 */
export const selectAppointmentsByNurse = (state: any, nurseId: string): Appointment[] => {
  const allAppointments = appointmentsSelectors.selectAll(state) as Appointment[];
  return allAppointments.filter(appointment => appointment.nurseId === nurseId);
};

/**
 * Select all appointments with a specific status
 *
 * Filters appointments by status (scheduled, completed, cancelled, no-show).
 * Used for status-based views and reporting.
 *
 * @function selectAppointmentsByStatus
 *
 * @param {any} state - Redux root state
 * @param {string} status - Status to filter by (scheduled, completed, cancelled, no-show)
 *
 * @returns {Appointment[]} Filtered appointments with the specified status
 *
 * @example
 * ```typescript
 * // Completed appointments view
 * const CompletedAppointments = () => {
 *   const completed = useSelector(state =>
 *     selectAppointmentsByStatus(state, 'completed')
 *   );
 *
 *   return <AppointmentHistory appointments={completed} />;
 * };
 * ```
 *
 * @example
 * ```typescript
 * // No-show follow-up list
 * const NoShowFollowUp = () => {
 *   const noShows = useSelector(state =>
 *     selectAppointmentsByStatus(state, 'no-show')
 *   );
 *
 *   return <FollowUpList appointments={noShows} requiresAction />;
 * };
 * ```
 *
 * @remarks
 * **Status Values**: 'scheduled', 'completed', 'cancelled', 'no-show'
 * **Reporting**: Used for appointment completion rates
 * **Follow-Up**: No-shows require parent notification
 */
export const selectAppointmentsByStatus = (state: any, status: string): Appointment[] => {
  const allAppointments = appointmentsSelectors.selectAll(state) as Appointment[];
  return allAppointments.filter(appointment => appointment.status === status);
};

/**
 * Select today's appointments sorted by time
 *
 * Filters appointments scheduled for today (midnight to midnight) and sorts
 * them chronologically. Used for daily nurse schedule and dashboard.
 *
 * @function selectTodaysAppointments
 *
 * @param {any} state - Redux root state
 *
 * @returns {Appointment[]} Today's appointments sorted by scheduledAt time
 *
 * @example
 * ```typescript
 * // Dashboard today's schedule
 * const DashboardSchedule = () => {
 *   const todaysAppointments = useSelector(selectTodaysAppointments);
 *
 *   return (
 *     <DailySchedule
 *       appointments={todaysAppointments}
 *       date={new Date()}
 *     />
 *   );
 * };
 * ```
 *
 * @example
 * ```typescript
 * // Check for upcoming appointments in next hour
 * const todaysAppointments = selectTodaysAppointments(state);
 * const now = new Date();
 * const nextHour = new Date(now.getTime() + 60 * 60 * 1000);
 * const upcoming = todaysAppointments.filter(appt =>
 *   new Date(appt.scheduledAt) >= now &&
 *   new Date(appt.scheduledAt) <= nextHour
 * );
 * ```
 *
 * @remarks
 * **Time Range**: Midnight to midnight in local timezone
 * **Sorting**: Chronologically sorted by scheduledAt
 * **Real-Time**: Consider polling every 30 seconds for accurate dashboard
 * **Performance**: Recalculates on every state change (consider memoization)
 */
export const selectTodaysAppointments = (state: any): Appointment[] => {
  const allAppointments = appointmentsSelectors.selectAll(state) as Appointment[];
  const today = new Date();
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const todayEnd = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

  return allAppointments.filter(appointment => {
    const appointmentDate = new Date(appointment.scheduledAt);
    return appointmentDate >= todayStart && appointmentDate < todayEnd;
  }).sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime());
};

/**
 * Select upcoming appointments within specified days
 *
 * Filters appointments from now until N days in the future, sorted chronologically.
 * Used for appointment reminders, nurse planning, and upcoming schedule views.
 *
 * @function selectUpcomingAppointments
 *
 * @param {any} state - Redux root state
 * @param {number} [days=7] - Number of days to look ahead (default: 7)
 *
 * @returns {Appointment[]} Upcoming appointments sorted by scheduledAt time
 *
 * @example
 * ```typescript
 * // Next 7 days appointments (default)
 * const UpcomingWeek = () => {
 *   const upcoming = useSelector(state =>
 *     selectUpcomingAppointments(state)
 *   );
 *
 *   return <AppointmentList appointments={upcoming} showCountdown />;
 * };
 * ```
 *
 * @example
 * ```typescript
 * // Next 24 hours appointments
 * const NextDayAppointments = () => {
 *   const tomorrow = useSelector(state =>
 *     selectUpcomingAppointments(state, 1)
 *   );
 *
 *   return <ReminderList appointments={tomorrow} urgent />;
 * };
 * ```
 *
 * @example
 * ```typescript
 * // Next 30 days for monthly view
 * const MonthlySchedule = () => {
 *   const monthAhead = useSelector(state =>
 *     selectUpcomingAppointments(state, 30)
 *   );
 *
 *   return <MonthCalendar appointments={monthAhead} />;
 * };
 * ```
 *
 * @remarks
 * **Time Range**: From current moment to N days ahead
 * **Sorting**: Chronologically sorted by scheduledAt
 * **Reminders**: Send reminders 24 hours before appointment
 * **Planning**: Used for nurse schedule planning and workload projection
 * **Default**: 7-day lookahead is standard for weekly views
 */
export const selectUpcomingAppointments = (state: any, days: number = 7): Appointment[] => {
  const allAppointments = appointmentsSelectors.selectAll(state) as Appointment[];
  const now = new Date();
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + days);

  return allAppointments.filter(appointment => {
    const appointmentDate = new Date(appointment.scheduledAt);
    return appointmentDate >= now && appointmentDate <= futureDate;
  }).sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime());
};

/**
 * Select all appointments of a specific type
 *
 * Filters appointments by type (routine checkup, health screening, medication review, etc.).
 * Used for type-specific reporting and analysis.
 *
 * @function selectAppointmentsByType
 *
 * @param {any} state - Redux root state
 * @param {string} type - Appointment type to filter by
 *
 * @returns {Appointment[]} Filtered appointments of the specified type
 *
 * @example
 * ```typescript
 * // Health screening appointments
 * const HealthScreenings = () => {
 *   const screenings = useSelector(state =>
 *     selectAppointmentsByType(state, 'Health Screening')
 *   );
 *
 *   return <ScreeningReport appointments={screenings} />;
 * };
 * ```
 *
 * @example
 * ```typescript
 * // Medication review appointments
 * const MedicationReviews = () => {
 *   const reviews = useSelector(state =>
 *     selectAppointmentsByType(state, 'Medication Review')
 *   );
 *
 *   return <ReviewList appointments={reviews} />;
 * };
 * ```
 *
 * @remarks
 * **Common Types**:
 * - 'Health Screening': Annual health screenings
 * - 'Medication Review': Medication check-ins
 * - 'Illness Visit': Acute illness visits
 * - 'Injury Assessment': Injury evaluations
 * - 'Follow-Up': Follow-up appointments
 * - 'Routine Checkup': General wellness checks
 *
 * **Reporting**: Used for appointment type analytics
 * **Scheduling**: Helps balance different appointment types
 */
export const selectAppointmentsByType = (state: any, type: string): Appointment[] => {
  const allAppointments = appointmentsSelectors.selectAll(state) as Appointment[];
  return allAppointments.filter(appointment => appointment.type === type);
};
