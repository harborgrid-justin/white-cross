/**
 * @fileoverview Broadcast Analytics and Statistics
 * @module lib/actions/broadcasts/analytics
 *
 * Functions for retrieving broadcast statistics, analytics, and dashboard data
 * with HIPAA audit logging.
 */

'use server';

import { cache } from 'react';

// Core API integrations
import { serverGet } from '@/lib/api/nextjs-client';
import { API_ENDPOINTS } from '@/constants/api';
import { auditLog, AUDIT_ACTIONS } from '@/lib/audit';

// Types
import type {
  Broadcast,
  BroadcastStats
} from './broadcasts.types';

// Import functions from other modules
import { getBroadcasts, getBroadcastAnalytics } from './broadcasts.cache';

// ==========================================
// STATISTICS FUNCTIONS
// ==========================================

/**
 * Get broadcast statistics for dashboard
 * Provides comprehensive broadcast metrics with proper caching
 */
export const getBroadcastStats = cache(async (): Promise<BroadcastStats> => {
  try {
    // Fetch broadcasts for stats calculation
    const broadcasts = await serverGet<Broadcast[]>(
      `${API_ENDPOINTS.BROADCASTS?.BASE || '/api/broadcasts'}`,
      undefined,
      {
        cache: 'force-cache',
        next: {
          revalidate: 300, // 5 minutes
          tags: ['broadcast-stats', 'broadcast-dashboard']
        }
      }
    );

    // Calculate stats from broadcasts
    const totalBroadcasts = broadcasts.length;
    const activeCampaigns = broadcasts.filter(b => b.status === 'sending').length;
    const scheduledMessages = broadcasts.filter(b => b.status === 'scheduled').length;
    const emergencyAlerts = broadcasts.filter(b => b.priority === 'urgent').length;
    const healthAlerts = broadcasts.filter(b => b.type === 'in_app').length;

    const totalRecipients = broadcasts.reduce((sum, b) => sum + b.totalRecipients, 0);
    const totalSuccess = broadcasts.reduce((sum, b) => sum + b.successCount, 0);
    const totalOpened = broadcasts.reduce((sum, b) => sum + (b.openRate ? b.totalRecipients * (b.openRate / 100) : 0), 0);

    const deliveryRate = totalRecipients > 0 ? (totalSuccess / totalRecipients) * 100 : 0;
    const openRate = totalRecipients > 0 ? (totalOpened / totalRecipients) * 100 : 0;

    const stats: BroadcastStats = {
      totalBroadcasts,
      activeCampaigns,
      scheduledMessages,
      totalRecipients,
      emergencyAlerts,
      healthAlerts,
      deliveryRate: Math.round(deliveryRate * 100) / 100,
      openRate: Math.round(openRate * 100) / 100,
    };

    // PHI protection audit log
    await auditLog({
      action: AUDIT_ACTIONS.EXPORT_DATA,
      resource: 'broadcast_stats',
      resourceId: 'dashboard-stats',
      details: 'Retrieved broadcast statistics for dashboard display'
    });

    return stats;
  } catch (error) {
    console.error('Error fetching broadcast stats:', error);
    // Return default stats on error
    return {
      totalBroadcasts: 0,
      activeCampaigns: 0,
      scheduledMessages: 0,
      totalRecipients: 0,
      emergencyAlerts: 0,
      healthAlerts: 0,
      deliveryRate: 0,
      openRate: 0,
    };
  }
});

/**
 * Get comprehensive broadcast dashboard data
 * Combines broadcast records and statistics for dashboard display
 */
export const getBroadcastDashboardData = cache(async () => {
  try {
    // Fetch both broadcasts and stats in parallel for optimal performance
    const [broadcasts, stats] = await Promise.all([
      getBroadcasts(),
      getBroadcastStats()
    ]);

    // HIPAA compliance audit logging
    await auditLog({
      action: AUDIT_ACTIONS.EXPORT_DATA,
      resource: 'broadcast_dashboard',
      resourceId: 'dashboard-view',
      details: `Retrieved ${broadcasts.length} broadcast records for dashboard`
    });

    return {
      broadcasts,
      stats
    };
  } catch (error) {
    console.error('Error fetching broadcast dashboard data:', error);

    // Return empty data structure on error
    return {
      broadcasts: [] as Broadcast[],
      stats: {
        totalBroadcasts: 0,
        activeCampaigns: 0,
        scheduledMessages: 0,
        totalRecipients: 0,
        emergencyAlerts: 0,
        healthAlerts: 0,
        deliveryRate: 0,
        openRate: 0,
      } as BroadcastStats
    };
  }
});

/**
 * Get broadcast overview
 */
export async function getBroadcastOverview(): Promise<{
  totalBroadcasts: number;
  sentBroadcasts: number;
  scheduledBroadcasts: number;
  failedBroadcasts: number;
  averageOpenRate: number;
}> {
  try {
    const broadcasts = await getBroadcasts();
    const analytics = await getBroadcastAnalytics();

    return {
      totalBroadcasts: broadcasts.length,
      sentBroadcasts: broadcasts.filter(b => b.status === 'sent').length,
      scheduledBroadcasts: broadcasts.filter(b => b.status === 'scheduled').length,
      failedBroadcasts: broadcasts.filter(b => b.status === 'failed').length,
      averageOpenRate: analytics?.averageOpenRate || 0,
    };
  } catch {
    return {
      totalBroadcasts: 0,
      sentBroadcasts: 0,
      scheduledBroadcasts: 0,
      failedBroadcasts: 0,
      averageOpenRate: 0,
    };
  }
}
