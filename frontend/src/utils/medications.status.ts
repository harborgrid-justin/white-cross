/**
 * WF-COMP-344 | medications.status.ts - Status calculation utilities for medications
 * Purpose: Expiration, stock, and status color calculation utilities
 * Upstream: @/constants/medications, medications.types | Dependencies: Constants, types
 * Downstream: Components, pages, inventory module | Called by: Display and inventory logic
 * Related: medications.inventory, medications.formatting
 * Exports: Status calculation functions | Key Features: Status determination, color coding
 * Last Updated: 2025-11-04 | File Type: .ts
 * Critical Path: Status calculation → Display rendering
 * LLM Context: Status utilities module, part of medications utility refactoring
 */

import {
  EXPIRATION_WARNINGS,
  STOCK_THRESHOLDS,
  SEVERITY_LEVELS,
  MEDICATION_STATUSES,
  INVENTORY_STATUSES
} from '@/constants/medications';

import type { Priority, ExpirationStatus, StockStatus } from './medications.types';

/**
 * Calculate days until expiration
 */
export const getDaysUntilExpiration = (expirationDate: string): number => {
  try {
    const expDate = new Date(expirationDate)
    const today = new Date()

    // Reset time to compare only dates
    today.setHours(0, 0, 0, 0)
    expDate.setHours(0, 0, 0, 0)

    const diffTime = expDate.getTime() - today.getTime()
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  } catch (error) {
    console.error('Date calculation error:', error)
    return -1
  }
}

/**
 * Get expiration status with color coding
 */
export const getExpirationStatus = (expirationDate: string): ExpirationStatus => {
  const daysUntil = getDaysUntilExpiration(expirationDate)

  if (daysUntil < 0) {
    return {
      status: 'expired',
      daysUntil: Math.abs(daysUntil),
      color: 'text-red-700 bg-red-100',
      message: `Expired ${Math.abs(daysUntil)} days ago`
    }
  }

  if (daysUntil <= EXPIRATION_WARNINGS.critical) {
    return {
      status: 'critical',
      daysUntil,
      color: 'text-red-600 bg-red-100',
      message: `Expires in ${daysUntil} days`
    }
  }

  if (daysUntil <= EXPIRATION_WARNINGS.warning) {
    return {
      status: 'warning',
      daysUntil,
      color: 'text-yellow-600 bg-yellow-100',
      message: `Expires in ${daysUntil} days`
    }
  }

  if (daysUntil <= EXPIRATION_WARNINGS.notice) {
    return {
      status: 'notice',
      daysUntil,
      color: 'text-blue-600 bg-blue-100',
      message: `Expires in ${daysUntil} days`
    }
  }

  return {
    status: 'good',
    daysUntil,
    color: 'text-green-600 bg-green-100',
    message: `Expires in ${daysUntil} days`
  }
}

/**
 * Get stock level status
 */
export const getStockStatus = (quantity: number, reorderLevel?: number): StockStatus => {
  if (quantity <= 0) {
    return {
      status: 'out-of-stock',
      color: 'text-red-600 bg-red-100',
      message: 'Out of stock'
    }
  }

  if (quantity <= STOCK_THRESHOLDS.critical) {
    return {
      status: 'critical',
      color: 'text-red-600 bg-red-100',
      message: 'Critical stock level'
    }
  }

  const threshold = reorderLevel || STOCK_THRESHOLDS.low
  if (quantity <= threshold) {
    return {
      status: 'low',
      color: 'text-yellow-600 bg-yellow-100',
      message: 'Low stock'
    }
  }

  return {
    status: 'good',
    color: 'text-green-600 bg-green-100',
    message: 'In stock'
  }
}

/**
 * Get severity level color
 *
 * @param {Priority} severity - The severity level priority
 * @returns {string} CSS classes for the severity color
 */
export const getSeverityColor = (severity: Priority): string => {
  const severityConfig = SEVERITY_LEVELS.find((level: { value: Priority; color: string }) => level.value === severity)
  return severityConfig?.color || 'text-gray-600 bg-gray-100'
}

/**
 * Get medication status color
 *
 * @param {string} status - The medication status value
 * @returns {string} CSS classes for the status color
 */
export const getMedicationStatusColor = (status: string): string => {
  const statusConfig = MEDICATION_STATUSES.find((s: { value: string; color: string }) => s.value === status)
  return statusConfig?.color || 'text-gray-600 bg-gray-100'
}

/**
 * Get inventory status color
 *
 * @param {string} status - The inventory status value
 * @returns {string} CSS classes for the inventory status color
 */
export const getInventoryStatusColor = (status: string): string => {
  const statusConfig = INVENTORY_STATUSES.find((s: { value: string; color: string }) => s.value === status)
  return statusConfig?.color || 'text-gray-600 bg-gray-100'
}
