/**
 * Consent Form Entity
 * Manages healthcare consent forms with version control and expiration tracking
 *
 * HIPAA Compliance: Ensures proper authorization before PHI disclosure per 45 CFR 164.508
 */

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { ConsentType } from '../enums';
import { ConsentSignature } from './consent-signature.entity';

@Entity('consent_forms')
export class ConsentForm {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: ConsentType })
  @Index()
  type: ConsentType;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'varchar', length: 20, default: '1.0' })
  version: string;

  @Column({ type: 'boolean', default: true })
  @Index()
  isActive: boolean;

  @Column({ type: 'timestamp', nullable: true })
  expiresAt: Date | null;

  @OneToMany(() => ConsentSignature, (signature) => signature.consentForm)
  signatures: ConsentSignature[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
