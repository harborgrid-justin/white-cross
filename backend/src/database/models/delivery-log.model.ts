import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  ForeignKey,
  BelongsTo,
  Index
  } from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';

export enum DeliveryChannel {
  EMAIL = 'email',
  SMS = 'sms',
  PUSH = 'push',
  VOICE = 'voice'
}

/**
 * Delivery Log Attributes Interface
 */
export interface DeliveryLogAttributes {
  id?: string;
  alertId: string;
  channel: any;
  recipientId?: string;
  success: boolean;
  attemptCount: number;
  lastAttempt: Date;
  deliveredAt?: Date;
  errorMessage?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Delivery Log Model
 *
 * Tracks alert delivery attempts across multiple channels.
 * Supports retry logic and failure tracking.
 *
 * Features:
 * - Multi-channel delivery tracking
 * - Attempt counting for exponential backoff
 * - Success/failure logging
 * - Error message capture
 *
 * Indexes:
 * - alertId for alert-specific logs
 * - channel for channel-specific queries
 * - success for failed delivery queries
 * - lastAttempt for retry scheduling
 */
@Table({
  tableName: 'delivery_logs',
  timestamps: true,
  underscored: false,
  indexes: [
    {
      fields: ['alertId'],
      name: 'delivery_logs_alert_id_idx'
  },
    {
      fields: ['channel'],
      name: 'delivery_logs_channel_idx'
  },
    {
      fields: ['success'],
      name: 'delivery_logs_success_idx'
  },
    {
      fields: ['lastAttempt'],
      name: 'delivery_logs_last_attempt_idx'
  },
    {
      fields: ['recipientId'],
      name: 'delivery_logs_recipient_id_idx'
  },
    {
      fields: ['alertId', 'channel', 'recipientId'],
      name: 'delivery_logs_alert_channel_recipient_idx'
  },
  ]
  })
export class DeliveryLog extends Model<DeliveryLogAttributes> implements DeliveryLogAttributes {
  @PrimaryKey
  @Default(() => uuidv4())
  @Column(DataType.UUID)
  declare id: string;

  /**
   * Alert being delivered
   */
  @Index
  @ForeignKey(() => require('./alert.model').Alert)
  @Column({
    type: DataType.UUID,
    allowNull: false
  })
  alertId: string;

  @BelongsTo(() => require('./alert.model').Alert, { foreignKey: 'alertId', as: 'alert' })
  declare alert: any;

  /**
   * Delivery channel used
   */
  @Index
  @Column({
    type: DataType.ENUM(...(Object.values(DeliveryChannel) as string[])),
    allowNull: false
  })
  declare channel: any;

  /**
   * Recipient user (optional, for targeted deliveries)
   */
  @Index
  @ForeignKey(() => require('./user.model').User)
  @Column({
    type: DataType.UUID
  })
  recipientId?: string;

  @BelongsTo(() => require('./user.model').User, { foreignKey: 'recipientId', as: 'recipient' })
  declare recipient: any;

  /**
   * Whether delivery was successful
   */
  @Index
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false
  })
  success: boolean;

  /**
   * Number of delivery attempts
   */
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 1
  })
  attemptCount: number;

  /**
   * Timestamp of last delivery attempt
   */
  @Index
  @Column({
    type: DataType.DATE,
    allowNull: false
  })
  lastAttempt: Date;

  /**
   * Timestamp of successful delivery
   */
  @Column({
    type: DataType.DATE
  })
  deliveredAt?: Date;

  /**
   * Error message if delivery failed
   */
  @Column({
    type: DataType.TEXT
  })
  errorMessage?: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW
  })
  declare createdAt?: Date;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW
  })
  declare updatedAt?: Date;

  /**
   * Calculate backoff time for retry (exponential backoff)
   */
  getBackoffMs(): number {
    return Math.min(1000 * Math.pow(2, this.attemptCount), 60000); // Max 1 minute
  }

  /**
   * Check if ready for retry
   */
  isReadyForRetry(): boolean {
    if (this.success) {
      return false;
    }

    const timeSinceLastAttempt = Date.now() - this.lastAttempt.getTime();
    return timeSinceLastAttempt >= this.getBackoffMs();
  }
}
