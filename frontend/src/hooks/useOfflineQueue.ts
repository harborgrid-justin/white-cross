/**
 * Offline Queue Hook
 * Manages offline request queue
 */

'use client';

import { useState, useCallback } from 'react';

export interface QueuedRequest {
  id: string;
  url: string;
  method: string;
  body?: any;
  timestamp: number;
  retries: number;
}

export function useOfflineQueue() {
  const [queue, setQueue] = useState<QueuedRequest[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const addToQueue = useCallback((request: Omit<QueuedRequest, 'id' | 'timestamp' | 'retries'>) => {
    const queuedRequest: QueuedRequest = {
      ...request,
      id: `${Date.now()}-${Math.random()}`,
      timestamp: Date.now(),
      retries: 0,
    };

    setQueue((prev) => [...prev, queuedRequest]);
    return queuedRequest.id;
  }, []);

  const processQueue = useCallback(async () => {
    if (isProcessing || queue.length === 0) return;

    setIsProcessing(true);

    for (const request of queue) {
      try {
        await fetch(request.url, {
          method: request.method,
          body: request.body ? JSON.stringify(request.body) : undefined,
          headers: { 'Content-Type': 'application/json' },
        });

        // Remove successful request
        setQueue((prev) => prev.filter((r) => r.id !== request.id));
      } catch (error) {
        // Increment retry count
        setQueue((prev) =>
          prev.map((r) =>
            r.id === request.id ? { ...r, retries: r.retries + 1 } : r
          )
        );
      }
    }

    setIsProcessing(false);
  }, [queue, isProcessing]);

  const clearQueue = useCallback(() => {
    setQueue([]);
  }, []);

  return {
    queue,
    queueSize: queue.length,
    isProcessing,
    addToQueue,
    processQueue,
    clearQueue,
  };
}
