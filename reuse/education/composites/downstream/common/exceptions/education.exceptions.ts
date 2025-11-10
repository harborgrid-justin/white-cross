/**
 * Education System Custom Exceptions
 *
 * Domain-specific exceptions for education system operations.
 */

import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * Base Education Exception
 */
export class EducationException extends HttpException {
  constructor(message: string, statusCode: HttpStatus, context?: any) {
    super(
      {
        message,
        statusCode,
        context,
        timestamp: new Date().toISOString()
      },
      statusCode
    );
  }
}

/**
 * Enrollment Exceptions
 */
export class EnrollmentException extends EducationException {
  constructor(message: string, statusCode: HttpStatus, context?: any) {
    super(message, statusCode, { ...context, domain: 'enrollment' });
  }
}

export class EnrollmentCapacityException extends EnrollmentException {
  constructor(courseId: string, availableSeats: number) {
    super(
      'Course capacity reached',
      HttpStatus.CONFLICT,
      { courseId, availableSeats }
    );
  }
}

export class PrerequisiteNotMetException extends EnrollmentException {
  constructor(courseId: string, missingPrereqs: string[]) {
    super(
      'Prerequisites not met',
      HttpStatus.BAD_REQUEST,
      { courseId, missingPrereqs }
    );
  }
}

export class EnrollmentPeriodClosedException extends EnrollmentException {
  constructor(termId: string, closedDate: Date) {
    super(
      'Enrollment period has closed',
      HttpStatus.FORBIDDEN,
      { termId, closedDate }
    );
  }
}

/**
 * Academic Exceptions
 */
export class AcademicException extends EducationException {
  constructor(message: string, statusCode: HttpStatus, context?: any) {
    super(message, statusCode, { ...context, domain: 'academic' });
  }
}

export class GradeNotFoundException extends AcademicException {
  constructor(studentId: string, courseId: string) {
    super(
      'Grade not found',
      HttpStatus.NOT_FOUND,
      { studentId, courseId }
    );
  }
}

export class InvalidGradeException extends AcademicException {
  constructor(grade: string, validGrades: string[]) {
    super(
      'Invalid grade value',
      HttpStatus.BAD_REQUEST,
      { grade, validGrades }
    );
  }
}

export class TranscriptLockedException extends AcademicException {
  constructor(studentId: string, reason: string) {
    super(
      'Transcript is locked',
      HttpStatus.FORBIDDEN,
      { studentId, reason }
    );
  }
}

/**
 * Financial Exceptions
 */
export class FinancialException extends EducationException {
  constructor(message: string, statusCode: HttpStatus, context?: any) {
    super(message, statusCode, { ...context, domain: 'financial' });
  }
}

export class PaymentRequiredException extends FinancialException {
  constructor(studentId: string, outstandingBalance: number) {
    super(
      'Payment required before proceeding',
      HttpStatus.PAYMENT_REQUIRED,
      { studentId, outstandingBalance }
    );
  }
}

export class FinancialHoldException extends FinancialException {
  constructor(studentId: string, holdType: string) {
    super(
      'Financial hold prevents action',
      HttpStatus.FORBIDDEN,
      { studentId, holdType }
    );
  }
}

/**
 * Student Exceptions
 */
export class StudentException extends EducationException {
  constructor(message: string, statusCode: HttpStatus, context?: any) {
    super(message, statusCode, { ...context, domain: 'student' });
  }
}

export class StudentNotFoundException extends StudentException {
  constructor(studentId: string) {
    super(
      'Student not found',
      HttpStatus.NOT_FOUND,
      { studentId }
    );
  }
}

export class StudentInactiveException extends StudentException {
  constructor(studentId: string, status: string) {
    super(
      'Student account is inactive',
      HttpStatus.FORBIDDEN,
      { studentId, status }
    );
  }
}

/**
 * Registration Exceptions
 */
export class RegistrationException extends EducationException {
  constructor(message: string, statusCode: HttpStatus, context?: any) {
    super(message, statusCode, { ...context, domain: 'registration' });
  }
}

export class RegistrationConflictException extends RegistrationException {
  constructor(studentId: string, conflictingCourses: string[]) {
    super(
      'Schedule conflict detected',
      HttpStatus.CONFLICT,
      { studentId, conflictingCourses }
    );
  }
}

export class WaitlistFullException extends RegistrationException {
  constructor(courseId: string, waitlistCapacity: number) {
    super(
      'Waitlist is full',
      HttpStatus.CONFLICT,
      { courseId, waitlistCapacity }
    );
  }
}

/**
 * Validation Exceptions
 */
export class ValidationException extends EducationException {
  constructor(message: string, errors: any[]) {
    super(
      message,
      HttpStatus.BAD_REQUEST,
      { errors }
    );
  }
}

/**
 * Data Integrity Exceptions
 */
export class DataIntegrityException extends EducationException {
  constructor(message: string, context?: any) {
    super(
      message,
      HttpStatus.INTERNAL_SERVER_ERROR,
      { ...context, type: 'data_integrity' }
    );
  }
}
