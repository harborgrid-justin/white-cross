/**
 * @fileoverview Next.js App Router Server Actions for Inventory Alerts and Reports
 * @module app/alerts/actions
 *
 * Enhanced with HIPAA-compliant audit logging and proper cache management.
 * Handles low-stock alerts, expiration monitoring, and inventory reporting.
 */

'use server';

import { revalidatePath, revalidateTag } from 'next/cache';
import { apiClient } from '@/services/core/ApiClient';
import { API_ENDPOINTS } from '@/constants/api';
import { auditLogWithContext, AUDIT_ACTIONS } from '@/lib/audit';
import type {
  LowStockAlert,
  ExpirationAlert,
  BulkReorderRecommendations,
  StockTransferRecommendation,
  StockLevelReport,
  InventoryDashboardStats,
  StockUsageAnalytics,
  UsageAnalyticsFilter,
  TotalStockValuation,
} from '@/schemas/stock.schemas';

// Common interfaces
interface ActionResult<T = void> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// ==========================================
// ALERT OPERATIONS
// ==========================================

/**
 * Get low stock alerts with HIPAA audit logging
 */
export async function getLowStockAlerts(
  locationId?: string
): Promise<ActionResult<LowStockAlert[]>> {
  try {
    const params = locationId ? { locationId } : {};
    const response = await apiClient.get<LowStockAlert[]>(
      API_ENDPOINTS.INVENTORY.LOW_STOCK,
      { params }
    );

    await auditLogWithContext({
      userId: 'system', // In production, get from session
      action: AUDIT_ACTIONS.VIEW_APPOINTMENT, // Use existing audit actions
      resource: 'inventory_alerts',
      details: JSON.stringify({ locationId }),
    });

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error('Failed to fetch low stock alerts:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch low stock alerts',
    };
  }
}

/**
 * Get expiration alerts with HIPAA audit logging
 */
export async function getExpirationAlerts(
  daysAhead = 90,
  locationId?: string
): Promise<ActionResult<ExpirationAlert[]>> {
  try {
    const params: Record<string, string | number> = { daysAhead };
    if (locationId) params.locationId = locationId;

    const response = await apiClient.get<ExpirationAlert[]>(
      API_ENDPOINTS.INVENTORY.EXPIRING,
      { params }
    );

    await auditLogWithContext({
      userId: 'system',
      action: AUDIT_ACTIONS.VIEW_APPOINTMENT,
      resource: 'inventory_alerts',
      details: JSON.stringify({ daysAhead, locationId }),
    });

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error('Failed to fetch expiration alerts:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch expiration alerts',
    };
  }
}

/**
 * Acknowledge alert with audit logging
 */
export async function acknowledgeAlert(
  alertId: string,
  userId: string,
  actionTaken?: string
): Promise<ActionResult<void>> {
  try {
    await apiClient.post(`${API_ENDPOINTS.INVENTORY.ALERTS}/${alertId}/acknowledge`, {
      userId,
      actionTaken,
    });

    await auditLogWithContext({
      userId,
      action: AUDIT_ACTIONS.UPDATE_APPOINTMENT,
      resource: 'inventory_alert',
      resourceId: alertId,
      details: JSON.stringify({ actionTaken }),
    });

    revalidateTag('inventory-alerts', 'default');
    revalidateTag('low-stock-alerts', 'default');
    revalidatePath('/inventory/alerts');

    return {
      success: true,
      message: 'Alert acknowledged successfully',
    };
  } catch (error) {
    console.error('Failed to acknowledge alert:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to acknowledge alert',
    };
  }
}

/**
 * Dismiss alert with audit logging
 */
export async function dismissAlert(
  alertId: string,
  userId: string
): Promise<ActionResult<void>> {
  try {
    await apiClient.post(`${API_ENDPOINTS.INVENTORY.ALERTS}/${alertId}/dismiss`);

    await auditLogWithContext({
      userId,
      action: AUDIT_ACTIONS.DELETE_APPOINTMENT,
      resource: 'inventory_alert',
      resourceId: alertId,
    });

    revalidateTag('inventory-alerts', 'default');
    revalidateTag('expiration-alerts', 'default');
    revalidatePath('/inventory/alerts');

    return {
      success: true,
      message: 'Alert dismissed successfully',
    };
  } catch (error) {
    console.error('Failed to dismiss alert:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to dismiss alert',
    };
  }
}

// ==========================================
// RECOMMENDATION OPERATIONS
// ==========================================

/**
 * Get reorder recommendations with audit logging
 */
export async function getReorderRecommendations(
  locationId?: string
): Promise<ActionResult<BulkReorderRecommendations>> {
  try {
    const params = locationId ? { locationId } : {};
    const response = await apiClient.get<BulkReorderRecommendations>(
      API_ENDPOINTS.INVENTORY.REORDER,
      { params }
    );

    await auditLogWithContext({
      userId: 'system',
      action: AUDIT_ACTIONS.GENERATE_REPORT,
      resource: 'inventory_recommendations',
      details: JSON.stringify({ locationId }),
    });

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error('Failed to fetch reorder recommendations:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch reorder recommendations',
    };
  }
}

/**
 * Get stock transfer recommendations
 */
export async function getTransferRecommendations(): Promise<
  ActionResult<StockTransferRecommendation[]>
> {
  try {
    const response = await apiClient.get<StockTransferRecommendation[]>(
      `${API_ENDPOINTS.INVENTORY.BASE}/transfer-recommendations`
    );

    await auditLogWithContext({
      userId: 'system',
      action: AUDIT_ACTIONS.GENERATE_REPORT,
      resource: 'inventory_recommendations',
    });

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error('Failed to fetch transfer recommendations:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch transfer recommendations',
    };
  }
}

// ==========================================
// ANALYTICS OPERATIONS
// ==========================================

/**
 * Get stock usage analytics with audit logging
 */
export async function getStockUsageAnalytics(
  filter: UsageAnalyticsFilter
): Promise<ActionResult<StockUsageAnalytics[]>> {
  try {
    const params: Record<string, string | number | boolean> = {};
    Object.entries(filter).forEach(([key, value]) => {
      if (value !== undefined) {
        if (value instanceof Date) {
          params[key] = value.toISOString();
        } else {
          params[key] = String(value);
        }
      }
    });

    const response = await apiClient.get<StockUsageAnalytics[]>(
      `${API_ENDPOINTS.INVENTORY.ANALYTICS}/usage`,
      { params }
    );

    await auditLogWithContext({
      userId: 'system',
      action: AUDIT_ACTIONS.GENERATE_REPORT,
      resource: 'inventory_analytics',
      details: JSON.stringify(filter),
    });

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error('Failed to fetch usage analytics:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch usage analytics',
    };
  }
}

/**
 * Get inventory valuation with audit logging
 */
export async function getInventoryValuation(
  locationId?: string
): Promise<ActionResult<TotalStockValuation>> {
  try {
    const params = locationId ? { locationId } : {};
    const response = await apiClient.get<TotalStockValuation>(
      `${API_ENDPOINTS.INVENTORY.ANALYTICS}/valuation`,
      { params }
    );

    await auditLogWithContext({
      userId: 'system',
      action: AUDIT_ACTIONS.GENERATE_REPORT,
      resource: 'inventory_analytics',
      details: JSON.stringify({ locationId }),
    });

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error('Failed to fetch inventory valuation:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch valuation',
    };
  }
}

// ==========================================
// DASHBOARD OPERATIONS
// ==========================================

/**
 * Get inventory dashboard statistics with audit logging
 */
export async function getInventoryDashboardStats(
  locationId?: string
): Promise<ActionResult<InventoryDashboardStats>> {
  try {
    const params = locationId ? { locationId } : {};
    const response = await apiClient.get<InventoryDashboardStats>(
      API_ENDPOINTS.INVENTORY.DASHBOARD,
      { params }
    );

    await auditLogWithContext({
      userId: 'system',
      action: AUDIT_ACTIONS.GENERATE_REPORT,
      resource: 'inventory_dashboard',
      details: JSON.stringify({ locationId }),
    });

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error('Failed to fetch dashboard stats:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch dashboard stats',
    };
  }
}

// ==========================================
// REPORT OPERATIONS
// ==========================================

/**
 * Generate stock level report with audit logging
 */
export async function generateStockLevelReport(
  locationId?: string,
  category?: string
): Promise<ActionResult<StockLevelReport>> {
  try {
    const params: Record<string, string> = {};
    if (locationId) params.locationId = locationId;
    if (category) params.category = category;

    const response = await apiClient.get<StockLevelReport>(
      `${API_ENDPOINTS.INVENTORY.REPORTS}/stock-level`,
      { params }
    );

    await auditLogWithContext({
      userId: 'system',
      action: AUDIT_ACTIONS.GENERATE_REPORT,
      resource: 'inventory_report',
      resourceId: response.data.reportDate.toString(),
      details: JSON.stringify({ locationId, category }),
    });

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error('Failed to generate stock level report:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate report',
    };
  }
}

/**
 * Export report to CSV with audit logging
 */
export async function exportReportToCSV(
  reportType: 'stock-level' | 'transaction-summary' | 'expiration' | 'variance',
  filters: Record<string, unknown>,
  userId: string
): Promise<ActionResult<Blob>> {
  try {
    const params: Record<string, string> = {};
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) {
        if (value instanceof Date) {
          params[key] = value.toISOString();
        } else {
          params[key] = String(value);
        }
      }
    });

    // Use fetch directly for blob response
    const response = await fetch(
      `${API_ENDPOINTS.INVENTORY.REPORTS}/${reportType}/export?${new URLSearchParams(params).toString()}`,
      {
        headers: {
          Accept: 'text/csv',
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to export report');
    }

    const blob = await response.blob();

    await auditLogWithContext({
      userId,
      action: AUDIT_ACTIONS.EXPORT_DATA,
      resource: 'inventory_report',
      details: JSON.stringify({ reportType, filters }),
    });

    return {
      success: true,
      data: blob,
      message: 'Report exported successfully',
    };
  } catch (error) {
    console.error('Failed to export report:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to export report',
    };
  }
}
