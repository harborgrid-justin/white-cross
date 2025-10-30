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
import { Optional } from 'sequelize';
import { Message } from './message.model';

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
    'id' | 'contactInfo' | 'sentAt' | 'deliveredAt' | 'failureReason' | 'externalId' | 'createdAt' | 'updatedAt'
  > {}

@Table({
  tableName: 'message_deliveries',
  timestamps: true,
  underscored: false,
})
export class MessageDelivery extends Model<MessageDeliveryAttributes, MessageDeliveryCreationAttributes> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id?: string;

  @Index
  @Column({
    type: DataType.STRING(50),
    validate: {
      isIn: [Object.values(RecipientType)]
    },
    allowNull: false,
  })
  recipientType: RecipientType;

  @Index
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  recipientId: string;

  @Index
  @Column({
    type: DataType.STRING(50),
    validate: {
      isIn: [Object.values(DeliveryChannelType)]
    },
    allowNull: false,
  })
  declare channel: any;

  @Index
  @Column({
    type: DataType.STRING(50),
    validate: {
      isIn: [Object.values(DeliveryStatus)]
    },
    allowNull: false,
  })
  status: DeliveryStatus;

  @Column({
    type: DataType.STRING(500),
    allowNull: true,
  })
  contactInfo?: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  sentAt?: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  deliveredAt?: Date;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  failureReason?: string;

  @Index
  @Column({
    type: DataType.STRING(255),
    allowNull: true,
  })
  externalId?: string;

  @Index
  @ForeignKey(() => require('./message.model').Message)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  messageId: string;

  @BelongsTo(() => require('./message.model').Message, { foreignKey: 'messageId', as: 'message' })
  declare message: any;

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
}
