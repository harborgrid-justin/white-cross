/**
 * @module stores/slices/students/api-service
 *
 * Students API Service Adapter
 *
 * Wraps the studentsApi service to conform to the EntityApiService interface
 * required by the entity slice factory. Handles response transformation and
 * error handling for all student CRUD operations.
 *
 * @remarks
 * **API Integration:** All methods call studentsApi which handles authentication,
 * error handling, retry logic, and audit logging for HIPAA compliance.
 *
 * **Response Transformation:** Normalizes API responses to match slice factory
 * expectations, ensuring consistent data structure across all entity types.
 *
 * **Audit Logging:** Student CRUD operations trigger audit logs in backend for
 * HIPAA compliance tracking of PHI access.
 *
 * @see {@link studentsApi} for underlying API implementation
 * @see {@link EntityApiService} for interface definition
 *
 * @since 1.0.0
 */

import { EntityApiService } from '@/stores/sliceFactory';
import { Student, CreateStudentData, UpdateStudentData } from '@/types/student.types';
import { StudentFilters } from './types';
import { apiActions } from '@/lib/api';

/**
 * API service adapter for students.
 *
 * Provides standardized CRUD operations that conform to the EntityApiService
 * interface, enabling integration with the entity slice factory pattern.
 *
 * @const {EntityApiService<Student, CreateStudentData, UpdateStudentData>}
 *
 * @example
 * ```typescript
 * // Used internally by Redux thunks
 * const response = await studentsApiService.getAll({ grade: '5' });
 * ```
 */
export const studentsApiService: EntityApiService<Student, CreateStudentData, UpdateStudentData> = {
  /**
   * Fetches all students with optional filtering and pagination.
   *
   * @param {StudentFilters} [params] - Optional filter parameters
   * @returns {Promise<{data: Student[], total?: number, pagination?: unknown}>} Students and pagination info
   *
   * @remarks
   * **HIPAA Audit:** This operation triggers audit logging for PHI access in the backend.
   *
   * **Performance:** Supports server-side filtering and pagination for large datasets.
   * Consider using pagination parameters for schools with 100+ students.
   *
   * **Caching:** Responses may be cached temporarily for performance. Use cache-busting
   * parameters when immediate data consistency is required.
   *
   * @example
   * ```typescript
   * // Fetch all active students in grade 5
   * const response = await studentsApiService.getAll({
   *   grade: '5',
   *   isActive: true
   * });
   * console.log(`Found ${response.data.length} students`);
   * ```
   */
  async getAll(params?: StudentFilters) {
    const response = await apiActions.students.getAll(params);
    return {
      data: response?.students || [],
      total: response?.pagination?.total,
      pagination: response?.pagination,
    };
  },

  /**
   * Fetches a single student by ID.
   *
   * @param {string} id - Student ID to fetch
   * @returns {Promise<{data: Student}>} Single student record
   * @throws {Error} If student not found or access denied
   *
   * @remarks
   * **HIPAA Audit:** This operation triggers audit logging for PHI access.
   *
   * **Authorization:** Backend validates that the requesting nurse has permission
   * to access the student's records. Access may be restricted based on school
   * assignment or role permissions.
   *
   * **Data Completeness:** The returned student object includes all related data:
   * allergies, medications, appointments, emergency contacts, and health records.
   *
   * @example
   * ```typescript
   * const student = await studentsApiService.getById('student-123');
   * console.log(`${student.data.firstName} ${student.data.lastName}`);
   * ```
   */
  async getById(id: string) {
    const response = await apiActions.students.getById(id);
    return { data: response };
  },

  /**
   * Creates a new student record.
   *
   * @param {CreateStudentData} data - Student creation data
   * @returns {Promise<{data: Student}>} Created student record with generated ID
   * @throws {Error} If validation fails or duplicate student number detected
   *
   * @remarks
   * **Validation:** Backend validates:
   * - Required fields (firstName, lastName, studentNumber, grade, dateOfBirth)
   * - Student number uniqueness within the school
   * - Grade format (K, 1-12)
   * - Date of birth (must be in the past, reasonable age range)
   * - Email format (if provided)
   * - Phone number format (if provided)
   *
   * **HIPAA Audit:** Creation triggers audit log for new PHI record creation,
   * recording who created the record and when.
   *
   * **Automatic Fields:** Backend automatically sets:
   * - ID (generated UUID)
   * - createdAt timestamp
   * - updatedAt timestamp
   * - schoolId (from authenticated nurse's school)
   * - isActive (defaults to true)
   *
   * @example
   * ```typescript
   * const newStudent = await studentsApiService.create({
   *   firstName: 'John',
   *   lastName: 'Doe',
   *   studentNumber: 'STU-2024-001',
   *   grade: '5',
   *   dateOfBirth: '2014-05-15',
   *   gender: 'M',
   *   emergencyContacts: [
   *     {
   *       name: 'Jane Doe',
   *       relationship: 'Mother',
   *       phone: '555-0100',
   *       isPrimary: true
   *     }
   *   ]
   * });
   * console.log(`Created student with ID: ${newStudent.data.id}`);
   * ```
   */
  async create(data: CreateStudentData) {
    const response = await apiActions.students.create(data);
    return { data: response };
  },

  /**
   * Updates an existing student record.
   *
   * @param {string} id - Student ID to update
   * @param {UpdateStudentData} data - Updated student data (partial update supported)
   * @returns {Promise<{data: Student}>} Updated student record
   * @throws {Error} If student not found, access denied, or validation fails
   *
   * @remarks
   * **Partial Updates:** Supports partial updates - only provided fields are updated.
   * Omitted fields retain their current values. Use this for efficient updates that
   * don't require fetching the entire student record first.
   *
   * **HIPAA Audit:** Update triggers audit log recording:
   * - Which fields were changed
   * - Previous and new values (for sensitive fields)
   * - Who made the change
   * - When the change occurred
   *
   * **Validation:** Backend validates updated fields:
   * - Grade format (if changed)
   * - Email format (if changed)
   * - Phone number format (if changed)
   * - Date formats (if changed)
   * - Student number uniqueness (if changed)
   *
   * **Timestamp Update:** updatedAt timestamp is automatically updated on every change.
   *
   * **Concurrency:** Uses optimistic locking to prevent lost updates. If the record
   * was modified by another user since you fetched it, the update will fail with
   * a conflict error. Fetch the latest version and retry.
   *
   * @example
   * ```typescript
   * // Update only grade and active status
   * const updated = await studentsApiService.update('student-123', {
   *   grade: '6',
   *   isActive: true
   * });
   * console.log(`Updated student to grade ${updated.data.grade}`);
   * ```
   *
   * @example
   * ```typescript
   * // Add a new allergy
   * const student = await studentsApiService.getById('student-123');
   * const updatedStudent = await studentsApiService.update('student-123', {
   *   allergies: [
   *     ...student.data.allergies,
   *     {
   *       allergen: 'Peanuts',
   *       severity: 'severe',
   *       reaction: 'Anaphylaxis',
   *       requiresEpiPen: true
   *     }
   *   ]
   * });
   * ```
   */
  async update(id: string, data: UpdateStudentData) {
    const response = await apiActions.students.update(id, data);
    return { data: response };
  },

  /**
   * Deletes (soft-deletes) a student record.
   *
   * @param {string} id - Student ID to delete
   * @returns {Promise<{success: boolean}>} Deletion success status
   * @throws {Error} If student not found or access denied
   *
   * @remarks
   * **Soft Delete:** Student records are soft-deleted (marked isActive: false) rather
   * than physically deleted to preserve audit trail and historical data. This ensures:
   * - HIPAA compliance with data retention requirements
   * - Historical reporting accuracy
   * - Ability to restore accidentally deleted records
   * - Preserved relationships for completed health visits
   *
   * **HIPAA Audit:** Deletion triggers audit log for data retention compliance,
   * recording who deleted the record and when.
   *
   * **Cascade Behavior:** Related records are handled as follows:
   * - Health records: Retained and marked inactive
   * - Medications: Retained and marked inactive
   * - Appointments: Future appointments cancelled, past appointments retained
   * - Emergency contacts: Retained (hidden from UI)
   * - Allergies: Retained (hidden from UI)
   *
   * **Restoration:** Soft-deleted students can be restored by setting isActive: true
   * through the update endpoint. Contact system administrator for restoration.
   *
   * **Authorization:** Only nurses with appropriate permissions can delete students.
   * Some schools restrict deletion to administrators only.
   *
   * @example
   * ```typescript
   * await studentsApiService.delete('student-123');
   * // Student is marked isActive: false, not physically deleted
   * console.log('Student successfully deactivated');
   * ```
   *
   * @example
   * ```typescript
   * // Restore a soft-deleted student
   * await studentsApiService.update('student-123', { isActive: true });
   * console.log('Student restored');
   * ```
   */
  async delete(id: string) {
    await apiActions.students.delete(id);
    return { success: true };
  },
};
