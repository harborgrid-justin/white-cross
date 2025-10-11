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
      validate: {
        isIn: {
          args: [Object.values(RecipientType)],
          msg: 'Invalid recipient type',
        },
      },
    },
    recipientId: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Recipient ID is required',
        },
        isUUID: {
          args: 4,
          msg: 'Recipient ID must be a valid UUID',
        },
      },
    },
    channel: {
      type: DataTypes.ENUM(...Object.values(MessageType)),
      allowNull: false,
      validate: {
        isIn: {
          args: [Object.values(MessageType)],
          msg: 'Invalid communication channel',
        },
      },
    },
    status: {
      type: DataTypes.ENUM(...Object.values(DeliveryStatus)),
      allowNull: false,
      validate: {
        isIn: {
          args: [Object.values(DeliveryStatus)],
          msg: 'Invalid delivery status',
        },
      },
    },
    contactInfo: {
      type: DataTypes.STRING(500),
      allowNull: true,
      validate: {
        len: {
          args: [0, 500],
          msg: 'Contact info cannot exceed 500 characters',
        },
        validContactInfo(value: string) {
          if (!value) return;

          // Validate based on channel type
          const channel = this.channel;

          if (channel === MessageType.EMAIL) {
            const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
            if (!emailRegex.test(value)) {
              throw new Error('Invalid email address format for EMAIL channel');
            }
            if (value.length > 254) {
              throw new Error('Email address exceeds maximum length of 254 characters');
            }
          } else if (channel === MessageType.SMS || channel === MessageType.VOICE) {
            const phoneRegex = /^\+?[1-9]\d{9,14}$/;
            const cleaned = value.replace(/[\s\-\(\)\.]/g, '');
            if (cleaned.length < 10 || cleaned.length > 15) {
              throw new Error('Phone number must be between 10 and 15 digits');
            }
            if (!phoneRegex.test(cleaned)) {
              throw new Error('Invalid phone number format (use E.164 format: +1234567890)');
            }
            // Verify country code for international numbers
            if (cleaned.startsWith('+') && cleaned.length < 11) {
              throw new Error('International phone numbers must include country code');
            }
          } else if (channel === MessageType.PUSH_NOTIFICATION) {
            if (value.length < 10) {
              throw new Error('Invalid push token format (minimum 10 characters)');
            }
          }
        },
        requiredForChannel(value: string) {
          // Ensure contact info is present when status is not FAILED
          if (!value && this.status !== DeliveryStatus.FAILED && this.status !== DeliveryStatus.PENDING) {
            throw new Error('Contact information is required for message delivery');
          }
        },
      },
    },
    sentAt: {
      type: DataTypes.DATE,
      allowNull: true,
      validate: {
        isDate: {
          msg: 'Sent time must be a valid date',
        },
        sentBeforeDelivered(value: Date) {
          if (value && this.deliveredAt && new Date(value) > new Date(this.deliveredAt)) {
            throw new Error('Sent time cannot be after delivered time');
          }
        },
      },
    },
    deliveredAt: {
      type: DataTypes.DATE,
      allowNull: true,
      validate: {
        isDate: {
          msg: 'Delivered time must be a valid date',
        },
        deliveredAfterSent(value: Date) {
          if (value && this.sentAt && new Date(value) < new Date(this.sentAt)) {
            throw new Error('Delivered time cannot be before sent time');
          }
        },
        deliveredRequiresSuccess(value: Date) {
          if (value && this.status !== DeliveryStatus.DELIVERED) {
            throw new Error('Delivered time can only be set when status is DELIVERED');
          }
        },
      },
    },
    failureReason: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate: {
        len: {
          args: [0, 5000],
          msg: 'Failure reason cannot exceed 5000 characters',
        },
        failureReasonRequiresFailedStatus(value: string) {
          if (value && this.status !== DeliveryStatus.FAILED && this.status !== DeliveryStatus.BOUNCED) {
            throw new Error('Failure reason can only be set when status is FAILED or BOUNCED');
          }
        },
      },
    },
    externalId: {
      type: DataTypes.STRING(255),
      allowNull: true,
      validate: {
        len: {
          args: [0, 255],
          msg: 'External ID cannot exceed 255 characters',
        },
      },
    },
    messageId: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Message ID is required',
        },
        isUUID: {
          args: 4,
          msg: 'Message ID must be a valid UUID',
        },
      },
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
