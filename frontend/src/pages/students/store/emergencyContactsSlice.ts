/**
 * @module pages/students/store/emergencyContactsSlice
 *
 * Emergency Contacts Redux Slice - Priority-Based Contact Management
 *
 * Manages student emergency contacts with support for contact verification,
 * priority-based notification workflows, and parent consent tracking. Provides
 * standardized CRUD operations using the entity slice factory pattern.
 *
 * @remarks
 * **Emergency Workflow Integration:** This slice supports critical emergency
 * notification workflows, enabling school nurses to quickly identify and contact
 * appropriate guardians during medical emergencies.
 *
 * **Contact Verification Process:**
 * 1. Initial creation with verificationStatus: 'UNVERIFIED'
 * 2. Automated verification attempt (phone/email validation)
 * 3. Manual verification by school nurse required
 * 4. Status progression: UNVERIFIED → PENDING → VERIFIED / FAILED
 * 5. Only VERIFIED contacts used in automated emergency notifications
 *
 * **Priority-Based Notification:**
 * - PRIMARY: First line contact for all notifications (typically parent/guardian)
 * - SECONDARY: Backup contact if primary unreachable
 * - EMERGENCY_ONLY: Reserved for critical situations only
 * - Priority-based escalation with configurable timeout per school policy
 *
 * **Parent Consent Tracking:**
 * - Tracks consent for medical treatment authorization
 * - Digital consent form integration with document management
 * - Consent date tracking and expiration monitoring
 * - Audit trail of all consent history changes
 *
 * **HIPAA Compliance:**
 * - Emergency contact information contains PHI (relationship, medical authorization)
 * - All operations trigger audit logging in backend
 * - PHI excluded from localStorage persistence
 * - Cross-tab sync via BroadcastChannel (not localStorage)
 *
 * **Bulk Operations Disabled:**
 * - Intentionally disabled to ensure individual validation
 * - Each contact change requires verification of current information
 * - Prevents mass updates that could compromise emergency response
 *
 * @see {@link emergencyContactsApi} for backend API integration
 * @see {@link EmergencyContact} for contact entity type definition
 * @see {@link createEntitySlice} for factory implementation details
 *
 * @since 1.0.0
 */

import { createEntitySlice, EntityApiService } from '../../../stores/sliceFactory';
import { EmergencyContact, CreateEmergencyContactData, UpdateEmergencyContactData } from '../../../types/student.types';
import { emergencyContactsApi } from '../../../services/api';

/**
 * Filter parameters for querying emergency contacts.
 *
 * Supports filtering by student, priority level, active status, and verification
 * status with pagination support.
 *
 * @interface EmergencyContactFilters
 *
 * @property {string} [studentId] - Filter by specific student
 * @property {string} [priority] - Filter by priority level ('PRIMARY', 'SECONDARY', 'EMERGENCY_ONLY')
 * @property {boolean} [isActive] - Filter by active status
 * @property {string} [verificationStatus] - Filter by verification status ('UNVERIFIED', 'PENDING', 'VERIFIED', 'FAILED')
 * @property {number} [page] - Page number for pagination (1-indexed)
 * @property {number} [limit] - Number of contacts per page (default: 20)
 *
 * @remarks
 * **Common Use Cases:**
 * - List all verified primary contacts for a student
 * - Find unverified contacts needing manual verification
 * - Identify contacts requiring consent re-verification
 * - Generate emergency contact reports by priority
 *
 * @example
 * ```typescript
 * // Get all verified primary contacts for a student
 * const filters: EmergencyContactFilters = {
 *   studentId: 'student-123',
 *   priority: 'PRIMARY',
 *   verificationStatus: 'VERIFIED',
 *   isActive: true
 * };
 * ```
 */
interface EmergencyContactFilters {
  studentId?: string;
  priority?: string;
  isActive?: boolean;
  verificationStatus?: string;
  page?: number;
  limit?: number;
}

/**
 * API service adapter for emergency contacts.
 *
 * Wraps the emergencyContactsApi service to conform to the EntityApiService
 * interface required by the entity slice factory. Handles response transformation
 * and error handling for all emergency contact CRUD operations.
 *
 * @const {EntityApiService<EmergencyContact, CreateEmergencyContactData, UpdateEmergencyContactData>}
 *
 * @remarks
 * **API Integration:** All methods call emergencyContactsApi which handles
 * authentication, error handling, retry logic, and audit logging.
 *
 * **Response Transformation:** Normalizes API responses to match slice factory
 * expectations, ensuring consistent data structure across all entity types.
 *
 * **Verification Workflow:** API automatically initiates verification process
 * upon contact creation, setting initial status to 'UNVERIFIED'.
 *
 * @see {@link emergencyContactsApi} for underlying API implementation
 * @see {@link EntityApiService} for interface definition
 */
const emergencyContactsApiService: EntityApiService<EmergencyContact, CreateEmergencyContactData, UpdateEmergencyContactData> = {
  /**
   * Fetches all emergency contacts with optional filtering and pagination.
   *
   * @param {EmergencyContactFilters} [params] - Optional filter parameters
   * @returns {Promise<{data: EmergencyContact[], total?: number, pagination?: any}>} Emergency contacts and pagination
   *
   * @remarks
   * **HIPAA Audit:** This operation triggers audit logging for PHI access.
   *
   * @example
   * ```typescript
   * // Fetch all verified contacts for a student
   * const response = await emergencyContactsApiService.getAll({
   *   studentId: 'student-123',
   *   verificationStatus: 'VERIFIED'
   * });
   * ```
   */
  async getAll(params?: EmergencyContactFilters) {
    const response = await emergencyContactsApi.getAll(params);
    return {
      data: response.data?.contacts || [],
      total: response.data?.pagination?.total,
      pagination: response.data?.pagination,
    };
  },

  /**
   * Fetches a single emergency contact by ID.
   *
   * @param {string} id - Emergency contact ID to fetch
   * @returns {Promise<{data: EmergencyContact}>} Single emergency contact
   * @throws {Error} If contact not found or access denied
   *
   * @remarks
   * **HIPAA Audit:** This operation triggers audit logging for PHI access.
   *
   * @example
   * ```typescript
   * const contact = await emergencyContactsApiService.getById('contact-456');
   * ```
   */
  async getById(id: string) {
    const response = await emergencyContactsApi.getById(id);
    return { data: response.data };
  },

  /**
   * Creates a new emergency contact.
   *
   * @param {CreateEmergencyContactData} data - Emergency contact creation data
   * @returns {Promise<{data: EmergencyContact}>} Created emergency contact
   * @throws {Error} If validation fails or studentId not found
   *
   * @remarks
   * **HIPAA Audit:** Creation triggers audit log for new contact record.
   *
   * **Verification Workflow:** Automatically initiates verification process:
   * - Sets verificationStatus to 'UNVERIFIED'
   * - Triggers automated phone/email validation if available
   * - Creates task for manual verification by school nurse
   *
   * **Validation:** Backend validates phone number format, email format,
   * relationship type, and ensures studentId exists.
   *
   * @example
   * ```typescript
   * const newContact = await emergencyContactsApiService.create({
   *   studentId: 'student-123',
   *   firstName: 'Jane',
   *   lastName: 'Doe',
   *   relationship: 'MOTHER',
   *   phoneNumber: '555-123-4567',
   *   email: 'jane.doe@example.com',
   *   priority: 'PRIMARY',
   *   canAuthorizeMe​dicalTreatment: true
   * });
   * ```
   */
  async create(data: CreateEmergencyContactData) {
    const response = await emergencyContactsApi.create(data);
    return { data: response.data };
  },

  /**
   * Updates an existing emergency contact.
   *
   * @param {string} id - Emergency contact ID to update
   * @param {UpdateEmergencyContactData} data - Updated emergency contact data (partial)
   * @returns {Promise<{data: EmergencyContact}>} Updated emergency contact
   * @throws {Error} If contact not found, access denied, or validation fails
   *
   * @remarks
   * **HIPAA Audit:** Update triggers audit log recording changed fields.
   *
   * **Re-verification:** Changes to phone number or email automatically trigger
   * re-verification process, resetting verificationStatus to 'PENDING'.
   *
   * **Consent Updates:** Changes to medical treatment authorization require
   * new consent documentation and parent signature.
   *
   * @example
   * ```typescript
   * // Update phone number (triggers re-verification)
   * const updated = await emergencyContactsApiService.update('contact-456', {
   *   phoneNumber: '555-987-6543'
   * });
   * ```
   */
  async update(id: string, data: UpdateEmergencyContactData) {
    const response = await emergencyContactsApi.update(id, data);
    return { data: response.data };
  },

  /**
   * Deletes (soft-deletes) an emergency contact.
   *
   * @param {string} id - Emergency contact ID to delete
   * @returns {Promise<{success: boolean}>} Deletion success status
   * @throws {Error} If contact not found or access denied
   *
   * @remarks
   * **HIPAA Audit:** Deletion triggers audit log for data retention compliance.
   *
   * **Soft Delete:** Emergency contacts are soft-deleted (marked inactive) to
   * preserve historical emergency response data and audit trail.
   *
   * **Emergency Impact:** Deleting PRIMARY contact triggers alert if no other
   * verified PRIMARY contact exists for student.
   *
   * @example
   * ```typescript
   * await emergencyContactsApiService.delete('contact-456');
   * // Contact is marked isActive: false, not physically deleted
   * ```
   */
  async delete(id: string) {
    await emergencyContactsApi.delete(id);
    return { success: true };
  },
};

/**
 * Emergency contacts slice factory instance.
 *
 * Creates the Redux slice with standardized CRUD operations, loading states,
 * and error handling using the entity slice factory pattern.
 *
 * @const
 *
 * @remarks
 * **Bulk Operations Disabled:** Intentionally disabled for emergency contacts to
 * ensure each contact change receives individual verification. This prevents
 * accidental mass updates that could compromise emergency notification reliability.
 *
 * **Normalized State:** Uses EntityAdapter for normalized state management with
 * efficient O(1) lookups by contact ID.
 *
 * @see {@link createEntitySlice} for factory implementation details
 */
const emergencyContactsSliceFactory = createEntitySlice<EmergencyContact, CreateEmergencyContactData, UpdateEmergencyContactData>(
  'emergencyContacts',
  emergencyContactsApiService,
  {
    enableBulkOperations: false,
  }
);

/**
 * Emergency contacts Redux slice.
 *
 * @exports emergencyContactsSlice
 */
export const emergencyContactsSlice = emergencyContactsSliceFactory.slice;

/**
 * Emergency contacts reducer for Redux store.
 *
 * @exports emergencyContactsReducer
 */
export const emergencyContactsReducer = emergencyContactsSlice.reducer;

/**
 * Action creators for emergency contact state updates.
 *
 * @exports emergencyContactsActions
 */
export const emergencyContactsActions = emergencyContactsSliceFactory.actions;

/**
 * Entity adapter selectors for normalized emergency contact state.
 *
 * @exports emergencyContactsSelectors
 *
 * @example
 * ```typescript
 * const allContacts = useSelector(emergencyContactsSelectors.selectAll);
 * const contact = useSelector(state => emergencyContactsSelectors.selectById(state, 'contact-123'));
 * ```
 */
export const emergencyContactsSelectors = emergencyContactsSliceFactory.adapter.getSelectors((state: any) => state.emergencyContacts);

/**
 * Async thunks for emergency contact API operations.
 *
 * @exports emergencyContactsThunks
 *
 * @example
 * ```typescript
 * // Fetch all contacts for a student
 * dispatch(emergencyContactsThunks.fetchAll({ studentId: 'student-123' }));
 *
 * // Create new contact
 * dispatch(emergencyContactsThunks.create(contactData));
 * ```
 */
export const emergencyContactsThunks = emergencyContactsSliceFactory.thunks;

/**
 * Selector for emergency contacts by student.
 *
 * @param {any} state - Redux root state
 * @param {string} studentId - Student ID to filter by
 * @returns {EmergencyContact[]} Emergency contacts for specified student
 *
 * @remarks
 * **Emergency Response:** Used to display all contacts when viewing student profile
 * or initiating emergency notification workflow.
 *
 * @example
 * ```typescript
 * const studentContacts = useSelector(state =>
 *   selectContactsByStudent(state, 'student-123')
 * );
 * ```
 */
export const selectContactsByStudent = (state: any, studentId: string): EmergencyContact[] => {
  const allContacts = emergencyContactsSelectors.selectAll(state) as EmergencyContact[];
  return allContacts.filter(contact => contact.studentId === studentId);
};

/**
 * Selector for active emergency contacts.
 *
 * @param {any} state - Redux root state
 * @returns {EmergencyContact[]} All active emergency contacts
 *
 * @remarks
 * **Data Filtering:** Excludes soft-deleted contacts to show only current,
 * usable emergency contacts.
 *
 * @example
 * ```typescript
 * const activeContacts = useSelector(selectActiveContacts);
 * ```
 */
export const selectActiveContacts = (state: any): EmergencyContact[] => {
  const allContacts = emergencyContactsSelectors.selectAll(state) as EmergencyContact[];
  return allContacts.filter(contact => contact.isActive);
};

/**
 * Selector for active emergency contacts by student.
 *
 * @param {any} state - Redux root state
 * @param {string} studentId - Student ID to filter by
 * @returns {EmergencyContact[]} Active emergency contacts for specified student
 *
 * @remarks
 * **Emergency Workflow:** Primary selector for emergency notification workflows,
 * ensuring only active, current contacts are used.
 *
 * @example
 * ```typescript
 * const activeStudentContacts = useSelector(state =>
 *   selectActiveContactsByStudent(state, 'student-123')
 * );
 * ```
 */
export const selectActiveContactsByStudent = (state: any, studentId: string): EmergencyContact[] => {
  const allContacts = emergencyContactsSelectors.selectAll(state) as EmergencyContact[];
  return allContacts.filter(contact =>
    contact.studentId === studentId && contact.isActive
  );
};

/**
 * Selector for primary emergency contacts.
 *
 * @param {any} state - Redux root state
 * @returns {EmergencyContact[]} All active primary emergency contacts
 *
 * @remarks
 * **Emergency Response:** Primary contacts are first line for all notifications.
 * Students should have at least one verified primary contact.
 *
 * **Priority Level:** PRIMARY contacts are contacted first in emergency workflows
 * with fastest response expectations.
 *
 * @example
 * ```typescript
 * const primaryContacts = useSelector(selectPrimaryContacts);
 * ```
 */
export const selectPrimaryContacts = (state: any): EmergencyContact[] => {
  const allContacts = emergencyContactsSelectors.selectAll(state) as EmergencyContact[];
  return allContacts.filter(contact =>
    contact.priority === 'PRIMARY' && contact.isActive
  );
};

/**
 * Selector for primary emergency contact by student.
 *
 * @param {any} state - Redux root state
 * @param {string} studentId - Student ID to filter by
 * @returns {EmergencyContact | undefined} Primary contact for student, or undefined if none exists
 *
 * @remarks
 * **Critical Selector:** Used to identify first contact point during emergencies.
 * If undefined, indicates student lacks verified primary contact (alert condition).
 *
 * **Emergency Workflow:** This contact receives first notification attempt with
 * shortest timeout before escalating to secondary contacts.
 *
 * @example
 * ```typescript
 * const primaryContact = useSelector(state =>
 *   selectPrimaryContactByStudent(state, 'student-123')
 * );
 * if (!primaryContact) {
 *   console.warn('No primary contact found for student - emergency response compromised');
 * }
 * ```
 */
export const selectPrimaryContactByStudent = (state: any, studentId: string): EmergencyContact | undefined => {
  const allContacts = emergencyContactsSelectors.selectAll(state) as EmergencyContact[];
  return allContacts.find(contact =>
    contact.studentId === studentId &&
    contact.priority === 'PRIMARY' &&
    contact.isActive
  );
};

/**
 * Selector for unverified emergency contacts.
 *
 * @param {any} state - Redux root state
 * @returns {EmergencyContact[]} Contacts requiring verification
 *
 * @remarks
 * **Compliance Alert:** Unverified contacts indicate incomplete emergency preparedness.
 * School nurses should prioritize verification of these contacts.
 *
 * **Verification Workflow:** Returns contacts with status 'UNVERIFIED' or 'FAILED'
 * that need manual verification or correction.
 *
 * **Quality Assurance:** Used to generate reports of contacts needing attention
 * before emergency situations arise.
 *
 * @example
 * ```typescript
 * const unverifiedContacts = useSelector(selectUnverifiedContacts);
 * if (unverifiedContacts.length > 0) {
 *   // Display alert: "X contacts require verification"
 * }
 * ```
 */
export const selectUnverifiedContacts = (state: any): EmergencyContact[] => {
  const allContacts = emergencyContactsSelectors.selectAll(state) as EmergencyContact[];
  return allContacts.filter(contact =>
    contact.verificationStatus === 'UNVERIFIED' ||
    contact.verificationStatus === 'FAILED'
  );
};

/**
 * Selector for emergency contacts by relationship.
 *
 * @param {any} state - Redux root state
 * @param {string} relationship - Relationship type to filter by (e.g., 'MOTHER', 'FATHER', 'GUARDIAN')
 * @returns {EmergencyContact[]} Contacts with specified relationship
 *
 * @remarks
 * **Use Cases:**
 * - Generate parent contact lists
 * - Identify guardian contacts for consent forms
 * - Create relationship-specific reports
 *
 * @example
 * ```typescript
 * const mothers = useSelector(state =>
 *   selectContactsByRelationship(state, 'MOTHER')
 * );
 * ```
 */
export const selectContactsByRelationship = (state: any, relationship: string): EmergencyContact[] => {
  const allContacts = emergencyContactsSelectors.selectAll(state) as EmergencyContact[];
  return allContacts.filter(contact => contact.relationship === relationship);
};
