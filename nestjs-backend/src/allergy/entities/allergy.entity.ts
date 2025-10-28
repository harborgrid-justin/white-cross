/**
 * Allergy Entity
 *
 * Patient safety critical entity managing life-threatening allergy information.
 * Supports medication-allergy cross-checking, emergency response protocols,
 * and HIPAA-compliant audit logging.
 *
 * @entity Allergy
 * @compliance HIPAA, Healthcare Allergy Documentation Standards
 */
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Index,
  JoinColumn,
} from 'typeorm';
import { Student } from '../../student/entities/student.entity';

/**
 * Clinical allergy severity levels aligned with medical standards
 */
export enum AllergySeverity {
  MILD = 'MILD',
  MODERATE = 'MODERATE',
  SEVERE = 'SEVERE',
  LIFE_THREATENING = 'LIFE_THREATENING',
}

/**
 * Allergen type categories for classification
 */
export enum AllergenType {
  MEDICATION = 'MEDICATION',
  FOOD = 'FOOD',
  ENVIRONMENTAL = 'ENVIRONMENTAL',
  OTHER = 'OTHER',
}

@Entity('allergies')
@Index(['studentId', 'allergen'])
@Index(['studentId', 'severity'])
@Index(['severity'])
export class Allergy {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * Student who has the allergy
   */
  @Column({ type: 'uuid' })
  @Index()
  studentId: string;

  @ManyToOne(() => Student, { eager: false })
  @JoinColumn({ name: 'studentId' })
  student?: Student;

  /**
   * Name of the allergen (medication, food, environmental substance)
   */
  @Column({ type: 'varchar', length: 255 })
  allergen: string;

  /**
   * Category of allergen for classification
   */
  @Column({
    type: 'enum',
    enum: AllergenType,
    nullable: true,
  })
  allergenType?: AllergenType;

  /**
   * Clinical severity classification
   * Guides medication cross-checking priority and emergency response
   */
  @Column({
    type: 'enum',
    enum: AllergySeverity,
  })
  severity: AllergySeverity;

  /**
   * Description of allergic reaction symptoms
   */
  @Column({ type: 'text', nullable: true })
  reaction?: string;

  /**
   * Emergency treatment protocol and intervention
   */
  @Column({ type: 'text', nullable: true })
  treatment?: string;

  /**
   * Whether allergy has been clinically verified by healthcare professional
   */
  @Column({ type: 'boolean', default: false })
  verified: boolean;

  /**
   * User ID of healthcare professional who verified the allergy
   */
  @Column({ type: 'uuid', nullable: true })
  verifiedBy?: string;

  /**
   * Verification timestamp
   */
  @Column({ type: 'timestamp', nullable: true })
  verifiedAt?: Date;

  /**
   * Additional clinical notes and observations
   */
  @Column({ type: 'text', nullable: true })
  notes?: string;

  /**
   * Link to comprehensive health record if applicable
   */
  @Column({ type: 'uuid', nullable: true })
  healthRecordId?: string;

  /**
   * Active status - false for resolved allergies (soft delete)
   */
  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  /**
   * Soft delete timestamp
   * Allows preserving clinical history while removing from active records
   */
  @DeleteDateColumn()
  deletedAt?: Date;
}
