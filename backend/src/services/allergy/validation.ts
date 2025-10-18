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
 * Allergy Validation Module
 *
 * Handles validation logic for allergy operations
 *
 * @module services/allergy/validation
 */

import { Op, Transaction } from 'sequelize';
import { Allergy as AllergyModel, Student } from '../../database/models';
import { CreateAllergyData } from './types';

/**
 * Validates that a student exists in the database
 *
 * @param studentId - Student ID to validate
 * @param transaction - Optional transaction
 * @throws Error if student does not exist
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
 * Checks if a student already has an active allergy for a specific allergen
 *
 * @param studentId - Student ID
 * @param allergen - Allergen name
 * @param transaction - Optional transaction
 * @throws Error if duplicate allergy exists
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
 * Validates all student IDs in a bulk operation
 *
 * @param studentIds - Array of student IDs
 * @param transaction - Optional transaction
 * @throws Error if any student ID is invalid
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
 * Validates allergy data before creation
 *
 * @param data - Allergy data to validate
 * @param transaction - Optional transaction
 */
export async function validateAllergyData(
  data: CreateAllergyData,
  transaction?: Transaction
): Promise<void> {
  await validateStudentExists(data.studentId, transaction);
  await checkDuplicateAllergy(data.studentId, data.allergen, transaction);
}
