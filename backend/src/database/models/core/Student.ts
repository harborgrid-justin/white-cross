/**
 * @fileoverview Student Database Model
 * @module models/core/Student
 * @description Sequelize model for student records with HIPAA-compliant audit trails.
 * Includes comprehensive validation, PHI protection, and educational health management.
 * @requires sequelize - ORM library for database operations
 * @requires enums - Gender and other student-related enumerations
 * @requires AuditableModel - Base model for HIPAA audit compliance
 *
 * LOC: FB6CFF0220
 * WC-MDL-STU-009 | Student Database Model
 *
 * UPSTREAM (imports from):
 *   - sequelize.ts (database/config/sequelize.ts)
 *   - enums.ts (database/types/enums.ts)
 *   - AuditableModel.ts (database/models/base/AuditableModel.ts)
 *
 * DOWNSTREAM (imported by):
 *   - HealthRecord.ts, EmergencyContact.ts, Allergy.ts, Medication.ts
 *   - StudentRepository.ts, StudentService.ts, StudentController.ts
 *
 * Related Models: User, HealthRecord, EmergencyContact, Allergy, StudentMedication
 */

import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../../config/sequelize';
import { Gender } from '../../types/enums';
import { AuditableModel } from '../base/AuditableModel';

/**
 * @interface StudentAttributes
 * @description TypeScript interface defining all Student model attributes
 *
 * @property {string} id - Primary key, auto-generated UUID
 * @property {string} studentNumber - Unique student identifier, 4-20 alphanumeric chars with hyphens
 * @property {string} firstName - Student's first name, 1-100 chars, letters/spaces/hyphens/apostrophes only
 * @property {string} lastName - Student's last name, 1-100 chars, letters/spaces/hyphens/apostrophes only
 * @property {Date} dateOfBirth - Birth date, must be in past, age 3-100 years (DATEONLY format)
 * @property {string} grade - Current grade level, 1-10 chars (e.g., "K", "1", "12")
 * @property {Gender} gender - Gender (MALE, FEMALE, OTHER, PREFER_NOT_TO_SAY)
 * @property {string} [photo] - Photo URL, max 500 chars, validated URL format (nullable)
 * @property {string} [medicalRecordNum] - Medical record number, 5-20 chars, unique, alphanumeric with hyphens (nullable, PHI)
 * @property {boolean} isActive - Active enrollment status, defaults to true
 * @property {Date} enrollmentDate - Date of enrollment, defaults to current date, must be 2000-present
 * @property {string} [nurseId] - Assigned nurse UUID (nullable)
 * @property {string} [createdBy] - User ID who created record (audit field)
 * @property {string} [updatedBy] - User ID who last updated record (audit field)
 * @property {Date} createdAt - Record creation timestamp
 * @property {Date} updatedAt - Record last update timestamp
 */
export interface StudentAttributes {
  id: string;
  studentNumber: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  grade: string;
  gender: Gender;
  photo?: string;
  medicalRecordNum?: string;
  isActive: boolean;
  enrollmentDate: Date;
  nurseId?: string;
  createdBy?: string;
  updatedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * @interface StudentCreationAttributes
 * @description Attributes required when creating a new Student instance.
 * Extends StudentAttributes with optional fields that have defaults or are auto-generated.
 */
interface StudentCreationAttributes
  extends Optional<
    StudentAttributes,
    'id' | 'createdAt' | 'updatedAt' | 'isActive' | 'enrollmentDate' | 'photo' | 'medicalRecordNum' | 'nurseId' | 'createdBy' | 'updatedBy'
  > {}

/**
 * @class Student
 * @extends Model
 * @description Student model representing students in the school health management system.
 * Contains PHI (Protected Health Information) and is HIPAA-compliant with automatic audit trails.
 *
 * @tablename students
 *
 * Key Features:
 * - Comprehensive field validation (name format, age range, student number format)
 * - HIPAA audit trail via AuditableModel
 * - Unique student number and optional medical record number
 * - Multiple indexes for optimized queries (studentNumber, nurseId, isActive, grade, name)
 * - Computed properties: fullName, age
 * - Associations: emergencyContacts, medications, healthRecords, allergies
 *
 * PHI Fields: firstName, lastName, dateOfBirth, photo, medicalRecordNum
 *
 * @example
 * // Create a new student
 * const student = await Student.create({
 *   studentNumber: 'STU-2024-001',
 *   firstName: 'Emma',
 *   lastName: 'Wilson',
 *   dateOfBirth: new Date('2015-03-15'),
 *   grade: '3',
 *   gender: Gender.FEMALE
 * }, { userId: 'nurse-uuid' });
 *
 * @example
 * // Get student with age calculation
 * const student = await Student.findByPk('student-uuid');
 * console.log(`${student.fullName} is ${student.age} years old`);
 *
 * @example
 * // Find active students in a grade
 * const students = await Student.findAll({
 *   where: { grade: '5', isActive: true }
 * });
 */
export class Student extends Model<StudentAttributes, StudentCreationAttributes> implements StudentAttributes {
  public id!: string;
  public studentNumber!: string;
  public firstName!: string;
  public lastName!: string;
  public dateOfBirth!: Date;
  public grade!: string;
  public gender!: Gender;
  public photo?: string;
  public medicalRecordNum?: string;
  public isActive!: boolean;
  public enrollmentDate!: Date;
  public nurseId?: string;
  public createdBy?: string;
  public updatedBy?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  /**
   * @member {string} fullName
   * @description Computed property returning student's full name.
   * @returns {string} Full name (firstName + lastName)
   * @instance
   * @memberof Student
   * @example
   * console.log(student.fullName); // "Emma Wilson"
   */
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  /**
   * @member {number} age
   * @description Computed property calculating student's current age in years.
   * Accounts for month and day to provide accurate age.
   * @returns {number} Age in years
   * @instance
   * @memberof Student
   * @example
   * const student = await Student.findByPk('student-id');
   * console.log(`Student age: ${student.age}`); // "Student age: 8"
   */
  get age(): number {
    const today = new Date();
    const birthDate = new Date(this.dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  /**
   * @member {any[]} emergencyContacts
   * @description Association with EmergencyContact model (hasMany).
   * Populated when including 'emergencyContacts' in query.
   * @memberof Student
   */
  declare emergencyContacts?: any[];

  /**
   * @member {any[]} medications
   * @description Association with StudentMedication model (hasMany).
   * Populated when including 'medications' in query.
   * @memberof Student
   */
  declare medications?: any[];
}

Student.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    studentNumber: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: {
          msg: 'Student number cannot be empty'
        },
        len: {
          args: [4, 20],
          msg: 'Student number must be between 4 and 20 characters'
        },
        isAlphanumericWithHyphens(value: string) {
          if (!/^[A-Z0-9-]+$/i.test(value)) {
            throw new Error('Student number must be alphanumeric with optional hyphens');
          }
        }
      }
    },
    firstName: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'First name is required'
        },
        len: {
          args: [1, 100],
          msg: 'First name must be between 1 and 100 characters'
        },
        isValidName(value: string) {
          if (!/^[a-zA-Z\s'-]+$/.test(value)) {
            throw new Error('First name can only contain letters, spaces, hyphens, and apostrophes');
          }
        }
      }
    },
    lastName: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Last name is required'
        },
        len: {
          args: [1, 100],
          msg: 'Last name must be between 1 and 100 characters'
        },
        isValidName(value: string) {
          if (!/^[a-zA-Z\s'-]+$/.test(value)) {
            throw new Error('Last name can only contain letters, spaces, hyphens, and apostrophes');
          }
        }
      }
    },
    dateOfBirth: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Date of birth is required'
        },
        isDate: {
          msg: 'Date of birth must be a valid date',
          args: true
        },
        isInPast(value: Date) {
          if (new Date(value) >= new Date()) {
            throw new Error('Date of birth must be in the past');
          }
        },
        isReasonableAge(value: Date) {
          const today = new Date();
          const birthDate = new Date(value);
          const age = today.getFullYear() - birthDate.getFullYear();

          if (age < 3 || age > 100) {
            throw new Error('Student age must be between 3 and 100 years');
          }
        }
      }
    },
    grade: {
      type: DataTypes.STRING(10),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Grade is required'
        },
        len: {
          args: [1, 10],
          msg: 'Grade must be between 1 and 10 characters'
        }
      }
    },
    gender: {
      type: DataTypes.ENUM(...Object.values(Gender)),
      allowNull: false,
      validate: {
        isIn: {
          args: [Object.values(Gender)],
          msg: 'Gender must be MALE, FEMALE, OTHER, or PREFER_NOT_TO_SAY'
        }
      }
    },
    photo: {
      type: DataTypes.STRING(500),
      allowNull: true,
      validate: {
        isUrl: {
          msg: 'Photo must be a valid URL'
        },
        len: {
          args: [0, 500],
          msg: 'Photo URL cannot exceed 500 characters'
        }
      }
    },
    medicalRecordNum: {
      type: DataTypes.STRING(20),
      allowNull: true,
      unique: true,
      validate: {
        len: {
          args: [5, 20],
          msg: 'Medical record number must be between 5 and 20 characters'
        },
        isAlphanumericWithHyphens(value: string) {
          if (value && !/^[A-Z0-9-]+$/i.test(value)) {
            throw new Error('Medical record number must be alphanumeric with optional hyphens');
          }
        }
      }
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      validate: {
        isBoolean(value: any) {
          if (typeof value !== 'boolean') {
            throw new Error('Active status must be a boolean');
          }
        }
      }
    },
    enrollmentDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      validate: {
        isDate: {
          msg: 'Enrollment date must be a valid date',
          args: true
        },
        isReasonableDate(value: Date) {
          const enrollDate = new Date(value);
          const minDate = new Date(2000, 0, 1);
          const maxDate = new Date();
          maxDate.setFullYear(maxDate.getFullYear() + 1);

          if (enrollDate < minDate || enrollDate > maxDate) {
            throw new Error('Enrollment date must be between 2000 and one year from today');
          }
        }
      }
    },
    nurseId: {
      type: DataTypes.STRING(36),
      allowNull: true,
      validate: {
        isUUID: {
          args: 4,
          msg: 'Nurse ID must be a valid UUID'
        }
      }
    },
    ...AuditableModel.getAuditableFields(),
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: 'students',
    timestamps: true,
    indexes: [
      { unique: true, fields: ['studentNumber'] },
      { fields: ['nurseId'] },
      { fields: ['isActive'] },
      { fields: ['grade'] },
      { fields: ['lastName', 'firstName'] },
      { fields: ['createdBy'] },
    ],
  }
);

AuditableModel.setupAuditHooks(Student, 'Student');
