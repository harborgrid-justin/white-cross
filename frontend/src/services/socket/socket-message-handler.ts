/**
 * Socket Message Handler
 *
 * Handles all message-related operations including sending, typing indicators,
 * read receipts, and queue management
 *
 * @module services/socket/socket-message-handler
 */

import { Socket } from 'socket.io-client';
import {
  SocketEvent,
  SendMessagePayload
} from './socket.types';
import { SocketConfig } from './socket.config';
import { SocketConnectionManager } from './socket-manager';
import { SocketMessageQueue } from './socket-queue';

/**
 * Message handler for Socket.io messaging operations
 */
export class SocketMessageHandler {
  private socket: Socket | null = null;
  private config: SocketConfig;
  private connectionManager: SocketConnectionManager;
  private messageQueue: SocketMessageQueue;

  constructor(
    config: SocketConfig,
    connectionManager: SocketConnectionManager,
    messageQueue: SocketMessageQueue
  ) {
    this.config = config;
    this.connectionManager = connectionManager;
    this.messageQueue = messageQueue;
  }

  /**
   * Set the active socket instance
   */
  setSocket(socket: Socket | null): void {
    this.socket = socket;
  }

  /**
   * Check if socket is connected
   */
  private isConnected(): boolean {
    return this.socket?.connected || false;
  }

  /**
   * Send a message through the socket
   */
  async sendMessage(payload: SendMessagePayload): Promise<void> {
    // Queue message if not connected
    if (!this.isConnected()) {
      this.messageQueue.enqueue(payload);
      if (this.config.debug) {
        console.log('[SocketMessageHandler] Message queued (offline):', payload);
      }
      return;
    }

    // Send message via socket
    return new Promise((resolve, reject) => {
      if (!this.socket) {
        reject(new Error('Socket not initialized'));
        return;
      }

      this.socket.emit(
        SocketEvent.MESSAGE_SEND,
        payload,
        (response: { success: boolean; error?: string }) => {
          if (response.success) {
            this.connectionManager.incrementMessagesSent();
            if (this.config.debug) {
              console.log('[SocketMessageHandler] Message sent successfully:', payload);
            }
            resolve();
          } else {
            const errorMessage = response.error || 'Failed to send message';
            console.error('[SocketMessageHandler] Failed to send message:', errorMessage);
            reject(new Error(errorMessage));
          }
        }
      );
    });
  }

  /**
   * Send typing indicator
   */
  sendTyping(conversationId: string, isTyping: boolean): void {
    if (!this.isConnected() || !this.socket) {
      if (this.config.debug) {
        console.warn('[SocketMessageHandler] Cannot send typing: not connected');
      }
      return;
    }

    this.socket.emit(SocketEvent.MESSAGE_TYPING, {
      conversationId,
      isTyping
    });

    if (this.config.debug) {
      console.log(`[SocketMessageHandler] Typing indicator sent: ${isTyping} for conversation ${conversationId}`);
    }
  }

  /**
   * Mark message as read
   */
  markAsRead(messageId: string, conversationId: string): void {
    if (!this.isConnected() || !this.socket) {
      if (this.config.debug) {
        console.warn('[SocketMessageHandler] Cannot mark as read: not connected');
      }
      return;
    }

    this.socket.emit(SocketEvent.MESSAGE_READ, {
      messageId,
      conversationId
    });

    if (this.config.debug) {
      console.log(`[SocketMessageHandler] Message marked as read: ${messageId}`);
    }
  }

  /**
   * Process offline message queue
   */
  async processQueue(): Promise<void> {
    if (!this.isConnected()) {
      console.warn('[SocketMessageHandler] Cannot process queue: not connected');
      return;
    }

    await this.messageQueue.processQueue(
      async (payload) => {
        await this.sendMessage(payload);
      },
      (processed, total) => {
        if (this.config.debug) {
          console.log(`[SocketMessageHandler] Queue progress: ${processed}/${total}`);
        }
      }
    );
  }

  /**
   * Get current queue size
   */
  getQueueSize(): number {
    return this.messageQueue.size();
  }

  /**
   * Clear the message queue
   */
  clearQueue(): void {
    this.messageQueue.clear();
    if (this.config.debug) {
      console.log('[SocketMessageHandler] Message queue cleared');
    }
  }

  /**
   * Cleanup handler
   */
  cleanup(): void {
    this.socket = null;
  }
}

export default SocketMessageHandler;
