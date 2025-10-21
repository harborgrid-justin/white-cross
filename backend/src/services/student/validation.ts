/**
 * LOC: C41E6D37EC-V01
 * WC-SVC-STU-VALIDATION | Student Data Validation Module
 *
 * UPSTREAM (imports from):
 *   - logger.ts (utils/logger.ts)
 *   - models (database/models)
 *   - types.ts (./types.ts)
 *
 * DOWNSTREAM (imported by):
 *   - crud.ts (./crud.ts)
 *   - enrollment.ts (./enrollment.ts)
 */

/**
 * WC-SVC-STU-VALIDATION | Student Data Validation Module
 * Purpose: Validates student data according to business rules and HIPAA requirements
 * Upstream: database models, utils/logger | Dependencies: Sequelize
 * Downstream: CRUD operations, enrollment management | Called by: Student service modules
 * Related: studentService.ts, types.ts
 * Exports: StudentValidator class
 * Last Updated: 2025-10-19 | Dependencies: sequelize
 * Critical Path: Input validation → Business rules → Database constraints
 * LLM Context: HIPAA-compliant validation with comprehensive error handling
 */

import { Op } from 'sequelize';
import { logger } from '../../utils/logger';
import { Student, User } from '../../database/models';
import { CreateStudentData, UpdateStudentData, NormalizationResult } from './types';

/**
 * Student Validator
 * Handles all validation logic for student data
 */
export class StudentValidator {
  /**
   * Validate and normalize student number
   * @param studentNumber - Raw student number
   * @param excludeId - Student ID to exclude from duplicate check (for updates)
   * @returns Normalized student number
   */
  static async validateStudentNumber(
    studentNumber: string,
    excludeId?: string
  ): Promise<string> {
    const normalized = studentNumber.toUpperCase().trim();

    // Check for duplicates
    const whereClause: any = { studentNumber: normalized };
    if (excludeId) {
      whereClause.id = { [Op.ne]: excludeId };
    }

    const existing = await Student.findOne({ where: whereClause });

    if (existing) {
      throw new Error('Student number already exists. Please use a unique student number.');
    }

    return normalized;
  }

  /**
   * Validate and normalize medical record number
   * @param medicalRecordNum - Raw medical record number
   * @param excludeId - Student ID to exclude from duplicate check (for updates)
   * @returns Normalized medical record number
   */
  static async validateMedicalRecordNumber(
    medicalRecordNum: string,
    excludeId?: string
  ): Promise<string> {
    const normalized = medicalRecordNum.toUpperCase().trim();

    // Check for duplicates
    const whereClause: any = { medicalRecordNum: normalized };
    if (excludeId) {
      whereClause.id = { [Op.ne]: excludeId };
    }

    const existing = await Student.findOne({ where: whereClause });

    if (existing) {
      throw new Error('Medical record number already exists. Each student must have a unique medical record number.');
    }

    return normalized;
  }

  /**
   * Validate date of birth
   * @param dateOfBirth - Date of birth to validate
   * @throws Error if date is invalid
   */
  static validateDateOfBirth(dateOfBirth: Date): void {
    const dob = new Date(dateOfBirth);
    const today = new Date();
    const age = today.getFullYear() - dob.getFullYear();

    if (dob >= today) {
      throw new Error('Date of birth must be in the past.');
    }

    if (age < 3 || age > 100) {
      throw new Error('Student age must be between 3 and 100 years.');
    }
  }

  /**
   * Validate nurse assignment
   * @param nurseId - Nurse/User ID
   * @throws Error if nurse not found
   */
  static async validateNurseAssignment(nurseId: string): Promise<void> {
    const nurse = await User.findByPk(nurseId);
    if (!nurse) {
      throw new Error('Assigned nurse not found. Please select a valid nurse.');
    }
  }

  /**
   * Validate UUID format
   * @param id - UUID to validate
   * @throws Error if UUID is invalid
   */
  static validateUUID(id: string): void {
    if (!id || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
      throw new Error('Invalid student ID format. Must be a valid UUID.');
    }
  }

  /**
   * Normalize student creation data
   * @param data - Raw student creation data
   * @returns Normalized data
   */
  static normalizeCreateData(data: CreateStudentData): CreateStudentData {
    return {
      ...data,
      firstName: data.firstName.trim(),
      lastName: data.lastName.trim(),
      studentNumber: data.studentNumber.toUpperCase().trim(),
      medicalRecordNum: data.medicalRecordNum?.toUpperCase().trim(),
      enrollmentDate: data.enrollmentDate || new Date()
    };
  }

  /**
   * Normalize student update data
   * @param data - Raw student update data
   * @returns Normalized data
   */
  static normalizeUpdateData(data: UpdateStudentData): UpdateStudentData {
    const normalized: UpdateStudentData = { ...data };

    if (data.firstName) {
      normalized.firstName = data.firstName.trim();
    }
    if (data.lastName) {
      normalized.lastName = data.lastName.trim();
    }
    if (data.studentNumber) {
      normalized.studentNumber = data.studentNumber.toUpperCase().trim();
    }
    if (data.medicalRecordNum) {
      normalized.medicalRecordNum = data.medicalRecordNum.toUpperCase().trim();
    }

    return normalized;
  }

  /**
   * Validate complete student creation data
   * @param data - Student creation data
   * @throws Error if validation fails
   */
  static async validateCreateData(data: CreateStudentData): Promise<void> {
    // Validate student number uniqueness
    await this.validateStudentNumber(data.studentNumber);

    // Validate medical record number if provided
    if (data.medicalRecordNum) {
      await this.validateMedicalRecordNumber(data.medicalRecordNum);
    }

    // Validate date of birth
    this.validateDateOfBirth(data.dateOfBirth);

    // Validate nurse assignment if provided
    if (data.nurseId) {
      await this.validateNurseAssignment(data.nurseId);
    }
  }

  /**
   * Validate student update data
   * @param id - Student ID
   * @param data - Update data
   * @param existingStudent - Existing student record
   * @throws Error if validation fails
   */
  static async validateUpdateData(
    id: string,
    data: UpdateStudentData,
    existingStudent: any
  ): Promise<void> {
    // Validate UUID format
    this.validateUUID(id);

    // Validate student number if being updated
    if (data.studentNumber && data.studentNumber.toUpperCase().trim() !== existingStudent.studentNumber) {
      await this.validateStudentNumber(data.studentNumber, id);
    }

    // Validate medical record number if being updated
    if (data.medicalRecordNum && data.medicalRecordNum.toUpperCase().trim() !== existingStudent.medicalRecordNum) {
      await this.validateMedicalRecordNumber(data.medicalRecordNum, id);
    }

    // Validate date of birth if being updated
    if (data.dateOfBirth) {
      this.validateDateOfBirth(data.dateOfBirth);
    }

    // Validate nurse assignment if being updated
    if (data.nurseId) {
      await this.validateNurseAssignment(data.nurseId);
    }
  }

  /**
   * Handle Sequelize validation errors
   * @param error - Error object
   * @throws User-friendly error
   */
  static handleSequelizeError(error: any): never {
    if (error.name === 'SequelizeValidationError') {
      const validationErrors = error.errors.map((e: any) => e.message).join(', ');
      throw new Error(`Validation failed: ${validationErrors}`);
    }

    if (error.name === 'SequelizeUniqueConstraintError') {
      throw new Error('A student with this student number or medical record number already exists.');
    }

    throw error;
  }
}
