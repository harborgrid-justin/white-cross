/**
 * @fileoverview Appointments Custom Selectors
 *
 * Advanced selector functions for filtering and querying appointments from Redux state.
 * All selectors are type-safe and optimized for performance with the EntityAdapter pattern.
 *
 * **Selector Categories:**
 * - **Entity Selectors**: Filter by student, nurse, status, type
 * - **Time-Based Selectors**: Today's appointments, upcoming appointments
 * - **Aggregation Selectors**: Count, statistics, analytics
 *
 * **Performance Considerations:**
 * - All selectors perform O(n) filtering operations
 * - Consider using reselect for memoization in frequently accessed selectors
 * - Time-based selectors recalculate on every state change
 *
 * **Type Safety:**
 * - All selectors use RootState for type-safe state access
 * - Return types are explicitly annotated
 * - No 'any' types used for maximum type safety
 *
 * @module stores/slices/appointments/selectors
 */

import type { RootState } from '@/stores';
import type { Appointment } from '@/types/appointments';
import { appointmentsSelectors } from './slice';

/**
 * Select all appointments for a specific student
 *
 * Filters appointments by student ID. Used in student detail view to show
 * appointment history and upcoming appointments for a single student.
 *
 * @function selectAppointmentsByStudent
 *
 * @param {RootState} state - Redux root state
 * @param {string} studentId - Student UUID to filter by
 *
 * @returns {Appointment[]} Filtered appointments for the student
 *
 * @example
 * ```typescript
 * // In a component
 * import { useSelector } from 'react-redux';
 * import { selectAppointmentsByStudent } from '@/stores/slices/appointments';
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
export const selectAppointmentsByStudent = (state: RootState, studentId: string): Appointment[] => {
  const allAppointments = appointmentsSelectors.selectAll(state);
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
 * @param {RootState} state - Redux root state
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
export const selectAppointmentsByNurse = (state: RootState, nurseId: string): Appointment[] => {
  const allAppointments = appointmentsSelectors.selectAll(state);
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
 * @param {RootState} state - Redux root state
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
export const selectAppointmentsByStatus = (state: RootState, status: string): Appointment[] => {
  const allAppointments = appointmentsSelectors.selectAll(state);
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
 * @param {RootState} state - Redux root state
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
export const selectTodaysAppointments = (state: RootState): Appointment[] => {
  const allAppointments = appointmentsSelectors.selectAll(state);
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
 * @param {RootState} state - Redux root state
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
export const selectUpcomingAppointments = (state: RootState, days: number = 7): Appointment[] => {
  const allAppointments = appointmentsSelectors.selectAll(state);
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
 * @param {RootState} state - Redux root state
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
export const selectAppointmentsByType = (state: RootState, type: string): Appointment[] => {
  const allAppointments = appointmentsSelectors.selectAll(state);
  return allAppointments.filter(appointment => appointment.type === type);
};
