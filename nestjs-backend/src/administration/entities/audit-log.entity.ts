import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Index,
} from 'typeorm';
import { AuditAction } from '../enums/administration.enums';

/**
 * AuditLog Entity
 *
 * Records all significant actions performed in the system for compliance and auditing
 */
@Entity('audit_logs')
@Index(['userId'])
@Index(['entityType'])
@Index(['entityId'])
@Index(['action'])
@Index(['createdAt'])
export class AuditLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: AuditAction,
  })
  action: AuditAction;

  @Column({ length: 100 })
  entityType: string;

  @Column({ type: 'uuid', nullable: true })
  entityId: string;

  @Column({ type: 'uuid', nullable: true })
  userId: string;

  @Column({ type: 'jsonb', nullable: true })
  changes: any;

  @Column({ length: 45, nullable: true })
  ipAddress: string;

  @Column({ type: 'text', nullable: true })
  userAgent: string;

  @CreateDateColumn()
  createdAt: Date;
}
