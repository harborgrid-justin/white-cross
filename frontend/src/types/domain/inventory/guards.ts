/**
 * WF-COMP-328 | guards.ts - Inventory type guards and utility functions
 * Purpose: Type guard functions and utilities for inventory management
 * Upstream: None | Dependencies: core-entities
 * Downstream: Components, services | Called by: Business logic
 * Related: core-entities, alerts, stock
 * Exports: Type guard functions (isLowStock, isOutOfStock, etc.)
 * Last Updated: 2025-11-12 | File Type: .ts
 * Critical Path: Data validation → Business logic → UI state
 * LLM Context: Type guards and utility functions for inventory management
 */

import type { InventoryItem, MaintenanceLog } from './core-entities';

/**
 * Check if an inventory item is low in stock
 * @param item - The inventory item to check
 * @returns true if current stock is at or below reorder level
 */
export function isLowStock(item: InventoryItem): boolean {
  return (item.currentStock ?? 0) <= item.reorderLevel;
}

/**
 * Check if an inventory item is out of stock
 * @param item - The inventory item to check
 * @returns true if current stock is zero
 */
export function isOutOfStock(item: InventoryItem): boolean {
  return (item.currentStock ?? 0) === 0;
}

/**
 * Check if maintenance is due
 * @param log - The maintenance log to check
 * @returns true if next maintenance date is today or in the past
 */
export function isMaintenanceDue(log: MaintenanceLog): boolean {
  if (!log.nextMaintenanceDate) return false;
  return new Date(log.nextMaintenanceDate) <= new Date();
}

/**
 * Check if an item is expiring soon (within 30 days)
 * @param item - The inventory item to check
 * @returns true if earliest expiration is within 30 days
 */
export function isExpiringSoon(item: InventoryItem): boolean {
  if (!item.earliestExpiration) return false;
  const expirationDate = new Date(item.earliestExpiration);
  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
  return expirationDate <= thirtyDaysFromNow;
}

/**
 * Check if an item has expired
 * @param item - The inventory item to check
 * @returns true if earliest expiration date has passed
 */
export function isExpired(item: InventoryItem): boolean {
  if (!item.earliestExpiration) return false;
  return new Date(item.earliestExpiration) < new Date();
}
