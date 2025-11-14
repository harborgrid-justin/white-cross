/**
 * @fileoverview Medication Inventory API
 *
 * Handles medication inventory management including stock tracking, batch
 * management, expiration monitoring, and reorder alerts.
 *
 * **Key Features:**
 * - Real-time inventory tracking
 * - Batch and expiration date management
 * - Low stock and expiration alerts
 * - Inventory adjustment with audit trails
 * - Controlled substance tracking
 *
 * @module services/modules/medications/inventoryApi
 */

import type { ApiClient } from '../../core/ApiClient';
import { API_ENDPOINTS } from '../../../constants/api';
import { ApiResponse } from '../../utils/apiUtils';
import { createApiError } from '../../core/errors';
import type {
  InventoryItem,
  InventoryResponse,
  CreateInventoryRequest,
  UpdateInventoryRequest
} from './types';
import { addToInventorySchema, updateInventorySchema } from './schemas';

/**
 * Medication Inventory API Service
 *
 * Provides comprehensive inventory management operations including
 * stock tracking, batch management, and alert generation.
 */
export class MedicationInventoryApi {
  constructor(private client: ApiClient) {}

  /**
   * Get medication inventory with alerts
   *
   * Retrieves current inventory status including low stock alerts,
   * expiring medication warnings, and controlled substance tracking.
   *
   * **Cache Strategy**: 1-minute cache, invalidated on quantity changes
   *
   * @returns {Promise<InventoryResponse>} Inventory with alerts
   * @throws {ApiError} If request fails
   *
   * @example
   * ```typescript
   * const inventory = await inventoryApi.getInventory();
   * const lowStock = inventory.items.filter(item =>
   *   item.quantity <= item.reorderLevel
   * );
   * console.log(`${lowStock.length} medications need reordering`);
   * ```
   */
  async getInventory(): Promise<InventoryResponse> {
    try {
      const response = await this.client.get<ApiResponse<InventoryResponse>>(
        API_ENDPOINTS.MEDICATIONS.INVENTORY
      );

      return response.data.data;
    } catch (error) {
      throw createApiError(error, 'Failed to fetch inventory');
    }
  }

  /**
   * Add medication to inventory
   *
   * Records new inventory batch with expiration tracking and reorder levels.
   * Validates batch numbers and expiration dates.
   *
   * @param {CreateInventoryRequest} inventoryData - Inventory details
   * @returns {Promise<InventoryItem>} Created inventory item
   * @throws {ValidationError} If validation fails
   * @throws {ApiError} If creation fails
   *
   * @example
   * ```typescript
   * const item = await inventoryApi.addToInventory({
   *   medicationId: 'medication-uuid',
   *   batchNumber: 'LOT123456',
   *   expirationDate: '2026-12-31',
   *   quantity: 500,
   *   reorderLevel: 50,
   *   costPerUnit: 0.25,
   *   supplier: 'McKesson'
   * });
   * ```
   */
  async addToInventory(inventoryData: CreateInventoryRequest): Promise<InventoryItem> {
    try {
      // Validate inventory data
      addToInventorySchema.parse(inventoryData);

      const response = await this.client.post<ApiResponse<{ inventory: InventoryItem }>>(
        API_ENDPOINTS.MEDICATIONS.INVENTORY,
        inventoryData
      );

      return response.data.data.inventory;
    } catch (error) {
      if (error.name === 'ZodError') {
        throw new Error(`Validation error: ${error.errors[0].message}`);
      }
      throw createApiError(error, 'Failed to add to inventory');
    }
  }

  /**
   * Update inventory quantity
   *
   * Updates current inventory quantity with reason tracking for audit trail.
   * Generates alerts if quantity falls below reorder level.
   *
   * @param {string} id - Inventory item UUID
   * @param {UpdateInventoryRequest} updateData - Quantity and reason
   * @returns {Promise<InventoryItem>} Updated inventory item
   * @throws {ValidationError} If validation fails
   * @throws {ApiError} If update fails
   *
   * @example
   * ```typescript
   * const updated = await inventoryApi.updateInventoryQuantity(
   *   'inventory-id',
   *   { quantity: 250, reason: 'Monthly audit adjustment' }
   * );
   * ```
   */
  async updateInventoryQuantity(
    id: string,
    updateData: UpdateInventoryRequest
  ): Promise<InventoryItem> {
    try {
      if (!id) {
        throw new Error('Inventory ID is required');
      }

      // Validate update data
      updateInventorySchema.parse(updateData);

      const response = await this.client.put<ApiResponse<{ inventory: InventoryItem }>>(
        `${API_ENDPOINTS.MEDICATIONS.INVENTORY}/${id}`,
        updateData
      );

      return response.data.data.inventory;
    } catch (error) {
      if (error.name === 'ZodError') {
        throw new Error(`Validation error: ${error.errors[0].message}`);
      }
      throw createApiError(error, 'Failed to update inventory');
    }
  }

  /**
   * Alias for updateInventoryQuantity (backward compatibility)
   *
   * @deprecated Use updateInventoryQuantity() for clarity
   * @see {@link updateInventoryQuantity}
   */
  async updateInventory(
    id: string,
    updateData: UpdateInventoryRequest
  ): Promise<InventoryItem> {
    return this.updateInventoryQuantity(id, updateData);
  }
}

/**
 * Factory function for creating MedicationInventoryApi instances
 *
 * @param {ApiClient} client - Configured ApiClient instance
 * @returns {MedicationInventoryApi} New instance
 */
export function createMedicationInventoryApi(client: ApiClient): MedicationInventoryApi {
  return new MedicationInventoryApi(client);
}
