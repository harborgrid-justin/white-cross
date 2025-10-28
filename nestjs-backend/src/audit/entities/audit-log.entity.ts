import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Index,
  BeforeUpdate,
} from 'typeorm';
import { AuditAction } from '../enums';

/**
 * AuditLog Entity
 *
 * HIPAA Compliance: Immutable audit log entries for tracking all system actions
 * and PHI access. Required for HIPAA Security Rule (45 CFR § 164.308(a)(1)(ii)(D))
 *
 * Retention: 7 years as required by HIPAA regulations
 * Immutability: Enforced at entity level - updates throw error
 */
@Entity('audit_logs')
@Index(['userId'])
@Index(['action'])
@Index(['entityType'])
@Index(['entityId'])
@Index(['createdAt'])
// JSONB index for PHI access queries
@Index('idx_audit_logs_phi_access', { synchronize: false })
export class AuditLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  @Index()
  userId: string | null;

  @Column({
    type: 'enum',
    enum: AuditAction,
  })
  action: AuditAction;

  @Column({ type: 'varchar', length: 255 })
  entityType: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  entityId: string | null;

  @Column({ type: 'jsonb', nullable: true })
  changes: Record<string, any> | null;

  @Column({ type: 'varchar', length: 45, nullable: true })
  ipAddress: string | null;

  @Column({ type: 'text', nullable: true })
  userAgent: string | null;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  @Index()
  createdAt: Date;

  /**
   * HIPAA Compliance: Enforce immutability
   * Audit logs must never be modified after creation
   */
  @BeforeUpdate()
  preventUpdate(): void {
    throw new Error(
      'AUDIT_LOG_IMMUTABLE: Audit logs are immutable and cannot be updated. ' +
        'This is required for HIPAA compliance.',
    );
  }

  /**
   * Helper method to check if this is a PHI access log
   */
  isPHIAccess(): boolean {
    return this.changes?.['isPHIAccess'] === true;
  }

  /**
   * Helper method to get student ID from PHI access log
   */
  getStudentId(): string | null {
    return this.changes?.['studentId'] || null;
  }

  /**
   * Helper method to get access type from PHI access log
   */
  getAccessType(): string | null {
    return this.changes?.['accessType'] || null;
  }

  /**
   * Helper method to get data category from PHI access log
   */
  getDataCategory(): string | null {
    return this.changes?.['dataCategory'] || null;
  }

  /**
   * Helper method to check if action was successful
   */
  isSuccessful(): boolean {
    return this.changes?.['success'] !== false;
  }
}
