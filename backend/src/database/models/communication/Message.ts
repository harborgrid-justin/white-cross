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
      type: DataTypes.STRING(255),
      allowNull: true,
      validate: {
        len: {
          args: [0, 255],
          msg: 'Subject cannot exceed 255 characters',
        },
      },
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Message content is required',
        },
        len: {
          args: [1, 50000],
          msg: 'Content must be between 1 and 50000 characters',
        },
        noSensitiveData(value: string) {
          // Check for SSN patterns (XXX-XX-XXXX or XXXXXXXXX)
          const ssnPattern = /\b\d{3}-?\d{2}-?\d{4}\b/g;
          if (ssnPattern.test(value)) {
            throw new Error('HIPAA Violation: Messages must not contain Social Security Numbers');
          }

          // Check for credit card patterns
          const ccPattern = /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/g;
          if (ccPattern.test(value)) {
            throw new Error('PCI Violation: Messages must not contain credit card numbers');
          }

          // Warn about potential medical record numbers (MRN) - 6+ consecutive digits
          const mrnPattern = /\b\d{6,}\b/g;
          const matches = value.match(mrnPattern);
          if (matches && matches.length > 2) {
            // Only warn if multiple instances, as it could be legitimate numeric content
            console.warn('Warning: Message contains multiple numeric sequences that may be medical record numbers');
          }
        },
      },
    },
    priority: {
      type: DataTypes.ENUM(...Object.values(MessagePriority)),
      allowNull: false,
      validate: {
        isIn: {
          args: [Object.values(MessagePriority)],
          msg: 'Invalid message priority',
        },
      },
    },
    category: {
      type: DataTypes.ENUM(...Object.values(MessageCategory)),
      allowNull: false,
      validate: {
        isIn: {
          args: [Object.values(MessageCategory)],
          msg: 'Invalid message category',
        },
        emergencyPriority(value: MessageCategory) {
          if (value === MessageCategory.EMERGENCY && this.priority !== MessagePriority.URGENT) {
            throw new Error('Emergency messages must have URGENT priority');
          }
        },
      },
    },
    recipientCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: {
          args: [0],
          msg: 'Recipient count cannot be negative',
        },
        max: {
          args: [10000],
          msg: 'Recipient count cannot exceed 10000',
        },
      },
    },
    scheduledAt: {
      type: DataTypes.DATE,
      allowNull: true,
      validate: {
        isDate: {
          msg: 'Scheduled time must be a valid date',
        },
        isFuture(value: Date) {
          if (value && new Date(value) <= new Date()) {
            throw new Error('Scheduled time must be in the future');
          }
        },
      },
    },
    attachments: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
      defaultValue: [],
      validate: {
        isArray(value: string[]) {
          if (!Array.isArray(value)) {
            throw new Error('Attachments must be an array');
          }
          if (value.length > 10) {
            throw new Error('Cannot exceed 10 attachments per message');
          }
        },
        validUrls(value: string[]) {
          if (!Array.isArray(value)) return;

          const urlPattern = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;

          for (const url of value) {
            if (!urlPattern.test(url)) {
              throw new Error(`Invalid attachment URL format: ${url.substring(0, 50)}...`);
            }
            if (url.length > 2048) {
              throw new Error('Attachment URL cannot exceed 2048 characters');
            }
            // Security: Ensure HTTPS for PHI attachments
            if (!url.startsWith('https://')) {
              throw new Error('Attachment URLs must use HTTPS protocol for security');
            }
          }
        },
      },
    },
    senderId: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Sender ID is required',
        },
        isUUID: {
          args: 4,
          msg: 'Sender ID must be a valid UUID',
        },
      },
    },
    templateId: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isUUID: {
          args: 4,
          msg: 'Template ID must be a valid UUID',
        },
      },
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
