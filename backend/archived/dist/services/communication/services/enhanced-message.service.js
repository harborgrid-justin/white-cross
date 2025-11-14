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
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnhancedMessageService = void 0;
const common_1 = require("@nestjs/common");
const message_sender_service_1 = require("./message-sender.service");
const message_management_service_1 = require("./message-management.service");
const message_query_service_1 = require("./message-query.service");
const base_1 = require("../../../common/base");
let EnhancedMessageService = class EnhancedMessageService extends base_1.BaseService {
    messageSender;
    messageManagement;
    messageQuery;
    constructor(messageSender, messageManagement, messageQuery) {
        super('EnhancedMessageService');
        this.messageSender = messageSender;
        this.messageManagement = messageManagement;
        this.messageQuery = messageQuery;
    }
    async sendDirectMessage(dto, senderId, tenantId) {
        return this.messageSender.sendDirectMessage(dto, senderId, tenantId);
    }
    async sendGroupMessage(dto, senderId, tenantId) {
        return this.messageSender.sendGroupMessage(dto, senderId, tenantId);
    }
    async editMessage(messageId, dto, userId) {
        return this.messageManagement.editMessage(messageId, dto, userId);
    }
    async deleteMessage(messageId, userId) {
        return this.messageManagement.deleteMessage(messageId, userId);
    }
    async getMessageHistory(dto, userId, tenantId) {
        return this.messageQuery.getMessageHistory(dto, userId);
    }
    async searchMessages(dto, userId, tenantId) {
        return this.messageQuery.searchMessages(dto, userId);
    }
    async markMessagesAsRead(dto, userId) {
        return this.messageQuery.markMessagesAsRead(dto, userId);
    }
    async markConversationAsRead(dto, userId) {
        return this.messageQuery.markConversationAsRead(dto, userId);
    }
    async getUnreadCount(userId, conversationId) {
        return this.messageQuery.getUnreadCount(userId, conversationId);
    }
};
exports.EnhancedMessageService = EnhancedMessageService;
exports.EnhancedMessageService = EnhancedMessageService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [message_sender_service_1.MessageSenderService,
        message_management_service_1.MessageManagementService,
        message_query_service_1.MessageQueryService])
], EnhancedMessageService);
//# sourceMappingURL=enhanced-message.service.js.map