/**
 * Medication API Types
 *
 * Type definitions for medication API request/response interactions including
 * standardized response wrappers, query parameters, and form data structures.
 * These types ensure type-safe communication between frontend and backend.
 *
 * @module hooks/domains/medications/types/api
 * @author White Cross Healthcare Platform
 * @version 3.0.0
 */

/**
 * Generic medication API response wrapper with standardized structure.
 *
 * Wraps all medication API responses in a consistent format with success indicators,
 * optional messages, and error details. Supports generic typing for response data.
 *
 * @template T - The type of data contained in the response
 *
 * @interface MedicationApiResponse
 *
 * @property {T} data - Response payload data (type varies by endpoint)
 * @property {boolean} success - Indicates if the API operation succeeded
 * @property {string} [message] - Optional human-readable success or info message
 * @property {string[]} [errors] - Array of error messages if operation failed
 *
 * @example
 * ```typescript
 * // Successful response with medication data
 * const response: MedicationApiResponse<Medication> = {
 *   data: {
 *     id: 'med-123',
 *     name: 'Amoxicillin',
 *     dosage: '500mg',
 *     // ... other medication fields
 *   },
 *   success: true,
 *   message: 'Medication retrieved successfully'
 * };
 *
 * // Error response
 * const errorResponse: MedicationApiResponse<null> = {
 *   data: null,
 *   success: false,
 *   errors: [
 *     'Medication not found',
 *     'Invalid medication ID format'
 *   ]
 * };
 *
 * // Check success before using data
 * if (response.success) {
 *   console.log('Medication:', response.data.name);
 * } else {
 *   console.error('Errors:', response.errors?.join(', '));
 * }
 * ```
 *
 * @remarks
 * - Always check `success` property before accessing `data`
 * - `errors` array is only present when `success` is false
 * - `message` is optional and used for user-facing feedback
 * - Generic type `T` should match the expected data structure
 *
 * @see {@link medicationsApi} for API implementation
 */
export interface MedicationApiResponse<T = any> {
  data: T;
  success: boolean;
  message?: string;
  errors?: string[];
}

/**
 * Query parameters for medication list filtering and pagination.
 *
 * Supports server-side filtering, searching, pagination, and sorting for
 * medication list endpoints. All parameters are optional for flexible querying.
 *
 * @interface MedicationQueryParams
 *
 * @property {number} [page] - Page number for pagination (1-based indexing)
 * @property {number} [pageSize] - Number of items per page (default: 20)
 * @property {string} [search] - Search term for medication name or generic name
 * @property {string} [status] - Filter by medication status (active, paused, completed)
 * @property {string} [studentId] - Filter by specific student's medications
 *
 * @example
 * ```typescript
 * // Get first page of active medications
 * const params: MedicationQueryParams = {
 *   page: 1,
 *   pageSize: 20,
 *   status: 'active'
 * };
 *
 * // Search for specific medication
 * const searchParams: MedicationQueryParams = {
 *   search: 'Amoxicillin',
 *   page: 1,
 *   pageSize: 10
 * };
 *
 * // Get all medications for specific student
 * const studentParams: MedicationQueryParams = {
 *   studentId: 'student-789'
 * };
 *
 * const response = await medicationsApi.getAll(params);
 * ```
 *
 * @remarks
 * - Omitting parameters uses server defaults
 * - Search is typically case-insensitive and partial match
 * - Pagination starts at page 1, not 0
 * - Combining filters performs AND operation (all conditions must match)
 *
 * @see {@link useMedicationsList} for query hook usage
 */
export interface MedicationQueryParams {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: string;
  studentId?: string;
}

/**
 * Form data for creating or updating medication prescriptions.
 *
 * Comprehensive form structure for medication prescription entry including
 * drug information, dosage instructions, and scheduling. Used for both
 * new prescriptions and prescription updates.
 *
 * @interface MedicationFormData
 *
 * @property {string} name - Medication name (brand or generic)
 * @property {string} [dosageForm] - Form of medication (tablet, capsule, liquid, etc.)
 * @property {string} [strength] - Medication strength with unit (e.g., "500mg", "10ml")
 * @property {string} [genericName] - Generic name if brand name is used
 * @property {string} [manufacturer] - Manufacturer or pharmaceutical company name
 * @property {string} [dosage] - Prescribed dosage amount (e.g., "2 tablets", "500mg")
 * @property {string} [frequency] - Administration frequency (e.g., "twice daily", "every 6 hours")
 * @property {string} [studentId] - ID of student receiving prescription
 * @property {string} [startDate] - ISO 8601 date when prescription starts
 * @property {string} [endDate] - ISO 8601 date when prescription ends
 * @property {string} [notes] - Additional instructions or notes
 *
 * @example
 * ```typescript
 * // Complete prescription form data
 * const medicationForm: MedicationFormData = {
 *   name: 'Amoxicillin',
 *   dosageForm: 'Capsule',
 *   strength: '500mg',
 *   genericName: 'Amoxicillin',
 *   manufacturer: 'Generic Pharma',
 *   dosage: '1 capsule',
 *   frequency: 'Three times daily with meals',
 *   studentId: 'student-789',
 *   startDate: '2025-10-26T00:00:00Z',
 *   endDate: '2025-11-02T23:59:59Z',
 *   notes: 'Complete full 7-day course. Take with food to prevent stomach upset.'
 * };
 *
 * // Minimal prescription form (name required, others optional)
 * const minimalForm: MedicationFormData = {
 *   name: 'Ibuprofen',
 *   dosage: '200mg',
 *   frequency: 'As needed for pain'
 * };
 *
 * // Submit form
 * const response = await medicationsApi.create(medicationForm);
 * ```
 *
 * @remarks
 * - Only `name` is strictly required; other fields optional based on prescription context
 * - Strength should always include units to prevent dosing errors
 * - Dosage form helps with proper administration route verification
 * - Validate form data with {@link useMedicationFormValidation} before submission
 * - Check for allergies and drug interactions before prescribing
 *
 * @see {@link useMedicationFormValidation} for validation
 * @see {@link useCreateMedication} for creation hook
 */
export interface MedicationFormData {
  name: string;
  dosageForm?: string;
  strength?: string;
  genericName?: string;
  manufacturer?: string;
  dosage?: string;
  frequency?: string;
  studentId?: string;
  startDate?: string;
  endDate?: string;
  notes?: string;
}
