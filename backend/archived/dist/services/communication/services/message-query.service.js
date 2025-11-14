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
exports.MessageQueryService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const sequelize_2 = require("sequelize");
const models_1 = require("../../../database/models");
const models_2 = require("../../../database/models");
const models_3 = require("../../../database/models");
const base_1 = require("../../../common/base");
let MessageQueryService = class MessageQueryService extends base_1.BaseService {
    messageModel;
    messageReadModel;
    participantModel;
    constructor(messageModel, messageReadModel, participantModel) {
        super("MessageQueryService");
        this.messageModel = messageModel;
        this.messageReadModel = messageReadModel;
        this.participantModel = participantModel;
    }
    async getMessageHistory(dto, userId) {
        const where = await this.buildMessageWhereClause(dto, userId);
        const offset = ((dto.page || 1) - 1) * (dto.limit || 20);
        const limit = dto.limit || 20;
        const { rows: messages, count: total } = await this.messageModel.findAndCountAll({
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
    async searchMessages(dto, userId) {
        const where = await this.buildMessageWhereClause(dto, userId, {
            content: {
                [sequelize_2.Op.iLike]: `%${dto.query}%`,
            },
            ...(dto.senderId && { senderId: dto.senderId }),
            ...(dto.hasAttachments && { attachments: { [sequelize_2.Op.ne]: [] } }),
        });
        const offset = ((dto.page || 1) - 1) * (dto.limit || 20);
        const limit = dto.limit || 20;
        const { rows: messages, count: total } = await this.messageModel.findAndCountAll({
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
    async buildMessageWhereClause(dto, userId, additionalWhere = {}) {
        const where = { ...additionalWhere };
        if ('conversationId' in dto && dto.conversationId) {
            const isParticipant = await this.isConversationParticipant(dto.conversationId, userId);
            if (!isParticipant) {
                throw new common_1.BadRequestException('You are not a participant in this conversation');
            }
            where.conversationId = dto.conversationId;
        }
        else if ('conversationIds' in dto && dto.conversationIds && dto.conversationIds.length > 0) {
            where.conversationId = { [sequelize_2.Op.in]: dto.conversationIds };
        }
        else {
            const participantConversations = await this.participantModel.findAll({
                where: { userId },
                attributes: ['conversationId'],
            });
            const conversationIds = participantConversations.map((p) => p.conversationId);
            where.conversationId = { [sequelize_2.Op.in]: conversationIds };
        }
        if ('threadId' in dto && dto.threadId) {
            where.threadId = dto.threadId;
        }
        if (dto.dateFrom) {
            where.createdAt = {
                ...where.createdAt,
                [sequelize_2.Op.gte]: new Date(dto.dateFrom),
            };
        }
        if (dto.dateTo) {
            where.createdAt = {
                ...where.createdAt,
                [sequelize_2.Op.lte]: new Date(dto.dateTo),
            };
        }
        return where;
    }
    async markMessagesAsRead(dto, userId) {
        this.logInfo(`Marking ${dto.messageIds.length} messages as read for user ${userId}`);
        const readPromises = dto.messageIds.map((messageId) => this.messageReadModel.findOrCreate({
            where: { messageId, userId },
            defaults: {
                messageId,
                userId,
                readAt: new Date(),
            },
        }));
        const results = await Promise.all(readPromises);
        const newReads = results.filter(([, created]) => created).length;
        await this.updateParticipantReadTimestamp(dto.messageIds, userId);
        return {
            markedAsRead: newReads,
            total: dto.messageIds.length,
        };
    }
    async markConversationAsRead(dto, userId) {
        this.logInfo(`Marking conversation ${dto.conversationId} as read for user ${userId}`);
        const messages = await this.messageModel.findAll({
            where: {
                conversationId: dto.conversationId,
                senderId: { [sequelize_2.Op.ne]: userId },
            },
            include: [
                {
                    model: this.messageReadModel,
                    where: { userId },
                    required: false,
                },
            ],
        });
        const unreadMessages = messages.filter((m) => !m.messageReads || m.messageReads.length === 0);
        const readPromises = unreadMessages.map((message) => this.messageReadModel.create({
            messageId: message.id,
            userId,
            readAt: new Date(),
        }));
        await Promise.all(readPromises);
        await this.participantModel.update({ lastReadAt: new Date() }, {
            where: {
                conversationId: dto.conversationId,
                userId,
            },
        });
        return {
            markedAsRead: unreadMessages.length,
        };
    }
    async getUnreadCount(userId, conversationId) {
        this.logInfo(`Getting unread count for user ${userId}`);
        const where = {
            senderId: { [sequelize_2.Op.ne]: userId },
        };
        if (conversationId) {
            where.conversationId = conversationId;
        }
        else {
            const participantConversations = await this.participantModel.findAll({
                where: { userId },
                attributes: ['conversationId'],
            });
            const conversationIds = participantConversations.map((p) => p.conversationId);
            where.conversationId = { [sequelize_2.Op.in]: conversationIds };
        }
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
        const unreadByConversation = {};
        let totalUnread = 0;
        messages.forEach((message) => {
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
    async isConversationParticipant(conversationId, userId) {
        const participant = await this.participantModel.findOne({
            where: { conversationId, userId },
        });
        return !!participant;
    }
    async updateParticipantReadTimestamp(messageIds, userId) {
        const messages = await this.messageModel.findAll({
            where: { id: { [sequelize_2.Op.in]: messageIds } },
            attributes: ['conversationId'],
        });
        const conversationIds = [...new Set(messages.map((m) => m.conversationId))].filter(Boolean);
        await this.participantModel.update({ lastReadAt: new Date() }, {
            where: {
                conversationId: { [sequelize_2.Op.in]: conversationIds },
                userId,
            },
        });
    }
};
exports.MessageQueryService = MessageQueryService;
exports.MessageQueryService = MessageQueryService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(models_1.Message)),
    __param(1, (0, sequelize_1.InjectModel)(models_2.MessageRead)),
    __param(2, (0, sequelize_1.InjectModel)(models_3.ConversationParticipant)),
    __metadata("design:paramtypes", [Object, Object, Object])
], MessageQueryService);
//# sourceMappingURL=message-query.service.js.map