/**
 * Connection Monitor Hook
 * Monitors network connectivity status
 */

'use client';

import { useState, useEffect } from 'react';

export interface ConnectionStatus {
  isOnline: boolean;
  isConnected: boolean;
  latency?: number;
  lastChecked?: Date;
}

export function useConnectionMonitor() {
  const [status, setStatus] = useState<ConnectionStatus>({
    isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
    isConnected: true,
  });

  useEffect(() => {
    const handleOnline = () => {
      setStatus((prev) => ({
        ...prev,
        isOnline: true,
        isConnected: true,
        lastChecked: new Date(),
      }));
    };

    const handleOffline = () => {
      setStatus((prev) => ({
        ...prev,
        isOnline: false,
        isConnected: false,
        lastChecked: new Date(),
      }));
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return status;
}
