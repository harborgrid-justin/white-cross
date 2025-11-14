/**
 * @fileoverview Audit Service Storage Manager
 * 
 * Handles local storage operations, failed event persistence, and retry logic
 * for the audit service. Provides resilient offline storage capabilities.
 * 
 * @module AuditService/StorageManager
 * @version 1.0.0
 * @since 2025-11-11
 */

import { AuditEvent, AuditConfig } from '../types';

/**
 * Storage Manager for handling local persistence and retry logic
 */
export class StorageManager {
  private config: AuditConfig;
  private failedEvents: AuditEvent[] = [];

  constructor(config: AuditConfig) {
    this.config = config;
    this.loadFailedEvents();
  }

  /**
   * Save failed events to localStorage
   */
  public saveFailedEvents(additionalEvents: AuditEvent[] = []): void {
    try {
      const combined = [...this.failedEvents, ...additionalEvents];
      const limited = combined.slice(-this.config.maxLocalStorage);

      if (typeof window !== 'undefined') {
        localStorage.setItem(
          this.config.localStorageKey,
          JSON.stringify(limited)
        );
      }

      this.failedEvents = limited;

      if (this.config.enableDebug) {
        console.log('[StorageManager] Saved failed events:', limited.length);
      }
    } catch (error) {
      if (this.config.enableDebug) {
        console.error('[StorageManager] Failed to save to localStorage:', error);
      }
    }
  }

  /**
   * Load failed events from localStorage
   */
  public loadFailedEvents(): AuditEvent[] {
    // Only access localStorage in browser environment
    if (typeof window === 'undefined') {
      return [];
    }

    try {
      const stored = localStorage.getItem(this.config.localStorageKey);
      if (stored) {
        const events = JSON.parse(stored) as AuditEvent[];
        this.failedEvents = events;

        if (this.config.enableDebug) {
          console.log('[StorageManager] Loaded failed events:', events.length);
        }

        return events;
      }
    } catch (error) {
      if (this.config.enableDebug) {
        console.error('[StorageManager] Failed to load from localStorage:', error);
      }
    }

    return [];
  }

  /**
   * Get events that are eligible for retry
   */
  public getRetryableEvents(): AuditEvent[] {
    return this.failedEvents.filter(
      event => (event.retryCount || 0) < this.config.maxRetries
    );
  }

  /**
   * Update retry count for an event
   */
  public updateRetryCount(eventId: string, retryCount: number): void {
    const event = this.failedEvents.find(e => e.id === eventId);
    if (event) {
      event.retryCount = retryCount;
      this.saveFailedEvents();
    }
  }

  /**
   * Remove successfully synced events from failed events list
   */
  public removeSyncedEvents(eventIds: string[]): void {
    const before = this.failedEvents.length;
    this.failedEvents = this.failedEvents.filter(
      event => !eventIds.includes(event.id || '')
    );
    
    if (this.failedEvents.length !== before) {
      this.saveFailedEvents();
      
      if (this.config.enableDebug) {
        console.log('[StorageManager] Removed synced events:', 
          before - this.failedEvents.length);
      }
    }
  }

  /**
   * Clear all failed events
   */
  public clearFailedEvents(): void {
    this.failedEvents = [];
    
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.config.localStorageKey);
    }

    if (this.config.enableDebug) {
      console.log('[StorageManager] Cleared all failed events');
    }
  }

  /**
   * Get count of failed events
   */
  public getFailedEventsCount(): number {
    return this.failedEvents.length;
  }

  /**
   * Get all failed events
   */
  public getFailedEvents(): AuditEvent[] {
    return [...this.failedEvents];
  }

  /**
   * Calculate retry delay with exponential backoff
   */
  public calculateRetryDelay(retryCount: number): number {
    return this.config.retryDelay * Math.pow(this.config.retryBackoff, retryCount - 1);
  }

  /**
   * Check if localStorage is available and has space
   */
  public checkStorageHealth(): {
    available: boolean;
    hasSpace: boolean;
    eventCount: number;
  } {
    let available = false;
    let hasSpace = false;
    
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        available = true;
        
        // Test write to check space
        const testKey = '__audit_test__';
        localStorage.setItem(testKey, 'test');
        localStorage.removeItem(testKey);
        hasSpace = true;
      }
    } catch (error) {
      // Storage quota exceeded or not available
      if (this.config.enableDebug) {
        console.warn('[StorageManager] Storage health check failed:', error);
      }
    }

    return {
      available,
      hasSpace,
      eventCount: this.failedEvents.length,
    };
  }

  /**
   * Cleanup old events based on age or count limits
   */
  public cleanupOldEvents(): void {
    const now = Date.now();
    const maxAge = this.config.retryDelay * this.config.maxRetries * 2; // Max age in ms
    
    const before = this.failedEvents.length;
    
    // Remove events that are too old or have exceeded retry count
    this.failedEvents = this.failedEvents.filter(event => {
      const localTimestamp = event.localTimestamp || now; // Use current time as fallback
      const age = now - localTimestamp;
      const retryCount = event.retryCount || 0;
      
      return age < maxAge && retryCount < this.config.maxRetries;
    });

    // Limit by count
    if (this.failedEvents.length > this.config.maxLocalStorage) {
      this.failedEvents = this.failedEvents.slice(-this.config.maxLocalStorage);
    }

    if (this.failedEvents.length !== before) {
      this.saveFailedEvents();
      
      if (this.config.enableDebug) {
        console.log('[StorageManager] Cleaned up old events:', 
          before - this.failedEvents.length);
      }
    }
  }
}
