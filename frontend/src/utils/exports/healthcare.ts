/**
 * @fileoverview Healthcare Utilities Barrel Export
 * @module utils/exports/healthcare
 * @category Utils
 *
 * Healthcare-specific utilities for medication and health records management.
 * Provides formatting, status tracking, and data validation for healthcare operations.
 *
 * @example
 * ```typescript
 * import { formatMedicationForDisplay, getMedicationStatusColor } from '@/utils';
 * import { calculateBMI, getSeverityColor } from '@/utils';
 * ```
 */

// ============================================================================
// MEDICATION UTILITIES
// ============================================================================

/**
 * Medication Management Utilities
 * Comprehensive utilities for medication data formatting, status tracking,
 * inventory management, and operations.
 */
export type {
  Medication,
  MedicationReminder,
  Priority,
  ExpirationStatus,
  StockStatus,
  StrengthInfo,
  InventoryInfo,
  MedicationStats,
  MedicationFilters,
} from '../medications.types';

export {
  // Formatting
  formatDate as formatMedicationDate,
  parseAndFormatStrength,
  getMedicationDisplayName,
  formatMedicationForDisplay,

  // Status
  getDaysUntilExpiration,
  getExpirationStatus,
  getStockStatus,
  getSeverityColor as getMedicationSeverityColor,
  getMedicationStatusColor,
  getInventoryStatusColor,

  // Inventory
  calculateTotalInventory,

  // Operations
  getNextReminderTime,
  filterMedications,
  getMedicationStats,
  validateMedicationData,
} from '../medications';

// ============================================================================
// HEALTH RECORDS UTILITIES
// ============================================================================

/**
 * Health Records Utilities
 * Utilities for formatting and displaying health record data including
 * conditions, allergies, vaccinations, and medical history.
 */
export {
  formatDate as formatHealthRecordDate,
  formatShortDate,
  getSeverityColor as getAllergySeverityColor,
  getConditionSeverityColor,
  getStatusColor as getConditionStatusColor,
  getVaccinationStatusColor,
  getPriorityColor,
  calculateBMI,
  sortVaccinations,
  filterVaccinations,
  generateId as generateHealthRecordId,
  validateRequired,
  validateDateRange,
  validateNumericRange,
  debounce as healthRecordDebounce,
} from '../healthRecords';
