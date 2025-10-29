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
  deletedAt?: Date;
}

@Table({
  tableName: 'students',
  timestamps: true,
  paranoid: true, // Enable soft deletes for HIPAA compliance
  indexes: [
    {
      fields: ['student_number'],
      unique: true,
    },
    {
      fields: ['nurse_id'],
    },
    {
      fields: ['is_active'],
    },
    {
      fields: ['grade'],
    },
    {
      fields: ['last_name', 'first_name'],
    },
    {
      fields: ['medical_record_num'],
      unique: true,
      where: {
        medical_record_num: {
          [require('sequelize').Op.ne]: null,
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
    field: 'student_number',
  })
  studentNumber: string;

  /**
   * Student's first name
   * @PHI - Protected Health Information
   */
  @Column({
    type: DataType.STRING(100),
    allowNull: false,
    field: 'first_name',
  })
  firstName: string;

  /**
   * Student's last name
   * @PHI - Protected Health Information
   */
  @Column({
    type: DataType.STRING(100),
    allowNull: false,
    field: 'last_name',
  })
  lastName: string;

  /**
   * Student's date of birth
   * @PHI - Protected Health Information
   */
  @Column({
    type: DataType.DATEONLY,
    allowNull: false,
    field: 'date_of_birth',
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
    type: DataType.ENUM(...Object.values(Gender)),
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
    field: 'medical_record_num',
  })
  medicalRecordNum?: string;

  /**
   * Active enrollment status
   */
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    field: 'is_active',
  })
  isActive: boolean;

  /**
   * School enrollment date
   */
  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
    field: 'enrollment_date',
  })
  enrollmentDate: Date;

  /**
   * Assigned nurse ID (foreign key to users table)
   */
  @AllowNull
  @ForeignKey(() => require('./user.model').User)
  @Column({
    type: DataType.UUID,
    field: 'nurse_id',
  })
  nurseId?: string;

  /**
   * School ID (foreign key to schools table)
   */
  @AllowNull
  @ForeignKey(() => require('./school.model').School)
  @Column({
    type: DataType.UUID,
    field: 'school_id',
  })
  schoolId?: string;

  /**
   * District ID (foreign key to districts table)
   */
  @AllowNull
  @ForeignKey(() => require('./district.model').District)
  @Column({
    type: DataType.UUID,
    field: 'district_id',
  })
  districtId?: string;

  /**
   * User who created this record
   */
  @AllowNull
  @Column({
    type: DataType.UUID,
    field: 'created_by',
  })
  createdBy?: string;

  /**
   * User who last updated this record
   */
  @AllowNull
  @Column({
    type: DataType.UUID,
    field: 'updated_by',
  })
  updatedBy?: string;

  @Column(DataType.DATE)
  declare createdAt?: Date;

  @Column(DataType.DATE)
  declare updatedAt?: Date;

  @Column(DataType.DATE)
  declare deletedAt?: Date;

  // Relationships
  @BelongsTo(() => require('./user.model').User, { foreignKey: 'nurseId', as: 'nurse' })
  nurse?: any;

  @BelongsTo(() => require('./school.model').School, { foreignKey: 'schoolId', as: 'school' })
  school?: any;

  @BelongsTo(() => require('./district.model').District, { foreignKey: 'districtId', as: 'district' })
  district?: any;

  // One-to-many relationships
  @HasMany(() => require('./health-record.model').HealthRecord, { foreignKey: 'studentId', as: 'healthRecords' })
  healthRecords?: any[];

  @HasMany(() => require('./academic-transcript.model').AcademicTranscript, { foreignKey: 'studentId', as: 'academicTranscripts' })
  academicTranscripts?: any[];

  @HasMany(() => require('./mental-health-record.model').MentalHealthRecord, { foreignKey: 'studentId', as: 'mentalHealthRecords' })
  mentalHealthRecords?: any[];

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
   * Check if student is currently enrolled (active and not deleted)
   * @returns true if student is active and not soft-deleted
   */
  isCurrentlyEnrolled(): boolean {
    return this.isActive && !this.deletedAt;
  }
}
