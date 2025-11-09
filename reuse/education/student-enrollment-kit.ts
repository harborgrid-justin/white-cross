/**
 * LOC: EDU-ENROLL-001
 * File: /reuse/education/student-enrollment-kit.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize (ORM for database operations)
 *   - @nestjs/common (NestJS framework)
 *   - @nestjs/swagger (API documentation)
 *
 * DOWNSTREAM (imported by):
 *   - Backend education modules
 *   - Student information services
 *   - Registration services
 *   - Academic advising modules
 */

/**
 * File: /reuse/education/student-enrollment-kit.ts
 * Locator: WC-EDU-ENROLL-001
 * Purpose: Comprehensive Student Enrollment Management - Ellucian SIS-level enrollment processing, verification, capacity management
 *
 * Upstream: Sequelize 6.x, NestJS 10.x, TypeScript 5.x
 * Downstream: ../backend/education/*, Student Services, Registration, Academic Advising
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x, PostgreSQL 14+
 * Exports: 45+ functions for enrollment management, verification, transfer/international students, holds, capacity, waitlist, fees
 *
 * LLM Context: Enterprise-grade student enrollment management for higher education SIS.
 * Provides comprehensive enrollment processing, enrollment verification, transfer student handling,
 * international student enrollment, enrollment holds and restrictions, capacity management,
 * waitlist processing, enrollment fee calculation, SEVIS compliance, enrollment status tracking,
 * and full integration with academic calendar and course registration systems.
 */

import { Model, DataTypes, Sequelize, Transaction, Op, ValidationError } from 'sequelize';
import { Injectable } from '@nestjs/common';
import { ApiProperty, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface EnrollmentMetrics {
  totalEnrollment: number;
  fullTimeCount: number;
  partTimeCount: number;
  newStudentsCount: number;
  returningStudentsCount: number;
  transferStudentsCount: number;
  internationalStudentsCount: number;
}

interface EnrollmentVerification {
  studentId: number;
  enrollmentId: number;
  verificationDate: Date;
  verificationType: 'full-time' | 'part-time' | 'graduated' | 'withdrawn' | 'on-leave';
  creditsEnrolled: number;
  verifiedBy: string;
  verificationDocument: string;
  expirationDate: Date;
}

interface TransferCredit {
  studentId: number;
  institutionName: string;
  institutionCode: string;
  courseTitle: string;
  courseNumber: string;
  credits: number;
  grade: string;
  transferStatus: 'pending' | 'approved' | 'denied' | 'in-review';
  equivalentCourseId?: number;
  evaluatedBy?: string;
  evaluationDate?: Date;
}

interface InternationalStudentData {
  studentId: number;
  sevisId: string;
  visaType: string;
  visaExpirationDate: Date;
  i20IssueDate: Date;
  programStartDate: Date;
  programEndDate: Date;
  fullTimeRequirement: number;
  countryOfOrigin: string;
  sponsorName?: string;
  financialDocumentDate: Date;
}

interface EnrollmentHold {
  holdId: string;
  studentId: number;
  holdType: 'financial' | 'academic' | 'disciplinary' | 'administrative' | 'medical' | 'immunization';
  holdReason: string;
  placedBy: string;
  placedDate: Date;
  releasedBy?: string;
  releasedDate?: Date;
  isActive: boolean;
  blockEnrollment: boolean;
  blockTranscripts: boolean;
  blockGraduation: boolean;
}

interface EnrollmentCapacity {
  courseId: number;
  sectionId: number;
  termId: number;
  maxCapacity: number;
  currentEnrollment: number;
  waitlistCapacity: number;
  currentWaitlist: number;
  reservedSeats: number;
  availableSeats: number;
}

interface WaitlistEntry {
  waitlistId: number;
  studentId: number;
  courseId: number;
  sectionId: number;
  termId: number;
  position: number;
  addedDate: Date;
  notifiedDate?: Date;
  expirationDate: Date;
  status: 'active' | 'notified' | 'enrolled' | 'expired' | 'cancelled';
}

interface EnrollmentFee {
  feeId: string;
  studentId: number;
  termId: number;
  feeType: 'tuition' | 'technology' | 'lab' | 'course' | 'activity' | 'health' | 'parking';
  feeAmount: number;
  credits: number;
  feePerCredit?: number;
  dueDate: Date;
  paidAmount: number;
  isPaid: boolean;
  paymentDate?: Date;
}

interface EnrollmentRestriction {
  restrictionId: string;
  studentId: number;
  restrictionType: string;
  restrictionReason: string;
  effectiveDate: Date;
  expirationDate?: Date;
  isActive: boolean;
  allowedOverride: boolean;
}

// ============================================================================
// DTO CLASSES
// ============================================================================

export class CreateStudentDto {
  @ApiProperty({ description: 'Student ID number', example: 'S-2024-001234' })
  studentNumber!: string;

  @ApiProperty({ description: 'First name', example: 'John' })
  firstName!: string;

  @ApiProperty({ description: 'Last name', example: 'Doe' })
  lastName!: string;

  @ApiProperty({ description: 'Middle name', required: false })
  middleName?: string;

  @ApiProperty({ description: 'Email address', example: 'john.doe@university.edu' })
  email!: string;

  @ApiProperty({ description: 'Date of birth' })
  dateOfBirth!: Date;

  @ApiProperty({ description: 'Admission date' })
  admissionDate!: Date;

  @ApiProperty({ description: 'Student type', enum: ['new', 'transfer', 'returning', 'international'] })
  studentType!: string;

  @ApiProperty({ description: 'Academic level', enum: ['freshman', 'sophomore', 'junior', 'senior', 'graduate'] })
  academicLevel!: string;
}

export class CreateEnrollmentDto {
  @ApiProperty({ description: 'Student ID' })
  studentId!: number;

  @ApiProperty({ description: 'Course ID' })
  courseId!: number;

  @ApiProperty({ description: 'Section ID' })
  sectionId!: number;

  @ApiProperty({ description: 'Term ID' })
  termId!: number;

  @ApiProperty({ description: 'Enrollment date' })
  enrollmentDate!: Date;

  @ApiProperty({ description: 'Enrollment status', enum: ['enrolled', 'dropped', 'withdrawn', 'completed'] })
  enrollmentStatus!: string;

  @ApiProperty({ description: 'Credits', example: 3 })
  credits!: number;

  @ApiProperty({ description: 'Grading option', enum: ['letter', 'pass-fail', 'audit'] })
  gradingOption!: string;
}

export class EnrollmentVerificationDto {
  @ApiProperty({ description: 'Student ID' })
  studentId!: number;

  @ApiProperty({ description: 'Verification type', enum: ['full-time', 'part-time', 'graduated', 'withdrawn', 'on-leave'] })
  verificationType!: string;

  @ApiProperty({ description: 'Term ID' })
  termId!: number;

  @ApiProperty({ description: 'Credits enrolled' })
  creditsEnrolled!: number;
}

export class TransferCreditDto {
  @ApiProperty({ description: 'Student ID' })
  studentId!: number;

  @ApiProperty({ description: 'Institution name' })
  institutionName!: string;

  @ApiProperty({ description: 'Course title' })
  courseTitle!: string;

  @ApiProperty({ description: 'Credits' })
  credits!: number;

  @ApiProperty({ description: 'Grade received' })
  grade!: string;
}

// ============================================================================
// SEQUELIZE MODELS
// ============================================================================

/**
 * Sequelize model for Student with comprehensive academic tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} Student model
 *
 * @example
 * ```typescript
 * const Student = createStudentModel(sequelize);
 * const student = await Student.create({
 *   studentNumber: 'S-2024-001234',
 *   firstName: 'John',
 *   lastName: 'Doe',
 *   email: 'john.doe@university.edu',
 *   studentType: 'new',
 *   academicLevel: 'freshman'
 * });
 * ```
 */
export const createStudentModel = (sequelize: Sequelize) => {
  class Student extends Model {
    public id!: number;
    public studentNumber!: string;
    public firstName!: string;
    public lastName!: string;
    public middleName!: string | null;
    public preferredName!: string | null;
    public email!: string;
    public alternateEmail!: string | null;
    public dateOfBirth!: Date;
    public ssn!: string | null;
    public gender!: string | null;
    public ethnicity!: string | null;
    public citizenship!: string;
    public admissionDate!: Date;
    public studentType!: string;
    public academicLevel!: string;
    public majorId!: number | null;
    public minorId!: number | null;
    public advisorId!: number | null;
    public enrollmentStatus!: string;
    public gpa!: number;
    public creditsEarned!: number;
    public creditsAttempted!: number;
    public expectedGraduationDate!: Date | null;
    public actualGraduationDate!: Date | null;
    public isInternational!: boolean;
    public isActive!: boolean;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
    public readonly createdBy!: string;
    public readonly updatedBy!: string;
  }

  Student.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      studentNumber: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Unique student identification number',
        validate: {
          notEmpty: true,
          len: [5, 50],
        },
      },
      firstName: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'Student first name',
        validate: {
          notEmpty: true,
          len: [1, 100],
        },
      },
      lastName: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'Student last name',
        validate: {
          notEmpty: true,
          len: [1, 100],
        },
      },
      middleName: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: 'Student middle name',
      },
      preferredName: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: 'Student preferred name',
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        comment: 'Primary email address',
        validate: {
          isEmail: true,
        },
      },
      alternateEmail: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: 'Alternate email address',
        validate: {
          isEmail: true,
        },
      },
      dateOfBirth: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        comment: 'Date of birth',
      },
      ssn: {
        type: DataTypes.STRING(11),
        allowNull: true,
        comment: 'Social Security Number (encrypted)',
      },
      gender: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Gender identity',
      },
      ethnicity: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: 'Ethnicity/race',
      },
      citizenship: {
        type: DataTypes.STRING(100),
        allowNull: false,
        defaultValue: 'US',
        comment: 'Citizenship status',
      },
      admissionDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        comment: 'Date of admission',
      },
      studentType: {
        type: DataTypes.ENUM('new', 'transfer', 'returning', 'international', 'visiting', 'non-degree'),
        allowNull: false,
        comment: 'Type of student',
      },
      academicLevel: {
        type: DataTypes.ENUM('freshman', 'sophomore', 'junior', 'senior', 'graduate', 'post-graduate', 'doctorate'),
        allowNull: false,
        comment: 'Current academic level',
      },
      majorId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'Primary major program ID',
      },
      minorId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'Minor program ID',
      },
      advisorId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'Academic advisor ID',
      },
      enrollmentStatus: {
        type: DataTypes.ENUM('active', 'inactive', 'withdrawn', 'graduated', 'suspended', 'on-leave'),
        allowNull: false,
        defaultValue: 'active',
        comment: 'Current enrollment status',
      },
      gpa: {
        type: DataTypes.DECIMAL(3, 2),
        allowNull: false,
        defaultValue: 0.00,
        comment: 'Cumulative GPA',
        validate: {
          min: 0.00,
          max: 4.00,
        },
      },
      creditsEarned: {
        type: DataTypes.DECIMAL(6, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Total credits earned',
        validate: {
          min: 0,
        },
      },
      creditsAttempted: {
        type: DataTypes.DECIMAL(6, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Total credits attempted',
        validate: {
          min: 0,
        },
      },
      expectedGraduationDate: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        comment: 'Expected graduation date',
      },
      actualGraduationDate: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        comment: 'Actual graduation date',
      },
      isInternational: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Is international student',
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        comment: 'Student active status',
      },
      metadata: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'Additional metadata',
      },
      createdBy: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'User who created the record',
      },
      updatedBy: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'User who last updated the record',
      },
    },
    {
      sequelize,
      tableName: 'students',
      timestamps: true,
      indexes: [
        { fields: ['studentNumber'], unique: true },
        { fields: ['email'], unique: true },
        { fields: ['studentType'] },
        { fields: ['academicLevel'] },
        { fields: ['enrollmentStatus'] },
        { fields: ['isInternational'] },
        { fields: ['advisorId'] },
        { fields: ['majorId'] },
      ],
      hooks: {
        beforeCreate: (student) => {
          if (!student.createdBy) {
            throw new Error('createdBy is required');
          }
          student.updatedBy = student.createdBy;
        },
        beforeUpdate: (student) => {
          if (!student.updatedBy) {
            throw new Error('updatedBy is required');
          }
        },
      },
    },
  );

  return Student;
};

/**
 * Sequelize model for Enrollment with status tracking and capacity management.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} Enrollment model
 *
 * @example
 * ```typescript
 * const Enrollment = createEnrollmentModel(sequelize);
 * const enrollment = await Enrollment.create({
 *   studentId: 1,
 *   courseId: 101,
 *   sectionId: 1,
 *   termId: 202401,
 *   enrollmentDate: new Date(),
 *   enrollmentStatus: 'enrolled',
 *   credits: 3
 * });
 * ```
 */
export const createEnrollmentModel = (sequelize: Sequelize) => {
  class Enrollment extends Model {
    public id!: number;
    public studentId!: number;
    public courseId!: number;
    public sectionId!: number;
    public termId!: number;
    public enrollmentDate!: Date;
    public enrollmentStatus!: string;
    public credits!: number;
    public gradingOption!: string;
    public grade!: string | null;
    public gradePoints!: number | null;
    public midtermGrade!: string | null;
    public attendancePercentage!: number;
    public dropDate!: Date | null;
    public withdrawalDate!: Date | null;
    public withdrawalReason!: string | null;
    public lastAttendanceDate!: Date | null;
    public isAudit!: boolean;
    public repeatCourse!: boolean;
    public repeatCount!: number;
    public tuitionCharged!: number;
    public feesPaid!: boolean;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
    public readonly enrolledBy!: string;
    public readonly updatedBy!: string;
  }

  Enrollment.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      studentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Reference to student',
        references: {
          model: 'students',
          key: 'id',
        },
      },
      courseId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Reference to course',
      },
      sectionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Reference to course section',
      },
      termId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Reference to academic term',
      },
      enrollmentDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        comment: 'Date enrolled',
      },
      enrollmentStatus: {
        type: DataTypes.ENUM('enrolled', 'dropped', 'withdrawn', 'completed', 'in-progress', 'failed'),
        allowNull: false,
        defaultValue: 'enrolled',
        comment: 'Current enrollment status',
      },
      credits: {
        type: DataTypes.DECIMAL(4, 2),
        allowNull: false,
        comment: 'Credit hours',
        validate: {
          min: 0,
          max: 20,
        },
      },
      gradingOption: {
        type: DataTypes.ENUM('letter', 'pass-fail', 'audit', 'credit-no-credit'),
        allowNull: false,
        defaultValue: 'letter',
        comment: 'Grading option selected',
      },
      grade: {
        type: DataTypes.STRING(5),
        allowNull: true,
        comment: 'Final grade',
      },
      gradePoints: {
        type: DataTypes.DECIMAL(4, 2),
        allowNull: true,
        comment: 'Grade points earned',
      },
      midtermGrade: {
        type: DataTypes.STRING(5),
        allowNull: true,
        comment: 'Midterm grade',
      },
      attendancePercentage: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        defaultValue: 100,
        comment: 'Attendance percentage',
        validate: {
          min: 0,
          max: 100,
        },
      },
      dropDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Date course was dropped',
      },
      withdrawalDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Date course was withdrawn',
      },
      withdrawalReason: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Reason for withdrawal',
      },
      lastAttendanceDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Last date of attendance',
      },
      isAudit: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Is audit enrollment',
      },
      repeatCourse: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Is repeat of previous course',
      },
      repeatCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: 'Number of times course repeated',
      },
      tuitionCharged: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Tuition amount charged',
      },
      feesPaid: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Fees paid status',
      },
      metadata: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'Additional metadata',
      },
      enrolledBy: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'User who enrolled student',
      },
      updatedBy: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'User who last updated the record',
      },
    },
    {
      sequelize,
      tableName: 'enrollments',
      timestamps: true,
      indexes: [
        { fields: ['studentId', 'termId'] },
        { fields: ['courseId', 'sectionId', 'termId'] },
        { fields: ['enrollmentStatus'] },
        { fields: ['termId'] },
        { fields: ['enrollmentDate'] },
      ],
      hooks: {
        beforeCreate: (enrollment) => {
          if (!enrollment.enrolledBy) {
            throw new Error('enrolledBy is required');
          }
          enrollment.updatedBy = enrollment.enrolledBy;
        },
        beforeUpdate: (enrollment) => {
          if (!enrollment.updatedBy) {
            throw new Error('updatedBy is required');
          }
        },
      },
    },
  );

  return Enrollment;
};

/**
 * Sequelize model for EnrollmentStatus tracking and history.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} EnrollmentStatus model
 */
export const createEnrollmentStatusModel = (sequelize: Sequelize) => {
  class EnrollmentStatus extends Model {
    public id!: number;
    public studentId!: number;
    public termId!: number;
    public statusType!: string;
    public statusDate!: Date;
    public fullTimeStatus!: boolean;
    public creditsEnrolled!: number;
    public effectiveDate!: Date;
    public endDate!: Date | null;
    public verifiedBy!: string | null;
    public verificationDate!: Date | null;
    public notes!: string | null;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  EnrollmentStatus.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      studentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Reference to student',
        references: {
          model: 'students',
          key: 'id',
        },
      },
      termId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Reference to academic term',
      },
      statusType: {
        type: DataTypes.ENUM('full-time', 'part-time', 'less-than-half-time', 'withdrawn', 'graduated', 'on-leave'),
        allowNull: false,
        comment: 'Enrollment status type',
      },
      statusDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        comment: 'Date status became effective',
      },
      fullTimeStatus: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        comment: 'Is full-time student',
      },
      creditsEnrolled: {
        type: DataTypes.DECIMAL(4, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Credits enrolled for term',
      },
      effectiveDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Status effective date',
      },
      endDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Status end date',
      },
      verifiedBy: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: 'User who verified status',
      },
      verificationDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Date status was verified',
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Additional notes',
      },
    },
    {
      sequelize,
      tableName: 'enrollment_statuses',
      timestamps: true,
      indexes: [
        { fields: ['studentId', 'termId'] },
        { fields: ['statusType'] },
        { fields: ['statusDate'] },
        { fields: ['effectiveDate', 'endDate'] },
      ],
    },
  );

  return EnrollmentStatus;
};

// ============================================================================
// ENROLLMENT MANAGEMENT FUNCTIONS (1-10)
// ============================================================================

/**
 * Creates a new student record in the system.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {CreateStudentDto} studentData - Student creation data
 * @param {string} userId - User creating the student
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created student
 *
 * @example
 * ```typescript
 * const student = await createStudent(sequelize, {
 *   studentNumber: 'S-2024-001234',
 *   firstName: 'John',
 *   lastName: 'Doe',
 *   email: 'john.doe@university.edu',
 *   dateOfBirth: new Date('2000-01-15'),
 *   admissionDate: new Date(),
 *   studentType: 'new',
 *   academicLevel: 'freshman'
 * }, 'admin123');
 * ```
 */
export const createStudent = async (
  sequelize: Sequelize,
  studentData: CreateStudentDto,
  userId: string,
  transaction?: Transaction,
): Promise<any> => {
  const Student = createStudentModel(sequelize);

  // Check for existing student number
  const existing = await Student.findOne({
    where: { studentNumber: studentData.studentNumber },
    transaction,
  });

  if (existing) {
    throw new Error(`Student number ${studentData.studentNumber} already exists`);
  }

  // Check for existing email
  const existingEmail = await Student.findOne({
    where: { email: studentData.email },
    transaction,
  });

  if (existingEmail) {
    throw new Error(`Email ${studentData.email} already exists`);
  }

  const student = await Student.create(
    {
      ...studentData,
      enrollmentStatus: 'active',
      gpa: 0.00,
      creditsEarned: 0,
      creditsAttempted: 0,
      isInternational: studentData.studentType === 'international',
      createdBy: userId,
      updatedBy: userId,
    },
    { transaction },
  );

  return student;
};

/**
 * Enrolls a student in a course section.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {CreateEnrollmentDto} enrollmentData - Enrollment data
 * @param {string} userId - User creating the enrollment
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created enrollment
 *
 * @example
 * ```typescript
 * const enrollment = await enrollStudentInCourse(sequelize, {
 *   studentId: 1,
 *   courseId: 101,
 *   sectionId: 1,
 *   termId: 202401,
 *   enrollmentDate: new Date(),
 *   enrollmentStatus: 'enrolled',
 *   credits: 3,
 *   gradingOption: 'letter'
 * }, 'registrar123');
 * ```
 */
export const enrollStudentInCourse = async (
  sequelize: Sequelize,
  enrollmentData: CreateEnrollmentDto,
  userId: string,
  transaction?: Transaction,
): Promise<any> => {
  const Enrollment = createEnrollmentModel(sequelize);
  const Student = createStudentModel(sequelize);

  // Verify student exists and is active
  const student = await Student.findByPk(enrollmentData.studentId, { transaction });
  if (!student) {
    throw new Error('Student not found');
  }

  if (student.enrollmentStatus !== 'active') {
    throw new Error('Student is not in active enrollment status');
  }

  // Check for existing enrollment
  const existing = await Enrollment.findOne({
    where: {
      studentId: enrollmentData.studentId,
      courseId: enrollmentData.courseId,
      sectionId: enrollmentData.sectionId,
      termId: enrollmentData.termId,
      enrollmentStatus: { [Op.in]: ['enrolled', 'in-progress'] },
    },
    transaction,
  });

  if (existing) {
    throw new Error('Student is already enrolled in this course section');
  }

  // Check enrollment capacity
  const capacityCheck = await checkEnrollmentCapacity(
    sequelize,
    enrollmentData.courseId,
    enrollmentData.sectionId,
    enrollmentData.termId,
  );

  if (!capacityCheck.hasCapacity) {
    throw new Error('Course section is at full capacity');
  }

  const enrollment = await Enrollment.create(
    {
      ...enrollmentData,
      enrolledBy: userId,
      updatedBy: userId,
    },
    { transaction },
  );

  // Update student credits attempted
  await student.update(
    {
      creditsAttempted: Number(student.creditsAttempted) + Number(enrollmentData.credits),
      updatedBy: userId,
    },
    { transaction },
  );

  return enrollment;
};

/**
 * Drops a student from a course.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} enrollmentId - Enrollment ID
 * @param {string} userId - User dropping the course
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await dropCourse(sequelize, 123, 'student123');
 * ```
 */
export const dropCourse = async (
  sequelize: Sequelize,
  enrollmentId: number,
  userId: string,
  transaction?: Transaction,
): Promise<void> => {
  const Enrollment = createEnrollmentModel(sequelize);
  const Student = createStudentModel(sequelize);

  const enrollment = await Enrollment.findByPk(enrollmentId, { transaction });
  if (!enrollment) {
    throw new Error('Enrollment not found');
  }

  if (enrollment.enrollmentStatus === 'dropped') {
    throw new Error('Course already dropped');
  }

  const student = await Student.findByPk(enrollment.studentId, { transaction });

  await enrollment.update(
    {
      enrollmentStatus: 'dropped',
      dropDate: new Date(),
      updatedBy: userId,
    },
    { transaction },
  );

  // Update student credits attempted
  if (student) {
    await student.update(
      {
        creditsAttempted: Number(student.creditsAttempted) - Number(enrollment.credits),
        updatedBy: userId,
      },
      { transaction },
    );
  }
};

/**
 * Withdraws a student from a course.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} enrollmentId - Enrollment ID
 * @param {string} reason - Withdrawal reason
 * @param {string} userId - User processing withdrawal
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await withdrawFromCourse(sequelize, 123, 'Medical reasons', 'advisor123');
 * ```
 */
export const withdrawFromCourse = async (
  sequelize: Sequelize,
  enrollmentId: number,
  reason: string,
  userId: string,
  transaction?: Transaction,
): Promise<void> => {
  const Enrollment = createEnrollmentModel(sequelize);

  const enrollment = await Enrollment.findByPk(enrollmentId, { transaction });
  if (!enrollment) {
    throw new Error('Enrollment not found');
  }

  if (enrollment.enrollmentStatus === 'withdrawn') {
    throw new Error('Course already withdrawn');
  }

  await enrollment.update(
    {
      enrollmentStatus: 'withdrawn',
      withdrawalDate: new Date(),
      withdrawalReason: reason,
      grade: 'W',
      updatedBy: userId,
    },
    { transaction },
  );
};

/**
 * Retrieves all enrollments for a student in a term.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} studentId - Student ID
 * @param {number} termId - Term ID
 * @returns {Promise<any[]>} Array of enrollments
 *
 * @example
 * ```typescript
 * const enrollments = await getStudentEnrollments(sequelize, 1, 202401);
 * ```
 */
export const getStudentEnrollments = async (
  sequelize: Sequelize,
  studentId: number,
  termId: number,
): Promise<any[]> => {
  const Enrollment = createEnrollmentModel(sequelize);

  return await Enrollment.findAll({
    where: {
      studentId,
      termId,
      enrollmentStatus: { [Op.in]: ['enrolled', 'in-progress'] },
    },
    order: [['enrollmentDate', 'ASC']],
  });
};

/**
 * Calculates total credits enrolled for a student in a term.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} studentId - Student ID
 * @param {number} termId - Term ID
 * @returns {Promise<number>} Total credits enrolled
 *
 * @example
 * ```typescript
 * const credits = await calculateEnrolledCredits(sequelize, 1, 202401);
 * ```
 */
export const calculateEnrolledCredits = async (
  sequelize: Sequelize,
  studentId: number,
  termId: number,
): Promise<number> => {
  const Enrollment = createEnrollmentModel(sequelize);

  const result = await Enrollment.findAll({
    where: {
      studentId,
      termId,
      enrollmentStatus: { [Op.in]: ['enrolled', 'in-progress'] },
    },
    attributes: [[sequelize.fn('SUM', sequelize.col('credits')), 'totalCredits']],
    raw: true,
  });

  return Number((result[0] as any).totalCredits || 0);
};

/**
 * Determines if student is full-time based on credits enrolled.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} studentId - Student ID
 * @param {number} termId - Term ID
 * @param {number} fullTimeThreshold - Full-time credit threshold (default 12)
 * @returns {Promise<boolean>} Whether student is full-time
 *
 * @example
 * ```typescript
 * const isFullTime = await isFullTimeStudent(sequelize, 1, 202401, 12);
 * ```
 */
export const isFullTimeStudent = async (
  sequelize: Sequelize,
  studentId: number,
  termId: number,
  fullTimeThreshold = 12,
): Promise<boolean> => {
  const credits = await calculateEnrolledCredits(sequelize, studentId, termId);
  return credits >= fullTimeThreshold;
};

/**
 * Updates student academic level based on credits earned.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} studentId - Student ID
 * @param {string} userId - User updating the level
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<string>} New academic level
 *
 * @example
 * ```typescript
 * const newLevel = await updateAcademicLevel(sequelize, 1, 'registrar123');
 * ```
 */
export const updateAcademicLevel = async (
  sequelize: Sequelize,
  studentId: number,
  userId: string,
  transaction?: Transaction,
): Promise<string> => {
  const Student = createStudentModel(sequelize);

  const student = await Student.findByPk(studentId, { transaction });
  if (!student) {
    throw new Error('Student not found');
  }

  const credits = Number(student.creditsEarned);
  let newLevel = student.academicLevel;

  // Undergraduate level progression
  if (credits >= 90) {
    newLevel = 'senior';
  } else if (credits >= 60) {
    newLevel = 'junior';
  } else if (credits >= 30) {
    newLevel = 'sophomore';
  } else {
    newLevel = 'freshman';
  }

  if (newLevel !== student.academicLevel) {
    await student.update({ academicLevel: newLevel, updatedBy: userId }, { transaction });
  }

  return newLevel;
};

/**
 * Retrieves enrollment metrics for a term.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} termId - Term ID
 * @returns {Promise<EnrollmentMetrics>} Enrollment metrics
 *
 * @example
 * ```typescript
 * const metrics = await getEnrollmentMetrics(sequelize, 202401);
 * ```
 */
export const getEnrollmentMetrics = async (
  sequelize: Sequelize,
  termId: number,
): Promise<EnrollmentMetrics> => {
  const Student = createStudentModel(sequelize);
  const Enrollment = createEnrollmentModel(sequelize);

  // Get all students enrolled in term
  const enrolledStudents = await Enrollment.findAll({
    where: {
      termId,
      enrollmentStatus: { [Op.in]: ['enrolled', 'in-progress'] },
    },
    attributes: ['studentId'],
    group: ['studentId'],
  });

  const studentIds = enrolledStudents.map((e) => e.studentId);

  const students = await Student.findAll({
    where: {
      id: { [Op.in]: studentIds },
    },
  });

  let fullTimeCount = 0;
  let partTimeCount = 0;

  for (const studentId of studentIds) {
    const isFullTime = await isFullTimeStudent(sequelize, studentId, termId);
    if (isFullTime) {
      fullTimeCount++;
    } else {
      partTimeCount++;
    }
  }

  return {
    totalEnrollment: studentIds.length,
    fullTimeCount,
    partTimeCount,
    newStudentsCount: students.filter((s) => s.studentType === 'new').length,
    returningStudentsCount: students.filter((s) => s.studentType === 'returning').length,
    transferStudentsCount: students.filter((s) => s.studentType === 'transfer').length,
    internationalStudentsCount: students.filter((s) => s.isInternational).length,
  };
};

/**
 * Changes grading option for an enrollment.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} enrollmentId - Enrollment ID
 * @param {string} newGradingOption - New grading option
 * @param {string} userId - User making the change
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await changeGradingOption(sequelize, 123, 'pass-fail', 'student123');
 * ```
 */
export const changeGradingOption = async (
  sequelize: Sequelize,
  enrollmentId: number,
  newGradingOption: 'letter' | 'pass-fail' | 'audit' | 'credit-no-credit',
  userId: string,
  transaction?: Transaction,
): Promise<void> => {
  const Enrollment = createEnrollmentModel(sequelize);

  const enrollment = await Enrollment.findByPk(enrollmentId, { transaction });
  if (!enrollment) {
    throw new Error('Enrollment not found');
  }

  if (enrollment.enrollmentStatus !== 'enrolled' && enrollment.enrollmentStatus !== 'in-progress') {
    throw new Error('Cannot change grading option for non-active enrollment');
  }

  await enrollment.update(
    {
      gradingOption: newGradingOption,
      isAudit: newGradingOption === 'audit',
      updatedBy: userId,
    },
    { transaction },
  );
};

// ============================================================================
// ENROLLMENT VERIFICATION FUNCTIONS (11-15)
// ============================================================================

/**
 * Creates enrollment verification record.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {EnrollmentVerification} verificationData - Verification data
 * @param {string} userId - User creating verification
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Verification record
 *
 * @example
 * ```typescript
 * const verification = await createEnrollmentVerification(sequelize, {
 *   studentId: 1,
 *   enrollmentId: 123,
 *   verificationDate: new Date(),
 *   verificationType: 'full-time',
 *   creditsEnrolled: 15,
 *   verifiedBy: 'registrar123',
 *   verificationDocument: 'DOC-2024-001',
 *   expirationDate: new Date('2024-12-31')
 * }, 'registrar123');
 * ```
 */
export const createEnrollmentVerification = async (
  sequelize: Sequelize,
  verificationData: EnrollmentVerification,
  userId: string,
  transaction?: Transaction,
): Promise<any> => {
  const EnrollmentStatus = createEnrollmentStatusModel(sequelize);

  const verification = await EnrollmentStatus.create(
    {
      studentId: verificationData.studentId,
      termId: 0, // Would be passed in real implementation
      statusType: verificationData.verificationType,
      statusDate: verificationData.verificationDate,
      fullTimeStatus: verificationData.verificationType === 'full-time',
      creditsEnrolled: verificationData.creditsEnrolled,
      effectiveDate: verificationData.verificationDate,
      endDate: verificationData.expirationDate,
      verifiedBy: verificationData.verifiedBy,
      verificationDate: verificationData.verificationDate,
      notes: `Document: ${verificationData.verificationDocument}`,
    },
    { transaction },
  );

  return verification;
};

/**
 * Verifies student enrollment status for external requests.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} studentId - Student ID
 * @param {number} termId - Term ID
 * @returns {Promise<any>} Verification details
 *
 * @example
 * ```typescript
 * const verification = await verifyEnrollmentStatus(sequelize, 1, 202401);
 * ```
 */
export const verifyEnrollmentStatus = async (
  sequelize: Sequelize,
  studentId: number,
  termId: number,
): Promise<any> => {
  const Student = createStudentModel(sequelize);
  const Enrollment = createEnrollmentModel(sequelize);

  const student = await Student.findByPk(studentId);
  if (!student) {
    throw new Error('Student not found');
  }

  const credits = await calculateEnrolledCredits(sequelize, studentId, termId);
  const isFullTime = await isFullTimeStudent(sequelize, studentId, termId);

  const enrollments = await Enrollment.findAll({
    where: {
      studentId,
      termId,
      enrollmentStatus: { [Op.in]: ['enrolled', 'in-progress'] },
    },
  });

  return {
    studentId,
    studentNumber: student.studentNumber,
    studentName: `${student.firstName} ${student.lastName}`,
    termId,
    enrollmentStatus: student.enrollmentStatus,
    creditsEnrolled: credits,
    fullTimeStatus: isFullTime,
    academicLevel: student.academicLevel,
    courseCount: enrollments.length,
    verificationDate: new Date(),
  };
};

/**
 * Generates enrollment verification letter.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} studentId - Student ID
 * @param {number} termId - Term ID
 * @param {string} purpose - Purpose of verification
 * @returns {Promise<any>} Verification letter data
 *
 * @example
 * ```typescript
 * const letter = await generateVerificationLetter(sequelize, 1, 202401, 'Loan deferment');
 * ```
 */
export const generateVerificationLetter = async (
  sequelize: Sequelize,
  studentId: number,
  termId: number,
  purpose: string,
): Promise<any> => {
  const verification = await verifyEnrollmentStatus(sequelize, studentId, termId);

  return {
    letterType: 'Enrollment Verification',
    issuedDate: new Date(),
    purpose,
    student: {
      studentNumber: verification.studentNumber,
      name: verification.studentName,
    },
    enrollmentDetails: {
      academicLevel: verification.academicLevel,
      enrollmentStatus: verification.enrollmentStatus,
      creditsEnrolled: verification.creditsEnrolled,
      fullTimeStatus: verification.fullTimeStatus ? 'Full-Time' : 'Part-Time',
      numberOfCourses: verification.courseCount,
    },
    termId: verification.termId,
    validThrough: new Date(new Date().setMonth(new Date().getMonth() + 3)),
    officialSeal: true,
  };
};

/**
 * Validates enrollment for financial aid eligibility.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} studentId - Student ID
 * @param {number} termId - Term ID
 * @returns {Promise<{ eligible: boolean; reason?: string }>} Eligibility status
 *
 * @example
 * ```typescript
 * const eligibility = await validateFinancialAidEligibility(sequelize, 1, 202401);
 * ```
 */
export const validateFinancialAidEligibility = async (
  sequelize: Sequelize,
  studentId: number,
  termId: number,
): Promise<{ eligible: boolean; reason?: string }> => {
  const Student = createStudentModel(sequelize);
  const student = await Student.findByPk(studentId);

  if (!student) {
    return { eligible: false, reason: 'Student not found' };
  }

  if (student.enrollmentStatus !== 'active') {
    return { eligible: false, reason: 'Student not in active status' };
  }

  const credits = await calculateEnrolledCredits(sequelize, studentId, termId);

  // Financial aid typically requires at least 6 credits (half-time)
  if (credits < 6) {
    return { eligible: false, reason: 'Not enrolled in minimum credits for financial aid (6 credits)' };
  }

  // Check academic progress (SAP)
  if (Number(student.gpa) < 2.0) {
    return { eligible: false, reason: 'GPA below Satisfactory Academic Progress requirement (2.0)' };
  }

  return { eligible: true };
};

/**
 * Checks enrollment compliance for international students (SEVIS).
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} studentId - Student ID
 * @param {number} termId - Term ID
 * @returns {Promise<{ compliant: boolean; issues: string[] }>} Compliance status
 *
 * @example
 * ```typescript
 * const compliance = await checkInternationalStudentCompliance(sequelize, 1, 202401);
 * ```
 */
export const checkInternationalStudentCompliance = async (
  sequelize: Sequelize,
  studentId: number,
  termId: number,
): Promise<{ compliant: boolean; issues: string[] }> => {
  const Student = createStudentModel(sequelize);
  const student = await Student.findByPk(studentId);

  const issues: string[] = [];

  if (!student) {
    return { compliant: false, issues: ['Student not found'] };
  }

  if (!student.isInternational) {
    return { compliant: true, issues: [] };
  }

  const credits = await calculateEnrolledCredits(sequelize, studentId, termId);

  // F-1 students must be enrolled full-time (typically 12 credits for undergraduate)
  const requiredCredits = student.academicLevel === 'graduate' ? 9 : 12;
  if (credits < requiredCredits) {
    issues.push(`Not enrolled in required full-time credits (${requiredCredits} required, ${credits} enrolled)`);
  }

  if (student.enrollmentStatus !== 'active') {
    issues.push('Student not in active enrollment status');
  }

  return {
    compliant: issues.length === 0,
    issues,
  };
};

// ============================================================================
// TRANSFER AND INTERNATIONAL STUDENT ENROLLMENT (16-20)
// ============================================================================

/**
 * Creates transfer credit record for student.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {TransferCredit} transferData - Transfer credit data
 * @param {string} userId - User creating the record
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Transfer credit record
 *
 * @example
 * ```typescript
 * const transfer = await createTransferCredit(sequelize, {
 *   studentId: 1,
 *   institutionName: 'Previous University',
 *   institutionCode: 'PREV-001',
 *   courseTitle: 'Introduction to Psychology',
 *   courseNumber: 'PSY-101',
 *   credits: 3,
 *   grade: 'B',
 *   transferStatus: 'pending'
 * }, 'registrar123');
 * ```
 */
export const createTransferCredit = async (
  sequelize: Sequelize,
  transferData: TransferCredit,
  userId: string,
  transaction?: Transaction,
): Promise<any> => {
  const result = await sequelize.query(
    `INSERT INTO transfer_credits
     (student_id, institution_name, institution_code, course_title, course_number, credits, grade, transfer_status, created_at, updated_at, created_by)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW(), ?)`,
    {
      replacements: [
        transferData.studentId,
        transferData.institutionName,
        transferData.institutionCode,
        transferData.courseTitle,
        transferData.courseNumber,
        transferData.credits,
        transferData.grade,
        transferData.transferStatus,
        userId,
      ],
      transaction,
    },
  );

  return result;
};

/**
 * Evaluates and approves transfer credits.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} transferCreditId - Transfer credit ID
 * @param {number} equivalentCourseId - Equivalent course ID
 * @param {string} userId - User approving transfer
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await evaluateTransferCredit(sequelize, 1, 101, 'evaluator123');
 * ```
 */
export const evaluateTransferCredit = async (
  sequelize: Sequelize,
  transferCreditId: number,
  equivalentCourseId: number,
  userId: string,
  transaction?: Transaction,
): Promise<void> => {
  await sequelize.query(
    `UPDATE transfer_credits
     SET transfer_status = 'approved', equivalent_course_id = ?, evaluated_by = ?, evaluation_date = NOW()
     WHERE id = ?`,
    {
      replacements: [equivalentCourseId, userId, transferCreditId],
      transaction,
    },
  );

  // Update student credits earned
  const [credits] = await sequelize.query(
    `SELECT credits, student_id FROM transfer_credits WHERE id = ?`,
    {
      replacements: [transferCreditId],
      transaction,
    },
  );

  if (credits && credits.length > 0) {
    const creditData = credits[0] as any;
    const Student = createStudentModel(sequelize);
    const student = await Student.findByPk(creditData.student_id, { transaction });

    if (student) {
      await student.update(
        {
          creditsEarned: Number(student.creditsEarned) + Number(creditData.credits),
          updatedBy: userId,
        },
        { transaction },
      );
    }
  }
};

/**
 * Creates international student record with SEVIS information.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {InternationalStudentData} internationalData - International student data
 * @param {string} userId - User creating the record
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} International student record
 *
 * @example
 * ```typescript
 * const intlStudent = await createInternationalStudentRecord(sequelize, {
 *   studentId: 1,
 *   sevisId: 'N0012345678',
 *   visaType: 'F-1',
 *   visaExpirationDate: new Date('2025-12-31'),
 *   i20IssueDate: new Date(),
 *   programStartDate: new Date('2024-08-15'),
 *   programEndDate: new Date('2028-05-15'),
 *   fullTimeRequirement: 12,
 *   countryOfOrigin: 'China',
 *   financialDocumentDate: new Date()
 * }, 'iso123');
 * ```
 */
export const createInternationalStudentRecord = async (
  sequelize: Sequelize,
  internationalData: InternationalStudentData,
  userId: string,
  transaction?: Transaction,
): Promise<any> => {
  const result = await sequelize.query(
    `INSERT INTO international_students
     (student_id, sevis_id, visa_type, visa_expiration_date, i20_issue_date, program_start_date, program_end_date,
      full_time_requirement, country_of_origin, sponsor_name, financial_document_date, created_at, updated_at, created_by)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW(), ?)`,
    {
      replacements: [
        internationalData.studentId,
        internationalData.sevisId,
        internationalData.visaType,
        internationalData.visaExpirationDate,
        internationalData.i20IssueDate,
        internationalData.programStartDate,
        internationalData.programEndDate,
        internationalData.fullTimeRequirement,
        internationalData.countryOfOrigin,
        internationalData.sponsorName || null,
        internationalData.financialDocumentDate,
        userId,
      ],
      transaction,
    },
  );

  return result;
};

/**
 * Updates SEVIS status for international student.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} studentId - Student ID
 * @param {string} sevisStatus - New SEVIS status
 * @param {string} userId - User updating status
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await updateSEVISStatus(sequelize, 1, 'Active', 'iso123');
 * ```
 */
export const updateSEVISStatus = async (
  sequelize: Sequelize,
  studentId: number,
  sevisStatus: string,
  userId: string,
  transaction?: Transaction,
): Promise<void> => {
  await sequelize.query(
    `UPDATE international_students
     SET sevis_status = ?, sevis_status_date = NOW(), updated_by = ?, updated_at = NOW()
     WHERE student_id = ?`,
    {
      replacements: [sevisStatus, userId, studentId],
      transaction,
    },
  );
};

/**
 * Validates transfer student articulation agreements.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} institutionCode - Institution code
 * @param {string} courseNumber - Course number
 * @returns {Promise<{ hasAgreement: boolean; equivalentCourse?: any }>} Articulation validation
 *
 * @example
 * ```typescript
 * const validation = await validateArticulationAgreement(sequelize, 'PREV-001', 'PSY-101');
 * ```
 */
export const validateArticulationAgreement = async (
  sequelize: Sequelize,
  institutionCode: string,
  courseNumber: string,
): Promise<{ hasAgreement: boolean; equivalentCourse?: any }> => {
  const [results] = await sequelize.query(
    `SELECT * FROM articulation_agreements
     WHERE institution_code = ? AND external_course_number = ? AND is_active = true`,
    {
      replacements: [institutionCode, courseNumber],
    },
  );

  if (results && results.length > 0) {
    return {
      hasAgreement: true,
      equivalentCourse: results[0],
    };
  }

  return { hasAgreement: false };
};

// ============================================================================
// ENROLLMENT HOLDS AND RESTRICTIONS (21-25)
// ============================================================================

/**
 * Places enrollment hold on student account.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {EnrollmentHold} holdData - Hold data
 * @param {string} userId - User placing hold
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Hold record
 *
 * @example
 * ```typescript
 * const hold = await placeEnrollmentHold(sequelize, {
 *   holdId: 'HOLD-2024-001',
 *   studentId: 1,
 *   holdType: 'financial',
 *   holdReason: 'Unpaid tuition balance',
 *   placedBy: 'bursar123',
 *   placedDate: new Date(),
 *   isActive: true,
 *   blockEnrollment: true,
 *   blockTranscripts: true,
 *   blockGraduation: false
 * }, 'bursar123');
 * ```
 */
export const placeEnrollmentHold = async (
  sequelize: Sequelize,
  holdData: EnrollmentHold,
  userId: string,
  transaction?: Transaction,
): Promise<any> => {
  const result = await sequelize.query(
    `INSERT INTO enrollment_holds
     (hold_id, student_id, hold_type, hold_reason, placed_by, placed_date, is_active,
      block_enrollment, block_transcripts, block_graduation, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
    {
      replacements: [
        holdData.holdId,
        holdData.studentId,
        holdData.holdType,
        holdData.holdReason,
        holdData.placedBy,
        holdData.placedDate,
        holdData.isActive,
        holdData.blockEnrollment,
        holdData.blockTranscripts,
        holdData.blockGraduation,
      ],
      transaction,
    },
  );

  return result;
};

/**
 * Releases enrollment hold from student account.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} holdId - Hold ID
 * @param {string} userId - User releasing hold
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await releaseEnrollmentHold(sequelize, 'HOLD-2024-001', 'bursar123');
 * ```
 */
export const releaseEnrollmentHold = async (
  sequelize: Sequelize,
  holdId: string,
  userId: string,
  transaction?: Transaction,
): Promise<void> => {
  await sequelize.query(
    `UPDATE enrollment_holds
     SET is_active = false, released_by = ?, released_date = NOW(), updated_at = NOW()
     WHERE hold_id = ?`,
    {
      replacements: [userId, holdId],
      transaction,
    },
  );
};

/**
 * Checks if student has any active enrollment holds.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} studentId - Student ID
 * @returns {Promise<{ hasHolds: boolean; holds: any[] }>} Hold status
 *
 * @example
 * ```typescript
 * const holdStatus = await checkEnrollmentHolds(sequelize, 1);
 * ```
 */
export const checkEnrollmentHolds = async (
  sequelize: Sequelize,
  studentId: number,
): Promise<{ hasHolds: boolean; holds: any[] }> => {
  const [holds] = await sequelize.query(
    `SELECT * FROM enrollment_holds
     WHERE student_id = ? AND is_active = true
     ORDER BY placed_date DESC`,
    {
      replacements: [studentId],
    },
  );

  return {
    hasHolds: holds.length > 0,
    holds: holds as any[],
  };
};

/**
 * Creates enrollment restriction for student.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {EnrollmentRestriction} restrictionData - Restriction data
 * @param {string} userId - User creating restriction
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Restriction record
 *
 * @example
 * ```typescript
 * const restriction = await createEnrollmentRestriction(sequelize, {
 *   restrictionId: 'REST-2024-001',
 *   studentId: 1,
 *   restrictionType: 'probation',
 *   restrictionReason: 'Academic probation - GPA below 2.0',
 *   effectiveDate: new Date(),
 *   isActive: true,
 *   allowedOverride: false
 * }, 'dean123');
 * ```
 */
export const createEnrollmentRestriction = async (
  sequelize: Sequelize,
  restrictionData: EnrollmentRestriction,
  userId: string,
  transaction?: Transaction,
): Promise<any> => {
  const result = await sequelize.query(
    `INSERT INTO enrollment_restrictions
     (restriction_id, student_id, restriction_type, restriction_reason, effective_date,
      expiration_date, is_active, allowed_override, created_at, updated_at, created_by)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW(), ?)`,
    {
      replacements: [
        restrictionData.restrictionId,
        restrictionData.studentId,
        restrictionData.restrictionType,
        restrictionData.restrictionReason,
        restrictionData.effectiveDate,
        restrictionData.expirationDate || null,
        restrictionData.isActive,
        restrictionData.allowedOverride,
        userId,
      ],
      transaction,
    },
  );

  return result;
};

/**
 * Validates enrollment permissions before registration.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} studentId - Student ID
 * @returns {Promise<{ canEnroll: boolean; blocks: string[] }>} Enrollment permission status
 *
 * @example
 * ```typescript
 * const permission = await validateEnrollmentPermission(sequelize, 1);
 * ```
 */
export const validateEnrollmentPermission = async (
  sequelize: Sequelize,
  studentId: number,
): Promise<{ canEnroll: boolean; blocks: string[] }> => {
  const Student = createStudentModel(sequelize);
  const student = await Student.findByPk(studentId);
  const blocks: string[] = [];

  if (!student) {
    return { canEnroll: false, blocks: ['Student not found'] };
  }

  if (!student.isActive) {
    blocks.push('Student account is inactive');
  }

  if (student.enrollmentStatus === 'suspended') {
    blocks.push('Student is suspended');
  }

  // Check holds
  const holdStatus = await checkEnrollmentHolds(sequelize, studentId);
  const enrollmentBlocks = holdStatus.holds.filter((h) => h.block_enrollment);

  if (enrollmentBlocks.length > 0) {
    blocks.push(...enrollmentBlocks.map((h: any) => `Hold: ${h.hold_type} - ${h.hold_reason}`));
  }

  return {
    canEnroll: blocks.length === 0,
    blocks,
  };
};

// ============================================================================
// CAPACITY AND WAITLIST MANAGEMENT (26-35)
// ============================================================================

/**
 * Checks enrollment capacity for a course section.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} courseId - Course ID
 * @param {number} sectionId - Section ID
 * @param {number} termId - Term ID
 * @returns {Promise<{ hasCapacity: boolean; capacity: EnrollmentCapacity }>} Capacity status
 *
 * @example
 * ```typescript
 * const capacity = await checkEnrollmentCapacity(sequelize, 101, 1, 202401);
 * ```
 */
export const checkEnrollmentCapacity = async (
  sequelize: Sequelize,
  courseId: number,
  sectionId: number,
  termId: number,
): Promise<{ hasCapacity: boolean; capacity: EnrollmentCapacity }> => {
  // Get section capacity
  const [sections] = await sequelize.query(
    `SELECT max_capacity, reserved_seats, waitlist_capacity FROM course_sections
     WHERE course_id = ? AND section_id = ? AND term_id = ?`,
    {
      replacements: [courseId, sectionId, termId],
    },
  );

  if (!sections || sections.length === 0) {
    throw new Error('Course section not found');
  }

  const section = sections[0] as any;

  // Count current enrollment
  const Enrollment = createEnrollmentModel(sequelize);
  const currentEnrollment = await Enrollment.count({
    where: {
      courseId,
      sectionId,
      termId,
      enrollmentStatus: { [Op.in]: ['enrolled', 'in-progress'] },
    },
  });

  // Count waitlist
  const [waitlistResult] = await sequelize.query(
    `SELECT COUNT(*) as count FROM waitlist_entries
     WHERE course_id = ? AND section_id = ? AND term_id = ? AND status = 'active'`,
    {
      replacements: [courseId, sectionId, termId],
    },
  );

  const currentWaitlist = (waitlistResult[0] as any).count || 0;

  const capacity: EnrollmentCapacity = {
    courseId,
    sectionId,
    termId,
    maxCapacity: section.max_capacity,
    currentEnrollment,
    waitlistCapacity: section.waitlist_capacity || 0,
    currentWaitlist,
    reservedSeats: section.reserved_seats || 0,
    availableSeats: section.max_capacity - currentEnrollment - (section.reserved_seats || 0),
  };

  return {
    hasCapacity: capacity.availableSeats > 0,
    capacity,
  };
};

/**
 * Adds student to course waitlist.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} studentId - Student ID
 * @param {number} courseId - Course ID
 * @param {number} sectionId - Section ID
 * @param {number} termId - Term ID
 * @param {string} userId - User adding to waitlist
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<WaitlistEntry>} Waitlist entry
 *
 * @example
 * ```typescript
 * const waitlistEntry = await addToWaitlist(sequelize, 1, 101, 1, 202401, 'student123');
 * ```
 */
export const addToWaitlist = async (
  sequelize: Sequelize,
  studentId: number,
  courseId: number,
  sectionId: number,
  termId: number,
  userId: string,
  transaction?: Transaction,
): Promise<WaitlistEntry> => {
  // Check if already on waitlist
  const [existing] = await sequelize.query(
    `SELECT * FROM waitlist_entries
     WHERE student_id = ? AND course_id = ? AND section_id = ? AND term_id = ? AND status = 'active'`,
    {
      replacements: [studentId, courseId, sectionId, termId],
      transaction,
    },
  );

  if (existing && existing.length > 0) {
    throw new Error('Student already on waitlist for this section');
  }

  // Get current max position
  const [maxPos] = await sequelize.query(
    `SELECT COALESCE(MAX(position), 0) as max_position FROM waitlist_entries
     WHERE course_id = ? AND section_id = ? AND term_id = ?`,
    {
      replacements: [courseId, sectionId, termId],
      transaction,
    },
  );

  const position = ((maxPos[0] as any).max_position || 0) + 1;
  const expirationDate = new Date();
  expirationDate.setHours(expirationDate.getHours() + 24); // 24-hour expiration

  await sequelize.query(
    `INSERT INTO waitlist_entries
     (student_id, course_id, section_id, term_id, position, added_date, expiration_date, status, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, NOW(), ?, 'active', NOW(), NOW())`,
    {
      replacements: [studentId, courseId, sectionId, termId, position, expirationDate],
      transaction,
    },
  );

  return {
    waitlistId: 0, // Would be returned from insert
    studentId,
    courseId,
    sectionId,
    termId,
    position,
    addedDate: new Date(),
    expirationDate,
    status: 'active',
  };
};

/**
 * Removes student from waitlist.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} waitlistId - Waitlist entry ID
 * @param {string} userId - User removing from waitlist
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await removeFromWaitlist(sequelize, 123, 'student123');
 * ```
 */
export const removeFromWaitlist = async (
  sequelize: Sequelize,
  waitlistId: number,
  userId: string,
  transaction?: Transaction,
): Promise<void> => {
  await sequelize.query(
    `UPDATE waitlist_entries
     SET status = 'cancelled', updated_at = NOW()
     WHERE id = ?`,
    {
      replacements: [waitlistId],
      transaction,
    },
  );

  // Reorder remaining waitlist entries
  const [entry] = await sequelize.query(
    `SELECT course_id, section_id, term_id FROM waitlist_entries WHERE id = ?`,
    {
      replacements: [waitlistId],
      transaction,
    },
  );

  if (entry && entry.length > 0) {
    const e = entry[0] as any;
    await reorderWaitlist(sequelize, e.course_id, e.section_id, e.term_id, transaction);
  }
};

/**
 * Processes waitlist when seat becomes available.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} courseId - Course ID
 * @param {number} sectionId - Section ID
 * @param {number} termId - Term ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<WaitlistEntry | null>} Next waitlist entry or null
 *
 * @example
 * ```typescript
 * const nextStudent = await processWaitlist(sequelize, 101, 1, 202401);
 * ```
 */
export const processWaitlist = async (
  sequelize: Sequelize,
  courseId: number,
  sectionId: number,
  termId: number,
  transaction?: Transaction,
): Promise<WaitlistEntry | null> => {
  const [entries] = await sequelize.query(
    `SELECT * FROM waitlist_entries
     WHERE course_id = ? AND section_id = ? AND term_id = ? AND status = 'active'
     ORDER BY position ASC
     LIMIT 1`,
    {
      replacements: [courseId, sectionId, termId],
      transaction,
    },
  );

  if (!entries || entries.length === 0) {
    return null;
  }

  const entry = entries[0] as any;

  // Mark as notified
  await sequelize.query(
    `UPDATE waitlist_entries
     SET status = 'notified', notified_date = NOW(), updated_at = NOW()
     WHERE id = ?`,
    {
      replacements: [entry.id],
      transaction,
    },
  );

  return {
    waitlistId: entry.id,
    studentId: entry.student_id,
    courseId: entry.course_id,
    sectionId: entry.section_id,
    termId: entry.term_id,
    position: entry.position,
    addedDate: entry.added_date,
    notifiedDate: new Date(),
    expirationDate: entry.expiration_date,
    status: 'notified',
  };
};

/**
 * Gets waitlist position for student.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} studentId - Student ID
 * @param {number} courseId - Course ID
 * @param {number} sectionId - Section ID
 * @param {number} termId - Term ID
 * @returns {Promise<number | null>} Waitlist position or null
 *
 * @example
 * ```typescript
 * const position = await getWaitlistPosition(sequelize, 1, 101, 1, 202401);
 * ```
 */
export const getWaitlistPosition = async (
  sequelize: Sequelize,
  studentId: number,
  courseId: number,
  sectionId: number,
  termId: number,
): Promise<number | null> => {
  const [entries] = await sequelize.query(
    `SELECT position FROM waitlist_entries
     WHERE student_id = ? AND course_id = ? AND section_id = ? AND term_id = ? AND status = 'active'`,
    {
      replacements: [studentId, courseId, sectionId, termId],
    },
  );

  if (!entries || entries.length === 0) {
    return null;
  }

  return (entries[0] as any).position;
};

/**
 * Reorders waitlist positions after removal.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} courseId - Course ID
 * @param {number} sectionId - Section ID
 * @param {number} termId - Term ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await reorderWaitlist(sequelize, 101, 1, 202401);
 * ```
 */
export const reorderWaitlist = async (
  sequelize: Sequelize,
  courseId: number,
  sectionId: number,
  termId: number,
  transaction?: Transaction,
): Promise<void> => {
  const [entries] = await sequelize.query(
    `SELECT id FROM waitlist_entries
     WHERE course_id = ? AND section_id = ? AND term_id = ? AND status = 'active'
     ORDER BY position ASC`,
    {
      replacements: [courseId, sectionId, termId],
      transaction,
    },
  );

  let position = 1;
  for (const entry of entries as any[]) {
    await sequelize.query(
      `UPDATE waitlist_entries SET position = ? WHERE id = ?`,
      {
        replacements: [position, entry.id],
        transaction,
      },
    );
    position++;
  }
};

/**
 * Expires old waitlist entries.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<number>} Number of expired entries
 *
 * @example
 * ```typescript
 * const expired = await expireWaitlistEntries(sequelize);
 * ```
 */
export const expireWaitlistEntries = async (
  sequelize: Sequelize,
  transaction?: Transaction,
): Promise<number> => {
  const [result] = await sequelize.query(
    `UPDATE waitlist_entries
     SET status = 'expired', updated_at = NOW()
     WHERE status IN ('active', 'notified') AND expiration_date < NOW()`,
    { transaction },
  );

  return (result as any).affectedRows || 0;
};

/**
 * Sets reserved seats for course section.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} sectionId - Section ID
 * @param {number} reservedCount - Number of reserved seats
 * @param {string} reservedFor - Who seats are reserved for
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await setReservedSeats(sequelize, 1, 5, 'Honors Program Students');
 * ```
 */
export const setReservedSeats = async (
  sequelize: Sequelize,
  sectionId: number,
  reservedCount: number,
  reservedFor: string,
  transaction?: Transaction,
): Promise<void> => {
  await sequelize.query(
    `UPDATE course_sections
     SET reserved_seats = ?, reserved_for = ?, updated_at = NOW()
     WHERE id = ?`,
    {
      replacements: [reservedCount, reservedFor, sectionId],
      transaction,
    },
  );
};

/**
 * Releases reserved seats.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} sectionId - Section ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await releaseReservedSeats(sequelize, 1);
 * ```
 */
export const releaseReservedSeats = async (
  sequelize: Sequelize,
  sectionId: number,
  transaction?: Transaction,
): Promise<void> => {
  await sequelize.query(
    `UPDATE course_sections
     SET reserved_seats = 0, reserved_for = NULL, updated_at = NOW()
     WHERE id = ?`,
    {
      replacements: [sectionId],
      transaction,
    },
  );
};

/**
 * Gets enrollment statistics for a course section.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} courseId - Course ID
 * @param {number} sectionId - Section ID
 * @param {number} termId - Term ID
 * @returns {Promise<any>} Enrollment statistics
 *
 * @example
 * ```typescript
 * const stats = await getSectionEnrollmentStats(sequelize, 101, 1, 202401);
 * ```
 */
export const getSectionEnrollmentStats = async (
  sequelize: Sequelize,
  courseId: number,
  sectionId: number,
  termId: number,
): Promise<any> => {
  const capacityCheck = await checkEnrollmentCapacity(sequelize, courseId, sectionId, termId);
  const Enrollment = createEnrollmentModel(sequelize);

  const enrollments = await Enrollment.findAll({
    where: {
      courseId,
      sectionId,
      termId,
      enrollmentStatus: { [Op.in]: ['enrolled', 'in-progress'] },
    },
    attributes: ['gradingOption', [sequelize.fn('COUNT', sequelize.col('id')), 'count']],
    group: ['gradingOption'],
    raw: true,
  });

  return {
    capacity: capacityCheck.capacity,
    enrollmentByGradingOption: enrollments,
    utilizationRate: (capacityCheck.capacity.currentEnrollment / capacityCheck.capacity.maxCapacity) * 100,
  };
};

// ============================================================================
// ENROLLMENT FEE PROCESSING (36-45)
// ============================================================================

/**
 * Calculates enrollment fees for student.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} studentId - Student ID
 * @param {number} termId - Term ID
 * @returns {Promise<EnrollmentFee[]>} Calculated fees
 *
 * @example
 * ```typescript
 * const fees = await calculateEnrollmentFees(sequelize, 1, 202401);
 * ```
 */
export const calculateEnrollmentFees = async (
  sequelize: Sequelize,
  studentId: number,
  termId: number,
): Promise<EnrollmentFee[]> => {
  const credits = await calculateEnrolledCredits(sequelize, studentId, termId);
  const Student = createStudentModel(sequelize);
  const student = await Student.findByPk(studentId);

  if (!student) {
    throw new Error('Student not found');
  }

  const fees: EnrollmentFee[] = [];

  // Tuition fee (example rates)
  const tuitionRate = student.academicLevel === 'graduate' ? 750 : 500;
  fees.push({
    feeId: `TUI-${termId}-${studentId}`,
    studentId,
    termId,
    feeType: 'tuition',
    feeAmount: credits * tuitionRate,
    credits,
    feePerCredit: tuitionRate,
    dueDate: new Date(new Date().setDate(new Date().getDate() + 30)),
    paidAmount: 0,
    isPaid: false,
  });

  // Technology fee
  fees.push({
    feeId: `TECH-${termId}-${studentId}`,
    studentId,
    termId,
    feeType: 'technology',
    feeAmount: 200,
    credits,
    dueDate: new Date(new Date().setDate(new Date().getDate() + 30)),
    paidAmount: 0,
    isPaid: false,
  });

  // Activity fee for full-time students
  if (credits >= 12) {
    fees.push({
      feeId: `ACT-${termId}-${studentId}`,
      studentId,
      termId,
      feeType: 'activity',
      feeAmount: 150,
      credits,
      dueDate: new Date(new Date().setDate(new Date().getDate() + 30)),
      paidAmount: 0,
      isPaid: false,
    });
  }

  // International student fee
  if (student.isInternational) {
    fees.push({
      feeId: `INTL-${termId}-${studentId}`,
      studentId,
      termId,
      feeType: 'activity',
      feeAmount: 500,
      credits,
      dueDate: new Date(new Date().setDate(new Date().getDate() + 30)),
      paidAmount: 0,
      isPaid: false,
    });
  }

  return fees;
};

/**
 * Creates fee assessment for enrollment.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {EnrollmentFee} feeData - Fee data
 * @param {string} userId - User creating assessment
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Fee assessment record
 *
 * @example
 * ```typescript
 * const assessment = await createFeeAssessment(sequelize, {
 *   feeId: 'TUI-202401-1',
 *   studentId: 1,
 *   termId: 202401,
 *   feeType: 'tuition',
 *   feeAmount: 6000,
 *   credits: 12,
 *   dueDate: new Date(),
 *   paidAmount: 0,
 *   isPaid: false
 * }, 'bursar123');
 * ```
 */
export const createFeeAssessment = async (
  sequelize: Sequelize,
  feeData: EnrollmentFee,
  userId: string,
  transaction?: Transaction,
): Promise<any> => {
  const result = await sequelize.query(
    `INSERT INTO enrollment_fees
     (fee_id, student_id, term_id, fee_type, fee_amount, credits, fee_per_credit, due_date,
      paid_amount, is_paid, created_at, updated_at, created_by)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW(), ?)`,
    {
      replacements: [
        feeData.feeId,
        feeData.studentId,
        feeData.termId,
        feeData.feeType,
        feeData.feeAmount,
        feeData.credits,
        feeData.feePerCredit || null,
        feeData.dueDate,
        feeData.paidAmount,
        feeData.isPaid,
        userId,
      ],
      transaction,
    },
  );

  return result;
};

/**
 * Processes fee payment for enrollment.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} feeId - Fee ID
 * @param {number} paymentAmount - Payment amount
 * @param {string} userId - User processing payment
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await processFeePayment(sequelize, 'TUI-202401-1', 6000, 'bursar123');
 * ```
 */
export const processFeePayment = async (
  sequelize: Sequelize,
  feeId: string,
  paymentAmount: number,
  userId: string,
  transaction?: Transaction,
): Promise<void> => {
  const [fees] = await sequelize.query(
    `SELECT fee_amount, paid_amount FROM enrollment_fees WHERE fee_id = ?`,
    {
      replacements: [feeId],
      transaction,
    },
  );

  if (!fees || fees.length === 0) {
    throw new Error('Fee not found');
  }

  const fee = fees[0] as any;
  const newPaidAmount = Number(fee.paid_amount) + paymentAmount;
  const isPaid = newPaidAmount >= Number(fee.fee_amount);

  await sequelize.query(
    `UPDATE enrollment_fees
     SET paid_amount = ?, is_paid = ?, payment_date = NOW(), updated_at = NOW(), updated_by = ?
     WHERE fee_id = ?`,
    {
      replacements: [newPaidAmount, isPaid, userId, feeId],
      transaction,
    },
  );

  // If tuition is paid, update enrollment fee status
  if (isPaid) {
    const Enrollment = createEnrollmentModel(sequelize);
    await Enrollment.update(
      { feesPaid: true, updatedBy: userId },
      {
        where: {
          studentId: fee.student_id,
          termId: fee.term_id,
        },
        transaction,
      },
    );
  }
};

/**
 * Retrieves outstanding fees for student.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} studentId - Student ID
 * @returns {Promise<any[]>} Outstanding fees
 *
 * @example
 * ```typescript
 * const outstanding = await getOutstandingFees(sequelize, 1);
 * ```
 */
export const getOutstandingFees = async (
  sequelize: Sequelize,
  studentId: number,
): Promise<any[]> => {
  const [fees] = await sequelize.query(
    `SELECT * FROM enrollment_fees
     WHERE student_id = ? AND is_paid = false
     ORDER BY due_date ASC`,
    {
      replacements: [studentId],
    },
  );

  return fees as any[];
};

/**
 * Applies late fee for overdue payments.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} studentId - Student ID
 * @param {number} termId - Term ID
 * @param {number} lateFeeAmount - Late fee amount
 * @param {string} userId - User applying late fee
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await applyLateFee(sequelize, 1, 202401, 50, 'bursar123');
 * ```
 */
export const applyLateFee = async (
  sequelize: Sequelize,
  studentId: number,
  termId: number,
  lateFeeAmount: number,
  userId: string,
  transaction?: Transaction,
): Promise<void> => {
  const feeId = `LATE-${termId}-${studentId}-${Date.now()}`;

  await sequelize.query(
    `INSERT INTO enrollment_fees
     (fee_id, student_id, term_id, fee_type, fee_amount, credits, due_date, paid_amount, is_paid, created_at, updated_at, created_by)
     VALUES (?, ?, ?, 'late_fee', ?, 0, NOW(), 0, false, NOW(), NOW(), ?)`,
    {
      replacements: [feeId, studentId, termId, lateFeeAmount, userId],
      transaction,
    },
  );
};

/**
 * Processes enrollment fee refund.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} feeId - Fee ID
 * @param {number} refundAmount - Refund amount
 * @param {string} reason - Refund reason
 * @param {string} userId - User processing refund
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await processEnrollmentRefund(sequelize, 'TUI-202401-1', 3000, 'Course withdrawal', 'bursar123');
 * ```
 */
export const processEnrollmentRefund = async (
  sequelize: Sequelize,
  feeId: string,
  refundAmount: number,
  reason: string,
  userId: string,
  transaction?: Transaction,
): Promise<void> => {
  const [fees] = await sequelize.query(
    `SELECT paid_amount FROM enrollment_fees WHERE fee_id = ?`,
    {
      replacements: [feeId],
      transaction,
    },
  );

  if (!fees || fees.length === 0) {
    throw new Error('Fee not found');
  }

  const fee = fees[0] as any;
  if (Number(fee.paid_amount) < refundAmount) {
    throw new Error('Refund amount exceeds paid amount');
  }

  await sequelize.query(
    `UPDATE enrollment_fees
     SET paid_amount = paid_amount - ?, is_paid = false, updated_at = NOW(), updated_by = ?
     WHERE fee_id = ?`,
    {
      replacements: [refundAmount, userId, feeId],
      transaction,
    },
  );

  // Log refund transaction
  await sequelize.query(
    `INSERT INTO fee_refunds
     (fee_id, refund_amount, refund_reason, refunded_by, refund_date, created_at)
     VALUES (?, ?, ?, ?, NOW(), NOW())`,
    {
      replacements: [feeId, refundAmount, reason, userId],
      transaction,
    },
  );
};

/**
 * Calculates refund percentage based on withdrawal date.
 *
 * @param {Date} enrollmentDate - Enrollment date
 * @param {Date} withdrawalDate - Withdrawal date
 * @param {Date} termStartDate - Term start date
 * @returns {number} Refund percentage (0-100)
 *
 * @example
 * ```typescript
 * const refundPct = calculateRefundPercentage(
 *   new Date('2024-01-10'),
 *   new Date('2024-01-25'),
 *   new Date('2024-01-15')
 * );
 * ```
 */
export const calculateRefundPercentage = (
  enrollmentDate: Date,
  withdrawalDate: Date,
  termStartDate: Date,
): number => {
  const daysAfterStart = Math.floor(
    (withdrawalDate.getTime() - termStartDate.getTime()) / (1000 * 60 * 60 * 24),
  );

  // Typical refund schedule
  if (daysAfterStart <= 7) {
    return 100; // 100% refund within first week
  } else if (daysAfterStart <= 14) {
    return 75; // 75% refund within second week
  } else if (daysAfterStart <= 21) {
    return 50; // 50% refund within third week
  } else if (daysAfterStart <= 28) {
    return 25; // 25% refund within fourth week
  } else {
    return 0; // No refund after 4 weeks
  }
};

/**
 * Creates payment plan for student fees.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} studentId - Student ID
 * @param {number} termId - Term ID
 * @param {number} totalAmount - Total amount
 * @param {number} installments - Number of installments
 * @param {string} userId - User creating plan
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Payment plan details
 *
 * @example
 * ```typescript
 * const plan = await createPaymentPlan(sequelize, 1, 202401, 12000, 4, 'bursar123');
 * ```
 */
export const createPaymentPlan = async (
  sequelize: Sequelize,
  studentId: number,
  termId: number,
  totalAmount: number,
  installments: number,
  userId: string,
  transaction?: Transaction,
): Promise<any> => {
  const installmentAmount = totalAmount / installments;
  const planId = `PLAN-${termId}-${studentId}`;

  await sequelize.query(
    `INSERT INTO payment_plans
     (plan_id, student_id, term_id, total_amount, installments, installment_amount,
      created_at, updated_at, created_by)
     VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW(), ?)`,
    {
      replacements: [planId, studentId, termId, totalAmount, installments, installmentAmount, userId],
      transaction,
    },
  );

  // Create installment schedule
  const startDate = new Date();
  for (let i = 1; i <= installments; i++) {
    const dueDate = new Date(startDate);
    dueDate.setMonth(dueDate.getMonth() + i - 1);

    await sequelize.query(
      `INSERT INTO payment_plan_installments
       (plan_id, installment_number, due_date, amount, is_paid, created_at)
       VALUES (?, ?, ?, ?, false, NOW())`,
      {
        replacements: [planId, i, dueDate, installmentAmount],
        transaction,
      },
    );
  }

  return {
    planId,
    totalAmount,
    installments,
    installmentAmount,
  };
};

/**
 * Waives fee for student.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} feeId - Fee ID
 * @param {string} waiverReason - Waiver reason
 * @param {string} userId - User granting waiver
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await waiveFee(sequelize, 'TECH-202401-1', 'Financial hardship', 'dean123');
 * ```
 */
export const waiveFee = async (
  sequelize: Sequelize,
  feeId: string,
  waiverReason: string,
  userId: string,
  transaction?: Transaction,
): Promise<void> => {
  await sequelize.query(
    `UPDATE enrollment_fees
     SET is_paid = true, paid_amount = fee_amount, payment_date = NOW(),
         updated_at = NOW(), updated_by = ?
     WHERE fee_id = ?`,
    {
      replacements: [userId, feeId],
      transaction,
    },
  );

  // Log waiver
  await sequelize.query(
    `INSERT INTO fee_waivers
     (fee_id, waiver_reason, waived_by, waiver_date, created_at)
     VALUES (?, ?, ?, NOW(), NOW())`,
    {
      replacements: [feeId, waiverReason, userId],
      transaction,
    },
  );
};

/**
 * Generates fee statement for student.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} studentId - Student ID
 * @param {number} termId - Term ID
 * @returns {Promise<any>} Fee statement
 *
 * @example
 * ```typescript
 * const statement = await generateFeeStatement(sequelize, 1, 202401);
 * ```
 */
export const generateFeeStatement = async (
  sequelize: Sequelize,
  studentId: number,
  termId: number,
): Promise<any> => {
  const Student = createStudentModel(sequelize);
  const student = await Student.findByPk(studentId);

  const [fees] = await sequelize.query(
    `SELECT * FROM enrollment_fees
     WHERE student_id = ? AND term_id = ?
     ORDER BY fee_type, created_at`,
    {
      replacements: [studentId, termId],
    },
  );

  let totalCharges = 0;
  let totalPaid = 0;

  for (const fee of fees as any[]) {
    totalCharges += Number(fee.fee_amount);
    totalPaid += Number(fee.paid_amount);
  }

  return {
    statementDate: new Date(),
    student: {
      studentNumber: student?.studentNumber,
      name: `${student?.firstName} ${student?.lastName}`,
      email: student?.email,
    },
    termId,
    fees: fees,
    summary: {
      totalCharges,
      totalPaid,
      balance: totalCharges - totalPaid,
    },
  };
};

/**
 * Default export with all utilities.
 */
export default {
  // Models
  createStudentModel,
  createEnrollmentModel,
  createEnrollmentStatusModel,

  // Enrollment Management
  createStudent,
  enrollStudentInCourse,
  dropCourse,
  withdrawFromCourse,
  getStudentEnrollments,
  calculateEnrolledCredits,
  isFullTimeStudent,
  updateAcademicLevel,
  getEnrollmentMetrics,
  changeGradingOption,

  // Enrollment Verification
  createEnrollmentVerification,
  verifyEnrollmentStatus,
  generateVerificationLetter,
  validateFinancialAidEligibility,
  checkInternationalStudentCompliance,

  // Transfer and International Students
  createTransferCredit,
  evaluateTransferCredit,
  createInternationalStudentRecord,
  updateSEVISStatus,
  validateArticulationAgreement,

  // Enrollment Holds and Restrictions
  placeEnrollmentHold,
  releaseEnrollmentHold,
  checkEnrollmentHolds,
  createEnrollmentRestriction,
  validateEnrollmentPermission,

  // Capacity and Waitlist Management
  checkEnrollmentCapacity,
  addToWaitlist,
  removeFromWaitlist,
  processWaitlist,
  getWaitlistPosition,
  reorderWaitlist,
  expireWaitlistEntries,
  setReservedSeats,
  releaseReservedSeats,
  getSectionEnrollmentStats,

  // Enrollment Fee Processing
  calculateEnrollmentFees,
  createFeeAssessment,
  processFeePayment,
  getOutstandingFees,
  applyLateFee,
  processEnrollmentRefund,
  calculateRefundPercentage,
  createPaymentPlan,
  waiveFee,
  generateFeeStatement,
};
