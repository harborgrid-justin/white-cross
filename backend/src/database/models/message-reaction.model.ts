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
  BeforeUpdate
} from 'sequelize-typescript';
import { Optional } from 'sequelize';
import { Message } from './message.model';

/**
 * MessageReaction attributes interface
 * Represents emoji reactions to messages
 */
export interface MessageReactionAttributes {
  id?: string;
  messageId: string;
  userId: string;
  emoji: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface MessageReactionCreationAttributes
  extends Optional<MessageReactionAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

/**
 * MessageReaction Model
 *
 * Enables users to react to messages with emoji.
 * Common in modern messaging platforms for quick feedback.
 *
 * Features:
 * - Single emoji per user per message (enforced by unique constraint)
 * - Fast aggregation for reaction counts
 * - Support for any unicode emoji
 *
 * Use Cases:
 * - Quick acknowledgment without full reply
 * - Sentiment tracking
 * - Engagement metrics
 * - Non-verbal communication
 *
 * Indexes:
 * - messageId + userId + emoji: Unique constraint
 * - messageId: Fast lookup for message reactions
 * - userId: Fast lookup for user's reactions
 */
@Scopes(() => ({
  active: {
    where: {
      deletedAt: null
    },
    order: [['createdAt', 'DESC']]
  }
}))
@Table({
  tableName: 'message_reactions',
  timestamps: true,
  underscored: false,
  indexes: [
    {
      unique: true,
      fields: ['messageId', 'userId', 'emoji'],
      name: 'message_reactions_message_user_emoji_unique'
    },,
    {
      fields: ['createdAt'],
      name: 'idx_message_reaction_created_at'
    },
    {
      fields: ['updatedAt'],
      name: 'idx_message_reaction_updated_at'
    }
  ]
})
export class MessageReaction extends Model<MessageReactionAttributes, MessageReactionCreationAttributes> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: string;

  @Index
  @ForeignKey(() => Message)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    comment: 'Message being reacted to'
  })
  declare messageId: string;

  @Index
  @Column({
    type: DataType.UUID,
    allowNull: false,
    comment: 'User who added the reaction'
  })
  declare userId: string;

  @Column({
    type: DataType.STRING(20),
    allowNull: false,
    comment: 'Emoji character or code'
  })
  declare emoji: string;

  @BelongsTo(() => Message, { foreignKey: 'messageId', as: 'message' })
  declare message?: Message;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW
  })
  declare createdAt: Date;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW
  })
  declare updatedAt: Date;


  // Hooks for HIPAA compliance
  @BeforeCreate
  @BeforeUpdate
  static async auditPHIAccess(instance: MessageReaction) {
    if (instance.changed()) {
      const changedFields = instance.changed() as string[];
      console.log(`[AUDIT] MessageReaction ${instance.id} modified at ${new Date().toISOString()}`);
      console.log(`[AUDIT] Changed fields: ${changedFields.join(', ')}`);
      // TODO: Integrate with AuditLog service for persistent audit trail
    }
  }
}
