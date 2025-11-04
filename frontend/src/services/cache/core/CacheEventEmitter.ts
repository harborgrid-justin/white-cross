/**
 * Cache Event Emitter
 *
 * @module services/cache/core/CacheEventEmitter
 * @internal
 *
 * Provides event emission capabilities for cache operations.
 * Enables observability and debugging of cache behavior.
 */

import { CacheEventType } from '../types';
import type { CacheEvent } from '../types';
import type { ICacheEventEmitter, CacheEventListener } from './types';

/**
 * Cache Event Emitter Implementation
 *
 * @class
 * @implements {ICacheEventEmitter}
 *
 * Event System:
 * - Supports multiple listeners per event type
 * - Type-safe event handling
 * - No memory leaks - listeners can be removed
 *
 * Supported Events:
 * - HIT: Cache hit occurred
 * - MISS: Cache miss occurred
 * - SET: Value stored in cache
 * - INVALIDATE: Entry invalidated
 * - EVICT: Entry evicted (LRU)
 * - PERSIST: Entry persisted to storage
 * - RESTORE: Entry restored from storage
 *
 * Performance:
 * - O(1) listener addition/removal
 * - O(n) event emission where n = number of listeners for that event type
 *
 * @example
 * ```typescript
 * const emitter = new CacheEventEmitter();
 * emitter.initialize();
 *
 * emitter.addEventListener(CacheEventType.HIT, (event) => {
 *   console.log(`Cache hit: ${event.key}`);
 * });
 *
 * emitter.emit(CacheEventType.HIT, 'user:123');
 * ```
 */
export class CacheEventEmitter implements ICacheEventEmitter {
  private listeners: Map<CacheEventType, Set<CacheEventListener>> = new Map();

  /**
   * Initialize Event Listeners
   *
   * Sets up listener collections for each event type.
   * Must be called before using the emitter.
   *
   * @example
   * ```typescript
   * const emitter = new CacheEventEmitter();
   * emitter.initialize();
   * ```
   */
  initialize(): void {
    // Initialize listener sets for each event type
    this.listeners.set(CacheEventType.HIT, new Set());
    this.listeners.set(CacheEventType.MISS, new Set());
    this.listeners.set(CacheEventType.SET, new Set());
    this.listeners.set(CacheEventType.INVALIDATE, new Set());
    this.listeners.set(CacheEventType.EVICT, new Set());
    this.listeners.set(CacheEventType.PERSIST, new Set());
    this.listeners.set(CacheEventType.RESTORE, new Set());
  }

  /**
   * Add Event Listener
   *
   * Registers a listener for a specific event type.
   *
   * @param eventType - Type of event to listen for
   * @param listener - Callback function to invoke on event
   *
   * @example
   * ```typescript
   * emitter.addEventListener(CacheEventType.EVICT, (event) => {
   *   console.warn(`Evicted ${event.key} at ${new Date(event.timestamp)}`);
   * });
   * ```
   */
  addEventListener(eventType: CacheEventType, listener: CacheEventListener): void {
    const listeners = this.listeners.get(eventType);
    if (listeners) {
      listeners.add(listener);
    }
  }

  /**
   * Remove Event Listener
   *
   * Unregisters a listener for a specific event type.
   *
   * @param eventType - Type of event
   * @param listener - Callback function to remove
   *
   * @example
   * ```typescript
   * const myListener = (event) => console.log(event);
   * emitter.addEventListener(CacheEventType.HIT, myListener);
   * // Later...
   * emitter.removeEventListener(CacheEventType.HIT, myListener);
   * ```
   */
  removeEventListener(eventType: CacheEventType, listener: CacheEventListener): void {
    const listeners = this.listeners.get(eventType);
    if (listeners) {
      listeners.delete(listener);
    }
  }

  /**
   * Emit Cache Event
   *
   * Notifies all registered listeners for an event type.
   *
   * @param type - Event type
   * @param key - Cache key involved in event
   * @param metadata - Additional event metadata
   *
   * @example
   * ```typescript
   * emitter.emit(CacheEventType.SET, 'user:123', {
   *   size: 2048,
   *   ttl: 300000
   * });
   * ```
   */
  emit(
    type: CacheEventType,
    key: string,
    metadata?: Record<string, unknown>
  ): void {
    const event: CacheEvent = {
      type,
      key,
      timestamp: Date.now(),
      metadata
    };

    const listeners = this.listeners.get(type);
    if (listeners) {
      listeners.forEach((listener) => listener(event));
    }
  }
}
