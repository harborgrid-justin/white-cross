/**
 * Health Check Service
 *
 * Monitor system health and connectivity
 */

import type { HealthCheckStatus } from './types';

const HEALTH_CHECK_INTERVAL = 60000; // 1 minute
const API_TIMEOUT = 5000; // 5 seconds

let healthStatus: HealthCheckStatus = {
  status: 'healthy',
  checks: {
    api: false,
    database: false,
    cache: false,
    websocket: false,
  },
  latency: {
    api: 0,
    database: 0,
  },
  errors: [],
  timestamp: new Date(),
};

let intervalId: NodeJS.Timeout | null = null;
let statusCallbacks: Array<(status: HealthCheckStatus) => void> = [];

/**
 * Start health monitoring
 */
export function startHealthMonitoring(apiUrl?: string): void {
  if (intervalId) {
    console.warn('Health monitoring already started');
    return;
  }

  // Initial check
  checkHealth(apiUrl);

  // Periodic checks
  intervalId = setInterval(() => {
    checkHealth(apiUrl);
  }, HEALTH_CHECK_INTERVAL);
}

/**
 * Stop health monitoring
 */
export function stopHealthMonitoring(): void {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
}

/**
 * Subscribe to health status changes
 */
export function onHealthChange(callback: (status: HealthCheckStatus) => void): () => void {
  statusCallbacks.push(callback);

  // Return unsubscribe function
  return () => {
    statusCallbacks = statusCallbacks.filter((cb) => cb !== callback);
  };
}

/**
 * Check system health
 */
export async function checkHealth(apiUrl?: string): Promise<HealthCheckStatus> {
  const errors: string[] = [];
  const checks = {
    api: false,
    database: false,
    cache: false,
    websocket: false,
  };
  const latency = {
    api: 0,
    database: 0,
  };

  // Check API health
  try {
    const apiCheck = await checkAPI(apiUrl);
    checks.api = apiCheck.success;
    latency.api = apiCheck.latency;
    checks.database = apiCheck.database || false;
    checks.cache = apiCheck.cache || false;
    latency.database = apiCheck.databaseLatency || 0;

    if (!apiCheck.success) {
      errors.push(apiCheck.error || 'API health check failed');
    }
  } catch (error) {
    errors.push(`API check error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }

  // Check WebSocket (if available)
  try {
    checks.websocket = await checkWebSocket();
  } catch (error) {
    // WebSocket check is optional
    console.debug('WebSocket check failed:', error);
  }

  // Determine overall status
  let status: HealthCheckStatus['status'] = 'healthy';
  if (!checks.api || !checks.database) {
    status = 'unhealthy';
  } else if (latency.api > 2000 || latency.database > 1000) {
    status = 'degraded';
  }

  healthStatus = {
    status,
    checks,
    latency,
    errors,
    timestamp: new Date(),
  };

  // Notify subscribers
  statusCallbacks.forEach((callback) => {
    try {
      callback(healthStatus);
    } catch (error) {
      console.error('Error in health status callback:', error);
    }
  });

  return healthStatus;
}

/**
 * Check API health
 */
async function checkAPI(apiUrl?: string): Promise<{
  success: boolean;
  latency: number;
  database?: boolean;
  cache?: boolean;
  databaseLatency?: number;
  error?: string;
}> {
  const baseUrl = apiUrl || process.env.NEXT_PUBLIC_API_URL || '/api';
  const url = `${baseUrl}/health`;
  const startTime = performance.now();

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

    const response = await fetch(url, {
      method: 'GET',
      signal: controller.signal,
      headers: {
        'Cache-Control': 'no-cache',
      },
    });

    clearTimeout(timeoutId);

    const latency = performance.now() - startTime;

    if (!response.ok) {
      return {
        success: false,
        latency,
        error: `API returned ${response.status}`,
      };
    }

    const data = await response.json();

    return {
      success: true,
      latency,
      database: data.database === 'ok',
      cache: data.cache === 'ok',
      databaseLatency: data.databaseLatency,
    };
  } catch (error) {
    const latency = performance.now() - startTime;

    if (error instanceof Error && error.name === 'AbortError') {
      return {
        success: false,
        latency,
        error: 'API request timeout',
      };
    }

    return {
      success: false,
      latency,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Check WebSocket connectivity
 */
async function checkWebSocket(): Promise<boolean> {
  // This is a placeholder - implement based on your WebSocket setup
  return false;
}

/**
 * Get current health status
 */
export function getHealthStatus(): HealthCheckStatus {
  return { ...healthStatus };
}

/**
 * Check if system is healthy
 */
export function isHealthy(): boolean {
  return healthStatus.status === 'healthy';
}

/**
 * Check if API is available
 */
export function isAPIAvailable(): boolean {
  return healthStatus.checks.api;
}

/**
 * Check if database is available
 */
export function isDatabaseAvailable(): boolean {
  return healthStatus.checks.database;
}

/**
 * Get API latency
 */
export function getAPILatency(): number {
  return healthStatus.latency.api;
}

/**
 * Get database latency
 */
export function getDatabaseLatency(): number {
  return healthStatus.latency.database;
}

/**
 * Get health errors
 */
export function getHealthErrors(): string[] {
  return [...healthStatus.errors];
}

/**
 * Force health check
 */
export async function forceHealthCheck(apiUrl?: string): Promise<HealthCheckStatus> {
  return checkHealth(apiUrl);
}

/**
 * Check connectivity (simple ping)
 */
export async function checkConnectivity(): Promise<boolean> {
  if (typeof navigator === 'undefined') return true;

  if (!navigator.onLine) {
    return false;
  }

  // Try to fetch a small resource
  try {
    const response = await fetch('/favicon.ico', {
      method: 'HEAD',
      cache: 'no-cache',
    });
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Monitor network status
 */
export function monitorNetworkStatus(
  onOnline?: () => void,
  onOffline?: () => void
): () => void {
  if (typeof window === 'undefined') {
    return () => {};
  }

  const handleOnline = () => {
    console.log('Network: Online');
    onOnline?.();
    checkHealth();
  };

  const handleOffline = () => {
    console.log('Network: Offline');
    onOffline?.();
  };

  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);

  // Return cleanup function
  return () => {
    window.removeEventListener('online', handleOnline);
    window.removeEventListener('offline', handleOffline);
  };
}

/**
 * Export health data
 */
export function exportHealthData(): {
  current: HealthCheckStatus;
  history: HealthCheckStatus[];
} {
  return {
    current: getHealthStatus(),
    history: [], // Could implement history tracking if needed
  };
}

export default {
  startHealthMonitoring,
  stopHealthMonitoring,
  onHealthChange,
  checkHealth,
  getHealthStatus,
  isHealthy,
  isAPIAvailable,
  isDatabaseAvailable,
  getAPILatency,
  getDatabaseLatency,
  getHealthErrors,
  forceHealthCheck,
  checkConnectivity,
  monitorNetworkStatus,
  exportHealthData,
};
