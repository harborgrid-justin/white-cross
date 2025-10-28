import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Student } from '../../student/entities/student.entity';

/**
 * Student Medication Entity
 * Represents a medication prescribed to a student
 */
@Entity('student_medications')
@Index(['studentId', 'medicationId'])
@Index(['isActive', 'startDate', 'endDate'])
@Index(['prescribedBy'])
export class StudentMedication {
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
  frequency: string; // e.g., "twice daily", "every 8 hours"

  @Column()
  route: string; // Oral, IV, IM, etc.

  @Column({ type: 'date' })
  startDate: Date;

  @Column({ type: 'date', nullable: true })
  endDate?: Date;

  @Column({ name: 'prescribed_by', type: 'uuid' })
  prescribedBy: string;

  @Column({ type: 'text', nullable: true })
  instructions?: string;

  @Column({ type: 'text', nullable: true })
  indications?: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;

  // Relations
  @ManyToOne(() => Student)
  @JoinColumn({ name: 'student_id' })
  student?: Student;
}