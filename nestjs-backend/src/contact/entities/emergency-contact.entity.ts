/**
 * Emergency Contact Entity
 * @description TypeORM entity for managing student emergency contacts
 *
 * Key Features:
 * - Priority-based contact management (primary, secondary, emergency-only)
 * - Multi-channel notification support (SMS, email, voice)
 * - Contact verification workflow (unverified → pending → verified/failed)
 * - Student pickup authorization tracking
 */
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index
} from 'typeorm';
import { ContactPriority, VerificationStatus, PreferredContactMethod, NotificationChannel } from '../enums';

@Entity('emergency_contacts')
@Index(['studentId'])
@Index(['isActive'])
@Index(['priority'])
@Index(['verificationStatus'])
export class EmergencyContact {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'uuid',
    nullable: false,
    comment: 'Foreign key to students table - emergency contact owner'
  })
  @Index()
  studentId: string;

  @Column({ type: 'varchar', length: 100 })
  firstName: string;

  @Column({ type: 'varchar', length: 100 })
  lastName: string;

  @Column({ type: 'varchar', length: 50 })
  relationship: string;

  @Column({ type: 'varchar', length: 20 })
  phoneNumber: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  email?: string;

  @Column({ type: 'text', nullable: true })
  address?: string;

  @Column({
    type: 'enum',
    enum: ContactPriority,
    default: ContactPriority.PRIMARY
  })
  priority: ContactPriority;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({
    type: 'enum',
    enum: PreferredContactMethod,
    nullable: true,
    default: PreferredContactMethod.ANY
  })
  preferredContactMethod?: PreferredContactMethod;

  @Column({
    type: 'enum',
    enum: VerificationStatus,
    nullable: true,
    default: VerificationStatus.UNVERIFIED
  })
  verificationStatus?: VerificationStatus;

  @Column({ type: 'timestamp', nullable: true })
  lastVerifiedAt?: Date;

  @Column({
    type: 'text',
    nullable: true,
    comment: 'JSON array of notification channels (sms, email, voice)'
  })
  notificationChannels?: string;

  @Column({ type: 'boolean', nullable: true, default: false })
  canPickupStudent?: boolean;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  /**
   * Get full name
   */
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  /**
   * Check if this is a primary contact
   */
  get isPrimary(): boolean {
    return this.priority === ContactPriority.PRIMARY;
  }

  /**
   * Check if contact is verified
   */
  get isVerified(): boolean {
    return this.verificationStatus === VerificationStatus.VERIFIED;
  }

  /**
   * Parse notification channels from JSON string
   */
  get parsedNotificationChannels(): NotificationChannel[] {
    if (!this.notificationChannels) return [];
    try {
      return JSON.parse(this.notificationChannels);
    } catch {
      return [];
    }
  }
}
