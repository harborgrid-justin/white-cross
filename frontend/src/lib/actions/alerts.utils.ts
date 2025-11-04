/**
 * @fileoverview Utility functions for inventory alerts
 * @module app/alerts/utils
 *
 * Provides helper functions for alert operations, data formatting,
 * and common transformations.
 */

/**
 * Convert filter object to URL search parameters
 */
export function filterToParams(
  filter: Record<string, unknown>
): Record<string, string | number | boolean> {
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

  return params;
}

/**
 * Validate location ID format
 */
export function isValidLocationId(locationId: string): boolean {
  return locationId.length > 0 && /^[a-zA-Z0-9-_]+$/.test(locationId);
}

/**
 * Validate alert ID format
 */
export function isValidAlertId(alertId: string): boolean {
  return alertId.length > 0 && /^[a-zA-Z0-9-_]+$/.test(alertId);
}

/**
 * Format days ahead for expiration alerts
 */
export function formatDaysAhead(days: number): string {
  if (days <= 0) return 'Expired';
  if (days === 1) return '1 day';
  if (days < 7) return `${days} days`;
  if (days < 30) {
    const weeks = Math.floor(days / 7);
    return weeks === 1 ? '1 week' : `${weeks} weeks`;
  }
  const months = Math.floor(days / 30);
  return months === 1 ? '1 month' : `${months} months`;
}

/**
 * Get alert severity based on days until expiration
 */
export function getExpirationSeverity(daysUntilExpiration: number): 'critical' | 'warning' | 'info' {
  if (daysUntilExpiration <= 0) return 'critical';
  if (daysUntilExpiration <= 30) return 'critical';
  if (daysUntilExpiration <= 90) return 'warning';
  return 'info';
}

/**
 * Get alert severity based on stock level percentage
 */
export function getStockLevelSeverity(
  currentStock: number,
  minStock: number,
  reorderPoint: number
): 'critical' | 'warning' | 'info' {
  if (currentStock <= minStock) return 'critical';
  if (currentStock <= reorderPoint) return 'warning';
  return 'info';
}

/**
 * Format stock level percentage
 */
export function formatStockPercentage(current: number, max: number): string {
  if (max === 0) return '0%';
  const percentage = (current / max) * 100;
  return `${Math.round(percentage)}%`;
}

/**
 * Calculate reorder quantity based on min/max levels
 */
export function calculateReorderQuantity(
  currentStock: number,
  minStock: number,
  maxStock: number,
  reorderPoint: number
): number {
  if (currentStock <= reorderPoint) {
    return Math.max(0, maxStock - currentStock);
  }
  return 0;
}
