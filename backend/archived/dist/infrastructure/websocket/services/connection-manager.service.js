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
exports.ConnectionManagerService = void 0;
const common_1 = require("@nestjs/common");
const dto_1 = require("../dto");
const base_1 = require("../../../common/base");
let ConnectionManagerService = class ConnectionManagerService extends base_1.BaseService {
    constructor() {
        super("ConnectionManagerService");
    }
    async handleConnection(client) {
        try {
            const token = this.extractToken(client);
            if (!token) {
                this.logWarning(`Connection rejected: No authentication token provided`);
                client.disconnect();
                return;
            }
            const user = client.user;
            if (!user) {
                this.logWarning(`Connection rejected: Authentication failed`);
                client.disconnect();
                return;
            }
            this.logInfo(`WebSocket connected: ${client.id} (user: ${user.userId})`);
            const orgRoom = `org:${user.organizationId}`;
            const userRoom = `user:${user.userId}`;
            await client.join(orgRoom);
            await client.join(userRoom);
            this.logInfo(`Socket ${client.id} joined rooms: ${orgRoom}, ${userRoom}`);
            const confirmation = new dto_1.ConnectionConfirmedDto({
                socketId: client.id,
                userId: user.userId,
                organizationId: user.organizationId,
                connectedAt: new Date().toISOString(),
            });
            client.emit('connection:confirmed', confirmation);
        }
        catch (error) {
            this.logError(`Connection error for ${client.id}:`, error);
            client.disconnect();
        }
    }
    handleDisconnect(client) {
        const user = client.user;
        if (user) {
            this.logInfo(`WebSocket disconnected: ${client.id} (user: ${user.userId})`);
        }
        else {
            this.logInfo(`WebSocket disconnected: ${client.id}`);
        }
    }
    handlePing(client) {
        client.emit('pong', { timestamp: new Date().toISOString() });
    }
    async handleSubscribe(client, channel) {
        const user = client.user;
        if (!user) {
            client.emit('error', { message: 'Authentication required' });
            return;
        }
        if (channel.startsWith(`org:${user.organizationId}:`)) {
            await client.join(channel);
            this.logInfo(`Socket ${client.id} subscribed to ${channel}`);
            client.emit('subscribed', { channel });
        }
        else {
            this.logWarning(`Socket ${client.id} attempted to subscribe to unauthorized channel: ${channel}`);
            client.emit('error', { message: 'Unauthorized channel subscription' });
        }
    }
    async handleUnsubscribe(client, channel) {
        await client.leave(channel);
        this.logInfo(`Socket ${client.id} unsubscribed from ${channel}`);
        client.emit('unsubscribed', { channel });
    }
    handleNotificationRead(client, notificationId) {
        const user = client.user;
        if (!user) {
            client.emit('error', { message: 'Authentication required' });
            return;
        }
        this.logInfo(`Notification ${notificationId} marked as read by user ${user.userId}`);
        client.to(`user:${user.userId}`).emit('notification:read', { notificationId });
    }
    getConnectedSocketsCount(server) {
        return server?.sockets.sockets.size || 0;
    }
    isInitialized(server) {
        return !!server;
    }
    extractToken(client) {
        const authToken = client.handshake.auth?.token;
        if (authToken) {
            return authToken;
        }
        const authHeader = client.handshake.headers?.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            return authHeader.replace('Bearer ', '');
        }
        return null;
    }
};
exports.ConnectionManagerService = ConnectionManagerService;
exports.ConnectionManagerService = ConnectionManagerService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], ConnectionManagerService);
//# sourceMappingURL=connection-manager.service.js.map