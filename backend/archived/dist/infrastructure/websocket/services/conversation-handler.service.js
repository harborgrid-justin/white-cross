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
exports.ConversationHandlerService = void 0;
const common_1 = require("@nestjs/common");
const websockets_1 = require("@nestjs/websockets");
const dto_1 = require("../dto");
const rate_limiter_service_1 = require("./rate-limiter.service");
const base_1 = require("../../../common/base");
let ConversationHandlerService = class ConversationHandlerService extends base_1.BaseService {
    rateLimiter;
    constructor(rateLimiter) {
        super("ConversationHandlerService");
        this.rateLimiter = rateLimiter;
    }
    async handleConversationJoin(client, data) {
        const user = client.user;
        if (!user) {
            throw new websockets_1.WsException('Authentication required');
        }
        const allowed = await this.rateLimiter.checkLimit(user.userId, 'conversation:join');
        if (!allowed) {
            client.emit('error', {
                type: 'RATE_LIMIT_EXCEEDED',
                message: 'Join rate limit exceeded. Please slow down.',
            });
            return;
        }
        try {
            const conversationDto = new dto_1.ConversationEventDto({
                ...data,
                action: 'join',
                userId: user.userId,
                organizationId: user.organizationId,
            });
            if (!conversationDto.validateUser(user.userId)) {
                throw new websockets_1.WsException('Invalid user');
            }
            if (!conversationDto.validateOrganization(user.organizationId)) {
                throw new websockets_1.WsException('Invalid organization');
            }
            const room = conversationDto.getRoomId();
            await client.join(room);
            this.logInfo(`User ${user.userId} joined conversation ${conversationDto.conversationId}`);
            client.to(room).emit('conversation:join', conversationDto.toPayload());
            client.emit('conversation:joined', {
                conversationId: conversationDto.conversationId,
                timestamp: conversationDto.timestamp,
            });
        }
        catch (error) {
            this.logError(`Conversation join error for user ${user.userId}:`, error);
            client.emit('error', {
                type: 'CONVERSATION_JOIN_FAILED',
                message: error.message || 'Failed to join conversation',
            });
        }
    }
    async handleConversationLeave(client, data) {
        const user = client.user;
        if (!user) {
            throw new websockets_1.WsException('Authentication required');
        }
        try {
            const conversationDto = new dto_1.ConversationEventDto({
                ...data,
                action: 'leave',
                userId: user.userId,
                organizationId: user.organizationId,
            });
            if (!conversationDto.validateUser(user.userId)) {
                throw new websockets_1.WsException('Invalid user');
            }
            if (!conversationDto.validateOrganization(user.organizationId)) {
                throw new websockets_1.WsException('Invalid organization');
            }
            const room = conversationDto.getRoomId();
            client.to(room).emit('conversation:leave', conversationDto.toPayload());
            await client.leave(room);
            this.logInfo(`User ${user.userId} left conversation ${conversationDto.conversationId}`);
            client.emit('conversation:left', {
                conversationId: conversationDto.conversationId,
                timestamp: conversationDto.timestamp,
            });
        }
        catch (error) {
            this.logError(`Conversation leave error for user ${user.userId}:`, error);
            client.emit('error', {
                type: 'CONVERSATION_LEAVE_FAILED',
                message: error.message || 'Failed to leave conversation',
            });
        }
    }
};
exports.ConversationHandlerService = ConversationHandlerService;
exports.ConversationHandlerService = ConversationHandlerService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [rate_limiter_service_1.RateLimiterService])
], ConversationHandlerService);
//# sourceMappingURL=conversation-handler.service.js.map