import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../../config/sequelize';
import { RecipientType, MessageType, DeliveryStatus } from '../../types/enums';

/**
 * MessageDelivery Model
 * Tracks individual message deliveries to recipients
 * Monitors delivery status, failures, and external provider tracking
 */

interface MessageDeliveryAttributes {
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

interface MessageDeliveryCreationAttributes
  extends Optional<
    MessageDeliveryAttributes,
    'id' | 'contactInfo' | 'sentAt' | 'deliveredAt' | 'failureReason' | 'externalId' | 'createdAt' | 'updatedAt'
  > {}

export class MessageDelivery
  extends Model<MessageDeliveryAttributes, MessageDeliveryCreationAttributes>
  implements MessageDeliveryAttributes
{
  public id!: string;
  public recipientType!: RecipientType;
  public recipientId!: string;
  public channel!: MessageType;
  public status!: DeliveryStatus;
  public contactInfo?: string;
  public sentAt?: Date;
  public deliveredAt?: Date;
  public failureReason?: string;
  public externalId?: string;
  public messageId!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

MessageDelivery.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    recipientType: {
      type: DataTypes.ENUM(...Object.values(RecipientType)),
      allowNull: false,
    },
    recipientId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    channel: {
      type: DataTypes.ENUM(...Object.values(MessageType)),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM(...Object.values(DeliveryStatus)),
      allowNull: false,
    },
    contactInfo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    sentAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    deliveredAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    failureReason: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    externalId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    messageId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: 'message_deliveries',
    timestamps: true,
    indexes: [
      { fields: ['messageId'] },
      { fields: ['recipientId'] },
      { fields: ['recipientType'] },
      { fields: ['status'] },
      { fields: ['channel'] },
      { fields: ['externalId'] },
    ],
  }
);
