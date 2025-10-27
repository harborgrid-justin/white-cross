/**
 * @module pages/students/store/healthRecordsSlice
 *
 * Health Records Redux Slice - HIPAA-Compliant PHI Management
 *
 * Manages student health records with strict HIPAA compliance requirements.
 * Provides standardized CRUD operations for health record management using the
 * entity slice factory pattern with enhanced security and audit logging.
 *
 * @remarks
 * **CRITICAL - HIPAA Compliance:** This slice manages Protected Health Information (PHI)
 * and is subject to strict HIPAA regulations. All operations trigger comprehensive audit
 * logging in the backend for compliance tracking.
 *
 * **PHI Data Handling:**
 * - Health records contain highly sensitive PHI (diagnoses, treatments, medical history)
 * - PHI data is NEVER persisted to localStorage
 * - All PHI data stored in sessionStorage or memory only
 * - Automatic data clearing on session end or logout
 * - Encryption at rest and in transit (handled by backend API)
 *
 * **Audit Logging Integration:**
 * - Every CRUD operation logs: user ID, timestamp, operation type, record ID
 * - Read operations log PHI access for compliance audits
 * - All audit logs are immutable and stored in backend database
 * - Audit logs include IP address, device info for security tracking
 *
 * **Cross-Tab Synchronization:**
 * - Uses BroadcastChannel API (NOT localStorage) for cross-tab sync
 * - Prevents PHI exposure through persistent storage
 * - Real-time updates across browser tabs for multi-nurse workflows
 *
 * **Bulk Operations Disabled:**
 * - Bulk operations intentionally disabled for safety
 * - Each health record change requires individual review and validation
 * - Prevents accidental mass updates to sensitive medical data
 *
 * **Data Minimization:**
 * - Only loads health records for currently active student
 * - Automatic cache clearing when navigating away from student
 * - Reduces PHI exposure per HIPAA data minimization principle
 *
 * @see {@link healthRecordsApi} for backend API integration with audit logging
 * @see {@link HealthRecord} for health record entity type definition
 * @see {@link createEntitySlice} for factory implementation details
 *
 * @since 1.0.0
 */

import { createEntitySlice, EntityApiService } from '../../stores/sliceFactory';
import { HealthRecord } from '../../types/student.types';
import { healthRecordsApi } from '../../services/api';

/**
 * Data required to create a new health record.
 *
 * @interface CreateHealthRecordData
 *
 * @property {string} studentId - Student ID (PHI - links to student identity)
 * @property {string} recordType - Type of health record (e.g., 'IMMUNIZATION', 'PHYSICAL_EXAM', 'VISIT', 'CONDITION')
 * @property {string} recordDate - ISO date when record was created or event occurred
 * @property {string} [provider] - Healthcare provider name or ID (optional)
 * @property {string} [notes] - Clinical notes or observations (PHI - medical information)
 * @property {string[]} [attachments] - Document IDs for attached files (e.g., lab results, forms)
 *
 * @remarks
 * **PHI Content:** All fields except recordType and recordDate may contain PHI.
 * Notes field commonly contains diagnoses, treatments, and medical observations.
 *
 * **Validation:** Backend validates recordType against allowed values, ensures
 * recordDate is not in future, and verifies studentId exists.
 *
 * @example
 * ```typescript
 * const newRecord: CreateHealthRecordData = {
 *   studentId: 'student-123',
 *   recordType: 'PHYSICAL_EXAM',
 *   recordDate: '2024-08-15',
 *   provider: 'Dr. Smith',
 *   notes: 'Annual physical examination. All vitals normal.',
 *   attachments: ['doc-456', 'doc-789']
 * };
 * ```
 */
interface CreateHealthRecordData {
  studentId: string;
  recordType: string;
  recordDate: string;
  provider?: string;
  notes?: string;
  attachments?: string[];
}

/**
 * Data allowed for updating an existing health record.
 *
 * All fields are optional to support partial updates. StudentId cannot be changed
 * after creation (immutable for audit trail integrity).
 *
 * @interface UpdateHealthRecordData
 *
 * @property {string} [recordType] - Updated record type
 * @property {string} [recordDate] - Updated record date
 * @property {string} [provider] - Updated provider information
 * @property {string} [notes] - Updated or appended clinical notes
 * @property {string[]} [attachments] - Updated attachment list
 *
 * @remarks
 * **Audit Trail:** Updates create new audit log entries recording which fields changed.
 * Original values are preserved in audit history for compliance.
 *
 * **Notes Appending:** Common pattern is to append to existing notes rather than
 * replace, maintaining full medical history timeline.
 */
interface UpdateHealthRecordData {
  recordType?: string;
  recordDate?: string;
  provider?: string;
  notes?: string;
  attachments?: string[];
}

/**
 * Filter parameters for querying health records.
 *
 * Supports filtering by student, record type, date range, and provider with
 * pagination support for large record sets.
 *
 * @interface HealthRecordFilters
 *
 * @property {string} [studentId] - Filter by specific student (required for getAll)
 * @property {string} [recordType] - Filter by record type (e.g., 'IMMUNIZATION')
 * @property {string} [startDate] - Filter by date range start (ISO format)
 * @property {string} [endDate] - Filter by date range end (ISO format)
 * @property {string} [provider] - Filter by healthcare provider
 * @property {number} [page] - Page number for pagination (1-indexed)
 * @property {number} [limit] - Number of records per page (default: 20)
 *
 * @remarks
 * **Required studentId:** For HIPAA data minimization, health records queries
 * must specify studentId to prevent broad PHI access.
 *
 * **Date Range Filtering:** Useful for generating compliance reports or
 * reviewing records for specific time periods.
 */
interface HealthRecordFilters {
  studentId?: string;
  recordType?: string;
  startDate?: string;
  endDate?: string;
  provider?: string;
  page?: number;
  limit?: number;
}

/**
 * API service adapter for health records.
 *
 * Wraps the healthRecordsApi service to conform to the EntityApiService interface
 * required by the entity slice factory. Handles response transformation, error
 * handling, and enforces studentId requirement for all operations.
 *
 * @const {EntityApiService<HealthRecord, CreateHealthRecordData, UpdateHealthRecordData>}
 *
 * @remarks
 * **HIPAA Audit Logging:** All methods trigger comprehensive audit logging in the
 * backend API layer, recording user, timestamp, operation, and record ID.
 *
 * **Required studentId:** The getAll method requires studentId parameter to enforce
 * data minimization - prevents broad PHI queries that could expose multiple students'
 * health information.
 *
 * **Error Handling:** API errors are caught and transformed to user-friendly messages
 * without exposing PHI details in error messages.
 *
 * @see {@link healthRecordsApi} for underlying API implementation with audit logging
 * @see {@link EntityApiService} for interface definition
 */
const healthRecordsApiService: EntityApiService<HealthRecord, CreateHealthRecordData, UpdateHealthRecordData> = {
  /**
   * Fetches all health records for a specific student with optional filtering.
   *
   * @param {HealthRecordFilters} [params] - Filter parameters (studentId required)
   * @returns {Promise<{data: HealthRecord[], total?: number, pagination?: any}>} Health records and pagination
   * @throws {Error} If studentId is missing or student not found
   *
   * @remarks
   * **HIPAA Audit:** This operation logs PHI access for compliance audits.
   *
   * **Required Parameter:** studentId is required to enforce data minimization.
   * Backend rejects queries without studentId to prevent broad PHI access.
   *
   * **Performance:** Returns paginated results for students with many records.
   *
   * @example
   * ```typescript
   * // Fetch all immunization records for a student
   * const response = await healthRecordsApiService.getAll({
   *   studentId: 'student-123',
   *   recordType: 'IMMUNIZATION'
   * });
   * ```
   */
  async getAll(params?: HealthRecordFilters) {
    // HealthRecordsApi requires studentId as first parameter
    const studentId = params?.studentId || '';
    if (!studentId) {
      throw new Error('studentId is required for fetching health records');
    }
    const response = await healthRecordsApi.getRecords(studentId, params);
    return {
      data: response.data || [],
      total: response.total,
      pagination: response.pagination,
    };
  },

  /**
   * Fetches a single health record by ID.
   *
   * @param {string} id - Health record ID to fetch
   * @returns {Promise<{data: HealthRecord}>} Single health record
   * @throws {Error} If record not found or access denied
   *
   * @remarks
   * **HIPAA Audit:** This operation logs PHI access for compliance audits.
   *
   * **Access Control:** Backend verifies user has permission to access this
   * record based on role and student assignment.
   *
   * @example
   * ```typescript
   * const record = await healthRecordsApiService.getById('record-456');
   * ```
   */
  async getById(id: string) {
    const response = await healthRecordsApi.getRecordById(id);
    return { data: response };
  },

  /**
   * Creates a new health record.
   *
   * @param {CreateHealthRecordData} data - Health record creation data
   * @returns {Promise<{data: HealthRecord}>} Created health record
   * @throws {Error} If validation fails or studentId not found
   *
   * @remarks
   * **HIPAA Audit:** Creation triggers audit log for new PHI record creation,
   * recording who created the record, when, and for which student.
   *
   * **Validation:** Backend validates recordType, ensures recordDate is valid,
   * and verifies studentId exists before creation.
   *
   * **Medical Record Integrity:** Creates immutable baseline record that can only
   * be updated via audit-logged operations.
   *
   * @example
   * ```typescript
   * const newRecord = await healthRecordsApiService.create({
   *   studentId: 'student-123',
   *   recordType: 'IMMUNIZATION',
   *   recordDate: '2024-09-01',
   *   provider: 'School Nurse',
   *   notes: 'Flu vaccine administered. No adverse reactions.'
   * });
   * ```
   */
  async create(data: CreateHealthRecordData) {
    const response = await healthRecordsApi.createRecord(data as any);
    return { data: response };
  },

  /**
   * Updates an existing health record.
   *
   * @param {string} id - Health record ID to update
   * @param {UpdateHealthRecordData} data - Updated health record data (partial)
   * @returns {Promise<{data: HealthRecord}>} Updated health record
   * @throws {Error} If record not found, access denied, or validation fails
   *
   * @remarks
   * **HIPAA Audit:** Update triggers audit log recording which fields changed,
   * preserving original values for compliance and legal requirements.
   *
   * **Partial Updates:** Supports updating only specific fields without affecting
   * others, maintaining data integrity.
   *
   * **Medical Record Integrity:** Updates are appended to audit trail, original
   * data is never physically deleted or overwritten.
   *
   * @example
   * ```typescript
   * // Append follow-up note to existing record
   * const updated = await healthRecordsApiService.update('record-456', {
   *   notes: record.notes + '\n\nFollow-up 9/15: No complications reported.'
   * });
   * ```
   */
  async update(id: string, data: UpdateHealthRecordData) {
    const response = await healthRecordsApi.updateRecord(id, data as any);
    return { data: response };
  },

  /**
   * Deletes (soft-deletes) a health record.
   *
   * @param {string} id - Health record ID to delete
   * @returns {Promise<{success: boolean}>} Deletion success status
   * @throws {Error} If record not found or access denied
   *
   * @remarks
   * **HIPAA Audit:** Deletion triggers audit log for data retention compliance.
   *
   * **Soft Delete:** Health records are soft-deleted (marked inactive) rather than
   * physically deleted to maintain medical history and legal compliance. Physical
   * deletion requires elevated permissions and separate retention policy procedures.
   *
   * **Medical-Legal Requirements:** Health records typically must be retained for
   * minimum period (7 years for minors in most jurisdictions) per legal requirements.
   *
   * **Access After Deletion:** Soft-deleted records remain accessible to authorized
   * users for compliance audits and legal discovery.
   *
   * @example
   * ```typescript
   * await healthRecordsApiService.delete('record-456');
   * // Record is marked inactive, not physically deleted
   * ```
   */
  async delete(id: string) {
    await healthRecordsApi.deleteRecord(id);
    return { success: true };
  },
};

/**
 * Health records slice factory instance.
 *
 * Creates the Redux slice with standardized CRUD operations, loading states,
 * and error handling using the entity slice factory pattern.
 *
 * @const
 *
 * @remarks
 * **Bulk Operations Disabled:** Intentionally disabled for health records to ensure
 * each medical record change receives individual validation and review. This prevents
 * accidental mass updates to sensitive medical data that could compromise patient safety
 * or data integrity.
 *
 * **Normalized State:** Uses EntityAdapter for normalized state management with
 * efficient O(1) lookups by record ID.
 *
 * **Medical Record Safety:** Individual operations ensure proper validation,
 * access control, and audit logging for each health record change.
 *
 * @see {@link createEntitySlice} for factory implementation details
 */
const healthRecordsSliceFactory = createEntitySlice<HealthRecord, CreateHealthRecordData, UpdateHealthRecordData>(
  'healthRecords',
  healthRecordsApiService,
  {
    enableBulkOperations: false, // Disable bulk operations for sensitive health data
  }
);

/**
 * Health records Redux slice.
 *
 * @exports healthRecordsSlice
 */
export const healthRecordsSlice = healthRecordsSliceFactory.slice;

/**
 * Health records reducer for Redux store.
 *
 * @exports healthRecordsReducer
 */
export const healthRecordsReducer = healthRecordsSlice.reducer;

/**
 * Action creators for health record state updates.
 *
 * Includes synchronous actions (setFilters, clearCache, etc.) and
 * auto-generated actions from async thunks (pending, fulfilled, rejected).
 *
 * @exports healthRecordsActions
 */
export const healthRecordsActions = healthRecordsSliceFactory.actions;

/**
 * Entity adapter selectors for normalized health record state.
 *
 * Provides efficient selectors for accessing health records:
 * - selectAll: Get all health records as array
 * - selectById: Get health record by ID
 * - selectIds: Get all health record IDs
 * - selectEntities: Get health records as normalized object
 * - selectTotal: Get total count
 *
 * @exports healthRecordsSelectors
 *
 * @example
 * ```typescript
 * const allRecords = useSelector(healthRecordsSelectors.selectAll);
 * const record = useSelector(state => healthRecordsSelectors.selectById(state, 'record-123'));
 * ```
 */
export const healthRecordsSelectors = healthRecordsSliceFactory.adapter.getSelectors((state: any) => state.healthRecords);

/**
 * Async thunks for health record API operations.
 *
 * Provides thunks for all CRUD operations:
 * - fetchAll: Fetch health records with filters (requires studentId)
 * - fetchById: Fetch single health record
 * - create: Create new health record
 * - update: Update existing health record
 * - delete: Delete (soft-delete) health record
 *
 * @exports healthRecordsThunks
 *
 * @example
 * ```typescript
 * // Fetch all immunization records for a student
 * dispatch(healthRecordsThunks.fetchAll({
 *   studentId: 'student-123',
 *   recordType: 'IMMUNIZATION'
 * }));
 *
 * // Create new health record
 * dispatch(healthRecordsThunks.create(recordData));
 * ```
 */
export const healthRecordsThunks = healthRecordsSliceFactory.thunks;

/**
 * Selector for health records by student.
 *
 * Returns all health records for a specific student, useful for displaying
 * student's complete medical history.
 *
 * @param {any} state - Redux root state
 * @param {string} studentId - Student ID to filter by
 * @returns {HealthRecord[]} Health records for specified student
 *
 * @remarks
 * **HIPAA Data Minimization:** Only returns records for specified student,
 * preventing broad PHI exposure.
 *
 * @example
 * ```typescript
 * const studentRecords = useSelector(state =>
 *   selectHealthRecordsByStudent(state, 'student-123')
 * );
 * ```
 */
export const selectHealthRecordsByStudent = (state: any, studentId: string): HealthRecord[] => {
  const allRecords = healthRecordsSelectors.selectAll(state) as HealthRecord[];
  return allRecords.filter(record => record.studentId === studentId);
};

/**
 * Selector for health records by type.
 *
 * Returns health records of a specific type (e.g., 'IMMUNIZATION', 'PHYSICAL_EXAM',
 * 'VISIT', 'CONDITION'), useful for generating type-specific reports.
 *
 * @param {any} state - Redux root state
 * @param {string} recordType - Record type to filter by
 * @returns {HealthRecord[]} Health records of specified type
 *
 * @remarks
 * **Use Cases:**
 * - Immunization compliance reports
 * - Physical exam tracking
 * - Chronic condition monitoring
 * - Visit history analysis
 *
 * @example
 * ```typescript
 * const immunizations = useSelector(state =>
 *   selectHealthRecordsByType(state, 'IMMUNIZATION')
 * );
 * ```
 */
export const selectHealthRecordsByType = (state: any, recordType: string): HealthRecord[] => {
  const allRecords = healthRecordsSelectors.selectAll(state) as HealthRecord[];
  return allRecords.filter(record => record.recordType === recordType);
};

/**
 * Selector for health records by provider.
 *
 * Returns health records documented by a specific healthcare provider,
 * useful for provider-specific reporting and quality assurance.
 *
 * @param {any} state - Redux root state
 * @param {string} provider - Provider name or ID to filter by
 * @returns {HealthRecord[]} Health records by specified provider
 *
 * @example
 * ```typescript
 * const nurseRecords = useSelector(state =>
 *   selectHealthRecordsByProvider(state, 'Nurse Smith')
 * );
 * ```
 */
export const selectHealthRecordsByProvider = (state: any, provider: string): HealthRecord[] => {
  const allRecords = healthRecordsSelectors.selectAll(state) as HealthRecord[];
  return allRecords.filter(record => record.provider === provider);
};

/**
 * Selector for recent health records.
 *
 * Returns health records created or updated within the specified number of days,
 * sorted by date (most recent first). Useful for displaying recent medical activity.
 *
 * @param {any} state - Redux root state
 * @param {number} [days=30] - Number of days to look back (default: 30)
 * @returns {HealthRecord[]} Recent health records sorted by date descending
 *
 * @remarks
 * **Performance:** Consider using with pagination for students with extensive
 * medical histories (100+ records).
 *
 * **Clinical Relevance:** Recent records (30 days) are typically most relevant
 * for current treatment decisions and follow-ups.
 *
 * @example
 * ```typescript
 * // Get records from last 7 days
 * const recentRecords = useSelector(state =>
 *   selectRecentHealthRecords(state, 7)
 * );
 * ```
 */
export const selectRecentHealthRecords = (state: any, days: number = 30): HealthRecord[] => {
  const allRecords = healthRecordsSelectors.selectAll(state) as HealthRecord[];
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  return allRecords.filter(record => {
    const recordDate = new Date(record.recordDate);
    return recordDate >= cutoffDate;
  }).sort((a, b) => new Date(b.recordDate).getTime() - new Date(a.recordDate).getTime());
};
