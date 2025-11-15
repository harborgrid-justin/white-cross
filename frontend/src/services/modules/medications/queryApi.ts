/**
 * @fileoverview Medication Query and Search API
 *
 * @deprecated This API is deprecated. Migrate to @/lib/actions/medications.cache
 *
 * MIGRATION GUIDE:
 * ```typescript
 * // Before: Search medications
 * import { MedicationQueryApi } from '@/services/modules/medications/queryApi';
 * const queryApi = new MedicationQueryApi(client, getAll, getById);
 * const results = await queryApi.search('aspirin', 10);
 *
 * // After: Use cached server action
 * import { getMedications } from '@/lib/actions/medications.cache';
 * const results = await getMedications({ search: 'aspirin', limit: 10 });
 *
 * // Before: Get medications by category
 * const medications = await queryApi.getByCategory('analgesic', 20);
 *
 * // After: Use cached server action
 * import { getMedications } from '@/lib/actions/medications.cache';
 * const medications = await getMedications({ category: 'analgesic', limit: 20 });
 *
 * // Before: Get controlled substances
 * const controlled = await queryApi.getControlledSubstances('II');
 *
 * // After: Use cached server action
 * import { getMedications } from '@/lib/actions/medications.cache';
 * const controlled = await getMedications({
 *   controlledSubstance: true,
 *   // DEA schedule filtering pending implementation
 * });
 *
 * // Before: Check availability
 * const { available, medication } = await queryApi.checkAvailability('id');
 *
 * // After: Use cached server action
 * import { getMedicationById } from '@/lib/actions/medications.cache';
 * const medication = await getMedicationById('id');
 * const available = medication?.isActive ?? false;
 * ```
 *
 * BENEFITS OF SERVER ACTIONS:
 * ✓ Server-side caching with Next.js (faster search)
 * ✓ Automatic HIPAA audit logging for controlled substance access
 * ✓ Type-safe with Zod validation
 * ✓ Unified query interface
 * ✓ Better error handling
 *
 * Handles medication search, filtering, and query operations including
 * full-text search, category filtering, controlled substance queries,
 * and availability checking.
 *
 * **Key Features:**
 * - Full-text search across medication names and NDC codes
 * - Category-based filtering
 * - Controlled substance tracking with DEA compliance
 * - Availability verification
 * - Optimized for autocomplete and quick lookup
 *
 * @module services/modules/medications/queryApi
 */

import type { ApiClient } from '../../core/ApiClient';
import { createApiError } from '../../core/errors';
import { auditService, AuditAction, AuditResourceType, AuditStatus } from '../../audit';
import type { Medication, MedicationFilters, MedicationsResponse } from './types';

/**
 * Medication Query API Service
 *
 * Provides search and query operations for medication lookup
 * and filtering with comprehensive audit logging.
 */
export class MedicationQueryApi {
  constructor(
    private client: ApiClient,
    private getAll: (filters?: MedicationFilters) => Promise<MedicationsResponse>,
    private getById: (id: string) => Promise<Medication>
  ) {}

  /**
   * Search medications by text query
   *
   * Performs full-text search across medication names, generic names, and NDC codes.
   * Optimized for quick medication lookup and autocomplete functionality.
   *
   * @param {string} query - Search query
   * @param {number} [limit=10] - Maximum results to return
   * @returns {Promise<Medication[]>} Matching medications
   * @throws {ApiError} If search fails
   *
   * @example
   * ```typescript
   * const results = await queryApi.search('aspirin', 5);
   * console.log(`Found ${results.length} medications`);
   * ```
   */
  async search(query: string, limit: number = 10): Promise<Medication[]> {
    try {
      if (!query || query.trim().length < 2) {
        throw new Error('Search query must be at least 2 characters');
      }

      const response = await this.getAll({
        search: query.trim(),
        limit: Math.min(limit, 50),
        isActive: true,
      });

      return response.medications;
    } catch (error) {
      throw createApiError(error, 'Failed to search medications');
    }
  }

  /**
   * Get medications by category
   *
   * Retrieves medications filtered by therapeutic category.
   *
   * @param {string} category - Medication category
   * @param {number} [limit=20] - Maximum results to return
   * @returns {Promise<Medication[]>} Medications in category
   * @throws {ApiError} If request fails
   */
  async getByCategory(category: string, limit: number = 20): Promise<Medication[]> {
    try {
      if (!category) throw new Error('Category is required');

      const response = await this.getAll({
        category: category.trim(),
        limit: Math.min(limit, 100),
        isActive: true,
      });

      return response.medications;
    } catch (error) {
      throw createApiError(error, 'Failed to get medications by category');
    }
  }

  /**
   * Get controlled substances
   *
   * Retrieves all DEA-scheduled controlled substances with enhanced tracking.
   *
   * @param {string} [schedule] - Specific DEA schedule to filter by
   * @returns {Promise<Medication[]>} Controlled substances
   * @throws {ApiError} If request fails
   */
  async getControlledSubstances(schedule?: string): Promise<Medication[]> {
    try {
      const filters: MedicationFilters = {
        controlledSubstance: true,
        isActive: true,
        limit: 100,
      };

      const response = await this.getAll(filters);
      let medications = response.medications;

      if (schedule) {
        medications = medications.filter(med => med.deaSchedule === schedule);
      }

      await auditService.log({
        action: AuditAction.VIEW_CONTROLLED_SUBSTANCES,
        resourceType: AuditResourceType.MEDICATION,
        status: AuditStatus.SUCCESS,
        metadata: {
          scheduleFilter: schedule || 'all_schedules',
          resultCount: medications.length,
        },
      });

      return medications;
    } catch (error) {
      await auditService.log({
        action: AuditAction.VIEW_CONTROLLED_SUBSTANCES,
        resourceType: AuditResourceType.MEDICATION,
        status: AuditStatus.FAILURE,
        context: { error: error instanceof Error ? error.message : String(error) },
      });
      throw createApiError(error, 'Failed to get controlled substances');
    }
  }

  /**
   * Check medication availability
   *
   * Verifies if a medication is available and active in the formulary.
   *
   * @param {string} id - Medication UUID
   * @returns {Promise<{available: boolean, medication?: Medication}>} Availability status
   * @throws {ApiError} If request fails
   */
  async checkAvailability(id: string): Promise<{ available: boolean; medication?: Medication }> {
    try {
      if (!id) throw new Error('Medication ID is required');

      const medication = await this.getById(id);
      const available = Boolean(medication && medication.isActive !== false);

      return {
        available,
        medication: available ? medication : undefined,
      };
    } catch (error) {
      if (error.message?.includes('not found') || error.status === 404) {
        return { available: false };
      }
      throw createApiError(error, 'Failed to check medication availability');
    }
  }
}

/**
 * Factory function for creating MedicationQueryApi instances
 *
 * @param {ApiClient} client - Configured ApiClient instance
 * @param {Function} getAll - Reference to getAll method
 * @param {Function} getById - Reference to getById method
 * @returns {MedicationQueryApi} New instance
 */
export function createMedicationQueryApi(
  client: ApiClient,
  getAll: (filters?: MedicationFilters) => Promise<MedicationsResponse>,
  getById: (id: string) => Promise<Medication>
): MedicationQueryApi {
  return new MedicationQueryApi(client, getAll, getById);
}
