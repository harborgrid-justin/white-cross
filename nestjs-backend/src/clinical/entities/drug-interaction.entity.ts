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
import { InteractionSeverity } from '../enums/interaction-severity.enum';

/**
 * Drug Interaction Entity
 * Stores drug-drug interaction information with severity and management guidance
 */
@Entity('drug_interactions')
@Index(['drug1Id', 'drug2Id'], { unique: true })
export class DrugInteraction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'drug1_id', type: 'uuid' })
  @Index()
  drug1Id: string;

  @Column({ name: 'drug2_id', type: 'uuid' })
  @Index()
  drug2Id: string;

  @Column({
    type: 'enum',
    enum: InteractionSeverity,
    name: 'severity',
  })
  @Index()
  severity: InteractionSeverity;

  @Column({ type: 'text', name: 'description' })
  description: string;

  @Column({ type: 'text', name: 'clinical_effects', nullable: true })
  clinicalEffects?: string;

  @Column({ type: 'text', name: 'management', nullable: true })
  management?: string;

  @Column({ type: 'simple-array', name: 'references', nullable: true })
  references?: string[];

  @Column({ type: 'varchar', length: 50, name: 'evidence_level', nullable: true })
  evidenceLevel?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relationships
  @ManyToOne(() => DrugCatalog, (drug) => drug.interactionsAsDrug1, { eager: false })
  @JoinColumn({ name: 'drug1_id' })
  drug1: DrugCatalog;

  @ManyToOne(() => DrugCatalog, (drug) => drug.interactionsAsDrug2, { eager: false })
  @JoinColumn({ name: 'drug2_id' })
  drug2: DrugCatalog;
}
