/**
 * Read Receipt DTO
 *
 * Data Transfer Object for message read confirmations in real-time conversations.
 * Tracks when users have read messages for better communication feedback.
 *
 * Key Features:
 * - Message-level read tracking
 * - Multi-user read status (group conversations)
 * - Multi-tenant isolation
 * - Timestamp for read history
 *
 * Usage:
 * - Client emits when user reads a message
 * - Server broadcasts to message sender and conversation participants
 * - Client UI shows read receipts (checkmarks, avatars, etc.)
 *
 * @class ReadReceiptDto
 */
export class ReadReceiptDto {
  /**
   * Unique identifier of the message that was read
   */
  messageId!: string;

  /**
   * Conversation identifier where the message exists
   */
  conversationId!: string;

  /**
   * User ID of the person who read the message
   */
  userId!: string;

  /**
   * Organization ID for multi-tenant isolation
   */
  organizationId!: string;

  /**
   * Optional user display name for UI rendering
   * Server can populate this from user data
   */
  userName?: string;

  /**
   * ISO timestamp when the message was read
   */
  readAt!: string;

  /**
   * Optional: Last message ID that was read in the conversation
   * Used for marking all messages up to this point as read
   */
  lastReadMessageId?: string;

  /**
   * Constructs a ReadReceiptDto from partial data
   * Validates required fields and sets defaults
   *
   * @param partial - Partial read receipt data
   * @throws Error if required fields are missing
   */
  constructor(partial: Partial<ReadReceiptDto>) {
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

    // Set readAt timestamp if not provided
    if (!this.readAt) {
      this.readAt = new Date().toISOString();
    }
  }

  /**
   * Validates that the user matches the authenticated user
   *
   * @param userId - The authenticated user ID
   * @returns True if user matches, false otherwise
   */
  validateUser(userId: string): boolean {
    return this.userId === userId;
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
   * Checks if this is a batch read receipt (marks multiple messages as read)
   *
   * @returns True if batch read receipt, false otherwise
   */
  isBatchReceipt(): boolean {
    return (
      !!this.lastReadMessageId && this.lastReadMessageId !== this.messageId
    );
  }

  /**
   * Creates a safe payload for broadcasting
   *
   * @returns Sanitized read receipt object for client consumption
   */
  toPayload(): Record<string, any> {
    return {
      messageId: this.messageId,
      conversationId: this.conversationId,
      userId: this.userId,
      userName: this.userName,
      readAt: this.readAt,
      lastReadMessageId: this.lastReadMessageId,
    };
  }
}
