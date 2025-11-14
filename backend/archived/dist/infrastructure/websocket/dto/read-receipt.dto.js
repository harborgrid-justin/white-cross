"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReadReceiptDto = void 0;
const openapi = require("@nestjs/swagger");
class ReadReceiptDto {
    messageId;
    conversationId;
    userId;
    organizationId;
    userName;
    readAt;
    lastReadMessageId;
    constructor(partial) {
        if (!partial.messageId) {
            throw new Error('messageId is required');
        }
        if (!partial.conversationId) {
            throw new Error('conversationId is required');
        }
        if (!partial.userId) {
            throw new Error('userId is required');
        }
        if (!partial.organizationId) {
            throw new Error('organizationId is required');
        }
        Object.assign(this, partial);
        if (!this.readAt) {
            this.readAt = new Date().toISOString();
        }
    }
    validateUser(userId) {
        return this.userId === userId;
    }
    validateOrganization(organizationId) {
        return this.organizationId === organizationId;
    }
    isBatchReceipt() {
        return (!!this.lastReadMessageId && this.lastReadMessageId !== this.messageId);
    }
    toPayload() {
        return {
            messageId: this.messageId,
            conversationId: this.conversationId,
            userId: this.userId,
            userName: this.userName,
            readAt: this.readAt,
            lastReadMessageId: this.lastReadMessageId,
        };
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { messageId: { required: true, type: () => String, description: "Unique identifier of the message that was read" }, conversationId: { required: true, type: () => String, description: "Conversation identifier where the message exists" }, userId: { required: true, type: () => String, description: "User ID of the person who read the message" }, organizationId: { required: true, type: () => String, description: "Organization ID for multi-tenant isolation" }, userName: { required: false, type: () => String, description: "Optional user display name for UI rendering\nServer can populate this from user data" }, readAt: { required: true, type: () => String, description: "ISO timestamp when the message was read" }, lastReadMessageId: { required: false, type: () => String, description: "Optional: Last message ID that was read in the conversation\nUsed for marking all messages up to this point as read" } };
    }
}
exports.ReadReceiptDto = ReadReceiptDto;
//# sourceMappingURL=read-receipt.dto.js.map