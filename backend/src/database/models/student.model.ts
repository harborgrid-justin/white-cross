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
} from 'sequelize-typescript';
import { Op } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';

/**
 * Student gender enumeration
 */
export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
  PREFER_NOT_TO_SAY = 'PREFER_NOT_TO_SAY',
}

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
  schoolId?: string;
  districtId?: string;
  createdBy?: string;
  updatedBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

@Table({
  tableName: 'students',
  timestamps: true,
  paranoid: false, // Disable soft deletes - table doesn't have deletedAt column
  indexes: [
    {
      fields: ['studentNumber'],
      unique: true,
    },
    {
      fields: ['nurseId'],
    },
    {
      fields: ['isActive'],
    },
    {
      fields: ['grade'],
    },
    {
      fields: ['lastName', 'firstName'],
    },
    {
      fields: ['medicalRecordNum'],
      unique: true,
      where: {
        medicalRecordNum: {
          [Op.ne]: null,
        },
      },
    },
  ],
})
export class Student extends Model<StudentAttributes> implements StudentAttributes {
  @PrimaryKey
  @Default(() => uuidv4())
  @Column(DataType.UUID)
  declare id: string;

  /**
   * School-assigned student ID
   * @PHI - Protected Health Information
   */
  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    unique: true,
    field: 'studentNumber',
  })
  studentNumber: string;

  /**
   * Student's first name
   * @PHI - Protected Health Information
   */
  @Column({
    type: DataType.STRING(100),
    allowNull: false,
    field: 'firstName',
  })
  firstName: string;

  /**
   * Student's last name
   * @PHI - Protected Health Information
   */
  @Column({
    type: DataType.STRING(100),
    allowNull: false,
    field: 'lastName',
  })
  lastName: string;

  /**
   * Student's date of birth
   * @PHI - Protected Health Information
   */
  @Column({
    type: DataType.DATEONLY,
    allowNull: false,
    field: 'dateOfBirth',
  })
  dateOfBirth: Date;

  /**
   * Current grade level (e.g., "K", "1", "2", "12")
   */
  @Column({
    type: DataType.STRING(10),
    allowNull: false,
  })
  grade: string;

  /**
   * Student gender
   */
  @Column({
    type: DataType.ENUM(...(Object.values(Gender) as string[])),
    allowNull: false,
  })
  gender: Gender;

  /**
   * Profile photo URL (must point to encrypted storage)
   * @PHI - Protected Health Information
   */
  @AllowNull
  @Column({
    type: DataType.STRING(500),
    field: 'photo',
  })
  photo?: string;

  /**
   * Medical record number (unique identifier for healthcare)
   * @PHI - Protected Health Information
   */
  @AllowNull
  @Column({
    type: DataType.STRING(50),
    unique: true,
    field: 'medicalRecordNum',
  })
  medicalRecordNum?: string;

  /**
   * Active enrollment status
   */
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    field: 'isActive',
  })
  isActive: boolean;

  /**
   * School enrollment date
   */
  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
    field: 'enrollmentDate',
  })
  enrollmentDate: Date;

  /**
   * Assigned nurse ID (foreign key to users table)
   */
  @AllowNull
  @ForeignKey(() => require('./user.model').User)
  @Column({
    type: DataType.UUID,
    field: 'nurseId',
  })
  nurseId?: string;

  /**
   * School ID (foreign key to schools table)
   */
  @AllowNull
  @ForeignKey(() => require('./school.model').School)
  @Column({
    type: DataType.UUID,
    field: 'schoolId',
  })
  schoolId?: string;

  /**
   * District ID (foreign key to districts table)
   */
  @AllowNull
  @ForeignKey(() => require('./district.model').District)
  @Column({
    type: DataType.UUID,
    field: 'districtId',
  })
  districtId?: string;

  /**
   * User who created this record
   */
  @AllowNull
  @Column({
    type: DataType.UUID,
    field: 'createdBy',
  })
  createdBy?: string;

  /**
   * User who last updated this record
   */
  @AllowNull
  @Column({
    type: DataType.UUID,
    field: 'updatedBy',
  })
  updatedBy?: string;

  @Column({
    type: DataType.DATE,
    field: 'createdAt',
  })
  declare createdAt?: Date;

  @Column({
    type: DataType.DATE,
    field: 'updatedAt',
  })
  declare updatedAt?: Date;

  // Relationships
  // Using lazy evaluation with require() to prevent circular dependencies
  @BelongsTo(() => require('./user.model').User, { foreignKey: 'nurseId', as: 'nurse' })
  declare nurse?: any;

  @BelongsTo(() => require('./school.model').School, { foreignKey: 'schoolId', as: 'school' })
  declare school?: any;

  @BelongsTo(() => require('./district.model').District, { foreignKey: 'districtId', as: 'district' })
  declare district?: any;

  // One-to-many relationships
  @HasMany(() => require('./health-record.model').HealthRecord, { foreignKey: 'studentId', as: 'healthRecords' })
  declare healthRecords?: any[];

  @HasMany(() => require('./academic-transcript.model').AcademicTranscript, { foreignKey: 'studentId', as: 'academicTranscripts' })
  declare academicTranscripts?: any[];

  @HasMany(() => require('./mental-health-record.model').MentalHealthRecord, { foreignKey: 'studentId', as: 'mentalHealthRecords' })
  declare mentalHealthRecords?: any[];

  // Additional relationships (commented out until related models are available)
  // @HasMany(() => Vaccination, { foreignKey: 'studentId', as: 'vaccinations' })
  // vaccinations?: Vaccination[];

  // @HasMany(() => VitalSigns, { foreignKey: 'studentId', as: 'vitalSigns' })
  // vitalSigns?: VitalSigns[];

  // @HasMany(() => Allergy, { foreignKey: 'studentId', as: 'allergies' })
  // allergies?: Allergy[];

  // @HasMany(() => ChronicCondition, { foreignKey: 'studentId', as: 'chronicConditions' })
  // chronicConditions?: ChronicCondition[];

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
