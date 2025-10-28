/**
 * Contact Entity
 * @description TypeORM entity for contact management (guardians, staff, vendors, providers)
 *
 * Inspired by TwentyHQ CRM contact management system
 * Supports HIPAA-compliant contact tracking with audit trails
 */
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Index
} from 'typeorm';
import { ContactType } from '../enums';

@Entity('contacts')
@Index(['email'])
@Index(['type'])
@Index(['relationTo'])
@Index(['isActive'])
@Index(['createdAt'])
@Index(['firstName', 'lastName'])
export class Contact {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100 })
  firstName: string;

  @Column({ type: 'varchar', length: 100 })
  lastName: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  email?: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone?: string;

  @Column({
    type: 'enum',
    enum: ContactType
  })
  type: ContactType;

  @Column({ type: 'varchar', length: 200, nullable: true })
  organization?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  title?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  address?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  city?: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  state?: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  zip?: string;

  @Column({ type: 'uuid', nullable: true, comment: 'UUID of related student or user' })
  relationTo?: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: true,
    comment: 'Type of relationship (parent, emergency, etc.)'
  })
  relationshipType?: string;

  @Column({
    type: 'jsonb',
    nullable: true,
    default: {},
    comment: 'Custom healthcare-specific fields'
  })
  customFields?: Record<string, any>;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @Column({
    type: 'uuid',
    nullable: true,
    comment: 'User who created this contact'
  })
  createdBy?: string;

  @Column({
    type: 'uuid',
    nullable: true,
    comment: 'User who last updated this contact'
  })
  updatedBy?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ comment: 'Soft delete timestamp' })
  deletedAt?: Date;

  /**
   * Get full name
   */
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  /**
   * Get display name with organization if available
   */
  get displayName(): string {
    if (this.organization) {
      return `${this.fullName} (${this.organization})`;
    }
    return this.fullName;
  }
}
