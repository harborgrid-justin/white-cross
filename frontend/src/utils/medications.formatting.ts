/**
 * WF-COMP-344 | medications.formatting.ts - Formatting utilities for medications
 * Purpose: Date, display name, and strength formatting utilities
 * Upstream: @/constants/medications, medications.types | Dependencies: Constants, types
 * Downstream: Components, pages | Called by: Display components
 * Related: medications.status, medications.inventory
 * Exports: Formatting functions | Key Features: Date formatting, display helpers
 * Last Updated: 2025-11-04 | File Type: .ts
 * Critical Path: Data formatting → Display rendering
 * LLM Context: Formatting utilities module, part of medications utility refactoring
 */

import { DATE_FORMATS } from '@/constants/medications';
import type { Medication, StrengthInfo } from './medications.types';

/**
 * Date formatting utilities
 */
export const formatDate = (date: string | Date, format: keyof typeof DATE_FORMATS = 'display'): string => {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date

    if (isNaN(dateObj.getTime())) {
      return 'Invalid Date'
    }

    switch (format) {
      case 'display':
        return dateObj.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: '2-digit'
        })
      case 'input':
        return dateObj.toISOString().split('T')[0]
      case 'datetime':
        return dateObj.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        })
      case 'time':
        return dateObj.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit'
        })
      default:
        return dateObj.toLocaleDateString()
    }
  } catch (error) {
    console.error('Date formatting error:', error)
    return 'Invalid Date'
  }
}

/**
 * Calculate medication strength in a standard format
 */
export const parseAndFormatStrength = (strength: string): StrengthInfo => {
  try {
    // Extract numeric value and unit from strength string
    const match = strength.match(/^(\d+(?:\.\d+)?)\s*(.+)$/)

    if (!match) {
      return {
        value: 0,
        unit: '',
        formatted: strength
      }
    }

    const value = parseFloat(match[1])
    const unit = match[2].trim()

    return {
      value,
      unit,
      formatted: `${value} ${unit}`
    }
  } catch (error) {
    console.error('Strength parsing error:', error)
    return {
      value: 0,
      unit: '',
      formatted: strength
    }
  }
}

/**
 * Generate medication display name
 */
export const getMedicationDisplayName = (medication: Medication): string => {
  if (medication.genericName && medication.genericName !== medication.name) {
    return `${medication.name} (${medication.genericName})`
  }
  return medication.name
}

/**
 * Format medication for display in lists/tables
 */
export const formatMedicationForDisplay = (medication: Medication) => {
  // Import here to avoid circular dependency
  const { calculateTotalInventory } = require('./medications.inventory');
  const { getStockStatus } = require('./medications.status');

  const inventory = calculateTotalInventory(medication)
  const displayName = getMedicationDisplayName(medication)

  return {
    ...medication,
    displayName,
    // Add display-specific properties without modifying the original type
    _display: {
      inventory: {
        ...inventory,
        status: getStockStatus(inventory.totalQuantity)
      }
    }
  }
}
