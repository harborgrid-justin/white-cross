/**
 * PHI Disclosure Audit Entity
 * Immutable audit trail for PHI disclosure actions
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
import { PhiDisclosure } from './phi-disclosure.entity';

@Entity('phi_disclosure_audits')
export class PhiDisclosureAudit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  @Index()
  disclosureId: string;

  @Column({ type: 'varchar', length: 50 })
  action: string; // CREATED, VIEWED, UPDATED, DELETED

  @Column({ type: 'jsonb', nullable: true })
  changes: any;

  @Column({ type: 'uuid' })
  performedBy: string;

  @Column({ type: 'varchar', length: 45, nullable: true })
  ipAddress: string | null;

  @Column({ type: 'text', nullable: true })
  userAgent: string | null;

  @ManyToOne(() => PhiDisclosure, (disclosure) => disclosure.auditTrail)
  @JoinColumn({ name: 'disclosureId' })
  disclosure: PhiDisclosure;

  @CreateDateColumn()
  createdAt: Date;
}
