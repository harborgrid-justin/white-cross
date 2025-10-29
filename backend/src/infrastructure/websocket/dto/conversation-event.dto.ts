/**
 * Conversation Event DTO
 *
 * Data Transfer Object for conversation room management events.
 * Handles joining and leaving conversation rooms for real-time messaging.
 *
 * Key Features:
 * - Room-based message isolation
 * - Multi-tenant security validation
 * - Presence tracking integration
 * - Participant management
 *
 * Usage:
 * - conversation:join - User joins a conversation room
 * - conversation:leave - User leaves a conversation room
 * - Server validates access and manages room membership
 *
 * @class ConversationEventDto
 */
export class ConversationEventDto {
  /**
   * Unique identifier for the conversation
   */
  conversationId: string;

  /**
   * User ID of the participant joining/leaving
   */
  userId: string;

  /**
   * Organization ID for multi-tenant isolation
   */
  organizationId: string;

  /**
   * Event type
   * - join: User joining the conversation
   * - leave: User leaving the conversation
   */
  action: 'join' | 'leave';

  /**
   * Optional user display name for UI rendering
   * Server can populate this from user data
   */
  userName?: string;

  /**
   * ISO timestamp when the action occurred
   */
  timestamp: string;

  /**
   * Optional: List of current participant user IDs
   * Server can populate this when user joins
   */
  participants?: string[];

  /**
   * Optional: Conversation metadata
   * Can include conversation name, type, etc.
   */
  metadata?: {
    /**
     * Conversation name or title
     */
    name?: string;

    /**
     * Conversation type
     * - direct: One-on-one conversation
     * - group: Group conversation
     */
    type?: 'direct' | 'group';

    /**
     * Total participant count
     */
    participantCount?: number;

    /**
     * Custom metadata
     */
    [key: string]: any;
  };

  /**
   * Constructs a ConversationEventDto from partial data
   * Validates required fields and sets defaults
   *
   * @param partial - Partial conversation event data
   * @throws Error if required fields are missing
   */
  constructor(partial: Partial<ConversationEventDto>) {
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

    // Validate action is one of the allowed values
    if (!['join', 'leave'].includes(partial.action)) {
      throw new Error('action must be join or leave');
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
   * Checks if this is a join action
   *
   * @returns True if joining, false otherwise
   */
  isJoin(): boolean {
    return this.action === 'join';
  }

  /**
   * Checks if this is a leave action
   *
   * @returns True if leaving, false otherwise
   */
  isLeave(): boolean {
    return this.action === 'leave';
  }

  /**
   * Gets the Socket.io room identifier for this conversation
   *
   * @returns Room identifier string
   */
  getRoomId(): string {
    return `conversation:${this.conversationId}`;
  }

  /**
   * Creates a safe payload for broadcasting
   *
   * @returns Sanitized conversation event object for client consumption
   */
  toPayload(): Record<string, any> {
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
}
