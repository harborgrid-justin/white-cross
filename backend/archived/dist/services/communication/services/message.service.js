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
exports.MessageService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const models_1 = require("../../../database/models");
const models_2 = require("../../../database/models");
const base_1 = require("../../../common/base");
let MessageService = class MessageService extends base_1.BaseService {
    messageModel;
    deliveryModel;
    constructor(messageModel, deliveryModel) {
        super("MessageService");
        this.messageModel = messageModel;
        this.deliveryModel = deliveryModel;
    }
    async sendMessage(data) {
        this.logInfo(`Sending message to ${data.recipients.length} recipients`);
        const message = await this.messageModel.create({
            subject: data.subject,
            content: data.content,
            priority: data.priority || 'MEDIUM',
            category: data.category,
            recipientCount: data.recipients.length,
            scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : null,
            attachments: data.attachments || [],
            senderId: data.senderId,
            templateId: data.templateId,
        });
        const deliveryRecords = [];
        const channels = data.channels || ['EMAIL'];
        const sentAt = !data.scheduledAt ? new Date() : null;
        const status = data.scheduledAt ? 'PENDING' : 'SENT';
        for (const recipient of data.recipients) {
            for (const channel of channels) {
                deliveryRecords.push({
                    recipientType: recipient.type,
                    recipientId: recipient.id,
                    channel: channel,
                    status: status,
                    contactInfo: channel === 'EMAIL' ? recipient.email : recipient.phoneNumber,
                    messageId: message.id,
                    sentAt: sentAt,
                });
            }
        }
        const deliveries = await this.deliveryModel.bulkCreate(deliveryRecords);
        const deliveryStatuses = deliveries.map((delivery) => ({
            messageId: message.id,
            recipientId: delivery.recipientId,
            channel: delivery.channel,
            status: delivery.status,
            sentAt: delivery.sentAt,
        }));
        return {
            message: message.toJSON(),
            deliveryStatuses,
        };
    }
    async getMessages(page, limit, filters) {
        const offset = (page - 1) * limit;
        const where = {};
        if (filters.senderId)
            where.senderId = filters.senderId;
        if (filters.category)
            where.category = filters.category;
        if (filters.priority)
            where.priority = filters.priority;
        const searchWhere = {};
        const { rows: messages, count: total } = await this.messageModel.findAndCountAll({
            where,
            offset,
            limit,
            order: [['createdAt', 'DESC']],
        });
        return {
            messages: messages.map((m) => m.toJSON()),
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        };
    }
    async getInbox(userId, page, limit) {
        const offset = (page - 1) * limit;
        const deliveries = await this.deliveryModel.findAll({
            where: { recipientId: userId },
            include: [{ model: models_1.Message, as: 'message' }],
            offset,
            limit,
            order: [['createdAt', 'DESC']],
        });
        const messages = deliveries.map((d) => d.message);
        return {
            messages: messages.map((m) => m?.toJSON()).filter(Boolean),
            total: deliveries.length,
            page,
            limit,
        };
    }
    async getSentMessages(userId, page, limit) {
        return this.getMessages(page, limit, { senderId: userId });
    }
    async getMessageById(id) {
        const message = await this.messageModel.findByPk(id, {
            include: [{ all: true }],
        });
        if (!message) {
            throw new common_1.NotFoundException('Message not found');
        }
        return { message: message.toJSON() };
    }
    async getMessageDeliveryStatus(id) {
        const message = await this.messageModel.findByPk(id);
        if (!message) {
            throw new common_1.NotFoundException('Message not found');
        }
        const deliveries = await this.deliveryModel.findAll({
            where: { messageId: id },
        });
        const summary = {
            total: deliveries.length,
            pending: deliveries.filter((d) => d.status === 'PENDING').length,
            sent: deliveries.filter((d) => d.status === 'SENT').length,
            delivered: deliveries.filter((d) => d.status === 'DELIVERED').length,
            failed: deliveries.filter((d) => d.status === 'FAILED').length,
            bounced: deliveries.filter((d) => d.status === 'BOUNCED').length,
        };
        return {
            deliveries: deliveries.map((d) => d.toJSON()),
            summary,
        };
    }
    async replyToMessage(originalId, senderId, replyData) {
        const originalMessage = await this.messageModel.findByPk(originalId);
        if (!originalMessage) {
            throw new common_1.NotFoundException('Original message not found');
        }
        return this.sendMessage({
            recipients: [
                {
                    type: 'NURSE',
                    id: originalMessage.senderId,
                    email: undefined,
                },
            ],
            channels: replyData.channels || ['EMAIL'],
            subject: `Re: ${originalMessage.subject || 'Your message'}`,
            content: replyData.content,
            priority: 'MEDIUM',
            category: originalMessage.category,
            senderId,
        });
    }
    async deleteScheduledMessage(id, userId) {
        const message = await this.messageModel.findByPk(id);
        if (!message) {
            throw new common_1.NotFoundException('Message not found');
        }
        if (message.senderId !== userId) {
            throw new common_1.ForbiddenException('Not authorized to delete this message');
        }
        if (!message.scheduledAt || message.scheduledAt <= new Date()) {
            throw new common_1.BadRequestException('Cannot delete messages that have already been sent');
        }
        await message.destroy();
    }
};
exports.MessageService = MessageService;
exports.MessageService = MessageService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(models_1.Message)),
    __param(1, (0, sequelize_1.InjectModel)(models_2.MessageDelivery)),
    __metadata("design:paramtypes", [Object, Object])
], MessageService);
//# sourceMappingURL=message.service.js.map