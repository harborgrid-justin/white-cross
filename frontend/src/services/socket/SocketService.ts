/**
 * Socket Service
 *
 * Main Socket.io service class with messaging, channel, and queue operations.
 * Extends SocketServiceBase to provide complete socket functionality.
 *
 * @module services/socket/SocketService
 */

import { SocketServiceBase } from './SocketServiceBase';
import type { SocketConfig, SendMessagePayload, Message } from './types';

/**
 * Main Socket Service orchestrator
 * Manages Socket.io connections, events, message operations, channels, and queues
 */
export class SocketService extends SocketServiceBase {
  private static instance: SocketService;

  // React integration
  private typingTimeoutRef: NodeJS.Timeout | null = null;

  private constructor(config: Partial<SocketConfig> = {}) {
    super(config);
  }

  /**
   * Get singleton instance
   * @param config - Optional configuration object
   */
  public static getInstance(config?: Partial<SocketConfig>): SocketService {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService(config);
    }
    return SocketService.instance;
  }

  // ==========================================
  // MESSAGE OPERATIONS
  // ==========================================

  /**
   * Send message
   * Queues message if not connected
   * @param payload - Message payload
   * @throws Error if message sending fails after queueing
   */
  public async sendMessage(payload: SendMessagePayload): Promise<void> {
    if (!this.socket?.connected) {
      // Queue message for later
      this.messageQueue.enqueue(payload);
      return;
    }

    try {
      await new Promise<void>((resolve, reject) => {
        this.socket!.emit(
          'message:send',
          payload,
          (response: { success: boolean; data?: Message; error?: string }) => {
            if (response.success) {
              resolve();
            } else {
              reject(new Error(response.error || 'Unknown error'));
            }
          }
        );
      });
    } catch (error) {
      console.error('[SocketService] Failed to send message:', error);
      // Queue message for retry
      this.messageQueue.enqueue(payload);
      throw error;
    }
  }

  /**
   * Send typing indicator
   * @param conversationId - Conversation ID
   * @param isTyping - Whether user is typing
   */
  public sendTyping(conversationId: string, isTyping: boolean): void {
    if (!this.socket?.connected) return;

    const event = isTyping ? 'message:typing:start' : 'message:typing:stop';
    this.socket.emit(event, { conversationId });
  }

  /**
   * Mark message as read
   * @param messageId - Message ID
   * @param _conversationId - Conversation ID (unused but kept for API consistency)
   */
  public markAsRead(messageId: string, _conversationId: string): void {
    if (!this.socket?.connected) return;

    this.socket.emit('message:read', messageId);
  }

  /**
   * Mark notification as read
   * @param notificationIds - Array of notification IDs
   */
  public markNotificationAsRead(notificationIds: string[]): void {
    if (!this.socket?.connected) return;

    this.socket.emit('notification:read', notificationIds);
  }

  // ==========================================
  // CHANNEL SUBSCRIPTION
  // ==========================================

  /**
   * Subscribe to a channel
   * @param channel - Channel name
   */
  public subscribe(channel: string): void {
    if (!this.socket?.connected) {
      console.warn('[SocketService] Cannot subscribe: not connected');
      return;
    }

    this.socket.emit('subscribe', channel);
  }

  /**
   * Unsubscribe from a channel
   * @param channel - Channel name
   */
  public unsubscribe(channel: string): void {
    if (!this.socket?.connected) {
      console.warn('[SocketService] Cannot unsubscribe: not connected');
      return;
    }

    this.socket.emit('unsubscribe', channel);
  }

  // ==========================================
  // QUEUE MANAGEMENT
  // ==========================================

  /**
   * Process offline message queue
   * Sends all queued messages when connection is available
   */
  protected async processQueue(): Promise<void> {
    await this.messageQueue.process(async (message) => {
      await this.sendMessage(message);
    });
  }

  /**
   * Get queue size
   */
  public getQueueSize(): number {
    return this.messageQueue.getSize();
  }

  /**
   * Clear message queue
   */
  public clearQueue(): void {
    this.messageQueue.clear();
  }

  // ==========================================
  // REACT INTEGRATION HELPERS
  // ==========================================

  /**
   * Send typing indicator with debounce (React helper)
   * @param isTyping - Whether user is typing
   * @param data - Typing indicator data
   */
  public sendTypingIndicator(
    isTyping: boolean,
    data: { threadId?: string; recipientIds?: string[] }
  ): void {
    // Clear existing timeout
    if (this.typingTimeoutRef) {
      clearTimeout(this.typingTimeoutRef);
    }

    if (isTyping) {
      // Send typing start
      this.sendTyping(data.threadId || '', true);

      // Auto-stop typing after 3 seconds
      this.typingTimeoutRef = setTimeout(() => {
        this.sendTyping(data.threadId || '', false);
      }, 3000);
    } else {
      // Send typing stop immediately
      this.sendTyping(data.threadId || '', false);
    }
  }

  // ==========================================
  // CLEANUP
  // ==========================================

  /**
   * Cleanup service
   * Disconnects and cleans up all resources
   */
  public cleanup(): void {
    this.disconnect();
    this.eventManager.cleanup();
    this.connectionManager.cleanup();
    this.messageQueue.cleanup();

    if (this.typingTimeoutRef) {
      clearTimeout(this.typingTimeoutRef);
    }
  }
}

/**
 * Singleton instance for backward compatibility
 */
export const socketService = SocketService.getInstance();
