import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

/**
 * Session Entity
 * Manages active user sessions for security tracking and concurrent session limits
 */
@Entity('sessions')
@Index(['userId', 'isActive'])
@Index(['sessionToken'])
@Index(['expiresAt'])
export class SessionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  sessionToken: string;

  @Column()
  userId: string;

  @Column()
  ipAddress: string;

  @Column({ type: 'text', nullable: true })
  userAgent?: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'timestamp' })
  expiresAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  lastAccessedAt?: Date;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'json', nullable: true })
  metadata?: Record<string, any>; // Device info, location, etc.

  @UpdateDateColumn()
  updatedAt: Date;
}
