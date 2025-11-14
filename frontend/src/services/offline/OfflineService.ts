/**
 * Offline Service
 *
 * Orchestrates offline functionality with modular components
 */

import { QueryClient } from '@tanstack/react-query';
import { BasicOfflineManager } from './BasicOfflineManager';
import { ConnectionMonitor } from './ConnectionMonitor';
import { OfflineQueueManager } from './OfflineQueueManager';
import { ConnectionState, ConnectionQuality } from './types';

export class OfflineService {
  private basicManager: BasicOfflineManager;
  private connectionMonitor: ConnectionMonitor;
  private queueManager: OfflineQueueManager;

  private queryClient?: QueryClient;
  private isInitialized = false;

  constructor(queryClient?: QueryClient) {
    this.basicManager = new BasicOfflineManager();
    this.connectionMonitor = ConnectionMonitor.getInstance();
    this.queueManager = OfflineQueueManager.getInstance();

    if (queryClient) {
      this.queryClient = queryClient;
    }
  }

  /**
   * Initialize offline service
   */
  public async initialize(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    try {
      // Components initialize themselves as singletons

      // Configure React Query if provided
      if (this.queryClient) {
        this.basicManager.configureOfflineQueryClient(this.queryClient);
      }

      // Setup cross-component subscriptions
      this.setupSubscriptions();

      this.isInitialized = true;
      console.log('[OfflineService] Initialized successfully');
    } catch (error) {
      console.error('[OfflineService] Initialization failed:', error);
      throw error;
    }
  }

  /**
   * Setup subscriptions between components
   */
  private setupSubscriptions(): void {
    // When basic manager detects online, sync queue
    this.basicManager.subscribe(async (isOnline) => {
      if (isOnline) {
        await this.syncPendingRequests();
      }
    });
  }

  /**
   * Get current connection status
   */
  public getConnectionStatus(): {
    isOnline: boolean;
    state: ConnectionState;
    quality: ConnectionQuality;
  } {
    return {
      isOnline: this.basicManager.getStatus(),
      state: this.connectionMonitor.getState(),
      quality: this.connectionMonitor.getQuality(),
    };
  }

  /**
   * Queue request for offline processing
   */
  public async queueRequest<T>(
    id: string,
    request: () => Promise<T>,
    options: {
      priority?: 'low' | 'normal' | 'high';
      retry?: boolean;
    } = {}
  ): Promise<void> {
    const { retry = true } = options;

    if (this.basicManager.getStatus()) {
      // Online - execute immediately
      try {
        await request();
      } catch (error) {
        if (retry) {
          // Queue for retry if failed
          this.basicManager.queueRequest(id, request);
        }
        throw error;
      }
    } else {
      // Offline - queue for later
      this.basicManager.queueRequest(id, request);
    }
  }

  /**
   * Sync pending requests when back online
   */
  private async syncPendingRequests(): Promise<void> {
    try {
      await this.queueManager.syncQueue();
      console.log('[OfflineService] Synced pending requests');
    } catch (error) {
      console.error('[OfflineService] Failed to sync requests:', error);
    }
  }

  /**
   * Get pending request count
   */
  public getPendingCount(): number {
    return this.basicManager.getPendingCount();
  }

  /**
   * Clear old requests
   */
  public clearOldRequests(): void {
    this.basicManager.clearOldRequests();
  }

  /**
   * Check if service is ready
   */
  public isReady(): boolean {
    return this.isInitialized;
  }

  /**
   * Get feature support information
   */
  public getFeatureSupport(): Record<string, boolean> {
    return {
      indexedDB: typeof window !== 'undefined' && 'indexedDB' in window,
      fetch: typeof fetch !== 'undefined',
      localStorage: typeof window !== 'undefined' && 'localStorage' in window && window.localStorage !== null,
    };
  }

  /**
   * Cleanup resources
   */
  public destroy(): void {
    this.basicManager.destroy();
    this.connectionMonitor.destroy();
    this.isInitialized = false;
  }
}