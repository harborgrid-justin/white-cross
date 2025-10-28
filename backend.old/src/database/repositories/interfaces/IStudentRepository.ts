/**
 * @fileoverview Student repository interface for FERPA-compliant student data access.
 * Provides specialized queries for student records with unique identifiers and search capabilities.
 *
 * @module database/repositories/interfaces
 *
 * @remarks
 * FERPA Compliance:
 * - All student data is considered educational records under FERPA
 * - Access must be logged via execution context
 * - PHI data (if present) requires additional HIPAA safeguards
 * - Disclosure tracking required for external access
 *
 * Query Patterns:
 * - findByStudentNumber: Indexed unique identifier lookup
 * - findByMedicalRecordNumber: Indexed medical record lookup
 * - findByGrade: Grade-level filtered queries for bulk operations
 * - search: Full-text search across multiple fields
 *
 * @see {IRepository} Base repository interface
 * @see {StudentRepository} Concrete implementation
 *
 * LOC: 4258B8BFD8
 * WC-GEN-113 | IStudentRepository.ts - Student repository interface
 *
 * UPSTREAM (imports from):
 *   - IRepository.ts (database/repositories/interfaces/IRepository.ts)
 *
 * DOWNSTREAM (imported by):
 *   - RepositoryFactory.ts (database/repositories/RepositoryFactory.ts)
 *   - IUnitOfWork.ts (database/uow/IUnitOfWork.ts)
 *   - SequelizeUnitOfWork.ts (database/uow/SequelizeUnitOfWork.ts)
 */

import { IRepository } from './IRepository';

/**
 * Student entity representing a student record.
 *
 * @interface Student
 *
 * @property {string} id - Unique student identifier (UUID)
 * @property {string} studentNumber - Unique student number (e.g., "STU-2024-001")
 * @property {string} firstName - Student's first name
 * @property {string} lastName - Student's last name
 * @property {Date} dateOfBirth - Date of birth (PHI under HIPAA if under 18)
 * @property {string} grade - Grade level (e.g., "K", "1", "12")
 * @property {string} gender - Gender identity
 * @property {string} [photo] - Photo URL or path
 * @property {string} [medicalRecordNum] - Medical record number (PHI)
 * @property {boolean} isActive - Active enrollment status
 * @property {Date} enrollmentDate - Date of enrollment
 * @property {Date} createdAt - Record creation timestamp
 * @property {Date} updatedAt - Last update timestamp
 */
export interface Student {
  id: string;
  studentNumber: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  grade: string;
  gender: string;
  photo?: string;
  medicalRecordNum?: string;
  isActive: boolean;
  enrollmentDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Data transfer object for creating new student records.
 *
 * @interface CreateStudentDTO
 *
 * @property {string} studentNumber - Unique student number (validated for uniqueness)
 * @property {string} firstName - Student's first name (required)
 * @property {string} lastName - Student's last name (required)
 * @property {Date} dateOfBirth - Date of birth (must be valid date in past)
 * @property {string} grade - Grade level (validated against allowed values)
 * @property {string} gender - Gender identity
 * @property {string} [photo] - Photo URL or path
 * @property {string} [medicalRecordNum] - Medical record number (validated for uniqueness)
 * @property {string} [nurseId] - Assigned nurse ID (validated as existing user)
 */
export interface CreateStudentDTO {
  studentNumber: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  grade: string;
  gender: string;
  photo?: string;
  medicalRecordNum?: string;
  nurseId?: string;
}

/**
 * Data transfer object for updating student records.
 *
 * @interface UpdateStudentDTO
 *
 * @property {string} [studentNumber] - Updated student number (validated for uniqueness)
 * @property {string} [firstName] - Updated first name
 * @property {string} [lastName] - Updated last name
 * @property {Date} [dateOfBirth] - Updated date of birth
 * @property {string} [grade] - Updated grade level
 * @property {string} [gender] - Updated gender identity
 * @property {string} [photo] - Updated photo URL
 * @property {string} [medicalRecordNum] - Updated medical record number
 * @property {string} [nurseId] - Updated assigned nurse
 * @property {boolean} [isActive] - Updated active status
 */
export interface UpdateStudentDTO {
  studentNumber?: string;
  firstName?: string;
  lastName?: string;
  dateOfBirth?: Date;
  grade?: string;
  gender?: string;
  photo?: string;
  medicalRecordNum?: string;
  nurseId?: string;
  isActive?: boolean;
}

/**
 * Repository interface for student data access operations.
 *
 * @interface IStudentRepository
 * @extends {IRepository<Student, CreateStudentDTO, UpdateStudentDTO>}
 *
 * @remarks
 * Query Optimization:
 * - Student number lookups use unique index
 * - Medical record number lookups use unique index
 * - Grade queries use non-unique index
 * - Search uses ILIKE with trigram indexes for performance
 *
 * FERPA Compliance:
 * - All queries log access via execution context
 * - Search queries limited to prevent data mining
 * - PHI fields (DOB, MRN) require additional authorization
 *
 * @example
 * ```typescript
 * // Find student by unique student number
 * const student = await studentRepo.findByStudentNumber('STU-2024-001');
 *
 * // Find by medical record number
 * const patient = await studentRepo.findByMedicalRecordNumber('MRN-123456');
 *
 * // Get all students in a grade
 * const fifthGraders = await studentRepo.findByGrade('5');
 *
 * // Search across multiple fields
 * const results = await studentRepo.search('john smith');
 * ```
 */
export interface IStudentRepository
  extends IRepository<Student, CreateStudentDTO, UpdateStudentDTO> {
  /**
   * Finds student by unique student number.
   *
   * @param {string} studentNumber - Unique student identifier (e.g., "STU-2024-001")
   *
   * @returns {Promise<Student | null>} Student if found, null otherwise
   *
   * @remarks
   * Performance: O(1) lookup using unique index on studentNumber
   * Caching: Results cached for 30 minutes
   * Use Case: Student lookup in forms, reports, API endpoints
   *
   * @example
   * ```typescript
   * const student = await repository.findByStudentNumber('STU-2024-001');
   * if (student) {
   *   console.log(`Found: ${student.firstName} ${student.lastName}`);
   * }
   * ```
   */
  findByStudentNumber(studentNumber: string): Promise<Student | null>;

  /**
   * Finds student by medical record number (PHI field).
   *
   * @param {string} medicalRecordNum - Medical record number
   *
   * @returns {Promise<Student | null>} Student if found, null otherwise
   *
   * @remarks
   * Performance: O(1) lookup using unique index on medicalRecordNum
   * HIPAA Compliance: Access must be logged, requires PHI authorization
   * Use Case: Medical records integration, clinical workflows
   *
   * @example
   * ```typescript
   * const student = await repository.findByMedicalRecordNumber('MRN-123456');
   * ```
   */
  findByMedicalRecordNumber(medicalRecordNum: string): Promise<Student | null>;

  /**
   * Finds all active students in a specific grade level.
   *
   * @param {string} grade - Grade level (e.g., "K", "1", "2", "12")
   *
   * @returns {Promise<Student[]>} Array of students sorted by last name, first name
   *
   * @remarks
   * Performance: O(log n) with index on (grade, isActive, lastName, firstName)
   * Filtering: Only returns active students by default
   * Sorting: Alphabetical by last name, then first name
   * Use Case: Grade-level reports, bulk operations, class lists
   *
   * @example
   * ```typescript
   * const fifthGraders = await repository.findByGrade('5');
   * console.log(`${fifthGraders.length} students in grade 5`);
   * ```
   */
  findByGrade(grade: string): Promise<Student[]>;

  /**
   * Searches students by name, student number, or medical record number.
   *
   * @param {string} query - Search query string (minimum 2 characters)
   *
   * @returns {Promise<Student[]>} Array of matching students (max 50 results)
   *
   * @remarks
   * Performance: Uses ILIKE with trigram indexes for fuzzy matching
   * Search Fields: firstName, lastName, studentNumber, medicalRecordNum
   * Filtering: Only returns active students
   * Limit: Maximum 50 results to prevent data mining
   * Sorting: Alphabetical by last name, first name
   *
   * @example
   * ```typescript
   * // Search by name
   * const results = await repository.search('john smith');
   *
   * // Search by student number
   * const results = await repository.search('STU-2024');
   *
   * // Search by partial medical record number
   * const results = await repository.search('MRN-123');
   * ```
   */
  search(query: string): Promise<Student[]>;
}
