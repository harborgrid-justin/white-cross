import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

/**
 * Login Attempt Entity
 * Tracks successful and failed login attempts for brute force detection
 */
@Entity('login_attempts')
@Index(['userId', 'createdAt'])
@Index(['ipAddress', 'createdAt'])
@Index(['success', 'createdAt'])
export class LoginAttemptEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  userId?: string; // May be null if login attempt failed before user identification

  @Column({ nullable: true })
  username?: string; // Attempted username/email

  @Column()
  ipAddress: string;

  @Column({ type: 'text', nullable: true })
  userAgent?: string;

  @Column({ default: false })
  success: boolean;

  @Column({ type: 'text', nullable: true })
  failureReason?: string; // e.g., 'invalid_password', 'user_not_found', 'account_locked'

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'json', nullable: true })
  metadata?: Record<string, any>; // Additional context (e.g., 2FA status, device info)
}
