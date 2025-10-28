import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { PrescriptionStatus } from '../enums/prescription-status.enum';
import { ClinicVisit } from './clinic-visit.entity';
import { TreatmentPlan } from './treatment-plan.entity';

/**
 * Prescription Entity
 * Represents a medication prescription for a student
 *
 * @description
 * Manages prescription lifecycle from creation through filling and pickup,
 * including drug information, dosage, quantity, and refill authorization.
 */
@Entity('prescriptions')
@Index(['studentId', 'status'])
@Index(['visitId'])
@Index(['treatmentPlanId'])
export class Prescription {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'student_id', type: 'uuid' })
  @Index()
  studentId: string;

  @Column({ name: 'visit_id', type: 'uuid', nullable: true })
  visitId?: string;

  @ManyToOne(() => ClinicVisit, { nullable: true })
  @JoinColumn({ name: 'visit_id' })
  visit?: ClinicVisit;

  @Column({ name: 'treatment_plan_id', type: 'uuid', nullable: true })
  treatmentPlanId?: string;

  @ManyToOne(() => TreatmentPlan, (plan) => plan.prescriptions, { nullable: true })
  @JoinColumn({ name: 'treatment_plan_id' })
  treatmentPlan?: TreatmentPlan;

  @Column({ name: 'prescribed_by', type: 'uuid' })
  prescribedBy: string;

  @Column({ name: 'drug_name', type: 'varchar', length: 255 })
  drugName: string;

  @Column({ name: 'drug_code', type: 'varchar', length: 100, nullable: true })
  drugCode?: string;

  @Column({ name: 'dosage', type: 'varchar', length: 100 })
  dosage: string;

  @Column({ name: 'frequency', type: 'varchar', length: 100 })
  frequency: string;

  @Column({ name: 'route', type: 'varchar', length: 50 })
  route: string;

  @Column({ name: 'quantity', type: 'int' })
  quantity: number;

  @Column({ name: 'quantity_filled', type: 'int', default: 0 })
  quantityFilled: number;

  @Column({ name: 'refills_authorized', type: 'int', default: 0 })
  refillsAuthorized: number;

  @Column({ name: 'refills_used', type: 'int', default: 0 })
  refillsUsed: number;

  @Column({ name: 'start_date', type: 'date' })
  startDate: Date;

  @Column({ name: 'end_date', type: 'date', nullable: true })
  endDate?: Date;

  @Column({ name: 'instructions', type: 'text', nullable: true })
  instructions?: string;

  @Column({
    type: 'enum',
    enum: PrescriptionStatus,
    default: PrescriptionStatus.PENDING,
  })
  @Index()
  status: PrescriptionStatus;

  @Column({ name: 'pharmacy_name', type: 'varchar', length: 255, nullable: true })
  pharmacyName?: string;

  @Column({ name: 'filled_date', type: 'timestamp', nullable: true })
  filledDate?: Date;

  @Column({ name: 'picked_up_date', type: 'timestamp', nullable: true })
  pickedUpDate?: Date;

  @Column({ name: 'notes', type: 'text', nullable: true })
  notes?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  /**
   * Check if prescription is currently active
   */
  isActive(): boolean {
    const now = new Date();
    if (this.status === PrescriptionStatus.CANCELLED ||
        this.status === PrescriptionStatus.EXPIRED) {
      return false;
    }
    if (this.endDate && now > this.endDate) {
      return false;
    }
    return this.status === PrescriptionStatus.FILLED ||
           this.status === PrescriptionStatus.PICKED_UP;
  }

  /**
   * Check if prescription has refills remaining
   */
  hasRefillsRemaining(): boolean {
    return this.refillsUsed < this.refillsAuthorized;
  }

  /**
   * Get remaining refills
   */
  getRemainingRefills(): number {
    return Math.max(0, this.refillsAuthorized - this.refillsUsed);
  }

  /**
   * Calculate days supply (assuming typical prescription)
   */
  getDaysSupply(): number | null {
    if (!this.endDate) return null;
    const diff = this.endDate.getTime() - this.startDate.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  }
}
