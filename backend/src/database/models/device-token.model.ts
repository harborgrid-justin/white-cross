import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  AllowNull,
  Index,
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';

export enum NotificationPlatform {
  FCM = 'FCM',           // Firebase Cloud Messaging (Android)
  APNS = 'APNS',         // Apple Push Notification Service (iOS)
  WEB_PUSH = 'WEB_PUSH', // Web Push API
  SMS = 'SMS',           // Fallback SMS
  EMAIL = 'EMAIL'        // Fallback Email
}

export interface DeviceTokenAttributes {
  id: string;
  userId: string;
  deviceId: string;
  platform: NotificationPlatform;
  token: string;
  deviceName?: string;
  deviceModel?: string;
  osVersion?: string;
  appVersion?: string;
  isActive: boolean;
  isValid: boolean;
  lastValidated?: Date;
  invalidReason?: string;
  allowNotifications: boolean;
  allowSound: boolean;
  allowBadge: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  lastUsedAt?: Date;
}

@Table({
  tableName: 'device_tokens',
  timestamps: true,
  indexes: [
    {
      fields: ['user_id', 'device_id'],
      unique: true,
    },
    {
      fields: ['platform'],
    },
    {
      fields: ['is_active', 'is_valid'],
    },
  ],
})
export class DeviceToken extends Model<DeviceTokenAttributes> implements DeviceTokenAttributes {
  @PrimaryKey
  @Default(() => uuidv4())
  @Column(DataType.UUID)
  declare id: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'user_id',
  })
  @Index
  userId: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'device_id',
  })
  deviceId: string;

  @Column({
    type: DataType.ENUM(...Object.values(NotificationPlatform)),
    allowNull: false,
  })
  @Index
  platform: NotificationPlatform;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  token: string;

  // Device metadata
  @AllowNull
  @Column({
    type: DataType.STRING,
    field: 'device_name',
  })
  deviceName?: string;

  @AllowNull
  @Column({
    type: DataType.STRING,
    field: 'device_model',
  })
  deviceModel?: string;

  @AllowNull
  @Column({
    type: DataType.STRING,
    field: 'os_version',
  })
  osVersion?: string;

  @AllowNull
  @Column({
    type: DataType.STRING,
    field: 'app_version',
  })
  appVersion?: string;

  // Status
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    field: 'is_active',
  })
  isActive: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    field: 'is_valid',
  })
  isValid: boolean;

  @AllowNull
  @Column({
    type: DataType.DATE,
    field: 'last_validated',
  })
  lastValidated?: Date;

  @AllowNull
  @Column({
    type: DataType.STRING,
    field: 'invalid_reason',
  })
  invalidReason?: string;

  // Preferences
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    field: 'allow_notifications',
  })
  allowNotifications: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    field: 'allow_sound',
  })
  allowSound: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    field: 'allow_badge',
  })
  allowBadge: boolean;

  @Column(DataType.DATE)
  declare createdAt?: Date;

  @Column(DataType.DATE)
  declare updatedAt?: Date;

  @AllowNull
  @Column({
    type: DataType.DATE,
    field: 'last_used_at',
  })
  lastUsedAt?: Date;
}
