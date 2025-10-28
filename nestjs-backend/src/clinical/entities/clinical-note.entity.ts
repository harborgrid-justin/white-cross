import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { NoteType } from '../enums/note-type.enum';
import { ClinicVisit } from './clinic-visit.entity';

/**
 * Clinical Note Entity
 * Represents clinical notes and documentation
 *
 * @description
 * Clinical notes document observations, assessments, and plans
 * during clinical encounters. Supports multiple note formats
 * including SOAP notes, progress notes, and discharge summaries.
 */
@Entity('clinical_notes')
@Index(['studentId', 'type'])
@Index(['visitId'])
@Index(['createdBy'])
export class ClinicalNote {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'student_id', type: 'uuid' })
  @Index()
  studentId: string;

  @Column({ name: 'visit_id', type: 'uuid', nullable: true })
  visitId?: string;

  @ManyToOne(() => ClinicVisit, { nullable: true })
  @JoinColumn({ name: 'visit_id' })
  visit?: ClinicVisit;

  @Column({
    type: 'enum',
    enum: NoteType,
    default: NoteType.GENERAL,
  })
  type: NoteType;

  @Column({ name: 'created_by', type: 'uuid' })
  createdBy: string;

  @Column({ name: 'title', type: 'varchar', length: 255 })
  title: string;

  @Column({ name: 'content', type: 'text' })
  content: string;

  // SOAP note components (optional, used when type is SOAP)
  @Column({ name: 'subjective', type: 'text', nullable: true })
  subjective?: string;

  @Column({ name: 'objective', type: 'text', nullable: true })
  objective?: string;

  @Column({ name: 'assessment', type: 'text', nullable: true })
  assessment?: string;

  @Column({ name: 'plan', type: 'text', nullable: true })
  plan?: string;

  @Column({ name: 'tags', type: 'simple-array', nullable: true })
  tags?: string[];

  @Column({ name: 'is_confidential', type: 'boolean', default: false })
  isConfidential: boolean;

  @Column({ name: 'is_signed', type: 'boolean', default: false })
  isSigned: boolean;

  @Column({ name: 'signed_at', type: 'timestamp', nullable: true })
  signedAt?: Date;

  @Column({ name: 'amended', type: 'boolean', default: false })
  amended: boolean;

  @Column({ name: 'amendment_reason', type: 'text', nullable: true })
  amendmentReason?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  /**
   * Check if note is a SOAP note
   */
  isSOAPNote(): boolean {
    return this.type === NoteType.SOAP;
  }

  /**
   * Check if SOAP note is complete
   */
  isSOAPComplete(): boolean {
    if (!this.isSOAPNote()) return false;
    return !!(this.subjective && this.objective && this.assessment && this.plan);
  }

  /**
   * Sign the note
   */
  sign(): void {
    this.isSigned = true;
    this.signedAt = new Date();
  }

  /**
   * Mark note as amended
   */
  markAsAmended(reason: string): void {
    this.amended = true;
    this.amendmentReason = reason;
  }
}
