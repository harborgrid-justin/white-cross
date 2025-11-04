/**
 * WF-COMP-344 | medications.operations.ts - Operations for medications
 * Purpose: Search, filter, statistics, validation, and reminder operations
 * Upstream: medications.types, medications.inventory | Dependencies: Types, inventory
 * Downstream: Components, pages | Called by: Search, filter, and validation logic
 * Related: medications.inventory, medications.status
 * Exports: Operation functions | Key Features: Search, filter, stats, validation
 * Last Updated: 2025-11-04 | File Type: .ts
 * Critical Path: Operations → Display and business logic
 * LLM Context: Operations utilities module, part of medications utility refactoring
 */

import type {
  Medication,
  MedicationReminder,
  MedicationFilters,
  MedicationStats
} from './medications.types';
import { calculateTotalInventory } from './medications.inventory';

/**
 * Calculate next reminder time
 */
export const getNextReminderTime = (reminders: MedicationReminder[]): Date | null => {
  if (!reminders || reminders.length === 0) {
    return null
  }

  const pendingReminders = reminders
    .filter(reminder => reminder.status === 'PENDING')
    .map(reminder => new Date(reminder.scheduledTime))
    .sort((a, b) => a.getTime() - b.getTime())

  return pendingReminders[0] || null
}

/**
 * Search and filter medications
 */
export const filterMedications = (
  medications: Medication[],
  searchTerm: string,
  filters?: MedicationFilters
): Medication[] => {
  let filtered = medications

  // Text search
  if (searchTerm.trim()) {
    const term = searchTerm.toLowerCase()
    filtered = filtered.filter(med =>
      med.name.toLowerCase().includes(term) ||
      med.genericName?.toLowerCase().includes(term) ||
      med.manufacturer?.toLowerCase().includes(term)
    )
  }

  // Apply filters
  if (filters) {
    if (filters.dosageForm) {
      filtered = filtered.filter(med => med.dosageForm === filters.dosageForm)
    }

    if (filters.isControlled !== undefined) {
      filtered = filtered.filter(med => med.isControlled === filters.isControlled)
    }

    if (filters.hasLowStock) {
      filtered = filtered.filter(med => {
        const inventory = calculateTotalInventory(med)
        return inventory.lowStock > 0
      })
    }

    if (filters.hasExpiredItems) {
      filtered = filtered.filter(med => {
        const inventory = calculateTotalInventory(med)
        return inventory.expired > 0 || inventory.nearExpiry > 0
      })
    }
  }

  return filtered
}

/**
 * Generate medication summary statistics
 */
export const getMedicationStats = (medications: Medication[]): MedicationStats => {
  const totalMedications = medications.length
  const controlledMedications = medications.filter(med => med.isControlled).length

  let totalInventoryItems = 0
  let lowStockItems = 0
  let expiredItems = 0
  let nearExpiryItems = 0

  medications.forEach(med => {
    const inventory = calculateTotalInventory(med)
    totalInventoryItems += inventory.totalBatches
    lowStockItems += inventory.lowStock
    expiredItems += inventory.expired
    nearExpiryItems += inventory.nearExpiry
  })

  return {
    totalMedications,
    controlledMedications,
    totalInventoryItems,
    lowStockItems,
    expiredItems,
    nearExpiryItems,
    percentageControlled: totalMedications > 0 ? Math.round((controlledMedications / totalMedications) * 100) : 0
  }
}

/**
 * Validate medication data
 */
export const validateMedicationData = (data: Partial<Medication>): string[] => {
  const errors: string[] = []

  if (!data.name?.trim()) {
    errors.push('Medication name is required')
  }

  if (!data.dosageForm) {
    errors.push('Dosage form is required')
  }

  if (!data.strength?.trim()) {
    errors.push('Strength is required')
  }

  return errors
}
