"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypingIndicatorDto = void 0;
const openapi = require("@nestjs/swagger");
class TypingIndicatorDto {
    userId;
    conversationId;
    organizationId;
    isTyping;
    userName;
    timestamp;
    constructor(partial) {
        if (!partial.userId) {
            throw new Error('userId is required');
        }
        if (!partial.conversationId) {
            throw new Error('conversationId is required');
        }
        if (!partial.organizationId) {
            throw new Error('organizationId is required');
        }
        if (typeof partial.isTyping !== 'boolean') {
            throw new Error('isTyping must be a boolean');
        }
        Object.assign(this, partial);
        if (!this.timestamp) {
            this.timestamp = new Date().toISOString();
        }
    }
    validateUser(userId) {
        return this.userId === userId;
    }
    validateOrganization(organizationId) {
        return this.organizationId === organizationId;
    }
    isStale(thresholdMs = 10000) {
        const timestamp = new Date(this.timestamp).getTime();
        const now = Date.now();
        return now - timestamp > thresholdMs;
    }
    toPayload() {
        return {
            userId: this.userId,
            conversationId: this.conversationId,
            isTyping: this.isTyping,
            userName: this.userName,
            timestamp: this.timestamp,
        };
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { userId: { required: true, type: () => String, description: "User ID of the person typing" }, conversationId: { required: true, type: () => String, description: "Conversation identifier where typing is occurring" }, organizationId: { required: true, type: () => String, description: "Organization ID for multi-tenant isolation" }, isTyping: { required: true, type: () => Boolean, description: "Typing status\n- true: User is currently typing\n- false: User stopped typing" }, userName: { required: false, type: () => String, description: "Optional user display name for UI rendering\nServer can populate this from user data" }, timestamp: { required: true, type: () => String, description: "ISO timestamp when the typing status changed\nUsed for automatic expiry of stale indicators" } };
    }
}
exports.TypingIndicatorDto = TypingIndicatorDto;
//# sourceMappingURL=typing-indicator.dto.js.map