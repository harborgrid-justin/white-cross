/**
 * @fileoverview Audit Service Event Manager
 * 
 * Handles event queuing, batching, API communication, and retry logic
 * for the audit service. Provides reliable event delivery capabilities.
 * 
 * @module AuditService/EventManager
 * @version 1.0.0
 * @since 2025-11-11
 */

import { apiInstance } from '../../config/apiConfig';
import { API_ENDPOINTS } from '@/constants/api';
import {
  AuditEvent,
  AuditBatch,
  AuditConfig,
  AuditApiResponse,
  AuditAction,
  AuditSeverity,
} from '../types';
import {
  requiresImmediateFlush,
} from '../config';
import { generateBatchId, generateChecksum } from './utils';
import { StorageManager } from './storage-manager';

/**
 * Event Manager for handling queuing, batching, and API communication
 */
export class EventManager {
  private config: AuditConfig;
  private eventQueue: AuditEvent[] = [];
  private batchTimer: ReturnType<typeof setTimeout> | null = null;
  private isFlushing = false;
  private lastSyncAt: number | null = null;
  private lastError: string | null = null;
  private syncErrors = 0;
  private storageManager: StorageManager;

  constructor(config: AuditConfig, storageManager: StorageManager) {
    this.config = config;
    this.storageManager = storageManager;
    this.startBatchTimer();
  }

  /**
   * Queue an event for batch submission
   */
  public async queueEvent(event: AuditEvent): Promise<void> {
    // Add to queue
    this.eventQueue.push(event);

    if (this.config.enableConsoleLog) {
      console.log('[EventManager] Event queued:', {
        action: event.action,
        resourceType: event.resourceType,
        severity: event.severity,
        queueSize: this.eventQueue.length,
      });
    }

    // Check if immediate flush is required
    if (requiresImmediateFlush(event.action, event.severity)) {
      if (this.config.enableDebug) {
        console.log('[EventManager] Critical event - immediate flush');
      }
      await this.flush();
    }
    // Check if batch size reached
    else if (this.eventQueue.length >= this.config.batchSize) {
      if (this.config.enableDebug) {
        console.log('[EventManager] Batch size reached - flushing');
      }
      await this.flush();
    }
  }

  /**
   * Flush queued events to backend
   */
  public async flush(): Promise<void> {
    if (this.isFlushing || this.eventQueue.length === 0) {
      return;
    }

    this.isFlushing = true;

    try {
      const eventsToSend = [...this.eventQueue];
      this.eventQueue = [];

      const batch: AuditBatch = {
        batchId: generateBatchId(),
        timestamp: new Date().toISOString(),
        events: eventsToSend,
      };

      if (this.config.enableChecksum) {
        batch.checksum = generateChecksum(eventsToSend);
      }

      if (this.config.enableDebug) {
        console.log('[EventManager] Sending batch:', {
          batchId: batch.batchId,
          eventCount: batch.events.length,
        });
      }

      // Send to backend
      const response = await apiInstance.post<AuditApiResponse>(
        API_ENDPOINTS.AUDIT.PHI_ACCESS_LOG,
        batch,
        { timeout: 10000 } // 10 second timeout
      );

      if (response.data.success) {
        this.handleFlushSuccess(eventsToSend, response.data.data);
      } else {
        throw new Error(response.data.error?.message || 'Failed to send audit batch');
      }
    } catch (error) {
      this.handleFlushError(error);
    } finally {
      this.isFlushing = false;
    }
  }

  /**
   * Handle successful flush
   */
  private handleFlushSuccess(events: AuditEvent[], responseData: AuditApiResponse['data']): void {
    this.lastSyncAt = Date.now();
    this.syncErrors = 0;
    this.lastError = null;

    // Mark events as synced
    events.forEach(event => {
      event.isSynced = true;
    });

    // Remove successfully synced events from storage
    const eventIds = events.map(e => e.id).filter(Boolean) as string[];
    this.storageManager.removeSyncedEvents(eventIds);

    if (this.config.enableDebug) {
      console.log('[EventManager] Batch sent successfully:', responseData);
    }
  }

  /**
   * Handle flush error
   */
  private handleFlushError(error: unknown): void {
    this.syncErrors++;
    this.lastError = error instanceof Error ? error.message : 'Unknown error';

    if (this.config.enableDebug) {
      console.error('[EventManager] Failed to send batch:', error);
    }

    // Store failed events in localStorage for retry
    this.storageManager.saveFailedEvents(this.eventQueue);
  }

  /**
   * Start the batch timer
   */
  public startBatchTimer(): void {
    if (this.batchTimer) {
      clearInterval(this.batchTimer);
    }

    this.batchTimer = setInterval(() => {
      if (this.eventQueue.length > 0) {
        this.flush().catch(error => {
          if (this.config.enableDebug) {
            console.error('[EventManager] Timer flush failed:', error);
          }
        });
      }
    }, this.config.batchInterval);
  }

  /**
   * Stop the batch timer
   */
  public stopBatchTimer(): void {
    if (this.batchTimer) {
      clearInterval(this.batchTimer);
      this.batchTimer = null;
    }
  }

  /**
   * Retry sending failed events with exponential backoff
   */
  public async retryFailedEvents(): Promise<void> {
    const eventsToRetry = this.storageManager.getRetryableEvents();

    if (eventsToRetry.length === 0) {
      return;
    }

    for (const event of eventsToRetry) {
      const retryCount = (event.retryCount || 0) + 1;
      const delay = this.storageManager.calculateRetryDelay(retryCount);

      setTimeout(async () => {
        try {
          // Update retry count
          this.storageManager.updateRetryCount(event.id || '', retryCount);
          
          // Add to queue for retry
          this.eventQueue.push(event);
          await this.flush();
        } catch (error) {
          if (this.config.enableDebug) {
            console.error('[EventManager] Retry failed:', error);
          }
        }
      }, delay);
    }
  }

  /**
   * Get number of queued events
   */
  public getQueuedCount(): number {
    return this.eventQueue.length;
  }

  /**
   * Clear the event queue (use with caution)
   */
  public clearQueue(): void {
    this.eventQueue = [];
  }

  /**
   * Get sync status information
   */
  public getSyncStatus(): {
    lastSyncAt: number | null;
    lastError: string | null;
    syncErrors: number;
    isFlushing: boolean;
    queuedEvents: number;
  } {
    return {
      lastSyncAt: this.lastSyncAt,
      lastError: this.lastError,
      syncErrors: this.syncErrors,
      isFlushing: this.isFlushing,
      queuedEvents: this.eventQueue.length,
    };
  }

  /**
   * Check if event manager is healthy
   */
  public isHealthy(): boolean {
    return this.syncErrors < 5 && this.eventQueue.length < this.config.maxLocalStorage;
  }

  /**
   * Handle page unload - save pending events
   */
  public handleBeforeUnload(): void {
    if (this.eventQueue.length > 0) {
      this.storageManager.saveFailedEvents(this.eventQueue);
    }
  }

  /**
   * Update configuration
   */
  public updateConfig(config: Partial<AuditConfig>): void {
    this.config = { ...this.config, ...config };

    // Restart timer if interval changed
    if (config.batchInterval) {
      this.startBatchTimer();
    }
  }

  /**
   * Cleanup - stop timers and flush pending events
   */
  public async cleanup(): Promise<void> {
    this.stopBatchTimer();
    await this.flush();
  }
}
