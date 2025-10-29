import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  ForeignKey,
  BelongsTo,
  Index,
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { Alert } from './alert.model';
import { User } from './user.model';
import { DeliveryChannel } from './alert-preferences.model';

/**
 * Delivery Log Attributes Interface
 */
export interface DeliveryLogAttributes {
  id: string;
  alertId: string;
  channel: DeliveryChannel;
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
  underscored: true,
  indexes: [
    {
      fields: ['alert_id'],
      name: 'delivery_logs_alert_id_idx',
    },
    {
      fields: ['channel'],
      name: 'delivery_logs_channel_idx',
    },
    {
      fields: ['success'],
      name: 'delivery_logs_success_idx',
    },
    {
      fields: ['last_attempt'],
      name: 'delivery_logs_last_attempt_idx',
    },
    {
      fields: ['recipient_id'],
      name: 'delivery_logs_recipient_id_idx',
    },
    {
      fields: ['alert_id', 'channel', 'recipient_id'],
      name: 'delivery_logs_alert_channel_recipient_idx',
    },
  ],
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
  @ForeignKey(() => Alert)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'alert_id',
  })
  alertId: string;

  @BelongsTo(() => Alert, 'alertId')
  alert?: Alert;

  /**
   * Delivery channel used
   */
  @Index
  @Column({
    type: DataType.ENUM(...(Object.values(DeliveryChannel) as string[])),
    allowNull: false,
  })
  channel: DeliveryChannel;

  /**
   * Recipient user (optional, for targeted deliveries)
   */
  @Index
  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    field: 'recipient_id',
  })
  recipientId?: string;

  @BelongsTo(() => User, 'recipientId')
  recipient?: User;

  /**
   * Whether delivery was successful
   */
  @Index
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  success: boolean;

  /**
   * Number of delivery attempts
   */
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 1,
    field: 'attempt_count',
  })
  attemptCount: number;

  /**
   * Timestamp of last delivery attempt
   */
  @Index
  @Column({
    type: DataType.DATE,
    allowNull: false,
    field: 'last_attempt',
  })
  lastAttempt: Date;

  /**
   * Timestamp of successful delivery
   */
  @Column({
    type: DataType.DATE,
    field: 'delivered_at',
  })
  deliveredAt?: Date;

  /**
   * Error message if delivery failed
   */
  @Column({
    type: DataType.TEXT,
    field: 'error_message',
  })
  errorMessage?: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
    field: 'created_at',
  })
  declare createdAt?: Date;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
    field: 'updated_at',
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
