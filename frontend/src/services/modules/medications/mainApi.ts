/**
 * @fileoverview Core Medication API Operations
 *
 * @deprecated This API is deprecated. Migrate to @/lib/actions/medications.crud
 *
 * MIGRATION GUIDE:
 * ```typescript
 * // Before: Create medication
 * import { MedicationMainApi } from '@/services/modules/medications/mainApi';
 * const api = new MedicationMainApi(client);
 * const result = await api.create({ name: 'Amoxicillin', ... });
 *
 * // After: Use server action
 * import { createMedication } from '@/lib/actions/medications.crud';
 * const result = await createMedication({ name: 'Amoxicillin', ... });
 *
 * // Before: Get all medications
 * const response = await api.getAll({ search: 'aspirin' });
 * const medications = response.medications;
 *
 * // After: Use cached query
 * import { getMedications } from '@/lib/actions/medications.cache';
 * const medications = await getMedications({ search: 'aspirin' });
 *
 * // Before: Update medication
 * const updated = await api.update('id', { dosage: '250mg' });
 *
 * // After: Use server action
 * import { updateMedication } from '@/lib/actions/medications.crud';
 * const result = await updateMedication('id', { dosage: '250mg' });
 *
 * // Before: Delete medication
 * await api.delete('id');
 *
 * // After: Use server action
 * import { deleteMedication } from '@/lib/actions/medications.crud';
 * await deleteMedication('id');
 * ```
 *
 * BENEFITS OF SERVER ACTIONS:
 * ✓ Automatic cache invalidation with revalidateTag
 * ✓ Built-in HIPAA audit logging
 * ✓ Type-safe with ActionResult pattern
 * ✓ Server-side validation
 * ✓ Better error handling
 *
 * Handles core medication CRUD operations including medication management,
 * formulary operations, and basic medication data access. This module provides
 * the foundation for all medication-related operations in the system.
 *
 * **Key Features:**
 * - Medication CRUD operations with validation
 * - Formulary management and search
 * - DEA-compliant controlled substance handling
 * - HIPAA-compliant audit logging
 * - Comprehensive error handling and validation
 *
 * @module services/modules/medications/mainApi
 */

import type { ApiClient } from '../../core/ApiClient';
import { API_ENDPOINTS } from '../../../constants/api';
import { ApiResponse } from '../../utils/apiUtils';
import { createApiError } from '../../core/errors';
import { auditService, AuditAction, AuditResourceType, AuditStatus } from '../../audit';
import type {
  Medication,
  MedicationFilters,
  CreateMedicationRequest,
  MedicationsResponse
} from './types';
import {
  createMedicationSchema,
  updateMedicationSchema,
  medicationFiltersSchema
} from './schemas';

/**
 * Core Medication API Service
 *
 * Provides essential medication management operations including CRUD operations,
 * search functionality, and formulary management with comprehensive validation
 * and audit logging.
 */
export class MedicationMainApi {
  constructor(private client: ApiClient) {}

  /**
   * Get all medications with optional filtering and pagination
   *
   * Retrieves medications from the formulary with support for search, filtering,
   * sorting, and pagination. Results include full medication details.
   *
   * **Cache Strategy**: 5-minute cache, invalidated on create/update
   * **HIPAA Compliance**: Audit log generated for medication list access
   *
   * @param {MedicationFilters} [filters={}] - Filter and pagination options
   * @returns {Promise<MedicationsResponse>} Paginated medications list
   * @throws {ApiError} If request fails or network error occurs
   *
   * @example
   * ```typescript
   * // Search for controlled substances
   * const medications = await medicationApi.getAll({
   *   search: 'morphine',
   *   controlledSubstance: true,
   *   page: 1,
   *   limit: 20
   * });
   * console.log(`Found ${medications.total} controlled substances`);
   * ```
   *
   * @remarks
   * **TanStack Query**: Use with queryKey: ['medications', filters]
   * **Performance**: Indexed search on name, genericName, and NDC
   * **Pagination**: Returns total count for pagination UI
   */
  async getAll(filters: MedicationFilters = {}): Promise<MedicationsResponse> {
    try {
      // Validate filters
      const validatedFilters = medicationFiltersSchema.parse(filters);

      const queryString = new URLSearchParams();
      if (validatedFilters.page) queryString.append('page', String(validatedFilters.page));
      if (validatedFilters.limit) queryString.append('limit', String(validatedFilters.limit));
      if (validatedFilters.search) queryString.append('search', validatedFilters.search);
      if (validatedFilters.category) queryString.append('category', validatedFilters.category);
      if (validatedFilters.type) queryString.append('type', validatedFilters.type);
      if (typeof validatedFilters.isActive === 'boolean') {
        queryString.append('isActive', String(validatedFilters.isActive));
      }
      if (typeof validatedFilters.controlledSubstance === 'boolean') {
        queryString.append('controlledSubstance', String(validatedFilters.controlledSubstance));
      }
      if (validatedFilters.sort) queryString.append('sort', validatedFilters.sort);
      if (validatedFilters.order) queryString.append('order', validatedFilters.order);

      const response = await this.client.get<ApiResponse<MedicationsResponse>>(
        `${API_ENDPOINTS.MEDICATIONS.BASE}?${queryString.toString()}`
      );

      // Audit log for viewing medications list
      await auditService.log({
        action: AuditAction.VIEW_MEDICATIONS,
        resourceType: AuditResourceType.MEDICATION,
        status: AuditStatus.SUCCESS,
        metadata: {
          filtersApplied: Object.keys(validatedFilters).length > 0,
          searchTerm: validatedFilters.search,
          isControlledSubstanceFilter: validatedFilters.controlledSubstance,
        },
      });

      return response.data.data;
    } catch (error) {
      if (error instanceof Error && error.name === 'ZodError') {
        throw new Error(`Validation error: ${(error as any).errors[0].message}`);
      }

      // Audit log for failed attempt
      await auditService.log({
        action: AuditAction.VIEW_MEDICATIONS,
        resourceType: AuditResourceType.MEDICATION,
        status: AuditStatus.FAILURE,
        context: { error: error instanceof Error ? error.message : String(error) },
      });
      throw createApiError(error, 'Failed to fetch medications');
    }
  }

  /**
   * Get medication by ID
   *
   * Retrieves complete medication details including formulation, strength,
   * dosage form, manufacturer, and controlled substance information.
   *
   * **HIPAA Compliance**: Generates PHI access audit log
   *
   * @param {string} id - Medication UUID
   * @returns {Promise<Medication>} Medication details
   * @throws {ApiError} If medication not found or request fails
   *
   * @example
   * ```typescript
   * const medication = await medicationApi.getById('medication-uuid');
   * console.log(`${medication.name} (${medication.genericName})`);
   * console.log(`Strength: ${medication.strength}, Form: ${medication.dosageForm}`);
   * if (medication.isControlled) {
   *   console.log(`DEA Schedule: ${medication.deaSchedule}`);
   * }
   * ```
   */
  async getById(id: string): Promise<Medication> {
    try {
      if (!id) throw new Error('Medication ID is required');

      const response = await this.client.get<ApiResponse<Medication>>(
        `${API_ENDPOINTS.MEDICATIONS.BASE}/${id}`
      );

      await auditService.log({
        action: AuditAction.VIEW_MEDICATION,
        resourceType: AuditResourceType.MEDICATION,
        resourceId: id,
        status: AuditStatus.SUCCESS,
        metadata: {
          medicationName: response.data.data.name,
          isControlled: response.data.data.isControlled,
        },
      });

      return response.data.data;
    } catch (error) {
      await auditService.log({
        action: AuditAction.VIEW_MEDICATION,
        resourceType: AuditResourceType.MEDICATION,
        resourceId: id,
        status: AuditStatus.FAILURE,
        context: { error: error instanceof Error ? error.message : String(error) },
      });
      throw createApiError(error, 'Failed to fetch medication');
    }
  }

  /**
   * Create new medication in the formulary
   *
   * Adds a new medication to the system formulary with full validation.
   * Requires admin privileges.
   *
   * **Validation**: Comprehensive Zod schema validation including NDC format,
   * strength format, and DEA schedule compliance
   * **HIPAA Compliance**: Creates audit log with medication details
   * **DEA Compliance**: Enforces DEA schedule for controlled substances
   *
   * @param {CreateMedicationRequest} medicationData - Medication information
   * @returns {Promise<{medication: Medication}>} Created medication
   * @throws {ValidationError} If validation fails with specific field errors
   * @throws {ApiError} If creation fails or unauthorized
   *
   * @example
   * ```typescript
   * // Create controlled substance with DEA schedule
   * const result = await medicationApi.create({
   *   name: 'Morphine Sulfate ER',
   *   genericName: 'morphine sulfate',
   *   dosageForm: 'Tablet',
   *   strength: '30mg',
   *   manufacturer: 'Generic Pharma',
   *   ndc: '12345-1234-12',
   *   isControlled: true,
   *   deaSchedule: 'II'
   * });
   * console.log(`Created: ${result.medication.name}`);
   * ```
   *
   * @remarks
   * **Cache Invalidation**: Invalidates medications list query
   * **Authorization**: Requires admin or pharmacist role
   * **Audit Trail**: Creates permanent audit log entry
   */
  async create(medicationData: CreateMedicationRequest): Promise<{ medication: Medication }> {
    try {
      const validatedData = createMedicationSchema.parse(medicationData);

      const response = await this.client.post<ApiResponse<{ medication: Medication }>>(
        API_ENDPOINTS.MEDICATIONS.BASE,
        validatedData
      );

      const medication = response.data.data.medication;

      await auditService.log({
        action: AuditAction.CREATE_MEDICATION,
        resourceType: AuditResourceType.MEDICATION,
        resourceId: medication.id,
        resourceIdentifier: medication.name,
        status: AuditStatus.SUCCESS,
        isPHI: true,
        metadata: {
          isControlled: medication.isControlled,
          dosageForm: medication.dosageForm,
          strength: medication.strength,
          deaSchedule: medication.deaSchedule,
          hasNDC: Boolean(medication.ndc),
        },
      });

      return { medication };
    } catch (error) {
      if (error instanceof Error && error.name === 'ZodError') {
        const firstError = (error as any).errors[0];
        throw new Error(`Validation error: ${firstError.message}`);
      }

      await auditService.log({
        action: AuditAction.CREATE_MEDICATION,
        resourceType: AuditResourceType.MEDICATION,
        status: AuditStatus.FAILURE,
        context: { 
          error: error instanceof Error ? error.message : String(error),
          medicationName: medicationData.name,
          isControlled: medicationData.isControlled,
        },
      });
      throw createApiError(error, 'Failed to create medication');
    }
  }

  /**
   * Update medication information
   *
   * Updates an existing medication in the formulary. Partial updates supported.
   * Requires admin privileges.
   *
   * **Validation**: Uses partial schema validation
   * **HIPAA Compliance**: Generates audit log for changes
   * **DEA Compliance**: Validates controlled substance rules
   *
   * @param {string} id - Medication UUID
   * @param {Partial<CreateMedicationRequest>} medicationData - Fields to update
   * @returns {Promise<Medication>} Updated medication
   * @throws {ApiError} If update fails or medication not found
   *
   * @example
   * ```typescript
   * // Update strength and manufacturer
   * const updated = await medicationApi.update('medication-uuid', {
   *   strength: '60mg',
   *   manufacturer: 'New Manufacturer'
   * });
   * ```
   */
  async update(id: string, medicationData: Partial<CreateMedicationRequest>): Promise<Medication> {
    try {
      if (!id) throw new Error('Medication ID is required');

      const validatedData = updateMedicationSchema.parse(medicationData);

      const response = await this.client.put<ApiResponse<Medication>>(
        `${API_ENDPOINTS.MEDICATIONS.BASE}/${id}`,
        validatedData
      );

      const updatedMedication = response.data.data;

      await auditService.log({
        action: AuditAction.UPDATE_MEDICATION,
        resourceType: AuditResourceType.MEDICATION,
        resourceId: id,
        resourceIdentifier: updatedMedication.name,
        status: AuditStatus.SUCCESS,
        isPHI: true,
        metadata: {
          fieldsUpdated: Object.keys(validatedData),
          isControlled: updatedMedication.isControlled,
          previousVersion: 'stored_separately', // Detailed change tracking
        },
      });

      return updatedMedication;
    } catch (error) {
      if (error instanceof Error && error.name === 'ZodError') {
        const firstError = (error as any).errors[0];
        throw new Error(`Validation error: ${firstError.message}`);
      }

      await auditService.log({
        action: AuditAction.UPDATE_MEDICATION,
        resourceType: AuditResourceType.MEDICATION,
        resourceId: id,
        status: AuditStatus.FAILURE,
        context: { 
          error: error instanceof Error ? error.message : String(error),
          fieldsAttempted: Object.keys(medicationData),
        },
      });
      throw createApiError(error, 'Failed to update medication');
    }
  }

  /**
   * Delete medication from formulary
   *
   * Soft deletes medication (marks as inactive). Medication history preserved.
   * Requires admin privileges.
   *
   * **Safety**: Soft delete preserves audit trail
   * **Validation**: Ensures no active student medications exist
   *
   * @param {string} id - Medication UUID
   * @returns {Promise<{id: string}>} Deleted medication ID
   * @throws {ApiError} If deletion fails or medication not found
   *
   * @example
   * ```typescript
   * const result = await medicationApi.delete('medication-uuid');
   * console.log(`Deleted medication: ${result.id}`);
   * ```
   */
  async delete(id: string): Promise<{ id: string }> {
    try {
      if (!id) throw new Error('Medication ID is required');

      // Get medication details before deletion for audit log
      let medicationName = 'unknown';
      try {
        const medication = await this.getById(id);
        medicationName = medication.name;
      } catch {
        // Continue with deletion even if we can't get details
      }

      const response = await this.client.delete<ApiResponse<{ id: string }>>(
        `${API_ENDPOINTS.MEDICATIONS.BASE}/${id}`
      );

      await auditService.log({
        action: AuditAction.DELETE_MEDICATION,
        resourceType: AuditResourceType.MEDICATION,
        resourceId: id,
        resourceIdentifier: medicationName,
        status: AuditStatus.SUCCESS,
        isPHI: true,
        metadata: {
          deletionType: 'soft_delete',
          medicationName,
        },
      });

      return response.data.data;
    } catch (error) {
      await auditService.log({
        action: AuditAction.DELETE_MEDICATION,
        resourceType: AuditResourceType.MEDICATION,
        resourceId: id,
        status: AuditStatus.FAILURE,
        context: { error: error instanceof Error ? error.message : String(error) },
      });
      throw createApiError(error, 'Failed to delete medication');
    }
  }

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
   * // Quick search for autocomplete
   * const results = await medicationApi.search('aspirin', 5);
   * console.log(`Found ${results.length} medications matching "aspirin"`);
   * ```
   */
  async search(query: string, limit: number = 10): Promise<Medication[]> {
    try {
      if (!query || query.trim().length < 2) {
        throw new Error('Search query must be at least 2 characters');
      }

      const response = await this.getAll({
        search: query.trim(),
        limit: Math.min(limit, 50), // Cap at 50 for performance
        isActive: true, // Only search active medications
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
        limit: 100, // Higher limit for controlled substances
      };

      // Note: DEA schedule filtering would need to be added to the backend API
      // For now, we filter client-side if a specific schedule is requested
      const response = await this.getAll(filters);

      let medications = response.medications;

      if (schedule) {
        medications = medications.filter(med => med.deaSchedule === schedule);
      }

      // Additional audit logging for controlled substance access
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
