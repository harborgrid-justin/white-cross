/**
 * Analytics Metrics Collection
 *
 * Server actions for collecting various analytics metrics
 */

'use server';

import { serverGet } from '@/lib/api/server';
import {
  type HealthMetricsFilters,
  type MedicationComplianceFilters,
  type AppointmentAnalyticsFilters,
  type IncidentTrendsFilters,
  type InventoryAnalyticsFilters,
  type ActionResponse,
} from './analytics.types';
import { buildDateRangeParams, handleAnalyticsError } from './analytics.utils';

/**
 * Get health metrics
 */
export async function getHealthMetrics(
  filters: HealthMetricsFilters
): Promise<ActionResponse> {
  try {
    const params = buildDateRangeParams(filters.dateRange, {
      studentIds: filters.studentIds,
      metricTypes: filters.metricTypes,
    });

    const response = await serverGet('/v1/analytics/health-metrics', params);

    return {
      success: true,
      data: response,
    };
  } catch (error: any) {
    return handleAnalyticsError('Get health metrics', error);
  }
}

/**
 * Get medication compliance data
 */
export async function getMedicationCompliance(
  filters: MedicationComplianceFilters
): Promise<ActionResponse> {
  try {
    const params = buildDateRangeParams(filters.dateRange, {
      medicationIds: filters.medicationIds,
      studentIds: filters.studentIds,
    });

    const response = await serverGet('/v1/analytics/medication-compliance', params);

    return {
      success: true,
      data: response,
    };
  } catch (error: any) {
    return handleAnalyticsError('Get medication compliance', error);
  }
}

/**
 * Get appointment analytics
 */
export async function getAppointmentAnalytics(
  filters: AppointmentAnalyticsFilters
): Promise<ActionResponse> {
  try {
    const params = buildDateRangeParams(filters.dateRange, {
      appointmentTypes: filters.appointmentTypes,
      statuses: filters.statuses,
    });

    const response = await serverGet('/v1/analytics/appointments', params);

    return {
      success: true,
      data: response,
    };
  } catch (error: any) {
    return handleAnalyticsError('Get appointment analytics', error);
  }
}

/**
 * Get incident trends
 */
export async function getIncidentTrends(
  filters: IncidentTrendsFilters
): Promise<ActionResponse> {
  try {
    const params = buildDateRangeParams(filters.dateRange, {
      incidentTypes: filters.incidentTypes,
      severities: filters.severities,
    });

    const response = await serverGet('/v1/analytics/incident-trends', params);

    return {
      success: true,
      data: response,
    };
  } catch (error: any) {
    return handleAnalyticsError('Get incident trends', error);
  }
}

/**
 * Get inventory analytics
 */
export async function getInventoryAnalytics(
  filters?: InventoryAnalyticsFilters
): Promise<ActionResponse> {
  try {
    const params: Record<string, string> = {};

    if (filters?.categories) {
      params.categories = filters.categories.join(',');
    }
    if (filters?.lowStockOnly !== undefined) {
      params.lowStockOnly = String(filters.lowStockOnly);
    }
    if (filters?.expiringOnly !== undefined) {
      params.expiringOnly = String(filters.expiringOnly);
    }
    if (filters?.daysUntilExpiration !== undefined) {
      params.daysUntilExpiration = String(filters.daysUntilExpiration);
    }

    const response = await serverGet('/v1/analytics/inventory', params);

    return {
      success: true,
      data: response,
    };
  } catch (error: any) {
    return handleAnalyticsError('Get inventory analytics', error);
  }
}
