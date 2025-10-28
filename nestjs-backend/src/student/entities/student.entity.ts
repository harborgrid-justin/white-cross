import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
} from 'typeorm';

/**
 * Student Entity
 *
 * Represents a student within the White Cross Healthcare Platform.
 * This entity stores Protected Health Information (PHI) and must comply
 * with HIPAA regulations for student health records.
 *
 * HIPAA Compliance:
 * - All student data is considered PHI
 * - All access must be audited via audit_logs table
 * - medicalRecordNum must be unique and protected
 * - Photo URLs must point to encrypted storage
 * - Soft deletes used to preserve audit trail
 */
@Entity('students')
@Index(['studentNumber'], { unique: true })
@Index(['nurseId'])
@Index(['isActive'])
@Index(['grade'])
@Index(['lastName', 'firstName'])
@Index(['medicalRecordNum'], { unique: true, where: 'medical_record_num IS NOT NULL' })
export class Student {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * School-assigned student ID
   * @PHI - Protected Health Information
   */
  @Column({ name: 'student_number', type: 'varchar', length: 50, unique: true })
  studentNumber: string;

  /**
   * Student's first name
   * @PHI - Protected Health Information
   */
  @Column({ name: 'first_name', type: 'varchar', length: 100 })
  firstName: string;

  /**
   * Student's last name
   * @PHI - Protected Health Information
   */
  @Column({ name: 'last_name', type: 'varchar', length: 100 })
  lastName: string;

  /**
   * Student's date of birth
   * @PHI - Protected Health Information
   */
  @Column({ name: 'date_of_birth', type: 'date' })
  dateOfBirth: Date;

  /**
   * Current grade level (e.g., "K", "1", "2", "12")
   */
  @Column({ name: 'grade', type: 'varchar', length: 10 })
  grade: string;

  /**
   * Student gender
   */
  @Column({
    name: 'gender',
    type: 'enum',
    enum: ['MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY'],
  })
  gender: 'MALE' | 'FEMALE' | 'OTHER' | 'PREFER_NOT_TO_SAY';

  /**
   * Profile photo URL (must point to encrypted storage)
   * @PHI - Protected Health Information
   */
  @Column({ name: 'photo', type: 'varchar', length: 500, nullable: true })
  photo: string | null;

  /**
   * Medical record number (unique identifier for healthcare)
   * @PHI - Protected Health Information
   */
  @Column({ name: 'medical_record_num', type: 'varchar', length: 50, nullable: true, unique: true })
  medicalRecordNum: string | null;

  /**
   * Active enrollment status
   */
  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  /**
   * School enrollment date
   */
  @Column({ name: 'enrollment_date', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  enrollmentDate: Date;

  /**
   * Assigned nurse ID (foreign key to users table)
   */
  @Column({ name: 'nurse_id', type: 'uuid', nullable: true })
  nurseId: string | null;

  /**
   * School ID (foreign key to schools table)
   */
  @Column({ name: 'school_id', type: 'uuid', nullable: true })
  schoolId: string | null;

  /**
   * District ID (foreign key to districts table)
   */
  @Column({ name: 'district_id', type: 'uuid', nullable: true })
  districtId: string | null;

  /**
   * User who created this record
   */
  @Column({ name: 'created_by', type: 'uuid', nullable: true })
  createdBy: string | null;

  /**
   * User who last updated this record
   */
  @Column({ name: 'updated_by', type: 'uuid', nullable: true })
  updatedBy: string | null;

  /**
   * Record creation timestamp
   */
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  /**
   * Last update timestamp
   */
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  /**
   * Soft delete timestamp (for HIPAA compliance and audit trail)
   * When set, student is marked as deleted but data is preserved
   */
  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date | null;

  // Relationships
  // Note: Commented out until related entities are created to avoid compilation errors
  // Will be uncommented as entities are created

  /**
   * Assigned nurse (ManyToOne relationship to User entity)
   */
  // @ManyToOne(() => User, (user) => user.assignedStudents, { nullable: true })
  // @JoinColumn({ name: 'nurse_id' })
  // nurse: User | null;

  /**
   * School (ManyToOne relationship to School entity)
   */
  // @ManyToOne(() => School, (school) => school.students, { nullable: true })
  // @JoinColumn({ name: 'school_id' })
  // school: School | null;

  /**
   * District (ManyToOne relationship to District entity)
   */
  // @ManyToOne(() => District, (district) => district.students, { nullable: true })
  // @JoinColumn({ name: 'district_id' })
  // district: District | null;

  /**
   * Health records for this student
   */
  // @OneToMany(() => HealthRecord, (healthRecord) => healthRecord.student)
  // healthRecords: HealthRecord[];

  /**
   * Vaccinations for this student
   */
  // @OneToMany(() => Vaccination, (vaccination) => vaccination.student)
  // vaccinations: Vaccination[];

  /**
   * Vital signs records for this student
   */
  // @OneToMany(() => VitalSigns, (vitalSigns) => vitalSigns.student)
  // vitalSigns: VitalSigns[];

  /**
   * Allergies for this student
   */
  // @OneToMany(() => Allergy, (allergy) => allergy.student)
  // allergies: Allergy[];

  /**
   * Chronic conditions for this student
   */
  // @OneToMany(() => ChronicCondition, (chronicCondition) => chronicCondition.student)
  // chronicConditions: ChronicCondition[];

  /**
   * Academic records for this student
   */
  // @OneToMany(() => AcademicRecord, (academicRecord) => academicRecord.student)
  // academicRecords: AcademicRecord[];

  /**
   * Transcripts for this student
   */
  // @OneToMany(() => Transcript, (transcript) => transcript.student)
  // transcripts: Transcript[];

  /**
   * Alerts related to this student
   */
  // @OneToMany(() => Alert, (alert) => alert.student)
  // alerts: Alert[];

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
