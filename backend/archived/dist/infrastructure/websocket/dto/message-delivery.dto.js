"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageDeliveryDto = void 0;
const openapi = require("@nestjs/swagger");
class MessageDeliveryDto {
    messageId;
    conversationId;
    recipientId;
    senderId;
    organizationId;
    status;
    deliveredAt;
    error;
    constructor(partial) {
        if (!partial.messageId) {
            throw new Error('messageId is required');
        }
        if (!partial.conversationId) {
            throw new Error('conversationId is required');
        }
        if (!partial.recipientId) {
            throw new Error('recipientId is required');
        }
        if (!partial.senderId) {
            throw new Error('senderId is required');
        }
        if (!partial.organizationId) {
            throw new Error('organizationId is required');
        }
        if (!partial.status) {
            throw new Error('status is required');
        }
        if (!['sent', 'delivered', 'failed'].includes(partial.status)) {
            throw new Error('status must be sent, delivered, or failed');
        }
        Object.assign(this, partial);
        if (!this.deliveredAt) {
            this.deliveredAt = new Date().toISOString();
        }
    }
    validateOrganization(organizationId) {
        return this.organizationId === organizationId;
    }
    isDelivered() {
        return this.status === 'delivered';
    }
    isFailed() {
        return this.status === 'failed';
    }
    toPayload() {
        return {
            messageId: this.messageId,
            conversationId: this.conversationId,
            recipientId: this.recipientId,
            senderId: this.senderId,
            status: this.status,
            deliveredAt: this.deliveredAt,
            error: this.error,
        };
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { messageId: { required: true, type: () => String, description: "Unique identifier of the message" }, conversationId: { required: true, type: () => String, description: "Conversation identifier where the message exists" }, recipientId: { required: true, type: () => String, description: "User ID of the recipient who received the message" }, senderId: { required: true, type: () => String, description: "User ID of the message sender (for notification purposes)" }, organizationId: { required: true, type: () => String, description: "Organization ID for multi-tenant isolation" }, status: { required: true, type: () => Object, description: "Delivery status\n- sent: Message sent from sender\n- delivered: Message received by recipient\n- failed: Delivery failed" }, deliveredAt: { required: true, type: () => String, description: "ISO timestamp when the delivery status was updated" }, error: { required: false, type: () => String, description: "Optional error message if delivery failed" } };
    }
}
exports.MessageDeliveryDto = MessageDeliveryDto;
//# sourceMappingURL=message-delivery.dto.js.map