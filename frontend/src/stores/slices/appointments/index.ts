/**
 * @fileoverview Appointments Store - Module Index
 *
 * Unified interface for appointments state management. Provides comprehensive
 * appointment scheduling, tracking, and management functionality with HIPAA-compliant
 * audit logging.
 *
 * @module stores/slices/appointments
 */

// ==========================================
// REDUCER
// ==========================================

/**
 * Export main reducer
 */
export { appointmentsReducer } from './slice';

// ==========================================
// ACTIONS
// ==========================================

/**
 * Export all actions (EntityAdapter standard actions)
 */
export { appointmentsActions } from './slice';

// ==========================================
// THUNKS
// ==========================================

/**
 * Export all async thunks
 */
export { appointmentsThunks } from './slice';

// ==========================================
// SELECTORS
// ==========================================

/**
 * Export basic EntityAdapter selectors
 */
export { appointmentsSelectors } from './slice';

/**
 * Export custom selectors
 */
export {
  selectAppointmentsByStudent,
  selectAppointmentsByNurse,
  selectAppointmentsByStatus,
  selectTodaysAppointments,
  selectUpcomingAppointments,
  selectAppointmentsByType,
} from './selectors';

// ==========================================
// RE-EXPORT DOMAIN TYPES
// ==========================================

/**
 * Re-export domain types for convenience
 */
export type {
  Appointment,
  AppointmentFilters,
  CreateAppointmentData,
  UpdateAppointmentData,
} from '@/types/appointments';

// ==========================================
// USAGE DOCUMENTATION
// ==========================================

/**
 * Pre-configured appointments slice for Redux store integration
 *
 * @example
 * ```typescript
 * import { configureStore } from '@reduxjs/toolkit';
 * import { appointmentsReducer } from '@/stores/slices/appointments';
 *
 * const store = configureStore({
 *   reducer: {
 *     appointments: appointmentsReducer,
 *     // other reducers...
 *   },
 * });
 * ```
 */

/**
 * Usage examples for common operations
 *
 * @example
 * ```typescript
 * import { useSelector, useDispatch } from 'react-redux';
 * import {
 *   appointmentsThunks,
 *   appointmentsSelectors,
 *   selectTodaysAppointments,
 *   selectAppointmentsByStudent,
 *   type Appointment,
 *   type CreateAppointmentData
 * } from '@/stores/slices/appointments';
 *
 * function AppointmentsList() {
 *   const dispatch = useDispatch();
 *   const appointments = useSelector(appointmentsSelectors.selectAll);
 *   const todaysAppointments = useSelector(selectTodaysAppointments);
 *
 *   // Fetch appointments on component mount
 *   useEffect(() => {
 *     dispatch(appointmentsThunks.fetchAll());
 *   }, [dispatch]);
 *
 *   // Create new appointment
 *   const handleCreateAppointment = async (data: CreateAppointmentData) => {
 *     try {
 *       await dispatch(appointmentsThunks.createEntity(data)).unwrap();
 *       toast.success('Appointment created successfully');
 *     } catch (error) {
 *       toast.error('Failed to create appointment');
 *     }
 *   };
 *
 *   return (
 *     <div>
 *       <h2>Today's Appointments ({todaysAppointments.length})</h2>
 *       {todaysAppointments.map(appointment => (
 *         <AppointmentCard key={appointment.id} appointment={appointment} />
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 */

/**
 * Advanced selector usage examples
 *
 * @example
 * ```typescript
 * import { useSelector } from 'react-redux';
 * import {
 *   selectAppointmentsByNurse,
 *   selectAppointmentsByStatus,
 *   selectUpcomingAppointments,
 *   selectAppointmentsByType
 * } from '@/stores/slices/appointments';
 *
 * function NurseScheduleDashboard({ nurseId }: { nurseId: string }) {
 *   // Get all appointments for a specific nurse
 *   const nurseAppointments = useSelector(state =>
 *     selectAppointmentsByNurse(state, nurseId)
 *   );
 *
 *   // Get upcoming appointments for the next 7 days
 *   const upcomingAppointments = useSelector(state =>
 *     selectUpcomingAppointments(state, 7)
 *   );
 *
 *   // Get completed appointments
 *   const completedAppointments = useSelector(state =>
 *     selectAppointmentsByStatus(state, 'completed')
 *   );
 *
 *   // Get health screening appointments
 *   const healthScreenings = useSelector(state =>
 *     selectAppointmentsByType(state, 'Health Screening')
 *   );
 *
 *   return (
 *     <div className="dashboard">
 *       <div className="stats-cards">
 *         <StatsCard
 *           title="My Appointments"
 *           count={nurseAppointments.length}
 *         />
 *         <StatsCard
 *           title="Upcoming (7 days)"
 *           count={upcomingAppointments.length}
 *         />
 *         <StatsCard
 *           title="Completed"
 *           count={completedAppointments.length}
 *         />
 *         <StatsCard
 *           title="Health Screenings"
 *           count={healthScreenings.length}
 *         />
 *       </div>
 *     </div>
 *   );
 * }
 * ```
 */

/**
 * Student appointments usage example
 *
 * @example
 * ```typescript
 * import { useSelector, useDispatch } from 'react-redux';
 * import {
 *   selectAppointmentsByStudent,
 *   appointmentsThunks,
 *   type UpdateAppointmentData
 * } from '@/stores/slices/appointments';
 *
 * function StudentAppointmentHistory({ studentId }: { studentId: string }) {
 *   const dispatch = useDispatch();
 *
 *   // Get all appointments for this student
 *   const studentAppointments = useSelector(state =>
 *     selectAppointmentsByStudent(state, studentId)
 *   );
 *
 *   // Sort by date (most recent first)
 *   const sortedAppointments = [...studentAppointments].sort((a, b) =>
 *     new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime()
 *   );
 *
 *   // Reschedule appointment
 *   const handleReschedule = async (appointmentId: string, newDate: string) => {
 *     try {
 *       const updateData: UpdateAppointmentData = {
 *         scheduledAt: newDate,
 *         notes: 'Rescheduled by nurse'
 *       };
 *       await dispatch(appointmentsThunks.updateEntity({ id: appointmentId, data: updateData })).unwrap();
 *       toast.success('Appointment rescheduled successfully');
 *     } catch (error) {
 *       toast.error('Failed to reschedule appointment');
 *     }
 *   };
 *
 *   return (
 *     <div className="appointment-history">
 *       <h3>Appointment History</h3>
 *       {sortedAppointments.map(appointment => (
 *         <AppointmentHistoryCard
 *           key={appointment.id}
 *           appointment={appointment}
 *           onReschedule={handleReschedule}
 *         />
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 */

/**
 * Error handling pattern
 *
 * @example
 * ```typescript
 * import { useDispatch } from 'react-redux';
 * import {
 *   appointmentsThunks,
 *   type CreateAppointmentData
 * } from '@/stores/slices/appointments';
 *
 * function CreateAppointmentForm() {
 *   const dispatch = useDispatch();
 *   const [error, setError] = useState<string | null>(null);
 *   const [isLoading, setIsLoading] = useState(false);
 *
 *   // Handle form submission
 *   const handleSubmit = async (formData: CreateAppointmentData) => {
 *     try {
 *       setError(null);
 *       setIsLoading(true);
 *
 *       // Create appointment
 *       await dispatch(appointmentsThunks.createEntity(formData)).unwrap();
 *
 *       // Success - navigate or show success message
 *       toast.success('Appointment created successfully');
 *       navigate('/appointments');
 *     } catch (err) {
 *       // Handle error
 *       const errorMessage = err instanceof Error ? err.message : 'Failed to create appointment';
 *       setError(errorMessage);
 *       toast.error(errorMessage);
 *     } finally {
 *       setIsLoading(false);
 *     }
 *   };
 *
 *   // Render form with error display and loading state
 *   return <AppointmentForm onSubmit={handleSubmit} error={error} isLoading={isLoading} />;
 * }
 * ```
 */
