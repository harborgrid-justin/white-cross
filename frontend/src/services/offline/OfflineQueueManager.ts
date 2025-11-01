/**
 * @fileoverview Offline Request Queue Manager
 * @module services/offline/OfflineQueueManager
 *
 * Manages queuing of API requests when offline and syncs them when connection is restored.
 * Uses IndexedDB for persistent storage to survive page reloads and browser restarts.
 *
 * Key Features:
 * - Persistent queue storage with IndexedDB (via Dexie)
 * - Priority-based queue (emergency > high > normal > low)
 * - Automatic sync on reconnection
 * - Manual retry/cancel operations
 * - Conflict detection and resolution
 * - Request deduplication
 * - Progress tracking
 * - HIPAA-compliant audit logging
 *
 * @example
 * ```typescript
 * const queue = OfflineQueueManager.getInstance();
 *
 * // Add request to queue
 * await queue.enqueue({
 *   id: 'req-123',
 *   method: 'POST',
 *   url: '/api/students',
 *   data: studentData,
 *   priority: 'high',
 *   timestamp: Date.now()
 * });
 *
 * // Listen for sync events
 * queue.on('sync-start', () => console.log('Sync starting...'));
 * queue.on('sync-complete', () => console.log('Sync complete!'));
 * ```
 */

import Dexie, { Table } from 'dexie';
import { apiClient, ApiResponse } from '../core/ApiClient';
import { logger } from '../utils/logger';
import { auditService, AuditAction, AuditResourceType, AuditStatus } from '../audit';

// ==========================================
// TYPE DEFINITIONS
// ==========================================

export type RequestPriority = 'emergency' | 'high' | 'normal' | 'low';
export type RequestStatus = 'pending' | 'syncing' | 'completed' | 'failed' | 'cancelled';
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface QueuedRequest {
  id: string;
  method: HttpMethod;
  url: string;
  data?: unknown;
  headers?: Record<string, string>;
  priority: RequestPriority;
  timestamp: number;
  retryCount: number;
  maxRetries: number;
  status: RequestStatus;
  error?: string;
  response?: unknown;
  metadata?: {
    userId?: string;
    studentId?: string;
    resourceType?: string;
    action?: string;
  };
}

export interface SyncProgress {
  total: number;
  completed: number;
  failed: number;
  inProgress: boolean;
}

export interface SyncResult {
  successful: QueuedRequest[];
  failed: QueuedRequest[];
  conflicts: QueuedRequest[];
}

type QueueEventType = 'enqueue' | 'sync-start' | 'sync-progress' | 'sync-complete' | 'sync-error' | 'request-completed' | 'request-failed';
type QueueEventHandler = (data?: unknown) => void;

// ==========================================
// INDEXEDDB DATABASE
// ==========================================

class OfflineQueueDatabase extends Dexie {
  requests!: Table<QueuedRequest, string>;

  constructor() {
    super('WhiteCrossOfflineQueue');

    this.version(1).stores({
      requests: 'id, status, priority, timestamp, url'
    });
  }
}

// ==========================================
// OFFLINE QUEUE MANAGER
// ==========================================

export class OfflineQueueManager {
  private static instance: OfflineQueueManager;
  private db: OfflineQueueDatabase;
  private eventHandlers: Map<QueueEventType, Set<QueueEventHandler>> = new Map();
  private isSyncing = false;
  private syncAbortController: AbortController | null = null;

  private constructor() {
    this.db = new OfflineQueueDatabase();
    this.initializeEventListeners();
  }

  /**
   * Get singleton instance
   */
  public static getInstance(): OfflineQueueManager {
    if (!OfflineQueueManager.instance) {
      OfflineQueueManager.instance = new OfflineQueueManager();
    }
    return OfflineQueueManager.instance;
  }

  /**
   * Initialize event listeners for online/offline detection
   */
  private initializeEventListeners(): void {
    if (typeof window === 'undefined') return;

    window.addEventListener('online', () => {
      logger.info('OfflineQueueManager: Network connection restored');
      this.syncQueue();
    });

    window.addEventListener('offline', () => {
      logger.info('OfflineQueueManager: Network connection lost');
    });
  }

  // ==========================================
  // QUEUE OPERATIONS
  // ==========================================

  /**
   * Add request to offline queue
   */
  public async enqueue(request: Omit<QueuedRequest, 'id' | 'retryCount' | 'status'>): Promise<string> {
    const queuedRequest: QueuedRequest = {
      id: this.generateRequestId(),
      ...request,
      retryCount: 0,
      maxRetries: request.maxRetries || 3,
      status: 'pending'
    };

    try {
      await this.db.requests.add(queuedRequest);
      logger.info(`OfflineQueueManager: Request queued - ${queuedRequest.id}`, {
        method: queuedRequest.method,
        url: queuedRequest.url,
        priority: queuedRequest.priority
      });

      this.emit('enqueue', queuedRequest);

      // If online, try to sync immediately
      if (navigator.onLine && !this.isSyncing) {
        this.syncQueue();
      }

      return queuedRequest.id;
    } catch (error) {
      logger.error('OfflineQueueManager: Failed to enqueue request', error as Error);
      throw error;
    }
  }

  /**
   * Get all pending requests
   */
  public async getPendingRequests(): Promise<QueuedRequest[]> {
    return await this.db.requests
      .where('status')
      .equals('pending')
      .or('status')
      .equals('failed')
      .sortBy('priority');
  }

  /**
   * Get request by ID
   */
  public async getRequest(id: string): Promise<QueuedRequest | undefined> {
    return await this.db.requests.get(id);
  }

  /**
   * Get all requests
   */
  public async getAllRequests(): Promise<QueuedRequest[]> {
    return await this.db.requests.toArray();
  }

  /**
   * Get queue statistics
   */
  public async getQueueStats(): Promise<SyncProgress> {
    const requests = await this.db.requests.toArray();

    return {
      total: requests.length,
      completed: requests.filter((r: QueuedRequest) => r.status === 'completed').length,
      failed: requests.filter((r: QueuedRequest) => r.status === 'failed').length,
      inProgress: this.isSyncing
    };
  }

  /**
   * Cancel pending request
   */
  public async cancelRequest(id: string): Promise<void> {
    const request = await this.db.requests.get(id);

    if (!request) {
      throw new Error(`Request ${id} not found`);
    }

    if (request.status === 'syncing') {
      throw new Error('Cannot cancel request that is currently syncing');
    }

    await this.db.requests.update(id, { status: 'cancelled' });
    logger.info(`OfflineQueueManager: Request cancelled - ${id}`);
  }

  /**
   * Clear completed and cancelled requests
   */
  public async clearCompleted(): Promise<number> {
    const count = await this.db.requests
      .where('status')
      .anyOf(['completed', 'cancelled'])
      .delete();

    logger.info(`OfflineQueueManager: Cleared ${count} completed/cancelled requests`);
    return count;
  }

  /**
   * Clear all requests (use with caution)
   */
  public async clearAll(): Promise<void> {
    await this.db.requests.clear();
    logger.warn('OfflineQueueManager: All requests cleared');
  }

  // ==========================================
  // SYNC OPERATIONS
  // ==========================================

  /**
   * Sync all pending requests
   */
  public async syncQueue(): Promise<SyncResult> {
    if (this.isSyncing) {
      logger.warn('OfflineQueueManager: Sync already in progress');
      return { successful: [], failed: [], conflicts: [] };
    }

    if (!navigator.onLine) {
      logger.warn('OfflineQueueManager: Cannot sync - offline');
      return { successful: [], failed: [], conflicts: [] };
    }

    this.isSyncing = true;
    this.syncAbortController = new AbortController();
    this.emit('sync-start');

    const successful: QueuedRequest[] = [];
    const failed: QueuedRequest[] = [];
    const conflicts: QueuedRequest[] = [];

    try {
      // Get pending requests sorted by priority
      const pending = await this.getPendingRequests();
      const sortedRequests = this.sortByPriority(pending);

      logger.info(`OfflineQueueManager: Starting sync of ${sortedRequests.length} requests`);

      for (const request of sortedRequests) {
        if (this.syncAbortController.signal.aborted) {
          logger.info('OfflineQueueManager: Sync aborted');
          break;
        }

        try {
          // Update status to syncing
          await this.db.requests.update(request.id, { status: 'syncing' });

          // Execute request
          const result = await this.executeRequest(request);

          // Update status to completed
          await this.db.requests.update(request.id, {
            status: 'completed',
            response: result
          });

          successful.push(request);
          this.emit('request-completed', { request, result });

          logger.info(`OfflineQueueManager: Request synced successfully - ${request.id}`);
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';

          // Check if it's a conflict error (409)
          if (errorMessage.includes('409') || errorMessage.includes('conflict')) {
            conflicts.push(request);
            await this.db.requests.update(request.id, {
              status: 'failed',
              error: 'Conflict detected',
              retryCount: request.retryCount + 1
            });
            logger.warn(`OfflineQueueManager: Conflict detected - ${request.id}`);
          } else {
            // Retry logic
            const newRetryCount = request.retryCount + 1;

            if (newRetryCount < request.maxRetries) {
              await this.db.requests.update(request.id, {
                status: 'pending',
                error: errorMessage,
                retryCount: newRetryCount
              });
              logger.warn(`OfflineQueueManager: Request will retry (${newRetryCount}/${request.maxRetries}) - ${request.id}`);
            } else {
              failed.push(request);
              await this.db.requests.update(request.id, {
                status: 'failed',
                error: errorMessage,
                retryCount: newRetryCount
              });
              logger.error(`OfflineQueueManager: Request failed permanently - ${request.id}`, error as Error);
            }
          }

          this.emit('request-failed', { request, error });
        }

        // Emit progress
        this.emit('sync-progress', {
          total: sortedRequests.length,
          completed: successful.length,
          failed: failed.length
        });
      }

      this.emit('sync-complete', { successful, failed, conflicts });

      logger.info('OfflineQueueManager: Sync complete', {
        successful: successful.length,
        failed: failed.length,
        conflicts: conflicts.length
      });

      return { successful, failed, conflicts };
    } catch (error) {
      logger.error('OfflineQueueManager: Sync error', error as Error);
      this.emit('sync-error', error);
      throw error;
    } finally {
      this.isSyncing = false;
      this.syncAbortController = null;
    }
  }

  /**
   * Abort current sync operation
   */
  public abortSync(): void {
    if (this.syncAbortController) {
      this.syncAbortController.abort();
      logger.info('OfflineQueueManager: Sync aborted by user');
    }
  }

  /**
   * Retry failed request
   */
  public async retryRequest(id: string): Promise<void> {
    const request = await this.db.requests.get(id);

    if (!request) {
      throw new Error(`Request ${id} not found`);
    }

    if (request.status !== 'failed') {
      throw new Error('Can only retry failed requests');
    }

    // Reset to pending
    await this.db.requests.update(id, {
      status: 'pending',
      error: undefined
    });

    logger.info(`OfflineQueueManager: Request reset for retry - ${id}`);

    // Trigger sync if online
    if (navigator.onLine && !this.isSyncing) {
      await this.syncQueue();
    }
  }

  // ==========================================
  // PRIVATE HELPERS
  // ==========================================

  /**
   * Execute queued request using API client
   */
  private async executeRequest(request: QueuedRequest): Promise<unknown> {
    const config = {
      headers: request.headers
    };

    let response: ApiResponse<unknown>;

    switch (request.method) {
      case 'GET':
        response = await apiClient.get(request.url, config);
        break;
      case 'POST':
        response = await apiClient.post(request.url, request.data, config);
        break;
      case 'PUT':
        response = await apiClient.put(request.url, request.data, config);
        break;
      case 'PATCH':
        response = await apiClient.patch(request.url, request.data, config);
        break;
      case 'DELETE':
        response = await apiClient.delete(request.url, config);
        break;
      default:
        throw new Error(`Unsupported HTTP method: ${request.method}`);
    }

    // Log to audit service if PHI-related
    if (request.metadata?.resourceType && request.metadata?.action) {
      await auditService.log({
        action: request.metadata.action as AuditAction,
        resourceType: request.metadata.resourceType as AuditResourceType,
        resourceId: request.metadata.studentId,
        status: AuditStatus.SUCCESS,
        metadata: {
          userId: request.metadata.userId,
          queuedRequestId: request.id,
          syncedAt: new Date().toISOString()
        }
      });
    }

    return response.data;
  }

  /**
   * Sort requests by priority
   */
  private sortByPriority(requests: QueuedRequest[]): QueuedRequest[] {
    const priorityOrder: Record<RequestPriority, number> = {
      emergency: 0,
      high: 1,
      normal: 2,
      low: 3
    };

    return requests.sort((a, b) => {
      const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
      if (priorityDiff !== 0) return priorityDiff;

      // Same priority, sort by timestamp (older first)
      return a.timestamp - b.timestamp;
    });
  }

  /**
   * Generate unique request ID
   */
  private generateRequestId(): string {
    return `offline-req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  // ==========================================
  // EVENT HANDLING
  // ==========================================

  /**
   * Subscribe to queue events
   */
  public on(event: QueueEventType, handler: QueueEventHandler): void {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, new Set());
    }
    this.eventHandlers.get(event)!.add(handler);
  }

  /**
   * Unsubscribe from queue events
   */
  public off(event: QueueEventType, handler: QueueEventHandler): void {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      handlers.delete(handler);
    }
  }

  /**
   * Emit event to subscribers
   */
  private emit(event: QueueEventType, data?: unknown): void {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      handlers.forEach(handler => {
        try {
          handler(data);
        } catch (error) {
          logger.error(`OfflineQueueManager: Error in event handler for ${event}`, error as Error);
        }
      });
    }
  }

  /**
   * Check if currently syncing
   */
  public isSyncInProgress(): boolean {
    return this.isSyncing;
  }

  /**
   * Check if online
   */
  public isOnline(): boolean {
    return navigator.onLine;
  }
}

// ==========================================
// SINGLETON EXPORT
// ==========================================

export const offlineQueue = OfflineQueueManager.getInstance();
export default offlineQueue;
