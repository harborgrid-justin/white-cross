import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  AllowNull,
  Index,
  ForeignKey,
  BelongsTo,
  HasMany,
  BeforeCreate,
  BeforeUpdate,
  Scopes
  } from 'sequelize-typescript';
import { Optional } from 'sequelize';
import { Op } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import type { User } from './user.model';
import type { School } from './school.model';
import type { District } from './district.model';
import type { HealthRecord } from './health-record.model';
import type { AcademicTranscript } from './academic-transcript.model';
import type { MentalHealthRecord } from './mental-health-record.model';
import type { Appointment } from './appointment.model';
import type { Prescription } from './prescription.model';
import type { ClinicVisit } from './clinic-visit.model';
import type { Allergy } from './allergy.model';
import type { ChronicCondition } from './chronic-condition.model';
import type { Vaccination } from './vaccination.model';
import type { VitalSigns } from './vital-signs.model';
import type { ClinicalNote } from './clinical-note.model';
import type { IncidentReport } from './incident-report.model';

/**
 * Student gender enumeration
 */
export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
  PREFER_NOT_TO_SAY = 'PREFER_NOT_TO_SAY'
  }

export interface StudentAttributes {
  id: string;
  studentNumber: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  grade: string;
  gender: Gender;
  photo?: string | null;
  medicalRecordNum?: string | null;
  isActive: boolean;
  enrollmentDate: Date;
  nurseId?: string | null;
  schoolId?: string | null;
  districtId?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface StudentCreationAttributes
  extends Optional<
    StudentAttributes,
    | 'id'
    | 'photo'
    | 'medicalRecordNum'
    | 'isActive'
    | 'enrollmentDate'
    | 'nurseId'
    | 'schoolId'
    | 'districtId'
    | 'createdBy'
    | 'updatedBy'
    | 'deletedAt'
    | 'createdAt'
    | 'updatedAt'
  > {}

@Scopes(() => ({
  active: {
    where: {
      isActive: true,
      deletedAt: null
    }
  },
  byGrade: (grade: string) => ({
    where: { grade }
  }),
  bySchool: (schoolId: string) => ({
    where: { schoolId }
  }),
  byDistrict: (districtId: string) => ({
    where: { districtId }
  }),
  withHealthRecords: {
    include: [{
      association: 'healthRecords'
    }]
  },
  recentlyEnrolled: {
    where: {
      enrollmentDate: {
        [Op.gte]: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      }
    },
    order: [['enrollmentDate', 'DESC']]
  }
}))
@Table({
  tableName: 'students',
  timestamps: true,
  underscored: false,
  paranoid: true, // Enable soft deletes for HIPAA compliance - PHI data requires audit trail
  indexes: [
    {
      fields: ['studentNumber'],
      unique: true
    },
    {
      fields: ['nurseId']
    },
    {
      fields: ['schoolId']
    },
    {
      fields: ['districtId']
    },
    {
      fields: ['isActive']
    },
    {
      fields: ['grade']
    },
    {
      fields: ['lastName', 'firstName']
    },
    {
      fields: ['medicalRecordNum'],
      unique: true,
      where: {
        medicalRecordNum: {
          [Op.ne]: null
        }
      }
    },
    {
      fields: ['schoolId', 'grade', 'isActive'],
      name: 'idx_students_school_grade_active'
    },
    {
      fields: ['districtId', 'isActive'],
      name: 'idx_students_district_active'
    },
    {
      fields: ['enrollmentDate'],
      name: 'idx_students_enrollment_date'
    },
    {
      fields: ['createdAt'],
      name: 'idx_students_created_at'
    },
    {
      fields: ['updatedAt'],
      name: 'idx_students_updated_at'
    }
  ]
  })
export class Student extends Model<StudentAttributes, StudentCreationAttributes> implements StudentAttributes {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: string;

  /**
   * School-assigned student ID
   * @PHI - Protected Health Information
   */
  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    unique: true
  })
  studentNumber: string;

  /**
   * Student's first name
   * @PHI - Protected Health Information
   */
  @Column({
    type: DataType.STRING(100),
    allowNull: false
  })
  firstName: string;

  /**
   * Student's last name
   * @PHI - Protected Health Information
   */
  @Column({
    type: DataType.STRING(100),
    allowNull: false
  })
  lastName: string;

  /**
   * Student's date of birth
   * @PHI - Protected Health Information
   */
  @Column({
    type: DataType.DATEONLY,
    allowNull: false,
    validate: {
      isDate: true,
      isBefore: new Date().toISOString(),
      isValidAge(value: string) {
        const dob = new Date(value);
        const age = (Date.now() - dob.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
        if (age < 3 || age > 22) {
          throw new Error('Student age must be between 3 and 22 years');
        }
      }
    }
  })
  dateOfBirth: Date;

  /**
   * Current grade level (e.g., "K", "1", "2", "12")
   */
  @Column({
    type: DataType.STRING(10),
    allowNull: false
  })
  grade: string;

  /**
   * Student gender
   */
  @Column({
    type: DataType.STRING(20),
    allowNull: false,
    validate: {
      isIn: [Object.values(Gender)]
    }
  })
  gender: Gender;

  /**
   * Profile photo URL (must point to encrypted storage)
   * @PHI - Protected Health Information
   */
  @AllowNull
  @Column({
    type: DataType.STRING(500)
  })
  photo?: string;

  /**
   * Medical record number (unique identifier for healthcare)
   * @PHI - Protected Health Information
   */
  @AllowNull
  @Column({
    type: DataType.STRING(50),
    unique: true
  })
  medicalRecordNum?: string;

  /**
   * Active enrollment status
   */
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true
  })
  isActive: boolean;

  /**
   * School enrollment date
   */
  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW
  })
  enrollmentDate: Date;

  /**
   * Assigned nurse ID (foreign key to users table)
   */
  @AllowNull
  @ForeignKey(() => require('./user.model').User)
  @Column({
    type: DataType.UUID,
    references: {
      model: 'users',
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL'
  })
  nurseId?: string;

  /**
   * School ID (foreign key to schools table)
   */
  @AllowNull
  @ForeignKey(() => require('./school.model').School)
  @Column({
    type: DataType.UUID,
    references: {
      model: 'schools',
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  })
  schoolId?: string;

  /**
   * District ID (foreign key to districts table)
   */
  @AllowNull
  @ForeignKey(() => require('./district.model').District)
  @Column({
    type: DataType.UUID,
    references: {
      model: 'districts',
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  })
  districtId?: string;

  /**
   * User who created this record
   */
  @AllowNull
  @Column({
    type: DataType.UUID
  })
  createdBy?: string;

  /**
   * User who last updated this record
   */
  @AllowNull
  @Column({
    type: DataType.UUID
  })
  updatedBy?: string;

  @Column({
    type: DataType.DATE
  })
  declare createdAt: Date;

  @Column({
    type: DataType.DATE
  })
  declare updatedAt: Date;

  @Column({
    type: DataType.DATE
  })
  declare deletedAt?: Date;

  /**
   * Virtual attribute: Full name
   */
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  /**
   * Virtual attribute: Age in years
   */
  get age(): number {
    return this.getAge();
  }

  // Hooks
  @BeforeCreate
  @BeforeUpdate
  static async validateEnrollmentDate(instance: Student) {
    if (instance.enrollmentDate && instance.enrollmentDate > new Date()) {
      throw new Error('Enrollment date cannot be in the future');
    }
  }

  @BeforeCreate
  @BeforeUpdate
  static async auditPHIAccess(instance: Student) {
    // Log PHI access for HIPAA compliance
    if (instance.changed()) {
      const changedFields = instance.changed() as string[];
      const phiFields = ['firstName', 'lastName', 'dateOfBirth', 'medicalRecordNum', 'photo'];

      // Import the helper function dynamically to avoid circular dependencies
      const { logModelPHIFieldChanges } = await import('../services/model-audit-helper.service.js');

      // Get the transaction if available
      const transaction = (instance as any).sequelize?.transaction || undefined;

      await logModelPHIFieldChanges(
        'Student',
        instance.id,
        changedFields,
        phiFields,
        transaction,
      );
    }
  }

  // Relationships
  // Using lazy evaluation with require() to prevent circular dependencies
  @BelongsTo(() => require('./user.model').User, { foreignKey: 'nurseId', as: 'nurse' })
  declare nurse?: User;

  @BelongsTo(() => require('./school.model').School, { foreignKey: 'schoolId', as: 'school' })
  declare school?: School;

  @BelongsTo(() => require('./district.model').District, { foreignKey: 'districtId', as: 'district' })
  declare district?: District;

  // One-to-many relationships
  @HasMany(() => require('./health-record.model').HealthRecord, { foreignKey: 'studentId', as: 'healthRecords' })
  declare healthRecords?: HealthRecord[];

  @HasMany(() => require('./academic-transcript.model').AcademicTranscript, { foreignKey: 'studentId', as: 'academicTranscripts' })
  declare academicTranscripts?: AcademicTranscript[];

  @HasMany(() => require('./mental-health-record.model').MentalHealthRecord, { foreignKey: 'studentId', as: 'mentalHealthRecords' })
  declare mentalHealthRecords?: MentalHealthRecord[];

  @HasMany(() => require('./appointment.model').Appointment, { foreignKey: 'studentId', as: 'appointments' })
  declare appointments?: Appointment[];

  @HasMany(() => require('./prescription.model').Prescription, { foreignKey: 'studentId', as: 'prescriptions' })
  declare prescriptions?: Prescription[];

  @HasMany(() => require('./clinic-visit.model').ClinicVisit, { foreignKey: 'studentId', as: 'clinicVisits' })
  declare clinicVisits?: ClinicVisit[];

  @HasMany(() => require('./allergy.model').Allergy, { foreignKey: 'studentId', as: 'allergies' })
  declare allergies?: Allergy[];

  @HasMany(() => require('./chronic-condition.model').ChronicCondition, { foreignKey: 'studentId', as: 'chronicConditions' })
  declare chronicConditions?: ChronicCondition[];

  @HasMany(() => require('./vaccination.model').Vaccination, { foreignKey: 'studentId', as: 'vaccinations' })
  declare vaccinations?: Vaccination[];

  @HasMany(() => require('./vital-signs.model').VitalSigns, { foreignKey: 'studentId', as: 'vitalSigns' })
  declare vitalSigns?: VitalSigns[];

  @HasMany(() => require('./clinical-note.model').ClinicalNote, { foreignKey: 'studentId', as: 'clinicalNotes' })
  declare clinicalNotes?: ClinicalNote[];

  @HasMany(() => require('./incident-report.model').IncidentReport, { foreignKey: 'studentId', as: 'incidentReports' })
  declare incidentReports?: IncidentReport[];

  /**
   * Get student's full name
   * @returns Full name in "Last, First" format
   */
  getFullName(): string {
    return `${this.lastName}, ${this.firstName}`;
  }

  /**
   * Get student's age based on date of birth
   * @returns Age in years
   */
  getAge(): number {
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
   * Check if student is currently enrolled (active)
   * @returns true if student is active
   */
  isCurrentlyEnrolled(): boolean {
    return this.isActive;
  }
}
