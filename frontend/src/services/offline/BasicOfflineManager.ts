/**
 * Basic Offline Manager
 *
 * Simple offline detection and request queuing from lib/offline/offline-manager.ts
 */

import { QueryClient } from '@tanstack/react-query';

export class BasicOfflineManager {
  private isOnline: boolean = typeof navigator !== 'undefined' ? navigator.onLine : true;
  private listeners: Set<(isOnline: boolean) => void> = new Set();
  private pendingRequests: Array<{ id: string; request: () => Promise<unknown>; timestamp: number }> = [];
  private retryInterval: NodeJS.Timeout | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.setupListeners();
    }
  }

  /**
   * Setup online/offline event listeners
   */
  private setupListeners(): void {
    window.addEventListener('online', this.handleOnline);
    window.addEventListener('offline', this.handleOffline);

    // Periodic connectivity check (fallback for unreliable events)
    setInterval(() => this.checkConnectivity(), 30000); // Every 30 seconds
  }

  /**
   * Check actual connectivity (not just network interface)
   */
  private async checkConnectivity(): Promise<void> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      // Ping a lightweight endpoint
      const response = await fetch('/api/health', {
        method: 'HEAD',
        signal: controller.signal,
        cache: 'no-store',
      });

      clearTimeout(timeoutId);

      const wasOnline = this.isOnline;
      this.isOnline = response.ok;

      if (wasOnline !== this.isOnline) {
        this.listeners.forEach(listener => listener(this.isOnline));
      }
    } catch (error) {
      console.warn('[BasicOfflineManager] Connectivity check failed:', error);
      const wasOnline = this.isOnline;
      this.isOnline = false;

      if (wasOnline !== this.isOnline) {
        this.listeners.forEach(listener => listener(this.isOnline));
      }
    }
  }

  /**
   * Handle online event
   */
  private handleOnline = (): void => {
    console.log('[BasicOfflineManager] Connection restored');
    this.isOnline = true;
    this.listeners.forEach(listener => listener(this.isOnline));
    this.processQueue();
  };

  /**
   * Handle offline event
   */
  private handleOffline = (): void => {
    console.log('[BasicOfflineManager] Connection lost');
    this.isOnline = false;
    this.listeners.forEach(listener => listener(this.isOnline));
  };

  /**
   * Subscribe to online status changes
   */
  public subscribe(listener: (isOnline: boolean) => void): () => void {
    this.listeners.add(listener);

    // Return unsubscribe function
    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Get current online status
   */
  public getStatus(): boolean {
    return this.isOnline;
  }

  /**
   * Queue request for retry when back online
   */
  public queueRequest(id: string, request: () => Promise<unknown>): void {
    this.pendingRequests.push({
      id,
      request,
      timestamp: Date.now(),
    });

    console.log(`[BasicOfflineManager] Queued request: ${id}`);
  }

  /**
   * Process queued requests when online
   */
  private async processBasicQueue(): Promise<void> {
    if (!this.isOnline || this.pendingRequests.length === 0) {
      return;
    }

    console.log(`[BasicOfflineManager] Processing ${this.pendingRequests.length} queued requests`);

    const requests = [...this.pendingRequests];
    this.pendingRequests = [];

    for (const { id, request } of requests) {
      try {
        await request();
        console.log(`[BasicOfflineManager] Successfully processed: ${id}`);
      } catch (error) {
        console.error(`[BasicOfflineManager] Failed to process: ${id}`, error);
        // Re-queue if still offline
        if (!this.isOnline) {
          this.pendingRequests.push({ id, request, timestamp: Date.now() });
        }
      }
    }
  }

  /**
   * Clear old queued requests (older than 24 hours)
   */
  public clearOldRequests(): void {
    const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
    const originalLength = this.pendingRequests.length;

    this.pendingRequests = this.pendingRequests.filter(
      req => req.timestamp > oneDayAgo
    );

    const removed = originalLength - this.pendingRequests.length;
    if (removed > 0) {
      console.log(`[BasicOfflineManager] Cleared ${removed} old requests`);
    }
  }

  /**
   * Get pending request count
   */
  public getPendingCount(): number {
    return this.pendingRequests.length;
  }

  /**
   * Configure React Query for offline support
   */
  public configureOfflineQueryClient(queryClient: QueryClient): void {
    // Subscribe to online status changes
    this.subscribe((isOnline) => {
      if (isOnline) {
        // Refetch queries when back online
        queryClient.invalidateQueries();
      }
    });
  }

  /**
   * Offline-aware fetch wrapper
   */
  public async offlineFetch<T>(
    requestId: string,
    fetcher: () => Promise<T>,
    options: {
      queueIfOffline?: boolean;
      fallback?: T;
    } = {}
  ): Promise<T> {
    const { queueIfOffline = true, fallback } = options;

    if (!this.isOnline) {
      console.warn(`[BasicOfflineManager] Offline: ${requestId}`);

      if (queueIfOffline) {
        this.queueRequest(requestId, fetcher);
      }

      if (fallback !== undefined) {
        return fallback;
      }

      throw new Error('No internet connection. Request queued for retry.');
    }

    try {
      return await fetcher();
    } catch (error) {
      // Check if error is due to network failure
      if (
        error instanceof TypeError &&
        (error.message.includes('fetch') || error.message.includes('network'))
      ) {
        if (queueIfOffline) {
          this.queueRequest(requestId, fetcher);
        }

        if (fallback !== undefined) {
          return fallback;
        }
      }

      throw error;
    }
  }

  /**
   * Cleanup listeners
   */
  public destroy(): void {
    if (typeof window !== 'undefined') {
      window.removeEventListener('online', this.handleOnline);
      window.removeEventListener('offline', this.handleOffline);
    }

    if (this.retryInterval) {
      clearInterval(this.retryInterval);
    }

    this.listeners.clear();
    this.pendingRequests = [];
  }

  // Alias for backward compatibility
  private processQueue = this.processBasicQueue;
}