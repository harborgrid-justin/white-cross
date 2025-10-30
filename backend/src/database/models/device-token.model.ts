import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  AllowNull,
  Index
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
  id?: string;
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

export interface DeviceTokenCreationAttributes {
  id?: string;
  userId: string;
  deviceId: string;
  platform: NotificationPlatform;
  token: string;
  deviceName?: string;
  deviceModel?: string;
  osVersion?: string;
  appVersion?: string;
  isActive?: boolean;
  isValid?: boolean;
  lastValidated?: Date;
  invalidReason?: string;
  allowNotifications?: boolean;
  allowSound?: boolean;
  allowBadge?: boolean;
  lastUsedAt?: Date;
}

@Table({
  tableName: 'device_tokens',
  timestamps: true,
  indexes: [
    {
      fields: ['userId', 'deviceId'],
      unique: true
  },
    {
      fields: ['platform']
  },
    {
      fields: ['isActive', 'isValid']
  },
  ]
  })
export class DeviceToken extends Model<DeviceTokenAttributes, DeviceTokenCreationAttributes> implements DeviceTokenAttributes {
  @PrimaryKey
  @Default(() => uuidv4())
  @Column(DataType.UUID)
  declare id?: string;

  @Column({
    type: DataType.UUID,
    allowNull: false
  })
  @Index
  userId: string;

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  deviceId: string;

  @Column({
    type: DataType.ENUM(...(Object.values(NotificationPlatform) as string[])),
    allowNull: false
  })
  @Index
  platform: NotificationPlatform;

  @Column({
    type: DataType.TEXT,
    allowNull: false
  })
  token: string;

  // Device metadata
  @AllowNull
  @Column({
    type: DataType.STRING
  })
  deviceName?: string;

  @AllowNull
  @Column({
    type: DataType.STRING
  })
  deviceModel?: string;

  @AllowNull
  @Column({
    type: DataType.STRING
  })
  osVersion?: string;

  @AllowNull
  @Column({
    type: DataType.STRING
  })
  appVersion?: string;

  // Status
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true
  })
  isActive: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true
  })
  isValid: boolean;

  @AllowNull
  @Column({
    type: DataType.DATE
  })
  lastValidated?: Date;

  @AllowNull
  @Column({
    type: DataType.STRING
  })
  invalidReason?: string;

  // Preferences
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true
  })
  allowNotifications: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true
  })
  allowSound: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true
  })
  allowBadge: boolean;

  @Column(DataType.DATE)
  declare createdAt?: Date;

  @Column(DataType.DATE)
  declare updatedAt?: Date;

  @AllowNull
  @Column({
    type: DataType.DATE
  })
  lastUsedAt?: Date;
}
