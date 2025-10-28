/**
 * @fileoverview Allergy repository interface for student allergy data management.
 * Provides specialized queries for allergy tracking with severity classification and verification.
 *
 * @module database/repositories/interfaces
 *
 * @remarks
 * Clinical Significance:
 * - Life-threatening allergies require immediate visibility
 * - Verification by healthcare provider ensures accuracy
 * - Severity classification drives emergency response protocols
 * - Duplicate detection prevents conflicting allergy records
 *
 * HIPAA Compliance:
 * - Allergy information is Protected Health Information (PHI)
 * - All access must be logged via audit trail
 * - Disclosure requires proper authorization
 *
 * @see {IRepository} Base repository interface
 * @see {AllergyRepository} Concrete implementation
 *
 * LOC: 192FA0ED37
 * WC-GEN-108 | IAllergyRepository.ts - Allergy repository interface
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
 * Allergy entity representing a student's allergy record.
 *
 * @interface Allergy
 *
 * @property {string} id - Unique allergy record identifier (UUID)
 * @property {string} studentId - Student identifier (foreign key)
 * @property {string} allergen - Allergen name or description
 * @property {AllergySeverity} severity - Clinical severity classification
 * @property {string} [reaction] - Description of allergic reaction
 * @property {string} [treatment] - Recommended treatment or intervention
 * @property {boolean} verified - Whether allergy is verified by provider
 * @property {string} [verifiedBy] - Healthcare provider who verified
 * @property {Date} [verifiedAt] - Verification timestamp
 * @property {Date} createdAt - Record creation timestamp
 * @property {Date} updatedAt - Last update timestamp
 */
export interface Allergy {
  id: string;
  studentId: string;
  allergen: string;
  severity: AllergySeverity;
  reaction?: string;
  treatment?: string;
  verified: boolean;
  verifiedBy?: string;
  verifiedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Allergy severity classification for clinical decision support.
 *
 * @typedef {('MILD' | 'MODERATE' | 'SEVERE' | 'LIFE_THREATENING')} AllergySeverity
 *
 * @remarks
 * - MILD: Minor discomfort, no intervention required
 * - MODERATE: Requires monitoring and possible medication
 * - SEVERE: Requires immediate medical attention
 * - LIFE_THREATENING: Anaphylaxis risk, requires emergency protocols
 */
export type AllergySeverity = 'MILD' | 'MODERATE' | 'SEVERE' | 'LIFE_THREATENING';

/**
 * Data transfer object for creating new allergy records.
 *
 * @interface CreateAllergyDTO
 *
 * @property {string} studentId - Student identifier (validated as existing student)
 * @property {string} allergen - Allergen name or description (required)
 * @property {AllergySeverity} severity - Clinical severity classification
 * @property {string} [reaction] - Description of allergic reaction
 * @property {string} [treatment] - Recommended treatment
 * @property {boolean} [verified] - Initial verification status (default: false)
 * @property {string} [verifiedBy] - Healthcare provider ID if verified
 */
export interface CreateAllergyDTO {
  studentId: string;
  allergen: string;
  severity: AllergySeverity;
  reaction?: string;
  treatment?: string;
  verified?: boolean;
  verifiedBy?: string;
}

/**
 * Data transfer object for updating allergy records.
 *
 * @interface UpdateAllergyDTO
 *
 * @property {string} [allergen] - Updated allergen name
 * @property {AllergySeverity} [severity] - Updated severity classification
 * @property {string} [reaction] - Updated reaction description
 * @property {string} [treatment] - Updated treatment recommendation
 * @property {boolean} [verified] - Updated verification status
 * @property {string} [verifiedBy] - Healthcare provider ID for verification
 */
export interface UpdateAllergyDTO {
  allergen?: string;
  severity?: AllergySeverity;
  reaction?: string;
  treatment?: string;
  verified?: boolean;
  verifiedBy?: string;
}

/**
 * Repository interface for allergy data access operations.
 *
 * @interface IAllergyRepository
 * @extends {IRepository<Allergy, CreateAllergyDTO, UpdateAllergyDTO>}
 *
 * @remarks
 * Query Optimization:
 * - Student ID lookups use foreign key index
 * - Severity queries use non-unique index
 * - Duplicate detection uses composite index (studentId, allergen)
 *
 * Clinical Workflows:
 * - Life-threatening allergies flagged for emergency response
 * - Unverified allergies require provider review
 * - Duplicate allergen detection prevents data conflicts
 *
 * @example
 * ```typescript
 * // Find all allergies for a student
 * const allergies = await allergyRepo.findByStudentId('student-123');
 *
 * // Find critical allergies
 * const critical = await allergyRepo.findBySeverity('LIFE_THREATENING');
 *
 * // Check for duplicate before creating
 * const exists = await allergyRepo.checkDuplicateAllergen('student-123', 'Peanuts');
 * ```
 */
export interface IAllergyRepository extends IRepository<Allergy, CreateAllergyDTO, UpdateAllergyDTO> {
  /**
   * Finds all allergy records for a specific student.
   *
   * @param {string} studentId - Student identifier
   *
   * @returns {Promise<Allergy[]>} Array of allergy records sorted by severity
   *
   * @remarks
   * Performance: O(log n) using foreign key index on studentId
   * Sorting: Life-threatening first, then by severity, then creation date
   * Use Case: Student health profile, emergency alerts, medication cross-checks
   *
   * @example
   * ```typescript
   * const allergies = await repository.findByStudentId('student-123');
   * const criticalAllergies = allergies.filter(a =>
   *   a.severity === 'LIFE_THREATENING'
   * );
   * ```
   */
  findByStudentId(studentId: string): Promise<Allergy[]>;

  /**
   * Finds all allergy records of a specific severity level.
   *
   * @param {AllergySeverity} severity - Severity classification
   *
   * @returns {Promise<Allergy[]>} Array of allergies with specified severity
   *
   * @remarks
   * Performance: O(log n) using index on severity
   * Use Case: Emergency preparedness, critical allergy reports, staff training
   * Filtering: Includes all students, not just active
   *
   * @example
   * ```typescript
   * // Get all life-threatening allergies for emergency planning
   * const critical = await repository.findBySeverity('LIFE_THREATENING');
   *
   * // Generate staff training report
   * const severe = await repository.findBySeverity('SEVERE');
   * ```
   */
  findBySeverity(severity: AllergySeverity): Promise<Allergy[]>;

  /**
   * Checks if student already has a record for the specified allergen.
   *
   * @param {string} studentId - Student identifier
   * @param {string} allergen - Allergen name or description
   *
   * @returns {Promise<boolean>} True if duplicate allergen exists
   *
   * @remarks
   * Performance: O(1) using composite index on (studentId, allergen)
   * Use Case: Duplicate prevention during creation/update
   * Matching: Case-insensitive allergen comparison
   *
   * @example
   * ```typescript
   * const isDuplicate = await repository.checkDuplicateAllergen(
   *   'student-123',
   *   'Peanuts'
   * );
   *
   * if (isDuplicate) {
   *   throw new ValidationError('Allergen already recorded for this student');
   * }
   * ```
   */
  checkDuplicateAllergen(studentId: string, allergen: string): Promise<boolean>;
}
