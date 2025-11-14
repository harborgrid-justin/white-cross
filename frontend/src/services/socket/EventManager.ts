/**
 * Event Manager
 *
 * Handles event subscription and emission with deduplication
 */

import type { EventHandler } from './types';

export class EventManager {
  private handlers: Map<string, Set<EventHandler>> = new Map();
  private deduplicationWindow: number;
  private recentEvents: Map<string, number> = new Map();

  constructor(deduplicationWindow = 1000) {
    this.deduplicationWindow = deduplicationWindow;
  }

  /**
   * Subscribe to an event
   */
  on(event: string, handler: EventHandler): void {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, new Set());
    }
    this.handlers.get(event)!.add(handler);
  }

  /**
   * Unsubscribe from an event
   */
  off(event: string, handler: EventHandler): void {
    const handlers = this.handlers.get(event);
    if (handlers) {
      handlers.delete(handler);
    }
  }

  /**
   * Emit an event to all subscribers
   */
  emit(event: string, data: unknown): void {
    // Deduplication check
    const eventKey = `${event}:${JSON.stringify(data)}`;
    const now = Date.now();
    const lastEmit = this.recentEvents.get(eventKey);

    if (lastEmit && (now - lastEmit) < this.deduplicationWindow) {
      return; // Skip duplicate event
    }

    this.recentEvents.set(eventKey, now);

    // Clean old entries
    for (const [key, timestamp] of this.recentEvents.entries()) {
      if (now - timestamp > this.deduplicationWindow) {
        this.recentEvents.delete(key);
      }
    }

    // Emit to handlers
    const handlers = this.handlers.get(event);
    if (handlers) {
      handlers.forEach(handler => {
        try {
          handler(data);
        } catch (error) {
          console.error(`Error in event handler for ${event}:`, error);
        }
      });
    }
  }

  /**
   * Get the number of subscribers for an event
   */
  getSubscriberCount(event: string): number {
    return this.handlers.get(event)?.size || 0;
  }

  /**
   * Check if an event has subscribers
   */
  hasSubscribers(event: string): boolean {
    return this.getSubscriberCount(event) > 0;
  }

  /**
   * Clear all handlers and recent events
   */
  cleanup(): void {
    this.handlers.clear();
    this.recentEvents.clear();
  }
}