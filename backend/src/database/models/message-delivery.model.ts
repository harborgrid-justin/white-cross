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
  Scopes,
  BeforeCreate,
  BeforeUpdate,
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
      isIn: [Object.values(DeliveryChannelType)],
    },
    allowNull: false,
  })
  declare channel: any;

  @Index
  @Column({
    type: DataType.STRING(50),
    validate: {
      isIn: [Object.values(DeliveryStatus)],
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

  @BelongsTo(() => require('./message.model').Message, {
    foreignKey: 'messageId',
    as: 'message',
  })
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

  // Hooks for HIPAA compliance
  @BeforeCreate
  @BeforeUpdate
  static async auditPHIAccess(instance: MessageDelivery) {
    if (instance.changed()) {
      const changedFields = instance.changed() as string[];
      console.log(
        `[AUDIT] MessageDelivery ${instance.id} modified at ${new Date().toISOString()}`,
      );
      console.log(`[AUDIT] Changed fields: ${changedFields.join(', ')}`);
      // TODO: Integrate with AuditLog service for persistent audit trail
    }
  }
}
