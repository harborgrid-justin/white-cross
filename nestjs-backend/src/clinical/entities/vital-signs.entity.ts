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
import { ClinicVisit } from './clinic-visit.entity';

/**
 * Vital Signs Entity
 * Records vital signs measurements during clinical encounters
 *
 * @description
 * Tracks essential vital signs including blood pressure, heart rate,
 * temperature, respiratory rate, oxygen saturation, height, weight,
 * and BMI calculations.
 */
@Entity('vital_signs')
@Index(['studentId', 'recordedAt'])
@Index(['visitId'])
export class VitalSigns {
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

  @Column({ name: 'recorded_by', type: 'uuid' })
  recordedBy: string;

  @Column({ name: 'recorded_at', type: 'timestamp' })
  recordedAt: Date;

  // Blood Pressure
  @Column({ name: 'systolic_bp', type: 'int', nullable: true })
  systolicBP?: number;

  @Column({ name: 'diastolic_bp', type: 'int', nullable: true })
  diastolicBP?: number;

  @Column({ name: 'bp_position', type: 'varchar', length: 50, nullable: true })
  bpPosition?: string; // sitting, standing, lying

  // Heart Rate
  @Column({ name: 'heart_rate', type: 'int', nullable: true })
  heartRate?: number; // beats per minute

  // Temperature
  @Column({ name: 'temperature', type: 'decimal', precision: 4, scale: 1, nullable: true })
  temperature?: number; // in Fahrenheit

  @Column({ name: 'temp_method', type: 'varchar', length: 50, nullable: true })
  tempMethod?: string; // oral, axillary, tympanic, temporal

  // Respiratory Rate
  @Column({ name: 'respiratory_rate', type: 'int', nullable: true })
  respiratoryRate?: number; // breaths per minute

  // Oxygen Saturation
  @Column({ name: 'oxygen_saturation', type: 'int', nullable: true })
  oxygenSaturation?: number; // percentage (SpO2)

  @Column({ name: 'on_oxygen', type: 'boolean', default: false })
  onOxygen: boolean;

  @Column({ name: 'oxygen_flow_rate', type: 'decimal', precision: 4, scale: 1, nullable: true })
  oxygenFlowRate?: number; // liters per minute

  // Height and Weight
  @Column({ name: 'height', type: 'decimal', precision: 5, scale: 2, nullable: true })
  height?: number; // in inches

  @Column({ name: 'weight', type: 'decimal', precision: 5, scale: 2, nullable: true })
  weight?: number; // in pounds

  @Column({ name: 'bmi', type: 'decimal', precision: 4, scale: 1, nullable: true })
  bmi?: number;

  // Pain Scale
  @Column({ name: 'pain_scale', type: 'int', nullable: true })
  painScale?: number; // 0-10 scale

  @Column({ name: 'pain_location', type: 'varchar', length: 255, nullable: true })
  painLocation?: string;

  // Additional Data
  @Column({ name: 'head_circumference', type: 'decimal', precision: 5, scale: 2, nullable: true })
  headCircumference?: number; // in centimeters (for pediatric cases)

  @Column({ name: 'notes', type: 'text', nullable: true })
  notes?: string;

  @Column({ name: 'abnormal_flags', type: 'simple-array', nullable: true })
  abnormalFlags?: string[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  /**
   * Calculate BMI from height and weight
   * Formula: (weight in pounds / (height in inches)^2) * 703
   */
  calculateBMI(): number | null {
    if (!this.height || !this.weight || this.height === 0) return null;
    return parseFloat(((this.weight / (this.height * this.height)) * 703).toFixed(1));
  }

  /**
   * Update BMI based on current height and weight
   */
  updateBMI(): void {
    this.bmi = this.calculateBMI();
  }

  /**
   * Check if blood pressure is recorded
   */
  hasBP(): boolean {
    return this.systolicBP !== undefined && this.diastolicBP !== undefined;
  }

  /**
   * Get blood pressure as string
   */
  getBPString(): string | null {
    if (!this.hasBP()) return null;
    return `${this.systolicBP}/${this.diastolicBP}`;
  }

  /**
   * Check if any vital signs are flagged as abnormal
   */
  hasAbnormalVitals(): boolean {
    return this.abnormalFlags !== undefined && this.abnormalFlags.length > 0;
  }
}
