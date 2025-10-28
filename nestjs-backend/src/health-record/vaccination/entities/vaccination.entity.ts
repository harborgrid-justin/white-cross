import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Student } from '../../../student/entities/student.entity';
import { HealthRecord } from '../../entities/health-record.entity';

/**
 * Vaccination Entity
 *
 * CDC-compliant vaccination tracking for school health records.
 * Supports complete immunization documentation including CVX codes,
 * lot numbers, administration details, and compliance tracking.
 *
 * HIPAA Compliance:
 * - All vaccination data is PHI
 * - VIS (Vaccine Information Statement) documentation required
 * - Soft deletes preserve immunization history
 *
 * CDC Compliance:
 * - CVX codes (Vaccine Administered codes)
 * - NDC codes (National Drug Codes)
 * - Site and route of administration tracking
 * - Dose number and series tracking
 * - VFC (Vaccines for Children) eligibility tracking
 */
@Entity('vaccinations')
@Index(['studentId', 'administrationDate'])
@Index(['vaccineType', 'complianceStatus'])
@Index(['nextDueDate'])
@Index(['expirationDate'])
export class Vaccination {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * Student ID (foreign key, required)
   * @PHI - Links to student identity
   */
  @Column({ name: 'student_id', type: 'uuid' })
  studentId: string;

  /**
   * Health Record ID (foreign key, optional)
   * Links to specific health event if vaccination was part of clinic visit
   */
  @Column({ name: 'health_record_id', type: 'uuid', nullable: true })
  healthRecordId: string | null;

  /**
   * Vaccine name (e.g., "Moderna COVID-19 Vaccine", "MMR Vaccine")
   */
  @Column({ name: 'vaccine_name', type: 'varchar', length: 200 })
  vaccineName: string;

  /**
   * Vaccine type classification
   */
  @Column({
    name: 'vaccine_type',
    type: 'enum',
    enum: [
      'COVID_19',
      'FLU',
      'MEASLES',
      'MUMPS',
      'RUBELLA',
      'MMR',
      'POLIO',
      'HEPATITIS_A',
      'HEPATITIS_B',
      'VARICELLA',
      'TETANUS',
      'DIPHTHERIA',
      'PERTUSSIS',
      'TDAP',
      'DTAP',
      'HIB',
      'PNEUMOCOCCAL',
      'ROTAVIRUS',
      'MENINGOCOCCAL',
      'HPV',
      'OTHER',
    ],
    nullable: true,
  })
  vaccineType:
    | 'COVID_19'
    | 'FLU'
    | 'MEASLES'
    | 'MUMPS'
    | 'RUBELLA'
    | 'MMR'
    | 'POLIO'
    | 'HEPATITIS_A'
    | 'HEPATITIS_B'
    | 'VARICELLA'
    | 'TETANUS'
    | 'DIPHTHERIA'
    | 'PERTUSSIS'
    | 'TDAP'
    | 'DTAP'
    | 'HIB'
    | 'PNEUMOCOCCAL'
    | 'ROTAVIRUS'
    | 'MENINGOCOCCAL'
    | 'HPV'
    | 'OTHER'
    | null;

  /**
   * Vaccine manufacturer
   */
  @Column({ name: 'manufacturer', type: 'varchar', length: 100, nullable: true })
  manufacturer: string | null;

  /**
   * Vaccine lot number (for recall tracking)
   */
  @Column({ name: 'lot_number', type: 'varchar', length: 50, nullable: true })
  lotNumber: string | null;

  /**
   * CVX code (CDC Vaccine Administered code)
   * Standard coding system for vaccines
   */
  @Column({ name: 'cvx_code', type: 'varchar', length: 10, nullable: true })
  cvxCode: string | null;

  /**
   * NDC code (National Drug Code)
   */
  @Column({ name: 'ndc_code', type: 'varchar', length: 20, nullable: true })
  ndcCode: string | null;

  /**
   * Dose number in series (e.g., 1 for first dose, 2 for second)
   */
  @Column({ name: 'dose_number', type: 'integer', nullable: true })
  doseNumber: number | null;

  /**
   * Total number of doses required in series
   */
  @Column({ name: 'total_doses', type: 'integer', nullable: true })
  totalDoses: number | null;

  /**
   * Whether the vaccination series is complete
   */
  @Column({ name: 'series_complete', type: 'boolean', default: false })
  seriesComplete: boolean;

  /**
   * Date vaccine was administered
   */
  @Column({ name: 'administration_date', type: 'timestamp' })
  administrationDate: Date;

  /**
   * Name of person who administered vaccine
   */
  @Column({ name: 'administered_by', type: 'varchar', length: 200 })
  administeredBy: string;

  /**
   * Role of person who administered (RN, MD, NP, etc.)
   */
  @Column({ name: 'administered_by_role', type: 'varchar', length: 50, nullable: true })
  administeredByRole: string | null;

  /**
   * Facility where vaccine was administered
   */
  @Column({ name: 'facility', type: 'varchar', length: 200, nullable: true })
  facility: string | null;

  /**
   * Body site where vaccine was administered
   */
  @Column({
    name: 'site_of_administration',
    type: 'enum',
    enum: [
      'ARM_LEFT',
      'ARM_RIGHT',
      'THIGH_LEFT',
      'THIGH_RIGHT',
      'DELTOID_LEFT',
      'DELTOID_RIGHT',
      'BUTTOCK_LEFT',
      'BUTTOCK_RIGHT',
      'ORAL',
      'NASAL',
      'OTHER',
    ],
    nullable: true,
  })
  siteOfAdministration:
    | 'ARM_LEFT'
    | 'ARM_RIGHT'
    | 'THIGH_LEFT'
    | 'THIGH_RIGHT'
    | 'DELTOID_LEFT'
    | 'DELTOID_RIGHT'
    | 'BUTTOCK_LEFT'
    | 'BUTTOCK_RIGHT'
    | 'ORAL'
    | 'NASAL'
    | 'OTHER'
    | null;

  /**
   * Route of administration
   */
  @Column({
    name: 'route_of_administration',
    type: 'enum',
    enum: [
      'INTRAMUSCULAR',
      'SUBCUTANEOUS',
      'INTRADERMAL',
      'ORAL',
      'INTRANASAL',
      'INTRAVENOUS',
      'OTHER',
    ],
    nullable: true,
  })
  routeOfAdministration:
    | 'INTRAMUSCULAR'
    | 'SUBCUTANEOUS'
    | 'INTRADERMAL'
    | 'ORAL'
    | 'INTRANASAL'
    | 'INTRAVENOUS'
    | 'OTHER'
    | null;

  /**
   * Dosage amount (e.g., "0.5 mL")
   */
  @Column({ name: 'dosage_amount', type: 'varchar', length: 50, nullable: true })
  dosageAmount: string | null;

  /**
   * Vaccine expiration date (for expired vaccine tracking)
   */
  @Column({ name: 'expiration_date', type: 'date', nullable: true })
  expirationDate: Date | null;

  /**
   * Next dose due date (for series completion)
   */
  @Column({ name: 'next_due_date', type: 'date', nullable: true })
  nextDueDate: Date | null;

  /**
   * Any reactions to the vaccine
   */
  @Column({ name: 'reactions', type: 'text', nullable: true })
  reactions: string | null;

  /**
   * Adverse events (structured data)
   */
  @Column({ name: 'adverse_events', type: 'jsonb', nullable: true })
  adverseEvents: Record<string, any> | null;

  /**
   * Whether student has medical or religious exemption
   */
  @Column({ name: 'exemption_status', type: 'boolean', default: false })
  exemptionStatus: boolean;

  /**
   * Reason for exemption
   */
  @Column({ name: 'exemption_reason', type: 'text', nullable: true })
  exemptionReason: string | null;

  /**
   * Exemption document URL
   */
  @Column({ name: 'exemption_document', type: 'varchar', length: 500, nullable: true })
  exemptionDocument: string | null;

  /**
   * Compliance status (for school requirements)
   */
  @Column({
    name: 'compliance_status',
    type: 'enum',
    enum: ['COMPLIANT', 'OVERDUE', 'PARTIALLY_COMPLIANT', 'EXEMPT', 'NON_COMPLIANT'],
    default: 'COMPLIANT',
  })
  complianceStatus: 'COMPLIANT' | 'OVERDUE' | 'PARTIALLY_COMPLIANT' | 'EXEMPT' | 'NON_COMPLIANT';

  /**
   * VFC (Vaccines for Children) eligibility
   */
  @Column({ name: 'vfc_eligibility', type: 'boolean', default: false })
  vfcEligibility: boolean;

  /**
   * Whether VIS (Vaccine Information Statement) was provided
   */
  @Column({ name: 'vis_provided', type: 'boolean', default: false })
  visProvided: boolean;

  /**
   * Date VIS was provided
   */
  @Column({ name: 'vis_date', type: 'date', nullable: true })
  visDate: Date | null;

  /**
   * Whether parental consent was obtained
   */
  @Column({ name: 'consent_obtained', type: 'boolean', default: false })
  consentObtained: boolean;

  /**
   * Who provided consent (parent/guardian name)
   */
  @Column({ name: 'consent_by', type: 'varchar', length: 200, nullable: true })
  consentBy: string | null;

  /**
   * Additional notes
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
   * Soft delete timestamp (immunization records should never be hard-deleted)
   */
  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date | null;

  // Relationships

  /**
   * Student who received this vaccination
   */
  @ManyToOne(() => Student, { nullable: false })
  @JoinColumn({ name: 'student_id' })
  student: Student;

  /**
   * Associated health record (optional)
   */
  @ManyToOne(() => HealthRecord, { nullable: true })
  @JoinColumn({ name: 'health_record_id' })
  healthRecord: HealthRecord | null;

  /**
   * Check if vaccination is overdue (past next due date)
   * @returns true if next dose is overdue
   */
  isOverdue(): boolean {
    if (!this.nextDueDate || this.seriesComplete) {
      return false;
    }
    return new Date() > this.nextDueDate;
  }

  /**
   * Get days until next dose (negative if overdue)
   * @returns days until next dose, null if not applicable
   */
  getDaysUntilNextDose(): number | null {
    if (!this.nextDueDate || this.seriesComplete) {
      return null;
    }
    const diff = this.nextDueDate.getTime() - new Date().getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }

  /**
   * Get completion percentage of series
   * @returns percentage (0-100), null if series not tracked
   */
  getSeriesCompletionPercentage(): number | null {
    if (!this.totalDoses || !this.doseNumber) {
      return null;
    }
    return Math.round((this.doseNumber / this.totalDoses) * 100);
  }
}
