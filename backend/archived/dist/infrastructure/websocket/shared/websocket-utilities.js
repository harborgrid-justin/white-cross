"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebSocketUtilities = void 0;
const websockets_1 = require("@nestjs/websockets");
class WebSocketUtilities {
    static validateAuth(client) {
        const user = client.user;
        if (!user) {
            throw new websockets_1.WsException('Authentication required');
        }
        return {
            userId: user.userId,
            organizationId: user.organizationId,
        };
    }
    static async checkRateLimit(rateLimiter, client, userId, action, logger) {
        const allowed = await rateLimiter.checkLimit(userId, action);
        if (!allowed) {
            client.emit('error', {
                type: 'RATE_LIMIT_EXCEEDED',
                message: `${action} rate limit exceeded. Please slow down.`,
            });
            logger.debug(`Rate limit exceeded for user ${userId} on action ${action}`);
            return false;
        }
        return true;
    }
    static validateDto(dto, userId, organizationId, client, logger, actionType) {
        try {
            if (dto.validateUser && !dto.validateUser(userId)) {
                throw new websockets_1.WsException('Invalid user');
            }
            if (dto.validateOrganization && !dto.validateOrganization(organizationId)) {
                throw new websockets_1.WsException('Invalid organization');
            }
            return true;
        }
        catch (error) {
            logger.error(`${actionType} validation error for user ${userId}:`, error);
            client.emit('error', {
                type: `${actionType.toUpperCase()}_VALIDATION_FAILED`,
                message: error.message || `${actionType} validation failed`,
            });
            return false;
        }
    }
    static handleError(error, client, userId, actionType, logger) {
        logger.error(`${actionType} error for user ${userId}:`, error);
        client.emit('error', {
            type: `${actionType.toUpperCase()}_FAILED`,
            message: error.message || `Failed to ${actionType.toLowerCase()}`,
        });
    }
    static sendConfirmation(client, eventType, data) {
        client.emit(eventType, data);
    }
    static getConversationRoom(conversationId) {
        return `conversation:${conversationId}`;
    }
    static getUserRoom(userId) {
        return `user:${userId}`;
    }
    static logAction(logger, action, userId, details = {}) {
        const detailsStr = Object.keys(details).length > 0
            ? ` - ${Object.entries(details).map(([k, v]) => `${k}: ${v}`).join(', ')}`
            : '';
        logger.log(`${action} by user ${userId}${detailsStr}`);
    }
    static async executeWithCommonHandling(params) {
        const { client, rateLimiter, logger, action, createDto, validate, execute, onSuccess, skipRateLimit } = params;
        try {
            const { userId, organizationId } = this.validateAuth(client);
            if (!skipRateLimit) {
                const allowed = await this.checkRateLimit(rateLimiter, client, userId, action, logger);
                if (!allowed)
                    return;
            }
            const dto = createDto();
            if (validate && !validate(dto, userId, organizationId)) {
                return;
            }
            const result = await execute(dto, userId, organizationId);
            if (onSuccess) {
                onSuccess(result, dto);
            }
            this.logAction(logger, action, userId);
        }
        catch (error) {
            const user = client.user;
            const userId = user?.userId || 'unknown';
            this.handleError(error, client, userId, action, logger);
        }
    }
}
exports.WebSocketUtilities = WebSocketUtilities;
//# sourceMappingURL=websocket-utilities.js.map