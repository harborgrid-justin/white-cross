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
var EnhancedWebSocketGateway_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnhancedWebSocketGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const common_1 = require("@nestjs/common");
const socket_io_1 = require("socket.io");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const guards_1 = require("./guards");
const ws_exception_filter_1 = require("./filters/ws-exception.filter");
const ws_validation_pipe_1 = require("./pipes/ws-validation.pipe");
const ws_logging_interceptor_1 = require("./interceptors/ws-logging.interceptor");
const ws_transform_interceptor_1 = require("./interceptors/ws-transform.interceptor");
const services_1 = require("./services");
const ws_auth_middleware_1 = require("./middleware/ws-auth.middleware");
const dto_1 = require("./dto");
let EnhancedWebSocketGateway = EnhancedWebSocketGateway_1 = class EnhancedWebSocketGateway {
    rateLimiter;
    jwtService;
    configService;
    server;
    logger = new common_1.Logger(EnhancedWebSocketGateway_1.name);
    constructor(rateLimiter, jwtService, configService) {
        this.rateLimiter = rateLimiter;
        this.jwtService = jwtService;
        this.configService = configService;
    }
    afterInit(server) {
        this.logger.log('Enhanced WebSocket Gateway initialized');
        server.use((0, ws_auth_middleware_1.createWsAuthMiddleware)(this.jwtService, this.configService));
        this.logger.log('WebSocket server initialized');
        this.logger.log(`Transports: ${JSON.stringify(server._opts?.transports)}`);
        this.configureServer(server);
    }
    async handleConnection(client) {
        const user = client.user;
        if (!user) {
            this.logger.warn(`Connection rejected: No user data (socket: ${client.id})`);
            client.disconnect();
            return;
        }
        this.logger.log(`Client connected: ${client.id} (user: ${user.userId}, org: ${user.organizationId})`);
        try {
            const orgRoom = `org:${user.organizationId}`;
            const userRoom = `user:${user.userId}`;
            await client.join(orgRoom);
            await client.join(userRoom);
            this.logger.log(`Socket ${client.id} joined rooms: ${orgRoom}, ${userRoom}`);
            client.emit('connection:confirmed', {
                socketId: client.id,
                userId: user.userId,
                organizationId: user.organizationId,
                connectedAt: new Date().toISOString(),
            });
            this.server.to(orgRoom).emit('presence:update', {
                userId: user.userId,
                status: 'online',
                timestamp: new Date().toISOString(),
            });
        }
        catch (error) {
            this.logger.error(`Connection setup error for ${client.id}:`, error);
            client.disconnect();
        }
    }
    handleDisconnect(client) {
        const user = client.user;
        if (user) {
            const orgRoom = `org:${user.organizationId}`;
            this.server.to(orgRoom).emit('presence:update', {
                userId: user.userId,
                status: 'offline',
                timestamp: new Date().toISOString(),
            });
            this.logger.log(`Client disconnected: ${client.id} (user: ${user.userId})`);
        }
        else {
            this.logger.log(`Client disconnected: ${client.id}`);
        }
    }
    handlePing() {
        return { pong: new Date().toISOString() };
    }
    async handleMessageSend(client, dto) {
        const user = client.user;
        if (!user) {
            throw new Error('User not authenticated');
        }
        const allowed = await this.rateLimiter.checkLimit(user.userId, 'message:send');
        if (!allowed) {
            throw new Error('Rate limit exceeded');
        }
        const room = `conversation:${dto.conversationId}`;
        this.server.to(room).emit('message:new', {
            messageId: dto.messageId,
            conversationId: dto.conversationId,
            senderId: user.userId,
            content: dto.content,
            metadata: dto.metadata,
            timestamp: new Date().toISOString(),
        });
        return {
            success: true,
            messageId: dto.messageId,
        };
    }
    async handleMessageEdit(client, dto) {
        const user = client.user;
        if (!user) {
            throw new Error('User not authenticated');
        }
        const allowed = await this.rateLimiter.checkLimit(user.userId, 'message:edit');
        if (!allowed) {
            throw new Error('Rate limit exceeded');
        }
        const room = `conversation:${dto.conversationId}`;
        this.server.to(room).emit('message:edited', {
            messageId: dto.messageId,
            conversationId: dto.conversationId,
            content: dto.content,
            editedAt: new Date().toISOString(),
        });
        return { success: true };
    }
    async handleMessageDelete(client, dto) {
        const user = client.user;
        if (!user) {
            throw new Error('User not authenticated');
        }
        const allowed = await this.rateLimiter.checkLimit(user.userId, 'message:delete');
        if (!allowed) {
            throw new Error('Rate limit exceeded');
        }
        const room = `conversation:${dto.conversationId}`;
        this.server.to(room).emit('message:deleted', {
            messageId: dto.messageId,
            conversationId: dto.conversationId,
            timestamp: new Date().toISOString(),
        });
        return { success: true };
    }
    async handleConversationJoin(client, dto) {
        const user = client.user;
        if (!user) {
            throw new Error('User not authenticated');
        }
        const room = `conversation:${dto.conversationId}`;
        await client.join(room);
        this.logger.log(`User ${user.userId} joined conversation ${dto.conversationId}`);
        client.to(room).emit('conversation:user-joined', {
            userId: user.userId,
            conversationId: dto.conversationId,
            timestamp: new Date().toISOString(),
        });
        return {
            success: true,
            conversationId: dto.conversationId,
        };
    }
    async handleTypingIndicator(client, dto) {
        const user = client.user;
        if (!user) {
            return;
        }
        const allowed = await this.rateLimiter.checkLimit(user.userId, 'message:typing');
        if (!allowed) {
            return;
        }
        const room = `conversation:${dto.conversationId}`;
        client.to(room).emit('typing:update', {
            userId: user.userId,
            conversationId: dto.conversationId,
            isTyping: dto.isTyping,
            timestamp: new Date().toISOString(),
        });
    }
    configureServer(server) {
        server.sockets.setMaxListeners(100);
        this.logger.log('Server configuration completed');
    }
};
exports.EnhancedWebSocketGateway = EnhancedWebSocketGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], EnhancedWebSocketGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('ping'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Object)
], EnhancedWebSocketGateway.prototype, "handlePing", null);
__decorate([
    (0, common_1.UseGuards)(guards_1.WsJwtAuthGuard),
    (0, common_1.UsePipes)(new ws_validation_pipe_1.WsValidationPipe()),
    (0, websockets_1.SubscribeMessage)('message:send'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dto_1.SendMessageDto]),
    __metadata("design:returntype", Promise)
], EnhancedWebSocketGateway.prototype, "handleMessageSend", null);
__decorate([
    (0, common_1.UseGuards)(guards_1.WsJwtAuthGuard),
    (0, common_1.UsePipes)(new ws_validation_pipe_1.WsValidationPipe()),
    (0, websockets_1.SubscribeMessage)('message:edit'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dto_1.EditMessageDto]),
    __metadata("design:returntype", Promise)
], EnhancedWebSocketGateway.prototype, "handleMessageEdit", null);
__decorate([
    (0, common_1.UseGuards)(guards_1.WsJwtAuthGuard),
    (0, common_1.UsePipes)(new ws_validation_pipe_1.WsValidationPipe()),
    (0, websockets_1.SubscribeMessage)('message:delete'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dto_1.DeleteMessageDto]),
    __metadata("design:returntype", Promise)
], EnhancedWebSocketGateway.prototype, "handleMessageDelete", null);
__decorate([
    (0, common_1.UseGuards)(guards_1.WsJwtAuthGuard),
    (0, common_1.UsePipes)(new ws_validation_pipe_1.WsValidationPipe()),
    (0, websockets_1.SubscribeMessage)('conversation:join'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dto_1.JoinConversationDto]),
    __metadata("design:returntype", Promise)
], EnhancedWebSocketGateway.prototype, "handleConversationJoin", null);
__decorate([
    (0, common_1.UseGuards)(guards_1.WsJwtAuthGuard),
    (0, common_1.UsePipes)(new ws_validation_pipe_1.WsValidationPipe()),
    (0, websockets_1.SubscribeMessage)('typing:indicator'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dto_1.TypingIndicatorInputDto]),
    __metadata("design:returntype", Promise)
], EnhancedWebSocketGateway.prototype, "handleTypingIndicator", null);
exports.EnhancedWebSocketGateway = EnhancedWebSocketGateway = EnhancedWebSocketGateway_1 = __decorate([
    (0, common_1.UseFilters)(new ws_exception_filter_1.WsExceptionFilter()),
    (0, common_1.UseInterceptors)(ws_logging_interceptor_1.WsLoggingInterceptor, ws_transform_interceptor_1.WsTransformInterceptor),
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
            credentials: true,
            methods: ['GET', 'POST'],
        },
        path: '/socket.io',
        transports: ['websocket', 'polling'],
        pingTimeout: 60000,
        pingInterval: 25000,
        namespace: '/enhanced',
    }),
    __metadata("design:paramtypes", [services_1.RateLimiterService,
        jwt_1.JwtService,
        config_1.ConfigService])
], EnhancedWebSocketGateway);
//# sourceMappingURL=websocket-enhanced.gateway.js.map