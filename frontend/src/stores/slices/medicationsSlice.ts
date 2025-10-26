/**
 * @fileoverview Medications Redux Slice for White Cross Healthcare Platform
 *
 * Manages medication records state for school nursing operations. This slice handles
 * student medication data including prescriptions, administration schedules, consent
 * tracking, and expiration monitoring. Medication data is Protected Health Information
 * (PHI) and requires strict HIPAA compliance measures.
 *
 * **Key Features:**
 * - Medication inventory and prescription management
 * - Administration schedule tracking and alerts
 * - Consent requirement monitoring for controlled substances
 * - Medication expiration tracking and notifications
 * - Route-based medication filtering (oral, injection, topical, etc.)
 * - Student-specific medication history and active prescriptions
 * - Integration with TanStack Query for server state synchronization
 *
 * **HIPAA Compliance - CRITICAL:**
 * - Medication data is PHI and MUST NOT be persisted to localStorage
 * - All medication access MUST be audit logged on the backend
 * - This slice is NOT included in redux-persist configuration
 * - Data cleared on logout and tab close for security
 * - Encryption required for data in transit (HTTPS only)
 * - Access restricted by RBAC permissions (read:medications, write:medications)
 *
 * **State Management:**
 * - Feature store location: `stores/slices/medicationsSlice.ts`
 * - NOT persisted (in-memory only) - cleared on page refresh
 * - Server state managed via TanStack Query for caching
 * - Real-time updates via WebSocket for medication administration events
 *
 * **Data Security:**
 * - No localStorage persistence (PHI protection)
 * - All API calls include authentication token
 * - Backend enforces row-level security based on user permissions
 * - Audit trail automatically created for all medication access
 * - Cross-tab state sync disabled (security by design)
 *
 * **Integration:**
 * - Backend API: `services/modules/medicationsApi.ts`
 * - TanStack Query hooks: `hooks/useMedications.ts`
 * - Student records: `pages/students/store/studentsSlice.ts`
 * - Used by: Medication administration forms, student profiles, daily schedules
 *
 * @module stores/slices/medicationsSlice
 * @requires @reduxjs/toolkit
 * @security PHI data - NO localStorage persistence, audit logging required
 * @compliance HIPAA-compliant in-memory state management, backend audit logging
 *
 * @example Basic usage in component
 * ```typescript
 * import { useDispatch, useSelector } from 'react-redux';
 * import { medicationsActions, selectActiveMedicationsByStudent } from '@/stores/slices/medicationsSlice';
 *
 * function StudentMedications({ studentId }) {
 *   const dispatch = useDispatch();
 *   const medications = useSelector(selectActiveMedicationsByStudent(studentId));
 *   const { isLoading, error } = useSelector((state) => state.medications);
 *
 *   useEffect(() => {
 *     // Load medications from server (TanStack Query preferred)
 *     dispatch(fetchMedicationsForStudent(studentId));
 *   }, [studentId]);
 *
 *   return (
 *     <div>
 *       {medications.map(med => (
 *         <MedicationCard key={med.id} medication={med} />
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 *
 * @example Medication expiration monitoring
 * ```typescript
 * import { useSelector } from 'react-redux';
 * import { selectExpiringMedications } from '@/stores/slices/medicationsSlice';
 *
 * function ExpirationAlerts() {
 *   const expiringMeds = useSelector(selectExpiringMedications);
 *
 *   return (
 *     <AlertPanel>
 *       {expiringMeds.map(med => (
 *         <Alert key={med.id}>
 *           {med.name} expires {med.expiresAt}
 *         </Alert>
 *       ))}
 *     </AlertPanel>
 *   );
 * }
 * ```
 *
 * @see {@link ../../services/modules/medicationsApi.ts} for API integration
 * @see {@link ../../hooks/useMedications.ts} for TanStack Query hooks
 * @since 1.0.0
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

/**
 * Medication record interface representing a student's prescription or medication order.
 *
 * Contains all necessary information for medication administration, consent tracking,
 * and inventory management. This is PHI data protected under HIPAA regulations.
 *
 * @interface Medication
 * @property {string} id - Unique medication record identifier (UUID)
 * @property {string} studentId - Student this medication is prescribed to (foreign key)
 * @property {string} name - Medication name (generic or brand name)
 * @property {string} dosage - Dosage amount and unit (e.g., "500mg", "2 tablets")
 * @property {string} route - Administration route (oral, injection, topical, inhalation, etc.)
 * @property {string} frequency - Administration frequency (e.g., "twice daily", "as needed")
 * @property {boolean} active - Whether medication is currently active/valid for administration
 * @property {string} [expiresAt] - Medication expiration date (ISO 8601 format) for inventory tracking
 *
 * @example Medication record structure
 * ```typescript
 * {
 *   id: "med-123",
 *   studentId: "stu-456",
 *   name: "Amoxicillin",
 *   dosage: "500mg",
 *   route: "oral",
 *   frequency: "Three times daily",
 *   active: true,
 *   expiresAt: "2025-12-31T00:00:00Z"
 * }
 * ```
 *
 * @security PHI data - audit logging required for all access
 * @compliance HIPAA-protected medication information
 */
interface Medication {
  id: string;
  studentId: string;
  name: string;
  dosage: string;
  route: string;
  frequency: string;
  active: boolean;
  expiresAt?: string;
}

/**
 * Medications state interface for Redux store.
 *
 * Stores medication records with loading and error states. This entire state
 * is PHI and MUST NOT be persisted to localStorage. State is cleared on logout
 * and page refresh for HIPAA compliance.
 *
 * @interface MedicationsState
 * @property {Medication[]} medications - Array of medication records (PHI data)
 * @property {boolean} isLoading - Loading state for async medication operations
 * @property {string | null} error - Error message from failed medication operations
 *
 * @example State structure
 * ```typescript
 * {
 *   medications: [
 *     {
 *       id: "med-1",
 *       studentId: "stu-1",
 *       name: "EpiPen",
 *       dosage: "0.3mg",
 *       route: "injection",
 *       frequency: "as needed",
 *       active: true,
 *       expiresAt: "2025-06-30T00:00:00Z"
 *     }
 *   ],
 *   isLoading: false,
 *   error: null
 * }
 * ```
 *
 * @security PHI data - NOT persisted to localStorage
 * @compliance HIPAA-compliant in-memory storage only
 */
interface MedicationsState {
  medications: Medication[];
  isLoading: boolean;
  error: string | null;
}

/**
 * Initial medications state with empty medication list.
 *
 * This state is used on first load and is repopulated from the server
 * via TanStack Query. NOT persisted to localStorage (HIPAA compliance).
 *
 * @type {MedicationsState}
 * @constant
 */
const initialState: MedicationsState = {
  medications: [],
  isLoading: false,
  error: null,
};

/**
 * Medications Redux slice with reducers for medication management.
 *
 * Handles medication state updates including loading medications from the server,
 * managing loading states, and error handling. Designed to work with TanStack Query
 * for server state synchronization and real-time updates.
 *
 * **IMPORTANT SECURITY NOTES:**
 * - This slice contains PHI data and MUST NOT be added to redux-persist
 * - All medication data is cleared on logout and page refresh
 * - Backend audit logging required for all medication access
 * - Access controlled via RBAC permissions
 *
 * @constant medicationsSlice
 * @type {Slice<MedicationsState>}
 * @security PHI data - NO persistence allowed
 * @compliance HIPAA-compliant in-memory state only
 */
const medicationsSlice = createSlice({
  name: 'medications',
  initialState,
  reducers: {
    /**
     * Sets the medications array with data from the server.
     *
     * Called after successfully fetching medications from the backend API.
     * Replaces the entire medications array with new data. Should be called
     * from TanStack Query success handlers or WebSocket update listeners.
     *
     * **HIPAA Compliance:**
     * - Backend MUST audit log this data access
     * - Data NOT persisted to localStorage
     * - Cleared on logout via state reset
     *
     * @function setMedications
     * @param {MedicationsState} state - Current medications state
     * @param {PayloadAction<Medication[]>} action - Array of medication records from server
     * @returns {void}
     *
     * @example Load medications from API
     * ```typescript
     * const dispatch = useDispatch();
     *
     * const loadMedications = async () => {
     *   dispatch(medicationsActions.setLoading(true));
     *   try {
     *     const data = await medicationsApi.getAll();
     *     dispatch(medicationsActions.setMedications(data));
     *     // Backend automatically audit logs this access
     *   } catch (error) {
     *     dispatch(medicationsActions.setError(error.message));
     *   } finally {
     *     dispatch(medicationsActions.setLoading(false));
     *   }
     * };
     * ```
     *
     * @example Update from WebSocket event
     * ```typescript
     * socket.on('medication:updated', (updatedMedication) => {
     *   const currentMeds = selectAll(state);
     *   const newMeds = currentMeds.map(med =>
     *     med.id === updatedMedication.id ? updatedMedication : med
     *   );
     *   dispatch(medicationsActions.setMedications(newMeds));
     * });
     * ```
     *
     * @security PHI data - backend audit logging required
     * @compliance HIPAA audit trail created on backend
     */
    setMedications: (state, action: PayloadAction<Medication[]>) => {
      state.medications = action.payload;
    },

    /**
     * Sets the loading state for medication operations.
     *
     * Used to show loading indicators during async medication operations
     * such as fetching, creating, updating, or deleting medications.
     *
     * @function setLoading
     * @param {MedicationsState} state - Current medications state
     * @param {PayloadAction<boolean>} action - Loading state (true = loading, false = idle)
     * @returns {void}
     *
     * @example Show loading spinner during fetch
     * ```typescript
     * const MedicationsList = () => {
     *   const { isLoading } = useSelector((state) => state.medications);
     *
     *   if (isLoading) {
     *     return <LoadingSpinner />;
     *   }
     *
     *   return <MedicationsTable />;
     * };
     * ```
     */
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    /**
     * Sets or clears the error message for medication operations.
     *
     * Stores error messages from failed medication operations for display
     * to the user. Pass null to clear the error after user acknowledgment.
     *
     * @function setError
     * @param {MedicationsState} state - Current medications state
     * @param {PayloadAction<string | null>} action - Error message or null to clear
     * @returns {void}
     *
     * @example Handle medication fetch error
     * ```typescript
     * const { error } = useSelector((state) => state.medications);
     *
     * if (error) {
     *   return (
     *     <Alert onClose={() => dispatch(medicationsActions.setError(null))}>
     *       {error}
     *     </Alert>
     *   );
     * }
     * ```
     */
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

/**
 * Export medications slice for advanced use cases.
 * @exports medicationsSlice
 */
export { medicationsSlice };

/**
 * Medication action creators for state management.
 *
 * @exports medicationsActions - Action creators (setMedications, setLoading, setError)
 *
 * @example Using medication actions
 * ```typescript
 * import { medicationsActions } from '@/stores/slices/medicationsSlice';
 *
 * dispatch(medicationsActions.setMedications(medications));
 * dispatch(medicationsActions.setLoading(true));
 * dispatch(medicationsActions.setError('Failed to load medications'));
 * ```
 */
export const medicationsActions = medicationsSlice.actions;

/**
 * Medication async thunks (currently empty, use TanStack Query instead).
 *
 * Async operations should be handled by TanStack Query hooks for better
 * caching, refetching, and optimistic updates. This object is provided
 * for future expansion if needed.
 *
 * @exports medicationsThunks - Empty object (use TanStack Query)
 * @deprecated Use TanStack Query hooks from `hooks/useMedications.ts`
 */
export const medicationsThunks = {};

/**
 * Basic medication selectors for common state access patterns.
 *
 * These selectors provide type-safe access to the medications state.
 * For more complex queries, use the specialized selector functions below.
 *
 * @exports medicationsSelectors - Basic selectors for state access
 * @property {Function} selectAll - Select all medications
 * @property {Function} selectLoading - Select loading state
 * @property {Function} selectError - Select error state
 *
 * @example Using basic selectors
 * ```typescript
 * import { medicationsSelectors } from '@/stores/slices/medicationsSlice';
 *
 * const allMedications = useSelector(medicationsSelectors.selectAll);
 * const isLoading = useSelector(medicationsSelectors.selectLoading);
 * const error = useSelector(medicationsSelectors.selectError);
 * ```
 */
export const medicationsSelectors = {
  selectAll: (state: any) => state.medications.medications,
  selectLoading: (state: any) => state.medications.isLoading,
  selectError: (state: any) => state.medications.error,
};

/**
 * Selects only active medications from the store.
 *
 * Filters out inactive/discontinued medications to show only current
 * prescriptions that are valid for administration.
 *
 * @function selectActiveMedications
 * @param {any} state - Redux root state
 * @returns {Medication[]} Array of active medications
 *
 * @example Get active medications for dashboard
 * ```typescript
 * const activeMeds = useSelector(selectActiveMedications);
 * console.log(`${activeMeds.length} active medications`);
 * ```
 *
 * @security PHI data access - audit logging required
 */
export const selectActiveMedications = (state: any) =>
  state.medications.medications.filter((m: Medication) => m.active);

/**
 * Selects all medications for a specific student.
 *
 * Returns medications (active and inactive) prescribed to the given student.
 * Useful for viewing complete medication history.
 *
 * @function selectMedicationsByStudent
 * @param {string} studentId - Student identifier
 * @returns {Function} Selector function that accepts Redux state
 * @returns {Medication[]} Array of medications for the student
 *
 * @example Get all medications for a student
 * ```typescript
 * const studentMeds = useSelector(selectMedicationsByStudent(studentId));
 * console.log(`Student has ${studentMeds.length} medication records`);
 * ```
 *
 * @security PHI data access - audit logging required
 * @compliance Student medication history is PHI
 */
export const selectMedicationsByStudent = (studentId: string) => (state: any) =>
  state.medications.medications.filter((m: Medication) => m.studentId === studentId);

/**
 * Selects active medications for a specific student.
 *
 * Returns only active/current medications for the student. This is the most
 * commonly used selector for daily medication administration workflows.
 *
 * @function selectActiveMedicationsByStudent
 * @param {string} studentId - Student identifier
 * @returns {Function} Selector function that accepts Redux state
 * @returns {Medication[]} Array of active medications for the student
 *
 * @example Get active medications for daily administration
 * ```typescript
 * const activeMeds = useSelector(selectActiveMedicationsByStudent('stu-123'));
 *
 * return (
 *   <MedicationSchedule>
 *     {activeMeds.map(med => (
 *       <MedicationItem key={med.id} medication={med} />
 *     ))}
 *   </MedicationSchedule>
 * );
 * ```
 *
 * @security PHI data access - audit logging required
 * @compliance Student medication data is PHI
 */
export const selectActiveMedicationsByStudent = (studentId: string) => (state: any) =>
  state.medications.medications.filter((m: Medication) => m.studentId === studentId && m.active);

/**
 * Selects medications requiring consent forms or parental authorization.
 *
 * Returns active medications that may require additional consent documentation.
 * Currently returns all active medications; should be enhanced with consent
 * tracking logic based on medication classification (controlled substances,
 * high-risk medications, etc.).
 *
 * @function selectMedicationsRequiringConsent
 * @param {any} state - Redux root state
 * @returns {Medication[]} Array of medications requiring consent
 *
 * @example Check for missing consent forms
 * ```typescript
 * const consentRequired = useSelector(selectMedicationsRequiringConsent);
 *
 * return (
 *   <Alert severity="warning">
 *     {consentRequired.length} medications require consent forms
 *   </Alert>
 * );
 * ```
 *
 * @todo Enhance with actual consent tracking based on medication type
 * @security PHI data access - audit logging required
 * @compliance Consent documentation is HIPAA-required
 */
export const selectMedicationsRequiringConsent = (state: any) =>
  state.medications.medications.filter((m: Medication) => m.active);

/**
 * Selects medications filtered by administration route.
 *
 * Returns medications matching the specified administration route (oral,
 * injection, topical, inhalation, etc.). Useful for organizing medications
 * by administration method or training requirements.
 *
 * @function selectMedicationsByRoute
 * @param {string} route - Administration route (oral, injection, topical, inhalation, etc.)
 * @returns {Function} Selector function that accepts Redux state
 * @returns {Medication[]} Array of medications with the specified route
 *
 * @example Get injectable medications requiring special training
 * ```typescript
 * const injectableMeds = useSelector(selectMedicationsByRoute('injection'));
 *
 * return (
 *   <TrainingAlert>
 *     Staff must be trained for {injectableMeds.length} injectable medications
 *   </TrainingAlert>
 * );
 * ```
 *
 * @security PHI data access - audit logging required
 */
export const selectMedicationsByRoute = (route: string) => (state: any) =>
  state.medications.medications.filter((m: Medication) => m.route === route);

/**
 * Selects medications with expiration dates for inventory tracking.
 *
 * Returns medications that have expiration dates set. Used for inventory
 * management, expiration alerts, and medication disposal scheduling.
 *
 * @function selectExpiringMedications
 * @param {any} state - Redux root state
 * @returns {Medication[]} Array of medications with expiration dates
 *
 * @example Monitor medication expiration for inventory
 * ```typescript
 * const expiringMeds = useSelector(selectExpiringMedications);
 * const expiringSoon = expiringMeds.filter(med =>
 *   new Date(med.expiresAt) < addDays(new Date(), 30)
 * );
 *
 * return (
 *   <InventoryAlert>
 *     {expiringSoon.length} medications expire within 30 days
 *   </InventoryAlert>
 * );
 * ```
 *
 * @security PHI data access - audit logging required
 * @compliance Proper medication disposal tracking required
 */
export const selectExpiringMedications = (state: any) =>
  state.medications.medications.filter((m: Medication) => m.expiresAt);

/**
 * Selects medications due for administration today.
 *
 * Returns active medications that need to be administered based on the current
 * date. Currently returns all active medications; should be enhanced with actual
 * scheduling logic based on frequency, last administration time, and schedule.
 *
 * @function selectMedicationsDueToday
 * @param {any} state - Redux root state
 * @returns {Medication[]} Array of medications due today
 *
 * @example Show daily medication schedule
 * ```typescript
 * const medicationsDue = useSelector(selectMedicationsDueToday);
 *
 * return (
 *   <DailySchedule>
 *     <h2>Medications Due Today: {medicationsDue.length}</h2>
 *     {medicationsDue.map(med => (
 *       <MedicationScheduleItem key={med.id} medication={med} />
 *     ))}
 *   </DailySchedule>
 * );
 * ```
 *
 * @todo Enhance with actual schedule calculation based on frequency and last dose
 * @security PHI data access - audit logging required
 * @compliance Medication administration tracking required
 */
export const selectMedicationsDueToday = (state: any) =>
  state.medications.medications.filter((m: Medication) => m.active);

/**
 * Medications reducer for Redux store integration.
 *
 * **CRITICAL SECURITY NOTE:**
 * This reducer contains PHI data and MUST NOT be included in redux-persist
 * configuration. Data should remain in-memory only and be cleared on logout.
 *
 * Import this reducer in the root Redux store configuration:
 * ```typescript
 * import medicationsReducer from './slices/medicationsSlice';
 *
 * const store = configureStore({
 *   reducer: {
 *     medications: medicationsReducer,
 *     // DO NOT add to persistConfig whitelist
 *   },
 * });
 * ```
 *
 * @default medicationsSlice.reducer
 * @security PHI data - NO localStorage persistence
 * @compliance HIPAA-compliant in-memory storage only
 */
export default medicationsSlice.reducer;
