/**
 * Message Queue
 *
 * Handles queuing and processing of messages when socket is offline
 */

import type { SendMessagePayload } from './types';

export class MessageQueue {
  private queue: SendMessagePayload[] = [];
  private processing = false;

  /**
   * Add message to queue
   */
  enqueue(message: SendMessagePayload): void {
    this.queue.push(message);
  }

  /**
   * Remove and return next message from queue
   */
  dequeue(): SendMessagePayload | undefined {
    return this.queue.shift();
  }

  /**
   * Get current queue size
   */
  getSize(): number {
    return this.queue.length;
  }

  /**
   * Check if queue is empty
   */
  isEmpty(): boolean {
    return this.queue.length === 0;
  }

  /**
   * Clear all messages from queue
   */
  clear(): void {
    this.queue = [];
  }

  /**
   * Process all queued messages using provided send function
   */
  async process(sendFunction: (message: SendMessagePayload) => Promise<void>): Promise<void> {
    if (this.processing || this.isEmpty()) {
      return;
    }

    this.processing = true;

    try {
      while (!this.isEmpty()) {
        const message = this.dequeue();
        if (message) {
          try {
            await sendFunction(message);
          } catch (error) {
            console.error('[MessageQueue] Failed to send queued message:', error);
            // Re-queue failed messages at the front
            this.queue.unshift(message);
            break;
          }
        }
      }
    } finally {
      this.processing = false;
    }
  }

  /**
   * Cleanup resources
   */
  cleanup(): void {
    this.clear();
  }
}