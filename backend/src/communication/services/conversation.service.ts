import {
  Injectable,
  Logger,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op, WhereOptions } from 'sequelize';
import {
  Conversation,
  ConversationType,
} from '../../database/models/conversation.model';
import {
  ConversationParticipant,
  ParticipantRole,
} from '../../database/models/conversation-participant.model';
import { ParticipantRole as ParticipantRoleEnum } from '../dto/conversation-participant.dto';
import { Message } from '../../database/models/message.model';
import {
  CreateConversationResult,
  GetConversationResult,
  ListConversationsResult,
  UpdateConversationResult,
  AddParticipantResult,
  UpdateParticipantResult,
  GetParticipantsResult,
} from '../types/conversation.types';
import { CreateConversationDto } from '../dto/create-conversation.dto';
import { UpdateConversationDto } from '../dto/update-conversation.dto';
import {
  AddParticipantDto,
  UpdateParticipantDto,
} from '../dto/conversation-participant.dto';

/**
 * ConversationService
 *
 * Manages conversation lifecycle and participants.
 *
 * Features:
 * - Create conversations (DIRECT, GROUP, CHANNEL)
 * - Update conversation metadata
 * - Archive/delete conversations
 * - Add/remove participants
 * - Update participant roles and settings
 * - List conversations with filtering
 * - Role-based access control
 *
 * Conversation Types:
 * - DIRECT: One-to-one conversations (exactly 2 participants)
 * - GROUP: Small group conversations (2-100 participants)
 * - CHANNEL: Large broadcast channels (unlimited participants)
 *
 * Permission Model:
 * - OWNER: Full control, can delete conversation
 * - ADMIN: Can manage participants, update settings
 * - MEMBER: Can send messages, view content
 * - VIEWER: Can only view content, cannot send messages
 */
@Injectable()
export class ConversationService {
  private readonly logger = new Logger(ConversationService.name);

  constructor(
    @InjectModel(Conversation) private conversationModel: typeof Conversation,
    @InjectModel(ConversationParticipant)
    private participantModel: typeof ConversationParticipant,
    @InjectModel(Message) private messageModel: typeof Message,
  ) {}

  /**
   * Create a new conversation
   *
   * @param dto - Conversation creation details
   * @param creatorId - ID of the user creating the conversation
   * @param tenantId - Tenant ID for multi-tenant isolation
   * @returns Created conversation with participants
   * @throws BadRequestException for validation errors
   */
  async createConversation(
    dto: CreateConversationDto,
    creatorId: string,
    tenantId: string,
  ): Promise<CreateConversationResult> {
    this.logger.log(`Creating ${dto.type} conversation by user ${creatorId}`);

    // Validate conversation type constraints
    this.validateConversationConstraints(dto);

    // Ensure creator is in participants list
    const creatorInList = dto.participants.some((p) => p.userId === creatorId);
    const participants = creatorInList
      ? dto.participants
      : [{ userId: creatorId, role: 'OWNER' }, ...dto.participants];

    // Create conversation
    const conversation = await this.conversationModel.create({
      type: dto.type,
      name: dto.name,
      description: dto.description,
      avatarUrl: dto.avatarUrl,
      tenantId,
      createdById: creatorId,
      isArchived: false,
      metadata: dto.metadata || {},
    });

    // Add participants
    const participantPromises = participants.map((participant) =>
      this.participantModel.create({
        conversationId: conversation.id,
        userId: participant.userId,
        role:
          participant.role ||
          (participant.userId === creatorId
            ? ParticipantRole.OWNER
            : ParticipantRole.MEMBER),
        joinedAt: new Date(),
        isMuted: false,
        isPinned: false,
        notificationPreference: 'ALL',
      }),
    );

    const createdParticipants = await Promise.all(participantPromises);

    return {
      conversation: conversation.toJSON(),
      participants: createdParticipants.map((p) => p.toJSON()),
    };
  }

  /**
   * Get conversation details
   *
   * @param conversationId - ID of the conversation
   * @param userId - ID of the requesting user
   * @param tenantId - Tenant ID for multi-tenant isolation
   * @returns Conversation with participants and metadata
   * @throws NotFoundException if conversation doesn't exist
   * @throws ForbiddenException if user is not a participant
   */
  async getConversation(
    conversationId: string,
    userId: string,
    tenantId: string,
  ): Promise<CreateConversationResult> {
    const conversation = await this.conversationModel.findOne({
      where: { id: conversationId, tenantId },
      include: [
        {
          model: this.participantModel,
          as: 'participants',
        },
      ],
    });

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    // Verify user is a participant
    const isParticipant = await this.isParticipant(conversationId, userId);
    if (!isParticipant) {
      throw new ForbiddenException(
        'You are not a participant in this conversation',
      );
    }

    // Get unread count for this user
    const unreadCount = await this.getConversationUnreadCount(
      conversationId,
      userId,
    );

    return {
      ...conversation.toJSON(),
      unreadCount,
    };
  }

  /**
   * List conversations for a user
   *
   * @param userId - ID of the user
   * @param tenantId - Tenant ID for multi-tenant isolation
   * @param options - Filtering options (archived, type)
   * @returns List of conversations with metadata
   */
  async listConversations(
    userId: string,
    tenantId: string,
    options: {
      includeArchived?: boolean;
      type?: ConversationType;
      page?: number;
      limit?: number;
    } = {},
  ): Promise<CreateConversationResult> {
    const page = options.page || 1;
    const limit = options.limit || 20;
    const offset = (page - 1) * limit;

    // Get user's conversation participations
    const participations = await this.participantModel.findAll({
      where: { userId },
      attributes: ['conversationId', 'isMuted', 'isPinned', 'lastReadAt'],
    });

    const conversationIds = participations.map((p) => p.conversationId);

    if (conversationIds.length === 0) {
      return {
        conversations: [],
        pagination: { page, limit, total: 0, pages: 0 },
      };
    }

    // Build where clause
    const where: WhereOptions = {
      id: { [Op.in]: conversationIds },
      tenantId,
    };

    if (!options.includeArchived) {
      where.isArchived = false;
    }

    if (options.type) {
      where.type = options.type;
    }

    // Get conversations
    const { rows: conversations, count: total } =
      await this.conversationModel.findAndCountAll({
        where,
        include: [
          {
            model: this.participantModel,
            as: 'participants',
          },
        ],
        order: [
          ['lastMessageAt', 'DESC NULLS LAST'],
          ['createdAt', 'DESC'],
        ],
        offset,
        limit,
      });

    // Enrich with user-specific data
    const enrichedConversations = await Promise.all(
      conversations.map(async (conv) => {
        const participation = participations.find(
          (p) => p.conversationId === conv.id,
        );
        const unreadCount = await this.getConversationUnreadCount(
          conv.id,
          userId,
        );

        return {
          ...conv.toJSON(),
          userSettings: {
            isMuted: participation?.isMuted || false,
            isPinned: participation?.isPinned || false,
            lastReadAt: participation?.lastReadAt,
          },
          unreadCount,
        };
      }),
    );

    // Sort pinned conversations first
    enrichedConversations.sort((a, b) => {
      if (a.userSettings.isPinned && !b.userSettings.isPinned) return -1;
      if (!a.userSettings.isPinned && b.userSettings.isPinned) return 1;
      return 0;
    });

    return {
      conversations: enrichedConversations,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Update conversation details
   *
   * Only OWNER and ADMIN can update conversation details.
   *
   * @param conversationId - ID of the conversation
   * @param dto - Updated conversation details
   * @param userId - ID of the requesting user
   * @param tenantId - Tenant ID for multi-tenant isolation
   * @returns Updated conversation
   * @throws NotFoundException if conversation doesn't exist
   * @throws ForbiddenException if user doesn't have permission
   */
  async updateConversation(
    conversationId: string,
    dto: UpdateConversationDto,
    userId: string,
    tenantId: string,
  ): Promise<CreateConversationResult> {
    const conversation = await this.conversationModel.findOne({
      where: { id: conversationId, tenantId },
    });

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    // Check permissions
    await this.checkPermission(conversationId, userId, [
      ParticipantRoleEnum.OWNER,
      ParticipantRoleEnum.ADMIN,
    ]);

    // Update conversation
    await conversation.update({
      name: dto.name !== undefined ? dto.name : conversation.name,
      description:
        dto.description !== undefined
          ? dto.description
          : conversation.description,
      avatarUrl:
        dto.avatarUrl !== undefined ? dto.avatarUrl : conversation.avatarUrl,
      isArchived:
        dto.isArchived !== undefined ? dto.isArchived : conversation.isArchived,
      metadata:
        dto.metadata !== undefined
          ? { ...conversation.metadata, ...dto.metadata }
          : conversation.metadata,
    });

    return { conversation: conversation.toJSON() };
  }

  /**
   * Delete (soft delete) a conversation
   *
   * Only OWNER can delete conversations.
   *
   * @param conversationId - ID of the conversation
   * @param userId - ID of the requesting user
   * @param tenantId - Tenant ID for multi-tenant isolation
   * @throws NotFoundException if conversation doesn't exist
   * @throws ForbiddenException if user is not the owner
   */
  async deleteConversation(
    conversationId: string,
    userId: string,
    tenantId: string,
  ): Promise<void> {
    const conversation = await this.conversationModel.findOne({
      where: { id: conversationId, tenantId },
    });

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    // Check permissions - only owner can delete
    await this.checkPermission(conversationId, userId, [
      ParticipantRoleEnum.OWNER,
    ]);

    // Soft delete conversation
    await conversation.destroy();

    this.logger.log(`Conversation ${conversationId} deleted by user ${userId}`);
  }

  /**
   * Add a participant to a conversation
   *
   * Only OWNER and ADMIN can add participants.
   *
   * @param conversationId - ID of the conversation
   * @param dto - Participant details
   * @param requesterId - ID of the user making the request
   * @param tenantId - Tenant ID for multi-tenant isolation
   * @returns Added participant
   * @throws BadRequestException if participant already exists
   * @throws ForbiddenException if requester doesn't have permission
   */
  async addParticipant(
    conversationId: string,
    dto: AddParticipantDto,
    requesterId: string,
    tenantId: string,
  ): Promise<CreateConversationResult> {
    this.logger.log(
      `Adding participant ${dto.userId} to conversation ${conversationId}`,
    );

    // Verify conversation exists
    const conversation = await this.conversationModel.findOne({
      where: { id: conversationId, tenantId },
    });

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    // Check permissions
    await this.checkPermission(conversationId, requesterId, [
      ParticipantRoleEnum.OWNER,
      ParticipantRoleEnum.ADMIN,
    ]);

    // Validate for direct conversations
    if (conversation.type === ConversationType.DIRECT) {
      throw new BadRequestException(
        'Cannot add participants to direct conversations',
      );
    }

    // Check if participant already exists
    const existingParticipant = await this.participantModel.findOne({
      where: { conversationId, userId: dto.userId },
    });

    if (existingParticipant) {
      throw new BadRequestException('User is already a participant');
    }

    // Add participant
    const participant = await this.participantModel.create({
      conversationId,
      userId: dto.userId,
      role: dto.role || ParticipantRole.MEMBER,
      joinedAt: new Date(),
      isMuted: false,
      isPinned: false,
      notificationPreference: 'ALL',
    });

    return { participant: participant.toJSON() };
  }

  /**
   * Remove a participant from a conversation
   *
   * OWNER and ADMIN can remove members.
   * Users can remove themselves.
   * Cannot remove the owner.
   *
   * @param conversationId - ID of the conversation
   * @param participantUserId - ID of the participant to remove
   * @param requesterId - ID of the user making the request
   * @param tenantId - Tenant ID for multi-tenant isolation
   * @throws ForbiddenException if requester doesn't have permission
   */
  async removeParticipant(
    conversationId: string,
    participantUserId: string,
    requesterId: string,
    tenantId: string,
  ): Promise<void> {
    this.logger.log(
      `Removing participant ${participantUserId} from conversation ${conversationId}`,
    );

    // Verify conversation exists
    const conversation = await this.conversationModel.findOne({
      where: { id: conversationId, tenantId },
    });

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    // Get participant to remove
    const participant = await this.participantModel.findOne({
      where: { conversationId, userId: participantUserId },
    });

    if (!participant) {
      throw new NotFoundException('Participant not found');
    }

    // Cannot remove owner
    if (participant.role === ParticipantRole.OWNER) {
      throw new ForbiddenException('Cannot remove conversation owner');
    }

    // Check if requester is removing themselves
    if (requesterId === participantUserId) {
      // Users can remove themselves
      await participant.destroy();
      return;
    }

    // Check permissions for removing others
    await this.checkPermission(conversationId, requesterId, [
      ParticipantRoleEnum.OWNER,
      ParticipantRoleEnum.ADMIN,
    ]);

    await participant.destroy();
  }

  /**
   * Update participant settings
   *
   * @param conversationId - ID of the conversation
   * @param dto - Updated participant settings
   * @param userId - ID of the user
   * @returns Updated participant
   */
  async updateParticipantSettings(
    conversationId: string,
    dto: UpdateParticipantDto,
    userId: string,
  ): Promise<CreateConversationResult> {
    const participant = await this.participantModel.findOne({
      where: { conversationId, userId },
    });

    if (!participant) {
      throw new NotFoundException('Participant not found');
    }

    // If updating role, check permissions
    if (dto.role !== undefined) {
      await this.checkPermission(conversationId, userId, [
        ParticipantRoleEnum.OWNER,
        ParticipantRoleEnum.ADMIN,
      ]);
    }

    // Update participant
    await participant.update({
      role: dto.role !== undefined ? dto.role : participant.role,
      isMuted: dto.isMuted !== undefined ? dto.isMuted : participant.isMuted,
      isPinned:
        dto.isPinned !== undefined ? dto.isPinned : participant.isPinned,
      customName:
        dto.customName !== undefined ? dto.customName : participant.customName,
      notificationPreference:
        dto.notificationPreference !== undefined
          ? dto.notificationPreference
          : participant.notificationPreference,
    });

    return { participant: participant.toJSON() };
  }

  /**
   * Get participants of a conversation
   *
   * @param conversationId - ID of the conversation
   * @param userId - ID of the requesting user
   * @returns List of participants
   * @throws ForbiddenException if user is not a participant
   */
  async getParticipants(conversationId: string, userId: string): Promise<CreateConversationResult> {
    // Verify user is a participant
    const isParticipant = await this.isParticipant(conversationId, userId);
    if (!isParticipant) {
      throw new ForbiddenException(
        'You are not a participant in this conversation',
      );
    }

    const participants = await this.participantModel.findAll({
      where: { conversationId },
      order: [
        ['role', 'ASC'],
        ['joinedAt', 'ASC'],
      ],
    });

    return {
      participants: participants.map((p) => p.toJSON()),
      total: participants.length,
    };
  }

  // ===== Helper Methods =====

  /**
   * Validate conversation type constraints
   */
  private validateConversationConstraints(dto: CreateConversationDto): void {
    if (dto.type === ConversationType.DIRECT) {
      if (dto.participants.length !== 1 && dto.participants.length !== 2) {
        throw new BadRequestException(
          'Direct conversations must have exactly 2 participants',
        );
      }
    }

    if (dto.type === ConversationType.GROUP) {
      if (!dto.name || dto.name.trim().length === 0) {
        throw new BadRequestException('Group conversations must have a name');
      }
      if (dto.participants.length < 1) {
        throw new BadRequestException(
          'Group conversations must have at least 2 participants (including creator)',
        );
      }
      if (dto.participants.length > 99) {
        throw new BadRequestException(
          'Group conversations cannot have more than 100 participants',
        );
      }
    }

    if (dto.type === ConversationType.CHANNEL) {
      if (!dto.name || dto.name.trim().length === 0) {
        throw new BadRequestException('Channels must have a name');
      }
    }
  }

  /**
   * Check if user is a participant
   */
  private async isParticipant(
    conversationId: string,
    userId: string,
  ): Promise<boolean> {
    const participant = await this.participantModel.findOne({
      where: { conversationId, userId },
    });
    return !!participant;
  }

  /**
   * Check if user has required permission
   */
  private async checkPermission(
    conversationId: string,
    userId: string,
    requiredRoles: ParticipantRole[],
  ): Promise<void> {
    const participant = await this.participantModel.findOne({
      where: { conversationId, userId },
    });

    if (!participant) {
      throw new ForbiddenException(
        'You are not a participant in this conversation',
      );
    }

    if (!requiredRoles.includes(participant.role)) {
      throw new ForbiddenException(
        'You do not have permission to perform this action',
      );
    }
  }

  /**
   * Get unread count for a specific conversation
   */
  private async getConversationUnreadCount(
    conversationId: string,
    userId: string,
  ): Promise<number> {
    const participant = await this.participantModel.findOne({
      where: { conversationId, userId },
      attributes: ['lastReadAt'],
    });

    if (!participant) {
      return 0;
    }

    const where: WhereOptions = {
      conversationId,
      senderId: { [Op.ne]: userId }, // Exclude own messages
    };

    if (participant.lastReadAt) {
      where.createdAt = { [Op.gt]: participant.lastReadAt };
    }

    return await this.messageModel.count({ where });
  }
}
