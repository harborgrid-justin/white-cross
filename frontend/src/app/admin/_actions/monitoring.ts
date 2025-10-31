/**
 * @fileoverview Admin Monitoring Server Actions
 * @module app/admin/_actions/monitoring
 *
 * Server actions for admin monitoring functionality
 */

'use server';

import { cache } from 'react';
import { cacheTag } from 'next/cache';

/**
 * System Health Data Interface
 */
interface SystemHealth {
  status: 'healthy' | 'warning' | 'critical';
  uptime: number;
  memory: {
    used: number;
    total: number;
    percentage: number;
  };
  database: {
    status: 'connected' | 'disconnected';
    responseTime: number;
  };
  redis: {
    status: 'connected' | 'disconnected';
    responseTime: number;
  };
  lastChecked: string;
}

/**
 * Get system health information
 * Cached for 30 seconds to prevent excessive monitoring calls
 */
export const getSystemHealth = cache(async (): Promise<SystemHealth> => {
  'use cache';
  cacheTag('system-health');
  
  try {
    // In a real implementation, this would check actual system metrics
    // For now, return mock data
    const mockHealth: SystemHealth = {
      status: 'healthy',
      uptime: Date.now() - (24 * 60 * 60 * 1000), // 24 hours ago
      memory: {
        used: 2048,
        total: 8192,
        percentage: 25
      },
      database: {
        status: 'connected',
        responseTime: 45
      },
      redis: {
        status: 'connected',
        responseTime: 12
      },
      lastChecked: new Date().toISOString()
    };

    return mockHealth;
  } catch (error) {
    console.error('Failed to get system health:', error);
    throw new Error('Failed to retrieve system health information');
  }
});

/**
 * Get system metrics for dashboard
 */
export const getSystemMetrics = cache(async () => {
  'use cache';
  cacheTag('system-metrics');
  
  // Mock metrics data - replace with actual implementation
  return {
    cpu: {
      usage: 35,
      cores: 8
    },
    memory: {
      used: 2048,
      total: 8192,
      percentage: 25
    },
    disk: {
      used: 120,
      total: 500,
      percentage: 24
    },
    network: {
      incoming: 1024,
      outgoing: 512
    }
  };
});
