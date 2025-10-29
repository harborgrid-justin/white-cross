/**
 * Health Check Hook
 *
 * React hook for monitoring system health
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  getHealthStatus,
  onHealthChange,
  forceHealthCheck,
  checkConnectivity,
} from '../health-check';
import type { HealthCheckStatus } from '../types';

export function useHealthCheck(options: { autoCheck?: boolean } = {}) {
  const { autoCheck = true } = options;
  const [status, setStatus] = useState<HealthCheckStatus>(getHealthStatus());
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    if (!autoCheck) return;

    // Subscribe to health changes
    const unsubscribe = onHealthChange((newStatus) => {
      setStatus(newStatus);
    });

    // Monitor network status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    if (typeof window !== 'undefined') {
      setIsOnline(navigator.onLine);
      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);
    }

    return () => {
      unsubscribe();
      if (typeof window !== 'undefined') {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      }
    };
  }, [autoCheck]);

  const check = useCallback(async () => {
    const newStatus = await forceHealthCheck();
    setStatus(newStatus);
    return newStatus;
  }, []);

  const checkNetwork = useCallback(async () => {
    const online = await checkConnectivity();
    setIsOnline(online);
    return online;
  }, []);

  return {
    status,
    isHealthy: status.status === 'healthy',
    isDegraded: status.status === 'degraded',
    isUnhealthy: status.status === 'unhealthy',
    isOnline,
    check,
    checkNetwork,
  };
}
