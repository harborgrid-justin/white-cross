/**
 * @fileoverview Cache management utilities for inventory alerts
 * @module app/alerts/cache
 *
 * Provides centralized cache invalidation functions for inventory alert operations.
 */

'use server';

import { revalidatePath, revalidateTag } from 'next/cache';

/**
 * Revalidate all inventory alert caches
 */
export function revalidateAlertCaches(): void {
  revalidateTag('inventory-alerts', 'default');
  revalidateTag('low-stock-alerts', 'default');
  revalidateTag('expiration-alerts', 'default');
  revalidatePath('/inventory/alerts');
}

/**
 * Revalidate low stock alert caches
 */
export function revalidateLowStockCaches(): void {
  revalidateTag('inventory-alerts', 'default');
  revalidateTag('low-stock-alerts', 'default');
  revalidatePath('/inventory/alerts');
}

/**
 * Revalidate expiration alert caches
 */
export function revalidateExpirationCaches(): void {
  revalidateTag('inventory-alerts', 'default');
  revalidateTag('expiration-alerts', 'default');
  revalidatePath('/inventory/alerts');
}

/**
 * Revalidate dashboard caches
 */
export function revalidateDashboardCaches(): void {
  revalidateTag('inventory-dashboard', 'default');
  revalidatePath('/inventory/dashboard');
}

/**
 * Revalidate analytics caches
 */
export function revalidateAnalyticsCaches(): void {
  revalidateTag('inventory-analytics', 'default');
  revalidatePath('/inventory/analytics');
}

/**
 * Revalidate report caches
 */
export function revalidateReportCaches(): void {
  revalidateTag('inventory-reports', 'default');
  revalidatePath('/inventory/reports');
}
