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
exports.MessageSenderService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const sequelize_2 = require("sequelize");
const models_1 = require("../../../database/models");
const models_2 = require("../../../database/models");
const models_3 = require("../../../database/models");
const encryption_service_1 = require("../../../infrastructure/encryption/encryption.service");
const queue_integration_helper_1 = require("../helpers/queue-integration.helper");
const base_1 = require("../../../common/base");
let MessageSenderService = class MessageSenderService extends base_1.BaseService {
    messageModel;
    conversationModel;
    participantModel;
    encryptionService;
    queueHelper;
    constructor(messageModel, conversationModel, participantModel, encryptionService, queueHelper) {
        super("MessageSenderService");
        this.messageModel = messageModel;
        this.conversationModel = conversationModel;
        this.participantModel = participantModel;
        this.encryptionService = encryptionService;
        this.queueHelper = queueHelper;
    }
    async sendDirectMessage(dto, senderId, tenantId) {
        this.logInfo(`Sending direct message from ${senderId} to ${dto.recipientId}`);
        this.validateUser(dto.recipientId);
        const conversation = await this.findOrCreateDirectConversation(senderId, dto.recipientId, tenantId);
        return this.createMessage(dto, senderId, conversation, {
            recipientId: dto.recipientId,
            priority: 'HIGH',
            recipientCount: 1,
        });
    }
    async sendGroupMessage(dto, senderId, tenantId) {
        this.logInfo(`Sending group message to conversation ${dto.conversationId}`);
        const conversation = await this.conversationModel.findOne({
            where: { id: dto.conversationId, tenantId },
        });
        if (!conversation) {
            throw new common_1.BadRequestException('Conversation not found');
        }
        const participants = await this.participantModel.findAll({
            where: { conversationId: conversation.id },
        });
        const recipientIds = participants.filter((p) => p.userId !== senderId).map((p) => p.userId);
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
    async createMessage(dto, senderId, conversation, options) {
        const isParticipant = await this.isConversationParticipant(conversation.id, senderId);
        if (!isParticipant) {
            throw new common_1.BadRequestException('You are not a participant in this conversation');
        }
        let encryptedContent;
        if (dto.encrypted) {
            const encryptionResult = await this.encryptionService.encrypt(dto.content);
            if (encryptionResult.success) {
                encryptedContent = encryptionResult.data;
            }
            else {
                throw new common_1.BadRequestException(`Encryption failed: ${encryptionResult.message}`);
            }
        }
        let threadId = dto.parentId;
        if (dto.parentId) {
            const parentMessage = await this.messageModel.findByPk(dto.parentId);
            if (parentMessage) {
                threadId = parentMessage.threadId || parentMessage.id;
            }
        }
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
        await conversation.update({ lastMessageAt: new Date() });
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
        this.logInfo(`Message ${message.id} queued for delivery. Jobs: ${jobIds}`);
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
    async findOrCreateDirectConversation(userId1, userId2, tenantId) {
        const existingConversation = await this.conversationModel.findOne({
            where: {
                type: models_1.ConversationType.DIRECT,
                tenantId,
            },
            include: [
                {
                    model: this.participantModel,
                    where: {
                        userId: { [sequelize_2.Op.in]: [userId1, userId2] },
                    },
                    required: true,
                },
            ],
        });
        if (existingConversation) {
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
        const conversation = await this.conversationModel.create({
            type: models_1.ConversationType.DIRECT,
            tenantId,
            createdById: userId1,
            isArchived: false,
            metadata: {},
        });
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
    async isConversationParticipant(conversationId, userId) {
        const participant = await this.participantModel.findOne({
            where: { conversationId, userId },
        });
        return !!participant;
    }
    validateUser(userId) {
        this.logDebug(`Validating user ${userId}`);
    }
};
exports.MessageSenderService = MessageSenderService;
exports.MessageSenderService = MessageSenderService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(models_3.Message)),
    __param(1, (0, sequelize_1.InjectModel)(models_1.Conversation)),
    __param(2, (0, sequelize_1.InjectModel)(models_2.ConversationParticipant)),
    __metadata("design:paramtypes", [Object, Object, Object, encryption_service_1.EncryptionService,
        queue_integration_helper_1.QueueIntegrationHelper])
], MessageSenderService);
//# sourceMappingURL=message-sender.service.js.map