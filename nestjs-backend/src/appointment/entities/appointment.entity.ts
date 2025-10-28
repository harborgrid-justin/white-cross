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
import { User } from '../../user/entities/user.entity';
import { AppointmentType } from '../dto/create-appointment.dto';
import { AppointmentStatus } from '../dto/update-appointment.dto';

/**
 * Appointment entity representing a scheduled healthcare appointment
 *
 * Relations:
 * - ManyToOne with Student (studentId)
 * - ManyToOne with User (nurseId)
 *
 * Indexes:
 * - nurseId (for availability queries)
 * - studentId (for patient history)
 * - scheduledDate (for date range queries)
 * - status (for filtering active appointments)
 */
@Entity('appointments')
@Index(['nurseId', 'scheduledDate'])
@Index(['studentId', 'scheduledDate'])
@Index(['status', 'scheduledDate'])
export class Appointment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'student_id', type: 'uuid' })
  studentId: string;

  @Column({ name: 'nurse_id', type: 'uuid' })
  nurseId: string;

  @Column({
    name: 'appointment_type',
    type: 'enum',
    enum: AppointmentType
  })
  appointmentType: AppointmentType;

  @Column({ name: 'scheduled_date', type: 'timestamp' })
  scheduledDate: Date;

  @Column({ type: 'int' })
  duration: number; // minutes

  @Column({ type: 'text', nullable: true })
  reason?: string;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @Column({
    type: 'enum',
    enum: AppointmentStatus,
    default: AppointmentStatus.SCHEDULED
  })
  status: AppointmentStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Student)
  @JoinColumn({ name: 'student_id' })
  student?: Student;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'nurse_id' })
  nurse?: User;
}

/**
 * Availability slot representation
 */
export interface AvailabilitySlot {
  start: Date;
  end: Date;
  available: boolean;
  conflictingAppointment?: {
    id: string;
    student: string;
    reason: string;
  };
}

/**
 * Appointment entity representation for API responses
 */
export interface AppointmentEntity {
  id: string;
  studentId: string;
  nurseId: string;
  appointmentType: AppointmentType;
  scheduledDate: Date;
  duration: number;
  reason?: string;
  notes?: string;
  status: AppointmentStatus;
  createdAt: Date;
  updatedAt: Date;
  nurse?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    fullName: string;
  };
}

/**
 * Paginated response wrapper
 */
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}
