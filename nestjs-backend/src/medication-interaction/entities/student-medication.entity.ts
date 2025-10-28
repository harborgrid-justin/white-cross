import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Medication } from './medication.entity';

@Entity('student_medications')
export class StudentMedication {
  @PrimaryColumn('varchar')
  id: string;

  @Column('varchar')
  dosage: string;

  @Column('varchar')
  frequency: string;

  @Column('varchar')
  route: string;

  @Column('text', { nullable: true })
  instructions?: string;

  @Column('timestamp')
  startDate: Date;

  @Column('timestamp', { nullable: true })
  endDate?: Date;

  @Column('boolean', { default: true })
  isActive: boolean;

  @Column('varchar')
  prescribedBy: string;

  @Column('varchar', { nullable: true })
  prescriptionNumber?: string;

  @Column('integer', { nullable: true, default: 0 })
  refillsRemaining?: number;

  @Column('varchar')
  studentId: string;

  @Column('varchar')
  medicationId: string;

  @Column('varchar', { nullable: true })
  createdBy?: string;

  @Column('varchar', { nullable: true })
  updatedBy?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Medication)
  @JoinColumn({ name: 'medicationId' })
  medication?: Medication;
}
