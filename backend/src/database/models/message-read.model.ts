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
  ],
})
export class MessageRead extends Model<MessageReadAttributes, MessageReadCreationAttributes> {
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
  @Column({
    type: DataType.UUID,
    allowNull: false,
    comment: 'User who read the message',
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
}
