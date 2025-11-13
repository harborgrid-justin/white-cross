import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { Conversation, ConversationType } from '../../database/models/conversation.model';
import { ConversationParticipant } from '../../database/models/conversation-participant.model';
import { Message } from '../../database/models/message.model';
import { EncryptionService } from '../../infrastructure/encryption/encryption.service';
import { QueueIntegrationHelper } from '../helpers/queue-integration.helper';
import { SendDirectMessageDto } from '../dto/send-direct-message.dto';
import { SendGroupMessageDto } from '../dto/send-group-message.dto';
import { BaseService } from '@/common/base';
import {
  SendDirectMessageResponse,
  SendGroupMessageResponse,
} from '../types/message-response.types';

/**
 * MessageSenderService
 *
 * Handles sending messages (direct and group) with encryption and queue integration.
 *
 * Responsibilities:
 * - Send direct messages (1-to-1)
 * - Send group messages (1-to-many)
 * - Handle message encryption
 * - Queue messages for delivery
 * - Manage conversation creation/lookup
 */
@Injectable()
export class MessageSenderService extends BaseService {
  constructor(
    @InjectModel(Message) private messageModel: typeof Message,
    @InjectModel(Conversation) private conversationModel: typeof Conversation,
    @InjectModel(ConversationParticipant)
    private participantModel: typeof ConversationParticipant,
    private readonly encryptionService: EncryptionService,
    private readonly queueHelper: QueueIntegrationHelper,
  ) {}

  /**
   * Send a direct message (1-to-1)
   */
  async sendDirectMessage(
    dto: SendDirectMessageDto,
    senderId: string,
    tenantId: string,
  ): Promise<SendDirectMessageResponse> {
    this.logInfo(`Sending direct message from ${senderId} to ${dto.recipientId}`);

    // Validate recipient exists
    this.validateUser(dto.recipientId);

    // Find or create direct conversation
    const conversation = await this.findOrCreateDirectConversation(
      senderId,
      dto.recipientId,
      tenantId,
    );

    // Create and send message
    return this.createMessage(dto, senderId, conversation, {
      recipientId: dto.recipientId,
      priority: 'HIGH', // Direct messages are high priority
      recipientCount: 1,
    });
  }

  /**
   * Send a group message (1-to-many)
   */
  async sendGroupMessage(
    dto: SendGroupMessageDto,
    senderId: string,
    tenantId: string,
  ): Promise<SendGroupMessageResponse> {
    this.logInfo(`Sending group message to conversation ${dto.conversationId}`);

    // Get conversation and verify it exists
    const conversation = await this.conversationModel.findOne({
      where: { id: dto.conversationId, tenantId },
    });

    if (!conversation) {
      throw new BadRequestException('Conversation not found');
    }

    // Get all participants
    const participants = await this.participantModel.findAll({
      where: { conversationId: conversation.id },
    });

    // Get recipient IDs (exclude sender)
    const recipientIds = participants.filter((p) => p.userId !== senderId).map((p) => p.userId);

    // Create and send message
    const result = await this.createMessage(dto, senderId, conversation, {
      recipientIds,
      priority: 'MEDIUM',
      recipientCount: recipientIds.length,
      metadata: {
        ...dto.metadata,
        mentions: dto.mentions || [],
      },
    });

    return {
      ...result,
      recipientCount: recipientIds.length,
      queueStatus: {
        ...result.queueStatus,
        recipientCount: recipientIds.length,
      },
    };
  }

  /**
   * Create and send a message with common logic
   */
  private async createMessage(
    dto: SendDirectMessageDto | SendGroupMessageDto,
    senderId: string,
    conversation: Conversation,
    options: {
      recipientId?: string;
      recipientIds?: string[];
      priority: 'HIGH' | 'MEDIUM';
      recipientCount: number;
      metadata?: Record<string, any>;
    },
  ): Promise<SendDirectMessageResponse | SendGroupMessageResponse> {
    // Verify sender is a participant
    const isParticipant = await this.isConversationParticipant(conversation.id, senderId);
    if (!isParticipant) {
      throw new BadRequestException('You are not a participant in this conversation');
    }

    // Encrypt content if requested
    let encryptedContent: string | undefined;
    if (dto.encrypted) {
      const encryptionResult = await this.encryptionService.encrypt(dto.content);
      if (encryptionResult.success) {
        encryptedContent = encryptionResult.data;
      } else {
        throw new BadRequestException(`Encryption failed: ${encryptionResult.message}`);
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
      recipientCount: options.recipientCount,
      priority: options.priority,
      category: 'GENERAL',
      attachments: dto.attachments || [],
      parentId: dto.parentId,
      threadId,
      metadata: options.metadata || dto.metadata || {},
      isEdited: false,
    });

    // Update conversation's last message timestamp
    await conversation.update({ lastMessageAt: new Date() });

    // Queue message for delivery
    const queueResult = await this.queueHelper.queueMessageWorkflow({
      messageId: message.id,
      senderId,
      ...(options.recipientId && { recipientId: options.recipientId }),
      ...(options.recipientIds && { recipientIds: options.recipientIds }),
      conversationId: conversation.id,
      content: dto.content,
      encrypted: dto.encrypted,
      attachments: dto.attachments,
      priority: options.priority,
      metadata: options.metadata || dto.metadata,
    });

    const jobIds = Object.keys(queueResult.jobIds).join(', ');
    this.logInfo(
      `Message ${message.id} queued for delivery. Jobs: ${jobIds}`,
    );

    return {
      message,
      conversation,
      queueStatus: {
        queued: queueResult.success,
        jobIds: queueResult.jobIds,
        errors: queueResult.errors,
      },
    };
  }

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
          required: true,
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
   * Validate that a user exists (placeholder - implement based on your user service)
   */
  private validateUser(userId: string): void {
    // TODO: Implement user validation via UserService
    // For now, assume user exists
    this.logDebug(`Validating user ${userId}`);
  }
}