/**
 * Socket Event Handlers
 *
 * Event handling and subscription management for messaging socket
 *
 * @module services/socket/socket-events
 */

import {
  SocketEvent,
  EventHandler,
  SocketEventPayloadMap,
  SocketEventHandlers
} from './socket.types';

/**
 * Event manager for Socket.io messaging
 */
export class SocketEventManager {
  private handlers: Map<string, Set<EventHandler>> = new Map();
  private recentMessageIds: Set<string> = new Set();
  private deduplicationWindow: number;

  constructor(deduplicationWindow: number = 60000) {
    this.deduplicationWindow = deduplicationWindow;
  }

  /**
   * Subscribe to an event
   */
  on<K extends keyof SocketEventPayloadMap>(
    event: K,
    handler: EventHandler<SocketEventPayloadMap[K]>
  ): void;
  on(event: string, handler: EventHandler): void;
  on(event: string, handler: EventHandler): void {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, new Set());
    }
    this.handlers.get(event)!.add(handler);
  }

  /**
   * Unsubscribe from an event
   */
  off<K extends keyof SocketEventPayloadMap>(
    event: K,
    handler: EventHandler<SocketEventPayloadMap[K]>
  ): void;
  off(event: string, handler: EventHandler): void;
  off(event: string, handler: EventHandler): void {
    const eventHandlers = this.handlers.get(event);
    if (eventHandlers) {
      eventHandlers.delete(handler);
      if (eventHandlers.size === 0) {
        this.handlers.delete(event);
      }
    }
  }

  /**
   * Emit event to registered handlers with deduplication
   */
  emit<K extends keyof SocketEventPayloadMap>(
    event: K,
    payload: SocketEventPayloadMap[K],
    messageId?: string
  ): void;
  emit(event: string, payload: unknown, messageId?: string): void;
  emit(event: string, payload: unknown, messageId?: string): void {
    // Message deduplication
    if (messageId) {
      if (this.recentMessageIds.has(messageId)) {
        console.debug(`[SocketEventManager] Duplicate message ignored: ${messageId}`);
        return;
      }
      this.recentMessageIds.add(messageId);
      // Clean up old message IDs after deduplication window
      setTimeout(() => {
        this.recentMessageIds.delete(messageId);
      }, this.deduplicationWindow);
    }

    const eventHandlers = this.handlers.get(event);
    if (eventHandlers && eventHandlers.size > 0) {
      eventHandlers.forEach(handler => {
        try {
          handler(payload);
        } catch (error) {
          console.error(`[SocketEventManager] Error in handler for ${event}:`, error);
        }
      });
    }
  }

  /**
   * Remove all handlers for an event
   */
  removeAllListeners(event?: string): void {
    if (event) {
      this.handlers.delete(event);
    } else {
      this.handlers.clear();
    }
  }

  /**
   * Get handler count for an event
   */
  listenerCount(event: string): number {
    return this.handlers.get(event)?.size || 0;
  }

  /**
   * Get all registered events
   */
  eventNames(): string[] {
    return Array.from(this.handlers.keys());
  }

  /**
   * Clear deduplication cache
   */
  clearDeduplicationCache(): void {
    this.recentMessageIds.clear();
  }

  /**
   * Cleanup all handlers and caches
   */
  cleanup(): void {
    this.handlers.clear();
    this.recentMessageIds.clear();
  }
}

export default SocketEventManager;
