/**
 * Inventory Items Operations for Inventory Management API
 *
 * Handles CRUD operations for inventory items including search, filtering,
 * and basic item management functionality.
 *
 * @module services/modules/inventoryApi/inventory
 */

import type { ApiClient } from '../../core/ApiClient';
import type { ApiResponse, PaginatedResponse } from '../../types';
import type {
  InventoryItem,
  InventoryFilters,
  CreateInventoryItemRequest,
  UpdateInventoryItemRequest,
} from './types';
import { createInventoryItemSchema } from './validation';
import { createApiError, createValidationError } from '../../core/errors';
import { API_ENDPOINTS } from '@/constants/api';
import { z } from 'zod';

/**
 * Inventory Items API Operations
 */
export class InventoryItemsApi {
  private readonly baseEndpoint = API_ENDPOINTS.INVENTORY.BASE;

  constructor(private readonly client: ApiClient) {}

  /**
   * Get all inventory items with filtering and pagination
   */
  async getInventoryItems(filters: InventoryFilters = {}): Promise<PaginatedResponse<InventoryItem>> {
    try {
      const params = new URLSearchParams();

      if (filters.page) params.append('page', String(filters.page));
      if (filters.limit) params.append('limit', String(filters.limit));
      if (filters.category) params.append('category', filters.category);
      if (filters.supplier) params.append('supplier', filters.supplier);
      if (filters.location) params.append('location', filters.location);
      if (filters.lowStock !== undefined) params.append('lowStock', String(filters.lowStock));
      if (filters.needsMaintenance !== undefined) params.append('needsMaintenance', String(filters.needsMaintenance));
      if (filters.isActive !== undefined) params.append('isActive', String(filters.isActive));
      if (filters.search) params.append('search', filters.search);

      const response = await this.client.get<ApiResponse<PaginatedResponse<InventoryItem>>>(
        `${this.baseEndpoint}?${params.toString()}`
      );

      return response.data.data!;
    } catch (error) {
      throw createApiError(error, 'Failed to fetch inventory items');
    }
  }

  /**
   * Get single inventory item by ID
   */
  async getInventoryItem(id: string): Promise<InventoryItem> {
    try {
      if (!id) throw new Error('Inventory item ID is required');

      const response = await this.client.get<ApiResponse<InventoryItem>>(
        `${this.baseEndpoint}/${id}`
      );

      return response.data.data!;
    } catch (error) {
      throw createApiError(error, 'Failed to fetch inventory item');
    }
  }

  /**
   * Create new inventory item
   */
  async createInventoryItem(data: CreateInventoryItemRequest): Promise<InventoryItem> {
    try {
      createInventoryItemSchema.parse(data);

      const response = await this.client.post<ApiResponse<InventoryItem>>(
        this.baseEndpoint,
        data
      );

      return response.data.data!;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw createValidationError(
          error.issues[0]?.message || 'Validation error',
          error.issues[0]?.path.join('.'),
          error.issues.reduce((acc: Record<string, string[]>, err: z.ZodIssue) => {
            const path = err.path.join('.');
            if (!acc[path]) acc[path] = [];
            acc[path].push(err.message);
            return acc;
          }, {} as Record<string, string[]>),
          error
        );
      }
      throw createApiError(error, 'Failed to create inventory item');
    }
  }

  /**
   * Update inventory item
   */
  async updateInventoryItem(id: string, data: UpdateInventoryItemRequest): Promise<InventoryItem> {
    try {
      if (!id) throw new Error('Inventory item ID is required');

      const response = await this.client.put<ApiResponse<InventoryItem>>(
        `${this.baseEndpoint}/${id}`,
        data
      );

      return response.data.data!;
    } catch (error) {
      throw createApiError(error, 'Failed to update inventory item');
    }
  }

  /**
   * Delete inventory item (soft delete)
   */
  async deleteInventoryItem(id: string): Promise<void> {
    try {
      if (!id) throw new Error('Inventory item ID is required');

      await this.client.delete(`${this.baseEndpoint}/${id}`);
    } catch (error) {
      throw createApiError(error, 'Failed to delete inventory item');
    }
  }

  /**
   * Search inventory items
   */
  async searchInventoryItems(query: string, limit: number = 20): Promise<InventoryItem[]> {
    try {
      if (!query) throw new Error('Search query is required');

      const response = await this.client.get<ApiResponse<{ items: InventoryItem[] }>>(
        `${this.baseEndpoint}/search?query=${encodeURIComponent(query)}&limit=${limit}`
      );

      return response.data.data!.items;
    } catch (error) {
      throw createApiError(error, 'Failed to search inventory items');
    }
  }

  /**
   * Get inventory categories
   */
  async getInventoryCategories(): Promise<string[]> {
    try {
      const response = await this.client.get<ApiResponse<{ categories: string[] }>>(
        `${this.baseEndpoint}/categories`
      );

      return response.data.data!.categories;
    } catch (error) {
      throw createApiError(error, 'Failed to fetch inventory categories');
    }
  }

  /**
   * Get inventory locations
   */
  async getInventoryLocations(): Promise<string[]> {
    try {
      const response = await this.client.get<ApiResponse<{ locations: string[] }>>(
        `${this.baseEndpoint}/locations`
      );

      return response.data.data!.locations;
    } catch (error) {
      throw createApiError(error, 'Failed to fetch inventory locations');
    }
  }

  /**
   * Bulk update inventory items
   */
  async bulkUpdateInventoryItems(
    items: Array<{ id: string; data: UpdateInventoryItemRequest }>
  ): Promise<{
    updated: number;
    failed: number;
    errors: Array<{ id: string; error: string }>;
  }> {
    try {
      if (!items.length) throw new Error('At least one item is required');

      const response = await this.client.post<ApiResponse<{
        updated: number;
        failed: number;
        errors: Array<{ id: string; error: string }>;
      }>>(
        `${this.baseEndpoint}/bulk-update`,
        { items }
      );

      return response.data.data!;
    } catch (error) {
      throw createApiError(error, 'Failed to bulk update inventory items');
    }
  }

  /**
   * Get item usage summary
   */
  async getItemUsageSummary(id: string, days: number = 30): Promise<{
    totalUsage: number;
    averageDailyUsage: number;
    lastUsageDate?: string;
    usageHistory: Array<{ date: string; quantity: number }>;
  }> {
    try {
      if (!id) throw new Error('Inventory item ID is required');

      const response = await this.client.get<ApiResponse<{
        totalUsage: number;
        averageDailyUsage: number;
        lastUsageDate?: string;
        usageHistory: Array<{ date: string; quantity: number }>;
      }>>(
        `${this.baseEndpoint}/${id}/usage-summary?days=${days}`
      );

      return response.data.data!;
    } catch (error) {
      throw createApiError(error, 'Failed to fetch item usage summary');
    }
  }

  /**
   * Get item financial summary
   */
  async getItemFinancialSummary(id: string): Promise<{
    totalValue: number;
    averageCost: number;
    lastPurchasePrice?: number;
    lastPurchaseDate?: string;
    totalSpent: number;
    roi: number;
  }> {
    try {
      if (!id) throw new Error('Inventory item ID is required');

      const response = await this.client.get<ApiResponse<{
        totalValue: number;
        averageCost: number;
        lastPurchasePrice?: number;
        lastPurchaseDate?: string;
        totalSpent: number;
        roi: number;
      }>>(
        `${this.baseEndpoint}/${id}/financial-summary`
      );

      return response.data.data!;
    } catch (error) {
      throw createApiError(error, 'Failed to fetch item financial summary');
    }
  }
}
