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
exports.BroadcastService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const models_1 = require("../../../database/models");
const sequelize_2 = require("sequelize");
const base_1 = require("../../../common/base");
let BroadcastService = class BroadcastService extends base_1.BaseService {
    messageModel;
    deliveryModel;
    constructor(messageModel, deliveryModel) {
        super('BroadcastService');
        this.messageModel = messageModel;
        this.deliveryModel = deliveryModel;
    }
    async createBroadcast(data) {
        this.logInfo(`Creating broadcast message: ${data.subject}`);
        if (data.recipients.length === 0) {
            throw new common_1.BadRequestException('Broadcast must have at least one recipient');
        }
        const message = await this.messageModel.create({
            subject: data.subject,
            content: data.content,
            priority: data.priority,
            category: data.category,
            recipientCount: data.recipients.length,
            scheduledAt: data.scheduledAt || null,
            attachments: [],
            senderId: data.senderId,
            templateId: null,
        });
        this.logInfo(`Broadcast message created with ID: ${message.id}`);
        const deliveryRecords = [];
        const sentAt = !data.scheduledAt ? new Date() : null;
        const status = data.scheduledAt ? 'PENDING' : 'SENT';
        for (const recipient of data.recipients) {
            for (const channel of data.channels) {
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
        this.logInfo(`Created ${deliveries.length} delivery records for ${data.recipients.length} recipients across ${data.channels.length} channels`);
        return {
            message: message.toJSON(),
            deliveryStatuses: deliveries.map((d) => ({
                messageId: message.id,
                recipientId: d.recipientId,
                channel: d.channel,
                status: d.status,
                sentAt: d.sentAt,
            })),
        };
    }
    async listBroadcasts(page, limit, filters) {
        const offset = (page - 1) * limit;
        const where = {
            recipientCount: { [sequelize_2.Op.gt]: 1 },
        };
        if (filters.senderId)
            where.senderId = filters.senderId;
        if (filters.category)
            where.category = filters.category;
        if (filters.priority)
            where.priority = filters.priority;
        if (filters.startDate || filters.endDate) {
            where.createdAt = {};
            if (filters.startDate)
                where.createdAt[sequelize_2.Op.gte] = filters.startDate;
            if (filters.endDate)
                where.createdAt[sequelize_2.Op.lte] = filters.endDate;
        }
        const { rows: messages, count: total } = await this.messageModel.findAndCountAll({
            where,
            offset,
            limit,
            order: [['createdAt', 'DESC']],
        });
        return {
            broadcasts: messages.map((m) => m.toJSON()),
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        };
    }
    async listScheduled() {
        const scheduledMessages = await this.messageModel.findAll({
            where: {
                scheduledAt: { [sequelize_2.Op.gt]: new Date() },
                recipientCount: { [sequelize_2.Op.gt]: 1 },
            },
            order: [['scheduledAt', 'ASC']],
        });
        return {
            scheduledBroadcasts: scheduledMessages.map((m) => m.toJSON()),
        };
    }
    async getBroadcastById(id) {
        const broadcast = await this.messageModel.findByPk(id);
        if (!broadcast) {
            throw new common_1.NotFoundException('Broadcast not found');
        }
        if (broadcast.recipientCount <= 1) {
            throw new common_1.BadRequestException('Message is not a broadcast');
        }
        return { broadcast: broadcast.toJSON() };
    }
    async getDeliveryReport(id) {
        const broadcast = await this.messageModel.findByPk(id);
        if (!broadcast) {
            throw new common_1.NotFoundException('Broadcast not found');
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
        const byChannel = {};
        deliveries.forEach((d) => {
            if (!byChannel[d.channel]) {
                byChannel[d.channel] = { total: 0, sent: 0, delivered: 0, failed: 0 };
            }
            byChannel[d.channel].total++;
            if (d.status === 'SENT' || d.status === 'DELIVERED') {
                byChannel[d.channel].sent++;
            }
            if (d.status === 'DELIVERED') {
                byChannel[d.channel].delivered++;
            }
            if (d.status === 'FAILED' || d.status === 'BOUNCED') {
                byChannel[d.channel].failed++;
            }
        });
        const byRecipientType = {};
        deliveries.forEach((d) => {
            if (!byRecipientType[d.recipientType]) {
                byRecipientType[d.recipientType] = { total: 0, sent: 0, delivered: 0, failed: 0 };
            }
            byRecipientType[d.recipientType].total++;
            if (d.status === 'SENT' || d.status === 'DELIVERED') {
                byRecipientType[d.recipientType].sent++;
            }
            if (d.status === 'DELIVERED') {
                byRecipientType[d.recipientType].delivered++;
            }
            if (d.status === 'FAILED' || d.status === 'BOUNCED') {
                byRecipientType[d.recipientType].failed++;
            }
        });
        return {
            report: {
                messageId: id,
                summary,
                byChannel,
                byRecipientType,
            },
        };
    }
    async getRecipients(id, page, limit) {
        const offset = (page - 1) * limit;
        const { rows: deliveries, count: total } = await this.deliveryModel.findAndCountAll({
            where: { messageId: id },
            offset,
            limit,
            order: [['createdAt', 'DESC']],
        });
        return {
            recipients: deliveries.map((d) => ({
                recipientId: d.recipientId,
                recipientType: d.recipientType,
                channel: d.channel,
                status: d.status,
                contactInfo: d.contactInfo,
                sentAt: d.sentAt,
                deliveredAt: d.deliveredAt,
            })),
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        };
    }
    async cancelBroadcast(id, userId) {
        const broadcast = await this.messageModel.findByPk(id);
        if (!broadcast) {
            throw new common_1.NotFoundException('Broadcast not found');
        }
        if (broadcast.senderId !== userId) {
            throw new common_1.BadRequestException('Only the sender can cancel this broadcast');
        }
        if (!broadcast.scheduledAt || broadcast.scheduledAt <= new Date()) {
            throw new common_1.BadRequestException('Cannot cancel broadcast that has already been sent');
        }
        await this.deliveryModel.destroy({ where: { messageId: id } });
        await broadcast.destroy();
        this.logInfo(`Broadcast ${id} cancelled by user ${userId}`);
        return { success: true, message: 'Broadcast cancelled successfully' };
    }
    async scheduleBroadcast(data) {
        if (data.scheduledAt <= new Date()) {
            throw new common_1.BadRequestException('Scheduled time must be in the future');
        }
        this.logInfo(`Scheduling broadcast for ${data.scheduledAt.toISOString()}`);
        return this.createBroadcast({
            ...data,
            audience: 'SCHEDULED',
        });
    }
};
exports.BroadcastService = BroadcastService;
exports.BroadcastService = BroadcastService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(models_1.Message)),
    __param(1, (0, sequelize_1.InjectModel)(models_1.MessageDelivery)),
    __metadata("design:paramtypes", [Object, Object])
], BroadcastService);
//# sourceMappingURL=broadcast.service.js.map