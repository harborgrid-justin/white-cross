"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConversationService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const sequelize_2 = require("sequelize");
const models_1 = require("../../../database/models");
const models_2 = require("../../../database/models");
const conversation_participant_dto_1 = require("../dto/conversation-participant.dto");
const models_3 = require("../../../database/models");
const base_1 = require("../../../common/base");
let ConversationService = class ConversationService extends base_1.BaseService {
    conversationModel;
    participantModel;
    messageModel;
    constructor(conversationModel, participantModel, messageModel) {
        super("ConversationService");
        this.conversationModel = conversationModel;
        this.participantModel = participantModel;
        this.messageModel = messageModel;
    }
    async createConversation(dto, creatorId, tenantId) {
        this.logInfo(`Creating ${dto.type} conversation by user ${creatorId}`);
        this.validateConversationConstraints(dto);
        const creatorInList = dto.participants.some((p) => p.userId === creatorId);
        const participants = creatorInList
            ? dto.participants
            : [{ userId: creatorId, role: 'OWNER' }, ...dto.participants];
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
        const participantPromises = participants.map((participant) => this.participantModel.create({
            conversationId: conversation.id,
            userId: participant.userId,
            role: participant.role ||
                (participant.userId === creatorId
                    ? models_2.ParticipantRole.OWNER
                    : models_2.ParticipantRole.MEMBER),
            joinedAt: new Date(),
            isMuted: false,
            isPinned: false,
            notificationPreference: 'ALL',
        }));
        const createdParticipants = await Promise.all(participantPromises);
        return {
            conversation: conversation.toJSON(),
            participants: createdParticipants.map((p) => p.toJSON()),
        };
    }
    async getConversation(conversationId, userId, tenantId) {
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
            throw new common_1.NotFoundException('Conversation not found');
        }
        const isParticipant = await this.isParticipant(conversationId, userId);
        if (!isParticipant) {
            throw new common_1.ForbiddenException('You are not a participant in this conversation');
        }
        const unreadCount = await this.getConversationUnreadCount(conversationId, userId);
        return {
            ...conversation.toJSON(),
            unreadCount,
        };
    }
    async listConversations(userId, tenantId, options = {}) {
        const page = options.page || 1;
        const limit = options.limit || 20;
        const offset = (page - 1) * limit;
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
        const where = {
            id: { [sequelize_2.Op.in]: conversationIds },
            tenantId,
        };
        if (!options.includeArchived) {
            where.isArchived = false;
        }
        if (options.type) {
            where.type = options.type;
        }
        const { rows: conversations, count: total } = await this.conversationModel.findAndCountAll({
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
        const enrichedConversations = await Promise.all(conversations.map(async (conv) => {
            const participation = participations.find((p) => p.conversationId === conv.id);
            const unreadCount = await this.getConversationUnreadCount(conv.id, userId);
            return {
                ...conv.toJSON(),
                userSettings: {
                    isMuted: participation?.isMuted || false,
                    isPinned: participation?.isPinned || false,
                    lastReadAt: participation?.lastReadAt,
                },
                unreadCount,
            };
        }));
        enrichedConversations.sort((a, b) => {
            if (a.userSettings.isPinned && !b.userSettings.isPinned)
                return -1;
            if (!a.userSettings.isPinned && b.userSettings.isPinned)
                return 1;
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
    async updateConversation(conversationId, dto, userId, tenantId) {
        const conversation = await this.conversationModel.findOne({
            where: { id: conversationId, tenantId },
        });
        if (!conversation) {
            throw new common_1.NotFoundException('Conversation not found');
        }
        await this.checkPermission(conversationId, userId, [
            conversation_participant_dto_1.ParticipantRole.OWNER,
            conversation_participant_dto_1.ParticipantRole.ADMIN,
        ]);
        await conversation.update({
            name: dto.name !== undefined ? dto.name : conversation.name,
            description: dto.description !== undefined
                ? dto.description
                : conversation.description,
            avatarUrl: dto.avatarUrl !== undefined ? dto.avatarUrl : conversation.avatarUrl,
            isArchived: dto.isArchived !== undefined ? dto.isArchived : conversation.isArchived,
            metadata: dto.metadata !== undefined
                ? { ...conversation.metadata, ...dto.metadata }
                : conversation.metadata,
        });
        return { conversation: conversation.toJSON() };
    }
    async deleteConversation(conversationId, userId, tenantId) {
        const conversation = await this.conversationModel.findOne({
            where: { id: conversationId, tenantId },
        });
        if (!conversation) {
            throw new common_1.NotFoundException('Conversation not found');
        }
        await this.checkPermission(conversationId, userId, [
            conversation_participant_dto_1.ParticipantRole.OWNER,
        ]);
        await conversation.destroy();
        this.logInfo(`Conversation ${conversationId} deleted by user ${userId}`);
    }
    async addParticipant(conversationId, dto, requesterId, tenantId) {
        this.logInfo(`Adding participant ${dto.userId} to conversation ${conversationId}`);
        const conversation = await this.conversationModel.findOne({
            where: { id: conversationId, tenantId },
        });
        if (!conversation) {
            throw new common_1.NotFoundException('Conversation not found');
        }
        await this.checkPermission(conversationId, requesterId, [
            conversation_participant_dto_1.ParticipantRole.OWNER,
            conversation_participant_dto_1.ParticipantRole.ADMIN,
        ]);
        if (conversation.type === models_1.ConversationType.DIRECT) {
            throw new common_1.BadRequestException('Cannot add participants to direct conversations');
        }
        const existingParticipant = await this.participantModel.findOne({
            where: { conversationId, userId: dto.userId },
        });
        if (existingParticipant) {
            throw new common_1.BadRequestException('User is already a participant');
        }
        const participant = await this.participantModel.create({
            conversationId,
            userId: dto.userId,
            role: dto.role || models_2.ParticipantRole.MEMBER,
            joinedAt: new Date(),
            isMuted: false,
            isPinned: false,
            notificationPreference: 'ALL',
        });
        return { participant: participant.toJSON() };
    }
    async removeParticipant(conversationId, participantUserId, requesterId, tenantId) {
        this.logInfo(`Removing participant ${participantUserId} from conversation ${conversationId}`);
        const conversation = await this.conversationModel.findOne({
            where: { id: conversationId, tenantId },
        });
        if (!conversation) {
            throw new common_1.NotFoundException('Conversation not found');
        }
        const participant = await this.participantModel.findOne({
            where: { conversationId, userId: participantUserId },
        });
        if (!participant) {
            throw new common_1.NotFoundException('Participant not found');
        }
        if (participant.role === models_2.ParticipantRole.OWNER) {
            throw new common_1.ForbiddenException('Cannot remove conversation owner');
        }
        if (requesterId === participantUserId) {
            await participant.destroy();
            return;
        }
        await this.checkPermission(conversationId, requesterId, [
            conversation_participant_dto_1.ParticipantRole.OWNER,
            conversation_participant_dto_1.ParticipantRole.ADMIN,
        ]);
        await participant.destroy();
    }
    async updateParticipantSettings(conversationId, dto, userId) {
        const participant = await this.participantModel.findOne({
            where: { conversationId, userId },
        });
        if (!participant) {
            throw new common_1.NotFoundException('Participant not found');
        }
        if (dto.role !== undefined) {
            await this.checkPermission(conversationId, userId, [
                conversation_participant_dto_1.ParticipantRole.OWNER,
                conversation_participant_dto_1.ParticipantRole.ADMIN,
            ]);
        }
        await participant.update({
            role: dto.role !== undefined ? dto.role : participant.role,
            isMuted: dto.isMuted !== undefined ? dto.isMuted : participant.isMuted,
            isPinned: dto.isPinned !== undefined ? dto.isPinned : participant.isPinned,
            customName: dto.customName !== undefined ? dto.customName : participant.customName,
            notificationPreference: dto.notificationPreference !== undefined
                ? dto.notificationPreference
                : participant.notificationPreference,
        });
        return { participant: participant.toJSON() };
    }
    async getParticipants(conversationId, userId) {
        const isParticipant = await this.isParticipant(conversationId, userId);
        if (!isParticipant) {
            throw new common_1.ForbiddenException('You are not a participant in this conversation');
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
    validateConversationConstraints(dto) {
        if (dto.type === models_1.ConversationType.DIRECT) {
            if (dto.participants.length !== 1 && dto.participants.length !== 2) {
                throw new common_1.BadRequestException('Direct conversations must have exactly 2 participants');
            }
        }
        if (dto.type === models_1.ConversationType.GROUP) {
            if (!dto.name || dto.name.trim().length === 0) {
                throw new common_1.BadRequestException('Group conversations must have a name');
            }
            if (dto.participants.length < 1) {
                throw new common_1.BadRequestException('Group conversations must have at least 2 participants (including creator)');
            }
            if (dto.participants.length > 99) {
                throw new common_1.BadRequestException('Group conversations cannot have more than 100 participants');
            }
        }
        if (dto.type === models_1.ConversationType.CHANNEL) {
            if (!dto.name || dto.name.trim().length === 0) {
                throw new common_1.BadRequestException('Channels must have a name');
            }
        }
    }
    async isParticipant(conversationId, userId) {
        const participant = await this.participantModel.findOne({
            where: { conversationId, userId },
        });
        return !!participant;
    }
    async checkPermission(conversationId, userId, requiredRoles) {
        const participant = await this.participantModel.findOne({
            where: { conversationId, userId },
        });
        if (!participant) {
            throw new common_1.ForbiddenException('You are not a participant in this conversation');
        }
        if (!requiredRoles.includes(participant.role)) {
            throw new common_1.ForbiddenException('You do not have permission to perform this action');
        }
    }
    async getConversationUnreadCount(conversationId, userId) {
        const participant = await this.participantModel.findOne({
            where: { conversationId, userId },
            attributes: ['lastReadAt'],
        });
        if (!participant) {
            return 0;
        }
        const where = {
            conversationId,
            senderId: { [sequelize_2.Op.ne]: userId },
        };
        if (participant.lastReadAt) {
            where.createdAt = { [sequelize_2.Op.gt]: participant.lastReadAt };
        }
        return await this.messageModel.count({ where });
    }
};
exports.ConversationService = ConversationService;
exports.ConversationService = ConversationService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(models_1.Conversation)),
    __param(1, (0, sequelize_1.InjectModel)(models_2.ConversationParticipant)),
    __param(2, (0, sequelize_1.InjectModel)(models_3.Message)),
    __metadata("design:paramtypes", [Object, Object, Object])
], ConversationService);
//# sourceMappingURL=conversation.service.js.map