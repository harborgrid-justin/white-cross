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
import { Student } from '../../student/entities/student.entity';

/**
 * HealthRecord Entity
 *
 * Represents a health record entry for a student.
 * This entity stores Protected Health Information (PHI) and must comply
 * with HIPAA regulations.
 *
 * A HealthRecord can be:
 * - A standalone health event (checkup, vaccination, illness, injury, etc.)
 * - A parent record for related health data (vaccinations, vital signs, etc.)
 *
 * HIPAA Compliance:
 * - All health record data is PHI
 * - All access must be audited
 * - Soft deletes preserve audit trail
 * - Attachments must point to encrypted storage
 */
@Entity('health_records')
@Index(['studentId', 'recordDate'])
@Index(['recordType', 'recordDate'])
@Index(['createdBy'])
@Index(['followUpRequired', 'followUpDate'])
export class HealthRecord {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * Student ID (foreign key)
   * @PHI - Links to student identity
   */
  @Column({ name: 'student_id', type: 'uuid' })
  studentId: string;

  /**
   * Type of health record
   */
  @Column({
    name: 'record_type',
    type: 'enum',
    enum: [
      'CHECKUP',
      'VACCINATION',
      'ILLNESS',
      'INJURY',
      'SCREENING',
      'PHYSICAL_EXAM',
      'MENTAL_HEALTH',
      'DENTAL',
      'VISION',
      'HEARING',
      'EXAMINATION',
      'ALLERGY_DOCUMENTATION',
      'CHRONIC_CONDITION_REVIEW',
      'GROWTH_ASSESSMENT',
      'VITAL_SIGNS_CHECK',
      'EMERGENCY_VISIT',
      'FOLLOW_UP',
      'CONSULTATION',
      'DIAGNOSTIC_TEST',
      'PROCEDURE',
      'HOSPITALIZATION',
      'SURGERY',
      'COUNSELING',
      'THERAPY',
      'NUTRITION',
      'MEDICATION_REVIEW',
      'IMMUNIZATION',
      'LAB_RESULT',
      'RADIOLOGY',
      'OTHER',
    ],
  })
  recordType:
    | 'CHECKUP'
    | 'VACCINATION'
    | 'ILLNESS'
    | 'INJURY'
    | 'SCREENING'
    | 'PHYSICAL_EXAM'
    | 'MENTAL_HEALTH'
    | 'DENTAL'
    | 'VISION'
    | 'HEARING'
    | 'EXAMINATION'
    | 'ALLERGY_DOCUMENTATION'
    | 'CHRONIC_CONDITION_REVIEW'
    | 'GROWTH_ASSESSMENT'
    | 'VITAL_SIGNS_CHECK'
    | 'EMERGENCY_VISIT'
    | 'FOLLOW_UP'
    | 'CONSULTATION'
    | 'DIAGNOSTIC_TEST'
    | 'PROCEDURE'
    | 'HOSPITALIZATION'
    | 'SURGERY'
    | 'COUNSELING'
    | 'THERAPY'
    | 'NUTRITION'
    | 'MEDICATION_REVIEW'
    | 'IMMUNIZATION'
    | 'LAB_RESULT'
    | 'RADIOLOGY'
    | 'OTHER';

  /**
   * Title/summary of the health record
   * @PHI
   */
  @Column({ name: 'title', type: 'varchar', length: 200 })
  title: string;

  /**
   * Detailed description
   * @PHI
   */
  @Column({ name: 'description', type: 'text' })
  description: string;

  /**
   * Date of the health record/event
   */
  @Column({ name: 'record_date', type: 'timestamp' })
  recordDate: Date;

  /**
   * Healthcare provider name
   * @PHI
   */
  @Column({ name: 'provider', type: 'varchar', length: 200, nullable: true })
  provider: string | null;

  /**
   * Provider NPI (National Provider Identifier)
   */
  @Column({ name: 'provider_npi', type: 'varchar', length: 20, nullable: true })
  providerNpi: string | null;

  /**
   * Healthcare facility name
   */
  @Column({ name: 'facility', type: 'varchar', length: 200, nullable: true })
  facility: string | null;

  /**
   * Facility NPI
   */
  @Column({ name: 'facility_npi', type: 'varchar', length: 20, nullable: true })
  facilityNpi: string | null;

  /**
   * Diagnosis description
   * @PHI
   */
  @Column({ name: 'diagnosis', type: 'text', nullable: true })
  diagnosis: string | null;

  /**
   * ICD-10 diagnosis code
   */
  @Column({ name: 'diagnosis_code', type: 'varchar', length: 20, nullable: true })
  diagnosisCode: string | null;

  /**
   * Treatment provided
   * @PHI
   */
  @Column({ name: 'treatment', type: 'text', nullable: true })
  treatment: string | null;

  /**
   * Whether follow-up is required
   */
  @Column({ name: 'follow_up_required', type: 'boolean', default: false })
  followUpRequired: boolean;

  /**
   * Scheduled follow-up date
   */
  @Column({ name: 'follow_up_date', type: 'timestamp', nullable: true })
  followUpDate: Date | null;

  /**
   * Whether follow-up has been completed
   */
  @Column({ name: 'follow_up_completed', type: 'boolean', default: false })
  followUpCompleted: boolean;

  /**
   * Array of attachment URLs (must point to encrypted storage)
   * @PHI - May contain medical images/documents
   */
  @Column({ name: 'attachments', type: 'simple-array', default: '' })
  attachments: string[];

  /**
   * Additional metadata (flexible JSON storage)
   */
  @Column({ name: 'metadata', type: 'jsonb', nullable: true })
  metadata: Record<string, any> | null;

  /**
   * Whether record is marked as confidential (extra sensitivity)
   */
  @Column({ name: 'is_confidential', type: 'boolean', default: false })
  isConfidential: boolean;

  /**
   * Additional notes
   * @PHI
   */
  @Column({ name: 'notes', type: 'text', nullable: true })
  notes: string | null;

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
   */
  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date | null;

  // Relationships

  /**
   * Student this health record belongs to
   */
  @ManyToOne(() => Student, { nullable: false })
  @JoinColumn({ name: 'student_id' })
  student: Student;

  /**
   * Vaccinations associated with this health record
   */
  // @OneToMany(() => Vaccination, (vaccination) => vaccination.healthRecord)
  // vaccinations: Vaccination[];

  /**
   * Vital signs associated with this health record
   */
  // @OneToMany(() => VitalSigns, (vitalSigns) => vitalSigns.healthRecord)
  // vitalSigns: VitalSigns[];

  /**
   * Allergies documented in this health record
   */
  // @OneToMany(() => Allergy, (allergy) => allergy.healthRecord)
  // allergies: Allergy[];

  /**
   * Chronic conditions reviewed in this health record
   */
  // @OneToMany(() => ChronicCondition, (chronicCondition) => chronicCondition.healthRecord)
  // chronicConditions: ChronicCondition[];

  /**
   * Check if follow-up is overdue
   * @returns true if follow-up is required but date has passed
   */
  isFollowUpOverdue(): boolean {
    if (!this.followUpRequired || !this.followUpDate || this.followUpCompleted) {
      return false;
    }
    return new Date() > this.followUpDate;
  }

  /**
   * Get days until follow-up (negative if overdue)
   * @returns days until follow-up, null if not applicable
   */
  getDaysUntilFollowUp(): number | null {
    if (!this.followUpRequired || !this.followUpDate || this.followUpCompleted) {
      return null;
    }
    const diff = this.followUpDate.getTime() - new Date().getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }
}
