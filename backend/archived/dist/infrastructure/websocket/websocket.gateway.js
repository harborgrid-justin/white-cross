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
var WebSocketGateway_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebSocketGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const common_1 = require("@nestjs/common");
const socket_io_1 = require("socket.io");
const guards_1 = require("./guards");
const ws_exception_filter_1 = require("./filters/ws-exception.filter");
const connection_manager_service_1 = require("./services/connection-manager.service");
const message_handler_service_1 = require("./services/message-handler.service");
const conversation_handler_service_1 = require("./services/conversation-handler.service");
const presence_manager_service_1 = require("./services/presence-manager.service");
let WebSocketGateway = WebSocketGateway_1 = class WebSocketGateway {
    connectionManager;
    messageHandler;
    conversationHandler;
    presenceManager;
    server;
    logger = new common_1.Logger(WebSocketGateway_1.name);
    constructor(connectionManager, messageHandler, conversationHandler, presenceManager) {
        this.connectionManager = connectionManager;
        this.messageHandler = messageHandler;
        this.conversationHandler = conversationHandler;
        this.presenceManager = presenceManager;
    }
    async handleConnection(client) {
        try {
            await this.connectionManager.handleConnection(client);
            const user = client.user;
            if (user) {
                this.presenceManager.setUserOnline(user.userId, this.server, user.organizationId);
            }
        }
        catch (error) {
            this.logger.error(`Connection error for ${client.id}:`, error);
            client.disconnect();
        }
    }
    handleDisconnect(client) {
        const user = client.user;
        if (user) {
            this.presenceManager.setUserOffline(user.userId, this.server, user.organizationId);
        }
        this.connectionManager.handleDisconnect(client);
    }
    handlePing(client) {
        this.connectionManager.handlePing(client);
    }
    async handleSubscribe(client, channel) {
        await this.connectionManager.handleSubscribe(client, channel);
    }
    async handleUnsubscribe(client, channel) {
        await this.connectionManager.handleUnsubscribe(client, channel);
    }
    handleNotificationRead(client, notificationId) {
        this.connectionManager.handleNotificationRead(client, notificationId);
    }
    async handleMessageSend(client, data) {
        await this.messageHandler.handleMessageSend(client, this.server, data);
    }
    async handleMessageEdit(client, data) {
        await this.messageHandler.handleMessageEdit(client, this.server, data);
    }
    async handleMessageDelete(client, data) {
        await this.messageHandler.handleMessageDelete(client, this.server, data);
    }
    async handleMessageDelivered(client, data) {
        this.messageHandler.handleMessageDelivered(client, this.server, data);
    }
    async handleMessageRead(client, data) {
        this.messageHandler.handleMessageRead(client, this.server, data);
    }
    async handleTypingIndicator(client, data) {
        await this.messageHandler.handleTypingIndicator(client, data);
    }
    async handleConversationJoin(client, data) {
        await this.conversationHandler.handleConversationJoin(client, data);
    }
    async handleConversationLeave(client, data) {
        await this.conversationHandler.handleConversationLeave(client, data);
    }
    async handlePresenceUpdate(client, status) {
        this.presenceManager.handlePresenceUpdate(client, this.server, status);
    }
    getConnectedSocketsCount() {
        return this.connectionManager.getConnectedSocketsCount(this.server);
    }
    isInitialized() {
        return this.connectionManager.isInitialized(this.server);
    }
    getUserPresence(userId) {
        return this.presenceManager.getUserPresence(userId);
    }
};
exports.WebSocketGateway = WebSocketGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], WebSocketGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('ping'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], WebSocketGateway.prototype, "handlePing", null);
__decorate([
    (0, common_1.UseGuards)(guards_1.WsJwtAuthGuard),
    (0, websockets_1.SubscribeMessage)('subscribe'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], WebSocketGateway.prototype, "handleSubscribe", null);
__decorate([
    (0, common_1.UseGuards)(guards_1.WsJwtAuthGuard),
    (0, websockets_1.SubscribeMessage)('unsubscribe'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], WebSocketGateway.prototype, "handleUnsubscribe", null);
__decorate([
    (0, common_1.UseGuards)(guards_1.WsJwtAuthGuard),
    (0, websockets_1.SubscribeMessage)('notification:read'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], WebSocketGateway.prototype, "handleNotificationRead", null);
__decorate([
    (0, common_1.UseGuards)(guards_1.WsJwtAuthGuard),
    (0, websockets_1.SubscribeMessage)('message:send'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], WebSocketGateway.prototype, "handleMessageSend", null);
__decorate([
    (0, common_1.UseGuards)(guards_1.WsJwtAuthGuard),
    (0, websockets_1.SubscribeMessage)('message:edit'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], WebSocketGateway.prototype, "handleMessageEdit", null);
__decorate([
    (0, common_1.UseGuards)(guards_1.WsJwtAuthGuard),
    (0, websockets_1.SubscribeMessage)('message:delete'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], WebSocketGateway.prototype, "handleMessageDelete", null);
__decorate([
    (0, common_1.UseGuards)(guards_1.WsJwtAuthGuard),
    (0, websockets_1.SubscribeMessage)('message:delivered'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], WebSocketGateway.prototype, "handleMessageDelivered", null);
__decorate([
    (0, common_1.UseGuards)(guards_1.WsJwtAuthGuard),
    (0, websockets_1.SubscribeMessage)('message:read'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], WebSocketGateway.prototype, "handleMessageRead", null);
__decorate([
    (0, common_1.UseGuards)(guards_1.WsJwtAuthGuard),
    (0, websockets_1.SubscribeMessage)('message:typing'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], WebSocketGateway.prototype, "handleTypingIndicator", null);
__decorate([
    (0, common_1.UseGuards)(guards_1.WsJwtAuthGuard),
    (0, websockets_1.SubscribeMessage)('conversation:join'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], WebSocketGateway.prototype, "handleConversationJoin", null);
__decorate([
    (0, common_1.UseGuards)(guards_1.WsJwtAuthGuard),
    (0, websockets_1.SubscribeMessage)('conversation:leave'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], WebSocketGateway.prototype, "handleConversationLeave", null);
__decorate([
    (0, common_1.UseGuards)(guards_1.WsJwtAuthGuard),
    (0, websockets_1.SubscribeMessage)('presence:update'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], WebSocketGateway.prototype, "handlePresenceUpdate", null);
exports.WebSocketGateway = WebSocketGateway = WebSocketGateway_1 = __decorate([
    (0, common_1.UseFilters)(new ws_exception_filter_1.WsExceptionFilter()),
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: 'http://localhost:5173',
            credentials: true,
            methods: ['GET', 'POST'],
        },
        path: '/socket.io',
        transports: ['websocket', 'polling'],
        pingTimeout: 60000,
        pingInterval: 25000,
    }),
    __metadata("design:paramtypes", [connection_manager_service_1.ConnectionManagerService,
        message_handler_service_1.MessageHandlerService,
        conversation_handler_service_1.ConversationHandlerService,
        presence_manager_service_1.PresenceManagerService])
], WebSocketGateway);
//# sourceMappingURL=websocket.gateway.js.map