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
import { User } from './user.model';
import { School } from './school.model';
import { AlertSeverity, AlertCategory } from './alert.model';

/**
 * Delivery Channel Types
 */
export enum DeliveryChannel {
  WEBSOCKET = 'WEBSOCKET',
  EMAIL = 'EMAIL',
  SMS = 'SMS',
  PUSH_NOTIFICATION = 'PUSH_NOTIFICATION',
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
  underscored: true,
  indexes: [
    {
      fields: ['user_id'],
      name: 'alert_preferences_user_id_idx',
    },
    {
      fields: ['school_id'],
      name: 'alert_preferences_school_id_idx',
    },
    {
      fields: ['is_active'],
      name: 'alert_preferences_is_active_idx',
    },
    {
      fields: ['user_id', 'school_id'],
      name: 'alert_preferences_user_school_idx',
      unique: true,
    },
  ],
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
  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'user_id',
  })
  userId: string;

  @BelongsTo(() => User, 'userId')
  user?: User;

  /**
   * Optional school-specific preferences
   */
  @Index
  @ForeignKey(() => School)
  @Column({
    type: DataType.UUID,
    field: 'school_id',
  })
  schoolId?: string;

  @BelongsTo(() => School, 'schoolId')
  school?: School;

  /**
   * Preferred delivery channels
   */
  @Column({
    type: DataType.ARRAY(DataType.ENUM(...(Object.values(DeliveryChannel) as string[]))),
    allowNull: false,
    defaultValue: [DeliveryChannel.WEBSOCKET, DeliveryChannel.EMAIL],
  })
  channels: DeliveryChannel[];

  /**
   * Filter by severity levels (only receive these severities)
   */
  @Column({
    type: DataType.ARRAY(DataType.ENUM(...(Object.values(AlertSeverity) as string[]))),
    allowNull: false,
    defaultValue: Object.values(AlertSeverity),
    field: 'severity_filter',
  })
  severityFilter: AlertSeverity[];

  /**
   * Filter by categories (only receive these categories)
   */
  @Column({
    type: DataType.ARRAY(DataType.ENUM(...(Object.values(AlertCategory) as string[]))),
    allowNull: false,
    defaultValue: Object.values(AlertCategory),
    field: 'category_filter',
  })
  categoryFilter: AlertCategory[];

  /**
   * Quiet hours start time (HH:MM format)
   */
  @Column({
    type: DataType.STRING(5),
    field: 'quiet_hours_start',
    validate: {
      is: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
    },
  })
  quietHoursStart?: string;

  /**
   * Quiet hours end time (HH:MM format)
   */
  @Column({
    type: DataType.STRING(5),
    field: 'quiet_hours_end',
    validate: {
      is: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
    },
  })
  quietHoursEnd?: string;

  /**
   * Whether preferences are active
   */
  @Index
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    field: 'is_active',
  })
  isActive: boolean;

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
