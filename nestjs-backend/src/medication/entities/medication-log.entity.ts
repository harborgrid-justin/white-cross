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
import { Student } from '../../student/entities/student.entity';

/**
 * Medication Log Entity
 * Tracks medication administration and usage logs
 */
@Entity('medication_logs')
@Index(['studentId', 'medicationId'])
@Index(['administeredAt'])
@Index(['administeredBy'])
export class MedicationLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'student_id', type: 'uuid' })
  studentId: string;

  @Column({ name: 'medication_id', type: 'uuid' })
  medicationId: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  dosage: number;

  @Column()
  dosageUnit: string;

  @Column()
  route: string; // Oral, IV, IM, etc.

  @Column({ type: 'timestamp' })
  administeredAt: Date;

  @Column({ name: 'administered_by', type: 'uuid' })
  administeredBy: string;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @Column({ type: 'boolean', default: false })
  wasGiven: boolean;

  @Column({ type: 'text', nullable: true })
  reasonNotGiven?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Student)
  @JoinColumn({ name: 'student_id' })
  student?: Student;
}