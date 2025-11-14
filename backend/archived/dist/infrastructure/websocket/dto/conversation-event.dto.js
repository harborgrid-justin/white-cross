"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConversationEventDto = void 0;
const openapi = require("@nestjs/swagger");
class ConversationEventDto {
    conversationId;
    userId;
    organizationId;
    action;
    userName;
    timestamp;
    participants;
    metadata;
    constructor(partial) {
        if (!partial.conversationId) {
            throw new Error('conversationId is required');
        }
        if (!partial.userId) {
            throw new Error('userId is required');
        }
        if (!partial.organizationId) {
            throw new Error('organizationId is required');
        }
        if (!partial.action) {
            throw new Error('action is required');
        }
        if (!['join', 'leave'].includes(partial.action)) {
            throw new Error('action must be join or leave');
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
    isJoin() {
        return this.action === 'join';
    }
    isLeave() {
        return this.action === 'leave';
    }
    getRoomId() {
        return `conversation:${this.conversationId}`;
    }
    toPayload() {
        return {
            conversationId: this.conversationId,
            userId: this.userId,
            userName: this.userName,
            action: this.action,
            timestamp: this.timestamp,
            participants: this.participants,
            metadata: this.metadata,
        };
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { conversationId: { required: true, type: () => String, description: "Unique identifier for the conversation" }, userId: { required: true, type: () => String, description: "User ID of the participant joining/leaving" }, organizationId: { required: true, type: () => String, description: "Organization ID for multi-tenant isolation" }, action: { required: true, type: () => Object, description: "Event type\n- join: User joining the conversation\n- leave: User leaving the conversation" }, userName: { required: false, type: () => String, description: "Optional user display name for UI rendering\nServer can populate this from user data" }, timestamp: { required: true, type: () => String, description: "ISO timestamp when the action occurred" }, participants: { required: false, type: () => [String], description: "Optional: List of current participant user IDs\nServer can populate this when user joins" } };
    }
}
exports.ConversationEventDto = ConversationEventDto;
//# sourceMappingURL=conversation-event.dto.js.map