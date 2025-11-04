/**
 * Offline Functionality Manager
 *
 * Items 241, 242, 243: Offline support, network error handling, fallback content
 *
 * Provides offline detection, queue management, and graceful degradation
 * for the healthcare platform.
 */

import { QueryClient } from '@tanstack/react-query';

// Offline state management
class OfflineManager {
  private isOnline: boolean = typeof navigator !== 'undefined' ? navigator.onLine : true;
  private listeners: Set<(isOnline: boolean) => void> = new Set();
  private pendingRequests: Array<{ id: string; request: () => Promise<any>; timestamp: number }> = [];
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
        this.notifyListeners();
      }
    } catch (error) {
      const wasOnline = this.isOnline;
      this.isOnline = false;

      if (wasOnline !== this.isOnline) {
        this.notifyListeners();
      }
    }
  }

  /**
   * Handle online event
   */
  private handleOnline = (): void => {
    console.log('[OfflineManager] Connection restored');
    this.isOnline = true;
    this.notifyListeners();
    this.processQueue();
  };

  /**
   * Handle offline event
   */
  private handleOffline = (): void => {
    console.log('[OfflineManager] Connection lost');
    this.isOnline = false;
    this.notifyListeners();
  };

  /**
   * Notify all listeners of online status change
   */
  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.isOnline));
  }

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
  public queueRequest(id: string, request: () => Promise<any>): void {
    this.pendingRequests.push({
      id,
      request,
      timestamp: Date.now(),
    });

    console.log(`[OfflineManager] Queued request: ${id}`);
  }

  /**
   * Process queued requests when online
   */
  private async processQueue(): Promise<void> {
    if (!this.isOnline || this.pendingRequests.length === 0) {
      return;
    }

    console.log(`[OfflineManager] Processing ${this.pendingRequests.length} queued requests`);

    const requests = [...this.pendingRequests];
    this.pendingRequests = [];

    for (const { id, request } of requests) {
      try {
        await request();
        console.log(`[OfflineManager] Successfully processed: ${id}`);
      } catch (error) {
        console.error(`[OfflineManager] Failed to process: ${id}`, error);
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
      console.log(`[OfflineManager] Cleared ${removed} old requests`);
    }
  }

  /**
   * Get pending request count
   */
  public getPendingCount(): number {
    return this.pendingRequests.length;
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
}

// Singleton instance
export const offlineManager = new OfflineManager();

/**
 * React hook for online status
 */
export function useOnlineStatus() {
  const [isOnline, setIsOnline] = React.useState(offlineManager.getStatus());

  React.useEffect(() => {
    const unsubscribe = offlineManager.subscribe(setIsOnline);
    return unsubscribe;
  }, []);

  return isOnline;
}

/**
 * Offline-aware fetch wrapper
 */
export async function offlineFetch<T>(
  requestId: string,
  fetcher: () => Promise<T>,
  options: {
    queueIfOffline?: boolean;
    fallback?: T;
  } = {}
): Promise<T> {
  const { queueIfOffline = true, fallback } = options;

  if (!offlineManager.getStatus()) {
    console.warn(`[OfflineManager] Offline: ${requestId}`);

    if (queueIfOffline) {
      offlineManager.queueRequest(requestId, fetcher);
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
        offlineManager.queueRequest(requestId, fetcher);
      }

      if (fallback !== undefined) {
        return fallback;
      }
    }

    throw error;
  }
}

/**
 * Configure React Query for offline support
 */
export function configureOfflineQueryClient(queryClient: QueryClient): void {
  // Set network mode to 'offlineFirst' for all queries
  queryClient.setDefaultOptions({
    queries: {
      networkMode: 'offlineFirst',
      retry: (failureCount, error: any) => {
        // Don't retry if offline
        if (!offlineManager.getStatus()) {
          return false;
        }
        return failureCount < 3;
      },
    },
    mutations: {
      networkMode: 'offlineFirst',
      retry: false, // Don't auto-retry mutations when offline
    },
  });

  // Subscribe to online status changes
  offlineManager.subscribe((isOnline) => {
    if (isOnline) {
      // Refetch queries when back online
      queryClient.refetchQueries({
        type: 'active',
      });
    }
  });
}

// Re-export React for use in hooks
import * as React from 'react';

export default offlineManager;
