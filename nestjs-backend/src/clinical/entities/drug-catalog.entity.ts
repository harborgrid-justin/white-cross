import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { DrugInteraction } from './drug-interaction.entity';
import { StudentDrugAllergy } from './student-drug-allergy.entity';

/**
 * Drug Catalog Entity
 * Maintains a catalog of drugs with RxNorm codes and medical information
 */
@Entity('drug_catalog')
export class DrugCatalog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'rxnorm_id', type: 'varchar', length: 50, nullable: true, unique: true })
  @Index()
  rxnormId?: string;

  @Column({ name: 'rxnorm_code', type: 'varchar', length: 50, nullable: true, unique: true })
  @Index()
  rxnormCode?: string;

  @Column({ name: 'generic_name', type: 'varchar', length: 255 })
  @Index()
  genericName: string;

  @Column({ name: 'brand_names', type: 'simple-array', nullable: true })
  brandNames?: string[];

  @Column({ name: 'drug_class', type: 'varchar', length: 100, nullable: true })
  @Index()
  drugClass?: string;

  @Column({ name: 'fda_approved', type: 'boolean', default: true })
  fdaApproved: boolean;

  @Column({ name: 'common_doses', type: 'jsonb', nullable: true })
  commonDoses?: Record<string, any>;

  @Column({ name: 'side_effects', type: 'simple-array', nullable: true })
  sideEffects?: string[];

  @Column({ name: 'contraindications', type: 'simple-array', nullable: true })
  contraindications?: string[];

  @Column({ name: 'warnings', type: 'simple-array', nullable: true })
  warnings?: string[];

  @Column({ name: 'is_active', type: 'boolean', default: true })
  @Index()
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relationships
  @OneToMany(() => DrugInteraction, (interaction) => interaction.drug1)
  interactionsAsDrug1: DrugInteraction[];

  @OneToMany(() => DrugInteraction, (interaction) => interaction.drug2)
  interactionsAsDrug2: DrugInteraction[];

  @OneToMany(() => StudentDrugAllergy, (allergy) => allergy.drug)
  allergies: StudentDrugAllergy[];
}
