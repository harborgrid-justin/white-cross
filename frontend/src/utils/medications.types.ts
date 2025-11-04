/**
 * WF-COMP-344 | medications.types.ts - Type definitions for medication utilities
 * Purpose: Central type definitions for medication utility functions
 * Upstream: @/types/api, @/constants/medications | Dependencies: API types
 * Downstream: All medication utility modules | Called by: Utility functions
 * Related: medications.formatting, medications.status, medications.inventory, medications.operations
 * Exports: Type definitions and interfaces | Key Features: Type safety
 * Last Updated: 2025-11-04 | File Type: .ts
 * Critical Path: Type checking → Compilation → Runtime
 * LLM Context: Type definitions module, part of medications utility refactoring
 */

// Re-export types from API
export type {
  Medication,
  MedicationReminder,
  Priority
} from '@/types/api';

/**
 * Expiration status information
 */
export interface ExpirationStatus {
  status: 'expired' | 'critical' | 'warning' | 'notice' | 'good';
  daysUntil: number;
  color: string;
  message: string;
}

/**
 * Stock level status information
 */
export interface StockStatus {
  status: 'out-of-stock' | 'critical' | 'low' | 'good';
  color: string;
  message: string;
}

/**
 * Parsed medication strength information
 */
export interface StrengthInfo {
  value: number;
  unit: string;
  formatted: string;
}

/**
 * Total inventory information for a medication
 */
export interface InventoryInfo {
  totalQuantity: number;
  totalBatches: number;
  nearExpiry: number;
  expired: number;
  lowStock: number;
}

/**
 * Medication statistics aggregation
 */
export interface MedicationStats {
  totalMedications: number;
  controlledMedications: number;
  totalInventoryItems: number;
  lowStockItems: number;
  expiredItems: number;
  nearExpiryItems: number;
  percentageControlled: number;
}

/**
 * Filter options for medication search
 */
export interface MedicationFilters {
  dosageForm?: string;
  isControlled?: boolean;
  hasLowStock?: boolean;
  hasExpiredItems?: boolean;
}
