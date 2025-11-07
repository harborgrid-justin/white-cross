/**
 * Message Event DTO
 *
 * Data Transfer Object for real-time message operations (send, edit, delete).
 * Supports both private direct messages and group conversation messages.
 *
 * Key Features:
 * - Multi-tenant isolation via organizationId
 * - Support for text messages and rich content
 * - Message editing and deletion operations
 * - Conversation context tracking
 * - Comprehensive validation and type safety
 *
 * Usage:
 * - message:send - Send a new message
 * - message:edit - Edit existing message content
 * - message:delete - Mark message as deleted
 *
 * @class MessageEventDto
 */

import type { JsonValue } from './broadcast-message.dto';

export class MessageEventDto {
  /**
   * Unique identifier for the message
   * Generated on client or server
   */
  messageId: string;

  /**
   * Conversation identifier this message belongs to
   * Format: UUID or similar unique identifier
   */
  conversationId: string;

  /**
   * User ID of the message sender
   * Must match authenticated user for new messages
   */
  senderId: string;

  /**
   * Organization ID for multi-tenant isolation
   * Validated against authenticated user's organization
   */
  organizationId: string;

  /**
   * Message content text
   * Plain text or markdown format
   * Required for send/edit, optional for delete
   */
  content?: string;

  /**
   * Message type discriminator
   * - send: New message creation
   * - edit: Update existing message content
   * - delete: Mark message as deleted
   */
  type: 'send' | 'edit' | 'delete';

  /**
   * Array of recipient user IDs for direct messages
   * Empty for group conversations (uses conversation membership)
   */
  recipientIds?: string[];

  /**
   * Optional metadata for rich messages
   * Can include mentions, attachments references, etc.
   */
  metadata?: {
    /**
     * User IDs mentioned in the message
     */
    mentions?: string[];

    /**
     * Attachment IDs (if any)
     */
    attachments?: string[];

    /**
     * Reply to message ID (threading)
     */
    replyToMessageId?: string;

    /**
     * Custom metadata fields (JSON-serializable values only)
     */
    [key: string]: JsonValue;
  };

  /**
   * ISO timestamp when the message was originally sent
   * For edit operations, this is the original send time
   */
  timestamp: string;

  /**
   * ISO timestamp when the message was last edited
   * Only present for edit operations
   */
  editedAt?: string;

  /**
   * Constructs a MessageEventDto from partial data
   * Validates required fields and sets defaults
   *
   * @param partial - Partial message event data
   * @throws Error if required fields are missing
   */
  constructor(partial: Partial<MessageEventDto>) {
    // Validate required fields based on message type
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

    // Validate type is one of the allowed values
    if (!['send', 'edit', 'delete'].includes(partial.type)) {
      throw new Error('type must be send, edit, or delete');
    }

    // Validate content is present for send and edit operations
    if ((partial.type === 'send' || partial.type === 'edit') && !partial.content) {
      throw new Error('content is required for send and edit operations');
    }

    // Assign all properties
    Object.assign(this, partial);

    // Set timestamp if not provided
    if (!this.timestamp) {
      this.timestamp = new Date().toISOString();
    }

    // Set editedAt for edit operations
    if (this.type === 'edit' && !this.editedAt) {
      this.editedAt = new Date().toISOString();
    }
  }

  /**
   * Validates that the sender matches the authenticated user
   *
   * @param userId - The authenticated user ID
   * @returns True if sender matches, false otherwise
   */
  validateSender(userId: string): boolean {
    return this.senderId === userId;
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
   * Checks if this is a direct message (has specific recipients)
   *
   * @returns True if direct message, false if group conversation
   */
  isDirectMessage(): boolean {
    return !!this.recipientIds && this.recipientIds.length > 0;
  }

  /**
   * Creates a safe payload for broadcasting (removes sensitive fields)
   *
   * @returns Sanitized message object for client consumption
   */
  toPayload(): Record<string, JsonValue | undefined> {
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
}
