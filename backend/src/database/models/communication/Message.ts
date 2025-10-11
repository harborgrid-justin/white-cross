import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../../config/sequelize';
import { MessagePriority, MessageCategory } from '../../types/enums';

/**
 * Message Model
 * Represents individual messages sent to parents, guardians, or staff
 * Supports scheduled delivery, attachments, and delivery tracking
 */

interface MessageAttributes {
  id: string;
  subject?: string;
  content: string;
  priority: MessagePriority;
  category: MessageCategory;
  recipientCount: number;
  scheduledAt?: Date;
  attachments: string[];
  senderId: string;
  templateId?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface MessageCreationAttributes
  extends Optional<
    MessageAttributes,
    'id' | 'subject' | 'recipientCount' | 'scheduledAt' | 'attachments' | 'templateId' | 'createdAt' | 'updatedAt'
  > {}

export class Message extends Model<MessageAttributes, MessageCreationAttributes> implements MessageAttributes {
  public id!: string;
  public subject?: string;
  public content!: string;
  public priority!: MessagePriority;
  public category!: MessageCategory;
  public recipientCount!: number;
  public scheduledAt?: Date;
  public attachments!: string[];
  public senderId!: string;
  public templateId?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Message.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    subject: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    priority: {
      type: DataTypes.ENUM(...Object.values(MessagePriority)),
      allowNull: false,
    },
    category: {
      type: DataTypes.ENUM(...Object.values(MessageCategory)),
      allowNull: false,
    },
    recipientCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    scheduledAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    attachments: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
      defaultValue: [],
    },
    senderId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    templateId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: 'messages',
    timestamps: true,
    indexes: [
      { fields: ['senderId'] },
      { fields: ['templateId'] },
      { fields: ['priority', 'createdAt'] },
      { fields: ['category'] },
      { fields: ['scheduledAt'] },
    ],
  }
);
