/**
 * Consent Signature Entity
 * Digital signatures for consent forms with audit trail
 *
 * Legal Requirements:
 * - Signatory name and relationship recorded
 * - Digital signature data captured
 * - IP address logged for authenticity
 * - Withdrawal tracking with full audit trail
 */

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { ConsentForm } from './consent-form.entity';

@Entity('consent_signatures')
@Index(['consentFormId', 'studentId'], { unique: true })
export class ConsentSignature {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  @Index()
  consentFormId: string;

  @Column({ type: 'uuid' })
  @Index()
  studentId: string;

  @Column({ type: 'varchar', length: 255 })
  signedBy: string;

  @Column({ type: 'varchar', length: 100 })
  relationship: string;

  @Column({ type: 'text', nullable: true })
  signatureData: string | null;

  @Column({ type: 'varchar', length: 45, nullable: true })
  ipAddress: string | null;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  signedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  withdrawnAt: Date | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  withdrawnBy: string | null;

  @ManyToOne(() => ConsentForm, (form) => form.signatures)
  @JoinColumn({ name: 'consentFormId' })
  consentForm: ConsentForm;

  @CreateDateColumn()
  createdAt: Date;
}
