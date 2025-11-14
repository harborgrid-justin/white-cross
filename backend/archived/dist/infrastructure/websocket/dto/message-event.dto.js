"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageEventDto = void 0;
const openapi = require("@nestjs/swagger");
class MessageEventDto {
    messageId;
    conversationId;
    senderId;
    organizationId;
    content;
    type;
    recipientIds;
    metadata;
    timestamp;
    editedAt;
    constructor(partial) {
        if (!partial.messageId) {
            throw new Error('messageId is required');
        }
        if (!partial.conversationId) {
            throw new Error('conversationId is required');
        }
        if (!partial.senderId) {
            throw new Error('senderId is required');
        }
        if (!partial.organizationId) {
            throw new Error('organizationId is required');
        }
        if (!partial.type) {
            throw new Error('type is required');
        }
        if (!['send', 'edit', 'delete'].includes(partial.type)) {
            throw new Error('type must be send, edit, or delete');
        }
        if ((partial.type === 'send' || partial.type === 'edit') && !partial.content) {
            throw new Error('content is required for send and edit operations');
        }
        Object.assign(this, partial);
        if (!this.timestamp) {
            this.timestamp = new Date().toISOString();
        }
        if (this.type === 'edit' && !this.editedAt) {
            this.editedAt = new Date().toISOString();
        }
    }
    validateSender(userId) {
        return this.senderId === userId;
    }
    validateOrganization(organizationId) {
        return this.organizationId === organizationId;
    }
    isDirectMessage() {
        return !!this.recipientIds && this.recipientIds.length > 0;
    }
    toPayload() {
        return {
            messageId: this.messageId,
            conversationId: this.conversationId,
            senderId: this.senderId,
            content: this.content,
            type: this.type,
            metadata: this.metadata,
            timestamp: this.timestamp,
            editedAt: this.editedAt,
        };
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { messageId: { required: true, type: () => String, description: "Unique identifier for the message\nGenerated on client or server" }, conversationId: { required: true, type: () => String, description: "Conversation identifier this message belongs to\nFormat: UUID or similar unique identifier" }, senderId: { required: true, type: () => String, description: "User ID of the message sender\nMust match authenticated user for new messages" }, organizationId: { required: true, type: () => String, description: "Organization ID for multi-tenant isolation\nValidated against authenticated user's organization" }, content: { required: false, type: () => String, description: "Message content text\nPlain text or markdown format\nRequired for send/edit, optional for delete" }, type: { required: true, type: () => Object, description: "Message type discriminator\n- send: New message creation\n- edit: Update existing message content\n- delete: Mark message as deleted" }, recipientIds: { required: false, type: () => [String], description: "Array of recipient user IDs for direct messages\nEmpty for group conversations (uses conversation membership)" }, timestamp: { required: true, type: () => String, description: "ISO timestamp when the message was originally sent\nFor edit operations, this is the original send time" }, editedAt: { required: false, type: () => String, description: "ISO timestamp when the message was last edited\nOnly present for edit operations" } };
    }
}
exports.MessageEventDto = MessageEventDto;
//# sourceMappingURL=message-event.dto.js.map