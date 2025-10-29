/**
 * Message Delivery DTO
 *
 * Data Transfer Object for message delivery confirmations in real-time messaging.
 * Tracks when messages are successfully delivered to recipients.
 *
 * Key Features:
 * - Message delivery confirmation
 * - Multi-recipient tracking
 * - Multi-tenant isolation
 * - Delivery status differentiation
 *
 * Delivery States:
 * - sent: Message sent from sender's client
 * - delivered: Message received by recipient's client
 * - failed: Message delivery failed
 *
 * Usage:
 * - Server emits when message is delivered to recipient's socket
 * - Client updates UI to show delivery status (single checkmark)
 * - Sender can see when message reached recipient
 *
 * @class MessageDeliveryDto
 */
export class MessageDeliveryDto {
  /**
   * Unique identifier of the message
   */
  messageId: string;

  /**
   * Conversation identifier where the message exists
   */
  conversationId: string;

  /**
   * User ID of the recipient who received the message
   */
  recipientId: string;

  /**
   * User ID of the message sender (for notification purposes)
   */
  senderId: string;

  /**
   * Organization ID for multi-tenant isolation
   */
  organizationId: string;

  /**
   * Delivery status
   * - sent: Message sent from sender
   * - delivered: Message received by recipient
   * - failed: Delivery failed
   */
  status: 'sent' | 'delivered' | 'failed';

  /**
   * ISO timestamp when the delivery status was updated
   */
  deliveredAt: string;

  /**
   * Optional error message if delivery failed
   */
  error?: string;

  /**
   * Constructs a MessageDeliveryDto from partial data
   * Validates required fields and sets defaults
   *
   * @param partial - Partial delivery data
   * @throws Error if required fields are missing
   */
  constructor(partial: Partial<MessageDeliveryDto>) {
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

    // Validate status is one of the allowed values
    if (!['sent', 'delivered', 'failed'].includes(partial.status)) {
      throw new Error('status must be sent, delivered, or failed');
    }

    Object.assign(this, partial);

    // Set deliveredAt timestamp if not provided
    if (!this.deliveredAt) {
      this.deliveredAt = new Date().toISOString();
    }
  }

  /**
   * Validates that the organization matches the authenticated user's organization
   *
   * @param organizationId - The authenticated user's organization ID
   * @returns True if organization matches, false otherwise
   */
  validateOrganization(organizationId: string): boolean {
    return this.organizationId === organizationId;
  }

  /**
   * Checks if delivery was successful
   *
   * @returns True if delivered, false otherwise
   */
  isDelivered(): boolean {
    return this.status === 'delivered';
  }

  /**
   * Checks if delivery failed
   *
   * @returns True if failed, false otherwise
   */
  isFailed(): boolean {
    return this.status === 'failed';
  }

  /**
   * Creates a safe payload for broadcasting
   *
   * @returns Sanitized delivery object for client consumption
   */
  toPayload(): Record<string, any> {
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
}
