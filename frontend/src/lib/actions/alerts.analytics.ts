/**
 * @fileoverview Stock usage analytics and valuation operations
 * @module app/alerts/analytics
 *
 * Handles retrieval of stock usage analytics and inventory valuation
 * with HIPAA-compliant audit logging.
 */

'use server';

import { serverGet } from '@/lib/api/server';
import { API_ENDPOINTS } from '@/constants/api';
import { auditLogWithContext, AUDIT_ACTIONS } from '@/lib/audit';
import type {
  ActionResult,
  StockUsageAnalytics,
  UsageAnalyticsFilter,
  TotalStockValuation,
} from './alerts.types';

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

    const data = await serverGet<StockUsageAnalytics[]>(
      `${API_ENDPOINTS.INVENTORY.ANALYTICS}/usage`,
      params
    );

    await auditLogWithContext({
      userId: 'system',
      action: AUDIT_ACTIONS.GENERATE_REPORT,
      resource: 'inventory_analytics',
      details: JSON.stringify(filter),
    });

    return {
      success: true,
      data,
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
    const params = locationId ? { locationId } : undefined;
    const data = await serverGet<TotalStockValuation>(
      `${API_ENDPOINTS.INVENTORY.ANALYTICS}/valuation`,
      params
    );

    await auditLogWithContext({
      userId: 'system',
      action: AUDIT_ACTIONS.GENERATE_REPORT,
      resource: 'inventory_analytics',
      details: JSON.stringify({ locationId }),
    });

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error('Failed to fetch inventory valuation:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch valuation',
    };
  }
}
