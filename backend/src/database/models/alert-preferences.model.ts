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
import { AlertSeverity, AlertCategory } from './alert.model';

/**
 * Delivery Channel Types
 */
export enum DeliveryChannel {
  WEBSOCKET = 'WEBSOCKET',
  EMAIL = 'EMAIL',
  SMS = 'SMS',
  PUSH_NOTIFICATION = 'PUSH_NOTIFICATION'
  }

/**
 * Alert Preferences Attributes Interface
 */
export interface AlertPreferencesAttributes {
  id?: string;
  userId: string;
  schoolId?: string;
  channels: DeliveryChannel[];
  severityFilter: AlertSeverity[];
  categoryFilter: AlertCategory[];
  quietHoursStart?: string;
  quietHoursEnd?: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Alert Preferences Model
 *
 * Manages user notification preferences for alerts.
 * Controls delivery channels, filtering, and quiet hours.
 *
 * Features:
 * - Multi-channel delivery preferences
 * - Severity and category filtering
 * - Quiet hours configuration
 * - Per-school settings
 *
 * Indexes:
 * - userId for user preference lookups
 * - schoolId for school-specific preferences
 * - isActive for active preference queries
 */
@Table({
  tableName: 'alert_preferences',
  timestamps: true,
  underscored: false,
  indexes: [
    {
      fields: ['userId'],
      name: 'alert_preferences_user_id_idx'
  },
    {
      fields: ['schoolId'],
      name: 'alert_preferences_school_id_idx'
  },
    {
      fields: ['isActive'],
      name: 'alert_preferences_is_active_idx'
  },
    {
      fields: ['userId', 'schoolId'],
      name: 'alert_preferences_user_school_idx',
      unique: true
  },
  ]
  })
export class AlertPreferences extends Model<AlertPreferencesAttributes> implements AlertPreferencesAttributes {
  @PrimaryKey
  @Default(() => uuidv4())
  @Column(DataType.UUID)
  declare id: string;

  /**
   * User these preferences belong to
   */
  @Index
  @ForeignKey(() => require('./user.model').User)
  @Column({
    type: DataType.UUID,
    allowNull: false
  })
  userId: string;

  @BelongsTo(() => require('./user.model').User, { foreignKey: 'userId', as: 'user' })
  declare user?: any;

  /**
   * Optional school-specific preferences
   */
  @Index
  @ForeignKey(() => require('./school.model').School)
  @Column({
    type: DataType.UUID
  })
  schoolId?: string;

  @BelongsTo(() => require('./school.model').School, { foreignKey: 'schoolId', as: 'school' })
  declare school?: any;

  /**
   * Preferred delivery channels
   */
  @Column({
    type: DataType.ARRAY(DataType.ENUM(...(Object.values(DeliveryChannel) as string[]))),
    allowNull: false,
    defaultValue: [DeliveryChannel.WEBSOCKET, DeliveryChannel.EMAIL]
  })
  channels: DeliveryChannel[];

  /**
   * Filter by severity levels (only receive these severities)
   */
  @Column({
    type: DataType.ARRAY(DataType.ENUM(...(Object.values(AlertSeverity) as string[]))),
    allowNull: false,
    defaultValue: Object.values(AlertSeverity)
  })
  severityFilter: AlertSeverity[];

  /**
   * Filter by categories (only receive these categories)
   */
  @Column({
    type: DataType.ARRAY(DataType.ENUM(...(Object.values(AlertCategory) as string[]))),
    allowNull: false,
    defaultValue: Object.values(AlertCategory)
  })
  categoryFilter: AlertCategory[];

  /**
   * Quiet hours start time (HH:MM format)
   */
  @Column({
    type: DataType.STRING(5),
    validate: {
      is: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/
  }
  })
  quietHoursStart?: string;

  /**
   * Quiet hours end time (HH:MM format)
   */
  @Column({
    type: DataType.STRING(5),
    validate: {
      is: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/
  }
  })
  quietHoursEnd?: string;

  /**
   * Whether preferences are active
   */
  @Index
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true
  })
  isActive: boolean;

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
   * Check if current time is within quiet hours
   */
  isQuietHours(): boolean {
    if (!this.quietHoursStart || !this.quietHoursEnd) {
      return false;
    }

    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();

    const [startHour, startMin] = this.quietHoursStart.split(':').map(Number);
    const [endHour, endMin] = this.quietHoursEnd.split(':').map(Number);

    const startTime = startHour * 60 + startMin;
    const endTime = endHour * 60 + endMin;

    if (startTime < endTime) {
      return currentTime >= startTime && currentTime <= endTime;
    } else {
      // Quiet hours span midnight
      return currentTime >= startTime || currentTime <= endTime;
    }
  }

  /**
   * Check if alert matches filters
   */
  matchesFilters(severity: AlertSeverity, category: AlertCategory): boolean {
    return (
      this.severityFilter.includes(severity) &&
      this.categoryFilter.includes(category)
    );
  }
}
