import {
  BeforeCreate,
  BeforeUpdate,
  BelongsTo,
  Column,
  DataType,
  Default,
  ForeignKey,
  Index,
  Model,
  PrimaryKey,
  Scopes,
  Table,
} from 'sequelize-typescript';
import { Optional } from 'sequelize';
import type { Message } from './message.model';
import { createModelAuditHook } from '../services/model-audit-hooks.service';

export enum RecipientType {
  NURSE = 'NURSE',
  PARENT = 'PARENT',
  GUARDIAN = 'GUARDIAN',
  EMERGENCY_CONTACT = 'EMERGENCY_CONTACT',
  STUDENT = 'STUDENT',
  STAFF = 'STAFF',
  ADMINISTRATOR = 'ADMINISTRATOR',
}

export enum DeliveryStatus {
  PENDING = 'PENDING',
  SENT = 'SENT',
  DELIVERED = 'DELIVERED',
  FAILED = 'FAILED',
  BOUNCED = 'BOUNCED',
}

export enum DeliveryChannelType {
  EMAIL = 'EMAIL',
  SMS = 'SMS',
  PUSH = 'PUSH',
  IN_APP = 'IN_APP',
}

export interface MessageDeliveryAttributes {
  id?: string;
  recipientType: RecipientType;
  recipientId: string;
  channel: DeliveryChannelType;
  status: DeliveryStatus;
  contactInfo?: string;
  sentAt?: Date;
  deliveredAt?: Date;
  failureReason?: string;
  externalId?: string;
  messageId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface MessageDeliveryCreationAttributes
  extends Optional<
    MessageDeliveryAttributes,
    | 'id'
    | 'contactInfo'
    | 'sentAt'
    | 'deliveredAt'
    | 'failureReason'
    | 'externalId'
    | 'createdAt'
    | 'updatedAt'
  > {}

@Scopes(() => ({
  active: {
    where: {
      deletedAt: null,
    },
    order: [['createdAt', 'DESC']],
  },
}))
@Table({
  tableName: 'message_deliveries',
  timestamps: true,
  underscored: false,
  paranoid: true,
  indexes: [
    {
      unique: true,
      fields: ['messageId', 'recipientType', 'recipientId', 'channel'],
      name: 'message_deliveries_message_recipient_channel_unique',
    },
    {
      fields: ['createdAt'],
      name: 'idx_message_delivery_created_at',
    },
    {
      fields: ['updatedAt'],
      name: 'idx_message_delivery_updated_at',
    },
  ],
})
export class MessageDelivery extends Model<
  MessageDeliveryAttributes,
  MessageDeliveryCreationAttributes
> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id?: string;

  @Index
  @Column({
    type: DataType.STRING(50),
    validate: {
      isIn: [Object.values(RecipientType)],
    },
    allowNull: false,
  })
  declare recipientType: RecipientType;

  @Index
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare recipientId: string;

  @Index
  @Column({
    type: DataType.STRING(50),
    validate: {
      isIn: [Object.values(DeliveryChannelType)],
    },
    allowNull: false,
    defaultValue: DeliveryChannelType.IN_APP,
  })
  declare channel: DeliveryChannelType;

  @Index
  @Column({
    type: DataType.STRING(50),
    validate: {
      isIn: [Object.values(DeliveryStatus)],
    },
    allowNull: false,
    defaultValue: DeliveryStatus.PENDING,
  })
  declare status: DeliveryStatus;

  @Column({
    type: DataType.STRING(500),
    allowNull: true,
  })
  declare contactInfo?: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  declare sentAt?: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  declare deliveredAt?: Date;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare failureReason?: string;

  @Index
  @Column({
    type: DataType.STRING(255),
    allowNull: true,
  })
  declare externalId?: string;

  @Index
  @ForeignKey(() => require('./message.model').Message)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    references: {
      model: 'messages',
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  declare messageId: string;

  @BelongsTo(() => require('./message.model').Message, {
    foreignKey: 'messageId',
    as: 'message',
  })
  declare message?: Message;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
  })
  declare createdAt?: Date;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
  })
  declare updatedAt?: Date;

  // Hooks for HIPAA compliance
  @BeforeCreate
  @BeforeUpdate
  static async auditPHIAccess(instance: MessageDelivery) {
    await createModelAuditHook('MessageDelivery', instance);
  }
}

// Default export for Sequelize-TypeScript
export default MessageDelivery;
