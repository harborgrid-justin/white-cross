import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  ForeignKey,
  BelongsTo,
  HasMany,
  Index,
  DeletedAt,
  Scopes,
  BeforeCreate,
  BeforeUpdate,
} from 'sequelize-typescript';
import { Optional } from 'sequelize';

export enum MessagePriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

export enum MessageCategory {
  EMERGENCY = 'EMERGENCY',
  HEALTH_UPDATE = 'HEALTH_UPDATE',
  APPOINTMENT_REMINDER = 'APPOINTMENT_REMINDER',
  MEDICATION_REMINDER = 'MEDICATION_REMINDER',
  GENERAL = 'GENERAL',
  INCIDENT_NOTIFICATION = 'INCIDENT_NOTIFICATION',
  COMPLIANCE = 'COMPLIANCE',
}

export interface MessageAttributes {
  id?: string;
  conversationId?: string;
  subject?: string;
  content: string;
  encryptedContent?: string;
  isEncrypted: boolean;
  encryptionMetadata?: Record<string, any>;
  encryptionVersion?: string;
  priority: MessagePriority;
  category: MessageCategory;
  recipientCount: number;
  scheduledAt?: Date;
  attachments: string[];
  senderId: string;
  templateId?: string;
  parentId?: string;
  threadId?: string;
  isEdited: boolean;
  editedAt?: Date;
  metadata?: Record<string, any>;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export interface MessageCreationAttributes
  extends Optional<
    MessageAttributes,
    | 'id'
    | 'conversationId'
    | 'subject'
    | 'encryptedContent'
    | 'isEncrypted'
    | 'encryptionMetadata'
    | 'encryptionVersion'
    | 'scheduledAt'
    | 'templateId'
    | 'parentId'
    | 'threadId'
    | 'isEdited'
    | 'editedAt'
    | 'metadata'
    | 'createdAt'
    | 'updatedAt'
    | 'deletedAt'
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
  tableName: 'messages',
  timestamps: true,
  paranoid: true,
  underscored: false,
  indexes: [
    {
      fields: ['createdAt'],
      name: 'idx_message_created_at',
    },
    {
      fields: ['updatedAt'],
      name: 'idx_message_updated_at',
    },
  ],
})
export class Message extends Model<
  MessageAttributes,
  MessageCreationAttributes
> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: string;

  @Index
  @ForeignKey(() => require('./conversation.model').Conversation)
  @Column({
    type: DataType.UUID,
    allowNull: true,
    comment: 'Conversation this message belongs to (for chat messages)',
    references: {
      model: 'conversations',
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  declare conversationId?: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
    comment: 'Message subject (for broadcast messages)',
  })
  declare subject?: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
    comment: 'Plain text message content',
  })
  declare content: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    comment: 'Encrypted message content for E2E encryption',
  })
  declare encryptedContent?: string;

  @Index
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    comment: 'Whether the message content is encrypted (E2E encryption)',
  })
  declare isEncrypted: boolean;

  @Column({
    type: DataType.JSONB,
    allowNull: true,
    comment:
      'Encryption metadata including algorithm, IV, auth tag, and key ID',
  })
  declare encryptionMetadata?: Record<string, any>;

  @Column({
    type: DataType.STRING(20),
    allowNull: true,
    comment: 'Encryption version for backward compatibility (e.g., "1.0.0")',
  })
  declare encryptionVersion?: string;

  @Column({
    type: DataType.STRING(50),
    validate: {
      isIn: [Object.values(MessagePriority)],
    },
    allowNull: false,
    defaultValue: MessagePriority.MEDIUM,
  })
  declare priority: MessagePriority;

  @Index
  @Column({
    type: DataType.STRING(50),
    validate: {
      isIn: [Object.values(MessageCategory)],
    },
    allowNull: false,
    defaultValue: MessageCategory.GENERAL,
  })
  declare category: MessageCategory;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
    comment: 'Number of recipients for broadcast messages',
  })
  declare recipientCount: number;

  @Index
  @Column({
    type: DataType.DATE,
    allowNull: true,
    comment: 'Scheduled delivery time for future messages',
  })
  declare scheduledAt?: Date;

  @Column({
    type: DataType.ARRAY(DataType.STRING(255)),
    allowNull: false,
    defaultValue: [],
    comment: 'Array of attachment URLs',
  })
  declare attachments: string[];

  @Index
  @ForeignKey(() => require('./user.model').User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    comment: 'User who sent the message',
  })
  declare senderId: string;

  @BelongsTo(() => require('./user.model').User, {
    foreignKey: 'senderId',
    as: 'sender',
  })
  declare sender?: any;

  @BelongsTo(() => require('./conversation.model').Conversation, {
    foreignKey: 'conversationId',
    as: 'conversation',
  })
  declare conversation?: any;

  @HasMany(() => require('./message-read.model').MessageRead, {
    foreignKey: 'messageId',
    as: 'messageReads',
  })
  declare messageReads?: any[];

  @HasMany(() => require('./message-reaction.model').MessageReaction, {
    foreignKey: 'messageId',
    as: 'messageReactions',
  })
  declare messageReactions?: any[];

  @HasMany(() => require('./message-delivery.model').MessageDelivery, {
    foreignKey: 'messageId',
    as: 'messageDeliveries',
  })
  declare messageDeliveries?: any[];

  @Column({
    type: DataType.UUID,
    allowNull: true,
    comment: 'Template ID if using a message template',
  })
  declare templateId?: string;

  @Index
  @Column({
    type: DataType.UUID,
    allowNull: true,
    comment: 'Parent message ID for threaded replies',
  })
  declare parentId?: string;

  @Index
  @Column({
    type: DataType.UUID,
    allowNull: true,
    comment: 'Thread root message ID for grouping related messages',
  })
  declare threadId?: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    comment: 'Whether the message has been edited',
  })
  declare isEdited: boolean;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    comment: 'Timestamp of last edit',
  })
  declare editedAt?: Date;

  @Column({
    type: DataType.JSONB,
    allowNull: true,
    defaultValue: {},
    comment: 'Extensible metadata field for additional properties',
  })
  declare metadata?: Record<string, any>;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
  })
  declare createdAt: Date;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
  })
  declare updatedAt: Date;

  @DeletedAt
  @Column({
    type: DataType.DATE,
    allowNull: true,
    comment: 'Soft delete timestamp for data retention',
  })
  declare deletedAt?: Date;

  // Hooks for HIPAA compliance
  @BeforeCreate
  @BeforeUpdate
  static async auditPHIAccess(instance: Message) {
    if (instance.changed()) {
      const changedFields = instance.changed() as string[];
      console.log(
        `[AUDIT] Message ${instance.id} modified at ${new Date().toISOString()}`,
      );
      console.log(`[AUDIT] Changed fields: ${changedFields.join(', ')}`);
      // TODO: Integrate with AuditLog service for persistent audit trail
    }
  }
}
