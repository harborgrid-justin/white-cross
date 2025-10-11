import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../../config/sequelize';
import { MessageType, MessageCategory } from '../../types/enums';

/**
 * MessageTemplate Model
 * Stores reusable message templates for various communication scenarios
 * Used for standardizing communications with parents, guardians, and staff
 */

interface MessageTemplateAttributes {
  id: string;
  name: string;
  subject?: string;
  content: string;
  type: MessageType;
  category: MessageCategory;
  variables: string[];
  isActive: boolean;
  createdById: string;
  createdAt: Date;
  updatedAt: Date;
}

interface MessageTemplateCreationAttributes
  extends Optional<MessageTemplateAttributes, 'id' | 'subject' | 'variables' | 'isActive' | 'createdAt' | 'updatedAt'> {}

export class MessageTemplate
  extends Model<MessageTemplateAttributes, MessageTemplateCreationAttributes>
  implements MessageTemplateAttributes
{
  public id!: string;
  public name!: string;
  public subject?: string;
  public content!: string;
  public type!: MessageType;
  public category!: MessageCategory;
  public variables!: string[];
  public isActive!: boolean;
  public createdById!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

MessageTemplate.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    subject: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM(...Object.values(MessageType)),
      allowNull: false,
    },
    category: {
      type: DataTypes.ENUM(...Object.values(MessageCategory)),
      allowNull: false,
    },
    variables: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
      defaultValue: [],
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    createdById: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: 'message_templates',
    timestamps: true,
    indexes: [
      { fields: ['createdById'] },
      { fields: ['type'] },
      { fields: ['category'] },
      { fields: ['isActive'] },
    ],
  }
);
