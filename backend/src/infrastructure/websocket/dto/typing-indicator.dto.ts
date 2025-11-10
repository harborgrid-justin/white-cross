/**
 * Typing Indicator DTO
 *
 * Data Transfer Object for real-time typing status indicators in conversations.
 * Provides visual feedback to users when others are composing messages.
 *
 * Key Features:
 * - Real-time typing status updates
 * - Multi-tenant isolation
 * - Conversation-scoped indicators
 * - Automatic expiry via timestamp
 *
 * Usage:
 * - Client emits when user starts/stops typing
 * - Server broadcasts to conversation participants
 * - Client UI shows typing indicators
 *
 * @class TypingIndicatorDto
 */
export class TypingIndicatorDto {
  /**
   * User ID of the person typing
   */
  userId!: string;

  /**
   * Conversation identifier where typing is occurring
   */
  conversationId!: string;

  /**
   * Organization ID for multi-tenant isolation
   */
  organizationId!: string;

  /**
   * Typing status
   * - true: User is currently typing
   * - false: User stopped typing
   */
  isTyping!: boolean;

  /**
   * Optional user display name for UI rendering
   * Server can populate this from user data
   */
  userName?: string;

  /**
   * ISO timestamp when the typing status changed
   * Used for automatic expiry of stale indicators
   */
  timestamp!: string;

  /**
   * Constructs a TypingIndicatorDto from partial data
   * Validates required fields and sets defaults
   *
   * @param partial - Partial typing indicator data
   * @throws Error if required fields are missing
   */
  constructor(partial: Partial<TypingIndicatorDto>) {
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

    // Set timestamp if not provided
    if (!this.timestamp) {
      this.timestamp = new Date().toISOString();
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
   * Checks if the typing indicator is stale (older than threshold)
   * Typing indicators typically expire after 5-10 seconds of inactivity
   *
   * @param thresholdMs - Milliseconds threshold (default: 10000ms = 10 seconds)
   * @returns True if indicator is stale, false otherwise
   */
  isStale(thresholdMs: number = 10000): boolean {
    const timestamp = new Date(this.timestamp).getTime();
    const now = Date.now();
    return now - timestamp > thresholdMs;
  }

  /**
   * Creates a safe payload for broadcasting
   *
   * @returns Sanitized typing indicator object for client consumption
   */
  toPayload(): Record<string, any> {
    return {
      userId: this.userId,
      conversationId: this.conversationId,
      isTyping: this.isTyping,
      userName: this.userName,
      timestamp: this.timestamp,
    };
  }
}
