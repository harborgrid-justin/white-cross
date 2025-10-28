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
import { Message } from './message.model';
import { MessageType } from './message-template.model';

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

export interface MessageDeliveryAttributes {
  id: string;
  recipientType: RecipientType;
  recipientId: string;
  channel: MessageType;
  status: DeliveryStatus;
  contactInfo?: string;
  sentAt?: Date;
  deliveredAt?: Date;
  failureReason?: string;
  externalId?: string;
  messageId: string;
  createdAt: Date;
  updatedAt: Date;
}

@Table({
  tableName: 'message_deliveries',
  timestamps: true,
  underscored: true,
})
export class MessageDelivery extends Model<MessageDeliveryAttributes> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @Index
  @Column({
    type: DataType.ENUM(...Object.values(RecipientType)),
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
    type: DataType.ENUM(...Object.values(MessageType)),
    allowNull: false,
  })
  channel: MessageType;

  @Index
  @Column({
    type: DataType.ENUM(...Object.values(DeliveryStatus)),
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
  @ForeignKey(() => Message)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  messageId: string;

  @BelongsTo(() => Message, 'messageId')
  message: Message;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
  })
  createdAt: Date;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
  })
  updatedAt: Date;
}
