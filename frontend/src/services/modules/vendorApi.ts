/**
 * WF-COMP-293 | vendorApi.ts - React component or utility module
 * Purpose: react component or utility module
 * Upstream: ../config/apiConfig, ../utils/apiUtils, ../../types/vendors | Dependencies: ../config/apiConfig, ../utils/apiUtils, zod
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: default export, constants, classes | Key Features: Standard module
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */

/**
 * Vendor API Client
 * Handles all vendor-related API operations including CRUD, performance metrics,
 * vendor comparisons, and rating management
 */

import type { ApiClient } from '@/services/core/ApiClient';
import { ApiResponse } from '../utils/apiUtils';
import { z } from 'zod';
import {
  Vendor,
  VendorFilters,
  CreateVendorData,
  UpdateVendorData,
  VendorsResponse,
  VendorDetailResponse,
  VendorPerformanceMetrics,
  VendorComparison,
  VendorComparisonResponse,
  VendorStatistics,
  VendorSearchResponse,
  TopVendorsResponse,
  VendorMetrics,
  BulkVendorRatingUpdate,
  BulkVendorRatingResult,
} from '../../types/vendors';

// =====================
// VALIDATION SCHEMAS
// =====================

const createVendorSchema = z.object({
  name: z.string().min(2, 'Vendor name must be at least 2 characters').max(200),
  contactName: z.string().optional(),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  phone: z.string().optional(),
  address: z.string().optional(),
  website: z.string().url('Invalid website URL').optional().or(z.literal('')),
  taxId: z.string().optional(),
  paymentTerms: z.string().optional(),
  notes: z.string().optional(),
  rating: z.number().min(1).max(5).optional(),
});

const updateVendorSchema = z.object({
  name: z.string().min(2).max(200).optional(),
  contactName: z.string().optional(),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  phone: z.string().optional(),
  address: z.string().optional(),
  website: z.string().url('Invalid website URL').optional().or(z.literal('')),
  taxId: z.string().optional(),
  paymentTerms: z.string().optional(),
  notes: z.string().optional(),
  rating: z.number().min(1).max(5).optional(),
  isActive: z.boolean().optional(),
});

const updateRatingSchema = z.object({
  rating: z.number().min(1, 'Rating must be between 1 and 5').max(5, 'Rating must be between 1 and 5'),
});

// =====================
// VENDOR API CLASS
// =====================

export class VendorApi {
  private client: ApiClient;

  constructor(client: ApiClient) {
    this.client = client;
  }

  private readonly baseUrl = '/api/vendors';

  /**
   * Get all vendors with optional filtering and pagination
   */
  async getVendors(filters: VendorFilters = {}): Promise<VendorsResponse> {
    try {
      const queryString = new URLSearchParams();

      if (filters.page) queryString.append('page', String(filters.page));
      if (filters.limit) queryString.append('limit', String(filters.limit));
      if (filters.activeOnly !== undefined) queryString.append('activeOnly', String(filters.activeOnly));
      if (filters.rating) queryString.append('rating', String(filters.rating));
      if (filters.minRating) queryString.append('minRating', String(filters.minRating));
      if (filters.search) queryString.append('search', filters.search);

      const url = queryString.toString()
        ? `${this.baseUrl}?${queryString.toString()}`
        : this.baseUrl;

      const response = await this.client.get<ApiResponse<VendorsResponse>>(url);

      return response.data.data;
    } catch (error) {
      throw createApiError(error, 'Failed to fetch vendors');
    }
  }

  /**
   * Get vendor by ID with performance metrics
   */
  async getVendorById(id: string): Promise<VendorDetailResponse> {
    try {
      if (!id) throw new Error('Vendor ID is required');

      const response = await this.client.get<ApiResponse<VendorDetailResponse>>(
        `${this.baseUrl}/${id}`
      );

      return response.data.data;
    } catch (error) {
      throw createApiError(error, 'Failed to fetch vendor');
    }
  }

  /**
   * Create new vendor
   */
  async createVendor(vendorData: CreateVendorData): Promise<Vendor> {
    try {
      // Validate data
      createVendorSchema.parse(vendorData);

      const response = await this.client.post<ApiResponse<{ vendor: Vendor }>>(
        this.baseUrl,
        vendorData
      );

      return response.data.data.vendor;
    } catch (error) {
      if (error.name === 'ZodError') {
        throw new Error(`Validation error: ${error.errors[0].message}`);
      }
      throw createApiError(error, 'Failed to create vendor');
    }
  }

  /**
   * Update vendor information
   */
  async updateVendor(id: string, vendorData: UpdateVendorData): Promise<Vendor> {
    try {
      if (!id) throw new Error('Vendor ID is required');

      // Validate data
      updateVendorSchema.parse(vendorData);

      const response = await this.client.put<ApiResponse<{ vendor: Vendor }>>(
        `${this.baseUrl}/${id}`,
        vendorData
      );

      return response.data.data.vendor;
    } catch (error) {
      if (error.name === 'ZodError') {
        throw new Error(`Validation error: ${error.errors[0].message}`);
      }
      throw createApiError(error, 'Failed to update vendor');
    }
  }

  /**
   * Delete vendor (soft delete)
   */
  async deleteVendor(id: string): Promise<Vendor> {
    try {
      if (!id) throw new Error('Vendor ID is required');

      const response = await this.client.delete<ApiResponse<{ vendor: Vendor }>>(
        `${this.baseUrl}/${id}`
      );

      return response.data.data.vendor;
    } catch (error) {
      throw createApiError(error, 'Failed to delete vendor');
    }
  }

  /**
   * Reactivate a soft-deleted vendor
   */
  async reactivateVendor(id: string): Promise<Vendor> {
    try {
      if (!id) throw new Error('Vendor ID is required');

      const response = await this.client.post<ApiResponse<{ vendor: Vendor }>>(
        `${this.baseUrl}/${id}/reactivate`
      );

      return response.data.data.vendor;
    } catch (error) {
      throw createApiError(error, 'Failed to reactivate vendor');
    }
  }

  /**
   * Search vendors by name, contact, or email
   */
  async searchVendors(query: string, limit: number = 20, activeOnly: boolean = true): Promise<Vendor[]> {
    try {
      if (!query || query.trim().length === 0) {
        throw new Error('Search query is required');
      }

      const response = await this.client.get<ApiResponse<VendorSearchResponse>>(
        `${this.baseUrl}/search/${encodeURIComponent(query)}?limit=${limit}&activeOnly=${activeOnly}`
      );

      return response.data.data.vendors;
    } catch (error) {
      throw createApiError(error, 'Failed to search vendors');
    }
  }

  /**
   * Compare vendors for a specific inventory item
   */
  async compareVendors(itemName: string): Promise<VendorComparison[]> {
    try {
      if (!itemName || itemName.trim().length === 0) {
        throw new Error('Item name is required');
      }

      const response = await this.client.get<ApiResponse<VendorComparisonResponse>>(
        `${this.baseUrl}/compare/${encodeURIComponent(itemName)}`
      );

      return response.data.data.comparison;
    } catch (error) {
      throw createApiError(error, 'Failed to compare vendors');
    }
  }

  /**
   * Get top performing vendors
   */
  async getTopVendors(limit: number = 10): Promise<VendorMetrics[]> {
    try {
      const response = await this.client.get<ApiResponse<TopVendorsResponse>>(
        `${this.baseUrl}/top?limit=${limit}`
      );

      // Backend returns array directly, handle both formats
      if (Array.isArray(response.data.data)) {
        return response.data.data;
      }

      // If it comes wrapped in vendors property
      return (response.data.data as any).vendors || [];
    } catch (error) {
      throw createApiError(error, 'Failed to fetch top vendors');
    }
  }

  /**
   * Get vendor statistics
   */
  async getVendorStatistics(): Promise<VendorStatistics> {
    try {
      const response = await this.client.get<ApiResponse<VendorStatistics>>(
        `${this.baseUrl}/statistics`
      );

      return response.data.data;
    } catch (error) {
      throw createApiError(error, 'Failed to fetch statistics');
    }
  }

  /**
   * Update vendor rating
   */
  async updateVendorRating(vendorId: string, rating: number): Promise<Vendor> {
    try {
      if (!vendorId) throw new Error('Vendor ID is required');

      // Validate rating
      updateRatingSchema.parse({ rating });

      const response = await this.client.put<ApiResponse<{ vendor: Vendor }>>(
        `${this.baseUrl}/${vendorId}/rating`,
        { rating }
      );

      return response.data.data.vendor;
    } catch (error) {
      if (error.name === 'ZodError') {
        throw new Error(`Validation error: ${error.errors[0].message}`);
      }
      throw createApiError(error, 'Failed to update vendor rating');
    }
  }

  /**
   * Bulk update vendor ratings
   */
  async bulkUpdateRatings(updates: BulkVendorRatingUpdate[]): Promise<BulkVendorRatingResult> {
    try {
      if (!updates || updates.length === 0) {
        throw new Error('No updates provided');
      }

      // Validate all ratings
      updates.forEach((update, index) => {
        if (update.rating < 1 || update.rating > 5) {
          throw new Error(`Invalid rating at index ${index}: must be between 1 and 5`);
        }
      });

      const response = await this.client.post<ApiResponse<BulkVendorRatingResult>>(
        `${this.baseUrl}/ratings/bulk`,
        { updates }
      );

      return response.data.data;
    } catch (error) {
      throw createApiError(error, 'Failed to bulk update ratings');
    }
  }

  /**
   * Get vendors by payment terms
   */
  async getVendorsByPaymentTerms(paymentTerms: string): Promise<Vendor[]> {
    try {
      if (!paymentTerms || paymentTerms.trim().length === 0) {
        throw new Error('Payment terms are required');
      }

      const response = await this.client.get<ApiResponse<VendorSearchResponse>>(
        `${this.baseUrl}/payment-terms/${encodeURIComponent(paymentTerms)}`
      );

      return response.data.data.vendors;
    } catch (error) {
      throw createApiError(error, 'Failed to fetch vendors by payment terms');
    }
  }

  /**
   * Calculate vendor performance metrics
   */
  async getVendorMetrics(vendorId: string): Promise<VendorPerformanceMetrics> {
    try {
      if (!vendorId) throw new Error('Vendor ID is required');

      const response = await this.client.get<ApiResponse<{ metrics: VendorPerformanceMetrics }>>(
        `${this.baseUrl}/${vendorId}/metrics`
      );

      return response.data.data.metrics;
    } catch (error) {
      throw createApiError(error, 'Failed to fetch vendor metrics');
    }
  }

  /**
   * Permanently delete vendor (hard delete)
   * Should only be used when vendor has no associated records
   */
  async permanentlyDeleteVendor(id: string): Promise<{ success: boolean }> {
    try {
      if (!id) throw new Error('Vendor ID is required');

      const response = await this.client.delete<ApiResponse<{ success: boolean }>>(
        `${this.baseUrl}/${id}/permanent`
      );

      return response.data.data;
    } catch (error) {
      throw createApiError(error, 'Failed to permanently delete vendor');
    }
  }
}

// Export singleton instance

// Export default for convenience
export default vendorApi;

// Factory function for creating VendorApi instances
export function createVendorApi(client: ApiClient): VendorApi {
  return new VendorApi(client);
}
