import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { ProtocolStatus } from '../enums/protocol-status.enum';

/**
 * Clinical Protocol Entity
 * Represents standardized clinical protocols and guidelines
 *
 * @description
 * Clinical protocols define evidence-based approaches for managing
 * specific conditions or situations, providing clinical decision support
 * and ensuring consistent care quality.
 */
@Entity('clinical_protocols')
@Index(['name'])
@Index(['status'])
@Index(['category'])
export class ClinicalProtocol {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'name', type: 'varchar', length: 255 })
  name: string;

  @Column({ name: 'code', type: 'varchar', length: 50, unique: true })
  @Index({ unique: true })
  code: string;

  @Column({ name: 'version', type: 'varchar', length: 20 })
  version: string;

  @Column({ name: 'category', type: 'varchar', length: 100 })
  category: string;

  @Column({ name: 'description', type: 'text' })
  description: string;

  @Column({ name: 'indications', type: 'simple-array' })
  indications: string[];

  @Column({ name: 'contraindications', type: 'simple-array', nullable: true })
  contraindications?: string[];

  @Column({ name: 'steps', type: 'json' })
  steps: Array<{
    order: number;
    title: string;
    description: string;
    required: boolean;
  }>;

  @Column({ name: 'decision_points', type: 'json', nullable: true })
  decisionPoints?: Array<{
    step: number;
    condition: string;
    ifTrue: string;
    ifFalse: string;
  }>;

  @Column({ name: 'required_equipment', type: 'simple-array', nullable: true })
  requiredEquipment?: string[];

  @Column({ name: 'medications', type: 'simple-array', nullable: true })
  medications?: string[];

  @Column({
    type: 'enum',
    enum: ProtocolStatus,
    default: ProtocolStatus.DRAFT,
  })
  status: ProtocolStatus;

  @Column({ name: 'created_by', type: 'uuid' })
  createdBy: string;

  @Column({ name: 'approved_by', type: 'uuid', nullable: true })
  approvedBy?: string;

  @Column({ name: 'approved_date', type: 'timestamp', nullable: true })
  approvedDate?: Date;

  @Column({ name: 'effective_date', type: 'date', nullable: true })
  effectiveDate?: Date;

  @Column({ name: 'review_date', type: 'date', nullable: true })
  reviewDate?: Date;

  @Column({ name: 'references', type: 'simple-array', nullable: true })
  references?: string[];

  @Column({ name: 'tags', type: 'simple-array', nullable: true })
  tags?: string[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  /**
   * Check if protocol is active and can be used
   */
  isActive(): boolean {
    if (this.status !== ProtocolStatus.ACTIVE) return false;
    if (this.effectiveDate && new Date() < this.effectiveDate) return false;
    return true;
  }

  /**
   * Check if protocol needs review
   */
  needsReview(): boolean {
    if (!this.reviewDate) return false;
    return new Date() >= this.reviewDate;
  }

  /**
   * Get total number of steps
   */
  getStepCount(): number {
    return this.steps.length;
  }

  /**
   * Get required steps only
   */
  getRequiredSteps(): typeof this.steps {
    return this.steps.filter((step) => step.required);
  }
}
