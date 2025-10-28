/**
 * PHI Disclosure Entity
 * HIPAA §164.528 - Accounting of Disclosures
 *
 * Tracks all PHI disclosures with complete audit trail for HIPAA compliance
 */

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  OneToMany,
} from 'typeorm';
import {
  DisclosureType,
  DisclosurePurpose,
  DisclosureMethod,
  RecipientType,
} from '../enums';
import { PhiDisclosureAudit } from './phi-disclosure-audit.entity';

@Entity('phi_disclosures')
@Index(['studentId', 'disclosureDate'])
@Index(['purpose', 'disclosureDate'])
export class PhiDisclosure {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  @Index()
  studentId: string;

  @Column({ type: 'enum', enum: DisclosureType })
  disclosureType: DisclosureType;

  @Column({ type: 'enum', enum: DisclosurePurpose })
  @Index()
  purpose: DisclosurePurpose;

  @Column({ type: 'enum', enum: DisclosureMethod })
  method: DisclosureMethod;

  @Column({ type: 'timestamp' })
  @Index()
  disclosureDate: Date;

  @Column({ type: 'jsonb' })
  informationDisclosed: string[];

  @Column({ type: 'text' })
  minimumNecessary: string;

  @Column({ type: 'enum', enum: RecipientType })
  recipientType: RecipientType;

  @Column({ type: 'varchar', length: 255 })
  recipientName: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  recipientOrganization: string | null;

  @Column({ type: 'text', nullable: true })
  recipientAddress: string | null;

  @Column({ type: 'varchar', length: 50, nullable: true })
  recipientPhone: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  recipientEmail: string | null;

  @Column({ type: 'boolean' })
  authorizationObtained: boolean;

  @Column({ type: 'timestamp', nullable: true })
  authorizationDate: Date | null;

  @Column({ type: 'timestamp', nullable: true })
  authorizationExpiryDate: Date | null;

  @Column({ type: 'boolean' })
  patientRequested: boolean;

  @Column({ type: 'uuid' })
  disclosedBy: string;

  @Column({ type: 'boolean', default: false })
  followUpRequired: boolean;

  @Column({ type: 'boolean', default: false })
  followUpCompleted: boolean;

  @Column({ type: 'timestamp', nullable: true })
  @Index()
  followUpDate: Date | null;

  @Column({ type: 'text', nullable: true })
  notes: string | null;

  @OneToMany(() => PhiDisclosureAudit, (audit) => audit.disclosure)
  auditTrail: PhiDisclosureAudit[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
