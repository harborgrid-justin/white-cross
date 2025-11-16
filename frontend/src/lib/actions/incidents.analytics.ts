/**
 * Incident Analytics and Statistics
 * Analytics, trends, and statistical analysis for incidents
 */

'use server';

import { serverGet } from '@/lib/api/server';
import { getApiBaseUrl } from '@/lib/api/server';
import type { IncidentAnalytics, SeverityTrend } from './incidents.types';
import { getIncidents } from './incidents.crud';

const API_BASE = getApiBaseUrl();

// ==========================================
// BASIC ANALYTICS
// ==========================================

export async function getIncidentAnalytics(filters?: {
  dateFrom?: string;
  dateTo?: string;
  studentId?: string;
}): Promise<IncidentAnalytics> {
  try {
    const queryParams = new URLSearchParams();

    if (filters?.dateFrom) queryParams.append('dateFrom', filters.dateFrom);
    if (filters?.dateTo) queryParams.append('dateTo', filters.dateTo);
    if (filters?.studentId) queryParams.append('studentId', filters.studentId);

    const url = `${API_BASE}/api/incident-report/statistics?${queryParams.toString()}`;

    const response = await serverGet<IncidentAnalytics>(url, {
      cache: 'no-store'
    });

    return response;
  } catch (error) {
    console.error('Error fetching incident analytics:', error);
    return {
      totalIncidents: 0,
      byType: {},
      byStatus: {},
      bySeverity: {}
    };
  }
}

export async function getIncidentsByType(filters?: {
  dateFrom?: string;
  dateTo?: string;
}): Promise<Record<string, number>> {
  try {
    const queryParams = new URLSearchParams();
    if (filters?.dateFrom) queryParams.append('dateFrom', filters.dateFrom);
    if (filters?.dateTo) queryParams.append('dateTo', filters.dateTo);

    const url = `${API_BASE}/api/incident-report/statistics/by-type?${queryParams.toString()}`;
    const response = await serverGet<Record<string, number>>(url, {
      cache: 'no-store'
    });
    return response;
  } catch (error) {
    console.error('Error fetching incidents by type:', error);
    return {};
  }
}

export async function getIncidentsBySeverity(filters?: {
  dateFrom?: string;
  dateTo?: string;
}): Promise<Record<string, number>> {
  try {
    const queryParams = new URLSearchParams();
    if (filters?.dateFrom) queryParams.append('dateFrom', filters.dateFrom);
    if (filters?.dateTo) queryParams.append('dateTo', filters.dateTo);

    const url = `${API_BASE}/api/incident-report/statistics/by-severity?${queryParams.toString()}`;
    const response = await serverGet<Record<string, number>>(url, {
      cache: 'no-store'
    });
    return response;
  } catch (error) {
    console.error('Error fetching incidents by severity:', error);
    return {};
  }
}

// ==========================================
// TRENDS ANALYSIS
// ==========================================

export async function getSeverityTrends(dateFrom: string, dateTo: string): Promise<SeverityTrend[]> {
  try {
    const queryParams = new URLSearchParams({
      dateFrom,
      dateTo
    });

    const url = `${API_BASE}/api/incident-report/statistics/severity-trends?${queryParams.toString()}`;
    const response = await serverGet<SeverityTrend[]>(url, {
      cache: 'no-store'
    });
    return response;
  } catch (error) {
    console.error('Error fetching severity trends:', error);
    return [];
  }
}

/**
 * Get trending incidents analysis
 */
export async function getTrendingIncidents(period: 'week' | 'month' | 'quarter' = 'month'): Promise<{
  success: boolean;
  data?: {
    increasingTypes: Array<{ type: string; count: number; change: number }>;
    decreasingTypes: Array<{ type: string; count: number; change: number }>;
    hotspots: Array<{ location: string; count: number }>;
    patterns: Array<{ pattern: string; occurrences: number }>;
  };
  error?: string;
}> {
  try {
    // Calculate date range based on period
    const now = new Date();
    const dateFrom = new Date();

    switch (period) {
      case 'week':
        dateFrom.setDate(now.getDate() - 7);
        break;
      case 'month':
        dateFrom.setMonth(now.getMonth() - 1);
        break;
      case 'quarter':
        dateFrom.setMonth(now.getMonth() - 3);
        break;
    }

    // Get analytics for current and previous period
    const currentAnalytics = await getIncidentAnalytics({
      dateFrom: dateFrom.toISOString(),
      dateTo: now.toISOString()
    });

    const previousFrom = new Date(dateFrom);
    previousFrom.setTime(previousFrom.getTime() - (now.getTime() - dateFrom.getTime()));

    const previousAnalytics = await getIncidentAnalytics({
      dateFrom: previousFrom.toISOString(),
      dateTo: dateFrom.toISOString()
    });

    if (!currentAnalytics || !previousAnalytics) {
      return { success: false, error: 'Failed to fetch analytics data' };
    }

    // Calculate trending types
    const increasingTypes: Array<{ type: string; count: number; change: number }> = [];
    const decreasingTypes: Array<{ type: string; count: number; change: number }> = [];

    Object.entries(currentAnalytics.byType).forEach(([type, currentCount]) => {
      const previousCount = previousAnalytics.byType[type] || 0;
      const change = previousCount > 0 ? ((currentCount - previousCount) / previousCount) * 100 : 0;

      if (change > 10) {
        increasingTypes.push({ type, count: currentCount, change });
      } else if (change < -10) {
        decreasingTypes.push({ type, count: currentCount, change });
      }
    });

    // Get location hotspots from current period
    const incidents = await getIncidents({
      dateFrom: dateFrom.toISOString(),
      dateTo: now.toISOString()
    });

    const locationCounts: Record<string, number> = {};
    incidents.incidents.forEach(incident => {
      locationCounts[incident.location] = (locationCounts[incident.location] || 0) + 1;
    });

    const hotspots = Object.entries(locationCounts)
      .map(([location, count]) => ({ location, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Identify patterns (simplified)
    const patterns: Array<{ pattern: string; occurrences: number }> = [];
    const highSeverityCount = Object.values(currentAnalytics.bySeverity).reduce((sum, val) => sum + val, 0);

    if (highSeverityCount > 10) {
      patterns.push({
        pattern: 'High incident frequency detected',
        occurrences: highSeverityCount
      });
    }

    return {
      success: true,
      data: {
        increasingTypes: increasingTypes.sort((a, b) => b.change - a.change),
        decreasingTypes: decreasingTypes.sort((a, b) => a.change - b.change),
        hotspots,
        patterns
      }
    };
  } catch (error) {
    const err = error as Error;
    console.error('Error fetching trending incidents:', err);
    return { success: false, error: err.message };
  }
}
