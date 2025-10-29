import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  HasMany,
  Index,
  DeletedAt,
} from 'sequelize-typescript';
import { Optional } from 'sequelize';
import { ConversationParticipant } from './conversation-participant.model';

/**
 * Conversation type enumeration
 * - DIRECT: One-to-one conversation between two users
 * - GROUP: Group conversation with multiple participants
 * - CHANNEL: Broadcast channel with many participants
 */
export enum ConversationType {
  DIRECT = 'DIRECT',
  GROUP = 'GROUP',
  CHANNEL = 'CHANNEL',
}

/**
 * Conversation attributes interface
 * Represents a conversation container for messages between participants
 */
export interface ConversationAttributes {
  id?: string;
  type: ConversationType;
  name?: string;
  description?: string;
  avatarUrl?: string;
  tenantId: string;
  createdById: string;
  lastMessageAt?: Date;
  metadata?: Record<string, any>;
  isArchived: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export interface ConversationCreationAttributes
  extends Optional<
    ConversationAttributes,
    'id' | 'name' | 'description' | 'avatarUrl' | 'lastMessageAt' | 'metadata' | 'isArchived' | 'createdAt' | 'updatedAt' | 'deletedAt'
  > {}

/**
 * Conversation Model
 *
 * Manages conversation containers for messaging. Supports:
 * - Direct (1-to-1) conversations
 * - Group conversations with multiple participants
 * - Broadcast channels
 *
 * Features:
 * - Multi-tenant isolation via tenantId
 * - Soft delete support for data retention
 * - Metadata field for extensibility
 * - Archive functionality
 * - Last message tracking for sorting
 */
@Table({
  tableName: 'conversations',
  timestamps: true,
  paranoid: true,
  underscored: true,
})
export class Conversation extends Model<ConversationAttributes, ConversationCreationAttributes> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: string;

  @Index
  @Column({
    type: DataType.ENUM(...(Object.values(ConversationType) as string[])),
    allowNull: false,
  })
  declare type: ConversationType;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
    comment: 'Display name for group conversations and channels',
  })
  declare name?: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    comment: 'Description for group conversations and channels',
  })
  declare description?: string;

  @Column({
    type: DataType.STRING(500),
    allowNull: true,
    comment: 'Avatar/profile image URL',
  })
  declare avatarUrl?: string;

  @Index
  @Column({
    type: DataType.UUID,
    allowNull: false,
    comment: 'Tenant ID for multi-tenant isolation',
  })
  declare tenantId: string;

  @Index
  @Column({
    type: DataType.UUID,
    allowNull: false,
    comment: 'User who created the conversation',
  })
  declare createdById: string;

  @Index
  @Column({
    type: DataType.DATE,
    allowNull: true,
    comment: 'Timestamp of last message for sorting',
  })
  declare lastMessageAt?: Date;

  @Column({
    type: DataType.JSONB,
    allowNull: true,
    defaultValue: {},
    comment: 'Extensible metadata field for additional properties',
  })
  declare metadata?: Record<string, any>;

  @Index
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    comment: 'Whether the conversation is archived',
  })
  declare isArchived: boolean;

  @HasMany(() => ConversationParticipant, { foreignKey: 'conversationId', as: 'participants' })
  declare participants?: ConversationParticipant[];

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
    comment: 'Soft delete timestamp',
  })
  declare deletedAt?: Date;
}
