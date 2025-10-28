import { Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('medications')
export class Medication {
  @PrimaryColumn('varchar')
  id: string;

  @Column('varchar')
  name: string;

  @Column('varchar', { nullable: true })
  genericName?: string;

  @Column('varchar')
  dosageForm: string;

  @Column('varchar')
  strength: string;

  @Column('varchar', { nullable: true })
  manufacturer?: string;

  @Column('varchar', { nullable: true, unique: true })
  ndc?: string;

  @Column('boolean', { default: false })
  isControlled: boolean;

  @Column('varchar', { length: 3, nullable: true })
  deaSchedule?: 'I' | 'II' | 'III' | 'IV' | 'V';

  @Column('boolean', { default: false })
  requiresWitness: boolean;

  @Column('boolean', { default: true })
  isActive: boolean;

  @Column('timestamp', { nullable: true })
  deletedAt?: Date;

  @Column('varchar', { nullable: true })
  deletedBy?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
