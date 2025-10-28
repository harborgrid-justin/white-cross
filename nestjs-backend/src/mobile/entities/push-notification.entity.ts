import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';
import { NotificationCategory, NotificationPriority, NotificationStatus } from '../enums';

/**
 * Notification Action Interface
 */
export interface NotificationAction {
  label: string;
  action: string;
  icon?: string;
}

/**
 * Notification Delivery Result Interface
 */
export interface NotificationDeliveryResult {
  platform: string;
  deviceToken: string;
  status: string;
  response?: any;
  error?: string;
  deliveredAt?: Date;
}

/**
 * Push Notification Entity
 * Stores push notification records and delivery tracking
 */
@Entity('push_notifications')
@Index(['status'])
@Index(['category'])
@Index(['createdAt'])
export class PushNotification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Recipients
  @Column('simple-array')
  userIds: string[];

  @Column('simple-array', { nullable: true })
  deviceTokens: string[];

  // Content
  @Column()
  title: string;

  @Column({ type: 'text' })
  body: string;

  @Column({
    type: 'enum',
    enum: NotificationCategory
  })
  category: NotificationCategory;

  @Column({
    type: 'enum',
    enum: NotificationPriority,
    default: NotificationPriority.NORMAL
  })
  priority: NotificationPriority;

  // Data payload
  @Column({ type: 'json', nullable: true })
  data: Record<string, string>;

  // Actions
  @Column({ type: 'json', nullable: true })
  actions: NotificationAction[];

  // Presentation
  @Column({ nullable: true })
  imageUrl: string;

  @Column({ nullable: true })
  iconUrl: string;

  @Column({ nullable: true })
  sound: string;

  @Column({ nullable: true })
  badge: number;

  // Behavior
  @Column({ nullable: true })
  ttl: number; // Time to live in seconds

  @Column({ nullable: true })
  collapseKey: string;

  @Column({ default: false })
  requireInteraction: boolean;

  @Column({ default: false })
  silent: boolean;

  // Scheduling
  @Column({ nullable: true })
  scheduledFor: Date;

  @Column({ nullable: true })
  expiresAt: Date;

  // Delivery tracking
  @Column({
    type: 'enum',
    enum: NotificationStatus,
    default: NotificationStatus.PENDING
  })
  status: NotificationStatus;

  @Column({ nullable: true })
  sentAt: Date;

  @Column({ nullable: true })
  deliveredAt: Date;

  @Column({ nullable: true })
  failedAt: Date;

  // Delivery results
  @Column({ type: 'json', default: '[]' })
  deliveryResults: NotificationDeliveryResult[];

  // Statistics
  @Column({ default: 0 })
  totalRecipients: number;

  @Column({ default: 0 })
  successfulDeliveries: number;

  @Column({ default: 0 })
  failedDeliveries: number;

  @Column({ default: 0 })
  clickedCount: number;

  @Column({ default: 0 })
  dismissedCount: number;

  // Retry
  @Column({ default: 0 })
  retryCount: number;

  @Column({ default: 3 })
  maxRetries: number;

  @Column({ nullable: true })
  nextRetryAt: Date;

  // Metadata
  @Column()
  createdBy: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
