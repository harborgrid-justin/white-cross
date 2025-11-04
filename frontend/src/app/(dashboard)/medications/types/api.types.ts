import { z } from 'zod';
import type {
  Medication,
  MedicationType,
  MedicationStatus,
  AdministrationRoute,
  MedicationFrequency,
  MedicationInventory,
} from './core.types';

/**
 * Date range filter
 */
export interface DateRangeFilter {
  /** Start date of the range (inclusive) */
  startDate: Date;
  /** End date of the range (inclusive) */
  endDate: Date;
}

/**
 * Medication filtering options
 *
 * @description Comprehensive filter set for medication queries
 */
export interface MedicationFilters {
  /** Filter by specific student */
  studentId?: string;
  /** Filter by medication types */
  type?: MedicationType[];
  /** Filter by medication status */
  status?: MedicationStatus[];
  /** Filter by administration routes */
  administrationRoute?: AdministrationRoute[];
  /** Filter by frequencies */
  frequency?: MedicationFrequency[];
  /** Filter by prescriber */
  prescriberId?: string;
  /** Filter by date range */
  dateRange?: DateRangeFilter;
  /** Search query across name, generic name, brand name, notes */
  searchQuery?: string;
  /** Filter controlled substances only */
  isControlled?: boolean;
  /** Filter medications requiring refill */
  requiresRefill?: boolean;
  /** Filter medications with active alerts */
  hasAlerts?: boolean;
}

/**
 * Pagination metadata
 */
export interface PaginationInfo {
  /** Current page number (0-indexed) */
  page: number;
  /** Number of items per page */
  limit: number;
  /** Total number of pages */
  totalPages: number;
}

/**
 * Medication summary statistics
 *
 * @description Aggregated metrics for medication management dashboard
 */
export interface MedicationSummary {
  /** Total number of medication records */
  totalMedications: number;
  /** Number of active medications */
  activeMedications: number;
  /** Number of controlled substances */
  controlledSubstances: number;
  /** Number of medications expiring soon */
  expiringSoon: number;
  /** Number of medications requiring refill */
  requiresRefill: number;
  /** Number of active alerts */
  activeAlerts: number;
  /** Number of administrations today */
  administrationsToday: number;
  /** Breakdown of administrations by medication type */
  administrationsByType: Record<MedicationType, number>;
}

/**
 * Medication search result set
 *
 * @description Complete response object for medication search queries
 */
export interface MedicationSearchResult {
  /** Array of medications matching the search criteria */
  medications: Medication[];
  /** Total count of matching medications (across all pages) */
  totalCount: number;
  /** Pagination metadata */
  pagination: PaginationInfo;
  /** Summary statistics for the result set */
  summary: MedicationSummary;
}

/**
 * Zod validation schema for MedicationFilters
 */
export const MedicationFiltersSchema = z.object({
  studentId: z.string().uuid().optional(),
  type: z
    .array(
      z.enum(['prescription', 'over_the_counter', 'supplement', 'emergency', 'inhaler', 'epipen', 'insulin', 'controlled_substance'])
    )
    .optional(),
  status: z.array(z.enum(['active', 'discontinued', 'expired', 'on_hold', 'completed', 'cancelled'])).optional(),
  administrationRoute: z
    .array(z.enum(['oral', 'injection', 'topical', 'inhaled', 'nasal', 'rectal', 'sublingual', 'transdermal']))
    .optional(),
  frequency: z
    .array(
      z.enum([
        'as_needed',
        'once_daily',
        'twice_daily',
        'three_times_daily',
        'four_times_daily',
        'every_4_hours',
        'every_6_hours',
        'every_8_hours',
        'every_12_hours',
        'weekly',
        'monthly',
        'custom',
      ])
    )
    .optional(),
  searchQuery: z.string().optional(),
  isControlled: z.boolean().optional(),
});

/**
 * Query utilities for filtering and searching medications
 */
export const queryUtils = {
  /**
   * Check if medication matches search query
   *
   * @param medication - Medication to check
   * @param query - Search query string
   * @returns True if medication matches the query
   */
  matchesSearchQuery: (medication: Medication, query: string): boolean => {
    if (!query) return true;

    const searchText = query.toLowerCase();
    return Boolean(
      medication.name.toLowerCase().includes(searchText) ||
        (medication.genericName && medication.genericName.toLowerCase().includes(searchText)) ||
        (medication.brandName && medication.brandName.toLowerCase().includes(searchText)) ||
        medication.type.toLowerCase().includes(searchText) ||
        medication.status.toLowerCase().includes(searchText) ||
        (medication.notes && medication.notes.toLowerCase().includes(searchText))
    );
  },

  /**
   * Apply filter criteria to medication array
   *
   * @param medications - Array of medications to filter
   * @param filters - Filter criteria
   * @returns Filtered array of medications
   */
  applyFilters: (medications: Medication[], filters: MedicationFilters): Medication[] => {
    return medications.filter(medication => {
      // Student filter
      if (filters.studentId && medication.studentId !== filters.studentId) {
        return false;
      }

      // Type filter
      if (filters.type && filters.type.length > 0) {
        if (!filters.type.includes(medication.type)) {
          return false;
        }
      }

      // Status filter
      if (filters.status && filters.status.length > 0) {
        if (!filters.status.includes(medication.status)) {
          return false;
        }
      }

      // Administration route filter
      if (filters.administrationRoute && filters.administrationRoute.length > 0) {
        if (!filters.administrationRoute.includes(medication.administrationRoute)) {
          return false;
        }
      }

      // Frequency filter
      if (filters.frequency && filters.frequency.length > 0) {
        if (!filters.frequency.includes(medication.frequency)) {
          return false;
        }
      }

      // Controlled substance filter
      if (filters.isControlled !== undefined && medication.isControlled !== filters.isControlled) {
        return false;
      }

      // Date range filter
      if (filters.dateRange) {
        const medicationDate = new Date(medication.startDate);
        if (medicationDate < filters.dateRange.startDate || medicationDate > filters.dateRange.endDate) {
          return false;
        }
      }

      // Search query
      if (filters.searchQuery && !queryUtils.matchesSearchQuery(medication, filters.searchQuery)) {
        return false;
      }

      return true;
    });
  },

  /**
   * Calculate summary statistics for medications
   *
   * @param medications - Array of medications
   * @param inventories - Optional map of medication ID to inventory
   * @param administrationsToday - Number of administrations today
   * @returns Summary statistics object
   */
  calculateSummary: (
    medications: Medication[],
    inventories?: Map<string, MedicationInventory>,
    administrationsToday: number = 0
  ): MedicationSummary => {
    const active = medications.filter(m => m.status === 'active');
    const controlled = medications.filter(m => m.isControlled);

    // Check for expiring soon (within 7 days)
    const expiringSoon = medications.filter(m => {
      if (!m.endDate) return false;
      const daysUntilExpiration = Math.ceil((m.endDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
      return daysUntilExpiration <= 7 && daysUntilExpiration > 0;
    });

    // Check for refills needed
    let requiresRefill = 0;
    if (inventories) {
      requiresRefill = medications.filter(m => {
        const inventory = inventories.get(m.id);
        return inventory ? inventory.quantityInStock <= inventory.minimumQuantity : false;
      }).length;
    }

    // Count medications by type
    const administrationsByType = medications.reduce(
      (acc, med) => {
        acc[med.type] = (acc[med.type] || 0) + 1;
        return acc;
      },
      {} as Record<MedicationType, number>
    );

    return {
      totalMedications: medications.length,
      activeMedications: active.length,
      controlledSubstances: controlled.length,
      expiringSoon: expiringSoon.length,
      requiresRefill,
      activeAlerts: 0, // Would need alerts data to calculate
      administrationsToday,
      administrationsByType,
    };
  },
};
