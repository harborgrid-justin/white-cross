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
exports.MessageHandlerService = void 0;
const common_1 = require("@nestjs/common");
const websockets_1 = require("@nestjs/websockets");
const dto_1 = require("../dto");
const rate_limiter_service_1 = require("./rate-limiter.service");
const websocket_utilities_1 = require("../shared/websocket-utilities");
const base_1 = require("../../../common/base");
let MessageHandlerService = class MessageHandlerService extends base_1.BaseService {
    rateLimiter;
    constructor(rateLimiter) {
        super("MessageHandlerService");
        this.rateLimiter = rateLimiter;
    }
    async handleMessageSend(client, server, data) {
        await websocket_utilities_1.WebSocketUtilities.executeWithCommonHandling({
            client,
            rateLimiter: this.rateLimiter,
            logger: this.logger,
            action: 'message:send',
            createDto: () => new dto_1.MessageEventDto({
                ...data,
                type: 'send',
                senderId: client.user.userId,
                organizationId: client.user.organizationId,
            }),
            validate: (dto, userId, organizationId) => {
                return websocket_utilities_1.WebSocketUtilities.validateDto(dto, userId, organizationId, client, this.logger, 'message send');
            },
            execute: async (messageDto) => {
                const room = websocket_utilities_1.WebSocketUtilities.getConversationRoom(messageDto.conversationId);
                server.to(room).emit('message:send', messageDto.toPayload());
                const deliveryDto = new dto_1.MessageDeliveryDto({
                    messageId: messageDto.messageId,
                    conversationId: messageDto.conversationId,
                    recipientId: client.user.userId,
                    senderId: client.user.userId,
                    organizationId: client.user.organizationId,
                    status: 'sent',
                });
                client.emit('message:delivered', deliveryDto.toPayload());
                return { messageId: messageDto.messageId, conversationId: messageDto.conversationId };
            },
            onSuccess: (result, dto) => {
                websocket_utilities_1.WebSocketUtilities.logAction(this.logger, 'Message sent', client.user.userId, {
                    messageId: result.messageId,
                    conversationId: result.conversationId,
                });
            },
        });
    }
    async handleMessageEdit(client, server, data) {
        const user = client.user;
        if (!user) {
            throw new websockets_1.WsException('Authentication required');
        }
        const allowed = await this.rateLimiter.checkLimit(user.userId, 'message:edit');
        if (!allowed) {
            client.emit('error', {
                type: 'RATE_LIMIT_EXCEEDED',
                message: 'Edit rate limit exceeded. Please slow down.',
            });
            return;
        }
        try {
            const messageDto = new dto_1.MessageEventDto({
                ...data,
                type: 'edit',
                senderId: user.userId,
                organizationId: user.organizationId,
            });
            if (!messageDto.validateSender(user.userId)) {
                throw new websockets_1.WsException('You can only edit your own messages');
            }
            if (!messageDto.validateOrganization(user.organizationId)) {
                throw new websockets_1.WsException('Invalid organization');
            }
            this.logInfo(`Message edited: ${messageDto.messageId} in conversation ${messageDto.conversationId} by user ${user.userId}`);
            const room = `conversation:${messageDto.conversationId}`;
            server.to(room).emit('message:edit', messageDto.toPayload());
        }
        catch (error) {
            this.logError(`Message edit error for user ${user.userId}:`, error);
            client.emit('error', {
                type: 'MESSAGE_EDIT_FAILED',
                message: error.message || 'Failed to edit message',
            });
        }
    }
    async handleMessageDelete(client, server, data) {
        const user = client.user;
        if (!user) {
            throw new websockets_1.WsException('Authentication required');
        }
        const allowed = await this.rateLimiter.checkLimit(user.userId, 'message:delete');
        if (!allowed) {
            client.emit('error', {
                type: 'RATE_LIMIT_EXCEEDED',
                message: 'Delete rate limit exceeded. Please slow down.',
            });
            return;
        }
        try {
            const messageDto = new dto_1.MessageEventDto({
                ...data,
                type: 'delete',
                senderId: user.userId,
                organizationId: user.organizationId,
                content: '',
            });
            if (!messageDto.validateSender(user.userId)) {
                throw new websockets_1.WsException('You can only delete your own messages');
            }
            if (!messageDto.validateOrganization(user.organizationId)) {
                throw new websockets_1.WsException('Invalid organization');
            }
            this.logInfo(`Message deleted: ${messageDto.messageId} in conversation ${messageDto.conversationId} by user ${user.userId}`);
            const room = `conversation:${messageDto.conversationId}`;
            server.to(room).emit('message:delete', {
                messageId: messageDto.messageId,
                conversationId: messageDto.conversationId,
                timestamp: messageDto.timestamp,
            });
        }
        catch (error) {
            this.logError(`Message delete error for user ${user.userId}:`, error);
            client.emit('error', {
                type: 'MESSAGE_DELETE_FAILED',
                message: error.message || 'Failed to delete message',
            });
        }
    }
    handleMessageDelivered(client, server, data) {
        const user = client.user;
        if (!user) {
            throw new websockets_1.WsException('Authentication required');
        }
        try {
            const deliveryDto = new dto_1.MessageDeliveryDto({
                ...data,
                recipientId: user.userId,
                organizationId: user.organizationId,
                status: 'delivered',
            });
            if (!deliveryDto.validateOrganization(user.organizationId)) {
                throw new websockets_1.WsException('Invalid organization');
            }
            this.logDebug(`Message ${deliveryDto.messageId} delivered to user ${user.userId}`);
            const senderRoom = `user:${deliveryDto.senderId}`;
            server.to(senderRoom).emit('message:delivered', deliveryDto.toPayload());
        }
        catch (error) {
            this.logError(`Delivery confirmation error for user ${user.userId}:`, error);
        }
    }
    handleMessageRead(client, server, data) {
        const user = client.user;
        if (!user) {
            throw new websockets_1.WsException('Authentication required');
        }
        try {
            const readReceiptDto = new dto_1.ReadReceiptDto({
                ...data,
                userId: user.userId,
                organizationId: user.organizationId,
            });
            if (!readReceiptDto.validateUser(user.userId)) {
                throw new websockets_1.WsException('Invalid user');
            }
            if (!readReceiptDto.validateOrganization(user.organizationId)) {
                throw new websockets_1.WsException('Invalid organization');
            }
            this.logDebug(`Message ${readReceiptDto.messageId} read by user ${user.userId}`);
            const room = `conversation:${readReceiptDto.conversationId}`;
            server.to(room).emit('message:read', readReceiptDto.toPayload());
        }
        catch (error) {
            this.logError(`Read receipt error for user ${user.userId}:`, error);
        }
    }
    async handleTypingIndicator(client, data) {
        const user = client.user;
        if (!user) {
            throw new websockets_1.WsException('Authentication required');
        }
        const allowed = await this.rateLimiter.checkLimit(user.userId, 'message:typing');
        if (!allowed) {
            return;
        }
        try {
            const typingDto = new dto_1.TypingIndicatorDto({
                ...data,
                userId: user.userId,
                organizationId: user.organizationId,
            });
            if (!typingDto.validateUser(user.userId)) {
                throw new websockets_1.WsException('Invalid user');
            }
            if (!typingDto.validateOrganization(user.organizationId)) {
                throw new websockets_1.WsException('Invalid organization');
            }
            const room = `conversation:${typingDto.conversationId}`;
            client.to(room).emit('message:typing', typingDto.toPayload());
        }
        catch (error) {
            this.logError(`Typing indicator error for user ${user.userId}:`, error);
        }
    }
};
exports.MessageHandlerService = MessageHandlerService;
exports.MessageHandlerService = MessageHandlerService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [rate_limiter_service_1.RateLimiterService])
], MessageHandlerService);
//# sourceMappingURL=message-handler.service.js.map