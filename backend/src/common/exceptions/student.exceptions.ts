/**
 * @fileoverview Student-Related Exception Classes
 * @module common/exceptions/student
 * @description Typed exception classes for student management operations.
 * Provides better error handling and type safety compared to generic NestJS exceptions.
 *
 * @since 1.0.0
 * @category Exceptions
 * @hipaaCompliant Error messages must not expose PHI in logs
 */

import {
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

/**
 * Context information for student-related errors.
 *
 * @interface StudentErrorContext
 * @category Error Context
 *
 * @property {string} [studentId] - Student UUID
 * @property {string} [studentNumber] - Student number
 * @property {string} [operation] - Operation being performed
 * @property {Record<string, unknown>} [additionalInfo] - Extra context
 *
 * @example
 * ```typescript
 * const context: StudentErrorContext = {
 *   studentId: 'uuid-123',
 *   studentNumber: 'STU2025001',
 *   operation: 'update',
 *   additionalInfo: {
 *     field: 'grade',
 *     attemptedValue: 'invalid'
 *   }
 * };
 * ```
 */
export interface StudentErrorContext {
  studentId?: string;
  studentNumber?: string;
  operation?: string;
  additionalInfo?: Record<string, unknown>;
}

/**
 * Exception thrown when a student is not found.
 *
 * @class StudentNotFoundException
 * @extends {NotFoundException}
 * @category Student Exceptions
 *
 * @param {string} studentId - Student UUID or student number
 * @param {StudentErrorContext} [context] - Additional error context
 *
 * @example
 * ```typescript
 * throw new StudentNotFoundException('uuid-123', {
 *   operation: 'findOne',
 *   additionalInfo: { searchedBy: 'id' }
 * });
 * ```
 *
 * @remarks
 * - HTTP Status: 404 Not Found
 * - Error code: STUDENT_NOT_FOUND
 * - HIPAA: Safe to log (no PHI in message)
 *
 * @since 1.0.0
 */
export class StudentNotFoundException extends NotFoundException {
  public readonly code = 'STUDENT_NOT_FOUND';
  public readonly context?: StudentErrorContext;

  constructor(studentId: string, context?: StudentErrorContext) {
    super(`Student with ID ${studentId} not found`);
    this.name = 'StudentNotFoundException';
    this.context = context;
  }
}

/**
 * Exception thrown when a student number already exists.
 *
 * @class StudentNumberConflictException
 * @extends {ConflictException}
 * @category Student Exceptions
 *
 * @param {string} studentNumber - Duplicate student number
 * @param {StudentErrorContext} [context] - Additional error context
 *
 * @example
 * ```typescript
 * throw new StudentNumberConflictException('STU2025001', {
 *   operation: 'create',
 *   additionalInfo: { existingStudentId: 'uuid-existing' }
 * });
 * ```
 *
 * @remarks
 * - HTTP Status: 409 Conflict
 * - Error code: STUDENT_NUMBER_CONFLICT
 * - HIPAA: Safe to log (student number is not PHI)
 *
 * @since 1.0.0
 */
export class StudentNumberConflictException extends ConflictException {
  public readonly code = 'STUDENT_NUMBER_CONFLICT';
  public readonly context?: StudentErrorContext;

  constructor(studentNumber: string, context?: StudentErrorContext) {
    super(
      `Student number ${studentNumber} already exists. Please use a unique student number.`,
    );
    this.name = 'StudentNumberConflictException';
    this.context = context;
  }
}

/**
 * Exception thrown when a medical record number already exists.
 *
 * @class MedicalRecordNumberConflictException
 * @extends {ConflictException}
 * @category Student Exceptions
 *
 * @param {string} medicalRecordNumber - Duplicate medical record number
 * @param {StudentErrorContext} [context] - Additional error context
 *
 * @example
 * ```typescript
 * throw new MedicalRecordNumberConflictException('MRN2025001', {
 *   studentId: 'uuid-123',
 *   operation: 'update'
 * });
 * ```
 *
 * @remarks
 * - HTTP Status: 409 Conflict
 * - Error code: MEDICAL_RECORD_NUMBER_CONFLICT
 * - HIPAA: Medical record number is PHI - handle with care
 *
 * @since 1.0.0
 * @hipaaCompliant PHI field - audit all accesses
 */
export class MedicalRecordNumberConflictException extends ConflictException {
  public readonly code = 'MEDICAL_RECORD_NUMBER_CONFLICT';
  public readonly context?: StudentErrorContext;

  constructor(medicalRecordNumber: string, context?: StudentErrorContext) {
    super(
      'Medical record number already exists. Each student must have a unique medical record number.',
    );
    this.name = 'MedicalRecordNumberConflictException';
    this.context = context;
  }
}

/**
 * Exception thrown when date of birth validation fails.
 *
 * @class InvalidDateOfBirthException
 * @extends {BadRequestException}
 * @category Student Exceptions
 *
 * @param {string} reason - Specific reason for validation failure
 * @param {StudentErrorContext} [context] - Additional error context
 *
 * @example
 * ```typescript
 * throw new InvalidDateOfBirthException('Date of birth must be in the past', {
 *   studentId: 'uuid-123',
 *   operation: 'create',
 *   additionalInfo: { providedDate: '2025-01-01' }
 * });
 * ```
 *
 * @remarks
 * - HTTP Status: 400 Bad Request
 * - Error code: INVALID_DATE_OF_BIRTH
 * - HIPAA: Date of birth is PHI - handle with care
 *
 * @since 1.0.0
 * @hipaaCompliant PHI field - audit all accesses
 */
export class InvalidDateOfBirthException extends BadRequestException {
  public readonly code = 'INVALID_DATE_OF_BIRTH';
  public readonly context?: StudentErrorContext;

  constructor(reason: string, context?: StudentErrorContext) {
    super(reason);
    this.name = 'InvalidDateOfBirthException';
    this.context = context;
  }
}

/**
 * Exception thrown when nurse assignment validation fails.
 *
 * @class InvalidNurseAssignmentException
 * @extends {NotFoundException}
 * @category Student Exceptions
 *
 * @param {string} nurseId - Invalid nurse UUID
 * @param {StudentErrorContext} [context] - Additional error context
 *
 * @example
 * ```typescript
 * throw new InvalidNurseAssignmentException('uuid-nurse-999', {
 *   studentId: 'uuid-123',
 *   operation: 'assignNurse',
 *   additionalInfo: { reason: 'nurse not active' }
 * });
 * ```
 *
 * @remarks
 * - HTTP Status: 404 Not Found
 * - Error code: INVALID_NURSE_ASSIGNMENT
 * - HIPAA: Safe to log (nurse ID is not PHI)
 *
 * @since 1.0.0
 */
export class InvalidNurseAssignmentException extends NotFoundException {
  public readonly code = 'INVALID_NURSE_ASSIGNMENT';
  public readonly context?: StudentErrorContext;

  constructor(nurseId: string, context?: StudentErrorContext) {
    super(
      'Assigned nurse not found. Please select a valid, active nurse.',
    );
    this.name = 'InvalidNurseAssignmentException';
    this.context = context;
  }
}

/**
 * Exception thrown when UUID format validation fails.
 *
 * @class InvalidUUIDException
 * @extends {BadRequestException}
 * @category Student Exceptions
 *
 * @param {string} fieldName - Name of the field with invalid UUID
 * @param {string} value - Invalid UUID value
 * @param {StudentErrorContext} [context] - Additional error context
 *
 * @example
 * ```typescript
 * throw new InvalidUUIDException('studentId', 'not-a-uuid', {
 *   operation: 'findOne'
 * });
 * ```
 *
 * @remarks
 * - HTTP Status: 400 Bad Request
 * - Error code: INVALID_UUID
 * - HIPAA: Safe to log (UUIDs are not PHI)
 *
 * @since 1.0.0
 */
export class InvalidUUIDException extends BadRequestException {
  public readonly code = 'INVALID_UUID';
  public readonly context?: StudentErrorContext;

  constructor(fieldName: string, value: string, context?: StudentErrorContext) {
    super(`Invalid ${fieldName} format. Must be a valid UUID.`);
    this.name = 'InvalidUUIDException';
    this.context = context;
  }
}

/**
 * Exception thrown when student data processing fails unexpectedly.
 *
 * @class StudentDataProcessingException
 * @extends {InternalServerErrorException}
 * @category Student Exceptions
 *
 * @param {string} operation - Operation that failed
 * @param {Error} [originalError] - Original error that caused the failure
 * @param {StudentErrorContext} [context] - Additional error context
 *
 * @example
 * ```typescript
 * try {
 *   await processStudent(data);
 * } catch (error) {
 *   throw new StudentDataProcessingException(
 *     'createStudent',
 *     error,
 *     { studentNumber: 'STU2025001' }
 *   );
 * }
 * ```
 *
 * @remarks
 * - HTTP Status: 500 Internal Server Error
 * - Error code: STUDENT_DATA_PROCESSING_ERROR
 * - HIPAA: Must not expose PHI in error messages or logs
 *
 * @since 1.0.0
 * @hipaaCompliant Must sanitize all error messages
 */
export class StudentDataProcessingException extends InternalServerErrorException {
  public readonly code = 'STUDENT_DATA_PROCESSING_ERROR';
  public readonly context?: StudentErrorContext;
  public readonly originalError?: Error;

  constructor(
    operation: string,
    originalError?: Error,
    context?: StudentErrorContext,
  ) {
    super(`Failed to ${operation}. Please try again later.`);
    this.name = 'StudentDataProcessingException';
    this.originalError = originalError;
    this.context = context;
  }
}
