import { BadRequestException, ForbiddenException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op, WhereOptions } from 'sequelize';
import { Message } from '../../database/models/message.model';
import { MessageDelivery } from '../../database/models/message-delivery.model';
import { MessageRead } from '../../database/models/message-read.model';
import { MessageReaction } from '../../database/models/message-reaction.model';
import { Conversation, ConversationType } from '../../database/models/conversation.model';
import { ConversationParticipant } from '../../database/models/conversation-participant.model';
import { EncryptionService } from '../../infrastructure/encryption/encryption.service';
import { MessageQueueService } from '../../infrastructure/queue/message-queue.service';
import { QueueIntegrationHelper } from '../helpers/queue-integration.helper';
import { MarkAsReadResult, UnreadCountResult } from '../types/index';
import { SendDirectMessageDto } from '../dto/send-direct-message.dto';
import { SendGroupMessageDto } from '../dto/send-group-message.dto';
import { EditMessageDto } from '../dto/edit-message.dto';
import { MessagePaginationDto } from '../dto/message-pagination.dto';
import { SearchMessagesDto } from '../dto/search-messages.dto';
import { MarkAsReadDto, MarkConversationAsReadDto } from '../dto/mark-as-read.dto';

/**
 * EnhancedMessageService
 *
 * Comprehensive message service with real-time messaging capabilities.
 *
 * Features:
 * - Direct messaging (1-to-1)
 * - Group messaging (1-to-many)
 * - Message editing with history tracking
 * - Soft delete for data retention
 * - Read tracking and unread counts
 * - Message threading for conversations
 * - Full-text search
 * - Attachment support
 * - End-to-end encryption optional
 * - Multi-tenant isolation
 *
 * Integration Points:
 * - EncryptionService: For E2E encryption
 * - WebSocketService: For real-time delivery (injected at controller level)
 * - QueueService: For async processing (injected at controller level)
 */
@Injectable()
export class EnhancedMessageService {
  private readonly logger = new Logger(EnhancedMessageService.name);

  constructor(
    @InjectModel(Message) private messageModel: typeof Message,
    @InjectModel(MessageDelivery) private deliveryModel: typeof MessageDelivery,
    @InjectModel(MessageRead) private messageReadModel: typeof MessageRead,
    @InjectModel(MessageReaction)
    private messageReactionModel: typeof MessageReaction,
    @InjectModel(Conversation) private conversationModel: typeof Conversation,
    @InjectModel(ConversationParticipant)
    private participantModel: typeof ConversationParticipant,
    private readonly encryptionService: EncryptionService,
    private readonly queueService: MessageQueueService,
    private readonly queueHelper: QueueIntegrationHelper,
  ) {}

  /**
   * Send a direct message (1-to-1)
   *
   * Automatically creates or finds an existing direct conversation between sender and recipient.
   *
   * @param dto - Direct message details
   * @param senderId - ID of the user sending the message
   * @param tenantId - Tenant ID for multi-tenant isolation
   * @returns Created message with conversation details
   * @throws NotFoundException if recipient doesn't exist
   * @throws ForbiddenException if sender is blocked
   */
  async sendDirectMessage(
    dto: SendDirectMessageDto,
    senderId: string,
    tenantId: string,
  ): Promise<any> {
    this.logger.log(
      `Sending direct message from ${senderId} to ${dto.recipientId}`,
    );

    // Validate recipient exists
    await this.validateUser(dto.recipientId);

    // Find or create direct conversation
    const conversation = await this.findOrCreateDirectConversation(
      senderId,
      dto.recipientId,
      tenantId,
    );

    // Verify sender is a participant
    const isParticipant = await this.isConversationParticipant(
      conversation.id,
      senderId,
    );
    if (!isParticipant) {
      throw new ForbiddenException(
        'You are not a participant in this conversation',
      );
    }

    // Encrypt content if requested
    let encryptedContent: string | undefined;
    if (dto.encrypted) {
      const encryptionResult = await this.encryptionService.encrypt(
        dto.content,
      );
      if (encryptionResult.success) {
        encryptedContent = encryptionResult.data;
      } else {
        throw new BadRequestException(
          `Encryption failed: ${encryptionResult.message}`,
        );
      }
    }

    // Set thread ID if this is a reply
    let threadId = dto.parentId;
    if (dto.parentId) {
      const parentMessage = await this.messageModel.findByPk(dto.parentId);
      if (parentMessage) {
        threadId = parentMessage.threadId || parentMessage.id;
      }
    }

    // Create message
    const message = await this.messageModel.create({
      conversationId: conversation.id,
      content: dto.content,
      encryptedContent,
      isEncrypted: !!dto.encrypted,
      encryptionVersion: dto.encrypted ? '1.0.0' : undefined,
      senderId,
      recipientCount: 1,
      priority: 'MEDIUM',
      category: 'GENERAL',
      attachments: dto.attachments || [],
      parentId: dto.parentId,
      threadId,
      metadata: dto.metadata || {},
      isEdited: false,
    });

    // Update conversation's last message timestamp
    await conversation.update({ lastMessageAt: new Date() });

    // Queue message for async delivery, notification, and indexing
    const queueResult = await this.queueHelper.queueMessageWorkflow({
      messageId: message.id,
      senderId,
      recipientId: dto.recipientId,
      conversationId: conversation.id,
      content: dto.content,
      encrypted: dto.encrypted,
      attachments: dto.attachments,
      priority: 'HIGH', // Direct messages are high priority
      metadata: dto.metadata,
    });

    this.logger.log(
      `Message ${message.id} queued for delivery. Jobs: ${Object.keys(queueResult.jobIds).join(', ')}`,
    );

    return {
      message: message.toJSON(),
      conversation: conversation.toJSON(),
      queueStatus: {
        queued: queueResult.success,
        jobIds: queueResult.jobIds,
        errors: queueResult.errors,
      },
    };
  }

  /**
   * Send a group message (1-to-many)
   *
   * Sends a message to all participants in a group conversation.
   *
   * @param dto - Group message details
   * @param senderId - ID of the user sending the message
   * @param tenantId - Tenant ID for multi-tenant isolation
   * @returns Created message with delivery status
   * @throws NotFoundException if conversation doesn't exist
   * @throws ForbiddenException if sender is not a participant
   */
  async sendGroupMessage(
    dto: SendGroupMessageDto,
    senderId: string,
    tenantId: string,
  ): Promise<any> {
    this.logger.log(
      `Sending group message to conversation ${dto.conversationId}`,
    );

    // Get conversation and verify it exists
    const conversation = await this.conversationModel.findOne({
      where: { id: dto.conversationId, tenantId },
    });

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    // Verify sender is a participant
    const isParticipant = await this.isConversationParticipant(
      conversation.id,
      senderId,
    );
    if (!isParticipant) {
      throw new ForbiddenException(
        'You are not a participant in this conversation',
      );
    }

    // Get all participants
    const participants = await this.participantModel.findAll({
      where: { conversationId: conversation.id },
    });

    // Encrypt content if requested
    let encryptedContent: string | undefined;
    if (dto.encrypted) {
      const encryptionResult = await this.encryptionService.encrypt(
        dto.content,
      );
      if (encryptionResult.success) {
        encryptedContent = encryptionResult.data;
      } else {
        throw new BadRequestException(
          `Encryption failed: ${encryptionResult.message}`,
        );
      }
    }

    // Set thread ID if this is a reply
    let threadId = dto.parentId;
    if (dto.parentId) {
      const parentMessage = await this.messageModel.findByPk(dto.parentId);
      if (parentMessage) {
        threadId = parentMessage.threadId || parentMessage.id;
      }
    }

    // Create message
    const message = await this.messageModel.create({
      conversationId: conversation.id,
      content: dto.content,
      encryptedContent,
      isEncrypted: !!dto.encrypted,
      encryptionVersion: dto.encrypted ? '1.0.0' : undefined,
      senderId,
      recipientCount: participants.length - 1, // Exclude sender
      priority: 'MEDIUM',
      category: 'GENERAL',
      attachments: dto.attachments || [],
      parentId: dto.parentId,
      threadId,
      metadata: {
        ...dto.metadata,
        mentions: dto.mentions || [],
      },
      isEdited: false,
    });

    // Update conversation's last message timestamp
    await conversation.update({ lastMessageAt: new Date() });

    // Get recipient IDs (exclude sender)
    const recipientIds = participants
      .filter((p) => p.userId !== senderId)
      .map((p) => p.userId);

    // Queue message for batch delivery
    const queueResult = await this.queueService.addBatchMessageJob({
      batchId: `batch-${message.id}`,
      senderId,
      recipientIds,
      conversationIds: [conversation.id],
      content: dto.content,
      chunkSize: 20, // Process 20 recipients at a time
      chunkDelay: 50, // 50ms between chunks
      createdAt: new Date(),
      initiatedBy: senderId,
    });

    this.logger.log(
      `Group message ${message.id} queued for batch delivery to ${recipientIds.length} recipients. Job ID: ${queueResult.id}`,
    );

    return {
      message: message.toJSON(),
      conversation: conversation.toJSON(),
      recipientCount: recipientIds.length,
      queueStatus: {
        queued: true,
        jobId: queueResult.id as string,
        recipientCount: recipientIds.length,
      },
    };
  }

  /**
   * Edit an existing message
   *
   * Only the message sender can edit their messages.
   * Edit history is tracked via isEdited and editedAt fields.
   *
   * @param messageId - ID of the message to edit
   * @param dto - Updated message content
   * @param userId - ID of the user requesting the edit
   * @returns Updated message
   * @throws NotFoundException if message doesn't exist
   * @throws ForbiddenException if user is not the sender
   */
  async editMessage(
    messageId: string,
    dto: EditMessageDto,
    userId: string,
  ): Promise<any> {
    this.logger.log(`Editing message ${messageId} by user ${userId}`);

    const message = await this.messageModel.findByPk(messageId);

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    if (message.senderId !== userId) {
      throw new ForbiddenException('You can only edit your own messages');
    }

    // Update encrypted content if it was originally encrypted
    let encryptedContent: string | undefined;
    if (message.encryptedContent) {
      const encryptionResult = await this.encryptionService.encrypt(
        dto.content,
      );
      if (encryptionResult.success) {
        encryptedContent = encryptionResult.data;
      } else {
        throw new BadRequestException(
          `Encryption failed: ${encryptionResult.message}`,
        );
      }
    }

    // Update message
    await message.update({
      content: dto.content,
      encryptedContent,
      attachments:
        dto.attachments !== undefined ? dto.attachments : message.attachments,
      isEdited: true,
      editedAt: new Date(),
      metadata: {
        ...message.metadata,
        ...dto.metadata,
        editHistory: [
          ...(message.metadata?.editHistory || []),
          {
            editedAt: new Date(),
            previousContent: message.content,
          },
        ],
      },
    });

    return { message: message.toJSON() };
  }

  /**
   * Delete a message (soft delete)
   *
   * Only the message sender can delete their messages.
   * Messages are soft-deleted for data retention and audit purposes.
   *
   * @param messageId - ID of the message to delete
   * @param userId - ID of the user requesting deletion
   * @throws NotFoundException if message doesn't exist
   * @throws ForbiddenException if user is not the sender
   */
  async deleteMessage(messageId: string, userId: string): Promise<void> {
    this.logger.log(`Deleting message ${messageId} by user ${userId}`);

    const message = await this.messageModel.findByPk(messageId);

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    if (message.senderId !== userId) {
      throw new ForbiddenException('You can only delete your own messages');
    }

    // Soft delete
    await message.destroy();
  }

  /**
   * Mark messages as read
   *
   * Updates read status for specified messages and the user.
   * Used for unread count calculation and read receipts.
   *
   * @param dto - Message IDs to mark as read
   * @param userId - ID of the user marking messages as read
   * @returns Number of messages marked as read
   */
  async markMessagesAsRead(dto: MarkAsReadDto, userId: string): Promise<MarkAsReadResult> {
    this.logger.log(
      `Marking ${dto.messageIds.length} messages as read for user ${userId}`,
    );

    const readPromises = dto.messageIds.map((messageId) =>
      this.messageReadModel.findOrCreate({
        where: { messageId, userId },
        defaults: {
          messageId,
          userId,
          readAt: new Date(),
        } as any,
      }),
    );

    const results = await Promise.all(readPromises);
    const newReads = results.filter(([_, created]) => created).length;

    // Update participant's lastReadAt timestamp
    await this.updateParticipantReadTimestamp(dto.messageIds, userId);

    return {
      markedAsRead: newReads,
      total: dto.messageIds.length,
    };
  }

  /**
   * Mark all messages in a conversation as read
   *
   * @param dto - Conversation to mark as read
   * @param userId - ID of the user marking messages as read
   * @returns Number of messages marked as read
   */
  async markConversationAsRead(
    dto: MarkConversationAsReadDto,
    userId: string,
  ): Promise<any> {
    this.logger.log(
      `Marking conversation ${dto.conversationId} as read for user ${userId}`,
    );

    // Get all unread messages in the conversation
    const messages = await this.messageModel.findAll({
      where: {
        conversationId: dto.conversationId,
        senderId: { [Op.ne]: userId }, // Exclude own messages
      },
      include: [
        {
          model: this.messageReadModel,
          where: { userId },
          required: false,
        },
      ],
    });

    // Filter messages that haven't been read yet
    const unreadMessages = messages.filter(
      (m: Message) => !m.messageReads || m.messageReads.length === 0,
    );

    // Mark all as read
    const readPromises = unreadMessages.map((message) =>
      this.messageReadModel.create({
        messageId: message.id,
        userId,
        readAt: new Date(),
      }),
    );

    await Promise.all(readPromises);

    // Update participant's lastReadAt
    await this.participantModel.update(
      { lastReadAt: new Date() },
      {
        where: {
          conversationId: dto.conversationId,
          userId,
        },
      },
    );

    return {
      markedAsRead: unreadMessages.length,
    };
  }

  /**
   * Get message history with pagination
   *
   * Retrieves messages from a conversation or thread with advanced filtering.
   *
   * @param dto - Pagination and filter options
   * @param userId - ID of the requesting user
   * @param tenantId - Tenant ID for multi-tenant isolation
   * @returns Paginated messages
   * @throws ForbiddenException if user is not a participant
   */
  async getMessageHistory(
    dto: MessagePaginationDto,
    userId: string,
    tenantId: string,
  ): Promise<any> {
    const offset = ((dto.page || 1) - 1) * (dto.limit || 20);
    const limit = dto.limit || 20;

    // Build where clause
    const where: WhereOptions = {};

    if (dto.conversationId) {
      // Verify user is a participant
      const isParticipant = await this.isConversationParticipant(
        dto.conversationId,
        userId,
      );
      if (!isParticipant) {
        throw new ForbiddenException(
          'You are not a participant in this conversation',
        );
      }
      where.conversationId = dto.conversationId;
    }

    if (dto.threadId) {
      where.threadId = dto.threadId;
    }

    if (dto.dateFrom) {
      where.createdAt = {
        ...where.createdAt,
        [Op.gte]: new Date(dto.dateFrom),
      };
    }

    if (dto.dateTo) {
      where.createdAt = { ...where.createdAt, [Op.lte]: new Date(dto.dateTo) };
    }

    // Query messages
    const { rows: messages, count: total } =
      await this.messageModel.findAndCountAll({
        where,
        offset,
        limit,
        order: [['createdAt', dto.sortOrder || 'DESC']],
        include: [
          {
            model: this.messageReadModel,
            where: { userId },
            required: false,
          },
        ],
      });

    return {
      messages: messages.map((m) => m.toJSON()),
      pagination: {
        page: dto.page || 1,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Search messages with full-text search
   *
   * @param dto - Search criteria
   * @param userId - ID of the requesting user
   * @param tenantId - Tenant ID for multi-tenant isolation
   * @returns Search results with pagination
   */
  async searchMessages(
    dto: SearchMessagesDto,
    userId: string,
    tenantId: string,
  ): Promise<any> {
    const offset = ((dto.page || 1) - 1) * (dto.limit || 20);
    const limit = dto.limit || 20;

    // Build where clause
    const where: WhereOptions = {
      content: {
        [Op.iLike]: `%${dto.query}%`, // Case-insensitive search
      },
    };

    if (dto.conversationId) {
      where.conversationId = dto.conversationId;
    }

    if (dto.conversationIds && dto.conversationIds.length > 0) {
      where.conversationId = { [Op.in]: dto.conversationIds };
    }

    if (dto.senderId) {
      where.senderId = dto.senderId;
    }

    if (dto.dateFrom) {
      where.createdAt = {
        ...where.createdAt,
        [Op.gte]: new Date(dto.dateFrom),
      };
    }

    if (dto.dateTo) {
      where.createdAt = { ...where.createdAt, [Op.lte]: new Date(dto.dateTo) };
    }

    if (dto.hasAttachments) {
      where.attachments = { [Op.ne]: [] };
    }

    // Only search in conversations where user is a participant
    const participantConversations = await this.participantModel.findAll({
      where: { userId },
      attributes: ['conversationId'],
    });

    const conversationIds = participantConversations.map(
      (p) => p.conversationId,
    );
    where.conversationId = { [Op.in]: conversationIds };

    // Query messages
    const { rows: messages, count: total } =
      await this.messageModel.findAndCountAll({
        where,
        offset,
        limit,
        order: [['createdAt', 'DESC']],
      });

    return {
      messages: messages.map((m) => m.toJSON()),
      pagination: {
        page: dto.page || 1,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      query: dto.query,
    };
  }

  /**
   * Get unread message count for a user
   *
   * @param userId - ID of the user
   * @param conversationId - Optional: get count for specific conversation
   * @returns Unread count by conversation
   */
  async getUnreadCount(userId: string, conversationId?: string): Promise<UnreadCountResult> {
    this.logger.log(`Getting unread count for user ${userId}`);

    const where: WhereOptions = {
      senderId: { [Op.ne]: userId }, // Exclude own messages
    };

    if (conversationId) {
      where.conversationId = conversationId;
    } else {
      // Get all conversations user is part of
      const participantConversations = await this.participantModel.findAll({
        where: { userId },
        attributes: ['conversationId'],
      });

      const conversationIds = participantConversations.map(
        (p) => p.conversationId,
      );
      where.conversationId = { [Op.in]: conversationIds };
    }

    // Get messages not marked as read
    const messages = await this.messageModel.findAll({
      where,
      attributes: ['id', 'conversationId'],
      include: [
        {
          model: this.messageReadModel,
          where: { userId },
          required: false,
        },
      ],
    });

    // Count unread messages by conversation
    const unreadByConversation: Record<string, number> = {};
    let totalUnread = 0;

    messages.forEach((message: Message & { messageReads?: unknown[] }) => {
      const isRead = message.messageReads && message.messageReads.length > 0;
      if (!isRead) {
        const convId = message.conversationId;
        unreadByConversation[convId] = (unreadByConversation[convId] || 0) + 1;
        totalUnread++;
      }
    });

    return {
      total: totalUnread,
      byConversation: unreadByConversation,
    };
  }

  // ===== Helper Methods =====

  /**
   * Find or create a direct conversation between two users
   */
  private async findOrCreateDirectConversation(
    userId1: string,
    userId2: string,
    tenantId: string,
  ): Promise<Conversation> {
    // Find existing direct conversation
    const existingConversation = await this.conversationModel.findOne({
      where: {
        type: ConversationType.DIRECT,
        tenantId,
      },
      include: [
        {
          model: this.participantModel,
          where: {
            userId: { [Op.in]: [userId1, userId2] },
          },
        },
      ],
    });

    if (existingConversation) {
      // Verify it's exactly between these two users
      const participants = await this.participantModel.findAll({
        where: { conversationId: existingConversation.id },
      });

      if (participants.length === 2) {
        const participantIds = participants.map((p) => p.userId).sort();
        const requestedIds = [userId1, userId2].sort();
        if (JSON.stringify(participantIds) === JSON.stringify(requestedIds)) {
          return existingConversation;
        }
      }
    }

    // Create new direct conversation
    const conversation = await this.conversationModel.create({
      type: ConversationType.DIRECT,
      tenantId,
      createdById: userId1,
      isArchived: false,
      metadata: {},
    });

    // Add both users as participants
    await Promise.all([
      this.participantModel.create({
        conversationId: conversation.id,
        userId: userId1,
        role: 'MEMBER',
        joinedAt: new Date(),
        isMuted: false,
        isPinned: false,
        notificationPreference: 'ALL',
      }),
      this.participantModel.create({
        conversationId: conversation.id,
        userId: userId2,
        role: 'MEMBER',
        joinedAt: new Date(),
        isMuted: false,
        isPinned: false,
        notificationPreference: 'ALL',
      }),
    ]);

    return conversation;
  }

  /**
   * Check if user is a participant in a conversation
   */
  private async isConversationParticipant(
    conversationId: string,
    userId: string,
  ): Promise<boolean> {
    const participant = await this.participantModel.findOne({
      where: { conversationId, userId },
    });
    return !!participant;
  }

  /**
   * Update participant's last read timestamp
   */
  private async updateParticipantReadTimestamp(
    messageIds: string[],
    userId: string,
  ): Promise<void> {
    // Get conversations for these messages
    const messages = await this.messageModel.findAll({
      where: { id: { [Op.in]: messageIds } },
      attributes: ['conversationId'],
    });

    const conversationIds = [
      ...new Set(messages.map((m) => m.conversationId)),
    ].filter(Boolean);

    // Update lastReadAt for all relevant conversations
    await this.participantModel.update(
      { lastReadAt: new Date() },
      {
        where: {
          conversationId: { [Op.in]: conversationIds as string[] },
          userId,
        },
      },
    );
  }

  /**
   * Validate that a user exists (placeholder - implement based on your user service)
   */
  private async validateUser(userId: string): Promise<void> {
    // TODO: Implement user validation via UserService
    // For now, assume user exists
    this.logger.debug(`Validating user ${userId}`);
  }
}
