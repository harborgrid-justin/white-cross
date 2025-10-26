/**
 * @fileoverview Health Records Redux Slice
 *
 * Manages health records state for student health data including medical history,
 * immunizations, allergies, chronic conditions, and health assessments. This slice
 * provides centralized state management for all health-related Protected Health
 * Information (PHI) with built-in HIPAA compliance safeguards.
 *
 * @module stores/slices/healthRecordsSlice
 *
 * @remarks
 * **HIPAA Compliance**: This slice manages Protected Health Information (PHI) and
 * requires strict handling:
 * - All health record access must be audit logged by backend API
 * - PHI data is NEVER persisted to localStorage (session-only storage)
 * - Access requires proper authentication and authorization
 * - Data must be encrypted in transit and at rest
 *
 * **FERPA Compliance**: Student health records are protected educational records
 * under FERPA. Access requires legitimate educational interest and proper consent.
 *
 * **State Management Pattern**: Uses Redux Toolkit createSlice for immutable state
 * updates with simple reducer pattern. For production, consider migrating to entity
 * slice factory pattern for normalized state and standardized CRUD operations.
 *
 * **Data Minimization**: Only fetch and display health records necessary for the
 * current task. Avoid loading all records unnecessarily to limit PHI exposure.
 *
 * **Audit Logging**: All CRUD operations on health records trigger audit logs in
 * the backend API layer to maintain HIPAA-compliant access tracking.
 *
 * @security
 * **PHI Data Fields**: HealthRecord contains sensitive medical information including:
 * - Medical diagnoses and conditions
 * - Treatment history and medications
 * - Immunization records
 * - Test results and health assessments
 * - Provider information and notes
 *
 * **Security Requirements**:
 * - Must use HTTPS for all API communication
 * - JWT authentication required for all operations
 * - Role-based access control enforced by backend
 * - Session timeout for inactive users
 * - No PHI data in browser localStorage or sessionStorage
 *
 * @compliance HIPAA Privacy Rule (45 CFR 164.502)
 * @compliance HIPAA Security Rule (45 CFR 164.306)
 * @compliance FERPA (20 U.S.C. § 1232g; 34 CFR Part 99)
 *
 * @see {@link healthRecordsApi} for API integration
 * @see {@link useHealthRecords} for React hook integration
 * @see {@link HealthRecord} for type definition
 *
 * @since 1.0.0
 *
 * @example
 * ```typescript
 * // Fetching health records for a student
 * import { useDispatch, useSelector } from 'react-redux';
 * import { healthRecordsSelectors } from '@/stores/slices/healthRecordsSlice';
 * import { healthRecordsApi } from '@/services/api';
 *
 * function StudentHealthView({ studentId }) {
 *   const dispatch = useDispatch();
 *   const records = useSelector(state =>
 *     selectHealthRecordsByStudent(studentId)(state)
 *   );
 *   const isLoading = useSelector(healthRecordsSelectors.selectLoading);
 *
 *   useEffect(() => {
 *     // Fetch records - triggers HIPAA audit log
 *     healthRecordsApi.getByStudentId(studentId)
 *       .then(data => {
 *         dispatch(healthRecordsActions.setRecords(data));
 *       })
 *       .catch(error => {
 *         dispatch(healthRecordsActions.setError(error.message));
 *       });
 *   }, [studentId]);
 *
 *   return (
 *     <div>
 *       {isLoading && <Spinner />}
 *       {records.map(record => (
 *         <HealthRecordCard key={record.id} record={record} />
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 *
 * @example
 * ```typescript
 * // Filtering records by type
 * import { selectHealthRecordsByType } from '@/stores/slices/healthRecordsSlice';
 *
 * function ImmunizationsView({ studentId }) {
 *   const immunizations = useSelector(state =>
 *     selectHealthRecordsByType('immunization')(state).filter(
 *       record => record.studentId === studentId
 *     )
 *   );
 *
 *   return (
 *     <ImmunizationList immunizations={immunizations} />
 *   );
 * }
 * ```
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

/**
 * Health record entity interface.
 *
 * Represents a single health record entry for a student, including medical history,
 * immunizations, allergies, chronic conditions, assessments, and other health data.
 *
 * @interface HealthRecord
 *
 * @property {string} id - Unique identifier for the health record (UUID)
 * @property {string} studentId - ID of student this record belongs to (foreign key)
 * @property {string} type - Health record type classification
 *   - 'immunization' - Vaccination records
 *   - 'allergy' - Allergy documentation
 *   - 'chronic_condition' - Ongoing medical conditions
 *   - 'medication' - Medication history
 *   - 'assessment' - Health screenings and assessments
 *   - 'injury' - Injury reports and treatment
 *   - 'illness' - Illness episodes and care
 *   - 'physical' - Physical examination results
 *   - 'dental' - Dental health records
 *   - 'vision' - Vision screening results
 *   - 'hearing' - Hearing screening results
 * @property {string} date - Record date in ISO 8601 format (e.g., '2024-03-15')
 * @property {any} data - Health record data payload (structure varies by type)
 *   - For immunizations: { vaccine, dose, manufacturer, lot, site, provider }
 *   - For allergies: { allergen, reaction, severity, treatment }
 *   - For conditions: { condition, diagnosis_date, icd10_code, treatment_plan }
 *   - For assessments: { type, results, measurements, notes, provider }
 *
 * @remarks
 * **PHI Warning**: This interface contains Protected Health Information. All access
 * must be logged for HIPAA compliance. Never log this data to console or store in
 * localStorage.
 *
 * **Data Validation**: Backend validates health record data against type-specific
 * schemas. ICD-10 codes are validated for diagnoses, vaccine codes validated against
 * CDC schedules, etc.
 *
 * **Type Safety**: The `data` field is typed as `any` for flexibility but should be
 * validated against type-specific schemas. Consider creating type-specific interfaces
 * for production use (e.g., ImmunizationRecord, AllergyRecord).
 *
 * @security PHI - Protected Health Information
 * @compliance HIPAA Privacy Rule - Individually Identifiable Health Information
 *
 * @example
 * ```typescript
 * // Example immunization record
 * const immunizationRecord: HealthRecord = {
 *   id: 'rec-uuid-123',
 *   studentId: 'stu-uuid-456',
 *   type: 'immunization',
 *   date: '2024-09-15',
 *   data: {
 *     vaccine: 'Tdap',
 *     dose: '1',
 *     manufacturer: 'Sanofi Pasteur',
 *     lot: 'U3472',
 *     site: 'left deltoid',
 *     provider: 'Dr. Jane Smith, MD',
 *     notes: 'No adverse reactions observed'
 *   }
 * };
 * ```
 *
 * @example
 * ```typescript
 * // Example allergy record
 * const allergyRecord: HealthRecord = {
 *   id: 'rec-uuid-789',
 *   studentId: 'stu-uuid-456',
 *   type: 'allergy',
 *   date: '2023-02-10',
 *   data: {
 *     allergen: 'Penicillin',
 *     reaction: 'Hives, difficulty breathing',
 *     severity: 'severe',
 *     treatment: 'Epinephrine auto-injector',
 *     notes: 'Parent confirmed multiple reactions'
 *   }
 * };
 * ```
 */
interface HealthRecord {
  id: string;
  studentId: string;
  type: string;
  date: string;
  data: any;
}

/**
 * Health records slice state interface.
 *
 * Manages the complete state for health records including the record collection,
 * loading states, and error information.
 *
 * @interface HealthRecordsState
 *
 * @property {HealthRecord[]} records - Array of all loaded health records
 *   - Stored in denormalized array format (consider normalizing for production)
 *   - Filtered and sorted in selectors, not in state
 *   - Never persisted to localStorage (HIPAA requirement)
 * @property {boolean} isLoading - Loading state indicator
 *   - true when API request in progress
 *   - false when request complete or idle
 *   - Used to show loading spinners and disable interactions
 * @property {string | null} error - Error message from failed operations
 *   - null when no error
 *   - Contains user-friendly error message on failure
 *   - Should not expose sensitive system information or PHI
 *
 * @remarks
 * **State Structure**: Simple denormalized array structure. For production with
 * large datasets, consider:
 * - Normalizing with entity adapter for O(1) lookups
 * - Pagination to limit memory usage
 * - Virtual scrolling for long lists
 *
 * **Memory Management**: Clear records on logout or when navigating away from
 * health records section to minimize PHI exposure in memory.
 *
 * **Persistence**: This state is NEVER persisted to localStorage or sessionStorage
 * due to HIPAA requirements. All data is session-only and cleared on page refresh.
 *
 * @security PHI - Contains Protected Health Information
 * @compliance HIPAA - Session-only storage, no persistence
 */
interface HealthRecordsState {
  records: HealthRecord[];
  isLoading: boolean;
  error: string | null;
}

/**
 * Initial state for health records slice.
 *
 * Provides clean starting state with empty records, no loading, and no errors.
 *
 * @const {HealthRecordsState}
 */
const initialState: HealthRecordsState = {
  records: [],
  isLoading: false,
  error: null,
};

/**
 * Health records Redux slice.
 *
 * Creates the slice with reducers for managing health records state. Provides
 * simple CRUD state management without async thunks (API calls handled in components).
 *
 * @const
 */
const healthRecordsSlice = createSlice({
  name: 'healthRecords',
  initialState,
  reducers: {
    /**
     * Sets the complete health records array.
     *
     * Replaces all existing records with new array, typically after fetching from API.
     * This is a complete replacement, not a merge.
     *
     * @param {HealthRecordsState} state - Current state
     * @param {PayloadAction<HealthRecord[]>} action - Action with records payload
     * @param {HealthRecord[]} action.payload - Array of health records to set
     *
     * @remarks
     * **Usage Pattern**: Typically called after successful API fetch to populate state.
     * Clears any existing records before setting new ones.
     *
     * **HIPAA Consideration**: When setting records, ensure they were fetched with
     * proper authentication and audit logging was triggered by the API.
     *
     * @example
     * ```typescript
     * // After fetching from API
     * const records = await healthRecordsApi.getByStudentId(studentId);
     * dispatch(healthRecordsActions.setRecords(records));
     * ```
     *
     * @example
     * ```typescript
     * // Clearing all records (e.g., on logout)
     * dispatch(healthRecordsActions.setRecords([]));
     * ```
     */
    setRecords: (state, action: PayloadAction<HealthRecord[]>) => {
      state.records = action.payload;
    },

    /**
     * Sets the loading state.
     *
     * Updates the loading indicator to show/hide loading UI elements like spinners
     * and to disable user interactions during API requests.
     *
     * @param {HealthRecordsState} state - Current state
     * @param {PayloadAction<boolean>} action - Action with loading state
     * @param {boolean} action.payload - New loading state (true = loading, false = idle)
     *
     * @remarks
     * **Usage Pattern**: Set to true before API call, false after completion or error.
     *
     * @example
     * ```typescript
     * // Before API call
     * dispatch(healthRecordsActions.setLoading(true));
     *
     * try {
     *   const records = await healthRecordsApi.getAll();
     *   dispatch(healthRecordsActions.setRecords(records));
     * } catch (error) {
     *   dispatch(healthRecordsActions.setError(error.message));
     * } finally {
     *   dispatch(healthRecordsActions.setLoading(false));
     * }
     * ```
     */
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    /**
     * Sets error state after failed operations.
     *
     * Updates error message to display user feedback after API failures or validation
     * errors. Pass null to clear error.
     *
     * @param {HealthRecordsState} state - Current state
     * @param {PayloadAction<string | null>} action - Action with error message
     * @param {string | null} action.payload - Error message or null to clear
     *
     * @remarks
     * **Security**: Error messages should be user-friendly and not expose sensitive
     * system information, stack traces, or PHI data.
     *
     * **Error Handling Pattern**: Backend API should return sanitized error messages.
     * Generic messages like "Failed to load health records" are preferred over
     * detailed system errors.
     *
     * @example
     * ```typescript
     * // Setting error after failed API call
     * try {
     *   const records = await healthRecordsApi.getAll();
     *   dispatch(healthRecordsActions.setRecords(records));
     *   dispatch(healthRecordsActions.setError(null)); // Clear any previous errors
     * } catch (error) {
     *   dispatch(healthRecordsActions.setError(
     *     'Failed to load health records. Please try again.'
     *   ));
     * }
     * ```
     *
     * @example
     * ```typescript
     * // Clearing error (e.g., when user dismisses error message)
     * dispatch(healthRecordsActions.setError(null));
     * ```
     */
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

/**
 * Health records slice instance.
 *
 * @exports healthRecordsSlice
 */
export { healthRecordsSlice };

/**
 * Action creators for health records state management.
 *
 * Provides action creators for updating health records state:
 * - setRecords: Replace all records
 * - setLoading: Update loading state
 * - setError: Set or clear error message
 *
 * @exports healthRecordsActions
 *
 * @example
 * ```typescript
 * import { healthRecordsActions } from '@/stores/slices/healthRecordsSlice';
 * import { useDispatch } from 'react-redux';
 *
 * function MyComponent() {
 *   const dispatch = useDispatch();
 *
 *   const loadRecords = async () => {
 *     dispatch(healthRecordsActions.setLoading(true));
 *     try {
 *       const records = await healthRecordsApi.getAll();
 *       dispatch(healthRecordsActions.setRecords(records));
 *     } catch (error) {
 *       dispatch(healthRecordsActions.setError(error.message));
 *     } finally {
 *       dispatch(healthRecordsActions.setLoading(false));
 *     }
 *   };
 * }
 * ```
 */
export const healthRecordsActions = healthRecordsSlice.actions;

/**
 * Async thunks placeholder.
 *
 * Currently empty as API calls are handled in components. For production, consider
 * implementing async thunks with createAsyncThunk for standardized API integration.
 *
 * @exports healthRecordsThunks
 *
 * @remarks
 * **Future Enhancement**: Implement thunks for:
 * - fetchHealthRecords(studentId): Fetch all records for a student
 * - fetchHealthRecordById(id): Fetch single record
 * - createHealthRecord(data): Create new record
 * - updateHealthRecord(id, data): Update existing record
 * - deleteHealthRecord(id): Delete record
 *
 * @example
 * ```typescript
 * // Future implementation example
 * const fetchHealthRecords = createAsyncThunk(
 *   'healthRecords/fetchAll',
 *   async (studentId: string) => {
 *     const response = await healthRecordsApi.getByStudentId(studentId);
 *     return response;
 *   }
 * );
 * ```
 */
export const healthRecordsThunks = {};

/**
 * Basic selectors for health records state.
 *
 * Provides simple selectors for accessing health records state slices:
 * - selectAll: Get all health records
 * - selectLoading: Get loading state
 * - selectError: Get error state
 *
 * @exports healthRecordsSelectors
 *
 * @example
 * ```typescript
 * import { useSelector } from 'react-redux';
 * import { healthRecordsSelectors } from '@/stores/slices/healthRecordsSlice';
 *
 * function HealthRecordsList() {
 *   const records = useSelector(healthRecordsSelectors.selectAll);
 *   const isLoading = useSelector(healthRecordsSelectors.selectLoading);
 *   const error = useSelector(healthRecordsSelectors.selectError);
 *
 *   if (isLoading) return <Spinner />;
 *   if (error) return <ErrorMessage message={error} />;
 *
 *   return (
 *     <div>
 *       {records.map(record => (
 *         <HealthRecordCard key={record.id} record={record} />
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 */
export const healthRecordsSelectors = {
  /**
   * Selects all health records from state.
   *
   * @param {any} state - Redux root state
   * @returns {HealthRecord[]} Array of all health records
   *
   * @example
   * ```typescript
   * const allRecords = useSelector(healthRecordsSelectors.selectAll);
   * ```
   */
  selectAll: (state: any) => state.healthRecords.records,

  /**
   * Selects loading state.
   *
   * @param {any} state - Redux root state
   * @returns {boolean} Current loading state
   *
   * @example
   * ```typescript
   * const isLoading = useSelector(healthRecordsSelectors.selectLoading);
   * ```
   */
  selectLoading: (state: any) => state.healthRecords.isLoading,

  /**
   * Selects error state.
   *
   * @param {any} state - Redux root state
   * @returns {string | null} Current error message or null
   *
   * @example
   * ```typescript
   * const error = useSelector(healthRecordsSelectors.selectError);
   * if (error) {
   *   toast.error(error);
   * }
   * ```
   */
  selectError: (state: any) => state.healthRecords.error,
};

/**
 * Selector factory for filtering health records by student ID.
 *
 * Returns a selector function that filters all health records to only those
 * belonging to the specified student.
 *
 * @param {string} studentId - Student ID to filter by
 * @returns {Function} Selector function that takes state and returns filtered records
 *
 * @remarks
 * **Performance**: For production use with large datasets, consider memoizing with
 * reselect's createSelector to prevent unnecessary recalculations.
 *
 * **HIPAA Consideration**: Only request records for students the current user has
 * authorization to access. Backend enforces access control but frontend should
 * respect authorization as well.
 *
 * @example
 * ```typescript
 * function StudentHealthView({ studentId }) {
 *   const studentRecords = useSelector(
 *     selectHealthRecordsByStudent(studentId)
 *   );
 *
 *   return (
 *     <div>
 *       <h2>Health Records for Student {studentId}</h2>
 *       {studentRecords.map(record => (
 *         <HealthRecordCard key={record.id} record={record} />
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 *
 * @example
 * ```typescript
 * // With memoization for production
 * import { createSelector } from '@reduxjs/toolkit';
 *
 * const selectHealthRecordsByStudent = (studentId: string) =>
 *   createSelector(
 *     [healthRecordsSelectors.selectAll],
 *     (records) => records.filter(r => r.studentId === studentId)
 *   );
 * ```
 */
export const selectHealthRecordsByStudent = (studentId: string) => (state: any) =>
  state.healthRecords.records.filter((r: HealthRecord) => r.studentId === studentId);

/**
 * Selector factory for filtering health records by type.
 *
 * Returns a selector function that filters all health records to only those
 * matching the specified type (e.g., 'immunization', 'allergy').
 *
 * @param {string} type - Health record type to filter by
 * @returns {Function} Selector function that takes state and returns filtered records
 *
 * @remarks
 * **Valid Types**: immunization, allergy, chronic_condition, medication, assessment,
 * injury, illness, physical, dental, vision, hearing
 *
 * **Use Cases**:
 * - Show only immunization records in immunization view
 * - Display allergies in medication administration screen
 * - Filter assessments for compliance reporting
 *
 * @example
 * ```typescript
 * function ImmunizationsList() {
 *   const immunizations = useSelector(
 *     selectHealthRecordsByType('immunization')
 *   );
 *
 *   return (
 *     <div>
 *       <h2>Immunization Records</h2>
 *       {immunizations.map(record => (
 *         <ImmunizationCard key={record.id} immunization={record} />
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 *
 * @example
 * ```typescript
 * // Combining multiple type filters
 * const allergies = useSelector(selectHealthRecordsByType('allergy'));
 * const medications = useSelector(selectHealthRecordsByType('medication'));
 *
 * // Show warnings if student has allergies
 * if (allergies.length > 0) {
 *   showAllergyWarning(allergies);
 * }
 * ```
 */
export const selectHealthRecordsByType = (type: string) => (state: any) =>
  state.healthRecords.records.filter((r: HealthRecord) => r.type === type);

/**
 * Selector for recent health records (most recent 10).
 *
 * Returns the 10 most recently added health records. Records are assumed to be
 * ordered by insertion order (most recent first).
 *
 * @param {any} state - Redux root state
 * @returns {HealthRecord[]} Array of up to 10 most recent health records
 *
 * @remarks
 * **Ordering Assumption**: Assumes records array is ordered with most recent first.
 * For production, consider:
 * - Sorting by date field explicitly
 * - Backend sorting with pagination
 * - Configurable limit instead of hardcoded 10
 *
 * **Performance**: Slice operation is O(1) but should still limit data fetched from
 * backend to avoid loading unnecessary records.
 *
 * **Use Cases**:
 * - Dashboard "Recent Activity" widget
 * - Quick overview of latest health events
 * - Compliance monitoring for recent assessments
 *
 * @example
 * ```typescript
 * function RecentHealthActivity() {
 *   const recentRecords = useSelector(selectRecentHealthRecords);
 *
 *   return (
 *     <Card title="Recent Health Activity">
 *       {recentRecords.map(record => (
 *         <ActivityItem key={record.id} record={record} />
 *       ))}
 *     </Card>
 *   );
 * }
 * ```
 *
 * @example
 * ```typescript
 * // With explicit date sorting
 * export const selectRecentHealthRecords = (state: any) => {
 *   const records = state.healthRecords.records;
 *   return [...records]
 *     .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
 *     .slice(0, 10);
 * };
 * ```
 */
export const selectRecentHealthRecords = (state: any) =>
  state.healthRecords.records.slice(0, 10);

/**
 * Health records reducer for Redux store configuration.
 *
 * @exports default
 *
 * @example
 * ```typescript
 * // In store configuration
 * import { configureStore } from '@reduxjs/toolkit';
 * import healthRecordsReducer from '@/stores/slices/healthRecordsSlice';
 *
 * export const store = configureStore({
 *   reducer: {
 *     healthRecords: healthRecordsReducer,
 *     // ... other reducers
 *   },
 * });
 * ```
 */
export default healthRecordsSlice.reducer;
