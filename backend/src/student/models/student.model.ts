import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  Index,
  ForeignKey,
  BelongsTo,
  HasMany,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
} from 'sequelize-typescript';

/**
 * Student gender enumeration
 */
export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
  PREFER_NOT_TO_SAY = 'PREFER_NOT_TO_SAY',
}

/**
 * Student Model
 *
 * Represents a student within the White Cross Healthcare Platform.
 * This model stores Protected Health Information (PHI) and must comply
 * with HIPAA regulations for student health records.
 *
 * HIPAA Compliance:
 * - All student data is considered PHI
 * - All access must be audited via audit_logs table
 * - medicalRecordNum must be unique and protected
 * - Photo URLs must point to encrypted storage
 * - Soft deletes used to preserve audit trail
 */
@Table({
  tableName: 'students',
  timestamps: true,
  paranoid: true, // Enables soft deletes
})
export class Student extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.STRING)
  declare id: string;

  /**
   * School-assigned student ID
   * @PHI - Protected Health Information
   */
  @Index({ unique: true })
  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    unique: true,
  })
  studentNumber: string;

  /**
   * Student's first name
   * @PHI - Protected Health Information
   */
  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  firstName: string;

  /**
   * Student's last name
   * @PHI - Protected Health Information
   */
  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  lastName: string;

  /**
   * Student's date of birth
   * @PHI - Protected Health Information
   */
  @Column({
    type: DataType.DATEONLY,
    allowNull: false,
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
  @Column({
    type: DataType.STRING(500),
    allowNull: true,
  })
  photo?: string;

  /**
   * Medical record number (unique identifier for healthcare)
   * @PHI - Protected Health Information
   */
  @Column({
    type: DataType.STRING(50),
    allowNull: true,
    unique: true,
  })
  medicalRecordNum?: string;

  /**
   * Active enrollment status
   */
  @Default(true)
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  isActive: boolean;

  /**
   * School enrollment date
   */
  @Default(DataType.NOW)
  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  enrollmentDate: Date;

  /**
   * Assigned nurse ID (foreign key to users table)
   */
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  nurseId?: string;

  /**
   * School ID (foreign key to schools table)
   */
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  schoolId?: string;

  /**
   * District ID (foreign key to districts table)
   */
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  districtId?: string;

  /**
   * User who created this record
   */
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  createdBy?: string;

  /**
   * User who last updated this record
   */
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  updatedBy?: string;

  @CreatedAt
  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  declare createdAt: Date;

  @UpdatedAt
  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  declare updatedAt: Date;

  /**
   * Soft delete timestamp (for HIPAA compliance and audit trail)
   * When set, student is marked as deleted but data is preserved
   */
  @DeletedAt
  declare deletedAt?: Date;

  // Relationships will be added as related models are converted
  // Note: Commented out until related entities are created to avoid compilation errors
  // Will be uncommented as entities are created

  /**
   * Assigned nurse (BelongsTo relationship to User model)
   */
  // @BelongsTo(() => User)
  // nurse?: User;

  /**
   * School (BelongsTo relationship to School model)
   */
  // @BelongsTo(() => School)
  // school?: School;

  /**
   * District (BelongsTo relationship to District model)
   */
  // @BelongsTo(() => District)
  // district?: District;

  /**
   * Health records for this student
   */
  // @HasMany(() => HealthRecord)
  // healthRecords?: HealthRecord[];

  /**
   * Vaccinations for this student
   */
  // @HasMany(() => Vaccination)
  // vaccinations?: Vaccination[];

  /**
   * Vital signs records for this student
   */
  // @HasMany(() => VitalSigns)
  // vitalSigns?: VitalSigns[];

  /**
   * Allergies for this student
   */
  // @HasMany(() => Allergy)
  // allergies?: Allergy[];

  /**
   * Chronic conditions for this student
   */
  // @HasMany(() => ChronicCondition)
  // chronicConditions?: ChronicCondition[];

  /**
   * Academic records for this student
   */
  // @HasMany(() => AcademicRecord)
  // academicRecords?: AcademicRecord[];

  /**
   * Transcripts for this student
   */
  // @HasMany(() => Transcript)
  // transcripts?: Transcript[];

  /**
   * Alerts related to this student
   */
  // @HasMany(() => Alert)
  // alerts?: Alert[];

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
