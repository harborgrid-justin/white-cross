/**
 * @fileoverview Report generation and export operations
 * @module app/alerts/reports
 *
 * Handles generation of stock level reports and export to CSV
 * with HIPAA-compliant audit logging.
 */

'use server';

import { serverGet, nextFetch } from '@/lib/api/nextjs-client';
import { API_ENDPOINTS } from '@/constants/api';
import { auditLogWithContext, AUDIT_ACTIONS } from '@/lib/audit';
import type { ActionResult, StockLevelReport, ReportType } from './alerts.types';

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

    const data = await serverGet<StockLevelReport>(
      `${API_ENDPOINTS.INVENTORY.REPORTS}/stock-level`,
      params,
      {
        cache: 'no-store', // Report generation should not be cached
      }
    );

    await auditLogWithContext({
      userId: 'system',
      action: AUDIT_ACTIONS.GENERATE_REPORT,
      resource: 'inventory_report',
      resourceId: data.reportDate.toString(),
      details: JSON.stringify({ locationId, category }),
    });

    return {
      success: true,
      data,
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
 *
 * Note: Uses nextFetch for blob response handling.
 * The nextFetch core function returns text for non-JSON responses,
 * so we need to handle CSV export specially.
 */
export async function exportReportToCSV(
  reportType: ReportType,
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

    // Build query string
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `${API_ENDPOINTS.INVENTORY.REPORTS}/${reportType}/export${queryString ? `?${queryString}` : ''}`;

    // For blob responses, we get the CSV text and convert to Blob
    const csvText = await nextFetch<string>(endpoint, {
      method: 'GET',
      cache: 'no-store', // CSV exports should not be cached
      headers: {
        Accept: 'text/csv',
      },
    });

    // Convert CSV text to Blob
    const blob = new Blob([csvText], { type: 'text/csv' });

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
