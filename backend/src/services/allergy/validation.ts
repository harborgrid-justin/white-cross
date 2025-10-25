/**
 * LOC: 09B098FD74
 * WC-GEN-203 | validation.ts - General utility functions and operations
 *
 * UPSTREAM (imports from):
 *   - index.ts (database/models/index.ts)
 *   - types.ts (services/allergy/types.ts)
 *
 * DOWNSTREAM (imported by):
 *   - bulkOperations.ts (services/allergy/bulkOperations.ts)
 *   - crudOperations.ts (services/allergy/crudOperations.ts)
 */

/**
 * WC-GEN-203 | validation.ts - General utility functions and operations
 * Purpose: general utility functions and operations
 * Upstream: ../../database/models, ./types | Dependencies: sequelize, ../../database/models, ./types
 * Downstream: Routes, services, other modules | Called by: Application components
 * Related: Similar modules, tests, documentation
 * Exports: Various exports | Key Services: Core functionality
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Module loading → Function execution → Response handling
 * LLM Context: general utility functions and operations, part of backend architecture
 */

/**
 * @fileoverview Allergy Validation Module - Data Integrity and Patient Safety
 *
 * Provides comprehensive validation functions for allergy operations to ensure data integrity,
 * prevent duplicate entries, and maintain patient safety standards. All validation functions
 * support transactional operations for atomic multi-step workflows.
 *
 * This module is CRITICAL for preventing invalid allergy data that could lead to medication
 * errors or incomplete patient safety records. Validation failures throw descriptive errors
 * that can be caught and handled by calling code.
 *
 * @module services/allergy/validation
 * @security Validates data integrity before PHI operations
 * @compliance Healthcare data validation standards, referential integrity requirements
 * @since 1.0.0
 */

import { Op, Transaction } from 'sequelize';
import { Allergy as AllergyModel, Student } from '../../database/models';
import { CreateAllergyData } from './types';

/**
 * Validates that a student record exists before creating or modifying allergy data.
 *
 * Ensures referential integrity by verifying the student exists in the database
 * before any allergy operations. This prevents orphaned allergy records and maintains
 * data consistency critical for patient safety workflows.
 *
 * @param {string} studentId - Unique student identifier (UUID) to validate
 * @param {Transaction} [transaction] - Optional Sequelize transaction for atomic validation
 *
 * @returns {Promise<void>} Resolves if student exists, rejects if not found
 *
 * @throws {Error} "Student not found" - if studentId doesn't exist in Student table
 * @throws {Error} Database error - if Sequelize query fails
 *
 * @security Prevents orphaned allergy records that could cause safety system failures
 * @compliance Referential integrity requirement for healthcare data
 *
 * @example
 * ```typescript
 * // Validate student before creating allergy
 * try {
 *   await validateStudentExists('student-uuid-123');
 *   // Safe to proceed with allergy creation
 * } catch (error) {
 *   console.error('Cannot create allergy: student not found');
 * }
 * ```
 *
 * @remarks
 * Always call this before creating new allergy records to ensure data integrity.
 * Supports transactions for atomic multi-step operations where validation and
 * creation must occur together or rollback completely.
 */
export async function validateStudentExists(
  studentId: string,
  transaction?: Transaction
): Promise<void> {
  const student = await Student.findByPk(studentId, { transaction });
  if (!student) {
    throw new Error('Student not found');
  }
}

/**
 * Prevents duplicate active allergy records for the same allergen and student.
 *
 * This PATIENT SAFETY function ensures that only one active allergy record exists
 * per allergen per student, preventing confusion in medication cross-checking and
 * emergency response. Duplicate allergies can cause medication systems to show
 * incorrect or conflicting information, potentially endangering patients.
 *
 * @param {string} studentId - Student's unique identifier
 * @param {string} allergen - Allergen name to check (case-sensitive exact match)
 * @param {Transaction} [transaction] - Optional transaction for atomic validation
 *
 * @returns {Promise<void>} Resolves if no duplicate exists, rejects if duplicate found
 *
 * @throws {Error} "Student already has an active allergy record for {allergen}" - if duplicate exists
 * @throws {Error} Database error - if Sequelize query fails
 *
 * @security Prevents duplicate allergy records that could confuse medication systems
 * @compliance Clinical data uniqueness requirement, medication safety standards
 *
 * @example
 * ```typescript
 * // Prevent duplicate penicillin allergy
 * try {
 *   await checkDuplicateAllergy('student-uuid-123', 'Penicillin');
 *   // Safe to create new penicillin allergy record
 * } catch (error) {
 *   console.error('Duplicate allergy blocked:', error.message);
 *   // Suggest updating existing record instead
 * }
 * ```
 *
 * @warning Only checks ACTIVE allergies (active=true) - inactive allergies are allowed
 * @warning Allergen matching is case-sensitive - normalize allergen names before validation
 *
 * @remarks
 * If an inactive allergy exists for the same allergen, this validation passes.
 * To update an existing inactive allergy, use updateAllergy() to set isActive=true
 * instead of creating a new record. This maintains clinical history continuity.
 *
 * @see {@link validateAllergyData} for comprehensive validation including duplicate check
 */
export async function checkDuplicateAllergy(
  studentId: string,
  allergen: string,
  transaction?: Transaction
): Promise<void> {
  const existingAllergy = await AllergyModel.findOne({
    where: {
      studentId,
      allergen,
      active: true
    },
    transaction
  });

  if (existingAllergy) {
    throw new Error(`Student already has an active allergy record for ${allergen}`);
  }
}

/**
 * Validates all student IDs exist before bulk allergy operations.
 *
 * Batch-validates multiple student IDs in a single database query for performance.
 * Ensures all students exist before proceeding with bulk allergy import or creation,
 * preventing partial failures that could leave data in an inconsistent state.
 *
 * @param {string[]} studentIds - Array of unique student identifiers to validate
 * @param {Transaction} [transaction] - Optional transaction for atomic bulk validation
 *
 * @returns {Promise<void>} Resolves if all student IDs exist, rejects if any are invalid
 *
 * @throws {Error} "One or more student IDs are invalid" - if any studentId doesn't exist
 * @throws {Error} Database error - if Sequelize query fails
 *
 * @security Prevents bulk operations from creating orphaned allergy records
 * @compliance Data integrity requirement for bulk healthcare data imports
 *
 * @example
 * ```typescript
 * // Validate students before bulk allergy import
 * const allergiesData = [
 *   { studentId: 'student-1', allergen: 'Penicillin', severity: 'SEVERE' },
 *   { studentId: 'student-2', allergen: 'Peanuts', severity: 'LIFE_THREATENING' }
 * ];
 * const studentIds = allergiesData.map(a => a.studentId);
 *
 * try {
 *   await validateBulkStudentIds(studentIds);
 *   // Safe to proceed with bulk creation
 *   await bulkCreateAllergies(allergiesData);
 * } catch (error) {
 *   console.error('Bulk validation failed:', error.message);
 * }
 * ```
 *
 * @remarks
 * Uses IN query for efficient batch validation. Automatically deduplicates student IDs
 * in the calling code before validation. If validation fails, the error doesn't indicate
 * WHICH student IDs are invalid - perform individual validation for detailed feedback.
 */
export async function validateBulkStudentIds(
  studentIds: string[],
  transaction?: Transaction
): Promise<void> {
  const students = await Student.findAll({
    where: { id: { [Op.in]: studentIds } },
    attributes: ['id'],
    transaction
  });

  if (students.length !== studentIds.length) {
    throw new Error('One or more student IDs are invalid');
  }
}

/**
 * Comprehensive validation of allergy data before creation.
 *
 * Performs complete validation suite including student existence verification and
 * duplicate allergy checking. This is the primary validation entry point called by
 * createAllergy() to ensure all patient safety requirements are met before persisting
 * new allergy records.
 *
 * @param {CreateAllergyData} data - Complete allergy data to validate
 * @param {string} data.studentId - Student ID (validated for existence)
 * @param {string} data.allergen - Allergen name (validated for duplicates)
 * @param {AllergySeverity} data.severity - Severity level (assumed valid from type system)
 * @param {Transaction} [transaction] - Optional transaction for atomic validation
 *
 * @returns {Promise<void>} Resolves if all validations pass, rejects on any failure
 *
 * @throws {Error} "Student not found" - if studentId doesn't exist
 * @throws {Error} "Student already has an active allergy record for {allergen}" - if duplicate
 * @throws {Error} Database error - if validation queries fail
 *
 * @security Ensures only valid, non-duplicate allergy data enters the system
 * @compliance Healthcare data validation standards, patient safety requirements
 *
 * @example
 * ```typescript
 * // Comprehensive validation before allergy creation
 * const allergyData = {
 *   studentId: 'student-uuid-123',
 *   allergen: 'Penicillin',
 *   severity: 'SEVERE',
 *   reaction: 'Anaphylaxis',
 *   verified: false
 * };
 *
 * try {
 *   await validateAllergyData(allergyData);
 *   // All validations passed - safe to create allergy
 *   const allergy = await AllergyModel.create(allergyData);
 * } catch (error) {
 *   console.error('Validation failed:', error.message);
 * }
 * ```
 *
 * @remarks
 * This function aggregates multiple validation checks in sequence. Validation stops
 * at the first failure and throws immediately. For better error reporting, consider
 * collecting all validation errors before throwing (future enhancement).
 *
 * Validation order:
 * 1. Student existence (validateStudentExists)
 * 2. Duplicate allergy check (checkDuplicateAllergy)
 *
 * @see {@link validateStudentExists} for student verification
 * @see {@link checkDuplicateAllergy} for duplicate prevention
 */
export async function validateAllergyData(
  data: CreateAllergyData,
  transaction?: Transaction
): Promise<void> {
  await validateStudentExists(data.studentId, transaction);
  await checkDuplicateAllergy(data.studentId, data.allergen, transaction);
}
