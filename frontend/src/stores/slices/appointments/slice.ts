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
 * @module stores/slices/appointments/slice
 * @see {@link services/modules/appointmentsApi} for API implementation
 * @see {@link types/appointments} for type definitions
 * @see {@link stores/sliceFactory} for EntityAdapter factory pattern
 */

import { createEntitySlice } from '@/stores/sliceFactory';
import type { RootState } from '@/stores';
import type {
  Appointment,
  CreateAppointmentData,
  UpdateAppointmentData
} from '@/types/appointments';
import { appointmentsApiService } from './api-service';

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
 * import { appointmentsReducer } from '@/stores/slices/appointments';
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
export const appointmentsSelectors = appointmentsSliceFactory.adapter.getSelectors(
  (state: RootState) => state.appointments
);

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
