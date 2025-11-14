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
exports.MessageService = void 0;
const common_1 = require("@nestjs/common");
const broadcast_service_1 = require("./broadcast.service");
const base_1 = require("../../../common/base");
let MessageService = class MessageService extends base_1.BaseService {
    broadcastService;
    constructor(broadcastService) {
        super("MessageService");
        this.broadcastService = broadcastService;
    }
    async sendMessageToConversation(conversationId, message) {
        try {
            await this.broadcastService.broadcastToRoom(`conversation:${conversationId}`, 'message:send', message.toPayload());
            this.logInfo(`Message sent to conversation ${conversationId}`, {
                messageId: message.messageId,
                senderId: message.senderId,
            });
        }
        catch (error) {
            this.logError(`Failed to send message to conversation ${conversationId}`, error);
            throw error;
        }
    }
    async sendMessageToUsers(userIds, message) {
        try {
            const rooms = userIds.map(userId => `user:${userId}`);
            await this.broadcastService.broadcastToRooms(rooms, 'message:send', message.toPayload());
            this.logInfo(`Direct message sent to ${userIds.length} users`, {
                messageId: message.messageId,
                senderId: message.senderId,
                recipientCount: userIds.length,
            });
        }
        catch (error) {
            this.logError('Failed to send direct message', error);
            throw error;
        }
    }
    async broadcastTypingIndicator(conversationId, typingIndicator) {
        try {
            await this.broadcastService.broadcastToRoom(`conversation:${conversationId}`, 'message:typing', typingIndicator.toPayload());
            this.logDebug(`Typing indicator broadcasted to conversation ${conversationId}`, {
                userId: typingIndicator.userId,
                isTyping: typingIndicator.isTyping,
            });
        }
        catch (error) {
            this.logError(`Failed to broadcast typing indicator to conversation ${conversationId}`, error);
            throw error;
        }
    }
    async broadcastReadReceipt(conversationId, readReceipt) {
        try {
            await this.broadcastService.broadcastToRoom(`conversation:${conversationId}`, 'message:read', readReceipt.toPayload());
            this.logInfo(`Read receipt broadcasted to conversation ${conversationId}`, {
                messageId: readReceipt.messageId,
                userId: readReceipt.userId,
            });
        }
        catch (error) {
            this.logError(`Failed to broadcast read receipt to conversation ${conversationId}`, error);
            throw error;
        }
    }
    async broadcastMessageDelivery(senderId, delivery) {
        try {
            await this.broadcastService.broadcastToUser(senderId, 'message:delivered', delivery.toPayload());
            this.logDebug(`Delivery confirmation sent to user ${senderId}`, {
                messageId: delivery.messageId,
                status: delivery.status,
            });
        }
        catch (error) {
            this.logError(`Failed to broadcast delivery confirmation to user ${senderId}`, error);
            throw error;
        }
    }
};
exports.MessageService = MessageService;
exports.MessageService = MessageService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [broadcast_service_1.BroadcastService])
], MessageService);
//# sourceMappingURL=message.service.js.map