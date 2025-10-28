import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';
import { NotificationPlatform } from '../enums';

/**
 * Device Token Entity
 * Stores registered mobile device tokens for push notifications
 */
@Entity('device_tokens')
@Index(['userId', 'deviceId'], { unique: true })
@Index(['platform'])
@Index(['isActive', 'isValid'])
export class DeviceToken {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Index()
  userId: string;

  @Column()
  deviceId: string;

  @Column({
    type: 'enum',
    enum: NotificationPlatform
  })
  platform: NotificationPlatform;

  @Column({ type: 'text' })
  token: string;

  // Device metadata
  @Column({ nullable: true })
  deviceName: string;

  @Column({ nullable: true })
  deviceModel: string;

  @Column({ nullable: true })
  osVersion: string;

  @Column({ nullable: true })
  appVersion: string;

  // Status
  @Column({ default: true })
  isActive: boolean;

  @Column({ default: true })
  isValid: boolean;

  @Column({ nullable: true })
  lastValidated: Date;

  @Column({ nullable: true })
  invalidReason: string;

  // Preferences
  @Column({ default: true })
  allowNotifications: boolean;

  @Column({ default: true })
  allowSound: boolean;

  @Column({ default: true })
  allowBadge: boolean;

  // Timestamps
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ nullable: true })
  lastUsedAt: Date;
}
