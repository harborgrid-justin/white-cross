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
} ,
  Scopes,
  BeforeCreate,
  BeforeUpdate
  } from 'sequelize-typescript';
import { Optional } from 'sequelize';
import { Conversation } from './conversation.model';

/**
 * Participant role enumeration
 * Defines permission levels for conversation participants
 */
export enum ParticipantRole {
  OWNER = 'OWNER',
  ADMIN = 'ADMIN',
  MEMBER = 'MEMBER',
  VIEWER = 'VIEWER',
}

/**
 * ConversationParticipant attributes interface
 * Represents a user's membership in a conversation
 */
export interface ConversationParticipantAttributes {
  id?: string;
  conversationId: string;
  userId: string;
  role: ParticipantRole;
  joinedAt: Date;
  lastReadAt?: Date;
  isMuted: boolean;
  isPinned: boolean;
  customName?: string;
  notificationPreference: 'ALL' | 'MENTIONS' | 'NONE';
  metadata?: Record<string, any>;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ConversationParticipantCreationAttributes
  extends Optional<
    ConversationParticipantAttributes,
    'id' | 'lastReadAt' | 'isMuted' | 'isPinned' | 'customName' | 'notificationPreference' | 'metadata' | 'createdAt' | 'updatedAt'
  > {}

/**
 * ConversationParticipant Model
 *
 * Manages user membership in conversations with role-based permissions.
 *
 * Features:
 * - Role-based access control (Owner, Admin, Member, Viewer)
 * - Read tracking for unread count calculation
 * - Mute and pin functionality
 * - Custom display names for participants
 * - Notification preferences per conversation
 * - Join timestamp for participant history
 *
 * Indexes:
 * - conversationId + userId: Fast lookup for participant access
 * - userId: Fast lookup for user's conversations
 * - conversationId: Fast lookup for conversation members
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
  tableName: 'conversation_participants',
  timestamps: true,
  underscored: false,
  indexes: [
    {
      unique: true,
      fields: ['conversationId', 'userId'],
      name: 'conversation_participants_conversation_user_unique',
    },,
    {
      fields: ['createdAt'],
      name: 'idx_conversation_participant_created_at'
    },
    {
      fields: ['updatedAt'],
      name: 'idx_conversation_participant_updated_at'
    }
  ],
})
export class ConversationParticipant extends Model<
  ConversationParticipantAttributes,
  ConversationParticipantCreationAttributes
> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: string;

  @Index
  @ForeignKey(() => Conversation)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare conversationId: string;

  @Index
  @Column({
    type: DataType.UUID,
    allowNull: false,
    comment: 'User ID who is a participant',
  })
  declare userId: string;

  @Column({
    type: DataType.STRING(50),
    validate: {
      isIn: [Object.values(ParticipantRole)]
    },
    allowNull: false,
    defaultValue: ParticipantRole.MEMBER,
    comment: 'Role determining permissions in conversation',
  })
  declare role: ParticipantRole;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
    comment: 'Timestamp when user joined the conversation',
  })
  declare joinedAt: Date;

  @Index
  @Column({
    type: DataType.DATE,
    allowNull: true,
    comment: 'Timestamp of last message read by this participant',
  })
  declare lastReadAt?: Date;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    comment: 'Whether notifications are muted for this conversation',
  })
  declare isMuted: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    comment: 'Whether conversation is pinned to top of list',
  })
  declare isPinned: boolean;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
    comment: 'Custom display name for this participant in the conversation',
  })
  declare customName?: string;

  @Column({
    type: DataType.ENUM('ALL', 'MENTIONS', 'NONE'),
    allowNull: false,
    defaultValue: 'ALL',
    comment: 'Notification preference for this conversation',
  })
  declare notificationPreference: 'ALL' | 'MENTIONS' | 'NONE';

  @Column({
    type: DataType.JSONB,
    allowNull: true,
    defaultValue: {},
    comment: 'Extensible metadata field',
  })
  declare metadata?: Record<string, any>;

  @BelongsTo(() => Conversation, { foreignKey: 'conversationId', as: 'conversation' })
  declare conversation?: Conversation;

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
  static async auditPHIAccess(instance: ConversationParticipant) {
    if (instance.changed()) {
      const changedFields = instance.changed() as string[];
      console.log(`[AUDIT] ConversationParticipant ${instance.id} modified at ${new Date().toISOString()}`);
      console.log(`[AUDIT] Changed fields: ${changedFields.join(', ')}`);
      // TODO: Integrate with AuditLog service for persistent audit trail
    }
  }
}
