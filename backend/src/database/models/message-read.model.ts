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
import { Message } from './message.model';

/**
 * MessageRead attributes interface
 * Tracks when users have read specific messages
 */
export interface MessageReadAttributes {
  id?: string;
  messageId: string;
  userId: string;
  readAt: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface MessageReadCreationAttributes
  extends Optional<MessageReadAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

/**
 * MessageRead Model
 *
 * Tracks message read status for individual users.
 * Essential for:
 * - Unread count calculation
 * - Read receipts
 * - Message delivery confirmation
 * - User engagement analytics
 *
 * Design Considerations:
 * - Unique constraint on messageId + userId to prevent duplicates
 * - Indexed for fast unread count queries
 * - Separate from MessageDelivery for read vs delivery tracking
 *
 * Indexes:
 * - messageId + userId: Unique constraint and fast lookup
 * - userId: Fast lookup for user's read messages
 * - messageId: Fast lookup for who read a message
 */
@Scopes(() => ({
  active: {
    where: {
      deletedAt: null,
    },
    order: [['createdAt', 'DESC']],
  },
}))
@Table({
  tableName: 'message_reads',
  timestamps: true,
  underscored: false,
  indexes: [
    {
      unique: true,
      fields: ['messageId', 'userId'],
      name: 'message_reads_message_user_unique',
    },
    {
      fields: ['createdAt'],
      name: 'idx_message_read_created_at',
    },
    {
      fields: ['updatedAt'],
      name: 'idx_message_read_updated_at',
    },
  ],
})
export class MessageRead extends Model<
  MessageReadAttributes,
  MessageReadCreationAttributes
> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: string;

  @Index
  @ForeignKey(() => Message)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    comment: 'Message that was read',
  })
  declare messageId: string;

  @Index
  @ForeignKey(() => require('./user.model').User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    comment: 'User who read the message',
    references: {
      model: 'users',
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  declare userId: string;

  @Index
  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
    comment: 'Timestamp when message was read',
  })
  declare readAt: Date;

  @BelongsTo(() => Message, { foreignKey: 'messageId', as: 'message' })
  declare message?: Message;

  @BelongsTo(() => require('./user.model').User, {
    foreignKey: 'userId',
    as: 'user',
  })
  declare user?: any;

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

  // Hooks for HIPAA compliance
  @BeforeCreate
  @BeforeUpdate
  static async auditPHIAccess(instance: MessageRead) {
    if (instance.changed()) {
      const changedFields = instance.changed() as string[];
      console.log(
        `[AUDIT] MessageRead ${instance.id} modified at ${new Date().toISOString()}`,
      );
      console.log(`[AUDIT] Changed fields: ${changedFields.join(', ')}`);
      // TODO: Integrate with AuditLog service for persistent audit trail
    }
  }
}
