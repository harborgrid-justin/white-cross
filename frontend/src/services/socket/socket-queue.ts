/**
 * Socket Message Queue
 *
 * Manages offline message queue with persistence and retry logic
 *
 * @module services/socket/socket-queue
 */

import {
  QueuedMessage,
  SendMessagePayload
} from './socket.types';
import { SocketConfig } from './socket.config';
import { nanoid } from 'nanoid';

const QUEUE_STORAGE_KEY = 'socket_message_queue';

/**
 * Message queue manager for offline messaging
 */
export class SocketMessageQueue {
  private queue: QueuedMessage[] = [];
  private config: SocketConfig;
  private processing = false;

  constructor(config: SocketConfig) {
    this.config = config;
    this.loadFromStorage();
  }

  /**
   * Add message to queue
   */
  enqueue(payload: SendMessagePayload): QueuedMessage {
    const queuedMessage: QueuedMessage = {
      id: nanoid(),
      payload,
      attempts: 0,
      timestamp: new Date().toISOString()
    };

    // Check max queue size
    if (this.queue.length >= this.config.queue.maxSize) {
      console.warn('[SocketQueue] Queue full, removing oldest message');
      this.queue.shift();
    }

    this.queue.push(queuedMessage);
    this.saveToStorage();

    if (this.config.debug) {
      console.log(`[SocketQueue] Message queued: ${queuedMessage.id}`, payload);
    }

    return queuedMessage;
  }

  /**
   * Remove message from queue
   */
  dequeue(messageId: string): QueuedMessage | null {
    const index = this.queue.findIndex(m => m.id === messageId);
    if (index === -1) return null;

    const [message] = this.queue.splice(index, 1);
    this.saveToStorage();

    if (this.config.debug) {
      console.log(`[SocketQueue] Message dequeued: ${messageId}`);
    }

    return message;
  }

  /**
   * Get all queued messages
   */
  getAll(): QueuedMessage[] {
    return [...this.queue];
  }

  /**
   * Get queue size
   */
  size(): number {
    return this.queue.length;
  }

  /**
   * Check if queue is empty
   */
  isEmpty(): boolean {
    return this.queue.length === 0;
  }

  /**
   * Clear entire queue
   */
  clear(): void {
    this.queue = [];
    this.saveToStorage();
    console.log('[SocketQueue] Queue cleared');
  }

  /**
   * Update message attempt count
   */
  incrementAttempts(messageId: string): void {
    const message = this.queue.find(m => m.id === messageId);
    if (message) {
      message.attempts++;
      message.lastAttempt = new Date().toISOString();
      this.saveToStorage();
    }
  }

  /**
   * Check if message should be retried
   */
  shouldRetry(message: QueuedMessage): boolean {
    return message.attempts < this.config.queue.retryAttempts;
  }

  /**
   * Get messages eligible for retry
   */
  getRetryableMessages(): QueuedMessage[] {
    const now = Date.now();
    const retryDelay = this.config.queue.retryDelay;

    return this.queue.filter(message => {
      if (!this.shouldRetry(message)) return false;

      // Check if enough time has passed since last attempt
      if (message.lastAttempt) {
        const lastAttemptTime = new Date(message.lastAttempt).getTime();
        const timeSinceLastAttempt = now - lastAttemptTime;
        return timeSinceLastAttempt >= retryDelay;
      }

      return true;
    });
  }

  /**
   * Process queue with send function
   */
  async processQueue(
    sendFn: (payload: SendMessagePayload) => Promise<void>,
    onProgress?: (processed: number, total: number) => void
  ): Promise<void> {
    if (this.processing) {
      console.warn('[SocketQueue] Queue processing already in progress');
      return;
    }

    this.processing = true;
    const retryableMessages = this.getRetryableMessages();
    const total = retryableMessages.length;

    if (total === 0) {
      this.processing = false;
      return;
    }

    console.log(`[SocketQueue] Processing ${total} queued messages`);

    let processed = 0;

    for (const message of retryableMessages) {
      try {
        await sendFn(message.payload);
        this.dequeue(message.id);
        processed++;

        if (onProgress) {
          onProgress(processed, total);
        }
      } catch (error) {
        console.error(`[SocketQueue] Failed to send queued message ${message.id}:`, error);
        this.incrementAttempts(message.id);

        // Remove message if max attempts reached
        if (!this.shouldRetry(message)) {
          console.warn(`[SocketQueue] Max retry attempts reached for message ${message.id}, removing from queue`);
          this.dequeue(message.id);
        }
      }
    }

    this.processing = false;
    console.log(`[SocketQueue] Queue processing complete: ${processed}/${total} sent`);
  }

  /**
   * Save queue to localStorage
   */
  private saveToStorage(): void {
    if (!this.config.queue.persistToStorage) return;

    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(this.queue));
      }
    } catch (error) {
      console.error('[SocketQueue] Failed to save queue to storage:', error);
    }
  }

  /**
   * Load queue from localStorage
   */
  private loadFromStorage(): void {
    if (!this.config.queue.persistToStorage) return;

    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const stored = localStorage.getItem(QUEUE_STORAGE_KEY);
        if (stored) {
          this.queue = JSON.parse(stored);
          console.log(`[SocketQueue] Loaded ${this.queue.length} messages from storage`);
        }
      }
    } catch (error) {
      console.error('[SocketQueue] Failed to load queue from storage:', error);
      this.queue = [];
    }
  }

  /**
   * Cleanup queue and storage
   */
  cleanup(): void {
    this.clear();
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem(QUEUE_STORAGE_KEY);
    }
  }
}

export default SocketMessageQueue;
