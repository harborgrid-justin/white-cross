/**
 * Medications Redux Slice
 *
 * Redux Toolkit slice for managing student medication prescriptions and administration
 * data. Provides standardized CRUD operations, selectors, and thunks for medication
 * management throughout the application.
 *
 * Uses the entity slice factory pattern for consistent state management across all
 * medication-related operations with built-in loading states, error handling, and
 * optimistic updates.
 *
 * @module pages/medications/store/medicationsSlice
 *
 * @remarks
 * HIPAA Compliance: All medication operations automatically generate audit logs for
 * PHI access tracking. State updates trigger cross-tab synchronization via BroadcastChannel.
 *
 * Medication Safety: Bulk operations are intentionally disabled for medication management
 * to ensure each medication change receives individual validation and review.
 *
 * State Structure: Uses Redux Toolkit's EntityAdapter for normalized state management,
 * enabling efficient lookups and updates by medication ID.
 *
 * @see {@link medicationsApi} for API integration
 * @see {@link useMedicationsData} for hook-based data access
 * @see {@link MedicationTypes} for type definitions
 *
 * @since 1.0.0
 */

import { createEntitySlice, EntityApiService } from '../../stores/sliceFactory';
import { Medication } from '../../types/api';
import { medicationsApi } from '../../services/api';

/**
 * Data required to create a new student medication prescription.
 *
 * @interface CreateMedicationData
 *
 * @property {string} studentId - Student receiving the medication (PHI)
 * @property {string} medicationId - Reference to medication catalog entry
 * @property {string} dosage - Prescribed dosage (e.g., "10mg", "2 tablets")
 * @property {string} frequency - Administration frequency (e.g., "TWICE_DAILY", "AS_NEEDED")
 * @property {string} route - Route of administration (e.g., "ORAL", "INJECTION_SC")
 * @property {string} startDate - ISO date when medication should begin
 * @property {string} [endDate] - ISO date when medication should end (optional for ongoing)
 * @property {string} [prescribedBy] - Prescribing physician name or ID
 * @property {string} [instructions] - Special administration instructions
 * @property {string} [sideEffects] - Known or potential side effects to monitor
 * @property {boolean} [requiresParentConsent] - True if parent consent required before administration
 */
interface CreateMedicationData {
  studentId: string;
  medicationId: string;
  dosage: string;
  frequency: string;
  route: string;
  startDate: string;
  endDate?: string;
  prescribedBy?: string;
  instructions?: string;
  sideEffects?: string;
  requiresParentConsent?: boolean;
}

/**
 * Data allowed for updating an existing student medication prescription.
 *
 * All fields are optional to support partial updates. Changes to dosage, frequency,
 * or route typically require new physician orders.
 *
 * @interface UpdateMedicationData
 *
 * @property {string} [dosage] - Updated dosage amount
 * @property {string} [frequency] - Updated administration frequency
 * @property {string} [route] - Updated administration route
 * @property {string} [startDate] - Updated start date
 * @property {string} [endDate] - Updated end date
 * @property {string} [prescribedBy] - Updated prescriber information
 * @property {string} [instructions] - Updated administration instructions
 * @property {string} [sideEffects] - Updated side effects information
 * @property {boolean} [isActive] - Updated active status
 * @property {boolean} [requiresParentConsent] - Updated consent requirement
 * @property {string} [parentConsentDate] - Date parent consent was obtained
 */
interface UpdateMedicationData {
  dosage?: string;
  frequency?: string;
  route?: string;
  startDate?: string;
  endDate?: string;
  prescribedBy?: string;
  instructions?: string;
  sideEffects?: string;
  isActive?: boolean;
  requiresParentConsent?: boolean;
  parentConsentDate?: string;
}

/**
 * Filter parameters for querying medications.
 *
 * Supports filtering by student, medication type, active status, consent requirements,
 * and date ranges with pagination support.
 *
 * @interface MedicationFilters
 *
 * @property {string} [studentId] - Filter by specific student
 * @property {string} [medicationId] - Filter by specific medication from catalog
 * @property {boolean} [isActive] - Filter by active status
 * @property {boolean} [requiresParentConsent] - Filter by consent requirement
 * @property {string} [startDate] - Filter by start date (ISO format)
 * @property {string} [endDate] - Filter by end date (ISO format)
 * @property {number} [page] - Page number for pagination (1-indexed)
 * @property {number} [limit] - Number of results per page
 */
interface MedicationFilters {
  studentId?: string;
  medicationId?: string;
  isActive?: boolean;
  requiresParentConsent?: boolean;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

/**
 * API service adapter for medications.
 *
 * Wraps the medicationsApi service to conform to the EntityApiService interface
 * required by the slice factory. Handles response transformation and error handling
 * for all medication CRUD operations.
 *
 * @const {EntityApiService<Medication, CreateMedicationData, UpdateMedicationData>}
 *
 * @remarks
 * API Integration: All methods call medicationsApi which handles authentication,
 * error handling, retry logic, and audit logging.
 *
 * Response Transformation: Normalizes API responses to match slice factory expectations,
 * ensuring consistent data structure across all entity types.
 *
 * @see {@link medicationsApi} for underlying API implementation
 */
const medicationsApiService: EntityApiService<Medication, CreateMedicationData, UpdateMedicationData> = {
  /**
   * Fetches all medications with optional filtering and pagination.
   *
   * @param {MedicationFilters} [params] - Optional filter parameters
   * @returns {Promise<{data: Medication[], total?: number, pagination?: any}>} Medications and pagination info
   */
  async getAll(params?: MedicationFilters) {
    const response = await medicationsApi.getAll(params);
    return {
      data: response.medications || [],
      total: response.pagination?.total,
      pagination: response.pagination,
    };
  },

  /**
   * Fetches a single medication by ID.
   *
   * @param {string} id - Medication ID
   * @returns {Promise<{data: Medication}>} Single medication record
   */
  async getById(id: string) {
    const response = await medicationsApi.getById(id);
    return { data: response };
  },

  /**
   * Creates a new student medication prescription.
   *
   * @param {CreateMedicationData} data - Medication creation data
   * @returns {Promise<{data: Medication}>} Created medication record
   *
   * @remarks
   * Medication Safety: Creation triggers validation of drug interactions,
   * contraindications, and allergy checks before saving.
   */
  async create(data: CreateMedicationData) {
    const response = await medicationsApi.create(data as any);
    return { data: response };
  },

  /**
   * Updates an existing student medication prescription.
   *
   * @param {string} id - Medication ID to update
   * @param {UpdateMedicationData} data - Updated medication data
   * @returns {Promise<{data: Medication}>} Updated medication record
   *
   * @remarks
   * Medication Safety: Updates to dosage, frequency, or route may require
   * new physician orders depending on school policy.
   */
  async update(id: string, data: UpdateMedicationData) {
    const response = await medicationsApi.update(id, data as any);
    return { data: response };
  },

  /**
   * Deletes (soft-deletes) a student medication prescription.
   *
   * @param {string} id - Medication ID to delete
   * @returns {Promise<{success: boolean}>} Deletion success status
   *
   * @remarks
   * Medication Safety: Deletion typically performs soft-delete to preserve
   * audit trail. Physical deletion requires elevated permissions.
   */
  async delete(id: string) {
    await medicationsApi.delete(id);
    return { success: true };
  },
};

/**
 * Medications slice factory instance.
 *
 * Creates the Redux slice with standardized CRUD operations, loading states,
 * and error handling using the entity slice factory pattern.
 *
 * @const
 *
 * @remarks
 * Medication Safety: Bulk operations are intentionally disabled to ensure each
 * medication change receives individual validation and review. This prevents
 * accidental mass updates that could compromise patient safety.
 *
 * @see {@link createEntitySlice} for factory implementation details
 */
const medicationsSliceFactory = createEntitySlice<Medication, CreateMedicationData, UpdateMedicationData>(
  'medications',
  medicationsApiService,
  {
    enableBulkOperations: false, // Disable bulk operations for medication safety
  }
);

/**
 * Medications Redux slice.
 *
 * @const {Slice}
 * @exports medicationsSlice
 */
export const medicationsSlice = medicationsSliceFactory.slice;

/**
 * Medications reducer function for Redux store.
 *
 * @const {Reducer}
 * @exports medicationsReducer
 */
export const medicationsReducer = medicationsSlice.reducer;

/**
 * Action creators for medication state updates.
 *
 * Includes both synchronous actions (setFilters, clearCache, etc.) and
 * auto-generated actions from async thunks (pending, fulfilled, rejected).
 *
 * @const {ActionCreators}
 * @exports medicationsActions
 */
export const medicationsActions = medicationsSliceFactory.actions;

/**
 * Entity adapter selectors for normalized medication state.
 *
 * Provides efficient selectors for accessing medications:
 * - selectAll: Get all medications as array
 * - selectById: Get medication by ID
 * - selectIds: Get all medication IDs
 * - selectEntities: Get medications as normalized object
 * - selectTotal: Get total count
 *
 * @const {EntitySelectors}
 * @exports medicationsSelectors
 *
 * @example
 * ```typescript
 * const allMedications = useSelector(medicationsSelectors.selectAll);
 * const medication = useSelector(state => medicationsSelectors.selectById(state, 'med-123'));
 * ```
 */
export const medicationsSelectors = medicationsSliceFactory.adapter.getSelectors((state: any) => state.medications);

/**
 * Async thunks for medication API operations.
 *
 * Provides thunks for all CRUD operations:
 * - fetchAll: Fetch medications with filters
 * - fetchById: Fetch single medication
 * - create: Create new medication
 * - update: Update existing medication
 * - delete: Delete medication
 *
 * @const {AsyncThunks}
 * @exports medicationsThunks
 *
 * @example
 * ```typescript
 * // Fetch all active medications for a student
 * dispatch(medicationsThunks.fetchAll({ studentId: '123', isActive: true }));
 *
 * // Create new medication
 * dispatch(medicationsThunks.create(medicationData));
 * ```
 */
export const medicationsThunks = medicationsSliceFactory.thunks;

/**
 * Selector for active medications from catalog.
 *
 * Returns all medications from the medication catalog. In the catalog context,
 * all medications are assumed available for prescription.
 *
 * @param {any} state - Redux root state
 * @returns {Medication[]} Array of all catalog medications
 *
 * @example
 * ```typescript
 * const activeMeds = useSelector(selectActiveMedications);
 * ```
 *
 * @remarks
 * Note: This selector is for the medication catalog, not student prescriptions.
 * For student-specific active medications, use selectActiveMedicationsByStudent.
 */
export const selectActiveMedications = (state: any): Medication[] => {
  const allMedications = medicationsSelectors.selectAll(state) as Medication[];
  // Medication catalog doesn't have isActive - all medications in catalog are assumed available
  return allMedications;
};

/**
 * Selector for controlled substance medications.
 *
 * Filters medications to return only those classified as controlled substances
 * requiring DEA tracking and witness documentation.
 *
 * @param {any} state - Redux root state
 * @returns {Medication[]} Array of controlled substance medications
 *
 * @example
 * ```typescript
 * const controlledMeds = useSelector(selectControlledMedications);
 * ```
 *
 * @remarks
 * Medication Safety: Controlled substances require special handling including:
 * - Secure storage in locked cabinet
 * - Witness documentation for administration
 * - Enhanced audit logging
 * - Periodic inventory reconciliation
 */
export const selectControlledMedications = (state: any): Medication[] => {
  const allMedications = medicationsSelectors.selectAll(state) as Medication[];
  return allMedications.filter(medication => medication.isControlled);
};

/**
 * Selector for medications filtered by category.
 *
 * Returns medications matching a specific category (e.g., "Antibiotic", "Analgesic",
 * "Antihistamine", "Antiseizure").
 *
 * @param {any} state - Redux root state
 * @param {string} category - Medication category to filter by
 * @returns {Medication[]} Array of medications in the specified category
 *
 * @example
 * ```typescript
 * const antibiotics = useSelector(state => selectMedicationsByCategory(state, 'Antibiotic'));
 * ```
 */
export const selectMedicationsByCategory = (state: any, category: string): Medication[] => {
  const allMedications = medicationsSelectors.selectAll(state) as Medication[];
  return allMedications.filter(medication => medication.category === category);
};

/**
 * Selector for medications filtered by dosage form.
 *
 * Returns medications available in a specific dosage form (e.g., "Tablet", "Liquid",
 * "Injection", "Inhaler").
 *
 * @param {any} state - Redux root state
 * @param {string} dosageForm - Dosage form to filter by
 * @returns {Medication[]} Array of medications in the specified form
 *
 * @example
 * ```typescript
 * const tablets = useSelector(state => selectMedicationsByForm(state, 'Tablet'));
 * const liquids = useSelector(state => selectMedicationsByForm(state, 'Liquid'));
 * ```
 */
export const selectMedicationsByForm = (state: any, dosageForm: string): Medication[] => {
  const allMedications = medicationsSelectors.selectAll(state) as Medication[];
  return allMedications.filter(medication => medication.dosageForm === dosageForm);
};

/**
 * Selector for medications requiring witness documentation.
 *
 * Returns medications that require a second healthcare provider to witness
 * administration, typically controlled substances and high-risk medications.
 *
 * @param {any} state - Redux root state
 * @returns {Medication[]} Array of medications requiring witness
 *
 * @example
 * ```typescript
 * const witnessRequired = useSelector(selectMedicationsRequiringWitness);
 * ```
 *
 * @remarks
 * Medication Safety: Medications requiring witness include:
 * - All controlled substances (DEA Schedule II-V)
 * - Injectable medications (depending on school policy)
 * - High-alert medications (e.g., insulin)
 *
 * Workflow: Administration interface should prompt for witness selection when
 * administering these medications.
 */
export const selectMedicationsRequiringWitness = (state: any): Medication[] => {
  const allMedications = medicationsSelectors.selectAll(state) as Medication[];
  return allMedications.filter(medication => medication.requiresWitness);
};
