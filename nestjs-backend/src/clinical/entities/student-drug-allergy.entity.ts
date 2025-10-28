import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { DrugCatalog } from './drug-catalog.entity';

/**
 * Student Drug Allergy Entity
 * Tracks student allergies to specific drugs
 */
@Entity('student_drug_allergies')
@Index(['studentId', 'drugId'], { unique: true })
export class StudentDrugAllergy {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'student_id', type: 'uuid' })
  @Index()
  studentId: string;

  @Column({ name: 'drug_id', type: 'uuid' })
  @Index()
  drugId: string;

  @Column({ name: 'allergy_type', type: 'varchar', length: 100 })
  allergyType: string;

  @Column({ name: 'reaction', type: 'text' })
  reaction: string;

  @Column({ name: 'severity', type: 'varchar', length: 50 })
  @Index()
  severity: string;

  @Column({ name: 'notes', type: 'text', nullable: true })
  notes?: string;

  @Column({ name: 'diagnosed_date', type: 'timestamp', nullable: true })
  diagnosedDate?: Date;

  @Column({ name: 'diagnosed_by', type: 'varchar', length: 255, nullable: true })
  diagnosedBy?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relationships
  @ManyToOne(() => DrugCatalog, (drug) => drug.allergies, { eager: true })
  @JoinColumn({ name: 'drug_id' })
  drug: DrugCatalog;
}
