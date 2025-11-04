/**
 * WF-COMP-344 | medications.ts - Barrel export for medication utilities
 * Purpose: Central export point for all medication utility functions and types
 * Upstream: All medications.* modules | Dependencies: Medication utility modules
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: medications.types, medications.formatting, medications.status, medications.inventory, medications.operations
 * Exports: All medication utilities | Key Features: Backward compatibility
 * Last Updated: 2025-11-04 | File Type: .ts
 * Critical Path: Import → Module resolution → Function execution
 * LLM Context: Barrel export maintaining backward compatibility for refactored medications utilities
 */

// Re-export all types
export type {
  Medication,
  MedicationReminder,
  Priority,
  ExpirationStatus,
  StockStatus,
  StrengthInfo,
  InventoryInfo,
  MedicationStats,
  MedicationFilters
} from './medications.types';

// Re-export formatting utilities
export {
  formatDate,
  parseAndFormatStrength,
  getMedicationDisplayName,
  formatMedicationForDisplay
} from './medications.formatting';

// Re-export status utilities
export {
  getDaysUntilExpiration,
  getExpirationStatus,
  getStockStatus,
  getSeverityColor,
  getMedicationStatusColor,
  getInventoryStatusColor
} from './medications.status';

// Re-export inventory utilities
export {
  calculateTotalInventory
} from './medications.inventory';

// Re-export operations utilities
export {
  getNextReminderTime,
  filterMedications,
  getMedicationStats,
  validateMedicationData
} from './medications.operations';
